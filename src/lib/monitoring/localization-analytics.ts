import { useAnalytics } from "./analytics";

// Localization event types
export interface LocalizationEvent {
	language: "pl" | "en" | "de" | "fr" | "es" | "other";
	region?: string;
	userAgent?: string;
	referrer?: string;
	timestamp: number;
	context:
		| "page_load"
		| "language_switch"
		| "content_interaction"
		| "search"
		| "error";
	metadata?: Record<string, any>;
}

// Medical terminology comprehension tracking
export interface MedicalTerminologyComprehension {
	term: string;
	language: "pl" | "en" | "la";
	action:
		| "search"
		| "view_definition"
		| "use_in_context"
		| "translate"
		| "bookmark";
	comprehensionLevel: "unknown" | "basic" | "intermediate" | "advanced";
	timeSpent: number;
	success: boolean;
	userFeedback?: "helpful" | "confusing" | "inaccurate" | "too_technical";
}

// Cultural adaptation metrics
export interface CulturalAdaptationMetrics {
	contentId: string;
	contentType: "medical" | "educational" | "ui" | "navigation";
	adaptationElements: {
		polishMedicalTerms: boolean;
		culturalReferences: boolean;
		localRegulations: boolean;
		regionalPricing: boolean;
		localMedicalStandards: boolean;
	};
	effectiveness: {
		engagementTime: number;
		completionRate: number;
		userSatisfaction: number;
		errorRate: number;
	};
}

// Regional usage patterns
export interface RegionalUsagePattern {
	region: string;
	language: string;
	timezone: string;
	peakHours: number[];
	popularContent: string[];
	deviceTypes: Record<string, number>;
	sessionDuration: number;
	featureUsage: Record<string, number>;
}

export class LocalizationAnalytics {
	private localizationEvents: LocalizationEvent[] = [];
	private terminologyComprehension: MedicalTerminologyComprehension[] = [];
	private culturalAdaptationData: CulturalAdaptationMetrics[] = [];
	private regionalPatterns: Map<string, RegionalUsagePattern> = new Map();

	constructor() {
		this.initializeLocalizationTracking();
	}

	private initializeLocalizationTracking(): void {
		if (typeof window === "undefined") return;

		// Track initial language and region
		this.trackLanguageDetection();

		// Track language switching
		this.trackLanguageSwitching();

		// Track regional patterns
		this.trackRegionalUsage();

		// Track medical terminology comprehension
		this.trackMedicalTerminologyUsage();
	}

	private trackLanguageDetection(): void {
		const language = this.detectUserLanguage();
		const region = this.detectUserRegion();

		this.trackLocalizationEvent({
			language,
			region,
			context: "page_load",
			timestamp: Date.now(),
			metadata: {
				userAgent: navigator.userAgent,
				referrer: document.referrer,
				initialLanguage: navigator.language,
				initialRegion: this.getTimezoneRegion(),
			},
		});
	}

	private trackLanguageSwitching(): void {
		// Listen for language switch events
		if (typeof window !== "undefined") {
			window.addEventListener("languagechange", () => {
				const newLanguage = this.detectUserLanguage();

				this.trackLocalizationEvent({
					language: newLanguage,
					context: "language_switch",
					timestamp: Date.now(),
					metadata: {
						previousLanguage: this.getCurrentLanguage(),
						trigger: "system_change",
					},
				});
			});

			// Track manual language switches via custom events
			document.addEventListener("languageSwitch", (event: any) => {
				this.trackLocalizationEvent({
					language: event.detail.newLanguage,
					context: "language_switch",
					timestamp: Date.now(),
					metadata: {
						previousLanguage: event.detail.previousLanguage,
						trigger: "manual_switch",
						switchSource: event.detail.source,
					},
				});
			});
		}
	}

	private trackRegionalUsage(): void {
		// Track usage patterns by region
		const region = this.detectUserRegion();
		const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

		if (!this.regionalPatterns.has(region)) {
			this.regionalPatterns.set(region, {
				region,
				language: this.detectUserLanguage(),
				timezone,
				peakHours: [],
				popularContent: [],
				deviceTypes: {},
				sessionDuration: 0,
				featureUsage: {},
			});
		}

		// Track session start
		const sessionStart = Date.now();

		// Track session end on page unload
		if (typeof window !== "undefined") {
			window.addEventListener("beforeunload", () => {
				const sessionDuration = Date.now() - sessionStart;
				this.updateRegionalPattern(region, {
					sessionDuration:
						(this.regionalPatterns.get(region)?.sessionDuration +
							sessionDuration) /
						2,
				});
			});
		}
	}

	private trackMedicalTerminologyUsage(): void {
		// Track searches and interactions with medical terms
		if (typeof document !== "undefined") {
			const searchInputs = document.querySelectorAll(
				'input[type="search"], .search-input',
			);

			searchInputs.forEach((input) => {
				input.addEventListener("input", (e) => {
					const target = e.target as HTMLInputElement;
					const query = target.value;

					if (query.length > 3) {
						this.analyzeAndTrackTerminology(query, "search");
					}
				});
			});

			// Track clicks on medical terms
			document.addEventListener("click", (e) => {
				const target = e.target as HTMLElement;
				if (
					target.classList.contains("medical-term") ||
					target.hasAttribute("data-medical-term")
				) {
					const term =
						target.textContent ||
						target.getAttribute("data-medical-term") ||
						"";
					this.trackMedicalTerminologyComprehension({
						term,
						language: this.detectTerminologyLanguage(term),
						action: "view_definition",
						comprehensionLevel: "unknown",
						timeSpent: 0,
						success: true,
					});
				}
			});
		}
	}

	private detectUserLanguage(): "pl" | "en" | "de" | "fr" | "es" | "other" {
		if (typeof navigator === "undefined") return "pl";

		const language = navigator.language.toLowerCase();

		if (language.startsWith("pl")) return "pl";
		if (language.startsWith("en")) return "en";
		if (language.startsWith("de")) return "de";
		if (language.startsWith("fr")) return "fr";
		if (language.startsWith("es")) return "es";

		return "other";
	}

	private detectUserRegion(): string {
		if (typeof navigator === "undefined") return "unknown";

		// Try to detect region from various sources
		const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
		const language = navigator.language;

		// Map timezone to region
		if (timezone.includes("Europe/Warsaw") || language.startsWith("pl"))
			return "poland";
		if (timezone.includes("Europe/Berlin") || language.startsWith("de"))
			return "germany";
		if (timezone.includes("Europe/Paris") || language.startsWith("fr"))
			return "france";
		if (timezone.includes("Europe/Madrid") || language.startsWith("es"))
			return "spain";
		if (timezone.includes("America/") || language.startsWith("en"))
			return "usa";

		return "unknown";
	}

	private getTimezoneRegion(): string {
		if (typeof Intl === "undefined") return "unknown";

		try {
			const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
			return timezone.split("/")[1] || "unknown";
		} catch {
			return "unknown";
		}
	}

	private getCurrentLanguage(): string {
		if (typeof document === "undefined") return "pl";

		const htmlElement = document.documentElement;
		return htmlElement.lang || "pl";
	}

	private detectTerminologyLanguage(term: string): "pl" | "en" | "la" {
		// Detect if term is in Polish, English, or Latin
		if (/[ąęćłńóśźż]/.test(term)) return "pl";
		if (/[a-z]/.test(term) && !/[ąęćłńóśźż]/.test(term)) return "en";
		return "la"; // Default to Latin for medical terms
	}

	private analyzeAndTrackTerminology(text: string, context: string): void {
		// Common Polish medical terms
		const polishMedicalTerms = [
			"neuroprzekaźnik",
			"synapsa",
			"neuroplastyczność",
			"nootropik",
			"cholina",
			"bacopa",
			"monnieri",
			"l-teanina",
			"rhodiola",
			"hipokamp",
			"kora mózgowa",
			"płat czołowy",
			"układ limbiczny",
		];

		// Common English medical terms
		const englishMedicalTerms = [
			"neurotransmitter",
			"synapse",
			"neuroplasticity",
			"nootropic",
			"choline",
			"bacopa",
			"monnieri",
			"l-theanine",
			"rhodiola",
			"hippocampus",
			"cerebral cortex",
			"frontal lobe",
			"limbic system",
		];

		const words = text.toLowerCase().split(/\s+/);

		words.forEach((word) => {
			if (polishMedicalTerms.includes(word)) {
				this.trackMedicalTerminologyComprehension({
					term: word,
					language: "pl",
					action: "search",
					comprehensionLevel: "intermediate",
					timeSpent: 0,
					success: true,
				});
			} else if (englishMedicalTerms.includes(word)) {
				this.trackMedicalTerminologyComprehension({
					term: word,
					language: "en",
					action: "search",
					comprehensionLevel: "intermediate",
					timeSpent: 0,
					success: true,
				});
			}
		});
	}

	private updateRegionalPattern(
		region: string,
		updates: Partial<RegionalUsagePattern>,
	): void {
		const current = this.regionalPatterns.get(region);
		if (current) {
			this.regionalPatterns.set(region, { ...current, ...updates });
		}
	}

	// Public methods for manual tracking
	public trackLocalizationEvent(event: LocalizationEvent): void {
		this.localizationEvents.push(event);

		// Keep only last 1000 events to prevent memory issues
		if (this.localizationEvents.length > 1000) {
			this.localizationEvents = this.localizationEvents.slice(-1000);
		}

		// Send to analytics
		useAnalytics().track("localization_event", {
			language: event.language,
			region: event.region,
			context: event.context,
			user_agent: event.userAgent,
			referrer: event.referrer,
			...event.metadata,
		});
	}

	public trackMedicalTerminologyComprehension(
		event: MedicalTerminologyComprehension,
	): void {
		this.terminologyComprehension.push(event);

		// Keep only last 500 events
		if (this.terminologyComprehension.length > 500) {
			this.terminologyComprehension = this.terminologyComprehension.slice(-500);
		}

		useAnalytics().track("medical_terminology_comprehension", {
			term: event.term,
			language: event.language,
			action: event.action,
			comprehension_level: event.comprehensionLevel,
			time_spent_seconds: Math.round(event.timeSpent / 1000),
			success: event.success,
			user_feedback: event.userFeedback,
		});
	}

	public trackCulturalAdaptation(event: CulturalAdaptationMetrics): void {
		this.culturalAdaptationData.push(event);

		useAnalytics().track("cultural_adaptation", {
			content_id: event.contentId,
			content_type: event.contentType,
			adaptation_elements: event.adaptationElements,
			effectiveness_engagement: event.effectiveness.engagementTime,
			effectiveness_completion: event.effectiveness.completionRate,
			effectiveness_satisfaction: event.effectiveness.userSatisfaction,
			effectiveness_error_rate: event.effectiveness.errorRate,
		});
	}

	// Get localization analytics summary
	public getLocalizationSummary(): {
		languageDistribution: Record<string, number>;
		regionalUsage: Record<string, number>;
		terminologyComprehension: {
			byLanguage: Record<
				string,
				{ total: number; successful: number; avgTimeSpent: number }
			>;
			mostSearchedTerms: Array<{
				term: string;
				count: number;
				language: string;
			}>;
		};
		culturalAdaptation: {
			averageEffectiveness: number;
			byContentType: Record<string, number>;
		};
	} {
		// Language distribution
		const languageDistribution = this.localizationEvents.reduce(
			(acc, event) => {
				acc[event.language] = (acc[event.language] || 0) + 1;
				return acc;
			},
			{} as Record<string, number>,
		);

		// Regional usage
		const regionalUsage = this.localizationEvents.reduce(
			(acc, event) => {
				const region = event.region || "unknown";
				acc[region] = (acc[region] || 0) + 1;
				return acc;
			},
			{} as Record<string, number>,
		);

		// Terminology comprehension by language
		const byLanguage = this.terminologyComprehension.reduce(
			(acc, event) => {
				if (!acc[event.language]) {
					acc[event.language] = { total: 0, successful: 0, avgTimeSpent: 0 };
				}

				acc[event.language].total++;
				if (event.success) {
					acc[event.language].successful++;
				}
				acc[event.language].avgTimeSpent += event.timeSpent;

				return acc;
			},
			{} as Record<
				string,
				{ total: number; successful: number; avgTimeSpent: number }
			>,
		);

		// Average time spent by language
		Object.keys(byLanguage).forEach((language) => {
			const data = byLanguage[language];
			data.avgTimeSpent = data.total > 0 ? data.avgTimeSpent / data.total : 0;
		});

		// Most searched terms
		const termCounts = this.terminologyComprehension.reduce(
			(acc, event) => {
				const key = `${event.term}_${event.language}`;
				acc[key] = (acc[key] || 0) + 1;
				return acc;
			},
			{} as Record<string, number>,
		);

		const mostSearchedTerms = Object.entries(termCounts)
			.map(([key, count]) => {
				const [term, language] = key.split("_");
				return { term, count, language };
			})
			.sort((a, b) => b.count - a.count)
			.slice(0, 10);

		// Cultural adaptation effectiveness
		const totalEffectiveness = this.culturalAdaptationData.reduce(
			(sum, data) => {
				return (
					sum +
					(data.effectiveness.engagementTime * 0.4 +
						data.effectiveness.completionRate * 0.6)
				);
			},
			0,
		);

		const averageEffectiveness =
			this.culturalAdaptationData.length > 0
				? totalEffectiveness / this.culturalAdaptationData.length
				: 0;

		const byContentType = this.culturalAdaptationData.reduce(
			(acc, data) => {
				acc[data.contentType] = (acc[data.contentType] || 0) + 1;
				return acc;
			},
			{} as Record<string, number>,
		);

		return {
			languageDistribution,
			regionalUsage,
			terminologyComprehension: {
				byLanguage,
				mostSearchedTerms,
			},
			culturalAdaptation: {
				averageEffectiveness,
				byContentType,
			},
		};
	}

	// Track content interaction in specific language
	public trackContentInteraction(
		contentId: string,
		language: string,
		interactionType: string,
		duration?: number,
	): void {
		this.trackLocalizationEvent({
			language: language as any,
			context: "content_interaction",
			timestamp: Date.now(),
			metadata: {
				contentId,
				interactionType,
				duration,
			},
		});
	}

	// Track search in specific language
	public trackSearchQuery(
		query: string,
		language: string,
		resultCount: number,
	): void {
		this.trackLocalizationEvent({
			language: language as any,
			context: "search",
			timestamp: Date.now(),
			metadata: {
				query,
				resultCount,
				queryLanguage: this.detectTerminologyLanguage(query),
			},
		});
	}
}

// React hook for localization analytics
export function useLocalizationAnalytics() {
	const trackLocalizationEvent = (event: LocalizationEvent) => {
		localizationAnalytics.trackLocalizationEvent(event);
	};

	const trackMedicalTerminologyComprehension = (
		event: MedicalTerminologyComprehension,
	) => {
		localizationAnalytics.trackMedicalTerminologyComprehension(event);
	};

	const trackCulturalAdaptation = (event: CulturalAdaptationMetrics) => {
		localizationAnalytics.trackCulturalAdaptation(event);
	};

	const trackContentInteraction = (
		contentId: string,
		language: string,
		interactionType: string,
		duration?: number,
	) => {
		localizationAnalytics.trackContentInteraction(
			contentId,
			language,
			interactionType,
			duration,
		);
	};

	const trackSearchQuery = (
		query: string,
		language: string,
		resultCount: number,
	) => {
		localizationAnalytics.trackSearchQuery(query, language, resultCount);
	};

	const getSummary = () => {
		return localizationAnalytics.getLocalizationSummary();
	};

	return {
		trackLocalizationEvent,
		trackMedicalTerminologyComprehension,
		trackCulturalAdaptation,
		trackContentInteraction,
		trackSearchQuery,
		getSummary,
	};
}

// Singleton instance
export const localizationAnalytics = new LocalizationAnalytics();
