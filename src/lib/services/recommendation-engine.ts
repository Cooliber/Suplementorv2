/**
 * AI-Powered Recommendation Engine
 * Intelligent supplement recommendations based on health goals, conditions, and user profile
 */

import type { EvidenceLevel, SupplementCategory } from "@/types/supplement";

export interface UserProfile {
	age: number;
	gender: "male" | "female" | "other";
	weight?: number; // kg
	healthGoals: HealthGoal[];
	existingConditions: string[];
	currentMedications: string[];
	allergies: string[];
	dietaryRestrictions: string[];
	experienceLevel: "beginner" | "intermediate" | "advanced";
}

export type HealthGoal =
	| "cognitive_enhancement"
	| "memory_improvement"
	| "focus_concentration"
	| "stress_reduction"
	| "anxiety_relief"
	| "mood_improvement"
	| "energy_boost"
	| "sleep_quality"
	| "physical_performance"
	| "neuroprotection"
	| "anti_aging"
	| "immune_support";

export interface RecommendationResult {
	supplementId: string;
	name: string;
	polishName: string;
	category: SupplementCategory;
	recommendationScore: number; // 0-100
	matchedGoals: HealthGoal[];
	reasoning: string;
	polishReasoning: string;
	dosageRecommendation: string;
	polishDosageRecommendation: string;
	safetyNotes: string[];
	polishSafetyNotes: string[];
	evidenceLevel: EvidenceLevel;
	synergisticWith: string[]; // IDs of supplements that work well together
	contraindications: string[];
	polishContraindications: string[];
}

export interface SupplementStack {
	name: string;
	polishName: string;
	supplements: RecommendationResult[];
	totalScore: number;
	synergies: string[];
	polishSynergies: string[];
	warnings: string[];
	polishWarnings: string[];
	estimatedMonthlyCost: {
		min: number;
		max: number;
		currency: string;
	};
}

// Health goal to supplement category mapping
const GOAL_TO_CATEGORY_MAP: Record<
	HealthGoal,
	{
		categories: SupplementCategory[];
		keywords: string[];
		polishKeywords: string[];
	}
> = {
	cognitive_enhancement: {
		categories: ["NOOTROPIC", "AMINO_ACID"],
		keywords: ["cognitive", "nootropic", "brain", "mental clarity"],
		polishKeywords: ["kognitywny", "nootropowy", "mózg", "jasność umysłu"],
	},
	memory_improvement: {
		categories: ["NOOTROPIC", "FATTY_ACID"],
		keywords: ["memory", "recall", "learning", "hippocampus"],
		polishKeywords: ["pamięć", "zapamiętywanie", "uczenie się", "hipokamp"],
	},
	focus_concentration: {
		categories: ["NOOTROPIC", "AMINO_ACID"],
		keywords: ["focus", "concentration", "attention", "ADHD"],
		polishKeywords: ["koncentracja", "uwaga", "skupienie", "ADHD"],
	},
	stress_reduction: {
		categories: ["ADAPTOGEN", "HERB", "AMINO_ACID"],
		keywords: ["stress", "cortisol", "adaptogen", "relaxation"],
		polishKeywords: ["stres", "kortyzol", "adaptogen", "relaksacja"],
	},
	anxiety_relief: {
		categories: ["ADAPTOGEN", "HERB", "AMINO_ACID"],
		keywords: ["anxiety", "anxiolytic", "GABA", "calm"],
		polishKeywords: ["lęk", "anksjolityczny", "GABA", "spokój"],
	},
	mood_improvement: {
		categories: ["AMINO_ACID", "HERB", "VITAMIN"],
		keywords: ["mood", "depression", "serotonin", "dopamine"],
		polishKeywords: ["nastrój", "depresja", "serotonina", "dopamina"],
	},
	energy_boost: {
		categories: ["AMINO_ACID", "VITAMIN", "COENZYME"],
		keywords: ["energy", "fatigue", "mitochondria", "ATP"],
		polishKeywords: ["energia", "zmęczenie", "mitochondria", "ATP"],
	},
	sleep_quality: {
		categories: ["AMINO_ACID", "MINERAL", "HERB"],
		keywords: ["sleep", "insomnia", "melatonin", "circadian"],
		polishKeywords: ["sen", "bezsenność", "melatonina", "rytm dobowy"],
	},
	physical_performance: {
		categories: ["AMINO_ACID", "OTHER"],
		keywords: ["performance", "endurance", "strength", "recovery"],
		polishKeywords: ["wydolność", "wytrzymałość", "siła", "regeneracja"],
	},
	neuroprotection: {
		categories: ["NOOTROPIC", "FATTY_ACID", "HERB"],
		keywords: ["neuroprotection", "antioxidant", "neurodegeneration"],
		polishKeywords: ["neuroprotekcja", "antyoksydant", "neurodegeneracja"],
	},
	anti_aging: {
		categories: ["COENZYME", "HERB", "VITAMIN"],
		keywords: ["aging", "longevity", "telomeres", "senescence"],
		polishKeywords: [
			"starzenie",
			"długowieczność",
			"telomery",
			"starzenie komórkowe",
		],
	},
	immune_support: {
		categories: ["VITAMIN", "MINERAL", "HERB"],
		keywords: ["immune", "immunity", "infection", "inflammation"],
		polishKeywords: ["odporność", "immunitet", "infekcja", "stan zapalny"],
	},
};

// Known synergistic combinations
const SYNERGISTIC_COMBINATIONS: Record<string, string[]> = {
	piracetam: ["cdp-choline", "alpha-gpc"],
	noopept: ["cdp-choline", "alpha-gpc"],
	caffeine: ["l-theanine"],
	"omega-3": ["vitamin-d3"],
	magnesium: ["vitamin-d3", "zinc"],
	curcumin: ["pycnogenol", "resveratrol"],
};

export class RecommendationEngine {
	/**
	 * Calculate recommendation score for a supplement based on user profile
	 */
	calculateScore(
		supplement: {
			id: string;
			category: SupplementCategory;
			evidenceLevel: EvidenceLevel;
			clinicalApplications?: Array<{
				condition: string;
				polishCondition: string;
				effectivenessRating?: number;
			}>;
			tags?: string[];
		},
		userProfile: UserProfile,
	): number {
		let score = 0;

		// Evidence level weight (0-30 points)
		const evidenceScores: Record<EvidenceLevel, number> = {
			STRONG: 30,
			MODERATE: 20,
			WEAK: 10,
			INSUFFICIENT: 5,
			CONFLICTING: 0,
		};
		score += evidenceScores[supplement.evidenceLevel] || 0;

		// Health goal match (0-40 points)
		for (const goal of userProfile.healthGoals) {
			const goalMapping = GOAL_TO_CATEGORY_MAP[goal];
			if (goalMapping.categories.includes(supplement.category)) {
				score += 20;
			}

			// Check if supplement tags match goal keywords
			const tags = (supplement.tags || []).map((t) => t.toLowerCase());
			const matchedKeywords = goalMapping.keywords.filter((kw) =>
				tags.some((tag) => tag.includes(kw.toLowerCase())),
			);
			score += matchedKeywords.length * 5;
		}

		// Clinical application effectiveness (0-20 points)
		if (supplement.clinicalApplications) {
			const avgEffectiveness =
				supplement.clinicalApplications.reduce(
					(sum, app) => sum + (app.effectivenessRating || 5),
					0,
				) / supplement.clinicalApplications.length;
			score += (avgEffectiveness / 10) * 20;
		}

		// Experience level adjustment (0-10 points)
		if (userProfile.experienceLevel === "beginner") {
			// Prefer well-studied, safe supplements for beginners
			if (supplement.evidenceLevel === "STRONG") score += 10;
		} else if (userProfile.experienceLevel === "advanced") {
			// Advanced users might be interested in newer compounds
			score += 5;
		}

		return Math.min(100, score);
	}

	/**
	 * Generate personalized supplement recommendations
	 */
	async generateRecommendations(
		supplements: Array<any>,
		userProfile: UserProfile,
		limit = 10,
	): Promise<RecommendationResult[]> {
		const scored = supplements.map((supplement) => {
			const score = this.calculateScore(supplement, userProfile);

			// Determine matched goals
			const matchedGoals: HealthGoal[] = [];
			for (const goal of userProfile.healthGoals) {
				const goalMapping = GOAL_TO_CATEGORY_MAP[goal];
				if (goalMapping.categories.includes(supplement.category)) {
					matchedGoals.push(goal);
				}
			}

			// Generate reasoning
			const reasoning = this.generateReasoning(
				supplement,
				matchedGoals,
				userProfile,
				"en",
			);
			const polishReasoning = this.generateReasoning(
				supplement,
				matchedGoals,
				userProfile,
				"pl",
			);

			// Find synergistic supplements
			const synergisticWith = SYNERGISTIC_COMBINATIONS[supplement.id] || [];

			// Check contraindications
			const contraindications = this.checkContraindications(
				supplement,
				userProfile,
			);

			return {
				supplementId: supplement.id,
				name: supplement.name,
				polishName: supplement.polishName,
				category: supplement.category,
				recommendationScore: score,
				matchedGoals,
				reasoning,
				polishReasoning,
				dosageRecommendation: supplement.dosageGuidelines?.standardDose
					? `${supplement.dosageGuidelines.standardDose.amount}${supplement.dosageGuidelines.standardDose.unit} ${supplement.dosageGuidelines.standardDose.frequency}`
					: "Consult product label",
				polishDosageRecommendation: supplement.dosageGuidelines?.standardDose
					? `${supplement.dosageGuidelines.standardDose.amount}${supplement.dosageGuidelines.standardDose.unit} ${supplement.dosageGuidelines.standardDose.polishFrequency}`
					: "Sprawdź etykietę produktu",
				safetyNotes: this.generateSafetyNotes(supplement, userProfile, "en"),
				polishSafetyNotes: this.generateSafetyNotes(
					supplement,
					userProfile,
					"pl",
				),
				evidenceLevel: supplement.evidenceLevel,
				synergisticWith,
				contraindications: contraindications.map((c) => c.reason),
				polishContraindications: contraindications.map((c) => c.polishReason),
			};
		});

		// Sort by score and return top recommendations
		scored.sort((a, b) => b.recommendationScore - a.recommendationScore);
		return scored.slice(0, limit);
	}

	/**
	 * Generate reasoning for recommendation
	 */
	private generateReasoning(
		supplement: any,
		matchedGoals: HealthGoal[],
		userProfile: UserProfile,
		language: "en" | "pl",
	): string {
		if (language === "pl") {
			const goalNames = matchedGoals
				.map((g) => {
					const mapping = GOAL_TO_CATEGORY_MAP[g];
					return mapping.polishKeywords[0];
				})
				.join(", ");

			return `Zalecany dla celów: ${goalNames}. Poziom dowodów: ${supplement.evidenceLevel}. Odpowiedni dla poziomu doświadczenia: ${userProfile.experienceLevel}.`;
		}
		const goalNames = matchedGoals
			.map((g) => {
				const mapping = GOAL_TO_CATEGORY_MAP[g];
				return mapping.keywords[0];
			})
			.join(", ");

		return `Recommended for goals: ${goalNames}. Evidence level: ${supplement.evidenceLevel}. Suitable for experience level: ${userProfile.experienceLevel}.`;
	}

	/**
	 * Generate safety notes
	 */
	private generateSafetyNotes(
		supplement: any,
		userProfile: UserProfile,
		language: "en" | "pl",
	): string[] {
		const notes: string[] = [];

		if (language === "pl") {
			if (userProfile.experienceLevel === "beginner") {
				notes.push("Zacznij od najmniejszej skutecznej dawki");
			}
			if (userProfile.currentMedications.length > 0) {
				notes.push(
					"Skonsultuj się z lekarzem przed rozpoczęciem suplementacji",
				);
			}
		} else {
			if (userProfile.experienceLevel === "beginner") {
				notes.push("Start with minimum effective dose");
			}
			if (userProfile.currentMedications.length > 0) {
				notes.push("Consult physician before starting supplementation");
			}
		}

		return notes;
	}

	/**
	 * Check contraindications
	 */
	private checkContraindications(
		supplement: any,
		userProfile: UserProfile,
	): Array<{
		reason: string;
		polishReason: string;
		severity: "mild" | "moderate" | "severe";
	}> {
		const contraindications: Array<{
			reason: string;
			polishReason: string;
			severity: "mild" | "moderate" | "severe";
		}> = [];

		// Check age restrictions
		if (userProfile.age < 18) {
			contraindications.push({
				reason: "Not recommended for individuals under 18",
				polishReason: "Nie zalecane dla osób poniżej 18 roku życia",
				severity: "moderate",
			});
		}

		return contraindications;
	}
}

// Export singleton instance
export const recommendationEngine = new RecommendationEngine();
