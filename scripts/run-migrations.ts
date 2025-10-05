#!/usr/bin/env tsx

/**
 * Migration Runner Script
 * Runs all database migrations for the Polish supplement education platform
 */

import path from "node:path";
import { config } from "dotenv";

// Load environment variables
config({ path: path.resolve(process.cwd(), ".env.local") });

import { runSupplementMigration } from "../src/lib/db/migrations/001-migrate-supplements";
import { runBrainRegionMigration } from "../src/lib/db/migrations/002-migrate-brain-regions";
import connectToDatabase, {
	checkDBHealth,
	getDBStats,
} from "../src/lib/db/mongodb";

interface MigrationStep {
	name: string;
	description: string;
	run: () => Promise<void>;
	required: boolean;
}

const migrations: MigrationStep[] = [
	{
		name: "supplements",
		description:
			"Migrate comprehensive supplements database with Polish translations",
		run: runSupplementMigration,
		required: true,
	},
	{
		name: "brain-regions",
		description:
			"Migrate brain regions for 3D visualization with Polish content",
		run: runBrainRegionMigration,
		required: true,
	},
];

/**
 * Run all migrations in sequence
 */
async function runAllMigrations(): Promise<void> {
	console.log(
		"🚀 Starting Polish Supplement Education Platform migrations...\n",
	);

	try {
		// Check database connection
		console.log("🔍 Checking database connection...");
		const healthCheck = await checkDBHealth();

		if (healthCheck.status !== "healthy") {
			throw new Error("Database connection is not healthy");
		}

		console.log("✅ Database connection is healthy");
		console.log(`   Connected to: ${healthCheck.details.name}`);
		console.log(`   Collections: ${healthCheck.details.collections}\n`);

		// Run migrations
		let successCount = 0;
		let failureCount = 0;

		for (const migration of migrations) {
			try {
				console.log(`📦 Running migration: ${migration.name}`);
				console.log(`   Description: ${migration.description}`);

				const startTime = Date.now();
				await migration.run();
				const duration = Date.now() - startTime;

				console.log(
					`✅ Migration '${migration.name}' completed successfully in ${duration}ms\n`,
				);
				successCount++;
			} catch (error) {
				console.error(`❌ Migration '${migration.name}' failed:`, error);

				if (migration.required) {
					console.error(
						"🛑 Required migration failed. Stopping migration process.",
					);
					throw error;
				}
				console.warn(
					"⚠️ Optional migration failed. Continuing with next migration.\n",
				);
				failureCount++;
			}
		}

		// Final database statistics
		console.log("📊 Getting final database statistics...");
		const finalStats = await getDBStats();

		console.log("\n🎉 All migrations completed successfully!");
		console.log("\n📈 Final Database Statistics:");
		console.log(`   Supplements: ${finalStats.supplements}`);
		console.log(`   Brain Regions: ${finalStats.brainRegions}`);
		console.log(`   Neurotransmitters: ${finalStats.neurotransmitters}`);
		console.log(`   Research Studies: ${finalStats.researchStudies}`);
		console.log(`   Users: ${finalStats.users}`);
		console.log(`   Tracking Logs: ${finalStats.trackingLogs}`);

		console.log("\n✨ Summary:");
		console.log(`   Successful migrations: ${successCount}`);
		console.log(`   Failed migrations: ${failureCount}`);
		console.log(`   Total migrations: ${migrations.length}`);

		if (failureCount === 0) {
			console.log("\n🎊 All migrations completed without errors!");
			console.log(
				"🚀 Your Polish supplement education platform database is ready!",
			);
		} else {
			console.log(
				`\n⚠️ ${failureCount} migrations failed, but the platform should still be functional.`,
			);
		}
	} catch (error) {
		console.error("\n💥 Migration process failed:", error);
		process.exit(1);
	}
}

/**
 * Run specific migration by name
 */
async function runSpecificMigration(migrationName: string): Promise<void> {
	const migration = migrations.find((m) => m.name === migrationName);

	if (!migration) {
		console.error(`❌ Migration '${migrationName}' not found.`);
		console.log("\n📋 Available migrations:");
		migrations.forEach((m) => {
			console.log(`   - ${m.name}: ${m.description}`);
		});
		process.exit(1);
	}

	try {
		console.log(`🚀 Running specific migration: ${migration.name}`);
		console.log(`   Description: ${migration.description}\n`);

		const startTime = Date.now();
		await migration.run();
		const duration = Date.now() - startTime;

		console.log(
			`\n✅ Migration '${migration.name}' completed successfully in ${duration}ms`,
		);
	} catch (error) {
		console.error(`\n❌ Migration '${migration.name}' failed:`, error);
		process.exit(1);
	}
}

/**
 * Show migration status
 */
async function showMigrationStatus(): Promise<void> {
	try {
		console.log("📊 Checking migration status...\n");

		// Check database connection
		const healthCheck = await checkDBHealth();
		console.log(`🔍 Database Status: ${healthCheck.status}`);

		if (healthCheck.status === "healthy") {
			console.log(`   Host: ${healthCheck.details.host}`);
			console.log(`   Database: ${healthCheck.details.name}`);
			console.log(`   Collections: ${healthCheck.details.collections}`);
		}

		// Get database statistics
		const stats = await getDBStats();

		console.log("\n📈 Current Database Statistics:");
		console.log(`   Supplements: ${stats.supplements}`);
		console.log(`   Brain Regions: ${stats.brainRegions}`);
		console.log(`   Neurotransmitters: ${stats.neurotransmitters}`);
		console.log(`   Research Studies: ${stats.researchStudies}`);
		console.log(`   Users: ${stats.users}`);
		console.log(`   Tracking Logs: ${stats.trackingLogs}`);

		console.log("\n📋 Available Migrations:");
		migrations.forEach((migration, index) => {
			const status = migration.required ? "🔴 Required" : "🟡 Optional";
			console.log(`   ${index + 1}. ${migration.name} - ${status}`);
			console.log(`      ${migration.description}`);
		});
	} catch (error) {
		console.error("❌ Failed to check migration status:", error);
		process.exit(1);
	}
}

/**
 * Main function - parse command line arguments and run appropriate action
 */
async function main(): Promise<void> {
	const args = process.argv.slice(2);
	const command = args[0];

	switch (command) {
		case "run":
			if (args[1]) {
				await runSpecificMigration(args[1]);
			} else {
				await runAllMigrations();
			}
			break;

		case "status":
			await showMigrationStatus();
			break;

		case "help":
		case "--help":
		case "-h":
			console.log(
				"🔧 Polish Supplement Education Platform - Migration Runner\n",
			);
			console.log("Usage:");
			console.log("  npm run migrate              # Run all migrations");
			console.log("  npm run migrate run          # Run all migrations");
			console.log("  npm run migrate run <name>   # Run specific migration");
			console.log("  npm run migrate status       # Show migration status");
			console.log("  npm run migrate help         # Show this help\n");
			console.log("Available migrations:");
			migrations.forEach((m) => {
				console.log(`  - ${m.name}: ${m.description}`);
			});
			break;

		default:
			if (command) {
				console.error(`❌ Unknown command: ${command}\n`);
			}
			console.log(
				"🔧 Polish Supplement Education Platform - Migration Runner\n",
			);
			console.log("Usage: npm run migrate [command] [options]\n");
			console.log("Commands:");
			console.log(
				"  run [migration]  Run all migrations or specific migration",
			);
			console.log("  status          Show current migration status");
			console.log("  help            Show this help message\n");
			console.log("Examples:");
			console.log("  npm run migrate");
			console.log("  npm run migrate run supplements");
			console.log("  npm run migrate status");
			break;
	}
}

// Handle uncaught errors
process.on("unhandledRejection", (reason, promise) => {
	console.error("💥 Unhandled Rejection at:", promise, "reason:", reason);
	process.exit(1);
});

process.on("uncaughtException", (error) => {
	console.error("💥 Uncaught Exception:", error);
	process.exit(1);
});

// Run the main function
main().catch((error) => {
	console.error("💥 Migration runner failed:", error);
	process.exit(1);
});
