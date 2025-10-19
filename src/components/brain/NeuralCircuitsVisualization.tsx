"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	ContactShadows,
	Environment,
	Html,
	Line,
	OrbitControls,
	PerspectiveCamera,
	Sphere,
	Text,
} from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import {
	Activity,
	Brain,
	Eye,
	EyeOff,
	Info,
	Network,
	Settings,
	Zap,
} from "lucide-react";
import type React from "react";
import { Suspense, useEffect, useRef, useState } from "react";
import { Color, type Group, type Mesh } from "three";

// Neural circuit interface
export interface NeuralCircuit {
	id: string;
	name: string;
	polishName: string;
	function: "cognition" | "memory" | "attention" | "mood" | "motor" | "sensory";
	description: string;
	polishDescription: string;

	// Circuit nodes (brain regions)
	nodes: CircuitNode[];

	// Circuit connections
	connections: CircuitConnection[];

	// Functional properties
	activationPattern: "sequential" | "parallel" | "feedback" | "recurrent";
	plasticityLevel: "high" | "medium" | "low";
	modulationFactors: string[];
	polishModulationFactors: string[];

	// Clinical relevance
	associatedDisorders: string[];
	polishAssociatedDisorders: string[];
	therapeuticTargets: string[];
	polishTherapeuticTargets: string[];

	// Visual properties
	visualEffect: {
		nodeColor: string;
		connectionColor: string;
		animationSpeed: number;
		showFlow: boolean;
	};
}

export interface CircuitNode {
	id: string;
	regionId: string;
	regionName: string;
	polishRegionName: string;
	position: [number, number, number];
	role: "input" | "processing" | "output" | "modulatory";
	size: number;
	activationLevel: number; // 0-1
}

export interface CircuitConnection {
	id: string;
	fromNode: string;
	toNode: string;
	strength: number; // 0-1
	type: "excitatory" | "inhibitory" | "modulatory";
	delay: number; // milliseconds
	plasticity: "hebbian" | "homeostatic" | "metaplastic";
}

// Neural circuits database
export const neuralCircuits: NeuralCircuit[] = [
	{
		id: "working-memory-circuit",
		name: "Working Memory Circuit",
		polishName: "Obwód pamięci roboczej",
		function: "cognition",
		description:
			"Distributed network maintaining and manipulating information for short-term cognitive tasks",
		polishDescription:
			"Rozproszona sieć utrzymująca i manipulująca informacjami dla krótkoterminowych zadań poznawczych",

		nodes: [
			{
				id: "dlpfc-node",
				regionId: "prefrontal-cortex",
				regionName: "Dorsolateral Prefrontal Cortex",
				polishRegionName: "Grzbietowo-boczna kora przedczołowa",
				position: [0, 1.4, 1.6],
				role: "processing",
				size: 0.8,
				activationLevel: 0.8,
			},
			{
				id: "parietal-node",
				regionId: "parietal-cortex",
				regionName: "Posterior Parietal Cortex",
				polishRegionName: "Tylna kora ciemieniowa",
				position: [0, -0.6, 1.4],
				role: "processing",
				size: 0.6,
				activationLevel: 0.7,
			},
			{
				id: "thalamus-node",
				regionId: "thalamus",
				regionName: "Thalamus",
				polishRegionName: "Wzgórze",
				position: [0, -0.2, 0.8],
				role: "modulatory",
				size: 0.4,
				activationLevel: 0.6,
			},
		],

		connections: [
			{
				id: "dlpfc-parietal",
				fromNode: "dlpfc-node",
				toNode: "parietal-node",
				strength: 0.8,
				type: "excitatory",
				delay: 15,
				plasticity: "hebbian",
			},
			{
				id: "parietal-dlpfc",
				fromNode: "parietal-node",
				toNode: "dlpfc-node",
				strength: 0.6,
				type: "excitatory",
				delay: 20,
				plasticity: "hebbian",
			},
			{
				id: "thalamus-dlpfc",
				fromNode: "thalamus-node",
				toNode: "dlpfc-node",
				strength: 0.5,
				type: "modulatory",
				delay: 10,
				plasticity: "homeostatic",
			},
		],

		activationPattern: "recurrent",
		plasticityLevel: "high",
		modulationFactors: [
			"Dopamine levels",
			"Attention demands",
			"Task difficulty",
			"Working memory load",
		],
		polishModulationFactors: [
			"Poziomy dopaminy",
			"Wymagania uwagi",
			"Trudność zadania",
			"Obciążenie pamięci roboczej",
		],

		associatedDisorders: [
			"Schizophrenia",
			"ADHD",
			"Alzheimer's disease",
			"Depression",
		],
		polishAssociatedDisorders: [
			"Schizofrenia",
			"ADHD",
			"Choroba Alzheimera",
			"Depresja",
		],
		therapeuticTargets: [
			"Prefrontal cortex",
			"Dopamine receptors",
			"Glutamate transmission",
		],
		polishTherapeuticTargets: [
			"Kora przedczołowa",
			"Receptory dopaminowe",
			"Transmisja glutaminianowa",
		],

		visualEffect: {
			nodeColor: "#4F46E5",
			connectionColor: "#6366F1",
			animationSpeed: 1.5,
			showFlow: true,
		},
	},
	{
		id: "hippocampal-memory-circuit",
		name: "Hippocampal Memory Circuit",
		polishName: "Obwód pamięci hipokampalnej",
		function: "memory",
		description:
			"Circuit responsible for memory formation, consolidation, and spatial navigation",
		polishDescription:
			"Obwód odpowiedzialny za tworzenie pamięci, konsolidację i nawigację przestrzenną",

		nodes: [
			{
				id: "entorhinal-node",
				regionId: "entorhinal-cortex",
				regionName: "Entorhinal Cortex",
				polishRegionName: "Kora śródwęchowa",
				position: [1.8, 0.2, -0.2],
				role: "input",
				size: 0.5,
				activationLevel: 0.7,
			},
			{
				id: "hippocampus-node",
				regionId: "hippocampus",
				regionName: "Hippocampus",
				polishRegionName: "Hipokamp",
				position: [1.5, 0, -0.5],
				role: "processing",
				size: 0.6,
				activationLevel: 0.9,
			},
			{
				id: "subiculum-node",
				regionId: "subiculum",
				regionName: "Subiculum",
				polishRegionName: "Podkładka",
				position: [1.2, -0.1, -0.8],
				role: "output",
				size: 0.4,
				activationLevel: 0.6,
			},
		],

		connections: [
			{
				id: "entorhinal-hippocampus",
				fromNode: "entorhinal-node",
				toNode: "hippocampus-node",
				strength: 0.9,
				type: "excitatory",
				delay: 8,
				plasticity: "hebbian",
			},
			{
				id: "hippocampus-subiculum",
				fromNode: "hippocampus-node",
				toNode: "subiculum-node",
				strength: 0.7,
				type: "excitatory",
				delay: 12,
				plasticity: "hebbian",
			},
		],

		activationPattern: "sequential",
		plasticityLevel: "high",
		modulationFactors: [
			"Novelty detection",
			"Emotional significance",
			"Sleep state",
			"Hormonal status",
		],
		polishModulationFactors: [
			"Wykrywanie nowości",
			"Znaczenie emocjonalne",
			"Stan snu",
			"Status hormonalny",
		],

		associatedDisorders: [
			"Alzheimer's disease",
			"PTSD",
			"Temporal lobe epilepsy",
			"Amnesia",
		],
		polishAssociatedDisorders: [
			"Choroba Alzheimera",
			"PTSD",
			"Padaczka płata skroniowego",
			"Amnezja",
		],
		therapeuticTargets: [
			"Neurogenesis",
			"Synaptic plasticity",
			"Glutamate receptors",
		],
		polishTherapeuticTargets: [
			"Neurogeneza",
			"Plastyczność synaptyczna",
			"Receptory glutaminianowe",
		],

		visualEffect: {
			nodeColor: "#F59E0B",
			connectionColor: "#F97316",
			animationSpeed: 1.2,
			showFlow: true,
		},
	},
	{
		id: "attention-network",
		name: "Attention Network",
		polishName: "Sieć uwagi",
		function: "attention",
		description:
			"Network controlling selective attention, vigilance, and executive control",
		polishDescription:
			"Sieć kontrolująca uwagę selektywną, czujność i kontrolę wykonawczą",

		nodes: [
			{
				id: "acc-node",
				regionId: "anterior-cingulate-cortex",
				regionName: "Anterior Cingulate Cortex",
				polishRegionName: "Przednia kora zakrętu obręczy",
				position: [0, 0.8, 0.5],
				role: "processing",
				size: 0.5,
				activationLevel: 0.8,
			},
			{
				id: "parietal-attention-node",
				regionId: "parietal-cortex",
				regionName: "Parietal Attention Areas",
				polishRegionName: "Obszary uwagi ciemieniowej",
				position: [0, -0.8, 1.2],
				role: "processing",
				size: 0.6,
				activationLevel: 0.7,
			},
			{
				id: "brainstem-arousal-node",
				regionId: "brainstem",
				regionName: "Brainstem Arousal Systems",
				polishRegionName: "Układy pobudzania pnia mózgu",
				position: [0, -1.5, -1.0],
				role: "modulatory",
				size: 0.3,
				activationLevel: 0.6,
			},
		],

		connections: [
			{
				id: "acc-parietal",
				fromNode: "acc-node",
				toNode: "parietal-attention-node",
				strength: 0.8,
				type: "excitatory",
				delay: 18,
				plasticity: "hebbian",
			},
			{
				id: "brainstem-acc",
				fromNode: "brainstem-arousal-node",
				toNode: "acc-node",
				strength: 0.6,
				type: "modulatory",
				delay: 25,
				plasticity: "homeostatic",
			},
		],

		activationPattern: "parallel",
		plasticityLevel: "medium",
		modulationFactors: [
			"Alertness level",
			"Task relevance",
			"Motivation",
			"Fatigue",
		],
		polishModulationFactors: [
			"Poziom czujności",
			"Relewancja zadania",
			"Motywacja",
			"Zmęczenie",
		],

		associatedDisorders: [
			"ADHD",
			"Traumatic brain injury",
			"Stroke",
			"Narcolepsy",
		],
		polishAssociatedDisorders: ["ADHD", "Uraz mózgu", "Udar", "Narkolepsja"],
		therapeuticTargets: [
			"Norepinephrine system",
			"Cholinergic system",
			"Frontoparietal networks",
		],
		polishTherapeuticTargets: [
			"Układ noradrenaliny",
			"Układ cholinergiczny",
			"Sieci czołowo-ciemieniowe",
		],

		visualEffect: {
			nodeColor: "#06B6D4",
			connectionColor: "#0891B2",
			animationSpeed: 1.8,
			showFlow: true,
		},
	},
	{
		id: "limbic-mood-circuit",
		name: "Limbic Mood Circuit",
		polishName: "Obwód nastroju limbiczny",
		function: "mood",
		description:
			"Integrated network regulating emotional processing, mood, and affective states",
		polishDescription:
			"Zintegrowana sieć regulująca przetwarzanie emocjonalne, nastrój i stany afektywne",

		nodes: [
			{
				id: "amygdala-node",
				regionId: "amygdala",
				regionName: "Amygdala",
				polishRegionName: "Ciało migdałowate",
				position: [1.2, -0.3, -0.8],
				role: "processing",
				size: 0.4,
				activationLevel: 0.7,
			},
			{
				id: "hippocampus-mood-node",
				regionId: "hippocampus",
				regionName: "Hippocampus",
				polishRegionName: "Hipokamp",
				position: [1.5, 0, -0.5],
				role: "processing",
				size: 0.6,
				activationLevel: 0.6,
			},
			{
				id: "prefrontal-mood-node",
				regionId: "prefrontal-cortex",
				regionName: "Prefrontal Cortex",
				polishRegionName: "Kora przedczołowa",
				position: [0, 1.2, 1.8],
				role: "modulatory",
				size: 0.8,
				activationLevel: 0.5,
			},
		],

		connections: [
			{
				id: "amygdala-hippocampus",
				fromNode: "amygdala-node",
				toNode: "hippocampus-mood-node",
				strength: 0.7,
				type: "excitatory",
				delay: 22,
				plasticity: "hebbian",
			},
			{
				id: "prefrontal-amygdala",
				fromNode: "prefrontal-mood-node",
				toNode: "amygdala-node",
				strength: 0.5,
				type: "inhibitory",
				delay: 35,
				plasticity: "homeostatic",
			},
		],

		activationPattern: "feedback",
		plasticityLevel: "high",
		modulationFactors: [
			"Stress hormones",
			"Social context",
			"Previous experience",
			"Neurotransmitter balance",
		],
		polishModulationFactors: [
			"Hormony stresu",
			"Kontekst społeczny",
			"Poprzednie doświadczenie",
			"Równowaga neuroprzekaźników",
		],

		associatedDisorders: [
			"Major depressive disorder",
			"Bipolar disorder",
			"Anxiety disorders",
			"PTSD",
		],
		polishAssociatedDisorders: [
			"Zaburzenie depresyjne ciężkie",
			"Zaburzenie dwubiegunowe",
			"Zaburzenia lękowe",
			"PTSD",
		],
		therapeuticTargets: [
			"Amygdala hyperactivity",
			"Prefrontal-amygdala connectivity",
			"Serotonin system",
		],
		polishTherapeuticTargets: [
			"Hiperaktywność ciała migdałowatego",
			"Łączność kora przedczołowa-ciało migdałowate",
			"Układ serotoniny",
		],

		visualEffect: {
			nodeColor: "#EF4444",
			connectionColor: "#DC2626",
			animationSpeed: 1.0,
			showFlow: true,
		},
	},
];

export interface NeuralCircuitsVisualizationProps {
	selectedCircuits?: string[];
	showFlow?: boolean;
	animationSpeed?: number;
	onCircuitClick?: (circuitId: string) => void;
	onNodeClick?: (nodeId: string) => void;
	className?: string;
}

// Circuit node component
const CircuitNode: React.FC<{
	node: CircuitNode;
	isSelected: boolean;
	circuitColor: string;
	showFlow: boolean;
	animationSpeed: number;
	onClick: () => void;
}> = ({
	node,
	isSelected,
	circuitColor,
	showFlow,
	animationSpeed,
	onClick,
}) => {
	const meshRef = useRef<Mesh>(null);

	useFrame((state) => {
		if (!meshRef.current) return;

		const time = state.clock.getElapsedTime();

		// Pulsing animation based on activation level
		const pulse = Math.sin(time * animationSpeed * 2) * 0.3 + 0.7;
		const scale = node.size * (1 + pulse * node.activationLevel * 0.2);

		meshRef.current.scale.setScalar(scale);

		// Activation-based color intensity
		if (showFlow) {
			const intensity =
				node.activationLevel *
				(Math.sin(time * animationSpeed * 3) * 0.3 + 0.7);
			meshRef.current.material.emissiveIntensity = intensity;
		}
	});

	return (
		<group position={node.position}>
			<Sphere ref={meshRef} args={[node.size, 16, 16]} onClick={onClick}>
				<meshStandardMaterial
					color={circuitColor}
					emissive={isSelected ? circuitColor : "#000000"}
					emissiveIntensity={isSelected ? 0.3 : 0}
					transparent
					opacity={0.9}
				/>
			</Sphere>

			{/* Node label */}
			<Html position={[0, node.size + 0.2, 0]} center>
				<div
					className={`rounded border px-1 py-0.5 font-medium text-xs shadow-lg backdrop-blur-sm ${
						isSelected ? "border-blue-300 bg-blue-100" : "bg-white/90"
					}`}
				>
					{node.polishRegionName}
				</div>
			</Html>

			{/* Role indicator */}
			<Html position={[0, -node.size - 0.2, 0]} center>
				<Badge variant="outline" className="text-xs">
					{node.role}
				</Badge>
			</Html>
		</group>
	);
};

// Circuit connection component
const CircuitConnection: React.FC<{
	connection: CircuitConnection;
	fromNode: CircuitNode;
	toNode: CircuitNode;
	circuitColor: string;
	showFlow: boolean;
	animationSpeed: number;
}> = ({
	connection,
	fromNode,
	toNode,
	circuitColor,
	showFlow,
	animationSpeed,
}) => {
	const lineRef = useRef<Mesh>(null);

	useFrame((state) => {
		if (!lineRef.current || !showFlow) return;

		const time = state.clock.getElapsedTime();

		// Animate signal propagation
		const signalPosition =
			Math.sin(time * animationSpeed * 2 - connection.delay / 100) * 0.5 + 0.5;
		lineRef.current.material.emissiveIntensity =
			signalPosition * connection.strength;
	});

	// Create connection line points
	const points = [
		fromNode.position,
		[
			(fromNode.position[0] + toNode.position[0]) / 2,
			(fromNode.position[1] + toNode.position[1]) / 2 + 0.2,
			(fromNode.position[2] + toNode.position[2]) / 2,
		] as [number, number, number],
		toNode.position,
	];

	return (
		<group>
			<Line
				ref={lineRef}
				points={points}
				color={circuitColor}
				lineWidth={connection.strength * 0.1}
			/>
		</group>
	);
};

// Main neural circuits visualization
const NeuralCircuitsModel: React.FC<{
	selectedCircuits: string[];
	showFlow: boolean;
	animationSpeed: number;
	onCircuitClick: (circuitId: string) => void;
	onNodeClick: (nodeId: string) => void;
}> = ({
	selectedCircuits,
	showFlow,
	animationSpeed,
	onCircuitClick,
	onNodeClick,
}) => {
	return (
		<>
			{neuralCircuits.map((circuit) => {
				if (!selectedCircuits.includes(circuit.id)) return null;

				return (
					<group key={circuit.id}>
						{/* Render nodes */}
						{circuit.nodes.map((node) => (
							<CircuitNode
								key={node.id}
								node={node}
								isSelected={false}
								circuitColor={circuit.visualEffect.nodeColor}
								showFlow={showFlow}
								animationSpeed={animationSpeed}
								onClick={() => onNodeClick(node.id)}
							/>
						))}

						{/* Render connections */}
						{circuit.connections.map((connection) => {
							const fromNode = circuit.nodes.find(
								(n) => n.id === connection.fromNode,
							);
							const toNode = circuit.nodes.find(
								(n) => n.id === connection.toNode,
							);

							if (!fromNode || !toNode) return null;

							return (
								<CircuitConnection
									key={connection.id}
									connection={connection}
									fromNode={fromNode}
									toNode={toNode}
									circuitColor={circuit.visualEffect.connectionColor}
									showFlow={showFlow}
									animationSpeed={animationSpeed}
								/>
							);
						})}
					</group>
				);
			})}

			{/* Brain outline for reference */}
			<Sphere args={[3.0, 64, 64]} position={[0, 0, 0]}>
				<meshStandardMaterial
					color="#E5E7EB"
					transparent
					opacity={0.03}
					wireframe
				/>
			</Sphere>
		</>
	);
};

const NeuralCircuitsVisualization: React.FC<
	NeuralCircuitsVisualizationProps
> = ({
	selectedCircuits = [],
	showFlow = true,
	animationSpeed = 1,
	onCircuitClick,
	onNodeClick,
	className = "",
}) => {
	const [selectedCircuit, setSelectedCircuit] = useState<string | null>(null);
	const [showControls, setShowControls] = useState(true);
	const [localShowFlow, setLocalShowFlow] = useState(showFlow);
	const [localAnimationSpeed, setLocalAnimationSpeed] =
		useState(animationSpeed);

	const handleCircuitClick = (circuitId: string) => {
		setSelectedCircuit(circuitId);
		onCircuitClick?.(circuitId);
	};

	const selectedCircuitData = selectedCircuit
		? neuralCircuits.find((c) => c.id === selectedCircuit)
		: null;

	return (
		<div className={`relative h-full w-full ${className}`}>
			{/* 3D Canvas */}
			<div className="h-[600px] w-full overflow-hidden rounded-lg bg-gradient-to-b from-slate-50 to-white">
				<Canvas>
					<PerspectiveCamera makeDefault position={[6, 3, 6]} />
					<OrbitControls enablePan enableZoom enableRotate />

					{/* Lighting */}
					<ambientLight intensity={0.6} />
					<directionalLight position={[10, 10, 5]} intensity={1.0} />
					<pointLight position={[-10, -10, -5]} intensity={0.3} />

					{/* Environment */}
					<Environment preset="dawn" />

					{/* Neural circuits model */}
					<Suspense fallback={null}>
						<NeuralCircuitsModel
							selectedCircuits={selectedCircuits}
							showFlow={localShowFlow}
							animationSpeed={localAnimationSpeed}
							onCircuitClick={handleCircuitClick}
							onNodeClick={onNodeClick || (() => {})}
						/>
					</Suspense>

					{/* Ground shadow */}
					<ContactShadows
						position={[0, -4, 0]}
						opacity={0.2}
						scale={15}
						blur={3}
						far={6}
					/>
				</Canvas>
			</div>

			{/* Controls overlay */}
			{showControls && (
				<div className="absolute top-4 left-4 space-y-2">
					<Card className="w-72">
						<CardHeader className="pb-2">
							<CardTitle className="flex items-center gap-2 text-sm">
								<Network className="h-4 w-4" />
								Obwody neuronowe
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3">
							<div className="space-y-1">
								<span className="text-xs">Prędkość animacji</span>
								<Slider
									value={[localAnimationSpeed]}
									onValueChange={([value]) =>
										setLocalAnimationSpeed(value || 1)
									}
									min={0.1}
									max={3}
									step={0.1}
									className="w-full"
								/>
							</div>

							<div className="flex items-center justify-between">
								<span className="text-xs">Pokaż przepływ sygnałów</span>
								<Switch
									checked={localShowFlow}
									onCheckedChange={setLocalShowFlow}
								/>
							</div>
						</CardContent>
					</Card>

					{/* Circuit selector */}
					<Card className="w-72">
						<CardHeader className="pb-2">
							<CardTitle className="text-sm">Dostępne obwody</CardTitle>
						</CardHeader>
						<CardContent className="max-h-48 space-y-2 overflow-y-auto">
							{neuralCircuits.map((circuit) => (
								<Button
									key={circuit.id}
									size="sm"
									variant={
										selectedCircuits.includes(circuit.id)
											? "default"
											: "outline"
									}
									className="h-8 w-full justify-start text-xs"
									onClick={() => handleCircuitClick(circuit.id)}
								>
									<div
										className="mr-2 h-2 w-2 rounded-full"
										style={{ backgroundColor: circuit.visualEffect.nodeColor }}
									/>
									{circuit.polishName}
								</Button>
							))}
						</CardContent>
					</Card>
				</div>
			)}

			{/* Circuit info panel */}
			{selectedCircuitData && (
				<div className="absolute top-4 right-4 w-80">
					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="flex items-center gap-2 text-sm">
								<Brain className="h-4 w-4" />
								{selectedCircuitData.polishName}
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3">
							<div>
								<h4 className="mb-1 font-medium text-xs">Funkcja:</h4>
								<Badge variant="secondary" className="text-xs">
									{selectedCircuitData.function}
								</Badge>
							</div>

							<div>
								<h4 className="mb-1 font-medium text-xs">Opis:</h4>
								<p className="text-gray-600 text-xs">
									{selectedCircuitData.polishDescription}
								</p>
							</div>

							<div>
								<h4 className="mb-1 font-medium text-xs">Wzór aktywacji:</h4>
								<Badge variant="outline" className="text-xs">
									{selectedCircuitData.activationPattern}
								</Badge>
							</div>

							<div>
								<h4 className="mb-1 font-medium text-xs">
									Poziom plastyczności:
								</h4>
								<Badge variant="outline" className="text-xs">
									{selectedCircuitData.plasticityLevel}
								</Badge>
							</div>

							{selectedCircuitData.associatedDisorders.length > 0 && (
								<div>
									<h4 className="mb-1 font-medium text-xs">
										Zaburzenia związane:
									</h4>
									<div className="flex flex-wrap gap-1">
										{selectedCircuitData.polishAssociatedDisorders.map(
											(disorder, index) => (
												<Badge
													key={index}
													variant="destructive"
													className="text-xs"
												>
													{disorder}
												</Badge>
											),
										)}
									</div>
								</div>
							)}

							<div className="text-gray-600 text-xs">
								<strong>Węzły:</strong> {selectedCircuitData.nodes.length}
							</div>

							<div className="text-gray-600 text-xs">
								<strong>Połączenia:</strong>{" "}
								{selectedCircuitData.connections.length}
							</div>
						</CardContent>
					</Card>
				</div>
			)}

			{/* Toggle controls button */}
			<Button
				size="sm"
				variant="outline"
				className="absolute bottom-4 left-4"
				onClick={() => setShowControls(!showControls)}
			>
				{showControls ? (
					<EyeOff className="h-3 w-3" />
				) : (
					<Eye className="h-3 w-3" />
				)}
				{showControls ? "Ukryj" : "Pokaż"} kontrole
			</Button>
		</div>
	);
};

export default NeuralCircuitsVisualization;

// Export circuits data for use in other components
export { neuralCircuits };
