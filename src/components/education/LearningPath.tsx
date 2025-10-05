"use client";

import { ArrowLeft, CheckCircle, Play } from "lucide-react";
import React from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface LearningPathProps {
	pathId: string;
	onBack?: () => void;
	onComplete: (pathId: string) => void;
	onContinueLearning?: () => void;
	className?: string;
}

const learningContent = {
	basics: {
		title: "Podstawy suplementacji",
		modules: [
			{
				id: "intro",
				title: "Wprowadzenie do suplementów",
				description: "Czym są suplementy i jak działają",
				completed: false,
			},
			{
				id: "types",
				title: "Rodzaje suplementów",
				description: "Nootropiki, adaptageny, witaminy",
				completed: false,
			},
			{
				id: "safety",
				title: "Bezpieczeństwo suplementacji",
				description: "Interakcje i przeciwwskazania",
				completed: false,
			},
		],
	},
	advanced: {
		title: "Zaawansowana suplementacja",
		modules: [
			{
				id: "stacking",
				title: "Stackowanie suplementów",
				description: "Łączenie suplementów dla lepszych efektów",
				completed: false,
			},
			{
				id: "timing",
				title: "Optymalne dawkowanie",
				description: "Kiedy i jak przyjmować suplementy",
				completed: false,
			},
		],
	},
};

export default function LearningPath({
	pathId,
	onBack,
	onComplete,
	onContinueLearning,
	className,
}: LearningPathProps) {
	const content = learningContent[pathId as keyof typeof learningContent];

	if (!content) {
		return (
			<Card>
				<CardContent className="p-6">
					<p>Ścieżka nauki nie została znaleziona.</p>
					<Button onClick={onBack} className="mt-4">
						<ArrowLeft className="mr-2 h-4 w-4" />
						Powrót
					</Button>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center gap-4">
				<Button variant="outline" onClick={onBack}>
					<ArrowLeft className="mr-2 h-4 w-4" />
					Powrót
				</Button>
				<h2 className="font-bold text-2xl">{content.title}</h2>
			</div>

			<div className="space-y-4">
				{content.modules.map((module, index) => (
					<Card key={module.id}>
						<CardHeader>
							<div className="flex items-center justify-between">
								<CardTitle className="flex items-center gap-2 text-lg">
									{module.completed ? (
										<CheckCircle className="h-5 w-5 text-green-600" />
									) : (
										<Play className="h-5 w-5 text-blue-600" />
									)}
									{module.title}
								</CardTitle>
								<Badge variant={module.completed ? "default" : "secondary"}>
									{module.completed ? "Ukończono" : "Do zrobienia"}
								</Badge>
							</div>
						</CardHeader>
						<CardContent>
							<p className="mb-4 text-muted-foreground">{module.description}</p>
							<Button
								variant={module.completed ? "outline" : "default"}
								disabled={module.completed}
							>
								{module.completed ? "Ukończono" : "Rozpocznij moduł"}
							</Button>
						</CardContent>
					</Card>
				))}
			</div>

			<div className="flex justify-end">
				<Button onClick={() => onComplete(pathId)}>
					Zakończ ścieżkę nauki
				</Button>
			</div>
		</div>
	);
}
