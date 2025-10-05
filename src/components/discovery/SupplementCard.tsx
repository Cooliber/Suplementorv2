"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
	AlertTriangle,
	Bookmark,
	BookmarkCheck,
	Brain,
	CheckCircle,
	Clock,
	Euro,
	ExternalLink,
	Heart,
	Info,
	Shield,
	Star,
	TrendingUp,
} from "lucide-react";
import type React from "react";
import { useState } from "react";

interface ClinicalApplication {
	condition: string;
	polishCondition: string;
	effectivenessRating: number;
	evidenceLevel: "STRONG" | "MODERATE" | "WEAK" | "INSUFFICIENT";
	recommendedDosage: string;
	mechanism: string;
	polishMechanism: string;
}

interface EconomicData {
	averageCostPerMonth: {
		low: number;
		average: number;
		high: number;
		currency: string;
	};
	costEffectivenessRating: string;
	polishCostEffectivenessRating: string;
	availabilityInPoland: boolean;
}

interface SafetyProfile {
	pregnancyCategory: string;
	breastfeedingSafety: string;
	commonSideEffects: string[];
	polishCommonSideEffects: string[];
}

interface SupplementData {
	id: string;
	name: string;
	polishName: string;
	category: string;
	description: string;
	polishDescription: string;
	evidenceLevel: "STRONG" | "MODERATE" | "WEAK" | "INSUFFICIENT";
	clinicalApplications: ClinicalApplication[];
	economicData: EconomicData;
	safetyProfile: SafetyProfile;
	tags: string[];
	polishTags: string[];
	lastUpdated: string;
	studyCount: number;
	userRating: number;
	isBookmarked?: boolean;
}

interface SupplementCardProps {
	supplement: SupplementData;
	onViewDetails: (supplementId: string) => void;
	onBookmark: (supplementId: string) => void;
	onCompare: (supplementId: string) => void;
	showCompareButton?: boolean;
	className?: string;
}

const SupplementCard: React.FC<SupplementCardProps> = ({
	supplement,
	onViewDetails,
	onBookmark,
	onCompare,
	showCompareButton = true,
	className = "",
}) => {
	const [activeTab, setActiveTab] = useState("overview");

	// Evidence level styling
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
		switch (level) {
			case "STRONG":
				return "Silne";
			case "MODERATE":
				return "Umiarkowane";
			case "WEAK":
				return "Słabe";
			case "INSUFFICIENT":
				return "Niewystarczające";
			default:
				return level;
		}
	};

	const getCategoryIcon = (category: string) => {
		switch (category) {
			case "NOOTROPIC":
				return <Brain className="h-4 w-4" />;
			case "VITAMIN":
				return <Heart className="h-4 w-4" />;
			case "MINERAL":
				return <Shield className="h-4 w-4" />;
			default:
				return <Info className="h-4 w-4" />;
		}
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

	const getEffectivenessColor = (rating: number) => {
		if (rating >= 8) return "text-green-600";
		if (rating >= 6) return "text-yellow-600";
		if (rating >= 4) return "text-orange-600";
		return "text-red-600";
	};

	return (
		<Card
			className={cn(
				"w-full transition-shadow duration-200 hover:shadow-lg",
				className,
			)}
		>
			<CardHeader className="pb-4">
				<div className="flex items-start justify-between">
					<div className="flex-1">
						<div className="mb-2 flex items-center gap-2">
							{getCategoryIcon(supplement.category)}
							<Badge variant="outline" className="text-xs">
								{getCategoryName(supplement.category)}
							</Badge>
							<Badge
								className={cn(
									"text-xs",
									getEvidenceLevelStyle(supplement.evidenceLevel),
								)}
							>
								{getEvidenceLevelText(supplement.evidenceLevel)}
							</Badge>
						</div>
						<CardTitle className="mb-1 text-lg leading-tight">
							{supplement.polishName}
						</CardTitle>
						<p className="mb-2 text-gray-600 text-sm">{supplement.name}</p>
					</div>
					<div className="ml-4 flex items-center gap-2">
						<Button
							variant="ghost"
							size="sm"
							onClick={() => onBookmark(supplement.id)}
							className="h-8 w-8 p-0"
							aria-label={
								supplement.isBookmarked
									? "Usuń z zakładek"
									: "Dodaj do zakładek"
							}
						>
							{supplement.isBookmarked ? (
								<BookmarkCheck className="h-4 w-4 text-blue-600" />
							) : (
								<Bookmark className="h-4 w-4" />
							)}
						</Button>
					</div>
				</div>

				{/* Quick Stats */}
				<div className="flex items-center gap-4 text-gray-600 text-sm">
					<div className="flex items-center gap-1">
						<Star className="h-3 w-3 text-yellow-500" />
						<span>{supplement.userRating.toFixed(1)}</span>
					</div>
					<div className="flex items-center gap-1">
						<TrendingUp className="h-3 w-3" />
						<span>{supplement.studyCount} badań</span>
					</div>
					<div className="flex items-center gap-1">
						<Euro className="h-3 w-3" />
						<span>
							{formatPrice(
								supplement.economicData?.averageCostPerMonth?.average || 0,
							)}
							/mies.
						</span>
					</div>
					{supplement.economicData.availabilityInPoland && (
						<Badge
							variant="outline"
							className="border-green-200 text-green-600 text-xs"
						>
							Dostępne w PL
						</Badge>
					)}
				</div>
			</CardHeader>

			<CardContent className="pt-0">
				<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
					<TabsList className="grid w-full grid-cols-3">
						<TabsTrigger value="overview" className="text-xs">
							Przegląd
						</TabsTrigger>
						<TabsTrigger value="clinical" className="text-xs">
							Zastosowania
						</TabsTrigger>
						<TabsTrigger value="safety" className="text-xs">
							Bezpieczeństwo
						</TabsTrigger>
					</TabsList>

					<TabsContent value="overview" className="mt-4 space-y-4">
						<div>
							<p className="text-gray-700 text-sm leading-relaxed">
								{supplement.polishDescription}
							</p>
						</div>

						<Separator />

						<div>
							<h4 className="mb-2 font-medium text-sm">Kluczowe właściwości</h4>
							<div className="flex flex-wrap gap-1">
								{supplement.polishTags.slice(0, 6).map((tag, index) => (
									<Badge key={index} variant="secondary" className="text-xs">
										{tag}
									</Badge>
								))}
								{supplement.polishTags.length > 6 && (
									<Badge variant="outline" className="text-xs">
										+{supplement.polishTags.length - 6} więcej
									</Badge>
								)}
							</div>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<h4 className="mb-1 font-medium text-sm">Koszt miesięczny</h4>
								<div className="text-gray-600 text-sm">
									<div>
										{formatPrice(
											supplement.economicData?.averageCostPerMonth?.low || 0,
										)}{" "}
										-{" "}
										{formatPrice(
											supplement.economicData?.averageCostPerMonth?.high || 0,
										)}
									</div>
									<div className="text-gray-500 text-xs">
										{supplement.economicData.polishCostEffectivenessRating}
									</div>
								</div>
							</div>
							<div>
								<h4 className="mb-1 font-medium text-sm">
									Ostatnia aktualizacja
								</h4>
								<div className="text-gray-600 text-sm">
									{new Date(supplement.lastUpdated).toLocaleDateString("pl-PL")}
								</div>
							</div>
						</div>
					</TabsContent>

					<TabsContent value="clinical" className="mt-4 space-y-3">
						{supplement.clinicalApplications
							.slice(0, 3)
							.map((application, index) => (
								<div key={index} className="rounded-lg border p-3">
									<div className="mb-2 flex items-center justify-between">
										<h4 className="font-medium text-sm">
											{application.polishCondition}
										</h4>
										<div className="flex items-center gap-2">
											<Progress
												value={application.effectivenessRating * 10}
												className="h-2 w-16"
											/>
											<span
												className={cn(
													"font-medium text-xs",
													getEffectivenessColor(
														application.effectivenessRating,
													),
												)}
											>
												{application.effectivenessRating}/10
											</span>
										</div>
									</div>
									<p className="mb-2 text-gray-600 text-xs">
										{application.polishMechanism}
									</p>
									<div className="flex items-center justify-between text-xs">
										<span className="text-gray-500">
											Dawka: {application.recommendedDosage}
										</span>
										<Badge
											variant="outline"
											className={cn(
												"text-xs",
												getEvidenceLevelStyle(application.evidenceLevel),
											)}
										>
											{getEvidenceLevelText(application.evidenceLevel)}
										</Badge>
									</div>
								</div>
							))}

						{supplement.clinicalApplications.length > 3 && (
							<Button
								variant="outline"
								size="sm"
								onClick={() => onViewDetails(supplement.id)}
								className="w-full text-xs"
							>
								Zobacz wszystkie zastosowania (
								{supplement.clinicalApplications.length})
							</Button>
						)}
					</TabsContent>

					<TabsContent value="safety" className="mt-4 space-y-3">
						<div className="grid grid-cols-2 gap-4">
							<div>
								<h4 className="mb-1 font-medium text-sm">Ciąża</h4>
								<div className="flex items-center gap-1">
									{supplement.safetyProfile.pregnancyCategory === "A" ||
									supplement.safetyProfile.pregnancyCategory === "B" ? (
										<CheckCircle className="h-3 w-3 text-green-600" />
									) : (
										<AlertTriangle className="h-3 w-3 text-orange-600" />
									)}
									<span className="text-gray-600 text-xs">
										Kategoria {supplement.safetyProfile.pregnancyCategory}
									</span>
								</div>
							</div>
							<div>
								<h4 className="mb-1 font-medium text-sm">Karmienie piersią</h4>
								<div className="flex items-center gap-1">
									{supplement.safetyProfile.breastfeedingSafety === "Safe" ? (
										<CheckCircle className="h-3 w-3 text-green-600" />
									) : (
										<AlertTriangle className="h-3 w-3 text-orange-600" />
									)}
									<span className="text-gray-600 text-xs">
										{supplement.safetyProfile.breastfeedingSafety === "Safe"
											? "Bezpieczne"
											: supplement.safetyProfile.breastfeedingSafety ===
													"Caution"
												? "Ostrożność"
												: "Unikać"}
									</span>
								</div>
							</div>
						</div>

						{supplement.safetyProfile.polishCommonSideEffects.length > 0 && (
							<div>
								<h4 className="mb-2 font-medium text-sm">
									Częste skutki uboczne
								</h4>
								<div className="space-y-1">
									{supplement.safetyProfile.polishCommonSideEffects
										.slice(0, 3)
										.map((effect, index) => (
											<div
												key={index}
												className="flex items-center gap-2 text-gray-600 text-xs"
											>
												<div className="h-1 w-1 rounded-full bg-gray-400" />
												{effect}
											</div>
										))}
									{supplement.safetyProfile.polishCommonSideEffects.length >
										3 && (
										<div className="text-gray-500 text-xs">
											+
											{supplement.safetyProfile.polishCommonSideEffects.length -
												3}{" "}
											więcej
										</div>
									)}
								</div>
							</div>
						)}
					</TabsContent>
				</Tabs>

				<Separator className="my-4" />

				{/* Action Buttons */}
				<div className="flex gap-2">
					<Button
						onClick={() => onViewDetails(supplement.id)}
						className="flex-1 text-sm"
					>
						<ExternalLink className="mr-1 h-3 w-3" />
						Szczegóły
					</Button>
					{showCompareButton && (
						<Button
							variant="outline"
							onClick={() => onCompare(supplement.id)}
							className="text-sm"
						>
							Porównaj
						</Button>
					)}
				</div>
			</CardContent>
		</Card>
	);
};

export default SupplementCard;
