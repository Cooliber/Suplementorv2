"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
	Activity,
	AlertTriangle,
	BarChart3,
	Bell,
	Brain,
	Calendar,
	CheckCircle,
	Clock,
	Download,
	Heart,
	Lightbulb,
	LineChart,
	PieChart,
	Plus,
	Settings,
	Shield,
	Target,
	TrendingDown,
	TrendingUp,
	Zap,
} from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";

import {
	type ProgressInsight,
	type SupplementIntakeLog,
	type TrackingAnalytics,
	createTrackingService,
	formatAdherenceRate,
	formatEffectChange,
	getAdherenceColor,
	getEffectChangeColor,
} from "@/lib/services/supplement-tracking-service";

interface SupplementTrackingDashboardProps {
	userId: string;
	supplementIds: string[];
	onIntakeLog?: (log: SupplementIntakeLog) => void;
	onScheduleUpdate?: (scheduleId: string) => void;
	className?: string;
}

const SupplementTrackingDashboard: React.FC<
	SupplementTrackingDashboardProps
> = ({
	userId,
	supplementIds,
	onIntakeLog,
	onScheduleUpdate,
	className = "",
}) => {
	const [trackingService] = useState(() => createTrackingService(userId));
	const [analytics, setAnalytics] = useState<TrackingAnalytics | null>(null);
	const [insights, setInsights] = useState<ProgressInsight[]>([]);
	const [loading, setLoading] = useState(true);
	const [selectedTimeframe, setSelectedTimeframe] = useState("30d");
	const [showQuickLog, setShowQuickLog] = useState(false);
	const [quickLogData, setQuickLogData] = useState({
		supplementId: "",
		dosage: "",
		timeOfDay: "morning" as const,
		withFood: true,
		mood: 3 as const,
		energy: 3 as const,
		notes: "",
	});

	useEffect(() => {
		loadTrackingData();
	}, [selectedTimeframe, supplementIds]);

	const loadTrackingData = async () => {
		setLoading(true);
		try {
			const endDate = new Date();
			const startDate = new Date();

			switch (selectedTimeframe) {
				case "7d":
					startDate.setDate(endDate.getDate() - 7);
					break;
				case "30d":
					startDate.setDate(endDate.getDate() - 30);
					break;
				case "90d":
					startDate.setDate(endDate.getDate() - 90);
					break;
				case "1y":
					startDate.setFullYear(endDate.getFullYear() - 1);
					break;
			}

			const timeframe = {
				start: startDate.toISOString(),
				end: endDate.toISOString(),
			};

			const [analyticsData, insightsData] = await Promise.all([
				trackingService.getAnalytics(timeframe),
				trackingService.generateInsights(supplementIds),
			]);

			setAnalytics(analyticsData);
			setInsights(insightsData);
		} catch (error) {
			console.error("Error loading tracking data:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleQuickLog = async () => {
		if (!quickLogData.supplementId || !quickLogData.dosage) return;

		try {
			const intakeLog = await trackingService.logIntake({
				supplementId: quickLogData.supplementId,
				supplementName: quickLogData.supplementId, // Would get from service
				polishSupplementName: quickLogData.supplementId,
				dosage: {
					amount: Number.parseFloat(quickLogData.dosage),
					unit: "mg",
					form: "capsule",
					polishForm: "kapsułka",
				},
				timing: {
					timestamp: new Date().toISOString(),
					timeOfDay: quickLogData.timeOfDay,
					polishTimeOfDay:
						quickLogData.timeOfDay === "morning"
							? "rano"
							: quickLogData.timeOfDay === "afternoon"
								? "po południu"
								: quickLogData.timeOfDay === "evening"
									? "wieczorem"
									: "w nocy",
					withFood: quickLogData.withFood,
					mealTiming: quickLogData.withFood ? "with" : "empty_stomach",
					polishMealTiming: quickLogData.withFood
						? "z posiłkiem"
						: "na pusty żołądek",
				},
				context: {
					mood: quickLogData.mood,
					energy: quickLogData.energy,
					stress: 3,
					sleep: 3,
					notes: quickLogData.notes,
					polishNotes: quickLogData.notes,
				},
				adherence: {
					planned: true,
					missed: false,
				},
				sideEffects: {
					experienced: false,
					effects: [],
					severity: "mild",
					polishSeverity: "łagodne",
				},
			});

			onIntakeLog?.(intakeLog);
			setShowQuickLog(false);
			setQuickLogData({
				supplementId: "",
				dosage: "",
				timeOfDay: "morning",
				withFood: true,
				mood: 3,
				energy: 3,
				notes: "",
			});

			// Reload data
			await loadTrackingData();
		} catch (error) {
			console.error("Error logging intake:", error);
		}
	};

	const getInsightIcon = (type: string) => {
		switch (type) {
			case "adherence":
				return <Clock className="h-4 w-4" />;
			case "effectiveness":
				return <Target className="h-4 w-4" />;
			case "side_effects":
				return <AlertTriangle className="h-4 w-4" />;
			case "optimization":
				return <Lightbulb className="h-4 w-4" />;
			case "warning":
				return <Shield className="h-4 w-4" />;
			default:
				return <Activity className="h-4 w-4" />;
		}
	};

	const getInsightColor = (priority: string) => {
		switch (priority) {
			case "critical":
				return "border-red-200 bg-red-50";
			case "high":
				return "border-orange-200 bg-orange-50";
			case "medium":
				return "border-yellow-200 bg-yellow-50";
			case "low":
				return "border-blue-200 bg-blue-50";
			default:
				return "border-gray-200 bg-gray-50";
		}
	};

	if (loading) {
		return (
			<Card className={className}>
				<CardContent className="p-6">
					<div className="flex items-center justify-center space-x-2">
						<div className="h-6 w-6 animate-spin rounded-full border-blue-600 border-b-2" />
						<span>Ładowanie danych śledzenia...</span>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className={`space-y-6 ${className}`}>
			{/* Header with Quick Actions */}
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<CardTitle className="flex items-center gap-2">
							<Activity className="h-5 w-5" />
							Panel śledzenia suplementów
						</CardTitle>
						<div className="flex items-center gap-2">
							<Select
								value={selectedTimeframe}
								onValueChange={setSelectedTimeframe}
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
							<Button onClick={() => setShowQuickLog(true)}>
								<Plus className="mr-1 h-3 w-3" />
								Szybki wpis
							</Button>
						</div>
					</div>
				</CardHeader>

				{analytics && (
					<CardContent>
						{/* Quick Stats */}
						<div className="grid grid-cols-2 gap-4 md:grid-cols-6">
							<div className="text-center">
								<div className="font-bold text-2xl text-blue-600">
									{analytics.overview.activeSupplements}
								</div>
								<div className="text-gray-600 text-xs">Aktywne suplementy</div>
							</div>
							<div className="text-center">
								<div
									className={`font-bold text-2xl ${getAdherenceColor(analytics.overview.averageAdherence)}`}
								>
									{formatAdherenceRate(analytics.overview.averageAdherence)}
								</div>
								<div className="text-gray-600 text-xs">Średnia adherencja</div>
							</div>
							<div className="text-center">
								<div className="font-bold text-2xl text-green-600">
									{analytics.overview.totalIntakes}
								</div>
								<div className="text-gray-600 text-xs">Łączne przyjęcia</div>
							</div>
							<div className="text-center">
								<div className="font-bold text-2xl text-orange-600">
									{analytics.overview.missedDoses}
								</div>
								<div className="text-gray-600 text-xs">Pominięte dawki</div>
							</div>
							<div className="text-center">
								<div className="font-bold text-2xl text-red-600">
									{analytics.overview.sideEffectsReported}
								</div>
								<div className="text-gray-600 text-xs">Skutki uboczne</div>
							</div>
							<div className="text-center">
								<div className="font-bold text-2xl text-purple-600">
									{
										insights.filter(
											(i) => i.priority === "high" || i.priority === "critical",
										).length
									}
								</div>
								<div className="text-gray-600 text-xs">Ważne spostrzeżenia</div>
							</div>
						</div>
					</CardContent>
				)}
			</Card>

			{/* Critical Insights */}
			{insights.filter(
				(i) => i.priority === "critical" || i.priority === "high",
			).length > 0 && (
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<AlertTriangle className="h-5 w-5 text-orange-600" />
							Ważne spostrzeżenia
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							{insights
								.filter(
									(i) => i.priority === "critical" || i.priority === "high",
								)
								.slice(0, 3)
								.map((insight, index) => (
									<Alert
										key={index}
										className={getInsightColor(insight.priority)}
									>
										<div className="flex items-start gap-3">
											{getInsightIcon(insight.type)}
											<div className="flex-1">
												<div className="font-medium text-sm">
													{insight.polishTitle}
												</div>
												<div className="mt-1 text-gray-700 text-sm">
													{insight.polishDescription}
												</div>
												{insight.recommendations.length > 0 && (
													<div className="mt-2">
														<div className="font-medium text-xs">
															Zalecenia:
														</div>
														<ul className="mt-1 space-y-1 text-gray-600 text-xs">
															{insight.recommendations
																.slice(0, 2)
																.map((rec, recIndex) => (
																	<li
																		key={recIndex}
																		className="flex items-start gap-1"
																	>
																		<span className="mt-1 text-blue-500">
																			•
																		</span>
																		{rec.polishAction}
																	</li>
																))}
														</ul>
													</div>
												)}
											</div>
											<Badge
												variant={
													insight.priority === "critical"
														? "destructive"
														: "default"
												}
											>
												{insight.priority === "critical"
													? "Krytyczne"
													: "Wysokie"}
											</Badge>
										</div>
									</Alert>
								))}
						</div>
					</CardContent>
				</Card>
			)}

			{/* Main Content Tabs */}
			<Card>
				<CardContent className="p-0">
					<Tabs defaultValue="overview" className="w-full">
						<TabsList className="grid w-full grid-cols-5">
							<TabsTrigger value="overview">Przegląd</TabsTrigger>
							<TabsTrigger value="adherence">Adherencja</TabsTrigger>
							<TabsTrigger value="effectiveness">Skuteczność</TabsTrigger>
							<TabsTrigger value="insights">Spostrzeżenia</TabsTrigger>
							<TabsTrigger value="optimization">Optymalizacja</TabsTrigger>
						</TabsList>

						{/* Overview Tab */}
						<TabsContent value="overview" className="space-y-6 p-6">
							{analytics && (
								<>
									{/* Adherence Overview */}
									<Card>
										<CardHeader>
											<CardTitle className="text-lg">
												Adherencja według suplementu
											</CardTitle>
										</CardHeader>
										<CardContent>
											<div className="space-y-3">
												{Object.entries(analytics.adherence.bySupplementId).map(
													([supplementId, data]) => (
														<div
															key={supplementId}
															className="flex items-center justify-between"
														>
															<div className="flex-1">
																<div className="font-medium text-sm">
																	{supplementId}
																</div>
																<div className="text-gray-600 text-xs">
																	Najlepszy czas: {data.polishBestTimeOfDay}
																</div>
															</div>
															<div className="flex items-center gap-3">
																<Progress
																	value={data.adherenceRate * 100}
																	className="w-24"
																/>
																<span
																	className={`font-medium text-sm ${getAdherenceColor(data.adherenceRate)}`}
																>
																	{formatAdherenceRate(data.adherenceRate)}
																</span>
																<Badge
																	variant={
																		data.trend === "improving"
																			? "default"
																			: data.trend === "declining"
																				? "destructive"
																				: "secondary"
																	}
																>
																	{data.polishTrend}
																</Badge>
															</div>
														</div>
													),
												)}
											</div>
										</CardContent>
									</Card>

									{/* Effectiveness Overview */}
									<Card>
										<CardHeader>
											<CardTitle className="text-lg">
												Skuteczność według suplementu
											</CardTitle>
										</CardHeader>
										<CardContent>
											<div className="space-y-4">
												{Object.entries(
													analytics.effectiveness.bySupplementId,
												).map(([supplementId, data]) => (
													<div
														key={supplementId}
														className="rounded-lg border p-3"
													>
														<div className="mb-2 font-medium text-sm">
															{supplementId}
														</div>
														<div className="grid grid-cols-1 gap-3 md:grid-cols-3">
															{Object.entries(data.targetEffects).map(
																([effectName, effectData]) => (
																	<div key={effectName} className="text-center">
																		<div className="mb-1 text-gray-600 text-xs">
																			{effectName}
																		</div>
																		<div
																			className={`font-bold text-lg ${getEffectChangeColor(effectData.change)}`}
																		>
																			{formatEffectChange(effectData.change)}
																		</div>
																		<div className="text-gray-500 text-xs">
																			{effectData.changePercent > 0 ? "+" : ""}
																			{effectData.changePercent.toFixed(1)}%
																		</div>
																		<Badge
																			variant="outline"
																			className="mt-1 text-xs"
																		>
																			{effectData.polishSignificance}
																		</Badge>
																	</div>
																),
															)}
														</div>
														<div className="mt-2 text-gray-600 text-xs">
															Czas do efektu: {data.polishTimeToEffect}
														</div>
													</div>
												))}
											</div>
										</CardContent>
									</Card>
								</>
							)}
						</TabsContent>

						{/* Adherence Tab */}
						<TabsContent value="adherence" className="space-y-6 p-6">
							{analytics && (
								<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
									<Card>
										<CardHeader className="pb-2">
											<CardTitle className="text-sm">
												Adherencja według pory dnia
											</CardTitle>
										</CardHeader>
										<CardContent>
											<div className="space-y-2">
												{Object.entries(
													analytics.adherence.factors.timeOfDay,
												).map(([time, rate]) => (
													<div
														key={time}
														className="flex items-center justify-between"
													>
														<span className="text-xs">{time}</span>
														<span
															className={`font-medium text-xs ${getAdherenceColor(rate)}`}
														>
															{formatAdherenceRate(rate)}
														</span>
													</div>
												))}
											</div>
										</CardContent>
									</Card>

									<Card>
										<CardHeader className="pb-2">
											<CardTitle className="text-sm">
												Adherencja według dnia tygodnia
											</CardTitle>
										</CardHeader>
										<CardContent>
											<div className="space-y-2">
												{Object.entries(
													analytics.adherence.factors.dayOfWeek,
												).map(([day, rate]) => (
													<div
														key={day}
														className="flex items-center justify-between"
													>
														<span className="text-xs">{day}</span>
														<span
															className={`font-medium text-xs ${getAdherenceColor(rate)}`}
														>
															{formatAdherenceRate(rate)}
														</span>
													</div>
												))}
											</div>
										</CardContent>
									</Card>

									<Card>
										<CardHeader className="pb-2">
											<CardTitle className="text-sm">
												Z posiłkiem vs na pusty żołądek
											</CardTitle>
										</CardHeader>
										<CardContent>
											<div className="space-y-2">
												<div className="flex items-center justify-between">
													<span className="text-xs">Z posiłkiem</span>
													<span
														className={`font-medium text-xs ${getAdherenceColor(analytics.adherence.factors.withFood.with)}`}
													>
														{formatAdherenceRate(
															analytics.adherence.factors.withFood.with,
														)}
													</span>
												</div>
												<div className="flex items-center justify-between">
													<span className="text-xs">Na pusty żołądek</span>
													<span
														className={`font-medium text-xs ${getAdherenceColor(analytics.adherence.factors.withFood.without)}`}
													>
														{formatAdherenceRate(
															analytics.adherence.factors.withFood.without,
														)}
													</span>
												</div>
											</div>
										</CardContent>
									</Card>
								</div>
							)}
						</TabsContent>

						{/* Effectiveness Tab */}
						<TabsContent value="effectiveness" className="space-y-6 p-6">
							<div className="text-center text-gray-500">
								Szczegółowe wykresy skuteczności będą dostępne wkrótce
							</div>
						</TabsContent>

						{/* Insights Tab */}
						<TabsContent value="insights" className="space-y-4 p-6">
							<div className="space-y-3">
								{insights.map((insight, index) => (
									<Card key={index}>
										<CardHeader className="pb-2">
											<CardTitle className="flex items-center justify-between text-sm">
												<div className="flex items-center gap-2">
													{getInsightIcon(insight.type)}
													{insight.polishTitle}
												</div>
												<Badge
													variant={
														insight.priority === "critical"
															? "destructive"
															: insight.priority === "high"
																? "default"
																: insight.priority === "medium"
																	? "secondary"
																	: "outline"
													}
												>
													{insight.priority === "critical"
														? "Krytyczne"
														: insight.priority === "high"
															? "Wysokie"
															: insight.priority === "medium"
																? "Średnie"
																: "Niskie"}
												</Badge>
											</CardTitle>
										</CardHeader>
										<CardContent>
											<p className="mb-3 text-gray-700 text-sm">
												{insight.polishDescription}
											</p>

											{insight.recommendations.length > 0 && (
												<div>
													<h5 className="mb-2 font-medium text-xs">
														Zalecenia:
													</h5>
													<div className="space-y-2">
														{insight.recommendations.map((rec, recIndex) => (
															<div
																key={recIndex}
																className="rounded border p-2"
															>
																<div className="font-medium text-xs">
																	{rec.polishAction}
																</div>
																<div className="mt-1 text-gray-600 text-xs">
																	{rec.polishRationale}
																</div>
																<Badge
																	variant="outline"
																	className="mt-1 text-xs"
																>
																	{rec.polishUrgency}
																</Badge>
															</div>
														))}
													</div>
												</div>
											)}
										</CardContent>
									</Card>
								))}
							</div>
						</TabsContent>

						{/* Optimization Tab */}
						<TabsContent value="optimization" className="space-y-6 p-6">
							{analytics && (
								<div className="space-y-4">
									{/* Timing Optimization */}
									{analytics.optimization.timingOptimization.length > 0 && (
										<Card>
											<CardHeader>
												<CardTitle className="text-lg">
													Optymalizacja czasowa
												</CardTitle>
											</CardHeader>
											<CardContent>
												<div className="space-y-3">
													{analytics.optimization.timingOptimization.map(
														(opt, index) => (
															<div
																key={index}
																className="rounded-lg border p-3"
															>
																<div className="mb-2 font-medium text-sm">
																	{opt.supplementId}
																</div>
																<div className="grid grid-cols-2 gap-4 text-xs">
																	<div>
																		<span className="text-gray-600">
																			Obecny czas:
																		</span>
																		<div className="font-medium">
																			{opt.polishCurrentTiming}
																		</div>
																	</div>
																	<div>
																		<span className="text-gray-600">
																			Sugerowany czas:
																		</span>
																		<div className="font-medium text-green-600">
																			{opt.polishSuggestedTiming}
																		</div>
																	</div>
																</div>
																<div className="mt-2 text-gray-600 text-xs">
																	<strong>Oczekiwana poprawa:</strong>{" "}
																	{opt.polishExpectedImprovement}
																</div>
															</div>
														),
													)}
												</div>
											</CardContent>
										</Card>
									)}

									{/* Dosage Optimization */}
									{analytics.optimization.dosageOptimization.length > 0 && (
										<Card>
											<CardHeader>
												<CardTitle className="text-lg">
													Optymalizacja dawkowania
												</CardTitle>
											</CardHeader>
											<CardContent>
												<div className="space-y-3">
													{analytics.optimization.dosageOptimization.map(
														(opt, index) => (
															<div
																key={index}
																className="rounded-lg border p-3"
															>
																<div className="mb-2 font-medium text-sm">
																	{opt.supplementId}
																</div>
																<div className="grid grid-cols-2 gap-4 text-xs">
																	<div>
																		<span className="text-gray-600">
																			Obecna dawka:
																		</span>
																		<div className="font-medium">
																			{opt.currentDosage}
																		</div>
																	</div>
																	<div>
																		<span className="text-gray-600">
																			Sugerowana dawka:
																		</span>
																		<div className="font-medium text-blue-600">
																			{opt.suggestedDosage}
																		</div>
																	</div>
																</div>
																<div className="mt-2 text-gray-600 text-xs">
																	<strong>Uzasadnienie:</strong>{" "}
																	{opt.polishRationale}
																</div>
															</div>
														),
													)}
												</div>
											</CardContent>
										</Card>
									)}
								</div>
							)}
						</TabsContent>
					</Tabs>
				</CardContent>
			</Card>

			{/* Quick Log Modal */}
			{showQuickLog && (
				<Card className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
					<div className="mx-4 w-full max-w-md rounded-lg bg-white p-6">
						<div className="mb-4 flex items-center justify-between">
							<h3 className="font-medium text-lg">Szybki wpis przyjęcia</h3>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => setShowQuickLog(false)}
							>
								✕
							</Button>
						</div>

						<div className="space-y-4">
							<div>
								<Label htmlFor="supplement">Suplement</Label>
								<Select
									value={quickLogData.supplementId}
									onValueChange={(value) =>
										setQuickLogData((prev) => ({
											...prev,
											supplementId: value,
										}))
									}
								>
									<SelectTrigger>
										<SelectValue placeholder="Wybierz suplement" />
									</SelectTrigger>
									<SelectContent>
										{supplementIds.map((id) => (
											<SelectItem key={id} value={id}>
												{id}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							<div>
								<Label htmlFor="dosage">Dawka (mg)</Label>
								<Input
									id="dosage"
									type="number"
									value={quickLogData.dosage}
									onChange={(e) =>
										setQuickLogData((prev) => ({
											...prev,
											dosage: e.target.value,
										}))
									}
									placeholder="500"
								/>
							</div>

							<div>
								<Label htmlFor="timeOfDay">Pora dnia</Label>
								<Select
									value={quickLogData.timeOfDay}
									onValueChange={(value) =>
										setQuickLogData((prev) => ({
											...prev,
											timeOfDay: value as any,
										}))
									}
								>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="morning">Rano</SelectItem>
										<SelectItem value="afternoon">Po południu</SelectItem>
										<SelectItem value="evening">Wieczorem</SelectItem>
										<SelectItem value="night">W nocy</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div>
									<Label htmlFor="mood">Nastrój (1-5)</Label>
									<Select
										value={quickLogData.mood.toString()}
										onValueChange={(value) =>
											setQuickLogData((prev) => ({
												...prev,
												mood: Number.parseInt(value) as any,
											}))
										}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="1">1 - Bardzo zły</SelectItem>
											<SelectItem value="2">2 - Zły</SelectItem>
											<SelectItem value="3">3 - Neutralny</SelectItem>
											<SelectItem value="4">4 - Dobry</SelectItem>
											<SelectItem value="5">5 - Bardzo dobry</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<div>
									<Label htmlFor="energy">Energia (1-5)</Label>
									<Select
										value={quickLogData.energy.toString()}
										onValueChange={(value) =>
											setQuickLogData((prev) => ({
												...prev,
												energy: Number.parseInt(value) as any,
											}))
										}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="1">1 - Bardzo niska</SelectItem>
											<SelectItem value="2">2 - Niska</SelectItem>
											<SelectItem value="3">3 - Średnia</SelectItem>
											<SelectItem value="4">4 - Wysoka</SelectItem>
											<SelectItem value="5">5 - Bardzo wysoka</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>

							<div>
								<Label htmlFor="notes">Notatki (opcjonalne)</Label>
								<Textarea
									id="notes"
									value={quickLogData.notes}
									onChange={(e) =>
										setQuickLogData((prev) => ({
											...prev,
											notes: e.target.value,
										}))
									}
									placeholder="Dodatkowe obserwacje..."
									rows={2}
								/>
							</div>

							<div className="flex justify-end gap-2">
								<Button
									variant="outline"
									onClick={() => setShowQuickLog(false)}
								>
									Anuluj
								</Button>
								<Button
									onClick={handleQuickLog}
									disabled={!quickLogData.supplementId || !quickLogData.dosage}
								>
									Zapisz wpis
								</Button>
							</div>
						</div>
					</div>
				</Card>
			)}
		</div>
	);
};

export default SupplementTrackingDashboard;
