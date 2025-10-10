/**
 * Daily/Weekly Quest System for Supplement Learning Engagement
 * Evidence-based quest system to encourage consistent learning
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Target,
	Calendar,
	Clock,
	Star,
	CheckCircle,
	Play,
	RefreshCw,
	Trophy,
	BookOpen,
	Users,
	Brain,
} from "lucide-react";
import { useSupplementGamificationStore } from "@/lib/stores/supplement-gamification-store";
import type { SupplementQuest } from "@/lib/stores/supplement-gamification-store";

interface QuestCardProps {
	quest: SupplementQuest;
	onStart?: (quest: SupplementQuest) => void;
	isActive?: boolean;
}

function QuestCard({ quest, onStart, isActive }: QuestCardProps) {
	const progress = quest.progress || 0;
	const isCompleted = quest.completed;
	const timeLeft = quest.timeLimit ? Math.max(0, quest.timeLimit - (Date.now() / (1000 * 60 * 60))) : null;

	const getQuestIcon = (category: string) => {
		switch (category) {
			case "learning": return <BookOpen className="h-4 w-4" />;
			case "social": return <Users className="h-4 w-4" />;
			case "exploration": return <Brain className="h-4 w-4" />;
			default: return <Target className="h-4 w-4" />;
		}
	};

	const getDifficultyColor = (quest: SupplementQuest) => {
		if (isCompleted) return "bg-green-100 text-green-800";
		if (progress > 50) return "bg-blue-100 text-blue-800";
		return "bg-gray-100 text-gray-800";
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			whileHover={{ scale: 1.02 }}
			className="h-full"
		>
			<Card className={`h-full transition-all duration-200 ${isCompleted ? "ring-2 ring-green-200" : ""}`}>
				<CardHeader className="pb-3">
					<div className="flex items-start justify-between">
						<div className="flex items-center gap-2">
							{getQuestIcon(quest.category)}
							<CardTitle className="text-lg">{quest.title}</CardTitle>
						</div>
						<div className="flex items-center gap-2">
							<Badge className={getDifficultyColor(quest)}>
								{quest.type}
							</Badge>
							{isCompleted && <CheckCircle className="h-5 w-5 text-green-600" />}
						</div>
					</div>
				</CardHeader>
				<CardContent className="space-y-4">
					<p className="text-sm text-muted-foreground">
						{quest.description}
					</p>

					<div className="space-y-2">
						<div className="flex justify-between text-sm">
							<span>Progress</span>
							<span>{Math.round(progress)}%</span>
						</div>
						<Progress value={progress} className="h-2" />
					</div>

					{quest.requirements.map((req, index) => (
						<div key={index} className="flex items-center gap-2 text-sm">
							<div className={`w-2 h-2 rounded-full ${req.current >= req.target ? "bg-green-500" : "bg-gray-300"}`} />
							<span className={req.current >= req.target ? "line-through text-muted-foreground" : ""}>
								{req.description} ({req.current}/{req.target})
							</span>
						</div>
					))}

					<div className="flex items-center justify-between pt-2">
						<div className="flex items-center gap-1">
							<Star className="h-4 w-4 text-yellow-500" />
							<span className="font-medium">{quest.xpReward} XP</span>
						</div>

						{timeLeft !== null && (
							<div className="flex items-center gap-1 text-sm text-muted-foreground">
								<Clock className="h-3 w-3" />
								{timeLeft > 0 ? `${Math.round(timeLeft)}h left` : "Expired"}
							</div>
						)}
					</div>

					{!isCompleted && onStart && (
						<Button
							onClick={() => onStart(quest)}
							className="w-full gap-2"
							disabled={isActive}
						>
							{isActive ? (
								<>
									<RefreshCw className="h-4 w-4 animate-spin" />
									In Progress
								</>
							) : (
								<>
									<Play className="h-4 w-4" />
									Start Quest
								</>
							)}
						</Button>
					)}

					{isCompleted && quest.completedAt && (
						<div className="text-center text-sm text-green-600">
							Completed {new Date(quest.completedAt).toLocaleDateString()}
						</div>
					)}
				</CardContent>
			</Card>
		</motion.div>
	);
}

export function QuestSystem() {
	const {
		activeQuests,
		completedQuests,
		questPoints,
		completeQuest,
		startQuest,
		updateQuestProgress,
	} = useSupplementGamificationStore();

	const [activeTab, setActiveTab] = useState("active");
	const [selectedQuest, setSelectedQuest] = useState<SupplementQuest | null>(null);

	const dailyQuests = activeQuests.filter(q => q.type === "daily");
	const weeklyQuests = activeQuests.filter(q => q.type === "weekly");
	const completedQuestObjects = activeQuests.filter(q => q.completed);

	const handleStartQuest = (quest: SupplementQuest) => {
		startQuest(quest);
		setSelectedQuest(quest);
	};

	const handleQuestAction = (quest: SupplementQuest, action: string) => {
		switch (action) {
			case "complete":
				completeQuest(quest.id);
				break;
			case "progress":
				// Simulate progress update (in real app, this would come from user actions)
				const currentProgress = quest.progress || 0;
				updateQuestProgress(quest.id, Math.min(100, currentProgress + 25));
				break;
		}
	};

	return (
		<div className="w-full max-w-6xl mx-auto space-y-6">
			{/* Header */}
			<div className="text-center space-y-2">
				<h2 className="text-3xl font-bold flex items-center justify-center gap-2">
					<Target className="h-8 w-8 text-primary" />
					Quest System
				</h2>
				<p className="text-muted-foreground">
					Complete evidence-based quests to accelerate your supplement learning journey
				</p>
				<div className="flex items-center justify-center gap-2">
					<Star className="h-5 w-5 text-yellow-500" />
					<span className="font-medium">{questPoints} Quest Points Earned</span>
				</div>
			</div>

			{/* Quest Stats */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<Card>
					<CardContent className="p-4 text-center">
						<div className="text-2xl font-bold text-primary">{dailyQuests.length}</div>
						<div className="text-sm text-muted-foreground">Daily Quests</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="p-4 text-center">
						<div className="text-2xl font-bold text-primary">{weeklyQuests.length}</div>
						<div className="text-sm text-muted-foreground">Weekly Quests</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="p-4 text-center">
						<div className="text-2xl font-bold text-primary">{completedQuestObjects.length}</div>
						<div className="text-sm text-muted-foreground">Completed</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="p-4 text-center">
						<div className="text-2xl font-bold text-primary">{questPoints}</div>
						<div className="text-sm text-muted-foreground">Total XP</div>
					</CardContent>
				</Card>
			</div>

			{/* Quest Tabs */}
			<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
				<TabsList className="grid w-full grid-cols-3">
					<TabsTrigger value="active" className="gap-2">
						<Play className="h-4 w-4" />
						Active ({activeQuests.filter(q => !q.completed).length})
					</TabsTrigger>
					<TabsTrigger value="completed" className="gap-2">
						<CheckCircle className="h-4 w-4" />
						Completed ({completedQuestObjects.length})
					</TabsTrigger>
					<TabsTrigger value="rewards" className="gap-2">
						<Trophy className="h-4 w-4" />
						Rewards
					</TabsTrigger>
				</TabsList>

				<TabsContent value="active" className="space-y-6">
					{dailyQuests.length > 0 && (
						<div className="space-y-4">
							<h3 className="text-xl font-semibold flex items-center gap-2">
								<Calendar className="h-5 w-5 text-blue-500" />
								Daily Quests
							</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								{dailyQuests.map((quest) => (
									<QuestCard
										key={quest.id}
										quest={quest}
										onStart={handleStartQuest}
										isActive={selectedQuest?.id === quest.id}
									/>
								))}
							</div>
						</div>
					)}

					{weeklyQuests.length > 0 && (
						<div className="space-y-4">
							<h3 className="text-xl font-semibold flex items-center gap-2">
								<Calendar className="h-5 w-5 text-purple-500" />
								Weekly Quests
							</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								{weeklyQuests.map((quest) => (
									<QuestCard
										key={quest.id}
										quest={quest}
										onStart={handleStartQuest}
										isActive={selectedQuest?.id === quest.id}
									/>
								))}
							</div>
						</div>
					)}

					{activeQuests.filter(q => !q.completed).length === 0 && (
						<Card>
							<CardContent className="text-center py-8">
								<Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
								<h3 className="text-lg font-medium mb-2">No Active Quests</h3>
								<p className="text-muted-foreground">
									Complete your current quests to unlock new challenges!
								</p>
							</CardContent>
						</Card>
					)}
				</TabsContent>

				<TabsContent value="completed" className="space-y-6">
					{completedQuestObjects.length > 0 ? (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{completedQuestObjects.map((quest) => (
								<QuestCard key={quest.id} quest={quest} />
							))}
						</div>
					) : (
						<Card>
							<CardContent className="text-center py-8">
								<CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
								<h3 className="text-lg font-medium mb-2">No Completed Quests</h3>
								<p className="text-muted-foreground">
									Complete your first quest to see it here!
								</p>
							</CardContent>
						</Card>
					)}
				</TabsContent>

				<TabsContent value="rewards" className="space-y-6">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Star className="h-5 w-5 text-yellow-500" />
									Quest Master
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-sm text-muted-foreground mb-4">
									Complete 50 quests to unlock this achievement
								</p>
								<Progress value={Math.min((completedQuests.length / 50) * 100, 100)} />
								<p className="text-xs text-muted-foreground mt-2">
									{completedQuests.length}/50 completed
								</p>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Calendar className="h-5 w-5 text-blue-500" />
									Consistency Champion
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-sm text-muted-foreground mb-4">
									Complete daily quests for 30 consecutive days
								</p>
								<Progress value={Math.min((questPoints / 1000) * 100, 100)} />
								<p className="text-xs text-muted-foreground mt-2">
									{questPoints}/1000 XP from quests
								</p>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Trophy className="h-5 w-5 text-purple-500" />
									Quest Legend
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-sm text-muted-foreground mb-4">
									Complete all quest types with perfect scores
								</p>
								<Progress value={Math.min((questPoints / 500) * 100, 100)} />
								<p className="text-xs text-muted-foreground mt-2">
									{questPoints}/500 XP from perfect quests
								</p>
							</CardContent>
						</Card>
					</div>
				</TabsContent>
			</Tabs>

			{/* Active Quest Actions */}
			{selectedQuest && (
				<Card className="border-primary">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<RefreshCw className="h-5 w-5 animate-spin text-primary" />
							Active Quest: {selectedQuest.title}
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex gap-2">
							<Button
								onClick={() => handleQuestAction(selectedQuest, "progress")}
								className="gap-2"
							>
								<CheckCircle className="h-4 w-4" />
								Update Progress
							</Button>
							<Button
								onClick={() => handleQuestAction(selectedQuest, "complete")}
								variant="outline"
								className="gap-2"
							>
								<Target className="h-4 w-4" />
								Mark Complete
							</Button>
						</div>
						<p className="text-sm text-muted-foreground">
							Complete the quest requirements to earn {selectedQuest.xpReward} XP!
						</p>
					</CardContent>
				</Card>
			)}
		</div>
	);
}