"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { animated, useSpring } from "@react-spring/three";
import { Html, OrbitControls, Text } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import {
	AlertTriangle,
	CheckCircle,
	Info,
	Shield,
	XCircle,
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

interface InteractionWarningsSystemProps {
	supplementInteractions: SupplementInteraction[];
	selectedSupplements: string[];
	onInteractionSelect?: (interaction: SupplementInteraction) => void;
	className?: string;
}

interface SupplementInteraction {
	id: string;
	supplement1: {
		id: string;
		name: string;
		polishName: string;
		color: Color;
	};
	supplement2: {
		id: string;
		name: string;
		polishName: string;
		color: Color;
	};
	severity: "low" | "medium" | "high";
	type: "synergistic" | "antagonistic" | "contraindicated" | "precaution";
	description: string;
	polishDescription: string;
	evidence: "strong" | "moderate" | "weak";
	position: Vector3;
}

const SAMPLE_INTERACTIONS: SupplementInteraction[] = [
	{
		id: "creatine-caffeine",
		supplement1: {
			id: "creatine",
			name: "Creatine",
			polishName: "Kreatyna",
			color: new Color("#F59E0B"),
		},
		supplement2: {
			id: "caffeine",
			name: "Caffeine",
			polishName: "Kofeina",
			color: new Color("#8B5CF6"),
		},
		severity: "medium",
		type: "antagonistic",
		description: "May reduce creatine effectiveness",
		polishDescription: "Może zmniejszać skuteczność kreatyny",
		evidence: "moderate",
		position: new Vector3(-1, 1, 0),
	},
	{
		id: "coq10-warfarin",
		supplement1: {
			id: "coenzyme-q10",
			name: "Coenzyme Q10",
			polishName: "Koenzym Q10",
			color: new Color("#EF4444"),
		},
		supplement2: {
			id: "warfarin",
			name: "Warfarin",
			polishName: "Warfaryna",
			color: new Color("#DC2626"),
		},
		severity: "high",
		type: "contraindicated",
		description: "May interact with blood thinners",
		polishDescription: "Może interagować z lekami przeciwzakrzepowymi",
		evidence: "strong",
		position: new Vector3(1, 1, 0),
	},
	{
		id: "l-theanine-magnesium",
		supplement1: {
			id: "l-theanine",
			name: "L-Theanine",
			polishName: "L-Teanina",
			color: new Color("#10B981"),
		},
		supplement2: {
			id: "magnesium",
			name: "Magnesium",
			polishName: "Magnez",
			color: new Color("#06B6D4"),
		},
		severity: "low",
		type: "synergistic",
		description: "May enhance relaxation effects",
		polishDescription: "Może wzmacniać efekty relaksacyjne",
		evidence: "moderate",
		position: new Vector3(0, -1, 0),
	},
];

export const InteractionWarningsSystem: React.FC<
	InteractionWarningsSystemProps
> = ({
	supplementInteractions = SAMPLE_INTERACTIONS,
	selectedSupplements,
	onInteractionSelect,
	className = "",
}) => {
	const [selectedInteraction, setSelectedInteraction] = useState<string | null>(
		null,
	);
	const [showAllInteractions, setShowAllInteractions] = useState(false);
	const [filterSeverity, setFilterSeverity] = useState<string>("all");

	const filteredInteractions = useMemo(() => {
		return supplementInteractions.filter((interaction) => {
			const hasSelectedSupplements =
				selectedSupplements.length === 0 ||
				selectedSupplements.includes(interaction.supplement1.id) ||
				selectedSupplements.includes(interaction.supplement2.id);

			const matchesSeverity =
				filterSeverity === "all" || interaction.severity === filterSeverity;

			return (showAllInteractions || hasSelectedSupplements) && matchesSeverity;
		});
	}, [
		supplementInteractions,
		selectedSupplements,
		showAllInteractions,
		filterSeverity,
	]);

	const interactionStats = useMemo(() => {
		const total = filteredInteractions.length;
		const high = filteredInteractions.filter(
			(i) => i.severity === "high",
		).length;
		const medium = filteredInteractions.filter(
			(i) => i.severity === "medium",
		).length;
		const low = filteredInteractions.filter((i) => i.severity === "low").length;

		return { total, high, medium, low };
	}, [filteredInteractions]);

	return (
		<Card className={`w-full ${className}`}>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<AlertTriangle className="h-5 w-5" />
					System ostrzeżeń o interakcjach
				</CardTitle>
				<div className="flex items-center gap-2">
					<Badge variant="outline">{interactionStats.total} interakcji</Badge>
					{interactionStats.high > 0 && (
						<Badge variant="destructive">
							{interactionStats.high} wysokich
						</Badge>
					)}
					{interactionStats.medium > 0 && (
						<Badge variant="secondary">
							{interactionStats.medium} średnich
						</Badge>
					)}
				</div>
			</CardHeader>
			<CardContent className="space-y-4">
				<div
					className="relative overflow-hidden rounded-lg bg-gray-900"
					style={{ height: "400px" }}
				>
					<Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
						<InteractionWarningsScene
							interactions={filteredInteractions}
							selectedInteraction={selectedInteraction}
							onInteractionSelect={(interaction) => {
								setSelectedInteraction(interaction.id);
								onInteractionSelect?.(interaction);
							}}
						/>
						<OrbitControls
							enablePan={true}
							enableZoom={true}
							enableRotate={true}
						/>
					</Canvas>
				</div>

				{/* Filter controls */}
				<div className="flex items-center gap-4">
					<label className="flex items-center gap-2">
						<input
							type="checkbox"
							checked={showAllInteractions}
							onChange={(e) => setShowAllInteractions(e.target.checked)}
							className="rounded"
						/>
						<span className="text-sm">Pokaż wszystkie interakcje</span>
					</label>

					<label className="text-sm">
						Filtruj według poziomu:
						<select
							value={filterSeverity}
							onChange={(e) => setFilterSeverity(e.target.value)}
							className="ml-2 rounded border px-2 py-1"
						>
							<option value="all">Wszystkie poziomy</option>
							<option value="high">Wysoka</option>
							<option value="medium">Średnia</option>
							<option value="low">Niska</option>
						</select>
					</label>
				</div>

				{/* Interaction alerts */}
				<div className="space-y-2">
					{filteredInteractions.map((interaction) => (
						<Alert
							key={interaction.id}
							className={`cursor-pointer transition-colors ${
								selectedInteraction === interaction.id
									? "ring-2 ring-blue-500"
									: ""
							}`}
							variant={
								interaction.severity === "high"
									? "destructive"
									: interaction.severity === "medium"
										? "default"
										: "secondary"
							}
							onClick={() => {
								setSelectedInteraction(
									selectedInteraction === interaction.id
										? null
										: interaction.id,
								);
								onInteractionSelect?.(interaction);
							}}
						>
							<div className="flex items-center gap-2">
								{interaction.severity === "high" && (
									<XCircle className="h-4 w-4" />
								)}
								{interaction.severity === "medium" && (
									<AlertTriangle className="h-4 w-4" />
								)}
								{interaction.severity === "low" && <Info className="h-4 w-4" />}
								<div className="flex-1">
									<div className="font-medium">
										{interaction.supplement1.polishName} +{" "}
										{interaction.supplement2.polishName}
									</div>
									<div className="text-sm">{interaction.polishDescription}</div>
								</div>
								<div className="flex items-center gap-2">
									<Badge
										variant={
											interaction.type === "contraindicated"
												? "destructive"
												: interaction.type === "antagonistic"
													? "secondary"
													: "outline"
										}
									>
										{interaction.type === "synergistic"
											? "Synergia"
											: interaction.type === "antagonistic"
												? "Antagonizm"
												: interaction.type === "contraindicated"
													? "Przeciwwskazanie"
													: "Ostrożność"}
									</Badge>
									<Badge
										variant={
											interaction.evidence === "strong"
												? "default"
												: interaction.evidence === "moderate"
													? "secondary"
													: "outline"
										}
									>
										{interaction.evidence === "strong"
											? "Silne"
											: interaction.evidence === "moderate"
												? "Umiarkowane"
												: "Słabe"}{" "}
										dowody
									</Badge>
								</div>
							</div>
						</Alert>
					))}
				</div>

				{/* No interactions message */}
				{filteredInteractions.length === 0 && (
					<Card className="bg-green-50">
						<CardContent className="p-4 text-center">
							<CheckCircle className="mx-auto mb-2 h-8 w-8 text-green-500" />
							<p className="font-medium text-green-700">
								Brak wykrytych interakcji
							</p>
							<p className="text-green-600 text-sm">
								Wybrane suplementy są bezpieczne do łącznego stosowania
							</p>
						</CardContent>
					</Card>
				)}

				{/* Interaction summary */}
				{interactionStats.total > 0 && (
					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm">Podsumowanie interakcji</CardTitle>
						</CardHeader>
						<CardContent className="pt-0">
							<div className="grid grid-cols-3 gap-4 text-sm">
								<div className="text-center">
									<div className="font-bold text-2xl text-red-500">
										{interactionStats.high}
									</div>
									<div className="text-gray-500 text-xs">Wysoka</div>
								</div>
								<div className="text-center">
									<div className="font-bold text-2xl text-orange-500">
										{interactionStats.medium}
									</div>
									<div className="text-gray-500 text-xs">Średnia</div>
								</div>
								<div className="text-center">
									<div className="font-bold text-2xl text-blue-500">
										{interactionStats.low}
									</div>
									<div className="text-gray-500 text-xs">Niska</div>
								</div>
							</div>
						</CardContent>
					</Card>
				)}
			</CardContent>
		</Card>
	);
};

// 3D Scene for interaction warnings
interface InteractionWarningsSceneProps {
	interactions: SupplementInteraction[];
	selectedInteraction: string | null;
	onInteractionSelect: (interaction: SupplementInteraction) => void;
}

const InteractionWarningsScene: React.FC<InteractionWarningsSceneProps> = ({
	interactions,
	selectedInteraction,
	onInteractionSelect,
}) => {
	const groupRef = useRef<Group>(null);

	return (
		<group ref={groupRef}>
			{/* Lighting */}
			<ambientLight intensity={0.6} />
			<pointLight position={[10, 10, 10]} intensity={0.8} />
			<pointLight position={[-10, -10, -10]} intensity={0.4} color="#4444ff" />

			{/* Interaction nodes */}
			{interactions.map((interaction) => (
				<InteractionNode
					key={interaction.id}
					interaction={interaction}
					isSelected={selectedInteraction === interaction.id}
					onSelect={() => onInteractionSelect(interaction)}
				/>
			))}

			{/* Interaction connections */}
			<InteractionConnections interactions={interactions} />

			{/* Warning zones */}
			<WarningZones interactions={interactions} />
		</group>
	);
};

// Interaction node component
interface InteractionNodeProps {
	interaction: SupplementInteraction;
	isSelected: boolean;
	onSelect: () => void;
}

const InteractionNode: React.FC<InteractionNodeProps> = ({
	interaction,
	isSelected,
	onSelect,
}) => {
	const meshRef = useRef<Mesh>(null);

	const { scale, color } = useSpring({
		scale: isSelected ? 1.5 : 1,
		color:
			interaction.severity === "high"
				? new Color("#EF4444")
				: interaction.severity === "medium"
					? new Color("#F59E0B")
					: new Color("#3B82F6"),
		config: { tension: 300, friction: 50 },
	});

	useFrame(() => {
		if (meshRef.current) {
			meshRef.current.position.copy(interaction.position);
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
			{interaction.severity === "high" && (
				<mesh position={interaction.position}>
					<sphereGeometry args={[0.6, 12, 12]} />
					<meshBasicMaterial color="#EF4444" transparent opacity={0.3} />
				</mesh>
			)}

			{/* Interaction label */}
			<Html
				position={[
					interaction.position.x,
					interaction.position.y + 0.5,
					interaction.position.z,
				]}
			>
				<div
					className={`cursor-pointer rounded px-1 py-0.5 text-xs ${
						isSelected ? "bg-blue-500 text-white" : "bg-black/70 text-white"
					}`}
					onClick={onSelect}
				>
					{interaction.supplement1.polishName} +{" "}
					{interaction.supplement2.polishName}
				</div>
			</Html>

			{/* Severity indicator */}
			<Html
				position={[
					interaction.position.x,
					interaction.position.y - 0.5,
					interaction.position.z,
				]}
			>
				<Badge
					variant={
						interaction.severity === "high"
							? "destructive"
							: interaction.severity === "medium"
								? "secondary"
								: "outline"
					}
				>
					{interaction.severity === "high"
						? "Wysoka"
						: interaction.severity === "medium"
							? "Średnia"
							: "Niska"}
				</Badge>
			</Html>
		</group>
	);
};

// Interaction connections component
interface InteractionConnectionsProps {
	interactions: SupplementInteraction[];
}

const InteractionConnections: React.FC<InteractionConnectionsProps> = ({
	interactions,
}) => {
	return (
		<group>
			{interactions.map((interaction) => {
				const midPoint = interaction.position.clone();

				return (
					<group key={`connection-${interaction.id}`}>
						{/* Supplement 1 connection */}
						<mesh>
							<bufferGeometry>
								<bufferAttribute
									attach="attributes-position"
									count={2}
									array={
										new Float32Array([
											interaction.position.x - 1,
											interaction.position.y,
											interaction.position.z,
											interaction.position.x,
											interaction.position.y,
											interaction.position.z,
										])
									}
									itemSize={3}
								/>
							</bufferGeometry>
							<lineBasicMaterial
								color={interaction.supplement1.color}
								opacity={0.6}
								transparent
							/>
						</mesh>

						{/* Supplement 2 connection */}
						<mesh>
							<bufferGeometry>
								<bufferAttribute
									attach="attributes-position"
									count={2}
									array={
										new Float32Array([
											interaction.position.x + 1,
											interaction.position.y,
											interaction.position.z,
											interaction.position.x,
											interaction.position.y,
											interaction.position.z,
										])
									}
									itemSize={3}
								/>
							</bufferGeometry>
							<lineBasicMaterial
								color={interaction.supplement2.color}
								opacity={0.6}
								transparent
							/>
						</mesh>

						{/* Interaction type indicator */}
						<mesh position={midPoint}>
							<sphereGeometry args={[0.1, 8, 8]} />
							<meshBasicMaterial
								color={
									interaction.type === "synergistic"
										? "#10B981"
										: interaction.type === "antagonistic"
											? "#F59E0B"
											: interaction.type === "contraindicated"
												? "#EF4444"
												: "#6B7280"
								}
							/>
						</mesh>
					</group>
				);
			})}
		</group>
	);
};

// Warning zones component
interface WarningZonesProps {
	interactions: SupplementInteraction[];
}

const WarningZones: React.FC<WarningZonesProps> = ({ interactions }) => {
	return (
		<group>
			{interactions
				.filter((interaction) => interaction.severity === "high")
				.map((interaction) => (
					<mesh
						key={`warning-zone-${interaction.id}`}
						position={interaction.position}
					>
						<sphereGeometry args={[1.5, 16, 16]} />
						<meshBasicMaterial color="#EF4444" transparent opacity={0.1} />
					</mesh>
				))}
		</group>
	);
};

export default InteractionWarningsSystem;
