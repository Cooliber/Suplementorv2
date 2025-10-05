/**
 * Polish Language Translations
 * Comprehensive Polish localization for Suplementor
 */

export const pl = {
	// Common
	common: {
		loading: "Ładowanie...",
		error: "Błąd",
		success: "Sukces",
		save: "Zapisz",
		cancel: "Anuluj",
		delete: "Usuń",
		edit: "Edytuj",
		close: "Zamknij",
		search: "Szukaj",
		filter: "Filtruj",
		clear: "Wyczyść",
		all: "Wszystkie",
		none: "Brak",
		more: "Więcej",
		less: "Mniej",
		back: "Wstecz",
		next: "Dalej",
		previous: "Poprzedni",
		continue: "Kontynuuj",
		submit: "Wyślij",
		confirm: "Potwierdź",
		learnMore: "Dowiedz się więcej",
		viewDetails: "Zobacz szczegóły",
		showMore: "Pokaż więcej",
		showLess: "Pokaż mniej",
	},

	// Navigation
	nav: {
		home: "Strona Główna",
		search: "Wyszukiwanie",
		supplements: "Suplementy",
		stackBuilder: "Kreator Stosu",
		tcm: "Medycyna Chińska",
		brain: "Mózg 3D",
		knowledge: "Baza Wiedzy",
		profile: "Profil",
		dashboard: "Panel",
		tracking: "Śledzenie",
		recommendations: "Rekomendacje",
	},

	// Homepage
	home: {
		hero: {
			title: "Odkryj Moc Suplementów",
			subtitle:
				"Kompleksowa platforma edukacyjna o nootropikach i wzmacnianiu funkcji poznawczych",
			cta: "Rozpocznij Eksplorację",
		},
		features: {
			title: "Główne Funkcje",
			search: {
				title: "Zaawansowane Wyszukiwanie",
				description:
					"Przeszukuj bazę 200+ suplementów z polskimi tłumaczeniami",
				items: [
					"Filtry według kategorii i poziomu dowodów",
					"Wyszukiwanie po efektach i mechanizmach",
					"Porównanie skuteczności",
				],
			},
			recommendations: {
				title: "Rekomendacje AI",
				description:
					"Personalizowane sugestie oparte na Twoim profilu zdrowotnym",
				items: [
					"12 celów zdrowotnych",
					"Scoring 0-100 dla każdego suplementu",
					"Analiza synergii i przeciwwskazań",
				],
			},
			evidence: {
				title: "Oparte na Dowodach",
				description: "Wszystkie informacje poparte badaniami naukowymi",
				items: [
					"Poziomy dowodów: STRONG, MODERATE, WEAK",
					"Linki do badań klinicznych",
					"Aktualizacje co miesiąc",
				],
			},
		},
		stats: {
			supplements: "Suplementów",
			studies: "Badań Naukowych",
			mechanisms: "Mechanizmów Działania",
			interactions: "Interakcji",
		},
	},

	// Search
	search: {
		title: "Zaawansowane Wyszukiwanie",
		subtitle: "Znajdź idealne suplementy dla swoich potrzeb",
		placeholder: "Szukaj suplementów, kategorii, efektów...",
		filters: "Filtry",
		results: "Znaleziono {count} suplementów",
		noResults:
			"Nie znaleziono suplementów pasujących do kryteriów wyszukiwania",
		clearFilters: "Wyczyść filtry",
		clearSearch: "Wyczyść wyszukiwanie",
		categories: {
			all: "Wszystkie",
			aminoAcids: "Aminokwasy",
			herbs: "Zioła",
			vitamins: "Witaminy",
			minerals: "Minerały",
			fattyAcids: "Kwasy Tłuszczowe",
			nootropics: "Nootropiki",
			adaptogens: "Adaptogeny",
			mushrooms: "Grzyby",
		},
		evidenceLevels: {
			all: "Wszystkie",
			strong: "STRONG - Silne dowody",
			moderate: "MODERATE - Umiarkowane dowody",
			weak: "WEAK - Słabe dowody",
			insufficient: "INSUFFICIENT - Niewystarczające dowody",
		},
	},

	// Stack Builder
	stackBuilder: {
		title: "Kreator Stosu Suplementów",
		subtitle: "Zbuduj i optymalizuj swój stos suplementów",
		yourStack: "Twój Stos",
		availableSupplements: "Dostępne Suplementy",
		addToStack: "Dodaj do Stosu",
		removeFromStack: "Usuń ze Stosu",
		interactions: "Interakcje",
		synergies: "Synergie",
		contraindications: "Przeciwwskazania",
		warnings: "Ostrzeżenia",
		totalDosage: "Całkowita Dawka",
		timing: "Timing",
		saveStack: "Zapisz Stos",
		shareStack: "Udostępnij Stos",
		exportStack: "Eksportuj Stos",
		emptyStack: "Twój stos jest pusty. Dodaj suplementy z listy dostępnych.",
		interactionTypes: {
			synergistic: "Synergistyczna",
			antagonistic: "Antagonistyczna",
			additive: "Addytywna",
			potentiating: "Potencjująca",
		},
		severity: {
			low: "Niska",
			moderate: "Umiarkowana",
			high: "Wysoka",
			critical: "Krytyczna",
		},
	},

	// TCM (Traditional Chinese Medicine)
	tcm: {
		title: "Tradycyjna Medycyna Chińska",
		subtitle: "Odkryj starożytną mądrość TCM z nowoczesnym podejściem naukowym",
		fiveElements: {
			title: "Pięć Elementów (五行)",
			wood: "Drewno",
			fire: "Ogień",
			earth: "Ziemia",
			metal: "Metal",
			water: "Woda",
		},
		herbs: {
			title: "Zioła TCM",
			nature: "Natura i Smak",
			meridians: "Meridiany",
			yinYang: "Yin/Yang",
			actions: "Działania",
			indications: "Wskazania",
		},
		formulas: {
			title: "Klasyczne Formuły TCM",
			category: "Kategoria",
			actions: "Działania",
			indications: "Wskazania",
			composition: "Skład",
		},
		properties: {
			temperature: {
				hot: "Gorąca",
				warm: "Ciepła",
				neutral: "Neutralna",
				cool: "Chłodna",
				cold: "Zimna",
			},
			taste: {
				sweet: "Słodki",
				sour: "Kwaśny",
				bitter: "Gorzki",
				pungent: "Ostry",
				salty: "Słony",
			},
		},
	},

	// Supplement Details
	supplement: {
		overview: "Przegląd",
		description: "Opis",
		clinicalApplications: "Zastosowania Kliniczne",
		mechanisms: "Mechanizmy Działania",
		dosage: "Dawkowanie",
		sideEffects: "Efekty Uboczne",
		interactions: "Interakcje",
		research: "Badania Naukowe",
		brainRegions: "Regiony Mózgu",
		activeCompounds: "Aktywne Związki",
		bioavailability: "Biodostępność",
		therapeuticRange: "Zakres Terapeutyczny",
		timing: "Timing",
		withFood: "Z jedzeniem",
		withoutFood: "Na czczo",
		evidenceLevel: "Poziom Dowodów",
		effectiveness: "Skuteczność",
		recommendedDose: "Zalecana Dawka",
		duration: "Czas Trwania",
		frequency: {
			daily: "Codziennie",
			twiceDaily: "Dwa razy dziennie",
			threeTimesDaily: "Trzy razy dziennie",
			asNeeded: "W razie potrzeby",
			weekly: "Tygodniowo",
		},
		severity: {
			mild: "Łagodny",
			moderate: "Umiarkowany",
			severe: "Ciężki",
		},
		frequencyOfOccurrence: {
			rare: "Rzadki",
			uncommon: "Niezbyt częsty",
			common: "Częsty",
			veryCommon: "Bardzo częsty",
		},
	},

	// Errors
	errors: {
		generic: "Wystąpił błąd. Spróbuj ponownie.",
		notFound: "Nie znaleziono",
		unauthorized: "Brak autoryzacji",
		forbidden: "Brak dostępu",
		serverError: "Błąd serwera",
		networkError: "Błąd połączenia",
		validationError: "Błąd walidacji",
		tryAgain: "Spróbuj ponownie",
		goHome: "Wróć do strony głównej",
		refresh: "Odśwież stronę",
	},

	// Loading
	loading: {
		supplements: "Ładowanie suplementów...",
		search: "Wyszukiwanie...",
		saving: "Zapisywanie...",
		loading: "Ładowanie...",
		processing: "Przetwarzanie...",
	},

	// Success Messages
	success: {
		saved: "Zapisano pomyślnie",
		deleted: "Usunięto pomyślnie",
		updated: "Zaktualizowano pomyślnie",
		copied: "Skopiowano do schowka",
		shared: "Udostępniono pomyślnie",
	},

	// Brain Regions
	brain: {
		title: "Interaktywny Model Mózgu 3D",
		subtitle: "Eksploruj regiony mózgu i ich funkcje",
		regions: {
			prefrontalCortex: "Kora Przedczołowa",
			hippocampus: "Hipokamp",
			amygdala: "Ciało Migdałowate",
			cerebellum: "Móżdżek",
			basalGanglia: "Zwoje Podstawy",
			thalamus: "Wzgórze",
			hypothalamus: "Podwzgórze",
		},
		functions: "Funkcje",
		affectedBy: "Wpływ Suplementów",
	},

	// User Profile
	profile: {
		title: "Profil Użytkownika",
		personalInfo: "Informacje Osobiste",
		healthGoals: "Cele Zdrowotne",
		currentSupplements: "Obecne Suplementy",
		preferences: "Preferencje",
		settings: "Ustawienia",
	},

	// Dashboard
	dashboard: {
		title: "Panel Użytkownika",
		overview: "Przegląd",
		recentActivity: "Ostatnia Aktywność",
		savedStacks: "Zapisane Stosy",
		recommendations: "Rekomendacje",
		progress: "Postępy",
	},
} as const;

export type TranslationKey = typeof pl;
