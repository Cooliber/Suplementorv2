/**
 * Enhanced Dosage Calculation Engine
 * Pharmacokinetic-based multi-factor dosage calculation system
 */

import {
	ACTIVITY_LEVEL_ADJUSTMENTS,
	AGE_ADJUSTMENTS,
	type CalculationProgress,
	type DosageAdjustment,
	type DosageCalculationInput,
	type DosageRecommendation,
	PHARMACOKINETIC_CONSTANTS,
	type PharmacokineticFactors,
	type SupplementInput,
	type UserProfile,
} from "@/types/dosage-calculator";
import type { SupplementWithRelations } from "@/types/supplement";

export class DosageCalculationEngine {
	private progressCallback?: (progress: CalculationProgress) => void;

	constructor(progressCallback?: (progress: CalculationProgress) => void) {
		this.progressCallback = progressCallback;
	}

	/**
	 * Main calculation method
	 */
	async calculateDosage(input: DosageCalculationInput): Promise<{
		recommendations: DosageRecommendation[];
		adjustments: DosageAdjustment[];
		confidence: number;
	}> {
		this.updateProgress(
			"Rozpoczęcie analizy farmakokinetycznej",
			"Starting pharmacokinetic analysis",
			10,
		);

		const { userProfile, supplements } = input;

		// Calculate base pharmacokinetic factors for user
		const userPharmacokinetics =
			this.calculateUserPharmacokinetics(userProfile);

		this.updateProgress("Analiza suplementów", "Analyzing supplements", 30);

		// Process each supplement
		const recommendations: DosageRecommendation[] = [];
		const allAdjustments: DosageAdjustment[] = [];

		for (let i = 0; i < supplements.length; i++) {
			const supplementInput = supplements[i]!;
			const supplement = await this.getSupplementData(
				supplementInput.supplementId,
			);

			if (!supplement) {
				throw new Error(
					`Supplement not found: ${supplementInput.supplementId}`,
				);
			}

			this.updateProgress(
				`Obliczanie dawki dla ${supplement.name}`,
				`Calculating dosage for ${supplement.name}`,
				30 + (i / supplements.length) * 40,
			);

			const recommendation = await this.calculateSupplementDosage(
				supplement,
				supplementInput,
				userProfile,
				userPharmacokinetics,
			);

			recommendations.push(recommendation);
			allAdjustments.push(...recommendation.adjustments);
		}

		this.updateProgress("Finalizacja obliczeń", "Finalizing calculations", 90);

		// Calculate overall confidence based on evidence levels and adjustments
		const confidence = this.calculateOverallConfidence(
			recommendations,
			allAdjustments,
		);

		this.updateProgress("Obliczenia zakończone", "Calculations completed", 100);

		return {
			recommendations,
			adjustments: allAdjustments,
			confidence,
		};
	}

	/**
	 * Calculate user-specific pharmacokinetic factors
	 */
	private calculateUserPharmacokinetics(userProfile: UserProfile) {
		const { age, weight, height, gender, activityLevel } = userProfile;

		// Calculate Body Surface Area (Mosteller formula)
		const bsa = Math.sqrt((height * weight) / 3600);

		// Calculate BMI
		const heightM = height / 100;
		const bmi = weight / (heightM * heightM);

		// Estimate creatinine clearance (Cockcroft-Gault formula)
		const creatinineClearance = this.calculateCreatinineClearance(
			userProfile,
			weight,
		);

		// Estimate liver function based on age and other factors
		const liverFunction = this.estimateLiverFunction(userProfile);

		// Calculate age-related adjustments
		const ageAdjustment = this.getAgeAdjustment(age);

		// Calculate activity level adjustments
		const activityAdjustment = ACTIVITY_LEVEL_ADJUSTMENTS[activityLevel];

		return {
			bsa,
			bmi,
			creatinineClearance,
			liverFunction,
			ageAdjustment,
			activityAdjustment,
			gender,
		};
	}

	/**
	 * Calculate creatinine clearance using Cockcroft-Gault formula
	 */
	private calculateCreatinineClearance(
		userProfile: UserProfile,
		weight: number,
	): number {
		const { age, gender } = userProfile;

		// Cockcroft-Gault formula (assuming normal serum creatinine of 1.0 mg/dL)
		const genderConstant =
			gender === "male"
				? PHARMACOKINETIC_CONSTANTS.CREATININE_CLEARANCE_COCKCROFT.MALE_CONSTANT
				: PHARMACOKINETIC_CONSTANTS.CREATININE_CLEARANCE_COCKCROFT
						.FEMALE_CONSTANT;

		return ((140 - age) * weight * genderConstant) / (72 * 1.0); // Assuming normal creatinine
	}

	/**
	 * Estimate liver function based on user profile
	 */
	private estimateLiverFunction(userProfile: UserProfile): {
		capacity: number; // 0-1 scale
		enzymeActivity: number; // 0-1 scale
	} {
		const { age, healthConditions } = userProfile;

		let capacity = 1.0;
		let enzymeActivity = 1.0;

		// Age-related liver function decline
		if (age > 65) {
			capacity *= 0.8;
			enzymeActivity *= 0.85;
		} else if (age > 40) {
			capacity *= 0.95;
			enzymeActivity *= 0.95;
		}

		// Health condition impacts
		if (
			healthConditions.some(
				(condition) =>
					condition.toLowerCase().includes("liver") ||
					condition.toLowerCase().includes("wątroba"),
			)
		) {
			capacity *= 0.6;
			enzymeActivity *= 0.5;
		}

		if (
			healthConditions.some(
				(condition) =>
					condition.toLowerCase().includes("cirrhosis") ||
					condition.toLowerCase().includes("marskość"),
			)
		) {
			capacity *= 0.3;
			enzymeActivity *= 0.2;
		}

		return { capacity, enzymeActivity };
	}

	/**
	 * Get age-based adjustment factors
	 */
	private getAgeAdjustment(age: number): {
		multiplier: number;
		category: string;
	} {
		if (age < 18) {
			return {
				multiplier: AGE_ADJUSTMENTS.CHILDREN.multiplier,
				category: "children",
			};
		}
		if (age > 65) {
			return {
				multiplier: AGE_ADJUSTMENTS.ELDERLY.multiplier,
				category: "elderly",
			};
		}
		return {
			multiplier: AGE_ADJUSTMENTS.ADULT.multiplier,
			category: "adult",
		};
	}

	/**
	 * Calculate dosage for a specific supplement
	 */
	private async calculateSupplementDosage(
		supplement: SupplementWithRelations,
		supplementInput: SupplementInput,
		userProfile: UserProfile,
		userPharmacokinetics: any,
	): Promise<DosageRecommendation> {
		const { dosageGuidelines } = supplement;
		const { desiredEffect, customDosage } = supplementInput;

		// Start with base therapeutic range
		let baseMin = dosageGuidelines.therapeuticRange.min;
		let baseMax = dosageGuidelines.therapeuticRange.max;

		// Apply custom dosage if provided
		if (customDosage) {
			baseMin = customDosage * 0.8; // ±20% range for custom dosage
			baseMax = customDosage * 1.2;
		}

		// Apply pharmacokinetic factors
		const pharmacokineticFactors =
			this.extractPharmacokineticFactors(supplement);

		// Calculate adjustments based on user profile
		const adjustments = this.calculateDosageAdjustments(
			supplement,
			userProfile,
			userPharmacokinetics,
			pharmacokineticFactors,
		);

		// Apply adjustments to base dosage
		let adjustedMin = baseMin;
		let adjustedMax = baseMax;

		for (const adjustment of adjustments) {
			adjustedMin *= adjustment.adjustment;
			adjustedMax *= adjustment.adjustment;
		}

		// Ensure adjusted dosages stay within safe bounds
		adjustedMin = Math.max(adjustedMin, baseMin * 0.1); // No less than 10% of base
		adjustedMax = Math.min(adjustedMax, baseMax * 3.0); // No more than 3x base

		// Calculate confidence based on evidence and adjustments
		const confidence = this.calculateRecommendationConfidence(
			supplement,
			adjustments,
			pharmacokineticFactors,
		);

		return {
			supplementId: supplement.id,
			supplementName: supplement.name,
			polishSupplementName: supplement.polishName,
			recommendedDosage: {
				min: Math.round(adjustedMin * 100) / 100,
				max: Math.round(adjustedMax * 100) / 100,
				unit: dosageGuidelines.therapeuticRange.unit,
			},
			confidence,
			timing: supplementInput.timingPreference || dosageGuidelines.timing,
			withFood: supplementInput.withFood ?? dosageGuidelines.withFood,
			duration: this.getRecommendedDuration(supplement, desiredEffect),
			adjustments,
			pharmacokineticFactors,
		};
	}

	/**
	 * Extract pharmacokinetic factors from supplement data
	 */
	private extractPharmacokineticFactors(
		supplement: SupplementWithRelations,
	): PharmacokineticFactors {
		const activeCompounds = supplement.activeCompounds || [];

		// Use the first active compound with pharmacokinetic data, or defaults
		const primaryCompound =
			activeCompounds.find(
				(compound) => compound.bioavailability || compound.halfLife,
			) || activeCompounds[0];

		return {
			bioavailability: primaryCompound?.bioavailability || 50,
			halfLife: this.parseHalfLife(primaryCompound?.halfLife) || 8,
			absorptionRate: 1.0, // Default normalized rate
			eliminationRate: 1.0, // Default normalized rate
			volumeOfDistribution: 1.0, // Default L/kg
			proteinBinding: 50, // Default percentage
			firstPassMetabolism: 30, // Default percentage
		};
	}

	/**
	 * Parse half-life string to hours
	 */
	private parseHalfLife(halfLifeString?: string): number {
		if (!halfLifeString) return 8;

		// Handle various formats like "6-8 hours", "4h", "12-24h"
		const match = halfLifeString.match(/(\d+)(?:-(\d+))?\s*(h|hours?|godzin)/i);
		if (match) {
			const min = Number.parseInt(match[1]!);
			const max = match[2] ? Number.parseInt(match[2]) : min;
			return (min + max) / 2;
		}

		return 8; // Default 8 hours
	}

	/**
	 * Calculate dosage adjustments based on user profile and supplement properties
	 */
	private calculateDosageAdjustments(
		supplement: SupplementWithRelations,
		userProfile: UserProfile,
		userPharmacokinetics: any,
		pharmacokineticFactors: PharmacokineticFactors,
	): DosageAdjustment[] {
		const adjustments: DosageAdjustment[] = [];

		// Age adjustment
		if (userPharmacokinetics.ageAdjustment.multiplier !== 1.0) {
			adjustments.push({
				factor: "age",
				adjustment: userPharmacokinetics.ageAdjustment.multiplier,
				reason: `Age-related adjustment for ${userPharmacokinetics.ageAdjustment.category}`,
				polishReason: `Korekta związana z wiekiem dla ${userPharmacokinetics.ageAdjustment.category}`,
				evidenceLevel: "MODERATE",
			});
		}

		// Gender adjustment
		if (userProfile.gender !== "other") {
			const genderMultiplier = userProfile.gender === "female" ? 0.9 : 1.0;
			if (genderMultiplier !== 1.0) {
				adjustments.push({
					factor: "gender",
					adjustment: genderMultiplier,
					reason: `Gender-based adjustment for ${userProfile.gender}`,
					polishReason: `Korekta związana z płcią dla ${userProfile.gender === "female" ? "kobiet" : "mężczyzn"}`,
					evidenceLevel: "MODERATE",
				});
			}
		}

		// Pregnancy adjustment
		if (userProfile.pregnant) {
			adjustments.push({
				factor: "pregnancy",
				adjustment: 0.8,
				reason: "Conservative dosing during pregnancy",
				polishReason: "Ostrożne dawkowanie w czasie ciąży",
				evidenceLevel: "STRONG",
			});
		}

		// Breastfeeding adjustment
		if (userProfile.breastfeeding) {
			adjustments.push({
				factor: "breastfeeding",
				adjustment: 0.9,
				reason: "Adjustment for breastfeeding mothers",
				polishReason: "Korekta dla matek karmiących piersią",
				evidenceLevel: "MODERATE",
			});
		}

		// Activity level adjustment
		if (userPharmacokinetics.activityAdjustment !== 1.0) {
			adjustments.push({
				factor: "activity_level",
				adjustment: userPharmacokinetics.activityAdjustment,
				reason: `Activity level adjustment: ${userProfile.activityLevel}`,
				polishReason: `Korekta związana z poziomem aktywności: ${userProfile.activityLevel}`,
				evidenceLevel: "WEAK",
			});
		}

		// Liver function adjustment
		if (userPharmacokinetics.liverFunction.capacity < 0.8) {
			const liverMultiplier =
				0.5 + userPharmacokinetics.liverFunction.capacity * 0.5;
			adjustments.push({
				factor: "liver_function",
				adjustment: liverMultiplier,
				reason: "Reduced liver function requires dose adjustment",
				polishReason: "Zmniejszona funkcja wątroby wymaga korekty dawki",
				evidenceLevel: "STRONG",
			});
		}

		// Kidney function adjustment
		if (userPharmacokinetics.creatinineClearance < 60) {
			const kidneyMultiplier =
				userPharmacokinetics.creatinineClearance < 30 ? 0.5 : 0.75;
			adjustments.push({
				factor: "kidney_function",
				adjustment: kidneyMultiplier,
				reason: "Reduced kidney function requires dose adjustment",
				polishReason: "Zmniejszona funkcja nerek wymaga korekty dawki",
				evidenceLevel: "STRONG",
			});
		}

		// Health condition adjustments
		for (const condition of userProfile.healthConditions) {
			const conditionAdjustment = this.getConditionAdjustment(
				condition,
				supplement,
			);
			if (conditionAdjustment) {
				adjustments.push(conditionAdjustment);
			}
		}

		return adjustments;
	}

	/**
	 * Get adjustment for specific health conditions
	 */
	private getConditionAdjustment(
		condition: string,
		supplement: SupplementWithRelations,
	): DosageAdjustment | null {
		const conditionLower = condition.toLowerCase();

		// Check supplement contraindications
		const hasContraindication =
			supplement.dosageGuidelines.contraindications.some((contraindication) =>
				conditionLower.includes(contraindication.toLowerCase()),
			);

		if (hasContraindication) {
			return {
				factor: "health_condition",
				adjustment: 0.5,
				reason: `Contraindication: ${condition}`,
				polishReason: `Przeciwwskazanie: ${condition}`,
				evidenceLevel: "STRONG",
			};
		}

		// Condition-specific adjustments
		if (
			conditionLower.includes("diabetes") ||
			conditionLower.includes("cukrzyca")
		) {
			return {
				factor: "health_condition",
				adjustment: 0.9,
				reason: "Diabetes-related adjustment",
				polishReason: "Korekta związana z cukrzycą",
				evidenceLevel: "MODERATE",
			};
		}

		if (
			conditionLower.includes("hypertension") ||
			conditionLower.includes("nadciśnienie")
		) {
			return {
				factor: "health_condition",
				adjustment: 0.85,
				reason: "Hypertension-related adjustment",
				polishReason: "Korekta związana z nadciśnieniem",
				evidenceLevel: "MODERATE",
			};
		}

		return null;
	}

	/**
	 * Calculate confidence score for recommendation
	 */
	private calculateRecommendationConfidence(
		supplement: SupplementWithRelations,
		adjustments: DosageAdjustment[],
		pharmacokineticFactors: PharmacokineticFactors,
	): number {
		let confidence = 0.5; // Base confidence

		// Evidence level contribution
		switch (supplement.evidenceLevel) {
			case "STRONG":
				confidence += 0.3;
				break;
			case "MODERATE":
				confidence += 0.2;
				break;
			case "WEAK":
				confidence += 0.1;
				break;
			default:
				confidence += 0.05;
		}

		// Pharmacokinetic data quality
		if (pharmacokineticFactors.bioavailability > 0) confidence += 0.1;
		if (pharmacokineticFactors.halfLife > 0) confidence += 0.1;

		// Adjustment confidence penalty
		const strongAdjustments = adjustments.filter(
			(adj) => adj.evidenceLevel === "STRONG",
		).length;
		const moderateAdjustments = adjustments.filter(
			(adj) => adj.evidenceLevel === "MODERATE",
		).length;
		const weakAdjustments = adjustments.filter(
			(adj) => adj.evidenceLevel === "WEAK",
		).length;

		confidence += strongAdjustments * 0.05;
		confidence += moderateAdjustments * 0.03;
		confidence -= weakAdjustments * 0.02;

		return Math.max(0.1, Math.min(0.95, confidence));
	}

	/**
	 * Calculate overall confidence across all recommendations
	 */
	private calculateOverallConfidence(
		recommendations: DosageRecommendation[],
		adjustments: DosageAdjustment[],
	): number {
		if (recommendations.length === 0) return 0;

		const avgConfidence =
			recommendations.reduce((sum, rec) => sum + rec.confidence, 0) /
			recommendations.length;
		const adjustmentPenalty = adjustments.length * 0.02;

		return Math.max(0.1, Math.min(0.95, avgConfidence - adjustmentPenalty));
	}

	/**
	 * Get recommended duration for supplement use
	 */
	private getRecommendedDuration(
		supplement: SupplementWithRelations,
		desiredEffect: string,
	): string {
		// Look for duration information in clinical applications
		const relevantApplication = supplement.clinicalApplications.find(
			(app) => app.efficacy !== "insufficient",
		);

		if (relevantApplication?.duration) {
			return relevantApplication.duration;
		}

		// Default durations based on effect type
		switch (desiredEffect) {
			case "therapeutic":
				return "4-12 tygodni";
			case "preventive":
				return "Ciągłe stosowanie";
			case "optimal":
				return "8-16 tygodni";
			default:
				return "4-8 tygodni";
		}
	}

	/**
	 * Get supplement data from database
	 */
	private async getSupplementData(
		supplementId: string,
	): Promise<SupplementWithRelations | null> {
		// This would typically fetch from the database
		// For now, return null to indicate the method needs implementation
		// TODO: Implement database fetch
		return null;
	}

	/**
	 * Update calculation progress
	 */
	private updateProgress(
		polishMessage: string,
		englishMessage: string,
		progress: number,
	) {
		if (this.progressCallback) {
			this.progressCallback({
				stage: englishMessage,
				progress,
				message: englishMessage,
				polishMessage,
			});
		}
	}
}
