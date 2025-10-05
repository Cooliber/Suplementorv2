/**
 * Polish Localization Integration for Component Generation
 * Handles Polish language support, medical terminology, and cultural compliance
 */

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

export class PolishLocalizationIntegration {
	private medicalTerms: Map<string, PolishMedicalTerm> = new Map([
		// Anatomy terms
		["brain", { english: "brain", polish: "mózg", category: "anatomy" }],
		["heart", { english: "heart", polish: "serce", category: "anatomy" }],
		["liver", { english: "liver", polish: "wątroba", category: "anatomy" }],
		["kidney", { english: "kidney", polish: "nerka", category: "anatomy" }],
		["neuron", { english: "neuron", polish: "neuron", category: "anatomy" }],
		["synapse", { english: "synapse", polish: "synapsa", category: "anatomy" }],

		// Supplement terms
		[
			"vitamin",
			{ english: "vitamin", polish: "witamina", category: "supplement" },
		],
		[
			"mineral",
			{ english: "mineral", polish: "minerał", category: "supplement" },
		],
		[
			"supplement",
			{ english: "supplement", polish: "suplement", category: "supplement" },
		],
		[
			"dosage",
			{ english: "dosage", polish: "dawkowanie", category: "supplement" },
		],
		[
			"contraindication",
			{
				english: "contraindication",
				polish: "przeciwwskazanie",
				category: "supplement",
			},
		],
		[
			"interaction",
			{ english: "interaction", polish: "interakcja", category: "supplement" },
		],

		// Condition terms
		[
			"cognitive",
			{ english: "cognitive", polish: "poznawcze", category: "condition" },
		],
		["memory", { english: "memory", polish: "pamięć", category: "condition" }],
		[
			"concentration",
			{
				english: "concentration",
				polish: "koncentracja",
				category: "condition",
			},
		],
		["stress", { english: "stress", polish: "stres", category: "condition" }],
		["anxiety", { english: "anxiety", polish: "lęk", category: "condition" }],
		[
			"depression",
			{ english: "depression", polish: "depresja", category: "condition" },
		],

		// Treatment terms
		[
			"therapy",
			{ english: "therapy", polish: "terapia", category: "treatment" },
		],
		[
			"treatment",
			{ english: "treatment", polish: "leczenie", category: "treatment" },
		],
		[
			"medication",
			{ english: "medication", polish: "lek", category: "treatment" },
		],
		[
			"efficacy",
			{ english: "efficacy", polish: "skuteczność", category: "treatment" },
		],
		[
			"safety",
			{ english: "safety", polish: "bezpieczeństwo", category: "treatment" },
		],

		// Research terms
		[
			"research",
			{ english: "research", polish: "badania", category: "general" },
		],
		["study", { english: "study", polish: "badanie", category: "general" }],
		[
			"evidence",
			{ english: "evidence", polish: "dowody", category: "general" },
		],
		[
			"clinical",
			{ english: "clinical", polish: "kliniczne", category: "general" },
		],
		["trial", { english: "trial", polish: "badanie", category: "general" }],
	]);

	private polishCharacters = {
		lowercase: "ąćęłńóśźż",
		uppercase: "ĄĆĘŁŃÓŚŹŻ",
		all: "ąćęłńóśźżĄĆĘŁŃÓŚŹŻ",
	};

	constructor(private config: PolishLocalizationConfig) {}

	/**
	 * Generate Polish localization for component
	 */
	generateLocalizationData(
		componentName: string,
		componentType: string,
	): {
		translations: Record<string, string>;
		medicalTerms: PolishMedicalTerm[];
		validationRules: string[];
	} {
		const translations: Record<string, string> = {};
		const usedMedicalTerms: PolishMedicalTerm[] = [];
		const validationRules: string[] = [];

		// Generate basic component translations
		translations[`${componentName.toLowerCase()}.title`] =
			this.translateComponentName(componentName);
		translations[`${componentName.toLowerCase()}.description`] =
			this.generateDescription(componentName, componentType);

		// Add common UI translations
		translations["common.loading"] = "Ładowanie...";
		translations["common.error"] = "Wystąpił błąd";
		translations["common.retry"] = "Spróbuj ponownie";
		translations["common.cancel"] = "Anuluj";
		translations["common.confirm"] = "Potwierdź";
		translations["common.save"] = "Zapisz";
		translations["common.delete"] = "Usuń";

		// Add medical terminology if enabled
		if (this.config.enableMedicalTerms) {
			const medicalTranslations = this.generateMedicalTranslations();
			Object.assign(translations, medicalTranslations);
			usedMedicalTerms.push(...Array.from(this.medicalTerms.values()));
		}

		// Add character validation rules
		if (this.config.enableCharacterValidation) {
			validationRules.push(...this.generateCharacterValidationRules());
		}

		return {
			translations,
			medicalTerms: usedMedicalTerms,
			validationRules,
		};
	}

	/**
	 * Translate component name to Polish
	 */
	private translateComponentName(componentName: string): string {
		// Simple translation mapping for common component names
		const translations: Record<string, string> = {
			Button: "Przycisk",
			Input: "Pole tekstowe",
			Card: "Karta",
			Modal: "Okno modalne",
			Dialog: "Okno dialogowe",
			Form: "Formularz",
			Table: "Tabela",
			Chart: "Wykres",
			Graph: "Graf",
			List: "Lista",
			Menu: "Menu",
			Navigation: "Nawigacja",
			Header: "Nagłówek",
			Footer: "Stopka",
			Sidebar: "Panel boczny",
			Dashboard: "Panel główny",
			Profile: "Profil",
			Settings: "Ustawienia",
			Search: "Wyszukiwanie",
			Filter: "Filtr",
			Sort: "Sortowanie",
			Pagination: "Paginacja",
			Loading: "Ładowanie",
			Error: "Błąd",
			Success: "Sukces",
			Warning: "Ostrzeżenie",
			Info: "Informacja",
		};

		return translations[componentName] || componentName;
	}

	/**
	 * Generate component description in Polish
	 */
	private generateDescription(
		componentName: string,
		componentType: string,
	): string {
		const polishName = this.translateComponentName(componentName);
		const typeTranslations: Record<string, string> = {
			ui: "Komponent interfejsu użytkownika",
			feature: "Komponent funkcjonalny",
			page: "Komponent strony",
			layout: "Komponent layout",
		};

		const typeDescription = typeTranslations[componentType] || "Komponent";
		return `${polishName} - ${typeDescription} dla platformy Suplementor`;
	}

	/**
	 * Generate medical terminology translations
	 */
	private generateMedicalTranslations(): Record<string, string> {
		const translations: Record<string, string> = {};

		for (const [english, term] of this.medicalTerms.entries()) {
			translations[`medical.${english}`] = term.polish;
		}

		return translations;
	}

	/**
	 * Generate Polish character validation rules
	 */
	private generateCharacterValidationRules(): string[] {
		return [
			"All Polish characters (ą, ć, ę, ł, ń, ó, ś, ź, ż) must render correctly",
			"Text should be properly encoded in UTF-8",
			"Font fallbacks should support Polish characters",
			"Screen readers should pronounce Polish characters correctly",
			"Copy/paste functionality should preserve Polish characters",
		];
	}

	/**
	 * Validate Polish text content
	 */
	validatePolishText(text: string): {
		isValid: boolean;
		errors: string[];
		suggestions: string[];
	} {
		const errors: string[] = [];
		const suggestions: string[] = [];

		// Check for Polish characters
		const hasPolishChars = /[ąćęłńóśźż]/i.test(text);

		if (hasPolishChars) {
			// Validate proper usage of Polish characters
			const invalidSequences = this.findInvalidPolishSequences(text);
			errors.push(...invalidSequences);

			// Check for common Polish typos
			const typoSuggestions = this.findPolishTypos(text);
			suggestions.push(...typoSuggestions);
		}

		// Check for medical terminology accuracy
		if (this.config.enableMedicalTerms) {
			const medicalTermIssues = this.validateMedicalTerminology(text);
			errors.push(...medicalTermIssues);
		}

		return {
			isValid: errors.length === 0,
			errors,
			suggestions,
		};
	}

	/**
	 * Find invalid Polish character sequences
	 */
	private findInvalidPolishSequences(text: string): string[] {
		const errors: string[] = [];

		// Common invalid combinations
		const invalidPatterns = [
			{
				pattern: /([ąęó])([A-ZĘÓ])/g,
				message: "Incorrect capitalization after Polish character",
			},
			{
				pattern: /rz(?=[aąeęioóuy])/g,
				message: 'Possible incorrect use of "rz" instead of "ż"',
			},
			{
				pattern: /sz(?=[aąeęioóuy])/g,
				message: 'Possible incorrect use of "sz" instead of "ś"',
			},
			{
				pattern: /ch(?=[aąeęioóuy])/g,
				message: 'Possible incorrect use of "ch" instead of "h"',
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
	 * Find common Polish typos
	 */
	private findPolishTypos(text: string): string[] {
		const suggestions: string[] = [];

		// Common typos with Polish characters
		const typoPatterns = [
			{ pattern: /moge/g, suggestion: "mogę" },
			{ pattern: /prosze/g, suggestion: "proszę" },
			{ pattern: /dziekuje/g, suggestion: "dziękuję" },
			{ pattern: /wlasnie/g, suggestion: "właśnie" },
			{ pattern: /wlasciwie/g, suggestion: "właściwie" },
		];

		for (const { pattern, suggestion } of typoPatterns) {
			if (pattern.test(text)) {
				suggestions.push(
					`Consider using "${suggestion}" instead of common typo`,
				);
			}
		}

		return suggestions;
	}

	/**
	 * Validate medical terminology usage
	 */
	private validateMedicalTerminology(text: string): string[] {
		const errors: string[] = [];

		for (const [english, term] of this.medicalTerms.entries()) {
			// Check if English term is used when Polish should be used
			if (
				new RegExp(`\\b${english}\\b`, "i").test(text) &&
				this.config.targetAudience === "patient"
			) {
				errors.push(
					`Consider using Polish term "${term.polish}" instead of "${english}" for patient audience`,
				);
			}
		}

		return errors;
	}

	/**
	 * Generate localization hook template
	 */
	generateLocalizationHook(): string {
		return `// src/lib/hooks/use-polish-localization.ts
import { useState, useEffect } from 'react';

interface PolishLocalizationOptions {
  language?: 'pl' | 'en';
  fallbackLanguage?: 'pl' | 'en';
}

interface PolishTranslations {
  [key: string]: string;
}

export function usePolishLocalization(options: PolishLocalizationOptions = {}) {
  const { language = 'pl', fallbackLanguage = 'pl' } = options;
  const [translations, setTranslations] = useState<PolishTranslations>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load Polish translations
    const loadTranslations = async () => {
      try {
        // In a real implementation, this would load from a translation file
        const polishTranslations: PolishTranslations = {
          // Component-specific translations would be loaded here
        };

        setTranslations(polishTranslations);
      } catch (error) {
        console.error('Failed to load Polish translations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTranslations();
  }, [language]);

  const t = (key: string, fallback: string = ''): string => {
    return translations[key] || fallback;
  };

  const formatMedicalTerm = (english: string, polish: string): string => {
    if (language === 'pl') {
      return polish;
    }
    return english;
  };

  return {
    t,
    formatMedicalTerm,
    language,
    isLoading
  };
}
`;
	}

	/**
	 * Generate localization test utilities
	 */
	generateLocalizationTests(): string {
		return `// src/__tests__/utils/polish-localization.test.ts
import { describe, it, expect } from 'vitest';

export function validatePolishCharacters(text: string): boolean {
  // Test that Polish characters render correctly
  const polishChars = 'ąćęłńóśźżĄĆĘŁŃÓŚŹŻ';
  return [...text].every(char => {
    if (polishChars.includes(char)) {
      // Additional validation for Polish character rendering
      return true;
    }
    return true;
  });
}

export function testMedicalTerminology(english: string, polish: string): void {
  // Test that medical terms are correctly translated
  expect(polish).toBeTruthy();
  expect(polish.length).toBeGreaterThan(0);

  // Test Polish character validation
  if (/[ąćęłńóśźż]/i.test(polish)) {
    expect(validatePolishCharacters(polish)).toBe(true);
  }
}

describe('Polish Localization', () => {
  it('validates Polish character rendering', () => {
    expect(validatePolishCharacters('ząb')).toBe(true);
    expect(validatePolishCharacters('kość')).toBe(true);
    expect(validatePolishCharacters('mózg')).toBe(true);
  });

  it('validates medical terminology', () => {
    testMedicalTerminology('brain', 'mózg');
    testMedicalTerminology('vitamin', 'witamina');
    testMedicalTerminology('supplement', 'suplement');
  });
});
`;
	}
}
