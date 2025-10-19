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
import { HormoneIcon } from "@/components/ui/custom-icons";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Activity,
	AlertCircle,
	ArrowDown,
	ArrowRight,
	Brain,
	CheckCircle,
	ChevronRight,
	Clock,
	Heart,
	Info,
	Pause,
	Play,
	RotateCcw,
	Star,
	Target,
	Users,
	Zap,
	ZoomIn,
	ZoomOut,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

// Hormone systems data
const HORMONE_SYSTEMS = [
	{
		id: "hpa",
		name: "HPA Axis",
		polishName: "Oś HPA",
		fullName: "Hypothalamic-Pituitary-Adrenal Axis",
		description: "Główny system odpowiedzi na stres",
		hormones: ["CRH", "ACTH", "Cortisol"],
		polishHormones: ["CRH", "ACTH", "Kortyzol"],
		function: "Odpowiedź na stres i regulacja metabolizmu",
		organs: ["Hypothalamus", "Pituitary", "Adrenal glands"],
		polishOrgans: ["Hypothalamus", "Przysadka", "Nadnercza"],
		color: "#EF4444",
	},
	{
		id: "hpg",
		name: "HPG Axis",
		polishName: "Oś HPG",
		fullName: "Hypothalamic-Pituitary-Gonadal Axis",
		description: "System reprodukcyjny i hormony płciowe",
		hormones: ["GnRH", "LH/FSH", "Estrogen/Testosterone"],
		polishHormones: ["GnRH", "LH/FSH", "Estrogen/Testosteron"],
		function: "Rozwój płciowy i funkcje reprodukcyjne",
		organs: ["Hypothalamus", "Pituitary", "Gonads"],
		polishOrgans: ["Hypothalamus", "Przysadka", "Gonady"],
		color: "#EC4899",
	},
	{
		id: "hpt",
		name: "HPT Axis",
		polishName: "Oś HPT",
		fullName: "Hypothalamic-Pituitary-Thyroid Axis",
		description: "Regulacja metabolizmu i rozwoju neurologicznego",
		hormones: ["TRH", "TSH", "T3/T4"],
		polishHormones: ["TRH", "TSH", "T3/T4"],
		function: "Metabolizm i rozwój mózgu",
		organs: ["Hypothalamus", "Pituitary", "Thyroid"],
		polishOrgans: ["Hypothalamus", "Przysadka", "Tarczyca"],
		color: "#8B5CF6",
	},
	{
		id: "metabolic",
		name: "Metabolic Hormones",
		polishName: "Hormony metaboliczne",
		fullName: "Insulin, Leptin, Ghrelin",
		description: "Regulacja apetytu i gospodarki energetycznej",
		hormones: ["Insulin", "Leptin", "Ghrelin"],
		polishHormones: ["Insulina", "Leptyna", "Grelina"],
		function: "Homeostaza energetyczna i apetyt",
		organs: ["Pancreas", "Adipose tissue", "Stomach"],
		polishOrgans: ["Trzustka", "Tkanka tłuszczowa", "Żołądek"],
		color: "#F59E0B",
	},
];

// Feedback loops data
const FEEDBACK_LOOPS = [
	{
		name: "Negative Feedback",
		polishName: "Sprzężenie zwrotne ujemne",
		description: "Hormony docelowe hamują swoją własną produkcję",
		examples: ["Cortisol → ACTH", "T3/T4 → TSH", "Estrogen → GnRH"],
		mechanism: "Homeostaza i zapobieganie nadmiernej produkcji",
	},
	{
		name: "Positive Feedback",
		polishName: "Sprzężenie zwrotne dodatnie",
		description: "Hormony wzmacniają swoją własną produkcję",
		examples: ["LH surge in ovulation", "Oxytocin in labor"],
		mechanism: "Wzmocnienie odpowiedzi w krytycznych momentach",
	},
	{
		name: "Circadian Rhythm",
		polishName: "Rytm dobowy",
		description: "Cykliczne zmiany poziomu hormonów",
		examples: ["Cortisol morning peak", "Melatonin evening rise"],
		mechanism: "Synchronizacja z cyklem światło-ciemność",
	},
];

// Stress hormone effects
const STRESS_EFFECTS = [
	{
		system: "Nervous System",
		polishSystem: "Układ nerwowy",
		effects: [
			"Zwiększona czujność i uwaga",
			"Poprawa pamięci krótkotrwałej",
			"Zaburzenia pamięci długotrwałej",
			"Lęk i niepokój",
		],
		polishEffects: [
			"Zwiększona czujność i uwaga",
			"Poprawa pamięci krótkotrwałej",
			"Zaburzenia pamięci długotrwałej",
			"Lęk i niepokój",
		],
	},
	{
		system: "Immune System",
		polishSystem: "Układ odpornościowy",
		effects: [
			"Początkowa aktywacja immunologiczna",
			"Chroniczne immunosupresja",
			"Zaburzenia odpowiedzi zapalnej",
			"Zwiększona podatność na infekcje",
		],
		polishEffects: [
			"Początkowa aktywacja immunologiczna",
			"Chroniczne immunosupresja",
			"Zaburzenia odpowiedzi zapalnej",
			"Zwiększona podatność na infekcje",
		],
	},
	{
		system: "Metabolic System",
		polishSystem: "Układ metaboliczny",
		effects: [
			"Mobilizacja glukozy",
			"Lipoliza i glukoneogeneza",
			"Insulinooporność",
			"Zaburzenia apetytu",
		],
		polishEffects: [
			"Mobilizacja glukozy",
			"Lipoliza i glukoneogeneza",
			"Insulinooporność",
			"Zaburzenia apetytu",
		],
	},
];

export function NeuroendocrinologyModule() {
	const [selectedSystem, setSelectedSystem] = useState<string | null>("hpa");
	const [isAnimationPlaying, setIsAnimationPlaying] = useState(false);
	const [animationStage, setAnimationStage] = useState(0);
	const [selectedLoop, setSelectedLoop] = useState<string | null>(null);
	const animationRef = useRef<number>();

	const selectedSystemData = HORMONE_SYSTEMS.find(
		(s) => s.id === selectedSystem,
	);
	const selectedLoopData = FEEDBACK_LOOPS.find((l) => l.name === selectedLoop);

	// Animation stages for HPA axis
	const ANIMATION_STAGES = [
		{ id: "stress", name: "Stresor", duration: 2000 },
		{ id: "crh", name: "Uwolnienie CRH", duration: 1500 },
		{ id: "acth", name: "Produkcja ACTH", duration: 1000 },
		{ id: "cortisol", name: "Sekrecja kortyzolu", duration: 2000 },
		{ id: "feedback", name: "Sprzężenie zwrotne", duration: 1500 },
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
			{/* Hormone-Brain Interactions */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<HormoneIcon className="h-5 w-5" />
						Interakcje Hormon-Mózg
					</CardTitle>
					<CardDescription>
						Kompleksowe systemy regulacji hormonalnej i ich wpływ na funkcje
						mózgu
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
						{/* Hormone Systems Selection */}
						<div className="space-y-4">
							<h3 className="font-medium">Główne osie hormonalne</h3>
							<div className="grid grid-cols-1 gap-2">
								{HORMONE_SYSTEMS.map((system) => (
									<Button
										key={system.id}
										variant={
											selectedSystem === system.id ? "default" : "outline"
										}
										className="h-auto justify-start p-3"
										onClick={() => setSelectedSystem(system.id)}
									>
										<div className="flex items-center gap-3">
											<div
												className="h-4 w-4 rounded-full"
												style={{ backgroundColor: system.color }}
											/>
											<div className="text-left">
												<div className="font-medium text-sm">
													{system.polishName}
												</div>
												<div className="text-muted-foreground text-xs">
													{system.fullName}
												</div>
											</div>
										</div>
									</Button>
								))}
							</div>

							{/* System Details */}
							{selectedSystemData && (
								<Card>
									<CardHeader className="pb-3">
										<CardTitle className="flex items-center gap-2 text-base">
											<div
												className="h-3 w-3 rounded-full"
												style={{ backgroundColor: selectedSystemData.color }}
											/>
											{selectedSystemData.polishName}
										</CardTitle>
									</CardHeader>
									<CardContent className="pt-0">
										<div className="space-y-3">
											<p className="text-sm">
												{selectedSystemData.description}
											</p>

											<div>
												<h4 className="mb-1 font-medium text-sm">Hormony</h4>
												<div className="flex flex-wrap gap-1">
													{selectedSystemData.polishHormones.map(
														(hormone, index) => (
															<Badge
																key={index}
																variant="outline"
																className="text-xs"
															>
																{hormone}
															</Badge>
														),
													)}
												</div>
											</div>

											<div>
												<h4 className="mb-1 font-medium text-sm">Organy</h4>
												<div className="space-y-1">
													{selectedSystemData.polishOrgans.map(
														(organ, index) => (
															<div
																key={index}
																className="flex items-center gap-2"
															>
																<div className="h-1 w-1 rounded-full bg-gray-400" />
																<span className="text-xs">{organ}</span>
															</div>
														),
													)}
												</div>
											</div>
										</div>
									</CardContent>
								</Card>
							)}
						</div>

						{/* HPA Axis Animation */}
						<div className="space-y-4">
							<h3 className="font-medium">Animacja osi HPA</h3>

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
										{/* HPA Axis representation */}
										<div className="flex w-full max-w-xs flex-col items-center gap-8">
											{/* Hypothalamus */}
											<div
												className={`flex h-12 w-20 items-center justify-center rounded-lg border-2 border-red-400 bg-red-200 ${isAnimationPlaying && animationStage >= 1 ? "animate-pulse bg-red-400" : ""}`}
											>
												<span className="font-bold text-xs">Hypothalamus</span>
											</div>

											{/* Arrow */}
											<ArrowDown
												className={`h-6 w-6 text-gray-400 ${isAnimationPlaying && animationStage >= 2 ? "animate-bounce" : ""}`}
											/>

											{/* Pituitary */}
											<div
												className={`flex h-12 w-20 items-center justify-center rounded-lg border-2 border-orange-400 bg-orange-200 ${isAnimationPlaying && animationStage >= 2 ? "animate-pulse bg-orange-400" : ""}`}
											>
												<span className="font-bold text-xs">Przysadka</span>
											</div>

											{/* Arrow */}
											<ArrowDown
												className={`h-6 w-6 text-gray-400 ${isAnimationPlaying && animationStage >= 3 ? "animate-bounce" : ""}`}
											/>

											{/* Adrenal glands */}
											<div
												className={`flex h-12 w-20 items-center justify-center rounded-lg border-2 border-yellow-400 bg-yellow-200 ${isAnimationPlaying && animationStage >= 3 ? "animate-pulse bg-yellow-400" : ""}`}
											>
												<span className="font-bold text-xs">Nadnercza</span>
											</div>

											{/* Feedback arrow */}
											{isAnimationPlaying && animationStage >= 4 && (
												<div className="absolute top-4 right-4">
													<div className="flex items-center gap-1">
														<span className="rounded bg-red-100 px-2 py-1 text-xs">
															Cortisol
														</span>
														<ArrowRight className="h-3 w-3 text-red-600" />
														<span className="text-red-600 text-xs">
															Feedback
														</span>
													</div>
												</div>
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

			{/* Feedback Loops */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Activity className="h-5 w-5" />
						Pętle Sprzężenia Zwrotnego
					</CardTitle>
					<CardDescription>
						Mechanizmy regulacji poziomu hormonów w organizmie
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
						{FEEDBACK_LOOPS.map((loop, index) => (
							<Card
								key={index}
								className={`cursor-pointer transition-all ${
									selectedLoop === loop.name ? "ring-2 ring-blue-600" : ""
								}`}
								onClick={() => setSelectedLoop(loop.name)}
							>
								<CardHeader className="pb-3">
									<CardTitle className="text-base">{loop.polishName}</CardTitle>
								</CardHeader>
								<CardContent className="pt-0">
									<p className="mb-3 text-sm">{loop.description}</p>
									<div className="space-y-2">
										<h4 className="font-medium text-xs">Przykłady</h4>
										{loop.examples.map((example, idx) => (
											<div key={idx} className="flex items-center gap-2">
												<div className="h-1 w-1 rounded-full bg-blue-600" />
												<span className="text-xs">{example}</span>
											</div>
										))}
									</div>
									<div className="mt-3">
										<Badge variant="outline" className="text-xs">
											{loop.mechanism}
										</Badge>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</CardContent>
			</Card>

			{/* HPA Axis Regulation and Stress */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Zap className="h-5 w-5" />
						Regulacja Osie HPA i Stres
					</CardTitle>
					<CardDescription>
						Wpływ hormonów stresu na funkcje mózgu i organizmu
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Tabs defaultValue="acute" className="space-y-4">
						<TabsList className="grid w-full grid-cols-3">
							<TabsTrigger value="acute">Stres ostry</TabsTrigger>
							<TabsTrigger value="chronic">Stres chroniczny</TabsTrigger>
							<TabsTrigger value="regulation">Regulacja</TabsTrigger>
						</TabsList>

						<TabsContent value="acute" className="space-y-4">
							<Card>
								<CardHeader>
									<CardTitle className="text-lg">
										Odpowiedź na stres ostry
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
											<div className="text-center">
												<div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
													<Zap className="h-8 w-8 text-red-600" />
												</div>
												<h4 className="font-medium">Stresor</h4>
												<p className="text-gray-600 text-xs">
													Aktywacja układu sympatycznego
												</p>
											</div>
											<div className="text-center">
												<div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
													<HormoneIcon className="h-8 w-8 text-orange-600" />
												</div>
												<h4 className="font-medium">Oś HPA</h4>
												<p className="text-gray-600 text-xs">
													Uwolnienie kortyzolu
												</p>
											</div>
											<div className="text-center">
												<div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
													<Brain className="h-8 w-8 text-green-600" />
												</div>
												<h4 className="font-medium">Mózg</h4>
												<p className="text-gray-600 text-xs">
													Zwiększona czujność
												</p>
											</div>
										</div>

										<div className="rounded-lg bg-blue-50 p-4">
											<h4 className="mb-2 font-medium text-blue-800">
												Pozytywne efekty
											</h4>
											<div className="grid grid-cols-2 gap-2">
												<Badge
													variant="outline"
													className="justify-center text-xs"
												>
													Poprawa pamięci
												</Badge>
												<Badge
													variant="outline"
													className="justify-center text-xs"
												>
													Zwiększona uwaga
												</Badge>
												<Badge
													variant="outline"
													className="justify-center text-xs"
												>
													Mobilizacja energii
												</Badge>
												<Badge
													variant="outline"
													className="justify-center text-xs"
												>
													Szybsze reakcje
												</Badge>
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						</TabsContent>

						<TabsContent value="chronic" className="space-y-4">
							<Card>
								<CardHeader>
									<CardTitle className="text-lg">
										Skutki stresu chronicznego
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
										{STRESS_EFFECTS.map((system, index) => (
											<Card key={index} className="border-l-4 border-l-red-600">
												<CardHeader className="pb-3">
													<CardTitle className="text-base">
														{system.polishSystem}
													</CardTitle>
												</CardHeader>
												<CardContent className="pt-0">
													<div className="space-y-1">
														{system.polishEffects.map((effect, idx) => (
															<div
																key={idx}
																className="flex items-center gap-2"
															>
																<AlertCircle className="h-3 w-3 text-red-600" />
																<span className="text-xs">{effect}</span>
															</div>
														))}
													</div>
												</CardContent>
											</Card>
										))}
									</div>
								</CardContent>
							</Card>
						</TabsContent>

						<TabsContent value="regulation" className="space-y-4">
							<Card>
								<CardHeader>
									<CardTitle className="text-lg">
										Regulacja poziomu kortyzolu
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
											<div className="rounded-lg bg-green-50 p-4">
												<h4 className="mb-2 font-medium text-green-800">
													Czynniki obniżające kortyzol
												</h4>
												<div className="space-y-1 text-green-700 text-sm">
													<div>• Sen (melatonina)</div>
													<div>• Aktywność fizyczna</div>
													<div>• Medytacja</div>
													<div>• Adaptogeny (Rhodiola, Ashwagandha)</div>
												</div>
											</div>
											<div className="rounded-lg bg-red-50 p-4">
												<h4 className="mb-2 font-medium text-red-800">
													Czynniki zwiększające kortyzol
												</h4>
												<div className="space-y-1 text-red-700 text-sm">
													<div>• Stres chroniczny</div>
													<div>• Brak snu</div>
													<div>• Kofeina w nadmiarze</div>
													<div>• Intensywny trening</div>
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

			{/* Reproductive Hormones */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Heart className="h-5 w-5" />
						Hormony Rozrodcze i Funkcje Poznawcze
					</CardTitle>
					<CardDescription>
						Wpływ hormonów płciowych na rozwój i funkcje mózgu
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
						<Card>
							<CardHeader className="pb-3">
								<CardTitle className="text-base">Estrogen</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-3">
									<div>
										<h4 className="mb-1 font-medium text-sm">
											Efekty neurologiczne
										</h4>
										<div className="space-y-1">
											<Badge variant="outline" className="text-xs">
												Neuroprotekcja
											</Badge>
											<Badge variant="outline" className="text-xs">
												Plastyczność synaptyczna
											</Badge>
											<Badge variant="outline" className="text-xs">
												Poprawa pamięci
											</Badge>
										</div>
									</div>
									<div>
										<h4 className="mb-1 font-medium text-sm">Receptory</h4>
										<Badge variant="secondary" className="text-xs">
											ERα, ERβ
										</Badge>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader className="pb-3">
								<CardTitle className="text-base">Testosteron</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-3">
									<div>
										<h4 className="mb-1 font-medium text-sm">
											Efekty neurologiczne
										</h4>
										<div className="space-y-1">
											<Badge variant="outline" className="text-xs">
												Motywacja
											</Badge>
											<Badge variant="outline" className="text-xs">
												Agresja
											</Badge>
											<Badge variant="outline" className="text-xs">
												Libido
											</Badge>
										</div>
									</div>
									<div>
										<h4 className="mb-1 font-medium text-sm">Receptory</h4>
										<Badge variant="secondary" className="text-xs">
											AR
										</Badge>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader className="pb-3">
								<CardTitle className="text-base">Progesteron</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-3">
									<div>
										<h4 className="mb-1 font-medium text-sm">
											Efekty neurologiczne
										</h4>
										<div className="space-y-1">
											<Badge variant="outline" className="text-xs">
												Sedacja
											</Badge>
											<Badge variant="outline" className="text-xs">
												Neuroprotekcja
											</Badge>
											<Badge variant="outline" className="text-xs">
												Redukcja lęku
											</Badge>
										</div>
									</div>
									<div>
										<h4 className="mb-1 font-medium text-sm">Receptory</h4>
										<Badge variant="secondary" className="text-xs">
											PR
										</Badge>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader className="pb-3">
								<CardTitle className="text-base">Cykl menstruacyjny</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-3">
									<div>
										<h4 className="mb-1 font-medium text-sm">
											Wpływ na funkcje poznawcze
										</h4>
										<div className="space-y-1 text-gray-600 text-xs">
											<div>
												• Faza folikularna: Poprawa pamięci przestrzennej
											</div>
											<div>• Faza lutealna: Zwiększona emocjonalność</div>
											<div>• Menstruacja: Możliwe obniżenie nastroju</div>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</CardContent>
			</Card>

			{/* Thyroid and Metabolic Hormones */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Target className="h-5 w-5" />
						Hormony Tarczycy i Metaboliczne
					</CardTitle>
					<CardDescription>
						Rola hormonów tarczycy w rozwoju neurologicznym i funkcjach
						metabolicznych
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
						<Card>
							<CardHeader className="pb-3">
								<CardTitle className="text-base">Hormony tarczycy</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-3">
									<div>
										<h4 className="mb-1 font-medium text-sm">
											Rola w rozwoju mózgu
										</h4>
										<div className="space-y-1 text-gray-600 text-xs">
											<div>• Mielinizacja aksonów</div>
											<div>• Migracja neuronów</div>
											<div>• Synaptogeneza</div>
											<div>• Rozwój dendrytów</div>
										</div>
									</div>
									<div>
										<h4 className="mb-1 font-medium text-sm">
											Efekty niedoboru
										</h4>
										<div className="space-y-1">
											<Badge variant="outline" className="text-xs">
												Kretynizm
											</Badge>
											<Badge variant="outline" className="text-xs">
												Zaburzenia poznawcze
											</Badge>
											<Badge variant="outline" className="text-xs">
												Zaburzenia wzrostu
											</Badge>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader className="pb-3">
								<CardTitle className="text-base">
									Hormony metaboliczne
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-3">
									<div>
										<h4 className="mb-1 font-medium text-sm">Insulina</h4>
										<div className="space-y-1">
											<Badge variant="outline" className="text-xs">
												Regulacja glukozy
											</Badge>
											<Badge variant="outline" className="text-xs">
												Plastyczność synaptyczna
											</Badge>
											<Badge variant="outline" className="text-xs">
												Neuroprotekcja
											</Badge>
										</div>
									</div>
									<div>
										<h4 className="mb-1 font-medium text-sm">Leptyna</h4>
										<div className="space-y-1">
											<Badge variant="outline" className="text-xs">
												Regulacja apetytu
											</Badge>
											<Badge variant="outline" className="text-xs">
												Modulacja nastroju
											</Badge>
											<Badge variant="outline" className="text-xs">
												Funkcje poznawcze
											</Badge>
										</div>
									</div>
									<div>
										<h4 className="mb-1 font-medium text-sm">Grelina</h4>
										<div className="space-y-1">
											<Badge variant="outline" className="text-xs">
												Stymulacja apetytu
											</Badge>
											<Badge variant="outline" className="text-xs">
												Motywacja
											</Badge>
											<Badge variant="outline" className="text-xs">
												Nagroda
											</Badge>
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
