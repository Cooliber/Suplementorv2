/**
 * Interactive Supplement Exploration Challenge Component
 * Evidence-based learning challenges for supplement discovery
 */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSupplementGamificationStore } from "@/lib/stores/supplement-gamification-store";
import type { EvidenceLevel, SupplementCategory } from "@/types/supplement";
import { AnimatePresence, motion } from "framer-motion";
import {
	Award,
	BookOpen,
	Brain,
	CheckCircle,
	Clock,
	Lightbulb,
	Star,
	Target,
	XCircle,
} from "lucide-react";
import React, { useState, useEffect } from "react";

interface ChallengeQuestion {
	id: string;
	type:
		| "multiple-choice"
		| "identification"
		| "evidence-rating"
		| "interaction-check";
	question: string;
	options?: string[];
	correctAnswer: string;
	explanation: string;
	evidenceLevel: EvidenceLevel;
	category: SupplementCategory;
	xpReward: number;
}

interface ChallengeResult {
	correct: boolean;
	xpEarned: number;
	achievement?: string;
}

interface SupplementExplorationChallengeProps {
	category?: SupplementCategory;
	difficulty?: "beginner" | "intermediate" | "advanced";
	onComplete?: (result: ChallengeResult) => void;
	autoStart?: boolean;
}

const SAMPLE_QUESTIONS: ChallengeQuestion[] = [
	{
		id: "vitamin-c-identification",
		type: "identification",
		question:
			"Which vitamin is essential for collagen synthesis and immune function?",
		options: ["Vitamin A", "Vitamin C", "Vitamin D", "Vitamin E"],
		correctAnswer: "Vitamin C",
		explanation:
			"Vitamin C is crucial for collagen synthesis, wound healing, and immune function. It acts as a cofactor in hydroxylation reactions.",
		evidenceLevel: "STRONG",
		category: "VITAMIN",
		xpReward: 25,
	},
	{
		id: "magnesium-evidence",
		type: "evidence-rating",
		question:
			"What is the primary evidence level for magnesium's role in muscle function?",
		options: ["Strong", "Moderate", "Weak", "Insufficient"],
		correctAnswer: "Strong",
		explanation:
			"Magnesium plays a critical role in muscle contraction and relaxation. Clinical studies consistently show its importance in preventing cramps and supporting muscle function.",
		evidenceLevel: "STRONG",
		category: "MINERAL",
		xpReward: 30,
	},
	{
		id: "ashwagandha-interaction",
		type: "interaction-check",
		question:
			"Which supplement should be used cautiously with ashwagandha due to potential interactions?",
		options: ["Vitamin C", "Thyroid medications", "Probiotics", "Fish oil"],
		correctAnswer: "Thyroid medications",
		explanation:
			"Ashwagandha may increase thyroid hormone levels and should be used cautiously with thyroid medications to avoid hyperthyroidism.",
		evidenceLevel: "MODERATE",
		category: "ADAPTOGEN",
		xpReward: 35,
	},
	{
		id: "omega-3-benefits",
		type: "multiple-choice",
		question:
			"What is the primary mechanism of omega-3 fatty acids in cardiovascular health?",
		options: [
			"Direct cholesterol reduction",
			"Anti-inflammatory effects",
			"Antioxidant activity",
			"Blood thinning",
		],
		correctAnswer: "Anti-inflammatory effects",
		explanation:
			"Omega-3 fatty acids reduce inflammation, which is a key factor in cardiovascular disease prevention, supported by numerous clinical trials.",
		evidenceLevel: "STRONG",
		category: "FATTY_ACID",
		xpReward: 25,
	},
];

export function SupplementExplorationChallenge({
	category,
	difficulty = "beginner",
	onComplete,
	autoStart = false,
}: SupplementExplorationChallengeProps) {
	const [currentQuestion, setCurrentQuestion] =
		useState<ChallengeQuestion | null>(null);
	const [selectedAnswer, setSelectedAnswer] = useState<string>("");
	const [showResult, setShowResult] = useState(false);
	const [isComplete, setIsComplete] = useState(false);
	const [score, setScore] = useState(0);
	const [questionIndex, setQuestionIndex] = useState(0);
	const [timeLeft, setTimeLeft] = useState(30);
	const [isActive, setIsActive] = useState(autoStart);

	const { addXP, recordCategoryExploration, updateKnowledgeScore } =
		useSupplementGamificationStore();

	// Filter questions based on category and difficulty
	const availableQuestions = SAMPLE_QUESTIONS.filter((q) => {
		if (category && q.category !== category) return false;
		// Add difficulty filtering logic here if needed
		return true;
	});

	useEffect(() => {
		if (isActive && availableQuestions.length > 0) {
			setCurrentQuestion(availableQuestions[questionIndex] || null);
			setTimeLeft(30);
		}
	}, [isActive, questionIndex, availableQuestions]);

	useEffect(() => {
		if (timeLeft > 0 && isActive && !showResult) {
			const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
			return () => clearTimeout(timer);
		}
		if (timeLeft === 0 && !showResult) {
			handleTimeUp();
		}
		return undefined;
	}, [timeLeft, isActive, showResult]);

	const handleAnswerSelect = (answer: string) => {
		setSelectedAnswer(answer);
		setShowResult(true);
	};

	const handleNextQuestion = () => {
		if (questionIndex < availableQuestions.length - 1) {
			setQuestionIndex(questionIndex + 1);
			setCurrentQuestion(availableQuestions[questionIndex + 1] || null);
			setSelectedAnswer("");
			setShowResult(false);
			setTimeLeft(30);
		} else {
			handleComplete();
		}
	};

	const handleTimeUp = () => {
		setShowResult(true);
		setSelectedAnswer(""); // No answer selected
	};

	const handleComplete = () => {
		setIsComplete(true);
		const finalScore = Math.round((score / availableQuestions.length) * 100);
		updateKnowledgeScore(finalScore);

		// Record category exploration if category was specified
		if (category) {
			recordCategoryExploration(category);
		}

		// Award XP based on performance
		const xpEarned = Math.floor((finalScore / 100) * 100);
		if (xpEarned > 0) {
			addXP(xpEarned, "exploration-challenge");
		}

		onComplete?.({
			correct: finalScore >= 70,
			xpEarned,
		});
	};

	const handleStart = () => {
		setIsActive(true);
		setQuestionIndex(0);
		setScore(0);
		setIsComplete(false);
		setShowResult(false);
	};

	if (!isActive) {
		return (
			<Card className="mx-auto w-full max-w-2xl">
				<CardHeader className="text-center">
					<CardTitle className="flex items-center justify-center gap-2">
						<Brain className="h-6 w-6 text-primary" />
						Supplement Exploration Challenge
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="space-y-2 text-center">
						<p className="text-muted-foreground">
							Test your supplement knowledge with evidence-based questions
						</p>
						{category && (
							<Badge variant="secondary" className="capitalize">
								{category.replace("_", " ")} Focus
							</Badge>
						)}
						<Badge variant="outline" className="ml-2 capitalize">
							{difficulty}
						</Badge>
					</div>
					<div className="flex justify-center gap-2">
						<Button onClick={handleStart} className="gap-2">
							<Brain className="h-4 w-4" />
							Start Challenge
						</Button>
					</div>
				</CardContent>
			</Card>
		);
	}

	if (isComplete) {
		const finalScore = Math.round((score / availableQuestions.length) * 100);
		return (
			<Card className="mx-auto w-full max-w-2xl">
				<CardHeader className="text-center">
					<CardTitle className="flex items-center justify-center gap-2">
						<Award className="h-6 w-6 text-yellow-500" />
						Challenge Complete!
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="space-y-2 text-center">
						<div className="font-bold text-3xl text-primary">{finalScore}%</div>
						<p className="text-muted-foreground">
							{score} out of {availableQuestions.length} correct
						</p>
						{finalScore >= 90 && (
							<Badge className="bg-green-100 text-green-800">
								<Star className="mr-1 h-3 w-3" />
								Excellent!
							</Badge>
						)}
						{finalScore >= 70 && finalScore < 90 && (
							<Badge className="bg-blue-100 text-blue-800">Good Job!</Badge>
						)}
						{finalScore < 70 && (
							<Badge className="bg-orange-100 text-orange-800">
								Keep Learning!
							</Badge>
						)}
					</div>
					<div className="flex justify-center gap-2">
						<Button onClick={handleStart} variant="outline">
							Try Again
						</Button>
						<Button onClick={() => setIsActive(false)}>Back to Menu</Button>
					</div>
				</CardContent>
			</Card>
		);
	}

	if (!currentQuestion) {
		return (
			<Card className="mx-auto w-full max-w-2xl">
				<CardContent className="py-8 text-center">
					<p>No questions available for this challenge.</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="mx-auto w-full max-w-2xl">
			<CardHeader>
				<div className="flex items-center justify-between">
					<CardTitle className="flex items-center gap-2">
						<Brain className="h-5 w-5 text-primary" />
						Question {questionIndex + 1} of {availableQuestions.length}
					</CardTitle>
					<div className="flex items-center gap-2">
						<Clock className="h-4 w-4 text-muted-foreground" />
						<span
							className={`font-mono ${timeLeft <= 10 ? "text-red-500" : ""}`}
						>
							{timeLeft}s
						</span>
					</div>
				</div>
				<Progress
					value={(questionIndex / availableQuestions.length) * 100}
					className="w-full"
				/>
			</CardHeader>
			<CardContent className="space-y-6">
				<div className="space-y-4">
					<div className="flex items-center gap-2">
						<Badge variant="outline" className="capitalize">
							{currentQuestion.category.replace("_", " ")}
						</Badge>
						<Badge
							variant={
								currentQuestion.evidenceLevel === "STRONG"
									? "default"
									: currentQuestion.evidenceLevel === "MODERATE"
										? "secondary"
										: "outline"
							}
						>
							{currentQuestion.evidenceLevel} Evidence
						</Badge>
					</div>

					<h3 className="font-semibold text-xl leading-relaxed">
						{currentQuestion.question}
					</h3>

					{currentQuestion.options && (
						<div className="grid gap-3">
							{currentQuestion.options.map((option, index) => (
								<Button
									key={index}
									variant={
										showResult
											? option === currentQuestion.correctAnswer
												? "default"
												: selectedAnswer === option
													? "destructive"
													: "outline"
											: selectedAnswer === option
												? "default"
												: "outline"
									}
									className="h-auto justify-start p-4 text-left"
									onClick={() => !showResult && handleAnswerSelect(option)}
									disabled={showResult}
								>
									<div className="flex items-center gap-3">
										{showResult && option === currentQuestion.correctAnswer && (
											<CheckCircle className="h-5 w-5 text-green-600" />
										)}
										{showResult &&
											selectedAnswer === option &&
											option !== currentQuestion.correctAnswer && (
												<XCircle className="h-5 w-5 text-red-600" />
											)}
										<span>{option}</span>
									</div>
								</Button>
							))}
						</div>
					)}

					<AnimatePresence>
						{showResult && (
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -20 }}
								className="space-y-4"
							>
								<div className="rounded-lg bg-muted p-4">
									<div className="flex items-start gap-2">
										<Lightbulb className="mt-0.5 h-5 w-5 flex-shrink-0 text-yellow-500" />
										<div>
											<p className="mb-1 font-medium">Explanation</p>
											<p className="text-muted-foreground text-sm">
												{currentQuestion.explanation}
											</p>
										</div>
									</div>
								</div>

								{selectedAnswer === currentQuestion.correctAnswer && (
									<div className="flex items-center gap-2 text-green-600">
										<CheckCircle className="h-5 w-5" />
										<span className="font-medium">
											Correct! +{currentQuestion.xpReward} XP
										</span>
									</div>
								)}

								<Button onClick={handleNextQuestion} className="w-full">
									{questionIndex < availableQuestions.length - 1
										? "Next Question"
										: "Complete Challenge"}
								</Button>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</CardContent>
		</Card>
	);
}
