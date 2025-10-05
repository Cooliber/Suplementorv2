/**
 * BrainSupplementCard Component
 * Educational component for displaying brain supplement information
 * with Polish localization and interactive brain region visualization
 */

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	AlertTriangle,
	BookOpen,
	Bookmark,
	BookmarkCheck,
	Brain,
	CheckCircle,
	Clock,
	Eye,
	EyeOff,
	Info,
	Shield,
	Users,
	Zap,
} from "lucide-react";
import type React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { usePolishLocalization } from "@/lib/hooks/use-polish-localization";
// import { BrainVisualization } from './BrainVisualization';
// import { ProgressTracker } from './ProgressTracker';
import type {
	BrainRegion,
	BrainSupplementCardProps,
	BrainSupplementCardState,
	BrainSupplementData,
	LocalizationContext,
} from "./types";

// Sample supplement data for demonstration
const sampleSupplementData: BrainSupplementData = {
	id: "bacopa-monieri",
	name: "Bacopa Monnieri",
	polishName: "Bacopa Monnieri",
	scientificName: "Bacopa monnieri",
	category: "herb",
	polishCategory: "zioło",

	description:
		"Bacopa Monnieri, known as Brahmi in Ayurvedic medicine, is a traditional herb renowned for its cognitive-enhancing properties.",
	polishDescription:
		"Bacopa Monnieri, znana jako Brahmi w medycynie ajurwedyjskiej, to tradycyjne zioło cenione za właściwości wzmacniające funkcje poznawcze.",

	educationalContent: {
		howItWorks:
			"Bacopa enhances memory and cognitive function through multiple mechanisms including increased acetylcholine levels, BDNF upregulation, and antioxidant effects.",
		polishHowItWorks:
			"Bacopa wzmacnia pamięć i funkcje poznawcze poprzez wiele mechanizmów, w tym zwiększone poziomy acetylocholiny, wzrost BDNF i efekty antyoksydacyjne.",
		researchSummary:
			"Multiple clinical trials demonstrate significant improvements in memory, learning, and cognitive performance with 8-12 weeks of supplementation.",
		polishResearchSummary:
			"Wiele badań klinicznych wykazuje znaczącą poprawę pamięci, uczenia się i wydajności poznawczej po 8-12 tygodniach suplementacji.",
		safetyProfile:
			"Generally well-tolerated with mild gastrointestinal side effects. Contraindicated in pregnancy and thyroid disorders.",
		polishSafetyProfile:
			"Ogólnie dobrze tolerowana z łagodnymi efektami jelitowymi. Przeciwwskazana w ciąży i zaburzeniach tarczycy.",
	},

	primaryBrainRegions: [
		{
			id: "hippocampus",
			name: "Hippocampus",
			polishName: "Hipokamp",
			description: "Brain region crucial for memory formation and learning",
			polishDescription:
				"Region mózgu kluczowy dla tworzenia pamięci i uczenia się",
			coordinates: { x: 0.5, y: 0.6, z: 0.3 },
			functions: ["Memory formation", "Spatial navigation", "Learning"],
			polishFunctions: [
				"Tworzenie pamięci",
				"Nawigacja przestrzenna",
				"Uczenie się",
			],
			supplementEffects: [
				{
					type: "enhancement",
					polishType: "wzmocnienie",
					strength: "strong",
					mechanism: "BDNF upregulation and neurogenesis",
					polishMechanism: "wzrost BDNF i neurogeneza",
					evidenceLevel: "strong",
					duration: "8-12 weeks",
					polishDuration: "8-12 tygodni",
				},
			],
			color: "#3B82F6",
			size: "medium",
		},
		{
			id: "prefrontal-cortex",
			name: "Prefrontal Cortex",
			polishName: "Kora przedczołowa",
			description: "Executive function and decision-making center",
			polishDescription: "Centrum funkcji wykonawczych i podejmowania decyzji",
			coordinates: { x: 0.5, y: 0.3, z: 0.7 },
			functions: ["Executive function", "Attention", "Working memory"],
			polishFunctions: ["Funkcje wykonawcze", "Uwaga", "Pamięć robocza"],
			supplementEffects: [
				{
					type: "enhancement",
					polishType: "wzmocnienie",
					strength: "moderate",
					mechanism: "Cholinergic enhancement",
					polishMechanism: "wzmocnienie cholinergiczne",
					evidenceLevel: "moderate",
					duration: "4-6 weeks",
					polishDuration: "4-6 tygodni",
				},
			],
			color: "#10B981",
			size: "large",
		},
	],

	secondaryBrainRegions: [
		{
			id: "amygdala",
			name: "Amygdala",
			polishName: "Ciało migdałowate",
			description: "Emotional processing and stress response",
			polishDescription: "Przetwarzanie emocji i reakcja na stres",
			coordinates: { x: 0.4, y: 0.5, z: 0.2 },
			functions: ["Emotional regulation", "Fear response", "Stress modulation"],
			polishFunctions: [
				"Regulacja emocji",
				"Reakcja strachu",
				"Modulacja stresu",
			],
			supplementEffects: [
				{
					type: "modulation",
					polishType: "modulacja",
					strength: "moderate",
					mechanism: "GABAergic and serotonergic effects",
					polishMechanism: "efekty GABAergiczne i serotoninergiczne",
					evidenceLevel: "moderate",
					duration: "2-4 weeks",
					polishDuration: "2-4 tygodnie",
				},
			],
			color: "#F59E0B",
			size: "medium",
		},
	],

	affectedSystems: [
		"Cholinergic system",
		"Neurotrophic system",
		"Antioxidant system",
	],
	polishAffectedSystems: [
		"System cholinergiczny",
		"System neurotroficzny",
		"System antyoksydacyjny",
	],

	evidenceLevel: "strong",
	studyCount: 15,
	participantCount: 1200,
	effectSize: 0.6,

	recommendedDosage: {
		min: 300,
		max: 450,
		unit: "mg",
		frequency: "daily",
		polishFrequency: "dziennie",
		timing: ["morning", "afternoon"],
		withFood: true,
	},

	contraindications: ["Pregnancy", "Breastfeeding", "Thyroid disorders"],
	polishContraindications: [
		"Ciąża",
		"Karmienie piersią",
		"Zaburzenia tarczycy",
	],
	sideEffects: {
		common: ["Mild gastrointestinal discomfort"],
		uncommon: ["Dry mouth", "Fatigue"],
		rare: ["Headache", "Nausea"],
	},
	interactions: ["Thyroid medications", "Sedatives"],
	polishInteractions: ["Leki na tarczycę", "Środki uspokajające"],

	difficultyLevel: "intermediate",
	learningObjectives: [
		"Understand cholinergic enhancement",
		"Learn about BDNF mechanisms",
		"Explore clinical evidence",
	],
	polishLearningObjectives: [
		"Zrozumieć wzmocnienie cholinergiczne",
		"Poznać mechanizmy BDNF",
		"Zbadać dowody kliniczne",
	],
	relatedTopics: [
		"Memory enhancement",
		"Neuroprotection",
		"Ayurvedic medicine",
	],
	polishRelatedTopics: [
		"Wzmacnianie pamięci",
		"Neuroprotekcja",
		"Medycyna ajurwedyjska",
	],
};

export const BrainSupplementCard: React.FC<BrainSupplementCardProps> = ({
	supplement = sampleSupplementData,
	variant = "default",
	size = "medium",
	interactive = true,
	showBrainVisualization = true,
	showProgressTracking = false,
	allowBookmark = true,
	language = "pl",
	enableMedicalTerms = true,
	validatePolishChars = true,
	ariaLabel,
	ariaDescription,
	highContrast = false,
	reducedMotion = false,
	onRegionClick,
	onSupplementClick,
	onBookmark,
	onProgressUpdate,
	className = "",
	style,
	theme = "auto",
	lazyLoad = false,
	preloadImages = false,
	"data-testid": testId = "brain-supplement-card",
}) => {
	// Component state
	const [state, setState] = useState<BrainSupplementCardState>({
		selectedRegion: null,
		isBookmarked: false,
		progress: 0,
		isLoading: false,
		error: null,
		language,
		showDetails: false,
		activeTab: "overview",
	});

	// Polish localization hook
	const localization = usePolishLocalization({
		language,
		enableMedicalTerms,
		enableCharacterValidation: validatePolishChars,
	});

	// Memoized values
	const cardClasses = useMemo(() => {
		const baseClasses = [
			"brain-supplement-card",
			`brain-supplement-card--${variant}`,
			`brain-supplement-card--${size}`,
			highContrast ? "brain-supplement-card--high-contrast" : "",
			reducedMotion ? "brain-supplement-card--reduced-motion" : "",
			theme === "dark" ? "brain-supplement-card--dark" : "",
			theme === "light" ? "brain-supplement-card--light" : "",
			className,
		]
			.filter(Boolean)
			.join(" ");

		return baseClasses;
	}, [variant, size, highContrast, reducedMotion, theme, className]);

	const evidenceBadgeColor = useMemo(() => {
		switch (supplement.evidenceLevel) {
			case "very-strong":
				return "bg-green-100 text-green-800 border-green-200";
			case "strong":
				return "bg-blue-100 text-blue-800 border-blue-200";
			case "moderate":
				return "bg-yellow-100 text-yellow-800 border-yellow-200";
			case "weak":
				return "bg-red-100 text-red-800 border-red-200";
			default:
				return "bg-gray-100 text-gray-800 border-gray-200";
		}
	}, [supplement.evidenceLevel]);

	// Event handlers
	const handleRegionClick = useCallback(
		(region: BrainRegion) => {
			setState((prev) => ({ ...prev, selectedRegion: region }));
			onRegionClick?.(region);
		},
		[onRegionClick],
	);

	const handleSupplementClick = useCallback(() => {
		onSupplementClick?.(supplement);
	}, [onSupplementClick, supplement]);

	const handleBookmark = useCallback(() => {
		setState((prev) => ({ ...prev, isBookmarked: !prev.isBookmarked }));
		onBookmark?.(supplement.id);
	}, [onBookmark, supplement.id]);

	const handleProgressUpdate = useCallback(
		(progress: number) => {
			setState((prev) => ({ ...prev, progress }));
			onProgressUpdate?.(progress);
		},
		[onProgressUpdate],
	);

	const handleTabChange = useCallback((value: string) => {
		setState((prev) => ({
			...prev,
			activeTab: value as BrainSupplementCardState["activeTab"],
		}));
	}, []);

	// Accessibility attributes
	const accessibilityProps = useMemo(
		() => ({
			"aria-label":
				ariaLabel ||
				localization.t(
					"brain-supplement-card.ariaLabel",
					`Karta suplementu: ${supplement.polishName}`,
				),
			"aria-description":
				ariaDescription ||
				localization.t(
					"brain-supplement-card.ariaDescription",
					"Edukacyjna karta suplementu mózgowego z interaktywną wizualizacją regionów mózgu",
				),
			"data-testid": testId,
		}),
		[ariaLabel, ariaDescription, localization, supplement.polishName, testId],
	);

	return (
		<div className={cardClasses} style={style} {...accessibilityProps}>
			<Card className="mx-auto w-full max-w-4xl overflow-hidden">
				<CardHeader className="relative">
					<div className="flex items-start justify-between">
						<div className="flex-1">
							<div className="mb-2 flex items-center gap-2">
								<Badge variant="outline" className={evidenceBadgeColor}>
									{localization.t(
										`evidence-level.${supplement.evidenceLevel}`,
										supplement.evidenceLevel,
									)}
								</Badge>
								<Badge variant="secondary">
									{localization.formatMedicalTerm(
										supplement.category,
										supplement.polishCategory,
									)}
								</Badge>
							</div>

							<CardTitle className="font-bold text-2xl text-gray-900 dark:text-gray-100">
								{language === "pl" ? supplement.polishName : supplement.name}
							</CardTitle>

							{supplement.scientificName && (
								<CardDescription className="mt-1 text-gray-600 text-lg dark:text-gray-400">
									{supplement.scientificName}
								</CardDescription>
							)}
						</div>

						{allowBookmark && (
							<Button
								variant="ghost"
								size="sm"
								onClick={handleBookmark}
								className="ml-4"
								aria-label={localization.t(
									state.isBookmarked ? "remove-bookmark" : "add-bookmark",
									state.isBookmarked ? "Usuń zakładkę" : "Dodaj zakładkę",
								)}
							>
								{state.isBookmarked ? (
									<BookmarkCheck className="h-4 w-4" />
								) : (
									<Bookmark className="h-4 w-4" />
								)}
							</Button>
						)}
					</div>

					<div className="mt-4">
						<p className="text-gray-700 leading-relaxed dark:text-gray-300">
							{language === "pl"
								? supplement.polishDescription
								: supplement.description}
						</p>
					</div>
				</CardHeader>

				<CardContent className="space-y-6">
					<Tabs value={state.activeTab} onValueChange={handleTabChange}>
						<TabsList className="grid w-full grid-cols-4">
							<TabsTrigger value="overview">
								{localization.t("tabs.overview", "Przegląd")}
							</TabsTrigger>
							<TabsTrigger value="brain-regions">
								{localization.t("tabs.brain-regions", "Regiony mózgu")}
							</TabsTrigger>
							<TabsTrigger value="research">
								{localization.t("tabs.research", "Badania")}
							</TabsTrigger>
							<TabsTrigger value="safety">
								{localization.t("tabs.safety", "Bezpieczeństwo")}
							</TabsTrigger>
						</TabsList>

						<TabsContent value="overview" className="space-y-4">
							<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
								<div>
									<h3 className="mb-3 flex items-center gap-2 font-semibold">
										<Info className="h-4 w-4" />
										{localization.t("sections.how-it-works", "Jak działa")}
									</h3>
									<p className="text-gray-600 text-sm dark:text-gray-400">
										{language === "pl"
											? supplement.educationalContent.polishHowItWorks
											: supplement.educationalContent.howItWorks}
									</p>
								</div>

								<div>
									<h3 className="mb-3 flex items-center gap-2 font-semibold">
										<Users className="h-4 w-4" />
										{localization.t("sections.evidence", "Dowody")}
									</h3>
									<div className="space-y-2 text-sm">
										<div className="flex justify-between">
											<span>
												{localization.t("evidence.studies", "Badania")}:
											</span>
											<span className="font-medium">
												{supplement.studyCount}
											</span>
										</div>
										<div className="flex justify-between">
											<span>
												{localization.t("evidence.participants", "Uczestnicy")}:
											</span>
											<span className="font-medium">
												{supplement.participantCount.toLocaleString()}
											</span>
										</div>
										<div className="flex justify-between">
											<span>
												{localization.t(
													"evidence.effect-size",
													"Wielkość efektu",
												)}
												:
											</span>
											<span className="font-medium">
												{supplement.effectSize}
											</span>
										</div>
									</div>
								</div>
							</div>
						</TabsContent>

						<TabsContent value="brain-regions" className="space-y-4">
							{showBrainVisualization && (
								<div className="mb-6">
									{/* Placeholder for BrainVisualization component */}
									<div className="flex h-64 w-full items-center justify-center rounded-lg border border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50 dark:border-blue-800 dark:from-blue-950 dark:to-purple-950">
										<div className="text-center">
											<Brain className="mx-auto mb-2 h-12 w-12 text-blue-500" />
											<p className="font-medium text-blue-600 dark:text-blue-400">
												{localization.t(
													"brain-visualization.title",
													"Wizualizacja mózgu",
												)}
											</p>
											<p className="mt-1 text-blue-500 text-sm dark:text-blue-300">
												{localization.t(
													"brain-visualization.description",
													"Interaktywna wizualizacja regionów mózgu",
												)}
											</p>
										</div>
									</div>
								</div>
							)}

							<div className="grid gap-4">
								<h3 className="font-semibold">
									{localization.t(
										"brain-regions.primary",
										"Główne regiony mózgu",
									)}
								</h3>

								<div className="grid gap-3">
									{supplement.primaryBrainRegions.map((region) => (
										<div
											key={region.id}
											className={`cursor-pointer rounded-lg border p-4 transition-colors ${
												state.selectedRegion?.id === region.id
													? "border-blue-500 bg-blue-50 dark:bg-blue-950"
													: "border-gray-200 hover:border-gray-300"
											}`}
											onClick={() => handleRegionClick(region)}
										>
											<div className="mb-2 flex items-center justify-between">
												<h4 className="font-medium">
													{language === "pl" ? region.polishName : region.name}
												</h4>
												<div
													className="h-4 w-4 rounded-full"
													style={{ backgroundColor: region.color }}
												/>
											</div>

											<p className="mb-2 text-gray-600 text-sm dark:text-gray-400">
												{language === "pl"
													? region.polishDescription
													: region.description}
											</p>

											<div className="flex flex-wrap gap-1">
												{region.supplementEffects.map((effect, index) => (
													<Badge
														key={index}
														variant="outline"
														className="text-xs"
													>
														{localization.t(
															`effect.${effect.type}`,
															effect.polishType,
														)}
													</Badge>
												))}
											</div>
										</div>
									))}
								</div>
							</div>
						</TabsContent>

						<TabsContent value="research" className="space-y-4">
							<Alert>
								<Info className="h-4 w-4" />
								<AlertDescription>
									{language === "pl"
										? supplement.educationalContent.polishResearchSummary
										: supplement.educationalContent.researchSummary}
								</AlertDescription>
							</Alert>

							<div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
								<div className="space-y-3">
									<h4 className="font-medium">
										{localization.t(
											"research.clinical-studies",
											"Badania kliniczne",
										)}
									</h4>
									<div className="space-y-2 text-sm">
										<div className="flex items-center gap-2">
											<CheckCircle className="h-4 w-4 text-green-500" />
											<span>
												{localization.t(
													"research.memory-improvement",
													"Poprawa pamięci",
												)}
											</span>
										</div>
										<div className="flex items-center gap-2">
											<CheckCircle className="h-4 w-4 text-green-500" />
											<span>
												{localization.t(
													"research.cognitive-enhancement",
													"Wzmacnianie funkcji poznawczych",
												)}
											</span>
										</div>
										<div className="flex items-center gap-2">
											<CheckCircle className="h-4 w-4 text-green-500" />
											<span>
												{localization.t(
													"research.anxiety-reduction",
													"Redukcja lęku",
												)}
											</span>
										</div>
									</div>
								</div>

								<div className="space-y-3">
									<h4 className="font-medium">
										{localization.t("research.study-designs", "Wzory badań")}
									</h4>
									<div className="space-y-2 text-sm">
										<div className="flex items-center gap-2">
											<Clock className="h-4 w-4 text-blue-500" />
											<span>
												{localization.t(
													"research.long-term-studies",
													"Długoterminowe badania (8-12 tygodni)",
												)}
											</span>
										</div>
										<div className="flex items-center gap-2">
											<Users className="h-4 w-4 text-blue-500" />
											<span>
												{localization.t(
													"research.large-samples",
													"Duże grupy badawcze",
												)}
											</span>
										</div>
										<div className="flex items-center gap-2">
											<Shield className="h-4 w-4 text-blue-500" />
											<span>
												{localization.t(
													"research.controlled-trials",
													"Kontrolowane badania kliniczne",
												)}
											</span>
										</div>
									</div>
								</div>
							</div>
						</TabsContent>

						<TabsContent value="safety" className="space-y-4">
							<Alert>
								<AlertTriangle className="h-4 w-4" />
								<AlertDescription>
									{language === "pl"
										? supplement.educationalContent.polishSafetyProfile
										: supplement.educationalContent.safetyProfile}
								</AlertDescription>
							</Alert>

							<div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
								<div>
									<h4 className="mb-3 font-medium">
										{localization.t(
											"safety.contraindications",
											"Przeciwwskazania",
										)}
									</h4>
									<ul className="space-y-1 text-sm">
										{(language === "pl"
											? supplement.polishContraindications
											: supplement.contraindications
										).map((item, index) => (
											<li key={index} className="flex items-center gap-2">
												<span className="h-1.5 w-1.5 rounded-full bg-red-500" />
												{item}
											</li>
										))}
									</ul>
								</div>

								<div>
									<h4 className="mb-3 font-medium">
										{localization.t("safety.side-effects", "Efekty uboczne")}
									</h4>
									<div className="space-y-2 text-sm">
										<div>
											<span className="font-medium text-orange-600">
												{localization.t("safety.common", "Częste")}:
											</span>
											<span className="ml-2">
												{supplement.sideEffects.common.join(", ")}
											</span>
										</div>
										<div>
											<span className="font-medium text-yellow-600">
												{localization.t("safety.uncommon", "Niezbyt częste")}:
											</span>
											<span className="ml-2">
												{supplement.sideEffects.uncommon.join(", ")}
											</span>
										</div>
									</div>
								</div>
							</div>
						</TabsContent>
					</Tabs>

					{showProgressTracking && (
						<div>
							{/* Placeholder for ProgressTracker component */}
							<div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950">
								<div className="mb-2 flex items-center justify-between">
									<h4 className="font-medium text-green-800 dark:text-green-200">
										{localization.t("progress.title", "Postęp nauki")}
									</h4>
									<span className="text-green-600 text-sm dark:text-green-400">
										{Math.round(state.progress)}%
									</span>
								</div>
								<Progress value={state.progress} className="mb-2" />
								<p className="text-green-700 text-sm dark:text-green-300">
									{localization.t(
										"progress.description",
										"Śledź swój postęp w nauce o suplementach",
									)}
								</p>
							</div>
						</div>
					)}

					{state.selectedRegion && (
						<div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950">
							<h4 className="mb-2 font-medium">
								{language === "pl"
									? state.selectedRegion.polishName
									: state.selectedRegion.name}
							</h4>
							<p className="mb-3 text-gray-600 text-sm dark:text-gray-400">
								{language === "pl"
									? state.selectedRegion.polishDescription
									: state.selectedRegion.description}
							</p>

							<div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
								<div>
									<h5 className="mb-1 font-medium">
										{localization.t("region.functions", "Funkcje")}
									</h5>
									<ul className="space-y-1">
										{(language === "pl"
											? state.selectedRegion.polishFunctions
											: state.selectedRegion.functions
										).map((func, index) => (
											<li key={index} className="flex items-center gap-2">
												<Zap className="h-3 w-3 text-blue-500" />
												{func}
											</li>
										))}
									</ul>
								</div>

								<div>
									<h5 className="mb-1 font-medium">
										{localization.t("region.effects", "Efekty suplementu")}
									</h5>
									<div className="space-y-2">
										{state.selectedRegion.supplementEffects.map(
											(effect, index) => (
												<div
													key={index}
													className="rounded border bg-white p-2 dark:bg-gray-800"
												>
													<div className="mb-1 flex items-center justify-between">
														<Badge variant="outline" className="text-xs">
															{localization.t(
																`effect.${effect.type}`,
																effect.polishType,
															)}
														</Badge>
														<span className="text-gray-500 text-xs">
															{effect.duration}
														</span>
													</div>
													<p className="text-gray-600 text-xs dark:text-gray-400">
														{language === "pl"
															? effect.polishMechanism
															: effect.mechanism}
													</p>
												</div>
											),
										)}
									</div>
								</div>
							</div>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
};

export default BrainSupplementCard;
