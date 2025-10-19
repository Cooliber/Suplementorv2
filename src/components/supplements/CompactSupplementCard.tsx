"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import type { ComprehensiveSupplementProfile } from "@/data/comprehensive-supplements/types";
import type {
	EvidenceLevel,
	SupplementCategory,
	SupplementWithRelations,
} from "@/types/supplement";
import {
	BookOpen,
	Brain,
	Calculator,
	ExternalLink,
	Heart,
	Info,
	Shield,
	Star,
	TrendingUp,
} from "lucide-react";
import { useState } from "react";

interface CompactSupplementCardProps {
	// Support both comprehensive data and individual props for backward compatibility
	supplement?: ComprehensiveSupplementProfile | SupplementWithRelations;
	id?: string;
	name?: string;
	polishName?: string;
	category?: SupplementCategory;
	polishCategory?: string;
	description?: string;
	polishDescription?: string;
	evidenceLevel?: EvidenceLevel;
	safetyRating?: number;
	userRating?: number;
	primaryBenefits?: string[];
	polishPrimaryBenefits?: string[];
	studyCount?: number;
	price?: {
		min: number;
		max: number;
		currency: string;
	};
	onCardClick?: (id: string) => void;
	onFavoriteClick?: (id: string) => void;
	onDosageClick?: (id: string) => void;
	onSafetyClick?: (id: string) => void;
	showPrice?: boolean;
	showBenefits?: boolean;
	showStudyCount?: boolean;
}

const evidenceLevelConfig = {
	STRONG: {
		color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
		label: "Silne",
		icon: Star,
	},
	MODERATE: {
		color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
		label: "Umiarkowane",
		icon: TrendingUp,
	},
	WEAK: {
		color:
			"bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
		label: "Słabe",
		icon: Info,
	},
	INSUFFICIENT: {
		color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
		label: "Niewystarczające",
		icon: Info,
	},
	CONFLICTING: {
		color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
		label: "Sprzeczne",
		icon: Info,
	},
};

const categoryIcons: Record<SupplementCategory, React.ComponentType<any>> = {
	NOOTROPIC: Brain,
	VITAMIN: Heart,
	MINERAL: Shield,
	AMINO_ACID: TrendingUp,
	HERB: TrendingUp,
	ADAPTOGEN: Shield,
	COENZYME: TrendingUp,
	FATTY_ACID: Heart,
	PROBIOTIC: Shield,
	ENZYME: TrendingUp,
	OTHER: Info,
};

export function CompactSupplementCard({
	id: propId,
	name: propName,
	polishName: propPolishName,
	category: propCategory,
	polishCategory: propPolishCategory,
	description: propDescription,
	polishDescription: propPolishDescription,
	evidenceLevel: propEvidenceLevel,
	safetyRating: propSafetyRating,
	userRating: propUserRating,
	primaryBenefits: propPrimaryBenefits,
	polishPrimaryBenefits: propPolishPrimaryBenefits,
	studyCount: propStudyCount,
	price: propPrice,
	supplement,
	onCardClick,
	onFavoriteClick,
	onDosageClick,
	onSafetyClick,
	showPrice = true,
	showBenefits = true,
	showStudyCount = true,
}: CompactSupplementCardProps) {
	const [isFavorited, setIsFavorited] = useState(false);

	// Extract data from comprehensive supplement or use props
	const data =
		supplement && "safetyProfile" in supplement
			? {
					id: (supplement as any).id,
					name: (supplement as any).name,
					polishName: (supplement as any).polishName,
					category: (supplement as any).category,
					polishCategory: (supplement as any).category, // Use category as polishCategory for now
					description: (supplement as any).description || "",
					polishDescription: (supplement as any).polishDescription || "",
					evidenceLevel: (supplement as any).evidenceLevel,
					safetyRating:
						(supplement as any).safetyProfile?.pregnancyCategory === "A"
							? 9
							: (supplement as any).safetyProfile?.pregnancyCategory === "B"
								? 8
								: 6,
					userRating: 0, // Would need to be calculated from reviews
					primaryBenefits:
						(supplement as any).clinicalApplications?.map(
							(app: any) => app.condition,
						) || [],
					polishPrimaryBenefits:
						(supplement as any).clinicalApplications?.map(
							(app: any) => app.polishCondition,
						) || [],
					studyCount: (supplement as any).clinicalEvidence?.totalStudies || 0,
					price: (supplement as any).economicData?.averageCostPerMonth
						? {
								min: (supplement as any).economicData.averageCostPerMonth.low,
								max: (supplement as any).economicData.averageCostPerMonth.high,
								currency: (supplement as any).economicData.averageCostPerMonth
									.currency,
							}
						: undefined,
				}
			: {
					id: propId || "",
					name: propName || "",
					polishName: propPolishName || "",
					category: propCategory || "OTHER",
					polishCategory: propPolishCategory || "",
					description: propDescription || "",
					polishDescription: propPolishDescription || "",
					evidenceLevel: propEvidenceLevel || "INSUFFICIENT",
					safetyRating: propSafetyRating || 5,
					userRating: propUserRating || 0,
					primaryBenefits: propPrimaryBenefits || [],
					polishPrimaryBenefits: propPolishPrimaryBenefits || [],
					studyCount: propStudyCount || 0,
					price: propPrice,
				};

	const EvidenceIcon =
		evidenceLevelConfig[data.evidenceLevel as keyof typeof evidenceLevelConfig]
			.icon;
	const CategoryIcon =
		categoryIcons[data.category as keyof typeof categoryIcons];

	const handleFavoriteClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		setIsFavorited(!isFavorited);
		onFavoriteClick?.(data.id);
	};

	const handleDosageClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		onDosageClick?.(data.id);
	};

	const handleSafetyClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		onSafetyClick?.(data.id);
	};

	const getSafetyColor = (rating: number) => {
		if (rating >= 8) return "text-green-600";
		if (rating >= 6) return "text-yellow-600";
		return "text-red-600";
	};

	return (
		<TooltipProvider>
			<Card
				className="group relative h-full cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-md"
				onClick={() => onCardClick?.(data.id)}
			>
				<CardHeader className="pb-2">
					<div className="flex items-start justify-between gap-2">
						<div className="flex min-w-0 flex-1 items-center gap-2">
							<CategoryIcon className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
							<div className="min-w-0 flex-1">
								<CardTitle className="line-clamp-1 text-sm leading-tight">
									{data.polishName}
								</CardTitle>
								<CardDescription className="line-clamp-1 text-muted-foreground text-xs">
									{data.polishCategory}
								</CardDescription>
							</div>
						</div>

						<div className="flex flex-col items-end gap-1">
							<Badge
								variant="secondary"
								className={`${(evidenceLevelConfig as any)[data.evidenceLevel]?.color} px-1 py-0 text-xs`}
							>
								<EvidenceIcon className="mr-1 h-2 w-2" />
								{(evidenceLevelConfig as any)[data.evidenceLevel]?.label}
							</Badge>

							{data.userRating > 0 && (
								<div className="flex items-center gap-1">
									<Star className="h-2 w-2 fill-current text-yellow-500" />
									<span className="text-xs">{data.userRating}</span>
								</div>
							)}
						</div>
					</div>
				</CardHeader>

				<CardContent className="pt-0">
					<CardDescription className="mb-3 line-clamp-2 text-xs leading-relaxed">
						{data.polishDescription}
					</CardDescription>

					{/* Benefits */}
					{showBenefits && data.polishPrimaryBenefits.length > 0 && (
						<div className="mb-3">
							<div className="flex flex-wrap gap-1">
								{data.polishPrimaryBenefits
									.slice(0, 2)
									.map((benefit: string, index: number) => (
										<Badge key={index} variant="outline" className="text-xs">
											{benefit}
										</Badge>
									))}
								{data.polishPrimaryBenefits.length > 2 && (
									<Tooltip>
										<TooltipTrigger asChild>
											<Badge variant="outline" className="text-xs">
												+{data.polishPrimaryBenefits.length - 2}
											</Badge>
										</TooltipTrigger>
										<TooltipContent>
											<div className="space-y-1">
												{data.polishPrimaryBenefits
													.slice(2)
													.map((benefit: string, index: number) => (
														<div key={index}>{benefit}</div>
													))}
											</div>
										</TooltipContent>
									</Tooltip>
								)}
							</div>
						</div>
					)}

					{/* Quick Stats Row */}
					<div className="mb-3 flex items-center justify-between text-xs">
						{showStudyCount && data.studyCount > 0 && (
							<div className="flex items-center gap-1">
								<BookOpen className="h-3 w-3 text-muted-foreground" />
								<span>{data.studyCount}</span>
							</div>
						)}

						<div
							className={`flex items-center gap-1 ${getSafetyColor(data.safetyRating)}`}
						>
							<Shield className="h-3 w-3" />
							<span>{data.safetyRating}/10</span>
						</div>

						{showPrice && data.price && (
							<div className="font-medium text-primary">
								{data.price.min}-{data.price.max} {data.price.currency}
							</div>
						)}
					</div>

					{/* Action Buttons */}
					<div className="flex gap-1">
						<Button
							variant="outline"
							size="sm"
							className="h-7 flex-1 text-xs"
							onClick={handleDosageClick}
						>
							<Calculator className="mr-1 h-3 w-3" />
							Dawka
						</Button>

						<Button
							variant="outline"
							size="sm"
							className="h-7 flex-1 text-xs"
							onClick={handleSafetyClick}
						>
							<Shield className="mr-1 h-3 w-3" />
							Bezpieczeństwo
						</Button>

						<Button
							variant="ghost"
							size="sm"
							className={`h-7 w-7 p-0 ${isFavorited ? "text-red-500" : ""}`}
							onClick={handleFavoriteClick}
						>
							<Heart
								className={`h-3 w-3 ${isFavorited ? "fill-current" : ""}`}
							/>
						</Button>
					</div>
				</CardContent>
			</Card>
		</TooltipProvider>
	);
}
