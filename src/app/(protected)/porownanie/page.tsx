/**
 * Supplement Comparison Page for Protected Route
 * This page allows users to compare different supplements
 */

"use client";

import { SupplementComparison } from "@/components/discovery";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
	Activity,
	AlertTriangle,
	BarChart3,
	Brain,
	CheckCircle,
	Clock,
	Eye,
	Heart,
	Minus,
	Pill,
	Plus,
	Search,
	Target,
	User,
	Zap,
} from "lucide-react";
import React, { useState } from "react";

// Mock supplement data for comparison
const mockSupplements = [
	{
		id: "alpha-gpc",
		name: "Alpha-GPC",
		polishName: "Alfa-GPC",
		category: "NOOTROPIC",
		polishCategory: "Nootropik",
		description: "Choline supplement that crosses the blood-brain barrier",
		polishDescription: "Suplement choliny, który przechodzi barierę krew-mózg",
		evidenceLevel: "STRONG",
		polishEvidenceLevel: "Silne",
		mechanisms: [
			{
				id: "cholinergic-enhancement",
				name: "Cholinergic enhancement",
				polishName: "Wzmacnianie cholinergiczne",
				description: "Increases acetylcholine levels",
				polishDescription: "Zwiększa poziom acetylocholiny",
			},
		],
		dosageGuidelines: {
			therapeuticRange: {
				min: 300,
				max: 1200,
				unit: "mg",
			},
			recommendedDose: "300-600mg daily",
			polishRecommendedDose: "300-600mg dziennie",
			timing: "Morning or afternoon",
			polishTiming: "Rano lub po południu",
			withFood: true,
			contraindications: ["bipolar disorder"],
			polishContraindications: ["zaburzenia dwubiegunowe"],
			interactions: [],
		},
		safetyProfile: {
			adverseEffects: [
				{
					effect: "Headache",
					polishEffect: "Ból głowy",
					frequency: "uncommon",
					severity: "mild",
					reversible: true,
				},
			],
			pregnancyCategory: "C",
			lactationSafety: "possibly_unsafe",
			pediatricUse: "Not recommended for children under 18",
			geriatricConsiderations:
				"May be beneficial for age-related cognitive decline",
		},
		qualityMarkers: {
			purity: 98,
			standardization: "Alpha-GPC content",
			contaminants: ["microbial contamination"],
			certifications: ["USP", "Pharmaceutical grade"],
		},
		researchStudies: [
			{
				title: "Alpha-GPC and power output; growth hormone response",
				polishTitle: "Alfa-GPC i siła wyjściowa; odpowiedź hormonu wzrostu",
				authors: ["Ziegenfuss T", "Landis J", "Hofheins J"],
				journal: "Journal of the International Society of Sports Nutrition",
				year: 2008,
				studyType: "randomized_controlled_trial",
				primaryOutcome: "Power output and growth hormone response",
				polishPrimaryOutcome: "Siła wyjściowa i odpowiedź hormonu wzrostu",
				findings:
					"Alpha-GPC supplementation increased power output and growth hormone response",
				polishFindings:
					"Suplementacja Alfa-GPC zwiększyła siłę wyjściową i odpowiedź hormonu wzrostu",
				evidenceLevel: "moderate",
				lastUpdated: "2024-01-15T00:00:00Z",
				pubmedId: "18834505",
			},
		],
		regulatoryStatus: {
			fda: "dietary_supplement",
			ema: "not_approved",
		},
		lastUpdated: "2024-01-15T00:00:00Z",
		createdAt: "2024-01-15T00:00:00Z",
		knowledgeNodeId: "node-1",
		tags: ["choline", "cognition", "memory"],
		polishTags: ["cholina", "poznanie", "pamięć"],
	},
	{
		id: "cdp-choline",
		name: "CDP-Choline",
		polishName: "CDP-Cholina",
		category: "NOOTROPIC",
		polishCategory: "Nootropik",
		description:
			"Cytidine diphosphate-choline, supports cognitive function and neuroprotection",
		polishDescription:
			"Cydynamidyna difosforan-cholina, wspiera funkcje poznawcze i neuroprotekcję",
		evidenceLevel: "MODERATE",
		polishEvidenceLevel: "Umiarkowane",
		mechanisms: [
			{
				id: "cholinergic-enhancement",
				name: "Cholinergic enhancement",
				polishName: "Wzmacnianie cholinergiczne",
				description: "Increases choline levels for acetylcholine synthesis",
				polishDescription: "Zwiększa poziom choliny dla syntezy acetylocholiny",
			},
			{
				id: "neuroprotection",
				name: "Neuroprotection",
				polishName: "Neuroprotekcja",
				description: "Protects neurons from damage",
				polishDescription: "Chroni neurony przed uszkodzeniami",
			},
		],
		dosageGuidelines: {
			therapeuticRange: {
				min: 250,
				max: 2000,
				unit: "mg",
			},
			recommendedDose: "250-500mg twice daily",
			polishRecommendedDose: "250-500mg dwa razy dziennie",
			timing: "Morning and afternoon",
			polishTiming: "Rano i po południu",
			withFood: true,
			contraindications: ["bipolar disorder"],
			polishContraindications: ["zaburzenia dwubiegunowe"],
			interactions: [],
		},
		safetyProfile: {
			adverseEffects: [
				{
					effect: "Headache",
					polishEffect: "Ból głowy",
					frequency: "uncommon",
					severity: "mild",
					reversible: true,
				},
				{
					effect: "Nausea",
					polishEffect: "Mdłości",
					frequency: "rare",
					severity: "mild",
					reversible: true,
				},
			],
		},
		researchStudies: [
			{
				title: "CDP-choline in the treatment of cognitive decline",
				polishTitle: "CDP-cholina w leczeniu upośledzenia poznawczego",
				authors: ["Sindlinger P", "Bleich A", "Frohlich D"],
				journal: "Neuropsychiatric Disease and Treatment",
				year: 2014,
				studyType: "randomized_controlled_trial",
				primaryOutcome: "Cognitive improvement in elderly subjects",
				polishPrimaryOutcome: "Poprawa funkcji poznawczych u osób starszych",
				findings:
					"CDP-choline showed modest cognitive benefits in elderly subjects",
				polishFindings:
					"CDP-cholina wykazała skromne korzyści poznawcze u osób starszych",
				evidenceLevel: "moderate",
				lastUpdated: "2024-01-15T00:00:00Z",
				pubmedId: "25561803",
			},
		],
		lastUpdated: "2024-01-15T00:00:00Z",
		createdAt: "2024-01-15T00:00:00Z",
		knowledgeNodeId: "node-2",
		tags: ["choline", "neuroprotection", "cognition"],
		polishTags: ["cholina", "neuroprotekcja", "poznanie"],
	},
	{
		id: "lions-mane",
		name: "Lion's Mane",
		polishName: "Soplówka jeżowata",
		category: "NOOTROPIC",
		polishCategory: "Nootropik",
		description:
			"Medicinal mushroom that supports nerve growth factor production",
		polishDescription:
			"Grzyb leczniczy wspierający produkcję czynnika wzrostu nerwów",
		evidenceLevel: "MODERATE",
		polishEvidenceLevel: "Umiarkowane",
		mechanisms: [
			{
				id: "ngf-enhancement",
				name: "Nerve Growth Factor enhancement",
				polishName: "Wzmacnianie czynnika wzrostu nerwów",
				description: "Stimulates NGF production for neurogenesis",
				polishDescription: "Stymuluje produkcję NGF dla neurogenezy",
			},
		],
		dosageGuidelines: {
			therapeuticRange: {
				min: 500,
				max: 3000,
				unit: "mg",
			},
			recommendedDose: "750-1500mg daily",
			polishRecommendedDose: "750-1500mg dziennie",
			timing: "Morning or afternoon",
			polishTiming: "Rano lub po południu",
			withFood: true,
			contraindications: ["allergy to mushrooms"],
			polishContraindications: ["alergia na grzyby"],
			interactions: [],
		},
		safetyProfile: {
			adverseEffects: [
				{
					effect: "Digestive upset",
					polishEffect: "Niesamowitości żołądkowe",
					frequency: "rare",
					severity: "mild",
					reversible: true,
				},
			],
		},
		researchStudies: [
			{
				title: "Lion's Mane and cognitive function",
				polishTitle: "Soplówka jeżowata i funkcje poznawcze",
				authors: ["Saitsu T", "Umeda T", "Wada M"],
				journal: "Journal of Functional Foods",
				year: 2017,
				studyType: "randomized_controlled_trial",
				primaryOutcome: "Cognitive improvement in elderly subjects",
				polishPrimaryOutcome: "Poprawa funkcji poznawczych u osób starszych",
				findings:
					"Lion's Mane improved cognitive function scores significantly",
				polishFindings:
					"Soplówka jeżowata znacząco poprawiła wyniki funkcji poznawczych",
				evidenceLevel: "moderate",
				lastUpdated: "2024-01-15T00:00:00Z",
				pubmedId: "28159261",
			},
		],
		lastUpdated: "2024-01-15T00:00:00Z",
		createdAt: "2024-01-15T00:00:00Z",
		knowledgeNodeId: "node-3",
		tags: ["mushroom", "neurogenesis", "cognition"],
		polishTags: ["grzyb", "neurogeneza", "poznanie"],
	},
	{
		id: "rhodiola",
		name: "Rhodiola",
		polishName: "Rhodiola",
		category: "ADAPTOGEN",
		polishCategory: "Adaptogen",
		description: "Arctic root that helps the body adapt to stress",
		polishDescription:
			"Korzeń arktyczny pomagający ciału adaptować się do stresu",
		evidenceLevel: "MODERATE",
		polishEvidenceLevel: "Umiarkowane",
		mechanisms: [
			{
				id: "stress-adaptation",
				name: "Stress adaptation",
				polishName: "Adaptacja do stresu",
				description: "Modulates stress response systems",
				polishDescription: "Moduluje systemy odpowiedzi na stres",
			},
		],
		dosageGuidelines: {
			therapeuticRange: {
				min: 200,
				max: 600,
				unit: "mg",
			},
			recommendedDose: "200-400mg daily",
			polishRecommendedDose: "200-400mg dziennie",
			timing: "Morning",
			polishTiming: "Rano",
			withFood: true,
			contraindications: ["bipolar disorder", "schizophrenia"],
			polishContraindications: ["zaburzenia dwubiegunowe", "schizofrenia"],
			interactions: [],
		},
		safetyProfile: {
			adverseEffects: [
				{
					effect: "Dizziness",
					polishEffect: "Zawroty głowy",
					frequency: "uncommon",
					severity: "mild",
					reversible: true,
				},
				{
					effect: "Dry mouth",
					polishEffect: "Suchość w ustach",
					frequency: "uncommon",
					severity: "mild",
					reversible: true,
				},
			],
		},
		researchStudies: [
			{
				title: "Rhodiola rosea in stress-related fatigue",
				polishTitle: "Rhodiola rosea w zmęczeniu związanym ze stresem",
				authors: ["Olsson EM", "von Schéele B", "Panossian AG"],
				journal: "Phytomedicine",
				year: 2009,
				studyType: "randomized_controlled_trial",
				primaryOutcome: "Reduction in stress-related fatigue",
				polishPrimaryOutcome: "Redukcja zmęczenia związanego ze stresem",
				findings: "Rhodiola significantly reduced stress-related fatigue",
				polishFindings:
					"Rhodiola znacząco zmniejszyła zmęczenie związane ze stresem",
				evidenceLevel: "moderate",
				lastUpdated: "2024-01-15T00:00:00Z",
				pubmedId: "19217294",
			},
		],
		lastUpdated: "2024-01-15T00:00:00Z",
		createdAt: "2024-01-15T00:00:00Z",
		knowledgeNodeId: "node-4",
		tags: ["adaptogen", "stress", "fatigue"],
		polishTags: ["adaptogen", "stres", "zmęczenie"],
	},
];

const SupplementComparisonPage = () => {
	const [selectedSupplements, setSelectedSupplements] = useState<string[]>([]);
	const [searchTerm, setSearchTerm] = useState("");

	// Filter supplements based on search
	const filteredSupplements = mockSupplements.filter(
		(supplement) =>
			supplement.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			supplement.polishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
			supplement.tags.some((tag) =>
				tag.toLowerCase().includes(searchTerm.toLowerCase()),
			) ||
			supplement.polishTags.some((tag) =>
				tag.toLowerCase().includes(searchTerm.toLowerCase()),
			),
	);

	const handleSupplementToggle = (supplementId: string) => {
		if (selectedSupplements.includes(supplementId)) {
			setSelectedSupplements(
				selectedSupplements.filter((id) => id !== supplementId),
			);
		} else {
			setSelectedSupplements([...selectedSupplements, supplementId]);
		}
	};

	const handleSelectAll = () => {
		setSelectedSupplements(mockSupplements.map((s) => s.id));
	};

	const handleClearAll = () => {
		setSelectedSupplements([]);
	};

	const selectedSupplementsData = mockSupplements.filter((s) =>
		selectedSupplements.includes(s.id),
	);

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<header className="border-b bg-white">
				<div className="container mx-auto px-4 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<BarChart3 className="h-8 w-8 text-blue-600" />
							<h1 className="font-bold text-2xl text-gray-900">
								Porównanie suplementów
							</h1>
						</div>
						<div className="flex items-center gap-4">
							<Badge variant="outline" className="flex items-center gap-1">
								<Zap className="h-4 w-4" />
								Premium
							</Badge>
							<Button variant="outline" size="sm">
								<User className="mr-2 h-4 w-4" />
								Profil
							</Button>
						</div>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="container mx-auto px-4 py-8">
				<div className="mb-8">
					<h2 className="mb-2 font-bold text-3xl">
						Porównanie właściwości suplementów
					</h2>
					<p className="text-gray-600">
						Porównaj właściwości, mechanizmy działania i skuteczność różnych
						suplementów
					</p>
				</div>

				{/* Action Bar */}
				<div className="mb-6 flex flex-wrap gap-4">
					<Button onClick={handleSelectAll} variant="outline" size="sm">
						<Plus className="mr-2 h-4 w-4" />
						Zaznacz wszystkie
					</Button>
					<Button onClick={handleClearAll} variant="outline" size="sm">
						<Minus className="mr-2 h-4 w-4" />
						Wyczyść wszystkie
					</Button>
					<div className="relative max-w-md flex-1">
						<Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform text-gray-400" />
						<input
							type="text"
							placeholder="Szukaj suplementów..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="w-full rounded-lg border py-2 pr-4 pl-10"
						/>
					</div>
				</div>

				<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
					{/* Supplement Selector */}
					<Card className="lg:col-span-1">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Search className="h-5 w-5" />
								Wybierz suplementy ({selectedSupplements.length})
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="max-h-96 space-y-3 overflow-y-auto">
								{filteredSupplements.map((supplement) => (
									<div
										key={supplement.id}
										className={`flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-colors ${
											selectedSupplements.includes(supplement.id)
												? "border-blue-200 bg-blue-50"
												: "hover:bg-gray-50"
										}`}
										onClick={() => handleSupplementToggle(supplement.id)}
									>
										<div>
											<h3 className="font-medium">{supplement.polishName}</h3>
											<p className="text-gray-600 text-sm">{supplement.name}</p>
											<div className="mt-1 flex items-center gap-2">
												<Badge variant="outline">
													{supplement.polishCategory}
												</Badge>
												<Badge
													className={
														supplement.evidenceLevel === "STRONG"
															? "bg-green-100 text-green-800"
															: supplement.evidenceLevel === "MODERATE"
																? "bg-yellow-100 text-yellow-800"
																: supplement.evidenceLevel === "WEAK"
																	? "bg-orange-100 text-orange-800"
																	: "bg-red-100 text-red-800"
													}
												>
													{supplement.polishEvidenceLevel}
												</Badge>
											</div>
										</div>
										<Button
											size="sm"
											variant="outline"
											className={
												selectedSupplements.includes(supplement.id)
													? "bg-blue-600 text-white"
													: ""
											}
										>
											{selectedSupplements.includes(supplement.id) ? (
												<CheckCircle className="h-4 w-4" />
											) : (
												<Plus className="h-4 w-4" />
											)}
										</Button>
									</div>
								))}
							</div>
						</CardContent>
					</Card>

					{/* Comparison Results */}
					<div className="lg:col-span-2">
						{selectedSupplements.length < 2 ? (
							<Card>
								<CardContent className="flex h-96 items-center justify-center">
									<div className="text-center">
										<Pill className="mx-auto mb-4 h-12 w-12 text-gray-400" />
										<h3 className="mb-2 font-medium text-gray-900 text-lg">
											Wybierz co najmniej 2 suplementy
										</h3>
										<p className="text-gray-600">
											Zaznacz suplementy z listy, aby je porównać
										</p>
									</div>
								</CardContent>
							</Card>
						) : (
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<Target className="h-5 w-5" />
										Porównanie suplementów ({selectedSupplements.length})
									</CardTitle>
								</CardHeader>
								<CardContent>
									<SupplementComparison
										supplements={[]}
										onRemoveSupplement={(id) => console.log("Remove:", id)}
										onViewDetails={(id) => console.log("View:", id)}
									/>
								</CardContent>
							</Card>
						)}
					</div>
				</div>

				{/* Detailed Comparison */}
				{selectedSupplements.length >= 2 && (
					<div className="mt-8">
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Zap className="h-5 w-5" />
									Szczegółowe porównanie
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="overflow-x-auto">
									<table className="w-full">
										<thead>
											<tr className="border-b">
												<th className="p-3 text-left">Właściwość</th>
												{selectedSupplementsData.map((supplement) => (
													<th key={supplement.id} className="p-3 text-center">
														<div className="flex flex-col items-center">
															<span className="font-medium">
																{supplement.polishName}
															</span>
															<Badge variant="outline">
																{supplement.polishCategory}
															</Badge>
														</div>
													</th>
												))}
											</tr>
										</thead>
										<tbody className="divide-y">
											<tr>
												<td className="p-3 font-medium">Opis</td>
												{selectedSupplementsData.map((supplement) => (
													<td
														key={`desc-${supplement.id}`}
														className="p-3 text-center text-sm"
													>
														{supplement.polishDescription}
													</td>
												))}
											</tr>
											<tr>
												<td className="p-3 font-medium">Dawkowanie</td>
												{selectedSupplementsData.map((supplement) => (
													<td
														key={`dose-${supplement.id}`}
														className="p-3 text-center"
													>
														<span className="rounded bg-blue-50 px-2 py-1 text-sm">
															{
																supplement.dosageGuidelines
																	.polishRecommendedDose
															}
														</span>
													</td>
												))}
											</tr>
											<tr>
												<td className="p-3 font-medium">Poziom dowodów</td>
												{selectedSupplementsData.map((supplement) => (
													<td
														key={`evidence-${supplement.id}`}
														className="p-3 text-center"
													>
														<Badge
															className={
																supplement.evidenceLevel === "STRONG"
																	? "bg-green-100 text-green-800"
																	: supplement.evidenceLevel === "MODERATE"
																		? "bg-yellow-100 text-yellow-800"
																		: supplement.evidenceLevel === "WEAK"
																			? "bg-orange-100 text-orange-800"
																			: "bg-red-100 text-red-800"
															}
														>
															{supplement.polishEvidenceLevel}
														</Badge>
													</td>
												))}
											</tr>
											<tr>
												<td className="p-3 font-medium">Czas działania</td>
												{selectedSupplementsData.map((supplement) => (
													<td
														key={`timing-${supplement.id}`}
														className="p-3 text-center text-sm"
													>
														{supplement.dosageGuidelines.polishTiming}
													</td>
												))}
											</tr>
											<tr>
												<td className="p-3 font-medium">Skuteczność</td>
												{selectedSupplementsData.map((supplement) => (
													<td
														key={`effect-${supplement.id}`}
														className="p-3 text-center"
													>
														<div className="flex items-center justify-center">
															<div className="mr-2 h-2 w-24 rounded-full bg-gray-200">
																<div
																	className="h-2 rounded-full bg-green-600"
																	style={{
																		width: `${supplement.evidenceLevel === "STRONG" ? "90%" : supplement.evidenceLevel === "MODERATE" ? "70%" : "40%"}`,
																	}}
																/>
															</div>
															<span className="text-xs">
																{supplement.evidenceLevel === "STRONG"
																	? "90%"
																	: supplement.evidenceLevel === "MODERATE"
																		? "70%"
																		: "40%"}
															</span>
														</div>
													</td>
												))}
											</tr>
										</tbody>
									</table>
								</div>
							</CardContent>
						</Card>
					</div>
				)}

				{/* Mechanism Comparison */}
				{selectedSupplements.length >= 2 && (
					<div className="mt-8">
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Brain className="h-5 w-5" />
									Porównanie mechanizmów działania
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									{Array.from(
										new Set(
											selectedSupplementsData.flatMap((s) =>
												s.mechanisms.map((m) => m.polishName),
											),
										),
									).map((mechanism) => (
										<div key={mechanism} className="rounded-lg border p-4">
											<h3 className="mb-2 font-medium">{mechanism}</h3>
											<div className="flex flex-wrap gap-2">
												{selectedSupplementsData
													.filter((supplement) =>
														supplement.mechanisms.some(
															(m) => m.polishName === mechanism,
														),
													)
													.map((supplement) => (
														<Badge
															key={`${supplement.id}-${mechanism}`}
															variant="secondary"
														>
															{supplement.polishName}
														</Badge>
													))}
											</div>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					</div>
				)}
			</main>

			{/* Footer */}
			<footer className="mt-12 border-t bg-white">
				<div className="container mx-auto px-4 py-6">
					<div className="flex flex-col items-center justify-between gap-4 md:flex-row">
						<div className="flex items-center gap-2">
							<BarChart3 className="h-5 w-5 text-blue-600" />
							<span className="font-medium">Suplementor</span>
							<span className="text-gray-500 text-sm">© 2025</span>
						</div>
						<div className="flex items-center gap-4 text-gray-600 text-sm">
							<span>Ochrona prywatności</span>
							<span>Regulamin</span>
							<span>Pomoc</span>
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
};

export default SupplementComparisonPage;
