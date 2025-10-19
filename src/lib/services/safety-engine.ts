/**
 * Safety Engine for Dosage Calculator
 * Comprehensive contraindication and interaction analysis system
 */

import type {
	DosageCalculationInput,
	InteractionAnalysis,
	SafetyAlert,
	SupplementInput,
	UserProfile,
} from "@/types/dosage-calculator";
import type { SupplementWithRelations } from "@/types/supplement";

export class SafetyEngine {
	/**
	 * Analyze safety for a complete dosage calculation
	 */
	async analyzeSafety(
		input: DosageCalculationInput,
		supplementData: Map<string, SupplementWithRelations>,
	): Promise<{
		safetyAlerts: SafetyAlert[];
		interactionAnalysis: InteractionAnalysis[];
		overallRisk: "low" | "medium" | "high";
		warnings: string[];
		polishWarnings: string[];
	}> {
		const { userProfile, supplements } = input;

		// Get supplement data for all inputs
		const supplementsList = supplements
			.map((suppInput) => supplementData.get(suppInput.supplementId))
			.filter(Boolean) as SupplementWithRelations[];

		// Analyze contraindications
		const contraindicationAlerts = await this.analyzeContraindications(
			userProfile,
			supplementsList,
		);

		// Analyze interactions between supplements
		const interactionAnalysis =
			await this.analyzeSupplementInteractions(supplementsList);

		// Analyze medication interactions
		const medicationAlerts = await this.analyzeMedicationInteractions(
			userProfile,
			supplementsList,
		);

		// Analyze allergy risks
		const allergyAlerts = await this.analyzeAllergyRisks(
			userProfile,
			supplementsList,
		);

		// Combine all safety alerts
		const allSafetyAlerts = [
			...contraindicationAlerts,
			...medicationAlerts,
			...allergyAlerts,
		];

		// Generate warnings
		const { warnings, polishWarnings } = this.generateWarnings(
			allSafetyAlerts,
			interactionAnalysis,
		);

		// Calculate overall risk
		const overallRisk = this.calculateOverallRisk(
			allSafetyAlerts,
			interactionAnalysis,
		);

		return {
			safetyAlerts: allSafetyAlerts,
			interactionAnalysis,
			overallRisk,
			warnings,
			polishWarnings,
		};
	}

	/**
	 * Analyze contraindications based on user profile
	 */
	private async analyzeContraindications(
		userProfile: UserProfile,
		supplements: SupplementWithRelations[],
	): Promise<SafetyAlert[]> {
		const alerts: SafetyAlert[] = [];

		for (const supplement of supplements) {
			const { dosageGuidelines } = supplement;

			// Check pregnancy contraindications
			if (userProfile.pregnant) {
				const pregnancyContraindications =
					dosageGuidelines.contraindications.filter(
						(contraindication) =>
							contraindication.toLowerCase().includes("pregnancy") ||
							contraindication.toLowerCase().includes("ciąża"),
					);

				for (const contraindication of pregnancyContraindications) {
					alerts.push({
						type: "contraindication",
						severity: "high",
						message: `Contraindicated during pregnancy: ${supplement.name}`,
						polishMessage: `Przeciwwskazane w czasie ciąży: ${supplement.polishName}`,
						supplements: [supplement.id],
						recommendation:
							"Avoid use during pregnancy or consult healthcare provider",
						polishRecommendation:
							"Unikaj stosowania w czasie ciąży lub skonsultuj się z lekarzem",
						evidenceLevel: "STRONG",
					});
				}
			}

			// Check breastfeeding contraindications
			if (userProfile.breastfeeding) {
				const breastfeedingContraindications =
					dosageGuidelines.contraindications.filter(
						(contraindication) =>
							contraindication.toLowerCase().includes("breastfeeding") ||
							contraindication.toLowerCase().includes("karmienie piersią"),
					);

				for (const contraindication of breastfeedingContraindications) {
					alerts.push({
						type: "contraindication",
						severity: "medium",
						message: `Use with caution while breastfeeding: ${supplement.name}`,
						polishMessage: `Stosuj ostrożnie podczas karmienia piersią: ${supplement.polishName}`,
						supplements: [supplement.id],
						recommendation:
							"Monitor infant for adverse effects or consult healthcare provider",
						polishRecommendation:
							"Obserwuj dziecko pod kątem działań niepożądanych lub skonsultuj się z lekarzem",
						evidenceLevel: "MODERATE",
					});
				}
			}

			// Check age-related contraindications
			const ageContraindications = dosageGuidelines.contraindications.filter(
				(contraindication) => {
					const contraindicationLower = contraindication.toLowerCase();
					return (
						(userProfile.age < 18 &&
							contraindicationLower.includes("children")) ||
						(userProfile.age < 18 &&
							contraindicationLower.includes("dzieci")) ||
						(userProfile.age > 65 &&
							contraindicationLower.includes("elderly")) ||
						(userProfile.age > 65 &&
							contraindicationLower.includes("osoby starsze"))
					);
				},
			);

			for (const contraindication of ageContraindications) {
				alerts.push({
					type: "contraindication",
					severity: "medium",
					message: `Age-related contraindication: ${supplement.name}`,
					polishMessage: `Przeciwwskazanie związane z wiekiem: ${supplement.polishName}`,
					supplements: [supplement.id],
					recommendation: "Not recommended for your age group",
					polishRecommendation: "Nie zalecane dla Twojej grupy wiekowej",
					evidenceLevel: "MODERATE",
				});
			}

			// Check health condition contraindications
			for (const condition of userProfile.healthConditions) {
				const conditionContraindications =
					dosageGuidelines.contraindications.filter((contraindication) =>
						contraindication.toLowerCase().includes(condition.toLowerCase()),
					);

				for (const contraindication of conditionContraindications) {
					alerts.push({
						type: "contraindication",
						severity: "high",
						message: `Contraindicated for your health condition: ${supplement.name}`,
						polishMessage: `Przeciwwskazane przy Twoim stanie zdrowia: ${supplement.polishName}`,
						supplements: [supplement.id],
						recommendation: "Avoid use or consult healthcare provider",
						polishRecommendation:
							"Unikaj stosowania lub skonsultuj się z lekarzem",
						evidenceLevel: "STRONG",
					});
				}
			}
		}

		return alerts;
	}

	/**
	 * Analyze interactions between supplements
	 */
	private async analyzeSupplementInteractions(
		supplements: SupplementWithRelations[],
	): Promise<InteractionAnalysis[]> {
		const interactions: InteractionAnalysis[] = [];

		// Check each pair of supplements
		for (let i = 0; i < supplements.length; i++) {
			for (let j = i + 1; j < supplements.length; j++) {
				const supplement1 = supplements[i]!;
				const supplement2 = supplements[j]!;

				// Check interactions from supplement1's data
				const relevantInteractions = supplement1.interactions.filter(
					(interaction) =>
						interaction.substance
							?.toLowerCase()
							.includes(supplement2.name.toLowerCase()) ||
						interaction.polishSubstance
							?.toLowerCase()
							.includes(supplement2.polishName.toLowerCase()),
				);

				for (const interaction of relevantInteractions) {
					interactions.push({
						supplement1: supplement1.id,
						supplement2: supplement2.id,
						interactionType: interaction.type,
						severity: interaction.severity,
						mechanism: interaction.mechanism || "Unknown mechanism",
						polishMechanism:
							interaction.polishMechanism || "Nieznany mechanizm",
						clinicalSignificance: interaction.clinicalSignificance,
						polishClinicalSignificance: interaction.polishClinicalSignificance,
						dosageAdjustment:
							this.getDosageAdjustmentForInteraction(interaction),
						timingAdjustment:
							this.getTimingAdjustmentForInteraction(interaction),
						polishTimingAdjustment:
							this.getPolishTimingAdjustmentForInteraction(interaction),
					});
				}

				// Check interactions from supplement2's data (reverse lookup)
				const reverseInteractions = supplement2.interactions.filter(
					(interaction) =>
						interaction.substance
							?.toLowerCase()
							.includes(supplement1.name.toLowerCase()) ||
						interaction.polishSubstance
							?.toLowerCase()
							.includes(supplement1.polishName.toLowerCase()),
				);

				for (const interaction of reverseInteractions) {
					interactions.push({
						supplement1: supplement2.id,
						supplement2: supplement1.id,
						interactionType: interaction.type,
						severity: interaction.severity,
						mechanism: interaction.mechanism || "Unknown mechanism",
						polishMechanism:
							interaction.polishMechanism || "Nieznany mechanizm",
						clinicalSignificance: interaction.clinicalSignificance,
						polishClinicalSignificance: interaction.polishClinicalSignificance,
						dosageAdjustment:
							this.getDosageAdjustmentForInteraction(interaction),
						timingAdjustment:
							this.getTimingAdjustmentForInteraction(interaction),
						polishTimingAdjustment:
							this.getPolishTimingAdjustmentForInteraction(interaction),
					});
				}
			}
		}

		return interactions;
	}

	/**
	 * Analyze interactions with current medications
	 */
	private async analyzeMedicationInteractions(
		userProfile: UserProfile,
		supplements: SupplementWithRelations[],
	): Promise<SafetyAlert[]> {
		const alerts: SafetyAlert[] = [];

		if (!userProfile.currentMedications.length) {
			return alerts;
		}

		for (const supplement of supplements) {
			for (const medication of userProfile.currentMedications) {
				// Check for known medication interactions
				const medicationInteractions = supplement.interactions.filter(
					(interaction) =>
						interaction.substance
							?.toLowerCase()
							.includes(medication.toLowerCase()) ||
						interaction.polishSubstance
							?.toLowerCase()
							.includes(medication.toLowerCase()),
				);

				for (const interaction of medicationInteractions) {
					alerts.push({
						type: "interaction",
						severity:
							interaction.severity === "severe"
								? "high"
								: interaction.severity === "moderate"
									? "medium"
									: "low",
						message: `Potential interaction with medication ${medication}: ${supplement.name}`,
						polishMessage: `Potencjalna interakcja z lekiem ${medication}: ${supplement.polishName}`,
						supplements: [supplement.id],
						recommendation:
							interaction.recommendation ||
							"Consult healthcare provider before use",
						polishRecommendation:
							interaction.polishRecommendation ||
							"Skonsultuj się z lekarzem przed użyciem",
						evidenceLevel:
							this.mapEvidenceLevel(interaction.evidenceLevel) || "MODERATE",
					});
				}
			}
		}

		return alerts;
	}

	/**
	 * Analyze allergy risks
	 */
	private async analyzeAllergyRisks(
		userProfile: UserProfile,
		supplements: SupplementWithRelations[],
	): Promise<SafetyAlert[]> {
		const alerts: SafetyAlert[] = [];

		if (!userProfile.allergies.length) {
			return alerts;
		}

		for (const supplement of supplements) {
			// Check supplement name and common names against allergies
			const supplementText = [
				supplement.name,
				supplement.scientificName,
				...supplement.commonNames,
				supplement.polishName,
				...supplement.polishCommonNames,
			]
				.join(" ")
				.toLowerCase();

			for (const allergy of userProfile.allergies) {
				if (supplementText.includes(allergy.toLowerCase())) {
					alerts.push({
						type: "side_effect_risk",
						severity: "critical",
						message: `Potential allergic reaction risk: ${supplement.name}`,
						polishMessage: `Ryzyko reakcji alergicznej: ${supplement.polishName}`,
						supplements: [supplement.id],
						recommendation: "Avoid use due to allergy risk",
						polishRecommendation:
							"Unikaj stosowania ze względu na ryzyko alergii",
						evidenceLevel: "STRONG",
					});
				}
			}

			// Check active compounds against allergies
			for (const compound of supplement.activeCompounds) {
				const compoundText = [compound.name, compound.polishName]
					.join(" ")
					.toLowerCase();

				for (const allergy of userProfile.allergies) {
					if (compoundText.includes(allergy.toLowerCase())) {
						alerts.push({
							type: "side_effect_risk",
							severity: "critical",
							message: `Potential allergic reaction to active compound: ${compound.name}`,
							polishMessage: `Ryzyko reakcji alergicznej na związek czynny: ${compound.polishName || compound.name}`,
							supplements: [supplement.id],
							recommendation: "Avoid use due to allergy risk",
							polishRecommendation:
								"Unikaj stosowania ze względu na ryzyko alergii",
							evidenceLevel: "STRONG",
						});
					}
				}
			}
		}

		return alerts;
	}

	/**
	 * Get dosage adjustment recommendation for interaction
	 */
	private getDosageAdjustmentForInteraction(
		interaction: any,
	): number | undefined {
		if (interaction.type === "antagonistic") {
			return 1.2; // Increase dose to compensate
		}
		if (interaction.type === "synergistic") {
			return 0.8; // Decrease dose due to synergy
		}
		return undefined;
	}

	/**
	 * Get timing adjustment recommendation for interaction
	 */
	private getTimingAdjustmentForInteraction(
		interaction: any,
	): string | undefined {
		if (interaction.type === "competitive") {
			return "Take supplements at least 2 hours apart";
		}
		if (interaction.type === "synergistic") {
			return "Take together for enhanced effect";
		}
		return undefined;
	}

	/**
	 * Get Polish timing adjustment recommendation
	 */
	private getPolishTimingAdjustmentForInteraction(
		interaction: any,
	): string | undefined {
		if (interaction.type === "competitive") {
			return "Przyjmuj suplementy w odstępie co najmniej 2 godzin";
		}
		if (interaction.type === "synergistic") {
			return "Przyjmuj razem dla zwiększonego efektu";
		}
		return undefined;
	}

	/**
	 * Generate human-readable warnings
	 */
	private generateWarnings(
		safetyAlerts: SafetyAlert[],
		interactionAnalysis: InteractionAnalysis[],
	): { warnings: string[]; polishWarnings: string[] } {
		const warnings: string[] = [];
		const polishWarnings: string[] = [];

		// High severity alerts
		const highSeverityAlerts = safetyAlerts.filter(
			(alert) => alert.severity === "high",
		);
		if (highSeverityAlerts.length > 0) {
			warnings.push(
				`${highSeverityAlerts.length} high-risk safety concern(s) identified`,
			);
			polishWarnings.push(
				`${highSeverityAlerts.length} wysokiego ryzyka obaw dotyczących bezpieczeństwa`,
			);
		}

		// Critical severity alerts
		const criticalAlerts = safetyAlerts.filter(
			(alert) => alert.severity === "critical",
		);
		if (criticalAlerts.length > 0) {
			warnings.push(
				`${criticalAlerts.length} critical safety concern(s) - immediate attention required`,
			);
			polishWarnings.push(
				`${criticalAlerts.length} krytycznych obaw dotyczących bezpieczeństwa - wymagana natychmiastowa uwaga`,
			);
		}

		// Interaction warnings
		const severeInteractions = interactionAnalysis.filter(
			(interaction) => interaction.severity === "severe",
		);
		if (severeInteractions.length > 0) {
			warnings.push(
				`${severeInteractions.length} severe supplement interaction(s) detected`,
			);
			polishWarnings.push(
				`${severeInteractions.length} ciężkich interakcji między suplementami wykrytych`,
			);
		}

		return { warnings, polishWarnings };
	}

	/**
	 * Calculate overall risk level
	 */
	private calculateOverallRisk(
		safetyAlerts: SafetyAlert[],
		interactionAnalysis: InteractionAnalysis[],
	): "low" | "medium" | "high" {
		const hasCritical = safetyAlerts.some(
			(alert) => alert.severity === "critical",
		);
		const hasHigh = safetyAlerts.some((alert) => alert.severity === "high");
		const hasSevereInteractions = interactionAnalysis.some(
			(interaction) => interaction.severity === "severe",
		);

		if (hasCritical || (hasHigh && hasSevereInteractions)) {
			return "high";
		}
		if (hasHigh || hasSevereInteractions || safetyAlerts.length > 2) {
			return "medium";
		}
		return "low";
	}

	/**
	 * Get specific safety recommendations for a supplement
	 */
	getSupplementSafetyProfile(
		supplement: SupplementWithRelations,
		userProfile: UserProfile,
	): {
		isSafe: boolean;
		riskLevel: "low" | "medium" | "high";
		concerns: string[];
		polishConcerns: string[];
		recommendations: string[];
		polishRecommendations: string[];
	} {
		const concerns: string[] = [];
		const polishConcerns: string[] = [];
		const recommendations: string[] = [];
		const polishRecommendations: string[] = [];

		// Check contraindications
		if (userProfile.pregnant) {
			const pregnancyContraindications =
				supplement.dosageGuidelines.contraindications.filter(
					(c) =>
						c.toLowerCase().includes("pregnancy") ||
						c.toLowerCase().includes("ciąża"),
				);
			if (pregnancyContraindications.length > 0) {
				concerns.push("Contraindicated during pregnancy");
				polishConcerns.push("Przeciwwskazane w czasie ciąży");
				recommendations.push("Avoid use during pregnancy");
				polishRecommendations.push("Unikaj stosowania w czasie ciąży");
			}
		}

		// Check age contraindications
		if (userProfile.age < 18 || userProfile.age > 65) {
			concerns.push("Age-related safety concerns");
			polishConcerns.push("Obawy dotyczące bezpieczeństwa związane z wiekiem");
			recommendations.push("Consult healthcare provider");
			polishRecommendations.push("Skonsultuj się z lekarzem");
		}

		// Check side effects
		const severeSideEffects = supplement.sideEffects.filter(
			(effect) => effect.severity === "severe",
		);
		if (severeSideEffects.length > 0) {
			concerns.push("May cause severe side effects");
			polishConcerns.push("Może powodować ciężkie działania niepożądane");
			recommendations.push("Monitor for side effects closely");
			polishRecommendations.push("Dokładnie obserwuj działania niepożądane");
		}

		// Determine overall safety
		const isSafe = concerns.length === 0;
		const riskLevel =
			concerns.length > 2 ? "high" : concerns.length > 0 ? "medium" : "low";

		return {
			isSafe,
			riskLevel,
			concerns,
			polishConcerns,
			recommendations,
			polishRecommendations,
		};
	}

	/**
	 * Map evidence level from supplement type to safety alert type
	 */
	private mapEvidenceLevel(
		evidenceLevel?: string,
	): "STRONG" | "MODERATE" | "WEAK" | undefined {
		if (!evidenceLevel) return "MODERATE";

		switch (evidenceLevel) {
			case "STRONG":
			case "MODERATE":
			case "WEAK":
				return evidenceLevel;
			default:
				return "WEAK";
		}
	}
}
