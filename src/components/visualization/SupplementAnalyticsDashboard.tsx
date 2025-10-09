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
	BarChart3,
	Download,
	Filter,
	LineChart,
	PieChart,
	RefreshCw,
	Star,
	TrendingUp,
	Users,
	Zap,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import SupplementEffectivenessCharts from "./SupplementEffectivenessCharts";
import SupplementRatingsVisualization from "./SupplementRatingsVisualization";
import SupplementComparisonTools from "./SupplementComparisonTools";
import DosageSafetyVisualization from "./DosageSafetyVisualization";
import ReviewAnalyticsCharts from "./ReviewAnalyticsCharts";
import AnalyticsExportUtils from "./AnalyticsExportUtils";

interface SupplementAnalyticsData {
	supplementId: string;
	name: string;
	polishName: string;
	category: string;
	averageEffectiveness: number;
	averageRating: number;
	totalReviews: number;
	evidenceLevel: "STRONG" | "MODERATE" | "WEAK" | "INSUFFICIENT" | "CONFLICTING";
	sideEffectCount: number;
	interactionCount: number;
	monthlyCost: number;
	popularityScore: number;
}

interface AnalyticsFilters {
	category?: string;
	evidenceLevel?: string;
	minRating?: number;
	maxCost?: number;
}

interface SupplementAnalyticsDashboardProps {
	data: SupplementAnalyticsData[];
	isLoading?: boolean;
	onExport?: (format: "csv" | "pdf" | "json") => void;
	onRefresh?: () => void;
	className?: string;
}

const SupplementAnalyticsDashboard: React.FC<SupplementAnalyticsDashboardProps> = ({
	data,
	isLoading = false,
	onExport,
	onRefresh,
	className = "",
}) => {
	const [activeTab, setActiveTab] = useState("overview");
	const [filters, setFilters] = useState<AnalyticsFilters>({});
	const [sortBy, setSortBy] = useState<"effectiveness" | "rating" | "popularity" | "cost">("effectiveness");

	// Filter and sort data
	const filteredData = data.filter((item) => {
		if (filters.category && item.category !== filters.category) return false;
		if (filters.evidenceLevel && item.evidenceLevel !== filters.evidenceLevel) return false;
		if (filters.minRating && item.averageRating < filters.minRating) return false;
		if (filters.maxCost && item.monthlyCost > filters.maxCost) return false;
		return true;
	}).sort((a, b) => {
		switch (sortBy) {
			case "rating":
				return b.averageRating - a.averageRating;
			case "popularity":
				return b.popularityScore - a.popularityScore;
			case "cost":
				return a.monthlyCost - b.monthlyCost;
			default:
				return b.averageEffectiveness - a.averageEffectiveness;
		}
	});

	const categories = [...new Set(data.map(item => item.category))];
	const evidenceLevels = [...new Set(data.map(item => item.evidenceLevel))];

	const getCategoryColor = (category: string) => {
		const colors: Record<string, string> = {
			NOOTROPIC: "#3B82F6",
			VITAMIN: "#10B981",
			MINERAL: "#F59E0B",
			FATTY_ACID: "#8B5CF6",
			AMINO_ACID: "#EF4444",
			HERB: "#06B6D4",
			PROBIOTIC: "#84CC16",
			ENZYME: "#F97316",
		};
		return colors[category] || "#6B7280";
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
			case "CONFLICTING":
				return "#DC2626";
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
			CONFLICTING: "Sprzeczne",
		};
		return levels[level] || level;
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

	// Statistics calculations
	const stats = {
		totalSupplements: data.length,
		averageEffectiveness: data.reduce((sum, item) => sum + item.averageEffectiveness, 0) / data.length || 0,
		averageRating: data.reduce((sum, item) => sum + item.averageRating, 0) / data.length || 0,
		totalReviews: data.reduce((sum, item) => sum + item.totalReviews, 0),
		averageCost: data.reduce((sum, item) => sum + item.monthlyCost, 0) / data.length || 0,
	};

	return (
		<Card className={cn("w-full", className)}>
			<CardHeader>
				<div className="flex items-center justify-between">
					<CardTitle className="flex items-center gap-2">
						<BarChart3 className="h-5 w-5" />
						Analizy suplementów
					</CardTitle>
					<div className="flex items-center gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={onRefresh}
							disabled={isLoading}
						>
							<RefreshCw className={cn("h-3 w-3", isLoading && "animate-spin")} />
						</Button>
						<AnalyticsExportUtils
							data={filteredData}
							filename="supplement-analytics"
							title="Raport analityczny suplementów"
							onExport={onExport}
						/>
					</div>
				</div>

				{/* Filters */}
				<div className="flex flex-wrap gap-2 pt-4">
					<Select
						value={filters.category || ""}
						onValueChange={(value) => setFilters(prev => ({ ...prev, category: value || undefined }))}
					>
						<SelectTrigger className="w-40">
							<SelectValue placeholder="Kategoria" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="">Wszystkie</SelectItem>
							{categories.map(category => (
								<SelectItem key={category} value={category}>
									{getCategoryText(category)}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					<Select
						value={filters.evidenceLevel || ""}
						onValueChange={(value) => setFilters(prev => ({ ...prev, evidenceLevel: value || undefined }))}
					>
						<SelectTrigger className="w-40">
							<SelectValue placeholder="Poziom dowodów" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="">Wszystkie</SelectItem>
							{evidenceLevels.map(level => (
								<SelectItem key={level} value={level}>
									{getEvidenceLevelText(level)}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					<Select
						value={sortBy}
						onValueChange={(value: any) => setSortBy(value)}
					>
						<SelectTrigger className="w-40">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="effectiveness">Skuteczność</SelectItem>
							<SelectItem value="rating">Ocena</SelectItem>
							<SelectItem value="popularity">Popularność</SelectItem>
							<SelectItem value="cost">Koszt</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</CardHeader>

			<CardContent>
				<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
					<TabsList className="grid w-full grid-cols-6">
						<TabsTrigger value="overview" className="text-xs">
							<TrendingUp className="mr-1 h-3 w-3" />
							Przegląd
						</TabsTrigger>
						<TabsTrigger value="effectiveness" className="text-xs">
							<Zap className="mr-1 h-3 w-3" />
							Skuteczność
						</TabsTrigger>
						<TabsTrigger value="ratings" className="text-xs">
							<Star className="mr-1 h-3 w-3" />
							Oceny
						</TabsTrigger>
						<TabsTrigger value="safety" className="text-xs">
							<Filter className="mr-1 h-3 w-3" />
							Bezpieczeństwo
						</TabsTrigger>
						<TabsTrigger value="comparison" className="text-xs">
							<BarChart3 className="mr-1 h-3 w-3" />
							Porównanie
						</TabsTrigger>
						<TabsTrigger value="reviews" className="text-xs">
							<Users className="mr-1 h-3 w-3" />
							Recenzje
						</TabsTrigger>
					</TabsList>

					<TabsContent value="overview" className="mt-6">
						{/* Statistics Cards */}
						<div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
							<Card>
								<CardContent className="p-4">
									<div className="flex items-center justify-between">
										<div>
											<p className="text-gray-600 text-sm">Suplementy</p>
											<p className="font-bold text-lg">{stats.totalSupplements}</p>
										</div>
										<PieChart className="h-4 w-4 text-blue-500" />
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardContent className="p-4">
									<div className="flex items-center justify-between">
										<div>
											<p className="text-gray-600 text-sm">Średnia skuteczność</p>
											<p className="font-bold text-lg">{stats.averageEffectiveness.toFixed(1)}/10</p>
										</div>
										<TrendingUp className="h-4 w-4 text-green-500" />
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardContent className="p-4">
									<div className="flex items-center justify-between">
										<div>
											<p className="text-gray-600 text-sm">Średnia ocena</p>
											<p className="font-bold text-lg">{stats.averageRating.toFixed(1)}/5</p>
										</div>
										<Star className="h-4 w-4 text-yellow-500" />
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardContent className="p-4">
									<div className="flex items-center justify-between">
										<div>
											<p className="text-gray-600 text-sm">Recenzje</p>
											<p className="font-bold text-lg">{stats.totalReviews}</p>
										</div>
										<Users className="h-4 w-4 text-purple-500" />
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardContent className="p-4">
									<div className="flex items-center justify-between">
										<div>
											<p className="text-gray-600 text-sm">Średni koszt</p>
											<p className="font-bold text-lg">{Math.round(stats.averageCost)}€</p>
										</div>
										<LineChart className="h-4 w-4 text-orange-500" />
									</div>
								</CardContent>
							</Card>
						</div>

						{/* Top Supplements Table */}
						<Card className="mt-6">
							<CardHeader>
								<CardTitle>Najlepsze suplementy</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-3">
									{filteredData.slice(0, 10).map((supplement, index) => (
										<div key={supplement.supplementId} className="flex items-center justify-between rounded-lg border p-3">
											<div className="flex items-center gap-3">
												<div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600 text-sm">
													{index + 1}
												</div>
												<div>
													<h4 className="font-medium text-sm">{supplement.polishName}</h4>
													<p className="text-gray-600 text-xs">{getCategoryText(supplement.category)}</p>
												</div>
											</div>
											<div className="flex items-center gap-4">
												<div className="text-center">
													<div className="flex items-center gap-1">
														<Star className="h-3 w-3 text-yellow-500" />
														<span className="font-medium text-sm">{supplement.averageRating.toFixed(1)}</span>
													</div>
													<p className="text-gray-600 text-xs">{supplement.totalReviews} recenzji</p>
												</div>
												<div className="text-center">
													<p className="font-medium text-sm">{supplement.averageEffectiveness.toFixed(1)}/10</p>
													<p className="text-gray-600 text-xs">skuteczność</p>
												</div>
												<Badge
													style={{
														backgroundColor: getEvidenceLevelColor(supplement.evidenceLevel),
													}}
													className="text-white text-xs"
												>
													{getEvidenceLevelText(supplement.evidenceLevel)}
												</Badge>
											</div>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="effectiveness" className="mt-6">
						<SupplementEffectivenessCharts
							data={[]} // This would be populated with actual data
							className="mt-0"
						/>
					</TabsContent>

					<TabsContent value="ratings" className="mt-6">
						<SupplementRatingsVisualization
							data={[]} // This would be populated with actual data
							className="mt-0"
						/>
					</TabsContent>

					<TabsContent value="safety" className="mt-6">
						<DosageSafetyVisualization
							data={[]} // This would be populated with actual data
							className="mt-0"
						/>
					</TabsContent>

					<TabsContent value="comparison" className="mt-6">
						<SupplementComparisonTools
							data={[]} // This would be populated with actual data
							maxCompare={4}
							className="mt-0"
						/>
					</TabsContent>

					<TabsContent value="reviews" className="mt-6">
						<ReviewAnalyticsCharts
							data={[]} // This would be populated with actual data
							className="mt-0"
						/>
					</TabsContent>
				</Tabs>
			</CardContent>
		</Card>
	);
};

export default SupplementAnalyticsDashboard;