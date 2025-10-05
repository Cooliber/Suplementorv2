/**
 * Supplement Intake Tracking API Route
 * Handles logging and retrieving supplement intake data
 */

import { SupplementIntakeLog } from "@/lib/db/models";
import connectToDatabase from "@/lib/db/mongodb";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Request validation schemas
const LogIntakeSchema = z.object({
	userId: z.string().min(1),
	supplementId: z.string().min(1),
	supplementName: z.string().min(1),
	polishSupplementName: z.string().min(1),
	dosage: z.object({
		amount: z.number().positive(),
		unit: z.string().min(1),
		form: z.enum(["capsule", "tablet", "powder", "liquid", "gummy"]),
		polishForm: z.string().min(1),
	}),
	timing: z.object({
		timestamp: z.string().datetime(),
		timeOfDay: z.enum(["morning", "afternoon", "evening", "night"]),
		polishTimeOfDay: z.string().min(1),
		withFood: z.boolean(),
		mealTiming: z.enum(["before", "with", "after", "empty_stomach"]),
		polishMealTiming: z.string().min(1),
	}),
	context: z.object({
		mood: z.number().int().min(1).max(5),
		energy: z.number().int().min(1).max(5),
		stress: z.number().int().min(1).max(5),
		sleep: z.number().int().min(1).max(5),
		notes: z.string().optional(),
		polishNotes: z.string().optional(),
		weather: z.string().optional(),
		exercise: z.boolean().default(false),
		alcohol: z.boolean().default(false),
		otherMedications: z.array(z.string()).default([]),
	}),
	adherence: z.object({
		planned: z.boolean(),
		missed: z.boolean(),
		reason: z.string().optional(),
		polishReason: z.string().optional(),
		reminderUsed: z.boolean().default(false),
	}),
	sideEffects: z.object({
		experienced: z.boolean(),
		effects: z
			.array(
				z.object({
					type: z.string(),
					polishType: z.string(),
					severity: z.number().int().min(1).max(5),
					onset: z.string(),
					polishOnset: z.string(),
					duration: z.string().optional(),
					polishDuration: z.string().optional(),
					description: z.string().optional(),
					polishDescription: z.string().optional(),
				}),
			)
			.default([]),
		severity: z.enum(["mild", "moderate", "severe"]).default("mild"),
		polishSeverity: z.string().default("łagodne"),
		duration: z.string().optional(),
		polishDuration: z.string().optional(),
	}),
	deviceInfo: z
		.object({
			platform: z.string().optional(),
			version: z.string().optional(),
			timezone: z.string().optional(),
		})
		.optional(),
});

const GetIntakeLogsSchema = z.object({
	userId: z.string().min(1),
	supplementId: z.string().optional(),
	startDate: z.string().datetime().optional(),
	endDate: z.string().datetime().optional(),
	timeOfDay: z.enum(["morning", "afternoon", "evening", "night"]).optional(),
	planned: z.coerce.boolean().optional(),
	page: z.coerce.number().min(1).default(1),
	limit: z.coerce.number().min(1).max(100).default(20),
	sortBy: z
		.enum(["timestamp", "supplementName", "mood", "energy"])
		.default("timestamp"),
	sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

/**
 * POST /api/tracking/intake
 * Log a supplement intake
 */
export async function POST(request: NextRequest) {
	try {
		await connectToDatabase();

		const body = await request.json();

		// Validate request body
		const validatedData = LogIntakeSchema.parse(body);

		// Create new intake log
		const intakeLog = new SupplementIntakeLog(validatedData);
		const savedLog = await intakeLog.save();

		return NextResponse.json(
			{
				success: true,
				data: savedLog,
				message: "Intake logged successfully",
			},
			{ status: 201 },
		);
	} catch (error) {
		console.error("Error logging intake:", error);

		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{
					success: false,
					error: "Invalid request data",
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

/**
 * GET /api/tracking/intake
 * Retrieve intake logs with filtering and pagination
 */
export async function GET(request: NextRequest) {
	try {
		await connectToDatabase();

		const { searchParams } = new URL(request.url);
		const params = Object.fromEntries(searchParams.entries());

		// Validate query parameters
		const validatedParams = GetIntakeLogsSchema.parse(params);

		// Build MongoDB query
		const query: any = { userId: validatedParams.userId };

		// Supplement filter
		if (validatedParams.supplementId) {
			query.supplementId = validatedParams.supplementId;
		}

		// Date range filter
		if (validatedParams.startDate || validatedParams.endDate) {
			query["timing.timestamp"] = {};
			if (validatedParams.startDate) {
				query["timing.timestamp"].$gte = new Date(validatedParams.startDate);
			}
			if (validatedParams.endDate) {
				query["timing.timestamp"].$lte = new Date(validatedParams.endDate);
			}
		}

		// Time of day filter
		if (validatedParams.timeOfDay) {
			query["timing.timeOfDay"] = validatedParams.timeOfDay;
		}

		// Planned/unplanned filter
		if (validatedParams.planned !== undefined) {
			query["adherence.planned"] = validatedParams.planned;
		}

		// Build sort object
		let sortField: string = validatedParams.sortBy;
		if (sortField === "timestamp") {
			sortField = "timing.timestamp";
		}
		const sortOrder = validatedParams.sortOrder === "desc" ? -1 : 1;
		const sort: Record<string, 1 | -1> = { [sortField]: sortOrder };

		// Calculate pagination
		const skip = (validatedParams.page - 1) * validatedParams.limit;

		// Execute query with pagination
		const [intakeLogs, totalCount] = await Promise.all([
			SupplementIntakeLog.find(query)
				.sort(sort)
				.skip(skip)
				.limit(validatedParams.limit)
				.lean(),
			SupplementIntakeLog.countDocuments(query),
		]);

		// Calculate pagination metadata
		const totalPages = Math.ceil(totalCount / validatedParams.limit);
		const hasNextPage = validatedParams.page < totalPages;
		const hasPrevPage = validatedParams.page > 1;

		return NextResponse.json({
			success: true,
			data: intakeLogs,
			pagination: {
				currentPage: validatedParams.page,
				totalPages,
				totalCount,
				limit: validatedParams.limit,
				hasNextPage,
				hasPrevPage,
			},
			filters: {
				userId: validatedParams.userId,
				supplementId: validatedParams.supplementId,
				startDate: validatedParams.startDate,
				endDate: validatedParams.endDate,
				timeOfDay: validatedParams.timeOfDay,
				planned: validatedParams.planned,
			},
		});
	} catch (error) {
		console.error("Error fetching intake logs:", error);

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
