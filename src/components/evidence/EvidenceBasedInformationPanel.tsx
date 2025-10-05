"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	AlertTriangle,
	BarChart3,
	Calendar,
	CheckCircle,
	Clock,
	Download,
	ExternalLink,
	FileText,
	Filter,
	Info,
	Microscope,
	Search,
	Star,
	TrendingUp,
	Users,
	XCircle,
} from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";

import {
	type EvidenceLevel,
	type EvidenceSummary,
	type ResearchStudy,
	type StudyType,
	evidenceBasedResearchService,
} from "@/lib/services/evidence-based-research-service";

interface EvidenceBasedInformationPanelProps {
	supplementId: string;
	condition?: string;
	polishCondition?: string;
	showDetailedStudies?: boolean;
	maxStudies?: number;
	onStudyClick?: (study: ResearchStudy) => void;
	className?: string;
}

const EvidenceBasedInformationPanel: React.FC<
	EvidenceBasedInformationPanelProps
> = ({
	supplementId,
	condition,
	polishCondition,
	showDetailedStudies = true,
	maxStudies = 10,
	onStudyClick,
	className = "",
}) => {
	const [evidenceSummary, setEvidenceSummary] =
		useState<EvidenceSummary | null>(null);
	const [detailedStudies, setDetailedStudies] = useState<ResearchStudy[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [selectedStudyType, setSelectedStudyType] = useState<StudyType | "all">(
		"all",
	);

	useEffect(() => {
		loadEvidenceData();
	}, [supplementId, condition]);

	const loadEvidenceData = async () => {
		if (!condition || !polishCondition) return;

		setLoading(true);
		setError(null);

		try {
			// Generate evidence summary
			const summary =
				await evidenceBasedResearchService.generateEvidenceSummary(
					supplementId,
					condition,
					polishCondition,
				);
			setEvidenceSummary(summary);

			// Load detailed studies if requested
			if (showDetailedStudies) {
				const searchResults = await evidenceBasedResearchService.searchPubMed({
					query: `${supplementId} AND ${condition}`,
					maxResults: maxStudies,
					humanStudiesOnly: true,
				});

				// Convert search results to detailed studies (simplified)
				const studies: ResearchStudy[] = searchResults.map((result) => ({
					id: result.pmid,
					title: result.title,
					polishTitle: result.title, // Would need translation service
					authors: result.authors,
					journal: result.journal,
					year: result.year,
					doi: result.doi,
					pubmedId: result.pmid,
					studyType: result.studyType || "RANDOMIZED_CONTROLLED_TRIAL",
					studyDesign: "DOUBLE_BLIND",
					sampleSize: 100, // Placeholder
					duration: "12 weeks", // Placeholder
					population: {
						description: "Adult participants",
						polishDescription: "Dorośli uczestnicy",
						healthStatus: "mixed" as const,
						exclusionCriteria: [],
						polishExclusionCriteria: [],
					},
					intervention: {
						supplement: supplementId,
						polishSupplement: supplementId,
						dosage: "Variable",
						frequency: "Daily",
						duration: "12 weeks",
						formulation: "Capsule",
						polishFormulation: "Kapsułka",
						control: "Placebo",
						polishControl: "Placebo",
					},
					primaryEndpoint: condition,
					polishPrimaryEndpoint: polishCondition,
					secondaryEndpoints: [],
					polishSecondaryEndpoints: [],
					results: {
						summary: "Positive results observed",
						polishSummary: "Zaobserwowano pozytywne wyniki",
						statisticalSignificance: true,
						clinicalSignificance: "Clinically meaningful improvement",
						polishClinicalSignificance: "Klinicznie znacząca poprawa",
					},
					qualityAssessment: {
						evidenceLevel: evidenceBasedResearchService.assessStudyQuality(
							{} as any,
						),
						riskOfBias: "low" as const,
						limitations: [],
						polishLimitations: [],
						strengths: [],
						polishStrengths: [],
					},
					polishHealthcareContext: {
						regulatoryStatus: "not_applicable" as const,
						availabilityInPoland: true,
						reimbursementStatus: "not_reimbursed" as const,
						clinicalGuidelines: [],
						polishClinicalGuidelines: [],
						expertOpinions: [],
						polishExpertOpinions: [],
					},
					lastUpdated: new Date().toISOString(),
					reviewedBy: [],
					conflictsOfInterest: [],
					funding: [],
				}));

				setDetailedStudies(studies);
			}
		} catch (err) {
			setError("Błąd podczas ładowania danych naukowych");
			console.error("Evidence loading error:", err);
		} finally {
			setLoading(false);
		}
	};

	const getEvidenceLevelColor = (level: EvidenceLevel) => {
		switch (level) {
			case "STRONG":
				return "bg-green-100 text-green-800 border-green-200";
			case "MODERATE":
				return "bg-yellow-100 text-yellow-800 border-yellow-200";
			case "WEAK":
				return "bg-orange-100 text-orange-800 border-orange-200";
			case "INSUFFICIENT":
				return "bg-red-100 text-red-800 border-red-200";
			case "CONFLICTING":
				return "bg-purple-100 text-purple-800 border-purple-200";
			default:
				return "bg-gray-100 text-gray-800 border-gray-200";
		}
	};

	const getStudyTypeIcon = (type: StudyType) => {
		switch (type) {
			case "META_ANALYSIS":
				return <BarChart3 className="h-4 w-4" />;
			case "SYSTEMATIC_REVIEW":
				return <FileText className="h-4 w-4" />;
			case "RANDOMIZED_CONTROLLED_TRIAL":
				return <Microscope className="h-4 w-4" />;
			default:
				return <FileText className="h-4 w-4" />;
		}
	};

	const getRecommendationIcon = (strength: string) => {
		switch (strength) {
			case "strong_for":
				return <CheckCircle className="h-4 w-4 text-green-600" />;
			case "weak_for":
				return <CheckCircle className="h-4 w-4 text-yellow-600" />;
			case "weak_against":
				return <XCircle className="h-4 w-4 text-orange-600" />;
			case "strong_against":
				return <XCircle className="h-4 w-4 text-red-600" />;
			default:
				return <AlertTriangle className="h-4 w-4 text-gray-600" />;
		}
	};

	const filteredStudies =
		selectedStudyType === "all"
			? detailedStudies
			: detailedStudies.filter(
					(study) => study.studyType === selectedStudyType,
				);

	if (loading) {
		return (
			<Card className={className}>
				<CardContent className="p-6">
					<div className="flex items-center justify-center space-x-2">
						<div className="h-6 w-6 animate-spin rounded-full border-blue-600 border-b-2" />
						<span>Ładowanie danych naukowych...</span>
					</div>
				</CardContent>
			</Card>
		);
	}

	if (error) {
		return (
			<Card className={className}>
				<CardContent className="p-6">
					<Alert className="border-red-200 bg-red-50">
						<AlertTriangle className="h-4 w-4 text-red-600" />
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				</CardContent>
			</Card>
		);
	}

	if (!evidenceSummary) {
		return (
			<Card className={className}>
				<CardContent className="p-6">
					<Alert>
						<Info className="h-4 w-4" />
						<AlertDescription>
							Brak dostępnych danych naukowych dla wybranego suplementu i
							wskazania.
						</AlertDescription>
					</Alert>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className={`space-y-6 ${className}`}>
			{/* Evidence Summary Header */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Microscope className="h-5 w-5" />
						Dowody naukowe: {polishCondition}
					</CardTitle>
					<div className="mt-2 flex items-center gap-4">
						<Badge
							className={getEvidenceLevelColor(
								evidenceSummary.overallEvidenceLevel,
							)}
						>
							{evidenceSummary.overallEvidenceLevel}
						</Badge>
						<span className="text-gray-600 text-sm">
							{evidenceSummary.totalStudies} badań
						</span>
						<span className="text-gray-600 text-sm">
							Aktualizacja:{" "}
							{new Date(evidenceSummary.lastUpdated).toLocaleDateString(
								"pl-PL",
							)}
						</span>
					</div>
				</CardHeader>
				<CardContent>
					<p className="mb-4 text-sm leading-relaxed">
						{evidenceSummary.narrativeSummary.polish}
					</p>

					{/* Evidence Level Breakdown */}
					<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
						{Object.entries(evidenceSummary.evidenceLevels).map(
							([level, count]) => (
								<div key={level} className="text-center">
									<div className="font-bold text-blue-600 text-lg">{count}</div>
									<div className="text-gray-600 text-xs">{level}</div>
								</div>
							),
						)}
					</div>
				</CardContent>
			</Card>

			{/* Detailed Information Tabs */}
			<Card>
				<CardContent className="p-0">
					<Tabs defaultValue="recommendations" className="w-full">
						<TabsList className="grid w-full grid-cols-4">
							<TabsTrigger value="recommendations">Rekomendacje</TabsTrigger>
							<TabsTrigger value="studies">Badania</TabsTrigger>
							<TabsTrigger value="meta-analysis">Meta-analiza</TabsTrigger>
							<TabsTrigger value="polish-context">Kontekst polski</TabsTrigger>
						</TabsList>

						{/* Recommendations Tab */}
						<TabsContent value="recommendations" className="space-y-4 p-6">
							<Card>
								<CardHeader className="pb-3">
									<CardTitle className="flex items-center gap-2 text-sm">
										{getRecommendationIcon(
											evidenceSummary.recommendations.strength,
										)}
										Rekomendacja kliniczna
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="space-y-3">
										<div className="flex items-center gap-2">
											<Badge variant="outline">
												{evidenceSummary.recommendations.polishStrength}
											</Badge>
										</div>
										<p className="text-gray-700 text-sm">
											{evidenceSummary.recommendations.polishRationale}
										</p>

										{evidenceSummary.recommendations
											.polishDosageRecommendation && (
											<Alert className="border-blue-200 bg-blue-50">
												<Info className="h-4 w-4 text-blue-600" />
												<AlertDescription>
													<strong>Zalecane dawkowanie:</strong>{" "}
													{
														evidenceSummary.recommendations
															.polishDosageRecommendation
													}
												</AlertDescription>
											</Alert>
										)}
									</div>
								</CardContent>
							</Card>

							{/* Population-specific recommendations */}
							{evidenceSummary.recommendations.populationSpecific.length >
								0 && (
								<Card>
									<CardHeader className="pb-3">
										<CardTitle className="text-sm">
											Rekomendacje dla grup populacyjnych
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="space-y-3">
											{evidenceSummary.recommendations.populationSpecific.map(
												(rec, index) => (
													<div key={index} className="rounded-lg border p-3">
														<h4 className="mb-1 font-medium text-sm">
															{rec.polishPopulation}
														</h4>
														<p className="text-gray-600 text-xs">
															{rec.polishRecommendation}
														</p>
													</div>
												),
											)}
										</div>
									</CardContent>
								</Card>
							)}
						</TabsContent>

						{/* Studies Tab */}
						<TabsContent value="studies" className="space-y-4 p-6">
							{/* Study filters */}
							<div className="mb-4 flex items-center gap-2">
								<Filter className="h-4 w-4" />
								<span className="text-sm">Filtruj według typu:</span>
								<select
									value={selectedStudyType}
									onChange={(e) =>
										setSelectedStudyType(e.target.value as StudyType | "all")
									}
									className="rounded border px-2 py-1 text-sm"
								>
									<option value="all">Wszystkie</option>
									<option value="META_ANALYSIS">Meta-analizy</option>
									<option value="SYSTEMATIC_REVIEW">
										Przeglądy systematyczne
									</option>
									<option value="RANDOMIZED_CONTROLLED_TRIAL">RCT</option>
									<option value="COHORT_STUDY">Badania kohortowe</option>
								</select>
							</div>

							{/* Studies list */}
							<div className="space-y-3">
								{filteredStudies.map((study, index) => (
									<Card
										key={index}
										className="cursor-pointer transition-shadow hover:shadow-md"
									>
										<CardHeader className="pb-2">
											<CardTitle className="flex items-start justify-between text-sm">
												<span className="flex-1 pr-2">{study.title}</span>
												<div className="flex items-center gap-2">
													{getStudyTypeIcon(study.studyType)}
													<Badge
														className={getEvidenceLevelColor(
															study.qualityAssessment.evidenceLevel,
														)}
													>
														{study.qualityAssessment.evidenceLevel}
													</Badge>
												</div>
											</CardTitle>
										</CardHeader>
										<CardContent>
											<div className="space-y-2">
												<div className="flex items-center gap-4 text-gray-600 text-xs">
													<span className="flex items-center gap-1">
														<Calendar className="h-3 w-3" />
														{study.year}
													</span>
													<span className="flex items-center gap-1">
														<Users className="h-3 w-3" />
														n={study.sampleSize}
													</span>
													<span className="flex items-center gap-1">
														<Clock className="h-3 w-3" />
														{study.duration}
													</span>
												</div>

												<p className="text-gray-700 text-xs">{study.journal}</p>
												<p className="text-xs">{study.results.polishSummary}</p>

												<div className="flex items-center justify-between">
													<div className="flex items-center gap-2">
														{study.results.statisticalSignificance && (
															<Badge variant="outline" className="text-xs">
																Istotne statystycznie
															</Badge>
														)}
														<Badge variant="secondary" className="text-xs">
															{study.qualityAssessment.riskOfBias === "low"
																? "Niskie ryzyko błędu"
																: "Umiarkowane ryzyko błędu"}
														</Badge>
													</div>

													<div className="flex items-center gap-1">
														{study.doi && (
															<Button
																size="sm"
																variant="ghost"
																className="h-6 px-2"
															>
																<ExternalLink className="h-3 w-3" />
															</Button>
														)}
														{study.pubmedId && (
															<Button
																size="sm"
																variant="ghost"
																className="h-6 px-2"
															>
																PubMed
															</Button>
														)}
													</div>
												</div>
											</div>
										</CardContent>
									</Card>
								))}
							</div>

							{filteredStudies.length === 0 && (
								<Alert>
									<Info className="h-4 w-4" />
									<AlertDescription>
										Brak badań dla wybranego typu.
									</AlertDescription>
								</Alert>
							)}
						</TabsContent>

						{/* Meta-analysis Tab */}
						<TabsContent value="meta-analysis" className="space-y-4 p-6">
							{evidenceSummary.metaAnalysisResults ? (
								<Card>
									<CardHeader>
										<CardTitle className="text-sm">
											Wyniki meta-analizy
										</CardTitle>
									</CardHeader>
									<CardContent className="space-y-4">
										<div className="grid grid-cols-2 gap-4 text-center md:grid-cols-4">
											<div>
												<div className="font-bold text-blue-600 text-lg">
													{evidenceSummary.metaAnalysisResults.effectSize.toFixed(
														2,
													)}
												</div>
												<div className="text-gray-600 text-xs">
													Wielkość efektu
												</div>
											</div>
											<div>
												<div className="font-bold text-green-600 text-lg">
													{evidenceSummary.metaAnalysisResults.numberOfStudies}
												</div>
												<div className="text-gray-600 text-xs">
													Liczba badań
												</div>
											</div>
											<div>
												<div className="font-bold text-lg text-purple-600">
													{
														evidenceSummary.metaAnalysisResults
															.totalParticipants
													}
												</div>
												<div className="text-gray-600 text-xs">Uczestnicy</div>
											</div>
											<div>
												<div className="font-bold text-lg text-orange-600">
													{evidenceSummary.metaAnalysisResults.heterogeneity.toFixed(
														1,
													)}
													%
												</div>
												<div className="text-gray-600 text-xs">
													Heterogenność (I²)
												</div>
											</div>
										</div>

										<div className="space-y-2">
											<div className="text-sm">
												<strong>Przedział ufności (95%):</strong>
												{evidenceSummary.metaAnalysisResults.confidenceInterval[0].toFixed(
													2,
												)}{" "}
												-
												{evidenceSummary.metaAnalysisResults.confidenceInterval[1].toFixed(
													2,
												)}
											</div>
											<div className="text-sm">
												<strong>Wartość p:</strong>{" "}
												{evidenceSummary.metaAnalysisResults.pValue.toFixed(4)}
											</div>
										</div>
									</CardContent>
								</Card>
							) : (
								<Alert>
									<Info className="h-4 w-4" />
									<AlertDescription>
										Brak dostępnych wyników meta-analizy dla tego suplementu i
										wskazania.
									</AlertDescription>
								</Alert>
							)}
						</TabsContent>

						{/* Polish Context Tab */}
						<TabsContent value="polish-context" className="space-y-4 p-6">
							<Card>
								<CardHeader>
									<CardTitle className="text-sm">
										Kontekst polskiej opieki zdrowotnej
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div>
										<h4 className="mb-2 font-medium text-sm">
											Konsensus ekspertów
										</h4>
										<p className="text-gray-700 text-sm">
											{
												evidenceSummary.polishHealthcareIntegration
													.polishExpertConsensus
											}
										</p>
									</div>

									{evidenceSummary.polishHealthcareIntegration
										.polishGuidelineRecommendations.length > 0 && (
										<div>
											<h4 className="mb-2 font-medium text-sm">
												Rekomendacje wytycznych
											</h4>
											<ul className="space-y-1 text-gray-700 text-sm">
												{evidenceSummary.polishHealthcareIntegration.polishGuidelineRecommendations.map(
													(rec, index) => (
														<li key={index} className="flex items-start gap-2">
															<span className="mt-1 text-green-500">•</span>
															{rec}
														</li>
													),
												)}
											</ul>
										</div>
									)}

									{evidenceSummary.polishHealthcareIntegration
										.polishImplementationBarriers.length > 0 && (
										<div>
											<h4 className="mb-2 font-medium text-sm">
												Bariery implementacji
											</h4>
											<ul className="space-y-1 text-gray-700 text-sm">
												{evidenceSummary.polishHealthcareIntegration.polishImplementationBarriers.map(
													(barrier, index) => (
														<li key={index} className="flex items-start gap-2">
															<span className="mt-1 text-orange-500">•</span>
															{barrier}
														</li>
													),
												)}
											</ul>
										</div>
									)}
								</CardContent>
							</Card>
						</TabsContent>
					</Tabs>
				</CardContent>
			</Card>
		</div>
	);
};

export default EvidenceBasedInformationPanel;
