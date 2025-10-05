import { MongoClient } from 'mongodb';
import { config } from 'dotenv';

config();

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('❌ MONGODB_URI not found in environment variables');
  process.exit(1);
}

console.log('🔍 Testing MongoDB connection...');
console.log('📍 URI:', uri.replace(/:[^:@]+@/, ':****@')); // Hide password

const client = new MongoClient(uri);

async function testConnection() {
  try {
    console.log('⏳ Connecting...');
    await client.connect();
    console.log('✅ Connected successfully!');
    
    const db = client.db();
    console.log('📊 Database name:', db.databaseName);
    
    const collections = await db.listCollections().toArray();
    console.log('📁 Collections:', collections.map(c => c.name).join(', ') || 'None');
    
  } catch (error) {
    console.error('❌ Connection failed:', error);
  } finally {
    await client.close();
    console.log('🔌 Connection closed');
  }
}

testConnection();

