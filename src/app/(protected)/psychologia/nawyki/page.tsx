"use client";

import HabitFormationTracker from "@/components/psychology/HabitFormationTracker";
import React from "react";

// Import the HabitFormation type
interface HabitFormation {
	id: string;
	userId: string;
	habitType:
		| "SUPPLEMENT_INTAKE"
		| "PRODUCTIVITY_TECHNIQUE"
		| "COGNITIVE_EXERCISE"
		| "LIFESTYLE"
		| "CUSTOM";
	polishHabitType: string;
	habitDetails: any;
	formationStrategy: any;
	progress: any;
	supplementContext?: any;
	relatedSupplements: any[];
	relatedTechniques: any[];
	insights: any;
	isActive: boolean;
	lastUpdated: Date;
	completedAt?: Date;
}

// Mock data for habits
const mockHabits: HabitFormation[] = [
	{
		id: "morning-supplement-routine",
		userId: "user-123",
		habitType: "SUPPLEMENT_INTAKE",
		polishHabitType: "Przyjmowanie suplementów",

		habitDetails: {
			name: "Morning Supplement Routine",
			polishName: "Poranna rutyna suplementów",
			description: "Take daily nootropic stack with breakfast",
			polishDescription:
				"Przyjmowanie codziennego stosu nootropików ze śniadaniem",
			targetFrequency: "DAILY",
			polishTargetFrequency: "Codziennie",
			estimatedDuration: 5,
			difficulty: "EASY",
			polishDifficulty: "Łatwy",
		},

		formationStrategy: {
			technique: "HABIT_STACKING",
			polishTechnique: "Łączenie nawyków",
			cue: "After I pour my morning coffee",
			polishCue: "Po nalaniu porannej kawy",
			routine: "I will take my nootropic supplements",
			polishRoutine: "Wezmę swoje suplementy nootropowe",
			reward: "I will feel prepared and focused for the day",
			polishReward: "Poczuję się przygotowany i skupiony na dzień",
			environmentalTriggers: [
				"Coffee machine",
				"Supplement container on counter",
			],
			polishEnvironmentalTriggers: [
				"Ekspres do kawy",
				"Pojemnik na suplementy na blacie",
			],
		},

		progress: {
			startDate: new Date("2024-01-01"),
			targetCompletionDate: new Date("2024-02-21"), // 21 days for habit formation
			currentStreak: 15,
			longestStreak: 18,
			totalCompletions: 45,
			missedDays: 3,
			completionRate: 93.75,
			weeklyProgress: [
				{
					week: 1,
					completions: 6,
					target: 7,
					notes: "Good start",
					polishNotes: "Dobry początek",
				},
				{
					week: 2,
					completions: 7,
					target: 7,
					notes: "Perfect week",
					polishNotes: "Idealny tydzień",
				},
				{
					week: 3,
					completions: 5,
					target: 7,
					notes: "Missed weekend",
					polishNotes: "Opuściłem weekend",
				},
			],
		},

		relatedSupplements: [
			{
				supplementId: "modafinil",
				supplementName: "Modafinil",
				polishSupplementName: "Modafinil",
				relationship: "HABIT_SUPPORTS_SUPPLEMENT",
				polishRelationship: "Nawyk wspiera suplement",
			},
			{
				supplementId: "l-theanine",
				supplementName: "L-Theanine",
				polishSupplementName: "L-Teanina",
				relationship: "SYNERGISTIC",
				polishRelationship: "Synergiczny",
			},
		],

		relatedTechniques: [
			{
				techniqueId: "implementation-intentions",
				techniqueName: "Implementation Intentions",
				polishTechniqueName: "Intencje implementacyjne",
				relationship: "PREREQUISITE",
				polishRelationship: "Warunek wstępny",
			},
		],

		insights: {
			bestPerformanceTimes: ["7:00-8:00 AM", "With breakfast"],
			polishBestPerformanceTimes: ["7:00-8:00 rano", "Ze śniadaniem"],
			challengingScenarios: ["Weekend mornings", "Travel days"],
			polishChallengingScenarios: ["Weekendowe poranki", "Dni podróży"],
			motivationalFactors: ["Feeling more focused", "Better work performance"],
			polishMotivationalFactors: [
				"Czucie się bardziej skupionym",
				"Lepsza wydajność w pracy",
			],
			barriers: [
				"Forgetting supplements when traveling",
				"Running out of stock",
			],
			polishBarriers: [
				"Zapominanie suplementów podczas podróży",
				"Wyczerpanie zapasów",
			],
		},

		isActive: true,
		lastUpdated: new Date(),
	},

	{
		id: "pomodoro-work-sessions",
		userId: "user-123",
		habitType: "PRODUCTIVITY_TECHNIQUE",
		polishHabitType: "Technika produktywności",

		habitDetails: {
			name: "Pomodoro Work Sessions",
			polishName: "Sesje pracy Pomodoro",
			description: "Complete 4 pomodoro sessions during work hours",
			polishDescription: "Ukończenie 4 sesji pomodoro podczas godzin pracy",
			targetFrequency: "DAILY",
			polishTargetFrequency: "Codziennie",
			estimatedDuration: 120, // 4 x 25 minutes + breaks
			difficulty: "MODERATE",
			polishDifficulty: "Umiarkowany",
		},

		formationStrategy: {
			technique: "ENVIRONMENT_DESIGN",
			polishTechnique: "Projektowanie środowiska",
			cue: "When I sit at my desk and open my laptop",
			polishCue: "Gdy siadam przy biurku i otwieram laptopa",
			routine: "I will start a 25-minute pomodoro timer",
			polishRoutine: "Uruchomię 25-minutowy timer pomodoro",
			reward: "I will take a 5-minute break to stretch or walk",
			polishReward: "Zrobię 5-minutową przerwę na rozciąganie lub spacer",
			environmentalTriggers: [
				"Pomodoro timer app",
				"Clean desk setup",
				"Phone in drawer",
			],
			polishEnvironmentalTriggers: [
				"Aplikacja timer Pomodoro",
				"Czyste biurko",
				"Telefon w szufladzie",
			],
		},

		progress: {
			startDate: new Date("2024-01-15"),
			targetCompletionDate: new Date("2024-02-05"),
			currentStreak: 8,
			longestStreak: 12,
			totalCompletions: 28,
			missedDays: 5,
			completionRate: 84.8,
			weeklyProgress: [
				{
					week: 1,
					completions: 4,
					target: 5,
					notes: "Learning the technique",
					polishNotes: "Uczenie się techniki",
				},
				{
					week: 2,
					completions: 5,
					target: 5,
					notes: "Getting into rhythm",
					polishNotes: "Wchodzenie w rytm",
				},
				{
					week: 3,
					completions: 3,
					target: 5,
					notes: "Busy week with meetings",
					polishNotes: "Zajęty tydzień ze spotkaniami",
				},
			],
		},

		relatedSupplements: [
			{
				supplementId: "caffeine-l-theanine",
				supplementName: "Caffeine + L-Theanine",
				polishSupplementName: "Kofeina + L-Teanina",
				relationship: "SUPPORTS_HABIT",
				polishRelationship: "Wspiera nawyk",
			},
		],

		relatedTechniques: [
			{
				techniqueId: "deep-work",
				techniqueName: "Deep Work",
				polishTechniqueName: "Głęboka praca",
				relationship: "COMPLEMENTARY",
				polishRelationship: "Uzupełniający",
			},
		],

		insights: {
			bestPerformanceTimes: ["9:00-11:00 AM", "2:00-4:00 PM"],
			polishBestPerformanceTimes: ["9:00-11:00 rano", "14:00-16:00"],
			challengingScenarios: [
				"Days with many meetings",
				"Open office distractions",
			],
			polishChallengingScenarios: [
				"Dni z wieloma spotkaniami",
				"Rozpraszacze w otwartym biurze",
			],
			motivationalFactors: [
				"Sense of accomplishment",
				"Better focus",
				"Less procrastination",
			],
			polishMotivationalFactors: [
				"Poczucie osiągnięcia",
				"Lepsza koncentracja",
				"Mniej prokrastynacji",
			],
			barriers: ["Interruptions from colleagues", "Urgent tasks breaking flow"],
			polishBarriers: [
				"Przerwania od kolegów",
				"Pilne zadania przerywające przepływ",
			],
		},

		isActive: true,
		lastUpdated: new Date(),
	},
];

// Mock completion data
const mockCompletions = [
	// Morning supplement routine completions
	{
		id: "c1",
		habitId: "morning-supplement-routine",
		date: new Date("2024-01-20"),
		completed: true,
		mood: 4,
		energy: 4,
		difficulty: 2,
		satisfaction: 5,
	},
	{
		id: "c2",
		habitId: "morning-supplement-routine",
		date: new Date("2024-01-21"),
		completed: true,
		mood: 5,
		energy: 5,
		difficulty: 1,
		satisfaction: 5,
	},
	{
		id: "c3",
		habitId: "morning-supplement-routine",
		date: new Date("2024-01-22"),
		completed: false,
		mood: 3,
		energy: 3,
		difficulty: 3,
		satisfaction: 2,
	},
	{
		id: "c4",
		habitId: "morning-supplement-routine",
		date: new Date("2024-01-23"),
		completed: true,
		mood: 4,
		energy: 4,
		difficulty: 2,
		satisfaction: 4,
	},

	// Pomodoro sessions completions
	{
		id: "c5",
		habitId: "pomodoro-work-sessions",
		date: new Date("2024-01-20"),
		completed: true,
		mood: 4,
		energy: 3,
		difficulty: 3,
		satisfaction: 4,
	},
	{
		id: "c6",
		habitId: "pomodoro-work-sessions",
		date: new Date("2024-01-21"),
		completed: true,
		mood: 4,
		energy: 4,
		difficulty: 2,
		satisfaction: 5,
	},
	{
		id: "c7",
		habitId: "pomodoro-work-sessions",
		date: new Date("2024-01-22"),
		completed: false,
		mood: 2,
		energy: 2,
		difficulty: 4,
		satisfaction: 1,
	},
	{
		id: "c8",
		habitId: "pomodoro-work-sessions",
		date: new Date("2024-01-23"),
		completed: true,
		mood: 5,
		energy: 4,
		difficulty: 2,
		satisfaction: 5,
	},
];

const HabitTrackingPage = () => {
	const handleHabitCreate = (habit: any) => {
		console.log("Creating habit:", habit);
		// In real app, this would save to database
	};

	const handleHabitUpdate = (habitId: string, updates: any) => {
		console.log("Updating habit:", { habitId, updates });
		// In real app, this would update database
	};

	const handleHabitDelete = (habitId: string) => {
		console.log("Deleting habit:", habitId);
		// In real app, this would delete from database
	};

	const handleCompletionToggle = (
		habitId: string,
		date: Date,
		completed: boolean,
		notes?: string,
	) => {
		console.log("Toggling completion:", { habitId, date, completed, notes });
		// In real app, this would update completion status
	};

	const handleCompletionUpdate = (completionId: string, updates: any) => {
		console.log("Updating completion:", { completionId, updates });
		// In real app, this would update completion details
	};

	return (
		<div className="container mx-auto px-4 py-8">
			<HabitFormationTracker
				habits={mockHabits}
				completions={mockCompletions}
				onHabitCreate={handleHabitCreate}
				onHabitUpdate={handleHabitUpdate}
				onHabitDelete={handleHabitDelete}
				onCompletionToggle={handleCompletionToggle}
				onCompletionUpdate={handleCompletionUpdate}
			/>
		</div>
	);
};

export default HabitTrackingPage;
