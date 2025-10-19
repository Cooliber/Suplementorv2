"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
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
	Settings,
	Sparkles,
	Zap,
	ZapOff,
} from "lucide-react";
import type React from "react";
import { Suspense, useEffect, useRef, useState } from "react";
import { Color, type Group, type Mesh } from "three";

// Neuroplasticity interfaces
export interface NeuroplasticityMechanism {
	id: string;
	name: string;
	polishName: string;
	type: "synaptic" | "structural" | "functional" | "compensatory";
	description: string;
	polishDescription: string;

	// Mechanism details
	processes: PlasticityProcess[];
	factors: PlasticityFactor[];

	// Time course
	timescale:
		| "milliseconds"
		| "seconds"
		| "minutes"
		| "hours"
		| "days"
		| "weeks";
	duration: number;
	persistence: "transient" | "intermediate" | "long-lasting";

	// Brain regions involved
	regions: string[];
	polishRegions: string[];

	// Enhancement strategies
	strategies: EnhancementStrategy[];

	// Visual properties
	visualEffect: {
		color: string;
		animationSpeed: number;
		showAnimation: boolean;
		particleEffect: boolean;
	};
}

export interface PlasticityProcess {
	id: string;
	name: string;
	polishName: string;
	mechanism: string;
	polishMechanism: string;
	stage: "induction" | "expression" | "maintenance" | "consolidation";
	molecularComponents: string[];
	polishMolecularComponents: string[];
}

export interface PlasticityFactor {
	factor: string;
	polishFactor: string;
	type: "enhancing" | "inhibiting" | "modulating";
	strength: number; // 0-1
	evidenceLevel: "STRONG" | "MODERATE" | "WEAK";
	mechanism: string;
	polishMechanism: string;
}

export interface EnhancementStrategy {
	strategy: string;
	polishStrategy: string;
	method: string;
	polishMethod: string;
	effectiveness: number; // 0-1
	timeframe: string;
	implementation: string;
	polishImplementation: string;
}

// Neuroplasticity mechanisms data
export const neuroplasticityMechanisms: NeuroplasticityMechanism[] = [
	{
		id: "long-term-potentiation",
		name: "Long-Term Potentiation (LTP)",
		polishName: "Długoterminowe wzmocnienie (LTP)",
		type: "synaptic",
		description:
			"Persistent strengthening of synapses based on recent patterns of activity",
		polishDescription:
			"Trwałe wzmacnianie synaps na podstawie ostatnich wzorców aktywności",

		processes: [
			{
				id: "glutamate-induction",
				name: "Glutamate Receptor Activation",
				polishName: "Aktywacja receptorów glutaminianowych",
				mechanism: "NMDA receptor activation leads to calcium influx",
				polishMechanism: "Aktywacja receptorów NMDA prowadzi do napływu wapnia",
				stage: "induction",
				molecularComponents: [
					"NMDA receptors",
					"AMPA receptors",
					"Calcium channels",
				],
				polishMolecularComponents: [
					"Receptory NMDA",
					"Receptory AMPA",
					"Kanały wapniowe",
				],
			},
			{
				id: "kinase-activation",
				name: "Protein Kinase Activation",
				polishName: "Aktywacja kinaz białkowych",
				mechanism:
					"Calcium-dependent kinase activation and AMPA receptor phosphorylation",
				polishMechanism:
					"Aktywacja kinaz zależnych od wapnia i fosforylacja receptorów AMPA",
				stage: "expression",
				molecularComponents: ["CaMKII", "PKC", "PKA"],
				polishMolecularComponents: ["CaMKII", "PKC", "PKA"],
			},
		],

		factors: [
			{
				factor: "BDNF",
				polishFactor: "BDNF",
				type: "enhancing",
				strength: 0.8,
				evidenceLevel: "STRONG",
				mechanism: "Promotes synaptic growth and strengthens LTP",
				polishMechanism: "Promuje wzrost synaptyczny i wzmacnia LTP",
			},
			{
				factor: "Exercise",
				polishFactor: "Ćwiczenia fizyczne",
				type: "enhancing",
				strength: 0.7,
				evidenceLevel: "STRONG",
				mechanism: "Increases BDNF and enhances synaptic plasticity",
				polishMechanism: "Zwiększa BDNF i wzmacnia plastyczność synaptyczną",
			},
			{
				factor: "Sleep deprivation",
				polishFactor: "Brak snu",
				type: "inhibiting",
				strength: 0.6,
				evidenceLevel: "MODERATE",
				mechanism: "Impairs LTP induction and maintenance",
				polishMechanism: "Upośledza indukcję i utrzymanie LTP",
			},
		],

		timescale: "minutes",
		duration: 60,
		persistence: "long-lasting",

		regions: ["Hippocampus", "Prefrontal cortex", "Amygdala", "Cerebellum"],
		polishRegions: [
			"Hipokamp",
			"Kora przedczołowa",
			"Ciało migdałowate",
			"Móżdżek",
		],

		strategies: [
			{
				strategy: "Cognitive training",
				polishStrategy: "Trening poznawczy",
				method: "Repeated practice of specific cognitive tasks",
				polishMethod: "Powtarzana praktyka specyficznych zadań poznawczych",
				effectiveness: 0.8,
				timeframe: "4-8 weeks",
				implementation: "30 minutes daily of targeted cognitive exercises",
				polishImplementation:
					"30 minut dziennie ukierunkowanych ćwiczeń poznawczych",
			},
			{
				strategy: "Physical exercise",
				polishStrategy: "Ćwiczenia fizyczne",
				method: "Aerobic exercise to increase BDNF",
				polishMethod: "Ćwiczenia aerobowe zwiększające BDNF",
				effectiveness: 0.7,
				timeframe: "8-12 weeks",
				implementation: "150 minutes moderate aerobic exercise per week",
				polishImplementation:
					"150 minut umiarkowanych ćwiczeń aerobowych tygodniowo",
			},
		],

		visualEffect: {
			color: "#8B5CF6",
			animationSpeed: 1.5,
			showAnimation: true,
			particleEffect: true,
		},
	},
	{
		id: "adult-neurogenesis",
		name: "Adult Neurogenesis",
		polishName: "Neurogeneza dorosłych",
		type: "structural",
		description:
			"Formation of new neurons in the adult brain, primarily in the hippocampus",
		polishDescription:
			"Tworzenie nowych neuronów w dorosłym mózgu, głównie w hipokampie",

		processes: [
			{
				id: "proliferation",
				name: "Neural Progenitor Proliferation",
				polishName: "Proliferacja progenitorów neuronowych",
				mechanism: "Division of neural stem cells in the subgranular zone",
				polishMechanism:
					"Podział komórek macierzystych neuronów w strefie podgranicznej",
				stage: "induction",
				molecularComponents: ["SOX2", "Nestin", "Ki-67"],
				polishMolecularComponents: ["SOX2", "Nestyna", "Ki-67"],
			},
			{
				id: "differentiation",
				name: "Neuronal Differentiation",
				polishName: "Różnicowanie neuronowe",
				mechanism: "Progenitor cells develop into immature neurons",
				polishMechanism:
					"Komórki progenitorowe rozwijają się w niedojrzałe neurony",
				stage: "expression",
				molecularComponents: ["DCX", "PSA-NCAM", "NeuroD1"],
				polishMolecularComponents: ["DCX", "PSA-NCAM", "NeuroD1"],
			},
		],

		factors: [
			{
				factor: "Exercise",
				polishFactor: "Ćwiczenia fizyczne",
				type: "enhancing",
				strength: 0.9,
				evidenceLevel: "STRONG",
				mechanism: "Increases IGF-1 and VEGF, promoting neurogenesis",
				polishMechanism: "Zwiększa IGF-1 i VEGF, promując neurogenezę",
			},
			{
				factor: "Enriched environment",
				polishFactor: "Środowisko wzbogacone",
				type: "enhancing",
				strength: 0.8,
				evidenceLevel: "STRONG",
				mechanism: "Stimulates neural progenitor proliferation",
				polishMechanism: "Stymuluje proliferację progenitorów neuronowych",
			},
			{
				factor: "Chronic stress",
				polishFactor: "Przewlekły stres",
				type: "inhibiting",
				strength: 0.7,
				evidenceLevel: "MODERATE",
				mechanism: "Elevated cortisol suppresses neurogenesis",
				polishMechanism: "Podwyższony kortyzol hamuje neurogenezę",
			},
		],

		timescale: "weeks",
		duration: 28,
		persistence: "long-lasting",

		regions: ["Hippocampus (dentate gyrus)", "Olfactory bulb", "Striatum"],
		polishRegions: ["Hipokamp (ząbkowany)", "Opuszka węchowa", "Prążkowie"],

		strategies: [
			{
				strategy: "Aerobic exercise",
				polishStrategy: "Ćwiczenia aerobowe",
				method: "Running or cycling to increase neurogenesis",
				polishMethod: "Bieganie lub jazda na rowerze zwiększające neurogenezę",
				effectiveness: 0.9,
				timeframe: "6-8 weeks",
				implementation:
					"45 minutes moderate intensity exercise, 5 days per week",
				polishImplementation:
					"45 minut ćwiczeń o umiarkowanej intensywności, 5 dni w tygodniu",
			},
			{
				strategy: "Learning new skills",
				polishStrategy: "Nauka nowych umiejętności",
				method: "Novel cognitive challenges to stimulate neurogenesis",
				polishMethod: "Nowe wyzwania poznawcze stymulujące neurogenezę",
				effectiveness: 0.7,
				timeframe: "8-12 weeks",
				implementation: "Learn a new language, instrument, or complex skill",
				polishImplementation:
					"Naucz się nowego języka, instrumentu lub złożonej umiejętności",
			},
		],

		visualEffect: {
			color: "#F59E0B",
			animationSpeed: 0.8,
			showAnimation: true,
			particleEffect: false,
		},
	},
	{
		id: "synaptic-scaling",
		name: "Synaptic Scaling",
		polishName: "Skalowanie synaptyczne",
		type: "functional",
		description:
			"Homeostatic mechanism that adjusts synaptic strength to maintain neuronal firing rates",
		polishDescription:
			"Mechanizm homeostatyczny dostosowujący siłę synaptyczną do utrzymania częstości wyładowań neuronów",

		processes: [
			{
				id: "activity-detection",
				name: "Activity Level Detection",
				polishName: "Wykrywanie poziomu aktywności",
				mechanism: "Neurons monitor their firing rates over time",
				polishMechanism: "Neurony monitorują swoją częstość wyładowań w czasie",
				stage: "induction",
				molecularComponents: ["Calcium sensors", "CREB", "Arc"],
				polishMolecularComponents: ["Czujniki wapnia", "CREB", "Arc"],
			},
			{
				id: "strength-adjustment",
				name: "Synaptic Strength Adjustment",
				polishName: "Dostosowanie siły synaptycznej",
				mechanism: "Global scaling of synaptic weights up or down",
				polishMechanism:
					"Globalne skalowanie wag synaptycznych w górę lub w dół",
				stage: "expression",
				molecularComponents: ["AMPA receptors", "TNF-alpha", "GluR2"],
				polishMolecularComponents: ["Receptory AMPA", "TNF-alfa", "GluR2"],
			},
		],

		factors: [
			{
				factor: "Chronic inactivity",
				polishFactor: "Przewlekła nieaktywność",
				type: "enhancing",
				strength: 0.8,
				evidenceLevel: "MODERATE",
				mechanism: "Triggers synaptic upscaling to maintain activity",
				polishMechanism:
					"Wyzwala skalowanie w górę synaps do utrzymania aktywności",
			},
			{
				factor: "Sensory deprivation",
				polishFactor: "Deprywacja sensoryczna",
				type: "enhancing",
				strength: 0.7,
				evidenceLevel: "MODERATE",
				mechanism: "Leads to synaptic scaling to compensate for reduced input",
				polishMechanism:
					"Prowadzi do skalowania synaptycznego kompensującego zmniejszony input",
			},
		],

		timescale: "hours",
		duration: 12,
		persistence: "intermediate",

		regions: [
			"Visual cortex",
			"Auditory cortex",
			"Somatosensory cortex",
			"Prefrontal cortex",
		],
		polishRegions: [
			"Kora wzrokowa",
			"Kora słuchowa",
			"Kora somatosensoryczna",
			"Kora przedczołowa",
		],

		strategies: [
			{
				strategy: "Sensory enrichment",
				polishStrategy: "Wzbogacenie sensoryczne",
				method: "Exposure to diverse sensory experiences",
				polishMethod: "Ekspozycja na różnorodne doświadczenia sensoryczne",
				effectiveness: 0.6,
				timeframe: "2-4 weeks",
				implementation:
					"Regular exposure to new environments, textures, sounds, and experiences",
				polishImplementation:
					"Regularna ekspozycja na nowe środowiska, tekstury, dźwięki i doświadczenia",
			},
		],

		visualEffect: {
			color: "#10B981",
			animationSpeed: 1.0,
			showAnimation: true,
			particleEffect: false,
		},
	},
];

export interface NeuroplasticityDemonstrationProps {
	selectedMechanism?: string;
	plasticityLevel?: number;
	showAnimation?: boolean;
	onMechanismSelect?: (mechanismId: string) => void;
	onPlasticityLevelChange?: (level: number) => void;
	className?: string;
}

// Synapse component for LTP demonstration
const Synapse: React.FC<{
	mechanism: NeuroplasticityMechanism;
	plasticityLevel: number;
	showAnimation: boolean;
	position: [number, number, number];
}> = ({ mechanism, plasticityLevel, showAnimation, position }) => {
	const synapseRef = useRef<Mesh>(null);
	const [isActive, setIsActive] = useState(false);

	useFrame((state) => {
		if (!synapseRef.current || !showAnimation) return;

		const time = state.clock.getElapsedTime();

		// LTP animation
		if (plasticityLevel > 0.5) {
			const pulse =
				Math.sin(time * mechanism.visualEffect.animationSpeed * 2) * 0.5 + 0.5;
			synapseRef.current.scale.setScalar(1 + pulse * plasticityLevel * 0.4);
			synapseRef.current.material.emissiveIntensity = pulse * plasticityLevel;
			setIsActive(true);
		} else {
			synapseRef.current.scale.setScalar(1);
			synapseRef.current.material.emissiveIntensity = 0;
			setIsActive(false);
		}
	});

	return (
		<group position={position}>
			<Sphere ref={synapseRef} args={[0.15, 12, 12]}>
				<meshStandardMaterial
					color={mechanism.visualEffect.color}
					emissive={mechanism.visualEffect.color}
					emissiveIntensity={0}
					transparent
					opacity={0.8}
				/>
			</Sphere>

			{/* Synaptic activity particles */}
			{mechanism.visualEffect.particleEffect &&
				isActive &&
				Array.from({ length: 8 }).map((_, index) => (
					<Sphere
						key={index}
						args={[0.02, 6, 6]}
						position={[
							(Math.random() - 0.5) * 0.3,
							(Math.random() - 0.5) * 0.3,
							(Math.random() - 0.5) * 0.3,
						]}
					>
						<meshStandardMaterial
							color={mechanism.visualEffect.color}
							emissive={mechanism.visualEffect.color}
							emissiveIntensity={0.8}
							transparent
							opacity={0.7}
						/>
					</Sphere>
				))}

			{/* Mechanism label */}
			<Html position={[0, 0.3, 0]} center>
				<div className="rounded border bg-white/90 px-2 py-1 font-medium text-xs shadow-lg backdrop-blur-sm">
					{mechanism.polishName}
				</div>
			</Html>
		</group>
	);
};

// Neurogenesis cell component
const NeurogenesisCell: React.FC<{
	mechanism: NeuroplasticityMechanism;
	plasticityLevel: number;
	showAnimation: boolean;
	position: [number, number, number];
	stage: "progenitor" | "immature" | "mature";
}> = ({ mechanism, plasticityLevel, showAnimation, position, stage }) => {
	const cellRef = useRef<Mesh>(null);

	useFrame((state) => {
		if (!cellRef.current || !showAnimation) return;

		const time = state.clock.getElapsedTime();

		// Cell development animation
		if (plasticityLevel > 0.3) {
			const development = Math.min(plasticityLevel * 3, 1);
			const pulse =
				Math.sin(time * mechanism.visualEffect.animationSpeed) * 0.2 + 0.8;
			cellRef.current.scale.setScalar(development * pulse);

			// Color change based on maturation stage
			const colors = {
				progenitor: "#F59E0B",
				immature: "#F97316",
				mature: "#059669",
			};
			cellRef.current.material.color.setStyle(colors[stage]);
		}
	});

	const stageColors = {
		progenitor: "#F59E0B",
		immature: "#F97316",
		mature: "#059669",
	};

	return (
		<group position={position}>
			<Sphere ref={cellRef} args={[0.08, 8, 8]}>
				<meshStandardMaterial
					color={stageColors[stage]}
					emissive={stageColors[stage]}
					emissiveIntensity={plasticityLevel > 0.3 ? 0.5 : 0}
					transparent
					opacity={0.9}
				/>
			</Sphere>

			{/* Development stage indicator */}
			<Html position={[0, 0.15, 0]} center>
				<Badge variant="outline" className="text-xs">
					{stage === "progenitor"
						? "Progenitor"
						: stage === "immature"
							? "Niedojrzały"
							: "Dojrzały"}
				</Badge>
			</Html>
		</group>
	);
};

// Main neuroplasticity model
const NeuroplasticityModel: React.FC<{
	selectedMechanism: string | null;
	plasticityLevel: number;
	showAnimation: boolean;
	onMechanismClick: (mechanismId: string) => void;
}> = ({
	selectedMechanism,
	plasticityLevel,
	showAnimation,
	onMechanismClick,
}) => {
	const mechanisms = selectedMechanism
		? neuroplasticityMechanisms.filter((m) => m.id === selectedMechanism)
		: neuroplasticityMechanisms;

	return (
		<>
			{mechanisms.map((mechanism) => (
				<group key={mechanism.id}>
					{/* LTP Synapse visualization */}
					{mechanism.type === "synaptic" && (
						<Synapse
							mechanism={mechanism}
							plasticityLevel={plasticityLevel}
							showAnimation={showAnimation}
							position={[0, 0.5, 0]}
						/>
					)}

					{/* Neurogenesis visualization */}
					{mechanism.type === "structural" && (
						<>
							{/* Progenitor cells */}
							<NeurogenesisCell
								mechanism={mechanism}
								plasticityLevel={plasticityLevel}
								showAnimation={showAnimation}
								position={[-0.3, 0.2, 0]}
								stage="progenitor"
							/>
							{/* Immature neurons */}
							<NeurogenesisCell
								mechanism={mechanism}
								plasticityLevel={plasticityLevel}
								showAnimation={showAnimation}
								position={[0, 0.2, 0]}
								stage="immature"
							/>
							{/* Mature neurons */}
							<NeurogenesisCell
								mechanism={mechanism}
								plasticityLevel={plasticityLevel}
								showAnimation={showAnimation}
								position={[0.3, 0.2, 0]}
								stage="mature"
							/>
						</>
					)}

					{/* Synaptic scaling visualization */}
					{mechanism.type === "functional" && (
						<>
							{/* Network of synapses showing scaling */}
							{Array.from({ length: 5 }).map((_, index) => (
								<Sphere
									key={index}
									args={[0.1 * (plasticityLevel > 0.5 ? 1.2 : 0.8), 8, 8]}
									position={[
										(Math.random() - 0.5) * 0.8,
										(Math.random() - 0.5) * 0.8,
										(Math.random() - 0.5) * 0.8,
									]}
								>
									<meshStandardMaterial
										color={mechanism.visualEffect.color}
										emissive={mechanism.visualEffect.color}
										emissiveIntensity={plasticityLevel > 0.5 ? 0.3 : 0}
										transparent
										opacity={0.7}
									/>
								</Sphere>
							))}
						</>
					)}
				</group>
			))}

			{/* Brain region outline */}
			<Sphere args={[2.5, 64, 64]} position={[0, 0, 0]}>
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

const NeuroplasticityDemonstration: React.FC<
	NeuroplasticityDemonstrationProps
> = ({
	selectedMechanism,
	plasticityLevel = 0,
	showAnimation = false,
	onMechanismSelect,
	onPlasticityLevelChange,
	className = "",
}) => {
	const [selectedMechanismData, setSelectedMechanismData] =
		useState<NeuroplasticityMechanism | null>(null);
	const [showControls, setShowControls] = useState(true);
	const [localPlasticityLevel, setLocalPlasticityLevel] =
		useState(plasticityLevel);
	const [localShowAnimation, setLocalShowAnimation] = useState(showAnimation);

	const handleMechanismClick = (mechanismId: string) => {
		setSelectedMechanismData(
			neuroplasticityMechanisms.find((m) => m.id === mechanismId) || null,
		);
		onMechanismSelect?.(mechanismId);
	};

	const handlePlasticityLevelChange = (value: number) => {
		setLocalPlasticityLevel(value);
		onPlasticityLevelChange?.(value);
	};

	return (
		<div className={`relative h-full w-full ${className}`}>
			{/* 3D Canvas */}
			<div className="h-[600px] w-full overflow-hidden rounded-lg bg-gradient-to-b from-purple-50 to-white">
				<Canvas>
					<PerspectiveCamera makeDefault position={[3, 2, 3]} />
					<OrbitControls enablePan enableZoom enableRotate />

					{/* Lighting */}
					<ambientLight intensity={0.6} />
					<directionalLight position={[10, 10, 5]} intensity={1.0} />
					<pointLight position={[-10, -10, -5]} intensity={0.3} />

					{/* Environment */}
					<Environment preset="sunset" />

					{/* Neuroplasticity model */}
					<Suspense fallback={null}>
						<NeuroplasticityModel
							selectedMechanism={selectedMechanism || null}
							plasticityLevel={localPlasticityLevel}
							showAnimation={localShowAnimation}
							onMechanismClick={handleMechanismClick}
						/>
					</Suspense>

					{/* Ground shadow */}
					<ContactShadows
						position={[0, -3, 0]}
						opacity={0.2}
						scale={10}
						blur={2}
						far={4}
					/>
				</Canvas>
			</div>

			{/* Controls overlay */}
			{showControls && (
				<div className="absolute top-4 left-4 space-y-2">
					<Card className="w-72">
						<CardHeader className="pb-2">
							<CardTitle className="flex items-center gap-2 text-sm">
								<Sparkles className="h-4 w-4" />
								Neuroplastyczność
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3">
							<div className="space-y-1">
								<span className="text-xs">Poziom plastyczności</span>
								<Slider
									value={[localPlasticityLevel]}
									onValueChange={([value]) =>
										handlePlasticityLevelChange(value || 0)
									}
									min={0}
									max={1}
									step={0.1}
									className="w-full"
								/>
								<div className="text-gray-500 text-xs">
									{Math.round(localPlasticityLevel * 100)}%
								</div>
							</div>

							<div className="flex items-center justify-between">
								<span className="text-xs">Pokaż animację</span>
								<Switch
									checked={localShowAnimation}
									onCheckedChange={setLocalShowAnimation}
								/>
							</div>
						</CardContent>
					</Card>

					{/* Mechanism selector */}
					<Card className="w-72">
						<CardHeader className="pb-2">
							<CardTitle className="text-sm">
								Mechanizmy plastyczności
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-2">
							{neuroplasticityMechanisms.map((mechanism) => (
								<Button
									key={mechanism.id}
									size="sm"
									variant={
										selectedMechanism === mechanism.id ? "default" : "outline"
									}
									className="h-8 w-full justify-start text-xs"
									onClick={() => handleMechanismClick(mechanism.id)}
								>
									<div
										className="mr-2 h-2 w-2 rounded-full"
										style={{ backgroundColor: mechanism.visualEffect.color }}
									/>
									{mechanism.polishName}
								</Button>
							))}
						</CardContent>
					</Card>
				</div>
			)}

			{/* Mechanism info panel */}
			{selectedMechanismData && (
				<div className="absolute top-4 right-4 w-80">
					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="flex items-center gap-2 text-sm">
								<Brain className="h-4 w-4" />
								{selectedMechanismData.polishName}
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3">
							<div>
								<h4 className="mb-1 font-medium text-xs">Typ:</h4>
								<Badge variant="secondary" className="text-xs">
									{selectedMechanismData.type}
								</Badge>
							</div>

							<div>
								<h4 className="mb-1 font-medium text-xs">Opis:</h4>
								<p className="text-gray-600 text-xs">
									{selectedMechanismData.polishDescription}
								</p>
							</div>

							<div>
								<h4 className="mb-1 font-medium text-xs">Skala czasowa:</h4>
								<Badge variant="outline" className="text-xs">
									{selectedMechanismData.timescale}
								</Badge>
							</div>

							<div>
								<h4 className="mb-1 font-medium text-xs">Trwałość:</h4>
								<Badge variant="outline" className="text-xs">
									{selectedMechanismData.persistence}
								</Badge>
							</div>

							<div>
								<h4 className="mb-1 font-medium text-xs">Regiony mózgu:</h4>
								<div className="flex flex-wrap gap-1">
									{selectedMechanismData.polishRegions.map((region, index) => (
										<Badge key={index} variant="outline" className="text-xs">
											{region}
										</Badge>
									))}
								</div>
							</div>

							{localPlasticityLevel > 0.3 && (
								<div>
									<h4 className="mb-1 font-medium text-xs">Aktywność:</h4>
									<Progress
										value={localPlasticityLevel * 100}
										className="w-full"
									/>
									<div className="mt-1 text-gray-500 text-xs">
										{localPlasticityLevel > 0.7
											? "Wysoka plastyczność"
											: localPlasticityLevel > 0.4
												? "Średnia plastyczność"
												: "Niska plastyczność"}
									</div>
								</div>
							)}
						</CardContent>
					</Card>
				</div>
			)}

			{/* Enhancement strategies panel */}
			{selectedMechanismData && localPlasticityLevel > 0.3 && (
				<div className="absolute right-4 bottom-4 w-80">
					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="flex items-center gap-2 text-sm">
								<Zap className="h-4 w-4" />
								Strategie wzmacniania
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-2">
							{selectedMechanismData.strategies.map((strategy, index) => (
								<div key={index} className="rounded border p-2">
									<div className="font-medium text-xs">
										{strategy.polishStrategy}
									</div>
									<div className="mt-1 text-gray-600 text-xs">
										{strategy.polishMethod}
									</div>
									<div className="mt-1 flex items-center gap-2">
										<Progress
											value={strategy.effectiveness * 100}
											className="flex-1"
										/>
										<span className="text-gray-500 text-xs">
											{Math.round(strategy.effectiveness * 100)}%
										</span>
									</div>
								</div>
							))}
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

export default NeuroplasticityDemonstration;

// Export neuroplasticity mechanisms data for use in other components
export { neuroplasticityMechanisms };
