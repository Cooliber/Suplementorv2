"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { BODY_SYSTEMS, BodySystem, ViewMode } from "@/types/body-systems";
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
	Volume2,
	VolumeX,
	Wind,
	Zap,
	ZoomIn,
	ZoomOut,
} from "lucide-react";
import { Suspense, useCallback, useState } from "react";
import { BodySystemsViewer } from "./BodySystemsViewer";
import { MuscularSystem } from "./MuscularSystem";
import { RespiratorySystem } from "./RespiratorySystem";
import { SkeletalSystem } from "./SkeletalSystem";

interface DiagramViewerProps {
	selectedSupplements?: string[];
	currentSystem?: string;
	showAnatomyLabels?: boolean;
	showPhysiologyAnimations?: boolean;
	enableAudio?: boolean;
	onSystemChange?: (systemId: string) => void;
	onOrganSelect?: (organId: string) => void;
	className?: string;
}

// System-specific components mapping
const SYSTEM_COMPONENTS = {
	skeletal: SkeletalSystem,
	muscular: MuscularSystem,
	respiratory: RespiratorySystem,
	nervous: null, // TODO: Add NervousSystem component
	endocrine: null, // TODO: Add EndocrineSystem component
	reproductive: null, // TODO: Add ReproductiveSystem component
	integumentary: null, // TODO: Add IntegumentarySystem component
};

// Main 3D scene component that renders the selected body system
const SystemScene: React.FC<{
	currentSystem: string;
	selectedSupplements: string[];
	showAnatomyLabels: boolean;
	showPhysiologyAnimations: boolean;
	enableAudio: boolean;
	onOrganSelect?: (organId: string) => void;
}> = ({
	currentSystem,
	selectedSupplements,
	showAnatomyLabels,
	showPhysiologyAnimations,
	enableAudio,
	onOrganSelect,
}) => {
	const SystemComponent =
		SYSTEM_COMPONENTS[currentSystem as keyof typeof SYSTEM_COMPONENTS];

	if (!SystemComponent) {
		return (
			<>
				{/* Default body outline */}
				<Sphere args={[2.5, 32, 32]} position={[0, 0, 0]}>
					<meshStandardMaterial
						color="#F3F4F6"
						transparent
						opacity={0.1}
						wireframe
					/>
				</Sphere>

				{/* Placeholder text */}
				{/* <Html center>
					<div className="text-center text-gray-500">
						<p>System visualization</p>
						<p className="text-sm">Coming soon</p>
					</div>
				</Html> */}
			</>
		);
	}

	return (
		<SystemComponent
			selectedSupplements={selectedSupplements}
			animationSpeed={showPhysiologyAnimations ? 1 : 0}
			showLabels={showAnatomyLabels}
			onMuscleClick={currentSystem === "muscular" ? onOrganSelect : undefined}
			onBoneClick={currentSystem === "skeletal" ? onOrganSelect : undefined}
			onOrganClick={onOrganSelect}
		/>
	);
};

// Main diagram viewer component
export const DiagramViewer: React.FC<DiagramViewerProps> = ({
	selectedSupplements = [],
	currentSystem = "skeletal",
	showAnatomyLabels = true,
	showPhysiologyAnimations = true,
	enableAudio = false,
	onSystemChange,
	onOrganSelect,
	className = "",
}) => {
	const [selectedOrgan, setSelectedOrgan] = useState<string | null>(null);
	const [showControls, setShowControls] = useState(true);
	const [localShowAnatomyLabels, setLocalShowAnatomyLabels] =
		useState(showAnatomyLabels);
	const [localShowPhysiologyAnimations, setLocalShowPhysiologyAnimations] =
		useState(showPhysiologyAnimations);
	const [localEnableAudio, setLocalEnableAudio] = useState(enableAudio);
	const [isFullscreen, setIsFullscreen] = useState(false);

	const handleSystemChange = useCallback(
		(systemId: string) => {
			onSystemChange?.(systemId);
			setSelectedOrgan(null);
		},
		[onSystemChange],
	);

	const handleOrganSelect = useCallback(
		(organId: string) => {
			setSelectedOrgan(organId);
			onOrganSelect?.(organId);
		},
		[onOrganSelect],
	);

	const selectedOrganData = selectedOrgan
		? Object.values({
				skeletal: require("./SkeletalSystem").skeletalStructures,
				muscular: require("./MuscularSystem").muscularStructures,
				respiratory: require("./RespiratorySystem").respiratoryStructures,
			})
				.flat()
				.find((o) => o.id === selectedOrgan)
		: null;

	return (
		<div className={`relative h-full w-full ${className}`}>
			{/* Main 3D Canvas */}
			<div
				className={`h-full w-full overflow-hidden rounded-lg bg-gradient-to-b from-blue-50 to-white ${isFullscreen ? "fixed inset-0 z-50" : ""}`}
			>
				<Canvas>
					<PerspectiveCamera makeDefault position={[0, 0, 5]} />
					<OrbitControls enablePan enableZoom enableRotate />

					{/* Lighting */}
					<ambientLight intensity={0.4} />
					<directionalLight position={[10, 10, 5]} intensity={0.8} />
					<pointLight position={[-10, -10, -5]} intensity={0.3} />

					{/* Environment */}
					<Environment preset="studio" />

					{/* Body system scene */}
					<Suspense fallback={null}>
						<SystemScene
							currentSystem={currentSystem}
							selectedSupplements={selectedSupplements}
							showAnatomyLabels={localShowAnatomyLabels}
							showPhysiologyAnimations={localShowPhysiologyAnimations}
							enableAudio={localEnableAudio}
							onOrganSelect={handleOrganSelect}
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

			{/* System selection panel */}
			<div className="absolute top-4 left-4">
				<Card className="w-80">
					<CardHeader className="pb-2">
						<CardTitle className="flex items-center gap-2 text-sm">
							<Activity className="h-4 w-4" />
							Interaktywne diagramy ciała
						</CardTitle>
					</CardHeader>
					<CardContent>
						<Tabs value={currentSystem} onValueChange={handleSystemChange}>
							<TabsList className="grid w-full grid-cols-2 gap-1">
								{BODY_SYSTEMS.map((system) => (
									<TabsTrigger
										key={system.id}
										value={system.id}
										className="text-xs"
									>
										<div className="flex items-center gap-1">
											<span className="text-xs">{system.icon}</span>
											{system.polishName}
										</div>
									</TabsTrigger>
								))}
							</TabsList>
						</Tabs>

						{/* Quick system info */}
						<div className="mt-2 text-gray-600 text-xs">
							{
								BODY_SYSTEMS.find((s) => s.id === currentSystem)
									?.polishDescription
							}
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Main controls overlay */}
			{showControls && (
				<div className="absolute top-4 right-4 space-y-2">
					<Card className="w-72">
						<CardHeader className="pb-2">
							<CardTitle className="flex items-center gap-2 text-sm">
								<Settings className="h-4 w-4" />
								Kontrola wizualizacji
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3">
							{/* Animation controls */}
							<div className="flex items-center justify-between">
								<span className="text-xs">Animacje fizjologiczne</span>
								<Button
									size="sm"
									variant="outline"
									onClick={() =>
										setLocalShowPhysiologyAnimations(
											!localShowPhysiologyAnimations,
										)
									}
								>
									{localShowPhysiologyAnimations ? (
										<Pause className="h-3 w-3" />
									) : (
										<Play className="h-3 w-3" />
									)}
								</Button>
							</div>

							{/* Labels toggle */}
							<div className="flex items-center justify-between">
								<span className="text-xs">Etykiety anatomiczne</span>
								<Switch
									checked={localShowAnatomyLabels}
									onCheckedChange={setLocalShowAnatomyLabels}
								/>
							</div>

							{/* Audio toggle */}
							<div className="flex items-center justify-between">
								<span className="text-xs">Dźwięk</span>
								<Button
									size="sm"
									variant="outline"
									onClick={() => setLocalEnableAudio(!localEnableAudio)}
								>
									{localEnableAudio ? (
										<Volume2 className="h-3 w-3" />
									) : (
										<VolumeX className="h-3 w-3" />
									)}
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>
			)}

			{/* Organ information panel */}
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

							{/* System-specific information */}
							{currentSystem === "skeletal" && (
								<div className="text-gray-600 text-xs">
									<strong>Typ kości:</strong>{" "}
									{selectedOrganData.name.includes("Spine")
										? "Kręgi"
										: "Kośc długa"}
								</div>
							)}

							{currentSystem === "muscular" && (
								<div className="text-gray-600 text-xs">
									<strong>Typ mięśnia:</strong> Szkieletowy
								</div>
							)}

							{currentSystem === "respiratory" && (
								<div className="text-gray-600 text-xs">
									<strong>Funkcja:</strong>{" "}
									{selectedOrganData.name.includes("Lung")
										? "Wymiana gazowa"
										: "Transport powietrza"}
								</div>
							)}
						</CardContent>
					</Card>
				</div>
			)}

			{/* Control toggles */}
			<div className="absolute right-4 bottom-4 flex gap-2">
				<Button
					size="sm"
					variant="outline"
					onClick={() => setShowControls(!showControls)}
				>
					{showControls ? (
						<EyeOff className="h-3 w-3" />
					) : (
						<Eye className="h-3 w-3" />
					)}
					{showControls ? "Ukryj" : "Pokaż"} kontrole
				</Button>

				<Button
					size="sm"
					variant="outline"
					onClick={() => setIsFullscreen(!isFullscreen)}
				>
					{isFullscreen ? "✕" : "⛶"}
					{isFullscreen ? "Zamknij" : "Pełny ekran"}
				</Button>
			</div>

			{/* Educational overlay */}
			<div className="-translate-x-1/2 -translate-y-1/2 pointer-events-none absolute top-1/2 left-1/2 transform">
				<Card className="w-64 border-white/20 bg-black/20 backdrop-blur-sm">
					<CardContent className="p-4 text-center">
						<div className="font-medium text-sm text-white">
							Kliknij na narządy, aby uzyskać więcej informacji
						</div>
						<div className="mt-1 text-white/80 text-xs">
							Użyj myszki lub dotyku do nawigacji
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};
