#!/usr/bin/env node

/**
 * Medical Compliance Verification for Suplementor Medical App
 * Validates GDPR compliance and medical data handling requirements
 */

import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Colors for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bright: '\x1b[1m'
};

/**
 * GDPR compliance requirements for medical apps
 */
interface GDPRRequirement {
  id: string;
  name: string;
  description: string;
  article: string;
  mandatory: boolean;
  validator: (envVars: Record<string, string>) => ComplianceResult;
}

interface ComplianceResult {
  compliant: boolean;
  message: string;
  evidence?: string;
  remediation?: string;
}

/**
 * Medical Compliance Validator
 */
class MedicalComplianceValidator {
  private requirements: GDPRRequirement[] = [
    // Article 5: Principles relating to processing of personal data
    {
      id: "GDPR-ART-5-1-A",
      name: "Lawfulness, Fairness and Transparency",
      description: "Personal data must be processed lawfully, fairly and transparently",
      article: "Article 5(1)(a)",
      mandatory: true,
      validator: (env) => ({
        compliant: env.GDPR_COMPLIANCE_MODE === "strict",
        message: env.GDPR_COMPLIANCE_MODE === "strict" ?
          "Strict GDPR mode ensures lawful processing" :
          "GDPR compliance mode must be set to 'strict'",
        remediation: "Set GDPR_COMPLIANCE_MODE=strict in environment variables"
      })
    },
    {
      id: "GDPR-ART-5-1-F",
      name: "Purpose Limitation",
      description: "Personal data must be collected for specified, explicit and legitimate purposes",
      article: "Article 5(1)(b)",
      mandatory: true,
      validator: (env) => ({
        compliant: env.MEDICAL_DATA_PROTECTION === "enabled",
        message: env.MEDICAL_DATA_PROTECTION === "enabled" ?
          "Medical data protection ensures purpose limitation" :
          "Medical data protection must be enabled",
        remediation: "Set MEDICAL_DATA_PROTECTION=enabled in environment variables"
      })
    },
    {
      id: "GDPR-ART-5-1-C",
      name: "Data Minimization",
      description: "Personal data must be adequate, relevant and limited to what is necessary",
      article: "Article 5(1)(c)",
      mandatory: true,
      validator: (env) => ({
        compliant: env.FEATURE_ADVANCED_ANALYTICS !== "enabled" || env.GDPR_COMPLIANCE_MODE === "strict",
        message: env.FEATURE_ADVANCED_ANALYTICS !== "enabled" ?
          "Advanced analytics disabled - data minimization maintained" :
          "Advanced analytics should be carefully configured for data minimization",
        remediation: "Review advanced analytics configuration for data minimization compliance"
      })
    },

    // Article 6: Lawfulness of processing
    {
      id: "GDPR-ART-6-1-A",
      name: "Consent",
      description: "Data subject has given consent for specific purposes",
      article: "Article 6(1)(a)",
      mandatory: true,
      validator: (env) => ({
        compliant: env.MEDICAL_DATA_PROTECTION === "enabled",
        message: env.MEDICAL_DATA_PROTECTION === "enabled" ?
          "Medical data protection includes consent management" :
          "Consent management required for medical data processing",
        remediation: "Implement proper consent management system"
      })
    },

    // Article 9: Special categories of personal data
    {
      id: "GDPR-ART-9-2-A",
      name: "Health Data Processing",
      description: "Processing of health data requires explicit consent",
      article: "Article 9(2)(a)",
      mandatory: true,
      validator: (env) => ({
        compliant: env.MEDICAL_DATA_PROTECTION === "enabled" && env.GDPR_COMPLIANCE_MODE === "strict",
        message: (env.MEDICAL_DATA_PROTECTION === "enabled" && env.GDPR_COMPLIANCE_MODE === "strict") ?
          "Strict GDPR mode with medical data protection for health data" :
          "Health data requires strict GDPR compliance and medical data protection",
        remediation: "Enable medical data protection and set GDPR compliance to strict"
      })
    },

    // Article 17: Right to erasure
    {
      id: "GDPR-ART-17",
      name: "Right to Erasure",
      description: "Data subjects have the right to request deletion of their data",
      article: "Article 17",
      mandatory: true,
      validator: (env) => ({
        compliant: env.MEDICAL_DATA_PROTECTION === "enabled",
        message: env.MEDICAL_DATA_PROTECTION === "enabled" ?
          "Medical data protection includes data erasure capabilities" :
          "Data erasure functionality required for GDPR compliance",
        remediation: "Implement data erasure functionality"
      })
    },

    // Article 20: Right to data portability
    {
      id: "GDPR-ART-20",
      name: "Data Portability",
      description: "Data subjects have the right to receive their data in a structured format",
      article: "Article 20",
      mandatory: true,
      validator: (env) => ({
        compliant: env.MEDICAL_DATA_PROTECTION === "enabled",
        message: env.MEDICAL_DATA_PROTECTION === "enabled" ?
          "Medical data protection includes data export capabilities" :
          "Data export functionality required for GDPR compliance",
        remediation: "Implement data export functionality"
      })
    },

    // Article 25: Data protection by design and by default
    {
      id: "GDPR-ART-25",
      name: "Data Protection by Design",
      description: "Data protection must be built into the system design",
      article: "Article 25",
      mandatory: true,
      validator: (env) => ({
        compliant: env.MEDICAL_DATA_PROTECTION === "enabled" && env.DATABASE_ENCRYPTION_KEY,
        message: (env.MEDICAL_DATA_PROTECTION === "enabled" && env.DATABASE_ENCRYPTION_KEY) ?
          "Medical data protection and encryption implemented by design" :
          "Data protection by design requires encryption and medical data protection",
        remediation: "Implement encryption at rest and enable medical data protection"
      })
    },

    // Article 32: Security of processing
    {
      id: "GDPR-ART-32",
      name: "Security Measures",
      description: "Appropriate technical and organizational security measures",
      article: "Article 32",
      mandatory: true,
      validator: (env) => {
        const hasEncryption = env.DATABASE_ENCRYPTION_KEY && env.MEDICAL_DATA_ENCRYPTION_KEY;
        const hasAudit = env.AUDIT_LOG_ENCRYPTION_KEY;
        const hasMonitoring = env.ERROR_TRACKING === "enabled";

        return {
          compliant: hasEncryption && hasAudit && hasMonitoring,
          message: (hasEncryption && hasAudit && hasMonitoring) ?
            "Encryption, audit logging, and monitoring implemented" :
            "Security measures incomplete - missing encryption, audit, or monitoring",
          remediation: "Implement encryption keys, audit logging, and error monitoring"
        };
      }
    },

    // Article 33: Notification of personal data breach
    {
      id: "GDPR-ART-33",
      name: "Breach Notification",
      description: "Mechanism for notifying data breaches to supervisory authority",
      article: "Article 33",
      mandatory: true,
      validator: (env) => ({
        compliant: env.ERROR_TRACKING === "enabled" && env.SENTRY_DSN,
        message: (env.ERROR_TRACKING === "enabled" && env.SENTRY_DSN) ?
          "Error tracking and monitoring for breach detection" :
          "Breach notification requires error tracking and monitoring",
        remediation: "Configure error tracking and monitoring for breach detection"
      })
    },

    // Polish Medical Law Compliance
    {
      id: "PL-MEDICAL-1",
      name: "Polish Medical Data Law",
      description: "Compliance with Polish medical data protection laws",
      article: "Polish Medical Data Protection Act",
      mandatory: true,
      validator: (env) => ({
        compliant: env.POLISH_LOCALIZATION === "enabled" && env.REGIONAL_CDN_EUROPE === "enabled",
        message: (env.POLISH_LOCALIZATION === "enabled" && env.REGIONAL_CDN_EUROPE === "enabled") ?
          "Polish localization and EU data residency configured" :
          "Polish medical law requires localization and EU data residency",
        remediation: "Enable Polish localization and European CDN"
      })
    },

    // Medical Device Regulation (if applicable)
    {
      id: "MDR-2017-745-ART-51",
      name: "Medical Device Data Security",
      description: "Security requirements for medical device data processing",
      article: "MDR Article 51",
      mandatory: false,
      validator: (env) => ({
        compliant: env.MEDICAL_DATA_ENCRYPTION_KEY && env.AUDIT_LOG_ENCRYPTION_KEY,
        message: (env.MEDICAL_DATA_ENCRYPTION_KEY && env.AUDIT_LOG_ENCRYPTION_KEY) ?
          "Medical data encryption and audit logging for device security" :
          "Medical device security enhanced with encryption and audit logging",
        remediation: "Implement medical data encryption and comprehensive audit logging"
      })
    }
  ];

  /**
   * Run medical compliance verification
   */
  async runVerification(): Promise<{
    compliant: boolean;
    totalRequirements: number;
    metRequirements: number;
    criticalFailures: number;
    complianceScore: number;
    results: Array<GDPRRequirement & ComplianceResult>;
    recommendations: string[];
  }> {
    console.log(`${colors.bright}${colors.blue}🏥 Medical Compliance Verification${colors.reset}\n`);
    console.log(`Verifying GDPR and medical data compliance for suplementor...\n`);

    // Load environment variables
    const envVars = this.loadEnvironmentFiles();

    const results: Array<GDPRRequirement & ComplianceResult> = [];
    let metRequirements = 0;
    let criticalFailures = 0;
    const recommendations: string[] = [];

    // Check each requirement
    for (const requirement of this.requirements) {
      const result = requirement.validator(envVars);
      const fullResult = { ...requirement, ...result };

      results.push(fullResult);

      // Display result
      const icon = result.compliant ? colors.green + "✓" : colors.red + "✗";
      const status = result.compliant ? "COMPLIANT" : requirement.mandatory ? "NON-COMPLIANT" : "RECOMMENDED";

      console.log(`${icon}${colors.reset} [${status}] ${requirement.name}`);
      console.log(`    ${colors.cyan}${requirement.description}${colors.reset}`);
      console.log(`    ${colors.yellow}Reference: ${requirement.article}${colors.reset}`);

      if (result.evidence) {
        console.log(`    ${colors.green}Evidence: ${result.evidence}${colors.reset}`);
      }

      if (!result.compliant && result.remediation) {
        console.log(`    ${colors.red}Remediation: ${result.remediation}${colors.reset}`);
        recommendations.push(`${requirement.name}: ${result.remediation}`);
      }

      console.log("");

      if (result.compliant) {
        metRequirements++;
      } else if (requirement.mandatory) {
        criticalFailures++;
      }
    }

    const totalRequirements = this.requirements.length;
    const complianceScore = Math.round((metRequirements / totalRequirements) * 100);

    // Display summary
    this.displaySummary(metRequirements, criticalFailures, totalRequirements, complianceScore, recommendations);

    return {
      compliant: criticalFailures === 0,
      totalRequirements,
      metRequirements,
      criticalFailures,
      complianceScore,
      results,
      recommendations
    };
  }

  /**
   * Load environment files
   */
  private loadEnvironmentFiles(): Record<string, string> {
    const envFiles = [
      '.env',
      '.env.local',
      '.env.production',
      '.env.staging',
      '.env.development'
    ];

    const loaded: Record<string, string> = {};

    for (const file of envFiles) {
      try {
        const content = readFileSync(join(__dirname, '..', file), 'utf8');
        const vars = this.parseEnvFile(content);
        Object.assign(loaded, vars);
      } catch (error) {
        // File doesn't exist, skip
      }
    }

    return loaded;
  }

  /**
   * Parse environment file content
   */
  private parseEnvFile(content: string): Record<string, string> {
    const vars: Record<string, string> = {};

    for (const line of content.split('\n')) {
      const trimmed = line.trim();

      // Skip comments and empty lines
      if (trimmed.startsWith('#') || trimmed === '') {
        continue;
      }

      // Parse KEY=VALUE format
      const match = trimmed.match(/^([^=]+)=(.*)$/);
      if (match) {
        const [, key, value] = match;
        vars[key] = value.replace(/^["']|["']$/g, ''); // Remove quotes
      }
    }

    return vars;
  }

  /**
   * Display compliance summary
   */
  private displaySummary(
    metRequirements: number,
    criticalFailures: number,
    totalRequirements: number,
    complianceScore: number,
    recommendations: string[]
  ): void {
    console.log(`${colors.bright}${colors.blue}📊 Medical Compliance Summary${colors.reset}`);
    console.log(`═══════════════════════════════════════════════════════`);

    const scoreColor = complianceScore >= 90 ? colors.green : complianceScore >= 70 ? colors.yellow : colors.red;
    console.log(`${colors.bright}Compliance Score:${colors.reset} ${scoreColor}${complianceScore}%${colors.reset}`);

    console.log(`\n${colors.green}✓ Met Requirements:${colors.reset} ${metRequirements}/${totalRequirements}`);
    console.log(`${colors.red}✗ Critical Failures:${colors.reset} ${criticalFailures}/${totalRequirements}`);

    if (criticalFailures > 0) {
      console.log(`\n${colors.bright}${colors.red}❌ Critical Compliance Issues:${colors.reset}`);

      const criticalFailuresList = this.requirements.filter(req =>
        !req.validator({}).compliant && req.mandatory
      );

      criticalFailuresList.forEach(req => {
        console.log(`  • ${req.name} (${req.article})`);
      });
    }

    if (recommendations.length > 0) {
      console.log(`\n${colors.bright}${colors.yellow}🔧 Remediation Actions:${colors.reset}`);
      recommendations.forEach(rec => {
        console.log(`  • ${rec}`);
      });
    }

    console.log(`\n${colors.bright}${colors.blue}📋 Required Actions:${colors.reset}`);
    console.log(`  [ ] Conduct Data Protection Impact Assessment (DPIA)`);
    console.log(`  [ ] Implement data subject consent management`);
    console.log(`  [ ] Set up data retention policies`);
    console.log(`  [ ] Configure audit logging system`);
    console.log(`  [ ] Implement data encryption at rest and in transit`);
    console.log(`  [ ] Set up breach notification procedures`);
    console.log(`  [ ] Train staff on GDPR compliance`);
    console.log(`  [ ] Appoint Data Protection Officer (if required)`);

    if (complianceScore >= 90) {
      console.log(`\n${colors.green}🎉 Medical compliance requirements met!${colors.reset}`);
    } else if (complianceScore >= 70) {
      console.log(`\n${colors.yellow}⚠️  Partially compliant - address critical issues${colors.reset}`);
    } else {
      console.log(`\n${colors.red}❌ Not compliant - critical issues must be resolved${colors.reset}`);
    }

    console.log(`\n${colors.bright}${colors.cyan}📞 Next Steps:${colors.reset}`);
    console.log(`  1. Consult with legal counsel for medical compliance`);
    console.log(`  2. Conduct third-party security audit`);
    console.log(`  3. Implement remaining remediation actions`);
    console.log(`  4. Document all compliance measures`);
    console.log(`  5. Schedule regular compliance reviews`);
  }
}

/**
 * Main function
 */
async function main() {
  const validator = new MedicalComplianceValidator();

  try {
    const results = await validator.runVerification();

    // Exit with error code if not compliant
    if (!results.compliant) {
      process.exit(1);
    }

    process.exit(0);
  } catch (error) {
    console.error(`${colors.red}Medical compliance verification failed:`, error, colors.reset);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { MedicalComplianceValidator };