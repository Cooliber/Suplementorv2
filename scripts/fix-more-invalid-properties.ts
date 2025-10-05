#!/usr/bin/env bun

/**
 * Fix more invalid properties in comprehensive-supplements-database.ts
 * - Remove polishAgeRestrictions from pediatricUse
 * - Remove polishTiming from dosageGuidelines
 */

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const filePath = join(
	process.cwd(),
	"src/data/comprehensive-supplements-database.ts",
);

console.log("🔧 Fixing more invalid properties...");

let content = readFileSync(filePath, "utf-8");
let fixCount = 0;

// Fix 1: Remove polishAgeRestrictions from pediatricUse
const polishAgeRestrictionsPattern =
	/\s*polishAgeRestrictions:\s*"[^"]*",?\s*/g;
const polishAgeRestrictionsMatches = content.match(
	polishAgeRestrictionsPattern,
);
if (polishAgeRestrictionsMatches) {
	content = content.replace(polishAgeRestrictionsPattern, "\n");
	fixCount += polishAgeRestrictionsMatches.length;
	console.log(
		`✅ Removed ${polishAgeRestrictionsMatches.length} polishAgeRestrictions`,
	);
}

// Fix 2: Remove polishTiming from dosageGuidelines
const polishTimingPattern = /\s*polishTiming:\s*\[[^\]]*\],?\s*/g;
const polishTimingMatches = content.match(polishTimingPattern);
if (polishTimingMatches) {
	content = content.replace(polishTimingPattern, "\n");
	fixCount += polishTimingMatches.length;
	console.log(`✅ Removed ${polishTimingMatches.length} polishTiming`);
}

writeFileSync(filePath, content, "utf-8");

console.log(`\n🎉 Total fixes applied: ${fixCount}`);
console.log("✅ File updated successfully!");
