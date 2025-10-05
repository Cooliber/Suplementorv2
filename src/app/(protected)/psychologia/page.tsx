/**
 * Psychology Dashboard Page for Protected Route
 * This page provides psychology-based tools for cognitive enhancement
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
import {
	Activity,
	Award,
	BarChart3,
	BookOpen,
	Brain,
	Calendar,
	CheckCircle,
	Clock,
	Eye,
	EyeOff,
	Lightbulb,
	Pause,
	Play,
	RotateCcw,
	Star,
	Target,
	TrendingUp,
	User,
	XCircle,
	Zap,
} from "lucide-react";
import React, { useState } from "react";

// Mock data for psychology tools
const mockBiasScenarios = [
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
		polishSeverity: "Wysoki",
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
			steps: ["Seek disconfirming evidence", "Consider alternative viewpoints"],
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
			examples: ["Only reading positive reviews", "Ignoring contraindications"],
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
	{
		id: "availability-heuristic",
		title: "Availability Heuristic in Risk Assessment",
		polishTitle: "Heurystyka dostępności w ocenie ryzyka",
		description:
			"Tendency to judge the likelihood of events by how easily examples come to mind",
		polishDescription:
			"Tendencja do oceny prawdopodobieństwa zdarzeń przez to, jak łatwo przychodzą przykłady do głowy",
		scenario:
			"You judge a supplement as dangerous because you remember one dramatic news story about it",
		polishScenario:
			"Oceniasz suplement jako niebezpieczny, ponieważ pamiętasz jedną dramatyczną wiadomość o nim",
		biasType: "AVAILABILITY_HEURISTIC",
		polishBiasType: "Heurystyka dostępności",
		severity: "MODERATE",
		polishSeverity: "Umiarkowany",
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
						text: "Availability Heuristic",
						polishText: "Heurystyka dostępności",
						isCorrect: true,
						explanation:
							"This is availability heuristic - judging likelihood by how easily examples come to mind",
						polishExplanation:
							"To jest heurystyka dostępności - ocena prawdopodobieństwa przez to, jak łatwo przychodzą przykłady do głowy",
					},
				],
				points: 10,
			},
		],
		mitigation: {
			strategy: "Statistical reasoning",
			polishStrategy: "Rozumowanie statystyczne",
			steps: [
				"Look up actual incidence rates",
				"Consider base rates in the population",
				"Distinguish between memorable and common events",
				"Use data rather than anecdotes",
			],
			polishSteps: [
				"Sprawdź rzeczywiste stopy występowania",
				"Rozważ stopy bazowe w populacji",
				"Rozróżnij zapamiętane i powszechne zdarzenia",
				"Używaj danych zamiast anegdot",
			],
			practicalTips: [
				"Consult scientific databases",
				"Look for systematic reviews",
				"Be aware of media bias",
				"Consider your own memory biases",
			],
			polishPracticalTips: [
				"Konsultuj się z bazami danych naukowych",
				"Szukaj przeglądów systematycznych",
				"Bądź świadomy stronniczości mediów",
				"Rozważ swoje własne zafałszowania pamięciowe",
			],
		},
		supplementContext: {
			relevance: "Important for balanced supplement risk assessment",
			polishRelevance: "Ważne dla zrównoważonej oceny ryzyka suplementów",
			examples: [
				"Fearing supplements after a news story",
				"Overestimating benefits based on friend's experience",
				"Focusing on severe side effects in reviews",
				"Ignoring common mild benefits",
			],
			polishExamples: [
				"Lęki przed suplementami po wiadomości",
				"Przesadzanie korzyści na podstawie doświadczenia znajomego",
				"Koncentrowanie się na ciężkich skutkach ubocznych w recenzjach",
				"Ignorowanie powszechnych łagodnych korzyści",
			],
			preventionTips: [
				"Check multiple sources",
				"Look for aggregate data",
				"Consider sample sizes",
				"Distinguish between rare and common effects",
			],
			polishPreventionTips: [
				"Sprawdzaj wiele źródeł",
				"Szukaj danych agregatowych",
				"Rozważaj wielkości prób",
				"Rozróżnij rzadkie i powszechne efekty",
			],
		},
	},
];

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
];

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
];

const mockLearningPaths = [
	{
		id: "cognitive-bias-mastery",
		title: "Mastering Cognitive Biases",
		polishTitle: "Mistrzostwo błędów poznawczych",
		description:
			"Comprehensive course on identifying and mitigating cognitive biases",
		polishDescription:
			"Kompleksowy kurs z identyfikowania i ograniczania błędów poznawczych",
		duration: "6 weeks",
		polishDuration: "6 tygodni",
		difficulty: "INTERMEDIATE",
		polishDifficulty: "Średni",
		modules: [
			{
				id: "module-1",
				title: "Introduction to Cognitive Biases",
				polishTitle: "Wprowadzenie do błędów poznawczych",
				duration: "2 hours",
				polishDuration: "2 godziny",
				completed: true,
			},
			{
				id: "module-2",
				title: "Common Biases in Decision Making",
				polishTitle: "Powszechne błędy w podejmowaniu decyzji",
				duration: "3 hours",
				polishDuration: "3 godziny",
				completed: true,
			},
			{
				id: "module-3",
				title: "Mitigation Strategies",
				polishTitle: "Strategie ograniczania",
				duration: "4 hours",
				polishDuration: "4 godziny",
				completed: false,
			},
		],
	},
];

const PsychologyDashboardPage = () => {
	const [activeTab, setActiveTab] = useState("bias");
	const [activeLearningPath, setActiveLearningPath] = useState<string | null>(
		null,
	);
	const [selectedTechnique, setSelectedTechnique] = useState<string | null>(
		null,
	);
	const [isPlaying, setIsPlaying] = useState(true);

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
		setSelectedTechnique(techniqueId);
		setActiveTab("techniques");
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
								Psychologia Produktywności
							</h1>
						</div>
						<div className="flex items-center gap-4">
							<Badge variant="outline" className="flex items-center gap-1">
								<Zap className="h-4 w-4" />
								Ekspert
							</Badge>
							<Button size="sm">
								<Play className="mr-2 h-4 w-4" />
								Rozpocznij sesję
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
					<TabsList className="grid w-full grid-cols-5">
						<TabsTrigger value="bias" className="flex items-center gap-2">
							<Lightbulb className="h-4 w-4" />
							Błędy poznawcze
						</TabsTrigger>
						<TabsTrigger value="habits" className="flex items-center gap-2">
							<Target className="h-4 w-4" />
							Nawyki
						</TabsTrigger>
						<TabsTrigger value="techniques" className="flex items-center gap-2">
							<Activity className="h-4 w-4" />
							Techniki
						</TabsTrigger>
						<TabsTrigger value="education" className="flex items-center gap-2">
							<BookOpen className="h-4 w-4" />
							Edukacja
						</TabsTrigger>
						<TabsTrigger value="analytics" className="flex items-center gap-2">
							<BarChart3 className="h-4 w-4" />
							Analityka
						</TabsTrigger>
					</TabsList>

					<TabsContent value="bias" className="space-y-6">
						<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
							<div className="lg:col-span-2">
								<CognitiveBiasDetector
									scenarios={[]}
									onScenarioComplete={handleScenarioComplete}
									onBiasDetected={handleBiasDetected}
								/>
							</div>

							<div className="space-y-6">
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center gap-2">
											<TrendingUp className="h-5 w-5" />
											Postęp w nauce
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="space-y-4">
											<div className="flex items-center justify-between">
												<span>Scenariusze ukończone</span>
												<span className="font-medium">2/5</span>
											</div>
											<Progress value={40} className="h-2" />

											<div className="flex items-center justify-between">
												<span>Błędy identyfikowane</span>
												<span className="font-medium">3</span>
											</div>
											<Progress value={60} className="h-2" />

											<div className="flex items-center justify-between">
												<span>Skuteczność</span>
												<span className="font-medium">78%</span>
											</div>
											<Progress value={78} className="h-2" />
										</div>
									</CardContent>
								</Card>

								<Card>
									<CardHeader>
										<CardTitle className="flex items-center gap-2">
											<Award className="h-5 w-5" />
											Osiągnięcia
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="space-y-3">
											<div className="flex items-center gap-2">
												<CheckCircle className="h-5 w-5 text-green-500" />
												<span className="text-sm">Początkujący detektyw</span>
												<Badge variant="secondary" className="ml-auto">
													1/5
												</Badge>
											</div>
											<div className="flex items-center gap-2">
												<CheckCircle className="h-5 w-5 text-green-500" />
												<span className="text-sm">Mitigator</span>
												<Badge variant="secondary" className="ml-auto">
													2/5
												</Badge>
											</div>
											<div className="flex items-center gap-2">
												<XCircle className="h-5 w-5 text-gray-400" />
												<span className="text-sm">Mistrz poznania</span>
												<Badge variant="outline" className="ml-auto">
													0/5
												</Badge>
											</div>
										</div>
									</CardContent>
								</Card>
							</div>
						</div>
					</TabsContent>

					<TabsContent value="habits" className="space-y-6">
						<HabitFormationTracker
							habits={[]}
							completions={[]}
							onHabitCreate={handleHabitCreate}
							onHabitUpdate={handleHabitUpdate}
							onHabitDelete={handleHabitDelete}
							onCompletionToggle={handleCompletionToggle}
							onCompletionUpdate={() => {}}
						/>
					</TabsContent>

					<TabsContent value="techniques" className="space-y-6">
						<ProductivityTechniqueBrowser
							techniques={[]}
							onTechniqueSelect={handleTechniqueSelect}
							onStartImplementation={handleStartImplementation}
							userProgress={{
								implementedTechniques: ["pomodoro"],
								masteredTechniques: [],
								currentlyLearning: ["time-blocking"],
							}}
						/>
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
										pathId={activeLearningPath || "cognitive-bias-mastery"}
										onComplete={handleLearningComplete}
										onBack={() => console.log("Back")}
									/>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<Brain className="h-5 w-5" />
										Edukacja neuroprzekaźników
									</CardTitle>
								</CardHeader>
								<CardContent>
									<NeurotransmitterEducationModule selectedNeurotransmitter="dopamine" />
								</CardContent>
							</Card>
						</div>
					</TabsContent>

					<TabsContent value="analytics" className="space-y-6">
						<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<Activity className="h-5 w-5" />
										Aktywność dzisiaj
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										<div className="flex items-center justify-between">
											<span>Ukończonych nawyków</span>
											<span className="font-medium">3/4</span>
										</div>
										<Progress value={75} className="h-2" />

										<div className="flex items-center justify-between">
											<span>Technik w użyciu</span>
											<span className="font-medium">2</span>
										</div>
										<Progress value={100} className="h-2" />

										<div className="flex items-center justify-between">
											<span>Czas skupienia</span>
											<span className="font-medium">4.2h</span>
										</div>
										<Progress value={85} className="h-2" />
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<TrendingUp className="h-5 w-5" />
										Tydzień w liczbach
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="grid grid-cols-2 gap-4">
										<div className="rounded-lg bg-blue-50 p-3 text-center">
											<div className="font-bold text-2xl text-blue-600">15</div>
											<div className="text-blue-700 text-sm">Dni z rzędu</div>
										</div>
										<div className="rounded-lg bg-green-50 p-3 text-center">
											<div className="font-bold text-2xl text-green-600">
												92%
											</div>
											<div className="text-green-700 text-sm">Skuteczność</div>
										</div>
										<div className="rounded-lg bg-purple-50 p-3 text-center">
											<div className="font-bold text-2xl text-purple-600">
												18
											</div>
											<div className="text-purple-700 text-sm">Nawyki</div>
										</div>
										<div className="rounded-lg bg-orange-50 p-3 text-center">
											<div className="font-bold text-2xl text-orange-600">
												23
											</div>
											<div className="text-orange-700 text-sm">Techniki</div>
										</div>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<Star className="h-5 w-5" />
										Rekomendacje
									</CardTitle>
								</CardHeader>
								<CardContent>
									<AIRecommendationInterface />
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

export default PsychologyDashboardPage;
