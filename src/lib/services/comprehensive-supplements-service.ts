/**
 * Comprehensive Supplements Service
 * Manages the enhanced supplements database with educational content and evidence-based information
 */

import {
	type ComprehensiveSupplementProfile,
	comprehensiveSupplementsDatabase,
} from "@/data/comprehensive-supplements";
import type { EvidenceLevel, SupplementCategory } from "@/types/supplement";

export interface SupplementSearchFilters {
	category?: SupplementCategory[];
	evidenceLevel?: EvidenceLevel[];
	searchTerm?: string;
	minEffectiveness?: number;
	maxCostPerMonth?: number;
	safetyProfile?: {
		pregnancySafe?: boolean;
		breastfeedingSafe?: boolean;
		pediatricApproved?: boolean;
	};
	mechanisms?: string[];
	conditions?: string[];
	difficultyLevel?: "beginner" | "intermediate" | "expert";
}

export interface SupplementRecommendation {
	supplement: ComprehensiveSupplementProfile;
	relevanceScore: number;
	reasoning: string;
	polishReasoning: string;
	warnings: string[];
	polishWarnings: string[];
	synergies: string[];
	polishSynergies: string[];
}

export interface InteractionAnalysis {
	supplementA: string;
	supplementB: string;
	interactionType:
		| "SYNERGISTIC"
		| "ANTAGONISTIC"
		| "NEUTRAL"
		| "CAUTION"
		| "CONTRAINDICATED";
	severity: "LOW" | "MODERATE" | "HIGH" | "SEVERE";
	mechanism: string;
	polishMechanism: string;
	clinicalSignificance: string;
	polishClinicalSignificance: string;
	recommendation: string;
	polishRecommendation: string;
	evidenceLevel: EvidenceLevel;
}

export class ComprehensiveSupplementsService {
	private supplements: ComprehensiveSupplementProfile[];
	private searchIndex: Map<string, Set<string>>;

	constructor() {
		this.supplements = comprehensiveSupplementsDatabase;
		this.searchIndex = new Map();
		this.buildSearchIndex();
	}

	/**
	 * Build search index for fast text searching
	 */
	private buildSearchIndex(): void {
		this.supplements.forEach((supplement) => {
			const searchTerms = new Set<string>();

			// Add names and descriptions
			searchTerms.add(supplement.name.toLowerCase());
			searchTerms.add(supplement.polishName.toLowerCase());
			searchTerms.add(supplement.description?.toLowerCase() || "");
			searchTerms.add(supplement.polishDescription?.toLowerCase() || "");

			// Add common names
			supplement.commonNames.forEach((name) =>
				searchTerms.add(name.toLowerCase()),
			);
			supplement.polishCommonNames.forEach((name) =>
				searchTerms.add(name.toLowerCase()),
			);

			// Add active compounds
			supplement.activeCompounds.forEach((compound) => {
				searchTerms.add(compound.name.toLowerCase());
				searchTerms.add(compound.polishName?.toLowerCase() || "");
			});

			// Add clinical applications
			supplement.clinicalApplications.forEach((app) => {
				searchTerms.add(app.condition.toLowerCase());
				searchTerms.add(app.polishCondition.toLowerCase());
			});

			// Add mechanisms
			supplement.mechanisms.forEach((mechanism) => {
				searchTerms.add(mechanism.pathway.toLowerCase());
				searchTerms.add(mechanism.polishPathway?.toLowerCase() || "");
			});

			// Add tags
			supplement.tags.forEach((tag) => searchTerms.add(tag.toLowerCase()));

			this.searchIndex.set(supplement.id, searchTerms);
		});
	}

	/**
	 * Search supplements with comprehensive filtering
	 */
	searchSupplements(
		filters: SupplementSearchFilters,
	): ComprehensiveSupplementProfile[] {
		let results = [...this.supplements];

		// Filter by category
		if (filters.category && filters.category.length > 0) {
			results = results.filter((supplement) =>
				filters.category?.includes(supplement.category),
			);
		}

		// Filter by evidence level
		if (filters.evidenceLevel && filters.evidenceLevel.length > 0) {
			results = results.filter((supplement) =>
				filters.evidenceLevel?.includes(supplement.evidenceLevel),
			);
		}

		// Text search
		if (filters.searchTerm) {
			const searchTerm = filters.searchTerm.toLowerCase();
			results = results.filter((supplement) => {
				const terms = this.searchIndex.get(supplement.id) || new Set();
				return Array.from(terms).some((term) => term.includes(searchTerm));
			});
		}

		// Filter by effectiveness
		if (filters.minEffectiveness !== undefined) {
			results = results.filter((supplement) => {
				const avgEffectiveness =
					supplement.clinicalApplications.reduce(
						(sum, app) => sum + (app.effectivenessRating || 0),
						0,
					) / supplement.clinicalApplications.length;
				return avgEffectiveness >= filters.minEffectiveness!;
			});
		}

		// Filter by cost
		if (filters.maxCostPerMonth !== undefined) {
			results = results.filter(
				(supplement) =>
					supplement.economicData.averageCostPerMonth.average <=
					filters.maxCostPerMonth!,
			);
		}

		// Filter by safety profile
		if (filters.safetyProfile) {
			if (filters.safetyProfile.pregnancySafe) {
				results = results.filter((supplement) =>
					["A", "B"].includes(supplement.safetyProfile.pregnancyCategory),
				);
			}

			if (filters.safetyProfile.breastfeedingSafe) {
				results = results.filter(
					(supplement) =>
						supplement.safetyProfile.breastfeedingSafety === "Safe",
				);
			}

			if (filters.safetyProfile.pediatricApproved) {
				results = results.filter(
					(supplement) => supplement.safetyProfile.pediatricUse.approved,
				);
			}
		}

		// Filter by mechanisms
		if (filters.mechanisms && filters.mechanisms.length > 0) {
			results = results.filter((supplement) =>
				supplement.mechanisms.some((mechanism) =>
					filters.mechanisms?.some(
						(filterMech) =>
							mechanism.pathway
								.toLowerCase()
								.includes(filterMech.toLowerCase()) ||
							mechanism.polishPathway
								.toLowerCase()
								.includes(filterMech.toLowerCase()),
					),
				),
			);
		}

		// Filter by conditions
		if (filters.conditions && filters.conditions.length > 0) {
			results = results.filter((supplement) =>
				supplement.clinicalApplications.some((app) =>
					filters.conditions?.some(
						(condition) =>
							app.condition.toLowerCase().includes(condition.toLowerCase()) ||
							app.polishCondition
								.toLowerCase()
								.includes(condition.toLowerCase()),
					),
				),
			);
		}

		return results;
	}

	/**
	 * Get supplement by ID
	 */
	getSupplementById(id: string): ComprehensiveSupplementProfile | undefined {
		return this.supplements.find((supplement) => supplement.id === id);
	}

	/**
	 * Get supplements by category
	 */
	getSupplementsByCategory(
		category: SupplementCategory,
	): ComprehensiveSupplementProfile[] {
		return this.supplements.filter(
			(supplement) => supplement.category === category,
		);
	}

	/**
	 * Get educational content for specific difficulty level
	 */
	getEducationalContent(
		supplementId: string,
		level: "beginner" | "intermediate" | "expert",
	): { content: string; polishContent: string } | null {
		const supplement = this.getSupplementById(supplementId);
		if (!supplement || !supplement.educationalContent) return null;

		const { educationalContent } = supplement;

		switch (level) {
			case "beginner":
				return {
					content: educationalContent.beginnerExplanation || "",
					polishContent: educationalContent.polishBeginnerExplanation || "",
				};
			case "intermediate":
				return {
					content: educationalContent.intermediateDetails || "",
					polishContent: educationalContent.polishIntermediateDetails || "",
				};
			case "expert":
				return {
					content: educationalContent.expertAnalysis || "",
					polishContent: educationalContent.polishExpertAnalysis || "",
				};
			default:
				return null;
		}
	}

	/**
	 * Analyze interactions between supplements
	 */
	analyzeInteractions(supplementIds: string[]): InteractionAnalysis[] {
		const interactions: InteractionAnalysis[] = [];

		for (let i = 0; i < supplementIds.length; i++) {
			for (let j = i + 1; j < supplementIds.length; j++) {
				const supplementA = this.getSupplementById(supplementIds[i] || "");
				const supplementB = this.getSupplementById(supplementIds[j] || "");

				if (!supplementA || !supplementB) continue;

				// Check for documented interactions
				const interaction = this.findInteraction(supplementA, supplementB);
				if (interaction) {
					interactions.push(interaction);
				}
			}
		}

		return interactions;
	}

	/**
	 * Find specific interaction between two supplements
	 */
	private findInteraction(
		supplementA: ComprehensiveSupplementProfile,
		supplementB: ComprehensiveSupplementProfile,
	): InteractionAnalysis | null {
		// Check if supplementA has documented interactions with supplementB
		const interactionA = supplementA.interactions.find(
			(interaction) =>
				interaction.substance
					.toLowerCase()
					.includes(supplementB.name.toLowerCase()) ||
				(interaction.polishSubstance || "")
					.toLowerCase()
					.includes(supplementB.polishName.toLowerCase()),
		);

		if (interactionA) {
			return {
				supplementA: supplementA.id,
				supplementB: supplementB.id,
				interactionType: this.mapInteractionType(interactionA.type),
				severity: this.mapSeverity(interactionA.severity),
				mechanism: interactionA.mechanism || "Unknown mechanism",
				polishMechanism: interactionA.polishMechanism || "Nieznany mechanizm",
				clinicalSignificance:
					interactionA.clinicalSignificance ||
					"Clinical significance not documented",
				polishClinicalSignificance:
					interactionA.polishClinicalSignificance ||
					"Znaczenie kliniczne nieudokumentowane",
				recommendation:
					interactionA.recommendation || "Monitor for interactions",
				polishRecommendation:
					interactionA.polishRecommendation || "Monitorować interakcje",
				evidenceLevel: "MODERATE", // Default for documented interactions
			};
		}

		// Check for mechanism-based potential interactions
		return this.predictMechanismInteraction(supplementA, supplementB);
	}

	/**
	 * Predict interactions based on mechanisms
	 */
	private predictMechanismInteraction(
		supplementA: ComprehensiveSupplementProfile,
		supplementB: ComprehensiveSupplementProfile,
	): InteractionAnalysis | null {
		// Look for overlapping pathways that might interact
		const overlappingMechanisms = supplementA.mechanisms.filter((mechA) =>
			supplementB.mechanisms.some((mechB) =>
				mechA.targetSystems?.some((siteA: string) =>
					mechB.targetSystems?.some(
						(siteB: string) => siteA.toLowerCase() === siteB.toLowerCase(),
					),
				),
			),
		);

		if (overlappingMechanisms.length > 0) {
			const firstMechanism = overlappingMechanisms[0];
			return {
				supplementA: supplementA.id,
				supplementB: supplementB.id,
				interactionType: "SYNERGISTIC",
				severity: "LOW",
				mechanism: `Both supplements target similar pathways: ${firstMechanism?.pathway || "Unknown pathway"}`,
				polishMechanism: `Oba suplementy celują w podobne szlaki: ${firstMechanism?.polishPathway || "Nieznany szlak"}`,
				clinicalSignificance: "Potential additive effects",
				polishClinicalSignificance: "Potencjalne działanie addytywne",
				recommendation: "Monitor for enhanced effects",
				polishRecommendation: "Monitorować pod kątem wzmocnionych efektów",
				evidenceLevel: "WEAK",
			};
		}

		return null;
	}

	/**
	 * Map interaction types
	 */
	private mapInteractionType(
		type: string,
	): InteractionAnalysis["interactionType"] {
		switch (type.toUpperCase()) {
			case "ENHANCES":
			case "SYNERGIZES":
				return "SYNERGISTIC";
			case "INHIBITS":
			case "ANTAGONIZES":
				return "ANTAGONISTIC";
			case "MODULATES":
				return "NEUTRAL";
			default:
				return "CAUTION";
		}
	}

	/**
	 * Map severity levels
	 */
	private mapSeverity(severity: string): InteractionAnalysis["severity"] {
		switch (severity.toUpperCase()) {
			case "MILD":
				return "LOW";
			case "MODERATE":
				return "MODERATE";
			case "SEVERE":
				return "HIGH";
			case "CRITICAL":
				return "SEVERE";
			default:
				return "MODERATE";
		}
	}

	/**
	 * Get supplement recommendations based on health goals
	 */
	getRecommendations(
		healthGoals: string[],
		currentSupplements: string[] = [],
		userProfile?: {
			age?: number;
			gender?: "male" | "female";
			isPregnant?: boolean;
			isBreastfeeding?: boolean;
			medications?: string[];
			allergies?: string[];
		},
	): SupplementRecommendation[] {
		const recommendations: SupplementRecommendation[] = [];

		// Filter out current supplements
		const availableSupplements = this.supplements.filter(
			(supplement) => !currentSupplements.includes(supplement.id),
		);

		healthGoals.forEach((goal) => {
			const goalLower = goal.toLowerCase();

			availableSupplements.forEach((supplement) => {
				let relevanceScore = 0;
				const reasoning: string[] = [];
				const polishReasoning: string[] = [];
				const warnings: string[] = [];
				const polishWarnings: string[] = [];

				// Check clinical applications
				supplement.clinicalApplications.forEach((app) => {
					if (
						app.condition.toLowerCase().includes(goalLower) ||
						app.polishCondition.toLowerCase().includes(goalLower)
					) {
						relevanceScore += (app.effectivenessRating || 0) * 10;
						reasoning.push(
							`Effective for ${app.condition} (${app.effectivenessRating || 0}/10)`,
						);
						polishReasoning.push(
							`Skuteczny dla ${app.polishCondition} (${app.effectivenessRating || 0}/10)`,
						);
					}
				});

				// Check safety for user profile
				if (userProfile) {
					if (
						userProfile.isPregnant &&
						!["A", "B"].includes(supplement.safetyProfile.pregnancyCategory)
					) {
						warnings.push("Not recommended during pregnancy");
						polishWarnings.push("Niezalecane w ciąży");
						relevanceScore *= 0.1; // Heavily penalize
					}

					if (
						userProfile.isBreastfeeding &&
						supplement.safetyProfile.breastfeedingSafety !== "Safe"
					) {
						warnings.push("Safety during breastfeeding unknown");
						polishWarnings.push(
							"Bezpieczeństwo podczas karmienia piersią nieznane",
						);
						relevanceScore *= 0.5;
					}
				}

				if (relevanceScore > 0) {
					recommendations.push({
						supplement,
						relevanceScore,
						reasoning: reasoning.join("; "),
						polishReasoning: polishReasoning.join("; "),
						warnings,
						polishWarnings,
						synergies: [], // Will be populated by interaction analysis
						polishSynergies: [],
					});
				}
			});
		});

		// Sort by relevance score
		return recommendations
			.sort((a, b) => b.relevanceScore - a.relevanceScore)
			.slice(0, 10); // Return top 10 recommendations
	}

	/**
	 * Get all available categories
	 */
	getCategories(): SupplementCategory[] {
		const categories = new Set<SupplementCategory>();
		this.supplements.forEach((supplement) =>
			categories.add(supplement.category),
		);
		return Array.from(categories);
	}

	/**
	 * Get statistics about the database
	 */
	getDatabaseStats() {
		const totalSupplements = this.supplements.length;
		const categoryCounts = this.getCategories().reduce(
			(acc, category) => {
				acc[category] = this.getSupplementsByCategory(category).length;
				return acc;
			},
			{} as Record<SupplementCategory, number>,
		);

		const evidenceLevels = this.supplements.reduce(
			(acc, supplement) => {
				acc[supplement.evidenceLevel] =
					(acc[supplement.evidenceLevel] || 0) + 1;
				return acc;
			},
			{} as Record<EvidenceLevel, number>,
		);

		const totalStudies = this.supplements.reduce(
			(sum, supplement) => sum + supplement.clinicalEvidence.totalStudies,
			0,
		);

		return {
			totalSupplements,
			categoryCounts,
			evidenceLevels,
			totalStudies,
			lastUpdated: new Date().toISOString(),
		};
	}
}

// Export singleton instance
export const comprehensiveSupplementsService =
	new ComprehensiveSupplementsService();
