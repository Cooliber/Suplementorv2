/**
 * Polish Language Integration for Gesture System
 * Comprehensive Polish localization for gesture instructions, tutorials, and feedback
 */

import type { GestureType, PolishGestureLabels } from "../types/gestures";

export class PolishGestureLocalization {
	private currentLanguage: "pl" | "en" = "pl";
	private labels: PolishGestureLabels;

	constructor() {
		this.labels = this.initializePolishLabels();
	}

	/**
	 * Initialize comprehensive Polish gesture labels
	 */
	private initializePolishLabels(): PolishGestureLabels {
		return {
			gestures: {
				tap: "Dotknij",
				"double-tap": "Dotknij dwukrotnie",
				"long-press": "Przytrzymaj",
				pan: "Przesuń",
				pinch: "Szczypnij",
				rotate: "Obróć",
				swipe: "Przesuń szybko",
				"edge-swipe": "Przesuń od krawędzi",
				"two-finger-pan": "Przesuń dwoma palcami",
				"three-finger-swipe": "Przesuń trzema palcami",
				"pressure-hold": "Naciśnij mocno",
				hover: "Najedź",
				drag: "Przeciągnij",
				flick: "Szybko przesuń",
			},

			instructions: {
				// Basic navigation instructions
				"gestures.tap.basic": "Dotknij region mózgu, aby go wybrać",
				"gestures.tap.selection": "Dotknij, aby wybrać region mózgu",
				"gestures.tap.focus": "Dotknij, aby skupić kamerę na regionie",

				"gestures.double-tap.basic": "Dotknij dwukrotnie, aby zresetować widok",
				"gestures.double-tap.zoom": "Dotknij dwukrotnie, aby szybko przybliżyć",

				"gestures.long-press.basic": "Przytrzymaj, aby aktywować tryb sekcji",
				"gestures.long-press.dissection":
					"Przytrzymaj mocno na regionie, aby go rozciąć",
				"gestures.long-press.context":
					"Przytrzymaj, aby wyświetlić menu kontekstowe",

				"gestures.pan.basic": "Przesuń palcem, aby obracać kamerę wokół modelu",
				"gestures.pan.orbit": "Przesuń, aby orbitować wokół mózgu",
				"gestures.pan.navigation": "Przesuń, aby nawigować po modelu 3D",

				"gestures.pinch.basic": "Szczypnij, aby przybliżyć lub oddalić",
				"gestures.pinch.zoom":
					"Rozsuń palce, aby przybliżyć, zsuń, aby oddalić",
				"gestures.pinch.scale": "Użyj szczypania, aby zmienić skalę widoku",

				"gestures.rotate.basic": "Obróć dwoma palcami, aby obrócić model",
				"gestures.rotate.model": "Obróć, aby zmienić orientację modelu mózgu",
				"gestures.rotate.view": "Obróć, aby zmienić kąt widzenia",

				"gestures.swipe.basic":
					"Przesuń szybko, aby przejść do następnego widoku",
				"gestures.swipe.navigation":
					"Przesuń w lewo/prawo, aby zmienić warstwę",
				"gestures.swipe.layer": "Przesuń, aby nawigować między warstwami mózgu",

				// Advanced manipulation instructions
				"gestures.two-finger-pan.basic":
					"Użyj dwóch palców, aby przesunąć cały model",
				"gestures.two-finger-pan.manipulation":
					"Przesuń dwoma palcami, aby zmienić pozycję modelu",

				"gestures.three-finger-swipe.basic":
					"Przesuń trzema palcami, aby aktywować menu",
				"gestures.three-finger-swipe.system":
					"Przesuń trzema palcami, aby otworzyć ustawienia",

				"gestures.pressure-hold.basic":
					"Naciśnij mocno, aby aktywować funkcję nacisku",
				"gestures.pressure-hold.precision":
					"Użyj nacisku, aby uzyskać precyzyjną kontrolę",

				// Educational context
				"gestures.hover.basic":
					"Najedź kursorem na region, aby wyświetlić informacje",
				"gestures.hover.inspection": "Najedź, aby sprawdzić szczegóły regionu",

				"gestures.drag.basic": "Przeciągnij, aby przesunąć zaznaczenie",
				"gestures.drag.multi-select": "Przeciągnij, aby wybrać wiele regionów",

				// Tutorial instructions
				"tutorial.welcome.title": "Witaj w interaktywnym mózgu 3D!",
				"tutorial.welcome.description":
					"Naucz się gestów, aby efektywnie eksplorować mózg",

				"tutorial.basic-navigation.title": "Podstawowa nawigacja",
				"tutorial.basic-navigation.description":
					"Poznaj podstawowe gesty nawigacyjne",

				"tutorial.advanced-manipulation.title": "Zaawansowana manipulacja",
				"tutorial.advanced-manipulation.description":
					"Naucz się sekcji i zaawansowanych interakcji",

				"tutorial.expert-techniques.title": "Techniki eksperckie",
				"tutorial.expert-techniques.description":
					"Opanuj złożone kombinacje gestów",

				// Step-by-step instructions
				"tutorial.step.tap": "Dotknij delikatnie regionu mózgu, aby go wybrać",
				"tutorial.step.pinch":
					"Umieść dwa palce na ekranie i rozsuń je, aby przybliżyć",
				"tutorial.step.pan":
					"Przesuń palcem po ekranie, aby obracać się wokół modelu",
				"tutorial.step.long-press":
					"Przytrzymaj palec na regionie przez 2 sekundy",
				"tutorial.step.rotate":
					"Użyj dwóch palców i obróć nimi, aby zmienić orientację",

				// Success feedback
				"tutorial.success.basic": "Świetnie! Opanowałeś podstawowy gest.",
				"tutorial.success.advanced": "Doskonale! To był zaawansowany gest.",
				"tutorial.success.expert": "Niesamowite! Jesteś prawdziwym ekspertem!",

				// Encouragement
				"tutorial.encouragement.try-again":
					"Spróbuj jeszcze raz. Ćwiczenie czyni mistrza!",
				"tutorial.encouragement.almost":
					"Prawie się udało! Jeszcze jedna próba.",
				"tutorial.encouragement.keep-going":
					"Nie poddawaj się! Każda próba przybliża Cię do celu.",

				// Error feedback
				"tutorial.error.too-fast": "Za szybko! Spróbuj wykonać gest wolniej.",
				"tutorial.error.too-slow": "Za wolno! Spróbuj wykonać gest szybciej.",
				"tutorial.error.wrong-direction":
					"Zły kierunek! Sprawdź instrukcję jeszcze raz.",
				"tutorial.error.wrong-gesture":
					"Niewłaściwy gest! Upewnij się, że wykonujesz prawidłowy ruch.",

				// Hints
				"tutorial.hint.finger-placement":
					"Upewnij się, że palce są prawidłowo umieszczone na ekranie",
				"tutorial.hint.pressure":
					"Spróbuj delikatniejszego lub mocniejszego nacisku",
				"tutorial.hint.timing":
					"Zwróć uwagę na timing - nie za szybko, nie za wolno",
				"tutorial.hint.position":
					"Upewnij się, że gest wykonujesz we właściwym miejscu",

				// Progress feedback
				"tutorial.progress.step": "Krok {current} z {total}",
				"tutorial.progress.encouragement":
					"Świetnie Ci idzie! Jeszcze tylko kilka kroków.",
				"tutorial.progress.completion": "Gratulacje! Ukończyłeś tutorial!",

				// Gesture combinations
				"tutorial.combinations.sequence": "Wykonaj sekwencję: {gestures}",
				"tutorial.combinations.simultaneous": "Wykonaj gesty jednocześnie",
				"tutorial.combinations.timed": "Wykonaj gesty w ciągu {seconds} sekund",

				// Accessibility
				"accessibility.voice-guide": "Włączony przewodnik głosowy",
				"accessibility.visual-guide": "Włączone wskazówki wizualne",
				"accessibility.haptic-feedback": "Włączona informacja zwrotna dotykowa",
				"accessibility.simplified-gestures": "Włączone uproszczone gesty",

				// Cultural adaptation
				"cultural.right-handed": "Zoptymalizowano dla osób praworęcznych",
				"cultural.left-handed": "Zoptymalizowano dla osób leworęcznych",
				"cultural.touch-preferences":
					"Dostosowano do polskich preferencji dotykowych",

				// Error handling
				"error.gesture-not-recognized":
					"Gest nie został rozpoznany. Spróbuj ponownie.",
				"error.gesture-timeout":
					"Czas na wykonanie gestu minął. Spróbuj jeszcze raz.",
				"error.unsupported-gesture":
					"Ten gest nie jest obsługiwany na tym urządzeniu.",

				// Performance feedback
				"performance.too-many-gestures":
					"Za dużo gestów jednocześnie. Zwolnij tempo.",
				"performance.gesture-conflict":
					"Konflikt gestów. Użyj tylko jednego typu gestu naraz.",
				"performance.low-accuracy":
					"Niska dokładność gestu. Spróbuj wykonać ruch pewniej.",

				// Contextual help
				"help.contextual.gesture":
					"Aby uzyskać pomoc, przytrzymaj palec przez 3 sekundy",
				"help.contextual.tutorial":
					"Dotknij ikony pomocy, aby uruchomić tutorial",
				"help.contextual.settings":
					"Przesuń trzema palcami, aby otworzyć ustawienia",

				// Voice guidance (for future implementation)
				"voice.welcome":
					"Witaj w interaktywnym mózgu 3D. Jestem Twoim przewodnikiem.",
				"voice.instruction": "Teraz {instruction}. Spróbuj wykonać ten gest.",
				"voice.success": "Doskonale! {gesture} wykonany prawidłowo.",
				"voice.encouragement":
					"Nie przejmuj się, jeśli nie wychodzi od razu. Ćwicz dalej!",

				// Gamification
				"gamification.points-earned": "Zdobyłeś {points} punktów!",
				"gamification.badge-earned": "Odblokowałeś odznakę: {badge}!",
				"gamification.level-up": "Awansowałeś na poziom {level}!",
				"gamification.streak": "Seria zwycięstw: {streak} dni!",

				// Social features
				"social.share-progress": "Podziel się swoim postępem z innymi",
				"social.compare-scores": "Porównaj swoje wyniki z innymi użytkownikami",
				"social.leaderboard": "Zobacz tabelę liderów",

				// Advanced features
				"advanced.custom-gestures": "Utwórz własne gesty w ustawieniach",
				"advanced.gesture-macros":
					"Nagrywaj makra gestów dla złożonych operacji",
				"advanced.adaptive-sensitivity":
					"Czułość gestów dostosowuje się do Twojego stylu",

				// Brain-specific terminology
				"brain.regions.frontend":
					"Kora czołowa - odpowiada za funkcje wykonawcze",
				"brain.regions.hippocampus":
					"Hipokamp - kluczowy dla pamięci i uczenia się",
				"brain.regions.amygdala":
					"Ciało migdałowate - przetwarza emocje i strach",
				"brain.regions.cerebellum": "Móżdżek - koordynuje ruchy i równowagę",

				// Neurotransmitter information
				"neurotransmitters.dopamine":
					"Dopamina - neuroprzekaźnik motywacji i nagrody",
				"neurotransmitters.serotonin": "Serotonina - reguluje nastrój i apetyt",
				"neurotransmitters.acetylcholine":
					"Acetylocholina - kluczowa dla pamięci i uwagi",

				// Supplement integration
				"supplements.effects": "Efekty suplementów na {region}",
				"supplements.recommendations": "Zalecane suplementy dla tego regionu",
				"supplements.interactions":
					"Interakcje suplementów z neuroprzekaźnikami",

				// Medical/educational context
				"medical.disclaimer":
					"Informacje edukacyjne, nie zastępują porady lekarskiej",
				"medical.professional":
					"Skonsultuj się z lekarzem przed zmianą suplementacji",
				"medical.research": "Oparte na aktualnych badaniach naukowych",

				// Technical instructions
				"technical.calibration":
					"Kalibruj gesty w ustawieniach dla lepszej dokładności",
				"technical.sensitivity":
					"Dostosuj czułość gestów do swoich preferencji",
				"technical.platform":
					"Gestykulacja zoptymalizowana dla Twojego urządzenia",

				// Error recovery
				"recovery.gesture-failed":
					"Jeśli gest nie działa, spróbuj ponownie lub zmień ustawienia",
				"recovery.slow-performance":
					"Jeśli aplikacja działa wolno, zmniejsz jakość grafiki",
				"recovery.touch-issues":
					"Jeśli dotyk nie reaguje, sprawdź ustawienia urządzenia",

				// Completion and progression
				"completion.tutorial-finished":
					"Ukończyłeś tutorial! Możesz teraz swobodnie eksplorować mózg.",
				"completion.all-tutorials":
					"Gratulacje! Ukończyłeś wszystkie tutoriale.",
				"completion.next-steps":
					"Następne kroki: eksploruj samodzielnie lub spróbuj zaawansowanych technik",

				// Motivation and engagement
				"motivation.keep-learning":
					"Kontynuuj naukę, aby odkryć wszystkie tajemnice mózgu!",
				"motivation.practice-makes-perfect":
					"Ćwiczenie czyni mistrza - regularnie używaj gestów",
				"motivation.explore-freely":
					"Teraz możesz swobodnie eksplorować wszystkie funkcje",
			},

			feedback: {
				success: [
					"Świetnie! Gest wykonany prawidłowo.",
					"Doskonale! Opanowałeś ten gest.",
					"Niesamowite! Świetna precyzja.",
					"Gratulacje! To było idealne wykonanie.",
					"Wspaniale! Jesteś naturalnym talentem.",
				],
				error: [
					"Spróbuj jeszcze raz. Ćwiczenie czyni mistrza!",
					"Prawie się udało! Jeszcze jedna próba.",
					"Nie przejmuj się. Każdy zaczyna od początku.",
					"Sprawdź instrukcję i spróbuj ponownie.",
					"To wymaga trochę praktyki. Nie poddawaj się!",
				],
				hints: [
					"Upewnij się, że palce są prawidłowo umieszczone",
					"Spróbuj delikatniejszego nacisku",
					"Zwróć uwagę na timing gestu",
					"Ćwicz w spokojnym miejscu bez zakłóceń",
					"Jeśli nie wychodzi, dostosuj ustawienia czułości",
				],
			},

			tutorials: {
				"basic-navigation": "Podstawowa nawigacja 3D",
				"advanced-manipulation": "Zaawansowana manipulacja modelem",
				"expert-techniques": "Techniki eksperckie",
				"dissection-tutorial": "Tutorial sekcji mózgu",
				"neuroanatomy-basics": "Podstawy neuroanatomii",
				"supplement-integration": "Integracja z suplementami",
				"research-methods": "Metody badawcze",
				"clinical-applications": "Zastosowania kliniczne",
			},
		};
	}

	/**
	 * Set language preference
	 */
	setLanguage(language: "pl" | "en"): void {
		this.currentLanguage = language;
	}

	/**
	 * Get localized string with parameter substitution
	 */
	getLocalizedString(key: string, params?: Record<string, string>): string {
		let text = this.getNestedValue(this.labels, key) || key;

		// Substitute parameters
		if (params) {
			Object.entries(params).forEach(([param, value]) => {
				text = text.replace(new RegExp(`\\{${param}\\}`, "g"), value);
			});
		}

		return text;
	}

	/**
	 * Get nested object value by dot notation
	 */
	private getNestedValue(obj: any, path: string): string | null {
		return (
			path.split(".").reduce((current, key) => current?.[key], obj) || null
		);
	}

	/**
	 * Get gesture-specific instruction
	 */
	getGestureInstruction(gestureType: GestureType, context?: string): string {
		const contextKey = context
			? `gestures.${gestureType}.${context}`
			: `gestures.${gestureType}.basic`;
		return this.getLocalizedString(contextKey);
	}

	/**
	 * Get tutorial instruction
	 */
	getTutorialInstruction(tutorialId: string, step?: number): string {
		const stepKey =
			step !== undefined ? `tutorial.step-${step}` : "tutorial.welcome";
		return (
			this.getLocalizedString(`tutorial.${tutorialId}.${stepKey}`) ||
			this.getLocalizedString(stepKey)
		);
	}

	/**
	 * Get contextual feedback based on performance
	 */
	getContextualFeedback(
		type: "success" | "error" | "hint",
		customMessage?: string,
	): string {
		if (customMessage) return customMessage;

		const messages = this.labels.feedback[type];
		return messages[Math.floor(Math.random() * messages.length)];
	}

	/**
	 * Get culturally adapted instruction
	 */
	getCulturallyAdaptedInstruction(
		gestureType: GestureType,
		userPreference?: "right-handed" | "left-handed",
	): string {
		const baseInstruction = this.getGestureInstruction(gestureType, "basic");

		if (userPreference === "left-handed") {
			return `${baseInstruction} (dostosowano dla osób leworęcznych)`;
		}

		return baseInstruction;
	}

	/**
	 * Get accessibility-enhanced instruction
	 */
	getAccessibilityInstruction(
		gestureType: GestureType,
		accessibilityFeatures?: string[],
	): string {
		let instruction = this.getGestureInstruction(gestureType, "basic");

		if (accessibilityFeatures?.includes("voice-guide")) {
			instruction += ` ${this.getLocalizedString("accessibility.voice-guide")}`;
		}

		if (accessibilityFeatures?.includes("visual-guide")) {
			instruction += ` ${this.getLocalizedString("accessibility.visual-guide")}`;
		}

		return instruction;
	}

	/**
	 * Get brain region specific instruction
	 */
	getBrainRegionInstruction(regionName: string, action: string): string {
		const key = `brain.regions.${regionName.toLowerCase()}`;
		const regionInfo = this.getLocalizedString(key);

		if (regionInfo && regionInfo !== key) {
			return `${action}: ${regionInfo}`;
		}

		return `${action} na ${regionName}`;
	}

	/**
	 * Get supplement-related instruction
	 */
	getSupplementInstruction(supplementName: string, effect: string): string {
		return this.getLocalizedString("supplements.effects", {
			region: supplementName,
			effect: effect,
		});
	}

	/**
	 * Get motivational message based on progress
	 */
	getMotivationalMessage(progress: number, streak?: number): string {
		if (progress >= 0.9) {
			return this.getLocalizedString("motivation.explore-freely");
		}
		if (progress >= 0.7) {
			return this.getLocalizedString("motivation.keep-learning");
		}
		if (streak && streak > 3) {
			return this.getLocalizedString("motivation.streak", {
				streak: streak.toString(),
			});
		}
		return this.getLocalizedString("motivation.practice-makes-perfect");
	}

	/**
	 * Get error message with recovery suggestion
	 */
	getErrorMessageWithRecovery(errorType: string): string {
		const baseMessage = this.getLocalizedString(`error.${errorType}`);
		const recoveryKey = `recovery.${errorType}`;

		const recoveryMessage = this.getLocalizedString(recoveryKey);

		if (recoveryMessage && recoveryMessage !== recoveryKey) {
			return `${baseMessage} ${recoveryMessage}`;
		}

		return baseMessage;
	}

	/**
	 * Get performance feedback
	 */
	getPerformanceFeedback(accuracy: number, speed: number): string {
		if (accuracy < 0.5) {
			return this.getLocalizedString("performance.low-accuracy");
		}
		if (speed > 2.0) {
			return this.getLocalizedString("performance.too-many-gestures");
		}
		if (accuracy > 0.8 && speed < 1.5) {
			return this.getContextualFeedback("success");
		}
		return this.getContextualFeedback("hint");
	}

	/**
	 * Get gamification message
	 */
	getGamificationMessage(
		type: "points" | "badge" | "level",
		value: string | number,
	): string {
		return this.getLocalizedString(`gamification.${type}-earned`, {
			[type]: value.toString(),
		});
	}

	/**
	 * Get completion message
	 */
	getCompletionMessage(tutorialName: string, score?: number): string {
		const baseMessage = this.getLocalizedString("completion.tutorial-finished");

		if (score && score > 0.8) {
			return `${baseMessage} ${this.getLocalizedString("tutorial.success.expert")}`;
		}

		return baseMessage;
	}

	/**
	 * Get next steps suggestion
	 */
	getNextStepsSuggestion(
		completedTutorials: string[],
		allTutorials: string[],
	): string {
		const remaining = allTutorials.filter(
			(t) => !completedTutorials.includes(t),
		);

		if (remaining.length === 0) {
			return this.getLocalizedString("completion.all-tutorials");
		}
		if (remaining.length === 1) {
			return `Następny krok: ${this.getLocalizedString(`tutorials.${remaining[0]}`)}`;
		}
		return this.getLocalizedString("completion.next-steps");
	}

	/**
	 * Get contextual help based on user behavior
	 */
	getContextualHelp(gestureCount: number, errorCount: number): string {
		if (errorCount > 5) {
			return this.getLocalizedString("help.contextual.gesture");
		}
		if (gestureCount < 3) {
			return this.getLocalizedString("help.contextual.tutorial");
		}
		return this.getLocalizedString("help.contextual.settings");
	}

	/**
	 * Get voice guidance text (for future text-to-speech integration)
	 */
	getVoiceGuidance(gestureType: GestureType, context?: string): string {
		const instruction = this.getGestureInstruction(gestureType, context);
		return this.getLocalizedString("voice.instruction", {
			instruction: instruction,
		});
	}

	/**
	 * Get technical instruction
	 */
	getTechnicalInstruction(feature: string): string {
		return this.getLocalizedString(`technical.${feature}`);
	}

	/**
	 * Get medical disclaimer
	 */
	getMedicalDisclaimer(): string {
		return this.getLocalizedString("medical.disclaimer");
	}

	/**
	 * Format progress text
	 */
	formatProgressText(current: number, total: number): string {
		return this.getLocalizedString("tutorial.progress.step", {
			current: current.toString(),
			total: total.toString(),
		});
	}

	/**
	 * Get encouragement message based on attempt count
	 */
	getEncouragementMessage(attemptCount: number): string {
		if (attemptCount === 1) {
			return this.getContextualFeedback("error");
		}
		if (attemptCount < 4) {
			return this.getLocalizedString("tutorial.encouragement.try-again");
		}
		return this.getLocalizedString("tutorial.encouragement.keep-going");
	}

	/**
	 * Get gesture combination instruction
	 */
	getGestureCombinationInstruction(gestures: GestureType[]): string {
		const gestureNames = gestures
			.map((g) => this.getLocalizedString(`gestures.${g}`))
			.join(" → ");
		return this.getLocalizedString("tutorial.combinations.sequence", {
			gestures: gestureNames,
		});
	}

	/**
	 * Export labels for external use
	 */
	exportLabels(): PolishGestureLabels {
		return JSON.parse(JSON.stringify(this.labels));
	}

	/**
	 * Import custom labels (for extensibility)
	 */
	importCustomLabels(customLabels: Partial<PolishGestureLabels>): void {
		this.labels = this.deepMerge(this.labels, customLabels);
	}

	/**
	 * Deep merge utility
	 */
	private deepMerge(target: any, source: any): any {
		const result = { ...target };

		for (const key in source) {
			if (
				source[key] &&
				typeof source[key] === "object" &&
				!Array.isArray(source[key])
			) {
				result[key] = this.deepMerge(result[key] || {}, source[key]);
			} else {
				result[key] = source[key];
			}
		}

		return result;
	}
}
