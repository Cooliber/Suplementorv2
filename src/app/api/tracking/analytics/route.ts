/**
 * Tracking Analytics API Route
 * Provides comprehensive analytics for supplement tracking data
 */

import {
	EffectMeasurement,
	SupplementIntakeLog,
	SupplementSchedule,
} from "@/lib/db/models";
import connectToDatabase from "@/lib/db/mongodb";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Request validation schemas
const GetAnalyticsSchema = z.object({
	userId: z.string().min(1),
	startDate: z.string().datetime(),
	endDate: z.string().datetime(),
	supplementIds: z.string().optional(), // Comma-separated list
	includeAdherence: z.coerce.boolean().default(true),
	includeEffectiveness: z.coerce.boolean().default(true),
	includeSideEffects: z.coerce.boolean().default(true),
	includeOptimization: z.coerce.boolean().default(true),
});

/**
 * GET /api/tracking/analytics
 * Generate comprehensive tracking analytics
 */
export async function GET(request: NextRequest) {
	try {
		await connectToDatabase();

		const { searchParams } = new URL(request.url);
		const params = Object.fromEntries(searchParams.entries());

		// Validate query parameters
		const validatedParams = GetAnalyticsSchema.parse(params);

		const startDate = new Date(validatedParams.startDate);
		const endDate = new Date(validatedParams.endDate);
		const supplementIds = validatedParams.supplementIds
			? validatedParams.supplementIds.split(",").map((id) => id.trim())
			: undefined;

		// Base query for user and date range
		const baseQuery: any = {
			userId: validatedParams.userId,
			createdAt: { $gte: startDate, $lte: endDate },
		};

		// Add supplement filter if provided
		if (supplementIds) {
			baseQuery.supplementId = { $in: supplementIds };
		}

		// Initialize analytics result
		const analytics: any = {
			userId: validatedParams.userId,
			timeframe: {
				start: validatedParams.startDate,
				end: validatedParams.endDate,
			},
			overview: {},
			adherence: {},
			effectiveness: {},
			sideEffects: {},
			optimization: {},
			generatedAt: new Date().toISOString(),
		};

		// Get overview metrics
		const [totalIntakes, activeSupplements, totalSchedules, sideEffectsCount] =
			await Promise.all([
				SupplementIntakeLog.countDocuments(baseQuery),
				SupplementIntakeLog.distinct("supplementId", baseQuery),
				SupplementSchedule.countDocuments({
					userId: validatedParams.userId,
					active: true,
					"duration.startDate": { $lte: endDate },
					$or: [
						{ "duration.endDate": { $exists: false } },
						{ "duration.endDate": { $gte: startDate } },
					],
				}),
				SupplementIntakeLog.countDocuments({
					...baseQuery,
					"sideEffects.experienced": true,
				}),
			]);

		analytics.overview = {
			totalSupplements: supplementIds
				? supplementIds.length
				: activeSupplements.length,
			activeSupplements: activeSupplements.length,
			averageAdherence: 0, // Will be calculated below
			totalIntakes,
			missedDoses: 0, // Will be calculated below
			sideEffectsReported: sideEffectsCount,
		};

		// Adherence Analysis
		if (validatedParams.includeAdherence) {
			const adherenceData = await SupplementIntakeLog.aggregate([
				{ $match: baseQuery },
				{
					$group: {
						_id: {
							supplementId: "$supplementId",
							timeOfDay: "$timing.timeOfDay",
							dayOfWeek: { $dayOfWeek: "$timing.timestamp" },
							withFood: "$timing.withFood",
						},
						totalIntakes: { $sum: 1 },
						plannedIntakes: {
							$sum: { $cond: ["$adherence.planned", 1, 0] },
						},
						missedDoses: {
							$sum: { $cond: ["$adherence.missed", 1, 0] },
						},
						avgMood: { $avg: "$context.mood" },
						avgEnergy: { $avg: "$context.energy" },
					},
				},
				{
					$group: {
						_id: "$_id.supplementId",
						adherenceRate: {
							$avg: {
								$divide: ["$plannedIntakes", "$totalIntakes"],
							},
						},
						timeOfDayStats: {
							$push: {
								timeOfDay: "$_id.timeOfDay",
								intakes: "$totalIntakes",
								adherenceRate: {
									$divide: ["$plannedIntakes", "$totalIntakes"],
								},
							},
						},
						dayOfWeekStats: {
							$push: {
								dayOfWeek: "$_id.dayOfWeek",
								intakes: "$totalIntakes",
							},
						},
						withFoodStats: {
							$push: {
								withFood: "$_id.withFood",
								intakes: "$totalIntakes",
							},
						},
						totalMissed: { $sum: "$missedDoses" },
						avgMood: { $avg: "$avgMood" },
						avgEnergy: { $avg: "$avgEnergy" },
					},
				},
			]);

			// Process adherence data
			const bySupplementId: any = {};
			let totalAdherence = 0;
			let totalMissed = 0;

			for (const data of adherenceData) {
				const adherenceRate = data.adherenceRate || 0;
				totalAdherence += adherenceRate;
				totalMissed += data.totalMissed || 0;

				// Determine best time of day
				const bestTime = data.timeOfDayStats.reduce(
					(best: any, current: any) =>
						current.adherenceRate > (best?.adherenceRate || 0) ? current : best,
					null,
				);

				bySupplementId[data._id] = {
					adherenceRate,
					trend: "stable", // Would need time-series analysis
					polishTrend: "stabilny",
					bestTimeOfDay: bestTime?.timeOfDay || "morning",
					polishBestTimeOfDay: translateTimeOfDay(
						bestTime?.timeOfDay || "morning",
					),
					consistencyScore: adherenceRate, // Simplified
				};
			}

			analytics.overview.averageAdherence =
				adherenceData.length > 0 ? totalAdherence / adherenceData.length : 0;
			analytics.overview.missedDoses = totalMissed;

			analytics.adherence = {
				bySupplementId,
				overallTrend: "stable",
				polishOverallTrend: "stabilny",
				factors: {
					timeOfDay: calculateTimeOfDayFactors(adherenceData),
					dayOfWeek: calculateDayOfWeekFactors(adherenceData),
					withFood: calculateWithFoodFactors(adherenceData),
				},
			};
		}

		// Effectiveness Analysis
		if (validatedParams.includeEffectiveness) {
			const effectivenessQuery: any = {
				userId: validatedParams.userId,
				"measurement.timestamp": { $gte: startDate, $lte: endDate },
			};

			if (supplementIds) {
				effectivenessQuery.supplementId = { $in: supplementIds };
			}

			const effectivenessData = await EffectMeasurement.aggregate([
				{ $match: effectivenessQuery },
				{
					$group: {
						_id: {
							supplementId: "$supplementId",
							targetEffect: "$targetEffectName",
						},
						measurements: {
							$push: {
								value: "$measurement.value",
								timestamp: "$measurement.timestamp",
							},
						},
						avgValue: { $avg: "$measurement.value" },
						minValue: { $min: "$measurement.value" },
						maxValue: { $max: "$measurement.value" },
						count: { $sum: 1 },
					},
				},
				{
					$group: {
						_id: "$_id.supplementId",
						targetEffects: {
							$push: {
								effect: "$_id.targetEffect",
								baseline: "$minValue",
								current: "$avgValue",
								change: { $subtract: ["$avgValue", "$minValue"] },
								changePercent: {
									$multiply: [
										{
											$divide: [
												{ $subtract: ["$avgValue", "$minValue"] },
												"$minValue",
											],
										},
										100,
									],
								},
								significance: "moderate", // Would need statistical analysis
							},
						},
						overallEffectiveness: { $avg: "$avgValue" },
					},
				},
			]);

			const bySupplementId: any = {};
			for (const data of effectivenessData) {
				const targetEffects: any = {};
				for (const effect of data.targetEffects) {
					targetEffects[effect.effect] = {
						baseline: effect.baseline,
						current: effect.current,
						change: effect.change,
						changePercent: effect.changePercent,
						significance: effect.significance,
						polishSignificance: translateSignificance(effect.significance),
					};
				}

				bySupplementId[data._id] = {
					targetEffects,
					overallEffectiveness: data.overallEffectiveness / 10, // Normalize to 0-1
					timeToEffect: "2-4 weeks", // Would need time-series analysis
					polishTimeToEffect: "2-4 tygodnie",
				};
			}

			analytics.effectiveness = { bySupplementId };
		}

		// Side Effects Analysis
		if (validatedParams.includeSideEffects) {
			const sideEffectsData = await SupplementIntakeLog.aggregate([
				{
					$match: {
						...baseQuery,
						"sideEffects.experienced": true,
					},
				},
				{ $unwind: "$sideEffects.effects" },
				{
					$group: {
						_id: {
							supplementId: "$supplementId",
							effectType: "$sideEffects.effects.polishType",
							severity: "$sideEffects.severity",
						},
						count: { $sum: 1 },
						avgSeverity: { $avg: "$sideEffects.effects.severity" },
					},
				},
				{
					$group: {
						_id: null,
						totalSideEffects: { $sum: "$count" },
						bySeverity: {
							$push: {
								severity: "$_id.severity",
								count: "$count",
							},
						},
						commonEffects: {
							$push: {
								type: "$_id.effectType",
								polishType: "$_id.effectType",
								frequency: "$count",
								averageSeverity: "$avgSeverity",
							},
						},
					},
				},
			]);

			const sideEffectsResult = sideEffectsData[0] || {
				totalSideEffects: 0,
				bySeverity: [],
				commonEffects: [],
			};

			analytics.sideEffects = {
				frequency:
					totalIntakes > 0
						? (sideEffectsResult.totalSideEffects / totalIntakes) * 100
						: 0,
				severity: processSeverityData(sideEffectsResult.bySeverity),
				polishSeverity: processSeverityDataPolish(sideEffectsResult.bySeverity),
				commonEffects: sideEffectsResult.commonEffects.slice(0, 5),
				bySupplementId: {}, // Would need more detailed analysis
			};
		}

		// Optimization Recommendations
		if (validatedParams.includeOptimization) {
			analytics.optimization = {
				timingOptimization: [],
				dosageOptimization: [],
				stackOptimization: [],
			};
		}

		return NextResponse.json({
			success: true,
			data: analytics,
		});
	} catch (error) {
		console.error("Error generating analytics:", error);

		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{
					success: false,
					error: "Invalid query parameters",
					details: error.errors,
				},
				{ status: 400 },
			);
		}

		return NextResponse.json(
			{
				success: false,
				error: "Internal server error",
			},
			{ status: 500 },
		);
	}
}

// Helper functions
function translateTimeOfDay(timeOfDay: string): string {
	const translations: Record<string, string> = {
		morning: "rano",
		afternoon: "po południu",
		evening: "wieczorem",
		night: "w nocy",
	};
	return translations[timeOfDay] || timeOfDay;
}

function translateSignificance(significance: string): string {
	const translations: Record<string, string> = {
		significant: "znaczący",
		moderate: "umiarkowany",
		minimal: "minimalny",
		none: "brak",
	};
	return translations[significance] || significance;
}

function calculateTimeOfDayFactors(data: any[]): Record<string, number> {
	const factors: Record<string, number> = {};
	// Implementation would aggregate time of day statistics
	return factors;
}

function calculateDayOfWeekFactors(data: any[]): Record<string, number> {
	const factors: Record<string, number> = {};
	// Implementation would aggregate day of week statistics
	return factors;
}

function calculateWithFoodFactors(data: any[]): {
	with: number;
	without: number;
} {
	// Implementation would aggregate with/without food statistics
	return { with: 0, without: 0 };
}

function processSeverityData(severityData: any[]): Record<string, number> {
	const result: Record<string, number> = { mild: 0, moderate: 0, severe: 0 };
	for (const item of severityData) {
		if (result[item.severity] !== undefined) {
			result[item.severity] = item.count;
		}
	}
	return result;
}

function processSeverityDataPolish(
	severityData: any[],
): Record<string, number> {
	const result: Record<string, number> = {
		łagodne: 0,
		umiarkowane: 0,
		ciężkie: 0,
	};
	const translations: Record<string, string> = {
		mild: "łagodne",
		moderate: "umiarkowane",
		severe: "ciężkie",
	};

	for (const item of severityData) {
		const polishKey = translations[item.severity];
		if (polishKey && result[polishKey] !== undefined) {
			result[polishKey] = item.count;
		}
	}
	return result;
}
