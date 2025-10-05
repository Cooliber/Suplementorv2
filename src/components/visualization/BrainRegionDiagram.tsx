"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
	Activity,
	Brain,
	Eye,
	EyeOff,
	Info,
	Layers,
	Target,
	Zap,
} from "lucide-react";
import type React from "react";
import { useCallback, useState } from "react";

interface BrainRegionData {
	id: string;
	name: string;
	polishName: string;
	category: "CORTEX" | "SUBCORTICAL" | "BRAINSTEM" | "CEREBELLUM" | "LIMBIC";
	position: { x: number; y: number };
	size: number;
	functions: string[];
	polishFunctions: string[];
	supplementEffects: Array<{
		supplementId: string;
		supplementName: string;
		polishSupplementName: string;
		effectType:
			| "ENHANCES"
			| "MODULATES"
			| "PROTECTS"
			| "STIMULATES"
			| "INHIBITS";
		intensity: number;
		mechanism: string;
		polishMechanism: string;
		evidenceLevel: "STRONG" | "MODERATE" | "WEAK" | "INSUFFICIENT";
	}>;
	neurotransmitterActivity: Array<{
		neurotransmitter: string;
		polishNeurotransmitter: string;
		activity: "HIGH" | "MODERATE" | "LOW" | "VARIABLE";
		function: string;
		polishFunction: string;
	}>;
}

interface BrainRegionDiagramProps {
	brainRegions: BrainRegionData[];
	selectedSupplementId?: string;
	selectedRegionId?: string;
	onRegionSelect: (regionId: string) => void;
	onSupplementSelect: (supplementId: string) => void;
	showNeurotransmitters?: boolean;
	className?: string;
}

const BrainRegionDiagram: React.FC<BrainRegionDiagramProps> = ({
	brainRegions,
	selectedSupplementId,
	selectedRegionId,
	onRegionSelect,
	onSupplementSelect,
	showNeurotransmitters = false,
	className = "",
}) => {
	const [viewMode, setViewMode] = useState<"sagittal" | "coronal" | "axial">(
		"sagittal",
	);
	const [showLabels, setShowLabels] = useState(true);
	const [highlightMode, setHighlightMode] = useState<
		"effects" | "neurotransmitters" | "none"
	>("effects");

	// Color schemes for different categories and effects
	const categoryColors = {
		CORTEX: "#3B82F6",
		SUBCORTICAL: "#10B981",
		BRAINSTEM: "#F59E0B",
		CEREBELLUM: "#8B5CF6",
		LIMBIC: "#EF4444",
	};

	const effectTypeColors = {
		ENHANCES: "#10B981",
		MODULATES: "#3B82F6",
		PROTECTS: "#8B5CF6",
		STIMULATES: "#F59E0B",
		INHIBITS: "#EF4444",
	};

	const activityColors = {
		HIGH: "#EF4444",
		MODERATE: "#F59E0B",
		LOW: "#10B981",
		VARIABLE: "#8B5CF6",
	};

	const getRegionColor = useCallback(
		(region: BrainRegionData) => {
			if (selectedSupplementId && highlightMode === "effects") {
				const effect = region.supplementEffects.find(
					(e) => e.supplementId === selectedSupplementId,
				);
				if (effect) {
					return effectTypeColors[effect.effectType];
				}
				return "#E5E7EB"; // Gray for unaffected regions
			}

			if (highlightMode === "neurotransmitters") {
				const highActivity = region.neurotransmitterActivity.find(
					(nt) => nt.activity === "HIGH",
				);
				if (highActivity) {
					return activityColors.HIGH;
				}
			}

			return categoryColors[region.category];
		},
		[selectedSupplementId, highlightMode],
	);

	const getRegionOpacity = useCallback(
		(region: BrainRegionData) => {
			if (selectedRegionId && selectedRegionId !== region.id) {
				return 0.3;
			}

			if (selectedSupplementId && highlightMode === "effects") {
				const effect = region.supplementEffects.find(
					(e) => e.supplementId === selectedSupplementId,
				);
				if (effect) {
					return 0.7 + (effect.intensity / 100) * 0.3; // 0.7 to 1.0 based on intensity
				}
				return 0.2;
			}

			return 0.8;
		},
		[selectedRegionId, selectedSupplementId, highlightMode],
	);

	const getRegionSize = useCallback(
		(region: BrainRegionData) => {
			let baseSize = region.size;

			if (selectedSupplementId && highlightMode === "effects") {
				const effect = region.supplementEffects.find(
					(e) => e.supplementId === selectedSupplementId,
				);
				if (effect) {
					baseSize *= 1 + effect.intensity / 200; // Increase size based on effect intensity
				}
			}

			if (selectedRegionId === region.id) {
				baseSize *= 1.2; // Increase size for selected region
			}

			return Math.max(baseSize, 8); // Minimum size
		},
		[selectedRegionId, selectedSupplementId, highlightMode],
	);

	const selectedRegion = brainRegions.find((r) => r.id === selectedRegionId);

	// SVG Brain Outline (simplified sagittal view)
	const BrainOutline = () => (
		<svg
			viewBox="0 0 400 300"
			className="h-full w-full"
			style={{ maxHeight: "400px" }}
		>
			{/* Brain outline */}
			<path
				d="M50 150 Q50 50 150 50 Q250 50 300 80 Q350 100 350 150 Q350 200 320 230 Q280 250 200 250 Q120 250 80 220 Q50 200 50 150 Z"
				fill="none"
				stroke="#E5E7EB"
				strokeWidth="2"
				className="brain-outline"
			/>

			{/* Central structures outline */}
			<path
				d="M150 100 Q200 90 250 100 Q280 120 280 150 Q280 180 250 200 Q200 210 150 200 Q120 180 120 150 Q120 120 150 100 Z"
				fill="none"
				stroke="#D1D5DB"
				strokeWidth="1"
				strokeDasharray="3 3"
			/>

			{/* Brain regions */}
			{brainRegions.map((region) => {
				const adjustedPosition = {
					x: region.position.x * 400,
					y: region.position.y * 300,
				};

				return (
					<g key={region.id}>
						{/* Region circle */}
						<circle
							cx={adjustedPosition.x}
							cy={adjustedPosition.y}
							r={getRegionSize(region)}
							fill={getRegionColor(region)}
							opacity={getRegionOpacity(region)}
							stroke={
								selectedRegionId === region.id ? "#1F2937" : "transparent"
							}
							strokeWidth={selectedRegionId === region.id ? 2 : 0}
							className="cursor-pointer transition-all duration-200 hover:stroke-2 hover:stroke-gray-700"
							onClick={() => onRegionSelect(region.id)}
						/>

						{/* Region label */}
						{showLabels && (
							<text
								x={adjustedPosition.x}
								y={adjustedPosition.y + getRegionSize(region) + 12}
								textAnchor="middle"
								className="pointer-events-none fill-gray-700 font-medium text-xs"
								style={{ fontSize: "10px" }}
							>
								{region.polishName.length > 12
									? `${region.polishName.substring(0, 12)}...`
									: region.polishName}
							</text>
						)}

						{/* Effect indicator */}
						{selectedSupplementId &&
							highlightMode === "effects" &&
							(() => {
								const effect = region.supplementEffects.find(
									(e) => e.supplementId === selectedSupplementId,
								);
								if (effect) {
									return (
										<circle
											cx={adjustedPosition.x + getRegionSize(region) - 3}
											cy={adjustedPosition.y - getRegionSize(region) + 3}
											r="4"
											fill="#FFFFFF"
											stroke={effectTypeColors[effect.effectType]}
											strokeWidth="2"
											className="pointer-events-none"
										/>
									);
								}
								return null;
							})()}
					</g>
				);
			})}
		</svg>
	);

	return (
		<Card className={cn("w-full", className)}>
			<CardHeader>
				<div className="flex items-center justify-between">
					<CardTitle className="flex items-center gap-2">
						<Brain className="h-5 w-5" />
						Mapa wpływu na mózg
					</CardTitle>
					<div className="flex items-center gap-2">
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
							<span className="ml-1 text-xs">Etykiety</span>
						</Button>
					</div>
				</div>
			</CardHeader>

			<CardContent>
				<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
					{/* Brain Diagram */}
					<div className="lg:col-span-2">
						<Card>
							<CardHeader className="pb-4">
								<div className="flex items-center justify-between">
									<h3 className="font-medium text-base">Widok sagitalny</h3>
									<div className="flex items-center gap-2">
										<Button
											variant={
												highlightMode === "effects" ? "default" : "outline"
											}
											size="sm"
											onClick={() => setHighlightMode("effects")}
										>
											<Zap className="mr-1 h-3 w-3" />
											Efekty
										</Button>
										<Button
											variant={
												highlightMode === "neurotransmitters"
													? "default"
													: "outline"
											}
											size="sm"
											onClick={() => setHighlightMode("neurotransmitters")}
										>
											<Activity className="mr-1 h-3 w-3" />
											Neuroprzekaźniki
										</Button>
									</div>
								</div>
							</CardHeader>
							<CardContent>
								<div className="relative rounded-lg bg-gray-50 p-4">
									<BrainOutline />
								</div>

								{/* Legend */}
								<div className="mt-4 grid grid-cols-2 gap-4">
									<div>
										<h4 className="mb-2 font-medium text-sm">
											Kategorie regionów
										</h4>
										<div className="space-y-1">
											{Object.entries(categoryColors).map(
												([category, color]) => (
													<div
														key={category}
														className="flex items-center gap-2 text-xs"
													>
														<div
															className="h-3 w-3 rounded-full"
															style={{ backgroundColor: color }}
														/>
														<span>
															{category === "CORTEX"
																? "Kora"
																: category === "SUBCORTICAL"
																	? "Podkorowe"
																	: category === "BRAINSTEM"
																		? "Pień mózgu"
																		: category === "CEREBELLUM"
																			? "Móżdżek"
																			: "Limbiczny"}
														</span>
													</div>
												),
											)}
										</div>
									</div>

									{highlightMode === "effects" && (
										<div>
											<h4 className="mb-2 font-medium text-sm">Typy efektów</h4>
											<div className="space-y-1">
												{Object.entries(effectTypeColors).map(
													([type, color]) => (
														<div
															key={type}
															className="flex items-center gap-2 text-xs"
														>
															<div
																className="h-3 w-3 rounded-full"
																style={{ backgroundColor: color }}
															/>
															<span>
																{type === "ENHANCES"
																	? "Wzmacnia"
																	: type === "MODULATES"
																		? "Moduluje"
																		: type === "PROTECTS"
																			? "Chroni"
																			: type === "STIMULATES"
																				? "Stymuluje"
																				: "Hamuje"}
															</span>
														</div>
													),
												)}
											</div>
										</div>
									)}
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Region Details */}
					<div className="space-y-4">
						{selectedRegion ? (
							<Card>
								<CardHeader className="pb-4">
									<CardTitle className="text-base">
										{selectedRegion.polishName}
									</CardTitle>
									<Badge variant="outline" className="w-fit">
										{selectedRegion.category === "CORTEX"
											? "Kora"
											: selectedRegion.category === "SUBCORTICAL"
												? "Podkorowe"
												: selectedRegion.category === "BRAINSTEM"
													? "Pień mózgu"
													: selectedRegion.category === "CEREBELLUM"
														? "Móżdżek"
														: "Limbiczny"}
									</Badge>
								</CardHeader>
								<CardContent>
									<Tabs defaultValue="functions" className="w-full">
										<TabsList className="grid w-full grid-cols-2">
											<TabsTrigger value="functions" className="text-xs">
												Funkcje
											</TabsTrigger>
											<TabsTrigger value="effects" className="text-xs">
												Efekty
											</TabsTrigger>
										</TabsList>

										<TabsContent value="functions" className="mt-4">
											<div className="space-y-3">
												<div>
													<h4 className="mb-2 font-medium text-sm">
														Główne funkcje
													</h4>
													<div className="space-y-1">
														{selectedRegion.polishFunctions.map(
															(func, index) => (
																<div
																	key={index}
																	className="flex items-center gap-2 text-xs"
																>
																	<div className="h-1 w-1 rounded-full bg-blue-600" />
																	{func}
																</div>
															),
														)}
													</div>
												</div>

												<div>
													<h4 className="mb-2 font-medium text-sm">
														Aktywność neuroprzekaźników
													</h4>
													<div className="space-y-2">
														{selectedRegion.neurotransmitterActivity
															.slice(0, 3)
															.map((nt, index) => (
																<div
																	key={index}
																	className="flex items-center justify-between"
																>
																	<span className="text-xs">
																		{nt.polishNeurotransmitter}
																	</span>
																	<Badge
																		variant="outline"
																		className="text-xs"
																		style={{
																			borderColor: activityColors[nt.activity],
																			color: activityColors[nt.activity],
																		}}
																	>
																		{nt.activity === "HIGH"
																			? "Wysoka"
																			: nt.activity === "MODERATE"
																				? "Umiarkowana"
																				: nt.activity === "LOW"
																					? "Niska"
																					: "Zmienna"}
																	</Badge>
																</div>
															))}
													</div>
												</div>
											</div>
										</TabsContent>

										<TabsContent value="effects" className="mt-4">
											<div className="space-y-3">
												{selectedRegion.supplementEffects.length > 0 ? (
													selectedRegion.supplementEffects
														.slice(0, 3)
														.map((effect, index) => (
															<div
																key={index}
																className="rounded-lg border p-3"
															>
																<div className="mb-2 flex items-center justify-between">
																	<span className="font-medium text-sm">
																		{effect.polishSupplementName}
																	</span>
																	<Badge
																		style={{
																			backgroundColor:
																				effectTypeColors[effect.effectType],
																		}}
																		className="text-white text-xs"
																	>
																		{effect.effectType === "ENHANCES"
																			? "Wzmacnia"
																			: effect.effectType === "MODULATES"
																				? "Moduluje"
																				: effect.effectType === "PROTECTS"
																					? "Chroni"
																					: effect.effectType === "STIMULATES"
																						? "Stymuluje"
																						: "Hamuje"}
																	</Badge>
																</div>
																<div className="space-y-2">
																	<div className="flex items-center gap-2">
																		<span className="text-gray-600 text-xs">
																			Intensywność:
																		</span>
																		<Progress
																			value={effect.intensity}
																			className="h-2 flex-1"
																		/>
																		<span className="text-xs">
																			{effect.intensity}%
																		</span>
																	</div>
																	<p className="text-gray-600 text-xs">
																		{effect.polishMechanism}
																	</p>
																</div>
															</div>
														))
												) : (
													<div className="py-4 text-center text-gray-500">
														<Info className="mx-auto mb-2 h-8 w-8" />
														<div className="text-sm">
															Brak zarejestrowanych efektów
														</div>
													</div>
												)}
											</div>
										</TabsContent>
									</Tabs>
								</CardContent>
							</Card>
						) : (
							<Card>
								<CardContent className="flex flex-col items-center justify-center py-8">
									<Target className="mb-4 h-12 w-12 text-gray-400" />
									<h3 className="mb-2 font-medium text-base text-gray-900">
										Wybierz region mózgu
									</h3>
									<p className="text-center text-gray-600 text-sm">
										Kliknij na region na diagramie, aby zobaczyć szczegółowe
										informacje o jego funkcjach i efektach suplementów.
									</p>
								</CardContent>
							</Card>
						)}

						{/* Quick Stats */}
						<Card>
							<CardHeader className="pb-4">
								<CardTitle className="text-base">Statystyki</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-3">
									<div className="flex items-center justify-between">
										<span className="text-sm">Regiony z efektami</span>
										<span className="font-medium text-sm">
											{
												brainRegions.filter(
													(r) => r.supplementEffects.length > 0,
												).length
											}
										</span>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-sm">Średnia intensywność</span>
										<span className="font-medium text-sm">
											{selectedSupplementId
												? `${Math.round(
														brainRegions
															.flatMap((r) => r.supplementEffects)
															.filter(
																(e) => e.supplementId === selectedSupplementId,
															)
															.reduce((sum, e) => sum + e.intensity, 0) /
															brainRegions
																.flatMap((r) => r.supplementEffects)
																.filter(
																	(e) =>
																		e.supplementId === selectedSupplementId,
																).length || 0,
													)}%`
												: "N/A"}
										</span>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-sm">Najsilniejszy efekt</span>
										<span className="font-medium text-sm">
											{selectedSupplementId
												? (() => {
														const maxEffect = brainRegions
															.flatMap((r) => r.supplementEffects)
															.filter(
																(e) => e.supplementId === selectedSupplementId,
															)
															.reduce(
																(max, e) =>
																	e.intensity > max.intensity ? e : max,
																{ intensity: 0 },
															);
														return maxEffect.intensity > 0
															? `${maxEffect.intensity}%`
															: "N/A";
													})()
												: "N/A"}
										</span>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export default BrainRegionDiagram;
