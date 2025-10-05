import { config } from 'dotenv';
config();

import connectToDatabase from "../src/lib/db/mongodb.js";
import { ComprehensiveSupplement } from "../src/lib/db/models/index.js";

async function deleteSwissHerbal() {
  try {
    await connectToDatabase();
    
    console.log('🗑️  Deleting existing SwissHerbal products...');
    
    const result = await ComprehensiveSupplement.deleteMany({ 
      tags: "swissherbal" 
    });
    
    console.log(`✅ Deleted ${result.deletedCount} SwissHerbal products`);
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Deletion failed:', error);
    process.exit(1);
  }
}

deleteSwissHerbal();

