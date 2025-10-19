import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { z } from "zod";

const medicineSystemEnum = z.enum([
	"TCM",
	"AYURVEDA",
	"GREEK_ROMAN",
	"EUROPEAN_HERBALISM",
	"MODERN_SCIENCE",
	"OTHER",
]);

export const supplementHistoryRouter = createTRPCRouter({
	getAll: publicProcedure
		.input(
			z
				.object({
					limit: z.number().min(1).max(100).optional(),
					skip: z.number().min(0).optional(),
				})
				.optional(),
		)
		.query(async ({ ctx, input }) => {
			const limit = input?.limit ?? 50;
			const skip = input?.skip ?? 0;
			return ctx.db.supplementHistory
				.find({})
				.sort({ eraStartYear: 1, title: 1 })
				.skip(skip)
				.limit(limit)
				.lean();
		}),

	getById: publicProcedure
		.input(z.object({ id: z.string().min(1) }))
		.query(async ({ ctx, input }) => {
			return ctx.db.supplementHistory.findOne({ id: input.id }).lean();
		}),

	getByMedicineSystem: publicProcedure
		.input(
			z.object({
				system: medicineSystemEnum,
				eraStartFrom: z.number().optional(),
				eraStartTo: z.number().optional(),
			}),
		)
		.query(async ({ ctx, input }) => {
			const q: any = { medicineSystem: input.system };
			if (input.eraStartFrom != null || input.eraStartTo != null) {
				q.eraStartYear = {};
				if (input.eraStartFrom != null)
					q.eraStartYear.$gte = input.eraStartFrom;
				if (input.eraStartTo != null) q.eraStartYear.$lte = input.eraStartTo;
			}
			return ctx.db.supplementHistory.find(q).sort({ eraStartYear: 1 }).lean();
		}),

	getTimeline: publicProcedure
		.input(z.object({ system: medicineSystemEnum.optional() }).optional())
		.query(async ({ ctx, input }) => {
			const match = input?.system ? { medicineSystem: input.system } : {};
			return ctx.db.supplementHistory
				.find(match)
				.sort({ eraStartYear: 1 })
				.select({
					id: 1,
					title: 1,
					polishTitle: 1,
					era: 1,
					eraStartYear: 1,
					eraEndYear: 1,
					medicineSystem: 1,
					tags: 1,
				})
				.lean();
		}),

	getRelatedHistory: publicProcedure
		.input(z.object({ supplementMongoId: z.string().min(1) }))
		.query(async ({ ctx, input }) => {
			// Using string IDs; Mongoose can cast to ObjectId on query
			return ctx.db.supplementHistory
				.find({ relatedSupplements: input.supplementMongoId })
				.sort({ eraStartYear: 1 })
				.lean();
		}),

	search: publicProcedure
		.input(
			z.object({
				q: z.string().min(1),
				limit: z.number().min(1).max(50).optional(),
			}),
		)
		.query(async ({ ctx, input }) => {
			const limit = input.limit ?? 20;
			const q = input.q.trim();
			// Use MongoDB text search; fallback to regex if needed
			const items = await ctx.db.supplementHistory
				.find({ $text: { $search: q } }, { score: { $meta: "textScore" } })
				.sort({ score: { $meta: "textScore" } })
				.limit(limit)
				.lean();
			if (items.length > 0) return items;
			return ctx.db.supplementHistory
				.find({
					$or: [
						{ title: new RegExp(q, "i") },
						{ polishTitle: new RegExp(q, "i") },
						{ description: new RegExp(q, "i") },
						{ polishDescription: new RegExp(q, "i") },
						{ tags: new RegExp(q, "i") },
					],
				})
				.limit(limit)
				.lean();
		}),
});

export type SupplementHistoryRouter = typeof supplementHistoryRouter;
