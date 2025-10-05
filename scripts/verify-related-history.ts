/**
 * Verify RelatedHistory Fix
 * This script verifies that TCM entries have proper supplement references
 */

import "dotenv/config";
import connectToDatabase, { disconnectFromDatabase } from "../src/lib/db/mongodb";
import { SupplementHistory, ComprehensiveSupplement } from "../src/lib/db/models";

async function verifyRelatedHistory() {
  try {
    console.log("🔍 Connecting to MongoDB...\n");
    await connectToDatabase();

    // Test 1: Check TCM entries have relatedSupplements
    console.log("📊 Test 1: Checking TCM entries for relatedSupplements...\n");
    const tcmEntries = await SupplementHistory.find({ medicineSystem: "TCM" })
      .select("id title relatedSupplements")
      .lean();

    let totalReferences = 0;
    tcmEntries.forEach((entry) => {
      const count = entry.relatedSupplements?.length || 0;
      totalReferences += count;
      console.log(`  ${entry.id}: ${count} supplements`);
    });

    console.log(`\n✅ Total: ${tcmEntries.length} TCM entries with ${totalReferences} supplement references\n`);

    // Test 2: Query for rhodiola-rosea's related history
    console.log("📊 Test 2: Finding related history for rhodiola-rosea...\n");
    
    const rhodiola = await ComprehensiveSupplement.findOne({ id: "rhodiola-rosea" })
      .select("_id name polishName")
      .lean();

    if (!rhodiola) {
      console.log("❌ Rhodiola not found in database!\n");
      return;
    }

    console.log(`  Found: ${rhodiola.name} (${rhodiola.polishName})`);
    console.log(`  ObjectId: ${rhodiola._id}\n`);

    const relatedHistory = await SupplementHistory.find({
      relatedSupplements: rhodiola._id
    })
      .select("id title polishTitle era")
      .sort({ eraStartYear: 1 })
      .lean();

    console.log(`  Related historical entries: ${relatedHistory.length}\n`);
    
    relatedHistory.forEach((entry) => {
      console.log(`    - ${entry.polishTitle} (${entry.era})`);
    });

    if (relatedHistory.length > 0) {
      console.log("\n✅ SUCCESS: RelatedHistory component will display entries!\n");
    } else {
      console.log("\n❌ ISSUE: No related history found for rhodiola-rosea\n");
    }

    // Test 3: Check a few more supplements
    console.log("📊 Test 3: Checking other supplements...\n");
    
    const testSupplements = ["ashwagandha", "ginkgo-biloba", "curcumin"];
    
    for (const suppId of testSupplements) {
      const supp = await ComprehensiveSupplement.findOne({ id: suppId })
        .select("_id name")
        .lean();
      
      if (supp) {
        const count = await SupplementHistory.countDocuments({
          relatedSupplements: supp._id
        });
        console.log(`  ${supp.name}: ${count} related entries`);
      }
    }

    console.log("\n🎉 Verification complete!\n");

  } catch (error) {
    console.error("❌ Error:", error);
    throw error;
  } finally {
    await disconnectFromDatabase();
  }
}

verifyRelatedHistory().catch(console.error);

