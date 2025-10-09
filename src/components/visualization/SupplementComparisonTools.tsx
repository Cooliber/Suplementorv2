"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
	BarChart3,
	CheckCircle,
	GitCompare,
	Radar,
	Shield,
	Star,
	TrendingUp,
	X,
} from "lucide-react";
import type React from "react";
import { useMemo, useState } from "react";
import {
	Bar,
	BarChart as RechartsBarChart,
	CartesianGrid,
	Cell,
	PolarAngleAxis,
	PolarGrid,
	PolarRadiusAxis,
	Radar as RechartsRadar,
	RadarChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

interface ComparisonFeature {
	name: string;
	polishName: string;
	value: number; // 0-10 scale
	weight: number; // importance weight
	category: "effectiveness" | "safety" | "evidence" | "cost" | "convenience";
}

interface SupplementComparisonData {
	supplementId: string;
	name: string;
	polishName: string;
	category: string;
	features: ComparisonFeature[];
	overallScore: number;
	pricePerMonth: number;
	sideEffectRisk: "low" | "medium" | "high";
	evidenceStrength: number;
	userRating: number;
	totalReviews: number;
}

interface SupplementComparisonToolsProps {
	data: SupplementComparisonData[];
	maxCompare?: number;
	className?: string;
}

const SupplementComparisonTools: React.FC<SupplementComparisonToolsProps> = ({
	data,
	maxCompare = 4,
	className = "",
}) => {
	const [selectedSupplements, setSelectedSupplements] = useState<string[]>([]);
	const [comparisonMode, setComparisonMode] = useState<"radar" | "matrix" | "scores">("radar");
	const [showFeatures, setShowFeatures] = useState<string[]>([
		"effectiveness",
		"safety",
		"evidence",
		"cost",
		"convenience"
	]);

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

	const featureColors = {
		effectiveness: "#3B82F6",
		safety: "#10B981",
		evidence: "#8B5CF6",
		cost: "#F59E0B",
		convenience: "#EF4444",
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

	const getRiskColor = (risk: string) => {
		switch (risk) {
			case "low":
				return "#10B981";
			case "medium":
				return "#F59E0B";
			case "high":
				return "#EF4444";
			default:
				return "#6B7280";
		}
	};

	const getRiskText = (risk: string) => {
		switch (risk) {
			case "low":
				return "Niski";
			case "medium":
				return "Średni";
			case "high":
				return "Wysoki";
			default:
				return risk;
		}
	};

	// Handle supplement selection
	const toggleSupplement = (supplementId: string) => {
		setSelectedSupplements(prev => {
			if (prev.includes(supplementId)) {
				return prev.filter(id => id !== supplementId);
			} else if (prev.length < maxCompare) {
				return [...prev, supplementId];
			}
			return prev;
		});
	};

	// Get selected supplement data
	const selectedData = useMemo(() => {
		return data.filter(item => selectedSupplements.includes(item.supplementId));
	}, [data, selectedSupplements]);

	// Prepare radar chart data
	const radarData = useMemo(() => {
		if (selectedData.length === 0) return [];

		const featureNames = selectedData[0]
		? [...new Set(selectedData[0].features.map(f => f.polishName))]
		: [];

		return featureNames.map(featureName => {
			const dataPoint: any = { feature: featureName };
			selectedData.forEach(supplement => {
				const feature = supplement.features.find(f => f.polishName === featureName);
				dataPoint[supplement.polishName] = feature?.value || 0;
			});
			return dataPoint;
		});
	}, [selectedData]);

	// Prepare matrix data
	const matrixData = useMemo(() => {
		return selectedData.map(supplement => ({
			name: supplement.polishName,
			overallScore: supplement.overallScore,
			pricePerMonth: supplement.pricePerMonth,
			sideEffectRisk: supplement.sideEffectRisk,
			evidenceStrength: supplement.evidenceStrength,
			userRating: supplement.userRating,
			color: getCategoryColor(supplement.category),
		}));
	}, [selectedData]);

	// Custom tooltip for radar chart
	const RadarTooltip = ({ active, payload, label }: any) => {
		if (active && payload && payload.length) {
			return (
				<div className="rounded-lg border bg-white p-3 shadow-lg">
					<p className="mb-2 font-medium text-sm">{label}</p>
					<div className="space-y-1">
						{payload.map((entry: any, index: number) => (
							<p key={index} className="text-xs" style={{ color: entry.color }}>
								{entry.name}: {entry.value}/10
							</p>
						))}
					</div>
				</div>
			);
		}
		return null;
	};

	// Feature toggle handler
	const toggleFeature = (feature: string) => {
		setShowFeatures(prev =>
			prev.includes(feature)
				? prev.filter(f => f !== feature)
				: [...prev, feature]
		);
	};

	return (
		<Card className={cn("w-full", className)}>
			<CardHeader>
				<div className="flex items-center justify-between">
					<CardTitle className="flex items-center gap-2">
						<GitCompare className="h-5 w-5" />
						Narzędzia porównania suplementów
					</CardTitle>
					<div className="flex items-center gap-2">
						<span className="text-gray-600 text-sm">
							Wybrano: {selectedSupplements.length}/{maxCompare}
						</span>
					</div>
				</div>
			</CardHeader>

			<CardContent>
				{/* Supplement Selection */}
				<Card className="mb-6">
					<CardHeader className="pb-4">
						<CardTitle className="text-base">Wybierz suplementy do porównania</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
							{data.slice(0, 12).map((supplement) => (
								<div
									key={supplement.supplementId}
									className={cn(
										"flex items-center space-x-3 rounded-lg border p-3 cursor-pointer transition-colors",
										selectedSupplements.includes(supplement.supplementId)
											? "border-blue-500 bg-blue-50"
											: "border-gray-200 hover:border-gray-300"
									)}
									onClick={() => toggleSupplement(supplement.supplementId)}
								>
									<Checkbox
										checked={selectedSupplements.includes(supplement.supplementId)}
				
									/>
									<div className="flex-1">
										<h4 className="font-medium text-sm">{supplement.polishName}</h4>
										<div className="flex items-center gap-2 mt-1">
											<Badge
												style={{
													backgroundColor: getCategoryColor(supplement.category),
												}}
												className="text-white text-xs"
											>
												{getCategoryText(supplement.category)}
											</Badge>
											<div className="flex items-center gap-1">
												<Star className="h-3 w-3 text-yellow-500" />
												<span className="text-xs">{supplement.userRating.toFixed(1)}</span>
											</div>
										</div>
									</div>
									{selectedSupplements.includes(supplement.supplementId) && (
										<Button
											variant="ghost"
											size="sm"
											className="h-6 w-6 p-0"
											onClick={(e) => {
												e.stopPropagation();
												toggleSupplement(supplement.supplementId);
											}}
										>
											<X className="h-3 w-3" />
										</Button>
									)}
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				{selectedData.length > 0 && (
					<Tabs value={comparisonMode} onValueChange={(value: any) => setComparisonMode(value)} className="w-full">
						<TabsList className="grid w-full grid-cols-3">
							<TabsTrigger value="radar" className="text-xs">
								<Radar className="mr-1 h-3 w-3" />
								Radar
							</TabsTrigger>
							<TabsTrigger value="matrix" className="text-xs">
								<BarChart3 className="mr-1 h-3 w-3" />
								Porównanie
							</TabsTrigger>
							<TabsTrigger value="scores" className="text-xs">
								<CheckCircle className="mr-1 h-3 w-3" />
								Szczegóły
							</TabsTrigger>
						</TabsList>

						<TabsContent value="radar" className="mt-6">
							<Card>
								<CardHeader>
									<CardTitle className="text-base">Porównanie radarowe</CardTitle>
								</CardHeader>
								<CardContent>
									<ResponsiveContainer width="100%" height={400}>
										<RadarChart data={radarData}>
											<PolarGrid />
											<PolarAngleAxis dataKey="feature" tick={{ fontSize: 12 }} />
											<PolarRadiusAxis domain={[0, 10]} tick={{ fontSize: 10 }} />
											{selectedData.map((supplement, index) => (
												<RechartsRadar
													key={supplement.supplementId}
													name={supplement.polishName}
													dataKey={supplement.polishName}
													stroke={getCategoryColor(supplement.category)}
													fill={getCategoryColor(supplement.category)}
													fillOpacity={0.1}
													strokeWidth={2}
												/>
											))}
											<Tooltip content={<RadarTooltip />} />
										</RadarChart>
									</ResponsiveContainer>

									{/* Legend */}
									<div className="mt-4 flex flex-wrap gap-4">
										{selectedData.map((supplement) => (
											<div key={supplement.supplementId} className="flex items-center gap-2 text-xs">
												<div
													className="h-3 w-3 rounded"
													style={{ backgroundColor: getCategoryColor(supplement.category) }}
												/>
												<span>{supplement.polishName}</span>
											</div>
										))}
									</div>
								</CardContent>
							</Card>
						</TabsContent>

						<TabsContent value="matrix" className="mt-6">
							<Card>
								<CardHeader>
									<CardTitle className="text-base">Macierz porównania</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="space-y-6">
										{/* Overall Scores */}
										<div>
											<h4 className="mb-3 font-medium text-sm">Ogólna ocena</h4>
											<div className="space-y-3">
												{matrixData.map((supplement) => (
													<div key={supplement.name} className="space-y-2">
														<div className="flex items-center justify-between">
															<span className="font-medium text-sm">{supplement.name}</span>
															<span className="font-bold text-sm">{supplement.overallScore.toFixed(1)}/10</span>
														</div>
														<Progress value={supplement.overallScore * 10} className="h-2" />
													</div>
												))}
											</div>
										</div>

										{/* Price Comparison */}
										<div>
											<h4 className="mb-3 font-medium text-sm">Koszt miesięczny (€)</h4>
											<div className="space-y-3">
												{matrixData.map((supplement) => (
													<div key={supplement.name} className="flex items-center justify-between">
														<span className="font-medium text-sm">{supplement.name}</span>
														<span className="font-bold text-sm">{supplement.pricePerMonth}€</span>
													</div>
												))}
											</div>
										</div>

										{/* Risk Comparison */}
										<div>
											<h4 className="mb-3 font-medium text-sm">Ryzyko skutków ubocznych</h4>
											<div className="space-y-3">
												{matrixData.map((supplement) => (
													<div key={supplement.name} className="flex items-center justify-between">
														<span className="font-medium text-sm">{supplement.name}</span>
														<Badge
															style={{ backgroundColor: getRiskColor(supplement.sideEffectRisk) }}
															className="text-white"
														>
															{getRiskText(supplement.sideEffectRisk)}
														</Badge>
													</div>
												))}
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						</TabsContent>

						<TabsContent value="scores" className="mt-6">
							<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
								{selectedData.map((supplement) => (
									<Card key={supplement.supplementId}>
										<CardHeader className="pb-4">
											<CardTitle className="flex items-center gap-2 text-base">
												<div
													className="h-3 w-3 rounded"
													style={{ backgroundColor: getCategoryColor(supplement.category) }}
												/>
												{supplement.polishName}
											</CardTitle>
											<div className="flex items-center gap-2">
												<div className="flex items-center gap-1">
													<Star className="h-3 w-3 text-yellow-500" />
													<span className="text-sm">{supplement.userRating.toFixed(1)}</span>
												</div>
												<span className="text-gray-600 text-sm">•</span>
												<span className="text-gray-600 text-sm">{supplement.totalReviews} recenzji</span>
											</div>
										</CardHeader>
										<CardContent>
											<div className="space-y-4">
												{supplement.features.map((feature, index) => (
													<div key={index} className="space-y-2">
														<div className="flex items-center justify-between">
															<span className="font-medium text-sm">{feature.polishName}</span>
															<span className="font-bold text-sm">{feature.value}/10</span>
														</div>
														<Progress value={feature.value * 10} className="h-2" />
													</div>
												))}

												<div className="border-t pt-4">
													<div className="grid grid-cols-2 gap-4">
														<div>
															<p className="text-gray-600 text-sm">Koszt miesięczny</p>
															<p className="font-bold text-sm">{supplement.pricePerMonth}€</p>
														</div>
														<div>
															<p className="text-gray-600 text-sm">Siła dowodów</p>
															<p className="font-bold text-sm">{supplement.evidenceStrength}/10</p>
														</div>
													</div>
												</div>
											</div>
										</CardContent>
									</Card>
								))}
							</div>
						</TabsContent>
					</Tabs>
				)}

				{selectedData.length === 0 && (
					<Card>
						<CardContent className="flex flex-col items-center justify-center py-12">
							<GitCompare className="mb-4 h-12 w-12 text-gray-400" />
							<h3 className="mb-2 font-medium text-base text-gray-900">
								Wybierz suplementy do porównania
							</h3>
							<p className="text-center text-gray-600 text-sm">
								Zaznacz maksymalnie {maxCompare} suplementy powyżej, aby zobaczyć porównanie.
							</p>
						</CardContent>
					</Card>
				)}
			</CardContent>
		</Card>
	);
};

export default SupplementComparisonTools;