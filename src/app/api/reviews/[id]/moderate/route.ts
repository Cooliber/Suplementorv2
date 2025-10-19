/**
 * Review Moderation API Route
 * Handles review moderation actions
 */

import Review from "@/lib/db/models/Review";
import connectToDatabase from "@/lib/db/mongodb";
import { ModerateReviewSchema, validateModerateReview } from "@/types/review";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Request validation schemas
const GetReviewSchema = z.object({
	id: z.string().min(1),
});

/**
 * GET /api/reviews/[id]/moderate
 * Get review details for moderation
 */
export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } },
) {
	try {
		await connectToDatabase();

		const review = await Review.findById(params.id).lean();

		if (!review) {
			return NextResponse.json(
				{
					success: false,
					error: "Review not found",
				},
				{ status: 404 },
			);
		}

		return NextResponse.json({
			success: true,
			data: review,
		});
	} catch (error) {
		console.error("Error fetching review for moderation:", error);

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
 * PUT /api/reviews/[id]/moderate
 * Moderate a review (approve, reject, flag)
 */
export async function PUT(
	request: NextRequest,
	{ params }: { params: { id: string } },
) {
	try {
		await connectToDatabase();

		const body = await request.json();

		// Validate request body
		const validation = validateModerateReview(body);
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

		const moderationData = validation.data;

		// Find the review
		const review = await Review.findById(params.id);

		if (!review) {
			return NextResponse.json(
				{
					success: false,
					error: "Review not found",
				},
				{ status: 404 },
			);
		}

		// Apply moderation action
		let moderatedReview;
		switch (moderationData.status) {
			case "approved":
				moderatedReview = await (review as any).approve("system"); // TODO: Get actual moderator ID
				break;
			case "rejected":
				moderatedReview = await (review as any).reject(
					moderationData.moderationReason || "Review rejected by moderator",
					"system", // TODO: Get actual moderator ID
				);
				break;
			case "flagged":
				moderatedReview = await (review as any).flag(
					moderationData.moderationReason,
				);
				break;
			default:
				return NextResponse.json(
					{
						success: false,
						error: "Invalid moderation status",
					},
					{ status: 400 },
				);
		}

		return NextResponse.json({
			success: true,
			data: moderatedReview,
			message: `Review ${moderationData.status} successfully`,
		});
	} catch (error) {
		console.error("Error moderating review:", error);

		return NextResponse.json(
			{
				success: false,
				error: "Internal server error",
			},
			{ status: 500 },
		);
	}
}
