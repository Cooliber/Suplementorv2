/**
 * Supplement-Specific Gamification Store
 * Manages XP, levels, achievements, streaks, and engagement for supplement learning and adherence
 *
 * XP Earned: +300 (Supplement Learning + Evidence-Based Gamification)
 */

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { SupplementCategory, EvidenceLevel } from "@/types/supplement";

export interface SupplementAchievement {
	id: string;
	name: string;
	description: string;
	icon: string;
	category: "learning" | "adherence" | "exploration" | "social" | "mastery";
	xpReward: number;
	unlocked: boolean;
	unlockedAt?: Date;
	progress: number;
	requirement: string;
	evidenceBased?: boolean;
	difficulty: "beginner" | "intermediate" | "advanced" | "expert";
}

export interface SupplementQuest {
	id: string;
	title: string;
	description: string;
	type: "daily" | "weekly" | "milestone";
	category: "learning" | "adherence" | "exploration" | "social";
	xpReward: number;
	completed: boolean;
	completedAt?: Date;
	progress: number;
	requirements: QuestRequirement[];
	timeLimit?: number; // in hours
	evidenceBased?: boolean;
}

export interface QuestRequirement {
	type: "learn_supplements" | "complete_streak" | "explore_category" | "share_recommendation" | "build_stack";
	target: number;
	current: number;
	description: string;
}

export interface SupplementGamificationState {
	// XP and Level
	currentXP: number;
	level: number;
	totalSupplementsLearned: number;

	// Achievements
	achievements: SupplementAchievement[];
	unlockedAchievements: string[];

	// Streaks and Adherence
	currentStreak: number;
	bestStreak: number;
	lastActivityDate: string | null;
	adherenceScore: number; // 0-100 based on consistency

	// Learning Progress
	supplementsLearned: string[];
	categoriesExplored: SupplementCategory[];
	knowledgeScore: number; // 0-100 based on quiz performance

	// Social and Sharing
	recommendationsShared: number;
	helpfulVotes: number;
	socialScore: number;

	// Quests
	activeQuests: SupplementQuest[];
	completedQuests: string[];
	questPoints: number;

	// Progress Tracking
	weeklyProgress: {
		date: string;
		supplementsStudied: number;
		quizzesCompleted: number;
		stacksBuilt: number;
		xpEarned: number;
	}[];
	monthlyStats: {
		totalXP: number;
		achievementsUnlocked: number;
		averageAdherence: number;
		supplementsMastered: number;
	};

	// UI State
	showLevelUpNotification: boolean;
	showAchievementNotification: boolean;
	pendingLevelUp: {
		newLevel: number;
		levelName: string;
		xpEarned: number;
		unlockedFeatures: string[];
	} | null;
	pendingAchievement: SupplementAchievement | null;

	// Actions
	addXP: (amount: number, source: string) => void;
	unlockAchievement: (achievementId: string) => void;
	updateStreak: () => void;
	recordSupplementLearning: (supplementId: string) => void;
	recordCategoryExploration: (category: SupplementCategory) => void;
	updateKnowledgeScore: (score: number) => void;
	updateAdherenceScore: (score: number) => void;
	shareRecommendation: () => void;
	addHelpfulVote: () => void;
	completeQuest: (questId: string) => void;
	startQuest: (quest: SupplementQuest) => void;
	updateQuestProgress: (questId: string, progress: number) => void;
	showLevelUp: (data: SupplementGamificationState["pendingLevelUp"]) => void;
	hideLevelUp: () => void;
	showAchievement: (achievement: SupplementAchievement) => void;
	hideAchievement: () => void;
	resetProgress: () => void;
}

// Level thresholds for supplement mastery
const LEVEL_THRESHOLDS = [
	{ level: 1, xp: 0, name: "Supplement Curious", unlockedFeatures: ["Basic supplement browser"] },
	{ level: 2, xp: 500, name: "Knowledge Seeker", unlockedFeatures: ["Advanced search filters", "Basic quiz challenges"] },
	{ level: 3, xp: 1200, name: "Supplement Student", unlockedFeatures: ["Stack builder", "Progress tracking"] },
	{ level: 4, xp: 2500, name: "Wellness Scholar", unlockedFeatures: ["Social features", "Advanced analytics"] },
	{ level: 5, xp: 4500, name: "Supplement Expert", unlockedFeatures: ["Expert challenges", "Mentorship opportunities"] },
	{ level: 6, xp: 7500, name: "Master Educator", unlockedFeatures: ["Create custom content", "Advanced social features"] },
	{ level: 7, xp: 12000, name: "Wellness Legend", unlockedFeatures: ["All premium features", "Recognition badges"] },
];

const calculateLevel = (xp: number): number => {
	for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
		const threshold = LEVEL_THRESHOLDS[i];
		if (threshold && xp >= threshold.xp) {
			return threshold.level;
		}
	}
	return 1;
};

const getLevelName = (level: number): string => {
	const threshold = LEVEL_THRESHOLDS.find((t) => t.level === level);
	return threshold?.name || "Unknown";
};

const getUnlockedFeatures = (level: number): string[] => {
	const threshold = LEVEL_THRESHOLDS.find((t) => t.level === level);
	return threshold?.unlockedFeatures || [];
};

// Evidence-based achievements for supplement learning
const DEFAULT_SUPPLEMENT_ACHIEVEMENTS: SupplementAchievement[] = [
	{
		id: "first-supplement",
		name: "First Discovery",
		description: "Learn about your first supplement",
		icon: "flask",
		category: "learning",
		xpReward: 50,
		unlocked: false,
		progress: 0,
		requirement: "Study 1 supplement",
		evidenceBased: true,
		difficulty: "beginner",
	},
	{
		id: "category-explorer",
		name: "Category Explorer",
		description: "Explore all supplement categories",
		icon: "grid",
		category: "exploration",
		xpReward: 200,
		unlocked: false,
		progress: 0,
		requirement: "Explore 12 categories",
		evidenceBased: true,
		difficulty: "intermediate",
	},
	{
		id: "knowledge-seeker",
		name: "Knowledge Seeker",
		description: "Achieve 90%+ on 10 supplement quizzes",
		icon: "brain",
		category: "learning",
		xpReward: 300,
		unlocked: false,
		progress: 0,
		requirement: "Score 90%+ on 10 quizzes",
		evidenceBased: true,
		difficulty: "intermediate",
	},
	{
		id: "adherence-champion",
		name: "Adherence Champion",
		description: "Maintain 30-day learning streak",
		icon: "calendar",
		category: "adherence",
		xpReward: 400,
		unlocked: false,
		progress: 0,
		requirement: "30-day streak",
		evidenceBased: true,
		difficulty: "advanced",
	},
	{
		id: "stack-master",
		name: "Stack Master",
		description: "Create 5 evidence-based supplement stacks",
		icon: "layers",
		category: "learning",
		xpReward: 350,
		unlocked: false,
		progress: 0,
		requirement: "Create 5 stacks",
		evidenceBased: true,
		difficulty: "intermediate",
	},
	{
		id: "social-contributor",
		name: "Community Helper",
		description: "Share 10 helpful supplement recommendations",
		icon: "users",
		category: "social",
		xpReward: 250,
		unlocked: false,
		progress: 0,
		requirement: "Share 10 recommendations",
		evidenceBased: true,
		difficulty: "intermediate",
	},
	{
		id: "evidence-expert",
		name: "Evidence Expert",
		description: "Study supplements with strong evidence only",
		icon: "award",
		category: "learning",
		xpReward: 500,
		unlocked: false,
		progress: 0,
		requirement: "Study 20 strong evidence supplements",
		evidenceBased: true,
		difficulty: "expert",
	},
	{
		id: "safety-first",
		name: "Safety First",
		description: "Learn all about supplement interactions and contraindications",
		icon: "shield",
		category: "learning",
		xpReward: 300,
		unlocked: false,
		progress: 0,
		requirement: "Study 15 supplements with interactions",
		evidenceBased: true,
		difficulty: "advanced",
	},
];

// Daily and weekly quests for engagement
const generateDailyQuests = (): SupplementQuest[] => [
	{
		id: "daily-learning",
		title: "Daily Learning",
		description: "Learn about 3 new supplements today",
		type: "daily",
		category: "learning",
		xpReward: 75,
		completed: false,
		progress: 0,
		requirements: [{
			type: "learn_supplements",
			target: 3,
			current: 0,
			description: "Learn 3 supplements",
		}],
		timeLimit: 24,
		evidenceBased: true,
	},
	{
		id: "daily-quiz",
		title: "Knowledge Check",
		description: "Complete 2 supplement quizzes",
		type: "daily",
		category: "learning",
		xpReward: 50,
		completed: false,
		progress: 0,
		requirements: [{
			type: "learn_supplements",
			target: 2,
			current: 0,
			description: "Complete 2 quizzes",
		}],
		timeLimit: 24,
		evidenceBased: true,
	},
];

const generateWeeklyQuests = (): SupplementQuest[] => [
	{
		id: "weekly-exploration",
		title: "Category Explorer",
		description: "Explore 5 different supplement categories",
		type: "weekly",
		category: "exploration",
		xpReward: 200,
		completed: false,
		progress: 0,
		requirements: [{
			type: "explore_category",
			target: 5,
			current: 0,
			description: "Explore 5 categories",
		}],
		timeLimit: 168,
		evidenceBased: true,
	},
	{
		id: "weekly-stack",
		title: "Stack Builder",
		description: "Create 2 supplement stacks",
		type: "weekly",
		category: "learning",
		xpReward: 150,
		completed: false,
		progress: 0,
		requirements: [{
			type: "build_stack",
			target: 2,
			current: 0,
			description: "Build 2 stacks",
		}],
		timeLimit: 168,
		evidenceBased: true,
	},
];

export const useSupplementGamificationStore = create<SupplementGamificationState>()(
	devtools(
		persist(
			(set, get) => ({
				// Initial state
				currentXP: 0,
				level: 1,
				totalSupplementsLearned: 0,
				achievements: DEFAULT_SUPPLEMENT_ACHIEVEMENTS,
				unlockedAchievements: [],
				currentStreak: 0,
				bestStreak: 0,
				lastActivityDate: null,
				adherenceScore: 0,
				supplementsLearned: [],
				categoriesExplored: [],
				knowledgeScore: 0,
				recommendationsShared: 0,
				helpfulVotes: 0,
				socialScore: 0,
				activeQuests: [...generateDailyQuests(), ...generateWeeklyQuests()],
				completedQuests: [],
				questPoints: 0,
				weeklyProgress: [],
				monthlyStats: {
					totalXP: 0,
					achievementsUnlocked: 0,
					averageAdherence: 0,
					supplementsMastered: 0,
				},
				showLevelUpNotification: false,
				showAchievementNotification: false,
				pendingLevelUp: null,
				pendingAchievement: null,

				// Actions
				addXP: (amount, source) => {
					const state = get();
					const newXP = state.currentXP + amount;
					const oldLevel = state.level;
					const newLevel = calculateLevel(newXP);

					set({ currentXP: newXP, level: newLevel });

					// Check for level up
					if (newLevel > oldLevel) {
						const levelName = getLevelName(newLevel);
						const unlockedFeatures = getUnlockedFeatures(newLevel);

						set({
							showLevelUpNotification: true,
							pendingLevelUp: {
								newLevel,
								levelName,
								xpEarned: amount,
								unlockedFeatures,
							},
						});
					}

					// Update streak
					get().updateStreak();
				},

				unlockAchievement: (achievementId) => {
					const state = get();
					if (state.unlockedAchievements.includes(achievementId)) return;

					const achievement = state.achievements.find(
						(a) => a.id === achievementId,
					);
					if (!achievement) return;

					set({
						unlockedAchievements: [
							...state.unlockedAchievements,
							achievementId,
						],
						achievements: state.achievements.map((a) =>
							a.id === achievementId
								? { ...a, unlocked: true, unlockedAt: new Date() }
								: a,
						),
						currentXP: state.currentXP + achievement.xpReward,
					});

					// Show achievement notification
					get().showAchievement(achievement);
				},

				updateStreak: () => {
					const state = get();
					const today = new Date().toISOString().split("T")[0];
					const lastDate = state.lastActivityDate;

					if (!lastDate) {
						// First activity
						set({
							currentStreak: 1,
							bestStreak: 1,
							lastActivityDate: today,
						});
						return;
					}

					if (lastDate === today) {
						// Already counted today
						return;
					}

					const yesterday = new Date();
					yesterday.setDate(yesterday.getDate() - 1);
					const yesterdayStr = yesterday.toISOString().split("T")[0];

					if (lastDate === yesterdayStr) {
						// Continuing streak
						const newStreak = state.currentStreak + 1;
						set({
							currentStreak: newStreak,
							bestStreak: Math.max(state.bestStreak, newStreak),
							lastActivityDate: today,
						});

						// Check for streak achievements
						if (newStreak === 7 && !state.unlockedAchievements.includes("week-warrior")) {
							get().unlockAchievement("week-warrior");
						}
						if (newStreak === 30 && !state.unlockedAchievements.includes("adherence-champion")) {
							get().unlockAchievement("adherence-champion");
						}
					} else {
						// Streak broken
						set({
							currentStreak: 1,
							lastActivityDate: today,
						});
					}
				},

				recordSupplementLearning: (supplementId) => {
					const state = get();
					if (state.supplementsLearned.includes(supplementId)) return;

					const newSupplementsLearned = [...state.supplementsLearned, supplementId];
					const newTotal = state.totalSupplementsLearned + 1;

					set({
						supplementsLearned: newSupplementsLearned,
						totalSupplementsLearned: newTotal,
					});

					// Award XP for learning
					get().addXP(25, "supplement-learning");

					// Check achievements
					if (newTotal === 1 && !state.unlockedAchievements.includes("first-supplement")) {
						get().unlockAchievement("first-supplement");
					}
					if (newTotal >= 20 && !state.unlockedAchievements.includes("evidence-expert")) {
						get().unlockAchievement("evidence-expert");
					}
				},

				recordCategoryExploration: (category) => {
					const state = get();
					if (state.categoriesExplored.includes(category)) return;

					const newCategoriesExplored = [...state.categoriesExplored, category];
					set({ categoriesExplored: newCategoriesExplored });

					// Award XP for exploration
					get().addXP(15, "category-exploration");

					// Check achievements
					if (newCategoriesExplored.length >= 12 && !state.unlockedAchievements.includes("category-explorer")) {
						get().unlockAchievement("category-explorer");
					}
				},

				updateKnowledgeScore: (score) => {
					set({ knowledgeScore: Math.max(0, Math.min(100, score)) });

					// Award XP for good performance
					if (score >= 90) {
						get().addXP(10, "quiz-performance");
					}
				},

				updateAdherenceScore: (score) => {
					set({ adherenceScore: Math.max(0, Math.min(100, score)) });
				},

				shareRecommendation: () => {
					const state = get();
					const newCount = state.recommendationsShared + 1;
					set({ recommendationsShared: newCount });

					// Award XP for sharing
					get().addXP(20, "recommendation-shared");

					// Check achievements
					if (newCount >= 10 && !state.unlockedAchievements.includes("social-contributor")) {
						get().unlockAchievement("social-contributor");
					}
				},

				addHelpfulVote: () => {
					const state = get();
					const newVotes = state.helpfulVotes + 1;
					set({ helpfulVotes: newVotes });

					// Award XP for helpfulness
					get().addXP(5, "helpful-vote");
				},

				completeQuest: (questId) => {
					const state = get();
					const quest = state.activeQuests.find(q => q.id === questId);
					if (!quest || quest.completed) return;

					set({
						activeQuests: state.activeQuests.map(q =>
							q.id === questId
								? { ...q, completed: true, completedAt: new Date() }
								: q
						),
						completedQuests: [...state.completedQuests, questId],
						questPoints: state.questPoints + quest.xpReward,
						currentXP: state.currentXP + quest.xpReward,
					});
				},

				startQuest: (quest) => {
					const state = get();
					const exists = state.activeQuests.find(q => q.id === quest.id);
					if (exists) return;

					set({
						activeQuests: [...state.activeQuests, quest],
					});
				},

				updateQuestProgress: (questId, progress) => {
					set({
						activeQuests: get().activeQuests.map(q =>
							q.id === questId
								? { ...q, progress: Math.max(0, Math.min(100, progress)) }
								: q
						),
					});
				},

				showLevelUp: (data) => {
					set({
						showLevelUpNotification: true,
						pendingLevelUp: data,
					});
				},

				hideLevelUp: () => {
					set({
						showLevelUpNotification: false,
						pendingLevelUp: null,
					});
				},

				showAchievement: (achievement) => {
					set({
						showAchievementNotification: true,
						pendingAchievement: achievement,
					});
				},

				hideAchievement: () => {
					set({
						showAchievementNotification: false,
						pendingAchievement: null,
					});
				},

				resetProgress: () => {
					set({
						currentXP: 0,
						level: 1,
						totalSupplementsLearned: 0,
						achievements: DEFAULT_SUPPLEMENT_ACHIEVEMENTS,
						unlockedAchievements: [],
						currentStreak: 0,
						bestStreak: 0,
						lastActivityDate: null,
						adherenceScore: 0,
						supplementsLearned: [],
						categoriesExplored: [],
						knowledgeScore: 0,
						recommendationsShared: 0,
						helpfulVotes: 0,
						socialScore: 0,
						activeQuests: [...generateDailyQuests(), ...generateWeeklyQuests()],
						completedQuests: [],
						questPoints: 0,
						weeklyProgress: [],
						monthlyStats: {
							totalXP: 0,
							achievementsUnlocked: 0,
							averageAdherence: 0,
							supplementsMastered: 0,
						},
						showLevelUpNotification: false,
						showAchievementNotification: false,
						pendingLevelUp: null,
						pendingAchievement: null,
					});
				},
			}),
			{
				name: "supplement-gamification-store",
				partialize: (state) => ({
					currentXP: state.currentXP,
					level: state.level,
					totalSupplementsLearned: state.totalSupplementsLearned,
					achievements: state.achievements,
					unlockedAchievements: state.unlockedAchievements,
					currentStreak: state.currentStreak,
					bestStreak: state.bestStreak,
					lastActivityDate: state.lastActivityDate,
					adherenceScore: state.adherenceScore,
					supplementsLearned: state.supplementsLearned,
					categoriesExplored: state.categoriesExplored,
					knowledgeScore: state.knowledgeScore,
					recommendationsShared: state.recommendationsShared,
					helpfulVotes: state.helpfulVotes,
					socialScore: state.socialScore,
					completedQuests: state.completedQuests,
					questPoints: state.questPoints,
					weeklyProgress: state.weeklyProgress,
					monthlyStats: state.monthlyStats,
				}),
			},
		),
		{ name: "SupplementGamificationStore" },
	),
);