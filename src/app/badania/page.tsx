"use client";

import type { Metadata } from "next";
import { useState, useMemo } from "react";
import { FlaskConical, Filter, Search, BookOpen, Award, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BreadcrumbNavigation } from "@/components/navigation/BreadcrumbNavigation";
import ResearchStudyCard from "@/components/learning/ResearchStudyCard";
import { allResearchCitations, type ResearchCitation } from "@/data/research-citations";

// Evidence level definitions for display
const EVIDENCE_LEVELS = {
	STRONG: {
		label: "Silne",
		description: "Wysokiej jakości badania z konsekwentnymi wynikami",
		color: "bg-green-100 text-green-800 border-green-300",
	},
	MODERATE: {
		label: "Umiarkowane",
		description: "Badania dobrej jakości z pewnymi ograniczeniami",
		color: "bg-blue-100 text-blue-800 border-blue-300",
	},
	WEAK: {
		label: "Słabe",
		description: "Ograniczone dowody lub niskiej jakości badania",
		color: "bg-yellow-100 text-yellow-800 border-yellow-300",
	},
	INSUFFICIENT: {
		label: "Niewystarczające",
		description: "Brak wystarczających dowodów",
		color: "bg-gray-100 text-gray-800 border-gray-300",
	},
	CONFLICTING: {
		label: "Sprzeczne",
		description: "Sprzeczne wyniki w różnych badaniach",
		color: "bg-orange-100 text-orange-800 border-orange-300",
	},
} as const;

const STUDY_TYPES = {
	SYSTEMATIC_REVIEW: "Przegląd Systematyczny",
	META_ANALYSIS: "Meta-analiza",
	RANDOMIZED_CONTROLLED_TRIAL: "Badanie Randomizowane Kontrolowane",
	COHORT_STUDY: "Badanie Kohortowe",
	CASE_CONTROL_STUDY: "Badanie Kliniczno-Kontrolne",
	CROSS_SECTIONAL_STUDY: "Badanie Przekrojowe",
	CASE_SERIES: "Seria Przypadków",
	CASE_REPORT: "Opis Przypadku",
	EXPERT_OPINION: "Opinia Eksperta",
	IN_VITRO: "Badanie In Vitro",
	ANIMAL_STUDY: "Badanie na Zwierzętach",
} as const;

export default function ResearchPage() {
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedEvidenceLevel, setSelectedEvidenceLevel] = useState<string>("ALL");
	const [selectedStudyType, setSelectedStudyType] = useState<string>("ALL");
	const [selectedSupplement, setSelectedSupplement] = useState<string>("ALL");

	// Transform research citations to match ResearchStudyCard interface
	const transformedStudies = useMemo(() => {
		return allResearchCitations.map((citation) => ({
			id: citation.id,
			pubmedId: citation.pubmedId || citation.pmid,
			doi: citation.doi,
			title: citation.title,
			polishTitle: citation.polishTitle,
			journal: citation.journal,
			publicationDate: new Date(citation.year, 0, 1),
			studyType: citation.studyType,
			polishStudyType: STUDY_TYPES[citation.studyType] || citation.studyType,
			abstract: citation.abstract,
			polishAbstract: citation.polishAbstract,
			keywords: citation.keywords,
			polishKeywords: citation.keywords,
			studyPopulation: {
				totalParticipants: citation.participantCount || citation.sampleSize,
				demographics: {
					ageRange: "18-65",
					meanAge: 45,
					genderDistribution: { male: 50, female: 50, other: 0 },
					healthStatus: "Mixed",
					polishHealthStatus: "Mieszany",
				},
				dropoutRate: 0,
			},
			interventions: [{
				supplementId: citation.relatedSupplements[0] || "unknown",
				supplementName: citation.relatedSupplements[0] || "Unknown",
				polishSupplementName: citation.relatedSupplements[0] || "Nieznany",
				dosage: citation.dosage,
				frequency: "Daily",
				polishFrequency: "Codziennie",
				duration: citation.duration,
				polishDuration: citation.duration,
				compliance: { measured: false, rate: 0 },
			}],
			outcomeMeasures: [{
				name: citation.primaryOutcome,
				polishName: citation.polishPrimaryOutcome,
				type: "PRIMARY" as const,
				category: "COGNITIVE" as const,
				polishCategory: "Poznawcze",
				measurementTool: "Standard assessment",
				polishMeasurementTool: "Standardowa ocena",
				results: {
					baseline: {
						intervention: 0,
						control: 0,
						pValue: 0,
					},
					endpoint: {
						intervention: 0,
						control: 0,
						pValue: 0,
						effectSize: 0,
						confidenceInterval: "",
					},
					changeFromBaseline: {
						intervention: 0,
						control: 0,
						difference: 0,
						pValue: 0,
						clinicalSignificance: "Not significant",
						polishClinicalSignificance: "Nieistotne",
					},
					polishInterpretation: citation.polishResults,
				},
			}],
			qualityAssessment: {
				tool: "COCHRANE_ROB" as const,
				overallRating: citation.evidenceLevel === "STRONG" ? "HIGH" as const : "MODERATE" as const,
				polishOverallRating: citation.evidenceLevel === "STRONG" ? "Wysoka" : "Umiarkowana",
				domains: [],
				limitations: [citation.limitations],
				polishLimitations: [citation.polishLimitations],
				strengths: [],
				polishStrengths: [],
			},
			primaryFindings: citation.findings,
			polishPrimaryFindings: citation.polishFindings,
			conclusions: citation.results,
			polishConclusions: citation.polishResults,
			clinicalImplications: "",
			polishClinicalImplications: "",
			evidenceLevel: citation.evidenceLevel === "CONFLICTING" ? "INSUFFICIENT" : citation.evidenceLevel,
			polishEvidenceLevel: EVIDENCE_LEVELS[citation.evidenceLevel].label,
			citationCount: citation.citationCount,
			impactFactor: undefined,
			supplementIds: citation.relatedSupplements,
			conditionsStudied: citation.relatedConditions,
			polishConditionsStudied: citation.relatedConditions,
			isBookmarked: false,
		}));
	}, []);

	// Get unique supplements for filter
	const uniqueSupplements = useMemo(() => {
		const supplements = new Set<string>();
		allResearchCitations.forEach((citation) => {
			citation.relatedSupplements.forEach((supp) => supplements.add(supp));
		});
		return Array.from(supplements).sort();
	}, []);

	// Filter studies
	const filteredStudies = useMemo(() => {
		return transformedStudies.filter((study) => {
			// Search filter
			if (searchQuery) {
				const query = searchQuery.toLowerCase();
				const matchesSearch =
					study.polishTitle.toLowerCase().includes(query) ||
					study.polishAbstract.toLowerCase().includes(query) ||
					study.keywords.some((k) => k.toLowerCase().includes(query));
				if (!matchesSearch) return false;
			}

			// Evidence level filter
			if (selectedEvidenceLevel !== "ALL" && study.evidenceLevel !== selectedEvidenceLevel) {
				return false;
			}

			// Study type filter
			if (selectedStudyType !== "ALL" && study.studyType !== selectedStudyType) {
				return false;
			}

			// Supplement filter
			if (selectedSupplement !== "ALL") {
				if (!study.supplementIds.includes(selectedSupplement)) {
					return false;
				}
			}

			return true;
		});
	}, [transformedStudies, searchQuery, selectedEvidenceLevel, selectedStudyType, selectedSupplement]);

	const handleBookmark = (studyId: string) => {
		console.log("Bookmark study:", studyId);
	};

	const handleViewFullText = (studyId: string) => {
		const study = allResearchCitations.find((s) => s.id === studyId);
		if (study?.pubmedId) {
			window.open(`https://pubmed.ncbi.nlm.nih.gov/${study.pubmedId}/`, "_blank");
		} else if (study?.doi) {
			window.open(`https://doi.org/${study.doi}`, "_blank");
		}
	};

	const handleCiteStudy = (studyId: string) => {
		const study = allResearchCitations.find((s) => s.id === studyId);
		if (study) {
			const citation = `${study.authors.join(", ")}. (${study.year}). ${study.title}. ${study.journal}.`;
			navigator.clipboard.writeText(citation);
			alert("Cytowanie skopiowane do schowka!");
		}
	};

	return (
		<div className="container mx-auto px-4 py-8 space-y-8">
			{/* Breadcrumb Navigation */}
			<BreadcrumbNavigation />

			{/* Hero Section */}
			<div className="text-center space-y-4">
				<div className="flex justify-center">
					<FlaskConical className="h-16 w-16 text-primary" />
				</div>
				<h1 className="text-4xl md:text-5xl font-bold">Badania Naukowe</h1>
				<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
					Przegląd badań klinicznych i dowodów naukowych dotyczących suplementów
				</p>
			</div>

			{/* Evidence Level Definitions */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Award className="h-5 w-5" />
						Poziomy Dowodów Naukowych
					</CardTitle>
					<CardDescription>
						Klasyfikacja jakości i wiarygodności badań naukowych
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
						{Object.entries(EVIDENCE_LEVELS).map(([key, value]) => (
							<div key={key} className={`p-4 rounded-lg border-2 ${value.color}`}>
								<div className="font-semibold mb-1">{value.label}</div>
								<div className="text-xs opacity-90">{value.description}</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			{/* Filters */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Filter className="h-5 w-5" />
						Filtruj Badania
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					{/* Search */}
					<div className="relative">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
						<Input
							placeholder="Szukaj w tytułach, abstraktach, słowach kluczowych..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-10"
						/>
					</div>

					{/* Filter Controls */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div>
							<label className="text-sm font-medium mb-2 block">Poziom Dowodów</label>
							<Select value={selectedEvidenceLevel} onValueChange={setSelectedEvidenceLevel}>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="ALL">Wszystkie</SelectItem>
									{Object.entries(EVIDENCE_LEVELS).map(([key, value]) => (
										<SelectItem key={key} value={key}>{value.label}</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div>
							<label className="text-sm font-medium mb-2 block">Typ Badania</label>
							<Select value={selectedStudyType} onValueChange={setSelectedStudyType}>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="ALL">Wszystkie</SelectItem>
									{Object.entries(STUDY_TYPES).map(([key, value]) => (
										<SelectItem key={key} value={key}>{value}</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div>
							<label className="text-sm font-medium mb-2 block">Suplement</label>
							<Select value={selectedSupplement} onValueChange={setSelectedSupplement}>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="ALL">Wszystkie</SelectItem>
									{uniqueSupplements.map((supp) => (
										<SelectItem key={supp} value={supp}>{supp}</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>

					{/* Results Count */}
					<div className="flex items-center justify-between pt-2 border-t">
						<div className="text-sm text-muted-foreground">
							Znaleziono <strong>{filteredStudies.length}</strong> badań
						</div>
						{(searchQuery || selectedEvidenceLevel !== "ALL" || selectedStudyType !== "ALL" || selectedSupplement !== "ALL") && (
							<Button
								variant="ghost"
								size="sm"
								onClick={() => {
									setSearchQuery("");
									setSelectedEvidenceLevel("ALL");
									setSelectedStudyType("ALL");
									setSelectedSupplement("ALL");
								}}
							>
								Wyczyść filtry
							</Button>
						)}
					</div>
				</CardContent>
			</Card>

			{/* Research Studies Grid */}
			<div className="space-y-6">
				{filteredStudies.length === 0 ? (
					<Card>
						<CardContent className="py-12 text-center">
							<BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
							<h3 className="text-lg font-semibold mb-2">Nie znaleziono badań</h3>
							<p className="text-muted-foreground">
								Spróbuj zmienić kryteria wyszukiwania lub wyczyść filtry
							</p>
						</CardContent>
					</Card>
				) : (
					filteredStudies.map((study) => (
						<ResearchStudyCard
							key={study.id}
							study={study}
							onBookmark={handleBookmark}
							onViewFullText={handleViewFullText}
							onCiteStudy={handleCiteStudy}
						/>
					))
				)}
			</div>
		</div>
	);
}

