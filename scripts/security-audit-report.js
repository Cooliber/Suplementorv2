#!/usr/bin/env node

/**
 * Security Audit Report Generator for Suplementor Medical App
 * Generates comprehensive security audit reports for compliance
 */

import { readFileSync, writeFileSync } from "fs";
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
 * Security audit categories
 */
interface SecurityAuditCategory {
  name: string;
  weight: number;
  checks: SecurityCheck[];
}

interface SecurityCheck {
  id: string;
  name: string;
  description: string;
  severity: "critical" | "high" | "medium" | "low";
  validator: (envVars: Record<string, string>) => CheckResult;
}

interface CheckResult {
  passed: boolean;
  score: number;
  message: string;
  details?: string;
  remediation?: string;
}

/**
 * Security Audit Generator
 */
class SecurityAuditGenerator {
  private categories: SecurityAuditCategory[] = [
    {
      name: "Authentication & Authorization",
      weight: 25,
      checks: [
        {
          id: "AUTH-001",
          name: "NextAuth Secret Strength",
          description: "NextAuth secret must be cryptographically strong",
          severity: "critical",
          validator: (env) => {
            const secret = env.NEXTAUTH_SECRET;
            if (!secret) return { passed: false, score: 0, message: "NextAuth secret missing" };

            const length = secret.length >= 32;
            const notDefault = !secret.includes("development") && !secret.includes("staging");
            const entropy = this.calculateEntropy(secret);

            if (length && notDefault && entropy > 3.5) {
              return { passed: true, score: 100, message: "Strong NextAuth secret configured" };
            }

            return {
              passed: false,
              score: length && notDefault ? 50 : 0,
              message: "NextAuth secret is weak or uses default values",
              remediation: "Generate a cryptographically secure secret (32+ characters)"
            };
          }
        },
        {
          id: "AUTH-002",
          name: "OAuth Configuration",
          description: "OAuth providers should be properly configured",
          severity: "medium",
          validator: (env) => {
            const hasGoogle = env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET;
            return {
              passed: true, // Optional for basic functionality
              score: hasGoogle ? 100 : 70,
              message: hasGoogle ? "OAuth providers configured" : "OAuth providers not configured (optional)"
            };
          }
        }
      ]
    },
    {
      name: "Data Encryption",
      weight: 30,
      checks: [
        {
          id: "ENC-001",
          name: "Database Encryption",
          description: "Database must be encrypted at rest",
          severity: "critical",
          validator: (env) => {
            const hasKey = env.DATABASE_ENCRYPTION_KEY && env.DATABASE_ENCRYPTION_KEY.length >= 32;
            return {
              passed: hasKey,
              score: hasKey ? 100 : 0,
              message: hasKey ? "Database encryption configured" : "Database encryption key missing",
              remediation: "Generate and configure DATABASE_ENCRYPTION_KEY (32+ hex characters)"
            };
          }
        },
        {
          id: "ENC-002",
          name: "Medical Data Encryption",
          description: "Medical data must be encrypted with strong keys",
          severity: "critical",
          validator: (env) => {
            const hasKey = env.MEDICAL_DATA_ENCRYPTION_KEY && env.MEDICAL_DATA_ENCRYPTION_KEY.length >= 32;
            return {
              passed: hasKey,
              score: hasKey ? 100 : 0,
              message: hasKey ? "Medical data encryption configured" : "Medical data encryption key missing",
              remediation: "Generate and configure MEDICAL_DATA_ENCRYPTION_KEY (32+ hex characters)"
            };
          }
        },
        {
          id: "ENC-003",
          name: "Audit Log Encryption",
          description: "Audit logs must be encrypted",
          severity: "high",
          validator: (env) => {
            const hasKey = env.AUDIT_LOG_ENCRYPTION_KEY && env.AUDIT_LOG_ENCRYPTION_KEY.length >= 32;
            return {
              passed: hasKey,
              score: hasKey ? 100 : 0,
              message: hasKey ? "Audit log encryption configured" : "Audit log encryption key missing",
              remediation: "Generate and configure AUDIT_LOG_ENCRYPTION_KEY (32+ hex characters)"
            };
          }
        }
      ]
    },
    {
      name: "Access Control & Audit",
      weight: 20,
      checks: [
        {
          id: "AC-001",
          name: "Medical Data Protection",
          description: "Medical data protection must be enabled",
          severity: "critical",
          validator: (env) => ({
            passed: env.MEDICAL_DATA_PROTECTION === "enabled",
            score: env.MEDICAL_DATA_PROTECTION === "enabled" ? 100 : 0,
            message: env.MEDICAL_DATA_PROTECTION === "enabled" ?
              "Medical data protection enabled" :
              "Medical data protection must be enabled",
            remediation: "Set MEDICAL_DATA_PROTECTION=enabled"
          })
        },
        {
          id: "AC-002",
          name: "Error Tracking",
          description: "Error tracking for security monitoring",
          severity: "high",
          validator: (env) => ({
            passed: env.ERROR_TRACKING === "enabled",
            score: env.ERROR_TRACKING === "enabled" ? 100 : 50,
            message: env.ERROR_TRACKING === "enabled" ?
              "Error tracking enabled for security monitoring" :
              "Error tracking disabled (recommended for security)",
            remediation: "Set ERROR_TRACKING=enabled"
          })
        }
      ]
    },
    {
      name: "Network & Transport Security",
      weight: 15,
      checks: [
        {
          id: "NET-001",
          name: "HTTPS Enforcement",
          description: "Application must use HTTPS in production",
          severity: "critical",
          validator: (env) => {
            const isProduction = env.NODE_ENV === "production";
            const usesHttps = env.NEXTAUTH_URL && env.NEXTAUTH_URL.startsWith("https://");

            return {
              passed: !isProduction || usesHttps,
              score: !isProduction ? 100 : usesHttps ? 100 : 0,
              message: !isProduction ?
                "Development environment - HTTPS not required" :
                usesHttps ? "HTTPS properly configured" : "HTTPS required for production",
              remediation: "Configure NEXTAUTH_URL with HTTPS for production"
            };
          }
        },
        {
          id: "NET-002",
          name: "European Data Residency",
          description: "European data residency for GDPR compliance",
          severity: "medium",
          validator: (env) => ({
            passed: env.REGIONAL_CDN_EUROPE === "enabled",
            score: env.REGIONAL_CDN_EUROPE === "enabled" ? 100 : 70,
            message: env.REGIONAL_CDN_EUROPE === "enabled" ?
              "European CDN configured for GDPR compliance" :
              "European CDN not configured (recommended for GDPR)",
            remediation: "Set REGIONAL_CDN_EUROPE=enabled"
          })
        }
      ]
    },
    {
      name: "Payment Security",
      weight: 10,
      checks: [
        {
          id: "PAY-001",
          name: "Stripe Configuration",
          description: "Payment processing security",
          severity: "high",
          validator: (env) => {
            const hasSecret = env.STRIPE_SECRET_KEY && env.STRIPE_SECRET_KEY.startsWith("sk_");
            const hasPublishable = env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY && env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.startsWith("pk_");
            const hasWebhook = env.STRIPE_WEBHOOK_SECRET && env.STRIPE_WEBHOOK_SECRET.startsWith("whsec_");

            return {
              passed: hasSecret && hasPublishable && hasWebhook,
              score: (hasSecret && hasPublishable && hasWebhook) ? 100 : 0,
              message: (hasSecret && hasPublishable && hasWebhook) ?
                "Complete Stripe security configuration" :
                "Stripe security configuration incomplete",
              remediation: "Configure all Stripe keys with proper formats"
            };
          }
        }
      ]
    }
  ];

  /**
   * Generate comprehensive security audit report
   */
  async generateReport(): Promise<{
    reportId: string;
    timestamp: string;
    overallScore: number;
    riskLevel: string;
    categories: Array<{
      name: string;
      score: number;
      weight: number;
      weightedScore: number;
      checks: Array<SecurityCheck & CheckResult>;
    }>;
    summary: {
      criticalIssues: number;
      highIssues: number;
      mediumIssues: number;
      lowIssues: number;
    };
    recommendations: string[];
  }> {
    console.log(`${colors.bright}${colors.blue}🔒 Security Audit Report Generation${colors.reset}\n`);
    console.log(`Generating comprehensive security audit for suplementor...\n`);

    // Load environment variables
    const envVars = this.loadEnvironmentFiles();

    const reportId = this.generateReportId();
    const timestamp = new Date().toISOString();

    console.log(`${colors.cyan}Report ID:${colors.reset} ${reportId}`);
    console.log(`${colors.cyan}Timestamp:${colors.reset} ${timestamp}\n`);

    const categoryResults = [];
    let totalWeightedScore = 0;
    const summary = {
      criticalIssues: 0,
      highIssues: 0,
      mediumIssues: 0,
      lowIssues: 0
    };
    const recommendations: string[] = [];

    // Process each category
    for (const category of this.categories) {
      console.log(`${colors.bright}${colors.blue}${category.name}${colors.reset}`);
      console.log(`${"─".repeat(category.name.length)}`);

      const checkResults = [];
      let categoryScore = 0;

      for (const check of category.checks) {
        const result = check.validator(envVars);
        const fullResult = { ...check, ...result };

        checkResults.push(fullResult);

        // Display check result
        const icon = result.passed ? colors.green + "✓" : colors.red + "✗";
        const severityColor = this.getSeverityColor(check.severity);

        console.log(`${icon}${colors.reset} [${severityColor}${check.severity.toUpperCase()}${colors.reset}] ${check.name}`);
        console.log(`    ${colors.cyan}${check.description}${colors.reset}`);

        if (result.details) {
          console.log(`    ${colors.yellow}${result.details}${colors.reset}`);
        }

        if (!result.passed && result.remediation) {
          console.log(`    ${colors.red}Fix: ${result.remediation}${colors.reset}`);
          recommendations.push(`${check.name}: ${result.remediation}`);
        }

        console.log("");

        // Update summary counts
        if (!result.passed) {
          switch (check.severity) {
            case "critical": summary.criticalIssues++; break;
            case "high": summary.highIssues++; break;
            case "medium": summary.mediumIssues++; break;
            case "low": summary.lowIssues++; break;
          }
        }

        categoryScore += result.score;
      }

      // Calculate category score (average of all checks)
      const avgCategoryScore = category.checks.length > 0 ? categoryScore / category.checks.length : 0;
      const weightedScore = (avgCategoryScore * category.weight) / 100;
      totalWeightedScore += weightedScore;

      categoryResults.push({
        name: category.name,
        score: Math.round(avgCategoryScore),
        weight: category.weight,
        weightedScore: Math.round(weightedScore),
        checks: checkResults
      });
    }

    const overallScore = Math.round(totalWeightedScore);

    // Display summary
    this.displaySecuritySummary(overallScore, summary, recommendations);

    const report = {
      reportId,
      timestamp,
      overallScore,
      riskLevel: this.calculateRiskLevel(overallScore),
      categories: categoryResults,
      summary,
      recommendations
    };

    // Save report to file
    this.saveReport(report);

    return report;
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
   * Generate unique report ID
   */
  private generateReportId(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `SEC-AUDIT-${timestamp}-${random}`;
  }

  /**
   * Calculate password entropy
   */
  private calculateEntropy(str: string): number {
    const charSet = new Set(str.split(''));
    const possibleChars = Math.max(charSet.size, 10);
    return Math.log2(Math.pow(possibleChars, str.length));
  }

  /**
   * Get color for severity level
   */
  private getSeverityColor(severity: string): string {
    switch (severity) {
      case "critical": return colors.red;
      case "high": return colors.yellow;
      case "medium": return colors.blue;
      case "low": return colors.cyan;
      default: return colors.reset;
    }
  }

  /**
   * Calculate risk level from score
   */
  private calculateRiskLevel(score: number): string {
    if (score >= 90) return "LOW";
    if (score >= 70) return "MEDIUM";
    if (score >= 50) return "HIGH";
    return "CRITICAL";
  }

  /**
   * Display security summary
   */
  private displaySecuritySummary(
    overallScore: number,
    summary: { criticalIssues: number; highIssues: number; mediumIssues: number; lowIssues: number },
    recommendations: string[]
  ): void {
    console.log(`${colors.bright}${colors.blue}📊 Security Audit Summary${colors.reset}`);
    console.log(`═══════════════════════════════════════════════`);

    const riskColor = overallScore >= 90 ? colors.green :
                     overallScore >= 70 ? colors.yellow :
                     overallScore >= 50 ? colors.red : colors.magenta;

    console.log(`${colors.bright}Overall Security Score:${colors.reset} ${riskColor}${overallScore}%${colors.reset}`);
    console.log(`${colors.bright}Risk Level:${colors.reset} ${riskColor}${this.calculateRiskLevel(overallScore)}${colors.reset}`);

    console.log(`\n${colors.bright}Issues Found:${colors.reset}`);
    console.log(`${colors.red}Critical: ${summary.criticalIssues}${colors.reset}`);
    console.log(`${colors.yellow}High: ${summary.highIssues}${colors.reset}`);
    console.log(`${colors.blue}Medium: ${summary.mediumIssues}${colors.reset}`);
    console.log(`${colors.cyan}Low: ${summary.lowIssues}${colors.reset}`);

    if (summary.criticalIssues > 0 || summary.highIssues > 0) {
      console.log(`\n${colors.bright}${colors.red}🚨 Critical Security Issues:${colors.reset}`);

      this.categories.forEach(category => {
        category.checks.forEach(check => {
          if (!check.validator({}).passed && (check.severity === "critical" || check.severity === "high")) {
            console.log(`  • ${check.name} (${check.severity.toUpperCase()})`);
          }
        });
      });
    }

    if (recommendations.length > 0) {
      console.log(`\n${colors.bright}${colors.yellow}🔧 Security Recommendations:${colors.reset}`);
      recommendations.slice(0, 10).forEach(rec => {
        console.log(`  • ${rec}`);
      });

      if (recommendations.length > 10) {
        console.log(`  • ... and ${recommendations.length - 10} more recommendations`);
      }
    }

    console.log(`\n${colors.bright}${colors.green}✅ Security Best Practices:${colors.reset}`);
    console.log(`  • Use strong, unique encryption keys`);
    console.log(`  • Rotate keys regularly (90-day cycle)`);
    console.log(`  • Enable comprehensive audit logging`);
    console.log(`  • Use HTTPS for all communications`);
    console.log(`  • Implement proper error handling`);
    console.log(`  • Regular security assessments`);
    console.log(`  • Staff security training`);
    console.log(`  • Incident response planning`);
  }

  /**
   * Save report to file
   */
  private saveReport(report: any): void {
    const reportPath = join(__dirname, '..', 'security-audit-report.json');

    try {
      writeFileSync(reportPath, JSON.stringify(report, null, 2));
      console.log(`\n${colors.green}✓ Security audit report saved to: ${reportPath}${colors.reset}`);
    } catch (error) {
      console.log(`\n${colors.yellow}⚠ Could not save report to file: ${error.message}${colors.reset}`);
    }
  }
}

/**
 * Main function
 */
async function main() {
  const generator = new SecurityAuditGenerator();

  try {
    const report = await generator.generateReport();

    // Exit with error code if critical security issues found
    if (report.summary.criticalIssues > 0) {
      console.log(`\n${colors.red}❌ Security audit failed - critical issues must be resolved${colors.reset}`);
      process.exit(1);
    }

    if (report.overallScore < 70) {
      console.log(`\n${colors.yellow}⚠️ Security audit passed but score is below recommended threshold${colors.reset}`);
      process.exit(0);
    }

    console.log(`\n${colors.green}✅ Security audit completed successfully${colors.reset}`);
    process.exit(0);
  } catch (error) {
    console.error(`${colors.red}Security audit failed:`, error, colors.reset);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { SecurityAuditGenerator };