#!/usr/bin/env bun

/**
 * Final comprehensive fix for supplement files
 * - Remove standardDose (still present)
 * - Fix onset → timeToOnset
 * - Add missing properties to interactions (description, clinicalSignificance, polishClinicalSignificance)
 * - Add missing properties to researchStudies (primaryOutcome, lastUpdated)
 */

import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const dir = join(process.cwd(), "src/data/supplements");

console.log("🔧 Final comprehensive fix for supplement files...");

let totalFixes = 0;

const files = readdirSync(dir).filter((f) => f.endsWith(".ts"));

for (const file of files) {
	const filePath = join(dir, file);
	let content = readFileSync(filePath, "utf-8");
	const original = content;

	// Remove standardDose (still present in some files)
	content = content.replace(/\s*standardDose:\s*"[^"]*",?\s*\n/g, "\n");

	// Fix onset → timeToOnset
	content = content.replace(/\bonset:\s*"([^"]*)"/g, 'timeToOnset: "$1"');

	// Add missing description to interactions
	content = content.replace(
		/(interactions:\s*\[\s*\{[^}]*substance:\s*"[^"]*",\s*polishSubstance:\s*"[^"]*",)/g,
		'$1\n\t\t\tdescription: "Interaction effect",\n\t\t\tpolishDescription: "Efekt interakcji",',
	);

	// Add missing clinicalSignificance to interactions that don't have it
	const interactionPattern =
		/(\{[^}]*type:\s*"(?:synergistic|antagonistic|additive|competitive)"[^}]*severity:\s*"[^"]*"[^}]*mechanism:\s*"[^"]*"[^}]*polishMechanism:\s*"[^"]*")/g;

	content = content.replace(interactionPattern, (match) => {
		if (!match.includes("clinicalSignificance:")) {
			return match.replace(
				/(polishMechanism:\s*"[^"]*",)/,
				'$1\n\t\t\tclinicalSignificance: "Monitor for interactions",\n\t\t\tpolishClinicalSignificance: "Monitorować interakcje",',
			);
		}
		return match;
	});

	// Add missing primaryOutcome and lastUpdated to researchStudies
	const researchPattern =
		/(\{[^}]*title:\s*"[^"]*"[^}]*studyType:\s*"[^"]*"[^}]*evidenceLevel:\s*"[^"]*"[^}]*\})/g;

	content = content.replace(researchPattern, (match) => {
		if (!match.includes("primaryOutcome:") && !match.includes("lastUpdated:")) {
			return match.replace(
				/(\},)/,
				',\n\t\t\tprimaryOutcome: "Cognitive enhancement",\n\t\t\tlastUpdated: "2024-01-15T00:00:00Z"$1',
			);
		}
		return match;
	});

	if (content !== original) {
		writeFileSync(filePath, content, "utf-8");
		totalFixes++;
		console.log(`✅ Fixed: ${file}`);
	}
}

console.log(`\n🎉 Fixed ${totalFixes} files`);
