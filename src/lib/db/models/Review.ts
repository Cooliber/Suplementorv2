/**
 * Mongoose Schema for Supplement Reviews
 * Comprehensive review system with Polish localization and moderation
 */

import type { ReviewWithUser, ReviewStats } from "@/types/review";
import mongoose, { Schema, type Document, type Model } from "mongoose";

// Main Review Schema
const ReviewSchema = new Schema(
	{
		_id: { type: String, required: true }, // Custom ID instead of ObjectId
		supplementId: {
			type: String,
			ref: "Supplement",
			required: true,
			index: true,
		},
		userId: {
			type: String,
			required: true,
			index: true,
		},

		// Rating and content
		rating: {
			type: Number,
			required: true,
			min: 1,
			max: 5,
		},
		title: {
			type: String,
			required: true,
			maxLength: 200,
		},
		polishTitle: {
			type: String,
			maxLength: 200,
		},
		content: {
			type: String,
			required: true,
			maxLength: 2000,
		},
		polishContent: {
			type: String,
			maxLength: 2000,
		},

		// Review metadata
		pros: {
			type: [String],
			default: [],
		},
		polishPros: {
			type: [String],
			default: [],
		},
		cons: {
			type: [String],
			default: [],
		},
		polishCons: {
			type: [String],
			default: [],
		},

		// Usage context
		dosage: {
			type: String,
			maxLength: 100,
		},
		duration: {
			type: String,
			maxLength: 100,
		},
		frequency: {
			type: String,
			enum: ["once", "daily", "weekly", "monthly", "as_needed"],
		},

		// Effectiveness ratings
		effectiveness: {
			type: Number,
			min: 1,
			max: 5,
		},
		valueForMoney: {
			type: Number,
			min: 1,
			max: 5,
		},
		easeOfUse: {
			type: Number,
			min: 1,
			max: 5,
		},

		// Moderation
		status: {
			type: String,
			enum: ["pending", "approved", "rejected", "flagged"],
			default: "approved", // Auto-approve for now
			index: true,
		},
		moderationReason: {
			type: String,
		},
		moderatedBy: {
			type: String,
		},
		moderatedAt: {
			type: Date,
		},

		// User verification
		verifiedPurchase: {
			type: Boolean,
			default: false,
		},
		verifiedUser: {
			type: Boolean,
			default: false,
		},

		// Engagement metrics
		helpful: {
			type: Number,
			default: 0,
		},
		notHelpful: {
			type: Number,
			default: 0,
		},

		// Review source
		source: {
			type: String,
			enum: ["web", "mobile", "import"],
			default: "web",
		},

		// Metadata
		ipAddress: {
			type: String,
		},
		userAgent: {
			type: String,
		},
		language: {
			type: String,
			default: "pl",
		},
	},
	{
		timestamps: true, // Automatically adds createdAt and updatedAt
		collection: "reviews",
	},
);

// Indexes for performance
ReviewSchema.index({ supplementId: 1, status: 1, createdAt: -1 });
ReviewSchema.index({ userId: 1, supplementId: 1 }); // Prevent duplicate reviews
ReviewSchema.index({ rating: -1, createdAt: -1 });
ReviewSchema.index({ status: 1, createdAt: -1 });
ReviewSchema.index({ helpful: -1 });

// Unique constraint to prevent duplicate reviews from same user for same supplement
ReviewSchema.index(
	{ userId: 1, supplementId: 1 },
	{ unique: true, partialFilterExpression: { status: { $ne: "rejected" } } },
);

// Virtual for ID compatibility
ReviewSchema.virtual("id").get(function () {
	return this._id;
});

// Virtual for helpfulness ratio
ReviewSchema.virtual("helpfulnessRatio").get(function () {
	const total = this.helpful + this.notHelpful;
	return total > 0 ? this.helpful / total : 0;
});

// Ensure virtual fields are serialized
ReviewSchema.set("toJSON", {
	virtuals: true,
	transform: (doc, ret: any) => {
		ret.id = ret._id;
		ret._id = undefined;
		ret.__v = undefined;
		return ret;
	},
});

// Document interface
export interface IReviewDocument
	extends Document,
		Omit<ReviewWithUser, "id" | "user" | "supplement"> {
	_id: string;
}

// Model interface
export interface IReviewModel extends Model<IReviewDocument> {
	findBySupplementId(
		supplementId: string,
		options?: {
			status?: string;
			page?: number;
			limit?: number;
			sortBy?: string;
		},
	): Promise<{ reviews: IReviewDocument[]; totalCount: number }>;
	findByUserId(userId: string): Promise<IReviewDocument[]>;
	findPendingReviews(): Promise<IReviewDocument[]>;
	getAverageRating(supplementId: string): Promise<number>;
	getRatingDistribution(supplementId: string): Promise<ReviewStats>;
}

// Static methods
ReviewSchema.statics.findBySupplementId = async function (
	supplementId: string,
	options: {
		status?: string;
		page?: number;
		limit?: number;
		sortBy?: string;
	} = {},
) {
	const { status = "approved", page = 1, limit = 10, sortBy = "createdAt" } = options;

	const query: any = { supplementId, status };
	const skip = (page - 1) * limit;

	let sort: Record<string, 1 | -1> = { createdAt: -1 };
	if (sortBy === "rating") {
		sort = { rating: -1, createdAt: -1 };
	} else if (sortBy === "helpful") {
		sort = { helpful: -1, createdAt: -1 };
	}

	const [reviews, totalCount] = await Promise.all([
		this.find(query).sort(sort).skip(skip).limit(limit).lean(),
		this.countDocuments(query),
	]);

	return { reviews, totalCount };
};

ReviewSchema.statics.findByUserId = function (userId: string) {
	return this.find({ userId, status: { $ne: "rejected" } })
		.sort({ createdAt: -1 })
		.lean();
};

ReviewSchema.statics.findPendingReviews = function () {
	return this.find({ status: "pending" })
		.sort({ createdAt: 1 })
		.lean();
};

ReviewSchema.statics.getAverageRating = async function (supplementId: string) {
	const result = await this.aggregate([
		{ $match: { supplementId, status: "approved" } },
		{
			$group: {
				_id: null,
				average: { $avg: "$rating" },
				count: { $sum: 1 },
			},
		},
	]);

	return result.length > 0 ? Math.round(result[0].average * 10) / 10 : 0;
};

ReviewSchema.statics.getRatingDistribution = async function (supplementId: string) {
	const result = await this.aggregate([
		{ $match: { supplementId, status: "approved" } },
		{
			$group: {
				_id: "$rating",
				count: { $sum: 1 },
			},
		},
		{ $sort: { _id: 1 } },
	]);

	const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
	result.forEach((item) => {
		distribution[item._id as keyof typeof distribution] = item.count;
	});

	const total = Object.values(distribution).reduce((sum, count) => sum + count, 0);

	return {
		average: total > 0 ? Object.entries(distribution).reduce((sum, [rating, count]) => sum + (Number(rating) * count), 0) / total : 0,
		total,
		distribution,
	};
};

// Instance methods
ReviewSchema.methods.approve = function (moderatorId?: string) {
	this.status = "approved";
	this.moderatedBy = moderatorId;
	this.moderatedAt = new Date();
	return this.save();
};

ReviewSchema.methods.reject = function (reason: string, moderatorId?: string) {
	this.status = "rejected";
	this.moderationReason = reason;
	this.moderatedBy = moderatorId;
	this.moderatedAt = new Date();
	return this.save();
};

ReviewSchema.methods.flag = function (reason?: string) {
	this.status = "flagged";
	this.moderationReason = reason;
	return this.save();
};

ReviewSchema.methods.markHelpful = function () {
	this.helpful += 1;
	return this.save();
};

ReviewSchema.methods.markNotHelpful = function () {
	this.notHelpful += 1;
	return this.save();
};

// Create and export model
const Review =
	(mongoose.models.Review as unknown as IReviewModel) ||
	mongoose.model<IReviewDocument, IReviewModel>("Review", ReviewSchema);

export default Review;