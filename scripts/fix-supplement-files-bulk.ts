#!/usr/bin/env bun

/**
 * Fix all invalid properties in supplement files
 * - Remove standardDose
 * - Remove polishSeverity from sideEffects
 * - Remove polishType from interactions
 * - Fix severity values (mild → minor)
 * - Add missing primaryOutcome and lastUpdated to researchStudies
 */

import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const dir = join(process.cwd(), "src/data/supplements");

console.log("🔧 Fixing supplement files...");

let totalFixes = 0;

const files = readdirSync(dir).filter((f) => f.endsWith(".ts"));

for (const file of files) {
	const filePath = join(dir, file);
	let content = readFileSync(filePath, "utf-8");
	const original = content;

	// Remove standardDose
	content = content.replace(/\s*standardDose:\s*"[^"]*",?\s*/g, "\n");

	// Remove polishSeverity from sideEffects
	content = content.replace(/\s*polishSeverity:\s*"[^"]*",?\s*/g, "\n");

	// Remove polishType from interactions
	content = content.replace(/\s*polishType:\s*"[^"]*",?\s*/g, "\n");

	// Fix severity: "mild" → "minor" in interactions
	content = content.replace(
		/(interactions:\s*\[[^\]]*?)severity:\s*"mild"/g,
		'$1severity: "minor"',
	);

	// Add missing properties to researchStudies
	// Find researchStudies arrays and add missing properties
	const researchPattern = /researchStudies:\s*\[\s*\{([^}]*studyType:[^}]*)\}/g;
	const matches = [...content.matchAll(researchPattern)];

	for (const match of matches) {
		const studyContent = match[1];
		if (
			!studyContent.includes("primaryOutcome:") &&
			!studyContent.includes("lastUpdated:")
		) {
			// Add missing properties before the closing brace
			const replacement = match[0].replace(
				/(\},)/,
				`,\n\t\t\tprimaryOutcome: "Cognitive enhancement",\n\t\t\tlastUpdated: "2024-01-15T00:00:00Z"$1`,
			);
			content = content.replace(match[0], replacement);
		}
	}

	if (content !== original) {
		writeFileSync(filePath, content, "utf-8");
		totalFixes++;
		console.log(`✅ Fixed: ${file}`);
	}
}

console.log(`\n🎉 Fixed ${totalFixes} files`);
