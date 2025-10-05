/**
 * Query MongoDB for Supplement ObjectIds
 * This script retrieves _id values for supplements to populate relatedSupplements in SupplementHistory
 */

import "dotenv/config";
import connectToDatabase, { disconnectFromDatabase } from "../src/lib/db/mongodb";
import { ComprehensiveSupplement } from "../src/lib/db/models";

// Supplements we need to link to TCM historical entries
const SUPPLEMENTS_TO_QUERY = [
  "ginseng",
  "rhodiola-rosea",
  "ashwagandha",
  "curcumin",
  "ginkgo-biloba",
  "lions-mane",
  "omega-3",
  "coenzyme-q10",
  "vitamin-d3",
  "magnesium",
];

async function getSupplementObjectIds() {
  try {
    console.log("🔍 Connecting to MongoDB...\n");
    await connectToDatabase();

    console.log("📊 Querying supplement ObjectIds...\n");
    
    const supplements = await ComprehensiveSupplement.find({
      id: { $in: SUPPLEMENTS_TO_QUERY }
    }).select("_id id name polishName").lean();

    if (supplements.length === 0) {
      console.log("⚠️  No supplements found! Make sure to run 'bun db:seed' first.\n");
      return;
    }

    console.log(`✅ Found ${supplements.length} supplements:\n`);
    
    // Create mapping object
    const mapping: Record<string, string> = {};
    
    supplements.forEach((supp) => {
      console.log(`  ${supp.name} (${supp.polishName})`);
      console.log(`    ID: ${supp.id}`);
      console.log(`    ObjectId: ${supp._id}\n`);
      mapping[supp.id] = supp._id.toString();
    });

    // Output TypeScript-friendly mapping
    console.log("\n📝 TypeScript Mapping (copy this):\n");
    console.log("const SUPPLEMENT_OBJECTIDS: Record<string, string> = {");
    Object.entries(mapping).forEach(([id, objectId]) => {
      console.log(`  "${id}": "${objectId}",`);
    });
    console.log("};\n");

    // Output suggested TCM entry mappings
    console.log("\n🔗 Suggested TCM Historical Entry Mappings:\n");
    console.log("tcm-shennong-legend → [ginseng, rhodiola-rosea, ashwagandha]");
    console.log("  (Ancient adaptogenic herbs from mythic origins)\n");
    
    console.log("tcm-huangdi-neijing → [ginseng, rhodiola-rosea]");
    console.log("  (Foundational herbs in early TCM theory)\n");
    
    console.log("tcm-shennong-bencao-jing → [ginseng, curcumin, ginkgo-biloba]");
    console.log("  (Herbs documented in earliest materia medica)\n");
    
    console.log("tcm-zhang-zhongjing-shanghan-lun → [ginseng, curcumin]");
    console.log("  (Herbs used in classical formulations)\n");
    
    console.log("tcm-sun-simiao → [ginseng, ginkgo-biloba, curcumin]");
    console.log("  (Herbs refined by the Medicine King)\n");
    
    console.log("tcm-song-printing-dissemination → [ginseng, ginkgo-biloba]");
    console.log("  (Herbs widely disseminated through printing)\n");
    
    console.log("tcm-li-shizhen-bencao-gangmu → [ginseng, rhodiola-rosea, ginkgo-biloba, curcumin, lions-mane]");
    console.log("  (Comprehensive herbal encyclopedia entries)\n");
    
    console.log("tcm-qing-refinement → [ginseng, ginkgo-biloba, curcumin]");
    console.log("  (Herbs refined in Qing dynasty practices)\n");
    
    console.log("tcm-modern-integration → [omega-3, coenzyme-q10, vitamin-d3, magnesium]");
    console.log("  (Modern supplements with TCM integration research)\n");
    
    console.log("tcm-globalization → [ginseng, rhodiola-rosea, ashwagandha, curcumin, ginkgo-biloba]");
    console.log("  (Herbs popularized globally)\n");

  } catch (error) {
    console.error("❌ Error:", error);
    throw error;
  } finally {
    await disconnectFromDatabase();
  }
}

// Run the script
getSupplementObjectIds().catch(console.error);

