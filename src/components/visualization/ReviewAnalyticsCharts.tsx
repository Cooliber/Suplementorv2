"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
	BarChart,
	LineChart as LineChartIcon,
	MessageCircle,
	TrendingDown,
	TrendingUp,
	Users,
} from "lucide-react";
import type React from "react";
import { useMemo, useState } from "react";
import {
	Area,
	AreaChart,
	Bar,
	BarChart as RechartsBarChart,
	CartesianGrid,
	Cell,
	Line,
	LineChart as RechartsLineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

interface ReviewData {
	supplementId: string;
	name: string;
	polishName: string;
	category: string;

	// Time series data
	reviewsOverTime: {
		date: string;
		reviewCount: number;
		averageRating: number;
		helpfulVotes: number;
	}[];

	// Sentiment analysis
	sentimentDistribution: {
		positive: number;
		neutral: number;
		negative: number;
	};

	// Common themes
	commonWords: {
		word: string;
		polishWord: string;
		count: number;
		sentiment: "positive" | "negative" | "neutral";
	}[];

	// Review quality metrics
	averageReviewLength: number;
	verifiedReviewPercentage: number;
	helpfulVotePercentage: number;

	// Demographic insights
	ageDistribution: {
		"18-25": number;
		"26-35": number;
		"36-45": number;
		"46-55": number;
		"56+": number;
	};

	experienceLevel: {
		beginner: number;
		intermediate: number;
		advanced: number;
	};
}

interface ReviewAnalyticsChartsProps {
	data: ReviewData[];
	selectedSupplement?: string;
	onSupplementChange?: (supplementId: string) => void;
	className?: string;
}

const ReviewAnalyticsCharts: React.FC<ReviewAnalyticsChartsProps> = ({
	data,
	selectedSupplement,
	onSupplementChange,
	className = "",
}) => {
	const [activeTab, setActiveTab] = useState("trends");
	const [timeRange, setTimeRange] = useState<"30d" | "90d" | "1y" | "all">("90d");
	const [chartType, setChartType] = useState<"line" | "area" | "bar">("line");

	// Color schemes
	const sentimentColors = {
		positive: "#10B981",
		neutral: "#F59E0B",
		negative: "#EF4444",
	};

	const ageGroupColors = {
		"18-25": "#3B82F6",
		"26-35": "#10B981",
		"36-45": "#F59E0B",
		"46-55": "#8B5CF6",
		"56+": "#EF4444",
	};

	const getCategoryText = (category: string) => {
		const categories: Record<string, string> = {
			NOOTROPIC: "Nootropiki",
			VITAMIN: "Witaminy",
			MINERAL: "Minerały",
			FATTY_ACID: "Kwasy tłuszczowe",
			AMINO_ACID: "Aminokwasy",
			HERB: "Zioła",
			PROBIOTIC: "Probiotyki",
			ENZYME: "Enzymy",
		};
		return categories[category] || category;
	};

	// Get current supplement data
	const currentSupplement = useMemo(() => {
		if (selectedSupplement) {
			return data.find(item => item.supplementId === selectedSupplement);
		}
		return data[0];
	}, [data, selectedSupplement]);

	// Filter time series data based on selected range
	const filteredTimeData = useMemo(() => {
		if (!currentSupplement) return [];

		let days = 90;
		if (timeRange === "30d") days = 30;
		else if (timeRange === "1y") days = 365;
		else if (timeRange === "all") days = 1000;

		const cutoffDate = new Date();
		cutoffDate.setDate(cutoffDate.getDate() - days);

		return currentSupplement.reviewsOverTime
			.filter(item => new Date(item.date) >= cutoffDate)
			.map(item => ({
				...item,
				date: new Date(item.date).toLocaleDateString('pl-PL', { month: 'short', day: 'numeric' }),
			}));
	}, [currentSupplement, timeRange]);

	// Prepare sentiment data
	const sentimentData = useMemo(() => {
		if (!currentSupplement) return [];

		const total = currentSupplement.sentimentDistribution.positive +
					 currentSupplement.sentimentDistribution.neutral +
					 currentSupplement.sentimentDistribution.negative;

		return [
			{
				sentiment: "Pozytywne",
				count: currentSupplement.sentimentDistribution.positive,
				percentage: total > 0 ? (currentSupplement.sentimentDistribution.positive / total * 100) : 0,
				color: sentimentColors.positive,
			},
			{
				sentiment: "Neutralne",
				count: currentSupplement.sentimentDistribution.neutral,
				percentage: total > 0 ? (currentSupplement.sentimentDistribution.neutral / total * 100) : 0,
				color: sentimentColors.neutral,
			},
			{
				sentiment: "Negatywne",
				count: currentSupplement.sentimentDistribution.negative,
				percentage: total > 0 ? (currentSupplement.sentimentDistribution.negative / total * 100) : 0,
				color: sentimentColors.negative,
			},
		];
	}, [currentSupplement]);

	// Prepare word frequency data
	const wordData = useMemo(() => {
		if (!currentSupplement) return [];

		return currentSupplement.commonWords
			.slice(0, 10)
			.map(word => ({
				word: word.polishWord,
				count: word.count,
				sentiment: word.sentiment,
				color: sentimentColors[word.sentiment],
			}));
	}, [currentSupplement]);

	// Prepare demographic data
	const ageData = useMemo(() => {
		if (!currentSupplement) return [];

		return Object.entries(currentSupplement.ageDistribution).map(([age, count]) => ({
			age: age === "18-25" ? "18-25" : age === "26-35" ? "26-35" : age === "36-45" ? "36-45" : age === "46-55" ? "46-55" : "56+",
			count,
			color: ageGroupColors[age as keyof typeof ageGroupColors],
		}));
	}, [currentSupplement]);

	// Custom tooltip
	const CustomTooltip = ({ active, payload, label }: any) => {
		if (active && payload && payload.length) {
			return (
				<div className="rounded-lg border bg-white p-3 shadow-lg">
					<p className="mb-2 font-medium text-sm">{label}</p>
					{payload.map((entry: any, index: number) => (
						<p key={index} className="text-xs" style={{ color: entry.color }}>
							{entry.name}: {entry.value}
							{entry.name === "reviewCount" && " recenzji"}
							{entry.name === "averageRating" && "/5"}
							{entry.name === "helpfulVotes" && " pomocnych"}
						</p>
					))}
				</div>
			);
		}
		return null;
	};

	if (!currentSupplement) {
		return (
			<Card className={cn("w-full", className)}>
				<CardContent className="flex items-center justify-center py-12">
					<p className="text-gray-600">Brak danych o recenzjach</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className={cn("w-full", className)}>
			<CardHeader>
				<div className="flex items-center justify-between">
					<CardTitle className="flex items-center gap-2">
						<MessageCircle className="h-5 w-5" />
						Analiza recenzji
					</CardTitle>
					<div className="flex items-center gap-2">
						<Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
							<SelectTrigger className="w-32">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="30d">30 dni</SelectItem>
								<SelectItem value="90d">90 dni</SelectItem>
								<SelectItem value="1y">1 rok</SelectItem>
								<SelectItem value="all">Wszystko</SelectItem>
							</SelectContent>
						</Select>

						{onSupplementChange && (
							<Select value={selectedSupplement || currentSupplement.supplementId} onValueChange={onSupplementChange}>
								<SelectTrigger className="w-48">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{data.map(supplement => (
										<SelectItem key={supplement.supplementId} value={supplement.supplementId}>
											{supplement.polishName}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						)}
					</div>
				</div>
			</CardHeader>

			<CardContent>
				<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
					<TabsList className="grid w-full grid-cols-4">
						<TabsTrigger value="trends" className="text-xs">
							<LineChartIcon className="mr-1 h-3 w-3" />
							Trendy
						</TabsTrigger>
						<TabsTrigger value="sentiment" className="text-xs">
							<BarChart className="mr-1 h-3 w-3" />
							Sentiment
						</TabsTrigger>
						<TabsTrigger value="words" className="text-xs">
							<MessageCircle className="mr-1 h-3 w-3" />
							Słowa kluczowe
						</TabsTrigger>
						<TabsTrigger value="demographics" className="text-xs">
							<Users className="mr-1 h-3 w-3" />
							Demografia
						</TabsTrigger>
					</TabsList>

					<TabsContent value="trends" className="mt-6">
						<Card>
							<CardHeader>
								<CardTitle className="text-base">Trendy recenzji w czasie</CardTitle>
							</CardHeader>
							<CardContent>
								<ResponsiveContainer width="100%" height={400}>
									{chartType === "line" ? (
										<RechartsLineChart data={filteredTimeData}>
											<CartesianGrid strokeDasharray="3 3" />
											<XAxis dataKey="date" tick={{ fontSize: 12 }} />
											<YAxis yAxisId="left" />
											<YAxis yAxisId="right" orientation="right" />
											<Tooltip content={<CustomTooltip />} />
											<Line
												yAxisId="left"
												type="monotone"
												dataKey="reviewCount"
												stroke="#3B82F6"
												strokeWidth={2}
												name="Liczba recenzji"
											/>
											<Line
												yAxisId="right"
												type="monotone"
												dataKey="averageRating"
												stroke="#10B981"
												strokeWidth={2}
												name="Średnia ocena"
											/>
										</RechartsLineChart>
									) : chartType === "area" ? (
										<AreaChart data={filteredTimeData}>
											<CartesianGrid strokeDasharray="3 3" />
											<XAxis dataKey="date" tick={{ fontSize: 12 }} />
											<YAxis />
											<Tooltip content={<CustomTooltip />} />
											<Area
												type="monotone"
												dataKey="reviewCount"
												stackId="1"
												stroke="#3B82F6"
												fill="#3B82F6"
												fillOpacity={0.6}
												name="Liczba recenzji"
											/>
										</AreaChart>
									) : (
										<RechartsBarChart data={filteredTimeData}>
											<CartesianGrid strokeDasharray="3 3" />
											<XAxis dataKey="date" tick={{ fontSize: 12 }} />
											<YAxis />
											<Tooltip content={<CustomTooltip />} />
											<Bar dataKey="reviewCount" fill="#3B82F6" name="Liczba recenzji" />
										</RechartsBarChart>
									)}
								</ResponsiveContainer>

								{/* Trend Summary */}
								<div className="mt-4 grid grid-cols-3 gap-4">
									<div className="text-center">
										<p className="text-gray-600 text-sm">Średnia ocena</p>
										<p className="font-bold text-lg">
											{(filteredTimeData.reduce((sum, item) => sum + item.averageRating, 0) / filteredTimeData.length || 0).toFixed(1)}/5
										</p>
									</div>
									<div className="text-center">
										<p className="text-gray-600 text-sm">Łączne recenzje</p>
										<p className="font-bold text-lg">
											{filteredTimeData.reduce((sum, item) => sum + item.reviewCount, 0)}
										</p>
									</div>
									<div className="text-center">
										<p className="text-gray-600 text-sm">Głosy pomocne</p>
										<p className="font-bold text-lg">
											{filteredTimeData.reduce((sum, item) => sum + item.helpfulVotes, 0)}
										</p>
									</div>
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="sentiment" className="mt-6">
						<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
							{/* Sentiment Distribution */}
							<Card>
								<CardHeader>
									<CardTitle className="text-base">Rozkład sentymentu</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										{sentimentData.map((item) => (
											<div key={item.sentiment} className="space-y-2">
												<div className="flex items-center justify-between">
													<span className="font-medium text-sm">{item.sentiment}</span>
													<div className="flex items-center gap-2">
														<span className="text-gray-600 text-sm">{item.count} recenzji</span>
														<span className="font-medium text-sm">({item.percentage.toFixed(1)}%)</span>
													</div>
												</div>
												<div className="h-3 w-full rounded-full bg-gray-200">
													<div
														className="h-full rounded-full"
														style={{
															width: `${item.percentage}%`,
															backgroundColor: item.color,
														}}
													/>
												</div>
											</div>
										))}
									</div>
								</CardContent>
							</Card>

							{/* Quality Metrics */}
							<Card>
								<CardHeader>
									<CardTitle className="text-base">Jakość recenzji</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										<div className="flex items-center justify-between">
											<span className="font-medium text-sm">Recenzje zweryfikowane</span>
											<span className="font-bold text-sm">{currentSupplement.verifiedReviewPercentage}%</span>
										</div>
										<div className="h-2 w-full rounded-full bg-gray-200">
											<div
												className="h-full rounded-full bg-green-500"
												style={{ width: `${currentSupplement.verifiedReviewPercentage}%` }}
											/>
										</div>

										<div className="flex items-center justify-between">
											<span className="font-medium text-sm">Głosy "pomocne"</span>
											<span className="font-bold text-sm">{currentSupplement.helpfulVotePercentage}%</span>
										</div>
										<div className="h-2 w-full rounded-full bg-gray-200">
											<div
												className="h-full rounded-full bg-blue-500"
												style={{ width: `${currentSupplement.helpfulVotePercentage}%` }}
											/>
										</div>

										<div className="flex items-center justify-between">
											<span className="font-medium text-sm">Średnia długość recenzji</span>
											<span className="font-bold text-sm">{currentSupplement.averageReviewLength} słów</span>
										</div>
									</div>
								</CardContent>
							</Card>
						</div>
					</TabsContent>

					<TabsContent value="words" className="mt-6">
						<Card>
							<CardHeader>
								<CardTitle className="text-base">Najczęściej używane słowa</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-3">
									{wordData.map((word, index) => (
										<div key={index} className="flex items-center justify-between rounded-lg border p-3">
											<div className="flex items-center gap-3">
												<div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600 text-sm">
													{index + 1}
												</div>
												<div>
													<h4 className="font-medium text-sm">{word.word}</h4>
													<p className="text-gray-600 text-xs">{word.count} wystąpień</p>
												</div>
											</div>
											<div className="flex items-center gap-2">
												<Badge
													style={{ backgroundColor: word.color }}
													className="text-white text-xs"
												>
													{word.sentiment === "positive" ? "Pozytywne" : word.sentiment === "negative" ? "Negatywne" : "Neutralne"}
												</Badge>
											</div>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="demographics" className="mt-6">
						<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
							{/* Age Distribution */}
							<Card>
								<CardHeader>
									<CardTitle className="text-base">Rozkład wieku</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="space-y-3">
										{ageData.map((age) => (
											<div key={age.age} className="space-y-2">
												<div className="flex items-center justify-between">
													<span className="font-medium text-sm">{age.age} lat</span>
													<span className="font-bold text-sm">{age.count}%</span>
												</div>
												<div className="h-2 w-full rounded-full bg-gray-200">
													<div
														className="h-full rounded-full"
														style={{
															width: `${age.count}%`,
															backgroundColor: age.color,
														}}
													/>
												</div>
											</div>
										))}
									</div>
								</CardContent>
							</Card>

							{/* Experience Level */}
							<Card>
								<CardHeader>
									<CardTitle className="text-base">Poziom doświadczenia</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										<div className="flex items-center justify-between">
											<span className="font-medium text-sm">Początkujący</span>
											<span className="font-bold text-sm">{currentSupplement.experienceLevel.beginner}%</span>
										</div>
										<div className="h-2 w-full rounded-full bg-gray-200">
											<div
												className="h-full rounded-full bg-green-500"
												style={{ width: `${currentSupplement.experienceLevel.beginner}%` }}
											/>
										</div>

										<div className="flex items-center justify-between">
											<span className="font-medium text-sm">Średniozaawansowani</span>
											<span className="font-bold text-sm">{currentSupplement.experienceLevel.intermediate}%</span>
										</div>
										<div className="h-2 w-full rounded-full bg-gray-200">
											<div
												className="h-full rounded-full bg-blue-500"
												style={{ width: `${currentSupplement.experienceLevel.intermediate}%` }}
											/>
										</div>

										<div className="flex items-center justify-between">
											<span className="font-medium text-sm">Zaawansowani</span>
											<span className="font-bold text-sm">{currentSupplement.experienceLevel.advanced}%</span>
										</div>
										<div className="h-2 w-full rounded-full bg-gray-200">
											<div
												className="h-full rounded-full bg-purple-500"
												style={{ width: `${currentSupplement.experienceLevel.advanced}%` }}
											/>
										</div>
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

export default ReviewAnalyticsCharts;