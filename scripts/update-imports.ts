#!/usr/bin/env bun

/**
 * Update all imports from comprehensive-supplements-database to comprehensive-supplements
 */

import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";

console.log("🔧 Updating imports...");

// Find all files that import from comprehensive-supplements-database
const grepResult = execSync(
	'grep -r "comprehensive-supplements-database" --include="*.ts" --include="*.tsx" src/',
	{ encoding: "utf-8" },
);

const files = new Set(
	grepResult
		.split("\n")
		.filter((line) => line.trim())
		.map((line) => line.split(":")[0]),
);

let updatedCount = 0;

for (const file of files) {
	if (!file) continue;

	console.log(`Processing: ${file}`);

	let content = readFileSync(file, "utf-8");
	const originalContent = content;

	// Replace imports
	content = content.replace(
		/@\/data\/comprehensive-supplements-database/g,
		"@/data/comprehensive-supplements",
	);

	if (content !== originalContent) {
		writeFileSync(file, content, "utf-8");
		updatedCount++;
		console.log(`✅ Updated: ${file}`);
	}
}

console.log(`\n🎉 Updated ${updatedCount} files`);
