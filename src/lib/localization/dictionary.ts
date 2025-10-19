// src/lib/localization/dictionary.ts
import type { PolishMedicalTerm } from "./types";

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

// Medical terminology database
export const MEDICAL_TERMS = new Map<string, PolishMedicalTerm>([
	// Anatomy terms
	[
		"brain",
		{
			english: "brain",
			polish: "mózg",
			category: "anatomy",
			context: "Central organ of the nervous system",
		},
	],
	[
		"heart",
		{
			english: "heart",
			polish: "serce",
			category: "anatomy",
			context: "Muscular organ that pumps blood",
		},
	],
	[
		"liver",
		{
			english: "liver",
			polish: "wątroba",
			category: "anatomy",
			context: "Large organ involved in metabolism",
		},
	],
	[
		"kidney",
		{
			english: "kidney",
			polish: "nerka",
			category: "anatomy",
			context: "Organs that filter blood",
		},
	],
	[
		"neuron",
		{
			english: "neuron",
			polish: "neuron",
			category: "anatomy",
			context: "Nerve cell that transmits signals",
		},
	],
	[
		"synapse",
		{
			english: "synapse",
			polish: "synapsa",
			category: "anatomy",
			context: "Junction between neurons",
		},
	],
	[
		"hippocampus",
		{
			english: "hippocampus",
			polish: "hipokamp",
			category: "anatomy",
			context: "Brain region involved in memory",
		},
	],
	[
		"prefrontal-cortex",
		{
			english: "prefrontal cortex",
			polish: "kora przedczołowa",
			category: "anatomy",
			context: "Brain region for executive functions",
		},
	],
	[
		"amygdala",
		{
			english: "amygdala",
			polish: "ciało migdałowate",
			category: "anatomy",
			context: "Brain region involved in emotions",
		},
	],
	[
		"cerebellum",
		{
			english: "cerebellum",
			polish: "móżdżek",
			category: "anatomy",
			context: "Brain region for motor coordination",
		},
	],

	// Supplement terms
	[
		"vitamin",
		{
			english: "vitamin",
			polish: "witamina",
			category: "supplement",
			context: "Essential organic compound",
		},
	],
	[
		"mineral",
		{
			english: "mineral",
			polish: "minerał",
			category: "supplement",
			context: "Inorganic element essential for health",
		},
	],
	[
		"supplement",
		{
			english: "supplement",
			polish: "suplement",
			category: "supplement",
			context: "Product taken to complement diet",
		},
	],
	[
		"dosage",
		{
			english: "dosage",
			polish: "dawkowanie",
			category: "supplement",
			context: "Amount and frequency of supplement",
		},
	],
	[
		"contraindication",
		{
			english: "contraindication",
			polish: "przeciwwskazanie",
			category: "supplement",
			context: "Reason not to use a supplement",
		},
	],
	[
		"interaction",
		{
			english: "interaction",
			polish: "interakcja",
			category: "supplement",
			context: "Effect between supplements or drugs",
		},
	],
	[
		"bioavailability",
		{
			english: "bioavailability",
			polish: "biodostępność",
			category: "supplement",
			context: "Fraction of supplement that is absorbed",
		},
	],
	[
		"half-life",
		{
			english: "half-life",
			polish: "okres półtrwania",
			category: "supplement",
			context: "Time for concentration to reduce by half",
		},
	],

	// Condition terms
	[
		"cognitive",
		{
			english: "cognitive",
			polish: "poznawcze",
			category: "condition",
			context: "Related to mental processes",
		},
	],
	[
		"memory",
		{
			english: "memory",
			polish: "pamięć",
			category: "condition",
			context: "Ability to store and recall information",
		},
	],
	[
		"concentration",
		{
			english: "concentration",
			polish: "koncentracja",
			category: "condition",
			context: "Ability to focus attention",
		},
	],
	[
		"focus",
		{
			english: "focus",
			polish: "skupienie",
			category: "condition",
			context: "Mental attention and concentration",
		},
	],
	[
		"stress",
		{
			english: "stress",
			polish: "stres",
			category: "condition",
			context: "Physical or mental tension",
		},
	],
	[
		"anxiety",
		{
			english: "anxiety",
			polish: "lęk",
			category: "condition",
			context: "Feeling of worry or nervousness",
		},
	],
	[
		"depression",
		{
			english: "depression",
			polish: "depresja",
			category: "condition",
			context: "Mood disorder with persistent sadness",
		},
	],
	[
		"insomnia",
		{
			english: "insomnia",
			polish: "bezsenność",
			category: "condition",
			context: "Difficulty falling or staying asleep",
		},
	],
	[
		"fatigue",
		{
			english: "fatigue",
			polish: "zmęczenie",
			category: "condition",
			context: "Extreme tiredness or exhaustion",
		},
	],
	[
		"brain-fog",
		{
			english: "brain fog",
			polish: "mgła mózgowa",
			category: "condition",
			context: "Mental confusion or lack of clarity",
		},
	],

	// Treatment terms
	[
		"therapy",
		{
			english: "therapy",
			polish: "terapia",
			category: "treatment",
			context: "Treatment intended to relieve illness",
		},
	],
	[
		"treatment",
		{
			english: "treatment",
			polish: "leczenie",
			category: "treatment",
			context: "Medical care given to a patient",
		},
	],
	[
		"medication",
		{
			english: "medication",
			polish: "lek",
			category: "treatment",
			context: "Substance used to treat medical conditions",
		},
	],
	[
		"efficacy",
		{
			english: "efficacy",
			polish: "skuteczność",
			category: "treatment",
			context: "Ability to produce desired effect",
		},
	],
	[
		"safety",
		{
			english: "safety",
			polish: "bezpieczeństwo",
			category: "treatment",
			context: "Condition of being protected from harm",
		},
	],
	[
		"side-effect",
		{
			english: "side effect",
			polish: "efekt uboczny",
			category: "treatment",
			context: "Unintended consequence of treatment",
		},
	],
	[
		"adverse-reaction",
		{
			english: "adverse reaction",
			polish: "reakcja niepożądana",
			category: "treatment",
			context: "Harmful or unpleasant response",
		},
	],
	[
		"tolerance",
		{
			english: "tolerance",
			polish: "tolerancja",
			category: "treatment",
			context: "Reduced response to a substance",
		},
	],

	// Research terms
	[
		"research",
		{
			english: "research",
			polish: "badania",
			category: "general",
			context: "Systematic investigation",
		},
	],
	[
		"study",
		{
			english: "study",
			polish: "badanie",
			category: "general",
			context: "Detailed examination or analysis",
		},
	],
	[
		"evidence",
		{
			english: "evidence",
			polish: "dowody",
			category: "general",
			context: "Information supporting a conclusion",
		},
	],
	[
		"clinical",
		{
			english: "clinical",
			polish: "kliniczne",
			category: "general",
			context: "Related to medical treatment",
		},
	],
	[
		"trial",
		{
			english: "trial",
			polish: "badanie",
			category: "general",
			context: "Test of a hypothesis or treatment",
		},
	],
	[
		"placebo",
		{
			english: "placebo",
			polish: "placebo",
			category: "general",
			context: "Inactive substance used as control",
		},
	],
	[
		"double-blind",
		{
			english: "double-blind",
			polish: "podwójnie ślepe",
			category: "general",
			context: "Neither patient nor doctor knows treatment",
		},
	],
	[
		"randomized",
		{
			english: "randomized",
			polish: "randomizowane",
			category: "general",
			context: "Assigned randomly to groups",
		},
	],
	[
		"meta-analysis",
		{
			english: "meta-analysis",
			polish: "metaanaliza",
			category: "general",
			context: "Statistical analysis of multiple studies",
		},
	],
	[
		"systematic-review",
		{
			english: "systematic review",
			polish: "przegląd systematyczny",
			category: "general",
			context: "Comprehensive review of literature",
		},
	],
]);

// Common UI translations
export const DEFAULT_TRANSLATIONS: TranslationDictionary = {
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

	// Component specific translations
	"components.button.loading": "Ładowanie...",
	"components.button.submit": "Wyślij",
	"components.button.cancel": "Anuluj",
	"components.button.confirm": "Potwierdź",
	"components.button.delete": "Usuń",
	"components.button.edit": "Edytuj",
	"components.button.add": "Dodaj",
	"components.button.save": "Zapisz",
	"components.button.close": "Zamknij",
	"components.button.retry": "Spróbuj ponownie",

	// Error specific translations
	"errors.network.title": "Problem z połączeniem",
	"errors.network.message": "Sprawdź połączenie internetowe i spróbuj ponownie",
	"errors.server.title": "Błąd serwera",
	"errors.server.message":
		"Tymczasowy problem z serwerem. Spróbuj ponownie za chwilę",
	"errors.validation.title": "Błąd walidacji",
	"errors.validation.message": "Sprawdź poprawność wprowadzonych danych",
	"errors.timeout.title": "Przekroczono limit czasu",
	"errors.timeout.message": "Operacja trwa zbyt długo. Spróbuj ponownie",
	"errors.permission.title": "Brak uprawnień",
	"errors.permission.message": "Nie masz uprawnień do wykonania tej czynności",
	"errors.supplement.title": "Błąd suplementu",
	"errors.supplement.message": "Nie udało się załadować danych suplementu",
	"errors.dosage.title": "Błąd kalkulacji",
	"errors.dosage.message": "Wystąpił błąd podczas obliczania dawki",
	"errors.review.title": "Błąd opinii",
	"errors.review.message": "Nie udało się wysłać opinii",

	// Error actions
	"errors.actions.retry": "Spróbuj ponownie",
	"errors.actions.dismiss": "Zamknij",
	"errors.actions.details": "Szczegóły błędu",
	"errors.actions.contact": "Skontaktuj się z nami",

	// Error details
	"errors.details.stack": "Stack trace",
	"errors.details.timestamp": "Czas wystąpienia",
	"errors.details.context": "Kontekst błędu",

	// Graph/Visualization terms
	"graph.nodes": "Węzły",
	"graph.edges": "Krawędzie",
	"graph.connections": "Połączenia",
	"graph.relationships": "Relacje",
	"graph.strength": "Siła",
	"graph.evidence": "Dowody",
	"graph.category": "Kategoria",
	"graph.type": "Typ",
	"graph.description": "Opis",
	"graph.details": "Szczegóły",
	"graph.overview": "Przegląd",
	"graph.summary": "Podsumowanie",

	// Educational terms
	"education.learning": "Nauka",
	"education.course": "Kurs",
	"education.lesson": "Lekcja",
	"education.module": "Moduł",
	"education.progress": "Postęp",
	"education.completed": "Ukończono",
	"education.incomplete": "Nieukończono",
	"education.locked": "Zablokowano",
	"education.unlocked": "Odblokowano",
	"education.prerequisites": "Wymagania wstępne",
	"education.objectives": "Cele",
	"education.outcomes": "Rezultaty",
	"education.assessment": "Ocena",
	"education.feedback": "Informacja zwrotna",
	"education.certification": "Certyfikacja",
};

export const createLocalizedContent = (
	componentName: string,
	translations: TranslationDictionary = {},
): LocalizedContent => {
	const componentTranslations: TranslationDictionary = {};

	// Generate component-specific translations
	componentTranslations[`${componentName.toLowerCase()}.title`] = componentName;
	componentTranslations[`${componentName.toLowerCase()}.description`] =
		`${componentName} - Komponent platformy Suplementor`;
	componentTranslations[`${componentName.toLowerCase()}.loading`] =
		"Ładowanie...";
	componentTranslations[`${componentName.toLowerCase()}.error`] =
		"Wystąpił błąd";
	componentTranslations[`${componentName.toLowerCase()}.empty`] = "Brak danych";
	componentTranslations[`${componentName.toLowerCase()}.retry`] =
		"Spróbuj ponownie";

	return {
		translations: {
			...DEFAULT_TRANSLATIONS,
			...componentTranslations,
			...translations,
		},
		medicalTerms: MEDICAL_TERMS,
		validationRules: generateValidationRules(),
		lastUpdated: new Date().toISOString(),
		version: "1.0.0",
	};
};

export const generateValidationRules = (): string[] => {
	return [
		"Wszystkie polskie znaki (ą, ć, ę, ł, ń, ó, ś, ź, ż) muszą być poprawnie renderowane",
		"Tekst powinien być prawidłowo zakodowany w UTF-8",
		"Czcionki zastępcze powinny obsługiwać polskie znaki",
		"Czytniki ekranu powinny poprawnie wymawiać polskie znaki",
		"Funkcja kopiuj/wklej powinna zachować polskie znaki",
		"Terminologia medyczna powinna być spójna i dokładna",
		"Tłumaczenia powinny uwzględniać kontekst kulturowy",
		"Terminy specjalistyczne powinny być tłumaczone przez ekspertów",
		"Należy unikać anglicyzmów w tłumaczeniach na język polski",
		"Tłumaczenia powinny być dostosowane do grupy docelowej",
	];
};

export const getMedicalTerm = (
	english: string,
): PolishMedicalTerm | undefined => {
	return MEDICAL_TERMS.get(english);
};

export const getTranslation = (key: string, fallback = ""): string => {
	return DEFAULT_TRANSLATIONS[key] || fallback || key;
};

export const validatePolishCharacters = (text: string): boolean => {
	const polishChars = "ąćęłńóśźżĄĆĘŁŃÓŚŹŻ";
	return [...text].every((char) => {
		if (polishChars.includes(char)) {
			return true;
		}
		return true;
	});
};
