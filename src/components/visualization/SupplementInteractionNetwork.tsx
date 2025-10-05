"use client";

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ComprehensiveSupplementProfile } from "@/data/comprehensive-supplements";
import { cn } from "@/lib/utils";
import {
	AlertTriangle,
	CheckCircle,
	Eye,
	EyeOff,
	Info,
	Network,
	RotateCcw,
	Shield,
	Zap,
} from "lucide-react";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";

interface SupplementNode {
	id: string;
	name: string;
	polishName: string;
	category: string;
	evidenceLevel: "STRONG" | "MODERATE" | "WEAK" | "INSUFFICIENT";
	effectiveness?: number;
	costPerMonth?: number;
	position?: { x: number; y: number };
	isSelected?: boolean;
}

interface InteractionEdge {
	id: string;
	sourceId: string;
	targetId: string;
	type: "SYNERGY" | "ANTAGONISM" | "CAUTION" | "CONTRAINDICATION";
	severity: "MILD" | "MODERATE" | "SEVERE";
	mechanism: string;
	polishMechanism: string;
	recommendation: string;
	polishRecommendation: string;
	evidenceLevel: "STRONG" | "MODERATE" | "WEAK" | "THEORETICAL";
}

interface SupplementInteractionNetworkProps {
	supplements: SupplementNode[];
	interactions: InteractionEdge[];
	selectedSupplementIds?: string[];
	onSupplementSelect: (supplementId: string) => void;
	onInteractionSelect: (interaction: InteractionEdge) => void;
	className?: string;
}

// Helper function to convert comprehensive supplement data to network format
export const convertSupplementsToNetworkFormat = (
	supplements: ComprehensiveSupplementProfile[],
): SupplementNode[] => {
	return supplements.map((supplement) => ({
		id: supplement.id,
		name: supplement.name,
		polishName: supplement.polishName,
		category: supplement.category,
		evidenceLevel:
			supplement.evidenceLevel === "CONFLICTING"
				? "WEAK"
				: supplement.evidenceLevel,
		effectiveness:
			supplement.clinicalApplications.reduce(
				(sum, app) => sum + app.effectivenessRating,
				0,
			) / supplement.clinicalApplications.length,
		costPerMonth: supplement.economicData?.averageCostPerMonth?.average || 0,
	}));
};

// Helper function to generate interactions from supplement data
export const generateInteractionsFromSupplements = (
	supplements: ComprehensiveSupplementProfile[],
): InteractionEdge[] => {
	const interactions: InteractionEdge[] = [];

	supplements.forEach((supplement) => {
		supplement.interactions.forEach((interaction) => {
			// Find the target supplement by name
			const targetSupplement = supplements.find(
				(s) =>
					s.name === interaction.substance ||
					s.polishName === interaction.polishSubstance,
			);

			if (targetSupplement) {
				interactions.push({
					id: `${supplement.id}-${targetSupplement.id}-${interaction.type}`,
					sourceId: supplement.id,
					targetId: targetSupplement.id,
					type:
						interaction.type === "synergistic"
							? "SYNERGY"
							: interaction.type === "antagonistic"
								? "ANTAGONISM"
								: "CAUTION",
					severity:
						interaction.severity === "minor"
							? "MILD"
							: interaction.severity === "moderate"
								? "MODERATE"
								: "SEVERE",
					mechanism: interaction.mechanism || "",
					polishMechanism: interaction.polishMechanism || "",
					recommendation: interaction.recommendation || "",
					polishRecommendation: interaction.polishRecommendation || "",
					evidenceLevel:
						interaction.evidenceLevel === "STRONG"
							? "STRONG"
							: interaction.evidenceLevel === "MODERATE"
								? "MODERATE"
								: interaction.evidenceLevel === "WEAK"
									? "WEAK"
									: "THEORETICAL",
				});
			}
		});
	});

	return interactions;
};

const SupplementInteractionNetwork: React.FC<
	SupplementInteractionNetworkProps
> = ({
	supplements,
	interactions,
	selectedSupplementIds = [],
	onSupplementSelect,
	onInteractionSelect,
	className = "",
}) => {
	const svgRef = useRef<SVGSVGElement>(null);
	const [viewMode, setViewMode] = useState<"all" | "selected" | "warnings">(
		"all",
	);
	const [showLabels, setShowLabels] = useState(true);
	const [selectedInteraction, setSelectedInteraction] =
		useState<InteractionEdge | null>(null);
	const [nodePositions, setNodePositions] = useState<
		Record<string, { x: number; y: number }>
	>({});

	// Color schemes
	const categoryColors = {
		NOOTROPIC: "#3B82F6",
		VITAMIN: "#10B981",
		MINERAL: "#F59E0B",
		FATTY_ACID: "#8B5CF6",
		AMINO_ACID: "#EF4444",
		HERB: "#06B6D4",
		PROBIOTIC: "#84CC16",
		ENZYME: "#F97316",
	};

	const interactionColors = {
		SYNERGY: "#10B981",
		ANTAGONISM: "#F59E0B",
		CAUTION: "#EF4444",
		CONTRAINDICATION: "#DC2626",
	};

	const severityColors = {
		MILD: "#10B981",
		MODERATE: "#F59E0B",
		SEVERE: "#EF4444",
	};

	// Initialize node positions using force-directed layout simulation
	useEffect(() => {
		if (supplements.length === 0) return;

		const width = 600;
		const height = 400;
		const centerX = width / 2;
		const centerY = height / 2;

		// Simple circular layout for initial positioning
		const positions: Record<string, { x: number; y: number }> = {};
		const radius = Math.min(width, height) * 0.3;

		supplements.forEach((supplement, index) => {
			const angle = (index / supplements.length) * 2 * Math.PI;
			positions[supplement.id] = {
				x: centerX + radius * Math.cos(angle),
				y: centerY + radius * Math.sin(angle),
			};
		});

		setNodePositions(positions);
	}, [supplements]);

	// Filter supplements and interactions based on view mode
	const filteredSupplements = supplements.filter((supplement) => {
		switch (viewMode) {
			case "selected":
				return selectedSupplementIds.includes(supplement.id);
			case "warnings":
				return interactions.some(
					(interaction) =>
						(interaction.sourceId === supplement.id ||
							interaction.targetId === supplement.id) &&
						(interaction.type === "CAUTION" ||
							interaction.type === "CONTRAINDICATION"),
				);
			default:
				return true;
		}
	});

	const filteredInteractions = interactions.filter((interaction) => {
		const sourceVisible = filteredSupplements.some(
			(s) => s.id === interaction.sourceId,
		);
		const targetVisible = filteredSupplements.some(
			(s) => s.id === interaction.targetId,
		);
		return sourceVisible && targetVisible;
	});

	const getNodeSize = useCallback(
		(supplement: SupplementNode) => {
			let baseSize = 20;

			if (selectedSupplementIds.includes(supplement.id)) {
				baseSize += 8;
			}

			// Size based on number of interactions
			const interactionCount = interactions.filter(
				(i) => i.sourceId === supplement.id || i.targetId === supplement.id,
			).length;
			baseSize += Math.min(interactionCount * 2, 10);

			return baseSize;
		},
		[selectedSupplementIds, interactions],
	);

	const getNodeColor = useCallback(
		(supplement: SupplementNode) => {
			if (selectedSupplementIds.includes(supplement.id)) {
				return "#1F2937"; // Dark gray for selected
			}
			return (
				categoryColors[supplement.category as keyof typeof categoryColors] ||
				"#6B7280"
			);
		},
		[selectedSupplementIds],
	);

	const getInteractionPath = useCallback(
		(interaction: InteractionEdge) => {
			const source = nodePositions[interaction.sourceId];
			const target = nodePositions[interaction.targetId];

			if (!source || !target) return "";

			// Create curved path for better visibility
			const midX = (source.x + target.x) / 2;
			const midY = (source.y + target.y) / 2;
			const dx = target.x - source.x;
			const dy = target.y - source.y;
			const distance = Math.sqrt(dx * dx + dy * dy);

			// Curve offset based on interaction type
			const curveOffset = interaction.type === "SYNERGY" ? -20 : 20;
			const offsetX = (-dy / distance) * curveOffset;
			const offsetY = (dx / distance) * curveOffset;

			return `M ${source.x} ${source.y} Q ${midX + offsetX} ${midY + offsetY} ${target.x} ${target.y}`;
		},
		[nodePositions],
	);

	const getInteractionStrokeWidth = useCallback(
		(interaction: InteractionEdge) => {
			switch (interaction.severity) {
				case "SEVERE":
					return 4;
				case "MODERATE":
					return 3;
				case "MILD":
					return 2;
				default:
					return 2;
			}
		},
		[],
	);

	const handleNodeClick = useCallback(
		(supplement: SupplementNode) => {
			onSupplementSelect(supplement.id);
		},
		[onSupplementSelect],
	);

	const handleInteractionClick = useCallback(
		(interaction: InteractionEdge) => {
			setSelectedInteraction(interaction);
			onInteractionSelect(interaction);
		},
		[onInteractionSelect],
	);

	const resetLayout = useCallback(() => {
		// Trigger re-layout
		const event = new Event("resize");
		window.dispatchEvent(event);
	}, []);

	const getInteractionTypeText = (type: string) => {
		switch (type) {
			case "SYNERGY":
				return "Synergia";
			case "ANTAGONISM":
				return "Antagonizm";
			case "CAUTION":
				return "Ostrożność";
			case "CONTRAINDICATION":
				return "Przeciwwskazanie";
			default:
				return type;
		}
	};

	const getSeverityText = (severity: string) => {
		switch (severity) {
			case "MILD":
				return "Łagodne";
			case "MODERATE":
				return "Umiarkowane";
			case "SEVERE":
				return "Ciężkie";
			default:
				return severity;
		}
	};

	return (
		<Card className={cn("w-full", className)}>
			<CardHeader>
				<div className="flex items-center justify-between">
					<CardTitle className="flex items-center gap-2">
						<Network className="h-5 w-5" />
						Sieć interakcji suplementów
					</CardTitle>
					<div className="flex items-center gap-2">
						<Select
							value={viewMode}
							onValueChange={(value: any) => setViewMode(value)}
						>
							<SelectTrigger className="w-40">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">Wszystkie</SelectItem>
								<SelectItem value="selected">Wybrane</SelectItem>
								<SelectItem value="warnings">Ostrzeżenia</SelectItem>
							</SelectContent>
						</Select>
						<Button
							variant={showLabels ? "default" : "outline"}
							size="sm"
							onClick={() => setShowLabels(!showLabels)}
						>
							{showLabels ? (
								<Eye className="h-3 w-3" />
							) : (
								<EyeOff className="h-3 w-3" />
							)}
						</Button>
						<Button variant="outline" size="sm" onClick={resetLayout}>
							<RotateCcw className="h-3 w-3" />
						</Button>
					</div>
				</div>
			</CardHeader>

			<CardContent>
				<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
					{/* Network Visualization */}
					<div className="lg:col-span-2">
						<Card>
							<CardContent className="p-4">
								<div className="relative overflow-hidden rounded-lg bg-gray-50">
									<svg
										ref={svgRef}
										viewBox="0 0 600 400"
										className="h-full w-full"
										style={{ minHeight: "400px" }}
									>
										{/* Interaction edges */}
										<g className="interactions">
											{filteredInteractions.map((interaction) => (
												<g key={interaction.id}>
													<path
														d={getInteractionPath(interaction)}
														stroke={interactionColors[interaction.type]}
														strokeWidth={getInteractionStrokeWidth(interaction)}
														fill="none"
														opacity={
															selectedInteraction?.id === interaction.id
																? 1
																: 0.6
														}
														className="cursor-pointer transition-opacity hover:opacity-100"
														onClick={() => handleInteractionClick(interaction)}
														strokeDasharray={
															interaction.evidenceLevel === "THEORETICAL"
																? "5 5"
																: "none"
														}
													/>

													{/* Interaction type indicator */}
													{interaction.type === "CONTRAINDICATION" &&
														nodePositions[interaction.sourceId] &&
														nodePositions[interaction.targetId] && (
															<circle
																cx={
																	((nodePositions[interaction.sourceId]?.x ||
																		0) +
																		(nodePositions[interaction.targetId]?.x ||
																			0)) /
																	2
																}
																cy={
																	((nodePositions[interaction.sourceId]?.y ||
																		0) +
																		(nodePositions[interaction.targetId]?.y ||
																			0)) /
																	2
																}
																r="8"
																fill="#DC2626"
																stroke="white"
																strokeWidth="2"
																className="pointer-events-none"
															/>
														)}
												</g>
											))}
										</g>

										{/* Supplement nodes */}
										<g className="nodes">
											{filteredSupplements.map((supplement) => {
												const position = nodePositions[supplement.id];
												if (!position) return null;

												return (
													<g key={supplement.id}>
														<circle
															cx={position.x}
															cy={position.y}
															r={getNodeSize(supplement)}
															fill={getNodeColor(supplement)}
															stroke={
																selectedSupplementIds.includes(supplement.id)
																	? "#1F2937"
																	: "#FFFFFF"
															}
															strokeWidth={
																selectedSupplementIds.includes(supplement.id)
																	? 3
																	: 2
															}
															className="cursor-pointer transition-all hover:stroke-4 hover:stroke-gray-700"
															onClick={() => handleNodeClick(supplement)}
														/>

														{/* Node label */}
														{showLabels && (
															<text
																x={position.x}
																y={position.y + getNodeSize(supplement) + 15}
																textAnchor="middle"
																className="pointer-events-none fill-gray-700 font-medium text-xs"
																style={{ fontSize: "10px" }}
															>
																{supplement.polishName.length > 10
																	? `${supplement.polishName.substring(0, 10)}...`
																	: supplement.polishName}
															</text>
														)}

														{/* Warning indicator */}
														{interactions.some(
															(i) =>
																(i.sourceId === supplement.id ||
																	i.targetId === supplement.id) &&
																(i.type === "CAUTION" ||
																	i.type === "CONTRAINDICATION"),
														) && (
															<circle
																cx={position.x + getNodeSize(supplement) - 5}
																cy={position.y - getNodeSize(supplement) + 5}
																r="6"
																fill="#EF4444"
																stroke="white"
																strokeWidth="2"
																className="pointer-events-none"
															/>
														)}
													</g>
												);
											})}
										</g>
									</svg>
								</div>

								{/* Legend */}
								<div className="mt-4 grid grid-cols-2 gap-4">
									<div>
										<h4 className="mb-2 font-medium text-sm">
											Typy interakcji
										</h4>
										<div className="space-y-1">
											{Object.entries(interactionColors).map(
												([type, color]) => (
													<div
														key={type}
														className="flex items-center gap-2 text-xs"
													>
														<div
															className="h-1 w-4 rounded"
															style={{ backgroundColor: color }}
														/>
														<span>{getInteractionTypeText(type)}</span>
													</div>
												),
											)}
										</div>
									</div>

									<div>
										<h4 className="mb-2 font-medium text-sm">
											Kategorie suplementów
										</h4>
										<div className="space-y-1">
											{Object.entries(categoryColors)
												.slice(0, 4)
												.map(([category, color]) => (
													<div
														key={category}
														className="flex items-center gap-2 text-xs"
													>
														<div
															className="h-3 w-3 rounded-full"
															style={{ backgroundColor: color }}
														/>
														<span>
															{category === "NOOTROPIC"
																? "Nootropiki"
																: category === "VITAMIN"
																	? "Witaminy"
																	: category === "MINERAL"
																		? "Minerały"
																		: "Kwasy tłuszczowe"}
														</span>
													</div>
												))}
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Interaction Details */}
					<div className="space-y-4">
						{selectedInteraction ? (
							<Card>
								<CardHeader className="pb-4">
									<CardTitle className="flex items-center gap-2 text-base">
										{selectedInteraction.type === "SYNERGY" ? (
											<CheckCircle className="h-4 w-4 text-green-600" />
										) : selectedInteraction.type === "CONTRAINDICATION" ? (
											<AlertTriangle className="h-4 w-4 text-red-600" />
										) : (
											<Info className="h-4 w-4 text-yellow-600" />
										)}
										{getInteractionTypeText(selectedInteraction.type)}
									</CardTitle>
									<Badge
										style={{
											backgroundColor:
												severityColors[selectedInteraction.severity],
										}}
										className="w-fit text-white"
									>
										{getSeverityText(selectedInteraction.severity)}
									</Badge>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										<div>
											<h4 className="mb-2 font-medium text-sm">Suplementy</h4>
											<div className="space-y-1">
												{[
													selectedInteraction.sourceId,
													selectedInteraction.targetId,
												].map((id) => {
													const supplement = supplements.find(
														(s) => s.id === id,
													);
													return supplement ? (
														<div key={id} className="text-sm">
															{supplement.polishName}
														</div>
													) : null;
												})}
											</div>
										</div>

										<div>
											<h4 className="mb-2 font-medium text-sm">Mechanizm</h4>
											<p className="text-gray-600 text-sm">
												{selectedInteraction.polishMechanism}
											</p>
										</div>

										<div>
											<h4 className="mb-2 font-medium text-sm">Zalecenia</h4>
											<p className="text-gray-600 text-sm">
												{selectedInteraction.polishRecommendation}
											</p>
										</div>

										<div>
											<h4 className="mb-2 font-medium text-sm">
												Poziom dowodów
											</h4>
											<Badge variant="outline" className="text-xs">
												{selectedInteraction.evidenceLevel === "STRONG"
													? "Silne"
													: selectedInteraction.evidenceLevel === "MODERATE"
														? "Umiarkowane"
														: selectedInteraction.evidenceLevel === "WEAK"
															? "Słabe"
															: "Teoretyczne"}
											</Badge>
										</div>
									</div>
								</CardContent>
							</Card>
						) : (
							<Card>
								<CardContent className="flex flex-col items-center justify-center py-8">
									<Network className="mb-4 h-12 w-12 text-gray-400" />
									<h3 className="mb-2 font-medium text-base text-gray-900">
										Wybierz interakcję
									</h3>
									<p className="text-center text-gray-600 text-sm">
										Kliknij na linię między suplementami, aby zobaczyć szczegóły
										interakcji.
									</p>
								</CardContent>
							</Card>
						)}

						{/* Network Statistics */}
						<Card>
							<CardHeader className="pb-4">
								<CardTitle className="text-base">Statystyki sieci</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-3">
									<div className="flex items-center justify-between">
										<span className="text-sm">Suplementy</span>
										<span className="font-medium text-sm">
											{filteredSupplements.length}
										</span>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-sm">Interakcje</span>
										<span className="font-medium text-sm">
											{filteredInteractions.length}
										</span>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-sm">Ostrzeżenia</span>
										<span className="font-medium text-red-600 text-sm">
											{
												filteredInteractions.filter(
													(i) =>
														i.type === "CAUTION" ||
														i.type === "CONTRAINDICATION",
												).length
											}
										</span>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-sm">Synergie</span>
										<span className="font-medium text-green-600 text-sm">
											{
												filteredInteractions.filter((i) => i.type === "SYNERGY")
													.length
											}
										</span>
									</div>

									{/* Average effectiveness and cost */}
									{filteredSupplements.length > 0 && (
										<div className="border-t pt-2">
											<div className="flex items-center justify-between">
												<span className="text-sm">Średnia skuteczność</span>
												<span className="font-medium text-sm">
													{(
														filteredSupplements.reduce(
															(sum, s) => sum + (s.effectiveness || 0),
															0,
														) / filteredSupplements.length
													).toFixed(1)}
													/10
												</span>
											</div>
											<div className="flex items-center justify-between">
												<span className="text-sm">Średni koszt</span>
												<span className="font-medium text-sm">
													{Math.round(
														filteredSupplements.reduce(
															(sum, s) => sum + (s.costPerMonth || 0),
															0,
														) / filteredSupplements.length,
													)}
													€/miesiąc
												</span>
											</div>
										</div>
									)}
								</div>
							</CardContent>
						</Card>

						{/* Quick Actions */}
						<Card>
							<CardHeader className="pb-4">
								<CardTitle className="text-base">Szybkie akcje</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-2">
									<Button
										variant="outline"
										size="sm"
										className="w-full justify-start"
										onClick={() => setViewMode("warnings")}
									>
										<AlertTriangle className="mr-2 h-3 w-3" />
										Pokaż ostrzeżenia
									</Button>
									<Button
										variant="outline"
										size="sm"
										className="w-full justify-start"
										onClick={() => setViewMode("selected")}
									>
										<Zap className="mr-2 h-3 w-3" />
										Tylko wybrane
									</Button>
									<Button
										variant="outline"
										size="sm"
										className="w-full justify-start"
										onClick={() => setViewMode("all")}
									>
										<Shield className="mr-2 h-3 w-3" />
										Pokaż wszystkie
									</Button>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export default SupplementInteractionNetwork;
