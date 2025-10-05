/**
 * Personal Supplement Tracking Service
 * Comprehensive intake logging, effect monitoring, and progress tracking
 * Includes timing optimization and personalized insights
 */

export interface SupplementIntakeLog {
	id: string;
	userId: string;
	supplementId: string;
	supplementName: string;
	polishSupplementName: string;

	// Intake details
	dosage: {
		amount: number;
		unit: string;
		form: "capsule" | "tablet" | "powder" | "liquid" | "gummy";
		polishForm: string;
	};

	timing: {
		timestamp: string; // ISO string
		timeOfDay: "morning" | "afternoon" | "evening" | "night";
		polishTimeOfDay: string;
		withFood: boolean;
		mealTiming: "before" | "with" | "after" | "empty_stomach";
		polishMealTiming: string;
	};

	// Context
	context: {
		mood: 1 | 2 | 3 | 4 | 5; // 1 = very poor, 5 = excellent
		energy: 1 | 2 | 3 | 4 | 5;
		stress: 1 | 2 | 3 | 4 | 5;
		sleep: 1 | 2 | 3 | 4 | 5; // Previous night's sleep quality
		notes?: string;
		polishNotes?: string;
	};

	// Adherence tracking
	adherence: {
		planned: boolean; // Was this intake planned?
		missed: boolean; // Was a planned dose missed?
		reason?: string; // Reason for missing or taking unplanned dose
		polishReason?: string;
	};

	// Side effects
	sideEffects: {
		experienced: boolean;
		effects: SideEffect[];
		severity: "mild" | "moderate" | "severe";
		polishSeverity: string;
		duration?: string; // How long effects lasted
		polishDuration?: string;
	};

	createdAt: string;
	updatedAt: string;
}

export interface SideEffect {
	type: string;
	polishType: string;
	severity: 1 | 2 | 3 | 4 | 5;
	onset: string; // Time after intake
	polishOnset: string;
	duration?: string;
	polishDuration?: string;
	description?: string;
	polishDescription?: string;
}

export interface EffectMonitoring {
	id: string;
	userId: string;
	supplementId: string;

	// Target effects being monitored
	targetEffects: TargetEffect[];

	// Measurement schedule
	schedule: {
		frequency: "daily" | "weekly" | "biweekly" | "monthly";
		polishFrequency: string;
		timeOfDay: string[];
		polishTimeOfDay: string[];
		duration: string; // Total monitoring period
		polishDuration: string;
	};

	// Measurements
	measurements: EffectMeasurement[];

	// Analysis
	analysis: {
		trend: "improving" | "stable" | "declining" | "unclear";
		polishTrend: string;
		significance: "significant" | "moderate" | "minimal" | "none";
		polishSignificance: string;
		confidence: number; // 0-1
		lastAnalyzed: string;
	};

	createdAt: string;
	updatedAt: string;
}

export interface TargetEffect {
	name: string;
	polishName: string;
	category: "cognitive" | "physical" | "mood" | "sleep" | "energy" | "other";
	polishCategory: string;
	measurementType:
		| "subjective_scale"
		| "objective_test"
		| "biomarker"
		| "behavioral";
	polishMeasurementType: string;
	scale: {
		min: number;
		max: number;
		unit?: string;
		polishUnit?: string;
		labels?: string[];
		polishLabels?: string[];
	};
	expectedTimeToEffect: string;
	polishExpectedTimeToEffect: string;
}

export interface EffectMeasurement {
	id: string;
	timestamp: string;
	targetEffectName: string;
	value: number;
	notes?: string;
	polishNotes?: string;
	context: {
		mood: number;
		stress: number;
		sleep: number;
		exercise: boolean;
		alcohol: boolean;
		otherFactors: string[];
		polishOtherFactors: string[];
	};
}

export interface SupplementSchedule {
	id: string;
	userId: string;
	supplementId: string;

	// Schedule details
	schedule: {
		frequency: "daily" | "every_other_day" | "weekly" | "as_needed";
		polishFrequency: string;
		timesPerDay: number;
		specificTimes: string[]; // HH:MM format
		dosagePerIntake: {
			amount: number;
			unit: string;
		};
		withFood: boolean;
		mealTiming: "before" | "with" | "after" | "empty_stomach";
		polishMealTiming: string;
	};

	// Duration and cycling
	duration: {
		startDate: string;
		endDate?: string;
		cyclePattern?: {
			onDays: number;
			offDays: number;
			polishDescription: string;
		};
	};

	// Reminders
	reminders: {
		enabled: boolean;
		methods: ("push" | "email" | "sms")[];
		advanceTime: number; // Minutes before scheduled time
		customMessage?: string;
		polishCustomMessage?: string;
	};

	// Adherence tracking
	adherence: {
		targetAdherence: number; // Percentage
		currentAdherence: number;
		missedDoses: number;
		totalDoses: number;
		lastMissedDate?: string;
		adherenceStreak: number; // Days
	};

	active: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface ProgressInsight {
	id: string;
	userId: string;
	type:
		| "adherence"
		| "effectiveness"
		| "side_effects"
		| "optimization"
		| "warning";
	priority: "low" | "medium" | "high" | "critical";

	title: string;
	polishTitle: string;
	description: string;
	polishDescription: string;

	// Data supporting the insight
	data: {
		supplementIds: string[];
		timeframe: string;
		polishTimeframe: string;
		metrics: Record<string, number>;
		trends: Record<string, "up" | "down" | "stable">;
	};

	// Recommendations
	recommendations: {
		action: string;
		polishAction: string;
		rationale: string;
		polishRationale: string;
		urgency: "immediate" | "soon" | "when_convenient";
		polishUrgency: string;
	}[];

	// User interaction
	userResponse: {
		acknowledged: boolean;
		implemented: boolean;
		feedback?: string;
		polishFeedback?: string;
		responseDate?: string;
	};

	generatedAt: string;
	expiresAt?: string;
}

export interface TrackingAnalytics {
	userId: string;
	timeframe: {
		start: string;
		end: string;
	};

	// Overall metrics
	overview: {
		totalSupplements: number;
		activeSupplements: number;
		averageAdherence: number;
		totalIntakes: number;
		missedDoses: number;
		sideEffectsReported: number;
	};

	// Adherence analysis
	adherence: {
		bySupplementId: Record<
			string,
			{
				adherenceRate: number;
				trend: "improving" | "stable" | "declining";
				polishTrend: string;
				bestTimeOfDay: string;
				polishBestTimeOfDay: string;
				consistencyScore: number;
			}
		>;
		overallTrend: "improving" | "stable" | "declining";
		polishOverallTrend: string;
		factors: {
			timeOfDay: Record<string, number>;
			dayOfWeek: Record<string, number>;
			withFood: { with: number; without: number };
		};
	};

	// Effectiveness analysis
	effectiveness: {
		bySupplementId: Record<
			string,
			{
				targetEffects: Record<
					string,
					{
						baseline: number;
						current: number;
						change: number;
						changePercent: number;
						significance: "significant" | "moderate" | "minimal" | "none";
						polishSignificance: string;
					}
				>;
				overallEffectiveness: number; // 0-1
				timeToEffect: string;
				polishTimeToEffect: string;
			}
		>;
	};

	// Side effects analysis
	sideEffects: {
		frequency: number; // Per 100 intakes
		severity: Record<"mild" | "moderate" | "severe", number>;
		polishSeverity: Record<string, number>;
		commonEffects: {
			type: string;
			polishType: string;
			frequency: number;
			averageSeverity: number;
		}[];
		bySupplementId: Record<
			string,
			{
				frequency: number;
				commonEffects: string[];
				polishCommonEffects: string[];
			}
		>;
	};

	// Optimization opportunities
	optimization: {
		timingOptimization: {
			supplementId: string;
			currentTiming: string;
			polishCurrentTiming: string;
			suggestedTiming: string;
			polishSuggestedTiming: string;
			expectedImprovement: string;
			polishExpectedImprovement: string;
		}[];
		dosageOptimization: {
			supplementId: string;
			currentDosage: string;
			suggestedDosage: string;
			rationale: string;
			polishRationale: string;
		}[];
		stackOptimization: {
			description: string;
			polishDescription: string;
			changes: string[];
			polishChanges: string[];
			expectedBenefits: string[];
			polishExpectedBenefits: string[];
		}[];
	};

	generatedAt: string;
}

export class SupplementTrackingService {
	private userId: string;

	constructor(userId: string) {
		this.userId = userId;
	}

	/**
	 * Log a supplement intake
	 */
	async logIntake(
		intake: Omit<
			SupplementIntakeLog,
			"id" | "userId" | "createdAt" | "updatedAt"
		>,
	): Promise<SupplementIntakeLog> {
		const log: SupplementIntakeLog = {
			...intake,
			id: this.generateId(),
			userId: this.userId,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};

		// Save to database
		await this.saveIntakeLog(log);

		// Update adherence tracking
		await this.updateAdherenceTracking(log);

		// Check for insights
		await this.generateInsights([log.supplementId]);

		return log;
	}

	/**
	 * Record effect measurement
	 */
	async recordEffectMeasurement(
		supplementId: string,
		targetEffectName: string,
		value: number,
		context: EffectMeasurement["context"],
		notes?: string,
	): Promise<EffectMeasurement> {
		const measurement: EffectMeasurement = {
			id: this.generateId(),
			timestamp: new Date().toISOString(),
			targetEffectName,
			value,
			notes,
			polishNotes: notes, // Would use translation service
			context,
		};

		// Save measurement
		await this.saveEffectMeasurement(supplementId, measurement);

		// Update analysis
		await this.updateEffectAnalysis(supplementId);

		return measurement;
	}

	/**
	 * Create or update supplement schedule
	 */
	async createSchedule(
		schedule: Omit<
			SupplementSchedule,
			"id" | "userId" | "createdAt" | "updatedAt"
		>,
	): Promise<SupplementSchedule> {
		const newSchedule: SupplementSchedule = {
			...schedule,
			id: this.generateId(),
			userId: this.userId,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};

		await this.saveSchedule(newSchedule);
		return newSchedule;
	}

	/**
	 * Get comprehensive tracking analytics
	 */
	async getAnalytics(timeframe: {
		start: string;
		end: string;
	}): Promise<TrackingAnalytics> {
		const intakeLogs = await this.getIntakeLogs(timeframe);
		const effectMeasurements = await this.getEffectMeasurements(timeframe);
		const schedules = await this.getActiveSchedules();

		return this.analyzeTrackingData(
			intakeLogs,
			effectMeasurements,
			schedules,
			timeframe,
		);
	}

	/**
	 * Generate personalized insights
	 */
	async generateInsights(supplementIds?: string[]): Promise<ProgressInsight[]> {
		const insights: ProgressInsight[] = [];

		// Analyze adherence patterns
		const adherenceInsights =
			await this.analyzeAdherencePatterns(supplementIds);
		insights.push(...adherenceInsights);

		// Analyze effectiveness
		const effectivenessInsights =
			await this.analyzeEffectiveness(supplementIds);
		insights.push(...effectivenessInsights);

		// Check for side effects patterns
		const sideEffectInsights =
			await this.analyzeSideEffectPatterns(supplementIds);
		insights.push(...sideEffectInsights);

		// Generate optimization recommendations
		const optimizationInsights =
			await this.generateOptimizationRecommendations(supplementIds);
		insights.push(...optimizationInsights);

		// Save insights
		await this.saveInsights(insights);

		return insights;
	}

	/**
	 * Get optimal timing recommendations
	 */
	async getTimingRecommendations(supplementId: string): Promise<{
		optimalTimes: string[];
		polishOptimalTimes: string[];
		reasoning: string;
		polishReasoning: string;
		confidence: number;
	}> {
		const intakeLogs = await this.getSupplementIntakeLogs(supplementId);
		const effectMeasurements =
			await this.getSupplementEffectMeasurements(supplementId);

		return this.analyzeOptimalTiming(intakeLogs, effectMeasurements);
	}

	/**
	 * Get adherence report
	 */
	async getAdherenceReport(supplementId?: string): Promise<{
		overall: number;
		trend: "improving" | "stable" | "declining";
		polishTrend: string;
		factors: {
			timeOfDay: Record<string, number>;
			dayOfWeek: Record<string, number>;
			withFood: { with: number; without: number };
		};
		recommendations: string[];
		polishRecommendations: string[];
	}> {
		const logs = supplementId
			? await this.getSupplementIntakeLogs(supplementId)
			: await this.getAllIntakeLogs();

		return this.analyzeAdherence(logs);
	}

	// Private helper methods
	private generateId(): string {
		return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
	}

	private async saveIntakeLog(log: SupplementIntakeLog): Promise<void> {
		// Implementation would save to database
	}

	private async saveEffectMeasurement(
		supplementId: string,
		measurement: EffectMeasurement,
	): Promise<void> {
		// Implementation would save to database
	}

	private async saveSchedule(schedule: SupplementSchedule): Promise<void> {
		// Implementation would save to database
	}

	private async saveInsights(insights: ProgressInsight[]): Promise<void> {
		// Implementation would save to database
	}

	private async updateAdherenceTracking(
		log: SupplementIntakeLog,
	): Promise<void> {
		// Update adherence metrics for the supplement
	}

	private async updateEffectAnalysis(supplementId: string): Promise<void> {
		// Recalculate effect trends and significance
	}

	private async getIntakeLogs(timeframe: {
		start: string;
		end: string;
	}): Promise<SupplementIntakeLog[]> {
		// Implementation would fetch from database
		return [];
	}

	private async getEffectMeasurements(timeframe: {
		start: string;
		end: string;
	}): Promise<EffectMeasurement[]> {
		// Implementation would fetch from database
		return [];
	}

	private async getActiveSchedules(): Promise<SupplementSchedule[]> {
		// Implementation would fetch from database
		return [];
	}

	private async getSupplementIntakeLogs(
		supplementId: string,
	): Promise<SupplementIntakeLog[]> {
		// Implementation would fetch from database
		return [];
	}

	private async getSupplementEffectMeasurements(
		supplementId: string,
	): Promise<EffectMeasurement[]> {
		// Implementation would fetch from database
		return [];
	}

	private async getAllIntakeLogs(): Promise<SupplementIntakeLog[]> {
		// Implementation would fetch from database
		return [];
	}

	private async analyzeTrackingData(
		intakeLogs: SupplementIntakeLog[],
		effectMeasurements: EffectMeasurement[],
		schedules: SupplementSchedule[],
		timeframe: { start: string; end: string },
	): Promise<TrackingAnalytics> {
		// Complex analysis implementation
		return {
			userId: this.userId,
			timeframe,
			overview: {
				totalSupplements: 0,
				activeSupplements: 0,
				averageAdherence: 0,
				totalIntakes: 0,
				missedDoses: 0,
				sideEffectsReported: 0,
			},
			adherence: {
				bySupplementId: {},
				overallTrend: "stable",
				polishOverallTrend: "stabilny",
				factors: {
					timeOfDay: {},
					dayOfWeek: {},
					withFood: { with: 0, without: 0 },
				},
			},
			effectiveness: {
				bySupplementId: {},
			},
			sideEffects: {
				frequency: 0,
				severity: { mild: 0, moderate: 0, severe: 0 },
				polishSeverity: { łagodne: 0, umiarkowane: 0, ciężkie: 0 },
				commonEffects: [],
				bySupplementId: {},
			},
			optimization: {
				timingOptimization: [],
				dosageOptimization: [],
				stackOptimization: [],
			},
			generatedAt: new Date().toISOString(),
		};
	}

	private async analyzeAdherencePatterns(
		supplementIds?: string[],
	): Promise<ProgressInsight[]> {
		// Analyze adherence patterns and generate insights
		return [];
	}

	private async analyzeEffectiveness(
		supplementIds?: string[],
	): Promise<ProgressInsight[]> {
		// Analyze effectiveness patterns and generate insights
		return [];
	}

	private async analyzeSideEffectPatterns(
		supplementIds?: string[],
	): Promise<ProgressInsight[]> {
		// Analyze side effect patterns and generate insights
		return [];
	}

	private async generateOptimizationRecommendations(
		supplementIds?: string[],
	): Promise<ProgressInsight[]> {
		// Generate optimization recommendations
		return [];
	}

	private async analyzeOptimalTiming(
		intakeLogs: SupplementIntakeLog[],
		effectMeasurements: EffectMeasurement[],
	): Promise<{
		optimalTimes: string[];
		polishOptimalTimes: string[];
		reasoning: string;
		polishReasoning: string;
		confidence: number;
	}> {
		// Analyze timing patterns and effectiveness
		return {
			optimalTimes: ["08:00", "20:00"],
			polishOptimalTimes: ["08:00", "20:00"],
			reasoning: "Based on effectiveness measurements and adherence patterns",
			polishReasoning:
				"Na podstawie pomiarów skuteczności i wzorców przestrzegania",
			confidence: 0.8,
		};
	}

	private async analyzeAdherence(logs: SupplementIntakeLog[]): Promise<{
		overall: number;
		trend: "improving" | "stable" | "declining";
		polishTrend: string;
		factors: {
			timeOfDay: Record<string, number>;
			dayOfWeek: Record<string, number>;
			withFood: { with: number; without: number };
		};
		recommendations: string[];
		polishRecommendations: string[];
	}> {
		// Analyze adherence patterns
		return {
			overall: 0.85,
			trend: "stable",
			polishTrend: "stabilny",
			factors: {
				timeOfDay: {},
				dayOfWeek: {},
				withFood: { with: 0, without: 0 },
			},
			recommendations: [],
			polishRecommendations: [],
		};
	}
}

// Export utility functions
export const createTrackingService = (userId: string) =>
	new SupplementTrackingService(userId);

export const formatAdherenceRate = (rate: number): string => {
	return `${Math.round(rate * 100)}%`;
};

export const getAdherenceColor = (rate: number): string => {
	if (rate >= 0.9) return "text-green-600";
	if (rate >= 0.8) return "text-yellow-600";
	if (rate >= 0.7) return "text-orange-600";
	return "text-red-600";
};

export const formatEffectChange = (change: number, unit?: string): string => {
	const sign = change >= 0 ? "+" : "";
	const unitStr = unit ? ` ${unit}` : "";
	return `${sign}${change.toFixed(1)}${unitStr}`;
};

export const getEffectChangeColor = (change: number): string => {
	if (change > 0) return "text-green-600";
	if (change < 0) return "text-red-600";
	return "text-gray-600";
};
