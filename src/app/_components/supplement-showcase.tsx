"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Brain, Shield, Zap } from "lucide-react";
import Link from "next/link";

// Sample supplement data - in real app this would come from the database
const featuredSupplements = [
	{
		id: "alpha-gpc",
		name: "Alpha-GPC",
		polishName: "Alfa-GPC",
		category: "NOOTROPIC",
		polishCategory: "Nootropik",
		description:
			"Premium choline source supporting memory and cognitive function",
		polishDescription:
			"Wysokiej jakości źródło choliny wspierające pamięć i funkcje poznawcze",
		benefits: [
			"Wzmocnienie pamięci",
			"Poprawa koncentracji",
			"Wsparcie neuroplastyczności",
		],
		evidenceLevel: "STRONG",
		price: "od 24,99 €",
		icon: Brain,
	},
	{
		id: "l-theanine",
		name: "L-Theanine",
		polishName: "L-Teanina",
		category: "AMINO_ACID",
		polishCategory: "Aminokwas",
		description: "Calming amino acid promoting relaxed focus without sedation",
		polishDescription:
			"Uspokajający aminokwas promujący spokojną koncentrację bez sedacji",
		benefits: [
			"Spokojna koncentracja",
			"Redukcja stresu",
			"Poprawa jakości snu",
		],
		evidenceLevel: "MODERATE",
		price: "od 18,99 €",
		icon: Zap,
	},
	{
		id: "ashwagandha",
		name: "Ashwagandha",
		polishName: "Ashwagandha",
		category: "ADAPTOGEN",
		polishCategory: "Adaptogen",
		description: "Powerful adaptogenic herb for stress management and vitality",
		polishDescription:
			"Potężne zioło adaptogenne do zarządzania stresem i witalności",
		benefits: ["Adaptacja do stresu", "Poprawa snu", "Zwiększenie energii"],
		evidenceLevel: "STRONG",
		price: "od 21,99 €",
		icon: Shield,
	},
];

const evidenceLevelColors = {
	STRONG: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
	MODERATE:
		"bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
	WEAK: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
};

const evidenceLevelLabels = {
	STRONG: "Silne dowody",
	MODERATE: "Umiarkowane dowody",
	WEAK: "Słabe dowody",
};

export function SupplementShowcase() {
	return (
		<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
			{featuredSupplements.map((supplement) => {
				const IconComponent = supplement.icon;

				return (
					<Card
						key={supplement.id}
						className="group transition-shadow duration-300 hover:shadow-lg"
					>
						<CardHeader className="space-y-4">
							<div className="flex items-center justify-between">
								<div className="flex items-center space-x-3">
									<div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900">
										<IconComponent className="h-6 w-6 text-blue-600 dark:text-blue-400" />
									</div>
									<div>
										<CardTitle className="text-lg">
											{supplement.polishName}
										</CardTitle>
										<CardDescription className="text-gray-500 text-sm">
											{supplement.polishCategory}
										</CardDescription>
									</div>
								</div>
								<Badge
									variant="secondary"
									className={
										evidenceLevelColors[
											supplement.evidenceLevel as keyof typeof evidenceLevelColors
										]
									}
								>
									{
										evidenceLevelLabels[
											supplement.evidenceLevel as keyof typeof evidenceLevelLabels
										]
									}
								</Badge>
							</div>

							<CardDescription className="text-sm leading-relaxed">
								{supplement.polishDescription}
							</CardDescription>
						</CardHeader>

						<CardContent className="space-y-4">
							<div>
								<h4 className="mb-2 font-medium text-sm">Główne korzyści:</h4>
								<ul className="space-y-1">
									{supplement.benefits.map((benefit, index) => (
										<li
											key={index}
											className="flex items-center text-gray-600 text-sm dark:text-gray-300"
										>
											<span className="mr-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-600" />
											{benefit}
										</li>
									))}
								</ul>
							</div>

							<div className="flex items-center justify-between border-t pt-4">
								<div className="font-semibold text-blue-600 text-lg dark:text-blue-400">
									{supplement.price}
								</div>
								<Button asChild variant="outline" size="sm">
									<Link href={`/suplementy/${supplement.id}`}>
										Dowiedz się więcej
									</Link>
								</Button>
							</div>
						</CardContent>
					</Card>
				);
			})}
		</div>
	);
}
