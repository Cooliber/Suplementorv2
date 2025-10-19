"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	AlertTriangle,
	BookOpen,
	CheckCircle,
	HelpCircle,
	Info,
	Star,
	TrendingUp,
} from "lucide-react";
import type React from "react";

import type { ComprehensiveSupplementProfile } from "@/data/comprehensive-supplements/types";

interface EvidenceLevelIndicatorProps {
	supplement: ComprehensiveSupplementProfile;
	showDetails?: boolean;
	showStudies?: boolean;
	compact?: boolean;
	className?: string;
}

const evidenceLevelConfig = {
	STRONG: {
		color:
			"bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-300",
		bgColor: "bg-green-500",
		textColor: "text-green-700",
		label: "Silne dowody",
		description:
			"Wiele randomizowanych badań kontrolowanych i meta-analiz potwierdzających skuteczność",
		icon: CheckCircle,
		confidence: 90,
	},
	MODERATE: {
		color:
			"bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-300",
		bgColor: "bg-blue-500",
		textColor: "text-blue-700",
		label: "Umiarkowane dowody",
		description:
			"Kilka badań o dobrej jakości, ale wymagające dalszych potwierdzeń",
		icon: TrendingUp,
		confidence: 70,
	},
	WEAK: {
		color:
			"bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-300",
		bgColor: "bg-yellow-500",
		textColor: "text-yellow-700",
		label: "Słabe dowody",
		description: "Ograniczone badania lub niska jakość metodologiczna",
		icon: Info,
		confidence: 40,
	},
	INSUFFICIENT: {
		color:
			"bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900 dark:text-gray-300",
		bgColor: "bg-gray-500",
		textColor: "text-gray-700",
		label: "Niewystarczające dowody",
		description: "Brak wystarczających badań do wyciągnięcia wniosków",
		icon: HelpCircle,
		confidence: 20,
	},
	CONFLICTING: {
		color:
			"bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-300",
		bgColor: "bg-red-500",
		textColor: "text-red-700",
		label: "Sprzeczne dowody",
		description: "Badania dają mieszane lub sprzeczne wyniki",
		icon: AlertTriangle,
		confidence: 30,
	},
};

export const EvidenceLevelIndicator: React.FC<EvidenceLevelIndicatorProps> = ({
	supplement,
	showDetails = false,
	showStudies = true,
	compact = false,
	className = "",
}) => {
	const config = evidenceLevelConfig[supplement.evidenceLevel];
	const EvidenceIcon = config.icon;

	if (compact) {
		return (
			<TooltipProvider>
				<div className={`flex items-center gap-2 ${className}`}>
					<Badge variant="outline" className={config.color}>
						<EvidenceIcon className="mr-1 h-3 w-3" />
						{config.label}
					</Badge>
					{showStudies && supplement.clinicalEvidence?.totalStudies > 0 && (
						<div className="flex items-center gap-1 text-gray-600 text-xs">
							<BookOpen className="h-3 w-3" />
							<span>{supplement.clinicalEvidence.totalStudies}</span>
						</div>
					)}
				</div>
			</TooltipProvider>
		);
	}

	if (showDetails) {
		return (
			<Card className={className}>
				<CardHeader className="pb-3">
					<CardTitle className="flex items-center gap-2 text-lg">
						<BookOpen className="h-5 w-5" />
						Poziom dowodów naukowych
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					{/* Main Evidence Level */}
					<div className="flex items-center gap-3">
						<div className={`rounded-full p-3 ${config.bgColor}`}>
							<EvidenceIcon className="h-6 w-6 text-white" />
						</div>
						<div className="flex-1">
							<div className={`font-bold text-lg ${config.textColor}`}>
								{config.label}
							</div>
							<div className="text-gray-600 text-sm">{config.description}</div>
						</div>
					</div>

					{/* Confidence Level */}
					<div className="space-y-2">
						<div className="flex justify-between text-sm">
							<span>Poziom pewności</span>
							<span className="font-medium">{config.confidence}%</span>
						</div>
						<Progress value={config.confidence} className="h-2" />
					</div>

					{/* Study Statistics */}
					{showStudies && (
						<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
							<div className="rounded-lg border p-3 text-center">
								<div className={`font-bold text-lg ${config.textColor}`}>
									{supplement.clinicalEvidence?.totalStudies || 0}
								</div>
								<div className="text-gray-600 text-xs">Wszystkie badania</div>
							</div>
							<div className="rounded-lg border p-3 text-center">
								<div className="font-bold text-green-600 text-lg">
									{supplement.clinicalEvidence?.rctCount || 0}
								</div>
								<div className="text-gray-600 text-xs">Badania RCT</div>
							</div>
							<div className="rounded-lg border p-3 text-center">
								<div className="font-bold text-lg text-purple-600">
									{supplement.clinicalEvidence?.metaAnalyses || 0}
								</div>
								<div className="text-gray-600 text-xs">Meta-analizy</div>
							</div>
							<div className="rounded-lg border p-3 text-center">
								<div className="font-bold text-lg text-orange-600">
									{supplement.clinicalEvidence?.observationalStudies || 0}
								</div>
								<div className="text-gray-600 text-xs">
									Badania obserwacyjne
								</div>
							</div>
						</div>
					)}

					{/* Last Review Date */}
					{supplement.clinicalEvidence?.lastReviewDate && (
						<div className="border-t pt-2 text-center text-gray-500 text-xs">
							Ostatnia aktualizacja dowodów:{" "}
							{new Date(
								supplement.clinicalEvidence.lastReviewDate,
							).toLocaleDateString("pl-PL")}
						</div>
					)}
				</CardContent>
			</Card>
		);
	}

	// Simple badge format
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<Badge variant="outline" className={`${config.color} ${className}`}>
						<EvidenceIcon className="mr-1 h-3 w-3" />
						{config.label}
					</Badge>
				</TooltipTrigger>
				<TooltipContent>
					<div className="space-y-1">
						<div className="font-medium">{config.label}</div>
						<div className="text-xs">{config.description}</div>
						{showStudies && supplement.clinicalEvidence?.totalStudies > 0 && (
							<div className="text-xs">
								Badania: {supplement.clinicalEvidence.totalStudies}
							</div>
						)}
					</div>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};

export default EvidenceLevelIndicator;
