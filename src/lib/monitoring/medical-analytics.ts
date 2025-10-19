import { AnalyticsUtils, useAnalytics } from "./analytics";

// Medical content interaction types
export interface MedicalContentInteraction {
	contentId: string;
	contentType:
		| "supplement"
		| "brain_region"
		| "research_paper"
		| "medical_term"
		| "educational_module";
	interactionType:
		| "view"
		| "search"
		| "bookmark"
		| "share"
		| "complete"
		| "quiz_attempt";
	duration?: number;
	metadata?: {
		searchQuery?: string;
		category?: string;
		difficulty?: "beginner" | "intermediate" | "advanced";
		language?: string;
		userRole?: "patient" | "student" | "professional";
	};
}

// Supplement-specific analytics
export interface SupplementAnalyticsEvent {
	supplementId: string;
	action:
		| "view_details"
		| "add_to_stack"
		| "compare"
		| "search_similar"
		| "read_research"
		| "check_interactions";
	stackContext?: {
		stackId: string;
		otherSupplements: string[];
		totalSupplements: number;
	};
	metadata?: Record<string, any>;
}

// Educational content effectiveness
export interface EducationalEffectivenessEvent {
	contentId: string;
	contentType: "tutorial" | "quiz" | "interactive_diagram" | "case_study";
	userEngagement: {
		timeSpent: number;
		interactions: number;
		completionRate: number;
		quizScore?: number;
		revisited: boolean;
	};
	learningOutcomes?: {
		knowledgeGain?: number;
		confidenceIncrease?: number;
		retentionScore?: number;
	};
}

// Medical terminology analytics
export interface MedicalTerminologyEvent {
	term: string;
	action:
		| "search"
		| "view_definition"
		| "use_in_context"
		| "bookmark"
		| "translate";
	context: "search" | "content" | "quiz" | "discussion";
	language: "pl" | "en" | "la";
	difficulty?: "basic" | "intermediate" | "advanced";
	metadata?: Record<string, any>;
}

// Evidence-based content tracking
export interface EvidenceBasedContentEvent {
	contentId: string;
	evidenceLevel:
		| "anecdotal"
		| "case_study"
		| "clinical_trial"
		| "meta_analysis"
		| "systematic_review";
	source:
		| "pubmed"
		| "clinical_trials"
		| "medical_journal"
		| "textbook"
		| "expert_opinion";
	citationCount?: number;
	publicationYear?: number;
	interactionType: "view" | "download" | "cite" | "verify";
}

export class MedicalContentAnalytics {
	private contentInteractions: Map<string, MedicalContentInteraction[]> =
		new Map();
	private supplementInteractions: Map<string, SupplementAnalyticsEvent[]> =
		new Map();
	private terminologyUsage: Map<string, MedicalTerminologyEvent[]> = new Map();

	constructor() {
		this.initializeMedicalTracking();
	}

	private initializeMedicalTracking(): void {
		// Track medical content views and interactions
		if (typeof document !== "undefined") {
			// Track time spent on medical content
			this.trackContentEngagement();

			// Track medical terminology usage
			this.trackMedicalTerminology();

			// Track evidence-based content interactions
			this.trackEvidenceBasedContent();
		}
	}

	private trackContentEngagement(): void {
		// Track when users spend significant time on medical content
		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				mutation.addedNodes.forEach((node) => {
					if (node.nodeType === Node.ELEMENT_NODE) {
						const element = node as Element;
						if (
							element.matches?.(
								".medical-content, .supplement-info, .brain-region-info",
							)
						) {
							this.startContentTracking(element);
						}
					}
				});
			});
		});

		observer.observe(document.body, { childList: true, subtree: true });
	}

	private startContentTracking(element: Element): void {
		const contentId = element.getAttribute("data-content-id") || element.id;
		const contentType = element.getAttribute("data-content-type") as any;

		if (!contentId || !contentType) return;

		const startTime = Date.now();
		const observer = new MutationObserver(() => {
			// Content is still visible, continue tracking
		});

		observer.observe(element, { attributes: true, attributeFilter: ["style"] });

		// Track when content becomes hidden or removed
		const visibilityObserver = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (
					mutation.type === "attributes" &&
					mutation.attributeName === "style"
				) {
					const target = mutation.target as HTMLElement;
					if (
						target.style.display === "none" ||
						target.style.visibility === "hidden"
					) {
						this.endContentTracking(
							contentId,
							contentType,
							Date.now() - startTime,
						);
						visibilityObserver.disconnect();
						observer.disconnect();
					}
				}
			});
		});

		visibilityObserver.observe(element, {
			attributes: true,
			attributeFilter: ["style"],
		});
	}

	private endContentTracking(
		contentId: string,
		contentType: string,
		duration: number,
	): void {
		if (duration > 5000) {
			// Only track if user spent more than 5 seconds
			AnalyticsUtils.trackMedicalInteraction({
				contentType,
				contentId,
				action: "view",
				duration,
				metadata: {
					engagement_level:
						duration > 60000 ? "high" : duration > 15000 ? "medium" : "low",
				},
			});
		}
	}

	private trackMedicalTerminology(): void {
		// Track searches for medical terms
		if (typeof window !== "undefined") {
			const searchInputs = document.querySelectorAll(
				'input[type="search"], .search-input',
			);

			searchInputs.forEach((input) => {
				input.addEventListener("input", (e) => {
					const target = e.target as HTMLInputElement;
					const query = target.value;

					if (query.length > 3) {
						this.analyzeMedicalTerminology(query, "search");
					}
				});
			});
		}
	}

	private analyzeMedicalTerminology(text: string, context: string): void {
		// Common medical terms in Polish and English
		const medicalTerms = {
			// Neurological terms
			neuroprzekaźnik: { category: "neurology", difficulty: "intermediate" },
			neurotransmitter: { category: "neurology", difficulty: "intermediate" },
			synapsa: { category: "neurology", difficulty: "advanced" },
			synapse: { category: "neurology", difficulty: "advanced" },
			neuroplastyczność: { category: "neurology", difficulty: "advanced" },
			neuroplasticity: { category: "neurology", difficulty: "advanced" },

			// Supplement terms
			nootropik: { category: "supplements", difficulty: "intermediate" },
			nootropic: { category: "supplements", difficulty: "intermediate" },
			cholina: { category: "supplements", difficulty: "intermediate" },
			choline: { category: "supplements", difficulty: "intermediate" },
			bacopa: { category: "supplements", difficulty: "intermediate" },
			monnieri: { category: "supplements", difficulty: "intermediate" },

			// Brain regions (Polish)
			"płat czołowy": { category: "brain_anatomy", difficulty: "basic" },
			"frontal lobe": { category: "brain_anatomy", difficulty: "basic" },
			hipokamp: { category: "brain_anatomy", difficulty: "intermediate" },
			hippocampus: { category: "brain_anatomy", difficulty: "intermediate" },
			"kora mózgowa": { category: "brain_anatomy", difficulty: "intermediate" },
			"cerebral cortex": {
				category: "brain_anatomy",
				difficulty: "intermediate",
			},
		};

		const words = text.toLowerCase().split(/\s+/);

		words.forEach((word) => {
			if (medicalTerms[word]) {
				this.trackMedicalTerminology({
					term: word,
					action: "search",
					context: context as any,
					language: this.detectLanguage(word),
					difficulty: medicalTerms[word].difficulty as any,
					metadata: {
						category: medicalTerms[word].category,
						full_query: text,
					},
				});
			}
		});
	}

	private detectLanguage(term: string): "pl" | "en" | "la" {
		// Simple language detection based on characters
		if (/[ąęćłńóśźż]/.test(term)) return "pl";
		if (/[a-z]/.test(term) && !/[ąęćłńóśźż]/.test(term)) return "en";
		return "la"; // Default to Latin for medical terms
	}

	private trackEvidenceBasedContent(): void {
		// Track interactions with research-backed content
		if (typeof document !== "undefined") {
			const evidenceElements = document.querySelectorAll(
				"[data-evidence-level]",
			);

			evidenceElements.forEach((element) => {
				element.addEventListener("click", (e) => {
					const target = e.target as HTMLElement;
					const contentId = target.getAttribute("data-content-id") || target.id;
					const evidenceLevel = target.getAttribute(
						"data-evidence-level",
					) as any;
					const source = target.getAttribute("data-source") as any;

					if (contentId && evidenceLevel) {
						this.trackEvidenceBasedContent({
							contentId,
							evidenceLevel,
							source,
							interactionType: "view",
						});
					}
				});
			});
		}
	}

	// Public methods for manual tracking
	public trackMedicalContentInteraction(
		interaction: MedicalContentInteraction,
	): void {
		AnalyticsUtils.trackMedicalInteraction(interaction);

		// Store for pattern analysis
		const key = `${interaction.contentType}_${interaction.contentId}`;
		if (!this.contentInteractions.has(key)) {
			this.contentInteractions.set(key, []);
		}

		this.contentInteractions.get(key)?.push(interaction);

		// Analyze patterns for content effectiveness
		this.analyzeContentEffectiveness(key);
	}

	public trackSupplementAnalytics(event: SupplementAnalyticsEvent): void {
		AnalyticsUtils.trackSupplementInteraction(
			event.action,
			event.supplementId,
			event.stackContext?.stackId,
		);

		const key = event.supplementId;
		if (!this.supplementInteractions.has(key)) {
			this.supplementInteractions.set(key, []);
		}

		this.supplementInteractions.get(key)?.push(event);

		// Analyze supplement usage patterns
		this.analyzeSupplementPatterns(key);
	}

	public trackMedicalTerminology(event: MedicalTerminologyEvent): void {
		AnalyticsUtils.track("medical_terminology", {
			term: event.term,
			action: event.action,
			context: event.context,
			language: event.language,
			difficulty: event.difficulty,
			...event.metadata,
		});

		const key = `${event.term}_${event.language}`;
		if (!this.terminologyUsage.has(key)) {
			this.terminologyUsage.set(key, []);
		}

		this.terminologyUsage.get(key)?.push(event);
	}

	public trackEvidenceBasedContent(event: EvidenceBasedContentEvent): void {
		AnalyticsUtils.track("evidence_based_content", {
			content_id: event.contentId,
			evidence_level: event.evidenceLevel,
			source: event.source,
			citation_count: event.citationCount,
			publication_year: event.publicationYear,
			interaction_type: event.interactionType,
		});
	}

	private analyzeContentEffectiveness(contentKey: string): void {
		const interactions = this.contentInteractions.get(contentKey) || [];

		if (interactions.length >= 5) {
			// Analyze after 5+ interactions
			const avgDuration =
				interactions.reduce((sum, i) => sum + (i.duration || 0), 0) /
				interactions.length;
			const completionRate =
				interactions.filter((i) => i.interactionType === "complete").length /
				interactions.length;

			AnalyticsUtils.track("content_effectiveness", {
				content_key: contentKey,
				interaction_count: interactions.length,
				average_duration_seconds: Math.round(avgDuration / 1000),
				completion_rate: Math.round(completionRate * 100),
				effectiveness_score: this.calculateEffectivenessScore(
					avgDuration,
					completionRate,
				),
			});
		}
	}

	private analyzeSupplementPatterns(supplementId: string): void {
		const interactions = this.supplementInteractions.get(supplementId) || [];

		if (interactions.length >= 3) {
			const actions = interactions.map((i) => i.action);
			const uniqueActions = [...new Set(actions)];

			AnalyticsUtils.track("supplement_usage_patterns", {
				supplement_id: supplementId,
				interaction_count: interactions.length,
				unique_actions: uniqueActions.length,
				most_common_action: this.getMostCommonAction(actions),
				stack_contexts: interactions.filter((i) => i.stackContext).length,
			});
		}
	}

	private calculateEffectivenessScore(
		avgDuration: number,
		completionRate: number,
	): number {
		// Simple scoring algorithm: combine duration and completion rate
		const durationScore = Math.min(avgDuration / 60000, 1) * 50; // Max 1 minute = 50 points
		const completionScore = completionRate * 50; // Completion rate = 50 points max

		return Math.round(durationScore + completionScore);
	}

	private getMostCommonAction(actions: string[]): string {
		const counts = actions.reduce(
			(acc, action) => {
				acc[action] = (acc[action] || 0) + 1;
				return acc;
			},
			{} as Record<string, number>,
		);

		return Object.entries(counts).sort(([, a], [, b]) => b - a)[0][0];
	}

	// Get analytics summary for medical content
	public getMedicalAnalyticsSummary(): {
		contentInteractions: Record<string, number>;
		supplementInteractions: Record<string, number>;
		terminologyUsage: Record<string, number>;
		topMedicalTerms: Array<{ term: string; count: number }>;
		contentEffectiveness: Array<{ contentId: string; score: number }>;
	} {
		const contentInteractions = Object.fromEntries(
			Array.from(this.contentInteractions.entries()).map(
				([key, interactions]) => [key, interactions.length],
			),
		);

		const supplementInteractions = Object.fromEntries(
			Array.from(this.supplementInteractions.entries()).map(
				([key, interactions]) => [key, interactions.length],
			),
		);

		const terminologyUsage = Object.fromEntries(
			Array.from(this.terminologyUsage.entries()).map(([key, interactions]) => [
				key,
				interactions.length,
			]),
		);

		const topMedicalTerms = Array.from(this.terminologyUsage.entries())
			.map(([term, interactions]) => ({ term, count: interactions.length }))
			.sort((a, b) => b.count - a.count)
			.slice(0, 10);

		const contentEffectiveness = Array.from(this.contentInteractions.entries())
			.map(([contentKey, interactions]) => {
				const avgDuration =
					interactions.reduce((sum, i) => sum + (i.duration || 0), 0) /
					interactions.length;
				const completionRate =
					interactions.filter((i) => i.interactionType === "complete").length /
					interactions.length;
				return {
					contentId: contentKey,
					score: this.calculateEffectivenessScore(avgDuration, completionRate),
				};
			})
			.sort((a, b) => b.score - a.score);

		return {
			contentInteractions,
			supplementInteractions,
			terminologyUsage,
			topMedicalTerms,
			contentEffectiveness,
		};
	}
}

// React hook for medical content analytics
export function useMedicalAnalytics() {
	const trackMedicalContentInteraction = (
		interaction: MedicalContentInteraction,
	) => {
		medicalAnalytics.trackMedicalContentInteraction(interaction);
	};

	const trackSupplementAnalytics = (event: SupplementAnalyticsEvent) => {
		medicalAnalytics.trackSupplementAnalytics(event);
	};

	const trackMedicalTerminology = (event: MedicalTerminologyEvent) => {
		medicalAnalytics.trackMedicalTerminology(event);
	};

	const trackEvidenceBasedContent = (event: EvidenceBasedContentEvent) => {
		medicalAnalytics.trackEvidenceBasedContent(event);
	};

	const getSummary = () => {
		return medicalAnalytics.getMedicalAnalyticsSummary();
	};

	return {
		trackMedicalContentInteraction,
		trackSupplementAnalytics,
		trackMedicalTerminology,
		trackEvidenceBasedContent,
		getSummary,
	};
}

// Singleton instance
export const medicalAnalytics = new MedicalContentAnalytics();
