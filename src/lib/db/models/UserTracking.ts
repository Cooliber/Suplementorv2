/**
 * User Tracking MongoDB Schemas
 * Comprehensive tracking for supplement intake, effects, and user progress
 */

import mongoose, { Schema, type Document, type Model } from "mongoose";

// Side Effect Schema
const SideEffectSchema = new Schema(
	{
		type: { type: String, required: true },
		polishType: { type: String, required: true },
		severity: { type: Number, required: true, min: 1, max: 5 },
		onset: { type: String, required: true },
		polishOnset: { type: String, required: true },
		duration: { type: String },
		polishDuration: { type: String },
		description: { type: String },
		polishDescription: { type: String },
	},
	{ _id: false },
);

// Supplement Intake Log Schema
const SupplementIntakeLogSchema = new Schema(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		supplementId: { type: String, required: true },
		supplementName: { type: String, required: true },
		polishSupplementName: { type: String, required: true },

		// Intake details
		dosage: {
			amount: { type: Number, required: true },
			unit: { type: String, required: true },
			form: {
				type: String,
				enum: ["capsule", "tablet", "powder", "liquid", "gummy"],
				required: true,
			},
			polishForm: { type: String, required: true },
		},

		timing: {
			timestamp: { type: Date, required: true, index: true },
			timeOfDay: {
				type: String,
				enum: ["morning", "afternoon", "evening", "night"],
				required: true,
			},
			polishTimeOfDay: { type: String, required: true },
			withFood: { type: Boolean, required: true },
			mealTiming: {
				type: String,
				enum: ["before", "with", "after", "empty_stomach"],
				required: true,
			},
			polishMealTiming: { type: String, required: true },
		},

		// Context
		context: {
			mood: { type: Number, required: true, min: 1, max: 5 },
			energy: { type: Number, required: true, min: 1, max: 5 },
			stress: { type: Number, required: true, min: 1, max: 5 },
			sleep: { type: Number, required: true, min: 1, max: 5 },
			notes: { type: String },
			polishNotes: { type: String },
			weather: { type: String },
			exercise: { type: Boolean, default: false },
			alcohol: { type: Boolean, default: false },
			otherMedications: [{ type: String }],
		},

		// Adherence tracking
		adherence: {
			planned: { type: Boolean, required: true },
			missed: { type: Boolean, required: true },
			reason: { type: String },
			polishReason: { type: String },
			reminderUsed: { type: Boolean, default: false },
		},

		// Side effects
		sideEffects: {
			experienced: { type: Boolean, required: true },
			effects: [SideEffectSchema],
			severity: {
				type: String,
				enum: ["mild", "moderate", "severe"],
				default: "mild",
			},
			polishSeverity: { type: String, default: "łagodne" },
			duration: { type: String },
			polishDuration: { type: String },
		},

		// Metadata
		deviceInfo: {
			platform: { type: String },
			version: { type: String },
			timezone: { type: String },
		},
	},
	{
		timestamps: true,
		collection: "supplement_intake_logs",
	},
);

// Effect Measurement Schema
const EffectMeasurementSchema = new Schema(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		supplementId: { type: String, required: true },
		targetEffectName: { type: String, required: true, index: true },

		measurement: {
			value: { type: Number, required: true },
			scale: {
				min: { type: Number, required: true },
				max: { type: Number, required: true },
				unit: { type: String },
				polishUnit: { type: String },
			},
			timestamp: { type: Date, required: true, index: true },
			method: {
				type: String,
				enum: ["subjective_scale", "objective_test", "biomarker", "behavioral"],
				required: true,
			},
			polishMethod: { type: String, required: true },
		},

		context: {
			mood: { type: Number, required: true, min: 1, max: 5 },
			stress: { type: Number, required: true, min: 1, max: 5 },
			sleep: { type: Number, required: true, min: 1, max: 5 },
			exercise: { type: Boolean, default: false },
			alcohol: { type: Boolean, default: false },
			otherFactors: [{ type: String }],
			polishOtherFactors: [{ type: String }],
			timeOfDay: {
				type: String,
				enum: ["morning", "afternoon", "evening", "night"],
				required: true,
			},
		},

		notes: { type: String },
		polishNotes: { type: String },

		// Quality indicators
		reliability: { type: Number, min: 1, max: 5, default: 3 },
		confidence: { type: Number, min: 1, max: 5, default: 3 },
	},
	{
		timestamps: true,
		collection: "effect_measurements",
	},
);

// Supplement Schedule Schema
const SupplementScheduleSchema = new Schema(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		supplementId: { type: String, required: true },
		supplementName: { type: String, required: true },
		polishSupplementName: { type: String, required: true },

		// Schedule details
		schedule: {
			frequency: {
				type: String,
				enum: ["daily", "every_other_day", "weekly", "as_needed"],
				required: true,
			},
			polishFrequency: { type: String, required: true },
			timesPerDay: { type: Number, required: true, min: 1, max: 10 },
			specificTimes: [{ type: String }], // HH:MM format
			dosagePerIntake: {
				amount: { type: Number, required: true },
				unit: { type: String, required: true },
			},
			withFood: { type: Boolean, required: true },
			mealTiming: {
				type: String,
				enum: ["before", "with", "after", "empty_stomach"],
				required: true,
			},
			polishMealTiming: { type: String, required: true },
		},

		// Duration and cycling
		duration: {
			startDate: { type: Date, required: true },
			endDate: { type: Date },
			cyclePattern: {
				onDays: { type: Number },
				offDays: { type: Number },
				polishDescription: { type: String },
			},
			totalDuration: { type: String }, // e.g., "3 months"
			polishTotalDuration: { type: String },
		},

		// Reminders
		reminders: {
			enabled: { type: Boolean, default: true },
			methods: [
				{
					type: String,
					enum: ["push", "email", "sms"],
				},
			],
			advanceTime: { type: Number, default: 15 }, // Minutes before scheduled time
			customMessage: { type: String },
			polishCustomMessage: { type: String },
			snoozeOptions: [{ type: Number }], // Minutes
		},

		// Adherence tracking
		adherence: {
			targetAdherence: { type: Number, default: 90 }, // Percentage
			currentAdherence: { type: Number, default: 0 },
			missedDoses: { type: Number, default: 0 },
			totalDoses: { type: Number, default: 0 },
			lastMissedDate: { type: Date },
			adherenceStreak: { type: Number, default: 0 }, // Days
			bestStreak: { type: Number, default: 0 },
		},

		// Goals and monitoring
		goals: [
			{
				targetEffect: { type: String, required: true },
				polishTargetEffect: { type: String, required: true },
				targetValue: { type: Number },
				currentValue: { type: Number },
				measurementFrequency: { type: String },
				polishMeasurementFrequency: { type: String },
				achieved: { type: Boolean, default: false },
				achievedDate: { type: Date },
			},
		],

		active: { type: Boolean, default: true, index: true },
		pausedReason: { type: String },
		polishPausedReason: { type: String },
	},
	{
		timestamps: true,
		collection: "supplement_schedules",
	},
);

// Progress Insight Schema
const ProgressInsightSchema = new Schema(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		type: {
			type: String,
			enum: [
				"adherence",
				"effectiveness",
				"side_effects",
				"optimization",
				"warning",
			],
			required: true,
			index: true,
		},
		priority: {
			type: String,
			enum: ["low", "medium", "high", "critical"],
			required: true,
			index: true,
		},

		title: { type: String, required: true },
		polishTitle: { type: String, required: true },
		description: { type: String, required: true },
		polishDescription: { type: String, required: true },

		// Data supporting the insight
		data: {
			supplementIds: [{ type: String }],
			timeframe: { type: String, required: true },
			polishTimeframe: { type: String, required: true },
			metrics: { type: Map, of: Number },
			trends: { type: Map, of: String }, // 'up', 'down', 'stable'
			confidence: { type: Number, min: 0, max: 1, required: true },
		},

		// Recommendations
		recommendations: [
			{
				action: { type: String, required: true },
				polishAction: { type: String, required: true },
				rationale: { type: String, required: true },
				polishRationale: { type: String, required: true },
				urgency: {
					type: String,
					enum: ["immediate", "soon", "when_convenient"],
					required: true,
				},
				polishUrgency: { type: String, required: true },
				expectedOutcome: { type: String },
				polishExpectedOutcome: { type: String },
			},
		],

		// User interaction
		userResponse: {
			acknowledged: { type: Boolean, default: false },
			acknowledgedAt: { type: Date },
			implemented: { type: Boolean, default: false },
			implementedAt: { type: Date },
			feedback: { type: String },
			polishFeedback: { type: String },
			rating: { type: Number, min: 1, max: 5 },
		},

		// Metadata
		generatedAt: { type: Date, default: Date.now, index: true },
		expiresAt: { type: Date },
		algorithm: { type: String, required: true },
		version: { type: String, default: "1.0.0" },
	},
	{
		timestamps: true,
		collection: "progress_insights",
	},
);

// Indexes for performance
SupplementIntakeLogSchema.index({ userId: 1, "timing.timestamp": -1 });
SupplementIntakeLogSchema.index({ supplementId: 1, "timing.timestamp": -1 });
SupplementIntakeLogSchema.index({
	userId: 1,
	supplementId: 1,
	"timing.timestamp": -1,
});
SupplementIntakeLogSchema.index({ "timing.timeOfDay": 1 });
SupplementIntakeLogSchema.index({
	"adherence.planned": 1,
	"adherence.missed": 1,
});

EffectMeasurementSchema.index({ userId: 1, "measurement.timestamp": -1 });
EffectMeasurementSchema.index({
	supplementId: 1,
	targetEffectName: 1,
	"measurement.timestamp": -1,
});
EffectMeasurementSchema.index({
	userId: 1,
	supplementId: 1,
	targetEffectName: 1,
});

SupplementScheduleSchema.index({ userId: 1, active: 1 });
SupplementScheduleSchema.index({ supplementId: 1, active: 1 });
SupplementScheduleSchema.index({
	"duration.startDate": 1,
	"duration.endDate": 1,
});

ProgressInsightSchema.index({ userId: 1, priority: 1, generatedAt: -1 });
ProgressInsightSchema.index({ type: 1, priority: 1 });
ProgressInsightSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Interfaces for TypeScript
export interface ISupplementIntakeLog extends Document {
	userId: mongoose.Types.ObjectId;
	supplementId: string;
	supplementName: string;
	polishSupplementName: string;
	dosage: any;
	timing: any;
	context: any;
	adherence: any;
	sideEffects: any;
	deviceInfo: any;
}

export interface IEffectMeasurement extends Document {
	userId: mongoose.Types.ObjectId;
	supplementId: string;
	targetEffectName: string;
	measurement: any;
	context: any;
	notes?: string;
	polishNotes?: string;
	reliability: number;
	confidence: number;
}

export interface ISupplementSchedule extends Document {
	userId: mongoose.Types.ObjectId;
	supplementId: string;
	supplementName: string;
	polishSupplementName: string;
	schedule: any;
	duration: any;
	reminders: any;
	adherence: any;
	goals: any[];
	active: boolean;
	pausedReason?: string;
	polishPausedReason?: string;
}

export interface IProgressInsight extends Document {
	userId: mongoose.Types.ObjectId;
	type: string;
	priority: string;
	title: string;
	polishTitle: string;
	description: string;
	polishDescription: string;
	data: any;
	recommendations: any[];
	userResponse: any;
	generatedAt: Date;
	expiresAt?: Date;
	algorithm: string;
	version: string;
}

// Create and export the models
export const SupplementIntakeLog: Model<ISupplementIntakeLog> =
	mongoose.models.SupplementIntakeLog ||
	mongoose.model<ISupplementIntakeLog>(
		"SupplementIntakeLog",
		SupplementIntakeLogSchema,
	);

export const EffectMeasurement: Model<IEffectMeasurement> =
	mongoose.models.EffectMeasurement ||
	mongoose.model<IEffectMeasurement>(
		"EffectMeasurement",
		EffectMeasurementSchema,
	);

export const SupplementSchedule: Model<ISupplementSchedule> =
	mongoose.models.SupplementSchedule ||
	mongoose.model<ISupplementSchedule>(
		"SupplementSchedule",
		SupplementScheduleSchema,
	);

export const ProgressInsight: Model<IProgressInsight> =
	mongoose.models.ProgressInsight ||
	mongoose.model<IProgressInsight>("ProgressInsight", ProgressInsightSchema);

export default {
	SupplementIntakeLog,
	EffectMeasurement,
	SupplementSchedule,
	ProgressInsight,
};
