#!/usr/bin/env bun
/**
 * Automated TypeScript Error Fixer for Supplement Data Files
 * Adds missing properties to ClinicalApplication, MechanismOfAction, and SupplementInteraction objects
 */

import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

interface FixStats {
	filesProcessed: number;
	effectivenessRatingAdded: number;
	polishPathwayAdded: number;
	clinicalSignificanceAdded: number;
}

const stats: FixStats = {
	filesProcessed: 0,
	effectivenessRatingAdded: 0,
	polishPathwayAdded: 0,
	clinicalSignificanceAdded: 0,
};

/**
 * Add effectivenessRating to ClinicalApplication objects
 */
function addEffectivenessRating(content: string): string {
	// Pattern: clinicalApplications array with objects missing effectivenessRating
	// Look for objects with efficacy but no effectivenessRating
	const pattern =
		/(clinicalApplications:\s*\[[\s\S]*?)\{(\s+condition:[\s\S]*?efficacy:\s*"(high|moderate|low|insufficient)"[\s\S]*?evidenceLevel:[\s\S]*?)\}/g;

	let newContent = content;
	let match;
	let count = 0;

	// Reset regex
	pattern.lastIndex = 0;

	while ((match = pattern.exec(content)) !== null) {
		const fullMatch = match[0];
		const prefix = match[1];
		const objectContent = match[2];
		const efficacy = match[3];

		// Check if effectivenessRating already exists
		if (!objectContent.includes("effectivenessRating")) {
			// Calculate rating based on efficacy
			let rating = 7; // default
			if (efficacy === "high") rating = 8;
			else if (efficacy === "moderate") rating = 7;
			else if (efficacy === "low") rating = 5;
			else if (efficacy === "insufficient") rating = 3;

			// Add effectivenessRating after efficacy
			const updatedObject = objectContent.replace(
				/(efficacy:\s*"[^"]+",)/,
				`$1\n\t\teffectivenessRating: ${rating},`,
			);

			newContent = newContent.replace(fullMatch, `${prefix}{${updatedObject}}`);
			count++;
		}
	}

	stats.effectivenessRatingAdded += count;
	return newContent;
}

/**
 * Add polishPathway to MechanismOfAction objects
 */
function addPolishPathway(content: string): string {
	// Pattern: mechanisms array with objects missing polishPathway
	const pattern =
		/(mechanisms:\s*\[[\s\S]*?)\{(\s+id:[\s\S]*?pathway:\s*"([^"]+)"[\s\S]*?description:[\s\S]*?)\}/g;

	let newContent = content;
	let match;
	let count = 0;

	pattern.lastIndex = 0;

	while ((match = pattern.exec(content)) !== null) {
		const fullMatch = match[0];
		const prefix = match[1];
		const objectContent = match[2];
		const pathway = match[3];

		// Check if polishPathway already exists
		if (!objectContent.includes("polishPathway")) {
			// Simple translation mapping
			const polishPathways: Record<string, string> = {
				"Acetylcholine synthesis": "Synteza acetylocholiny",
				"Dopamine modulation": "Modulacja dopaminy",
				"Serotonin synthesis": "Synteza serotoniny",
				"GABA modulation": "Modulacja GABA",
				"Glutamate modulation": "Modulacja glutaminianu",
				"Mitochondrial function": "Funkcja mitochondrialna",
				Neuroprotection: "Neuroprotekcja",
				Neuroplasticity: "Neuroplastyczność",
				"Antioxidant activity": "Aktywność antyoksydacyjna",
				"Anti-inflammatory": "Działanie przeciwzapalne",
			};

			const polishPathway = polishPathways[pathway] || pathway; // fallback to English if no translation

			// Add polishPathway after pathway
			const updatedObject = objectContent.replace(
				/(pathway:\s*"[^"]+",)/,
				`$1\n\t\tpolishPathway: "${polishPathway}",`,
			);

			newContent = newContent.replace(fullMatch, `${prefix}{${updatedObject}}`);
			count++;
		}
	}

	stats.polishPathwayAdded += count;
	return newContent;
}

/**
 * Add clinicalSignificance to SupplementInteraction objects
 */
function addClinicalSignificance(content: string): string {
	// Pattern: interactions array with objects missing clinicalSignificance
	const pattern =
		/(interactions:\s*\[[\s\S]*?)\{(\s+substance:[\s\S]*?type:\s*"(synergistic|antagonistic|additive|competitive)"[\s\S]*?severity:\s*"(minor|moderate|severe|beneficial)"[\s\S]*?description:[\s\S]*?)\}/g;

	let newContent = content;
	let match;
	let count = 0;

	pattern.lastIndex = 0;

	while ((match = pattern.exec(content)) !== null) {
		const fullMatch = match[0];
		const prefix = match[1];
		const objectContent = match[2];
		const type = match[3];
		const severity = match[4];

		// Check if clinicalSignificance already exists
		if (!objectContent.includes("clinicalSignificance")) {
			// Generate clinical significance based on type and severity
			let significance = "";
			let polishSignificance = "";

			if (type === "antagonistic" && severity === "moderate") {
				significance = "May reduce effectiveness; monitor closely";
				polishSignificance = "Może zmniejszyć skuteczność; monitoruj uważnie";
			} else if (type === "synergistic" && severity === "beneficial") {
				significance = "Enhances therapeutic effects; beneficial combination";
				polishSignificance =
					"Wzmacnia efekty terapeutyczne; korzystna kombinacja";
			} else if (severity === "severe") {
				significance = "Significant interaction; avoid combination";
				polishSignificance = "Znacząca interakcja; unikaj kombinacji";
			} else if (severity === "minor") {
				significance = "Minor interaction; generally safe";
				polishSignificance = "Niewielka interakcja; ogólnie bezpieczna";
			} else {
				significance = "Moderate interaction; use with caution";
				polishSignificance = "Umiarkowana interakcja; stosuj ostrożnie";
			}

			// Add clinicalSignificance after description
			const updatedObject = objectContent.replace(
				/(description:\s*"[^"]+",)/,
				`$1\n\t\tclinicalSignificance: "${significance}",\n\t\tpolishClinicalSignificance: "${polishSignificance}",`,
			);

			newContent = newContent.replace(fullMatch, `${prefix}{${updatedObject}}`);
			count++;
		}
	}

	stats.clinicalSignificanceAdded += count;
	return newContent;
}

/**
 * Process a single file
 */
function processFile(filePath: string): void {
	console.log(`Processing: ${filePath}`);

	let content = readFileSync(filePath, "utf-8");

	// Apply all fixes
	content = addEffectivenessRating(content);
	content = addPolishPathway(content);
	content = addClinicalSignificance(content);

	// Write back
	writeFileSync(filePath, content, "utf-8");
	stats.filesProcessed++;
}

/**
 * Main execution
 */
function main() {
	console.log("🔧 Starting TypeScript Error Fixer for Supplement Data Files\n");

	// Find all supplement data files
	const supplementsDir = join(process.cwd(), "src/data/supplements");
	const allFiles = readdirSync(supplementsDir);
	const files = allFiles
		.filter(
			(f) =>
				f.endsWith(".ts") && !f.includes(".test.") && !f.includes(".spec."),
		)
		.map((f) => join(supplementsDir, f));

	console.log(`Found ${files.length} supplement files to process\n`);

	// Process each file
	for (const file of files) {
		processFile(file);
	}

	// Print statistics
	console.log("\n✅ Processing Complete!");
	console.log("═".repeat(50));
	console.log(`Files Processed: ${stats.filesProcessed}`);
	console.log(`effectivenessRating Added: ${stats.effectivenessRatingAdded}`);
	console.log(`polishPathway Added: ${stats.polishPathwayAdded}`);
	console.log(`clinicalSignificance Added: ${stats.clinicalSignificanceAdded}`);
	console.log("═".repeat(50));
}

main();
