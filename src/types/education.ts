/**
 * =================================================================
 * ENHANCED EDUCATION SYSTEM TYPES
 *
 * Comprehensive type definitions for the educational platform,
 * including learning modules, pathways, assessments, and progress tracking.
 * =================================================================
 */

export type DifficultyLevel =
	| "beginner"
	| "intermediate"
	| "advanced"
	| "expert";
export type ContentType =
	| "text"
	| "video"
	| "interactive"
	| "quiz"
	| "assessment"
	| "simulation";
export type LearningObjective =
	| "knowledge"
	| "comprehension"
	| "application"
	| "analysis"
	| "synthesis"
	| "evaluation";

// ----------------------------------------------------------------
// 1. CORE LEARNING MODULE TYPES
// ----------------------------------------------------------------

export interface LearningModule {
	id: string;
	title: string;
	polishTitle?: string;
	description: string;
	polishDescription?: string;
	difficulty: DifficultyLevel;
	estimatedDuration: number; // in minutes
	category: SupplementCategory;
	prerequisites?: string[]; // module IDs
	objectives: LearningObjective[];
	content: ModuleContent[];
	assessment?: ModuleAssessment;
	resources?: LearningResource[];
	metadata: ModuleMetadata;
}

export interface ModuleContent {
	id: string;
	type: ContentType;
	title: string;
	content: string | InteractiveContent | QuizContent;
	order: number;
	estimatedTime: number; // in minutes
	required: boolean;
}

export interface InteractiveContent {
	type: "simulation" | "interactive_diagram" | "virtual_lab" | "case_study";
	data: Record<string, any>;
	instructions: string;
	polishInstructions?: string;
}

export interface QuizContent {
	questions: QuizQuestion[];
	passingScore: number; // percentage
	timeLimit?: number; // in minutes
	randomizeOrder?: boolean;
	showResults?: boolean;
}

export interface ModuleAssessment {
	type: "quiz" | "practical" | "project" | "peer_review";
	questions: AssessmentQuestion[];
	passingScore: number;
	timeLimit?: number;
	instructions: string;
	polishInstructions?: string;
}

export interface ModuleMetadata {
	version: string;
	lastUpdated: string;
	author: string;
	reviewers?: string[];
	tags: string[];
	evidenceLevel: "high" | "moderate" | "low";
	citations?: string[];
	confidence: number; // 0-10 scale
}

// ----------------------------------------------------------------
// 2. QUIZ AND ASSESSMENT TYPES
// ----------------------------------------------------------------

export interface QuizQuestion {
	id: string;
	type:
		| "multiple_choice"
		| "true_false"
		| "fill_blank"
		| "matching"
		| "ordering"
		| "short_answer";
	question: string;
	polishQuestion?: string;
	options?: string[];
	polishOptions?: string[];
	correctAnswer: string | string[] | number[];
	explanation: string;
	polishExplanation?: string;
	difficulty: DifficultyLevel;
	points: number;
	tags?: string[];
	hints?: string[];
	polishHints?: string[];
}

export interface AssessmentQuestion {
	id: string;
	type:
		| "multiple_choice"
		| "true_false"
		| "fill_blank"
		| "matching"
		| "ordering"
		| "short_answer"
		| "essay"
		| "calculation";
	question: string;
	polishQuestion?: string;
	options?: string[];
	polishOptions?: string[];
	correctAnswer: string | string[] | number[];
	explanation: string;
	polishExplanation?: string;
	difficulty: DifficultyLevel;
	points: number;
	tags?: string[];
	rubric?: GradingRubric;
}

export interface GradingRubric {
	criteria: {
		name: string;
		description: string;
		points: number;
	}[];
	totalPoints: number;
}

export interface QuizAttempt {
	id: string;
	userId: string;
	moduleId: string;
	questionId: string;
	answer: string | string[] | number[];
	isCorrect: boolean;
	timeSpent: number; // in seconds
	hintsUsed: number;
	timestamp: string;
}

export interface QuizResult {
	id: string;
	userId: string;
	moduleId: string;
	score: number; // percentage
	totalPoints: number;
	earnedPoints: number;
	passed: boolean;
	attempts: QuizAttempt[];
	startTime: string;
	endTime: string;
	timeSpent: number; // in minutes
	feedback?: string;
	recommendations?: string[];
}

// ----------------------------------------------------------------
// 3. LEARNING PATHWAYS
// ----------------------------------------------------------------

export interface LearningPathway {
	id: string;
	title: string;
	polishTitle?: string;
	description: string;
	polishDescription?: string;
	category: SupplementCategory;
	difficulty: DifficultyLevel;
	estimatedDuration: number; // in hours
	modules: string[]; // module IDs in order
	prerequisites?: string[];
	outcomes: string[];
	polishOutcomes?: string[];
	metadata: PathwayMetadata;
}

export interface PathwayMetadata {
	version: string;
	lastUpdated: string;
	author: string;
	reviewers?: string[];
	tags: string[];
	difficulty: DifficultyLevel;
	evidenceLevel: "high" | "moderate" | "low";
	citations?: string[];
}

export interface UserPathwayProgress {
	userId: string;
	pathwayId: string;
	currentModule?: string;
	completedModules: string[];
	startDate: string;
	lastActivity: string;
	completionDate?: string;
	certificateEarned?: boolean;
	overallProgress: number; // percentage
	moduleProgress: Record<string, number>;
	quizScores: Record<string, number>;
	achievements: string[];
	notes?: string;
}

// ----------------------------------------------------------------
// 4. RESEARCH STUDY CARDS
// ----------------------------------------------------------------

export interface ResearchStudyCard {
	id: string;
	title: string;
	polishTitle?: string;
	authors: string[];
	journal: string;
	year: number;
	doi?: string;
	pmid?: string;
	abstract: string;
	polishAbstract?: string;
	methodology: StudyMethodology;
	results: StudyResults;
	conclusions: string;
	polishConclusions?: string;
	limitations: string[];
	strengths: string[];
	applicability: StudyApplicability;
	quality: StudyQuality;
	relevance: StudyRelevance;
	tags: string[];
}

export interface StudyMethodology {
	type:
		| "RCT"
		| "observational"
		| "meta_analysis"
		| "systematic_review"
		| "case_study"
		| "animal_study"
		| "in_vitro";
	sampleSize: number;
	duration: string;
	interventions: string[];
	controls: string[];
	blinding?: "double" | "single" | "none";
	randomization?: boolean;
}

export interface StudyResults {
	primaryOutcome: string;
	secondaryOutcomes?: string[];
	effectSize?: number;
	statisticalSignificance: string;
	clinicalSignificance: string;
}

export interface StudyApplicability {
	population: string;
	setting: string;
	generalizability: "high" | "moderate" | "low";
	practicalImplications: string[];
}

export interface StudyQuality {
	score: number; // 0-10 scale
	rating: "excellent" | "good" | "fair" | "poor";
	biasRisk: "low" | "moderate" | "high" | "unclear";
	confidence: "high" | "moderate" | "low";
}

export interface StudyRelevance {
	supplementCategory: SupplementCategory;
	mechanism: string[];
	clinicalApplication: string[];
	evidenceLevel: "strong" | "moderate" | "weak" | "insufficient";
}

// ----------------------------------------------------------------
// 5. SUPPLEMENT CATEGORIES
// ----------------------------------------------------------------

export type SupplementCategory =
	| "vitamins_minerals"
	| "herbal_medicine"
	| "amino_acids"
	| "cognitive_enhancers"
	| "sports_nutrition"
	| "hormone_support"
	| "gut_health"
	| "immune_support"
	| "antioxidants"
	| "joint_health"
	| "sleep_support"
	| "stress_management";

// ----------------------------------------------------------------
// 6. PROGRESS TRACKING
// ----------------------------------------------------------------

export interface UserProgress {
	userId: string;
	totalModulesCompleted: number;
	totalQuizzesPassed: number;
	currentStreak: number;
	longestStreak: number;
	totalStudyTime: number; // in minutes
	achievements: Achievement[];
	learningPaths: UserPathwayProgress[];
	quizHistory: QuizResult[];
	certificates: Certificate[];
	preferences: LearningPreferences;
	statistics: LearningStatistics;
}

export interface Achievement {
	id: string;
	name: string;
	polishName?: string;
	description: string;
	polishDescription?: string;
	icon: string;
	category: "completion" | "streak" | "mastery" | "exploration" | "social";
	rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
	unlockedAt: string;
	progress?: number; // for partial achievements
}

export interface Certificate {
	id: string;
	userId: string;
	pathwayId: string;
	earnedAt: string;
	certificateNumber: string;
	verificationCode: string;
	metadata: {
		finalScore: number;
		completionTime: number; // in days
		instructor?: string;
	};
}

export interface LearningPreferences {
	difficulty: DifficultyLevel;
	contentTypes: ContentType[];
	notifications: boolean;
	reminders: boolean;
	studyReminders: boolean;
	achievementNotifications: boolean;
	language: "pl" | "en";
	theme: "light" | "dark" | "auto";
}

export interface LearningStatistics {
	modulesCompleted: number;
	averageQuizScore: number;
	totalStudyTime: number;
	studyStreak: number;
	weakAreas: string[];
	strongAreas: string[];
	recommendations: string[];
}

// ----------------------------------------------------------------
// 7. EDUCATIONAL RESOURCES
// ----------------------------------------------------------------

export interface LearningResource {
	id: string;
	title: string;
	polishTitle?: string;
	type:
		| "article"
		| "video"
		| "podcast"
		| "book"
		| "course"
		| "tool"
		| "website";
	url?: string;
	description: string;
	polishDescription?: string;
	category: SupplementCategory;
	tags: string[];
	difficulty: DifficultyLevel;
	estimatedTime?: number; // in minutes
	quality: "high" | "moderate" | "low";
	evidenceLevel?: "strong" | "moderate" | "weak";
	author?: string;
	publicationDate?: string;
	lastVerified?: string;
}

// ----------------------------------------------------------------
// 8. MECHANISM EXPLANATIONS
// ----------------------------------------------------------------

export interface MechanismExplanation {
	id: string;
	supplementId: string;
	mechanismId: string;
	title: string;
	polishTitle?: string;
	summary: string;
	polishSummary?: string;
	detailedExplanation: string;
	polishDetailedExplanation?: string;
	visualization?: MechanismVisualization;
	evidence: EvidenceSupport;
	practicalImplications: string[];
	polishPracticalImplications?: string[];
	relatedMechanisms: string[];
	interactions: MechanismInteraction[];
}

export interface MechanismVisualization {
	type: "diagram" | "animation" | "interactive" | "3d_model";
	data: Record<string, any>;
	description: string;
	polishDescription?: string;
	accessibility: {
		altText: string;
		polishAltText?: string;
		screenReaderSupport: boolean;
	};
}

export interface EvidenceSupport {
	level: "strong" | "moderate" | "weak" | "insufficient";
	studies: string[]; // study IDs or citations
	confidence: number; // 0-10 scale
	lastReviewed: string;
	nextReview: string;
}

export interface MechanismInteraction {
	with: string; // supplement or compound name
	type: "synergistic" | "antagonistic" | "additive" | "competitive";
	strength: number; // 0-1 scale
	description: string;
	polishDescription?: string;
	evidence: string[];
}

// ----------------------------------------------------------------
// 9. ENHANCED CONTENT MANAGEMENT
// ----------------------------------------------------------------

export interface ContentLibrary {
	categories: SupplementCategory[];
	modules: LearningModule[];
	pathways: LearningPathway[];
	studyCards: ResearchStudyCard[];
	resources: LearningResource[];
	mechanisms: MechanismExplanation[];
	statistics: {
		totalModules: number;
		totalPathways: number;
		totalStudyCards: number;
		totalResources: number;
		lastUpdated: string;
	};
	// Enhanced content management
	qualityMetrics: {
		averageModuleRating: number;
		totalCompletions: number;
		averageCompletionTime: number;
		userEngagement: number;
	};
	contentGaps: string[];
	recommendations: string[];
}

export interface ContentUpdate {
	id: string;
	type: "module" | "pathway" | "study_card" | "resource" | "mechanism";
	action: "create" | "update" | "delete" | "archive";
	entityId: string;
	changes: Record<string, any>;
	reason: string;
	approvedBy: string;
	timestamp: string;
	evidence?: string[];
	// Enhanced update tracking
	impact: "low" | "medium" | "high";
	affectedUsers: number;
	rollbackPlan?: string;
	testingRequired: boolean;
}

// ----------------------------------------------------------------
// 10. ADVANCED EDUCATIONAL FEATURES
// ----------------------------------------------------------------

export interface AdaptiveLearningProfile {
	userId: string;
	learningStyle: "visual" | "auditory" | "kinesthetic" | "reading" | "mixed";
	preferredDifficulty: DifficultyLevel;
	pacePreference: "slow" | "moderate" | "fast";
	weakAreas: string[];
	strongAreas: string[];
	learningGoals: string[];
	adaptiveSettings: {
		autoAdjustDifficulty: boolean;
		showHints: boolean;
		repeatWeakContent: boolean;
		suggestRelatedTopics: boolean;
	};
	progress: {
		modulesCompleted: number;
		averageScore: number;
		timeSpent: number;
		streak: number;
	};
}

export interface PersonalizedLearningPath {
	userId: string;
	originalPathwayId: string;
	adaptedModules: string[];
	skippedModules: string[];
	additionalModules: string[];
	customContent: ModuleContent[];
	reasoning: string[];
	confidence: number;
	lastUpdated: string;
	validUntil: string;
}

export interface LearningAnalytics {
	userId: string;
	period: {
		start: string;
		end: string;
	};
	engagement: {
		totalTime: number;
		averageSession: number;
		completionRate: number;
		quizAverage: number;
	};
	progress: {
		modulesCompleted: number;
		pathwaysCompleted: number;
		certificatesEarned: number;
		achievementsUnlocked: number;
	};
	behavior: {
		preferredTimes: string[];
		preferredContentTypes: ContentType[];
		difficultyProgression: DifficultyLevel[];
		dropOffPoints: string[];
	};
	recommendations: {
		suggestedModules: string[];
		reviewTopics: string[];
		nextChallenges: string[];
		skillGaps: string[];
	};
}

// ----------------------------------------------------------------
// 11. ADVANCED QUIZ AND ASSESSMENT TYPES
// ----------------------------------------------------------------

export interface AdaptiveQuiz {
	id: string;
	userId: string;
	moduleId: string;
	questions: AdaptiveQuestion[];
	difficulty: DifficultyLevel;
	timeLimit?: number;
	attempts: QuizAttempt[];
	currentAttempt?: number;
	maxAttempts: number;
	feedback: QuizFeedback;
	analytics: QuizAnalytics;
}

export interface AdaptiveQuestion {
	id: string;
	baseQuestion: QuizQuestion;
	difficulty: DifficultyLevel;
	estimatedTime: number;
	previousPerformance?: {
		attempts: number;
		successRate: number;
		averageTime: number;
	};
	adaptations: {
		simplified: boolean;
		hintsProvided: boolean;
		timeExtended: boolean;
		examplesAdded: boolean;
	};
}

export interface QuizFeedback {
	overall: {
		score: number;
		grade: "A" | "B" | "C" | "D" | "F";
		feedback: string;
		polishFeedback?: string;
	};
	byTopic: Record<
		string,
		{
			score: number;
			strengths: string[];
			weaknesses: string[];
			recommendations: string[];
		}
	>;
	improvement: {
		areas: string[];
		suggestions: string[];
		resources: string[];
	};
}

export interface QuizAnalytics {
	timing: {
		totalTime: number;
		averagePerQuestion: number;
		timeDistribution: Record<string, number>;
	};
	patterns: {
		correctAnswers: string[];
		incorrectAnswers: string[];
		skippedQuestions: string[];
		hintUsage: number;
	};
	difficulty: {
		appropriate: boolean;
		adjustments: string[];
		userFeedback: string;
	};
}

// ----------------------------------------------------------------
// 12. COLLABORATIVE LEARNING FEATURES
// ----------------------------------------------------------------

export interface StudyGroup {
	id: string;
	name: string;
	polishName?: string;
	description: string;
	polishDescription?: string;
	ownerId: string;
	members: StudyGroupMember[];
	maxMembers: number;
	subject: SupplementCategory;
	privacy: "public" | "private" | "invite_only";
	createdAt: string;
	settings: StudyGroupSettings;
	activity: StudyGroupActivity;
}

export interface StudyGroupMember {
	userId: string;
	role: "owner" | "moderator" | "member";
	joinedAt: string;
	contributions: {
		posts: number;
		helpfulVotes: number;
		resourcesShared: number;
	};
	activity: {
		lastSeen: string;
		streak: number;
		participation: number;
	};
}

export interface StudyGroupSettings {
	allowMemberInvites: boolean;
	requireApproval: boolean;
	autoRemoveInactive: boolean;
	inactiveDays: number;
	notificationSettings: {
		newMembers: boolean;
		posts: boolean;
		achievements: boolean;
	};
	language: "pl" | "en" | "both";
}

export interface StudyGroupActivity {
	totalPosts: number;
	totalDiscussions: number;
	averageEngagement: number;
	topics: string[];
	recentActivity: {
		type: "post" | "discussion" | "resource" | "achievement";
		userId: string;
		content: string;
		timestamp: string;
	}[];
	achievements: string[];
}

export interface DiscussionThread {
	id: string;
	groupId: string;
	title: string;
	polishTitle?: string;
	authorId: string;
	content: string;
	polishContent?: string;
	tags: string[];
	createdAt: string;
	updatedAt: string;
	replies: DiscussionReply[];
	likes: number;
	helpful: number;
	pinned: boolean;
	locked: boolean;
}

export interface DiscussionReply {
	id: string;
	threadId: string;
	authorId: string;
	content: string;
	polishContent?: string;
	createdAt: string;
	updatedAt: string;
	parentId?: string;
	likes: number;
	helpful: number;
}
