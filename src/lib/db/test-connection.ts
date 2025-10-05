/**
 * MongoDB Connection Test Script
 * Tests database connectivity and basic operations
 */

import { Supplement } from "./models";
import connectToDatabase, {
	disconnectFromDatabase,
	getConnectionStatus,
} from "./mongodb";

async function testConnection() {
	console.log("🔌 Testing MongoDB connection...");

	try {
		// Test connection
		await connectToDatabase();
		console.log("✅ Successfully connected to MongoDB");
		console.log(`📊 Connection status: ${getConnectionStatus()}`);

		// Test basic operations
		console.log("🧪 Testing basic database operations...");

		// Count documents
		const supplementCount = await Supplement.countDocuments();
		console.log(`📈 Found ${supplementCount} supplements in database`);

		// Test query
		const firstSupplement = await Supplement.findOne().lean();
		if (firstSupplement) {
			console.log(
				`🔍 Sample supplement: ${firstSupplement.name} (${firstSupplement.polishName})`,
			);
		} else {
			console.log("📝 No supplements found - database may need seeding");
		}

		// Test search
		const searchResults = await Supplement.find({
			category: "NOOTROPIC",
		})
			.limit(3)
			.lean();
		console.log(`🧠 Found ${searchResults.length} nootropic supplements`);

		// Test text search (if index exists)
		try {
			const textSearchResults = await Supplement.find({
				$text: { $search: "cognitive" },
			})
				.limit(2)
				.lean();
			console.log(
				`🔍 Text search found ${textSearchResults.length} results for 'cognitive'`,
			);
		} catch (error) {
			console.log(
				"⚠️  Text search index not available (this is normal for new databases)",
			);
		}

		console.log("✅ All database operations completed successfully");
	} catch (error) {
		console.error("❌ Database connection test failed:", error);
		throw error;
	} finally {
		await disconnectFromDatabase();
		console.log("🔌 Disconnected from MongoDB");
	}
}

// Run test if called directly
if (require.main === module) {
	testConnection()
		.then(() => {
			console.log("🎉 Connection test completed successfully!");
			process.exit(0);
		})
		.catch((error) => {
			console.error("💥 Connection test failed:", error);
			process.exit(1);
		});
}

export default testConnection;
