"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { animated, useSpring } from "@react-spring/three";
import { Html, OrbitControls, Text } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Activity, Network, Pause, Play, RotateCcw, Zap } from "lucide-react";
import React from "react";
import React, { useState, useRef, useMemo } from "react";
import {
	BufferGeometry,
	Color,
	type Group,
	type Mesh,
	MeshStandardMaterial,
	Vector3,
} from "three";

interface SystemicEffectPropagatorProps {
	supplementName: string;
	polishSupplementName: string;
	propagationType: "nervous" | "hormonal" | "vascular" | "immune";
	polishPropagationType: string;
	propagationSpeed: number; // 0-1 scale
	autoPlay?: boolean;
	showSignalPath?: boolean;
	className?: string;
}

interface SignalNode {
	id: string;
	name: string;
	polishName: string;
	position: Vector3;
	nodeType: "origin" | "relay" | "target";
	isActivated: boolean;
	activationTime: number;
	signalStrength: number;
	connections: string[];
}

interface SignalPath {
	id: string;
	fromNode: string;
	toNode: string;
	propagationProgress: number;
	signalIntensity: number;
	color: Color;
}

const NERVOUS_SYSTEM_PATHWAY = {
	nodes: [
		{
			id: "brain",
			name: "Mózg",
			polishName: "Mózg",
			position: new Vector3(0, 2, 0),
			nodeType: "origin" as const,
		},
		{
			id: "spinal-cord",
			name: "Rdzeń kręgowy",
			polishName: "Rdzeń kręgowy",
			position: new Vector3(0, 1, 0),
			nodeType: "relay" as const,
		},
		{
			id: "peripheral-nerve",
			name: "Nerw obwodowy",
			polishName: "Nerw obwodowy",
			position: new Vector3(-1, 0.5, 0),
			nodeType: "relay" as const,
		},
		{
			id: "neuromuscular-junction",
			name: "Połączenie nerwowo-mięśniowe",
			polishName: "Połączenie nerwowo-mięśniowe",
			position: new Vector3(-2, 0, 0),
			nodeType: "target" as const,
		},
		{
			id: "muscle-fiber",
			name: "Włókno mięśniowe",
			polishName: "Włókno mięśniowe",
			position: new Vector3(-2.5, -0.5, 0),
			nodeType: "target" as const,
		},
	],
	connections: [
		["brain", "spinal-cord"],
		["spinal-cord", "peripheral-nerve"],
		["peripheral-nerve", "neuromuscular-junction"],
		["neuromuscular-junction", "muscle-fiber"],
	],
};

export const SystemicEffectPropagator: React.FC<
	SystemicEffectPropagatorProps
> = ({
	supplementName,
	polishSupplementName,
	propagationType,
	polishPropagationType,
	propagationSpeed,
	autoPlay = true,
	showSignalPath = true,
	className = "",
}) => {
	const [isPlaying, setIsPlaying] = useState(autoPlay);
	const [currentTime, setCurrentTime] = useState(0);
	const [propagationProgress, setPropagationProgress] = useState(0);
	const [selectedNode, setSelectedNode] = useState<string | null>(null);
	const animationProgressRef = useRef(0);

	const { nodes, connections } = NERVOUS_SYSTEM_PATHWAY;

	const signalNodes = useMemo(() => {
		return nodes.map((node) => ({
			...node,
			isActivated: false,
			activationTime: 0,
			signalStrength: 1,
			connections: connections
				.filter(([from, to]) => from === node.id || to === node.id)
				.flat()
				.filter((id) => id !== node.id),
		}));
	}, []);

	const signalPaths = useMemo(() => {
		return connections.map(([from, to], index) => ({
			id: `path-${index}`,
			fromNode: from,
			toNode: to,
			propagationProgress: 0,
			signalIntensity: 1,
			color: new Color("#F59E0B"),
		}));
	}, [connections]);

	return (
		<Card className={`w-full ${className}`}>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Network className="h-5 w-5" />
					Propagacja efektów systemowych
				</CardTitle>
				<div className="space-y-1">
					<p className="font-medium text-sm">
						{polishSupplementName} - {polishPropagationType}
					</p>
					<div className="flex items-center gap-2">
						<Badge variant="outline">
							Prędkość propagacji: {(propagationSpeed * 100).toFixed(0)}%
						</Badge>
						<Badge variant="secondary">{signalNodes.length} węzłów</Badge>
					</div>
				</div>
			</CardHeader>
			<CardContent className="space-y-4">
				<div
					className="relative overflow-hidden rounded-lg bg-gray-900"
					style={{ height: "400px" }}
				>
					<Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
						<SystemicEffectScene
							signalNodes={signalNodes}
							signalPaths={signalPaths}
							isPlaying={isPlaying}
							propagationSpeed={propagationSpeed}
							onTimeUpdate={setCurrentTime}
							onPropagationProgress={setPropagationProgress}
							selectedNode={selectedNode}
						/>
						<OrbitControls
							enablePan={true}
							enableZoom={true}
							enableRotate={true}
						/>
					</Canvas>

					{/* Time overlay */}
					<div className="absolute top-4 left-4 rounded bg-black/70 p-2 text-sm text-white">
						<div className="space-y-1">
							<div>Czas: {currentTime.toFixed(1)}s</div>
							<Progress value={propagationProgress} className="h-1 w-24" />
						</div>
					</div>
				</div>

				{/* Signal nodes status */}
				<div className="grid grid-cols-1 gap-2">
					{signalNodes.map((node) => (
						<Card
							key={node.id}
							className={`cursor-pointer p-2 transition-colors ${
								selectedNode === node.id
									? "border-blue-200 bg-blue-50"
									: "hover:bg-gray-50"
							}`}
							onClick={() =>
								setSelectedNode(selectedNode === node.id ? null : node.id)
							}
						>
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<div
										className={`h-3 w-3 rounded-full ${
											node.isActivated ? "bg-green-500" : "bg-gray-300"
										}`}
									/>
									<span className="font-medium text-sm">{node.polishName}</span>
								</div>
								<div className="flex items-center gap-2">
									<Badge
										variant={
											node.nodeType === "origin"
												? "default"
												: node.nodeType === "relay"
													? "secondary"
													: "outline"
										}
									>
										{node.nodeType === "origin"
											? "Źródło"
											: node.nodeType === "relay"
												? "Przekaźnik"
												: "Cel"}
									</Badge>
									{node.isActivated && (
										<Badge variant="outline">
											{node.signalStrength.toFixed(1)}
										</Badge>
									)}
								</div>
							</div>
						</Card>
					))}
				</div>

				{/* Controls */}
				<div className="flex items-center gap-2">
					<Button
						size="sm"
						variant={isPlaying ? "default" : "outline"}
						onClick={() => setIsPlaying(!isPlaying)}
					>
						{isPlaying ? (
							<Pause className="h-4 w-4" />
						) : (
							<Play className="h-4 w-4" />
						)}
					</Button>

					<Button
						size="sm"
						variant="outline"
						onClick={() => {
							setCurrentTime(0);
							setPropagationProgress(0);
							animationProgressRef.current = 0;
							signalNodes.forEach((node) => {
								node.isActivated = false;
								node.activationTime = 0;
							});
						}}
					>
						<RotateCcw className="h-4 w-4" />
					</Button>

					<div className="flex-1">
						<Progress value={propagationProgress} className="h-2" />
					</div>

					<Badge variant="outline">{propagationProgress.toFixed(0)}%</Badge>
				</div>

				{/* Signal pathway visualization */}
				{showSignalPath && (
					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm">Ścieżka sygnału</CardTitle>
						</CardHeader>
						<CardContent className="pt-0">
							<div className="flex items-center gap-2 text-sm">
								{signalNodes.map((node, index) => (
									<React.Fragment key={node.id}>
										<div
											className={`flex items-center gap-1 ${
												node.isActivated ? "text-green-600" : "text-gray-400"
											}`}
										>
											<div
												className={`h-2 w-2 rounded-full ${
													node.isActivated ? "bg-green-500" : "bg-gray-300"
												}`}
											/>
											<span className="text-xs">{node.polishName}</span>
										</div>
										{index < signalNodes.length - 1 && (
											<ArrowRight className="h-3 w-3 text-gray-400" />
										)}
									</React.Fragment>
								))}
							</div>
						</CardContent>
					</Card>
				)}
			</CardContent>
		</Card>
	);
};

// 3D Scene for systemic effects
interface SystemicEffectSceneProps {
	signalNodes: SignalNode[];
	signalPaths: SignalPath[];
	isPlaying: boolean;
	propagationSpeed: number;
	onTimeUpdate: (time: number) => void;
	onPropagationProgress: (progress: number) => void;
	selectedNode: string | null;
}

const SystemicEffectScene: React.FC<SystemicEffectSceneProps> = ({
	signalNodes,
	signalPaths,
	isPlaying,
	propagationSpeed,
	onTimeUpdate,
	onPropagationProgress,
	selectedNode,
}) => {
	const groupRef = useRef<Group>(null);
	const animationProgressRef = useRef(0);

	// Animation loop
	useFrame((state, delta) => {
		if (!isPlaying) return;

		animationProgressRef.current += delta * propagationSpeed;
		onTimeUpdate(animationProgressRef.current);

		// Activate nodes in sequence
		signalNodes.forEach((node, index) => {
			const activationDelay = index * 1.2;

			if (animationProgressRef.current > activationDelay && !node.isActivated) {
				node.isActivated = true;
				node.activationTime = animationProgressRef.current;

				// Attenuate signal strength
				node.signalStrength = Math.max(0.1, 1 - index * 0.15);
			}
		});

		// Update signal paths
		signalPaths.forEach((path) => {
			const fromNode = signalNodes.find((n) => n.id === path.fromNode);
			const toNode = signalNodes.find((n) => n.id === path.toNode);

			if (fromNode?.isActivated && toNode) {
				const pathDelay =
					signalNodes.findIndex((n) => n.id === path.fromNode) * 1.2;
				const propagationStart = pathDelay + 0.5;

				if (animationProgressRef.current > propagationStart) {
					path.propagationProgress = Math.min(
						1,
						(animationProgressRef.current - propagationStart) / 1.5,
					);
					path.signalIntensity =
						fromNode.signalStrength * (1 - path.propagationProgress * 0.1);
				}
			}
		});

		// Calculate overall progress
		const activatedNodes = signalNodes.filter((n) => n.isActivated).length;
		const totalProgress = (activatedNodes / signalNodes.length) * 100;
		onPropagationProgress(Math.min(100, totalProgress));
	});

	return (
		<group ref={groupRef}>
			{/* Lighting */}
			<ambientLight intensity={0.6} />
			<pointLight position={[10, 10, 10]} intensity={0.8} />
			<pointLight position={[-10, -10, -10]} intensity={0.4} color="#4444ff" />

			{/* Nervous system background */}
			<NervousSystemBackground />

			{/* Signal nodes */}
			{signalNodes.map((node) => (
				<SignalNodeComponent
					key={node.id}
					node={node}
					isSelected={selectedNode === node.id}
				/>
			))}

			{/* Signal paths */}
			{signalPaths.map((path) => (
				<SignalPathComponent
					key={path.id}
					path={path}
					signalNodes={signalNodes}
				/>
			))}

			{/* Propagation effects */}
			<PropagationEffects signalNodes={signalNodes} signalPaths={signalPaths} />
		</group>
	);
};

// Nervous system background component
const NervousSystemBackground: React.FC = () => {
	return (
		<group>
			{/* Central nervous system outline */}
			<mesh position={[0, 1.5, -0.5]}>
				<capsuleGeometry args={[0.3, 3, 8, 16]} />
				<meshStandardMaterial color="#1F2937" transparent opacity={0.1} />
			</mesh>

			{/* Background label */}
			<Html position={[0, -2, 0]}>
				<div className="rounded bg-black/70 px-2 py-1 text-sm text-white">
					Układ nerwowy
				</div>
			</Html>
		</group>
	);
};

// Signal node component
interface SignalNodeComponentProps {
	node: SignalNode;
	isSelected: boolean;
}

const SignalNodeComponent: React.FC<SignalNodeComponentProps> = ({
	node,
	isSelected,
}) => {
	const meshRef = useRef<Mesh>(null);

	const { scale, color } = useSpring({
		scale: node.isActivated ? 1.3 : 1,
		color: node.isActivated ? new Color("#F59E0B") : new Color("#6B7280"),
		config: { tension: 300, friction: 50 },
	});

	useFrame(() => {
		if (meshRef.current) {
			meshRef.current.position.copy(node.position);
		}
	});

	return (
		<group>
			<animated.mesh ref={meshRef} scale={scale}>
				<sphereGeometry args={[0.2, 12, 12]} />
				<meshStandardMaterial
					color={color}
					emissive={node.isActivated ? color.getHex() : 0x000000}
					emissiveIntensity={node.isActivated ? node.signalStrength * 0.5 : 0}
				/>
			</animated.mesh>

			{/* Activation pulse */}
			{node.isActivated && (
				<mesh position={node.position}>
					<sphereGeometry args={[0.4, 8, 8]} />
					<meshBasicMaterial
						color="#F59E0B"
						transparent
						opacity={node.signalStrength * 0.3}
					/>
				</mesh>
			)}

			{/* Node label */}
			<Html
				position={[node.position.x, node.position.y + 0.4, node.position.z]}
			>
				<div
					className={`rounded px-1 py-0.5 text-xs ${
						isSelected ? "bg-blue-500 text-white" : "bg-black/70 text-white"
					}`}
				>
					{node.polishName}
				</div>
			</Html>

			{/* Signal strength indicator */}
			{node.isActivated && (
				<Html
					position={[node.position.x, node.position.y - 0.4, node.position.z]}
				>
					<div className="rounded bg-black/70 px-1 py-0.5 text-white text-xs">
						Siła: {node.signalStrength.toFixed(1)}
					</div>
				</Html>
			)}
		</group>
	);
};

// Signal path component
interface SignalPathComponentProps {
	path: SignalPath;
	signalNodes: SignalNode[];
}

const SignalPathComponent: React.FC<SignalPathComponentProps> = ({
	path,
	signalNodes,
}) => {
	const fromNode = signalNodes.find((n) => n.id === path.fromNode);
	const toNode = signalNodes.find((n) => n.id === path.toNode);

	if (!fromNode || !toNode) return null;

	// Calculate path points
	const startPoint = fromNode.position.clone();
	const endPoint = toNode.position.clone();
	const midPoint = startPoint.clone().lerp(endPoint, 0.5);

	// Add curve to the path
	const controlPoint = midPoint.clone().add(new Vector3(0, 0.5, 0));

	// Calculate propagating signal position
	const signalPosition = startPoint
		.clone()
		.lerp(endPoint, path.propagationProgress);

	return (
		<group>
			{/* Signal path line */}
			<mesh>
				<bufferGeometry>
					<bufferAttribute
						attach="attributes-position"
						count={2}
						array={
							new Float32Array([
								startPoint.x,
								startPoint.y,
								startPoint.z,
								endPoint.x,
								endPoint.y,
								endPoint.z,
							])
						}
						itemSize={3}
					/>
				</bufferGeometry>
				<lineBasicMaterial
					color={path.color}
					opacity={path.propagationProgress * path.signalIntensity}
					transparent
				/>
			</mesh>

			{/* Propagating signal */}
			{path.propagationProgress > 0 && (
				<mesh position={signalPosition}>
					<sphereGeometry args={[0.08, 8, 8]} />
					<meshBasicMaterial
						color={path.color}
						transparent
						opacity={path.signalIntensity}
						emissive={path.color.getHex()}
						emissiveIntensity={path.signalIntensity * 0.5}
					/>
				</mesh>
			)}

			{/* Path label */}
			<Html position={midPoint}>
				<div className="rounded bg-black/70 px-1 py-0.5 text-white text-xs">
					Ścieżka sygnału
				</div>
			</Html>
		</group>
	);
};

// Propagation effects component
interface PropagationEffectsProps {
	signalNodes: SignalNode[];
	signalPaths: SignalPath[];
}

const PropagationEffects: React.FC<PropagationEffectsProps> = ({
	signalNodes,
	signalPaths,
}) => {
	return (
		<group>
			{signalNodes
				.filter((node) => node.isActivated)
				.map((node) => (
					<group key={`propagation-${node.id}`}>
						{/* Signal particles */}
						{Array.from({ length: 6 }).map((_, i) => {
							const angle = (i / 6) * Math.PI * 2;
							const radius = 0.5;
							const x = node.position.x + Math.cos(angle) * radius;
							const y = node.position.y + Math.sin(angle) * radius;
							const z = node.position.z + Math.sin(Date.now() * 0.02 + i) * 0.1;

							return (
								<mesh key={i} position={[x, y, z]}>
									<sphereGeometry args={[0.02, 6, 6]} />
									<meshBasicMaterial
										color="#F59E0B"
										transparent
										opacity={node.signalStrength * 0.6}
									/>
								</mesh>
							);
						})}
					</group>
				))}
		</group>
	);
};

export default SystemicEffectPropagator;
