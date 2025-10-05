"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
	AlertTriangle,
	Brain,
	CheckCircle,
	Euro,
	Heart,
	Info,
	Minus,
	Shield,
	Star,
	TrendingDown,
	TrendingUp,
	X,
} from "lucide-react";
import type React from "react";
import { useState } from "react";

interface ComparisonSupplement {
	id: string;
	name: string;
	polishName: string;
	category: string;
	evidenceLevel: "STRONG" | "MODERATE" | "WEAK" | "INSUFFICIENT";
	userRating: number;
	studyCount: number;
	economicData: {
		averageCostPerMonth: {
			average: number;
			currency: string;
		};
		costEffectivenessRating: string;
		polishCostEffectivenessRating: string;
		availabilityInPoland: boolean;
	};
	clinicalApplications: Array<{
		polishCondition: string;
		effectivenessRating: number;
		evidenceLevel: string;
		recommendedDosage: string;
	}>;
	safetyProfile: {
		pregnancyCategory: string;
		breastfeedingSafety: string;
		polishCommonSideEffects: string[];
	};
	mechanisms: Array<{
		polishPathway: string;
		polishDescription: string;
		evidenceLevel: string;
	}>;
	interactions: Array<{
		polishSubstance: string;
		severity: "MILD" | "MODERATE" | "SEVERE";
		polishRecommendation: string;
	}>;
}

interface SupplementComparisonProps {
	supplements: ComparisonSupplement[];
	onRemoveSupplement: (supplementId: string) => void;
	onViewDetails: (supplementId: string) => void;
	className?: string;
}

const SupplementComparison: React.FC<SupplementComparisonProps> = ({
	supplements,
	onRemoveSupplement,
	onViewDetails,
	className = "",
}) => {
	const [activeTab, setActiveTab] = useState("overview");

	const getEvidenceLevelStyle = (level: string) => {
		switch (level) {
			case "STRONG":
				return "bg-green-100 text-green-800 border-green-200";
			case "MODERATE":
				return "bg-yellow-100 text-yellow-800 border-yellow-200";
			case "WEAK":
				return "bg-orange-100 text-orange-800 border-orange-200";
			case "INSUFFICIENT":
				return "bg-red-100 text-red-800 border-red-200";
			default:
				return "bg-gray-100 text-gray-800 border-gray-200";
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

	const getCategoryName = (category: string) => {
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

	const formatPrice = (price: number) => {
		return new Intl.NumberFormat("pl-PL", {
			style: "currency",
			currency: "EUR",
			minimumFractionDigits: 2,
		}).format(price);
	};

	const getComparisonIcon = (value1: number, value2: number) => {
		if (value1 > value2)
			return <TrendingUp className="h-3 w-3 text-green-600" />;
		if (value1 < value2)
			return <TrendingDown className="h-3 w-3 text-red-600" />;
		return <Minus className="h-3 w-3 text-gray-400" />;
	};

	const getSeverityColor = (severity: string) => {
		switch (severity) {
			case "MILD":
				return "text-green-600";
			case "MODERATE":
				return "text-yellow-600";
			case "SEVERE":
				return "text-red-600";
			default:
				return "text-gray-600";
		}
	};

	const getSeverityText = (severity: string) => {
		const severities: Record<string, string> = {
			MILD: "Łagodne",
			MODERATE: "Umiarkowane",
			SEVERE: "Ciężkie",
		};
		return severities[severity] || severity;
	};

	if (supplements.length === 0) {
		return (
			<Card className={cn("w-full", className)}>
				<CardContent className="flex flex-col items-center justify-center py-12">
					<Info className="mb-4 h-12 w-12 text-gray-400" />
					<h3 className="mb-2 font-medium text-gray-900 text-lg">
						Brak suplementów do porównania
					</h3>
					<p className="text-center text-gray-600">
						Dodaj suplementy do porównania, aby zobaczyć szczegółowe zestawienie
						ich właściwości.
					</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className={cn("w-full", className)}>
			<CardHeader>
				<CardTitle className="flex items-center justify-between">
					<span>Porównanie suplementów ({supplements.length})</span>
					<div className="text-gray-600 text-sm">Maksymalnie 4 suplementy</div>
				</CardTitle>
			</CardHeader>

			<CardContent>
				<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
					<TabsList className="grid w-full grid-cols-5">
						<TabsTrigger value="overview">Przegląd</TabsTrigger>
						<TabsTrigger value="clinical">Zastosowania</TabsTrigger>
						<TabsTrigger value="safety">Bezpieczeństwo</TabsTrigger>
						<TabsTrigger value="mechanisms">Mechanizmy</TabsTrigger>
						<TabsTrigger value="interactions">Interakcje</TabsTrigger>
					</TabsList>

					<TabsContent value="overview" className="mt-6">
						<div className="overflow-x-auto">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead className="w-48">Suplement</TableHead>
										{supplements.map((supplement) => (
											<TableHead
												key={supplement.id}
												className="min-w-48 text-center"
											>
												<div className="space-y-2">
													<div className="flex items-center justify-between">
														<span className="font-medium text-sm">
															{supplement.polishName}
														</span>
														<Button
															variant="ghost"
															size="sm"
															onClick={() => onRemoveSupplement(supplement.id)}
															className="h-6 w-6 p-0"
														>
															<X className="h-3 w-3" />
														</Button>
													</div>
													<Badge variant="outline" className="text-xs">
														{getCategoryName(supplement.category)}
													</Badge>
												</div>
											</TableHead>
										))}
									</TableRow>
								</TableHeader>
								<TableBody>
									<TableRow>
										<TableCell className="font-medium">
											Poziom dowodów
										</TableCell>
										{supplements.map((supplement) => (
											<TableCell key={supplement.id} className="text-center">
												<Badge
													className={cn(
														"text-xs",
														getEvidenceLevelStyle(supplement.evidenceLevel),
													)}
												>
													{getEvidenceLevelText(supplement.evidenceLevel)}
												</Badge>
											</TableCell>
										))}
									</TableRow>
									<TableRow>
										<TableCell className="font-medium">
											Ocena użytkowników
										</TableCell>
										{supplements.map((supplement, index) => (
											<TableCell key={supplement.id} className="text-center">
												<div className="flex items-center justify-center gap-1">
													<Star className="h-3 w-3 text-yellow-500" />
													<span className="text-sm">
														{supplement.userRating.toFixed(1)}
													</span>
													{index > 0 &&
														supplements[0] &&
														getComparisonIcon(
															supplement.userRating,
															supplements[0].userRating,
														)}
												</div>
											</TableCell>
										))}
									</TableRow>
									<TableRow>
										<TableCell className="font-medium">Liczba badań</TableCell>
										{supplements.map((supplement, index) => (
											<TableCell key={supplement.id} className="text-center">
												<div className="flex items-center justify-center gap-1">
													<span className="text-sm">
														{supplement.studyCount}
													</span>
													{index > 0 &&
														supplements[0] &&
														getComparisonIcon(
															supplement.studyCount,
															supplements[0].studyCount,
														)}
												</div>
											</TableCell>
										))}
									</TableRow>
									<TableRow>
										<TableCell className="font-medium">
											Koszt miesięczny
										</TableCell>
										{supplements.map((supplement, index) => (
											<TableCell key={supplement.id} className="text-center">
												<div className="flex items-center justify-center gap-1">
													<span className="text-sm">
														{formatPrice(
															supplement.economicData.averageCostPerMonth
																.average,
														)}
													</span>
													{index > 0 &&
														supplements[0] &&
														getComparisonIcon(
															supplements[0].economicData.averageCostPerMonth
																.average,
															supplement.economicData.averageCostPerMonth
																.average,
														)}
												</div>
											</TableCell>
										))}
									</TableRow>
									<TableRow>
										<TableCell className="font-medium">
											Dostępność w Polsce
										</TableCell>
										{supplements.map((supplement) => (
											<TableCell key={supplement.id} className="text-center">
												{supplement.economicData.availabilityInPoland ? (
													<CheckCircle className="mx-auto h-4 w-4 text-green-600" />
												) : (
													<X className="mx-auto h-4 w-4 text-red-600" />
												)}
											</TableCell>
										))}
									</TableRow>
									<TableRow>
										<TableCell className="font-medium">
											Stosunek jakości do ceny
										</TableCell>
										{supplements.map((supplement) => (
											<TableCell key={supplement.id} className="text-center">
												<span className="text-sm">
													{
														supplement.economicData
															.polishCostEffectivenessRating
													}
												</span>
											</TableCell>
										))}
									</TableRow>
								</TableBody>
							</Table>
						</div>
					</TabsContent>

					<TabsContent value="clinical" className="mt-6">
						<div className="space-y-6">
							{supplements.length > 0 &&
								supplements[0]?.clinicalApplications.map((_, appIndex) => {
									const allHaveThisApplication = supplements.every(
										(s) => s.clinicalApplications[appIndex],
									);
									if (!allHaveThisApplication) return null;

									return (
										<div key={appIndex} className="rounded-lg border p-4">
											<h4 className="mb-3 font-medium">
												{
													supplements[0]?.clinicalApplications[appIndex]
														?.polishCondition
												}
											</h4>
											<div className="overflow-x-auto">
												<Table>
													<TableHeader>
														<TableRow>
															<TableHead>Suplement</TableHead>
															<TableHead>Skuteczność</TableHead>
															<TableHead>Poziom dowodów</TableHead>
															<TableHead>Zalecana dawka</TableHead>
														</TableRow>
													</TableHeader>
													<TableBody>
														{supplements.map((supplement) => {
															const application =
																supplement.clinicalApplications[appIndex];
															if (!application) return null;

															return (
																<TableRow key={supplement.id}>
																	<TableCell className="font-medium">
																		{supplement.polishName}
																	</TableCell>
																	<TableCell>
																		<div className="flex items-center gap-2">
																			<Progress
																				value={
																					application.effectivenessRating * 10
																				}
																				className="h-2 w-16"
																			/>
																			<span className="text-sm">
																				{application.effectivenessRating}/10
																			</span>
																		</div>
																	</TableCell>
																	<TableCell>
																		<Badge
																			variant="outline"
																			className={cn(
																				"text-xs",
																				getEvidenceLevelStyle(
																					application.evidenceLevel,
																				),
																			)}
																		>
																			{getEvidenceLevelText(
																				application.evidenceLevel,
																			)}
																		</Badge>
																	</TableCell>
																	<TableCell className="text-sm">
																		{application.recommendedDosage}
																	</TableCell>
																</TableRow>
															);
														})}
													</TableBody>
												</Table>
											</div>
										</div>
									);
								})}
						</div>
					</TabsContent>

					<TabsContent value="safety" className="mt-6">
						<div className="overflow-x-auto">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Aspekt bezpieczeństwa</TableHead>
										{supplements.map((supplement) => (
											<TableHead key={supplement.id} className="text-center">
												{supplement.polishName}
											</TableHead>
										))}
									</TableRow>
								</TableHeader>
								<TableBody>
									<TableRow>
										<TableCell className="font-medium">
											Kategoria ciąży
										</TableCell>
										{supplements.map((supplement) => (
											<TableCell key={supplement.id} className="text-center">
												<Badge
													variant={
														supplement.safetyProfile.pregnancyCategory ===
															"A" ||
														supplement.safetyProfile.pregnancyCategory === "B"
															? "default"
															: "destructive"
													}
													className="text-xs"
												>
													{supplement.safetyProfile.pregnancyCategory}
												</Badge>
											</TableCell>
										))}
									</TableRow>
									<TableRow>
										<TableCell className="font-medium">
											Karmienie piersią
										</TableCell>
										{supplements.map((supplement) => (
											<TableCell key={supplement.id} className="text-center">
												<div className="flex items-center justify-center gap-1">
													{supplement.safetyProfile.breastfeedingSafety ===
													"Safe" ? (
														<CheckCircle className="h-3 w-3 text-green-600" />
													) : (
														<AlertTriangle className="h-3 w-3 text-orange-600" />
													)}
													<span className="text-xs">
														{supplement.safetyProfile.breastfeedingSafety ===
														"Safe"
															? "Bezpieczne"
															: supplement.safetyProfile.breastfeedingSafety ===
																	"Caution"
																? "Ostrożność"
																: "Unikać"}
													</span>
												</div>
											</TableCell>
										))}
									</TableRow>
									<TableRow>
										<TableCell className="font-medium">
											Skutki uboczne
										</TableCell>
										{supplements.map((supplement) => (
											<TableCell key={supplement.id} className="text-center">
												<div className="space-y-1 text-xs">
													{supplement.safetyProfile.polishCommonSideEffects
														.slice(0, 2)
														.map((effect, index) => (
															<div key={index}>{effect}</div>
														))}
													{supplement.safetyProfile.polishCommonSideEffects
														.length > 2 && (
														<div className="text-gray-500">
															+
															{supplement.safetyProfile.polishCommonSideEffects
																.length - 2}{" "}
															więcej
														</div>
													)}
												</div>
											</TableCell>
										))}
									</TableRow>
								</TableBody>
							</Table>
						</div>
					</TabsContent>

					<TabsContent value="mechanisms" className="mt-6">
						<div className="grid gap-4">
							{supplements.map((supplement) => (
								<Card key={supplement.id}>
									<CardHeader className="pb-3">
										<CardTitle className="text-base">
											{supplement.polishName}
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="space-y-2">
											{supplement.mechanisms
												.slice(0, 3)
												.map((mechanism, index) => (
													<div
														key={index}
														className="flex items-start gap-3 rounded border p-2"
													>
														<Brain className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" />
														<div className="flex-1">
															<div className="font-medium text-sm">
																{mechanism.polishPathway}
															</div>
															<div className="mt-1 text-gray-600 text-xs">
																{mechanism.polishDescription}
															</div>
															<Badge
																variant="outline"
																className={cn(
																	"mt-1 text-xs",
																	getEvidenceLevelStyle(
																		mechanism.evidenceLevel,
																	),
																)}
															>
																{getEvidenceLevelText(mechanism.evidenceLevel)}
															</Badge>
														</div>
													</div>
												))}
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					</TabsContent>

					<TabsContent value="interactions" className="mt-6">
						<div className="grid gap-4">
							{supplements.map((supplement) => (
								<Card key={supplement.id}>
									<CardHeader className="pb-3">
										<CardTitle className="text-base">
											{supplement.polishName}
										</CardTitle>
									</CardHeader>
									<CardContent>
										{supplement.interactions.length > 0 ? (
											<div className="space-y-2">
												{supplement.interactions
													.slice(0, 3)
													.map((interaction, index) => (
														<div
															key={index}
															className="flex items-start gap-3 rounded border p-2"
														>
															<AlertTriangle
																className={cn(
																	"mt-0.5 h-4 w-4 flex-shrink-0",
																	getSeverityColor(interaction.severity),
																)}
															/>
															<div className="flex-1">
																<div className="font-medium text-sm">
																	{interaction.polishSubstance}
																</div>
																<div className="mt-1 text-gray-600 text-xs">
																	{interaction.polishRecommendation}
																</div>
																<Badge
																	variant="outline"
																	className={cn(
																		"mt-1 text-xs",
																		getSeverityColor(interaction.severity),
																	)}
																>
																	{getSeverityText(interaction.severity)}
																</Badge>
															</div>
														</div>
													))}
											</div>
										) : (
											<div className="py-4 text-center text-gray-500">
												<Shield className="mx-auto mb-2 h-8 w-8 text-green-600" />
												<div className="text-sm">Brak znanych interakcji</div>
											</div>
										)}
									</CardContent>
								</Card>
							))}
						</div>
					</TabsContent>
				</Tabs>

				<div className="mt-6 flex items-center justify-between border-t pt-4">
					<div className="text-gray-600 text-sm">
						Porównanie {supplements.length} suplementów
					</div>
					<div className="flex gap-2">
						{supplements.map((supplement) => (
							<Button
								key={supplement.id}
								variant="outline"
								size="sm"
								onClick={() => onViewDetails(supplement.id)}
							>
								Szczegóły {supplement.polishName}
							</Button>
						))}
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export default SupplementComparison;
