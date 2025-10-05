"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
	AlertTriangle,
	Award,
	BookOpen,
	Brain,
	CheckCircle,
	Eye,
	Lightbulb,
	RefreshCw,
	Target,
	TrendingUp,
	XCircle,
} from "lucide-react";
import type React from "react";
import { useCallback, useMemo, useState } from "react";

interface BiasScenario {
	id: string;
	title: string;
	polishTitle: string;
	description: string;
	polishDescription: string;
	scenario: string;
	polishScenario: string;
	biasType: string;
	polishBiasType: string;
	severity: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
	polishSeverity: string;

	questions: Array<{
		id: string;
		question: string;
		polishQuestion: string;
		type: "MULTIPLE_CHOICE" | "TRUE_FALSE" | "REFLECTION";
		options?: Array<{
			id: string;
			text: string;
			polishText: string;
			isCorrect: boolean;
			explanation: string;
			polishExplanation: string;
		}>;
		correctAnswer?: string;
		points: number;
	}>;

	mitigation: {
		strategy: string;
		polishStrategy: string;
		steps: string[];
		polishSteps: string[];
		practicalTips: string[];
		polishPracticalTips: string[];
	};

	supplementContext: {
		relevance: string;
		polishRelevance: string;
		examples: string[];
		polishExamples: string[];
		preventionTips: string[];
		polishPreventionTips: string[];
	};
}

interface UserResponse {
	questionId: string;
	answer: string;
	isCorrect: boolean;
	timeSpent: number;
	reflection?: string;
}

interface CognitiveBiasDetectorProps {
	scenarios: BiasScenario[];
	onScenarioComplete: (
		scenarioId: string,
		responses: UserResponse[],
		score: number,
	) => void;
	onBiasDetected: (biasType: string, severity: string) => void;
	userProgress?: {
		completedScenarios: string[];
		totalScore: number;
		biasesIdentified: string[];
	};
	className?: string;
}

const CognitiveBiasDetector: React.FC<CognitiveBiasDetectorProps> = ({
	scenarios,
	onScenarioComplete,
	onBiasDetected,
	userProgress,
	className = "",
}) => {
	const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [userResponses, setUserResponses] = useState<UserResponse[]>([]);
	const [currentAnswer, setCurrentAnswer] = useState<string>("");
	const [reflection, setReflection] = useState<string>("");
	const [showExplanation, setShowExplanation] = useState(false);
	const [scenarioStartTime] = useState(Date.now());
	const [questionStartTime, setQuestionStartTime] = useState(Date.now());
	const [isCompleted, setIsCompleted] = useState(false);

	const currentScenario = scenarios[currentScenarioIndex];
	const currentQuestion = currentScenario?.questions[currentQuestionIndex];
	const isLastQuestion =
		currentQuestionIndex === (currentScenario?.questions.length || 0) - 1;
	const isLastScenario = currentScenarioIndex === scenarios.length - 1;

	// Calculate progress
	const overallProgress = useMemo(() => {
		const totalQuestions = scenarios.reduce(
			(sum, scenario) => sum + scenario.questions.length,
			0,
		);
		const completedQuestions = userResponses.length;
		return (completedQuestions / totalQuestions) * 100;
	}, [scenarios, userResponses]);

	const scenarioProgress = useMemo(() => {
		if (!currentScenario) return 0;
		return (
			((currentQuestionIndex + (showExplanation ? 1 : 0)) /
				currentScenario.questions.length) *
			100
		);
	}, [currentScenario, currentQuestionIndex, showExplanation]);

	// Get severity styling
	const getSeverityStyle = (severity: string) => {
		switch (severity) {
			case "CRITICAL":
				return "bg-red-100 text-red-800 border-red-200";
			case "HIGH":
				return "bg-orange-100 text-orange-800 border-orange-200";
			case "MODERATE":
				return "bg-yellow-100 text-yellow-800 border-yellow-200";
			case "LOW":
				return "bg-green-100 text-green-800 border-green-200";
			default:
				return "bg-gray-100 text-gray-800 border-gray-200";
		}
	};

	const getSeverityIcon = (severity: string) => {
		switch (severity) {
			case "CRITICAL":
				return <AlertTriangle className="h-4 w-4 text-red-600" />;
			case "HIGH":
				return <AlertTriangle className="h-4 w-4 text-orange-600" />;
			case "MODERATE":
				return <Eye className="h-4 w-4 text-yellow-600" />;
			case "LOW":
				return <CheckCircle className="h-4 w-4 text-green-600" />;
			default:
				return <Brain className="h-4 w-4 text-gray-600" />;
		}
	};

	// Handle answer submission
	const handleAnswerSubmit = useCallback(() => {
		if (!currentQuestion || !currentAnswer) return;

		const timeSpent = Date.now() - questionStartTime;
		let isCorrect = false;

		if (
			currentQuestion.type === "MULTIPLE_CHOICE" ||
			currentQuestion.type === "TRUE_FALSE"
		) {
			const selectedOption = currentQuestion.options?.find(
				(opt) => opt.id === currentAnswer,
			);
			isCorrect = selectedOption?.isCorrect || false;
		}

		const response: UserResponse = {
			questionId: currentQuestion.id,
			answer: currentAnswer,
			isCorrect,
			timeSpent,
			reflection:
				currentQuestion.type === "REFLECTION" ? reflection : undefined,
		};

		setUserResponses((prev) => [...prev, response]);
		setShowExplanation(true);

		// Detect bias if answer indicates bias presence
		if (!isCorrect && currentQuestion.type !== "REFLECTION") {
			onBiasDetected(currentScenario.biasType, currentScenario.severity);
		}
	}, [
		currentQuestion,
		currentAnswer,
		reflection,
		questionStartTime,
		currentScenario,
		onBiasDetected,
	]);

	// Move to next question or scenario
	const handleNext = useCallback(() => {
		setShowExplanation(false);
		setCurrentAnswer("");
		setReflection("");
		setQuestionStartTime(Date.now());

		if (isLastQuestion && currentScenario) {
			// Complete current scenario
			const scenarioResponses = userResponses.slice(
				-currentScenario.questions.length,
			);
			const score =
				(scenarioResponses.filter((r) => r.isCorrect).length /
					scenarioResponses.length) *
				100;

			onScenarioComplete(currentScenario.id, scenarioResponses, score);

			if (isLastScenario) {
				setIsCompleted(true);
			} else {
				setCurrentScenarioIndex((prev) => prev + 1);
				setCurrentQuestionIndex(0);
			}
		} else {
			setCurrentQuestionIndex((prev) => prev + 1);
		}
	}, [
		isLastQuestion,
		isLastScenario,
		userResponses,
		currentScenario,
		onScenarioComplete,
	]);

	// Reset detector
	const handleReset = useCallback(() => {
		setCurrentScenarioIndex(0);
		setCurrentQuestionIndex(0);
		setUserResponses([]);
		setCurrentAnswer("");
		setReflection("");
		setShowExplanation(false);
		setIsCompleted(false);
		setQuestionStartTime(Date.now());
	}, []);

	// Calculate final score
	const finalScore = useMemo(() => {
		if (userResponses.length === 0) return 0;
		return (
			(userResponses.filter((r) => r.isCorrect).length / userResponses.length) *
			100
		);
	}, [userResponses]);

	if (!currentScenario) {
		return (
			<Card className={cn("w-full", className)}>
				<CardContent className="flex items-center justify-center py-12">
					<div className="text-center">
						<Brain className="mx-auto mb-4 h-12 w-12 text-gray-400" />
						<h3 className="mb-2 font-medium text-gray-900 text-lg">
							Brak scenariuszy
						</h3>
						<p className="text-gray-600">
							Nie znaleziono scenariuszy do analizy błędów poznawczych.
						</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	if (isCompleted) {
		return (
			<Card className={cn("w-full", className)}>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Award className="h-5 w-5 text-yellow-500" />
						Analiza błędów poznawczych zakończona
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-6">
						<div className="text-center">
							<div className="mb-2 font-bold text-4xl text-blue-600">
								{Math.round(finalScore)}%
							</div>
							<p className="text-gray-600">Ogólny wynik rozpoznawania błędów</p>
						</div>

						<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
							<Card>
								<CardContent className="p-4 text-center">
									<div className="mb-1 font-bold text-2xl text-green-600">
										{userResponses.filter((r) => r.isCorrect).length}
									</div>
									<p className="text-gray-600 text-sm">Poprawne odpowiedzi</p>
								</CardContent>
							</Card>

							<Card>
								<CardContent className="p-4 text-center">
									<div className="mb-1 font-bold text-2xl text-orange-600">
										{scenarios.length}
									</div>
									<p className="text-gray-600 text-sm">
										Przeanalizowane scenariusze
									</p>
								</CardContent>
							</Card>

							<Card>
								<CardContent className="p-4 text-center">
									<div className="mb-1 font-bold text-2xl text-purple-600">
										{Math.round(
											userResponses.reduce((sum, r) => sum + r.timeSpent, 0) /
												60000,
										)}
									</div>
									<p className="text-gray-600 text-sm">Minut analizy</p>
								</CardContent>
							</Card>
						</div>

						<div className="space-y-4">
							<h3 className="font-medium text-lg">Kluczowe spostrzeżenia</h3>

							{finalScore >= 80 && (
								<div className="rounded-lg border border-green-200 bg-green-50 p-4">
									<div className="mb-2 flex items-center gap-2">
										<CheckCircle className="h-4 w-4 text-green-600" />
										<span className="font-medium text-green-800">
											Doskonała świadomość błędów
										</span>
									</div>
									<p className="text-green-700 text-sm">
										Wykazujesz wysoką świadomość błędów poznawczych i
										umiejętność ich rozpoznawania w kontekście suplementów.
									</p>
								</div>
							)}

							{finalScore >= 60 && finalScore < 80 && (
								<div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
									<div className="mb-2 flex items-center gap-2">
										<Eye className="h-4 w-4 text-yellow-600" />
										<span className="font-medium text-yellow-800">
											Dobra świadomość
										</span>
									</div>
									<p className="text-sm text-yellow-700">
										Masz solidne podstawy w rozpoznawaniu błędów poznawczych.
										Kontynuuj naukę dla lepszych wyników.
									</p>
								</div>
							)}

							{finalScore < 60 && (
								<div className="rounded-lg border border-red-200 bg-red-50 p-4">
									<div className="mb-2 flex items-center gap-2">
										<AlertTriangle className="h-4 w-4 text-red-600" />
										<span className="font-medium text-red-800">
											Potrzeba więcej praktyki
										</span>
									</div>
									<p className="text-red-700 text-sm">
										Błędy poznawcze mogą znacząco wpływać na twoje decyzje
										dotyczące suplementów. Zalecamy dodatkową naukę.
									</p>
								</div>
							)}
						</div>

						<div className="flex justify-center">
							<Button onClick={handleReset} className="flex items-center gap-2">
								<RefreshCw className="h-4 w-4" />
								Spróbuj ponownie
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className={cn("mx-auto w-full max-w-4xl space-y-6", className)}>
			{/* Progress Header */}
			<Card>
				<CardHeader className="pb-4">
					<div className="flex items-center justify-between">
						<CardTitle className="flex items-center gap-2">
							<Brain className="h-5 w-5" />
							Detektor błędów poznawczych
						</CardTitle>
						<Badge className={getSeverityStyle(currentScenario.severity)}>
							{getSeverityIcon(currentScenario.severity)}
							<span className="ml-1">{currentScenario.polishSeverity}</span>
						</Badge>
					</div>

					<div className="space-y-2">
						<div className="flex items-center justify-between text-sm">
							<span>Postęp ogólny</span>
							<span>{Math.round(overallProgress)}%</span>
						</div>
						<Progress value={overallProgress} className="h-2" />
					</div>

					<div className="space-y-2">
						<div className="flex items-center justify-between text-sm">
							<span>Scenariusz: {currentScenario.polishTitle}</span>
							<span>{Math.round(scenarioProgress)}%</span>
						</div>
						<Progress value={scenarioProgress} className="h-2" />
					</div>
				</CardHeader>
			</Card>

			{/* Scenario Content */}
			<Card>
				<CardHeader>
					<CardTitle className="text-lg">
						{currentScenario.polishTitle}
					</CardTitle>
					<p className="text-gray-600">{currentScenario.polishDescription}</p>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
							<h4 className="mb-2 font-medium text-blue-800">Scenariusz</h4>
							<p className="text-blue-700">{currentScenario.polishScenario}</p>
						</div>

						<div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
							<h4 className="mb-2 font-medium text-orange-800">
								Kontekst suplementów
							</h4>
							<p className="text-orange-700">
								{currentScenario.supplementContext.polishRelevance}
							</p>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Question */}
			{currentQuestion && (
				<Card>
					<CardHeader>
						<CardTitle className="text-base">
							Pytanie {currentQuestionIndex + 1} z{" "}
							{currentScenario.questions.length}
						</CardTitle>
						<p className="text-gray-700">{currentQuestion.polishQuestion}</p>
					</CardHeader>
					<CardContent>
						{!showExplanation ? (
							<div className="space-y-4">
								{currentQuestion.type === "MULTIPLE_CHOICE" && (
									<RadioGroup
										value={currentAnswer}
										onValueChange={setCurrentAnswer}
									>
										{currentQuestion.options?.map((option) => (
											<div
												key={option.id}
												className="flex items-center space-x-2"
											>
												<RadioGroupItem value={option.id} id={option.id} />
												<Label
													htmlFor={option.id}
													className="cursor-pointer text-sm"
												>
													{option.polishText}
												</Label>
											</div>
										))}
									</RadioGroup>
								)}

								{currentQuestion.type === "TRUE_FALSE" && (
									<RadioGroup
										value={currentAnswer}
										onValueChange={setCurrentAnswer}
									>
										<div className="flex items-center space-x-2">
											<RadioGroupItem value="true" id="true" />
											<Label htmlFor="true" className="cursor-pointer text-sm">
												Prawda
											</Label>
										</div>
										<div className="flex items-center space-x-2">
											<RadioGroupItem value="false" id="false" />
											<Label htmlFor="false" className="cursor-pointer text-sm">
												Fałsz
											</Label>
										</div>
									</RadioGroup>
								)}

								{currentQuestion.type === "REFLECTION" && (
									<div>
										<Label htmlFor="reflection" className="font-medium text-sm">
											Twoja refleksja
										</Label>
										<Textarea
											id="reflection"
											placeholder="Opisz swoje myśli i obserwacje..."
											value={reflection}
											onChange={(e) => setReflection(e.target.value)}
											className="mt-2 min-h-24"
										/>
									</div>
								)}

								<Button
									onClick={handleAnswerSubmit}
									disabled={!currentAnswer && !reflection}
									className="w-full"
								>
									Potwierdź odpowiedź
								</Button>
							</div>
						) : (
							<div className="space-y-4">
								{currentQuestion.type !== "REFLECTION" && (
									<div
										className={cn("rounded-lg border p-4", {
											"border-green-200 bg-green-50":
												userResponses[userResponses.length - 1]?.isCorrect,
											"border-red-200 bg-red-50":
												!userResponses[userResponses.length - 1]?.isCorrect,
										})}
									>
										<div className="mb-2 flex items-center gap-2">
											{userResponses[userResponses.length - 1]?.isCorrect ? (
												<CheckCircle className="h-4 w-4 text-green-600" />
											) : (
												<XCircle className="h-4 w-4 text-red-600" />
											)}
											<span className="font-medium">
												{userResponses[userResponses.length - 1]?.isCorrect
													? "Poprawna odpowiedź!"
													: "Niepoprawna odpowiedź"}
											</span>
										</div>

										{currentQuestion.options && (
											<div className="text-sm">
												{currentQuestion.options.map((option) => (
													<div
														key={option.id}
														className={cn("rounded p-2", {
															"bg-green-100": option.isCorrect,
															"bg-red-100":
																option.id === currentAnswer &&
																!option.isCorrect,
														})}
													>
														<p className="font-medium">{option.polishText}</p>
														{(option.isCorrect ||
															option.id === currentAnswer) && (
															<p className="mt-1 text-gray-600 text-xs">
																{option.polishExplanation}
															</p>
														)}
													</div>
												))}
											</div>
										)}
									</div>
								)}

								<div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
									<h4 className="mb-2 flex items-center gap-2 font-medium text-blue-800">
										<Lightbulb className="h-4 w-4" />
										Strategia mitygacji
									</h4>
									<p className="mb-3 text-blue-700">
										{currentScenario.mitigation.polishStrategy}
									</p>
									<div className="space-y-2">
										{currentScenario.mitigation.polishSteps.map(
											(step, index) => (
												<div
													key={index}
													className="flex items-start gap-2 text-sm"
												>
													<span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-200 font-medium text-blue-800 text-xs">
														{index + 1}
													</span>
													<span className="text-blue-700">{step}</span>
												</div>
											),
										)}
									</div>
								</div>

								<Button onClick={handleNext} className="w-full">
									{isLastQuestion
										? isLastScenario
											? "Zakończ analizę"
											: "Następny scenariusz"
										: "Następne pytanie"}
								</Button>
							</div>
						)}
					</CardContent>
				</Card>
			)}

			{/* Supplement Context Tips */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-base">
						<Target className="h-4 w-4" />
						Wskazówki dotyczące suplementów
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-3">
						{currentScenario.supplementContext.polishPreventionTips.map(
							(tip, index) => (
								<div key={index} className="flex items-start gap-2 text-sm">
									<CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
									<span>{tip}</span>
								</div>
							),
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default CognitiveBiasDetector;
