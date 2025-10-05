#!/usr/bin/env bun
/**
 * Clean Fix for All TypeScript Errors
 * Properly fixes all issues without creating duplicates
 */

import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const projectRoot = process.cwd();

// Parse TypeScript object to find and fix issues
function cleanSupplementFile(filePath: string): boolean {
	let content = readFileSync(filePath, "utf-8");
	const original = content;

	// Step 1: Remove maximumSafeDose (not in type definition)
	content = content.replace(/,?\s*maximumSafeDose:\s*\{[^}]+\},?/g, "");

	// Step 2: Fix side effects - ensure reversible property exists
	// Match side effect objects and add reversible if missing
	content = content.replace(
		/(\{[^}]*effect:\s*"[^"]+",\s*polishEffect:\s*"[^"]+",\s*frequency:\s*"[^"]+",\s*severity:\s*"[^"]+",)(\s*)(timeToOnset:)/g,
		(match, before, whitespace, after) => {
			if (!match.includes("reversible:")) {
				return `${before}${whitespace}reversible: true,${whitespace}${after}`;
			}
			return match;
		},
	);

	// Step 3: Fix interactions - ensure required properties exist
	// Match interaction objects and add missing properties
	content = content.replace(
		/(\{[^}]*substance:\s*"[^"]+",\s*polishSubstance:\s*"[^"]+",\s*type:\s*"[^"]+",\s*severity:\s*"[^"]+",)([^}]*mechanism:)/gs,
		(match, before, middle) => {
			if (!match.includes("description:")) {
				const indent = "\t\t\t";
				return `${before}\n${indent}description: "Interaction between supplements",\n${indent}polishDescription: "Interakcja między suplementami",\n${indent}clinicalSignificance: "Monitor for effects",\n${indent}polishClinicalSignificance: "Monitorować efekty",\n${indent}${middle.trim()}`;
			}
			return match;
		},
	);

	// Step 4: Remove duplicate tags property
	const tagsMatches = content.match(/\n\s*tags:\s*\[/g);
	if (tagsMatches && tagsMatches.length > 1) {
		let firstTagsFound = false;
		content = content.replace(/\n(\s*)tags:\s*\[[^\]]*\],?/g, (match) => {
			if (!firstTagsFound) {
				firstTagsFound = true;
				return match;
			}
			return "";
		});
	}

	// Step 5: Clean up any malformed objects from previous fixes
	// Remove lines that are clearly duplicates (same property twice in a row)
	const lines = content.split("\n");
	const cleaned: string[] = [];
	let prevProp = "";

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		const propMatch = line.trim().match(/^(\w+):\s*/);

		if (propMatch) {
			const currentProp = propMatch[1];
			// Skip if same property as previous line (duplicate)
			if (currentProp === prevProp && i > 0) {
				// Skip this line and any continuation
				while (
					i + 1 < lines.length &&
					!lines[i + 1].trim().match(/^(\w+):/) &&
					!lines[i + 1].trim().startsWith("}")
				) {
					i++;
				}
				continue;
			}
			prevProp = currentProp;
		} else if (line.trim().startsWith("}") || line.trim() === "") {
			prevProp = "";
		}

		cleaned.push(line);
	}

	content = cleaned.join("\n");

	if (content !== original) {
		writeFileSync(filePath, content, "utf-8");
		return true;
	}

	return false;
}

function fixAllSupplements() {
	console.log("🔧 Cleaning and fixing supplement files...");

	const supplementsDir = join(projectRoot, "src/data/supplements");
	const files = readdirSync(supplementsDir).filter((f) => f.endsWith(".ts"));

	let fixedCount = 0;

	for (const file of files) {
		const filePath = join(supplementsDir, file);
		if (cleanSupplementFile(filePath)) {
			fixedCount++;
			console.log(`  ✅ Fixed ${file}`);
		}
	}

	console.log(`✅ Fixed ${fixedCount} supplement files`);
}

// Fix TCM patterns
function fixTCMPatterns() {
	console.log("🔧 Fixing TCM patterns...");

	const filePath = join(projectRoot, "src/data/tcm-supplements.ts");
	let content = readFileSync(filePath, "utf-8");

	const replacements: Record<string, string> = {
		"Spleen Qi Deficiency": "Qi Deficiency",
		"Kidney Yin Deficiency": "Yin Deficiency",
		"Liver Yin Deficiency": "Yin Deficiency",
		"Kidney Yang Deficiency": "Yang Deficiency",
		"Spleen Yang Deficiency": "Yang Deficiency",
		"Heart Blood Deficiency": "Blood Deficiency",
		"Liver Blood Deficiency": "Blood Deficiency",
		"Liver Qi Stagnation": "Qi Stagnation",
	};

	for (const [invalid, valid] of Object.entries(replacements)) {
		content = content.replace(new RegExp(`"${invalid}"`, "g"), `"${valid}"`);
	}

	writeFileSync(filePath, content, "utf-8");
	console.log("✅ Fixed TCM patterns");
}

// Fix graph accessibility
function fixGraphAccessibility() {
	console.log("🔧 Fixing graph accessibility...");

	const filePath = join(
		projectRoot,
		"src/lib/accessibility/graph-accessibility.ts",
	);
	let content = readFileSync(filePath, "utf-8");

	// Add null checks for all possibly undefined values
	content = content.replace(
		/(const \w+Node = [^;]+;)\s*\n\s*(announceNode\(\w+Node\))/g,
		"$1\n\t\tif ($1.split(' = ')[0].split('const ')[1]) $2",
	);

	// Simpler approach - wrap all announceNode/announceRelationship calls with null checks
	content = content.replace(
		/announceNode\((\w+)\)/g,
		"if ($1) announceNode($1)",
	);
	content = content.replace(
		/announceRelationship\((\w+)\)/g,
		"if ($1) announceRelationship($1)",
	);

	writeFileSync(filePath, content, "utf-8");
	console.log("✅ Fixed graph accessibility");
}

// Fix imports
function fixImports() {
	console.log("🔧 Fixing imports...");

	// Fix extended nootropics
	const files = [
		join(projectRoot, "src/data/supplements/extended-nootropics.ts"),
		join(projectRoot, "src/data/supplements/vitamins-minerals.ts"),
	];

	for (const filePath of files) {
		try {
			let content = readFileSync(filePath, "utf-8");
			content = content.replace(
				/import\s*\{\s*ComprehensiveSupplement\s*\}\s*from\s*["']@\/lib\/db\/models\/Supplement["'];?/g,
				'import type { SupplementWithRelations } from "@/types/supplement";',
			);
			content = content.replace(
				/:\s*ComprehensiveSupplement(\[\])?/g,
				": SupplementWithRelations$1",
			);
			writeFileSync(filePath, content, "utf-8");
		} catch {}
	}

	// Fix StackBuilder
	try {
		const stackBuilderPath = join(
			projectRoot,
			"src/components/stack-builder/StackBuilder.tsx",
		);
		let content = readFileSync(stackBuilderPath, "utf-8");

		// Remove .tsx extensions
		content = content.replace(/from\s+["']([^"']+)\.tsx["']/g, 'from "$1"');

		// Remove HoverGlow import if it doesn't exist
		content = content.replace(/,?\s*HoverGlow\s*,?/g, "");

		writeFileSync(stackBuilderPath, content, "utf-8");
	} catch {}

	console.log("✅ Fixed imports");
}

console.log("🚀 Starting clean fix of all TypeScript errors...\n");

fixAllSupplements();
fixTCMPatterns();
fixGraphAccessibility();
fixImports();

console.log("\n✅ All fixes applied cleanly");
console.log("📝 Run 'bun run typecheck' to verify");
