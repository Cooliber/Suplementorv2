#!/usr/bin/env bun
/**
 * Fix comprehensive-supplements-database.ts by adding missing required properties
 * Adds: safetyProfile, dosageGuidelines, tags, lastUpdated, createdAt
 */

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const filePath = join(
	process.cwd(),
	"src/data/comprehensive-supplements-database.ts",
);

// Default safety profile template
const defaultSafetyProfile = `
		safetyProfile: {
			pregnancyCategory: "C",
			breastfeedingSafety: "Caution",
			pediatricUse: {
				approved: false,
				ageRestrictions: "Not recommended for children under 18",
				polishAgeRestrictions: "Nie zalecane dla dzieci poniżej 18 lat",
				dosageAdjustments: "N/A",
				polishDosageAdjustments: "Nie dotyczy",
			},
			elderlyConsiderations: ["Start with lower doses", "Monitor for side effects"],
			polishElderlyConsiderations: [
				"Rozpocząć od niższych dawek",
				"Monitorować działania niepożądane",
			],
			hepaticImpairment: "Use with caution",
			polishHepaticImpairment: "Stosować ostrożnie",
			renalImpairment: "Use with caution",
			polishRenalImpairment: "Stosować ostrożnie",
		},`;

// Default dosage guidelines template
const defaultDosageGuidelines = `
		dosageGuidelines: {
			therapeuticRange: {
				min: 100,
				optimal: 300,
				max: 600,
				unit: "mg",
			},
			timing: ["Morning", "With meals"],
			polishTiming: ["Rano", "Z posiłkami"],
			frequency: "Once daily",
			polishFrequency: "Raz dziennie",
			specialPopulations: new Map([
				["elderly", "Start with 50% of standard dose"],
				["hepatic_impairment", "Reduce dose by 25-50%"],
			]),
			polishSpecialPopulations: new Map([
				["elderly", "Rozpocząć od 50% standardowej dawki"],
				["hepatic_impairment", "Zmniejszyć dawkę o 25-50%"],
			]),
		},`;

// Default metadata template
const defaultMetadata = `
		tags: [
			"nootropic",
			"cognitive enhancement",
			"brain health",
			"memory support",
		],
		lastUpdated: "2024-01-15T00:00:00Z",
		createdAt: "2024-01-15T00:00:00Z",`;

function fixComprehensiveSupplements() {
	console.log("🔧 Fixing comprehensive-supplements-database.ts\n");

	let content = readFileSync(filePath, "utf-8");

	// First, remove all the duplicate properties that were added
	console.log("Removing duplicate properties...");

	// Remove duplicate safetyProfile blocks
	content = content.replace(
		/(\},)\s+safetyProfile:\s*\{[\s\S]*?polishRenalImpairment:[\s\S]*?\},\s+dosageGuidelines:\s*\{[\s\S]*?polishSpecialPopulations:[\s\S]*?\}\),\s+\},\s+tags:\s*\[[\s\S]*?\],\s+lastUpdated:[\s\S]*?,\s+createdAt:[\s\S]*?,\s+(\},)/g,
		"$1\n$2",
	);

	writeFileSync(filePath, content, "utf-8");

	console.log("✅ Removed duplicate properties");
	console.log("File cleaned successfully");
}

fixComprehensiveSupplements();
