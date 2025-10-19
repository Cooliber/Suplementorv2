/**
 * Supplement tRPC Router - MongoDB Edition
 * Comprehensive API for supplement data management with Polish localization
 */

import { hybridSupplementsService } from "@/lib/services/hybrid-supplements-service";
import {
	createTRPCRouter,
	protectedProcedure,
	publicProcedure,
} from "@/server/api/trpc";
import {
	EvidenceLevelSchema,
	SupplementCategorySchema,
	type SupplementWithRelations,
} from "@/types/supplement";
import { z } from "zod";

// Input validation schemas
const GetSupplementsInputSchema = z.object({
	category: SupplementCategorySchema.optional(),
	evidenceLevel: EvidenceLevelSchema.optional(),
	search: z.string().optional(),
	tags: z.array(z.string()).optional(),
	limit: z.number().min(1).max(100).default(20),
	offset: z.number().min(0).default(0),
	sortBy: z
		.enum(["name", "polishName", "evidenceLevel", "lastUpdated"])
		.default("name"),
	sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

const GetSupplementByIdInputSchema = z.object({
	id: z.string().cuid(),
	includeRelations: z.boolean().default(true),
});

const SearchSupplementsInputSchema = z.object({
	query: z.string().min(1),
	limit: z.number().min(1).max(50).default(10),
	categories: z.array(SupplementCategorySchema).optional(),
	evidenceLevels: z.array(EvidenceLevelSchema).optional(),
});

const GetInteractionsInputSchema = z.object({
	supplementIds: z.array(z.string().cuid()).min(2).max(10),
	severityFilter: z
		.enum(["severe", "moderate", "minor", "beneficial"])
		.optional(),
});

const GetRecommendationsInputSchema = z.object({
	goals: z.array(z.string()).min(1),
	currentSupplements: z.array(z.string().cuid()).optional(),
	userProfile: z
		.object({
			age: z.number().min(18).max(100).optional(),
			gender: z.enum(["male", "female", "other"]).optional(),
			healthConditions: z.array(z.string()).optional(),
			medications: z.array(z.string()).optional(),
		})
		.optional(),
	maxRecommendations: z.number().min(1).max(10).default(5),
});

export const supplementRouter = createTRPCRouter({
	/**
	 * Get all supplements with filtering and pagination
	 */
	getAll: publicProcedure
		.input(GetSupplementsInputSchema)
		.query(async ({ ctx, input }) => {
			const {
				category,
				evidenceLevel,
				search,
				tags,
				limit,
				offset,
				sortBy,
				sortOrder,
			} = input;

			// Build MongoDB filter
			const filter: any = {};

			if (category) {
				filter.category = category;
			}

			if (evidenceLevel) {
				filter.evidenceLevel = evidenceLevel;
			}

			if (search) {
				filter.$or = [
					{ name: { $regex: search, $options: "i" } },
					{ polishName: { $regex: search, $options: "i" } },
					{ description: { $regex: search, $options: "i" } },
					{ polishDescription: { $regex: search, $options: "i" } },
					{ tags: { $in: [new RegExp(search, "i")] } },
				];
			}

			if (tags && tags.length > 0) {
				filter.tags = { $in: tags };
			}

			// Build sort object
			const sort: any = {};
			sort[sortBy] = sortOrder === "asc" ? 1 : -1;

			const result = await hybridSupplementsService.getAllSupplements(
				{
					category: filter.category,
					evidenceLevel: filter.evidenceLevel,
					searchTerm: search,
					conditions: filter.conditions,
					mechanisms: filter.mechanisms,
				},
				{
					page: Math.floor(offset / limit) + 1,
					limit,
					sortBy: sortBy,
					sortOrder: sortOrder,
				},
			);

			const supplements = result.supplements;
			const totalCount = result.pagination.total;

			return {
				supplements: supplements as any[],
				totalCount,
				hasMore: offset + limit < totalCount,
			};
		}),

	/**
	 * Get supplement by ID with full details
	 */
	getById: publicProcedure
		.input(GetSupplementByIdInputSchema)
		.query(async ({ ctx, input }) => {
			const { id } = input;

			const supplement = await hybridSupplementsService.getSupplementById(id);

			if (!supplement) {
				throw new Error("Supplement not found");
			}

			return supplement as any;
		}),

	/**
	 * Search supplements with full-text search
	 */
	search: publicProcedure
		.input(SearchSupplementsInputSchema)
		.query(async ({ ctx, input }) => {
			const { query, limit, categories, evidenceLevels } = input;

			const filter: any = {
				$or: [
					{ name: { $regex: query, $options: "i" } },
					{ polishName: { $regex: query, $options: "i" } },
					{ commonNames: { $in: [new RegExp(query, "i")] } },
					{ polishCommonNames: { $in: [new RegExp(query, "i")] } },
					{ description: { $regex: query, $options: "i" } },
					{ polishDescription: { $regex: query, $options: "i" } },
					{ tags: { $in: [new RegExp(query, "i")] } },
				],
			};

			if (categories && categories.length > 0) {
				filter.category = { $in: categories };
			}

			if (evidenceLevels && evidenceLevels.length > 0) {
				filter.evidenceLevel = { $in: evidenceLevels };
			}

			const supplements = await hybridSupplementsService.searchSupplements(
				query,
				"pl",
				limit,
			);

			return supplements as any[];
		}),

	/**
	 * Get supplement interactions analysis
	 */
	getInteractions: publicProcedure
		.input(GetInteractionsInputSchema)
		.query(async ({ ctx, input }) => {
			const { supplementIds, severityFilter } = input;

			// Fetch supplements with their interaction data
			const supplementPromises = supplementIds.map((id) =>
				hybridSupplementsService.getSupplementById(id),
			);
			const supplements = (await Promise.all(supplementPromises)).filter(
				Boolean,
			);

			if (supplements.length < 2) {
				return {
					overallRisk: "none" as const,
					interactions: [],
					warnings: [],
					polishWarnings: [],
					supplementCount: supplements.length,
					analysisDate: new Date().toISOString(),
					message: "At least 2 supplements required for interaction analysis",
					polishMessage:
						"Wymagane są co najmniej 2 suplementy do analizy interakcji",
				};
			}

			// Analyze interactions between supplements
			const interactions: any[] = [];
			const warnings: string[] = [];
			const polishWarnings: string[] = [];

			for (let i = 0; i < supplements.length; i++) {
				for (let j = i + 1; j < supplements.length; j++) {
					const supplement1 = supplements[i]!;
					const supplement2 = supplements[j]!;

					// Check interactions from supplement1's data
					const supplement1Interactions = (supplement1.interactions ||
						[]) as any[];
					const relevantInteractions = supplement1Interactions.filter(
						(interaction: any) =>
							interaction.substance
								?.toLowerCase()
								.includes(supplement2.name.toLowerCase()) ||
							interaction.polishSubstance
								?.toLowerCase()
								.includes(supplement2.polishName.toLowerCase()),
					);

					relevantInteractions.forEach((interaction: any) => {
						if (!severityFilter || interaction.severity === severityFilter) {
							interactions.push({
								supplement1: supplement1.name,
								supplement2: supplement2.name,
								polishSupplement1: supplement1.polishName,
								polishSupplement2: supplement2.polishName,
								...interaction,
							});

							if (
								interaction.severity === "severe" ||
								interaction.severity === "moderate"
							) {
								warnings.push(
									`${supplement1.name} + ${supplement2.name}: ${interaction.description}`,
								);
								polishWarnings.push(
									`${supplement1.polishName} + ${supplement2.polishName}: ${interaction.polishDescription || interaction.description}`,
								);
							}
						}
					});
				}
			}

			// Determine overall risk level
			const severityLevels = interactions.map((i: any) => i.severity);
			const overallRisk = severityLevels.includes("severe")
				? ("high" as const)
				: severityLevels.includes("moderate")
					? ("medium" as const)
					: ("low" as const);

			return {
				overallRisk,
				interactions,
				warnings,
				polishWarnings,
				supplementCount: supplements.length,
				analysisDate: new Date().toISOString(),
			};
		}),

	/**
	 * Get personalized supplement recommendations
	 */
	getRecommendations: publicProcedure
		.input(GetRecommendationsInputSchema)
		.query(async ({ ctx, input }) => {
			const {
				goals,
				currentSupplements = [],
				userProfile,
				maxRecommendations,
			} = input;

			// Get all supplements for analysis
			const result = await hybridSupplementsService.getAllSupplements(
				{},
				{ limit: 1000 }, // Get all supplements for analysis
			);
			const allSupplements = result.supplements.filter(
				(supplement) => !currentSupplements.includes(supplement.id),
			);

			// Simple recommendation algorithm based on goals and evidence
			const recommendations = allSupplements
				.filter((supplement: any) => {
					const supplementData = supplement as any;
					const clinicalApplications =
						supplementData.clinicalApplications as any[];

					// Check if supplement addresses any of the user's goals
					return goals.some((goal: string) =>
						clinicalApplications.some(
							(app: any) =>
								app.condition.toLowerCase().includes(goal.toLowerCase()) ||
								app.polishCondition.toLowerCase().includes(goal.toLowerCase()),
						),
					);
				})
				.slice(0, maxRecommendations)
				.map((supplement: any) => ({
					supplement: {
						...supplement,
						activeCompounds: supplement.activeCompounds as any,
						clinicalApplications: supplement.clinicalApplications as any,
						mechanisms: supplement.mechanisms as any,
						dosageGuidelines: supplement.dosageGuidelines as any,
						sideEffects: supplement.sideEffects as any,
						interactions: supplement.interactions as any,
						researchStudies: supplement.researchStudies as any,
					} as SupplementWithRelations,
					matchingGoals: goals.filter((goal) => {
						const clinicalApplications =
							supplement.clinicalApplications as any[];
						return clinicalApplications.some(
							(app: any) =>
								app.condition.toLowerCase().includes(goal.toLowerCase()) ||
								app.polishCondition.toLowerCase().includes(goal.toLowerCase()),
						);
					}),
					confidenceScore:
						supplement.evidenceLevel === "STRONG"
							? 0.9
							: supplement.evidenceLevel === "MODERATE"
								? 0.7
								: supplement.evidenceLevel === "WEAK"
									? 0.5
									: 0.3,
				}));

			return {
				recommendations,
				totalFound: recommendations.length,
				goals,
				analysisDate: new Date().toISOString(),
			};
		}),

	/**
	 * Get supplement categories with counts
	 */
	getCategories: publicProcedure.query(async ({ ctx }) => {
		const statistics = await hybridSupplementsService.getStatistics();

		const statsData =
			statistics && typeof statistics === "object" && "byCategory" in statistics
				? statistics
				: (statistics as any).data || { byCategory: {} };
		return Object.entries(statsData.byCategory || {}).map(
			([category, count]) => ({
				category,
				count,
			}),
		);
	}),

	/**
	 * Get popular supplements (most researched/highest evidence)
	 */
	getPopular: publicProcedure
		.input(
			z.object({
				limit: z.number().min(1).max(20).default(10),
			}),
		)
		.query(async ({ ctx, input }) => {
			const { limit } = input;

			const popularSupplements =
				await hybridSupplementsService.getPopularSupplements(limit);

			return popularSupplements as any[];
		}),
});
