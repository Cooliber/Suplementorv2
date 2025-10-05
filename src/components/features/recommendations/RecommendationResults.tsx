"use client";

/**
 * Recommendation Results Component
 * Displays AI-generated supplement recommendations with scores and reasoning
 */

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import {
	AlertTriangle,
	CheckCircle2,
	ExternalLink,
	Info,
	Star,
	TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface RecommendationResult {
	supplementId: string;
	name: string;
	polishName: string;
	category: string;
	recommendationScore: number;
	matchedGoals: string[];
	reasoning: string;
	polishReasoning: string;
	dosageRecommendation: string;
	polishDosageRecommendation: string;
	safetyNotes: string[];
	polishSafetyNotes: string[];
	evidenceLevel: string;
	synergisticWith: string[];
	contraindications: string[];
	polishContraindications: string[];
}

interface RecommendationResultsProps {
	recommendations: RecommendationResult[];
	language?: "pl" | "en";
}

export function RecommendationResults({
	recommendations,
	language = "pl",
}: RecommendationResultsProps) {
	const [selectedSupplements, setSelectedSupplements] = useState<Set<string>>(
		new Set(),
	);

	const toggleSupplement = (id: string) => {
		setSelectedSupplements((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(id)) {
				newSet.delete(id);
			} else {
				newSet.add(id);
			}
			return newSet;
		});
	};

	const getScoreColor = (score: number) => {
		if (score >= 80) return "text-green-600 dark:text-green-400";
		if (score >= 60) return "text-blue-600 dark:text-blue-400";
		if (score >= 40) return "text-yellow-600 dark:text-yellow-400";
		return "text-gray-600 dark:text-gray-400";
	};

	const getScoreLabel = (score: number) => {
		if (score >= 80)
			return language === "pl" ? "Doskonałe dopasowanie" : "Excellent match";
		if (score >= 60)
			return language === "pl" ? "Dobre dopasowanie" : "Good match";
		if (score >= 40)
			return language === "pl" ? "Umiarkowane dopasowanie" : "Moderate match";
		return language === "pl" ? "Słabe dopasowanie" : "Weak match";
	};

	if (recommendations.length === 0) {
		return (
			<Alert>
				<Info className="h-4 w-4" />
				<AlertTitle>
					{language === "pl" ? "Brak rekomendacji" : "No recommendations"}
				</AlertTitle>
				<AlertDescription>
					{language === "pl"
						? "Nie znaleziono odpowiednich suplementów dla podanych kryteriów."
						: "No suitable supplements found for the given criteria."}
				</AlertDescription>
			</Alert>
		);
	}

	return (
		<div className="space-y-6">
			{/* Summary */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<TrendingUp className="h-5 w-5 text-primary" />
						{language === "pl"
							? "Twoje spersonalizowane rekomendacje"
							: "Your Personalized Recommendations"}
					</CardTitle>
					<CardDescription>
						{language === "pl"
							? `Znaleziono ${recommendations.length} ${recommendations.length === 1 ? "suplement" : "suplementów"} dopasowanych do Twoich celów`
							: `Found ${recommendations.length} supplement${recommendations.length === 1 ? "" : "s"} matching your goals`}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex items-center gap-2 text-muted-foreground text-sm">
						<CheckCircle2 className="h-4 w-4 text-green-500" />
						<span>
							{language === "pl"
								? "Rekomendacje oparte na dowodach naukowych i Twoim profilu"
								: "Recommendations based on scientific evidence and your profile"}
						</span>
					</div>
				</CardContent>
			</Card>

			{/* Recommendations List */}
			<div className="space-y-4">
				{recommendations.map((rec, index) => (
					<Card key={rec.supplementId} className="overflow-hidden">
						<CardHeader className="bg-muted/50">
							<div className="flex items-start justify-between gap-4">
								<div className="flex-1">
									<div className="mb-2 flex items-center gap-2">
										<span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground text-sm">
											{index + 1}
										</span>
										<CardTitle className="text-xl">
											{language === "pl" ? rec.polishName : rec.name}
										</CardTitle>
									</div>
									<CardDescription>
										{language === "pl" ? rec.name : rec.polishName}
									</CardDescription>
								</div>
								<div className="flex flex-col items-end gap-2">
									<Badge variant="secondary">{rec.category}</Badge>
									<div className="flex items-center gap-2">
										<Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
										<span
											className={`font-bold text-2xl ${getScoreColor(rec.recommendationScore)}`}
										>
											{Math.round(rec.recommendationScore)}
										</span>
									</div>
									<span className="text-muted-foreground text-xs">
										{getScoreLabel(rec.recommendationScore)}
									</span>
								</div>
							</div>

							{/* Score Progress */}
							<div className="mt-4">
								<Progress value={rec.recommendationScore} className="h-2" />
							</div>
						</CardHeader>

						<CardContent className="pt-6">
							<Accordion type="single" collapsible className="w-full">
								{/* Reasoning */}
								<AccordionItem value="reasoning">
									<AccordionTrigger>
										<div className="flex items-center gap-2">
											<Info className="h-4 w-4" />
											{language === "pl"
												? "Dlaczego ten suplement?"
												: "Why this supplement?"}
										</div>
									</AccordionTrigger>
									<AccordionContent>
										<p className="text-muted-foreground text-sm">
											{language === "pl" ? rec.polishReasoning : rec.reasoning}
										</p>
										{rec.matchedGoals.length > 0 && (
											<div className="mt-3">
												<p className="mb-2 font-medium text-sm">
													{language === "pl"
														? "Dopasowane cele:"
														: "Matched goals:"}
												</p>
												<div className="flex flex-wrap gap-2">
													{rec.matchedGoals.map((goal) => (
														<Badge key={goal} variant="outline">
															{goal}
														</Badge>
													))}
												</div>
											</div>
										)}
									</AccordionContent>
								</AccordionItem>

								{/* Dosage */}
								<AccordionItem value="dosage">
									<AccordionTrigger>
										<div className="flex items-center gap-2">
											<CheckCircle2 className="h-4 w-4" />
											{language === "pl"
												? "Zalecane dawkowanie"
												: "Recommended Dosage"}
										</div>
									</AccordionTrigger>
									<AccordionContent>
										<p className="font-medium text-sm">
											{language === "pl"
												? rec.polishDosageRecommendation
												: rec.dosageRecommendation}
										</p>
										<p className="mt-2 text-muted-foreground text-xs">
											{language === "pl"
												? "Zawsze sprawdź etykietę produktu i skonsultuj się z lekarzem przed rozpoczęciem suplementacji."
												: "Always check product label and consult with a physician before starting supplementation."}
										</p>
									</AccordionContent>
								</AccordionItem>

								{/* Safety Notes */}
								{(rec.safetyNotes.length > 0 ||
									rec.polishSafetyNotes.length > 0) && (
									<AccordionItem value="safety">
										<AccordionTrigger>
											<div className="flex items-center gap-2">
												<AlertTriangle className="h-4 w-4 text-yellow-600" />
												{language === "pl"
													? "Uwagi dotyczące bezpieczeństwa"
													: "Safety Notes"}
											</div>
										</AccordionTrigger>
										<AccordionContent>
											<ul className="space-y-2">
												{(language === "pl"
													? rec.polishSafetyNotes
													: rec.safetyNotes
												).map((note, idx) => (
													<li
														key={idx}
														className="flex items-start gap-2 text-muted-foreground text-sm"
													>
														<AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-yellow-600" />
														<span>{note}</span>
													</li>
												))}
											</ul>
										</AccordionContent>
									</AccordionItem>
								)}

								{/* Synergies */}
								{rec.synergisticWith.length > 0 && (
									<AccordionItem value="synergies">
										<AccordionTrigger>
											<div className="flex items-center gap-2">
												<TrendingUp className="h-4 w-4 text-green-600" />
												{language === "pl"
													? "Synergiczne kombinacje"
													: "Synergistic Combinations"}
											</div>
										</AccordionTrigger>
										<AccordionContent>
											<p className="mb-3 text-muted-foreground text-sm">
												{language === "pl"
													? "Ten suplement działa synergicznie z:"
													: "This supplement works synergistically with:"}
											</p>
											<div className="flex flex-wrap gap-2">
												{rec.synergisticWith.map((synId) => {
													const synRec = recommendations.find(
														(r) => r.supplementId === synId,
													);
													return (
														<Badge
															key={synId}
															variant="secondary"
															className="cursor-pointer"
														>
															{synRec
																? language === "pl"
																	? synRec.polishName
																	: synRec.name
																: synId}
														</Badge>
													);
												})}
											</div>
										</AccordionContent>
									</AccordionItem>
								)}
							</Accordion>

							{/* Actions */}
							<div className="mt-6 flex items-center justify-between border-t pt-6">
								<Button
									variant={
										selectedSupplements.has(rec.supplementId)
											? "default"
											: "outline"
									}
									onClick={() => toggleSupplement(rec.supplementId)}
								>
									{selectedSupplements.has(rec.supplementId)
										? language === "pl"
											? "✓ Dodano do stosu"
											: "✓ Added to stack"
										: language === "pl"
											? "Dodaj do stosu"
											: "Add to stack"}
								</Button>
								<Link href={`/suplementy/${rec.supplementId}`}>
									<Button variant="ghost" size="sm">
										{language === "pl" ? "Zobacz szczegóły" : "View details"}
										<ExternalLink className="ml-2 h-4 w-4" />
									</Button>
								</Link>
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			{/* Selected Stack Summary */}
			{selectedSupplements.size > 0 && (
				<Card className="border-primary">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<CheckCircle2 className="h-5 w-5 text-primary" />
							{language === "pl"
								? "Twój stos suplementów"
								: "Your Supplement Stack"}
						</CardTitle>
						<CardDescription>
							{language === "pl"
								? `Wybrano ${selectedSupplements.size} ${selectedSupplements.size === 1 ? "suplement" : "suplementów"}`
								: `Selected ${selectedSupplements.size} supplement${selectedSupplements.size === 1 ? "" : "s"}`}
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="mb-4 flex flex-wrap gap-2">
							{Array.from(selectedSupplements).map((id) => {
								const rec = recommendations.find((r) => r.supplementId === id);
								return rec ? (
									<Badge key={id} variant="secondary">
										{language === "pl" ? rec.polishName : rec.name}
									</Badge>
								) : null;
							})}
						</div>
						<Button className="w-full">
							{language === "pl" ? "Zapisz stos" : "Save Stack"}
						</Button>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
