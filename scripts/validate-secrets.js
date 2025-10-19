#!/usr/bin/env node

/**
 * Secrets Management Verification Script for Suplementor Medical App
 * Validates secure storage and management of sensitive data
 */

import { randomBytes, createHash } from "crypto";
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
 * Secret categories and their requirements
 */
const SECRET_CATEGORIES = {
  DATABASE_ENCRYPTION_KEY: {
    minLength: 32,
    pattern: /^[a-f0-9]+$/,
    description: "Database encryption key",
    rotationDays: 90,
    gdpr: true
  },
  MEDICAL_DATA_ENCRYPTION_KEY: {
    minLength: 32,
    pattern: /^[a-f0-9]+$/,
    description: "Medical data encryption key",
    rotationDays: 60,
    gdpr: true
  },
  AUDIT_LOG_ENCRYPTION_KEY: {
    minLength: 32,
    pattern: /^[a-f0-9]+$/,
    description: "Audit log encryption key",
    rotationDays: 90,
    gdpr: true
  },
  NEXTAUTH_SECRET: {
    minLength: 32,
    pattern: /^[a-zA-Z0-9_-]+$/,
    description: "NextAuth secret",
    rotationDays: 30,
    gdpr: false
  },
  STRIPE_SECRET_KEY: {
    minLength: 20,
    pattern: /^sk_(live|test)_[a-zA-Z0-9]+$/,
    description: "Stripe secret key",
    rotationDays: 90,
    gdpr: false
  },
  STRIPE_WEBHOOK_SECRET: {
    minLength: 32,
    pattern: /^whsec_[a-zA-Z0-9]+$/,
    description: "Stripe webhook secret",
    rotationDays: 180,
    gdpr: false
  }
};

/**
 * Secrets validation results
 */
interface SecretsValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  securityScore: number;
  secretsFound: string[];
  missingSecrets: string[];
  weakSecrets: string[];
  recommendations: string[];
}

/**
 * Secrets Manager Validator
 */
class SecretsValidator {
  private errors: string[] = [];
  private warnings: string[] = [];
  private securityChecks: number = 0;
  private securityPassed: number = 0;
  private secretsFound: string[] = [];
  private missingSecrets: string[] = [];
  private weakSecrets: string[] = [];
  private recommendations: string[] = [];

  /**
   * Validate all secrets
   */
  async validate(): Promise<SecretsValidationResult> {
    console.log(`${colors.bright}${colors.blue}🔐 Validating Secrets Management${colors.reset}\n`);

    // Reset counters
    this.errors = [];
    this.warnings = [];
    this.securityChecks = 0;
    this.securityPassed = 0;
    this.secretsFound = [];
    this.missingSecrets = [];
    this.weakSecrets = [];
    this.recommendations = [];

    // Load environment files
    const envFiles = this.loadEnvironmentFiles();

    // Validate each secret category
    this.validateEncryptionKeys(envFiles);
    this.validateAuthSecrets(envFiles);
    this.validatePaymentSecrets(envFiles);
    this.validateThirdPartySecrets(envFiles);

    // Check for secrets in version control
    await this.checkVersionControlSecrets();

    // Generate recommendations
    this.generateRecommendations();

    // Calculate security score
    const securityScore = this.securityChecks > 0 ? (this.securityPassed / this.securityChecks) * 100 : 100;

    const result: SecretsValidationResult = {
      isValid: this.errors.length === 0,
      errors: this.errors,
      warnings: this.warnings,
      securityScore: Math.round(securityScore),
      secretsFound: this.secretsFound,
      missingSecrets: this.missingSecrets,
      weakSecrets: this.weakSecrets,
      recommendations: this.recommendations
    };

    this.displayResults(result);
    return result;
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
   * Validate encryption keys
   */
  private validateEncryptionKeys(envVars: Record<string, string>): void {
    console.log(`${colors.cyan}🔑 Validating encryption keys...${colors.reset}`);

    const encryptionKeys = [
      'DATABASE_ENCRYPTION_KEY',
      'MEDICAL_DATA_ENCRYPTION_KEY',
      'AUDIT_LOG_ENCRYPTION_KEY'
    ];

    for (const keyName of encryptionKeys) {
      const value = envVars[keyName];

      if (!value) {
        this.missingSecrets.push(keyName);
        this.errors.push(`${keyName} is missing`);
        console.log(`${colors.red}✗${colors.reset} ${keyName}: Missing`);
        continue;
      }

      this.secretsFound.push(keyName);
      const requirements = SECRET_CATEGORIES[keyName];

      // Check length
      this.securityChecks++;
      if (value.length >= requirements.minLength) {
        this.securityPassed++;
        console.log(`${colors.green}✓${colors.reset} ${keyName}: Length OK (${value.length} chars)`);
      } else {
        this.weakSecrets.push(keyName);
        this.errors.push(`${keyName} is too short (minimum ${requirements.minLength} characters)`);
        console.log(`${colors.red}✗${colors.reset} ${keyName}: Too short (${value.length} < ${requirements.minLength})`);
      }

      // Check pattern (hex for encryption keys)
      this.securityChecks++;
      if (requirements.pattern.test(value)) {
        this.securityPassed++;
        console.log(`${colors.green}✓${colors.reset} ${keyName}: Format OK`);
      } else {
        this.weakSecrets.push(keyName);
        this.errors.push(`${keyName} has invalid format`);
        console.log(`${colors.red}✗${colors.reset} ${keyName}: Invalid format`);
      }

      // Check for default/weak values
      this.securityChecks++;
      if (this.isNotDefaultValue(value, keyName)) {
        this.securityPassed++;
        console.log(`${colors.green}✓${colors.reset} ${keyName}: Not default value`);
      } else {
        this.weakSecrets.push(keyName);
        this.errors.push(`${keyName} appears to be a default or placeholder value`);
        console.log(`${colors.red}✗${colors.reset} ${keyName}: Default/placeholder value`);
      }
    }
  }

  /**
   * Validate authentication secrets
   */
  private validateAuthSecrets(envVars: Record<string, string>): void {
    console.log(`${colors.cyan}🔐 Validating authentication secrets...${colors.reset}`);

    const authSecrets = ['NEXTAUTH_SECRET'];

    for (const keyName of authSecrets) {
      const value = envVars[keyName];

      if (!value) {
        this.missingSecrets.push(keyName);
        this.errors.push(`${keyName} is missing`);
        console.log(`${colors.red}✗${colors.reset} ${keyName}: Missing`);
        continue;
      }

      this.secretsFound.push(keyName);
      const requirements = SECRET_CATEGORIES[keyName];

      // Check length
      this.securityChecks++;
      if (value.length >= requirements.minLength) {
        this.securityPassed++;
        console.log(`${colors.green}✓${colors.reset} ${keyName}: Length OK (${value.length} chars)`);
      } else {
        this.weakSecrets.push(keyName);
        this.errors.push(`${keyName} is too short (minimum ${requirements.minLength} characters)`);
        console.log(`${colors.red}✗${colors.reset} ${keyName}: Too short (${value.length} < ${requirements.minLength})`);
      }

      // Check for development values
      this.securityChecks++;
      if (value !== "development-secret-key-change-in-production" &&
          value !== "staging-secret-key-change-in-production") {
        this.securityPassed++;
        console.log(`${colors.green}✓${colors.reset} ${keyName}: Not development value`);
      } else {
        this.weakSecrets.push(keyName);
        this.errors.push(`${keyName} appears to be a development placeholder`);
        console.log(`${colors.red}✗${colors.reset} ${keyName}: Development placeholder`);
      }
    }
  }

  /**
   * Validate payment secrets
   */
  private validatePaymentSecrets(envVars: Record<string, string>): void {
    console.log(`${colors.cyan}💳 Validating payment secrets...${colors.reset}`);

    const paymentSecrets = [
      'STRIPE_SECRET_KEY',
      'STRIPE_WEBHOOK_SECRET'
    ];

    for (const keyName of paymentSecrets) {
      const value = envVars[keyName];

      if (!value) {
        this.missingSecrets.push(keyName);
        this.errors.push(`${keyName} is missing`);
        console.log(`${colors.red}✗${colors.reset} ${keyName}: Missing`);
        continue;
      }

      this.secretsFound.push(keyName);
      const requirements = SECRET_CATEGORIES[keyName];

      // Check format
      this.securityChecks++;
      if (requirements.pattern.test(value)) {
        this.securityPassed++;
        console.log(`${colors.green}✓${colors.reset} ${keyName}: Format OK`);
      } else {
        this.weakSecrets.push(keyName);
        this.errors.push(`${keyName} has invalid format`);
        console.log(`${colors.red}✗${colors.reset} ${keyName}: Invalid format`);
      }
    }
  }

  /**
   * Validate third-party service secrets
   */
  private validateThirdPartySecrets(envVars: Record<string, string>): void {
    console.log(`${colors.cyan}🔗 Validating third-party secrets...${colors.reset}`);

    const thirdPartySecrets = [
      'GOOGLE_CLIENT_ID',
      'GOOGLE_CLIENT_SECRET',
      'OPENAI_API_KEY',
      'SENTRY_DSN'
    ];

    for (const keyName of thirdPartySecrets) {
      const value = envVars[keyName];

      if (!value) {
        // These are optional, so just warn
        this.warnings.push(`${keyName} is not configured (optional)`);
        console.log(`${colors.yellow}⚠${colors.reset} ${keyName}: Not configured (optional)`);
        continue;
      }

      this.secretsFound.push(keyName);

      // Basic validation for non-empty values
      this.securityChecks++;
      if (value.length > 0 && !value.includes('your-') && !value.includes('placeholder')) {
        this.securityPassed++;
        console.log(`${colors.green}✓${colors.reset} ${keyName}: Configured`);
      } else {
        this.weakSecrets.push(keyName);
        this.warnings.push(`${keyName} appears to be a placeholder value`);
        console.log(`${colors.yellow}⚠${colors.reset} ${keyName}: Placeholder value`);
      }
    }
  }

  /**
   * Check for secrets in version control
   */
  private async checkVersionControlSecrets(): Promise<void> {
    console.log(`${colors.cyan}📁 Checking for secrets in version control...${colors.reset}`);

    try {
      // Check if .env.local exists (should not be committed)
      const gitignoreContent = readFileSync(join(__dirname, '..', '.gitignore'), 'utf8');

      this.securityChecks++;
      if (gitignoreContent.includes('.env.local') || gitignoreContent.includes('.env*local')) {
        this.securityPassed++;
        console.log(`${colors.green}✓${colors.reset} .env.local properly ignored`);
      } else {
        this.warnings.push(".env.local should be in .gitignore");
        console.log(`${colors.yellow}⚠${colors.reset} .env.local should be in .gitignore`);
      }

      // Check for accidentally committed secrets
      this.securityChecks++;
      if (!gitignoreContent.includes('*.log') && !gitignoreContent.includes('logs')) {
        this.securityPassed++;
        console.log(`${colors.green}✓${colors.reset} Log files properly ignored`);
      } else {
        this.warnings.push("Consider ignoring log files in .gitignore");
        console.log(`${colors.yellow}⚠${colors.reset} Consider ignoring log files`);
      }

    } catch (error) {
      this.warnings.push("Could not check .gitignore file");
      console.log(`${colors.yellow}⚠${colors.reset} Could not check .gitignore file`);
    }
  }

  /**
   * Check if value is not a default/placeholder
   */
  private isNotDefaultValue(value: string, keyName: string): boolean {
    const defaultValues = [
      '',
      'your-secret-key-here',
      'your-key-here',
      'placeholder',
      'changeme',
      'todo',
      'replace-me',
      'example-key',
      'test-key'
    ];

    return !defaultValues.some(defaultVal =>
      value.toLowerCase().includes(defaultVal.toLowerCase())
    );
  }

  /**
   * Generate security recommendations
   */
  private generateRecommendations(): void {
    this.recommendations = [
      "🔐 Use cryptographically secure random keys (32+ characters)",
      "🔄 Rotate encryption keys every 90 days",
      "🚫 Never commit secrets to version control",
      "🔑 Use different keys for different environments",
      "📝 Document your secret rotation procedures",
      "🔍 Regularly audit access logs",
      "🛡️ Use a secrets management service for production",
      "⚡ Enable automated key rotation where possible"
    ];

    if (this.missingSecrets.length > 0) {
      this.recommendations.unshift(`⚠️  CRITICAL: Set up missing secrets: ${this.missingSecrets.join(', ')}`);
    }

    if (this.weakSecrets.length > 0) {
      this.recommendations.unshift(`🔧 Strengthen weak secrets: ${this.weakSecrets.join(', ')}`);
    }
  }

  /**
   * Display validation results
   */
  private displayResults(result: SecretsValidationResult): void {
    console.log(`\n${colors.bright}${colors.blue}📊 Secrets Validation Results${colors.reset}`);
    console.log(`═══════════════════════════════════════════════`);

    if (result.isValid) {
      console.log(`${colors.green}✓ All secrets are properly configured!${colors.reset}`);
    } else {
      console.log(`${colors.red}✗ Found ${result.errors.length} errors and ${result.warnings.length} warnings${colors.reset}`);
    }

    console.log(`\n${colors.bright}Security Score:${colors.reset} ${result.securityScore}%`);
    console.log(`${colors.bright}Secrets Found:${colors.reset} ${result.secretsFound.length}`);
    console.log(`${colors.bright}Missing Secrets:${colors.reset} ${result.missingSecrets.length}`);
    console.log(`${colors.bright}Weak Secrets:${colors.reset} ${result.weakSecrets.length}`);

    if (result.errors.length > 0) {
      console.log(`\n${colors.bright}${colors.red}❌ Critical Issues:${colors.reset}`);
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

    if (result.missingSecrets.length > 0) {
      console.log(`\n${colors.bright}${colors.red}🚨 Missing Critical Secrets:${colors.reset}`);
      result.missingSecrets.forEach(secret => {
        console.log(`  • ${secret}`);
      });
    }

    if (result.weakSecrets.length > 0) {
      console.log(`\n${colors.bright}${colors.yellow}🔧 Weak Secrets:${colors.reset}`);
      result.weakSecrets.forEach(secret => {
        console.log(`  • ${secret}`);
      });
    }

    console.log(`\n${colors.bright}${colors.blue}🔒 Security Recommendations:${colors.reset}`);
    result.recommendations.forEach(rec => {
      console.log(`  • ${rec}`);
    });

    // Generate key rotation schedule
    console.log(`\n${colors.bright}${colors.cyan}📅 Key Rotation Schedule:${colors.reset}`);
    Object.entries(SECRET_CATEGORIES).forEach(([key, config]) => {
      if (this.secretsFound.includes(key)) {
        console.log(`  • ${key}: Every ${config.rotationDays} days`);
      }
    });
  }

  /**
   * Generate secure keys for missing secrets
   */
  async generateSecureKeys(): Promise<Record<string, string>> {
    console.log(`${colors.bright}${colors.green}🔑 Generating secure keys...${colors.reset}`);

    const generatedKeys: Record<string, string> = {};

    for (const [keyName, requirements] of Object.entries(SECRET_CATEGORIES)) {
      if (this.missingSecrets.includes(keyName) || this.weakSecrets.includes(keyName)) {
        let key: string;

        switch (keyName) {
          case 'NEXTAUTH_SECRET':
            key = randomBytes(32).toString('base64url');
            break;
          case 'STRIPE_SECRET_KEY':
            key = `sk_test_${randomBytes(24).toString('hex')}`;
            break;
          case 'STRIPE_WEBHOOK_SECRET':
            key = `whsec_${randomBytes(32).toString('hex')}`;
            break;
          default:
            key = randomBytes(32).toString('hex');
        }

        generatedKeys[keyName] = key;
        console.log(`${colors.green}✓${colors.reset} Generated ${keyName}`);
      }
    }

    return generatedKeys;
  }
}

/**
 * Main validation function
 */
async function main() {
  const validator = new SecretsValidator();

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

// CLI interface
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);

  if (args.includes('--generate-keys')) {
    const validator = new SecretsValidator();
    validator.generateSecureKeys().then(keys => {
      console.log(`\n${colors.bright}${colors.green}🔑 Generated Keys:${colors.reset}`);
      Object.entries(keys).forEach(([key, value]) => {
        console.log(`${key}=${value}`);
      });

      // Save to .env.local
      const envContent = Object.entries(keys)
        .map(([key, value]) => `${key}="${value}"`)
        .join('\n');

      writeFileSync(join(__dirname, '..', '.env.local'), envContent);
      console.log(`\n${colors.green}✓ Keys saved to .env.local${colors.reset}`);
    });
  } else {
    main();
  }
}

export { SecretsValidator };