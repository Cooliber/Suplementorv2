#!/usr/bin/env bun

/**
 * Fix invalid properties in comprehensive-supplements files
 * - Remove dosageAdjustments and polishDosageAdjustments
 * - Remove frequency, polishFrequency, specialPopulations, polishSpecialPopulations
 */

import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const dir = join(process.cwd(), "src/data/comprehensive-supplements");

console.log("🔧 Fixing comprehensive-supplements properties...");

let totalFixes = 0;

const files = readdirSync(dir).filter(
	(f) => f.endsWith(".ts") && f !== "index.ts" && f !== "types.ts",
);

for (const file of files) {
	const filePath = join(dir, file);
	let content = readFileSync(filePath, "utf-8");
	const original = content;

	// Remove dosageAdjustments and polishDosageAdjustments
	content = content.replace(/\s*dosageAdjustments:\s*"[^"]*",?\s*/g, "\n");
	content = content.replace(
		/\s*polishDosageAdjustments:\s*"[^"]*",?\s*/g,
		"\n",
	);

	// Remove frequency and polishFrequency
	content = content.replace(/\s*frequency:\s*"[^"]*",?\s*/g, "\n");
	content = content.replace(/\s*polishFrequency:\s*"[^"]*",?\s*/g, "\n");

	// Remove specialPopulations and polishSpecialPopulations (Map objects)
	content = content.replace(
		/\s*specialPopulations:\s*new Map\([^)]*\),?\s*/g,
		"\n",
	);
	content = content.replace(
		/\s*polishSpecialPopulations:\s*new Map\([^)]*\),?\s*/g,
		"\n",
	);

	if (content !== original) {
		writeFileSync(filePath, content, "utf-8");
		totalFixes++;
		console.log(`✅ Fixed: ${file}`);
	}
}

console.log(`\n🎉 Fixed ${totalFixes} files`);
