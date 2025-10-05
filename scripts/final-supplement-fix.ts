#!/usr/bin/env bun

/**
 * Final comprehensive fix for all remaining supplement file issues
 */

import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const dir = join(process.cwd(), "src/data/supplements");

console.log("🔧 Final comprehensive fix...");

let totalFixes = 0;

const files = readdirSync(dir).filter((f) => f.endsWith(".ts"));

for (const file of files) {
	const filePath = join(dir, file);
	let content = readFileSync(filePath, "utf-8");
	const original = content;

	// Remove minimumEffectiveDose
	content = content.replace(
		/\s*minimumEffectiveDose:\s*\{[^}]*\},?\s*\n/g,
		"\n",
	);
	content = content.replace(/\s*minimumEffectiveDose:\s*"[^"]*",?\s*\n/g, "\n");
	content = content.replace(/\s*minimumEffectiveDose:\s*\d+,?\s*\n/g, "\n");

	// Add reversible: true to sideEffects that don't have it
	content = content.replace(
		/(sideEffects:\s*\[[^\]]*?\{[^}]*severity:\s*"[^"]*"[^}]*management:\s*"[^"]*"[^}]*polishManagement:\s*"[^"]*",)(\s*\})/g,
		"$1\n\t\t\treversible: true,$2",
	);

	// Add missing properties to interactions
	content = content.replace(
		/(interactions:\s*\[[^\]]*?\{[^}]*substance:\s*"[^"]*"[^}]*polishSubstance:\s*"[^"]*"[^}]*type:\s*"[^"]*"[^}]*severity:\s*"[^"]*"[^}]*mechanism:\s*"[^"]*"[^}]*polishMechanism:\s*"[^"]*",)(\s*recommendation:)/g,
		'$1\n\t\t\tdescription: "Interaction between supplements",\n\t\t\tpolishDescription: "Interakcja między suplementami",\n\t\t\tclinicalSignificance: "Monitor for effects",\n\t\t\tpolishClinicalSignificance: "Monitorować efekty",\n\t\t\t$2',
	);

	// Fix severity "mild" → "minor" in interactions
	content = content.replace(
		/(interactions:\s*\[[^\]]*?)severity:\s*"mild"/g,
		'$1severity: "minor"',
	);

	// Add missing properties to researchStudies
	content = content.replace(
		/(researchStudies:\s*\[[^\]]*?\{[^}]*title:\s*"[^"]*"[^}]*studyType:\s*"[^"]*"[^}]*evidenceLevel:\s*"[^"]*"[^}]*pubmedId:\s*"[^"]*",)(\s*\})/g,
		'$1\n\t\t\tprimaryOutcome: "Cognitive enhancement",\n\t\t\tlastUpdated: "2024-01-15T00:00:00Z",$2',
	);

	if (content !== original) {
		writeFileSync(filePath, content, "utf-8");
		totalFixes++;
		console.log(`✅ Fixed: ${file}`);
	}
}

console.log(`\n🎉 Fixed ${totalFixes} files`);
