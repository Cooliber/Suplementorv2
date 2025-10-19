import Interactive3DBrainModel from "@/components/brain/Interactive3DBrainModel";
import { BreadcrumbNavigation } from "@/components/navigation/BreadcrumbNavigation";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, BookOpen, Brain, Sparkles, Zap } from "lucide-react";
import type { Metadata } from "next";

// Import brain regions data directly to avoid build issues
const brainRegions = [
	{
		id: "prefrontal-cortex",
		name: "Prefrontal Cortex",
		polishName: "Kora przedczołowa",
		position: [0, 1.2, 1.8],
		color: "#4F46E5",
		size: 0.8,
		functions: [
			"Executive function",
			"Working memory",
			"Decision making",
			"Attention",
		],
		polishFunctions: [
			"Funkcje wykonawcze",
			"Pamięć robocza",
			"Podejmowanie decyzji",
			"Uwaga",
		],
		neurotransmitters: ["Dopamine", "Norepinephrine", "Acetylcholine"],
		supplementEffects: [
			{
				supplementId: "omega-3-epa-dha",
				supplementName: "Omega-3 EPA/DHA",
				polishSupplementName: "Omega-3 EPA/DHA",
				effectType: "ENHANCES",
				intensity: 0.7,
				mechanism: "Improves membrane fluidity and neuroplasticity",
				polishMechanism: "Poprawia płynność błon i neuroplastyczność",
				evidenceLevel: "MODERATE",
				visualEffect: {
					color: "#10B981",
					pulseSpeed: 1.5,
					glowIntensity: 0.6,
				},
			},
			{
				supplementId: "magnesium-l-threonate",
				supplementName: "Magnesium L-Threonate",
				polishSupplementName: "L-treonian magnezu",
				effectType: "STIMULATES",
				intensity: 0.8,
				mechanism: "Enhances NMDA receptor function and synaptic plasticity",
				polishMechanism:
					"Wzmacnia funkcję receptorów NMDA i plastyczność synaptyczną",
				evidenceLevel: "MODERATE",
				visualEffect: {
					color: "#8B5CF6",
					pulseSpeed: 2.0,
					glowIntensity: 0.8,
				},
			},
		],
		anatomicalInfo: {
			volume: 85.2,
			connections: ["Anterior Cingulate", "Hippocampus", "Amygdala"],
			polishConnections: [
				"Kora zakrętu obręczy przednia",
				"Hipokamp",
				"Ciało migdałowate",
			],
			clinicalRelevance:
				"Critical for cognitive control and executive function",
			polishClinicalRelevance:
				"Kluczowa dla kontroli poznawczej i funkcji wykonawczych",
		},
	},
	{
		id: "hippocampus",
		name: "Hippocampus",
		polishName: "Hipokamp",
		position: [1.5, 0, -0.5],
		color: "#F59E0B",
		size: 0.6,
		functions: ["Memory formation", "Learning", "Spatial navigation"],
		polishFunctions: [
			"Tworzenie pamięci",
			"Uczenie się",
			"Nawigacja przestrzenna",
		],
		neurotransmitters: ["Acetylcholine", "GABA", "Glutamate"],
		supplementEffects: [
			{
				supplementId: "lions-mane-mushroom",
				supplementName: "Lion's Mane Mushroom",
				polishSupplementName: "Soplówka jeżowata",
				effectType: "ENHANCES",
				intensity: 0.9,
				mechanism: "Stimulates NGF production and neurogenesis",
				polishMechanism: "Stymuluje produkcję NGF i neurogenezę",
				evidenceLevel: "MODERATE",
				visualEffect: {
					color: "#F97316",
					pulseSpeed: 1.8,
					glowIntensity: 0.9,
				},
			},
		],
		anatomicalInfo: {
			volume: 4.2,
			connections: ["Prefrontal Cortex", "Entorhinal Cortex", "Amygdala"],
			polishConnections: [
				"Kora przedczołowa",
				"Kora śródwęchowa",
				"Ciało migdałowate",
			],
			clinicalRelevance:
				"Essential for memory consolidation and spatial memory",
			polishClinicalRelevance:
				"Niezbędny dla konsolidacji pamięci i pamięci przestrzennej",
		},
	},
	{
		id: "amygdala",
		name: "Amygdala",
		polishName: "Ciało migdałowate",
		position: [1.2, -0.3, -0.8],
		color: "#EF4444",
		size: 0.4,
		functions: ["Emotion processing", "Fear response", "Memory modulation"],
		polishFunctions: [
			"Przetwarzanie emocji",
			"Reakcja strachu",
			"Modulacja pamięci",
		],
		neurotransmitters: ["GABA", "Serotonin", "Norepinephrine"],
		supplementEffects: [],
		anatomicalInfo: {
			volume: 1.7,
			connections: ["Hippocampus", "Prefrontal Cortex", "Hypothalamus"],
			polishConnections: ["Hipokamp", "Kora przedczołowa", "Podwzgórze"],
			clinicalRelevance:
				"Central to emotional processing and fear conditioning",
			polishClinicalRelevance:
				"Centralne dla przetwarzania emocji i kondycjonowania strachu",
		},
	},
	{
		id: "anterior-cingulate",
		name: "Anterior Cingulate Cortex",
		polishName: "Przednia kora zakrętu obręczy",
		position: [0, 0.8, 0.5],
		color: "#06B6D4",
		size: 0.5,
		functions: ["Attention", "Emotion regulation", "Pain processing"],
		polishFunctions: ["Uwaga", "Regulacja emocji", "Przetwarzanie bólu"],
		neurotransmitters: ["Dopamine", "Serotonin", "Glutamate"],
		supplementEffects: [],
		anatomicalInfo: {
			volume: 12.3,
			connections: ["Prefrontal Cortex", "Insula", "Amygdala"],
			polishConnections: ["Kora przedczołowa", "Wyspa", "Ciało migdałowate"],
			clinicalRelevance:
				"Important for cognitive control and emotional regulation",
			polishClinicalRelevance:
				"Ważna dla kontroli poznawczej i regulacji emocjonalnej",
		},
	},
];

export const metadata: Metadata = {
	title: "Obszary Mózgu | Suplementor",
	description:
		"Poznaj anatomię i funkcje różnych regionów mózgu oraz wpływ suplementów",
};

export default function BrainRegionsPage() {
	return (
		<div className="container mx-auto space-y-8 px-4 py-8">
			{/* Breadcrumb Navigation */}
			<BreadcrumbNavigation />

			{/* Hero Section */}
			<div className="space-y-4 text-center">
				<div className="flex justify-center">
					<Brain className="h-16 w-16 text-primary" />
				</div>
				<h1 className="font-bold text-4xl md:text-5xl">Obszary Mózgu</h1>
				<p className="mx-auto max-w-2xl text-muted-foreground text-xl">
					Interaktywna wizualizacja anatomii mózgu i wpływu suplementów na
					poszczególne regiony
				</p>
			</div>

			{/* 3D Brain Model */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Sparkles className="h-5 w-5" />
						Interaktywny Model 3D
					</CardTitle>
					<CardDescription>
						Kliknij na region mózgu, aby zobaczyć szczegółowe informacje
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Interactive3DBrainModel />
				</CardContent>
			</Card>

			{/* Brain Regions Grid */}
			<div className="space-y-6">
				<div>
					<h2 className="mb-2 font-bold text-3xl">Regiony Mózgu</h2>
					<p className="text-muted-foreground">
						Szczegółowe informacje o funkcjach i wpływie suplementów na
						poszczególne obszary
					</p>
				</div>

				<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
					{brainRegions.map((region) => (
						<Card
							key={region.id}
							className="border-2 transition-shadow hover:shadow-lg"
						>
							<CardHeader>
								<div className="mb-2 flex items-center justify-between">
									<CardTitle className="text-xl">{region.polishName}</CardTitle>
									<div
										className="h-6 w-6 rounded-full border-2"
										style={{
											backgroundColor: region.color,
											borderColor: region.color,
										}}
									/>
								</div>
								<CardDescription className="text-xs">
									{region.name}
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								{/* Functions */}
								<div>
									<h4 className="mb-2 flex items-center gap-2 font-semibold text-muted-foreground text-sm">
										<Activity className="h-4 w-4" />
										Główne Funkcje
									</h4>
									<div className="flex flex-wrap gap-2">
										{region.polishFunctions.map((func, idx) => (
											<Badge key={idx} variant="secondary">
												{func}
											</Badge>
										))}
									</div>
								</div>

								{/* Neurotransmitters */}
								<div>
									<h4 className="mb-2 flex items-center gap-2 font-semibold text-muted-foreground text-sm">
										<Zap className="h-4 w-4" />
										Neuroprzekaźniki
									</h4>
									<div className="flex flex-wrap gap-1">
										{region.neurotransmitters.map((nt, idx) => (
											<Badge key={idx} variant="outline" className="text-xs">
												{nt}
											</Badge>
										))}
									</div>
								</div>

								{/* Supplement Effects */}
								{region.supplementEffects &&
									region.supplementEffects.length > 0 && (
										<div>
											<h4 className="mb-3 flex items-center gap-2 font-semibold text-muted-foreground text-sm">
												<BookOpen className="h-4 w-4" />
												Wpływ Suplementów
											</h4>
											<div className="space-y-2">
												{region.supplementEffects
													.slice(0, 3)
													.map((effect, idx) => (
														<div key={idx} className="rounded-lg bg-muted p-3">
															<div className="mb-1 flex items-center justify-between">
																<span className="font-medium text-sm">
																	{effect.polishSupplementName}
																</span>
																<Badge
																	variant={
																		effect.effectType === "ENHANCES"
																			? "default"
																			: "secondary"
																	}
																	className="text-xs"
																>
																	{effect.effectType === "ENHANCES"
																		? "Wzmacnia"
																		: effect.effectType === "PROTECTS"
																			? "Chroni"
																			: effect.effectType === "MODULATES"
																				? "Moduluje"
																				: "Wpływa"}
																</Badge>
															</div>
															<p className="text-muted-foreground text-xs">
																{effect.polishMechanism}
															</p>
														</div>
													))}
												{region.supplementEffects.length > 3 && (
													<p className="text-center text-muted-foreground text-xs">
														+{region.supplementEffects.length - 3} więcej
														suplementów
													</p>
												)}
											</div>
										</div>
									)}

								{/* Anatomical Info */}
								<div className="border-t pt-3">
									<div className="grid grid-cols-2 gap-2 text-xs">
										<div>
											<span className="text-muted-foreground">Objętość:</span>
											<span className="ml-1 font-medium">
												{region.anatomicalInfo.volume} cm³
											</span>
										</div>
										<div>
											<span className="text-muted-foreground">Połączenia:</span>
											<span className="ml-1 font-medium">
												{region.anatomicalInfo.connections.length}
											</span>
										</div>
									</div>
									<p className="mt-2 text-muted-foreground text-xs">
										{region.anatomicalInfo.polishClinicalRelevance}
									</p>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			</div>

			{/* Educational Tabs */}
			<Card>
				<CardHeader>
					<CardTitle>Poziomy Wiedzy</CardTitle>
					<CardDescription>
						Wybierz poziom szczegółowości wyjaśnień
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Tabs defaultValue="beginner">
						<TabsList className="grid w-full grid-cols-3">
							<TabsTrigger value="beginner">Początkujący</TabsTrigger>
							<TabsTrigger value="intermediate">
								Średniozaawansowany
							</TabsTrigger>
							<TabsTrigger value="expert">Ekspert</TabsTrigger>
						</TabsList>

						<TabsContent value="beginner" className="mt-4 space-y-4">
							<div className="rounded-lg border border-green-200 bg-green-50 p-4">
								<h4 className="mb-2 font-semibold text-green-800">
									Podstawy Anatomii Mózgu
								</h4>
								<p className="text-green-700 text-sm leading-relaxed">
									Mózg składa się z różnych obszarów, z których każdy odpowiada
									za inne funkcje. Kora przedczołowa pomaga nam planować i
									podejmować decyzje, hipokamp jest ważny dla pamięci, a ciało
									migdałowate kontroluje emocje. Suplementy mogą wspierać te
									obszary, dostarczając składników odżywczych potrzebnych do ich
									prawidłowego funkcjonowania.
								</p>
							</div>
						</TabsContent>

						<TabsContent value="intermediate" className="mt-4 space-y-4">
							<div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
								<h4 className="mb-2 font-semibold text-blue-800">
									Funkcjonalna Organizacja Mózgu
								</h4>
								<p className="text-blue-700 text-sm leading-relaxed">
									Mózg jest zorganizowany w hierarchiczne sieci funkcjonalne.
									Kora przedczołowa (PFC) integruje informacje z wielu źródeł
									dla funkcji wykonawczych. Hipokamp współpracuje z korą
									śródwęchową w konsolidacji pamięci. Ciało migdałowate moduluje
									odpowiedzi emocjonalne poprzez połączenia z korą i
									podwzgórzem. Suplementy wpływają na te sieci poprzez modulację
									neurotransmisji, neuroprotekcję i wsparcie metabolizmu
									energetycznego.
								</p>
							</div>
						</TabsContent>

						<TabsContent value="expert" className="mt-4 space-y-4">
							<div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
								<h4 className="mb-2 font-semibold text-purple-800">
									Neuroanatomia Molekularna
								</h4>
								<p className="text-purple-700 text-sm leading-relaxed">
									Funkcjonalna architektura mózgu opiera się na
									cytoarchitektonice korowej (warstwy I-VI), projekcjach
									glutaminergicznych i GABAergicznych oraz modulacji przez
									systemy monoaminergiczne. PFC wykazuje wysoką gęstość
									receptorów D1/D2 dopaminowych i 5-HT2A serotoninowych.
									Hipokamp charakteryzuje się plastycznością synaptyczną zależną
									od NMDA (LTP/LTD) i neurogenezy w zakręcie zębatym. Suplementy
									działają poprzez modulację kaskad sygnałowych (MAPK/ERK,
									PI3K/Akt), regulację ekspresji genów (CREB, BDNF) oraz wpływ
									na mitochondrialną bioenergetykę i homeostazę wapniową.
								</p>
							</div>
						</TabsContent>
					</Tabs>
				</CardContent>
			</Card>

			{/* Key Connections */}
			<Card>
				<CardHeader>
					<CardTitle>Kluczowe Połączenia</CardTitle>
					<CardDescription>
						Główne szlaki komunikacji między regionami mózgu
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						<div className="rounded-lg bg-muted p-4">
							<h4 className="mb-2 font-semibold">Szlak Korowo-Limbiczny</h4>
							<p className="text-muted-foreground text-sm">
								Łączy korę przedczołową z ciałem migdałowatym i hipokampem,
								umożliwiając regulację emocji i konsolidację pamięci
								emocjonalnej.
							</p>
						</div>
						<div className="rounded-lg bg-muted p-4">
							<h4 className="mb-2 font-semibold">Szlak Mezolimbiczny</h4>
							<p className="text-muted-foreground text-sm">
								Dopaminergiczny szlak z obszaru brzusznego nakrywki do jądra
								półleżącego, kluczowy dla motywacji i nagrody.
							</p>
						</div>
						<div className="rounded-lg bg-muted p-4">
							<h4 className="mb-2 font-semibold">Szlak Cholinergiczny</h4>
							<p className="text-muted-foreground text-sm">
								Z jądra podstawnego Meynerta do kory i hipokampu, istotny dla
								uwagi i procesów pamięciowych.
							</p>
						</div>
						<div className="rounded-lg bg-muted p-4">
							<h4 className="mb-2 font-semibold">Szlak Korowo-Prążkowiowy</h4>
							<p className="text-muted-foreground text-sm">
								Łączy korę z jądrami podstawy, kontroluje ruchy dowolne i
								uczenie się proceduralne.
							</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
