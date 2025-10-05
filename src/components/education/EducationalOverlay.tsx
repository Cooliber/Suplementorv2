"use client";

import { BookOpen, X } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface EducationalOverlayProps {
	onClose: () => void;
	onStartLearning: (pathId: string) => void;
}

export default function EducationalOverlay({
	onClose,
	onStartLearning,
}: EducationalOverlayProps) {
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
			<Card className="w-full max-w-md">
				<CardHeader>
					<div className="flex items-center justify-between">
						<CardTitle className="flex items-center gap-2">
							<BookOpen className="h-5 w-5" />
							Witaj w Grafie Wiedzy!
						</CardTitle>
						<Button variant="ghost" size="sm" onClick={onClose}>
							<X className="h-4 w-4" />
						</Button>
					</div>
				</CardHeader>
				<CardContent className="space-y-4">
					<p className="text-muted-foreground">
						Graf wiedzy pokazuje połączenia między suplementami,
						neurotransmiterami i funkcjami poznawczymi. Rozpocznij naukę, aby
						lepiej zrozumieć te relacje.
					</p>
					<div className="flex gap-2">
						<Button
							onClick={() => onStartLearning("basics")}
							className="flex-1"
						>
							Rozpocznij naukę
						</Button>
						<Button variant="outline" onClick={onClose} className="flex-1">
							Pomiń
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
