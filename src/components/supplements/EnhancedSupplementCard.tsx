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
import type { EvidenceLevel, SupplementCategory } from "@/types/supplement";
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
	Zap,
} from "lucide-react";
import { useState } from "react";

interface EnhancedSupplementCardProps {
	id: string;
	name: string;
	polishName: string;
	category: SupplementCategory;
	polishCategory: string;
	description: string;
	polishDescription: string;
	evidenceLevel: EvidenceLevel;
	safetyRating: number;
	userRating: number;
	primaryBenefits: string[];
	polishPrimaryBenefits: string[];
	studyCount: number;
	price?: {
		min: number;
		max: number;
		currency: string;
	};
	mechanismOfAction?: string;
	polishMechanismOfAction?: string;
	activeCompounds?: string[];
	sideEffects?: string[];
	brainRegions?: string[];
	onCardClick?: (id: string) => void;
	onFavoriteClick?: (id: string) => void;
	onDosageClick?: (id: string) => void;
	onSafetyClick?: (id: string) => void;
	compact?: boolean;
	showPrice?: boolean;
	showBenefits?: boolean;
	showStudyCount?: boolean;
}

const evidenceLevelConfig = {
	STRONG: {
		color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
		label: "Silne dowody",
		icon: Star,
	},
	MODERATE: {
		color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
		label: "Umiarkowane dowody",
		icon: TrendingUp,
	},
	WEAK: {
		color:
			"bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
		label: "Słabe dowody",
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
	AMINO_ACID: Zap,
	HERB: TrendingUp,
	ADAPTOGEN: Shield,
	COENZYME: Zap,
	FATTY_ACID: Heart,
	PROBIOTIC: Shield,
	ENZYME: Zap,
	OTHER: Info,
};

const categoryColors: Record<SupplementCategory, string> = {
	NOOTROPIC:
		"bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
	VITAMIN: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
	MINERAL: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
	AMINO_ACID:
		"bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
	HERB: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300",
	ADAPTOGEN: "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300",
	COENZYME:
		"bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
	FATTY_ACID: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300",
	PROBIOTIC: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
	ENZYME: "bg-lime-100 text-lime-800 dark:bg-lime-900 dark:text-lime-300",
	OTHER: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
};

export function EnhancedSupplementCard({
	id,
	name,
	polishName,
	category,
	polishCategory,
	description,
	polishDescription,
	evidenceLevel,
	safetyRating,
	userRating,
	primaryBenefits,
	polishPrimaryBenefits,
	studyCount,
	price,
	mechanismOfAction,
	polishMechanismOfAction,
	activeCompounds,
	sideEffects,
	brainRegions,
	onCardClick,
	onFavoriteClick,
	onDosageClick,
	onSafetyClick,
	compact = false,
	showPrice = true,
	showBenefits = true,
	showStudyCount = true,
}: EnhancedSupplementCardProps) {
	const [isFavorited, setIsFavorited] = useState(false);
	const [imageError, setImageError] = useState(false);

	const EvidenceIcon = evidenceLevelConfig[evidenceLevel].icon;
	const CategoryIcon = categoryIcons[category];

	const handleFavoriteClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		setIsFavorited(!isFavorited);
		onFavoriteClick?.(id);
	};

	const handleDosageClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		onDosageClick?.(id);
	};

	const handleSafetyClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		onSafetyClick?.(id);
	};

	const getSafetyColor = (rating: number) => {
		if (rating >= 8) return "text-green-600";
		if (rating >= 6) return "text-yellow-600";
		return "text-red-600";
	};

	const getSafetyLabel = (rating: number) => {
		if (rating >= 8) return "Bardzo bezpieczny";
		if (rating >= 6) return "Bezpieczny";
		return "Wymaga ostrożności";
	};

	return (
		<TooltipProvider>
			<Card
				className={`group relative cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 ${
					compact ? "h-auto" : "h-full"
				}`}
				onClick={() => onCardClick?.(id)}
			>
				{/* Gradient overlay for visual appeal */}
				<div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

				<CardHeader className="relative pb-3">
					<div className="flex items-start justify-between gap-3">
						<div className="flex min-w-0 flex-1 items-center gap-3">
							<div className={`rounded-lg p-2 ${categoryColors[category]}`}>
								<CategoryIcon className="h-5 w-5" />
							</div>
							<div className="min-w-0 flex-1">
								<CardTitle
									className={`text-lg leading-tight ${compact ? "line-clamp-1" : ""}`}
								>
									{polishName}
								</CardTitle>
								<CardDescription className="text-muted-foreground text-sm">
									{polishCategory}
								</CardDescription>
							</div>
						</div>

						<div className="flex flex-col items-end gap-2">
							<Tooltip>
								<TooltipTrigger asChild>
									<Badge
										variant="secondary"
										className={`${evidenceLevelConfig[evidenceLevel].color} text-xs`}
									>
										<EvidenceIcon className="mr-1 h-3 w-3" />
										{evidenceLevelConfig[evidenceLevel].label}
									</Badge>
								</TooltipTrigger>
								<TooltipContent>
									<p>Poziom dowodów naukowych</p>
								</TooltipContent>
							</Tooltip>

							{userRating > 0 && (
								<div className="flex items-center gap-1">
									<Star className="h-3 w-3 fill-current text-yellow-500" />
									<span className="font-medium text-xs">{userRating}</span>
								</div>
							)}
						</div>
					</div>

					<CardDescription
						className={`text-sm leading-relaxed ${compact ? "line-clamp-2" : ""}`}
					>
						{polishDescription}
					</CardDescription>
				</CardHeader>

				<CardContent className="relative space-y-4">
					{/* Benefits */}
					{showBenefits && polishPrimaryBenefits.length > 0 && (
						<div>
							<h4 className="mb-2 font-medium text-muted-foreground text-sm">
								Główne korzyści:
							</h4>
							<div className="flex flex-wrap gap-1">
								{polishPrimaryBenefits
									.slice(0, compact ? 2 : 3)
									.map((benefit, index) => (
										<Badge key={index} variant="outline" className="text-xs">
											{benefit}
										</Badge>
									))}
								{polishPrimaryBenefits.length > (compact ? 2 : 3) && (
									<Tooltip>
										<TooltipTrigger asChild>
											<Badge variant="outline" className="text-xs">
												+{polishPrimaryBenefits.length - (compact ? 2 : 3)}
											</Badge>
										</TooltipTrigger>
										<TooltipContent>
											<div className="space-y-1">
												{polishPrimaryBenefits
													.slice(compact ? 2 : 3)
													.map((benefit, index) => (
														<div key={index}>{benefit}</div>
													))}
											</div>
										</TooltipContent>
									</Tooltip>
								)}
							</div>
						</div>
					)}

					{/* Quick Stats */}
					<div className="grid grid-cols-2 gap-4 text-sm">
						{showStudyCount && studyCount > 0 && (
							<div className="flex items-center gap-2">
								<BookOpen className="h-4 w-4 text-muted-foreground" />
								<div>
									<div className="font-medium">{studyCount}</div>
									<div className="text-muted-foreground text-xs">badań</div>
								</div>
							</div>
						)}

						<div className="flex items-center gap-2">
							<Shield className={`h-4 w-4 ${getSafetyColor(safetyRating)}`} />
							<div>
								<div className={`font-medium ${getSafetyColor(safetyRating)}`}>
									{safetyRating}/10
								</div>
								<div className="text-muted-foreground text-xs">
									{getSafetyLabel(safetyRating)}
								</div>
							</div>
						</div>
					</div>

					{/* Price */}
					{showPrice && price && (
						<div className="flex items-center justify-between border-t pt-3">
							<div className="font-semibold text-primary">
								{price.min}-{price.max} {price.currency}
							</div>
						</div>
					)}

					{/* Action Buttons */}
					<div className="flex gap-2 pt-2">
						<Button
							variant="outline"
							size="sm"
							className="flex-1"
							onClick={handleDosageClick}
						>
							<Calculator className="mr-1 h-4 w-4" />
							Dawka
						</Button>

						<Button
							variant="outline"
							size="sm"
							className="flex-1"
							onClick={handleSafetyClick}
						>
							<Shield className="mr-1 h-4 w-4" />
							Bezpieczeństwo
						</Button>

						<Button
							variant="ghost"
							size="sm"
							onClick={handleFavoriteClick}
							className={isFavorited ? "text-red-500" : ""}
						>
							<Heart
								className={`h-4 w-4 ${isFavorited ? "fill-current" : ""}`}
							/>
						</Button>
					</div>

					{/* View Details Button */}
					<Button asChild className="w-full" size="sm">
						<a href={`/suplementy/${id}`}>
							<ExternalLink className="mr-2 h-4 w-4" />
							Zobacz szczegóły
						</a>
					</Button>
				</CardContent>
			</Card>
		</TooltipProvider>
	);
}
