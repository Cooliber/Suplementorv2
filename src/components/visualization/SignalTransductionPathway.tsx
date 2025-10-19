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
	Pause,
	Play,
	RotateCcw,
	Zap,
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

interface SignalTransductionPathwayProps {
	supplementName: string;
	polishSupplementName: string;
	pathwayType:
		| "g-protein"
		| "tyrosine-kinase"
		| "ion-channel"
		| "nuclear-receptor";
	polishPathwayType: string;
	signalStrength: number; // 0-1 scale
	autoPlay?: boolean;
	showMechanism?: boolean;
	className?: string;
}

interface SignalMolecule {
	id: string;
	position: Vector3;
	velocity: Vector3;
	isActive: boolean;
	signalType: "primary" | "secondary" | "cascade";
	color: Color;
	intensity: number;
}

interface Receptor {
	id: string;
	position: Vector3;
	isActivated: boolean;
	activationProgress: number;
	signalOutput: SignalMolecule[];
}

const PATHWAY_TYPES = {
	"g-protein": {
		name: "Białko G",
		description: "Szlak transdukcji sygnału z udziałem białek G",
		color: "#8B5CF6",
		steps: 5,
		complexity: "high",
	},
	"tyrosine-kinase": {
		name: "Kinaza tyrozynowa",
		description: "Aktywacja przez fosforylację reszt tyrozynowych",
		color: "#F59E0B",
		steps: 4,
		complexity: "medium",
	},
	"ion-channel": {
		name: "Kanał jonowy",
		description: "Bezpośrednia zmiana przepuszczalności błony",
		color: "#10B981",
		steps: 2,
		complexity: "low",
	},
	"nuclear-receptor": {
		name: "Receptor jądrowy",
		description: "Bezpośrednia regulacja ekspresji genów",
		color: "#EF4444",
		steps: 6,
		complexity: "high",
	},
};

export const SignalTransductionPathway: React.FC<
	SignalTransductionPathwayProps
> = ({
	supplementName,
	polishSupplementName,
	pathwayType,
	polishPathwayType,
	signalStrength,
	autoPlay = true,
	showMechanism = true,
	className = "",
}) => {
	const [isPlaying, setIsPlaying] = useState(autoPlay);
	const [currentStep, setCurrentStep] = useState(0);
	const [signalProgress, setSignalProgress] = useState(0);
	const animationProgressRef = useRef(0);

	const pathway = PATHWAY_TYPES[pathwayType];

	const steps = [
		{
			name: "Wiązanie liganda",
			description: "Cząsteczka suplementu wiąże się z receptorem",
		},
		{
			name: "Aktywacja receptora",
			description: "Receptor zmienia konformację i aktywuje się",
		},
		{
			name: "Transdukcja sygnału",
			description: "Sygnał jest przekazywany przez cząsteczki pośrednie",
		},
		{
			name: "Amplifikacja",
			description: "Sygnał ulega wzmocnieniu w kaskadzie reakcji",
		},
		{
			name: "Odpowiedź komórkowa",
			description: "Sygnał dociera do efektora i wywołuje odpowiedź",
		},
	];

	return (
		<Card className={`w-full ${className}`}>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Zap className="h-5 w-5" />
					Szlak transdukcji sygnału
				</CardTitle>
				<div className="space-y-1">
					<p className="font-medium text-sm">
						{polishSupplementName} - {polishPathwayType}
					</p>
					<div className="flex items-center gap-2">
						<Badge variant="outline">
							Siła sygnału: {(signalStrength * 100).toFixed(0)}%
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
					<Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
						<SignalTransductionScene
							isPlaying={isPlaying}
							pathwayType={pathwayType}
							signalStrength={signalStrength}
							onStepChange={setCurrentStep}
							onSignalProgress={setSignalProgress}
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
							<div>Krok: {currentStep + 1}/5</div>
							<Progress value={signalProgress} className="h-1 w-24" />
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
							setSignalProgress(0);
							animationProgressRef.current = 0;
						}}
					>
						<RotateCcw className="h-4 w-4" />
					</Button>

					<div className="flex-1">
						<Progress value={signalProgress} className="h-2" />
					</div>

					<Badge variant="outline">{signalProgress.toFixed(0)}%</Badge>
				</div>

				{/* Pathway complexity indicator */}
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm">Złożoność szlaku</CardTitle>
					</CardHeader>
					<CardContent className="pt-0">
						<div className="flex items-center gap-2">
							<div className="flex-1">
								<Progress
									value={
										pathway.complexity === "low"
											? 33
											: pathway.complexity === "medium"
												? 66
												: 100
									}
									className="h-2"
								/>
							</div>
							<Badge
								variant={
									pathway.complexity === "low"
										? "default"
										: pathway.complexity === "medium"
											? "secondary"
											: "destructive"
								}
							>
								{pathway.complexity === "low"
									? "Niska"
									: pathway.complexity === "medium"
										? "Średnia"
										: "Wysoka"}
							</Badge>
						</div>
						<p className="mt-1 text-gray-600 text-xs">
							Liczba kroków: {pathway.steps}
						</p>
					</CardContent>
				</Card>
			</CardContent>
		</Card>
	);
};

// 3D Scene for signal transduction
interface SignalTransductionSceneProps {
	isPlaying: boolean;
	pathwayType: string;
	signalStrength: number;
	onStepChange: (step: number) => void;
	onSignalProgress: (progress: number) => void;
}

const SignalTransductionScene: React.FC<SignalTransductionSceneProps> = ({
	isPlaying,
	pathwayType,
	signalStrength,
	onStepChange,
	onSignalProgress,
}) => {
	const groupRef = useRef<Group>(null);
	const receptorsRef = useRef<Receptor[]>([]);
	const signalMoleculesRef = useRef<SignalMolecule[]>([]);
	const animationProgressRef = useRef(0);

	// Initialize receptors and signal molecules
	const { receptors, signalMolecules } = useMemo(() => {
		const receptors: Receptor[] = [];
		const molecules: SignalMolecule[] = [];

		// Create main receptor
		receptors.push({
			id: "main-receptor",
			position: new Vector3(0, 0, 0),
			isActivated: false,
			activationProgress: 0,
			signalOutput: [],
		});

		// Create signal cascade points
		const cascadePoints = [
			new Vector3(2, 1, 0),
			new Vector3(4, 0.5, 0),
			new Vector3(6, -0.5, 0),
			new Vector3(8, 0, 0),
		];

		cascadePoints.forEach((position, index) => {
			receptors.push({
				id: `cascade-${index}`,
				position,
				isActivated: false,
				activationProgress: 0,
				signalOutput: [],
			});
		});

		// Create initial signal molecules
		for (let i = 0; i < 5; i++) {
			molecules.push({
				id: `signal-${i}`,
				position: new Vector3(
					(Math.random() - 0.5) * 2,
					(Math.random() - 0.5) * 2,
					(Math.random() - 0.5) * 0.5,
				),
				velocity: new Vector3(
					(Math.random() - 0.5) * 0.02,
					(Math.random() - 0.5) * 0.02,
					0,
				),
				isActive: false,
				signalType: "primary",
				color: new Color("#8B5CF6"),
				intensity: 1,
			});
		}

		return { receptors, signalMolecules: molecules };
	}, [pathwayType]);

	// Animation loop
	useFrame((state, delta) => {
		if (!isPlaying) return;

		animationProgressRef.current += delta * 0.6;

		// Update animation steps
		const totalSteps = 5;
		const stepDuration = 3; // seconds per step
		const currentStep =
			Math.floor(animationProgressRef.current / stepDuration) % totalSteps;
		onStepChange(currentStep);

		// Step 1: Ligand binding (0-3s)
		if (animationProgressRef.current < 3) {
			signalMolecules.forEach((molecule) => {
				if (!molecule.isActive) {
					// Move towards receptor
					const direction = receptors[0].position
						.clone()
						.sub(molecule.position)
						.normalize();
					molecule.velocity.lerp(direction.multiplyScalar(0.03), 0.1);
					molecule.position.add(
						molecule.velocity.clone().multiplyScalar(delta * 60),
					);

					// Check if reached receptor
					const distance = molecule.position.distanceTo(receptors[0].position);
					if (distance < 0.3) {
						molecule.isActive = true;
						receptors[0].activationProgress = Math.min(
							1,
							receptors[0].activationProgress + delta * 2,
						);
					}
				}
			});
		}

		// Step 2: Receptor activation (3-6s)
		else if (animationProgressRef.current < 6) {
			if (receptors[0].activationProgress > 0.8) {
				receptors[0].isActivated = true;

				// Create secondary messengers
				if (signalMoleculesRef.current.length < 15) {
					for (let i = 0; i < 3; i++) {
						signalMoleculesRef.current.push({
							id: `secondary-${signalMoleculesRef.current.length}`,
							position: receptors[0].position.clone(),
							velocity: new Vector3(
								(Math.random() - 0.5) * 0.04,
								(Math.random() - 0.5) * 0.04,
								0,
							),
							isActive: true,
							signalType: "secondary",
							color: new Color("#F59E0B"),
							intensity: 0.8,
						});
					}
				}
			}
		}

		// Step 3-4: Signal cascade (6-12s)
		else if (animationProgressRef.current < 12) {
			receptors.slice(1).forEach((receptor, index) => {
				const delay = index * 1.5; // Stagger activation

				if (animationProgressRef.current > 6 + delay) {
					// Find nearby signal molecules
					signalMoleculesRef.current.forEach((molecule) => {
						const distance = molecule.position.distanceTo(receptor.position);
						if (distance < 0.8 && !receptor.isActivated) {
							receptor.activationProgress = Math.min(
								1,
								receptor.activationProgress + delta * 1.5,
							);
							molecule.intensity *= 0.95; // Signal attenuation
						}
					});

					if (receptor.activationProgress > 0.7) {
						receptor.isActivated = true;

						// Create cascade molecules
						if (Math.random() < 0.3) {
							signalMoleculesRef.current.push({
								id: `cascade-${signalMoleculesRef.current.length}`,
								position: receptor.position.clone(),
								velocity: new Vector3(
									(Math.random() - 0.5) * 0.03,
									(Math.random() - 0.5) * 0.03,
									0,
								),
								isActive: true,
								signalType: "cascade",
								color: new Color("#10B981"),
								intensity: 0.6,
							});
						}
					}
				}
			});
		}

		// Step 5: Cellular response (12s+)
		else {
			// Final response visualization
			const activatedReceptors = receptors.filter((r) => r.isActivated).length;
			const totalProgress = (activatedReceptors / receptors.length) * 100;
			onSignalProgress(Math.min(100, totalProgress));
		}

		// Update signal molecule positions
		signalMoleculesRef.current.forEach((molecule) => {
			if (molecule.isActive) {
				molecule.position.add(
					molecule.velocity.clone().multiplyScalar(delta * 60),
				);

				// Fade out over time
				molecule.intensity = Math.max(0, molecule.intensity - delta * 0.5);

				// Remove faded molecules
				if (molecule.intensity < 0.1) {
					const index = signalMoleculesRef.current.indexOf(molecule);
					if (index > -1) {
						signalMoleculesRef.current.splice(index, 1);
					}
				}
			}
		});
	});

	return (
		<group ref={groupRef}>
			{/* Lighting */}
			<ambientLight intensity={0.6} />
			<pointLight position={[10, 10, 10]} intensity={0.8} />
			<pointLight position={[-10, -10, -10]} intensity={0.4} color="#4444ff" />

			{/* Cell membrane background */}
			<mesh position={[4, 0, -1]}>
				<planeGeometry args={[12, 8]} />
				<meshStandardMaterial color="#1F2937" transparent opacity={0.2} />
			</mesh>

			{/* Receptors */}
			{receptors.map((receptor, index) => (
				<ReceptorComponent
					key={receptor.id}
					receptor={receptor}
					pathwayType={pathwayType}
					isFirst={index === 0}
				/>
			))}

			{/* Signal molecules */}
			{signalMoleculesRef.current.map((molecule) => (
				<SignalMoleculeComponent key={molecule.id} molecule={molecule} />
			))}

			{/* Signal flow arrows */}
			<SignalFlowArrows receptors={receptors} />

			{/* Activation effects */}
			<ActivationEffects receptors={receptors} />
		</group>
	);
};

// Receptor component
interface ReceptorComponentProps {
	receptor: Receptor;
	pathwayType: string;
	isFirst: boolean;
}

const ReceptorComponent: React.FC<ReceptorComponentProps> = ({
	receptor,
	pathwayType,
	isFirst,
}) => {
	const meshRef = useRef<Mesh>(null);

	const { scale, color } = useSpring({
		scale: receptor.isActivated ? 1.3 : 1,
		color: receptor.isActivated ? new Color("#F59E0B") : new Color("#6B7280"),
		config: { tension: 300, friction: 50 },
	});

	useFrame(() => {
		if (meshRef.current) {
			meshRef.current.position.copy(receptor.position);
		}
	});

	return (
		<group>
			<animated.mesh ref={meshRef} scale={scale}>
				<boxGeometry args={[0.8, 0.6, 0.2]} />
				<meshStandardMaterial
					color={color}
					emissive={receptor.isActivated ? color.getHex() : 0x000000}
					emissiveIntensity={receptor.isActivated ? 0.4 : 0}
				/>
			</animated.mesh>

			{/* Activation progress ring */}
			{receptor.activationProgress > 0 && (
				<mesh position={receptor.position}>
					<ringGeometry args={[0.5, 0.6, 16]} />
					<meshBasicMaterial
						color="#F59E0B"
						transparent
						opacity={receptor.activationProgress * 0.6}
					/>
				</mesh>
			)}

			{/* Receptor label */}
			<Html
				position={[
					receptor.position.x,
					receptor.position.y + 0.8,
					receptor.position.z,
				]}
			>
				<div className="rounded bg-black/70 px-1 py-0.5 text-white text-xs">
					{isFirst ? "Receptor główny" : `Efektor ${receptor.id.split("-")[1]}`}
				</div>
			</Html>
		</group>
	);
};

// Signal molecule component
interface SignalMoleculeComponentProps {
	molecule: SignalMolecule;
}

const SignalMoleculeComponent: React.FC<SignalMoleculeComponentProps> = ({
	molecule,
}) => {
	const meshRef = useRef<Mesh>(null);

	useFrame(() => {
		if (meshRef.current) {
			meshRef.current.position.copy(molecule.position);
		}
	});

	return (
		<group>
			<mesh ref={meshRef}>
				<sphereGeometry args={[0.06, 8, 8]} />
				<meshStandardMaterial
					color={molecule.color}
					transparent
					opacity={molecule.intensity}
					emissive={molecule.color.getHex()}
					emissiveIntensity={molecule.intensity * 0.5}
				/>
			</mesh>

			{/* Signal trail */}
			<mesh position={molecule.position}>
				<sphereGeometry args={[0.12, 6, 6]} />
				<meshBasicMaterial
					color={molecule.color}
					transparent
					opacity={molecule.intensity * 0.3}
				/>
			</mesh>
		</group>
	);
};

// Signal flow arrows component
interface SignalFlowArrowsProps {
	receptors: Receptor[];
}

const SignalFlowArrows: React.FC<SignalFlowArrowsProps> = ({ receptors }) => {
	return (
		<group>
			{receptors.slice(0, -1).map((receptor, index) => {
				const nextReceptor = receptors[index + 1];
				const midPoint = receptor.position
					.clone()
					.lerp(nextReceptor.position, 0.5);

				return (
					<group key={`arrow-${index}`}>
						{/* Arrow line */}
						<mesh>
							<bufferGeometry>
								<bufferAttribute
									attach="attributes-position"
									count={2}
									array={
										new Float32Array([
											receptor.position.x,
											receptor.position.y,
											receptor.position.z,
											nextReceptor.position.x,
											nextReceptor.position.y,
											nextReceptor.position.z,
										])
									}
									itemSize={3}
								/>
							</bufferGeometry>
							<lineBasicMaterial
								color={receptor.isActivated ? "#F59E0B" : "#6B7280"}
								opacity={receptor.isActivated ? 0.8 : 0.3}
								transparent
							/>
						</mesh>

						{/* Arrow head */}
						{receptor.isActivated && (
							<mesh position={nextReceptor.position}>
								<coneGeometry args={[0.1, 0.2, 8]} />
								<meshBasicMaterial color="#F59E0B" />
							</mesh>
						)}
					</group>
				);
			})}
		</group>
	);
};

// Activation effects component
interface ActivationEffectsProps {
	receptors: Receptor[];
}

const ActivationEffects: React.FC<ActivationEffectsProps> = ({ receptors }) => {
	return (
		<group>
			{receptors
				.filter((r) => r.isActivated)
				.map((receptor) => (
					<group key={`activation-${receptor.id}`}>
						{/* Pulsing effect */}
						<mesh position={receptor.position}>
							<sphereGeometry args={[1, 16, 16]} />
							<meshBasicMaterial color="#F59E0B" transparent opacity={0.2} />
						</mesh>

						{/* Energy particles */}
						{Array.from({ length: 6 }).map((_, i) => {
							const angle = (i / 6) * Math.PI * 2;
							const radius = 0.8;
							const x = receptor.position.x + Math.cos(angle) * radius;
							const y = receptor.position.y + Math.sin(angle) * radius;
							const z =
								receptor.position.z + Math.sin(Date.now() * 0.01 + i) * 0.1;

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
					</group>
				))}
		</group>
	);
};

export default SignalTransductionPathway;
