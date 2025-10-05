/**
 * Comprehensive Supplements API Route
 * Handles CRUD operations for supplements with MongoDB integration
 */

import { ComprehensiveSupplement } from "@/lib/db/models";
import connectToDatabase from "@/lib/db/mongodb";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Request validation schemas
const GetSupplementsSchema = z.object({
	category: z.string().optional(),
	evidenceLevel: z.string().optional(),
	search: z.string().optional(),
	language: z.enum(["en", "pl"]).default("pl"),
	page: z.coerce.number().min(1).default(1),
	limit: z.coerce.number().min(1).max(100).default(20),
	sortBy: z
		.enum(["name", "polishName", "evidenceLevel", "lastUpdated"])
		.default("polishName"),
	sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

const CreateSupplementSchema = z.object({
	id: z.string().min(1),
	name: z.string().min(1),
	polishName: z.string().min(1),
	category: z.enum([
		"NOOTROPIC",
		"FATTY_ACID",
		"MINERAL",
		"VITAMIN",
		"HERB",
		"AMINO_ACID",
		"PROBIOTIC",
		"ENZYME",
	]),
	description: z.string().min(1),
	polishDescription: z.string().min(1),
	evidenceLevel: z.enum(["STRONG", "MODERATE", "WEAK", "INSUFFICIENT"]),
	// Additional fields would be validated here
});

/**
 * GET /api/supplements
 * Retrieve supplements with filtering, searching, and pagination
 */
export async function GET(request: NextRequest) {
	try {
		await connectToDatabase();

		const { searchParams } = new URL(request.url);
		const params = Object.fromEntries(searchParams.entries());

		// Validate query parameters
		const validatedParams = GetSupplementsSchema.parse(params);

		// Build MongoDB query
		const query: any = { isActive: true };

		// Category filter
		if (validatedParams.category) {
			query.category = validatedParams.category.toUpperCase();
		}

		// Evidence level filter
		if (validatedParams.evidenceLevel) {
			query.evidenceLevel = validatedParams.evidenceLevel.toUpperCase();
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

		// Calculate pagination
		const skip = (validatedParams.page - 1) * validatedParams.limit;

		// Execute query with pagination
		const [supplements, totalCount] = await Promise.all([
			ComprehensiveSupplement.find(query)
				.sort(sort)
				.skip(skip)
				.limit(validatedParams.limit)
				.lean(),
			ComprehensiveSupplement.countDocuments(query),
		]);

		// Calculate pagination metadata
		const totalPages = Math.ceil(totalCount / validatedParams.limit);
		const hasNextPage = validatedParams.page < totalPages;
		const hasPrevPage = validatedParams.page > 1;

		return NextResponse.json({
			success: true,
			data: supplements,
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
				evidenceLevel: validatedParams.evidenceLevel,
				search: validatedParams.search,
				language: validatedParams.language,
			},
		});
	} catch (error) {
		console.error("Error fetching supplements:", error);

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
 * POST /api/supplements
 * Create a new supplement
 */
export async function POST(request: NextRequest) {
	try {
		await connectToDatabase();

		const body = await request.json();

		// Validate request body
		const validatedData = CreateSupplementSchema.parse(body);

		// Check if supplement with this ID already exists
		const existingSupplement = await ComprehensiveSupplement.findOne({
			id: validatedData.id,
		});

		if (existingSupplement) {
			return NextResponse.json(
				{
					success: false,
					error: "Supplement with this ID already exists",
				},
				{ status: 409 },
			);
		}

		// Create new supplement
		const newSupplement = new ComprehensiveSupplement({
			...validatedData,
			lastUpdated: new Date(),
			version: "1.0.0",
			isActive: true,
		});

		const savedSupplement = await newSupplement.save();

		return NextResponse.json(
			{
				success: true,
				data: savedSupplement,
				message: "Supplement created successfully",
			},
			{ status: 201 },
		);
	} catch (error) {
		console.error("Error creating supplement:", error);

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
 * PUT /api/supplements
 * Bulk update supplements
 */
export async function PUT(request: NextRequest) {
	try {
		await connectToDatabase();

		const body = await request.json();
		const { supplements } = body;

		if (!Array.isArray(supplements)) {
			return NextResponse.json(
				{
					success: false,
					error: "Expected array of supplements",
				},
				{ status: 400 },
			);
		}

		const results = [];

		for (const supplementData of supplements) {
			try {
				const result = await ComprehensiveSupplement.findOneAndUpdate(
					{ id: supplementData.id },
					{
						...supplementData,
						lastUpdated: new Date(),
					},
					{
						new: true,
						upsert: true,
						runValidators: true,
					},
				);

				results.push({
					id: supplementData.id,
					success: true,
					data: result,
				});
			} catch (error) {
				results.push({
					id: supplementData.id,
					success: false,
					error: error instanceof Error ? error.message : "Unknown error",
				});
			}
		}

		const successCount = results.filter((r) => r.success).length;
		const errorCount = results.filter((r) => !r.success).length;

		return NextResponse.json({
			success: errorCount === 0,
			results,
			summary: {
				total: supplements.length,
				successful: successCount,
				failed: errorCount,
			},
		});
	} catch (error) {
		console.error("Error bulk updating supplements:", error);

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
 * DELETE /api/supplements
 * Soft delete supplements (mark as inactive)
 */
export async function DELETE(request: NextRequest) {
	try {
		await connectToDatabase();

		const { searchParams } = new URL(request.url);
		const ids = searchParams.get("ids")?.split(",") || [];

		if (ids.length === 0) {
			return NextResponse.json(
				{
					success: false,
					error: "No supplement IDs provided",
				},
				{ status: 400 },
			);
		}

		// Soft delete by marking as inactive
		const result = await ComprehensiveSupplement.updateMany(
			{ id: { $in: ids } },
			{
				isActive: false,
				lastUpdated: new Date(),
			},
		);

		return NextResponse.json({
			success: true,
			message: `${result.modifiedCount} supplements deactivated`,
			modifiedCount: result.modifiedCount,
		});
	} catch (error) {
		console.error("Error deleting supplements:", error);

		return NextResponse.json(
			{
				success: false,
				error: "Internal server error",
			},
			{ status: 500 },
		);
	}
}
