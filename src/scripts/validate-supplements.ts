/**
 * Supplement Data Validation Script
 * Validates migrated supplement data against Zod schemas and business rules
 */

import {
	databaseMetadata,
	supplementsDatabase,
	validateSupplementDatabase,
} from "../data/supplements";
import { validateSupplement } from "../types/supplement";

/**
 * Main validation function
 */
async function validateSupplements() {
	console.log("🔍 Starting supplement data validation...\n");

	// Database-level validation
	console.log("📊 Database Metadata:");
	console.log(`- Version: ${databaseMetadata.version}`);
	console.log(`- Total supplements: ${databaseMetadata.totalSupplements}`);
	console.log(`- Migration source: ${databaseMetadata.migrationSource}`);
	console.log(`- Target stack: ${databaseMetadata.targetStack}`);
	console.log(`- Localization: ${databaseMetadata.localization}\n`);

	// Validate database integrity
	const integrityCheck = validateSupplementDatabase();
	console.log("🔧 Database Integrity Check:");
	console.log(`- Valid: ${integrityCheck.isValid ? "✅" : "❌"}`);
	if (!integrityCheck.isValid) {
		console.log("- Errors:");
		integrityCheck.errors.forEach((error) => console.log(`  • ${error}`));
	}
	console.log();

	// Individual supplement validation
	console.log("🧪 Individual Supplement Validation:");
	let validCount = 0;
	let errorCount = 0;

	for (const supplement of supplementsDatabase) {
		const validation = validateSupplement(supplement);

		if (validation.success) {
			console.log(`✅ ${supplement.name} (${supplement.polishName}) - Valid`);
			validCount++;
		} else {
			console.log(`❌ ${supplement.name} (${supplement.polishName}) - Invalid`);
			validation.error.forEach((err) => {
				console.log(`   • ${err.message}`);
			});
			errorCount++;
		}
	}

	console.log("\n📈 Validation Summary:");
	console.log(`- Valid supplements: ${validCount}`);
	console.log(`- Invalid supplements: ${errorCount}`);
	console.log(
		`- Success rate: ${((validCount / (validCount + errorCount)) * 100).toFixed(1)}%`,
	);

	// Content quality checks
	console.log("\n🎯 Content Quality Checks:");

	// Check Polish translations
	const missingPolishTranslations = supplementsDatabase.filter(
		(s) =>
			!s.polishName ||
			!s.polishDescription ||
			s.polishCommonNames.length === 0 ||
			s.clinicalApplications.some(
				(app) => !app.polishCondition || !app.polishIndication,
			) ||
			s.mechanisms.some((mech) => !mech.polishName || !mech.polishDescription),
	);

	console.log(
		`- Missing Polish translations: ${missingPolishTranslations.length === 0 ? "✅ None" : `❌ ${missingPolishTranslations.length}`}`,
	);
	if (missingPolishTranslations.length > 0) {
		missingPolishTranslations.forEach((s) => console.log(`  • ${s.name}`));
	}

	// Check research studies
	const missingResearch = supplementsDatabase.filter(
		(s) => s.researchStudies.length === 0,
	);
	console.log(
		`- Missing research studies: ${missingResearch.length === 0 ? "✅ None" : `❌ ${missingResearch.length}`}`,
	);
	if (missingResearch.length > 0) {
		missingResearch.forEach((s) => console.log(`  • ${s.name}`));
	}

	// Check evidence levels
	const evidenceLevelDistribution = supplementsDatabase.reduce(
		(acc, s) => {
			acc[s.evidenceLevel] = (acc[s.evidenceLevel] || 0) + 1;
			return acc;
		},
		{} as Record<string, number>,
	);

	console.log("- Evidence level distribution:");
	Object.entries(evidenceLevelDistribution).forEach(([level, count]) => {
		console.log(`  • ${level}: ${count}`);
	});

	// Check clinical applications
	const avgClinicalApps =
		supplementsDatabase.reduce(
			(sum, s) => sum + s.clinicalApplications.length,
			0,
		) / supplementsDatabase.length;
	console.log(
		`- Average clinical applications per supplement: ${avgClinicalApps.toFixed(1)}`,
	);

	// Check mechanisms
	const avgMechanisms =
		supplementsDatabase.reduce((sum, s) => sum + s.mechanisms.length, 0) /
		supplementsDatabase.length;
	console.log(
		`- Average mechanisms per supplement: ${avgMechanisms.toFixed(1)}`,
	);

	// Check side effects
	const avgSideEffects =
		supplementsDatabase.reduce((sum, s) => sum + s.sideEffects.length, 0) /
		supplementsDatabase.length;
	console.log(
		`- Average side effects per supplement: ${avgSideEffects.toFixed(1)}`,
	);

	// Check interactions
	const avgInteractions =
		supplementsDatabase.reduce((sum, s) => sum + s.interactions.length, 0) /
		supplementsDatabase.length;
	console.log(
		`- Average interactions per supplement: ${avgInteractions.toFixed(1)}`,
	);

	// Category distribution
	const categoryDistribution = supplementsDatabase.reduce(
		(acc, s) => {
			acc[s.category] = (acc[s.category] || 0) + 1;
			return acc;
		},
		{} as Record<string, number>,
	);

	console.log("- Category distribution:");
	Object.entries(categoryDistribution).forEach(([category, count]) => {
		console.log(`  • ${category}: ${count}`);
	});

	// Migration tags check
	const migratedSupplements = supplementsDatabase.filter((s) =>
		s.tags.includes("migrated"),
	);
	console.log(
		`- Supplements with migration tag: ${migratedSupplements.length}/${supplementsDatabase.length}`,
	);

	// Dosage range validation
	const invalidDosages = supplementsDatabase.filter((s) => {
		const range = s.dosageGuidelines.therapeuticRange;
		return range.min >= range.max || range.min <= 0;
	});
	console.log(
		`- Invalid dosage ranges: ${invalidDosages.length === 0 ? "✅ None" : `❌ ${invalidDosages.length}`}`,
	);

	// Bioavailability check
	const missingBioavailability = supplementsDatabase.filter((s) =>
		s.activeCompounds.some(
			(compound) => compound.bioavailability === undefined,
		),
	);
	console.log(
		`- Missing bioavailability data: ${missingBioavailability.length === 0 ? "✅ None" : `❌ ${missingBioavailability.length}`}`,
	);

	console.log("\n🎉 Validation complete!");

	if (integrityCheck.isValid && errorCount === 0) {
		console.log("✅ All supplements passed validation!");
		return true;
	}
	console.log("❌ Some issues found. Please review and fix.");
	return false;
}

/**
 * Detailed supplement analysis
 */
function analyzeSupplementDetails() {
	console.log("\n📋 Detailed Supplement Analysis:\n");

	supplementsDatabase.forEach((supplement) => {
		console.log(`🔬 ${supplement.name} (${supplement.polishName})`);
		console.log(`   Category: ${supplement.category}`);
		console.log(`   Evidence Level: ${supplement.evidenceLevel}`);
		console.log(`   Active Compounds: ${supplement.activeCompounds.length}`);
		console.log(
			`   Clinical Applications: ${supplement.clinicalApplications.length}`,
		);
		console.log(`   Mechanisms: ${supplement.mechanisms.length}`);
		console.log(`   Side Effects: ${supplement.sideEffects.length}`);
		console.log(`   Interactions: ${supplement.interactions.length}`);
		console.log(`   Research Studies: ${supplement.researchStudies.length}`);
		console.log(
			`   Dosage Range: ${supplement.dosageGuidelines.therapeuticRange.min}-${supplement.dosageGuidelines.therapeuticRange.max}${supplement.dosageGuidelines.therapeuticRange.unit}`,
		);
		console.log(`   Tags: ${supplement.tags.join(", ")}`);
		console.log();
	});
}

/**
 * Export validation functions for use in tests
 */
export { validateSupplements, analyzeSupplementDetails };

// Run validation if script is executed directly
if (typeof window === "undefined" && typeof process !== "undefined") {
	validateSupplements()
		.then((success) => {
			console.log(success ? "✅ Validation passed" : "❌ Validation failed");
		})
		.catch((error) => {
			console.error("❌ Validation failed with error:", error);
		});
}
