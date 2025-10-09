"use client";

import { Metadata } from "next";
import type React from "react";

// Enhanced metadata for educational knowledge graph page
export const metadata: Metadata = {
	title: "Graf Wiedzy Edukacyjnej - Interaktywna Nauka o Suplementach",
	description: "Interaktywny graf wiedzy edukacyjnej o suplementach. Ścieżki nauki, postępy i wizualizacje 3D mózgu dla efektywnej nauki o suplementacji.",
	keywords: [
		"graf wiedzy edukacyjnej",
		"interaktywna nauka",
		"ścieżki nauki suplementów",
		"wizualizacja wiedzy",
		"edukacja o suplementacji",
		"postęp w nauce",
		"3D mózg edukacja",
		"polska platforma edukacyjna",
		"kursy online suplementy",
		"materiały edukacyjne"
	],
	openGraph: {
		title: "Graf Wiedzy Edukacyjnej - Interaktywna Platforma Nauki",
		description: "Poznaj suplementy poprzez interaktywny graf wiedzy z ścieżkami nauki, postępami i wizualizacjami 3D mózgu.",
		type: "website",
		locale: "pl_PL",
		images: [
			{
				url: "/og-educational-graph.png",
				width: 1200,
				height: 630,
				alt: "Graf wiedzy edukacyjnej o suplementach",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Graf Wiedzy Edukacyjnej",
		description: "Interaktywna platforma nauki o suplementach z grafem wiedzy i ścieżkami edukacyjnymi.",
		images: ["/twitter-educational-graph.png"],
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
};
import { Suspense, useEffect, useState } from "react";

import { useGraphData } from "@/hooks/useGraphData";
import {
	AlertTriangle,
	BookOpen,
	Bookmark,
	Brain,
	Clock,
	Download,
	GraduationCap,
	HelpCircle,
	Info,
	Loader2,
	Moon,
	Network,
	RefreshCw,
	Settings,
	Share2,
	Target,
	TrendingDown,
	TrendingUp,
	Users,
	Zap,
} from "lucide-react";
import GraphDashboard from "../../../components/graph/GraphDashboard";
import { Alert, AlertDescription } from "../../../components/ui/alert";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "../../../components/ui/card";
import { Progress } from "../../../components/ui/progress";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "../../../components/ui/tabs";
import { TooltipProvider } from "../../../components/ui/tooltip";

// Import API utilities for data fetching
import { fetchGraphData } from "../../../utils/api";

// Educational content components
import EducationalOverlay from "../../../components/education/EducationalOverlay";
import LearningPath from "../../../components/education/LearningPath";
import ProgressTracker from "../../../components/education/ProgressTracker";

// Educational learning paths
const learningPaths = [
	{
		id: "basics",
		title: "Podstawy suplementacji",
		description: "Poznaj fundamenty suplementacji i ich wpływ na organizm",
		duration: "30 min",
		difficulty: "Początkujący",
		topics: [
			"Czym są suplementy",
			"Biodostępność",
			"Interakcje",
			"Bezpieczeństwo",
		],
	},
	{
		id: "nootropics",
		title: "Nootropiki i funkcje poznawcze",
		description: "Zgłęb świat nootropików i ich wpływ na mózg",
		duration: "45 min",
		difficulty: "Średniozaawansowany",
		topics: [
			"Neurotransmitery",
			"Plastyczność mózgu",
			"Pamięć",
			"Koncentracja",
		],
	},
	{
		id: "advanced",
		title: "Zaawansowane kombinacje",
		description: "Naucz się tworzyć skuteczne stosy suplementów",
		duration: "60 min",
		difficulty: "Zaawansowany",
		topics: ["Synergie", "Timing", "Cyklowanie", "Personalizacja"],
	},
];

const KnowledgeGraphEducationPage: React.FC = () => {
	const [activeTab, setActiveTab] = useState<"graph" | "learning" | "progress">(
		"graph",
	);
	const [selectedLearningPath, setSelectedLearningPath] = useState<
		string | null
	>(null);
	const [showEducationalOverlay, setShowEducationalOverlay] = useState(false);
	const [isFirstVisit, setIsFirstVisit] = useState(true);
	const [loadingProgress, setLoadingProgress] = useState(0);

	// Graph data with educational focus
	const { nodes, relationships, supplements, isLoading, error, refetch } =
		useGraphData();

	// Mock updateOptions function
	const updateOptions = (options: any) => {
		console.log("Update options called with:", options);
	};

	// Mock store functions
	const resetFilters = () => {};
	const setLayout = (layout: string) => {};
	const setViewMode = (mode: string) => {};
	const filters = {};
	const viewMode = "educational";

	// Mock educational content and user progress
	const educationalContent = {
		level: "beginner",
		language: "pl",
		content: "Mock educational content",
	};
	const isLoadingContent = false;

	const userProgress = {
		completedPaths: ["basics"],
		currentPath: "advanced",
		totalModules: 10,
		completedModules: 6,
		streakDays: 5,
		achievements: ["Pierwszy krok", "Konsekwentny uczeń"],
		level: "Średniozaawansowany",
		badges: ["Pierwszy krok", "Konsekwentny uczeń"],
	};

	// Initialize educational experience
	useEffect(() => {
		const hasVisited = localStorage.getItem("graph-education-visited");
		if (!hasVisited) {
			setShowEducationalOverlay(true);
			setIsFirstVisit(true);
			localStorage.setItem("graph-education-visited", "true");
		} else {
			setIsFirstVisit(false);
		}

		// Set educational-friendly defaults
		setLayout("hierarchical");
		setViewMode("overview");
		resetFilters();
	}, [setLayout, setViewMode, resetFilters]);

	// Simulate loading progress
	useEffect(() => {
		if (isLoading) {
			const interval = setInterval(() => {
				setLoadingProgress((prev) => {
					if (prev >= 90) {
						clearInterval(interval);
						return prev;
					}
					return prev + Math.random() * 10;
				});
			}, 200);

			return () => clearInterval(interval);
		}
		return undefined;
	}, [isLoading]);

	// Educational quick filters
	const handleEducationalFilter = (preset: string) => {
		resetFilters();

		switch (preset) {
			case "memory":
				updateOptions({
					includeSupplements: true,
					includeCognitiveFunctions: true,
					includeNeurotransmitters: true,
					includeBrainRegions: false,
					maxNodes: 150,
				});
				break;
			case "stress":
				updateOptions({
					includeSupplements: true,
					includeCognitiveFunctions: true,
					includeNeurotransmitters: true,
					includeBrainRegions: false,
					maxNodes: 150,
				});
				break;
			case "energy":
				updateOptions({
					includeSupplements: true,
					includeCognitiveFunctions: true,
					includeNeurotransmitters: true,
					includeBrainRegions: false,
					maxNodes: 150,
				});
				break;
			case "sleep":
				updateOptions({
					includeSupplements: true,
					includeCognitiveFunctions: true,
					includeNeurotransmitters: true,
					includeBrainRegions: false,
					maxNodes: 150,
				});
				break;
			default:
				updateOptions({
					includeSupplements: true,
					includeNeurotransmitters: true,
					includeBrainRegions: true,
					includeCognitiveFunctions: true,
					maxNodes: 300,
				});
		}

		refetch();
	};

	// Handle learning path selection
	const handleLearningPathSelect = (pathId: string) => {
		setSelectedLearningPath(pathId);
		setActiveTab("learning");

		// Track learning path selection (mock)
		console.log("Learning path selected:", pathId);
	};

	// Calculate statistics for educational display
	const stats = {
		totalNodes: nodes.length,
		totalRelationships: relationships.length,
		supplementNodes: nodes.filter(
			(n: { type: string }) => n.type === "supplement",
		).length,
		neurotransmitterNodes: nodes.filter(
			(n: { type: string }) => n.type === "neurotransmitter",
		).length,
		brainRegionNodes: nodes.filter(
			(n: { type: string }) => n.type === "brain_region",
		).length,
		strongEvidence: relationships.filter(
			(r: { evidenceLevel: string }) => r.evidenceLevel === "strong",
		).length,
		completionRate: userProgress
			? (userProgress.completedModules / userProgress.totalModules) * 100
			: 0,
	};

	if (error) {
		return (
			<TooltipProvider>
				<div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
					<Card className="w-full max-w-md">
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-red-600">
								<AlertTriangle className="h-5 w-5" />
								Błąd ładowania grafu wiedzy
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<Alert>
								<AlertTriangle className="h-4 w-4" />
								<AlertDescription>
									{error}. Sprawdź połączenie internetowe i spróbuj ponownie.
								</AlertDescription>
							</Alert>
							<Button onClick={() => refetch()} className="w-full">
								<RefreshCw className="mr-2 h-4 w-4" />
								Spróbuj ponownie
							</Button>
						</CardContent>
					</Card>
				</div>
			</TooltipProvider>
		);
	}

	return (
		<TooltipProvider>
			<div className="min-h-screen bg-gray-50">
				{/* Educational Overlay for First-Time Users */}
				{showEducationalOverlay && (
					<EducationalOverlay
						onClose={() => setShowEducationalOverlay(false)}
						onStartLearning={(pathId) => handleLearningPathSelect(pathId)}
					/>
				)}

				{/* Header with Educational Context */}
				<div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
					<div className="mx-auto max-w-7xl p-6">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-4">
								<div className="rounded-lg bg-white/20 p-3">
									<GraduationCap className="h-8 w-8" />
								</div>
								<div>
									<h1 className="font-bold text-2xl">
										Graf Wiedzy o Suplementach
									</h1>
									<p className="mt-1 text-blue-100">
										Interaktywna platforma edukacyjna - poznaj połączenia między
										suplementami a funkcjami mózgu
									</p>
								</div>
							</div>

							<div className="flex items-center gap-3">
								<Badge
									variant="secondary"
									className="border-white/30 bg-white/20 text-white"
								>
									Poziom: {userProgress?.level || "Początkujący"}
								</Badge>
								<Button
									variant="outline"
									className="border-white/30 text-white hover:bg-white/20"
								>
									<HelpCircle className="mr-2 h-4 w-4" />
									Pomoc
								</Button>
							</div>
						</div>

						{/* Progress Bar for Current Learning */}
						{userProgress?.currentPath && (
							<div className="mt-4 rounded-lg bg-white/10 p-3">
								<div className="mb-2 flex items-center justify-between">
									<span className="font-medium text-sm">
										Aktualny postęp: {userProgress.currentPath}
									</span>
									<span className="text-sm">
										{Math.round(stats.completionRate)}%
									</span>
								</div>
								<Progress value={stats.completionRate} className="h-2" />
							</div>
						)}
					</div>
				</div>

				{/* Loading State */}
				{isLoading && (
					<div className="border-b bg-white">
						<div className="mx-auto max-w-7xl p-4">
							<div className="flex items-center gap-4">
								<Loader2 className="h-5 w-5 animate-spin text-blue-600" />
								<div className="flex-1">
									<div className="mb-2 flex items-center justify-between">
										<span className="font-medium text-sm">
											Ładowanie grafu wiedzy...
										</span>
										<span className="text-gray-600 text-sm">
											{Math.round(loadingProgress)}%
										</span>
									</div>
									<Progress value={loadingProgress} className="h-2" />
								</div>
							</div>
						</div>
					</div>
				)}

				{/* Main Content Tabs */}
				<div className="mx-auto max-w-7xl p-4">
					<Tabs
						value={activeTab}
						onValueChange={(value) => setActiveTab(value as any)}
						className="space-y-4"
					>
						<TabsList className="grid w-full grid-cols-1 sm:grid-cols-3">
							<TabsTrigger value="graph" className="flex items-center gap-2">
								<Network className="h-4 w-4" />
								Graf Interaktywny
							</TabsTrigger>
							<TabsTrigger value="learning" className="flex items-center gap-2">
								<BookOpen className="h-4 w-4" />
								Ścieżki Nauki
							</TabsTrigger>
							<TabsTrigger value="progress" className="flex items-center gap-2">
								<Target className="h-4 w-4" />
								Twój Postęp
							</TabsTrigger>
						</TabsList>

						{/* Interactive Graph Tab */}
						<TabsContent value="graph" className="space-y-4">
							{/* Educational Quick Filters */}
							<Card>
								<CardHeader className="pb-3">
									<CardTitle className="flex items-center gap-2 text-lg">
										<Zap className="h-5 w-5" />
										Eksploruj według tematu
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
										<Button
											variant="outline"
											onClick={() => handleEducationalFilter("memory")}
											className="flex h-auto flex-col items-center gap-2 py-3"
										>
											<Brain className="h-5 w-5 text-purple-600" />
											<span className="text-sm">Pamięć</span>
										</Button>
										<Button
											variant="outline"
											onClick={() => handleEducationalFilter("stress")}
											className="flex h-auto flex-col items-center gap-2 py-3"
										>
											<TrendingDown className="h-5 w-5 text-red-600" />
											<span className="text-sm">Stres</span>
										</Button>
										<Button
											variant="outline"
											onClick={() => handleEducationalFilter("energy")}
											className="flex h-auto flex-col items-center gap-2 py-3"
										>
											<Zap className="h-5 w-5 text-yellow-600" />
											<span className="text-sm">Energia</span>
										</Button>
										<Button
											variant="outline"
											onClick={() => handleEducationalFilter("sleep")}
											className="flex h-auto flex-col items-center gap-2 py-3"
										>
											<Moon className="h-5 w-5 text-blue-600" />
											<span className="text-sm">Sen</span>
										</Button>
										<Button
											variant="outline"
											onClick={() => handleEducationalFilter("all")}
											className="flex h-auto flex-col items-center gap-2 py-3"
										>
											<Network className="h-5 w-5 text-green-600" />
											<span className="text-sm">Wszystko</span>
										</Button>
									</div>
								</CardContent>
							</Card>

							{/* Graph Dashboard */}
							<Suspense
								fallback={
									<Card className="flex h-96 items-center justify-center">
										<Loader2 className="h-8 w-8 animate-spin" />
									</Card>
								}
							>
								<GraphDashboard
									nodes={nodes}
									relationships={relationships}
									supplements={supplements}
									onDataLoad={(data) => {
										console.log("Graf edukacyjny zaktualizowany:", data);
									}}
									className="h-[600px]"
								/>
							</Suspense>
						</TabsContent>

						{/* Learning Paths Tab */}
						<TabsContent value="learning" className="space-y-4">
							{selectedLearningPath ? (
								<LearningPath
									pathId={selectedLearningPath}
									onBack={() => setSelectedLearningPath(null)}
									onComplete={(pathId) => {
										// Handle learning path completion (mock)
										console.log("Learning path completed:", pathId);
									}}
								/>
							) : (
								<div className="grid gap-6 md:grid-cols-3">
									{learningPaths.map((path) => (
										<Card
											key={path.id}
											className="cursor-pointer transition-shadow hover:shadow-lg"
										>
											<CardHeader>
												<div className="flex items-center justify-between">
													<CardTitle className="text-lg">
														{path.title}
													</CardTitle>
													<Badge
														variant={
															path.difficulty === "Początkujący"
																? "secondary"
																: path.difficulty === "Średniozaawansowany"
																	? "default"
																	: "destructive"
														}
													>
														{path.difficulty}
													</Badge>
												</div>
											</CardHeader>
											<CardContent className="space-y-4">
												<p className="text-gray-600">{path.description}</p>
												<div className="flex items-center gap-4 text-gray-500 text-sm">
													<span className="flex items-center gap-1">
														<Clock className="h-4 w-4" />
														{path.duration}
													</span>
													<span className="flex items-center gap-1">
														<BookOpen className="h-4 w-4" />
														{path.topics.length} tematów
													</span>
												</div>
												<div className="space-y-2">
													<h4 className="font-medium text-sm">Tematy:</h4>
													<div className="flex flex-wrap gap-1">
														{path.topics.slice(0, 3).map((topic, index) => (
															<Badge
																key={index}
																variant="outline"
																className="text-xs"
															>
																{topic}
															</Badge>
														))}
														{path.topics.length > 3 && (
															<Badge variant="outline" className="text-xs">
																+{path.topics.length - 3} więcej
															</Badge>
														)}
													</div>
												</div>
												<Button
													onClick={() => handleLearningPathSelect(path.id)}
													className="w-full"
												>
													Rozpocznij naukę
												</Button>
											</CardContent>
										</Card>
									))}
								</div>
							)}
						</TabsContent>

						{/* Progress Tab */}
						<TabsContent value="progress" className="space-y-4">
							<ProgressTracker
								userProgress={userProgress}
								onContinueLearning={(pathId) =>
									handleLearningPathSelect(pathId)
								}
							/>
						</TabsContent>
					</Tabs>
				</div>

				{/* Educational Stats Footer */}
				<div className="mt-8 border-t bg-white">
					<div className="mx-auto max-w-7xl p-4">
						<div className="grid grid-cols-2 gap-4 text-center md:grid-cols-6">
							<div>
								<div className="font-bold text-2xl text-blue-600">
									{stats.supplementNodes}
								</div>
								<div className="text-gray-600 text-xs">Suplementy</div>
							</div>
							<div>
								<div className="font-bold text-2xl text-purple-600">
									{stats.neurotransmitterNodes}
								</div>
								<div className="text-gray-600 text-xs">Neurotransmitery</div>
							</div>
							<div>
								<div className="font-bold text-2xl text-green-600">
									{stats.totalRelationships}
								</div>
								<div className="text-gray-600 text-xs">Połączenia</div>
							</div>
							<div>
								<div className="font-bold text-2xl text-orange-600">
									{stats.strongEvidence}
								</div>
								<div className="text-gray-600 text-xs">Silne dowody</div>
							</div>
							<div>
								<div className="font-bold text-2xl text-indigo-600">
									{Math.round(stats.completionRate)}%
								</div>
								<div className="text-gray-600 text-xs">Twój postęp</div>
							</div>
							<div>
								<div className="font-bold text-2xl text-pink-600">
									{userProgress?.badges?.length || 0}
								</div>
								<div className="text-gray-600 text-xs">Odznaki</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</TooltipProvider>
	);
};

export default KnowledgeGraphEducationPage;
