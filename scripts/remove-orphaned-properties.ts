#!/usr/bin/env bun
/**
 * Remove orphaned safetyProfile, dosageGuidelines, tags, lastUpdated, createdAt
 * that were added outside object braces
 */

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const filePath = join(
	process.cwd(),
	"src/data/comprehensive-supplements-database.ts",
);

function removeOrphanedProperties() {
	console.log(
		"🔧 Removing orphaned properties from comprehensive-supplements-database.ts\n",
	);

	let content = readFileSync(filePath, "utf-8");

	// Pattern to match orphaned properties (at wrong indentation level)
	// These appear after economicData closing brace with wrong indentation
	const orphanedPattern =
		/\},\s+safetyProfile:\s*\{[\s\S]*?polishRenalImpairment:[\s\S]*?\},\s+dosageGuidelines:\s*\{[\s\S]*?polishSpecialPopulations:[\s\S]*?\}\),\s+\},\s+tags:\s*\[[\s\S]*?\],\s+lastUpdated:[\s\S]*?,\s+createdAt:[\s\S]*?,/g;

	const before = content.length;
	content = content.replace(orphanedPattern, "},");
	const after = content.length;

	const removed = before - after;

	writeFileSync(filePath, content, "utf-8");

	console.log(`✅ Removed ${removed} characters of orphaned properties`);
}

removeOrphanedProperties();
