"use client";

/**
 * Circadian Timing Panel Component
 * Displays 24-hour circadian rhythm data with body statistics and supplement timing recommendations
 */

import { useState } from "react";
import { Clock, Sun, Moon, Sunrise, Sunset, CloudMoon, Activity } from "lucide-react";
import { api } from "@/trpc/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

// Time period icons mapping
const TIME_PERIOD_ICONS = {
	EARLY_MORNING: Sunrise,
	LATE_MORNING: Sun,
	AFTERNOON: Sun,
	EVENING: Sunset,
	NIGHT: Moon,
	DEEP_NIGHT: CloudMoon,
} as const;

// Time period colors
const TIME_PERIOD_COLORS = {
	EARLY_MORNING: "bg-orange-100 text-orange-800 border-orange-300",
	LATE_MORNING: "bg-yellow-100 text-yellow-800 border-yellow-300",
	AFTERNOON: "bg-amber-100 text-amber-800 border-amber-300",
	EVENING: "bg-purple-100 text-purple-800 border-purple-300",
	NIGHT: "bg-indigo-100 text-indigo-800 border-indigo-300",
	DEEP_NIGHT: "bg-slate-100 text-slate-800 border-slate-300",
} as const;

export function CircadianTimingPanel() {
	const [selectedPeriod, setSelectedPeriod] = useState<string>("EARLY_MORNING");

	// Temporarily disabled due to circadianTiming router issues
	// const { data: timePeriods, isLoading } = api.circadianTiming.getAll.useQuery();
	// const { data: bodyStats } = api.circadianTiming.getBodyStatisticsTimeline.useQuery();

	// Mock data for build purposes
	const timePeriods: any[] = [];
	const isLoading = false;

	if (isLoading) {
		return (
			<div className="space-y-4">
				<Skeleton className="h-12 w-full" />
				<Skeleton className="h-64 w-full" />
			</div>
		);
	}

	if (!timePeriods || timePeriods.length === 0) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Rytm Dobowy</CardTitle>
					<CardDescription>Brak danych o rytmie dobowym</CardDescription>
				</CardHeader>
			</Card>
		);
	}

	const selectedPeriodData = timePeriods.find((p: any) => p.timeOfDay === selectedPeriod);

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center gap-3">
				<Clock className="h-8 w-8 text-primary" />
				<div>
					<h2 className="text-2xl font-bold">Rytm Dobowy i Suplementacja</h2>
					<p className="text-muted-foreground">
						Optymalne dawkowanie suplementów zgodne z naturalnym rytmem organizmu
					</p>
				</div>
			</div>

			{/* Timeline Visualization */}
			<Card>
				<CardHeader>
					<CardTitle>Oś Czasu 24h</CardTitle>
					<CardDescription>
						Kliknij na okres dnia, aby zobaczyć szczegóły
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
						{timePeriods.map((period: any) => {
							const Icon = TIME_PERIOD_ICONS[period.timeOfDay as keyof typeof TIME_PERIOD_ICONS];
							const isSelected = selectedPeriod === period.timeOfDay;

							return (
								<button
									key={period.id}
									onClick={() => setSelectedPeriod(period.timeOfDay)}
									className={`
										p-4 rounded-lg border-2 transition-all
										${isSelected ? "ring-2 ring-primary ring-offset-2" : ""}
										${TIME_PERIOD_COLORS[period.timeOfDay as keyof typeof TIME_PERIOD_COLORS]}
										hover:scale-105 active:scale-95
									`}
								>
									<div className="flex flex-col items-center gap-2">
										<Icon className="h-6 w-6" />
										<div className="text-xs font-semibold text-center">
											{period.polishTimeOfDay}
										</div>
										<div className="text-xs opacity-75">{period.timeRange}</div>
									</div>
								</button>
							);
						})}
					</div>
				</CardContent>
			</Card>

			{/* Selected Period Details */}
			{selectedPeriodData && (
				<Tabs defaultValue="overview" className="w-full">
					<TabsList className="grid w-full grid-cols-3">
						<TabsTrigger value="overview">Przegląd</TabsTrigger>
						<TabsTrigger value="body-stats">Statystyki Ciała</TabsTrigger>
						<TabsTrigger value="supplements">Suplementy</TabsTrigger>
					</TabsList>

					{/* Overview Tab */}
					<TabsContent value="overview" className="space-y-4">
						<Card>
							<CardHeader>
								<CardTitle>{selectedPeriodData.polishTimeOfDay}</CardTitle>
								<CardDescription>{selectedPeriodData.timeRange}</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<p className="text-sm">{selectedPeriodData.polishDescription}</p>
								
								<div className="bg-muted p-4 rounded-lg">
									<h4 className="font-semibold mb-2">Ogólne Wskazówki</h4>
									<p className="text-sm">{selectedPeriodData.polishGeneralGuidance}</p>
								</div>

								{selectedPeriodData.scientificBasis && selectedPeriodData.scientificBasis.length > 0 && (
									<div>
										<h4 className="font-semibold mb-2">Podstawy Naukowe</h4>
										<ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
											{selectedPeriodData.scientificBasis.map((basis: string, idx: number) => (
												<li key={idx}>{basis}</li>
											))}
										</ul>
									</div>
								)}
							</CardContent>
						</Card>
					</TabsContent>

					{/* Body Statistics Tab */}
					<TabsContent value="body-stats" className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<Card>
								<CardHeader>
									<CardTitle className="text-lg">Temperatura Ciała</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="flex items-baseline gap-2">
										<span className="text-4xl font-bold">
											{selectedPeriodData.bodyStatistics.temperature}°C
										</span>
									</div>
									<div className="mt-4 h-2 bg-gradient-to-r from-blue-500 via-yellow-500 to-red-500 rounded-full relative">
										<div
											className="absolute top-0 h-2 w-2 bg-black rounded-full -translate-y-1/4"
											style={{
												left: `${((selectedPeriodData.bodyStatistics.temperature - 35.5) / 1.5) * 100}%`,
											}}
										/>
									</div>
									<div className="flex justify-between text-xs text-muted-foreground mt-1">
										<span>35.5°C</span>
										<span>37.0°C</span>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle className="text-lg">Kortyzol</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="flex items-baseline gap-2">
										<span className="text-4xl font-bold">
											{selectedPeriodData.bodyStatistics.cortisol}%
										</span>
									</div>
									<div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
										<div
											className="h-full bg-orange-500 transition-all"
											style={{ width: `${selectedPeriodData.bodyStatistics.cortisol}%` }}
										/>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle className="text-lg">Melatonina</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="flex items-baseline gap-2">
										<span className="text-4xl font-bold">
											{selectedPeriodData.bodyStatistics.melatonin}%
										</span>
									</div>
									<div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
										<div
											className="h-full bg-indigo-500 transition-all"
											style={{ width: `${selectedPeriodData.bodyStatistics.melatonin}%` }}
										/>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle className="text-lg">Sprawność Trawienia</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="flex items-baseline gap-2">
										<span className="text-4xl font-bold">
											{selectedPeriodData.bodyStatistics.digestiveEfficiency}%
										</span>
									</div>
									<div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
										<div
											className="h-full bg-green-500 transition-all"
											style={{ width: `${selectedPeriodData.bodyStatistics.digestiveEfficiency}%` }}
										/>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle className="text-lg">Czujność</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="flex items-baseline gap-2">
										<span className="text-4xl font-bold">
											{selectedPeriodData.bodyStatistics.alertness}%
										</span>
									</div>
									<div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
										<div
											className="h-full bg-blue-500 transition-all"
											style={{ width: `${selectedPeriodData.bodyStatistics.alertness}%` }}
										/>
									</div>
								</CardContent>
							</Card>

							<Card className="md:col-span-2">
								<CardHeader>
									<CardTitle className="text-lg">Opis Stanu Organizmu</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-sm">{selectedPeriodData.bodyStatistics.polishDescription}</p>
								</CardContent>
							</Card>
						</div>
					</TabsContent>

					{/* Supplements Tab */}
					<TabsContent value="supplements" className="space-y-4">
						{/* Recommended Supplements */}
						{selectedPeriodData.recommendedSupplements && selectedPeriodData.recommendedSupplements.length > 0 && (
							<Card>
								<CardHeader>
									<CardTitle className="text-lg flex items-center gap-2">
										<Activity className="h-5 w-5 text-green-600" />
										Zalecane Suplementy
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										{selectedPeriodData.recommendedSupplements.map((supp: any, idx: number) => (
											<div key={idx} className="border-l-4 border-green-500 pl-4 py-2">
												<div className="flex items-center gap-2 mb-2">
													<h4 className="font-semibold">{supp.polishSupplementName}</h4>
													<Badge variant={supp.priority === "HIGH" ? "default" : "secondary"}>
														{supp.priority === "HIGH" ? "Wysoki priorytet" : supp.priority === "MEDIUM" ? "Średni priorytet" : "Niski priorytet"}
													</Badge>
												</div>
												<p className="text-sm text-muted-foreground">{supp.polishRationale}</p>
											</div>
										))}
									</div>
								</CardContent>
							</Card>
						)}

						{/* Supplements to Avoid */}
						{selectedPeriodData.avoidSupplements && selectedPeriodData.avoidSupplements.length > 0 && (
							<Card>
								<CardHeader>
									<CardTitle className="text-lg flex items-center gap-2 text-red-600">
										<Activity className="h-5 w-5" />
										Unikaj Tych Suplementów
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="flex flex-wrap gap-2">
										{selectedPeriodData.polishAvoidSupplements?.map((supp: string, idx: number) => (
											<Badge key={idx} variant="destructive">
												{supp}
											</Badge>
										))}
									</div>
								</CardContent>
							</Card>
						)}
					</TabsContent>
				</Tabs>
			)}
		</div>
	);
}

export default CircadianTimingPanel;

