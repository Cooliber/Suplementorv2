/**
 * Tracking Analytics API Route
 * Provides comprehensive analytics for supplement tracking data
 */

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
 * Generate comprehensive tracking analytics (using hardcoded data - no persistence)
 */
export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const params = Object.fromEntries(searchParams.entries());

		// Validate query parameters
		const validatedParams = GetAnalyticsSchema.parse(params);

		// For hardcoded deployment, return mock analytics data
		const analytics: any = {
			userId: validatedParams.userId,
			timeframe: {
				start: validatedParams.startDate,
				end: validatedParams.endDate,
			},
			overview: {
				totalSupplements: 0,
				activeSupplements: 0,
				averageAdherence: 0,
				totalIntakes: 0,
				missedDoses: 0,
				sideEffectsReported: 0,
			},
			adherence: {
				bySupplementId: {},
				overallTrend: "stable",
				polishOverallTrend: "stabilny",
				factors: {
					timeOfDay: {},
					dayOfWeek: {},
					withFood: { with: 0, without: 0 },
				},
			},
			effectiveness: {
				bySupplementId: {},
			},
			sideEffects: {
				frequency: 0,
				severity: { mild: 0, moderate: 0, severe: 0 },
				polishSeverity: { łagodne: 0, umiarkowane: 0, ciężkie: 0 },
				commonEffects: [],
				bySupplementId: {},
			},
			optimization: {
				timingOptimization: [],
				dosageOptimization: [],
				stackOptimization: [],
			},
			generatedAt: new Date().toISOString(),
			message: "Analytics not available in hardcoded data mode",
		};

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
