"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
	Activity,
	AlertTriangle,
	Brain,
	ChevronDown,
	ChevronUp,
	Clock,
	Download,
	ExternalLink,
	Eye,
	Heart,
	Info,
	Pill,
	Plus,
	Search,
	Shield,
	X,
	Zap,
} from "lucide-react";
import type React from "react";
import { useCallback, useMemo, useState } from "react";

interface Medication {
	id: string;
	name: string;
	polishName: string;
	genericName: string;
	polishGenericName: string;
	dosage: string;
	frequency: string;
	polishFrequency: string;
}

interface Supplement {
	id: string;
	name: string;
	polishName: string;
	dosage: string;
	frequency: string;
	polishFrequency: string;
}

interface Interaction {
	id: string;
	drugName: string;
	polishDrugName: string;
	supplementName: string;
	polishSupplementName: string;
	severity: "LIFE_THREATENING" | "SEVERE" | "MODERATE" | "MILD" | "NEGLIGIBLE";
	polishSeverity: string;
	type: "MAJOR" | "MODERATE" | "MINOR" | "THEORETICAL" | "BENEFICIAL";
	polishType: string;
	mechanism: string;
	polishMechanism: string;
	description: string;
	polishDescription: string;
	recommendation:
		| "AVOID"
		| "MONITOR_CLOSELY"
		| "ADJUST_DOSE"
		| "SEPARATE_TIMING"
		| "CAUTION"
		| "SAFE";
	polishRecommendation: string;
	management: Array<{
		strategy: string;
		polishStrategy: string;
		description: string;
		polishDescription: string;
	}>;
	monitoringParameters: Array<{
		parameter: string;
		polishParameter: string;
		frequency: string;
		polishFrequency: string;
		warningSignals: string[];
		polishWarningSignals: string[];
	}>;
	evidenceLevel: "STRONG" | "MODERATE" | "WEAK" | "THEORETICAL";
	polishEvidenceLevel: string;
	timingSeparation?: {
		required: boolean;
		minimumHours: number;
		optimalHours: number;
		reason: string;
		polishReason: string;
	};
}

interface DrugInteractionCheckerProps {
	onInteractionFound: (interactions: Interaction[]) => void;
	onGenerateReport: (
		medications: Medication[],
		supplements: Supplement[],
		interactions: Interaction[],
	) => void;
	className?: string;
}

const DrugInteractionChecker: React.FC<DrugInteractionCheckerProps> = ({
	onInteractionFound,
	onGenerateReport,
	className = "",
}) => {
	const [medications, setMedications] = useState<Medication[]>([]);
	const [supplements, setSupplements] = useState<Supplement[]>([]);
	const [interactions, setInteractions] = useState<Interaction[]>([]);
	const [isChecking, setIsChecking] = useState(false);
	const [expandedInteraction, setExpandedInteraction] = useState<string | null>(
		null,
	);
	const [searchTerm, setSearchTerm] = useState("");

	// Mock data - in real app this would come from API
	const mockInteractions: Interaction[] = [
		{
			id: "warfarin-vitamin-k",
			drugName: "Warfarin",
			polishDrugName: "Warfaryna",
			supplementName: "Vitamin K",
			polishSupplementName: "Witamina K",
			severity: "SEVERE",
			polishSeverity: "Ciężka",
			type: "MAJOR",
			polishType: "Główna",
			mechanism: "Vitamin K antagonizes warfarin's anticoagulant effect",
			polishMechanism:
				"Witamina K antagonizuje działanie antykoagulacyjne warfaryny",
			description:
				"Vitamin K can significantly reduce warfarin effectiveness, increasing risk of thrombosis",
			polishDescription:
				"Witamina K może znacząco zmniejszyć skuteczność warfaryny, zwiększając ryzyko zakrzepicy",
			recommendation: "MONITOR_CLOSELY",
			polishRecommendation: "Ścisłe monitorowanie",
			management: [
				{
					strategy: "INR monitoring",
					polishStrategy: "Monitorowanie INR",
					description:
						"Check INR more frequently when starting or stopping vitamin K",
					polishDescription:
						"Sprawdzaj INR częściej przy rozpoczynaniu lub przerywaniu witaminy K",
				},
				{
					strategy: "Consistent intake",
					polishStrategy: "Stałe spożycie",
					description: "Maintain consistent daily vitamin K intake",
					polishDescription: "Utrzymuj stałe dzienne spożycie witaminy K",
				},
			],
			monitoringParameters: [
				{
					parameter: "INR (International Normalized Ratio)",
					polishParameter: "INR (Międzynarodowy Wskaźnik Znormalizowany)",
					frequency: "Weekly initially, then monthly",
					polishFrequency: "Początkowo tygodniowo, potem miesięcznie",
					warningSignals: ["INR < 2.0", "Signs of clotting"],
					polishWarningSignals: ["INR < 2,0", "Oznaki zakrzepów"],
				},
			],
			evidenceLevel: "STRONG",
			polishEvidenceLevel: "Silne",
		},
		{
			id: "metformin-chromium",
			drugName: "Metformin",
			polishDrugName: "Metformina",
			supplementName: "Chromium",
			polishSupplementName: "Chrom",
			severity: "MODERATE",
			polishSeverity: "Umiarkowana",
			type: "BENEFICIAL",
			polishType: "Korzystna",
			mechanism:
				"Chromium may enhance insulin sensitivity synergistically with metformin",
			polishMechanism:
				"Chrom może synergicznie z metforminą zwiększać wrażliwość na insulinę",
			description:
				"Chromium supplementation may enhance metformin's glucose-lowering effects",
			polishDescription:
				"Suplementacja chromu może wzmocnić działanie metforminy obniżające glukozę",
			recommendation: "MONITOR_CLOSELY",
			polishRecommendation: "Ścisłe monitorowanie",
			management: [
				{
					strategy: "Blood glucose monitoring",
					polishStrategy: "Monitorowanie glukozy we krwi",
					description: "Monitor blood glucose more frequently for hypoglycemia",
					polishDescription:
						"Monitoruj glukozę we krwi częściej pod kątem hipoglikemii",
				},
			],
			monitoringParameters: [
				{
					parameter: "Fasting glucose",
					polishParameter: "Glukoza na czczo",
					frequency: "Weekly for first month",
					polishFrequency: "Tygodniowo przez pierwszy miesiąc",
					warningSignals: ["Glucose < 70 mg/dL", "Hypoglycemic symptoms"],
					polishWarningSignals: ["Glukoza < 70 mg/dL", "Objawy hipoglikemii"],
				},
			],
			evidenceLevel: "MODERATE",
			polishEvidenceLevel: "Umiarkowane",
		},
	];

	const getSeverityColor = (severity: string) => {
		switch (severity) {
			case "LIFE_THREATENING":
				return "bg-red-100 text-red-800 border-red-300";
			case "SEVERE":
				return "bg-red-100 text-red-800 border-red-300";
			case "MODERATE":
				return "bg-orange-100 text-orange-800 border-orange-300";
			case "MILD":
				return "bg-yellow-100 text-yellow-800 border-yellow-300";
			case "NEGLIGIBLE":
				return "bg-green-100 text-green-800 border-green-300";
			default:
				return "bg-gray-100 text-gray-800 border-gray-300";
		}
	};

	const getRecommendationColor = (recommendation: string) => {
		switch (recommendation) {
			case "AVOID":
				return "bg-red-100 text-red-800";
			case "MONITOR_CLOSELY":
				return "bg-orange-100 text-orange-800";
			case "ADJUST_DOSE":
				return "bg-yellow-100 text-yellow-800";
			case "SEPARATE_TIMING":
				return "bg-blue-100 text-blue-800";
			case "CAUTION":
				return "bg-purple-100 text-purple-800";
			case "SAFE":
				return "bg-green-100 text-green-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const addMedication = () => {
		const newMedication: Medication = {
			id: `med_${Date.now()}`,
			name: "",
			polishName: "",
			genericName: "",
			polishGenericName: "",
			dosage: "",
			frequency: "",
			polishFrequency: "",
		};
		setMedications([...medications, newMedication]);
	};

	const addSupplement = () => {
		const newSupplement: Supplement = {
			id: `supp_${Date.now()}`,
			name: "",
			polishName: "",
			dosage: "",
			frequency: "",
			polishFrequency: "",
		};
		setSupplements([...supplements, newSupplement]);
	};

	const removeMedication = (id: string) => {
		setMedications(medications.filter((med) => med.id !== id));
	};

	const removeSupplement = (id: string) => {
		setSupplements(supplements.filter((supp) => supp.id !== id));
	};

	const updateMedication = (
		id: string,
		field: keyof Medication,
		value: string,
	) => {
		setMedications(
			medications.map((med) =>
				med.id === id ? { ...med, [field]: value } : med,
			),
		);
	};

	const updateSupplement = (
		id: string,
		field: keyof Supplement,
		value: string,
	) => {
		setSupplements(
			supplements.map((supp) =>
				supp.id === id ? { ...supp, [field]: value } : supp,
			),
		);
	};

	const checkInteractions = useCallback(async () => {
		setIsChecking(true);

		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 2000));

		// Mock interaction detection
		const foundInteractions = mockInteractions.filter(
			(interaction) =>
				medications.some(
					(med) =>
						med.name
							.toLowerCase()
							.includes(interaction.drugName.toLowerCase()) ||
						med.polishName
							.toLowerCase()
							.includes(interaction.polishDrugName.toLowerCase()),
				) &&
				supplements.some(
					(supp) =>
						supp.name
							.toLowerCase()
							.includes(interaction.supplementName.toLowerCase()) ||
						supp.polishName
							.toLowerCase()
							.includes(interaction.polishSupplementName.toLowerCase()),
				),
		);

		setInteractions(foundInteractions);
		onInteractionFound(foundInteractions);
		setIsChecking(false);
	}, [medications, supplements, onInteractionFound]);

	const generateReport = () => {
		onGenerateReport(medications, supplements, interactions);
	};

	const filteredInteractions = useMemo(() => {
		if (!searchTerm) return interactions;
		return interactions.filter(
			(interaction) =>
				interaction.polishDrugName
					.toLowerCase()
					.includes(searchTerm.toLowerCase()) ||
				interaction.polishSupplementName
					.toLowerCase()
					.includes(searchTerm.toLowerCase()) ||
				interaction.polishDescription
					.toLowerCase()
					.includes(searchTerm.toLowerCase()),
		);
	}, [interactions, searchTerm]);

	const interactionSummary = useMemo(() => {
		const summary = {
			total: interactions.length,
			severe: interactions.filter(
				(i) => i.severity === "SEVERE" || i.severity === "LIFE_THREATENING",
			).length,
			moderate: interactions.filter((i) => i.severity === "MODERATE").length,
			mild: interactions.filter(
				(i) => i.severity === "MILD" || i.severity === "NEGLIGIBLE",
			).length,
		};
		return summary;
	}, [interactions]);

	return (
		<div className={cn("w-full space-y-6", className)}>
			{/* Header */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Shield className="h-5 w-5 text-blue-600" />
						Sprawdzanie Interakcji Lekowych
					</CardTitle>
					<p className="text-gray-600">
						Sprawdź potencjalne interakcje między Twoimi lekami a suplementami
					</p>
				</CardHeader>
			</Card>

			{/* Input Section */}
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
				{/* Medications */}
				<Card>
					<CardHeader>
						<div className="flex items-center justify-between">
							<CardTitle className="flex items-center gap-2">
								<Pill className="h-4 w-4 text-red-600" />
								Leki ({medications.length})
							</CardTitle>
							<Button onClick={addMedication} size="sm">
								<Plus className="mr-1 h-3 w-3" />
								Dodaj lek
							</Button>
						</div>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{medications.length === 0 ? (
								<div className="py-8 text-center text-gray-500">
									<Pill className="mx-auto mb-4 h-12 w-12 text-gray-400" />
									<p>Dodaj swoje leki, aby sprawdzić interakcje</p>
								</div>
							) : (
								medications.map((medication) => (
									<Card key={medication.id} className="p-4">
										<div className="space-y-3">
											<div className="flex items-center justify-between">
												<Label className="font-medium text-sm">
													Nazwa leku
												</Label>
												<Button
													variant="outline"
													size="sm"
													onClick={() => removeMedication(medication.id)}
												>
													<X className="h-3 w-3" />
												</Button>
											</div>

											<Input
												placeholder="np. Metformina"
												value={medication.polishName}
												onChange={(e) =>
													updateMedication(
														medication.id,
														"polishName",
														e.target.value,
													)
												}
											/>

											<div className="grid grid-cols-2 gap-2">
												<div>
													<Label className="text-gray-600 text-xs">Dawka</Label>
													<Input
														placeholder="np. 500mg"
														value={medication.dosage}
														onChange={(e) =>
															updateMedication(
																medication.id,
																"dosage",
																e.target.value,
															)
														}
													/>
												</div>
												<div>
													<Label className="text-gray-600 text-xs">
														Częstotliwość
													</Label>
													<Input
														placeholder="np. 2x dziennie"
														value={medication.polishFrequency}
														onChange={(e) =>
															updateMedication(
																medication.id,
																"polishFrequency",
																e.target.value,
															)
														}
													/>
												</div>
											</div>
										</div>
									</Card>
								))
							)}
						</div>
					</CardContent>
				</Card>

				{/* Supplements */}
				<Card>
					<CardHeader>
						<div className="flex items-center justify-between">
							<CardTitle className="flex items-center gap-2">
								<Zap className="h-4 w-4 text-green-600" />
								Suplementy ({supplements.length})
							</CardTitle>
							<Button onClick={addSupplement} size="sm">
								<Plus className="mr-1 h-3 w-3" />
								Dodaj suplement
							</Button>
						</div>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{supplements.length === 0 ? (
								<div className="py-8 text-center text-gray-500">
									<Zap className="mx-auto mb-4 h-12 w-12 text-gray-400" />
									<p>Dodaj swoje suplementy, aby sprawdzić interakcje</p>
								</div>
							) : (
								supplements.map((supplement) => (
									<Card key={supplement.id} className="p-4">
										<div className="space-y-3">
											<div className="flex items-center justify-between">
												<Label className="font-medium text-sm">
													Nazwa suplementu
												</Label>
												<Button
													variant="outline"
													size="sm"
													onClick={() => removeSupplement(supplement.id)}
												>
													<X className="h-3 w-3" />
												</Button>
											</div>

											<Input
												placeholder="np. Witamina K"
												value={supplement.polishName}
												onChange={(e) =>
													updateSupplement(
														supplement.id,
														"polishName",
														e.target.value,
													)
												}
											/>

											<div className="grid grid-cols-2 gap-2">
												<div>
													<Label className="text-gray-600 text-xs">Dawka</Label>
													<Input
														placeholder="np. 100mcg"
														value={supplement.dosage}
														onChange={(e) =>
															updateSupplement(
																supplement.id,
																"dosage",
																e.target.value,
															)
														}
													/>
												</div>
												<div>
													<Label className="text-gray-600 text-xs">
														Częstotliwość
													</Label>
													<Input
														placeholder="np. 1x dziennie"
														value={supplement.polishFrequency}
														onChange={(e) =>
															updateSupplement(
																supplement.id,
																"polishFrequency",
																e.target.value,
															)
														}
													/>
												</div>
											</div>
										</div>
									</Card>
								))
							)}
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Check Button */}
			<div className="flex items-center justify-center">
				<Button
					onClick={checkInteractions}
					disabled={
						medications.length === 0 || supplements.length === 0 || isChecking
					}
					size="lg"
					className="flex items-center gap-2"
				>
					{isChecking ? (
						<>
							<Activity className="h-4 w-4 animate-spin" />
							Sprawdzanie interakcji...
						</>
					) : (
						<>
							<Search className="h-4 w-4" />
							Sprawdź interakcje
						</>
					)}
				</Button>
			</div>

			{/* Results Section */}
			{interactions.length > 0 && (
				<>
					{/* Summary */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<AlertTriangle className="h-5 w-5 text-orange-600" />
								Podsumowanie interakcji
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
								<div className="rounded-lg bg-gray-50 p-4 text-center">
									<div className="font-bold text-2xl text-gray-700">
										{interactionSummary.total}
									</div>
									<div className="text-gray-600 text-sm">Łącznie</div>
								</div>
								<div className="rounded-lg bg-red-50 p-4 text-center">
									<div className="font-bold text-2xl text-red-600">
										{interactionSummary.severe}
									</div>
									<div className="text-red-700 text-sm">Ciężkie</div>
								</div>
								<div className="rounded-lg bg-orange-50 p-4 text-center">
									<div className="font-bold text-2xl text-orange-600">
										{interactionSummary.moderate}
									</div>
									<div className="text-orange-700 text-sm">Umiarkowane</div>
								</div>
								<div className="rounded-lg bg-yellow-50 p-4 text-center">
									<div className="font-bold text-2xl text-yellow-600">
										{interactionSummary.mild}
									</div>
									<div className="text-sm text-yellow-700">Łagodne</div>
								</div>
							</div>

							<div className="mt-4 flex items-center justify-between">
								<div className="flex items-center gap-2">
									<Input
										placeholder="Szukaj interakcji..."
										value={searchTerm}
										onChange={(e) => setSearchTerm(e.target.value)}
										className="w-64"
									/>
									<Search className="h-4 w-4 text-gray-400" />
								</div>

								<Button onClick={generateReport} variant="outline">
									<Download className="mr-1 h-3 w-3" />
									Generuj raport
								</Button>
							</div>
						</CardContent>
					</Card>

					{/* Interactions List */}
					<div className="space-y-4">
						{filteredInteractions.map((interaction) => (
							<Card
								key={interaction.id}
								className={cn(
									"border-l-4",
									getSeverityColor(interaction.severity),
								)}
							>
								<CardHeader className="pb-4">
									<div className="flex items-start justify-between">
										<div className="flex-1">
											<div className="mb-2 flex items-center gap-2">
												<h3 className="font-medium text-lg">
													{interaction.polishDrugName} +{" "}
													{interaction.polishSupplementName}
												</h3>
												<Badge
													className={getSeverityColor(interaction.severity)}
												>
													{interaction.polishSeverity}
												</Badge>
												<Badge
													className={getRecommendationColor(
														interaction.recommendation,
													)}
												>
													{interaction.polishRecommendation}
												</Badge>
											</div>

											<p className="mb-2 text-gray-600 text-sm">
												{interaction.polishDescription}
											</p>

											<div className="flex items-center gap-4 text-gray-500 text-xs">
												<span className="flex items-center gap-1">
													<Brain className="h-3 w-3" />
													Mechanizm: {interaction.polishMechanism}
												</span>
												<span className="flex items-center gap-1">
													<Info className="h-3 w-3" />
													Dowody: {interaction.polishEvidenceLevel}
												</span>
											</div>
										</div>

										<Collapsible
											open={expandedInteraction === interaction.id}
											onOpenChange={(open) =>
												setExpandedInteraction(open ? interaction.id : null)
											}
										>
											<CollapsibleTrigger asChild>
												<Button variant="outline" size="sm">
													{expandedInteraction === interaction.id ? (
														<>
															<ChevronUp className="mr-1 h-3 w-3" />
															Zwiń
														</>
													) : (
														<>
															<ChevronDown className="mr-1 h-3 w-3" />
															Szczegóły
														</>
													)}
												</Button>
											</CollapsibleTrigger>
										</Collapsible>
									</div>
								</CardHeader>

								<Collapsible
									open={expandedInteraction === interaction.id}
									onOpenChange={(open) =>
										setExpandedInteraction(open ? interaction.id : null)
									}
								>
									<CollapsibleContent>
										<CardContent className="pt-0">
											<Tabs defaultValue="management" className="w-full">
												<TabsList className="grid w-full grid-cols-3">
													<TabsTrigger value="management">
														Zarządzanie
													</TabsTrigger>
													<TabsTrigger value="monitoring">
														Monitorowanie
													</TabsTrigger>
													<TabsTrigger value="timing">Timing</TabsTrigger>
												</TabsList>

												<TabsContent value="management" className="mt-4">
													<div className="space-y-3">
														<h4 className="font-medium">
															Strategie zarządzania
														</h4>
														<div className="space-y-2">
															{interaction.management.map((strategy, index) => (
																<div
																	key={index}
																	className="rounded-lg bg-blue-50 p-3"
																>
																	<h5 className="font-medium text-blue-800">
																		{strategy.polishStrategy}
																	</h5>
																	<p className="text-blue-700 text-sm">
																		{strategy.polishDescription}
																	</p>
																</div>
															))}
														</div>
													</div>
												</TabsContent>

												<TabsContent value="monitoring" className="mt-4">
													<div className="space-y-3">
														<h4 className="font-medium">
															Parametry monitorowania
														</h4>
														<div className="space-y-3">
															{interaction.monitoringParameters.map(
																(param, index) => (
																	<div
																		key={index}
																		className="rounded-lg border p-3"
																	>
																		<div className="mb-2 flex items-center justify-between">
																			<h5 className="font-medium">
																				{param.polishParameter}
																			</h5>
																			<Badge variant="outline">
																				<Clock className="mr-1 h-3 w-3" />
																				{param.polishFrequency}
																			</Badge>
																		</div>

																		{param.polishWarningSignals.length > 0 && (
																			<div>
																				<h6 className="mb-1 font-medium text-orange-700 text-sm">
																					Sygnały ostrzegawcze:
																				</h6>
																				<ul className="space-y-1 text-orange-600 text-sm">
																					{param.polishWarningSignals.map(
																						(signal, signalIndex) => (
																							<li
																								key={signalIndex}
																								className="flex items-center gap-1"
																							>
																								<AlertTriangle className="h-3 w-3" />
																								{signal}
																							</li>
																						),
																					)}
																				</ul>
																			</div>
																		)}
																	</div>
																),
															)}
														</div>
													</div>
												</TabsContent>

												<TabsContent value="timing" className="mt-4">
													<div className="space-y-3">
														{interaction.timingSeparation ? (
															<div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
																<h4 className="mb-2 font-medium text-yellow-800">
																	Wymagane rozdzielenie w czasie
																</h4>
																<div className="space-y-2 text-sm text-yellow-700">
																	<p>
																		<strong>Minimalne odstęp:</strong>{" "}
																		{interaction.timingSeparation.minimumHours}{" "}
																		godzin
																	</p>
																	<p>
																		<strong>Optymalny odstęp:</strong>{" "}
																		{interaction.timingSeparation.optimalHours}{" "}
																		godzin
																	</p>
																	<p>
																		<strong>Powód:</strong>{" "}
																		{interaction.timingSeparation.polishReason}
																	</p>
																</div>
															</div>
														) : (
															<div className="rounded-lg border border-green-200 bg-green-50 p-4">
																<h4 className="font-medium text-green-800">
																	Brak wymagań czasowych
																</h4>
																<p className="text-green-700 text-sm">
																	Nie ma specjalnych wymagań dotyczących czasu
																	przyjmowania tych substancji.
																</p>
															</div>
														)}
													</div>
												</TabsContent>
											</Tabs>
										</CardContent>
									</CollapsibleContent>
								</Collapsible>
							</Card>
						))}
					</div>
				</>
			)}

			{/* No Interactions Found */}
			{interactions.length === 0 &&
				medications.length > 0 &&
				supplements.length > 0 &&
				!isChecking && (
					<Card>
						<CardContent className="p-8 text-center">
							<Shield className="mx-auto mb-4 h-16 w-16 text-green-600" />
							<h3 className="mb-2 font-bold text-green-800 text-xl">
								Brak wykrytych interakcji
							</h3>
							<p className="text-green-700">
								Nie znaleziono znanych interakcji między Twoimi lekami a
								suplementami. Pamiętaj jednak, aby zawsze skonsultować się z
								lekarzem przed rozpoczęciem nowej suplementacji.
							</p>
						</CardContent>
					</Card>
				)}
		</div>
	);
};

export default DrugInteractionChecker;
