"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import type { QuizAttempt, QuizQuestion, QuizResult } from "@/types/education";
import {
	Award,
	BookOpen,
	CheckCircle,
	ChevronLeft,
	ChevronRight,
	Clock,
	Flag,
	HelpCircle,
	Lightbulb,
	RotateCcw,
	TrendingUp,
	XCircle,
} from "lucide-react";
import React, { useState, useEffect, useCallback, useMemo } from "react";

interface QuizEngineProps {
	questions: QuizQuestion[];
	passingScore?: number;
	timeLimit?: number; // in minutes
	randomizeOrder?: boolean;
	showResults?: boolean;
	onComplete?: (result: QuizResult) => void;
	onQuestionAttempt?: (attempt: QuizAttempt) => void;
	title?: string;
	description?: string;
}

type AnswerState = "unanswered" | "answered" | "flagged";

interface QuestionState {
	id: string;
	answer: string | string[];
	flagged: boolean;
	timeSpent: number;
	hintsUsed: number;
}

export default function QuizEngine({
	questions,
	passingScore = 70,
	timeLimit,
	randomizeOrder = false,
	showResults = true,
	onComplete,
	onQuestionAttempt,
	title = "Quiz",
	description,
}: QuizEngineProps) {
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [questionStates, setQuestionStates] = useState<
		Record<string, QuestionState>
	>({});
	const [startTime] = useState(Date.now());
	const [timeRemaining, setTimeRemaining] = useState<number | null>(
		timeLimit ? timeLimit * 60 * 1000 : null, // convert minutes to milliseconds
	);
	const [quizCompleted, setQuizCompleted] = useState(false);
	const [showHint, setShowHint] = useState(false);

	// Prepare questions
	const quizQuestions = useMemo(() => {
		let shuffled = [...questions];
		if (randomizeOrder) {
			shuffled = shuffled.sort(() => Math.random() - 0.5);
		}
		return shuffled;
	}, [questions, randomizeOrder]);

	const currentQuestion = quizQuestions[currentQuestionIndex];
	const currentState = currentQuestion?.id
		? questionStates[currentQuestion.id]
		: undefined;

	// Timer effect
	useEffect(() => {
		if (!timeRemaining || quizCompleted) return;

		const timer = setInterval(() => {
			setTimeRemaining((prev) => {
				if (prev && prev <= 1000) {
					handleQuizComplete();
					return 0;
				}
				return prev ? prev - 1000 : null;
			});
		}, 1000);

		return () => clearInterval(timer);
	}, [timeRemaining, quizCompleted]);

	// Auto-save progress periodically
	useEffect(() => {
		const interval = setInterval(() => {
			if (currentQuestion && currentState) {
				const attempt: QuizAttempt = {
					id: `attempt_${Date.now()}`,
					userId: "current_user", // This would come from auth context
					moduleId: "current_module",
					questionId: currentQuestion.id,
					answer: currentState.answer,
					isCorrect: checkAnswer(currentQuestion, currentState.answer),
					timeSpent: currentState.timeSpent,
					hintsUsed: currentState.hintsUsed,
					timestamp: new Date().toISOString(),
				};
				onQuestionAttempt?.(attempt);
			}
		}, 30000); // Auto-save every 30 seconds

		return () => clearInterval(interval);
	}, [currentQuestion, currentState, onQuestionAttempt]);

	const formatTime = (milliseconds: number) => {
		const minutes = Math.floor(milliseconds / 60000);
		const seconds = Math.floor((milliseconds % 60000) / 1000);
		return `${minutes}:${seconds.toString().padStart(2, "0")}`;
	};

	const checkAnswer = (
		question: QuizQuestion,
		answer: string | string[],
	): boolean => {
		if (Array.isArray(question.correctAnswer) && Array.isArray(answer)) {
			return (
				question.correctAnswer.length === answer.length &&
				question.correctAnswer.every((ans) => answer.includes(ans.toString()))
			);
		}
		return question.correctAnswer === answer;
	};

	const handleAnswerSelect = (answer: string | string[]) => {
		if (!currentQuestion) return;

		setQuestionStates((prev) => ({
			...prev,
			[currentQuestion.id]: {
				id: currentQuestion.id,
				answer,
				flagged: prev[currentQuestion.id]?.flagged || false,
				timeSpent: prev[currentQuestion.id]?.timeSpent || 0,
				hintsUsed: prev[currentQuestion.id]?.hintsUsed || 0,
			},
		}));
	};

	const handleHintToggle = () => {
		if (!currentQuestion) return;

		setShowHint(!showHint);
		setQuestionStates((prev) => ({
			...prev,
			[currentQuestion.id]: {
				id: currentQuestion.id,
				answer: prev[currentQuestion.id]?.answer || "",
				flagged: prev[currentQuestion.id]?.flagged || false,
				timeSpent: prev[currentQuestion.id]?.timeSpent || 0,
				hintsUsed: (prev[currentQuestion.id]?.hintsUsed || 0) + 1,
			},
		}));
	};

	const handleFlagQuestion = () => {
		if (!currentQuestion) return;

		setQuestionStates((prev) => ({
			...prev,
			[currentQuestion.id]: {
				id: currentQuestion.id,
				answer: prev[currentQuestion.id]?.answer || "",
				flagged: !prev[currentQuestion.id]?.flagged,
				timeSpent: prev[currentQuestion.id]?.timeSpent || 0,
				hintsUsed: prev[currentQuestion.id]?.hintsUsed || 0,
			},
		}));
	};

	const handleNext = () => {
		if (currentQuestionIndex < quizQuestions.length - 1) {
			setCurrentQuestionIndex((prev) => prev + 1);
			setShowHint(false);
		}
	};

	const handlePrevious = () => {
		if (currentQuestionIndex > 0) {
			setCurrentQuestionIndex((prev) => prev - 1);
			setShowHint(false);
		}
	};

	const handleQuizComplete = useCallback(() => {
		if (quizCompleted) return;

		const totalPoints = quizQuestions.reduce(
			(sum: number, q: any) => sum + q.points,
			0,
		);
		const earnedPoints = quizQuestions.reduce((sum: number, question: any) => {
			const state = questionStates[question.id];
			if (state && checkAnswer(question, state.answer)) {
				return sum + question.points;
			}
			return sum;
		}, 0);

		const score = Math.round((earnedPoints / totalPoints) * 100);
		const passed = score >= passingScore;

		const result: QuizResult = {
			id: `quiz_result_${Date.now()}`,
			userId: "current_user",
			moduleId: "current_module",
			score,
			totalPoints,
			earnedPoints,
			passed,
			attempts: [], // Would be populated from question states
			startTime: new Date(startTime).toISOString(),
			endTime: new Date().toISOString(),
			timeSpent: Math.floor((Date.now() - startTime) / 60000), // in minutes
			feedback: passed
				? "Congratulations! You passed the quiz. Well done!"
				: `You scored ${score}%. You need ${passingScore}% to pass. Review the material and try again.`,
			recommendations: passed
				? ["Continue to the next module", "Explore related topics"]
				: [
						"Review the learning material",
						"Focus on weak areas",
						"Take practice quizzes",
					],
		};

		setQuizCompleted(true);
		onComplete?.(result);
	}, [
		quizQuestions,
		questionStates,
		passingScore,
		startTime,
		quizCompleted,
		onComplete,
	]);

	const getQuestionStatus = (questionId: string): AnswerState => {
		const state = questionStates[questionId];
		if (!state || !state.answer) return "unanswered";
		return state.flagged ? "flagged" : "answered";
	};

	const getStatusIcon = (status: AnswerState) => {
		switch (status) {
			case "answered":
				return <CheckCircle className="h-4 w-4 text-green-600" />;
			case "flagged":
				return <Flag className="h-4 w-4 text-orange-600" />;
			default:
				return (
					<div className="h-4 w-4 rounded-full border-2 border-muted-foreground" />
				);
		}
	};

	const renderQuestion = (question: QuizQuestion) => {
		const state = questionStates[question.id];

		switch (question.type) {
			case "multiple_choice":
				return (
					<RadioGroup
						value={(state?.answer as string) || ""}
						onValueChange={(value) => handleAnswerSelect(value)}
						className="space-y-3"
					>
						{question.options?.map((option, index) => (
							<div
								key={index}
								className="flex items-center space-x-2 rounded-lg border p-3 hover:bg-muted/50"
							>
								<RadioGroupItem value={option} id={`option-${index}`} />
								<Label
									htmlFor={`option-${index}`}
									className="flex-1 cursor-pointer"
								>
									{option}
								</Label>
							</div>
						))}
					</RadioGroup>
				);

			case "true_false":
				return (
					<RadioGroup
						value={(state?.answer as string) || ""}
						onValueChange={(value) => handleAnswerSelect(value)}
						className="space-y-3"
					>
						<div className="flex items-center space-x-2 rounded-lg border p-3 hover:bg-muted/50">
							<RadioGroupItem value="true" id="true" />
							<Label htmlFor="true" className="flex-1 cursor-pointer">
								True
							</Label>
						</div>
						<div className="flex items-center space-x-2 rounded-lg border p-3 hover:bg-muted/50">
							<RadioGroupItem value="false" id="false" />
							<Label htmlFor="false" className="flex-1 cursor-pointer">
								False
							</Label>
						</div>
					</RadioGroup>
				);

			case "fill_blank":
				return (
					<Input
						value={(state?.answer as string) || ""}
						onChange={(e) => handleAnswerSelect(e.target.value)}
						placeholder="Enter your answer..."
						className="text-lg"
					/>
				);

			case "short_answer":
				return (
					<Textarea
						value={(state?.answer as string) || ""}
						onChange={(e) => handleAnswerSelect(e.target.value)}
						placeholder="Enter your answer..."
						rows={4}
					/>
				);

			case "matching":
				// This would require a more complex matching interface
				return (
					<div className="p-8 text-center">
						<p className="text-muted-foreground">
							Matching questions coming soon...
						</p>
					</div>
				);

			default:
				return (
					<div className="p-8 text-center">
						<p className="text-muted-foreground">
							Question type not supported yet
						</p>
					</div>
				);
		}
	};

	if (quizCompleted && showResults) {
		const totalPoints = quizQuestions.reduce(
			(sum: number, q: any) => sum + q.points,
			0,
		);
		const earnedPoints = quizQuestions.reduce((sum: number, question: any) => {
			const state = questionStates[question.id];
			if (state && checkAnswer(question, state.answer)) {
				return sum + question.points;
			}
			return sum;
		}, 0);
		const score = Math.round((earnedPoints / totalPoints) * 100);

		return (
			<Card className="mx-auto w-full max-w-2xl">
				<CardHeader className="text-center">
					<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
						{score >= passingScore ? (
							<Award className="h-8 w-8 text-primary" />
						) : (
							<BookOpen className="h-8 w-8 text-muted-foreground" />
						)}
					</div>
					<CardTitle className="text-2xl">
						{score >= passingScore ? "Quiz Completed!" : "Quiz Review"}
					</CardTitle>
					<CardDescription>{description}</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="space-y-4 text-center">
						<div className="font-bold text-4xl">{score}%</div>
						<div className="text-lg">
							{earnedPoints} out of {totalPoints} points
						</div>
						<Badge
							variant={score >= passingScore ? "default" : "destructive"}
							className="text-sm"
						>
							{score >= passingScore ? "PASSED" : "NEEDS IMPROVEMENT"}
						</Badge>
					</div>

					<div className="space-y-4">
						<h3 className="font-medium">Question Review</h3>
						<div className="max-h-64 space-y-2 overflow-y-auto">
							{quizQuestions.map((question: any, index: number) => {
								const state = questionStates[question.id];
								const isCorrect = state
									? checkAnswer(question, state.answer)
									: false;
								const status = getQuestionStatus(question.id);

								return (
									<div
										key={question.id}
										className="flex items-center justify-between rounded-lg border p-3"
									>
										<div className="flex items-center gap-3">
											{getStatusIcon(status)}
											<span className="font-medium text-sm">
												Question {index + 1}
											</span>
											{isCorrect ? (
												<CheckCircle className="h-4 w-4 text-green-600" />
											) : (
												<XCircle className="h-4 w-4 text-red-600" />
											)}
										</div>
										<div className="text-muted-foreground text-xs">
											{isCorrect ? `+${question.points}` : "0"} points
										</div>
									</div>
								);
							})}
						</div>
					</div>

					<div className="flex justify-center gap-3">
						<Button onClick={() => window.location.reload()} variant="outline">
							<RotateCcw className="mr-2 h-4 w-4" />
							Retake Quiz
						</Button>
						<Button onClick={() => (window.location.href = "/edukacja")}>
							Continue Learning
						</Button>
					</div>
				</CardContent>
			</Card>
		);
	}

	if (!currentQuestion) {
		return (
			<Card className="mx-auto w-full max-w-2xl">
				<CardContent className="py-12 text-center">
					<p className="text-muted-foreground">No questions available</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className="mx-auto w-full max-w-4xl space-y-6">
			{/* Quiz Header */}
			<Card>
				<CardHeader>
					<div className="flex items-start justify-between">
						<div>
							<CardTitle className="text-xl">{title}</CardTitle>
							{description && (
								<CardDescription className="mt-2">
									{description}
								</CardDescription>
							)}
						</div>
						<div className="space-y-2 text-right">
							{timeRemaining && (
								<div className="flex items-center gap-2 text-sm">
									<Clock className="h-4 w-4" />
									<span
										className={
											timeRemaining < 300000
												? "font-medium text-orange-600"
												: ""
										}
									>
										{formatTime(timeRemaining)}
									</span>
								</div>
							)}
							<div className="text-muted-foreground text-sm">
								Question {currentQuestionIndex + 1} of {quizQuestions.length}
							</div>
						</div>
					</div>
					<Progress
						value={(currentQuestionIndex / quizQuestions.length) * 100}
						className="mt-4"
					/>
				</CardHeader>
			</Card>

			{/* Question Navigation */}
			<Card>
				<CardContent className="p-4">
					<div className="flex flex-wrap justify-center gap-2">
						{quizQuestions.map((question: any, index: number) => {
							const status = getQuestionStatus(question.id);
							const isCurrent = index === currentQuestionIndex;

							return (
								<Button
									key={question.id}
									variant={isCurrent ? "default" : "outline"}
									size="sm"
									className={`h-10 w-10 p-0 ${status === "answered" ? "border-green-500" : status === "flagged" ? "border-orange-500" : ""}`}
									onClick={() => setCurrentQuestionIndex(index)}
								>
									{index + 1}
								</Button>
							);
						})}
					</div>
				</CardContent>
			</Card>

			{/* Current Question */}
			<Card>
				<CardHeader>
					<div className="flex items-start justify-between">
						<div className="flex-1">
							<CardTitle className="mb-2 text-lg leading-tight">
								{currentQuestion.question}
							</CardTitle>
							<div className="flex items-center gap-4 text-muted-foreground text-sm">
								<Badge variant="outline">{currentQuestion.difficulty}</Badge>
								<span>{currentQuestion.points} points</span>
								{currentQuestion.tags && (
									<div className="flex gap-1">
										{currentQuestion.tags.slice(0, 2).map((tag: any) => (
											<Badge key={tag} variant="secondary" className="text-xs">
												{tag}
											</Badge>
										))}
									</div>
								)}
							</div>
						</div>
						<div className="flex gap-2">
							<Button variant="ghost" size="sm" onClick={handleFlagQuestion}>
								<Flag
									className={`h-4 w-4 ${currentState?.flagged ? "fill-orange-500 text-orange-500" : ""}`}
								/>
							</Button>
							{currentQuestion.hints && currentQuestion.hints.length > 0 && (
								<Button variant="ghost" size="sm" onClick={handleHintToggle}>
									<Lightbulb className="h-4 w-4" />
								</Button>
							)}
						</div>
					</div>
				</CardHeader>

				<CardContent className="space-y-6">
					{/* Hint Section */}
					{showHint && currentQuestion.hints && (
						<div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
							<div className="flex items-start gap-2">
								<Lightbulb className="mt-0.5 h-5 w-5 text-blue-600" />
								<div>
									<h4 className="mb-1 font-medium text-blue-900">Hint</h4>
									<p className="text-blue-800 text-sm">
										{currentQuestion.hints[0]}
									</p>
								</div>
							</div>
						</div>
					)}

					{/* Answer Section */}
					<div className="min-h-[200px]">{renderQuestion(currentQuestion)}</div>

					{/* Navigation */}
					<div className="flex items-center justify-between border-t pt-4">
						<Button
							variant="outline"
							onClick={handlePrevious}
							disabled={currentQuestionIndex === 0}
						>
							<ChevronLeft className="mr-2 h-4 w-4" />
							Previous
						</Button>

						<div className="flex gap-2">
							{currentQuestionIndex === quizQuestions.length - 1 ? (
								<Button
									onClick={handleQuizComplete}
									className="bg-green-600 hover:bg-green-700"
								>
									Complete Quiz
									<Award className="ml-2 h-4 w-4" />
								</Button>
							) : (
								<Button onClick={handleNext}>
									Next
									<ChevronRight className="ml-2 h-4 w-4" />
								</Button>
							)}
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
