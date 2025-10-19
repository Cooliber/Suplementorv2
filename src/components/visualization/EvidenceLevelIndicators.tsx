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
	BookOpen,
	CheckCircle,
	ExternalLink,
	Star,
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

interface EvidenceLevelIndicatorsProps {
	supplementEvidence: SupplementEvidence[];
	onCitationClick?: (citation: ResearchCitation) => void;
	className?: string;
}

interface SupplementEvidence {
	id: string;
	supplementName: string;
	polishSupplementName: string;
	evidenceLevel: "A" | "B" | "C" | "D";
	totalCitations: number;
	recentCitations: number; // last 5 years
	citationTrend: "increasing" | "stable" | "decreasing";
	researchQuality: number; // 0-1
	position: Vector3;
	color: Color;
	citations: ResearchCitation[];
}

interface ResearchCitation {
	id: string;
	title: string;
	authors: string[];
	journal: string;
	year: number;
	doi: string;
	quality: "high" | "medium" | "low";
	relevance: number; // 0-1
	abstract?: string;
}

const SAMPLE_EVIDENCE: SupplementEvidence[] = [
	{
		id: "creatine-evidence",
		supplementName: "Creatine Monohydrate",
		polishSupplementName: "Monohydrat kreatyny",
		evidenceLevel: "A",
		totalCitations: 245,
		recentCitations: 89,
		citationTrend: "increasing",
		researchQuality: 0.85,
		position: new Vector3(-2, 1, 0),
		color: new Color("#F59E0B"),
		citations: [
			{
				id: "creatine-1",
				title:
					"Effects of creatine supplementation on muscle strength and power",
				authors: ["Smith, J.", "Johnson, M.", "Brown, K."],
				journal: "Journal of Strength and Conditioning Research",
				year: 2023,
				doi: "10.1234/jscre.2023.001",
				quality: "high",
				relevance: 0.95,
				abstract:
					"Comprehensive meta-analysis showing significant improvements in muscle strength and power output with creatine supplementation.",
			},
		],
	},
	{
		id: "coq10-evidence",
		supplementName: "Coenzyme Q10",
		polishSupplementName: "Koenzym Q10",
		evidenceLevel: "B",
		totalCitations: 189,
		recentCitations: 67,
		citationTrend: "stable",
		researchQuality: 0.78,
		position: new Vector3(0, 1, 0),
		color: new Color("#EF4444"),
		citations: [
			{
				id: "coq10-1",
				title: "Coenzyme Q10 supplementation and cardiovascular health",
				authors: ["Davis, L.", "Wilson, R."],
				journal: "European Heart Journal",
				year: 2022,
				doi: "10.1234/ehj.2022.045",
				quality: "high",
				relevance: 0.88,
			},
		],
	},
	{
		id: "l-theanine-evidence",
		supplementName: "L-Theanine",
		polishSupplementName: "L-Teanina",
		evidenceLevel: "B",
		totalCitations: 156,
		recentCitations: 43,
		citationTrend: "increasing",
		researchQuality: 0.72,
		position: new Vector3(2, 1, 0),
		color: new Color("#10B981"),
		citations: [
			{
				id: "theanine-1",
				title: "L-Theanine and stress reduction: A systematic review",
				authors: ["Chen, W.", "Liu, Y.", "Zhang, H."],
				journal: "Journal of Alternative Medicine",
				year: 2024,
				doi: "10.1234/jam.2024.012",
				quality: "medium",
				relevance: 0.82,
			},
		],
	},
];

export const EvidenceLevelIndicators: React.FC<
	EvidenceLevelIndicatorsProps
> = ({
	supplementEvidence = SAMPLE_EVIDENCE,
	onCitationClick,
	className = "",
}) => {
	const [selectedSupplement, setSelectedSupplement] = useState<string | null>(
		null,
	);
	const [showCitations, setShowCitations] = useState(false);
	const [filterQuality, setFilterQuality] = useState<string>("all");

	const filteredEvidence = useMemo(() => {
		return supplementEvidence.filter((evidence) => {
			return (
				filterQuality === "all" ||
				evidence.researchQuality >= (filterQuality === "high" ? 0.8 : 0.6)
			);
		});
	}, [supplementEvidence, filterQuality]);

	const evidenceStats = useMemo(() => {
		const total = filteredEvidence.length;
		const levelA = filteredEvidence.filter(
			(e) => e.evidenceLevel === "A",
		).length;
		const levelB = filteredEvidence.filter(
			(e) => e.evidenceLevel === "B",
		).length;
		const highQuality = filteredEvidence.filter(
			(e) => e.researchQuality >= 0.8,
		).length;

		return { total, levelA, levelB, highQuality };
	}, [filteredEvidence]);

	return (
		<Card className={`w-full ${className}`}>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<BookOpen className="h-5 w-5" />
					Wskaźniki poziomu dowodów
				</CardTitle>
				<div className="flex items-center gap-2">
					<Badge variant="outline">{evidenceStats.total} suplementów</Badge>
					<Badge variant="secondary">{evidenceStats.levelA} poziom A</Badge>
					<Badge variant="default">
						{evidenceStats.highQuality} wysoka jakość
					</Badge>
				</div>
			</CardHeader>
			<CardContent className="space-y-4">
				<div
					className="relative overflow-hidden rounded-lg bg-gray-900"
					style={{ height: "400px" }}
				>
					<Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
						<EvidenceLevelScene
							evidence={filteredEvidence}
							selectedSupplement={selectedSupplement}
							onSupplementSelect={(id) => setSelectedSupplement(id)}
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
							checked={showCitations}
							onChange={(e) => setShowCitations(e.target.checked)}
							className="rounded"
						/>
						<span className="text-sm">Pokaż cytowania</span>
					</label>

					<label className="text-sm">
						Jakość badań:
						<select
							value={filterQuality}
							onChange={(e) => setFilterQuality(e.target.value)}
							className="ml-2 rounded border px-2 py-1"
						>
							<option value="all">Wszystkie</option>
							<option value="high">Wysoka (80%+)</option>
							<option value="medium">Średnia (60%+)</option>
						</select>
					</label>
				</div>

				{/* Evidence cards */}
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
					{filteredEvidence.map((evidence) => (
						<EvidenceCard
							key={evidence.id}
							evidence={evidence}
							isSelected={selectedSupplement === evidence.id}
							showCitations={showCitations}
							onSelect={() =>
								setSelectedSupplement(
									selectedSupplement === evidence.id ? null : evidence.id,
								)
							}
							onCitationClick={onCitationClick}
						/>
					))}
				</div>

				{/* Research quality overview */}
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm">Przegląd jakości badań</CardTitle>
					</CardHeader>
					<CardContent className="pt-0">
						<div className="space-y-3">
							{filteredEvidence.map((evidence) => (
								<div key={evidence.id} className="flex items-center gap-2">
									<span className="w-24 truncate text-sm">
										{evidence.polishSupplementName}
									</span>
									<div className="flex-1">
										<Progress
											value={evidence.researchQuality * 100}
											className="h-2"
										/>
									</div>
									<div className="flex items-center gap-2">
										<Badge
											variant={
												evidence.evidenceLevel === "A"
													? "default"
													: evidence.evidenceLevel === "B"
														? "secondary"
														: "outline"
											}
										>
											{evidence.evidenceLevel}
										</Badge>
										<span className="text-gray-500 text-xs">
											{evidence.totalCitations}
										</span>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				{/* Citation trend analysis */}
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm">Trendy cytowań</CardTitle>
					</CardHeader>
					<CardContent className="pt-0">
						<div className="grid grid-cols-3 gap-4 text-sm">
							<div className="text-center">
								<div className="font-bold text-2xl text-green-500">
									{
										filteredEvidence.filter(
											(e) => e.citationTrend === "increasing",
										).length
									}
								</div>
								<div className="text-gray-500 text-xs">Rosnący</div>
							</div>
							<div className="text-center">
								<div className="font-bold text-2xl text-blue-500">
									{
										filteredEvidence.filter((e) => e.citationTrend === "stable")
											.length
									}
								</div>
								<div className="text-gray-500 text-xs">Stabilny</div>
							</div>
							<div className="text-center">
								<div className="font-bold text-2xl text-orange-500">
									{
										filteredEvidence.filter(
											(e) => e.citationTrend === "decreasing",
										).length
									}
								</div>
								<div className="text-gray-500 text-xs">Spadający</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</CardContent>
		</Card>
	);
};

// 3D Scene for evidence levels
interface EvidenceLevelSceneProps {
	evidence: SupplementEvidence[];
	selectedSupplement: string | null;
	onSupplementSelect: (id: string) => void;
}

const EvidenceLevelScene: React.FC<EvidenceLevelSceneProps> = ({
	evidence,
	selectedSupplement,
	onSupplementSelect,
}) => {
	const groupRef = useRef<Group>(null);

	return (
		<group ref={groupRef}>
			{/* Lighting */}
			<ambientLight intensity={0.6} />
			<pointLight position={[10, 10, 10]} intensity={0.8} />
			<pointLight position={[-10, -10, -10]} intensity={0.4} color="#4444ff" />

			{/* Evidence nodes */}
			{evidence.map((evidenceItem) => (
				<EvidenceNode
					key={evidenceItem.id}
					evidence={evidenceItem}
					isSelected={selectedSupplement === evidenceItem.id}
					onSelect={() => onSupplementSelect(evidenceItem.id)}
				/>
			))}

			{/* Evidence connections */}
			<EvidenceConnections evidence={evidence} />

			{/* Quality indicators */}
			<QualityIndicators evidence={evidence} />
		</group>
	);
};

// Evidence node component
interface EvidenceNodeProps {
	evidence: SupplementEvidence;
	isSelected: boolean;
	onSelect: () => void;
}

const EvidenceNode: React.FC<EvidenceNodeProps> = ({
	evidence,
	isSelected,
	onSelect,
}) => {
	const meshRef = useRef<Mesh>(null);

	const { scale, color } = useSpring({
		scale: isSelected ? 1.5 : 1,
		color:
			evidence.evidenceLevel === "A"
				? new Color("#10B981")
				: evidence.evidenceLevel === "B"
					? new Color("#3B82F6")
					: evidence.evidenceLevel === "C"
						? new Color("#F59E0B")
						: new Color("#EF4444"),
		config: { tension: 300, friction: 50 },
	});

	useFrame(() => {
		if (meshRef.current) {
			meshRef.current.position.copy(evidence.position);
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

			{/* Citation count indicator */}
			<mesh
				position={[
					evidence.position.x,
					evidence.position.y + 0.3,
					evidence.position.z,
				]}
			>
				<sphereGeometry args={[0.1, 8, 8]} />
				<meshBasicMaterial color="#6B7280" transparent opacity={0.7} />
			</mesh>

			{/* Evidence level badge */}
			<Html
				position={[
					evidence.position.x,
					evidence.position.y + 0.6,
					evidence.position.z,
				]}
			>
				<Badge
					variant={
						evidence.evidenceLevel === "A"
							? "default"
							: evidence.evidenceLevel === "B"
								? "secondary"
								: "outline"
					}
					className="text-xs"
				>
					Poziom {evidence.evidenceLevel}
				</Badge>
			</Html>

			{/* Supplement name */}
			<Html
				position={[
					evidence.position.x,
					evidence.position.y - 0.5,
					evidence.position.z,
				]}
			>
				<div
					className={`cursor-pointer rounded px-1 py-0.5 text-xs ${
						isSelected ? "bg-blue-500 text-white" : "bg-black/70 text-white"
					}`}
					onClick={onSelect}
				>
					{evidence.polishSupplementName}
				</div>
			</Html>

			{/* Citation count */}
			<Html
				position={[
					evidence.position.x,
					evidence.position.y - 0.8,
					evidence.position.z,
				]}
			>
				<div className="rounded bg-black/70 px-1 py-0.5 text-white text-xs">
					{evidence.totalCitations} cytowań
				</div>
			</Html>
		</group>
	);
};

// Evidence connections component
interface EvidenceConnectionsProps {
	evidence: SupplementEvidence[];
}

const EvidenceConnections: React.FC<EvidenceConnectionsProps> = ({
	evidence,
}) => {
	return (
		<group>
			{evidence.map((evidenceItem) => {
				// Connect to nearby evidence nodes
				const nearby = evidence.filter(
					(other) =>
						other.id !== evidenceItem.id &&
						other.position.distanceTo(evidenceItem.position) < 3,
				);

				return (
					<group key={`connections-${evidenceItem.id}`}>
						{nearby.map((other) => (
							<mesh key={`connection-${other.id}`}>
								<bufferGeometry>
									<bufferAttribute
										attach="attributes-position"
										count={2}
										array={
											new Float32Array([
												evidenceItem.position.x,
												evidenceItem.position.y,
												evidenceItem.position.z,
												other.position.x,
												other.position.y,
												other.position.z,
											])
										}
										itemSize={3}
									/>
								</bufferGeometry>
								<lineBasicMaterial color="#6B7280" opacity={0.3} transparent />
							</mesh>
						))}
					</group>
				);
			})}
		</group>
	);
};

// Quality indicators component
interface QualityIndicatorsProps {
	evidence: SupplementEvidence[];
}

const QualityIndicators: React.FC<QualityIndicatorsProps> = ({ evidence }) => {
	return (
		<group>
			{evidence.map((evidenceItem) => (
				<group key={`quality-${evidenceItem.id}`}>
					{/* Research quality ring */}
					<mesh position={evidenceItem.position}>
						<ringGeometry args={[0.4, 0.5, 16]} />
						<meshBasicMaterial
							color="#10B981"
							transparent
							opacity={evidenceItem.researchQuality * 0.5}
						/>
					</mesh>

					{/* Citation trend indicator */}
					<mesh
						position={[
							evidenceItem.position.x + 0.5,
							evidenceItem.position.y,
							evidenceItem.position.z,
						]}
					>
						<sphereGeometry args={[0.05, 6, 6]} />
						<meshBasicMaterial
							color={
								evidenceItem.citationTrend === "increasing"
									? "#10B981"
									: evidenceItem.citationTrend === "stable"
										? "#3B82F6"
										: "#F59E0B"
							}
						/>
					</mesh>
				</group>
			))}
		</group>
	);
};

// Evidence card component
interface EvidenceCardProps {
	evidence: SupplementEvidence;
	isSelected: boolean;
	showCitations: boolean;
	onSelect: () => void;
	onCitationClick?: (citation: ResearchCitation) => void;
}

const EvidenceCard: React.FC<EvidenceCardProps> = ({
	evidence,
	isSelected,
	showCitations,
	onSelect,
	onCitationClick,
}) => {
	return (
		<Card
			className={`cursor-pointer transition-all ${
				isSelected ? "bg-blue-50 ring-2 ring-blue-500" : "hover:shadow-md"
			}`}
			onClick={onSelect}
		>
			<CardContent className="p-4">
				<div className="flex items-center gap-3">
					<div
						className="h-4 w-4 rounded-full"
						style={{ backgroundColor: evidence.color.getHexString() }}
					/>
					<div className="flex-1">
						<h3 className="font-medium text-sm">
							{evidence.polishSupplementName}
						</h3>
						<div className="mt-1 flex items-center gap-2">
							<Badge
								variant={
									evidence.evidenceLevel === "A"
										? "default"
										: evidence.evidenceLevel === "B"
											? "secondary"
											: "outline"
								}
							>
								Poziom {evidence.evidenceLevel}
							</Badge>
							<span className="text-gray-500 text-xs">
								{evidence.totalCitations} cytowań
							</span>
						</div>
					</div>
				</div>

				{/* Research quality */}
				<div className="mt-3 space-y-2">
					<div className="flex items-center justify-between text-xs">
						<span>Jakość badań:</span>
						<span>{Math.round(evidence.researchQuality * 100)}%</span>
					</div>
					<Progress value={evidence.researchQuality * 100} className="h-1" />
				</div>

				{/* Citation trend */}
				<div className="mt-2 flex items-center gap-2">
					<TrendingUp
						className={`h-3 w-3 ${
							evidence.citationTrend === "increasing"
								? "text-green-500"
								: evidence.citationTrend === "stable"
									? "text-blue-500"
									: "text-orange-500"
						}`}
					/>
					<span className="text-xs">
						Trend:{" "}
						{evidence.citationTrend === "increasing"
							? "Rosnący"
							: evidence.citationTrend === "stable"
								? "Stabilny"
								: "Spadający"}
					</span>
				</div>

				{/* Citations */}
				{showCitations && evidence.citations.length > 0 && (
					<div className="mt-3 space-y-2">
						<div className="font-medium text-xs">Najnowsze cytowania:</div>
						{evidence.citations.slice(0, 2).map((citation) => (
							<div
								key={citation.id}
								className="cursor-pointer rounded bg-gray-50 p-2 text-xs hover:bg-gray-100"
								onClick={(e) => {
									e.stopPropagation();
									onCitationClick?.(citation);
								}}
							>
								<div className="truncate font-medium">{citation.title}</div>
								<div className="text-gray-500">
									{citation.authors.join(", ")} • {citation.year}
								</div>
								<div className="mt-1 flex items-center gap-1">
									<Badge
										variant={
											citation.quality === "high"
												? "default"
												: citation.quality === "medium"
													? "secondary"
													: "outline"
										}
										className="text-xs"
									>
										{citation.quality === "high"
											? "Wysoka"
											: citation.quality === "medium"
												? "Średnia"
												: "Niska"}
									</Badge>
									<ExternalLink className="h-3 w-3" />
								</div>
							</div>
						))}
					</div>
				)}
			</CardContent>
		</Card>
	);
};

export default EvidenceLevelIndicators;
