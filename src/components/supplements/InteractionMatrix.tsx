"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import React from "react";

export interface InteractionMatrixProps {
	supplements?: any[];
	interactions?: any[];
	onInteractionCheck?: (s1: string, s2: string) => void;
	className?: string;
}

// Mock interaction data
const mockInteractions = [
	{
		supplement1: "Alpha-GPC",
		supplement2: "L-Theanine",
		type: "synergistic",
		description: "Synergiczne działanie na koncentrację i pamięć",
		severity: "beneficial",
	},
	{
		supplement1: "Alpha-GPC",
		supplement2: "Ashwagandha",
		type: "neutral",
		description: "Brak znaczących interakcji",
		severity: "neutral",
	},
	{
		supplement1: "L-Theanine",
		supplement2: "Ashwagandha",
		type: "complementary",
		description: "Uzupełniające działanie przeciwstresowe",
		severity: "beneficial",
	},
];

const getInteractionIcon = (severity: string) => {
	switch (severity) {
		case "beneficial":
			return <CheckCircle className="h-4 w-4 text-green-600" />;
		case "neutral":
			return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
		case "harmful":
			return <XCircle className="h-4 w-4 text-red-600" />;
		default:
			return <AlertTriangle className="h-4 w-4 text-gray-600" />;
	}
};

const getInteractionColor = (severity: string) => {
	switch (severity) {
		case "beneficial":
			return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
		case "neutral":
			return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
		case "harmful":
			return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
		default:
			return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
	}
};

export default function InteractionMatrix({
	className,
}: InteractionMatrixProps) {
	return (
		<Card className={className}>
			<CardHeader>
				<CardTitle>Macierz Interakcji</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{mockInteractions.map((interaction, index) => (
						<div
							key={index}
							className="flex items-center justify-between rounded-lg border p-3"
						>
							<div className="flex items-center gap-3">
								{getInteractionIcon(interaction.severity)}
								<div>
									<div className="font-medium">
										{interaction.supplement1} + {interaction.supplement2}
									</div>
									<p className="text-muted-foreground text-sm">
										{interaction.description}
									</p>
								</div>
							</div>
							<Badge
								variant="secondary"
								className={getInteractionColor(interaction.severity)}
							>
								{interaction.type}
							</Badge>
						</div>
					))}

					{mockInteractions.length === 0 && (
						<div className="py-8 text-center text-muted-foreground">
							<AlertTriangle className="mx-auto mb-4 h-12 w-12 opacity-50" />
							<p>Wybierz suplementy aby zobaczyć ich interakcje</p>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
