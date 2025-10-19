"use client";

/**
 * Enhanced Knowledge Base Page with Atomic Content Structure
 * Integrates latest 2025 scientific research with atomic knowledge organization
 */

import {
	EducationalOverlay,
	LearningPath,
	NeurotransmitterEducationModule,
	ProgressTracker,
} from "@/components/education";
import AtomicKnowledgePanel from "@/components/education/AtomicKnowledgePanel";
import {
	ConnectionVisualization,
	GraphControls,
	GraphDashboard,
	GraphExportImport,
	GraphLegend,
} from "@/components/graph";
import {
	CognitiveBiasDetector,
	HabitFormationTracker,
	ProductivityTechniqueBrowser,
} from "@/components/psychology";
import { AIRecommendationInterface } from "@/components/recommendations";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { enhancedKnowledgeAtoms } from "@/data/atoms/knowledge-base";
import { useGraphData } from "@/hooks/useGraphData";
import { useKnowledgeGraphStore } from "@/lib/stores/knowledge-graph-store";
import {
	Activity,
	Atom,
	Award,
	BookOpen,
	Brain,
	Download,
	Eye,
	EyeOff,
	FileText,
	Filter,
	GraduationCap,
	Lightbulb,
	Network,
	Pause,
	Play,
	RotateCcw,
	Search,
	Settings,
	Target,
	TrendingUp,
	Upload,
	User,
	Zap,
} from "lucide-react";
import Link from "next/link";
import React, { useState, useEffect } from "react";

// Enhanced educational content with latest 2025 research
const mockLearningPaths = [
	{
		id: "nootropic-basics",
		title: "Basics of Nootropics",
		polishTitle: "Podstawy nootropików",
		description: "Learn the fundamentals of cognitive enhancement",
		polishDescription: "Poznaj podstawy wzmacniania funkcji poznawczych",
		duration: "4 weeks",
		polishDuration: "4 tygodnie",
		difficulty: "BEGINNER",
		polishDifficulty: "Początkujący",
		modules: [
			{
				id: "module-1",
				title: "Introduction to Nootropics",
				polishTitle: "Wprowadzenie do nootropików",
				duration: "2 hours",
				polishDuration: "2 godziny",
				completed: true,
			},
			{
				id: "module-2",
				title: "Cholinergic Pathways",
				polishTitle: "Ścieżki cholinergiczne",
				duration: "3 hours",
				polishDuration: "3 godziny",
				completed: false,
			},
		],
	},
];

const mockTechniques = [
	{
		id: "pomodoro",
		name: "Pomodoro Technique",
		polishName: "Technika Pomodoro",
		category: "TIME_MANAGEMENT",
		polishCategory: "ZARZĄDZANIE CZASEM",
		description: "Work in focused intervals with short breaks",
		polishDescription:
			"Praca w skoncentrowanych odstępach z krótkimi przerwami",
		effectiveness: {
			averageImprovementPercentage: 25,
			userSatisfactionRating: 9,
			sustainabilityRating: 8,
		},
		supplementSynergies: [
			{
				supplementId: "lions-mane",
				supplementName: "Lion's Mane",
				polishSupplementName: "Soplówka jeżowata",
				synergyType: "ENHANCES",
				polishSynergyType: "WZMACNIA",
			},
		],
	},
] as any[];

const mockHabits = [
	{
		id: "morning-routine",
		habitType: "SUPPLEMENT_INTAKE",
		polishHabitType: "STOSOWANIE_SUPPLEMENTÓW",
		habitDetails: {
			name: "Morning Supplement Routine",
			polishName: "Poranna rutyna suplementów",
			description: "Take all morning supplements consistently",
			polishDescription: "Przyjmuj wszystkie poranne suplementy konsekwentnie",
			targetFrequency: "DAILY",
			polishTargetFrequency: "CODZIENNIE",
			difficulty: "EASY",
			polishDifficulty: "ŁATWY",
		},
		progress: {
			currentStreak: 15,
			completionRate: 95.7,
			totalCompletions: 45,
		},
	},
] as any[];

const mockCompletions: any[] = [];

// Mock 3D Brain component - replace with actual implementation when available
const Interactive3DBrainModel = ({
	onRegionSelect,
	onConnectionSelect,
}: {
	onRegionSelect?: (region: any) => void;
	onConnectionSelect?: (connection: any) => void;
}) => {
	return (
		<div className="flex h-full items-center justify-center rounded-lg border-2 border-gray-300 border-dashed">
			<div className="text-center">
				<Brain className="mx-auto h-12 w-12 text-gray-400" />
				<p className="mt-2 text-gray-500">Interaktywny model 3D mózgu</p>
				<p className="text-gray-400 text-sm">W przygotowaniu</p>
			</div>
		</div>
	);
};

const KnowledgeGraphPage = () => {
	const [activeTab, setActiveTab] = useState("graph");
	const [activeLearningPath, setActiveLearningPath] = useState<string | null>(
		null,
	);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedNode, setSelectedNode] = useState<string | null>(null);

	const { nodes, relationships, supplements, isLoading, error, refetch } =
		useGraphData({ autoFetch: true });

	const {
		filters,
		setFilters,
		layout,
		setLayout,
		showLabels,
		toggleShowLabels,
		isPlaying,
		togglePlay,
	} = useKnowledgeGraphStore();

	// Mock bias scenarios for the detector
	const biasScenarios = [
		{
			id: "confirmation-bias",
			title: "Confirmation Bias in Supplement Research",
			polishTitle: "Zafałszowanie potwierdzające w badaniach",
			description:
				"Tendency to search for, interpret, and remember information that confirms pre-existing beliefs",
			polishDescription:
				"Tendencja do szukania informacji potwierdzających istniejące przekonania",
			scenario:
				"You only read studies that support your belief about a supplement",
			polishScenario: "Czytasz tylko badania potwierdzające twoje przekonania",
			biasType: "CONFIRMATION_BIAS",
			polishBiasType: "Zafałszowanie potwierdzające",
			severity: "HIGH",
			polishSeverity: "WYSOKI",
			questions: [
				{
					id: "q1",
					question: "What cognitive bias is demonstrated in this scenario?",
					polishQuestion: "Jaki błąd poznawczy jest przedstawiony?",
					type: "MULTIPLE_CHOICE",
					options: [
						{
							id: "a",
							text: "Confirmation Bias",
							polishText: "Zafałszowanie potwierdzające",
							isCorrect: true,
							explanation:
								"This is confirmation bias - seeking information that confirms existing beliefs",
							polishExplanation:
								"To jest zafałszowanie potwierdzające - poszukiwanie informacji potwierdzających istniejące przekonania",
						},
					],
					points: 10,
				},
			],
			mitigation: {
				strategy: "Active open-mindedness",
				polishStrategy: "Aktywna otwartość umysłu",
				steps: [
					"Seek disconfirming evidence",
					"Consider alternative viewpoints",
				],
				polishSteps: [
					"Poszukuj dowodów przeciwstawnych",
					"Rozważ alternatywne punkty widzenia",
				],
			},
			supplementContext: {
				relevance: "Critical for objective supplement evaluation",
				polishRelevance: "Krytyczne dla obiektywnej oceny suplementów",
				preventionTips: [
					"Set up alerts for negative studies",
					"Use systematic review sources",
				],
				polishPreventionTips: [
					"Ustaw powiadomienia o negatywnych badaniach",
					"Używaj źródeł przeglądu systematycznego",
				],
			},
		},
	] as any[];

	const handleScenarioComplete = (
		scenarioId: string,
		responses: any[],
		score: number,
	) => {
		console.log(`Scenario ${scenarioId} completed with score ${score}`);
	};

	const handleBiasDetected = (biasType: string, severity: string) => {
		console.log(`Bias detected: ${biasType} (${severity})`);
	};

	const handleHabitCreate = (habit: Partial<any>) => {
		console.log("Creating new habit:", habit);
	};

	const handleHabitUpdate = (habitId: string, updates: Partial<any>) => {
		console.log(`Updating habit ${habitId}:`, updates);
	};

	const handleHabitDelete = (habitId: string) => {
		console.log(`Deleting habit ${habitId}`);
	};

	const handleCompletionToggle = (
		habitId: string,
		date: Date,
		completed: boolean,
		notes?: string,
	) => {
		console.log(
			`Toggling completion for habit ${habitId} on ${date}: ${completed}`,
		);
	};

	const handleTechniqueSelect = (techniqueId: string) => {
		console.log(`Selected technique: ${techniqueId}`);
	};

	const handleStartImplementation = (techniqueId: string) => {
		console.log(`Starting implementation of technique: ${techniqueId}`);
	};

	const handleLearningPathSelect = (pathId: string) => {
		setActiveLearningPath(pathId);
	};

	const handleLearningComplete = (pathId: string) => {
		console.log(`Learning path completed: ${pathId}`);
		setActiveLearningPath(null);
	};

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<header className="border-b bg-white">
				<div className="container mx-auto px-4 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<Brain className="h-8 w-8 text-blue-600" />
							<h1 className="font-bold text-2xl text-gray-900">Graf Wiedzy</h1>
						</div>
						<div className="flex items-center gap-4">
							<div className="relative">
								<Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform text-gray-400" />
								<input
									type="text"
									placeholder="Szukaj węzłów..."
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className="w-64 rounded-lg border py-2 pr-4 pl-10"
								/>
							</div>
							<Button variant="outline" size="sm">
								<Filter className="mr-2 h-4 w-4" />
								Filtry
							</Button>
							<Button variant="outline" size="sm" onClick={() => refetch()}>
								<RotateCcw className="h-4 w-4" />
							</Button>
						</div>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="container mx-auto px-4 py-8">
				<Tabs
					value={activeTab}
					onValueChange={setActiveTab}
					className="space-y-6"
				>
					<TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-8">
						<TabsTrigger value="graph" className="flex items-center gap-2">
							<Network className="h-4 w-4" />
							Graf
						</TabsTrigger>
						<TabsTrigger value="atoms" className="flex items-center gap-2">
							<Atom className="h-4 w-4" />
							Atomy
							<Badge variant="secondary" className="ml-1 text-xs">
								{enhancedKnowledgeAtoms.length}
							</Badge>
						</TabsTrigger>
						<TabsTrigger value="education" className="flex items-center gap-2">
							<BookOpen className="h-4 w-4" />
							Edukacja
						</TabsTrigger>
						<TabsTrigger value="bias" className="flex items-center gap-2">
							<Lightbulb className="h-4 w-4" />
							Błędy
						</TabsTrigger>
						<TabsTrigger value="habits" className="flex items-center gap-2">
							<Target className="h-4 w-4" />
							Nawyki
						</TabsTrigger>
						<TabsTrigger value="techniques" className="flex items-center gap-2">
							<Activity className="h-4 w-4" />
							Techniki
						</TabsTrigger>
						<TabsTrigger
							value="recommendations"
							className="flex items-center gap-2"
						>
							<Award className="h-4 w-4" />
							Rekomendacje
						</TabsTrigger>
						<TabsTrigger value="brain" className="flex items-center gap-2">
							<Brain className="h-4 w-4" />
							Mózg
						</TabsTrigger>
					</TabsList>

					{/* Quick Navigation Pills for Better UX */}
					<div className="mb-4 flex flex-wrap justify-center gap-2 sm:justify-start">
						<Link href="/wiedza/graf-wiedzy">
							<Button variant="outline" size="sm" className="gap-2">
								<GraduationCap className="h-4 w-4" />
								Graf Edukacyjny
							</Button>
						</Link>
						<Link href="/badania">
							<Button variant="outline" size="sm" className="gap-2">
								<FileText className="h-4 w-4" />
								Badania Naukowe
							</Button>
						</Link>
						<Link href="/mechanizmy">
							<Button variant="outline" size="sm" className="gap-2">
								<Activity className="h-4 w-4" />
								Mechanizmy Działania
							</Button>
						</Link>
						<Link href="/neuroprzekazniki">
							<Button variant="outline" size="sm" className="gap-2">
								<Zap className="h-4 w-4" />
								Neuroprzekaźniki
							</Button>
						</Link>
					</div>

					<TabsContent value="graph" className="space-y-6">
						<div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
							<div className="lg:col-span-3">
								<GraphDashboard
									nodes={nodes}
									relationships={relationships}
									supplements={supplements}
									isLoading={isLoading}
									error={error ? String(error) : null}
									onNodeSelect={(node) => setSelectedNode(node.id)}
									className="h-[600px]"
								/>
							</div>
							<div className="space-y-6">
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center justify-between">
											<span>Sterowanie</span>
											<div className="flex gap-2">
												<Button
													size="sm"
													variant={isPlaying ? "default" : "outline"}
													onClick={togglePlay}
												>
													{isPlaying ? (
														<Pause className="h-4 w-4" />
													) : (
														<Play className="h-4 w-4" />
													)}
												</Button>
												<Button
													size="sm"
													variant={showLabels ? "default" : "outline"}
													onClick={toggleShowLabels}
												>
													{showLabels ? (
														<Eye className="h-4 w-4" />
													) : (
														<EyeOff className="h-4 w-4" />
													)}
												</Button>
											</div>
										</CardTitle>
									</CardHeader>
									<CardContent>
										<GraphControls />
									</CardContent>
								</Card>

								<Card>
									<CardHeader>
										<CardTitle>Legenda</CardTitle>
									</CardHeader>
									<CardContent>
										<GraphLegend />
									</CardContent>
								</Card>

								{selectedNode && (
									<Card>
										<CardHeader>
											<CardTitle>Powiązania</CardTitle>
										</CardHeader>
										<CardContent>
											<ConnectionVisualization
												nodes={nodes}
												relationships={relationships}
												sourceNodeId={selectedNode}
												className="h-64"
											/>
										</CardContent>
									</Card>
								)}

								<Card>
									<CardHeader>
										<CardTitle className="flex items-center gap-2">
											<Download className="h-5 w-5" />
											Eksport/Import
										</CardTitle>
									</CardHeader>
									<CardContent>
										<GraphExportImport
											nodes={nodes}
											relationships={relationships}
											supplements={supplements}
											onImport={(data) => console.log("Imported data:", data)}
											onExport={() => console.log("Exporting data")}
										/>
									</CardContent>
								</Card>
							</div>
						</div>
					</TabsContent>

					<TabsContent value="education" className="space-y-6">
						<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<BookOpen className="h-5 w-5" />
										Ścieżki nauki
									</CardTitle>
								</CardHeader>
								<CardContent>
									<LearningPath
										pathId={activeLearningPath || "nootropic-basics"}
										onContinueLearning={() => console.log("Continue learning")}
										onComplete={handleLearningComplete}
									/>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<Brain className="h-5 w-5" />
										Moduł edukacyjny
									</CardTitle>
								</CardHeader>
								<CardContent>
									<NeurotransmitterEducationModule
										neurotransmitter={{
											id: "acetylcholine",
											name: "Acetylcholine",
											polishName: "Acetylocholina",
											description:
												"Primary neurotransmitter for memory and learning",
											polishDescription:
												"Główny neuroprzekaźnik dla pamięci i uczenia się",
											function: "Memory formation, muscle activation",
											polishFunction: "Tworzenie pamięci, aktywacja mięśni",
											pathways: ["Cholinergic pathway"],
											polishPathways: ["Ścieżka cholinergiczna"],
											relatedSupplements: ["Alpha-GPC", "CDP-Choline"],
										}}
										onModuleComplete={() => console.log("Module completed")}
									/>
								</CardContent>
							</Card>
						</div>

						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<TrendingUp className="h-5 w-5" />
									Śledzenie postępów
								</CardTitle>
							</CardHeader>
							<CardContent>
								<ProgressTracker
									progress={{
										completedModules: 3,
										totalModules: 12,
										learningTime: 45, // minutes
										completionRate: 75,
									}}
									onProgressUpdate={() => console.log("Progress updated")}
								/>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="bias" className="space-y-6">
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Lightbulb className="h-5 w-5" />
									Detektor błędów poznawczych
								</CardTitle>
							</CardHeader>
							<CardContent>
								<CognitiveBiasDetector
									scenarios={biasScenarios}
									onScenarioComplete={handleScenarioComplete}
									onBiasDetected={handleBiasDetected}
								/>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="habits" className="space-y-6">
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Target className="h-5 w-5" />
									Śledzenie nawyków
								</CardTitle>
							</CardHeader>
							<CardContent>
								<HabitFormationTracker
									habits={mockHabits}
									completions={mockCompletions}
									onHabitCreate={handleHabitCreate}
									onHabitUpdate={handleHabitUpdate}
									onHabitDelete={handleHabitDelete}
									onCompletionToggle={handleCompletionToggle}
									onCompletionUpdate={() => {}}
								/>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="techniques" className="space-y-6">
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Activity className="h-5 w-5" />
									Techniki produktywności
								</CardTitle>
							</CardHeader>
							<CardContent>
								<ProductivityTechniqueBrowser
									techniques={mockTechniques}
									onTechniqueSelect={handleTechniqueSelect}
									onStartImplementation={handleStartImplementation}
									userProgress={{
										implementedTechniques: ["pomodoro"],
										masteredTechniques: [],
										currentlyLearning: [],
									}}
								/>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="recommendations" className="space-y-6">
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Award className="h-5 w-5" />
									Rekomendacje AI
								</CardTitle>
							</CardHeader>
							<CardContent>
								<AIRecommendationInterface
									onRecommendationGenerated={(rec: unknown) =>
										console.log("Recommendation:", rec)
									}
									onRecommendationAccepted={(id: string) =>
										console.log("Accepted:", id)
									}
									onRecommendationRejected={(id: string) =>
										console.log("Rejected:", id)
									}
								/>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="brain" className="space-y-6">
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Brain className="h-5 w-5" />
									Interaktywny model mózgu
								</CardTitle>
							</CardHeader>
							<CardContent>
								<Interactive3DBrainModel
									onRegionSelect={(region: unknown) =>
										console.log("Selected region:", region)
									}
									onConnectionSelect={(conn: unknown) =>
										console.log("Selected connection:", conn)
									}
								/>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</main>

			{/* Footer */}
			<footer className="mt-12 border-t bg-white">
				<div className="container mx-auto px-4 py-6">
					<div className="flex flex-col items-center justify-between gap-4 md:flex-row">
						<div className="flex items-center gap-2">
							<Brain className="h-5 w-5 text-blue-600" />
							<span className="font-medium">Suplementor</span>
							<span className="text-gray-500 text-sm">© 2025</span>
						</div>
						<div className="flex items-center gap-4 text-gray-600 text-sm">
							<span>Ochrona prywatności</span>
							<span>Regulamin</span>
							<span>Pomoc</span>
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
};

export default KnowledgeGraphPage;
