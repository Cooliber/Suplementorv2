"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useKnowledgeGraphStore } from "@/lib/stores/knowledge-graph-store";
import type {
	KnowledgeNode,
	KnowledgeRelationship,
} from "@/types/knowledge-graph";
import type { SupplementWithRelations } from "@/types/supplement";
import cytoscape from "cytoscape";
import type { Core, EdgeSingular, NodeSingular } from "cytoscape";
import {
	Circle,
	GitBranch,
	Grid3X3,
	Layers,
	Pause,
	Play,
	RotateCcw,
	ZoomIn,
	ZoomOut,
} from "lucide-react";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";

interface CytoscapeVisualizationProps {
	nodes: KnowledgeNode[];
	relationships: KnowledgeRelationship[];
	supplements?: SupplementWithRelations[];
	width?: number;
	height?: number;
	className?: string;
}

// Cytoscape layout options
const layoutOptions = {
	force: {
		name: "cose",
		animate: true,
		animationDuration: 1000,
		nodeRepulsion: 400000,
		nodeOverlap: 10,
		idealEdgeLength: 100,
		edgeElasticity: 100,
		nestingFactor: 5,
		gravity: 80,
		numIter: 1000,
		initialTemp: 200,
		coolingFactor: 0.95,
		minTemp: 1.0,
	},
	hierarchical: {
		name: "dagre",
		animate: true,
		animationDuration: 1000,
		rankDir: "TB",
		nodeSep: 50,
		edgeSep: 10,
		rankSep: 50,
	},
	circular: {
		name: "circle",
		animate: true,
		animationDuration: 1000,
		radius: 200,
		spacing: 40,
	},
	grid: {
		name: "grid",
		animate: true,
		animationDuration: 1000,
		rows: undefined,
		cols: undefined,
		position: (node: any) => ({ row: node.data("row"), col: node.data("col") }),
	},
	radial: {
		name: "concentric",
		animate: true,
		animationDuration: 1000,
		concentric: (node: any) => node.data("importance") || 1,
		levelWidth: () => 1,
		spacing: 100,
		clockwise: true,
	},
};

// Node styling based on type and evidence
const getNodeStyle = (node: KnowledgeNode) => {
	const baseColors: Record<string, string> = {
		SUPPLEMENT: "#3B82F6",
		NEUROTRANSMITTER: "#10B981",
		BRAIN_REGION: "#8B5CF6",
		COGNITIVE_FUNCTION: "#F59E0B",
		PATHWAY: "#EF4444",
		MECHANISM: "#EC4899",
		VITAMIN: "#06B6D4",
		MINERAL: "#84CC16",
		AMINO_ACID: "#F97316",
		FATTY_ACID: "#14B8A6",
		HERB: "#22C55E",
		NOOTROPIC: "#6366F1",
		ADAPTOGEN: "#A855F7",
		DEFAULT: "#6B7280",
	};

	const evidenceOpacity: Record<string, number> = {
		STRONG: 1.0,
		MODERATE: 0.8,
		WEAK: 0.6,
		INSUFFICIENT: 0.4,
		CONFLICTING: 0.3,
	};

	return {
		"background-color": baseColors[node.type] || baseColors.DEFAULT,
		"background-opacity": evidenceOpacity[node.evidenceLevel] || 0.8,
		"border-color": "#ffffff",
		"border-width": 2,
		"border-opacity": 1,
		width: (node.size || 8) * 4,
		height: (node.size || 8) * 4,
		label: node.polishName,
		"font-size": "12px",
		"font-family": "Arial, sans-serif",
		"text-valign": "center",
		"text-halign": "center",
		color: "#333333",
		"text-outline-width": 2,
		"text-outline-color": "#ffffff",
		"text-outline-opacity": 0.8,
		"overlay-padding": "6px",
		"z-index": 10,
	};
};

// Edge styling based on relationship type
const getEdgeStyle = (relationship: KnowledgeRelationship) => {
	const relationshipColors: Record<string, string> = {
		ENHANCES: "#10B981",
		INHIBITS: "#EF4444",
		MODULATES: "#8B5CF6",
		SYNERGIZES: "#F59E0B",
		ANTAGONIZES: "#F97316",
		REQUIRES: "#3B82F6",
		PRODUCES: "#EC4899",
		METABOLIZES: "#06B6D4",
		DEFAULT: "#6B7280",
	};

	const evidenceOpacity: Record<string, number> = {
		STRONG: 1.0,
		MODERATE: 0.8,
		WEAK: 0.6,
		INSUFFICIENT: 0.4,
		CONFLICTING: 0.3,
	};

	return {
		"line-color":
			relationshipColors[relationship.type] || relationshipColors.DEFAULT,
		"line-opacity": evidenceOpacity[relationship.evidenceLevel] || 0.6,
		width: Math.max(1, relationship.strength * 6),
		"target-arrow-color":
			relationshipColors[relationship.type] || relationshipColors.DEFAULT,
		"target-arrow-shape": "triangle",
		"target-arrow-size": 8,
		"curve-style": "bezier",
		label: relationship.polishMechanism || relationship.mechanism,
		"font-size": "10px",
		"font-family": "Arial, sans-serif",
		"text-rotation": "autorotate",
		"text-margin-y": -10,
		color: "#555555",
		"text-outline-width": 1,
		"text-outline-color": "#ffffff",
		"text-outline-opacity": 0.8,
	};
};

const CytoscapeVisualization: React.FC<CytoscapeVisualizationProps> = ({
	nodes,
	relationships,
	supplements = [],
	width = 800,
	height = 600,
	className = "",
}) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const cyRef = useRef<Core | null>(null);
	const [selectedNode, setSelectedNode] = useState<KnowledgeNode | null>(null);

	const {
		selectedNodes,
		addSelectedNode,
		removeSelectedNode,
		filters,
		layout,
		setLayout,
		zoomLevel,
		setZoomLevel,
		isPlaying,
		setIsPlaying,
		highlightNode,
		setHighlightNode,
		maxRenderNodes,
	} = useKnowledgeGraphStore();

	// Transform data for Cytoscape
	const transformData = useCallback(() => {
		// Filter nodes
		let filteredNodes = nodes;

		if (filters.nodeTypes.length > 0) {
			filteredNodes = filteredNodes.filter((node) =>
				filters.nodeTypes.includes(node.type as any),
			);
		}

		if (filters.searchTerm) {
			const searchTerm = filters.searchTerm.toLowerCase();
			filteredNodes = filteredNodes.filter(
				(node) =>
					node.name.toLowerCase().includes(searchTerm) ||
					node.polishName.toLowerCase().includes(searchTerm) ||
					node.description.toLowerCase().includes(searchTerm),
			);
		}

		if (filters.evidenceLevels.length > 0) {
			filteredNodes = filteredNodes.filter((node) =>
				filters.evidenceLevels.includes(node.evidenceLevel as any),
			);
		}

		// Limit nodes for performance
		if (filteredNodes.length > maxRenderNodes) {
			filteredNodes = filteredNodes.slice(0, maxRenderNodes);
		}

		// Filter relationships
		const nodeIds = new Set(filteredNodes.map((n) => n.id));
		let filteredRelationships = relationships.filter(
			(rel) => nodeIds.has(rel.sourceId) && nodeIds.has(rel.targetId),
		);

		if (filters.relationshipTypes.length > 0) {
			filteredRelationships = filteredRelationships.filter((rel) =>
				filters.relationshipTypes.includes(rel.type as any),
			);
		}

		if (filters.minStrength > 0) {
			filteredRelationships = filteredRelationships.filter(
				(rel) => rel.strength >= filters.minStrength,
			);
		}

		// Transform to Cytoscape format
		const elements = [
			...filteredNodes.map((node) => ({
				data: {
					id: node.id,
					label: node.polishName,
					type: node.type,
					evidenceLevel: node.evidenceLevel,
					description: node.polishDescription || node.description,
					importance: node.importance || 1,
					supplement: supplements.find((s) => s.id === node.id),
				},
				style: getNodeStyle(node),
			})),
			...filteredRelationships.map((rel) => ({
				data: {
					id: rel.id,
					source: rel.sourceId,
					target: rel.targetId,
					type: rel.type,
					strength: rel.strength,
					confidence: rel.confidence,
					mechanism: rel.polishMechanism || rel.mechanism,
					evidenceLevel: rel.evidenceLevel,
				},
				style: getEdgeStyle(rel),
			})),
		];

		return elements;
	}, [nodes, relationships, supplements, filters, maxRenderNodes]);

	// Initialize Cytoscape
	useEffect(() => {
		if (!containerRef.current) return;

		const elements = transformData();

		const cy = cytoscape({
			container: containerRef.current,
			elements,
			style: [
				{
					selector: "node",
					style: {
						shape: "ellipse",
						"text-wrap": "wrap",
						"text-max-width": "80px",
					},
				},
				{
					selector: "edge",
					style: {
						"curve-style": "bezier",
						"control-point-step-size": 40,
					},
				},
				{
					selector: "node:selected",
					style: {
						"border-width": 4,
						"border-color": "#FFD700",
						"border-opacity": 1,
					},
				},
				{
					selector: "edge:selected",
					style: {
						"line-color": "#FFD700",
						"target-arrow-color": "#FFD700",
						width: 4,
					},
				},
				{
					selector: "node.highlighted",
					style: {
						"border-width": 3,
						"border-color": "#FF6B6B",
						"border-opacity": 1,
					},
				},
			],
			layout:
				layoutOptions[layout as keyof typeof layoutOptions] ||
				layoutOptions.force,
			wheelSensitivity: 0.2,
			minZoom: 0.1,
			maxZoom: 10,
		});

		cyRef.current = cy;

		// Event handlers
		cy.on("tap", "node", (event) => {
			const node = event.target;
			const nodeData = node.data();

			// Find the original node data
			const originalNode = nodes.find((n) => n.id === nodeData.id);
			if (originalNode) {
				setSelectedNode(originalNode);

				if (selectedNodes.includes(nodeData.id)) {
					removeSelectedNode(nodeData.id);
				} else {
					addSelectedNode(nodeData.id);
				}
			}
		});

		cy.on("mouseover", "node", (event) => {
			const node = event.target;
			const nodeData = node.data();
			setHighlightNode(nodeData.id);
			node.addClass("highlighted");
		});

		cy.on("mouseout", "node", (event) => {
			const node = event.target;
			setHighlightNode(null);
			node.removeClass("highlighted");
		});

		cy.on("zoom", () => {
			setZoomLevel(cy.zoom());
		});

		// Fit to container
		cy.fit();

		return () => {
			if (cyRef.current) {
				cyRef.current.destroy();
			}
		};
	}, [transformData, layout]);

	// Update layout when layout changes
	useEffect(() => {
		if (cyRef.current) {
			const layoutConfig =
				layoutOptions[layout as keyof typeof layoutOptions] ||
				layoutOptions.force;
			cyRef.current.layout(layoutConfig).run();
		}
	}, [layout]);

	// Handle zoom controls
	const handleZoomIn = () => {
		if (cyRef.current) {
			cyRef.current.zoom(cyRef.current.zoom() * 1.5);
			cyRef.current.center();
		}
	};

	const handleZoomOut = () => {
		if (cyRef.current) {
			cyRef.current.zoom(cyRef.current.zoom() / 1.5);
			cyRef.current.center();
		}
	};

	const handleResetZoom = () => {
		if (cyRef.current) {
			cyRef.current.fit();
		}
	};

	const handleLayoutChange = (newLayout: string) => {
		setLayout(newLayout as any);
	};

	return (
		<TooltipProvider>
			<div className={`flex flex-col ${className}`}>
				{/* Controls */}
				<div className="mb-4 flex flex-wrap items-center justify-between gap-2">
					<div className="flex items-center gap-2">
						<Tooltip>
							<TooltipTrigger asChild>
								<Button variant="outline" size="sm" onClick={handleZoomIn}>
									<ZoomIn className="h-4 w-4" />
								</Button>
							</TooltipTrigger>
							<TooltipContent>Przybliż</TooltipContent>
						</Tooltip>

						<Tooltip>
							<TooltipTrigger asChild>
								<Button variant="outline" size="sm" onClick={handleZoomOut}>
									<ZoomOut className="h-4 w-4" />
								</Button>
							</TooltipTrigger>
							<TooltipContent>Oddal</TooltipContent>
						</Tooltip>

						<Tooltip>
							<TooltipTrigger asChild>
								<Button variant="outline" size="sm" onClick={handleResetZoom}>
									<RotateCcw className="h-4 w-4" />
								</Button>
							</TooltipTrigger>
							<TooltipContent>Dopasuj do okna</TooltipContent>
						</Tooltip>
					</div>

					{/* Layout Controls */}
					<div className="flex items-center gap-2">
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant={layout === "force" ? "default" : "outline"}
									size="sm"
									onClick={() => handleLayoutChange("force")}
								>
									<Circle className="h-4 w-4" />
								</Button>
							</TooltipTrigger>
							<TooltipContent>Układ siłowy</TooltipContent>
						</Tooltip>

						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant={layout === "hierarchical" ? "default" : "outline"}
									size="sm"
									onClick={() => handleLayoutChange("hierarchical")}
								>
									<Layers className="h-4 w-4" />
								</Button>
							</TooltipTrigger>
							<TooltipContent>Układ hierarchiczny</TooltipContent>
						</Tooltip>

						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant={layout === "circular" ? "default" : "outline"}
									size="sm"
									onClick={() => handleLayoutChange("circular")}
								>
									<Circle className="h-4 w-4" />
								</Button>
							</TooltipTrigger>
							<TooltipContent>Układ kołowy</TooltipContent>
						</Tooltip>

						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant={layout === "grid" ? "default" : "outline"}
									size="sm"
									onClick={() => handleLayoutChange("grid")}
								>
									<Grid3X3 className="h-4 w-4" />
								</Button>
							</TooltipTrigger>
							<TooltipContent>Układ siatkowy</TooltipContent>
						</Tooltip>
					</div>

					<div className="flex items-center gap-2">
						<Badge variant="secondary">
							Węzły:{" "}
							{transformData().filter((el) => !("source" in el.data)).length}
						</Badge>
						<Badge variant="secondary">
							Połączenia:{" "}
							{transformData().filter((el) => "source" in el.data).length}
						</Badge>
						<Badge variant="secondary">
							Zoom: {Math.round(zoomLevel * 100)}%
						</Badge>
					</div>
				</div>

				{/* Graph Container */}
				<div className="relative overflow-hidden rounded-lg border bg-gray-50">
					<div
						ref={containerRef}
						style={{ width, height }}
						className="h-full w-full"
					/>
				</div>

				{/* Node Details Panel */}
				{selectedNode && (
					<Card className="mt-4">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<div
									className="h-4 w-4 rounded-full"
									style={{
										backgroundColor:
											getNodeStyle(selectedNode)["background-color"],
									}}
								/>
								{selectedNode.polishName}
								<Badge
									variant={selectedNode.evidenceLevel?.toLowerCase() as any}
								>
									{selectedNode.evidenceLevel}
								</Badge>
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-2">
								<div>
									<span className="font-medium">Typ: </span>
									<Badge variant="secondary">{selectedNode.type}</Badge>
								</div>
								<div>
									<span className="font-medium">Opis: </span>
									<p className="text-sm">
										{selectedNode.polishDescription || selectedNode.description}
									</p>
								</div>
								<div>
									<span className="font-medium">Kategoria: </span>
									<Badge variant="secondary">{selectedNode.category}</Badge>
								</div>
							</div>
						</CardContent>
					</Card>
				)}
			</div>
		</TooltipProvider>
	);
};

export default CytoscapeVisualization;
