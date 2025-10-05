#!/usr/bin/env bun

/**
 * Add missing frequency property to sideEffects in comprehensive-supplements
 */

import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const dir = join(process.cwd(), "src/data/comprehensive-supplements");

console.log("🔧 Adding frequency to sideEffects...");

let totalFixes = 0;

const files = readdirSync(dir).filter(
	(f) => f.endsWith(".ts") && f !== "index.ts" && f !== "types.ts",
);

for (const file of files) {
	const filePath = join(dir, file);
	let content = readFileSync(filePath, "utf-8");
	const original = content;

	// Pattern: Find sideEffects objects without frequency
	// Add frequency: "uncommon" as default
	const sideEffectPattern =
		/(\{\s*effect:\s*"[^"]+",\s*polishEffect:\s*"[^"]+",\s*severity:\s*"(?:mild|moderate|severe)",\s*reversible:\s*(?:true|false))/g;

	const matches = [...content.matchAll(sideEffectPattern)];

	for (const match of matches) {
		const fullMatch = match[0];
		const startIndex = match.index!;
		const endIndex = content.indexOf("}", startIndex);
		const objectContent = content.substring(startIndex, endIndex + 1);

		if (!objectContent.includes("frequency:")) {
			// Add frequency after polishEffect
			const replacement = fullMatch.replace(
				/(polishEffect:\s*"[^"]+",)/,
				'$1\n\t\t\tfrequency: "uncommon",',
			);

			content = content.replace(fullMatch, replacement);
			totalFixes++;
		}
	}

	if (content !== original) {
		writeFileSync(filePath, content, "utf-8");
		console.log(`✅ Fixed: ${file}`);
	}
}

console.log(`\n🎉 Added ${totalFixes} frequency properties`);
