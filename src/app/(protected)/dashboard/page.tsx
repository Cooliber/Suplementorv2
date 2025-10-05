/**
 * Protected Dashboard Page
 * Main dashboard for authenticated users with all features
 */

"use client";

import { Interactive3DBrainModel } from "@/components/brain";
import {
	LearningPath,
	NeurotransmitterEducationModule,
} from "@/components/education";
import { GraphDashboard } from "@/components/graph";
import {
	CognitiveBiasDetector,
	HabitFormationTracker,
	ProductivityTechniqueBrowser,
} from "@/components/psychology";
import { AIRecommendationInterface } from "@/components/recommendations";
import {
	ComprehensiveSupplementCard,
	EnhancedSupplementDashboard,
} from "@/components/supplements";
import {
	DailyIntakeLogger,
	SupplementTrackingDashboard,
} from "@/components/tracking";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useGraphData } from "@/hooks/useGraphData";
import {
	Activity,
	Award,
	BarChart3,
	BookOpen,
	Brain,
	Calendar,
	Lightbulb,
	Network,
	Pill,
	Target,
	TrendingUp,
	User,
	Zap,
} from "lucide-react";
import React, { useState } from "react";

const DashboardPage = () => {
	const [activeSection, setActiveSection] = useState("overview");
	const [selectedSupplement, setSelectedSupplement] = useState<any>(null);

	const { nodes, relationships, supplements, isLoading, error, refetch } =
		useGraphData({ autoFetch: true });

	// Mock data for dashboard
	const mockSupplements = [
		{
			id: "alpha-gpc",
			name: "Alpha-GPC",
			polishName: "Alfa-GPC",
			category: "NOOTROPIC",
			polishCategory: "Nootropik",
			description: "Choline supplement that crosses the blood-brain barrier",
			polishDescription:
				"Suplement choliny, który przechodzi barierę krew-mózg",
			evidenceLevel: "STRONG",
			polishEvidenceLevel: "Silne",
			mechanisms: [
				{
					id: "cholinergic-enhancement",
					name: "Cholinergic enhancement",
					polishName: "Wzmacnianie cholinergiczne",
					description: "Increases acetylcholine levels",
					polishDescription: "Zwiększa poziom acetylocholiny",
				},
			],
			dosageGuidelines: {
				recommendedDose: "300-600mg daily",
				polishRecommendedDose: "300-600mg dziennie",
			},
			safetyProfile: {
				adverseEffects: ["Headache", "Nausea"],
				polishAdverseEffects: ["Ból głowy", "Mdłości"],
			},
		},
	];

	const mockHabits = [
		{
			id: "morning-routine",
			habitDetails: {
				name: "Morning Supplement Routine",
				polishName: "Poranna rutyna suplementów",
				description: "Take all morning supplements consistently",
				polishDescription:
					"Przyjmuj wszystkie poranne suplementy konsekwentnie",
			},
			progress: {
				currentStreak: 15,
				completionRate: 95.7,
			},
		},
	];

	const mockCompletions: any[] = [];

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
			},
		},
	];

	// Mock learning paths
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
			],
		},
	];

	// Mock bias scenarios
	const mockBiasScenarios = [
		{
			id: "confirmation-bias",
			title: "Confirmation Bias in Supplement Research",
			polishTitle: "Zafałszowanie potwierdzające w badaniach",
			description:
				"Tendency to search for, interpret, and remember information that confirms pre-existing beliefs",
			polishDescription:
				"Tendencja do szukania informacji potwierdzających istniejące przekonania",
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
			},
			supplementContext: {
				relevance: "Critical for objective supplement evaluation",
				polishRelevance: "Krytyczne dla obiektywnej oceny suplementów",
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
		console.log(`Selected learning path: ${pathId}`);
	};

	const handleLearningComplete = (pathId: string) => {
		console.log(`Learning path completed: ${pathId}`);
	};

	const handleRecommendationGenerated = (rec: any) => {
		console.log("Recommendation generated:", rec);
	};

	const handleRecommendationAccepted = (id: string) => {
		console.log("Recommendation accepted:", id);
	};

	const handleRecommendationRejected = (id: string) => {
		console.log("Recommendation rejected:", id);
	};

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<header className="border-b bg-white">
				<div className="container mx-auto px-4 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<Brain className="h-8 w-8 text-blue-600" />
							<h1 className="font-bold text-2xl text-gray-900">Dashboard</h1>
						</div>
						<div className="flex items-center gap-4">
							<Badge variant="outline" className="flex items-center gap-1">
								<Zap className="h-4 w-4" />
								Premium
							</Badge>
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
				{/* Stats Overview */}
				<div className="mb-8 grid grid-cols-2 gap-6 md:grid-cols-4">
					<Card className="text-center">
						<CardContent className="pt-6">
							<div className="font-bold text-3xl text-blue-600">23+</div>
							<div className="text-gray-600 text-sm">Suplementy</div>
						</CardContent>
					</Card>
					<Card className="text-center">
						<CardContent className="pt-6">
							<div className="font-bold text-3xl text-green-600">150+</div>
							<div className="text-gray-600 text-sm">Badania</div>
						</CardContent>
					</Card>
					<Card className="text-center">
						<CardContent className="pt-6">
							<div className="font-bold text-3xl text-purple-600">25+</div>
							<div className="text-gray-600 text-sm">Techniki</div>
						</CardContent>
					</Card>
					<Card className="text-center">
						<CardContent className="pt-6">
							<div className="font-bold text-3xl text-orange-600">15</div>
							<div className="text-gray-600 text-sm">Dni z rzędu</div>
						</CardContent>
					</Card>
				</div>

				{/* Quick Access */}
				<div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
					<Card
						className="cursor-pointer transition-shadow hover:shadow-lg"
						onClick={() => setActiveSection("supplements")}
					>
						<CardContent className="p-6">
							<div className="mb-3 flex items-center gap-3">
								<Pill className="h-8 w-8 text-blue-500" />
								<h3 className="font-semibold">Suplementy</h3>
							</div>
							<p className="text-gray-600 text-sm">
								Zarządzaj i śledź swoje suplementy
							</p>
						</CardContent>
					</Card>

					<Card
						className="cursor-pointer transition-shadow hover:shadow-lg"
						onClick={() => setActiveSection("graph")}
					>
						<CardContent className="p-6">
							<div className="mb-3 flex items-center gap-3">
								<Network className="h-8 w-8 text-green-500" />
								<h3 className="font-semibold">Graf Wiedzy</h3>
							</div>
							<p className="text-gray-600 text-sm">
								Eksploruj relacje między suplementami i funkcjami
							</p>
						</CardContent>
					</Card>

					<Card
						className="cursor-pointer transition-shadow hover:shadow-lg"
						onClick={() => setActiveSection("habits")}
					>
						<CardContent className="p-6">
							<div className="mb-3 flex items-center gap-3">
								<Target className="h-8 w-8 text-purple-500" />
								<h3 className="font-semibold">Nawyki</h3>
							</div>
							<p className="text-gray-600 text-sm">
								Buduj trwałe nawyki wspierające zdrowie
							</p>
						</CardContent>
					</Card>

					<Card
						className="cursor-pointer transition-shadow hover:shadow-lg"
						onClick={() => setActiveSection("education")}
					>
						<CardContent className="p-6">
							<div className="mb-3 flex items-center gap-3">
								<BookOpen className="h-8 w-8 text-yellow-500" />
								<h3 className="font-semibold">Edukacja</h3>
							</div>
							<p className="text-gray-600 text-sm">
								Ucz się o mózgu i suplementach
							</p>
						</CardContent>
					</Card>
				</div>

				{/* Main Dashboard Sections */}
				<div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
					{/* Supplement Dashboard Preview */}
					<Card className="lg:col-span-2">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Pill className="h-5 w-5" />
								Suplementy
							</CardTitle>
						</CardHeader>
						<CardContent>
							<EnhancedSupplementDashboard />
						</CardContent>
					</Card>

					{/* Graph Dashboard Preview */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Network className="h-5 w-5" />
								Graf Wiedzy
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="h-64">
								{isLoading ? (
									<div className="flex h-full items-center justify-center">
										<div className="h-8 w-8 animate-spin rounded-full border-blue-500 border-b-2" />
									</div>
								) : error ? (
									<div className="flex h-full items-center justify-center text-red-500">
										Błąd ładowania grafu
									</div>
								) : (
									<GraphDashboard
										nodes={nodes.slice(0, 5)} // Show first 5 nodes for preview
										relationships={relationships.slice(0, 8)} // Show first 8 relationships for preview
										supplements={supplements.slice(0, 3)} // Show first 3 supplements for preview
										className="h-full"
									/>
								)}
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Habits and Progress */}
				<div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Target className="h-5 w-5" />
								Moje nawyki
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
								className="h-64"
							/>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<TrendingUp className="h-5 w-5" />
								Śledzenie postępów
							</CardTitle>
						</CardHeader>
						<CardContent>
							<SupplementTrackingDashboard
								userId="demo-user"
								supplementIds={["alpha-gpc", "bacopa-monnieri", "l-theanine"]}
								className="h-64"
							/>
						</CardContent>
					</Card>
				</div>

				{/* AI Recommendations */}
				<Card className="mb-8">
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

				{/* Cognitive Bias Training */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Lightbulb className="h-5 w-5" />
							Trening wykrywania błędów poznawczych
						</CardTitle>
					</CardHeader>
					<CardContent>
						<CognitiveBiasDetector
							scenarios={[]}
							onScenarioComplete={handleScenarioComplete}
							onBiasDetected={handleBiasDetected}
							className="h-64"
						/>
					</CardContent>
				</Card>
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

export default DashboardPage;
