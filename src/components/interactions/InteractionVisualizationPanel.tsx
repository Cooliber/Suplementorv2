"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Activity,
	AlertTriangle,
	CheckCircle,
	Clock,
	Download,
	Eye,
	EyeOff,
	Info,
	RotateCcw,
	Settings,
	Shield,
	Target,
	TrendingDown,
	TrendingUp,
	XCircle,
	Zap,
} from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";

import {
	type InteractionMatrix,
	type InteractionSeverity,
	type InteractionType,
	type VisualizationData,
	supplementInteractionService,
} from "@/lib/services/supplement-interaction-service";

interface InteractionVisualizationPanelProps {
	supplementIds: string[];
	medications?: { name: string; activeIngredient: string }[];
	onInteractionSelect?: (interaction: any) => void;
	showMedicationInteractions?: boolean;
	className?: string;
}

const InteractionVisualizationPanel: React.FC<
	InteractionVisualizationPanelProps
> = ({
	supplementIds,
	medications = [],
	onInteractionSelect,
	showMedicationInteractions = true,
	className = "",
}) => {
	const [interactionMatrix, setInteractionMatrix] =
		useState<InteractionMatrix | null>(null);
	const [visualizationData, setVisualizationData] =
		useState<VisualizationData | null>(null);
	const [selectedLayout, setSelectedLayout] =
		useState<VisualizationData["layout"]>("FORCE");
	const [showBeneficial, setShowBeneficial] = useState(true);
	const [showMinor, setShowMinor] = useState(true);
	const [selectedInteraction, setSelectedInteraction] = useState<any>(null);
	const [loading, setLoading] = useState(false);
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		if (supplementIds.length > 1) {
			analyzeInteractions();
		}
	}, [supplementIds]);

	const analyzeInteractions = async () => {
		setLoading(true);
		try {
			// Analyze supplement-supplement interactions
			const matrix =
				supplementInteractionService.analyzeInteractions(supplementIds);
			setInteractionMatrix(matrix);

			// Generate visualization data
			const vizData = supplementInteractionService.generateVisualizationData(
				supplementIds,
				selectedLayout,
			);
			setVisualizationData(vizData);

			// Check medication interactions if provided
			if (showMedicationInteractions && medications.length > 0) {
				const medInteractions =
					supplementInteractionService.checkMedicationInteractions(
						supplementIds,
						medications,
					);
				// Add medication interactions to visualization
			}
		} catch (error) {
			console.error("Error analyzing interactions:", error);
		} finally {
			setLoading(false);
		}
	};

	const getSeverityColor = (severity: InteractionSeverity) => {
		switch (severity) {
			case "CONTRAINDICATED":
				return "bg-red-100 text-red-800 border-red-200";
			case "MAJOR":
				return "bg-orange-100 text-orange-800 border-orange-200";
			case "MODERATE":
				return "bg-yellow-100 text-yellow-800 border-yellow-200";
			case "MINOR":
				return "bg-blue-100 text-blue-800 border-blue-200";
			case "BENEFICIAL":
				return "bg-green-100 text-green-800 border-green-200";
			default:
				return "bg-gray-100 text-gray-800 border-gray-200";
		}
	};

	const getSeverityIcon = (severity: InteractionSeverity) => {
		switch (severity) {
			case "CONTRAINDICATED":
				return <XCircle className="h-4 w-4 text-red-600" />;
			case "MAJOR":
				return <AlertTriangle className="h-4 w-4 text-orange-600" />;
			case "MODERATE":
				return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
			case "MINOR":
				return <Info className="h-4 w-4 text-blue-600" />;
			case "BENEFICIAL":
				return <CheckCircle className="h-4 w-4 text-green-600" />;
			default:
				return <Info className="h-4 w-4 text-gray-600" />;
		}
	};

	const getInteractionTypeIcon = (type: InteractionType) => {
		switch (type) {
			case "SYNERGISTIC":
				return <TrendingUp className="h-4 w-4 text-green-600" />;
			case "ANTAGONISTIC":
				return <TrendingDown className="h-4 w-4 text-red-600" />;
			case "ADDITIVE":
				return <Activity className="h-4 w-4 text-blue-600" />;
			case "COMPETITIVE":
				return <Target className="h-4 w-4 text-orange-600" />;
			default:
				return <Zap className="h-4 w-4 text-gray-600" />;
		}
	};

	const getRiskLevelColor = (risk: string) => {
		switch (risk) {
			case "VERY_HIGH":
				return "text-red-600";
			case "HIGH":
				return "text-orange-600";
			case "MODERATE":
				return "text-yellow-600";
			case "LOW":
				return "text-green-600";
			default:
				return "text-gray-600";
		}
	};

	const filteredInteractions =
		interactionMatrix?.interactions.filter((interaction) => {
			if (!showBeneficial && interaction.severity === "BENEFICIAL")
				return false;
			if (!showMinor && interaction.severity === "MINOR") return false;
			return true;
		}) || [];

	if (supplementIds.length < 2) {
		return (
			<Card className={className}>
				<CardContent className="p-6">
					<Alert>
						<Info className="h-4 w-4" />
						<AlertDescription>
							Dodaj co najmniej 2 suplementy, aby przeanalizować interakcje.
						</AlertDescription>
					</Alert>
				</CardContent>
			</Card>
		);
	}

	if (loading) {
		return (
			<Card className={className}>
				<CardContent className="p-6">
					<div className="flex items-center justify-center space-x-2">
						<div className="h-6 w-6 animate-spin rounded-full border-blue-600 border-b-2" />
						<span>Analizowanie interakcji...</span>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className={`space-y-6 ${className}`}>
			{/* Risk Assessment Header */}
			{interactionMatrix && (
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Shield className="h-5 w-5" />
							Analiza interakcji suplementów
						</CardTitle>
						<div className="mt-2 flex items-center gap-4">
							<Badge
								className={`${getRiskLevelColor(interactionMatrix.riskAssessment.overallRisk)} border`}
							>
								Ryzyko: {interactionMatrix.riskAssessment.polishOverallRisk}
							</Badge>
							<span className="text-gray-600 text-sm">
								{interactionMatrix.interactions.length} interakcji znalezionych
							</span>
							<span className="text-gray-600 text-sm">
								{supplementIds.length} suplementów
							</span>
						</div>
					</CardHeader>
					<CardContent>
						{/* Quick stats */}
						<div className="mb-4 grid grid-cols-2 gap-4 md:grid-cols-5">
							{(
								[
									"CONTRAINDICATED",
									"MAJOR",
									"MODERATE",
									"MINOR",
									"BENEFICIAL",
								] as InteractionSeverity[]
							).map((severity) => {
								const count = interactionMatrix.interactions.filter(
									(i) => i.severity === severity,
								).length;
								return (
									<div key={severity} className="text-center">
										<div className="font-bold text-lg">{count}</div>
										<div className="text-gray-600 text-xs capitalize">
											{severity === "CONTRAINDICATED"
												? "Przeciwwskazane"
												: severity === "MAJOR"
													? "Poważne"
													: severity === "MODERATE"
														? "Umiarkowane"
														: severity === "MINOR"
															? "Drobne"
															: "Korzystne"}
										</div>
									</div>
								);
							})}
						</div>

						{/* Critical warnings */}
						{interactionMatrix.riskAssessment.polishContraindications.length >
							0 && (
							<Alert className="mb-4 border-red-200 bg-red-50">
								<XCircle className="h-4 w-4 text-red-600" />
								<AlertDescription>
									<strong>Krytyczne ostrzeżenia:</strong>
									<ul className="mt-2 space-y-1">
										{interactionMatrix.riskAssessment.polishContraindications.map(
											(warning, index) => (
												<li key={index} className="text-sm">
													• {warning}
												</li>
											),
										)}
									</ul>
								</AlertDescription>
							</Alert>
						)}
					</CardContent>
				</Card>
			)}

			{/* Main Content Tabs */}
			<Card>
				<CardContent className="p-0">
					<Tabs defaultValue="matrix" className="w-full">
						<TabsList className="grid w-full grid-cols-4">
							<TabsTrigger value="matrix">Macierz</TabsTrigger>
							<TabsTrigger value="network">Sieć</TabsTrigger>
							<TabsTrigger value="details">Szczegóły</TabsTrigger>
							<TabsTrigger value="recommendations">Zalecenia</TabsTrigger>
						</TabsList>

						{/* Matrix View */}
						<TabsContent value="matrix" className="space-y-4 p-6">
							<div className="mb-4 flex items-center justify-between">
								<h3 className="font-medium text-lg">Macierz interakcji</h3>
								<div className="flex items-center gap-4">
									<div className="flex items-center gap-2">
										<Switch
											checked={showBeneficial}
											onCheckedChange={setShowBeneficial}
										/>
										<span className="text-sm">Pokaż korzystne</span>
									</div>
									<div className="flex items-center gap-2">
										<Switch
											checked={showMinor}
											onCheckedChange={setShowMinor}
										/>
										<span className="text-sm">Pokaż drobne</span>
									</div>
								</div>
							</div>

							{/* Interaction Matrix Table */}
							<div className="overflow-x-auto">
								<table className="w-full border-collapse border border-gray-200">
									<thead>
										<tr>
											<th className="border border-gray-200 bg-gray-50 p-2" />
											{supplementIds.map((id) => (
												<th
													key={id}
													className="border border-gray-200 bg-gray-50 p-2 text-xs"
												>
													{id.split("-").slice(0, 2).join("-")}
												</th>
											))}
										</tr>
									</thead>
									<tbody>
										{supplementIds.map((idA, i) => (
											<tr key={idA}>
												<td className="border border-gray-200 bg-gray-50 p-2 font-medium text-xs">
													{idA.split("-").slice(0, 2).join("-")}
												</td>
												{supplementIds.map((idB, j) => {
													if (i === j) {
														return (
															<td
																key={idB}
																className="border border-gray-200 bg-gray-100 p-2"
															/>
														);
													}

													const interaction = filteredInteractions.find(
														(int) =>
															(int.supplementA === idA &&
																int.supplementB === idB) ||
															(int.supplementA === idB &&
																int.supplementB === idA),
													);

													return (
														<td
															key={idB}
															className={`cursor-pointer border border-gray-200 p-1 text-center hover:bg-gray-50 ${
																interaction
																	? getSeverityColor(
																			interaction.severity,
																		).split(" ")[0]
																	: ""
															}`}
															onClick={() =>
																interaction &&
																setSelectedInteraction(interaction)
															}
														>
															{interaction && (
																<div className="flex items-center justify-center">
																	{getSeverityIcon(interaction.severity)}
																</div>
															)}
														</td>
													);
												})}
											</tr>
										))}
									</tbody>
								</table>
							</div>

							{/* Legend */}
							<div className="mt-4 flex flex-wrap gap-4">
								{(
									[
										"CONTRAINDICATED",
										"MAJOR",
										"MODERATE",
										"MINOR",
										"BENEFICIAL",
									] as InteractionSeverity[]
								).map((severity) => (
									<div key={severity} className="flex items-center gap-2">
										{getSeverityIcon(severity)}
										<span className="text-xs">
											{severity === "CONTRAINDICATED"
												? "Przeciwwskazane"
												: severity === "MAJOR"
													? "Poważne"
													: severity === "MODERATE"
														? "Umiarkowane"
														: severity === "MINOR"
															? "Drobne"
															: "Korzystne"}
										</span>
									</div>
								))}
							</div>
						</TabsContent>

						{/* Network View */}
						<TabsContent value="network" className="space-y-4 p-6">
							<div className="mb-4 flex items-center justify-between">
								<h3 className="font-medium text-lg">Sieć interakcji</h3>
								<div className="flex items-center gap-4">
									<Select
										value={selectedLayout}
										onValueChange={(value) => setSelectedLayout(value as any)}
									>
										<SelectTrigger className="w-40">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="FORCE">Siłowy</SelectItem>
											<SelectItem value="CIRCULAR">Kołowy</SelectItem>
											<SelectItem value="HIERARCHICAL">
												Hierarchiczny
											</SelectItem>
											<SelectItem value="MATRIX">Macierzowy</SelectItem>
										</SelectContent>
									</Select>
									<Button size="sm" variant="outline">
										<Download className="mr-1 h-3 w-3" />
										Eksportuj
									</Button>
								</div>
							</div>

							{/* Network Visualization Canvas */}
							<div className="flex h-96 items-center justify-center rounded-lg border bg-gray-50">
								<canvas
									ref={canvasRef}
									width={800}
									height={400}
									className="max-h-full max-w-full"
								/>
								<div className="text-gray-500 text-sm">
									Wizualizacja sieci interakcji (implementacja w toku)
								</div>
							</div>

							{/* Network Statistics */}
							{visualizationData && (
								<div className="mt-4 grid grid-cols-3 gap-4">
									<div className="rounded-lg border p-3 text-center">
										<div className="font-bold text-blue-600 text-lg">
											{visualizationData.nodes.length}
										</div>
										<div className="text-gray-600 text-xs">Węzły</div>
									</div>
									<div className="rounded-lg border p-3 text-center">
										<div className="font-bold text-green-600 text-lg">
											{visualizationData.edges.length}
										</div>
										<div className="text-gray-600 text-xs">Połączenia</div>
									</div>
									<div className="rounded-lg border p-3 text-center">
										<div className="font-bold text-lg text-purple-600">
											{visualizationData.clusters.length}
										</div>
										<div className="text-gray-600 text-xs">Klastry</div>
									</div>
								</div>
							)}
						</TabsContent>

						{/* Details View */}
						<TabsContent value="details" className="space-y-4 p-6">
							<h3 className="mb-4 font-medium text-lg">Szczegóły interakcji</h3>

							<div className="space-y-3">
								{filteredInteractions.map((interaction, index) => (
									<Card
										key={index}
										className="cursor-pointer transition-shadow hover:shadow-md"
									>
										<CardHeader className="pb-2">
											<CardTitle className="flex items-center justify-between text-sm">
												<span>
													{interaction.supplementA} ↔ {interaction.supplementB}
												</span>
												<div className="flex items-center gap-2">
													{getInteractionTypeIcon(interaction.interactionType)}
													<Badge
														className={getSeverityColor(interaction.severity)}
													>
														{interaction.severity === "CONTRAINDICATED"
															? "Przeciwwskazane"
															: interaction.severity === "MAJOR"
																? "Poważne"
																: interaction.severity === "MODERATE"
																	? "Umiarkowane"
																	: interaction.severity === "MINOR"
																		? "Drobne"
																		: "Korzystne"}
													</Badge>
												</div>
											</CardTitle>
										</CardHeader>
										<CardContent>
											<div className="space-y-2">
												<div>
													<h5 className="mb-1 font-medium text-xs">
														Mechanizm:
													</h5>
													<p className="text-gray-600 text-xs">
														{interaction.polishMechanism}
													</p>
												</div>

												<div>
													<h5 className="mb-1 font-medium text-xs">
														Znaczenie kliniczne:
													</h5>
													<p className="text-gray-600 text-xs">
														{interaction.polishClinicalSignificance}
													</p>
												</div>

												<div>
													<h5 className="mb-1 font-medium text-xs">
														Zalecenie:
													</h5>
													<p className="text-gray-600 text-xs">
														{interaction.polishRecommendation}
													</p>
												</div>

												<div className="flex items-center gap-4 text-gray-500 text-xs">
													<span>
														Poziom dowodów: {interaction.evidenceLevel}
													</span>
													{interaction.timing.separationRequired && (
														<span className="flex items-center gap-1">
															<Clock className="h-3 w-3" />
															Rozdzielenie czasowe wymagane
														</span>
													)}
												</div>
											</div>
										</CardContent>
									</Card>
								))}
							</div>

							{filteredInteractions.length === 0 && (
								<Alert>
									<Info className="h-4 w-4" />
									<AlertDescription>
										Brak interakcji spełniających wybrane kryteria filtrowania.
									</AlertDescription>
								</Alert>
							)}
						</TabsContent>

						{/* Recommendations View */}
						<TabsContent value="recommendations" className="space-y-4 p-6">
							<h3 className="mb-4 font-medium text-lg">
								Zalecenia bezpieczeństwa
							</h3>

							{interactionMatrix?.recommendations.map(
								(recommendation, index) => (
									<Card key={index}>
										<CardHeader className="pb-2">
											<CardTitle className="flex items-center gap-2 text-sm">
												{recommendation.type === "TIMING" && (
													<Clock className="h-4 w-4" />
												)}
												{recommendation.type === "DOSAGE" && (
													<Target className="h-4 w-4" />
												)}
												{recommendation.type === "MONITORING" && (
													<Activity className="h-4 w-4" />
												)}
												{recommendation.type === "AVOIDANCE" && (
													<XCircle className="h-4 w-4" />
												)}
												{recommendation.type === "ALTERNATIVE" && (
													<RotateCcw className="h-4 w-4" />
												)}
												{recommendation.polishRecommendation}
												<Badge
													variant={
														recommendation.priority === "HIGH"
															? "destructive"
															: recommendation.priority === "MEDIUM"
																? "default"
																: "secondary"
													}
												>
													{recommendation.priority === "HIGH"
														? "Wysoki"
														: recommendation.priority === "MEDIUM"
															? "Średni"
															: "Niski"}
												</Badge>
											</CardTitle>
										</CardHeader>
										<CardContent>
											<div className="space-y-3">
												<div>
													<h5 className="mb-1 font-medium text-xs">
														Uzasadnienie:
													</h5>
													<p className="text-gray-600 text-xs">
														{recommendation.polishRationale}
													</p>
												</div>

												<div>
													<h5 className="mb-1 font-medium text-xs">
														Kroki implementacji:
													</h5>
													<ul className="space-y-1 text-gray-600 text-xs">
														{recommendation.polishImplementationSteps.map(
															(step, stepIndex) => (
																<li
																	key={stepIndex}
																	className="flex items-start gap-2"
																>
																	<span className="mt-1 text-blue-500">•</span>
																	{step}
																</li>
															),
														)}
													</ul>
												</div>
											</div>
										</CardContent>
									</Card>
								),
							)}

							{(!interactionMatrix?.recommendations ||
								interactionMatrix.recommendations.length === 0) && (
								<Alert>
									<CheckCircle className="h-4 w-4 text-green-600" />
									<AlertDescription>
										Brak specjalnych zaleceń. Obecna kombinacja suplementów
										wydaje się bezpieczna.
									</AlertDescription>
								</Alert>
							)}
						</TabsContent>
					</Tabs>
				</CardContent>
			</Card>

			{/* Selected Interaction Details Modal */}
			{selectedInteraction && (
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center justify-between">
							Szczegóły interakcji
							<Button
								variant="ghost"
								size="sm"
								onClick={() => setSelectedInteraction(null)}
							>
								✕
							</Button>
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<div className="flex items-center gap-2">
								<h4 className="font-medium">
									{selectedInteraction.supplementA} ↔{" "}
									{selectedInteraction.supplementB}
								</h4>
								<Badge
									className={getSeverityColor(selectedInteraction.severity)}
								>
									{selectedInteraction.severity}
								</Badge>
							</div>

							<Separator />

							<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
								<div>
									<h5 className="mb-2 font-medium">Informacje podstawowe</h5>
									<div className="space-y-2 text-sm">
										<div>
											<strong>Typ:</strong>{" "}
											{selectedInteraction.interactionType}
										</div>
										<div>
											<strong>Mechanizm:</strong>{" "}
											{selectedInteraction.polishMechanism}
										</div>
										<div>
											<strong>Poziom dowodów:</strong>{" "}
											{selectedInteraction.evidenceLevel}
										</div>
									</div>
								</div>

								<div>
									<h5 className="mb-2 font-medium">Zalecenia kliniczne</h5>
									<div className="space-y-2 text-sm">
										<div>
											<strong>Znaczenie:</strong>{" "}
											{selectedInteraction.polishClinicalSignificance}
										</div>
										<div>
											<strong>Zalecenie:</strong>{" "}
											{selectedInteraction.polishRecommendation}
										</div>
									</div>
								</div>
							</div>

							{selectedInteraction.timing.separationRequired && (
								<Alert className="border-blue-200 bg-blue-50">
									<Clock className="h-4 w-4 text-blue-600" />
									<AlertDescription>
										<strong>Rozdzielenie czasowe:</strong>{" "}
										{selectedInteraction.timing.polishExplanation}
									</AlertDescription>
								</Alert>
							)}

							{selectedInteraction.dosageImpact.requiresDosageAdjustment && (
								<Alert className="border-orange-200 bg-orange-50">
									<Target className="h-4 w-4 text-orange-600" />
									<AlertDescription>
										<strong>Dostosowanie dawki:</strong>{" "}
										{selectedInteraction.dosageImpact.polishExplanation}
									</AlertDescription>
								</Alert>
							)}
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
};

export default InteractionVisualizationPanel;
