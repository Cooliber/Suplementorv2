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
	AlertCircle,
	ArrowRight,
	Atom,
	CheckCircle,
	Dna,
	Info,
	Microscope,
	Pause,
	Play,
	RotateCcw,
	Target,
	Timer,
	Zap,
	ZoomIn,
	ZoomOut,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

// Receptor types data
const RECEPTOR_TYPES = [
	{
		id: "ionotropic",
		name: "Ionotropic",
		polishName: "Jonotropowe",
		description: "Receptory bezpośrednio sprzężone z kanałami jonowymi",
		examples: ["GABA_A", "Glutamate (AMPA, NMDA)", "Nicotinic ACh"],
		mechanism: "Bezpośrednie otwieranie kanałów jonowych",
		speed: "Milisekundy",
		color: "#3B82F6",
	},
	{
		id: "metabotropic",
		name: "Metabotropic",
		polishName: "Metabotropowe",
		description: "Receptory sprzężone z białkami G",
		examples: ["Dopamine (D1-D5)", "Serotonin (5-HT)", "Muscarinic ACh"],
		mechanism: "Aktywacja kaskad sygnałowych przez białka G",
		speed: "Sekundy do minut",
		color: "#10B981",
	},
	{
		id: "enzyme",
		name: "Enzyme-linked",
		polishName: "Sprzężone z enzymami",
		description: "Receptory z aktywnością kinazy tyrozynowej",
		examples: ["Insulin", "NGF (TrkA)", "BDNF (TrkB)"],
		mechanism: "Fosforylacja i aktywacja szlaków sygnałowych",
		speed: "Minuty do godzin",
		color: "#F59E0B",
	},
	{
		id: "nuclear",
		name: "Nuclear",
		polishName: "Jądrowe",
		description: "Receptory steroidowe i tarczycowe",
		examples: ["Estrogen (ER)", "Testosterone (AR)", "Thyroid (TR)"],
		mechanism: "Bezpośrednia regulacja transkrypcji genów",
		speed: "Godziny do dni",
		color: "#EF4444",
	},
];

// Second messenger systems
const SECOND_MESSENGERS = [
	{
		id: "camp",
		name: "cAMP",
		polishName: "cAMP",
		fullName: "Cyclic Adenosine Monophosphate",
		pathway: "Adenylyl cyclase → cAMP → PKA",
		functions: ["Glikogenoliza", "Lipoliza", "Regulacja genów"],
		color: "#8B5CF6",
	},
	{
		id: "ip3",
		name: "IP₃",
		polishName: "IP₃",
		fullName: "Inositol Triphosphate",
		pathway: "Phospholipase C → IP₃ → Uwolnianie Ca²⁺",
		functions: ["Uwolnianie wapnia", "Aktywacja kinaz"],
		color: "#EC4899",
	},
	{
		id: "dag",
		name: "DAG",
		polishName: "DAG",
		fullName: "Diacylglycerol",
		pathway: "Phospholipase C → DAG → PKC",
		functions: ["Aktywacja kinazy C", "Regulacja kanałów"],
		color: "#F97316",
	},
	{
		id: "calcium",
		name: "Ca²⁺",
		polishName: "Ca²⁺",
		fullName: "Calcium ions",
		pathway: "Kanały wapniowe → Wzrost [Ca²⁺]i",
		functions: ["Neurotransmisja", "Plastyczność synaptyczna"],
		color: "#06B6D4",
	},
];

// Gene expression regulation
const GENE_REGULATION = [
	{
		id: "transcription",
		name: "Transcription Factors",
		polishName: "Czynniki transkrypcyjne",
		examples: ["CREB", "NF-κB", "AP-1", "SRF"],
		function: "Bezpośrednia regulacja ekspresji genów",
		targets: ["Geny natychmiastnie wcześnie", "Geny efektorowe"],
	},
	{
		id: "epigenetics",
		name: "Epigenetic Modifications",
		polishName: "Modyfikacje epigenetyczne",
		examples: ["Metylacja DNA", "Acetylacja histonów", "miRNA"],
		function: "Długoterminowa regulacja ekspresji genów",
		targets: ["Chromatyna", "Struktura nukleosomów"],
	},
	{
		id: "signaling",
		name: "Signal Transduction",
		polishName: "Przekazywanie sygnału",
		examples: ["MAPK/ERK", "PI3K/Akt", "JAK/STAT"],
		function: "Kaskady fosforylacji prowadzące do zmian ekspresji",
		targets: ["Czynniki transkrypcyjne", "Regulatory chromatyny"],
	},
];

export function MolecularNeurobiologyModule() {
	const [activeReceptor, setActiveReceptor] = useState<string | null>(null);
	const [isAnimationPlaying, setIsAnimationPlaying] = useState(false);
	const [animationStage, setAnimationStage] = useState(0);
	const [selectedMessenger, setSelectedMessenger] = useState<string | null>(
		null,
	);
	const animationRef = useRef<number>();

	const selectedReceptor = RECEPTOR_TYPES.find((r) => r.id === activeReceptor);
	const selectedMessengerData = SECOND_MESSENGERS.find(
		(m) => m.id === selectedMessenger,
	);

	// Animation stages for receptor binding
	const ANIMATION_STAGES = [
		{ id: "ligand", name: "Łączenie ligandu", duration: 2000 },
		{ id: "conformation", name: "Zmiana konformacji", duration: 1500 },
		{ id: "activation", name: "Aktywacja receptora", duration: 1000 },
		{ id: "signaling", name: "Przekazywanie sygnału", duration: 2500 },
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
			{/* Receptor Pharmacology Section */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Target className="h-5 w-5" />
						Farmakologia Receptorów
					</CardTitle>
					<CardDescription>
						Interaktywna wizualizacja wiązania ligand-receptor i aktywacji
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
						{/* Receptor Selection */}
						<div className="space-y-4">
							<h3 className="font-medium">Typy receptorów</h3>
							<div className="grid grid-cols-1 gap-2">
								{RECEPTOR_TYPES.map((receptor) => (
									<Button
										key={receptor.id}
										variant={
											activeReceptor === receptor.id ? "default" : "outline"
										}
										className="h-auto justify-start p-3"
										onClick={() => setActiveReceptor(receptor.id)}
									>
										<div className="flex items-center gap-3">
											<div
												className="h-4 w-4 rounded-full"
												style={{ backgroundColor: receptor.color }}
											/>
											<div className="text-left">
												<div className="font-medium text-sm">
													{receptor.polishName}
												</div>
												<div className="text-muted-foreground text-xs">
													{receptor.name}
												</div>
											</div>
										</div>
									</Button>
								))}
							</div>

							{/* Receptor Details */}
							{selectedReceptor && (
								<Card>
									<CardHeader className="pb-3">
										<CardTitle className="flex items-center gap-2 text-base">
											<div
												className="h-3 w-3 rounded-full"
												style={{ backgroundColor: selectedReceptor.color }}
											/>
											{selectedReceptor.polishName}
										</CardTitle>
									</CardHeader>
									<CardContent className="pt-0">
										<div className="space-y-3">
											<p className="text-sm">{selectedReceptor.description}</p>
											<div>
												<h4 className="mb-1 font-medium text-sm">Przykłady</h4>
												<div className="flex flex-wrap gap-1">
													{selectedReceptor.examples.map((example, index) => (
														<Badge
															key={index}
															variant="outline"
															className="text-xs"
														>
															{example}
														</Badge>
													))}
												</div>
											</div>
											<div className="grid grid-cols-2 gap-2 text-xs">
												<div>
													<span className="font-medium">Mechanizm:</span>
													<p className="text-gray-600">
														{selectedReceptor.mechanism}
													</p>
												</div>
												<div>
													<span className="font-medium">Czas działania:</span>
													<p className="text-gray-600">
														{selectedReceptor.speed}
													</p>
												</div>
											</div>
										</div>
									</CardContent>
								</Card>
							)}
						</div>

						{/* Receptor Binding Animation */}
						<div className="space-y-4">
							<h3 className="font-medium">Animacja wiązania receptora</h3>

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
										{/* Simplified receptor binding animation */}
										<div className="flex items-center gap-8">
											{/* Ligand */}
											<div className="relative">
												<div
													className={`flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 font-bold text-white text-xs ${isAnimationPlaying && animationStage >= 0 ? "animate-bounce" : ""}`}
												>
													L
												</div>
												<span className="mt-2 block text-center text-xs">
													Ligand
												</span>
											</div>

											{/* Arrow */}
											<ArrowRight
												className={`h-6 w-6 text-gray-400 ${isAnimationPlaying && animationStage >= 1 ? "animate-pulse" : ""}`}
											/>

											{/* Receptor */}
											<div className="relative">
												<div
													className={`flex h-16 w-12 items-center justify-center rounded-lg border-2 border-green-400 bg-green-200 ${isAnimationPlaying && animationStage >= 2 ? "bg-green-400" : ""}`}
												>
													<div className="font-bold text-xs">R</div>
												</div>
												<span className="mt-2 block text-center text-xs">
													Receptor
												</span>
											</div>

											{/* Signaling cascade */}
											{isAnimationPlaying && animationStage >= 3 && (
												<>
													<ArrowRight className="h-6 w-6 animate-pulse text-purple-400" />
													<div className="flex flex-col gap-2">
														<div className="h-6 w-6 animate-pulse rounded-full bg-purple-300" />
														<div className="h-4 w-4 animate-pulse rounded-full bg-purple-400" />
														<div className="h-3 w-3 animate-pulse rounded-full bg-purple-500" />
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

			{/* Second Messenger Cascades */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Activity className="h-5 w-5" />
						Kaskady Drugich Przekaźników
					</CardTitle>
					<CardDescription>
						Systemy przekazywania sygnału wewnątrzkomórkowego
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
						{/* Second Messengers Grid */}
						<div className="space-y-4">
							<h3 className="font-medium">Główne drugie przekaźniki</h3>
							<div className="grid grid-cols-1 gap-3">
								{SECOND_MESSENGERS.map((messenger) => (
									<Button
										key={messenger.id}
										variant={
											selectedMessenger === messenger.id ? "default" : "outline"
										}
										className="h-auto justify-start p-4"
										onClick={() => setSelectedMessenger(messenger.id)}
									>
										<div className="flex items-center gap-3">
											<div
												className="h-4 w-4 rounded-full"
												style={{ backgroundColor: messenger.color }}
											/>
											<div className="text-left">
												<div className="font-medium text-sm">
													{messenger.polishName}
												</div>
												<div className="text-muted-foreground text-xs">
													{messenger.fullName}
												</div>
											</div>
										</div>
									</Button>
								))}
							</div>
						</div>

						{/* Second Messenger Details */}
						{selectedMessengerData && (
							<Card>
								<CardHeader className="pb-3">
									<CardTitle className="flex items-center gap-2 text-base">
										<div
											className="h-3 w-3 rounded-full"
											style={{ backgroundColor: selectedMessengerData.color }}
										/>
										{selectedMessengerData.polishName}
									</CardTitle>
								</CardHeader>
								<CardContent className="pt-0">
									<div className="space-y-4">
										<div>
											<h4 className="mb-2 font-medium text-sm">
												Ścieżka sygnałowa
											</h4>
											<div className="rounded-lg bg-gray-50 p-3">
												<p className="font-mono text-sm">
													{selectedMessengerData.pathway}
												</p>
											</div>
										</div>

										<div>
											<h4 className="mb-2 font-medium text-sm">Funkcje</h4>
											<div className="flex flex-wrap gap-1">
												{selectedMessengerData.functions.map((func, index) => (
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

										{/* Cascade Visualization */}
										<div className="rounded-lg bg-gray-50 p-4">
											<h4 className="mb-3 font-medium text-sm">
												Kaskada sygnałowa
											</h4>
											<div className="flex items-center gap-2 text-xs">
												<span>Receptor</span>
												<ArrowRight className="h-3 w-3" />
												<span>Białko G</span>
												<ArrowRight className="h-3 w-3" />
												<span className="font-bold">
													{selectedMessengerData.name}
												</span>
												<ArrowRight className="h-3 w-3" />
												<span>Kinaza</span>
												<ArrowRight className="h-3 w-3" />
												<span>Efekt</span>
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						)}
					</div>
				</CardContent>
			</Card>

			{/* Gene Expression Regulation */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Dna className="h-5 w-5" />
						Regulacja Ekspresji Genów
					</CardTitle>
					<CardDescription>
						Mechanizmy kontrolujące ekspresję genów w neuronach
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Tabs defaultValue="transcription" className="space-y-4">
						<TabsList className="grid w-full grid-cols-3">
							<TabsTrigger value="transcription">Transkrypcja</TabsTrigger>
							<TabsTrigger value="epigenetics">Epigenetyka</TabsTrigger>
							<TabsTrigger value="signaling">Sygnalizacja</TabsTrigger>
						</TabsList>

						{GENE_REGULATION.map((regulation) => (
							<TabsContent
								key={regulation.id}
								value={regulation.id}
								className="space-y-4"
							>
								<Card>
									<CardHeader>
										<CardTitle className="text-lg">
											{regulation.polishName}
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
											<div>
												<h4 className="mb-2 font-medium">Przykłady</h4>
												<div className="space-y-1">
													{regulation.examples.map((example, index) => (
														<div
															key={index}
															className="flex items-center gap-2"
														>
															<div className="h-2 w-2 rounded-full bg-blue-600" />
															<span className="text-sm">{example}</span>
														</div>
													))}
												</div>
											</div>
											<div>
												<h4 className="mb-2 font-medium">Funkcja</h4>
												<p className="mb-3 text-gray-600 text-sm">
													{regulation.function}
												</p>
												<h4 className="mb-2 font-medium">Cele</h4>
												<div className="flex flex-wrap gap-1">
													{regulation.targets.map((target, index) => (
														<Badge
															key={index}
															variant="outline"
															className="text-xs"
														>
															{target}
														</Badge>
													))}
												</div>
											</div>
										</div>
									</CardContent>
								</Card>
							</TabsContent>
						))}
					</Tabs>
				</CardContent>
			</Card>

			{/* Protein Synthesis and Trafficking */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Atom className="h-5 w-5" />
						Synteza i Transport Białek
					</CardTitle>
					<CardDescription>
						Procesy syntezy białek i ich transport w neuronach
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Accordion type="multiple" className="w-full">
						<AccordionItem value="synthesis">
							<AccordionTrigger className="text-left">
								<div className="flex items-center gap-2">
									<Info className="h-4 w-4 text-blue-600" />
									<span>Synteza białek w neuronach</span>
								</div>
							</AccordionTrigger>
							<AccordionContent>
								<div className="space-y-4 pt-4">
									<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
										<Card className="border-l-4 border-l-blue-600">
											<CardContent className="pt-4">
												<h4 className="mb-2 font-medium">Transkrypcja</h4>
												<p className="text-gray-600 text-sm">
													Synteza mRNA z DNA w jądrze neuronu
												</p>
											</CardContent>
										</Card>
										<Card className="border-l-4 border-l-green-600">
											<CardContent className="pt-4">
												<h4 className="mb-2 font-medium">Translacja</h4>
												<p className="text-gray-600 text-sm">
													Synteza białek na rybosomach
												</p>
											</CardContent>
										</Card>
										<Card className="border-l-4 border-l-purple-600">
											<CardContent className="pt-4">
												<h4 className="mb-2 font-medium">Fałdowanie</h4>
												<p className="text-gray-600 text-sm">
													Prawidłowe formowanie struktury białka
												</p>
											</CardContent>
										</Card>
									</div>
								</div>
							</AccordionContent>
						</AccordionItem>

						<AccordionItem value="trafficking">
							<AccordionTrigger className="text-left">
								<div className="flex items-center gap-2">
									<Zap className="h-4 w-4 text-green-600" />
									<span>Transport białek w neuronach</span>
								</div>
							</AccordionTrigger>
							<AccordionContent>
								<div className="space-y-4 pt-4">
									<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
										<div className="rounded-lg bg-blue-50 p-4">
											<h4 className="mb-2 font-medium text-blue-800">
												Transport aksonalny
											</h4>
											<p className="mb-2 text-blue-700 text-sm">
												Transport anterogradowy i retrogradowy w aksonach
											</p>
											<div className="space-y-1 text-xs">
												<div>• Kinezyna: transport anterogradowy</div>
												<div>• Dyneina: transport retrogradowy</div>
											</div>
										</div>
										<div className="rounded-lg bg-green-50 p-4">
											<h4 className="mb-2 font-medium text-green-800">
												Transport dendrytyczny
											</h4>
											<p className="mb-2 text-green-700 text-sm">
												Lokalna synteza białek w dendrytach
											</p>
											<div className="space-y-1 text-xs">
												<div>• Rybosomy w dendrytach</div>
												<div>• mRNA transportowany z somy</div>
											</div>
										</div>
									</div>
								</div>
							</AccordionContent>
						</AccordionItem>
					</Accordion>
				</CardContent>
			</Card>

			{/* Neurotrophic Factors */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<CheckCircle className="h-5 w-5" />
						Czynniki Neurotroficzne
					</CardTitle>
					<CardDescription>
						Białka wspierające przeżycie, wzrost i funkcję neuronów
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						<Card>
							<CardHeader className="pb-3">
								<CardTitle className="text-base">BDNF</CardTitle>
								<CardDescription className="text-sm">
									Brain-Derived Neurotrophic Factor
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-3">
									<div>
										<h4 className="mb-1 font-medium text-sm">Funkcje</h4>
										<div className="space-y-1">
											<Badge variant="outline" className="text-xs">
												Neurogeneza
											</Badge>
											<Badge variant="outline" className="text-xs">
												Plastyczność synaptyczna
											</Badge>
											<Badge variant="outline" className="text-xs">
												Przeżycie neuronów
											</Badge>
										</div>
									</div>
									<div>
										<h4 className="mb-1 font-medium text-sm">Receptory</h4>
										<Badge variant="secondary" className="text-xs">
											TrkB
										</Badge>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader className="pb-3">
								<CardTitle className="text-base">NGF</CardTitle>
								<CardDescription className="text-sm">
									Nerve Growth Factor
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-3">
									<div>
										<h4 className="mb-1 font-medium text-sm">Funkcje</h4>
										<div className="space-y-1">
											<Badge variant="outline" className="text-xs">
												Wzrost aksonów
											</Badge>
											<Badge variant="outline" className="text-xs">
												Przeżycie neuronów
											</Badge>
											<Badge variant="outline" className="text-xs">
												Regeneracja
											</Badge>
										</div>
									</div>
									<div>
										<h4 className="mb-1 font-medium text-sm">Receptory</h4>
										<Badge variant="secondary" className="text-xs">
											TrkA
										</Badge>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader className="pb-3">
								<CardTitle className="text-base">GDNF</CardTitle>
								<CardDescription className="text-sm">
									Glial Cell-Derived Neurotrophic Factor
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-3">
									<div>
										<h4 className="mb-1 font-medium text-sm">Funkcje</h4>
										<div className="space-y-1">
											<Badge variant="outline" className="text-xs">
												Ochrona neuronów dopaminergicznych
											</Badge>
											<Badge variant="outline" className="text-xs">
												Regeneracja aksonów
											</Badge>
											<Badge variant="outline" className="text-xs">
												Angiogeneza
											</Badge>
										</div>
									</div>
									<div>
										<h4 className="mb-1 font-medium text-sm">Receptory</h4>
										<Badge variant="secondary" className="text-xs">
											GFRα1/RET
										</Badge>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader className="pb-3">
								<CardTitle className="text-base">CNTF</CardTitle>
								<CardDescription className="text-sm">
									Ciliary Neurotrophic Factor
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-3">
									<div>
										<h4 className="mb-1 font-medium text-sm">Funkcje</h4>
										<div className="space-y-1">
											<Badge variant="outline" className="text-xs">
												Przeżycie neuronów ruchowych
											</Badge>
											<Badge variant="outline" className="text-xs">
												Astrogeneza
											</Badge>
											<Badge variant="outline" className="text-xs">
												Reakcje zapalne
											</Badge>
										</div>
									</div>
									<div>
										<h4 className="mb-1 font-medium text-sm">Receptory</h4>
										<Badge variant="secondary" className="text-xs">
											CNTFRα/LIFR
										</Badge>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
