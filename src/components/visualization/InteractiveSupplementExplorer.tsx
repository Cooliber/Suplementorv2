"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { animated, useSpring } from "@react-spring/three";
import { Html, OrbitControls, Text } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import {
	AlertTriangle,
	CheckCircle,
	Eye,
	Filter,
	Info,
	Search,
	Shield,
	Star,
	TrendingUp,
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

interface InteractiveSupplementExplorerProps {
	supplements: SupplementData[];
	onSupplementSelect?: (supplement: SupplementData) => void;
	onDosageChange?: (supplementId: string, dosage: number) => void;
	className?: string;
}

interface SupplementData {
	id: string;
	name: string;
	polishName: string;
	category: string;
	evidenceLevel: "A" | "B" | "C" | "D";
	safetyRating: number; // 1-5
	interactions: InteractionData[];
	dosage: {
		min: number;
		max: number;
		unit: string;
		recommended: number;
	};
	effects: EffectData[];
	researchCitations: number;
	position: Vector3;
	color: Color;
}

interface InteractionData {
	id: string;
	supplementId: string;
	supplementName: string;
	severity: "low" | "medium" | "high";
	description: string;
	polishDescription: string;
}

interface EffectData {
	id: string;
	name: string;
	polishName: string;
	intensity: number; // 0-1
	onsetTime: number; // minutes
	duration: number; // minutes
	evidenceStrength: number; // 0-1
}

const SAMPLE_SUPPLEMENTS: SupplementData[] = [
	{
		id: "creatine",
		name: "Creatine Monohydrate",
		polishName: "Monohydrat kreatyny",
		category: "Wydolność",
		evidenceLevel: "A",
		safetyRating: 5,
		interactions: [
			{
				id: "creatine-caffeine",
				supplementId: "caffeine",
				supplementName: "Kofeina",
				severity: "low",
				description: "May reduce creatine effectiveness",
				polishDescription: "Może zmniejszać skuteczność kreatyny",
			},
		],
		dosage: {
			min: 3,
			max: 5,
			unit: "g",
			recommended: 5,
		},
		effects: [
			{
				id: "muscle-strength",
				name: "Siła mięśni",
				polishName: "Siła mięśni",
				intensity: 0.8,
				onsetTime: 30,
				duration: 120,
				evidenceStrength: 0.9,
			},
		],
		researchCitations: 245,
		position: new Vector3(-2, 1, 0),
		color: new Color("#F59E0B"),
	},
	{
		id: "coenzyme-q10",
		name: "Coenzyme Q10",
		polishName: "Koenzym Q10",
		category: "Energia",
		evidenceLevel: "B",
		safetyRating: 5,
		interactions: [
			{
				id: "coq10-warfarin",
				supplementId: "warfarin",
				supplementName: "Warfaryna",
				severity: "high",
				description: "May interact with blood thinners",
				polishDescription: "Może interagować z lekami przeciwzakrzepowymi",
			},
		],
		dosage: {
			min: 100,
			max: 300,
			unit: "mg",
			recommended: 200,
		},
		effects: [
			{
				id: "mitochondrial-function",
				name: "Funkcja mitochondriów",
				polishName: "Funkcja mitochondriów",
				intensity: 0.7,
				onsetTime: 60,
				duration: 480,
				evidenceStrength: 0.8,
			},
		],
		researchCitations: 189,
		position: new Vector3(0, 1, 0),
		color: new Color("#EF4444"),
	},
	{
		id: "l-theanine",
		name: "L-Theanine",
		polishName: "L-Teanina",
		category: "Relaksacja",
		evidenceLevel: "B",
		safetyRating: 5,
		interactions: [],
		dosage: {
			min: 200,
			max: 400,
			unit: "mg",
			recommended: 300,
		},
		effects: [
			{
				id: "stress-reduction",
				name: "Redukcja stresu",
				polishName: "Redukcja stresu",
				intensity: 0.6,
				onsetTime: 30,
				duration: 240,
				evidenceStrength: 0.7,
			},
		],
		researchCitations: 156,
		position: new Vector3(2, 1, 0),
		color: new Color("#10B981"),
	},
];

export const InteractiveSupplementExplorer: React.FC<
	InteractiveSupplementExplorerProps
> = ({
	supplements = SAMPLE_SUPPLEMENTS,
	onSupplementSelect,
	onDosageChange,
	className = "",
}) => {
	const [selectedSupplement, setSelectedSupplement] =
		useState<SupplementData | null>(null);
	const [currentDosage, setCurrentDosage] = useState<number>(0);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedCategory, setSelectedCategory] = useState<string>("all");
	const [showInteractions, setShowInteractions] = useState(true);
	const [showEffects, setShowEffects] = useState(true);

	const filteredSupplements = useMemo(() => {
		return supplements.filter((supplement) => {
			const matchesSearch =
				supplement.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				supplement.polishName.toLowerCase().includes(searchTerm.toLowerCase());
			const matchesCategory =
				selectedCategory === "all" || supplement.category === selectedCategory;
			return matchesSearch && matchesCategory;
		});
	}, [supplements, searchTerm, selectedCategory]);

	const categories = useMemo(() => {
		return Array.from(new Set(supplements.map((s) => s.category)));
	}, [supplements]);

	return (
		<Card className={`w-full ${className}`}>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Search className="h-5 w-5" />
					Interaktywny eksplorer suplementów
				</CardTitle>
				<div className="flex items-center gap-2">
					<Badge variant="outline">
						{filteredSupplements.length} suplementów
					</Badge>
					{selectedSupplement && (
						<Badge variant="secondary">
							Wybrany: {selectedSupplement.polishName}
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
						<SupplementExplorerScene
							supplements={filteredSupplements}
							selectedSupplement={selectedSupplement}
							currentDosage={currentDosage}
							onSupplementSelect={(supplement) => {
								setSelectedSupplement(supplement);
								onSupplementSelect?.(supplement);
							}}
						/>
						<OrbitControls
							enablePan={true}
							enableZoom={true}
							enableRotate={true}
						/>
					</Canvas>
				</div>

				{/* Search and filters */}
				<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
					<div className="space-y-2">
						<label className="font-medium text-sm">Szukaj suplementu</label>
						<div className="relative">
							<Search className="absolute top-2.5 left-2 h-4 w-4 text-gray-400" />
							<Input
								placeholder="Wpisz nazwę suplementu..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="pl-8"
							/>
						</div>
					</div>

					<div className="space-y-2">
						<label className="font-medium text-sm">Kategoria</label>
						<Select
							value={selectedCategory}
							onValueChange={setSelectedCategory}
						>
							<SelectTrigger>
								<SelectValue placeholder="Wybierz kategorię" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">Wszystkie</SelectItem>
								{categories.map((category) => (
									<SelectItem key={category} value={category}>
										{category}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="space-y-2">
						<label className="font-medium text-sm">Dawka (mg)</label>
						<Slider
							value={[currentDosage]}
							onValueChange={([value]) => {
								setCurrentDosage(value || 0);
								if (selectedSupplement) {
									onDosageChange?.(selectedSupplement.id, value || 0);
								}
							}}
							min={0}
							max={1000}
							step={50}
							className="w-full"
						/>
						<div className="text-center text-gray-500 text-xs">
							{currentDosage} mg
						</div>
					</div>
				</div>

				{/* Supplement grid */}
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
					{filteredSupplements.map((supplement) => (
						<SupplementCard
							key={supplement.id}
							supplement={supplement}
							isSelected={selectedSupplement?.id === supplement.id}
							currentDosage={currentDosage}
							onSelect={() => {
								setSelectedSupplement(supplement);
								onSupplementSelect?.(supplement);
							}}
						/>
					))}
				</div>

				{/* Selected supplement details */}
				{selectedSupplement && (
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<div
									className="h-4 w-4 rounded-full"
									style={{
										backgroundColor: selectedSupplement.color.getHexString(),
									}}
								/>
								{selectedSupplement.polishName}
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							{/* Evidence and safety */}
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<div className="flex items-center gap-2">
										<Shield className="h-4 w-4" />
										<span className="font-medium text-sm">Poziom dowodów</span>
									</div>
									<Badge
										variant={
											selectedSupplement.evidenceLevel === "A"
												? "default"
												: selectedSupplement.evidenceLevel === "B"
													? "secondary"
													: "outline"
										}
									>
										Poziom {selectedSupplement.evidenceLevel}
									</Badge>
								</div>

								<div className="space-y-2">
									<div className="flex items-center gap-2">
										<Star className="h-4 w-4" />
										<span className="font-medium text-sm">Bezpieczeństwo</span>
									</div>
									<div className="flex items-center gap-1">
										{Array.from({ length: 5 }).map((_, i) => (
											<div
												key={i}
												className={`h-2 w-2 rounded-full ${
													i < selectedSupplement.safetyRating
														? "bg-green-500"
														: "bg-gray-300"
												}`}
											/>
										))}
									</div>
								</div>
							</div>

							{/* Dosage recommendation */}
							<div className="space-y-2">
								<div className="flex items-center justify-between">
									<span className="font-medium text-sm">Zalecana dawka</span>
									<Badge variant="outline">
										{selectedSupplement.dosage.recommended}{" "}
										{selectedSupplement.dosage.unit}
									</Badge>
								</div>
								<div className="flex items-center gap-2">
									<span className="text-gray-500 text-xs">
										{selectedSupplement.dosage.min}-
										{selectedSupplement.dosage.max}{" "}
										{selectedSupplement.dosage.unit}
									</span>
								</div>
							</div>

							{/* Interactions */}
							{showInteractions &&
								selectedSupplement.interactions.length > 0 && (
									<div className="space-y-2">
										<div className="flex items-center gap-2">
											<AlertTriangle className="h-4 w-4 text-orange-500" />
											<span className="font-medium text-sm">Interakcje</span>
										</div>
										{selectedSupplement.interactions.map((interaction) => (
											<Alert key={interaction.id}>
												<AlertTriangle className="h-4 w-4" />
												<AlertDescription className="text-xs">
													<strong>{interaction.supplementName}:</strong>{" "}
													{interaction.polishDescription}
												</AlertDescription>
											</Alert>
										))}
									</div>
								)}

							{/* Effects */}
							{showEffects && (
								<div className="space-y-2">
									<div className="flex items-center gap-2">
										<Zap className="h-4 w-4 text-blue-500" />
										<span className="font-medium text-sm">Efekty</span>
									</div>
									<div className="space-y-2">
										{selectedSupplement.effects.map((effect) => (
											<div key={effect.id} className="flex items-center gap-2">
												<span className="text-sm">{effect.polishName}</span>
												<div className="flex-1">
													<Progress
														value={effect.intensity * 100}
														className="h-1"
													/>
												</div>
												<Badge variant="outline" className="text-xs">
													{Math.round(effect.evidenceStrength * 100)}%
												</Badge>
											</div>
										))}
									</div>
								</div>
							)}

							{/* Research citations */}
							<div className="flex items-center gap-2">
								<Info className="h-4 w-4" />
								<span className="text-sm">
									Badania naukowe: {selectedSupplement.researchCitations}{" "}
									cytowań
								</span>
							</div>
						</CardContent>
					</Card>
				)}
			</CardContent>
		</Card>
	);
};

// 3D Scene for supplement explorer
interface SupplementExplorerSceneProps {
	supplements: SupplementData[];
	selectedSupplement: SupplementData | null;
	currentDosage: number;
	onSupplementSelect: (supplement: SupplementData) => void;
}

const SupplementExplorerScene: React.FC<SupplementExplorerSceneProps> = ({
	supplements,
	selectedSupplement,
	currentDosage,
	onSupplementSelect,
}) => {
	const groupRef = useRef<Group>(null);

	return (
		<group ref={groupRef}>
			{/* Lighting */}
			<ambientLight intensity={0.6} />
			<pointLight position={[10, 10, 10]} intensity={0.8} />
			<pointLight position={[-10, -10, -10]} intensity={0.4} color="#4444ff" />

			{/* Supplement molecules */}
			{supplements.map((supplement) => (
				<SupplementMolecule
					key={supplement.id}
					supplement={supplement}
					isSelected={selectedSupplement?.id === supplement.id}
					currentDosage={currentDosage}
					onSelect={() => onSupplementSelect(supplement)}
				/>
			))}

			{/* Category labels */}
			<CategoryLabels supplements={supplements} />
		</group>
	);
};

// Supplement molecule component
interface SupplementMoleculeProps {
	supplement: SupplementData;
	isSelected: boolean;
	currentDosage: number;
	onSelect: () => void;
}

const SupplementMolecule: React.FC<SupplementMoleculeProps> = ({
	supplement,
	isSelected,
	currentDosage,
	onSelect,
}) => {
	const meshRef = useRef<Mesh>(null);

	const { scale, color } = useSpring({
		scale: isSelected ? 1.5 : 1,
		color: isSelected
			? supplement.color.clone().lerp(new Color("#FFD700"), 0.3)
			: supplement.color,
		config: { tension: 300, friction: 50 },
	});

	useFrame(() => {
		if (meshRef.current) {
			meshRef.current.position.copy(supplement.position);
		}
	});

	return (
		<group>
			<animated.mesh ref={meshRef} scale={scale} onClick={onSelect}>
				<sphereGeometry args={[0.3, 16, 16]} />
				<meshStandardMaterial
					color={color}
					emissive={isSelected ? color.getHex() : 0x000000}
					emissiveIntensity={isSelected ? 0.3 : 0}
				/>
			</animated.mesh>

			{/* Dosage effect visualization */}
			{currentDosage > 0 && (
				<mesh position={supplement.position}>
					<sphereGeometry args={[0.5, 12, 12]} />
					<meshBasicMaterial
						color={supplement.color}
						transparent
						opacity={Math.min(0.3, currentDosage / 1000)}
					/>
				</mesh>
			)}

			{/* Supplement label */}
			<Html
				position={[
					supplement.position.x,
					supplement.position.y + 0.5,
					supplement.position.z,
				]}
			>
				<div
					className={`cursor-pointer rounded px-1 py-0.5 text-xs ${
						isSelected ? "bg-blue-500 text-white" : "bg-black/70 text-white"
					}`}
					onClick={onSelect}
				>
					{supplement.polishName}
				</div>
			</Html>

			{/* Evidence level indicator */}
			<Html
				position={[
					supplement.position.x,
					supplement.position.y - 0.5,
					supplement.position.z,
				]}
			>
				<Badge
					variant={
						supplement.evidenceLevel === "A"
							? "default"
							: supplement.evidenceLevel === "B"
								? "secondary"
								: "outline"
					}
					className="text-xs"
				>
					{supplement.evidenceLevel}
				</Badge>
			</Html>
		</group>
	);
};

// Category labels component
interface CategoryLabelsProps {
	supplements: SupplementData[];
}

const CategoryLabels: React.FC<CategoryLabelsProps> = ({ supplements }) => {
	const categories = useMemo(() => {
		const categoryGroups: { [key: string]: Vector3[] } = {};

		supplements.forEach((supplement) => {
			if (!categoryGroups[supplement.category]) {
				categoryGroups[supplement.category] = [];
			}
			categoryGroups[supplement.category].push(supplement.position);
		});

		return Object.entries(categoryGroups).map(([category, positions]) => {
			const averagePosition = positions
				.reduce(
					(sum, pos) =>
						new Vector3(sum.x + pos.x, sum.y + pos.y, sum.z + pos.z),
					new Vector3(0, 0, 0),
				)
				.divideScalar(positions.length);

			return {
				category,
				position: averagePosition,
			};
		});
	}, [supplements]);

	return (
		<group>
			{categories.map(({ category, position }) => (
				<Html
					key={category}
					position={[position.x, position.y + 1, position.z]}
				>
					<div className="rounded bg-black/70 px-2 py-1 text-sm text-white">
						{category}
					</div>
				</Html>
			))}
		</group>
	);
};

// Supplement card component
interface SupplementCardProps {
	supplement: SupplementData;
	isSelected: boolean;
	currentDosage: number;
	onSelect: () => void;
}

const SupplementCard: React.FC<SupplementCardProps> = ({
	supplement,
	isSelected,
	currentDosage,
	onSelect,
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
						style={{ backgroundColor: supplement.color.getHexString() }}
					/>
					<div className="flex-1">
						<h3 className="font-medium text-sm">{supplement.polishName}</h3>
						<p className="text-gray-500 text-xs">{supplement.category}</p>
					</div>
					<div className="text-right">
						<Badge
							variant={
								supplement.evidenceLevel === "A"
									? "default"
									: supplement.evidenceLevel === "B"
										? "secondary"
										: "outline"
							}
						>
							{supplement.evidenceLevel}
						</Badge>
						<div className="mt-1 text-gray-500 text-xs">
							{supplement.researchCitations} badań
						</div>
					</div>
				</div>

				{/* Safety rating */}
				<div className="mt-2 flex items-center gap-2">
					<span className="text-xs">Bezpieczeństwo:</span>
					<div className="flex items-center gap-1">
						{Array.from({ length: 5 }).map((_, i) => (
							<div
								key={i}
								className={`h-1.5 w-1.5 rounded-full ${
									i < supplement.safetyRating ? "bg-green-500" : "bg-gray-300"
								}`}
							/>
						))}
					</div>
				</div>

				{/* Interactions warning */}
				{supplement.interactions.length > 0 && (
					<div className="mt-2 flex items-center gap-1">
						<AlertTriangle className="h-3 w-3 text-orange-500" />
						<span className="text-orange-600 text-xs">
							{supplement.interactions.length} interakcji
						</span>
					</div>
				)}
			</CardContent>
		</Card>
	);
};

export default InteractiveSupplementExplorer;
