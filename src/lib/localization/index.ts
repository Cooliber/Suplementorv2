// src/lib/localization/index.ts
// Explicit exports to avoid naming conflicts
export type {
	PolishMedicalTerm,
	PolishLocalizationConfig,
	PolishTextValidation,
	LocalizedContent,
	ComponentLocalizationOptions,
	PolishCharacterSet,
} from "./types";

export {
	POLISH_CHARACTERS,
	MEDICAL_TERM_CATEGORIES,
	TARGET_AUDIENCES,
	FORMALITY_LEVELS,
} from "./types";

export {
	MEDICAL_TERMS,
	DEFAULT_TRANSLATIONS,
	createLocalizedContent,
	generateValidationRules,
	getMedicalTerm as getMedicalTermFromDict,
	getTranslation as getTranslationFromDict,
	validatePolishCharacters,
} from "./dictionary";

export {
	validatePolishText,
	validateTranslationCompleteness,
	validateMedicalTermAccuracy,
	generateValidationReport,
} from "./validation";

// Re-export the hook for convenience
export { usePolishLocalization } from "../hooks/use-polish-localization";

// Utility functions for easy access
import { DEFAULT_TRANSLATIONS, MEDICAL_TERMS } from "./dictionary";
import type { PolishMedicalTerm, TranslationDictionary } from "./types";
import { validatePolishText } from "./validation";

/**
 * Get a medical term by English key
 */
export const getMedicalTerm = (
	english: string,
): PolishMedicalTerm | undefined => {
	return MEDICAL_TERMS.get(english);
};

/**
 * Get a translation by key with fallback
 */
export const getTranslation = (key: string, fallback = ""): string => {
	return DEFAULT_TRANSLATIONS[key] || fallback || key;
};

/**
 * Get all medical terms for a specific category
 */
export const getMedicalTermsByCategory = (
	category: PolishMedicalTerm["category"],
): Map<string, PolishMedicalTerm> => {
	const filteredTerms = new Map();

	for (const [english, term] of MEDICAL_TERMS.entries()) {
		if (term.category === category) {
			filteredTerms.set(english, term);
		}
	}

	return filteredTerms;
};

/**
 * Search medical terms by English or Polish text
 */
export const searchMedicalTerms = (query: string): PolishMedicalTerm[] => {
	const results: PolishMedicalTerm[] = [];
	const lowerQuery = query.toLowerCase();

	for (const term of MEDICAL_TERMS.values()) {
		if (
			term.english.toLowerCase().includes(lowerQuery) ||
			term.polish.toLowerCase().includes(lowerQuery) ||
			term.context?.toLowerCase().includes(lowerQuery)
		) {
			results.push(term);
		}
	}

	return results;
};

/**
 * Get component-specific translations
 */
export const getComponentTranslations = (
	componentName: string,
): TranslationDictionary => {
	const componentTranslations: TranslationDictionary = {};

	// Generate component-specific keys
	const baseKey = componentName.toLowerCase();
	componentTranslations[`${baseKey}.title`] = componentName;
	componentTranslations[`${baseKey}.description`] =
		`${componentName} - Komponent platformy Suplementor`;
	componentTranslations[`${baseKey}.loading`] = "Ładowanie...";
	componentTranslations[`${baseKey}.error`] = "Wystąpił błąd";
	componentTranslations[`${baseKey}.empty`] = "Brak danych";
	componentTranslations[`${baseKey}.retry`] = "Spróbuj ponownie";

	return componentTranslations;
};

/**
 * Merge translations with defaults
 */
export const mergeTranslations = (
	baseTranslations: TranslationDictionary,
	additionalTranslations: TranslationDictionary,
): TranslationDictionary => {
	return { ...baseTranslations, ...additionalTranslations };
};

/**
 * Validate and get safe translation key
 */
export const getSafeTranslationKey = (key: string): string => {
	// Remove any potentially unsafe characters
	return key.replace(/[^a-zA-Z0-9.-_]/g, "_");
};

/**
 * Create a translation key for a specific context
 */
export const createTranslationKey = (
	component: string,
	action: string,
	context?: string,
): string => {
	const base = `${component.toLowerCase()}.${action}`;
	return context ? `${base}.${context}` : base;
};
