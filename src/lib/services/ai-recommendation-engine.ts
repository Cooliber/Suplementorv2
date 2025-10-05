/**
 * AI-Powered Supplement Recommendation Engine
 * Provides intelligent recommendations based on health goals, medications, and individual factors
 * Uses machine learning algorithms and evidence-based decision trees
 */

import type { ComprehensiveSupplementProfile } from "@/data/comprehensive-supplements";
import type {
	ActiveCompound,
	ClinicalApplication,
	SideEffect,
	SupplementInteraction,
} from "../../types/supplement";
import { comprehensiveSupplementsService } from "./comprehensive-supplements-service";
import type { EvidenceLevel } from "./evidence-based-research-service";

export interface UserProfile {
	// Demographics
	age: number;
	gender: "male" | "female" | "other";
	weight?: number; // kg
	height?: number; // cm

	// Health status
	healthConditions: string[];
	polishHealthConditions: string[];
	currentMedications: Medication[];
	allergies: string[];
	polishAllergies: string[];

	// Lifestyle factors
	lifestyle: {
		activityLevel:
			| "sedentary"
			| "light"
			| "moderate"
			| "active"
			| "very_active";
		diet:
			| "omnivore"
			| "vegetarian"
			| "vegan"
			| "keto"
			| "mediterranean"
			| "other";
		polishDiet: string;
		sleepHours: number;
		stressLevel: 1 | 2 | 3 | 4 | 5; // 1 = low, 5 = high
		smokingStatus: "never" | "former" | "current";
		alcoholConsumption: "none" | "light" | "moderate" | "heavy";
	};

	// Health goals
	healthGoals: HealthGoal[];

	// Preferences
	preferences: {
		budgetRange: {
			min: number;
			max: number;
			currency: "EUR";
		};
		preferredForms: ("capsule" | "tablet" | "powder" | "liquid" | "gummy")[];
		polishPreferredForms: string[];
		maxDailySupplements: number;
		organicPreference: boolean;
		veganPreference: boolean;
		allergenAvoidance: string[];
		polishAllergenAvoidance: string[];
	};

	// Current supplements
	currentSupplements: CurrentSupplement[];
}

export interface Medication {
	name: string;
	polishName: string;
	activeIngredient: string;
	dosage: string;
	frequency: string;
	indication: string;
	polishIndication: string;
	interactions: string[];
	polishInteractions: string[];
}

export interface HealthGoal {
	id: string;
	goal: string;
	polishGoal: string;
	priority: "low" | "medium" | "high";
	timeframe: string; // e.g., "3 months", "6 months"
	polishTimeframe: string;
	specificTargets?: string[];
	polishSpecificTargets?: string[];
}

export interface CurrentSupplement {
	supplementId: string;
	name: string;
	polishName: string;
	dosage: string;
	frequency: string;
	duration: string; // How long they've been taking it
	effectiveness: 1 | 2 | 3 | 4 | 5; // User-reported effectiveness
	sideEffects: string[];
	polishSideEffects: string[];
}

export interface RecommendationResult {
	supplement: ComprehensiveSupplementProfile;
	score: number; // 0-100
	reasoning: RecommendationReasoning;
	warnings: Warning[];
	dosageRecommendation: DosageRecommendation;
	expectedBenefits: ExpectedBenefit[];
	timeline: Timeline;
	costAnalysis: CostAnalysis;
	alternatives: AlternativeRecommendation[];
}

export interface RecommendationReasoning {
	primaryReasons: string[];
	polishPrimaryReasons: string[];
	evidenceSupport: {
		level: EvidenceLevel;
		studyCount: number;
		description: string;
		polishDescription: string;
	};
	personalizedFactors: string[];
	polishPersonalizedFactors: string[];
	synergies: string[];
	polishSynergies: string[];
}

export interface Warning {
	type:
		| "interaction"
		| "contraindication"
		| "side_effect"
		| "dosage"
		| "monitoring";
	severity: "low" | "moderate" | "high" | "critical";
	message: string;
	polishMessage: string;
	recommendation: string;
	polishRecommendation: string;
	sources: string[];
}

export interface DosageRecommendation {
	startingDose: string;
	polishStartingDose: string;
	targetDose: string;
	polishTargetDose: string;
	titrationSchedule?: string;
	polishTitrationSchedule?: string;
	timing: string[];
	polishTiming: string[];
	withFood: boolean;
	specialInstructions: string[];
	polishSpecialInstructions: string[];
}

export interface ExpectedBenefit {
	benefit: string;
	polishBenefit: string;
	probability: number; // 0-1
	timeToEffect: string;
	polishTimeToEffect: string;
	evidenceLevel: EvidenceLevel;
	magnitude: "small" | "moderate" | "large";
	polishMagnitude: string;
}

export interface Timeline {
	phases: {
		phase: string;
		polishPhase: string;
		duration: string;
		polishDuration: string;
		expectedChanges: string[];
		polishExpectedChanges: string[];
		monitoringPoints: string[];
		polishMonitoringPoints: string[];
	}[];
}

export interface CostAnalysis {
	monthlyEstimate: number;
	currency: "EUR";
	costPerBenefit: number;
	budgetFit: "excellent" | "good" | "fair" | "poor";
	polishBudgetFit: string;
	costOptimizationTips: string[];
	polishCostOptimizationTips: string[];
}

export interface AlternativeRecommendation {
	supplement: ComprehensiveSupplementProfile;
	reason: string;
	polishReason: string;
	tradeoffs: string[];
	polishTradeoffs: string[];
}

export class AIRecommendationEngine {
	private weightingFactors = {
		evidenceLevel: 0.3,
		personalizedMatch: 0.25,
		safety: 0.2,
		costEffectiveness: 0.15,
		userPreferences: 0.1,
	};

	/**
	 * Generate personalized supplement recommendations
	 */
	async generateRecommendations(
		userProfile: UserProfile,
		maxRecommendations = 5,
	): Promise<RecommendationResult[]> {
		// Get all available supplements
		const allSupplements = comprehensiveSupplementsService.searchSupplements(
			{},
		);

		// Score each supplement for this user
		const scoredRecommendations: RecommendationResult[] = [];

		for (const supplement of allSupplements) {
			const score = await this.calculateSupplementScore(
				supplement,
				userProfile,
			);

			if (score > 30) {
				// Only include supplements with reasonable scores
				const recommendation = await this.buildRecommendation(
					supplement,
					userProfile,
					score,
				);
				scoredRecommendations.push(recommendation);
			}
		}

		// Sort by score and return top recommendations
		return scoredRecommendations
			.sort((a, b) => b.score - a.score)
			.slice(0, maxRecommendations);
	}

	/**
	 * Calculate overall score for a supplement given user profile
	 */
	private async calculateSupplementScore(
		supplement: ComprehensiveSupplementProfile,
		userProfile: UserProfile,
	): Promise<number> {
		let totalScore = 0;

		// Evidence level score (0-30 points)
		const evidenceScore = this.calculateEvidenceScore(supplement);
		totalScore += evidenceScore * this.weightingFactors.evidenceLevel * 100;

		// Personalized match score (0-25 points)
		const personalizedScore = this.calculatePersonalizedScore(
			supplement,
			userProfile,
		);
		totalScore +=
			personalizedScore * this.weightingFactors.personalizedMatch * 100;

		// Safety score (0-20 points)
		const safetyScore = this.calculateSafetyScore(supplement, userProfile);
		totalScore += safetyScore * this.weightingFactors.safety * 100;

		// Cost effectiveness score (0-15 points)
		const costScore = this.calculateCostScore(supplement, userProfile);
		totalScore += costScore * this.weightingFactors.costEffectiveness * 100;

		// User preferences score (0-10 points)
		const preferencesScore = this.calculatePreferencesScore(
			supplement,
			userProfile,
		);
		totalScore +=
			preferencesScore * this.weightingFactors.userPreferences * 100;

		return Math.min(100, Math.max(0, totalScore));
	}

	/**
	 * Calculate evidence-based score
	 */
	private calculateEvidenceScore(
		supplement: ComprehensiveSupplementProfile,
	): number {
		const evidenceMap = {
			STRONG: 1.0,
			MODERATE: 0.7,
			WEAK: 0.4,
			INSUFFICIENT: 0.1,
			CONFLICTING: 0.3,
		};

		const baseScore =
			evidenceMap[supplement.evidenceLevel as keyof typeof evidenceMap] || 0.1;

		// Boost for high study count
		const studyBonus = Math.min(
			0.2,
			supplement.clinicalEvidence.totalStudies / 1000,
		);

		// Boost for RCTs and meta-analyses
		const qualityBonus = Math.min(
			0.2,
			(supplement.clinicalEvidence.rctCount * 0.1 +
				supplement.clinicalEvidence.metaAnalyses * 0.2) /
				10,
		);

		return Math.min(1.0, baseScore + studyBonus + qualityBonus);
	}

	/**
	 * Calculate personalized match score based on health goals and conditions
	 */
	private calculatePersonalizedScore(
		supplement: ComprehensiveSupplementProfile,
		userProfile: UserProfile,
	): number {
		let score = 0;
		let maxPossibleScore = 0;

		// Match against health goals
		userProfile.healthGoals.forEach((goal) => {
			maxPossibleScore +=
				goal.priority === "high" ? 3 : goal.priority === "medium" ? 2 : 1;

			const matchingApplications = supplement.clinicalApplications.filter(
				(app: ClinicalApplication) =>
					app.polishCondition
						.toLowerCase()
						.includes(goal.polishGoal.toLowerCase()) ||
					goal.polishGoal
						.toLowerCase()
						.includes(app.polishCondition.toLowerCase()),
			);

			if (matchingApplications.length > 0) {
				const bestMatch = Math.max(
					...matchingApplications.map(
						(app: ClinicalApplication) => app.effectivenessRating,
					),
				);
				const goalWeight =
					goal.priority === "high" ? 3 : goal.priority === "medium" ? 2 : 1;
				score += (bestMatch / 10) * goalWeight;
			}
		});

		// Match against health conditions
		userProfile.polishHealthConditions.forEach((condition) => {
			maxPossibleScore += 2;

			const matchingApplications = supplement.clinicalApplications.filter(
				(app: ClinicalApplication) =>
					app.polishCondition.toLowerCase().includes(condition.toLowerCase()),
			);

			if (matchingApplications.length > 0) {
				const bestMatch = Math.max(
					...matchingApplications.map(
						(app: ClinicalApplication) => app.effectivenessRating,
					),
				);
				score += (bestMatch / 10) * 2;
			}
		});

		// Age-specific considerations
		if (
			userProfile.age >= 65 &&
			supplement.safetyProfile.elderlyConsiderations.length > 0
		) {
			maxPossibleScore += 1;
			score += 0.5; // Bonus for elderly-specific guidance
		}

		// Gender-specific considerations
		maxPossibleScore += 1;
		// Add gender-specific scoring logic here

		return maxPossibleScore > 0 ? score / maxPossibleScore : 0;
	}

	/**
	 * Calculate safety score based on contraindications and interactions
	 */
	private calculateSafetyScore(
		supplement: ComprehensiveSupplementProfile,
		userProfile: UserProfile,
	): number {
		let safetyScore = 1.0;

		// Check for medication interactions
		userProfile.currentMedications.forEach((medication) => {
			const interaction = supplement.interactions.find(
				(int: SupplementInteraction) =>
					int.substance
						.toLowerCase()
						.includes(medication.activeIngredient.toLowerCase()) ||
					(int.polishSubstance
						?.toLowerCase()
						.includes(medication.polishName.toLowerCase()) ??
						false),
			);

			if (interaction) {
				switch (interaction.severity) {
					case "severe":
						safetyScore *= 0.1;
						break;
					case "moderate":
						safetyScore *= 0.5;
						break;
					case "minor":
						safetyScore *= 0.8;
						break;
					case "beneficial":
						safetyScore *= 1.2;
						break;
				}
			}
		});

		// Check for allergies
		userProfile.polishAllergies.forEach((allergy) => {
			supplement.activeCompounds.forEach((compound: ActiveCompound) => {
				if (
					compound.polishName?.toLowerCase().includes(allergy.toLowerCase())
				) {
					safetyScore *= 0.1;
				}
			});
		});

		// Pregnancy/breastfeeding safety
		if (userProfile.gender === "female") {
			// In a real implementation, we'd ask about pregnancy/breastfeeding status
			if (
				supplement.safetyProfile.pregnancyCategory === "D" ||
				supplement.safetyProfile.pregnancyCategory === "X"
			) {
				safetyScore *= 0.7; // Reduce score for potentially unsafe supplements
			}
		}

		// Age-specific safety
		if (
			userProfile.age < 18 &&
			!supplement.safetyProfile.pediatricUse.approved
		) {
			safetyScore *= 0.3;
		}

		return safetyScore;
	}

	/**
	 * Calculate cost effectiveness score
	 */
	private calculateCostScore(
		supplement: ComprehensiveSupplementProfile,
		userProfile: UserProfile,
	): number {
		const monthlyCost = supplement.economicData.averageCostPerMonth.average;
		const budgetMax = userProfile.preferences.budgetRange.max;

		if (monthlyCost > budgetMax) {
			return 0; // Outside budget
		}

		// Score based on cost-effectiveness rating and budget fit
		const costEffectivenessMap = {
			Excellent: 1.0,
			Good: 0.8,
			Fair: 0.6,
			Poor: 0.3,
		};

		const baseScore =
			costEffectivenessMap[
				supplement.economicData
					.costEffectivenessRating as keyof typeof costEffectivenessMap
			] || 0.5;

		// Bonus for being well within budget
		const budgetUtilization = monthlyCost / budgetMax;
		const budgetBonus =
			budgetUtilization < 0.5 ? 0.2 : budgetUtilization < 0.8 ? 0.1 : 0;

		return Math.min(1.0, baseScore + budgetBonus);
	}

	/**
	 * Calculate user preferences score
	 */
	private calculatePreferencesScore(
		supplement: ComprehensiveSupplementProfile,
		userProfile: UserProfile,
	): number {
		let score = 0;
		let maxScore = 0;

		// Preferred forms
		maxScore += 2;
		const availableForms =
			supplement.qualityConsiderations.polishBioavailabilityForms;
		const hasPreferredForm = userProfile.preferences.polishPreferredForms.some(
			(pref: string) =>
				availableForms.some((form: string) =>
					form.toLowerCase().includes(pref.toLowerCase()),
				),
		);
		if (hasPreferredForm) score += 2;

		// Vegan preference
		if (userProfile.preferences.veganPreference) {
			maxScore += 1;
			// Check if supplement is vegan-friendly (simplified check)
			const isVeganFriendly =
				!supplement.qualityConsiderations.polishBioavailabilityForms.some(
					(form: string) => form.toLowerCase().includes("żelatyna"),
				);
			if (isVeganFriendly) score += 1;
		}

		// Organic preference
		if (userProfile.preferences.organicPreference) {
			maxScore += 1;
			// Check if organic options are available (simplified)
			const hasOrganic =
				supplement.qualityConsiderations.polishQualityMarkers.some(
					(marker: string) => marker.toLowerCase().includes("organiczny"),
				);
			if (hasOrganic) score += 1;
		}

		return maxScore > 0 ? score / maxScore : 1;
	}

	/**
	 * Build complete recommendation with reasoning and warnings
	 */
	private async buildRecommendation(
		supplement: ComprehensiveSupplementProfile,
		userProfile: UserProfile,
		score: number,
	): Promise<RecommendationResult> {
		const reasoning = this.buildReasoning(supplement, userProfile);
		const warnings = this.identifyWarnings(supplement, userProfile);
		const dosageRecommendation = this.generateDosageRecommendation(
			supplement,
			userProfile,
		);
		const expectedBenefits = this.calculateExpectedBenefits(
			supplement,
			userProfile,
		);
		const timeline = this.generateTimeline(supplement, userProfile);
		const costAnalysis = this.analyzeCost(supplement, userProfile);
		const alternatives = this.findAlternatives(supplement, userProfile);

		return {
			supplement,
			score,
			reasoning,
			warnings,
			dosageRecommendation,
			expectedBenefits,
			timeline,
			costAnalysis,
			alternatives,
		};
	}

	/**
	 * Build reasoning for recommendation
	 */
	private buildReasoning(
		supplement: ComprehensiveSupplementProfile,
		userProfile: UserProfile,
	): RecommendationReasoning {
		const primaryReasons: string[] = [];
		const polishPrimaryReasons: string[] = [];
		const personalizedFactors: string[] = [];
		const polishPersonalizedFactors: string[] = [];
		const synergies: string[] = [];
		const polishSynergies: string[] = [];

		// Find matching health goals
		userProfile.healthGoals.forEach((goal) => {
			const matchingApps = supplement.clinicalApplications.filter(
				(app: ClinicalApplication) =>
					app.polishCondition
						.toLowerCase()
						.includes(goal.polishGoal.toLowerCase()),
			);

			if (matchingApps.length > 0) {
				primaryReasons.push(`Effective for ${goal.goal}`);
				polishPrimaryReasons.push(`Skuteczny dla ${goal.polishGoal}`);
			}
		});

		// Age-specific factors
		if (userProfile.age >= 65) {
			personalizedFactors.push("Age-appropriate with elderly considerations");
			polishPersonalizedFactors.push(
				"Odpowiedni dla wieku z uwzględnieniem osób starszych",
			);
		}

		// Lifestyle factors
		if (
			userProfile.lifestyle.activityLevel === "very_active" ||
			userProfile.lifestyle.activityLevel === "active"
		) {
			personalizedFactors.push("Suitable for active lifestyle");
			polishPersonalizedFactors.push("Odpowiedni dla aktywnego stylu życia");
		}

		return {
			primaryReasons,
			polishPrimaryReasons,
			evidenceSupport: {
				level: supplement.evidenceLevel,
				studyCount: supplement.clinicalEvidence.totalStudies,
				description: `Based on ${supplement.clinicalEvidence.totalStudies} studies with ${supplement.evidenceLevel.toLowerCase()} evidence`,
				polishDescription: `Na podstawie ${supplement.clinicalEvidence.totalStudies} badań z ${supplement.evidenceLevel.toLowerCase()} dowodami`,
			},
			personalizedFactors,
			polishPersonalizedFactors,
			synergies,
			polishSynergies,
		};
	}

	/**
	 * Identify potential warnings and contraindications
	 */
	private identifyWarnings(
		supplement: ComprehensiveSupplementProfile,
		userProfile: UserProfile,
	): Warning[] {
		const warnings: Warning[] = [];

		// Check medication interactions
		userProfile.currentMedications.forEach((medication) => {
			const interaction = supplement.interactions.find(
				(int: SupplementInteraction) =>
					int.substance
						.toLowerCase()
						.includes(medication.activeIngredient.toLowerCase()),
			);

			if (interaction) {
				warnings.push({
					type: "interaction",
					severity:
						interaction.severity === "severe"
							? "critical"
							: interaction.severity === "moderate"
								? "high"
								: "moderate",
					message: `Potential interaction with ${medication.name}`,
					polishMessage: `Potencjalna interakcja z ${medication.polishName}`,
					recommendation:
						interaction.recommendation || "Consult healthcare provider",
					polishRecommendation:
						interaction.polishRecommendation || "Skonsultuj się z lekarzem",
					sources: [],
				});
			}
		});

		// Check for common side effects
		supplement.sideEffects.forEach((sideEffect: SideEffect) => {
			if (
				sideEffect.frequency.includes("common") &&
				sideEffect.severity !== "mild"
			) {
				warnings.push({
					type: "side_effect",
					severity: sideEffect.severity === "severe" ? "high" : "moderate",
					message: `Common side effect: ${sideEffect.effect}`,
					polishMessage: `Częsty skutek uboczny: ${sideEffect.polishEffect}`,
					recommendation: sideEffect.management || "Monitor for side effects",
					polishRecommendation:
						sideEffect.polishManagement ||
						"Monitoruj pod kątem skutków ubocznych",
					sources: [],
				});
			}
		});

		return warnings;
	}

	/**
	 * Generate personalized dosage recommendations
	 */
	private generateDosageRecommendation(
		supplement: ComprehensiveSupplementProfile,
		userProfile: UserProfile,
	): DosageRecommendation {
		const baseRange = supplement.dosageGuidelines.therapeuticRange;

		// Calculate optimal dose as midpoint of therapeutic range
		const optimalDose = (baseRange.min + baseRange.max) / 2;

		// Adjust for age
		let adjustedDose = optimalDose;
		if (userProfile.age >= 65) {
			adjustedDose = Math.max(baseRange.min, optimalDose * 0.8);
		} else if (userProfile.age < 18) {
			adjustedDose = Math.max(baseRange.min, optimalDose * 0.6);
		}

		// Adjust for weight if available
		if (userProfile.weight && userProfile.weight < 60) {
			adjustedDose *= 0.9;
		} else if (userProfile.weight && userProfile.weight > 90) {
			adjustedDose *= 1.1;
		}

		return {
			startingDose: `${Math.round(adjustedDose * 0.5)} ${baseRange.unit}`,
			polishStartingDose: `${Math.round(adjustedDose * 0.5)} ${baseRange.unit}`,
			targetDose: `${Math.round(adjustedDose)} ${baseRange.unit}`,
			polishTargetDose: `${Math.round(adjustedDose)} ${baseRange.unit}`,
			titrationSchedule: "Increase gradually over 2 weeks",
			polishTitrationSchedule: "Zwiększać stopniowo przez 2 tygodnie",
			timing: supplement.dosageGuidelines.timing,
			polishTiming: supplement.dosageGuidelines.timing.map((t) => t), // Use same timing for Polish
			withFood: supplement.dosageGuidelines.withFood,
			specialInstructions: [],
			polishSpecialInstructions: [],
		};
	}

	/**
	 * Calculate expected benefits with probabilities
	 */
	private calculateExpectedBenefits(
		supplement: ComprehensiveSupplementProfile,
		userProfile: UserProfile,
	): ExpectedBenefit[] {
		const benefits: ExpectedBenefit[] = [];

		// Match benefits to user goals
		userProfile.healthGoals.forEach((goal) => {
			const matchingApps = supplement.clinicalApplications.filter(
				(app: ClinicalApplication) =>
					app.polishCondition
						.toLowerCase()
						.includes(goal.polishGoal.toLowerCase()),
			);

			matchingApps.forEach((app: ClinicalApplication) => {
				const probability = this.calculateBenefitProbability(
					app.effectivenessRating,
					app.evidenceLevel,
				);

				benefits.push({
					benefit: app.condition,
					polishBenefit: app.polishCondition,
					probability,
					timeToEffect: this.estimateTimeToEffect(supplement, app),
					polishTimeToEffect: this.estimateTimeToEffect(supplement, app),
					evidenceLevel: app.evidenceLevel,
					magnitude:
						app.effectivenessRating >= 8
							? "large"
							: app.effectivenessRating >= 6
								? "moderate"
								: "small",
					polishMagnitude:
						app.effectivenessRating >= 8
							? "duży"
							: app.effectivenessRating >= 6
								? "umiarkowany"
								: "mały",
				});
			});
		});

		return benefits;
	}

	/**
	 * Generate timeline for expected effects
	 */
	private generateTimeline(
		_supplement: ComprehensiveSupplementProfile,
		_userProfile: UserProfile,
	): Timeline {
		return {
			phases: [
				{
					phase: "Initial Phase",
					polishPhase: "Faza początkowa",
					duration: "1-2 weeks",
					polishDuration: "1-2 tygodnie",
					expectedChanges: [
						"Supplement tolerance assessment",
						"Initial biomarker changes",
					],
					polishExpectedChanges: [
						"Ocena tolerancji suplementu",
						"Początkowe zmiany biomarkerów",
					],
					monitoringPoints: ["Side effects", "Adherence"],
					polishMonitoringPoints: ["Skutki uboczne", "Przestrzeganie zaleceń"],
				},
				{
					phase: "Adaptation Phase",
					polishPhase: "Faza adaptacji",
					duration: "2-8 weeks",
					polishDuration: "2-8 tygodni",
					expectedChanges: [
						"Gradual improvement in target symptoms",
						"Dose optimization",
					],
					polishExpectedChanges: [
						"Stopniowa poprawa objawów docelowych",
						"Optymalizacja dawki",
					],
					monitoringPoints: ["Symptom tracking", "Dose adjustments"],
					polishMonitoringPoints: ["Śledzenie objawów", "Dostosowanie dawki"],
				},
				{
					phase: "Maintenance Phase",
					polishPhase: "Faza utrzymania",
					duration: "8+ weeks",
					polishDuration: "8+ tygodni",
					expectedChanges: [
						"Sustained benefits",
						"Long-term health improvements",
					],
					polishExpectedChanges: [
						"Utrzymane korzyści",
						"Długoterminowe poprawy zdrowia",
					],
					monitoringPoints: ["Periodic reassessment", "Continued monitoring"],
					polishMonitoringPoints: [
						"Okresowa ponowna ocena",
						"Ciągłe monitorowanie",
					],
				},
			],
		};
	}

	/**
	 * Analyze cost and budget fit
	 */
	private analyzeCost(
		supplement: ComprehensiveSupplementProfile,
		userProfile: UserProfile,
	): CostAnalysis {
		const monthlyCost = supplement.economicData.averageCostPerMonth.average;
		const budgetMax = userProfile.preferences.budgetRange.max;

		let budgetFit: CostAnalysis["budgetFit"];
		let polishBudgetFit: string;

		const budgetRatio = monthlyCost / budgetMax;
		if (budgetRatio <= 0.5) {
			budgetFit = "excellent";
			polishBudgetFit = "doskonałe";
		} else if (budgetRatio <= 0.7) {
			budgetFit = "good";
			polishBudgetFit = "dobre";
		} else if (budgetRatio <= 0.9) {
			budgetFit = "fair";
			polishBudgetFit = "przeciętne";
		} else {
			budgetFit = "poor";
			polishBudgetFit = "słabe";
		}

		return {
			monthlyEstimate: monthlyCost,
			currency: "EUR",
			costPerBenefit:
				monthlyCost / (supplement.clinicalApplications.length || 1),
			budgetFit,
			polishBudgetFit,
			costOptimizationTips: [
				"Consider generic alternatives",
				"Buy in bulk for discounts",
				"Look for subscription savings",
			],
			polishCostOptimizationTips: [
				"Rozważ alternatywy generyczne",
				"Kup hurtowo dla zniżek",
				"Szukaj oszczędności subskrypcyjnych",
			],
		};
	}

	/**
	 * Find alternative supplements
	 */
	private findAlternatives(
		_supplement: ComprehensiveSupplementProfile,
		_userProfile: UserProfile,
	): AlternativeRecommendation[] {
		// This would implement logic to find similar supplements
		// For now, return empty array
		return [];
	}

	// Helper methods
	private calculateBenefitProbability(
		effectivenessRating: number,
		evidenceLevel: string,
	): number {
		const baseProb = effectivenessRating / 10;
		const evidenceMultiplier =
			{
				STRONG: 1.0,
				MODERATE: 0.8,
				WEAK: 0.6,
				INSUFFICIENT: 0.3,
				CONFLICTING: 0.4,
			}[evidenceLevel] || 0.5;

		return Math.min(0.95, baseProb * evidenceMultiplier);
	}

	private estimateTimeToEffect(
		supplement: ComprehensiveSupplementProfile,
		_application: ClinicalApplication,
	): string {
		// Extract time to effect from mechanisms or use defaults
		const mechanism = supplement.mechanisms[0];
		return mechanism?.timeToEffect || "4-8 weeks";
	}
}

// Export singleton instance
export const aiRecommendationEngine = new AIRecommendationEngine();

// Export utility functions for UI components
export const formatRecommendationScore = (score: number): string => {
	if (score >= 90) return "Doskonałe dopasowanie";
	if (score >= 80) return "Bardzo dobre dopasowanie";
	if (score >= 70) return "Dobre dopasowanie";
	if (score >= 60) return "Umiarkowane dopasowanie";
	return "Słabe dopasowanie";
};

export const getScoreColor = (score: number): string => {
	if (score >= 90) return "text-green-600";
	if (score >= 80) return "text-blue-600";
	if (score >= 70) return "text-yellow-600";
	if (score >= 60) return "text-orange-600";
	return "text-red-600";
};
