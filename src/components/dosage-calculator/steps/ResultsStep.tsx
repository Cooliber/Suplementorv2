"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import type { DosageCalculationResult } from "@/types/dosage-calculator";
import {
	Activity,
	AlertTriangle,
	BarChart3,
	Brain,
	CheckCircle,
	Clock,
	Download,
	Heart,
	Info,
	Moon,
	PieChart,
	Pill,
	Share,
	Shield,
	Target,
	TrendingUp,
	Zap,
	Zap as ZapIcon,
} from "lucide-react";

interface ResultsStepProps {
	result: DosageCalculationResult;
	isPolish: boolean;
}

const RISK_COLORS = {
	low: "text-green-600 bg-green-50 border-green-200",
	medium: "text-yellow-600 bg-yellow-50 border-yellow-200",
	high: "text-red-600 bg-red-50 border-red-200",
};

const CONFIDENCE_COLORS = {
	high: "text-green-600",
	medium: "text-yellow-600",
	low: "text-red-600",
};

export function ResultsStep({ result, isPolish }: ResultsStepProps) {
	const getRiskIcon = (risk: string) => {
		switch (risk) {
			case "high":
				return <AlertTriangle className="h-5 w-5" />;
			case "medium":
				return <Info className="h-5 w-5" />;
			default:
				return <CheckCircle className="h-5 w-5" />;
		}
	};

	const getRiskColor = (risk: string) => {
		return RISK_COLORS[risk as keyof typeof RISK_COLORS] || RISK_COLORS.low;
	};

	const getConfidenceColor = (confidence: number) => {
		if (confidence >= 0.8) return CONFIDENCE_COLORS.high;
		if (confidence >= 0.6) return CONFIDENCE_COLORS.medium;
		return CONFIDENCE_COLORS.low;
	};

	const getConfidenceLabel = (confidence: number) => {
		if (confidence >= 0.8) return isPolish ? "Wysoka" : "High";
		if (confidence >= 0.6) return isPolish ? "Średnia" : "Medium";
		return isPolish ? "Niska" : "Low";
	};

	return (
		<TooltipProvider>
			<div className="space-y-6">
				{/* Enhanced Overall Risk Assessment */}
				<Card
					className={`border-2 ${getRiskColor(result.overallRisk)} shadow-lg`}
				>
					<CardHeader className="pb-4">
						<CardTitle className="flex items-center gap-3 text-xl">
							<div className="rounded-lg bg-white/20 p-2">
								{getRiskIcon(result.overallRisk)}
							</div>
							{isPolish ? "Ocena ryzyka" : "Risk Assessment"}
						</CardTitle>
						<CardDescription className="text-base">
							{isPolish
								? "Ogólna ocena bezpieczeństwa Twojego planu suplementacji"
								: "Overall safety assessment of your supplementation plan"}
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="flex items-center justify-between">
							<div className="space-y-2">
								<h3 className="font-bold text-2xl capitalize">
									{isPolish
										? `Ryzyko: ${result.overallRisk}`
										: `Risk: ${result.overallRisk}`}
								</h3>
								<p className="text-muted-foreground">
									{result.overallRisk === "low" &&
										(isPolish
											? "Plan suplementacji wydaje się bezpieczny"
											: "Supplementation plan appears safe")}
									{result.overallRisk === "medium" &&
										(isPolish
											? "Plan wymaga ostrożności i monitorowania"
											: "Plan requires caution and monitoring")}
									{result.overallRisk === "high" &&
										(isPolish
											? "Plan wymaga konsultacji z lekarzem"
											: "Plan requires consultation with a doctor")}
								</p>
							</div>
							<div className="space-y-2 text-right">
								<Badge
									variant={
										result.overallRisk === "low" ? "default" : "destructive"
									}
									className="px-6 py-3 text-xl"
								>
									{result.overallRisk.toUpperCase()}
								</Badge>
								<div className="text-muted-foreground text-sm">
									{result.safetyAlerts.length}{" "}
									{isPolish ? "ostrzeżeń" : "alerts"}
								</div>
							</div>
						</div>

						{/* Enhanced Confidence Score with visual indicators */}
						<div className="space-y-3">
							<div className="flex items-center justify-between">
								<span className="font-medium">
									{isPolish
										? "Wiarygodność obliczeń"
										: "Calculation Confidence"}
								</span>
								<div className="flex items-center gap-2">
									<span
										className={`font-bold ${getConfidenceColor(result.totalConfidence)}`}
									>
										{Math.round(result.totalConfidence * 100)}%
									</span>
									<span className="text-muted-foreground text-sm">
										{getConfidenceLabel(result.totalConfidence)}
									</span>
								</div>
							</div>
							<div className="relative">
								<Progress
									value={result.totalConfidence * 100}
									className="h-3"
								/>
								<div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
							</div>
							<div className="flex justify-between text-muted-foreground text-xs">
								<span>0%</span>
								<span>50%</span>
								<span>100%</span>
							</div>
						</div>

						{/* Risk breakdown visualization */}
						<div className="grid grid-cols-3 gap-4 border-t pt-4">
							<div className="text-center">
								<div className="font-bold text-2xl text-green-600">
									{
										result.safetyAlerts.filter((a) => a.severity === "low")
											.length
									}
								</div>
								<div className="text-muted-foreground text-sm">
									{isPolish ? "Niskie ryzyko" : "Low Risk"}
								</div>
							</div>
							<div className="text-center">
								<div className="font-bold text-2xl text-yellow-600">
									{
										result.safetyAlerts.filter((a) => a.severity === "medium")
											.length
									}
								</div>
								<div className="text-muted-foreground text-sm">
									{isPolish ? "Średnie ryzyko" : "Medium Risk"}
								</div>
							</div>
							<div className="text-center">
								<div className="font-bold text-2xl text-red-600">
									{
										result.safetyAlerts.filter((a) => a.severity === "high")
											.length
									}
								</div>
								<div className="text-muted-foreground text-sm">
									{isPolish ? "Wysokie ryzyko" : "High Risk"}
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Dosage Recommendations */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Pill className="h-5 w-5" />
							{isPolish ? "Rekomendacje dawek" : "Dosage Recommendations"}
						</CardTitle>
						<CardDescription>
							{isPolish
								? "Spersonalizowane dawki suplementów dostosowane do Twojego profilu"
								: "Personalized supplement dosages tailored to your profile"}
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						{result.dosageRecommendations.map((recommendation) => (
							<Card key={recommendation.supplementId} className="p-4">
								<div className="space-y-4">
									<div className="flex items-center justify-between">
										<div>
											<h4 className="font-semibold">
												{isPolish
													? recommendation.polishSupplementName
													: recommendation.supplementName}
											</h4>
											<div className="mt-1 flex items-center gap-2">
												<Badge variant="outline" className="text-xs">
													{isPolish
														? recommendation.pharmacokineticFactors
																.bioavailability
														: recommendation.pharmacokineticFactors
																.bioavailability}
													% {isPolish ? "biodostępność" : "bioavailability"}
												</Badge>
												<Badge
													variant="secondary"
													className={`text-xs ${getConfidenceColor(recommendation.confidence)}`}
												>
													{Math.round(recommendation.confidence * 100)}%{" "}
													{isPolish ? "pewność" : "confidence"}
												</Badge>
											</div>
										</div>
									</div>

									{/* Dosage Range */}
									<div className="rounded-lg bg-muted/50 p-3">
										<div className="mb-2 flex items-center justify-between">
											<span className="font-medium text-sm">
												{isPolish ? "Zalecana dawka:" : "Recommended dosage:"}
											</span>
											<span className="font-semibold">
												{recommendation.recommendedDosage.min}-
												{recommendation.recommendedDosage.max}{" "}
												{recommendation.recommendedDosage.unit}
											</span>
										</div>

										{/* Timing */}
										<div className="flex items-center gap-2 text-muted-foreground text-sm">
											<Clock className="h-4 w-4" />
											<span>
												{recommendation.timing.join(", ")} •{" "}
												{recommendation.withFood
													? isPolish
														? "z jedzeniem"
														: "with food"
													: isPolish
														? "bez jedzenia"
														: "without food"}
											</span>
										</div>
									</div>

									{/* Adjustments */}
									{recommendation.adjustments.length > 0 && (
										<div className="space-y-2">
											<h5 className="font-medium text-sm">
												{isPolish ? "Korekty dawki:" : "Dosage adjustments:"}
											</h5>
											<div className="space-y-1">
												{recommendation.adjustments
													.slice(0, 3)
													.map((adjustment, index) => (
														<div
															key={index}
															className="flex justify-between text-muted-foreground text-xs"
														>
															<span>
																{isPolish
																	? adjustment.polishReason
																	: adjustment.reason}
															</span>
															<span
																className={
																	adjustment.adjustment !== 1
																		? "font-medium"
																		: ""
																}
															>
																{adjustment.adjustment !== 1
																	? `${Math.round((adjustment.adjustment - 1) * 100)}%`
																	: "Brak"}
															</span>
														</div>
													))}
											</div>
										</div>
									)}
								</div>
							</Card>
						))}
					</CardContent>
				</Card>

				{/* Safety Alerts */}
				{result.safetyAlerts.length > 0 && (
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Shield className="h-5 w-5" />
								{isPolish ? "Ostrzeżenia bezpieczeństwa" : "Safety Alerts"}
							</CardTitle>
							<CardDescription>
								{isPolish
									? "Ważne informacje dotyczące bezpieczeństwa suplementacji"
									: "Important safety information for your supplementation"}
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-3">
							{result.safetyAlerts.map((alert, index) => (
								<Alert
									key={index}
									variant={
										alert.severity === "high" ? "destructive" : "default"
									}
								>
									<AlertTriangle className="h-4 w-4" />
									<AlertDescription>
										<div className="space-y-1">
											<p className="font-medium">
												{isPolish ? alert.polishMessage : alert.message}
											</p>
											<p className="text-sm opacity-90">
												{isPolish
													? alert.polishRecommendation
													: alert.recommendation}
											</p>
										</div>
									</AlertDescription>
								</Alert>
							))}
						</CardContent>
					</Card>
				)}

				{/* Interaction Analysis */}
				{result.interactionAnalysis.length > 0 && (
					<Card>
						<CardHeader>
							<CardTitle>
								{isPolish ? "Analiza interakcji" : "Interaction Analysis"}
							</CardTitle>
							<CardDescription>
								{isPolish
									? "Interakcje między suplementami i potencjalne efekty"
									: "Interactions between supplements and potential effects"}
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-3">
							{result.interactionAnalysis.map((interaction, index) => (
								<div key={index} className="rounded-lg border p-3">
									<div className="mb-2 flex items-center justify-between">
										<Badge
											variant={
												interaction.severity === "severe"
													? "destructive"
													: interaction.severity === "moderate"
														? "secondary"
														: "outline"
											}
										>
											{interaction.severity}
										</Badge>
										<span className="text-muted-foreground text-sm capitalize">
											{interaction.interactionType}
										</span>
									</div>
									<p className="text-sm">
										{isPolish
											? interaction.polishClinicalSignificance
											: interaction.clinicalSignificance}
									</p>
									{interaction.timingAdjustment && (
										<p className="mt-1 text-muted-foreground text-xs">
											<Clock className="mr-1 inline h-3 w-3" />
											{isPolish
												? interaction.polishTimingAdjustment
												: interaction.timingAdjustment}
										</p>
									)}
								</div>
							))}
						</CardContent>
					</Card>
				)}

				{/* Warnings and Recommendations */}
				{(result.warnings.length > 0 || result.recommendations.length > 0) && (
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						{result.warnings.length > 0 && (
							<Card>
								<CardHeader>
									<CardTitle className="text-amber-600 text-lg">
										{isPolish ? "Ostrzeżenia" : "Warnings"}
									</CardTitle>
								</CardHeader>
								<CardContent>
									<ul className="space-y-2">
										{result.warnings.map((warning, index) => (
											<li
												key={index}
												className="flex items-start gap-2 text-sm"
											>
												<AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600" />
												{warning}
											</li>
										))}
									</ul>
								</CardContent>
							</Card>
						)}

						{result.recommendations.length > 0 && (
							<Card>
								<CardHeader>
									<CardTitle className="text-blue-600 text-lg">
										{isPolish ? "Zalecenia" : "Recommendations"}
									</CardTitle>
								</CardHeader>
								<CardContent>
									<ul className="space-y-2">
										{result.recommendations.map((recommendation, index) => (
											<li
												key={index}
												className="flex items-start gap-2 text-sm"
											>
												<CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" />
												{recommendation}
											</li>
										))}
									</ul>
								</CardContent>
							</Card>
						)}
					</div>
				)}

				{/* Action Buttons */}
				<Card>
					<CardContent className="pt-6">
						<div className="flex flex-col gap-3 sm:flex-row">
							<Button className="flex items-center gap-2">
								<Download className="h-4 w-4" />
								{isPolish ? "Pobierz PDF" : "Download PDF"}
							</Button>
							<Button variant="outline" className="flex items-center gap-2">
								<Share className="h-4 w-4" />
								{isPolish ? "Udostępnij" : "Share"}
							</Button>
							<Button variant="outline" className="flex items-center gap-2">
								<CheckCircle className="h-4 w-4" />
								{isPolish ? "Zapisz wyniki" : "Save Results"}
							</Button>
						</div>
					</CardContent>
				</Card>

				{/* Footer Information */}
				<Card className="bg-muted/50">
					<CardContent className="pt-6">
						<div className="space-y-2 text-center">
							<p className="text-muted-foreground text-sm">
								{isPolish ? "Data obliczeń:" : "Calculation date:"}{" "}
								{new Date(result.calculationDate).toLocaleDateString()}
							</p>
							<p className="text-muted-foreground text-xs">
								{isPolish
									? "Pamiętaj, że te rekomendacje są oparte na ogólnych danych i nie zastępują profesjonalnej porady medycznej."
									: "Remember that these recommendations are based on general data and do not replace professional medical advice."}
							</p>
						</div>
					</CardContent>
				</Card>
			</div>
		</TooltipProvider>
	);
}
