import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	AlertTriangle,
	BookOpen,
	Brain,
	Calculator,
	CheckCircle,
	Clock,
	Heart,
	Shield,
	Star,
	TrendingUp,
	Users,
	Zap,
} from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type React from "react";
import { Suspense } from "react";

import EvidenceBasedInformationPanel from "@/components/evidence/EvidenceBasedInformationPanel";
import DrugInteractionChecker from "@/components/interactions/DrugInteractionChecker";
import ResearchStudyCard from "@/components/learning/ResearchStudyCard";
// Component imports
import ComprehensiveSupplementCard from "@/components/supplements/ComprehensiveSupplementCard";
import DosageCalculator from "@/components/supplements/DosageCalculator";
import InteractionMatrix from "@/components/supplements/InteractionMatrix";
import SafetyChecker from "@/components/supplements/SafetyChecker";
import SupplementDetailPanel from "@/components/supplements/SupplementDetailPanel";
import SynergyAnalyzer from "@/components/supplements/SynergyAnalyzer";
import BrainRegionDiagram from "@/components/visualization/BrainRegionDiagram";
import SupplementEffectChart from "@/components/visualization/SupplementEffectChart";
import SupplementInteractionNetwork from "@/components/visualization/SupplementInteractionNetwork";
import RelatedHistory from "@/components/history/RelatedHistory";
import { api } from "@/trpc/server";

interface SupplementDetailPageProps {
	params: {
		id: string;
	};
}

interface SupplementData {
	id: string;
	name: string;
	polishName: string;
	category: string;
	polishCategory: string;
	description: string;
	polishDescription: string;
	safetyRating: number;
	evidenceLevel: "STRONG" | "MODERATE" | "WEAK" | "ANECDOTAL";
	polishEvidenceLevel: string;
	primaryBenefits: string[];
	polishPrimaryBenefits: string[];
	mechanismOfAction: string;
	polishMechanismOfAction: string;
	dosageRange: {
		min: number;
		max: number;
		unit: string;
		frequency: string;
	};
	sideEffects: string[];
	polishSideEffects: string[];
	contraindications: string[];
	polishContraindications: string[];
	interactions: string[];
	brainRegions: string[];
	studyCount: number;
	userRating: number;
	price: {
		min: number;
		max: number;
		currency: string;
	};
}

// Mock data - in production this would come from API
const mockSupplementData: Record<string, SupplementData> = {
	"omega-3": {
		id: "omega-3",
		name: "Omega-3 Fatty Acids",
		polishName: "Kwasy Tłuszczowe Omega-3",
		category: "Essential Fatty Acids",
		polishCategory: "Niezbędne Kwasy Tłuszczowe",
		description:
			"Essential polyunsaturated fatty acids crucial for brain health and cardiovascular function.",
		polishDescription:
			"Niezbędne wielonienasycone kwasy tłuszczowe kluczowe dla zdrowia mózgu i funkcji sercowo-naczyniowych.",
		safetyRating: 9.2,
		evidenceLevel: "STRONG",
		polishEvidenceLevel: "Silne",
		primaryBenefits: [
			"Brain Health",
			"Heart Health",
			"Anti-inflammatory",
			"Mood Support",
		],
		polishPrimaryBenefits: [
			"Zdrowie Mózgu",
			"Zdrowie Serca",
			"Przeciwzapalne",
			"Wsparcie Nastroju",
		],
		mechanismOfAction:
			"Incorporates into cell membranes, modulates inflammation, supports neurotransmitter function",
		polishMechanismOfAction:
			"Wbudowuje się w błony komórkowe, moduluje stan zapalny, wspiera funkcję neuroprzekaźników",
		dosageRange: {
			min: 1000,
			max: 3000,
			unit: "mg",
			frequency: "daily",
		},
		sideEffects: ["Fishy aftertaste", "Mild digestive upset", "Blood thinning"],
		polishSideEffects: [
			"Rybny posmak",
			"Łagodne dolegliwości trawienne",
			"Rozrzedzenie krwi",
		],
		contraindications: [
			"Bleeding disorders",
			"Upcoming surgery",
			"Fish allergies",
		],
		polishContraindications: [
			"Zaburzenia krzepnięcia",
			"Planowana operacja",
			"Alergia na ryby",
		],
		interactions: ["Warfarin", "Aspirin", "Blood thinners"],
		brainRegions: ["hippocampus", "prefrontal-cortex", "amygdala"],
		studyCount: 1247,
		userRating: 4.6,
		price: {
			min: 25,
			max: 80,
			currency: "PLN",
		},
	},
};

export async function generateMetadata({
	params,
}: SupplementDetailPageProps): Promise<Metadata> {
	try {
		const supplement = await api.supplement.getById({ id: params.id });

		return {
			title: `${supplement.polishName} | SUPLEMENTOR - Szczegółowa Analiza`,
			description: `Kompleksowa analiza ${supplement.polishName}: mechanizm działania, dawkowanie, interakcje, badania naukowe i bezpieczeństwo stosowania.`,
			keywords: `${supplement.polishName}, ${supplement.name}, suplementy, dawkowanie, interakcje, badania naukowe`,
			openGraph: {
				title: `${supplement.polishName} | SUPLEMENTOR`,
				description: supplement.polishDescription,
				type: "article",
				locale: "pl_PL",
			},
		};
	} catch {
		return {
			title: "Suplement nie znaleziony | SUPLEMENTOR",
			description:
				"Szukany suplement nie został znaleziony w naszej bazie danych.",
		};
	}
}

const SupplementDetailPage: React.FC<SupplementDetailPageProps> = async ({
	params,
}) => {
	let supplement;
	let supplementMongoId: string | undefined;

	try {
		const data = await api.supplement.getById({ id: params.id });
		supplement = data;
		// Extract MongoDB _id for RelatedHistory
		supplementMongoId = (data as any)._id?.toString();
	} catch {
		notFound();
	}

	// Fallback to mock data if real data doesn't have required fields
	const displayData = {
		...mockSupplementData[params.id],
		...supplement,
	};

	const handleDosageCalculated = (dosage: any) => {
		console.log("Calculated dosage:", dosage);
	};

	const handleInteractionFound = (interaction: any) => {
		console.log("Interaction found:", interaction);
	};

	const handleSynergyAnalyzed = (synergy: any) => {
		console.log("Synergy analyzed:", synergy);
	};

	const handleStudySelect = (study: any) => {
		console.log("Selected study:", study);
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
			<div className="container mx-auto space-y-8 px-4 py-8">
				{/* Header Section */}
				<div className="flex flex-col items-start justify-between gap-6 lg:flex-row">
					<div className="flex-1">
						<div className="mb-4 flex items-center gap-3">
							<Badge variant="secondary" className="text-sm">
								{displayData.polishCategory}
							</Badge>
							<Badge
								variant={
									displayData.evidenceLevel === "STRONG" ? "default" : "outline"
								}
								className="text-sm"
							>
								Dowody: {displayData.polishEvidenceLevel}
							</Badge>
							<div className="flex items-center gap-1">
								<Star className="h-4 w-4 fill-current text-yellow-500" />
								<span className="font-medium text-sm">
									{displayData.userRating}
								</span>
							</div>
						</div>

						<h1 className="mb-2 font-bold text-4xl text-gray-900">
							{displayData.polishName}
						</h1>
						<p className="mb-4 text-gray-600 text-lg">
							{displayData.polishDescription}
						</p>

						<div className="mb-6 flex flex-wrap gap-2">
							{displayData.polishPrimaryBenefits.map((benefit: string, index: number) => (
								<Badge key={index} variant="outline" className="text-sm">
									{benefit}
								</Badge>
							))}
						</div>
					</div>

					<div className="flex flex-col gap-3">
						<Button className="gap-2">
							<Heart className="h-4 w-4" />
							Dodaj do Ulubionych
						</Button>
						<Button variant="outline" className="gap-2">
							<Calculator className="h-4 w-4" />
							Kalkulator Dawki
						</Button>
						<Button variant="outline" className="gap-2">
							<Shield className="h-4 w-4" />
							Sprawdź Bezpieczeństwo
						</Button>
					</div>
				</div>

				{/* Safety Alert */}
				{displayData.safetyRating < 8 && (
					<Alert className="border-yellow-200 bg-yellow-50">
						<AlertTriangle className="h-4 w-4 text-yellow-600" />
						<AlertDescription className="text-yellow-800">
							Ten suplement wymaga szczególnej ostrożności. Skonsultuj się z
							lekarzem przed rozpoczęciem suplementacji.
						</AlertDescription>
					</Alert>
				)}

				{/* Main Content */}
				<div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
					{/* Sidebar */}
					<div className="space-y-6 lg:col-span-1">
						{/* Quick Stats */}
						<Card>
							<CardHeader>
								<CardTitle className="text-lg">Szybkie Informacje</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="flex items-center justify-between">
									<span className="text-gray-600 text-sm">
										Ocena Bezpieczeństwa
									</span>
									<div className="flex items-center gap-2">
										<div className="h-2 w-16 overflow-hidden rounded-full bg-gray-200">
											<div
												className="h-full rounded-full bg-green-500"
												style={{ width: `${displayData.safetyRating * 10}%` }}
											/>
										</div>
										<span className="font-medium text-sm">
											{displayData.safetyRating}/10
										</span>
									</div>
								</div>

								<div className="flex items-center justify-between">
									<span className="text-gray-600 text-sm">Badania Naukowe</span>
									<span className="font-medium text-sm">
										{displayData.studyCount.toLocaleString("pl-PL")}
									</span>
								</div>

								<div className="flex items-center justify-between">
									<span className="text-gray-600 text-sm">Zakres Cen</span>
									<span className="font-medium text-sm">
										{displayData.price.min}-{displayData.price.max}{" "}
										{displayData.price.currency}
									</span>
								</div>

								<div className="flex items-center justify-between">
									<span className="text-gray-600 text-sm">Dawka Dzienna</span>
									<span className="font-medium text-sm">
										{displayData.dosageRange.min}-{displayData.dosageRange.max}{" "}
										{displayData.dosageRange.unit}
									</span>
								</div>
							</CardContent>
						</Card>

						{/* Safety Checker */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2 text-lg">
									<Shield className="h-5 w-5 text-green-600" />
									Sprawdzenie Bezpieczeństwa
								</CardTitle>
							</CardHeader>
							<CardContent>
								<SafetyChecker />
							</CardContent>
						</Card>

						{/* Dosage Calculator */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2 text-lg">
									<Calculator className="h-5 w-5 text-blue-600" />
									Kalkulator Dawki
								</CardTitle>
							</CardHeader>
							<CardContent>
								<DosageCalculator />
							</CardContent>
						</Card>
					</div>

					{/* Main Content Area */}
					<div className="lg:col-span-3">
						<Tabs defaultValue="overview" className="space-y-6">
							<TabsList className="grid w-full grid-cols-6">
								<TabsTrigger value="overview">Przegląd</TabsTrigger>
								<TabsTrigger value="mechanism">Mechanizm</TabsTrigger>
								<TabsTrigger value="interactions">Interakcje</TabsTrigger>
								<TabsTrigger value="research">Badania</TabsTrigger>
								<TabsTrigger value="effects">Efekty</TabsTrigger>
								<TabsTrigger value="brain">Mózg</TabsTrigger>
							</TabsList>

							{/* Overview Tab */}
							<TabsContent value="overview" className="space-y-6">
								<div className="py-12 text-center text-gray-500">
									Szczegółowe informacje o suplemencie
								</div>

								<div className="py-12 text-center text-gray-500">
									Szczegółowe informacje o mechanizmach działania
								</div>
									{/* Historia powiązana */}
									<RelatedHistory supplementMongoId={supplementMongoId} />

							</TabsContent>

							{/* Mechanism Tab */}
							<TabsContent value="mechanism" className="space-y-6">
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center gap-2">
											<Zap className="h-5 w-5 text-yellow-500" />
											Mechanizm Działania
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="prose max-w-none">
											<p className="text-gray-700 leading-relaxed">
												{displayData.polishMechanismOfAction}
											</p>
										</div>
									</CardContent>
								</Card>

								<Card>
									<CardHeader>
										<CardTitle>Analiza Synergii</CardTitle>
									</CardHeader>
									<CardContent>
										<SynergyAnalyzer />
									</CardContent>
								</Card>
							</TabsContent>

							{/* Interactions Tab */}
							<TabsContent value="interactions" className="space-y-6">
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center gap-2">
											<AlertTriangle className="h-5 w-5 text-orange-500" />
											Macierz Interakcji
										</CardTitle>
									</CardHeader>
									<CardContent>
										<InteractionMatrix />
									</CardContent>
								</Card>

								<Card>
									<CardHeader>
										<CardTitle>Sprawdzenie Interakcji z Lekami</CardTitle>
									</CardHeader>
									<CardContent>
										<DrugInteractionChecker
											onInteractionFound={(interactions) =>
												console.log("Interactions:", interactions)
											}
											onGenerateReport={(meds, supps, ints) =>
												console.log("Report:", meds, supps, ints)
											}
										/>
									</CardContent>
								</Card>

								<Card>
									<CardHeader>
										<CardTitle>Sieć Interakcji</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="h-96">
											<SupplementInteractionNetwork
												supplements={[]}
												interactions={[]}
												onSupplementSelect={(id) =>
													console.log("Selected:", id)
												}
												onInteractionSelect={(interaction) =>
													console.log("Interaction:", interaction)
												}
											/>
										</div>
									</CardContent>
								</Card>
							</TabsContent>

							{/* Research Tab */}
							<TabsContent value="research" className="space-y-6">
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center gap-2">
											<BookOpen className="h-5 w-5 text-purple-500" />
											Dowody Naukowe
										</CardTitle>
									</CardHeader>
									<CardContent>
										<EvidenceBasedInformationPanel
											supplementId={displayData.id}
											condition="cognitive enhancement"
											polishCondition="poprawa funkcji poznawczych"
										/>
									</CardContent>
								</Card>

								<div className="py-12 text-center text-gray-500">
									Badania naukowe dotyczące tego suplementu
								</div>
							</TabsContent>

							{/* Effects Tab */}
							<TabsContent value="effects" className="space-y-6">
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center gap-2">
											<TrendingUp className="h-5 w-5 text-green-500" />
											Wykres Efektów w Czasie
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="h-96">
											<SupplementEffectChart
												supplementData={{
													supplementId: displayData.id,
													supplementName: displayData.name,
													polishSupplementName: displayData.polishName,
													neurotransmitterEffects: [],
													brainRegionEffects: [],
													effectTimeline: [],
													overallRating: 0,
													studyCount: 0,
												}}
											/>
										</div>
									</CardContent>
								</Card>

								<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
									<Card>
										<CardHeader>
											<CardTitle>Działania Niepożądane</CardTitle>
										</CardHeader>
										<CardContent>
											<ul className="space-y-2">
												{displayData.polishSideEffects.map((effect: string, index: number) => (
													<li
														key={index}
														className="flex items-center gap-2 text-sm"
													>
														<div className="h-2 w-2 rounded-full bg-yellow-400" />
														{effect}
													</li>
												))}
											</ul>
										</CardContent>
									</Card>

									<Card>
										<CardHeader>
											<CardTitle>Przeciwwskazania</CardTitle>
										</CardHeader>
										<CardContent>
											<ul className="space-y-2">
												{displayData.polishContraindications.map(
													(contraindication: string, index: number) => (
														<li
															key={index}
															className="flex items-center gap-2 text-sm"
														>
															<div className="h-2 w-2 rounded-full bg-red-400" />
															{contraindication}
														</li>
													),
												)}
											</ul>
										</CardContent>
									</Card>
								</div>
							</TabsContent>

							{/* Brain Tab */}
							<TabsContent value="brain" className="space-y-6">
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center gap-2">
											<Brain className="h-5 w-5 text-purple-500" />
											Wpływ na Regiony Mózgu
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="h-96">
											<BrainRegionDiagram
												brainRegions={[]}
												onRegionSelect={(regionId) =>
													console.log("Selected region:", regionId)
												}
												onSupplementSelect={(supplementId) =>
													console.log("Selected supplement:", supplementId)
												}
											/>
										</div>
									</CardContent>
								</Card>

								<Card>
									<CardHeader>
										<CardTitle>Mechanizmy Neurobiologiczne</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="prose max-w-none">
											<p className="text-gray-700 leading-relaxed">
												{displayData.polishName} wpływa na funkcjonowanie mózgu
												poprzez modulację błon komórkowych neuronów, wpływ na
												syntezę neuroprzekaźników oraz regulację procesów
												zapalnych w tkance nerwowej.
											</p>
										</div>
									</CardContent>
								</Card>
							</TabsContent>
						</Tabs>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SupplementDetailPage;
