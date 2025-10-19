"use client";

/**
 * Filter System Usage Example
 * Demonstrates how to integrate the advanced filtering system
 */

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { SupplementWithRelations } from "@/types/supplement";
import {
	Database,
	ExternalLink,
	Filter,
	Github,
	Info,
	Search,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
	SupplementFilterSystem,
	extractFilterOptions,
	filterSupplements,
	useFilters,
} from "./index";

// Mock data for demonstration
const mockSupplements: SupplementWithRelations[] = [
	{
		id: "1",
		name: "Bacopa Monnieri",
		polishName: "Bakopa drobnolistna",
		commonNames: ["Bacopa", "Water Hyssop"],
		polishCommonNames: ["Bakopa", "Hyzop wodny"],
		category: "HERB",
		evidenceLevel: "MODERATE",
		description: "Naturalny suplement poprawiający pamięć i funkcje poznawcze",
		polishDescription:
			"Naturalny suplement poprawiający pamięć i funkcje poznawcze",
		activeCompounds: [
			{ name: "Bacosides", polishName: "Bakozydy", concentration: "55%" },
		],
		clinicalApplications: [
			{
				condition: "Memory Enhancement",
				polishCondition: "Poprawa pamięci",
				efficacy: "moderate",
				effectivenessRating: 7,
				evidenceLevel: "MODERATE",
				recommendedDose: "300mg",
			},
		],
		mechanisms: [
			{
				pathway: "Neuroprotection",
				polishPathway: "Neuroprotekcja",
				description: "Chroni neurony przed uszkodzeniami",
				polishDescription: "Chroni neurony przed uszkodzeniami",
				evidenceLevel: "MODERATE",
			},
		],
		dosageGuidelines: {
			therapeuticRange: { min: 300, max: 450, unit: "mg" },
			timing: ["raz dziennie"],
			withFood: true,
			contraindications: [],
			polishContraindications: [],
			interactions: [],
		},
		sideEffects: [],
		interactions: [],
		researchStudies: [],
		tags: ["natural", "cognitive", "memory"],
		lastUpdated: new Date().toISOString(),
		createdAt: new Date().toISOString(),
	},
	{
		id: "2",
		name: "Vitamin D3",
		polishName: "Witamina D3",
		commonNames: ["Vitamin D", "Cholecalciferol"],
		polishCommonNames: ["Witamina D", "Cholekalcyferol"],
		category: "VITAMIN",
		evidenceLevel: "STRONG",
		description: "Essential vitamin for bone health and immune function",
		polishDescription:
			"Esencjonalna witamina dla zdrowia kości i funkcji odpornościowych",
		activeCompounds: [
			{ name: "Cholecalciferol", polishName: "Cholekalcyferol" },
		],
		clinicalApplications: [
			{
				condition: "Bone Health",
				polishCondition: "Zdrowie kości",
				efficacy: "high",
				effectivenessRating: 9,
				evidenceLevel: "STRONG",
				recommendedDose: "2000 IU",
			},
		],
		mechanisms: [
			{
				pathway: "Calcium Absorption",
				polishPathway: "Wchłanianie wapnia",
				description: "Enhances calcium absorption in the gut",
				polishDescription: "Zwiększa wchłanianie wapnia w jelitach",
				evidenceLevel: "STRONG",
			},
		],
		dosageGuidelines: {
			therapeuticRange: { min: 1000, max: 4000, unit: "IU" },
			timing: ["raz dziennie"],
			withFood: true,
			contraindications: [],
			polishContraindications: [],
			interactions: [],
		},
		sideEffects: [],
		interactions: [],
		researchStudies: [],
		tags: ["essential", "vitamin", "bone-health"],
		lastUpdated: new Date().toISOString(),
		createdAt: new Date().toISOString(),
	},
	{
		id: "3",
		name: "Rhodiola Rosea",
		polishName: "Różeniec górski",
		commonNames: ["Rhodiola", "Golden Root"],
		polishCommonNames: ["Różeniec", "Złoty korzeń"],
		category: "ADAPTOGEN",
		evidenceLevel: "MODERATE",
		description: "Adaptogenic herb for stress management and energy",
		polishDescription: "Adaptogenne zioło do zarządzania stresem i energią",
		activeCompounds: [
			{ name: "Rosavins", polishName: "Rozawiny", concentration: "3%" },
			{ name: "Salidroside", polishName: "Salidrozyd", concentration: "1%" },
		],
		clinicalApplications: [
			{
				condition: "Stress Reduction",
				polishCondition: "Redukcja stresu",
				efficacy: "moderate",
				effectivenessRating: 7,
				evidenceLevel: "MODERATE",
				recommendedDose: "400mg",
			},
		],
		mechanisms: [
			{
				pathway: "Stress Adaptation",
				polishPathway: "Adaptacja do stresu",
				description: "Modulates stress response systems",
				polishDescription: "Moduluje systemy odpowiedzi na stres",
				evidenceLevel: "MODERATE",
			},
		],
		dosageGuidelines: {
			therapeuticRange: { min: 200, max: 600, unit: "mg" },
			timing: ["raz dziennie"],
			withFood: false,
			contraindications: [],
			polishContraindications: [],
			interactions: [],
		},
		sideEffects: [],
		interactions: [],
		researchStudies: [],
		tags: ["adaptogen", "stress", "energy"],
		lastUpdated: new Date().toISOString(),
		createdAt: new Date().toISOString(),
	},
];

export function FilterSystemExample() {
	const [supplements] = useState<SupplementWithRelations[]>(mockSupplements);
	const [filteredResults, setFilteredResults] = useState<
		SupplementWithRelations[]
	>([]);
	const [isLoading, setIsLoading] = useState(false);

	// Handle filtered results
	const handleFilteredResults = (results: SupplementWithRelations[]) => {
		setFilteredResults(results);
	};

	return (
		<div className="min-h-screen bg-background">
			{/* Header */}
			<div className="border-b bg-card">
				<div className="container mx-auto px-4 py-6">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="flex items-center gap-2 font-bold text-3xl">
								<Filter className="h-8 w-8" />
								Zaawansowane filtrowanie suplementów
							</h1>
							<p className="mt-2 text-muted-foreground">
								Kompletny system filtrowania z analizą wydajności i polską
								lokalizacją
							</p>
						</div>
						<div className="flex items-center gap-2">
							<Button variant="outline" size="sm">
								<Github className="mr-2 h-4 w-4" />
								Kod źródłowy
							</Button>
							<Button variant="outline" size="sm">
								<ExternalLink className="mr-2 h-4 w-4" />
								Dokumentacja
							</Button>
						</div>
					</div>
				</div>
			</div>

			<div className="container mx-auto px-4 py-8">
				<div className="grid gap-8 lg:grid-cols-3">
					{/* Filter System - Takes up 2 columns */}
					<div className="space-y-6 lg:col-span-2">
						<SupplementFilterSystem
							supplements={supplements}
							onFilteredResults={handleFilteredResults}
							isLoading={isLoading}
						/>

						{/* Results Display */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Search className="h-5 w-5" />
									Wyniki filtrowania
									<Badge variant="outline">
										{filteredResults.length} suplementów
									</Badge>
								</CardTitle>
								<CardDescription>
									Suplementy pasujące do wybranych kryteriów filtrowania
								</CardDescription>
							</CardHeader>
							<CardContent>
								{filteredResults.length > 0 ? (
									<div className="grid gap-4">
										{filteredResults.map((supplement) => (
											<Card key={supplement.id} className="p-4">
												<div className="flex items-start justify-between">
													<div className="flex-1">
														<div className="mb-2 flex items-center gap-2">
															<h3 className="font-semibold">
																{supplement.polishName}
															</h3>
															<Badge variant="outline">
																{supplement.category === "HERB"
																	? "Zioło"
																	: supplement.category === "VITAMIN"
																		? "Witamina"
																		: supplement.category === "ADAPTOGEN"
																			? "Adaptogen"
																			: supplement.category}
															</Badge>
															<Badge
																variant={
																	supplement.evidenceLevel === "STRONG"
																		? "default"
																		: supplement.evidenceLevel === "MODERATE"
																			? "secondary"
																			: "outline"
																}
															>
																{supplement.evidenceLevel === "STRONG"
																	? "Silne dowody"
																	: supplement.evidenceLevel === "MODERATE"
																		? "Umiarkowane"
																		: "Słabe"}
															</Badge>
														</div>
														<p className="mb-2 text-muted-foreground text-sm">
															{supplement.polishDescription}
														</p>
														<div className="flex flex-wrap gap-1">
															{supplement.tags.map((tag) => (
																<Badge
																	key={tag}
																	variant="outline"
																	className="text-xs"
																>
																	{tag}
																</Badge>
															))}
														</div>
													</div>
												</div>
											</Card>
										))}
									</div>
								) : (
									<div className="py-8 text-center">
										<Search className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
										<h3 className="mb-2 font-semibold text-lg">Brak wyników</h3>
										<p className="text-muted-foreground">
											Spróbuj zmienić kryteria filtrowania, aby znaleźć
											odpowiednie suplementy.
										</p>
									</div>
								)}
							</CardContent>
						</Card>
					</div>

					{/* Information Panel - Takes up 1 column */}
					<div className="space-y-6">
						{/* Features Overview */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Info className="h-5 w-5" />
									Cechy systemu
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3">
								<div className="space-y-2 text-sm">
									<div className="flex items-center gap-2">
										<div className="h-2 w-2 rounded-full bg-green-500" />
										<span>Wyszukiwanie tekstowe z punktacją trafności</span>
									</div>
									<div className="flex items-center gap-2">
										<div className="h-2 w-2 rounded-full bg-blue-500" />
										<span>Filtrowanie po kategoriach i poziomie dowodów</span>
									</div>
									<div className="flex items-center gap-2">
										<div className="h-2 w-2 rounded-full bg-purple-500" />
										<span>
											Multi-select dla substancji czynnych i zastosowań
										</span>
									</div>
									<div className="flex items-center gap-2">
										<div className="h-2 w-2 rounded-full bg-orange-500" />
										<span>Zakresowe filtry dla ceny, dawki i oceny</span>
									</div>
									<div className="flex items-center gap-2">
										<div className="h-2 w-2 rounded-full bg-red-500" />
										<span>Boolowskie filtry dla badań i opinii</span>
									</div>
									<div className="flex items-center gap-2">
										<div className="h-2 w-2 rounded-full bg-teal-500" />
										<span>Synchronizacja URL i presety filtrów</span>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Usage Statistics */}
						<Card>
							<CardHeader>
								<CardTitle className="text-lg">Statystyki użycia</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3">
								<div className="flex items-center justify-between text-sm">
									<span className="text-muted-foreground">
										Wszystkie suplementy
									</span>
									<Badge variant="outline">{supplements.length}</Badge>
								</div>
								<div className="flex items-center justify-between text-sm">
									<span className="text-muted-foreground">Po filtrowaniu</span>
									<Badge variant="outline">{filteredResults.length}</Badge>
								</div>
								<div className="flex items-center justify-between text-sm">
									<span className="text-muted-foreground">
										Skuteczność filtra
									</span>
									<Badge variant="outline">
										{Math.round(
											(filteredResults.length / supplements.length) * 100,
										)}
										%
									</Badge>
								</div>
							</CardContent>
						</Card>

						{/* Sample Data Info */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Database className="h-5 w-5" />
									Dane przykładowe
								</CardTitle>
							</CardHeader>
							<CardContent>
								<Alert>
									<Info className="h-4 w-4" />
									<AlertDescription className="text-sm">
										To demo używa przykładowych danych suplementów. W
										rzeczywistej aplikacji dane pochodziłyby z bazy danych lub
										API.
									</AlertDescription>
								</Alert>
							</CardContent>
						</Card>

						{/* Integration Guide */}
						<Card>
							<CardHeader>
								<CardTitle className="text-lg">Integracja</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3 text-sm">
								<div>
									<h4 className="mb-2 font-medium">Podstawowe użycie:</h4>
									<pre className="overflow-x-auto rounded bg-muted p-2 text-xs">
										{`import { SupplementFilterSystem } from "@/components/supplements";

<SupplementFilterSystem
  supplements={supplements}
  onFilteredResults={handleResults}
  isLoading={loading}
/>`}
									</pre>
								</div>

								<div>
									<h4 className="mb-2 font-medium">Zaawansowane filtry:</h4>
									<pre className="overflow-x-auto rounded bg-muted p-2 text-xs">
										{`import { useFilters } from "@/hooks/useFilters";

const { filters, updateFilter } = useFilters();
updateFilter("categories", ["HERB", "VITAMIN"]);`}
									</pre>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}
