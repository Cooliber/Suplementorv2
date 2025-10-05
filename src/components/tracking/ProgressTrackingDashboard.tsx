"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
	Activity,
	AlertCircle,
	Award,
	Brain,
	Calendar,
	CheckCircle,
	Clock,
	Frown,
	Heart,
	Meh,
	Shield,
	Smile,
	Target,
	TrendingDown,
	TrendingUp,
	Zap,
} from "lucide-react";
import type React from "react";
import { useMemo, useState } from "react";
import {
	Area,
	AreaChart,
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	Line,
	LineChart,
	Pie,
	PieChart,
	RadialBar,
	RadialBarChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

interface ProgressData {
	date: string;
	mood: number;
	energy: number;
	focus: number;
	sleep: number;
	stress: number;
	adherence: number;
	supplementsCount: number;
	sideEffects: number;
}

interface SupplementProgress {
	id: string;
	name: string;
	polishName: string;
	category: string;
	adherenceRate: number;
	effectivenessRating: number;
	totalIntakes: number;
	missedDoses: number;
	lastTaken: string;
	trend: "up" | "down" | "stable";
	targetEffects: Array<{
		name: string;
		polishName: string;
		baseline: number;
		current: number;
		target: number;
		improvement: number;
	}>;
}

interface ProgressTrackingDashboardProps {
	progressData: ProgressData[];
	supplementProgress: SupplementProgress[];
	timeframe: "7d" | "30d" | "90d" | "1y";
	onTimeframeChange: (timeframe: "7d" | "30d" | "90d" | "1y") => void;
	className?: string;
}

const ProgressTrackingDashboard: React.FC<ProgressTrackingDashboardProps> = ({
	progressData,
	supplementProgress,
	timeframe,
	onTimeframeChange,
	className = "",
}) => {
	const [selectedMetric, setSelectedMetric] = useState<
		"mood" | "energy" | "focus" | "sleep" | "stress"
	>("mood");
	const [selectedSupplement, setSelectedSupplement] = useState<string>("all");

	// Calculate summary statistics
	const summaryStats = useMemo(() => {
		if (progressData.length === 0) return null;

		const latest = progressData[progressData.length - 1];
		const previous = progressData[progressData.length - 2];

		const calculateTrend = (current: number, previous: number) => {
			if (!previous) return 0;
			return ((current - previous) / previous) * 100;
		};

		const averageAdherence =
			progressData.reduce((sum, day) => sum + day.adherence, 0) /
			progressData.length;
		const totalSupplements = supplementProgress.length;
		const activeSupplements = supplementProgress.filter(
			(s) => s.adherenceRate > 50,
		).length;
		const totalSideEffects = progressData.reduce(
			(sum, day) => sum + day.sideEffects,
			0,
		);

		return {
			mood: {
				current: latest?.mood || 0,
				trend:
					latest && previous ? calculateTrend(latest.mood, previous.mood) : 0,
			},
			energy: {
				current: latest?.energy || 0,
				trend:
					latest && previous
						? calculateTrend(latest.energy, previous.energy)
						: 0,
			},
			focus: {
				current: latest?.focus || 0,
				trend:
					latest && previous ? calculateTrend(latest.focus, previous.focus) : 0,
			},
			adherence: {
				current: averageAdherence,
				trend: 0, // Could calculate week-over-week trend
			},
			supplements: {
				total: totalSupplements,
				active: activeSupplements,
				inactive: totalSupplements - activeSupplements,
			},
			sideEffects: totalSideEffects,
		};
	}, [progressData, supplementProgress]);

	// Prepare chart data
	const chartData = useMemo(() => {
		return progressData.map((day) => ({
			...day,
			date: new Date(day.date).toLocaleDateString("pl-PL", {
				month: "short",
				day: "numeric",
			}),
		}));
	}, [progressData]);

	// Adherence pie chart data
	const adherenceData = useMemo(() => {
		const excellent = supplementProgress.filter(
			(s) => s.adherenceRate >= 90,
		).length;
		const good = supplementProgress.filter(
			(s) => s.adherenceRate >= 70 && s.adherenceRate < 90,
		).length;
		const fair = supplementProgress.filter(
			(s) => s.adherenceRate >= 50 && s.adherenceRate < 70,
		).length;
		const poor = supplementProgress.filter((s) => s.adherenceRate < 50).length;

		return [
			{ name: "Doskonała (90%+)", value: excellent, color: "#10B981" },
			{ name: "Dobra (70-89%)", value: good, color: "#F59E0B" },
			{ name: "Przeciętna (50-69%)", value: fair, color: "#EF4444" },
			{ name: "Słaba (<50%)", value: poor, color: "#6B7280" },
		].filter((item) => item.value > 0);
	}, [supplementProgress]);

	const getTrendIcon = (trend: number) => {
		if (trend > 5) return <TrendingUp className="h-4 w-4 text-green-600" />;
		if (trend < -5) return <TrendingDown className="h-4 w-4 text-red-600" />;
		return <div className="h-4 w-4" />; // Stable
	};

	const getTrendColor = (trend: number) => {
		if (trend > 5) return "text-green-600";
		if (trend < -5) return "text-red-600";
		return "text-gray-600";
	};

	const getMoodIcon = (value: number) => {
		if (value <= 2) return <Frown className="h-4 w-4 text-red-500" />;
		if (value <= 3) return <Meh className="h-4 w-4 text-yellow-500" />;
		return <Smile className="h-4 w-4 text-green-500" />;
	};

	const CustomTooltip = ({ active, payload, label }: any) => {
		if (active && payload && payload.length) {
			return (
				<div className="rounded-lg border bg-white p-3 shadow-lg">
					<p className="mb-2 font-medium text-sm">{label}</p>
					{payload.map((entry: any, index: number) => (
						<p key={index} className="text-xs" style={{ color: entry.color }}>
							{entry.name}: {entry.value.toFixed(1)}
							{entry.name === "adherence" && "%"}
						</p>
					))}
				</div>
			);
		}
		return null;
	};

	if (!summaryStats) {
		return (
			<Card className={cn("w-full", className)}>
				<CardContent className="flex items-center justify-center py-12">
					<div className="text-center">
						<Activity className="mx-auto mb-4 h-12 w-12 text-gray-400" />
						<h3 className="mb-2 font-medium text-gray-900 text-lg">
							Brak danych do wyświetlenia
						</h3>
						<p className="text-gray-600">
							Zacznij logować przyjmowanie suplementów, aby zobaczyć swój
							postęp.
						</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className={cn("w-full space-y-6", className)}>
			{/* Header with timeframe selector */}
			<div className="flex items-center justify-between">
				<h2 className="font-bold text-2xl">Dashboard postępów</h2>
				<Select value={timeframe} onValueChange={onTimeframeChange}>
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
			</div>

			{/* Summary Cards */}
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardContent className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-gray-600 text-sm">Nastrój</p>
								<div className="flex items-center gap-2">
									{getMoodIcon(summaryStats.mood.current)}
									<span className="font-bold text-2xl">
										{summaryStats.mood.current.toFixed(1)}
									</span>
								</div>
							</div>
							<div className="flex items-center gap-1">
								{getTrendIcon(summaryStats.mood.trend)}
								<span
									className={cn(
										"text-sm",
										getTrendColor(summaryStats.mood.trend),
									)}
								>
									{summaryStats.mood.trend > 0 ? "+" : ""}
									{summaryStats.mood.trend.toFixed(1)}%
								</span>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-gray-600 text-sm">Energia</p>
								<div className="flex items-center gap-2">
									<Zap className="h-4 w-4 text-yellow-500" />
									<span className="font-bold text-2xl">
										{summaryStats.energy.current.toFixed(1)}
									</span>
								</div>
							</div>
							<div className="flex items-center gap-1">
								{getTrendIcon(summaryStats.energy.trend)}
								<span
									className={cn(
										"text-sm",
										getTrendColor(summaryStats.energy.trend),
									)}
								>
									{summaryStats.energy.trend > 0 ? "+" : ""}
									{summaryStats.energy.trend.toFixed(1)}%
								</span>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-gray-600 text-sm">Koncentracja</p>
								<div className="flex items-center gap-2">
									<Brain className="h-4 w-4 text-blue-500" />
									<span className="font-bold text-2xl">
										{summaryStats.focus.current.toFixed(1)}
									</span>
								</div>
							</div>
							<div className="flex items-center gap-1">
								{getTrendIcon(summaryStats.focus.trend)}
								<span
									className={cn(
										"text-sm",
										getTrendColor(summaryStats.focus.trend),
									)}
								>
									{summaryStats.focus.trend > 0 ? "+" : ""}
									{summaryStats.focus.trend.toFixed(1)}%
								</span>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-gray-600 text-sm">Przestrzeganie</p>
								<div className="flex items-center gap-2">
									<Target className="h-4 w-4 text-green-500" />
									<span className="font-bold text-2xl">
										{summaryStats.adherence.current.toFixed(0)}%
									</span>
								</div>
							</div>
							<div className="flex items-center gap-1">
								<CheckCircle className="h-4 w-4 text-green-600" />
								<span className="text-green-600 text-sm">
									{summaryStats.supplements.active}/
									{summaryStats.supplements.total}
								</span>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Main Charts */}
			<Tabs defaultValue="trends" className="w-full">
				<TabsList className="grid w-full grid-cols-4">
					<TabsTrigger value="trends">Trendy</TabsTrigger>
					<TabsTrigger value="adherence">Przestrzeganie</TabsTrigger>
					<TabsTrigger value="supplements">Suplementy</TabsTrigger>
					<TabsTrigger value="effects">Efekty</TabsTrigger>
				</TabsList>

				<TabsContent value="trends" className="mt-6">
					<Card>
						<CardHeader>
							<div className="flex items-center justify-between">
								<CardTitle>Trendy samopoczucia</CardTitle>
								<Select
									value={selectedMetric}
									onValueChange={(value: any) => setSelectedMetric(value)}
								>
									<SelectTrigger className="w-40">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="mood">Nastrój</SelectItem>
										<SelectItem value="energy">Energia</SelectItem>
										<SelectItem value="focus">Koncentracja</SelectItem>
										<SelectItem value="sleep">Sen</SelectItem>
										<SelectItem value="stress">Stres</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</CardHeader>
						<CardContent>
							<ResponsiveContainer width="100%" height={400}>
								<AreaChart data={chartData}>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis dataKey="date" tick={{ fontSize: 12 }} />
									<YAxis domain={[1, 5]} />
									<Tooltip content={<CustomTooltip />} />
									<Area
										type="monotone"
										dataKey={selectedMetric}
										stroke="#3B82F6"
										fill="#3B82F6"
										fillOpacity={0.3}
										strokeWidth={2}
									/>
									<Line
										type="monotone"
										dataKey="adherence"
										stroke="#10B981"
										strokeWidth={1}
										strokeDasharray="5 5"
									/>
								</AreaChart>
							</ResponsiveContainer>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="adherence" className="mt-6">
					<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
						<Card>
							<CardHeader>
								<CardTitle>Rozkład przestrzegania</CardTitle>
							</CardHeader>
							<CardContent>
								<ResponsiveContainer width="100%" height={300}>
									<PieChart>
										<Pie
											data={adherenceData}
											cx="50%"
											cy="50%"
											outerRadius={100}
											fill="#8884d8"
											dataKey="value"
											label={({ name, value }) => `${name}: ${value}`}
										>
											{adherenceData.map((entry, index) => (
												<Cell key={`cell-${index}`} fill={entry.color} />
											))}
										</Pie>
										<Tooltip />
									</PieChart>
								</ResponsiveContainer>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Przestrzeganie w czasie</CardTitle>
							</CardHeader>
							<CardContent>
								<ResponsiveContainer width="100%" height={300}>
									<LineChart data={chartData}>
										<CartesianGrid strokeDasharray="3 3" />
										<XAxis dataKey="date" tick={{ fontSize: 12 }} />
										<YAxis domain={[0, 100]} />
										<Tooltip content={<CustomTooltip />} />
										<Line
											type="monotone"
											dataKey="adherence"
											stroke="#10B981"
											strokeWidth={3}
											dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
										/>
									</LineChart>
								</ResponsiveContainer>
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				<TabsContent value="supplements" className="mt-6">
					<div className="space-y-4">
						{supplementProgress.map((supplement) => (
							<Card key={supplement.id}>
								<CardContent className="p-4">
									<div className="mb-4 flex items-center justify-between">
										<div>
											<h3 className="font-medium">{supplement.polishName}</h3>
											<p className="text-gray-600 text-sm">
												{supplement.category}
											</p>
										</div>
										<div className="flex items-center gap-2">
											<Badge
												variant={
													supplement.adherenceRate >= 80
														? "default"
														: "secondary"
												}
											>
												{supplement.adherenceRate.toFixed(0)}% przestrzeganie
											</Badge>
											{supplement.trend === "up" && (
												<TrendingUp className="h-4 w-4 text-green-600" />
											)}
											{supplement.trend === "down" && (
												<TrendingDown className="h-4 w-4 text-red-600" />
											)}
										</div>
									</div>

									<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
										<div>
											<p className="mb-1 text-gray-600 text-sm">
												Przestrzeganie
											</p>
											<Progress
												value={supplement.adherenceRate}
												className="h-2"
											/>
										</div>
										<div>
											<p className="mb-1 text-gray-600 text-sm">Skuteczność</p>
											<Progress
												value={supplement.effectivenessRating * 10}
												className="h-2"
											/>
										</div>
										<div>
											<p className="mb-1 text-gray-600 text-sm">Statystyki</p>
											<div className="text-sm">
												<span>{supplement.totalIntakes} przyjęć</span>
												{supplement.missedDoses > 0 && (
													<span className="ml-2 text-red-600">
														({supplement.missedDoses} opuszczonych)
													</span>
												)}
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</TabsContent>

				<TabsContent value="effects" className="mt-6">
					<Card>
						<CardHeader>
							<CardTitle>Postęp w osiąganiu celów</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-6">
								{supplementProgress
									.filter((s) => s.targetEffects.length > 0)
									.slice(0, 3)
									.map((supplement) => (
										<div key={supplement.id} className="space-y-4">
											<h4 className="font-medium">{supplement.polishName}</h4>
											{supplement.targetEffects.map((effect, index) => (
												<div
													key={index}
													className="grid grid-cols-1 items-center gap-4 md:grid-cols-4"
												>
													<div>
														<p className="font-medium text-sm">
															{effect.polishName}
														</p>
													</div>
													<div>
														<p className="text-gray-600 text-xs">
															Początek: {effect.baseline}
														</p>
														<p className="text-gray-600 text-xs">
															Cel: {effect.target}
														</p>
													</div>
													<div>
														<Progress
															value={(effect.current / effect.target) * 100}
															className="h-2"
														/>
														<p className="mt-1 text-gray-600 text-xs">
															Aktualnie: {effect.current}
														</p>
													</div>
													<div>
														<Badge
															variant={
																effect.improvement > 0 ? "default" : "secondary"
															}
															className="text-xs"
														>
															{effect.improvement > 0 ? "+" : ""}
															{effect.improvement.toFixed(1)}%
														</Badge>
													</div>
												</div>
											))}
										</div>
									))}
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>

			{/* Side Effects Alert */}
			{summaryStats.sideEffects > 0 && (
				<Card className="border-orange-200 bg-orange-50">
					<CardContent className="p-4">
						<div className="flex items-center gap-2">
							<AlertCircle className="h-5 w-5 text-orange-600" />
							<div>
								<h3 className="font-medium text-orange-800">
									Zgłoszono skutki uboczne
								</h3>
								<p className="text-orange-700 text-sm">
									W ostatnim okresie zgłoszono {summaryStats.sideEffects}{" "}
									skutków ubocznych. Rozważ konsultację z lekarzem.
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
};

export default ProgressTrackingDashboard;
