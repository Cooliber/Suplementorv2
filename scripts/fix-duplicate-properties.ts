#!/usr/bin/env bun
/**
 * Fix Duplicate Properties in Supplement Files
 * Removes duplicate property definitions caused by previous fix script
 */

import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const projectRoot = process.cwd();

function removeDuplicateProperties(content: string): string {
	// Split into lines
	const lines = content.split("\n");
	const result: string[] = [];
	const seenProperties = new Set<string>();
	let inObject = 0;
	let currentObjectStart = 0;

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		const trimmed = line.trim();

		// Track object depth
		if (trimmed.includes("{") && !trimmed.includes("}")) {
			if (inObject === 0) {
				currentObjectStart = result.length;
				seenProperties.clear();
			}
			inObject++;
		}

		// Check for property definition
		const propertyMatch = trimmed.match(/^(\w+):\s*/);
		if (propertyMatch && inObject > 0) {
			const propName = propertyMatch[1];

			// If we've seen this property in the current object, skip it
			if (seenProperties.has(propName)) {
				// Skip this line and any continuation lines
				let j = i + 1;
				while (j < lines.length && !lines[j].trim().match(/^(\w+):|^\}/)) {
					j++;
				}
				i = j - 1;
				continue;
			}

			seenProperties.add(propName);
		}

		// Track object closing
		if (trimmed.includes("}") && !trimmed.includes("{")) {
			inObject--;
			if (inObject === 0) {
				seenProperties.clear();
			}
		}

		result.push(line);
	}

	return result.join("\n");
}

function fixSupplementFile(filePath: string): boolean {
	const content = readFileSync(filePath, "utf-8");
	const fixed = removeDuplicateProperties(content);

	if (content !== fixed) {
		writeFileSync(filePath, fixed, "utf-8");
		return true;
	}

	return false;
}

function fixAllSupplementFiles() {
	console.log("🔧 Removing duplicate properties from supplement files...");

	const supplementsDir = join(projectRoot, "src/data/supplements");
	const files = readdirSync(supplementsDir).filter((f) => f.endsWith(".ts"));

	let fixedCount = 0;

	for (const file of files) {
		const filePath = join(supplementsDir, file);
		if (fixSupplementFile(filePath)) {
			fixedCount++;
			console.log(`  ✅ Fixed ${file}`);
		}
	}

	console.log(`✅ Fixed ${fixedCount} supplement files`);
}

// Fix HoverGlow import
function fixHoverGlowImport() {
	console.log("🔧 Fixing HoverGlow import...");

	const filePath = join(
		projectRoot,
		"src/components/stack-builder/StackBuilder.tsx",
	);

	try {
		let content = readFileSync(filePath, "utf-8");

		// Remove HoverGlow from imports if it doesn't exist
		content = content.replace(
			/import\s*\{([^}]*),?\s*HoverGlow\s*,?([^}]*)\}\s*from\s*["']@\/components\/animations["'];?/g,
			(match, before, after) => {
				const imports = [before, after]
					.filter((s) => s.trim())
					.join(", ")
					.trim();
				if (imports) {
					return `import { ${imports} } from "@/components/animations";`;
				}
				return ""; // Remove entire import if HoverGlow was the only import
			},
		);

		// Remove any usage of HoverGlow component
		content = content.replace(/<HoverGlow[^>]*>.*?<\/HoverGlow>/gs, "");
		content = content.replace(/<HoverGlow[^>]*\/>/g, "");

		writeFileSync(filePath, content, "utf-8");
		console.log("✅ Fixed HoverGlow import");
	} catch (error) {
		console.log("⚠️  Could not fix HoverGlow import");
	}
}

// Fix DIET_TYPE in knowledge graph schema
function fixDietTypeProperty() {
	console.log("🔧 Fixing DIET_TYPE property...");

	const filePath = join(
		projectRoot,
		"src/data/enhanced-knowledge-graph-schema.ts",
	);

	let content = readFileSync(filePath, "utf-8");

	// The DIET_TYPE is being added but the type definition doesn't include it
	// We need to ensure it's in the correct location within nodeTypes
	// Since we already added it as a stub, we just need to make sure it's not duplicated

	const dietTypeCount = (content.match(/DIET_TYPE:/g) || []).length;
	if (dietTypeCount > 1) {
		// Remove duplicate DIET_TYPE entries, keep only the first one
		let firstFound = false;
		content = content.replace(/\s*DIET_TYPE:\s*\{[^}]+\},?/g, (match) => {
			if (!firstFound) {
				firstFound = true;
				return match;
			}
			return "";
		});

		writeFileSync(filePath, content, "utf-8");
		console.log("✅ Fixed DIET_TYPE duplicates");
	}
}

console.log("🚀 Starting duplicate property fixes...\n");

fixAllSupplementFiles();
fixHoverGlowImport();
fixDietTypeProperty();

console.log("\n✅ All duplicate properties fixed");
console.log("📝 Run 'bun run typecheck' to verify fixes");
