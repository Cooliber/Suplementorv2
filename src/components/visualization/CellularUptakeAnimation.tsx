"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { animated, useSpring } from "@react-spring/three";
import { Html, OrbitControls, Text } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import {
	Activity,
	ArrowRight,
	Droplets,
	Pause,
	Play,
	RotateCcw,
} from "lucide-react";
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

interface CellularUptakeAnimationProps {
	supplementName: string;
	polishSupplementName: string;
	uptakeMechanism:
		| "passive-diffusion"
		| "facilitated-transport"
		| "active-transport"
		| "endocytosis";
	polishUptakeMechanism: string;
	absorptionRate: number; // 0-1 scale
	autoPlay?: boolean;
	showMechanism?: boolean;
	className?: string;
}

interface TransportProtein {
	id: string;
	position: Vector3;
	isActive: boolean;
	moleculeId?: string;
	transportProgress: number;
	type: "channel" | "carrier" | "pump";
}

interface SupplementMolecule {
	id: string;
	position: Vector3;
	velocity: Vector3;
	isAbsorbed: boolean;
	isInsideCell: boolean;
	targetProtein?: string;
	absorptionProgress: number;
	color: Color;
}

const UPTAKE_MECHANISMS = {
	"passive-diffusion": {
		name: "Dyfuzja pasywna",
		description:
			"Cząsteczki przechodzą przez błonę komórkową wzdłuż gradientu stężenia",
		color: "#22C55E",
		requiresProtein: false,
	},
	"facilitated-transport": {
		name: "Transport ułatwiony",
		description:
			"Białka transportowe ułatwiają przejście cząsteczek przez błonę",
		color: "#3B82F6",
		requiresProtein: true,
	},
	"active-transport": {
		name: "Transport aktywny",
		description: "Przeciwko gradientowi stężenia, wymaga energii ATP",
		color: "#F59E0B",
		requiresProtein: true,
	},
	endocytosis: {
		name: "Endocytoza",
		description: "Komórka pochłania cząsteczki poprzez tworzenie pęcherzyków",
		color: "#EF4444",
		requiresProtein: true,
	},
};

export const CellularUptakeAnimation: React.FC<
	CellularUptakeAnimationProps
> = ({
	supplementName,
	polishSupplementName,
	uptakeMechanism,
	polishUptakeMechanism,
	absorptionRate,
	autoPlay = true,
	showMechanism = true,
	className = "",
}) => {
	const [isPlaying, setIsPlaying] = useState(autoPlay);
	const [currentStep, setCurrentStep] = useState(0);
	const [absorptionProgress, setAbsorptionProgress] = useState(0);
	const animationProgressRef = useRef(0);

	const mechanism = UPTAKE_MECHANISMS[uptakeMechanism];

	const steps = [
		{
			name: "Kontakt z błoną",
			description: "Cząsteczka suplementu dociera do błony komórkowej",
		},
		{
			name: "Rozpoznanie",
			description: "Błona rozpoznaje cząsteczkę jako substancję do wchłonięcia",
		},
		{
			name: "Transport",
			description: "Cząsteczka jest transportowana przez błonę komórkową",
		},
		{
			name: "Wewnątrz komórki",
			description: "Cząsteczka dociera do wnętrza komórki",
		},
	];

	return (
		<Card className={`w-full ${className}`}>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Droplets className="h-5 w-5" />
					Animacja wchłaniania komórkowego
				</CardTitle>
				<div className="space-y-1">
					<p className="font-medium text-sm">
						{polishSupplementName} - {polishUptakeMechanism}
					</p>
					<div className="flex items-center gap-2">
						<Badge variant="outline">
							Tempo wchłaniania: {(absorptionRate * 100).toFixed(0)}%
						</Badge>
						<div
							className="h-3 w-3 rounded-full"
							style={{ backgroundColor: mechanism.color }}
						/>
						<Badge variant="secondary">{mechanism.name}</Badge>
					</div>
				</div>
			</CardHeader>
			<CardContent className="space-y-4">
				<div
					className="relative overflow-hidden rounded-lg bg-gray-900"
					style={{ height: "400px" }}
				>
					<Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
						<CellularUptakeScene
							isPlaying={isPlaying}
							uptakeMechanism={uptakeMechanism}
							absorptionRate={absorptionRate}
							onStepChange={setCurrentStep}
							onAbsorptionProgress={setAbsorptionProgress}
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
							<Progress value={absorptionProgress} className="h-1 w-24" />
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
							setAbsorptionProgress(0);
							animationProgressRef.current = 0;
						}}
					>
						<RotateCcw className="h-4 w-4" />
					</Button>

					<div className="flex-1">
						<Progress value={absorptionProgress} className="h-2" />
					</div>

					<Badge variant="outline">{absorptionProgress.toFixed(0)}%</Badge>
				</div>

				{/* Mechanism details */}
				{showMechanism && (
					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm">Szczegóły mechanizmu</CardTitle>
						</CardHeader>
						<CardContent className="pt-0">
							<div className="space-y-1 text-gray-600 text-xs">
								<p className="font-medium" style={{ color: mechanism.color }}>
									{mechanism.name}
								</p>
								<p>{mechanism.description}</p>
								<div className="mt-2 flex items-center gap-2">
									<span>Białka transportowe:</span>
									<Badge
										variant={
											mechanism.requiresProtein ? "default" : "secondary"
										}
									>
										{mechanism.requiresProtein ? "Wymagane" : "Nie wymagane"}
									</Badge>
								</div>
							</div>
						</CardContent>
					</Card>
				)}
			</CardContent>
		</Card>
	);
};

// 3D Scene for cellular uptake
interface CellularUptakeSceneProps {
	isPlaying: boolean;
	uptakeMechanism: string;
	absorptionRate: number;
	onStepChange: (step: number) => void;
	onAbsorptionProgress: (progress: number) => void;
}

const CellularUptakeScene: React.FC<CellularUptakeSceneProps> = ({
	isPlaying,
	uptakeMechanism,
	absorptionRate,
	onStepChange,
	onAbsorptionProgress,
}) => {
	const groupRef = useRef<Group>(null);
	const moleculesRef = useRef<SupplementMolecule[]>([]);
	const proteinsRef = useRef<TransportProtein[]>([]);
	const animationProgressRef = useRef(0);

	// Initialize molecules and transport proteins
	const { molecules, transportProteins } = useMemo(() => {
		const molecules: SupplementMolecule[] = [];
		const proteins: TransportProtein[] = [];

		// Create cell membrane (phospholipid bilayer)
		const membraneRadius = 3;

		// Create supplement molecules outside the cell
		for (let i = 0; i < 10; i++) {
			const angle = (i / 10) * Math.PI * 2;
			const distance = membraneRadius + 1 + Math.random() * 2;

			molecules.push({
				id: `molecule-${i}`,
				position: new Vector3(
					Math.cos(angle) * distance,
					Math.sin(angle) * distance,
					(Math.random() - 0.5) * 0.5,
				),
				velocity: new Vector3(
					(Math.random() - 0.5) * 0.01,
					(Math.random() - 0.5) * 0.01,
					0,
				),
				isAbsorbed: false,
				isInsideCell: false,
				absorptionProgress: 0,
				color: new Color("#22C55E"),
			});
		}

		// Create transport proteins in membrane
		if (
			UPTAKE_MECHANISMS[uptakeMechanism as keyof typeof UPTAKE_MECHANISMS]
				.requiresProtein
		) {
			for (let i = 0; i < 4; i++) {
				const angle = (i / 4) * Math.PI * 2;
				const proteinType =
					uptakeMechanism === "active-transport"
						? "pump"
						: uptakeMechanism === "endocytosis"
							? "carrier"
							: "channel";

				proteins.push({
					id: `protein-${i}`,
					position: new Vector3(
						Math.cos(angle) * membraneRadius,
						Math.sin(angle) * membraneRadius,
						0,
					),
					isActive: false,
					transportProgress: 0,
					type: proteinType as "channel" | "carrier" | "pump",
				});
			}
		}

		return { molecules, transportProteins: proteins };
	}, [uptakeMechanism]);

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

		molecules.forEach((molecule, index) => {
			if (molecule.isAbsorbed) return;

			// Step 1: Approach membrane (0-2.5s)
			if (animationProgressRef.current < 2.5) {
				const membraneRadius = 3;
				const distanceToMembrane = Math.sqrt(
					molecule.position.x ** 2 + molecule.position.y ** 2,
				);

				if (distanceToMembrane > membraneRadius) {
					// Move towards membrane
					const direction = new Vector3(
						-molecule.position.x,
						-molecule.position.y,
						0,
					).normalize();
					molecule.velocity.lerp(direction.multiplyScalar(0.02), 0.1);
					molecule.position.add(
						molecule.velocity.clone().multiplyScalar(delta * 60),
					);
				}
			}

			// Step 2: Recognition and binding (2.5-5s)
			else if (animationProgressRef.current < 5) {
				if (
					UPTAKE_MECHANISMS[uptakeMechanism as keyof typeof UPTAKE_MECHANISMS]
						.requiresProtein
				) {
					// Find nearest transport protein
					let nearestProtein = transportProteins[0];
					let nearestDistance = Number.POSITIVE_INFINITY;

					transportProteins.forEach((protein) => {
						const distance = molecule.position.distanceTo(protein.position);
						if (distance < nearestDistance) {
							nearestDistance = distance;
							nearestProtein = protein;
						}
					});

					if (nearestDistance < 0.8) {
						// Move towards protein
						const direction = nearestProtein.position
							.clone()
							.sub(molecule.position)
							.normalize();
						molecule.velocity.lerp(direction.multiplyScalar(0.03), 0.1);
						molecule.position.add(
							molecule.velocity.clone().multiplyScalar(delta * 60),
						);

						// Start absorption process
						if (nearestDistance < 0.3) {
							molecule.absorptionProgress = Math.min(
								1,
								molecule.absorptionProgress + delta * 2,
							);
							nearestProtein.isActive = true;
							nearestProtein.transportProgress = molecule.absorptionProgress;
						}
					}
				} else {
					// Passive diffusion - cross membrane directly
					const membraneRadius = 3;
					const distanceToMembrane = Math.sqrt(
						molecule.position.x ** 2 + molecule.position.y ** 2,
					);

					if (
						distanceToMembrane <= membraneRadius &&
						distanceToMembrane > membraneRadius - 0.2
					) {
						molecule.absorptionProgress = Math.min(
							1,
							molecule.absorptionProgress + delta * 3,
						);
					}
				}
			}

			// Step 3: Transport through membrane (5-7.5s)
			else if (animationProgressRef.current < 7.5) {
				if (molecule.absorptionProgress > 0.5) {
					// Move through membrane
					const membraneRadius = 3;
					const distanceToCenter = Math.sqrt(
						molecule.position.x ** 2 + molecule.position.y ** 2,
					);

					if (distanceToCenter > 0.5) {
						const inwardDirection = new Vector3(
							-molecule.position.x,
							-molecule.position.y,
							0,
						).normalize();
						molecule.position.add(inwardDirection.multiplyScalar(delta * 2));
					} else {
						molecule.isInsideCell = true;
					}
				}
			}

			// Step 4: Inside cell (7.5s+)
			else {
				if (molecule.isInsideCell) {
					molecule.absorptionProgress = Math.min(
						1,
						molecule.absorptionProgress + delta * 0.5,
					);
					molecule.isAbsorbed = molecule.absorptionProgress > 0.9;

					// Random movement inside cell
					molecule.velocity.add(
						new Vector3(
							(Math.random() - 0.5) * 0.01,
							(Math.random() - 0.5) * 0.01,
							0,
						),
					);
					molecule.position.add(
						molecule.velocity.clone().multiplyScalar(delta * 30),
					);
				}
			}

			// Apply velocity
			molecule.position.add(
				molecule.velocity.clone().multiplyScalar(delta * 60),
			);
		});

		// Calculate overall absorption progress
		const absorbedMolecules = molecules.filter((m) => m.isAbsorbed).length;
		const totalProgress = (absorbedMolecules / molecules.length) * 100;
		onAbsorptionProgress(Math.min(100, totalProgress));
	});

	return (
		<group ref={groupRef}>
			{/* Lighting */}
			<ambientLight intensity={0.6} />
			<pointLight position={[10, 10, 10]} intensity={0.8} />
			<pointLight position={[-10, -10, -10]} intensity={0.4} color="#4444ff" />

			{/* Cell membrane */}
			<CellMembrane />

			{/* Transport proteins */}
			{transportProteins.map((protein) => (
				<TransportProteinComponent
					key={protein.id}
					protein={protein}
					mechanism={uptakeMechanism}
				/>
			))}

			{/* Supplement molecules */}
			{molecules.map((molecule) => (
				<SupplementMoleculeComponent key={molecule.id} molecule={molecule} />
			))}

			{/* Transport effects */}
			<TransportEffects
				molecules={molecules}
				transportProteins={transportProteins}
				mechanism={uptakeMechanism}
			/>
		</group>
	);
};

// Cell membrane component
const CellMembrane: React.FC = () => {
	return (
		<group>
			{/* Outer membrane */}
			<mesh>
				<sphereGeometry args={[3, 32, 16]} />
				<meshStandardMaterial
					color="#1F2937"
					transparent
					opacity={0.2}
					side={DoubleSide}
				/>
			</mesh>

			{/* Inner membrane */}
			<mesh>
				<sphereGeometry args={[2.8, 32, 16]} />
				<meshStandardMaterial
					color="#374151"
					transparent
					opacity={0.3}
					side={DoubleSide}
				/>
			</mesh>

			{/* Membrane label */}
			<Html position={[0, 3.5, 0]}>
				<div className="rounded bg-black/70 px-2 py-1 text-sm text-white">
					Błona komórkowa
				</div>
			</Html>

			{/* Cytoplasm label */}
			<Html position={[0, 1.5, 0]}>
				<div className="rounded bg-black/70 px-2 py-1 text-sm text-white">
					Cytoplazma
				</div>
			</Html>
		</group>
	);
};

// Transport protein component
interface TransportProteinComponentProps {
	protein: TransportProtein;
	mechanism: string;
}

const TransportProteinComponent: React.FC<TransportProteinComponentProps> = ({
	protein,
	mechanism,
}) => {
	const meshRef = useRef<Mesh>(null);

	const { scale, color } = useSpring({
		scale: protein.isActive ? 1.2 : 1,
		color: protein.isActive ? new Color("#F59E0B") : new Color("#6B7280"),
		config: { tension: 300, friction: 50 },
	});

	useFrame(() => {
		if (meshRef.current) {
			meshRef.current.position.copy(protein.position);
		}
	});

	return (
		<group>
			<animated.mesh ref={meshRef} scale={scale}>
				<cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
				<meshStandardMaterial
					color={color}
					emissive={protein.isActive ? color.getHex() : 0x000000}
					emissiveIntensity={protein.isActive ? 0.3 : 0}
				/>
			</animated.mesh>

			{/* Transport channel */}
			<mesh position={protein.position}>
				<cylinderGeometry args={[0.1, 0.1, 1, 8]} />
				<meshStandardMaterial color="#1F2937" transparent opacity={0.5} />
			</mesh>

			{/* Protein label */}
			<Html
				position={[
					protein.position.x,
					protein.position.y + 0.5,
					protein.position.z,
				]}
			>
				<div className="rounded bg-black/70 px-1 py-0.5 text-white text-xs">
					Białko transportowe
				</div>
			</Html>
		</group>
	);
};

// Supplement molecule component for cellular uptake
interface SupplementMoleculeComponentProps {
	molecule: SupplementMolecule;
}

const SupplementMoleculeComponent: React.FC<
	SupplementMoleculeComponentProps
> = ({ molecule }) => {
	const meshRef = useRef<Mesh>(null);

	const { scale, color } = useSpring({
		scale:
			molecule.absorptionProgress > 0
				? 1 + molecule.absorptionProgress * 0.3
				: 1,
		color: molecule.isInsideCell
			? new Color().lerpColors(
					molecule.color,
					new Color("#F59E0B"),
					molecule.absorptionProgress,
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
				<sphereGeometry args={[0.08, 12, 12]} />
				<meshStandardMaterial
					color={color}
					transparent
					opacity={0.9}
					emissive={molecule.isInsideCell ? color.getHex() : 0x000000}
					emissiveIntensity={molecule.isInsideCell ? 0.2 : 0}
				/>
			</animated.mesh>

			{/* Absorption progress indicator */}
			{molecule.absorptionProgress > 0 && !molecule.isAbsorbed && (
				<mesh position={molecule.position}>
					<ringGeometry args={[0.12, 0.15, 12]} />
					<meshBasicMaterial
						color="#3B82F6"
						transparent
						opacity={molecule.absorptionProgress * 0.6}
					/>
				</mesh>
			)}

			{/* Molecule label */}
			<Html
				position={[
					molecule.position.x,
					molecule.position.y + 0.15,
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

// Transport effects component
interface TransportEffectsProps {
	molecules: SupplementMolecule[];
	transportProteins: TransportProtein[];
	mechanism: string;
}

const TransportEffects: React.FC<TransportEffectsProps> = ({
	molecules,
	transportProteins,
	mechanism,
}) => {
	return (
		<group>
			{/* Energy particles for active transport */}
			{mechanism === "active-transport" &&
				transportProteins.map((protein) => (
					<group key={`energy-${protein.id}`}>
						{Array.from({ length: 6 }).map((_, i) => {
							const angle = (i / 6) * Math.PI * 2;
							const radius = 0.8;
							const x = protein.position.x + Math.cos(angle) * radius;
							const y = protein.position.y + Math.sin(angle) * radius;
							const z =
								protein.position.z + Math.sin(Date.now() * 0.01 + i) * 0.2;

							return (
								<mesh key={i} position={[x, y, z]}>
									<sphereGeometry args={[0.03, 6, 6]} />
									<meshBasicMaterial
										color="#F59E0B"
										transparent
										opacity={0.7}
									/>
								</mesh>
							);
						})}
					</group>
				))}

			{/* Concentration gradient visualization */}
			<group>
				{molecules
					.filter((m) => m.isInsideCell)
					.map((molecule) => (
						<mesh key={`gradient-${molecule.id}`} position={molecule.position}>
							<sphereGeometry args={[0.2, 8, 8]} />
							<meshBasicMaterial color="#10B981" transparent opacity={0.1} />
						</mesh>
					))}
			</group>
		</group>
	);
};

export default CellularUptakeAnimation;
