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
	Calculator,
	ExternalLink,
	Heart,
	Info,
	Shield,
	Star,
	TrendingUp,
	Brain,
} from "lucide-react";
import { useState } from "react";

interface CompactSupplementCardProps {
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
		color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
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
	onCardClick,
	onFavoriteClick,
	onDosageClick,
	onSafetyClick,
	showPrice = true,
	showBenefits = true,
	showStudyCount = true,
}: CompactSupplementCardProps) {
	const [isFavorited, setIsFavorited] = useState(false);

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

	return (
		<TooltipProvider>
			<Card
				className="group relative overflow-hidden transition-all duration-300 hover:shadow-md cursor-pointer h-full"
				onClick={() => onCardClick?.(id)}
			>
				<CardHeader className="pb-2">
					<div className="flex items-start justify-between gap-2">
						<div className="flex items-center gap-2 flex-1 min-w-0">
							<CategoryIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
							<div className="flex-1 min-w-0">
								<CardTitle className="text-sm leading-tight line-clamp-1">
									{polishName}
								</CardTitle>
								<CardDescription className="text-xs text-muted-foreground line-clamp-1">
									{polishCategory}
								</CardDescription>
							</div>
						</div>

						<div className="flex flex-col items-end gap-1">
							<Badge
								variant="secondary"
								className={`${evidenceLevelConfig[evidenceLevel].color} text-xs px-1 py-0`}
							>
								<EvidenceIcon className="h-2 w-2 mr-1" />
								{evidenceLevelConfig[evidenceLevel].label}
							</Badge>

							{userRating > 0 && (
								<div className="flex items-center gap-1">
									<Star className="h-2 w-2 fill-current text-yellow-500" />
									<span className="text-xs">{userRating}</span>
								</div>
							)}
						</div>
					</div>
				</CardHeader>

				<CardContent className="pt-0">
					<CardDescription className="text-xs leading-relaxed line-clamp-2 mb-3">
						{polishDescription}
					</CardDescription>

					{/* Benefits */}
					{showBenefits && polishPrimaryBenefits.length > 0 && (
						<div className="mb-3">
							<div className="flex flex-wrap gap-1">
								{polishPrimaryBenefits.slice(0, 2).map((benefit, index) => (
									<Badge key={index} variant="outline" className="text-xs">
										{benefit}
									</Badge>
								))}
								{polishPrimaryBenefits.length > 2 && (
									<Tooltip>
										<TooltipTrigger asChild>
											<Badge variant="outline" className="text-xs">
												+{polishPrimaryBenefits.length - 2}
											</Badge>
										</TooltipTrigger>
										<TooltipContent>
											<div className="space-y-1">
												{polishPrimaryBenefits.slice(2).map((benefit, index) => (
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
					<div className="flex items-center justify-between text-xs mb-3">
						{showStudyCount && studyCount > 0 && (
							<div className="flex items-center gap-1">
								<BookOpen className="h-3 w-3 text-muted-foreground" />
								<span>{studyCount}</span>
							</div>
						)}

						<div className={`flex items-center gap-1 ${getSafetyColor(safetyRating)}`}>
							<Shield className="h-3 w-3" />
							<span>{safetyRating}/10</span>
						</div>

						{showPrice && price && (
							<div className="font-medium text-primary">
								{price.min}-{price.max} {price.currency}
							</div>
						)}
					</div>

					{/* Action Buttons */}
					<div className="flex gap-1">
						<Button
							variant="outline"
							size="sm"
							className="flex-1 h-7 text-xs"
							onClick={handleDosageClick}
						>
							<Calculator className="h-3 w-3 mr-1" />
							Dawka
						</Button>

						<Button
							variant="outline"
							size="sm"
							className="flex-1 h-7 text-xs"
							onClick={handleSafetyClick}
						>
							<Shield className="h-3 w-3 mr-1" />
							Bezpieczeństwo
						</Button>

						<Button
							variant="ghost"
							size="sm"
							className={`h-7 w-7 p-0 ${isFavorited ? "text-red-500" : ""}`}
							onClick={handleFavoriteClick}
						>
							<Heart className={`h-3 w-3 ${isFavorited ? "fill-current" : ""}`} />
						</Button>
					</div>
				</CardContent>
			</Card>
		</TooltipProvider>
	);
}