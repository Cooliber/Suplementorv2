#!/usr/bin/env bun

/**
 * Fix synergistic-effects.ts by adding missing effectivenessRating
 */

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const filePath = join(process.cwd(), "src/data/synergistic-effects.ts");

const evidenceLevelToRating: Record<string, number> = {
	STRONG: 8,
	MODERATE: 6,
	WEAK: 4,
	INSUFFICIENT: 2,
	CONFLICTING: 3,
};

console.log("🔧 Fixing synergistic-effects.ts...");

let content = readFileSync(filePath, "utf-8");
let fixCount = 0;

// Pattern: Find ClinicalApplication objects without effectivenessRating
const clinicalAppPattern =
	/(\{\s*condition:\s*"[^"]+",\s*polishCondition:\s*"[^"]+",\s*indication:\s*"[^"]+",\s*polishIndication:\s*"[^"]+",\s*efficacy:\s*"[^"]+",\s*evidenceLevel:\s*"(STRONG|MODERATE|WEAK|INSUFFICIENT|CONFLICTING)")/g;

const matches = [...content.matchAll(clinicalAppPattern)];

for (const match of matches) {
	const fullMatch = match[0];
	const evidenceLevel = match[2];

	// Check if this object already has effectivenessRating
	const startIndex = match.index!;
	const endIndex = content.indexOf("}", startIndex);
	const objectContent = content.substring(startIndex, endIndex + 1);

	if (!objectContent.includes("effectivenessRating:")) {
		const rating = evidenceLevelToRating[evidenceLevel] || 5;

		// Add effectivenessRating after evidenceLevel
		const replacement = fullMatch.replace(
			/(evidenceLevel:\s*"(?:STRONG|MODERATE|WEAK|INSUFFICIENT|CONFLICTING)")/,
			`effectivenessRating: ${rating},\n\t\t\t\t$1`,
		);

		content = content.replace(fullMatch, replacement);
		fixCount++;
	}
}

writeFileSync(filePath, content, "utf-8");

console.log(`✅ Added ${fixCount} effectivenessRating properties`);
console.log("✅ File updated successfully!");
