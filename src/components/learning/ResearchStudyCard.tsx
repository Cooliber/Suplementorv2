"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
	AlertTriangle,
	Award,
	BarChart3,
	BookOpen,
	Calendar,
	CheckCircle,
	ChevronDown,
	ChevronUp,
	ExternalLink,
	FileText,
	Microscope,
	Shield,
	Star,
	TrendingUp,
	Users,
} from "lucide-react";
import type React from "react";
import { useState } from "react";

interface StudyPopulation {
	totalParticipants: number;
	demographics: {
		ageRange: string;
		meanAge: number;
		genderDistribution: {
			male: number;
			female: number;
			other: number;
		};
		healthStatus: string;
		polishHealthStatus: string;
	};
	dropoutRate: number;
}

interface Intervention {
	supplementId: string;
	supplementName: string;
	polishSupplementName: string;
	dosage: string;
	frequency: string;
	polishFrequency: string;
	duration: string;
	polishDuration: string;
	compliance: {
		measured: boolean;
		rate: number;
	};
}

interface OutcomeMeasure {
	name: string;
	polishName: string;
	type: "PRIMARY" | "SECONDARY" | "EXPLORATORY";
	category:
		| "COGNITIVE"
		| "PHYSICAL"
		| "BIOCHEMICAL"
		| "PSYCHOLOGICAL"
		| "SAFETY";
	polishCategory: string;
	measurementTool: string;
	polishMeasurementTool: string;
	results: {
		baseline: {
			intervention: number;
			control: number;
			pValue: number;
		};
		endpoint: {
			intervention: number;
			control: number;
			pValue: number;
			effectSize: number;
			confidenceInterval: string;
		};
		changeFromBaseline: {
			intervention: number;
			control: number;
			difference: number;
			pValue: number;
			clinicalSignificance: string;
			polishClinicalSignificance: string;
		};
	};
}

interface QualityAssessment {
	tool: "COCHRANE_ROB" | "JADAD" | "PEDRO" | "NEWCASTLE_OTTAWA" | "CASP";
	overallRating: "HIGH" | "MODERATE" | "LOW" | "VERY_LOW";
	polishOverallRating: string;
	domains: Array<{
		domain: string;
		polishDomain: string;
		rating: "LOW_RISK" | "HIGH_RISK" | "UNCLEAR";
		polishRating: string;
		justification: string;
		polishJustification: string;
	}>;
	limitations: string[];
	polishLimitations: string[];
	strengths: string[];
	polishStrengths: string[];
}

interface ResearchStudyData {
	id: string;
	pubmedId?: string;
	doi?: string;
	title: string;
	polishTitle: string;
	journal: string;
	publicationDate: Date;
	studyType:
		| "SYSTEMATIC_REVIEW"
		| "META_ANALYSIS"
		| "RANDOMIZED_CONTROLLED_TRIAL"
		| "COHORT_STUDY"
		| "CASE_CONTROL_STUDY"
		| "CROSS_SECTIONAL_STUDY"
		| "CASE_SERIES"
		| "CASE_REPORT"
		| "EXPERT_OPINION"
		| "IN_VITRO"
		| "ANIMAL_STUDY";
	polishStudyType: string;
	abstract: string;
	polishAbstract: string;
	keywords: string[];
	polishKeywords: string[];
	studyPopulation: StudyPopulation;
	interventions: Intervention[];
	outcomeMeasures: OutcomeMeasure[];
	qualityAssessment: QualityAssessment;
	primaryFindings: string;
	polishPrimaryFindings: string;
	conclusions: string;
	polishConclusions: string;
	clinicalImplications: string;
	polishClinicalImplications: string;
	evidenceLevel: "STRONG" | "MODERATE" | "WEAK" | "INSUFFICIENT";
	polishEvidenceLevel: string;
	citationCount: number;
	impactFactor?: number;
	supplementIds: string[];
	conditionsStudied: string[];
	polishConditionsStudied: string[];
	isBookmarked?: boolean;
}

interface ResearchStudyCardProps {
	study: ResearchStudyData;
	onBookmark: (studyId: string) => void;
	onViewFullText: (studyId: string) => void;
	onCiteStudy: (studyId: string) => void;
	showFullDetails?: boolean;
	className?: string;
}

const ResearchStudyCard: React.FC<ResearchStudyCardProps> = ({
	study,
	onBookmark,
	onViewFullText,
	onCiteStudy,
	showFullDetails = false,
	className = "",
}) => {
	const [isExpanded, setIsExpanded] = useState(showFullDetails);
	const [activeTab, setActiveTab] = useState("overview");

	const getStudyTypeIcon = (type: string) => {
		switch (type) {
			case "SYSTEMATIC_REVIEW":
			case "META_ANALYSIS":
				return <BookOpen className="h-4 w-4" />;
			case "RANDOMIZED_CONTROLLED_TRIAL":
				return <Microscope className="h-4 w-4" />;
			case "COHORT_STUDY":
			case "CASE_CONTROL_STUDY":
				return <Users className="h-4 w-4" />;
			default:
				return <FileText className="h-4 w-4" />;
		}
	};

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

	const getQualityRatingStyle = (rating: string) => {
		switch (rating) {
			case "HIGH":
				return "bg-green-100 text-green-800";
			case "MODERATE":
				return "bg-yellow-100 text-yellow-800";
			case "LOW":
				return "bg-orange-100 text-orange-800";
			case "VERY_LOW":
				return "bg-red-100 text-red-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const getRiskRatingIcon = (rating: string) => {
		switch (rating) {
			case "LOW_RISK":
				return <CheckCircle className="h-3 w-3 text-green-600" />;
			case "HIGH_RISK":
				return <AlertTriangle className="h-3 w-3 text-red-600" />;
			case "UNCLEAR":
				return <AlertTriangle className="h-3 w-3 text-yellow-600" />;
			default:
				return null;
		}
	};

	const formatDate = (date: Date) => {
		return new Intl.DateTimeFormat("pl-PL", {
			year: "numeric",
			month: "long",
			day: "numeric",
		}).format(date);
	};

	const calculateEffectSize = (outcome: OutcomeMeasure) => {
		return outcome.results.endpoint.effectSize;
	};

	const getEffectSizeInterpretation = (effectSize: number) => {
		const absEffect = Math.abs(effectSize);
		if (absEffect < 0.2) return { text: "Mały", color: "text-gray-600" };
		if (absEffect < 0.5)
			return { text: "Umiarkowany", color: "text-yellow-600" };
		if (absEffect < 0.8) return { text: "Duży", color: "text-orange-600" };
		return { text: "Bardzo duży", color: "text-red-600" };
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
							{getStudyTypeIcon(study.studyType)}
							<Badge variant="outline" className="text-xs">
								{study.polishStudyType}
							</Badge>
							<Badge
								className={cn(
									"text-xs",
									getEvidenceLevelStyle(study.evidenceLevel),
								)}
							>
								{study.polishEvidenceLevel}
							</Badge>
							{study.impactFactor && (
								<Badge variant="outline" className="text-xs">
									IF: {study.impactFactor.toFixed(1)}
								</Badge>
							)}
						</div>
						<CardTitle className="mb-2 text-lg leading-tight">
							{study.polishTitle}
						</CardTitle>
						<div className="flex items-center gap-4 text-gray-600 text-sm">
							<span className="flex items-center gap-1">
								<Calendar className="h-3 w-3" />
								{formatDate(study.publicationDate)}
							</span>
							<span className="flex items-center gap-1">
								<Users className="h-3 w-3" />
								{study.studyPopulation.totalParticipants} uczestników
							</span>
							<span className="flex items-center gap-1">
								<Star className="h-3 w-3" />
								{study.citationCount} cytowań
							</span>
						</div>
					</div>
					<div className="ml-4 flex items-center gap-2">
						<Button
							variant="ghost"
							size="sm"
							onClick={() => onBookmark(study.id)}
							className="h-8 w-8 p-0"
						>
							<Star
								className={cn(
									"h-4 w-4",
									study.isBookmarked ? "fill-yellow-400 text-yellow-400" : "",
								)}
							/>
						</Button>
					</div>
				</div>

				<p className="line-clamp-3 text-gray-700 text-sm leading-relaxed">
					{study.polishAbstract}
				</p>

				<div className="mt-4 flex items-center justify-between">
					<div className="flex flex-wrap gap-1">
						{study.polishConditionsStudied
							.slice(0, 3)
							.map((condition, index) => (
								<Badge key={index} variant="secondary" className="text-xs">
									{condition}
								</Badge>
							))}
						{study.polishConditionsStudied.length > 3 && (
							<Badge variant="outline" className="text-xs">
								+{study.polishConditionsStudied.length - 3} więcej
							</Badge>
						)}
					</div>
					<Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
						<CollapsibleTrigger asChild>
							<Button variant="outline" size="sm">
								{isExpanded ? (
									<>
										<ChevronUp className="mr-1 h-3 w-3" />
										Zwiń
									</>
								) : (
									<>
										<ChevronDown className="mr-1 h-3 w-3" />
										Rozwiń
									</>
								)}
							</Button>
						</CollapsibleTrigger>
					</Collapsible>
				</div>
			</CardHeader>

			<Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
				<CollapsibleContent>
					<CardContent className="pt-0">
						<Tabs
							value={activeTab}
							onValueChange={setActiveTab}
							className="w-full"
						>
							<TabsList className="grid w-full grid-cols-4">
								<TabsTrigger value="overview" className="text-xs">
									Przegląd
								</TabsTrigger>
								<TabsTrigger value="results" className="text-xs">
									Wyniki
								</TabsTrigger>
								<TabsTrigger value="quality" className="text-xs">
									Jakość
								</TabsTrigger>
								<TabsTrigger value="details" className="text-xs">
									Szczegóły
								</TabsTrigger>
							</TabsList>

							<TabsContent value="overview" className="mt-4 space-y-4">
								<div>
									<h4 className="mb-2 font-medium text-sm">Główne ustalenia</h4>
									<p className="text-gray-700 text-sm">
										{study.polishPrimaryFindings}
									</p>
								</div>

								<div>
									<h4 className="mb-2 font-medium text-sm">Wnioski</h4>
									<p className="text-gray-700 text-sm">
										{study.polishConclusions}
									</p>
								</div>

								{study.polishClinicalImplications && (
									<div>
										<h4 className="mb-2 font-medium text-sm">
											Implikacje kliniczne
										</h4>
										<p className="text-gray-700 text-sm">
											{study.polishClinicalImplications}
										</p>
									</div>
								)}

								<div>
									<h4 className="mb-2 font-medium text-sm">
										Badane suplementy
									</h4>
									<div className="space-y-2">
										{study.interventions.map((intervention, index) => (
											<div
												key={index}
												className="flex items-center justify-between rounded bg-gray-50 p-2"
											>
												<div>
													<span className="font-medium text-sm">
														{intervention.polishSupplementName}
													</span>
													<div className="text-gray-600 text-xs">
														{intervention.dosage} •{" "}
														{intervention.polishFrequency} •{" "}
														{intervention.polishDuration}
													</div>
												</div>
												{intervention.compliance.measured && (
													<Badge variant="outline" className="text-xs">
														{intervention.compliance.rate}% przestrzeganie
													</Badge>
												)}
											</div>
										))}
									</div>
								</div>
							</TabsContent>

							<TabsContent value="results" className="mt-4 space-y-4">
								<div>
									<h4 className="mb-3 font-medium text-sm">
										Główne punkty końcowe
									</h4>
									<div className="space-y-3">
										{study.outcomeMeasures
											.filter((outcome) => outcome.type === "PRIMARY")
											.map((outcome, index) => (
												<div key={index} className="rounded-lg border p-3">
													<div className="mb-2 flex items-center justify-between">
														<h5 className="font-medium text-sm">
															{outcome.polishName}
														</h5>
														<Badge variant="outline" className="text-xs">
															{outcome.polishCategory}
														</Badge>
													</div>

													<div className="grid grid-cols-3 gap-4 text-xs">
														<div>
															<span className="text-gray-600">
																Interwencja:
															</span>
															<div className="font-medium">
																{outcome.results.endpoint.intervention.toFixed(
																	2,
																)}
															</div>
														</div>
														<div>
															<span className="text-gray-600">Kontrola:</span>
															<div className="font-medium">
																{outcome.results.endpoint.control.toFixed(2)}
															</div>
														</div>
														<div>
															<span className="text-gray-600">p-wartość:</span>
															<div
																className={cn("font-medium", {
																	"text-green-600":
																		outcome.results.endpoint.pValue < 0.05,
																	"text-red-600":
																		outcome.results.endpoint.pValue >= 0.05,
																})}
															>
																{outcome.results.endpoint.pValue < 0.001
																	? "<0.001"
																	: outcome.results.endpoint.pValue.toFixed(3)}
															</div>
														</div>
													</div>

													<div className="mt-2 flex items-center justify-between">
														<div className="text-xs">
															<span className="text-gray-600">
																Wielkość efektu:
															</span>
															<span
																className={cn(
																	"ml-1 font-medium",
																	getEffectSizeInterpretation(
																		calculateEffectSize(outcome),
																	).color,
																)}
															>
																{calculateEffectSize(outcome).toFixed(2)} (
																{
																	getEffectSizeInterpretation(
																		calculateEffectSize(outcome),
																	).text
																}
																)
															</span>
														</div>
														<div className="text-xs">
															<span className="text-gray-600">95% CI:</span>
															<span className="ml-1">
																{outcome.results.endpoint.confidenceInterval}
															</span>
														</div>
													</div>

													{outcome.results.changeFromBaseline
														.polishClinicalSignificance && (
														<div className="mt-2 rounded bg-blue-50 p-2 text-xs">
															<strong>Znaczenie kliniczne:</strong>{" "}
															{
																outcome.results.changeFromBaseline
																	.polishClinicalSignificance
															}
														</div>
													)}
												</div>
											))}
									</div>
								</div>

								{study.outcomeMeasures.filter(
									(outcome) => outcome.type === "SECONDARY",
								).length > 0 && (
									<div>
										<h4 className="mb-2 font-medium text-sm">
											Drugorzędne punkty końcowe
										</h4>
										<div className="text-gray-600 text-sm">
											{study.outcomeMeasures
												.filter((outcome) => outcome.type === "SECONDARY")
												.map((outcome) => outcome.polishName)
												.join(", ")}
										</div>
									</div>
								)}
							</TabsContent>

							<TabsContent value="quality" className="mt-4 space-y-4">
								<div className="flex items-center justify-between">
									<h4 className="font-medium text-sm">Ogólna ocena jakości</h4>
									<Badge
										className={cn(
											"text-xs",
											getQualityRatingStyle(
												study.qualityAssessment.overallRating,
											),
										)}
									>
										{study.qualityAssessment.polishOverallRating}
									</Badge>
								</div>

								<div>
									<h5 className="mb-2 font-medium text-sm">
										Ocena ryzyka błędu systematycznego
									</h5>
									<div className="space-y-2">
										{study.qualityAssessment.domains.map((domain, index) => (
											<div
												key={index}
												className="flex items-center justify-between rounded border p-2"
											>
												<span className="text-sm">{domain.polishDomain}</span>
												<div className="flex items-center gap-2">
													{getRiskRatingIcon(domain.rating)}
													<span className="text-xs">{domain.polishRating}</span>
												</div>
											</div>
										))}
									</div>
								</div>

								{study.qualityAssessment.polishStrengths.length > 0 && (
									<div>
										<h5 className="mb-2 flex items-center gap-1 font-medium text-sm">
											<CheckCircle className="h-3 w-3 text-green-600" />
											Mocne strony
										</h5>
										<ul className="space-y-1 text-gray-700 text-sm">
											{study.qualityAssessment.polishStrengths.map(
												(strength, index) => (
													<li key={index} className="flex items-start gap-2">
														<div className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-green-600" />
														{strength}
													</li>
												),
											)}
										</ul>
									</div>
								)}

								{study.qualityAssessment.polishLimitations.length > 0 && (
									<div>
										<h5 className="mb-2 flex items-center gap-1 font-medium text-sm">
											<AlertTriangle className="h-3 w-3 text-orange-600" />
											Ograniczenia
										</h5>
										<ul className="space-y-1 text-gray-700 text-sm">
											{study.qualityAssessment.polishLimitations.map(
												(limitation, index) => (
													<li key={index} className="flex items-start gap-2">
														<div className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-orange-600" />
														{limitation}
													</li>
												),
											)}
										</ul>
									</div>
								)}
							</TabsContent>

							<TabsContent value="details" className="mt-4 space-y-4">
								<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
									<div>
										<h5 className="mb-2 font-medium text-sm">
											Informacje o publikacji
										</h5>
										<div className="space-y-1 text-sm">
											<div>
												<strong>Czasopismo:</strong> {study.journal}
											</div>
											<div>
												<strong>Data publikacji:</strong>{" "}
												{formatDate(study.publicationDate)}
											</div>
											{study.doi && (
												<div>
													<strong>DOI:</strong> {study.doi}
												</div>
											)}
											{study.pubmedId && (
												<div>
													<strong>PubMed ID:</strong> {study.pubmedId}
												</div>
											)}
										</div>
									</div>

									<div>
										<h5 className="mb-2 font-medium text-sm">
											Populacja badana
										</h5>
										<div className="space-y-1 text-sm">
											<div>
												<strong>Uczestnicy:</strong>{" "}
												{study.studyPopulation.totalParticipants}
											</div>
											<div>
												<strong>Wiek:</strong>{" "}
												{study.studyPopulation.demographics.ageRange} (średnia:{" "}
												{study.studyPopulation.demographics.meanAge})
											</div>
											<div>
												<strong>Płeć:</strong>{" "}
												{
													study.studyPopulation.demographics.genderDistribution
														.male
												}
												M/
												{
													study.studyPopulation.demographics.genderDistribution
														.female
												}
												K
											</div>
											<div>
												<strong>Stan zdrowia:</strong>{" "}
												{study.studyPopulation.demographics.polishHealthStatus}
											</div>
											{study.studyPopulation.dropoutRate > 0 && (
												<div>
													<strong>Rezygnacje:</strong>{" "}
													{study.studyPopulation.dropoutRate}%
												</div>
											)}
										</div>
									</div>
								</div>

								<div>
									<h5 className="mb-2 font-medium text-sm">Słowa kluczowe</h5>
									<div className="flex flex-wrap gap-1">
										{study.polishKeywords.map((keyword, index) => (
											<Badge key={index} variant="outline" className="text-xs">
												{keyword}
											</Badge>
										))}
									</div>
								</div>
							</TabsContent>
						</Tabs>

						<div className="mt-6 flex items-center justify-between border-t pt-4">
							<div className="text-gray-600 text-sm">
								Cytowane {study.citationCount} razy
							</div>
							<div className="flex gap-2">
								<Button
									variant="outline"
									size="sm"
									onClick={() => onCiteStudy(study.id)}
								>
									Cytuj
								</Button>
								<Button size="sm" onClick={() => onViewFullText(study.id)}>
									<ExternalLink className="mr-1 h-3 w-3" />
									Pełny tekst
								</Button>
							</div>
						</div>
					</CardContent>
				</CollapsibleContent>
			</Collapsible>
		</Card>
	);
};

export default ResearchStudyCard;
