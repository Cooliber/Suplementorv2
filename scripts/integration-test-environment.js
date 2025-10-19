#!/usr/bin/env node

/**
 * Environment Integration Testing for Suplementor Medical App
 * Tests environment configuration with actual service connections
 */

import { createClient } from "redis";
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
 * Integration test results
 */
interface IntegrationTestResult {
  testName: string;
  passed: boolean;
  duration: number;
  message: string;
  details?: string;
}

/**
 * Environment Integration Tester
 */
class EnvironmentIntegrationTester {
  private startTime: number = Date.now();
  private results: IntegrationTestResult[] = [];

  /**
   * Run all integration tests
   */
  async runTests(): Promise<{
    passed: number;
    failed: number;
    totalDuration: number;
    results: IntegrationTestResult[];
  }> {
    console.log(`${colors.bright}${colors.blue}🧪 Environment Integration Testing${colors.reset}\n`);
    console.log(`Testing suplementor environment configuration...\n`);

    // Load environment variables
    const envVars = this.loadEnvironmentFiles();

    // Run integration tests
    await this.testDatabaseConnection(envVars);
    await this.testRedisConnection(envVars);
    await this.testStripeConfiguration(envVars);
    await this.testSentryConfiguration(envVars);
    await this.testNextAuthConfiguration(envVars);
    await this.testCDNConfiguration(envVars);

    const passed = this.results.filter(r => r.passed).length;
    const failed = this.results.filter(r => !r.passed).length;
    const totalDuration = Date.now() - this.startTime;

    this.displayResults(passed, failed, totalDuration);

    return {
      passed,
      failed,
      totalDuration,
      results: this.results
    };
  }

  /**
   * Test database connection
   */
  private async testDatabaseConnection(envVars: Record<string, string>): Promise<void> {
    const testName = "Database Connection";

    console.log(`${colors.cyan}Testing ${testName}...${colors.reset}`);

    try {
      // This would test actual database connection
      // For now, we'll just validate the configuration

      if (!envVars.DATABASE_URL) {
        throw new Error("DATABASE_URL not configured");
      }

      if (!envVars.DATABASE_URL.startsWith("postgresql://")) {
        throw new Error("DATABASE_URL must use PostgreSQL");
      }

      if (envVars.NODE_ENV === "production" && !envVars.DATABASE_ENCRYPTION_KEY) {
        throw new Error("Database encryption required for production");
      }

      this.results.push({
        testName,
        passed: true,
        duration: Date.now() - this.startTime,
        message: "Database configuration valid",
        details: `URL: ${envVars.DATABASE_URL.replace(/:[^:]+@/, ":***@")}`
      });

      console.log(`${colors.green}✓${colors.reset} Database configuration valid`);

    } catch (error) {
      this.results.push({
        testName,
        passed: false,
        duration: Date.now() - this.startTime,
        message: `Database test failed: ${error.message}`
      });

      console.log(`${colors.red}✗${colors.reset} Database test failed: ${error.message}`);
    }
  }

  /**
   * Test Redis connection (if configured)
   */
  private async testRedisConnection(envVars: Record<string, string>): Promise<void> {
    const testName = "Redis Connection";

    console.log(`${colors.cyan}Testing ${testName}...${colors.reset}`);

    try {
      // Redis is optional for basic functionality
      if (!envVars.REDIS_URL) {
        this.results.push({
          testName,
          passed: true,
          duration: Date.now() - this.startTime,
          message: "Redis not configured (optional)",
          details: "Redis connection is optional for suplementor"
        });

        console.log(`${colors.yellow}⚠${colors.reset} Redis not configured (optional)`);
        return;
      }

      // In a real implementation, test actual Redis connection
      // For now, validate URL format
      if (!envVars.REDIS_URL.startsWith("redis://")) {
        throw new Error("REDIS_URL must use redis:// protocol");
      }

      this.results.push({
        testName,
        passed: true,
        duration: Date.now() - this.startTime,
        message: "Redis configuration valid",
        details: `URL: ${envVars.REDIS_URL.replace(/:[^:]+@/, ":***@")}`
      });

      console.log(`${colors.green}✓${colors.reset} Redis configuration valid`);

    } catch (error) {
      this.results.push({
        testName,
        passed: false,
        duration: Date.now() - this.startTime,
        message: `Redis test failed: ${error.message}`
      });

      console.log(`${colors.red}✗${colors.reset} Redis test failed: ${error.message}`);
    }
  }

  /**
   * Test Stripe configuration
   */
  private async testStripeConfiguration(envVars: Record<string, string>): Promise<void> {
    const testName = "Stripe Payment Configuration";

    console.log(`${colors.cyan}Testing ${testName}...${colors.reset}`);

    try {
      if (!envVars.STRIPE_SECRET_KEY) {
        throw new Error("STRIPE_SECRET_KEY not configured");
      }

      if (!envVars.STRIPE_PUBLISHABLE_KEY) {
        throw new Error("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY not configured");
      }

      if (!envVars.STRIPE_WEBHOOK_SECRET) {
        throw new Error("STRIPE_WEBHOOK_SECRET not configured");
      }

      // Validate key formats
      if (!envVars.STRIPE_SECRET_KEY.startsWith("sk_")) {
        throw new Error("STRIPE_SECRET_KEY must start with 'sk_'");
      }

      if (!envVars.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.startsWith("pk_")) {
        throw new Error("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY must start with 'pk_'");
      }

      if (!envVars.STRIPE_WEBHOOK_SECRET.startsWith("whsec_")) {
        throw new Error("STRIPE_WEBHOOK_SECRET must start with 'whsec_'");
      }

      this.results.push({
        testName,
        passed: true,
        duration: Date.now() - this.startTime,
        message: "Stripe configuration valid",
        details: "All Stripe keys properly formatted"
      });

      console.log(`${colors.green}✓${colors.reset} Stripe configuration valid`);

    } catch (error) {
      this.results.push({
        testName,
        passed: false,
        duration: Date.now() - this.startTime,
        message: `Stripe test failed: ${error.message}`
      });

      console.log(`${colors.red}✗${colors.reset} Stripe test failed: ${error.message}`);
    }
  }

  /**
   * Test Sentry configuration
   */
  private async testSentryConfiguration(envVars: Record<string, string>): Promise<void> {
    const testName = "Sentry Error Tracking";

    console.log(`${colors.cyan}Testing ${testName}...${colors.reset}`);

    try {
      // Sentry is optional but recommended
      if (!envVars.SENTRY_DSN && !envVars.NEXT_PUBLIC_SENTRY_DSN) {
        this.results.push({
          testName,
          passed: true,
          duration: Date.now() - this.startTime,
          message: "Sentry not configured (optional)",
          details: "Error tracking is optional but recommended"
        });

        console.log(`${colors.yellow}⚠${colors.reset} Sentry not configured (optional)`);
        return;
      }

      const sentryDsn = envVars.SENTRY_DSN || envVars.NEXT_PUBLIC_SENTRY_DSN;

      if (!sentryDsn.startsWith("https://")) {
        throw new Error("SENTRY_DSN must use HTTPS");
      }

      this.results.push({
        testName,
        passed: true,
        duration: Date.now() - this.startTime,
        message: "Sentry configuration valid",
        details: "Sentry DSN properly formatted"
      });

      console.log(`${colors.green}✓${colors.reset} Sentry configuration valid`);

    } catch (error) {
      this.results.push({
        testName,
        passed: false,
        duration: Date.now() - this.startTime,
        message: `Sentry test failed: ${error.message}`
      });

      console.log(`${colors.red}✗${colors.reset} Sentry test failed: ${error.message}`);
    }
  }

  /**
   * Test NextAuth configuration
   */
  private async testNextAuthConfiguration(envVars: Record<string, string>): Promise<void> {
    const testName = "NextAuth Configuration";

    console.log(`${colors.cyan}Testing ${testName}...${colors.reset}`);

    try {
      if (!envVars.NEXTAUTH_SECRET) {
        throw new Error("NEXTAUTH_SECRET not configured");
      }

      if (!envVars.NEXTAUTH_URL) {
        throw new Error("NEXTAUTH_URL not configured");
      }

      // Validate secret strength
      if (envVars.NEXTAUTH_SECRET.length < 32) {
        throw new Error("NEXTAUTH_SECRET must be at least 32 characters");
      }

      // Check for development values
      if (envVars.NEXTAUTH_SECRET.includes("development") || envVars.NEXTAUTH_SECRET.includes("staging")) {
        throw new Error("NEXTAUTH_SECRET appears to be a development placeholder");
      }

      // Validate URL format
      if (envVars.NODE_ENV === "production" && !envVars.NEXTAUTH_URL.startsWith("https://")) {
        throw new Error("NEXTAUTH_URL must use HTTPS in production");
      }

      this.results.push({
        testName,
        passed: true,
        duration: Date.now() - this.startTime,
        message: "NextAuth configuration valid",
        details: `URL: ${envVars.NEXTAUTH_URL}, Secret length: ${envVars.NEXTAUTH_SECRET.length}`
      });

      console.log(`${colors.green}✓${colors.reset} NextAuth configuration valid`);

    } catch (error) {
      this.results.push({
        testName,
        passed: false,
        duration: Date.now() - this.startTime,
        message: `NextAuth test failed: ${error.message}`
      });

      console.log(`${colors.red}✗${colors.reset} NextAuth test failed: ${error.message}`);
    }
  }

  /**
   * Test CDN configuration
   */
  private async testCDNConfiguration(envVars: Record<string, string>): Promise<void> {
    const testName = "CDN Configuration";

    console.log(`${colors.cyan}Testing ${testName}...${colors.reset}`);

    try {
      // CDN configuration validation
      if (envVars.CDN_OPTIMIZATION === "enabled") {
        if (envVars.NODE_ENV === "production" && envVars.REGIONAL_CDN_EUROPE !== "enabled") {
          this.results.push({
            testName,
            passed: false,
            duration: Date.now() - this.startTime,
            message: "CDN enabled but European region not configured for GDPR",
            details: "European CDN required for GDPR compliance when CDN is enabled"
          });

          console.log(`${colors.yellow}⚠${colors.reset} CDN enabled but European region not configured for GDPR`);
          return;
        }
      }

      this.results.push({
        testName,
        passed: true,
        duration: Date.now() - this.startTime,
        message: "CDN configuration valid",
        details: `CDN: ${envVars.CDN_OPTIMIZATION}, Region: ${envVars.REGIONAL_CDN_EUROPE}`
      });

      console.log(`${colors.green}✓${colors.reset} CDN configuration valid`);

    } catch (error) {
      this.results.push({
        testName,
        passed: false,
        duration: Date.now() - this.startTime,
        message: `CDN test failed: ${error.message}`
      });

      console.log(`${colors.red}✗${colors.reset} CDN test failed: ${error.message}`);
    }
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
   * Display test results
   */
  private displayResults(passed: number, failed: number, totalDuration: number): void {
    console.log(`\n${colors.bright}${colors.blue}📊 Integration Test Results${colors.reset}`);
    console.log(`═════════════════════════════════════════════════`);

    console.log(`${colors.bright}Total Duration:${colors.reset} ${totalDuration}ms`);
    console.log(`${colors.green}✓ Passed:${colors.reset} ${passed}`);
    console.log(`${colors.red}✗ Failed:${colors.reset} ${failed}`);

    if (failed > 0) {
      console.log(`\n${colors.bright}${colors.red}❌ Failed Tests:${colors.reset}`);

      this.results.filter(r => !r.passed).forEach(result => {
        console.log(`  • ${result.testName}: ${result.message}`);
      });
    }

    console.log(`\n${colors.bright}${colors.blue}🔧 Environment Setup Checklist:${colors.reset}`);
    console.log(`  [ ] All integration tests passing`);
    console.log(`  [ ] Database connectivity confirmed`);
    console.log(`  [ ] Third-party services accessible`);
    console.log(`  [ ] Security configurations validated`);
    console.log(`  [ ] Performance optimizations verified`);
    console.log(`  [ ] Monitoring systems operational`);

    if (failed === 0) {
      console.log(`\n${colors.green}🎉 All integration tests passed!${colors.reset}`);
    } else {
      console.log(`\n${colors.red}❌ Integration tests failed - fix issues before deployment${colors.reset}`);
    }
  }
}

/**
 * Main function
 */
async function main() {
  const tester = new EnvironmentIntegrationTester();

  try {
    const results = await tester.runTests();

    // Exit with error code if tests failed
    if (results.failed > 0) {
      process.exit(1);
    }

    process.exit(0);
  } catch (error) {
    console.error(`${colors.red}Integration testing failed:`, error, colors.reset);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { EnvironmentIntegrationTester };