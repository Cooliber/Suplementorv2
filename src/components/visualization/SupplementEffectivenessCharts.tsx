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
	TrendingUp,
	Zap,
} from "lucide-react";
import type React from "react";
import { useMemo, useState } from "react";
import {
	Area,
	AreaChart,
	Bar,
	CartesianGrid,
	Cell,
	Line,
	BarChart as RechartsBarChart,
	LineChart as RechartsLineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

interface EffectivenessData {
	supplementId: string;
	name: string;
	polishName: string;
	category: string;
	overallEffectiveness: number;
	conditions: {
		condition: string;
		polishCondition: string;
		effectiveness: number;
		evidenceLevel: string;
		studyCount: number;
	}[];
	evidenceLevel: string;
	confidence: number;
}

interface SupplementEffectivenessChartsProps {
	data: EffectivenessData[];
	comparisonMode?: boolean;
	selectedSupplements?: string[];
	onSupplementSelect?: (supplementId: string) => void;
	className?: string;
}

const SupplementEffectivenessCharts: React.FC<
	SupplementEffectivenessChartsProps
> = ({
	data,
	comparisonMode = false,
	selectedSupplements = [],
	onSupplementSelect,
	className = "",
}) => {
	const [chartType, setChartType] = useState<"bar" | "line" | "area">("bar");
	const [viewMode, setViewMode] = useState<
		"overall" | "byCondition" | "byCategory"
	>("overall");
	const [selectedCategory, setSelectedCategory] = useState<string>("all");

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

	const evidenceColors = {
		STRONG: "#10B981",
		MODERATE: "#F59E0B",
		WEAK: "#EF4444",
		INSUFFICIENT: "#6B7280",
		CONFLICTING: "#DC2626",
	};

	const getCategoryColor = (category: string) => {
		return categoryColors[category as keyof typeof categoryColors] || "#6B7280";
	};

	const getEvidenceColor = (level: string) => {
		return evidenceColors[level as keyof typeof evidenceColors] || "#6B7280";
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

	const getEvidenceText = (level: string) => {
		const levels: Record<string, string> = {
			STRONG: "Silne",
			MODERATE: "Umiarkowane",
			WEAK: "Słabe",
			INSUFFICIENT: "Niewystarczające",
			CONFLICTING: "Sprzeczne",
		};
		return levels[level] || level;
	};

	// Filter data by category
	const filteredData = useMemo(() => {
		if (selectedCategory === "all") return data;
		return data.filter((item) => item.category === selectedCategory);
	}, [data, selectedCategory]);

	// Prepare overall effectiveness data
	const overallData = useMemo(() => {
		return filteredData
			.sort((a, b) => b.overallEffectiveness - a.overallEffectiveness)
			.slice(0, 15)
			.map((item) => ({
				name:
					item.polishName.length > 12
						? `${item.polishName.substring(0, 12)}...`
						: item.polishName,
				fullName: item.polishName,
				effectiveness: item.overallEffectiveness,
				category: item.category,
				evidenceLevel: item.evidenceLevel,
				confidence: item.confidence,
				color: getCategoryColor(item.category),
			}));
	}, [filteredData]);

	// Prepare category comparison data
	const categoryData = useMemo(() => {
		const categories = [...new Set(data.map((item) => item.category))];
		return categories
			.map((category) => {
				const categoryItems = data.filter((item) => item.category === category);
				const avgEffectiveness =
					categoryItems.reduce(
						(sum, item) => sum + item.overallEffectiveness,
						0,
					) / categoryItems.length;
				const avgConfidence =
					categoryItems.reduce((sum, item) => sum + item.confidence, 0) /
					categoryItems.length;

				return {
					category: getCategoryText(category),
					effectiveness: Number(avgEffectiveness.toFixed(1)),
					confidence: Number(avgConfidence.toFixed(1)),
					count: categoryItems.length,
					color: getCategoryColor(category),
				};
			})
			.sort((a, b) => b.effectiveness - a.effectiveness);
	}, [data]);

	// Prepare condition-based data
	const conditionData = useMemo(() => {
		const conditions = [
			...new Set(
				data.flatMap((item) => item.conditions.map((c) => c.polishCondition)),
			),
		];
		return conditions
			.slice(0, 10)
			.map((condition) => {
				const relevantData = data.filter((item) =>
					item.conditions.some((c) => c.polishCondition === condition),
				);

				const avgEffectiveness =
					relevantData.reduce((sum, item) => {
						const conditionEffect = item.conditions.find(
							(c) => c.polishCondition === condition,
						);
						return sum + (conditionEffect?.effectiveness || 0);
					}, 0) / relevantData.length;

				return {
					condition,
					effectiveness: Number(avgEffectiveness.toFixed(1)),
					supplementCount: relevantData.length,
				};
			})
			.sort((a, b) => b.effectiveness - a.effectiveness);
	}, [data]);

	// Custom tooltip
	const CustomTooltip = ({ active, payload, label }: any) => {
		if (active && payload && payload.length) {
			const data = payload[0].payload;
			return (
				<div className="rounded-lg border bg-white p-3 shadow-lg">
					<p className="mb-2 font-medium text-sm">{data.fullName || label}</p>
					<div className="space-y-1">
						<p className="text-xs">
							<span className="text-blue-600">Skuteczność:</span>{" "}
							{data.effectiveness}/10
						</p>
						{data.confidence && (
							<p className="text-xs">
								<span className="text-green-600">Pewność:</span>{" "}
								{data.confidence}%
							</p>
						)}
						{data.evidenceLevel && (
							<Badge
								style={{
									backgroundColor: getEvidenceColor(data.evidenceLevel),
								}}
								className="text-white text-xs"
							>
								{getEvidenceText(data.evidenceLevel)}
							</Badge>
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
						<TrendingUp className="h-5 w-5" />
						Analiza skuteczności suplementów
					</CardTitle>
					<div className="flex items-center gap-2">
						<Select
							value={chartType}
							onValueChange={(value: any) => setChartType(value)}
						>
							<SelectTrigger className="w-32">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="bar">Wykres słupkowy</SelectItem>
								<SelectItem value="line">Wykres liniowy</SelectItem>
								<SelectItem value="area">Wykres obszarowy</SelectItem>
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
								<SelectItem value="all">Wszystkie kategorie</SelectItem>
								{categories.map((category) => (
									<SelectItem key={category} value={category}>
										{getCategoryText(category)}
									</SelectItem>
								))}
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
						<TabsTrigger value="overall" className="text-xs">
							<BarChart className="mr-1 h-3 w-3" />
							Porównanie
						</TabsTrigger>
						<TabsTrigger value="byCategory" className="text-xs">
							<Zap className="mr-1 h-3 w-3" />
							Kategorie
						</TabsTrigger>
						<TabsTrigger value="byCondition" className="text-xs">
							<LineChartIcon className="mr-1 h-3 w-3" />
							Zastosowania
						</TabsTrigger>
					</TabsList>

					<TabsContent value="overall" className="mt-6">
						<Card>
							<CardHeader>
								<CardTitle className="text-base">
									Najskuteczniejsze suplementy
								</CardTitle>
							</CardHeader>
							<CardContent>
								<ResponsiveContainer width="100%" height={400}>
									{chartType === "bar" ? (
										<RechartsBarChart data={overallData}>
											<CartesianGrid strokeDasharray="3 3" />
											<XAxis
												dataKey="name"
												tick={{ fontSize: 12 }}
												angle={-45}
												textAnchor="end"
												height={80}
											/>
											<YAxis domain={[0, 10]} />
											<Tooltip content={<CustomTooltip />} />
											<Bar dataKey="effectiveness" radius={[4, 4, 0, 0]}>
												{overallData.map((entry, index) => (
													<Cell key={`cell-${index}`} fill={entry.color} />
												))}
											</Bar>
										</RechartsBarChart>
									) : chartType === "line" ? (
										<RechartsLineChart data={overallData}>
											<CartesianGrid strokeDasharray="3 3" />
											<XAxis dataKey="name" tick={{ fontSize: 12 }} />
											<YAxis domain={[0, 10]} />
											<Tooltip content={<CustomTooltip />} />
											<Line
												type="monotone"
												dataKey="effectiveness"
												stroke="#3B82F6"
												strokeWidth={3}
												dot={{ fill: "#3B82F6", strokeWidth: 2, r: 6 }}
											/>
										</RechartsLineChart>
									) : (
										<AreaChart data={overallData}>
											<CartesianGrid strokeDasharray="3 3" />
											<XAxis dataKey="name" tick={{ fontSize: 12 }} />
											<YAxis domain={[0, 10]} />
											<Tooltip content={<CustomTooltip />} />
											<Area
												type="monotone"
												dataKey="effectiveness"
												stroke="#3B82F6"
												fill="#3B82F6"
												fillOpacity={0.3}
											/>
										</AreaChart>
									)}
								</ResponsiveContainer>

								{/* Legend */}
								<div className="mt-4 flex flex-wrap gap-4">
									{overallData.slice(0, 5).map((item, index) => (
										<div
											key={index}
											className="flex items-center gap-2 text-xs"
										>
											<div
												className="h-3 w-3 rounded"
												style={{ backgroundColor: item.color }}
											/>
											<span>{item.fullName}</span>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="byCategory" className="mt-6">
						<Card>
							<CardHeader>
								<CardTitle className="text-base">
									Skuteczność według kategorii
								</CardTitle>
							</CardHeader>
							<CardContent>
								<ResponsiveContainer width="100%" height={400}>
									<RechartsBarChart data={categoryData} layout="horizontal">
										<CartesianGrid strokeDasharray="3 3" />
										<XAxis type="number" domain={[0, 10]} />
										<YAxis
											type="category"
											dataKey="category"
											width={100}
											tick={{ fontSize: 12 }}
										/>
										<Tooltip content={<CustomTooltip />} />
										<Bar dataKey="effectiveness" radius={[0, 4, 4, 0]}>
											{categoryData.map((entry, index) => (
												<Cell key={`cell-${index}`} fill={entry.color} />
											))}
										</Bar>
									</RechartsBarChart>
								</ResponsiveContainer>

								{/* Category Statistics */}
								<div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
									{categoryData.slice(0, 4).map((category, index) => (
										<div key={index} className="rounded-lg border p-3">
											<div className="mb-2 flex items-center gap-2">
												<div
													className="h-3 w-3 rounded"
													style={{ backgroundColor: category.color }}
												/>
												<span className="font-medium text-sm">
													{category.category}
												</span>
											</div>
											<div className="space-y-1">
												<div className="flex justify-between text-xs">
													<span>Skuteczność:</span>
													<span className="font-medium">
														{category.effectiveness}/10
													</span>
												</div>
												<div className="flex justify-between text-xs">
													<span>Suplementy:</span>
													<span className="font-medium">{category.count}</span>
												</div>
											</div>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="byCondition" className="mt-6">
						<Card>
							<CardHeader>
								<CardTitle className="text-base">
									Skuteczność według zastosowań
								</CardTitle>
							</CardHeader>
							<CardContent>
								<ResponsiveContainer width="100%" height={400}>
									<RechartsLineChart data={conditionData}>
										<CartesianGrid strokeDasharray="3 3" />
										<XAxis
											dataKey="condition"
											tick={{ fontSize: 10 }}
											angle={-45}
											textAnchor="end"
											height={80}
										/>
										<YAxis domain={[0, 10]} />
										<Tooltip content={<CustomTooltip />} />
										<Line
											type="monotone"
											dataKey="effectiveness"
											stroke="#10B981"
											strokeWidth={3}
											dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
										/>
									</RechartsLineChart>
								</ResponsiveContainer>

								{/* Top Conditions */}
								<div className="mt-4 space-y-2">
									{conditionData.slice(0, 5).map((condition, index) => (
										<div
											key={index}
											className="flex items-center justify-between rounded-lg border p-2"
										>
											<span className="font-medium text-sm">
												{condition.condition}
											</span>
											<div className="flex items-center gap-2">
												<span className="text-gray-600 text-xs">
													{condition.supplementCount} suplementów
												</span>
												<div className="flex items-center gap-1">
													<div className="h-2 w-16 rounded-full bg-gray-200">
														<div
															className="h-full rounded-full bg-green-500"
															style={{
																width: `${(condition.effectiveness / 10) * 100}%`,
															}}
														/>
													</div>
													<span className="font-medium text-sm">
														{condition.effectiveness}
													</span>
												</div>
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

export default SupplementEffectivenessCharts;
