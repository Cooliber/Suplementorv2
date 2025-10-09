/**
 * Circadian Supplement Timing Model
 * MongoDB schema for circadian rhythm data and time-of-day supplement recommendations
 */

import mongoose, { Schema, type Document } from "mongoose";

// ==================== INTERFACES ====================

export interface IBodyStatistics {
	temperature: number; // Body temperature in Celsius
	cortisol: number; // Cortisol level (0-100 scale)
	melatonin: number; // Melatonin level (0-100 scale)
	digestiveEfficiency: number; // Digestive efficiency percentage (0-100)
	alertness: number; // Alertness level (0-100 scale)
	polishDescription: string; // Polish description of body state
}

export interface ISupplementRecommendation {
	supplementId: string; // Reference to supplement ID
	supplementName: string; // Supplement name for display
	polishSupplementName: string; // Polish supplement name
	rationale: string; // Why this supplement is recommended at this time
	polishRationale: string; // Polish rationale
	priority: "HIGH" | "MEDIUM" | "LOW"; // Recommendation priority
}

export interface ICircadianSupplementTiming extends Document {
	id: string;
	timeOfDay: "EARLY_MORNING" | "LATE_MORNING" | "AFTERNOON" | "EVENING" | "NIGHT" | "DEEP_NIGHT";
	polishTimeOfDay: string;
	timeRange: string; // e.g., "5:00-8:00"
	description: string;
	polishDescription: string;
	bodyStatistics: IBodyStatistics;
	recommendedSupplements: ISupplementRecommendation[];
	avoidSupplements: string[]; // Supplement IDs to avoid at this time
	polishAvoidSupplements: string[]; // Polish names of supplements to avoid
	generalGuidance: string;
	polishGeneralGuidance: string;
	scientificBasis: string[]; // References to scientific studies
	tags: string[];
	createdAt: Date;
	updatedAt: Date;
}

// ==================== SCHEMAS ====================

const BodyStatisticsSchema = new Schema(
	{
		temperature: { type: Number, required: true, min: 35, max: 39 },
		cortisol: { type: Number, required: true, min: 0, max: 100 },
		melatonin: { type: Number, required: true, min: 0, max: 100 },
		digestiveEfficiency: { type: Number, required: true, min: 0, max: 100 },
		alertness: { type: Number, required: true, min: 0, max: 100 },
		polishDescription: { type: String, required: true },
	},
	{ _id: false },
);

const SupplementRecommendationSchema = new Schema(
	{
		supplementId: { type: String, required: true },
		supplementName: { type: String, required: true },
		polishSupplementName: { type: String, required: true },
		rationale: { type: String, required: true },
		polishRationale: { type: String, required: true },
		priority: {
			type: String,
			enum: ["HIGH", "MEDIUM", "LOW"],
			required: true,
			default: "MEDIUM",
		},
	},
	{ _id: false },
);

const CircadianSupplementTimingSchema = new Schema(
	{
		id: { type: String, required: true, unique: true, index: true },
		timeOfDay: {
			type: String,
			enum: ["EARLY_MORNING", "LATE_MORNING", "AFTERNOON", "EVENING", "NIGHT", "DEEP_NIGHT"],
			required: true,
			index: true,
		},
		polishTimeOfDay: { type: String, required: true },
		timeRange: { type: String, required: true },
		description: { type: String, required: true },
		polishDescription: { type: String, required: true },
		bodyStatistics: { type: BodyStatisticsSchema, required: true },
		recommendedSupplements: [SupplementRecommendationSchema],
		avoidSupplements: [{ type: String }],
		polishAvoidSupplements: [{ type: String }],
		generalGuidance: { type: String, required: true },
		polishGeneralGuidance: { type: String, required: true },
		scientificBasis: [{ type: String }],
		tags: [{ type: String }],
	},
	{
		timestamps: true,
		collection: "circadian_supplement_timing",
	},
);

// ==================== INDEXES ====================

CircadianSupplementTimingSchema.index({ timeOfDay: 1 });
CircadianSupplementTimingSchema.index({ "recommendedSupplements.supplementId": 1 });
CircadianSupplementTimingSchema.index({ tags: 1 });

// ==================== MODEL ====================

const CircadianSupplementTiming =
	mongoose.models.CircadianSupplementTiming ||
	mongoose.model<ICircadianSupplementTiming>(
		"CircadianSupplementTiming",
		CircadianSupplementTimingSchema,
	);

export default CircadianSupplementTiming;

