/**
 * Review Type Definitions for Suplementor Review System
 * Comprehensive types with Polish localization and Zod validation
 */

import { z } from "zod";

// Zod Schemas for Validation

export const ReviewStatusSchema = z.enum([
	"pending",
	"approved",
	"rejected",
	"flagged",
]);

export const ReviewFrequencySchema = z.enum([
	"once",
	"daily",
	"weekly",
	"monthly",
	"as_needed",
]);

export const ReviewSourceSchema = z.enum(["web", "mobile", "import"]);

// Review Creation Schema
export const CreateReviewSchema = z.object({
	supplementId: z.string().min(1),
	userId: z.string().min(1),
	rating: z.number().min(1).max(5),
	title: z.string().min(1).max(200),
	polishTitle: z.string().max(200).optional(),
	content: z.string().min(10).max(2000),
	polishContent: z.string().max(2000).optional(),
	pros: z.array(z.string()).default([]),
	polishPros: z.array(z.string()).default([]),
	cons: z.array(z.string()).default([]),
	polishCons: z.array(z.string()).default([]),
	dosage: z.string().max(100).optional(),
	duration: z.string().max(100).optional(),
	frequency: ReviewFrequencySchema.optional(),
	effectiveness: z.number().min(1).max(5).optional(),
	valueForMoney: z.number().min(1).max(5).optional(),
	easeOfUse: z.number().min(1).max(5).optional(),
	verifiedPurchase: z.boolean().default(false),
	source: ReviewSourceSchema.default("web"),
	language: z.string().default("pl"),
});

// Review Update Schema
export const UpdateReviewSchema = z.object({
	rating: z.number().min(1).max(5).optional(),
	title: z.string().min(1).max(200).optional(),
	polishTitle: z.string().max(200).optional(),
	content: z.string().min(10).max(2000).optional(),
	polishContent: z.string().max(2000).optional(),
	pros: z.array(z.string()).optional(),
	polishPros: z.array(z.string()).optional(),
	cons: z.array(z.string()).optional(),
	polishCons: z.array(z.string()).optional(),
	dosage: z.string().max(100).optional(),
	duration: z.string().max(100).optional(),
	frequency: ReviewFrequencySchema.optional(),
	effectiveness: z.number().min(1).max(5).optional(),
	valueForMoney: z.number().min(1).max(5).optional(),
	easeOfUse: z.number().min(1).max(5).optional(),
});

// Moderation Schema
export const ModerateReviewSchema = z.object({
	status: ReviewStatusSchema,
	moderationReason: z.string().optional(),
});

// Review Statistics Schema
export const ReviewStatsSchema = z.object({
	average: z.number(),
	total: z.number(),
	distribution: z.object({
		1: z.number(),
		2: z.number(),
		3: z.number(),
		4: z.number(),
		5: z.number(),
	}),
});

// TypeScript Types (inferred from Zod schemas)
export type ReviewStatus = z.infer<typeof ReviewStatusSchema>;
export type ReviewFrequency = z.infer<typeof ReviewFrequencySchema>;
export type ReviewSource = z.infer<typeof ReviewSourceSchema>;
export type CreateReview = z.infer<typeof CreateReviewSchema>;
export type UpdateReview = z.infer<typeof UpdateReviewSchema>;
export type ModerateReview = z.infer<typeof ModerateReviewSchema>;
export type ReviewStats = z.infer<typeof ReviewStatsSchema>;

// Extended types for UI components
export interface ReviewWithUser {
	id: string;
	supplementId: string;
	userId: string;
	rating: number;
	title: string;
	polishTitle?: string;
	content: string;
	polishContent?: string;
	pros: string[];
	polishPros: string[];
	cons: string[];
	polishCons: string[];
	dosage?: string;
	duration?: string;
	frequency?: ReviewFrequency;
	effectiveness?: number;
	valueForMoney?: number;
	easeOfUse?: number;
	status: ReviewStatus;
	moderationReason?: string;
	moderatedBy?: string;
	moderatedAt?: string;
	verifiedPurchase: boolean;
	verifiedUser: boolean;
	helpful: number;
	notHelpful: number;
	source: ReviewSource;
	ipAddress?: string;
	userAgent?: string;
	language: string;
	createdAt: string;
	updatedAt: string;

	// Populated fields
	user?: {
		id: string;
		name?: string;
		email?: string;
		image?: string;
	};
	supplement?: {
		id: string;
		name: string;
		polishName: string;
	};
}

// Review List Response
export interface ReviewListResponse {
	reviews: ReviewWithUser[];
	totalCount: number;
	averageRating: number;
	stats: ReviewStats;
	pagination: {
		currentPage: number;
		totalPages: number;
		hasNextPage: boolean;
		hasPrevPage: boolean;
	};
}

// Review Form Data
export interface ReviewFormData {
	rating: number;
	title: string;
	polishTitle?: string;
	content: string;
	polishContent?: string;
	pros: string[];
	polishPros: string[];
	cons: string[];
	polishCons: string[];
	dosage?: string;
	duration?: string;
	frequency?: ReviewFrequency;
	effectiveness?: number;
	valueForMoney?: number;
	easeOfUse?: number;
	verifiedPurchase: boolean;
}

// User Review Statistics
export interface UserReviewStats {
	userId: string;
	totalReviews: number;
	averageRating: number;
	helpfulReviews: number;
	verifiedReviews: number;
	lastReviewDate?: string;
	topCategories: string[];
}

// Supplement Review Summary
export interface SupplementReviewSummary {
	supplementId: string;
	averageRating: number;
	totalReviews: number;
	stats: ReviewStats;
	recentReviews: ReviewWithUser[];
	topPros: string[];
	topCons: string[];
	verifiedPercentage: number;
	recommendationRate: number; // Percentage of 4-5 star reviews
}

// Review Moderation Queue
export interface ReviewModerationItem {
	review: ReviewWithUser;
	priority: "low" | "medium" | "high";
	reasons: string[];
	suggestedAction: ReviewStatus;
}

// Validation Functions
export const validateCreateReview = (data: unknown) => {
	try {
		return {
			success: true as const,
			data: CreateReviewSchema.parse(data),
		};
	} catch (error) {
		return {
			success: false as const,
			error:
				error instanceof z.ZodError
					? error.issues
					: [{ message: "Unknown validation error" }],
		};
	}
};

export const validateUpdateReview = (data: unknown) => {
	try {
		return {
			success: true as const,
			data: UpdateReviewSchema.parse(data),
		};
	} catch (error) {
		return {
			success: false as const,
			error:
				error instanceof z.ZodError
					? error.issues
					: [{ message: "Unknown validation error" }],
		};
	}
};

export const validateModerateReview = (data: unknown) => {
	try {
		return {
			success: true as const,
			data: ModerateReviewSchema.parse(data),
		};
	} catch (error) {
		return {
			success: false as const,
			error:
				error instanceof z.ZodError
					? error.issues
					: [{ message: "Unknown validation error" }],
		};
	}
};

// Utility Types
export type ValidationResult<T> =
	| { success: true; data: T }
	| { success: false; error: Array<{ message: string }> };

// Review Filter Options
export interface ReviewFilters {
	status?: ReviewStatus;
	rating?: number;
	verified?: boolean;
	hasContent?: boolean;
	dateFrom?: string;
	dateTo?: string;
	sortBy?: "createdAt" | "rating" | "helpful";
	sortOrder?: "asc" | "desc";
}