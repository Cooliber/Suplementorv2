/**
 * Supplement Data Transformation Utilities
 * Convert between comprehensive supplement data and legacy interfaces
 */

import type { ComprehensiveSupplementProfile } from "@/data/comprehensive-supplements/types";
import type { SupplementWithRelations } from "@/types/supplement";

/**
 * Transform comprehensive supplement data to legacy format for compatibility
 */
export function transformComprehensiveToLegacy(
	comprehensive: ComprehensiveSupplementProfile,
): SupplementWithRelations {
	return {
		id: comprehensive.id,
		name: comprehensive.name,
		polishName: comprehensive.polishName,
		scientificName: comprehensive.scientificName,
		commonNames: comprehensive.commonNames,
		polishCommonNames: comprehensive.polishCommonNames,
		category: comprehensive.category,
		description: comprehensive.description,
		polishDescription: comprehensive.polishDescription,
		activeCompounds: comprehensive.activeCompounds,
		clinicalApplications: comprehensive.clinicalApplications,
		mechanisms: comprehensive.mechanisms,
		dosageGuidelines: comprehensive.dosageGuidelines,
		sideEffects: comprehensive.sideEffects,
		interactions: comprehensive.interactions,
		evidenceLevel: comprehensive.evidenceLevel,
		researchStudies: comprehensive.researchStudies,
		tags: comprehensive.tags,
		lastUpdated: comprehensive.lastUpdated,
		createdAt: comprehensive.createdAt,
		knowledgeNodeId: comprehensive.knowledgeNodeId,
	};
}

/**
 * Transform legacy supplement data to comprehensive format (for future use)
 */
export function transformLegacyToComprehensive(
	legacy: SupplementWithRelations,
): ComprehensiveSupplementProfile {
	return {
		...legacy,
		// Add comprehensive fields with defaults
		educationalContent: {
			beginnerExplanation: legacy.description || "",
			polishBeginnerExplanation: legacy.polishDescription || "",
			intermediateDetails: "",
			polishIntermediateDetails: "",
			expertAnalysis: "",
			polishExpertAnalysis: "",
			keyTakeaways: [],
			polishKeyTakeaways: [],
		},
		clinicalEvidence: {
			totalStudies: legacy.researchStudies?.length || 0,
			metaAnalyses: 0,
			rctCount: 0,
			observationalStudies: 0,
			lastReviewDate: legacy.lastUpdated,
			cochranReviews: [],
		},
		pharmacokinetics: {
			absorption: {
				rate: "Not specified",
				factors: [],
				polishFactors: [],
				optimalTiming: "Not specified",
				polishOptimalTiming: "Nie określono",
			},
			distribution: {
				volumeOfDistribution: "Not specified",
				proteinBinding: "Not specified",
				brainPenetration: false,
				placentalCrossing: false,
			},
			metabolism: {
				primaryPathway: "Not specified",
				polishPrimaryPathway: "Nie określono",
				enzymes: [],
				metabolites: [],
			},
			elimination: {
				halfLife: "Not specified",
				excretionRoute: "Not specified",
				renalClearance: "Not specified",
			},
		},
		safetyProfile: {
			pregnancyCategory: "Unknown",
			breastfeedingSafety: "Unknown",
			pediatricUse: {
				approved: false,
				ageLimit: "Not approved",
				specialConsiderations: [],
				polishSpecialConsiderations: [],
			},
			elderlyConsiderations: [],
			polishElderlyConsiderations: [],
			hepaticImpairment: "No data",
			polishHepaticImpairment: "Brak danych",
			renalImpairment: "No data",
			polishRenalImpairment: "Brak danych",
		},
		qualityConsiderations: {
			standardization: "Not specified",
			polishStandardization: "Nie określono",
			bioavailabilityForms: [],
			polishBioavailabilityForms: [],
			qualityMarkers: [],
			polishQualityMarkers: [],
			storageRequirements: "Not specified",
			polishStorageRequirements: "Nie określono",
			shelfLife: "Not specified",
		},
		economicData: {
			averageCostPerMonth: {
				low: 0,
				average: 0,
				high: 0,
				currency: "EUR",
			},
			costEffectivenessRating: "Not rated",
			polishCostEffectivenessRating: "Nie oceniono",
			valueProposition: "Not specified",
			polishValueProposition: "Nie określono",
		},
	};
}

/**
 * Extract safety information from comprehensive supplement data
 */
export function extractSafetyInformation(
	comprehensive: ComprehensiveSupplementProfile,
) {
	return {
		pregnancyCategory: comprehensive.safetyProfile.pregnancyCategory,
		breastfeedingSafety: comprehensive.safetyProfile.breastfeedingSafety,
		pediatricUse: comprehensive.safetyProfile.pediatricUse,
		elderlyConsiderations: comprehensive.safetyProfile.elderlyConsiderations,
		hepaticImpairment: comprehensive.safetyProfile.hepaticImpairment,
		renalImpairment: comprehensive.safetyProfile.renalImpairment,
		contraindications: comprehensive.dosageGuidelines.contraindications,
		polishContraindications:
			comprehensive.dosageGuidelines.polishContraindications,
		sideEffects: comprehensive.sideEffects,
		interactions: comprehensive.interactions,
	};
}

/**
 * Extract educational content from comprehensive supplement data
 */
export function extractEducationalContent(
	comprehensive: ComprehensiveSupplementProfile,
) {
	return {
		beginnerExplanation: comprehensive.educationalContent.beginnerExplanation,
		polishBeginnerExplanation:
			comprehensive.educationalContent.polishBeginnerExplanation,
		intermediateDetails: comprehensive.educationalContent.intermediateDetails,
		polishIntermediateDetails:
			comprehensive.educationalContent.polishIntermediateDetails,
		expertAnalysis: comprehensive.educationalContent.expertAnalysis,
		polishExpertAnalysis: comprehensive.educationalContent.polishExpertAnalysis,
		keyTakeaways: comprehensive.educationalContent.keyTakeaways,
		polishKeyTakeaways: comprehensive.educationalContent.polishKeyTakeaways,
	};
}

/**
 * Extract evidence information from comprehensive supplement data
 */
export function extractEvidenceInformation(
	comprehensive: ComprehensiveSupplementProfile,
) {
	return {
		evidenceLevel: comprehensive.evidenceLevel,
		totalStudies: comprehensive.clinicalEvidence.totalStudies,
		metaAnalyses: comprehensive.clinicalEvidence.metaAnalyses,
		rctCount: comprehensive.clinicalEvidence.rctCount,
		observationalStudies: comprehensive.clinicalEvidence.observationalStudies,
		lastReviewDate: comprehensive.clinicalEvidence.lastReviewDate,
		cochranReviews: comprehensive.clinicalEvidence.cochranReviews,
		researchStudies: comprehensive.researchStudies,
	};
}

/**
 * Extract quality and economic information from comprehensive supplement data
 */
export function extractQualityAndEconomicInfo(
	comprehensive: ComprehensiveSupplementProfile,
) {
	return {
		qualityConsiderations: comprehensive.qualityConsiderations,
		economicData: comprehensive.economicData,
		pharmacokinetics: comprehensive.pharmacokinetics,
	};
}

/**
 * Create a search index for comprehensive supplement data
 */
export function createSearchIndex(
	comprehensive: ComprehensiveSupplementProfile,
): string[] {
	return [
		comprehensive.name,
		comprehensive.polishName,
		comprehensive.scientificName || "",
		comprehensive.description || "",
		comprehensive.polishDescription || "",
		...comprehensive.commonNames,
		...comprehensive.polishCommonNames,
		...comprehensive.tags,
		...comprehensive.activeCompounds.map((compound) => compound.name),
		...comprehensive.activeCompounds.map(
			(compound) => compound.polishName || compound.name,
		),
		...comprehensive.clinicalApplications.map((app) => app.condition),
		...comprehensive.clinicalApplications.map((app) => app.polishCondition),
		...comprehensive.mechanisms.map((mech) => mech.pathway),
		...comprehensive.mechanisms.map((mech) => mech.polishPathway),
	];
}

/**
 * Create a normalized search index for better search performance
 */
export function createNormalizedSearchIndex(
	comprehensive: ComprehensiveSupplementProfile,
): string {
	const searchIndex = createSearchIndex(comprehensive);
	return searchIndex.join(" ").toLowerCase().replace(/\s+/g, " ").trim();
}

/**
 * Calculate supplement relevance score for search results
 */
export function calculateRelevanceScore(
	supplement: ComprehensiveSupplementProfile,
	searchTerm: string,
	language: "en" | "pl" = "pl",
): number {
	const normalizedSearchTerm = searchTerm.toLowerCase();
	const searchIndex = createNormalizedSearchIndex(supplement);

	let score = 0;

	// Exact name matches get highest score
	if (supplement.name.toLowerCase().includes(normalizedSearchTerm)) {
		score += 100;
	}
	if (supplement.polishName.toLowerCase().includes(normalizedSearchTerm)) {
		score += 100;
	}

	// Scientific name matches
	if (supplement.scientificName?.toLowerCase().includes(normalizedSearchTerm)) {
		score += 80;
	}

	// Common names matches
	if (
		supplement.commonNames.some((name) =>
			name.toLowerCase().includes(normalizedSearchTerm),
		)
	) {
		score += 60;
	}
	if (
		supplement.polishCommonNames.some((name) =>
			name.toLowerCase().includes(normalizedSearchTerm),
		)
	) {
		score += 60;
	}

	// Description matches
	if (supplement.description?.toLowerCase().includes(normalizedSearchTerm)) {
		score += 40;
	}
	if (
		supplement.polishDescription?.toLowerCase().includes(normalizedSearchTerm)
	) {
		score += 40;
	}

	// Clinical applications matches
	if (
		supplement.clinicalApplications.some(
			(app) =>
				app.condition.toLowerCase().includes(normalizedSearchTerm) ||
				app.polishCondition.toLowerCase().includes(normalizedSearchTerm),
		)
	) {
		score += 50;
	}

	// Tags matches
	if (
		supplement.tags.some((tag) =>
			tag.toLowerCase().includes(normalizedSearchTerm),
		)
	) {
		score += 30;
	}

	// Active compounds matches
	if (
		supplement.activeCompounds.some(
			(compound) =>
				compound.name.toLowerCase().includes(normalizedSearchTerm) ||
				(compound.polishName || compound.name)
					.toLowerCase()
					.includes(normalizedSearchTerm),
		)
	) {
		score += 45;
	}

	// Evidence level bonus (higher evidence = higher score)
	const evidenceScores = {
		STRONG: 20,
		MODERATE: 15,
		WEAK: 10,
		INSUFFICIENT: 5,
		CONFLICTING: 0,
	};
	score += evidenceScores[supplement.evidenceLevel] || 0;

	return score;
}

/**
 * Sort supplements by relevance score for search results
 */
export function sortByRelevance<T extends ComprehensiveSupplementProfile>(
	supplements: T[],
	searchTerm: string,
	language: "en" | "pl" = "pl",
): T[] {
	return supplements.sort((a, b) => {
		const scoreA = calculateRelevanceScore(a, searchTerm, language);
		const scoreB = calculateRelevanceScore(b, searchTerm, language);
		return scoreB - scoreA; // Higher score first
	});
}

/**
 * Filter supplements by multiple criteria
 */
export function filterSupplementsByCriteria<
	T extends ComprehensiveSupplementProfile,
>(
	supplements: T[],
	criteria: {
		categories?: string[];
		evidenceLevels?: string[];
		minEffectiveness?: number;
		maxCost?: number;
		pregnancySafe?: boolean;
		breastfeedingSafe?: boolean;
		pediatricApproved?: boolean;
		searchTerm?: string;
		conditions?: string[];
		mechanisms?: string[];
	},
): T[] {
	return supplements.filter((supplement) => {
		// Category filter
		if (criteria.categories && criteria.categories.length > 0) {
			if (!criteria.categories.includes(supplement.category)) {
				return false;
			}
		}

		// Evidence level filter
		if (criteria.evidenceLevels && criteria.evidenceLevels.length > 0) {
			if (!criteria.evidenceLevels.includes(supplement.evidenceLevel)) {
				return false;
			}
		}

		// Effectiveness filter
		if (criteria.minEffectiveness) {
			const maxEffectiveness = Math.max(
				...supplement.clinicalApplications.map(
					(app) => app.effectivenessRating,
				),
			);
			if (maxEffectiveness < criteria.minEffectiveness) {
				return false;
			}
		}

		// Cost filter
		if (criteria.maxCost) {
			const avgCost = supplement.economicData.averageCostPerMonth.average;
			if (avgCost > criteria.maxCost) {
				return false;
			}
		}

		// Safety filters
		if (criteria.pregnancySafe) {
			if (
				supplement.safetyProfile.pregnancyCategory !== "A" &&
				supplement.safetyProfile.pregnancyCategory !== "B"
			) {
				return false;
			}
		}

		if (criteria.breastfeedingSafe) {
			if (supplement.safetyProfile.breastfeedingSafety !== "Safe") {
				return false;
			}
		}

		if (criteria.pediatricApproved) {
			if (!supplement.safetyProfile.pediatricUse.approved) {
				return false;
			}
		}

		// Search term filter
		if (criteria.searchTerm) {
			const searchIndex = createNormalizedSearchIndex(supplement);
			if (!searchIndex.includes(criteria.searchTerm.toLowerCase())) {
				return false;
			}
		}

		// Conditions filter
		if (criteria.conditions && criteria.conditions.length > 0) {
			const hasMatchingCondition = criteria.conditions.some((condition) => {
				return supplement.clinicalApplications.some(
					(app) =>
						app.condition.toLowerCase().includes(condition.toLowerCase()) ||
						app.polishCondition.toLowerCase().includes(condition.toLowerCase()),
				);
			});
			if (!hasMatchingCondition) {
				return false;
			}
		}

		// Mechanisms filter
		if (criteria.mechanisms && criteria.mechanisms.length > 0) {
			const hasMatchingMechanism = criteria.mechanisms.some((mechanism) => {
				return supplement.mechanisms.some(
					(mech) =>
						mech.pathway.toLowerCase().includes(mechanism.toLowerCase()) ||
						mech.polishPathway.toLowerCase().includes(mechanism.toLowerCase()),
				);
			});
			if (!hasMatchingMechanism) {
				return false;
			}
		}

		return true;
	});
}

/**
 * Batch transform comprehensive supplements to legacy format
 */
export function batchTransformToLegacy(
	comprehensiveSupplements: ComprehensiveSupplementProfile[],
): SupplementWithRelations[] {
	return comprehensiveSupplements.map(transformComprehensiveToLegacy);
}

/**
 * Create supplement comparison data
 */
export function createComparisonData(
	supplements: ComprehensiveSupplementProfile[],
) {
	return supplements.map((supplement) => ({
		id: supplement.id,
		name: supplement.name,
		polishName: supplement.polishName,
		category: supplement.category,
		evidenceLevel: supplement.evidenceLevel,
		totalStudies: supplement.clinicalEvidence.totalStudies,
		avgEffectiveness:
			supplement.clinicalApplications.reduce(
				(sum, app) => sum + app.effectivenessRating,
				0,
			) / supplement.clinicalApplications.length,
		avgCost: supplement.economicData.averageCostPerMonth.average,
		safetyRating:
			supplement.safetyProfile.pregnancyCategory === "A"
				? "Excellent"
				: supplement.safetyProfile.pregnancyCategory === "B"
					? "Good"
					: "Fair",
		mechanisms: supplement.mechanisms.map((m) => m.pathway),
		sideEffects: supplement.sideEffects.length,
		interactions: supplement.interactions.length,
	}));
}
