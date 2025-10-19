"use client";

import type {
	AnatomicalStructure,
	SupplementEffect,
} from "@/types/body-systems";
import { Cylinder, Html, Sphere } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import { type Group, type Mesh, Vector3 } from "three";
import { InteractiveOrgan } from "./InteractiveOrgan";

interface MuscularSystemProps {
	selectedSupplements?: string[];
	animationSpeed?: number;
	showContraction?: boolean;
	showLabels?: boolean;
	onMuscleClick?: (muscleId: string) => void;
}

// Detailed muscular structure data
const muscularStructures: AnatomicalStructure[] = [
	// Upper body muscles
	{
		id: "biceps-brachii",
		name: "Biceps Brachii",
		polishName: "Mięsień dwugłowy ramienia",
		position: [1.0, 0.3, 0],
		color: "#DC2626",
		size: 0.6,
		category: {
			id: "muscular",
			name: "Muscular System",
			polishName: "Układ mięśniowy",
			color: "#DC2626",
			icon: "Activity",
			description: "Enables movement and maintains posture",
			polishDescription: "Umożliwia ruch i utrzymuje postawę",
			organs: ["Skeletal muscles", "Smooth muscles", "Cardiac muscle"],
			polishOrgans: [
				"Mięśnie szkieletowe",
				"Mięśnie gładkie",
				"Mięsień sercowy",
			],
		},
		system: "muscular",
		polishSystem: "Układ mięśniowy",
	},
	{
		id: "triceps-brachii",
		name: "Triceps Brachii",
		polishName: "Mięsień trójgłowy ramienia",
		position: [1.0, -0.1, 0],
		color: "#DC2626",
		size: 0.5,
		category: {
			id: "muscular",
			name: "Muscular System",
			polishName: "Układ mięśniowy",
			color: "#DC2626",
			icon: "Activity",
			description: "Enables movement and maintains posture",
			polishDescription: "Umożliwia ruch i utrzymuje postawę",
			organs: ["Skeletal muscles", "Smooth muscles", "Cardiac muscle"],
			polishOrgans: [
				"Mięśnie szkieletowe",
				"Mięśnie gładkie",
				"Mięsień sercowy",
			],
		},
		system: "muscular",
		polishSystem: "Układ mięśniowy",
	},
	{
		id: "pectoralis-major",
		name: "Pectoralis Major",
		polishName: "Mięsień piersiowy większy",
		position: [0.3, 0.4, 0.8],
		color: "#DC2626",
		size: 0.7,
		category: {
			id: "muscular",
			name: "Muscular System",
			polishName: "Układ mięśniowy",
			color: "#DC2626",
			icon: "Activity",
			description: "Enables movement and maintains posture",
			polishDescription: "Umożliwia ruch i utrzymuje postawę",
			organs: ["Skeletal muscles", "Smooth muscles", "Cardiac muscle"],
			polishOrgans: [
				"Mięśnie szkieletowe",
				"Mięśnie gładkie",
				"Mięsień sercowy",
			],
		},
		system: "muscular",
		polishSystem: "Układ mięśniowy",
	},

	// Core muscles
	{
		id: "rectus-abdominis",
		name: "Rectus Abdominis",
		polishName: "Mięsień prosty brzucha",
		position: [0, 0.2, 1.2],
		color: "#DC2626",
		size: 0.6,
		category: {
			id: "muscular",
			name: "Muscular System",
			polishName: "Układ mięśniowy",
			color: "#DC2626",
			icon: "Activity",
			description: "Enables movement and maintains posture",
			polishDescription: "Umożliwia ruch i utrzymuje postawę",
			organs: ["Skeletal muscles", "Smooth muscles", "Cardiac muscle"],
			polishOrgans: [
				"Mięśnie szkieletowe",
				"Mięśnie gładkie",
				"Mięsień sercowy",
			],
		},
		system: "muscular",
		polishSystem: "Układ mięśniowy",
	},

	// Lower body muscles
	{
		id: "quadriceps",
		name: "Quadriceps Femoris",
		polishName: "Mięsień czworogłowy uda",
		position: [0.2, -0.8, 0.3],
		color: "#DC2626",
		size: 0.8,
		category: {
			id: "muscular",
			name: "Muscular System",
			polishName: "Układ mięśniowy",
			color: "#DC2626",
			icon: "Activity",
			description: "Enables movement and maintains posture",
			polishDescription: "Umożliwia ruch i utrzymuje postawę",
			organs: ["Skeletal muscles", "Smooth muscles", "Cardiac muscle"],
			polishOrgans: [
				"Mięśnie szkieletowe",
				"Mięśnie gładkie",
				"Mięsień sercowy",
			],
		},
		system: "muscular",
		polishSystem: "Układ mięśniowy",
	},
	{
		id: "hamstrings",
		name: "Hamstrings",
		polishName: "Mięśnie kulszowo-goleniowe",
		position: [0.2, -1.0, -0.3],
		color: "#DC2626",
		size: 0.7,
		category: {
			id: "muscular",
			name: "Muscular System",
			polishName: "Układ mięśniowy",
			color: "#DC2626",
			icon: "Activity",
			description: "Enables movement and maintains posture",
			polishDescription: "Umożliwia ruch i utrzymuje postawę",
			organs: ["Skeletal muscles", "Smooth muscles", "Cardiac muscle"],
			polishOrgans: [
				"Mięśnie szkieletowe",
				"Mięśnie gładkie",
				"Mięsień sercowy",
			],
		},
		system: "muscular",
		polishSystem: "Układ mięśniowy",
	},
	{
		id: "gastrocnemius",
		name: "Gastrocnemius",
		polishName: "Mięsień brzuchaty łydki",
		position: [0.1, -1.8, 0],
		color: "#DC2626",
		size: 0.6,
		category: {
			id: "muscular",
			name: "Muscular System",
			polishName: "Układ mięśniowy",
			color: "#DC2626",
			icon: "Activity",
			description: "Enables movement and maintains posture",
			polishDescription: "Umożliwia ruch i utrzymuje postawę",
			organs: ["Skeletal muscles", "Smooth muscles", "Cardiac muscle"],
			polishOrgans: [
				"Mięśnie szkieletowe",
				"Mięśnie gładkie",
				"Mięsień sercowy",
			],
		},
		system: "muscular",
		polishSystem: "Układ mięśniowy",
	},

	// Back muscles
	{
		id: "latissimus-dorsi",
		name: "Latissimus Dorsi",
		polishName: "Mięsień najszerszy grzbietu",
		position: [-0.3, 0, 0.5],
		color: "#DC2626",
		size: 0.8,
		category: {
			id: "muscular",
			name: "Muscular System",
			polishName: "Układ mięśniowy",
			color: "#DC2626",
			icon: "Activity",
			description: "Enables movement and maintains posture",
			polishDescription: "Umożliwia ruch i utrzymuje postawę",
			organs: ["Skeletal muscles", "Smooth muscles", "Cardiac muscle"],
			polishOrgans: [
				"Mięśnie szkieletowe",
				"Mięśnie gładkie",
				"Mięsień sercowy",
			],
		},
		system: "muscular",
		polishSystem: "Układ mięśniowy",
	},
];

// Muscle fiber component for detailed visualization
const MuscleFiber: React.FC<{
	position: [number, number, number];
	length: number;
	contracted?: boolean;
	animationSpeed?: number;
}> = ({ position, length, contracted = false, animationSpeed = 1 }) => {
	const fiberRef = useRef<Mesh>(null);

	useFrame((state) => {
		if (!fiberRef.current) return;

		// Contraction animation
		const time = state.clock.getElapsedTime();
		const contractionCycle = Math.sin(time * animationSpeed * 2) * 0.5 + 0.5;
		const currentLength = contracted
			? length * (0.7 + contractionCycle * 0.3)
			: length * (0.8 + contractionCycle * 0.2);

		fiberRef.current.scale.y = currentLength / length;
		fiberRef.current.position.y = position[1] + (length - currentLength) / 2;
	});

	return (
		<Cylinder
			ref={fiberRef}
			args={[0.02, 0.02, length, 6]}
			position={position}
			rotation={[0, 0, Math.PI / 2]}
		>
			<meshStandardMaterial
				color="#B91C1C"
				emissive="#B91C1C"
				emissiveIntensity={contracted ? 0.4 : 0.1}
				transparent
				opacity={0.8}
			/>
		</Cylinder>
	);
};

// Individual muscle component
const Muscle: React.FC<{
	muscle: AnatomicalStructure;
	isSelected: boolean;
	supplementEffects: SupplementEffect[];
	animationSpeed: number;
	showContraction: boolean;
	showLabels: boolean;
	onClick: () => void;
	onHover: (hovered: boolean) => void;
}> = ({
	muscle,
	isSelected,
	supplementEffects,
	animationSpeed,
	showContraction,
	showLabels,
	onClick,
	onHover,
}) => {
	const muscleRef = useRef<Group>(null);
	const [hovered, setHovered] = useState(false);

	useFrame((state) => {
		if (!muscleRef.current) return;

		// Gentle pulsing animation
		const time = state.clock.getElapsedTime();
		const pulse = Math.sin(time * animationSpeed) * 0.1 + 1;
		muscleRef.current.scale.setScalar(pulse);

		// Supplement effects
		if (supplementEffects.length > 0) {
			const effect = supplementEffects[0];
			const effectPulse =
				Math.sin(time * (effect?.visualEffect?.pulseSpeed || 1)) * 0.5 + 0.5;
			muscleRef.current.scale.setScalar(
				pulse * (1 + effectPulse * 0.2 * (effect?.intensity || 1)),
			);
		}
	});

	const handlePointerOver = () => {
		setHovered(true);
		onHover(true);
	};

	const handlePointerOut = () => {
		setHovered(false);
		onHover(false);
	};

	// Render muscle as organic shape
	const renderMuscleShape = () => {
		return (
			<Sphere args={[muscle.size * 0.8, 12, 12]}>
				<meshStandardMaterial
					color={muscle.color}
					emissive={isSelected || hovered ? muscle.color : "#000000"}
					emissiveIntensity={isSelected ? 0.3 : hovered ? 0.1 : 0}
					transparent
					opacity={0.8}
				/>
			</Sphere>
		);
	};

	return (
		<group ref={muscleRef} position={muscle.position}>
			{renderMuscleShape()}

			{/* Muscle fibers visualization */}
			{showContraction && (
				<group>
					{/* Add multiple muscle fibers */}
					{Array.from({ length: 5 }).map((_, index) => (
						<MuscleFiber
							key={index}
							position={[
								muscle.size * 0.6 * Math.cos((index * Math.PI * 2) / 5),
								0,
								muscle.size * 0.6 * Math.sin((index * Math.PI * 2) / 5),
							]}
							length={muscle.size * 0.8}
							contracted={isSelected}
							animationSpeed={animationSpeed}
						/>
					))}
				</group>
			)}

			{/* Muscle label */}
			{showLabels && (
				<Html position={[0, muscle.size + 0.3, 0]} center>
					<div className="rounded border bg-white/90 px-2 py-1 font-medium text-xs shadow-lg backdrop-blur-sm">
						{muscle.polishName}
					</div>
				</Html>
			)}

			{/* Supplement effect indicators */}
			{supplementEffects.map((effect, index) => (
				<Sphere
					key={effect.supplementId}
					args={[0.08, 8, 8]}
					position={[
						Math.cos((index * Math.PI * 2) / supplementEffects.length) *
							(muscle.size + 0.2),
						0,
						Math.sin((index * Math.PI * 2) / supplementEffects.length) *
							(muscle.size + 0.2),
					]}
				>
					<meshStandardMaterial
						color={effect.visualEffect.color}
						emissive={effect.visualEffect.color}
						emissiveIntensity={effect.visualEffect.glowIntensity}
					/>
				</Sphere>
			))}

			{/* Selection indicator */}
			{isSelected && (
				<Sphere args={[muscle.size + 0.1, 16, 16]}>
					<meshStandardMaterial
						color="#10B981"
						emissive="#10B981"
						emissiveIntensity={0.2}
						transparent
						opacity={0.3}
						wireframe
					/>
				</Sphere>
			)}
		</group>
	);
};

// Main muscular system component
export const MuscularSystem: React.FC<MuscularSystemProps> = ({
	selectedSupplements = [],
	animationSpeed = 1,
	showContraction = true,
	showLabels = true,
	onMuscleClick,
}) => {
	const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null);
	const [hoveredMuscle, setHoveredMuscle] = useState<string | null>(null);

	const handleMuscleClick = (muscleId: string) => {
		setSelectedMuscle(muscleId);
		onMuscleClick?.(muscleId);
	};

	const handleMuscleHover = (muscleId: string | null) => {
		setHoveredMuscle(muscleId);
	};

	return (
		<group>
			{/* Render all muscles */}
			{muscularStructures.map((muscle) => (
				<Muscle
					key={muscle.id}
					muscle={muscle}
					isSelected={selectedMuscle === muscle.id}
					supplementEffects={[]} // TODO: Add supplement effects based on selectedSupplements
					animationSpeed={animationSpeed}
					showContraction={showContraction}
					showLabels={showLabels}
					onClick={() => handleMuscleClick(muscle.id)}
					onHover={(hovered) => handleMuscleHover(hovered ? muscle.id : null)}
				/>
			))}

			{/* Muscle connection lines (tendons and fascia) */}
			{showContraction && (
				<>
					{/* Shoulder to arm connection */}
					<Cylinder
						args={[0.03, 0.03, 0.4, 6]}
						position={[0.7, 0.5, 0]}
						rotation={[0, 0, Math.PI / 4]}
					>
						<meshStandardMaterial color="#F3F4F6" transparent opacity={0.4} />
					</Cylinder>

					{/* Hip to thigh connection */}
					<Cylinder
						args={[0.04, 0.04, 0.5, 6]}
						position={[0.2, -0.4, 0.3]}
						rotation={[0, 0, Math.PI / 6]}
					>
						<meshStandardMaterial color="#F3F4F6" transparent opacity={0.4} />
					</Cylinder>

					{/* Back muscle connections */}
					<Cylinder
						args={[0.03, 0.03, 0.6, 6]}
						position={[-0.3, 0.2, 0.5]}
						rotation={[0, Math.PI / 4, Math.PI / 8]}
					>
						<meshStandardMaterial color="#F3F4F6" transparent opacity={0.4} />
					</Cylinder>
				</>
			)}
		</group>
	);
};
