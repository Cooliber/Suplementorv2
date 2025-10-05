/**
 * Progress Tracking Page for Protected Route
 * This page allows users to track their supplement usage and cognitive progress
 */

"use client";

import {
	ConnectionVisualization,
	GraphDashboard,
	GraphLegend,
} from "@/components/graph";
import { AIRecommendationInterface } from "@/components/recommendations";
import {
	ComprehensiveSupplementCard,
	EnhancedSupplementDashboard,
} from "@/components/supplements";
import {
	DailyIntakeLogger,
	ProgressTrackingDashboard,
	SupplementProgressTracker,
	SupplementTrackingDashboard,
} from "@/components/tracking";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGraphData } from "@/hooks/useGraphData";
import {
	Activity,
	Award,
	BarChart3,
	Brain,
	Calendar,
	CheckCircle,
	Clock,
	Download,
	Eye,
	EyeOff,
	Filter,
	Pause,
	Pill,
	Play,
	RotateCcw,
	Search,
	Target,
	TrendingUp,
	Upload,
	User,
	XCircle,
	Zap,
} from "lucide-react";
import React, { useState } from "react";

// Mock data for progress tracking
const mockSupplements = [
	{
		id: "alpha-gpc",
		name: "Alpha-GPC",
		polishName: "Alfa-GPC",
		category: "NOOTROPIC",
		polishCategory: "Nootropik",
		description: "Choline supplement that crosses the blood-brain barrier",
		polishDescription: "Suplement choliny, który przechodzi barierę krew-mózg",
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
		habitType: "SUPPLEMENT_INTAKE",
		polishHabitType: "STOSOWANIE_SUPLEMENTÓW",
		habitDetails: {
			name: "Morning Supplement Routine",
			polishName: "Poranna rutyna suplementów",
			description: "Take all morning supplements consistently",
			polishDescription: "Przyjmuj wszystkie poranne suplementy konsekwentnie",
			targetFrequency: "DAILY",
			polishTargetFrequency: "CODZIENNIE",
			difficulty: "EASY",
			polishDifficulty: "Łatwy",
		},
		progress: {
			currentStreak: 15,
			completionRate: 95.7,
		},
	},
];

const mockCompletions = [];

const mockProgress = {
	completedModules: 3,
	totalModules: 12,
	learningTime: 45, // minutes
	completionRate: 75,
};

const ProgressTrackingPage = () => {
	const [activeTab, setActiveTab] = useState("dashboard");
	const [selectedSupplement, setSelectedSupplement] = useState<string | null>(
		null,
	);
	const [dateRange, setDateRange] = useState<"week" | "month" | "quarter">(
		"week",
	);
	const [searchTerm, setSearchTerm] = useState("");

	const { nodes, relationships, supplements, isLoading, error, refetch } =
		useGraphData({ autoFetch: true });

	const handleSupplementUpdate = (supplementId: string, updates: any) => {
		console.log(`Updating supplement ${supplementId}:`, updates);
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

	const handleProgressUpdate = () => {
		console.log("Progress updated");
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
							<TrendingUp className="h-8 w-8 text-blue-600" />
							<h1 className="font-bold text-2xl text-gray-900">
								Śledzenie postępów
							</h1>
						</div>
						<div className="flex items-center gap-4">
							<div className="relative">
								<Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform text-gray-400" />
								<input
									type="text"
									placeholder="Szukaj suplementów..."
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
					<TabsList className="grid w-full grid-cols-5">
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
						<TabsTrigger value="habits" className="flex items-center gap-2">
							<Target className="h-4 w-4" />
							Nawyki
						</TabsTrigger>
						<TabsTrigger value="logging" className="flex items-center gap-2">
							<Calendar className="h-4 w-4" />
							Dziennik
						</TabsTrigger>
						<TabsTrigger value="analytics" className="flex items-center gap-2">
							<Activity className="h-4 w-4" />
							Analityka
						</TabsTrigger>
					</TabsList>

					<TabsContent value="dashboard" className="space-y-6">
						<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
							{/* Summary Cards */}
							<Card className="lg:col-span-2">
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<BarChart3 className="h-5 w-5" />
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
									<div className="space-y-4">
										<div className="flex items-center gap-3">
											<div className="rounded-lg bg-blue-100 p-2">
												<Pill className="h-6 w-6 text-blue-600" />
											</div>
											<div>
												<h3 className="font-semibold">Alfa-GPC</h3>
												<p className="text-gray-600 text-sm">Nootropik</p>
											</div>
										</div>
										<p className="line-clamp-2 text-gray-700 text-sm">
											Suplement choliny, który przechodzi barierę krew-mózg
										</p>
										<Badge variant="outline">Silne</Badge>
										<div className="pt-2">
											<Button
												className="w-full"
												onClick={() => setActiveTab("supplements")}
											>
												Szczegóły
											</Button>
										</div>
									</div>
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
									<div className="space-y-3">
										{mockSupplements.map((supplement) => (
											<div
												key={supplement.id}
												className={`cursor-pointer rounded-lg border p-3 transition-colors ${
													selectedSupplement === supplement.id
														? "border-blue-500 bg-blue-50"
														: "hover:bg-gray-50"
												}`}
												onClick={() => setSelectedSupplement(supplement.id)}
											>
												<h3 className="font-medium">{supplement.polishName}</h3>
												<p className="text-gray-600 text-sm">
													{supplement.polishCategory}
												</p>
											</div>
										))}
									</div>
								</CardContent>
							</Card>

							<Card className="lg:col-span-2">
								<CardHeader>
									<CardTitle>Szczegóły suplementu</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="flex h-64 items-center justify-center text-gray-500">
										Wybierz suplement, aby zobaczyć szczegóły
									</div>
								</CardContent>
							</Card>
						</div>

						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Calendar className="h-5 w-5" />
									Dziennik przyjmowania
								</CardTitle>
							</CardHeader>
							<CardContent>
								<DailyIntakeLogger
									supplements={[]}
									onSubmit={async (log) => console.log("Log submitted:", log)}
									onSaveDraft={async (draft) =>
										console.log("Draft saved:", draft)
									}
								/>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<TrendingUp className="h-5 w-5" />
									Dashboard śledzenia
								</CardTitle>
							</CardHeader>
							<CardContent>
								<SupplementTrackingDashboard
									userId="user-1"
									supplementIds={["alpha-gpc", "bacopa-monnieri", "l-theanine"]}
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
								<ProgressTrackingDashboard
									progressData={[]}
									supplementProgress={[]}
									timeframe="30d"
									onTimeframeChange={(tf) => console.log("Timeframe:", tf)}
								/>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="logging" className="space-y-6">
						<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<Calendar className="h-5 w-5" />
										Dziennik dzienny
									</CardTitle>
								</CardHeader>
								<CardContent>
									<DailyIntakeLogger
										supplements={[]}
										onSubmit={async (log) => console.log("Log submitted:", log)}
										onSaveDraft={async (draft) =>
											console.log("Draft saved:", draft)
										}
									/>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<Clock className="h-5 w-5" />
										Historia
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="space-y-3">
										{[...Array(7)].map((_, i) => (
											<div
												key={i}
												className="flex items-center justify-between rounded-lg border p-3"
											>
												<div>
													<h3 className="font-medium">2025-01-{15 - i}</h3>
													<p className="text-gray-600 text-sm">
														Przyjęto 5 z 5 suplementów
													</p>
												</div>
												<Badge className="bg-green-100 text-green-800">
													100%
												</Badge>
											</div>
										))}
									</div>
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
										Statystyki ogólne
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										<div className="flex items-center justify-between">
											<span>Całkowita liczba dni</span>
											<span className="font-medium">45</span>
										</div>
										<Progress value={100} className="h-2" />

										<div className="flex items-center justify-between">
											<span>Średnia skuteczność</span>
											<span className="font-medium">95.7%</span>
										</div>
										<Progress value={95.7} className="h-2" />

										<div className="flex items-center justify-between">
											<span>Najdłuższa passa</span>
											<span className="font-medium">22 dni</span>
										</div>
										<Progress value={88} className="h-2" />
									</div>
								</CardContent>
							</Card>

							<Card className="lg:col-span-2">
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<BarChart3 className="h-5 w-5" />
										Wykres postępów
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="flex h-64 items-center justify-center rounded-lg bg-gray-100">
										<div className="text-center">
											<Activity className="mx-auto mb-4 h-12 w-12 text-gray-400" />
											<h3 className="mb-2 font-medium text-gray-900 text-lg">
												Wykres postępów
											</h3>
											<p className="text-gray-600">
												Wizualizacja Twoich postępów w czasie
											</p>
										</div>
									</div>
								</CardContent>
							</Card>
						</div>

						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<TrendingUp className="h-5 w-5" />
									Rekomendacje AI
								</CardTitle>
							</CardHeader>
							<CardContent>
								<AIRecommendationInterface />
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
							<TrendingUp className="h-5 w-5 text-blue-600" />
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

export default ProgressTrackingPage;
