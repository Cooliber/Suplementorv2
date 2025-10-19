"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { animated, useSpring } from "@react-spring/three";
import { Html, OrbitControls, Text } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import {
	Activity,
	ArrowLeftRight,
	Eye,
	EyeOff,
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
	Mesh,
	MeshStandardMaterial,
	Vector3,
} from "three";

interface BeforeAfterComparisonModeProps {
	supplementName: string;
	polishSupplementName: string;
	comparisonAspect: "energy" | "strength" | "recovery" | "endurance";
	polishComparisonAspect: string;
	beforeMetrics: Record<string, number>;
	afterMetrics: Record<string, number>;
	autoPlay?: boolean;
	showMetrics?: boolean;
	className?: string;
}

interface ComparisonState {
	id: string;
	name: string;
	polishName: string;
	beforeValue: number;
	afterValue: number;
	unit: string;
	improvement: number; // percentage improvement
	visualPosition: Vector3;
	color: Color;
}

const ENERGY_COMPARISON = {
	aspect: "energy",
	polishAspect: "Poziom energii",
	metrics: [
		{
			id: "atp-levels",
			name: "Poziomy ATP",
			polishName: "Poziomy ATP",
			beforeValue: 45,
			afterValue: 78,
			unit: "%",
			visualPosition: new Vector3(-2, 1, 0),
			color: new Color("#F59E0B"),
		},
		{
			id: "mitochondrial-function",
			name: "Funkcja mitochondriów",
			polishName: "Funkcja mitochondriów",
			beforeValue: 50,
			afterValue: 82,
			unit: "%",
			visualPosition: new Vector3(0, 1, 0),
			color: new Color("#EF4444"),
		},
		{
			id: "cellular-energy",
			name: "Energia komórkowa",
			polishName: "Energia komórkowa",
			beforeValue: 40,
			afterValue: 75,
			unit: "%",
			visualPosition: new Vector3(2, 1, 0),
			color: new Color("#10B981"),
		},
	],
};

export const BeforeAfterComparisonMode: React.FC<
	BeforeAfterComparisonModeProps
> = ({
	supplementName,
	polishSupplementName,
	comparisonAspect,
	polishComparisonAspect,
	beforeMetrics,
	afterMetrics,
	autoPlay = true,
	showMetrics = true,
	className = "",
}) => {
	const [isPlaying, setIsPlaying] = useState(autoPlay);
	const [transitionProgress, setTransitionProgress] = useState(0);
	const [showComparison, setShowComparison] = useState(false);
	const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
	const animationProgressRef = useRef(0);

	const comparisonData = ENERGY_COMPARISON;
	const metrics = comparisonData.metrics.map((metric) => ({
		...metric,
		beforeValue: beforeMetrics[metric.id] || metric.beforeValue,
		afterValue: afterMetrics[metric.id] || metric.afterValue,
		improvement:
			((metric.afterValue - metric.beforeValue) / metric.beforeValue) * 100,
	}));

	return (
		<Card className={`w-full ${className}`}>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<ArrowLeftRight className="h-5 w-5" />
					Tryb porównania przed/po
				</CardTitle>
				<div className="space-y-1">
					<p className="font-medium text-sm">
						{polishSupplementName} - {polishComparisonAspect}
					</p>
					<div className="flex items-center gap-2">
						<Badge variant="outline">{metrics.length} parametrów</Badge>
						<Badge variant="secondary">
							Średnia poprawa:{" "}
							{Math.round(
								metrics.reduce((sum, m) => sum + m.improvement, 0) /
									metrics.length,
							)}
							%
						</Badge>
					</div>
				</div>
			</CardHeader>
			<CardContent className="space-y-4">
				<div
					className="relative overflow-hidden rounded-lg bg-gray-900"
					style={{ height: "400px" }}
				>
					<Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
						<BeforeAfterScene
							metrics={metrics}
							isPlaying={isPlaying}
							transitionProgress={transitionProgress}
							showComparison={showComparison}
							selectedMetric={selectedMetric}
						/>
						<OrbitControls
							enablePan={true}
							enableZoom={true}
							enableRotate={true}
						/>
					</Canvas>

					{/* Transition overlay */}
					<div className="absolute top-4 left-4 rounded bg-black/70 p-2 text-sm text-white">
						<div className="space-y-1">
							<div>Przejście: {Math.round(transitionProgress)}%</div>
							<Progress value={transitionProgress} className="h-1 w-24" />
						</div>
					</div>
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
							setTransitionProgress(0);
							setShowComparison(false);
							animationProgressRef.current = 0;
						}}
					>
						<RotateCcw className="h-4 w-4" />
					</Button>

					<div className="flex-1">
						<Slider
							value={[transitionProgress]}
							onValueChange={([value]) => setTransitionProgress(value || 0)}
							min={0}
							max={100}
							step={1}
							className="w-full"
						/>
					</div>

					<Badge variant="outline">{Math.round(transitionProgress)}%</Badge>
				</div>

				{/* Comparison toggle */}
				<div className="flex items-center gap-2">
					<Switch
						checked={showComparison}
						onCheckedChange={setShowComparison}
					/>
					<span className="text-sm">Pokaż porównanie</span>
				</div>

				{/* Metrics comparison */}
				{showMetrics && (
					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm">Porównanie parametrów</CardTitle>
						</CardHeader>
						<CardContent className="pt-0">
							<div className="space-y-3">
								{metrics.map((metric) => (
									<div
										key={metric.id}
										className={`cursor-pointer rounded p-2 transition-colors ${
											selectedMetric === metric.id
												? "border border-blue-200 bg-blue-50"
												: "hover:bg-gray-50"
										}`}
										onClick={() =>
											setSelectedMetric(
												selectedMetric === metric.id ? null : metric.id,
											)
										}
									>
										<div className="flex items-center justify-between">
											<span className="font-medium text-sm">
												{metric.polishName}
											</span>
											<Badge
												variant={
													metric.improvement > 0 ? "default" : "destructive"
												}
											>
												{metric.improvement > 0 ? "+" : ""}
												{metric.improvement.toFixed(0)}%
											</Badge>
										</div>

										<div className="mt-1 flex items-center gap-2">
											<div className="h-2 flex-1 rounded bg-gray-200">
												<div
													className="h-full rounded bg-red-400"
													style={{ width: `${metric.beforeValue}%` }}
												/>
											</div>
											<span className="text-gray-500 text-xs">
												{metric.beforeValue}
												{metric.unit}
											</span>
											<ArrowLeftRight className="h-3 w-3 text-gray-400" />
											<div className="h-2 flex-1 rounded bg-gray-200">
												<div
													className="h-full rounded bg-green-400"
													style={{ width: `${metric.afterValue}%` }}
												/>
											</div>
											<span className="text-gray-500 text-xs">
												{metric.afterValue}
												{metric.unit}
											</span>
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				)}

				{/* Summary statistics */}
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm">Podsumowanie zmian</CardTitle>
					</CardHeader>
					<CardContent className="pt-0">
						<div className="grid grid-cols-2 gap-4 text-sm">
							<div>
								<span className="text-gray-500">Średnia poprawa:</span>
								<div className="font-bold text-green-600 text-lg">
									+
									{Math.round(
										metrics.reduce((sum, m) => sum + m.improvement, 0) /
											metrics.length,
									)}
									%
								</div>
							</div>
							<div>
								<span className="text-gray-500">Największa zmiana:</span>
								<div className="font-bold text-blue-600 text-lg">
									{Math.max(...metrics.map((m) => m.improvement)).toFixed(0)}%
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</CardContent>
		</Card>
	);
};

// 3D Scene for before/after comparison
interface BeforeAfterSceneProps {
	metrics: ComparisonState[];
	isPlaying: boolean;
	transitionProgress: number;
	showComparison: boolean;
	selectedMetric: string | null;
}

const BeforeAfterScene: React.FC<BeforeAfterSceneProps> = ({
	metrics,
	isPlaying,
	transitionProgress,
	showComparison,
	selectedMetric,
}) => {
	const groupRef = useRef<Group>(null);

	return (
		<group ref={groupRef}>
			{/* Lighting */}
			<ambientLight intensity={0.6} />
			<pointLight position={[10, 10, 10]} intensity={0.8} />
			<pointLight position={[-10, -10, -10]} intensity={0.4} color="#4444ff" />

			{/* Split view background */}
			<SplitViewBackground
				showComparison={showComparison}
				transitionProgress={transitionProgress}
			/>

			{/* Before state (left side) */}
			<group position={[-2, 0, 0]}>
				<Html position={[0, 2, 0]}>
					<div className="rounded bg-red-500/70 px-2 py-1 text-sm text-white">
						PRZED
					</div>
				</Html>

				{metrics.map((metric) => (
					<MetricVisualization
						key={`before-${metric.id}`}
						metric={metric}
						state="before"
						transitionProgress={transitionProgress}
						isSelected={selectedMetric === metric.id}
					/>
				))}
			</group>

			{/* After state (right side) */}
			<group position={[2, 0, 0]}>
				<Html position={[0, 2, 0]}>
					<div className="rounded bg-green-500/70 px-2 py-1 text-sm text-white">
						PO
					</div>
				</Html>

				{metrics.map((metric) => (
					<MetricVisualization
						key={`after-${metric.id}`}
						metric={metric}
						state="after"
						transitionProgress={transitionProgress}
						isSelected={selectedMetric === metric.id}
					/>
				))}
			</group>

			{/* Comparison indicators */}
			{showComparison && (
				<ComparisonIndicators
					metrics={metrics}
					transitionProgress={transitionProgress}
				/>
			)}
		</group>
	);
};

// Split view background component
interface SplitViewBackgroundProps {
	showComparison: boolean;
	transitionProgress: number;
}

const SplitViewBackground: React.FC<SplitViewBackgroundProps> = ({
	showComparison,
	transitionProgress,
}) => {
	return (
		<group>
			{/* Left side - Before */}
			<mesh position={[-2, 0, -0.5]}>
				<planeGeometry args={[3, 6]} />
				<meshStandardMaterial
					color="#FEE2E2"
					transparent
					opacity={showComparison ? 0.3 : 0.1}
				/>
			</mesh>

			{/* Right side - After */}
			<mesh position={[2, 0, -0.5]}>
				<planeGeometry args={[3, 6]} />
				<meshStandardMaterial
					color="#ECFDF5"
					transparent
					opacity={showComparison ? 0.3 : 0.1}
				/>
			</mesh>

			{/* Transition divider */}
			<mesh position={[transitionProgress * 0.04 - 2, 0, -0.4]}>
				<planeGeometry args={[0.1, 6]} />
				<meshBasicMaterial color="#6B7280" transparent opacity={0.8} />
			</mesh>
		</group>
	);
};

// Metric visualization component
interface MetricVisualizationProps {
	metric: ComparisonState;
	state: "before" | "after";
	transitionProgress: number;
	isSelected: boolean;
}

const MetricVisualization: React.FC<MetricVisualizationProps> = ({
	metric,
	state,
	transitionProgress,
	isSelected,
}) => {
	const value = state === "before" ? metric.beforeValue : metric.afterValue;
	const normalizedValue = value / 100; // Normalize to 0-1 scale

	const { scale, color } = useSpring({
		scale: isSelected ? 1.2 : 1,
		color: state === "before" ? new Color("#EF4444") : new Color("#10B981"),
		config: { tension: 300, friction: 50 },
	});

	return (
		<group position={metric.visualPosition}>
			{/* Metric bar */}
			<animated.mesh scale={scale}>
				<boxGeometry args={[0.3, normalizedValue * 2, 0.3]} />
				<meshStandardMaterial color={color} transparent opacity={0.8} />
			</animated.mesh>

			{/* Value label */}
			<Html position={[0, normalizedValue + 0.3, 0]}>
				<div
					className={`rounded px-1 py-0.5 text-xs ${
						state === "before"
							? "bg-red-500/70 text-white"
							: "bg-green-500/70 text-white"
					}`}
				>
					{value}
					{metric.unit}
				</div>
			</Html>

			{/* Metric name */}
			<Html position={[0, -0.8, 0]}>
				<div className="rounded bg-black/70 px-1 py-0.5 text-white text-xs">
					{metric.polishName}
				</div>
			</Html>

			{/* Improvement indicator */}
			{state === "after" && metric.improvement > 0 && (
				<Html position={[0, normalizedValue + 0.6, 0]}>
					<div className="rounded bg-green-500/70 px-1 py-0.5 text-white text-xs">
						+{metric.improvement.toFixed(0)}%
					</div>
				</Html>
			)}
		</group>
	);
};

// Comparison indicators component
interface ComparisonIndicatorsProps {
	metrics: ComparisonState[];
	transitionProgress: number;
}

const ComparisonIndicators: React.FC<ComparisonIndicatorsProps> = ({
	metrics,
	transitionProgress,
}) => {
	return (
		<group>
			{metrics.map((metric) => {
				const beforePos = metric.visualPosition
					.clone()
					.add(new Vector3(-2, 0, 0));
				const afterPos = metric.visualPosition
					.clone()
					.add(new Vector3(2, 0, 0));

				return (
					<group key={`comparison-${metric.id}`}>
						{/* Comparison arrow */}
						<mesh>
							<bufferGeometry>
								<bufferAttribute
									attach="attributes-position"
									count={2}
									array={
										new Float32Array([
											beforePos.x,
											beforePos.y,
											beforePos.z,
											afterPos.x,
											afterPos.y,
											afterPos.z,
										])
									}
									itemSize={3}
								/>
							</bufferGeometry>
							<lineBasicMaterial color="#6B7280" opacity={0.5} transparent />
						</mesh>

						{/* Improvement highlight */}
						{metric.improvement > 0 && (
							<mesh position={afterPos}>
								<sphereGeometry args={[0.2, 8, 8]} />
								<meshBasicMaterial color="#10B981" transparent opacity={0.3} />
							</mesh>
						)}
					</group>
				);
			})}
		</group>
	);
};

export default BeforeAfterComparisonMode;
