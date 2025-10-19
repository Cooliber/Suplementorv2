/**
 * Reviews API Route
 * Handles review submission and management
 */

import { CreateReviewSchema, validateCreateReview } from "@/types/review";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Request validation schemas
const GetReviewsSchema = z.object({
	userId: z.string().optional(),
	supplementId: z.string().optional(),
	status: z.enum(["pending", "approved", "rejected", "flagged"]).optional(),
	rating: z.coerce.number().min(1).max(5).optional(),
	page: z.coerce.number().min(1).default(1),
	limit: z.coerce.number().min(1).max(100).default(20),
	sortBy: z.enum(["createdAt", "rating", "helpful"]).default("createdAt"),
	sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

/**
 * GET /api/reviews
 * Retrieve reviews with filtering and pagination (using hardcoded data - no persistence)
 */
export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const params = Object.fromEntries(searchParams.entries());

		// Validate query parameters
		const validatedParams = GetReviewsSchema.parse(params);

		// For hardcoded deployment, return empty array since no reviews are persisted
		const reviews: any[] = [];
		const totalCount = 0;

		// Calculate pagination metadata
		const totalPages = Math.ceil(totalCount / validatedParams.limit);
		const hasNextPage = validatedParams.page < totalPages;
		const hasPrevPage = validatedParams.page > 1;

		return NextResponse.json({
			success: true,
			data: reviews,
			pagination: {
				currentPage: validatedParams.page,
				totalPages,
				totalCount,
				limit: validatedParams.limit,
				hasNextPage,
				hasPrevPage,
			},
			filters: validatedParams,
			message: "No reviews available in hardcoded data mode",
		});
	} catch (error) {
		console.error("Error fetching reviews:", error);

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
 * POST /api/reviews
 * Create a new review (using hardcoded data - no persistence)
 */
export async function POST(request: NextRequest) {
	try {
		const body = await request.json();

		// Validate request body
		const validation = validateCreateReview(body);
		if (!validation.success) {
			return NextResponse.json(
				{
					success: false,
					error: "Invalid request data",
					details: validation.error,
				},
				{ status: 400 },
			);
		}

		const reviewData = validation.data;

		// For hardcoded deployment, simulate review creation
		const mockReview = {
			_id: `review_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
			...reviewData,
			status: "approved", // Auto-approve for now
			helpful: 0,
			notHelpful: 0,
			verifiedPurchase: reviewData.verifiedPurchase || false,
			verifiedUser: false,
			language: reviewData.language || "pl",
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		return NextResponse.json(
			{
				success: true,
				data: mockReview,
				message: "Review created successfully (hardcoded data mode)",
			},
			{ status: 201 },
		);
	} catch (error) {
		console.error("Error creating review:", error);

		return NextResponse.json(
			{
				success: false,
				error: "Internal server error",
			},
			{ status: 500 },
		);
	}
}
