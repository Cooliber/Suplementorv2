"use client";

import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
	ArrowRight,
	BookOpen,
	Brain,
	CheckCircle,
	Clock,
	Lightbulb,
	Star,
	Target,
	TrendingUp,
	Zap,
} from "lucide-react";

interface LearningPathNode {
	id: string;
	title: string;
	description: string;
	type: "module" | "quiz" | "practice" | "review";
	difficulty: "beginner" | "intermediate" | "advanced";
	estimatedTime: number;
	prerequisites: string[];
	isCompleted: boolean;
	isCurrent: boolean;
	isLocked: boolean;
	score?: number;
	category: string;
	tags: string[];
}

interface LearningPath {
	id: string;
	title: string;
	description: string;
	progress: number;
	nodes: LearningPathNode[];
	estimatedTotalTime: number;
	difficulty: "beginner" | "intermediate" | "advanced";
	category: string;
	reasoning: string; // Why this path was recommended
}

interface UserProfile {
	learningStyle: "visual" | "auditory" | "kinesthetic" | "reading";
	preferredDifficulty: "beginner" | "intermediate" | "advanced";
	interests: string[];
	completedModules: string[];
	quizScores: Record<string, number>;
	timeSpent: Record<string, number>;
	weakAreas: string[];
	strongAreas: string[];
}

interface AdaptiveLearningPathsProps {
	userProfile?: UserProfile;
	onPathSelect: (pathId: string) => void;
	onNodeSelect: (pathId: string, nodeId: string) => void;
	className?: string;
}

export function AdaptiveLearningPaths({
	userProfile,
	onPathSelect,
	onNodeSelect,
	className,
}: AdaptiveLearningPathsProps) {
	// Mock user profile - in real app this would come from user data
	const profile: UserProfile = userProfile || {
		learningStyle: "visual",
		preferredDifficulty: "intermediate",
		interests: ["neuroprzekaźniki", "suplementacja", "mózg"],
		completedModules: ["neurotransmitters-101", "brain-regions"],
		quizScores: {
			"neurotransmitters-101": 85,
			"brain-regions": 92,
		},
		timeSpent: {
			"neurotransmitters-101": 45,
			"brain-regions": 32,
		},
		weakAreas: ["farmakologia"],
		strongAreas: ["neurobiologia", "anatomia"],
	};

	// Generate adaptive learning paths based on user profile
	const learningPaths = React.useMemo<LearningPath[]>(() => {
		return [
			{
				id: "neurotransmitter-advanced",
				title: "Zaawansowane Neuroprzekaźniki",
				description:
					"Dogłębne zrozumienie neuroprzekaźników i ich roli w suplementacji",
				progress: 65,
				estimatedTotalTime: 180,
				difficulty: "advanced",
				category: "Neurobiologia",
				reasoning:
					"Doskonale radzisz sobie z podstawami neuroprzekaźników (85% w quizie). Czas na zaawansowane tematy!",
				nodes: [
					{
						id: "1",
						title: "Synapsy i neurotransmisja",
						description: "Mechanizmy komunikacji między neuronami",
						type: "module",
						difficulty: "intermediate",
						estimatedTime: 45,
						prerequisites: [],
						isCompleted: true,
						isCurrent: false,
						isLocked: false,
						score: 85,
						category: "Neurobiologia",
						tags: ["synapsy", "neuroprzekaźniki"],
					},
					{
						id: "2",
						title: "Receptory i działanie",
						description: "Rodzaje receptorów i mechanizmy działania",
						type: "module",
						difficulty: "advanced",
						estimatedTime: 60,
						prerequisites: ["1"],
						isCompleted: true,
						isCurrent: false,
						isLocked: false,
						score: 78,
						category: "Farmakologia",
						tags: ["receptory", "farmakologia"],
					},
					{
						id: "3",
						title: "Modulacja receptorów",
						description: "Jak suplementy wpływają na receptory",
						type: "module",
						difficulty: "advanced",
						estimatedTime: 75,
						prerequisites: ["2"],
						isCompleted: false,
						isCurrent: true,
						isLocked: false,
						category: "Suplementacja",
						tags: ["modulacja", "suplementy"],
					},
				],
			},
			{
				id: "supplementation-practice",
				title: "Praktyczna Suplementacja",
				description: "Praktyczne zastosowanie wiedzy o suplementach",
				progress: 30,
				estimatedTotalTime: 120,
				difficulty: "intermediate",
				category: "Suplementacja",
				reasoning:
					"Twoje zainteresowanie suplementacją + dobre wyniki w neurobiologii sugerują gotowość na praktyczne zastosowania.",
				nodes: [
					{
						id: "1",
						title: "Ocena potrzeb suplementacyjnych",
						description: "Jak określić indywidualne potrzeby",
						type: "module",
						difficulty: "intermediate",
						estimatedTime: 40,
						prerequisites: [],
						isCompleted: true,
						isCurrent: false,
						isLocked: false,
						score: 82,
						category: "Suplementacja",
						tags: ["ocena", "potrzeby"],
					},
					{
						id: "2",
						title: "Planowanie suplementacji",
						description: "Tworzenie spersonalizowanych planów",
						type: "practice",
						difficulty: "intermediate",
						estimatedTime: 50,
						prerequisites: ["1"],
						isCompleted: false,
						isCurrent: true,
						isLocked: false,
						category: "Planowanie",
						tags: ["planowanie", "personalizacja"],
					},
					{
						id: "3",
						title: "Case Study: Optymalizacja",
						description: "Analiza rzeczywistych przypadków",
						type: "practice",
						difficulty: "advanced",
						estimatedTime: 30,
						prerequisites: ["2"],
						isCompleted: false,
						isCurrent: false,
						isLocked: true,
						category: "Case Studies",
						tags: ["case-study", "optymalizacja"],
					},
				],
			},
			{
				id: "brain-regions-exploration",
				title: "Eksploracja Obszarów Mózgu",
				description: "Kompleksowe zrozumienie funkcji mózgu",
				progress: 80,
				estimatedTotalTime: 150,
				difficulty: "intermediate",
				category: "Neuroanatomia",
				reasoning:
					"Masz już solidne podstawy (92% w quizie). Ta ścieżka pomoże Ci połączyć wiedzę o obszarach mózgu z suplementacją.",
				nodes: [
					{
						id: "1",
						title: "Podstawy neuroanatomii",
						description: "Główne obszary i ich funkcje",
						type: "module",
						difficulty: "beginner",
						estimatedTime: 35,
						prerequisites: [],
						isCompleted: true,
						isCurrent: false,
						isLocked: false,
						score: 92,
						category: "Anatomia",
						tags: ["anatomia", "obszary"],
					},
					{
						id: "2",
						title: "Funkcje poznawcze",
						description: "Jak obszary mózgu wpływają na funkcje poznawcze",
						type: "module",
						difficulty: "intermediate",
						estimatedTime: 45,
						prerequisites: ["1"],
						isCompleted: true,
						isCurrent: false,
						isLocked: false,
						score: 88,
						category: "Funkcje",
						tags: ["poznawcze", "funkcje"],
					},
					{
						id: "3",
						title: "Interaktywna mapa mózgu",
						description: "3D eksploracja z suplementacją",
						type: "practice",
						difficulty: "intermediate",
						estimatedTime: 70,
						prerequisites: ["2"],
						isCompleted: false,
						isCurrent: true,
						isLocked: false,
						category: "Interaktywne",
						tags: ["3d", "mapa", "eksploracja"],
					},
				],
			},
		];
	}, [profile]);

	const getDifficultyColor = (difficulty: string) => {
		switch (difficulty) {
			case "beginner":
				return "bg-green-100 text-green-800 border-green-200";
			case "intermediate":
				return "bg-yellow-100 text-yellow-800 border-yellow-200";
			case "advanced":
				return "bg-red-100 text-red-800 border-red-200";
			default:
				return "bg-gray-100 text-gray-800 border-gray-200";
		}
	};

	const getTypeIcon = (type: string) => {
		switch (type) {
			case "module":
				return BookOpen;
			case "quiz":
				return Target;
			case "practice":
				return Zap;
			case "review":
				return CheckCircle;
			default:
				return BookOpen;
		}
	};

	const formatTime = (minutes: number) => {
		const hours = Math.floor(minutes / 60);
		const mins = minutes % 60;
		if (hours > 0) {
			return `${hours}h ${mins}m`;
		}
		return `${mins}m`;
	};

	return (
		<div className={cn("w-full space-y-6", className)}>
			{/* Header */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Brain className="h-5 w-5" />
						Adaptacyjne Ścieżki Nauki
					</CardTitle>
					<CardDescription>
						Spersonalizowane rekomendacje oparte na Twoich postępach i
						zainteresowaniach
					</CardDescription>
				</CardHeader>
			</Card>

			{/* Learning Paths */}
			<div className="grid gap-6 lg:grid-cols-1">
				{learningPaths.map((path) => {
					const IconComponent = getTypeIcon(path.nodes[0]?.type || "module");
					const completedNodes = path.nodes.filter(
						(node) => node.isCompleted,
					).length;

					return (
						<Card key={path.id} className="relative overflow-hidden">
							<CardHeader>
								<div className="flex items-start justify-between">
									<div className="space-y-2">
										<CardTitle className="flex items-center gap-2">
											<IconComponent className="h-5 w-5" />
											{path.title}
											<Badge className={getDifficultyColor(path.difficulty)}>
												{path.difficulty}
											</Badge>
										</CardTitle>
										<CardDescription>{path.description}</CardDescription>

										{/* Reasoning */}
										<div className="rounded-lg bg-blue-50 p-3 text-sm">
											<div className="mb-1 flex items-center gap-2">
												<Lightbulb className="h-4 w-4 text-blue-600" />
												<span className="font-medium text-blue-900">
													Dlaczego ta ścieżka?
												</span>
											</div>
											<p className="text-blue-800">{path.reasoning}</p>
										</div>
									</div>

									<Button onClick={() => onPathSelect(path.id)}>
										Rozpocznij ścieżkę
										<ArrowRight className="ml-2 h-4 w-4" />
									</Button>
								</div>

								{/* Progress */}
								<div className="space-y-2">
									<div className="flex items-center justify-between text-sm">
										<span>Postęp ścieżki</span>
										<span>{Math.round(path.progress)}%</span>
									</div>
									<Progress value={path.progress} className="h-2" />
									<div className="flex items-center justify-between text-muted-foreground text-xs">
										<span>
											{completedNodes}/{path.nodes.length} ukończonych
										</span>
										<span>
											Łączny czas: {formatTime(path.estimatedTotalTime)}
										</span>
									</div>
								</div>
							</CardHeader>

							<CardContent>
								{/* Learning Path Nodes */}
								<div className="space-y-3">
									<h4 className="font-medium text-muted-foreground text-sm">
										Kolejne kroki:
									</h4>
									<div className="space-y-2">
										{path.nodes.slice(0, 3).map((node, index) => {
											const NodeIcon = getTypeIcon(node.type);
											const isAccessible =
												!node.isLocked &&
												(index === 0 || path.nodes[index - 1]?.isCompleted);

											return (
												<div
													key={node.id}
													className={cn(
														"flex items-center gap-3 rounded-lg border p-3 transition-colors",
														node.isCurrent && "border-primary/20 bg-primary/5",
														node.isCompleted && "border-green-200 bg-green-50",
														node.isLocked && "opacity-50",
													)}
												>
													<div className="flex-shrink-0">
														{node.isCompleted ? (
															<CheckCircle className="h-5 w-5 text-green-600" />
														) : node.isCurrent ? (
															<Star className="h-5 w-5 text-primary" />
														) : (
															<NodeIcon className="h-5 w-5 text-muted-foreground" />
														)}
													</div>

													<div className="min-w-0 flex-1">
														<h5 className="truncate font-medium text-sm">
															{node.title}
														</h5>
														<p className="line-clamp-2 text-muted-foreground text-xs">
															{node.description}
														</p>
														<div className="mt-1 flex items-center gap-2">
															<Badge
																variant="outline"
																className={cn(
																	"text-xs",
																	getDifficultyColor(node.difficulty),
																)}
															>
																{node.difficulty}
															</Badge>
															<span className="text-muted-foreground text-xs">
																{formatTime(node.estimatedTime)}
															</span>
															{node.score && (
																<span className="text-muted-foreground text-xs">
																	Wynik: {node.score}%
																</span>
															)}
														</div>
													</div>

													{isAccessible && (
														<Button
															variant={node.isCurrent ? "default" : "outline"}
															size="sm"
															onClick={() => onNodeSelect(path.id, node.id)}
														>
															{node.isCurrent ? "Kontynuuj" : "Rozpocznij"}
														</Button>
													)}
												</div>
											);
										})}
									</div>
								</div>
							</CardContent>
						</Card>
					);
				})}
			</div>

			{/* Learning Insights */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<TrendingUp className="h-5 w-5" />
						Analiza Twojego stylu nauki
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid gap-4 md:grid-cols-2">
						<div>
							<h4 className="mb-2 font-medium">Twój styl nauki</h4>
							<div className="space-y-2">
								<div className="flex items-center justify-between">
									<span className="text-sm">Preferowany styl</span>
									<Badge variant="outline">{profile.learningStyle}</Badge>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-sm">Poziom trudności</span>
									<Badge
										className={getDifficultyColor(profile.preferredDifficulty)}
									>
										{profile.preferredDifficulty}
									</Badge>
								</div>
							</div>
						</div>

						<div>
							<h4 className="mb-2 font-medium">Silne strony</h4>
							<div className="flex flex-wrap gap-1">
								{profile.strongAreas.map((area) => (
									<Badge key={area} variant="outline" className="text-xs">
										{area}
									</Badge>
								))}
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
