"use client";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	canAccessPathway,
	getPathwaysByCategory,
	getRecommendedNextPathways,
	learningPathways,
} from "@/data/education/learning-pathways";
import {
	LearningPathway,
	type SupplementCategory,
	type UserPathwayProgress,
} from "@/types/education";
import {
	ArrowRight,
	BookOpen,
	Calendar,
	CheckCircle,
	ChevronRight,
	Clock,
	Filter,
	GraduationCap,
	Info,
	Lock,
	Play,
	Search,
	Star,
	Target,
	TrendingUp,
	Users,
} from "lucide-react";
import React, { useState } from "react";

interface LearningPathwayNavigatorProps {
	userProgress?: UserPathwayProgress[];
	completedPathwayIds?: string[];
	onStartPathway?: (pathwayId: string) => void;
	onContinuePathway?: (pathwayId: string) => void;
	showRecommendations?: boolean;
	filterCategory?: SupplementCategory;
}

export default function LearningPathwayNavigator({
	userProgress = [],
	completedPathwayIds = [],
	onStartPathway,
	onContinuePathway,
	showRecommendations = true,
	filterCategory,
}: LearningPathwayNavigatorProps) {
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
	const [selectedCategory, setSelectedCategory] = useState<
		SupplementCategory | "all"
	>(filterCategory || "all");

	// Filter pathways based on search and filters
	const filteredPathways = learningPathways.filter((pathway) => {
		// Search filter
		if (searchTerm) {
			const searchLower = searchTerm.toLowerCase();
			const matchesTitle = pathway.title.toLowerCase().includes(searchLower);
			const matchesDescription = pathway.description
				.toLowerCase()
				.includes(searchLower);
			const matchesOutcomes = pathway.outcomes.some((outcome) =>
				outcome.toLowerCase().includes(searchLower),
			);

			if (!matchesTitle && !matchesDescription && !matchesOutcomes) {
				return false;
			}
		}

		// Difficulty filter
		if (
			selectedDifficulty !== "all" &&
			pathway.difficulty !== selectedDifficulty
		) {
			return false;
		}

		// Category filter
		if (selectedCategory !== "all" && pathway.category !== selectedCategory) {
			return false;
		}

		return true;
	});

	// Get user progress for a pathway
	const getPathwayProgress = (
		pathwayId: string,
	): UserPathwayProgress | undefined => {
		return userProgress.find((progress) => progress.pathwayId === pathwayId);
	};

	// Get completion status for a pathway
	const getPathwayStatus = (
		pathwayId: string,
	): "not_started" | "in_progress" | "completed" => {
		if (completedPathwayIds.includes(pathwayId)) return "completed";
		if (userProgress.some((progress) => progress.pathwayId === pathwayId))
			return "in_progress";
		return "not_started";
	};

	// Check if pathway is accessible
	const isPathwayAccessible = (pathwayId: string): boolean => {
		return canAccessPathway(pathwayId, completedPathwayIds);
	};

	// Get difficulty color
	const getDifficultyColor = (difficulty: string) => {
		switch (difficulty) {
			case "beginner":
				return "bg-green-100 text-green-800 border-green-200";
			case "intermediate":
				return "bg-blue-100 text-blue-800 border-blue-200";
			case "advanced":
				return "bg-purple-100 text-purple-800 border-purple-200";
			case "expert":
				return "bg-red-100 text-red-800 border-red-200";
			default:
				return "bg-gray-100 text-gray-800 border-gray-200";
		}
	};

	// Get status icon
	const getStatusIcon = (status: string) => {
		switch (status) {
			case "completed":
				return <CheckCircle className="h-5 w-5 text-green-600" />;
			case "in_progress":
				return <Play className="h-5 w-5 text-blue-600" />;
			case "not_started":
				return <BookOpen className="h-5 w-5 text-muted-foreground" />;
			default:
				return <BookOpen className="h-5 w-5 text-muted-foreground" />;
		}
	};

	// Get recommended pathways
	const recommendedPathways = showRecommendations
		? getRecommendedNextPathways(completedPathwayIds).slice(0, 3)
		: [];

	return (
		<div className="space-y-6">
			{/* Search and Filter Bar */}
			<Card>
				<CardHeader className="pb-4">
					<div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
						<div className="flex flex-1 gap-2">
							<div className="relative max-w-sm flex-1">
								<Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform text-muted-foreground" />
								<input
									type="text"
									placeholder="Search pathways..."
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className="w-full rounded-md border border-input bg-background py-2 pr-4 pl-10 text-sm"
								/>
							</div>
							<div>
								<label htmlFor="difficulty-filter" className="sr-only">
									Filter by difficulty level
								</label>
								<select
									id="difficulty-filter"
									value={selectedDifficulty}
									onChange={(e) => setSelectedDifficulty(e.target.value)}
									className="rounded-md border border-input bg-background px-3 py-2 text-sm"
								>
									<option value="all">All Levels</option>
									<option value="beginner">Beginner</option>
									<option value="intermediate">Intermediate</option>
									<option value="advanced">Advanced</option>
									<option value="expert">Expert</option>
								</select>
							</div>
						</div>
					</div>
				</CardHeader>
			</Card>

			{/* Category Tabs */}
			<Tabs
				value={selectedCategory}
				onValueChange={(value) =>
					setSelectedCategory(value as SupplementCategory | "all")
				}
			>
				<TabsList className="grid w-full grid-cols-4 lg:grid-cols-7">
					<TabsTrigger value="all">All</TabsTrigger>
					<TabsTrigger value="vitamins_minerals">Vitamins</TabsTrigger>
					<TabsTrigger value="herbal_medicine">Herbal</TabsTrigger>
					<TabsTrigger value="cognitive_enhancers">Cognitive</TabsTrigger>
					<TabsTrigger value="sports_nutrition">Sports</TabsTrigger>
					<TabsTrigger value="gut_health">Gut Health</TabsTrigger>
					<TabsTrigger value="immune_support">Immune</TabsTrigger>
				</TabsList>
			</Tabs>

			{/* Recommended Pathways */}
			{recommendedPathways.length > 0 && (
				<Card className="border-primary/20 bg-primary/5">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<TrendingUp className="h-5 w-5 text-primary" />
							Recommended for You
						</CardTitle>
						<CardDescription>
							Pathways recommended based on your learning progress
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
							{recommendedPathways.map((pathway) => {
								const status = getPathwayStatus(pathway.id);
								const progress = getPathwayProgress(pathway.id);
								const isAccessible = isPathwayAccessible(pathway.id);

								return (
									<Card
										key={pathway.id}
										className={`cursor-pointer transition-all hover:shadow-md ${!isAccessible ? "opacity-60" : ""}`}
									>
										<CardHeader className="pb-3">
											<div className="flex items-start justify-between">
												<div className="flex-1">
													<CardTitle className="line-clamp-2 font-medium text-sm">
														{pathway.title}
													</CardTitle>
													<CardDescription className="mt-1 text-xs">
														{pathway.estimatedDuration}h • {pathway.difficulty}
													</CardDescription>
												</div>
												<div className="flex items-center gap-1">
													{getStatusIcon(status)}
													<Badge
														className={`text-xs ${getDifficultyColor(pathway.difficulty)}`}
													>
														{pathway.difficulty}
													</Badge>
												</div>
											</div>
										</CardHeader>
										<CardContent className="pt-0">
											<p className="mb-3 line-clamp-2 text-muted-foreground text-xs">
												{pathway.description}
											</p>
											{progress && (
												<div className="mb-3">
													<div className="mb-1 flex justify-between text-xs">
														<span>Progress</span>
														<span>{Math.round(progress.overallProgress)}%</span>
													</div>
													<Progress
														value={progress.overallProgress}
														className="h-1"
													/>
												</div>
											)}
											<Button
												size="sm"
												className="w-full"
												disabled={!isAccessible}
												onClick={() => {
													if (status === "in_progress" && onContinuePathway) {
														onContinuePathway(pathway.id);
													} else if (
														status === "not_started" &&
														onStartPathway
													) {
														onStartPathway(pathway.id);
													}
												}}
											>
												{!isAccessible ? (
													<>
														<Lock className="mr-1 h-3 w-3" />
														Locked
													</>
												) : status === "completed" ? (
													<>
														<CheckCircle className="mr-1 h-3 w-3" />
														Review
													</>
												) : status === "in_progress" ? (
													<>
														<Play className="mr-1 h-3 w-3" />
														Continue
													</>
												) : (
													<>
														<BookOpen className="mr-1 h-3 w-3" />
														Start
													</>
												)}
											</Button>
										</CardContent>
									</Card>
								);
							})}
						</div>
					</CardContent>
				</Card>
			)}

			{/* All Pathways */}
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<h2 className="font-bold text-2xl">All Learning Pathways</h2>
					<p className="text-muted-foreground text-sm">
						{filteredPathways.length} pathway
						{filteredPathways.length !== 1 ? "s" : ""}
					</p>
				</div>

				<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
					{filteredPathways.map((pathway) => {
						const status = getPathwayStatus(pathway.id);
						const progress = getPathwayProgress(pathway.id);
						const isAccessible = isPathwayAccessible(pathway.id);

						return (
							<Card
								key={pathway.id}
								className={`transition-all hover:shadow-md ${!isAccessible ? "opacity-60" : ""}`}
							>
								<CardHeader>
									<div className="mb-2 flex items-start justify-between">
										<div className="flex-1">
											<CardTitle className="flex items-center gap-2">
												{getStatusIcon(status)}
												{pathway.title}
											</CardTitle>
											<CardDescription className="mt-1">
												{pathway.description}
											</CardDescription>
										</div>
										<div className="flex flex-col items-end gap-2">
											<Badge
												className={`${getDifficultyColor(pathway.difficulty)}`}
											>
												{pathway.difficulty}
											</Badge>
											{!isAccessible && (
												<Badge variant="outline" className="text-xs">
													<Lock className="mr-1 h-3 w-3" />
													Locked
												</Badge>
											)}
										</div>
									</div>

									<div className="flex items-center gap-4 text-muted-foreground text-sm">
										<div className="flex items-center gap-1">
											<Clock className="h-4 w-4" />
											{pathway.estimatedDuration}h
										</div>
										<div className="flex items-center gap-1">
											<BookOpen className="h-4 w-4" />
											{pathway.modules.length} modules
										</div>
										<div className="flex items-center gap-1">
											<Target className="h-4 w-4" />
											{pathway.outcomes.length} outcomes
										</div>
									</div>
								</CardHeader>

								<CardContent className="space-y-4">
									{/* Progress Bar */}
									{progress && (
										<div>
											<div className="mb-2 flex justify-between text-sm">
												<span>Progress</span>
												<span>{Math.round(progress.overallProgress)}%</span>
											</div>
											<Progress value={progress.overallProgress} />
											<p className="mt-1 text-muted-foreground text-xs">
												{progress.completedModules.length} of{" "}
												{pathway.modules.length} modules completed
											</p>
										</div>
									)}

									{/* Learning Outcomes Preview */}
									<div>
										<h4 className="mb-2 font-medium text-sm">
											What You'll Learn
										</h4>
										<ul className="space-y-1 text-sm">
											{pathway.outcomes.slice(0, 3).map((outcome, index) => (
												<li key={index} className="flex items-start gap-2">
													<CheckCircle className="mt-0.5 h-3 w-3 flex-shrink-0 text-green-600" />
													<span className="text-muted-foreground">
														{outcome}
													</span>
												</li>
											))}
											{pathway.outcomes.length > 3 && (
												<li className="ml-5 text-muted-foreground text-xs">
													+{pathway.outcomes.length - 3} more outcomes
												</li>
											)}
										</ul>
									</div>

									{/* Action Buttons */}
									<div className="flex gap-2">
										<Button
											className="flex-1"
											disabled={!isAccessible}
											onClick={() => {
												if (status === "in_progress" && onContinuePathway) {
													onContinuePathway(pathway.id);
												} else if (status === "not_started" && onStartPathway) {
													onStartPathway(pathway.id);
												}
											}}
										>
											{!isAccessible ? (
												<>
													<Lock className="mr-2 h-4 w-4" />
													Complete Prerequisites
												</>
											) : status === "completed" ? (
												<>
													<CheckCircle className="mr-2 h-4 w-4" />
													Review Pathway
												</>
											) : status === "in_progress" ? (
												<>
													<Play className="mr-2 h-4 w-4" />
													Continue Learning
												</>
											) : (
												<>
													<BookOpen className="mr-2 h-4 w-4" />
													Start Pathway
												</>
											)}
										</Button>

										<Dialog>
											<DialogTrigger asChild>
												<Button variant="outline" size="sm">
													<Info className="h-4 w-4" />
												</Button>
											</DialogTrigger>
											<DialogContent className="max-w-2xl">
												<DialogHeader>
													<DialogTitle>{pathway.title}</DialogTitle>
													<DialogDescription>
														{pathway.description}
													</DialogDescription>
												</DialogHeader>

												<div className="space-y-6">
													{/* Prerequisites */}
													{pathway.prerequisites &&
														pathway.prerequisites.length > 0 && (
															<div>
																<h4 className="mb-2 font-medium">
																	Prerequisites
																</h4>
																<div className="space-y-2">
																	{pathway.prerequisites.map((prereqId) => {
																		const prereq = learningPathways.find(
																			(p) => p.id === prereqId,
																		);
																		const prereqCompleted =
																			completedPathwayIds.includes(prereqId);

																		return (
																			<div
																				key={prereqId}
																				className="flex items-center gap-2 rounded border p-2"
																			>
																				{prereqCompleted ? (
																					<CheckCircle className="h-4 w-4 text-green-600" />
																				) : (
																					<Lock className="h-4 w-4 text-muted-foreground" />
																				)}
																				<span className="text-sm">
																					{prereq?.title || prereqId}
																				</span>
																			</div>
																		);
																	})}
																</div>
															</div>
														)}

													{/* All Learning Outcomes */}
													<div>
														<h4 className="mb-2 font-medium">
															Learning Outcomes
														</h4>
														<ul className="space-y-2">
															{pathway.outcomes.map((outcome, index) => (
																<li
																	key={index}
																	className="flex items-start gap-2"
																>
																	<CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
																	<span className="text-sm">{outcome}</span>
																</li>
															))}
														</ul>
													</div>

													{/* Modules Preview */}
													<div>
														<h4 className="mb-2 font-medium">
															Modules ({pathway.modules.length})
														</h4>
														<div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
															{pathway.modules.map((moduleId, index) => (
																<div
																	key={moduleId}
																	className="flex items-center gap-2 rounded bg-muted p-2 text-sm"
																>
																	<span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
																		{index + 1}
																	</span>
																	<span className="truncate">
																		{moduleId.replace(/_/g, " ")}
																	</span>
																</div>
															))}
														</div>
													</div>
												</div>
											</DialogContent>
										</Dialog>
									</div>
								</CardContent>
							</Card>
						);
					})}
				</div>
			</div>

			{/* Empty State */}
			{filteredPathways.length === 0 && (
				<Card>
					<CardContent className="py-12 text-center">
						<GraduationCap className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
						<h3 className="mb-2 font-medium text-lg">No pathways found</h3>
						<p className="mb-4 text-muted-foreground">
							Try adjusting your search terms or filters to find relevant
							learning pathways.
						</p>
						<Button
							onClick={() => {
								setSearchTerm("");
								setSelectedDifficulty("all");
								setSelectedCategory("all");
							}}
							variant="outline"
						>
							Clear all filters
						</Button>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
