"use client";

import { BreadcrumbNavigation } from "@/components/navigation/BreadcrumbNavigation";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Activity,
	BookOpen,
	ChevronDown,
	ChevronRight,
	Clock,
	Lock,
	Star,
	TrendingUp,
	Users,
	Wrench,
	Zap,
} from "lucide-react";
import { useState } from "react";

type DifficultyLevel = "beginner" | "intermediate" | "expert";

// Mechanism categories with Polish descriptions
const MECHANISMS = [
	{
		id: "receptor-binding",
		name: "Wiązanie z Receptorami",
		icon: Lock,
		color: "text-blue-600",
		bgColor: "bg-blue-50",
		borderColor: "border-blue-200",
		descriptions: {
			beginner:
				"Suplementy łączą się z receptorami w komórkach, jak klucz do zamka, aby wywołać określone efekty.",
			intermediate:
				"Suplementy działają jako ligandy, wiążąc się z receptorami błonowymi lub jądrowymi, inicjując kaskady sygnałowe poprzez zmiany konformacyjne białek receptorowych.",
			expert:
				"Mechanizm obejmuje stereospecyficzne wiązanie ligand-receptor, aktywację białek G lub kinaz receptorowych, fosforylację kaskad MAPK/ERK oraz modulację transkrypcji genów poprzez czynniki takie jak CREB i NF-κB.",
		},
		supplements: [
			{
				name: "Ashwagandha",
				polishName: "Ashwagandha",
				mechanism: "Modulacja receptorów GABA-A",
			},
			{
				name: "Rhodiola Rosea",
				polishName: "Różeniec Górski",
				mechanism: "Wiązanie z receptorami serotoninowymi",
			},
			{
				name: "L-Theanine",
				polishName: "L-Teanina",
				mechanism: "Agonista receptorów NMDA",
			},
		],
	},
	{
		id: "enzyme-modulation",
		name: "Modulacja Enzymów",
		icon: Wrench,
		color: "text-green-600",
		bgColor: "bg-green-50",
		borderColor: "border-green-200",
		descriptions: {
			beginner:
				"Suplementy mogą przyspieszać lub spowalniać działanie enzymów, które kontrolują reakcje chemiczne w organizmie.",
			intermediate:
				"Suplementy działają jako inhibitory lub aktywatory enzymatyczne, wpływając na szybkość reakcji metabolicznych poprzez kompetycyjne lub allosteryczne wiązanie z miejscami aktywnymi enzymów.",
			expert:
				"Mechanizm obejmuje inhibicję kompetycyjną (Ki), niekompetycyjną lub mieszaną, modulację allosteryczną, wpływ na kofaktory enzymatyczne oraz regulację ekspresji genów kodujących enzymy poprzez szlaki AMPK, mTOR i SIRT1.",
		},
		supplements: [
			{
				name: "Curcumin",
				polishName: "Kurkumina",
				mechanism: "Inhibicja COX-2 i LOX",
			},
			{
				name: "Resveratrol",
				polishName: "Resweratrol",
				mechanism: "Aktywacja SIRT1",
			},
			{
				name: "Quercetin",
				polishName: "Kwercetyna",
				mechanism: "Inhibicja MAO",
			},
		],
	},
	{
		id: "neurotransmitter-modulation",
		name: "Modulacja Neuroprzekaźników",
		icon: Zap,
		color: "text-purple-600",
		bgColor: "bg-purple-50",
		borderColor: "border-purple-200",
		descriptions: {
			beginner:
				"Suplementy wpływają na chemikalia w mózgu (neuroprzekaźniki), które przekazują sygnały między komórkami nerwowymi.",
			intermediate:
				"Suplementy modulują syntezę, uwalnianie, wychwyt zwrotny lub degradację neuroprzekaźników, wpływając na neurotransmisję poprzez zmiany w dostępności prekursorów lub aktywności transporterów.",
			expert:
				"Mechanizm obejmuje regulację enzymów biosyntetycznych (TH, AADC, COMT), modulację transporterów błonowych (SERT, DAT, NET), wpływ na autoreceptory presynaptyczne oraz zmiany w gęstości i wrażliwości receptorów postsynaptycznych poprzez mechanizmy up/down-regulacji.",
		},
		supplements: [
			{
				name: "L-Tyrosine",
				polishName: "L-Tyrozyna",
				mechanism: "Prekursor dopaminy i noradrenaliny",
			},
			{ name: "5-HTP", polishName: "5-HTP", mechanism: "Prekursor serotoniny" },
			{
				name: "Alpha-GPC",
				polishName: "Alpha-GPC",
				mechanism: "Prekursor acetylocholiny",
			},
		],
	},
	{
		id: "antioxidant-activity",
		name: "Działanie Antyoksydacyjne",
		icon: Activity,
		color: "text-orange-600",
		bgColor: "bg-orange-50",
		borderColor: "border-orange-200",
		descriptions: {
			beginner:
				"Suplementy neutralizują szkodliwe cząsteczki (wolne rodniki), które mogą uszkadzać komórki.",
			intermediate:
				"Suplementy działają jako donory elektronów, neutralizując reaktywne formy tlenu (ROS) i azotu (RNS), chroniąc lipidy błonowe, białka i DNA przed uszkodzeniem oksydacyjnym.",
			expert:
				"Mechanizm obejmuje bezpośrednie wychwytywanie rodników (O2•−, •OH, ONOO−), indukcję endogennych systemów antyoksydacyjnych poprzez aktywację Nrf2/ARE, chelatację metali przejściowych, regenerację innych antyoksydantów oraz modulację mitochondrialnej produkcji ROS.",
		},
		supplements: [
			{
				name: "Vitamin C",
				polishName: "Witamina C",
				mechanism: "Wychwytywanie wolnych rodników",
			},
			{
				name: "Vitamin E",
				polishName: "Witamina E",
				mechanism: "Ochrona lipidów błonowych",
			},
			{
				name: "NAC",
				polishName: "N-acetylocysteina",
				mechanism: "Prekursor glutationu",
			},
		],
	},
	{
		id: "gene-expression",
		name: "Regulacja Ekspresji Genów",
		icon: BookOpen,
		color: "text-indigo-600",
		bgColor: "bg-indigo-50",
		borderColor: "border-indigo-200",
		descriptions: {
			beginner:
				"Suplementy mogą włączać lub wyłączać określone geny, zmieniając produkcję białek w komórkach.",
			intermediate:
				"Suplementy wpływają na transkrypcję genów poprzez modulację czynników transkrypcyjnych, modyfikacje epigenetyczne (metylacja DNA, acetylacja histonów) oraz regulację mikroRNA.",
			expert:
				"Mechanizm obejmuje aktywację jądrowych receptorów hormonalnych (PPARγ, RXR), modulację czynników transkrypcyjnych (NF-κB, AP-1, Nrf2), zmiany w metylacji DNA przez DNMT, acetylację histonów przez HAT/HDAC oraz regulację ekspresji miRNA wpływających na stabilność mRNA.",
		},
		supplements: [
			{
				name: "Omega-3",
				polishName: "Omega-3",
				mechanism: "Aktywacja PPARα/γ",
			},
			{
				name: "Sulforaphane",
				polishName: "Sulforafan",
				mechanism: "Aktywacja Nrf2",
			},
			{
				name: "Vitamin D",
				polishName: "Witamina D",
				mechanism: "Wiązanie z VDR",
			},
		],
	},
	{
		id: "mitochondrial-function",
		name: "Funkcja Mitochondrialna",
		icon: TrendingUp,
		color: "text-red-600",
		bgColor: "bg-red-50",
		borderColor: "border-red-200",
		descriptions: {
			beginner:
				"Suplementy wspierają mitochondria - 'elektrownie komórek' - które produkują energię potrzebną do życia.",
			intermediate:
				"Suplementy optymalizują funkcję łańcucha oddechowego mitochondriów, zwiększając produkcję ATP, redukując wycieki protonów oraz chroniąc przed uszkodzeniem oksydacyjnym mitochondrialnego DNA.",
			expert:
				"Mechanizm obejmuje modulację kompleksów łańcucha oddechowego (I-IV), optymalizację sprzężenia fosforylacji oksydacyjnej, aktywację biogenezy mitochondrialnej poprzez PGC-1α, regulację mitofagii, stabilizację potencjału błonowego (ΔΨm) oraz ochronę mtDNA przed mutacjami.",
		},
		supplements: [
			{
				name: "CoQ10",
				polishName: "Koenzym Q10",
				mechanism: "Przenośnik elektronów w łańcuchu oddechowym",
			},
			{
				name: "PQQ",
				polishName: "PQQ",
				mechanism: "Stymulacja biogenezy mitochondrialnej",
			},
			{
				name: "Creatine",
				polishName: "Kreatyna",
				mechanism: "Buforowanie energii ATP/ADP",
			},
		],
	},
];

export default function MechanismsPage() {
	const [difficultyLevel, setDifficultyLevel] =
		useState<DifficultyLevel>("beginner");

	const getDifficultyLabel = (level: DifficultyLevel) => {
		switch (level) {
			case "beginner":
				return "Początkujący";
			case "intermediate":
				return "Średniozaawansowany";
			case "expert":
				return "Ekspert";
		}
	};

	return (
		<div className="container mx-auto space-y-8 px-4 py-8">
			{/* Breadcrumb Navigation */}
			<BreadcrumbNavigation />

			{/* Hero Section */}
			<div className="space-y-4 text-center">
				<div className="flex justify-center">
					<Activity className="h-16 w-16 text-primary" />
				</div>
				<h1 className="font-bold text-4xl md:text-5xl">Mechanizmy Działania</h1>
				<p className="mx-auto max-w-2xl text-muted-foreground text-xl">
					Poznaj molekularne mechanizmy działania suplementów na organizm
				</p>
			</div>

			{/* Difficulty Level Selector */}
			<Card>
				<CardHeader>
					<CardTitle>Wybierz Poziom Szczegółowości</CardTitle>
					<CardDescription>
						Dostosuj wyjaśnienia do swojego poziomu wiedzy
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Tabs
						value={difficultyLevel}
						onValueChange={(v) => setDifficultyLevel(v as DifficultyLevel)}
					>
						<TabsList className="grid w-full grid-cols-3">
							<TabsTrigger value="beginner">
								<Badge
									variant="secondary"
									className="mr-2 bg-green-100 text-green-800"
								>
									Początkujący
								</Badge>
							</TabsTrigger>
							<TabsTrigger value="intermediate">
								<Badge
									variant="secondary"
									className="mr-2 bg-blue-100 text-blue-800"
								>
									Średniozaawansowany
								</Badge>
							</TabsTrigger>
							<TabsTrigger value="expert">
								<Badge
									variant="secondary"
									className="mr-2 bg-purple-100 text-purple-800"
								>
									Ekspert
								</Badge>
							</TabsTrigger>
						</TabsList>
					</Tabs>
				</CardContent>
			</Card>

			{/* Current Level Info */}
			<div className="rounded-lg bg-muted p-4">
				<p className="text-sm">
					<strong>Aktualny poziom:</strong>{" "}
					{getDifficultyLabel(difficultyLevel)}
					{difficultyLevel === "beginner" &&
						" - Proste wyjaśnienia dla osób rozpoczynających naukę"}
					{difficultyLevel === "intermediate" &&
						" - Szczegółowe informacje z terminologią naukową"}
					{difficultyLevel === "expert" &&
						" - Zaawansowana wiedza molekularna i biochemiczna"}
				</p>
			</div>

			{/* Mechanisms Grid */}
			<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
				{MECHANISMS.map((mechanism) => {
					const Icon = mechanism.icon;
					return (
						<Card
							key={mechanism.id}
							className={`border-2 ${mechanism.borderColor} group transition-all hover:shadow-lg`}
						>
							<CardHeader
								className={`${mechanism.bgColor} transition-colors group-hover:bg-opacity-70`}
							>
								<div className="mb-2 flex items-center gap-3">
									<div
										className={
											"rounded-lg bg-white/50 p-2 transition-transform group-hover:scale-110"
										}
									>
										<Icon className={`h-6 w-6 ${mechanism.color}`} />
									</div>
									<CardTitle className="text-xl">{mechanism.name}</CardTitle>
								</div>
							</CardHeader>
							<CardContent className="space-y-4 pt-6">
								{/* Mechanism Description */}
								<div>
									<Accordion type="single" collapsible className="w-full">
										<AccordionItem
											value={`${mechanism.id}-description`}
											className="border-muted"
										>
											<AccordionTrigger className="text-left hover:no-underline">
												<div className="flex items-center gap-2">
													<BookOpen className="h-4 w-4 text-muted-foreground" />
													<span className="font-semibold text-muted-foreground text-sm">
														Jak to działa?
													</span>
												</div>
											</AccordionTrigger>
											<AccordionContent>
												<p className="mt-2 text-sm leading-relaxed">
													{mechanism.descriptions[difficultyLevel]}
												</p>
											</AccordionContent>
										</AccordionItem>
									</Accordion>
								</div>

								<Separator />

								{/* Supplement Examples */}
								<div>
									<Accordion type="single" collapsible className="w-full">
										<AccordionItem
											value={`${mechanism.id}-supplements`}
											className="border-muted"
										>
											<AccordionTrigger className="text-left hover:no-underline">
												<div className="flex items-center gap-2">
													<Users className="h-4 w-4 text-muted-foreground" />
													<span className="font-semibold text-muted-foreground text-sm">
														Przykładowe Suplementy (
														{mechanism.supplements.length})
													</span>
												</div>
											</AccordionTrigger>
											<AccordionContent>
												<div className="mt-2 space-y-3">
													{mechanism.supplements.map((supp, idx) => (
														<div
															key={idx}
															className="rounded-lg border border-muted/70 bg-muted/50 p-3 transition-colors hover:bg-muted"
														>
															<div className="flex items-start justify-between">
																<div className="flex-1">
																	<div className="mb-1 font-medium text-sm">
																		{supp.polishName}
																	</div>
																	<div className="text-muted-foreground text-xs">
																		{supp.mechanism}
																	</div>
																</div>
																<Badge
																	variant="outline"
																	className="ml-2 text-xs"
																>
																	{mechanism.name.split(" ")[0]}
																</Badge>
															</div>
														</div>
													))}
												</div>
											</AccordionContent>
										</AccordionItem>
									</Accordion>
								</div>

								{/* Quick Stats */}
								<div className="flex items-center justify-between pt-2 text-muted-foreground text-xs">
									<div className="flex items-center gap-1">
										<Users className="h-3 w-3" />
										<span>{mechanism.supplements.length} suplementów</span>
									</div>
									<div className="flex items-center gap-1">
										<Clock className="h-3 w-3" />
										<span>5-10 min. czytania</span>
									</div>
								</div>
							</CardContent>
						</Card>
					);
				})}
			</div>

			{/* Additional Information */}
			<Card className="border-2 border-primary/20">
				<CardHeader className="bg-primary/5">
					<CardTitle className="flex items-center gap-2">
						<BookOpen className="h-5 w-5 text-primary" />
						Ważne Informacje
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<Accordion type="multiple" className="w-full">
						<AccordionItem value="multidirectional" className="border-muted">
							<AccordionTrigger className="text-left hover:no-underline">
								<div className="flex items-center gap-2">
									<TrendingUp className="h-4 w-4 text-primary" />
									<span className="font-semibold">
										Wielokierunkowe Działanie
									</span>
								</div>
							</AccordionTrigger>
							<AccordionContent>
								<div className="space-y-3">
									<p className="text-muted-foreground text-sm leading-relaxed">
										Większość suplementów działa poprzez wiele mechanizmów
										jednocześnie. Na przykład, kurkumina wykazuje działanie
										przeciwzapalne, antyoksydacyjne i moduluje ekspresję genów.
									</p>
									<div className="grid grid-cols-1 gap-2 md:grid-cols-3">
										<Badge variant="secondary" className="justify-center">
											Przeciwzapalne
										</Badge>
										<Badge variant="secondary" className="justify-center">
											Antyoksydacyjne
										</Badge>
										<Badge variant="secondary" className="justify-center">
											Epigenetyczne
										</Badge>
									</div>
								</div>
							</AccordionContent>
						</AccordionItem>

						<AccordionItem value="synergy" className="border-muted">
							<AccordionTrigger className="text-left hover:no-underline">
								<div className="flex items-center gap-2">
									<Users className="h-4 w-4 text-primary" />
									<span className="font-semibold">Synergizm</span>
								</div>
							</AccordionTrigger>
							<AccordionContent>
								<div className="space-y-3">
									<p className="text-muted-foreground text-sm leading-relaxed">
										Niektóre suplementy działają synergistycznie - ich łączne
										działanie jest silniejsze niż suma działań pojedynczych
										składników.
									</p>
									<div className="rounded-lg bg-muted/50 p-3">
										<h5 className="mb-2 font-medium text-sm">
											Przykłady synergii:
										</h5>
										<ul className="space-y-1 text-muted-foreground text-xs">
											<li>• Witamina D + K2 - lepsze wchłanianie</li>
											<li>• Magnez + B6 - wspieranie układu nerwowego</li>
											<li>• Kurkumina + piperyna - zwiększona biodostępność</li>
										</ul>
									</div>
								</div>
							</AccordionContent>
						</AccordionItem>

						<AccordionItem value="individual" className="border-muted">
							<AccordionTrigger className="text-left hover:no-underline">
								<div className="flex items-center gap-2">
									<Star className="h-4 w-4 text-primary" />
									<span className="font-semibold">Indywidualna Odpowiedź</span>
								</div>
							</AccordionTrigger>
							<AccordionContent>
								<div className="space-y-3">
									<p className="text-muted-foreground text-sm leading-relaxed">
										Efektywność mechanizmów może się różnić w zależności od
										genetyki, wieku, stanu zdrowia i innych czynników
										indywidualnych.
									</p>
									<div className="grid grid-cols-2 gap-2">
										{[
											"Genetyka",
											"Wiek",
											"Stan zdrowia",
											"Dieta",
											"Styl życia",
											"Mikrobiom",
										].map((factor, index) => (
											<Badge
												key={index}
												variant="outline"
												className="justify-center text-xs"
											>
												{factor}
											</Badge>
										))}
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
