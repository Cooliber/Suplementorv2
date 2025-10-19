"use client";

import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
	Activity,
	BookOpen,
	Calendar,
	Clock,
	Fire,
	Star,
	Target,
	TrendingUp,
	Trophy,
	Zap,
} from "lucide-react";

interface LearningStreak {
	current: number;
	longest: number;
	lastActivityDate: Date;
}

interface ModuleProgress {
	moduleId: string;
	title: string;
	category: string;
	progress: number;
	timeSpent: number;
	lastAccessed: Date;
	difficulty: "beginner" | "intermediate" | "advanced";
	status: "not_started" | "in_progress" | "completed";
	quizScore?: number;
}

interface DailyProgress {
	date: string;
	minutesSpent: number;
	modulesCompleted: number;
	quizScore: number;
	streakDay: boolean;
}

interface Achievement {
	id: string;
	title: string;
	description: string;
	icon: React.ComponentType<{ className?: string }>;
	unlockedAt?: Date;
	progress?: number;
	total?: number;
	category: "learning" | "consistency" | "mastery" | "social";
}

interface ProgressTrackingDashboardProps {
	userId?: string;
	className?: string;
}

export function ProgressTrackingDashboard({
	userId,
	className,
}: ProgressTrackingDashboardProps) {
	// Mock data - in real app, this would come from API/database
	const [streak, setStreak] = React.useState<LearningStreak>({
		current: 7,
		longest: 14,
		lastActivityDate: new Date(),
	});

	const [modules, setModules] = React.useState<ModuleProgress[]>([
		{
			moduleId: "1",
			title: "Neuroprzekaźniki w mózgu",
			category: "Neurobiologia",
			progress: 85,
			timeSpent: 45,
			lastAccessed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
			difficulty: "intermediate",
			status: "in_progress",
			quizScore: 78,
		},
		{
			moduleId: "2",
			title: "Suplementacja w sporcie",
			category: "Sport",
			progress: 100,
			timeSpent: 32,
			lastAccessed: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
			difficulty: "beginner",
			status: "completed",
			quizScore: 92,
		},
		{
			moduleId: "3",
			title: "Zaawansowane mechanizmy działania",
			category: "Farmakologia",
			progress: 23,
			timeSpent: 18,
			lastAccessed: new Date(),
			difficulty: "advanced",
			status: "in_progress",
		},
	]);

	const [dailyProgress, setDailyProgress] = React.useState<DailyProgress[]>([
		{
			date: "2024-01-15",
			minutesSpent: 45,
			modulesCompleted: 1,
			quizScore: 78,
			streakDay: true,
		},
		{
			date: "2024-01-14",
			minutesSpent: 32,
			modulesCompleted: 0,
			quizScore: 0,
			streakDay: true,
		},
		{
			date: "2024-01-13",
			minutesSpent: 67,
			modulesCompleted: 2,
			quizScore: 85,
			streakDay: true,
		},
		{
			date: "2024-01-12",
			minutesSpent: 23,
			modulesCompleted: 0,
			quizScore: 0,
			streakDay: true,
		},
		{
			date: "2024-01-11",
			minutesSpent: 41,
			modulesCompleted: 1,
			quizScore: 92,
			streakDay: true,
		},
		{
			date: "2024-01-10",
			minutesSpent: 38,
			modulesCompleted: 1,
			quizScore: 88,
			streakDay: true,
		},
		{
			date: "2024-01-09",
			minutesSpent: 55,
			modulesCompleted: 1,
			quizScore: 76,
			streakDay: true,
		},
	]);

	const [achievements, setAchievements] = React.useState<Achievement[]>([
		{
			id: "1",
			title: "Pierwszy tydzień",
			description: "Ucz się przez 7 dni z rzędu",
			icon: Calendar,
			unlockedAt: new Date(),
			category: "consistency",
		},
		{
			id: "2",
			title: "Mistrz quizów",
			description: "Uzyskaj średnio 90% w quizach",
			icon: Trophy,
			progress: 85,
			total: 90,
			category: "mastery",
		},
		{
			id: "3",
			title: "Maratończyk nauki",
			description: "Spędź 100 godzin na nauce",
			icon: Clock,
			progress: 67,
			total: 100,
			category: "learning",
		},
		{
			id: "4",
			title: "Społecznościowy",
			description: "Podziel się 5 postępami",
			icon: Star,
			progress: 3,
			total: 5,
			category: "social",
		},
	]);

	const totalTimeSpent = modules.reduce(
		(sum, module) => sum + module.timeSpent,
		0,
	);
	const completedModules = modules.filter(
		(m) => m.status === "completed",
	).length;
	const averageQuizScore = modules
		.filter((m) => m.quizScore)
		.reduce((sum, m, _, arr) => sum + (m.quizScore || 0) / arr.length, 0);

	const getDifficultyColor = (difficulty: string) => {
		switch (difficulty) {
			case "beginner":
				return "bg-green-100 text-green-800 border-green-200";
			case "intermediate":
				return "bg-yellow-100 text-yellow-800 border-yellow-200";
			case "advanced":
				return "bg-red-100 text-red-800 border-red-200";
			default:
				return "bg-gray-100 text-gray-800 border-gray-200";
		}
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "completed":
				return "bg-green-100 text-green-800";
			case "in_progress":
				return "bg-blue-100 text-blue-800";
			case "not_started":
				return "bg-gray-100 text-gray-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const formatTime = (minutes: number) => {
		const hours = Math.floor(minutes / 60);
		const mins = minutes % 60;
		if (hours > 0) {
			return `${hours}h ${mins}m`;
		}
		return `${mins}m`;
	};

	const formatDate = (date: Date) => {
		return date.toLocaleDateString("pl-PL", {
			day: "numeric",
			month: "short",
		});
	};

	return (
		<div className={cn("w-full space-y-6", className)}>
			{/* Header */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<TrendingUp className="h-5 w-5" />
						Panel Postępów Nauki
					</CardTitle>
					<CardDescription>
						Śledź swoje postępy, zdobywaj osiągnięcia i utrzymuj passę nauki
					</CardDescription>
				</CardHeader>
			</Card>

			{/* Stats Overview */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="font-medium text-sm">
							Aktualna passa
						</CardTitle>
						<Fire className="h-4 w-4 text-orange-500" />
					</CardHeader>
					<CardContent>
						<div className="font-bold text-2xl">{streak.current} dni</div>
						<p className="text-muted-foreground text-xs">
							Najdłuższa: {streak.longest} dni
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="font-medium text-sm">
							Ukończone moduły
						</CardTitle>
						<BookOpen className="h-4 w-4 text-blue-500" />
					</CardHeader>
					<CardContent>
						<div className="font-bold text-2xl">{completedModules}</div>
						<p className="text-muted-foreground text-xs">
							z {modules.length} wszystkich
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="font-medium text-sm">Czas nauki</CardTitle>
						<Clock className="h-4 w-4 text-green-500" />
					</CardHeader>
					<CardContent>
						<div className="font-bold text-2xl">
							{formatTime(totalTimeSpent)}
						</div>
						<p className="text-muted-foreground text-xs">
							łączny czas spędzony
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="font-medium text-sm">
							Średnia quizów
						</CardTitle>
						<Target className="h-4 w-4 text-purple-500" />
					</CardHeader>
					<CardContent>
						<div className="font-bold text-2xl">
							{averageQuizScore ? Math.round(averageQuizScore) : 0}%
						</div>
						<p className="text-muted-foreground text-xs">
							średni wynik w quizach
						</p>
					</CardContent>
				</Card>
			</div>

			<Tabs defaultValue="modules" className="space-y-4">
				<TabsList>
					<TabsTrigger value="modules">Moduły</TabsTrigger>
					<TabsTrigger value="activity">Aktywność</TabsTrigger>
					<TabsTrigger value="achievements">Osiągnięcia</TabsTrigger>
				</TabsList>

				{/* Modules Tab */}
				<TabsContent value="modules" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>Postęp w modułach</CardTitle>
							<CardDescription>
								Śledź swoje postępy w poszczególnych modułach nauki
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							{modules.map((module) => (
								<div key={module.moduleId} className="space-y-2">
									<div className="flex items-center justify-between">
										<div className="flex-1">
											<h4 className="font-medium">{module.title}</h4>
											<div className="mt-1 flex items-center gap-2">
												<Badge
													variant="outline"
													className={getDifficultyColor(module.difficulty)}
												>
													{module.difficulty}
												</Badge>
												<Badge className={getStatusColor(module.status)}>
													{module.status === "completed"
														? "Ukończony"
														: module.status === "in_progress"
															? "W trakcie"
															: "Nie rozpoczęty"}
												</Badge>
												<span className="text-muted-foreground text-sm">
													{module.category}
												</span>
											</div>
										</div>
										<div className="text-right">
											<div className="font-medium text-sm">
												{module.progress}%
											</div>
											<div className="text-muted-foreground text-xs">
												{formatTime(module.timeSpent)}
											</div>
										</div>
									</div>
									<Progress value={module.progress} className="h-2" />
									{module.quizScore && (
										<div className="flex items-center justify-between text-sm">
											<span>Ostatni quiz: {module.quizScore}%</span>
											<span>
												Ostatnia aktywność: {formatDate(module.lastAccessed)}
											</span>
										</div>
									)}
								</div>
							))}
						</CardContent>
					</Card>
				</TabsContent>

				{/* Activity Tab */}
				<TabsContent value="activity" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>Aktywność dzienna</CardTitle>
							<CardDescription>
								Twoja aktywność nauki w ciągu ostatnich dni
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-3">
								{dailyProgress.slice(0, 7).map((day, index) => (
									<div key={day.date} className="flex items-center gap-4">
										<div className="w-12 text-muted-foreground text-sm">
											{formatDate(new Date(day.date))}
										</div>
										<div className="flex-1 space-y-1">
											<div className="flex items-center justify-between text-sm">
												<span>{formatTime(day.minutesSpent)}</span>
												<span>{day.modulesCompleted} modułów</span>
											</div>
											<Progress
												value={(day.minutesSpent / 60) * 100}
												className="h-1"
											/>
										</div>
										{day.streakDay && (
											<Fire className="h-4 w-4 text-orange-500" />
										)}
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Achievements Tab */}
				<TabsContent value="achievements" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>Osiągnięcia</CardTitle>
							<CardDescription>
								Zdobądź odznaki za swoje postępy w nauce
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="grid gap-4 md:grid-cols-2">
								{achievements.map((achievement) => {
									const IconComponent = achievement.icon;
									const isUnlocked = !!achievement.unlockedAt;
									const progress = achievement.progress || 0;
									const total = achievement.total || 100;

									return (
										<Card
											key={achievement.id}
											className={cn(
												"relative",
												isUnlocked && "ring-2 ring-primary/20",
											)}
										>
											<CardContent className="p-4">
												<div className="flex items-start gap-3">
													<div
														className={cn(
															"rounded-full p-2",
															isUnlocked
																? "bg-primary/10 text-primary"
																: "bg-muted text-muted-foreground",
														)}
													>
														<IconComponent className="h-4 w-4" />
													</div>
													<div className="flex-1 space-y-2">
														<div>
															<h4 className="font-medium">
																{achievement.title}
															</h4>
															<p className="text-muted-foreground text-sm">
																{achievement.description}
															</p>
														</div>

														{!isUnlocked && achievement.total && (
															<div className="space-y-1">
																<div className="flex items-center justify-between text-xs">
																	<span>
																		{progress}/{total}
																	</span>
																	<span>
																		{Math.round((progress / total) * 100)}%
																	</span>
																</div>
																<Progress
																	value={(progress / total) * 100}
																	className="h-1"
																/>
															</div>
														)}

														{isUnlocked && achievement.unlockedAt && (
															<Badge variant="outline" className="text-xs">
																Odblokowano {formatDate(achievement.unlockedAt)}
															</Badge>
														)}
													</div>
												</div>
											</CardContent>
										</Card>
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
