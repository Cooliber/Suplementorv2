#!/usr/bin/env bun

/**
 * Bun SQLite Initialization Script
 * Demonstrates Bun 1.3's native SQLite capabilities
 * Creates a local database for development/testing
 */

import { Database } from "bun:sqlite";
import { join } from "path";

// Create database file in project root
const dbPath = join(process.cwd(), "dev-database.db");
const db = new Database(dbPath);

console.log("🚀 Initializing Bun SQLite Database...");
console.log(`📍 Database path: ${dbPath}`);

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS supplements_cache (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT,
    data TEXT,
    last_updated TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS brain_regions_cache (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    functions TEXT,
    data TEXT,
    last_updated TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS user_sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    session_data TEXT,
    expires_at TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS performance_metrics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    endpoint TEXT,
    method TEXT,
    response_time INTEGER,
    status_code INTEGER,
    timestamp TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_supplements_category ON supplements_cache(category);
  CREATE INDEX IF NOT EXISTS idx_performance_endpoint ON performance_metrics(endpoint);
  CREATE INDEX IF NOT EXISTS idx_performance_timestamp ON performance_metrics(timestamp);
`);

// Insert sample data
const sampleSupplements = [
  { id: "omega-3", name: "Omega-3", category: "FATTY_ACID" },
  { id: "vitamin-d", name: "Witamina D", category: "VITAMIN" },
  { id: "magnesium", name: "Magnez", category: "MINERAL" }
];

const insertSupplement = db.prepare(`
  INSERT OR REPLACE INTO supplements_cache (id, name, category, last_updated)
  VALUES (?, ?, ?, ?)
`);

const insertBrainRegion = db.prepare(`
  INSERT OR REPLACE INTO brain_regions_cache (id, name, functions, last_updated)
  VALUES (?, ?, ?, ?)
`);

console.log("📝 Inserting sample data...");

// Insert supplements
for (const supplement of sampleSupplements) {
  insertSupplement.run(
    supplement.id,
    supplement.name,
    supplement.category,
    new Date().toISOString()
  );
}

// Insert sample brain regions
const brainRegions = [
  { id: "prefrontal-cortex", name: "Kora przedczołowa", functions: "Wykonywanie funkcji, podejmowanie decyzji" },
  { id: "hippocampus", name: "Hipokamp", functions: "Pamięć, uczenie się" },
  { id: "amygdala", name: "Migdałowicz", functions: "Emocje, reakcje strachu" }
];

for (const region of brainRegions) {
  insertBrainRegion.run(
    region.id,
    region.name,
    region.functions,
    new Date().toISOString()
  );
}

// Performance test
console.log("⚡ Running performance tests...");

const startTime = performance.now();

// Test queries
const supplementCount = db.query("SELECT COUNT(*) as count FROM supplements_cache").get() as { count: number };
const brainRegionCount = db.query("SELECT COUNT(*) as count FROM brain_regions_cache").get() as { count: number };

const endTime = performance.now();
const queryTime = endTime - startTime;

// Insert performance metric
db.exec("INSERT INTO performance_metrics (endpoint, method, response_time, status_code) VALUES (?, ?, ?, ?)", [
  "/api/sqlite-test",
  "GET",
  Math.round(queryTime),
  200
]);

console.log("✅ Database initialized successfully!");
console.log(`📊 Supplements: ${supplementCount.count}`);
console.log(`🧠 Brain regions: ${brainRegionCount.count}`);
console.log(`⚡ Query performance: ${queryTime.toFixed(2)}ms`);

// Display database info
console.log("\n📋 Database Tables:");
const tables = db.query("SELECT name FROM sqlite_master WHERE type='table'").all() as { name: string }[];
for (const table of tables) {
  const count = db.query(`SELECT COUNT(*) as count FROM ${table.name}`).get() as { count: number };
  console.log(`  - ${table.name}: ${count.count} records`);
}

console.log("\n💾 Database file size:", Bun.file(dbPath).size, "bytes");

// Cleanup
db.close();

console.log("🎉 SQLite setup complete!");
console.log("💡 Use this database for development and testing");
console.log("🔧 Bun 1.3 native SQLite provides excellent performance");
