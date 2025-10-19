"use client";

import {
	SkeletonDosageCalculator,
	SkeletonDosageResult,
} from "@/components/loading/SkeletonCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator, Clock, Target } from "lucide-react";
import React, { useState } from "react";

export interface DosageCalculatorProps {
	supplement?: any;
	weight?: number;
	age?: number;
	gender?: string;
	className?: string;
	isLoading?: boolean;
}

// Mock dosage data
const mockSupplementDosages = [
	{
		id: "alpha-gpc",
		name: "Alpha-GPC",
		polishName: "Alfa-GPC",
		standardDose: 300,
		unit: "mg",
		frequency: "2-3 razy dziennie",
		timing: "Z posiłkami",
		maxDaily: 1200,
		notes: "Rozpocznij od mniejszej dawki i stopniowo zwiększaj",
	},
	{
		id: "l-theanine",
		name: "L-Theanine",
		polishName: "L-Teanina",
		standardDose: 200,
		unit: "mg",
		frequency: "1-2 razy dziennie",
		timing: "Rano lub przed snem",
		maxDaily: 600,
		notes: "Można łączyć z kofeiną w stosunku 2:1",
	},
	{
		id: "ashwagandha",
		name: "Ashwagandha",
		polishName: "Ashwagandha",
		standardDose: 500,
		unit: "mg",
		frequency: "1-2 razy dziennie",
		timing: "Z posiłkami",
		maxDaily: 1000,
		notes:
			"Najlepiej przyjmować wieczorem ze względu na działanie uspokajające",
	},
];

export default function DosageCalculator({
	supplement,
	weight = 70,
	age = 30,
	gender = "male",
	className,
	isLoading = false,
}: DosageCalculatorProps) {
	const [selectedSupplement, setSelectedSupplement] = useState<string>(
		supplement?.id || "",
	);
	const [bodyWeight, setBodyWeight] = useState<string>(weight.toString());
	const [customDose, setCustomDose] = useState<string>("");

	const selectedSupplementData = mockSupplementDosages.find(
		(s) => s.id === selectedSupplement,
	);

	const calculatePersonalizedDose = () => {
		if (!selectedSupplementData || !bodyWeight) return null;

		const weight = Number.parseFloat(bodyWeight);
		const baseDose = selectedSupplementData.standardDose;

		// Simple weight-based calculation (this would be more sophisticated in real app)
		let adjustedDose = baseDose;
		if (weight < 60) {
			adjustedDose = baseDose * 0.8;
		} else if (weight > 80) {
			adjustedDose = baseDose * 1.2;
		}

		return Math.round(adjustedDose);
	};

	const personalizedDose = calculatePersonalizedDose();

	if (isLoading) {
		return <SkeletonDosageCalculator />;
	}

	return (
		<Card className={className}>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Calculator className="h-5 w-5" />
					Kalkulator Dawkowania
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-6">
					{/* Supplement Selection */}
					<div className="space-y-2">
						<Label htmlFor="supplement-select">Wybierz suplement</Label>
						<select
							id="supplement-select"
							value={selectedSupplement}
							onChange={(e) => setSelectedSupplement(e.target.value)}
							className="w-full rounded-md border p-2"
							aria-label="Wybierz suplement do kalkulacji dawkowania"
						>
							<option value="">-- Wybierz suplement --</option>
							{mockSupplementDosages.map((supplement) => (
								<option key={supplement.id} value={supplement.id}>
									{supplement.polishName}
								</option>
							))}
						</select>
					</div>

					{/* Body Weight Input */}
					<div className="space-y-2">
						<Label htmlFor="body-weight">Masa ciała (kg)</Label>
						<Input
							id="body-weight"
							type="number"
							placeholder="70"
							value={bodyWeight}
							onChange={(e) => setBodyWeight(e.target.value)}
						/>
					</div>

					{/* Results */}
					{selectedSupplementData && (
						<div className="space-y-4 rounded-lg border bg-muted/50 p-4">
							<h4 className="flex items-center gap-2 font-medium">
								<Target className="h-4 w-4" />
								Zalecane dawkowanie dla {selectedSupplementData.polishName}
							</h4>

							<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
								<div>
									<span className="font-medium text-sm">
										Standardowa dawka:
									</span>
									<div className="font-semibold text-lg">
										{selectedSupplementData.standardDose}{" "}
										{selectedSupplementData.unit}
									</div>
								</div>

								{personalizedDose && (
									<div>
										<span className="font-medium text-sm">
											Dostosowana dawka:
										</span>
										<div className="font-semibold text-blue-600 text-lg">
											{personalizedDose} {selectedSupplementData.unit}
										</div>
									</div>
								)}
							</div>

							<div className="space-y-2">
								<div className="flex items-center gap-2">
									<Clock className="h-4 w-4 text-muted-foreground" />
									<span className="text-sm">
										<span className="font-medium">Częstotliwość:</span>{" "}
										{selectedSupplementData.frequency}
									</span>
								</div>

								<div className="flex items-center gap-2">
									<Target className="h-4 w-4 text-muted-foreground" />
									<span className="text-sm">
										<span className="font-medium">Timing:</span>{" "}
										{selectedSupplementData.timing}
									</span>
								</div>

								<div className="flex items-center gap-2">
									<Badge variant="outline">
										Maks. dzienna dawka: {selectedSupplementData.maxDaily}{" "}
										{selectedSupplementData.unit}
									</Badge>
								</div>
							</div>

							{selectedSupplementData.notes && (
								<div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-950">
									<p className="text-blue-800 text-sm dark:text-blue-200">
										<span className="font-medium">Uwagi:</span>{" "}
										{selectedSupplementData.notes}
									</p>
								</div>
							)}
						</div>
					)}

					{/* Custom Dose Input */}
					<div className="space-y-2">
						<Label htmlFor="custom-dose">Własna dawka (opcjonalnie)</Label>
						<Input
							id="custom-dose"
							type="number"
							placeholder="Wprowadź własną dawkę"
							value={customDose}
							onChange={(e) => setCustomDose(e.target.value)}
						/>
					</div>

					{/* Disclaimer */}
					<div className="rounded-lg bg-yellow-50 p-3 dark:bg-yellow-950">
						<p className="text-sm text-yellow-800 dark:text-yellow-200">
							<span className="font-medium">Ważne:</span> Te kalkulacje mają
							charakter orientacyjny. Zawsze skonsultuj się z lekarzem lub
							farmaceutą przed rozpoczęciem suplementacji.
						</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
