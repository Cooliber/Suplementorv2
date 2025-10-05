#!/usr/bin/env bun

/**
 * Fix Invalid Property Names in comprehensive-supplements-database.ts
 * - Replace ageRestrictions with ageLimit
 * - Remove optimal property from therapeuticRange
 */

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const filePath = join(
	process.cwd(),
	"src/data/comprehensive-supplements-database.ts",
);

console.log("🔧 Fixing invalid property names...");

let content = readFileSync(filePath, "utf-8");
let fixCount = 0;

// Fix 1: Replace ageRestrictions with ageLimit in pediatricUse
const ageRestrictionsPattern =
	/(\s+pediatricUse:\s*\{[^}]*)\bageRestrictions:/g;
const ageRestrictionsMatches = content.match(ageRestrictionsPattern);
if (ageRestrictionsMatches) {
	content = content.replace(
		/(\s+pediatricUse:\s*\{[^}]*)\bageRestrictions:/g,
		"$1ageLimit:",
	);
	fixCount += ageRestrictionsMatches.length;
	console.log(
		`✅ Fixed ${ageRestrictionsMatches.length} ageRestrictions → ageLimit`,
	);
}

// Fix 2: Remove optimal property from therapeuticRange
// Pattern: therapeuticRange with min, optimal, max, unit
const optimalPattern =
	/therapeuticRange:\s*\{[^}]*\boptimal:\s*\d+,?\s*[^}]*\}/g;
const optimalMatches = content.match(optimalPattern);

if (optimalMatches) {
	// For each match, remove the optimal line
	content = content.replace(
		/(therapeuticRange:\s*\{\s*min:\s*\d+,\s*)optimal:\s*\d+,\s*(max:\s*\d+,\s*unit:)/g,
		"$1$2",
	);
	fixCount += optimalMatches.length;
	console.log(`✅ Fixed ${optimalMatches.length} optimal property removals`);
}

writeFileSync(filePath, content, "utf-8");

console.log(`\n🎉 Total fixes applied: ${fixCount}`);
console.log("✅ File updated successfully!");
