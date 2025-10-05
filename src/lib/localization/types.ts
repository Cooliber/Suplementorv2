// src/lib/localization/types.ts

export interface PolishMedicalTerm {
	english: string;
	polish: string;
	category: "anatomy" | "condition" | "treatment" | "supplement" | "general";
	context?: string;
}

export interface PolishLocalizationConfig {
	enableMedicalTerms: boolean;
	enableCharacterValidation: boolean;
	enableCulturalCompliance: boolean;
	targetAudience: "medical" | "patient" | "student" | "general";
	formalityLevel: "formal" | "semi-formal" | "informal";
}

export interface PolishTextValidation {
	isValid: boolean;
	errors: string[];
	suggestions: string[];
	confidence: number;
}

export interface TranslationDictionary {
	[key: string]: string;
}

export interface LocalizedContent {
	translations: TranslationDictionary;
	medicalTerms: Map<string, PolishMedicalTerm>;
	validationRules: string[];
	lastUpdated: string;
	version: string;
}

export interface ComponentLocalizationOptions {
	componentName: string;
	componentType: "ui" | "feature" | "page" | "layout";
	includeMedicalTerms?: boolean;
	includeValidation?: boolean;
	customTranslations?: TranslationDictionary;
}

export interface PolishCharacterSet {
	lowercase: string;
	uppercase: string;
	all: string;
}

export const POLISH_CHARACTERS: PolishCharacterSet = {
	lowercase: "ąćęłńóśźż",
	uppercase: "ĄĆĘŁŃÓŚŹŻ",
	all: "ąćęłńóśźżĄĆĘŁŃÓŚŹŻ",
};

export const MEDICAL_TERM_CATEGORIES = {
	ANATOMY: "anatomy" as const,
	CONDITION: "condition" as const,
	TREATMENT: "treatment" as const,
	SUPPLEMENT: "supplement" as const,
	GENERAL: "general" as const,
} as const;

export const TARGET_AUDIENCES = {
	MEDICAL: "medical" as const,
	PATIENT: "patient" as const,
	STUDENT: "student" as const,
	GENERAL: "general" as const,
} as const;

export const FORMALITY_LEVELS = {
	FORMAL: "formal" as const,
	SEMI_FORMAL: "semi-formal" as const,
	INFORMAL: "informal" as const,
} as const;
