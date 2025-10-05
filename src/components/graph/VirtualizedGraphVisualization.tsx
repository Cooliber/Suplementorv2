/**
 * Virtualized Graph Visualization Component
 * Implements performance optimizations for handling large datasets (500+ nodes)
 * Uses canvas-based rendering for better performance with large graphs
 */

"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useKnowledgeGraphStore } from "@/lib/stores/knowledge-graph-store";
import type {
	KnowledgeNode,
	KnowledgeRelationship,
} from "@/types/knowledge-graph";
import type { SupplementWithRelations } from "@/types/supplement";
import {
	Info,
	Pause,
	Play,
	RotateCcw,
	Settings,
	ZoomIn,
	ZoomOut,
} from "lucide-react";
import type React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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

interface VirtualizedGraphVisualizationProps {
	nodes: KnowledgeNode[];
	relationships: KnowledgeRelationship[];
	supplements?: SupplementWithRelations[];
	width?: number;
	height?: number;
	className?: string;
}

interface CanvasNode extends KnowledgeNode {
	x: number;
	y: number;
	vx: number;
	vy: number;
	fx?: number;
	fy?: number;
}

interface CanvasRelationship extends KnowledgeRelationship {
	source: CanvasNode;
	target: CanvasNode;
}

// Particle system for physics simulation
class ParticleSystem {
	private nodes: CanvasNode[];
	private relationships: CanvasRelationship[];
	private width: number;
	private height: number;
	private centerX: number;
	private centerY: number;
	private k = 0.1; // Spring constant
	private repulsion = 100;
	private friction = 0.9;
	private timeStep = 0.016; // ~60fps

	constructor(
		nodes: CanvasNode[],
		relationships: CanvasRelationship[],
		width: number,
		height: number,
	) {
		this.nodes = nodes.map((node) => ({ ...node, vx: 0, vy: 0 }));
		this.relationships = relationships;
		this.width = width;
		this.height = height;
		this.centerX = width / 2;
		this.centerY = height / 2;
	}

	update() {
		// Apply spring forces from relationships
		for (const rel of this.relationships) {
			const source = rel.source;
			const target = rel.target;

			if (!source || !target) continue;

			const dx = target.x - source.x;
			const dy = target.y - source.y;
			const distance = Math.sqrt(dx * dx + dy * dy);
			const minDistance = 50;

			if (distance < minDistance) {
				const force = (minDistance - distance) * this.k;
				const fx = (dx / distance) * force;
				const fy = (dy / distance) * force;

				if (!source.fx && !source.fy) {
					source.vx += fx;
					source.vy += fy;
				}
				if (!target.fx && !target.fy) {
					target.vx -= fx;
					target.vy -= fy;
				}
			}
		}

		// Apply repulsive forces
		for (let i = 0; i < this.nodes.length; i++) {
			for (let j = i + 1; j < this.nodes.length; j++) {
				const node1 = this.nodes[i];
				const node2 = this.nodes[j];

				if (!node1 || !node2) continue;
				if (node1.fx !== undefined && node1.fy !== undefined) continue;
				if (node2.fx !== undefined && node2.fy !== undefined) continue;

				const dx = node2.x - node1.x;
				const dy = node2.y - node1.y;
				const distance = Math.sqrt(dx * dx + dy * dy);

				if (distance > 0 && distance < 200) {
					const force =
						(this.repulsion / (distance * distance)) * this.timeStep;
					const fx = (dx / distance) * force;
					const fy = (dy / distance) * force;

					node1.vx -= fx;
					node1.vy -= fy;
					node2.vx += fx;
					node2.vy += fy;
				}
			}
		}

		// Apply center gravity
		for (const node of this.nodes) {
			if (node.fx !== undefined && node.fy !== undefined) continue;

			const dx = this.centerX - node.x;
			const dy = this.centerY - node.y;
			const distance = Math.sqrt(dx * dx + dy * dy);

			if (distance > 0) {
				const force = distance * 0.0001;
				const fx = (dx / distance) * force;
				const fy = (dy / distance) * force;

				node.vx += fx;
				node.vy += fy;
			}
		}

		// Update positions with friction
		for (const node of this.nodes) {
			if (node.fx !== undefined && node.fy !== undefined) continue;

			node.vx *= this.friction;
			node.vy *= this.friction;

			node.x += node.vx;
			node.y += node.vy;

			// Boundary checks
			node.x = Math.max(10, Math.min(this.width - 10, node.x));
			node.y = Math.max(10, Math.min(this.height - 10, node.y));
		}
	}

	getPositions() {
		return this.nodes.map((node) => ({ x: node.x, y: node.y }));
	}
}

const VirtualizedGraphVisualization: React.FC<
	VirtualizedGraphVisualizationProps
> = ({
	nodes,
	relationships,
	supplements = [],
	width = 800,
	height = 600,
	className = "",
}) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const animationRef = useRef<number>(0);
	const systemRef = useRef<ParticleSystem | null>(null);
	const [selectedNode, setSelectedNode] = useState<KnowledgeNode | null>(null);
	const [hoveredNode, setHoveredNode] = useState<KnowledgeNode | null>(null);
	const [isPlaying, setIsPlaying] = useState(true);
	const [zoom, setZoom] = useState(1);
	const [offsetX, setOffsetX] = useState(0);
	const [offsetY, setOffsetY] = useState(0);

	const { filters, maxRenderNodes } = useKnowledgeGraphStore();

	// Transform data for canvas rendering
	const { canvasNodes, canvasRelationships } = useMemo(() => {
		// Apply filters
		let filteredNodes = nodes;

		if (filters.nodeTypes.length > 0) {
			filteredNodes = filteredNodes.filter((node) =>
				filters.nodeTypes.includes(node.type),
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
				filters.evidenceLevels.includes(node.evidenceLevel),
			);
		}

		// Limit nodes for performance
		if (filteredNodes.length > maxRenderNodes) {
			filteredNodes = filteredNodes.slice(0, maxRenderNodes);
		}

		// Transform nodes with initial positions
		const canvasNodes: CanvasNode[] = filteredNodes.map((node, index) => {
			// Distribute nodes in a circle initially
			const angle = (index / filteredNodes.length) * 2 * Math.PI;
			const radius = Math.min(width, height) * 0.4;
			const x = width / 2 + Math.cos(angle) * radius;
			const y = height / 2 + Math.sin(angle) * radius;

			return {
				...node,
				x,
				y,
				vx: 0,
				vy: 0,
				fx: node.fx ?? undefined,
				fy: node.fy ?? undefined,
			};
		});

		// Filter relationships to only include those between filtered nodes
		const nodeIds = new Set(canvasNodes.map((n) => n.id));
		let filteredRelationships = relationships.filter(
			(rel) => nodeIds.has(rel.sourceId) && nodeIds.has(rel.targetId),
		);

		if (filters.relationshipTypes.length > 0) {
			filteredRelationships = filteredRelationships.filter((rel) =>
				filters.relationshipTypes.includes(rel.type),
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

		// Create relationship objects with source/target references
		const canvasRelationships: CanvasRelationship[] = filteredRelationships.map(
			(rel) => {
				const source = canvasNodes.find((n) => n.id === rel.sourceId);
				const target = canvasNodes.find((n) => n.id === rel.targetId);

				return {
					...rel,
					source: source!,
					target: target!,
				};
			},
		);

		return { canvasNodes, canvasRelationships };
	}, [nodes, relationships, filters, maxRenderNodes, width, height]);

	// Initialize particle system
	useEffect(() => {
		if (canvasNodes.length > 0 && canvasRelationships.length > 0) {
			systemRef.current = new ParticleSystem(
				canvasNodes,
				canvasRelationships,
				width,
				height,
			);
		}

		return () => {
			if (animationRef.current) {
				cancelAnimationFrame(animationRef.current);
			}
		};
	}, [canvasNodes, canvasRelationships, width, height]);

	// Animation loop
	useEffect(() => {
		if (!isPlaying || !systemRef.current) return;

		const animate = () => {
			if (systemRef.current) {
				systemRef.current.update();
			}

			draw();
			animationRef.current = requestAnimationFrame(animate);
		};

		animationRef.current = requestAnimationFrame(animate);
		return () => {
			if (animationRef.current) {
				cancelAnimationFrame(animationRef.current);
			}
		};
	}, [isPlaying]);

	// Draw function
	const draw = useCallback(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		// Clear canvas
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		// Apply zoom and pan transformation
		ctx.save();
		ctx.translate(offsetX, offsetY);
		ctx.scale(zoom, zoom);

		// Draw relationships
		for (const rel of canvasRelationships) {
			if (!rel.source || !rel.target) continue;

			ctx.beginPath();
			ctx.moveTo(rel.source.x, rel.source.y);
			ctx.lineTo(rel.target.x, rel.target.y);

			const color =
				relationshipTypeColors[rel.type] ||
				relationshipTypeColors.DEFAULT ||
				"#6B7280";
			const opacity = evidenceOpacity[rel.evidenceLevel] || 0.6;

			ctx.strokeStyle = color;
			ctx.globalAlpha = opacity;
			ctx.lineWidth = Math.max(1, rel.strength * 3);
			ctx.stroke();
		}

		// Draw nodes
		for (const node of canvasNodes) {
			const color =
				nodeTypeColors[node.type] || nodeTypeColors.DEFAULT || "#6B7280";
			const opacity = evidenceOpacity[node.evidenceLevel] || 0.8;

			ctx.beginPath();
			ctx.arc(node.x, node.y, node.size || 5, 0, 2 * Math.PI);
			ctx.fillStyle = color;
			ctx.globalAlpha = opacity;
			ctx.fill();

			// Highlight selected node
			if (selectedNode?.id === node.id) {
				ctx.beginPath();
				ctx.arc(node.x, node.y, (node.size || 5) + 5, 0, 2 * Math.PI);
				ctx.strokeStyle = "#FBBF24";
				ctx.lineWidth = 2;
				ctx.stroke();
			}

			// Highlight hovered node
			if (hoveredNode?.id === node.id) {
				ctx.beginPath();
				ctx.arc(node.x, node.y, (node.size || 5) + 3, 0, 2 * Math.PI);
				ctx.strokeStyle = "#3B82F6";
				ctx.lineWidth = 1.5;
				ctx.stroke();
			}
		}

		ctx.restore();
	}, [
		canvasNodes,
		canvasRelationships,
		selectedNode,
		hoveredNode,
		zoom,
		offsetX,
		offsetY,
	]);

	// Handle canvas click
	const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const rect = canvas.getBoundingClientRect();
		const x = (e.clientX - rect.left - offsetX) / zoom;
		const y = (e.clientY - rect.top - offsetY) / zoom;

		// Find clicked node
		for (const node of canvasNodes) {
			const distance = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2);
			if (distance <= (node.size || 5) + 2) {
				setSelectedNode(node);
				return;
			}
		}

		// If no node was clicked, deselect
		setSelectedNode(null);
	};

	// Handle canvas hover
	const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const rect = canvas.getBoundingClientRect();
		const x = (e.clientX - rect.left - offsetX) / zoom;
		const y = (e.clientY - rect.top - offsetY) / zoom;

		// Find hovered node
		for (const node of canvasNodes) {
			const distance = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2);
			if (distance <= (node.size || 5) + 2) {
				if (hoveredNode?.id !== node.id) {
					setHoveredNode(node);
				}
				return;
			}
		}

		// If no node is hovered
		if (hoveredNode) {
			setHoveredNode(null);
		}
	};

	// Zoom controls
	const handleZoomIn = () => {
		setZoom((prev) => Math.min(prev * 1.2, 3));
	};

	const handleZoomOut = () => {
		setZoom((prev) => Math.max(prev * 0.8, 0.3));
	};

	const handleResetZoom = () => {
		setZoom(1);
		setOffsetX(0);
		setOffsetY(0);
	};

	// Start with some initial rendering
	useEffect(() => {
		draw();
	}, [draw]);

	return (
		<div className={`flex flex-col ${className}`}>
			{/* Controls */}
			<div className="mb-4 flex flex-wrap items-center justify-between gap-2">
				<div className="flex items-center gap-2">
					<Button variant="outline" size="sm" onClick={handleZoomIn}>
						<ZoomIn className="h-4 w-4" />
					</Button>

					<Button variant="outline" size="sm" onClick={handleZoomOut}>
						<ZoomOut className="h-4 w-4" />
					</Button>

					<Button variant="outline" size="sm" onClick={handleResetZoom}>
						<RotateCcw className="h-4 w-4" />
					</Button>

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
				</div>

				<div className="flex items-center gap-2">
					<Badge variant="secondary">Węzły: {canvasNodes.length}</Badge>
					<Badge variant="secondary">
						Połączenia: {canvasRelationships.length}
					</Badge>
					<Badge variant="secondary">Zoom: {Math.round(zoom * 100)}%</Badge>
				</div>
			</div>

			{/* Graph Canvas */}
			<div className="relative overflow-hidden rounded-lg border bg-gray-50">
				<canvas
					ref={canvasRef}
					width={width}
					height={height}
					onClick={handleCanvasClick}
					onMouseMove={handleCanvasMouseMove}
					className="h-full w-full cursor-pointer"
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
										nodeTypeColors[selectedNode.type] || nodeTypeColors.DEFAULT,
								}}
							/>
							{selectedNode.polishName || selectedNode.name}
							<Badge variant={selectedNode.evidenceLevel?.toLowerCase() as any}>
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
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
};

export default VirtualizedGraphVisualization;
