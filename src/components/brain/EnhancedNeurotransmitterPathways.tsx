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
	Line,
	OrbitControls,
	PerspectiveCamera,
	Sphere,
	Text,
	useGLTF,
} from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
	Activity,
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

// Enhanced neurotransmitter pathway interface
export interface EnhancedNeurotransmitterPathway {
	id: string;
	name: string;
	polishName: string;
	neurotransmitter: string;
	polishNeurotransmitter: string;
	startRegion: string;
	endRegion: string;
	pathPoints: [number, number, number][];
	color: string;
	thickness: number;
	activity: number; // 0-1
	animationSpeed: number;
	pulseFrequency: number;

	// Enhanced pathway details
	pathwayType: "projection" | "local" | "diffuse" | "feedback";
	synapticTransmission: "fast" | "slow" | "modulatory";
	receptorTypes: string[];
	polishReceptorTypes: string[];
	functionalRole: string;
	polishFunctionalRole: string;

	// Clinical and research data
	associatedDisorders: string[];
	polishAssociatedDisorders: string[];
	therapeuticTargets: string[];
	polishTherapeuticTargets: string[];
	evidenceLevel: "STRONG" | "MODERATE" | "WEAK" | "THEORETICAL";

	// Visual effects
	visualEffect: {
		color: string;
		pulseSpeed: number;
		glowIntensity: number;
		particleEffect: boolean;
		showSynapses: boolean;
	};
}

// Enhanced neurotransmitter pathways data
export const enhancedNeurotransmitterPathways: EnhancedNeurotransmitterPathway[] =
	[
		{
			id: "mesolimbic-dopamine",
			name: "Mesolimbic Dopamine Pathway",
			polishName: "Mezolimbiczna ścieżka dopaminowa",
			neurotransmitter: "Dopamine",
			polishNeurotransmitter: "Dopamina",
			startRegion: "ventral-tegmental-area",
			endRegion: "nucleus-accumbens",
			pathPoints: [
				[0, -1.5, -1],
				[0.2, -0.8, -0.5],
				[0.4, -0.2, 0.1],
				[0.6, 0.4, 0.4],
				[0.8, 1.0, 0.7],
			],
			color: "#8B5CF6",
			thickness: 0.08,
			activity: 0.7,
			animationSpeed: 1.5,
			pulseFrequency: 2.0,

			pathwayType: "projection",
			synapticTransmission: "modulatory",
			receptorTypes: ["D1", "D2", "D3"],
			polishReceptorTypes: ["D1", "D2", "D3"],
			functionalRole: "Reward processing and motivation",
			polishFunctionalRole: "Przetwarzanie nagrody i motywacja",

			associatedDisorders: ["Addiction", "Depression", "Schizophrenia", "ADHD"],
			polishAssociatedDisorders: [
				"Uzależnienie",
				"Depresja",
				"Schizofrenia",
				"ADHD",
			],
			therapeuticTargets: [
				"Dopamine receptors",
				"Dopamine transporters",
				"Ventral tegmental area",
			],
			polishTherapeuticTargets: [
				"Receptory dopaminowe",
				"Transportery dopaminowe",
				"Obszar brzuszny nakrywki",
			],
			evidenceLevel: "STRONG",

			visualEffect: {
				color: "#8B5CF6",
				pulseSpeed: 2.0,
				glowIntensity: 0.8,
				particleEffect: true,
				showSynapses: true,
			},
		},
		{
			id: "nigrostriatal-dopamine",
			name: "Nigrostriatal Dopamine Pathway",
			polishName: "Nigrostriatalna ścieżka dopaminowa",
			neurotransmitter: "Dopamine",
			polishNeurotransmitter: "Dopamina",
			startRegion: "substantia-nigra",
			endRegion: "striatum",
			pathPoints: [
				[0.5, -1.2, -0.8],
				[0.6, -0.8, -0.4],
				[0.7, -0.4, 0],
				[0.8, 0, 0.3],
				[0.8, 0.2, 0.3],
			],
			color: "#7C3AED",
			thickness: 0.06,
			activity: 0.6,
			animationSpeed: 1.2,
			pulseFrequency: 1.5,

			pathwayType: "projection",
			synapticTransmission: "fast",
			receptorTypes: ["D1", "D2"],
			polishReceptorTypes: ["D1", "D2"],
			functionalRole: "Motor control and movement initiation",
			polishFunctionalRole: "Kontrola ruchowa i inicjacja ruchu",

			associatedDisorders: [
				"Parkinson's disease",
				"Dystonia",
				"Tremor disorders",
			],
			polishAssociatedDisorders: [
				"Choroba Parkinsona",
				"Dystonia",
				"Zaburzenia drżenia",
			],
			therapeuticTargets: [
				"Substantia nigra",
				"Dopaminergic neurons",
				"Striatal receptors",
			],
			polishTherapeuticTargets: [
				"Substancja czarna",
				"Neurony dopaminergicyczne",
				"Receptory striatalne",
			],
			evidenceLevel: "STRONG",

			visualEffect: {
				color: "#7C3AED",
				pulseSpeed: 1.5,
				glowIntensity: 0.7,
				particleEffect: false,
				showSynapses: true,
			},
		},
		{
			id: "cholinergic-septal-hippocampal",
			name: "Septal-Hippocampal Cholinergic Pathway",
			polishName: "Cholinergiczna ścieżka przegrodowo-hipokampalna",
			neurotransmitter: "Acetylcholine",
			polishNeurotransmitter: "Acetylocholina",
			startRegion: "medial-septum",
			endRegion: "hippocampus",
			pathPoints: [
				[0, 0.5, 1],
				[0.3, 0.3, 0.5],
				[0.8, 0.2, 0.2],
				[1.2, 0.1, -0.1],
				[1.5, 0, -0.5],
			],
			color: "#10B981",
			thickness: 0.05,
			activity: 0.8,
			animationSpeed: 1.8,
			pulseFrequency: 2.5,

			pathwayType: "projection",
			synapticTransmission: "modulatory",
			receptorTypes: ["M1", "M2", "α7 nicotinic"],
			polishReceptorTypes: ["M1", "M2", "nikotynowe α7"],
			functionalRole: "Memory formation and attention",
			polishFunctionalRole: "Tworzenie pamięci i uwaga",

			associatedDisorders: [
				"Alzheimer's disease",
				"Memory disorders",
				"Attention deficits",
			],
			polishAssociatedDisorders: [
				"Choroba Alzheimera",
				"Zaburzenia pamięci",
				"Deficyty uwagi",
			],
			therapeuticTargets: [
				"Cholinergic neurons",
				"Acetylcholine receptors",
				"Choline transporters",
			],
			polishTherapeuticTargets: [
				"Neurony cholinergiczne",
				"Receptory acetylocholiny",
				"Transportery choliny",
			],
			evidenceLevel: "STRONG",

			visualEffect: {
				color: "#10B981",
				pulseSpeed: 2.5,
				glowIntensity: 0.9,
				particleEffect: true,
				showSynapses: true,
			},
		},
		{
			id: "raphe-serotonergic-cortical",
			name: "Raphe-Serotonergic Cortical Pathway",
			polishName: "Kortykalna ścieżka serotonergiczna szwu",
			neurotransmitter: "Serotonin",
			polishNeurotransmitter: "Serotonina",
			startRegion: "dorsal-raphe-nucleus",
			endRegion: "prefrontal-cortex",
			pathPoints: [
				[0, -1.8, -1.2],
				[0, -1.0, -0.6],
				[0, -0.3, 0],
				[0, 0.5, 0.8],
				[0, 1.2, 1.8],
			],
			color: "#F59E0B",
			thickness: 0.04,
			activity: 0.5,
			animationSpeed: 1.0,
			pulseFrequency: 1.2,

			pathwayType: "diffuse",
			synapticTransmission: "modulatory",
			receptorTypes: ["5-HT1A", "5-HT2A", "5-HT3"],
			polishReceptorTypes: ["5-HT1A", "5-HT2A", "5-HT3"],
			functionalRole: "Mood regulation and emotional processing",
			polishFunctionalRole: "Regulacja nastroju i przetwarzanie emocjonalne",

			associatedDisorders: [
				"Depression",
				"Anxiety disorders",
				"OCD",
				"Migraine",
			],
			polishAssociatedDisorders: [
				"Depresja",
				"Zaburzenia lękowe",
				"ZOK",
				"Migrena",
			],
			therapeuticTargets: [
				"Serotonin receptors",
				"Serotonin transporters",
				"Raphe nuclei",
			],
			polishTherapeuticTargets: [
				"Receptory serotoniny",
				"Transportery serotoniny",
				"Jądra szwu",
			],
			evidenceLevel: "STRONG",

			visualEffect: {
				color: "#F59E0B",
				pulseSpeed: 1.2,
				glowIntensity: 0.6,
				particleEffect: false,
				showSynapses: false,
			},
		},
		{
			id: "gabaergic-interneuron-network",
			name: "GABAergic Interneuron Network",
			polishName: "Sieć interneuronów GABA-ergicznych",
			neurotransmitter: "GABA",
			polishNeurotransmitter: "GABA",
			startRegion: "cortical-interneurons",
			endRegion: "pyramidal-neurons",
			pathPoints: [
				[-0.5, 0.8, 1.2],
				[-0.3, 0.6, 1.0],
				[-0.1, 0.4, 0.8],
				[0.1, 0.2, 0.6],
				[0.3, 0, 0.4],
			],
			color: "#EF4444",
			thickness: 0.03,
			activity: 0.9,
			animationSpeed: 2.0,
			pulseFrequency: 3.0,

			pathwayType: "local",
			synapticTransmission: "fast",
			receptorTypes: ["GABA-A", "GABA-B"],
			polishReceptorTypes: ["GABA-A", "GABA-B"],
			functionalRole: "Inhibitory control and network synchronization",
			polishFunctionalRole: "Kontrola hamująca i synchronizacja sieci",

			associatedDisorders: [
				"Epilepsy",
				"Anxiety disorders",
				"Schizophrenia",
				"Autism",
			],
			polishAssociatedDisorders: [
				"Epilepsja",
				"Zaburzenia lękowe",
				"Schizofrenia",
				"Autyzm",
			],
			therapeuticTargets: [
				"GABA-A receptors",
				"GABA transporters",
				"Interneuron function",
			],
			polishTherapeuticTargets: [
				"Receptory GABA-A",
				"Transportery GABA",
				"Funkcja interneuronów",
			],
			evidenceLevel: "STRONG",

			visualEffect: {
				color: "#EF4444",
				pulseSpeed: 3.0,
				glowIntensity: 0.7,
				particleEffect: false,
				showSynapses: true,
			},
		},
	];

export interface EnhancedNeurotransmitterPathwaysProps {
	selectedPathways?: string[];
	showActivity?: boolean;
	animationSpeed?: number;
	onPathwayClick?: (pathwayId: string) => void;
	onPathwaySelect?: (pathway: EnhancedNeurotransmitterPathway) => void;
	className?: string;
}

// Enhanced pathway component with advanced animations
const EnhancedPathway: React.FC<{
	pathway: EnhancedNeurotransmitterPathway;
	isSelected: boolean;
	showActivity: boolean;
	animationSpeed: number;
	onClick: () => void;
}> = ({ pathway, isSelected, showActivity, animationSpeed, onClick }) => {
	const groupRef = useRef<Group>(null);
	const particleRef = useRef<Group>(null);

	useFrame((state) => {
		if (!groupRef.current) return;

		const time = state.clock.getElapsedTime();

		// Animate pathway activity
		if (showActivity) {
			const pulse =
				Math.sin(time * pathway.pulseFrequency * animationSpeed) * 0.5 + 0.5;
			groupRef.current.children.forEach((child, index) => {
				if (child instanceof Mesh) {
					child.material.emissiveIntensity =
						pulse * pathway.activity * pathway.visualEffect.glowIntensity;
				}
			});
		}

		// Animate particle effects
		if (particleRef.current && pathway.visualEffect.particleEffect) {
			particleRef.current.children.forEach((particle, index) => {
				const offset = (time * animationSpeed + index * 0.5) % (Math.PI * 2);
				particle.position.y += Math.sin(offset) * 0.01;
			});
		}
	});

	return (
		<group ref={groupRef} onClick={onClick}>
			{/* Main pathway line */}
			<Line
				points={pathway.pathPoints}
				color={pathway.color}
				lineWidth={pathway.thickness * (isSelected ? 2 : 1)}
			/>

			{/* Synaptic terminals */}
			{pathway.visualEffect.showSynapses &&
				pathway.pathPoints.map((point, index) => (
					<Sphere key={`synapse-${index}`} args={[0.02, 8, 8]} position={point}>
						<meshStandardMaterial
							color={pathway.visualEffect.color}
							emissive={pathway.visualEffect.color}
							emissiveIntensity={
								showActivity ? pathway.visualEffect.glowIntensity : 0
							}
							transparent
							opacity={0.8}
						/>
					</Sphere>
				))}

			{/* Particle effects */}
			{pathway.visualEffect.particleEffect && (
				<group ref={particleRef}>
					{Array.from({ length: 20 }).map((_, index) => (
						<Sphere
							key={`particle-${index}`}
							args={[0.005, 4, 4]}
							position={[
								pathway.pathPoints[0][0] + (Math.random() - 0.5) * 0.2,
								pathway.pathPoints[0][1] + (Math.random() - 0.5) * 0.2,
								pathway.pathPoints[0][2] + (Math.random() - 0.5) * 0.2,
							]}
						>
							<meshStandardMaterial
								color={pathway.visualEffect.color}
								emissive={pathway.visualEffect.color}
								emissiveIntensity={0.5}
								transparent
								opacity={0.6}
							/>
						</Sphere>
					))}
				</group>
			)}

			{/* Pathway label */}
			<Html
				position={[
					pathway.pathPoints[0][0],
					pathway.pathPoints[0][1] + 0.3,
					pathway.pathPoints[0][2],
				]}
				center
			>
				<div
					className={`rounded border px-2 py-1 font-medium text-xs shadow-lg backdrop-blur-sm ${
						isSelected ? "border-blue-300 bg-blue-100" : "bg-white/90"
					}`}
				>
					{pathway.polishName}
				</div>
			</Html>
		</group>
	);
};

// Main enhanced pathways component
const EnhancedPathwaysModel: React.FC<{
	selectedPathways: string[];
	showActivity: boolean;
	animationSpeed: number;
	onPathwayClick: (pathwayId: string) => void;
}> = ({ selectedPathways, showActivity, animationSpeed, onPathwayClick }) => {
	return (
		<>
			{enhancedNeurotransmitterPathways.map((pathway) => (
				<EnhancedPathway
					key={pathway.id}
					pathway={pathway}
					isSelected={selectedPathways.includes(pathway.id)}
					showActivity={showActivity}
					animationSpeed={animationSpeed}
					onClick={() => onPathwayClick(pathway.id)}
				/>
			))}

			{/* Brain outline for reference */}
			<Sphere args={[2.8, 64, 64]} position={[0, 0, 0]}>
				<meshStandardMaterial
					color="#E5E7EB"
					transparent
					opacity={0.05}
					wireframe
				/>
			</Sphere>
		</>
	);
};

const EnhancedNeurotransmitterPathways: React.FC<
	EnhancedNeurotransmitterPathwaysProps
> = ({
	selectedPathways = [],
	showActivity = true,
	animationSpeed = 1,
	onPathwayClick,
	onPathwaySelect,
	className = "",
}) => {
	const [selectedPathway, setSelectedPathway] = useState<string | null>(null);
	const [showControls, setShowControls] = useState(true);
	const [localShowActivity, setLocalShowActivity] = useState(showActivity);
	const [localAnimationSpeed, setLocalAnimationSpeed] =
		useState(animationSpeed);
	const [isPlaying, setIsPlaying] = useState(true);

	const handlePathwayClick = (pathwayId: string) => {
		setSelectedPathway(pathwayId);
		onPathwayClick?.(pathwayId);
	};

	const selectedPathwayData = selectedPathway
		? enhancedNeurotransmitterPathways.find((p) => p.id === selectedPathway)
		: null;

	return (
		<div className={`relative h-full w-full ${className}`}>
			{/* 3D Canvas */}
			<div className="h-[600px] w-full overflow-hidden rounded-lg bg-gradient-to-b from-purple-50 to-white">
				<Canvas>
					<PerspectiveCamera makeDefault position={[5, 2, 5]} />
					<OrbitControls enablePan enableZoom enableRotate />

					{/* Enhanced lighting for better pathway visibility */}
					<ambientLight intensity={0.5} />
					<directionalLight position={[10, 10, 5]} intensity={1.0} />
					<pointLight
						position={[-10, -10, -5]}
						intensity={0.4}
						color="#8B5CF6"
					/>

					{/* Environment */}
					<Environment preset="night" />

					{/* Enhanced pathways model */}
					<Suspense fallback={null}>
						<EnhancedPathwaysModel
							selectedPathways={selectedPathways}
							showActivity={localShowActivity && isPlaying}
							animationSpeed={localAnimationSpeed}
							onPathwayClick={handlePathwayClick}
						/>
					</Suspense>

					{/* Ground shadow */}
					<ContactShadows
						position={[0, -3.5, 0]}
						opacity={0.3}
						scale={12}
						blur={2}
						far={5}
					/>
				</Canvas>
			</div>

			{/* Enhanced controls overlay */}
			{showControls && (
				<div className="absolute top-4 left-4 space-y-2">
					<Card className="w-72">
						<CardHeader className="pb-2">
							<CardTitle className="flex items-center gap-2 text-sm">
								<Settings className="h-4 w-4" />
								Kontrola ścieżek neuroprzekaźników
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3">
							<div className="flex items-center justify-between">
								<span className="text-xs">Animacja aktywności</span>
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
								<span className="text-xs">Pokaż aktywność</span>
								<Switch
									checked={localShowActivity}
									onCheckedChange={setLocalShowActivity}
								/>
							</div>
						</CardContent>
					</Card>

					{/* Pathway selector */}
					<Card className="w-72">
						<CardHeader className="pb-2">
							<CardTitle className="text-sm">
								Ścieżki neuroprzekaźników
							</CardTitle>
						</CardHeader>
						<CardContent className="max-h-48 space-y-2 overflow-y-auto">
							{enhancedNeurotransmitterPathways.map((pathway) => (
								<Button
									key={pathway.id}
									size="sm"
									variant={
										selectedPathways.includes(pathway.id)
											? "default"
											: "outline"
									}
									className="h-8 w-full justify-start text-xs"
									onClick={() => handlePathwayClick(pathway.id)}
								>
									<div
										className="mr-2 h-2 w-2 rounded-full"
										style={{ backgroundColor: pathway.color }}
									/>
									{pathway.polishName}
								</Button>
							))}
						</CardContent>
					</Card>
				</div>
			)}

			{/* Enhanced pathway info panel */}
			{selectedPathwayData && (
				<div className="absolute top-4 right-4 w-80">
					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="flex items-center gap-2 text-sm">
								<Activity className="h-4 w-4" />
								{selectedPathwayData.polishName}
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3">
							<div>
								<h4 className="mb-1 font-medium text-xs">Neuroprzekaźnik:</h4>
								<Badge variant="secondary" className="text-xs">
									{selectedPathwayData.polishNeurotransmitter}
								</Badge>
							</div>

							<div>
								<h4 className="mb-1 font-medium text-xs">Rola funkcjonalna:</h4>
								<p className="text-gray-600 text-xs">
									{selectedPathwayData.polishFunctionalRole}
								</p>
							</div>

							<div>
								<h4 className="mb-1 font-medium text-xs">Typ transmisji:</h4>
								<Badge variant="outline" className="text-xs">
									{selectedPathwayData.synapticTransmission}
								</Badge>
							</div>

							<div>
								<h4 className="mb-1 font-medium text-xs">Receptory:</h4>
								<div className="flex flex-wrap gap-1">
									{selectedPathwayData.polishReceptorTypes.map(
										(receptor, index) => (
											<Badge key={index} variant="outline" className="text-xs">
												{receptor}
											</Badge>
										),
									)}
								</div>
							</div>

							{selectedPathwayData.associatedDisorders.length > 0 && (
								<div>
									<h4 className="mb-1 font-medium text-xs">
										Zaburzenia związane:
									</h4>
									<div className="flex flex-wrap gap-1">
										{selectedPathwayData.polishAssociatedDisorders.map(
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
								<strong>Poziom aktywności:</strong>{" "}
								{Math.round(selectedPathwayData.activity * 100)}%
							</div>

							<div className="text-gray-600 text-xs">
								<strong>Poziom dowodów:</strong>{" "}
								{selectedPathwayData.evidenceLevel}
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

export default EnhancedNeurotransmitterPathways;

// Export pathways data for use in other components
export { enhancedNeurotransmitterPathways };
