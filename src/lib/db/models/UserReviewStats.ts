/**
 * Mongoose Schema for User Review Statistics
 * Aggregated statistics for user review patterns and behavior
 */

import type { UserReviewStats } from "@/types/review";
import mongoose, { Schema, type Document, type Model } from "mongoose";

// Helper function to calculate reviewer tier
function calculateReviewerTier(stats: IUserReviewStatsDocument): string {
	const { totalReviews, averageRating, helpfulReviews, verifiedReviews } = stats;

	if (totalReviews >= 50 && averageRating >= 4.0 && helpfulReviews >= 25) {
		return "platinum";
	} else if (totalReviews >= 25 && averageRating >= 3.8 && helpfulReviews >= 10) {
		return "gold";
	} else if (totalReviews >= 10 && averageRating >= 3.5 && helpfulReviews >= 5) {
		return "silver";
	} else if (totalReviews >= 5 && averageRating >= 3.0) {
		return "bronze";
	} else {
		return "new";
	}
}

// Main User Review Stats Schema
const UserReviewStatsSchema = new Schema(
	{
		_id: { type: String, required: true }, // Custom ID instead of ObjectId
		userId: {
			type: String,
			required: true,
			unique: true,
			index: true,
		},

		// Review statistics
		totalReviews: {
			type: Number,
			default: 0,
			min: 0,
		},
		averageRating: {
			type: Number,
			default: 0,
			min: 0,
			max: 5,
		},
		helpfulReviews: {
			type: Number,
			default: 0,
			min: 0,
		},
		verifiedReviews: {
			type: Number,
			default: 0,
			min: 0,
		},

		// Rating distribution
		ratingDistribution: {
			1: { type: Number, default: 0, min: 0 },
			2: { type: Number, default: 0, min: 0 },
			3: { type: Number, default: 0, min: 0 },
			4: { type: Number, default: 0, min: 0 },
			5: { type: Number, default: 0, min: 0 },
		},

		// Category preferences
		topCategories: [{
			category: { type: String, required: true },
			count: { type: Number, required: true, min: 0 },
		}],

		// Review quality metrics
		averageReviewLength: {
			type: Number,
			default: 0,
			min: 0,
		},
		averageHelpfulnessRatio: {
			type: Number,
			default: 0,
			min: 0,
			max: 1,
		},

		// Temporal data
		firstReviewDate: {
			type: Date,
		},
		lastReviewDate: {
			type: Date,
		},
		reviewFrequency: {
			type: String,
			enum: ["sporadic", "regular", "frequent"],
			default: "sporadic",
		},

		// User behavior flags
		isVerifiedReviewer: {
			type: Boolean,
			default: false,
		},
		reviewerTier: {
			type: String,
			enum: ["new", "bronze", "silver", "gold", "platinum"],
			default: "new",
		},

		// Metadata
		lastUpdated: {
			type: Date,
			default: Date.now,
		},
	},
	{
		timestamps: true,
		collection: "userReviewStats",
	},
);

// Indexes for performance
UserReviewStatsSchema.index({ userId: 1 });
UserReviewStatsSchema.index({ totalReviews: -1 });
UserReviewStatsSchema.index({ averageRating: -1 });
UserReviewStatsSchema.index({ reviewerTier: 1 });
UserReviewStatsSchema.index({ lastReviewDate: -1 });

// Virtual for ID compatibility
UserReviewStatsSchema.virtual("id").get(function () {
	return this._id;
});

// Virtual for review quality score
UserReviewStatsSchema.virtual("reviewQualityScore").get(function () {
	const lengthScore = Math.min(this.averageReviewLength / 100, 1); // Normalize to 100 chars
	const helpfulnessScore = this.averageHelpfulnessRatio;
	const consistencyScore = 1 - (Math.abs(this.averageRating - 3) / 2); // Prefer balanced reviewers

	return (lengthScore * 0.3 + helpfulnessScore * 0.5 + consistencyScore * 0.2);
});

// Ensure virtual fields are serialized
UserReviewStatsSchema.set("toJSON", {
	virtuals: true,
	transform: (doc, ret: any) => {
		ret.id = ret._id;
		ret._id = undefined;
		ret.__v = undefined;
		return ret;
	},
});

// Document interface
export interface IUserReviewStatsDocument
	extends Document,
		Omit<UserReviewStats, "id" | "topCategories"> {
	_id: string;
	topCategories: Array<{
		category: string;
		count: number;
	}>;
	isVerifiedReviewer: boolean;
	reviewerTier: string;
}

// Model interface
export interface IUserReviewStatsModel extends Model<IUserReviewStatsDocument> {
	findByUserId(userId: string): Promise<IUserReviewStatsDocument | null>;
	updateStats(userId: string, reviewData: {
		rating: number;
		isVerified: boolean;
		reviewLength: number;
		helpfulVotes: number;
		category: string;
	}): Promise<IUserReviewStatsDocument>;
	getTopReviewers(limit?: number): Promise<IUserReviewStatsDocument[]>;
	getVerifiedReviewers(): Promise<IUserReviewStatsDocument[]>;
}

// Static methods
UserReviewStatsSchema.statics.findByUserId = function (userId: string) {
	return this.findOne({ userId });
};

UserReviewStatsSchema.statics.updateStats = async function (
	userId: string,
	reviewData: {
		rating: number;
		isVerified: boolean;
		reviewLength: number;
		helpfulVotes: number;
		category: string;
	},
) {
	const { rating, isVerified, reviewLength, helpfulVotes, category } = reviewData;

	// Find existing stats or create new one
	let stats = await this.findOne({ userId });

	if (!stats) {
		stats = new this({
			_id: userId,
			userId,
			totalReviews: 0,
			averageRating: 0,
			helpfulReviews: 0,
			verifiedReviews: 0,
			firstReviewDate: new Date(),
			topCategories: [],
		});
	}

	// Update counters
	stats.totalReviews += 1;
	if (isVerified) {
		stats.verifiedReviews += 1;
	}
	if (helpfulVotes > 0) {
		stats.helpfulReviews += 1;
	}

	// Update rating distribution
	stats.ratingDistribution[rating as keyof typeof stats.ratingDistribution] += 1;

	// Update average rating (weighted average)
	const previousTotal = stats.totalReviews - 1;
	stats.averageRating = (
		(stats.averageRating * previousTotal) + rating
	) / stats.totalReviews;

	// Update average review length
	stats.averageReviewLength = (
		(stats.averageReviewLength * previousTotal) + reviewLength
	) / stats.totalReviews;

	// Update average helpfulness ratio
	stats.averageHelpfulnessRatio = (
		(stats.averageHelpfulnessRatio * previousTotal) + (helpfulVotes > 0 ? 1 : 0)
	) / stats.totalReviews;

	// Update category preferences
	const categoryIndex = stats.topCategories.findIndex((cat: any) => cat.category === category);
	if (categoryIndex >= 0) {
		stats.topCategories[categoryIndex].count += 1;
	} else {
		stats.topCategories.push({ category, count: 1 });
	}

	// Sort categories by count
	stats.topCategories.sort((a: any, b: any) => b.count - a.count);
	stats.topCategories = stats.topCategories.slice(0, 10); // Keep top 10

	// Update last review date
	stats.lastReviewDate = new Date();

	// Update reviewer tier based on stats
	stats.reviewerTier = calculateReviewerTier(stats);

	// Mark as verified reviewer if criteria met
	stats.isVerifiedReviewer = (
		stats.totalReviews >= 5 &&
		stats.averageRating >= 3.5 &&
		stats.verifiedReviews >= 2
	);

	stats.lastUpdated = new Date();

	return stats.save();
};

UserReviewStatsSchema.statics.calculateReviewerTier = function (stats: IUserReviewStatsDocument) {
	const { totalReviews, averageRating, helpfulReviews, isVerifiedReviewer } = stats;

	if (totalReviews >= 50 && averageRating >= 4.0 && helpfulReviews >= 25) {
		return "platinum";
	} else if (totalReviews >= 25 && averageRating >= 3.8 && helpfulReviews >= 10) {
		return "gold";
	} else if (totalReviews >= 10 && averageRating >= 3.5 && helpfulReviews >= 5) {
		return "silver";
	} else if (totalReviews >= 5 && averageRating >= 3.0) {
		return "bronze";
	} else {
		return "new";
	}
};

UserReviewStatsSchema.statics.getTopReviewers = function (limit = 10) {
	return this.find({})
		.sort({ totalReviews: -1, averageRating: -1 })
		.limit(limit);
};

UserReviewStatsSchema.statics.getVerifiedReviewers = function () {
	return this.find({ isVerifiedReviewer: true })
		.sort({ reviewerTier: 1, totalReviews: -1 });
};

// Instance methods
UserReviewStatsSchema.methods.getReviewQualityScore = function (): number {
	const lengthScore = Math.min(this.averageReviewLength / 100, 1);
	const helpfulnessScore = this.averageHelpfulnessRatio;
	const consistencyScore = 1 - (Math.abs(this.averageRating - 3) / 2);

	return lengthScore * 0.3 + helpfulnessScore * 0.5 + consistencyScore * 0.2;
};

UserReviewStatsSchema.methods.getTopCategory = function (): string | null {
	return this.topCategories.length > 0 ? this.topCategories[0].category : null;
};

UserReviewStatsSchema.methods.isActiveReviewer = function (daysThreshold = 30): boolean {
	if (!this.lastReviewDate) return false;

	const daysSinceLastReview = (Date.now() - this.lastReviewDate.getTime()) / (1000 * 60 * 60 * 24);
	return daysSinceLastReview <= daysThreshold;
};

// Create and export model
const UserReviewStats =
	(mongoose.models.UserReviewStats as unknown as IUserReviewStatsModel) ||
	mongoose.model<IUserReviewStatsDocument, IUserReviewStatsModel>(
		"UserReviewStats",
		UserReviewStatsSchema,
	);

export default UserReviewStats;