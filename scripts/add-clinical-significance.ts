#!/usr/bin/env bun

/**
 * Add missing clinicalSignificance to SupplementInteraction objects
 * Scans all supplement files and adds clinicalSignificance based on severity
 */

import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const supplementsDir = join(process.cwd(), "src/data/supplements");

// Map severity to clinical significance
const severityToSignificance: Record<string, string> = {
	severe: "High clinical significance - avoid combination",
	moderate: "Moderate clinical significance - monitor closely",
	minor: "Minor clinical significance - generally safe with monitoring",
	beneficial: "Beneficial interaction - may enhance effects",
};

const polishSignificance: Record<string, string> = {
	severe: "Wysokie znaczenie kliniczne - unikać kombinacji",
	moderate: "Umiarkowane znaczenie kliniczne - ścisłe monitorowanie",
	minor: "Niewielkie znaczenie kliniczne - ogólnie bezpieczne z monitorowaniem",
	beneficial: "Korzystna interakcja - może wzmocnić efekty",
};

console.log(
	"🔧 Adding clinicalSignificance to SupplementInteraction objects...",
);

let totalFiles = 0;
let totalFixes = 0;

function processFile(filePath: string) {
	const content = readFileSync(filePath, "utf-8");

	// Check if file has interactions
	if (!content.includes("interactions:")) {
		return;
	}

	let modified = content;
	let fileFixCount = 0;

	// Pattern: Find interaction objects with substance, type, severity but no clinicalSignificance
	const interactionPattern =
		/(\{\s*substance:\s*"[^"]+",\s*polishSubstance:\s*"[^"]+",\s*type:\s*"[^"]+",\s*severity:\s*"(severe|moderate|minor|beneficial)")/g;

	const matches = [...content.matchAll(interactionPattern)];

	for (const match of matches) {
		const fullMatch = match[0];
		const severity = match[2];

		// Check if this object already has clinicalSignificance
		const startIndex = match.index!;
		const endIndex = content.indexOf("}", startIndex);
		const objectContent = content.substring(startIndex, endIndex + 1);

		if (!objectContent.includes("clinicalSignificance:")) {
			const significance =
				severityToSignificance[severity] ||
				"Monitor for potential interactions";
			const polishSig =
				polishSignificance[severity] || "Monitorować potencjalne interakcje";

			// Add clinicalSignificance and polishClinicalSignificance after type
			const replacement = fullMatch.replace(
				/(type:\s*"[^"]+",)/,
				`$1\n\t\t\tclinicalSignificance: "${significance}",\n\t\t\tpolishClinicalSignificance: "${polishSig}",`,
			);

			modified = modified.replace(fullMatch, replacement);
			fileFixCount++;
		}
	}

	if (fileFixCount > 0) {
		writeFileSync(filePath, modified, "utf-8");
		console.log(`✅ ${filePath.split(/[/\\]/).pop()}: ${fileFixCount} fixes`);
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
console.log(`✅ Total clinicalSignificance additions: ${totalFixes}`);
