#!/usr/bin/env node
/**
 * Automated TypeScript Error Fix Script
 * Fixes common type errors in comprehensive-supplements-database.ts
 */

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const filePath = join(
	process.cwd(),
	"src/data/comprehensive-supplements-database.ts",
);

console.log("🔧 Starting automated TypeScript error fixes...\n");

// Read the file
let content = readFileSync(filePath, "utf-8");
const originalContent = content;

// Track changes
let changeCount = 0;

// 1. Fix property name mismatches
console.log("1️⃣ Fixing property name mismatches...");
const propertyFixes = [
	{
		from: /recommendedDosage:/g,
		to: "recommendedDose:",
		name: "recommendedDosage → recommendedDose",
	},
	{
		from: /targetSites:/g,
		to: "targetSystems:",
		name: "targetSites → targetSystems",
	},
];

for (const fix of propertyFixes) {
	const matches = content.match(fix.from);
	if (matches) {
		content = content.replace(fix.from, fix.to);
		changeCount += matches.length;
		console.log(`   ✅ Fixed ${matches.length} instances of ${fix.name}`);
	}
}

// 2. Fix frequency enum values
console.log("\n2️⃣ Fixing frequency enum values...");
const frequencyFixes = [
	{ from: /"Common \(10-20%\)"/g, to: '"common"', name: "Common (10-20%)" },
	{ from: /"Common \(15-30%\)"/g, to: '"common"', name: "Common (15-30%)" },
	{ from: /"Common \(20-30%\)"/g, to: '"common"', name: "Common (20-30%)" },
	{ from: /"Uncommon \(5-10%\)"/g, to: '"uncommon"', name: "Uncommon (5-10%)" },
	{ from: /"Uncommon \(1-5%\)"/g, to: '"uncommon"', name: "Uncommon (1-5%)" },
	{ from: /"Rare \(<1%\)"/g, to: '"rare"', name: "Rare (<1%)" },
	{ from: /"Very Rare"/g, to: '"very_rare"', name: "Very Rare" },
];

for (const fix of frequencyFixes) {
	const matches = content.match(fix.from);
	if (matches) {
		content = content.replace(fix.from, fix.to);
		changeCount += matches.length;
		console.log(`   ✅ Fixed ${matches.length} instances of ${fix.name}`);
	}
}

// 3. Fix severity enum values
console.log("\n3️⃣ Fixing severity enum values...");
const severityFixes = [
	{ from: /"Mild"/g, to: '"mild"', name: "Mild" },
	{ from: /"Moderate"/g, to: '"moderate"', name: "Moderate" },
	{ from: /"Severe"/g, to: '"severe"', name: "Severe" },
	{
		from: /"Moderate to Severe"/g,
		to: '"moderate"',
		name: "Moderate to Severe",
	},
];

for (const fix of severityFixes) {
	const matches = content.match(fix.from);
	if (matches) {
		content = content.replace(fix.from, fix.to);
		changeCount += matches.length;
		console.log(`   ✅ Fixed ${matches.length} instances of ${fix.name}`);
	}
}

// 4. Fix interaction type enum values
console.log("\n4️⃣ Fixing interaction type enum values...");
const interactionTypeFixes = [
	{ from: /"ENHANCES"/g, to: '"synergistic"', name: "ENHANCES → synergistic" },
	{
		from: /"INHIBITS"/g,
		to: '"antagonistic"',
		name: "INHIBITS → antagonistic",
	},
	{
		from: /"SYNERGIZES"/g,
		to: '"synergistic"',
		name: "SYNERGIZES → synergistic",
	},
	{ from: /"ADDITIVE"/g, to: '"additive"', name: "ADDITIVE → additive" },
];

for (const fix of interactionTypeFixes) {
	const matches = content.match(fix.from);
	if (matches) {
		content = content.replace(fix.from, fix.to);
		changeCount += matches.length;
		console.log(`   ✅ Fixed ${matches.length} instances of ${fix.name}`);
	}
}

// 5. Fix interaction severity enum values
console.log("\n5️⃣ Fixing interaction severity enum values...");
const interactionSeverityFixes = [
	{ from: /"MODERATE"/g, to: '"moderate"', name: "MODERATE → moderate" },
	{ from: /"MILD"/g, to: '"minor"', name: "MILD → minor" },
	{ from: /"SEVERE"/g, to: '"severe"', name: "SEVERE → severe" },
	{
		from: /"BENEFICIAL"/g,
		to: '"beneficial"',
		name: "BENEFICIAL → beneficial",
	},
];

for (const fix of interactionSeverityFixes) {
	const matches = content.match(fix.from);
	if (matches) {
		content = content.replace(fix.from, fix.to);
		changeCount += matches.length;
		console.log(`   ✅ Fixed ${matches.length} instances of ${fix.name}`);
	}
}

// 6. Fix study type enum values
console.log("\n6️⃣ Fixing study type enum values...");
const studyTypeFixes = [
	{
		from: /"PRECLINICAL"/g,
		to: '"ANIMAL_STUDY"',
		name: "PRECLINICAL → ANIMAL_STUDY",
	},
];

for (const fix of studyTypeFixes) {
	const matches = content.match(fix.from);
	if (matches) {
		content = content.replace(fix.from, fix.to);
		changeCount += matches.length;
		console.log(`   ✅ Fixed ${matches.length} instances of ${fix.name}`);
	}
}

// 7. Fix evidenceLevel enum values (need uppercase)
console.log("\n7️⃣ Fixing evidenceLevel enum values...");
const evidenceLevelFixes = [
	{
		from: /evidenceLevel:\s*"strong"/g,
		to: 'evidenceLevel: "STRONG"',
		name: "strong → STRONG",
	},
	{
		from: /evidenceLevel:\s*"moderate"/g,
		to: 'evidenceLevel: "MODERATE"',
		name: "moderate → MODERATE",
	},
	{
		from: /evidenceLevel:\s*"weak"/g,
		to: 'evidenceLevel: "WEAK"',
		name: "weak → WEAK",
	},
	{
		from: /evidenceLevel:\s*"insufficient"/g,
		to: 'evidenceLevel: "INSUFFICIENT"',
		name: "insufficient → INSUFFICIENT",
	},
	{
		from: /evidenceLevel:\s*"conflicting"/g,
		to: 'evidenceLevel: "CONFLICTING"',
		name: "conflicting → CONFLICTING",
	},
];

for (const fix of evidenceLevelFixes) {
	const matches = content.match(fix.from);
	if (matches) {
		content = content.replace(fix.from, fix.to);
		changeCount += matches.length;
		console.log(`   ✅ Fixed ${matches.length} instances of ${fix.name}`);
	}
}

// 8. Remove invalid properties
console.log("\n8️⃣ Removing invalid properties...");

// Remove 'optimal' from DosageRange objects
const optimalMatches = content.match(/optimal:\s*\d+,?\s*\n/g);
if (optimalMatches) {
	content = content.replace(/optimal:\s*\d+,?\s*\n/g, "");
	changeCount += optimalMatches.length;
	console.log(
		`   ✅ Removed ${optimalMatches.length} instances of 'optimal' property`,
	);
}

// Remove 'primaryEndpoint' from ResearchStudy objects
const primaryEndpointMatches = content.match(
	/primaryEndpoint:\s*'[^']*',?\s*\n/g,
);
if (primaryEndpointMatches) {
	content = content.replace(/primaryEndpoint:\s*'[^']*',?\s*\n/g, "");
	changeCount += primaryEndpointMatches.length;
	console.log(
		`   ✅ Removed ${primaryEndpointMatches.length} instances of 'primaryEndpoint' property`,
	);
}

// Remove 'mechanism' from ClinicalApplication objects (should be in MechanismOfAction)
const mechanismMatches = content.match(/\s+mechanism:\s*'[^']*',?\s*\n/g);
if (mechanismMatches) {
	content = content.replace(/\s+mechanism:\s*'[^']*',?\s*\n/g, "\n");
	changeCount += mechanismMatches.length;
	console.log(
		`   ✅ Removed ${mechanismMatches.length} instances of 'mechanism' property`,
	);
}

// Remove 'polishMechanism' from ClinicalApplication objects
const polishMechanismMatches = content.match(
	/\s+polishMechanism:\s*'[^']*',?\s*\n/g,
);
if (polishMechanismMatches) {
	content = content.replace(/\s+polishMechanism:\s*'[^']*',?\s*\n/g, "\n");
	changeCount += polishMechanismMatches.length;
	console.log(
		`   ✅ Removed ${polishMechanismMatches.length} instances of 'polishMechanism' property`,
	);
}

// Remove 'polishTargetSites' property
const polishTargetSitesMatches = content.match(
	/\s+polishTargetSites:\s*\[[^\]]*\],?\s*\n/g,
);
if (polishTargetSitesMatches) {
	content = content.replace(/\s+polishTargetSites:\s*\[[^\]]*\],?\s*\n/g, "\n");
	changeCount += polishTargetSitesMatches.length;
	console.log(
		`   ✅ Removed ${polishTargetSitesMatches.length} instances of 'polishTargetSites' property`,
	);
}

// Remove 'polishTiming' property
const polishTimingMatches = content.match(/\s+polishTiming:\s*'[^']*',?\s*\n/g);
if (polishTimingMatches) {
	content = content.replace(/\s+polishTiming:\s*'[^']*',?\s*\n/g, "\n");
	changeCount += polishTimingMatches.length;
	console.log(
		`   ✅ Removed ${polishTimingMatches.length} instances of 'polishTiming' property`,
	);
}

// 9. Add missing 'reversible' property to SideEffect objects
console.log("\n9️⃣ Adding missing reversible property to SideEffect objects...");
let reversibleCount = 0;

// Find SideEffect objects missing reversible property
// Pattern: objects with effect, frequency, severity, management but no reversible
const sideEffectPattern =
	/(\{\s*effect:\s*'[^']*',\s*polishEffect:\s*'[^']*',\s*frequency:\s*"[^"]*",\s*severity:\s*"[^"]*",\s*management:\s*'[^']*',\s*polishManagement:\s*'[^']*'\s*\})/g;

content = content.replace(sideEffectPattern, (match) => {
	if (!match.includes("reversible:")) {
		reversibleCount++;
		// Insert reversible: true before management
		return match.replace(/management:/, "reversible: true,\n      management:");
	}
	return match;
});

if (reversibleCount > 0) {
	changeCount += reversibleCount;
	console.log(
		`   ✅ Added 'reversible' property to ${reversibleCount} SideEffect objects`,
	);
}

// 10. Add missing 'description' property to Interaction objects
console.log(
	"\n🔟 Adding missing description property to Interaction objects...",
);
let descriptionCount = 0;

// Find Interaction objects missing description property
// Pattern: objects with substance, type, severity, mechanism but no description
const interactionPattern =
	/(\{\s*substance:\s*'[^']*',\s*polishSubstance:\s*'[^']*',\s*type:\s*"[^"]*",\s*severity:\s*"[^"]*",\s*mechanism:\s*'([^']*)',)/g;

content = content.replace(
	interactionPattern,
	(match, fullMatch, mechanismText) => {
		if (!match.includes("description:")) {
			descriptionCount++;
			// Insert description after type
			return match.replace(
				/type:\s*"([^"]*)",/,
				`type: "$1",\n      description: '${mechanismText}',`,
			);
		}
		return match;
	},
);

if (descriptionCount > 0) {
	changeCount += descriptionCount;
	console.log(
		`   ✅ Added 'description' property to ${descriptionCount} Interaction objects`,
	);
}

// Write the file back
if (content !== originalContent) {
	writeFileSync(filePath, content, "utf-8");
	console.log(
		`\n✅ Successfully applied ${changeCount} fixes to comprehensive-supplements-database.ts`,
	);
	console.log(
		"📝 File has been updated. Please run `pnpm typecheck` to verify.",
	);
} else {
	console.log("\n⚠️  No changes were made to the file.");
}

console.log("\n🎉 Script completed!");
