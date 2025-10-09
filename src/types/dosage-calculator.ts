/**
 * Enhanced Dosage Calculator Type Definitions
 * Comprehensive types for pharmacokinetic calculations and safety analysis
 */

import { z } from "zod";

// Core calculation input types
export const UserProfileSchema = z.object({
	age: z.number().min(18).max(120),
	gender: z.enum(["male", "female", "other"]),
	weight: z.number().min(30).max(300), // kg
	height: z.number().min(100).max(250), // cm
	activityLevel: z.enum(["sedentary", "light", "moderate", "active", "very_active"]),
	healthConditions: z.array(z.string()),
	currentMedications: z.array(z.string()),
	allergies: z.array(z.string()),
	pregnant: z.boolean().default(false),
	breastfeeding: z.boolean().default(false),
});

export const SupplementInputSchema = z.object({
	supplementId: z.string().cuid(),
	desiredEffect: z.enum(["therapeutic", "preventive", "optimal"]),
	customDosage: z.number().positive().optional(),
	timingPreference: z.array(z.enum(["morning", "afternoon", "evening", "night"])).optional(),
	withFood: z.boolean().optional(),
});

export const DosageCalculationInputSchema = z.object({
	userProfile: UserProfileSchema,
	supplements: z.array(SupplementInputSchema).min(1).max(10),
	calculationType: z.enum(["individual", "stack"]),
	includeInteractions: z.boolean().default(true),
	includeContraindications: z.boolean().default(true),
});

// Pharmacokinetic calculation types
export const PharmacokineticFactorsSchema = z.object({
	bioavailability: z.number().min(0).max(100),
	halfLife: z.number().positive(), // hours
	absorptionRate: z.number().positive(),
	eliminationRate: z.number().positive(),
	volumeOfDistribution: z.number().positive(),
	proteinBinding: z.number().min(0).max(100),
	firstPassMetabolism: z.number().min(0).max(100),
});

export const DosageAdjustmentSchema = z.object({
	factor: z.enum([
		"age",
		"weight",
		"gender",
		"liver_function",
		"kidney_function",
		"pregnancy",
		"breastfeeding",
		"activity_level",
		"health_condition",
		"medication_interaction",
		"food_interaction",
	]),
	adjustment: z.number(), // multiplier (0.5 = 50% reduction, 1.5 = 50% increase)
	reason: z.string(),
	polishReason: z.string(),
	evidenceLevel: z.enum(["STRONG", "MODERATE", "WEAK"]),
});

// Safety analysis types
export const SafetyAlertSchema = z.object({
	type: z.enum(["contraindication", "interaction", "overdose_risk", "side_effect_risk"]),
	severity: z.enum(["low", "medium", "high", "critical"]),
	message: z.string(),
	polishMessage: z.string(),
	supplements: z.array(z.string()),
	recommendation: z.string(),
	polishRecommendation: z.string(),
	evidenceLevel: z.enum(["STRONG", "MODERATE", "WEAK"]),
});

export const InteractionAnalysisSchema = z.object({
	supplement1: z.string(),
	supplement2: z.string(),
	interactionType: z.enum(["synergistic", "antagonistic", "additive", "competitive"]),
	severity: z.enum(["severe", "moderate", "minor", "beneficial"]),
	mechanism: z.string(),
	polishMechanism: z.string(),
	clinicalSignificance: z.string(),
	polishClinicalSignificance: z.string(),
	dosageAdjustment: z.number().optional(),
	timingAdjustment: z.string().optional(),
	polishTimingAdjustment: z.string().optional(),
});

// Calculation result types
export const DosageRecommendationSchema = z.object({
	supplementId: z.string(),
	supplementName: z.string(),
	polishSupplementName: z.string(),
	recommendedDosage: z.object({
		min: z.number(),
		max: z.number(),
		unit: z.string(),
	}),
	confidence: z.number().min(0).max(1),
	timing: z.array(z.string()),
	withFood: z.boolean(),
	duration: z.string(),
	adjustments: z.array(DosageAdjustmentSchema),
	pharmacokineticFactors: PharmacokineticFactorsSchema,
});

export const DosageCalculationResultSchema = z.object({
	calculationId: z.string(),
	userProfile: UserProfileSchema,
	dosageRecommendations: z.array(DosageRecommendationSchema),
	safetyAlerts: z.array(SafetyAlertSchema),
	interactionAnalysis: z.array(InteractionAnalysisSchema),
	overallRisk: z.enum(["low", "medium", "high"]),
	totalConfidence: z.number().min(0).max(1),
	calculationDate: z.string().datetime(),
	warnings: z.array(z.string()),
	polishWarnings: z.array(z.string()),
	recommendations: z.array(z.string()),
	polishRecommendations: z.array(z.string()),
});

// TypeScript type exports
export type UserProfile = z.infer<typeof UserProfileSchema>;
export type SupplementInput = z.infer<typeof SupplementInputSchema>;
export type DosageCalculationInput = z.infer<typeof DosageCalculationInputSchema>;
export type PharmacokineticFactors = z.infer<typeof PharmacokineticFactorsSchema>;
export type DosageAdjustment = z.infer<typeof DosageAdjustmentSchema>;
export type SafetyAlert = z.infer<typeof SafetyAlertSchema>;
export type InteractionAnalysis = z.infer<typeof InteractionAnalysisSchema>;
export type DosageRecommendation = z.infer<typeof DosageRecommendationSchema>;
export type DosageCalculationResult = z.infer<typeof DosageCalculationResultSchema>;

// Validation functions
export const validateUserProfile = (data: unknown) => {
	try {
		return {
			success: true as const,
			data: UserProfileSchema.parse(data),
		};
	} catch (error) {
		return {
			success: false as const,
			error: error instanceof z.ZodError ? error.issues : [{ message: "Unknown validation error" }],
		};
	}
};

export const validateDosageCalculationInput = (data: unknown) => {
	try {
		return {
			success: true as const,
			data: DosageCalculationInputSchema.parse(data),
		};
	} catch (error) {
		return {
			success: false as const,
			error: error instanceof z.ZodError ? error.issues : [{ message: "Unknown validation error" }],
		};
	}
};

// Utility types for API responses
export interface CalculationProgress {
	stage: string;
	progress: number;
	message: string;
	polishMessage: string;
}

export interface DosageCalculatorError {
	code: string;
	message: string;
	polishMessage: string;
	details?: Record<string, unknown>;
}

// Constants for calculations
export const PHARMACOKINETIC_CONSTANTS = {
	// Standard human pharmacokinetic parameters
	ADULT_BSA_CONSTANT: 0.007184, // Mosteller formula constant
	CHILD_BSA_CONSTANT: 0.0004688, // Simplified for children
	CREATININE_CLEARANCE_COCKCROFT: {
		MALE_CONSTANT: 1.23,
		FEMALE_CONSTANT: 1.04,
		AGE_FACTOR: -0.203,
	},
	LIVER_FUNCTION_TESTS: {
		ALT_NORMAL_MAX: 40,
		AST_NORMAL_MAX: 40,
		ALBUMIN_NORMAL_MIN: 3.5,
	},
} as const;

export const AGE_ADJUSTMENTS = {
	CHILDREN: { multiplier: 0.7, maxReduction: 0.5 },
	ELDERLY: { multiplier: 0.8, maxReduction: 0.6 },
	ADULT: { multiplier: 1.0, maxReduction: 0.8 },
} as const;

export const ACTIVITY_LEVEL_ADJUSTMENTS = {
	sedentary: 0.9,
	light: 1.0,
	moderate: 1.1,
	active: 1.2,
	very_active: 1.3,
} as const;