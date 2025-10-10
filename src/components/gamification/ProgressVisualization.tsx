/**
 * Progress Visualization with Animated Charts and Graphs
 * Comprehensive dashboard for tracking supplement learning progress
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	TrendingUp,
	Calendar,
	Brain,
	Target,
	Star,
	Flame,
	Award,
	BarChart3,
	PieChart,
	LineChart,
	Activity,
} from "lucide-react";
import { useSupplementGamificationStore } from "@/lib/stores/supplement-gamification-store";

interface ProgressData {
	date: string;
	xp: number;
	supplementsLearned: number;
	quizzesCompleted: number;
	streak: number;
}

interface CategoryProgress {
	category: string;
	learned: number;
	total: number;
	percentage: number;
	color: string;
}

export function ProgressVisualization() {
	const {
		currentXP,
		level,
		totalSupplementsLearned,
		currentStreak,
		bestStreak,
		knowledgeScore,
		adherenceScore,
		achievements,
		unlockedAchievements,
		weeklyProgress,
		monthlyStats,
	} = useSupplementGamificationStore();

	const [timeRange, setTimeRange] = useState<"week" | "month" | "year">("month");
	const [animateValues, setAnimateValues] = useState(false);

	// Sample data for demonstration
	const sampleProgressData: ProgressData[] = [
		{ date: "2024-01-01", xp: 0, supplementsLearned: 0, quizzesCompleted: 0, streak: 0 },
		{ date: "2024-01-02", xp: 25, supplementsLearned: 1, quizzesCompleted: 0, streak: 1 },
		{ date: "2024-01-03", xp: 75, supplementsLearned: 3, quizzesCompleted: 1, streak: 2 },
		{ date: "2024-01-04", xp: 125, supplementsLearned: 5, quizzesCompleted: 2, streak: 3 },
		{ date: "2024-01-05", xp: 200, supplementsLearned: 8, quizzesCompleted: 3, streak: 4 },
		{ date: "2024-01-06", xp: 275, supplementsLearned: 11, quizzesCompleted: 4, streak: 5 },
		{ date: "2024-01-07", xp: 375, supplementsLearned: 15, quizzesCompleted: 6, streak: 6 },
		{ date: "2024-01-08", xp: 450, supplementsLearned: 18, quizzesCompleted: 7, streak: 7 },
	];

	const categoryProgress: CategoryProgress[] = [
		{ category: "Vitamins", learned: 12, total: 15, percentage: 80, color: "bg-green-500" },
		{ category: "Minerals", learned: 8, total: 12, percentage: 67, color: "bg-blue-500" },
		{ category: "Adaptogens", learned: 5, total: 10, percentage: 50, color: "bg-purple-500" },
		{ category: "Nootropics", learned: 3, total: 8, percentage: 38, color: "bg-orange-500" },
		{ category: "Fatty Acids", learned: 2, total: 4, percentage: 50, color: "bg-yellow-500" },
	];

	useEffect(() => {
		setAnimateValues(true);
	}, []);

	const AnimatedNumber = ({ value, suffix = "" }: { value: number; suffix?: string }) => {
		const [displayValue, setDisplayValue] = useState(0);

		useEffect(() => {
			if (animateValues) {
				const increment = value / 50;
				const timer = setInterval(() => {
					setDisplayValue(prev => {
						if (prev >= value) {
							clearInterval(timer);
							return value;
						}
						return prev + increment;
					});
				}, 20);
				return () => clearInterval(timer);
			}
			return undefined;
		}, [value, animateValues]);

		return <span className="font-bold text-2xl">{Math.round(displayValue)}{suffix}</span>;
	};

	return (
		<div className="w-full max-w-7xl mx-auto space-y-6">
			{/* Header */}
			<div className="text-center space-y-2">
				<h2 className="text-3xl font-bold flex items-center justify-center gap-2">
					<TrendingUp className="h-8 w-8 text-primary" />
					Progress Dashboard
				</h2>
				<p className="text-muted-foreground">
					Track your supplement learning journey with beautiful visualizations
				</p>
			</div>

			{/* Key Metrics Overview */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				<Card>
					<CardContent className="p-6 text-center">
						<Brain className="h-8 w-8 text-blue-500 mx-auto mb-2" />
						<AnimatedNumber value={currentXP} />
						<div className="text-sm text-muted-foreground">Total XP</div>
						<Progress value={(currentXP % 1000) / 10} className="mt-2" />
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-6 text-center">
						<Flame className="h-8 w-8 text-orange-500 mx-auto mb-2" />
						<AnimatedNumber value={currentStreak} />
						<div className="text-sm text-muted-foreground">Current Streak</div>
						<div className="text-xs text-muted-foreground mt-1">
							Best: {bestStreak} days
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-6 text-center">
						<Target className="h-8 w-8 text-green-500 mx-auto mb-2" />
						<AnimatedNumber value={knowledgeScore} suffix="%" />
						<div className="text-sm text-muted-foreground">Knowledge Score</div>
						<Progress value={knowledgeScore} className="mt-2" />
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-6 text-center">
						<Award className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
						<AnimatedNumber value={unlockedAchievements.length} />
						<div className="text-sm text-muted-foreground">Achievements</div>
						<div className="text-xs text-muted-foreground mt-1">
							{achievements.length - unlockedAchievements.length} remaining
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Main Visualization Tabs */}
			<Tabs defaultValue="overview" className="w-full">
				<TabsList className="grid w-full grid-cols-4">
					<TabsTrigger value="overview" className="gap-2">
						<BarChart3 className="h-4 w-4" />
						Overview
					</TabsTrigger>
					<TabsTrigger value="learning" className="gap-2">
						<Brain className="h-4 w-4" />
						Learning
					</TabsTrigger>
					<TabsTrigger value="categories" className="gap-2">
						<PieChart className="h-4 w-4" />
						Categories
					</TabsTrigger>
					<TabsTrigger value="achievements" className="gap-2">
						<Star className="h-4 w-4" />
						Achievements
					</TabsTrigger>
				</TabsList>

				<TabsContent value="overview" className="space-y-6">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						{/* XP Progress Over Time */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<LineChart className="h-5 w-5" />
									XP Progress Over Time
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="h-64 flex items-end justify-between space-x-2">
									{sampleProgressData.slice(-7).map((data, index) => (
										<motion.div
											key={data.date}
											initial={{ height: 0 }}
											animate={{ height: `${(data.xp / 500) * 100}%` }}
											transition={{ delay: index * 0.1 }}
											className="bg-primary rounded-t flex-1 min-w-[20px] relative group cursor-pointer"
										>
											<div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-xs px-2 py-1 rounded">
												{data.xp} XP
											</div>
										</motion.div>
									))}
								</div>
								<div className="flex justify-between mt-2 text-xs text-muted-foreground">
									{sampleProgressData.slice(-7).map((data) => (
										<div key={data.date} className="text-center">
											{new Date(data.date).toLocaleDateString('en', { weekday: 'short' })}
										</div>
									))}
								</div>
							</CardContent>
						</Card>

						{/* Streak Calendar Heatmap */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Calendar className="h-5 w-5" />
									Learning Activity
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-2">
									<div className="flex items-center gap-2 text-sm">
										<div className="w-3 h-3 bg-gray-100 rounded"></div>
										<span>No activity</span>
										<div className="w-3 h-3 bg-blue-200 rounded"></div>
										<span>1-2 supplements</span>
										<div className="w-3 h-3 bg-blue-400 rounded"></div>
										<span>3-5 supplements</span>
										<div className="w-3 h-3 bg-blue-600 rounded"></div>
										<span>6+ supplements</span>
									</div>
									<div className="grid grid-cols-7 gap-1">
										{Array.from({ length: 35 }, (_, i) => {
											const intensity = Math.random();
											return (
												<motion.div
													key={i}
													initial={{ scale: 0 }}
													animate={{ scale: 1 }}
													transition={{ delay: i * 0.02 }}
													className={`aspect-square rounded cursor-pointer hover:ring-2 hover:ring-primary transition-all ${
														intensity < 0.3 ? 'bg-gray-100' :
														intensity < 0.6 ? 'bg-blue-200' :
														intensity < 0.8 ? 'bg-blue-400' : 'bg-blue-600'
													}`}
													title={`${Math.floor(intensity * 6)} supplements learned`}
												/>
											);
										})}
									</div>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Weekly Progress Summary */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Activity className="h-5 w-5" />
								Weekly Progress
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
								<div className="text-center">
									<div className="text-3xl font-bold text-primary mb-1">
										{weeklyProgress.reduce((sum, day) => sum + day.supplementsStudied, 0)}
									</div>
									<div className="text-sm text-muted-foreground">Supplements Studied</div>
									<Progress
										value={Math.min((weeklyProgress.reduce((sum, day) => sum + day.supplementsStudied, 0) / 50) * 100, 100)}
										className="mt-2"
									/>
								</div>
								<div className="text-center">
									<div className="text-3xl font-bold text-primary mb-1">
										{weeklyProgress.reduce((sum, day) => sum + day.quizzesCompleted, 0)}
									</div>
									<div className="text-sm text-muted-foreground">Quizzes Completed</div>
									<Progress
										value={Math.min((weeklyProgress.reduce((sum, day) => sum + day.quizzesCompleted, 0) / 20) * 100, 100)}
										className="mt-2"
									/>
								</div>
								<div className="text-center">
									<div className="text-3xl font-bold text-primary mb-1">
										{weeklyProgress.reduce((sum, day) => sum + day.xpEarned, 0)}
									</div>
									<div className="text-sm text-muted-foreground">XP Earned</div>
									<Progress
										value={Math.min((weeklyProgress.reduce((sum, day) => sum + day.xpEarned, 0) / 1000) * 100, 100)}
										className="mt-2"
									/>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="learning" className="space-y-6">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						{/* Knowledge Growth */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Brain className="h-5 w-5" />
									Knowledge Growth
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									<div className="flex items-center justify-between">
										<span className="text-sm font-medium">Overall Knowledge</span>
										<span className="font-bold">{knowledgeScore}%</span>
									</div>
									<Progress value={knowledgeScore} className="h-3" />

									<div className="space-y-3">
										<div className="flex items-center justify-between">
											<span className="text-sm">Quiz Accuracy</span>
											<span className="font-medium">{Math.round(knowledgeScore * 0.9)}%</span>
										</div>
										<div className="flex items-center justify-between">
											<span className="text-sm">Retention Rate</span>
											<span className="font-medium">{Math.round(knowledgeScore * 0.85)}%</span>
										</div>
										<div className="flex items-center justify-between">
											<span className="text-sm">Application Score</span>
											<span className="font-medium">{Math.round(knowledgeScore * 0.8)}%</span>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Adherence Tracking */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Calendar className="h-5 w-5" />
									Learning Consistency
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									<div className="flex items-center justify-between">
										<span className="text-sm font-medium">Adherence Score</span>
										<span className="font-bold">{adherenceScore}%</span>
									</div>
									<Progress value={adherenceScore} className="h-3" />

									<div className="grid grid-cols-2 gap-4 text-center">
										<div>
											<div className="text-xl font-bold text-orange-500">{currentStreak}</div>
											<div className="text-xs text-muted-foreground">Current Streak</div>
										</div>
										<div>
											<div className="text-xl font-bold text-blue-500">{bestStreak}</div>
											<div className="text-xs text-muted-foreground">Best Streak</div>
										</div>
									</div>

									<div className="space-y-2">
										<div className="flex justify-between text-sm">
											<span>This Week</span>
											<span>5/7 days</span>
										</div>
										<Progress value={(5/7) * 100} />
										<div className="flex justify-between text-sm">
											<span>This Month</span>
											<span>18/30 days</span>
										</div>
										<Progress value={(18/30) * 100} />
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				<TabsContent value="categories" className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<PieChart className="h-5 w-5" />
								Category Mastery
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								{/* Category Progress Bars */}
								<div className="space-y-4">
									{categoryProgress.map((category, index) => (
										<motion.div
											key={category.category}
											initial={{ opacity: 0, x: -20 }}
											animate={{ opacity: 1, x: 0 }}
											transition={{ delay: index * 0.1 }}
											className="space-y-2"
										>
											<div className="flex items-center justify-between">
												<span className="font-medium">{category.category}</span>
												<span className="text-sm text-muted-foreground">
													{category.learned}/{category.total}
												</span>
											</div>
											<div className="relative">
												<Progress value={category.percentage} className="h-3" />
												<div
													className={`absolute top-0 left-0 h-3 rounded-full ${category.color}`}
													style={{ width: `${category.percentage}%` }}
												/>
											</div>
										</motion.div>
									))}
								</div>

								{/* Category Distribution Chart */}
								<div className="relative">
									<div className="h-48 flex items-center justify-center">
										<div className="relative w-32 h-32">
											{categoryProgress.map((category, index) => {
												const angle = (category.percentage / 100) * 360;
												const rotation = categoryProgress
													.slice(0, index)
													.reduce((sum, cat) => sum + (cat.percentage / 100) * 360, 0);

												return (
													<motion.div
														key={category.category}
														initial={{ rotate: 0 }}
														animate={{ rotate: rotation }}
														className={`absolute inset-0 ${category.color} opacity-80`}
														style={{
															clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos(angle * Math.PI / 180)}% ${50 + 50 * Math.sin(angle * Math.PI / 180)}%)`,
														}}
													/>
												);
											})}
										</div>
									</div>
									<div className="text-center text-sm text-muted-foreground">
										Category Distribution
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="achievements" className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Star className="h-5 w-5" />
								Achievement Progress
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								{achievements.slice(0, 8).map((achievement, index) => {
									const isUnlocked = unlockedAchievements.includes(achievement.id);
									const progress = isUnlocked ? 100 : Math.min((totalSupplementsLearned / 20) * 100, 100);

									return (
										<motion.div
											key={achievement.id}
											initial={{ opacity: 0, scale: 0.9 }}
											animate={{ opacity: 1, scale: 1 }}
											transition={{ delay: index * 0.05 }}
											className={`p-4 border rounded-lg transition-all ${
												isUnlocked ? "bg-green-50 border-green-200" : "bg-gray-50"
											}`}
										>
											<div className="flex items-start gap-3">
												<div className={`p-2 rounded-full ${
													isUnlocked ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
												}`}>
													{isUnlocked ? "🏆" : "🔒"}
												</div>
												<div className="flex-1">
													<h4 className="font-medium">{achievement.name}</h4>
													<p className="text-sm text-muted-foreground mb-2">
														{achievement.description}
													</p>
													<div className="flex items-center gap-2">
														<Progress value={progress} className="flex-1 h-2" />
														<span className="text-xs text-muted-foreground">
															{achievement.xpReward} XP
														</span>
													</div>
												</div>
											</div>
										</motion.div>
									);
								})}
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}