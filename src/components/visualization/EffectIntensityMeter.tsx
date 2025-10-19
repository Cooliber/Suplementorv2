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
	Activity,
	Pause,
	Play,
	RotateCcw,
	TrendingUp,
	Zap,
} from "lucide-react";
import type React from "react";
import { useMemo, useRef, useState } from "react";
import {
	BufferGeometry,
	Color,
	type Group,
	Mesh,
	MeshStandardMaterial,
	Vector3,
} from "three";

interface EffectIntensityMeterProps {
	supplementName: string;
	polishSupplementName: string;
	timeRange: number; // hours
	intensityCurves: IntensityCurve[];
	currentTime?: number;
	onTimeChange?: (time: number) => void;
	className?: string;
}

interface IntensityCurve {
	id: string;
	name: string;
	polishName: string;
	color: Color;
	dataPoints: { time: number; intensity: number }[];
	unit: string;
}

const CREATINE_INTENSITY_DATA: IntensityCurve[] = [
	{
		id: "muscle-creatine",
		name: "Muscle Creatine Levels",
		polishName: "Poziom kreatyny w mięśniach",
		color: new Color("#F59E0B"),
		unit: "%",
		dataPoints: [
			{ time: 0, intensity: 0 },
			{ time: 1, intensity: 20 },
			{ time: 2, intensity: 45 },
			{ time: 4, intensity: 75 },
			{ time: 8, intensity: 90 },
			{ time: 12, intensity: 95 },
			{ time: 24, intensity: 98 },
			{ time: 48, intensity: 100 },
			{ time: 72, intensity: 95 },
		],
	},
	{
		id: "performance",
		name: "Performance Enhancement",
		polishName: "Poprawa wydolności",
		color: new Color("#EF4444"),
		unit: "%",
		dataPoints: [
			{ time: 0, intensity: 0 },
			{ time: 2, intensity: 15 },
			{ time: 6, intensity: 40 },
			{ time: 12, intensity: 65 },
			{ time: 24, intensity: 80 },
			{ time: 48, intensity: 85 },
			{ time: 72, intensity: 82 },
		],
	},
	{
		id: "recovery",
		name: "Recovery Rate",
		polishName: "Tempo regeneracji",
		color: new Color("#10B981"),
		unit: "%",
		dataPoints: [
			{ time: 0, intensity: 0 },
			{ time: 1, intensity: 25 },
			{ time: 3, intensity: 50 },
			{ time: 6, intensity: 70 },
			{ time: 12, intensity: 85 },
			{ time: 24, intensity: 90 },
			{ time: 48, intensity: 88 },
		],
	},
];

export const EffectIntensityMeter: React.FC<EffectIntensityMeterProps> = ({
	supplementName = "Creatine",
	polishSupplementName = "Kreatyna",
	timeRange = 72,
	intensityCurves = CREATINE_INTENSITY_DATA,
	currentTime = 0,
	onTimeChange,
	className = "",
}) => {
	const [isPlaying, setIsPlaying] = useState(false);
	const [animationSpeed, setAnimationSpeed] = useState(1);
	const [selectedCurve, setSelectedCurve] = useState<string | null>(null);
	const animationProgressRef = useRef(0);

	const currentIntensities = useMemo(() => {
		return intensityCurves.map((curve) => {
			const intensity = getIntensityAtTime(currentTime, curve);
			return {
				curve,
				intensity,
				position: new Vector3(
					(currentTime / timeRange) * 6 - 3,
					intensity * 2,
					0,
				),
			};
		});
	}, [currentTime, intensityCurves, timeRange]);

	return (
		<Card className={`w-full ${className}`}>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<TrendingUp className="h-5 w-5" />
					Pomiar intensywności efektów
				</CardTitle>
				<div className="space-y-1">
					<p className="font-medium text-sm">
						{polishSupplementName} - analiza czasowa
					</p>
					<div className="flex items-center gap-2">
						<Badge variant="outline">Czas: {currentTime.toFixed(1)}h</Badge>
						<Badge variant="secondary">Zakres: 0-{timeRange}h</Badge>
					</div>
				</div>
			</CardHeader>
			<CardContent className="space-y-4">
				<div
					className="relative overflow-hidden rounded-lg bg-gray-900"
					style={{ height: "400px" }}
				>
					<Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
						<EffectIntensityScene
							intensityCurves={intensityCurves}
							currentTime={currentTime}
							timeRange={timeRange}
							currentIntensities={currentIntensities}
							selectedCurve={selectedCurve}
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
							<div>Czas: {currentTime.toFixed(1)} godzin</div>
							<div>
								Średnia intensywność:{" "}
								{Math.round(
									(currentIntensities.reduce(
										(sum, item) => sum + item.intensity,
										0,
									) /
										currentIntensities.length) *
										100,
								)}
								%
							</div>
						</div>
					</div>
				</div>

				{/* Time control */}
				<div className="space-y-2">
					<div className="flex items-center justify-between">
						<span className="font-medium text-sm">Czas analizy</span>
						<Badge variant="outline">{currentTime.toFixed(1)}h</Badge>
					</div>
					<Slider
						value={[currentTime]}
						onValueChange={([value]) => onTimeChange?.(value || 0)}
						min={0}
						max={timeRange}
						step={0.5}
						className="w-full"
					/>
					<div className="flex justify-between text-gray-500 text-xs">
						<span>0h</span>
						<span>Optymalne: 24-48h</span>
						<span>{timeRange}h</span>
					</div>
				</div>

				{/* Intensity curves */}
				<div className="space-y-3">
					<div className="flex items-center gap-2">
						<Activity className="h-4 w-4" />
						<span className="font-medium text-sm">Krzywe intensywności</span>
					</div>

					{intensityCurves.map((curve) => {
						const intensity = getIntensityAtTime(currentTime, curve);

						return (
							<Card
								key={curve.id}
								className={`cursor-pointer p-3 transition-colors ${
									selectedCurve === curve.id
										? "border-blue-200 bg-blue-50"
										: "hover:bg-gray-50"
								}`}
								onClick={() =>
									setSelectedCurve(selectedCurve === curve.id ? null : curve.id)
								}
							>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<div
											className="h-3 w-3 rounded-full"
											style={{ backgroundColor: curve.color.getHexString() }}
										/>
										<span className="font-medium text-sm">
											{curve.polishName}
										</span>
									</div>
									<div className="flex items-center gap-2">
										<Badge variant="outline">
											{Math.round(intensity * 100)}
											{curve.unit}
										</Badge>
										<span className="text-gray-500 text-xs">
											{getTrendIndicator(currentTime, curve)}
										</span>
									</div>
								</div>

								{/* Intensity visualization */}
								<div className="mt-2">
									<div className="relative h-2 rounded bg-gray-200">
										<div
											className="h-full rounded transition-all duration-300"
											style={{
												width: `${intensity * 100}%`,
												backgroundColor: curve.color.getHexString(),
											}}
										/>
									</div>
								</div>

								{/* Time markers */}
								<div className="mt-1 flex justify-between text-gray-500 text-xs">
									<span>Początek</span>
									<span>Szczyt: {findPeakTime(curve)}h</span>
									<span>Plateau</span>
								</div>
							</Card>
						);
					})}
				</div>

				{/* Summary statistics */}
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm">Statystyki efektów</CardTitle>
					</CardHeader>
					<CardContent className="pt-0">
						<div className="grid grid-cols-3 gap-4 text-sm">
							<div className="text-center">
								<div className="font-bold text-green-600 text-lg">
									{Math.round(
										(currentIntensities.reduce(
											(sum, item) => sum + item.intensity,
											0,
										) /
											currentIntensities.length) *
											100,
									)}
									%
								</div>
								<div className="text-gray-500 text-xs">
									Średnia intensywność
								</div>
							</div>
							<div className="text-center">
								<div className="font-bold text-blue-600 text-lg">
									{findMaxIntensityTime(intensityCurves)}h
								</div>
								<div className="text-gray-500 text-xs">Szczyt efektu</div>
							</div>
							<div className="text-center">
								<div className="font-bold text-lg text-purple-600">
									{Math.round(
										calculateAUC(intensityCurves, timeRange) / timeRange,
									)}
									%
								</div>
								<div className="text-gray-500 text-xs">Średnia skuteczność</div>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Optimal timing */}
				<Card className="bg-green-50">
					<CardContent className="p-4">
						<div className="flex items-center gap-2">
							<Zap className="h-5 w-5 text-green-600" />
							<div>
								<div className="font-medium text-green-800">
									Okno optymalnego działania
								</div>
								<div className="text-green-700 text-sm">
									Najlepsze efekty występują między 24-48 godzinami od
									rozpoczęcia suplementacji
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</CardContent>
		</Card>
	);
};

// 3D Scene for effect intensity
interface EffectIntensitySceneProps {
	intensityCurves: IntensityCurve[];
	currentTime: number;
	timeRange: number;
	currentIntensities: {
		curve: IntensityCurve;
		intensity: number;
		position: Vector3;
	}[];
	selectedCurve: string | null;
}

const EffectIntensityScene: React.FC<EffectIntensitySceneProps> = ({
	intensityCurves,
	currentTime,
	timeRange,
	currentIntensities,
	selectedCurve,
}) => {
	const groupRef = useRef<Group>(null);

	return (
		<group ref={groupRef}>
			{/* Lighting */}
			<ambientLight intensity={0.6} />
			<pointLight position={[10, 10, 10]} intensity={0.8} />
			<pointLight position={[-10, -10, -10]} intensity={0.4} color="#4444ff" />

			{/* Time axis */}
			<TimeAxis timeRange={timeRange} />

			{/* Intensity curves */}
			{intensityCurves.map((curve) => (
				<IntensityCurveVisualization
					key={curve.id}
					curve={curve}
					currentTime={currentTime}
					timeRange={timeRange}
					isSelected={selectedCurve === curve.id}
				/>
			))}

			{/* Current time indicator */}
			<CurrentTimeIndicator currentTime={currentTime} timeRange={timeRange} />

			{/* Current intensity points */}
			{currentIntensities.map((item, index) => (
				<IntensityPoint
					key={index}
					position={item.position}
					intensity={item.intensity}
					color={item.curve.color}
					isSelected={selectedCurve === item.curve.id}
				/>
			))}

			{/* Background grid */}
			<gridHelper args={[8, 20]} />
		</group>
	);
};

// Time axis component
interface TimeAxisProps {
	timeRange: number;
}

const TimeAxis: React.FC<TimeAxisProps> = ({ timeRange }) => {
	return (
		<group>
			{/* Axis line */}
			<mesh position={[0, -2, 0]}>
				<bufferGeometry>
					<bufferAttribute
						attach="attributes-position"
						count={2}
						array={new Float32Array([-3, 0, 0, 3, 0, 0])}
						itemSize={3}
					/>
				</bufferGeometry>
				<lineBasicMaterial color="#6B7280" />
			</mesh>

			{/* Time markers */}
			{Array.from({ length: timeRange / 12 + 1 }).map((_, i) => {
				const time = i * 12;
				const x = (time / timeRange) * 6 - 3;

				return (
					<group key={i}>
						{/* Tick mark */}
						<mesh position={[x, -2, 0]}>
							<bufferGeometry>
								<bufferAttribute
									attach="attributes-position"
									count={2}
									array={new Float32Array([0, 0, 0, 0, 0.2, 0])}
									itemSize={3}
								/>
							</bufferGeometry>
							<lineBasicMaterial color="#6B7280" />
						</mesh>

						{/* Time label */}
						<Html position={[x, -2.5, 0]}>
							<div className="rounded bg-black/70 px-1 py-0.5 text-white text-xs">
								{time}h
							</div>
						</Html>
					</group>
				);
			})}

			{/* Axis labels */}
			<Html position={[0, -3, 0]}>
				<div className="rounded bg-black/70 px-2 py-1 text-sm text-white">
					Czas (godziny)
				</div>
			</Html>

			<Html position={[0, 3, 0]}>
				<div className="rounded bg-black/70 px-2 py-1 text-sm text-white">
					Intensywność efektu (%)
				</div>
			</Html>
		</group>
	);
};

// Intensity curve visualization component
interface IntensityCurveVisualizationProps {
	curve: IntensityCurve;
	currentTime: number;
	timeRange: number;
	isSelected: boolean;
}

const IntensityCurveVisualization: React.FC<
	IntensityCurveVisualizationProps
> = ({ curve, currentTime, timeRange, isSelected }) => {
	const points = useMemo(() => {
		return curve.dataPoints.map((point) => {
			const x = (point.time / timeRange) * 6 - 3;
			const y = point.intensity * 2;
			return new Vector3(x, y, 0);
		});
	}, [curve, timeRange]);

	return (
		<group>
			{/* Curve line */}
			{points.map((point, index) => {
				if (index === 0) return null;

				const prevPoint = points[index - 1];
				const isCurrentTime =
					index ===
					Math.floor((currentTime / timeRange) * curve.dataPoints.length);

				return (
					<group key={index}>
						<mesh>
							<bufferGeometry>
								<bufferAttribute
									attach="attributes-position"
									count={2}
									array={
										new Float32Array([
											prevPoint.x,
											prevPoint.y,
											prevPoint.z,
											point.x,
											point.y,
											point.z,
										])
									}
									itemSize={3}
								/>
							</bufferGeometry>
							<lineBasicMaterial
								color={curve.color}
								opacity={isSelected ? 1 : 0.7}
								transparent
							/>
						</mesh>

						{/* Data points */}
						<mesh position={point}>
							<sphereGeometry args={[0.03, 6, 6]} />
							<meshBasicMaterial color={curve.color} />
						</mesh>
					</group>
				);
			})}

			{/* Curve label */}
			<Html
				position={[
					points[points.length - 1].x,
					points[points.length - 1].y + 0.3,
					0,
				]}
			>
				<div className="rounded bg-black/70 px-1 py-0.5 text-white text-xs">
					{curve.polishName}
				</div>
			</Html>
		</group>
	);
};

// Current time indicator component
interface CurrentTimeIndicatorProps {
	currentTime: number;
	timeRange: number;
}

const CurrentTimeIndicator: React.FC<CurrentTimeIndicatorProps> = ({
	currentTime,
	timeRange,
}) => {
	const x = (currentTime / timeRange) * 6 - 3;

	return (
		<group position={[x, 0, 0]}>
			{/* Vertical line */}
			<mesh>
				<bufferGeometry>
					<bufferAttribute
						attach="attributes-position"
						count={2}
						array={new Float32Array([0, -2, 0, 0, 3, 0])}
						itemSize={3}
					/>
				</bufferGeometry>
				<lineBasicMaterial color="#F59E0B" opacity={0.8} transparent />
			</mesh>

			{/* Time label */}
			<Html position={[0, -2.8, 0]}>
				<div className="rounded bg-orange-500 px-2 py-1 text-sm text-white">
					{currentTime.toFixed(1)}h
				</div>
			</Html>
		</group>
	);
};

// Intensity point component
interface IntensityPointProps {
	position: Vector3;
	intensity: number;
	color: Color;
	isSelected: boolean;
}

const IntensityPoint: React.FC<IntensityPointProps> = ({
	position,
	intensity,
	color,
	isSelected,
}) => {
	return (
		<group position={position}>
			<mesh>
				<sphereGeometry args={[0.08, 8, 8]} />
				<meshStandardMaterial
					color={color}
					emissive={isSelected ? color.getHex() : 0x000000}
					emissiveIntensity={isSelected ? 0.3 : 0}
				/>
			</mesh>

			{/* Intensity ring */}
			<mesh>
				<ringGeometry args={[0.12, 0.18, 8]} />
				<meshBasicMaterial color={color} transparent opacity={0.4} />
			</mesh>
		</group>
	);
};

// Utility functions
function getIntensityAtTime(time: number, curve: IntensityCurve): number {
	const points = curve.dataPoints;

	// Find the two points that bracket the current time
	for (let i = 0; i < points.length - 1; i++) {
		const current = points[i];
		const next = points[i + 1];

		if (time >= current.time && time <= next.time) {
			// Linear interpolation
			const t = (time - current.time) / (next.time - current.time);
			return current.intensity + t * (next.intensity - current.intensity);
		}
	}

	// Extrapolate if time is beyond the data range
	if (time < points[0].time) return points[0].intensity;
	if (time > points[points.length - 1].time)
		return points[points.length - 1].intensity;

	return 0;
}

function getTrendIndicator(time: number, curve: IntensityCurve): string {
	if (time < 6) return "↗ Wzrost";
	if (time < 48) return "→ Plateau";
	return "↘ Spadek";
}

function findPeakTime(curve: IntensityCurve): number {
	let maxIntensity = 0;
	let peakTime = 0;

	curve.dataPoints.forEach((point) => {
		if (point.intensity > maxIntensity) {
			maxIntensity = point.intensity;
			peakTime = point.time;
		}
	});

	return peakTime;
}

function findMaxIntensityTime(curves: IntensityCurve[]): number {
	const allPoints = curves.flatMap((curve) => curve.dataPoints);
	let maxIntensity = 0;
	let maxTime = 0;

	allPoints.forEach((point) => {
		if (point.intensity > maxIntensity) {
			maxIntensity = point.intensity;
			maxTime = point.time;
		}
	});

	return maxTime;
}

function calculateAUC(curves: IntensityCurve[], timeRange: number): number {
	let totalAUC = 0;

	curves.forEach((curve) => {
		let curveAUC = 0;
		for (let i = 0; i < curve.dataPoints.length - 1; i++) {
			const current = curve.dataPoints[i];
			const next = curve.dataPoints[i + 1];
			const averageIntensity = (current.intensity + next.intensity) / 2;
			const timeInterval = next.time - current.time;
			curveAUC += averageIntensity * timeInterval;
		}
		totalAUC += curveAUC;
	});

	return totalAUC / curves.length;
}

export default EffectIntensityMeter;
