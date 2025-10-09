import type { Metadata } from "next";
import { Zap, Brain, Activity, TrendingUp, Sparkles, AlertCircle, ChevronRight, Clock, Users, BookOpen, Star } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { BreadcrumbNavigation } from "@/components/navigation/BreadcrumbNavigation";
import NeurotransmitterEducationModule from "@/components/education/NeurotransmitterEducationModule";

export const metadata: Metadata = {
	title: "Neuroprzekaźniki | Suplementor",
	description: "Poznaj systemy neuroprzekaźnikowe i ich wpływ na funkcje mózgu",
};

// Neurotransmitter data with Polish localization
const NEUROTRANSMITTERS = [
	{
		id: "dopamine",
		name: "Dopamine",
		polishName: "Dopamina",
		icon: Sparkles,
		color: "text-purple-600",
		bgColor: "bg-purple-50",
		borderColor: "border-purple-200",
		primaryFunctions: [
			"Motywacja i nagroda",
			"Kontrola ruchowa",
			"Uwaga i koncentracja",
			"Regulacja nastroju",
		],
		relatedSupplements: [
			{ name: "L-Tyrosine", polishName: "L-Tyrozyna", effect: "Prekursor dopaminy" },
			{ name: "Mucuna Pruriens", polishName: "Mucuna Pruriens", effect: "Źródło L-DOPA" },
			{ name: "Rhodiola Rosea", polishName: "Różeniec Górski", effect: "Modulacja receptorów dopaminowych" },
		],
		pathways: "Szlak mezolimbiczny, mezokortykalny, nigrostriatalny, tuberoinfundibularny",
		disorders: ["Choroba Parkinsona", "ADHD", "Depresja", "Uzależnienia"],
	},
	{
		id: "serotonin",
		name: "Serotonin",
		polishName: "Serotonina",
		icon: TrendingUp,
		color: "text-blue-600",
		bgColor: "bg-blue-50",
		borderColor: "border-blue-200",
		primaryFunctions: [
			"Regulacja nastroju",
			"Cykl sen-czuwanie",
			"Apetyt i trawienie",
			"Termoregulacja",
		],
		relatedSupplements: [
			{ name: "5-HTP", polishName: "5-HTP", effect: "Prekursor serotoniny" },
			{ name: "Tryptophan", polishName: "Tryptofan", effect: "Aminokwas prekursorowy" },
			{ name: "St. John's Wort", polishName: "Dziurawiec", effect: "Inhibitor wychwytu zwrotnego" },
		],
		pathways: "Jądra szwu, projekcje do kory, hipokampu, ciała migdałowatego",
		disorders: ["Depresja", "Lęk", "Bezsenność", "Zaburzenia obsesyjno-kompulsywne"],
	},
	{
		id: "gaba",
		name: "GABA",
		polishName: "GABA (Kwas γ-aminomasłowy)",
		icon: Activity,
		color: "text-green-600",
		bgColor: "bg-green-50",
		borderColor: "border-green-200",
		primaryFunctions: [
			"Główny neuroprzekaźnik hamujący",
			"Redukcja lęku",
			"Regulacja snu",
			"Kontrola napięcia mięśniowego",
		],
		relatedSupplements: [
			{ name: "L-Theanine", polishName: "L-Teanina", effect: "Modulacja receptorów GABA" },
			{ name: "Magnesium", polishName: "Magnez", effect: "Kofaktor syntezy GABA" },
			{ name: "Ashwagandha", polishName: "Ashwagandha", effect: "Agonista receptorów GABA-A" },
		],
		pathways: "Interneurony korowe, móżdżek, jądra podstawy, rdzeń kręgowy",
		disorders: ["Zaburzenia lękowe", "Bezsenność", "Padaczka", "Napady paniki"],
	},
	{
		id: "glutamate",
		name: "Glutamate",
		polishName: "Glutaminian",
		icon: Zap,
		color: "text-red-600",
		bgColor: "bg-red-50",
		borderColor: "border-red-200",
		primaryFunctions: [
			"Główny neuroprzekaźnik pobudzający",
			"Uczenie się i pamięć",
			"Plastyczność synaptyczna",
			"Rozwój mózgu",
		],
		relatedSupplements: [
			{ name: "Magnesium L-Threonate", polishName: "L-Treonian Magnezu", effect: "Modulacja receptorów NMDA" },
			{ name: "Lion's Mane", polishName: "Soplówka Jeżowata", effect: "Neuroprotekcja przed ekscytotoksycznością" },
			{ name: "NAC", polishName: "N-acetylocysteina", effect: "Modulacja uwalniania glutaminianu" },
		],
		pathways: "Kora mózgowa, hipokamp, móżdżek, drogi piramidowe",
		disorders: ["Choroba Alzheimera", "Udar mózgu", "Padaczka", "Schizofrenia"],
	},
	{
		id: "acetylcholine",
		name: "Acetylcholine",
		polishName: "Acetylocholina",
		icon: Brain,
		color: "text-indigo-600",
		bgColor: "bg-indigo-50",
		borderColor: "border-indigo-200",
		primaryFunctions: [
			"Pamięć i uczenie się",
			"Uwaga i czujność",
			"Kontrola mięśni",
			"Regulacja autonomiczna",
		],
		relatedSupplements: [
			{ name: "Alpha-GPC", polishName: "Alpha-GPC", effect: "Prekursor acetylocholiny" },
			{ name: "CDP-Choline", polishName: "CDP-Cholina", effect: "Źródło choliny" },
			{ name: "Huperzine A", polishName: "Huperzyna A", effect: "Inhibitor acetylcholinesterazy" },
		],
		pathways: "Jądro podstawne Meynerta, pień mózgu, układ parasympatyczny",
		disorders: ["Choroba Alzheimera", "Demencja", "Myasthenia gravis", "Zaburzenia pamięci"],
	},
	{
		id: "norepinephrine",
		name: "Norepinephrine",
		polishName: "Noradrenalina",
		icon: AlertCircle,
		color: "text-orange-600",
		bgColor: "bg-orange-50",
		borderColor: "border-orange-200",
		primaryFunctions: [
			"Czujność i uwaga",
			"Reakcja stresowa",
			"Regulacja nastroju",
			"Kontrola ciśnienia krwi",
		],
		relatedSupplements: [
			{ name: "L-Tyrosine", polishName: "L-Tyrozyna", effect: "Prekursor noradrenaliny" },
			{ name: "Rhodiola Rosea", polishName: "Różeniec Górski", effect: "Modulacja uwalniania noradrenaliny" },
			{ name: "Caffeine", polishName: "Kofeina", effect: "Zwiększenie uwalniania noradrenaliny" },
		],
		pathways: "Locus coeruleus, projekcje do kory, hipokampu, móżdżku",
		disorders: ["Depresja", "ADHD", "PTSD", "Zaburzenia lękowe"],
	},
];

export default function NeurotransmittersPage() {
	return (
		<div className="container mx-auto px-4 py-8 space-y-8">
			{/* Breadcrumb Navigation */}
			<BreadcrumbNavigation />

			{/* Hero Section */}
			<div className="text-center space-y-4">
				<div className="flex justify-center">
					<Zap className="h-16 w-16 text-primary" />
				</div>
				<h1 className="text-4xl md:text-5xl font-bold">Neuroprzekaźniki</h1>
				<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
					Poznaj chemię mózgu i systemy neuroprzekaźnikowe odpowiedzialne za funkcje poznawcze i emocjonalne
				</p>
			</div>

			{/* Introduction */}
			<Card>
				<CardHeader>
					<CardTitle>Czym są Neuroprzekaźniki?</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<p className="text-sm leading-relaxed">
						Neuroprzekaźniki to chemiczne posłańcy, które przekazują sygnały między neuronami w mózgu. 
						Są kluczowe dla wszystkich funkcji mózgu - od myślenia i uczenia się, po regulację nastroju i kontrolę ruchową.
					</p>
					<p className="text-sm leading-relaxed">
						Każdy neuroprzekaźnik ma swoje unikalne funkcje i wpływa na różne aspekty naszego zdrowia psychicznego i fizycznego. 
						Suplementy mogą wspierać produkcję, uwalnianie lub działanie neuroprzekaźników, pomagając optymalizować funkcje mózgu.
					</p>
				</CardContent>
			</Card>

			{/* Neurotransmitters Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{NEUROTRANSMITTERS.map((nt) => {
					const Icon = nt.icon;
					return (
						<Card key={nt.id} className={`border-2 ${nt.borderColor} hover:shadow-lg transition-all group`}>
							<CardHeader className={`${nt.bgColor} group-hover:bg-opacity-70 transition-colors`}>
								<div className="flex items-center gap-3 mb-2">
									<div className={`p-2 rounded-lg bg-white/50 group-hover:scale-110 transition-transform`}>
										<Icon className={`h-6 w-6 ${nt.color}`} />
									</div>
									<div className="flex-1">
										<CardTitle className="text-xl">{nt.polishName}</CardTitle>
										<CardDescription className="text-xs">{nt.name}</CardDescription>
									</div>
								</div>
							</CardHeader>
							<CardContent className="pt-6 space-y-4">
								{/* Primary Functions */}
								<div>
									<Accordion type="single" collapsible className="w-full">
										<AccordionItem value={`${nt.id}-functions`} className="border-muted">
											<AccordionTrigger className="text-left hover:no-underline">
												<div className="flex items-center gap-2">
													<Star className="h-4 w-4 text-muted-foreground" />
													<span className="font-semibold text-sm text-muted-foreground">
														Główne Funkcje ({nt.primaryFunctions.length})
													</span>
												</div>
											</AccordionTrigger>
											<AccordionContent>
												<div className="space-y-3 mt-2">
													<div className="flex flex-wrap gap-2">
														{nt.primaryFunctions.map((func, idx) => (
															<Badge key={idx} variant="secondary" className="text-xs">
																{func}
															</Badge>
														))}
													</div>
												</div>
											</AccordionContent>
										</AccordionItem>
									</Accordion>
								</div>

								<Separator />

								{/* Pathways */}
								<div>
									<Accordion type="single" collapsible className="w-full">
										<AccordionItem value={`${nt.id}-pathways`} className="border-muted">
											<AccordionTrigger className="text-left hover:no-underline">
												<div className="flex items-center gap-2">
													<Brain className="h-4 w-4 text-muted-foreground" />
													<span className="font-semibold text-sm text-muted-foreground">
														Szlaki Nerwowe
													</span>
												</div>
											</AccordionTrigger>
											<AccordionContent>
												<div className="mt-2">
													<p className="text-xs text-muted-foreground leading-relaxed">
														{nt.pathways}
													</p>
												</div>
											</AccordionContent>
										</AccordionItem>
									</Accordion>
								</div>

								<Separator />

								{/* Related Supplements */}
								<div>
									<Accordion type="single" collapsible className="w-full">
										<AccordionItem value={`${nt.id}-supplements`} className="border-muted">
											<AccordionTrigger className="text-left hover:no-underline">
												<div className="flex items-center gap-2">
													<Users className="h-4 w-4 text-muted-foreground" />
													<span className="font-semibold text-sm text-muted-foreground">
														Powiązane Suplementy ({nt.relatedSupplements.length})
													</span>
												</div>
											</AccordionTrigger>
											<AccordionContent>
												<div className="space-y-3 mt-2">
													{nt.relatedSupplements.map((supp, idx) => (
														<div key={idx} className="bg-muted/50 p-3 rounded-lg border border-muted/70 hover:bg-muted transition-colors">
															<div className="flex items-start justify-between">
																<div className="flex-1">
																	<div className="font-medium text-sm mb-1">
																		{supp.polishName}
																	</div>
																	<div className="text-xs text-muted-foreground">
																		{supp.effect}
																	</div>
																</div>
																<Badge variant="outline" className="text-xs ml-2">
																	{nt.polishName.split(' ')[0]}
																</Badge>
															</div>
														</div>
													))}
												</div>
											</AccordionContent>
										</AccordionItem>
									</Accordion>
								</div>

								<Separator />

								{/* Associated Disorders */}
								<div>
									<Accordion type="single" collapsible className="w-full">
										<AccordionItem value={`${nt.id}-disorders`} className="border-muted">
											<AccordionTrigger className="text-left hover:no-underline">
												<div className="flex items-center gap-2">
													<AlertCircle className="h-4 w-4 text-muted-foreground" />
													<span className="font-semibold text-sm text-muted-foreground">
														Powiązane Zaburzenia ({nt.disorders.length})
													</span>
												</div>
											</AccordionTrigger>
											<AccordionContent>
												<div className="mt-2">
													<div className="flex flex-wrap gap-1">
														{nt.disorders.map((disorder, idx) => (
															<Badge key={idx} variant="outline" className="text-xs">
																{disorder}
															</Badge>
														))}
													</div>
												</div>
											</AccordionContent>
										</AccordionItem>
									</Accordion>
								</div>

								{/* Quick Stats */}
								<div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
									<div className="flex items-center gap-1">
										<Users className="h-3 w-3" />
										<span>{nt.relatedSupplements.length} suplementów</span>
									</div>
									<div className="flex items-center gap-1">
										<Clock className="h-3 w-3" />
										<span>3-5 min. czytania</span>
									</div>
								</div>
							</CardContent>
						</Card>
					);
				})}
			</div>

			{/* Balance Information */}
			<Card className="border-2 border-primary/20">
				<CardHeader className="bg-primary/5">
					<CardTitle className="flex items-center gap-2">
						<Brain className="h-5 w-5 text-primary" />
						Równowaga Neuroprzekaźników
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<Accordion type="multiple" className="w-full">
						<AccordionItem value="balance-intro" className="border-muted">
							<AccordionTrigger className="text-left hover:no-underline">
								<div className="flex items-center gap-2">
									<BookOpen className="h-4 w-4 text-primary" />
									<span className="font-semibold">Podstawy Równowagi</span>
								</div>
							</AccordionTrigger>
							<AccordionContent>
								<div className="space-y-3">
									<p className="text-sm leading-relaxed">
										Zdrowie mózgu zależy od delikatnej równowagi między różnymi systemami neuroprzekaźnikowymi.
										Zbyt wysoki lub zbyt niski poziom któregokolwiek neuroprzekaźnika może prowadzić do problemów zdrowotnych.
									</p>
									<div className="grid grid-cols-2 gap-2">
										{[
											"Homeostaza",
											"Regulacja",
											"Adaptacja",
											"Neuroplastyczność"
										].map((concept, index) => (
											<Badge key={index} variant="secondary" className="text-xs justify-center">
												{concept}
											</Badge>
										))}
									</div>
								</div>
							</AccordionContent>
						</AccordionItem>

						<AccordionItem value="excitation-inhibition" className="border-muted">
							<AccordionTrigger className="text-left hover:no-underline">
								<div className="flex items-center gap-2">
									<Activity className="h-4 w-4 text-primary" />
									<span className="font-semibold">Równowaga Pobudzenie-Hamowanie</span>
								</div>
							</AccordionTrigger>
							<AccordionContent>
								<div className="space-y-3">
									<div className="bg-green-50 p-4 rounded-lg border border-green-200">
										<h4 className="font-semibold mb-2 text-green-800 flex items-center gap-2">
											<Zap className="h-4 w-4" />
											Glutaminian ↔ GABA
										</h4>
										<p className="text-sm text-green-700 leading-relaxed">
											Glutaminian (pobudzający) i GABA (hamujący) muszą być w równowadze dla optymalnej funkcji mózgu.
										</p>
										<div className="mt-2 flex gap-2">
											<Badge variant="outline" className="text-green-700 text-xs">Uczenie się</Badge>
											<Badge variant="outline" className="text-green-700 text-xs">Spokój</Badge>
											<Badge variant="outline" className="text-green-700 text-xs">Fokus</Badge>
										</div>
									</div>
								</div>
							</AccordionContent>
						</AccordionItem>

						<AccordionItem value="mood-modulation" className="border-muted">
							<AccordionTrigger className="text-left hover:no-underline">
								<div className="flex items-center gap-2">
									<TrendingUp className="h-4 w-4 text-primary" />
									<span className="font-semibold">Modulacja Nastroju</span>
								</div>
							</AccordionTrigger>
							<AccordionContent>
								<div className="space-y-3">
									<div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
										<h4 className="font-semibold mb-2 text-blue-800 flex items-center gap-2">
											<Sparkles className="h-4 w-4" />
											Serotonina • Dopamina • Noradrenalina
										</h4>
										<p className="text-sm text-blue-700 leading-relaxed">
											Serotonina, dopamina i noradrenalina współpracują w regulacji nastroju i emocji.
										</p>
										<div className="mt-2 flex gap-2">
											<Badge variant="outline" className="text-blue-700 text-xs">Motywacja</Badge>
											<Badge variant="outline" className="text-blue-700 text-xs">Radość</Badge>
											<Badge variant="outline" className="text-blue-700 text-xs">Energia</Badge>
										</div>
									</div>
								</div>
							</AccordionContent>
						</AccordionItem>

						<AccordionItem value="imbalance-symptoms" className="border-muted">
							<AccordionTrigger className="text-left hover:no-underline">
								<div className="flex items-center gap-2">
									<AlertCircle className="h-4 w-4 text-primary" />
									<span className="font-semibold">Objawy Nierównowagi</span>
								</div>
							</AccordionTrigger>
							<AccordionContent>
								<div className="space-y-3">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
										<div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
											<h5 className="font-medium text-sm text-orange-800 mb-1">Nadmiar Pobudzenia</h5>
											<ul className="text-xs text-orange-700 space-y-1">
												<li>• Lęk i niepokój</li>
												<li>• Problemy ze snem</li>
												<li>• Rozdrażnienie</li>
											</ul>
										</div>
										<div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
											<h5 className="font-medium text-sm text-purple-800 mb-1">Nadmiar Hamowania</h5>
											<ul className="text-xs text-purple-700 space-y-1">
												<li>• Apatia</li>
												<li>• Spowolnienie</li>
												<li>• Problemy z koncentracją</li>
											</ul>
										</div>
									</div>
								</div>
							</AccordionContent>
						</AccordionItem>
					</Accordion>
				</CardContent>
			</Card>

			{/* Advanced Module */}
			<div className="space-y-4">
				<h2 className="text-2xl font-bold">Szczegółowa Analiza</h2>
				<p className="text-muted-foreground">
					Poniżej znajdziesz zaawansowany moduł edukacyjny z interaktywnymi zakładkami i szczegółowymi informacjami o systemach neuroprzekaźnikowych.
				</p>
				<NeurotransmitterEducationModule />
			</div>
		</div>
	);
}

