"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { animated, useSpring } from "@react-spring/three";
import { Html, OrbitControls, Text } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import {
	AlertTriangle,
	CheckCircle,
	Info,
	Shield,
	XCircle,
	Zap,
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

interface SafetyAlertSystemProps {
	supplementName: string;
	polishSupplementName: string;
	safetyData: SafetyData;
	currentDosage?: number;
	onSafetyAlert?: (alert: SafetyAlert) => void;
	className?: string;
}

interface SafetyData {
	overallSafety: number; // 1-5 scale
	contraindications: SafetyAlert[];
	warnings: SafetyAlert[];
	precautions: SafetyAlert[];
	interactions: SafetyAlert[];
	sideEffects: SafetyAlert[];
	monitoring: string[];
}

interface SafetyAlert {
	id: string;
	type:
		| "contraindication"
		| "warning"
		| "precaution"
		| "interaction"
		| "side-effect";
	severity: "low" | "medium" | "high" | "critical";
	title: string;
	polishTitle: string;
	description: string;
	polishDescription: string;
	evidence: "strong" | "moderate" | "weak";
	position: Vector3;
	color: Color;
}

const CREATINE_SAFETY_DATA: SafetyData = {
	overallSafety: 5,
	contraindications: [
		{
			id: "kidney-disease",
			type: "contraindication",
			severity: "critical",
			title: "Kidney Disease",
			polishTitle: "Choroba nerek",
			description:
				"Creatine supplementation is contraindicated in patients with kidney disease",
			polishDescription:
				"Suplementacja kreatyną jest przeciwwskazana u pacjentów z chorobami nerek",
			evidence: "strong",
			position: new Vector3(-2, 2, 0),
			color: new Color("#DC2626"),
		},
	],
	warnings: [
		{
			id: "dehydration",
			type: "warning",
			severity: "high",
			title: "Dehydration Risk",
			polishTitle: "Ryzyko odwodnienia",
			description:
				"Creatine may increase risk of dehydration if fluid intake is insufficient",
			polishDescription:
				"Kreatyna może zwiększać ryzyko odwodnienia przy niewystarczającym spożyciu płynów",
			evidence: "moderate",
			position: new Vector3(0, 2, 0),
			color: new Color("#F59E0B"),
		},
	],
	precautions: [
		{
			id: "pregnancy",
			type: "precaution",
			severity: "medium",
			title: "Pregnancy and Lactation",
			polishTitle: "Ciąża i laktacja",
			description:
				"Limited safety data available for pregnant and lactating women",
			polishDescription:
				"Ograniczone dane bezpieczeństwa dla kobiet w ciąży i karmiących piersią",
			evidence: "weak",
			position: new Vector3(2, 2, 0),
			color: new Color("#3B82F6"),
		},
	],
	interactions: [
		{
			id: "caffeine-interaction",
			type: "interaction",
			severity: "medium",
			title: "Caffeine Interaction",
			polishTitle: "Interakcja z kofeiną",
			description: "May reduce creatine effectiveness when taken together",
			polishDescription:
				"Może zmniejszać skuteczność kreatyny przy jednoczesnym stosowaniu",
			evidence: "moderate",
			position: new Vector3(-1, 0, 0),
			color: new Color("#8B5CF6"),
		},
	],
	sideEffects: [
		{
			id: "gastrointestinal",
			type: "side-effect",
			severity: "low",
			title: "Gastrointestinal Discomfort",
			polishTitle: "Dyskomfort żołądkowo-jelitowy",
			description:
				"May cause stomach upset, nausea, or diarrhea in some individuals",
			polishDescription:
				"Może powodować dyskomfort żołądkowy, nudności lub biegunkę u niektórych osób",
			evidence: "moderate",
			position: new Vector3(1, 0, 0),
			color: new Color("#10B981"),
		},
	],
	monitoring: [
		"Monitor kidney function regularly",
		"Ensure adequate hydration",
		"Monitor for gastrointestinal discomfort",
		"Regular blood tests for long-term use",
	],
};

export const SafetyAlertSystem: React.FC<SafetyAlertSystemProps> = ({
	supplementName = "Creatine",
	polishSupplementName = "Kreatyna",
	safetyData = CREATINE_SAFETY_DATA,
	currentDosage = 5,
	onSafetyAlert,
	className = "",
}) => {
	const [selectedAlert, setSelectedAlert] = useState<string | null>(null);
	const [showAllAlerts, setShowAllAlerts] = useState(false);
	const [filterSeverity, setFilterSeverity] = useState<string>("all");

	const allAlerts = useMemo(() => {
		return [
			...safetyData.contraindications,
			...safetyData.warnings,
			...safetyData.precautions,
			...safetyData.interactions,
			...safetyData.sideEffects,
		];
	}, [safetyData]);

	const filteredAlerts = useMemo(() => {
		return allAlerts.filter((alert) => {
			const matchesSeverity =
				filterSeverity === "all" || alert.severity === filterSeverity;
			return matchesSeverity;
		});
	}, [allAlerts, filterSeverity]);

	const safetyStats = useMemo(() => {
		const critical = allAlerts.filter((a) => a.severity === "critical").length;
		const high = allAlerts.filter((a) => a.severity === "high").length;
		const medium = allAlerts.filter((a) => a.severity === "medium").length;
		const low = allAlerts.filter((a) => a.severity === "low").length;

		return { critical, high, medium, low };
	}, [allAlerts]);

	return (
		<Card className={`w-full ${className}`}>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Shield className="h-5 w-5" />
					System ostrzeżeń bezpieczeństwa
				</CardTitle>
				<div className="space-y-1">
					<p className="font-medium text-sm">
						{polishSupplementName} - analiza bezpieczeństwa
					</p>
					<div className="flex items-center gap-2">
						<Badge variant="outline">
							Bezpieczeństwo: {safetyData.overallSafety}/5
						</Badge>
						<Badge
							variant={
								safetyStats.critical > 0
									? "destructive"
									: safetyStats.high > 0
										? "secondary"
										: "default"
							}
						>
							{safetyStats.critical > 0
								? "Wymaga uwagi"
								: safetyStats.high > 0
									? "Ogólne ostrzeżenia"
									: "Bezpieczny"}
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
						<SafetyAlertScene
							alerts={filteredAlerts}
							selectedAlert={selectedAlert}
							onAlertSelect={(alert) => {
								setSelectedAlert(alert.id);
								onSafetyAlert?.(alert);
							}}
						/>
						<OrbitControls
							enablePan={true}
							enableZoom={true}
							enableRotate={true}
						/>
					</Canvas>
				</div>

				{/* Safety score */}
				<Card
					className={`${
						safetyData.overallSafety >= 4
							? "bg-green-50"
							: safetyData.overallSafety >= 3
								? "bg-yellow-50"
								: "bg-red-50"
					}`}
				>
					<CardContent className="p-4">
						<div className="flex items-center gap-3">
							<div
								className={`flex h-12 w-12 items-center justify-center rounded-full ${
									safetyData.overallSafety >= 4
										? "bg-green-100"
										: safetyData.overallSafety >= 3
											? "bg-yellow-100"
											: "bg-red-100"
								}`}
							>
								<span
									className={`font-bold text-xl ${
										safetyData.overallSafety >= 4
											? "text-green-600"
											: safetyData.overallSafety >= 3
												? "text-yellow-600"
												: "text-red-600"
									}`}
								>
									{safetyData.overallSafety}
								</span>
							</div>
							<div>
								<div
									className={`font-medium ${
										safetyData.overallSafety >= 4
											? "text-green-800"
											: safetyData.overallSafety >= 3
												? "text-yellow-800"
												: "text-red-800"
									}`}
								>
									{safetyData.overallSafety >= 4
										? "Bardzo bezpieczny"
										: safetyData.overallSafety >= 3
											? "Ogólnie bezpieczny"
											: "Wymaga ostrożności"}
								</div>
								<div
									className={`text-sm ${
										safetyData.overallSafety >= 4
											? "text-green-600"
											: safetyData.overallSafety >= 3
												? "text-yellow-600"
												: "text-red-600"
									}`}
								>
									Ocena bezpieczeństwa: {safetyData.overallSafety}/5
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Filter controls */}
				<div className="flex items-center gap-4">
					<label className="flex items-center gap-2">
						<input
							type="checkbox"
							checked={showAllAlerts}
							onChange={(e) => setShowAllAlerts(e.target.checked)}
							className="rounded"
						/>
						<span className="text-sm">Pokaż wszystkie ostrzeżenia</span>
					</label>

					<label className="text-sm">
						Filtruj według poziomu:
						<select
							value={filterSeverity}
							onChange={(e) => setFilterSeverity(e.target.value)}
							className="ml-2 rounded border px-2 py-1"
						>
							<option value="all">Wszystkie poziomy</option>
							<option value="critical">Krytyczny</option>
							<option value="high">Wysoki</option>
							<option value="medium">Średni</option>
							<option value="low">Niski</option>
						</select>
					</label>
				</div>

				{/* Alert categories */}
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					{/* Contraindications */}
					{safetyData.contraindications.length > 0 && (
						<Card>
							<CardHeader className="pb-2">
								<CardTitle className="flex items-center gap-2 text-red-600 text-sm">
									<XCircle className="h-4 w-4" />
									Przeciwwskazania ({safetyData.contraindications.length})
								</CardTitle>
							</CardHeader>
							<CardContent className="pt-0">
								<div className="space-y-2">
									{safetyData.contraindications.map((alert) => (
										<Alert
											key={alert.id}
											variant="destructive"
											className="text-xs"
										>
											<XCircle className="h-3 w-3" />
											<AlertDescription>
												<div className="font-medium">{alert.polishTitle}</div>
												<div>{alert.polishDescription}</div>
											</AlertDescription>
										</Alert>
									))}
								</div>
							</CardContent>
						</Card>
					)}

					{/* Warnings */}
					{safetyData.warnings.length > 0 && (
						<Card>
							<CardHeader className="pb-2">
								<CardTitle className="flex items-center gap-2 text-orange-600 text-sm">
									<AlertTriangle className="h-4 w-4" />
									Ostrzeżenia ({safetyData.warnings.length})
								</CardTitle>
							</CardHeader>
							<CardContent className="pt-0">
								<div className="space-y-2">
									{safetyData.warnings.map((alert) => (
										<Alert key={alert.id} className="text-xs">
											<AlertTriangle className="h-3 w-3" />
											<AlertDescription>
												<div className="font-medium">{alert.polishTitle}</div>
												<div>{alert.polishDescription}</div>
											</AlertDescription>
										</Alert>
									))}
								</div>
							</CardContent>
						</Card>
					)}

					{/* Precautions */}
					{safetyData.precautions.length > 0 && (
						<Card>
							<CardHeader className="pb-2">
								<CardTitle className="flex items-center gap-2 text-blue-600 text-sm">
									<Info className="h-4 w-4" />
									Środki ostrożności ({safetyData.precautions.length})
								</CardTitle>
							</CardHeader>
							<CardContent className="pt-0">
								<div className="space-y-2">
									{safetyData.precautions.map((alert) => (
										<Alert key={alert.id} variant="default" className="text-xs">
											<Info className="h-3 w-3" />
											<AlertDescription>
												<div className="font-medium">{alert.polishTitle}</div>
												<div>{alert.polishDescription}</div>
											</AlertDescription>
										</Alert>
									))}
								</div>
							</CardContent>
						</Card>
					)}

					{/* Side Effects */}
					{safetyData.sideEffects.length > 0 && (
						<Card>
							<CardHeader className="pb-2">
								<CardTitle className="flex items-center gap-2 text-purple-600 text-sm">
									<Zap className="h-4 w-4" />
									Efekty uboczne ({safetyData.sideEffects.length})
								</CardTitle>
							</CardHeader>
							<CardContent className="pt-0">
								<div className="space-y-2">
									{safetyData.sideEffects.map((alert) => (
										<Alert
											key={alert.id}
											variant="secondary"
											className="text-xs"
										>
											<Zap className="h-3 w-3" />
											<AlertDescription>
												<div className="font-medium">{alert.polishTitle}</div>
												<div>{alert.polishDescription}</div>
											</AlertDescription>
										</Alert>
									))}
								</div>
							</CardContent>
						</Card>
					)}
				</div>

				{/* Monitoring recommendations */}
				{safetyData.monitoring.length > 0 && (
					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm">Zalecenia monitorowania</CardTitle>
						</CardHeader>
						<CardContent className="pt-0">
							<div className="space-y-2">
								{safetyData.monitoring.map((recommendation, index) => (
									<div key={index} className="flex items-center gap-2">
										<CheckCircle className="h-4 w-4 text-green-500" />
										<span className="text-sm">{recommendation}</span>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				)}

				{/* Safety summary */}
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm">
							Podsumowanie bezpieczeństwa
						</CardTitle>
					</CardHeader>
					<CardContent className="pt-0">
						<div className="grid grid-cols-4 gap-4 text-sm">
							<div className="text-center">
								<div className="font-bold text-2xl text-red-500">
									{safetyStats.critical}
								</div>
								<div className="text-gray-500 text-xs">Krytyczne</div>
							</div>
							<div className="text-center">
								<div className="font-bold text-2xl text-orange-500">
									{safetyStats.high}
								</div>
								<div className="text-gray-500 text-xs">Wysokie</div>
							</div>
							<div className="text-center">
								<div className="font-bold text-2xl text-blue-500">
									{safetyStats.medium}
								</div>
								<div className="text-gray-500 text-xs">Średnie</div>
							</div>
							<div className="text-center">
								<div className="font-bold text-2xl text-green-500">
									{safetyStats.low}
								</div>
								<div className="text-gray-500 text-xs">Niskie</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</CardContent>
		</Card>
	);
};

// 3D Scene for safety alerts
interface SafetyAlertSceneProps {
	alerts: SafetyAlert[];
	selectedAlert: string | null;
	onAlertSelect: (alert: SafetyAlert) => void;
}

const SafetyAlertScene: React.FC<SafetyAlertSceneProps> = ({
	alerts,
	selectedAlert,
	onAlertSelect,
}) => {
	const groupRef = useRef<Group>(null);

	return (
		<group ref={groupRef}>
			{/* Lighting */}
			<ambientLight intensity={0.6} />
			<pointLight position={[10, 10, 10]} intensity={0.8} />
			<pointLight position={[-10, -10, -10]} intensity={0.4} color="#4444ff" />

			{/* Safety alerts */}
			{alerts.map((alert) => (
				<SafetyAlertNode
					key={alert.id}
					alert={alert}
					isSelected={selectedAlert === alert.id}
					onSelect={() => onAlertSelect(alert)}
				/>
			))}

			{/* Safety zones */}
			<SafetyZones alerts={alerts} />

			{/* Central safety indicator */}
			<CentralSafetyIndicator alerts={alerts} />
		</group>
	);
};

// Safety alert node component
interface SafetyAlertNodeProps {
	alert: SafetyAlert;
	isSelected: boolean;
	onSelect: () => void;
}

const SafetyAlertNode: React.FC<SafetyAlertNodeProps> = ({
	alert,
	isSelected,
	onSelect,
}) => {
	const meshRef = useRef<Mesh>(null);

	const { scale, color } = useSpring({
		scale: isSelected ? 1.5 : 1,
		color:
			alert.severity === "critical"
				? new Color("#DC2626")
				: alert.severity === "high"
					? new Color("#F59E0B")
					: alert.severity === "medium"
						? new Color("#3B82F6")
						: new Color("#10B981"),
		config: { tension: 300, friction: 50 },
	});

	useFrame(() => {
		if (meshRef.current) {
			meshRef.current.position.copy(alert.position);
		}
	});

	return (
		<group>
			<animated.mesh ref={meshRef} scale={scale} onClick={onSelect}>
				<sphereGeometry args={[0.3, 16, 16]} />
				<meshStandardMaterial
					color={color}
					emissive={isSelected ? color.getHex() : 0x000000}
					emissiveIntensity={isSelected ? 0.4 : 0}
				/>
			</animated.mesh>

			{/* Pulsing warning indicator */}
			{alert.severity === "critical" && (
				<mesh position={alert.position}>
					<sphereGeometry args={[0.6, 12, 12]} />
					<meshBasicMaterial color="#DC2626" transparent opacity={0.3} />
				</mesh>
			)}

			{/* Alert type indicator */}
			<mesh
				position={[alert.position.x, alert.position.y - 0.4, alert.position.z]}
			>
				<cylinderGeometry args={[0.05, 0.05, 0.1, 8]} />
				<meshBasicMaterial
					color={
						alert.type === "contraindication"
							? "#DC2626"
							: alert.type === "warning"
								? "#F59E0B"
								: alert.type === "precaution"
									? "#3B82F6"
									: alert.type === "interaction"
										? "#8B5CF6"
										: "#10B981"
					}
				/>
			</mesh>

			{/* Alert label */}
			<Html
				position={[alert.position.x, alert.position.y + 0.5, alert.position.z]}
			>
				<div
					className={`cursor-pointer rounded px-1 py-0.5 text-xs ${
						isSelected ? "bg-blue-500 text-white" : "bg-black/70 text-white"
					}`}
					onClick={onSelect}
				>
					{alert.polishTitle}
				</div>
			</Html>

			{/* Severity badge */}
			<Html
				position={[alert.position.x, alert.position.y - 0.6, alert.position.z]}
			>
				<Badge
					variant={
						alert.severity === "critical"
							? "destructive"
							: alert.severity === "high"
								? "secondary"
								: "outline"
					}
				>
					{alert.severity === "critical"
						? "Krytyczny"
						: alert.severity === "high"
							? "Wysoki"
							: alert.severity === "medium"
								? "Średni"
								: "Niski"}
				</Badge>
			</Html>
		</group>
	);
};

// Safety zones component
interface SafetyZonesProps {
	alerts: SafetyAlert[];
}

const SafetyZones: React.FC<SafetyZonesProps> = ({ alerts }) => {
	return (
		<group>
			{alerts
				.filter((alert) => alert.severity === "critical")
				.map((alert) => (
					<mesh key={`danger-zone-${alert.id}`} position={alert.position}>
						<sphereGeometry args={[1.5, 16, 16]} />
						<meshBasicMaterial color="#DC2626" transparent opacity={0.1} />
					</mesh>
				))}
		</group>
	);
};

// Central safety indicator component
interface CentralSafetyIndicatorProps {
	alerts: SafetyAlert[];
}

const CentralSafetyIndicator: React.FC<CentralSafetyIndicatorProps> = ({
	alerts,
}) => {
	const criticalAlerts = alerts.filter((a) => a.severity === "critical").length;
	const highAlerts = alerts.filter((a) => a.severity === "high").length;

	const safetyColor =
		criticalAlerts > 0 ? "#DC2626" : highAlerts > 0 ? "#F59E0B" : "#10B981";

	return (
		<group position={[0, 0, 0]}>
			{/* Central safety sphere */}
			<mesh>
				<sphereGeometry args={[0.5, 16, 16]} />
				<meshStandardMaterial color={safetyColor} transparent opacity={0.8} />
			</mesh>

			{/* Safety level indicator */}
			<Html position={[0, 0.8, 0]}>
				<div className="rounded bg-black/70 px-2 py-1 text-sm text-white">
					Poziom bezpieczeństwa
				</div>
			</Html>

			{/* Alert count */}
			<Html position={[0, -0.8, 0]}>
				<div className="rounded bg-black/70 px-1 py-0.5 text-white text-xs">
					{criticalAlerts + highAlerts} ostrzeżeń
				</div>
			</Html>
		</group>
	);
};

export default SafetyAlertSystem;
