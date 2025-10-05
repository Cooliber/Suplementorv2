"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useKnowledgeGraphStore } from "@/lib/stores/knowledge-graph-store";
import type {
	KnowledgeNode,
	KnowledgeRelationship,
} from "@/types/knowledge-graph";
import * as d3 from "d3";
import {
	Activity,
	Brain,
	BrainCircuit,
	FlaskConical,
	Info,
	Pill,
	RotateCcw,
	Search,
	ZoomIn,
	ZoomOut,
} from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { ForceGraph2D, ForceGraph3D } from "react-force-graph";

// Define types for our graph data
interface GraphNode {
	id: string;
	name: string;
	polishName: string;
	type: string;
	color: string;
	size: number;
	description: string;
	polishDescription: string;
	x?: number;
	y?: number;
	fx?: number;
	fy?: number;
}

interface GraphLink {
	id: string;
	source: string;
	target: string;
	type: string;
	strength: number;
	label: string;
	polishLabel: string;
}

interface GraphData {
	nodes: GraphNode[];
	links: GraphLink[];
}

interface KnowledgeGraphProps {
	nodes: KnowledgeNode[];
	relationships: KnowledgeRelationship[];
	width?: number;
	height?: number;
	className?: string;
}

// Node type to color mapping
const nodeTypeColors: Record<string, string> = {
	SUPPLEMENT: "#3B82F6", // blue-500
	NEUROTRANSMITTER: "#10B981", // emerald-500
	BRAIN_REGION: "#8B5CF6", // violet-500
	COGNITIVE_FUNCTION: "#F59E0B", // amber-500
	PATHWAY: "#EF4444", // red-500
	MECHANISM: "#EC4899", // pink-500
	DEFAULT: "#6B7280", // gray-500
};

// Node type to icon mapping
const nodeTypeIcons: Record<string, React.ReactNode> = {
	SUPPLEMENT: <Pill className="h-4 w-4" />,
	NEUROTRANSMITTER: <Activity className="h-4 w-4" />,
	BRAIN_REGION: <Brain className="h-4 w-4" />,
	COGNITIVE_FUNCTION: <BrainCircuit className="h-4 w-4" />,
	PATHWAY: <FlaskConical className="h-4 w-4" />,
	MECHANISM: <FlaskConical className="h-4 w-4" />,
};

// Relationship type to color mapping
const relationshipTypeColors: Record<string, string> = {
	ENHANCES: "#10B981", // emerald-500
	INHIBITS: "#EF4444", // red-500
	MODULATES: "#8B5CF6", // violet-500
	SYNERGIZES: "#F59E0B", // amber-500
	ANTAGONIZES: "#F97316", // orange-500
	REQUIRES: "#3B82F6", // blue-500
	PRODUCES: "#EC4899", // pink-500
	METABOLIZES: "#06B6D4", // cyan-500
	DEFAULT: "#6B7280", // gray-500
};

const KnowledgeGraph: React.FC<KnowledgeGraphProps> = ({
	nodes,
	relationships,
	width = 800,
	height = 600,
	className = "",
}) => {
	const fgRef = useRef<any>(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
	const [graphData, setGraphData] = useState<GraphData>({
		nodes: [],
		links: [],
	});
	const [isInteractive, setIsInteractive] = useState(true);
	const [isZoomed, setIsZoomed] = useState(false);

	const {
		selectedNodes,
		setSelectedNodes,
		filters,
		setFilters,
		zoomLevel,
		setZoomLevel,
	} = useKnowledgeGraphStore();

	// Transform knowledge graph data to graph visualization format
	useEffect(() => {
		if (!nodes || !relationships) return;

		// Filter nodes based on search term
		const filteredNodes = searchTerm
			? nodes.filter(
					(node) =>
						node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
						node.polishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
						node.description.toLowerCase().includes(searchTerm.toLowerCase()),
				)
			: nodes;

		// Only include relationships between filtered nodes
		const filteredRelationships = relationships.filter(
			(rel) =>
				filteredNodes.some((n) => n.id === rel.sourceId) &&
				filteredNodes.some((n) => n.id === rel.targetId),
		);

		const graphNodes: GraphNode[] = filteredNodes.map((node) => ({
			id: node.id,
			name: node.name,
			polishName: node.polishName,
			type: node.type,
			color: nodeTypeColors[node.type] || nodeTypeColors.DEFAULT || "#6B7280",
			size: node.size || 8,
			description: node.description,
			polishDescription: node.polishDescription || node.description,
			x: node.x,
			y: node.y,
			fx: node.fx ?? undefined,
			fy: node.fy ?? undefined,
		}));

		const graphLinks: GraphLink[] = filteredRelationships.map((rel) => ({
			id: rel.id,
			source: rel.sourceId,
			target: rel.targetId,
			type: rel.type,
			strength: rel.strength,
			label: rel.mechanism,
			polishLabel: rel.polishMechanism || rel.mechanism,
		}));

		setGraphData({
			nodes: graphNodes,
			links: graphLinks,
		});
	}, [nodes, relationships, searchTerm]);

	// Handle node click
	const handleNodeClick = (node: GraphNode) => {
		if (!isInteractive) return;

		setSelectedNode(node);
		const newSelectedNodes = selectedNodes.includes(node.id)
			? selectedNodes.filter((id: string) => id !== node.id)
			: [...selectedNodes, node.id];
		setSelectedNodes(newSelectedNodes);
	};

	// Handle zoom in
	const handleZoomIn = () => {
		if (fgRef.current) {
			const currentZoom = fgRef.current.zoom();
			fgRef.current.zoom(currentZoom * 1.2);
			setZoomLevel(currentZoom * 1.2);
			setIsZoomed(true);
		}
	};

	// Handle zoom out
	const handleZoomOut = () => {
		if (fgRef.current) {
			const currentZoom = fgRef.current.zoom();
			fgRef.current.zoom(currentZoom * 0.8);
			setZoomLevel(currentZoom * 0.8);
			setIsZoomed(true);
		}
	};

	// Handle reset zoom
	const handleResetView = () => {
		if (fgRef.current) {
			fgRef.current.zoom(1);
			setZoomLevel(1);
			setIsZoomed(false);
		}
	};

	// Keyboard navigation for accessibility
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "+" || e.key === "=") {
				handleZoomIn();
			} else if (e.key === "-" || e.key === "_") {
				handleZoomOut();
			} else if (e.key === "0") {
				handleResetView();
			} else if (e.key === "Escape") {
				setSelectedNode(null);
				setSearchTerm("");
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, []);

	// Node render function with accessibility
	const renderNode = (node: GraphNode) => {
		const isSelected = selectedNodes.includes(node.id);
		const ref = useRef<SVGGElement>(null);

		return (
			<g
				ref={ref}
				tabIndex={0}
				role="button"
				aria-label={`${node.name} - ${node.type}`}
			>
				<circle
					r={node.size}
					fill={node.color}
					stroke={isSelected ? "#FFFFFF" : "none"}
					strokeWidth={isSelected ? 3 : 0}
					aria-describedby={`node-${node.id}-desc`}
				/>
				<text
					textAnchor="middle"
					dy=".3em"
					fontSize={10}
					fill="#FFFFFF"
					fontWeight="bold"
					pointerEvents="none"
				>
					{node.name.substring(0, 8)}
					{node.name.length > 8 ? "..." : ""}
				</text>
			</g>
		);
	};

	// Link render function with accessibility
	const renderLink = (
		link: GraphLink,
		start: { x: number; y: number },
		end: { x: number; y: number },
	) => {
		const linkColor =
			relationshipTypeColors[link.type] || relationshipTypeColors.DEFAULT;
		const linkStrength = link.strength;

		return (
			<g
				tabIndex={0}
				role="button"
				aria-label={`${link.type} relationship from ${link.source} to ${link.target}`}
			>
				<line
					x1={start.x}
					y1={start.y}
					x2={end.x}
					y2={end.y}
					stroke={linkColor}
					strokeWidth={Math.max(1, link.strength * 3)}
					aria-describedby={`link-${link.id}-desc`}
				/>
				<text
					x={(start.x + end.x) / 2}
					y={(start.y + end.y) / 2}
					textAnchor="middle"
					fontSize={10}
					fill={linkColor}
					fontWeight="bold"
					pointerEvents="none"
				>
					{link.label.substring(0, 10)}
					{link.label.length > 10 ? "..." : ""}
				</text>
			</g>
		);
	};

	// Get node label for tooltips
	const getNodeLabel = (node: GraphNode) => {
		return `${node.name}\n${node.polishName}\n${node.type}`;
	};

	return (
		<div className={`flex flex-col ${className}`}>
			<div className="mb-4 flex flex-wrap items-center gap-2">
				<div className="flex items-center gap-2">
					<Search className="h-4 w-4 text-gray-500" aria-hidden="true" />
					<Input
						placeholder="Szukaj węzłów..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="w-64"
						aria-label="Szukaj węzłów w grafie wiedzy"
					/>
				</div>

				<Button
					variant="outline"
					size="sm"
					onClick={handleZoomIn}
					aria-label="Przybliż graf"
				>
					<ZoomIn className="mr-1 h-4 w-4" aria-hidden="true" /> Przybliż
				</Button>

				<Button
					variant="outline"
					size="sm"
					onClick={handleZoomOut}
					aria-label="Oddal graf"
				>
					<ZoomOut className="mr-1 h-4 w-4" aria-hidden="true" /> Oddal
				</Button>

				<Button
					variant="outline"
					size="sm"
					onClick={handleResetView}
					aria-label="Zresetuj widok"
				>
					<RotateCcw className="mr-1 h-4 w-4" aria-hidden="true" /> Reset
				</Button>

				<Button
					variant="outline"
					size="sm"
					onClick={() => setIsInteractive(!isInteractive)}
					aria-label={isInteractive ? "Tryb informacyjny" : "Tryb interaktywny"}
				>
					<Info className="mr-1 h-4 w-4" aria-hidden="true" />
					{isInteractive ? "Tryb informacyjny" : "Tryb interaktywny"}
				</Button>
			</div>

			<div
				className="relative min-h-[500px] w-full overflow-hidden rounded-lg border bg-gray-50"
				role="region"
				aria-label="Wizualizacja grafu wiedzy"
			>
				<ForceGraph2D
					ref={fgRef}
					graphData={graphData}
					nodeId="id"
					nodeLabel={getNodeLabel}
					nodeVal={(node: GraphNode) => node.size}
					nodeColor={(node: GraphNode) => {
						if (selectedNodes.includes(node.id)) {
							return "#FFFFFF";
						}
						return node.color;
					}}
					nodeRelSize={6}
					linkColor={(link: GraphLink) =>
						relationshipTypeColors[link.type] ||
						relationshipTypeColors.DEFAULT ||
						"#6B7280"
					}
					linkWidth={(link: GraphLink) => Math.max(1, link.strength * 4)}
					linkDirectionalArrowLength={6}
					linkDirectionalArrowRelPos={1}
					linkLabel={(link: GraphLink) => `${link.label} (${link.type})`}
					onNodeClick={handleNodeClick}
					onNodeRightClick={(node) => {
						// Prevent context menu
						window.alert(
							`Węzeł: ${node.name}\nTyp: ${node.type}\nOpis: ${node.description}`,
						);
					}}
					onLinkClick={(link) => {
						window.alert(
							`Relacja: ${link.type}\nOpis: ${link.label}\nSiła: ${link.strength}`,
						);
					}}
					onBackgroundClick={() => setSelectedNode(null)}
					cooldownTicks={100}
					onEngineStop={() => {
						if (fgRef.current) {
							fgRef.current.zoomToFit(400);
							setIsZoomed(false);
						}
					}}
					width={width}
					height={height}
					// Accessibility props
					backgroundColor="#f9fafb"
					nodeAutoColorBy="group"
					enableNodeDrag={!isInteractive}
					onNodeDragEnd={() => setIsZoomed(true)}
				/>

				{!isZoomed && (
					<div className="absolute right-4 bottom-4 rounded bg-white/80 px-3 py-1 text-gray-600 text-sm">
						Przybliż/W oddal: Ctrl + kółko myszy | Z: przybliżenie | X:
						oddalenie | 0: reset widoku
					</div>
				)}
			</div>

			{/* Node details panel */}
			{selectedNode && (
				<Card className="mt-4">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<div
								className="h-4 w-4 rounded-full"
								style={{ backgroundColor: selectedNode.color }}
								aria-label={`Kolor węzła ${selectedNode.type}`}
								role="img"
							/>
							{selectedNode.name} ({selectedNode.polishName})
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-2">
							<div>
								<span className="font-medium">Typ: </span>
								<Badge
									variant="secondary"
									aria-label={`Typ węzła: ${selectedNode.type}`}
								>
									{selectedNode.type}
								</Badge>
							</div>
							<div>
								<span className="font-medium">Opis: </span>
								<p className="text-sm">{selectedNode.description}</p>
							</div>
							<div>
								<span className="font-medium">Opis (PL): </span>
								<p className="text-sm">{selectedNode.polishDescription}</p>
							</div>
						</div>
					</CardContent>
				</Card>
			)}

			{/* Legend */}
			<div
				className="mt-4 rounded-lg border bg-gray-50 p-4"
				role="region"
				aria-label="Legenda grafu wiedzy"
			>
				<h3 className="mb-2 font-semibold">Legenda:</h3>
				<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
					{Object.entries(nodeTypeColors).map(([type, color]) => (
						<div key={type} className="flex items-center gap-2">
							<div
								className="h-4 w-4 rounded-full"
								style={{ backgroundColor: color }}
								aria-label={`Kolor dla typu ${type}`}
								role="img"
							/>
							<span className="text-sm">{type}</span>
						</div>
					))}
				</div>
				<div className="mt-4">
					<h4 className="mb-2 font-medium">Relacje:</h4>
					<div className="flex flex-wrap gap-2">
						{Object.entries(relationshipTypeColors).map(([type, color]) => (
							<div key={type} className="flex items-center gap-1">
								<div
									className="h-3 w-3 rounded-sm"
									style={{ backgroundColor: color }}
									aria-label={`Kolor dla relacji ${type}`}
									role="img"
								/>
								<span className="text-xs">{type}</span>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default KnowledgeGraph;
