/**
 * Enhanced Interactive 3D Brain Model with Audio Integration
 * Extends the original brain model with comprehensive audio and haptic feedback
 */

"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VibrationIcon } from "@/components/ui/custom-icons";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSuplementorAudio } from "@/hooks/useSuplementorAudio";
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
	Brain,
	Eye,
	EyeOff,
	Info,
	Pause,
	Play,
	RotateCcw,
	Settings,
	Volume2,
	VolumeX,
	Zap,
	ZoomIn,
	ZoomOut,
} from "lucide-react";
import type React from "react";
import { Suspense, useCallback, useRef, useState } from "react";
import { type Group, Mesh, Vector3 } from "three";
import {
	type Interactive3DBrainModelProps,
	brainRegions,
	neurotransmitterPathways,
} from "./Interactive3DBrainModel";

// Enhanced brain region component with audio integration
const EnhancedBrainRegion: React.FC<{
	region: (typeof brainRegions)[0];
	isSelected: boolean;
	supplementEffects: any[];
	animationSpeed: number;
	onClick: () => void;
	onHover: (hovering: boolean) => void;
	audioEnabled: boolean;
}> = ({
	region,
	isSelected,
	supplementEffects,
	animationSpeed,
	onClick,
	onHover,
	audioEnabled,
}) => {
	const meshRef = useRef<Mesh>(null);
	const [hovered, setHovered] = useState(false);
	const { playBrainRegionAudio, spatialAudioSystem } = useSuplementorAudio();

	const handleClick = useCallback(() => {
		onClick();
		if (audioEnabled) {
			playBrainRegionAudio(region.id, "select");
		}
	}, [onClick, audioEnabled, playBrainRegionAudio, region.id]);

	const handlePointerOver = useCallback(() => {
		setHovered(true);
		onHover(true);
		if (audioEnabled) {
			playBrainRegionAudio(region.id, "hover");
		}
	}, [onHover, audioEnabled, playBrainRegionAudio, region.id]);

	const handlePointerOut = useCallback(() => {
		setHovered(false);
		onHover(false);
	}, [onHover]);

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

		// Update spatial audio position if available
		if (spatialAudioSystem && meshRef.current) {
			const worldPosition = new Vector3();
			meshRef.current.getWorldPosition(worldPosition);
			// Update any playing spatial audio for this region
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
				onClick={handleClick}
				onPointerOver={handlePointerOver}
				onPointerOut={handlePointerOut}
			>
				<meshStandardMaterial
					color={effectColor}
					emissive={isSelected || hovered ? effectColor : "#000000"}
					emissiveIntensity={isSelected ? 0.3 : hovered ? 0.1 : 0}
					transparent
					opacity={0.8}
				/>
			</Sphere>

			{/* Enhanced region label with audio indicator */}
			<Html position={[0, region.size + 0.3, 0]} center>
				<div className="flex items-center gap-1 rounded border bg-white/90 px-2 py-1 font-medium text-xs shadow-lg backdrop-blur-sm">
					{region.polishName}
					{audioEnabled && <Volume2 className="h-3 w-3 text-blue-500" />}
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

// Enhanced brain model component
const EnhancedBrainModel: React.FC<{
	selectedRegion: string | null;
	selectedSupplements: string[];
	showNeurotransmitters: boolean;
	animationSpeed: number;
	onRegionClick: (regionId: string) => void;
	audioEnabled: boolean;
}> = ({
	selectedRegion,
	selectedSupplements,
	showNeurotransmitters,
	animationSpeed,
	onRegionClick,
	audioEnabled,
}) => {
	const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

	return (
		<>
			{/* Brain regions with audio integration */}
			{brainRegions.map((region) => {
				const activeEffects = region.supplementEffects.filter((effect) =>
					selectedSupplements.includes(effect.supplementId),
				);

				return (
					<EnhancedBrainRegion
						key={region.id}
						region={region}
						isSelected={selectedRegion === region.id}
						supplementEffects={activeEffects}
						animationSpeed={animationSpeed}
						onClick={() => onRegionClick(region.id)}
						onHover={(hovering) =>
							setHoveredRegion(hovering ? region.id : null)
						}
						audioEnabled={audioEnabled}
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
					audioEnabled={audioEnabled}
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

// Enhanced neurotransmitter pathway component
const NeurotransmitterPathway: React.FC<{
	pathway: (typeof neurotransmitterPathways)[0];
	visible: boolean;
	animationSpeed: number;
	audioEnabled: boolean;
}> = ({ pathway, visible, animationSpeed, audioEnabled }) => {
	const groupRef = useRef<Group>(null);
	const { playNeurotransmitterAudio } = useSuplementorAudio();

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

	const handlePathwayClick = useCallback(() => {
		if (audioEnabled) {
			playNeurotransmitterAudio(
				pathway.neurotransmitter.toLowerCase(),
				"pathway",
			);
		}
	}, [audioEnabled, playNeurotransmitterAudio, pathway.neurotransmitter]);

	if (!visible) return null;

	return (
		<group ref={groupRef} onClick={handlePathwayClick}>
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

// Enhanced main component
export const EnhancedInteractive3DBrainModel: React.FC<
	Interactive3DBrainModelProps
> = ({
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
	const [audioEnabled, setAudioEnabled] = useState(true);
	const [showAudioControls, setShowAudioControls] = useState(false);

	// Audio system integration
	const {
		playBrainRegionAudio,
		playNeurotransmitterAudio,
		playSupplementAudio,
		speakBrainRegion,
		speakNeurotransmitter,
		triggerSuccessHaptic,
		triggerErrorHaptic,
		triggerNavigationHaptic,
		updateListenerPosition,
		testAudio,
	} = useSuplementorAudio({
		enabled: audioEnabled,
		autoInitialize: true,
	});

	const handleRegionClick = useCallback(
		(regionId: string) => {
			setSelectedRegion(regionId);
			onRegionClick?.(regionId);

			if (audioEnabled) {
				playBrainRegionAudio(regionId, "select");
				triggerSuccessHaptic();
			}
		},
		[onRegionClick, audioEnabled, playBrainRegionAudio, triggerSuccessHaptic],
	);

	const handleSpeakRegion = useCallback(async () => {
		if (selectedRegion && audioEnabled) {
			await speakBrainRegion(selectedRegion);
		}
	}, [selectedRegion, audioEnabled, speakBrainRegion]);

	const handleSpeakNeurotransmitter = useCallback(async () => {
		// This would be enhanced to speak about neurotransmitters in the selected region
		if (audioEnabled) {
			await speakNeurotransmitter("dopamine");
		}
	}, [audioEnabled, speakNeurotransmitter]);

	const handleTestAudio = useCallback(async () => {
		const results = await testAudio();
		if (results.audio && results.haptics && results.voice) {
			triggerSuccessHaptic();
		} else {
			triggerErrorHaptic();
		}
	}, [testAudio, triggerSuccessHaptic, triggerErrorHaptic]);

	const selectedRegionData = selectedRegion
		? brainRegions.find((r) => r.id === selectedRegion)
		: null;

	return (
		<div className={`relative h-full w-full ${className}`}>
			{/* 3D Canvas */}
			<div className="h-[600px] w-full overflow-hidden rounded-lg bg-gradient-to-b from-blue-50 to-white">
				<Canvas>
					<PerspectiveCamera makeDefault position={[5, 2, 5]} />
					<OrbitControls
						enablePan
						enableZoom
						enableRotate
						onChange={(e) => {
							// Update audio listener position based on camera
							if (e?.target?.object?.position && audioEnabled) {
								updateListenerPosition({
									x: e.target.object.position.x,
									y: e.target.object.position.y,
									z: e.target.object.position.z,
								});
							}
						}}
					/>

					{/* Lighting */}
					<ambientLight intensity={0.4} />
					<directionalLight position={[10, 10, 5]} intensity={0.8} />
					<pointLight position={[-10, -10, -5]} intensity={0.3} />

					{/* Environment */}
					<Environment preset="studio" />

					{/* Enhanced brain model */}
					<Suspense fallback={null}>
						<EnhancedBrainModel
							selectedRegion={selectedRegion}
							selectedSupplements={selectedSupplements}
							showNeurotransmitters={localShowNeurotransmitters}
							animationSpeed={isPlaying ? localAnimationSpeed : 0}
							onRegionClick={handleRegionClick}
							audioEnabled={audioEnabled}
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

							<div className="flex items-center justify-between">
								<span className="text-xs">Audio i haptyka</span>
								<Button
									size="sm"
									variant={audioEnabled ? "default" : "outline"}
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

					{/* Audio controls */}
					{audioEnabled && (
						<Card className="w-64">
							<CardHeader className="pb-2">
								<CardTitle className="flex items-center gap-2 text-sm">
									<Volume2 className="h-4 w-4" />
									Kontrola audio
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-2">
								<Button
									size="sm"
									variant="outline"
									className="w-full"
									onClick={handleSpeakRegion}
									disabled={!selectedRegion}
								>
									<Volume2 className="mr-1 h-3 w-3" />
									Mów o regionie
								</Button>

								<Button
									size="sm"
									variant="outline"
									className="w-full"
									onClick={handleSpeakNeurotransmitter}
								>
									<Volume2 className="mr-1 h-3 w-3" />
									Mów o neuroprzekaźnikach
								</Button>

								<Button
									size="sm"
									variant="outline"
									className="w-full"
									onClick={handleTestAudio}
								>
									<VibrationIcon className="mr-1 h-3 w-3" />
									Testuj audio
								</Button>
							</CardContent>
						</Card>
					)}
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
								{audioEnabled && (
									<Button
										size="sm"
										variant="ghost"
										onClick={handleSpeakRegion}
										className="h-6 w-6 p-0"
									>
										<Volume2 className="h-3 w-3" />
									</Button>
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

			{/* Audio/Haptic toggle button */}
			<Button
				size="sm"
				variant="outline"
				className="absolute bottom-4 left-4"
				onClick={() => setAudioEnabled(!audioEnabled)}
			>
				{audioEnabled ? (
					<Volume2 className="h-3 w-3" />
				) : (
					<VolumeX className="h-3 w-3" />
				)}
				{audioEnabled ? "Wyłącz" : "Włącz"} audio
			</Button>

			{/* Controls toggle button */}
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

export default EnhancedInteractive3DBrainModel;
