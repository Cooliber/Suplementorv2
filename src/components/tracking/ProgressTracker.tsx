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
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import {
	Activity,
	AlertCircle,
	BarChart3,
	Brain,
	Calendar as CalendarIcon,
	CheckCircle,
	Clock,
	Edit,
	Heart,
	LineChart,
	Moon,
	PieChart,
	Plus,
	Save,
	Star,
	Target,
	TrendingDown,
	TrendingUp,
	X,
	Zap,
} from "lucide-react";
import type React from "react";
import { useCallback, useMemo, useState } from "react";

interface ProgressEntry {
	id: string;
	date: Date;
	category: "COGNITIVE" | "PHYSICAL" | "MOOD" | "SLEEP" | "ENERGY" | "GENERAL";
	polishCategory: string;
	metric: string;
	polishMetric: string;
	value: number;
	maxValue: number;
	unit: string;
	polishUnit: string;
	notes: string;
	polishNotes: string;
	supplements: Array<{
		name: string;
		polishName: string;
		dosage: string;
		timing: string;
		polishTiming: string;
	}>;
	mood: number; // 1-10 scale
	sideEffects: Array<{
		effect: string;
		polishEffect: string;
		severity: "MILD" | "MODERATE" | "SEVERE";
		polishSeverity: string;
	}>;
}

interface Goal {
	id: string;
	title: string;
	polishTitle: string;
	description: string;
	polishDescription: string;
	category: "COGNITIVE" | "PHYSICAL" | "MOOD" | "SLEEP" | "ENERGY" | "GENERAL";
	polishCategory: string;
	targetValue: number;
	currentValue: number;
	unit: string;
	polishUnit: string;
	deadline: Date;
	isActive: boolean;
	createdAt: Date;
}

interface ProgressTrackerProps {
	onProgressUpdate: (entries: ProgressEntry[]) => void;
	onGoalUpdate: (goals: Goal[]) => void;
	className?: string;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({
	onProgressUpdate,
	onGoalUpdate,
	className = "",
}) => {
	const [entries, setEntries] = useState<ProgressEntry[]>([]);
	const [goals, setGoals] = useState<Goal[]>([]);
	const [selectedDate, setSelectedDate] = useState<Date>(new Date());
	const [isAddingEntry, setIsAddingEntry] = useState(false);
	const [isAddingGoal, setIsAddingGoal] = useState(false);
	const [editingGoal, setEditingGoal] = useState<string | null>(null);
	const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
	const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "1y">(
		"30d",
	);

	const [newEntry, setNewEntry] = useState<Partial<ProgressEntry>>({
		category: "COGNITIVE",
		polishCategory: "Poznawcze",
		metric: "",
		polishMetric: "",
		value: 0,
		maxValue: 10,
		unit: "points",
		polishUnit: "punkty",
		notes: "",
		polishNotes: "",
		supplements: [],
		mood: 5,
		sideEffects: [],
	});

	const [newGoal, setNewGoal] = useState<Partial<Goal>>({
		title: "",
		polishTitle: "",
		description: "",
		polishDescription: "",
		category: "COGNITIVE",
		polishCategory: "Poznawcze",
		targetValue: 0,
		currentValue: 0,
		unit: "points",
		polishUnit: "punkty",
		deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
		isActive: true,
	});

	const categories = [
		{
			value: "COGNITIVE",
			label: "Poznawcze",
			icon: <Brain className="h-4 w-4" />,
			color: "bg-blue-100 text-blue-800",
		},
		{
			value: "PHYSICAL",
			label: "Fizyczne",
			icon: <Activity className="h-4 w-4" />,
			color: "bg-green-100 text-green-800",
		},
		{
			value: "MOOD",
			label: "Nastrój",
			icon: <Heart className="h-4 w-4" />,
			color: "bg-pink-100 text-pink-800",
		},
		{
			value: "SLEEP",
			label: "Sen",
			icon: <Moon className="h-4 w-4" />,
			color: "bg-purple-100 text-purple-800",
		},
		{
			value: "ENERGY",
			label: "Energia",
			icon: <Zap className="h-4 w-4" />,
			color: "bg-yellow-100 text-yellow-800",
		},
		{
			value: "GENERAL",
			label: "Ogólne",
			icon: <Target className="h-4 w-4" />,
			color: "bg-gray-100 text-gray-800",
		},
	];

	const getCategoryInfo = (category: string) => {
		return categories.find((cat) => cat.value === category) || categories[0];
	};

	const filteredEntries = useMemo(() => {
		const now = new Date();
		const daysBack = {
			"7d": 7,
			"30d": 30,
			"90d": 90,
			"1y": 365,
		}[timeRange];

		const cutoffDate = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);

		return entries.filter((entry) => {
			const dateMatch = entry.date >= cutoffDate;
			const categoryMatch =
				selectedCategory === "ALL" || entry.category === selectedCategory;
			return dateMatch && categoryMatch;
		});
	}, [entries, timeRange, selectedCategory]);

	const progressStats = useMemo(() => {
		if (filteredEntries.length === 0) return null;

		const avgValue =
			filteredEntries.reduce(
				(sum, entry) => sum + entry.value / entry.maxValue,
				0,
			) / filteredEntries.length;
		const avgMood =
			filteredEntries.reduce((sum, entry) => sum + entry.mood, 0) /
			filteredEntries.length;

		const recentEntries = filteredEntries.slice(-7); // Last 7 entries
		const olderEntries = filteredEntries.slice(-14, -7); // Previous 7 entries

		const recentAvg =
			recentEntries.length > 0
				? recentEntries.reduce(
						(sum, entry) => sum + entry.value / entry.maxValue,
						0,
					) / recentEntries.length
				: 0;
		const olderAvg =
			olderEntries.length > 0
				? olderEntries.reduce(
						(sum, entry) => sum + entry.value / entry.maxValue,
						0,
					) / olderEntries.length
				: 0;

		const trend =
			recentAvg > olderAvg ? "up" : recentAvg < olderAvg ? "down" : "stable";
		const trendPercentage =
			olderAvg > 0 ? ((recentAvg - olderAvg) / olderAvg) * 100 : 0;

		return {
			avgValue: avgValue * 100,
			avgMood,
			trend,
			trendPercentage: Math.abs(trendPercentage),
			totalEntries: filteredEntries.length,
			sideEffectsCount: filteredEntries.reduce(
				(sum, entry) => sum + entry.sideEffects.length,
				0,
			),
		};
	}, [filteredEntries]);

	const goalProgress = useMemo(() => {
		return goals.map((goal) => {
			const relatedEntries = entries.filter(
				(entry) =>
					entry.category === goal.category && entry.date >= goal.createdAt,
			);

			const latestValue =
				relatedEntries.length > 0
					? relatedEntries[relatedEntries.length - 1]?.value || 0
					: goal.currentValue;

			const progress =
				goal.targetValue > 0 ? (latestValue / goal.targetValue) * 100 : 0;
			const daysLeft = Math.ceil(
				(goal.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
			);

			return {
				...goal,
				currentValue: latestValue,
				progress: Math.min(progress, 100),
				daysLeft,
				isOverdue: daysLeft < 0,
				isCompleted: progress >= 100,
			};
		});
	}, [goals, entries]);

	const addEntry = useCallback(() => {
		if (!newEntry.metric || newEntry.value === undefined) return;

		const entry: ProgressEntry = {
			id: `entry_${Date.now()}`,
			date: selectedDate,
			category: newEntry.category!,
			polishCategory: newEntry.polishCategory!,
			metric: newEntry.metric,
			polishMetric: newEntry.polishMetric || newEntry.metric,
			value: newEntry.value,
			maxValue: newEntry.maxValue || 10,
			unit: newEntry.unit || "points",
			polishUnit: newEntry.polishUnit || "punkty",
			notes: newEntry.notes || "",
			polishNotes: newEntry.polishNotes || newEntry.notes || "",
			supplements: newEntry.supplements || [],
			mood: newEntry.mood || 5,
			sideEffects: newEntry.sideEffects || [],
		};

		const updatedEntries = [...entries, entry].sort(
			(a, b) => b.date.getTime() - a.date.getTime(),
		);
		setEntries(updatedEntries);
		onProgressUpdate(updatedEntries);

		// Reset form
		setNewEntry({
			category: "COGNITIVE",
			polishCategory: "Poznawcze",
			metric: "",
			polishMetric: "",
			value: 0,
			maxValue: 10,
			unit: "points",
			polishUnit: "punkty",
			notes: "",
			polishNotes: "",
			supplements: [],
			mood: 5,
			sideEffects: [],
		});
		setIsAddingEntry(false);
	}, [newEntry, selectedDate, entries, onProgressUpdate]);

	const addGoal = useCallback(() => {
		if (!newGoal.title || newGoal.targetValue === undefined) return;

		const goal: Goal = {
			id: `goal_${Date.now()}`,
			title: newGoal.title,
			polishTitle: newGoal.polishTitle || newGoal.title,
			description: newGoal.description || "",
			polishDescription: newGoal.polishDescription || newGoal.description || "",
			category: newGoal.category!,
			polishCategory: newGoal.polishCategory!,
			targetValue: newGoal.targetValue,
			currentValue: newGoal.currentValue || 0,
			unit: newGoal.unit || "points",
			polishUnit: newGoal.polishUnit || "punkty",
			deadline: newGoal.deadline!,
			isActive: true,
			createdAt: new Date(),
		};

		const updatedGoals = [...goals, goal];
		setGoals(updatedGoals);
		onGoalUpdate(updatedGoals);

		// Reset form
		setNewGoal({
			title: "",
			polishTitle: "",
			description: "",
			polishDescription: "",
			category: "COGNITIVE",
			polishCategory: "Poznawcze",
			targetValue: 0,
			currentValue: 0,
			unit: "points",
			polishUnit: "punkty",
			deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
			isActive: true,
		});
		setIsAddingGoal(false);
	}, [newGoal, goals, onGoalUpdate]);

	const updateGoal = useCallback(
		(goalId: string, updates: Partial<Goal>) => {
			const updatedGoals = goals.map((goal) =>
				goal.id === goalId ? { ...goal, ...updates } : goal,
			);
			setGoals(updatedGoals);
			onGoalUpdate(updatedGoals);
			setEditingGoal(null);
		},
		[goals, onGoalUpdate],
	);

	return (
		<div className={cn("w-full space-y-6", className)}>
			{/* Header */}
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<CardTitle className="flex items-center gap-2">
								<BarChart3 className="h-5 w-5 text-blue-600" />
								Śledzenie Postępów
							</CardTitle>
							<p className="mt-1 text-gray-600">
								Monitoruj efekty suplementacji i osiągaj swoje cele zdrowotne
							</p>
						</div>

						<div className="flex items-center gap-2">
							<Select
								value={timeRange}
								onValueChange={(value: any) => setTimeRange(value)}
							>
								<SelectTrigger className="w-32">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="7d">7 dni</SelectItem>
									<SelectItem value="30d">30 dni</SelectItem>
									<SelectItem value="90d">90 dni</SelectItem>
									<SelectItem value="1y">1 rok</SelectItem>
								</SelectContent>
							</Select>

							<Select
								value={selectedCategory}
								onValueChange={setSelectedCategory}
							>
								<SelectTrigger className="w-40">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="ALL">Wszystkie</SelectItem>
									{categories.map((category) => (
										<SelectItem key={category.value} value={category.value}>
											{category.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>
				</CardHeader>
			</Card>

			{/* Progress Overview */}
			{progressStats && (
				<div className="grid grid-cols-1 gap-6 md:grid-cols-4">
					<Card>
						<CardContent className="p-6 text-center">
							<div className="mb-1 font-bold text-2xl text-blue-600">
								{progressStats.avgValue.toFixed(1)}%
							</div>
							<div className="text-gray-600 text-sm">Średni wynik</div>
							<div className="mt-2 flex items-center justify-center">
								{progressStats.trend === "up" ? (
									<div className="flex items-center text-green-600">
										<TrendingUp className="mr-1 h-3 w-3" />
										<span className="text-xs">
											+{progressStats.trendPercentage.toFixed(1)}%
										</span>
									</div>
								) : progressStats.trend === "down" ? (
									<div className="flex items-center text-red-600">
										<TrendingDown className="mr-1 h-3 w-3" />
										<span className="text-xs">
											-{progressStats.trendPercentage.toFixed(1)}%
										</span>
									</div>
								) : (
									<div className="text-gray-500 text-xs">Stabilny</div>
								)}
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardContent className="p-6 text-center">
							<div className="mb-1 font-bold text-2xl text-green-600">
								{progressStats.avgMood.toFixed(1)}
							</div>
							<div className="text-gray-600 text-sm">Średni nastrój</div>
							<div className="mt-2 flex justify-center">
								{[...Array(5)].map((_, i) => (
									<Star
										key={i}
										className={cn(
											"h-3 w-3",
											i < Math.round(progressStats.avgMood / 2)
												? "fill-current text-yellow-400"
												: "text-gray-300",
										)}
									/>
								))}
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardContent className="p-6 text-center">
							<div className="mb-1 font-bold text-2xl text-purple-600">
								{progressStats.totalEntries}
							</div>
							<div className="text-gray-600 text-sm">Wpisów</div>
							<div className="mt-2 text-gray-500 text-xs">
								Ostatnie {timeRange}
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardContent className="p-6 text-center">
							<div className="mb-1 font-bold text-2xl text-orange-600">
								{progressStats.sideEffectsCount}
							</div>
							<div className="text-gray-600 text-sm">Skutki uboczne</div>
							<div className="mt-2 text-gray-500 text-xs">Zgłoszonych</div>
						</CardContent>
					</Card>
				</div>
			)}

			{/* Main Content */}
			<Tabs defaultValue="entries" className="w-full">
				<TabsList className="grid w-full grid-cols-3">
					<TabsTrigger value="entries">Wpisy</TabsTrigger>
					<TabsTrigger value="goals">Cele</TabsTrigger>
					<TabsTrigger value="analytics">Analityka</TabsTrigger>
				</TabsList>

				<TabsContent value="entries" className="mt-6">
					<div className="space-y-6">
						{/* Add Entry Button */}
						<div className="flex items-center justify-between">
							<h3 className="font-medium text-lg">Wpisy postępów</h3>
							<Button onClick={() => setIsAddingEntry(true)}>
								<Plus className="mr-1 h-3 w-3" />
								Dodaj wpis
							</Button>
						</div>

						{/* Add Entry Form */}
						{isAddingEntry && (
							<Card>
								<CardHeader>
									<CardTitle>Nowy wpis postępu</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
										<div>
											<Label>Data</Label>
											<Popover>
												<PopoverTrigger asChild>
													<Button
														variant="outline"
														className="w-full justify-start text-left"
													>
														<CalendarIcon className="mr-2 h-4 w-4" />
														{format(selectedDate, "PPP", { locale: pl })}
													</Button>
												</PopoverTrigger>
												<PopoverContent className="w-auto p-0">
													<Calendar
														mode="single"
														selected={selectedDate}
														onSelect={(date) => date && setSelectedDate(date)}
														initialFocus
													/>
												</PopoverContent>
											</Popover>
										</div>

										<div>
											<Label>Kategoria</Label>
											<Select
												value={newEntry.category}
												onValueChange={(value: any) => {
													const categoryInfo = getCategoryInfo(value);
													setNewEntry({
														...newEntry,
														category: value,
														polishCategory: categoryInfo?.label || value,
													});
												}}
											>
												<SelectTrigger>
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													{categories.map((category) => (
														<SelectItem
															key={category.value}
															value={category.value}
														>
															<div className="flex items-center gap-2">
																{category.icon}
																{category.label}
															</div>
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>
									</div>

									<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
										<div>
											<Label>Metryka</Label>
											<Input
												placeholder="np. Koncentracja"
												value={newEntry.polishMetric}
												onChange={(e) =>
													setNewEntry({
														...newEntry,
														polishMetric: e.target.value,
														metric: e.target.value,
													})
												}
											/>
										</div>

										<div>
											<Label>Wartość</Label>
											<Input
												type="number"
												min="0"
												max={newEntry.maxValue}
												value={newEntry.value}
												onChange={(e) =>
													setNewEntry({
														...newEntry,
														value: Number.parseFloat(e.target.value) || 0,
													})
												}
											/>
										</div>

										<div>
											<Label>Maksymalna wartość</Label>
											<Input
												type="number"
												min="1"
												value={newEntry.maxValue}
												onChange={(e) =>
													setNewEntry({
														...newEntry,
														maxValue: Number.parseFloat(e.target.value) || 10,
													})
												}
											/>
										</div>
									</div>

									<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
										<div>
											<Label>Nastrój (1-10)</Label>
											<Input
												type="number"
												min="1"
												max="10"
												value={newEntry.mood}
												onChange={(e) =>
													setNewEntry({
														...newEntry,
														mood: Number.parseInt(e.target.value) || 5,
													})
												}
											/>
										</div>

										<div>
											<Label>Jednostka</Label>
											<Input
												placeholder="np. punkty"
												value={newEntry.polishUnit}
												onChange={(e) =>
													setNewEntry({
														...newEntry,
														polishUnit: e.target.value,
														unit: e.target.value,
													})
												}
											/>
										</div>
									</div>

									<div>
										<Label>Notatki</Label>
										<Textarea
											placeholder="Dodatkowe obserwacje..."
											value={newEntry.polishNotes}
											onChange={(e) =>
												setNewEntry({
													...newEntry,
													polishNotes: e.target.value,
													notes: e.target.value,
												})
											}
										/>
									</div>

									<div className="flex items-center gap-2">
										<Button onClick={addEntry}>
											<Save className="mr-1 h-3 w-3" />
											Zapisz wpis
										</Button>
										<Button
											variant="outline"
											onClick={() => setIsAddingEntry(false)}
										>
											<X className="mr-1 h-3 w-3" />
											Anuluj
										</Button>
									</div>
								</CardContent>
							</Card>
						)}

						{/* Entries List */}
						<div className="space-y-4">
							{filteredEntries.length === 0 ? (
								<Card>
									<CardContent className="p-8 text-center">
										<BarChart3 className="mx-auto mb-4 h-16 w-16 text-gray-400" />
										<h3 className="mb-2 font-medium text-gray-600 text-lg">
											Brak wpisów
										</h3>
										<p className="text-gray-500">
											Dodaj swój pierwszy wpis, aby rozpocząć śledzenie postępów
										</p>
									</CardContent>
								</Card>
							) : (
								filteredEntries.map((entry) => {
									const categoryInfo = getCategoryInfo(entry.category);
									const progressPercentage =
										(entry.value / entry.maxValue) * 100;

									if (!categoryInfo) return null;

									return (
										<Card key={entry.id}>
											<CardContent className="p-6">
												<div className="mb-4 flex items-start justify-between">
													<div className="flex items-center gap-3">
														<div className="rounded-lg bg-gray-100 p-2">
															{categoryInfo.icon}
														</div>
														<div>
															<h4 className="font-medium">
																{entry.polishMetric}
															</h4>
															<p className="text-gray-600 text-sm">
																{format(entry.date, "PPP", { locale: pl })}
															</p>
														</div>
													</div>

													<Badge className={categoryInfo.color}>
														{entry.polishCategory}
													</Badge>
												</div>

												<div className="space-y-3">
													<div>
														<div className="mb-2 flex items-center justify-between">
															<span className="font-medium text-sm">Wynik</span>
															<span className="text-gray-600 text-sm">
																{entry.value} / {entry.maxValue}{" "}
																{entry.polishUnit}
															</span>
														</div>
														<Progress
															value={progressPercentage}
															className="h-2"
														/>
													</div>

													<div className="flex items-center justify-between text-sm">
														<div className="flex items-center gap-1">
															<Heart className="h-3 w-3 text-pink-500" />
															<span>Nastrój: {entry.mood}/10</span>
														</div>

														{entry.sideEffects.length > 0 && (
															<div className="flex items-center gap-1 text-orange-600">
																<AlertCircle className="h-3 w-3" />
																<span>
																	{entry.sideEffects.length} skutków ubocznych
																</span>
															</div>
														)}
													</div>

													{entry.polishNotes && (
														<div className="rounded-lg bg-gray-50 p-3">
															<p className="text-gray-700 text-sm">
																{entry.polishNotes}
															</p>
														</div>
													)}
												</div>
											</CardContent>
										</Card>
									);
								})
							)}
						</div>
					</div>
				</TabsContent>

				<TabsContent value="goals" className="mt-6">
					<div className="space-y-6">
						{/* Add Goal Button */}
						<div className="flex items-center justify-between">
							<h3 className="font-medium text-lg">Cele zdrowotne</h3>
							<Button onClick={() => setIsAddingGoal(true)}>
								<Plus className="mr-1 h-3 w-3" />
								Dodaj cel
							</Button>
						</div>

						{/* Add Goal Form */}
						{isAddingGoal && (
							<Card>
								<CardHeader>
									<CardTitle>Nowy cel</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
										<div>
											<Label>Tytuł celu</Label>
											<Input
												placeholder="np. Poprawa koncentracji"
												value={newGoal.polishTitle}
												onChange={(e) =>
													setNewGoal({
														...newGoal,
														polishTitle: e.target.value,
														title: e.target.value,
													})
												}
											/>
										</div>

										<div>
											<Label>Kategoria</Label>
											<Select
												value={newGoal.category}
												onValueChange={(value: any) => {
													const categoryInfo = getCategoryInfo(value);
													setNewGoal({
														...newGoal,
														category: value,
														polishCategory: categoryInfo?.label || value,
													});
												}}
											>
												<SelectTrigger>
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													{categories.map((category) => (
														<SelectItem
															key={category.value}
															value={category.value}
														>
															<div className="flex items-center gap-2">
																{category.icon}
																{category.label}
															</div>
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>
									</div>

									<div>
										<Label>Opis</Label>
										<Textarea
											placeholder="Opisz swój cel..."
											value={newGoal.polishDescription}
											onChange={(e) =>
												setNewGoal({
													...newGoal,
													polishDescription: e.target.value,
													description: e.target.value,
												})
											}
										/>
									</div>

									<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
										<div>
											<Label>Wartość docelowa</Label>
											<Input
												type="number"
												min="0"
												value={newGoal.targetValue}
												onChange={(e) =>
													setNewGoal({
														...newGoal,
														targetValue: Number.parseFloat(e.target.value) || 0,
													})
												}
											/>
										</div>

										<div>
											<Label>Jednostka</Label>
											<Input
												placeholder="np. punkty"
												value={newGoal.polishUnit}
												onChange={(e) =>
													setNewGoal({
														...newGoal,
														polishUnit: e.target.value,
														unit: e.target.value,
													})
												}
											/>
										</div>

										<div>
											<Label>Termin</Label>
											<Popover>
												<PopoverTrigger asChild>
													<Button
														variant="outline"
														className="w-full justify-start text-left"
													>
														<CalendarIcon className="mr-2 h-4 w-4" />
														{newGoal.deadline
															? format(newGoal.deadline, "PPP", { locale: pl })
															: "Wybierz datę"}
													</Button>
												</PopoverTrigger>
												<PopoverContent className="w-auto p-0">
													<Calendar
														mode="single"
														selected={newGoal.deadline}
														onSelect={(date) =>
															date && setNewGoal({ ...newGoal, deadline: date })
														}
														initialFocus
													/>
												</PopoverContent>
											</Popover>
										</div>
									</div>

									<div className="flex items-center gap-2">
										<Button onClick={addGoal}>
											<Save className="mr-1 h-3 w-3" />
											Zapisz cel
										</Button>
										<Button
											variant="outline"
											onClick={() => setIsAddingGoal(false)}
										>
											<X className="mr-1 h-3 w-3" />
											Anuluj
										</Button>
									</div>
								</CardContent>
							</Card>
						)}

						{/* Goals List */}
						<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
							{goalProgress.length === 0 ? (
								<Card className="md:col-span-2">
									<CardContent className="p-8 text-center">
										<Target className="mx-auto mb-4 h-16 w-16 text-gray-400" />
										<h3 className="mb-2 font-medium text-gray-600 text-lg">
											Brak celów
										</h3>
										<p className="text-gray-500">
											Ustaw swój pierwszy cel, aby rozpocząć śledzenie postępów
										</p>
									</CardContent>
								</Card>
							) : (
								goalProgress.map((goal) => {
									const categoryInfo = getCategoryInfo(goal.category);

									if (!categoryInfo) return null;

									return (
										<Card
											key={goal.id}
											className={cn(
												"border-l-4",
												goal.isCompleted
													? "border-l-green-500"
													: goal.isOverdue
														? "border-l-red-500"
														: "border-l-blue-500",
											)}
										>
											<CardContent className="p-6">
												<div className="mb-4 flex items-start justify-between">
													<div className="flex items-center gap-3">
														<div className="rounded-lg bg-gray-100 p-2">
															{categoryInfo.icon}
														</div>
														<div>
															<h4 className="font-medium">
																{goal.polishTitle}
															</h4>
															<p className="text-gray-600 text-sm">
																{goal.polishDescription}
															</p>
														</div>
													</div>

													<div className="flex items-center gap-2">
														{goal.isCompleted && (
															<Badge className="bg-green-100 text-green-800">
																<CheckCircle className="mr-1 h-3 w-3" />
																Ukończone
															</Badge>
														)}
														{goal.isOverdue && !goal.isCompleted && (
															<Badge className="bg-red-100 text-red-800">
																<Clock className="mr-1 h-3 w-3" />
																Przeterminowane
															</Badge>
														)}
														<Button
															variant="outline"
															size="sm"
															onClick={() => setEditingGoal(goal.id)}
														>
															<Edit className="h-3 w-3" />
														</Button>
													</div>
												</div>

												<div className="space-y-3">
													<div>
														<div className="mb-2 flex items-center justify-between">
															<span className="font-medium text-sm">
																Postęp
															</span>
															<span className="text-gray-600 text-sm">
																{goal.currentValue} / {goal.targetValue}{" "}
																{goal.polishUnit}
															</span>
														</div>
														<Progress value={goal.progress} className="h-2" />
														<div className="mt-1 text-gray-500 text-xs">
															{goal.progress.toFixed(1)}% ukończone
														</div>
													</div>

													<div className="flex items-center justify-between text-sm">
														<div className="flex items-center gap-1">
															<CalendarIcon className="h-3 w-3 text-gray-500" />
															<span>
																{goal.isOverdue
																	? `Przeterminowane o ${Math.abs(goal.daysLeft)} dni`
																	: `${goal.daysLeft} dni pozostało`}
															</span>
														</div>

														<Badge className={categoryInfo.color}>
															{goal.polishCategory}
														</Badge>
													</div>
												</div>
											</CardContent>
										</Card>
									);
								})
							)}
						</div>
					</div>
				</TabsContent>

				<TabsContent value="analytics" className="mt-6">
					<div className="space-y-6">
						<Card>
							<CardContent className="p-8 text-center">
								<LineChart className="mx-auto mb-4 h-16 w-16 text-gray-400" />
								<h3 className="mb-2 font-medium text-gray-600 text-lg">
									Analityka w przygotowaniu
								</h3>
								<p className="text-gray-500">
									Zaawansowane wykresy i analizy będą dostępne wkrótce
								</p>
							</CardContent>
						</Card>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
};

export default ProgressTracker;
