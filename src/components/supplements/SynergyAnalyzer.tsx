"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Brain, TrendingUp, Zap } from "lucide-react";
import React from "react";

export interface SynergyAnalyzerProps {
	supplements?: any[];
	synergies?: any[];
	onSynergyIdentified?: (synergy: unknown) => void;
	className?: string;
}

// Mock synergy data
const mockSynergies = [
	{
		combination: ["Alpha-GPC", "L-Theanine"],
		polishCombination: ["Alfa-GPC", "L-Teanina"],
		effect: "Wzmocnienie koncentracji",
		strength: 85,
		mechanism: "Cholinergiczna modulacja z redukcją stresu",
		evidenceLevel: "Silne dowody",
	},
	{
		combination: ["L-Theanine", "Ashwagandha"],
		polishCombination: ["L-Teanina", "Ashwagandha"],
		effect: "Redukcja stresu i lęku",
		strength: 78,
		mechanism: "Modulacja osi HPA i GABA",
		evidenceLevel: "Umiarkowane dowody",
	},
	{
		combination: ["Alpha-GPC", "Ashwagandha"],
		polishCombination: ["Alfa-GPC", "Ashwagandha"],
		effect: "Poprawa funkcji poznawczych pod stresem",
		strength: 72,
		mechanism: "Neuroprotektywne działanie adaptogenne",
		evidenceLevel: "Umiarkowane dowody",
	},
];

const getStrengthColor = (strength: number) => {
	if (strength >= 80) return "text-green-600";
	if (strength >= 60) return "text-yellow-600";
	return "text-orange-600";
};

const getEvidenceColor = (level: string) => {
	switch (level) {
		case "Silne dowody":
			return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
		case "Umiarkowane dowody":
			return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
		case "Słabe dowody":
			return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
		default:
			return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
	}
};

export default function SynergyAnalyzer({ className }: SynergyAnalyzerProps) {
	return (
		<Card className={className}>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<TrendingUp className="h-5 w-5" />
					Analiza Synergii
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-6">
					{mockSynergies.map((synergy, index) => (
						<div key={index} className="space-y-3 rounded-lg border p-4">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<Zap className="h-4 w-4 text-blue-600" />
									<h4 className="font-medium">
										{synergy.polishCombination.join(" + ")}
									</h4>
								</div>
								<Badge
									variant="secondary"
									className={getEvidenceColor(synergy.evidenceLevel)}
								>
									{synergy.evidenceLevel}
								</Badge>
							</div>

							<div className="space-y-2">
								<div className="flex items-center justify-between">
									<span className="font-medium text-sm">Efekt:</span>
									<span className="text-sm">{synergy.effect}</span>
								</div>

								<div className="space-y-1">
									<div className="flex items-center justify-between">
										<span className="font-medium text-sm">Siła synergii:</span>
										<span
											className={`font-medium text-sm ${getStrengthColor(synergy.strength)}`}
										>
											{synergy.strength}%
										</span>
									</div>
									<Progress value={synergy.strength} className="h-2" />
								</div>

								<div className="flex items-start gap-2 pt-2">
									<Brain className="mt-0.5 h-4 w-4 flex-shrink-0 text-purple-600" />
									<div>
										<span className="font-medium text-sm">Mechanizm:</span>
										<p className="text-muted-foreground text-sm">
											{synergy.mechanism}
										</p>
									</div>
								</div>
							</div>
						</div>
					))}

					{mockSynergies.length === 0 && (
						<div className="py-8 text-center text-muted-foreground">
							<TrendingUp className="mx-auto mb-4 h-12 w-12 opacity-50" />
							<p>Wybierz co najmniej 2 suplementy aby analizować synergie</p>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
