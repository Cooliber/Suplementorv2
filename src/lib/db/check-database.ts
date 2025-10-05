/**
 * Quick database check script
 * Verifies MongoDB connection and checks seeded data
 */

import "dotenv/config";
import { ComprehensiveSupplement } from "./models";
import connectToDatabase, { disconnectFromDatabase } from "./mongodb";

async function checkDatabase() {
	try {
		console.log("🔍 Checking MongoDB connection...\n");

		// Connect to database
		await connectToDatabase();
		console.log("✅ Connected to MongoDB Atlas");

		// Import mongoose to access connection
		const mongoose = await import("mongoose");
		console.log(`📊 Database: ${mongoose.default.connection.name}\n`);

		// Count supplements
		const supplementCount = await ComprehensiveSupplement.countDocuments();
		console.log(`📦 Total supplements in database: ${supplementCount}`);

		if (supplementCount === 0) {
			console.log("\n⚠️  No supplements found. Run: pnpm db:seed\n");
			return;
		}

		// Get sample supplements
		const supplements = await ComprehensiveSupplement.find()
			.select("id name polishName category evidenceLevel")
			.limit(5)
			.lean();

		console.log("\n📋 Sample supplements:");
		supplements.forEach((supp: any) => {
			console.log(`  • ${supp.polishName} (${supp.name})`);
			console.log(
				`    Category: ${supp.category}, Evidence: ${supp.evidenceLevel}`,
			);
		});

		// Get category distribution
		const categories = await ComprehensiveSupplement.aggregate([
			{ $match: { isActive: true } },
			{ $group: { _id: "$category", count: { $sum: 1 } } },
			{ $sort: { count: -1 } },
		]);

		console.log("\n📊 Category distribution:");
		categories.forEach((cat: any) => {
			console.log(`  • ${cat._id}: ${cat.count} supplements`);
		});

		console.log("\n✅ Database check complete!\n");
	} catch (error) {
		console.error("\n❌ Database check failed:");
		console.error(error);
		process.exit(1);
	} finally {
		await disconnectFromDatabase();
	}
}

checkDatabase();
