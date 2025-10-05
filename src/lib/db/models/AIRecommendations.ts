/**
 * AI-Powered Recommendation System Models
 * MongoDB schemas for user profiling, health goals, and intelligent supplement recommendations
 */

import mongoose, { Schema, type Document } from "mongoose";

// ==================== USER HEALTH PROFILE MODEL ====================

export interface IUserHealthProfile extends Document {
	id: string;
	userId: string;

	// Basic Demographics
	demographics: {
		age: number;
		gender: "MALE" | "FEMALE" | "OTHER" | "PREFER_NOT_TO_SAY";
		weight: number; // kg
		height: number; // cm
		activityLevel:
			| "SEDENTARY"
			| "LIGHTLY_ACTIVE"
			| "MODERATELY_ACTIVE"
			| "VERY_ACTIVE"
			| "EXTREMELY_ACTIVE";
		polishActivityLevel: string;
		sleepHours: number;
		stressLevel: number; // 1-10 scale
	};

	// Health Goals
	healthGoals: Array<{
		id: string;
		category:
			| "COGNITIVE"
			| "PHYSICAL"
			| "MENTAL"
			| "LONGEVITY"
			| "PERFORMANCE"
			| "RECOVERY";
		polishCategory: string;
		goal: string;
		polishGoal: string;
		priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
		polishPriority: string;
		targetTimeframe: string; // e.g., "3 months", "6 months"
		polishTargetTimeframe: string;
		specificMetrics: Array<{
			metric: string;
			polishMetric: string;
			currentValue: number;
			targetValue: number;
			unit: string;
			polishUnit: string;
		}>;
		isActive: boolean;
	}>;

	// Medical History
	medicalHistory: {
		conditions: Array<{
			condition: string;
			polishCondition: string;
			severity: "MILD" | "MODERATE" | "SEVERE";
			polishSeverity: string;
			diagnosedDate: Date;
			isActive: boolean;
			notes: string;
			polishNotes: string;
		}>;
		allergies: Array<{
			allergen: string;
			polishAllergen: string;
			severity: "MILD" | "MODERATE" | "SEVERE" | "LIFE_THREATENING";
			polishSeverity: string;
			symptoms: string[];
			polishSymptoms: string[];
		}>;
		medications: Array<{
			name: string;
			polishName: string;
			dosage: string;
			frequency: string;
			polishFrequency: string;
			startDate: Date;
			endDate?: Date;
			prescribedBy: string;
			purpose: string;
			polishPurpose: string;
			sideEffects: string[];
			polishSideEffects: string[];
		}>;
		supplements: Array<{
			supplementId: string;
			name: string;
			polishName: string;
			dosage: string;
			frequency: string;
			polishFrequency: string;
			startDate: Date;
			endDate?: Date;
			reason: string;
			polishReason: string;
			effectiveness: number; // 1-10 scale
			sideEffects: string[];
			polishSideEffects: string[];
		}>;
	};

	// Lifestyle Factors
	lifestyle: {
		diet: {
			type:
				| "OMNIVORE"
				| "VEGETARIAN"
				| "VEGAN"
				| "KETO"
				| "PALEO"
				| "MEDITERRANEAN"
				| "OTHER";
			polishType: string;
			restrictions: string[];
			polishRestrictions: string[];
			supplementDeficiencies: string[];
			polishSupplementDeficiencies: string[];
		};
		exercise: {
			types: string[];
			polishTypes: string[];
			frequency: number; // times per week
			intensity: "LOW" | "MODERATE" | "HIGH" | "VARIABLE";
			polishIntensity: string;
			goals: string[];
			polishGoals: string[];
		};
		sleep: {
			averageHours: number;
			quality: number; // 1-10 scale
			issues: string[];
			polishIssues: string[];
			bedtime: string; // HH:MM format
			wakeTime: string; // HH:MM format
		};
		stress: {
			level: number; // 1-10 scale
			sources: string[];
			polishSources: string[];
			managementTechniques: string[];
			polishManagementTechniques: string[];
		};
		environment: {
			workType: "OFFICE" | "REMOTE" | "PHYSICAL" | "MIXED";
			polishWorkType: string;
			exposures: string[]; // e.g., "pollution", "blue light"
			polishExposures: string[];
			climate: string;
			polishClimate: string;
		};
	};

	// Cognitive Profile
	cognitiveProfile: {
		strengths: string[];
		polishStrengths: string[];
		weaknesses: string[];
		polishWeaknesses: string[];
		learningStyle: "VISUAL" | "AUDITORY" | "KINESTHETIC" | "MIXED";
		polishLearningStyle: string;
		attentionSpan: number; // minutes
		memoryIssues: string[];
		polishMemoryIssues: string[];
		cognitiveGoals: string[];
		polishCognitiveGoals: string[];
	};

	// Preferences
	preferences: {
		supplementForms: Array<
			"CAPSULE" | "TABLET" | "POWDER" | "LIQUID" | "GUMMY" | "SUBLINGUAL"
		>;
		polishSupplementForms: string[];
		budgetRange: {
			min: number;
			max: number;
			currency: string;
			period: "MONTHLY" | "QUARTERLY" | "YEARLY";
			polishPeriod: string;
		};
		brandPreferences: string[];
		avoidIngredients: string[];
		polishAvoidIngredients: string[];
		certificationRequirements: string[]; // e.g., "organic", "third-party tested"
		polishCertificationRequirements: string[];
		timingPreferences: {
			morning: boolean;
			afternoon: boolean;
			evening: boolean;
			withMeals: boolean;
			emptyStomach: boolean;
		};
	};

	// AI Learning Data
	aiLearningData: {
		responsePatterns: Array<{
			supplementId: string;
			responseType: "POSITIVE" | "NEGATIVE" | "NEUTRAL" | "MIXED";
			responseStrength: number; // 1-10
			timeToEffect: number; // hours
			duration: number; // hours
			sideEffects: string[];
			polishSideEffects: string[];
			contextFactors: string[];
			polishContextFactors: string[];
			recordedAt: Date;
		}>;
		preferenceUpdates: Array<{
			category: string;
			oldValue: any;
			newValue: any;
			reason: string;
			polishReason: string;
			updatedAt: Date;
		}>;
		goalProgress: Array<{
			goalId: string;
			metric: string;
			polishMetric: string;
			value: number;
			trend: "IMPROVING" | "STABLE" | "DECLINING";
			polishTrend: string;
			recordedAt: Date;
		}>;
	};

	isActive: boolean;
	lastUpdated: Date;
	version: string;
}

const UserHealthProfileSchema = new Schema<IUserHealthProfile>(
	{
		id: { type: String, required: true, unique: true },
		userId: { type: String, required: true, unique: true },

		demographics: {
			age: { type: Number, required: true, min: 13, max: 120 },
			gender: {
				type: String,
				required: true,
				enum: ["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"],
			},
			weight: { type: Number, required: true, min: 30, max: 300 },
			height: { type: Number, required: true, min: 100, max: 250 },
			activityLevel: {
				type: String,
				required: true,
				enum: [
					"SEDENTARY",
					"LIGHTLY_ACTIVE",
					"MODERATELY_ACTIVE",
					"VERY_ACTIVE",
					"EXTREMELY_ACTIVE",
				],
			},
			polishActivityLevel: { type: String, required: true },
			sleepHours: { type: Number, required: true, min: 3, max: 12 },
			stressLevel: { type: Number, required: true, min: 1, max: 10 },
		},

		healthGoals: [
			{
				id: { type: String, required: true },
				category: {
					type: String,
					required: true,
					enum: [
						"COGNITIVE",
						"PHYSICAL",
						"MENTAL",
						"LONGEVITY",
						"PERFORMANCE",
						"RECOVERY",
					],
				},
				polishCategory: { type: String, required: true },
				goal: { type: String, required: true },
				polishGoal: { type: String, required: true },
				priority: {
					type: String,
					required: true,
					enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
				},
				polishPriority: { type: String, required: true },
				targetTimeframe: { type: String, required: true },
				polishTargetTimeframe: { type: String, required: true },
				specificMetrics: [
					{
						metric: { type: String, required: true },
						polishMetric: { type: String, required: true },
						currentValue: { type: Number, required: true },
						targetValue: { type: Number, required: true },
						unit: { type: String, required: true },
						polishUnit: { type: String, required: true },
					},
				],
				isActive: { type: Boolean, default: true },
			},
		],

		medicalHistory: {
			conditions: [
				{
					condition: { type: String, required: true },
					polishCondition: { type: String, required: true },
					severity: {
						type: String,
						required: true,
						enum: ["MILD", "MODERATE", "SEVERE"],
					},
					polishSeverity: { type: String, required: true },
					diagnosedDate: { type: Date, required: true },
					isActive: { type: Boolean, default: true },
					notes: { type: String },
					polishNotes: { type: String },
				},
			],
			allergies: [
				{
					allergen: { type: String, required: true },
					polishAllergen: { type: String, required: true },
					severity: {
						type: String,
						required: true,
						enum: ["MILD", "MODERATE", "SEVERE", "LIFE_THREATENING"],
					},
					polishSeverity: { type: String, required: true },
					symptoms: [{ type: String }],
					polishSymptoms: [{ type: String }],
				},
			],
			medications: [
				{
					name: { type: String, required: true },
					polishName: { type: String, required: true },
					dosage: { type: String, required: true },
					frequency: { type: String, required: true },
					polishFrequency: { type: String, required: true },
					startDate: { type: Date, required: true },
					endDate: { type: Date },
					prescribedBy: { type: String, required: true },
					purpose: { type: String, required: true },
					polishPurpose: { type: String, required: true },
					sideEffects: [{ type: String }],
					polishSideEffects: [{ type: String }],
				},
			],
			supplements: [
				{
					supplementId: { type: String, required: true },
					name: { type: String, required: true },
					polishName: { type: String, required: true },
					dosage: { type: String, required: true },
					frequency: { type: String, required: true },
					polishFrequency: { type: String, required: true },
					startDate: { type: Date, required: true },
					endDate: { type: Date },
					reason: { type: String, required: true },
					polishReason: { type: String, required: true },
					effectiveness: { type: Number, min: 1, max: 10 },
					sideEffects: [{ type: String }],
					polishSideEffects: [{ type: String }],
				},
			],
		},

		lifestyle: {
			diet: {
				type: {
					type: String,
					required: true,
					enum: [
						"OMNIVORE",
						"VEGETARIAN",
						"VEGAN",
						"KETO",
						"PALEO",
						"MEDITERRANEAN",
						"OTHER",
					],
				},
				polishType: { type: String, required: true },
				restrictions: [{ type: String }],
				polishRestrictions: [{ type: String }],
				supplementDeficiencies: [{ type: String }],
				polishSupplementDeficiencies: [{ type: String }],
			},
			exercise: {
				types: [{ type: String }],
				polishTypes: [{ type: String }],
				frequency: { type: Number, min: 0, max: 14 },
				intensity: {
					type: String,
					enum: ["LOW", "MODERATE", "HIGH", "VARIABLE"],
				},
				polishIntensity: { type: String },
				goals: [{ type: String }],
				polishGoals: [{ type: String }],
			},
			sleep: {
				averageHours: { type: Number, min: 3, max: 12 },
				quality: { type: Number, min: 1, max: 10 },
				issues: [{ type: String }],
				polishIssues: [{ type: String }],
				bedtime: { type: String },
				wakeTime: { type: String },
			},
			stress: {
				level: { type: Number, min: 1, max: 10 },
				sources: [{ type: String }],
				polishSources: [{ type: String }],
				managementTechniques: [{ type: String }],
				polishManagementTechniques: [{ type: String }],
			},
			environment: {
				workType: {
					type: String,
					enum: ["OFFICE", "REMOTE", "PHYSICAL", "MIXED"],
				},
				polishWorkType: { type: String },
				exposures: [{ type: String }],
				polishExposures: [{ type: String }],
				climate: { type: String },
				polishClimate: { type: String },
			},
		},

		cognitiveProfile: {
			strengths: [{ type: String }],
			polishStrengths: [{ type: String }],
			weaknesses: [{ type: String }],
			polishWeaknesses: [{ type: String }],
			learningStyle: {
				type: String,
				enum: ["VISUAL", "AUDITORY", "KINESTHETIC", "MIXED"],
			},
			polishLearningStyle: { type: String },
			attentionSpan: { type: Number, min: 5, max: 180 },
			memoryIssues: [{ type: String }],
			polishMemoryIssues: [{ type: String }],
			cognitiveGoals: [{ type: String }],
			polishCognitiveGoals: [{ type: String }],
		},

		preferences: {
			supplementForms: [
				{
					type: String,
					enum: [
						"CAPSULE",
						"TABLET",
						"POWDER",
						"LIQUID",
						"GUMMY",
						"SUBLINGUAL",
					],
				},
			],
			polishSupplementForms: [{ type: String }],
			budgetRange: {
				min: { type: Number, min: 0 },
				max: { type: Number, min: 0 },
				currency: { type: String, default: "EUR" },
				period: {
					type: String,
					enum: ["MONTHLY", "QUARTERLY", "YEARLY"],
					default: "MONTHLY",
				},
				polishPeriod: { type: String },
			},
			brandPreferences: [{ type: String }],
			avoidIngredients: [{ type: String }],
			polishAvoidIngredients: [{ type: String }],
			certificationRequirements: [{ type: String }],
			polishCertificationRequirements: [{ type: String }],
			timingPreferences: {
				morning: { type: Boolean, default: true },
				afternoon: { type: Boolean, default: true },
				evening: { type: Boolean, default: true },
				withMeals: { type: Boolean, default: true },
				emptyStomach: { type: Boolean, default: false },
			},
		},

		aiLearningData: {
			responsePatterns: [
				{
					supplementId: { type: String, required: true },
					responseType: {
						type: String,
						required: true,
						enum: ["POSITIVE", "NEGATIVE", "NEUTRAL", "MIXED"],
					},
					responseStrength: { type: Number, required: true, min: 1, max: 10 },
					timeToEffect: { type: Number, required: true, min: 0 },
					duration: { type: Number, required: true, min: 0 },
					sideEffects: [{ type: String }],
					polishSideEffects: [{ type: String }],
					contextFactors: [{ type: String }],
					polishContextFactors: [{ type: String }],
					recordedAt: { type: Date, default: Date.now },
				},
			],
			preferenceUpdates: [
				{
					category: { type: String, required: true },
					oldValue: { type: Schema.Types.Mixed },
					newValue: { type: Schema.Types.Mixed },
					reason: { type: String, required: true },
					polishReason: { type: String, required: true },
					updatedAt: { type: Date, default: Date.now },
				},
			],
			goalProgress: [
				{
					goalId: { type: String, required: true },
					metric: { type: String, required: true },
					polishMetric: { type: String, required: true },
					value: { type: Number, required: true },
					trend: {
						type: String,
						required: true,
						enum: ["IMPROVING", "STABLE", "DECLINING"],
					},
					polishTrend: { type: String, required: true },
					recordedAt: { type: Date, default: Date.now },
				},
			],
		},

		isActive: { type: Boolean, default: true },
		lastUpdated: { type: Date, default: Date.now },
		version: { type: String, required: true },
	},
	{
		timestamps: true,
		collection: "user_health_profiles",
	},
);

// Create indexes
UserHealthProfileSchema.index({ userId: 1 });
UserHealthProfileSchema.index({ "healthGoals.category": 1, isActive: 1 });
UserHealthProfileSchema.index({
	"demographics.age": 1,
	"demographics.gender": 1,
});
UserHealthProfileSchema.index({ "medicalHistory.conditions.condition": 1 });
UserHealthProfileSchema.index({
	"aiLearningData.responsePatterns.supplementId": 1,
});

// ==================== AI RECOMMENDATION MODEL ====================

export interface IAIRecommendation extends Document {
	id: string;
	userId: string;
	profileVersion: string;

	// Recommendation Context
	context: {
		generatedAt: Date;
		triggerEvent:
			| "PROFILE_UPDATE"
			| "GOAL_CHANGE"
			| "PERIODIC_REVIEW"
			| "USER_REQUEST"
			| "POOR_RESULTS";
		polishTriggerEvent: string;
		confidenceScore: number; // 0-1
		dataQuality: "EXCELLENT" | "GOOD" | "FAIR" | "POOR";
		polishDataQuality: string;
		algorithmVersion: string;
	};

	// Primary Recommendations
	primaryRecommendations: Array<{
		id: string;
		supplementId: string;
		supplementName: string;
		polishSupplementName: string;
		category: string;
		polishCategory: string;

		// Recommendation Strength
		recommendationScore: number; // 0-1
		confidenceLevel: "VERY_HIGH" | "HIGH" | "MODERATE" | "LOW";
		polishConfidenceLevel: string;
		priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
		polishPriority: string;

		// Reasoning
		reasoning: {
			primaryReasons: string[];
			polishPrimaryReasons: string[];
			supportingEvidence: string[];
			polishSupportingEvidence: string[];
			goalAlignment: Array<{
				goalId: string;
				goalName: string;
				polishGoalName: string;
				alignmentScore: number; // 0-1
				expectedImpact: string;
				polishExpectedImpact: string;
			}>;
			riskFactors: string[];
			polishRiskFactors: string[];
		};

		// Dosage & Timing
		dosageRecommendation: {
			amount: number;
			unit: string;
			polishUnit: string;
			frequency: string;
			polishFrequency: string;
			timing: string[];
			polishTiming: string[];
			withFood: boolean;
			specialInstructions: string;
			polishSpecialInstructions: string;
			startingDose: number;
			targetDose: number;
			titrationSchedule: string;
			polishTitrationSchedule: string;
		};

		// Expected Outcomes
		expectedOutcomes: {
			timeToEffect: {
				min: number; // days
				max: number; // days
				typical: number; // days
			};
			effectDuration: number; // hours
			expectedBenefits: Array<{
				benefit: string;
				polishBenefit: string;
				likelihood: number; // 0-1
				magnitude: number; // 1-10
				timeframe: string;
				polishTimeframe: string;
			}>;
			potentialSideEffects: Array<{
				sideEffect: string;
				polishSideEffect: string;
				probability: number; // 0-1
				severity: "MILD" | "MODERATE" | "SEVERE";
				polishSeverity: string;
				mitigation: string;
				polishMitigation: string;
			}>;
		};

		// Monitoring
		monitoringPlan: {
			trackingMetrics: string[];
			polishTrackingMetrics: string[];
			checkInFrequency: string;
			polishCheckInFrequency: string;
			warningSignals: string[];
			polishWarningSignals: string[];
			adjustmentTriggers: string[];
			polishAdjustmentTriggers: string[];
		};

		// Cost Analysis
		costAnalysis: {
			estimatedMonthlyCost: number;
			currency: string;
			costPerBenefit: number;
			budgetFit: "EXCELLENT" | "GOOD" | "TIGHT" | "OVER_BUDGET";
			polishBudgetFit: string;
			alternatives: Array<{
				supplementId: string;
				name: string;
				polishName: string;
				cost: number;
				efficacyComparison: number; // -1 to 1
			}>;
		};
	}>;

	// Alternative Recommendations
	alternativeRecommendations: Array<{
		id: string;
		supplementId: string;
		supplementName: string;
		polishSupplementName: string;
		reason:
			| "BUDGET_ALTERNATIVE"
			| "SIMILAR_EFFICACY"
			| "FEWER_SIDE_EFFECTS"
			| "BETTER_TIMING";
		polishReason: string;
		comparisonToPrimary: string;
		polishComparisonToPrimary: string;
		recommendationScore: number;
	}>;

	// Contraindications & Warnings
	contraindications: Array<{
		type:
			| "MEDICAL_CONDITION"
			| "MEDICATION_INTERACTION"
			| "ALLERGY"
			| "LIFESTYLE_CONFLICT";
		polishType: string;
		description: string;
		polishDescription: string;
		severity: "ABSOLUTE" | "RELATIVE" | "CAUTION";
		polishSeverity: string;
		affectedSupplements: string[];
		recommendations: string;
		polishRecommendations: string;
	}>;

	// Stack Optimization
	stackOptimization: {
		synergies: Array<{
			supplementIds: string[];
			supplementNames: string[];
			polishSupplementNames: string[];
			synergyType: "ADDITIVE" | "SYNERGISTIC" | "POTENTIATING";
			polishSynergyType: string;
			description: string;
			polishDescription: string;
			evidenceLevel: "STRONG" | "MODERATE" | "WEAK" | "THEORETICAL";
			polishEvidenceLevel: string;
		}>;
		timingOptimization: Array<{
			timeSlot: string;
			polishTimeSlot: string;
			supplements: Array<{
				supplementId: string;
				name: string;
				polishName: string;
				dosage: string;
				reason: string;
				polishReason: string;
			}>;
		}>;
		interactions: Array<{
			supplementIds: string[];
			interactionType: "BENEFICIAL" | "NEUTRAL" | "NEGATIVE" | "DANGEROUS";
			polishInteractionType: string;
			description: string;
			polishDescription: string;
			management: string;
			polishManagement: string;
		}>;
	};

	// Personalization Factors
	personalizationFactors: {
		geneticConsiderations: string[];
		polishGeneticConsiderations: string[];
		metabolicFactors: string[];
		polishMetabolicFactors: string[];
		lifestyleAdaptations: string[];
		polishLifestyleAdaptations: string[];
		psychologicalFactors: string[];
		polishPsychologicalFactors: string[];
	};

	// Follow-up Plan
	followUpPlan: {
		initialCheckIn: number; // days
		regularCheckIns: number; // days
		reassessmentPeriod: number; // days
		adjustmentProtocol: string;
		polishAdjustmentProtocol: string;
		successMetrics: string[];
		polishSuccessMetrics: string[];
		discontinuationCriteria: string[];
		polishDiscontinuationCriteria: string[];
	};

	// AI Learning
	aiMetadata: {
		modelVersion: string;
		trainingDataVersion: string;
		similarUserProfiles: number;
		predictionAccuracy: number; // 0-1
		uncertaintyFactors: string[];
		polishUncertaintyFactors: string[];
		improvementSuggestions: string[];
		polishImprovementSuggestions: string[];
	};

	// User Interaction
	userFeedback: {
		viewed: boolean;
		viewedAt?: Date;
		accepted: boolean;
		acceptedAt?: Date;
		rejectedRecommendations: string[];
		rejectionReasons: string[];
		polishRejectionReasons: string[];
		customizations: Array<{
			recommendationId: string;
			field: string;
			originalValue: any;
			customValue: any;
			reason: string;
			polishReason: string;
		}>;
		overallSatisfaction: number; // 1-10
		comments: string;
		polishComments: string;
	};

	status:
		| "PENDING"
		| "VIEWED"
		| "ACCEPTED"
		| "PARTIALLY_ACCEPTED"
		| "REJECTED"
		| "EXPIRED";
	polishStatus: string;
	expiresAt: Date;
	isActive: boolean;
	lastUpdated: Date;
	version: string;
}

const AIRecommendationSchema = new Schema<IAIRecommendation>(
	{
		id: { type: String, required: true, unique: true },
		userId: { type: String, required: true },
		profileVersion: { type: String, required: true },

		context: {
			generatedAt: { type: Date, default: Date.now },
			triggerEvent: {
				type: String,
				required: true,
				enum: [
					"PROFILE_UPDATE",
					"GOAL_CHANGE",
					"PERIODIC_REVIEW",
					"USER_REQUEST",
					"POOR_RESULTS",
				],
			},
			polishTriggerEvent: { type: String, required: true },
			confidenceScore: { type: Number, required: true, min: 0, max: 1 },
			dataQuality: {
				type: String,
				required: true,
				enum: ["EXCELLENT", "GOOD", "FAIR", "POOR"],
			},
			polishDataQuality: { type: String, required: true },
			algorithmVersion: { type: String, required: true },
		},

		primaryRecommendations: [
			{
				id: { type: String, required: true },
				supplementId: { type: String, required: true },
				supplementName: { type: String, required: true },
				polishSupplementName: { type: String, required: true },
				category: { type: String, required: true },
				polishCategory: { type: String, required: true },

				recommendationScore: { type: Number, required: true, min: 0, max: 1 },
				confidenceLevel: {
					type: String,
					required: true,
					enum: ["VERY_HIGH", "HIGH", "MODERATE", "LOW"],
				},
				polishConfidenceLevel: { type: String, required: true },
				priority: {
					type: String,
					required: true,
					enum: ["CRITICAL", "HIGH", "MEDIUM", "LOW"],
				},
				polishPriority: { type: String, required: true },

				reasoning: {
					primaryReasons: [{ type: String }],
					polishPrimaryReasons: [{ type: String }],
					supportingEvidence: [{ type: String }],
					polishSupportingEvidence: [{ type: String }],
					goalAlignment: [
						{
							goalId: { type: String, required: true },
							goalName: { type: String, required: true },
							polishGoalName: { type: String, required: true },
							alignmentScore: { type: Number, required: true, min: 0, max: 1 },
							expectedImpact: { type: String, required: true },
							polishExpectedImpact: { type: String, required: true },
						},
					],
					riskFactors: [{ type: String }],
					polishRiskFactors: [{ type: String }],
				},

				dosageRecommendation: {
					amount: { type: Number, required: true },
					unit: { type: String, required: true },
					polishUnit: { type: String, required: true },
					frequency: { type: String, required: true },
					polishFrequency: { type: String, required: true },
					timing: [{ type: String }],
					polishTiming: [{ type: String }],
					withFood: { type: Boolean, required: true },
					specialInstructions: { type: String },
					polishSpecialInstructions: { type: String },
					startingDose: { type: Number, required: true },
					targetDose: { type: Number, required: true },
					titrationSchedule: { type: String },
					polishTitrationSchedule: { type: String },
				},

				expectedOutcomes: {
					timeToEffect: {
						min: { type: Number, required: true },
						max: { type: Number, required: true },
						typical: { type: Number, required: true },
					},
					effectDuration: { type: Number, required: true },
					expectedBenefits: [
						{
							benefit: { type: String, required: true },
							polishBenefit: { type: String, required: true },
							likelihood: { type: Number, required: true, min: 0, max: 1 },
							magnitude: { type: Number, required: true, min: 1, max: 10 },
							timeframe: { type: String, required: true },
							polishTimeframe: { type: String, required: true },
						},
					],
					potentialSideEffects: [
						{
							sideEffect: { type: String, required: true },
							polishSideEffect: { type: String, required: true },
							probability: { type: Number, required: true, min: 0, max: 1 },
							severity: {
								type: String,
								required: true,
								enum: ["MILD", "MODERATE", "SEVERE"],
							},
							polishSeverity: { type: String, required: true },
							mitigation: { type: String, required: true },
							polishMitigation: { type: String, required: true },
						},
					],
				},

				monitoringPlan: {
					trackingMetrics: [{ type: String }],
					polishTrackingMetrics: [{ type: String }],
					checkInFrequency: { type: String, required: true },
					polishCheckInFrequency: { type: String, required: true },
					warningSignals: [{ type: String }],
					polishWarningSignals: [{ type: String }],
					adjustmentTriggers: [{ type: String }],
					polishAdjustmentTriggers: [{ type: String }],
				},

				costAnalysis: {
					estimatedMonthlyCost: { type: Number, required: true },
					currency: { type: String, default: "EUR" },
					costPerBenefit: { type: Number, required: true },
					budgetFit: {
						type: String,
						required: true,
						enum: ["EXCELLENT", "GOOD", "TIGHT", "OVER_BUDGET"],
					},
					polishBudgetFit: { type: String, required: true },
					alternatives: [
						{
							supplementId: { type: String, required: true },
							name: { type: String, required: true },
							polishName: { type: String, required: true },
							cost: { type: Number, required: true },
							efficacyComparison: {
								type: Number,
								required: true,
								min: -1,
								max: 1,
							},
						},
					],
				},
			},
		],

		alternativeRecommendations: [
			{
				id: { type: String, required: true },
				supplementId: { type: String, required: true },
				supplementName: { type: String, required: true },
				polishSupplementName: { type: String, required: true },
				reason: {
					type: String,
					required: true,
					enum: [
						"BUDGET_ALTERNATIVE",
						"SIMILAR_EFFICACY",
						"FEWER_SIDE_EFFECTS",
						"BETTER_TIMING",
					],
				},
				polishReason: { type: String, required: true },
				comparisonToPrimary: { type: String, required: true },
				polishComparisonToPrimary: { type: String, required: true },
				recommendationScore: { type: Number, required: true, min: 0, max: 1 },
			},
		],

		contraindications: [
			{
				type: {
					type: String,
					required: true,
					enum: [
						"MEDICAL_CONDITION",
						"MEDICATION_INTERACTION",
						"ALLERGY",
						"LIFESTYLE_CONFLICT",
					],
				},
				polishType: { type: String, required: true },
				description: { type: String, required: true },
				polishDescription: { type: String, required: true },
				severity: {
					type: String,
					required: true,
					enum: ["ABSOLUTE", "RELATIVE", "CAUTION"],
				},
				polishSeverity: { type: String, required: true },
				affectedSupplements: [{ type: String }],
				recommendations: { type: String, required: true },
				polishRecommendations: { type: String, required: true },
			},
		],

		stackOptimization: {
			synergies: [
				{
					supplementIds: [{ type: String }],
					supplementNames: [{ type: String }],
					polishSupplementNames: [{ type: String }],
					synergyType: {
						type: String,
						enum: ["ADDITIVE", "SYNERGISTIC", "POTENTIATING"],
					},
					polishSynergyType: { type: String },
					description: { type: String },
					polishDescription: { type: String },
					evidenceLevel: {
						type: String,
						enum: ["STRONG", "MODERATE", "WEAK", "THEORETICAL"],
					},
					polishEvidenceLevel: { type: String },
				},
			],
			timingOptimization: [
				{
					timeSlot: { type: String, required: true },
					polishTimeSlot: { type: String, required: true },
					supplements: [
						{
							supplementId: { type: String, required: true },
							name: { type: String, required: true },
							polishName: { type: String, required: true },
							dosage: { type: String, required: true },
							reason: { type: String, required: true },
							polishReason: { type: String, required: true },
						},
					],
				},
			],
			interactions: [
				{
					supplementIds: [{ type: String }],
					interactionType: {
						type: String,
						enum: ["BENEFICIAL", "NEUTRAL", "NEGATIVE", "DANGEROUS"],
					},
					polishInteractionType: { type: String },
					description: { type: String },
					polishDescription: { type: String },
					management: { type: String },
					polishManagement: { type: String },
				},
			],
		},

		personalizationFactors: {
			geneticConsiderations: [{ type: String }],
			polishGeneticConsiderations: [{ type: String }],
			metabolicFactors: [{ type: String }],
			polishMetabolicFactors: [{ type: String }],
			lifestyleAdaptations: [{ type: String }],
			polishLifestyleAdaptations: [{ type: String }],
			psychologicalFactors: [{ type: String }],
			polishPsychologicalFactors: [{ type: String }],
		},

		followUpPlan: {
			initialCheckIn: { type: Number, required: true },
			regularCheckIns: { type: Number, required: true },
			reassessmentPeriod: { type: Number, required: true },
			adjustmentProtocol: { type: String, required: true },
			polishAdjustmentProtocol: { type: String, required: true },
			successMetrics: [{ type: String }],
			polishSuccessMetrics: [{ type: String }],
			discontinuationCriteria: [{ type: String }],
			polishDiscontinuationCriteria: [{ type: String }],
		},

		aiMetadata: {
			modelVersion: { type: String, required: true },
			trainingDataVersion: { type: String, required: true },
			similarUserProfiles: { type: Number, required: true },
			predictionAccuracy: { type: Number, required: true, min: 0, max: 1 },
			uncertaintyFactors: [{ type: String }],
			polishUncertaintyFactors: [{ type: String }],
			improvementSuggestions: [{ type: String }],
			polishImprovementSuggestions: [{ type: String }],
		},

		userFeedback: {
			viewed: { type: Boolean, default: false },
			viewedAt: { type: Date },
			accepted: { type: Boolean, default: false },
			acceptedAt: { type: Date },
			rejectedRecommendations: [{ type: String }],
			rejectionReasons: [{ type: String }],
			polishRejectionReasons: [{ type: String }],
			customizations: [
				{
					recommendationId: { type: String, required: true },
					field: { type: String, required: true },
					originalValue: { type: Schema.Types.Mixed },
					customValue: { type: Schema.Types.Mixed },
					reason: { type: String, required: true },
					polishReason: { type: String, required: true },
				},
			],
			overallSatisfaction: { type: Number, min: 1, max: 10 },
			comments: { type: String },
			polishComments: { type: String },
		},

		status: {
			type: String,
			required: true,
			enum: [
				"PENDING",
				"VIEWED",
				"ACCEPTED",
				"PARTIALLY_ACCEPTED",
				"REJECTED",
				"EXPIRED",
			],
			default: "PENDING",
		},
		polishStatus: { type: String, required: true },
		expiresAt: { type: Date, required: true },
		isActive: { type: Boolean, default: true },
		lastUpdated: { type: Date, default: Date.now },
		version: { type: String, required: true },
	},
	{
		timestamps: true,
		collection: "ai_recommendations",
	},
);

// Create indexes
AIRecommendationSchema.index({ userId: 1, status: 1 });
AIRecommendationSchema.index({ "primaryRecommendations.supplementId": 1 });
AIRecommendationSchema.index({ expiresAt: 1 });
AIRecommendationSchema.index({ "context.generatedAt": -1 });
AIRecommendationSchema.index({ "context.confidenceScore": -1 });

// Export models
export const UserHealthProfile =
	mongoose.models.UserHealthProfile ||
	mongoose.model<IUserHealthProfile>(
		"UserHealthProfile",
		UserHealthProfileSchema,
	);
export const AIRecommendation =
	mongoose.models.AIRecommendation ||
	mongoose.model<IAIRecommendation>("AIRecommendation", AIRecommendationSchema);
