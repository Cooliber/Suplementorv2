"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	AlertTriangle,
	BookOpen,
	Brain,
	ChevronDown,
	ChevronUp,
	Clock,
	Euro,
	Heart,
	Info,
	Microscope,
	Shield,
	Star,
	TrendingUp,
	Users,
} from "lucide-react";
import type React from "react";
import { useState } from "react";

import type { ComprehensiveSupplementProfile } from "@/data/comprehensive-supplements";

interface ComprehensiveSupplementCardProps {
	supplement: ComprehensiveSupplementProfile;
	difficultyLevel?: "beginner" | "intermediate" | "expert";
	showFullDetails?: boolean;
	onAddToStack?: (supplementId: string) => void;
	onViewInteractions?: (supplementId: string) => void;
	className?: string;
}

const ComprehensiveSupplementCard: React.FC<
	ComprehensiveSupplementCardProps
> = ({
	supplement,
	difficultyLevel = "intermediate",
	showFullDetails = false,
	onAddToStack,
	onViewInteractions,
	className = "",
}) => {
	const [isExpanded, setIsExpanded] = useState(showFullDetails);
	const [activeTab, setActiveTab] = useState("overview");

	// Get evidence level color
	const getEvidenceLevelColor = (level: string) => {
		switch (level) {
			case "STRONG":
				return "bg-green-100 text-green-800 border-green-200";
			case "MODERATE":
				return "bg-yellow-100 text-yellow-800 border-yellow-200";
			case "WEAK":
				return "bg-orange-100 text-orange-800 border-orange-200";
			case "INSUFFICIENT":
				return "bg-red-100 text-red-800 border-red-200";
			default:
				return "bg-gray-100 text-gray-800 border-gray-200";
		}
	};

	// Get category icon
	const getCategoryIcon = (category: string) => {
		switch (category) {
			case "NOOTROPIC":
				return <Brain className="h-4 w-4" />;
			case "FATTY_ACID":
				return <Heart className="h-4 w-4" />;
			case "MINERAL":
				return <Shield className="h-4 w-4" />;
			default:
				return <Microscope className="h-4 w-4" />;
		}
	};

	// Get educational content based on difficulty level
	const getEducationalContent = () => {
		const { educationalContent } = supplement;
		if (!educationalContent) {
			return {
				content: "",
				polishContent: "",
			};
		}
		switch (difficultyLevel) {
			case "beginner":
				return {
					content: educationalContent.beginnerExplanation || "",
					polishContent: educationalContent.polishBeginnerExplanation || "",
				};
			case "expert":
				return {
					content: educationalContent.expertAnalysis || "",
					polishContent: educationalContent.polishExpertAnalysis || "",
				};
			default:
				return {
					content: educationalContent.intermediateDetails || "",
					polishContent: educationalContent.polishIntermediateDetails || "",
				};
		}
	};

	const educationalContent = getEducationalContent();

	// Calculate average effectiveness
	const avgEffectiveness =
		supplement.clinicalApplications.reduce(
			(sum, app) => sum + app.effectivenessRating,
			0,
		) / supplement.clinicalApplications.length;

	return (
		<Card className={`w-full ${className}`}>
			<CardHeader className="pb-4">
				<div className="flex items-start justify-between">
					<div className="flex-1">
						<div className="mb-2 flex items-center gap-2">
							{getCategoryIcon(supplement.category)}
							<CardTitle className="font-bold text-xl">
								{supplement.polishName}
							</CardTitle>
							<Badge
								variant="outline"
								className={getEvidenceLevelColor(supplement.evidenceLevel)}
							>
								{supplement.evidenceLevel}
							</Badge>
						</div>

						<p className="mb-2 text-gray-600 text-sm">{supplement.name}</p>

						<p className="text-gray-700 text-sm">
							{educationalContent.polishContent}
						</p>
					</div>

					<div className="ml-4 flex flex-col items-end gap-2">
						<div className="flex items-center gap-1">
							<Star className="h-4 w-4 text-yellow-500" />
							<span className="font-medium text-sm">
								{avgEffectiveness.toFixed(1)}/10
							</span>
						</div>

						<div className="text-right text-gray-500 text-xs">
							<div>
								{supplement.economicData?.averageCostPerMonth?.average || 0}
								€/miesiąc
							</div>
							<div>{supplement.clinicalEvidence?.totalStudies || 0} badań</div>
						</div>
					</div>
				</div>

				{/* Quick stats */}
				<div className="mt-4 flex gap-4">
					<div className="flex items-center gap-1 text-gray-600 text-xs">
						<Users className="h-3 w-3" />
						{supplement.clinicalEvidence?.rctCount || 0} RCT
					</div>
					<div className="flex items-center gap-1 text-gray-600 text-xs">
						<Clock className="h-3 w-3" />
						{supplement.mechanisms[0]?.timeToEffect || "Różnie"}
					</div>
					<div className="flex items-center gap-1 text-gray-600 text-xs">
						<Euro className="h-3 w-3" />
						{supplement.economicData?.polishCostEffectivenessRating || "N/A"}
					</div>
				</div>

				{/* Action buttons */}
				<div className="mt-4 flex gap-2">
					{onAddToStack && (
						<Button
							size="sm"
							onClick={() => onAddToStack(supplement.id)}
							className="flex items-center gap-1"
						>
							<TrendingUp className="h-3 w-3" />
							Dodaj do stosu
						</Button>
					)}

					{onViewInteractions && (
						<Button
							size="sm"
							variant="outline"
							onClick={() => onViewInteractions(supplement.id)}
							className="flex items-center gap-1"
						>
							<AlertTriangle className="h-3 w-3" />
							Interakcje
						</Button>
					)}

					<Button
						size="sm"
						variant="ghost"
						onClick={() => setIsExpanded(!isExpanded)}
						className="flex items-center gap-1"
					>
						{isExpanded ? (
							<ChevronUp className="h-3 w-3" />
						) : (
							<ChevronDown className="h-3 w-3" />
						)}
						{isExpanded ? "Zwiń" : "Rozwiń"}
					</Button>
				</div>
			</CardHeader>

			{isExpanded && (
				<CardContent className="pt-0">
					<Tabs value={activeTab} onValueChange={setActiveTab}>
						<TabsList className="grid w-full grid-cols-6">
							<TabsTrigger value="overview">Przegląd</TabsTrigger>
							<TabsTrigger value="clinical">Klinika</TabsTrigger>
							<TabsTrigger value="safety">Bezpieczeństwo</TabsTrigger>
							<TabsTrigger value="dosage">Dawkowanie</TabsTrigger>
							<TabsTrigger value="quality">Jakość</TabsTrigger>
							<TabsTrigger value="advanced">Zaawansowane</TabsTrigger>
						</TabsList>

						{/* Overview Tab */}
						<TabsContent value="overview" className="space-y-4">
							<div>
								<h4 className="mb-2 flex items-center gap-2 font-medium">
									<BookOpen className="h-4 w-4" />
									Kluczowe informacje
								</h4>
								<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
									<div>
										<h5 className="mb-1 font-medium text-sm">
											Główne korzyści:
										</h5>
										<ul className="space-y-1 text-gray-600 text-sm">
											{supplement.educationalContent.polishKeyTakeaways.map(
												(takeaway, index) => (
													<li key={index} className="flex items-start gap-1">
														<span className="mt-1 text-green-500">•</span>
														{takeaway}
													</li>
												),
											)}
										</ul>
									</div>

									<div>
										<h5 className="mb-1 font-medium text-sm">
											Aktywne składniki:
										</h5>
										<div className="space-y-2">
											{supplement.activeCompounds
												.slice(0, 3)
												.map((compound, index) => (
													<div key={index} className="text-sm">
														<div className="font-medium">
															{compound.polishName || compound.name}
														</div>
														<div className="text-gray-600 text-xs">
															{compound.concentration} • Biodostępność:{" "}
															{compound.bioavailability}%
														</div>
													</div>
												))}
										</div>
									</div>
								</div>
							</div>

							<Separator />

							<div>
								<h4 className="mb-2 font-medium">Mechanizmy działania</h4>
								<div className="space-y-3">
									{supplement.mechanisms.slice(0, 2).map((mechanism, index) => (
										<div key={index} className="rounded-lg border p-3">
											<div className="mb-1 font-medium text-sm">
												{mechanism.polishPathway}
											</div>
											<div className="mb-2 text-gray-600 text-xs">
												{mechanism.polishDescription}
											</div>
											<div className="flex items-center gap-2">
												<Badge variant="outline" className="text-xs">
													{mechanism.evidenceLevel}
												</Badge>
												<span className="text-gray-500 text-xs">
													Efekt: {mechanism.timeToEffect}
												</span>
											</div>
										</div>
									))}
								</div>
							</div>
						</TabsContent>

						{/* Clinical Tab */}
						<TabsContent value="clinical" className="space-y-4">
							<div>
								<h4 className="mb-3 flex items-center gap-2 font-medium">
									<Microscope className="h-4 w-4" />
									Zastosowania kliniczne
								</h4>
								<div className="space-y-3">
									{supplement.clinicalApplications.map((application, index) => (
										<div key={index} className="rounded-lg border p-4">
											<div className="mb-2 flex items-center justify-between">
												<h5 className="font-medium">
													{application.polishCondition}
												</h5>
												<div className="flex items-center gap-2">
													<Progress
														value={application.effectivenessRating * 10}
														className="h-2 w-20"
													/>
													<span className="font-medium text-sm">
														{application.effectivenessRating}/10
													</span>
												</div>
											</div>

											{(application as any).polishMechanism && (
												<div className="mb-2 text-gray-600 text-sm">
													<strong>Mechanizm:</strong>{" "}
													{(application as any).polishMechanism}
												</div>
											)}

											<div className="flex items-center gap-4 text-gray-500 text-xs">
												<span>Dawka: {application.recommendedDose}</span>
												<span>Czas: {application.duration || "N/A"}</span>
												<Badge variant="outline" className="text-xs">
													{application.evidenceLevel}
												</Badge>
											</div>

											{(application as any).polishContraindications &&
												(application as any).polishContraindications.length >
													0 && (
													<Alert className="mt-2">
														<AlertTriangle className="h-4 w-4" />
														<AlertDescription className="text-xs">
															<strong>Przeciwwskazania:</strong>{" "}
															{(
																application as any
															).polishContraindications.join(", ")}
														</AlertDescription>
													</Alert>
												)}
										</div>
									))}
								</div>
							</div>

							<Separator />

							<div>
								<h4 className="mb-2 font-medium">Dowody naukowe</h4>
								<div className="grid grid-cols-2 gap-4 text-center md:grid-cols-4">
									<div className="rounded-lg border p-3">
										<div className="font-bold text-blue-600 text-lg">
											{supplement.clinicalEvidence?.totalStudies || 0}
										</div>
										<div className="text-gray-600 text-xs">
											Wszystkie badania
										</div>
									</div>
									<div className="rounded-lg border p-3">
										<div className="font-bold text-green-600 text-lg">
											{supplement.clinicalEvidence?.rctCount || 0}
										</div>
										<div className="text-gray-600 text-xs">Badania RCT</div>
									</div>
									<div className="rounded-lg border p-3">
										<div className="font-bold text-lg text-purple-600">
											{supplement.clinicalEvidence.metaAnalyses}
										</div>
										<div className="text-gray-600 text-xs">Meta-analizy</div>
									</div>
									<div className="rounded-lg border p-3">
										<div className="font-bold text-lg text-orange-600">
											{supplement.clinicalEvidence.observationalStudies}
										</div>
										<div className="text-gray-600 text-xs">
											Badania obserwacyjne
										</div>
									</div>
								</div>
							</div>
						</TabsContent>

						{/* Safety Tab */}
						<TabsContent value="safety" className="space-y-4">
							<div>
								<h4 className="mb-3 flex items-center gap-2 font-medium">
									<Shield className="h-4 w-4" />
									Profil bezpieczeństwa
								</h4>

								<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
									<div className="space-y-3">
										<div className="rounded-lg border p-3">
											<h5 className="mb-2 font-medium text-sm">
												Populacje specjalne
											</h5>
											<div className="space-y-1 text-xs">
												<div className="flex justify-between">
													<span>Ciąża:</span>
													<Badge
														variant={
															supplement.safetyProfile.pregnancyCategory ===
																"A" ||
															supplement.safetyProfile.pregnancyCategory === "B"
																? "default"
																: "destructive"
														}
													>
														Kategoria{" "}
														{supplement.safetyProfile.pregnancyCategory}
													</Badge>
												</div>
												<div className="flex justify-between">
													<span>Karmienie piersią:</span>
													<Badge
														variant={
															supplement.safetyProfile.breastfeedingSafety ===
															"Safe"
																? "default"
																: "secondary"
														}
													>
														{supplement.safetyProfile.breastfeedingSafety ===
														"Safe"
															? "Bezpieczne"
															: "Ostrożność"}
													</Badge>
												</div>
												<div className="flex justify-between">
													<span>Dzieci:</span>
													<Badge
														variant={
															supplement.safetyProfile.pediatricUse.approved
																? "default"
																: "secondary"
														}
													>
														{supplement.safetyProfile.pediatricUse.approved
															? "Zatwierdzone"
															: "Niezatwierdzone"}
													</Badge>
												</div>
											</div>
										</div>

										{supplement.safetyProfile.elderlyConsiderations.length >
											0 && (
											<div className="rounded-lg border p-3">
												<h5 className="mb-2 font-medium text-sm">
													Osoby starsze
												</h5>
												<ul className="space-y-1 text-gray-600 text-xs">
													{supplement.safetyProfile.polishElderlyConsiderations.map(
														(consideration, index) => (
															<li
																key={index}
																className="flex items-start gap-1"
															>
																<Info className="mt-0.5 h-3 w-3 text-blue-500" />
																{consideration}
															</li>
														),
													)}
												</ul>
											</div>
										)}
									</div>

									<div className="space-y-3">
										<div className="rounded-lg border p-3">
											<h5 className="mb-2 font-medium text-sm">
												Skutki uboczne
											</h5>
											<div className="space-y-2">
												{supplement.sideEffects
													.slice(0, 3)
													.map((effect, index) => (
														<div key={index} className="text-xs">
															<div className="flex items-center justify-between">
																<span className="font-medium">
																	{effect.polishEffect}
																</span>
																<Badge variant="outline" className="text-xs">
																	{effect.severity === "mild"
																		? "Łagodny"
																		: effect.severity === "moderate"
																			? "Umiarkowany"
																			: "Ciężki"}
																</Badge>
															</div>
															<div className="mt-1 text-gray-600">
																{effect.frequency} • {effect.polishManagement}
															</div>
														</div>
													))}
											</div>
										</div>
									</div>
								</div>
							</div>
						</TabsContent>

						{/* Dosage Tab */}
						<TabsContent value="dosage" className="space-y-4">
							<div>
								<h4 className="mb-3 font-medium">Wytyczne dawkowania</h4>

								<div className="mb-4 rounded-lg border p-4">
									<div className="grid grid-cols-1 gap-4 text-center md:grid-cols-3">
										<div>
											<div className="font-bold text-gray-600 text-lg">
												{supplement.dosageGuidelines.therapeuticRange.min}{" "}
												{supplement.dosageGuidelines.therapeuticRange.unit}
											</div>
											<div className="text-gray-500 text-xs">Minimalna</div>
										</div>
										<div>
											<div className="font-bold text-green-600 text-lg">
												{(supplement.dosageGuidelines.therapeuticRange.min +
													supplement.dosageGuidelines.therapeuticRange.max) /
													2}{" "}
												{supplement.dosageGuidelines.therapeuticRange.unit}
											</div>
											<div className="text-gray-500 text-xs">Optymalna</div>
										</div>
										<div>
											<div className="font-bold text-lg text-orange-600">
												{supplement.dosageGuidelines.therapeuticRange.max}{" "}
												{supplement.dosageGuidelines.therapeuticRange.unit}
											</div>
											<div className="text-gray-500 text-xs">Maksymalna</div>
										</div>
									</div>
								</div>

								<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
									<div className="rounded-lg border p-3">
										<h5 className="mb-2 font-medium text-sm">
											Timing i sposób podania
										</h5>
										<ul className="space-y-1 text-gray-600 text-xs">
											{supplement.dosageGuidelines.timing.map(
												(timing: string, index: number) => (
													<li key={index} className="flex items-center gap-1">
														<Clock className="h-3 w-3" />
														{timing}
													</li>
												),
											)}
										</ul>
									</div>

									{(supplement.dosageGuidelines as any)
										.polishSpecialPopulations && (
										<div className="rounded-lg border p-3">
											<h5 className="mb-2 font-medium text-sm">
												Populacje specjalne
											</h5>
											<div className="space-y-1 text-xs">
												{Object.entries(
													(supplement.dosageGuidelines as any)
														.polishSpecialPopulations,
												).map(([population, dosage]: [string, any]) => (
													<div
														key={population}
														className="flex justify-between"
													>
														<span className="capitalize">{population}:</span>
														<span className="font-medium">{dosage}</span>
													</div>
												))}
											</div>
										</div>
									)}
								</div>
							</div>
						</TabsContent>

						{/* Quality Tab */}
						<TabsContent value="quality" className="space-y-4">
							<div>
								<h4 className="mb-3 font-medium">Jakość i sourcing</h4>

								<div className="space-y-4">
									<div className="rounded-lg border p-3">
										<h5 className="mb-2 font-medium text-sm">
											Formy biodostępne
										</h5>
										<div className="flex flex-wrap gap-2">
											{supplement.qualityConsiderations.polishBioavailabilityForms.map(
												(form, index) => (
													<Badge
														key={index}
														variant="outline"
														className="text-xs"
													>
														{form}
													</Badge>
												),
											)}
										</div>
									</div>

									<div className="rounded-lg border p-3">
										<h5 className="mb-2 font-medium text-sm">
											Markery jakości
										</h5>
										<ul className="space-y-1 text-gray-600 text-xs">
											{supplement.qualityConsiderations.polishQualityMarkers.map(
												(marker, index) => (
													<li key={index} className="flex items-center gap-1">
														<span className="text-green-500">✓</span>
														{marker}
													</li>
												),
											)}
										</ul>
									</div>

									<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
										<div className="rounded-lg border p-3">
											<h5 className="mb-1 font-medium text-sm">
												Przechowywanie
											</h5>
											<p className="text-gray-600 text-xs">
												{
													supplement.qualityConsiderations
														.polishStorageRequirements
												}
											</p>
										</div>

										<div className="rounded-lg border p-3">
											<h5 className="mb-1 font-medium text-sm">Trwałość</h5>
											<p className="text-gray-600 text-xs">
												{supplement.qualityConsiderations.shelfLife}
											</p>
										</div>
									</div>

									<Alert>
										<Info className="h-4 w-4" />
										<AlertDescription className="text-sm">
											<strong>Rekomendacja:</strong>{" "}
											{supplement.qualityConsiderations.polishStandardization}
										</AlertDescription>
									</Alert>
								</div>
							</div>
						</TabsContent>

						{/* Advanced Tab */}
						<TabsContent value="advanced" className="space-y-4">
							<div>
								<h4 className="mb-3 flex items-center gap-2 font-medium">
									<Microscope className="h-4 w-4" />
									Farmakokinetyka i ekonomia
								</h4>

								<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
									{/* Pharmacokinetics */}
									<div className="space-y-4">
										<div className="rounded-lg border p-4">
											<h5 className="mb-3 flex items-center gap-2 font-medium text-sm">
												<Clock className="h-4 w-4" />
												Wchłanianie
											</h5>
											<div className="space-y-2 text-sm">
												<div className="flex justify-between">
													<span>Biodostępność:</span>
													<span className="font-medium">
														{supplement.pharmacokinetics.absorption.rate}
													</span>
												</div>
												<div className="flex justify-between">
													<span>Optymalny timing:</span>
													<span className="font-medium">
														{
															supplement.pharmacokinetics.absorption
																.polishOptimalTiming
														}
													</span>
												</div>
												<div>
													<span className="text-gray-600 text-xs">
														Czynniki wpływające:
													</span>
													<div className="mt-1 flex flex-wrap gap-1">
														{supplement.pharmacokinetics.absorption.polishFactors.map(
															(factor, index) => (
																<Badge
																	key={index}
																	variant="outline"
																	className="text-xs"
																>
																	{factor}
																</Badge>
															),
														)}
													</div>
												</div>
											</div>
										</div>

										<div className="rounded-lg border p-4">
											<h5 className="mb-3 font-medium text-sm">Metabolizm</h5>
											<div className="space-y-2 text-sm">
												<div className="flex justify-between">
													<span>Główna droga:</span>
													<span className="font-medium">
														{
															supplement.pharmacokinetics.metabolism
																.polishPrimaryPathway
														}
													</span>
												</div>
												<div>
													<span className="text-gray-600 text-xs">Enzymy:</span>
													<div className="mt-1 flex flex-wrap gap-1">
														{supplement.pharmacokinetics.metabolism.enzymes.map(
															(enzyme, index) => (
																<Badge
																	key={index}
																	variant="outline"
																	className="text-xs"
																>
																	{enzyme}
																</Badge>
															),
														)}
													</div>
												</div>
											</div>
										</div>

										<div className="rounded-lg border p-4">
											<h5 className="mb-3 font-medium text-sm">Eliminacja</h5>
											<div className="space-y-2 text-sm">
												<div className="flex justify-between">
													<span>Okres półtrwania:</span>
													<span className="font-medium">
														{supplement.pharmacokinetics.elimination.halfLife}
													</span>
												</div>
												<div className="flex justify-between">
													<span>Droga wydalania:</span>
													<span className="font-medium">
														{
															supplement.pharmacokinetics.elimination
																.excretionRoute
														}
													</span>
												</div>
											</div>
										</div>
									</div>

									{/* Economic Data */}
									<div className="space-y-4">
										<div className="rounded-lg border p-4">
											<h5 className="mb-3 flex items-center gap-2 font-medium text-sm">
												<Euro className="h-4 w-4" />
												Koszt miesięczny
											</h5>
											<div className="space-y-3">
												<div className="grid grid-cols-3 gap-2 text-center">
													<div className="rounded border p-2">
														<div className="font-bold text-gray-600 text-sm">
															{supplement.economicData?.averageCostPerMonth
																?.low || 0}
															€
														</div>
														<div className="text-gray-500 text-xs">Niski</div>
													</div>
													<div className="rounded border p-2">
														<div className="font-bold text-green-600 text-sm">
															{supplement.economicData?.averageCostPerMonth
																?.average || 0}
															€
														</div>
														<div className="text-gray-500 text-xs">Średni</div>
													</div>
													<div className="rounded border p-2">
														<div className="font-bold text-orange-600 text-sm">
															{supplement.economicData?.averageCostPerMonth
																?.high || 0}
															€
														</div>
														<div className="text-gray-500 text-xs">Wysoki</div>
													</div>
												</div>

												<div className="flex items-center justify-between">
													<span className="text-sm">Ocena opłacalności:</span>
													<Badge
														variant="outline"
														className={
															supplement.economicData
																.costEffectivenessRating === "Excellent"
																? "bg-green-100 text-green-800"
																: supplement.economicData
																			.costEffectivenessRating === "Good"
																	? "bg-blue-100 text-blue-800"
																	: supplement.economicData
																				.costEffectivenessRating === "Fair"
																		? "bg-yellow-100 text-yellow-800"
																		: "bg-red-100 text-red-800"
														}
													>
														{
															supplement.economicData
																.polishCostEffectivenessRating
														}
													</Badge>
												</div>

												<div>
													<p className="text-gray-700 text-sm">
														<strong>Propozycja wartości:</strong>{" "}
														{supplement.economicData.polishValueProposition}
													</p>
												</div>
											</div>
										</div>

										{/* Clinical Evidence Summary */}
										<div className="rounded-lg border p-4">
											<h5 className="mb-3 flex items-center gap-2 font-medium text-sm">
												<BookOpen className="h-4 w-4" />
												Dowody naukowe
											</h5>
											<div className="grid grid-cols-2 gap-3 text-center">
												<div className="rounded border p-2">
													<div className="font-bold text-blue-600 text-lg">
														{supplement.clinicalEvidence?.totalStudies || 0}
													</div>
													<div className="text-gray-600 text-xs">
														Wszystkie badania
													</div>
												</div>
												<div className="rounded border p-2">
													<div className="font-bold text-green-600 text-lg">
														{supplement.clinicalEvidence?.rctCount || 0}
													</div>
													<div className="text-gray-600 text-xs">
														Badania RCT
													</div>
												</div>
												<div className="rounded border p-2">
													<div className="font-bold text-lg text-purple-600">
														{supplement.clinicalEvidence.metaAnalyses}
													</div>
													<div className="text-gray-600 text-xs">
														Meta-analizy
													</div>
												</div>
												<div className="rounded border p-2">
													<div className="font-bold text-lg text-orange-600">
														{supplement.clinicalEvidence.observationalStudies}
													</div>
													<div className="text-gray-600 text-xs">
														Badania obserwacyjne
													</div>
												</div>
											</div>
											<div className="mt-3 text-center text-gray-500 text-xs">
												Ostatnia aktualizacja:{" "}
												{new Date(
													supplement.clinicalEvidence.lastReviewDate,
												).toLocaleDateString("pl-PL")}
											</div>
										</div>
									</div>
								</div>
							</div>
						</TabsContent>
					</Tabs>
				</CardContent>
			)}
		</Card>
	);
};

export default ComprehensiveSupplementCard;
