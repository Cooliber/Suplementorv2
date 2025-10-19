"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { animated, useSpring } from "@react-spring/three";
import { Html, OrbitControls, Text } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Activity, Pause, Play, RotateCcw, Zap } from "lucide-react";
import type React from "react";
import { useMemo, useRef, useState } from "react";
import {
	BufferGeometry,
	Color,
	DoubleSide,
	type Group,
	type Mesh,
	MeshStandardMaterial,
	Vector3,
} from "three";

interface ReceptorBindingAnimationProps {
	supplementName: string;
	polishSupplementName: string;
	receptorType: string;
	polishReceptorType: string;
	bindingAffinity: number; // 0-1 scale
	autoPlay?: boolean;
	showMechanism?: boolean;
	className?: string;
}

interface BindingSite {
	id: string;
	position: Vector3;
	isOccupied: boolean;
	moleculeId?: string;
	bindingStrength: number;
}

interface SupplementMolecule {
	id: string;
	position: Vector3;
	velocity: Vector3;
	isBound: boolean;
	targetSite?: string;
	bindingProgress: number;
	color: Color;
}

export const ReceptorBindingAnimation: React.FC<
	ReceptorBindingAnimationProps
> = ({
	supplementName,
	polishSupplementName,
	receptorType,
	polishReceptorType,
	bindingAffinity,
	autoPlay = true,
	showMechanism = true,
	className = "",
}) => {
	const [isPlaying, setIsPlaying] = useState(autoPlay);
	const [currentStep, setCurrentStep] = useState(0);
	const [bindingProgress, setBindingProgress] = useState(0);
	const animationProgressRef = useRef(0);

	const steps = [
		{
			name: "Dyfuzja",
			description: "Cząsteczki suplementu dyfundują w kierunku receptora",
		},
		{
			name: "Rozpoznanie",
			description: "Cząsteczka rozpoznaje receptor poprzez kształt i ładunek",
		},
		{
			name: "Wiązanie",
			description: "Tworzenie wiązań chemicznych z receptorem",
		},
		{
			name: "Aktywacja",
			description: "Receptor zmienia kształt i aktywuje szlak sygnałowy",
		},
	];

	return (
		<Card className={`w-full ${className}`}>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Zap className="h-5 w-5" />
					Animacja wiązania z receptorem
				</CardTitle>
				<div className="space-y-1">
					<p className="font-medium text-sm">
						{polishSupplementName} → {polishReceptorType}
					</p>
					<div className="flex items-center gap-2">
						<Badge variant="outline">
							Siła wiązania: {(bindingAffinity * 100).toFixed(0)}%
						</Badge>
						<Badge
							variant={
								bindingAffinity > 0.7
									? "default"
									: bindingAffinity > 0.4
										? "secondary"
										: "destructive"
							}
						>
							{bindingAffinity > 0.7
								? "Wysoka"
								: bindingAffinity > 0.4
									? "Średnia"
									: "Niska"}
						</Badge>
					</div>
				</div>
			</CardHeader>
			<CardContent className="space-y-4">
				<div
					className="relative overflow-hidden rounded-lg bg-gray-900"
					style={{ height: "400px" }}
				>
					<Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
						<ReceptorBindingScene
							isPlaying={isPlaying}
							bindingAffinity={bindingAffinity}
							onStepChange={setCurrentStep}
							onBindingProgress={setBindingProgress}
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
							<Progress value={bindingProgress} className="h-1 w-24" />
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
							setBindingProgress(0);
							animationProgressRef.current = 0;
						}}
					>
						<RotateCcw className="h-4 w-4" />
					</Button>

					<div className="flex-1">
						<Progress value={bindingProgress} className="h-2" />
					</div>

					<Badge variant="outline">{bindingProgress.toFixed(0)}%</Badge>
				</div>

				{/* Mechanism explanation */}
				{showMechanism && (
					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm">Mechanizm działania</CardTitle>
						</CardHeader>
						<CardContent className="pt-0">
							<div className="space-y-1 text-gray-600 text-xs">
								<p>
									• Cząsteczki suplementu dyfundują w przestrzeni
									międzykomórkowej
								</p>
								<p>
									• Receptor rozpoznaje cząsteczkę na podstawie kształtu i
									właściwości chemicznych
								</p>
								<p>
									• Tworzą się wiązania wodorowe i hydrofobowe między ligandem a
									receptorem
								</p>
								<p>
									• Zmiana konformacji receptora aktywuje szlak sygnałowy
									wewnątrz komórki
								</p>
							</div>
						</CardContent>
					</Card>
				)}
			</CardContent>
		</Card>
	);
};

// 3D Scene for receptor binding
interface ReceptorBindingSceneProps {
	isPlaying: boolean;
	bindingAffinity: number;
	onStepChange: (step: number) => void;
	onBindingProgress: (progress: number) => void;
}

const ReceptorBindingScene: React.FC<ReceptorBindingSceneProps> = ({
	isPlaying,
	bindingAffinity,
	onStepChange,
	onBindingProgress,
}) => {
	const groupRef = useRef<Group>(null);
	const moleculesRef = useRef<SupplementMolecule[]>([]);
	const bindingSitesRef = useRef<BindingSite[]>([]);
	const animationProgressRef = useRef(0);

	// Initialize binding sites and molecules
	const { molecules, bindingSites } = useMemo(() => {
		const sites: BindingSite[] = [];
		const molecules: SupplementMolecule[] = [];

		// Create receptor structure (simplified as a curved surface)
		for (let i = 0; i < 6; i++) {
			const angle = (i / 6) * Math.PI * 2;
			const radius = 2.5;
			sites.push({
				id: `site-${i}`,
				position: new Vector3(
					Math.cos(angle) * radius,
					Math.sin(angle) * radius,
					0,
				),
				isOccupied: false,
				bindingStrength: Math.random() * 0.4 + 0.6, // 0.6-1.0 range
			});
		}

		// Create supplement molecules
		for (let i = 0; i < 8; i++) {
			molecules.push({
				id: `molecule-${i}`,
				position: new Vector3(
					(Math.random() - 0.5) * 8,
					(Math.random() - 0.5) * 8,
					(Math.random() - 0.5) * 2,
				),
				velocity: new Vector3(
					(Math.random() - 0.5) * 0.01,
					(Math.random() - 0.5) * 0.01,
					0,
				),
				isBound: false,
				bindingProgress: 0,
				color: new Color("#22C55E"),
			});
		}

		return { molecules, bindingSites: sites };
	}, []);

	// Animation loop
	useFrame((state, delta) => {
		if (!isPlaying) return;

		animationProgressRef.current += delta * 0.5;

		// Update animation steps
		const totalSteps = 4;
		const stepDuration = 3; // seconds per step
		const currentStep =
			Math.floor(animationProgressRef.current / stepDuration) % totalSteps;
		onStepChange(currentStep);

		molecules.forEach((molecule, index) => {
			if (molecule.isBound) return;

			// Step 1: Diffusion (0-3s)
			if (animationProgressRef.current < 3) {
				molecule.velocity.add(
					new Vector3(
						(Math.random() - 0.5) * 0.005,
						(Math.random() - 0.5) * 0.005,
						0,
					),
				);
				molecule.position.add(
					molecule.velocity.clone().multiplyScalar(delta * 60),
				);
			}

			// Step 2: Recognition (3-6s)
			else if (animationProgressRef.current < 6) {
				// Move towards nearest binding site
				let nearestSite = bindingSites[0];
				let nearestDistance = Number.POSITIVE_INFINITY;

				bindingSites.forEach((site) => {
					const distance = molecule.position.distanceTo(site.position);
					if (distance < nearestDistance) {
						nearestDistance = distance;
						nearestSite = site;
					}
				});

				if (nearestDistance < 1.5) {
					const direction = nearestSite.position
						.clone()
						.sub(molecule.position)
						.normalize();
					molecule.velocity.lerp(direction.multiplyScalar(0.02), 0.1);
					molecule.position.add(
						molecule.velocity.clone().multiplyScalar(delta * 60),
					);
				}
			}

			// Step 3: Binding (6-9s)
			else if (animationProgressRef.current < 9) {
				bindingSites.forEach((site) => {
					const distance = molecule.position.distanceTo(site.position);
					if (distance < 0.3 && !site.isOccupied) {
						molecule.bindingProgress = Math.min(
							1,
							molecule.bindingProgress + delta * 2,
						);
						molecule.position.lerp(site.position, delta * 3);

						if (molecule.bindingProgress > 0.8) {
							molecule.isBound = true;
							site.isOccupied = true;
							molecule.targetSite = site.id;
						}
					}
				});
			}

			// Step 4: Activation (9-12s)
			else {
				if (molecule.isBound) {
					molecule.bindingProgress = Math.min(
						1,
						molecule.bindingProgress + delta * 0.5,
					);
				}
			}

			// Boundary wrapping
			if (Math.abs(molecule.position.x) > 5) molecule.velocity.x *= -0.5;
			if (Math.abs(molecule.position.y) > 5) molecule.velocity.y *= -0.5;
		});

		// Calculate overall binding progress
		const boundMolecules = molecules.filter((m) => m.isBound).length;
		const totalProgress = (boundMolecules / molecules.length) * 100;
		onBindingProgress(Math.min(100, totalProgress));
	});

	return (
		<group ref={groupRef}>
			{/* Lighting */}
			<ambientLight intensity={0.6} />
			<pointLight position={[10, 10, 10]} intensity={0.8} />
			<pointLight position={[-10, -10, -10]} intensity={0.4} color="#4444ff" />

			{/* Receptor surface */}
			<ReceptorSurface bindingSites={bindingSites} />

			{/* Supplement molecules */}
			{molecules.map((molecule) => (
				<SupplementMoleculeComponent key={molecule.id} molecule={molecule} />
			))}

			{/* Binding effects */}
			<BindingEffects molecules={molecules} bindingSites={bindingSites} />

			{/* Activation effects */}
			<ActivationEffects molecules={molecules} />
		</group>
	);
};

// Receptor surface component
interface ReceptorSurfaceProps {
	bindingSites: BindingSite[];
}

const ReceptorSurface: React.FC<ReceptorSurfaceProps> = ({ bindingSites }) => {
	return (
		<group>
			{/* Main receptor body */}
			<mesh position={[0, 0, -0.1]}>
				<sphereGeometry
					args={[2.8, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.6]}
				/>
				<meshStandardMaterial
					color="#1F2937"
					transparent
					opacity={0.3}
					side={DoubleSide}
				/>
			</mesh>

			{/* Binding sites */}
			{bindingSites.map((site) => (
				<group key={site.id} position={site.position}>
					<mesh>
						<cylinderGeometry args={[0.2, 0.2, 0.1, 16]} />
						<meshStandardMaterial
							color={site.isOccupied ? "#F59E0B" : "#EF4444"}
							emissive={site.isOccupied ? "#F59E0B" : "#EF4444"}
							emissiveIntensity={site.isOccupied ? 0.3 : 0.1}
						/>
					</mesh>

					{/* Binding site label */}
					<Html position={[0, 0, 0.3]}>
						<div className="rounded bg-black/70 px-1 py-0.5 text-white text-xs">
							Miejsce wiązania
						</div>
					</Html>
				</group>
			))}

			{/* Receptor label */}
			<Html position={[0, 3, 0]}>
				<div className="rounded bg-black/70 px-2 py-1 text-sm text-white">
					Receptor
				</div>
			</Html>
		</group>
	);
};

// Supplement molecule component
interface SupplementMoleculeComponentProps {
	molecule: SupplementMolecule;
}

const SupplementMoleculeComponent: React.FC<
	SupplementMoleculeComponentProps
> = ({ molecule }) => {
	const meshRef = useRef<Mesh>(null);

	const { scale, color } = useSpring({
		scale:
			molecule.bindingProgress > 0 ? 1 + molecule.bindingProgress * 0.3 : 1,
		color: molecule.isBound
			? new Color().lerpColors(
					molecule.color,
					new Color("#F59E0B"),
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
				<sphereGeometry args={[0.12, 16, 16]} />
				<meshStandardMaterial
					color={color}
					transparent
					opacity={0.9}
					emissive={molecule.isBound ? color.getHex() : 0x000000}
					emissiveIntensity={molecule.isBound ? 0.2 : 0}
				/>
			</animated.mesh>

			{/* Binding progress ring */}
			{molecule.bindingProgress > 0 && !molecule.isBound && (
				<mesh position={molecule.position}>
					<ringGeometry args={[0.15, 0.2, 16]} />
					<meshBasicMaterial
						color="#F59E0B"
						transparent
						opacity={molecule.bindingProgress * 0.6}
					/>
				</mesh>
			)}

			{/* Molecule label */}
			<Html
				position={[
					molecule.position.x,
					molecule.position.y + 0.2,
					molecule.position.z,
				]}
			>
				<div className="whitespace-nowrap rounded bg-black/70 px-1 py-0.5 text-white text-xs">
					Cząsteczka suplementu
				</div>
			</Html>
		</group>
	);
};

// Binding effects component
interface BindingEffectsProps {
	molecules: SupplementMolecule[];
	bindingSites: BindingSite[];
}

const BindingEffects: React.FC<BindingEffectsProps> = ({
	molecules,
	bindingSites,
}) => {
	return (
		<group>
			{molecules
				.filter((m) => m.isBound)
				.map((molecule) => {
					const site = bindingSites.find((s) => s.id === molecule.targetSite);
					if (!site) return null;

					return (
						<group key={`binding-${molecule.id}`}>
							{/* Energy particles */}
							{Array.from({ length: 8 }).map((_, i) => {
								const angle = (i / 8) * Math.PI * 2;
								const radius = 0.5;
								const x = site.position.x + Math.cos(angle) * radius;
								const y = site.position.y + Math.sin(angle) * radius;
								const z = site.position.z + (Math.random() - 0.5) * 0.2;

								return (
									<mesh key={i} position={[x, y, z]}>
										<sphereGeometry args={[0.02, 8, 8]} />
										<meshBasicMaterial
											color="#F59E0B"
											transparent
											opacity={0.8}
										/>
									</mesh>
								);
							})}

							{/* Connection line */}
							<mesh>
								<bufferGeometry>
									<bufferAttribute
										attach="attributes-position"
										count={2}
										array={
											new Float32Array([
												molecule.position.x,
												molecule.position.y,
												molecule.position.z,
												site.position.x,
												site.position.y,
												site.position.z,
											])
										}
										itemSize={3}
									/>
								</bufferGeometry>
								<lineBasicMaterial color="#F59E0B" opacity={0.6} transparent />
							</mesh>
						</group>
					);
				})}
		</group>
	);
};

// Activation effects component
interface ActivationEffectsProps {
	molecules: SupplementMolecule[];
}

const ActivationEffects: React.FC<ActivationEffectsProps> = ({ molecules }) => {
	const activatedMolecules = molecules.filter(
		(m) => m.isBound && m.bindingProgress > 0.9,
	);

	return (
		<group>
			{activatedMolecules.map((molecule) => (
				<group key={`activation-${molecule.id}`}>
					{/* Pulsing effect */}
					<mesh position={molecule.position}>
						<sphereGeometry args={[0.3, 16, 16]} />
						<meshBasicMaterial color="#10B981" transparent opacity={0.2} />
					</mesh>

					{/* Signal propagation */}
					<mesh
						position={[
							molecule.position.x + 1,
							molecule.position.y,
							molecule.position.z,
						]}
					>
						<sphereGeometry args={[0.05, 8, 8]} />
						<meshBasicMaterial color="#10B981" transparent opacity={0.8} />
					</mesh>
				</group>
			))}
		</group>
	);
};

export default ReceptorBindingAnimation;
