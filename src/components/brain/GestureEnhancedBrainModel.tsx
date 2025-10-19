/**
 * Gesture-Enhanced Interactive 3D Brain Model
 * Enhanced version of Interactive3DBrainModel with comprehensive gesture support
 */

"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGestureManager } from "@/lib/gestures/useGestureManager";
import {
	ContactShadows,
	Environment,
	Html,
	OrbitControls,
	PerspectiveCamera,
	Sphere,
	Text,
} from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
	Activity,
	Award,
	BookOpen,
	Brain,
	Eye,
	EyeOff,
	Info,
	Lightbulb,
	Pause,
	Play,
	RotateCcw,
	Settings,
	Target,
	Volume2,
	VolumeX,
	Zap,
	ZoomIn,
	ZoomOut,
} from "lucide-react";
import type React from "react";
import { Suspense, useEffect, useRef, useState } from "react";
import { Camera, type Group, type Mesh, Vector3 } from "three";
import {
	type Interactive3DBrainModelProps,
	brainRegions,
} from "./Interactive3DBrainModel";

// Enhanced brain region component with gesture support
const GestureBrainRegion: React.FC<{
	region: any;
	isSelected: boolean;
	isHighlighted: boolean;
	supplementEffects: any[];
	animationSpeed: number;
	onClick: () => void;
	onHover: () => void;
	onHoverEnd: () => void;
}> = ({
	region,
	isSelected,
	isHighlighted,
	supplementEffects,
	animationSpeed,
	onClick,
	onHover,
	onHoverEnd,
}) => {
	const meshRef = useRef<Mesh>(null);
	const [hovered, setHovered] = useState(false);

	useFrame((state) => {
		if (!meshRef.current) return;

		// Base rotation
		meshRef.current.rotation.y += 0.005 * animationSpeed;

		// Supplement effects animation
		if (supplementEffects.length > 0) {
			const time = state.clock.getElapsedTime();
			const effect = supplementEffects[0];
			const pulseSpeed = effect?.visualEffect?.pulseSpeed ?? 1;
			const pulse = Math.sin(time * pulseSpeed) * 0.5 + 0.5;
			meshRef.current?.scale.setScalar(
				region.size * (1 + pulse * 0.2 * (effect?.intensity || 1)),
			);
		}

		// Gesture-based highlighting
		if (isSelected || isHighlighted || hovered) {
			meshRef.current.material.emissiveIntensity = 0.3;
		} else {
			meshRef.current.material.emissiveIntensity = 0;
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
				onPointerOver={() => {
					setHovered(true);
					onHover();
				}}
				onPointerOut={() => {
					setHovered(false);
					onHoverEnd();
				}}
			>
				<meshStandardMaterial
					color={effectColor}
					emissive={
						isSelected || isHighlighted || hovered ? effectColor : "#000000"
					}
					emissiveIntensity={
						isSelected ? 0.3 : isHighlighted ? 0.2 : hovered ? 0.1 : 0
					}
					transparent
					opacity={0.8}
				/>
			</Sphere>

			{/* Enhanced region label with gesture feedback */}
			<Html position={[0, region.size + 0.3, 0]} center>
				<div
					className={`rounded-lg border px-2 py-1 font-medium text-xs shadow-lg backdrop-blur-sm transition-all ${
						isSelected
							? "border-blue-400 bg-blue-500/90 text-white"
							: isHighlighted
								? "border-yellow-400 bg-yellow-500/90 text-white"
								: hovered
									? "border-gray-600 bg-gray-800/90 text-white"
									: "border-gray-300 bg-white/90 text-gray-800"
					}`}
				>
					<div className="font-bold">{region.polishName}</div>
					<div className="text-xs opacity-90">{region.name}</div>
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

// Enhanced brain model with gesture integration
const GestureBrainModel: React.FC<{
	selectedRegion: string | null;
	highlightedRegions: string[];
	selectedSupplements: string[];
	showNeurotransmitters: boolean;
	animationSpeed: number;
	gestureEnabled: boolean;
	onRegionClick: (regionId: string) => void;
	onRegionHover: (regionId: string) => void;
	onRegionHoverEnd: (regionId: string) => void;
}> = ({
	selectedRegion,
	highlightedRegions,
	selectedSupplements,
	showNeurotransmitters,
	animationSpeed,
	gestureEnabled,
	onRegionClick,
	onRegionHover,
	onRegionHoverEnd,
}) => {
	const { camera, scene } = useThree();
	const groupRef = useRef<Group>(null);

	// Initialize gesture manager
	const {
		gestureManager,
		handlers,
		state,
		isLoading: gestureLoading,
		error: gestureError,
	} = useGestureManager({
		camera,
		scene: scene as Group,
		brainRegions,
		enabled: gestureEnabled,
		language: "pl",
		onRegionSelect: onRegionClick,
	});

	useEffect(() => {
		if (gestureManager && !gestureLoading) {
			// Set up gesture event listeners on the canvas
			const canvas = document.querySelector("canvas");
			if (canvas) {
				// Add touch event listeners
				const touchStartHandler = (e: TouchEvent) => {
					const gesture = gestureManager.recognizeGesture(e);
					if (gesture) handlers.onGestureStart?.(gesture);
				};

				const touchMoveHandler = (e: TouchEvent) => {
					const gesture = gestureManager.recognizeGesture(e);
					if (gesture) handlers.onGestureChange?.(gesture);
				};

				const touchEndHandler = (e: TouchEvent) => {
					const gesture = gestureManager.recognizeGesture(e);
					if (gesture) handlers.onGestureEnd?.(gesture);
				};

				canvas.addEventListener("touchstart", touchStartHandler, {
					passive: false,
				});
				canvas.addEventListener("touchmove", touchMoveHandler, {
					passive: false,
				});
				canvas.addEventListener("touchend", touchEndHandler, {
					passive: false,
				});

				return () => {
					canvas.removeEventListener("touchstart", touchStartHandler);
					canvas.removeEventListener("touchmove", touchMoveHandler);
					canvas.removeEventListener("touchend", touchEndHandler);
				};
			}
		}
	}, [gestureManager, gestureLoading, handlers]);

	return (
		<>
			{/* Brain regions with gesture enhancement */}
			{brainRegions.map((region) => {
				const activeEffects = region.supplementEffects.filter((effect) =>
					selectedSupplements.includes(effect.supplementId),
				);

				return (
					<GestureBrainRegion
						key={region.id}
						region={region}
						isSelected={selectedRegion === region.id}
						isHighlighted={highlightedRegions.includes(region.id)}
						supplementEffects={activeEffects}
						animationSpeed={animationSpeed}
						onClick={() => onRegionClick(region.id)}
						onHover={() => onRegionHover(region.id)}
						onHoverEnd={() => onRegionHoverEnd(region.id)}
					/>
				);
			})}

			{/* Brain outline/structure */}
			<Sphere args={[2.5, 64, 64]} position={[0, 0, 0]}>
				<meshStandardMaterial
					color="#E5E7EB"
					transparent
					opacity={0.1}
					wireframe
				/>
			</Sphere>

			{/* Gesture feedback overlay */}
			{gestureEnabled && (
				<Html fullscreen>
					<div className="pointer-events-none absolute inset-0">
						{/* Gesture tutorial overlay */}
						{state.learningMode && (
							<div className="absolute top-4 right-4 left-4 rounded-lg bg-blue-500/90 p-4 text-white">
								<div className="flex items-center gap-2">
									<BookOpen className="h-5 w-5" />
									<span className="font-medium">
										Tryb nauki:{" "}
										{gestureManager?.getLocalizedString(
											"tutorial.welcome.title",
										)}
									</span>
								</div>
							</div>
						)}

						{/* Performance indicator */}
						{gestureError && (
							<div className="absolute bottom-4 left-4 rounded-lg bg-red-500/90 p-2 text-white text-xs">
								Błąd gestów: {gestureError}
							</div>
						)}

						{/* Gesture hints */}
						{state.learningMode && state.tutorials.currentStep > 0 && (
							<div className="absolute right-4 bottom-4 max-w-xs rounded-lg bg-gray-800/90 p-3 text-sm text-white">
								<div className="mb-1 font-medium">Wskazówka:</div>
								<div>
									Spróbuj{" "}
									{gestureManager?.getLocalizedString("tutorial.step.tap")}
								</div>
							</div>
						)}
					</div>
				</Html>
			)}
		</>
	);
};

// Main enhanced brain model component
export const GestureEnhancedBrainModel: React.FC<
	Interactive3DBrainModelProps & {
		gestureEnabled?: boolean;
		learningMode?: boolean;
		onGestureStateChange?: (state: any) => void;
	}
> = ({
	selectedSupplements = [],
	showNeurotransmitters = false,
	animationSpeed = 1,
	onRegionClick,
	onRegionSelect,
	onConnectionSelect,
	onSupplementEffectToggle,
	className = "",
	gestureEnabled = true,
	learningMode = false,
	onGestureStateChange,
}) => {
	const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
	const [highlightedRegions, setHighlightedRegions] = useState<string[]>([]);
	const [showControls, setShowControls] = useState(true);
	const [localShowNeurotransmitters, setLocalShowNeurotransmitters] = useState(
		showNeurotransmitters,
	);
	const [localAnimationSpeed, setLocalAnimationSpeed] =
		useState(animationSpeed);
	const [isPlaying, setIsPlaying] = useState(true);
	const [soundEnabled, setSoundEnabled] = useState(true);

	const handleRegionClick = (regionId: string) => {
		setSelectedRegion(regionId);
		onRegionClick?.(regionId);
		onRegionSelect?.(brainRegions.find((r) => r.id === regionId));
	};

	const handleRegionHover = (regionId: string) => {
		if (!highlightedRegions.includes(regionId)) {
			setHighlightedRegions((prev) => [...prev, regionId]);
		}
	};

	const handleRegionHoverEnd = (regionId: string) => {
		setHighlightedRegions((prev) => prev.filter((id) => id !== regionId));
	};

	const selectedRegionData = selectedRegion
		? brainRegions.find((r) => r.id === selectedRegion)
		: null;

	// Gesture state change handler
	useEffect(() => {
		if (onGestureStateChange) {
			onGestureStateChange({
				selectedRegion,
				highlightedRegions,
				learningMode,
				gestureEnabled,
			});
		}
	}, [
		selectedRegion,
		highlightedRegions,
		learningMode,
		gestureEnabled,
		onGestureStateChange,
	]);

	return (
		<div className={`relative h-full w-full ${className}`}>
			{/* Enhanced 3D Canvas with gesture support */}
			<div className="h-[600px] w-full overflow-hidden rounded-lg bg-gradient-to-b from-blue-50 to-white">
				<Canvas>
					<PerspectiveCamera makeDefault position={[5, 2, 5]} />

					{/* Enhanced OrbitControls with gesture integration */}
					<OrbitControls
						enablePan={gestureEnabled}
						enableZoom={gestureEnabled}
						enableRotate={gestureEnabled}
						enableDamping
						dampingFactor={0.05}
						maxDistance={50}
						minDistance={1}
					/>

					{/* Lighting */}
					<ambientLight intensity={0.4} />
					<directionalLight position={[10, 10, 5]} intensity={0.8} />
					<pointLight position={[-10, -10, -5]} intensity={0.3} />

					{/* Environment */}
					<Environment preset="studio" />

					{/* Enhanced brain model */}
					<Suspense fallback={null}>
						<GestureBrainModel
							selectedRegion={selectedRegion}
							highlightedRegions={highlightedRegions}
							selectedSupplements={selectedSupplements}
							showNeurotransmitters={localShowNeurotransmitters}
							animationSpeed={isPlaying ? localAnimationSpeed : 0}
							gestureEnabled={gestureEnabled}
							onRegionClick={handleRegionClick}
							onRegionHover={handleRegionHover}
							onRegionHoverEnd={handleRegionHoverEnd}
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

			{/* Enhanced controls overlay */}
			{showControls && (
				<div className="absolute top-4 left-4 space-y-2">
					<Card className="w-72">
						<CardHeader className="pb-2">
							<CardTitle className="flex items-center justify-between text-sm">
								<div className="flex items-center gap-2">
									<Settings className="h-4 w-4" />
									Kontrola wizualizacji
								</div>
								{gestureEnabled && (
									<Badge variant="secondary" className="text-xs">
										Gestykulacja włączona
									</Badge>
								)}
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3">
							{/* Animation controls */}
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
								<Progress
									value={localAnimationSpeed * 33.33} // Scale 0-3 to 0-100
									className="w-full"
								/>
							</div>

							{/* Gesture-specific controls */}
							{gestureEnabled && (
								<>
									<div className="flex items-center justify-between">
										<span className="text-xs">Szlaki neuroprzekaźników</span>
										<Button
											size="sm"
											variant={
												localShowNeurotransmitters ? "default" : "outline"
											}
											onClick={() =>
												setLocalShowNeurotransmitters(
													!localShowNeurotransmitters,
												)
											}
										>
											<Zap className="h-3 w-3" />
										</Button>
									</div>

									<div className="flex items-center justify-between">
										<span className="text-xs">Tryb nauki</span>
										<Button
											size="sm"
											variant={learningMode ? "default" : "outline"}
											onClick={() => {
												// Toggle learning mode would be handled by parent
											}}
										>
											<BookOpen className="h-3 w-3" />
										</Button>
									</div>
								</>
							)}

							{/* Sound controls */}
							<div className="flex items-center justify-between">
								<span className="text-xs">Dźwięk</span>
								<Button
									size="sm"
									variant="outline"
									onClick={() => setSoundEnabled(!soundEnabled)}
								>
									{soundEnabled ? (
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

			{/* Enhanced region info panel */}
			{selectedRegionData && (
				<div className="absolute top-4 right-4 w-80">
					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="flex items-center gap-2 text-sm">
								<Brain className="h-4 w-4" />
								{selectedRegionData.polishName}
								{gestureEnabled && (
									<Badge variant="outline" className="text-xs">
										Wybrano gestem
									</Badge>
								)}
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

			{/* Gesture tutorial panel */}
			{gestureEnabled && learningMode && (
				<div className="absolute right-4 bottom-4 left-4">
					<Card>
						<CardContent className="p-4">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<Award className="h-5 w-5 text-yellow-500" />
									<span className="font-medium">Tutorial gestów</span>
								</div>
								<div className="flex items-center gap-2">
									<Progress value={33} className="w-20" />
									<span className="text-gray-600 text-xs">1/3</span>
								</div>
							</div>
							<div className="mt-2 text-gray-700 text-sm">
								Dotknij regionu mózgu, aby go wybrać. Spróbuj teraz!
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

			{/* Gesture help button */}
			{gestureEnabled && (
				<Button
					size="sm"
					variant="outline"
					className="absolute right-4 bottom-4"
					onClick={() => {
						// Show gesture help modal
						console.log("Show gesture help");
					}}
				>
					<Info className="h-3 w-3" />
					Pomoc
				</Button>
			)}
		</div>
	);
};

export default GestureEnhancedBrainModel;
