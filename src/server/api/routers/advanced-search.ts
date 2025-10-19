/**
 * Advanced Search tRPC Router
 * Provides advanced search capabilities with Polish NLP
 */

import { polishSearchService } from "@/lib/services/polish-search-service";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import {
	EvidenceLevelSchema,
	SupplementCategorySchema,
} from "@/types/supplement";
import { z } from "zod";

// Input schemas
const AdvancedSearchInputSchema = z.object({
	query: z.string().min(1).max(200),
	language: z.enum(["pl", "en"]).default("pl"),
	fuzzyMatch: z.boolean().default(true),
	includeSynonyms: z.boolean().default(true),
	categories: z.array(SupplementCategorySchema).optional(),
	evidenceLevels: z.array(EvidenceLevelSchema).optional(),
	minEffectiveness: z.number().min(0).max(10).optional(),
	limit: z.number().min(1).max(100).default(20),
	offset: z.number().min(0).default(0),
});

const AutocompleteInputSchema = z.object({
	query: z.string().min(1).max(100),
	language: z.enum(["pl", "en"]).default("pl"),
	limit: z.number().min(1).max(10).default(5),
});

const SuggestionsInputSchema = z.object({
	query: z.string().min(1).max(100),
	language: z.enum(["pl", "en"]).default("pl"),
});

export const advancedSearchRouter = createTRPCRouter({
	/**
	 * Advanced search with Polish NLP
	 */
	search: publicProcedure
		.input(AdvancedSearchInputSchema)
		.query(async ({ ctx, input }) => {
			// Process query with Polish NLP
			const processedQuery = polishSearchService.processQuery(input.query, {
				language: input.language,
				fuzzyMatch: input.fuzzyMatch,
				includeSynonyms: input.includeSynonyms,
			});

			// Build MongoDB query
			const mongoQuery: any = { isActive: true };

			// Category filter
			if (input.categories && input.categories.length > 0) {
				mongoQuery.category = { $in: input.categories };
			}

			// Evidence level filter
			if (input.evidenceLevels && input.evidenceLevels.length > 0) {
				mongoQuery.evidenceLevel = { $in: input.evidenceLevels };
			}

			// Text search using expanded terms
			if (processedQuery.expandedTerms.length > 0) {
				const searchRegexes = processedQuery.expandedTerms.map(
					(term) => new RegExp(term, "i"),
				);

				mongoQuery.$or = [
					{ name: { $in: searchRegexes } },
					{ polishName: { $in: searchRegexes } },
					{ description: { $in: searchRegexes } },
					{ polishDescription: { $in: searchRegexes } },
					{ searchKeywords: { $in: searchRegexes } },
					{ polishSearchKeywords: { $in: searchRegexes } },
					{ tags: { $in: searchRegexes } },
				];
			}

			// Fetch supplements
			const supplements = await ctx.db.comprehensiveSupplement
				.find(mongoQuery)
				.select(
					"id name polishName category description polishDescription tags evidenceLevel",
				)
				.lean();

			// Calculate relevance scores
			const scoredResults = supplements.map((supplement) => {
				const { score, matchedTerms } = polishSearchService.calculateRelevance(
					supplement,
					processedQuery,
					{
						fuzzyMatch: input.fuzzyMatch,
						categories: input.categories,
					},
				);

				const snippet = polishSearchService.generateSnippet(
					input.language === "pl"
						? supplement.polishDescription
						: supplement.description || "",
					matchedTerms,
				);

				return {
					id: supplement.id,
					name: supplement.name,
					polishName: supplement.polishName,
					category: supplement.category,
					evidenceLevel: supplement.evidenceLevel,
					relevanceScore: score,
					matchedTerms,
					snippet,
				};
			});

			// Sort by relevance score
			scoredResults.sort((a, b) => b.relevanceScore - a.relevanceScore);

			// Apply pagination
			const paginatedResults = scoredResults.slice(
				input.offset,
				input.offset + input.limit,
			);

			return {
				results: paginatedResults,
				total: scoredResults.length,
				query: input.query,
				processedQuery: {
					searchTerms: processedQuery.searchTerms,
					expandedTerms: processedQuery.expandedTerms,
				},
				pagination: {
					offset: input.offset,
					limit: input.limit,
					hasMore: input.offset + input.limit < scoredResults.length,
				},
			};
		}),

	/**
	 * Autocomplete suggestions
	 */
	autocomplete: publicProcedure
		.input(AutocompleteInputSchema)
		.query(async ({ ctx, input }) => {
			const searchRegex = new RegExp(input.query, "i");

			const supplements = await ctx.db.comprehensiveSupplement
				.find({
					isActive: true,
					$or: [
						{ name: searchRegex },
						{ polishName: searchRegex },
						{ searchKeywords: searchRegex },
						{ polishSearchKeywords: searchRegex },
					],
				})
				.select("id name polishName category")
				.limit(input.limit)
				.lean();

			return supplements.map((s) => ({
				id: s.id,
				name: input.language === "pl" ? s.polishName : s.name,
				category: s.category,
			}));
		}),

	/**
	 * Search suggestions based on query
	 */
	suggestions: publicProcedure
		.input(SuggestionsInputSchema)
		.query(async ({ input }) => {
			const processedQuery = polishSearchService.processQuery(input.query, {
				language: input.language,
				includeSynonyms: true,
			});

			return {
				originalQuery: input.query,
				suggestions: processedQuery.expandedTerms.slice(0, 10),
				didYouMean: processedQuery.searchTerms,
			};
		}),

	/**
	 * Get popular search terms
	 */
	popularSearches: publicProcedure
		.input(
			z.object({
				language: z.enum(["pl", "en"]).default("pl"),
				limit: z.number().min(1).max(20).default(10),
			}),
		)
		.query(async ({ input }) => {
			// In production, this would come from analytics/search logs
			// For now, return common Polish search terms
			const popularPolish = [
				"pamięć",
				"koncentracja",
				"energia",
				"sen",
				"lęk",
				"stres",
				"nootropik",
				"witamina D",
				"omega-3",
				"magnez",
			];

			const popularEnglish = [
				"memory",
				"focus",
				"energy",
				"sleep",
				"anxiety",
				"stress",
				"nootropic",
				"vitamin D",
				"omega-3",
				"magnesium",
			];

			const terms = input.language === "pl" ? popularPolish : popularEnglish;

			return terms.slice(0, input.limit);
		}),

	/**
	 * Get search statistics
	 */
	searchStats: publicProcedure.query(async ({ ctx }) => {
		const totalSupplements =
			await ctx.db.comprehensiveSupplement.countDocuments({
				isActive: true,
			});

		const categoryStats = await ctx.db.comprehensiveSupplement.aggregate([
			{ $match: { isActive: true } },
			{ $group: { _id: "$category", count: { $sum: 1 } } },
			{ $sort: { count: -1 } },
		]);

		const evidenceStats = await ctx.db.comprehensiveSupplement.aggregate([
			{ $match: { isActive: true } },
			{ $group: { _id: "$evidenceLevel", count: { $sum: 1 } } },
			{ $sort: { count: -1 } },
		]);

		return {
			totalSupplements,
			byCategory: categoryStats.map((s) => ({
				category: s._id,
				count: s.count,
			})),
			byEvidenceLevel: evidenceStats.map((s) => ({
				evidenceLevel: s._id,
				count: s.count,
			})),
		};
	}),

	/**
	 * Find similar supplements
	 */
	findSimilar: publicProcedure
		.input(
			z.object({
				supplementId: z.string(),
				limit: z.number().min(1).max(20).default(5),
			}),
		)
		.query(async ({ ctx, input }) => {
			// Get the reference supplement
			const supplement = await ctx.db.comprehensiveSupplement
				.findOne({
					id: input.supplementId,
					isActive: true,
				})
				.lean();

			if (!supplement) {
				throw new Error("Supplement not found");
			}

			// Find similar supplements based on category and tags
			const similar = await ctx.db.comprehensiveSupplement
				.find({
					isActive: true,
					id: { $ne: supplement.id },
					$or: [
						{ category: supplement.category },
						{ tags: { $in: supplement.tags || [] } },
					],
				})
				.select("id name polishName category evidenceLevel tags")
				.limit(input.limit * 2) // Get more to score
				.lean();

			// Calculate similarity scores
			const scored = similar.map((s) => {
				let score = 0;

				// Same category
				if (s.category === supplement.category) score += 50;

				// Shared tags
				const sharedTags = (s.tags || []).filter((tag) =>
					(supplement.tags || []).includes(tag),
				);
				score += sharedTags.length * 10;

				return { ...s, similarityScore: score };
			});

			// Sort by similarity and limit
			scored.sort((a, b) => b.similarityScore - a.similarityScore);

			return scored.slice(0, input.limit);
		}),
});
