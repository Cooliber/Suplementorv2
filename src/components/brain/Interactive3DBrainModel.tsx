"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Box,
	ContactShadows,
	Environment,
	Html,
	OrbitControls,
	PerspectiveCamera,
	Sphere,
	Text,
	useGLTF,
} from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
	Brain,
	Eye,
	EyeOff,
	Info,
	Pause,
	Play,
	RotateCcw,
	Settings,
	Zap,
	ZoomIn,
	ZoomOut,
} from "lucide-react";
import type React from "react";
import { Suspense, useEffect, useRef, useState } from "react";
import { Color, type Group, Mesh, Vector3 } from "three";

// Polish brain region data
interface BrainRegion {
	id: string;
	name: string;
	polishName: string;
	position: [number, number, number];
	color: string;
	size: number;
	functions: string[];
	polishFunctions: string[];
	neurotransmitters: string[];
	supplementEffects: SupplementEffect[];
	anatomicalInfo: {
		volume: number; // cm³
		connections: string[];
		polishConnections: string[];
		clinicalRelevance: string;
		polishClinicalRelevance: string;
	};
}

interface SupplementEffect {
	supplementId: string;
	supplementName: string;
	polishSupplementName: string;
	effectType: "ENHANCES" | "MODULATES" | "PROTECTS" | "STIMULATES";
	intensity: number; // 0-1
	mechanism: string;
	polishMechanism: string;
	evidenceLevel: "STRONG" | "MODERATE" | "WEAK";
	visualEffect: {
		color: string;
		pulseSpeed: number;
		glowIntensity: number;
	};
}

interface NeurotransmitterPathway {
	id: string;
	name: string;
	polishName: string;
	startRegion: string;
	endRegion: string;
	neurotransmitter: string;
	polishNeurotransmitter: string;
	pathPoints: [number, number, number][];
	color: string;
	thickness: number;
	activity: number; // 0-1
}

// Brain regions data with Polish translations
const brainRegions: BrainRegion[] = [
	{
		id: "prefrontal-cortex",
		name: "Prefrontal Cortex",
		polishName: "Kora przedczołowa",
		position: [0, 1.2, 1.8],
		color: "#4F46E5",
		size: 0.8,
		functions: [
			"Executive function",
			"Working memory",
			"Decision making",
			"Attention",
		],
		polishFunctions: [
			"Funkcje wykonawcze",
			"Pamięć robocza",
			"Podejmowanie decyzji",
			"Uwaga",
		],
		neurotransmitters: ["Dopamine", "Norepinephrine", "Acetylcholine"],
		supplementEffects: [
			{
				supplementId: "omega-3-epa-dha",
				supplementName: "Omega-3 EPA/DHA",
				polishSupplementName: "Omega-3 EPA/DHA",
				effectType: "ENHANCES",
				intensity: 0.7,
				mechanism: "Improves membrane fluidity and neuroplasticity",
				polishMechanism: "Poprawia płynność błon i neuroplastyczność",
				evidenceLevel: "MODERATE",
				visualEffect: {
					color: "#10B981",
					pulseSpeed: 1.5,
					glowIntensity: 0.6,
				},
			},
			{
				supplementId: "magnesium-l-threonate",
				supplementName: "Magnesium L-Threonate",
				polishSupplementName: "L-treonian magnezu",
				effectType: "STIMULATES",
				intensity: 0.8,
				mechanism: "Enhances NMDA receptor function and synaptic plasticity",
				polishMechanism:
					"Wzmacnia funkcję receptorów NMDA i plastyczność synaptyczną",
				evidenceLevel: "MODERATE",
				visualEffect: {
					color: "#8B5CF6",
					pulseSpeed: 2.0,
					glowIntensity: 0.8,
				},
			},
		],
		anatomicalInfo: {
			volume: 85.2,
			connections: ["Anterior Cingulate", "Hippocampus", "Amygdala"],
			polishConnections: [
				"Kora zakrętu obręczy przednia",
				"Hipokamp",
				"Ciało migdałowate",
			],
			clinicalRelevance:
				"Critical for cognitive control and executive function",
			polishClinicalRelevance:
				"Kluczowa dla kontroli poznawczej i funkcji wykonawczych",
		},
	},
	{
		id: "hippocampus",
		name: "Hippocampus",
		polishName: "Hipokamp",
		position: [1.5, 0, -0.5],
		color: "#F59E0B",
		size: 0.6,
		functions: ["Memory formation", "Learning", "Spatial navigation"],
		polishFunctions: [
			"Tworzenie pamięci",
			"Uczenie się",
			"Nawigacja przestrzenna",
		],
		neurotransmitters: ["Acetylcholine", "GABA", "Glutamate"],
		supplementEffects: [
			{
				supplementId: "lions-mane-mushroom",
				supplementName: "Lion's Mane Mushroom",
				polishSupplementName: "Soplówka jeżowata",
				effectType: "ENHANCES",
				intensity: 0.9,
				mechanism: "Stimulates NGF production and neurogenesis",
				polishMechanism: "Stymuluje produkcję NGF i neurogenezę",
				evidenceLevel: "MODERATE",
				visualEffect: {
					color: "#F97316",
					pulseSpeed: 1.8,
					glowIntensity: 0.9,
				},
			},
		],
		anatomicalInfo: {
			volume: 4.2,
			connections: ["Prefrontal Cortex", "Entorhinal Cortex", "Amygdala"],
			polishConnections: [
				"Kora przedczołowa",
				"Kora śródwęchowa",
				"Ciało migdałowate",
			],
			clinicalRelevance:
				"Essential for memory consolidation and spatial memory",
			polishClinicalRelevance:
				"Niezbędny dla konsolidacji pamięci i pamięci przestrzennej",
		},
	},
	{
		id: "amygdala",
		name: "Amygdala",
		polishName: "Ciało migdałowate",
		position: [1.2, -0.3, -0.8],
		color: "#EF4444",
		size: 0.4,
		functions: ["Emotion processing", "Fear response", "Memory modulation"],
		polishFunctions: [
			"Przetwarzanie emocji",
			"Reakcja strachu",
			"Modulacja pamięci",
		],
		neurotransmitters: ["GABA", "Serotonin", "Norepinephrine"],
		supplementEffects: [],
		anatomicalInfo: {
			volume: 1.7,
			connections: ["Hippocampus", "Prefrontal Cortex", "Hypothalamus"],
			polishConnections: ["Hipokamp", "Kora przedczołowa", "Podwzgórze"],
			clinicalRelevance:
				"Central to emotional processing and fear conditioning",
			polishClinicalRelevance:
				"Centralne dla przetwarzania emocji i kondycjonowania strachu",
		},
	},
	{
		id: "anterior-cingulate",
		name: "Anterior Cingulate Cortex",
		polishName: "Przednia kora zakrętu obręczy",
		position: [0, 0.8, 0.5],
		color: "#06B6D4",
		size: 0.5,
		functions: ["Attention", "Emotion regulation", "Pain processing"],
		polishFunctions: ["Uwaga", "Regulacja emocji", "Przetwarzanie bólu"],
		neurotransmitters: ["Dopamine", "Serotonin", "Glutamate"],
		supplementEffects: [],
		anatomicalInfo: {
			volume: 12.3,
			connections: ["Prefrontal Cortex", "Insula", "Amygdala"],
			polishConnections: ["Kora przedczołowa", "Wyspa", "Ciało migdałowate"],
			clinicalRelevance:
				"Important for cognitive control and emotional regulation",
			polishClinicalRelevance:
				"Ważna dla kontroli poznawczej i regulacji emocjonalnej",
		},
	},
];

// Neurotransmitter pathways
const neurotransmitterPathways: NeurotransmitterPathway[] = [
	{
		id: "dopamine-pathway",
		name: "Dopaminergic Pathway",
		polishName: "Szlak dopaminergiczny",
		startRegion: "ventral-tegmental-area",
		endRegion: "prefrontal-cortex",
		neurotransmitter: "Dopamine",
		polishNeurotransmitter: "Dopamina",
		pathPoints: [
			[0, -1.5, -1],
			[0, -0.5, 0],
			[0, 1.2, 1.8],
		],
		color: "#8B5CF6",
		thickness: 0.05,
		activity: 0.7,
	},
	{
		id: "cholinergic-pathway",
		name: "Cholinergic Pathway",
		polishName: "Szlak cholinergiczny",
		startRegion: "basal-forebrain",
		endRegion: "hippocampus",
		neurotransmitter: "Acetylcholine",
		polishNeurotransmitter: "Acetylocholina",
		pathPoints: [
			[0, 0.5, 1],
			[0.8, 0.2, 0],
			[1.5, 0, -0.5],
		],
		color: "#10B981",
		thickness: 0.04,
		activity: 0.6,
	},
];

export interface Interactive3DBrainModelProps {
	selectedSupplements?: string[];
	showNeurotransmitters?: boolean;
	animationSpeed?: number;
	onRegionClick?: (regionId: string) => void;
	onRegionSelect?: (region: unknown) => void;
	onConnectionSelect?: (conn: unknown) => void;
	onSupplementEffectToggle?: (supplementId: string, enabled: boolean) => void;
	className?: string;
}

// Brain region component
const BrainRegion: React.FC<{
	region: BrainRegion;
	isSelected: boolean;
	supplementEffects: SupplementEffect[];
	animationSpeed: number;
	onClick: () => void;
}> = ({ region, isSelected, supplementEffects, animationSpeed, onClick }) => {
	const meshRef = useRef<Mesh>(null);
	const [hovered, setHovered] = useState(false);

	useFrame((state) => {
		if (!meshRef.current) return;

		// Base rotation
		meshRef.current.rotation.y += 0.005 * animationSpeed;

		// Supplement effects animation
		if (supplementEffects.length > 0) {
			const time = state.clock.getElapsedTime();
			const effect = supplementEffects[0]; // Use first effect for animation
			const pulseSpeed = effect?.visualEffect?.pulseSpeed ?? 1;
			const pulse = Math.sin(time * pulseSpeed) * 0.5 + 0.5;
			meshRef.current?.scale.setScalar(
				region.size * (1 + pulse * 0.2 * (effect?.intensity || 1)),
			);
		}
	});

	const effectColor =
		supplementEffects.length > 0
			? supplementEffects[0]?.visualEffect?.color
			: region.color;

	return (
		<group position={region.position}>
			<Sphere
				ref={meshRef}
				args={[region.size, 32, 32]}
				onClick={onClick}
				onPointerOver={() => setHovered(true)}
				onPointerOut={() => setHovered(false)}
			>
				<meshStandardMaterial
					color={effectColor}
					emissive={isSelected || hovered ? effectColor : "#000000"}
					emissiveIntensity={isSelected ? 0.3 : hovered ? 0.1 : 0}
					transparent
					opacity={0.8}
				/>
			</Sphere>

			{/* Region label */}
			<Html position={[0, region.size + 0.3, 0]} center>
				<div className="rounded border bg-white/90 px-2 py-1 font-medium text-xs shadow-lg backdrop-blur-sm">
					{region.polishName}
				</div>
			</Html>

			{/* Supplement effect indicators */}
			{supplementEffects.map((effect, index) => (
				<Sphere
					key={effect.supplementId}
					args={[0.1, 16, 16]}
					position={[
						Math.cos((index * Math.PI * 2) / supplementEffects.length) *
							(region.size + 0.3),
						0,
						Math.sin((index * Math.PI * 2) / supplementEffects.length) *
							(region.size + 0.3),
					]}
				>
					<meshStandardMaterial
						color={effect.visualEffect.color}
						emissive={effect.visualEffect.color}
						emissiveIntensity={effect.visualEffect.glowIntensity}
					/>
				</Sphere>
			))}
		</group>
	);
};

// Neurotransmitter pathway component
const NeurotransmitterPathway: React.FC<{
	pathway: NeurotransmitterPathway;
	visible: boolean;
	animationSpeed: number;
}> = ({ pathway, visible, animationSpeed }) => {
	const groupRef = useRef<Group>(null);

	useFrame((state) => {
		if (!groupRef.current || !visible) return;

		const time = state.clock.getElapsedTime();
		groupRef.current.children.forEach((child, index) => {
			if (child instanceof Mesh) {
				const offset = (time * animationSpeed + index * 0.5) % (Math.PI * 2);
				child.material.emissiveIntensity =
					(Math.sin(offset) * 0.5 + 0.5) * pathway.activity;
			}
		});
	});

	if (!visible) return null;

	return (
		<group ref={groupRef}>
			{pathway.pathPoints.map((point, index) => (
				<Sphere key={index} args={[pathway.thickness, 16, 16]} position={point}>
					<meshStandardMaterial
						color={pathway.color}
						emissive={pathway.color}
						emissiveIntensity={0.5}
						transparent
						opacity={0.7}
					/>
				</Sphere>
			))}
		</group>
	);
};

// Main brain model component
const BrainModel: React.FC<{
	selectedRegion: string | null;
	selectedSupplements: string[];
	showNeurotransmitters: boolean;
	animationSpeed: number;
	onRegionClick: (regionId: string) => void;
}> = ({
	selectedRegion,
	selectedSupplements,
	showNeurotransmitters,
	animationSpeed,
	onRegionClick,
}) => {
	return (
		<>
			{/* Brain regions */}
			{brainRegions.map((region) => {
				const activeEffects = region.supplementEffects.filter((effect) =>
					selectedSupplements.includes(effect.supplementId),
				);

				return (
					<BrainRegion
						key={region.id}
						region={region}
						isSelected={selectedRegion === region.id}
						supplementEffects={activeEffects}
						animationSpeed={animationSpeed}
						onClick={() => onRegionClick(region.id)}
					/>
				);
			})}

			{/* Neurotransmitter pathways */}
			{neurotransmitterPathways.map((pathway) => (
				<NeurotransmitterPathway
					key={pathway.id}
					pathway={pathway}
					visible={showNeurotransmitters}
					animationSpeed={animationSpeed}
				/>
			))}

			{/* Brain outline/structure */}
			<Sphere args={[2.5, 64, 64]} position={[0, 0, 0]}>
				<meshStandardMaterial
					color="#E5E7EB"
					transparent
					opacity={0.1}
					wireframe
				/>
			</Sphere>
		</>
	);
};

const Interactive3DBrainModel: React.FC<Interactive3DBrainModelProps> = ({
	selectedSupplements = [],
	showNeurotransmitters = false,
	animationSpeed = 1,
	onRegionClick,
	onSupplementEffectToggle,
	className = "",
}) => {
	const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
	const [showControls, setShowControls] = useState(true);
	const [localShowNeurotransmitters, setLocalShowNeurotransmitters] = useState(
		showNeurotransmitters,
	);
	const [localAnimationSpeed, setLocalAnimationSpeed] =
		useState(animationSpeed);
	const [isPlaying, setIsPlaying] = useState(true);

	const handleRegionClick = (regionId: string) => {
		setSelectedRegion(regionId);
		onRegionClick?.(regionId);
	};

	const selectedRegionData = selectedRegion
		? brainRegions.find((r) => r.id === selectedRegion)
		: null;

	return (
		<div className={`relative h-full w-full ${className}`}>
			{/* 3D Canvas */}
			<div className="h-[600px] w-full overflow-hidden rounded-lg bg-gradient-to-b from-blue-50 to-white">
				<Canvas>
					<PerspectiveCamera makeDefault position={[5, 2, 5]} />
					<OrbitControls enablePan enableZoom enableRotate />

					{/* Lighting */}
					<ambientLight intensity={0.4} />
					<directionalLight position={[10, 10, 5]} intensity={0.8} />
					<pointLight position={[-10, -10, -5]} intensity={0.3} />

					{/* Environment */}
					<Environment preset="studio" />

					{/* Brain model */}
					<Suspense fallback={null}>
						<BrainModel
							selectedRegion={selectedRegion}
							selectedSupplements={selectedSupplements}
							showNeurotransmitters={localShowNeurotransmitters}
							animationSpeed={isPlaying ? localAnimationSpeed : 0}
							onRegionClick={handleRegionClick}
						/>
					</Suspense>

					{/* Ground shadow */}
					<ContactShadows
						position={[0, -3, 0]}
						opacity={0.3}
						scale={10}
						blur={2}
						far={4}
					/>
				</Canvas>
			</div>

			{/* Controls overlay */}
			{showControls && (
				<div className="absolute top-4 left-4 space-y-2">
					<Card className="w-64">
						<CardHeader className="pb-2">
							<CardTitle className="flex items-center gap-2 text-sm">
								<Settings className="h-4 w-4" />
								Kontrola wizualizacji
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3">
							<div className="flex items-center justify-between">
								<span className="text-xs">Animacja</span>
								<Button
									size="sm"
									variant="outline"
									onClick={() => setIsPlaying(!isPlaying)}
								>
									{isPlaying ? (
										<Pause className="h-3 w-3" />
									) : (
										<Play className="h-3 w-3" />
									)}
								</Button>
							</div>

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
								<span className="text-xs">Szlaki neuroprzekaźników</span>
								<Switch
									checked={localShowNeurotransmitters}
									onCheckedChange={setLocalShowNeurotransmitters}
								/>
							</div>
						</CardContent>
					</Card>
				</div>
			)}

			{/* Region info panel */}
			{selectedRegionData && (
				<div className="absolute top-4 right-4 w-80">
					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="flex items-center gap-2 text-sm">
								<Brain className="h-4 w-4" />
								{selectedRegionData.polishName}
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3">
							<div>
								<h4 className="mb-1 font-medium text-xs">Funkcje:</h4>
								<div className="flex flex-wrap gap-1">
									{selectedRegionData.polishFunctions.map((func, index) => (
										<Badge key={index} variant="outline" className="text-xs">
											{func}
										</Badge>
									))}
								</div>
							</div>

							<div>
								<h4 className="mb-1 font-medium text-xs">Neuroprzekaźniki:</h4>
								<div className="flex flex-wrap gap-1">
									{selectedRegionData.neurotransmitters.map((nt, index) => (
										<Badge key={index} variant="secondary" className="text-xs">
											{nt}
										</Badge>
									))}
								</div>
							</div>

							{selectedRegionData.supplementEffects.length > 0 && (
								<div>
									<h4 className="mb-1 font-medium text-xs">
										Efekty suplementów:
									</h4>
									<div className="space-y-2">
										{selectedRegionData.supplementEffects
											.filter((effect) =>
												selectedSupplements.includes(effect.supplementId),
											)
											.map((effect, index) => (
												<div key={index} className="rounded border p-2">
													<div className="font-medium text-xs">
														{effect.polishSupplementName}
													</div>
													<div className="mt-1 text-gray-600 text-xs">
														{effect.polishMechanism}
													</div>
													<Badge
														variant="outline"
														className="mt-1 text-xs"
														style={{ borderColor: effect.visualEffect.color }}
													>
														{effect.evidenceLevel}
													</Badge>
												</div>
											))}
									</div>
								</div>
							)}

							<div className="text-gray-600 text-xs">
								<strong>Objętość:</strong>{" "}
								{selectedRegionData.anatomicalInfo.volume} cm³
							</div>

							<div className="text-gray-600 text-xs">
								{selectedRegionData.anatomicalInfo.polishClinicalRelevance}
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

export default Interactive3DBrainModel;

// Export brain regions data for use in other components
export { brainRegions, neurotransmitterPathways };
