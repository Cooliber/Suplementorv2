#!/usr/bin/env bun

/**
 * Add missing properties to pediatricUse and dosageGuidelines
 */

import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const dir = join(process.cwd(), "src/data/comprehensive-supplements");

console.log("🔧 Fixing missing properties...");

let totalFixes = 0;

const files = readdirSync(dir).filter(
	(f) => f.endsWith(".ts") && f !== "index.ts" && f !== "types.ts",
);

for (const file of files) {
	const filePath = join(dir, file);
	let content = readFileSync(filePath, "utf-8");
	const original = content;

	// Fix pediatricUse - add missing specialConsiderations
	content = content.replace(
		/(pediatricUse:\s*\{\s*approved:\s*false,\s*ageLimit:\s*"[^"]+",)\s*\}/g,
		`$1
				specialConsiderations: ["Consult physician before use"],
				polishSpecialConsiderations: ["Skonsultuj się z lekarzem przed użyciem"],
			}`,
	);

	// Fix dosageGuidelines - add missing properties
	content = content.replace(
		/(dosageGuidelines:\s*\{\s*therapeuticRange:\s*\{[^}]+\},\s*timing:\s*\[[^\]]+\],)\s*\}/g,
		`$1
				withFood: true,
				contraindications: [],
				polishContraindications: [],
				interactions: [],
			}`,
	);

	if (content !== original) {
		writeFileSync(filePath, content, "utf-8");
		totalFixes++;
		console.log(`✅ Fixed: ${file}`);
	}
}

console.log(`\n🎉 Fixed ${totalFixes} files`);
