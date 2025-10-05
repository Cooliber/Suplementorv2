/**
 * Synergistic Effect Analysis Engine
 * Advanced engine for analyzing and quantifying synergistic effects between supplements
 */

import type { ComprehensiveSupplementProfile } from "@/data/comprehensive-supplements";
import {
	synergisticEffects,
	synergisticPairs,
} from "@/data/synergistic-effects";
import type {
	ActiveCompound,
	ClinicalApplication,
	EvidenceLevel,
	MechanismOfAction,
	SideEffect,
	SupplementInteraction,
} from "../../types/supplement";

export interface SynergyScore {
	pairwiseScore: number; // 0-1 score for pairwise synergy
	mechanismScore: number; // 0-1 score for mechanism compatibility
	evidenceScore: number; // 0-1 score based on evidence level
	safetyScore: number; // 0-1 score for safety compatibility
	overallScore: number; // 0-1 combined score
}

export interface SynergyAnalysis {
	supplement1: ComprehensiveSupplementProfile;
	supplement2: ComprehensiveSupplementProfile;
	synergyType: "synergistic" | "antagonistic" | "additive" | "neutral";
	mechanism: string;
	polishMechanism: string;
	evidenceLevel: EvidenceLevel;
	strength: number; // 0-1
	safetyProfile: "safe" | "cautious" | "contraindicated";
	clinicalApplications: ClinicalApplication[];
	researchStudies: any[];
	recommendations: string[];
	polishRecommendations: string[];
}

export interface MultiSupplementSynergy {
	supplements: ComprehensiveSupplementProfile[];
	overallSynergyScore: number;
	mechanismClusters: MechanismCluster[];
	safetyConcerns: SafetyConcern[];
	optimalRatios: OptimalRatio[];
	evidenceStrength: EvidenceLevel;
}

export interface MechanismCluster {
	mechanisms: string[];
	combinedEffect: string;
	polishCombinedEffect: string;
	strength: number;
	pathways: string[];
}

export interface SafetyConcern {
	type: "interaction" | "contraindication" | "side_effect" | "dosage";
	severity: "low" | "moderate" | "high" | "critical";
	description: string;
	polishDescription: string;
	recommendation: string;
	polishRecommendation: string;
}

export interface OptimalRatio {
	supplementId: string;
	supplementName: string;
	ratio: number;
	unit: string;
	reason: string;
	polishReason: string;
}

export class SynergisticAnalysisEngine {
	private readonly EVIDENCE_WEIGHTS = {
		STRONG: 1.0,
		MODERATE: 0.7,
		WEAK: 0.4,
		INSUFFICIENT: 0.1,
		CONFLICTING: 0.2,
	};

	private readonly MECHANISM_COMPATIBILITY = {
		complementary: 1.0,
		additive: 0.8,
		overlapping: 0.6,
		competitive: 0.3,
		antagonistic: -0.5,
	};

	/**
	 * Analyze synergy between two supplements
	 */
	analyzePairwiseSynergy(
		supplement1: ComprehensiveSupplementProfile,
		supplement2: ComprehensiveSupplementProfile,
	): SynergyAnalysis | null {
		// Check existing synergistic pairs data
		const existingPair = synergisticPairs.find(
			(pair) =>
				(pair.supplement1 === supplement1.id &&
					pair.supplement2 === supplement2.id) ||
				(pair.supplement1 === supplement2.id &&
					pair.supplement2 === supplement1.id),
		);

		if (existingPair) {
			return this.buildSynergyAnalysisFromPair(
				supplement1,
				supplement2,
				existingPair,
			);
		}

		// Analyze interactions from supplement data
		const interactions1 = supplement1.interactions.filter(
			(int: SupplementInteraction) =>
				int.substance === supplement2.name ||
				int.polishSubstance === supplement2.polishName,
		);

		const interactions2 = supplement2.interactions.filter(
			(int: SupplementInteraction) =>
				int.substance === supplement1.name ||
				int.polishSubstance === supplement1.polishName,
		);

		const allInteractions = [...interactions1, ...interactions2];

		if (allInteractions.length === 0) {
			return null; // No known interactions
		}

		return this.buildSynergyAnalysisFromInteractions(
			supplement1,
			supplement2,
			allInteractions,
		);
	}

	/**
	 * Analyze synergy in a multi-supplement combination
	 */
	analyzeMultiSupplementSynergy(
		supplements: ComprehensiveSupplementProfile[],
	): MultiSupplementSynergy {
		if (supplements.length < 2) {
			throw new Error(
				"Multi-supplement analysis requires at least 2 supplements",
			);
		}

		// Analyze all pairwise synergies
		const pairwiseAnalyses: SynergyAnalysis[] = [];
		for (let i = 0; i < supplements.length; i++) {
			for (let j = i + 1; j < supplements.length; j++) {
				const suppA = supplements[i];
				const suppB = supplements[j];

				if (!suppA || !suppB) continue;

				const analysis = this.analyzePairwiseSynergy(suppA, suppB);
				if (analysis) {
					pairwiseAnalyses.push(analysis);
				}
			}
		}

		// Identify mechanism clusters
		const mechanismClusters = this.identifyMechanismClusters(supplements);

		// Analyze safety concerns
		const safetyConcerns = this.analyzeSafetyConcerns(supplements);

		// Calculate optimal ratios
		const optimalRatios = this.calculateOptimalRatios(supplements);

		// Calculate overall synergy score
		const overallSynergyScore = this.calculateOverallSynergyScore(
			pairwiseAnalyses,
			mechanismClusters,
		);

		// Determine evidence strength
		const evidenceStrength = this.determineEvidenceStrength(pairwiseAnalyses);

		return {
			supplements,
			overallSynergyScore,
			mechanismClusters,
			safetyConcerns,
			optimalRatios,
			evidenceStrength,
		};
	}

	/**
	 * Calculate synergy score between two supplements
	 */
	calculateSynergyScore(
		supplement1: ComprehensiveSupplementProfile,
		supplement2: ComprehensiveSupplementProfile,
	): SynergyScore {
		const analysis = this.analyzePairwiseSynergy(supplement1, supplement2);

		if (!analysis) {
			return {
				pairwiseScore: 0,
				mechanismScore: 0,
				evidenceScore: 0,
				safetyScore: 1,
				overallScore: 0,
			};
		}

		const pairwiseScore = this.calculatePairwiseScore(analysis);
		const mechanismScore = this.calculateMechanismScore(
			supplement1,
			supplement2,
		);
		const evidenceScore = this.EVIDENCE_WEIGHTS[analysis.evidenceLevel] || 0;
		const safetyScore = this.calculateSafetyScore(analysis);

		const overallScore =
			pairwiseScore * 0.4 +
			mechanismScore * 0.3 +
			evidenceScore * 0.2 +
			safetyScore * 0.1;

		return {
			pairwiseScore,
			mechanismScore,
			evidenceScore,
			safetyScore,
			overallScore: Math.max(0, Math.min(1, overallScore)),
		};
	}

	/**
	 * Get all known synergistic effects for a supplement
	 */
	getKnownSynergies(
		supplement: ComprehensiveSupplementProfile,
	): SynergyAnalysis[] {
		const synergies: SynergyAnalysis[] = [];

		// Check against known synergistic effects
		synergisticEffects.forEach((effect) => {
			if (effect.supplements.includes(supplement.id)) {
				// Find the other supplement(s) in this synergy
				const otherSupplementIds = effect.supplements.filter(
					(id) => id !== supplement.id,
				);
				// Note: In a real implementation, you'd fetch the other supplements from the database
				// For now, we'll create a placeholder analysis
				synergies.push({
					supplement1: supplement,
					supplement2: {} as ComprehensiveSupplementProfile, // Would be fetched
					synergyType: "synergistic",
					mechanism: effect.mechanism,
					polishMechanism: effect.polishMechanism,
					evidenceLevel: effect.evidenceLevel,
					strength: 0.8,
					safetyProfile:
						effect.safetyProfile === "monitored"
							? "cautious"
							: effect.safetyProfile,
					clinicalApplications: [],
					researchStudies: effect.studies,
					recommendations: [effect.recommendedRatio],
					polishRecommendations: [effect.recommendedRatio],
				});
			}
		});

		return synergies;
	}

	// Private helper methods

	private buildSynergyAnalysisFromPair(
		supplement1: ComprehensiveSupplementProfile,
		supplement2: ComprehensiveSupplementProfile,
		pair: any,
	): SynergyAnalysis {
		const isSynergistic =
			pair.safety !== "contraindicated" && pair.strength > 0.5;

		return {
			supplement1,
			supplement2,
			synergyType: isSynergistic ? "synergistic" : "antagonistic",
			mechanism: pair.mechanism,
			polishMechanism: pair.polishMechanism,
			evidenceLevel: pair.evidenceLevel,
			strength: pair.strength,
			safetyProfile: pair.safety,
			clinicalApplications: pair.applications,
			researchStudies: pair.studies,
			recommendations: [pair.recommendedRatio],
			polishRecommendations: [pair.recommendedRatio],
		};
	}

	private buildSynergyAnalysisFromInteractions(
		supplement1: ComprehensiveSupplementProfile,
		supplement2: ComprehensiveSupplementProfile,
		interactions: SupplementInteraction[],
	): SynergyAnalysis {
		const primaryInteraction = interactions[0];

		if (!primaryInteraction) {
			// Fallback for empty interactions array
			return {
				supplement1,
				supplement2,
				synergyType: "neutral",
				mechanism: "No interaction data available",
				polishMechanism: "Brak danych o interakcji",
				evidenceLevel: "WEAK",
				strength: 0,
				safetyProfile: "safe",
				clinicalApplications: [],
				researchStudies: [],
				recommendations: ["Monitor closely"],
				polishRecommendations: ["Ścisłe monitorowanie"],
			};
		}

		return {
			supplement1,
			supplement2,
			synergyType: this.mapInteractionType(primaryInteraction.type),
			mechanism: primaryInteraction.mechanism || "Unknown mechanism",
			polishMechanism:
				primaryInteraction.polishMechanism || "Nieznany mechanizm",
			evidenceLevel: primaryInteraction.evidenceLevel || "WEAK",
			strength: this.mapSeverityToStrength(primaryInteraction.severity),
			safetyProfile: this.mapSeverityToSafety(primaryInteraction.severity),
			clinicalApplications: [],
			researchStudies: [],
			recommendations: [primaryInteraction.recommendation || "Monitor closely"],
			polishRecommendations: [
				primaryInteraction.polishRecommendation || "Ścisłe monitorowanie",
			],
		};
	}

	private mapInteractionType(
		type: string,
	): "synergistic" | "antagonistic" | "additive" | "neutral" {
		switch (type) {
			case "synergistic":
				return "synergistic";
			case "antagonistic":
			case "competitive":
				return "antagonistic";
			case "additive":
				return "additive";
			default:
				return "neutral";
		}
	}

	private mapSeverityToStrength(severity: string): number {
		switch (severity) {
			case "severe":
				return 0.9;
			case "moderate":
				return 0.6;
			case "minor":
			case "beneficial":
				return 0.3;
			default:
				return 0.1;
		}
	}

	private mapSeverityToSafety(
		severity: string,
	): "safe" | "cautious" | "contraindicated" {
		switch (severity) {
			case "severe":
				return "contraindicated";
			case "moderate":
			case "minor":
				return "cautious";
			case "beneficial":
				return "safe";
			default:
				return "cautious";
		}
	}

	private calculatePairwiseScore(analysis: SynergyAnalysis): number {
		let score = 0;

		// Base score from strength
		score += analysis.strength * 0.5;

		// Bonus for synergistic effects
		if (analysis.synergyType === "synergistic") {
			score += 0.3;
		}

		// Penalty for antagonistic effects
		if (analysis.synergyType === "antagonistic") {
			score -= 0.4;
		}

		// Evidence level weighting
		score += this.EVIDENCE_WEIGHTS[analysis.evidenceLevel] * 0.2;

		return Math.max(0, Math.min(1, score));
	}

	private calculateMechanismScore(
		supplement1: ComprehensiveSupplementProfile,
		supplement2: ComprehensiveSupplementProfile,
	): number {
		const mechanisms1 = supplement1.mechanisms.map((m) =>
			m.pathway.toLowerCase(),
		);
		const mechanisms2 = supplement2.mechanisms.map((m) =>
			m.pathway.toLowerCase(),
		);

		let compatibilityScore = 0;
		let totalComparisons = 0;

		mechanisms1.forEach((m1) => {
			mechanisms2.forEach((m2) => {
				totalComparisons++;
				const compatibility = this.assessMechanismCompatibility(m1, m2);
				compatibilityScore += compatibility;
			});
		});

		return totalComparisons > 0 ? compatibilityScore / totalComparisons : 0;
	}

	private assessMechanismCompatibility(
		mechanism1: string,
		mechanism2: string,
	): number {
		// Simple keyword-based compatibility assessment
		const complementaryKeywords = [
			["neurotransmitter", "receptor"],
			["antioxidant", "oxidative"],
			["anti-inflammatory", "cytokine"],
			["mitochondrial", "energy"],
			["absorption", "bioavailability"],
		];

		for (const [keyword1, keyword2] of complementaryKeywords) {
			if (!keyword1 || !keyword2) continue;

			if (
				(mechanism1.includes(keyword1) && mechanism2.includes(keyword2)) ||
				(mechanism1.includes(keyword2) && mechanism2.includes(keyword1))
			) {
				return this.MECHANISM_COMPATIBILITY.complementary;
			}
		}

		// Check for overlapping mechanisms
		if (mechanism1 === mechanism2) {
			return this.MECHANISM_COMPATIBILITY.overlapping;
		}

		// Default neutral compatibility
		return 0.5;
	}

	private calculateSafetyScore(analysis: SynergyAnalysis): number {
		switch (analysis.safetyProfile) {
			case "safe":
				return 1.0;
			case "cautious":
				return 0.7;
			case "contraindicated":
				return 0.0;
			default:
				return 0.5;
		}
	}

	private identifyMechanismClusters(
		supplements: ComprehensiveSupplementProfile[],
	): MechanismCluster[] {
		const allMechanisms = supplements.flatMap((s) => s.mechanisms);
		const clusters: MechanismCluster[] = [];

		// Group mechanisms by target systems and pathways
		const mechanismGroups = new Map<string, MechanismOfAction[]>();

		allMechanisms.forEach((mechanism) => {
			const targetSystems = mechanism.targetSystems || [];
			const key = `${targetSystems.join(",")}|${mechanism.pathway}`;
			if (!mechanismGroups.has(key)) {
				mechanismGroups.set(key, []);
			}
			mechanismGroups.get(key)?.push(mechanism);
		});

		mechanismGroups.forEach((mechanisms, _key) => {
			if (mechanisms.length > 1) {
				clusters.push({
					mechanisms: mechanisms.map((m) => m.pathway),
					combinedEffect: this.calculateCombinedEffect(mechanisms),
					polishCombinedEffect: this.calculateCombinedEffect(mechanisms, true),
					strength: mechanisms.length * 0.2, // Simple strength calculation
					pathways: mechanisms.map((m) => m.pathway),
				});
			}
		});

		return clusters;
	}

	private calculateCombinedEffect(
		mechanisms: MechanismOfAction[],
		polish = false,
	): string {
		if (mechanisms.length === 0) return polish ? "Brak efektu" : "No effect";

		const effects = mechanisms.map((m) =>
			polish ? m.polishPathway : m.pathway,
		);
		return `Combined ${effects.join(" and ")} effects`;
	}

	private analyzeSafetyConcerns(
		supplements: ComprehensiveSupplementProfile[],
	): SafetyConcern[] {
		const concerns: SafetyConcern[] = [];

		// Check for interactions between all supplement pairs
		for (let i = 0; i < supplements.length; i++) {
			for (let j = i + 1; j < supplements.length; j++) {
				const suppA = supplements[i];
				const suppB = supplements[j];

				if (!suppA || !suppB) continue;

				const analysis = this.analyzePairwiseSynergy(suppA, suppB);
				if (analysis && analysis.safetyProfile === "contraindicated") {
					concerns.push({
						type: "interaction",
						severity: "critical",
						description: `Contraindicated combination: ${suppA.name} + ${suppB.name}`,
						polishDescription: `Przeciwwskazana kombinacja: ${suppA.polishName} + ${suppB.polishName}`,
						recommendation: "Avoid this combination",
						polishRecommendation: "Unikaj tej kombinacji",
					});
				}
			}
		}

		return concerns;
	}

	private calculateOptimalRatios(
		supplements: ComprehensiveSupplementProfile[],
	): OptimalRatio[] {
		// Simple ratio calculation based on therapeutic ranges
		return supplements.map((supplement) => {
			const therapeuticRange = supplement.dosageGuidelines.therapeuticRange;
			const optimalDose = (therapeuticRange.min + therapeuticRange.max) / 2;

			return {
				supplementId: supplement.id,
				supplementName: supplement.name,
				ratio: optimalDose,
				unit: therapeuticRange.unit,
				reason: "Based on therapeutic range midpoint",
				polishReason: "Na podstawie środka zakresu terapeutycznego",
			};
		});
	}

	private calculateOverallSynergyScore(
		pairwiseAnalyses: SynergyAnalysis[],
		mechanismClusters: MechanismCluster[],
	): number {
		if (pairwiseAnalyses.length === 0) return 0;

		const avgPairwiseScore =
			pairwiseAnalyses.reduce((sum, analysis) => {
				return (
					sum +
					(analysis.synergyType === "synergistic"
						? analysis.strength
						: -analysis.strength)
				);
			}, 0) / pairwiseAnalyses.length;

		const mechanismBonus = Math.min(0.3, mechanismClusters.length * 0.1);

		return Math.max(0, Math.min(1, avgPairwiseScore + mechanismBonus));
	}

	private determineEvidenceStrength(
		analyses: SynergyAnalysis[],
	): EvidenceLevel {
		if (analyses.length === 0) return "INSUFFICIENT";

		const evidenceScores = analyses.map(
			(analysis) => this.EVIDENCE_WEIGHTS[analysis.evidenceLevel] || 0,
		);

		const avgEvidenceScore =
			evidenceScores.reduce((a, b) => a + b, 0) / evidenceScores.length;

		if (avgEvidenceScore >= 0.8) return "STRONG";
		if (avgEvidenceScore >= 0.6) return "MODERATE";
		if (avgEvidenceScore >= 0.3) return "WEAK";
		return "INSUFFICIENT";
	}
}

// Export singleton instance
export const synergisticAnalysisEngine = new SynergisticAnalysisEngine();
