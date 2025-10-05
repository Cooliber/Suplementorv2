#!/usr/bin/env bun

/**
 * Add missing effectivenessRating to ClinicalApplication objects
 * Scans all supplement files and adds effectivenessRating based on evidenceLevel
 */

import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const supplementsDir = join(process.cwd(), "src/data/supplements");

// Map evidence level to effectiveness rating
const evidenceLevelToRating: Record<string, number> = {
	STRONG: 8,
	MODERATE: 6,
	WEAK: 4,
	INSUFFICIENT: 2,
	CONFLICTING: 3,
};

console.log("🔧 Adding effectivenessRating to ClinicalApplication objects...");

let totalFiles = 0;
let totalFixes = 0;

function processFile(filePath: string) {
	const content = readFileSync(filePath, "utf-8");

	// Check if file has ClinicalApplication objects missing effectivenessRating
	if (!content.includes("clinicalApplications:")) {
		return;
	}

	let modified = content;
	let fileFixCount = 0;

	// Pattern: Find ClinicalApplication objects without effectivenessRating
	// Look for: condition, polishCondition, indication, polishIndication, efficacy, evidenceLevel
	// but NOT effectivenessRating
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
				`effectivenessRating: ${rating},\n\t\t\t$1`,
			);

			modified = modified.replace(fullMatch, replacement);
			fileFixCount++;
		}
	}

	if (fileFixCount > 0) {
		writeFileSync(filePath, modified, "utf-8");
		console.log(`✅ ${filePath.split("/").pop()}: ${fileFixCount} fixes`);
		totalFixes += fileFixCount;
	}
}

// Process all TypeScript files in supplements directory
const files = readdirSync(supplementsDir);

for (const file of files) {
	if (file.endsWith(".ts")) {
		const filePath = join(supplementsDir, file);
		try {
			processFile(filePath);
			totalFiles++;
		} catch (error) {
			console.error(`❌ Error processing ${file}:`, error);
		}
	}
}

console.log(`\n🎉 Processed ${totalFiles} files`);
console.log(`✅ Total effectivenessRating additions: ${totalFixes}`);
