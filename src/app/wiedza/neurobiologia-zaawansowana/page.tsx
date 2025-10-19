/**
 * Advanced Neurobiology Education Page
 * Comprehensive cellular, molecular, and developmental neurobiology content
 */

"use client";

import { HormoneIcon } from "@/components/ui/custom-icons";
import {
	Activity,
	AlertCircle,
	BookOpen,
	Brain,
	CheckCircle,
	ChevronRight,
	Clock,
	Dna,
	Info,
	Layers,
	Microscope,
	Pause,
	Play,
	RotateCcw,
	Shield,
	Star,
	Target,
	Timer,
	TrendingUp,
	Users,
	Zap,
	ZoomIn,
	ZoomOut,
} from "lucide-react";
import type { Metadata } from "next";
import { useState } from "react";

import { BreadcrumbNavigation } from "@/components/navigation/BreadcrumbNavigation";
import { CellularNeuroscienceModule } from "@/components/neurobiology/CellularNeuroscienceModule";
import { DevelopmentalNeurobiologyModule } from "@/components/neurobiology/DevelopmentalNeurobiologyModule";
import { MolecularNeurobiologyModule } from "@/components/neurobiology/MolecularNeurobiologyModule";
import { NeuroendocrinologyModule } from "@/components/neurobiology/NeuroendocrinologyModule";
import { NeuroimmunologyModule } from "@/components/neurobiology/NeuroimmunologyModule";
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
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Neurobiology module sections
const NEUROBIOLOGY_SECTIONS = [
	{
		id: "cellular",
		title: "Neuroscience Komórkowa",
		polishTitle: "Neuroscience Komórkowa",
		description:
			"Struktura neuronów, transmisja synaptyczna i dynamika kanałów jonowych",
		icon: Brain,
		color: "text-blue-600",
		bgColor: "bg-blue-50",
		borderColor: "border-blue-200",
		estimatedTime: "25 min",
		difficulty: "Zaawansowany",
		topics: [
			"Struktura i funkcja neuronów",
			"Procesy transmisji synaptycznej",
			"Dynamika kanałów jonowych",
			"Funkcje komórek glejowych",
			"Mechanizmy neurodegeneracji",
		],
	},
	{
		id: "molecular",
		title: "Neuroscience Molekularna",
		polishTitle: "Neuroscience Molekularna",
		description: "Receptory, kaskady sygnałowe i regulacja ekspresji genów",
		icon: Dna,
		color: "text-purple-600",
		bgColor: "bg-purple-50",
		borderColor: "border-purple-200",
		estimatedTime: "30 min",
		difficulty: "Zaawansowany",
		topics: [
			"Farmakologia receptorów",
			"Kaskady drugich przekaźników",
			"Regulacja ekspresji genów",
			"Synteza i transport białek",
			"Czynniki neurotroficzne",
		],
	},
	{
		id: "developmental",
		title: "Neuroscience Rozwojowa",
		polishTitle: "Neuroscience Rozwojowa",
		description: "Rozwój mózgu, plastyczność i okresy krytyczne",
		icon: Timer,
		color: "text-green-600",
		bgColor: "bg-green-50",
		borderColor: "border-green-200",
		estimatedTime: "20 min",
		difficulty: "Średniozaawansowany",
		topics: [
			"Etapy rozwoju embrionalnego",
			"Formowanie cewy nerwowej",
			"Okresy krytyczne",
			"Synaptogeneza",
			"Plastyczność zależna od doświadczenia",
		],
	},
	{
		id: "neuroendocrinology",
		title: "Neuroendokrynologia",
		polishTitle: "Neuroendokrynologia",
		description: "Interakcje hormonów z mózgiem i układy regulacji",
		icon: HormoneIcon,
		color: "text-orange-600",
		bgColor: "bg-orange-50",
		borderColor: "border-orange-200",
		estimatedTime: "18 min",
		difficulty: "Średniozaawansowany",
		topics: [
			"Pętle sprzężenia zwrotnego",
			"Regulacja osi HPA",
			"Hormony reprodukcyjne",
			"Hormony tarczycy",
			"Hormony metaboliczne",
		],
	},
	{
		id: "neuroimmunology",
		title: "Neuroimmunologia",
		polishTitle: "Neuroimmunologia",
		description: "Interakcje mózg-układ odpornościowy i neurozapalenie",
		icon: Shield,
		color: "text-red-600",
		bgColor: "bg-red-50",
		borderColor: "border-red-200",
		estimatedTime: "22 min",
		difficulty: "Zaawansowany",
		topics: [
			"Mechanizmy crosstalk mózg-układ odpornościowy",
			"Neurozapalenie i jego resolution",
			"Stany aktywacji mikrogleju",
			"Efekty cytokin na neurony",
			"Zaburzenia autoimmunologiczne",
		],
	},
];

export default function AdvancedNeurobiologyPage() {
	const [activeSection, setActiveSection] = useState("cellular");
	const [activeVisualization, setActiveVisualization] = useState<string | null>(
		null,
	);
	const [isPlaying, setIsPlaying] = useState(false);
	const [progress, setProgress] = useState(0);

	const currentSection = NEUROBIOLOGY_SECTIONS.find(
		(s) => s.id === activeSection,
	);

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<header className="border-b bg-white">
				<div className="container mx-auto px-4 py-6">
					<BreadcrumbNavigation />
					<div className="mt-4 flex items-center justify-between">
						<div className="flex items-center gap-4">
							<div className="rounded-full bg-blue-100 p-3">
								<Brain className="h-8 w-8 text-blue-600" />
							</div>
							<div>
								<h1 className="font-bold text-3xl text-gray-900">
									Zaawansowana Neurobiologia
								</h1>
								<p className="mt-1 text-gray-600">
									Kompleksowe studium neurologii komórkowej, molekularnej i
									rozwojowej
								</p>
							</div>
						</div>
						<div className="flex items-center gap-4">
							<Card className="px-4 py-2">
								<div className="flex items-center gap-2 text-sm">
									<Clock className="h-4 w-4" />
									<span>Całkowity czas: ~2h</span>
								</div>
							</Card>
							<Button variant="outline">
								<BookOpen className="mr-2 h-4 w-4" />
								Materiały
							</Button>
						</div>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="container mx-auto px-4 py-8">
				<div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
					{/* Navigation Sidebar */}
					<div className="lg:col-span-1">
						<Card className="sticky top-8">
							<CardHeader>
								<CardTitle className="text-lg">Moduły Neurobiologii</CardTitle>
							</CardHeader>
							<CardContent className="space-y-2">
								{NEUROBIOLOGY_SECTIONS.map((section) => {
									const Icon = section.icon;
									return (
										<Button
											key={section.id}
											variant={
												activeSection === section.id ? "default" : "ghost"
											}
											className="h-auto w-full justify-start p-4"
											onClick={() => setActiveSection(section.id)}
										>
											<div className="flex items-start gap-3 text-left">
												<Icon
													className={`mt-1 h-5 w-5 ${activeSection === section.id ? "text-white" : section.color}`}
												/>
												<div className="flex-1">
													<div className="font-medium text-sm">
														{section.polishTitle}
													</div>
													<div className="mt-1 text-muted-foreground text-xs">
														{section.estimatedTime}
													</div>
												</div>
												<ChevronRight className="h-4 w-4" />
											</div>
										</Button>
									);
								})}
							</CardContent>
						</Card>

						{/* Progress Card */}
						<Card className="mt-6">
							<CardHeader>
								<CardTitle className="text-base">Postęp nauki</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-3">
									<div className="flex items-center justify-between text-sm">
										<span>Ukończono</span>
										<span className="font-medium">{progress}%</span>
									</div>
									<Progress value={progress} className="h-2" />
									<div className="grid grid-cols-2 gap-2 text-xs">
										<div className="flex items-center gap-1">
											<CheckCircle className="h-3 w-3 text-green-600" />
											<span>0/5 modułów</span>
										</div>
										<div className="flex items-center gap-1">
											<Clock className="h-3 w-3 text-blue-600" />
											<span>0 min</span>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Main Content Area */}
					<div className="lg:col-span-3">
						{/* Section Overview */}
						{currentSection && (
							<Card className="mb-6">
								<CardHeader
									className={`${currentSection.bgColor} ${currentSection.borderColor} border-2`}
								>
									<div className="flex items-center gap-4">
										<div className={"rounded-full bg-white p-3"}>
											<currentSection.icon
												className={`h-6 w-6 ${currentSection.color}`}
											/>
										</div>
										<div className="flex-1">
											<CardTitle className="text-2xl">
												{currentSection.polishTitle}
											</CardTitle>
											<CardDescription className="mt-1 text-base">
												{currentSection.description}
											</CardDescription>
										</div>
										<div className="text-right">
											<Badge variant="secondary" className="mb-2">
												{currentSection.estimatedTime}
											</Badge>
											<Badge variant="outline">
												{currentSection.difficulty}
											</Badge>
										</div>
									</div>
								</CardHeader>
								<CardContent className="pt-6">
									<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
										{/* Topics */}
										<div>
											<h3 className="mb-3 font-medium">Tematy w module</h3>
											<div className="space-y-2">
												{currentSection.topics.map((topic, index) => (
													<div key={index} className="flex items-center gap-2">
														<div className="h-2 w-2 rounded-full bg-blue-600" />
														<span className="text-sm">{topic}</span>
													</div>
												))}
											</div>
										</div>

										{/* Learning Objectives */}
										<div>
											<h3 className="mb-3 font-medium">Cele nauki</h3>
											<div className="space-y-2 text-gray-600 text-sm">
												<p>• Zrozumienie mechanizmów na poziomie komórkowym</p>
												<p>• Identyfikacja szlaków sygnałowych</p>
												<p>• Rozpoznanie procesów patologicznych</p>
												<p>• Zastosowanie wiedzy w praktyce klinicznej</p>
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						)}

						{/* Interactive Content Tabs */}
						<Tabs defaultValue="theory" className="space-y-6">
							<TabsList className="grid w-full grid-cols-4">
								<TabsTrigger value="theory" className="flex items-center gap-2">
									<BookOpen className="h-4 w-4" />
									Teoria
								</TabsTrigger>
								<TabsTrigger
									value="visualization"
									className="flex items-center gap-2"
								>
									<Activity className="h-4 w-4" />
									Wizualizacja
								</TabsTrigger>
								<TabsTrigger
									value="clinical"
									className="flex items-center gap-2"
								>
									<Users className="h-4 w-4" />
									Klinika
								</TabsTrigger>
								<TabsTrigger value="quiz" className="flex items-center gap-2">
									<Target className="h-4 w-4" />
									Test
								</TabsTrigger>
							</TabsList>

							{/* Theory Tab */}
							<TabsContent value="theory" className="space-y-6">
								{activeSection === "cellular" && <CellularNeuroscienceModule />}
								{activeSection === "molecular" && (
									<MolecularNeurobiologyModule />
								)}
								{activeSection === "developmental" && (
									<DevelopmentalNeurobiologyModule />
								)}
								{activeSection === "neuroendocrinology" && (
									<NeuroendocrinologyModule />
								)}
								{activeSection === "neuroimmunology" && (
									<NeuroimmunologyModule />
								)}
							</TabsContent>

							{/* Visualization Tab */}
							<TabsContent value="visualization" className="space-y-6">
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center gap-2">
											<Activity className="h-5 w-5" />
											Wizualizacje interaktywne
										</CardTitle>
										<CardDescription>
											Trójwymiarowe modele i animacje procesów
											neurobiologicznych
										</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
											{/* Neuron 3D Model Placeholder */}
											<Card className="border-2 border-dashed">
												<CardContent className="flex flex-col items-center justify-center py-12">
													<Brain className="mb-4 h-16 w-16 text-gray-400" />
													<h3 className="mb-2 font-medium">Model 3D Neuronu</h3>
													<p className="mb-4 text-center text-gray-600 text-sm">
														Interaktywna wizualizacja struktury neuronu
													</p>
													<Button>
														<Play className="mr-2 h-4 w-4" />
														Rozpocznij animację
													</Button>
												</CardContent>
											</Card>

											{/* Synaptic Transmission Animation */}
											<Card className="border-2 border-dashed">
												<CardContent className="flex flex-col items-center justify-center py-12">
													<Zap className="mb-4 h-16 w-16 text-gray-400" />
													<h3 className="mb-2 font-medium">
														Transmisja Synaptyczna
													</h3>
													<p className="mb-4 text-center text-gray-600 text-sm">
														Animacja procesu neurotransmisji
													</p>
													<Button variant="outline">
														<Play className="mr-2 h-4 w-4" />
														Odtwórz sekwencję
													</Button>
												</CardContent>
											</Card>
										</div>
									</CardContent>
								</Card>
							</TabsContent>

							{/* Clinical Tab */}
							<TabsContent value="clinical" className="space-y-6">
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center gap-2">
											<Users className="h-5 w-5" />
											Korelacje kliniczne
										</CardTitle>
										<CardDescription>
											Zastosowanie wiedzy neurobiologicznej w praktyce medycznej
										</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="space-y-6">
											{/* Clinical Cases */}
											<div>
												<h3 className="mb-4 font-medium">
													Przypadki kliniczne
												</h3>
												<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
													<Card className="border-l-4 border-l-blue-600">
														<CardContent className="pt-4">
															<h4 className="mb-2 font-medium">
																Zaburzenia neurodegeneracyjne
															</h4>
															<p className="mb-3 text-gray-600 text-sm">
																Analiza mechanizmów chorobowych w chorobach
																Alzheimera i Parkinsona
															</p>
															<Badge variant="outline">Neurologia</Badge>
														</CardContent>
													</Card>
													<Card className="border-l-4 border-l-green-600">
														<CardContent className="pt-4">
															<h4 className="mb-2 font-medium">
																Zaburzenia rozwojowe
															</h4>
															<p className="mb-3 text-gray-600 text-sm">
																Okna terapeutyczne w zaburzeniach ze spektrum
																autyzmu
															</p>
															<Badge variant="outline">Pediatria</Badge>
														</CardContent>
													</Card>
												</div>
											</div>

											{/* Treatment Approaches */}
											<div>
												<h3 className="mb-4 font-medium">
													Podejścia terapeutyczne
												</h3>
												<div className="space-y-3">
													<div className="rounded-lg bg-green-50 p-4">
														<h4 className="mb-2 font-medium text-green-800">
															Terapie oparte na mechanizmach
														</h4>
														<p className="text-green-700 text-sm">
															Wykorzystanie wiedzy o szlakach sygnałowych do
															projektowania terapii celowanych
														</p>
													</div>
													<div className="rounded-lg bg-blue-50 p-4">
														<h4 className="mb-2 font-medium text-blue-800">
															Interwencje neuroprotekcyjne
														</h4>
														<p className="text-blue-700 text-sm">
															Strategie ochrony neuronów w chorobach
															neurodegeneracyjnych
														</p>
													</div>
												</div>
											</div>
										</div>
									</CardContent>
								</Card>
							</TabsContent>

							{/* Quiz Tab */}
							<TabsContent value="quiz" className="space-y-6">
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center gap-2">
											<Target className="h-5 w-5" />
											Test wiedzy
										</CardTitle>
										<CardDescription>
											Sprawdź swoją wiedzę z{" "}
											{currentSection?.polishTitle.toLowerCase()}
										</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="py-12 text-center">
											<Target className="mx-auto mb-4 h-16 w-16 text-gray-400" />
											<h3 className="mb-2 font-medium">
												Test zostanie zaimplementowany
											</h3>
											<p className="mb-4 text-gray-600">
												Interaktywny quiz z pytaniami jednokrotnego i
												wielokrotnego wyboru
											</p>
											<Button>Rozpocznij test</Button>
										</div>
									</CardContent>
								</Card>
							</TabsContent>
						</Tabs>
					</div>
				</div>
			</main>
		</div>
	);
}
