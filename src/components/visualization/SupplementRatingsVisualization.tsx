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
	BarChart,
	PieChart,
	Star,
	TrendingDown,
	TrendingUp,
	Users,
} from "lucide-react";
import type React from "react";
import { useMemo, useState } from "react";
import {
	Bar,
	CartesianGrid,
	Cell,
	Pie,
	BarChart as RechartsBarChart,
	PieChart as RechartsPieChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

interface RatingData {
	supplementId: string;
	name: string;
	polishName: string;
	category: string;
	averageRating: number;
	totalReviews: number;
	ratingDistribution: {
		1: number;
		2: number;
		3: number;
		4: number;
		5: number;
	};
	recentTrend: "up" | "down" | "stable";
	helpfulVotes: number;
	verifiedReviews: number;
}

interface SupplementRatingsVisualizationProps {
	data: RatingData[];
	showTrends?: boolean;
	comparisonMode?: boolean;
	className?: string;
}

const SupplementRatingsVisualization: React.FC<
	SupplementRatingsVisualizationProps
> = ({ data, showTrends = true, comparisonMode = false, className = "" }) => {
	const [viewMode, setViewMode] = useState<
		"distribution" | "comparison" | "trends"
	>("distribution");
	const [selectedCategory, setSelectedCategory] = useState<string>("all");
	const [sortBy, setSortBy] = useState<"rating" | "reviews" | "trending">(
		"rating",
	);

	// Color schemes
	const categoryColors = {
		NOOTROPIC: "#3B82F6",
		VITAMIN: "#10B981",
		MINERAL: "#F59E0B",
		FATTY_ACID: "#8B5CF6",
		AMINO_ACID: "#EF4444",
		HERB: "#06B6D4",
		PROBIOTIC: "#84CC16",
		ENZYME: "#F97316",
	};

	const ratingColors = {
		1: "#EF4444",
		2: "#F97316",
		3: "#F59E0B",
		4: "#8B5CF6",
		5: "#10B981",
	};

	const getCategoryColor = (category: string) => {
		return categoryColors[category as keyof typeof categoryColors] || "#6B7280";
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

	// Filter and sort data
	const filteredData = useMemo(() => {
		const filtered =
			selectedCategory === "all"
				? data
				: data.filter((item) => item.category === selectedCategory);

		return filtered.sort((a, b) => {
			switch (sortBy) {
				case "reviews":
					return b.totalReviews - a.totalReviews;
				case "trending":
					if (a.recentTrend === "up" && b.recentTrend !== "up") return -1;
					if (a.recentTrend === "down" && b.recentTrend !== "down") return 1;
					return b.averageRating - a.averageRating;
				default:
					return b.averageRating - a.averageRating;
			}
		});
	}, [data, selectedCategory, sortBy]);

	// Prepare rating distribution data
	const distributionData = useMemo(() => {
		const total = filteredData.reduce(
			(sum, item) => sum + item.totalReviews,
			0,
		);
		return [5, 4, 3, 2, 1].map((rating) => ({
			rating: `${rating} ${rating === 1 ? "gwiazdka" : "gwiazdki"}`,
			count: filteredData.reduce(
				(sum, item) =>
					sum +
					item.ratingDistribution[
						rating as keyof typeof item.ratingDistribution
					],
				0,
			),
			percentage:
				total > 0
					? (filteredData.reduce(
							(sum, item) =>
								sum +
								item.ratingDistribution[
									rating as keyof typeof item.ratingDistribution
								],
							0,
						) /
							total) *
						100
					: 0,
			color: ratingColors[rating as keyof typeof ratingColors],
		}));
	}, [filteredData]);

	// Prepare comparison data
	const comparisonData = useMemo(() => {
		return filteredData.slice(0, 10).map((item) => ({
			name:
				item.polishName.length > 15
					? `${item.polishName.substring(0, 15)}...`
					: item.polishName,
			fullName: item.polishName,
			rating: item.averageRating,
			reviews: item.totalReviews,
			verified: item.verifiedReviews,
			color: getCategoryColor(item.category),
		}));
	}, [filteredData]);

	// Prepare trends data
	const trendsData = useMemo(() => {
		return filteredData
			.filter((item) => item.totalReviews >= 10)
			.slice(0, 8)
			.map((item) => ({
				name:
					item.polishName.length > 12
						? `${item.polishName.substring(0, 12)}...`
						: item.polishName,
				fullName: item.polishName,
				currentRating: item.averageRating,
				trend: item.recentTrend,
				change:
					item.recentTrend === "up"
						? 0.3
						: item.recentTrend === "down"
							? -0.2
							: 0,
				color: getCategoryColor(item.category),
			}));
	}, [filteredData]);

	// Custom tooltip
	const CustomTooltip = ({ active, payload, label }: any) => {
		if (active && payload && payload.length) {
			const data = payload[0].payload;
			return (
				<div className="rounded-lg border bg-white p-3 shadow-lg">
					<p className="mb-2 font-medium text-sm">{data.fullName || label}</p>
					<div className="space-y-1">
						<p className="text-xs">
							<span className="text-yellow-600">Ocena:</span>{" "}
							{data.rating || data.currentRating}/5
						</p>
						{data.reviews && (
							<p className="text-xs">
								<span className="text-blue-600">Recenzje:</span> {data.reviews}
							</p>
						)}
						{data.verified && (
							<p className="text-xs">
								<span className="text-green-600">Zweryfikowane:</span>{" "}
								{data.verified}
							</p>
						)}
					</div>
				</div>
			);
		}
		return null;
	};

	const categories = [...new Set(data.map((item) => item.category))];

	return (
		<Card className={cn("w-full", className)}>
			<CardHeader>
				<div className="flex items-center justify-between">
					<CardTitle className="flex items-center gap-2">
						<Star className="h-5 w-5" />
						Wizualizacja ocen suplementów
					</CardTitle>
					<div className="flex items-center gap-2">
						<Select
							value={selectedCategory}
							onValueChange={setSelectedCategory}
						>
							<SelectTrigger className="w-40">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">Wszystkie kategorie</SelectItem>
								{categories.map((category) => (
									<SelectItem key={category} value={category}>
										{getCategoryText(category)}
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						<Select
							value={sortBy}
							onValueChange={(value: any) => setSortBy(value)}
						>
							<SelectTrigger className="w-32">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="rating">Ocena</SelectItem>
								<SelectItem value="reviews">Recenzje</SelectItem>
								<SelectItem value="trending">Trendy</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
			</CardHeader>

			<CardContent>
				<Tabs
					value={viewMode}
					onValueChange={(value: any) => setViewMode(value)}
					className="w-full"
				>
					<TabsList className="grid w-full grid-cols-3">
						<TabsTrigger value="distribution" className="text-xs">
							<PieChart className="mr-1 h-3 w-3" />
							Rozkład
						</TabsTrigger>
						<TabsTrigger value="comparison" className="text-xs">
							<BarChart className="mr-1 h-3 w-3" />
							Porównanie
						</TabsTrigger>
						<TabsTrigger value="trends" className="text-xs">
							<TrendingUp className="mr-1 h-3 w-3" />
							Trendy
						</TabsTrigger>
					</TabsList>

					<TabsContent value="distribution" className="mt-6">
						<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
							{/* Rating Distribution Chart */}
							<Card>
								<CardHeader>
									<CardTitle className="text-base">Rozkład ocen</CardTitle>
								</CardHeader>
								<CardContent>
									<ResponsiveContainer width="100%" height={300}>
										<RechartsPieChart>
											<Pie
												data={distributionData}
												cx="50%"
												cy="50%"
												outerRadius={100}
												dataKey="count"
												label={(entry: any) =>
													`${entry.rating}: ${Number(entry.percentage).toFixed(1)}%`
												}
											>
												{distributionData.map((entry, index) => (
													<Cell key={`cell-${index}`} fill={entry.color} />
												))}
											</Pie>
											<Tooltip />
										</RechartsPieChart>
									</ResponsiveContainer>
								</CardContent>
							</Card>

							{/* Rating Distribution List */}
							<Card>
								<CardHeader>
									<CardTitle className="text-base">
										Szczegóły rozkładu
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										{distributionData.map((item) => (
											<div key={item.rating} className="space-y-2">
												<div className="flex items-center justify-between">
													<div className="flex items-center gap-2">
														<Star className="h-4 w-4 text-yellow-500" />
														<span className="font-medium text-sm">
															{item.rating}
														</span>
													</div>
													<div className="flex items-center gap-2">
														<span className="text-gray-600 text-sm">
															{item.count} recenzji
														</span>
														<span className="font-medium text-sm">
															({item.percentage.toFixed(1)}%)
														</span>
													</div>
												</div>
												<Progress value={item.percentage} className="h-2" />
											</div>
										))}
									</div>

									{/* Summary Stats */}
									<div className="mt-6 rounded-lg bg-gray-50 p-4">
										<div className="grid grid-cols-2 gap-4">
											<div className="text-center">
												<p className="text-gray-600 text-sm">Średnia ocena</p>
												<p className="font-bold text-lg">
													{(
														filteredData.reduce(
															(sum, item) => sum + item.averageRating,
															0,
														) / filteredData.length || 0
													).toFixed(1)}
													/5
												</p>
											</div>
											<div className="text-center">
												<p className="text-gray-600 text-sm">Łączne recenzje</p>
												<p className="font-bold text-lg">
													{filteredData.reduce(
														(sum, item) => sum + item.totalReviews,
														0,
													)}
												</p>
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						</div>
					</TabsContent>

					<TabsContent value="comparison" className="mt-6">
						<Card>
							<CardHeader>
								<CardTitle className="text-base">
									Porównanie ocen suplementów
								</CardTitle>
							</CardHeader>
							<CardContent>
								<ResponsiveContainer width="100%" height={400}>
									<RechartsBarChart data={comparisonData}>
										<CartesianGrid strokeDasharray="3 3" />
										<XAxis
											dataKey="name"
											tick={{ fontSize: 12 }}
											angle={-45}
											textAnchor="end"
											height={80}
										/>
										<YAxis domain={[0, 5]} />
										<Tooltip content={<CustomTooltip />} />
										<Bar dataKey="rating" radius={[4, 4, 0, 0]}>
											{comparisonData.map((entry, index) => (
												<Cell key={`cell-${index}`} fill={entry.color} />
											))}
										</Bar>
									</RechartsBarChart>
								</ResponsiveContainer>

								{/* Top Rated Supplements */}
								<div className="mt-6 space-y-3">
									{comparisonData.slice(0, 5).map((supplement, index) => (
										<div
											key={index}
											className="flex items-center justify-between rounded-lg border p-3"
										>
											<div className="flex items-center gap-3">
												<div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600 text-sm">
													{index + 1}
												</div>
												<div>
													<h4 className="font-medium text-sm">
														{supplement.fullName}
													</h4>
													<div className="flex items-center gap-2">
														<div className="flex items-center gap-1">
															<Star className="h-3 w-3 text-yellow-500" />
															<span className="text-xs">
																{supplement.rating.toFixed(1)}
															</span>
														</div>
														<span className="text-gray-600 text-xs">•</span>
														<span className="text-gray-600 text-xs">
															{supplement.reviews} recenzji
														</span>
													</div>
												</div>
											</div>
											<div className="text-right">
												<div className="flex items-center gap-1">
													<Users className="h-3 w-3 text-green-500" />
													<span className="text-xs">
														{supplement.verified} zweryfikowanych
													</span>
												</div>
											</div>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="trends" className="mt-6">
						<Card>
							<CardHeader>
								<CardTitle className="text-base">Trendy ocen</CardTitle>
							</CardHeader>
							<CardContent>
								<ResponsiveContainer width="100%" height={400}>
									<RechartsBarChart data={trendsData}>
										<CartesianGrid strokeDasharray="3 3" />
										<XAxis dataKey="name" tick={{ fontSize: 12 }} />
										<YAxis domain={[0, 5]} />
										<Tooltip content={<CustomTooltip />} />
										<Bar dataKey="currentRating" radius={[4, 4, 0, 0]}>
											{trendsData.map((entry, index) => (
												<Cell key={`cell-${index}`} fill={entry.color} />
											))}
										</Bar>
									</RechartsBarChart>
								</ResponsiveContainer>

								{/* Trend Indicators */}
								<div className="mt-6 space-y-3">
									{trendsData.map((supplement, index) => (
										<div
											key={index}
											className="flex items-center justify-between rounded-lg border p-3"
										>
											<div className="flex items-center gap-3">
												<div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600 text-sm">
													{index + 1}
												</div>
												<div>
													<h4 className="font-medium text-sm">
														{supplement.fullName}
													</h4>
													<p className="text-gray-600 text-xs">
														Aktualna ocena:{" "}
														{supplement.currentRating.toFixed(1)}/5
													</p>
												</div>
											</div>
											<div className="flex items-center gap-2">
												{supplement.trend === "up" && (
													<Badge className="bg-green-100 text-green-800">
														<TrendingUp className="mr-1 h-3 w-3" />
														Rosnący
													</Badge>
												)}
												{supplement.trend === "down" && (
													<Badge className="bg-red-100 text-red-800">
														<TrendingDown className="mr-1 h-3 w-3" />
														Spadający
													</Badge>
												)}
												{supplement.trend === "stable" && (
													<Badge variant="outline">Stabilny</Badge>
												)}
											</div>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</CardContent>
		</Card>
	);
};

export default SupplementRatingsVisualization;
