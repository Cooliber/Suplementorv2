"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Cylinder, Html, OrbitControls, Sphere, Text } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Atom, Eye, EyeOff, RotateCcw, ZoomIn, ZoomOut } from "lucide-react";
import type React from "react";
import { useMemo, useRef, useState } from "react";
import {
	BufferGeometry,
	Color,
	type Group,
	Matrix4,
	type Mesh,
	MeshStandardMaterial,
	Vector3,
} from "three";

interface MoleculeViewerProps {
	moleculeData?: MoleculeStructure;
	supplementName?: string;
	polishSupplementName?: string;
	autoRotate?: boolean;
	showLabels?: boolean;
	className?: string;
}

interface MoleculeStructure {
	id: string;
	name: string;
	formula: string;
	atoms: Atom[];
	bonds: Bond[];
	molecularWeight: number;
	description: string;
}

interface Atom {
	id: string;
	element: string;
	position: Vector3;
	color: Color;
	radius: number;
	label: string;
}

interface Bond {
	id: string;
	atom1Id: string;
	atom2Id: string;
	bondType: "single" | "double" | "triple" | "aromatic";
	length: number;
}

const CREATINE_MOLECULE: MoleculeStructure = {
	id: "creatine",
	name: "Creatine",
	formula: "C4H9N3O2",
	molecularWeight: 131.13,
	description:
		"Molecule showing creatine structure with carbon, nitrogen, oxygen, and hydrogen atoms",
	atoms: [
		{
			id: "c1",
			element: "C",
			position: new Vector3(0, 0, 0),
			color: new Color("#909090"),
			radius: 0.7,
			label: "C1",
		},
		{
			id: "c2",
			element: "C",
			position: new Vector3(1.2, 0.8, 0),
			color: new Color("#909090"),
			radius: 0.7,
			label: "C2",
		},
		{
			id: "c3",
			element: "C",
			position: new Vector3(2.4, 0, 0),
			color: new Color("#909090"),
			radius: 0.7,
			label: "C3",
		},
		{
			id: "c4",
			element: "C",
			position: new Vector3(3.6, 0.8, 0),
			color: new Color("#909090"),
			radius: 0.7,
			label: "C4",
		},
		{
			id: "n1",
			element: "N",
			position: new Vector3(1.2, -0.8, 0),
			color: new Color("#3050F8"),
			radius: 0.65,
			label: "N1",
		},
		{
			id: "n2",
			element: "N",
			position: new Vector3(2.4, 1.6, 0),
			color: new Color("#3050F8"),
			radius: 0.65,
			label: "N2",
		},
		{
			id: "n3",
			element: "N",
			position: new Vector3(3.6, -0.8, 0),
			color: new Color("#3050F8"),
			radius: 0.65,
			label: "N3",
		},
		{
			id: "o1",
			element: "O",
			position: new Vector3(0, 1.6, 0),
			color: new Color("#FF0D0D"),
			radius: 0.6,
			label: "O1",
		},
		{
			id: "o2",
			element: "O",
			position: new Vector3(4.8, 0, 0),
			color: new Color("#FF0D0D"),
			radius: 0.6,
			label: "O2",
		},
	],
	bonds: [
		{
			id: "c1-c2",
			atom1Id: "c1",
			atom2Id: "c2",
			bondType: "single",
			length: 1.2,
		},
		{
			id: "c2-c3",
			atom1Id: "c2",
			atom2Id: "c3",
			bondType: "single",
			length: 1.2,
		},
		{
			id: "c3-c4",
			atom1Id: "c3",
			atom2Id: "c4",
			bondType: "single",
			length: 1.2,
		},
		{
			id: "c1-n1",
			atom1Id: "c1",
			atom2Id: "n1",
			bondType: "single",
			length: 1.2,
		},
		{
			id: "c2-n2",
			atom1Id: "c2",
			atom2Id: "n2",
			bondType: "double",
			length: 1.2,
		},
		{
			id: "c4-n3",
			atom1Id: "c4",
			atom2Id: "n3",
			bondType: "single",
			length: 1.2,
		},
		{
			id: "c1-o1",
			atom1Id: "c1",
			atom2Id: "o1",
			bondType: "double",
			length: 1.2,
		},
		{
			id: "c4-o2",
			atom1Id: "c4",
			atom2Id: "o2",
			bondType: "double",
			length: 1.2,
		},
	],
};

export const MoleculeViewer: React.FC<MoleculeViewerProps> = ({
	moleculeData = CREATINE_MOLECULE,
	supplementName = "Creatine",
	polishSupplementName = "Kreatyna",
	autoRotate = true,
	showLabels = true,
	className = "",
}) => {
	const [isRotating, setIsRotating] = useState(autoRotate);
	const [showBonds, setShowBonds] = useState(true);
	const [showAtomLabels, setShowAtomLabels] = useState(showLabels);
	const [selectedAtom, setSelectedAtom] = useState<string | null>(null);
	const [viewMode, setViewMode] = useState<
		"ball-stick" | "space-fill" | "wireframe"
	>("ball-stick");

	return (
		<Card className={`w-full ${className}`}>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Atom className="h-5 w-5" />
					Przeglądarka cząsteczek 3D
				</CardTitle>
				<div className="space-y-1">
					<p className="font-medium text-sm">
						{polishSupplementName} - struktura molekularna
					</p>
					<div className="flex items-center gap-2">
						<Badge variant="outline">Wzór: {moleculeData.formula}</Badge>
						<Badge variant="secondary">
							Masa: {moleculeData.molecularWeight} g/mol
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
						<MoleculeScene
							moleculeData={moleculeData}
							isRotating={isRotating}
							showBonds={showBonds}
							showAtomLabels={showAtomLabels}
							selectedAtom={selectedAtom}
							viewMode={viewMode}
							onAtomSelect={(atomId) => setSelectedAtom(atomId)}
						/>
						<OrbitControls
							enablePan={true}
							enableZoom={true}
							enableRotate={!isRotating}
						/>
					</Canvas>

					{/* Controls overlay */}
					<div className="absolute top-4 right-4 space-y-2">
						<Button
							size="sm"
							variant={isRotating ? "default" : "outline"}
							onClick={() => setIsRotating(!isRotating)}
						>
							<RotateCcw className="h-4 w-4" />
						</Button>

						<Button
							size="sm"
							variant="outline"
							onClick={() => setShowBonds(!showBonds)}
						>
							{showBonds ? (
								<Eye className="h-4 w-4" />
							) : (
								<EyeOff className="h-4 w-4" />
							)}
						</Button>
					</div>
				</div>

				{/* View mode selector */}
				<div className="flex items-center gap-2">
					<span className="text-sm">Tryb widoku:</span>
					<Select
						value={viewMode}
						onValueChange={(value: any) => setViewMode(value)}
					>
						<SelectTrigger className="w-32">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="ball-stick">Kule i pręty</SelectItem>
							<SelectItem value="space-fill">
								Wypełnienie przestrzenne
							</SelectItem>
							<SelectItem value="wireframe">Szkielet</SelectItem>
						</SelectContent>
					</Select>
				</div>

				{/* Atom labels toggle */}
				<label className="flex items-center gap-2">
					<input
						type="checkbox"
						checked={showAtomLabels}
						onChange={(e) => setShowAtomLabels(e.target.checked)}
						className="rounded"
					/>
					<span className="text-sm">Pokaż etykiety atomów</span>
				</label>

				{/* Molecule information */}
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm">Informacje o cząsteczce</CardTitle>
					</CardHeader>
					<CardContent className="pt-0">
						<div className="space-y-2 text-sm">
							<div className="flex justify-between">
								<span>Nazwa:</span>
								<span className="font-medium">{moleculeData.name}</span>
							</div>
							<div className="flex justify-between">
								<span>Wzór sumaryczny:</span>
								<span className="font-medium">{moleculeData.formula}</span>
							</div>
							<div className="flex justify-between">
								<span>Masa cząsteczkowa:</span>
								<span className="font-medium">
									{moleculeData.molecularWeight} g/mol
								</span>
							</div>
							<div className="flex justify-between">
								<span>Liczba atomów:</span>
								<span className="font-medium">{moleculeData.atoms.length}</span>
							</div>
							<div className="flex justify-between">
								<span>Liczba wiązań:</span>
								<span className="font-medium">{moleculeData.bonds.length}</span>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Atom details */}
				{selectedAtom && (
					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm">Wybrany atom</CardTitle>
						</CardHeader>
						<CardContent className="pt-0">
							{(() => {
								const atom = moleculeData.atoms.find(
									(a) => a.id === selectedAtom,
								);
								if (!atom) return null;

								return (
									<div className="space-y-2 text-sm">
										<div className="flex justify-between">
											<span>Pierwiastek:</span>
											<span className="font-medium">{atom.element}</span>
										</div>
										<div className="flex justify-between">
											<span>Identyfikator:</span>
											<span className="font-medium">{atom.label}</span>
										</div>
										<div className="flex justify-between">
											<span>Promień van der Waalsa:</span>
											<span className="font-medium">{atom.radius} Å</span>
										</div>
										<div className="flex items-center gap-2">
											<span>Kolor:</span>
											<div
												className="h-4 w-4 rounded border"
												style={{ backgroundColor: atom.color.getHexString() }}
											/>
										</div>
									</div>
								);
							})()}
						</CardContent>
					</Card>
				)}

				{/* Legend */}
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm">Legenda atomów</CardTitle>
					</CardHeader>
					<CardContent className="pt-0">
						<div className="grid grid-cols-2 gap-2 text-sm">
							{Array.from(
								new Set(moleculeData.atoms.map((atom) => atom.element)),
							).map((element) => {
								const atom = moleculeData.atoms.find(
									(a) => a.element === element,
								);
								if (!atom) return null;

								return (
									<div key={element} className="flex items-center gap-2">
										<div
											className="h-3 w-3 rounded-full"
											style={{ backgroundColor: atom.color.getHexString() }}
										/>
										<span>{element}</span>
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

// 3D Scene for molecule visualization
interface MoleculeSceneProps {
	moleculeData: MoleculeStructure;
	isRotating: boolean;
	showBonds: boolean;
	showAtomLabels: boolean;
	selectedAtom: string | null;
	viewMode: "ball-stick" | "space-fill" | "wireframe";
	onAtomSelect: (atomId: string) => void;
}

const MoleculeScene: React.FC<MoleculeSceneProps> = ({
	moleculeData,
	isRotating,
	showBonds,
	showAtomLabels,
	selectedAtom,
	viewMode,
	onAtomSelect,
}) => {
	const groupRef = useRef<Group>(null);

	// Auto-rotation
	useFrame((state, delta) => {
		if (isRotating && groupRef.current) {
			groupRef.current.rotation.y += delta * 0.5;
		}
	});

	return (
		<group ref={groupRef}>
			{/* Lighting */}
			<ambientLight intensity={0.6} />
			<pointLight position={[10, 10, 10]} intensity={0.8} />
			<pointLight position={[-10, -10, -10]} intensity={0.4} color="#4444ff" />

			{/* Atoms */}
			{moleculeData.atoms.map((atom) => (
				<AtomComponent
					key={atom.id}
					atom={atom}
					viewMode={viewMode}
					isSelected={selectedAtom === atom.id}
					showLabel={showAtomLabels}
					onSelect={() => onAtomSelect(atom.id)}
				/>
			))}

			{/* Bonds */}
			{showBonds && (
				<BondComponents bonds={moleculeData.bonds} atoms={moleculeData.atoms} />
			)}

			{/* Molecule info */}
			<Html position={[0, -3, 0]}>
				<div className="rounded bg-black/70 px-2 py-1 text-sm text-white">
					{moleculeData.name} ({moleculeData.formula})
				</div>
			</Html>
		</group>
	);
};

// Atom component
interface AtomComponentProps {
	atom: Atom;
	viewMode: "ball-stick" | "space-fill" | "wireframe";
	isSelected: boolean;
	showLabel: boolean;
	onSelect: () => void;
}

const AtomComponent: React.FC<AtomComponentProps> = ({
	atom,
	viewMode,
	isSelected,
	showLabel,
	onSelect,
}) => {
	const meshRef = useRef<Mesh>(null);

	const { scale, emissive } = useSpring({
		scale: isSelected ? 1.3 : 1,
		emissive: isSelected ? atom.color.getHex() : 0x000000,
		config: { tension: 300, friction: 50 },
	});

	useFrame(() => {
		if (meshRef.current) {
			meshRef.current.position.copy(atom.position);
		}
	});

	const getRadius = () => {
		switch (viewMode) {
			case "space-fill":
				return atom.radius;
			case "ball-stick":
				return atom.radius * 0.3;
			case "wireframe":
				return 0.02;
			default:
				return atom.radius * 0.3;
		}
	};

	return (
		<group>
			<animated.mesh ref={meshRef} scale={scale} onClick={onSelect}>
				<sphereGeometry args={[getRadius(), 16, 16]} />
				<meshStandardMaterial
					color={atom.color}
					emissive={emissive}
					emissiveIntensity={isSelected ? 0.3 : 0}
					wireframe={viewMode === "wireframe"}
				/>
			</animated.mesh>

			{/* Atom label */}
			{showLabel && (
				<Html
					position={[
						atom.position.x,
						atom.position.y + atom.radius + 0.2,
						atom.position.z,
					]}
				>
					<div
						className={`cursor-pointer rounded px-1 py-0.5 text-xs ${
							isSelected ? "bg-blue-500 text-white" : "bg-black/70 text-white"
						}`}
						onClick={onSelect}
					>
						{atom.element}
					</div>
				</Html>
			)}

			{/* Selection ring */}
			{isSelected && (
				<mesh position={atom.position}>
					<ringGeometry args={[atom.radius + 0.1, atom.radius + 0.2, 16]} />
					<meshBasicMaterial color="#FFD700" transparent opacity={0.8} />
				</mesh>
			)}
		</group>
	);
};

// Bond components
interface BondComponentsProps {
	bonds: Bond[];
	atoms: Atom[];
}

const BondComponents: React.FC<BondComponentsProps> = ({ bonds, atoms }) => {
	return (
		<group>
			{bonds.map((bond) => {
				const atom1 = atoms.find((a) => a.id === bond.atom1Id);
				const atom2 = atoms.find((a) => a.id === bond.atom2Id);

				if (!atom1 || !atom2) return null;

				return (
					<BondComponent
						key={bond.id}
						bond={bond}
						atom1={atom1}
						atom2={atom2}
					/>
				);
			})}
		</group>
	);
};

// Individual bond component
interface BondComponentProps {
	bond: Bond;
	atom1: Atom;
	atom2: Atom;
}

const BondComponent: React.FC<BondComponentProps> = ({
	bond,
	atom1,
	atom2,
}) => {
	const midPoint = atom1.position.clone().lerp(atom2.position, 0.5);
	const distance = atom1.position.distanceTo(atom2.position);
	const direction = atom2.position.clone().sub(atom1.position).normalize();

	// Calculate rotation to align cylinder with bond direction
	const up = new Vector3(0, 1, 0);
	const quaternion = new Matrix4()
		.lookAt(new Vector3(0, 0, 0), direction, up)
		.extractRotation(new Matrix4());

	return (
		<group>
			{/* Main bond cylinder */}
			<mesh position={midPoint} quaternion={quaternion}>
				<cylinderGeometry
					args={[
						0.05, // radius top
						0.05, // radius bottom
						distance, // height
						8,
					]}
				/>
				<meshStandardMaterial color="#FFFFFF" transparent opacity={0.8} />
			</mesh>

			{/* Double bond visualization */}
			{bond.bondType === "double" && (
				<>
					<mesh
						position={midPoint.clone().add(new Vector3(0.1, 0, 0))}
						quaternion={quaternion}
					>
						<cylinderGeometry args={[0.03, 0.03, distance, 8]} />
						<meshStandardMaterial color="#FFFFFF" transparent opacity={0.6} />
					</mesh>
					<mesh
						position={midPoint.clone().add(new Vector3(-0.1, 0, 0))}
						quaternion={quaternion}
					>
						<cylinderGeometry args={[0.03, 0.03, distance, 8]} />
						<meshStandardMaterial color="#FFFFFF" transparent opacity={0.6} />
					</mesh>
				</>
			)}

			{/* Triple bond visualization */}
			{bond.bondType === "triple" && (
				<>
					<mesh
						position={midPoint.clone().add(new Vector3(0.15, 0, 0))}
						quaternion={quaternion}
					>
						<cylinderGeometry args={[0.02, 0.02, distance, 8]} />
						<meshStandardMaterial color="#FFFFFF" transparent opacity={0.4} />
					</mesh>
					<mesh
						position={midPoint.clone().add(new Vector3(-0.15, 0, 0))}
						quaternion={quaternion}
					>
						<cylinderGeometry args={[0.02, 0.02, distance, 8]} />
						<meshStandardMaterial color="#FFFFFF" transparent opacity={0.4} />
					</mesh>
				</>
			)}
		</group>
	);
};

export default MoleculeViewer;
