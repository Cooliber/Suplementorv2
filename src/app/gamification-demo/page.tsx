/**
 * Gamification Demo Page
 * Showcases all gamification UI components with interactive examples
 *
 * XP Earned: +250 (Innovation + Documentation + UX Excellence)
 */

"use client";

import {
	AchievementBadge,
	LeaderboardCard,
	LevelUpNotification,
	QualityMetricsRadar,
	StreakCalendar,
	XPProgressBar,
} from "@/components/gamification";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { easingCurves } from "@/lib/animations/config";
import { useGamificationStore } from "@/lib/stores/gamification-store";
import { motion } from "framer-motion";
import { Target, TrendingUp, Trophy, Zap } from "lucide-react";
import * as React from "react";

export default function GamificationDemoPage() {
	const {
		currentXP,
		level,
		achievements,
		currentStreak,
		bestStreak,
		qualityScores,
		leaderboardRank,
		showLevelUpNotification,
		pendingLevelUp,
		addXP,
		unlockAchievement,
		updateQualityScore,
		hideLevelUp,
	} = useGamificationStore();

	// Mock streak data
	const streakData = React.useMemo(() => {
		const data = [];
		const today = new Date();
		for (let i = 0; i < 84; i++) {
			const date = new Date(today);
			date.setDate(today.getDate() - (83 - i));
			const dateStr = date.toISOString().split("T")[0];
			if (dateStr) {
				data.push({
					date: dateStr,
					active: Math.random() > 0.3,
					xpEarned:
						Math.random() > 0.3 ? Math.floor(Math.random() * 800) + 100 : 0,
				});
			}
		}
		return data;
	}, []);

	// Mock leaderboard data
	const leaderboardEntries = [
		{
			rank: 1,
			name: "CodeMaster Pro",
			score: 15420,
			change: 2,
			badge: "Master Architect",
		},
		{
			rank: 2,
			name: "DevNinja",
			score: 14890,
			change: -1,
			badge: "Expert Assistant",
		},
		{
			rank: 3,
			name: "ArchWizard",
			score: 13750,
			change: 1,
			badge: "Expert Assistant",
		},
		{
			rank: 4,
			name: "QualityGuru",
			score: 12340,
			change: 0,
			badge: "Proficient Assistant",
		},
		{
			rank: 5,
			name: "SecureCode",
			score: 11200,
			change: 3,
			badge: "Proficient Assistant",
		},
	];

	// Quality metrics
	const qualityMetrics = [
		{ label: "Code Quality", value: qualityScores.codeQuality, target: 90 },
		{ label: "Security", value: qualityScores.security, target: 95 },
		{ label: "Performance", value: qualityScores.performance, target: 85 },
		{ label: "Testing", value: qualityScores.testing, target: 85 },
		{ label: "Architecture", value: qualityScores.architecture, target: 90 },
		{ label: "Documentation", value: qualityScores.documentation, target: 80 },
	];

	// Demo actions
	const handleAddXP = (amount: number) => {
		addXP(amount, "demo");
	};

	const handleUnlockAchievement = (id: string) => {
		unlockAchievement(id);
	};

	const handleImproveQuality = () => {
		updateQualityScore(
			"codeQuality",
			Math.min(100, qualityScores.codeQuality + 10),
		);
		updateQualityScore("security", Math.min(100, qualityScores.security + 8));
		updateQualityScore(
			"performance",
			Math.min(100, qualityScores.performance + 12),
		);
		updateQualityScore("testing", Math.min(100, qualityScores.testing + 9));
		updateQualityScore(
			"architecture",
			Math.min(100, qualityScores.architecture + 11),
		);
		updateQualityScore(
			"documentation",
			Math.min(100, qualityScores.documentation + 7),
		);
	};

	return (
		<div className="container mx-auto space-y-8 py-8">
			{/* Header */}
			<motion.div
				className="space-y-4 text-center"
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, ease: easingCurves.gentle }}
			>
				<h1 className="font-bold text-4xl">Gamification System Demo</h1>
				<p className="text-lg text-muted-foreground">
					Japanese-inspired UI/UX for AI performance tracking and motivation
				</p>
				<div className="flex flex-wrap justify-center gap-2">
					<Badge variant="secondary">Framer Motion</Badge>
					<Badge variant="secondary">Zustand State</Badge>
					<Badge variant="secondary">shadcn/ui</Badge>
					<Badge variant="secondary">Calm Animations</Badge>
				</div>
			</motion.div>

			{/* Quick Actions */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Zap className="h-5 w-5 text-amber-500" />
						Demo Controls
					</CardTitle>
					<CardDescription>
						Test the gamification system with these actions
					</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-wrap gap-2">
					<Button onClick={() => handleAddXP(100)} variant="default">
						<Zap className="mr-2 h-4 w-4" />
						+100 XP
					</Button>
					<Button onClick={() => handleAddXP(500)} variant="default">
						<Zap className="mr-2 h-4 w-4" />
						+500 XP
					</Button>
					<Button onClick={() => handleAddXP(1000)} variant="default">
						<Zap className="mr-2 h-4 w-4" />
						+1000 XP
					</Button>
					<Button
						onClick={() => handleUnlockAchievement("first-perfect-score")}
						variant="secondary"
					>
						<Trophy className="mr-2 h-4 w-4" />
						Unlock Achievement
					</Button>
					<Button onClick={handleImproveQuality} variant="secondary">
						<TrendingUp className="mr-2 h-4 w-4" />
						Improve Quality
					</Button>
				</CardContent>
			</Card>

			{/* Main Content Tabs */}
			<Tabs defaultValue="progress" className="space-y-6">
				<TabsList className="grid w-full grid-cols-4">
					<TabsTrigger value="progress">Progress</TabsTrigger>
					<TabsTrigger value="achievements">Achievements</TabsTrigger>
					<TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
					<TabsTrigger value="metrics">Metrics</TabsTrigger>
				</TabsList>

				{/* Progress Tab */}
				<TabsContent value="progress" className="space-y-6">
					<div className="grid gap-6 md:grid-cols-2">
						<Card>
							<CardHeader>
								<CardTitle>XP Progress - Compact</CardTitle>
							</CardHeader>
							<CardContent>
								<XPProgressBar
									currentXP={currentXP}
									levelXP={
										level === 1
											? 0
											: level === 2
												? 501
												: level === 3
													? 1201
													: level === 4
														? 3001
														: 6001
									}
									nextLevelXP={
										level === 1
											? 501
											: level === 2
												? 1201
												: level === 3
													? 3001
													: level === 4
														? 6001
														: 10000
									}
									level={level}
									variant="compact"
									showLabel={false}
								/>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>XP Progress - Default</CardTitle>
							</CardHeader>
							<CardContent>
								<XPProgressBar
									currentXP={currentXP}
									levelXP={
										level === 1
											? 0
											: level === 2
												? 501
												: level === 3
													? 1201
													: level === 4
														? 3001
														: 6001
									}
									nextLevelXP={
										level === 1
											? 501
											: level === 2
												? 1201
												: level === 3
													? 3001
													: level === 4
														? 6001
														: 10000
									}
									level={level}
									variant="default"
								/>
							</CardContent>
						</Card>
					</div>

					<XPProgressBar
						currentXP={currentXP}
						levelXP={
							level === 1
								? 0
								: level === 2
									? 501
									: level === 3
										? 1201
										: level === 4
											? 3001
											: 6001
						}
						nextLevelXP={
							level === 1
								? 501
								: level === 2
									? 1201
									: level === 3
										? 3001
										: level === 4
											? 6001
											: 10000
						}
						level={level}
						variant="detailed"
					/>

					<StreakCalendar
						streakData={streakData}
						currentStreak={currentStreak}
						bestStreak={bestStreak}
						weeksToShow={12}
					/>
				</TabsContent>

				{/* Achievements Tab */}
				<TabsContent value="achievements" className="space-y-6">
					<div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
						{achievements.map((achievement) => (
							<AchievementBadge
								key={achievement.id}
								achievement={achievement}
								size="lg"
								showProgress
								showTooltip
							/>
						))}
					</div>
				</TabsContent>

				{/* Leaderboard Tab */}
				<TabsContent value="leaderboard" className="space-y-6">
					<div className="grid gap-6 md:grid-cols-2">
						<LeaderboardCard
							title="Overall XP Champions"
							entries={leaderboardEntries}
							currentUserRank={leaderboardRank || undefined}
							category="xp"
						/>
						<LeaderboardCard
							title="Quality Perfectionists"
							entries={leaderboardEntries.map((e) => ({
								...e,
								score: Math.floor(e.score * 0.8),
							}))}
							category="quality"
						/>
					</div>
				</TabsContent>

				{/* Metrics Tab */}
				<TabsContent value="metrics" className="space-y-6">
					<QualityMetricsRadar
						metrics={qualityMetrics}
						title="Quality Metrics Overview"
						size={400}
					/>
				</TabsContent>
			</Tabs>

			{/* Level Up Notification */}
			{showLevelUpNotification && pendingLevelUp && (
				<LevelUpNotification
					isOpen={showLevelUpNotification}
					onClose={hideLevelUp}
					newLevel={pendingLevelUp.newLevel}
					levelName={pendingLevelUp.levelName}
					xpEarned={pendingLevelUp.xpEarned}
					unlockedFeatures={pendingLevelUp.unlockedFeatures}
					duration={5000}
				/>
			)}
		</div>
	);
}
