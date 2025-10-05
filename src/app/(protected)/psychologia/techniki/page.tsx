"use client";

import ProductivityTechniqueBrowser from "@/components/psychology/ProductivityTechniqueBrowser";
import React from "react";

// Import the ProductivityTechnique type
interface ProductivityTechnique {
	id: string;
	name: string;
	polishName: string;
	category: string;
	polishCategory: string;
	description: string;
	polishDescription: string;
	methodology: any;
	scientificBasis: {
		psychologicalPrinciples: string[];
		polishPsychologicalPrinciples: string[];
		neuroscienceEvidence: string;
		polishNeuroscienceEvidence: string;
		researchStudies: any[];
		evidenceLevel: "STRONG" | "MODERATE" | "WEAK" | "ANECDOTAL";
		polishEvidenceLevel: string;
	};
	implementation: any;
	effectiveness: any;
	supplementSynergies: any[];
	trackingMetrics: any[];
	relatedTechniques: string[];
	prerequisites: string[];
	polishPrerequisites: string[];
	tags: string[];
	polishTags: string[];
	difficultyLevel: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
	estimatedTimeToMaster: number;
	isActive: boolean;
	lastUpdated: Date;
	version: string;
}

// Mock data - in real app this would come from API/database
const mockTechniques: ProductivityTechnique[] = [
	{
		id: "pomodoro-technique",
		name: "Pomodoro Technique",
		polishName: "Technika Pomodoro",
		category: "TIME_MANAGEMENT",
		polishCategory: "Zarządzanie czasem",
		description:
			"Time management method using 25-minute focused work intervals followed by short breaks",
		polishDescription:
			"Metoda zarządzania czasem wykorzystująca 25-minutowe okresy skupionej pracy przedzielone krótkimi przerwami",
		methodology: {
			overview:
				"Break work into focused 25-minute intervals separated by 5-minute breaks, with longer breaks every 4 cycles",
			polishOverview:
				"Podziel pracę na skupione 25-minutowe okresy przedzielone 5-minutowymi przerwami, z dłuższymi przerwami co 4 cykle",
			steps: [
				{
					stepNumber: 1,
					title: "Choose a task",
					polishTitle: "Wybierz zadanie",
					description: "Select a specific task you want to work on",
					polishDescription:
						"Wybierz konkretne zadanie, nad którym chcesz pracować",
					duration: "2 minutes",
					polishDuration: "2 minuty",
					tips: ["Make it specific and achievable", "Write it down"],
					polishTips: ["Niech będzie konkretne i osiągalne", "Zapisz je"],
				},
				{
					stepNumber: 2,
					title: "Set timer for 25 minutes",
					polishTitle: "Ustaw timer na 25 minut",
					description: "Start your focused work session",
					polishDescription: "Rozpocznij sesję skupionej pracy",
					duration: "25 minutes",
					polishDuration: "25 minut",
					tips: ["Remove all distractions", "Focus only on the chosen task"],
					polishTips: [
						"Usuń wszystkie rozpraszacze",
						"Skup się tylko na wybranym zadaniu",
					],
				},
				{
					stepNumber: 3,
					title: "Take a 5-minute break",
					polishTitle: "Zrób 5-minutową przerwę",
					description: "Rest and recharge before the next session",
					polishDescription: "Odpocznij i naładuj baterie przed następną sesją",
					duration: "5 minutes",
					polishDuration: "5 minut",
					tips: ["Stand up and move", "Avoid screens", "Hydrate"],
					polishTips: ["Wstań i porusz się", "Unikaj ekranów", "Nawodnij się"],
				},
			],
			requirements: ["Timer or app", "Quiet workspace", "Clear task list"],
			polishRequirements: [
				"Timer lub aplikacja",
				"Ciche miejsce pracy",
				"Jasna lista zadań",
			],
			tools: [
				"Pomodoro timer apps",
				"Physical timer",
				"Task management software",
			],
			polishTools: [
				"Aplikacje z timerem Pomodoro",
				"Fizyczny timer",
				"Oprogramowanie do zarządzania zadaniami",
			],
		},
		scientificBasis: {
			psychologicalPrinciples: [
				"Attention restoration theory",
				"Cognitive load theory",
				"Ultradian rhythms",
			],
			polishPsychologicalPrinciples: [
				"Teoria regeneracji uwagi",
				"Teoria obciążenia poznawczego",
				"Rytmy ultradialne",
			],
			neuroscienceEvidence:
				"Studies show that focused attention periods followed by breaks optimize prefrontal cortex function and reduce mental fatigue",
			polishNeuroscienceEvidence:
				"Badania pokazują, że okresy skupionej uwagi przedzielone przerwami optymalizują funkcję kory przedczołowej i redukują zmęczenie umysłowe",
			researchStudies: [
				{
					title:
						"The effectiveness of the Pomodoro Technique for time management",
					polishTitle: "Skuteczność techniki Pomodoro w zarządzaniu czasem",
					authors: "Cirillo, F.",
					year: 2018,
					findings:
						"87% of participants reported improved focus and productivity",
					polishFindings:
						"87% uczestników zgłosiło poprawę koncentracji i produktywności",
					effectSize: 0.7,
					sampleSize: 156,
				},
			],
			evidenceLevel: "MODERATE",
			polishEvidenceLevel: "Umiarkowane",
		},
		implementation: {
			gettingStarted:
				"Start with just 2-3 pomodoros per day and gradually increase",
			polishGettingStarted:
				"Zacznij od zaledwie 2-3 pomodoro dziennie i stopniowo zwiększaj",
			commonMistakes: [
				"Working through breaks",
				"Choosing tasks too large",
				"Getting distracted during sessions",
			],
			polishCommonMistakes: [
				"Praca podczas przerw",
				"Wybieranie zbyt dużych zadań",
				"Rozpraszanie się podczas sesji",
			],
			troubleshooting: [
				{
					problem: "Difficulty focusing for 25 minutes",
					polishProblem: "Trudność z koncentracją przez 25 minut",
					solution:
						"Start with shorter 15-minute sessions and gradually increase",
					polishSolution:
						"Zacznij od krótszych 15-minutowych sesji i stopniowo zwiększaj",
				},
			],
			adaptations: [
				{
					situation: "Creative work",
					polishSituation: "Praca twórcza",
					modification:
						"Use longer 45-90 minute sessions with 15-minute breaks",
					polishModification:
						"Używaj dłuższych 45-90 minutowych sesji z 15-minutowymi przerwami",
				},
			],
		},
		effectiveness: {
			averageImprovementPercentage: 35,
			timeToSeeResults: "1-2 weeks",
			polishTimeToSeeResults: "1-2 tygodnie",
			sustainabilityRating: 8,
			difficultyRating: 3,
			userSatisfactionRating: 8,
			applicabilityScenarios: [
				"Studying",
				"Writing",
				"Programming",
				"Administrative tasks",
			],
			polishApplicabilityScenarios: [
				"Nauka",
				"Pisanie",
				"Programowanie",
				"Zadania administracyjne",
			],
		},
		supplementSynergies: [
			{
				supplementId: "l-theanine",
				supplementName: "L-Theanine",
				polishSupplementName: "L-Teanina",
				synergyType: "ENHANCES",
				polishSynergyType: "Wzmacnia",
				description: "Promotes calm focus during work sessions",
				polishDescription: "Promuje spokojną koncentrację podczas sesji pracy",
				recommendedTiming: "30 minutes before starting pomodoros",
				polishRecommendedTiming: "30 minut przed rozpoczęciem pomodoro",
				evidenceLevel: "MODERATE",
			},
		],
		trackingMetrics: [
			{
				metric: "Completed pomodoros per day",
				polishMetric: "Ukończone pomodoro dziennie",
				measurementMethod: "Count using timer app or manual tracking",
				polishMeasurementMethod:
					"Liczenie za pomocą aplikacji lub ręczne śledzenie",
				frequency: "Daily",
				polishFrequency: "Codziennie",
				targetImprovement: "Increase by 1-2 per week",
				polishTargetImprovement: "Zwiększ o 1-2 tygodniowo",
			},
		],
		relatedTechniques: ["time-blocking", "deep-work"],
		prerequisites: [],
		polishPrerequisites: [],
		tags: ["focus", "time-management", "productivity", "attention"],
		polishTags: [
			"koncentracja",
			"zarządzanie-czasem",
			"produktywność",
			"uwaga",
		],
		difficultyLevel: "BEGINNER",
		estimatedTimeToMaster: 14,
		isActive: true,
		lastUpdated: new Date(),
		version: "1.0.0",
	},
	{
		id: "two-minute-rule",
		name: "Two-Minute Rule",
		polishName: "Zasada Dwóch Minut",
		category: "DECISION_MAKING",
		polishCategory: "Podejmowanie decyzji",
		description:
			"If a task takes less than two minutes, do it immediately rather than adding it to your to-do list",
		polishDescription:
			"Jeśli zadanie zajmuje mniej niż dwie minuty, zrób je natychmiast zamiast dodawać do listy zadań",
		methodology: {
			overview:
				"Immediately complete any task that takes less than 2 minutes to avoid accumulation of small tasks",
			polishOverview:
				"Natychmiast wykonuj każde zadanie, które zajmuje mniej niż 2 minuty, aby uniknąć gromadzenia się małych zadań",
			steps: [
				{
					stepNumber: 1,
					title: "Identify the task",
					polishTitle: "Zidentyfikuj zadanie",
					description: "When a task comes up, immediately assess its duration",
					polishDescription:
						"Gdy pojawi się zadanie, natychmiast oceń jego czas trwania",
					tips: [
						"Be realistic about time estimates",
						"Include setup and cleanup time",
					],
					polishTips: [
						"Bądź realistyczny w szacowaniu czasu",
						"Uwzględnij czas przygotowania i sprzątania",
					],
				},
				{
					stepNumber: 2,
					title: "Apply the rule",
					polishTitle: "Zastosuj zasadę",
					description:
						"If under 2 minutes, do it now. If over, schedule or delegate",
					polishDescription:
						"Jeśli poniżej 2 minut, zrób teraz. Jeśli powyżej, zaplanuj lub deleguj",
					tips: [
						"Stick to the time limit strictly",
						"Don't let small tasks interrupt deep work",
					],
					polishTips: [
						"Trzymaj się ściśle limitu czasu",
						"Nie pozwól małym zadaniom przerwać głębokiej pracy",
					],
				},
			],
			requirements: [
				"Good time estimation skills",
				"Discipline to follow through",
			],
			polishRequirements: [
				"Dobre umiejętności szacowania czasu",
				"Dyscyplina w realizacji",
			],
			tools: ["Timer for verification", "Task management system"],
			polishTools: ["Timer do weryfikacji", "System zarządzania zadaniami"],
		},
		scientificBasis: {
			psychologicalPrinciples: [
				"Zeigarnik effect",
				"Cognitive load reduction",
				"Decision fatigue prevention",
			],
			polishPsychologicalPrinciples: [
				"Efekt Zeigarnik",
				"Redukcja obciążenia poznawczego",
				"Zapobieganie zmęczeniu decyzyjnemu",
			],
			neuroscienceEvidence:
				"Completing small tasks immediately reduces working memory load and prevents task-switching costs",
			polishNeuroscienceEvidence:
				"Natychmiastowe wykonywanie małych zadań redukuje obciążenie pamięci roboczej i zapobiega kosztom przełączania zadań",
			researchStudies: [
				{
					title: "The cognitive cost of task interruption and resumption",
					polishTitle: "Poznawczy koszt przerwania i wznowienia zadania",
					authors: "Altmann, E. M., & Trafton, J. G.",
					year: 2002,
					findings: "Task switching can cost up to 25% of productivity",
					polishFindings:
						"Przełączanie zadań może kosztować do 25% produktywności",
					effectSize: 0.6,
					sampleSize: 89,
				},
			],
			evidenceLevel: "STRONG",
			polishEvidenceLevel: "Silne",
		},
		implementation: {
			gettingStarted:
				"Practice estimating task duration for a week before implementing",
			polishGettingStarted:
				"Ćwicz szacowanie czasu trwania zadań przez tydzień przed wdrożeniem",
			commonMistakes: [
				"Underestimating task duration",
				"Applying during deep work sessions",
				"Not being selective",
			],
			polishCommonMistakes: [
				"Niedoszacowanie czasu trwania zadania",
				"Stosowanie podczas sesji głębokiej pracy",
				"Brak selektywności",
			],
			troubleshooting: [
				{
					problem: "Tasks consistently take longer than 2 minutes",
					polishProblem: "Zadania konsekwentnie trwają dłużej niż 2 minuty",
					solution:
						"Improve time estimation skills and break down complex tasks",
					polishSolution:
						"Popraw umiejętności szacowania czasu i rozbij złożone zadania",
				},
			],
			adaptations: [
				{
					situation: "High-focus work periods",
					polishSituation: "Okresy wysokiej koncentracji",
					modification: "Batch 2-minute tasks for later or use 5-minute rule",
					polishModification:
						"Grupuj 2-minutowe zadania na później lub użyj zasady 5 minut",
				},
			],
		},
		effectiveness: {
			averageImprovementPercentage: 25,
			timeToSeeResults: "3-5 days",
			polishTimeToSeeResults: "3-5 dni",
			sustainabilityRating: 9,
			difficultyRating: 2,
			userSatisfactionRating: 8,
			applicabilityScenarios: [
				"Email management",
				"Administrative tasks",
				"Quick responses",
				"Organization",
			],
			polishApplicabilityScenarios: [
				"Zarządzanie emailami",
				"Zadania administracyjne",
				"Szybkie odpowiedzi",
				"Organizacja",
			],
		},
		supplementSynergies: [],
		trackingMetrics: [
			{
				metric: "Number of 2-minute tasks completed immediately",
				polishMetric: "Liczba 2-minutowych zadań wykonanych natychmiast",
				measurementMethod: "Daily count and reflection",
				polishMeasurementMethod: "Codzienne liczenie i refleksja",
				frequency: "Daily",
				polishFrequency: "Codziennie",
				targetImprovement: "Maintain 90%+ immediate completion rate",
				polishTargetImprovement:
					"Utrzymuj 90%+ wskaźnik natychmiastowego wykonania",
			},
		],
		relatedTechniques: ["getting-things-done", "inbox-zero"],
		prerequisites: [],
		polishPrerequisites: [],
		tags: ["efficiency", "decision-making", "task-management"],
		polishTags: [
			"efektywność",
			"podejmowanie-decyzji",
			"zarządzanie-zadaniami",
		],
		difficultyLevel: "BEGINNER",
		estimatedTimeToMaster: 7,
		isActive: true,
		lastUpdated: new Date(),
		version: "1.0.0",
	},
];

const mockUserProgress = {
	implementedTechniques: [],
	masteredTechniques: [],
	currentlyLearning: [],
};

const ProductivityTechniquesPage = () => {
	const handleTechniqueSelect = (techniqueId: string) => {
		console.log("Selected technique:", techniqueId);
	};

	const handleStartImplementation = (techniqueId: string) => {
		console.log("Starting implementation:", techniqueId);
		// In real app, this would update user progress and create habit tracking
	};

	return (
		<div className="container mx-auto px-4 py-8">
			<ProductivityTechniqueBrowser
				techniques={mockTechniques}
				onTechniqueSelect={handleTechniqueSelect}
				onStartImplementation={handleStartImplementation}
				userProgress={mockUserProgress}
			/>
		</div>
	);
};

export default ProductivityTechniquesPage;
