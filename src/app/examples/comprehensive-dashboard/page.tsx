/**
 * Comprehensive Suplementor Dashboard Example
 * This page demonstrates how to integrate all the main components into a cohesive dashboard
 */

"use client";

import {
	AIRecommendationInterface,
	EducationalOverlay,
	LearningPath,
} from "@/components";
import { Interactive3DBrainModel } from "@/components/brain";
import {
	ConnectionVisualization,
	GraphControls,
	GraphDashboard,
	GraphLegend,
} from "@/components/graph";
import {
	CognitiveBiasDetector,
	HabitFormationTracker,
	ProductivityTechniqueBrowser,
} from "@/components/psychology";
import {
	ComprehensiveSupplementCard,
	EnhancedSupplementDashboard,
	SupplementSelector,
} from "@/components/supplements";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { comprehensiveSupplementsDatabase } from "@/data/comprehensive-supplements";
import { useGraphData } from "@/hooks/useGraphData";
import { useKnowledgeGraphStore } from "@/lib/stores/knowledge-graph-store";
import {
	Activity,
	Award,
	BarChart3,
	BookOpen,
	Brain,
	Calendar,
	Clock,
	Lightbulb,
	Network,
	Pill,
	Settings,
	Target,
	TrendingUp,
	User,
	Zap,
} from "lucide-react";
import React, { useState, useEffect } from "react";

// Use real supplement data from the comprehensive database
const mockSupplements = comprehensiveSupplementsDatabase.slice(0, 5); // Use first 5 supplements as examples

const mockHabits = [
	{
		id: "morning-routine",
		userId: "user-1",
		habitType: "SUPPLEMENT_INTAKE",
		polishHabitType: "Stosowanie suplementów",
		habitDetails: {
			name: "Morning Supplement Routine",
			polishName: "Poranna rutyna suplementów",
			description: "Take all morning supplements consistently",
			polishDescription: "Przyjmuj wszystkie poranne suplementy konsekwentnie",
			targetFrequency: "DAILY",
			polishTargetFrequency: "Codziennie",
			estimatedDuration: 2,
			difficulty: "EASY",
			polishDifficulty: "Łatwy",
		},
		formationStrategy: {
			technique: "HABIT_STACKING",
			polishTechnique: "Stosowanie nawyków",
			cue: "After brushing teeth",
			polishCue: "Po szczotkowaniu zębów",
			routine: "Take Alpha-GPC, Lion's Mane, and Magnesium",
			polishRoutine: "Przyjmij Alfa-GPC, Soplówkę jeżowatą i Magnez",
			reward: "Feel mentally prepared for the day",
			polishReward: "Poczuj się psychicznie przygotowany na dzień",
			environmentalTriggers: ["Supplement organizer on bathroom counter"],
			polishEnvironmentalTriggers: ["Organizer suplementów na blacie łazienki"],
		},
		progress: {
			startDate: new Date(),
			targetCompletionDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
			currentStreak: 15,
			longestStreak: 22,
			totalCompletions: 45,
			missedDays: 2,
			completionRate: 95.7,
			weeklyProgress: [
				{
					week: 1,
					completions: 7,
					target: 7,
					notes: "Perfect week",
					polishNotes: "Idealny tydzień",
				},
			],
		},
		relatedSupplements: [
			{
				supplementId: "alpha-gpc",
				supplementName: "Alpha-GPC",
				polishSupplementName: "Alfa-GPC",
				relationship: "SUPPORTS_HABIT",
				polishRelationship: "Wspiera nawyk",
			},
		],
		relatedTechniques: [],
		insights: {
			bestPerformanceTimes: ["Morning after breakfast"],
			polishBestPerformanceTimes: ["Rano po śniadaniu"],
			challengingScenarios: ["Busy mornings", "Traveling"],
			polishChallengingScenarios: ["Zajęte poranki", "Podróże"],
			motivationalFactors: ["Improved focus", "Better sleep"],
			polishMotivationalFactors: ["Poprawione skupienie", "Lepszy sen"],
			barriers: ["Forgetting", "Running out of supplements"],
			polishBarriers: ["Zapominanie", "Brak suplementów"],
		},
		isActive: true,
		lastUpdated: new Date(),
		completedAt: undefined,
	},
] as any[];

const mockCompletions: any[] = [];

const mockTechniques = [
	{
		id: "pomodoro",
		name: "Pomodoro Technique",
		polishName: "Technika Pomodoro",
		category: "TIME_MANAGEMENT",
		polishCategory: "Zarządzanie czasem",
		description: "Work in focused intervals with short breaks",
		polishDescription:
			"Praca w skoncentrowanych odstępach czasu z krótkimi przerwami",

		methodology: {
			overview: "Work for 25 minutes, then take a 5-minute break",
			polishOverview:
				"Pracuj przez 25 minut, a następnie zrób 5-minutową przerwę",
			steps: [
				{
					stepNumber: 1,
					title: "Choose a task",
					polishTitle: "Wybierz zadanie",
					description: "Select a specific task to work on",
					polishDescription: "Wybierz konkretne zadanie do pracy",
					tips: ["Be specific about what you want to accomplish"],
					polishTips: ["Bądź konkretny co chcesz osiągnąć"],
				},
			],
			requirements: ["Timer", "Task list"],
			polishRequirements: ["Minutnik", "Lista zadań"],
			tools: ["Physical timer", "Digital timer app"],
			polishTools: ["Minutnik fizyczny", "Aplikacja zegara cyfrowego"],
		},

		scientificBasis: {
			psychologicalPrinciples: ["Time-boxing", "Focus enhancement"],
			polishPsychologicalPrinciples: [
				"Ograniczanie czasu",
				"Wzmacnianie skupienia",
			],
			neuroscienceEvidence: "Short work intervals prevent cognitive fatigue",
			polishNeuroscienceEvidence:
				"Krótkie odstępy pracy zapobiegają zmęczeniu poznawczemu",
			researchStudies: [
				{
					title: "Effect of time-boxing on task completion",
					polishTitle: "Efekt ograniczania czasu na wykonanie zadań",
					authors: ["Smith J", "Jones M"],
					year: 2020,
					findings: "Time-boxing significantly improved task completion rates",
					polishFindings:
						"Ograniczanie czasu znacząco poprawiło tempo wykonania zadań",
					evidenceLevel: "STRONG",
				},
			],
			evidenceLevel: "STRONG",
			polishEvidenceLevel: "Silne",
		},

		implementation: {
			gettingStarted: "Start with one 25-minute session per day",
			polishGettingStarted: "Zacznij od jednej sesji 25-minutowej dziennie",
			commonMistakes: ["Skipping breaks", "Overextending work sessions"],
			polishCommonMistakes: ["Pomijanie przerw", "Przedłużanie sesji pracy"],
			troubleshooting: [
				{
					problem: "Difficulty focusing for 25 minutes",
					polishProblem: "Trudności z skupieniem przez 25 minut",
					solution: "Start with shorter intervals (15 minutes)",
					polishSolution: "Zacznij od krótszych odstępów (15 minut)",
				},
			],
			adaptations: [
				{
					situation: "Complex tasks requiring deep focus",
					polishSituation: "Złożone zadania wymagające głębokiego skupienia",
					modification: "Use 50-minute intervals with 10-minute breaks",
					polishModification:
						"Użyj 50-minutowych odstępów z 10-minutowymi przerwami",
				},
			],
		},

		effectiveness: {
			averageImprovementPercentage: 25,
			timeToSeeResults: "1-2 weeks",
			polishTimeToSeeResults: "1-2 tygodnie",
			sustainabilityRating: 8,
			difficultyRating: 2,
			userSatisfactionRating: 9,
			applicabilityScenarios: ["Studying", "Writing", "Programming"],
			polishApplicabilityScenarios: ["Nauka", "Pisanie", "Programowanie"],
		},

		supplementSynergies: [
			{
				supplementId: "lions-mane",
				supplementName: "Lion's Mane",
				polishSupplementName: "Soplówka jeżowata",
				synergyType: "ENHANCES",
				polishSynergyType: "Wzmacnia",
				description: "May enhance focus during Pomodoro sessions",
				polishDescription: "Może wzmacniać skupienie podczas sesji Pomodoro",
				recommendedTiming: "30 minutes before starting",
				polishRecommendedTiming: "30 minut przed rozpoczęciem",
			},
		],

		trackingMetrics: [
			{
				metric: "Sessions completed",
				polishMetric: "Sesje ukończone",
				measurementMethod: "Count of 25-minute intervals",
				polishMeasurementMethod: "Liczba 25-minutowych odstępów",
				frequency: "Daily",
				polishFrequency: "Dziennie",
				targetImprovement: "Increase by 2 sessions per day",
				polishTargetImprovement: "Zwiększ o 2 sesje dziennie",
			},
		],

		relatedTechniques: ["Time blocking", "Deep work"],
		prerequisites: [],
		polishPrerequisites: [],
		tags: ["focus", "productivity", "time management"],
		polishTags: ["skupienie", "produktywność", "zarządzanie czasem"],
		difficultyLevel: "BEGINNER",
		estimatedTimeToMaster: 30,
		isActive: true,
	},
] as any[];

const ComprehensiveDashboard = () => {
	const [activeTab, setActiveTab] = useState("dashboard");
	const [selectedSupplement, setSelectedSupplement] = useState(
		comprehensiveSupplementsDatabase[0] || null,
	);

	const { nodes, relationships, supplements, isLoading, error, refetch } =
		useGraphData({ autoFetch: true });

	// Mock bias scenarios for the detector
	const biasScenarios = [
		{
			id: "confirmation-bias",
			title: "Confirmation Bias in Supplement Research",
			polishTitle: "Zafałszowanie potwierdzające w badaniach nad suplementami",
			description:
				"Tendency to search for, interpret, and remember information that confirms pre-existing beliefs",
			polishDescription:
				"Tendencja do wyszukiwania, interpretowania i zapamiętywania informacji potwierdzających istniejące przekonania",
			scenario:
				"You only read studies that support your belief about a supplement",
			polishScenario:
				"Czytasz tylko badania potwierdzające twoje przekonania o suplemencie",
			biasType: "CONFIRMATION_BIAS",
			polishBiasType: "Zafałszowanie potwierdzające",
			severity: "HIGH",
			polishSeverity: "Wysoka",
			questions: [
				{
					id: "q1",
					question: "What cognitive bias is demonstrated in this scenario?",
					polishQuestion:
						"Jaki błąd poznawczy jest przedstawiony w tym scenariuszu?",
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
				practicalTips: [
					"Read studies with opposing conclusions",
					"Discuss with people who disagree",
				],
				polishPracticalTips: [
					"Czytaj badania z przeciwnymi wnioskami",
					"Dyskutuj z osobami, które nie zgadzają się",
				],
			},
			supplementContext: {
				relevance: "Critical for objective supplement evaluation",
				polishRelevance: "Krytyczne dla obiektywnej oceny suplementów",
				examples: [
					"Only reading positive reviews",
					"Ignoring contraindications",
				],
				polishExamples: [
					"Czytanie tylko pozytywnych recenzji",
					"Ignorowanie przeciwwskazań",
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

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<header className="border-b bg-white">
				<div className="container mx-auto px-4 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<Brain className="h-8 w-8 text-blue-600" />
							<h1 className="font-bold text-2xl text-gray-900">
								Suplementor Dashboard
							</h1>
						</div>
						<div className="flex items-center gap-4">
							<Badge variant="outline" className="flex items-center gap-1">
								<Zap className="h-4 w-4" />
								Premium
							</Badge>
							<Button variant="outline" size="sm">
								<Settings className="mr-2 h-4 w-4" />
								Ustawienia
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
					<TabsList className="grid w-full grid-cols-6">
						<TabsTrigger value="dashboard" className="flex items-center gap-2">
							<BarChart3 className="h-4 w-4" />
							Dashboard
						</TabsTrigger>
						<TabsTrigger
							value="supplements"
							className="flex items-center gap-2"
						>
							<Pill className="h-4 w-4" />
							Suplementy
						</TabsTrigger>
						<TabsTrigger value="graph" className="flex items-center gap-2">
							<Network className="h-4 w-4" />
							Graf Wiedzy
						</TabsTrigger>
						<TabsTrigger value="habits" className="flex items-center gap-2">
							<Target className="h-4 w-4" />
							Nawyki
						</TabsTrigger>
						<TabsTrigger value="techniques" className="flex items-center gap-2">
							<Lightbulb className="h-4 w-4" />
							Techniki
						</TabsTrigger>
						<TabsTrigger value="education" className="flex items-center gap-2">
							<BookOpen className="h-4 w-4" />
							Edukacja
						</TabsTrigger>
					</TabsList>

					<TabsContent value="dashboard" className="space-y-6">
						<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
							{/* Summary Cards */}
							<Card className="lg:col-span-2">
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<TrendingUp className="h-5 w-5" />
										Podsumowanie postępów
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="grid grid-cols-2 gap-4">
										<div className="rounded-lg bg-blue-50 p-4">
											<div className="font-bold text-2xl text-blue-600">15</div>
											<div className="text-blue-700 text-sm">Dni z rzędu</div>
											<Progress value={75} className="mt-2 h-2" />
										</div>
										<div className="rounded-lg bg-green-50 p-4">
											<div className="font-bold text-2xl text-green-600">
												95%
											</div>
											<div className="text-green-700 text-sm">Skuteczność</div>
											<Progress value={95} className="mt-2 h-2" />
										</div>
										<div className="rounded-lg bg-purple-50 p-4">
											<div className="font-bold text-2xl text-purple-600">
												7
											</div>
											<div className="text-purple-700 text-sm">Nawyki</div>
											<Progress value={60} className="mt-2 h-2" />
										</div>
										<div className="rounded-lg bg-orange-50 p-4">
											<div className="font-bold text-2xl text-orange-600">
												23
											</div>
											<div className="text-orange-700 text-sm">Techniki</div>
											<Progress value={40} className="mt-2 h-2" />
										</div>
									</div>
								</CardContent>
							</Card>

							{/* Active Supplement */}
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<Pill className="h-5 w-5" />
										Aktywny suplement
									</CardTitle>
								</CardHeader>
								<CardContent>
									{selectedSupplement ? (
										<div className="space-y-4">
											<div className="flex items-center gap-3">
												<div className="rounded-lg bg-blue-100 p-2">
													<Pill className="h-6 w-6 text-blue-600" />
												</div>
												<div>
													<h3 className="font-semibold">
														{selectedSupplement.polishName}
													</h3>
													<p className="text-gray-600 text-sm">
														{selectedSupplement.category}
													</p>
												</div>
											</div>
											<p className="line-clamp-2 text-gray-700 text-sm">
												{selectedSupplement.polishDescription}
											</p>
											<Badge variant="outline">
												{selectedSupplement.evidenceLevel}
											</Badge>
											<div className="pt-2">
												<Button
													className="w-full"
													onClick={() => setActiveTab("supplements")}
												>
													Szczegóły
												</Button>
											</div>
										</div>
									) : (
										<div className="py-8 text-center text-gray-500">
											Wybierz suplement
										</div>
									)}
								</CardContent>
							</Card>
						</div>

						{/* Supplement Dashboard */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Pill className="h-5 w-5" />
									Panel suplementów
								</CardTitle>
							</CardHeader>
							<CardContent>
								<EnhancedSupplementDashboard />
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="supplements" className="space-y-6">
						<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
							<Card className="lg:col-span-1">
								<CardHeader>
									<CardTitle>Wybierz suplement</CardTitle>
								</CardHeader>
								<CardContent>
									<SupplementSelector
										supplements={mockSupplements}
										selectedSupplement={selectedSupplement?.id || ""}
										onSelect={(supplementId) => {
											const supplement = mockSupplements.find(
												(s) => s.id === supplementId,
											);
											if (supplement) setSelectedSupplement(supplement);
										}}
									/>
								</CardContent>
							</Card>

							<Card className="lg:col-span-2">
								<CardHeader>
									<CardTitle>Szczegóły suplementu</CardTitle>
								</CardHeader>
								<CardContent>
									{selectedSupplement && (
										<ComprehensiveSupplementCard
											supplement={selectedSupplement}
										/>
									)}
								</CardContent>
							</Card>
						</div>
					</TabsContent>

					<TabsContent value="graph" className="space-y-6">
						<div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
							<div className="lg:col-span-3">
								<GraphDashboard
									nodes={nodes}
									relationships={relationships}
									supplements={supplements}
									isLoading={isLoading}
									error={error ? String(error) : null}
									className="h-[600px]"
								/>
							</div>
							<div className="space-y-6">
								<Card>
									<CardHeader>
										<CardTitle>Legenda</CardTitle>
									</CardHeader>
									<CardContent>
										<GraphLegend />
									</CardContent>
								</Card>
								<Card>
									<CardHeader>
										<CardTitle>Sterowanie</CardTitle>
									</CardHeader>
									<CardContent>
										<GraphControls />
									</CardContent>
								</Card>
							</div>
						</div>
					</TabsContent>

					<TabsContent value="habits" className="space-y-6">
						<HabitFormationTracker
							habits={mockHabits}
							completions={mockCompletions}
							onHabitCreate={handleHabitCreate}
							onHabitUpdate={handleHabitUpdate}
							onHabitDelete={handleHabitDelete}
							onCompletionToggle={handleCompletionToggle}
							onCompletionUpdate={() => {}}
						/>
					</TabsContent>

					<TabsContent value="techniques" className="space-y-6">
						<div className="space-y-6">
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
						</div>
					</TabsContent>

					<TabsContent value="education" className="space-y-6">
						<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
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

							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<BookOpen className="h-5 w-5" />
										Ścieżki nauki
									</CardTitle>
								</CardHeader>
								<CardContent>
									<LearningPath
										pathId="nootropic-basics"
										onContinueLearning={() => console.log("Continue learning")}
										onComplete={() => console.log("Path completed")}
									/>
								</CardContent>
							</Card>
						</div>
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

export default ComprehensiveDashboard;
