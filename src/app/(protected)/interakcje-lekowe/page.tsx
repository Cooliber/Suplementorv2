/**
 * Drug Interactions Page for Protected Route
 * This page provides drug and supplement interaction checking
 */

"use client";

import {
	DrugInteractionChecker,
	InteractionVisualizationPanel,
} from "@/components/interactions";
import { InteractionMatrix } from "@/components/supplements";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
	Activity,
	AlertTriangle,
	Calendar,
	CheckCircle,
	Eye,
	Info,
	Minus,
	Pill,
	Plus,
	Search,
	Target,
	User,
	XCircle,
} from "lucide-react";
import React, { useState } from "react";

// Mock data for interactions
const mockInteractions = [
	{
		id: "interaction-1",
		substance1: {
			id: "warfarin",
			name: "Warfarin",
			polishName: "Waryfaryna",
			type: "PRESCRIPTION_DRUG",
			category: "Anticoagulant",
			polishCategory: "Antykoagulant",
		},
		substance2: {
			id: "vitamin-k",
			name: "Vitamin K",
			polishName: "Witamina K",
			type: "SUPPLEMENT",
			category: "Vitamin",
			polishCategory: "Witamina",
		},
		severity: "HIGH",
		polishSeverity: "WYSOKI",
		mechanism: "Vitamin K antagonizes warfarin's anticoagulant effect",
		polishMechanism:
			"Witamina K antagonizuje działanie przeciwzakrzepowe waryfariny",
		risk: "Increased risk of blood clots",
		polishRisk: "Zwiększone ryzyko skrzepów krwi",
		recommendation: "Avoid high doses of vitamin K",
		polishRecommendation: "Unikaj wysokich dawek witaminy K",
		evidenceLevel: "STRONG",
		polishEvidenceLevel: "Silne",
	},
	{
		id: "interaction-2",
		substance1: {
			id: "sertraline",
			name: "Sertraline",
			polishName: "Sertalina",
			type: "PRESCRIPTION_DRUG",
			category: "SSRI Antidepressant",
			polishCategory: "SSRI Antydepresant",
		},
		substance2: {
			id: "st-johns-wort",
			name: "St. John's Wort",
			polishName: "Janowa korzeń",
			type: "SUPPLEMENT",
			category: "Herb",
			polishCategory: "Zioło",
		},
		severity: "MODERATE",
		polishSeverity: "ŚREDNI",
		mechanism: "St. John's Wort induces CYP2D6 metabolism of sertraline",
		polishMechanism: "Janowa korzeń indukuje metabolizm CYP2D6 sertaliny",
		risk: "Reduced effectiveness of sertraline",
		polishRisk: "Zmniejszona skuteczność sertaliny",
		recommendation: "Avoid concurrent use",
		polishRecommendation: "Unikaj jednoczesnego użycia",
		evidenceLevel: "MODERATE",
		polishEvidenceLevel: "Umiarkowane",
	},
	{
		id: "interaction-3",
		substance1: {
			id: "aspirin",
			name: "Aspirin",
			polishName: "Aspiryna",
			type: "OVER_THE_COUNTER",
			category: "NSAID",
			polishCategory: "NLPZ",
		},
		substance2: {
			id: "fish-oil",
			name: "Fish Oil",
			polishName: "Olej rybny",
			type: "SUPPLEMENT",
			category: "Omega-3 Fatty Acids",
			polishCategory: "Kwasy tłuszczowe Omega-3",
		},
		severity: "LOW",
		polishSeverity: "NISKI",
		mechanism: "Both have anticoagulant properties",
		polishMechanism: "Oba mają właściwości przeciwzakrzepowe",
		risk: "Slightly increased bleeding risk",
		polishRisk: "Lekko zwiększone ryzyko krwawienia",
		recommendation: "Monitor for bleeding signs",
		polishRecommendation: "Monitoruj objawy krwawienia",
		evidenceLevel: "WEAK",
		polishEvidenceLevel: "Słabe",
	},
];

const mockSubstances = [
	{
		id: "warfarin",
		name: "Warfarin",
		polishName: "Waryfaryna",
		type: "PRESCRIPTION_DRUG",
	},
	{
		id: "sertraline",
		name: "Sertraline",
		polishName: "Sertalina",
		type: "PRESCRIPTION_DRUG",
	},
	{
		id: "aspirin",
		name: "Aspirin",
		polishName: "Aspiryna",
		type: "OVER_THE_COUNTER",
	},
	{
		id: "vitamin-k",
		name: "Vitamin K",
		polishName: "Witamina K",
		type: "SUPPLEMENT",
	},
	{
		id: "st-johns-wort",
		name: "St. John's Wort",
		polishName: "Janowa korzeń",
		type: "SUPPLEMENT",
	},
	{
		id: "fish-oil",
		name: "Fish Oil",
		polishName: "Olej rybny",
		type: "SUPPLEMENT",
	},
	{
		id: "ginkgo",
		name: "Ginkgo Biloba",
		polishName: "Ginkgo biloba",
		type: "SUPPLEMENT",
	},
	{ id: "garlic", name: "Garlic", polishName: "Czosnek", type: "SUPPLEMENT" },
	{
		id: "melatonin",
		name: "Melatonin",
		polishName: "Melatonina",
		type: "SUPPLEMENT",
	},
	{
		id: "magnesium",
		name: "Magnesium",
		polishName: "Magnez",
		type: "SUPPLEMENT",
	},
];

const DrugInteractionsPage = () => {
	const [selectedSubstances, setSelectedSubstances] = useState<string[]>([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [activeTab, setActiveTab] = useState("checker");

	// Filter substances based on search
	const filteredSubstances = mockSubstances.filter(
		(substance) =>
			substance.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			substance.polishName.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	// Get interactions for selected substances
	const getInteractionsForSelected = () => {
		if (selectedSubstances.length < 2) return [];

		return mockInteractions.filter(
			(interaction) =>
				selectedSubstances.includes(interaction.substance1.id) &&
				selectedSubstances.includes(interaction.substance2.id),
		);
	};

	const handleSubstanceToggle = (substanceId: string) => {
		if (selectedSubstances.includes(substanceId)) {
			setSelectedSubstances(
				selectedSubstances.filter((id) => id !== substanceId),
			);
		} else {
			setSelectedSubstances([...selectedSubstances, substanceId]);
		}
	};

	const handleCheckAll = () => {
		setSelectedSubstances(mockSubstances.map((s) => s.id));
	};

	const handleClearAll = () => {
		setSelectedSubstances([]);
	};

	const currentInteractions = getInteractionsForSelected();

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<header className="border-b bg-white">
				<div className="container mx-auto px-4 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<AlertTriangle className="h-8 w-8 text-red-600" />
							<h1 className="font-bold text-2xl text-gray-900">
								Interakcje Lekowe
							</h1>
						</div>
						<div className="flex items-center gap-4">
							<Badge variant="outline" className="flex items-center gap-1">
								<Activity className="h-4 w-4" />
								Premium
							</Badge>
							<Button variant="outline" size="sm">
								<User className="mr-2 h-4 w-4" />
								Profil
							</Button>
						</div>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="container mx-auto px-4 py-8">
				<div className="mb-8">
					<h2 className="mb-2 font-bold text-3xl">
						Bezpieczne stosowanie suplementów
					</h2>
					<p className="text-gray-600">
						Sprawdź potencjalne interakcje między lekami recepturowymi, OTC i
						suplementami
					</p>
				</div>

				{/* Action Bar */}
				<div className="mb-6 flex flex-wrap gap-4">
					<Button onClick={handleCheckAll} variant="outline" size="sm">
						<Plus className="mr-2 h-4 w-4" />
						Zaznacz wszystkie
					</Button>
					<Button onClick={handleClearAll} variant="outline" size="sm">
						<Minus className="mr-2 h-4 w-4" />
						Wyczyść wszystkie
					</Button>
					<div className="relative max-w-md flex-1">
						<Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform text-gray-400" />
						<input
							type="text"
							placeholder="Szukaj leków lub suplementów..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="w-full rounded-lg border py-2 pr-4 pl-10"
						/>
					</div>
				</div>

				<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
					{/* Substance Selector */}
					<Card className="lg:col-span-1">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Search className="h-5 w-5" />
								Wybierz substancje
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-3">
								{filteredSubstances.map((substance) => (
									<div
										key={substance.id}
										className={`flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-colors ${
											selectedSubstances.includes(substance.id)
												? "border-blue-200 bg-blue-50"
												: "hover:bg-gray-50"
										}`}
										onClick={() => handleSubstanceToggle(substance.id)}
									>
										<div>
											<h3 className="font-medium">{substance.polishName}</h3>
											<p className="text-gray-600 text-sm">{substance.name}</p>
										</div>
										<Badge variant="outline">
											{substance.type === "PRESCRIPTION_DRUG"
												? "Recepta"
												: substance.type === "OVER_THE_COUNTER"
													? "OTC"
													: "Suplement"}
										</Badge>
									</div>
								))}
							</div>
						</CardContent>
					</Card>

					{/* Results Panel */}
					<div className="space-y-6 lg:col-span-2">
						{/* Selected Substances */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Target className="h-5 w-5" />
									Wybrane substancje ({selectedSubstances.length})
								</CardTitle>
							</CardHeader>
							<CardContent>
								{selectedSubstances.length === 0 ? (
									<div className="py-8 text-center text-gray-500">
										<Pill className="mx-auto mb-4 h-12 w-12 text-gray-400" />
										<p>Wybierz substancje, aby sprawdzić interakcje</p>
									</div>
								) : (
									<div className="grid grid-cols-1 gap-3 md:grid-cols-2">
										{selectedSubstances.map((substanceId) => {
											const substance = mockSubstances.find(
												(s) => s.id === substanceId,
											);
											return (
												<div
													key={substanceId}
													className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
												>
													<div>
														<h3 className="font-medium">
															{substance?.polishName}
														</h3>
														<p className="text-gray-600 text-sm">
															{substance?.name}
														</p>
													</div>
													<Button
														size="sm"
														variant="outline"
														onClick={() => handleSubstanceToggle(substanceId)}
													>
														<Minus className="h-4 w-4" />
													</Button>
												</div>
											);
										})}
									</div>
								)}
							</CardContent>
						</Card>

						{/* Interactions Results */}
						{currentInteractions.length > 0 && (
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<AlertTriangle className="h-5 w-5" />
										Wykryte interakcje ({currentInteractions.length})
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										{currentInteractions.map((interaction) => (
											<Card
												key={interaction.id}
												className="border-l-4 border-l-red-500"
											>
												<CardContent className="p-4">
													<div className="flex items-start justify-between">
														<div className="flex-1">
															<div className="mb-2 flex items-center gap-2">
																<h3 className="font-semibold">
																	{interaction.substance1.polishName} +{" "}
																	{interaction.substance2.polishName}
																</h3>
																<Badge
																	className={
																		interaction.severity === "HIGH"
																			? "bg-red-100 text-red-800"
																			: interaction.severity === "MODERATE"
																				? "bg-yellow-100 text-yellow-800"
																				: "bg-green-100 text-green-800"
																	}
																>
																	{interaction.polishSeverity}
																</Badge>
																<Badge variant="outline">
																	{interaction.polishEvidenceLevel}
																</Badge>
															</div>

															<p className="mb-2 text-gray-600 text-sm">
																{interaction.polishMechanism}
															</p>

															<div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
																<div>
																	<h4 className="mb-1 font-medium text-gray-500 text-xs">
																		RYZYKO
																	</h4>
																	<p className="text-sm">
																		{interaction.polishRisk}
																	</p>
																</div>
																<div>
																	<h4 className="mb-1 font-medium text-gray-500 text-xs">
																		REKOMENDACJA
																	</h4>
																	<p className="text-sm">
																		{interaction.polishRecommendation}
																	</p>
																</div>
															</div>
														</div>

														<div className="ml-4 flex flex-col gap-2">
															<Button
																size="sm"
																variant="outline"
																onClick={() =>
																	console.log(`More info for ${interaction.id}`)
																}
															>
																<Info className="h-4 w-4" />
															</Button>
														</div>
													</div>
												</CardContent>
											</Card>
										))}
									</div>
								</CardContent>
							</Card>
						)}

						{/* Interaction Visualization */}
						{selectedSubstances.length > 0 && (
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<Activity className="h-5 w-5" />
										Wizualizacja interakcji
									</CardTitle>
								</CardHeader>
								<CardContent>
									<InteractionVisualizationPanel
										supplementIds={selectedSubstances}
									/>
								</CardContent>
							</Card>
						)}
					</div>
				</div>

				{/* Interaction Matrix */}
				<div className="mt-8">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Activity className="h-5 w-5" />
								Macierz interakcji
							</CardTitle>
						</CardHeader>
						<CardContent>
							<InteractionMatrix />
						</CardContent>
					</Card>
				</div>
			</main>

			{/* Footer */}
			<footer className="mt-12 border-t bg-white">
				<div className="container mx-auto px-4 py-6">
					<div className="flex flex-col items-center justify-between gap-4 md:flex-row">
						<div className="flex items-center gap-2">
							<AlertTriangle className="h-5 w-5 text-red-600" />
							<span className="font-medium">Suplementor</span>
							<span className="text-gray-500 text-sm">© 2025</span>
						</div>
						<div className="flex items-center gap-4 text-gray-600 text-sm">
							<span>Ochrona prywatności</span>
							<span>Regulamin</span>
							<span>Pomoc</span>
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
};

export default DrugInteractionsPage;
