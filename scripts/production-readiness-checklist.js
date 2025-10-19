#!/usr/bin/env node

/**
 * Production Readiness Checklist for Suplementor Medical App
 * Comprehensive validation for production deployment
 */

import { readFileSync, existsSync } from "fs";
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
 * Production readiness checklist items
 */
interface ChecklistItem {
  category: string;
  name: string;
  description: string;
  validator: (envVars: Record<string, string>) => ChecklistResult;
  critical: boolean;
  gdpr?: boolean;
  medical?: boolean;
}

interface ChecklistResult {
  passed: boolean;
  message: string;
  details?: string;
}

/**
 * Production Readiness Checklist
 */
class ProductionReadinessChecker {
  private checklist: ChecklistItem[] = [
    // Environment Configuration
    {
      category: "Environment",
      name: "NODE_ENV Production",
      description: "NODE_ENV must be set to 'production'",
      critical: true,
      validator: (env) => ({
        passed: env.NODE_ENV === "production",
        message: env.NODE_ENV === "production" ? "✓ Production environment" : "✗ Not production environment"
      })
    },
    {
      category: "Environment",
      name: "NextAuth URL",
      description: "NextAuth URL must be production domain",
      critical: true,
      validator: (env) => ({
        passed: env.NEXTAUTH_URL && env.NEXTAUTH_URL.startsWith("https://") && !env.NEXTAUTH_URL.includes("localhost"),
        message: env.NEXTAUTH_URL && env.NEXTAUTH_URL.startsWith("https://") ?
          `✓ Production URL: ${env.NEXTAUTH_URL}` :
          "✗ NextAuth URL must use HTTPS and production domain"
      })
    },

    // Database Configuration
    {
      category: "Database",
      name: "Database URL",
      description: "Production database must be configured",
      critical: true,
      validator: (env) => ({
        passed: env.DATABASE_URL && env.DATABASE_URL.startsWith("postgresql://"),
        message: env.DATABASE_URL && env.DATABASE_URL.startsWith("postgresql://") ?
          "✓ PostgreSQL database configured" :
          "✗ PostgreSQL DATABASE_URL required for production"
      })
    },
    {
      category: "Database",
      name: "Database Encryption",
      description: "Database encryption must be enabled",
      critical: true,
      validator: (env) => ({
        passed: env.DATABASE_ENCRYPTION_KEY && env.DATABASE_ENCRYPTION_KEY.length >= 32,
        message: env.DATABASE_ENCRYPTION_KEY ?
          "✓ Database encryption enabled" :
          "✗ Database encryption key required"
      })
    },

    // Medical Compliance
    {
      category: "Medical Compliance",
      name: "GDPR Strict Mode",
      description: "GDPR compliance must be set to strict",
      critical: true,
      gdpr: true,
      validator: (env) => ({
        passed: env.GDPR_COMPLIANCE_MODE === "strict",
        message: env.GDPR_COMPLIANCE_MODE === "strict" ?
          "✓ GDPR strict compliance enabled" :
          "✗ GDPR must be set to strict mode for medical app"
      })
    },
    {
      category: "Medical Compliance",
      name: "Medical Data Protection",
      description: "Medical data protection must be enabled",
      critical: true,
      medical: true,
      validator: (env) => ({
        passed: env.MEDICAL_DATA_PROTECTION === "enabled",
        message: env.MEDICAL_DATA_PROTECTION === "enabled" ?
          "✓ Medical data protection enabled" :
          "✗ Medical data protection required for medical app"
      })
    },
    {
      category: "Medical Compliance",
      name: "Polish Localization",
      description: "Polish localization must be enabled",
      critical: true,
      validator: (env) => ({
        passed: env.POLISH_LOCALIZATION === "enabled",
        message: env.POLISH_LOCALIZATION === "enabled" ?
          "✓ Polish localization enabled" :
          "✗ Polish localization required for Polish market"
      })
    },

    // Security & Encryption
    {
      category: "Security",
      name: "Medical Data Encryption",
      description: "Medical data encryption key must be configured",
      critical: true,
      medical: true,
      validator: (env) => ({
        passed: env.MEDICAL_DATA_ENCRYPTION_KEY && env.MEDICAL_DATA_ENCRYPTION_KEY.length >= 32,
        message: env.MEDICAL_DATA_ENCRYPTION_KEY ?
          "✓ Medical data encryption configured" :
          "✗ Medical data encryption key required"
      })
    },
    {
      category: "Security",
      name: "Audit Log Encryption",
      description: "Audit log encryption must be configured",
      critical: true,
      gdpr: true,
      validator: (env) => ({
        passed: env.AUDIT_LOG_ENCRYPTION_KEY && env.AUDIT_LOG_ENCRYPTION_KEY.length >= 32,
        message: env.AUDIT_LOG_ENCRYPTION_KEY ?
          "✓ Audit log encryption configured" :
          "✗ Audit log encryption key required"
      })
    },
    {
      category: "Security",
      name: "Strong Auth Secret",
      description: "NextAuth secret must be strong",
      critical: true,
      validator: (env) => ({
        passed: env.NEXTAUTH_SECRET &&
                env.NEXTAUTH_SECRET.length >= 32 &&
                !env.NEXTAUTH_SECRET.includes("development") &&
                !env.NEXTAUTH_SECRET.includes("staging"),
        message: env.NEXTAUTH_SECRET && env.NEXTAUTH_SECRET.length >= 32 ?
          "✓ Strong NextAuth secret configured" :
          "✗ NextAuth secret must be 32+ characters and not contain 'development'"
      })
    },

    // Payment Processing
    {
      category: "Payments",
      name: "Stripe Configuration",
      description: "Stripe payment processing must be configured",
      critical: true,
      validator: (env) => {
        const hasSecret = env.STRIPE_SECRET_KEY && env.STRIPE_SECRET_KEY.startsWith("sk_");
        const hasPublishable = env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY && env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.startsWith("pk_");
        const hasWebhook = env.STRIPE_WEBHOOK_SECRET && env.STRIPE_WEBHOOK_SECRET.startsWith("whsec_");

        return {
          passed: hasSecret && hasPublishable && hasWebhook,
          message: (hasSecret && hasPublishable && hasWebhook) ?
            "✓ Complete Stripe configuration" :
            "✗ Stripe keys missing or invalid format"
        };
      }
    },

    // Performance & CDN
    {
      category: "Performance",
      name: "CDN Optimization",
      description: "CDN optimization should be enabled",
      critical: false,
      validator: (env) => ({
        passed: env.CDN_OPTIMIZATION === "enabled",
        message: env.CDN_OPTIMIZATION === "enabled" ?
          "✓ CDN optimization enabled" :
          "⚠ CDN optimization disabled (recommended for production)"
      })
    },
    {
      category: "Performance",
      name: "European CDN",
      description: "European CDN for GDPR compliance",
      critical: false,
      gdpr: true,
      validator: (env) => ({
        passed: env.REGIONAL_CDN_EUROPE === "enabled",
        message: env.REGIONAL_CDN_EUROPE === "enabled" ?
          "✓ European CDN enabled for GDPR" :
          "⚠ European CDN disabled (recommended for GDPR compliance)"
      })
    },

    // Monitoring & Error Tracking
    {
      category: "Monitoring",
      name: "Error Tracking",
      description: "Error tracking must be enabled",
      critical: true,
      validator: (env) => ({
        passed: env.ERROR_TRACKING === "enabled",
        message: env.ERROR_TRACKING === "enabled" ?
          "✓ Error tracking enabled" :
          "✗ Error tracking required for production"
      })
    },
    {
      category: "Monitoring",
      name: "Sentry DSN",
      description: "Sentry error tracking should be configured",
      critical: false,
      validator: (env) => ({
        passed: env.SENTRY_DSN && env.SENTRY_DSN.startsWith("https://"),
        message: env.SENTRY_DSN ?
          "✓ Sentry DSN configured" :
          "⚠ Sentry DSN not configured (optional but recommended)"
      })
    },

    // Development Tools (must be disabled)
    {
      category: "Development",
      name: "Debug Logs Disabled",
      description: "Debug logs must be disabled in production",
      critical: true,
      validator: (env) => ({
        passed: env.ENABLE_DEBUG_LOGS === "false",
        message: env.ENABLE_DEBUG_LOGS === "false" ?
          "✓ Debug logs disabled" :
          "✗ Debug logs must be disabled in production"
      })
    },
    {
      category: "Development",
      name: "Mock Data Disabled",
      description: "Mock data must be disabled in production",
      critical: true,
      validator: (env) => ({
        passed: env.ENABLE_MOCK_DATA === "false",
        message: env.ENABLE_MOCK_DATA === "false" ?
          "✓ Mock data disabled" :
          "✗ Mock data must be disabled in production"
      })
    },

    // Feature Flags
    {
      category: "Features",
      name: "Core Features Enabled",
      description: "Core features must be enabled",
      critical: true,
      validator: (env) => {
        const brain3d = env.FEATURE_BRAIN_3D === "enabled";
        const tracking = env.FEATURE_SUPPLEMENT_TRACKING === "enabled";

        return {
          passed: brain3d && tracking,
          message: (brain3d && tracking) ?
            "✓ Core features enabled" :
            "✗ Core features (Brain 3D, Supplement Tracking) must be enabled"
        };
      }
    },

    // File System Checks
    {
      category: "Deployment",
      name: "Build Files",
      description: "Production build files must exist",
      critical: true,
      validator: (env) => {
        const hasBuild = existsSync(join(__dirname, '..', '.next'));
        const hasPackageLock = existsSync(join(__dirname, '..', 'package-lock.json'));

        return {
          passed: hasBuild && hasPackageLock,
          message: (hasBuild && hasPackageLock) ?
            "✓ Build files present" :
            "✗ Missing build files or package lock"
        };
      }
    }
  ];

  /**
   * Run complete production readiness check
   */
  async runChecklist(): Promise<{
    passed: number;
    failed: number;
    warnings: number;
    total: number;
    score: number;
    results: Array<ChecklistItem & ChecklistResult>;
  }> {
    console.log(`${colors.bright}${colors.blue}🚀 Production Readiness Checklist${colors.reset}\n`);
    console.log(`Checking suplementor medical app for production deployment...\n`);

    // Load environment variables
    const envVars = this.loadEnvironmentFiles();

    const results: Array<ChecklistItem & ChecklistResult> = [];
    let passed = 0;
    let failed = 0;
    let warnings = 0;

    // Run each check
    for (const item of this.checklist) {
      const result = item.validator(envVars);
      const fullResult = { ...item, ...result };

      results.push(fullResult);

      // Display result
      const icon = result.passed ? colors.green + "✓" : colors.red + "✗";
      const status = result.passed ? "PASS" : item.critical ? "FAIL" : "WARN";

      console.log(`${icon}${colors.reset} [${status}] ${item.name}`);
      console.log(`    ${colors.cyan}${item.description}${colors.reset}`);

      if (result.details) {
        console.log(`    ${colors.yellow}${result.details}${colors.reset}`);
      }

      if (result.passed) {
        passed++;
      } else if (item.critical) {
        failed++;
      } else {
        warnings++;
      }

      console.log("");
    }

    const total = this.checklist.length;
    const score = Math.round(((passed + (warnings * 0.5)) / total) * 100);

    // Display summary
    this.displaySummary(passed, failed, warnings, total, score);

    return { passed, failed, warnings, total, score, results };
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
   * Display summary results
   */
  private displaySummary(passed: number, failed: number, warnings: number, total: number, score: number): void {
    console.log(`${colors.bright}${colors.blue}📊 Production Readiness Summary${colors.reset}`);
    console.log(`═══════════════════════════════════════════════════════`);

    const scoreColor = score >= 90 ? colors.green : score >= 70 ? colors.yellow : colors.red;
    console.log(`${colors.bright}Overall Score:${colors.reset} ${scoreColor}${score}%${colors.reset}`);

    console.log(`\n${colors.green}✓ Passed:${colors.reset} ${passed}/${total}`);
    console.log(`${colors.red}✗ Failed:${colors.reset} ${failed}/${total}`);
    console.log(`${colors.yellow}⚠ Warnings:${colors.reset} ${warnings}/${total}`);

    if (failed > 0) {
      console.log(`\n${colors.bright}${colors.red}❌ Critical Issues (Must Fix):${colors.reset}`);

      const criticalFailures = this.checklist.filter(item =>
        !item.validator({}).passed && item.critical
      );

      criticalFailures.forEach(item => {
        console.log(`  • ${item.name}`);
      });
    }

    if (warnings > 0) {
      console.log(`\n${colors.bright}${colors.yellow}⚠️  Recommendations:${colors.reset}`);

      const warningItems = this.checklist.filter(item =>
        !item.validator({}).passed && !item.critical
      );

      warningItems.forEach(item => {
        console.log(`  • ${item.name}`);
      });
    }

    console.log(`\n${colors.bright}${colors.blue}📋 Deployment Checklist:${colors.reset}`);
    console.log(`  [ ] All critical issues resolved`);
    console.log(`  [ ] Database migrations completed`);
    console.log(`  [ ] SSL certificate installed`);
    console.log(`  [ ] Domain DNS configured`);
    console.log(`  [ ] CDN configured`);
    console.log(`  [ ] Monitoring alerts set up`);
    console.log(`  [ ] Backup strategy tested`);
    console.log(`  [ ] Load testing completed`);
    console.log(`  [ ] GDPR compliance verified`);
    console.log(`  [ ] Medical compliance verified`);

    if (score >= 90) {
      console.log(`\n${colors.green}🎉 Ready for production deployment!${colors.reset}`);
    } else if (score >= 70) {
      console.log(`\n${colors.yellow}⚠️  Almost ready - please address the issues above${colors.reset}`);
    } else {
      console.log(`\n${colors.red}❌ Not ready for production - critical issues must be resolved${colors.reset}`);
    }
  }
}

/**
 * Main function
 */
async function main() {
  const checker = new ProductionReadinessChecker();

  try {
    const results = await checker.runChecklist();

    // Exit with error code if critical issues found
    if (results.failed > 0) {
      process.exit(1);
    }

    process.exit(0);
  } catch (error) {
    console.error(`${colors.red}Production readiness check failed:`, error, colors.reset);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { ProductionReadinessChecker };