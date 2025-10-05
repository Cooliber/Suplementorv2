"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ComprehensiveSupplementProfile } from "@/data/comprehensive-supplements";
import {
	Activity,
	AlertTriangle,
	BookOpen,
	Brain,
	ChevronDown,
	ChevronUp,
	Clock,
	Euro,
	ExternalLink,
	Heart,
	Info,
	Microscope,
	Shield,
	Star,
	TrendingUp,
	Users,
	Zap,
} from "lucide-react";
import type React from "react";
import { useState } from "react";

interface SupplementDetailPanelProps {
	supplement: ComprehensiveSupplementProfile;
	isOpen: boolean;
	onClose: () => void;
	className?: string;
}

const SupplementDetailPanel: React.FC<SupplementDetailPanelProps> = ({
	supplement,
	isOpen,
	onClose,
	className = "",
}) => {
	const [activeTab, setActiveTab] = useState("mechanisms");
	const [expandedMechanisms, setExpandedMechanisms] = useState<string[]>([]);

	if (!isOpen) return null;

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

	const getCategoryIcon = (category: string) => {
		switch (category) {
			case "NOOTROPIC":
				return <Brain className="h-5 w-5" />;
			case "FATTY_ACID":
				return <Heart className="h-5 w-5" />;
			case "MINERAL":
				return <Shield className="h-5 w-5" />;
			default:
				return <Microscope className="h-5 w-5" />;
		}
	};

	const toggleMechanism = (mechanismId: string) => {
		setExpandedMechanisms((prev) =>
			prev.includes(mechanismId)
				? prev.filter((id) => id !== mechanismId)
				: [...prev, mechanismId],
		);
	};

	const avgEffectiveness =
		supplement.clinicalApplications.reduce(
			(sum, app) => sum + app.effectivenessRating,
			0,
		) / supplement.clinicalApplications.length;

	return (
		<div
			className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 ${className}`}
		>
			<Card className="max-h-[90vh] w-full max-w-6xl overflow-hidden">
				<CardHeader className="pb-4">
					<div className="flex items-start justify-between">
						<div className="flex-1">
							<div className="mb-2 flex items-center gap-3">
								{getCategoryIcon(supplement.category)}
								<CardTitle className="font-bold text-2xl">
									{supplement.polishName}
								</CardTitle>
								<Badge
									variant="outline"
									className={getEvidenceLevelColor(supplement.evidenceLevel)}
								>
									{supplement.evidenceLevel}
								</Badge>
							</div>

							<p className="mb-3 text-muted-foreground">{supplement.name}</p>

							<p className="mb-4 text-gray-700 text-sm">
								{supplement.polishDescription || supplement.description}
							</p>

							{/* Quick stats */}
							<div className="flex items-center gap-6 text-sm">
								<div className="flex items-center gap-1">
									<Star className="h-4 w-4 text-yellow-500" />
									<span className="font-medium">
										{avgEffectiveness.toFixed(1)}/10
									</span>
									<span className="text-gray-500">skuteczność</span>
								</div>
								<div className="flex items-center gap-1">
									<Users className="h-4 w-4 text-blue-500" />
									<span className="font-medium">
										{supplement.clinicalEvidence?.totalStudies || 0}
									</span>
									<span className="text-gray-500">badań</span>
								</div>
								<div className="flex items-center gap-1">
									<Euro className="h-4 w-4 text-green-500" />
									<span className="font-medium">
										{supplement.economicData?.averageCostPerMonth?.average || 0}
										€
									</span>
									<span className="text-gray-500">miesięcznie</span>
								</div>
								<Badge variant="outline" className="text-xs">
									{supplement.category}
								</Badge>
							</div>
						</div>

						<Button variant="ghost" size="sm" onClick={onClose}>
							×
						</Button>
					</div>
				</CardHeader>

				<CardContent className="max-h-[calc(90vh-200px)] overflow-y-auto">
					<Tabs value={activeTab} onValueChange={setActiveTab}>
						<TabsList className="grid w-full grid-cols-5">
							<TabsTrigger value="mechanisms">Mechanizmy</TabsTrigger>
							<TabsTrigger value="compounds">Substancje czynne</TabsTrigger>
							<TabsTrigger value="research">Badania</TabsTrigger>
							<TabsTrigger value="interactions">Interakcje</TabsTrigger>
							<TabsTrigger value="safety">Bezpieczeństwo</TabsTrigger>
						</TabsList>

						{/* Mechanisms Tab */}
						<TabsContent value="mechanisms" className="space-y-4">
							<div>
								<h4 className="mb-4 flex items-center gap-2 font-medium">
									<Activity className="h-5 w-5" />
									Szczegółowe mechanizmy działania
								</h4>

								<div className="space-y-4">
									{supplement.mechanisms.map((mechanism, index) => (
										<div key={index} className="rounded-lg border p-4">
											<div
												className="flex cursor-pointer items-center justify-between"
												onClick={() => toggleMechanism(mechanism.pathway)}
											>
												<div>
													<h5 className="mb-1 font-medium text-lg">
														{mechanism.polishPathway}
													</h5>
													<p className="mb-2 text-gray-600 text-sm">
														{mechanism.polishDescription}
													</p>
													<div className="flex items-center gap-2">
														<Badge variant="outline" className="text-xs">
															{mechanism.evidenceLevel}
														</Badge>
														<span className="text-gray-500 text-xs">
															Czas do efektu: {mechanism.timeToEffect}
														</span>
													</div>
												</div>
												{expandedMechanisms.includes(mechanism.pathway) ? (
													<ChevronUp className="h-5 w-5" />
												) : (
													<ChevronDown className="h-5 w-5" />
												)}
											</div>

											{expandedMechanisms.includes(mechanism.pathway) && (
												<div className="mt-4 border-t pt-4">
													<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
														<div>
															<h6 className="mb-2 font-medium text-sm">
																Docelowe układy
															</h6>
															<div className="flex flex-wrap gap-1">
																{mechanism.targetSystems?.map(
																	(site: string, idx: number) => (
																		<Badge
																			key={idx}
																			variant="outline"
																			className="text-xs"
																		>
																			{site}
																		</Badge>
																	),
																)}
															</div>
														</div>
														<div>
															<h6 className="mb-2 font-medium text-sm">
																Czas trwania efektu
															</h6>
															<p className="text-gray-600 text-sm">
																{mechanism.duration}
															</p>
														</div>
													</div>
												</div>
											)}
										</div>
									))}
								</div>
							</div>
						</TabsContent>

						{/* Active Compounds Tab */}
						<TabsContent value="compounds" className="space-y-4">
							<div>
								<h4 className="mb-4 flex items-center gap-2 font-medium">
									<Zap className="h-5 w-5" />
									Substancje czynne i ich właściwości
								</h4>

								<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
									{supplement.activeCompounds.map((compound, index) => (
										<div key={index} className="rounded-lg border p-4">
											<h5 className="mb-3 font-medium text-lg">
												{compound.polishName || compound.name}
											</h5>

											<div className="space-y-3">
												<div className="grid grid-cols-2 gap-4 text-sm">
													<div>
														<span className="text-gray-600">Stężenie:</span>
														<p className="font-medium">
															{compound.concentration}
														</p>
													</div>
													<div>
														<span className="text-gray-600">
															Biodostępność:
														</span>
														<p className="font-medium">
															{compound.bioavailability}%
														</p>
													</div>
													<div>
														<span className="text-gray-600">
															Okres półtrwania:
														</span>
														<p className="font-medium">{compound.halfLife}</p>
													</div>
													<div>
														<span className="text-gray-600">
															Docelowe receptory:
														</span>
														<div className="mt-1 flex flex-wrap gap-1">
															{compound.targetReceptors
																?.slice(0, 2)
																.map((receptor, idx) => (
																	<Badge
																		key={idx}
																		variant="outline"
																		className="text-xs"
																	>
																		{receptor}
																	</Badge>
																))}
														</div>
													</div>
												</div>

												<div>
													<span className="text-gray-600 text-sm">
														Drogi metaboliczne:
													</span>
													<div className="mt-1 flex flex-wrap gap-1">
														{compound.metabolicPathway?.map((pathway, idx) => (
															<Badge
																key={idx}
																variant="outline"
																className="text-xs"
															>
																{pathway}
															</Badge>
														))}
													</div>
												</div>
											</div>
										</div>
									))}
								</div>
							</div>
						</TabsContent>

						{/* Research Tab */}
						<TabsContent value="research" className="space-y-4">
							<div>
								<h4 className="mb-4 flex items-center gap-2 font-medium">
									<BookOpen className="h-5 w-5" />
									Szczegółowe badania naukowe
								</h4>

								<div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
									<div className="rounded-lg border p-4 text-center">
										<div className="mb-1 font-bold text-2xl text-blue-600">
											{supplement.clinicalEvidence?.totalStudies || 0}
										</div>
										<div className="text-gray-600 text-sm">
											Wszystkie badania
										</div>
									</div>
									<div className="rounded-lg border p-4 text-center">
										<div className="mb-1 font-bold text-2xl text-green-600">
											{supplement.clinicalEvidence?.rctCount || 0}
										</div>
										<div className="text-gray-600 text-sm">Badania RCT</div>
									</div>
									<div className="rounded-lg border p-4 text-center">
										<div className="mb-1 font-bold text-2xl text-purple-600">
											{supplement.clinicalEvidence.metaAnalyses}
										</div>
										<div className="text-gray-600 text-sm">Meta-analizy</div>
									</div>
									<div className="rounded-lg border p-4 text-center">
										<div className="mb-1 font-bold text-2xl text-orange-600">
											{supplement.clinicalEvidence.observationalStudies}
										</div>
										<div className="text-gray-600 text-sm">
											Badania obserwacyjne
										</div>
									</div>
								</div>

								<div className="space-y-4">
									{supplement.researchStudies
										?.slice(0, 3)
										.map((study, index) => (
											<div key={index} className="rounded-lg border p-4">
												<div className="mb-3 flex items-start justify-between">
													<div className="flex-1">
														<h5 className="mb-1 font-medium">
															{study.polishTitle || study.title}
														</h5>
														<p className="mb-2 text-gray-600 text-sm">
															{study.authors.join(", ")} • {study.journal} •{" "}
															{study.year}
														</p>
													</div>
													<Badge
														variant="outline"
														className={getEvidenceLevelColor(
															study.evidenceLevel,
														)}
													>
														{study.evidenceLevel}
													</Badge>
												</div>

												<div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
													<div>
														<span className="text-gray-600">Typ badania:</span>
														<p className="font-medium">{study.studyType}</p>
													</div>
													<div>
														<span className="text-gray-600">
															Wielkość próby:
														</span>
														<p className="font-medium">{study.sampleSize}</p>
													</div>
													<div>
														<span className="text-gray-600">Czas trwania:</span>
														<p className="font-medium">{study.duration}</p>
													</div>
												</div>

												<div className="mt-3">
													<p className="mb-2 text-gray-700 text-sm">
														<strong>Wyniki:</strong>{" "}
														{study.polishFindings || study.findings}
													</p>
													{study.doi && (
														<Button
															variant="outline"
															size="sm"
															className="text-xs"
														>
															<ExternalLink className="mr-1 h-3 w-3" />
															DOI: {study.doi}
														</Button>
													)}
												</div>
											</div>
										))}
								</div>
							</div>
						</TabsContent>

						{/* Interactions Tab */}
						<TabsContent value="interactions" className="space-y-4">
							<div>
								<h4 className="mb-4 flex items-center gap-2 font-medium">
									<AlertTriangle className="h-5 w-5" />
									Interakcje z innymi substancjami
								</h4>

								<div className="space-y-4">
									{supplement.interactions.map((interaction, index) => (
										<div key={index} className="rounded-lg border p-4">
											<div className="mb-3 flex items-center gap-3">
												<Badge
													variant={
														interaction.severity === "severe"
															? "destructive"
															: interaction.severity === "moderate"
																? "secondary"
																: "outline"
													}
												>
													{interaction.severity}
												</Badge>
												<span className="font-medium">
													{interaction.polishSubstance}
												</span>
												<Badge
													variant={
														interaction.type === "synergistic"
															? "default"
															: interaction.type === "antagonistic"
																? "destructive"
																: "secondary"
													}
												>
													{interaction.type === "synergistic"
														? "Wzmacnia"
														: interaction.type === "antagonistic"
															? "Hamuje"
															: interaction.type}
												</Badge>
											</div>

											<div className="space-y-2 text-sm">
												<div>
													<span className="text-gray-600">Mechanizm:</span>
													<p className="text-gray-700">
														{interaction.polishMechanism}
													</p>
												</div>
												<div>
													<span className="text-gray-600">
														Znaczenie kliniczne:
													</span>
													<p className="text-gray-700">
														{interaction.polishClinicalSignificance}
													</p>
												</div>
												<Alert className="mt-3">
													<Info className="h-4 w-4" />
													<AlertDescription className="text-sm">
														<strong>Rekomendacja:</strong>{" "}
														{interaction.polishRecommendation}
													</AlertDescription>
												</Alert>
											</div>
										</div>
									))}
								</div>
							</div>
						</TabsContent>

						{/* Safety Tab */}
						<TabsContent value="safety" className="space-y-4">
							<div>
								<h4 className="mb-4 flex items-center gap-2 font-medium">
									<Shield className="h-5 w-5" />
									Szczegółowy profil bezpieczeństwa
								</h4>

								<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
									<div className="space-y-4">
										<div className="rounded-lg border p-4">
											<h5 className="mb-3 font-medium text-sm">
												Populacje specjalne
											</h5>
											<div className="space-y-2 text-sm">
												<div className="flex items-center justify-between">
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
												<div className="flex items-center justify-between">
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
												<div className="flex items-center justify-between">
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

										{supplement.safetyProfile.polishElderlyConsiderations
											.length > 0 && (
											<div className="rounded-lg border p-4">
												<h5 className="mb-2 font-medium text-sm">
													Uwagi dla osób starszych
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

									<div className="space-y-4">
										<div className="rounded-lg border p-4">
											<h5 className="mb-3 font-medium text-sm">
												Najczęstsze skutki uboczne
											</h5>
											<div className="space-y-3">
												{supplement.sideEffects
													.slice(0, 4)
													.map((effect, index) => (
														<div key={index} className="text-sm">
															<div className="mb-1 flex items-center justify-between">
																<span className="font-medium">
																	{effect.polishEffect}
																</span>
																<div className="flex items-center gap-2">
																	<Badge variant="outline" className="text-xs">
																		{effect.frequency}
																	</Badge>
																	<Badge
																		variant={
																			effect.severity === "mild"
																				? "default"
																				: effect.severity === "moderate"
																					? "secondary"
																					: "destructive"
																		}
																	>
																		{effect.severity === "mild"
																			? "Łagodny"
																			: effect.severity === "moderate"
																				? "Umiarkowany"
																				: "Ciężki"}
																	</Badge>
																</div>
															</div>
															<p className="text-gray-600 text-xs">
																{effect.polishManagement}
															</p>
														</div>
													))}
											</div>
										</div>
									</div>
								</div>
							</div>
						</TabsContent>
					</Tabs>
				</CardContent>
			</Card>
		</div>
	);
};

export default SupplementDetailPanel;
