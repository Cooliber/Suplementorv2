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
	AlertCircle,
	ArrowRight,
	Baby,
	Brain,
	Calendar,
	CheckCircle,
	ChevronRight,
	Child,
	Clock,
	Info,
	Pause,
	Play,
	RotateCcw,
	Star,
	Target,
	Timer,
	Users,
	Zap,
	ZoomIn,
	ZoomOut,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

// Developmental stages data
const DEVELOPMENTAL_STAGES = [
	{
		id: "embryonic",
		name: "Embryonic Development",
		polishName: "Rozwój embrionalny",
		period: "0-8 tygodnie",
		weekRange: [0, 8],
		description: "Formowanie cewy nerwowej i podstawowej struktury mózgu",
		keyEvents: [
			"Neurulacja (3-4 tydzień)",
			"Formowanie 3 pęcherzyków mózgowych",
			"Rozwój przodomózgowia, śródmózgowia i tyłomózgowia",
		],
		vulnerablePeriods: ["Formowanie cewy nerwowej", "Migracja neuronów"],
		color: "#EF4444",
	},
	{
		id: "fetal",
		name: "Fetal Development",
		polishName: "Rozwój płodowy",
		period: "9-38 tygodnie",
		weekRange: [9, 38],
		description: "Rozwój kory mózgowej i formowanie połączeń synaptycznych",
		keyEvents: [
			"Migracja neuronów do kory (12-20 tydzień)",
			"Formowanie warstwy korowej",
			"Synaptogeneza i mielinizacja",
		],
		vulnerablePeriods: ["Migracja neuronów", "Synaptogeneza"],
		color: "#F97316",
	},
	{
		id: "infancy",
		name: "Infancy",
		polishName: "Okres niemowlęcy",
		period: "0-2 lata",
		weekRange: [0, 104], // weeks after birth
		description: "Intensywny rozwój połączeń synaptycznych i plastyczność",
		keyEvents: [
			"Synaptogeneza (0-2 lata)",
			"Rozwój zmysłów",
			"Początek lokomocji",
		],
		vulnerablePeriods: ["Formowanie synaps", "Rozwój sensoryczny"],
		color: "#EAB308",
	},
	{
		id: "childhood",
		name: "Childhood",
		polishName: "Dzieciństwo",
		period: "2-12 lat",
		weekRange: [104, 624],
		description: "Rozwój funkcji poznawczych i umiejętności społecznych",
		keyEvents: [
			"Rozwój języka (2-6 lat)",
			"Rozwój funkcji wykonawczych",
			"Socjalizacja i teoria umysłu",
		],
		vulnerablePeriods: ["Rozwój języka", "Funkcje wykonawcze"],
		color: "#22C55E",
	},
	{
		id: "adolescence",
		name: "Adolescence",
		polishName: "Adolescencja",
		period: "12-18 lat",
		weekRange: [624, 936],
		description:
			"Dojrzewanie kory przedczołowej i restrukturyzacja synaptyczna",
		keyEvents: [
			"Dojrzewanie kory przedczołowej",
			"Restrukturyzacja synaptyczna",
			"Rozwój tożsamości",
		],
		vulnerablePeriods: ["Restrukturyzacja synaptyczna", "Rozwój emocjonalny"],
		color: "#3B82F6",
	},
];

// Critical periods data
const CRITICAL_PERIODS = [
	{
		function: "Vision",
		polishFunction: "Wzrok",
		period: "0-3 miesiące",
		description: "Rozwój podstawowych szlaków wzrokowych",
		consequences: "Trwałe deficyty widzenia jeśli nieleczone",
		supplements: ["Vitamin A", "DHA", "Lutein"],
	},
	{
		function: "Language",
		polishFunction: "Język",
		period: "0-7 lat",
		description: "Rozwój obszarów Broca i Wernicke",
		consequences: "Trudności w przyswajaniu języka",
		supplements: ["Omega-3", "Choline", "Iron"],
	},
	{
		function: "Social Skills",
		polishFunction: "Umiejętności społeczne",
		period: "0-5 lat",
		description: "Rozwój teorii umysłu i empatii",
		consequences: "Trudności w interakcjach społecznych",
		supplements: ["Vitamin D", "Probiotics", "Zinc"],
	},
	{
		function: "Executive Functions",
		polishFunction: "Funkcje wykonawcze",
		period: "0-25 lat",
		description: "Dojrzewanie kory przedczołowej",
		consequences: "Impulsywność i słaba kontrola",
		supplements: ["Magnesium", "B-complex", "Phosphatidylserine"],
	},
];

// Synaptogenesis and plasticity
const PLASTICITY_PHASES = [
	{
		phase: "Proliferation",
		polishPhase: "Proliferacja",
		period: "0-2 lata",
		description: "Intensywna produkcja neuronów i synaps",
		mechanisms: ["Neurogeneza", "Synaptogeneza", "Arborizacja dendrytyczna"],
	},
	{
		phase: "Pruning",
		polishPhase: "Przycinanie",
		period: "2-12 lat",
		description: "Eliminacja nieużywanych synaps",
		mechanisms: [
			"Apoptoza",
			"Selektywne wzmacnianie",
			"Konkurencja synaptyczna",
		],
	},
	{
		phase: "Maturation",
		polishPhase: "Dojrzewanie",
		period: "12-25 lat",
		description: "Mielinizacja i stabilizacja sieci",
		mechanisms: ["Mielinizacja", "Stabilizacja synaps", "Optymalizacja sieci"],
	},
];

export function DevelopmentalNeurobiologyModule() {
	const [selectedStage, setSelectedStage] = useState<string | null>(
		"embryonic",
	);
	const [isTimelinePlaying, setIsTimelinePlaying] = useState(false);
	const [currentWeek, setCurrentWeek] = useState(0);
	const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null);
	const timelineRef = useRef<number>();

	const selectedStageData = DEVELOPMENTAL_STAGES.find(
		(s) => s.id === selectedStage,
	);
	const selectedPeriodData = CRITICAL_PERIODS.find(
		(p) => p.function === selectedPeriod,
	);

	// Timeline animation
	useEffect(() => {
		if (isTimelinePlaying) {
			timelineRef.current = window.setInterval(() => {
				setCurrentWeek((prev) => {
					if (prev >= 936) {
						// Max weeks (18 years)
						setIsTimelinePlaying(false);
						return 0;
					}
					return prev + 1;
				});
			}, 100);
		} else {
			if (timelineRef.current) {
				clearInterval(timelineRef.current);
			}
		}

		return () => {
			if (timelineRef.current) {
				clearInterval(timelineRef.current);
			}
		};
	}, [isTimelinePlaying]);

	const handlePlayTimeline = () => {
		setIsTimelinePlaying(!isTimelinePlaying);
	};

	const handleResetTimeline = () => {
		setIsTimelinePlaying(false);
		setCurrentWeek(0);
	};

	const getCurrentStage = (week: number) => {
		return DEVELOPMENTAL_STAGES.find(
			(stage) => week >= stage.weekRange[0] && week <= stage.weekRange[1],
		);
	};

	const currentStage = getCurrentStage(currentWeek);

	return (
		<div className="space-y-6">
			{/* Brain Development Timeline */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Timer className="h-5 w-5" />
						Oś czasu rozwoju mózgu
					</CardTitle>
					<CardDescription>
						Interaktywna wizualizacja etapów rozwoju neurologicznego od poczęcia
						do dorosłości
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
						{/* Timeline Controls */}
						<div className="space-y-4">
							<h3 className="font-medium">Kontrola osi czasu</h3>

							<div className="flex gap-2">
								<Button
									onClick={handlePlayTimeline}
									disabled={isTimelinePlaying}
									className="flex-1"
								>
									{isTimelinePlaying ? (
										<Pause className="mr-2 h-4 w-4" />
									) : (
										<Play className="mr-2 h-4 w-4" />
									)}
									{isTimelinePlaying ? "Pauza" : "Odtwórz"}
								</Button>
								<Button variant="outline" onClick={handleResetTimeline}>
									<RotateCcw className="h-4 w-4" />
								</Button>
							</div>

							{/* Current Position */}
							<Card>
								<CardContent className="pt-4">
									<div className="space-y-3">
										<div className="flex items-center justify-between">
											<span className="font-medium text-sm">
												Aktualny tydzień
											</span>
											<Badge variant="outline">{currentWeek}</Badge>
										</div>
										<div className="flex items-center justify-between">
											<span className="font-medium text-sm">Aktualny etap</span>
											<Badge
												style={{
													backgroundColor: `${currentStage?.color}20`,
													color: currentStage?.color,
													borderColor: currentStage?.color,
												}}
											>
												{currentStage?.polishName || "Przed poczęciem"}
											</Badge>
										</div>
										<Progress value={(currentWeek / 936) * 100} />
									</div>
								</CardContent>
							</Card>

							{/* Quick Navigation */}
							<div className="space-y-2">
								<h4 className="font-medium text-sm">Szybka nawigacja</h4>
								<div className="grid grid-cols-1 gap-1">
									{DEVELOPMENTAL_STAGES.map((stage) => (
										<Button
											key={stage.id}
											variant="outline"
											size="sm"
											className="justify-start"
											onClick={() => setCurrentWeek(stage.weekRange[0])}
										>
											<div className="flex items-center gap-2">
												<div
													className="h-2 w-2 rounded-full"
													style={{ backgroundColor: stage.color }}
												/>
												<span className="text-xs">{stage.period}</span>
											</div>
										</Button>
									))}
								</div>
							</div>
						</div>

						{/* Timeline Visualization */}
						<div className="lg:col-span-2">
							<Card className="border-2 border-dashed">
								<CardContent className="flex flex-col items-center justify-center py-16">
									<div className="relative h-48 w-full rounded-lg bg-gradient-to-r from-red-50 to-blue-50">
										{/* Timeline representation */}
										<div className="absolute inset-0 flex items-center">
											{/* Time axis */}
											<div className="relative h-1 w-full bg-gray-300">
												{/* Current position indicator */}
												<div
													className="absolute top-0 h-1 bg-blue-600 transition-all duration-100"
													style={{ width: `${(currentWeek / 936) * 100}%` }}
												>
													<div className="-top-2 absolute right-0 h-5 w-5 rounded-full border-2 border-white bg-blue-600" />
												</div>

												{/* Stage markers */}
												{DEVELOPMENTAL_STAGES.map((stage, index) => (
													<div
														key={stage.id}
														className="absolute top-0 h-3 w-3 rounded-full border-2 border-white"
														style={{
															backgroundColor: stage.color,
															left: `${(stage.weekRange[0] / 936) * 100}%`,
														}}
													/>
												))}
											</div>
										</div>

										{/* Stage labels */}
										<div className="absolute right-0 bottom-2 left-0 flex justify-between text-gray-600 text-xs">
											{DEVELOPMENTAL_STAGES.map((stage) => (
												<div key={stage.id} className="text-center">
													<div className="w-16">{stage.period}</div>
												</div>
											))}
										</div>
									</div>
									<p className="mt-4 text-center text-gray-600 text-sm">
										Oś czasu rozwoju neurologicznego (0-18 lat)
									</p>
								</CardContent>
							</Card>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Developmental Stages Details */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Calendar className="h-5 w-5" />
						Szczegóły etapów rozwoju
					</CardTitle>
					<CardDescription>
						Szczegółowe informacje o poszczególnych etapach rozwoju mózgu
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
						{DEVELOPMENTAL_STAGES.map((stage) => (
							<Card
								key={stage.id}
								className={`cursor-pointer transition-all ${
									selectedStage === stage.id ? "ring-2 ring-blue-600" : ""
								}`}
								onClick={() => setSelectedStage(stage.id)}
							>
								<CardHeader className="pb-3">
									<CardTitle className="flex items-center gap-2 text-base">
										<div
											className="h-3 w-3 rounded-full"
											style={{ backgroundColor: stage.color }}
										/>
										{stage.polishName}
									</CardTitle>
									<CardDescription className="text-sm">
										{stage.period}
									</CardDescription>
								</CardHeader>
								<CardContent className="pt-0">
									<p className="mb-3 text-sm">{stage.description}</p>
									<div className="space-y-2">
										<h4 className="font-medium text-xs">Kluczowe wydarzenia</h4>
										{stage.keyEvents.slice(0, 2).map((event, index) => (
											<div key={index} className="flex items-center gap-2">
												<div className="h-1 w-1 rounded-full bg-gray-400" />
												<span className="text-xs">{event}</span>
											</div>
										))}
									</div>
								</CardContent>
							</Card>
						))}
					</div>

					{/* Selected Stage Details */}
					{selectedStageData && (
						<Card className="mt-6">
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<div
										className="h-4 w-4 rounded-full"
										style={{ backgroundColor: selectedStageData.color }}
									/>
									{selectedStageData.polishName}
								</CardTitle>
								<CardDescription>
									{selectedStageData.period} • {selectedStageData.description}
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
									<div>
										<h4 className="mb-3 font-medium">Kluczowe wydarzenia</h4>
										<div className="space-y-2">
											{selectedStageData.keyEvents.map((event, index) => (
												<div key={index} className="flex items-center gap-2">
													<CheckCircle className="h-4 w-4 text-green-600" />
													<span className="text-sm">{event}</span>
												</div>
											))}
										</div>
									</div>
									<div>
										<h4 className="mb-3 font-medium">Okresy wrażliwe</h4>
										<div className="space-y-2">
											{selectedStageData.vulnerablePeriods.map(
												(period, index) => (
													<div key={index} className="flex items-center gap-2">
														<AlertCircle className="h-4 w-4 text-orange-600" />
														<span className="text-sm">{period}</span>
													</div>
												),
											)}
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					)}
				</CardContent>
			</Card>

			{/* Critical Periods */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Clock className="h-5 w-5" />
						Okresy Krytyczne
					</CardTitle>
					<CardDescription>
						Okna czasowe o zwiększonej plastyczności dla poszczególnych funkcji
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						{CRITICAL_PERIODS.map((period, index) => (
							<Card
								key={index}
								className={`cursor-pointer transition-all ${
									selectedPeriod === period.function
										? "ring-2 ring-green-600"
										: ""
								}`}
								onClick={() => setSelectedPeriod(period.function)}
							>
								<CardHeader className="pb-3">
									<CardTitle className="text-base">
										{period.polishFunction}
									</CardTitle>
									<CardDescription className="text-sm">
										{period.period}
									</CardDescription>
								</CardHeader>
								<CardContent className="pt-0">
									<p className="mb-3 text-sm">{period.description}</p>
									<div className="space-y-2">
										<div>
											<h4 className="mb-1 font-medium text-xs">
												Konsekwencje zaniedbania
											</h4>
											<p className="text-gray-600 text-xs">
												{period.consequences}
											</p>
										</div>
										<div>
											<h4 className="mb-1 font-medium text-xs">
												Wspierające suplementy
											</h4>
											<div className="flex flex-wrap gap-1">
												{period.supplements.slice(0, 2).map((supp, idx) => (
													<Badge
														key={idx}
														variant="outline"
														className="text-xs"
													>
														{supp}
													</Badge>
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

			{/* Synaptogenesis and Circuit Formation */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Zap className="h-5 w-5" />
						Synaptogeneza i Formowanie Obwodów
					</CardTitle>
					<CardDescription>
						Procesy tworzenia i modyfikacji połączeń synaptycznych
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Tabs defaultValue="phases" className="space-y-4">
						<TabsList className="grid w-full grid-cols-3">
							<TabsTrigger value="phases">Fazy rozwoju</TabsTrigger>
							<TabsTrigger value="mechanisms">Mechanizmy</TabsTrigger>
							<TabsTrigger value="plasticity">Plastyczność</TabsTrigger>
						</TabsList>

						<TabsContent value="phases" className="space-y-4">
							<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
								{PLASTICITY_PHASES.map((phase, index) => (
									<Card key={index}>
										<CardHeader className="pb-3">
											<CardTitle className="text-base">
												{phase.polishPhase}
											</CardTitle>
											<CardDescription className="text-sm">
												{phase.period}
											</CardDescription>
										</CardHeader>
										<CardContent className="pt-0">
											<p className="mb-3 text-sm">{phase.description}</p>
											<div className="space-y-1">
												<h4 className="font-medium text-xs">Mechanizmy</h4>
												{phase.mechanisms.map((mechanism, idx) => (
													<div key={idx} className="flex items-center gap-2">
														<div className="h-1 w-1 rounded-full bg-blue-600" />
														<span className="text-xs">{mechanism}</span>
													</div>
												))}
											</div>
										</CardContent>
									</Card>
								))}
							</div>
						</TabsContent>

						<TabsContent value="mechanisms" className="space-y-4">
							<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
								<Card className="border-l-4 border-l-blue-600">
									<CardContent className="pt-4">
										<h4 className="mb-2 font-medium">Synaptogeneza</h4>
										<p className="mb-3 text-gray-600 text-sm">
											Tworzenie nowych połączeń synaptycznych między neuronami
										</p>
										<div className="space-y-1 text-xs">
											<div>• Formowanie presynaptycznych terminali</div>
											<div>• Rozwój postsynaptycznych gęstości</div>
											<div>• Stabilizacja połączeń</div>
										</div>
									</CardContent>
								</Card>

								<Card className="border-l-4 border-l-green-600">
									<CardContent className="pt-4">
										<h4 className="mb-2 font-medium">Mielinizacja</h4>
										<p className="mb-3 text-gray-600 text-sm">
											Formowanie osłonki mielinowej wokół aksonów
										</p>
										<div className="space-y-1 text-xs">
											<div>• Oligodendrocyty w OUN</div>
											<div>• Schwann cells w PNS</div>
											<div>• Węzły Ranviera</div>
										</div>
									</CardContent>
								</Card>

								<Card className="border-l-4 border-l-purple-600">
									<CardContent className="pt-4">
										<h4 className="mb-2 font-medium">
											Arborizacja dendrytyczna
										</h4>
										<p className="mb-3 text-gray-600 text-sm">
											Rozwój drzewa dendrytycznego neuronów
										</p>
										<div className="space-y-1 text-xs">
											<div>• Wzrost liczby dendrytów</div>
											<div>• Formowanie kolców dendrytycznych</div>
											<div>• Zwiększenie powierzchni receptywnej</div>
										</div>
									</CardContent>
								</Card>

								<Card className="border-l-4 border-l-orange-600">
									<CardContent className="pt-4">
										<h4 className="mb-2 font-medium">
											Przycinanie synaptyczne
										</h4>
										<p className="mb-3 text-gray-600 text-sm">
											Eliminacja nieużywanych połączeń
										</p>
										<div className="space-y-1 text-xs">
											<div>• Selekcja na podstawie aktywności</div>
											<div>• Apoptoza słabych synaps</div>
											<div>• Optymalizacja sieci neuronalnych</div>
										</div>
									</CardContent>
								</Card>
							</div>
						</TabsContent>

						<TabsContent value="plasticity" className="space-y-4">
							<Card>
								<CardHeader>
									<CardTitle className="text-lg">
										Plastyczność zależna od doświadczenia
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
											<div className="rounded-lg bg-green-50 p-4">
												<h4 className="mb-2 font-medium text-green-800">
													LTP (Long-Term Potentiation)
												</h4>
												<p className="mb-2 text-green-700 text-sm">
													Długoterminowe wzmacnianie synaps w odpowiedzi na
													aktywność
												</p>
												<div className="space-y-1 text-xs">
													<div>• Wzrost wrażliwości postsynaptycznej</div>
													<div>• Zwiększenie uwalniania neuroprzekaźników</div>
													<div>• Strukturalne zmiany synaps</div>
												</div>
											</div>

											<div className="rounded-lg bg-red-50 p-4">
												<h4 className="mb-2 font-medium text-red-800">
													LTD (Long-Term Depression)
												</h4>
												<p className="mb-2 text-red-700 text-sm">
													Długoterminowe osłabienie synaps
												</p>
												<div className="space-y-1 text-xs">
													<div>• Zmniejszenie wrażliwości postsynaptycznej</div>
													<div>• Eliminacja słabych synaps</div>
													<div>• Optymalizacja sieci</div>
												</div>
											</div>
										</div>

										<div className="rounded-lg bg-blue-50 p-4">
											<h4 className="mb-2 font-medium text-blue-800">
												Czynniki wpływające na plastyczność
											</h4>
											<div className="mt-3 grid grid-cols-2 gap-4">
												<div>
													<h5 className="mb-2 font-medium text-sm">
														Pozytywne
													</h5>
													<div className="space-y-1 text-xs">
														<div>• Aktywność fizyczna</div>
														<div>• Stymulacja poznawcza</div>
														<div>• Sen</div>
														<div>• Żywienie</div>
													</div>
												</div>
												<div>
													<h5 className="mb-2 font-medium text-sm">
														Negatywne
													</h5>
													<div className="space-y-1 text-xs">
														<div>• Stres chroniczny</div>
														<div>• Niedobory żywieniowe</div>
														<div>• Toksyny</div>
														<div>• Brak snu</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						</TabsContent>
					</Tabs>
				</CardContent>
			</Card>

			{/* Experience-Dependent Plasticity */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Brain className="h-5 w-5" />
						Plastyczność zależna od doświadczenia
					</CardTitle>
					<CardDescription>
						Wpływ środowiska i doświadczeń na rozwój mózgu
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
						<Card>
							<CardHeader className="pb-3">
								<CardTitle className="text-base">Okna plastyczności</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-3">
									<div className="flex items-center justify-between">
										<span className="text-sm">Wzrok</span>
										<div className="flex items-center gap-2">
											<div className="h-2 w-16 rounded-full bg-gray-200">
												<div
													className="h-2 rounded-full bg-red-600"
													style={{ width: "90%" }}
												/>
											</div>
											<span className="text-xs">0-3m</span>
										</div>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-sm">Język</span>
										<div className="flex items-center gap-2">
											<div className="h-2 w-16 rounded-full bg-gray-200">
												<div
													className="h-2 rounded-full bg-orange-600"
													style={{ width: "70%" }}
												/>
											</div>
											<span className="text-xs">0-7l</span>
										</div>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-sm">Funkcje wykonawcze</span>
										<div className="flex items-center gap-2">
											<div className="h-2 w-16 rounded-full bg-gray-200">
												<div
													className="h-2 rounded-full bg-blue-600"
													style={{ width: "50%" }}
												/>
											</div>
											<span className="text-xs">0-25l</span>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader className="pb-3">
								<CardTitle className="text-base">
									Czynniki środowiskowe
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-3">
									<div className="rounded-lg bg-green-50 p-3">
										<h4 className="mb-1 font-medium text-green-800 text-sm">
											Pozytywne wpływy
										</h4>
										<div className="space-y-1 text-green-700 text-xs">
											<div>• Bogate środowisko sensoryczne</div>
											<div>• Interakcje społeczne</div>
											<div>• Aktywność fizyczna</div>
										</div>
									</div>
									<div className="rounded-lg bg-red-50 p-3">
										<h4 className="mb-1 font-medium text-red-800 text-sm">
											Negatywne wpływy
										</h4>
										<div className="space-y-1 text-red-700 text-xs">
											<div>• Deprywacja sensoryczna</div>
											<div>• Stres chroniczny</div>
											<div>• Toksyny środowiskowe</div>
										</div>
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
