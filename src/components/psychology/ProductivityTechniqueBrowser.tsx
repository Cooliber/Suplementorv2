"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
	Award,
	BarChart3,
	BookOpen,
	Brain,
	CheckCircle,
	ChevronDown,
	ChevronUp,
	Clock,
	Filter,
	Lightbulb,
	Play,
	Search,
	Star,
	Target,
	TrendingUp,
	Users,
	Zap,
} from "lucide-react";
import type React from "react";
import { useCallback, useMemo, useState } from "react";

interface ProductivityTechnique {
	id: string;
	name: string;
	polishName: string;
	category: string;
	polishCategory: string;
	description: string;
	polishDescription: string;

	methodology: {
		overview: string;
		polishOverview: string;
		steps: Array<{
			stepNumber: number;
			title: string;
			polishTitle: string;
			description: string;
			polishDescription: string;
			duration?: string;
			polishDuration?: string;
			tips: string[];
			polishTips: string[];
		}>;
		requirements: string[];
		polishRequirements: string[];
		tools: string[];
		polishTools: string[];
	};

	scientificBasis: {
		psychologicalPrinciples: string[];
		polishPsychologicalPrinciples: string[];
		neuroscienceEvidence: string;
		polishNeuroscienceEvidence: string;
		researchStudies: Array<{
			title: string;
			polishTitle: string;
			authors: string;
			year: number;
			findings: string;
			polishFindings: string;
			effectSize?: number;
			sampleSize?: number;
		}>;
		evidenceLevel: "STRONG" | "MODERATE" | "WEAK" | "ANECDOTAL";
		polishEvidenceLevel: string;
	};

	implementation: {
		gettingStarted: string;
		polishGettingStarted: string;
		commonMistakes: string[];
		polishCommonMistakes: string[];
		troubleshooting: Array<{
			problem: string;
			polishProblem: string;
			solution: string;
			polishSolution: string;
		}>;
		adaptations: Array<{
			situation: string;
			polishSituation: string;
			modification: string;
			polishModification: string;
		}>;
	};

	effectiveness: {
		averageImprovementPercentage: number;
		timeToSeeResults: string;
		polishTimeToSeeResults: string;
		sustainabilityRating: number;
		difficultyRating: number;
		userSatisfactionRating: number;
		applicabilityScenarios: string[];
		polishApplicabilityScenarios: string[];
	};

	supplementSynergies: Array<{
		supplementId: string;
		supplementName: string;
		polishSupplementName: string;
		synergyType: "ENHANCES" | "SUPPORTS" | "COMPLEMENTS" | "OPTIMIZES";
		polishSynergyType: string;
		description: string;
		polishDescription: string;
		recommendedTiming: string;
		polishRecommendedTiming: string;
		evidenceLevel: "STRONG" | "MODERATE" | "WEAK" | "THEORETICAL";
	}>;

	trackingMetrics: Array<{
		metric: string;
		polishMetric: string;
		measurementMethod: string;
		polishMeasurementMethod: string;
		frequency: string;
		polishFrequency: string;
		targetImprovement: string;
		polishTargetImprovement: string;
	}>;

	relatedTechniques: string[];
	prerequisites: string[];
	polishPrerequisites: string[];
	tags: string[];
	polishTags: string[];
	difficultyLevel: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
	estimatedTimeToMaster: number;
	isActive: boolean;
}

interface ProductivityTechniqueBrowserProps {
	techniques: ProductivityTechnique[];
	onTechniqueSelect: (techniqueId: string) => void;
	onStartImplementation: (techniqueId: string) => void;
	userProgress?: {
		implementedTechniques: string[];
		masteredTechniques: string[];
		currentlyLearning: string[];
	};
	className?: string;
}

const ProductivityTechniqueBrowser: React.FC<
	ProductivityTechniqueBrowserProps
> = ({
	techniques,
	onTechniqueSelect,
	onStartImplementation,
	userProgress,
	className = "",
}) => {
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState<string>("all");
	const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
	const [selectedEvidenceLevel, setSelectedEvidenceLevel] =
		useState<string>("all");
	const [sortBy, setSortBy] = useState<
		"effectiveness" | "difficulty" | "time" | "popularity"
	>("effectiveness");
	const [expandedTechnique, setExpandedTechnique] = useState<string | null>(
		null,
	);

	// Get unique categories
	const categories = useMemo(() => {
		const cats = Array.from(new Set(techniques.map((t) => t.polishCategory)));
		return cats.sort();
	}, [techniques]);

	// Filter and sort techniques
	const filteredTechniques = useMemo(() => {
		const filtered = techniques.filter((technique) => {
			const matchesSearch =
				technique.polishName
					.toLowerCase()
					.includes(searchQuery.toLowerCase()) ||
				technique.polishDescription
					.toLowerCase()
					.includes(searchQuery.toLowerCase()) ||
				technique.polishTags.some((tag) =>
					tag.toLowerCase().includes(searchQuery.toLowerCase()),
				);

			const matchesCategory =
				selectedCategory === "all" ||
				technique.polishCategory === selectedCategory;
			const matchesDifficulty =
				selectedDifficulty === "all" ||
				technique.difficultyLevel === selectedDifficulty;
			const matchesEvidence =
				selectedEvidenceLevel === "all" ||
				technique.scientificBasis.evidenceLevel === selectedEvidenceLevel;

			return (
				matchesSearch && matchesCategory && matchesDifficulty && matchesEvidence
			);
		});

		// Sort techniques
		filtered.sort((a, b) => {
			switch (sortBy) {
				case "effectiveness":
					return (
						b.effectiveness.averageImprovementPercentage -
						a.effectiveness.averageImprovementPercentage
					);
				case "difficulty":
					return (
						a.effectiveness.difficultyRating - b.effectiveness.difficultyRating
					);
				case "time":
					return a.estimatedTimeToMaster - b.estimatedTimeToMaster;
				case "popularity":
					return (
						b.effectiveness.userSatisfactionRating -
						a.effectiveness.userSatisfactionRating
					);
				default:
					return 0;
			}
		});

		return filtered;
	}, [
		techniques,
		searchQuery,
		selectedCategory,
		selectedDifficulty,
		selectedEvidenceLevel,
		sortBy,
	]);

	const getDifficultyColor = (difficulty: string) => {
		switch (difficulty) {
			case "BEGINNER":
				return "bg-green-100 text-green-800";
			case "INTERMEDIATE":
				return "bg-yellow-100 text-yellow-800";
			case "ADVANCED":
				return "bg-red-100 text-red-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const getDifficultyText = (difficulty: string) => {
		switch (difficulty) {
			case "BEGINNER":
				return "Podstawowy";
			case "INTERMEDIATE":
				return "Średni";
			case "ADVANCED":
				return "Zaawansowany";
			default:
				return difficulty;
		}
	};

	const getEvidenceLevelColor = (level: string) => {
		switch (level) {
			case "STRONG":
				return "bg-green-100 text-green-800";
			case "MODERATE":
				return "bg-yellow-100 text-yellow-800";
			case "WEAK":
				return "bg-orange-100 text-orange-800";
			case "ANECDOTAL":
				return "bg-red-100 text-red-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const getEvidenceLevelText = (level: string) => {
		switch (level) {
			case "STRONG":
				return "Silne";
			case "MODERATE":
				return "Umiarkowane";
			case "WEAK":
				return "Słabe";
			case "ANECDOTAL":
				return "Anegdotyczne";
			default:
				return level;
		}
	};

	const getSynergyTypeColor = (type: string) => {
		switch (type) {
			case "ENHANCES":
				return "text-green-600";
			case "SUPPORTS":
				return "text-blue-600";
			case "COMPLEMENTS":
				return "text-purple-600";
			case "OPTIMIZES":
				return "text-orange-600";
			default:
				return "text-gray-600";
		}
	};

	const getSynergyTypeText = (type: string) => {
		switch (type) {
			case "ENHANCES":
				return "Wzmacnia";
			case "SUPPORTS":
				return "Wspiera";
			case "COMPLEMENTS":
				return "Uzupełnia";
			case "OPTIMIZES":
				return "Optymalizuje";
			default:
				return type;
		}
	};

	const isImplemented = useCallback(
		(techniqueId: string) => {
			return userProgress?.implementedTechniques.includes(techniqueId) || false;
		},
		[userProgress],
	);

	const isMastered = useCallback(
		(techniqueId: string) => {
			return userProgress?.masteredTechniques.includes(techniqueId) || false;
		},
		[userProgress],
	);

	const isCurrentlyLearning = useCallback(
		(techniqueId: string) => {
			return userProgress?.currentlyLearning.includes(techniqueId) || false;
		},
		[userProgress],
	);

	const renderTechniqueCard = (technique: ProductivityTechnique) => {
		const isExpanded = expandedTechnique === technique.id;
		const implemented = isImplemented(technique.id);
		const mastered = isMastered(technique.id);
		const learning = isCurrentlyLearning(technique.id);

		return (
			<Card
				key={technique.id}
				className="transition-shadow duration-200 hover:shadow-lg"
			>
				<CardHeader className="pb-4">
					<div className="flex items-start justify-between">
						<div className="flex-1">
							<div className="mb-2 flex items-center gap-2">
								<Badge
									className={getDifficultyColor(technique.difficultyLevel)}
								>
									{getDifficultyText(technique.difficultyLevel)}
								</Badge>
								<Badge
									className={getEvidenceLevelColor(
										technique.scientificBasis.evidenceLevel,
									)}
								>
									{getEvidenceLevelText(
										technique.scientificBasis.evidenceLevel,
									)}
								</Badge>
								<Badge variant="outline">{technique.polishCategory}</Badge>
								{mastered && (
									<Badge className="bg-gold-100 text-gold-800">
										<Award className="mr-1 h-3 w-3" />
										Opanowane
									</Badge>
								)}
								{learning && (
									<Badge className="bg-blue-100 text-blue-800">
										<BookOpen className="mr-1 h-3 w-3" />W trakcie nauki
									</Badge>
								)}
							</div>

							<CardTitle className="mb-2 text-lg">
								{technique.polishName}
							</CardTitle>
							<p className="line-clamp-2 text-gray-600 text-sm">
								{technique.polishDescription}
							</p>

							<div className="mt-3 flex items-center gap-4 text-gray-500 text-sm">
								<span className="flex items-center gap-1">
									<Clock className="h-3 w-3" />
									{technique.estimatedTimeToMaster} dni do opanowania
								</span>
								<span className="flex items-center gap-1">
									<TrendingUp className="h-3 w-3" />
									{technique.effectiveness.averageImprovementPercentage}%
									poprawa
								</span>
								<span className="flex items-center gap-1">
									<Star className="h-3 w-3" />
									{technique.effectiveness.userSatisfactionRating}/10
								</span>
							</div>
						</div>

						<div className="ml-4 flex flex-col gap-2">
							<Button
								variant={implemented ? "outline" : "default"}
								size="sm"
								onClick={() => onStartImplementation(technique.id)}
								disabled={learning}
							>
								{implemented ? (
									<>
										<CheckCircle className="mr-1 h-3 w-3" />
										Wdrożone
									</>
								) : learning ? (
									<>
										<BookOpen className="mr-1 h-3 w-3" />W trakcie
									</>
								) : (
									<>
										<Play className="mr-1 h-3 w-3" />
										Rozpocznij
									</>
								)}
							</Button>

							<Collapsible
								open={isExpanded}
								onOpenChange={(open) =>
									setExpandedTechnique(open ? technique.id : null)
								}
							>
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
					</div>
				</CardHeader>

				<Collapsible
					open={isExpanded}
					onOpenChange={(open) =>
						setExpandedTechnique(open ? technique.id : null)
					}
				>
					<CollapsibleContent>
						<CardContent className="pt-0">
							<Tabs defaultValue="overview" className="w-full">
								<TabsList className="grid w-full grid-cols-5">
									<TabsTrigger value="overview" className="text-xs">
										Przegląd
									</TabsTrigger>
									<TabsTrigger value="methodology" className="text-xs">
										Metodologia
									</TabsTrigger>
									<TabsTrigger value="science" className="text-xs">
										Nauka
									</TabsTrigger>
									<TabsTrigger value="implementation" className="text-xs">
										Wdrożenie
									</TabsTrigger>
									<TabsTrigger value="synergies" className="text-xs">
										Synergie
									</TabsTrigger>
								</TabsList>

								<TabsContent value="overview" className="mt-4 space-y-4">
									<div>
										<h4 className="mb-2 font-medium text-sm">Opis</h4>
										<p className="text-gray-700 text-sm">
											{technique.methodology.polishOverview}
										</p>
									</div>

									<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
										<div>
											<h5 className="mb-2 font-medium text-sm">Skuteczność</h5>
											<div className="space-y-2">
												<div className="flex items-center justify-between text-xs">
													<span>Poprawa</span>
													<span>
														{
															technique.effectiveness
																.averageImprovementPercentage
														}
														%
													</span>
												</div>
												<Progress
													value={
														technique.effectiveness.averageImprovementPercentage
													}
													className="h-2"
												/>
											</div>
										</div>

										<div>
											<h5 className="mb-2 font-medium text-sm">Trudność</h5>
											<div className="space-y-2">
												<div className="flex items-center justify-between text-xs">
													<span>Poziom</span>
													<span>
														{technique.effectiveness.difficultyRating}/10
													</span>
												</div>
												<Progress
													value={technique.effectiveness.difficultyRating * 10}
													className="h-2"
												/>
											</div>
										</div>

										<div>
											<h5 className="mb-2 font-medium text-sm">Satysfakcja</h5>
											<div className="space-y-2">
												<div className="flex items-center justify-between text-xs">
													<span>Ocena</span>
													<span>
														{technique.effectiveness.userSatisfactionRating}/10
													</span>
												</div>
												<Progress
													value={
														technique.effectiveness.userSatisfactionRating * 10
													}
													className="h-2"
												/>
											</div>
										</div>
									</div>

									<div>
										<h4 className="mb-2 font-medium text-sm">Zastosowania</h4>
										<div className="flex flex-wrap gap-1">
											{technique.effectiveness.polishApplicabilityScenarios.map(
												(scenario, index) => (
													<Badge
														key={index}
														variant="secondary"
														className="text-xs"
													>
														{scenario}
													</Badge>
												),
											)}
										</div>
									</div>
								</TabsContent>

								<TabsContent value="methodology" className="mt-4 space-y-4">
									<div>
										<h4 className="mb-3 font-medium text-sm">
											Kroki implementacji
										</h4>
										<div className="space-y-3">
											{technique.methodology.steps.map((step, index) => (
												<div key={index} className="rounded-lg border p-3">
													<div className="mb-2 flex items-center gap-2">
														<span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 font-medium text-blue-800 text-xs">
															{step.stepNumber}
														</span>
														<h5 className="font-medium text-sm">
															{step.polishTitle}
														</h5>
														{step.polishDuration && (
															<Badge variant="outline" className="text-xs">
																<Clock className="mr-1 h-3 w-3" />
																{step.polishDuration}
															</Badge>
														)}
													</div>
													<p className="mb-2 text-gray-700 text-sm">
														{step.polishDescription}
													</p>
													{step.polishTips.length > 0 && (
														<div>
															<h6 className="mb-1 font-medium text-gray-600 text-xs">
																Wskazówki:
															</h6>
															<ul className="space-y-1 text-gray-600 text-xs">
																{step.polishTips.map((tip, tipIndex) => (
																	<li
																		key={tipIndex}
																		className="flex items-start gap-1"
																	>
																		<span className="text-blue-600">•</span>
																		{tip}
																	</li>
																))}
															</ul>
														</div>
													)}
												</div>
											))}
										</div>
									</div>

									<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
										<div>
											<h4 className="mb-2 font-medium text-sm">Wymagania</h4>
											<ul className="space-y-1 text-gray-700 text-sm">
												{technique.methodology.polishRequirements.map(
													(req, index) => (
														<li key={index} className="flex items-start gap-2">
															<CheckCircle className="mt-0.5 h-3 w-3 flex-shrink-0 text-green-600" />
															{req}
														</li>
													),
												)}
											</ul>
										</div>

										<div>
											<h4 className="mb-2 font-medium text-sm">Narzędzia</h4>
											<ul className="space-y-1 text-gray-700 text-sm">
												{technique.methodology.polishTools.map(
													(tool, index) => (
														<li key={index} className="flex items-start gap-2">
															<Target className="mt-0.5 h-3 w-3 flex-shrink-0 text-blue-600" />
															{tool}
														</li>
													),
												)}
											</ul>
										</div>
									</div>
								</TabsContent>

								<TabsContent value="science" className="mt-4 space-y-4">
									<div>
										<h4 className="mb-2 font-medium text-sm">
											Podstawy naukowe
										</h4>
										<p className="text-gray-700 text-sm">
											{technique.scientificBasis.polishNeuroscienceEvidence}
										</p>
									</div>

									<div>
										<h4 className="mb-2 font-medium text-sm">
											Zasady psychologiczne
										</h4>
										<div className="flex flex-wrap gap-1">
											{technique.scientificBasis.polishPsychologicalPrinciples.map(
												(principle, index) => (
													<Badge
														key={index}
														variant="outline"
														className="text-xs"
													>
														<Brain className="mr-1 h-3 w-3" />
														{principle}
													</Badge>
												),
											)}
										</div>
									</div>

									{technique.scientificBasis.researchStudies.length > 0 && (
										<div>
											<h4 className="mb-2 font-medium text-sm">
												Kluczowe badania
											</h4>
											<div className="space-y-2">
												{technique.scientificBasis.researchStudies
													.slice(0, 2)
													.map((study, index) => (
														<div key={index} className="rounded-lg border p-3">
															<h5 className="font-medium text-sm">
																{study.polishTitle}
															</h5>
															<p className="mb-1 text-gray-600 text-xs">
																{study.authors} ({study.year})
															</p>
															<p className="text-gray-700 text-sm">
																{study.polishFindings}
															</p>
															{study.effectSize && (
																<div className="mt-2 flex items-center gap-4 text-gray-600 text-xs">
																	<span>
																		Wielkość efektu: {study.effectSize}
																	</span>
																	{study.sampleSize && (
																		<span>Próba: {study.sampleSize} osób</span>
																	)}
																</div>
															)}
														</div>
													))}
											</div>
										</div>
									)}
								</TabsContent>

								<TabsContent value="implementation" className="mt-4 space-y-4">
									<div>
										<h4 className="mb-2 font-medium text-sm">Jak zacząć</h4>
										<p className="text-gray-700 text-sm">
											{technique.implementation.polishGettingStarted}
										</p>
									</div>

									<div>
										<h4 className="mb-2 font-medium text-sm">Częste błędy</h4>
										<ul className="space-y-1 text-gray-700 text-sm">
											{technique.implementation.polishCommonMistakes.map(
												(mistake, index) => (
													<li key={index} className="flex items-start gap-2">
														<span className="mt-0.5 text-red-600">⚠</span>
														{mistake}
													</li>
												),
											)}
										</ul>
									</div>

									{technique.implementation.troubleshooting.length > 0 && (
										<div>
											<h4 className="mb-2 font-medium text-sm">
												Rozwiązywanie problemów
											</h4>
											<div className="space-y-2">
												{technique.implementation.troubleshooting.map(
													(item, index) => (
														<div key={index} className="rounded-lg border p-3">
															<h5 className="font-medium text-orange-800 text-sm">
																{item.polishProblem}
															</h5>
															<p className="text-gray-700 text-sm">
																{item.polishSolution}
															</p>
														</div>
													),
												)}
											</div>
										</div>
									)}
								</TabsContent>

								<TabsContent value="synergies" className="mt-4 space-y-4">
									{technique.supplementSynergies.length > 0 ? (
										<div>
											<h4 className="mb-3 font-medium text-sm">
												Synergie z suplementami
											</h4>
											<div className="space-y-3">
												{technique.supplementSynergies.map((synergy, index) => (
													<div key={index} className="rounded-lg border p-3">
														<div className="mb-2 flex items-center justify-between">
															<h5 className="font-medium text-sm">
																{synergy.polishSupplementName}
															</h5>
															<Badge
																className={cn(
																	"text-xs",
																	getSynergyTypeColor(synergy.synergyType),
																)}
															>
																{getSynergyTypeText(synergy.synergyType)}
															</Badge>
														</div>
														<p className="mb-2 text-gray-700 text-sm">
															{synergy.polishDescription}
														</p>
														<div className="text-gray-600 text-xs">
															<strong>Zalecany czas:</strong>{" "}
															{synergy.polishRecommendedTiming}
														</div>
													</div>
												))}
											</div>
										</div>
									) : (
										<div className="py-8 text-center">
											<Zap className="mx-auto mb-4 h-12 w-12 text-gray-400" />
											<h4 className="mb-2 font-medium text-gray-900 text-sm">
												Brak udokumentowanych synergii
											</h4>
											<p className="text-gray-600 text-sm">
												Ta technika nie ma jeszcze udokumentowanych synergii z
												suplementami.
											</p>
										</div>
									)}

									{technique.trackingMetrics.length > 0 && (
										<div>
											<h4 className="mb-2 font-medium text-sm">
												Metryki śledzenia
											</h4>
											<div className="space-y-2">
												{technique.trackingMetrics.map((metric, index) => (
													<div key={index} className="rounded-lg border p-3">
														<h5 className="font-medium text-sm">
															{metric.polishMetric}
														</h5>
														<p className="mb-1 text-gray-600 text-xs">
															{metric.polishMeasurementMethod}
														</p>
														<div className="flex items-center justify-between text-xs">
															<span>
																Częstotliwość: {metric.polishFrequency}
															</span>
															<span>Cel: {metric.polishTargetImprovement}</span>
														</div>
													</div>
												))}
											</div>
										</div>
									)}
								</TabsContent>
							</Tabs>
						</CardContent>
					</CollapsibleContent>
				</Collapsible>
			</Card>
		);
	};

	return (
		<div className={cn("w-full space-y-6", className)}>
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h2 className="font-bold text-2xl">Techniki produktywności</h2>
					<p className="text-gray-600">
						Odkryj 23+ naukowo potwierdzonych technik wykorzystujących naturalne
						mechanizmy mózgu
					</p>
				</div>
				<div className="flex items-center gap-2">
					<Badge variant="outline">{filteredTechniques.length} technik</Badge>
					{userProgress && (
						<Badge className="bg-blue-100 text-blue-800">
							{userProgress.masteredTechniques.length} opanowanych
						</Badge>
					)}
				</div>
			</div>

			{/* Filters */}
			<Card>
				<CardContent className="p-4">
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
						<div>
							<Label className="mb-2 block font-medium text-sm">Szukaj</Label>
							<div className="relative">
								<Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform text-gray-400" />
								<Input
									placeholder="Nazwa, opis, tagi..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className="pl-10"
								/>
							</div>
						</div>

						<div>
							<Label className="mb-2 block font-medium text-sm">
								Kategoria
							</Label>
							<Select
								value={selectedCategory}
								onValueChange={setSelectedCategory}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">Wszystkie</SelectItem>
									{categories.map((category) => (
										<SelectItem key={category} value={category}>
											{category}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div>
							<Label className="mb-2 block font-medium text-sm">Trudność</Label>
							<Select
								value={selectedDifficulty}
								onValueChange={setSelectedDifficulty}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">Wszystkie</SelectItem>
									<SelectItem value="BEGINNER">Podstawowy</SelectItem>
									<SelectItem value="INTERMEDIATE">Średni</SelectItem>
									<SelectItem value="ADVANCED">Zaawansowany</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div>
							<Label className="mb-2 block font-medium text-sm">Dowody</Label>
							<Select
								value={selectedEvidenceLevel}
								onValueChange={setSelectedEvidenceLevel}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">Wszystkie</SelectItem>
									<SelectItem value="STRONG">Silne</SelectItem>
									<SelectItem value="MODERATE">Umiarkowane</SelectItem>
									<SelectItem value="WEAK">Słabe</SelectItem>
									<SelectItem value="ANECDOTAL">Anegdotyczne</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div>
							<Label className="mb-2 block font-medium text-sm">Sortuj</Label>
							<Select
								value={sortBy}
								onValueChange={(value: any) => setSortBy(value)}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="effectiveness">Skuteczność</SelectItem>
									<SelectItem value="difficulty">Trudność</SelectItem>
									<SelectItem value="time">Czas nauki</SelectItem>
									<SelectItem value="popularity">Popularność</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Techniques List */}
			<div className="space-y-4">
				{filteredTechniques.length > 0 ? (
					filteredTechniques.map(renderTechniqueCard)
				) : (
					<Card>
						<CardContent className="flex items-center justify-center py-12">
							<div className="text-center">
								<Filter className="mx-auto mb-4 h-12 w-12 text-gray-400" />
								<h3 className="mb-2 font-medium text-gray-900 text-lg">
									Brak wyników
								</h3>
								<p className="text-gray-600">
									Spróbuj zmienić filtry lub wyszukiwane hasło.
								</p>
							</div>
						</CardContent>
					</Card>
				)}
			</div>
		</div>
	);
};

export default ProductivityTechniqueBrowser;
