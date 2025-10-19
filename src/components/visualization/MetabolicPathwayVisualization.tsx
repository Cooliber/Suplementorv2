"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { animated, useSpring } from "@react-spring/three";
import { Html, OrbitControls, Text } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import {
	Activity,
	ArrowRight,
	Cog,
	Pause,
	Play,
	RotateCcw,
} from "lucide-react";
import type React from "react";
import { useMemo, useRef, useState } from "react";
import {
	BufferGeometry,
	Color,
	type Group,
	type Mesh,
	MeshStandardMaterial,
	Vector3,
} from "three";

interface MetabolicPathwayVisualizationProps {
	supplementName: string;
	polishSupplementName: string;
	pathwayType:
		| "energy-production"
		| "neurotransmitter-synthesis"
		| "antioxidant-defense"
		| "detoxification";
	polishPathwayType: string;
	metabolicRate: number; // 0-1 scale
	autoPlay?: boolean;
	showMechanism?: boolean;
	className?: string;
}

interface Enzyme {
	id: string;
	position: Vector3;
	isActive: boolean;
	substrateId?: string;
	productId?: string;
	reactionProgress: number;
	efficiency: number;
	color: Color;
}

interface Metabolite {
	id: string;
	position: Vector3;
	velocity: Vector3;
	type: "substrate" | "product" | "intermediate" | "cofactor";
	isProcessed: boolean;
	targetEnzyme?: string;
	color: Color;
}

const PATHWAY_TYPES = {
	"energy-production": {
		name: "Produkcja energii",
		description: "Synteza ATP i produkcja energii komórkowej",
		color: "#F59E0B",
		enzymes: 4,
		complexity: "medium",
	},
	"neurotransmitter-synthesis": {
		name: "Synteza neuroprzekaźników",
		description: "Produkcja neuroprzekaźników w układzie nerwowym",
		color: "#8B5CF6",
		enzymes: 5,
		complexity: "high",
	},
	"antioxidant-defense": {
		name: "Obrona antyoksydacyjna",
		description: "Neutralizacja wolnych rodników i ochrona komórek",
		color: "#10B981",
		enzymes: 3,
		complexity: "low",
	},
	detoxification: {
		name: "Detoksykacja",
		description: "Usuwanie toksyn i szkodliwych substancji",
		color: "#EF4444",
		enzymes: 6,
		complexity: "high",
	},
};

export const MetabolicPathwayVisualization: React.FC<
	MetabolicPathwayVisualizationProps
> = ({
	supplementName,
	polishSupplementName,
	pathwayType,
	polishPathwayType,
	metabolicRate,
	autoPlay = true,
	showMechanism = true,
	className = "",
}) => {
	const [isPlaying, setIsPlaying] = useState(autoPlay);
	const [currentStep, setCurrentStep] = useState(0);
	const [metabolicProgress, setMetabolicProgress] = useState(0);
	const animationProgressRef = useRef(0);

	const pathway = PATHWAY_TYPES[pathwayType];

	const steps = [
		{
			name: "Wiązanie substratu",
			description: "Substrat wiąże się z enzymem w miejscu aktywnym",
		},
		{
			name: "Kataliza reakcji",
			description: "Enzym katalizuje przemianę substratu w produkt",
		},
		{
			name: "Uwalnianie produktu",
			description: "Produkt jest uwalniany z enzymu",
		},
		{
			name: "Regeneracja enzymu",
			description: "Enzym powraca do stanu aktywnego",
		},
	];

	return (
		<Card className={`w-full ${className}`}>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Cog className="h-5 w-5" />
					Wizualizacja ścieżki metabolicznej
				</CardTitle>
				<div className="space-y-1">
					<p className="font-medium text-sm">
						{polishSupplementName} - {polishPathwayType}
					</p>
					<div className="flex items-center gap-2">
						<Badge variant="outline">
							Tempo metabolizmu: {(metabolicRate * 100).toFixed(0)}%
						</Badge>
						<div
							className="h-3 w-3 rounded-full"
							style={{ backgroundColor: pathway.color }}
						/>
						<Badge variant="secondary">{pathway.name}</Badge>
					</div>
				</div>
			</CardHeader>
			<CardContent className="space-y-4">
				<div
					className="relative overflow-hidden rounded-lg bg-gray-900"
					style={{ height: "400px" }}
				>
					<Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
						<MetabolicPathwayScene
							isPlaying={isPlaying}
							pathwayType={pathwayType}
							metabolicRate={metabolicRate}
							onStepChange={setCurrentStep}
							onMetabolicProgress={setMetabolicProgress}
						/>
						<OrbitControls
							enablePan={true}
							enableZoom={true}
							enableRotate={true}
						/>
					</Canvas>

					{/* Progress overlay */}
					<div className="absolute top-4 left-4 rounded bg-black/70 p-2 text-sm text-white">
						<div className="space-y-1">
							<div>Krok: {currentStep + 1}/4</div>
							<Progress value={metabolicProgress} className="h-1 w-24" />
						</div>
					</div>
				</div>

				{/* Step description */}
				<Card className="bg-blue-50">
					<CardContent className="p-3">
						<div className="flex items-center gap-2">
							<div className="h-2 w-2 rounded-full bg-blue-500" />
							<span className="font-medium text-sm">
								{steps[currentStep]?.name}
							</span>
						</div>
						<p className="mt-1 text-gray-600 text-xs">
							{steps[currentStep]?.description}
						</p>
					</CardContent>
				</Card>

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
							setCurrentStep(0);
							setMetabolicProgress(0);
							animationProgressRef.current = 0;
						}}
					>
						<RotateCcw className="h-4 w-4" />
					</Button>

					<div className="flex-1">
						<Progress value={metabolicProgress} className="h-2" />
					</div>

					<Badge variant="outline">{metabolicProgress.toFixed(0)}%</Badge>
				</div>

				{/* Enzyme efficiency */}
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm">Efektywność enzymów</CardTitle>
					</CardHeader>
					<CardContent className="pt-0">
						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<span className="text-xs">Enzymy aktywne</span>
								<Badge variant="outline">
									{Math.floor(pathway.enzymes * (metabolicRate * 0.8 + 0.2))}
								</Badge>
							</div>
							<Progress value={metabolicRate * 100} className="h-2" />
						</div>
					</CardContent>
				</Card>
			</CardContent>
		</Card>
	);
};

// 3D Scene for metabolic pathway
interface MetabolicPathwaySceneProps {
	isPlaying: boolean;
	pathwayType: string;
	metabolicRate: number;
	onStepChange: (step: number) => void;
	onMetabolicProgress: (progress: number) => void;
}

const MetabolicPathwayScene: React.FC<MetabolicPathwaySceneProps> = ({
	isPlaying,
	pathwayType,
	metabolicRate,
	onStepChange,
	onMetabolicProgress,
}) => {
	const groupRef = useRef<Group>(null);
	const enzymesRef = useRef<Enzyme[]>([]);
	const metabolitesRef = useRef<Metabolite[]>([]);
	const animationProgressRef = useRef(0);

	// Initialize enzymes and metabolites
	const { enzymes, metabolites } = useMemo(() => {
		const enzymes: Enzyme[] = [];
		const metabolites: Metabolite[] = [];

		// Create enzymes in a pathway
		for (let i = 0; i < 4; i++) {
			const x = i * 2 - 3;
			enzymes.push({
				id: `enzyme-${i}`,
				position: new Vector3(x, 0, 0),
				isActive: false,
				reactionProgress: 0,
				efficiency: 0.6 + Math.random() * 0.4,
				color: new Color("#F59E0B"),
			});
		}

		// Create initial substrates
		for (let i = 0; i < 8; i++) {
			metabolites.push({
				id: `substrate-${i}`,
				position: new Vector3(
					(Math.random() - 0.5) * 6,
					(Math.random() - 0.5) * 4,
					(Math.random() - 0.5) * 1,
				),
				velocity: new Vector3(
					(Math.random() - 0.5) * 0.02,
					(Math.random() - 0.5) * 0.02,
					0,
				),
				type: "substrate",
				isProcessed: false,
				color: new Color("#22C55E"),
			});
		}

		return { enzymes, metabolites };
	}, [pathwayType]);

	// Animation loop
	useFrame((state, delta) => {
		if (!isPlaying) return;

		animationProgressRef.current += delta * 0.8;

		// Update animation steps
		const totalSteps = 4;
		const stepDuration = 2.5; // seconds per step
		const currentStep =
			Math.floor(animationProgressRef.current / stepDuration) % totalSteps;
		onStepChange(currentStep);

		metabolites.forEach((metabolite, index) => {
			if (metabolite.isProcessed) return;

			// Step 1: Substrate binding (0-2.5s)
			if (animationProgressRef.current < 2.5) {
				enzymes.forEach((enzyme) => {
					const distance = metabolite.position.distanceTo(enzyme.position);
					if (distance < 0.8 && !enzyme.isActive) {
						// Move towards enzyme
						const direction = enzyme.position
							.clone()
							.sub(metabolite.position)
							.normalize();
						metabolite.velocity.lerp(direction.multiplyScalar(0.03), 0.1);
						metabolite.position.add(
							metabolite.velocity.clone().multiplyScalar(delta * 60),
						);

						// Bind to enzyme
						if (distance < 0.3) {
							metabolite.targetEnzyme = enzyme.id;
							enzyme.isActive = true;
							enzyme.substrateId = metabolite.id;
						}
					}
				});
			}

			// Step 2: Catalysis (2.5-5s)
			else if (animationProgressRef.current < 5) {
				enzymes.forEach((enzyme) => {
					if (enzyme.isActive && enzyme.substrateId === metabolite.id) {
						enzyme.reactionProgress = Math.min(
							1,
							enzyme.reactionProgress + delta * 2 * enzyme.efficiency,
						);

						// Visual feedback during catalysis
						if (Math.sin(animationProgressRef.current * 10) > 0.8) {
							// Enzyme shape change during catalysis
						}
					}
				});
			}

			// Step 3: Product release (5-7.5s)
			else if (animationProgressRef.current < 7.5) {
				enzymes.forEach((enzyme) => {
					if (enzyme.reactionProgress > 0.8) {
						// Create product metabolite
						const productMetabolite: Metabolite = {
							id: `product-${Date.now()}-${Math.random()}`,
							position: enzyme.position.clone(),
							velocity: new Vector3(
								(Math.random() - 0.5) * 0.04,
								(Math.random() - 0.5) * 0.04,
								0,
							),
							type: "product",
							isProcessed: false,
							color: new Color("#3B82F6"),
						};

						metabolitesRef.current.push(productMetabolite);

						// Mark original metabolite as processed
						metabolite.isProcessed = true;
						metabolite.type = "intermediate";

						// Reset enzyme
						enzyme.isActive = false;
						enzyme.reactionProgress = 0;
						enzyme.substrateId = undefined;
					}
				});
			}

			// Step 4: Enzyme regeneration (7.5s+)
			else {
				enzymes.forEach((enzyme) => {
					if (!enzyme.isActive && Math.random() < 0.1) {
						enzyme.efficiency = Math.min(1, enzyme.efficiency + 0.01);
					}
				});

				// Calculate overall progress
				const processedMetabolites = metabolites.filter(
					(m) => m.isProcessed,
				).length;
				const totalProgress = (processedMetabolites / metabolites.length) * 100;
				onMetabolicProgress(Math.min(100, totalProgress));
			}

			// Apply velocity to unprocessed metabolites
			if (!metabolite.isProcessed) {
				metabolite.position.add(
					metabolite.velocity.clone().multiplyScalar(delta * 60),
				);

				// Boundary wrapping
				if (Math.abs(metabolite.position.x) > 4) metabolite.velocity.x *= -1;
				if (Math.abs(metabolite.position.y) > 3) metabolite.velocity.y *= -1;
			}
		});
	});

	return (
		<group ref={groupRef}>
			{/* Lighting */}
			<ambientLight intensity={0.6} />
			<pointLight position={[10, 10, 10]} intensity={0.8} />
			<pointLight position={[-10, -10, -10]} intensity={0.4} color="#4444ff" />

			{/* Mitochondrion/cellular background */}
			<mesh position={[0, 0, -1]}>
				<ellipseCurveGeometry args={[0, 0, 4, 2.5, 0, Math.PI * 2, false, 0]} />
				<meshStandardMaterial color="#1F2937" transparent opacity={0.2} />
			</mesh>

			{/* Enzymes */}
			{enzymes.map((enzyme) => (
				<EnzymeComponent key={enzyme.id} enzyme={enzyme} />
			))}

			{/* Metabolites */}
			{metabolitesRef.current.map((metabolite) => (
				<MetaboliteComponent key={metabolite.id} metabolite={metabolite} />
			))}

			{/* Reaction arrows */}
			<ReactionArrows enzymes={enzymes} />

			{/* Energy effects */}
			<EnergyEffects enzymes={enzymes} />
		</group>
	);
};

// Enzyme component
interface EnzymeComponentProps {
	enzyme: Enzyme;
}

const EnzymeComponent: React.FC<EnzymeComponentProps> = ({ enzyme }) => {
	const meshRef = useRef<Mesh>(null);

	const { scale, color } = useSpring({
		scale: enzyme.isActive ? 1.2 : 1,
		color: enzyme.isActive ? new Color("#F59E0B") : enzyme.color,
		config: { tension: 300, friction: 50 },
	});

	useFrame(() => {
		if (meshRef.current) {
			meshRef.current.position.copy(enzyme.position);
		}
	});

	return (
		<group>
			<animated.mesh ref={meshRef} scale={scale}>
				<boxGeometry args={[0.6, 0.4, 0.3]} />
				<meshStandardMaterial
					color={color}
					emissive={enzyme.isActive ? color.getHex() : 0x000000}
					emissiveIntensity={enzyme.isActive ? 0.3 : 0}
				/>
			</animated.mesh>

			{/* Active site indicator */}
			{enzyme.isActive && (
				<mesh
					position={[
						enzyme.position.x,
						enzyme.position.y,
						enzyme.position.z + 0.2,
					]}
				>
					<sphereGeometry args={[0.15, 8, 8]} />
					<meshBasicMaterial color="#EF4444" transparent opacity={0.7} />
				</mesh>
			)}

			{/* Reaction progress ring */}
			{enzyme.reactionProgress > 0 && (
				<mesh position={enzyme.position}>
					<ringGeometry args={[0.4, 0.5, 16]} />
					<meshBasicMaterial
						color="#F59E0B"
						transparent
						opacity={enzyme.reactionProgress * 0.6}
					/>
				</mesh>
			)}

			{/* Enzyme label */}
			<Html
				position={[
					enzyme.position.x,
					enzyme.position.y + 0.6,
					enzyme.position.z,
				]}
			>
				<div className="rounded bg-black/70 px-1 py-0.5 text-white text-xs">
					Enzym {enzyme.id.split("-")[1]}
				</div>
			</Html>
		</group>
	);
};

// Metabolite component
interface MetaboliteComponentProps {
	metabolite: Metabolite;
}

const MetaboliteComponent: React.FC<MetaboliteComponentProps> = ({
	metabolite,
}) => {
	const meshRef = useRef<Mesh>(null);

	useFrame(() => {
		if (meshRef.current) {
			meshRef.current.position.copy(metabolite.position);
		}
	});

	return (
		<group>
			<mesh ref={meshRef}>
				<sphereGeometry args={[0.08, 8, 8]} />
				<meshStandardMaterial
					color={metabolite.color}
					transparent
					opacity={0.9}
				/>
			</mesh>

			{/* Metabolite label */}
			<Html
				position={[
					metabolite.position.x,
					metabolite.position.y + 0.15,
					metabolite.position.z,
				]}
			>
				<div className="rounded bg-black/70 px-1 py-0.5 text-white text-xs">
					{metabolite.type === "substrate"
						? "Substrat"
						: metabolite.type === "product"
							? "Produkt"
							: "Metabolit"}
				</div>
			</Html>
		</group>
	);
};

// Reaction arrows component
interface ReactionArrowsProps {
	enzymes: Enzyme[];
}

const ReactionArrows: React.FC<ReactionArrowsProps> = ({ enzymes }) => {
	return (
		<group>
			{enzymes.slice(0, -1).map((enzyme, index) => {
				const nextEnzyme = enzymes[index + 1];
				const midPoint = enzyme.position.clone().lerp(nextEnzyme.position, 0.5);

				return (
					<group key={`reaction-${index}`}>
						{/* Reaction arrow */}
						<mesh>
							<bufferGeometry>
								<bufferAttribute
									attach="attributes-position"
									count={2}
									array={
										new Float32Array([
											enzyme.position.x,
											enzyme.position.y,
											enzyme.position.z,
											nextEnzyme.position.x,
											nextEnzyme.position.y,
											nextEnzyme.position.z,
										])
									}
									itemSize={3}
								/>
							</bufferGeometry>
							<lineBasicMaterial
								color={enzyme.isActive ? "#F59E0B" : "#6B7280"}
								opacity={enzyme.isActive ? 0.8 : 0.3}
								transparent
							/>
						</mesh>

						{/* Arrow head */}
						{enzyme.isActive && (
							<mesh position={nextEnzyme.position}>
								<coneGeometry args={[0.08, 0.15, 8]} />
								<meshBasicMaterial color="#F59E0B" />
							</mesh>
						)}
					</group>
				);
			})}
		</group>
	);
};

// Energy effects component
interface EnergyEffectsProps {
	enzymes: Enzyme[];
}

const EnergyEffects: React.FC<EnergyEffectsProps> = ({ enzymes }) => {
	return (
		<group>
			{enzymes
				.filter((e) => e.isActive)
				.map((enzyme) => (
					<group key={`energy-${enzyme.id}`}>
						{/* ATP energy particles */}
						{Array.from({ length: 8 }).map((_, i) => {
							const angle = (i / 8) * Math.PI * 2;
							const radius = 0.6;
							const x = enzyme.position.x + Math.cos(angle) * radius;
							const y = enzyme.position.y + Math.sin(angle) * radius;
							const z =
								enzyme.position.z + Math.sin(Date.now() * 0.02 + i) * 0.2;

							return (
								<mesh key={i} position={[x, y, z]}>
									<sphereGeometry args={[0.02, 6, 6]} />
									<meshBasicMaterial
										color="#F59E0B"
										transparent
										opacity={0.8}
									/>
								</mesh>
							);
						})}

						{/* Heat/energy waves */}
						<mesh position={enzyme.position}>
							<sphereGeometry args={[0.8, 16, 16]} />
							<meshBasicMaterial color="#F59E0B" transparent opacity={0.1} />
						</mesh>
					</group>
				))}
		</group>
	);
};

export default MetabolicPathwayVisualization;
