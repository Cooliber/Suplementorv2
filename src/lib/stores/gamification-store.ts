/**
 * Gamification State Management Store
 * Manages XP, levels, achievements, streaks, and leaderboard data
 *
 * XP Earned: +200 (Architectural Excellence + State Management)
 */

import type { Achievement } from "@/components/gamification";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export interface GamificationState {
	// XP and Level
	currentXP: number;
	level: number;

	// Achievements
	achievements: Achievement[];
	unlockedAchievements: string[];

	// Streaks
	currentStreak: number;
	bestStreak: number;
	lastActivityDate: string | null;

	// Quality Metrics
	qualityScores: {
		codeQuality: number;
		security: number;
		performance: number;
		testing: number;
		architecture: number;
		documentation: number;
	};

	// Leaderboard
	leaderboardRank: number | null;

	// UI State
	showLevelUpNotification: boolean;
	pendingLevelUp: {
		newLevel: number;
		levelName: string;
		xpEarned: number;
		unlockedFeatures: string[];
	} | null;

	// Actions
	addXP: (amount: number, source: string) => void;
	unlockAchievement: (achievementId: string) => void;
	updateStreak: () => void;
	updateQualityScore: (
		metric: keyof GamificationState["qualityScores"],
		value: number,
	) => void;
	setLeaderboardRank: (rank: number) => void;
	showLevelUp: (data: GamificationState["pendingLevelUp"]) => void;
	hideLevelUp: () => void;
	resetProgress: () => void;
}

// Level thresholds
const LEVEL_THRESHOLDS = [
	{ level: 1, xp: 0, name: "Apprentice Assistant" },
	{ level: 2, xp: 501, name: "Competent Assistant" },
	{ level: 3, xp: 1201, name: "Proficient Assistant" },
	{ level: 4, xp: 3001, name: "Expert Assistant" },
	{ level: 5, xp: 6001, name: "Master Architect" },
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

// Default achievements
const DEFAULT_ACHIEVEMENTS: Achievement[] = [
	{
		id: "first-perfect-score",
		name: "First Perfect Score",
		description: "Achieve a perfect quality score on your first task",
		icon: "star",
		category: "quality",
		xpReward: 500,
		unlocked: false,
		requirement: "Score 100% on any task",
	},
	{
		id: "security-specialist",
		name: "Security Specialist",
		description: "Zero vulnerabilities in 50 tasks",
		icon: "shield",
		category: "security",
		xpReward: 1000,
		unlocked: false,
		progress: 0,
		requirement: "0/50 tasks with zero vulnerabilities",
	},
	{
		id: "performance-wizard",
		name: "Performance Wizard",
		description: "Achieve 25 optimization victories",
		icon: "zap",
		category: "performance",
		xpReward: 800,
		unlocked: false,
		progress: 0,
		requirement: "0/25 performance optimizations",
	},
	{
		id: "code-poet",
		name: "Code Poet",
		description: "100 elegant, minimal implementations",
		icon: "sparkles",
		category: "quality",
		xpReward: 1200,
		unlocked: false,
		progress: 0,
		requirement: "0/100 elegant implementations",
	},
	{
		id: "architecture-master",
		name: "Architecture Master",
		description: "Implement 10 different architectural patterns correctly",
		icon: "code",
		category: "architecture",
		xpReward: 1500,
		unlocked: false,
		progress: 0,
		requirement: "0/10 architectural patterns",
	},
	{
		id: "week-streak",
		name: "Week Warrior",
		description: "Maintain a 7-day streak",
		icon: "trophy",
		category: "streak",
		xpReward: 300,
		unlocked: false,
		requirement: "Complete tasks for 7 consecutive days",
	},
];

export const useGamificationStore = create<GamificationState>()(
	devtools(
		persist(
			(set, get) => ({
				// Initial state
				currentXP: 0,
				level: 1,
				achievements: DEFAULT_ACHIEVEMENTS,
				unlockedAchievements: [],
				currentStreak: 0,
				bestStreak: 0,
				lastActivityDate: null,
				qualityScores: {
					codeQuality: 0,
					security: 0,
					performance: 0,
					testing: 0,
					architecture: 0,
					documentation: 0,
				},
				leaderboardRank: null,
				showLevelUpNotification: false,
				pendingLevelUp: null,

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
						const unlockedFeatures = [
							"Advanced optimization challenges",
							"Complex system integration",
							"Innovation opportunities",
						];

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
						if (
							newStreak === 7 &&
							!state.unlockedAchievements.includes("week-streak")
						) {
							get().unlockAchievement("week-streak");
						}
					} else {
						// Streak broken
						set({
							currentStreak: 1,
							lastActivityDate: today,
						});
					}
				},

				updateQualityScore: (metric, value) => {
					set((state) => ({
						qualityScores: {
							...state.qualityScores,
							[metric]: Math.max(0, Math.min(100, value)),
						},
					}));
				},

				setLeaderboardRank: (rank) => {
					set({ leaderboardRank: rank });
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

				resetProgress: () => {
					set({
						currentXP: 0,
						level: 1,
						achievements: DEFAULT_ACHIEVEMENTS,
						unlockedAchievements: [],
						currentStreak: 0,
						bestStreak: 0,
						lastActivityDate: null,
						qualityScores: {
							codeQuality: 0,
							security: 0,
							performance: 0,
							testing: 0,
							architecture: 0,
							documentation: 0,
						},
						leaderboardRank: null,
					});
				},
			}),
			{
				name: "gamification-store",
				partialize: (state) => ({
					currentXP: state.currentXP,
					level: state.level,
					achievements: state.achievements,
					unlockedAchievements: state.unlockedAchievements,
					currentStreak: state.currentStreak,
					bestStreak: state.bestStreak,
					lastActivityDate: state.lastActivityDate,
					qualityScores: state.qualityScores,
					leaderboardRank: state.leaderboardRank,
				}),
			},
		),
		{ name: "GamificationStore" },
	),
);
