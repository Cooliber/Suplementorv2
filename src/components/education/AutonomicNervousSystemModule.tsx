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
	AlertTriangle,
	Brain,
	Eye,
	EyeOff,
	Heart,
	Info,
	Lungs,
	Settings,
	Shield,
	Zap,
} from "lucide-react";
import type React from "react";
import { Suspense, useEffect, useRef, useState } from "react";
import { Color, type Group, type Mesh } from "three";

// Autonomic nervous system interfaces
export interface AutonomicSystem {
	id: string;
	name: string;
	polishName: string;
	division: "sympathetic" | "parasympathetic" | "enteric";
	description: string;
	polishDescription: string;

	// Neural pathways
	pathways: AutonomicPathway[];
	organs: AutonomicOrgan[];

	// Neurotransmitters
	primaryNeurotransmitters: string[];
	polishPrimaryNeurotransmitters: string[];
	receptorTypes: string[];
	polishReceptorTypes: string[];

	// Functions
	functions: string[];
	polishFunctions: string[];
	homeostaticRole: string;
	polishHomeostaticRole: string;

	// Stress response
	stressResponse: StressResponseProfile;

	// Clinical relevance
	associatedDisorders: string[];
	polishAssociatedDisorders: string[];
	therapeuticTargets: string[];
	polishTherapeuticTargets: string[];

	// Visual properties
	visualEffect: {
		color: string;
		animationSpeed: number;
		showActivity: boolean;
	};
}

export interface AutonomicPathway {
	id: string;
	name: string;
	polishName: string;
	origin: string;
	target: string;
	pathPoints: [number, number, number][];
	function: string;
	polishFunction: string;
	activity: number; // 0-1
}

export interface AutonomicOrgan {
	id: string;
	name: string;
	polishName: string;
	position: [number, number, number];
	system: "sympathetic" | "parasympathetic";
	function: string;
	polishFunction: string;
	innervation: string;
	polishInnervation: string;
	stressResponse: string;
	polishStressResponse: string;
}

export interface StressResponseProfile {
	activationThreshold: number;
	responseTime: number; // milliseconds
	duration: number; // minutes
	recoveryTime: number; // minutes
	physiologicalEffects: PhysiologicalEffect[];
	neuroendocrineCascade: NeuroendocrineStep[];
}

export interface PhysiologicalEffect {
	system: string;
	polishSystem: string;
	effect: string;
	polishEffect: string;
	intensity: number; // 0-1
	timing: "immediate" | "short-term" | "long-term";
}

export interface NeuroendocrineStep {
	step: number;
	hormone: string;
	polishHormone: string;
	source: string;
	polishSource: string;
	target: string;
	polishTarget: string;
	effect: string;
	polishEffect: string;
	timing: number; // minutes from stress onset
}

// Autonomic nervous system data
export const autonomicSystems: AutonomicSystem[] = [
	{
		id: "sympathetic-nervous-system",
		name: "Sympathetic Nervous System",
		polishName: "Układ współczulny",
		division: "sympathetic",
		description:
			"Fight-or-flight response system that mobilizes energy and increases alertness",
		polishDescription:
			"Układ odpowiedzi walcz-lub-uciekaj, który mobilizuje energię i zwiększa czujność",

		pathways: [
			{
				id: "sympathetic-cardiac",
				name: "Cardiac Sympathetic Pathway",
				polishName: "Ścieżka współczulna serca",
				origin: "thoracic-spinal-cord",
				target: "heart",
				pathPoints: [
					[0, -2.5, -1.5],
					[0.5, -1.8, -1.0],
					[1.0, -1.2, -0.5],
					[1.2, -0.6, 0],
					[1.0, 0, 0.5],
				],
				function: "Increases heart rate and contractility",
				polishFunction: "Zwiększa częstość akcji serca i kurczliwość",
				activity: 0.6,
			},
		],

		organs: [
			{
				id: "heart-sympathetic",
				name: "Heart",
				polishName: "Serce",
				position: [1.0, 0, 0.5],
				system: "sympathetic",
				function: "Increased cardiac output",
				polishFunction: "Zwiększona pojemność minutowa serca",
				innervation: "Cardiac plexus via T1-T5",
				polishInnervation: "Splot sercowy przez T1-T5",
				stressResponse: "Tachycardia and increased contractility",
				polishStressResponse: "Tachykardia i zwiększona kurczliwość",
			},
			{
				id: "lungs-sympathetic",
				name: "Lungs",
				polishName: "Płuca",
				position: [0.8, 0.5, -0.5],
				system: "sympathetic",
				function: "Bronchodilation",
				polishFunction: "Rozszerzenie oskrzeli",
				innervation: "Pulmonary plexus",
				polishInnervation: "Splot płucny",
				stressResponse: "Increased respiratory rate",
				polishStressResponse: "Zwiększona częstość oddechów",
			},
		],

		primaryNeurotransmitters: ["Norepinephrine", "Epinephrine"],
		polishPrimaryNeurotransmitters: ["Noradrenalina", "Adrenalina"],
		receptorTypes: ["α1", "α2", "β1", "β2"],
		polishReceptorTypes: ["α1", "α2", "β1", "β2"],

		functions: [
			"Fight-or-flight response",
			"Energy mobilization",
			"Increased alertness",
			"Enhanced physical performance",
			"Stress adaptation",
		],
		polishFunctions: [
			"Odpowiedź walcz-lub-uciekaj",
			"Mobilizacja energii",
			"Zwiększona czujność",
			"Wzmożona sprawność fizyczna",
			"Adaptacja do stresu",
		],
		homeostaticRole: "Rapid adaptation to threats and challenges",
		polishHomeostaticRole: "Szybka adaptacja do zagrożeń i wyzwań",

		stressResponse: {
			activationThreshold: 0.3,
			responseTime: 500,
			duration: 15,
			recoveryTime: 30,
			physiologicalEffects: [
				{
					system: "Cardiovascular",
					polishSystem: "Układ sercowo-naczyniowy",
					effect: "Increased heart rate and blood pressure",
					polishEffect: "Zwiększona częstość akcji serca i ciśnienie krwi",
					intensity: 0.8,
					timing: "immediate",
				},
				{
					system: "Respiratory",
					polishSystem: "Układ oddechowy",
					effect: "Bronchodilation and increased respiration",
					polishEffect: "Rozszerzenie oskrzeli i zwiększony oddech",
					intensity: 0.7,
					timing: "immediate",
				},
				{
					system: "Metabolic",
					polishSystem: "Metabolizm",
					effect: "Glycogenolysis and lipolysis",
					polishEffect: "Glikogenoliza i lipoliza",
					intensity: 0.9,
					timing: "short-term",
				},
			],
			neuroendocrineCascade: [
				{
					step: 1,
					hormone: "CRH",
					polishHormone: "CRH",
					source: "Hypothalamus",
					polishSource: "Podwzgórze",
					target: "Pituitary gland",
					polishTarget: "Przysadka mózgowa",
					effect: "ACTH release stimulation",
					polishEffect: "Stymulacja uwalniania ACTH",
					timing: 2,
				},
				{
					step: 2,
					hormone: "ACTH",
					polishHormone: "ACTH",
					source: "Pituitary gland",
					polishSource: "Przysadka mózgowa",
					target: "Adrenal cortex",
					polishTarget: "Kora nadnerczy",
					effect: "Cortisol synthesis",
					polishEffect: "Synteza kortyzolu",
					timing: 8,
				},
			],
		},

		associatedDisorders: [
			"Hypertension",
			"Anxiety disorders",
			"Panic disorder",
			"Pheochromocytoma",
			"Autonomic neuropathy",
		],
		polishAssociatedDisorders: [
			"Nadciśnienie tętnicze",
			"Zaburzenia lękowe",
			"Zaburzenie paniczne",
			"Guz chromochłonny",
			"Neuropatia autonomiczna",
		],
		therapeuticTargets: [
			"Beta-adrenergic receptors",
			"Alpha-adrenergic receptors",
			"Sympathetic ganglia",
			"Adrenal medulla",
		],
		polishTherapeuticTargets: [
			"Receptory beta-adrenergiczne",
			"Receptory alfa-adrenergiczne",
			"Ganglia współczulne",
			"Rdzeń nadnerczy",
		],

		visualEffect: {
			color: "#EF4444",
			animationSpeed: 2.0,
			showActivity: true,
		},
	},
	{
		id: "parasympathetic-nervous-system",
		name: "Parasympathetic Nervous System",
		polishName: "Układ przywspółczulny",
		division: "parasympathetic",
		description:
			"Rest-and-digest system that conserves energy and promotes recovery",
		polishDescription:
			"Układ odpocznij-i-traw, który oszczędza energię i promuje regenerację",

		pathways: [
			{
				id: "parasympathetic-cardiac",
				name: "Cardiac Parasympathetic Pathway",
				polishName: "Ścieżka przywspółczulna serca",
				origin: "vagus-nerve",
				target: "heart",
				pathPoints: [
					[0, -2.8, -1.8],
					[-0.3, -2.0, -1.2],
					[-0.5, -1.3, -0.6],
					[-0.6, -0.7, 0],
					[-0.5, 0, 0.5],
				],
				function: "Decreases heart rate and promotes relaxation",
				polishFunction: "Zmniejsza częstość akcji serca i promuje relaksację",
				activity: 0.4,
			},
		],

		organs: [
			{
				id: "heart-parasympathetic",
				name: "Heart",
				polishName: "Serce",
				position: [-1.0, 0, 0.5],
				system: "parasympathetic",
				function: "Bradycardia and reduced contractility",
				polishFunction: "Bradykardia i zmniejszona kurczliwość",
				innervation: "Vagus nerve (CN X)",
				polishInnervation: "Nerw błędny (CN X)",
				stressResponse: "Heart rate reduction and recovery",
				polishStressResponse: "Redukcja częstości akcji serca i regeneracja",
			},
			{
				id: "digestive-parasympathetic",
				name: "Digestive System",
				polishName: "Układ trawienny",
				position: [0, -1.5, 0],
				system: "parasympathetic",
				function: "Increased motility and secretion",
				polishFunction: "Zwiększona perystaltyka i wydzielanie",
				innervation: "Vagus nerve and pelvic splanchnic nerves",
				polishInnervation: "Nerw błędny i nerwy trzewne miedniczne",
				stressResponse: "Enhanced digestion during recovery",
				polishStressResponse: "Wzmożone trawienie podczas regeneracji",
			},
		],

		primaryNeurotransmitters: ["Acetylcholine"],
		polishPrimaryNeurotransmitters: ["Acetylocholina"],
		receptorTypes: ["M2", "M3"],
		polishReceptorTypes: ["M2", "M3"],

		functions: [
			"Rest and digest",
			"Energy conservation",
			"Immune function",
			"Reproduction",
			"Growth and repair",
		],
		polishFunctions: [
			"Odpoczynek i trawienie",
			"Oszczędzanie energii",
			"Funkcja immunologiczna",
			"Reprodukcja",
			"Wzrost i naprawa",
		],
		homeostaticRole: "Maintenance of baseline physiological function",
		polishHomeostaticRole: "Utrzymanie podstawowej funkcji fizjologicznej",

		stressResponse: {
			activationThreshold: 0.1,
			responseTime: 2000,
			duration: 60,
			recoveryTime: 20,
			physiologicalEffects: [
				{
					system: "Cardiovascular",
					polishSystem: "Układ sercowo-naczyniowy",
					effect: "Decreased heart rate and blood pressure",
					polishEffect: "Zmniejszona częstość akcji serca i ciśnienie krwi",
					intensity: 0.6,
					timing: "short-term",
				},
				{
					system: "Digestive",
					polishSystem: "Trawienny",
					effect: "Increased motility and enzyme secretion",
					polishEffect: "Zwiększona perystaltyka i wydzielanie enzymów",
					intensity: 0.8,
					timing: "short-term",
				},
			],
			neuroendocrineCascade: [
				{
					step: 1,
					hormone: "Acetylcholine",
					polishHormone: "Acetylocholina",
					source: "Parasympathetic nerves",
					polishSource: "Nerwy przywspółczulne",
					target: "Target organs",
					polishTarget: "Organy docelowe",
					effect: "Direct organ stimulation",
					polishEffect: "Bezpośrednia stymulacja organów",
					timing: 1,
				},
			],
		},

		associatedDisorders: [
			"Vagal neuropathy",
			"Bradycardia",
			"Digestive disorders",
			"Sexual dysfunction",
			"Urinary retention",
		],
		polishAssociatedDisorders: [
			"Neuropatia nerwu błędnego",
			"Bradykardia",
			"Zaburzenia trawienne",
			"Dysfunkcja seksualna",
			"Zatrzymanie moczu",
		],
		therapeuticTargets: [
			"Muscarinic receptors",
			"Vagus nerve",
			"Parasympathetic ganglia",
			"Acetylcholine esterase",
		],
		polishTherapeuticTargets: [
			"Receptory muskarynowe",
			"Nerw błędny",
			"Ganglia przywspółczulne",
			"Acetylocholinoesteraza",
		],

		visualEffect: {
			color: "#10B981",
			animationSpeed: 0.8,
			showActivity: true,
		},
	},
];

export interface AutonomicNervousSystemModuleProps {
	selectedSystem?: string;
	stressLevel?: number;
	showStressResponse?: boolean;
	onSystemSelect?: (systemId: string) => void;
	onStressLevelChange?: (level: number) => void;
	className?: string;
}

// Organ component
const AutonomicOrgan: React.FC<{
	organ: AutonomicOrgan;
	system: AutonomicSystem;
	stressLevel: number;
	showStressResponse: boolean;
	onClick: () => void;
}> = ({ organ, system, stressLevel, showStressResponse, onClick }) => {
	const meshRef = useRef<Mesh>(null);

	useFrame((state) => {
		if (!meshRef.current) return;

		const time = state.clock.getElapsedTime();

		// Stress response animation
		if (showStressResponse && stressLevel > 0.3) {
			const stressIntensity =
				stressLevel * (organ.system === "sympathetic" ? 1 : -0.5);
			const pulse = Math.sin(time * 3) * 0.2 + 0.8;
			meshRef.current.scale.setScalar(1 + pulse * stressIntensity * 0.3);
			meshRef.current.material.emissiveIntensity =
				Math.abs(stressIntensity) * 0.5;
		}
	});

	const organColor = organ.system === "sympathetic" ? "#EF4444" : "#10B981";

	return (
		<group position={organ.position}>
			<Sphere ref={meshRef} args={[0.3, 12, 12]} onClick={onClick}>
				<meshStandardMaterial
					color={organColor}
					emissive={organColor}
					emissiveIntensity={0}
					transparent
					opacity={0.8}
				/>
			</Sphere>

			{/* Organ label */}
			<Html position={[0, 0.4, 0]} center>
				<div className="rounded border bg-white/90 px-2 py-1 font-medium text-xs shadow-lg backdrop-blur-sm">
					{organ.polishName}
				</div>
			</Html>

			{/* System badge */}
			<Html position={[0, -0.4, 0]} center>
				<Badge variant="outline" className="text-xs">
					{organ.system === "sympathetic" ? "Współczulny" : "Przywspółczulny"}
				</Badge>
			</Html>
		</group>
	);
};

// Stress response visualization
const StressResponseVisualization: React.FC<{
	stressLevel: number;
	selectedSystem: AutonomicSystem;
}> = ({ stressLevel, selectedSystem }) => {
	const [currentStep, setCurrentStep] = useState(0);

	useFrame((state) => {
		if (stressLevel < 0.3) {
			setCurrentStep(0);
			return;
		}

		const time = state.clock.getElapsedTime();
		const elapsedMinutes = (time * 1000) / 60000; // Convert to minutes

		// Update current step based on timing
		const step = selectedSystem.stressResponse.neuroendocrineCascade.find(
			(s) => elapsedMinutes >= s.timing,
		);

		if (step) {
			setCurrentStep(step.step);
		}
	});

	if (stressLevel < 0.3) return null;

	return (
		<>
			{/* HPA Axis visualization */}
			{selectedSystem.stressResponse.neuroendocrineCascade.map(
				(step, index) => (
					<group key={step.step}>
						{/* Hormone release points */}
						<Sphere
							args={[0.1, 8, 8]}
							position={[
								step.source === "Hypothalamus"
									? 0
									: step.source === "Pituitary gland"
										? 0
										: 0.8,
								step.source === "Hypothalamus"
									? 0.1
									: step.source === "Pituitary gland"
										? -0.2
										: -0.5,
								step.source === "Hypothalamus"
									? -0.3
									: step.source === "Pituitary gland"
										? -0.3
										: -0.3,
							]}
						>
							<meshStandardMaterial
								color={index <= currentStep ? "#F59E0B" : "#6B7280"}
								emissive={index === currentStep ? "#F59E0B" : "#000000"}
								emissiveIntensity={index === currentStep ? 0.8 : 0}
							/>
						</Sphere>

						{/* Connection lines */}
						{index <
							selectedSystem.stressResponse.neuroendocrineCascade.length -
								1 && (
							<Line
								points={[
									[
										step.source === "Hypothalamus"
											? 0
											: step.source === "Pituitary gland"
												? 0
												: 0.8,
										step.source === "Hypothalamus"
											? 0.1
											: step.source === "Pituitary gland"
												? -0.2
												: -0.5,
										step.source === "Hypothalamus"
											? -0.3
											: step.source === "Pituitary gland"
												? -0.3
												: -0.3,
									],
									[
										step.target === "Pituitary gland"
											? 0
											: step.target === "Adrenal cortex"
												? 0.8
												: 0,
										step.target === "Pituitary gland"
											? -0.2
											: step.target === "Adrenal cortex"
												? -0.5
												: 0.1,
										step.target === "Pituitary gland"
											? -0.3
											: step.target === "Adrenal cortex"
												? -0.3
												: -0.3,
									],
								]}
								color={index < currentStep ? "#F59E0B" : "#6B7280"}
								lineWidth={index === currentStep ? 0.05 : 0.02}
							/>
						)}
					</group>
				),
			)}
		</>
	);
};

// Main autonomic system model
const AutonomicSystemModel: React.FC<{
	selectedSystem: string | null;
	stressLevel: number;
	showStressResponse: boolean;
	onOrganClick: (organId: string) => void;
}> = ({ selectedSystem, stressLevel, showStressResponse, onOrganClick }) => {
	const systems = selectedSystem
		? autonomicSystems.filter((s) => s.id === selectedSystem)
		: autonomicSystems;

	return (
		<>
			{systems.map((system) => (
				<group key={system.id}>
					{/* Render organs */}
					{system.organs.map((organ) => (
						<AutonomicOrgan
							key={organ.id}
							organ={organ}
							system={system}
							stressLevel={stressLevel}
							showStressResponse={showStressResponse}
							onClick={() => onOrganClick(organ.id)}
						/>
					))}

					{/* Render pathways */}
					{system.pathways.map((pathway) => (
						<Line
							key={pathway.id}
							points={pathway.pathPoints}
							color={system.visualEffect.color}
							lineWidth={pathway.activity * 0.05}
						/>
					))}
				</group>
			))}

			{/* Stress response visualization */}
			{showStressResponse && selectedSystem && (
				<StressResponseVisualization
					stressLevel={stressLevel}
					selectedSystem={
						autonomicSystems.find((s) => s.id === selectedSystem)!
					}
				/>
			)}

			{/* Body outline for reference */}
			<Sphere args={[3.5, 64, 64]} position={[0, 0, 0]}>
				<meshStandardMaterial
					color="#E5E7EB"
					transparent
					opacity={0.02}
					wireframe
				/>
			</Sphere>
		</>
	);
};

const AutonomicNervousSystemModule: React.FC<
	AutonomicNervousSystemModuleProps
> = ({
	selectedSystem,
	stressLevel = 0,
	showStressResponse = false,
	onSystemSelect,
	onStressLevelChange,
	className = "",
}) => {
	const [selectedOrgan, setSelectedOrgan] = useState<string | null>(null);
	const [showControls, setShowControls] = useState(true);
	const [localStressLevel, setLocalStressLevel] = useState(stressLevel);
	const [localShowStressResponse, setLocalShowStressResponse] =
		useState(showStressResponse);

	const handleOrganClick = (organId: string) => {
		setSelectedOrgan(organId);
	};

	const handleStressLevelChange = (value: number) => {
		setLocalStressLevel(value);
		onStressLevelChange?.(value);
	};

	const selectedSystemData = selectedSystem
		? autonomicSystems.find((s) => s.id === selectedSystem)
		: null;

	const selectedOrganData = selectedOrgan
		? autonomicSystems
				.flatMap((s) => s.organs)
				.find((o) => o.id === selectedOrgan)
		: null;

	return (
		<div className={`relative h-full w-full ${className}`}>
			{/* 3D Canvas */}
			<div className="h-[600px] w-full overflow-hidden rounded-lg bg-gradient-to-b from-red-50 to-white">
				<Canvas>
					<PerspectiveCamera makeDefault position={[4, 2, 4]} />
					<OrbitControls enablePan enableZoom enableRotate />

					{/* Lighting */}
					<ambientLight intensity={0.6} />
					<directionalLight position={[10, 10, 5]} intensity={1.0} />
					<pointLight position={[-10, -10, -5]} intensity={0.3} />

					{/* Environment */}
					<Environment preset="sunset" />

					{/* Autonomic system model */}
					<Suspense fallback={null}>
						<AutonomicSystemModel
							selectedSystem={selectedSystem || null}
							stressLevel={localStressLevel}
							showStressResponse={localShowStressResponse}
							onOrganClick={handleOrganClick}
						/>
					</Suspense>

					{/* Ground shadow */}
					<ContactShadows
						position={[0, -4, 0]}
						opacity={0.2}
						scale={12}
						blur={3}
						far={5}
					/>
				</Canvas>
			</div>

			{/* Controls overlay */}
			{showControls && (
				<div className="absolute top-4 left-4 space-y-2">
					<Card className="w-72">
						<CardHeader className="pb-2">
							<CardTitle className="flex items-center gap-2 text-sm">
								<Settings className="h-4 w-4" />
								Układ autonomiczny
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3">
							<div className="space-y-1">
								<span className="text-xs">Poziom stresu</span>
								<Slider
									value={[localStressLevel]}
									onValueChange={([value]) =>
										handleStressLevelChange(value || 0)
									}
									min={0}
									max={1}
									step={0.1}
									className="w-full"
								/>
								<div className="text-gray-500 text-xs">
									{Math.round(localStressLevel * 100)}%
								</div>
							</div>

							<div className="flex items-center justify-between">
								<span className="text-xs">Odpowiedź na stres</span>
								<Switch
									checked={localShowStressResponse}
									onCheckedChange={setLocalShowStressResponse}
								/>
							</div>
						</CardContent>
					</Card>

					{/* System selector */}
					<Card className="w-72">
						<CardHeader className="pb-2">
							<CardTitle className="text-sm">Układy autonomiczne</CardTitle>
						</CardHeader>
						<CardContent className="space-y-2">
							{autonomicSystems.map((system) => (
								<Button
									key={system.id}
									size="sm"
									variant={selectedSystem === system.id ? "default" : "outline"}
									className="h-8 w-full justify-start text-xs"
									onClick={() => onSystemSelect?.(system.id)}
								>
									<div
										className="mr-2 h-2 w-2 rounded-full"
										style={{ backgroundColor: system.visualEffect.color }}
									/>
									{system.polishName}
								</Button>
							))}
						</CardContent>
					</Card>
				</div>
			)}

			{/* System info panel */}
			{selectedSystemData && (
				<div className="absolute top-4 right-4 w-80">
					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="flex items-center gap-2 text-sm">
								<Brain className="h-4 w-4" />
								{selectedSystemData.polishName}
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3">
							<div>
								<h4 className="mb-1 font-medium text-xs">Opis:</h4>
								<p className="text-gray-600 text-xs">
									{selectedSystemData.polishDescription}
								</p>
							</div>

							<div>
								<h4 className="mb-1 font-medium text-xs">Neuroprzekaźniki:</h4>
								<div className="flex flex-wrap gap-1">
									{selectedSystemData.polishPrimaryNeurotransmitters.map(
										(nt, index) => (
											<Badge
												key={index}
												variant="secondary"
												className="text-xs"
											>
												{nt}
											</Badge>
										),
									)}
								</div>
							</div>

							<div>
								<h4 className="mb-1 font-medium text-xs">Receptory:</h4>
								<div className="flex flex-wrap gap-1">
									{selectedSystemData.polishReceptorTypes.map(
										(receptor, index) => (
											<Badge key={index} variant="outline" className="text-xs">
												{receptor}
											</Badge>
										),
									)}
								</div>
							</div>

							<div>
								<h4 className="mb-1 font-medium text-xs">Organy:</h4>
								<div className="space-y-1">
									{selectedSystemData.organs.map((organ, index) => (
										<div key={index} className="text-gray-600 text-xs">
											• {organ.polishName}: {organ.polishFunction}
										</div>
									))}
								</div>
							</div>

							{localStressLevel > 0.3 && (
								<div>
									<h4 className="mb-1 font-medium text-xs">
										Odpowiedź na stres:
									</h4>
									<Progress value={localStressLevel * 100} className="w-full" />
									<div className="mt-1 text-gray-500 text-xs">
										{localStressLevel > 0.7
											? "Wysoki stres"
											: localStressLevel > 0.4
												? "Średni stres"
												: "Niski stres"}
									</div>
								</div>
							)}
						</CardContent>
					</Card>
				</div>
			)}

			{/* Organ info panel */}
			{selectedOrganData && (
				<div className="absolute right-4 bottom-4 w-80">
					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="flex items-center gap-2 text-sm">
								{selectedOrganData.system === "sympathetic" ? (
									<Zap className="h-4 w-4 text-red-500" />
								) : (
									<Shield className="h-4 w-4 text-green-500" />
								)}
								{selectedOrganData.polishName}
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-2">
							<div>
								<h4 className="mb-1 font-medium text-xs">Funkcja:</h4>
								<p className="text-gray-600 text-xs">
									{selectedOrganData.polishFunction}
								</p>
							</div>

							<div>
								<h4 className="mb-1 font-medium text-xs">Unerwienie:</h4>
								<p className="text-gray-600 text-xs">
									{selectedOrganData.polishInnervation}
								</p>
							</div>

							<div>
								<h4 className="mb-1 font-medium text-xs">
									Odpowiedź na stres:
								</h4>
								<p className="text-gray-600 text-xs">
									{selectedOrganData.polishStressResponse}
								</p>
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

export default AutonomicNervousSystemModule;

// Export autonomic systems data for use in other components
export { autonomicSystems };
