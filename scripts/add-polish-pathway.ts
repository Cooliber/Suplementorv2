#!/usr/bin/env bun

/**
 * Add missing polishPathway to MechanismOfAction objects
 */

import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const supplementsDir = join(process.cwd(), "src/data/supplements");

console.log("🔧 Adding polishPathway to MechanismOfAction objects...");

let totalFiles = 0;
let totalFixes = 0;

function processFile(filePath: string) {
	const content = readFileSync(filePath, "utf-8");

	// Check if file has mechanisms
	if (!content.includes("mechanisms:")) {
		return;
	}

	let modified = content;
	let fileFixCount = 0;

	// Pattern: Find mechanism objects with pathway but no polishPathway
	// Look for: pathway: "...", description: "...", polishDescription: "..."
	const lines = content.split("\n");

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];

		// Find pathway: "..." lines
		if (line.includes("pathway:") && line.includes('"')) {
			// Extract the pathway value
			const pathwayMatch = line.match(/pathway:\s*"([^"]+)"/);
			if (!pathwayMatch) continue;

			const pathwayValue = pathwayMatch[1];

			// Check if next few lines have polishPathway
			let hasPolishPathway = false;
			for (let j = i; j < Math.min(i + 10, lines.length); j++) {
				if (lines[j].includes("polishPathway:")) {
					hasPolishPathway = true;
					break;
				}
				// Stop if we hit the next property that's not part of this object
				if (
					lines[j].includes("description:") ||
					lines[j].includes("evidenceLevel:")
				) {
					break;
				}
			}

			if (!hasPolishPathway) {
				// Add polishPathway after pathway line
				const indent = line.match(/^\s*/)?.[0] || "\t\t\t";
				const polishPathwayLine = `${indent}polishPathway: "${pathwayValue}",`;
				lines.splice(i + 1, 0, polishPathwayLine);
				fileFixCount++;
				i++; // Skip the newly added line
			}
		}
	}

	if (fileFixCount > 0) {
		modified = lines.join("\n");
		writeFileSync(filePath, modified, "utf-8");
		console.log(`✅ ${filePath.split(/[/\\]/).pop()}: ${fileFixCount} fixes`);
		totalFixes += fileFixCount;
	}
}

// Process all TypeScript files in supplements directory
const files = readdirSync(supplementsDir);

for (const file of files) {
	if (file.endsWith(".ts") && file !== "index.ts") {
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
console.log(`✅ Total polishPathway additions: ${totalFixes}`);
