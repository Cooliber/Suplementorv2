"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { animated, useSpring } from "@react-spring/three";
import { Box, Html, OrbitControls, Sphere, Text } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
	Activity,
	Eye,
	EyeOff,
	Pause,
	Play,
	RotateCcw,
	Zap,
} from "lucide-react";
import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
	BufferGeometry,
	Color,
	type Group,
	type Mesh,
	MeshBasicMaterial,
	Vector3,
} from "three";

interface MolecularInteractionVisualizerProps {
	supplementId: string;
	interactionType?:
		| "receptor-binding"
		| "cellular-uptake"
		| "signal-transduction"
		| "metabolic-pathway";
	autoPlay?: boolean;
	showControls?: boolean;
	className?: string;
}

interface Molecule {
	id: string;
	position: Vector3;
	velocity: Vector3;
	type: "supplement" | "receptor" | "enzyme" | "metabolite";
	color: Color;
	size: number;
	active: boolean;
	targetPosition?: Vector3;
	bindingProgress: number;
}

interface InteractionConfig {
	moleculeCount: number;
	receptorCount: number;
	animationSpeed: number;
	bindingStrength: number;
	showTrails: boolean;
	showLabels: boolean;
}

// Molecular interaction configurations for different supplement types
const SUPPLEMENT_INTERACTIONS = {
	creatine: {
		name: "Kreatyna",
		polishName: "Kreatyna",
		mechanism: "Zwiększa fosfokreatynę w mięśniach",
		interactionType: "cellular-uptake" as const,
		config: {
			moleculeCount: 15,
			receptorCount: 8,
			animationSpeed: 1.2,
			bindingStrength: 0.8,
			showTrails: true,
			showLabels: true,
		},
	},
	"coenzyme-q10": {
		name: "Koenzym Q10",
		polishName: "Koenzym Q10",
		mechanism: "Poprawia produkcję energii mitochondrialnej",
		interactionType: "metabolic-pathway" as const,
		config: {
			moleculeCount: 20,
			receptorCount: 12,
			animationSpeed: 0.8,
			bindingStrength: 0.9,
			showTrails: true,
			showLabels: true,
		},
	},
	"l-theanine": {
		name: "L-Teanina",
		polishName: "L-Teanina",
		mechanism: "Moduluje aktywność neuroprzekaźników",
		interactionType: "receptor-binding" as const,
		config: {
			moleculeCount: 10,
			receptorCount: 6,
			animationSpeed: 0.6,
			bindingStrength: 0.7,
			showTrails: false,
			showLabels: true,
		},
	},
} as const;

export const MolecularInteractionVisualizer: React.FC<
	MolecularInteractionVisualizerProps
> = ({
	supplementId,
	interactionType,
	autoPlay = true,
	showControls = true,
	className = "",
}) => {
	const [isPlaying, setIsPlaying] = useState(autoPlay);
	const [animationSpeed, setAnimationSpeed] = useState(1);
	const [showTrails, setShowTrails] = useState(true);
	const [showLabels, setShowLabels] = useState(true);
	const [currentStep, setCurrentStep] = useState(0);

	const supplementConfig =
		SUPPLEMENT_INTERACTIONS[
			supplementId as keyof typeof SUPPLEMENT_INTERACTIONS
		];

	if (!supplementConfig) {
		return (
			<Card className={className}>
				<CardContent className="p-6 text-center">
					<p className="text-gray-500">
						Brak konfiguracji wizualizacji dla tego suplementu
					</p>
				</CardContent>
			</Card>
		);
	}

	const config: InteractionConfig = {
		...supplementConfig.config,
		animationSpeed: supplementConfig.config.animationSpeed * animationSpeed,
	};

	return (
		<Card className={`w-full ${className}`}>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Activity className="h-5 w-5" />
					Wizualizacja interakcji molekularnych: {supplementConfig.polishName}
				</CardTitle>
				<p className="text-gray-600 text-sm">{supplementConfig.mechanism}</p>
			</CardHeader>
			<CardContent className="space-y-4">
				<div
					className="relative overflow-hidden rounded-lg bg-gray-900"
					style={{ height: "400px" }}
				>
					<Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
						<MolecularScene
							config={config}
							isPlaying={isPlaying}
							supplementId={supplementId}
							showTrails={showTrails}
							showLabels={showLabels}
							onStepChange={setCurrentStep}
						/>
						<OrbitControls
							enablePan={true}
							enableZoom={true}
							enableRotate={true}
						/>
					</Canvas>

					{/* Step indicator overlay */}
					<div className="absolute top-4 left-4 rounded bg-black/70 p-2 text-sm text-white">
						Krok: {currentStep + 1}
					</div>
				</div>

				{showControls && (
					<div className="space-y-4">
						{/* Playback controls */}
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
								onClick={() => setCurrentStep(0)}
							>
								<RotateCcw className="h-4 w-4" />
							</Button>

							<div className="flex-1">
								<Slider
									value={[animationSpeed]}
									onValueChange={([value]) => setAnimationSpeed(value || 1)}
									min={0.1}
									max={3}
									step={0.1}
									className="w-full"
								/>
							</div>

							<Badge variant="outline">{animationSpeed.toFixed(1)}x</Badge>
						</div>

						{/* Display controls */}
						<div className="flex items-center gap-4">
							<label className="flex items-center gap-2 text-sm">
								<input
									type="checkbox"
									checked={showTrails}
									onChange={(e) => setShowTrails(e.target.checked)}
									className="rounded"
								/>
								Ślady cząsteczek
							</label>

							<label className="flex items-center gap-2 text-sm">
								<input
									type="checkbox"
									checked={showLabels}
									onChange={(e) => setShowLabels(e.target.checked)}
									className="rounded"
								/>
								Etykiety
							</label>
						</div>

						{/* Interaction type tabs */}
						<Tabs
							defaultValue={interactionType || supplementConfig.interactionType}
						>
							<TabsList className="grid w-full grid-cols-4">
								<TabsTrigger value="receptor-binding">
									Wiązanie z receptorem
								</TabsTrigger>
								<TabsTrigger value="cellular-uptake">
									Wchłanianie komórkowe
								</TabsTrigger>
								<TabsTrigger value="signal-transduction">
									Transdukcja sygnału
								</TabsTrigger>
								<TabsTrigger value="metabolic-pathway">
									Ścieżka metaboliczna
								</TabsTrigger>
							</TabsList>
						</Tabs>
					</div>
				)}
			</CardContent>
		</Card>
	);
};

// Main 3D scene component
interface MolecularSceneProps {
	config: InteractionConfig;
	isPlaying: boolean;
	supplementId: string;
	showTrails: boolean;
	showLabels: boolean;
	onStepChange: (step: number) => void;
}

const MolecularScene: React.FC<MolecularSceneProps> = ({
	config,
	isPlaying,
	supplementId,
	showTrails,
	showLabels,
	onStepChange,
}) => {
	const groupRef = useRef<Group>(null);
	const moleculesRef = useRef<Molecule[]>([]);
	const animationProgressRef = useRef(0);

	// Initialize molecules
	const molecules = useMemo(() => {
		const newMolecules: Molecule[] = [];

		// Add supplement molecules
		for (let i = 0; i < config.moleculeCount; i++) {
			newMolecules.push({
				id: `molecule-${i}`,
				position: new Vector3(
					(Math.random() - 0.5) * 6,
					(Math.random() - 0.5) * 6,
					(Math.random() - 0.5) * 2,
				),
				velocity: new Vector3(
					(Math.random() - 0.5) * 0.02,
					(Math.random() - 0.5) * 0.02,
					0,
				),
				type: "supplement",
				color: new Color("#22C55E"), // Green for supplements
				size: 0.1,
				active: true,
				bindingProgress: 0,
			});
		}

		// Add receptors
		for (let i = 0; i < config.receptorCount; i++) {
			const angle = (i / config.receptorCount) * Math.PI * 2;
			const radius = 3;
			newMolecules.push({
				id: `receptor-${i}`,
				position: new Vector3(
					Math.cos(angle) * radius,
					Math.sin(angle) * radius,
					0,
				),
				velocity: new Vector3(0, 0, 0),
				type: "receptor",
				color: new Color("#EF4444"), // Red for receptors
				size: 0.15,
				active: true,
				bindingProgress: 0,
			});
		}

		return newMolecules;
	}, [config]);

	// Animation loop
	useFrame((state, delta) => {
		if (!isPlaying || !groupRef.current) return;

		animationProgressRef.current += delta * config.animationSpeed;

		// Update molecule positions and interactions
		molecules.forEach((molecule, index) => {
			if (molecule.type === "supplement") {
				// Move supplement molecules
				molecule.position.add(
					molecule.velocity.clone().multiplyScalar(delta * 60),
				);

				// Check for receptor binding
				molecules.forEach((otherMolecule) => {
					if (otherMolecule.type === "receptor") {
						const distance = molecule.position.distanceTo(
							otherMolecule.position,
						);
						if (distance < 0.5 && molecule.bindingProgress < 1) {
							molecule.bindingProgress = Math.min(
								1,
								molecule.bindingProgress + delta * 2,
							);
							molecule.velocity.multiplyScalar(0.9); // Slow down when binding
						}
					}
				});

				// Boundary wrapping
				if (Math.abs(molecule.position.x) > 4) molecule.velocity.x *= -1;
				if (Math.abs(molecule.position.y) > 4) molecule.velocity.y *= -1;
			}
		});

		// Update step based on animation progress
		const steps = 4;
		const currentStep = Math.floor(
			(animationProgressRef.current % (steps * 2)) / 2,
		);
		onStepChange(currentStep);
	});

	return (
		<group ref={groupRef}>
			{/* Lighting */}
			<ambientLight intensity={0.6} />
			<pointLight position={[10, 10, 10]} intensity={0.8} />
			<pointLight position={[-10, -10, -10]} intensity={0.4} color="#4444ff" />

			{/* Molecules */}
			{molecules.map((molecule) => (
				<MoleculeComponent
					key={molecule.id}
					molecule={molecule}
					showLabel={showLabels}
				/>
			))}

			{/* Interaction effects */}
			{isPlaying && showTrails && <InteractionTrails molecules={molecules} />}

			{/* Background grid */}
			<gridHelper args={[10, 20]} />
		</group>
	);
};

// Individual molecule component
interface MoleculeComponentProps {
	molecule: Molecule;
	showLabel: boolean;
}

const MoleculeComponent: React.FC<MoleculeComponentProps> = ({
	molecule,
	showLabel,
}) => {
	const meshRef = useRef<Mesh>(null);

	// Animate binding progress
	const { scale, color } = useSpring({
		scale:
			molecule.bindingProgress > 0 ? 1 + molecule.bindingProgress * 0.5 : 1,
		color:
			molecule.bindingProgress > 0
				? new Color().lerpColors(
						molecule.color,
						new Color("#FFD700"),
						molecule.bindingProgress,
					)
				: molecule.color,
		config: { tension: 300, friction: 50 },
	});

	useFrame(() => {
		if (meshRef.current) {
			meshRef.current.position.copy(molecule.position);
		}
	});

	return (
		<group>
			<animated.mesh ref={meshRef} scale={scale}>
				<sphereGeometry args={[molecule.size, 16, 16]} />
				<meshStandardMaterial
					color={color}
					transparent
					opacity={0.8}
					emissive={molecule.bindingProgress > 0 ? color.getHex() : 0x000000}
					emissiveIntensity={molecule.bindingProgress * 0.3}
				/>
			</animated.mesh>

			{showLabel && (
				<Html
					position={[
						molecule.position.x,
						molecule.position.y + 0.3,
						molecule.position.z,
					]}
				>
					<div className="whitespace-nowrap rounded bg-black/70 px-1 py-0.5 text-white text-xs">
						{molecule.type === "supplement" ? "Suplement" : "Receptor"}
					</div>
				</Html>
			)}

			{/* Binding effect */}
			{molecule.bindingProgress > 0 && (
				<mesh position={molecule.position}>
					<ringGeometry args={[molecule.size * 1.2, molecule.size * 1.5, 16]} />
					<meshBasicMaterial
						color={new Color("#FFD700")}
						transparent
						opacity={molecule.bindingProgress * 0.5}
					/>
				</mesh>
			)}
		</group>
	);
};

// Interaction trails component
interface InteractionTrailsProps {
	molecules: Molecule[];
}

const InteractionTrails: React.FC<InteractionTrailsProps> = ({ molecules }) => {
	const trailsRef = useRef<{ [key: string]: Vector3[] }>({});

	useFrame(() => {
		molecules.forEach((molecule) => {
			if (molecule.type === "supplement") {
				if (!trailsRef.current[molecule.id]) {
					trailsRef.current[molecule.id] = [];
				}

				trailsRef.current[molecule.id].push(molecule.position.clone());

				// Keep only last 20 positions for trail
				if (trailsRef.current[molecule.id].length > 20) {
					trailsRef.current[molecule.id].shift();
				}
			}
		});
	});

	return (
		<group>
			{molecules
				.filter((m) => m.type === "supplement")
				.map((molecule) => {
					const trail = trailsRef.current[molecule.id];
					if (!trail || trail.length < 2) return null;

					return (
						<group key={`trail-${molecule.id}`}>
							{trail.slice(0, -1).map((position, index) => {
								const nextPosition = trail[index + 1];
								const alpha = index / trail.length;

								return (
									<mesh key={index} position={position}>
										<sphereGeometry args={[0.02, 8, 8]} />
										<meshBasicMaterial
											color={molecule.color}
											transparent
											opacity={alpha * 0.3}
										/>
									</mesh>
								);
							})}
						</group>
					);
				})}
		</group>
	);
};

export default MolecularInteractionVisualizer;
