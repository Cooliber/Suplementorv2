"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
	addDays,
	eachDayOfInterval,
	endOfWeek,
	format,
	isSameDay,
	startOfWeek,
	subDays,
} from "date-fns";
import { pl } from "date-fns/locale";
import {
	AlertCircle,
	Award,
	BarChart3,
	Brain,
	Calendar as CalendarIcon,
	CheckCircle,
	Clock,
	Edit,
	Flame,
	Lightbulb,
	Plus,
	Target,
	Trash2,
	TrendingDown,
	TrendingUp,
	XCircle,
	Zap,
} from "lucide-react";
import type React from "react";
import { useCallback, useMemo, useState } from "react";

interface HabitFormation {
	id: string;
	userId: string;
	habitType:
		| "SUPPLEMENT_INTAKE"
		| "PRODUCTIVITY_TECHNIQUE"
		| "COGNITIVE_EXERCISE"
		| "LIFESTYLE"
		| "CUSTOM";
	polishHabitType: string;

	habitDetails: {
		name: string;
		polishName: string;
		description: string;
		polishDescription: string;
		targetFrequency: "DAILY" | "WEEKLY" | "MULTIPLE_DAILY" | "CUSTOM";
		polishTargetFrequency: string;
		customFrequency?: string;
		polishCustomFrequency?: string;
		estimatedDuration: number;
		difficulty: "EASY" | "MODERATE" | "HARD" | "VERY_HARD";
		polishDifficulty: string;
	};

	formationStrategy: {
		technique:
			| "HABIT_STACKING"
			| "ENVIRONMENT_DESIGN"
			| "IMPLEMENTATION_INTENTION"
			| "TEMPTATION_BUNDLING"
			| "SOCIAL_ACCOUNTABILITY"
			| "REWARD_SYSTEM";
		polishTechnique: string;
		cue: string;
		polishCue: string;
		routine: string;
		polishRoutine: string;
		reward: string;
		polishReward: string;
		environmentalTriggers: string[];
		polishEnvironmentalTriggers: string[];
	};

	progress: {
		startDate: Date;
		targetCompletionDate: Date;
		currentStreak: number;
		longestStreak: number;
		totalCompletions: number;
		missedDays: number;
		completionRate: number;
		weeklyProgress: Array<{
			week: number;
			completions: number;
			target: number;
			notes: string;
			polishNotes: string;
		}>;
	};

	relatedSupplements: Array<{
		supplementId: string;
		supplementName: string;
		polishSupplementName: string;
		relationship:
			| "SUPPORTS_HABIT"
			| "HABIT_SUPPORTS_SUPPLEMENT"
			| "SYNERGISTIC";
		polishRelationship: string;
	}>;

	relatedTechniques: Array<{
		techniqueId: string;
		techniqueName: string;
		polishTechniqueName: string;
		relationship: "PREREQUISITE" | "COMPLEMENTARY" | "ADVANCED_VERSION";
		polishRelationship: string;
	}>;

	insights: {
		bestPerformanceTimes: string[];
		polishBestPerformanceTimes: string[];
		challengingScenarios: string[];
		polishChallengingScenarios: string[];
		motivationalFactors: string[];
		polishMotivationalFactors: string[];
		barriers: string[];
		polishBarriers: string[];
	};

	isActive: boolean;
	lastUpdated: Date;
	completedAt?: Date;
}

interface HabitCompletion {
	id: string;
	habitId: string;
	date: Date;
	completed: boolean;
	notes?: string;
	polishNotes?: string;
	mood: number; // 1-5
	energy: number; // 1-5
	difficulty: number; // 1-5
	satisfaction: number; // 1-5
}

interface HabitFormationTrackerProps {
	habits: HabitFormation[];
	completions: HabitCompletion[];
	onHabitCreate: (habit: Partial<HabitFormation>) => void;
	onHabitUpdate: (habitId: string, updates: Partial<HabitFormation>) => void;
	onHabitDelete: (habitId: string) => void;
	onCompletionToggle: (
		habitId: string,
		date: Date,
		completed: boolean,
		notes?: string,
	) => void;
	onCompletionUpdate: (
		completionId: string,
		updates: Partial<HabitCompletion>,
	) => void;
	className?: string;
}

const HabitFormationTracker: React.FC<HabitFormationTrackerProps> = ({
	habits,
	completions,
	onHabitCreate,
	onHabitUpdate,
	onHabitDelete,
	onCompletionToggle,
	onCompletionUpdate,
	className = "",
}) => {
	const [selectedDate, setSelectedDate] = useState<Date>(new Date());
	const [selectedHabit, setSelectedHabit] = useState<string | null>(null);
	const [showCreateForm, setShowCreateForm] = useState(false);
	const [viewMode, setViewMode] = useState<"daily" | "weekly" | "monthly">(
		"weekly",
	);

	// Calculate current week
	const currentWeek = useMemo(() => {
		const start = startOfWeek(selectedDate, { locale: pl });
		const end = endOfWeek(selectedDate, { locale: pl });
		return eachDayOfInterval({ start, end });
	}, [selectedDate]);

	// Get active habits
	const activeHabits = useMemo(() => {
		return habits.filter((habit) => habit.isActive);
	}, [habits]);

	// Calculate habit statistics
	const habitStats = useMemo(() => {
		return activeHabits.map((habit) => {
			const habitCompletions = completions.filter(
				(c) => c.habitId === habit.id,
			);
			const today = new Date();
			const daysSinceStart = Math.floor(
				(today.getTime() - habit.progress.startDate.getTime()) /
					(1000 * 60 * 60 * 24),
			);

			// Calculate current streak
			let currentStreak = 0;
			for (let i = 0; i < daysSinceStart; i++) {
				const checkDate = subDays(today, i);
				const completion = habitCompletions.find((c) =>
					isSameDay(c.date, checkDate),
				);
				if (completion?.completed) {
					currentStreak++;
				} else {
					break;
				}
			}

			// Calculate completion rate
			const totalExpectedCompletions = daysSinceStart;
			const actualCompletions = habitCompletions.filter(
				(c) => c.completed,
			).length;
			const completionRate =
				totalExpectedCompletions > 0
					? (actualCompletions / totalExpectedCompletions) * 100
					: 0;

			return {
				...habit,
				currentStreak,
				completionRate,
				totalCompletions: actualCompletions,
				recentCompletions: habitCompletions.slice(-7),
			};
		});
	}, [activeHabits, completions]);

	// Get completion for specific habit and date
	const getCompletion = useCallback(
		(habitId: string, date: Date) => {
			return completions.find(
				(c) => c.habitId === habitId && isSameDay(c.date, date),
			);
		},
		[completions],
	);

	// Handle habit completion toggle
	const handleCompletionToggle = useCallback(
		(habitId: string, date: Date) => {
			const existing = getCompletion(habitId, date);
			onCompletionToggle(habitId, date, !existing?.completed);
		},
		[getCompletion, onCompletionToggle],
	);

	// Get difficulty color
	const getDifficultyColor = (difficulty: string) => {
		switch (difficulty) {
			case "EASY":
				return "bg-green-100 text-green-800";
			case "MODERATE":
				return "bg-yellow-100 text-yellow-800";
			case "HARD":
				return "bg-orange-100 text-orange-800";
			case "VERY_HARD":
				return "bg-red-100 text-red-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const getDifficultyText = (difficulty: string) => {
		switch (difficulty) {
			case "EASY":
				return "Łatwy";
			case "MODERATE":
				return "Umiarkowany";
			case "HARD":
				return "Trudny";
			case "VERY_HARD":
				return "Bardzo trudny";
			default:
				return difficulty;
		}
	};

	const getHabitTypeIcon = (type: string) => {
		switch (type) {
			case "SUPPLEMENT_INTAKE":
				return <Zap className="h-4 w-4" />;
			case "PRODUCTIVITY_TECHNIQUE":
				return <Target className="h-4 w-4" />;
			case "COGNITIVE_EXERCISE":
				return <Brain className="h-4 w-4" />;
			case "LIFESTYLE":
				return <CheckCircle className="h-4 w-4" />;
			default:
				return <Target className="h-4 w-4" />;
		}
	};

	const getStreakIcon = (streak: number) => {
		if (streak >= 30) return <Award className="h-4 w-4 text-gold-600" />;
		if (streak >= 7) return <Flame className="h-4 w-4 text-orange-600" />;
		if (streak >= 3) return <TrendingUp className="h-4 w-4 text-green-600" />;
		return <Target className="h-4 w-4 text-gray-600" />;
	};

	const renderHabitCard = (habitStat: any) => {
		const habit = habitStat;

		return (
			<Card
				key={habit.id}
				className="transition-shadow duration-200 hover:shadow-lg"
			>
				<CardHeader className="pb-4">
					<div className="flex items-start justify-between">
						<div className="flex-1">
							<div className="mb-2 flex items-center gap-2">
								{getHabitTypeIcon(habit.habitType)}
								<Badge
									className={getDifficultyColor(habit.habitDetails.difficulty)}
								>
									{getDifficultyText(habit.habitDetails.difficulty)}
								</Badge>
								<Badge variant="outline">
									{habit.habitDetails.polishTargetFrequency}
								</Badge>
							</div>

							<CardTitle className="mb-2 text-lg">
								{habit.habitDetails.polishName}
							</CardTitle>
							<p className="text-gray-600 text-sm">
								{habit.habitDetails.polishDescription}
							</p>

							<div className="mt-3 flex items-center gap-4 text-sm">
								<div className="flex items-center gap-1">
									{getStreakIcon(habit.currentStreak)}
									<span>{habit.currentStreak} dni z rzędu</span>
								</div>
								<div className="flex items-center gap-1">
									<BarChart3 className="h-4 w-4 text-blue-600" />
									<span>{Math.round(habit.completionRate)}% wykonania</span>
								</div>
								<div className="flex items-center gap-1">
									<Clock className="h-4 w-4 text-purple-600" />
									<span>{habit.habitDetails.estimatedDuration} min</span>
								</div>
							</div>
						</div>

						<div className="ml-4 flex flex-col gap-2">
							<Button
								variant="outline"
								size="sm"
								onClick={() =>
									setSelectedHabit(selectedHabit === habit.id ? null : habit.id)
								}
							>
								{selectedHabit === habit.id ? "Zwiń" : "Rozwiń"}
							</Button>
						</div>
					</div>

					{/* Progress bar */}
					<div className="mt-4">
						<div className="mb-2 flex items-center justify-between text-sm">
							<span>Postęp tygodniowy</span>
							<span>{Math.round(habit.completionRate)}%</span>
						</div>
						<Progress value={habit.completionRate} className="h-2" />
					</div>
				</CardHeader>

				{selectedHabit === habit.id && (
					<CardContent className="pt-0">
						<Tabs defaultValue="tracking" className="w-full">
							<TabsList className="grid w-full grid-cols-4">
								<TabsTrigger value="tracking" className="text-xs">
									Śledzenie
								</TabsTrigger>
								<TabsTrigger value="strategy" className="text-xs">
									Strategia
								</TabsTrigger>
								<TabsTrigger value="insights" className="text-xs">
									Spostrzeżenia
								</TabsTrigger>
								<TabsTrigger value="connections" className="text-xs">
									Powiązania
								</TabsTrigger>
							</TabsList>

							<TabsContent value="tracking" className="mt-4">
								<div className="space-y-4">
									{/* Weekly calendar */}
									<div>
										<h4 className="mb-3 font-medium text-sm">
											Kalendarz tygodniowy
										</h4>
										<div className="grid grid-cols-7 gap-2">
											{currentWeek.map((day) => {
												const completion = getCompletion(habit.id, day);
												const isToday = isSameDay(day, new Date());
												const isFuture = day > new Date();

												return (
													<div key={day.toISOString()} className="text-center">
														<div className="mb-1 text-gray-600 text-xs">
															{format(day, "EEE", { locale: pl })}
														</div>
														<Button
															variant={
																completion?.completed ? "default" : "outline"
															}
															size="sm"
															className={cn(
																"h-12 w-full p-0",
																isToday && "ring-2 ring-blue-500",
																isFuture && "cursor-not-allowed opacity-50",
																completion?.completed &&
																	"bg-green-600 hover:bg-green-700",
															)}
															onClick={() =>
																!isFuture &&
																handleCompletionToggle(habit.id, day)
															}
															disabled={isFuture}
														>
															<div>
																<div className="font-medium text-xs">
																	{format(day, "d")}
																</div>
																{completion?.completed && (
																	<CheckCircle className="mx-auto h-3 w-3" />
																)}
															</div>
														</Button>
													</div>
												);
											})}
										</div>
									</div>

									{/* Quick stats */}
									<div className="grid grid-cols-3 gap-4">
										<div className="rounded-lg bg-blue-50 p-3 text-center">
											<div className="font-bold text-2xl text-blue-600">
												{habit.currentStreak}
											</div>
											<div className="text-blue-700 text-xs">
												Aktualna passa
											</div>
										</div>
										<div className="rounded-lg bg-green-50 p-3 text-center">
											<div className="font-bold text-2xl text-green-600">
												{habit.totalCompletions}
											</div>
											<div className="text-green-700 text-xs">
												Łącznie wykonań
											</div>
										</div>
										<div className="rounded-lg bg-purple-50 p-3 text-center">
											<div className="font-bold text-2xl text-purple-600">
												{Math.round(
													(habit.totalCompletions *
														habit.habitDetails.estimatedDuration) /
														60,
												)}
												h
											</div>
											<div className="text-purple-700 text-xs">
												Czas poświęcony
											</div>
										</div>
									</div>
								</div>
							</TabsContent>

							<TabsContent value="strategy" className="mt-4">
								<div className="space-y-4">
									<div>
										<h4 className="mb-2 font-medium text-sm">
											Strategia tworzenia nawyku
										</h4>
										<Badge variant="outline" className="mb-3">
											{habit.formationStrategy.polishTechnique}
										</Badge>

										<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
											<div className="rounded-lg border p-3">
												<h5 className="mb-1 font-medium text-blue-800 text-sm">
													Wskazówka
												</h5>
												<p className="text-gray-700 text-sm">
													{habit.formationStrategy.polishCue}
												</p>
											</div>
											<div className="rounded-lg border p-3">
												<h5 className="mb-1 font-medium text-green-800 text-sm">
													Rutyna
												</h5>
												<p className="text-gray-700 text-sm">
													{habit.formationStrategy.polishRoutine}
												</p>
											</div>
											<div className="rounded-lg border p-3">
												<h5 className="mb-1 font-medium text-purple-800 text-sm">
													Nagroda
												</h5>
												<p className="text-gray-700 text-sm">
													{habit.formationStrategy.polishReward}
												</p>
											</div>
										</div>
									</div>

									{habit.formationStrategy.polishEnvironmentalTriggers.length >
										0 && (
										<div>
											<h4 className="mb-2 font-medium text-sm">
												Wyzwalacze środowiskowe
											</h4>
											<div className="flex flex-wrap gap-1">
												{habit.formationStrategy.polishEnvironmentalTriggers.map(
													(trigger: string, index: number) => (
														<Badge
															key={index}
															variant="secondary"
															className="text-xs"
														>
															{trigger}
														</Badge>
													),
												)}
											</div>
										</div>
									)}
								</div>
							</TabsContent>

							<TabsContent value="insights" className="mt-4">
								<div className="space-y-4">
									{habit.insights.polishBestPerformanceTimes.length > 0 && (
										<div>
											<h4 className="mb-2 flex items-center gap-2 font-medium text-sm">
												<TrendingUp className="h-4 w-4 text-green-600" />
												Najlepsze pory wykonania
											</h4>
											<div className="flex flex-wrap gap-1">
												{habit.insights.polishBestPerformanceTimes.map(
													(time: string, index: number) => (
														<Badge
															key={index}
															className="bg-green-100 text-green-800 text-xs"
														>
															{time}
														</Badge>
													),
												)}
											</div>
										</div>
									)}

									{habit.insights.polishChallengingScenarios.length > 0 && (
										<div>
											<h4 className="mb-2 flex items-center gap-2 font-medium text-sm">
												<AlertCircle className="h-4 w-4 text-orange-600" />
												Trudne scenariusze
											</h4>
											<ul className="space-y-1 text-gray-700 text-sm">
												{habit.insights.polishChallengingScenarios.map(
													(scenario: string, index: number) => (
														<li key={index} className="flex items-start gap-2">
															<span className="mt-0.5 text-orange-600">⚠</span>
															{scenario}
														</li>
													),
												)}
											</ul>
										</div>
									)}

									{habit.insights.polishMotivationalFactors.length > 0 && (
										<div>
											<h4 className="mb-2 flex items-center gap-2 font-medium text-sm">
												<Lightbulb className="h-4 w-4 text-yellow-600" />
												Czynniki motywacyjne
											</h4>
											<ul className="space-y-1 text-gray-700 text-sm">
												{habit.insights.polishMotivationalFactors.map(
													(factor: string, index: number) => (
														<li key={index} className="flex items-start gap-2">
															<CheckCircle className="mt-0.5 h-3 w-3 flex-shrink-0 text-green-600" />
															{factor}
														</li>
													),
												)}
											</ul>
										</div>
									)}
								</div>
							</TabsContent>

							<TabsContent value="connections" className="mt-4">
								<div className="space-y-4">
									{habit.relatedSupplements.length > 0 && (
										<div>
											<h4 className="mb-2 font-medium text-sm">
												Powiązane suplementy
											</h4>
											<div className="space-y-2">
												{habit.relatedSupplements.map(
													(supplement: any, index: number) => (
														<div
															key={index}
															className="flex items-center justify-between rounded border p-2"
														>
															<span className="text-sm">
																{supplement.polishSupplementName}
															</span>
															<Badge variant="outline" className="text-xs">
																{supplement.polishRelationship}
															</Badge>
														</div>
													),
												)}
											</div>
										</div>
									)}

									{habit.relatedTechniques.length > 0 && (
										<div>
											<h4 className="mb-2 font-medium text-sm">
												Powiązane techniki
											</h4>
											<div className="space-y-2">
												{habit.relatedTechniques.map(
													(technique: any, index: number) => (
														<div
															key={index}
															className="flex items-center justify-between rounded border p-2"
														>
															<span className="text-sm">
																{technique.polishTechniqueName}
															</span>
															<Badge variant="outline" className="text-xs">
																{technique.polishRelationship}
															</Badge>
														</div>
													),
												)}
											</div>
										</div>
									)}

									{habit.relatedSupplements.length === 0 &&
										habit.relatedTechniques.length === 0 && (
											<div className="py-8 text-center">
												<Target className="mx-auto mb-4 h-12 w-12 text-gray-400" />
												<h4 className="mb-2 font-medium text-gray-900 text-sm">
													Brak powiązań
												</h4>
												<p className="text-gray-600 text-sm">
													Ten nawyk nie ma jeszcze powiązań z suplementami lub
													technikami.
												</p>
											</div>
										)}
								</div>
							</TabsContent>
						</Tabs>
					</CardContent>
				)}
			</Card>
		);
	};

	return (
		<div className={cn("w-full space-y-6", className)}>
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h2 className="font-bold text-2xl">Śledzenie nawyków</h2>
					<p className="text-gray-600">
						Buduj trwałe nawyki wykorzystując psychologię i wsparcie suplementów
					</p>
				</div>
				<div className="flex items-center gap-2">
					<Badge variant="outline">
						{activeHabits.length} aktywnych nawyków
					</Badge>
					<Button onClick={() => setShowCreateForm(true)}>
						<Plus className="mr-2 h-4 w-4" />
						Nowy nawyk
					</Button>
				</div>
			</div>

			{/* Date Navigation */}
			<Card>
				<CardContent className="p-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							<Popover>
								<PopoverTrigger asChild>
									<Button variant="outline" className="flex items-center gap-2">
										<CalendarIcon className="h-4 w-4" />
										{format(selectedDate, "PPP", { locale: pl })}
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-auto p-0">
									<Calendar
										mode="single"
										selected={selectedDate}
										onSelect={(date) => date && setSelectedDate(date)}
										locale={pl}
									/>
								</PopoverContent>
							</Popover>

							<div className="flex items-center gap-2">
								<Button
									variant="outline"
									size="sm"
									onClick={() => setSelectedDate(subDays(selectedDate, 7))}
								>
									← Poprzedni tydzień
								</Button>
								<Button
									variant="outline"
									size="sm"
									onClick={() => setSelectedDate(addDays(selectedDate, 7))}
								>
									Następny tydzień →
								</Button>
							</div>
						</div>

						<div className="flex items-center gap-2">
							<Select
								value={viewMode}
								onValueChange={(value: any) => setViewMode(value)}
							>
								<SelectTrigger className="w-32">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="daily">Dzienny</SelectItem>
									<SelectItem value="weekly">Tygodniowy</SelectItem>
									<SelectItem value="monthly">Miesięczny</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Habits List */}
			<div className="space-y-4">
				{habitStats.length > 0 ? (
					habitStats.map(renderHabitCard)
				) : (
					<Card>
						<CardContent className="flex items-center justify-center py-12">
							<div className="text-center">
								<Target className="mx-auto mb-4 h-12 w-12 text-gray-400" />
								<h3 className="mb-2 font-medium text-gray-900 text-lg">
									Brak aktywnych nawyków
								</h3>
								<p className="mb-4 text-gray-600">
									Rozpocznij budowanie nawyków, które wspomogą twój rozwój
									osobisty.
								</p>
								<Button onClick={() => setShowCreateForm(true)}>
									<Plus className="mr-2 h-4 w-4" />
									Stwórz pierwszy nawyk
								</Button>
							</div>
						</CardContent>
					</Card>
				)}
			</div>

			{/* Overall Progress Summary */}
			{habitStats.length > 0 && (
				<Card>
					<CardHeader>
						<CardTitle className="text-lg">Podsumowanie postępów</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-1 gap-4 md:grid-cols-4">
							<div className="rounded-lg bg-blue-50 p-4 text-center">
								<div className="font-bold text-2xl text-blue-600">
									{Math.round(
										habitStats.reduce((sum, h) => sum + h.completionRate, 0) /
											habitStats.length,
									)}
									%
								</div>
								<div className="text-blue-700 text-sm">Średnie wykonanie</div>
							</div>

							<div className="rounded-lg bg-green-50 p-4 text-center">
								<div className="font-bold text-2xl text-green-600">
									{Math.max(...habitStats.map((h) => h.currentStreak))}
								</div>
								<div className="text-green-700 text-sm">Najdłuższa passa</div>
							</div>

							<div className="rounded-lg bg-purple-50 p-4 text-center">
								<div className="font-bold text-2xl text-purple-600">
									{habitStats.reduce((sum, h) => sum + h.totalCompletions, 0)}
								</div>
								<div className="text-purple-700 text-sm">Łączne wykonania</div>
							</div>

							<div className="rounded-lg bg-orange-50 p-4 text-center">
								<div className="font-bold text-2xl text-orange-600">
									{Math.round(
										habitStats.reduce(
											(sum, h) =>
												sum +
												h.totalCompletions * h.habitDetails.estimatedDuration,
											0,
										) / 60,
									)}
									h
								</div>
								<div className="text-orange-700 text-sm">Czas poświęcony</div>
							</div>
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
};

export default HabitFormationTracker;
