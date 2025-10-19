/**
 * Comprehensive Supplement Gamification Dashboard
 * Main hub for all supplement learning gamification features
 */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSupplementGamificationStore } from "@/lib/stores/supplement-gamification-store";
import { motion } from "framer-motion";
import {
	BarChart3,
	Brain,
	Calendar,
	Flame,
	Gamepad2,
	Layers,
	Star,
	Target,
	TrendingUp,
	Trophy,
	Users,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import { InteractiveStackBuilder } from "./InteractiveStackBuilder";
import { ProgressVisualization } from "./ProgressVisualization";
import { QuestSystem } from "./QuestSystem";
import { SupplementBattles } from "./SupplementBattles";
import { SupplementExplorationChallenge } from "./supplement-challenges/SupplementExplorationChallenge";

interface GamificationFeature {
	id: string;
	name: string;
	description: string;
	icon: React.ReactNode;
	component: React.ReactNode;
	xpReward?: number;
	isNew?: boolean;
}

export function SupplementGamificationDashboard() {
	const [activeFeature, setActiveFeature] = useState<string | null>(null);
	const {
		currentXP,
		level,
		currentStreak,
		unlockedAchievements,
		showLevelUpNotification,
		showAchievementNotification,
		pendingLevelUp,
		pendingAchievement,
		hideLevelUp,
		hideAchievement,
	} = useSupplementGamificationStore();

	const gamificationFeatures: GamificationFeature[] = [
		{
			id: "challenges",
			name: "Exploration Challenges",
			description:
				"Test your supplement knowledge with evidence-based questions",
			icon: <Brain className="h-6 w-6" />,
			component: <SupplementExplorationChallenge />,
			xpReward: 25,
		},
		{
			id: "quests",
			name: "Quest System",
			description: "Complete daily and weekly quests for bonus XP",
			icon: <Target className="h-6 w-6" />,
			component: <QuestSystem />,
			xpReward: 50,
		},
		{
			id: "battles",
			name: "Knowledge Battles",
			description: "Compete against AI opponents in supplement trivia",
			icon: <Trophy className="h-6 w-6" />,
			component: <SupplementBattles />,
			xpReward: 75,
		},
		{
			id: "stack-builder",
			name: "Stack Builder",
			description: "Create evidence-based supplement combinations",
			icon: <Layers className="h-6 w-6" />,
			component: <InteractiveStackBuilder />,
			xpReward: 100,
		},
		{
			id: "progress",
			name: "Progress Dashboard",
			description: "Visualize your learning journey and achievements",
			icon: <BarChart3 className="h-6 w-6" />,
			component: <ProgressVisualization />,
		},
	];

	if (activeFeature) {
		const feature = gamificationFeatures.find((f) => f.id === activeFeature);
		if (!feature) return null;

		return (
			<div className="mx-auto w-full max-w-7xl space-y-6">
				{/* Back Button */}
				<div className="flex items-center gap-4">
					<Button
						variant="outline"
						onClick={() => setActiveFeature(null)}
						className="gap-2"
					>
						← Back to Dashboard
					</Button>
					<div className="flex items-center gap-2">
						{feature.icon}
						<h2 className="font-bold text-2xl">{feature.name}</h2>
						{feature.isNew && (
							<Badge className="bg-green-100 text-green-800">New!</Badge>
						)}
					</div>
				</div>

				{/* Feature Component */}
				{feature.component}
			</div>
		);
	}

	return (
		<div className="mx-auto w-full max-w-7xl space-y-6">
			{/* Header */}
			<div className="space-y-4 text-center">
				<h1 className="flex items-center justify-center gap-3 font-bold text-4xl">
					<Gamepad2 className="h-10 w-10 text-primary" />
					Supplement Learning Hub
				</h1>
				<p className="mx-auto max-w-2xl text-lg text-muted-foreground">
					Level up your supplement knowledge through engaging, evidence-based
					challenges and competitions
				</p>

				{/* Level and XP Display */}
				<div className="flex items-center justify-center gap-6">
					<Card className="px-6 py-3">
						<div className="text-center">
							<div className="text-muted-foreground text-sm">Level</div>
							<div className="font-bold text-2xl text-primary">{level}</div>
						</div>
					</Card>
					<Card className="px-6 py-3">
						<div className="text-center">
							<div className="text-muted-foreground text-sm">XP</div>
							<div className="font-bold text-2xl text-primary">
								{currentXP.toLocaleString()}
							</div>
						</div>
					</Card>
					<Card className="px-6 py-3">
						<div className="text-center">
							<div className="text-muted-foreground text-sm">Streak</div>
							<div className="flex items-center gap-1">
								<Flame className="h-4 w-4 text-orange-500" />
								<span className="font-bold text-2xl">{currentStreak}</span>
							</div>
						</div>
					</Card>
				</div>
			</div>

			{/* Achievement Notifications */}
			{(showLevelUpNotification || showAchievementNotification) && (
				<motion.div
					initial={{ opacity: 0, y: -50 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -50 }}
					className="fixed top-4 right-4 z-50 max-w-sm"
				>
					<Card className="border-2 border-yellow-200 bg-yellow-50">
						<CardContent className="p-4">
							{showLevelUpNotification && pendingLevelUp && (
								<div className="space-y-2">
									<div className="flex items-center gap-2">
										<Star className="h-5 w-5 text-yellow-500" />
										<span className="font-bold">Level Up!</span>
										<Button
											variant="ghost"
											size="sm"
											onClick={hideLevelUp}
											className="ml-auto"
										>
											×
										</Button>
									</div>
									<div className="text-sm">
										<div className="font-medium">
											New Level: {pendingLevelUp.levelName}
										</div>
										<div className="text-muted-foreground">
											+{pendingLevelUp.xpEarned} XP earned
										</div>
									</div>
									{pendingLevelUp.unlockedFeatures.length > 0 && (
										<div className="text-muted-foreground text-xs">
											Unlocked: {pendingLevelUp.unlockedFeatures.join(", ")}
										</div>
									)}
								</div>
							)}

							{showAchievementNotification && pendingAchievement && (
								<div className="space-y-2">
									<div className="flex items-center gap-2">
										<Trophy className="h-5 w-5 text-yellow-500" />
										<span className="font-bold">Achievement Unlocked!</span>
										<Button
											variant="ghost"
											size="sm"
											onClick={hideAchievement}
											className="ml-auto"
										>
											×
										</Button>
									</div>
									<div className="text-sm">
										<div className="font-medium">{pendingAchievement.name}</div>
										<div className="text-muted-foreground">
											{pendingAchievement.description}
										</div>
										<div className="font-medium text-green-600">
											+{pendingAchievement.xpReward} XP
										</div>
									</div>
								</div>
							)}
						</CardContent>
					</Card>
				</motion.div>
			)}

			{/* Quick Stats */}
			<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
				<Card>
					<CardContent className="p-4 text-center">
						<div className="font-bold text-2xl text-primary">
							{unlockedAchievements.length}
						</div>
						<div className="text-muted-foreground text-sm">Achievements</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="p-4 text-center">
						<div className="font-bold text-2xl text-primary">12</div>
						<div className="text-muted-foreground text-sm">
							Categories Explored
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="p-4 text-center">
						<div className="font-bold text-2xl text-primary">156</div>
						<div className="text-muted-foreground text-sm">
							Supplements Learned
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="p-4 text-center">
						<div className="font-bold text-2xl text-primary">8</div>
						<div className="text-muted-foreground text-sm">Stacks Created</div>
					</CardContent>
				</Card>
			</div>

			{/* Feature Grid */}
			<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				{gamificationFeatures.map((feature, index) => (
					<motion.div
						key={feature.id}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: index * 0.1 }}
						className="h-full"
					>
						<Card
							className="h-full cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg"
							onClick={() => setActiveFeature(feature.id)}
						>
							<CardHeader className="pb-3">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-3">
										<div className="rounded-lg bg-primary/10 p-2 text-primary">
											{feature.icon}
										</div>
										<CardTitle className="text-lg">{feature.name}</CardTitle>
									</div>
									{feature.isNew && (
										<Badge className="bg-green-100 text-green-800 text-xs">
											New
										</Badge>
									)}
								</div>
							</CardHeader>
							<CardContent className="space-y-3">
								<p className="text-muted-foreground text-sm">
									{feature.description}
								</p>

								{feature.xpReward && (
									<div className="flex items-center gap-1 text-sm">
										<Star className="h-3 w-3 text-yellow-500" />
										<span className="font-medium text-green-600">
											Up to {feature.xpReward} XP
										</span>
									</div>
								)}

								<Button className="w-full gap-2" size="sm">
									Play Now
								</Button>
							</CardContent>
						</Card>
					</motion.div>
				))}
			</div>

			{/* Social Features Preview */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Users className="h-5 w-5" />
						Social Features (Coming Soon)
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
						<div className="rounded-lg border p-4 text-center">
							<Users className="mx-auto mb-2 h-8 w-8 text-blue-500" />
							<h3 className="font-medium">Share Recommendations</h3>
							<p className="text-muted-foreground text-sm">
								Share evidence-based supplement recommendations with the
								community
							</p>
						</div>
						<div className="rounded-lg border p-4 text-center">
							<Calendar className="mx-auto mb-2 h-8 w-8 text-green-500" />
							<h3 className="font-medium">Learning Streaks</h3>
							<p className="text-muted-foreground text-sm">
								Compare learning streaks and build healthy habits together
							</p>
						</div>
						<div className="rounded-lg border p-4 text-center">
							<Trophy className="mx-auto mb-2 h-8 w-8 text-yellow-500" />
							<h3 className="font-medium">Leaderboards</h3>
							<p className="text-muted-foreground text-sm">
								Compete with other learners and climb the rankings
							</p>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Evidence-Based Badge */}
			<Card className="border-green-200 bg-green-50">
				<CardContent className="p-4 text-center">
					<div className="flex items-center justify-center gap-2 text-green-700">
						<Badge className="bg-green-100 text-green-800">
							Evidence-Based
						</Badge>
						<span className="text-sm">
							All challenges and content are backed by scientific research and
							clinical evidence
						</span>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
