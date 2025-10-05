/**
 * Supplement Interaction Service
 * Comprehensive interaction analysis, visualization, and safety warnings
 * Includes medication interactions and Polish healthcare context
 */

import type { ComprehensiveSupplementProfile } from "@/data/comprehensive-supplements";
import { comprehensiveSupplementsService } from "./comprehensive-supplements-service";

export interface InteractionMatrix {
	supplements: string[];
	interactions: InteractionPair[];
	riskAssessment: RiskAssessment;
	recommendations: InteractionRecommendation[];
	lastUpdated: string;
}

export interface InteractionPair {
	supplementA: string;
	supplementB: string;
	interactionType: InteractionType;
	severity: InteractionSeverity;
	mechanism: string;
	polishMechanism: string;
	clinicalSignificance: string;
	polishClinicalSignificance: string;
	recommendation: string;
	polishRecommendation: string;
	evidenceLevel: "STRONG" | "MODERATE" | "WEAK" | "THEORETICAL";
	sources: InteractionSource[];
	timing: TimingConsideration;
	dosageImpact: DosageImpact;
	monitoringRequirements: MonitoringRequirement[];
}

export type InteractionType =
	| "SYNERGISTIC" // Beneficial interaction
	| "ADDITIVE" // Combined effects
	| "ANTAGONISTIC" // Opposing effects
	| "COMPETITIVE" // Competition for absorption/metabolism
	| "POTENTIATING" // One enhances the other
	| "INHIBITORY" // One inhibits the other
	| "NEUTRAL" // No significant interaction
	| "UNKNOWN"; // Insufficient data

export type InteractionSeverity =
	| "BENEFICIAL" // Positive interaction
	| "MINOR" // Minimal clinical significance
	| "MODERATE" // Clinically significant, monitoring needed
	| "MAJOR" // Significant risk, caution required
	| "CONTRAINDICATED"; // Should not be combined

export interface InteractionSource {
	type:
		| "CLINICAL_STUDY"
		| "CASE_REPORT"
		| "PHARMACOKINETIC_STUDY"
		| "EXPERT_OPINION"
		| "THEORETICAL";
	reference: string;
	pubmedId?: string;
	quality: "HIGH" | "MEDIUM" | "LOW";
	description: string;
	polishDescription: string;
}

export interface TimingConsideration {
	separationRequired: boolean;
	minimumSeparation?: string; // e.g., "2 hours"
	polishMinimumSeparation?: string;
	optimalTiming?: string;
	polishOptimalTiming?: string;
	explanation: string;
	polishExplanation: string;
}

export interface DosageImpact {
	requiresDosageAdjustment: boolean;
	adjustmentType?: "INCREASE" | "DECREASE" | "MONITOR";
	adjustmentMagnitude?: string; // e.g., "25% reduction"
	polishAdjustmentMagnitude?: string;
	explanation: string;
	polishExplanation: string;
}

export interface MonitoringRequirement {
	parameter: string;
	polishParameter: string;
	frequency: string;
	polishFrequency: string;
	normalRange?: string;
	warningThreshold?: string;
	actionRequired: string;
	polishActionRequired: string;
}

export interface RiskAssessment {
	overallRisk: "LOW" | "MODERATE" | "HIGH" | "VERY_HIGH";
	polishOverallRisk: string;
	riskFactors: string[];
	polishRiskFactors: string[];
	mitigationStrategies: string[];
	polishMitigationStrategies: string[];
	contraindications: string[];
	polishContraindications: string[];
}

export interface InteractionRecommendation {
	type: "TIMING" | "DOSAGE" | "MONITORING" | "AVOIDANCE" | "ALTERNATIVE";
	priority: "HIGH" | "MEDIUM" | "LOW";
	recommendation: string;
	polishRecommendation: string;
	rationale: string;
	polishRationale: string;
	implementationSteps: string[];
	polishImplementationSteps: string[];
}

export interface MedicationInteraction {
	medicationName: string;
	polishMedicationName: string;
	activeIngredient: string;
	supplementId: string;
	interactionType: InteractionType;
	severity: InteractionSeverity;
	mechanism: string;
	polishMechanism: string;
	clinicalConsequences: string[];
	polishClinicalConsequences: string[];
	management: string;
	polishManagement: string;
	evidenceLevel: "STRONG" | "MODERATE" | "WEAK" | "THEORETICAL";
	polishHealthcareGuidance: string;
}

export interface VisualizationData {
	nodes: InteractionNode[];
	edges: InteractionEdge[];
	clusters: InteractionCluster[];
	layout: "FORCE" | "CIRCULAR" | "HIERARCHICAL" | "MATRIX";
}

export interface InteractionNode {
	id: string;
	name: string;
	polishName: string;
	type: "SUPPLEMENT" | "MEDICATION" | "NUTRIENT";
	category: string;
	riskLevel: number; // 0-1
	size: number;
	color: string;
	position?: { x: number; y: number };
	metadata: {
		totalInteractions: number;
		highRiskInteractions: number;
		beneficialInteractions: number;
	};
}

export interface InteractionEdge {
	source: string;
	target: string;
	type: InteractionType;
	severity: InteractionSeverity;
	weight: number; // 0-1
	color: string;
	thickness: number;
	animated: boolean;
	label?: string;
	polishLabel?: string;
}

export interface InteractionCluster {
	id: string;
	name: string;
	polishName: string;
	nodes: string[];
	riskLevel: "LOW" | "MODERATE" | "HIGH";
	description: string;
	polishDescription: string;
}

export class SupplementInteractionService {
	private interactionDatabase: Map<string, InteractionPair[]> = new Map();
	private medicationInteractions: Map<string, MedicationInteraction[]> =
		new Map();

	constructor() {
		this.initializeInteractionDatabase();
	}

	/**
	 * Analyze interactions for a list of supplements
	 */
	analyzeInteractions(supplementIds: string[]): InteractionMatrix {
		const interactions: InteractionPair[] = [];

		// Check all pairwise interactions
		for (let i = 0; i < supplementIds.length; i++) {
			for (let j = i + 1; j < supplementIds.length; j++) {
				const idA = supplementIds[i];
				const idB = supplementIds[j];

				if (!idA || !idB) continue;

				const interaction = this.findInteraction(idA, idB);
				if (interaction) {
					interactions.push(interaction);
				}
			}
		}

		const riskAssessment = this.assessOverallRisk(interactions);
		const recommendations = this.generateRecommendations(
			interactions,
			supplementIds,
		);

		return {
			supplements: supplementIds,
			interactions,
			riskAssessment,
			recommendations,
			lastUpdated: new Date().toISOString(),
		};
	}

	/**
	 * Check interactions with medications
	 */
	checkMedicationInteractions(
		supplementIds: string[],
		medications: { name: string; activeIngredient: string }[],
	): MedicationInteraction[] {
		const interactions: MedicationInteraction[] = [];

		supplementIds.forEach((supplementId) => {
			medications.forEach((medication) => {
				const interaction = this.findMedicationInteraction(
					supplementId,
					medication,
				);
				if (interaction) {
					interactions.push(interaction);
				}
			});
		});

		return interactions;
	}

	/**
	 * Generate visualization data for interaction network
	 */
	generateVisualizationData(
		supplementIds: string[],
		layout: VisualizationData["layout"] = "FORCE",
	): VisualizationData {
		const nodes: InteractionNode[] = [];
		const edges: InteractionEdge[] = [];
		const clusters: InteractionCluster[] = [];

		// Create nodes for each supplement
		supplementIds.forEach((id) => {
			const supplement = comprehensiveSupplementsService.getSupplementById(id);
			if (supplement) {
				const interactions = this.getSupplementInteractions(id, supplementIds);
				const highRiskCount = interactions.filter(
					(i) => i.severity === "MAJOR" || i.severity === "CONTRAINDICATED",
				).length;
				const beneficialCount = interactions.filter(
					(i) => i.severity === "BENEFICIAL",
				).length;

				nodes.push({
					id,
					name: supplement.name,
					polishName: supplement.polishName,
					type: "SUPPLEMENT",
					category: supplement.category,
					riskLevel: this.calculateNodeRiskLevel(interactions),
					size: Math.max(20, Math.min(60, 20 + interactions.length * 5)),
					color: this.getNodeColor(supplement.category),
					metadata: {
						totalInteractions: interactions.length,
						highRiskInteractions: highRiskCount,
						beneficialInteractions: beneficialCount,
					},
				});
			}
		});

		// Create edges for interactions
		for (let i = 0; i < supplementIds.length; i++) {
			for (let j = i + 1; j < supplementIds.length; j++) {
				const idA = supplementIds[i];
				const idB = supplementIds[j];

				if (!idA || !idB) continue;

				const interaction = this.findInteraction(idA, idB);
				if (interaction) {
					edges.push({
						source: idA,
						target: idB,
						type: interaction.interactionType,
						severity: interaction.severity,
						weight: this.getInteractionWeight(interaction),
						color: this.getInteractionColor(interaction.severity),
						thickness: this.getInteractionThickness(interaction.severity),
						animated:
							interaction.severity === "MAJOR" ||
							interaction.severity === "CONTRAINDICATED",
						label: interaction.interactionType,
						polishLabel: this.translateInteractionType(
							interaction.interactionType,
						),
					});
				}
			}
		}

		// Generate clusters based on interaction patterns
		clusters.push(...this.generateClusters(nodes, edges));

		return { nodes, edges, clusters, layout };
	}

	/**
	 * Get safety warnings for supplement combination
	 */
	getSafetyWarnings(supplementIds: string[]): {
		critical: string[];
		polishCritical: string[];
		warnings: string[];
		polishWarnings: string[];
		recommendations: string[];
		polishRecommendations: string[];
	} {
		const matrix = this.analyzeInteractions(supplementIds);

		const critical: string[] = [];
		const polishCritical: string[] = [];
		const warnings: string[] = [];
		const polishWarnings: string[] = [];

		matrix.interactions.forEach((interaction) => {
			if (interaction.severity === "CONTRAINDICATED") {
				critical.push(
					`${interaction.supplementA} + ${interaction.supplementB}: ${interaction.clinicalSignificance}`,
				);
				polishCritical.push(
					`${interaction.supplementA} + ${interaction.supplementB}: ${interaction.polishClinicalSignificance}`,
				);
			} else if (interaction.severity === "MAJOR") {
				warnings.push(
					`${interaction.supplementA} + ${interaction.supplementB}: ${interaction.clinicalSignificance}`,
				);
				polishWarnings.push(
					`${interaction.supplementA} + ${interaction.supplementB}: ${interaction.polishClinicalSignificance}`,
				);
			}
		});

		return {
			critical,
			polishCritical,
			warnings,
			polishWarnings,
			recommendations: matrix.recommendations.map((r) => r.recommendation),
			polishRecommendations: matrix.recommendations.map(
				(r) => r.polishRecommendation,
			),
		};
	}

	// Private helper methods
	private initializeInteractionDatabase(): void {
		// Initialize with known interactions
		// This would be populated from a comprehensive database

		// Example: Omega-3 and Warfarin interaction
		this.addInteraction("omega-3-epa-dha", "warfarin", {
			supplementA: "omega-3-epa-dha",
			supplementB: "warfarin",
			interactionType: "POTENTIATING",
			severity: "MODERATE",
			mechanism: "Additive anticoagulant effects",
			polishMechanism: "Addytywne działanie antykoagulacyjne",
			clinicalSignificance: "Increased bleeding risk",
			polishClinicalSignificance: "Zwiększone ryzyko krwawienia",
			recommendation: "Monitor INR more frequently, consider dose adjustment",
			polishRecommendation:
				"Częstsze monitorowanie INR, rozważyć dostosowanie dawki",
			evidenceLevel: "MODERATE",
			sources: [
				{
					type: "CLINICAL_STUDY",
					reference: "Clinical study on omega-3 and anticoagulants",
					quality: "MEDIUM",
					description: "Study showing increased bleeding risk",
					polishDescription: "Badanie wykazujące zwiększone ryzyko krwawienia",
				},
			],
			timing: {
				separationRequired: false,
				explanation: "No timing separation required, but monitoring needed",
				polishExplanation:
					"Nie wymaga rozdzielenia czasowego, ale potrzebne monitorowanie",
			},
			dosageImpact: {
				requiresDosageAdjustment: true,
				adjustmentType: "MONITOR",
				explanation:
					"May require omega-3 dose reduction or warfarin adjustment",
				polishExplanation:
					"Może wymagać redukcji dawki omega-3 lub dostosowania warfaryny",
			},
			monitoringRequirements: [
				{
					parameter: "INR",
					polishParameter: "INR",
					frequency: "Weekly initially, then monthly",
					polishFrequency: "Początkowo tygodniowo, potem miesięcznie",
					normalRange: "2.0-3.0",
					warningThreshold: ">3.5",
					actionRequired: "Reduce omega-3 dose or adjust warfarin",
					polishActionRequired:
						"Zmniejszyć dawkę omega-3 lub dostosować warfarynę",
				},
			],
		});
	}

	private addInteraction(
		supplementA: string,
		supplementB: string,
		interaction: InteractionPair,
	): void {
		const key = this.getInteractionKey(supplementA, supplementB);
		if (!this.interactionDatabase.has(key)) {
			this.interactionDatabase.set(key, []);
		}
		this.interactionDatabase.get(key)?.push(interaction);
	}

	private findInteraction(
		supplementA: string,
		supplementB: string,
	): InteractionPair | null {
		const key = this.getInteractionKey(supplementA, supplementB);
		const interactions = this.interactionDatabase.get(key);
		return interactions?.[0] || null;
	}

	private findMedicationInteraction(
		supplementId: string,
		medication: { name: string; activeIngredient: string },
	): MedicationInteraction | null {
		// This would check against a comprehensive medication interaction database
		// For now, return null as placeholder
		return null;
	}

	private getInteractionKey(supplementA: string, supplementB: string): string {
		return [supplementA, supplementB].sort().join("|");
	}

	private getSupplementInteractions(
		supplementId: string,
		allSupplements: string[],
	): InteractionPair[] {
		const interactions: InteractionPair[] = [];

		allSupplements.forEach((otherId) => {
			if (otherId !== supplementId) {
				const interaction = this.findInteraction(supplementId, otherId);
				if (interaction) {
					interactions.push(interaction);
				}
			}
		});

		return interactions;
	}

	private assessOverallRisk(interactions: InteractionPair[]): RiskAssessment {
		const contraindicated = interactions.filter(
			(i) => i.severity === "CONTRAINDICATED",
		).length;
		const major = interactions.filter((i) => i.severity === "MAJOR").length;
		const moderate = interactions.filter(
			(i) => i.severity === "MODERATE",
		).length;

		let overallRisk: RiskAssessment["overallRisk"];
		let polishOverallRisk: string;

		if (contraindicated > 0) {
			overallRisk = "VERY_HIGH";
			polishOverallRisk = "Bardzo wysokie";
		} else if (major > 2) {
			overallRisk = "HIGH";
			polishOverallRisk = "Wysokie";
		} else if (major > 0 || moderate > 3) {
			overallRisk = "MODERATE";
			polishOverallRisk = "Umiarkowane";
		} else {
			overallRisk = "LOW";
			polishOverallRisk = "Niskie";
		}

		return {
			overallRisk,
			polishOverallRisk,
			riskFactors: this.identifyRiskFactors(interactions),
			polishRiskFactors: this.identifyRiskFactors(interactions, true),
			mitigationStrategies: this.generateMitigationStrategies(interactions),
			polishMitigationStrategies: this.generateMitigationStrategies(
				interactions,
				true,
			),
			contraindications: interactions
				.filter((i) => i.severity === "CONTRAINDICATED")
				.map((i) => i.clinicalSignificance),
			polishContraindications: interactions
				.filter((i) => i.severity === "CONTRAINDICATED")
				.map((i) => i.polishClinicalSignificance),
		};
	}

	private generateRecommendations(
		interactions: InteractionPair[],
		supplementIds: string[],
	): InteractionRecommendation[] {
		const recommendations: InteractionRecommendation[] = [];

		// Generate timing recommendations
		const timingInteractions = interactions.filter(
			(i) => i.timing.separationRequired,
		);
		if (timingInteractions.length > 0) {
			recommendations.push({
				type: "TIMING",
				priority: "HIGH",
				recommendation:
					"Separate supplement intake by recommended time intervals",
				polishRecommendation:
					"Rozdzielić przyjmowanie suplementów o zalecane odstępy czasowe",
				rationale:
					"Prevents absorption interference and reduces interaction risk",
				polishRationale:
					"Zapobiega zakłóceniom wchłaniania i zmniejsza ryzyko interakcji",
				implementationSteps: [
					"Create a supplement schedule",
					"Set reminders for proper timing",
					"Monitor for any adverse effects",
				],
				polishImplementationSteps: [
					"Stwórz harmonogram suplementów",
					"Ustaw przypomnienia o właściwym czasie",
					"Monitoruj pod kątem działań niepożądanych",
				],
			});
		}

		// Generate monitoring recommendations
		const monitoringNeeded = interactions.some(
			(i) => i.monitoringRequirements.length > 0,
		);
		if (monitoringNeeded) {
			recommendations.push({
				type: "MONITORING",
				priority: "MEDIUM",
				recommendation:
					"Regular monitoring of relevant biomarkers is recommended",
				polishRecommendation:
					"Zalecane jest regularne monitorowanie odpowiednich biomarkerów",
				rationale: "Early detection of potential adverse effects",
				polishRationale:
					"Wczesne wykrywanie potencjalnych działań niepożądanych",
				implementationSteps: [
					"Schedule regular blood tests",
					"Track symptoms daily",
					"Consult healthcare provider regularly",
				],
				polishImplementationSteps: [
					"Zaplanuj regularne badania krwi",
					"Śledź objawy codziennie",
					"Regularnie konsultuj się z lekarzem",
				],
			});
		}

		return recommendations;
	}

	private calculateNodeRiskLevel(interactions: InteractionPair[]): number {
		if (interactions.length === 0) return 0;

		const severityWeights = {
			CONTRAINDICATED: 1.0,
			MAJOR: 0.8,
			MODERATE: 0.5,
			MINOR: 0.2,
			BENEFICIAL: -0.3,
		};

		const totalWeight = interactions.reduce((sum, interaction) => {
			return sum + (severityWeights[interaction.severity] || 0);
		}, 0);

		return Math.max(0, Math.min(1, totalWeight / interactions.length));
	}

	private getNodeColor(category: string): string {
		const colorMap: Record<string, string> = {
			NOOTROPIC: "#8B5CF6",
			FATTY_ACID: "#10B981",
			MINERAL: "#F59E0B",
			VITAMIN: "#EF4444",
			HERB: "#84CC16",
			AMINO_ACID: "#06B6D4",
		};
		return colorMap[category] || "#6B7280";
	}

	private getInteractionWeight(interaction: InteractionPair): number {
		const weights = {
			CONTRAINDICATED: 1.0,
			MAJOR: 0.8,
			MODERATE: 0.6,
			MINOR: 0.3,
			BENEFICIAL: 0.5,
		};
		return weights[interaction.severity] || 0.1;
	}

	private getInteractionColor(severity: InteractionSeverity): string {
		const colors = {
			CONTRAINDICATED: "#DC2626",
			MAJOR: "#EA580C",
			MODERATE: "#D97706",
			MINOR: "#65A30D",
			BENEFICIAL: "#059669",
		};
		return colors[severity] || "#6B7280";
	}

	private getInteractionThickness(severity: InteractionSeverity): number {
		const thickness = {
			CONTRAINDICATED: 6,
			MAJOR: 4,
			MODERATE: 3,
			MINOR: 2,
			BENEFICIAL: 2,
		};
		return thickness[severity] || 1;
	}

	private translateInteractionType(type: InteractionType): string {
		const translations = {
			SYNERGISTIC: "Synergiczny",
			ADDITIVE: "Addytywny",
			ANTAGONISTIC: "Antagonistyczny",
			COMPETITIVE: "Konkurencyjny",
			POTENTIATING: "Potencjujący",
			INHIBITORY: "Hamujący",
			NEUTRAL: "Neutralny",
			UNKNOWN: "Nieznany",
		};
		return translations[type] || type;
	}

	private generateClusters(
		nodes: InteractionNode[],
		edges: InteractionEdge[],
	): InteractionCluster[] {
		// Simplified clustering algorithm
		// In production, this would use more sophisticated graph clustering
		return [];
	}

	private identifyRiskFactors(
		interactions: InteractionPair[],
		polish = false,
	): string[] {
		const factors: string[] = [];

		const highSeverityCount = interactions.filter(
			(i) => i.severity === "MAJOR" || i.severity === "CONTRAINDICATED",
		).length;

		if (highSeverityCount > 0) {
			factors.push(
				polish
					? `${highSeverityCount} interakcji wysokiego ryzyka`
					: `${highSeverityCount} high-risk interactions`,
			);
		}

		return factors;
	}

	private generateMitigationStrategies(
		interactions: InteractionPair[],
		polish = false,
	): string[] {
		const strategies: string[] = [];

		if (interactions.some((i) => i.timing.separationRequired)) {
			strategies.push(
				polish
					? "Rozdzielenie czasowe przyjmowania suplementów"
					: "Time separation of supplement intake",
			);
		}

		if (interactions.some((i) => i.dosageImpact.requiresDosageAdjustment)) {
			strategies.push(
				polish
					? "Dostosowanie dawek suplementów"
					: "Supplement dose adjustments",
			);
		}

		return strategies;
	}
}

// Export singleton instance
export const supplementInteractionService = new SupplementInteractionService();
