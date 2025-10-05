import { config } from 'dotenv';
config();

import connectToDatabase from "../src/lib/db/mongodb.js";
import { ComprehensiveSupplement } from "../src/lib/db/models/index.js";

async function verify() {
  try {
    await connectToDatabase();
    
    console.log('\n🔍 Verifying SwissHerbal import...\n');
    
    // Count total SwissHerbal products
    const count = await ComprehensiveSupplement.countDocuments({ 
      tags: "swissherbal" 
    });
    console.log(`📊 Total SwissHerbal products: ${count}`);
    
    // Get sample products
    const samples = await ComprehensiveSupplement.find({ 
      tags: "swissherbal" 
    })
    .limit(3)
    .select('id name polishName category description polishDescription tags sourceUrl')
    .lean();
    
    console.log('\n📦 Sample products:\n');
    samples.forEach((product, idx) => {
      console.log(`${idx + 1}. ${product.polishName || product.name}`);
      console.log(`   ID: ${product.id}`);
      console.log(`   Category: ${product.category}`);
      console.log(`   Description: ${(product.polishDescription || product.description || '').substring(0, 150)}...`);
      console.log(`   Source: ${product.sourceUrl}`);
      console.log(`   Tags: ${product.tags?.join(', ')}`);
      console.log('');
    });
    
    // Category breakdown
    const categories = await ComprehensiveSupplement.aggregate([
      { $match: { tags: "swissherbal" } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    console.log('📊 Category breakdown:');
    categories.forEach(cat => {
      console.log(`   ${cat._id}: ${cat.count} products`);
    });
    
    console.log('\n✅ Verification complete!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Verification failed:', error);
    process.exit(1);
  }
}

verify();

