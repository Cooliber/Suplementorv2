#!/usr/bin/env node

/**
 * Environment Variables Validation Script for Suplementor Medical App
 * Validates all environment variables for production deployment
 */

import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";
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
 * Enhanced environment schema with strict validation
 */
const createProductionEnvironmentSchema = () => ({
  // Core application settings
  NODE_ENV: z.enum(["development", "staging", "production"]),
  VERCEL_ENV: z.enum(["development", "preview", "production"]).optional(),

  // NextAuth.js Configuration (required in production)
  NEXTAUTH_SECRET: z.string().min(32, "NEXTAUTH_SECRET must be at least 32 characters"),
  NEXTAUTH_URL: z.string().url("NEXTAUTH_URL must be a valid URL"),

  // OAuth Providers (optional but recommended)
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),

  // Database Configuration (required in production)
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required in production"),
  MONGODB_URI: z.string().optional(),

  // Medical App Configuration (strict requirements)
  MEDICAL_DATA_PROTECTION: z.enum(["enabled"], {
    errorMap: () => ({ message: "MEDICAL_DATA_PROTECTION must be 'enabled' for medical app" })
  }),
  GDPR_COMPLIANCE_MODE: z.enum(["strict"], {
    errorMap: () => ({ message: "GDPR_COMPLIANCE_MODE must be 'strict' for medical app" })
  }),
  POLISH_LOCALIZATION: z.enum(["enabled"], {
    errorMap: () => ({ message: "POLISH_LOCALIZATION must be 'enabled' for Polish medical app" })
  }),

  // Performance & Optimization
  BRAIN_VISUALIZATION_OPTIMIZATION: z.enum(["enabled", "disabled"]).default("enabled"),
  CDN_OPTIMIZATION: z.enum(["enabled", "disabled"]).default("enabled"),
  REGIONAL_CDN_EUROPE: z.enum(["enabled"], {
    errorMap: () => ({ message: "REGIONAL_CDN_EUROPE must be 'enabled' for GDPR compliance" })
  }),

  // Security & Encryption (required in production)
  DATABASE_ENCRYPTION_KEY: z.string().min(32, "DATABASE_ENCRYPTION_KEY must be at least 32 characters"),
  MEDICAL_DATA_ENCRYPTION_KEY: z.string().min(32, "MEDICAL_DATA_ENCRYPTION_KEY must be at least 32 characters"),
  AUDIT_LOG_ENCRYPTION_KEY: z.string().min(32, "AUDIT_LOG_ENCRYPTION_KEY must be at least 32 characters"),

  // Third-party Services (at least one payment method required)
  OPENAI_API_KEY: z.string().optional(),
  STRIPE_PUBLISHABLE_KEY: z.string().min(1, "STRIPE_PUBLISHABLE_KEY is required for payments"),
  STRIPE_SECRET_KEY: z.string().min(1, "STRIPE_SECRET_KEY is required for payments"),
  STRIPE_WEBHOOK_SECRET: z.string().min(1, "STRIPE_WEBHOOK_SECRET is required for payments"),

  // Monitoring & Analytics
  SENTRY_DSN: z.string().url("SENTRY_DSN must be a valid URL").optional(),
  VERCEL_ANALYTICS: z.enum(["enabled", "disabled"]).default("enabled"),
  ERROR_TRACKING: z.enum(["enabled"], {
    errorMap: () => ({ message: "ERROR_TRACKING must be 'enabled' for production monitoring" })
  }),

  // Development Tools (disabled in production)
  ENABLE_DEBUG_LOGS: z.enum(["false"], {
    errorMap: () => ({ message: "ENABLE_DEBUG_LOGS must be 'false' in production" })
  }),
  ENABLE_MOCK_DATA: z.enum(["false"], {
    errorMap: () => ({ message: "ENABLE_MOCK_DATA must be 'false' in production" })
  }),
  ENABLE_PLAYGROUND: z.enum(["false"], {
    errorMap: () => ({ message: "ENABLE_PLAYGROUND must be 'false' in production" })
  }),

  // Deployment Configuration
  DEPLOYMENT_REGION: z.string().default("fra1"),
  BUILD_ID: z.string().optional(),
  VERCEL_REGION: z.string().optional(),

  // Feature Flags (core features enabled)
  FEATURE_BRAIN_3D: z.enum(["enabled"], {
    errorMap: () => ({ message: "FEATURE_BRAIN_3D must be 'enabled' for core functionality" })
  }),
  FEATURE_SUPPLEMENT_TRACKING: z.enum(["enabled"], {
    errorMap: () => ({ message: "FEATURE_SUPPLEMENT_TRACKING must be 'enabled' for core functionality" })
  }),
  FEATURE_GAMIFICATION: z.enum(["enabled", "disabled"]).default("enabled"),
  FEATURE_ADVANCED_ANALYTICS: z.enum(["enabled", "disabled"]).default("disabled"),
});

/**
 * Client-side environment schema
 */
const createClientSchema = () => ({
  // Public environment variables
  NEXT_PUBLIC_MEDICAL_DISCLAIMER: z.enum(["enabled"]).default("enabled"),
  NEXT_PUBLIC_GDPR_COMPLIANCE: z.enum(["strict"]).default("strict"),
  NEXT_PUBLIC_DEFAULT_LOCALE: z.enum(["pl"]).default("pl"),
  NEXT_PUBLIC_APP_VERSION: z.string().default("1.0.0"),
  NEXT_PUBLIC_SUPPORT_EMAIL: z.string().email("NEXT_PUBLIC_SUPPORT_EMAIL must be a valid email").optional(),

  // Feature flags for client
  NEXT_PUBLIC_FEATURE_BRAIN_3D: z.enum(["enabled"]).default("enabled"),
  NEXT_PUBLIC_FEATURE_SUPPLEMENT_TRACKING: z.enum(["enabled"]).default("enabled"),
  NEXT_PUBLIC_FEATURE_GAMIFICATION: z.enum(["enabled", "disabled"]).default("enabled"),

  // Public API keys
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1, "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is required"),
  NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),

  // Development flags
  NEXT_PUBLIC_ENABLE_DEBUG: z.enum(["false"]).default("false"),
  NEXT_PUBLIC_ENABLE_MOCK_DATA: z.enum(["false"]).default("false"),
});

/**
 * Validation results interface
 */
interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  securityScore: number;
  complianceScore: number;
}

/**
 * Environment Variables Validator Class
 */
class EnvironmentValidator {
  private errors: string[] = [];
  private warnings: string[] = [];
  private securityChecks: number = 0;
  private securityPassed: number = 0;
  private complianceChecks: number = 0;
  private compliancePassed: number = 0;

  /**
   * Validate all environment variables
   */
  async validate(): Promise<ValidationResult> {
    console.log(`${colors.bright}${colors.blue}🔍 Validating Suplementor Environment Configuration${colors.reset}\n`);

    // Reset counters
    this.errors = [];
    this.warnings = [];
    this.securityChecks = 0;
    this.securityPassed = 0;
    this.complianceChecks = 0;
    this.compliancePassed = 0;

    // Load environment files
    const envFiles = this.loadEnvironmentFiles();

    // Validate server-side variables
    await this.validateServerEnvironment(envFiles);

    // Validate client-side variables
    this.validateClientEnvironment(envFiles);

    // Perform security validation
    this.performSecurityValidation(envFiles);

    // Perform compliance validation
    this.performComplianceValidation(envFiles);

    // Calculate scores
    const securityScore = this.securityChecks > 0 ? (this.securityPassed / this.securityChecks) * 100 : 100;
    const complianceScore = this.complianceChecks > 0 ? (this.compliancePassed / this.complianceChecks) * 100 : 100;

    const result: ValidationResult = {
      isValid: this.errors.length === 0,
      errors: this.errors,
      warnings: this.warnings,
      securityScore: Math.round(securityScore),
      complianceScore: Math.round(complianceScore)
    };

    this.displayResults(result);
    return result;
  }

  /**
   * Load environment files for validation
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
   * Validate server-side environment variables
   */
  private async validateServerEnvironment(envVars: Record<string, string>): Promise<void> {
    console.log(`${colors.cyan}📋 Validating server environment variables...${colors.reset}`);

    const schema = createProductionEnvironmentSchema();

    for (const [key, validator] of Object.entries(schema)) {
      const value = envVars[key];

      try {
        await validator.parseAsync(value);
        console.log(`${colors.green}✓${colors.reset} ${key}`);
      } catch (error) {
        if (error instanceof z.ZodError) {
          this.errors.push(`${key}: ${error.errors[0].message}`);
          console.log(`${colors.red}✗${colors.reset} ${key}: ${error.errors[0].message}`);
        }
      }
    }
  }

  /**
   * Validate client-side environment variables
   */
  private validateClientEnvironment(envVars: Record<string, string>): void {
    console.log(`${colors.cyan}📱 Validating client environment variables...${colors.reset}`);

    const schema = createClientSchema();

    for (const [key, validator] of Object.entries(schema)) {
      const value = envVars[key];

      try {
        validator.parse(value);
        console.log(`${colors.green}✓${colors.reset} ${key}`);
      } catch (error) {
        if (error instanceof z.ZodError) {
          this.errors.push(`${key}: ${error.errors[0].message}`);
          console.log(`${colors.red}✗${colors.reset} ${key}: ${error.errors[0].message}`);
        }
      }
    }
  }

  /**
   * Perform security validation
   */
  private performSecurityValidation(envVars: Record<string, string>): void {
    console.log(`${colors.cyan}🔐 Performing security validation...${colors.reset}`);

    // Check encryption keys strength
    this.securityChecks++;
    if (envVars.DATABASE_ENCRYPTION_KEY && envVars.DATABASE_ENCRYPTION_KEY.length >= 32) {
      this.securityPassed++;
      console.log(`${colors.green}✓${colors.reset} Database encryption key strength`);
    } else {
      this.errors.push("Database encryption key is too weak or missing");
      console.log(`${colors.red}✗${colors.reset} Database encryption key strength`);
    }

    this.securityChecks++;
    if (envVars.MEDICAL_DATA_ENCRYPTION_KEY && envVars.MEDICAL_DATA_ENCRYPTION_KEY.length >= 32) {
      this.securityPassed++;
      console.log(`${colors.green}✓${colors.reset} Medical data encryption key strength`);
    } else {
      this.errors.push("Medical data encryption key is too weak or missing");
      console.log(`${colors.red}✗${colors.reset} Medical data encryption key strength`);
    }

    // Check for development secrets in production
    this.securityChecks++;
    if (envVars.NEXTAUTH_SECRET !== "development-secret-key-change-in-production" &&
        envVars.NEXTAUTH_SECRET !== "staging-secret-key-change-in-production") {
      this.securityPassed++;
      console.log(`${colors.green}✓${colors.reset} Production-grade auth secret`);
    } else {
      this.errors.push("Development/staging auth secret found in production");
      console.log(`${colors.red}✗${colors.reset} Production-grade auth secret`);
    }

    // Check Stripe keys format
    this.securityChecks++;
    if (envVars.STRIPE_SECRET_KEY && envVars.STRIPE_SECRET_KEY.startsWith('sk_')) {
      this.securityPassed++;
      console.log(`${colors.green}✓${colors.reset} Valid Stripe secret key format`);
    } else {
      this.errors.push("Invalid Stripe secret key format");
      console.log(`${colors.red}✗${colors.reset} Valid Stripe secret key format`);
    }

    this.securityChecks++;
    if (envVars.STRIPE_PUBLISHABLE_KEY && envVars.STRIPE_PUBLISHABLE_KEY.startsWith('pk_')) {
      this.securityPassed++;
      console.log(`${colors.green}✓${colors.reset} Valid Stripe publishable key format`);
    } else {
      this.errors.push("Invalid Stripe publishable key format");
      console.log(`${colors.red}✗${colors.reset} Valid Stripe publishable key format`);
    }
  }

  /**
   * Perform compliance validation
   */
  private performComplianceValidation(envVars: Record<string, string>): void {
    console.log(`${colors.cyan}⚖️  Performing compliance validation...${colors.reset}`);

    // GDPR compliance checks
    this.complianceChecks++;
    if (envVars.GDPR_COMPLIANCE_MODE === "strict") {
      this.compliancePassed++;
      console.log(`${colors.green}✓${colors.reset} GDPR strict compliance mode`);
    } else {
      this.errors.push("GDPR compliance must be set to strict mode for medical app");
      console.log(`${colors.red}✗${colors.reset} GDPR strict compliance mode`);
    }

    this.complianceChecks++;
    if (envVars.MEDICAL_DATA_PROTECTION === "enabled") {
      this.compliancePassed++;
      console.log(`${colors.green}✓${colors.reset} Medical data protection enabled`);
    } else {
      this.errors.push("Medical data protection must be enabled");
      console.log(`${colors.red}✗${colors.reset} Medical data protection enabled`);
    }

    this.complianceChecks++;
    if (envVars.POLISH_LOCALIZATION === "enabled") {
      this.compliancePassed++;
      console.log(`${colors.green}✓${colors.reset} Polish localization enabled`);
    } else {
      this.errors.push("Polish localization must be enabled for Polish market");
      console.log(`${colors.red}✗${colors.reset} Polish localization enabled`);
    }

    this.complianceChecks++;
    if (envVars.REGIONAL_CDN_EUROPE === "enabled") {
      this.compliancePassed++;
      console.log(`${colors.green}✓${colors.reset} European CDN for GDPR compliance`);
    } else {
      this.warnings.push("European CDN recommended for GDPR compliance");
      console.log(`${colors.yellow}⚠${colors.reset}  European CDN for GDPR compliance`);
    }
  }

  /**
   * Display validation results
   */
  private displayResults(result: ValidationResult): void {
    console.log(`\n${colors.bright}${colors.blue}📊 Validation Results${colors.reset}`);
    console.log(`═══════════════════════════════════════`);

    if (result.isValid) {
      console.log(`${colors.green}✓ All environment variables are valid!${colors.reset}`);
    } else {
      console.log(`${colors.red}✗ Found ${result.errors.length} errors and ${result.warnings.length} warnings${colors.reset}`);
    }

    console.log(`\n${colors.bright}Security Score:${colors.reset} ${result.securityScore}%`);
    console.log(`${colors.bright}Compliance Score:${colors.reset} ${result.complianceScore}%`);

    if (result.errors.length > 0) {
      console.log(`\n${colors.bright}${colors.red}❌ Errors:${colors.reset}`);
      result.errors.forEach(error => {
        console.log(`  • ${error}`);
      });
    }

    if (result.warnings.length > 0) {
      console.log(`\n${colors.bright}${colors.yellow}⚠️  Warnings:${colors.reset}`);
      result.warnings.forEach(warning => {
        console.log(`  • ${warning}`);
      });
    }

    console.log(`\n${colors.bright}${colors.blue}💡 Recommendations:${colors.reset}`);
    console.log(`  • Use strong, unique encryption keys (32+ characters)`);
    console.log(`  • Rotate encryption keys every 90 days`);
    console.log(`  • Never commit secrets to version control`);
    console.log(`  • Use different keys for different environments`);
    console.log(`  • Enable audit logging for compliance`);
    console.log(`  • Test disaster recovery procedures`);
  }
}

/**
 * Main validation function
 */
async function main() {
  const validator = new EnvironmentValidator();

  try {
    const result = await validator.validate();

    // Exit with error code if validation failed
    if (!result.isValid) {
      process.exit(1);
    }

    process.exit(0);
  } catch (error) {
    console.error(`${colors.red}Validation failed with error:`, error, colors.reset);
    process.exit(1);
  }
}

// Run validation if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { EnvironmentValidator };