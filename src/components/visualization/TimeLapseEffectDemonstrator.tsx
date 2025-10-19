"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { animated, useSpring } from "@react-spring/three";
import { Html, OrbitControls, Text } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import {
	Clock,
	FastForward,
	Pause,
	Play,
	Rewind,
	RotateCcw,
} from "lucide-react";
import type React from "react";
import { useMemo, useRef, useState } from "react";
import {
	BufferGeometry,
	Color,
	type Group,
	Mesh,
	MeshStandardMaterial,
	type Vector3,
} from "three";

interface TimeLapseEffectDemonstratorProps {
	supplementName: string;
	polishSupplementName: string;
	effectDuration: number; // in seconds
	timeScaleOptions: number[];
	autoPlay?: boolean;
	showTimeControls?: boolean;
	className?: string;
}

interface EffectPhase {
	id: string;
	name: string;
	polishName: string;
	duration: number; // seconds
	intensity: number; // 0-1
	description: string;
	visualEffect: "particles" | "glow" | "pulse" | "wave";
	color: Color;
}

const CREATINE_EFFECT_PHASES: EffectPhase[] = [
	{
		id: "immediate",
		name: "Efekt natychmiastowy",
		polishName: "Efekt natychmiastowy",
		duration: 30,
		intensity: 0.3,
		description: "Początkowa absorpcja i dystrybucja w organizmie",
		visualEffect: "particles",
		color: new Color("#22C55E"),
	},
	{
		id: "short-term",
		name: "Efekt krótkoterminowy",
		polishName: "Efekt krótkoterminowy",
		duration: 300,
		intensity: 0.7,
		description: "Zwiększenie poziomu fosfokreatyny w mięśniach",
		visualEffect: "glow",
		color: new Color("#F59E0B"),
	},
	{
		id: "medium-term",
		name: "Efekt średnioterminowy",
		polishName: "Efekt średnioterminowy",
		duration: 1800,
		intensity: 0.9,
		description: "Optymalizacja produkcji energii i wydolności",
		visualEffect: "pulse",
		color: new Color("#EF4444"),
	},
	{
		id: "long-term",
		name: "Efekt długoterminowy",
		polishName: "Efekt długoterminowy",
		duration: 7200,
		intensity: 0.8,
		description: "Adaptacja mięśni i zwiększona siła",
		visualEffect: "wave",
		color: new Color("#8B5CF6"),
	},
];

export const TimeLapseEffectDemonstrator: React.FC<
	TimeLapseEffectDemonstratorProps
> = ({
	supplementName,
	polishSupplementName,
	effectDuration,
	timeScaleOptions = [0.5, 1, 2, 5, 10],
	autoPlay = true,
	showTimeControls = true,
	className = "",
}) => {
	const [isPlaying, setIsPlaying] = useState(autoPlay);
	const [currentTime, setCurrentTime] = useState(0);
	const [timeScale, setTimeScale] = useState(1);
	const [currentPhase, setCurrentPhase] = useState(0);
	const [effectProgress, setEffectProgress] = useState(0);
	const animationProgressRef = useRef(0);

	const phases = CREATINE_EFFECT_PHASES;

	const totalDuration = phases.reduce((sum, phase) => sum + phase.duration, 0);

	return (
		<Card className={`w-full ${className}`}>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Clock className="h-5 w-5" />
					Demonstrator efektów w czasie
				</CardTitle>
				<div className="space-y-1">
					<p className="font-medium text-sm">
						{polishSupplementName} - analiza czasowa
					</p>
					<div className="flex items-center gap-2">
						<Badge variant="outline">
							Czas trwania: {Math.round(totalDuration / 60)} min
						</Badge>
						<Badge variant="secondary">{phases.length} faz</Badge>
					</div>
				</div>
			</CardHeader>
			<CardContent className="space-y-4">
				<div
					className="relative overflow-hidden rounded-lg bg-gray-900"
					style={{ height: "400px" }}
				>
					<Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
						<TimeLapseScene
							phases={phases}
							isPlaying={isPlaying}
							timeScale={timeScale}
							currentTime={currentTime}
							onTimeUpdate={setCurrentTime}
							onPhaseChange={setCurrentPhase}
							onEffectProgress={setEffectProgress}
						/>
						<OrbitControls
							enablePan={true}
							enableZoom={true}
							enableRotate={true}
						/>
					</Canvas>

					{/* Time overlay */}
					<div className="absolute top-4 left-4 rounded bg-black/70 p-2 text-sm text-white">
						<div className="space-y-1">
							<div>Czas: {formatTime(currentTime)}</div>
							<div>
								Faza: {currentPhase + 1}/{phases.length}
							</div>
							<Progress value={effectProgress} className="h-1 w-24" />
						</div>
					</div>
				</div>

				{/* Current phase info */}
				<Card className="bg-blue-50">
					<CardContent className="p-3">
						<div className="flex items-center gap-2">
							<div
								className="h-3 w-3 rounded-full"
								style={{
									backgroundColor: phases[currentPhase]?.color.getHexString(),
								}}
							/>
							<span className="font-medium text-sm">
								{phases[currentPhase]?.polishName}
							</span>
						</div>
						<p className="mt-1 text-gray-600 text-xs">
							{phases[currentPhase]?.description}
						</p>
						<div className="mt-2 flex items-center gap-2">
							<span className="text-xs">Intensywność:</span>
							<Progress
								value={phases[currentPhase]?.intensity * 100}
								className="h-1 flex-1"
							/>
							<span className="text-xs">
								{Math.round(phases[currentPhase]?.intensity * 100)}%
							</span>
						</div>
					</CardContent>
				</Card>

				{/* Time controls */}
				{showTimeControls && (
					<div className="space-y-4">
						{/* Playback controls */}
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
									setCurrentTime(0);
									setCurrentPhase(0);
									setEffectProgress(0);
									animationProgressRef.current = 0;
								}}
							>
								<RotateCcw className="h-4 w-4" />
							</Button>

							<Button
								size="sm"
								variant="outline"
								onClick={() =>
									setTimeScale((prev) => (prev > 0.5 ? prev / 2 : 0.5))
								}
							>
								<Rewind className="h-4 w-4" />
							</Button>

							<div className="flex-1">
								<Slider
									value={[currentTime]}
									onValueChange={([value]) => setCurrentTime(value || 0)}
									min={0}
									max={totalDuration}
									step={1}
									className="w-full"
								/>
							</div>

							<Button
								size="sm"
								variant="outline"
								onClick={() =>
									setTimeScale((prev) => (prev < 10 ? prev * 2 : 10))
								}
							>
								<FastForward className="h-4 w-4" />
							</Button>

							<Badge variant="outline">{timeScale}x</Badge>
						</div>

						{/* Time scale options */}
						<div className="flex items-center gap-2">
							<span className="text-sm">Prędkość:</span>
							{timeScaleOptions.map((scale) => (
								<Button
									key={scale}
									size="sm"
									variant={timeScale === scale ? "default" : "outline"}
									onClick={() => setTimeScale(scale)}
								>
									{scale}x
								</Button>
							))}
						</div>
					</div>
				)}

				{/* Phase timeline */}
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm">Oś czasu faz</CardTitle>
					</CardHeader>
					<CardContent className="pt-0">
						<div className="space-y-2">
							{phases.map((phase, index) => {
								const phaseStart = phases
									.slice(0, index)
									.reduce((sum, p) => sum + p.duration, 0);
								const phaseEnd = phaseStart + phase.duration;
								const isActive =
									currentTime >= phaseStart && currentTime < phaseEnd;

								return (
									<div key={phase.id} className="flex items-center gap-2">
										<div className="w-16 text-right text-xs">
											{formatTime(phaseStart)}
										</div>
										<div className="relative h-3 flex-1 rounded bg-gray-200">
											<div
												className={`h-full rounded transition-all duration-300 ${
													isActive ? "opacity-100" : "opacity-50"
												}`}
												style={{
													width: `${(phase.duration / totalDuration) * 100}%`,
													backgroundColor: phase.color.getHexString(),
												}}
											/>
											{isActive && (
												<div
													className="absolute top-0 h-full w-1 bg-white"
													style={{
														left: `${((currentTime - phaseStart) / phase.duration) * 100}%`,
													}}
												/>
											)}
										</div>
										<div className="w-16 text-xs">{formatTime(phaseEnd)}</div>
										<div className="w-20 text-xs">{phase.polishName}</div>
									</div>
								);
							})}
						</div>
					</CardContent>
				</Card>
			</CardContent>
		</Card>
	);
};

// 3D Scene for time-lapse effects
interface TimeLapseSceneProps {
	phases: EffectPhase[];
	isPlaying: boolean;
	timeScale: number;
	currentTime: number;
	onTimeUpdate: (time: number) => void;
	onPhaseChange: (phase: number) => void;
	onEffectProgress: (progress: number) => void;
}

const TimeLapseScene: React.FC<TimeLapseSceneProps> = ({
	phases,
	isPlaying,
	timeScale,
	currentTime,
	onTimeUpdate,
	onPhaseChange,
	onEffectProgress,
}) => {
	const groupRef = useRef<Group>(null);
	const animationProgressRef = useRef(0);

	// Animation loop
	useFrame((state, delta) => {
		if (!isPlaying) return;

		animationProgressRef.current += delta * timeScale;
		onTimeUpdate(animationProgressRef.current);

		// Determine current phase
		let phaseStart = 0;
		let currentPhase = 0;

		for (let i = 0; i < phases.length; i++) {
			const phaseEnd = phaseStart + phases[i].duration;
			if (
				animationProgressRef.current >= phaseStart &&
				animationProgressRef.current < phaseEnd
			) {
				currentPhase = i;
				break;
			}
			phaseStart = phaseEnd;
		}

		onPhaseChange(currentPhase);

		// Calculate overall progress
		const totalProgress =
			(animationProgressRef.current /
				phases.reduce((sum, phase) => sum + phase.duration, 0)) *
			100;
		onEffectProgress(Math.min(100, totalProgress));
	});

	return (
		<group ref={groupRef}>
			{/* Lighting */}
			<ambientLight intensity={0.6} />
			<pointLight position={[10, 10, 10]} intensity={0.8} />
			<pointLight position={[-10, -10, -10]} intensity={0.4} color="#4444ff" />

			{/* Human body representation */}
			<HumanBodyTimeLapse />

			{/* Effect visualizations */}
			<EffectVisualizations phases={phases} currentTime={currentTime} />

			{/* Time indicator */}
			<TimeIndicator currentTime={currentTime} />
		</group>
	);
};

// Human body for time-lapse
const HumanBodyTimeLapse: React.FC = () => {
	return (
		<group>
			{/* Body outline */}
			<mesh position={[0, 0, -0.5]}>
				<capsuleGeometry args={[1, 2.5, 8, 16]} />
				<meshStandardMaterial color="#1F2937" transparent opacity={0.1} />
			</mesh>

			{/* Body label */}
			<Html position={[0, -2, 0]}>
				<div className="rounded bg-black/70 px-2 py-1 text-sm text-white">
					Organizm człowieka
				</div>
			</Html>
		</group>
	);
};

// Effect visualizations component
interface EffectVisualizationsProps {
	phases: EffectPhase[];
	currentTime: number;
}

const EffectVisualizations: React.FC<EffectVisualizationsProps> = ({
	phases,
	currentTime,
}) => {
	// Determine current phase
	let phaseStart = 0;
	let currentPhase = 0;

	for (let i = 0; i < phases.length; i++) {
		const phaseEnd = phaseStart + phases[i].duration;
		if (currentTime >= phaseStart && currentTime < phaseEnd) {
			currentPhase = i;
			break;
		}
		phaseStart = phaseEnd;
	}

	const phase = phases[currentPhase];
	if (!phase) return null;

	const phaseProgress = Math.min(
		1,
		(currentTime - phaseStart) / phase.duration,
	);

	return (
		<group>
			{/* Phase-specific effects */}
			{phase.visualEffect === "particles" && (
				<ParticleEffect
					color={phase.color}
					intensity={phase.intensity * phaseProgress}
					position={[0, 0, 0]}
				/>
			)}

			{phase.visualEffect === "glow" && (
				<GlowEffect
					color={phase.color}
					intensity={phase.intensity * phaseProgress}
					position={[0, 0, 0]}
				/>
			)}

			{phase.visualEffect === "pulse" && (
				<PulseEffect
					color={phase.color}
					intensity={phase.intensity * phaseProgress}
					position={[0, 0, 0]}
				/>
			)}

			{phase.visualEffect === "wave" && (
				<WaveEffect
					color={phase.color}
					intensity={phase.intensity * phaseProgress}
					position={[0, 0, 0]}
				/>
			)}

			{/* Phase label */}
			<Html position={[0, 2.5, 0]}>
				<div className="rounded bg-black/70 px-2 py-1 text-sm text-white">
					{phase.polishName}
				</div>
			</Html>
		</group>
	);
};

// Particle effect component
interface ParticleEffectProps {
	color: Color;
	intensity: number;
	position: Vector3;
}

const ParticleEffect: React.FC<ParticleEffectProps> = ({
	color,
	intensity,
	position,
}) => {
	return (
		<group position={position}>
			{Array.from({ length: Math.floor(20 * intensity) }).map((_, i) => {
				const angle = (i / 20) * Math.PI * 2;
				const radius = 2 * intensity;
				const x = Math.cos(angle) * radius;
				const y = Math.sin(angle) * radius;
				const z = (Math.random() - 0.5) * 0.5;

				return (
					<mesh key={i} position={[x, y, z]}>
						<sphereGeometry args={[0.05, 6, 6]} />
						<meshBasicMaterial
							color={color}
							transparent
							opacity={intensity * 0.8}
						/>
					</mesh>
				);
			})}
		</group>
	);
};

// Glow effect component
interface GlowEffectProps {
	color: Color;
	intensity: number;
	position: Vector3;
}

const GlowEffect: React.FC<GlowEffectProps> = ({
	color,
	intensity,
	position,
}) => {
	return (
		<mesh position={position}>
			<sphereGeometry args={[2.5, 16, 16]} />
			<meshBasicMaterial color={color} transparent opacity={intensity * 0.3} />
		</mesh>
	);
};

// Pulse effect component
interface PulseEffectProps {
	color: Color;
	intensity: number;
	position: Vector3;
}

const PulseEffect: React.FC<PulseEffectProps> = ({
	color,
	intensity,
	position,
}) => {
	const pulseScale = 1 + Math.sin(Date.now() * 0.01) * intensity * 0.3;

	return (
		<mesh position={position} scale={[pulseScale, pulseScale, pulseScale]}>
			<sphereGeometry args={[1.5, 12, 12]} />
			<meshBasicMaterial color={color} transparent opacity={intensity * 0.4} />
		</mesh>
	);
};

// Wave effect component
interface WaveEffectProps {
	color: Color;
	intensity: number;
	position: Vector3;
}

const WaveEffect: React.FC<WaveEffectProps> = ({
	color,
	intensity,
	position,
}) => {
	return (
		<group position={position}>
			{Array.from({ length: 5 }).map((_, i) => {
				const radius = 1 + i * 0.5;
				const opacity = intensity * (1 - i * 0.2);

				return (
					<mesh key={i} position={[0, 0, 0]}>
						<ringGeometry args={[radius, radius + 0.2, 16]} />
						<meshBasicMaterial color={color} transparent opacity={opacity} />
					</mesh>
				);
			})}
		</group>
	);
};

// Time indicator component
interface TimeIndicatorProps {
	currentTime: number;
}

const TimeIndicator: React.FC<TimeIndicatorProps> = ({ currentTime }) => {
	return (
		<Html position={[3, 2, 0]}>
			<div className="rounded bg-black/70 px-2 py-1 text-sm text-white">
				{formatTime(currentTime)}
			</div>
		</Html>
	);
};

// Utility function to format time
function formatTime(seconds: number): string {
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = Math.floor(seconds % 60);
	return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

export default TimeLapseEffectDemonstrator;
