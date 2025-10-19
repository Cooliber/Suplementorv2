"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { animated, useSpring } from "@react-spring/three";
import { Html, OrbitControls, Text } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import {
	Activity,
	Brain,
	Dumbbell,
	Heart,
	Pause,
	Play,
	RotateCcw,
} from "lucide-react";
import type React from "react";
import { useMemo, useRef, useState } from "react";
import {
	BufferGeometry,
	Color,
	type Group,
	type Mesh,
	MeshStandardMaterial,
	Vector3,
} from "three";

interface OrganResponseSimulatorProps {
	supplementName: string;
	polishSupplementName: string;
	targetOrgans: string[];
	responseIntensity: number; // 0-1 scale
	autoPlay?: boolean;
	showRealTimeEffects?: boolean;
	className?: string;
}

interface Organ {
	id: string;
	name: string;
	polishName: string;
	position: Vector3;
	baseColor: Color;
	responseColor: Color;
	responseIntensity: number;
	responseType: "contraction" | "activation" | "relaxation" | "stimulation";
	isResponding: boolean;
	responseProgress: number;
}

const ORGAN_DATA = {
	heart: {
		name: "Serce",
		polishName: "Serce",
		position: new Vector3(0, 1, 0),
		baseColor: new Color("#EF4444"),
		responseColor: new Color("#F59E0B"),
		responseType: "contraction" as const,
	},
	brain: {
		name: "Mózg",
		polishName: "Mózg",
		position: new Vector3(0, 2.5, 0),
		baseColor: new Color("#8B5CF6"),
		responseColor: new Color("#10B981"),
		responseType: "activation" as const,
	},
	muscles: {
		name: "Mięśnie",
		polishName: "Mięśnie",
		position: new Vector3(-1.5, 0, 0),
		baseColor: new Color("#DC2626"),
		responseColor: new Color("#F59E0B"),
		responseType: "contraction" as const,
	},
	liver: {
		name: "Wątroba",
		polishName: "Wątroba",
		position: new Vector3(1.5, 0.5, 0),
		baseColor: new Color("#92400E"),
		responseColor: new Color("#F59E0B"),
		responseType: "activation" as const,
	},
};

export const OrganResponseSimulator: React.FC<OrganResponseSimulatorProps> = ({
	supplementName,
	polishSupplementName,
	targetOrgans,
	responseIntensity,
	autoPlay = true,
	showRealTimeEffects = true,
	className = "",
}) => {
	const [isPlaying, setIsPlaying] = useState(autoPlay);
	const [currentTime, setCurrentTime] = useState(0);
	const [responseProgress, setResponseProgress] = useState(0);
	const [selectedOrgan, setSelectedOrgan] = useState<string | null>(null);
	const animationProgressRef = useRef(0);

	const organs = useMemo(() => {
		return targetOrgans.map((organId) => ({
			id: organId,
			...ORGAN_DATA[organId as keyof typeof ORGAN_DATA],
		}));
	}, [targetOrgans]);

	return (
		<Card className={`w-full ${className}`}>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Activity className="h-5 w-5" />
					Symulator odpowiedzi narządów
				</CardTitle>
				<div className="space-y-1">
					<p className="font-medium text-sm">
						{polishSupplementName} - wpływ na narządy
					</p>
					<div className="flex items-center gap-2">
						<Badge variant="outline">
							Intensywność: {(responseIntensity * 100).toFixed(0)}%
						</Badge>
						<Badge variant="secondary">{targetOrgans.length} narządów</Badge>
					</div>
				</div>
			</CardHeader>
			<CardContent className="space-y-4">
				<div
					className="relative overflow-hidden rounded-lg bg-gray-900"
					style={{ height: "400px" }}
				>
					<Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
						<OrganResponseScene
							organs={organs}
							isPlaying={isPlaying}
							responseIntensity={responseIntensity}
							onTimeUpdate={setCurrentTime}
							onResponseProgress={setResponseProgress}
							selectedOrgan={selectedOrgan}
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
							<div>Czas: {currentTime.toFixed(1)}s</div>
							<Progress value={responseProgress} className="h-1 w-24" />
						</div>
					</div>
				</div>

				{/* Organ response indicators */}
				<div className="grid grid-cols-2 gap-2">
					{organs.map((organ) => (
						<Card
							key={organ.id}
							className={`cursor-pointer p-2 transition-colors ${
								selectedOrgan === organ.id
									? "border-blue-200 bg-blue-50"
									: "hover:bg-gray-50"
							}`}
							onClick={() =>
								setSelectedOrgan(selectedOrgan === organ.id ? null : organ.id)
							}
						>
							<div className="flex items-center gap-2">
								<div
									className="h-3 w-3 rounded-full"
									style={{
										backgroundColor: organ.isResponding
											? organ.responseColor.getHexString()
											: organ.baseColor.getHexString(),
									}}
								/>
								<span className="font-medium text-sm">{organ.polishName}</span>
							</div>
							<div className="mt-1">
								<Progress
									value={organ.responseIntensity * 100}
									className="h-1"
								/>
							</div>
						</Card>
					))}
				</div>

				{/* Controls */}
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
							setResponseProgress(0);
							animationProgressRef.current = 0;
						}}
					>
						<RotateCcw className="h-4 w-4" />
					</Button>

					<div className="flex-1">
						<Progress value={responseProgress} className="h-2" />
					</div>

					<Badge variant="outline">{responseProgress.toFixed(0)}%</Badge>
				</div>

				{/* Response timeline */}
				{showRealTimeEffects && (
					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm">Oś czasu odpowiedzi</CardTitle>
						</CardHeader>
						<CardContent className="pt-0">
							<div className="space-y-2">
								{organs.map((organ, index) => (
									<div key={organ.id} className="flex items-center gap-2">
										<span className="w-16 text-xs">{organ.polishName}</span>
										<div className="h-2 flex-1 rounded bg-gray-200">
											<div
												className="h-full rounded transition-all duration-300"
												style={{
													width: `${organ.responseIntensity * 100}%`,
													backgroundColor: organ.responseColor.getHexString(),
												}}
											/>
										</div>
										<span className="w-8 text-xs">
											{Math.round(organ.responseIntensity * 100)}%
										</span>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				)}
			</CardContent>
		</Card>
	);
};

// 3D Scene for organ responses
interface OrganResponseSceneProps {
	organs: Organ[];
	isPlaying: boolean;
	responseIntensity: number;
	onTimeUpdate: (time: number) => void;
	onResponseProgress: (progress: number) => void;
	selectedOrgan: string | null;
}

const OrganResponseScene: React.FC<OrganResponseSceneProps> = ({
	organs,
	isPlaying,
	responseIntensity,
	onTimeUpdate,
	onResponseProgress,
	selectedOrgan,
}) => {
	const groupRef = useRef<Group>(null);
	const animationProgressRef = useRef(0);

	// Animation loop
	useFrame((state, delta) => {
		if (!isPlaying) return;

		animationProgressRef.current += delta;
		onTimeUpdate(animationProgressRef.current);

		organs.forEach((organ, index) => {
			// Stagger organ responses
			const staggerDelay = index * 0.5;
			const adjustedTime = Math.max(
				0,
				animationProgressRef.current - staggerDelay,
			);

			if (adjustedTime > 0 && adjustedTime < 5) {
				// Ramp up response
				organ.responseProgress = Math.min(1, adjustedTime / 2);
				organ.responseIntensity = organ.responseProgress * responseIntensity;
				organ.isResponding = true;
			} else if (adjustedTime >= 5) {
				// Sustained response with slight fluctuation
				organ.responseIntensity =
					responseIntensity * (0.8 + Math.sin(adjustedTime * 2) * 0.2);
			}
		});

		// Calculate overall progress
		const totalResponse = organs.reduce(
			(sum, organ) => sum + organ.responseIntensity,
			0,
		);
		const averageProgress = (totalResponse / organs.length) * 100;
		onResponseProgress(Math.min(100, averageProgress));
	});

	return (
		<group ref={groupRef}>
			{/* Lighting */}
			<ambientLight intensity={0.6} />
			<pointLight position={[10, 10, 10]} intensity={0.8} />
			<pointLight position={[-10, -10, -10]} intensity={0.4} color="#4444ff" />

			{/* Human body silhouette */}
			<HumanBodySilhouette />

			{/* Organs */}
			{organs.map((organ) => (
				<OrganComponent
					key={organ.id}
					organ={organ}
					isSelected={selectedOrgan === organ.id}
				/>
			))}

			{/* Response effects */}
			<ResponseEffects organs={organs} />
		</group>
	);
};

// Human body silhouette component
const HumanBodySilhouette: React.FC = () => {
	return (
		<group>
			{/* Body outline */}
			<mesh position={[0, 0.5, -0.5]}>
				<capsuleGeometry args={[1.5, 3, 8, 16]} />
				<meshStandardMaterial color="#1F2937" transparent opacity={0.1} />
			</mesh>

			{/* Body label */}
			<Html position={[0, -2, 0]}>
				<div className="rounded bg-black/70 px-2 py-1 text-sm text-white">
					Sylwetka człowieka
				</div>
			</Html>
		</group>
	);
};

// Organ component
interface OrganComponentProps {
	organ: Organ;
	isSelected: boolean;
}

const OrganComponent: React.FC<OrganComponentProps> = ({
	organ,
	isSelected,
}) => {
	const meshRef = useRef<Mesh>(null);

	const { scale, color } = useSpring({
		scale: organ.isResponding ? 1 + organ.responseIntensity * 0.3 : 1,
		color: organ.isResponding
			? organ.responseColor
					.clone()
					.lerp(organ.baseColor, 1 - organ.responseIntensity)
			: organ.baseColor,
		config: { tension: 200, friction: 30 },
	});

	useFrame(() => {
		if (meshRef.current) {
			meshRef.current.position.copy(organ.position);
		}
	});

	return (
		<group>
			<animated.mesh ref={meshRef} scale={scale}>
				<sphereGeometry args={[0.4, 16, 16]} />
				<meshStandardMaterial
					color={color}
					emissive={organ.isResponding ? color.getHex() : 0x000000}
					emissiveIntensity={
						organ.isResponding ? organ.responseIntensity * 0.3 : 0
					}
				/>
			</animated.mesh>

			{/* Pulsing effect for active organs */}
			{organ.isResponding && (
				<mesh position={organ.position}>
					<sphereGeometry args={[0.6, 12, 12]} />
					<meshBasicMaterial
						color={organ.responseColor}
						transparent
						opacity={organ.responseIntensity * 0.2}
					/>
				</mesh>
			)}

			{/* Organ label */}
			<Html
				position={[organ.position.x, organ.position.y + 0.6, organ.position.z]}
			>
				<div
					className={`rounded px-1 py-0.5 text-xs ${
						isSelected ? "bg-blue-500 text-white" : "bg-black/70 text-white"
					}`}
				>
					{organ.polishName}
				</div>
			</Html>

			{/* Response type indicator */}
			<Html
				position={[organ.position.x, organ.position.y - 0.6, organ.position.z]}
			>
				<div className="rounded bg-black/70 px-1 py-0.5 text-white text-xs">
					{organ.responseType === "contraction"
						? "Skurcz"
						: organ.responseType === "activation"
							? "Aktywacja"
							: organ.responseType === "relaxation"
								? "Relaksacja"
								: "Stymulacja"}
				</div>
			</Html>
		</group>
	);
};

// Response effects component
interface ResponseEffectsProps {
	organs: Organ[];
}

const ResponseEffects: React.FC<ResponseEffectsProps> = ({ organs }) => {
	return (
		<group>
			{organs
				.filter((organ) => organ.isResponding)
				.map((organ) => (
					<group key={`effects-${organ.id}`}>
						{/* Response particles */}
						{Array.from({ length: 8 }).map((_, i) => {
							const angle = (i / 8) * Math.PI * 2;
							const radius = 0.8;
							const x = organ.position.x + Math.cos(angle) * radius;
							const y = organ.position.y + Math.sin(angle) * radius;
							const z =
								organ.position.z + Math.sin(Date.now() * 0.01 + i) * 0.2;

							return (
								<mesh key={i} position={[x, y, z]}>
									<sphereGeometry args={[0.03, 6, 6]} />
									<meshBasicMaterial
										color={organ.responseColor}
										transparent
										opacity={organ.responseIntensity * 0.6}
									/>
								</mesh>
							);
						})}

						{/* Response waves */}
						<mesh position={organ.position}>
							<ringGeometry args={[1, 1.2, 16]} />
							<meshBasicMaterial
								color={organ.responseColor}
								transparent
								opacity={organ.responseIntensity * 0.3}
							/>
						</mesh>
					</group>
				))}
		</group>
	);
};

export default OrganResponseSimulator;
