"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useKnowledgeGraphStore } from "@/lib/stores/knowledge-graph-store";
import {
	Activity,
	Brain,
	ChevronDown,
	ChevronUp,
	Eye,
	EyeOff,
	Filter,
	FlaskConical,
	Layers,
	Pill,
	Search,
	Settings,
	X,
	Zap,
} from "lucide-react";
import type React from "react";
import { useState } from "react";

interface GraphControlsProps {
	className?: string;
}

// Node type options with Polish labels
const nodeTypeOptions = [
	{ value: "SUPPLEMENT", label: "Suplementy", icon: Pill, color: "#3B82F6" },
	{
		value: "NEUROTRANSMITTER",
		label: "Neurotransmitery",
		icon: Activity,
		color: "#10B981",
	},
	{
		value: "BRAIN_REGION",
		label: "Regiony mózgu",
		icon: Brain,
		color: "#8B5CF6",
	},
	{
		value: "COGNITIVE_FUNCTION",
		label: "Funkcje poznawcze",
		icon: Zap,
		color: "#F59E0B",
	},
	{ value: "PATHWAY", label: "Ścieżki", icon: FlaskConical, color: "#EF4444" },
	{
		value: "MECHANISM",
		label: "Mechanizmy",
		icon: FlaskConical,
		color: "#EC4899",
	},
];

// Relationship type options with Polish labels
const relationshipTypeOptions = [
	{ value: "ENHANCES", label: "Wzmacnia", color: "#10B981" },
	{ value: "INHIBITS", label: "Hamuje", color: "#EF4444" },
	{ value: "MODULATES", label: "Moduluje", color: "#8B5CF6" },
	{ value: "SYNERGIZES", label: "Synergizuje", color: "#F59E0B" },
	{ value: "ANTAGONIZES", label: "Antagonizuje", color: "#F97316" },
	{ value: "REQUIRES", label: "Wymaga", color: "#3B82F6" },
	{ value: "PRODUCES", label: "Produkuje", color: "#EC4899" },
	{ value: "METABOLIZES", label: "Metabolizuje", color: "#06B6D4" },
];

// Evidence level options with Polish labels
const evidenceLevelOptions = [
	{ value: "STRONG", label: "Silne", color: "#10B981" },
	{ value: "MODERATE", label: "Umiarkowane", color: "#F59E0B" },
	{ value: "WEAK", label: "Słabe", color: "#F97316" },
	{ value: "INSUFFICIENT", label: "Niewystarczające", color: "#6B7280" },
	{ value: "CONFLICTING", label: "Sprzeczne", color: "#EF4444" },
];

// Layout options with Polish labels
const layoutOptions = [
	{
		value: "force",
		label: "Układ siłowy",
		description: "Dynamiczny układ oparty na siłach fizycznych",
	},
	{
		value: "hierarchical",
		label: "Hierarchiczny",
		description: "Układ drzewiasty z poziomami",
	},
	{ value: "circular", label: "Kołowy", description: "Węzły ułożone w okręgu" },
	{ value: "grid", label: "Siatkowy", description: "Regularny układ w siatce" },
	{ value: "radial", label: "Promieniowy", description: "Układ koncentryczny" },
];

const GraphControls: React.FC<GraphControlsProps> = ({ className = "" }) => {
	const [isExpanded, setIsExpanded] = useState(true);
	const [activeTab, setActiveTab] = useState<"filters" | "layout" | "display">(
		"filters",
	);

	const {
		filters,
		setFilters,
		resetFilters,
		layout,
		setLayout,
		viewMode,
		setViewMode,
		enablePhysics,
		setEnablePhysics,
		maxRenderNodes,
		setMaxRenderNodes,
		animationSpeed,
		setAnimationSpeed,
		selectedNodes,
		clearSelectedNodes,
	} = useKnowledgeGraphStore();

	const handleNodeTypeToggle = (nodeType: string) => {
		const newNodeTypes = filters.nodeTypes.includes(nodeType as any)
			? filters.nodeTypes.filter((type) => type !== nodeType)
			: [...filters.nodeTypes, nodeType as any];
		setFilters({ nodeTypes: newNodeTypes });
	};

	const handleRelationshipTypeToggle = (relType: string) => {
		const newRelTypes = filters.relationshipTypes.includes(relType as any)
			? filters.relationshipTypes.filter((type) => type !== relType)
			: [...filters.relationshipTypes, relType as any];
		setFilters({ relationshipTypes: newRelTypes });
	};

	const handleEvidenceLevelToggle = (evidenceLevel: string) => {
		const newEvidenceLevels = filters.evidenceLevels.includes(
			evidenceLevel as any,
		)
			? filters.evidenceLevels.filter((level) => level !== evidenceLevel)
			: [...filters.evidenceLevels, evidenceLevel as any];
		setFilters({ evidenceLevels: newEvidenceLevels });
	};

	const handleSearchChange = (value: string) => {
		setFilters({ searchTerm: value });
	};

	const handleStrengthRangeChange = (values: number[]) => {
		setFilters({
			minStrength: values[0] || 0,
			maxStrength: values[1] || 1,
		});
	};

	const handleConfidenceChange = (values: number[]) => {
		setFilters({ minConfidence: values[0] || 0 });
	};

	const handleMaxNodesChange = (values: number[]) => {
		setMaxRenderNodes(values[0] || 100);
	};

	const handleAnimationSpeedChange = (values: number[]) => {
		setAnimationSpeed(values[0] || 1);
	};

	return (
		<TooltipProvider>
			<Card className={`${className}`}>
				<CardHeader className="pb-2">
					<div className="flex items-center justify-between">
						<CardTitle className="flex items-center gap-2 text-lg">
							<Settings className="h-5 w-5" />
							Kontrola grafu
						</CardTitle>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => setIsExpanded(!isExpanded)}
						>
							{isExpanded ? (
								<ChevronUp className="h-4 w-4" />
							) : (
								<ChevronDown className="h-4 w-4" />
							)}
						</Button>
					</div>

					{isExpanded && (
						<div className="mt-2 flex gap-1">
							<Button
								variant={activeTab === "filters" ? "default" : "outline"}
								size="sm"
								onClick={() => setActiveTab("filters")}
							>
								<Filter className="mr-1 h-4 w-4" />
								Filtry
							</Button>
							<Button
								variant={activeTab === "layout" ? "default" : "outline"}
								size="sm"
								onClick={() => setActiveTab("layout")}
							>
								<Layers className="mr-1 h-4 w-4" />
								Układ
							</Button>
							<Button
								variant={activeTab === "display" ? "default" : "outline"}
								size="sm"
								onClick={() => setActiveTab("display")}
							>
								<Eye className="mr-1 h-4 w-4" />
								Wyświetlanie
							</Button>
						</div>
					)}
				</CardHeader>

				{isExpanded && (
					<CardContent className="space-y-4">
						{/* Search */}
						<div className="space-y-2">
							<div className="flex items-center gap-2">
								<Search className="h-4 w-4 text-gray-500" />
								<Input
									placeholder="Szukaj węzłów..."
									value={filters.searchTerm}
									onChange={(e) => handleSearchChange(e.target.value)}
									className="flex-1"
								/>
								{filters.searchTerm && (
									<Button
										variant="ghost"
										size="sm"
										onClick={() => handleSearchChange("")}
									>
										<X className="h-4 w-4" />
									</Button>
								)}
							</div>
						</div>

						{/* Filters Tab */}
						{activeTab === "filters" && (
							<div className="space-y-4">
								{/* Node Types */}
								<div className="space-y-2">
									<label className="font-medium text-sm">Typy węzłów:</label>
									<div className="flex flex-wrap gap-2">
										{nodeTypeOptions.map((option) => {
											const Icon = option.icon;
											const isSelected = filters.nodeTypes.includes(
												option.value as any,
											);
											return (
												<Tooltip key={option.value}>
													<TooltipTrigger asChild>
														<Button
															variant={isSelected ? "default" : "outline"}
															size="sm"
															onClick={() => handleNodeTypeToggle(option.value)}
															className="flex items-center gap-1"
														>
															<Icon className="h-3 w-3" />
															{option.label}
														</Button>
													</TooltipTrigger>
													<TooltipContent>{option.label}</TooltipContent>
												</Tooltip>
											);
										})}
									</div>
								</div>

								{/* Relationship Types */}
								<div className="space-y-2">
									<label className="font-medium text-sm">Typy relacji:</label>
									<div className="flex flex-wrap gap-2">
										{relationshipTypeOptions.map((option) => {
											const isSelected = filters.relationshipTypes.includes(
												option.value as any,
											);
											return (
												<Button
													key={option.value}
													variant={isSelected ? "default" : "outline"}
													size="sm"
													onClick={() =>
														handleRelationshipTypeToggle(option.value)
													}
													className="text-xs"
												>
													<div
														className="mr-1 h-2 w-2 rounded-full"
														style={{ backgroundColor: option.color }}
													/>
													{option.label}
												</Button>
											);
										})}
									</div>
								</div>

								{/* Evidence Levels */}
								<div className="space-y-2">
									<label className="font-medium text-sm">
										Poziomy dowodów:
									</label>
									<div className="flex flex-wrap gap-2">
										{evidenceLevelOptions.map((option) => {
											const isSelected = filters.evidenceLevels.includes(
												option.value as any,
											);
											return (
												<Button
													key={option.value}
													variant={isSelected ? "default" : "outline"}
													size="sm"
													onClick={() =>
														handleEvidenceLevelToggle(option.value)
													}
													className="text-xs"
												>
													<div
														className="mr-1 h-2 w-2 rounded-full"
														style={{ backgroundColor: option.color }}
													/>
													{option.label}
												</Button>
											);
										})}
									</div>
								</div>

								{/* Strength Range */}
								<div className="space-y-2">
									<label className="font-medium text-sm">
										Siła połączeń: {filters.minStrength.toFixed(2)} -{" "}
										{filters.maxStrength.toFixed(2)}
									</label>
									<Slider
										value={[filters.minStrength, filters.maxStrength]}
										onValueChange={handleStrengthRangeChange}
										min={0}
										max={1}
										step={0.01}
										className="w-full"
									/>
								</div>

								{/* Confidence */}
								<div className="space-y-2">
									<label className="font-medium text-sm">
										Min. pewność: {filters.minConfidence.toFixed(2)}
									</label>
									<Slider
										value={[filters.minConfidence]}
										onValueChange={handleConfidenceChange}
										min={0}
										max={1}
										step={0.01}
										className="w-full"
									/>
								</div>

								{/* Reset Filters */}
								<Button
									variant="outline"
									onClick={resetFilters}
									className="w-full"
								>
									Resetuj filtry
								</Button>
							</div>
						)}

						{/* Layout Tab */}
						{activeTab === "layout" && (
							<div className="space-y-4">
								<div className="space-y-2">
									<label className="font-medium text-sm">Układ grafu:</label>
									<div className="grid grid-cols-1 gap-2">
										{layoutOptions.map((option) => (
											<Tooltip key={option.value}>
												<TooltipTrigger asChild>
													<Button
														variant={
															layout === option.value ? "default" : "outline"
														}
														onClick={() => setLayout(option.value as any)}
														className="justify-start text-left"
													>
														{option.label}
													</Button>
												</TooltipTrigger>
												<TooltipContent>{option.description}</TooltipContent>
											</Tooltip>
										))}
									</div>
								</div>

								{/* Physics */}
								<div className="flex items-center justify-between">
									<label className="font-medium text-sm">Fizyka:</label>
									<Button
										variant={enablePhysics ? "default" : "outline"}
										size="sm"
										onClick={() => setEnablePhysics(!enablePhysics)}
									>
										{enablePhysics ? "Włączona" : "Wyłączona"}
									</Button>
								</div>

								{/* Animation Speed */}
								<div className="space-y-2">
									<label className="font-medium text-sm">
										Prędkość animacji: {animationSpeed.toFixed(1)}x
									</label>
									<Slider
										value={[animationSpeed]}
										onValueChange={handleAnimationSpeedChange}
										min={0.1}
										max={5}
										step={0.1}
										className="w-full"
									/>
								</div>
							</div>
						)}

						{/* Display Tab */}
						{activeTab === "display" && (
							<div className="space-y-4">
								{/* View Mode */}
								<div className="space-y-2">
									<label className="font-medium text-sm">Tryb widoku:</label>
									<div className="flex gap-2">
										{["overview", "focused", "detailed"].map((mode) => (
											<Button
												key={mode}
												variant={viewMode === mode ? "default" : "outline"}
												size="sm"
												onClick={() => setViewMode(mode as any)}
											>
												{mode === "overview"
													? "Przegląd"
													: mode === "focused"
														? "Skupiony"
														: "Szczegółowy"}
											</Button>
										))}
									</div>
								</div>

								{/* Labels */}
								<div className="flex items-center justify-between">
									<label className="font-medium text-sm">
										Etykiety węzłów:
									</label>
									<Button
										variant={filters.showLabels ? "default" : "outline"}
										size="sm"
										onClick={() =>
											setFilters({ showLabels: !filters.showLabels })
										}
									>
										{filters.showLabels ? (
											<Eye className="h-4 w-4" />
										) : (
											<EyeOff className="h-4 w-4" />
										)}
									</Button>
								</div>

								<div className="flex items-center justify-between">
									<label className="font-medium text-sm">
										Etykiety relacji:
									</label>
									<Button
										variant={
											filters.showRelationshipLabels ? "default" : "outline"
										}
										size="sm"
										onClick={() =>
											setFilters({
												showRelationshipLabels: !filters.showRelationshipLabels,
											})
										}
									>
										{filters.showRelationshipLabels ? (
											<Eye className="h-4 w-4" />
										) : (
											<EyeOff className="h-4 w-4" />
										)}
									</Button>
								</div>

								{/* Max Nodes */}
								<div className="space-y-2">
									<label className="font-medium text-sm">
										Maks. węzłów: {maxRenderNodes}
									</label>
									<Slider
										value={[maxRenderNodes]}
										onValueChange={handleMaxNodesChange}
										min={10}
										max={2000}
										step={10}
										className="w-full"
									/>
								</div>

								{/* Selected Nodes */}
								{selectedNodes.length > 0 && (
									<div className="space-y-2">
										<div className="flex items-center justify-between">
											<label className="font-medium text-sm">
												Wybrane węzły ({selectedNodes.length}):
											</label>
											<Button
												variant="outline"
												size="sm"
												onClick={clearSelectedNodes}
											>
												Wyczyść
											</Button>
										</div>
										<div className="flex max-h-20 flex-wrap gap-1 overflow-y-auto">
											{selectedNodes.slice(0, 10).map((nodeId) => (
												<Badge
													key={nodeId}
													variant="secondary"
													className="text-xs"
												>
													{nodeId.substring(0, 8)}...
												</Badge>
											))}
											{selectedNodes.length > 10 && (
												<Badge variant="secondary" className="text-xs">
													+{selectedNodes.length - 10} więcej
												</Badge>
											)}
										</div>
									</div>
								)}
							</div>
						)}
					</CardContent>
				)}
			</Card>
		</TooltipProvider>
	);
};

export default GraphControls;

// Export the options for use in other components
export {
	nodeTypeOptions,
	relationshipTypeOptions,
	evidenceLevelOptions,
	layoutOptions,
};
