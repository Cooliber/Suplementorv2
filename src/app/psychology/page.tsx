/**
 * Complete Psychology Dashboard Page
 * This page integrates all psychology components into a cohesive interface
 */

"use client";

import { Interactive3DBrainModel } from "@/components/brain";
import {
	EducationalOverlay,
	LearningPath,
	NeurotransmitterEducationModule,
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
	CheckCircle,
	Clock,
	Eye,
	EyeOff,
	Lightbulb,
	Pause,
	Play,
	Star,
	Target,
	TrendingUp,
	Users,
	XCircle,
	Zap,
} from "lucide-react";
import React, { useState } from "react";

// Mock data for psychology components
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
					{
						id: "b",
						text: "Anchoring Bias",
						polishText: "Zafałszowanie zakotwiczenia",
						isCorrect: false,
						explanation:
							"Anchoring bias occurs when people rely too heavily on the first piece of information they receive",
						polishExplanation:
							"Zafałszowanie zakotwiczenia pojawia się, gdy ludzie zbyt mocno polegają na pierwszym otrzymanym informacje",
					},
				],
				points: 10,
			},
			{
				id: "q2",
				question: "How can you mitigate this bias?",
				polishQuestion: "Jak możesz ograniczyć to zafałszowanie?",
				type: "MULTIPLE_CHOICE",
				options: [
					{
						id: "a",
						text: "Read both positive and negative studies",
						polishText: "Czytaj zarówno pozytywne, jak i negatywne badania",
						isCorrect: true,
						explanation:
							"Reading studies with opposing conclusions helps form a balanced view",
						polishExplanation:
							"Czytanie badań z przeciwnymi wnioskami pomaga uformować zrównoważoną opinię",
					},
					{
						id: "b",
						text: "Only trust studies from well-known institutions",
						polishText: "Ufaj tylko badaniom z dobrze znanych instytucji",
						isCorrect: false,
						explanation:
							"This approach might introduce other biases like authority bias",
						polishExplanation:
							"To podejście może wprowadzić inne zafałszowania, np. zafałszowanie autorytetu",
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
				"Ask disconfirming questions",
				"Actively change your mind when presented with strong evidence",
			],
			polishSteps: [
				"Poszukuj dowodów przeciwstawnych",
				"Rozważ alternatywne punkty widzenia",
				"Zadawaj pytania podważające",
				"Aktywnie zmieniaj zdanie, gdy przedstawiono silne dowody",
			],
			practicalTips: [
				"Set up alerts for negative studies",
				"Use systematic review sources",
				"Discuss with people who disagree",
				"Practice intellectual humility",
			],
			polishPracticalTips: [
				"Ustaw powiadomienia o negatywnych badaniach",
				"Używaj źródeł przeglądu systematycznego",
				"Dyskutuj z osobami, które się nie zgadzają",
				"Ćwicz intelektualną pokorę",
			],
		},
		supplementContext: {
			relevance: "Critical for objective supplement evaluation",
			polishRelevance: "Krytyczne dla obiektywnej oceny suplementów",
			examples: [
				"Only reading positive reviews",
				"Ignoring contraindications",
				"Focusing on success stories",
				"Dismissing negative experiences",
			],
			polishExamples: [
				"Czytanie tylko pozytywnych recenzji",
				"Ignorowanie przeciwwskazań",
				"Skupianie się na historiach sukcesu",
				"Odrzucanie negatywnych doświadczeń",
			],
			preventionTips: [
				"Diversify your information sources",
				"Check systematic reviews",
				"Consult with healthcare providers",
				"Track your supplement experiences objectively",
			],
			polishPreventionTips: [
				"Zróżnicuj swoje źródła informacji",
				"Sprawdzaj przeglądy systematyczne",
				"Konsultuj się z lekarzami",
				"Śledź swoje doświadczenia z suplementami obiektywnie",
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
] as any[];

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
				{
					week: 2,
					completions: 7,
					target: 7,
					notes: "Maintained consistency",
					polishNotes: "Zachowana konsekwencja",
				},
				{
					week: 3,
					completions: 6,
					target: 7,
					notes: "Missed one day due to travel",
					polishNotes: "Zapomniane jednego dnia z powodu podróży",
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
	{
		id: "evening-relaxation",
		userId: "user-1",
		habitType: "LIFESTYLE",
		polishHabitType: "Styl życia",
		habitDetails: {
			name: "Evening Relaxation Routine",
			polishName: "Wieczorny rytuał relaksacyjny",
			description: "Wind down with meditation and supplements",
			polishDescription: "Ukończ dzień medytacją i suplementami",
			targetFrequency: "DAILY",
			polishTargetFrequency: "Codziennie",
			estimatedDuration: 15,
			difficulty: "MODERATE",
			polishDifficulty: "Umiarkowany",
		},
		formationStrategy: {
			technique: "ENVIRONMENT_DESIGN",
			polishTechnique: "Projektowanie środowiska",
			cue: "After dinner",
			polishCue: "Po kolacji",
			routine: "Meditate for 10 minutes, take Ashwagandha and Magnesium",
			polishRoutine: "Medytuj 10 minut, przyjmij Ashwagandhę i Magnez",
			reward: "Feel relaxed and ready for sleep",
			polishReward: "Poczuj się zrelaksowany i gotowy na sen",
			environmentalTriggers: [
				"Meditation cushion in bedroom",
				"Supplements by bedside",
			],
			polishEnvironmentalTriggers: [
				"Poduszka do medytacji w sypialni",
				"Suplementy przy łóżku",
			],
		},
		progress: {
			startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
			targetCompletionDate: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000),
			currentStreak: 5,
			longestStreak: 8,
			totalCompletions: 12,
			missedDays: 2,
			completionRate: 85.7,
			weeklyProgress: [
				{
					week: 1,
					completions: 5,
					target: 7,
					notes: "Started the routine",
					polishNotes: "Rozpoczęto rutynę",
				},
				{
					week: 2,
					completions: 7,
					target: 7,
					notes: "Perfect week",
					polishNotes: "Idealny tydzień",
				},
			],
		},
		relatedSupplements: [
			{
				supplementId: "ashwagandha",
				supplementName: "Ashwagandha",
				polishSupplementName: "Ashwagandha",
				relationship: "SUPPORTS_HABIT",
				polishRelationship: "Wspiera nawyk",
			},
		],
		relatedTechniques: [],
		insights: {
			bestPerformanceTimes: ["9 PM"],
			polishBestPerformanceTimes: ["21:00"],
			challengingScenarios: ["Late evenings", "Social events"],
			polishChallengingScenarios: ["Późne wieczory", "Wydarzenia towarzyskie"],
			motivationalFactors: ["Better sleep quality", "Reduced stress"],
			polishMotivationalFactors: ["Lepsza jakość snu", "Zmniejszone stres"],
			barriers: ["Being tired", "Social obligations"],
			polishBarriers: ["Bycie zmęczonym", "Obowiązki społeczne"],
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
				{
					stepNumber: 2,
					title: "Set a timer",
					polishTitle: "Ustaw minutnik",
					description: "Set a timer for 25 minutes",
					polishDescription: "Ustaw minutnik na 25 minut",
					tips: ["Use a physical timer to avoid digital distractions"],
					polishTips: [
						"Użyj fizycznego minutnika, by uniknąć cyfrowych rozpraszaczy",
					],
				},
				{
					stepNumber: 3,
					title: "Work on the task",
					polishTitle: "Pracuj nad zadaniem",
					description: "Focus on the task until the timer rings",
					polishDescription: "Skup się na zadaniu, aż zadzwoni minutnik",
					tips: ["Avoid all distractions during the interval"],
					polishTips: ["Unikaj wszystkich rozpraszaczy podczas odstępu"],
				},
				{
					stepNumber: 4,
					title: "Take a short break",
					polishTitle: "Zrób krótką przerwę",
					description: "Take a 5-minute break",
					polishDescription: "Zrób 5-minutową przerwę",
					tips: ["Stand up, stretch, or walk around"],
					polishTips: ["Wstań, rozciągnij się lub przejdź się"],
				},
			],
			requirements: ["Timer", "Task list"],
			polishRequirements: ["Minutnik", "Lista zadań"],
			tools: ["Physical timer", "Digital timer app"],
			polishTools: ["Minutnik fizyczny", "Aplikacja zegara cyfrowego"],
		},

		scientificBasis: {
			psychologicalPrinciples: [
				"Time-boxing",
				"Focus enhancement",
				"Restoration theory",
			],
			polishPsychologicalPrinciples: [
				"Ograniczanie czasu",
				"Wzmacnianie skupienia",
				"Teoria regeneracji",
			],
			neuroscienceEvidence:
				"Short work intervals prevent cognitive fatigue and maintain focus",
			polishNeuroscienceEvidence:
				"Krótkie odstępy pracy zapobiegają zmęczeniu poznawczemu i utrzymują skupienie",
			researchStudies: [
				{
					title: "Effect of time-boxing on task completion and focus",
					polishTitle:
						"Efekt ograniczania czasu na wykonanie zadań i skupienie",
					authors: ["Smith J", "Jones M", "Brown A"],
					year: 2020,
					findings:
						"Time-boxing significantly improved task completion rates and sustained attention",
					polishFindings:
						"Ograniczanie czasu znacząco poprawiło tempo wykonania zadań i utrzymanie uwagi",
					evidenceLevel: "STRONG",
				},
			],
			evidenceLevel: "STRONG",
			polishEvidenceLevel: "Silne",
		},

		implementation: {
			gettingStarted: "Start with one 25-minute session per day",
			polishGettingStarted: "Zacznij od jednej sesji 25-minutowej dziennie",
			commonMistakes: [
				"Skipping breaks",
				"Overextending work sessions",
				"Not tracking completion",
			],
			polishCommonMistakes: [
				"Pomijanie przerw",
				"Przedłużanie sesji pracy",
				"Nieśledzenie ukończenia",
			],
			troubleshooting: [
				{
					problem: "Difficulty focusing for 25 minutes",
					polishProblem: "Trudności z skupieniem przez 25 minut",
					solution: "Start with shorter intervals (15 minutes)",
					polishSolution: "Zacznij od krótszych odstępów (15 minut)",
				},
				{
					problem: "Forgetting to take breaks",
					polishProblem: "Zapominanie o przerwach",
					solution: "Set an alarm for break time",
					polishSolution: "Ustaw alarm na czas przerwy",
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
				{
					situation: "Beginner users",
					polishSituation: "Użytkownicy początkujący",
					modification: "Start with 15-minute intervals",
					polishModification: "Zacznij od 15-minutowych odstępów",
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
			applicabilityScenarios: [
				"Studying",
				"Writing",
				"Programming",
				"Research",
			],
			polishApplicabilityScenarios: [
				"Nauka",
				"Pisanie",
				"Programowanie",
				"Badania",
			],
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
			{
				supplementId: "rhodiola",
				supplementName: "Rhodiola",
				polishSupplementName: "Rhodiola",
				synergyType: "SUPPORTS",
				polishSynergyType: "Wspiera",
				description: "Reduces fatigue during extended work sessions",
				polishDescription: "Zmniejsza zmęczenie podczas długich sesji pracy",
				recommendedTiming: "20 minutes before session",
				polishRecommendedTiming: "20 minut przed sesją",
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
				targetImprovement: "Increase by 2 sessions per week",
				polishTargetImprovement: "Zwiększ o 2 sesje tygodniowo",
			},
			{
				metric: "Focus maintenance",
				polishMetric: "Utrzymanie skupienia",
				measurementMethod: "Self-report on difficulty maintaining attention",
				polishMeasurementMethod:
					"Opinia własna na temat trudności z utrzymaniem uwagi",
				frequency: "Weekly",
				polishFrequency: "Tygodniowo",
				targetImprovement: "Maintain focus for 80% of intervals",
				polishTargetImprovement: "Utrzymuj skupienie przez 80% odstępów",
			},
		],

		relatedTechniques: ["Time blocking", "Deep work", "Flow state"],
		polishRelatedTechniques: ["Blokowanie czasu", "Głęboka praca", "Stan flow"],
		prerequisites: [],
		polishPrerequisites: [],
		tags: ["focus", "productivity", "time management", "attention"],
		polishTags: ["skupienie", "produktywność", "zarządzanie czasem", "uwaga"],
		difficultyLevel: "BEGINNER",
		polishDifficultyLevel: "Początkujący",
		estimatedTimeToMaster: 30,
		isActive: true,
	},
	{
		id: "time-blocking",
		name: "Time Blocking",
		polishName: "Blokowanie czasu",
		category: "TIME_MANAGEMENT",
		polishCategory: "Zarządzanie czasem",
		description: "Schedule specific blocks of time for different activities",
		polishDescription: "Zaplanuj konkretne bloki czasu na różne działania",

		methodology: {
			overview: "Assign specific time slots to different tasks and activities",
			polishOverview:
				"Przydziel konkretne przedziały czasowe różnym zadaniom i działaniom",
			steps: [
				{
					stepNumber: 1,
					title: "List all tasks",
					polishTitle: "Wymień wszystkie zadania",
					description: "Write down all tasks you need to complete",
					polishDescription: "Zapisz wszystkie zadania, które musisz wykonać",
					tips: ["Include both work and personal tasks"],
					polishTips: ["Uwzględnij zarówno zadania pracy, jak i osobiste"],
				},
				{
					stepNumber: 2,
					title: "Estimate time needed",
					polishTitle: "Oszacuj potrzebny czas",
					description: "Estimate how long each task will take",
					polishDescription: "Oszacuj, ile czasu zajmie każde zadanie",
					tips: ["Be realistic and include buffer time"],
					polishTips: ["Bądź realistyczny i dołącz czas buforowy"],
				},
				{
					stepNumber: 3,
					title: "Block time on calendar",
					polishTitle: "Zablokuj czas w kalendarzu",
					description: "Schedule each task in your calendar",
					polishDescription: "Zaplanuj każde zadanie w kalendarzu",
					tips: ["Use color coding for different task types"],
					polishTips: ["Użyj kolorów kodujących dla różnych typów zadań"],
				},
				{
					stepNumber: 4,
					title: "Stick to the schedule",
					polishTitle: "Trzymaj się harmonogramu",
					description: "Follow your time blocks as closely as possible",
					polishDescription:
						"Postępuj zgodnie z blokami czasu tak blisko jak to możliwe",
					tips: ["Allow some flexibility for overruns"],
					polishTips: ["Zapewnij pewną elastyczność dla przekroczeń"],
				},
			],
			requirements: ["Calendar", "Task list", "Time estimation skills"],
			polishRequirements: [
				"Kalendarz",
				"Lista zadań",
				"Umiejętności szacowania czasu",
			],
			tools: ["Digital calendar", "Time tracking app", "Task manager"],
			polishTools: [
				"Cyfrowy kalendarz",
				"Aplikacja do śledzenia czasu",
				"Menedżer zadań",
			],
		},

		scientificBasis: {
			psychologicalPrinciples: [
				"Planning fallacy mitigation",
				"Cognitive load reduction",
				"Goal commitment",
			],
			polishPsychologicalPrinciples: [
				"Zapobieganie błędowi planowania",
				"Redukcja obciążenia poznawczego",
				"Zaangażowanie w cel",
			],
			neuroscienceEvidence:
				"Scheduling improves cognitive control and reduces decision fatigue",
			polishNeuroscienceEvidence:
				"Planowanie poprawia kontrolę poznawczą i zmniejsza zmęczenie decyzyjne",
			researchStudies: [
				{
					title: "Effect of time blocking on task completion",
					polishTitle: "Efekt blokowania czasu na wykonanie zadań",
					authors: ["Johnson S", "Williams R"],
					year: 2019,
					findings:
						"Time blocking significantly improved task completion and reduced stress",
					polishFindings:
						"Blokowanie czasu znacząco poprawiło wykonanie zadań i zmniejszyło stres",
					evidenceLevel: "MODERATE",
				},
			],
			evidenceLevel: "MODERATE",
			polishEvidenceLevel: "Umiarkowane",
		},

		effectiveness: {
			averageImprovementPercentage: 40,
			timeToSeeResults: "1 week",
			polishTimeToSeeResults: "1 tydzień",
			sustainabilityRating: 9,
			difficultyRating: 3,
			userSatisfactionRating: 8,
			applicabilityScenarios: [
				"Work planning",
				"Study schedules",
				"Personal organization",
			],
			polishApplicabilityScenarios: [
				"Planowanie pracy",
				"Harmonogramy nauki",
				"Organizacja osobista",
			],
		},

		supplementSynergies: [
			{
				supplementId: "bacopa",
				supplementName: "Bacopa",
				polishSupplementName: "Bacopa",
				synergyType: "COMPLEMENTS",
				polishSynergyType: "Uzupełnia",
				description: "May improve planning and cognitive flexibility",
				polishDescription: "Może poprawić planowanie i elastyczność poznawczą",
				recommendedTiming: "Morning with breakfast",
				polishRecommendedTiming: "Rano ze śniadaniem",
			},
		],

		trackingMetrics: [
			{
				metric: "Schedule adherence",
				polishMetric: "Zgodność z harmonogramem",
				measurementMethod: "Percentage of time blocks followed",
				polishMeasurementMethod: "Procent zgodnych bloków czasu",
				frequency: "Daily",
				polishFrequency: "Dziennie",
				targetImprovement: "Achieve 80% adherence",
				polishTargetImprovement: "Osiągnij 80% zgodności",
			},
		],

		relatedTechniques: ["Pomodoro", "Deep work", "Batch processing"],
		polishRelatedTechniques: [
			"Pomodoro",
			"Głęboka praca",
			"Przetwarzanie zbiorcze",
		],
		prerequisites: [],
		polishPrerequisites: [],
		tags: ["organization", "productivity", "time management", "planning"],
		polishTags: [
			"organizacja",
			"produktywność",
			"zarządzanie czasem",
			"planowanie",
		],
		difficultyLevel: "BEGINNER",
		polishDifficultyLevel: "Początkujący",
		estimatedTimeToMaster: 14,
		isActive: true,
	},
] as any[];

// Mock learning paths
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
									scenarios={mockBiasScenarios}
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
						<ProductivityTechniqueBrowser
							techniques={mockTechniques}
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
										onContinueLearning={() => console.log("Continue learning")}
										onComplete={handleLearningComplete}
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
									<NeurotransmitterEducationModule
										neurotransmitter={{
											id: "dopamine",
											name: "Dopamine",
											polishName: "Dopamina",
											description:
												"Neurotransmitter associated with motivation, reward, and learning",
											polishDescription:
												"Neuroprzekaźnik związany z motywacją, nagrodą i uczeniem się",
											function: "Reward processing, motivation, motor control",
											polishFunction:
												"Przetwarzanie nagrody, motywacja, kontrola ruchowa",
											pathways: ["Mesolimbic pathway", "Nigrostriatal pathway"],
											polishPathways: [
												"Ścieżka mezolimbigiczna",
												"Ścieżka nigtostriatalna",
											],
											relatedSupplements: [
												"L-Tyrosine",
												"Rhodiola",
												"Phenylalanine",
											],
										}}
										onModuleComplete={() =>
											console.log("Neurotransmitter module completed")
										}
									/>
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
