/**
 * Database Migration: Add Performance Indexes
 * Adds optimized indexes for popular sorting and search operations
 *
 * Run with: bun run src/lib/db/migrations/add-performance-indexes.ts
 */

import { ComprehensiveSupplement } from "../models";
import connectToDatabase from "../mongodb";

async function addPerformanceIndexes() {
	console.log("🚀 Starting performance index migration...\n");

	try {
		// Connect to database
		await connectToDatabase();
		console.log("✅ Connected to MongoDB\n");

		// Get the collection
		const collection = ComprehensiveSupplement.collection;

		console.log("📊 Adding performance indexes...\n");

		// 1. Index for popular sorting (clinicalEvidence.totalStudies + evidenceLevel)
		console.log("  → Creating index for popular sorting...");
		await collection.createIndex(
			{
				"clinicalEvidence.totalStudies": -1,
				evidenceLevel: -1,
			},
			{
				name: "popular_sort_idx",
				background: true,
			},
		);
		console.log("  ✅ Popular sort index created\n");

		// 2. Index for commonNames search
		console.log("  → Creating index for commonNames...");
		await collection.createIndex(
			{ commonNames: 1 },
			{
				name: "common_names_idx",
				background: true,
			},
		);
		console.log("  ✅ commonNames index created\n");

		// 3. Index for polishCommonNames search
		console.log("  → Creating index for polishCommonNames...");
		await collection.createIndex(
			{ polishCommonNames: 1 },
			{
				name: "polish_common_names_idx",
				background: true,
			},
		);
		console.log("  ✅ polishCommonNames index created\n");

		// List all indexes
		console.log("📋 Current indexes on ComprehensiveSupplement collection:");
		const indexes = await collection.listIndexes().toArray();
		indexes.forEach((idx) => {
			console.log(`  - ${idx.name}: ${JSON.stringify(idx.key)}`);
		});

		console.log("\n✅ Performance index migration completed successfully!");
	} catch (error) {
		console.error("❌ Migration failed:", error);
		process.exit(1);
	} finally {
		process.exit(0);
	}
}

// Run migration
addPerformanceIndexes();
