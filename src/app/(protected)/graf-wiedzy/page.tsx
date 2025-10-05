/**
 * Protected Knowledge Graph Page
 * Advanced knowledge graph visualization for authenticated users
 */

"use client";

import { Interactive3DBrainModel } from "@/components/brain";
import {
	EducationalOverlay,
	LearningPath,
	NeurotransmitterEducationModule,
	ProgressTracker,
} from "@/components/education";
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
import { useGraphData } from "@/hooks/useGraphData";
import { useKnowledgeGraphStore } from "@/lib/stores/knowledge-graph-store";
import {
	Activity,
	Award,
	BarChart3,
	BookOpen,
	Brain,
	Download,
	Eye,
	EyeOff,
	Filter,
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
import React, { useState } from "react";

// Mock data for educational content
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

const ProtectedKnowledgeGraphPage = () => {
	const [activeTab, setActiveTab] = useState("graph");
	const [activeLearningPath, setActiveLearningPath] = useState<string | null>(
		null,
	);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedNode, setSelectedNode] = useState<string | null>(null);

	const { nodes, relationships, supplements, isLoading, error, refetch } =
		useGraphData({ autoFetch: true });

	const { filters, setFilters, layout, setLayout } = useKnowledgeGraphStore();

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
			severity: "HIGH" as const,
			polishSeverity: "WYSOKI",
			questions: [
				{
					id: "q1",
					question: "What cognitive bias is demonstrated in this scenario?",
					polishQuestion: "Jaki błąd poznawczy jest przedstawiony?",
					type: "MULTIPLE_CHOICE" as const,
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
				practicalTips: [
					"Read both positive and negative studies",
					"Consult multiple sources",
				],
				polishPracticalTips: [
					"Czytaj zarówno pozytywne jak i negatywne badania",
					"Konsultuj wiele źródeł",
				],
			},
			supplementContext: {
				relevance: "Critical for objective supplement evaluation",
				polishRelevance: "Krytyczne dla obiektywnej oceny suplementów",
				examples: ["Only reading positive reviews", "Ignoring side effects"],
				polishExamples: [
					"Czytanie tylko pozytywnych recenzji",
					"Ignorowanie skutków ubocznych",
				],
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
	];

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
							<h1 className="font-bold text-2xl text-gray-900">
								Zaawansowany Graf Wiedzy
							</h1>
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
							<Button variant="outline" size="sm">
								<User className="mr-2 h-4 w-4" />
								Profil
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
					<TabsList className="grid w-full grid-cols-7">
						<TabsTrigger value="graph" className="flex items-center gap-2">
							<Network className="h-4 w-4" />
							Graf
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

					<TabsContent value="graph" className="space-y-6">
						<div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
							<div className="lg:col-span-3">
								{isLoading ? (
									<div className="flex h-[600px] items-center justify-center">
										<div className="text-center">
											<div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-primary border-b-2" />
											<p>Ładowanie grafu wiedzy...</p>
										</div>
									</div>
								) : error ? (
									<div className="flex h-[600px] items-center justify-center">
										<div className="text-center text-red-600">
											<p>Błąd: {String(error)}</p>
										</div>
									</div>
								) : (
									<GraphDashboard
										nodes={nodes}
										relationships={relationships}
										supplements={supplements}
										className="h-[600px]"
									/>
								)}
							</div>
							<div className="space-y-6">
								<Card>
									<CardHeader>
										<CardTitle>Sterowanie</CardTitle>
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
										onComplete={handleLearningComplete}
										onBack={() => console.log("Back")}
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
									<NeurotransmitterEducationModule selectedNeurotransmitter="acetylcholine" />
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
									userProgress={{
										completedPaths: [],
										totalModules: 12,
										completedModules: 3,
										streakDays: 5,
										achievements: [],
									}}
									onContinueLearning={(pathId) =>
										console.log("Continue learning:", pathId)
									}
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
									habits={[]}
									completions={[]}
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
									techniques={[]}
									onTechniqueSelect={handleTechniqueSelect}
									onStartImplementation={handleStartImplementation}
									userProgress={{
										implementedTechniques: [],
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
								<AIRecommendationInterface />
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
								<Interactive3DBrainModel />
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

export default ProtectedKnowledgeGraphPage;
