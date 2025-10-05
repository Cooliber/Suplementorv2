"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
	AlertTriangle,
	BarChart3,
	Brain,
	Calendar,
	CheckCircle,
	ChevronDown,
	ChevronUp,
	Clock,
	DollarSign,
	Eye,
	Heart,
	Lightbulb,
	MessageSquare,
	Shield,
	Star,
	Target,
	ThumbsDown,
	ThumbsUp,
	TrendingUp,
	XCircle,
	Zap,
} from "lucide-react";
import type React from "react";
import { useCallback, useMemo, useState } from "react";

interface AIRecommendation {
	id: string;
	userId: string;
	context: {
		generatedAt: Date;
		triggerEvent: string;
		polishTriggerEvent: string;
		confidenceScore: number;
		dataQuality: string;
		polishDataQuality: string;
	};
	primaryRecommendations: Array<{
		id: string;
		supplementId: string;
		supplementName: string;
		polishSupplementName: string;
		category: string;
		polishCategory: string;
		recommendationScore: number;
		confidenceLevel: string;
		polishConfidenceLevel: string;
		priority: string;
		polishPriority: string;
		reasoning: {
			primaryReasons: string[];
			polishPrimaryReasons: string[];
			goalAlignment: Array<{
				goalName: string;
				polishGoalName: string;
				alignmentScore: number;
				expectedImpact: string;
				polishExpectedImpact: string;
			}>;
		};
		dosageRecommendation: {
			amount: number;
			unit: string;
			polishUnit: string;
			frequency: string;
			polishFrequency: string;
			timing: string[];
			polishTiming: string[];
			withFood: boolean;
			specialInstructions: string;
			polishSpecialInstructions: string;
		};
		expectedOutcomes: {
			timeToEffect: { min: number; max: number; typical: number };
			expectedBenefits: Array<{
				benefit: string;
				polishBenefit: string;
				likelihood: number;
				magnitude: number;
				timeframe: string;
				polishTimeframe: string;
			}>;
			potentialSideEffects: Array<{
				sideEffect: string;
				polishSideEffect: string;
				probability: number;
				severity: string;
				polishSeverity: string;
			}>;
		};
		costAnalysis: {
			estimatedMonthlyCost: number;
			currency: string;
			budgetFit: string;
			polishBudgetFit: string;
		};
	}>;
	alternativeRecommendations: Array<{
		supplementName: string;
		polishSupplementName: string;
		reason: string;
		polishReason: string;
		recommendationScore: number;
	}>;
	contraindications: Array<{
		type: string;
		polishType: string;
		description: string;
		polishDescription: string;
		severity: string;
		polishSeverity: string;
	}>;
	stackOptimization: {
		synergies: Array<{
			supplementNames: string[];
			polishSupplementNames: string[];
			synergyType: string;
			polishSynergyType: string;
			description: string;
			polishDescription: string;
		}>;
		timingOptimization: Array<{
			timeSlot: string;
			polishTimeSlot: string;
			supplements: Array<{
				name: string;
				polishName: string;
				dosage: string;
				reason: string;
				polishReason: string;
			}>;
		}>;
	};
	userFeedback: {
		viewed: boolean;
		accepted: boolean;
		rejectedRecommendations: string[];
		overallSatisfaction?: number;
		comments?: string;
		polishComments?: string;
	};
	status: string;
	polishStatus: string;
}

interface AIRecommendationViewerProps {
	recommendation: AIRecommendation;
	onAcceptRecommendation: (
		recommendationId: string,
		supplementIds: string[],
	) => void;
	onRejectRecommendation: (
		recommendationId: string,
		supplementIds: string[],
		reason: string,
	) => void;
	onProvideFeedback: (
		recommendationId: string,
		satisfaction: number,
		comments: string,
	) => void;
	onRequestAlternatives: (supplementId: string) => void;
	className?: string;
}

const AIRecommendationViewer: React.FC<AIRecommendationViewerProps> = ({
	recommendation,
	onAcceptRecommendation,
	onRejectRecommendation,
	onProvideFeedback,
	onRequestAlternatives,
	className = "",
}) => {
	const [expandedRecommendation, setExpandedRecommendation] = useState<
		string | null
	>(null);
	const [selectedRecommendations, setSelectedRecommendations] = useState<
		string[]
	>([]);
	const [feedbackRating, setFeedbackRating] = useState<number>(0);
	const [feedbackComments, setFeedbackComments] = useState<string>("");
	const [showFeedbackForm, setShowFeedbackForm] = useState(false);

	// Get confidence color
	const getConfidenceColor = (level: string) => {
		switch (level) {
			case "VERY_HIGH":
				return "bg-green-100 text-green-800";
			case "HIGH":
				return "bg-blue-100 text-blue-800";
			case "MODERATE":
				return "bg-yellow-100 text-yellow-800";
			case "LOW":
				return "bg-red-100 text-red-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const getPriorityColor = (priority: string) => {
		switch (priority) {
			case "CRITICAL":
				return "bg-red-100 text-red-800";
			case "HIGH":
				return "bg-orange-100 text-orange-800";
			case "MEDIUM":
				return "bg-yellow-100 text-yellow-800";
			case "LOW":
				return "bg-green-100 text-green-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const getSeverityColor = (severity: string) => {
		switch (severity) {
			case "SEVERE":
				return "text-red-600";
			case "MODERATE":
				return "text-orange-600";
			case "MILD":
				return "text-yellow-600";
			default:
				return "text-gray-600";
		}
	};

	const handleRecommendationToggle = (recommendationId: string) => {
		setSelectedRecommendations((prev) =>
			prev.includes(recommendationId)
				? prev.filter((id) => id !== recommendationId)
				: [...prev, recommendationId],
		);
	};

	const handleAcceptSelected = () => {
		if (selectedRecommendations.length > 0) {
			onAcceptRecommendation(recommendation.id, selectedRecommendations);
		}
	};

	const handleRejectSelected = (reason: string) => {
		if (selectedRecommendations.length > 0) {
			onRejectRecommendation(
				recommendation.id,
				selectedRecommendations,
				reason,
			);
		}
	};

	const handleSubmitFeedback = () => {
		onProvideFeedback(recommendation.id, feedbackRating, feedbackComments);
		setShowFeedbackForm(false);
		setFeedbackRating(0);
		setFeedbackComments("");
	};

	const renderStarRating = (
		rating: number,
		onRatingChange?: (rating: number) => void,
	) => {
		return (
			<div className="flex items-center gap-1">
				{[1, 2, 3, 4, 5].map((star) => (
					<button
						key={star}
						onClick={() => onRatingChange?.(star)}
						className={cn(
							"rounded p-1",
							star <= rating ? "text-yellow-500" : "text-gray-300",
							onRatingChange && "transition-colors hover:text-yellow-400",
						)}
						disabled={!onRatingChange}
					>
						<Star className="h-4 w-4 fill-current" />
					</button>
				))}
			</div>
		);
	};

	return (
		<div className={cn("w-full space-y-6", className)}>
			{/* Header */}
			<Card>
				<CardHeader>
					<div className="flex items-start justify-between">
						<div>
							<CardTitle className="flex items-center gap-2">
								<Brain className="h-5 w-5 text-blue-600" />
								Rekomendacje AI dla Ciebie
							</CardTitle>
							<p className="mt-1 text-gray-600">
								Wygenerowane{" "}
								{new Date(
									recommendation.context.generatedAt,
								).toLocaleDateString("pl-PL")}{" "}
								• Powód: {recommendation.context.polishTriggerEvent}
							</p>
						</div>

						<div className="flex items-center gap-2">
							<Badge variant="outline">
								<BarChart3 className="mr-1 h-3 w-3" />
								{recommendation.context.polishDataQuality} jakość danych
							</Badge>
							<Badge className="bg-blue-100 text-blue-800">
								<Target className="mr-1 h-3 w-3" />
								{Math.round(recommendation.context.confidenceScore * 100)}%
								pewności
							</Badge>
						</div>
					</div>

					<div className="mt-4">
						<div className="mb-2 flex items-center justify-between text-sm">
							<span>Ogólna pewność rekomendacji</span>
							<span>
								{Math.round(recommendation.context.confidenceScore * 100)}%
							</span>
						</div>
						<Progress
							value={recommendation.context.confidenceScore * 100}
							className="h-2"
						/>
					</div>
				</CardHeader>
			</Card>

			{/* Primary Recommendations */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Zap className="h-5 w-5 text-green-600" />
						Główne rekomendacje ({recommendation.primaryRecommendations.length})
					</CardTitle>
					<p className="text-gray-600">
						Suplementy najlepiej dopasowane do Twoich celów i profilu
						zdrowotnego
					</p>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{recommendation.primaryRecommendations.map((rec) => (
							<Card key={rec.id} className="border-l-4 border-l-blue-500">
								<CardHeader className="pb-4">
									<div className="flex items-start justify-between">
										<div className="flex-1">
											<div className="mb-2 flex items-center gap-2">
												<input
													type="checkbox"
													checked={selectedRecommendations.includes(rec.id)}
													onChange={() => handleRecommendationToggle(rec.id)}
													className="rounded border-gray-300"
												/>
												<h3 className="font-medium text-lg">
													{rec.polishSupplementName}
												</h3>
												<Badge className={getPriorityColor(rec.priority)}>
													{rec.polishPriority}
												</Badge>
												<Badge
													className={getConfidenceColor(rec.confidenceLevel)}
												>
													{rec.polishConfidenceLevel}
												</Badge>
											</div>

											<div className="flex items-center gap-4 text-gray-600 text-sm">
												<span className="flex items-center gap-1">
													<Target className="h-3 w-3" />
													{Math.round(rec.recommendationScore * 100)}%
													dopasowanie
												</span>
												<span className="flex items-center gap-1">
													<DollarSign className="h-3 w-3" />
													{rec.costAnalysis.estimatedMonthlyCost}{" "}
													{rec.costAnalysis.currency}/miesiąc
												</span>
												<span className="flex items-center gap-1">
													<Clock className="h-3 w-3" />
													Efekt: {rec.expectedOutcomes.timeToEffect.typical} dni
												</span>
											</div>
										</div>

										<Collapsible
											open={expandedRecommendation === rec.id}
											onOpenChange={(open) =>
												setExpandedRecommendation(open ? rec.id : null)
											}
										>
											<CollapsibleTrigger asChild>
												<Button variant="outline" size="sm">
													{expandedRecommendation === rec.id ? (
														<>
															<ChevronUp className="mr-1 h-3 w-3" />
															Zwiń
														</>
													) : (
														<>
															<ChevronDown className="mr-1 h-3 w-3" />
															Szczegóły
														</>
													)}
												</Button>
											</CollapsibleTrigger>
										</Collapsible>
									</div>
								</CardHeader>

								<Collapsible
									open={expandedRecommendation === rec.id}
									onOpenChange={(open) =>
										setExpandedRecommendation(open ? rec.id : null)
									}
								>
									<CollapsibleContent>
										<CardContent className="pt-0">
											<Tabs defaultValue="reasoning" className="w-full">
												<TabsList className="grid w-full grid-cols-5">
													<TabsTrigger value="reasoning" className="text-xs">
														Uzasadnienie
													</TabsTrigger>
													<TabsTrigger value="dosage" className="text-xs">
														Dawkowanie
													</TabsTrigger>
													<TabsTrigger value="outcomes" className="text-xs">
														Efekty
													</TabsTrigger>
													<TabsTrigger value="cost" className="text-xs">
														Koszt
													</TabsTrigger>
													<TabsTrigger value="goals" className="text-xs">
														Cele
													</TabsTrigger>
												</TabsList>

												<TabsContent value="reasoning" className="mt-4">
													<div className="space-y-3">
														<h4 className="flex items-center gap-2 font-medium">
															<Lightbulb className="h-4 w-4 text-yellow-500" />
															Główne powody rekomendacji
														</h4>
														<ul className="space-y-2">
															{rec.reasoning.polishPrimaryReasons.map(
																(reason, index) => (
																	<li
																		key={index}
																		className="flex items-start gap-2 text-sm"
																	>
																		<CheckCircle className="mt-0.5 h-3 w-3 flex-shrink-0 text-green-600" />
																		{reason}
																	</li>
																),
															)}
														</ul>
													</div>
												</TabsContent>

												<TabsContent value="dosage" className="mt-4">
													<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
														<div>
															<h4 className="mb-2 font-medium">Dawkowanie</h4>
															<div className="space-y-2 text-sm">
																<div className="flex justify-between">
																	<span>Ilość:</span>
																	<span className="font-medium">
																		{rec.dosageRecommendation.amount}{" "}
																		{rec.dosageRecommendation.polishUnit}
																	</span>
																</div>
																<div className="flex justify-between">
																	<span>Częstotliwość:</span>
																	<span className="font-medium">
																		{rec.dosageRecommendation.polishFrequency}
																	</span>
																</div>
																<div className="flex justify-between">
																	<span>Z jedzeniem:</span>
																	<span className="font-medium">
																		{rec.dosageRecommendation.withFood
																			? "Tak"
																			: "Nie"}
																	</span>
																</div>
															</div>
														</div>

														<div>
															<h4 className="mb-2 font-medium">Timing</h4>
															<div className="flex flex-wrap gap-1">
																{rec.dosageRecommendation.polishTiming.map(
																	(time, index) => (
																		<Badge
																			key={index}
																			variant="secondary"
																			className="text-xs"
																		>
																			{time}
																		</Badge>
																	),
																)}
															</div>

															{rec.dosageRecommendation
																.polishSpecialInstructions && (
																<div className="mt-3">
																	<h5 className="mb-1 font-medium text-sm">
																		Specjalne instrukcje:
																	</h5>
																	<p className="text-gray-600 text-sm">
																		{
																			rec.dosageRecommendation
																				.polishSpecialInstructions
																		}
																	</p>
																</div>
															)}
														</div>
													</div>
												</TabsContent>

												<TabsContent value="outcomes" className="mt-4">
													<div className="space-y-4">
														<div>
															<h4 className="mb-2 flex items-center gap-2 font-medium">
																<TrendingUp className="h-4 w-4 text-green-500" />
																Oczekiwane korzyści
															</h4>
															<div className="space-y-2">
																{rec.expectedOutcomes.expectedBenefits.map(
																	(benefit, index) => (
																		<div
																			key={index}
																			className="flex items-center justify-between rounded bg-green-50 p-2"
																		>
																			<span className="text-sm">
																				{benefit.polishBenefit}
																			</span>
																			<div className="flex items-center gap-2">
																				<span className="text-gray-600 text-xs">
																					{benefit.polishTimeframe}
																				</span>
																				<Badge
																					variant="outline"
																					className="text-xs"
																				>
																					{Math.round(benefit.likelihood * 100)}
																					% prawdopodobieństwo
																				</Badge>
																			</div>
																		</div>
																	),
																)}
															</div>
														</div>

														{rec.expectedOutcomes.potentialSideEffects.length >
															0 && (
															<div>
																<h4 className="mb-2 flex items-center gap-2 font-medium">
																	<AlertTriangle className="h-4 w-4 text-orange-500" />
																	Potencjalne skutki uboczne
																</h4>
																<div className="space-y-2">
																	{rec.expectedOutcomes.potentialSideEffects.map(
																		(sideEffect, index) => (
																			<div
																				key={index}
																				className="flex items-center justify-between rounded bg-orange-50 p-2"
																			>
																				<span className="text-sm">
																					{sideEffect.polishSideEffect}
																				</span>
																				<div className="flex items-center gap-2">
																					<span
																						className={cn(
																							"font-medium text-xs",
																							getSeverityColor(
																								sideEffect.severity,
																							),
																						)}
																					>
																						{sideEffect.polishSeverity}
																					</span>
																					<Badge
																						variant="outline"
																						className="text-xs"
																					>
																						{Math.round(
																							sideEffect.probability * 100,
																						)}
																						%
																					</Badge>
																				</div>
																			</div>
																		),
																	)}
																</div>
															</div>
														)}
													</div>
												</TabsContent>

												<TabsContent value="cost" className="mt-4">
													<div className="space-y-4">
														<div className="grid grid-cols-2 gap-4">
															<div className="rounded-lg bg-blue-50 p-4 text-center">
																<div className="font-bold text-2xl text-blue-600">
																	{rec.costAnalysis.estimatedMonthlyCost}{" "}
																	{rec.costAnalysis.currency}
																</div>
																<div className="text-blue-700 text-sm">
																	Koszt miesięczny
																</div>
															</div>

															<div className="rounded-lg bg-green-50 p-4 text-center">
																<div className="font-bold text-green-600 text-lg">
																	{rec.costAnalysis.polishBudgetFit}
																</div>
																<div className="text-green-700 text-sm">
																	Dopasowanie do budżetu
																</div>
															</div>
														</div>
													</div>
												</TabsContent>

												<TabsContent value="goals" className="mt-4">
													<div className="space-y-3">
														<h4 className="font-medium">
															Dopasowanie do Twoich celów
														</h4>
														<div className="space-y-3">
															{rec.reasoning.goalAlignment.map(
																(goal, index) => (
																	<div
																		key={index}
																		className="rounded-lg border p-3"
																	>
																		<div className="mb-2 flex items-center justify-between">
																			<h5 className="font-medium text-sm">
																				{goal.polishGoalName}
																			</h5>
																			<Badge variant="outline">
																				{Math.round(goal.alignmentScore * 100)}%
																				dopasowanie
																			</Badge>
																		</div>
																		<p className="text-gray-600 text-sm">
																			{goal.polishExpectedImpact}
																		</p>
																		<div className="mt-2">
																			<Progress
																				value={goal.alignmentScore * 100}
																				className="h-2"
																			/>
																		</div>
																	</div>
																),
															)}
														</div>
													</div>
												</TabsContent>
											</Tabs>
										</CardContent>
									</CollapsibleContent>
								</Collapsible>
							</Card>
						))}
					</div>
				</CardContent>
			</Card>

			{/* Action Buttons */}
			{selectedRecommendations.length > 0 && (
				<Card>
					<CardContent className="p-4">
						<div className="flex items-center justify-between">
							<span className="text-gray-600 text-sm">
								Wybrano {selectedRecommendations.length} rekomendacji
							</span>

							<div className="flex items-center gap-2">
								<Button
									variant="outline"
									onClick={() =>
										handleRejectSelected("Nie odpowiada moim potrzebom")
									}
									className="flex items-center gap-2"
								>
									<ThumbsDown className="h-3 w-3" />
									Odrzuć
								</Button>

								<Button
									onClick={handleAcceptSelected}
									className="flex items-center gap-2"
								>
									<ThumbsUp className="h-3 w-3" />
									Akceptuj wybrane
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>
			)}

			{/* Feedback Section */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<MessageSquare className="h-5 w-5 text-purple-600" />
						Twoja opinia
					</CardTitle>
				</CardHeader>
				<CardContent>
					{!showFeedbackForm ? (
						<Button onClick={() => setShowFeedbackForm(true)} variant="outline">
							Oceń rekomendacje
						</Button>
					) : (
						<div className="space-y-4">
							<div>
								<Label className="mb-2 block font-medium text-sm">
									Jak oceniasz jakość rekomendacji?
								</Label>
								{renderStarRating(feedbackRating, setFeedbackRating)}
							</div>

							<div>
								<Label
									htmlFor="feedback-comments"
									className="mb-2 block font-medium text-sm"
								>
									Dodatkowe komentarze (opcjonalne)
								</Label>
								<Textarea
									id="feedback-comments"
									placeholder="Podziel się swoimi uwagami o rekomendacjach..."
									value={feedbackComments}
									onChange={(e) => setFeedbackComments(e.target.value)}
									className="min-h-20"
								/>
							</div>

							<div className="flex items-center gap-2">
								<Button
									onClick={handleSubmitFeedback}
									disabled={feedbackRating === 0}
								>
									Wyślij opinię
								</Button>
								<Button
									variant="outline"
									onClick={() => setShowFeedbackForm(false)}
								>
									Anuluj
								</Button>
							</div>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
};

export default AIRecommendationViewer;
