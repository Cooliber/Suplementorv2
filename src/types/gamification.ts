/**
 * =================================================================
 * COMPREHENSIVE GAMIFICATION SYSTEM TYPES
 *
 * Advanced type definitions for a complete gamification system
 * including achievements, levels, rewards, social features, and progression tracking.
 * =================================================================
 */

export type GamificationCategory =
	| "learning"
	| "social"
	| "exploration"
	| "mastery"
	| "consistency"
	| "quality"
	| "innovation";
export type RarityLevel =
	| "common"
	| "uncommon"
	| "rare"
	| "epic"
	| "legendary"
	| "mythic";
export type RewardType =
	| "xp"
	| "badge"
	| "title"
	| "cosmetic"
	| "feature"
	| "currency";
export type ActivityType =
	| "quiz_completion"
	| "module_completion"
	| "streak"
	| "social_interaction"
	| "content_creation"
	| "quality_contribution";

// ----------------------------------------------------------------
// 1. CORE GAMIFICATION ENTITIES
// ----------------------------------------------------------------

export interface Achievement {
	id: string;
	name: string;
	polishName?: string;
	description: string;
	polishDescription?: string;
	icon: string;
	category: GamificationCategory;
	rarity: RarityLevel;
	points: number;
	xpReward: number;
	requirements: AchievementRequirement[];
	rewards: AchievementReward[];
	unlockedAt?: string;
	progress?: number;
	isSecret?: boolean;
	tags: string[];
	metadata: AchievementMetadata;
}

export interface AchievementRequirement {
	type:
		| "count"
		| "streak"
		| "score"
		| "time"
		| "social"
		| "quality"
		| "combination";
	target: number;
	current?: number;
	unit?: string;
	description: string;
	polishDescription?: string;
	validation: (progress: any) => boolean;
}

export interface AchievementReward {
	type: RewardType;
	value: number | string;
	description: string;
	polishDescription?: string;
	unlockContent?: string;
	cosmeticData?: CosmeticReward;
}

export interface CosmeticReward {
	type: "avatar" | "frame" | "background" | "title" | "badge" | "theme";
	name: string;
	polishName?: string;
	data: Record<string, any>;
	preview: string;
	rarity: RarityLevel;
}

export interface AchievementMetadata {
	version: string;
	createdAt: string;
	updatedAt: string;
	author: string;
	difficulty: number; // 1-10 scale
	estimatedTime: number; // minutes to complete
	prerequisites?: string[];
	relatedAchievements?: string[];
	isActive: boolean;
}

// ----------------------------------------------------------------
// 2. USER PROGRESSION SYSTEM
// ----------------------------------------------------------------

export interface UserGamificationProfile {
	userId: string;
	level: UserLevel;
	xp: XPSystem;
	achievements: UserAchievement[];
	stats: GamificationStats;
	preferences: GamificationPreferences;
	social: SocialFeatures;
	inventory: RewardInventory;
	activity: ActivityTracking;
}

export interface UserLevel {
	current: number;
	progress: number; // 0-1 towards next level
	totalXP: number;
	levelName: string;
	polishLevelName?: string;
	perks: LevelPerk[];
	nextLevelRequirement: number;
	levelHistory: LevelProgression[];
}

export interface LevelPerk {
	id: string;
	name: string;
	polishName?: string;
	description: string;
	polishDescription?: string;
	unlockedAt: number; // level requirement
	type: "feature" | "cosmetic" | "multiplier" | "access";
	value: string | number;
	isActive: boolean;
}

export interface LevelProgression {
	fromLevel: number;
	toLevel: number;
	xpGained: number;
	timestamp: string;
	source: string;
	celebrationShown: boolean;
}

export interface XPSystem {
	current: number;
	totalEarned: number;
	spent: number;
	multipliers: XPMultiplier[];
	sources: XPSource[];
	daily: XPDaily;
	weekly: XPWeekly;
}

export interface XPMultiplier {
	type: "streak" | "quality" | "social" | "event" | "subscription";
	value: number;
	reason: string;
	expiresAt?: string;
	isActive: boolean;
}

export interface XPSource {
	activity: ActivityType;
	amount: number;
	timestamp: string;
	description: string;
	category: GamificationCategory;
}

export interface XPDaily {
	date: string;
	earned: number;
	goal: number;
	streak: number;
	bonus: XPBonus[];
}

export interface XPWeekly {
	week: string; // ISO week
	earned: number;
	goal: number;
	dailyBreakdown: XPDaily[];
	achievements: string[];
}

export interface XPBonus {
	type: "streak" | "quality" | "social" | "event";
	amount: number;
	reason: string;
	timestamp: string;
}

// ----------------------------------------------------------------
// 3. USER ACHIEVEMENTS AND COLLECTIONS
// ----------------------------------------------------------------

export interface UserAchievement {
	achievementId: string;
	unlockedAt: string;
	progress: number;
	isCompleted: boolean;
	timesCompleted?: number;
	rareVariant?: boolean;
	celebrationShown: boolean;
	shared: boolean;
	notes?: string;
}

export interface AchievementCollection {
	id: string;
	name: string;
	polishName?: string;
	description: string;
	polishDescription?: string;
	achievements: string[];
	category: GamificationCategory;
	completionReward?: AchievementReward;
	progress: number;
	isCompleted: boolean;
	unlockedAt?: string;
}

// ----------------------------------------------------------------
// 4. SOCIAL AND COMMUNITY FEATURES
// ----------------------------------------------------------------

export interface MentorshipData {
	mentorId?: string;
	mentees: string[];
	mentorRating: number;
	totalSessions: number;
	areas: string[];
	availability: "available" | "busy" | "unavailable";
	lastActive: string;
}

export interface CollaborationStats {
	totalCollaborations: number;
	activeProjects: number;
	completedProjects: number;
	averageRating: number;
	specializations: string[];
	availability: "high" | "medium" | "low";
}

export interface SocialFeatures {
	friends: Friend[];
	groups: SocialGroup[];
	leaderboards: LeaderboardParticipation[];
	activityFeed: ActivityFeedItem[];
	mentorship: MentorshipData;
	collaboration: CollaborationStats;
}

export interface Friend {
	userId: string;
	username: string;
	level: number;
	achievements: number;
	lastActive: string;
	status: "online" | "offline" | "away";
	relationship: "friend" | "mentor" | "mentee" | "study_buddy";
	since: string;
}

export interface SocialGroup {
	id: string;
	name: string;
	polishName?: string;
	description: string;
	polishDescription?: string;
	members: string[];
	ownerId: string;
	type: "study" | "challenge" | "social" | "project";
	privacy: "public" | "private" | "invite_only";
	createdAt: string;
	activity: GroupActivity;
}

export interface GroupActivity {
	totalPosts: number;
	totalEvents: number;
	averageEngagement: number;
	lastActivity: string;
	topics: string[];
	achievements: string[];
}

export interface LeaderboardParticipation {
	leaderboardId: string;
	currentRank: number;
	bestRank: number;
	score: number;
	lastUpdated: string;
	category: GamificationCategory;
	period: "daily" | "weekly" | "monthly" | "all_time";
}

export interface ActivityFeedItem {
	id: string;
	userId: string;
	type: ActivityType;
	title: string;
	polishTitle?: string;
	description: string;
	polishDescription?: string;
	timestamp: string;
	likes: number;
	comments: number;
	shares: number;
	metadata: Record<string, any>;
}

// ----------------------------------------------------------------
// 5. REWARD AND INVENTORY SYSTEM
// ----------------------------------------------------------------

export interface RewardInventory {
	currency: CurrencyBalance;
	cosmetics: CosmeticItem[];
	titles: Title[];
	boosters: Booster[];
	collectibles: Collectible[];
	redeemed: RedeemedReward[];
}

export interface CurrencyBalance {
	coins: number;
	gems: number;
	tokens: number;
	premium: number;
	transactions: CurrencyTransaction[];
}

export interface CurrencyTransaction {
	id: string;
	type: "earned" | "spent" | "gifted" | "refunded";
	amount: number;
	currency: keyof CurrencyBalance;
	reason: string;
	timestamp: string;
	source?: string;
}

export interface CosmeticItem {
	id: string;
	type: "avatar" | "frame" | "background" | "badge" | "theme";
	name: string;
	polishName?: string;
	description: string;
	polishDescription?: string;
	rarity: RarityLevel;
	acquiredAt: string;
	isEquipped: boolean;
	data: Record<string, any>;
	source: "achievement" | "purchase" | "event" | "daily_login";
}

export interface Title {
	id: string;
	name: string;
	polishName?: string;
	description: string;
	polishDescription?: string;
	rarity: RarityLevel;
	acquiredAt: string;
	isEquipped: boolean;
	requirements: string[];
	category: GamificationCategory;
}

export interface Booster {
	id: string;
	type: "xp" | "coin" | "drop_rate" | "time" | "quality";
	name: string;
	polishName?: string;
	description: string;
	polishDescription?: string;
	multiplier: number;
	duration: number; // minutes
	remaining?: number;
	activatedAt?: string;
	isActive: boolean;
	source: "purchase" | "achievement" | "daily_login" | "event";
}

export interface Collectible {
	id: string;
	name: string;
	polishName?: string;
	description: string;
	polishDescription?: string;
	category: "card" | "figure" | "artwork" | "music" | "other";
	rarity: RarityLevel;
	acquiredAt: string;
	isNew: boolean;
	metadata: Record<string, any>;
}

export interface RedeemedReward {
	id: string;
	rewardId: string;
	rewardType: RewardType;
	redeemedAt: string;
	value: number | string;
	status: "active" | "expired" | "consumed";
}

// ----------------------------------------------------------------
// 6. ACTIVITY TRACKING AND ANALYTICS
// ----------------------------------------------------------------

export interface WeeklyActivity {
	week: string; // ISO week
	totalXP: number;
	totalTime: number;
	averageDaily: number;
	achievements: number;
	streakDays: number;
	topCategory: GamificationCategory;
	consistency: number;
}

export interface MonthlyActivity {
	month: string; // YYYY-MM
	totalXP: number;
	totalTime: number;
	averageWeekly: number;
	achievements: number;
	newStreaks: number;
	levelProgress: number;
	insights: string[];
}

export interface ActivityTracking {
	daily: DailyActivity;
	weekly: WeeklyActivity;
	monthly: MonthlyActivity;
	streaks: ActivityStreak[];
	patterns: ActivityPattern[];
	goals: ActivityGoal[];
}

export interface DailyActivity {
	date: string;
	activities: ActivityEntry[];
	totalXP: number;
	totalTime: number;
	completion: number;
	mood?: number;
	notes?: string;
}

export interface ActivityEntry {
	type: ActivityType;
	timestamp: string;
	duration: number; // minutes
	xpEarned: number;
	metadata: Record<string, any>;
	description: string;
}

export interface ActivityStreak {
	type: ActivityType;
	current: number;
	best: number;
	lastActivity: string;
	reward?: AchievementReward;
	isActive: boolean;
}

export interface ActivityPattern {
	pattern: string;
	frequency: number;
	confidence: number;
	description: string;
	polishDescription?: string;
	recommendations: string[];
}

export interface ActivityGoal {
	id: string;
	type: ActivityType;
	target: number;
	current: number;
	period: "daily" | "weekly" | "monthly";
	startDate: string;
	endDate: string;
	reward?: AchievementReward;
	isCompleted: boolean;
	progress: number;
}

// ----------------------------------------------------------------
// 7. GAMIFICATION ANALYTICS
// ----------------------------------------------------------------

export interface GamificationStats {
	overall: {
		totalXP: number;
		totalAchievements: number;
		totalRewards: number;
		totalPlayTime: number;
		averageSession: number;
		completionRate: number;
	};
	byCategory: Record<GamificationCategory, CategoryStats>;
	trends: TrendData[];
	insights: GamificationInsight[];
	predictions: GamificationPrediction[];
}

export interface CategoryStats {
	achievements: number;
	xpEarned: number;
	timeSpent: number;
	successRate: number;
	averageScore: number;
	strengths: string[];
	weaknesses: string[];
}

export interface TrendData {
	period: string;
	xp: number;
	achievements: number;
	engagement: number;
	category: GamificationCategory;
}

export interface GamificationInsight {
	type: "pattern" | "recommendation" | "warning" | "celebration";
	title: string;
	polishTitle?: string;
	description: string;
	polishDescription?: string;
	confidence: number;
	actionable: boolean;
	priority: "low" | "medium" | "high";
	relatedData: Record<string, any>;
}

export interface GamificationPrediction {
	type: "level_up" | "achievement" | "streak" | "engagement";
	predictedDate: string;
	confidence: number;
	basedOn: string[];
	description: string;
	polishDescription?: string;
}

// ----------------------------------------------------------------
// 8. GAMIFICATION PREFERENCES
// ----------------------------------------------------------------

export interface GamificationPreferences {
	notifications: {
		achievements: boolean;
		levelUps: boolean;
		streaks: boolean;
		social: boolean;
		reminders: boolean;
	};
	privacy: {
		showOnLeaderboard: boolean;
		shareAchievements: boolean;
		showActivity: boolean;
		allowFriendRequests: boolean;
	};
	display: {
		showXP: boolean;
		showLevel: boolean;
		showProgress: boolean;
		compactMode: boolean;
		theme: "auto" | "light" | "dark";
	};
	goals: {
		dailyXP: number;
		weeklyAchievements: number;
		monthlyLevel: number;
	};
	accessibility: {
		reduceAnimations: boolean;
		highContrast: boolean;
		largeText: boolean;
		screenReader: boolean;
	};
}

// ----------------------------------------------------------------
// 9. ADVANCED GAMIFICATION FEATURES
// ----------------------------------------------------------------

export interface Challenge {
	id: string;
	name: string;
	polishName?: string;
	description: string;
	polishDescription?: string;
	type: "individual" | "group" | "community" | "seasonal";
	category: GamificationCategory;
	difficulty: "easy" | "medium" | "hard" | "expert";
	duration: number; // days
	rewards: AchievementReward[];
	requirements: ChallengeRequirement[];
	participants: ChallengeParticipant[];
	startDate: string;
	endDate: string;
	isActive: boolean;
	metadata: ChallengeMetadata;
}

export interface ChallengeRequirement {
	type:
		| "complete_modules"
		| "earn_xp"
		| "social_interaction"
		| "quality_score"
		| "streak";
	target: number;
	description: string;
	polishDescription?: string;
	validation: (progress: any) => boolean;
}

export interface ChallengeParticipant {
	userId: string;
	joinedAt: string;
	progress: number;
	currentRank?: number;
	rewards: string[];
	completedAt?: string;
}

export interface ChallengeMetadata {
	maxParticipants?: number;
	minLevel?: number;
	prerequisites?: string[];
	tags: string[];
	season?: string;
	featured: boolean;
}

// ----------------------------------------------------------------
// 10. SEASONAL AND EVENT SYSTEM
// ----------------------------------------------------------------

export interface Season {
	id: string;
	name: string;
	polishName?: string;
	theme: string;
	polishTheme?: string;
	startDate: string;
	endDate: string;
	rewards: SeasonalReward[];
	challenges: string[];
	leaderboard: SeasonalLeaderboard;
	metadata: SeasonMetadata;
}

export interface SeasonalReward {
	type: RewardType;
	name: string;
	polishName?: string;
	description: string;
	polishDescription?: string;
	rarity: RarityLevel;
	requirement: number; // rank or points needed
	icon: string;
}

export interface SeasonalLeaderboard {
	participants: LeaderboardEntry[];
	lastUpdated: string;
	totalParticipants: number;
	categories: GamificationCategory[];
}

export interface LeaderboardEntry {
	userId: string;
	username: string;
	score: number;
	rank: number;
	change: number; // position change from last update
	badge?: string;
	achievements: number;
}

export interface SeasonMetadata {
	version: string;
	featured: boolean;
	difficulty: "easy" | "medium" | "hard";
	estimatedDuration: number;
	prerequisites?: string[];
}

// ----------------------------------------------------------------
// 11. TYPE GUARDS AND UTILITIES
// ----------------------------------------------------------------

export interface GamificationValidation {
	isValid: boolean;
	errors: ValidationError[];
	warnings: ValidationWarning[];
}

export interface ValidationError {
	field: string;
	message: string;
	polishMessage?: string;
	code: string;
	severity: "error" | "warning";
}

export interface ValidationWarning {
	field: string;
	message: string;
	polishMessage?: string;
	suggestion?: string;
}

// Utility types for type-safe operations
export type AchievementId = Achievement["id"];
export type UserId = UserGamificationProfile["userId"];
export type CategoryKey = keyof GamificationStats["byCategory"];
export type RewardId = string;

// Type guards
export const isAchievement = (obj: any): obj is Achievement => {
	return (
		obj &&
		typeof obj === "object" &&
		"id" in obj &&
		"name" in obj &&
		"xpReward" in obj
	);
};

export const isUserLevel = (obj: any): obj is UserLevel => {
	return (
		obj &&
		typeof obj === "object" &&
		"current" in obj &&
		"progress" in obj &&
		"totalXP" in obj
	);
};

export const isValidRarity = (rarity: string): rarity is RarityLevel => {
	return ["common", "uncommon", "rare", "epic", "legendary", "mythic"].includes(
		rarity,
	);
};

export const isValidCategory = (
	category: string,
): category is GamificationCategory => {
	return [
		"learning",
		"social",
		"exploration",
		"mastery",
		"consistency",
		"quality",
		"innovation",
	].includes(category);
};
