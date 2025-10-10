"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Award,
	BookOpen,
	Target,
	TrendingUp,
	Clock,
	Calendar,
	Star,
	Trophy,
	BarChart3,
	PieChart,
	Activity,
	CheckCircle,
	Play,
	RotateCcw,
	Download,
	Share,
	Settings
} from 'lucide-react';
import {
	UserProgress,
	UserPathwayProgress,
	QuizResult,
	Achievement,
	LearningStatistics
} from '@/types/education';
import { learningPathways } from '@/data/education/learning-pathways';

interface EnhancedProgressTrackerProps {
	userProgress: UserProgress;
	pathwayProgress: UserPathwayProgress[];
	quizHistory: QuizResult[];
	onExportProgress?: () => void;
	onShareProgress?: () => void;
	showDetailedAnalytics?: boolean;
}

type TimeRange = 'week' | 'month' | 'quarter' | 'year' | 'all';

export default function EnhancedProgressTracker({
	userProgress,
	pathwayProgress,
	quizHistory,
	onExportProgress,
	onShareProgress,
	showDetailedAnalytics = true
}: EnhancedProgressTrackerProps) {
	const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>('month');

	// Calculate statistics based on time range
	const filteredStats = useMemo(() => {
		const now = new Date();
		let startDate: Date;

		switch (selectedTimeRange) {
			case 'week':
				startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
				break;
			case 'month':
				startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
				break;
			case 'quarter':
				startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
				break;
			case 'year':
				startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
				break;
			default:
				startDate = new Date(0); // Beginning of time
		}

		const filteredQuizzes = quizHistory.filter(quiz =>
			new Date(quiz.startTime) >= startDate
		);

		const recentPathways = pathwayProgress.filter(progress =>
			new Date(progress.lastActivity) >= startDate
		);

		return {
			quizzes: filteredQuizzes,
			pathways: recentPathways,
			totalStudyTime: filteredQuizzes.reduce((sum, quiz) => sum + quiz.timeSpent, 0) +
						   recentPathways.reduce((sum, pathway) => {
							   // Estimate study time based on progress
							   const pathwayData = learningPathways.find(p => p.id === pathway.pathwayId);
							   if (pathwayData) {
								   return sum + (pathwayData.estimatedDuration * pathway.overallProgress / 100);
							   }
							   return sum;
						   }, 0)
		};
	}, [quizHistory, pathwayProgress, selectedTimeRange]);

	// Calculate learning statistics
	const learningStats = useMemo(() => {
		const totalQuizzes = quizHistory.length;
		const passedQuizzes = quizHistory.filter(quiz => quiz.passed).length;
		const averageScore = totalQuizzes > 0
			? quizHistory.reduce((sum, quiz) => sum + quiz.score, 0) / totalQuizzes
			: 0;

		const currentStreak = calculateCurrentStreak(quizHistory);
		const longestStreak = calculateLongestStreak(quizHistory);

		const weakAreas = identifyWeakAreas(quizHistory, pathwayProgress);
		const strongAreas = identifyStrongAreas(quizHistory, pathwayProgress);

		return {
			totalQuizzes,
			passedQuizzes,
			averageScore,
			currentStreak,
			longestStreak,
			weakAreas,
			strongAreas,
			completionRate: totalQuizzes > 0 ? (passedQuizzes / totalQuizzes) * 100 : 0
		};
	}, [quizHistory, pathwayProgress]);

	// Calculate pathway completion statistics
	const pathwayStats = useMemo(() => {
		const completed = pathwayProgress.filter(p => p.certificateEarned).length;
		const inProgress = pathwayProgress.filter(p => !p.certificateEarned && p.overallProgress > 0).length;
		const notStarted = learningPathways.length - pathwayProgress.length;

		const categoryProgress = learningPathways.reduce((acc, pathway) => {
			const progress = pathwayProgress.find(p => p.pathwayId === pathway.id);
			if (progress) {
				acc[pathway.category] = (acc[pathway.category] || 0) + progress.overallProgress;
			}
			return acc;
		}, {} as Record<string, number>);

		return {
			completed,
			inProgress,
			notStarted,
			categoryProgress,
			overallProgress: pathwayProgress.length > 0
				? pathwayProgress.reduce((sum, p) => sum + p.overallProgress, 0) / pathwayProgress.length
				: 0
		};
	}, [pathwayProgress]);

	const formatTime = (minutes: number) => {
		const hours = Math.floor(minutes / 60);
		const mins = minutes % 60;
		if (hours > 0) {
			return `${hours}h ${mins}m`;
		}
		return `${mins}m`;
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	};

	return (
		<div className="space-y-6">
			{/* Overview Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium flex items-center gap-2">
							<BookOpen className="h-4 w-4" />
							Modules Completed
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{userProgress.totalModulesCompleted}</div>
						<p className="text-xs text-muted-foreground">
							Across all pathways
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium flex items-center gap-2">
							<Target className="h-4 w-4" />
							Quiz Success Rate
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{Math.round(learningStats.completionRate)}%
						</div>
						<p className="text-xs text-muted-foreground">
							{learningStats.passedQuizzes} of {learningStats.totalQuizzes} passed
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium flex items-center gap-2">
							<TrendingUp className="h-4 w-4" />
							Current Streak
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{learningStats.currentStreak}</div>
						<p className="text-xs text-muted-foreground">
							Days of learning
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium flex items-center gap-2">
							<Clock className="h-4 w-4" />
							Total Study Time
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{formatTime(userProgress.totalStudyTime)}
						</div>
						<p className="text-xs text-muted-foreground">
							Across all activities
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Detailed Analytics */}
			{showDetailedAnalytics && (
				<Tabs defaultValue="overview" className="space-y-4">
					<TabsList className="grid w-full grid-cols-4">
						<TabsTrigger value="overview">Overview</TabsTrigger>
						<TabsTrigger value="pathways">Pathways</TabsTrigger>
						<TabsTrigger value="performance">Performance</TabsTrigger>
						<TabsTrigger value="achievements">Achievements</TabsTrigger>
					</TabsList>

					{/* Time Range Selector */}
					<div className="flex justify-between items-center">
						<h2 className="text-lg font-semibold">Analytics Dashboard</h2>
						<Select value={selectedTimeRange} onValueChange={(value) => setSelectedTimeRange(value as TimeRange)}>
							<SelectTrigger className="w-32">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="week">This Week</SelectItem>
								<SelectItem value="month">This Month</SelectItem>
								<SelectItem value="quarter">This Quarter</SelectItem>
								<SelectItem value="year">This Year</SelectItem>
								<SelectItem value="all">All Time</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<TabsContent value="overview" className="space-y-4">
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
							{/* Study Activity Chart */}
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<Activity className="h-5 w-5" />
										Study Activity
									</CardTitle>
									<CardDescription>
										Your learning activity over time
									</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										<div className="flex justify-between items-center">
											<span className="text-sm">Study Sessions</span>
											<span className="font-medium">{filteredStats.quizzes.length}</span>
										</div>
										<div className="flex justify-between items-center">
											<span className="text-sm">Study Time</span>
											<span className="font-medium">{formatTime(filteredStats.totalStudyTime)}</span>
										</div>
										<div className="flex justify-between items-center">
											<span className="text-sm">Active Pathways</span>
											<span className="font-medium">{filteredStats.pathways.length}</span>
										</div>
									</div>
								</CardContent>
							</Card>

							{/* Performance Summary */}
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<TrendingUp className="h-5 w-5" />
										Performance Summary
									</CardTitle>
									<CardDescription>
										Your learning performance metrics
									</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										<div>
											<div className="flex justify-between items-center mb-2">
												<span className="text-sm">Average Score</span>
												<span className="font-medium">{Math.round(learningStats.averageScore)}%</span>
											</div>
											<Progress value={learningStats.averageScore} />
										</div>
										<div className="flex justify-between items-center">
											<span className="text-sm">Current Streak</span>
											<div className="flex items-center gap-2">
												<TrendingUp className="h-4 w-4 text-orange-500" />
												<span className="font-medium">{learningStats.currentStreak} days</span>
											</div>
										</div>
										<div className="flex justify-between items-center">
											<span className="text-sm">Best Streak</span>
											<div className="flex items-center gap-2">
												<Trophy className="h-4 w-4 text-yellow-500" />
												<span className="font-medium">{learningStats.longestStreak} days</span>
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						</div>

						{/* Strengths and Weaknesses */}
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
							<Card>
								<CardHeader>
									<CardTitle className="text-green-700 flex items-center gap-2">
										<CheckCircle className="h-5 w-5" />
										Strong Areas
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="space-y-2">
										{learningStats.strongAreas.slice(0, 5).map((area, index) => (
											<div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded">
												<span className="text-sm">{area}</span>
												<Badge variant="secondary" className="bg-green-100 text-green-800">
													Strong
												</Badge>
											</div>
										))}
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle className="text-orange-700 flex items-center gap-2">
										<Target className="h-5 w-5" />
										Areas for Improvement
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="space-y-2">
										{learningStats.weakAreas.slice(0, 5).map((area, index) => (
											<div key={index} className="flex items-center justify-between p-2 bg-orange-50 rounded">
												<span className="text-sm">{area}</span>
												<Badge variant="secondary" className="bg-orange-100 text-orange-800">
													Focus
												</Badge>
											</div>
										))}
									</div>
								</CardContent>
							</Card>
						</div>
					</TabsContent>

					<TabsContent value="pathways" className="space-y-4">
						<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
							{/* Pathway Progress Overview */}
							<Card>
								<CardHeader>
									<CardTitle>Pathway Progress</CardTitle>
									<CardDescription>Your progress across all learning pathways</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										<div className="flex justify-between items-center">
											<span className="text-sm">Completed</span>
											<span className="font-medium text-green-600">{pathwayStats.completed}</span>
										</div>
										<div className="flex justify-between items-center">
											<span className="text-sm">In Progress</span>
											<span className="font-medium text-blue-600">{pathwayStats.inProgress}</span>
										</div>
										<div className="flex justify-between items-center">
											<span className="text-sm">Not Started</span>
											<span className="font-medium text-muted-foreground">{pathwayStats.notStarted}</span>
										</div>
									</div>
								</CardContent>
							</Card>

							{/* Category Progress */}
							<Card>
								<CardHeader>
									<CardTitle>By Category</CardTitle>
									<CardDescription>Progress across supplement categories</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="space-y-3">
										{Object.entries(pathwayStats.categoryProgress).map(([category, progress]) => (
											<div key={category}>
												<div className="flex justify-between items-center mb-1">
													<span className="text-sm capitalize">
														{category.replace('_', ' ')}
													</span>
													<span className="text-sm font-medium">{Math.round(progress)}%</span>
												</div>
												<Progress value={progress} className="h-2" />
											</div>
										))}
									</div>
								</CardContent>
							</Card>

							{/* Recent Activity */}
							<Card>
								<CardHeader>
									<CardTitle>Recent Activity</CardTitle>
									<CardDescription>Your latest learning activities</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="space-y-3">
										{pathwayProgress
											.sort((a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime())
											.slice(0, 5)
											.map((progress) => {
												const pathway = learningPathways.find(p => p.id === progress.pathwayId);
												return (
													<div key={progress.pathwayId} className="flex items-center justify-between p-2 border rounded">
														<div>
															<p className="text-sm font-medium">{pathway?.title}</p>
															<p className="text-xs text-muted-foreground">
																{formatDate(progress.lastActivity)}
															</p>
														</div>
														<Badge variant={progress.overallProgress >= 100 ? 'default' : 'secondary'}>
															{Math.round(progress.overallProgress)}%
														</Badge>
													</div>
												);
											})}
									</div>
								</CardContent>
							</Card>
						</div>
					</TabsContent>

					<TabsContent value="performance" className="space-y-4">
						<Card>
							<CardHeader>
								<CardTitle>Quiz Performance History</CardTitle>
								<CardDescription>Your quiz scores and trends over time</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									{quizHistory.slice(0, 10).map((quiz, index) => (
										<div key={quiz.id} className="flex items-center justify-between p-3 border rounded">
											<div>
												<p className="text-sm font-medium">Quiz #{quizHistory.length - index}</p>
												<p className="text-xs text-muted-foreground">
													{formatDate(quiz.startTime)} • {formatTime(quiz.timeSpent)}
												</p>
											</div>
											<div className="flex items-center gap-3">
												<div className="text-right">
													<div className="text-sm font-medium">{quiz.score}%</div>
													<div className="text-xs text-muted-foreground">
														{quiz.earnedPoints}/{quiz.totalPoints}
													</div>
												</div>
												<Badge variant={quiz.passed ? 'default' : 'destructive'}>
													{quiz.passed ? 'Passed' : 'Failed'}
												</Badge>
											</div>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="achievements" className="space-y-4">
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Award className="h-5 w-5" />
									Achievements & Badges
								</CardTitle>
								<CardDescription>
									Your learning achievements and milestones
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
									{userProgress.achievements.map((achievement) => (
										<div key={achievement.id} className="flex items-center gap-3 p-3 border rounded-lg">
											<div className="text-2xl">{achievement.icon}</div>
											<div>
												<h4 className="font-medium text-sm">{achievement.name}</h4>
												<p className="text-xs text-muted-foreground">
													{achievement.description}
												</p>
												<p className="text-xs text-muted-foreground">
													Earned {formatDate(achievement.unlockedAt)}
												</p>
											</div>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			)}

			{/* Action Buttons */}
			<Card>
				<CardContent className="pt-6">
					<div className="flex justify-center gap-3">
						<Button variant="outline" onClick={onExportProgress}>
							<Download className="h-4 w-4 mr-2" />
							Export Progress
						</Button>
						<Button variant="outline" onClick={onShareProgress}>
							<Share className="h-4 w-4 mr-2" />
							Share Progress
						</Button>
						<Button variant="outline">
							<Settings className="h-4 w-4 mr-2" />
							Learning Goals
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

// Helper functions
function calculateCurrentStreak(quizHistory: QuizResult[]): number {
	if (quizHistory.length === 0) return 0;

	const sortedQuizzes = quizHistory.sort((a, b) =>
		new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
	);

	let streak = 0;
	let currentDate = new Date();

	for (const quiz of sortedQuizzes) {
		const quizDate = new Date(quiz.startTime);
		const daysDiff = Math.floor((currentDate.getTime() - quizDate.getTime()) / (1000 * 60 * 60 * 24));

		if (daysDiff === streak) {
			streak++;
			currentDate = quizDate;
		} else {
			break;
		}
	}

	return streak;
}

function calculateLongestStreak(quizHistory: QuizResult[]): number {
	if (quizHistory.length === 0) return 0;

	// Group quizzes by date
	const quizDates = quizHistory.map(quiz => {
		const date = new Date(quiz.startTime);
		return date.toDateString();
	});

	const uniqueDates = [...new Set(quizDates)].sort();

	let longestStreak = 1;
	let currentStreak = 1;

	for (let i = 1; i < uniqueDates.length; i++) {
		const prevDate = new Date(uniqueDates[i - 1] || '');
		const currentDate = new Date(uniqueDates[i] || '');
		const daysDiff = Math.floor((currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));

		if (daysDiff === 1) {
			currentStreak++;
			longestStreak = Math.max(longestStreak, currentStreak);
		} else {
			currentStreak = 1;
		}
	}

	return longestStreak;
}

function identifyWeakAreas(quizHistory: QuizResult[], pathwayProgress: UserPathwayProgress[]): string[] {
	// Simple implementation - could be enhanced with more sophisticated analysis
	const weakAreas: string[] = [];

	// Find quizzes with low scores
	const lowScoreQuizzes = quizHistory.filter(quiz => quiz.score < 70);
	if (lowScoreQuizzes.length > quizHistory.length * 0.3) {
		weakAreas.push('Quiz Performance');
	}

	// Find incomplete pathways
	const incompletePathways = pathwayProgress.filter(p => p.overallProgress < 50);
	if (incompletePathways.length > 0) {
		weakAreas.push('Pathway Completion');
	}

	return weakAreas;
}

function identifyStrongAreas(quizHistory: QuizResult[], pathwayProgress: UserPathwayProgress[]): string[] {
	// Simple implementation - could be enhanced with more sophisticated analysis
	const strongAreas: string[] = [];

	// Find quizzes with high scores
	const highScoreQuizzes = quizHistory.filter(quiz => quiz.score >= 90);
	if (highScoreQuizzes.length > quizHistory.length * 0.5) {
		strongAreas.push('Quiz Performance');
	}

	// Find completed pathways
	const completedPathways = pathwayProgress.filter(p => p.certificateEarned);
	if (completedPathways.length > 0) {
		strongAreas.push('Pathway Completion');
	}

	return strongAreas;
}