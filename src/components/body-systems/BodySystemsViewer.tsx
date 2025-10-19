"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type {
	AnatomicalStructure,
	AnimationConfig,
	BODY_SYSTEMS,
	BodySystem,
	DEFAULT_VIEW_MODES,
	InteractionConfig,
	ViewMode,
} from "@/types/body-systems";
import {
	Box,
	ContactShadows,
	Environment,
	OrbitControls,
	PerspectiveCamera,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import {
	Activity,
	Bone,
	Eye,
	EyeOff,
	Heart,
	Info,
	Pause,
	Play,
	RotateCcw,
	Settings,
	Shield,
	Wind,
	Zap,
	ZoomIn,
	ZoomOut,
} from "lucide-react";
import { Suspense, useCallback, useState } from "react";
import { InteractiveOrgan } from "./InteractiveOrgan";

interface BodySystemsViewerProps {
	selectedSupplements?: string[];
	currentSystem?: string;
	onSystemChange?: (systemId: string) => void;
	onOrganSelect?: (organId: string) => void;
	className?: string;
}

// Mock anatomical data for each system
const mockAnatomicalData: Record<string, AnatomicalStructure[]> = {
	skeletal: [
		{
			id: "skull",
			name: "Skull",
			polishName: "Czaszka",
			position: [0, 1.5, 0],
			color: "#E5E7EB",
			size: 0.8,
			category: BODY_SYSTEMS[0],
			system: "skeletal",
			polishSystem: "Układ szkieletowy",
		},
		{
			id: "spine",
			name: "Spine",
			polishName: "Kręgosłup",
			position: [0, 0, 0],
			color: "#E5E7EB",
			size: 1.2,
			category: BODY_SYSTEMS[0],
			system: "skeletal",
			polishSystem: "Układ szkieletowy",
		},
		{
			id: "ribs",
			name: "Ribs",
			polishName: "Żebra",
			position: [0, 0.5, 0.8],
			color: "#E5E7EB",
			size: 0.9,
			category: BODY_SYSTEMS[0],
			system: "skeletal",
			polishSystem: "Układ szkieletowy",
		},
	],
	muscular: [
		{
			id: "biceps",
			name: "Biceps Brachii",
			polishName: "Mięsień dwugłowy ramienia",
			position: [0.8, 0.5, 0],
			color: "#DC2626",
			size: 0.6,
			category: BODY_SYSTEMS[1],
			system: "muscular",
			polishSystem: "Układ mięśniowy",
		},
		{
			id: "quadriceps",
			name: "Quadriceps",
			polishName: "Mięsień czworogłowy",
			position: [0, -0.5, 0.5],
			color: "#DC2626",
			size: 0.7,
			category: BODY_SYSTEMS[1],
			system: "muscular",
			polishSystem: "Układ mięśniowy",
		},
	],
	respiratory: [
		{
			id: "lungs",
			name: "Lungs",
			polishName: "Płuca",
			position: [0, 0.5, 0.5],
			color: "#2563EB",
			size: 0.8,
			category: BODY_SYSTEMS[2],
			system: "respiratory",
			polishSystem: "Układ oddechowy",
		},
		{
			id: "diaphragm",
			name: "Diaphragm",
			polishName: "Przepona",
			position: [0, -0.2, 0.5],
			color: "#2563EB",
			size: 0.5,
			category: BODY_SYSTEMS[2],
			system: "respiratory",
			polishSystem: "Układ oddechowy",
		},
	],
	nervous: [
		{
			id: "brain",
			name: "Brain",
			polishName: "Mózg",
			position: [0, 1.2, 0],
			color: "#7C3AED",
			size: 0.9,
			category: BODY_SYSTEMS[3],
			system: "nervous",
			polishSystem: "Układ nerwowy",
		},
		{
			id: "spinal-cord",
			name: "Spinal Cord",
			polishName: "Rdzeń kręgowy",
			position: [0, 0, 0],
			color: "#7C3AED",
			size: 0.6,
			category: BODY_SYSTEMS[3],
			system: "nervous",
			polishSystem: "Układ nerwowy",
		},
	],
	endocrine: [
		{
			id: "thyroid",
			name: "Thyroid Gland",
			polishName: "Tarczyca",
			position: [0, 0.8, 0.8],
			color: "#059669",
			size: 0.4,
			category: BODY_SYSTEMS[4],
			system: "endocrine",
			polishSystem: "Układ hormonalny",
		},
		{
			id: "adrenals",
			name: "Adrenal Glands",
			polishName: "Nadnercza",
			position: [0.5, 0.2, 1],
			color: "#059669",
			size: 0.3,
			category: BODY_SYSTEMS[4],
			system: "endocrine",
			polishSystem: "Układ hormonalny",
		},
	],
	reproductive: [
		{
			id: "heart-male",
			name: "Testes",
			polishName: "Jądra",
			position: [0, -1, 0.5],
			color: "#BE123C",
			size: 0.4,
			category: BODY_SYSTEMS[5],
			system: "reproductive",
			polishSystem: "Układ rozrodczy",
		},
		{
			id: "uterus",
			name: "Uterus",
			polishName: "Macica",
			position: [0, -0.8, 0.5],
			color: "#BE123C",
			size: 0.5,
			category: BODY_SYSTEMS[5],
			system: "reproductive",
			polishSystem: "Układ rozrodczy",
		},
	],
	integumentary: [
		{
			id: "skin",
			name: "Skin",
			polishName: "Skóra",
			position: [0, 0, 1.5],
			color: "#F59E0B",
			size: 1.0,
			category: BODY_SYSTEMS[6],
			system: "integumentary",
			polishSystem: "Układ powłokowy",
		},
	],
};

// Main 3D scene component
const BodySystemsScene: React.FC<{
	currentSystem: string;
	selectedOrgan: string | null;
	selectedSupplements: string[];
	animationConfig: AnimationConfig;
	interactionConfig: InteractionConfig;
	currentViewMode: ViewMode;
	onOrganClick: (organId: string) => void;
	onOrganHover: (organId: string | null) => void;
}> = ({
	currentSystem,
	selectedOrgan,
	selectedSupplements,
	animationConfig,
	interactionConfig,
	currentViewMode,
	onOrganClick,
	onOrganHover,
}) => {
	const organs = mockAnatomicalData[currentSystem] || [];

	return (
		<>
			{/* Camera based on view mode */}
			<PerspectiveCamera
				makeDefault
				position={currentViewMode.cameraPosition}
				fov={50}
			/>

			{/* Controls */}
			<OrbitControls
				enablePan={interactionConfig.enablePan}
				enableZoom={interactionConfig.enableZoom}
				enableRotate={interactionConfig.enableRotate}
				target={currentViewMode.cameraTarget}
				maxDistance={10}
				minDistance={2}
			/>

			{/* Lighting */}
			<ambientLight intensity={0.4} />
			<directionalLight position={[10, 10, 5]} intensity={0.8} />
			<pointLight position={[-10, -10, -5]} intensity={0.3} />

			{/* Environment */}
			<Environment preset="studio" />

			{/* Body outline/structure */}
			<Sphere args={[2.8, 32, 32]} position={[0, 0, 0]}>
				<meshStandardMaterial
					color="#F3F4F6"
					transparent
					opacity={0.05}
					wireframe
				/>
			</Sphere>

			{/* Render organs */}
			{organs.map((organ) => (
				<InteractiveOrgan
					key={organ.id}
					organ={organ}
					isSelected={selectedOrgan === organ.id}
					isHovered={false}
					supplementEffects={[]} // TODO: Add supplement effects based on selectedSupplements
					animationSpeed={animationConfig.speed}
					showLabels={animationConfig.showLabels}
					onClick={() => onOrganClick(organ.id)}
					onHover={(hovered) => onOrganHover(hovered ? organ.id : null)}
				/>
			))}

			{/* Ground shadow */}
			<ContactShadows
				position={[0, -3, 0]}
				opacity={0.3}
				scale={10}
				blur={2}
				far={4}
			/>
		</>
	);
};

// Main viewer component
export const BodySystemsViewer: React.FC<BodySystemsViewerProps> = ({
	selectedSupplements = [],
	currentSystem = "skeletal",
	onSystemChange,
	onOrganSelect,
	className = "",
}) => {
	const [selectedOrgan, setSelectedOrgan] = useState<string | null>(null);
	const [showControls, setShowControls] = useState(true);
	const [animationConfig, setAnimationConfig] = useState<AnimationConfig>({
		speed: 1,
		intensity: 1,
		showPathways: false,
		showLabels: true,
		showConnections: false,
	});
	const [interactionConfig] = useState<InteractionConfig>({
		enableHover: true,
		enableClick: true,
		enableZoom: true,
		enablePan: true,
		enableRotate: true,
		touchOptimized: false,
	});
	const [currentViewMode, setCurrentViewMode] = useState<ViewMode>(
		DEFAULT_VIEW_MODES[currentSystem]?.[0] || DEFAULT_VIEW_MODES.skeletal[0],
	);
	const [isPlaying, setIsPlaying] = useState(true);

	const handleOrganClick = useCallback(
		(organId: string) => {
			setSelectedOrgan(organId);
			onOrganSelect?.(organId);
		},
		[onOrganSelect],
	);

	const handleOrganHover = useCallback((organId: string | null) => {
		// Handle hover effects if needed
	}, []);

	const handleSystemChange = useCallback(
		(systemId: string) => {
			onSystemChange?.(systemId);
			setSelectedOrgan(null);
			// Update view mode when system changes
			const defaultViewMode = DEFAULT_VIEW_MODES[systemId]?.[0];
			if (defaultViewMode) {
				setCurrentViewMode(defaultViewMode);
			}
		},
		[onSystemChange],
	);

	const selectedOrganData = selectedOrgan
		? Object.values(mockAnatomicalData)
				.flat()
				.find((o) => o.id === selectedOrgan)
		: null;

	return (
		<div className={`relative h-full w-full ${className}`}>
			{/* 3D Canvas */}
			<div className="h-[600px] w-full overflow-hidden rounded-lg bg-gradient-to-b from-blue-50 to-white">
				<Canvas>
					<Suspense fallback={null}>
						<BodySystemsScene
							currentSystem={currentSystem}
							selectedOrgan={selectedOrgan}
							selectedSupplements={selectedSupplements}
							animationConfig={animationConfig}
							interactionConfig={interactionConfig}
							currentViewMode={currentViewMode}
							onOrganClick={handleOrganClick}
							onOrganHover={handleOrganHover}
						/>
					</Suspense>
				</Canvas>
			</div>

			{/* System selection tabs */}
			<div className="absolute top-4 left-4">
				<Card className="w-72">
					<CardHeader className="pb-2">
						<CardTitle className="flex items-center gap-2 text-sm">
							<Activity className="h-4 w-4" />
							Układ ciała
						</CardTitle>
					</CardHeader>
					<CardContent>
						<Tabs value={currentSystem} onValueChange={handleSystemChange}>
							<TabsList className="grid w-full grid-cols-2">
								{BODY_SYSTEMS.map((system) => (
									<TabsTrigger
										key={system.id}
										value={system.id}
										className="text-xs"
									>
										{system.polishName}
									</TabsTrigger>
								))}
							</TabsList>
						</Tabs>
					</CardContent>
				</Card>
			</div>

			{/* Controls overlay */}
			{showControls && (
				<div className="absolute top-4 right-4 space-y-2">
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
									value={[animationConfig.speed]}
									onValueChange={([value]) =>
										setAnimationConfig((prev) => ({
											...prev,
											speed: value || 1,
										}))
									}
									min={0.1}
									max={3}
									step={0.1}
									className="w-full"
								/>
							</div>

							<div className="flex items-center justify-between">
								<span className="text-xs">Etykiety</span>
								<Switch
									checked={animationConfig.showLabels}
									onCheckedChange={(checked) =>
										setAnimationConfig((prev) => ({
											...prev,
											showLabels: checked,
										}))
									}
								/>
							</div>
						</CardContent>
					</Card>
				</div>
			)}

			{/* Organ info panel */}
			{selectedOrganData && (
				<div className="absolute bottom-4 left-4 w-80">
					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="flex items-center gap-2 text-sm">
								<Info className="h-4 w-4" />
								{selectedOrganData.polishName}
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-2">
							<div className="flex items-center gap-2">
								<Badge variant="outline" className="text-xs">
									{selectedOrganData.polishSystem}
								</Badge>
								<Badge variant="secondary" className="text-xs">
									{selectedOrganData.category.polishName}
								</Badge>
							</div>

							<div className="text-gray-600 text-xs">
								<strong>Położenie:</strong>{" "}
								{selectedOrganData.position.join(", ")}
							</div>

							<div className="text-gray-600 text-xs">
								<strong>Rozmiar:</strong> {selectedOrganData.size}
							</div>
						</CardContent>
					</Card>
				</div>
			)}

			{/* Toggle controls button */}
			<Button
				size="sm"
				variant="outline"
				className="absolute right-4 bottom-4"
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
