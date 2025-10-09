/**
 * Supplement Reviews API Route
 * Handles review retrieval for specific supplements
 */

import Review from "@/lib/db/models/Review";
import connectToDatabase from "@/lib/db/mongodb";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Request validation schemas
const GetSupplementReviewsSchema = z.object({
	status: z.enum(["pending", "approved", "rejected", "flagged"]).default("approved"),
	page: z.coerce.number().min(1).default(1),
	limit: z.coerce.number().min(1).max(100).default(20),
	sortBy: z.enum(["createdAt", "rating", "helpful"]).default("createdAt"),
	sortOrder: z.enum(["asc", "desc"]).default("desc"),
	includeStats: z.coerce.boolean().default(true),
});

/**
 * GET /api/supplements/[id]/reviews
 * Retrieve reviews for a specific supplement
 */
export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } },
) {
	try {
		await connectToDatabase();

		const { searchParams } = new URL(request.url);
		const queryParams = Object.fromEntries(searchParams.entries());

		// Validate query parameters
		const validatedParams = GetSupplementReviewsSchema.parse({
			...queryParams,
		});

		const supplementId = params.id;

		// Build sort object
		const sortField = validatedParams.sortBy;
		const sortOrder = validatedParams.sortOrder === "desc" ? -1 : 1;
		const sort: Record<string, 1 | -1> = { [sortField]: sortOrder };

		// Calculate pagination
		const skip = (validatedParams.page - 1) * validatedParams.limit;

		// Execute queries in parallel
		const [reviewsResult, totalCount, statsResult] = await Promise.all([
			Review.find({
				supplementId,
				status: validatedParams.status,
			})
				.sort(sort)
				.skip(skip)
				.limit(validatedParams.limit)
				.lean(),
			Review.countDocuments({
				supplementId,
				status: validatedParams.status,
			}),
			validatedParams.includeStats
				? Review.getRatingDistribution(supplementId)
				: Promise.resolve(null),
		]);

		// Calculate pagination metadata
		const totalPages = Math.ceil(totalCount / validatedParams.limit);
		const hasNextPage = validatedParams.page < totalPages;
		const hasPrevPage = validatedParams.page > 1;

		// Get average rating
		const averageRating = statsResult ? statsResult.average : 0;

		return NextResponse.json({
			success: true,
			data: {
				reviews: reviewsResult,
				stats: statsResult || {
					average: 0,
					total: 0,
					distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
				},
				averageRating,
			},
			pagination: {
				currentPage: validatedParams.page,
				totalPages,
				totalCount,
				limit: validatedParams.limit,
				hasNextPage,
				hasPrevPage,
			},
			filters: {
				supplementId,
				...validatedParams,
			},
		});
	} catch (error) {
		console.error("Error fetching supplement reviews:", error);

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