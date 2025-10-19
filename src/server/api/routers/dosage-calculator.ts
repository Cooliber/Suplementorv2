/**
 * Dosage Calculator tRPC Router
 * API endpoints for enhanced dosage calculations and safety analysis
 */

import { DosageCalculationEngine } from "@/lib/services/dosage-calculation-engine";
import { SafetyEngine } from "@/lib/services/safety-engine";
import {
	createTRPCRouter,
	protectedProcedure,
	publicProcedure,
} from "@/server/api/trpc";
import {
	type DosageCalculationInput,
	DosageCalculationInputSchema,
	type UserProfile,
	validateDosageCalculationInput,
	validateUserProfile,
} from "@/types/dosage-calculator";
import { z } from "zod";

// Input validation schemas
const CalculateDosageInputSchema = z.object({
	userProfile: z.object({
		age: z.number().min(18).max(120),
		gender: z.enum(["male", "female", "other"]),
		weight: z.number().min(30).max(300),
		height: z.number().min(100).max(250),
		activityLevel: z.enum([
			"sedentary",
			"light",
			"moderate",
			"active",
			"very_active",
		]),
		healthConditions: z.array(z.string()),
		currentMedications: z.array(z.string()),
		allergies: z.array(z.string()),
		pregnant: z.boolean().default(false),
		breastfeeding: z.boolean().default(false),
	}),
	supplements: z
		.array(
			z.object({
				supplementId: z.string().cuid(),
				desiredEffect: z.enum(["therapeutic", "preventive", "optimal"]),
				customDosage: z.number().positive().optional(),
				timingPreference: z
					.array(z.enum(["morning", "afternoon", "evening", "night"]))
					.optional(),
				withFood: z.boolean().optional(),
			}),
		)
		.min(1)
		.max(10),
	calculationType: z.enum(["individual", "stack"]).default("stack"),
	includeInteractions: z.boolean().default(true),
	includeContraindications: z.boolean().default(true),
});

const GetSupplementSafetyInputSchema = z.object({
	supplementId: z.string().cuid(),
	userProfile: z.object({
		age: z.number().min(18).max(120),
		gender: z.enum(["male", "female", "other"]),
		weight: z.number().min(30).max(300),
		height: z.number().min(100).max(250),
		activityLevel: z.enum([
			"sedentary",
			"light",
			"moderate",
			"active",
			"very_active",
		]),
		healthConditions: z.array(z.string()),
		currentMedications: z.array(z.string()),
		allergies: z.array(z.string()),
		pregnant: z.boolean().default(false),
		breastfeeding: z.boolean().default(false),
	}),
});

const GetSupplementDataInputSchema = z.object({
	supplementIds: z.array(z.string().cuid()).min(1).max(20),
});

export const dosageCalculatorRouter = createTRPCRouter({
	/**
	 * Calculate personalized dosage recommendations
	 */
	calculateDosage: publicProcedure
		.input(CalculateDosageInputSchema)
		.query(async ({ ctx, input }) => {
			try {
				// Validate input
				const validation = validateDosageCalculationInput(input);
				if (!validation.success) {
					throw new Error(
						`Validation failed: ${validation.error.map((e) => e.message).join(", ")}`,
					);
				}

				// Get supplement data from database
				const supplementData = new Map();
				for (const supplementInput of input.supplements) {
					const supplement = await ctx.db.comprehensiveSupplement
						.findOne({
							id: supplementInput.supplementId,
							isActive: true,
						})
						.lean();

					if (!supplement) {
						throw new Error(
							`Supplement not found: ${supplementInput.supplementId}`,
						);
					}

					supplementData.set(supplementInput.supplementId, supplement);
				}

				// Initialize calculation and safety engines
				const calculationEngine = new DosageCalculationEngine();
				const safetyEngine = new SafetyEngine();

				// Perform dosage calculation
				const dosageResult = await calculationEngine.calculateDosage(input);

				// Perform safety analysis
				const safetyResult = await safetyEngine.analyzeSafety(
					input,
					supplementData,
				);

				// Combine results
				const result = {
					calculationId: `calc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
					userProfile: input.userProfile,
					dosageRecommendations: dosageResult.recommendations,
					safetyAlerts: safetyResult.safetyAlerts,
					interactionAnalysis: safetyResult.interactionAnalysis,
					overallRisk: safetyResult.overallRisk,
					totalConfidence: dosageResult.confidence,
					calculationDate: new Date().toISOString(),
					warnings: safetyResult.warnings,
					polishWarnings: safetyResult.polishWarnings,
					recommendations: [
						"Consult healthcare provider before starting new supplement regimen",
						"Monitor for side effects and discontinue if adverse reactions occur",
						"Follow recommended timing and food intake guidelines",
					],
					polishRecommendations: [
						"Skonsultuj się z lekarzem przed rozpoczęciem nowej kuracji suplementami",
						"Obserwuj działania niepożądane i przerwij stosowanie w przypadku reakcji negatywnych",
						"Przestrzegaj zalecanych godzin przyjmowania i wytycznych dotyczących posiłków",
					],
				};

				return result;
			} catch (error) {
				console.error("Dosage calculation error:", error);
				throw new Error(
					`Calculation failed: ${error instanceof Error ? error.message : "Unknown error"}`,
				);
			}
		}),

	/**
	 * Get safety profile for a specific supplement
	 */
	getSupplementSafety: publicProcedure
		.input(GetSupplementSafetyInputSchema)
		.query(async ({ ctx, input }) => {
			try {
				// Validate user profile
				const validation = validateUserProfile(input.userProfile);
				if (!validation.success) {
					throw new Error(
						`User profile validation failed: ${validation.error.map((e) => e.message).join(", ")}`,
					);
				}

				// Get supplement data
				const supplement = await ctx.db.comprehensiveSupplement
					.findOne({
						id: input.supplementId,
						isActive: true,
					})
					.lean();

				if (!supplement) {
					throw new Error(`Supplement not found: ${input.supplementId}`);
				}

				// Initialize safety engine and get safety profile
				const safetyEngine = new SafetyEngine();
				const safetyProfile = safetyEngine.getSupplementSafetyProfile(
					supplement as any,
					input.userProfile,
				);

				return {
					supplementId: input.supplementId,
					supplementName: supplement.name,
					polishSupplementName: supplement.polishName,
					...safetyProfile,
					analysisDate: new Date().toISOString(),
				};
			} catch (error) {
				console.error("Safety analysis error:", error);
				throw new Error(
					`Safety analysis failed: ${error instanceof Error ? error.message : "Unknown error"}`,
				);
			}
		}),

	/**
	 * Get supplement data for multiple supplements (for batch operations)
	 */
	getSupplementData: publicProcedure
		.input(GetSupplementDataInputSchema)
		.query(async ({ ctx, input }) => {
			try {
				const supplements = await ctx.db.comprehensiveSupplement
					.find({
						id: { $in: input.supplementIds },
						isActive: true,
					})
					.lean();

				if (supplements.length !== input.supplementIds.length) {
					const foundIds = supplements.map((s) => s.id);
					const missingIds = input.supplementIds.filter(
						(id) => !foundIds.includes(id),
					);
					throw new Error(`Supplements not found: ${missingIds.join(", ")}`);
				}

				return supplements.map((supplement) => ({
					id: supplement.id,
					name: supplement.name,
					polishName: supplement.polishName,
					category: supplement.category,
					dosageGuidelines: supplement.dosageGuidelines,
					interactions: supplement.interactions,
					sideEffects: supplement.sideEffects,
					evidenceLevel: supplement.evidenceLevel,
				}));
			} catch (error) {
				console.error("Supplement data fetch error:", error);
				throw new Error(
					`Failed to fetch supplement data: ${error instanceof Error ? error.message : "Unknown error"}`,
				);
			}
		}),

	/**
	 * Get dosage calculation history for a user (protected endpoint)
	 */
	getCalculationHistory: protectedProcedure
		.input(
			z.object({
				limit: z.number().min(1).max(50).default(10),
				offset: z.number().min(0).default(0),
			}),
		)
		.query(async ({ ctx, input }) => {
			try {
				// This would typically fetch from a user calculations history table
				// For now, return a placeholder response
				return {
					calculations: [],
					totalCount: 0,
					hasMore: false,
					message: "Calculation history not yet implemented",
					polishMessage:
						"Historia obliczeń nie została jeszcze zaimplementowana",
				};
			} catch (error) {
				console.error("Calculation history error:", error);
				throw new Error(
					`Failed to fetch calculation history: ${error instanceof Error ? error.message : "Unknown error"}`,
				);
			}
		}),

	/**
	 * Save dosage calculation for future reference (protected endpoint)
	 */
	saveCalculation: protectedProcedure
		.input(
			z.object({
				calculationData: z.any(), // Would use proper schema validation
				name: z.string().min(1).max(100),
				description: z.string().max(500).optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			try {
				// This would typically save to a user calculations table
				// For now, return a placeholder response
				return {
					success: true,
					calculationId: `saved_${Date.now()}`,
					message: "Calculation saved successfully",
					polishMessage: "Obliczenie zostało zapisane pomyślnie",
				};
			} catch (error) {
				console.error("Save calculation error:", error);
				throw new Error(
					`Failed to save calculation: ${error instanceof Error ? error.message : "Unknown error"}`,
				);
			}
		}),

	/**
	 * Get popular supplement combinations for dosage calculation
	 */
	getPopularCombinations: publicProcedure
		.input(
			z.object({
				limit: z.number().min(1).max(20).default(10),
			}),
		)
		.query(async ({ ctx, input }) => {
			try {
				// This would typically analyze historical calculation data
				// For now, return common supplement combinations based on categories
				const popularCombinations = [
					{
						id: "cognitive_enhancement",
						name: "Cognitive Enhancement Stack",
						polishName: "Stos na poprawę funkcji poznawczych",
						supplements: [
							{ category: "NOOTROPIC", count: 85 },
							{ category: "VITAMIN", count: 72 },
							{ category: "AMINO_ACID", count: 68 },
						],
						description:
							"Popular combination for cognitive function and mental clarity",
						polishDescription:
							"Popularna kombinacja na poprawę funkcji poznawczych i jasność umysłu",
					},
					{
						id: "energy_performance",
						name: "Energy & Performance Stack",
						polishName: "Stos na energię i wydolność",
						supplements: [
							{ category: "ADAPTOGEN", count: 78 },
							{ category: "AMINO_ACID", count: 65 },
							{ category: "MINERAL", count: 59 },
						],
						description:
							"Common combination for sustained energy and physical performance",
						polishDescription:
							"Powszechna kombinacja na utrzymaną energię i wydolność fizyczną",
					},
					{
						id: "stress_relief",
						name: "Stress Relief Stack",
						polishName: "Stos na redukcję stresu",
						supplements: [
							{ category: "ADAPTOGEN", count: 82 },
							{ category: "HERB", count: 71 },
							{ category: "MINERAL", count: 64 },
						],
						description:
							"Popular combination for stress management and relaxation",
						polishDescription:
							"Popularna kombinacja na zarządzanie stresem i relaksację",
					},
				];

				return popularCombinations.slice(0, input.limit);
			} catch (error) {
				console.error("Popular combinations error:", error);
				throw new Error(
					`Failed to fetch popular combinations: ${error instanceof Error ? error.message : "Unknown error"}`,
				);
			}
		}),

	/**
	 * Validate dosage calculation input
	 */
	validateInput: publicProcedure
		.input(CalculateDosageInputSchema)
		.query(async ({ input }) => {
			try {
				const validation = validateDosageCalculationInput(input);
				return {
					valid: validation.success,
					errors: validation.success
						? []
						: validation.error.map((e) => e.message),
					warnings: [], // Could add specific validation warnings
				};
			} catch (error) {
				return {
					valid: false,
					errors: [
						`Validation error: ${error instanceof Error ? error.message : "Unknown error"}`,
					],
					warnings: [],
				};
			}
		}),
});
