/**
 * Cognitive Psychology & Productivity Models
 * MongoDB schemas for cognitive biases, heuristics, and productivity techniques
 */

import mongoose, { Schema, type Document } from "mongoose";

// ==================== COGNITIVE BIAS MODEL ====================

export interface ICognitiveBias extends Document {
	id: string;
	name: string;
	polishName: string;
	category:
		| "DECISION_MAKING"
		| "MEMORY"
		| "SOCIAL"
		| "STATISTICAL"
		| "CONFIRMATION"
		| "AVAILABILITY"
		| "ANCHORING"
		| "FRAMING";
	polishCategory: string;
	description: string;
	polishDescription: string;
	definition: string;
	polishDefinition: string;

	// How it affects supplement decisions
	supplementDecisionImpact: {
		description: string;
		polishDescription: string;
		examples: Array<{
			scenario: string;
			polishScenario: string;
			biasedThinking: string;
			polishBiasedThinking: string;
			rationalApproach: string;
			polishRationalApproach: string;
		}>;
		severity: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
		polishSeverity: string;
	};

	// Recognition techniques
	recognitionTechniques: Array<{
		technique: string;
		polishTechnique: string;
		description: string;
		polishDescription: string;
		practicalSteps: string[];
		polishPracticalSteps: string[];
	}>;

	// Mitigation strategies
	mitigationStrategies: Array<{
		strategy: string;
		polishStrategy: string;
		description: string;
		polishDescription: string;
		implementation: string;
		polishImplementation: string;
		effectiveness: number; // 1-10 scale
	}>;

	// Research evidence
	researchEvidence: {
		studyCount: number;
		evidenceLevel: "STRONG" | "MODERATE" | "WEAK" | "THEORETICAL";
		polishEvidenceLevel: string;
		keyFindings: string[];
		polishKeyFindings: string[];
		limitations: string[];
		polishLimitations: string[];
	};

	// Interactive elements
	interactiveExercises: Array<{
		id: string;
		type: "SCENARIO" | "QUIZ" | "REFLECTION" | "SIMULATION";
		title: string;
		polishTitle: string;
		description: string;
		polishDescription: string;
		content: any; // Flexible content structure
		estimatedTime: number; // minutes
	}>;

	relatedBiases: string[]; // IDs of related biases
	tags: string[];
	polishTags: string[];
	difficultyLevel: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
	isActive: boolean;
	lastUpdated: Date;
	version: string;
}

const CognitiveBiasSchema = new Schema<ICognitiveBias>(
	{
		id: { type: String, required: true, unique: true },
		name: { type: String, required: true },
		polishName: { type: String, required: true },
		category: {
			type: String,
			required: true,
			enum: [
				"DECISION_MAKING",
				"MEMORY",
				"SOCIAL",
				"STATISTICAL",
				"CONFIRMATION",
				"AVAILABILITY",
				"ANCHORING",
				"FRAMING",
			],
		},
		polishCategory: { type: String, required: true },
		description: { type: String, required: true },
		polishDescription: { type: String, required: true },
		definition: { type: String, required: true },
		polishDefinition: { type: String, required: true },

		supplementDecisionImpact: {
			description: { type: String, required: true },
			polishDescription: { type: String, required: true },
			examples: [
				{
					scenario: { type: String, required: true },
					polishScenario: { type: String, required: true },
					biasedThinking: { type: String, required: true },
					polishBiasedThinking: { type: String, required: true },
					rationalApproach: { type: String, required: true },
					polishRationalApproach: { type: String, required: true },
				},
			],
			severity: {
				type: String,
				required: true,
				enum: ["LOW", "MODERATE", "HIGH", "CRITICAL"],
			},
			polishSeverity: { type: String, required: true },
		},

		recognitionTechniques: [
			{
				technique: { type: String, required: true },
				polishTechnique: { type: String, required: true },
				description: { type: String, required: true },
				polishDescription: { type: String, required: true },
				practicalSteps: [{ type: String }],
				polishPracticalSteps: [{ type: String }],
			},
		],

		mitigationStrategies: [
			{
				strategy: { type: String, required: true },
				polishStrategy: { type: String, required: true },
				description: { type: String, required: true },
				polishDescription: { type: String, required: true },
				implementation: { type: String, required: true },
				polishImplementation: { type: String, required: true },
				effectiveness: { type: Number, required: true, min: 1, max: 10 },
			},
		],

		researchEvidence: {
			studyCount: { type: Number, required: true },
			evidenceLevel: {
				type: String,
				required: true,
				enum: ["STRONG", "MODERATE", "WEAK", "THEORETICAL"],
			},
			polishEvidenceLevel: { type: String, required: true },
			keyFindings: [{ type: String }],
			polishKeyFindings: [{ type: String }],
			limitations: [{ type: String }],
			polishLimitations: [{ type: String }],
		},

		interactiveExercises: [
			{
				id: { type: String, required: true },
				type: {
					type: String,
					required: true,
					enum: ["SCENARIO", "QUIZ", "REFLECTION", "SIMULATION"],
				},
				title: { type: String, required: true },
				polishTitle: { type: String, required: true },
				description: { type: String, required: true },
				polishDescription: { type: String, required: true },
				content: { type: Schema.Types.Mixed, required: true },
				estimatedTime: { type: Number, required: true },
			},
		],

		relatedBiases: [{ type: String }],
		tags: [{ type: String }],
		polishTags: [{ type: String }],
		difficultyLevel: {
			type: String,
			required: true,
			enum: ["BEGINNER", "INTERMEDIATE", "ADVANCED"],
		},
		isActive: { type: Boolean, default: true },
		lastUpdated: { type: Date, default: Date.now },
		version: { type: String, required: true },
	},
	{
		timestamps: true,
		collection: "cognitive_biases",
	},
);

// ==================== PRODUCTIVITY TECHNIQUE MODEL ====================

export interface IProductivityTechnique extends Document {
	id: string;
	name: string;
	polishName: string;
	category:
		| "TIME_MANAGEMENT"
		| "FOCUS"
		| "ENERGY"
		| "MOTIVATION"
		| "HABIT_FORMATION"
		| "DECISION_MAKING"
		| "STRESS_MANAGEMENT"
		| "COGNITIVE_ENHANCEMENT";
	polishCategory: string;
	description: string;
	polishDescription: string;

	// Core technique details
	methodology: {
		overview: string;
		polishOverview: string;
		steps: Array<{
			stepNumber: number;
			title: string;
			polishTitle: string;
			description: string;
			polishDescription: string;
			duration?: string;
			polishDuration?: string;
			tips: string[];
			polishTips: string[];
		}>;
		requirements: string[];
		polishRequirements: string[];
		tools: string[];
		polishTools: string[];
	};

	// Scientific foundation
	scientificBasis: {
		psychologicalPrinciples: string[];
		polishPsychologicalPrinciples: string[];
		neuroscienceEvidence: string;
		polishNeuroscienceEvidence: string;
		researchStudies: Array<{
			title: string;
			polishTitle: string;
			authors: string;
			year: number;
			findings: string;
			polishFindings: string;
			effectSize?: number;
			sampleSize?: number;
		}>;
		evidenceLevel: "STRONG" | "MODERATE" | "WEAK" | "ANECDOTAL";
		polishEvidenceLevel: string;
	};

	// Practical implementation
	implementation: {
		gettingStarted: string;
		polishGettingStarted: string;
		commonMistakes: string[];
		polishCommonMistakes: string[];
		troubleshooting: Array<{
			problem: string;
			polishProblem: string;
			solution: string;
			polishSolution: string;
		}>;
		adaptations: Array<{
			situation: string;
			polishSituation: string;
			modification: string;
			polishModification: string;
		}>;
	};

	// Effectiveness metrics
	effectiveness: {
		averageImprovementPercentage: number;
		timeToSeeResults: string;
		polishTimeToSeeResults: string;
		sustainabilityRating: number; // 1-10
		difficultyRating: number; // 1-10
		userSatisfactionRating: number; // 1-10
		applicabilityScenarios: string[];
		polishApplicabilityScenarios: string[];
	};

	// Integration with supplements
	supplementSynergies: Array<{
		supplementId: string;
		supplementName: string;
		polishSupplementName: string;
		synergyType: "ENHANCES" | "SUPPORTS" | "COMPLEMENTS" | "OPTIMIZES";
		polishSynergyType: string;
		description: string;
		polishDescription: string;
		recommendedTiming: string;
		polishRecommendedTiming: string;
		evidenceLevel: "STRONG" | "MODERATE" | "WEAK" | "THEORETICAL";
	}>;

	// Tracking and measurement
	trackingMetrics: Array<{
		metric: string;
		polishMetric: string;
		measurementMethod: string;
		polishMeasurementMethod: string;
		frequency: string;
		polishFrequency: string;
		targetImprovement: string;
		polishTargetImprovement: string;
	}>;

	relatedTechniques: string[]; // IDs of related techniques
	prerequisites: string[];
	polishPrerequisites: string[];
	tags: string[];
	polishTags: string[];
	difficultyLevel: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
	estimatedTimeToMaster: number; // days
	isActive: boolean;
	lastUpdated: Date;
	version: string;
}

const ProductivityTechniqueSchema = new Schema<IProductivityTechnique>(
	{
		id: { type: String, required: true, unique: true },
		name: { type: String, required: true },
		polishName: { type: String, required: true },
		category: {
			type: String,
			required: true,
			enum: [
				"TIME_MANAGEMENT",
				"FOCUS",
				"ENERGY",
				"MOTIVATION",
				"HABIT_FORMATION",
				"DECISION_MAKING",
				"STRESS_MANAGEMENT",
				"COGNITIVE_ENHANCEMENT",
			],
		},
		polishCategory: { type: String, required: true },
		description: { type: String, required: true },
		polishDescription: { type: String, required: true },

		methodology: {
			overview: { type: String, required: true },
			polishOverview: { type: String, required: true },
			steps: [
				{
					stepNumber: { type: Number, required: true },
					title: { type: String, required: true },
					polishTitle: { type: String, required: true },
					description: { type: String, required: true },
					polishDescription: { type: String, required: true },
					duration: { type: String },
					polishDuration: { type: String },
					tips: [{ type: String }],
					polishTips: [{ type: String }],
				},
			],
			requirements: [{ type: String }],
			polishRequirements: [{ type: String }],
			tools: [{ type: String }],
			polishTools: [{ type: String }],
		},

		scientificBasis: {
			psychologicalPrinciples: [{ type: String }],
			polishPsychologicalPrinciples: [{ type: String }],
			neuroscienceEvidence: { type: String, required: true },
			polishNeuroscienceEvidence: { type: String, required: true },
			researchStudies: [
				{
					title: { type: String, required: true },
					polishTitle: { type: String, required: true },
					authors: { type: String, required: true },
					year: { type: Number, required: true },
					findings: { type: String, required: true },
					polishFindings: { type: String, required: true },
					effectSize: { type: Number },
					sampleSize: { type: Number },
				},
			],
			evidenceLevel: {
				type: String,
				required: true,
				enum: ["STRONG", "MODERATE", "WEAK", "ANECDOTAL"],
			},
			polishEvidenceLevel: { type: String, required: true },
		},

		implementation: {
			gettingStarted: { type: String, required: true },
			polishGettingStarted: { type: String, required: true },
			commonMistakes: [{ type: String }],
			polishCommonMistakes: [{ type: String }],
			troubleshooting: [
				{
					problem: { type: String, required: true },
					polishProblem: { type: String, required: true },
					solution: { type: String, required: true },
					polishSolution: { type: String, required: true },
				},
			],
			adaptations: [
				{
					situation: { type: String, required: true },
					polishSituation: { type: String, required: true },
					modification: { type: String, required: true },
					polishModification: { type: String, required: true },
				},
			],
		},

		effectiveness: {
			averageImprovementPercentage: { type: Number, required: true },
			timeToSeeResults: { type: String, required: true },
			polishTimeToSeeResults: { type: String, required: true },
			sustainabilityRating: { type: Number, required: true, min: 1, max: 10 },
			difficultyRating: { type: Number, required: true, min: 1, max: 10 },
			userSatisfactionRating: { type: Number, required: true, min: 1, max: 10 },
			applicabilityScenarios: [{ type: String }],
			polishApplicabilityScenarios: [{ type: String }],
		},

		supplementSynergies: [
			{
				supplementId: { type: String, required: true },
				supplementName: { type: String, required: true },
				polishSupplementName: { type: String, required: true },
				synergyType: {
					type: String,
					required: true,
					enum: ["ENHANCES", "SUPPORTS", "COMPLEMENTS", "OPTIMIZES"],
				},
				polishSynergyType: { type: String, required: true },
				description: { type: String, required: true },
				polishDescription: { type: String, required: true },
				recommendedTiming: { type: String, required: true },
				polishRecommendedTiming: { type: String, required: true },
				evidenceLevel: {
					type: String,
					required: true,
					enum: ["STRONG", "MODERATE", "WEAK", "THEORETICAL"],
				},
			},
		],

		trackingMetrics: [
			{
				metric: { type: String, required: true },
				polishMetric: { type: String, required: true },
				measurementMethod: { type: String, required: true },
				polishMeasurementMethod: { type: String, required: true },
				frequency: { type: String, required: true },
				polishFrequency: { type: String, required: true },
				targetImprovement: { type: String, required: true },
				polishTargetImprovement: { type: String, required: true },
			},
		],

		relatedTechniques: [{ type: String }],
		prerequisites: [{ type: String }],
		polishPrerequisites: [{ type: String }],
		tags: [{ type: String }],
		polishTags: [{ type: String }],
		difficultyLevel: {
			type: String,
			required: true,
			enum: ["BEGINNER", "INTERMEDIATE", "ADVANCED"],
		},
		estimatedTimeToMaster: { type: Number, required: true },
		isActive: { type: Boolean, default: true },
		lastUpdated: { type: Date, default: Date.now },
		version: { type: String, required: true },
	},
	{
		timestamps: true,
		collection: "productivity_techniques",
	},
);

// ==================== HABIT FORMATION MODEL ====================

export interface IHabitFormation extends Document {
	id: string;
	userId: string;
	habitType:
		| "SUPPLEMENT_INTAKE"
		| "PRODUCTIVITY_TECHNIQUE"
		| "COGNITIVE_EXERCISE"
		| "LIFESTYLE"
		| "CUSTOM";
	polishHabitType: string;

	habitDetails: {
		name: string;
		polishName: string;
		description: string;
		polishDescription: string;
		targetFrequency: "DAILY" | "WEEKLY" | "MULTIPLE_DAILY" | "CUSTOM";
		polishTargetFrequency: string;
		customFrequency?: string;
		polishCustomFrequency?: string;
		estimatedDuration: number; // minutes
		difficulty: "EASY" | "MODERATE" | "HARD" | "VERY_HARD";
		polishDifficulty: string;
	};

	// Habit formation strategy
	formationStrategy: {
		technique:
			| "HABIT_STACKING"
			| "ENVIRONMENT_DESIGN"
			| "IMPLEMENTATION_INTENTION"
			| "TEMPTATION_BUNDLING"
			| "SOCIAL_ACCOUNTABILITY"
			| "REWARD_SYSTEM";
		polishTechnique: string;
		cue: string;
		polishCue: string;
		routine: string;
		polishRoutine: string;
		reward: string;
		polishReward: string;
		environmentalTriggers: string[];
		polishEnvironmentalTriggers: string[];
	};

	// Progress tracking
	progress: {
		startDate: Date;
		targetCompletionDate: Date;
		currentStreak: number;
		longestStreak: number;
		totalCompletions: number;
		missedDays: number;
		completionRate: number; // percentage
		weeklyProgress: Array<{
			week: number;
			completions: number;
			target: number;
			notes: string;
			polishNotes: string;
		}>;
	};

	// Integration with supplements/techniques
	relatedSupplements: Array<{
		supplementId: string;
		supplementName: string;
		polishSupplementName: string;
		relationship:
			| "SUPPORTS_HABIT"
			| "HABIT_SUPPORTS_SUPPLEMENT"
			| "SYNERGISTIC";
		polishRelationship: string;
	}>;

	relatedTechniques: Array<{
		techniqueId: string;
		techniqueName: string;
		polishTechniqueName: string;
		relationship: "PREREQUISITE" | "COMPLEMENTARY" | "ADVANCED_VERSION";
		polishRelationship: string;
	}>;

	// Behavioral insights
	insights: {
		bestPerformanceTimes: string[];
		polishBestPerformanceTimes: string[];
		challengingScenarios: string[];
		polishChallengingScenarios: string[];
		motivationalFactors: string[];
		polishMotivationalFactors: string[];
		barriers: string[];
		polishBarriers: string[];
	};

	isActive: boolean;
	lastUpdated: Date;
	completedAt?: Date;
}

const HabitFormationSchema = new Schema<IHabitFormation>(
	{
		id: { type: String, required: true, unique: true },
		userId: { type: String, required: true },
		habitType: {
			type: String,
			required: true,
			enum: [
				"SUPPLEMENT_INTAKE",
				"PRODUCTIVITY_TECHNIQUE",
				"COGNITIVE_EXERCISE",
				"LIFESTYLE",
				"CUSTOM",
			],
		},
		polishHabitType: { type: String, required: true },

		habitDetails: {
			name: { type: String, required: true },
			polishName: { type: String, required: true },
			description: { type: String, required: true },
			polishDescription: { type: String, required: true },
			targetFrequency: {
				type: String,
				required: true,
				enum: ["DAILY", "WEEKLY", "MULTIPLE_DAILY", "CUSTOM"],
			},
			polishTargetFrequency: { type: String, required: true },
			customFrequency: { type: String },
			polishCustomFrequency: { type: String },
			estimatedDuration: { type: Number, required: true },
			difficulty: {
				type: String,
				required: true,
				enum: ["EASY", "MODERATE", "HARD", "VERY_HARD"],
			},
			polishDifficulty: { type: String, required: true },
		},

		formationStrategy: {
			technique: {
				type: String,
				required: true,
				enum: [
					"HABIT_STACKING",
					"ENVIRONMENT_DESIGN",
					"IMPLEMENTATION_INTENTION",
					"TEMPTATION_BUNDLING",
					"SOCIAL_ACCOUNTABILITY",
					"REWARD_SYSTEM",
				],
			},
			polishTechnique: { type: String, required: true },
			cue: { type: String, required: true },
			polishCue: { type: String, required: true },
			routine: { type: String, required: true },
			polishRoutine: { type: String, required: true },
			reward: { type: String, required: true },
			polishReward: { type: String, required: true },
			environmentalTriggers: [{ type: String }],
			polishEnvironmentalTriggers: [{ type: String }],
		},

		progress: {
			startDate: { type: Date, required: true },
			targetCompletionDate: { type: Date, required: true },
			currentStreak: { type: Number, default: 0 },
			longestStreak: { type: Number, default: 0 },
			totalCompletions: { type: Number, default: 0 },
			missedDays: { type: Number, default: 0 },
			completionRate: { type: Number, default: 0 },
			weeklyProgress: [
				{
					week: { type: Number, required: true },
					completions: { type: Number, required: true },
					target: { type: Number, required: true },
					notes: { type: String },
					polishNotes: { type: String },
				},
			],
		},

		relatedSupplements: [
			{
				supplementId: { type: String, required: true },
				supplementName: { type: String, required: true },
				polishSupplementName: { type: String, required: true },
				relationship: {
					type: String,
					required: true,
					enum: ["SUPPORTS_HABIT", "HABIT_SUPPORTS_SUPPLEMENT", "SYNERGISTIC"],
				},
				polishRelationship: { type: String, required: true },
			},
		],

		relatedTechniques: [
			{
				techniqueId: { type: String, required: true },
				techniqueName: { type: String, required: true },
				polishTechniqueName: { type: String, required: true },
				relationship: {
					type: String,
					required: true,
					enum: ["PREREQUISITE", "COMPLEMENTARY", "ADVANCED_VERSION"],
				},
				polishRelationship: { type: String, required: true },
			},
		],

		insights: {
			bestPerformanceTimes: [{ type: String }],
			polishBestPerformanceTimes: [{ type: String }],
			challengingScenarios: [{ type: String }],
			polishChallengingScenarios: [{ type: String }],
			motivationalFactors: [{ type: String }],
			polishMotivationalFactors: [{ type: String }],
			barriers: [{ type: String }],
			polishBarriers: [{ type: String }],
		},

		isActive: { type: Boolean, default: true },
		lastUpdated: { type: Date, default: Date.now },
		completedAt: { type: Date },
	},
	{
		timestamps: true,
		collection: "habit_formations",
	},
);

// Create indexes
CognitiveBiasSchema.index({ id: 1 });
CognitiveBiasSchema.index({ category: 1, isActive: 1 });
CognitiveBiasSchema.index({
	polishName: "text",
	polishDescription: "text",
	polishTags: "text",
});

ProductivityTechniqueSchema.index({ id: 1 });
ProductivityTechniqueSchema.index({ category: 1, isActive: 1 });
ProductivityTechniqueSchema.index({
	polishName: "text",
	polishDescription: "text",
	polishTags: "text",
});

HabitFormationSchema.index({ id: 1 });
HabitFormationSchema.index({ userId: 1, isActive: 1 });
HabitFormationSchema.index({ habitType: 1, userId: 1 });

// Export models
export const CognitiveBias =
	mongoose.models.CognitiveBias ||
	mongoose.model<ICognitiveBias>("CognitiveBias", CognitiveBiasSchema);
export const ProductivityTechnique =
	mongoose.models.ProductivityTechnique ||
	mongoose.model<IProductivityTechnique>(
		"ProductivityTechnique",
		ProductivityTechniqueSchema,
	);
export const HabitFormation =
	mongoose.models.HabitFormation ||
	mongoose.model<IHabitFormation>("HabitFormation", HabitFormationSchema);
