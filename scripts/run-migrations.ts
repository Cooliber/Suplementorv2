#!/usr/bin/env tsx
/**
 * Database Migration Management Script
 * Handles Prisma migrations with medical compliance validation
 */

import { execSync } from "child_process";
import { existsSync, writeFileSync, readFileSync } from "fs";
import { join } from "path";
import { PrismaClient } from "../src/generated/prisma-client";

/**
 * Colors for console output
 */
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
};

/**
 * Log with colors
 */
function log(message: string, color: keyof typeof colors = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

/**
 * Execute shell command
 */
function exec(command: string, errorMessage?: string): boolean {
  try {
    log(`Executing: ${command}`, "cyan");
    execSync(command, { stdio: "inherit" });
    return true;
  } catch (error) {
    if (errorMessage) {
      log(errorMessage, "red");
    } else {
      log(`Command failed: ${command}`, "red");
    }
    return false;
  }
}

/**
 * Migration operation types
 */
type MigrationOperation = "status" | "deploy" | "dev" | "reset" | "seed";

/**
 * Database migration manager
 */
class MigrationManager {
  private prisma: PrismaClient;
  private environment: string;

  constructor() {
    this.environment = process.env.NODE_ENV || "development";
    this.prisma = new PrismaClient({
      log: this.environment === "development" ? ["query", "error", "warn"] : ["error"],
    });
  }

  /**
   * Check migration status
   */
  async checkStatus(): Promise<void> {
    log("\n📊 Checking migration status...", "yellow");

    try {
      // Check database connection
      await this.prisma.$connect();
      log("✅ Database connection established", "green");

      // Get migration history
      const migrations = await this.prisma.$queryRaw`
        SELECT name, started_at, finished_at, migration_state
        FROM _prisma_migrations
        ORDER BY started_at DESC
        LIMIT 10
      `;

      if (Array.isArray(migrations) && migrations.length > 0) {
        log("📋 Recent migrations:", "cyan");
        migrations.forEach((migration: any) => {
          const status = migration.finished_at ? "✅" : "⏳";
          log(`  ${status} ${migration.name} (${migration.migration_state})`, "cyan");
        });
      } else {
        log("📋 No migrations found", "yellow");
      }

      // Check database schema health
      await this.checkSchemaHealth();

    } catch (error) {
      log(`❌ Migration status check failed: ${error}`, "red");
      throw error;
    } finally {
      await this.prisma.$disconnect();
    }
  }

  /**
   * Check database schema health
   */
  private async checkSchemaHealth(): Promise<void> {
    try {
      // Test basic queries on key tables
      const userCount = await this.prisma.user.count();
      const supplementCount = await this.prisma.supplement.count();
      const brainRegionCount = await this.prisma.brainRegion.count();

      log("🏥 Database schema health:", "green");
      log(`  Users: ${userCount}`, "cyan");
      log(`  Supplements: ${supplementCount}`, "cyan");
      log(`  Brain Regions: ${brainRegionCount}`, "cyan");

      // Check for data integrity issues
      await this.checkDataIntegrity();

    } catch (error) {
      log(`⚠️  Schema health check warning: ${error}`, "yellow");
    }
  }

  /**
   * Check data integrity
   */
  private async checkDataIntegrity(): Promise<void> {
    try {
      // Check for orphaned records
      const orphanedTracking = await this.prisma.supplementTracking.count({
        where: {
          user: null,
        },
      });

      if (orphanedTracking > 0) {
        log(`⚠️  Found ${orphanedTracking} orphaned supplement tracking records`, "yellow");
      }

      // Check for missing consent records for medical data
      const medicalDataWithoutConsent = await this.prisma.healthMetrics.count({
        where: {
          user: {
            gdprConsentGiven: false,
          },
        },
      });

      if (medicalDataWithoutConsent > 0) {
        log(`⚠️  Found ${medicalDataWithoutConsent} health metrics without GDPR consent`, "yellow");
      }

    } catch (error) {
      log(`⚠️  Data integrity check warning: ${error}`, "yellow");
    }
  }

  /**
   * Deploy migrations to production
   */
  async deployMigrations(): Promise<void> {
    log("\n🚀 Deploying migrations to production...", "yellow");

    // Pre-deployment validation
    await this.validatePreDeployment();

    try {
      // Generate Prisma client
      if (!exec("npx prisma generate", "Failed to generate Prisma client")) {
        throw new Error("Prisma client generation failed");
      }

      // Deploy migrations
      if (!exec("npx prisma migrate deploy", "Migration deployment failed")) {
        throw new Error("Migration deployment failed");
      }

      // Verify deployment
      await this.verifyDeployment();

      log("✅ Migrations deployed successfully!", "green");

    } catch (error) {
      log(`❌ Migration deployment failed: ${error}`, "red");
      throw error;
    }
  }

  /**
   * Validate pre-deployment state
   */
  private async validatePreDeployment(): Promise<void> {
    log("🔍 Validating pre-deployment state...", "yellow");

    // Check if we're in production
    if (this.environment !== "production") {
      log("⚠️  Not in production environment, skipping strict validation", "yellow");
      return;
    }

    // Check for required environment variables
    const requiredEnvVars = [
      "DATABASE_URL",
      "MEDICAL_DATA_PROTECTION",
      "GDPR_COMPLIANCE_MODE",
    ];

    for (const envVar of requiredEnvVars) {
      if (!process.env[envVar]) {
        throw new Error(`Missing required environment variable: ${envVar}`);
      }
    }

    // Validate medical compliance
    if (process.env.MEDICAL_DATA_PROTECTION !== "enabled") {
      throw new Error("Medical data protection must be enabled for deployment");
    }

    if (process.env.GDPR_COMPLIANCE_MODE !== "strict") {
      throw new Error("GDPR compliance mode must be 'strict' for production deployment");
    }

    log("✅ Pre-deployment validation passed", "green");
  }

  /**
   * Verify deployment success
   */
  private async verifyDeployment(): Promise<void> {
    log("🔍 Verifying deployment...", "yellow");

    try {
      // Test database connectivity
      await this.prisma.$connect();

      // Test critical table access
      const tables = [
        "User",
        "SupplementTracking",
        "HealthMetrics",
        "ConsentRecord",
        "AuditLog",
      ];

      for (const table of tables) {
        try {
          const count = await (this.prisma as any)[table.toLowerCase()]?.count();
          log(`  ✅ ${table}: ${count || 0} records`, "green");
        } catch (error) {
          log(`  ❌ ${table}: Access failed`, "red");
          throw error;
        }
      }

      log("✅ Deployment verification completed", "green");

    } catch (error) {
      log(`❌ Deployment verification failed: ${error}`, "red");
      throw error;
    } finally {
      await this.prisma.$disconnect();
    }
  }

  /**
   * Reset database (development only)
   */
  async resetDatabase(): Promise<void> {
    if (this.environment === "production") {
      throw new Error("Cannot reset database in production environment");
    }

    log("\n🔄 Resetting development database...", "yellow");

    try {
      // Drop all tables and recreate
      if (!exec("npx prisma migrate reset --force", "Database reset failed")) {
        throw new Error("Database reset failed");
      }

      // Generate Prisma client
      if (!exec("npx prisma generate", "Prisma client generation failed")) {
        throw new Error("Prisma client generation failed");
      }

      // Run migrations
      if (!exec("npx prisma migrate dev", "Migration execution failed")) {
        throw new Error("Migration execution failed");
      }

      log("✅ Database reset completed successfully!", "green");

    } catch (error) {
      log(`❌ Database reset failed: ${error}`, "red");
      throw error;
    }
  }

  /**
   * Seed database with sample data
   */
  async seedDatabase(): Promise<void> {
    log("\n🌱 Seeding database with sample data...", "yellow");

    try {
      // Run the seed script
      if (!exec("npm run db:seed", "Database seeding failed")) {
        throw new Error("Database seeding failed");
      }

      log("✅ Database seeded successfully!", "green");

    } catch (error) {
      log(`❌ Database seeding failed: ${error}`, "red");
      throw error;
    }
  }

  /**
   * Create new migration
   */
  async createMigration(name: string): Promise<void> {
    log(`\n📝 Creating new migration: ${name}`, "yellow");

    try {
      const command = `npx prisma migrate dev --name ${name}`;
      if (!exec(command, "Migration creation failed")) {
        throw new Error("Migration creation failed");
      }

      log("✅ Migration created successfully!", "green");

    } catch (error) {
      log(`❌ Migration creation failed: ${error}`, "red");
      throw error;
    }
  }

  /**
   * Validate medical compliance in database
   */
  async validateMedicalCompliance(): Promise<void> {
    log("\n🏥 Validating medical compliance...", "yellow");

    try {
      await this.prisma.$connect();

      // Check GDPR consent records
      const usersWithoutConsent = await this.prisma.user.count({
        where: {
          gdprConsentGiven: false,
        },
      });

      if (usersWithoutConsent > 0) {
        log(`⚠️  ${usersWithoutConsent} users without GDPR consent`, "yellow");
      }

      // Check for medical data without proper classification
      const unclassifiedMedicalData = await this.prisma.healthMetrics.count({
        where: {
          dataClassification: {
            not: "medical",
          },
        },
      });

      if (unclassifiedMedicalData > 0) {
        log(`⚠️  ${unclassifiedMedicalData} health metrics not properly classified`, "yellow");
      }

      // Check audit log coverage
      const recentActivity = await this.prisma.userActivity.count({
        where: {
          timestamp: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
          },
        },
      });

      if (recentActivity === 0) {
        log("⚠️  No recent user activity logged", "yellow");
      }

      log("✅ Medical compliance validation completed", "green");

    } catch (error) {
      log(`❌ Medical compliance validation failed: ${error}`, "red");
      throw error;
    } finally {
      await this.prisma.$disconnect();
    }
  }
}

/**
 * Main execution function
 */
async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const operation = args[0] as MigrationOperation;
  const migrationName = args[1];

  const migrationManager = new MigrationManager();

  log("🗄️  Suplementor Database Migration Manager", "bright");
  log(`Environment: ${migrationManager["environment"]}`, "blue");
  log("==========================================", "bright");

  try {
    switch (operation) {
      case "status":
        await migrationManager.checkStatus();
        break;

      case "deploy":
        await migrationManager.deployMigrations();
        break;

      case "dev":
        if (!migrationName) {
          log("❌ Migration name required for dev migrations", "red");
          log("Usage: tsx scripts/run-migrations.ts dev <migration-name>", "yellow");
          process.exit(1);
        }
        await migrationManager.createMigration(migrationName);
        break;

      case "reset":
        await migrationManager.resetDatabase();
        break;

      case "seed":
        await migrationManager.seedDatabase();
        break;

      default:
        log("Usage:", "cyan");
        log("  tsx scripts/run-migrations.ts status", "cyan");
        log("  tsx scripts/run-migrations.ts deploy", "cyan");
        log("  tsx scripts/run-migrations.ts dev <migration-name>", "cyan");
        log("  tsx scripts/run-migrations.ts reset", "cyan");
        log("  tsx scripts/run-migrations.ts seed", "cyan");
        log("", "cyan");
        log("Examples:", "cyan");
        log("  tsx scripts/run-migrations.ts dev add-user-profiles", "cyan");
        log("  tsx scripts/run-migrations.ts deploy", "cyan");
        log("  tsx scripts/run-migrations.ts status", "cyan");
        break;
    }

    // Always validate medical compliance in production
    if (migrationManager["environment"] === "production") {
      await migrationManager.validateMedicalCompliance();
    }

  } catch (error) {
    log(`\n❌ Migration operation failed: ${error instanceof Error ? error.message : "Unknown error"}`, "red");
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { MigrationManager };