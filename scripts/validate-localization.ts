// scripts/validate-localization.ts
/**
 * Localization Validation Script
 * Validates Polish localization across the application
 */

import {
	DEFAULT_TRANSLATIONS,
	MEDICAL_TERMS,
} from "../src/lib/localization/dictionary";
import {
	generateValidationReport,
	validatePolishText,
} from "../src/lib/localization/validation";

interface ValidationResult {
	componentName: string;
	totalTranslations: number;
	medicalTermsCount: number;
	validationResults: {
		characterValidation: any;
		completenessValidation: any;
		medicalTermValidation: any;
	};
	recommendations: string[];
	isValid: boolean;
}

/**
 * Validate all translations
 */
function validateAllTranslations(): ValidationResult[] {
	const results: ValidationResult[] = [];

	// Validate main translation dictionary
	const mainValidation = generateValidationReport(
		"main-translations",
		DEFAULT_TRANSLATIONS,
		MEDICAL_TERMS,
	);
	results.push({
		...mainValidation,
		isValid:
			mainValidation.validationResults.characterValidation.isValid &&
			mainValidation.validationResults.completenessValidation.completeness > 80,
	});

	return results;
}

/**
 * Validate sample Polish text
 */
function validateSampleText(): void {
	const sampleTexts = [
		" mózg, serce, wątroba, nerka",
		"Suplementacja witamin i minerałów",
		"Badania kliniczne wykazały skuteczność",
		"Interakcje między suplementami",
		"Dawkowanie i środki ostrożności",
	];

	console.log("\n🔍 Validating sample Polish text...\n");

	sampleTexts.forEach((text, index) => {
		const validation = validatePolishText(text, {
			checkMedicalTerms: true,
			checkCharacterUsage: true,
			targetAudience: "patient",
		});

		console.log(`Sample ${index + 1}: "${text}"`);
		console.log(`  ✅ Valid: ${validation.isValid}`);
		console.log(`  📊 Confidence: ${validation.confidence * 100}%`);

		if (validation.errors.length > 0) {
			console.log(`  ❌ Errors: ${validation.errors.join(", ")}`);
		}

		if (validation.suggestions.length > 0) {
			console.log(`  💡 Suggestions: ${validation.suggestions.join(", ")}`);
		}

		console.log("");
	});
}

/**
 * Generate localization summary
 */
function generateLocalizationSummary(results: ValidationResult[]): void {
	console.log("\n📋 Localization Validation Summary");
	console.log("=====================================");

	const totalComponents = results.length;
	const validComponents = results.filter((r) => r.isValid).length;
	const totalTranslations = results.reduce(
		(sum, r) => sum + r.totalTranslations,
		0,
	);
	const totalMedicalTerms = results.reduce(
		(sum, r) => sum + r.medicalTermsCount,
		0,
	);

	console.log(`📦 Components validated: ${totalComponents}`);
	console.log(`✅ Valid components: ${validComponents}/${totalComponents}`);
	console.log(`📝 Total translations: ${totalTranslations}`);
	console.log(`🩺 Medical terms: ${totalMedicalTerms}`);

	// Collect all recommendations
	const allRecommendations = results.flatMap((r) => r.recommendations);
	if (allRecommendations.length > 0) {
		console.log("\n💡 Recommendations:");
		allRecommendations.forEach((rec, index) => {
			console.log(`  ${index + 1}. ${rec}`);
		});
	}

	// Overall status
	const overallSuccess = validComponents === totalComponents;
	console.log(
		`\n${overallSuccess ? "✅" : "⚠️"} Overall status: ${overallSuccess ? "VALID" : "NEEDS ATTENTION"}`,
	);
}

/**
 * Main validation function
 */
function runLocalizationValidation(): void {
	console.log("🚀 Starting Polish localization validation...\n");

	try {
		// Validate all translations
		const validationResults = validateAllTranslations();

		// Validate sample text
		validateSampleText();

		// Generate summary
		generateLocalizationSummary(validationResults);

		console.log("\n✅ Localization validation completed successfully!");
	} catch (error) {
		console.error("❌ Localization validation failed:", error);
		process.exit(1);
	}
}

/**
 * CLI interface
 */
if (import.meta.url === `file://${process.argv[1]}`) {
	runLocalizationValidation();
}

export { runLocalizationValidation, validateAllTranslations };
