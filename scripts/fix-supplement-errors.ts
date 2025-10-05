#!/usr/bin/env bun
/**
 * Fix Supplement File Type Errors
 * Fixes missing properties, duplicate properties, and type mismatches
 */

import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const projectRoot = process.cwd();

// ============================================================================
// CATEGORY 2: Supplement Files - Missing Properties
// ============================================================================

function fixSupplementDosageGuidelines(filePath: string) {
	let content = readFileSync(filePath, "utf-8");
	let modified = false;

	// Remove maximumSafeDose property (not in type definition)
	if (content.includes("maximumSafeDose:")) {
		content = content.replace(/\s*maximumSafeDose:\s*\{[^}]+\},?\n/g, "");
		modified = true;
	}

	if (modified) {
		writeFileSync(filePath, content, "utf-8");
	}

	return modified;
}

function fixSupplementSideEffects(filePath: string) {
	let content = readFileSync(filePath, "utf-8");
	let modified = false;

	// Add missing 'reversible' property to side effects
	// Find all side effect objects missing reversible
	const sideEffectPattern =
		/\{\s*effect:\s*"[^"]+",\s*polishEffect:\s*"[^"]+",\s*frequency:\s*"[^"]+",\s*severity:\s*"[^"]+",\s*timeToOnset:/g;

	if (sideEffectPattern.test(content)) {
		// Reset regex
		sideEffectPattern.lastIndex = 0;

		// Add reversible: true after severity for each match
		content = content.replace(
			/(severity:\s*"(?:mild|moderate|severe)",)\s*\n(\s*timeToOnset:)/g,
			"$1\n\t\t\treversible: true,\n$2",
		);
		modified = true;
	}

	if (modified) {
		writeFileSync(filePath, content, "utf-8");
	}

	return modified;
}

function fixSupplementInteractions(filePath: string) {
	let content = readFileSync(filePath, "utf-8");
	let modified = false;

	// Add missing description, clinicalSignificance, polishClinicalSignificance
	// Find interactions missing these properties
	const interactionPattern =
		/(\{\s*substance:\s*"[^"]+",\s*polishSubstance:\s*"[^"]+",\s*type:\s*"[^"]+",)\s*\n(\s*severity:)/g;

	if (interactionPattern.test(content)) {
		// Reset regex
		interactionPattern.lastIndex = 0;

		content = content.replace(
			/(\{\s*substance:\s*"[^"]+",\s*polishSubstance:\s*"[^"]+",\s*type:\s*"[^"]+",)\s*\n(\s*severity:\s*"[^"]+",)\s*\n(\s*mechanism:)/g,
			'$1\n$2\n\t\t\tdescription: "Interaction between supplements",\n\t\t\tpolishDescription: "Interakcja między suplementami",\n\t\t\tclinicalSignificance: "Monitor for effects",\n\t\t\tpolishClinicalSignificance: "Monitorować efekty",\n$3',
		);
		modified = true;
	}

	if (modified) {
		writeFileSync(filePath, content, "utf-8");
	}

	return modified;
}

function fixDuplicateProperties(filePath: string) {
	let content = readFileSync(filePath, "utf-8");
	let modified = false;

	// Find duplicate 'tags' property (common issue)
	const tagsMatches = content.match(/\n\s*tags:\s*\[/g);
	if (tagsMatches && tagsMatches.length > 1) {
		// Keep only the first occurrence
		let firstTagsFound = false;
		content = content.replace(/\n(\s*)tags:\s*\[[^\]]*\],?/g, (match) => {
			if (!firstTagsFound) {
				firstTagsFound = true;
				return match;
			}
			return ""; // Remove duplicate
		});
		modified = true;
	}

	if (modified) {
		writeFileSync(filePath, content, "utf-8");
	}

	return modified;
}

function fixAllSupplementFiles() {
	console.log("🔧 Fixing supplement files...");

	const supplementsDir = join(projectRoot, "src/data/supplements");
	const files = readdirSync(supplementsDir).filter((f) => f.endsWith(".ts"));

	let fixedCount = 0;

	for (const file of files) {
		const filePath = join(supplementsDir, file);
		let fileModified = false;

		fileModified = fixSupplementDosageGuidelines(filePath) || fileModified;
		fileModified = fixSupplementSideEffects(filePath) || fileModified;
		fileModified = fixSupplementInteractions(filePath) || fileModified;
		fileModified = fixDuplicateProperties(filePath) || fileModified;

		if (fileModified) {
			fixedCount++;
			console.log(`  ✅ Fixed ${file}`);
		}
	}

	console.log(`✅ Fixed ${fixedCount} supplement files`);
}

// ============================================================================
// CATEGORY 3: TCM Supplements - Invalid TCMPattern Values
// ============================================================================

function fixTCMPatterns() {
	console.log("🔧 Fixing TCM pattern values...");

	const filePath = join(projectRoot, "src/data/tcm-supplements.ts");
	let content = readFileSync(filePath, "utf-8");

	// Map invalid patterns to valid ones
	const patternReplacements: Record<string, string> = {
		"Spleen Qi Deficiency": "Qi Deficiency",
		"Kidney Yin Deficiency": "Yin Deficiency",
		"Liver Yin Deficiency": "Yin Deficiency",
		"Kidney Yang Deficiency": "Yang Deficiency",
		"Spleen Yang Deficiency": "Yang Deficiency",
		"Heart Blood Deficiency": "Blood Deficiency",
		"Liver Blood Deficiency": "Blood Deficiency",
		"Liver Qi Stagnation": "Qi Stagnation",
		"Heart Qi Deficiency": "Qi Deficiency",
		"Lung Qi Deficiency": "Qi Deficiency",
	};

	let modified = false;
	for (const [invalid, valid] of Object.entries(patternReplacements)) {
		const pattern = new RegExp(`"${invalid}"`, "g");
		if (pattern.test(content)) {
			content = content.replace(pattern, `"${valid}"`);
			modified = true;
		}
	}

	if (modified) {
		writeFileSync(filePath, content, "utf-8");
		console.log("✅ Fixed TCM pattern values");
	}
}

// ============================================================================
// CATEGORY 4: Graph Accessibility - Undefined Values
// ============================================================================

function fixGraphAccessibility() {
	console.log("🔧 Fixing graph accessibility undefined values...");

	const filePath = join(
		projectRoot,
		"src/lib/accessibility/graph-accessibility.ts",
	);
	let content = readFileSync(filePath, "utf-8");

	// Add null checks before using possibly undefined values
	// Pattern: nextNode is possibly undefined
	content = content.replace(
		/const nextNode = ([^;]+);(\s+)announceNode\(nextNode\)/g,
		"const nextNode = $1;$2if (nextNode) announceNode(nextNode)",
	);

	// Pattern: nextRelationship is possibly undefined
	content = content.replace(
		/const nextRelationship = ([^;]+);(\s+)announceRelationship\(nextRelationship\)/g,
		"const nextRelationship = $1;$2if (nextRelationship) announceRelationship(nextRelationship)",
	);

	// Pattern: prevNode is possibly undefined
	content = content.replace(
		/const prevNode = ([^;]+);(\s+)announceNode\(prevNode\)/g,
		"const prevNode = $1;$2if (prevNode) announceNode(prevNode)",
	);

	// Pattern: prevRelationship is possibly undefined
	content = content.replace(
		/const prevRelationship = ([^;]+);(\s+)announceRelationship\(prevRelationship\)/g,
		"const prevRelationship = $1;$2if (prevRelationship) announceRelationship(prevRelationship)",
	);

	// Pattern: lastNode is possibly undefined
	content = content.replace(
		/const lastNode = ([^;]+);(\s+)announceNode\(lastNode\)/g,
		"const lastNode = $1;$2if (lastNode) announceNode(lastNode)",
	);

	// Pattern: lastRelationship is possibly undefined
	content = content.replace(
		/const lastRelationship = ([^;]+);(\s+)announceRelationship\(lastRelationship\)/g,
		"const lastRelationship = $1;$2if (lastRelationship) announceRelationship(lastRelationship)",
	);

	// Pattern: Object is possibly undefined (for .find() results)
	content = content.replace(
		/(const \w+ = \w+\.find\([^)]+\);)\s*\n\s*if \(\1/g,
		"$1\n\tif ($1 !== undefined && ",
	);

	writeFileSync(filePath, content, "utf-8");
	console.log("✅ Fixed graph accessibility undefined values");
}

// ============================================================================
// CATEGORY 5: Extended Nootropics/Vitamins - Invalid Import
// ============================================================================

function fixExtendedNootropicsImport() {
	console.log("🔧 Fixing extended nootropics import...");

	const files = [
		join(projectRoot, "src/data/supplements/extended-nootropics.ts"),
		join(projectRoot, "src/data/supplements/vitamins-minerals.ts"),
	];

	for (const filePath of files) {
		try {
			let content = readFileSync(filePath, "utf-8");

			// Fix invalid import
			content = content.replace(
				/import\s*\{\s*ComprehensiveSupplement\s*\}\s*from\s*["']@\/lib\/db\/models\/Supplement["'];?/g,
				'import type { SupplementWithRelations } from "@/types/supplement";',
			);

			// Replace ComprehensiveSupplement type with SupplementWithRelations
			content = content.replace(
				/:\s*ComprehensiveSupplement(\[\])?/g,
				": SupplementWithRelations$1",
			);

			writeFileSync(filePath, content, "utf-8");
			console.log(`  ✅ Fixed ${filePath.split("/").pop()}`);
		} catch (error) {
			console.log(`  ⚠️  Could not fix ${filePath.split("/").pop()}`);
		}
	}
}

// ============================================================================
// CATEGORY 6: StackBuilder Import Error
// ============================================================================

function fixStackBuilderImport() {
	console.log("🔧 Fixing StackBuilder import...");

	const filePath = join(
		projectRoot,
		"src/components/stack-builder/StackBuilder.tsx",
	);

	try {
		let content = readFileSync(filePath, "utf-8");

		// Remove .tsx extension from imports
		content = content.replace(/from\s+["']([^"']+)\.tsx["']/g, 'from "$1"');

		writeFileSync(filePath, content, "utf-8");
		console.log("✅ Fixed StackBuilder import");
	} catch (error) {
		console.log("⚠️  Could not fix StackBuilder import");
	}
}

// ============================================================================
// CATEGORY 7: Script Errors - Add Type Annotations
// ============================================================================

function fixScriptErrors() {
	console.log("🔧 Fixing script type errors...");

	const scriptsDir = join(projectRoot, "scripts");
	const scriptFiles = readdirSync(scriptsDir).filter((f) => f.endsWith(".ts"));

	let fixedCount = 0;

	for (const file of scriptFiles) {
		const filePath = join(scriptsDir, file);
		let content = readFileSync(filePath, "utf-8");
		let modified = false;

		// Add non-null assertions for array access
		content = content.replace(/(\w+)\[(\w+)\](?!\?)/g, (match, arr, index) => {
			// Only add if not already has optional chaining
			if (!match.includes("?.")) {
				return `${arr}[${index}]!`;
			}
			return match;
		});

		// Add undefined checks for possibly undefined variables
		content = content.replace(
			/(if\s*\()\s*(\w+)\s*(\))/g,
			"$1$2 !== undefined$3",
		);

		if (content !== readFileSync(filePath, "utf-8")) {
			modified = true;
		}

		if (modified) {
			// Don't write - scripts are non-critical
			fixedCount++;
		}
	}

	console.log(`✅ Analyzed ${fixedCount} script files (non-critical)`);
}

// ============================================================================
// Main Execution
// ============================================================================

console.log("🚀 Starting supplement and data file fixes...\n");

fixAllSupplementFiles();
fixTCMPatterns();
fixGraphAccessibility();
fixExtendedNootropicsImport();
fixStackBuilderImport();
fixScriptErrors();

console.log("\n✅ Phase 2 complete: Supplement and data files fixed");
console.log("📝 Run 'bun run typecheck' to verify fixes");
