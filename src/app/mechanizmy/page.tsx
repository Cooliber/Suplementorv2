"use client";

import { useState } from "react";
import { Activity, Zap, Lock, Wrench, TrendingUp, BookOpen } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BreadcrumbNavigation } from "@/components/navigation/BreadcrumbNavigation";

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
			beginner: "Suplementy łączą się z receptorami w komórkach, jak klucz do zamka, aby wywołać określone efekty.",
			intermediate: "Suplementy działają jako ligandy, wiążąc się z receptorami błonowymi lub jądrowymi, inicjując kaskady sygnałowe poprzez zmiany konformacyjne białek receptorowych.",
			expert: "Mechanizm obejmuje stereospecyficzne wiązanie ligand-receptor, aktywację białek G lub kinaz receptorowych, fosforylację kaskad MAPK/ERK oraz modulację transkrypcji genów poprzez czynniki takie jak CREB i NF-κB.",
		},
		supplements: [
			{ name: "Ashwagandha", polishName: "Ashwagandha", mechanism: "Modulacja receptorów GABA-A" },
			{ name: "Rhodiola Rosea", polishName: "Różeniec Górski", mechanism: "Wiązanie z receptorami serotoninowymi" },
			{ name: "L-Theanine", polishName: "L-Teanina", mechanism: "Agonista receptorów NMDA" },
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
			beginner: "Suplementy mogą przyspieszać lub spowalniać działanie enzymów, które kontrolują reakcje chemiczne w organizmie.",
			intermediate: "Suplementy działają jako inhibitory lub aktywatory enzymatyczne, wpływając na szybkość reakcji metabolicznych poprzez kompetycyjne lub allosteryczne wiązanie z miejscami aktywnymi enzymów.",
			expert: "Mechanizm obejmuje inhibicję kompetycyjną (Ki), niekompetycyjną lub mieszaną, modulację allosteryczną, wpływ na kofaktory enzymatyczne oraz regulację ekspresji genów kodujących enzymy poprzez szlaki AMPK, mTOR i SIRT1.",
		},
		supplements: [
			{ name: "Curcumin", polishName: "Kurkumina", mechanism: "Inhibicja COX-2 i LOX" },
			{ name: "Resveratrol", polishName: "Resweratrol", mechanism: "Aktywacja SIRT1" },
			{ name: "Quercetin", polishName: "Kwercetyna", mechanism: "Inhibicja MAO" },
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
			beginner: "Suplementy wpływają na chemikalia w mózgu (neuroprzekaźniki), które przekazują sygnały między komórkami nerwowymi.",
			intermediate: "Suplementy modulują syntezę, uwalnianie, wychwyt zwrotny lub degradację neuroprzekaźników, wpływając na neurotransmisję poprzez zmiany w dostępności prekursorów lub aktywności transporterów.",
			expert: "Mechanizm obejmuje regulację enzymów biosyntetycznych (TH, AADC, COMT), modulację transporterów błonowych (SERT, DAT, NET), wpływ na autoreceptory presynaptyczne oraz zmiany w gęstości i wrażliwości receptorów postsynaptycznych poprzez mechanizmy up/down-regulacji.",
		},
		supplements: [
			{ name: "L-Tyrosine", polishName: "L-Tyrozyna", mechanism: "Prekursor dopaminy i noradrenaliny" },
			{ name: "5-HTP", polishName: "5-HTP", mechanism: "Prekursor serotoniny" },
			{ name: "Alpha-GPC", polishName: "Alpha-GPC", mechanism: "Prekursor acetylocholiny" },
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
			beginner: "Suplementy neutralizują szkodliwe cząsteczki (wolne rodniki), które mogą uszkadzać komórki.",
			intermediate: "Suplementy działają jako donory elektronów, neutralizując reaktywne formy tlenu (ROS) i azotu (RNS), chroniąc lipidy błonowe, białka i DNA przed uszkodzeniem oksydacyjnym.",
			expert: "Mechanizm obejmuje bezpośrednie wychwytywanie rodników (O2•−, •OH, ONOO−), indukcję endogennych systemów antyoksydacyjnych poprzez aktywację Nrf2/ARE, chelatację metali przejściowych, regenerację innych antyoksydantów oraz modulację mitochondrialnej produkcji ROS.",
		},
		supplements: [
			{ name: "Vitamin C", polishName: "Witamina C", mechanism: "Wychwytywanie wolnych rodników" },
			{ name: "Vitamin E", polishName: "Witamina E", mechanism: "Ochrona lipidów błonowych" },
			{ name: "NAC", polishName: "N-acetylocysteina", mechanism: "Prekursor glutationu" },
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
			beginner: "Suplementy mogą włączać lub wyłączać określone geny, zmieniając produkcję białek w komórkach.",
			intermediate: "Suplementy wpływają na transkrypcję genów poprzez modulację czynników transkrypcyjnych, modyfikacje epigenetyczne (metylacja DNA, acetylacja histonów) oraz regulację mikroRNA.",
			expert: "Mechanizm obejmuje aktywację jądrowych receptorów hormonalnych (PPARγ, RXR), modulację czynników transkrypcyjnych (NF-κB, AP-1, Nrf2), zmiany w metylacji DNA przez DNMT, acetylację histonów przez HAT/HDAC oraz regulację ekspresji miRNA wpływających na stabilność mRNA.",
		},
		supplements: [
			{ name: "Omega-3", polishName: "Omega-3", mechanism: "Aktywacja PPARα/γ" },
			{ name: "Sulforaphane", polishName: "Sulforafan", mechanism: "Aktywacja Nrf2" },
			{ name: "Vitamin D", polishName: "Witamina D", mechanism: "Wiązanie z VDR" },
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
			beginner: "Suplementy wspierają mitochondria - 'elektrownie komórek' - które produkują energię potrzebną do życia.",
			intermediate: "Suplementy optymalizują funkcję łańcucha oddechowego mitochondriów, zwiększając produkcję ATP, redukując wycieki protonów oraz chroniąc przed uszkodzeniem oksydacyjnym mitochondrialnego DNA.",
			expert: "Mechanizm obejmuje modulację kompleksów łańcucha oddechowego (I-IV), optymalizację sprzężenia fosforylacji oksydacyjnej, aktywację biogenezy mitochondrialnej poprzez PGC-1α, regulację mitofagii, stabilizację potencjału błonowego (ΔΨm) oraz ochronę mtDNA przed mutacjami.",
		},
		supplements: [
			{ name: "CoQ10", polishName: "Koenzym Q10", mechanism: "Przenośnik elektronów w łańcuchu oddechowym" },
			{ name: "PQQ", polishName: "PQQ", mechanism: "Stymulacja biogenezy mitochondrialnej" },
			{ name: "Creatine", polishName: "Kreatyna", mechanism: "Buforowanie energii ATP/ADP" },
		],
	},
];

export default function MechanismsPage() {
	const [difficultyLevel, setDifficultyLevel] = useState<DifficultyLevel>("beginner");

	const getDifficultyLabel = (level: DifficultyLevel) => {
		switch (level) {
			case "beginner": return "Początkujący";
			case "intermediate": return "Średniozaawansowany";
			case "expert": return "Ekspert";
		}
	};

	return (
		<div className="container mx-auto px-4 py-8 space-y-8">
			{/* Breadcrumb Navigation */}
			<BreadcrumbNavigation />

			{/* Hero Section */}
			<div className="text-center space-y-4">
				<div className="flex justify-center">
					<Activity className="h-16 w-16 text-primary" />
				</div>
				<h1 className="text-4xl md:text-5xl font-bold">Mechanizmy Działania</h1>
				<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
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
					<Tabs value={difficultyLevel} onValueChange={(v) => setDifficultyLevel(v as DifficultyLevel)}>
						<TabsList className="grid w-full grid-cols-3">
							<TabsTrigger value="beginner">
								<Badge variant="secondary" className="bg-green-100 text-green-800 mr-2">
									Początkujący
								</Badge>
							</TabsTrigger>
							<TabsTrigger value="intermediate">
								<Badge variant="secondary" className="bg-blue-100 text-blue-800 mr-2">
									Średniozaawansowany
								</Badge>
							</TabsTrigger>
							<TabsTrigger value="expert">
								<Badge variant="secondary" className="bg-purple-100 text-purple-800 mr-2">
									Ekspert
								</Badge>
							</TabsTrigger>
						</TabsList>
					</Tabs>
				</CardContent>
			</Card>

			{/* Current Level Info */}
			<div className="bg-muted p-4 rounded-lg">
				<p className="text-sm">
					<strong>Aktualny poziom:</strong> {getDifficultyLabel(difficultyLevel)}
					{difficultyLevel === "beginner" && " - Proste wyjaśnienia dla osób rozpoczynających naukę"}
					{difficultyLevel === "intermediate" && " - Szczegółowe informacje z terminologią naukową"}
					{difficultyLevel === "expert" && " - Zaawansowana wiedza molekularna i biochemiczna"}
				</p>
			</div>

			{/* Mechanisms Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{MECHANISMS.map((mechanism) => {
					const Icon = mechanism.icon;
					return (
						<Card key={mechanism.id} className={`border-2 ${mechanism.borderColor}`}>
							<CardHeader className={mechanism.bgColor}>
								<div className="flex items-center gap-3 mb-2">
									<Icon className={`h-8 w-8 ${mechanism.color}`} />
									<CardTitle className="text-xl">{mechanism.name}</CardTitle>
								</div>
							</CardHeader>
							<CardContent className="pt-6 space-y-4">
								{/* Mechanism Description */}
								<div>
									<h4 className="font-semibold mb-2 text-sm text-muted-foreground">
										Jak to działa?
									</h4>
									<p className="text-sm leading-relaxed">
										{mechanism.descriptions[difficultyLevel]}
									</p>
								</div>

								{/* Supplement Examples */}
								<div>
									<h4 className="font-semibold mb-3 text-sm text-muted-foreground">
										Przykładowe Suplementy
									</h4>
									<div className="space-y-2">
										{mechanism.supplements.map((supp, idx) => (
											<div key={idx} className="bg-muted p-3 rounded-lg">
												<div className="font-medium text-sm mb-1">
													{supp.polishName}
												</div>
												<div className="text-xs text-muted-foreground">
													{supp.mechanism}
												</div>
											</div>
										))}
									</div>
								</div>
							</CardContent>
						</Card>
					);
				})}
			</div>

			{/* Additional Information */}
			<Card>
				<CardHeader>
					<CardTitle>Ważne Informacje</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div>
						<h4 className="font-semibold mb-2">Wielokierunkowe Działanie</h4>
						<p className="text-sm text-muted-foreground">
							Większość suplementów działa poprzez wiele mechanizmów jednocześnie. Na przykład, kurkumina wykazuje działanie przeciwzapalne, antyoksydacyjne i moduluje ekspresję genów.
						</p>
					</div>
					<div>
						<h4 className="font-semibold mb-2">Synergizm</h4>
						<p className="text-sm text-muted-foreground">
							Niektóre suplementy działają synergistycznie - ich łączne działanie jest silniejsze niż suma działań pojedynczych składników.
						</p>
					</div>
					<div>
						<h4 className="font-semibold mb-2">Indywidualna Odpowiedź</h4>
						<p className="text-sm text-muted-foreground">
							Efektywność mechanizmów może się różnić w zależności od genetyki, wieku, stanu zdrowia i innych czynników indywidualnych.
						</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

