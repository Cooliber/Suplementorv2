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
	OrbitControls,
	PerspectiveCamera,
	Sphere,
	Text,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import {
	Activity,
	Bone,
	BookOpen,
	Bookmark,
	Eye,
	EyeOff,
	Heart,
	Info,
	Layers,
	Pause,
	Play,
	RotateCcw,
	Settings,
	Shield,
	SkipBack,
	SkipForward,
	Sparkles,
	Timer,
	Volume2,
	VolumeX,
	Wind,
	Zap,
	ZoomIn,
	ZoomOut,
} from "lucide-react";
import type React from "react";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Color, Vector3 } from "three";

import {
	type AnimationController,
	AnimationPerformanceMonitor,
	DeviceCapabilities,
	PARTICLE_SYSTEMS,
	PHYSIOLOGICAL_ANIMATIONS,
	ParticleSystemManager,
	type PhysiologicalAnimation,
	PhysiologicalAnimationController,
	SUPPLEMENT_MOLECULAR_EFFECTS,
} from "@/lib/animations/physiological-animations";
import { ParticleSystem } from "../animations/ParticleSystem";
import { InteractiveOrgan } from "./InteractiveOrgan";

import type {
	AnatomicalStructure,
	AnimationConfig,
	BODY_SYSTEMS,
	BodySystem,
	DEFAULT_VIEW_MODES,
	InteractionConfig,
	ViewMode,
} from "@/types/body-systems";

interface EnhancedBodySystemsViewerProps {
	selectedSupplements?: string[];
	currentSystem?: string;
	onSystemChange?: (systemId: string) => void;
	onOrganSelect?: (organId: string) => void;
	className?: string;
	enableAudio?: boolean;
	enableBookmarks?: boolean;
}

// Enhanced organ interface with animation data
interface AnimatedOrgan extends AnatomicalStructure {
	animationOffset?: number;
	pulsePhase?: number;
	glowIntensity?: number;
	particleEffects?: string[];
}

// Mock anatomical data with animation properties
const mockAnimatedAnatomicalData: Record<string, AnimatedOrgan[]> = {
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
			animationOffset: 0,
			pulsePhase: 0,
			glowIntensity: 0,
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
			animationOffset: Math.PI / 4,
			pulsePhase: 0,
			glowIntensity: 0,
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
			animationOffset: Math.PI / 2,
			pulsePhase: 0,
			glowIntensity: 0,
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
			animationOffset: 0,
			pulsePhase: 0,
			glowIntensity: 0,
			particleEffects: ["cellular-energy"],
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
			animationOffset: Math.PI,
			pulsePhase: 0,
			glowIntensity: 0,
			particleEffects: ["cellular-energy"],
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
			animationOffset: 0,
			pulsePhase: 0,
			glowIntensity: 0,
			particleEffects: ["blood-cells"],
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
			animationOffset: Math.PI / 3,
			pulsePhase: 0,
			glowIntensity: 0,
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
			animationOffset: 0,
			pulsePhase: 0,
			glowIntensity: 0,
			particleEffects: ["neural-signals", "cellular-energy"],
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
			animationOffset: Math.PI / 6,
			pulsePhase: 0,
			glowIntensity: 0,
			particleEffects: ["neural-signals"],
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
			animationOffset: 0,
			pulsePhase: 0,
			glowIntensity: 0,
			particleEffects: ["hormone-molecules"],
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
			animationOffset: Math.PI / 2,
			pulsePhase: 0,
			glowIntensity: 0,
			particleEffects: ["hormone-molecules"],
		},
	],
	reproductive: [
		{
			id: "testes",
			name: "Testes",
			polishName: "Jądra",
			position: [0, -1, 0.5],
			color: "#BE123C",
			size: 0.4,
			category: BODY_SYSTEMS[5],
			system: "reproductive",
			polishSystem: "Układ rozrodczy",
			animationOffset: 0,
			pulsePhase: 0,
			glowIntensity: 0,
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
			animationOffset: Math.PI / 4,
			pulsePhase: 0,
			glowIntensity: 0,
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
			animationOffset: 0,
			pulsePhase: 0,
			glowIntensity: 0,
		},
	],
};

// Enhanced 3D scene component with physiological animations
const EnhancedBodySystemsScene: React.FC<{
	currentSystem: string;
	selectedOrgan: string | null;
	selectedSupplements: string[];
	animationConfig: AnimationConfig;
	interactionConfig: InteractionConfig;
	currentViewMode: ViewMode;
	activeAnimations: string[];
	animationProgress: Record<string, number>;
	onOrganClick: (organId: string) => void;
	onOrganHover: (organId: string | null) => void;
	organPositions: Record<string, Vector3>;
}> = ({
	currentSystem,
	selectedOrgan,
	selectedSupplements,
	animationConfig,
	interactionConfig,
	currentViewMode,
	activeAnimations,
	animationProgress,
	onOrganClick,
	onOrganHover,
	organPositions,
}) => {
	const organs = mockAnimatedAnatomicalData[currentSystem] || [];

	return (
		<>
			{/* Camera based on view mode */}
			<PerspectiveCamera
				makeDefault
				position={currentViewMode.cameraPosition}
				fov={50}
			/>

			{/* Enhanced Controls */}
			<OrbitControls
				enablePan={interactionConfig.enablePan}
				enableZoom={interactionConfig.enableZoom}
				enableRotate={interactionConfig.enableRotate}
				target={currentViewMode.cameraTarget}
				maxDistance={10}
				minDistance={2}
			/>

			{/* Enhanced Lighting */}
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

			{/* Render animated organs */}
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

			{/* Particle systems for active animations */}
			{activeAnimations.flatMap((animationId) => {
				const animation = PHYSIOLOGICAL_ANIMATIONS.find(
					(a) => a.id === animationId,
				);
				if (!animation) return null;

				return animation.organIds.map((organId) => {
					const organ = Object.values(mockAnimatedAnatomicalData)
						.flat()
						.find((o) => o.id === organId);
					if (!organ) return null;

					return PARTICLE_SYSTEMS.filter((system) => {
						// Match particle systems to organs based on animation type
						switch (animation.animationType) {
							case "blood_flow":
								return system.animationType === "blood_flow";
							case "nerve_impulse":
								return system.animationType === "neural_signals";
							case "hormone_release":
								return system.animationType === "hormone_release";
							case "muscle_contraction":
								return system.animationType === "cellular_activity";
							default:
								return false;
						}
					}).map((system) => (
						<ParticleSystem
							key={`${animationId}-${organId}-${system.id}`}
							systemId={system.id}
							organPositions={organPositions}
							isActive={true}
							intensity={animationProgress[animationId] || 0}
						/>
					));
				});
			})}

			{/* Supplement molecular effects */}
			{selectedSupplements.flatMap((supplementId) => {
				const effect = SUPPLEMENT_MOLECULAR_EFFECTS.find(
					(e) => e.supplementId === supplementId,
				);
				if (!effect) return null;

				return effect.targetOrgans.map((organId) => {
					const organ = Object.values(mockAnimatedAnatomicalData)
						.flat()
						.find((o) => o.id === organId);
					if (!organ) return null;

					return (
						<group key={`${supplementId}-${organId}`} position={organ.position}>
							{/* Molecular effect visualization */}
							<Sphere args={[organ.size * 1.2, 16, 16]}>
								<meshStandardMaterial
									color={effect.visualEffect.color}
									transparent
									opacity={0.3}
									emissive={effect.visualEffect.color}
									emissiveIntensity={effect.visualEffect.glowIntensity}
								/>
							</Sphere>
						</group>
					);
				});
			})}

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

// Main enhanced viewer component
export const EnhancedBodySystemsViewer: React.FC<
	EnhancedBodySystemsViewerProps
> = ({
	selectedSupplements = [],
	currentSystem = "skeletal",
	onSystemChange,
	onOrganSelect,
	className = "",
	enableAudio = true,
	enableBookmarks = true,
}) => {
	// Animation system refs
	const animationControllerRef =
		useRef<PhysiologicalAnimationController | null>(null);
	const particleManagerRef = useRef<ParticleSystemManager | null>(null);
	const performanceMonitorRef = useRef<AnimationPerformanceMonitor | null>(
		null,
	);

	// State management
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

	// Enhanced animation state
	const [activeAnimations, setActiveAnimations] = useState<string[]>([]);
	const [animationProgress, setAnimationProgress] = useState<
		Record<string, number>
	>({});
	const [isPlaying, setIsPlaying] = useState(true);
	const [currentAnimation, setCurrentAnimation] = useState<string | null>(null);
	const [playbackSpeed, setPlaybackSpeed] = useState(1);
	const [audioEnabled, setAudioEnabled] = useState(enableAudio);
	const [bookmarks, setBookmarks] = useState<string[]>([]);
	const [currentTime, setCurrentTime] = useState(0);

	// Performance monitoring
	const [deviceCapabilities, setDeviceCapabilities] = useState(
		DeviceCapabilities.detect(),
	);
	const [performanceStats, setPerformanceStats] = useState({
		fps: 60,
		memory: 0,
	});

	// Organ positions for particle systems
	const organPositions = useRef<Record<string, Vector3>>({});

	// Initialize animation systems
	useEffect(() => {
		animationControllerRef.current = new PhysiologicalAnimationController();
		particleManagerRef.current = new ParticleSystemManager();
		performanceMonitorRef.current = new AnimationPerformanceMonitor();

		// Set up animation update callback
		animationControllerRef.current.setAnimationUpdateCallback(
			(animationId, progress) => {
				setAnimationProgress((prev) => ({ ...prev, [animationId]: progress }));
			},
		);

		return () => {
			animationControllerRef.current?.dispose();
			particleManagerRef.current?.dispose();
		};
	}, []);

	// Update organ positions when system changes
	useEffect(() => {
		const organs = mockAnimatedAnatomicalData[currentSystem] || [];
		const positions: Record<string, Vector3> = {};
		organs.forEach((organ) => {
			positions[organ.id] = new Vector3(...organ.position);
		});
		organPositions.current = positions;
	}, [currentSystem]);

	// Performance monitoring
	useEffect(() => {
		const monitor = performanceMonitorRef.current;
		if (!monitor) return;

		const interval = setInterval(() => {
			monitor.update();
			setPerformanceStats({
				fps: Math.round(monitor.getAverageFPS()),
				memory: monitor.getMemoryUsage(),
			});

			// Adaptive quality adjustment
			if (monitor.shouldReduceQuality()) {
				setAnimationConfig((prev) => ({
					...prev,
					intensity: Math.max(0.5, prev.intensity - 0.1),
				}));
			}
		}, 1000);

		return () => clearInterval(interval);
	}, []);

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

	// Animation control functions
	const startAnimation = useCallback(
		(animationId: string) => {
			if (!animationControllerRef.current) return;

			animationControllerRef.current.startAnimation(animationId, {
				playbackSpeed,
				loop: true,
				onUpdate: (progress) => {
					setCurrentTime(
						progress *
							PHYSIOLOGICAL_ANIMATIONS.find((a) => a.id === animationId)
								?.duration || 0,
					);
				},
			});

			setActiveAnimations((prev) => [...prev, animationId]);
			setCurrentAnimation(animationId);
		},
		[playbackSpeed],
	);

	const pauseAnimation = useCallback(() => {
		if (!animationControllerRef.current || !currentAnimation) return;
		animationControllerRef.current.pauseAnimation(currentAnimation);
		setIsPlaying(false);
	}, [currentAnimation]);

	const resumeAnimation = useCallback(() => {
		if (!animationControllerRef.current || !currentAnimation) return;
		animationControllerRef.current.resumeAnimation(currentAnimation);
		setIsPlaying(true);
	}, [currentAnimation]);

	const stopAnimation = useCallback(() => {
		if (!animationControllerRef.current || !currentAnimation) return;
		animationControllerRef.current.stopAnimation(currentAnimation);
		setActiveAnimations((prev) => prev.filter((id) => id !== currentAnimation));
		setCurrentAnimation(null);
		setIsPlaying(false);
		setCurrentTime(0);
	}, [currentAnimation]);

	const addBookmark = useCallback(() => {
		if (currentAnimation && currentTime > 0) {
			const bookmarkId = `${currentAnimation}-${Math.round(currentTime)}`;
			setBookmarks((prev) => [...prev, bookmarkId]);
		}
	}, [currentAnimation, currentTime]);

	const jumpToBookmark = useCallback((bookmarkId: string) => {
		const [animationId, timeStr] = bookmarkId.split("-");
		const time = Number.parseInt(timeStr);
		if (animationControllerRef.current) {
			// Implementation would need to support seeking to specific time
			setCurrentAnimation(animationId);
			setCurrentTime(time);
		}
	}, []);

	const selectedOrganData = selectedOrgan
		? Object.values(mockAnimatedAnatomicalData)
				.flat()
				.find((o) => o.id === selectedOrgan)
		: null;

	return (
		<div className={`relative h-full w-full ${className}`}>
			{/* 3D Canvas */}
			<div className="h-[600px] w-full overflow-hidden rounded-lg bg-gradient-to-b from-blue-50 to-white">
				<Canvas>
					<Suspense fallback={null}>
						<EnhancedBodySystemsScene
							currentSystem={currentSystem}
							selectedOrgan={selectedOrgan}
							selectedSupplements={selectedSupplements}
							animationConfig={animationConfig}
							interactionConfig={interactionConfig}
							currentViewMode={currentViewMode}
							activeAnimations={activeAnimations}
							animationProgress={animationProgress}
							onOrganClick={handleOrganClick}
							onOrganHover={handleOrganHover}
							organPositions={organPositions.current}
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

			{/* Enhanced Controls overlay */}
			{showControls && (
				<div className="absolute top-4 right-4 space-y-2">
					{/* Animation Controls */}
					<Card className="w-72">
						<CardHeader className="pb-2">
							<CardTitle className="flex items-center gap-2 text-sm">
								<Sparkles className="h-4 w-4" />
								Animacje fizjologiczne
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3">
							{/* Animation Selection */}
							<div className="space-y-2">
								<span className="font-medium text-xs">
									Procesy fizjologiczne:
								</span>
								<div className="grid grid-cols-2 gap-1">
									{PHYSIOLOGICAL_ANIMATIONS.map((animation) => (
										<Button
											key={animation.id}
											size="sm"
											variant={
												activeAnimations.includes(animation.id)
													? "default"
													: "outline"
											}
											className="h-7 text-xs"
											onClick={() => {
												if (activeAnimations.includes(animation.id)) {
													animationControllerRef.current?.stopAnimation(
														animation.id,
													);
													setActiveAnimations((prev) =>
														prev.filter((id) => id !== animation.id),
													);
												} else {
													startAnimation(animation.id);
												}
											}}
										>
											{animation.polishName}
										</Button>
									))}
								</div>
							</div>

							{/* Playback Controls */}
							{currentAnimation && (
								<>
									<div className="flex items-center gap-2">
										<Button
											size="sm"
											variant="outline"
											onClick={isPlaying ? pauseAnimation : resumeAnimation}
										>
											{isPlaying ? (
												<Pause className="h-3 w-3" />
											) : (
												<Play className="h-3 w-3" />
											)}
										</Button>
										<Button size="sm" variant="outline" onClick={stopAnimation}>
											<RotateCcw className="h-3 w-3" />
										</Button>
										<span className="flex-1 text-xs">
											{Math.round(currentTime)}ms
										</span>
									</div>

									{/* Progress bar */}
									<div className="space-y-1">
										<Progress
											value={
												(currentTime /
													(PHYSIOLOGICAL_ANIMATIONS.find(
														(a) => a.id === currentAnimation,
													)?.duration || 1)) *
												100
											}
											className="h-2"
										/>
									</div>

									{/* Speed control */}
									<div className="space-y-1">
										<span className="text-xs">
											Prędkość: {playbackSpeed.toFixed(1)}x
										</span>
										<Slider
											value={[playbackSpeed]}
											onValueChange={([value]) => {
												setPlaybackSpeed(value || 1);
												if (
													currentAnimation &&
													animationControllerRef.current
												) {
													animationControllerRef.current.setPlaybackSpeed(
														currentAnimation,
														value || 1,
													);
												}
											}}
											min={0.1}
											max={3}
											step={0.1}
											className="w-full"
										/>
									</div>
								</>
							)}

							{/* Bookmarks */}
							{enableBookmarks && bookmarks.length > 0 && (
								<div className="space-y-1">
									<span className="font-medium text-xs">Zakładki:</span>
									<div className="flex flex-wrap gap-1">
										{bookmarks.slice(-5).map((bookmark) => (
											<Button
												key={bookmark}
												size="sm"
												variant="outline"
												className="h-6 text-xs"
												onClick={() => jumpToBookmark(bookmark)}
											>
												<Bookmark className="mr-1 h-2 w-2" />
												{bookmark.split("-")[1]}ms
											</Button>
										))}
									</div>
								</div>
							)}
						</CardContent>
					</Card>

					{/* Visual Controls */}
					<Card className="w-64">
						<CardHeader className="pb-2">
							<CardTitle className="flex items-center gap-2 text-sm">
								<Settings className="h-4 w-4" />
								Kontrola wizualizacji
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3">
							<div className="space-y-1">
								<span className="text-xs">Intensywność animacji</span>
								<Slider
									value={[animationConfig.intensity]}
									onValueChange={([value]) =>
										setAnimationConfig((prev) => ({
											...prev,
											intensity: value || 1,
										}))
									}
									min={0.1}
									max={2}
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

							<div className="flex items-center justify-between">
								<span className="text-xs">Audio</span>
								<Button
									size="sm"
									variant="outline"
									onClick={() => setAudioEnabled(!audioEnabled)}
								>
									{audioEnabled ? (
										<Volume2 className="h-3 w-3" />
									) : (
										<VolumeX className="h-3 w-3" />
									)}
								</Button>
							</div>
						</CardContent>
					</Card>

					{/* Performance Monitor */}
					<Card className="w-48">
						<CardHeader className="pb-2">
							<CardTitle className="text-xs">Wydajność</CardTitle>
						</CardHeader>
						<CardContent className="space-y-2">
							<div className="flex justify-between text-xs">
								<span>FPS:</span>
								<Badge
									variant={
										performanceStats.fps > 30 ? "default" : "destructive"
									}
								>
									{performanceStats.fps}
								</Badge>
							</div>
							<div className="flex justify-between text-xs">
								<span>Pamięć:</span>
								<Badge
									variant={
										performanceStats.memory * 100 < 70
											? "default"
											: "destructive"
									}
								>
									{Math.round(performanceStats.memory * 100)}%
								</Badge>
							</div>
							<div className="flex justify-between text-xs">
								<span>Jakość:</span>
								<Badge variant="outline">
									{deviceCapabilities.recommendedQuality}
								</Badge>
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

							{/* Active animations for this organ */}
							{selectedOrganData.particleEffects && (
								<div className="text-gray-600 text-xs">
									<strong>Efekty:</strong>{" "}
									{selectedOrganData.particleEffects.join(", ")}
								</div>
							)}
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

			{/* Add bookmark button */}
			{currentAnimation && (
				<Button
					size="sm"
					variant="outline"
					className="absolute top-4 right-4"
					onClick={addBookmark}
				>
					<Bookmark className="mr-1 h-3 w-3" />
					Dodaj zakładkę
				</Button>
			)}
		</div>
	);
};
