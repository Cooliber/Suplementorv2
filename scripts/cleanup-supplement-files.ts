#!/usr/bin/env bun

/**
 * Cleanup supplement files - remove invalid properties
 */

import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const dir = join(process.cwd(), "src/data/supplements");

console.log("🔧 Cleaning up supplement files...");

let totalFixes = 0;

const files = readdirSync(dir).filter((f) => f.endsWith(".ts"));

for (const file of files) {
	const filePath = join(dir, file);
	let content = readFileSync(filePath, "utf-8");
	const original = content;

	// Remove polishOnset
	content = content.replace(/\s*polishOnset:\s*"[^"]*",?\s*\n/g, "\n");

	// Remove standardDose (with various patterns)
	content = content.replace(/\s*standardDose:\s*"[^"]*",?\s*\n/g, "\n");
	content = content.replace(/\s*standardDose:\s*\{[^}]*\},?\s*\n/g, "\n");

	// Remove polishDescription and description from interactions if they're just "Interaction effect"
	content = content.replace(
		/\s*description:\s*"Interaction effect",?\s*\n/g,
		"\n",
	);
	content = content.replace(
		/\s*polishDescription:\s*"Efekt interakcji",?\s*\n/g,
		"\n",
	);

	if (content !== original) {
		writeFileSync(filePath, content, "utf-8");
		totalFixes++;
		console.log(`✅ Fixed: ${file}`);
	}
}

console.log(`\n🎉 Fixed ${totalFixes} files`);
