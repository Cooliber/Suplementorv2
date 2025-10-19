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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { bodySystems } from "@/data/body-systems";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "System Endokannabinoidowy | Suplementor",
	description:
		"Kompleksowe informacje o systemie endokannabinoidowym, jego receptorach, endokannabinoidach i wpływie na organizm",
};

// Znajdź system endokannabinoidowy z danych
const endocannabinoidSystem = bodySystems.find(
	(system) => system.id === "endocannabinoid",
);

export default function EndocannabinoidSystemPage() {
	if (!endocannabinoidSystem) {
		return (
			<div className="container mx-auto py-8">
				System endokannabinoidowy nie został znaleziony w bazie danych.
			</div>
		);
	}

	return (
		<div className="container mx-auto py-8">
			<h1 className="mb-6 font-bold text-3xl">System Endokannabinoidowy</h1>
			<p className="mb-8 text-lg">
				Odkryj kompleksowe informacje o systemie endokannabinoidowym, jego
				receptorach, endokannabinoidach i wpływie na organizm człowieka.
			</p>

			{/* System Overview */}
			<Card className="mb-8">
				<CardHeader className="bg-gradient-to-r from-emerald-100 to-emerald-50">
					<CardTitle>{endocannabinoidSystem.polishName}</CardTitle>
					<CardDescription>{endocannabinoidSystem.name}</CardDescription>
				</CardHeader>
				<CardContent className="pt-6">
					<p className="mb-6 text-lg">
						{endocannabinoidSystem.polishDescription}
					</p>

					<div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
						<div>
							<h3 className="mb-3 font-semibold text-xl">Główne Funkcje</h3>
							<ul className="list-disc space-y-2 pl-5">
								{endocannabinoidSystem.polishFunctions.map((func, index) => (
									<li key={index} className="text-gray-700">
										{func}
									</li>
								))}
							</ul>
						</div>
						<div>
							<h3 className="mb-3 font-semibold text-xl">
								Lokalizacja w Organizmie
							</h3>
							<p className="mb-3 text-gray-700">
								{endocannabinoidSystem.anatomicalInfo.polishLocation}
							</p>

							<h4 className="mb-2 font-medium">
								Powiązania z innymi układami:
							</h4>
							<div className="flex flex-wrap gap-2">
								{endocannabinoidSystem.anatomicalInfo.polishConnections.map(
									(connection, index) => (
										<Badge
											key={index}
											variant="outline"
											className="bg-emerald-50"
										>
											{connection}
										</Badge>
									),
								)}
							</div>
						</div>
					</div>

					<div className="mt-6 border-t pt-4">
						<h3 className="mb-3 font-semibold text-xl">Znaczenie Kliniczne</h3>
						<p className="text-gray-700">
							{endocannabinoidSystem.anatomicalInfo.polishClinicalRelevance}
						</p>
					</div>
				</CardContent>
			</Card>

			{/* Receptors Section */}
			<h2 className="mb-4 font-semibold text-2xl">Receptory Kannabinoidowe</h2>
			<div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
				<Card>
					<CardHeader className="bg-blue-50">
						<CardTitle>Receptor CB1</CardTitle>
						<CardDescription>Głównie w układzie nerwowym</CardDescription>
					</CardHeader>
					<CardContent className="pt-4">
						<p className="mb-4">
							Receptory CB1 występują głównie w ośrodkowym układzie nerwowym,
							szczególnie w mózgu. Są one najliczniejszymi receptorami
							sprzężonymi z białkiem G w mózgu.
						</p>
						<h4 className="mb-2 font-medium">Lokalizacja:</h4>
						<ul className="mb-4 list-disc pl-5">
							<li>Kora mózgowa</li>
							<li>Hipokamp (pamięć)</li>
							<li>Jądra podstawne (ruch)</li>
							<li>Ciało migdałowate (emocje)</li>
							<li>Móżdżek (koordynacja)</li>
							<li>Podwzgórze (apetyt)</li>
						</ul>
						<h4 className="mb-2 font-medium">Funkcje:</h4>
						<ul className="list-disc pl-5">
							<li>Regulacja uwalniania neuroprzekaźników</li>
							<li>Modulacja bólu</li>
							<li>Kontrola apetytu</li>
							<li>Regulacja nastroju</li>
							<li>Wpływ na pamięć i uczenie się</li>
							<li>Kontrola motoryki</li>
						</ul>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="bg-green-50">
						<CardTitle>Receptor CB2</CardTitle>
						<CardDescription>Głównie w układzie odpornościowym</CardDescription>
					</CardHeader>
					<CardContent className="pt-4">
						<p className="mb-4">
							Receptory CB2 występują głównie w komórkach układu
							odpornościowego, ale również w ośrodkowym układzie nerwowym,
							szczególnie w komórkach mikrogleju.
						</p>
						<h4 className="mb-2 font-medium">Lokalizacja:</h4>
						<ul className="mb-4 list-disc pl-5">
							<li>Komórki odpornościowe (limfocyty B i T, makrofagi)</li>
							<li>Śledziona i migdałki</li>
							<li>Mikroglej (komórki odpornościowe mózgu)</li>
							<li>Komórki układu pokarmowego</li>
							<li>Komórki skóry</li>
						</ul>
						<h4 className="mb-2 font-medium">Funkcje:</h4>
						<ul className="list-disc pl-5">
							<li>Regulacja odpowiedzi immunologicznej</li>
							<li>Modulacja stanu zapalnego</li>
							<li>Kontrola produkcji cytokin</li>
							<li>Wpływ na migrację komórek odpornościowych</li>
							<li>Neuroprotekcja w OUN</li>
						</ul>
					</CardContent>
				</Card>
			</div>

			{/* Endocannabinoids Section */}
			<h2 className="mb-4 font-semibold text-2xl">Endokannabinoidy</h2>
			<Card className="mb-8">
				<CardContent className="pt-6">
					<Accordion type="single" collapsible className="w-full">
						<AccordionItem value="anandamide">
							<AccordionTrigger>
								<div className="flex items-center">
									<span className="font-medium text-lg">Anandamid (AEA)</span>
									<Badge className="ml-3 border-amber-200 bg-amber-100 text-amber-800">
										Główny endokannabinoid
									</Badge>
								</div>
							</AccordionTrigger>
							<AccordionContent>
								<div className="space-y-4 p-4">
									<p>
										Anandamid (N-arachidonoylethanolamina, AEA) to pierwszy
										odkryty endokannabinoid, nazwany od sanskryckiego słowa
										"ananda" oznaczającego "błogość" lub "szczęście".
									</p>
									<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
										<div>
											<h4 className="mb-2 font-medium">
												Synteza i Metabolizm:
											</h4>
											<ul className="list-disc pl-5">
												<li>
													Syntetyzowany na żądanie z prekursorów fosfolipidowych
												</li>
												<li>
													Nie jest magazynowany w pęcherzykach jak klasyczne
													neuroprzekaźniki
												</li>
												<li>
													Rozkładany głównie przez enzym FAAH (hydrolaza amidów
													kwasów tłuszczowych)
												</li>
												<li>Krótki okres półtrwania (minuty)</li>
											</ul>
										</div>
										<div>
											<h4 className="mb-2 font-medium">
												Funkcje Fizjologiczne:
											</h4>
											<ul className="list-disc pl-5">
												<li>Regulacja nastroju i redukcja lęku</li>
												<li>Modulacja bólu</li>
												<li>Wpływ na apetyt i przyjmowanie pokarmu</li>
												<li>Regulacja funkcji rozrodczych</li>
												<li>Neuroprotekcja</li>
												<li>Wpływ na pamięć i uczenie się</li>
											</ul>
										</div>
									</div>
									<div>
										<h4 className="mb-2 font-medium">
											Powinowactwo do Receptorów:
										</h4>
										<p>
											Anandamid wiąże się zarówno z receptorami CB1 jak i CB2,
											ale ma wyższe powinowactwo do receptorów CB1. Działa
											również na receptory TRPV1 (receptory waniloidowe), które
											są zaangażowane w percepcję bólu i temperatury.
										</p>
									</div>
								</div>
							</AccordionContent>
						</AccordionItem>

						<AccordionItem value="2-ag">
							<AccordionTrigger>
								<div className="flex items-center">
									<span className="font-medium text-lg">
										2-Arachidonoylglicerol (2-AG)
									</span>
									<Badge className="ml-3 border-amber-200 bg-amber-100 text-amber-800">
										Najobfitszy endokannabinoid
									</Badge>
								</div>
							</AccordionTrigger>
							<AccordionContent>
								<div className="space-y-4 p-4">
									<p>
										2-Arachidonoylglicerol (2-AG) jest najobficiej występującym
										endokannabinoidem w mózgu, obecnym w stężeniach około 200
										razy wyższych niż anandamid.
									</p>
									<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
										<div>
											<h4 className="mb-2 font-medium">
												Synteza i Metabolizm:
											</h4>
											<ul className="list-disc pl-5">
												<li>
													Syntetyzowany głównie przez lipazę diacyloglicerolu
													(DAGL)
												</li>
												<li>
													Produkowany na żądanie w odpowiedzi na aktywność
													neuronalną
												</li>
												<li>
													Rozkładany głównie przez enzym MAGL (lipaza
													monoacyloglicerolu)
												</li>
												<li>Dłuższy okres półtrwania niż anandamid</li>
											</ul>
										</div>
										<div>
											<h4 className="mb-2 font-medium">
												Funkcje Fizjologiczne:
											</h4>
											<ul className="list-disc pl-5">
												<li>Regulacja synaptyczna (sygnalizacja wsteczna)</li>
												<li>Neuroprotekcja i neurogeneza</li>
												<li>Modulacja procesów zapalnych</li>
												<li>Regulacja apetytu</li>
												<li>Kontrola bólu</li>
												<li>Wpływ na funkcje poznawcze</li>
											</ul>
										</div>
									</div>
									<div>
										<h4 className="mb-2 font-medium">
											Powinowactwo do Receptorów:
										</h4>
										<p>
											2-AG jest pełnym agonistą zarówno receptorów CB1 jak i
											CB2, z podobnym powinowactwem do obu typów receptorów.
											Jest uważany za główny endogenny ligand dla receptorów
											kannabinoidowych w mózgu.
										</p>
									</div>
								</div>
							</AccordionContent>
						</AccordionItem>

						<AccordionItem value="other">
							<AccordionTrigger>
								<div className="flex items-center">
									<span className="font-medium text-lg">
										Inne Endokannabinoidy
									</span>
									<Badge className="ml-3 border-gray-200 bg-gray-100 text-gray-800">
										Mniej poznane
									</Badge>
								</div>
							</AccordionTrigger>
							<AccordionContent>
								<div className="space-y-4 p-4">
									<p>
										Oprócz anandamidu i 2-AG, zidentyfikowano kilka innych
										endokannabinoidów o różnych funkcjach i powinowactwie do
										receptorów.
									</p>
									<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
										<div>
											<h4 className="mb-2 font-medium">
												Noladin eter (2-AGE):
											</h4>
											<ul className="list-disc pl-5">
												<li>Wiąże się głównie z receptorem CB1</li>
												<li>
													Bardziej stabilny metabolicznie niż anandamid i 2-AG
												</li>
												<li>Może odgrywać rolę w regulacji apetytu</li>
											</ul>
										</div>
										<div>
											<h4 className="mb-2 font-medium">Virodhamin:</h4>
											<ul className="list-disc pl-5">
												<li>Częściowy agonista receptora CB1 i agonista CB2</li>
												<li>Może działać jako antagonista anandamidu</li>
												<li>
													Potencjalna rola w regulacji układu
													sercowo-naczyniowego
												</li>
											</ul>
										</div>
									</div>
									<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
										<div>
											<h4 className="mb-2 font-medium">
												N-Arachidonoylodopamina (NADA):
											</h4>
											<ul className="list-disc pl-5">
												<li>Aktywuje zarówno receptory CB1 jak i TRPV1</li>
												<li>Zaangażowana w regulację bólu i temperatury</li>
												<li>Potencjalne działanie przeciwzapalne</li>
											</ul>
										</div>
										<div>
											<h4 className="mb-2 font-medium">Związki Pokrewne:</h4>
											<ul className="list-disc pl-5">
												<li>
													Palmitoiloetanolamid (PEA) - działanie przeciwzapalne
												</li>
												<li>Oleoiloetanolamid (OEA) - regulacja apetytu</li>
												<li>
													Nie wiążą się bezpośrednio z receptorami CB1/CB2, ale
													wzmacniają działanie endokannabinoidów (efekt
													otoczenia)
												</li>
											</ul>
										</div>
									</div>
								</div>
							</AccordionContent>
						</AccordionItem>
					</Accordion>
				</CardContent>
			</Card>

			{/* System Impact Section */}
			<h2 className="mb-4 font-semibold text-2xl">Wpływ na Organizm</h2>
			<div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
				<Card>
					<CardHeader className="bg-indigo-50">
						<CardTitle>Układ Nerwowy</CardTitle>
					</CardHeader>
					<CardContent>
						<ul className="list-disc space-y-2 pl-5">
							<li>Modulacja uwalniania neuroprzekaźników</li>
							<li>Neuroprotekcja i neuroplastyczność</li>
							<li>Regulacja nastroju i emocji</li>
							<li>Kontrola bólu</li>
							<li>Wpływ na pamięć i uczenie się</li>
							<li>Regulacja snu</li>
							<li>Kontrola motoryki</li>
						</ul>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="bg-rose-50">
						<CardTitle>Układ Odpornościowy</CardTitle>
					</CardHeader>
					<CardContent>
						<ul className="list-disc space-y-2 pl-5">
							<li>Modulacja odpowiedzi zapalnej</li>
							<li>Regulacja produkcji cytokin</li>
							<li>Wpływ na migrację i funkcję komórek odpornościowych</li>
							<li>Kontrola procesów autoimmunologicznych</li>
							<li>Regulacja odpowiedzi na stres oksydacyjny</li>
							<li>Wpływ na gojenie się ran</li>
						</ul>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="bg-amber-50">
						<CardTitle>Metabolizm i Homeostaza</CardTitle>
					</CardHeader>
					<CardContent>
						<ul className="list-disc space-y-2 pl-5">
							<li>Regulacja apetytu i przyjmowania pokarmu</li>
							<li>Wpływ na metabolizm glukozy i lipidów</li>
							<li>Modulacja funkcji układu pokarmowego</li>
							<li>Regulacja układu sercowo-naczyniowego</li>
							<li>Wpływ na gospodarkę energetyczną</li>
							<li>Kontrola temperatury ciała</li>
							<li>Regulacja funkcji rozrodczych</li>
						</ul>
					</CardContent>
				</Card>
			</div>

			{/* Related Supplements */}
			<h2 className="mb-4 font-semibold text-2xl">
				Suplementy Wpływające na System Endokannabinoidowy
			</h2>
			<div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				{endocannabinoidSystem.relatedSupplements.map((supplement) => (
					<Card key={supplement.supplementId} className="overflow-hidden">
						<CardHeader className="bg-gradient-to-r from-emerald-100 to-emerald-50">
							<CardTitle>{supplement.polishSupplementName}</CardTitle>
							<CardDescription>{supplement.supplementName}</CardDescription>
						</CardHeader>
						<CardContent className="pt-4">
							<div className="mb-3">
								<span className="font-medium">Mechanizm działania:</span>
								<p className="mt-1 text-gray-700">
									{supplement.polishMechanism}
								</p>
							</div>
							<div className="mb-3">
								<span className="font-medium">Typ efektu:</span>
								<Badge className="ml-2 bg-blue-50 text-blue-800">
									{translateEffectType(supplement.effectType)}
								</Badge>
							</div>
							<div>
								<span className="font-medium">Poziom dowodów:</span>
								<Badge className="ml-2 bg-gray-50">
									{translateEvidenceLevel(supplement.evidenceLevel)}
								</Badge>
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			{/* Educational Tabs */}
			<Card>
				<CardHeader>
					<CardTitle>Poziomy Wiedzy o Systemie Endokannabinoidowym</CardTitle>
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
									Podstawy Systemu Endokannabinoidowego
								</h4>
								<p className="text-green-700 text-sm leading-relaxed">
									System endokannabinoidowy to sieć receptorów i naturalnych
									związków w organizmie, która pomaga utrzymać równowagę
									(homeostazę). Działa jak system regulacyjny, wpływając na sen,
									nastrój, apetyt, pamięć i odczuwanie bólu. Receptory CB1
									znajdują się głównie w mózgu i układzie nerwowym, podczas gdy
									receptory CB2 występują głównie w układzie odpornościowym.
									Organizm produkuje własne kannabinoidy (endokannabinoidy),
									które działają jak przekaźniki informacji. Niektóre suplementy
									mogą wspierać prawidłowe funkcjonowanie tego systemu.
								</p>
							</div>
						</TabsContent>

						<TabsContent value="intermediate" className="mt-4 space-y-4">
							<div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
								<h4 className="mb-2 font-semibold text-blue-800">
									Funkcjonowanie Systemu Endokannabinoidowego
								</h4>
								<p className="text-blue-700 text-sm leading-relaxed">
									System endokannabinoidowy działa głównie poprzez sygnalizację
									wsteczną, gdzie endokannabinoidy są produkowane "na żądanie"
									przez neurony postsynaptyczne i działają na neurony
									presynaptyczne. Anandamid i 2-AG to dwa główne
									endokannabinoidy, które wiążą się z receptorami CB1 i CB2,
									aktywując różne szlaki sygnałowe. Receptory CB1 modulują
									uwalnianie neuroprzekaźników, wpływając na przekazywanie
									sygnałów w mózgu, podczas gdy receptory CB2 regulują odpowiedź
									immunologiczną i procesy zapalne. System endokannabinoidowy
									współdziała z innymi układami, w tym z układem nerwowym,
									odpornościowym i hormonalnym, tworząc złożoną sieć
									regulacyjną. Zaburzenia w funkcjonowaniu tego systemu mogą
									przyczyniać się do rozwoju różnych schorzeń.
								</p>
							</div>
						</TabsContent>

						<TabsContent value="expert" className="mt-4 space-y-4">
							<div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
								<h4 className="mb-2 font-semibold text-purple-800">
									Molekularne Mechanizmy Systemu Endokannabinoidowego
								</h4>
								<p className="text-purple-700 text-sm leading-relaxed">
									System endokannabinoidowy funkcjonuje poprzez złożone
									mechanizmy molekularne obejmujące syntezę, transport,
									działanie receptorowe i degradację endokannabinoidów.
									Anandamid jest syntetyzowany z
									N-arachidonoylfosfatydyloetanolaminy (NAPE) przez fosfolipazę
									D specyficzną dla NAPE, podczas gdy 2-AG powstaje z
									diacylogliceroli zawierających kwas arachidonowy poprzez
									działanie lipazy diacyloglicerolu (DAGL). Receptory CB1 i CB2
									są receptorami sprzężonymi z białkiem G (GPCR), które po
									aktywacji hamują cyklazę adenylową, zmniejszając poziom cAMP,
									modulują kanały jonowe i aktywują szlaki kinaz MAP.
									Endokannabinoidy są degradowane przez specyficzne enzymy:
									anandamid przez hydrolazę amidów kwasów tłuszczowych (FAAH), a
									2-AG przez lipazę monoacyloglicerolu (MAGL). System
									endokannabinoidowy wykazuje złożone interakcje z innymi
									systemami sygnalizacyjnymi, w tym z układem opioidowym,
									serotoninergicznym, dopaminergicznym i receptorami TRPV.
									Polimorfizmy genów kodujących komponenty systemu
									endokannabinoidowego mogą wpływać na podatność na różne
									schorzenia, w tym zaburzenia nastroju, uzależnienia i choroby
									neurodegeneracyjne.
								</p>
							</div>
						</TabsContent>
					</Tabs>
				</CardContent>
			</Card>

			{/* Scientific Sources */}
			<h2 className="mt-12 mb-4 font-semibold text-2xl">Źródła Naukowe</h2>
			<Card>
				<CardContent className="pt-6">
					<ul className="space-y-4">
						<li className="border-b pb-3">
							<p className="font-medium">Lu HC, Mackie K. (2021)</p>
							<p className="text-gray-700">
								An introduction to the endogenous cannabinoid system.
							</p>
							<p className="text-gray-500 text-sm">
								Biological Psychiatry, 79(7), 516–525.
							</p>
						</li>
						<li className="border-b pb-3">
							<p className="font-medium">Zou S, Kumar U. (2018)</p>
							<p className="text-gray-700">
								Cannabinoid receptors and the endocannabinoid system: signaling
								and function in the central nervous system.
							</p>
							<p className="text-gray-500 text-sm">
								International Journal of Molecular Sciences, 19(3), 833.
							</p>
						</li>
						<li className="border-b pb-3">
							<p className="font-medium">Di Marzo V, Piscitelli F. (2015)</p>
							<p className="text-gray-700">
								The endocannabinoid system and its modulation by
								phytocannabinoids.
							</p>
							<p className="text-gray-500 text-sm">
								Neurotherapeutics, 12(4), 692–698.
							</p>
						</li>
						<li className="border-b pb-3">
							<p className="font-medium">
								Morena M, Patel S, Bains JS, Hill MN. (2016)
							</p>
							<p className="text-gray-700">
								Neurobiological interactions between stress and the
								endocannabinoid system.
							</p>
							<p className="text-gray-500 text-sm">
								Neuropsychopharmacology, 41(1), 80–102.
							</p>
						</li>
						<li className="border-b pb-3">
							<p className="font-medium">Pacher P, Bátkai S, Kunos G. (2006)</p>
							<p className="text-gray-700">
								The endocannabinoid system as an emerging target of
								pharmacotherapy.
							</p>
							<p className="text-gray-500 text-sm">
								Pharmacological Reviews, 58(3), 389–462.
							</p>
						</li>
						<li>
							<p className="font-medium">
								Cristino L, Bisogno T, Di Marzo V. (2020)
							</p>
							<p className="text-gray-700">
								Cannabinoids and the expanded endocannabinoid system in
								neurological disorders.
							</p>
							<p className="text-gray-500 text-sm">
								Nature Reviews Neurology, 16(1), 9–29.
							</p>
						</li>
					</ul>
				</CardContent>
			</Card>
		</div>
	);
}

// Helper functions
function translateEffectType(effectType: string): string {
	switch (effectType) {
		case "SUPPORTS":
			return "Wspiera";
		case "ENHANCES":
			return "Wzmacnia";
		case "PROTECTS":
			return "Chroni";
		case "REGULATES":
			return "Reguluje";
		case "MODULATES":
			return "Moduluje";
		default:
			return effectType;
	}
}

function translateEvidenceLevel(level: string): string {
	switch (level) {
		case "STRONG":
			return "Silny";
		case "MODERATE":
			return "Umiarkowany";
		case "WEAK":
			return "Słaby";
		case "INSUFFICIENT":
			return "Niewystarczający";
		default:
			return "Nieznany";
	}
}
