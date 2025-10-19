"use client";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Activity,
	AlertTriangle,
	Atom,
	Brain,
	Info,
	Microscope,
	Pause,
	Play,
	RotateCcw,
	Shield,
	Timer,
	Zap,
	ZoomIn,
	ZoomOut,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

// Neuron structure data
const NEURON_COMPONENTS = [
	{
		id: "soma",
		name: "Soma",
		polishName: "Perikarion",
		description: "Ciało neuronu zawierające jądro i organelle",
		function: "Synteza białek i koordynacja funkcji komórkowych",
		color: "#3B82F6",
	},
	{
		id: "dendrites",
		name: "Dendrites",
		polishName: "Dendryty",
		description: "Rozgałęzione wypustki odbierające sygnały",
		function: "Odbiór i integracja sygnałów z innych neuronów",
		color: "#10B981",
	},
	{
		id: "axon",
		name: "Axon",
		polishName: "Akson",
		description: "Długa wypustka przewodząca impulsy",
		function: "Przewodzenie sygnałów do innych neuronów",
		color: "#F59E0B",
	},
	{
		id: "synapse",
		name: "Synapse",
		polishName: "Synapsa",
		description: "Połączenie między neuronami",
		function: "Transmisja sygnałów między neuronami",
		color: "#EF4444",
	},
	{
		id: "myelin",
		name: "Myelin Sheath",
		polishName: "Osłonka Mielinowa",
		description: "Izolacyjna warstwa wokół aksonu",
		function: "Przyspieszenie przewodzenia impulsów",
		color: "#8B5CF6",
	},
];

// Synaptic transmission stages
const TRANSMISSION_STAGES = [
	{
		id: "resting",
		name: "Spoczynek",
		polishName: "Potencjał spoczynkowy",
		description: "Neuron w stanie spoczynku z gradientem jonowym",
		duration: 2000,
		visualElements: ["membrane", "ion_channels", "ion_gradient"],
	},
	{
		id: "depolarization",
		name: "Depolaryzacja",
		polishName: "Depolaryzacja",
		description: "Otwarcie kanałów sodowych i napływ Na+",
		duration: 1500,
		visualElements: ["na_channels", "action_potential"],
	},
	{
		id: "repolarization",
		name: "Repolaryzacja",
		polishName: "Repolaryzacja",
		description: "Otwarcie kanałów potasowych i odpływ K+",
		duration: 2000,
		visualElements: ["k_channels", "refractory_period"],
	},
	{
		id: "synaptic",
		name: "Transmisja synaptyczna",
		polishName: "Transmisja synaptyczna",
		description: "Uwalnianie neuroprzekaźników do szczeliny synaptycznej",
		duration: 2500,
		visualElements: ["vesicles", "neurotransmitters", "receptors"],
	},
];

export function CellularNeuroscienceModule() {
	const [activeComponent, setActiveComponent] = useState<string | null>(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [currentStage, setCurrentStage] = useState(0);
	const [showAnimation, setShowAnimation] = useState(false);
	const animationRef = useRef<number>();

	const selectedComponent = NEURON_COMPONENTS.find(
		(c) => c.id === activeComponent,
	);

	// Animation control
	useEffect(() => {
		if (isPlaying) {
			const stage = TRANSMISSION_STAGES[currentStage];
			animationRef.current = window.setTimeout(() => {
				if (currentStage < TRANSMISSION_STAGES.length - 1) {
					setCurrentStage(currentStage + 1);
				} else {
					setIsPlaying(false);
					setCurrentStage(0);
				}
			}, stage.duration);
		}

		return () => {
			if (animationRef.current) {
				clearTimeout(animationRef.current);
			}
		};
	}, [isPlaying, currentStage]);

	const handlePlayAnimation = () => {
		setIsPlaying(!isPlaying);
		setShowAnimation(true);
	};

	const handleResetAnimation = () => {
		setIsPlaying(false);
		setCurrentStage(0);
		setShowAnimation(false);
	};

	return (
		<div className="space-y-6">
			{/* Neuron Structure Section */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Brain className="h-5 w-5" />
						Struktura Neuronu
					</CardTitle>
					<CardDescription>
						Interaktywna wizualizacja budowy i funkcji neuronu
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
						{/* 3D Neuron Visualization Placeholder */}
						<div className="relative">
							<Card className="border-2 border-dashed">
								<CardContent className="flex flex-col items-center justify-center py-16">
									<Brain className="mb-4 h-20 w-20 text-blue-400" />
									<h3 className="mb-2 font-medium">Model 3D Neuronu</h3>
									<p className="mb-4 text-center text-gray-600 text-sm">
										Interaktywna wizualizacja struktury neuronu z możliwością
										rotacji i zoom
									</p>
									<div className="flex gap-2">
										<Button variant="outline" size="sm">
											<ZoomIn className="h-4 w-4" />
										</Button>
										<Button variant="outline" size="sm">
											<ZoomOut className="h-4 w-4" />
										</Button>
										<Button variant="outline" size="sm">
											<RotateCcw className="h-4 w-4" />
										</Button>
									</div>
								</CardContent>
							</Card>

							{/* Component Labels Overlay */}
							<div className="pointer-events-none absolute inset-0">
								{/* This would be positioned over the 3D model */}
							</div>
						</div>

						{/* Component Selection */}
						<div className="space-y-4">
							<h3 className="font-medium">Wybierz komponent</h3>
							<div className="grid grid-cols-1 gap-2">
								{NEURON_COMPONENTS.map((component) => (
									<Button
										key={component.id}
										variant={
											activeComponent === component.id ? "default" : "outline"
										}
										className="h-auto justify-start p-3"
										onClick={() => setActiveComponent(component.id)}
									>
										<div className="flex items-center gap-3">
											<div
												className="h-4 w-4 rounded-full"
												style={{ backgroundColor: component.color }}
											/>
											<div className="text-left">
												<div className="font-medium text-sm">
													{component.polishName}
												</div>
												<div className="text-muted-foreground text-xs">
													{component.name}
												</div>
											</div>
										</div>
									</Button>
								))}
							</div>

							{/* Component Details */}
							{selectedComponent && (
								<Card>
									<CardHeader className="pb-3">
										<CardTitle className="flex items-center gap-2 text-base">
											<div
												className="h-3 w-3 rounded-full"
												style={{ backgroundColor: selectedComponent.color }}
											/>
											{selectedComponent.polishName}
										</CardTitle>
									</CardHeader>
									<CardContent className="pt-0">
										<div className="space-y-3">
											<p className="text-sm">{selectedComponent.description}</p>
											<div>
												<h4 className="mb-1 font-medium text-sm">Funkcja</h4>
												<p className="text-gray-600 text-sm">
													{selectedComponent.function}
												</p>
											</div>
										</div>
									</CardContent>
								</Card>
							)}
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Synaptic Transmission Animation */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Zap className="h-5 w-5" />
						Transmisja Synaptyczna
					</CardTitle>
					<CardDescription>
						Animacja procesu neurotransmisji z czasem rzeczywistym
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
						{/* Animation Controls */}
						<div className="space-y-4">
							<h3 className="font-medium">Kontrola animacji</h3>
							<div className="flex gap-2">
								<Button
									onClick={handlePlayAnimation}
									disabled={isPlaying}
									className="flex-1"
								>
									{isPlaying ? (
										<Pause className="mr-2 h-4 w-4" />
									) : (
										<Play className="mr-2 h-4 w-4" />
									)}
									{isPlaying ? "Pauza" : "Odtwórz"}
								</Button>
								<Button variant="outline" onClick={handleResetAnimation}>
									<RotateCcw className="h-4 w-4" />
								</Button>
							</div>

							{/* Progress */}
							<div className="space-y-2">
								<div className="flex items-center justify-between text-sm">
									<span>Postęp</span>
									<span>
										{currentStage + 1}/{TRANSMISSION_STAGES.length}
									</span>
								</div>
								<Progress
									value={
										((currentStage + 1) / TRANSMISSION_STAGES.length) * 100
									}
								/>
							</div>

							{/* Current Stage Info */}
							<Card>
								<CardContent className="pt-4">
									<h4 className="mb-2 font-medium">
										{TRANSMISSION_STAGES[currentStage]?.polishName}
									</h4>
									<p className="text-gray-600 text-sm">
										{TRANSMISSION_STAGES[currentStage]?.description}
									</p>
								</CardContent>
							</Card>
						</div>

						{/* Animation Visualization */}
						<div className="lg:col-span-2">
							<Card className="border-2 border-dashed">
								<CardContent className="flex flex-col items-center justify-center py-16">
									<div className="relative flex h-48 w-full items-center justify-center rounded-lg bg-gray-50">
										{/* Simplified animation representation */}
										<div className="flex items-center gap-4">
											{/* Presynaptic neuron */}
											<div className="flex flex-col items-center">
												<div className="relative h-24 w-16 rounded-lg bg-blue-200">
													<div className="-right-2 absolute top-1/2 h-1 w-6 bg-gray-400" />
												</div>
												<span className="mt-2 text-xs">
													Neuron presynaptyczny
												</span>
											</div>

											{/* Synaptic cleft */}
											<div className="flex h-16 w-8 items-center justify-center rounded bg-gray-100">
												<div className="h-8 w-1 bg-gray-300" />
											</div>

											{/* Postsynaptic neuron */}
											<div className="flex flex-col items-center">
												<div className="relative h-24 w-16 rounded-lg bg-green-200">
													<div className="-left-2 absolute top-1/2 h-1 w-6 bg-gray-400" />
												</div>
												<span className="mt-2 text-xs">
													Neuron postsynaptyczny
												</span>
											</div>
										</div>

										{/* Animation indicators */}
										{showAnimation && (
											<div className="absolute inset-0 flex items-center justify-center">
												<div className="animate-pulse">
													<Activity className="h-8 w-8 text-blue-600" />
												</div>
											</div>
										)}
									</div>
									<p className="mt-4 text-center text-gray-600 text-sm">
										Uproszczona reprezentacja - pełna animacja 3D w
										implementacji
									</p>
								</CardContent>
							</Card>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Ion Channels and Membrane Potential */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Atom className="h-5 w-5" />
						Kanały Jonowe i Potencjał Błonowy
					</CardTitle>
					<CardDescription>
						Mechanizmy odpowiedzialne za generowanie potencjału czynnościowego
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Tabs defaultValue="channels" className="space-y-4">
						<TabsList className="grid w-full grid-cols-3">
							<TabsTrigger value="channels">Kanały jonowe</TabsTrigger>
							<TabsTrigger value="potential">Potencjał błonowy</TabsTrigger>
							<TabsTrigger value="pathology">Patologia</TabsTrigger>
						</TabsList>

						<TabsContent value="channels" className="space-y-4">
							<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
								<Card>
									<CardHeader className="pb-3">
										<CardTitle className="text-base">
											Kanały sodowe (Na+)
										</CardTitle>
									</CardHeader>
									<CardContent>
										<p className="mb-3 text-sm">
											Odpowiedzialne za szybką depolaryzację podczas potencjału
											czynnościowego
										</p>
										<div className="space-y-2">
											<div className="flex justify-between text-sm">
												<span>Aktywacja</span>
												<Badge variant="outline">-30 mV</Badge>
											</div>
											<div className="flex justify-between text-sm">
												<span>Inaktywacja</span>
												<Badge variant="outline">+30 mV</Badge>
											</div>
										</div>
									</CardContent>
								</Card>

								<Card>
									<CardHeader className="pb-3">
										<CardTitle className="text-base">
											Kanały potasowe (K+)
										</CardTitle>
									</CardHeader>
									<CardContent>
										<p className="mb-3 text-sm">
											Umożliwiają repolaryzację i utrzymanie potencjału
											spoczynkowego
										</p>
										<div className="space-y-2">
											<div className="flex justify-between text-sm">
												<span>Przewodność</span>
												<Badge variant="outline">Wysoka</Badge>
											</div>
											<div className="flex justify-between text-sm">
												<span>Czułość</span>
												<Badge variant="outline">Napięciowa</Badge>
											</div>
										</div>
									</CardContent>
								</Card>
							</div>
						</TabsContent>

						<TabsContent value="potential" className="space-y-4">
							<Card>
								<CardContent className="pt-6">
									<div className="space-y-4">
										<div className="flex items-center justify-between">
											<span className="font-medium">Potencjał spoczynkowy</span>
											<Badge className="bg-green-100 text-green-800">
												-70 mV
											</Badge>
										</div>
										<div className="flex items-center justify-between">
											<span className="font-medium">Próg pobudzenia</span>
											<Badge className="bg-yellow-100 text-yellow-800">
												-55 mV
											</Badge>
										</div>
										<div className="flex items-center justify-between">
											<span className="font-medium">Szczyt potencjału</span>
											<Badge className="bg-blue-100 text-blue-800">
												+40 mV
											</Badge>
										</div>
									</div>
								</CardContent>
							</Card>
						</TabsContent>

						<TabsContent value="pathology" className="space-y-4">
							<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
								<Card className="border-l-4 border-l-red-600">
									<CardContent className="pt-4">
										<h4 className="mb-2 flex items-center gap-2 font-medium">
											<AlertTriangle className="h-4 w-4 text-red-600" />
											Kanalopatie
										</h4>
										<p className="text-gray-600 text-sm">
											Zaburzenia funkcji kanałów jonowych prowadzące do chorób
											neurologicznych
										</p>
									</CardContent>
								</Card>

								<Card className="border-l-4 border-l-orange-600">
									<CardContent className="pt-4">
										<h4 className="mb-2 flex items-center gap-2 font-medium">
											<Shield className="h-4 w-4 text-orange-600" />
											Neuroprotekcja
										</h4>
										<p className="text-gray-600 text-sm">
											Strategie ochrony neuronów przed uszkodzeniami kanałów
											jonowych
										</p>
									</CardContent>
								</Card>
							</div>
						</TabsContent>
					</Tabs>
				</CardContent>
			</Card>

			{/* Glial Cells Section */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Microscope className="h-5 w-5" />
						Komórki Glejowe
					</CardTitle>
					<CardDescription>
						Funkcje i interakcje komórek glejowych z neuronami
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
						<Card>
							<CardHeader className="pb-3">
								<CardTitle className="text-base">Astrocyt</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="mb-3 text-sm">
									Komórki podporowe regulujące środowisko neuronalne
								</p>
								<div className="space-y-1">
									<Badge variant="outline" className="text-xs">
										Homeostaza jonowa
									</Badge>
									<Badge variant="outline" className="text-xs">
										Bariera krew-mózg
									</Badge>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader className="pb-3">
								<CardTitle className="text-base">Oligodendrocyt</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="mb-3 text-sm">
									Komórki tworzące osłonkę mielinową w OUN
								</p>
								<div className="space-y-1">
									<Badge variant="outline" className="text-xs">
										Izolacja aksonów
									</Badge>
									<Badge variant="outline" className="text-xs">
										Przyspieszenie przewodzenia
									</Badge>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader className="pb-3">
								<CardTitle className="text-base">Mikroglej</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="mb-3 text-sm">Komórki odpornościowe mózgu</p>
								<div className="space-y-1">
									<Badge variant="outline" className="text-xs">
										Odpowiedź immunologiczna
									</Badge>
									<Badge variant="outline" className="text-xs">
										Fagocytoza
									</Badge>
								</div>
							</CardContent>
						</Card>
					</div>
				</CardContent>
			</Card>

			{/* Neurodegeneration Section */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<AlertTriangle className="h-5 w-5" />
						Procesy Neurodegeneracyjne
					</CardTitle>
					<CardDescription>
						Mechanizmy prowadzące do uszkodzenia i śmierci neuronów
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Accordion type="multiple" className="w-full">
						<AccordionItem value="mechanisms">
							<AccordionTrigger className="text-left">
								<div className="flex items-center gap-2">
									<Info className="h-4 w-4 text-red-600" />
									<span>Główne mechanizmy neurodegeneracji</span>
								</div>
							</AccordionTrigger>
							<AccordionContent>
								<div className="space-y-4 pt-4">
									<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
										<div className="rounded-lg bg-red-50 p-4">
											<h4 className="mb-2 font-medium text-red-800">
												Stres oksydacyjny
											</h4>
											<p className="text-red-700 text-sm">
												Nadmierna produkcja wolnych rodników prowadzi do
												uszkodzenia białek i lipidów
											</p>
										</div>
										<div className="rounded-lg bg-orange-50 p-4">
											<h4 className="mb-2 font-medium text-orange-800">
												Agregacja białek
											</h4>
											<p className="text-orange-700 text-sm">
												Nieprawidłowe fałdowanie białek tworzy toksyczne
												agregaty
											</p>
										</div>
										<div className="rounded-lg bg-purple-50 p-4">
											<h4 className="mb-2 font-medium text-purple-800">
												Ekscytotoksyczność
											</h4>
											<p className="text-purple-700 text-sm">
												Nadmierna aktywacja receptorów glutaminianowych
											</p>
										</div>
										<div className="rounded-lg bg-blue-50 p-4">
											<h4 className="mb-2 font-medium text-blue-800">
												Zapalenie
											</h4>
											<p className="text-blue-700 text-sm">
												Aktywacja odpowiedzi immunologicznej w mózgu
											</p>
										</div>
									</div>
								</div>
							</AccordionContent>
						</AccordionItem>

						<AccordionItem value="protection">
							<AccordionTrigger className="text-left">
								<div className="flex items-center gap-2">
									<Shield className="h-4 w-4 text-green-600" />
									<span>Mechanizmy ochronne</span>
								</div>
							</AccordionTrigger>
							<AccordionContent>
								<div className="space-y-4 pt-4">
									<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
										<div className="rounded-lg bg-green-50 p-4">
											<h4 className="mb-2 font-medium text-green-800">
												Autofagia
											</h4>
											<p className="text-green-700 text-sm">
												Proces usuwania uszkodzonych organelli i białek
											</p>
										</div>
										<div className="rounded-lg bg-teal-50 p-4">
											<h4 className="mb-2 font-medium text-teal-800">
												Antyoksydanty
											</h4>
											<p className="text-sm text-teal-700">
												Systemy obrony przed stresem oksydacyjnym
											</p>
										</div>
										<div className="rounded-lg bg-cyan-50 p-4">
											<h4 className="mb-2 font-medium text-cyan-800">
												Czynniki neurotroficzne
											</h4>
											<p className="text-cyan-700 text-sm">
												Białka wspierające przeżycie neuronów
											</p>
										</div>
										<div className="rounded-lg bg-emerald-50 p-4">
											<h4 className="mb-2 font-medium text-emerald-800">
												Prekondycjonowanie
											</h4>
											<p className="text-emerald-700 text-sm">
												Adaptacja do łagodnego stresu zwiększająca odporność
											</p>
										</div>
									</div>
								</div>
							</AccordionContent>
						</AccordionItem>
					</Accordion>
				</CardContent>
			</Card>
		</div>
	);
}
