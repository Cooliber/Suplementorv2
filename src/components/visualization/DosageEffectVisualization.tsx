"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
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
	Droplets,
	Minus,
	TrendingDown,
	TrendingUp,
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

interface DosageEffectVisualizationProps {
	supplementName: string;
	polishSupplementName: string;
	dosageRange: { min: number; max: number; unit: string; recommended: number };
	effectCurves: EffectCurve[];
	currentDosage: number;
	onDosageChange?: (dosage: number) => void;
	className?: string;
}

interface EffectCurve {
	id: string;
	name: string;
	polishName: string;
	curveType: "linear" | "bell" | "sigmoid" | "threshold";
	optimalRange: { min: number; max: number };
	color: Color;
	maxEffect: number; // 0-1
}

interface ConcentrationGradient {
	position: Vector3;
	concentration: number;
	radius: number;
	color: Color;
}

const CREATINE_EFFECT_CURVES: EffectCurve[] = [
	{
		id: "muscle-strength",
		name: "Siła mięśni",
		polishName: "Siła mięśni",
		curveType: "bell",
		optimalRange: { min: 3, max: 5 },
		color: new Color("#F59E0B"),
		maxEffect: 0.9,
	},
	{
		id: "endurance",
		name: "Wydolność",
		polishName: "Wydolność",
		curveType: "sigmoid",
		optimalRange: { min: 2, max: 4 },
		color: new Color("#EF4444"),
		maxEffect: 0.8,
	},
	{
		id: "recovery",
		name: "Regeneracja",
		polishName: "Regeneracja",
		curveType: "linear",
		optimalRange: { min: 1, max: 6 },
		color: new Color("#10B981"),
		maxEffect: 0.7,
	},
];

export const DosageEffectVisualization: React.FC<
	DosageEffectVisualizationProps
> = ({
	supplementName,
	polishSupplementName,
	dosageRange,
	effectCurves = CREATINE_EFFECT_CURVES,
	currentDosage,
	onDosageChange,
	className = "",
}) => {
	const [selectedCurve, setSelectedCurve] = useState<string | null>(null);
	const [showGradients, setShowGradients] = useState(true);

	const concentrationGradients = useMemo(() => {
		return effectCurves.map((curve, index) => {
			const effectAtDosage = calculateEffectAtDosage(currentDosage, curve);
			const angle = (index / effectCurves.length) * Math.PI * 2;
			const radius = 2 + effectAtDosage * 1.5;

			return {
				position: new Vector3(
					Math.cos(angle) * radius,
					Math.sin(angle) * radius,
					0,
				),
				concentration: effectAtDosage,
				radius: effectAtDosage * 0.8,
				color: curve.color,
			};
		});
	}, [currentDosage, effectCurves]);

	return (
		<Card className={`w-full ${className}`}>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<TrendingUp className="h-5 w-5" />
					Wizualizacja efektów dawki
				</CardTitle>
				<div className="space-y-1">
					<p className="font-medium text-sm">
						{polishSupplementName} - zależność dawka-efekt
					</p>
					<div className="flex items-center gap-2">
						<Badge variant="outline">
							Dawka: {currentDosage} {dosageRange.unit}
						</Badge>
						<Badge variant="secondary">
							Zakres: {dosageRange.min}-{dosageRange.max} {dosageRange.unit}
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
						<DosageEffectScene
							effectCurves={effectCurves}
							currentDosage={currentDosage}
							concentrationGradients={concentrationGradients}
							showGradients={showGradients}
							selectedCurve={selectedCurve}
						/>
						<OrbitControls
							enablePan={true}
							enableZoom={true}
							enableRotate={true}
						/>
					</Canvas>

					{/* Dosage overlay */}
					<div className="absolute top-4 left-4 rounded bg-black/70 p-2 text-sm text-white">
						<div className="space-y-1">
							<div>
								Dawka: {currentDosage} {dosageRange.unit}
							</div>
							<div>
								Efektywność:{" "}
								{Math.round(
									calculateAverageEffect(currentDosage, effectCurves) * 100,
								)}
								%
							</div>
						</div>
					</div>
				</div>

				{/* Dosage control */}
				<div className="space-y-2">
					<div className="flex items-center justify-between">
						<span className="font-medium text-sm">Dawka</span>
						<Badge variant="outline">
							{currentDosage} {dosageRange.unit}
						</Badge>
					</div>
					<Slider
						value={[currentDosage]}
						onValueChange={([value]) => onDosageChange?.(value || 0)}
						min={dosageRange.min}
						max={dosageRange.max}
						step={0.5}
						className="w-full"
					/>
					<div className="flex justify-between text-gray-500 text-xs">
						<span>
							{dosageRange.min} {dosageRange.unit}
						</span>
						<span>
							Zalecane: {dosageRange.recommended} {dosageRange.unit}
						</span>
						<span>
							{dosageRange.max} {dosageRange.unit}
						</span>
					</div>
				</div>

				{/* Effect curves */}
				<div className="space-y-3">
					<div className="flex items-center gap-2">
						<Activity className="h-4 w-4" />
						<span className="font-medium text-sm">Krzywe efektów</span>
					</div>

					{effectCurves.map((curve) => {
						const effectAtDosage = calculateEffectAtDosage(
							currentDosage,
							curve,
						);
						const isOptimal =
							currentDosage >= curve.optimalRange.min &&
							currentDosage <= curve.optimalRange.max;

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
										<Badge variant={isOptimal ? "default" : "outline"}>
											{isOptimal ? "Optymalne" : "Poza zakresem"}
										</Badge>
										<span className="font-mono text-sm">
											{Math.round(effectAtDosage * 100)}%
										</span>
									</div>
								</div>

								{/* Effect curve visualization */}
								<div className="mt-2">
									<div className="relative h-2 rounded bg-gray-200">
										<div
											className="h-full rounded transition-all duration-300"
											style={{
												width: `${effectAtDosage * 100}%`,
												backgroundColor: curve.color.getHexString(),
											}}
										/>
										{/* Optimal range indicator */}
										<div
											className="absolute top-0 h-full bg-green-300 opacity-50"
											style={{
												left: `${(curve.optimalRange.min / dosageRange.max) * 100}%`,
												width: `${((curve.optimalRange.max - curve.optimalRange.min) / dosageRange.max) * 100}%`,
											}}
										/>
									</div>
								</div>

								{/* Optimal range */}
								<div className="mt-1 flex justify-between text-gray-500 text-xs">
									<span>Zakres optymalny:</span>
									<span>
										{curve.optimalRange.min}-{curve.optimalRange.max}{" "}
										{dosageRange.unit}
									</span>
								</div>
							</Card>
						);
					})}
				</div>

				{/* Concentration gradients toggle */}
				<label className="flex items-center gap-2">
					<input
						type="checkbox"
						checked={showGradients}
						onChange={(e) => setShowGradients(e.target.checked)}
						className="rounded"
					/>
					<span className="text-sm">Pokaż gradienty stężenia</span>
				</label>

				{/* Dosage recommendations */}
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm">Zalecenia dawkowania</CardTitle>
					</CardHeader>
					<CardContent className="pt-0">
						<div className="space-y-2 text-xs">
							<div className="flex items-center gap-2">
								<div className="h-2 w-2 rounded-full bg-green-500" />
								<span>
									Zakres terapeutyczny: {dosageRange.min}-{dosageRange.max}{" "}
									{dosageRange.unit}
								</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="h-2 w-2 rounded-full bg-blue-500" />
								<span>
									Dawka zalecana: {dosageRange.recommended} {dosageRange.unit}
								</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="h-2 w-2 rounded-full bg-orange-500" />
								<span>
									Dawka aktualna: {currentDosage} {dosageRange.unit}
								</span>
							</div>
						</div>
					</CardContent>
				</Card>
			</CardContent>
		</Card>
	);
};

// 3D Scene for dosage effects
interface DosageEffectSceneProps {
	effectCurves: EffectCurve[];
	currentDosage: number;
	concentrationGradients: ConcentrationGradient[];
	showGradients: boolean;
	selectedCurve: string | null;
}

const DosageEffectScene: React.FC<DosageEffectSceneProps> = ({
	effectCurves,
	currentDosage,
	concentrationGradients,
	showGradients,
	selectedCurve,
}) => {
	const groupRef = useRef<Group>(null);

	return (
		<group ref={groupRef}>
			{/* Lighting */}
			<ambientLight intensity={0.6} />
			<pointLight position={[10, 10, 10]} intensity={0.8} />
			<pointLight position={[-10, -10, -10]} intensity={0.4} color="#4444ff" />

			{/* Central dosage point */}
			<CentralDosagePoint currentDosage={currentDosage} />

			{/* Effect curves */}
			{effectCurves.map((curve) => (
				<EffectCurveVisualization
					key={curve.id}
					curve={curve}
					currentDosage={currentDosage}
					isSelected={selectedCurve === curve.id}
				/>
			))}

			{/* Concentration gradients */}
			{showGradients &&
				concentrationGradients.map((gradient, index) => (
					<ConcentrationGradientVisualization key={index} gradient={gradient} />
				))}

			{/* Dosage axis */}
			<DosageAxis maxDosage={10} />
		</group>
	);
};

// Central dosage point component
interface CentralDosagePointProps {
	currentDosage: number;
}

const CentralDosagePoint: React.FC<CentralDosagePointProps> = ({
	currentDosage,
}) => {
	const meshRef = useRef<Mesh>(null);

	const { scale } = useSpring({
		scale: 0.5 + (currentDosage / 10) * 0.5,
		config: { tension: 300, friction: 50 },
	});

	return (
		<group>
			<animated.mesh ref={meshRef} scale={scale}>
				<sphereGeometry args={[0.2, 16, 16]} />
				<meshStandardMaterial
					color="#F59E0B"
					emissive="#F59E0B"
					emissiveIntensity={0.3}
				/>
			</animated.mesh>

			{/* Dosage label */}
			<Html position={[0, 0.5, 0]}>
				<div className="rounded bg-black/70 px-2 py-1 text-sm text-white">
					Dawka: {currentDosage}g
				</div>
			</Html>
		</group>
	);
};

// Effect curve visualization component
interface EffectCurveVisualizationProps {
	curve: EffectCurve;
	currentDosage: number;
	isSelected: boolean;
}

const EffectCurveVisualization: React.FC<EffectCurveVisualizationProps> = ({
	curve,
	currentDosage,
	isSelected,
}) => {
	const points = useMemo(() => {
		const curvePoints: Vector3[] = [];

		for (let dosage = 0; dosage <= 10; dosage += 0.5) {
			const effect = calculateEffectAtDosage(dosage, curve);
			const angle = (dosage / 10) * Math.PI * 2;
			const radius = 2 + effect * 2;

			curvePoints.push(
				new Vector3(
					Math.cos(angle) * radius,
					Math.sin(angle) * radius,
					effect * 2,
				),
			);
		}

		return curvePoints;
	}, [curve, currentDosage]);

	return (
		<group>
			{/* Curve line */}
			{points.map((point, index) => {
				if (index === 0) return null;

				const prevPoint = points[index - 1];
				const isCurrentDosage = index === Math.floor(currentDosage * 2);

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
								opacity={isSelected ? 1 : 0.6}
								transparent
							/>
						</mesh>

						{/* Current dosage indicator */}
						{isCurrentDosage && (
							<mesh position={point}>
								<sphereGeometry args={[0.08, 8, 8]} />
								<meshBasicMaterial
									color={curve.color}
									emissive={curve.color.getHex()}
									emissiveIntensity={0.5}
								/>
							</mesh>
						)}
					</group>
				);
			})}

			{/* Curve label */}
			<Html
				position={[
					points[points.length - 1].x,
					points[points.length - 1].y,
					points[points.length - 1].z,
				]}
			>
				<div className="rounded bg-black/70 px-1 py-0.5 text-white text-xs">
					{curve.polishName}
				</div>
			</Html>
		</group>
	);
};

// Concentration gradient visualization component
interface ConcentrationGradientVisualizationProps {
	gradient: ConcentrationGradient;
}

const ConcentrationGradientVisualization: React.FC<
	ConcentrationGradientVisualizationProps
> = ({ gradient }) => {
	return (
		<group position={gradient.position}>
			<mesh>
				<sphereGeometry args={[gradient.radius, 16, 16]} />
				<meshBasicMaterial
					color={gradient.color}
					transparent
					opacity={gradient.concentration * 0.3}
				/>
			</mesh>

			{/* Concentration label */}
			<Html position={[0, gradient.radius + 0.2, 0]}>
				<div className="rounded bg-black/70 px-1 py-0.5 text-white text-xs">
					{Math.round(gradient.concentration * 100)}%
				</div>
			</Html>
		</group>
	);
};

// Dosage axis component
interface DosageAxisProps {
	maxDosage: number;
}

const DosageAxis: React.FC<DosageAxisProps> = ({ maxDosage }) => {
	return (
		<group>
			{/* Axis line */}
			<mesh>
				<bufferGeometry>
					<bufferAttribute
						attach="attributes-position"
						count={2}
						array={new Float32Array([-4, -3, 0, 4, -3, 0])}
						itemSize={3}
					/>
				</bufferGeometry>
				<lineBasicMaterial color="#6B7280" />
			</mesh>

			{/* Dosage markers */}
			{Array.from({ length: maxDosage + 1 }).map((_, i) => {
				const x = -4 + (i / maxDosage) * 8;

				return (
					<group key={i}>
						{/* Tick mark */}
						<mesh position={[x, -3, 0]}>
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

						{/* Dosage label */}
						<Html position={[x, -3.5, 0]}>
							<div className="rounded bg-black/70 px-1 py-0.5 text-white text-xs">
								{i}g
							</div>
						</Html>
					</group>
				);
			})}

			{/* Axis label */}
			<Html position={[0, -4, 0]}>
				<div className="rounded bg-black/70 px-2 py-1 text-sm text-white">
					Dawka (g)
				</div>
			</Html>
		</group>
	);
};

// Utility function to calculate effect at specific dosage
function calculateEffectAtDosage(dosage: number, curve: EffectCurve): number {
	const { min, max } = curve.optimalRange;
	const optimalMid = (min + max) / 2;

	switch (curve.curveType) {
		case "linear":
			return Math.min(1, Math.max(0, dosage / max));

		case "bell": {
			// Bell curve centered on optimal range
			const distanceFromOptimal = Math.abs(dosage - optimalMid);
			const width = (max - min) / 2;
			return (
				Math.exp(
					-(distanceFromOptimal * distanceFromOptimal) / (2 * width * width),
				) * curve.maxEffect
			);
		}

		case "sigmoid": {
			// Sigmoid curve
			const steepness = 2 / (max - min);
			const midpoint = optimalMid;
			return curve.maxEffect / (1 + Math.exp(-steepness * (dosage - midpoint)));
		}

		case "threshold":
			return dosage >= min ? curve.maxEffect : 0;

		default:
			return 0;
	}
}

// Utility function to calculate average effect across all curves
function calculateAverageEffect(dosage: number, curves: EffectCurve[]): number {
	const effects = curves.map((curve) => calculateEffectAtDosage(dosage, curve));
	return effects.reduce((sum, effect) => sum + effect, 0) / effects.length;
}

export default DosageEffectVisualization;
