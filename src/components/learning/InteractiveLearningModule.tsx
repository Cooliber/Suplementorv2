"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
	ArrowLeft,
	ArrowRight,
	Award,
	BookOpen,
	Brain,
	CheckCircle,
	Clock,
	HelpCircle,
	Lightbulb,
	RotateCcw,
	Star,
	Target,
	TrendingUp,
	XCircle,
} from "lucide-react";
import type React from "react";
import { useCallback, useEffect, useState } from "react";

interface LearningObjective {
	id: string;
	text: string;
	polishText: string;
	completed: boolean;
}

interface QuizQuestion {
	id: string;
	type:
		| "SINGLE_CHOICE"
		| "MULTIPLE_CHOICE"
		| "TRUE_FALSE"
		| "FILL_IN_BLANK"
		| "ESSAY";
	question: string;
	polishQuestion: string;
	explanation: string;
	polishExplanation: string;
	options?: Array<{
		id: string;
		text: string;
		polishText: string;
		isCorrect: boolean;
	}>;
	correctAnswer?: string;
	points: number;
	difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
	category: string;
	polishCategory: string;
}

interface LearningContent {
	id: string;
	type: "TEXT" | "VIDEO" | "INTERACTIVE" | "QUIZ" | "CASE_STUDY";
	title: string;
	polishTitle: string;
	content: string;
	polishContent: string;
	estimatedTime: number; // minutes
	mediaUrl?: string;
	interactiveElements?: Array<{
		type: "HIGHLIGHT" | "TOOLTIP" | "POPUP" | "ANIMATION";
		trigger: string;
		content: string;
		polishContent: string;
	}>;
}

interface LearningModule {
	id: string;
	title: string;
	polishTitle: string;
	description: string;
	polishDescription: string;
	difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
	polishDifficulty: string;
	estimatedTime: number; // minutes
	category: string;
	polishCategory: string;
	prerequisites: string[];
	polishPrerequisites: string[];
	learningObjectives: LearningObjective[];
	content: LearningContent[];
	quiz: QuizQuestion[];
	completionCriteria: {
		minQuizScore: number;
		requiredSections: string[];
		timeSpent: number;
	};
	tags: string[];
	polishTags: string[];
}

interface UserProgress {
	moduleId: string;
	currentSectionIndex: number;
	completedSections: string[];
	quizAnswers: Record<string, any>;
	quizScore: number;
	timeSpent: number;
	startedAt: Date;
	completedAt?: Date;
	attempts: number;
}

interface InteractiveLearningModuleProps {
	module: LearningModule;
	userProgress?: UserProgress;
	onProgressUpdate: (progress: UserProgress) => void;
	onModuleComplete: (moduleId: string, finalScore: number) => void;
	className?: string;
}

const InteractiveLearningModule: React.FC<InteractiveLearningModuleProps> = ({
	module,
	userProgress,
	onProgressUpdate,
	onModuleComplete,
	className = "",
}) => {
	const [currentSectionIndex, setCurrentSectionIndex] = useState(
		userProgress?.currentSectionIndex || 0,
	);
	const [completedSections, setCompletedSections] = useState<string[]>(
		userProgress?.completedSections || [],
	);
	const [quizAnswers, setQuizAnswers] = useState<Record<string, any>>(
		userProgress?.quizAnswers || {},
	);
	const [showQuizResults, setShowQuizResults] = useState(false);
	const [timeSpent, setTimeSpent] = useState(userProgress?.timeSpent || 0);
	const [startTime] = useState(userProgress?.startedAt || new Date());

	// Timer for tracking time spent
	useEffect(() => {
		const timer = setInterval(() => {
			setTimeSpent((prev) => prev + 1);
		}, 60000); // Update every minute

		return () => clearInterval(timer);
	}, []);

	// Update progress when state changes
	useEffect(() => {
		const progress: UserProgress = {
			moduleId: module.id,
			currentSectionIndex,
			completedSections,
			quizAnswers,
			quizScore: calculateQuizScore(),
			timeSpent,
			startedAt: startTime,
			attempts: (userProgress?.attempts || 0) + (showQuizResults ? 1 : 0),
		};

		onProgressUpdate(progress);
	}, [currentSectionIndex, completedSections, quizAnswers, timeSpent]);

	const currentSection = module.content[currentSectionIndex];
	const isLastSection = currentSectionIndex === module.content.length - 1;
	const isFirstSection = currentSectionIndex === 0;

	const calculateProgress = useCallback(() => {
		const totalSections = module.content.length + 1; // +1 for quiz
		const completedCount = completedSections.length + (showQuizResults ? 1 : 0);
		return (completedCount / totalSections) * 100;
	}, [completedSections, showQuizResults, module.content.length]);

	const calculateQuizScore = useCallback(() => {
		if (module.quiz.length === 0) return 100;

		let totalPoints = 0;
		let earnedPoints = 0;

		module.quiz.forEach((question) => {
			totalPoints += question.points;
			const userAnswer = quizAnswers[question.id];

			if (question.type === "SINGLE_CHOICE" || question.type === "TRUE_FALSE") {
				const correctOption = question.options?.find((opt) => opt.isCorrect);
				if (userAnswer === correctOption?.id) {
					earnedPoints += question.points;
				}
			} else if (question.type === "MULTIPLE_CHOICE") {
				const correctOptions =
					question.options
						?.filter((opt) => opt.isCorrect)
						.map((opt) => opt.id) || [];
				const userSelections = userAnswer || [];

				if (
					Array.isArray(userSelections) &&
					correctOptions.length === userSelections.length &&
					correctOptions.every((id) => userSelections.includes(id))
				) {
					earnedPoints += question.points;
				}
			}
		});

		return totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0;
	}, [quizAnswers, module.quiz]);

	const markSectionComplete = useCallback(() => {
		if (currentSection && !completedSections.includes(currentSection.id)) {
			setCompletedSections((prev) => [...prev, currentSection.id]);
		}
	}, [currentSection, completedSections]);

	const goToNextSection = useCallback(() => {
		markSectionComplete();
		if (!isLastSection) {
			setCurrentSectionIndex((prev) => prev + 1);
		} else {
			// Start quiz
			setShowQuizResults(true);
		}
	}, [isLastSection, markSectionComplete]);

	const goToPreviousSection = useCallback(() => {
		if (!isFirstSection) {
			setCurrentSectionIndex((prev) => prev - 1);
		}
		setShowQuizResults(false);
	}, [isFirstSection]);

	const handleQuizAnswer = useCallback((questionId: string, answer: any) => {
		setQuizAnswers((prev) => ({
			...prev,
			[questionId]: answer,
		}));
	}, []);

	const submitQuiz = useCallback(() => {
		const score = calculateQuizScore();
		const isComplete = score >= module.completionCriteria.minQuizScore;

		if (isComplete) {
			const finalProgress: UserProgress = {
				moduleId: module.id,
				currentSectionIndex,
				completedSections: [...completedSections, "quiz"],
				quizAnswers,
				quizScore: score,
				timeSpent,
				startedAt: startTime,
				completedAt: new Date(),
				attempts: (userProgress?.attempts || 0) + 1,
			};

			onProgressUpdate(finalProgress);
			onModuleComplete(module.id, score);
		}

		setShowQuizResults(true);
	}, [
		calculateQuizScore,
		module,
		currentSectionIndex,
		completedSections,
		quizAnswers,
		timeSpent,
		startTime,
		userProgress,
		onProgressUpdate,
		onModuleComplete,
	]);

	const resetQuiz = useCallback(() => {
		setQuizAnswers({});
		setShowQuizResults(false);
	}, []);

	const getDifficultyColor = (difficulty: string) => {
		switch (difficulty) {
			case "BEGINNER":
				return "bg-green-100 text-green-800";
			case "INTERMEDIATE":
				return "bg-yellow-100 text-yellow-800";
			case "ADVANCED":
				return "bg-red-100 text-red-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const formatTime = (minutes: number) => {
		const hours = Math.floor(minutes / 60);
		const mins = minutes % 60;
		if (hours > 0) {
			return `${hours}h ${mins}min`;
		}
		return `${mins}min`;
	};

	const renderQuizQuestion = (question: QuizQuestion, index: number) => {
		const userAnswer = quizAnswers[question.id];

		return (
			<Card key={question.id} className="mb-4">
				<CardHeader className="pb-4">
					<div className="flex items-center justify-between">
						<CardTitle className="text-base">Pytanie {index + 1}</CardTitle>
						<div className="flex items-center gap-2">
							<Badge className={getDifficultyColor(question.difficulty)}>
								{question.difficulty === "BEGINNER"
									? "Podstawowy"
									: question.difficulty === "INTERMEDIATE"
										? "Średni"
										: "Zaawansowany"}
							</Badge>
							<Badge variant="outline">{question.points} pkt</Badge>
						</div>
					</div>
					<p className="text-sm">{question.polishQuestion}</p>
				</CardHeader>
				<CardContent>
					{question.type === "SINGLE_CHOICE" && (
						<RadioGroup
							value={userAnswer}
							onValueChange={(value) => handleQuizAnswer(question.id, value)}
						>
							{question.options?.map((option) => (
								<div key={option.id} className="flex items-center space-x-2">
									<RadioGroupItem value={option.id} id={option.id} />
									<Label htmlFor={option.id} className="text-sm">
										{option.polishText}
									</Label>
								</div>
							))}
						</RadioGroup>
					)}

					{question.type === "MULTIPLE_CHOICE" && (
						<div className="space-y-2">
							{question.options?.map((option) => (
								<div key={option.id} className="flex items-center space-x-2">
									<Checkbox
										id={option.id}
										checked={
											Array.isArray(userAnswer) &&
											userAnswer.includes(option.id)
										}
										onCheckedChange={(checked) => {
											const currentSelections = Array.isArray(userAnswer)
												? userAnswer
												: [];
											if (checked) {
												handleQuizAnswer(question.id, [
													...currentSelections,
													option.id,
												]);
											} else {
												handleQuizAnswer(
													question.id,
													currentSelections.filter(
														(id: string) => id !== option.id,
													),
												);
											}
										}}
									/>
									<Label htmlFor={option.id} className="text-sm">
										{option.polishText}
									</Label>
								</div>
							))}
						</div>
					)}

					{question.type === "TRUE_FALSE" && (
						<RadioGroup
							value={userAnswer}
							onValueChange={(value) => handleQuizAnswer(question.id, value)}
						>
							<div className="flex items-center space-x-2">
								<RadioGroupItem value="true" id="true" />
								<Label htmlFor="true" className="text-sm">
									Prawda
								</Label>
							</div>
							<div className="flex items-center space-x-2">
								<RadioGroupItem value="false" id="false" />
								<Label htmlFor="false" className="text-sm">
									Fałsz
								</Label>
							</div>
						</RadioGroup>
					)}

					{question.type === "ESSAY" && (
						<Textarea
							placeholder="Wpisz swoją odpowiedź..."
							value={userAnswer || ""}
							onChange={(e) => handleQuizAnswer(question.id, e.target.value)}
							className="min-h-24"
						/>
					)}

					{showQuizResults && (
						<div className="mt-4 rounded-lg border bg-gray-50 p-3">
							<div className="mb-2 flex items-center gap-2">
								{(() => {
									const isCorrect = (() => {
										if (
											question.type === "SINGLE_CHOICE" ||
											question.type === "TRUE_FALSE"
										) {
											const correctOption = question.options?.find(
												(opt) => opt.isCorrect,
											);
											return userAnswer === correctOption?.id;
										}
										if (question.type === "MULTIPLE_CHOICE") {
											const correctOptions =
												question.options
													?.filter((opt) => opt.isCorrect)
													.map((opt) => opt.id) || [];
											const userSelections = userAnswer || [];
											return (
												Array.isArray(userSelections) &&
												correctOptions.length === userSelections.length &&
												correctOptions.every((id) =>
													userSelections.includes(id),
												)
											);
										}
										return false;
									})();

									return isCorrect ? (
										<CheckCircle className="h-4 w-4 text-green-600" />
									) : (
										<XCircle className="h-4 w-4 text-red-600" />
									);
								})()}
								<span className="font-medium text-sm">
									{(() => {
										if (
											question.type === "SINGLE_CHOICE" ||
											question.type === "TRUE_FALSE"
										) {
											const correctOption = question.options?.find(
												(opt) => opt.isCorrect,
											);
											return userAnswer === correctOption?.id
												? "Poprawna odpowiedź!"
												: "Niepoprawna odpowiedź";
										}
										if (question.type === "MULTIPLE_CHOICE") {
											const correctOptions =
												question.options
													?.filter((opt) => opt.isCorrect)
													.map((opt) => opt.id) || [];
											const userSelections = userAnswer || [];
											const isCorrect =
												Array.isArray(userSelections) &&
												correctOptions.length === userSelections.length &&
												correctOptions.every((id) =>
													userSelections.includes(id),
												);
											return isCorrect
												? "Poprawna odpowiedź!"
												: "Niepoprawna odpowiedź";
										}
										return "Odpowiedź zapisana";
									})()}
								</span>
							</div>
							<p className="text-gray-700 text-sm">
								{question.polishExplanation}
							</p>
						</div>
					)}
				</CardContent>
			</Card>
		);
	};

	return (
		<div className={cn("mx-auto w-full max-w-4xl", className)}>
			{/* Module Header */}
			<Card className="mb-6">
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<CardTitle className="mb-2 text-xl">
								{module.polishTitle}
							</CardTitle>
							<p className="text-gray-600">{module.polishDescription}</p>
						</div>
						<div className="flex items-center gap-2">
							<Badge className={getDifficultyColor(module.difficulty)}>
								{module.polishDifficulty}
							</Badge>
							<Badge variant="outline">
								<Clock className="mr-1 h-3 w-3" />
								{formatTime(module.estimatedTime)}
							</Badge>
						</div>
					</div>

					<div className="mt-4">
						<div className="mb-2 flex items-center justify-between">
							<span className="text-gray-600 text-sm">Postęp modułu</span>
							<span className="font-medium text-sm">
								{Math.round(calculateProgress())}%
							</span>
						</div>
						<Progress value={calculateProgress()} className="h-2" />
					</div>

					{module.learningObjectives.length > 0 && (
						<div className="mt-4">
							<h4 className="mb-2 font-medium text-sm">Cele nauczania</h4>
							<div className="space-y-1">
								{module.learningObjectives.map((objective) => (
									<div
										key={objective.id}
										className="flex items-center gap-2 text-sm"
									>
										{completedSections.includes(objective.id) ? (
											<CheckCircle className="h-3 w-3 text-green-600" />
										) : (
											<Target className="h-3 w-3 text-gray-400" />
										)}
										<span
											className={
												completedSections.includes(objective.id)
													? "text-gray-500 line-through"
													: ""
											}
										>
											{objective.polishText}
										</span>
									</div>
								))}
							</div>
						</div>
					)}
				</CardHeader>
			</Card>

			{/* Content Section */}
			{!showQuizResults && currentSection && (
				<Card className="mb-6">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<BookOpen className="h-5 w-5" />
							{currentSection.polishTitle}
						</CardTitle>
						<div className="flex items-center gap-2">
							<Badge variant="outline">
								Sekcja {currentSectionIndex + 1} z {module.content.length}
							</Badge>
							<Badge variant="outline">
								<Clock className="mr-1 h-3 w-3" />
								{formatTime(currentSection.estimatedTime)}
							</Badge>
						</div>
					</CardHeader>
					<CardContent>
						<div className="prose prose-sm max-w-none">
							<div
								dangerouslySetInnerHTML={{
									__html: currentSection.polishContent,
								}}
							/>
						</div>

						{currentSection.mediaUrl && (
							<div className="mt-4">
								{currentSection.type === "VIDEO" ? (
									<video controls className="w-full rounded-lg">
										<source src={currentSection.mediaUrl} type="video/mp4" />
										Twoja przeglądarka nie obsługuje odtwarzania wideo.
									</video>
								) : (
									<img
										src={currentSection.mediaUrl}
										alt={currentSection.polishTitle}
										className="w-full rounded-lg"
									/>
								)}
							</div>
						)}
					</CardContent>
				</Card>
			)}

			{/* Quiz Section */}
			{showQuizResults && (
				<Card className="mb-6">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<HelpCircle className="h-5 w-5" />
							Quiz sprawdzający
						</CardTitle>
						<div className="flex items-center justify-between">
							<p className="text-gray-600">
								Odpowiedz na pytania, aby sprawdzić swoją wiedzę
							</p>
							{showQuizResults && (
								<div className="flex items-center gap-2">
									<Badge
										variant={
											calculateQuizScore() >=
											module.completionCriteria.minQuizScore
												? "default"
												: "destructive"
										}
									>
										{Math.round(calculateQuizScore())}% (
										{calculateQuizScore() >=
										module.completionCriteria.minQuizScore
											? "Zaliczony"
											: "Niezaliczony"}
										)
									</Badge>
								</div>
							)}
						</div>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{module.quiz.map((question, index) =>
								renderQuizQuestion(question, index),
							)}
						</div>
					</CardContent>
				</Card>
			)}

			{/* Navigation */}
			<Card>
				<CardContent className="p-4">
					<div className="flex items-center justify-between">
						<Button
							variant="outline"
							onClick={goToPreviousSection}
							disabled={isFirstSection && !showQuizResults}
						>
							<ArrowLeft className="mr-2 h-4 w-4" />
							Poprzedni
						</Button>

						<div className="flex items-center gap-2">
							<span className="text-gray-600 text-sm">
								Czas spędzony: {formatTime(timeSpent)}
							</span>
						</div>

						{!showQuizResults ? (
							<Button onClick={goToNextSection}>
								{isLastSection ? "Przejdź do quizu" : "Następny"}
								<ArrowRight className="ml-2 h-4 w-4" />
							</Button>
						) : (
							<div className="flex gap-2">
								{calculateQuizScore() <
									module.completionCriteria.minQuizScore && (
									<Button variant="outline" onClick={resetQuiz}>
										<RotateCcw className="mr-2 h-4 w-4" />
										Spróbuj ponownie
									</Button>
								)}
								<Button
									onClick={submitQuiz}
									disabled={
										Object.keys(quizAnswers).length < module.quiz.length
									}
								>
									<Award className="mr-2 h-4 w-4" />
									Zakończ moduł
								</Button>
							</div>
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default InteractiveLearningModule;
