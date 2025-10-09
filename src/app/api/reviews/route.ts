/**
 * Reviews API Route
 * Handles review submission and management
 */

import Review from "@/lib/db/models/Review";
import UserReviewStats from "@/lib/db/models/UserReviewStats";
import connectToDatabase from "@/lib/db/mongodb";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import mongoose from "mongoose";
import { CreateReviewSchema, validateCreateReview } from "@/types/review";

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
 * Retrieve reviews with filtering and pagination
 */
export async function GET(request: NextRequest) {
	try {
		await connectToDatabase();

		const { searchParams } = new URL(request.url);
		const params = Object.fromEntries(searchParams.entries());

		// Validate query parameters
		const validatedParams = GetReviewsSchema.parse(params);

		// Build MongoDB query
		const query: any = {};

		if (validatedParams.userId) {
			query.userId = validatedParams.userId;
		}

		if (validatedParams.supplementId) {
			query.supplementId = validatedParams.supplementId;
		}

		if (validatedParams.status) {
			query.status = validatedParams.status;
		}

		if (validatedParams.rating) {
			query.rating = validatedParams.rating;
		}

		// Build sort object
		const sortField = validatedParams.sortBy;
		const sortOrder = validatedParams.sortOrder === "desc" ? -1 : 1;
		const sort: Record<string, 1 | -1> = { [sortField]: sortOrder };

		// Calculate pagination
		const skip = (validatedParams.page - 1) * validatedParams.limit;

		// Execute query with pagination
		const [reviews, totalCount] = await Promise.all([
			Review.find(query)
				.sort(sort)
				.skip(skip)
				.limit(validatedParams.limit)
				.lean(),
			Review.countDocuments(query),
		]);

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
 * Create a new review
 */
export async function POST(request: NextRequest) {
	try {
		await connectToDatabase();

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

		// Check if user already reviewed this supplement
		const existingReview = await Review.findOne({
			userId: reviewData.userId,
			supplementId: reviewData.supplementId,
			status: { $ne: "rejected" },
		});

		if (existingReview) {
			return NextResponse.json(
				{
					success: false,
					error: "User has already reviewed this supplement",
				},
				{ status: 409 },
			);
		}

		// Generate review ID
		const reviewId = `review_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

		// Create new review
		const newReview = new Review({
			_id: reviewId,
			...reviewData,
			status: "approved", // Auto-approve for now
			helpful: 0,
			notHelpful: 0,
			verifiedPurchase: reviewData.verifiedPurchase || false,
			verifiedUser: false,
			language: reviewData.language || "pl",
		});

		const savedReview = await newReview.save();

		// Update user review statistics
		try {
			const supplement = await mongoose.models.Supplement?.findOne({ id: reviewData.supplementId });
			const category = supplement?.category || "OTHER";

			await UserReviewStats.updateStats(reviewData.userId, {
				rating: reviewData.rating,
				isVerified: reviewData.verifiedPurchase,
				reviewLength: reviewData.content.length,
				helpfulVotes: 0,
				category,
			});
		} catch (statsError) {
			console.error("Error updating user stats:", statsError);
			// Don't fail the review creation if stats update fails
		}

		return NextResponse.json(
			{
				success: true,
				data: savedReview,
				message: "Review created successfully",
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