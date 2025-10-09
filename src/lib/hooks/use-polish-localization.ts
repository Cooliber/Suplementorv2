// src/lib/hooks/use-polish-localization.ts
import { useCallback, useEffect, useState } from "react";

interface PolishLocalizationOptions {
	language?: "pl" | "en";
	fallbackLanguage?: "pl" | "en";
	enableMedicalTerms?: boolean;
	enableCharacterValidation?: boolean;
}

interface PolishTranslations {
	[key: string]: string;
}

interface PolishMedicalTerm {
	english: string;
	polish: string;
	category: "anatomy" | "condition" | "treatment" | "supplement" | "general";
	context?: string;
}

interface PolishLocalizationResult {
	t: (key: string, fallback?: string) => string;
	formatMedicalTerm: (english: string, polish: string) => string;
	validatePolishText: (text: string) => {
		isValid: boolean;
		errors: string[];
		suggestions: string[];
	};
	language: "pl" | "en";
	isLoading: boolean;
	medicalTerms: Map<string, PolishMedicalTerm>;
}

// Medical terminology database
const MEDICAL_TERMS = new Map<string, PolishMedicalTerm>([
	// Anatomy terms
	["brain", { english: "brain", polish: "mózg", category: "anatomy" }],
	["heart", { english: "heart", polish: "serce", category: "anatomy" }],
	["liver", { english: "liver", polish: "wątroba", category: "anatomy" }],
	["kidney", { english: "kidney", polish: "nerka", category: "anatomy" }],
	["neuron", { english: "neuron", polish: "neuron", category: "anatomy" }],
	["synapse", { english: "synapse", polish: "synapsa", category: "anatomy" }],
	["stomach", { english: "stomach", polish: "żołądek", category: "anatomy" }],
	["intestine", { english: "intestine", polish: "jelito", category: "anatomy" }],
	["lung", { english: "lung", polish: "płuco", category: "anatomy" }],
	["thymus", { english: "thymus", polish: "grasica", category: "anatomy" }],
	["spleen", { english: "spleen", polish: "śledziona", category: "anatomy" }],
	["lymph node", { english: "lymph node", polish: "węzeł chłonny", category: "anatomy" }],
	["artery", { english: "artery", polish: "tętnica", category: "anatomy" }],
	["vein", { english: "vein", polish: "żyła", category: "anatomy" }],
	
	// Body systems
	["cardiovascular system", { english: "cardiovascular system", polish: "układ sercowo-naczyniowy", category: "anatomy" }],
	["digestive system", { english: "digestive system", polish: "układ pokarmowy", category: "anatomy" }],
	["immune system", { english: "immune system", polish: "układ odpornościowy", category: "anatomy" }],
	["respiratory system", { english: "respiratory system", polish: "układ oddechowy", category: "anatomy" }],
	["endocrine system", { english: "endocrine system", polish: "układ hormonalny", category: "anatomy" }],

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
		{ english: "concentration", polish: "koncentracja", category: "condition" },
	],
	["stress", { english: "stress", polish: "stres", category: "condition" }],
	["anxiety", { english: "anxiety", polish: "lęk", category: "condition" }],
	[
		"depression",
		{ english: "depression", polish: "depresja", category: "condition" },
	],

	// Treatment terms
	["therapy", { english: "therapy", polish: "terapia", category: "treatment" }],
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
	["research", { english: "research", polish: "badania", category: "general" }],
	["study", { english: "study", polish: "badanie", category: "general" }],
	["evidence", { english: "evidence", polish: "dowody", category: "general" }],
	[
		"clinical",
		{ english: "clinical", polish: "kliniczne", category: "general" },
	],
	["trial", { english: "trial", polish: "badanie", category: "general" }],
]);

// Common UI translations
const DEFAULT_TRANSLATIONS: PolishTranslations = {
	// Common UI elements
	"common.loading": "Ładowanie...",
	"common.error": "Wystąpił błąd",
	"common.retry": "Spróbuj ponownie",
	"common.cancel": "Anuluj",
	"common.confirm": "Potwierdź",
	"common.save": "Zapisz",
	"common.delete": "Usuń",
	"common.edit": "Edytuj",
	"common.add": "Dodaj",
	"common.remove": "Usuń",
	"common.search": "Szukaj",
	"common.filter": "Filtruj",
	"common.sort": "Sortuj",
	"common.export": "Eksportuj",
	"common.import": "Importuj",
	"common.download": "Pobierz",
	"common.upload": "Prześlij",
	"common.share": "Udostępnij",
	"common.copy": "Kopiuj",
	"common.paste": "Wklej",
	"common.cut": "Wytnij",
	"common.undo": "Cofnij",
	"common.redo": "Powtórz",

	// Navigation
	"navigation.home": "Strona główna",
	"navigation.dashboard": "Panel główny",
	"navigation.profile": "Profil",
	"navigation.settings": "Ustawienia",
	"navigation.help": "Pomoc",
	"navigation.about": "O nas",
	"navigation.contact": "Kontakt",
	"navigation.logout": "Wyloguj",

	// Status messages
	"status.success": "Operacja zakończona pomyślnie",
	"status.warning": "Ostrzeżenie",
	"status.error": "Błąd",
	"status.info": "Informacja",

	// Form elements
	"form.required": "Pole wymagane",
	"form.optional": "Pole opcjonalne",
	"form.submit": "Wyślij",
	"form.reset": "Resetuj",
	"form.clear": "Wyczyść",

	// Medical/Supplement specific
	"medical.dosage": "Dawkowanie",
	"medical.frequency": "Częstotliwość",
	"medical.duration": "Czas trwania",
	"medical.precautions": "Środki ostrożności",
	"medical.sideEffects": "Efekty uboczne",
	"medical.interactions": "Interakcje",
	"medical.contraindications": "Przeciwwskazania",
	"medical.benefits": "Korzyści",
	"medical.risks": "Ryzyka",
	"medical.recommendations": "Zalecenia",
	"medical.monitoring": "Monitorowanie",
	"medical.documentation": "Dokumentacja",
	"medical.research": "Badania",
	"medical.evidence": "Dowody",
	"medical.clinical": "Badania kliniczne",
	"medical.safety": "Bezpieczeństwo",
	"medical.efficacy": "Skuteczność",

	// Supplement categories
	"supplements.vitamins": "Witaminy",
	"supplements.minerals": "Minerały",
	"supplements.herbs": "Zioła",
	"supplements.aminoAcids": "Aminokwasy",
	"supplements.nootropics": "Nootropiki",
	"supplements.adaptogens": "Adaptogeny",
	"supplements.antioxidants": "Antyoksydanty",

	// Brain/Cognitive terms
	"brain.cognition": "Funkcje poznawcze",
	"brain.memory": "Pamięć",
	"brain.focus": "Koncentracja",
	"brain.learning": "Uczenie się",
	"brain.mood": "Nastrój",
	"brain.energy": "Energia",
	"brain.sleep": "Sen",
	"brain.stress": "Stres",
	"brain.anxiety": "Lęk",
	"brain.depression": "Depresja",
	"brain.neuroprotection": "Neuroprotekcja",
	"brain.neurogenesis": "Neurogeneza",
	"brain.plasticity": "Plastyczność mózgu",
	"brain.bloodFlow": "Przepływ krwi w mózgu",
	"brain.inflammation": "Zapalenie mózgu",
	"brain.oxidativeStress": "Stres oksydacyjny",
};

export function usePolishLocalization(
	options: PolishLocalizationOptions = {},
): PolishLocalizationResult {
	const {
		language = "pl",
		fallbackLanguage = "pl",
		enableMedicalTerms = true,
		enableCharacterValidation = true,
	} = options;

	const [translations, setTranslations] = useState<PolishTranslations>({});
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const loadTranslations = async () => {
			try {
				setIsLoading(true);

				// Start with default translations
				let allTranslations = { ...DEFAULT_TRANSLATIONS };

				// In a real implementation, you might load additional translations from files
				// For now, we'll use the defaults and add medical terms if enabled
				if (enableMedicalTerms) {
					const medicalTranslations: PolishTranslations = {};
					for (const [english, term] of MEDICAL_TERMS.entries()) {
						medicalTranslations[`medical.${english}`] = term.polish;
					}
					allTranslations = { ...allTranslations, ...medicalTranslations };
				}

				setTranslations(allTranslations);
			} catch (error) {
				console.error("Failed to load Polish translations:", error);
			} finally {
				setIsLoading(false);
			}
		};

		loadTranslations();
	}, [language, enableMedicalTerms]);

	const t = useCallback(
		(key: string, fallback = ""): string => {
			return translations[key] || fallback || key;
		},
		[translations],
	);

	const formatMedicalTerm = useCallback(
		(english: string, polish: string): string => {
			if (language === "pl") {
				return polish;
			}
			return english;
		},
		[language],
	);

	const validatePolishText = useCallback(
		(
			text: string,
		): { isValid: boolean; errors: string[]; suggestions: string[] } => {
			const errors: string[] = [];
			const suggestions: string[] = [];

			if (!enableCharacterValidation) {
				return { isValid: true, errors: [], suggestions: [] };
			}

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

			// Check for medical terminology accuracy
			if (enableMedicalTerms) {
				const medicalTermIssues = validateMedicalTerminology(text, language);
				errors.push(...medicalTermIssues);
			}

			return {
				isValid: errors.length === 0,
				errors,
				suggestions,
			};
		},
		[enableCharacterValidation, enableMedicalTerms, language],
	);

	return {
		t,
		formatMedicalTerm,
		validatePolishText,
		language,
		isLoading,
		medicalTerms: MEDICAL_TERMS,
	};
}

// Helper functions
function findInvalidPolishSequences(text: string): string[] {
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

function findPolishTypos(text: string): string[] {
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
			suggestions.push(`Consider using "${suggestion}" instead of common typo`);
		}
	}

	return suggestions;
}

function validateMedicalTerminology(
	text: string,
	language: "pl" | "en",
): string[] {
	const errors: string[] = [];

	if (language === "pl") {
		// When using Polish, check if English medical terms are used inappropriately
		for (const [english, term] of MEDICAL_TERMS.entries()) {
			if (new RegExp(`\\b${english}\\b`, "i").test(text)) {
				errors.push(
					`Consider using Polish term "${term.polish}" instead of "${english}"`,
				);
			}
		}
	}

	return errors;
}
