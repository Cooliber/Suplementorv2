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
import { BacteriaIcon } from "@/components/ui/custom-icons";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Activity,
	AlertCircle,
	ArrowRight,
	Brain,
	CheckCircle,
	ChevronRight,
	Clock,
	Info,
	Microscope,
	Pause,
	Play,
	RotateCcw,
	Shield,
	Star,
	Target,
	Users,
	Virus,
	Zap,
	ZoomIn,
	ZoomOut,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

// Microglia activation states
const MICROGLIA_STATES = [
	{
		id: "resting",
		name: "Resting",
		polishName: "Spoczynkowe",
		description: "Mikroglej w stanie fizjologicznym, monitorujący środowisko",
		morphology: "Małe ciało komórkowe z rozgałęzionymi wypustkami",
		functions: [
			"Monitorowanie środowiska",
			"Fagocytoza resztek",
			"Wsparcie synaps",
		],
		color: "#10B981",
	},
	{
		id: "activated",
		name: "Activated",
		polishName: "Aktywowane",
		description: "Mikroglej reagujący na uszkodzenie lub infekcję",
		morphology: "Powiększone ciało komórkowe, retrakcja wypustek",
		functions: [
			"Produkcja cytokin",
			"Fagocytoza patogenów",
			"Prezentacja antygenów",
		],
		color: "#F59E0B",
	},
	{
		id: "phagocytic",
		name: "Phagocytic",
		polishName: "Fagocytujące",
		description: "Mikroglej aktywnie usuwający uszkodzone komórki",
		morphology: "Ameboidalne, z licznymi pseudopodium",
		functions: ["Fagocytoza", "Degradacja patogenów", "Clearance resztek"],
		color: "#EF4444",
	},
	{
		id: "neuroprotective",
		name: "Neuroprotective",
		polishName: "Neuroprotekcyjne",
		description: "Mikroglej wspierający regenerację i naprawę",
		morphology: "Wydłużone wypustki, ekspresja markerów naprawczych",
		functions: [
			"Produkcja czynników wzrostu",
			"Wsparcie angiogenezy",
			"Regeneracja",
		],
		color: "#3B82F6",
	},
];

// Cytokine effects
const CYTOKINE_EFFECTS = [
	{
		cytokine: "TNF-α",
		polishCytokine: "TNF-α",
		effects: [
			"Aktywacja mikrogleju",
			"Indukcja zapalenia",
			"Neurotoksyczność (w nadmiarze)",
			"Regulacja snu",
		],
		polishEffects: [
			"Aktywacja mikrogleju",
			"Indukcja zapalenia",
			"Neurotoksyczność (w nadmiarze)",
			"Regulacja snu",
		],
	},
	{
		cytokine: "IL-1β",
		polishCytokine: "IL-1β",
		effects: [
			"Gorączka i odpowiedź ostra",
			"Aktywacja osi HPA",
			"Zmęczenie i anhedonia",
			"Neuroinflamacja",
		],
		polishEffects: [
			"Gorączka i odpowiedź ostra",
			"Aktywacja osi HPA",
			"Zmęczenie i anhedonia",
			"Neuroinflamacja",
		],
	},
	{
		cytokine: "IL-6",
		polishCytokine: "IL-6",
		effects: [
			"Ostrą fazę odpowiedzi",
			"Regulację apetytu",
			"Depresję i lęk",
			"Neurogenezę",
		],
		polishEffects: [
			"Ostrą fazę odpowiedzi",
			"Regulację apetytu",
			"Depresję i lęk",
			"Neurogenezę",
		],
	},
	{
		cytokine: "IL-10",
		polishCytokine: "IL-10",
		effects: [
			"Hamowanie zapalenia",
			"Neuroprotekcja",
			"Regeneracja tkanek",
			"Redukcja uszkodzeń",
		],
		polishEffects: [
			"Hamowanie zapalenia",
			"Neuroprotekcja",
			"Regeneracja tkanek",
			"Redukcja uszkodzeń",
		],
	},
];

// Neuroinflammatory processes
const INFLAMMATION_PROCESSES = [
	{
		process: "Initiation",
		polishProcess: "Inicjacja",
		description: "Rozpoznanie sygnałów niebezpieczeństwa",
		mechanisms: ["Receptory PRR", "Sygnały DAMP/PAMP", "Aktywacja NF-κB"],
		timeline: "Minuty do godzin",
	},
	{
		process: "Amplification",
		polishProcess: "Amplifikacja",
		description: "Wzmacnianie odpowiedzi zapalnej",
		mechanisms: [
			"Produkcja cytokin",
			"Aktywacja komórek",
			"Migracja leukocytów",
		],
		timeline: "Godziny",
	},
	{
		process: "Resolution",
		polishProcess: "Resolution",
		description: "Zakończenie zapalenia i naprawa",
		mechanisms: [
			"Apoptoza neutrofili",
			"Produkcja czynników przeciwzapalnych",
			"Regeneracja tkanek",
		],
		timeline: "Dni do tygodni",
	},
];

// Autoimmune disorders
const AUTOIMMUNE_DISORDERS = [
	{
		disorder: "Multiple Sclerosis",
		polishDisorder: "Stwardnienie rozsiane",
		description: "Autoimmunologiczne uszkodzenie mieliny w OUN",
		mechanisms: [
			"Atak na oligodendrocyty",
			"Demielinizacja aksonów",
			"Neuroinflamacja",
		],
		treatments: ["Interferony", "Glatiramer", "Monoclonal antibodies"],
	},
	{
		disorder: "Guillain-Barré Syndrome",
		polishDisorder: "Zespół Guillain-Barré",
		description: "Autoimmunologiczne zapalenie nerwów obwodowych",
		mechanisms: [
			"Atak na mielinę PNS",
			"Blokada przewodzenia",
			"Osłabienie mięśni",
		],
		treatments: ["IVIG", "Plazmafereza", "Supportive care"],
	},
	{
		disorder: "Myasthenia Gravis",
		polishDisorder: "Miastenia gravis",
		description: "Autoimmunologiczne uszkodzenie połączeń nerwowo-mięśniowych",
		mechanisms: [
			"Przeciwciała przeciw AChR",
			"Blokada transmisji",
			"Osłabienie mięśni",
		],
		treatments: ["Inhibitory AChE", "Immunosupresanty", "Tymektomia"],
	},
];

export function NeuroimmunologyModule() {
	const [selectedState, setSelectedState] = useState<string | null>("resting");
	const [isAnimationPlaying, setIsAnimationPlaying] = useState(false);
	const [animationStage, setAnimationStage] = useState(0);
	const [selectedCytokine, setSelectedCytokine] = useState<string | null>(null);
	const animationRef = useRef<number>();

	const selectedStateData = MICROGLIA_STATES.find(
		(s) => s.id === selectedState,
	);
	const selectedCytokineData = CYTOKINE_EFFECTS.find(
		(c) => c.cytokine === selectedCytokine,
	);

	// Animation stages for microglia activation
	const ANIMATION_STAGES = [
		{ id: "detection", name: "Detekcja sygnału", duration: 2000 },
		{ id: "activation", name: "Aktywacja", duration: 1500 },
		{ id: "migration", name: "Migracja", duration: 2000 },
		{ id: "phagocytosis", name: "Fagocytoza", duration: 2500 },
		{ id: "resolution", name: "Resolution", duration: 2000 },
	];

	useEffect(() => {
		if (isAnimationPlaying) {
			const stage = ANIMATION_STAGES[animationStage];
			animationRef.current = window.setTimeout(() => {
				if (animationStage < ANIMATION_STAGES.length - 1) {
					setAnimationStage(animationStage + 1);
				} else {
					setIsAnimationPlaying(false);
					setAnimationStage(0);
				}
			}, stage.duration);
		}

		return () => {
			if (animationRef.current) {
				clearTimeout(animationRef.current);
			}
		};
	}, [isAnimationPlaying, animationStage]);

	const handlePlayAnimation = () => {
		setIsAnimationPlaying(!isAnimationPlaying);
	};

	const handleResetAnimation = () => {
		setIsAnimationPlaying(false);
		setAnimationStage(0);
	};

	return (
		<div className="space-y-6">
			{/* Brain-Immune System Crosstalk */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Brain className="h-5 w-5" />
						Crosstalk Mózg-Układ Odpornościowy
					</CardTitle>
					<CardDescription>
						Mechanizmy komunikacji między układem nerwowym i odpornościowym
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
						{/* Communication Pathways */}
						<div className="space-y-4">
							<h3 className="font-medium">Ścieżki komunikacji</h3>
							<div className="space-y-3">
								<Card className="border-l-4 border-l-blue-600">
									<CardContent className="pt-4">
										<h4 className="mb-2 font-medium">Neuralne</h4>
										<p className="mb-2 text-gray-600 text-sm">
											Układ autonomiczny bezpośrednio wpływa na komórki
											odpornościowe
										</p>
										<div className="space-y-1 text-xs">
											<div>• Włókna adrenergiczne w tkankach</div>
											<div>• Cholinergiczne przeciwzapalne</div>
											<div>• Peptydy sensoryczne</div>
										</div>
									</CardContent>
								</Card>

								<Card className="border-l-4 border-l-green-600">
									<CardContent className="pt-4">
										<h4 className="mb-2 font-medium">Humoralne</h4>
										<p className="mb-2 text-gray-600 text-sm">
											Hormony i cytokiny jako przekaźniki między systemami
										</p>
										<div className="space-y-1 text-xs">
											<div>• Kortyzol i glukokortykoidy</div>
											<div>• Katecholaminy</div>
											<div>• Hormony tarczycy</div>
										</div>
									</CardContent>
								</Card>

								<Card className="border-l-4 border-l-purple-600">
									<CardContent className="pt-4">
										<h4 className="mb-2 font-medium">Komórkowe</h4>
										<p className="mb-2 text-gray-600 text-sm">
											Bezpośrednie interakcje między neuronami i komórkami
											odpornościowymi
										</p>
										<div className="space-y-1 text-xs">
											<div>• Mikroglej-neuron signaling</div>
											<div>• Astrocyte-immune interactions</div>
											<div>• BBB permeability</div>
										</div>
									</CardContent>
								</Card>
							</div>
						</div>

						{/* Interactive Diagram Placeholder */}
						<Card className="border-2 border-dashed">
							<CardContent className="flex flex-col items-center justify-center py-16">
								<div className="relative flex h-48 w-full items-center justify-center rounded-lg bg-gray-50">
									{/* Brain-Immune interaction visualization */}
									<div className="flex items-center gap-8">
										{/* Brain */}
										<div className="flex flex-col items-center">
											<div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-200">
												<Brain className="h-8 w-8 text-blue-600" />
											</div>
											<span className="mt-2 text-xs">Mózg</span>
										</div>

										{/* Communication arrows */}
										<div className="flex flex-col gap-2">
											<ArrowRight className="h-4 w-4 text-green-600" />
											<ArrowRight className="h-4 w-4 text-purple-600" />
											<ArrowRight className="h-4 w-4 text-orange-600" />
										</div>

										{/* Immune system */}
										<div className="flex flex-col items-center">
											<div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-200">
												<Shield className="h-8 w-8 text-red-600" />
											</div>
											<span className="mt-2 text-xs">Układ odpornościowy</span>
										</div>
									</div>
								</div>
								<p className="mt-4 text-center text-gray-600 text-sm">
									Uproszczona reprezentacja - pełna animacja 3D w implementacji
								</p>
							</CardContent>
						</Card>
					</div>
				</CardContent>
			</Card>

			{/* Microglia Activation States */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Microscope className="h-5 w-5" />
						Stany Aktywacji Mikrogleju
					</CardTitle>
					<CardDescription>
						Różne fenotypy funkcjonalne mikrogleju w zdrowiu i chorobie
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
						{/* Microglia States Selection */}
						<div className="space-y-4">
							<h3 className="font-medium">Stany mikrogleju</h3>
							<div className="grid grid-cols-1 gap-2">
								{MICROGLIA_STATES.map((state) => (
									<Button
										key={state.id}
										variant={selectedState === state.id ? "default" : "outline"}
										className="h-auto justify-start p-3"
										onClick={() => setSelectedState(state.id)}
									>
										<div className="flex items-center gap-3">
											<div
												className="h-4 w-4 rounded-full"
												style={{ backgroundColor: state.color }}
											/>
											<div className="text-left">
												<div className="font-medium text-sm">
													{state.polishName}
												</div>
												<div className="text-muted-foreground text-xs">
													{state.name}
												</div>
											</div>
										</div>
									</Button>
								))}
							</div>

							{/* State Details */}
							{selectedStateData && (
								<Card>
									<CardHeader className="pb-3">
										<CardTitle className="flex items-center gap-2 text-base">
											<div
												className="h-3 w-3 rounded-full"
												style={{ backgroundColor: selectedStateData.color }}
											/>
											{selectedStateData.polishName}
										</CardTitle>
									</CardHeader>
									<CardContent className="pt-0">
										<div className="space-y-3">
											<p className="text-sm">{selectedStateData.description}</p>

											<div>
												<h4 className="mb-1 font-medium text-sm">Morfologia</h4>
												<p className="text-gray-600 text-sm">
													{selectedStateData.morphology}
												</p>
											</div>

											<div>
												<h4 className="mb-1 font-medium text-sm">Funkcje</h4>
												<div className="flex flex-wrap gap-1">
													{selectedStateData.functions.map((func, index) => (
														<Badge
															key={index}
															variant="outline"
															className="text-xs"
														>
															{func}
														</Badge>
													))}
												</div>
											</div>
										</div>
									</CardContent>
								</Card>
							)}
						</div>

						{/* Microglia Animation */}
						<div className="space-y-4">
							<h3 className="font-medium">Animacja aktywacji mikrogleju</h3>

							{/* Animation Controls */}
							<div className="flex gap-2">
								<Button
									onClick={handlePlayAnimation}
									disabled={isAnimationPlaying}
									className="flex-1"
								>
									{isAnimationPlaying ? (
										<Pause className="mr-2 h-4 w-4" />
									) : (
										<Play className="mr-2 h-4 w-4" />
									)}
									{isAnimationPlaying ? "Pauza" : "Odtwórz animację"}
								</Button>
								<Button variant="outline" onClick={handleResetAnimation}>
									<RotateCcw className="h-4 w-4" />
								</Button>
							</div>

							{/* Animation Visualization */}
							<Card className="border-2 border-dashed">
								<CardContent className="flex flex-col items-center justify-center py-16">
									<div className="relative flex h-48 w-full items-center justify-center rounded-lg bg-gray-50">
										{/* Microglia activation sequence */}
										<div className="flex items-center gap-4">
											{/* Resting microglia */}
											<div
												className={`flex h-12 w-12 items-center justify-center rounded-full ${isAnimationPlaying && animationStage >= 1 ? "bg-orange-400" : "bg-green-200"}`}
											>
												<Microscope className="h-6 w-6 text-white" />
											</div>

											{/* Activation arrow */}
											{isAnimationPlaying && animationStage >= 2 && (
												<ArrowRight className="h-6 w-6 animate-pulse text-orange-600" />
											)}

											{/* Activated microglia */}
											{isAnimationPlaying && animationStage >= 3 && (
												<div className="flex h-12 w-12 animate-pulse items-center justify-center rounded-full bg-red-400">
													<Zap className="h-6 w-6 text-white" />
												</div>
											)}

											{/* Pathogen */}
											{isAnimationPlaying && animationStage >= 4 && (
												<>
													<ArrowRight className="h-6 w-6 text-red-600" />
													<div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-400">
														<BacteriaIcon className="h-4 w-4 text-white" />
													</div>
												</>
											)}
										</div>
									</div>
									<p className="mt-4 text-center text-gray-600 text-sm">
										Uproszczona reprezentacja - pełna animacja 3D w
										implementacji
									</p>
								</CardContent>
							</Card>

							{/* Current Animation Stage */}
							<Card>
								<CardContent className="pt-4">
									<h4 className="mb-2 font-medium">
										Etap: {ANIMATION_STAGES[animationStage]?.name}
									</h4>
									<Progress
										value={
											((animationStage + 1) / ANIMATION_STAGES.length) * 100
										}
									/>
								</CardContent>
							</Card>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Neuroinflammation Processes */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Activity className="h-5 w-5" />
						Procesy Neurozapalne
					</CardTitle>
					<CardDescription>
						Etapy rozwoju i resolution zapalenia w układzie nerwowym
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
						{INFLAMMATION_PROCESSES.map((process, index) => (
							<Card key={index} className="border-l-4 border-l-orange-600">
								<CardHeader className="pb-3">
									<CardTitle className="text-base">
										{process.polishProcess}
									</CardTitle>
									<CardDescription className="text-sm">
										{process.timeline}
									</CardDescription>
								</CardHeader>
								<CardContent className="pt-0">
									<p className="mb-3 text-sm">{process.description}</p>
									<div className="space-y-2">
										<h4 className="font-medium text-xs">Mechanizmy</h4>
										{process.mechanisms.map((mechanism, idx) => (
											<div key={idx} className="flex items-center gap-2">
												<div className="h-1 w-1 rounded-full bg-orange-600" />
												<span className="text-xs">{mechanism}</span>
											</div>
										))}
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</CardContent>
			</Card>

			{/* Cytokine Effects */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Target className="h-5 w-5" />
						Efekty Cytokin na Funkcje Neuronalne
					</CardTitle>
					<CardDescription>
						Wpływ cytokin na zachowanie i funkcje poznawcze
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						{CYTOKINE_EFFECTS.map((cytokine, index) => (
							<Card
								key={index}
								className={`cursor-pointer transition-all ${
									selectedCytokine === cytokine.cytokine
										? "ring-2 ring-purple-600"
										: ""
								}`}
								onClick={() => setSelectedCytokine(cytokine.cytokine)}
							>
								<CardHeader className="pb-3">
									<CardTitle className="text-base">
										{cytokine.polishCytokine}
									</CardTitle>
								</CardHeader>
								<CardContent className="pt-0">
									<div className="space-y-3">
										<div>
											<h4 className="mb-1 font-medium text-sm">
												Efekty neurologiczne
											</h4>
											<div className="space-y-1">
												{cytokine.polishEffects.map((effect, idx) => (
													<div key={idx} className="flex items-center gap-2">
														<div className="h-1 w-1 rounded-full bg-purple-600" />
														<span className="text-xs">{effect}</span>
													</div>
												))}
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</CardContent>
			</Card>

			{/* Autoimmune Neurological Disorders */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<AlertCircle className="h-5 w-5" />
						Zaburzenia Autoimmunologiczne Neurologiczne
					</CardTitle>
					<CardDescription>
						Choroby autoimmunologiczne atakujące układ nerwowy
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Tabs defaultValue="disorders" className="space-y-4">
						<TabsList className="grid w-full grid-cols-3">
							<TabsTrigger value="disorders">Zaburzenia</TabsTrigger>
							<TabsTrigger value="mechanisms">Mechanizmy</TabsTrigger>
							<TabsTrigger value="treatments">Leczenie</TabsTrigger>
						</TabsList>

						<TabsContent value="disorders" className="space-y-4">
							<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
								{AUTOIMMUNE_DISORDERS.map((disorder, index) => (
									<Card key={index} className="border-l-4 border-l-red-600">
										<CardHeader className="pb-3">
											<CardTitle className="text-base">
												{disorder.polishDisorder}
											</CardTitle>
										</CardHeader>
										<CardContent className="pt-0">
											<p className="mb-3 text-sm">{disorder.description}</p>
											<div className="space-y-2">
												<h4 className="font-medium text-xs">Mechanizmy</h4>
												{disorder.mechanisms.map((mechanism, idx) => (
													<div key={idx} className="flex items-center gap-2">
														<div className="h-1 w-1 rounded-full bg-red-600" />
														<span className="text-xs">{mechanism}</span>
													</div>
												))}
											</div>
											<div className="mt-3">
												<h4 className="mb-1 font-medium text-xs">Leczenie</h4>
												<div className="flex flex-wrap gap-1">
													{disorder.treatments
														.slice(0, 2)
														.map((treatment, idx) => (
															<Badge
																key={idx}
																variant="outline"
																className="text-xs"
															>
																{treatment}
															</Badge>
														))}
												</div>
											</div>
										</CardContent>
									</Card>
								))}
							</div>
						</TabsContent>

						<TabsContent value="mechanisms" className="space-y-4">
							<Card>
								<CardHeader>
									<CardTitle className="text-lg">
										Patogenne mechanizmy
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
										<div className="rounded-lg bg-red-50 p-4">
											<h4 className="mb-2 font-medium text-red-800">
												Utrata tolerancji
											</h4>
											<p className="mb-2 text-red-700 text-sm">
												Zaburzenia regulacji immunologicznej prowadzące do
												autoagresji
											</p>
											<div className="space-y-1 text-xs">
												<div>• Defekty limfocytów T regulatorowych</div>
												<div>• Produkcja autoprzeciwciał</div>
												<div>• Cytokine imbalance</div>
											</div>
										</div>

										<div className="rounded-lg bg-orange-50 p-4">
											<h4 className="mb-2 font-medium text-orange-800">
												Uszkodzenie bariery
											</h4>
											<p className="mb-2 text-orange-700 text-sm">
												Zaburzenia bariery krew-mózg umożliwiające dostęp
												komórek odpornościowych
											</p>
											<div className="space-y-1 text-xs">
												<div>• Zwiększona przepuszczalność BBB</div>
												<div>• Ekspresja adhesion molecules</div>
												<div>• Migracja leukocytów</div>
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						</TabsContent>

						<TabsContent value="treatments" className="space-y-4">
							<Card>
								<CardHeader>
									<CardTitle className="text-lg">
										Strategie terapeutyczne
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
										<div className="rounded-lg bg-green-50 p-4">
											<h4 className="mb-2 font-medium text-green-800">
												Immunomodulacja
											</h4>
											<div className="space-y-1 text-green-700 text-sm">
												<div>• Interferony β</div>
												<div>• Glatiramer acetate</div>
												<div>• Monoclonal antibodies</div>
											</div>
										</div>

										<div className="rounded-lg bg-blue-50 p-4">
											<h4 className="mb-2 font-medium text-blue-800">
												Immunosupresja
											</h4>
											<div className="space-y-1 text-blue-700 text-sm">
												<div>• Kortykosteroidy</div>
												<div>• Cyclophosphamide</div>
												<div>• Azathioprine</div>
											</div>
										</div>

										<div className="rounded-lg bg-purple-50 p-4">
											<h4 className="mb-2 font-medium text-purple-800">
												Terapia objawowa
											</h4>
											<div className="space-y-1 text-purple-700 text-sm">
												<div>• Leczenie spastyczności</div>
												<div>• Rehabilitacja</div>
												<div>• Leczenie bólu</div>
											</div>
										</div>

										<div className="rounded-lg bg-teal-50 p-4">
											<h4 className="mb-2 font-medium text-teal-800">
												Terapie eksperymentalne
											</h4>
											<div className="space-y-1 text-sm text-teal-700">
												<div>• Komórki macierzyste</div>
												<div>• Terapia genowa</div>
												<div>• Neuroprotekcja</div>
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						</TabsContent>
					</Tabs>
				</CardContent>
			</Card>
		</div>
	);
}
