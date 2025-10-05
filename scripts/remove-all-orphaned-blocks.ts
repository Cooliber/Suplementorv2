#!/usr/bin/env bun
/**
 * Remove all orphaned property blocks from comprehensive-supplements-database.ts
 * These blocks were added outside object braces by mistake
 */

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const filePath = join(
	process.cwd(),
	"src/data/comprehensive-supplements-database.ts",
);

function removeOrphanedBlocks() {
	console.log("🔧 Removing orphaned property blocks\n");

	let content = readFileSync(filePath, "utf-8");
	let removedCount = 0;

	// Pattern to match orphaned blocks (wrong indentation - starts with single tab instead of double)
	// These appear after economicData closing brace
	const orphanedBlockPattern =
		/\t\},\n\n\t\tsafetyProfile: \{\n\t\t\tpregnancyCategory:[\s\S]*?\t\tcreatedAt: "2024-01-15T00:00:00Z",\n\},\n/g;

	content = content.replace(orphanedBlockPattern, (match) => {
		removedCount++;
		console.log(`Removing orphaned block ${removedCount}`);
		return "\t\t},\n\t},\n";
	});

	writeFileSync(filePath, content, "utf-8");

	console.log(`\n✅ Removed ${removedCount} orphaned property blocks`);
}

removeOrphanedBlocks();
