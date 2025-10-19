/**
 * Side-by-Side Supplement Comparison View
 */

"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
	AlertTriangle,
	CheckCircle,
	Minus,
	TrendingDown,
	TrendingUp,
	X,
} from "lucide-react";
import React from "react";

import type { SupplementWithRelations } from "@/types/supplement";
import type { ComparisonViewProps } from "./types";

export function ComparisonView({
	selectedSupplements,
	onRemove,
	className = "",
}: ComparisonViewProps) {
	if (selectedSupplements.length === 0) {
		return (
			<Card className={className}>
				<CardContent className="flex h-32 items-center justify-center">
					<p className="text-muted-foreground">
						Wybierz suplementy z tabeli, aby zobaczyć porównanie
					</p>
				</CardContent>
			</Card>
		);
	}

	// Helper function to compare values and return comparison indicator
	const getComparisonIndicator = (values: any[]) => {
		if (values.length < 2) return null;

		const firstValue = values[0];
		const allSame = values.every((value) => value === firstValue);

		if (allSame) return <Minus className="h-4 w-4 text-muted-foreground" />;

		// For evidence levels
		if (
			typeof firstValue === "string" &&
			["STRONG", "MODERATE", "WEAK", "INSUFFICIENT", "CONFLICTING"].includes(
				firstValue,
			)
		) {
			const levelOrder = {
				STRONG: 4,
				MODERATE: 3,
				WEAK: 2,
				INSUFFICIENT: 1,
				CONFLICTING: 0,
			};
			const firstLevel = levelOrder[firstValue as keyof typeof levelOrder];
			const maxLevel = Math.max(
				...values.map((v) => levelOrder[v as keyof typeof levelOrder]),
			);

			if (firstLevel === maxLevel) {
				return <CheckCircle className="h-4 w-4 text-green-600" />;
			}
			return <TrendingDown className="h-4 w-4 text-red-600" />;
		}

		// For numbers (research count, etc.)
		if (typeof firstValue === "number") {
			const maxValue = Math.max(...values);
			if (firstValue === maxValue) {
				return <TrendingUp className="h-4 w-4 text-green-600" />;
			}
			return <TrendingDown className="h-4 w-4 text-red-600" />;
		}

		return null;
	};

	// Helper function to format dosage for comparison
	const formatDosage = (supplement: SupplementWithRelations) => {
		const { therapeuticRange, timing } = supplement.dosageGuidelines;
		return `${therapeuticRange.min}-${therapeuticRange.max} ${therapeuticRange.unit} (${timing.join(", ")})`;
	};

	// Helper function to format evidence level with color
	const formatEvidenceLevel = (level: string) => {
		const colorMap = {
			STRONG: "bg-green-100 text-green-800",
			MODERATE: "bg-blue-100 text-blue-800",
			WEAK: "bg-yellow-100 text-yellow-800",
			INSUFFICIENT: "bg-gray-100 text-gray-800",
			CONFLICTING: "bg-red-100 text-red-800",
		};

		return (
			<Badge className={colorMap[level as keyof typeof colorMap]}>
				{level}
			</Badge>
		);
	};

	// Comparison data
	const comparisonData = [
		{
			label: "Nazwa",
			polishLabel: "Nazwa",
			values: selectedSupplements.map((s) => s.name),
			render: (value: string, supplement: SupplementWithRelations) => (
				<div className="font-medium">{value}</div>
			),
		},
		{
			label: "Nazwa polska",
			polishLabel: "Nazwa polska",
			values: selectedSupplements.map((s) => s.polishName),
		},
		{
			label: "Kategoria",
			polishLabel: "Kategoria",
			values: selectedSupplements.map((s) => s.category),
			render: (value: string) => <Badge variant="outline">{value}</Badge>,
		},
		{
			label: "Poziom dowodów",
			polishLabel: "Poziom dowodów",
			values: selectedSupplements.map((s) => s.evidenceLevel),
			render: (value: string) => formatEvidenceLevel(value),
		},
		{
			label: "Dawkowanie",
			polishLabel: "Dawkowanie",
			values: selectedSupplements.map(formatDosage),
		},
		{
			label: "Liczba badań",
			polishLabel: "Liczba badań",
			values: selectedSupplements.map((s) => s.researchStudies.length),
			render: (value: number) => <div className="font-medium">{value}</div>,
		},
		{
			label: "Efekty uboczne",
			polishLabel: "Efekty uboczne",
			values: selectedSupplements.map((s) => s.sideEffects.length),
			render: (value: number, supplement: SupplementWithRelations) => {
				const commonEffects = supplement.sideEffects.filter(
					(se) => se.frequency === "common",
				);
				return (
					<div className="text-sm">
						{commonEffects.length > 0 ? (
							<div className="text-red-600">
								{commonEffects.slice(0, 2).map((effect, idx) => (
									<div key={idx}>{effect.effect}</div>
								))}
							</div>
						) : (
							<span className="text-green-600">Minimalne</span>
						)}
					</div>
				);
			},
		},
		{
			label: "Interakcje",
			polishLabel: "Interakcje",
			values: selectedSupplements.map((s) => s.interactions.length),
			render: (value: number, supplement: SupplementWithRelations) => {
				const severeInteractions = supplement.interactions.filter(
					(i) => i.severity === "severe",
				);
				const moderateInteractions = supplement.interactions.filter(
					(i) => i.severity === "moderate",
				);

				return (
					<div className="text-sm">
						{severeInteractions.length > 0 && (
							<Badge variant="destructive" className="mr-1">
								{severeInteractions.length} poważne
							</Badge>
						)}
						{moderateInteractions.length > 0 && (
							<Badge variant="outline" className="text-yellow-600">
								{moderateInteractions.length} umiarkowane
							</Badge>
						)}
						{severeInteractions.length === 0 &&
							moderateInteractions.length === 0 && (
								<span className="text-green-600">Bezpieczny</span>
							)}
					</div>
				);
			},
		},
	];

	return (
		<Card className={className}>
			<CardHeader>
				<CardTitle className="flex items-center justify-between">
					Porównanie suplementów ({selectedSupplements.length})
					<div className="flex gap-1">
						{selectedSupplements.map((supplement, index) => (
							<Button
								key={supplement.id}
								variant="ghost"
								size="sm"
								onClick={() => onRemove?.(supplement.id)}
								className="h-6 w-6 p-0"
							>
								<X className="h-4 w-4" />
							</Button>
						))}
					</div>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<ScrollArea className="h-[600px]">
					<div className="space-y-6">
						{/* Supplement Headers */}
						<div
							className="grid gap-4"
							style={{
								gridTemplateColumns: `200px repeat(${selectedSupplements.length}, 1fr)`,
							}}
						>
							<div />
							{selectedSupplements.map((supplement) => (
								<Card key={supplement.id} className="p-3">
									<div className="text-center">
										<div className="font-medium text-sm">{supplement.name}</div>
										<div className="text-muted-foreground text-xs">
											{supplement.polishName}
										</div>
										<Badge variant="outline" className="mt-1 text-xs">
											{supplement.category}
										</Badge>
									</div>
								</Card>
							))}
						</div>

						<Separator />

						{/* Comparison Data */}
						{comparisonData.map((row, rowIndex) => (
							<div key={rowIndex}>
								<div
									className="mb-3 grid gap-4"
									style={{
										gridTemplateColumns: `200px repeat(${selectedSupplements.length}, 1fr)`,
									}}
								>
									<div className="flex items-center gap-2 font-medium text-sm">
										{row.polishLabel}
										{getComparisonIndicator(row.values)}
									</div>
									{selectedSupplements.map((supplement, colIndex) => (
										<div key={supplement.id} className="min-h-[40px]">
											{row.render ? (
												(row.render as any)(row.values[colIndex], supplement)
											) : (
												<div className="text-sm">{row.values[colIndex]}</div>
											)}
										</div>
									))}
								</div>
								{rowIndex < comparisonData.length - 1 && (
									<Separator className="my-4" />
								)}
							</div>
						))}

						{/* Detailed Applications */}
						<div>
							<h4 className="mb-3 font-medium">Zastosowania kliniczne</h4>
							<div
								className="grid gap-4"
								style={{
									gridTemplateColumns: `200px repeat(${selectedSupplements.length}, 1fr)`,
								}}
							>
								<div />
								{selectedSupplements.map((supplement) => (
									<div key={supplement.id} className="space-y-2">
										{supplement.clinicalApplications
											.slice(0, 3)
											.map((app, idx) => (
												<div key={idx} className="rounded bg-muted p-2 text-xs">
													<div className="font-medium">{app.condition}</div>
													<div className="text-muted-foreground">
														{app.polishCondition}
													</div>
													<div className="text-muted-foreground">
														{app.recommendedDose}
													</div>
												</div>
											))}
									</div>
								))}
							</div>
						</div>

						{/* Mechanisms of Action */}
						<div>
							<h4 className="mb-3 font-medium">Mechanizmy działania</h4>
							<div
								className="grid gap-4"
								style={{
									gridTemplateColumns: `200px repeat(${selectedSupplements.length}, 1fr)`,
								}}
							>
								<div />
								{selectedSupplements.map((supplement) => (
									<div key={supplement.id} className="space-y-1">
										{supplement.mechanisms.slice(0, 2).map((mechanism, idx) => (
											<div key={idx} className="rounded bg-blue-50 p-2 text-xs">
												<div className="font-medium">{mechanism.pathway}</div>
												<div className="text-muted-foreground">
													{mechanism.polishPathway}
												</div>
											</div>
										))}
									</div>
								))}
							</div>
						</div>
					</div>
				</ScrollArea>
			</CardContent>
		</Card>
	);
}
