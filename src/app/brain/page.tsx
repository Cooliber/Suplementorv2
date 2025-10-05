/**
 * 3D Brain Visualization Page
 * This page provides an interactive 3D brain model with educational content
 */

"use client";

import { Interactive3DBrainModel } from "@/components/brain";
import { NeurotransmitterEducationModule } from "@/components/education";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Activity,
	Award,
	BarChart3,
	BookOpen,
	Brain,
	Eye,
	EyeOff,
	Lightbulb,
	RotateCcw,
	Target,
	TrendingUp,
	Users,
	Zap,
	ZoomIn,
	ZoomOut,
} from "lucide-react";
import React, { useState } from "react";

// Mock brain regions data
const mockBrainRegions = [
	{
		id: "hippocampus",
		name: "Hippocampus",
		polishName: "Hipokamp",
		description: "Critical for memory formation and spatial navigation",
		polishDescription:
			"Krytyczny dla tworzenia pamięci i nawigacji przestrzennej",
		function: "Memory consolidation and spatial memory",
		polishFunction: "Konsolidacja pamięci i pamięć przestrzenna",
		relatedNeurotransmitters: ["Acetylcholine", "Glutamate"],
		polishRelatedNeurotransmitters: ["Acetylocholina", "Glutaminian"],
		associatedFunctions: ["Learning", "Memory", "Spatial navigation"],
		polishAssociatedFunctions: [
			"Uczenie się",
			"Pamięć",
			"Nawigacja przestrzenna",
		],
	},
	{
		id: "prefrontal-cortex",
		name: "Prefrontal Cortex",
		polishName: "Kora czołowa",
		description: "Responsible for executive functions and decision making",
		polishDescription:
			"Odpowiedzialna za funkcje egzekutywne i podejmowanie decyzji",
		function: "Executive functions, decision making, working memory",
		polishFunction: "Funkcje egzekutywne, podejmowanie decyzji, pamięć robocza",
		relatedNeurotransmitters: ["Dopamine", "Norepinephrine"],
		polishRelatedNeurotransmitters: ["Dopamina", "Noradrenalin"],
		associatedFunctions: ["Planning", "Working memory", "Inhibition"],
		polishAssociatedFunctions: ["Planowanie", "Pamięć robocza", "Hamowanie"],
	},
	{
		id: "amygdala",
		name: "Amygdala",
		polishName: "Migdałek",
		description: "Processes emotions and fear responses",
		polishDescription: "Przetwarza emocje i reakcje strachu",
		function: "Emotional processing, fear response, emotional memory",
		polishFunction: "Przetwarzanie emocji, reakcja strachu, pamięć emocjonalna",
		relatedNeurotransmitters: ["Serotonin", "GABA"],
		polishRelatedNeurotransmitters: ["Serotonin", "GABA"],
		associatedFunctions: ["Fear", "Emotional memory", "Stress response"],
		polishAssociatedFunctions: [
			"Strach",
			"Pamięć emocjonalna",
			"Reakcja na stres",
		],
	},
];

// Mock neurotransmitters data
const mockNeurotransmitters = [
	{
		id: "acetylcholine",
		name: "Acetylcholine",
		polishName: "Acetylocholina",
		description: "Primary neurotransmitter for memory and learning",
		polishDescription: "Główny neuroprzekaźnik dla pamięci i uczenia się",
		function: "Memory formation, muscle activation, arousal",
		polishFunction: "Tworzenie pamięci, aktywacja mięśni, pobudzenie",
		pathways: ["Cholinergic pathway"],
		polishPathways: ["Ścieżka cholinergiczna"],
		relatedSupplements: ["Alpha-GPC", "CDP-Choline", "Huperzine A"],
	},
	{
		id: "dopamine",
		name: "Dopamine",
		polishName: "Dopamina",
		description:
			"Neurotransmitter associated with motivation, reward, and movement",
		polishDescription: "Neuroprzekaźnik związany z motywacją, nagrodą i ruchem",
		function: "Reward processing, motivation, motor control",
		polishFunction: "Przetwarzanie nagrody, motywacja, kontrola ruchowa",
		pathways: ["Mesolimbic pathway", "Nigrostriatal pathway"],
		polishPathways: ["Ścieżka mezolimbigiczna", "Ścieżka nigtostriatalna"],
		relatedSupplements: ["L-Tyrosine", "Rhodiola", "Phenylalanine"],
	},
];

const BrainVisualizationPage = () => {
	const [activeTab, setActiveTab] = useState("model");
	const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
	const [selectedNeurotransmitter, setSelectedNeurotransmitter] = useState<
		string | null
	>(null);
	const [showLabels, setShowLabels] = useState(true);
	const [showConnections, setShowConnections] = useState(true);

	const handleRegionSelect = (regionId: string) => {
		setSelectedRegion(regionId);
		setActiveTab("region-info");
	};

	const handleNeurotransmitterSelect = (neurotransmitterId: string) => {
		setSelectedNeurotransmitter(neurotransmitterId);
		setActiveTab("neurotransmitter-info");
	};

	const handleConnectionSelect = (connectionId: string) => {
		console.log("Connection selected:", connectionId);
	};

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<header className="border-b bg-white">
				<div className="container mx-auto px-4 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<Brain className="h-8 w-8 text-blue-600" />
							<h1 className="font-bold text-2xl text-gray-900">
								Interaktywny Mózg 3D
							</h1>
						</div>
						<div className="flex items-center gap-4">
							<Button
								variant="outline"
								size="sm"
								onClick={() => setShowLabels(!showLabels)}
							>
								{showLabels ? (
									<EyeOff className="mr-2 h-4 w-4" />
								) : (
									<Eye className="mr-2 h-4 w-4" />
								)}
								{showLabels ? "Ukryj etykiety" : "Pokaż etykiety"}
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={() => setShowConnections(!showConnections)}
							>
								{showConnections ? (
									<EyeOff className="mr-2 h-4 w-4" />
								) : (
									<Eye className="mr-2 h-4 w-4" />
								)}
								{showConnections ? "Ukryj połączenia" : "Pokaż połączenia"}
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={() => console.log("Reset view")}
							>
								<RotateCcw className="h-4 w-4" />
							</Button>
						</div>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="container mx-auto px-4 py-8">
				<Tabs
					value={activeTab}
					onValueChange={setActiveTab}
					className="space-y-6"
				>
					<TabsList className="grid w-full grid-cols-5">
						<TabsTrigger value="model" className="flex items-center gap-2">
							<Brain className="h-4 w-4" />
							Model 3D
						</TabsTrigger>
						<TabsTrigger
							value="region-info"
							className="flex items-center gap-2"
						>
							<Target className="h-4 w-4" />
							Regiony mózgu
						</TabsTrigger>
						<TabsTrigger
							value="neurotransmitter-info"
							className="flex items-center gap-2"
						>
							<Zap className="h-4 w-4" />
							Neuroprzekaźniki
						</TabsTrigger>
						<TabsTrigger value="education" className="flex items-center gap-2">
							<BookOpen className="h-4 w-4" />
							Edukacja
						</TabsTrigger>
						<TabsTrigger
							value="connections"
							className="flex items-center gap-2"
						>
							<Activity className="h-4 w-4" />
							Połączenia
						</TabsTrigger>
					</TabsList>

					<TabsContent value="model" className="space-y-6">
						<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
							<div className="lg:col-span-2">
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center justify-between">
											<span>Interaktywny model mózgu</span>
											<div className="flex gap-2">
												<Button variant="outline" size="sm">
													<ZoomIn className="h-4 w-4" />
												</Button>
												<Button variant="outline" size="sm">
													<ZoomOut className="h-4 w-4" />
												</Button>
											</div>
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="h-[600px]">
											<Interactive3DBrainModel
												onRegionClick={handleRegionSelect}
											/>
										</div>
									</CardContent>
								</Card>
							</div>

							<div className="space-y-6">
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center gap-2">
											<Target className="h-5 w-5" />
											Wybierz region
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="space-y-3">
											{mockBrainRegions.map((region) => (
												<div
													key={region.id}
													className={`cursor-pointer rounded-lg border p-3 transition-colors ${
														selectedRegion === region.id
															? "border-blue-500 bg-blue-50"
															: "hover:bg-gray-50"
													}`}
													onClick={() => handleRegionSelect(region.id)}
												>
													<h3 className="font-medium">{region.polishName}</h3>
													<p className="truncate text-gray-600 text-sm">
														{region.polishDescription}
													</p>
												</div>
											))}
										</div>
									</CardContent>
								</Card>

								<Card>
									<CardHeader>
										<CardTitle className="flex items-center gap-2">
											<Zap className="h-5 w-5" />
											Neuroprzekaźniki
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="space-y-3">
											{mockNeurotransmitters.map((nt) => (
												<div
													key={nt.id}
													className={`cursor-pointer rounded-lg border p-3 transition-colors ${
														selectedNeurotransmitter === nt.id
															? "border-purple-500 bg-purple-50"
															: "hover:bg-gray-50"
													}`}
													onClick={() => handleNeurotransmitterSelect(nt.id)}
												>
													<h3 className="font-medium">{nt.polishName}</h3>
													<p className="truncate text-gray-600 text-sm">
														{nt.polishDescription}
													</p>
												</div>
											))}
										</div>
									</CardContent>
								</Card>
							</div>
						</div>
					</TabsContent>

					<TabsContent value="region-info" className="space-y-6">
						{selectedRegion ? (
							<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
								<div className="lg:col-span-2">
									<Card>
										<CardHeader>
											<CardTitle className="flex items-center gap-2">
												<Target className="h-5 w-5" />
												{
													mockBrainRegions.find((r) => r.id === selectedRegion)
														?.polishName
												}
											</CardTitle>
										</CardHeader>
										<CardContent>
											<div className="space-y-4">
												<div>
													<h4 className="mb-2 font-medium">Opis</h4>
													<p className="text-gray-700">
														{
															mockBrainRegions.find(
																(r) => r.id === selectedRegion,
															)?.polishDescription
														}
													</p>
												</div>

												<div>
													<h4 className="mb-2 font-medium">Funkcje</h4>
													<p className="text-gray-700">
														{
															mockBrainRegions.find(
																(r) => r.id === selectedRegion,
															)?.polishFunction
														}
													</p>
												</div>

												<div>
													<h4 className="mb-2 font-medium">
														Związane neuroprzekaźniki
													</h4>
													<div className="flex flex-wrap gap-2">
														{mockBrainRegions
															.find((r) => r.id === selectedRegion)
															?.polishRelatedNeurotransmitters.map(
																(nt, index) => (
																	<Badge key={index} variant="secondary">
																		{nt}
																	</Badge>
																),
															)}
													</div>
												</div>

												<div>
													<h4 className="mb-2 font-medium">Związane funkcje</h4>
													<div className="flex flex-wrap gap-2">
														{mockBrainRegions
															.find((r) => r.id === selectedRegion)
															?.polishAssociatedFunctions.map((func, index) => (
																<Badge key={index} variant="outline">
																	{func}
																</Badge>
															))}
													</div>
												</div>
											</div>
										</CardContent>
									</Card>
								</div>

								<div className="space-y-6">
									<Card>
										<CardHeader>
											<CardTitle>Sprzężenia z suplementami</CardTitle>
										</CardHeader>
										<CardContent>
											<div className="space-y-3">
												<h4 className="font-medium">Zalecane suplementy</h4>
												<ul className="space-y-1 text-gray-700 text-sm">
													<li>• Noopept - poprawa pamięci i uczenia się</li>
													<li>
														• Bacopa monnieri - wspomaganie funkcji poznawczych
													</li>
													<li>• Lion's Mane - neuroprotekcja i regeneracja</li>
												</ul>
											</div>
										</CardContent>
									</Card>

									<Card>
										<CardHeader>
											<CardTitle>Działania suplementów</CardTitle>
										</CardHeader>
										<CardContent>
											<div className="space-y-3">
												<div className="rounded-lg bg-blue-50 p-3">
													<h4 className="font-medium text-blue-800">
														Cholinergiczne
													</h4>
													<p className="text-blue-700 text-sm">
														Wzmacniają system cholinergiczny, poprawiając pamięć
														i uczenie się
													</p>
												</div>
												<div className="rounded-lg bg-green-50 p-3">
													<h4 className="font-medium text-green-800">
														Neuroprotekcja
													</h4>
													<p className="text-green-700 text-sm">
														Chronią neurony przed uszkodzeniami i wspierają
														neurogenezę
													</p>
												</div>
											</div>
										</CardContent>
									</Card>
								</div>
							</div>
						) : (
							<Card>
								<CardContent className="flex h-64 items-center justify-center">
									<div className="text-center">
										<Brain className="mx-auto mb-4 h-12 w-12 text-gray-400" />
										<h3 className="mb-2 font-medium text-gray-900 text-lg">
											Wybierz region mózgu
										</h3>
										<p className="text-gray-600">
											Kliknij na region w modelu 3D lub wybierz z listy
										</p>
									</div>
								</CardContent>
							</Card>
						)}
					</TabsContent>

					<TabsContent value="neurotransmitter-info" className="space-y-6">
						{selectedNeurotransmitter ? (
							<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
								<div className="lg:col-span-2">
									<Card>
										<CardHeader>
											<CardTitle className="flex items-center gap-2">
												<Zap className="h-5 w-5" />
												{
													mockNeurotransmitters.find(
														(nt) => nt.id === selectedNeurotransmitter,
													)?.polishName
												}
											</CardTitle>
										</CardHeader>
										<CardContent>
											<div className="space-y-4">
												<div>
													<h4 className="mb-2 font-medium">Opis</h4>
													<p className="text-gray-700">
														{
															mockNeurotransmitters.find(
																(nt) => nt.id === selectedNeurotransmitter,
															)?.polishDescription
														}
													</p>
												</div>

												<div>
													<h4 className="mb-2 font-medium">Funkcje</h4>
													<p className="text-gray-700">
														{
															mockNeurotransmitters.find(
																(nt) => nt.id === selectedNeurotransmitter,
															)?.polishFunction
														}
													</p>
												</div>

												<div>
													<h4 className="mb-2 font-medium">Ścieżki</h4>
													<div className="flex flex-wrap gap-2">
														{mockNeurotransmitters
															.find((nt) => nt.id === selectedNeurotransmitter)
															?.polishPathways.map((path, index) => (
																<Badge key={index} variant="secondary">
																	{path}
																</Badge>
															))}
													</div>
												</div>

												<div>
													<h4 className="mb-2 font-medium">
														Związane suplementy
													</h4>
													<div className="flex flex-wrap gap-2">
														{mockNeurotransmitters
															.find((nt) => nt.id === selectedNeurotransmitter)
															?.relatedSupplements.map((supp, index) => (
																<Badge key={index} variant="outline">
																	{supp}
																</Badge>
															))}
													</div>
												</div>
											</div>
										</CardContent>
									</Card>
								</div>

								<div className="space-y-6">
									<Card>
										<CardHeader>
											<CardTitle>Moduł edukacyjny</CardTitle>
										</CardHeader>
										<CardContent>
											<NeurotransmitterEducationModule
												selectedNeurotransmitter={selectedNeurotransmitter}
											/>
										</CardContent>
									</Card>

									<Card>
										<CardHeader>
											<CardTitle className="flex items-center gap-2">
												<BarChart3 className="h-5 w-5" />
												Wpływ suplementów
											</CardTitle>
										</CardHeader>
										<CardContent>
											<div className="space-y-4">
												<div>
													<h4 className="mb-2 font-medium text-sm">
														Wzmacnianie
													</h4>
													<div className="space-y-2">
														<div className="flex items-center justify-between">
															<span>Alpha-GPC</span>
															<div className="flex items-center">
																<div className="mr-2 h-2 w-24 rounded-full bg-gray-200">
																	<div
																		className="h-2 rounded-full bg-green-600"
																		style={{ width: "85%" }}
																	/>
																</div>
																<span className="text-xs">+85%</span>
															</div>
														</div>
													</div>
												</div>

												<div>
													<h4 className="mb-2 font-medium text-sm">
														Regulacja
													</h4>
													<div className="space-y-2">
														<div className="flex items-center justify-between">
															<span>L-Theanine</span>
															<div className="flex items-center">
																<div className="mr-2 h-2 w-24 rounded-full bg-gray-200">
																	<div
																		className="h-2 rounded-full bg-blue-600"
																		style={{ width: "60%" }}
																	/>
																</div>
																<span className="text-xs">+60%</span>
															</div>
														</div>
													</div>
												</div>
											</div>
										</CardContent>
									</Card>
								</div>
							</div>
						) : (
							<Card>
								<CardContent className="flex h-64 items-center justify-center">
									<div className="text-center">
										<Zap className="mx-auto mb-4 h-12 w-12 text-gray-400" />
										<h3 className="mb-2 font-medium text-gray-900 text-lg">
											Wybierz neuroprzekaźnik
										</h3>
										<p className="text-gray-600">
											Kliknij na neuroprzekaźnik z listy
										</p>
									</div>
								</CardContent>
							</Card>
						)}
					</TabsContent>

					<TabsContent value="education" className="space-y-6">
						<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<BookOpen className="h-5 w-5" />
										Moduł edukacyjny:{" "}
										{selectedNeurotransmitter
											? mockNeurotransmitters.find(
													(nt) => nt.id === selectedNeurotransmitter,
												)?.polishName || "Neuroprzekaźniki"
											: "Neuroprzekaźniki"}
									</CardTitle>
								</CardHeader>
								<CardContent>
									<NeurotransmitterEducationModule
										selectedNeurotransmitter={
											selectedNeurotransmitter || "dopamine"
										}
									/>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<Lightbulb className="h-5 w-5" />
										Ciekawostki o mózgu
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										<div className="rounded-lg bg-blue-50 p-4">
											<h4 className="mb-2 font-medium text-blue-800">
												Czy wiesz, że?
											</h4>
											<p className="text-blue-700 text-sm">
												Hipokamp tworzy nowe komórki nerwowe przez cały nasz
												wiek, co może być wspomagane przez niektóre nootropiki.
											</p>
										</div>

										<div className="rounded-lg bg-green-50 p-4">
											<h4 className="mb-2 font-medium text-green-800">
												Funkcja egzekutywna
											</h4>
											<p className="text-green-700 text-sm">
												Kora czołowa, odpowiedzialna za funkcje egzekutywne,
												dojrzewa do 25 roku życia, dlatego青少年 mają tendencję
												do podejmowania bardziej ryzykownych decyzji.
											</p>
										</div>

										<div className="rounded-lg bg-purple-50 p-4">
											<h4 className="mb-2 font-medium text-purple-800">
												Neuroprzekaźniki
											</h4>
											<p className="text-purple-700 text-sm">
												W mózgu znajduje się około 100 miliardów neuronów, które
												komunikują się za pomocą różnych neuroprzekaźników.
											</p>
										</div>
									</div>
								</CardContent>
							</Card>
						</div>
					</TabsContent>

					<TabsContent value="connections" className="space-y-6">
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Activity className="h-5 w-5" />
									Połączenia neuronowe
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
									<div>
										<h3 className="mb-4 font-medium">Ścieżki cholinergiczne</h3>
										<div className="space-y-3">
											<div className="rounded-lg border p-3">
												<h4 className="font-medium">
													Ścieżka z jądra pnia mózgu
												</h4>
												<p className="text-gray-600 text-sm">
													Łączy się z kora mózgową i wspiera czujność
												</p>
											</div>
											<div className="rounded-lg border p-3">
												<h4 className="font-medium">Ścieżka z przegrody</h4>
												<p className="text-gray-600 text-sm">
													Łączy się z hipokampem i wspiera pamięć
												</p>
											</div>
										</div>
									</div>
									<div>
										<h3 className="mb-4 font-medium">
											Ścieżki dopaminergiczne
										</h3>
										<div className="space-y-3">
											<div className="rounded-lg border p-3">
												<h4 className="font-medium">Ścieżka mezolimbigiczna</h4>
												<p className="text-gray-600 text-sm">
													Związana z motywacją i układem nagrody
												</p>
											</div>
											<div className="rounded-lg border p-3">
												<h4 className="font-medium">Ścieżka nigtostriatalna</h4>
												<p className="text-gray-600 text-sm">
													Związana z kontrolą ruchową
												</p>
											</div>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</main>

			{/* Footer */}
			<footer className="mt-12 border-t bg-white">
				<div className="container mx-auto px-4 py-6">
					<div className="flex flex-col items-center justify-between gap-4 md:flex-row">
						<div className="flex items-center gap-2">
							<Brain className="h-5 w-5 text-blue-600" />
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

export default BrainVisualizationPage;
