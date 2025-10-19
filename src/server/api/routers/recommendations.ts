/**
 * Recommendations tRPC Router
 * AI-powered supplement recommendations based on user profile and health goals
 */

import {
	type HealthGoal,
	recommendationEngine,
} from "@/lib/services/recommendation-engine";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { z } from "zod";

// Input schemas
const HealthGoalSchema = z.enum([
	"cognitive_enhancement",
	"memory_improvement",
	"focus_concentration",
	"stress_reduction",
	"anxiety_relief",
	"mood_improvement",
	"energy_boost",
	"sleep_quality",
	"physical_performance",
	"neuroprotection",
	"anti_aging",
	"immune_support",
]);

const UserProfileSchema = z.object({
	age: z.number().min(13).max(120),
	gender: z.enum(["male", "female", "other"]),
	weight: z.number().min(30).max(300).optional(),
	healthGoals: z.array(HealthGoalSchema).min(1).max(5),
	existingConditions: z.array(z.string()).default([]),
	currentMedications: z.array(z.string()).default([]),
	allergies: z.array(z.string()).default([]),
	dietaryRestrictions: z.array(z.string()).default([]),
	experienceLevel: z
		.enum(["beginner", "intermediate", "advanced"])
		.default("beginner"),
});

const GetRecommendationsInputSchema = z.object({
	userProfile: UserProfileSchema,
	limit: z.number().min(1).max(50).default(10),
	language: z.enum(["pl", "en"]).default("pl"),
});

const BuildStackInputSchema = z.object({
	userProfile: UserProfileSchema,
	maxSupplements: z.number().min(1).max(10).default(5),
	budgetLimit: z.number().min(0).max(1000).optional(), // EUR per month
	language: z.enum(["pl", "en"]).default("pl"),
});

export const recommendationsRouter = createTRPCRouter({
	/**
	 * Get personalized supplement recommendations
	 */
	getRecommendations: publicProcedure
		.input(GetRecommendationsInputSchema)
		.query(async ({ ctx, input }) => {
			// Fetch all active supplements
			const supplements = await ctx.db.comprehensiveSupplement
				.find({ isActive: true })
				.select(
					"id name polishName category evidenceLevel clinicalApplications dosageGuidelines tags",
				)
				.lean();

			// Generate recommendations
			const recommendations =
				await recommendationEngine.generateRecommendations(
					supplements,
					input.userProfile,
					input.limit,
				);

			return {
				recommendations,
				userProfile: input.userProfile,
				totalSupplementsAnalyzed: supplements.length,
			};
		}),

	/**
	 * Build optimized supplement stack
	 */
	buildStack: publicProcedure
		.input(BuildStackInputSchema)
		.query(async ({ ctx, input }) => {
			// Fetch all active supplements
			const supplements = await ctx.db.comprehensiveSupplement
				.find({ isActive: true })
				.select(
					"id name polishName category evidenceLevel clinicalApplications dosageGuidelines tags economicData",
				)
				.lean();

			// Generate recommendations
			const recommendations =
				await recommendationEngine.generateRecommendations(
					supplements,
					input.userProfile,
					input.maxSupplements * 2, // Get more to optimize
				);

			// Build stack considering synergies and budget
			const stack: any[] = [];
			const addedIds = new Set<string>();
			let totalCost = 0;

			for (const rec of recommendations) {
				if (stack.length >= input.maxSupplements) break;

				// Check if already added
				if (addedIds.has(rec.supplementId)) continue;

				// Check budget if specified
				const supplement = supplements.find(
					(s: any) => s.id === rec.supplementId,
				);
				if (input.budgetLimit && supplement?.economicData) {
					const monthlyCost =
						supplement.economicData.monthlySupplyCost?.average || 0;
					if (totalCost + monthlyCost > input.budgetLimit) continue;
					totalCost += monthlyCost;
				}

				stack.push(rec);
				addedIds.add(rec.supplementId);

				// Add synergistic supplements if space available
				for (const synId of rec.synergisticWith) {
					if (stack.length >= input.maxSupplements) break;
					if (addedIds.has(synId)) continue;

					const synRec = recommendations.find((r) => r.supplementId === synId);
					if (synRec) {
						const synSupplement = supplements.find((s: any) => s.id === synId);
						if (input.budgetLimit && synSupplement?.economicData) {
							const monthlyCost =
								synSupplement.economicData.monthlySupplyCost?.average || 0;
							if (totalCost + monthlyCost > input.budgetLimit) continue;
							totalCost += monthlyCost;
						}

						stack.push(synRec);
						addedIds.add(synId);
					}
				}
			}

			// Generate synergy descriptions
			const synergies: string[] = [];
			const polishSynergies: string[] = [];

			for (const rec of stack) {
				const synergisticInStack = rec.synergisticWith.filter((id: string) =>
					addedIds.has(id),
				);
				if (synergisticInStack.length > 0) {
					const names = synergisticInStack
						.map((id: string) => {
							const s = stack.find((r) => r.supplementId === id);
							return s?.name || id;
						})
						.join(", ");

					const polishNames = synergisticInStack
						.map((id: string) => {
							const s = stack.find((r) => r.supplementId === id);
							return s?.polishName || id;
						})
						.join(", ");

					synergies.push(`${rec.name} works synergistically with ${names}`);
					polishSynergies.push(
						`${rec.polishName} działa synergicznie z ${polishNames}`,
					);
				}
			}

			// Generate warnings
			const warnings: string[] = [];
			const polishWarnings: string[] = [];

			if (input.userProfile.currentMedications.length > 0) {
				warnings.push(
					"You are taking medications. Consult your physician before starting this stack.",
				);
				polishWarnings.push(
					"Przyjmujesz leki. Skonsultuj się z lekarzem przed rozpoczęciem tej suplementacji.",
				);
			}

			if (
				input.userProfile.experienceLevel === "beginner" &&
				stack.length > 3
			) {
				warnings.push(
					"As a beginner, consider starting with fewer supplements and adding more gradually.",
				);
				polishWarnings.push(
					"Jako początkujący, rozważ rozpoczęcie od mniejszej liczby suplementów i stopniowe dodawanie kolejnych.",
				);
			}

			return {
				name:
					input.language === "pl"
						? "Spersonalizowany Stos Suplementów"
						: "Personalized Supplement Stack",
				polishName: "Spersonalizowany Stos Suplementów",
				supplements: stack,
				totalScore:
					stack.reduce((sum, s) => sum + s.recommendationScore, 0) /
					stack.length,
				synergies,
				polishSynergies,
				warnings,
				polishWarnings,
				estimatedMonthlyCost: {
					min: totalCost * 0.8,
					max: totalCost * 1.2,
					currency: "EUR",
				},
			};
		}),

	/**
	 * Get health goal suggestions based on user input
	 */
	suggestHealthGoals: publicProcedure
		.input(
			z.object({
				symptoms: z.array(z.string()).min(1),
				language: z.enum(["pl", "en"]).default("pl"),
			}),
		)
		.query(async ({ input }) => {
			// Simple keyword matching for health goal suggestions
			const suggestions: HealthGoal[] = [];

			const symptomText = input.symptoms.join(" ").toLowerCase();

			if (
				symptomText.includes("pamięć") ||
				symptomText.includes("memory") ||
				symptomText.includes("zapominanie")
			) {
				suggestions.push("memory_improvement");
			}
			if (
				symptomText.includes("koncentracja") ||
				symptomText.includes("focus") ||
				symptomText.includes("uwaga")
			) {
				suggestions.push("focus_concentration");
			}
			if (symptomText.includes("stres") || symptomText.includes("stress")) {
				suggestions.push("stress_reduction");
			}
			if (
				symptomText.includes("lęk") ||
				symptomText.includes("anxiety") ||
				symptomText.includes("niepokój")
			) {
				suggestions.push("anxiety_relief");
			}
			if (
				symptomText.includes("nastrój") ||
				symptomText.includes("mood") ||
				symptomText.includes("depresja")
			) {
				suggestions.push("mood_improvement");
			}
			if (
				symptomText.includes("energia") ||
				symptomText.includes("energy") ||
				symptomText.includes("zmęczenie")
			) {
				suggestions.push("energy_boost");
			}
			if (
				symptomText.includes("sen") ||
				symptomText.includes("sleep") ||
				symptomText.includes("bezsenność")
			) {
				suggestions.push("sleep_quality");
			}

			return {
				suggestions: [...new Set(suggestions)],
				symptoms: input.symptoms,
			};
		}),

	/**
	 * Compare two supplements
	 */
	compareSupplements: publicProcedure
		.input(
			z.object({
				supplementIds: z.array(z.string()).min(2).max(5),
				userProfile: UserProfileSchema.optional(),
			}),
		)
		.query(async ({ ctx, input }) => {
			const supplements = await ctx.db.comprehensiveSupplement
				.find({
					id: { $in: input.supplementIds },
					isActive: true,
				})
				.select(
					"id name polishName category evidenceLevel clinicalApplications mechanisms dosageGuidelines sideEffects economicData",
				)
				.lean();

			if (supplements.length < 2) {
				throw new Error("At least 2 supplements required for comparison");
			}

			// Calculate scores if user profile provided
			const comparison = supplements.map((supplement: any) => {
				const score = input.userProfile
					? recommendationEngine.calculateScore(
							supplement as any,
							input.userProfile,
						)
					: null;

				return {
					id: supplement.id,
					name: supplement.name,
					polishName: supplement.polishName,
					category: supplement.category,
					evidenceLevel: supplement.evidenceLevel,
					recommendationScore: score,
					clinicalApplicationsCount:
						supplement.clinicalApplications?.length || 0,
					mechanismsCount: supplement.mechanisms?.length || 0,
					sideEffectsCount: supplement.sideEffects?.length || 0,
					monthlyCost:
						supplement.economicData?.monthlySupplyCost?.average || null,
				};
			});

			return {
				supplements: comparison,
				comparisonDate: new Date().toISOString(),
			};
		}),
});
