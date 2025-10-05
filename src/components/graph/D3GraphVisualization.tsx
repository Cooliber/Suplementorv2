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
import * as d3 from "d3";
import {
	Info,
	Maximize2,
	Pause,
	Play,
	RotateCcw,
	Settings,
	ZoomIn,
	ZoomOut,
} from "lucide-react";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";

interface D3Node extends d3.SimulationNodeDatum {
	id: string;
	name: string;
	polishName: string;
	type: string;
	color: string;
	size: number;
	description: string;
	polishDescription: string;
	evidenceLevel?: string;
	category?: string;
	supplement?: SupplementWithRelations;
}

interface D3Link extends d3.SimulationLinkDatum<D3Node> {
	id: string;
	type: string;
	strength: number;
	confidence: number;
	label: string;
	polishLabel: string;
	mechanism: string;
	polishMechanism: string;
	evidenceLevel: string;
}

interface D3GraphVisualizationProps {
	nodes: KnowledgeNode[];
	relationships: KnowledgeRelationship[];
	supplements?: SupplementWithRelations[];
	width?: number;
	height?: number;
	className?: string;
}

// Node type to color mapping with Polish supplement categories
const nodeTypeColors: Record<string, string> = {
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

// Relationship type to color mapping
const relationshipTypeColors: Record<string, string> = {
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

// Evidence level to opacity mapping
const evidenceOpacity: Record<string, number> = {
	STRONG: 1.0,
	MODERATE: 0.8,
	WEAK: 0.6,
	INSUFFICIENT: 0.4,
	CONFLICTING: 0.3,
};

const D3GraphVisualization: React.FC<D3GraphVisualizationProps> = ({
	nodes,
	relationships,
	supplements = [],
	width = 800,
	height = 600,
	className = "",
}) => {
	const svgRef = useRef<SVGSVGElement>(null);
	const simulationRef = useRef<d3.Simulation<D3Node, D3Link> | null>(null);
	const [selectedNode, setSelectedNode] = useState<D3Node | null>(null);
	const [hoveredNode, setHoveredNode] = useState<D3Node | null>(null);

	const {
		selectedNodes,
		addSelectedNode,
		removeSelectedNode,
		filters,
		layout,
		zoomLevel,
		setZoomLevel,
		isPlaying,
		setIsPlaying,
		highlightNode,
		setHighlightNode,
		enablePhysics,
		maxRenderNodes,
	} = useKnowledgeGraphStore();

	// Transform data for D3
	const transformData = useCallback(() => {
		// Filter nodes based on current filters
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

		// Transform nodes
		const d3Nodes: D3Node[] = filteredNodes.map((node) => {
			const supplement = supplements.find((s) => s.id === node.id);
			return {
				id: node.id,
				name: node.name,
				polishName: node.polishName,
				type: node.type,
				color: nodeTypeColors[node.type] || nodeTypeColors.DEFAULT || "#6B7280",
				size: node.size || 8,
				description: node.description,
				polishDescription: node.polishDescription || node.description,
				evidenceLevel: node.evidenceLevel,
				category: node.category,
				supplement,
				x: node.x,
				y: node.y,
			};
		});

		// Filter relationships to only include those between filtered nodes
		const nodeIds = new Set(d3Nodes.map((n) => n.id));
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

		if (filters.maxStrength < 1) {
			filteredRelationships = filteredRelationships.filter(
				(rel) => rel.strength <= filters.maxStrength,
			);
		}

		// Transform relationships
		const d3Links: D3Link[] = filteredRelationships.map((rel) => ({
			id: rel.id,
			source: rel.sourceId,
			target: rel.targetId,
			type: rel.type,
			strength: rel.strength,
			confidence: rel.confidence,
			label: rel.mechanism,
			polishLabel: rel.polishMechanism || rel.mechanism,
			mechanism: rel.mechanism,
			polishMechanism: rel.polishMechanism || rel.mechanism,
			evidenceLevel: rel.evidenceLevel,
		}));

		return { nodes: d3Nodes, links: d3Links };
	}, [nodes, relationships, supplements, filters, maxRenderNodes]);

	// Initialize D3 simulation
	useEffect(() => {
		if (!svgRef.current) return;

		const svg = d3.select(svgRef.current);
		const { nodes: d3Nodes, links: d3Links } = transformData();

		// Clear previous content
		svg.selectAll("*").remove();

		// Create main group for zoom/pan
		const g = svg.append("g").attr("class", "main-group");

		// Setup zoom behavior
		const zoom = d3
			.zoom<SVGSVGElement, unknown>()
			.scaleExtent([0.1, 10])
			.on("zoom", (event) => {
				g.attr("transform", event.transform);
				setZoomLevel(event.transform.k);
			});

		svg.call(zoom);

		// Create simulation based on layout
		let simulation: d3.Simulation<D3Node, D3Link>;

		switch (layout) {
			case "force":
				simulation = d3
					.forceSimulation(d3Nodes)
					.force(
						"link",
						d3
							.forceLink(d3Links)
							.id((d: any) => d.id)
							.strength(0.1),
					)
					.force("charge", d3.forceManyBody().strength(-300))
					.force("center", d3.forceCenter(width / 2, height / 2))
					.force(
						"collision",
						d3.forceCollide().radius((d: any) => d.size + 2),
					);
				break;
			case "radial":
				simulation = d3
					.forceSimulation(d3Nodes)
					.force(
						"link",
						d3
							.forceLink(d3Links)
							.id((d: any) => d.id)
							.strength(0.1),
					)
					.force("charge", d3.forceManyBody().strength(-100))
					.force(
						"radial",
						d3.forceRadial(200, width / 2, height / 2).strength(0.8),
					);
				break;
			default:
				simulation = d3
					.forceSimulation(d3Nodes)
					.force(
						"link",
						d3.forceLink(d3Links).id((d: any) => d.id),
					)
					.force("charge", d3.forceManyBody())
					.force("center", d3.forceCenter(width / 2, height / 2));
		}

		simulationRef.current = simulation;

		// Create links
		const link = g
			.append("g")
			.attr("class", "links")
			.selectAll("line")
			.data(d3Links)
			.enter()
			.append("line")
			.attr(
				"stroke",
				(d: D3Link) =>
					relationshipTypeColors[d.type] ||
					relationshipTypeColors.DEFAULT ||
					"#6B7280",
			)
			.attr("stroke-width", (d: D3Link) => Math.max(1, d.strength * 4))
			.attr(
				"stroke-opacity",
				(d: D3Link) => evidenceOpacity[d.evidenceLevel] || 0.6,
			)
			.attr("marker-end", "url(#arrowhead)");

		// Create arrow markers
		svg
			.append("defs")
			.selectAll("marker")
			.data(["arrowhead"])
			.enter()
			.append("marker")
			.attr("id", "arrowhead")
			.attr("viewBox", "0 -5 10 10")
			.attr("refX", 15)
			.attr("refY", 0)
			.attr("markerWidth", 6)
			.attr("markerHeight", 6)
			.attr("orient", "auto")
			.append("path")
			.attr("d", "M0,-5L10,0L0,5")
			.attr("fill", "#999");

		// Create nodes
		const node = g
			.append("g")
			.attr("class", "nodes")
			.selectAll("circle")
			.data(d3Nodes)
			.enter()
			.append("circle")
			.attr("r", (d: D3Node) => d.size)
			.attr("fill", (d: D3Node) => d.color)
			.attr("stroke", "#fff")
			.attr("stroke-width", 2)
			.attr(
				"opacity",
				(d: D3Node) => evidenceOpacity[d.evidenceLevel || "MODERATE"] || 0.8,
			)
			.style("cursor", "pointer");

		// Add node labels
		const labels = g
			.append("g")
			.attr("class", "labels")
			.selectAll("text")
			.data(d3Nodes)
			.enter()
			.append("text")
			.text((d: D3Node) => (filters.showLabels ? d.polishName : ""))
			.attr("font-size", 10)
			.attr("font-family", "Arial, sans-serif")
			.attr("fill", "#333")
			.attr("text-anchor", "middle")
			.attr("dy", (d: D3Node) => d.size + 15)
			.style("pointer-events", "none");

		// Add drag behavior
		const drag = d3
			.drag<SVGCircleElement, D3Node>()
			.on("start", (event, d) => {
				if (!event.active && enablePhysics)
					simulation.alphaTarget(0.3).restart();
				d.fx = d.x;
				d.fy = d.y;
			})
			.on("drag", (event, d) => {
				d.fx = event.x;
				d.fy = event.y;
			})
			.on("end", (event, d) => {
				if (!event.active && enablePhysics) simulation.alphaTarget(0);
				d.fx = null;
				d.fy = null;
			});

		node.call(drag);

		// Add interaction handlers
		node
			.on("click", (event, d) => {
				setSelectedNode(d);
				if (selectedNodes.includes(d.id)) {
					removeSelectedNode(d.id);
				} else {
					addSelectedNode(d.id);
				}
			})
			.on("mouseover", (event, d) => {
				setHoveredNode(d);
				setHighlightNode(d.id);
			})
			.on("mouseout", () => {
				setHoveredNode(null);
				setHighlightNode(null);
			});

		// Update simulation
		simulation.on("tick", () => {
			link
				.attr("x1", (d: any) => d.source.x)
				.attr("y1", (d: any) => d.source.y)
				.attr("x2", (d: any) => d.target.x)
				.attr("y2", (d: any) => d.target.y);

			node.attr("cx", (d: D3Node) => d.x!).attr("cy", (d: D3Node) => d.y!);

			labels.attr("x", (d: D3Node) => d.x!).attr("y", (d: D3Node) => d.y!);
		});

		// Control simulation based on isPlaying state
		if (!isPlaying && enablePhysics) {
			simulation.stop();
		} else if (isPlaying && enablePhysics) {
			simulation.restart();
		}

		return () => {
			simulation.stop();
		};
	}, [
		transformData,
		layout,
		isPlaying,
		enablePhysics,
		width,
		height,
		filters.showLabels,
	]);

	// Handle zoom controls
	const handleZoomIn = () => {
		if (svgRef.current) {
			const svg = d3.select(svgRef.current);
			svg
				.transition()
				.call(d3.zoom<SVGSVGElement, unknown>().scaleBy as any, 1.5);
		}
	};

	const handleZoomOut = () => {
		if (svgRef.current) {
			const svg = d3.select(svgRef.current);
			svg
				.transition()
				.call(d3.zoom<SVGSVGElement, unknown>().scaleBy as any, 1 / 1.5);
		}
	};

	const handleResetZoom = () => {
		if (svgRef.current) {
			const svg = d3.select(svgRef.current);
			svg
				.transition()
				.call(
					d3.zoom<SVGSVGElement, unknown>().transform as any,
					d3.zoomIdentity,
				);
		}
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
							<TooltipContent>Resetuj widok</TooltipContent>
						</Tooltip>

						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant="outline"
									size="sm"
									onClick={() => setIsPlaying(!isPlaying)}
								>
									{isPlaying ? (
										<Pause className="h-4 w-4" />
									) : (
										<Play className="h-4 w-4" />
									)}
								</Button>
							</TooltipTrigger>
							<TooltipContent>
								{isPlaying ? "Zatrzymaj animację" : "Uruchom animację"}
							</TooltipContent>
						</Tooltip>
					</div>

					<div className="flex items-center gap-2">
						<Badge variant="secondary">
							Węzły: {transformData().nodes.length}
						</Badge>
						<Badge variant="secondary">
							Połączenia: {transformData().links.length}
						</Badge>
						<Badge variant="secondary">
							Zoom: {Math.round(zoomLevel * 100)}%
						</Badge>
					</div>
				</div>

				{/* Graph Container */}
				<div className="relative overflow-hidden rounded-lg border bg-gray-50">
					<svg
						ref={svgRef}
						width={width}
						height={height}
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
									style={{ backgroundColor: selectedNode.color }}
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
									<p className="text-sm">{selectedNode.polishDescription}</p>
								</div>
								{selectedNode.supplement && (
									<div>
										<span className="font-medium">Kategoria: </span>
										<Badge variant="supplement">
											{selectedNode.supplement.category}
										</Badge>
									</div>
								)}
							</div>
						</CardContent>
					</Card>
				)}
			</div>
		</TooltipProvider>
	);
};

export default D3GraphVisualization;
