"use client";

import { Award, BookOpen, Target, TrendingUp } from "lucide-react";
import React from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";

interface UserProgress {
	completedPaths: string[];
	currentPath?: string;
	totalModules: number;
	completedModules: number;
	streakDays: number;
	achievements: string[];
}

interface ProgressTrackerProps {
	userProgress?: UserProgress;
	progress?: any;
	onContinueLearning?: (pathId: string) => void;
	onProgressUpdate?: () => void;
}

export default function ProgressTracker({
	userProgress,
	onContinueLearning,
}: ProgressTrackerProps) {
	const progressPercentage =
		((userProgress?.completedModules || 0) /
			(userProgress?.totalModules || 1)) *
		100;

	return (
		<div className="space-y-6">
			<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
				{/* Overall Progress */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<TrendingUp className="h-5 w-5" />
							Ogólny postęp
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-2">
							<div className="flex justify-between text-sm">
								<span>Ukończone moduły</span>
								<span>
									{userProgress?.completedModules || 0}/
									{userProgress?.totalModules || 0}
								</span>
							</div>
							<Progress value={progressPercentage} className="h-2" />
							<p className="text-muted-foreground text-sm">
								{Math.round(progressPercentage)}% ukończone
							</p>
						</div>
					</CardContent>
				</Card>

				{/* Learning Streak */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Target className="h-5 w-5" />
							Seria nauki
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-center">
							<div className="font-bold text-3xl text-blue-600">
								{userProgress?.streakDays || 0}
							</div>
							<p className="text-muted-foreground text-sm">dni z rzędu</p>
						</div>
					</CardContent>
				</Card>

				{/* Achievements */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Award className="h-5 w-5" />
							Osiągnięcia
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-center">
							<div className="font-bold text-3xl text-yellow-600">
								{userProgress?.achievements?.length || 0}
							</div>
							<p className="text-muted-foreground text-sm">zdobytych odznak</p>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Completed Learning Paths */}
			<Card>
				<CardHeader>
					<CardTitle>Ukończone ścieżki nauki</CardTitle>
				</CardHeader>
				<CardContent>
					{(userProgress?.completedPaths?.length || 0) > 0 ? (
						<div className="space-y-2">
							{userProgress?.completedPaths?.map((pathId) => (
								<div
									key={pathId}
									className="flex items-center justify-between rounded-lg border p-3"
								>
									<div className="flex items-center gap-2">
										<BookOpen className="h-4 w-4 text-green-600" />
										<span className="font-medium">
											{pathId === "basics"
												? "Podstawy suplementacji"
												: pathId === "advanced"
													? "Zaawansowana suplementacja"
													: pathId}
										</span>
									</div>
									<Badge variant="default">Ukończono</Badge>
								</div>
							))}
						</div>
					) : (
						<p className="py-4 text-center text-muted-foreground">
							Nie ukończyłeś jeszcze żadnej ścieżki nauki
						</p>
					)}
				</CardContent>
			</Card>

			{/* Current Learning Path */}
			{userProgress?.currentPath && (
				<Card>
					<CardHeader>
						<CardTitle>Bieżąca ścieżka nauki</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="flex items-center justify-between">
							<div>
								<h4 className="font-medium">
									{userProgress?.currentPath === "basics"
										? "Podstawy suplementacji"
										: userProgress?.currentPath === "advanced"
											? "Zaawansowana suplementacja"
											: userProgress?.currentPath}
								</h4>
								<p className="text-muted-foreground text-sm">
									Kontynuuj naukę tam, gdzie skończyłeś
								</p>
							</div>
							<Button
								onClick={() => onContinueLearning?.(userProgress?.currentPath!)}
							>
								Kontynuuj
							</Button>
						</div>
					</CardContent>
				</Card>
			)}

			{/* Achievements List */}
			{(userProgress?.achievements?.length || 0) > 0 && (
				<Card>
					<CardHeader>
						<CardTitle>Twoje osiągnięcia</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
							{userProgress?.achievements?.map((achievement, index) => (
								<div
									key={index}
									className="flex items-center gap-3 rounded-lg border p-3"
								>
									<Award className="h-6 w-6 text-yellow-600" />
									<div>
										<h5 className="font-medium">{achievement}</h5>
										<p className="text-muted-foreground text-sm">
											Odznaka za postępy w nauce
										</p>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
