import { DEFAULT_TRANSLATIONS, MEDICAL_TERMS } from "./dictionary";
// src/lib/localization/validation.ts
import type {
	PolishMedicalTerm,
	PolishTextValidation,
	TranslationDictionary,
} from "./types";

/**
 * Validates Polish text for proper character usage and medical terminology
 */
export function validatePolishText(
	text: string,
	options: {
		checkMedicalTerms?: boolean;
		checkCharacterUsage?: boolean;
		targetAudience?: "medical" | "patient" | "student" | "general";
	} = {},
): PolishTextValidation {
	const {
		checkMedicalTerms = true,
		checkCharacterUsage = true,
		targetAudience = "general",
	} = options;

	const errors: string[] = [];
	const suggestions: string[] = [];

	// Check Polish character usage
	if (checkCharacterUsage) {
		const characterValidation = validatePolishCharacters(text);
		errors.push(...characterValidation.errors);
		suggestions.push(...characterValidation.suggestions);
	}

	// Check medical terminology
	if (checkMedicalTerms) {
		const medicalValidation = validateMedicalTerminology(text, targetAudience);
		errors.push(...medicalValidation.errors);
		suggestions.push(...medicalValidation.suggestions);
	}

	// Calculate confidence score
	const confidence = calculateConfidence(errors, suggestions);

	return {
		isValid: errors.length === 0,
		errors,
		suggestions,
		confidence,
	};
}

/**
 * Validates Polish character usage in text
 */
function validatePolishCharacters(text: string): {
	errors: string[];
	suggestions: string[];
} {
	const errors: string[] = [];
	const suggestions: string[] = [];

	// Check for Polish characters
	const hasPolishChars = /[ąćęłńóśźż]/i.test(text);

	if (hasPolishChars) {
		// Validate proper usage of Polish characters
		const invalidSequences = findInvalidPolishSequences(text);
		errors.push(...invalidSequences);

		// Check for common Polish typos
		const typoSuggestions = findPolishTypos(text);
		suggestions.push(...typoSuggestions);
	}

	return { errors, suggestions };
}

/**
 * Validates medical terminology usage
 */
function validateMedicalTerminology(
	text: string,
	targetAudience: "medical" | "patient" | "student" | "general",
): { errors: string[]; suggestions: string[] } {
	const errors: string[] = [];
	const suggestions: string[] = [];

	// Check if English medical terms are used when Polish should be used
	if (targetAudience === "patient") {
		for (const [english, term] of MEDICAL_TERMS.entries()) {
			if (new RegExp(`\\b${english}\\b`, "i").test(text)) {
				errors.push(
					`Rozważ użycie polskiego terminu "${term.polish}" zamiast "${english}"`,
				);
			}
		}
	}

	// Check for consistency in terminology usage
	const consistencyIssues = checkTerminologyConsistency(text);
	errors.push(...consistencyIssues);

	return { errors, suggestions };
}

/**
 * Finds invalid Polish character sequences
 */
function findInvalidPolishSequences(text: string): string[] {
	const errors: string[] = [];

	// Common invalid combinations
	const invalidPatterns = [
		{
			pattern: /([ąęó])([A-ZĘÓ])/g,
			message: "Nieprawidłowa kapitalizacja po polskim znaku",
		},
		{
			pattern: /rz(?=[aąeęioóuy])/g,
			message: 'Możliwe nieprawidłowe użycie "rz" zamiast "ż"',
		},
		{
			pattern: /sz(?=[aąeęioóuy])/g,
			message: 'Możliwe nieprawidłowe użycie "sz" zamiast "ś"',
		},
		{
			pattern: /ch(?=[aąeęioóuy])/g,
			message: 'Możliwe nieprawidłowe użycie "ch" zamiast "h"',
		},
	];

	for (const { pattern, message } of invalidPatterns) {
		if (pattern.test(text)) {
			errors.push(message);
		}
	}

	return errors;
}

/**
 * Finds common Polish typos
 */
function findPolishTypos(text: string): string[] {
	const suggestions: string[] = [];

	// Common typos with Polish characters
	const typoPatterns = [
		{ pattern: /moge/g, suggestion: "mogę" },
		{ pattern: /prosze/g, suggestion: "proszę" },
		{ pattern: /dziekuje/g, suggestion: "dziękuję" },
		{ pattern: /wlasnie/g, suggestion: "właśnie" },
		{ pattern: /wlasciwie/g, suggestion: "właściwie" },
		{ pattern: /cos/g, suggestion: "coś" },
		{ pattern: /gdzies/g, suggestion: "gdzieś" },
		{ pattern: /coraz/g, suggestion: "coraz" },
		{ pattern: /ktos/g, suggestion: "ktoś" },
		{ pattern: /jakis/g, suggestion: "jakiś" },
	];

	for (const { pattern, suggestion } of typoPatterns) {
		if (pattern.test(text)) {
			suggestions.push(
				`Rozważ użycie "${suggestion}" zamiast popularnego błędu`,
			);
		}
	}

	return suggestions;
}

/**
 * Checks for consistency in medical terminology usage
 */
function checkTerminologyConsistency(text: string): string[] {
	const errors: string[] = [];

	// Check for mixed English/Polish medical terms
	const englishTerms = [];
	const polishTerms = [];

	for (const [english, term] of MEDICAL_TERMS.entries()) {
		if (new RegExp(`\\b${english}\\b`, "i").test(text)) {
			englishTerms.push(english);
		}
		if (text.includes(term.polish)) {
			polishTerms.push(term.polish);
		}
	}

	if (englishTerms.length > 0 && polishTerms.length > 0) {
		errors.push(
			"Mieszane użycie terminów angielskich i polskich - użyj konsekwentnie jednego języka",
		);
	}

	return errors;
}

/**
 * Calculates confidence score for validation
 */
function calculateConfidence(errors: string[], suggestions: string[]): number {
	const totalIssues = errors.length + suggestions.length;
	if (totalIssues === 0) return 1.0;

	// Base confidence starts at 0.8 and decreases with issues
	const baseConfidence = 0.8;
	const penaltyPerIssue = 0.1;
	const confidence = Math.max(
		0.1,
		baseConfidence - totalIssues * penaltyPerIssue,
	);

	return Math.round(confidence * 100) / 100;
}

/**
 * Validates translation completeness
 */
export function validateTranslationCompleteness(
	translations: TranslationDictionary,
	requiredKeys: string[],
): { missing: string[]; completeness: number } {
	const missing = requiredKeys.filter((key) => !translations[key]);
	const completeness =
		((requiredKeys.length - missing.length) / requiredKeys.length) * 100;

	return {
		missing,
		completeness: Math.round(completeness * 100) / 100,
	};
}

/**
 * Validates medical term accuracy
 */
export function validateMedicalTermAccuracy(
	english: string,
	polish: string,
	category: PolishMedicalTerm["category"],
): { isAccurate: boolean; issues: string[] } {
	const issues: string[] = [];

	// Check if Polish term contains Polish characters when appropriate
	if (category === "anatomy" || category === "condition") {
		const hasPolishChars = /[ąćęłńóśźż]/i.test(polish);
		if (!hasPolishChars && polish.length > 3) {
			issues.push(
				"Termin medyczny powinien zawierać polskie znaki diakrytyczne",
			);
		}
	}

	// Check for common translation errors
	if (english === polish) {
		issues.push("Termin polski nie powinien być identyczny z angielskim");
	}

	if (polish.length < 2) {
		issues.push("Termin polski jest zbyt krótki");
	}

	return {
		isAccurate: issues.length === 0,
		issues,
	};
}

/**
 * Generates validation report for component localization
 */
export function generateValidationReport(
	componentName: string,
	translations: TranslationDictionary,
	medicalTerms: Map<string, PolishMedicalTerm>,
): {
	componentName: string;
	totalTranslations: number;
	medicalTermsCount: number;
	validationResults: {
		characterValidation: PolishTextValidation;
		completenessValidation: { missing: string[]; completeness: number };
		medicalTermValidation: {
			accurate: number;
			total: number;
			accuracy: number;
		};
	};
	recommendations: string[];
} {
	// Sample text for character validation
	const sampleText = Object.values(translations).join(" ");

	const characterValidation = validatePolishText(sampleText, {
		checkMedicalTerms: false,
		checkCharacterUsage: true,
	});

	// Check translation completeness
	const requiredKeys = Object.keys(DEFAULT_TRANSLATIONS);
	const completenessValidation = validateTranslationCompleteness(
		translations,
		requiredKeys,
	);

	// Validate medical terms
	let accurateTerms = 0;
	for (const [english, term] of medicalTerms.entries()) {
		const validation = validateMedicalTermAccuracy(
			english,
			term.polish,
			term.category,
		);
		if (validation.isAccurate) {
			accurateTerms++;
		}
	}

	const medicalTermValidation = {
		accurate: accurateTerms,
		total: medicalTerms.size,
		accuracy:
			medicalTerms.size > 0 ? (accurateTerms / medicalTerms.size) * 100 : 100,
	};

	// Generate recommendations
	const recommendations: string[] = [];

	if (completenessValidation.completeness < 80) {
		recommendations.push(
			"Rozważ dodanie większej liczby tłumaczeń dla lepszego pokrycia",
		);
	}

	if (characterValidation.errors.length > 0) {
		recommendations.push("Popraw błędy w użyciu polskich znaków");
	}

	if (medicalTermValidation.accuracy < 90) {
		recommendations.push("Sprawdź dokładność terminów medycznych");
	}

	return {
		componentName,
		totalTranslations: Object.keys(translations).length,
		medicalTermsCount: medicalTerms.size,
		validationResults: {
			characterValidation,
			completenessValidation,
			medicalTermValidation,
		},
		recommendations,
	};
}
