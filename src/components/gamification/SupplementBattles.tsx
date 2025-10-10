/**
 * Supplement Knowledge Battles and Competitions
 * Competitive learning through head-to-head challenges and tournaments
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	Sword,
	Shield,
	Brain,
	Trophy,
	Users,
	Zap,
	Timer,
	Star,
	Crown,
	Target,
	Flame,
} from "lucide-react";
import { useSupplementGamificationStore } from "@/lib/stores/supplement-gamification-store";

interface BattleQuestion {
	id: string;
	question: string;
	options: string[];
	correctAnswer: string;
	explanation: string;
	category: string;
	difficulty: "easy" | "medium" | "hard";
	xpReward: number;
}

interface BattlePlayer {
	id: string;
	name: string;
	avatar?: string;
	level: number;
	score: number;
	isAI?: boolean;
}

interface BattleResult {
	winner: string;
	playerScore: number;
	opponentScore: number;
	xpEarned: number;
	newRank?: number;
}

interface SupplementBattlesProps {
	onBattleComplete?: (result: BattleResult) => void;
}

const SAMPLE_BATTLE_QUESTIONS: BattleQuestion[] = [
	{
		id: "battle-vitamin-d",
		question: "What is the primary source of Vitamin D for most people?",
		options: ["Sun exposure", "Dietary supplements", "Fortified foods", "All of the above"],
		correctAnswer: "All of the above",
		explanation: "Vitamin D can be obtained through sun exposure (UVB synthesis), dietary supplements, and fortified foods like milk and cereals.",
		category: "VITAMIN",
		difficulty: "easy",
		xpReward: 50,
	},
	{
		id: "battle-magnesium-forms",
		question: "Which form of magnesium is best absorbed and most bioavailable?",
		options: ["Magnesium oxide", "Magnesium citrate", "Magnesium sulfate", "Magnesium carbonate"],
		correctAnswer: "Magnesium citrate",
		explanation: "Magnesium citrate has superior bioavailability compared to other forms, making it more effective for supplementation.",
		category: "MINERAL",
		difficulty: "medium",
		xpReward: 75,
	},
	{
		id: "battle-ashwagandha-mechanism",
		question: "What is the primary mechanism of action for ashwagandha's stress-reducing effects?",
		options: ["GABA agonism", "Cortisol reduction", "Serotonin increase", "Dopamine modulation"],
		correctAnswer: "Cortisol reduction",
		explanation: "Ashwagandha reduces cortisol levels through HPA axis modulation, leading to decreased stress and anxiety symptoms.",
		category: "ADAPTOGEN",
		difficulty: "hard",
		xpReward: 100,
	},
	{
		id: "battle-omega-3-ratio",
		question: "What is the optimal omega-3 to omega-6 fatty acid ratio for health?",
		options: ["1:1", "1:4", "1:10", "1:20"],
		correctAnswer: "1:4",
		explanation: "A 1:4 omega-3 to omega-6 ratio supports optimal health, reducing inflammation and supporting cardiovascular function.",
		category: "FATTY_ACID",
		difficulty: "medium",
		xpReward: 75,
	},
];

const AI_OPPONENTS = [
	{ id: "ai-novice", name: "Supplement Novice", level: 2, avatar: "🤖" },
	{ id: "ai-student", name: "Wellness Student", level: 4, avatar: "🧠" },
	{ id: "ai-expert", name: "Nutrition Expert", level: 6, avatar: "👨‍🔬" },
	{ id: "ai-master", name: "Supplement Master", level: 8, avatar: "🏆" },
];

export function SupplementBattles({ onBattleComplete }: SupplementBattlesProps) {
	const [gameMode, setGameMode] = useState<"menu" | "battle" | "tournament" | "leaderboard">("menu");
	const [battleState, setBattleState] = useState<"waiting" | "active" | "complete">("waiting");
	const [currentQuestion, setCurrentQuestion] = useState<BattleQuestion | null>(null);
	const [playerAnswer, setPlayerAnswer] = useState<string>("");
	const [opponentAnswer, setOpponentAnswer] = useState<string>("");
	const [questionTimer, setQuestionTimer] = useState(15);
	const [battleTimer, setBattleTimer] = useState(300); // 5 minutes total
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [player, setPlayer] = useState<BattlePlayer>({
		id: "player",
		name: "You",
		level: 3,
		score: 0,
	});
	const [opponent, setOpponent] = useState<BattlePlayer | null>(null);
	const [battleQuestions, setBattleQuestions] = useState<BattleQuestion[]>([]);
	const [battleResult, setBattleResult] = useState<BattleResult | null>(null);

	const { addXP, updateKnowledgeScore } = useSupplementGamificationStore();

	useEffect(() => {
		if (battleState === "active") {
			setBattleQuestions(getRandomQuestions(5));
		}
	}, [battleState]);

	useEffect(() => {
		if (battleState === "active" && questionTimer > 0) {
			const timer = setTimeout(() => setQuestionTimer(questionTimer - 1), 1000);
			return () => clearTimeout(timer);
		} else if (questionTimer === 0 && battleState === "active") {
			handleTimeUp();
		}
		return undefined;
	}, [questionTimer, battleState]);

	useEffect(() => {
		if (battleState === "active" && battleTimer > 0) {
			const timer = setTimeout(() => setBattleTimer(battleTimer - 1), 1000);
			return () => clearTimeout(timer);
		}
		return undefined;
	}, [battleTimer, battleState]);

	const getRandomQuestions = (count: number): BattleQuestion[] => {
		const shuffled = [...SAMPLE_BATTLE_QUESTIONS].sort(() => 0.5 - Math.random());
		return shuffled.slice(0, count);
	};

	const startBattle = (opponentPlayer: BattlePlayer) => {
		setOpponent(opponentPlayer);
		setPlayer(prev => ({ ...prev, score: 0 }));
		setOpponent(prev => prev ? { ...prev, score: 0 } : null);
		setBattleState("active");
		setCurrentQuestionIndex(0);
		setQuestionTimer(15);
		setBattleTimer(300);
		setBattleResult(null);
	};

	const startTournament = () => {
		setGameMode("tournament");
		// Tournament logic would go here
	};

	const handleAnswerSelect = (answer: string) => {
		setPlayerAnswer(answer);

		// Simulate opponent answer (AI logic)
		const correctAnswer = currentQuestion?.correctAnswer || '';
		if (correctAnswer && opponent) {
			const shouldAnswerCorrectly = Math.random() > 0.3; // 70% AI accuracy
			if (shouldAnswerCorrectly) {
				setOpponentAnswer(correctAnswer || '');
			} else {
				const wrongOptions = currentQuestion?.options?.filter(opt => opt !== correctAnswer) || [];
				setOpponentAnswer(wrongOptions[Math.floor(Math.random() * wrongOptions.length)] || '');
			}
		}

		// Determine winner of this question
		setTimeout(() => {
			const isPlayerCorrect = answer === (currentQuestion?.correctAnswer || '');
			const isOpponentCorrect = opponentAnswer === (currentQuestion?.correctAnswer || '');

			if (isPlayerCorrect && !isOpponentCorrect) {
				setPlayer(prev => ({ ...prev, score: prev.score + (currentQuestion?.xpReward || 0) }));
			} else if (!isPlayerCorrect && isOpponentCorrect) {
				setOpponent(prev => prev ? { ...prev, score: prev.score + (currentQuestion?.xpReward || 0) } : null);
			} else if (isPlayerCorrect && isOpponentCorrect) {
				// Both correct - speed determines winner
				setPlayer(prev => ({ ...prev, score: prev.score + (currentQuestion?.xpReward || 0) }));
			}

			setTimeout(() => {
				nextQuestion();
			}, 2000);
		}, 1000);
	};

	const handleTimeUp = () => {
		// Auto-select for player if no answer chosen
		if (!playerAnswer && currentQuestion) {
			const randomAnswer = (currentQuestion.options || [])[Math.floor(Math.random() * Math.max(1, currentQuestion.options?.length || 1))] || '';
			handleAnswerSelect(randomAnswer);
		}
	};

	const nextQuestion = () => {
		if (currentQuestionIndex < battleQuestions.length - 1) {
			setCurrentQuestionIndex(currentQuestionIndex + 1);
			setCurrentQuestion(battleQuestions[currentQuestionIndex + 1] || null);
			setPlayerAnswer("");
			setOpponentAnswer("");
			setQuestionTimer(15);
		} else {
			endBattle();
		}
	};

	const endBattle = () => {
		setBattleState("complete");

		const playerScore = player.score;
		const opponentScore = opponent?.score || 0;

		let result: BattleResult;
		if (playerScore > opponentScore) {
			result = {
				winner: "player",
				playerScore,
				opponentScore,
				xpEarned: Math.floor(playerScore * 1.5),
			};
		} else if (opponentScore > playerScore) {
			result = {
				winner: "opponent",
				playerScore,
				opponentScore,
				xpEarned: Math.floor(playerScore * 0.5),
			};
		} else {
			result = {
				winner: "tie",
				playerScore,
				opponentScore,
				xpEarned: Math.floor(playerScore * 0.75),
			};
		}

		setBattleResult(result);

		// Award XP
		if (result.xpEarned > 0) {
			addXP(result.xpEarned, "battle-victory");
		}

		// Update knowledge score based on performance
		const accuracy = battleQuestions.length > 0 ? (playerScore / (battleQuestions.length * 100)) * 100 : 0;
		updateKnowledgeScore(accuracy);

		onBattleComplete?.(result);
	};

	if (gameMode === "menu") {
		return (
			<div className="w-full max-w-4xl mx-auto space-y-6">
				<div className="text-center space-y-2">
					<h2 className="text-3xl font-bold flex items-center justify-center gap-2">
						<Sword className="h-8 w-8 text-primary" />
						Supplement Battles
					</h2>
					<p className="text-muted-foreground">
						Test your supplement knowledge against other learners and AI opponents
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{/* AI Battle */}
					<Card className="cursor-pointer hover:shadow-lg transition-all" onClick={() => setGameMode("battle")}>
						<CardHeader className="text-center">
							<CardTitle className="flex items-center gap-2 justify-center">
								<Brain className="h-6 w-6 text-blue-500" />
								AI Battle
							</CardTitle>
						</CardHeader>
						<CardContent className="text-center space-y-4">
							<p className="text-sm text-muted-foreground">
								Challenge AI opponents of varying difficulty levels
							</p>
							<div className="grid grid-cols-2 gap-2">
								{AI_OPPONENTS.slice(0, 2).map((ai) => (
									<div key={ai.id} className="p-3 border rounded-lg">
										<div className="text-2xl mb-1">{ai.avatar}</div>
										<div className="font-medium text-sm">{ai.name}</div>
										<div className="text-xs text-muted-foreground">Level {ai.level}</div>
									</div>
								))}
							</div>
							<Button className="w-full gap-2">
								<Zap className="h-4 w-4" />
								Start AI Battle
							</Button>
						</CardContent>
					</Card>

					{/* Tournament */}
					<Card className="cursor-pointer hover:shadow-lg transition-all" onClick={startTournament}>
						<CardHeader className="text-center">
							<CardTitle className="flex items-center gap-2 justify-center">
								<Crown className="h-6 w-6 text-yellow-500" />
								Tournament
							</CardTitle>
						</CardHeader>
						<CardContent className="text-center space-y-4">
							<p className="text-sm text-muted-foreground">
								Compete in weekly tournaments for the top spot
							</p>
							<div className="space-y-2">
								<div className="flex justify-between text-sm">
									<span>Current Tournament</span>
									<Badge variant="outline">Week 42</Badge>
								</div>
								<div className="flex justify-between text-sm">
									<span>Your Rank</span>
									<span className="font-medium">#247</span>
								</div>
								<div className="flex justify-between text-sm">
									<span>Participants</span>
									<span className="font-medium">1,234</span>
								</div>
							</div>
							<Button className="w-full gap-2">
								<Trophy className="h-4 w-4" />
								Join Tournament
							</Button>
						</CardContent>
					</Card>
				</div>

				{/* Quick Match */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Users className="h-5 w-5 text-green-500" />
							Quick Match
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-sm text-muted-foreground mb-4">
							Find another player for a head-to-head battle
						</p>
						<Button className="w-full gap-2" disabled>
							<Users className="h-4 w-4" />
							Find Match (Coming Soon)
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	if (gameMode === "battle" && battleState === "waiting") {
		return (
			<div className="w-full max-w-4xl mx-auto space-y-6">
				<div className="text-center space-y-2">
					<h2 className="text-3xl font-bold">Choose Your Opponent</h2>
					<p className="text-muted-foreground">Select an AI opponent to battle</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
					{AI_OPPONENTS.map((ai) => (
						<Card
							key={ai.id}
							className="cursor-pointer hover:shadow-lg transition-all"
							onClick={() => startBattle({ ...ai, score: 0 })}
						>
							<CardContent className="p-6 text-center space-y-4">
								<div className="text-4xl">{ai.avatar}</div>
								<div>
									<h3 className="font-semibold">{ai.name}</h3>
									<p className="text-sm text-muted-foreground">Level {ai.level}</p>
								</div>
								<div className="space-y-2">
									<Badge variant={ai.level <= 3 ? "secondary" : ai.level <= 6 ? "default" : "destructive"}>
										{ai.level <= 3 ? "Easy" : ai.level <= 6 ? "Medium" : "Hard"}
									</Badge>
									<div className="text-xs text-muted-foreground">
										{ai.level <= 3 ? "70% accuracy" : ai.level <= 6 ? "85% accuracy" : "95% accuracy"}
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>

				<div className="text-center">
					<Button variant="outline" onClick={() => setGameMode("menu")}>
						Back to Menu
					</Button>
				</div>
			</div>
		);
	}

	if (battleState === "active" && currentQuestion) {
		return (
			<div className="w-full max-w-4xl mx-auto">
				<Card>
					<CardHeader>
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-4">
								<div className="text-center">
									<div className="font-bold">{player.name}</div>
									<div className="text-sm text-muted-foreground">Score: {player.score}</div>
								</div>
								<Zap className="h-6 w-6 text-muted-foreground" />
								<div className="text-center">
									<div className="font-bold">{opponent?.name}</div>
									<div className="text-sm text-muted-foreground">Score: {opponent?.score || 0}</div>
								</div>
							</div>
							<div className="text-right">
								<div className="text-sm text-muted-foreground">Question {currentQuestionIndex + 1}/{battleQuestions.length}</div>
								<div className="flex items-center gap-2">
									<Timer className="h-4 w-4" />
									<span className={`font-mono ${questionTimer <= 5 ? "text-red-500" : ""}`}>
										{questionTimer}s
									</span>
								</div>
							</div>
						</div>
						<Progress value={((currentQuestionIndex + 1) / battleQuestions.length) * 100} />
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="text-center">
							<Badge variant="outline" className="mb-4">
								{currentQuestion.category} • {currentQuestion.difficulty}
							</Badge>
							<h3 className="text-xl font-semibold leading-relaxed">
								{currentQuestion.question}
							</h3>
						</div>

						<div className="grid gap-3">
							{currentQuestion.options.map((option, index) => (
								<Button
									key={index}
									variant={playerAnswer === option ? "default" : "outline"}
									className="justify-start h-auto p-4 text-left"
									onClick={() => handleAnswerSelect(option)}
									disabled={!!playerAnswer}
								>
									<span>{option}</span>
								</Button>
							))}
						</div>

						{/* Battle Timer */}
						<div className="text-center">
							<div className="text-sm text-muted-foreground">Battle Time Remaining</div>
							<div className="text-2xl font-mono">
								{Math.floor(battleTimer / 60)}:{(battleTimer % 60).toString().padStart(2, '0')}
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	if (battleState === "complete" && battleResult) {
		return (
			<div className="w-full max-w-4xl mx-auto">
				<Card>
					<CardHeader className="text-center">
						<CardTitle className="flex items-center gap-2 justify-center">
							<Trophy className="h-6 w-6 text-yellow-500" />
							Battle Complete!
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="text-center space-y-4">
							<div className={`text-3xl font-bold ${battleResult.winner === "player" ? "text-green-600" : battleResult.winner === "opponent" ? "text-red-600" : "text-blue-600"}`}>
								{battleResult.winner === "player" ? "Victory!" : battleResult.winner === "opponent" ? "Defeat" : "Draw"}
							</div>

							<div className="flex items-center justify-center gap-8">
								<div className="text-center">
									<div className="text-2xl font-bold">{player.score}</div>
									<div className="text-sm text-muted-foreground">Your Score</div>
								</div>
								<Zap className="h-8 w-8 text-muted-foreground" />
								<div className="text-center">
									<div className="text-2xl font-bold">{battleResult.opponentScore}</div>
									<div className="text-sm text-muted-foreground">Opponent Score</div>
								</div>
							</div>

							{battleResult.xpEarned > 0 && (
								<div className="flex items-center justify-center gap-2">
									<Star className="h-5 w-5 text-yellow-500" />
									<span className="font-medium">+{battleResult.xpEarned} XP Earned!</span>
								</div>
							)}
						</div>

						<div className="flex justify-center gap-4">
							<Button onClick={() => setBattleState("waiting")} className="gap-2">
								<Sword className="h-4 w-4" />
								Battle Again
							</Button>
							<Button variant="outline" onClick={() => setGameMode("menu")}>
								Back to Menu
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	return null;
}