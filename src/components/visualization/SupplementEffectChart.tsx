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
import { Star } from "lucide-react";
import {
	Activity,
	Brain,
	Clock,
	Heart,
	Info,
	Shield,
	Target,
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
	PolarAngleAxis,
	PolarGrid,
	PolarRadiusAxis,
	Radar,
	RadarChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

interface NeurotransmitterEffect {
	neurotransmitter: string;
	polishNeurotransmitter: string;
	effect: number; // -100 to 100 (negative = decrease, positive = increase)
	confidence: number; // 0 to 100
	timeToEffect: string;
	polishTimeToEffect: string;
	mechanism: string;
	polishMechanism: string;
	evidenceLevel: "STRONG" | "MODERATE" | "WEAK" | "INSUFFICIENT";
}

interface BrainRegionEffect {
	regionId: string;
	regionName: string;
	polishRegionName: string;
	effectIntensity: number; // 0 to 100
	effectType: "ENHANCES" | "MODULATES" | "PROTECTS" | "STIMULATES" | "INHIBITS";
	polishEffectType: string;
	functions: string[];
	polishFunctions: string[];
}

interface EffectTimeline {
	timePoint: string;
	polishTimePoint: string;
	hours: number;
	cognitiveEffect: number;
	moodEffect: number;
	energyEffect: number;
	focusEffect: number;
}

interface SupplementEffectData {
	supplementId: string;
	supplementName: string;
	polishSupplementName: string;
	neurotransmitterEffects: NeurotransmitterEffect[];
	brainRegionEffects: BrainRegionEffect[];
	effectTimeline: EffectTimeline[];
	overallRating: number;
	studyCount: number;
}

interface SupplementEffectChartProps {
	supplementData: SupplementEffectData;
	comparisonData?: SupplementEffectData[];
	showComparison?: boolean;
	className?: string;
}

const SupplementEffectChart: React.FC<SupplementEffectChartProps> = ({
	supplementData,
	comparisonData = [],
	showComparison = false,
	className = "",
}) => {
	const [activeView, setActiveView] = useState("neurotransmitters");
	const [selectedTimeframe, setSelectedTimeframe] = useState("24h");

	// Color schemes for different data types
	const neurotransmitterColors = {
		Dopamina: "#3B82F6",
		Serotonina: "#10B981",
		Noradrenalina: "#F59E0B",
		Acetylocholina: "#8B5CF6",
		GABA: "#EF4444",
		Glutaminian: "#06B6D4",
	};

	const effectTypeColors = {
		ENHANCES: "#10B981",
		MODULATES: "#3B82F6",
		PROTECTS: "#8B5CF6",
		STIMULATES: "#F59E0B",
		INHIBITS: "#EF4444",
	};

	const getEvidenceLevelColor = (level: string) => {
		switch (level) {
			case "STRONG":
				return "#10B981";
			case "MODERATE":
				return "#F59E0B";
			case "WEAK":
				return "#EF4444";
			case "INSUFFICIENT":
				return "#6B7280";
			default:
				return "#6B7280";
		}
	};

	const getEvidenceLevelText = (level: string) => {
		const levels: Record<string, string> = {
			STRONG: "Silne",
			MODERATE: "Umiarkowane",
			WEAK: "Słabe",
			INSUFFICIENT: "Niewystarczające",
		};
		return levels[level] || level;
	};

	// Prepare neurotransmitter radar chart data
	const radarData = useMemo(() => {
		return supplementData.neurotransmitterEffects.map((effect) => ({
			neurotransmitter: effect.polishNeurotransmitter,
			effect: Math.abs(effect.effect),
			confidence: effect.confidence,
			fullMark: 100,
		}));
	}, [supplementData.neurotransmitterEffects]);

	// Prepare brain region bar chart data
	const brainRegionData = useMemo(() => {
		return supplementData.brainRegionEffects
			.sort((a, b) => b.effectIntensity - a.effectIntensity)
			.slice(0, 8)
			.map((region) => ({
				region: region.polishRegionName,
				intensity: region.effectIntensity,
				type: region.effectType,
				color: effectTypeColors[region.effectType] || "#6B7280",
			}));
	}, [supplementData.brainRegionEffects]);

	// Prepare timeline data
	const timelineData = useMemo(() => {
		return supplementData.effectTimeline.map((point) => ({
			time: point.polishTimePoint,
			hours: point.hours,
			"Funkcje poznawcze": point.cognitiveEffect,
			Nastrój: point.moodEffect,
			Energia: point.energyEffect,
			Koncentracja: point.focusEffect,
		}));
	}, [supplementData.effectTimeline]);

	// Custom tooltip for charts
	const CustomTooltip = ({ active, payload, label }: any) => {
		if (active && payload && payload.length) {
			return (
				<div className="rounded-lg border bg-white p-3 shadow-lg">
					<p className="mb-2 font-medium text-sm">{label}</p>
					{payload.map((entry: any, index: number) => (
						<p key={index} className="text-xs" style={{ color: entry.color }}>
							{entry.name}: {entry.value}
							{entry.name === "intensity" && "%"}
							{entry.name === "effect" && "%"}
							{entry.name === "confidence" && "% pewności"}
						</p>
					))}
				</div>
			);
		}
		return null;
	};

	return (
		<Card className={cn("w-full", className)}>
			<CardHeader>
				<div className="flex items-center justify-between">
					<CardTitle className="flex items-center gap-2">
						<Activity className="h-5 w-5" />
						Efekty {supplementData.polishSupplementName}
					</CardTitle>
					<div className="flex items-center gap-2">
						<Badge variant="outline" className="text-xs">
							{supplementData.studyCount} badań
						</Badge>
						<div className="flex items-center gap-1">
							<Star className="h-3 w-3 text-yellow-500" />
							<span className="text-sm">
								{supplementData.overallRating.toFixed(1)}
							</span>
						</div>
					</div>
				</div>
			</CardHeader>

			<CardContent>
				<Tabs
					value={activeView}
					onValueChange={setActiveView}
					className="w-full"
				>
					<TabsList className="grid w-full grid-cols-4">
						<TabsTrigger value="neurotransmitters" className="text-xs">
							<Brain className="mr-1 h-3 w-3" />
							Neuroprzekaźniki
						</TabsTrigger>
						<TabsTrigger value="brain-regions" className="text-xs">
							<Target className="mr-1 h-3 w-3" />
							Regiony mózgu
						</TabsTrigger>
						<TabsTrigger value="timeline" className="text-xs">
							<Clock className="mr-1 h-3 w-3" />
							Przebieg czasowy
						</TabsTrigger>
						<TabsTrigger value="overview" className="text-xs">
							<TrendingUp className="mr-1 h-3 w-3" />
							Podsumowanie
						</TabsTrigger>
					</TabsList>

					<TabsContent value="neurotransmitters" className="mt-6 space-y-6">
						<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
							{/* Radar Chart */}
							<Card>
								<CardHeader className="pb-4">
									<CardTitle className="text-base">
										Wpływ na neuroprzekaźniki
									</CardTitle>
								</CardHeader>
								<CardContent>
									<ResponsiveContainer width="100%" height={300}>
										<RadarChart data={radarData}>
											<PolarGrid />
											<PolarAngleAxis
												dataKey="neurotransmitter"
												tick={{ fontSize: 12 }}
												className="text-xs"
											/>
											<PolarRadiusAxis
												angle={90}
												domain={[0, 100]}
												tick={{ fontSize: 10 }}
											/>
											<Radar
												name="Wpływ"
												dataKey="effect"
												stroke="#3B82F6"
												fill="#3B82F6"
												fillOpacity={0.3}
												strokeWidth={2}
											/>
											<Radar
												name="Pewność"
												dataKey="confidence"
												stroke="#10B981"
												fill="transparent"
												strokeWidth={1}
												strokeDasharray="5 5"
											/>
											<Tooltip content={<CustomTooltip />} />
										</RadarChart>
									</ResponsiveContainer>
								</CardContent>
							</Card>

							{/* Detailed Effects List */}
							<Card>
								<CardHeader className="pb-4">
									<CardTitle className="text-base">
										Szczegółowe efekty
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="max-h-80 space-y-4 overflow-y-auto">
										{supplementData.neurotransmitterEffects.map(
											(effect, index) => (
												<div key={index} className="rounded-lg border p-3">
													<div className="mb-2 flex items-center justify-between">
														<h4 className="font-medium text-sm">
															{effect.polishNeurotransmitter}
														</h4>
														<Badge
															style={{
																backgroundColor: getEvidenceLevelColor(
																	effect.evidenceLevel,
																),
															}}
															className="text-white text-xs"
														>
															{getEvidenceLevelText(effect.evidenceLevel)}
														</Badge>
													</div>

													<div className="space-y-2">
														<div className="flex items-center gap-2">
															<span className="text-gray-600 text-xs">
																Wpływ:
															</span>
															<Progress
																value={Math.abs(effect.effect)}
																className="h-2 flex-1"
															/>
															<span
																className={cn(
																	"font-medium text-xs",
																	effect.effect > 0
																		? "text-green-600"
																		: "text-red-600",
																)}
															>
																{effect.effect > 0 ? "+" : ""}
																{effect.effect}%
															</span>
														</div>

														<div className="flex items-center gap-2">
															<span className="text-gray-600 text-xs">
																Pewność:
															</span>
															<Progress
																value={effect.confidence}
																className="h-2 flex-1"
															/>
															<span className="text-xs">
																{effect.confidence}%
															</span>
														</div>

														<div className="text-gray-600 text-xs">
															<div>
																<strong>Czas działania:</strong>{" "}
																{effect.polishTimeToEffect}
															</div>
															<div className="mt-1">
																<strong>Mechanizm:</strong>{" "}
																{effect.polishMechanism}
															</div>
														</div>
													</div>
												</div>
											),
										)}
									</div>
								</CardContent>
							</Card>
						</div>
					</TabsContent>

					<TabsContent value="brain-regions" className="mt-6">
						<Card>
							<CardHeader className="pb-4">
								<CardTitle className="text-base">
									Wpływ na regiony mózgu
								</CardTitle>
							</CardHeader>
							<CardContent>
								<ResponsiveContainer width="100%" height={400}>
									<BarChart data={brainRegionData} layout="horizontal">
										<CartesianGrid strokeDasharray="3 3" />
										<XAxis type="number" domain={[0, 100]} />
										<YAxis
											type="category"
											dataKey="region"
											width={120}
											tick={{ fontSize: 12 }}
										/>
										<Tooltip content={<CustomTooltip />} />
										<Bar
											dataKey="intensity"
											fill="#3B82F6"
											radius={[0, 4, 4, 0]}
										/>
									</BarChart>
								</ResponsiveContainer>

								<div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-3">
									{Object.entries(effectTypeColors).map(([type, color]) => (
										<div key={type} className="flex items-center gap-2 text-xs">
											<div
												className="h-3 w-3 rounded"
												style={{ backgroundColor: color }}
											/>
											<span>
												{type === "ENHANCES"
													? "Wzmacnia"
													: type === "MODULATES"
														? "Moduluje"
														: type === "PROTECTS"
															? "Chroni"
															: type === "STIMULATES"
																? "Stymuluje"
																: "Hamuje"}
											</span>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="timeline" className="mt-6">
						<Card>
							<CardHeader className="pb-4">
								<div className="flex items-center justify-between">
									<CardTitle className="text-base">
										Przebieg czasowy efektów
									</CardTitle>
									<Select
										value={selectedTimeframe}
										onValueChange={setSelectedTimeframe}
									>
										<SelectTrigger className="w-32">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="24h">24 godziny</SelectItem>
											<SelectItem value="7d">7 dni</SelectItem>
											<SelectItem value="30d">30 dni</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</CardHeader>
							<CardContent>
								<ResponsiveContainer width="100%" height={400}>
									<AreaChart data={timelineData}>
										<CartesianGrid strokeDasharray="3 3" />
										<XAxis dataKey="time" tick={{ fontSize: 12 }} />
										<YAxis domain={[0, 100]} />
										<Tooltip content={<CustomTooltip />} />
										<Area
											type="monotone"
											dataKey="Funkcje poznawcze"
											stackId="1"
											stroke="#3B82F6"
											fill="#3B82F6"
											fillOpacity={0.6}
										/>
										<Area
											type="monotone"
											dataKey="Nastrój"
											stackId="2"
											stroke="#10B981"
											fill="#10B981"
											fillOpacity={0.6}
										/>
										<Area
											type="monotone"
											dataKey="Energia"
											stackId="3"
											stroke="#F59E0B"
											fill="#F59E0B"
											fillOpacity={0.6}
										/>
										<Area
											type="monotone"
											dataKey="Koncentracja"
											stackId="4"
											stroke="#8B5CF6"
											fill="#8B5CF6"
											fillOpacity={0.6}
										/>
									</AreaChart>
								</ResponsiveContainer>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="overview" className="mt-6">
						<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
							{/* Overall Rating */}
							<Card>
								<CardHeader className="pb-4">
									<CardTitle className="flex items-center gap-2 text-base">
										<Star className="h-4 w-4 text-yellow-500" />
										Ogólna ocena
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="text-center">
										<div className="mb-2 font-bold text-3xl text-blue-600">
											{supplementData.overallRating.toFixed(1)}
										</div>
										<div className="mb-4 text-gray-600 text-sm">
											z 10 punktów
										</div>
										<Progress
											value={supplementData.overallRating * 10}
											className="h-3"
										/>
									</div>
								</CardContent>
							</Card>

							{/* Top Effects */}
							<Card>
								<CardHeader className="pb-4">
									<CardTitle className="flex items-center gap-2 text-base">
										<Zap className="h-4 w-4 text-yellow-500" />
										Najsilniejsze efekty
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="space-y-3">
										{supplementData.neurotransmitterEffects
											.sort((a, b) => Math.abs(b.effect) - Math.abs(a.effect))
											.slice(0, 3)
											.map((effect, index) => (
												<div
													key={index}
													className="flex items-center justify-between"
												>
													<span className="text-sm">
														{effect.polishNeurotransmitter}
													</span>
													<div className="flex items-center gap-2">
														<Progress
															value={Math.abs(effect.effect)}
															className="h-2 w-16"
														/>
														<span
															className={cn(
																"font-medium text-xs",
																effect.effect > 0
																	? "text-green-600"
																	: "text-red-600",
															)}
														>
															{effect.effect > 0 ? "+" : ""}
															{effect.effect}%
														</span>
													</div>
												</div>
											))}
									</div>
								</CardContent>
							</Card>

							{/* Evidence Summary */}
							<Card>
								<CardHeader className="pb-4">
									<CardTitle className="flex items-center gap-2 text-base">
										<Shield className="h-4 w-4 text-green-500" />
										Poziom dowodów
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="space-y-3">
										{["STRONG", "MODERATE", "WEAK", "INSUFFICIENT"].map(
											(level) => {
												const count =
													supplementData.neurotransmitterEffects.filter(
														(effect) => effect.evidenceLevel === level,
													).length;
												const percentage =
													(count /
														supplementData.neurotransmitterEffects.length) *
													100;

												return (
													<div
														key={level}
														className="flex items-center justify-between"
													>
														<span className="text-sm">
															{getEvidenceLevelText(level)}
														</span>
														<div className="flex items-center gap-2">
															<Progress
																value={percentage}
																className="h-2 w-16"
															/>
															<span className="text-xs">{count}</span>
														</div>
													</div>
												);
											},
										)}
									</div>
								</CardContent>
							</Card>
						</div>
					</TabsContent>
				</Tabs>
			</CardContent>
		</Card>
	);
};

export default SupplementEffectChart;
