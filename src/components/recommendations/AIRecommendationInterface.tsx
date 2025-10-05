"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Activity,
	AlertTriangle,
	Brain,
	CheckCircle,
	Clock,
	Euro,
	Heart,
	Info,
	Lightbulb,
	Settings,
	Shield,
	Sparkles,
	Star,
	Target,
	TrendingUp,
	User,
	XCircle,
	Zap,
} from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";

import {
	type HealthGoal,
	type RecommendationResult,
	type UserProfile,
	aiRecommendationEngine,
	formatRecommendationScore,
	getScoreColor,
} from "@/lib/services/ai-recommendation-engine";

interface AIRecommendationInterfaceProps {
	onRecommendationSelect?: (recommendation: RecommendationResult) => void;
	onRecommendationGenerated?: (rec: unknown) => void;
	onRecommendationAccepted?: (id: string) => void;
	onRecommendationRejected?: (id: string) => void;
	onAddToStack?: (supplementId: string) => void;
	className?: string;
}

const AIRecommendationInterface: React.FC<AIRecommendationInterfaceProps> = ({
	onRecommendationSelect,
	onRecommendationGenerated,
	onRecommendationAccepted,
	onRecommendationRejected,
	onAddToStack,
	className = "",
}) => {
	const [userProfile, setUserProfile] = useState<Partial<UserProfile>>({
		age: 35,
		gender: "other",
		healthGoals: [],
		healthConditions: [],
		polishHealthConditions: [],
		currentMedications: [],
		allergies: [],
		polishAllergies: [],
		lifestyle: {
			activityLevel: "moderate",
			diet: "omnivore",
			polishDiet: "wszystkożerny",
			sleepHours: 7,
			stressLevel: 3,
			smokingStatus: "never",
			alcoholConsumption: "light",
		},
		preferences: {
			budgetRange: { min: 20, max: 100, currency: "EUR" },
			preferredForms: ["capsule"],
			polishPreferredForms: ["kapsułka"],
			maxDailySupplements: 5,
			organicPreference: false,
			veganPreference: false,
			allergenAvoidance: [],
			polishAllergenAvoidance: [],
		},
		currentSupplements: [],
	});

	const [recommendations, setRecommendations] = useState<
		RecommendationResult[]
	>([]);
	const [loading, setLoading] = useState(false);
	const [currentStep, setCurrentStep] = useState(1);
	const [selectedRecommendation, setSelectedRecommendation] =
		useState<RecommendationResult | null>(null);

	const healthGoalOptions = [
		{
			id: "cognitive",
			goal: "Cognitive Enhancement",
			polishGoal: "Wzmocnienie funkcji poznawczych",
		},
		{
			id: "energy",
			goal: "Energy & Vitality",
			polishGoal: "Energia i witalność",
		},
		{
			id: "stress",
			goal: "Stress Management",
			polishGoal: "Zarządzanie stresem",
		},
		{ id: "sleep", goal: "Sleep Quality", polishGoal: "Jakość snu" },
		{ id: "immune", goal: "Immune Support", polishGoal: "Wsparcie odporności" },
		{
			id: "heart",
			goal: "Cardiovascular Health",
			polishGoal: "Zdrowie sercowo-naczyniowe",
		},
		{ id: "joint", goal: "Joint Health", polishGoal: "Zdrowie stawów" },
		{ id: "mood", goal: "Mood Support", polishGoal: "Wsparcie nastroju" },
		{
			id: "memory",
			goal: "Memory Enhancement",
			polishGoal: "Wzmocnienie pamięci",
		},
		{
			id: "focus",
			goal: "Focus & Concentration",
			polishGoal: "Skupienie i koncentracja",
		},
	];

	const generateRecommendations = async () => {
		if (!userProfile.age || userProfile.healthGoals?.length === 0) {
			return;
		}

		setLoading(true);
		try {
			const results = await aiRecommendationEngine.generateRecommendations(
				userProfile as UserProfile,
				5,
			);
			setRecommendations(results);
		} catch (error) {
			console.error("Error generating recommendations:", error);
		} finally {
			setLoading(false);
		}
	};

	const addHealthGoal = (goalOption: (typeof healthGoalOptions)[0]) => {
		const newGoal: HealthGoal = {
			id: goalOption.id,
			goal: goalOption.goal,
			polishGoal: goalOption.polishGoal,
			priority: "medium",
			timeframe: "3 months",
			polishTimeframe: "3 miesiące",
		};

		setUserProfile((prev) => ({
			...prev,
			healthGoals: [...(prev.healthGoals || []), newGoal],
		}));
	};

	const removeHealthGoal = (goalId: string) => {
		setUserProfile((prev) => ({
			...prev,
			healthGoals: prev.healthGoals?.filter((goal) => goal.id !== goalId) || [],
		}));
	};

	const updateHealthGoalPriority = (
		goalId: string,
		priority: "low" | "medium" | "high",
	) => {
		setUserProfile((prev) => ({
			...prev,
			healthGoals:
				prev.healthGoals?.map((goal) =>
					goal.id === goalId ? { ...goal, priority } : goal,
				) || [],
		}));
	};

	const getWarningIcon = (severity: string) => {
		switch (severity) {
			case "critical":
				return <XCircle className="h-4 w-4 text-red-600" />;
			case "high":
				return <AlertTriangle className="h-4 w-4 text-orange-600" />;
			case "moderate":
				return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
			default:
				return <Info className="h-4 w-4 text-blue-600" />;
		}
	};

	const getPriorityColor = (priority: string) => {
		switch (priority) {
			case "high":
				return "bg-red-100 text-red-800 border-red-200";
			case "medium":
				return "bg-yellow-100 text-yellow-800 border-yellow-200";
			case "low":
				return "bg-green-100 text-green-800 border-green-200";
			default:
				return "bg-gray-100 text-gray-800 border-gray-200";
		}
	};

	return (
		<div className={`space-y-6 ${className}`}>
			{/* Header */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Sparkles className="h-5 w-5" />
						Inteligentne rekomendacje suplementów
					</CardTitle>
					<p className="text-gray-600 text-sm">
						Otrzymaj spersonalizowane rekomendacje oparte na Twoich celach
						zdrowotnych, stylu życia i preferencjach.
					</p>
				</CardHeader>
			</Card>

			{/* Multi-step form */}
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<h3 className="font-medium text-lg">Krok {currentStep} z 3</h3>
						<div className="flex space-x-2">
							{[1, 2, 3].map((step) => (
								<div
									key={step}
									className={`flex h-8 w-8 items-center justify-center rounded-full text-sm ${
										step === currentStep
											? "bg-blue-600 text-white"
											: step < currentStep
												? "bg-green-600 text-white"
												: "bg-gray-200 text-gray-600"
									}`}
								>
									{step < currentStep ? (
										<CheckCircle className="h-4 w-4" />
									) : (
										step
									)}
								</div>
							))}
						</div>
					</div>
					<Progress value={(currentStep / 3) * 100} className="mt-2" />
				</CardHeader>

				<CardContent>
					{/* Step 1: Basic Information */}
					{currentStep === 1 && (
						<div className="space-y-6">
							<div>
								<h4 className="mb-4 flex items-center gap-2 font-medium text-md">
									<User className="h-4 w-4" />
									Podstawowe informacje
								</h4>

								<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
									<div>
										<Label htmlFor="age">Wiek</Label>
										<Input
											id="age"
											type="number"
											value={userProfile.age || ""}
											onChange={(e) =>
												setUserProfile((prev) => ({
													...prev,
													age: Number.parseInt(e.target.value),
												}))
											}
											placeholder="35"
										/>
									</div>

									<div>
										<Label htmlFor="gender">Płeć</Label>
										<Select
											value={userProfile.gender}
											onValueChange={(value) =>
												setUserProfile((prev) => ({
													...prev,
													gender: value as any,
												}))
											}
										>
											<SelectTrigger>
												<SelectValue placeholder="Wybierz płeć" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="male">Mężczyzna</SelectItem>
												<SelectItem value="female">Kobieta</SelectItem>
												<SelectItem value="other">
													Inna/Wolę nie podawać
												</SelectItem>
											</SelectContent>
										</Select>
									</div>

									<div>
										<Label htmlFor="activity">Poziom aktywności</Label>
										<Select
											value={userProfile.lifestyle?.activityLevel}
											onValueChange={(value) =>
												setUserProfile((prev) => ({
													...prev,
													lifestyle: {
														...prev.lifestyle!,
														activityLevel: value as any,
													},
												}))
											}
										>
											<SelectTrigger>
												<SelectValue placeholder="Wybierz poziom aktywności" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="sedentary">Siedzący</SelectItem>
												<SelectItem value="light">Lekko aktywny</SelectItem>
												<SelectItem value="moderate">
													Umiarkowanie aktywny
												</SelectItem>
												<SelectItem value="active">Aktywny</SelectItem>
												<SelectItem value="very_active">
													Bardzo aktywny
												</SelectItem>
											</SelectContent>
										</Select>
									</div>

									<div>
										<Label htmlFor="stress">Poziom stresu (1-5)</Label>
										<Select
											value={userProfile.lifestyle?.stressLevel?.toString()}
											onValueChange={(value) =>
												setUserProfile((prev) => ({
													...prev,
													lifestyle: {
														...prev.lifestyle!,
														stressLevel: Number.parseInt(value) as any,
													},
												}))
											}
										>
											<SelectTrigger>
												<SelectValue placeholder="Wybierz poziom stresu" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="1">1 - Bardzo niski</SelectItem>
												<SelectItem value="2">2 - Niski</SelectItem>
												<SelectItem value="3">3 - Umiarkowany</SelectItem>
												<SelectItem value="4">4 - Wysoki</SelectItem>
												<SelectItem value="5">5 - Bardzo wysoki</SelectItem>
											</SelectContent>
										</Select>
									</div>
								</div>
							</div>

							<div className="flex justify-end">
								<Button onClick={() => setCurrentStep(2)}>Dalej</Button>
							</div>
						</div>
					)}

					{/* Step 2: Health Goals */}
					{currentStep === 2 && (
						<div className="space-y-6">
							<div>
								<h4 className="mb-4 flex items-center gap-2 font-medium text-md">
									<Target className="h-4 w-4" />
									Cele zdrowotne
								</h4>

								<div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-2">
									{healthGoalOptions.map((option) => {
										const isSelected = userProfile.healthGoals?.some(
											(goal) => goal.id === option.id,
										);
										return (
											<div
												key={option.id}
												className={`cursor-pointer rounded-lg border p-3 transition-colors ${
													isSelected
														? "border-blue-500 bg-blue-50"
														: "border-gray-200 hover:border-gray-300"
												}`}
												onClick={() =>
													isSelected
														? removeHealthGoal(option.id)
														: addHealthGoal(option)
												}
											>
												<div className="flex items-center justify-between">
													<div>
														<h5 className="font-medium text-sm">
															{option.polishGoal}
														</h5>
														<p className="text-gray-600 text-xs">
															{option.goal}
														</p>
													</div>
													<Checkbox checked={isSelected} disabled />
												</div>
											</div>
										);
									})}
								</div>

								{/* Selected goals with priority */}
								{userProfile.healthGoals &&
									userProfile.healthGoals.length > 0 && (
										<div>
											<h5 className="mb-2 font-medium">
												Wybrane cele (ustaw priorytety):
											</h5>
											<div className="space-y-2">
												{userProfile.healthGoals.map((goal) => (
													<div
														key={goal.id}
														className="flex items-center justify-between rounded-lg border p-3"
													>
														<span className="text-sm">{goal.polishGoal}</span>
														<div className="flex items-center gap-2">
															<Select
																value={goal.priority}
																onValueChange={(value) =>
																	updateHealthGoalPriority(
																		goal.id,
																		value as any,
																	)
																}
															>
																<SelectTrigger className="w-32">
																	<SelectValue />
																</SelectTrigger>
																<SelectContent>
																	<SelectItem value="low">Niski</SelectItem>
																	<SelectItem value="medium">Średni</SelectItem>
																	<SelectItem value="high">Wysoki</SelectItem>
																</SelectContent>
															</Select>
															<Badge
																className={getPriorityColor(goal.priority)}
															>
																{goal.priority === "high"
																	? "Wysoki"
																	: goal.priority === "medium"
																		? "Średni"
																		: "Niski"}
															</Badge>
														</div>
													</div>
												))}
											</div>
										</div>
									)}
							</div>

							<div className="flex justify-between">
								<Button variant="outline" onClick={() => setCurrentStep(1)}>
									Wstecz
								</Button>
								<Button
									onClick={() => setCurrentStep(3)}
									disabled={
										!userProfile.healthGoals ||
										userProfile.healthGoals.length === 0
									}
								>
									Dalej
								</Button>
							</div>
						</div>
					)}

					{/* Step 3: Preferences & Budget */}
					{currentStep === 3 && (
						<div className="space-y-6">
							<div>
								<h4 className="mb-4 flex items-center gap-2 font-medium text-md">
									<Settings className="h-4 w-4" />
									Preferencje i budżet
								</h4>

								<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
									<div>
										<Label htmlFor="budget">Miesięczny budżet (€)</Label>
										<div className="mt-1 flex gap-2">
											<Input
												placeholder="Min"
												type="number"
												value={userProfile.preferences?.budgetRange.min || ""}
												onChange={(e) =>
													setUserProfile((prev) => ({
														...prev,
														preferences: {
															...prev.preferences!,
															budgetRange: {
																min: Number.parseInt(e.target.value) || 0,
																max: prev.preferences?.budgetRange?.max || 100,
																currency:
																	prev.preferences?.budgetRange?.currency ||
																	"EUR",
															},
														},
													}))
												}
											/>
											<Input
												placeholder="Max"
												type="number"
												value={userProfile.preferences?.budgetRange.max || ""}
												onChange={(e) =>
													setUserProfile((prev) => ({
														...prev,
														preferences: {
															...prev.preferences!,
															budgetRange: {
																min: prev.preferences?.budgetRange?.min || 0,
																max: Number.parseInt(e.target.value) || 100,
																currency:
																	prev.preferences?.budgetRange?.currency ||
																	"EUR",
															},
														},
													}))
												}
											/>
										</div>
									</div>

									<div>
										<Label htmlFor="maxSupplements">
											Maksymalna liczba suplementów dziennie
										</Label>
										<Input
											id="maxSupplements"
											type="number"
											value={userProfile.preferences?.maxDailySupplements || ""}
											onChange={(e) =>
												setUserProfile((prev) => ({
													...prev,
													preferences: {
														...prev.preferences!,
														maxDailySupplements:
															Number.parseInt(e.target.value) || 5,
													},
												}))
											}
										/>
									</div>
								</div>

								<div className="mt-4 space-y-3">
									<div className="flex items-center space-x-2">
										<Checkbox
											id="organic"
											checked={
												userProfile.preferences?.organicPreference || false
											}
											onCheckedChange={(checked) =>
												setUserProfile((prev) => ({
													...prev,
													preferences: {
														...prev.preferences!,
														organicPreference: checked as boolean,
													},
												}))
											}
										/>
										<Label htmlFor="organic">
											Preferuję produkty organiczne
										</Label>
									</div>

									<div className="flex items-center space-x-2">
										<Checkbox
											id="vegan"
											checked={
												userProfile.preferences?.veganPreference || false
											}
											onCheckedChange={(checked) =>
												setUserProfile((prev) => ({
													...prev,
													preferences: {
														...prev.preferences!,
														veganPreference: checked as boolean,
													},
												}))
											}
										/>
										<Label htmlFor="vegan">Preferuję produkty wegańskie</Label>
									</div>
								</div>
							</div>

							<div className="flex justify-between">
								<Button variant="outline" onClick={() => setCurrentStep(2)}>
									Wstecz
								</Button>
								<Button onClick={generateRecommendations} disabled={loading}>
									{loading ? "Generowanie..." : "Generuj rekomendacje"}
								</Button>
							</div>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Recommendations Results */}
			{recommendations.length > 0 && (
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Lightbulb className="h-5 w-5" />
							Twoje spersonalizowane rekomendacje
						</CardTitle>
						<p className="text-gray-600 text-sm">
							Znaleźliśmy {recommendations.length} suplementów dopasowanych do
							Twoich potrzeb.
						</p>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{recommendations.map((recommendation, index) => (
								<Card
									key={index}
									className="cursor-pointer transition-shadow hover:shadow-md"
								>
									<CardHeader className="pb-3">
										<div className="flex items-start justify-between">
											<div className="flex-1">
												<CardTitle className="text-lg">
													{recommendation.supplement.polishName}
												</CardTitle>
												<p className="mt-1 text-gray-600 text-sm">
													{recommendation.supplement.name}
												</p>
											</div>
											<div className="flex items-center gap-2">
												<div className="text-right">
													<div
														className={`font-bold text-lg ${getScoreColor(recommendation.score)}`}
													>
														{recommendation.score.toFixed(0)}%
													</div>
													<div className="text-gray-500 text-xs">
														{formatRecommendationScore(recommendation.score)}
													</div>
												</div>
												<Progress
													value={recommendation.score}
													className="w-16"
												/>
											</div>
										</div>
									</CardHeader>

									<CardContent className="space-y-4">
										{/* Primary reasons */}
										<div>
											<h5 className="mb-2 font-medium text-sm">
												Dlaczego to dla Ciebie:
											</h5>
											<ul className="space-y-1 text-gray-700 text-sm">
												{recommendation.reasoning.polishPrimaryReasons
													.slice(0, 3)
													.map((reason, idx) => (
														<li key={idx} className="flex items-start gap-2">
															<CheckCircle className="mt-1 h-3 w-3 text-green-500" />
															{reason}
														</li>
													))}
											</ul>
										</div>

										{/* Expected benefits */}
										<div>
											<h5 className="mb-2 font-medium text-sm">
												Oczekiwane korzyści:
											</h5>
											<div className="flex flex-wrap gap-2">
												{recommendation.expectedBenefits
													.slice(0, 3)
													.map((benefit, idx) => (
														<Badge
															key={idx}
															variant="outline"
															className="text-xs"
														>
															{benefit.polishBenefit} (
															{Math.round(benefit.probability * 100)}%)
														</Badge>
													))}
											</div>
										</div>

										{/* Warnings */}
										{recommendation.warnings.length > 0 &&
											recommendation.warnings[0] && (
												<Alert className="border-orange-200 bg-orange-50">
													<AlertTriangle className="h-4 w-4 text-orange-600" />
													<AlertDescription className="text-sm">
														<strong>Uwagi:</strong>{" "}
														{recommendation.warnings[0].polishMessage}
													</AlertDescription>
												</Alert>
											)}

										{/* Cost and timeline */}
										<div className="flex items-center justify-between text-sm">
											<div className="flex items-center gap-4">
												<span className="flex items-center gap-1">
													<Euro className="h-3 w-3" />
													{recommendation.costAnalysis.monthlyEstimate}€/miesiąc
												</span>
												<span className="flex items-center gap-1">
													<Clock className="h-3 w-3" />
													Efekt:{" "}
													{recommendation.expectedBenefits[0]
														?.polishTimeToEffect || "4-8 tygodni"}
												</span>
											</div>

											<div className="flex gap-2">
												<Button
													size="sm"
													variant="outline"
													onClick={() =>
														setSelectedRecommendation(recommendation)
													}
												>
													Szczegóły
												</Button>
												{onAddToStack && (
													<Button
														size="sm"
														onClick={() =>
															onAddToStack(recommendation.supplement.id)
														}
													>
														Dodaj do stosu
													</Button>
												)}
											</div>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					</CardContent>
				</Card>
			)}

			{/* Detailed recommendation modal/panel would go here */}
			{selectedRecommendation && (
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center justify-between">
							Szczegółowa analiza:{" "}
							{selectedRecommendation.supplement.polishName}
							<Button
								variant="ghost"
								size="sm"
								onClick={() => setSelectedRecommendation(null)}
							>
								✕
							</Button>
						</CardTitle>
					</CardHeader>
					<CardContent>
						<Tabs defaultValue="reasoning">
							<TabsList className="grid w-full grid-cols-4">
								<TabsTrigger value="reasoning">Uzasadnienie</TabsTrigger>
								<TabsTrigger value="dosage">Dawkowanie</TabsTrigger>
								<TabsTrigger value="timeline">Harmonogram</TabsTrigger>
								<TabsTrigger value="cost">Koszt</TabsTrigger>
							</TabsList>

							<TabsContent value="reasoning" className="space-y-4">
								<div>
									<h5 className="mb-2 font-medium">Dowody naukowe:</h5>
									<p className="text-gray-700 text-sm">
										{
											selectedRecommendation.reasoning.evidenceSupport
												.polishDescription
										}
									</p>
								</div>

								<div>
									<h5 className="mb-2 font-medium">
										Czynniki personalizowane:
									</h5>
									<ul className="space-y-1 text-gray-700 text-sm">
										{selectedRecommendation.reasoning.polishPersonalizedFactors.map(
											(factor, idx) => (
												<li key={idx} className="flex items-start gap-2">
													<span className="mt-1 text-blue-500">•</span>
													{factor}
												</li>
											),
										)}
									</ul>
								</div>
							</TabsContent>

							<TabsContent value="dosage" className="space-y-4">
								<div className="grid grid-cols-2 gap-4">
									<div>
										<h5 className="mb-1 font-medium">Dawka początkowa:</h5>
										<p className="text-sm">
											{
												selectedRecommendation.dosageRecommendation
													.polishStartingDose
											}
										</p>
									</div>
									<div>
										<h5 className="mb-1 font-medium">Dawka docelowa:</h5>
										<p className="text-sm">
											{
												selectedRecommendation.dosageRecommendation
													.polishTargetDose
											}
										</p>
									</div>
								</div>

								<div>
									<h5 className="mb-2 font-medium">Timing:</h5>
									<div className="flex flex-wrap gap-2">
										{selectedRecommendation.dosageRecommendation.polishTiming.map(
											(timing, idx) => (
												<Badge key={idx} variant="outline">
													{timing}
												</Badge>
											),
										)}
									</div>
								</div>

								{selectedRecommendation.dosageRecommendation.withFood && (
									<Alert className="border-blue-200 bg-blue-50">
										<Info className="h-4 w-4 text-blue-600" />
										<AlertDescription>
											Zalecane przyjmowanie z posiłkiem dla lepszego
											wchłaniania.
										</AlertDescription>
									</Alert>
								)}
							</TabsContent>

							<TabsContent value="timeline" className="space-y-4">
								{selectedRecommendation.timeline.phases.map((phase, idx) => (
									<div key={idx} className="rounded-lg border p-3">
										<div className="mb-2 flex items-center justify-between">
											<h5 className="font-medium">{phase.polishPhase}</h5>
											<Badge variant="outline">{phase.polishDuration}</Badge>
										</div>
										<ul className="space-y-1 text-gray-700 text-sm">
											{phase.polishExpectedChanges.map((change, changeIdx) => (
												<li key={changeIdx} className="flex items-start gap-2">
													<span className="mt-1 text-green-500">•</span>
													{change}
												</li>
											))}
										</ul>
									</div>
								))}
							</TabsContent>

							<TabsContent value="cost" className="space-y-4">
								<div className="grid grid-cols-2 gap-4">
									<div className="rounded-lg border p-4 text-center">
										<div className="font-bold text-2xl text-blue-600">
											{selectedRecommendation.costAnalysis.monthlyEstimate}€
										</div>
										<div className="text-gray-600 text-sm">
											Miesięczny koszt
										</div>
									</div>
									<div className="rounded-lg border p-4 text-center">
										<div className="font-bold text-2xl text-green-600">
											{selectedRecommendation.costAnalysis.polishBudgetFit}
										</div>
										<div className="text-gray-600 text-sm">
											Dopasowanie do budżetu
										</div>
									</div>
								</div>

								<div>
									<h5 className="mb-2 font-medium">
										Wskazówki oszczędnościowe:
									</h5>
									<ul className="space-y-1 text-gray-700 text-sm">
										{selectedRecommendation.costAnalysis.polishCostOptimizationTips.map(
											(tip, idx) => (
												<li key={idx} className="flex items-start gap-2">
													<span className="mt-1 text-yellow-500">💡</span>
													{tip}
												</li>
											),
										)}
									</ul>
								</div>
							</TabsContent>
						</Tabs>
					</CardContent>
				</Card>
			)}
		</div>
	);
};

export default AIRecommendationInterface;
