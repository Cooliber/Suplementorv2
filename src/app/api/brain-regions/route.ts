/**
 * Brain Regions API Route
 * Handles CRUD operations for brain regions with 3D visualization data
 */

import { BrainRegion } from "@/lib/db/models";
import connectToDatabase from "@/lib/db/mongodb";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Request validation schemas
const GetBrainRegionsSchema = z.object({
	category: z.string().optional(),
	hemisphere: z.enum(["LEFT", "RIGHT", "BILATERAL"]).optional(),
	search: z.string().optional(),
	language: z.enum(["en", "pl"]).default("pl"),
	difficultyLevel: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]).optional(),
	supplementId: z.string().optional(), // Filter by supplement effects
	page: z.coerce.number().min(1).default(1),
	limit: z.coerce.number().min(1).max(100).default(20),
	sortBy: z
		.enum(["name", "polishName", "category", "lastUpdated"])
		.default("polishName"),
	sortOrder: z.enum(["asc", "desc"]).default("asc"),
	includeVisualization: z.coerce.boolean().default(true),
});

/**
 * GET /api/brain-regions
 * Retrieve brain regions with filtering and 3D visualization data
 */
export async function GET(request: NextRequest) {
	try {
		await connectToDatabase();

		const { searchParams } = new URL(request.url);
		const params = Object.fromEntries(searchParams.entries());

		// Validate query parameters
		const validatedParams = GetBrainRegionsSchema.parse(params);

		// Build MongoDB query
		const query: any = { isActive: true };

		// Category filter
		if (validatedParams.category) {
			query.category = validatedParams.category.toUpperCase();
		}

		// Hemisphere filter
		if (validatedParams.hemisphere) {
			query.hemisphere = validatedParams.hemisphere;
		}

		// Difficulty level filter
		if (validatedParams.difficultyLevel) {
			query.difficultyLevel = validatedParams.difficultyLevel;
		}

		// Supplement effects filter
		if (validatedParams.supplementId) {
			query["supplementEffects.supplementId"] = validatedParams.supplementId;
		}

		// Text search
		if (validatedParams.search) {
			query.$text = { $search: validatedParams.search };
		}

		// Build sort object
		const sortField =
			validatedParams.sortBy === "name" && validatedParams.language === "pl"
				? "polishName"
				: validatedParams.sortBy;
		const sortOrder = validatedParams.sortOrder === "desc" ? -1 : 1;
		const sort: Record<string, 1 | -1> = { [sortField]: sortOrder };

		// Build projection to exclude/include visualization data
		let projection = {};
		if (!validatedParams.includeVisualization) {
			projection = {
				visualizationProperties: 0,
				modelFile: 0,
				textureFiles: 0,
			};
		}

		// Calculate pagination
		const skip = (validatedParams.page - 1) * validatedParams.limit;

		// Execute query with pagination
		const [brainRegions, totalCount] = await Promise.all([
			BrainRegion.find(query, projection)
				.sort(sort)
				.skip(skip)
				.limit(validatedParams.limit)
				.lean(),
			BrainRegion.countDocuments(query),
		]);

		// Calculate pagination metadata
		const totalPages = Math.ceil(totalCount / validatedParams.limit);
		const hasNextPage = validatedParams.page < totalPages;
		const hasPrevPage = validatedParams.page > 1;

		return NextResponse.json({
			success: true,
			data: brainRegions,
			pagination: {
				currentPage: validatedParams.page,
				totalPages,
				totalCount,
				limit: validatedParams.limit,
				hasNextPage,
				hasPrevPage,
			},
			filters: {
				category: validatedParams.category,
				hemisphere: validatedParams.hemisphere,
				difficultyLevel: validatedParams.difficultyLevel,
				supplementId: validatedParams.supplementId,
				search: validatedParams.search,
				language: validatedParams.language,
			},
		});
	} catch (error) {
		console.error("Error fetching brain regions:", error);

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

/**
 * POST /api/brain-regions
 * Create a new brain region
 */
export async function POST(request: NextRequest) {
	try {
		await connectToDatabase();

		const body = await request.json();

		// Check if brain region with this ID already exists
		const existingRegion = await BrainRegion.findOne({ id: body.id });

		if (existingRegion) {
			return NextResponse.json(
				{
					success: false,
					error: "Brain region with this ID already exists",
				},
				{ status: 409 },
			);
		}

		// Create new brain region
		const newBrainRegion = new BrainRegion({
			...body,
			lastUpdated: new Date(),
			version: "1.0.0",
			isActive: true,
		});

		const savedBrainRegion = await newBrainRegion.save();

		return NextResponse.json(
			{
				success: true,
				data: savedBrainRegion,
				message: "Brain region created successfully",
			},
			{ status: 201 },
		);
	} catch (error) {
		console.error("Error creating brain region:", error);

		return NextResponse.json(
			{
				success: false,
				error: "Internal server error",
			},
			{ status: 500 },
		);
	}
}
