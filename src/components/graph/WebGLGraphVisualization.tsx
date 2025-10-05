"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Html, OrbitControls, Text } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
	AlertTriangle,
	Info,
	Loader2,
	Maximize2,
	RotateCcw,
	Zap,
} from "lucide-react";
import React, {
	useRef,
	useEffect,
	useState,
	useMemo,
	useCallback,
} from "react";
import * as THREE from "three";

import type {
	KnowledgeNode,
	KnowledgeRelationship,
	NodeType,
} from "@/types/knowledge-graph";

interface WebGLGraphVisualizationProps {
	nodes: KnowledgeNode[];
	relationships: KnowledgeRelationship[];
	width?: number;
	height?: number;
	onNodeClick?: (nodeId: string) => void;
	onNodeHover?: (nodeId: string | null) => void;
	selectedNodeIds?: string[];
	className?: string;
	enablePhysics?: boolean;
	qualityLevel?: "low" | "medium" | "high";
}

// Node type configurations for 3D visualization
const nodeTypeConfig = {
	SUPPLEMENT: {
		color: "#10b981", // green
		size: 1.2,
		shape: "sphere",
		emissive: "#065f46",
	},
	NEUROTRANSMITTER: {
		color: "#3b82f6", // blue
		size: 1.0,
		shape: "octahedron",
		emissive: "#1e40af",
	},
	BRAIN_REGION: {
		color: "#8b5cf6", // purple
		size: 1.4,
		shape: "dodecahedron",
		emissive: "#5b21b6",
	},
	COGNITIVE_FUNCTION: {
		color: "#f59e0b", // orange
		size: 1.1,
		shape: "tetrahedron",
		emissive: "#d97706",
	},
	PATHWAY: {
		color: "#6366f1", // indigo
		size: 0.9,
		shape: "cylinder",
		emissive: "#4338ca",
	},
	MECHANISM: {
		color: "#ec4899", // pink
		size: 0.8,
		shape: "cone",
		emissive: "#be185d",
	},
};

// 3D Node Component with Polish labels
const Node3D: React.FC<{
	node: KnowledgeNode;
	position: [number, number, number];
	isSelected: boolean;
	isHovered: boolean;
	onClick: () => void;
	onHover: (hover: boolean) => void;
	qualityLevel: "low" | "medium" | "high";
}> = React.memo(
	({
		node,
		position,
		isSelected,
		isHovered,
		onClick,
		onHover,
		qualityLevel,
	}) => {
		const meshRef = useRef<THREE.Mesh>(null);
		const config = nodeTypeConfig[node.type];

		// Animate node on selection/hover
		useFrame((state) => {
			if (meshRef.current) {
				const scale = isSelected ? 1.5 : isHovered ? 1.2 : 1.0;
				meshRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);

				// Gentle rotation for visual appeal
				meshRef.current.rotation.y += 0.01;
			}
		});

		// Geometry based on quality level
		const geometry = useMemo(() => {
			const segments =
				qualityLevel === "high" ? 32 : qualityLevel === "medium" ? 16 : 8;

			switch (config.shape) {
				case "sphere":
					return new THREE.SphereGeometry(config.size, segments, segments);
				case "octahedron":
					return new THREE.OctahedronGeometry(config.size);
				case "dodecahedron":
					return new THREE.DodecahedronGeometry(config.size);
				case "tetrahedron":
					return new THREE.TetrahedronGeometry(config.size);
				case "cylinder":
					return new THREE.CylinderGeometry(
						config.size * 0.8,
						config.size * 0.8,
						config.size * 1.5,
						segments,
					);
				case "cone":
					return new THREE.ConeGeometry(
						config.size,
						config.size * 1.5,
						segments,
					);
				default:
					return new THREE.SphereGeometry(config.size, segments, segments);
			}
		}, [config, qualityLevel]);

		// Material based on quality level
		const material = useMemo(() => {
			const baseProps = {
				color: config.color,
				emissive: config.emissive,
				emissiveIntensity: isSelected ? 0.3 : isHovered ? 0.2 : 0.1,
			};

			if (qualityLevel === "low") {
				return new THREE.MeshBasicMaterial(baseProps);
			}
			return new THREE.MeshStandardMaterial({
				...baseProps,
				metalness: 0.3,
				roughness: 0.4,
			});
		}, [config, isSelected, isHovered, qualityLevel]);

		return (
			<group position={position}>
				<mesh
					ref={meshRef}
					geometry={geometry}
					material={material}
					onClick={onClick}
					onPointerOver={() => onHover(true)}
					onPointerOut={() => onHover(false)}
				/>

				{/* Polish label */}
				{(isSelected || isHovered) && (
					<Html distanceFactor={10}>
						<div className="max-w-48 rounded border bg-white/90 px-2 py-1 text-xs shadow-lg backdrop-blur-sm">
							<div className="font-medium">{node.polishName || node.name}</div>
							{node.polishDescription && (
								<div className="mt-1 truncate text-gray-600 text-xs">
									{node.polishDescription}
								</div>
							)}
							<div className="mt-1 flex gap-1">
								<Badge variant="outline" className="text-xs">
									{nodeTypeConfig[node.type]
										? node.type === "SUPPLEMENT"
											? "Suplement"
											: node.type === "NEUROTRANSMITTER"
												? "Neuroprzekaźnik"
												: node.type === "BRAIN_REGION"
													? "Region mózgu"
													: node.type === "COGNITIVE_FUNCTION"
														? "Funkcja poznawcza"
														: node.type === "PATHWAY"
															? "Szlak"
															: "Mechanizm"
										: node.type}
								</Badge>
							</div>
						</div>
					</Html>
				)}
			</group>
		);
	},
);

Node3D.displayName = "Node3D";

// 3D Connection Component
const Connection3D: React.FC<{
	relationship: KnowledgeRelationship;
	startPos: [number, number, number];
	endPos: [number, number, number];
	qualityLevel: "low" | "medium" | "high";
}> = React.memo(({ relationship, startPos, endPos, qualityLevel }) => {
	const lineRef = useRef<THREE.BufferGeometry>(null);

	// Connection color based on type
	const getConnectionColor = (type: string) => {
		switch (type) {
			case "ENHANCES":
			case "SYNERGIZES":
				return "#10b981"; // green
			case "INHIBITS":
			case "ANTAGONIZES":
				return "#ef4444"; // red
			case "MODULATES":
				return "#f59e0b"; // orange
			default:
				return "#6b7280"; // gray
		}
	};

	const points = useMemo(() => {
		return [new THREE.Vector3(...startPos), new THREE.Vector3(...endPos)];
	}, [startPos, endPos]);

	useEffect(() => {
		if (lineRef.current) {
			lineRef.current.setFromPoints(points);
		}
	}, [points]);

	return (
		<line>
			<bufferGeometry ref={lineRef} />
			<lineBasicMaterial
				color={getConnectionColor(relationship.type)}
				opacity={relationship.strength * 0.8}
				transparent
				linewidth={
					qualityLevel === "high" ? 3 : qualityLevel === "medium" ? 2 : 1
				}
			/>
		</line>
	);
});

Connection3D.displayName = "Connection3D";

// Main 3D Scene Component
const Scene3D: React.FC<{
	nodes: KnowledgeNode[];
	relationships: KnowledgeRelationship[];
	onNodeClick?: (nodeId: string) => void;
	onNodeHover?: (nodeId: string | null) => void;
	selectedNodeIds?: string[];
	enablePhysics?: boolean;
	qualityLevel: "low" | "medium" | "high";
}> = ({
	nodes,
	relationships,
	onNodeClick,
	onNodeHover,
	selectedNodeIds = [],
	enablePhysics = true,
	qualityLevel,
}) => {
	const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
	const { camera } = useThree();

	// Calculate 3D positions using force-directed layout
	const nodePositions = useMemo(() => {
		const positions: Record<string, [number, number, number]> = {};
		const nodeCount = nodes.length;

		if (nodeCount === 0) return positions;

		// Simple 3D sphere distribution for performance
		nodes.forEach((node, index) => {
			const phi = Math.acos(-1 + (2 * index) / nodeCount);
			const theta = Math.sqrt(nodeCount * Math.PI) * phi;
			const radius = 20 + (node.importance || 0) * 10;

			positions[node.id] = [
				radius * Math.cos(theta) * Math.sin(phi),
				radius * Math.sin(theta) * Math.sin(phi),
				radius * Math.cos(phi),
			];
		});

		return positions;
	}, [nodes]);

	// Handle node interactions
	const handleNodeClick = useCallback(
		(nodeId: string) => {
			onNodeClick?.(nodeId);
		},
		[onNodeClick],
	);

	const handleNodeHover = useCallback(
		(nodeId: string, hover: boolean) => {
			const newHoveredId = hover ? nodeId : null;
			setHoveredNodeId(newHoveredId);
			onNodeHover?.(newHoveredId);
		},
		[onNodeHover],
	);

	// Set up camera position
	useEffect(() => {
		camera.position.set(50, 50, 50);
		camera.lookAt(0, 0, 0);
	}, [camera]);

	return (
		<>
			{/* Lighting */}
			<ambientLight intensity={0.6} />
			<pointLight position={[10, 10, 10]} intensity={0.8} />
			<pointLight position={[-10, -10, -10]} intensity={0.4} />

			{/* Nodes */}
			{nodes.map((node) => {
				const position = nodePositions[node.id];
				if (!position) return null;

				return (
					<Node3D
						key={node.id}
						node={node}
						position={position}
						isSelected={selectedNodeIds.includes(node.id)}
						isHovered={hoveredNodeId === node.id}
						onClick={() => handleNodeClick(node.id)}
						onHover={(hover) => handleNodeHover(node.id, hover)}
						qualityLevel={qualityLevel}
					/>
				);
			})}

			{/* Connections */}
			{relationships.map((relationship) => {
				const startPos = nodePositions[relationship.sourceId];
				const endPos = nodePositions[relationship.targetId];

				if (!startPos || !endPos) return null;

				return (
					<Connection3D
						key={relationship.id}
						relationship={relationship}
						startPos={startPos}
						endPos={endPos}
						qualityLevel={qualityLevel}
					/>
				);
			})}

			{/* Controls */}
			<OrbitControls
				enablePan={true}
				enableZoom={true}
				enableRotate={true}
				maxDistance={200}
				minDistance={10}
			/>
		</>
	);
};

// WebGL capability detection
const detectWebGLSupport = (): boolean => {
	try {
		const canvas = document.createElement("canvas");
		const gl =
			canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
		return !!gl;
	} catch (e) {
		return false;
	}
};

// Performance monitoring
const usePerformanceMonitor = () => {
	const [fps, setFps] = useState(60);
	const [memoryUsage, setMemoryUsage] = useState(0);

	useEffect(() => {
		let frameCount = 0;
		let lastTime = performance.now();

		const measurePerformance = () => {
			frameCount++;
			const currentTime = performance.now();

			if (currentTime - lastTime >= 1000) {
				setFps(frameCount);
				frameCount = 0;
				lastTime = currentTime;

				// Memory usage (if available)
				if ("memory" in performance) {
					const memory = (performance as any).memory;
					setMemoryUsage(memory.usedJSHeapSize / 1024 / 1024); // MB
				}
			}

			requestAnimationFrame(measurePerformance);
		};

		measurePerformance();
	}, []);

	return { fps, memoryUsage };
};

const WebGLGraphVisualization: React.FC<WebGLGraphVisualizationProps> = ({
	nodes,
	relationships,
	width = 800,
	height = 600,
	onNodeClick,
	onNodeHover,
	selectedNodeIds = [],
	className = "",
	enablePhysics = true,
	qualityLevel = "medium",
}) => {
	const [webglSupported, setWebglSupported] = useState<boolean | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [adaptiveQuality, setAdaptiveQuality] = useState(qualityLevel);

	const { fps, memoryUsage } = usePerformanceMonitor();

	// Check WebGL support on mount
	useEffect(() => {
		const supported = detectWebGLSupport();
		setWebglSupported(supported);

		if (!supported) {
			setError("WebGL nie jest obsługiwane przez tę przeglądarkę");
		}

		setIsLoading(false);
	}, []);

	// Adaptive quality based on performance
	useEffect(() => {
		if (fps < 30 && adaptiveQuality !== "low") {
			setAdaptiveQuality("low");
			console.log("Obniżono jakość wizualizacji ze względu na wydajność");
		} else if (
			fps > 50 &&
			adaptiveQuality === "low" &&
			qualityLevel !== "low"
		) {
			setAdaptiveQuality("medium");
			console.log("Przywrócono średnią jakość wizualizacji");
		}
	}, [fps, adaptiveQuality, qualityLevel]);

	// Memory monitoring
	useEffect(() => {
		if (memoryUsage > 100) {
			// 100MB threshold
			console.warn(`Wysokie zużycie pamięci: ${memoryUsage.toFixed(1)}MB`);
		}
	}, [memoryUsage]);

	if (isLoading) {
		return (
			<Card className={className}>
				<CardContent
					className="flex items-center justify-center"
					style={{ height }}
				>
					<div className="text-center">
						<Loader2 className="mx-auto mb-2 h-8 w-8 animate-spin" />
						<p className="text-gray-600 text-sm">
							Inicjalizacja wizualizacji 3D...
						</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	if (!webglSupported || error) {
		return (
			<Card className={className}>
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-orange-600">
						<AlertTriangle className="h-5 w-5" />
						WebGL niedostępne
					</CardTitle>
				</CardHeader>
				<CardContent>
					<Alert>
						<AlertTriangle className="h-4 w-4" />
						<AlertDescription>
							{error ||
								"Twoja przeglądarka nie obsługuje WebGL. Użyj standardowej wizualizacji 2D."}
						</AlertDescription>
					</Alert>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className={className}>
			<CardHeader className="pb-2">
				<div className="flex items-center justify-between">
					<CardTitle className="flex items-center gap-2 text-lg">
						<Zap className="h-5 w-5" />
						Wizualizacja 3D ({nodes.length} węzłów)
					</CardTitle>
					<div className="flex items-center gap-2">
						<Badge variant="outline" className="text-xs">
							{fps} FPS
						</Badge>
						{memoryUsage > 0 && (
							<Badge variant="outline" className="text-xs">
								{memoryUsage.toFixed(1)}MB
							</Badge>
						)}
						<Badge variant="outline" className="text-xs">
							Jakość: {adaptiveQuality}
						</Badge>
					</div>
				</div>
			</CardHeader>

			<CardContent className="p-0">
				<div style={{ width, height }} className="relative">
					<Canvas
						camera={{ position: [50, 50, 50], fov: 60 }}
						onCreated={({ gl }) => {
							gl.setClearColor("#f8fafc");
							gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
						}}
					>
						<Scene3D
							nodes={nodes}
							relationships={relationships}
							onNodeClick={onNodeClick}
							onNodeHover={onNodeHover}
							selectedNodeIds={selectedNodeIds}
							enablePhysics={enablePhysics}
							qualityLevel={adaptiveQuality}
						/>
					</Canvas>

					{/* Performance warning */}
					{fps < 20 && (
						<div className="absolute top-2 right-2 rounded border border-yellow-300 bg-yellow-100 p-2 text-xs">
							<div className="flex items-center gap-1">
								<Info className="h-3 w-3" />
								Niska wydajność - rozważ zmniejszenie liczby węzłów
							</div>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
};

export default WebGLGraphVisualization;
