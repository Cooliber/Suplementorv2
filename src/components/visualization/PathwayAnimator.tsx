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
	SkipBack,
	SkipForward,
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

interface PathwayAnimatorProps {
	pathwayData: MetabolicPathway;
	supplementName?: string;
	polishSupplementName?: string;
	autoPlay?: boolean;
	showAnimation?: boolean;
	className?: string;
}

interface MetabolicPathway {
	id: string;
	name: string;
	polishName: string;
	description: string;
	enzymes: EnzymeNode[];
	metabolites: MetaboliteNode[];
	reactions: Reaction[];
	regulation: RegulationPoint[];
}

interface EnzymeNode {
	id: string;
	name: string;
	polishName: string;
	position: Vector3;
	enzymeClass: string;
	activity: number; // 0-1
	color: Color;
}

interface MetaboliteNode {
	id: string;
	name: string;
	polishName: string;
	position: Vector3;
	concentration: number; // 0-1
	type: "substrate" | "product" | "intermediate" | "cofactor";
	color: Color;
}

interface Reaction {
	id: string;
	enzymeId: string;
	substrateIds: string[];
	productIds: string[];
	rate: number; // reaction rate
	isActive: boolean;
}

interface RegulationPoint {
	id: string;
	enzymeId: string;
	type: "activation" | "inhibition" | "phosphorylation" | "dephosphorylation";
	position: Vector3;
	strength: number; // 0-1
}

const CREATINE_KINASE_PATHWAY: MetabolicPathway = {
	id: "creatine-kinase",
	name: "Creatine Kinase Pathway",
	polishName: "Szla kinazy kreatynowej",
	description:
		"Pathway showing creatine phosphate metabolism and ATP regeneration",
	enzymes: [
		{
			id: "ck-mm",
			name: "Creatine Kinase MM",
			polishName: "Kinaza kreatynowa MM",
			position: new Vector3(0, 0, 0),
			enzymeClass: "Transferase",
			activity: 0.8,
			color: new Color("#F59E0B"),
		},
		{
			id: "ck-mb",
			name: "Creatine Kinase MB",
			polishName: "Kinaza kreatynowa MB",
			position: new Vector3(2, 1, 0),
			enzymeClass: "Transferase",
			activity: 0.6,
			color: new Color("#EF4444"),
		},
	],
	metabolites: [
		{
			id: "creatine",
			name: "Creatine",
			polishName: "Kreatyna",
			position: new Vector3(-2, 0, 0),
			concentration: 0.7,
			type: "substrate",
			color: new Color("#22C55E"),
		},
		{
			id: "creatine-phosphate",
			name: "Creatine Phosphate",
			polishName: "Fosfokreatyna",
			position: new Vector3(2, -1, 0),
			concentration: 0.5,
			type: "product",
			color: new Color("#8B5CF6"),
		},
		{
			id: "atp",
			name: "ATP",
			polishName: "ATP",
			position: new Vector3(-1, 1, 0),
			concentration: 0.3,
			type: "cofactor",
			color: new Color("#F59E0B"),
		},
		{
			id: "adp",
			name: "ADP",
			polishName: "ADP",
			position: new Vector3(3, 0, 0),
			concentration: 0.8,
			type: "product",
			color: new Color("#EF4444"),
		},
	],
	reactions: [
		{
			id: "ck-reaction-1",
			enzymeId: "ck-mm",
			substrateIds: ["creatine", "atp"],
			productIds: ["creatine-phosphate", "adp"],
			rate: 0.8,
			isActive: true,
		},
	],
	regulation: [
		{
			id: "regulation-1",
			enzymeId: "ck-mm",
			type: "activation",
			position: new Vector3(0.5, 0.5, 0),
			strength: 0.7,
		},
	],
};

export const PathwayAnimator: React.FC<PathwayAnimatorProps> = ({
	pathwayData = CREATINE_KINASE_PATHWAY,
	supplementName = "Creatine",
	polishSupplementName = "Kreatyna",
	autoPlay = true,
	showAnimation = true,
	className = "",
}) => {
	const [isPlaying, setIsPlaying] = useState(autoPlay);
	const [animationSpeed, setAnimationSpeed] = useState(1);
	const [currentTime, setCurrentTime] = useState(0);
	const [selectedEnzyme, setSelectedEnzyme] = useState<string | null>(null);
	const animationProgressRef = useRef(0);

	return (
		<Card className={`w-full ${className}`}>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Activity className="h-5 w-5" />
					Animator szlaków metabolicznych
				</CardTitle>
				<div className="space-y-1">
					<p className="font-medium text-sm">{pathwayData.polishName}</p>
					<div className="flex items-center gap-2">
						<Badge variant="outline">
							{pathwayData.enzymes.length} enzymów
						</Badge>
						<Badge variant="secondary">
							{pathwayData.metabolites.length} metabolitów
						</Badge>
					</div>
				</div>
			</CardHeader>
			<CardContent className="space-y-4">
				<div
					className="relative overflow-hidden rounded-lg bg-gray-900"
					style={{ height: "400px" }}
				>
					<Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
						<PathwayAnimationScene
							pathwayData={pathwayData}
							isPlaying={isPlaying}
							animationSpeed={animationSpeed}
							currentTime={currentTime}
							selectedEnzyme={selectedEnzyme}
							onTimeUpdate={setCurrentTime}
							onEnzymeSelect={(enzymeId) => setSelectedEnzyme(enzymeId)}
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
							<div>
								Aktywne reakcje:{" "}
								{pathwayData.reactions.filter((r) => r.isActive).length}
							</div>
						</div>
					</div>
				</div>

				{/* Animation controls */}
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
							animationProgressRef.current = 0;
						}}
					>
						<RotateCcw className="h-4 w-4" />
					</Button>

					<div className="flex-1">
						<Slider
							value={[animationSpeed]}
							onValueChange={([value]) => setAnimationSpeed(value || 1)}
							min={0.1}
							max={3}
							step={0.1}
							className="w-full"
						/>
					</div>

					<Badge variant="outline">{animationSpeed.toFixed(1)}x</Badge>
				</div>

				{/* Pathway components */}
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					{/* Enzymes */}
					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm">Enzymy</CardTitle>
						</CardHeader>
						<CardContent className="pt-0">
							<div className="space-y-2">
								{pathwayData.enzymes.map((enzyme) => (
									<div
										key={enzyme.id}
										className={`cursor-pointer rounded p-2 transition-colors ${
											selectedEnzyme === enzyme.id
												? "border border-blue-200 bg-blue-50"
												: "hover:bg-gray-50"
										}`}
										onClick={() =>
											setSelectedEnzyme(
												selectedEnzyme === enzyme.id ? null : enzyme.id,
											)
										}
									>
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-2">
												<div
													className="h-3 w-3 rounded-full"
													style={{
														backgroundColor: enzyme.color.getHexString(),
													}}
												/>
												<span className="font-medium text-sm">
													{enzyme.polishName}
												</span>
											</div>
											<Badge variant="outline">
												{Math.round(enzyme.activity * 100)}%
											</Badge>
										</div>
										<div className="mt-1">
											<Progress value={enzyme.activity * 100} className="h-1" />
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>

					{/* Metabolites */}
					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm">Metabolity</CardTitle>
						</CardHeader>
						<CardContent className="pt-0">
							<div className="space-y-2">
								{pathwayData.metabolites.map((metabolite) => (
									<div key={metabolite.id} className="flex items-center gap-2">
										<div
											className="h-3 w-3 rounded-full"
											style={{
												backgroundColor: metabolite.color.getHexString(),
											}}
										/>
										<span className="flex-1 text-sm">
											{metabolite.polishName}
										</span>
										<Badge
											variant={
												metabolite.type === "substrate"
													? "default"
													: metabolite.type === "product"
														? "secondary"
														: "outline"
											}
										>
											{metabolite.type === "substrate"
												? "Substrat"
												: metabolite.type === "product"
													? "Produkt"
													: metabolite.type === "intermediate"
														? "pośredni"
														: "Kofaktor"}
										</Badge>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Selected enzyme details */}
				{selectedEnzyme && (
					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm">Wybrany enzym</CardTitle>
						</CardHeader>
						<CardContent className="pt-0">
							{(() => {
								const enzyme = pathwayData.enzymes.find(
									(e) => e.id === selectedEnzyme,
								);
								if (!enzyme) return null;

								return (
									<div className="space-y-2 text-sm">
										<div className="flex justify-between">
											<span>Nazwa:</span>
											<span className="font-medium">{enzyme.polishName}</span>
										</div>
										<div className="flex justify-between">
											<span>Klasa enzymu:</span>
											<span className="font-medium">{enzyme.enzymeClass}</span>
										</div>
										<div className="flex justify-between">
											<span>Aktywność:</span>
											<span className="font-medium">
												{Math.round(enzyme.activity * 100)}%
											</span>
										</div>
										<div className="flex items-center gap-2">
											<span>Kolor:</span>
											<div
												className="h-4 w-4 rounded border"
												style={{ backgroundColor: enzyme.color.getHexString() }}
											/>
										</div>
									</div>
								);
							})()}
						</CardContent>
					</Card>
				)}

				{/* Regulation points */}
				{pathwayData.regulation.length > 0 && (
					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm">Punkty regulacji</CardTitle>
						</CardHeader>
						<CardContent className="pt-0">
							<div className="space-y-2">
								{pathwayData.regulation.map((regulation) => (
									<div key={regulation.id} className="flex items-center gap-2">
										<Badge
											variant={
												regulation.type === "activation"
													? "default"
													: regulation.type === "inhibition"
														? "destructive"
														: "secondary"
											}
										>
											{regulation.type === "activation"
												? "Aktywacja"
												: regulation.type === "inhibition"
													? "Inhibicja"
													: regulation.type === "phosphorylation"
														? "Fosforylacja"
														: "Defosforylacja"}
										</Badge>
										<span className="text-sm">
											Enzym:{" "}
											{
												pathwayData.enzymes.find(
													(e) => e.id === regulation.enzymeId,
												)?.polishName
											}
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

// 3D Scene for pathway animation
interface PathwayAnimationSceneProps {
	pathwayData: MetabolicPathway;
	isPlaying: boolean;
	animationSpeed: number;
	currentTime: number;
	selectedEnzyme: string | null;
	onTimeUpdate: (time: number) => void;
	onEnzymeSelect: (enzymeId: string) => void;
}

const PathwayAnimationScene: React.FC<PathwayAnimationSceneProps> = ({
	pathwayData,
	isPlaying,
	animationSpeed,
	currentTime,
	selectedEnzyme,
	onTimeUpdate,
	onEnzymeSelect,
}) => {
	const groupRef = useRef<Group>(null);
	const animationProgressRef = useRef(0);

	// Animation loop
	useFrame((state, delta) => {
		if (!isPlaying) return;

		animationProgressRef.current += delta * animationSpeed;
		onTimeUpdate(animationProgressRef.current);

		// Update enzyme activities
		pathwayData.enzymes.forEach((enzyme) => {
			enzyme.activity =
				0.5 +
				0.5 * Math.sin(animationProgressRef.current * 2 + enzyme.position.x);
		});

		// Update metabolite concentrations
		pathwayData.metabolites.forEach((metabolite) => {
			const baseConcentration = metabolite.concentration;
			const fluctuation =
				0.2 *
				Math.sin(animationProgressRef.current * 1.5 + metabolite.position.y);
			metabolite.concentration = Math.max(
				0,
				Math.min(1, baseConcentration + fluctuation),
			);
		});

		// Update reaction activity
		pathwayData.reactions.forEach((reaction) => {
			const enzyme = pathwayData.enzymes.find(
				(e) => e.id === reaction.enzymeId,
			);
			reaction.isActive = enzyme ? enzyme.activity > 0.6 : false;
		});
	});

	return (
		<group ref={groupRef}>
			{/* Lighting */}
			<ambientLight intensity={0.6} />
			<pointLight position={[10, 10, 10]} intensity={0.8} />
			<pointLight position={[-10, -10, -10]} intensity={0.4} color="#4444ff" />

			{/* Enzymes */}
			{pathwayData.enzymes.map((enzyme) => (
				<EnzymeNodeComponent
					key={enzyme.id}
					enzyme={enzyme}
					isSelected={selectedEnzyme === enzyme.id}
					onSelect={() => onEnzymeSelect(enzyme.id)}
				/>
			))}

			{/* Metabolites */}
			{pathwayData.metabolites.map((metabolite) => (
				<MetaboliteNodeComponent key={metabolite.id} metabolite={metabolite} />
			))}

			{/* Reactions */}
			<ReactionComponents
				reactions={pathwayData.reactions}
				pathwayData={pathwayData}
			/>

			{/* Regulation points */}
			<RegulationComponents
				regulation={pathwayData.regulation}
				pathwayData={pathwayData}
			/>

			{/* Pathway background */}
			<PathwayBackground />
		</group>
	);
};

// Enzyme node component
interface EnzymeNodeComponentProps {
	enzyme: EnzymeNode;
	isSelected: boolean;
	onSelect: () => void;
}

const EnzymeNodeComponent: React.FC<EnzymeNodeComponentProps> = ({
	enzyme,
	isSelected,
	onSelect,
}) => {
	const meshRef = useRef<Mesh>(null);

	const { scale, emissive } = useSpring({
		scale: isSelected ? 1.3 : 1,
		emissive: enzyme.activity > 0.6 ? enzyme.color.getHex() : 0x000000,
		config: { tension: 300, friction: 50 },
	});

	useFrame(() => {
		if (meshRef.current) {
			meshRef.current.position.copy(enzyme.position);
		}
	});

	return (
		<group>
			<animated.mesh ref={meshRef} scale={scale} onClick={onSelect}>
				<boxGeometry args={[0.8, 0.6, 0.2]} />
				<meshStandardMaterial
					color={enzyme.color}
					emissive={emissive}
					emissiveIntensity={enzyme.activity * 0.5}
				/>
			</animated.mesh>

			{/* Activity indicator */}
			<mesh
				position={[
					enzyme.position.x,
					enzyme.position.y + 0.4,
					enzyme.position.z,
				]}
			>
				<sphereGeometry args={[0.1, 8, 8]} />
				<meshBasicMaterial
					color="#10B981"
					transparent
					opacity={enzyme.activity}
				/>
			</mesh>

			{/* Enzyme label */}
			<Html
				position={[
					enzyme.position.x,
					enzyme.position.y + 0.7,
					enzyme.position.z,
				]}
			>
				<div
					className={`cursor-pointer rounded px-1 py-0.5 text-xs ${
						isSelected ? "bg-blue-500 text-white" : "bg-black/70 text-white"
					}`}
					onClick={onSelect}
				>
					{enzyme.polishName}
				</div>
			</Html>
		</group>
	);
};

// Metabolite node component
interface MetaboliteNodeComponentProps {
	metabolite: MetaboliteNode;
}

const MetaboliteNodeComponent: React.FC<MetaboliteNodeComponentProps> = ({
	metabolite,
}) => {
	const meshRef = useRef<Mesh>(null);

	useFrame(() => {
		if (meshRef.current) {
			meshRef.current.position.copy(metabolite.position);
		}
	});

	return (
		<group>
			<mesh ref={meshRef}>
				<sphereGeometry args={[0.15, 12, 12]} />
				<meshStandardMaterial
					color={metabolite.color}
					transparent
					opacity={metabolite.concentration}
				/>
			</mesh>

			{/* Concentration indicator */}
			<mesh position={metabolite.position}>
				<sphereGeometry args={[0.25, 8, 8]} />
				<meshBasicMaterial
					color={metabolite.color}
					transparent
					opacity={metabolite.concentration * 0.3}
				/>
			</mesh>

			{/* Metabolite label */}
			<Html
				position={[
					metabolite.position.x,
					metabolite.position.y + 0.3,
					metabolite.position.z,
				]}
			>
				<div className="rounded bg-black/70 px-1 py-0.5 text-white text-xs">
					{metabolite.polishName}
				</div>
			</Html>
		</group>
	);
};

// Reaction components
interface ReactionComponentsProps {
	reactions: Reaction[];
	pathwayData: MetabolicPathway;
}

const ReactionComponents: React.FC<ReactionComponentsProps> = ({
	reactions,
	pathwayData,
}) => {
	return (
		<group>
			{reactions.map((reaction) => {
				const enzyme = pathwayData.enzymes.find(
					(e) => e.id === reaction.enzymeId,
				);
				if (!enzyme) return null;

				return (
					<group key={reaction.id}>
						{/* Reaction arrow */}
						<ReactionArrow
							enzyme={enzyme}
							reaction={reaction}
							pathwayData={pathwayData}
						/>

						{/* Reaction activity indicator */}
						{reaction.isActive && (
							<mesh position={enzyme.position}>
								<ringGeometry args={[0.6, 0.8, 16]} />
								<meshBasicMaterial color="#F59E0B" transparent opacity={0.6} />
							</mesh>
						)}
					</group>
				);
			})}
		</group>
	);
};

// Reaction arrow component
interface ReactionArrowProps {
	enzyme: EnzymeNode;
	reaction: Reaction;
	pathwayData: MetabolicPathway;
}

const ReactionArrow: React.FC<ReactionArrowProps> = ({
	enzyme,
	reaction,
	pathwayData,
}) => {
	// Calculate arrow direction based on substrates and products
	const substrates = reaction.substrateIds
		.map((id) => pathwayData.metabolites.find((m) => m.id === id))
		.filter(Boolean);

	const products = reaction.productIds
		.map((id) => pathwayData.metabolites.find((m) => m.id === id))
		.filter(Boolean);

	if (substrates.length === 0 || products.length === 0) return null;

	// Simple arrow from first substrate to first product
	const startPos = substrates[0].position;
	const endPos = products[0].position;

	return (
		<mesh>
			<bufferGeometry>
				<bufferAttribute
					attach="attributes-position"
					count={2}
					array={
						new Float32Array([
							startPos.x,
							startPos.y,
							startPos.z,
							endPos.x,
							endPos.y,
							endPos.z,
						])
					}
					itemSize={3}
				/>
			</bufferGeometry>
			<lineBasicMaterial
				color={reaction.isActive ? "#F59E0B" : "#6B7280"}
				opacity={reaction.isActive ? 0.8 : 0.3}
				transparent
			/>
		</mesh>
	);
};

// Regulation components
interface RegulationComponentsProps {
	regulation: RegulationPoint[];
	pathwayData: MetabolicPathway;
}

const RegulationComponents: React.FC<RegulationComponentsProps> = ({
	regulation,
	pathwayData,
}) => {
	return (
		<group>
			{regulation.map((regPoint) => {
				const enzyme = pathwayData.enzymes.find(
					(e) => e.id === regPoint.enzymeId,
				);
				if (!enzyme) return null;

				return (
					<group key={regPoint.id}>
						{/* Regulation indicator */}
						<mesh position={regPoint.position}>
							<sphereGeometry args={[0.08, 8, 8]} />
							<meshBasicMaterial
								color={
									regPoint.type === "activation"
										? "#10B981"
										: regPoint.type === "inhibition"
											? "#EF4444"
											: regPoint.type === "phosphorylation"
												? "#F59E0B"
												: "#8B5CF6"
								}
							/>
						</mesh>

						{/* Regulation label */}
						<Html
							position={[
								regPoint.position.x,
								regPoint.position.y + 0.2,
								regPoint.position.z,
							]}
						>
							<div className="rounded bg-black/70 px-1 py-0.5 text-white text-xs">
								{regPoint.type === "activation"
									? "Aktywacja"
									: regPoint.type === "inhibition"
										? "Inhibicja"
										: regPoint.type === "phosphorylation"
											? "Fosforylacja"
											: "Defosforylacja"}
							</div>
						</Html>
					</group>
				);
			})}
		</group>
	);
};

// Pathway background component
const PathwayBackground: React.FC = () => {
	return (
		<group>
			{/* Cellular background */}
			<mesh position={[0, 0, -1]}>
				<planeGeometry args={[12, 8]} />
				<meshStandardMaterial color="#1F2937" transparent opacity={0.1} />
			</mesh>

			{/* Mitochondrion representation */}
			<mesh position={[3, 1, -0.5]}>
				<ellipseCurveGeometry
					args={[0, 0, 1.5, 0.8, 0, Math.PI * 2, false, 0]}
				/>
				<meshStandardMaterial color="#92400E" transparent opacity={0.2} />
			</mesh>

			{/* Background label */}
			<Html position={[0, -3, 0]}>
				<div className="rounded bg-black/70 px-2 py-1 text-sm text-white">
					Środowisko komórkowe
				</div>
			</Html>
		</group>
	);
};

export default PathwayAnimator;
