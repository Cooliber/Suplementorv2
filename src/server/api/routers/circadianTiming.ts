/**
 * Circadian Timing tRPC Router
 * API endpoints for querying circadian rhythm and supplement timing data
 * TODO: Fix TypeScript issues with Mongoose model integration
 */

import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

// Zod schema for timeOfDay enum
const TimeOfDayEnum = z.enum([
	"EARLY_MORNING",
	"LATE_MORNING",
	"AFTERNOON",
	"EVENING",
	"NIGHT",
	"DEEP_NIGHT",
]);

// Temporarily disabled due to TypeScript issues with Mongoose model
/*
export const circadianTimingRouter = createTRPCRouter({
	/**
	 * Get all circadian timing entries
	 * Returns all 6 time periods with body statistics and supplement recommendations
	 */
/*getAll: publicProcedure.query(async ({ ctx }) => {
		const timePeriods = await ctx.db.circadianSupplementTiming
			.find({})
			.sort({ timeOfDay: 1 });

		return timePeriods as any[];
	}),

	/**
	 * Get circadian timing data for a specific time of day
	 * @param timeOfDay - One of: EARLY_MORNING, LATE_MORNING, AFTERNOON, EVENING, NIGHT, DEEP_NIGHT
	 */
/*getByTimeOfDay: publicProcedure
		.input(
			z.object({
				timeOfDay: TimeOfDayEnum,
			}),
		)
		.query(async ({ ctx, input }) => {
			const timePeriod = await ctx.db.circadianSupplementTiming
				.findOne({ timeOfDay: input.timeOfDay });

			if (!timePeriod) {
				throw new Error(
					`No circadian timing data found for time of day: ${input.timeOfDay}`,
				);
			}

			return timePeriod as any;
		}),

	/**
	 * Get time periods when a specific supplement is recommended
	 * @param supplementId - The supplement ID to search for
	 */
/*getRecommendationsForSupplement: publicProcedure
		.input(
			z.object({
				supplementId: z.string().min(1),
			}),
		)
		.query(async ({ ctx, input }) => {
			const timePeriods = await ctx.db.circadianSupplementTiming
				.find({
					"recommendedSupplements.supplementId": input.supplementId,
				})
				.sort({ timeOfDay: 1 });

			return timePeriods as any[];
		}),

	/**
	 * Get current time period based on current hour
	 * Automatically determines which time period the user is in
	 */
/*getCurrentTimePeriod: publicProcedure.query(async ({ ctx }) => {
		const currentHour = new Date().getHours();

		let timeOfDay: z.infer<typeof TimeOfDayEnum>;

		if (currentHour >= 5 && currentHour < 8) {
			timeOfDay = "EARLY_MORNING";
		} else if (currentHour >= 8 && currentHour < 12) {
			timeOfDay = "LATE_MORNING";
		} else if (currentHour >= 12 && currentHour < 16) {
			timeOfDay = "AFTERNOON";
		} else if (currentHour >= 16 && currentHour < 20) {
			timeOfDay = "EVENING";
		} else if (currentHour >= 20 || currentHour < 0) {
			timeOfDay = "NIGHT";
		} else {
			timeOfDay = "DEEP_NIGHT";
		}

		const timePeriod = await ctx.db.circadianSupplementTiming
			.findOne({ timeOfDay });

		return timePeriod as any;
	}),

	/**
	 * Get supplements to avoid at a specific time
	 * @param timeOfDay - The time of day to check
	 */
/*getSupplementsToAvoid: publicProcedure
		.input(
			z.object({
				timeOfDay: TimeOfDayEnum,
			}),
		)
		.query(async ({ ctx, input }) => {
			const timePeriod = await ctx.db.circadianSupplementTiming
				.findOne({ timeOfDay: input.timeOfDay })
				.select("avoidSupplements polishAvoidSupplements timeOfDay polishTimeOfDay");

			if (!timePeriod) {
				return {
					timeOfDay: input.timeOfDay,
					avoidSupplements: [],
					polishAvoidSupplements: [],
				};
			}

			return {
				timeOfDay: timePeriod.timeOfDay,
				polishTimeOfDay: timePeriod.polishTimeOfDay,
				avoidSupplements: timePeriod.avoidSupplements,
				polishAvoidSupplements: timePeriod.polishAvoidSupplements,
			};
		}),

	/**
	 * Get body statistics for all time periods
	 * Useful for visualizing circadian rhythm patterns
	 */
/*getBodyStatisticsTimeline: publicProcedure.query(async ({ ctx }) => {
		const timePeriods = await ctx.db.circadianSupplementTiming
			.find({})
			.select("timeOfDay polishTimeOfDay timeRange bodyStatistics")
			.sort({ timeOfDay: 1 });

		return timePeriods.map((period: { timeOfDay: string; polishTimeOfDay: string; timeRange: string; bodyStatistics: any }) => ({
			timeOfDay: period.timeOfDay,
			polishTimeOfDay: period.polishTimeOfDay,
			timeRange: period.timeRange,
			temperature: period.bodyStatistics.temperature,
			cortisol: period.bodyStatistics.cortisol,
			melatonin: period.bodyStatistics.melatonin,
			digestiveEfficiency: period.bodyStatistics.digestiveEfficiency,
			alertness: period.bodyStatistics.alertness,
			polishDescription: period.bodyStatistics.polishDescription,
		}));
	}),
});
*/

// Temporarily disabled export due to TypeScript issues
// export { circadianTimingRouter };
