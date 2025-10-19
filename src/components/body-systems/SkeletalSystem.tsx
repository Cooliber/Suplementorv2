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

interface SkeletalSystemProps {
	selectedSupplements?: string[];
	animationSpeed?: number;
	showJoints?: boolean;
	showLabels?: boolean;
	onBoneClick?: (boneId: string) => void;
}

// Detailed skeletal structure data
const skeletalStructures: AnatomicalStructure[] = [
	// Skull
	{
		id: "skull",
		name: "Skull",
		polishName: "Czaszka",
		position: [0, 1.8, 0],
		color: "#E5E7EB",
		size: 0.8,
		category: {
			id: "skeletal",
			name: "Skeletal System",
			polishName: "Układ szkieletowy",
			color: "#E5E7EB",
			icon: "Bone",
			description: "Provides structure, support, and protection for the body",
			polishDescription: "Zapewnia strukturę, wsparcie i ochronę dla organizmu",
			organs: ["Skull", "Spine", "Ribs", "Pelvis", "Long bones"],
			polishOrgans: [
				"Czaszka",
				"Kręgosłup",
				"Żebra",
				"Miednica",
				"Kości długie",
			],
		},
		system: "skeletal",
		polishSystem: "Układ szkieletowy",
	},

	// Spine (vertebrae)
	{
		id: "cervical-spine",
		name: "Cervical Spine",
		polishName: "Kręgosłup szyjny",
		position: [0, 1.2, 0],
		color: "#E5E7EB",
		size: 0.4,
		category: {
			id: "skeletal",
			name: "Skeletal System",
			polishName: "Układ szkieletowy",
			color: "#E5E7EB",
			icon: "Bone",
			description: "Provides structure, support, and protection for the body",
			polishDescription: "Zapewnia strukturę, wsparcie i ochronę dla organizmu",
			organs: ["Skull", "Spine", "Ribs", "Pelvis", "Long bones"],
			polishOrgans: [
				"Czaszka",
				"Kręgosłup",
				"Żebra",
				"Miednica",
				"Kości długie",
			],
		},
		system: "skeletal",
		polishSystem: "Układ szkieletowy",
	},
	{
		id: "thoracic-spine",
		name: "Thoracic Spine",
		polishName: "Kręgosłup piersiowy",
		position: [0, 0.5, 0],
		color: "#E5E7EB",
		size: 0.5,
		category: {
			id: "skeletal",
			name: "Skeletal System",
			polishName: "Układ szkieletowy",
			color: "#E5E7EB",
			icon: "Bone",
			description: "Provides structure, support, and protection for the body",
			polishDescription: "Zapewnia strukturę, wsparcie i ochronę dla organizmu",
			organs: ["Skull", "Spine", "Ribs", "Pelvis", "Long bones"],
			polishOrgans: [
				"Czaszka",
				"Kręgosłup",
				"Żebra",
				"Miednica",
				"Kości długie",
			],
		},
		system: "skeletal",
		polishSystem: "Układ szkieletowy",
	},
	{
		id: "lumbar-spine",
		name: "Lumbar Spine",
		polishName: "Kręgosłup lędźwiowy",
		position: [0, -0.2, 0],
		color: "#E5E7EB",
		size: 0.5,
		category: {
			id: "skeletal",
			name: "Skeletal System",
			polishName: "Układ szkieletowy",
			color: "#E5E7EB",
			icon: "Bone",
			description: "Provides structure, support, and protection for the body",
			polishDescription: "Zapewnia strukturę, wsparcie i ochronę dla organizmu",
			organs: ["Skull", "Spine", "Ribs", "Pelvis", "Long bones"],
			polishOrgans: [
				"Czaszka",
				"Kręgosłup",
				"Żebra",
				"Miednica",
				"Kości długie",
			],
		},
		system: "skeletal",
		polishSystem: "Układ szkieletowy",
	},

	// Rib cage
	{
		id: "rib-cage",
		name: "Rib Cage",
		polishName: "Klatka piersiowa",
		position: [0, 0.3, 0.8],
		color: "#E5E7EB",
		size: 0.9,
		category: {
			id: "skeletal",
			name: "Skeletal System",
			polishName: "Układ szkieletowy",
			color: "#E5E7EB",
			icon: "Bone",
			description: "Provides structure, support, and protection for the body",
			polishDescription: "Zapewnia strukturę, wsparcie i ochronę dla organizmu",
			organs: ["Skull", "Spine", "Ribs", "Pelvis", "Long bones"],
			polishOrgans: [
				"Czaszka",
				"Kręgosłup",
				"Żebra",
				"Miednica",
				"Kości długie",
			],
		},
		system: "skeletal",
		polishSystem: "Układ szkieletowy",
	},

	// Pelvis
	{
		id: "pelvis",
		name: "Pelvis",
		polishName: "Miednica",
		position: [0, -0.8, 0],
		color: "#E5E7EB",
		size: 0.7,
		category: {
			id: "skeletal",
			name: "Skeletal System",
			polishName: "Układ szkieletowy",
			color: "#E5E7EB",
			icon: "Bone",
			description: "Provides structure, support, and protection for the body",
			polishDescription: "Zapewnia strukturę, wsparcie i ochronę dla organizmu",
			organs: ["Skull", "Spine", "Ribs", "Pelvis", "Long bones"],
			polishOrgans: [
				"Czaszka",
				"Kręgosłup",
				"Żebra",
				"Miednica",
				"Kości długie",
			],
		},
		system: "skeletal",
		polishSystem: "Układ szkieletowy",
	},

	// Long bones (arms and legs)
	{
		id: "humerus",
		name: "Humerus",
		polishName: "Kość ramienna",
		position: [1.2, 0.5, 0],
		color: "#E5E7EB",
		size: 0.6,
		category: {
			id: "skeletal",
			name: "Skeletal System",
			polishName: "Układ szkieletowy",
			color: "#E5E7EB",
			icon: "Bone",
			description: "Provides structure, support, and protection for the body",
			polishDescription: "Zapewnia strukturę, wsparcie i ochronę dla organizmu",
			organs: ["Skull", "Spine", "Ribs", "Pelvis", "Long bones"],
			polishOrgans: [
				"Czaszka",
				"Kręgosłup",
				"Żebra",
				"Miednica",
				"Kości długie",
			],
		},
		system: "skeletal",
		polishSystem: "Układ szkieletowy",
	},
	{
		id: "femur",
		name: "Femur",
		polishName: "Kość udowa",
		position: [0.3, -1.2, 0],
		color: "#E5E7EB",
		size: 0.8,
		category: {
			id: "skeletal",
			name: "Skeletal System",
			polishName: "Układ szkieletowy",
			color: "#E5E7EB",
			icon: "Bone",
			description: "Provides structure, support, and protection for the body",
			polishDescription: "Zapewnia strukturę, wsparcie i ochronę dla organizmu",
			organs: ["Skull", "Spine", "Ribs", "Pelvis", "Long bones"],
			polishOrgans: [
				"Czaszka",
				"Kręgosłup",
				"Żebra",
				"Miednica",
				"Kości długie",
			],
		},
		system: "skeletal",
		polishSystem: "Układ szkieletowy",
	},
];

// Joint component for articulation visualization
const Joint: React.FC<{
	position: [number, number, number];
	size?: number;
	showAnimation?: boolean;
}> = ({ position, size = 0.1, showAnimation = false }) => {
	const jointRef = useRef<Mesh>(null);

	useFrame((state) => {
		if (!jointRef.current || !showAnimation) return;

		// Subtle pulsing animation for joints
		const pulse = Math.sin(state.clock.getElapsedTime() * 2) * 0.1 + 1;
		jointRef.current.scale.setScalar(size * pulse);
	});

	return (
		<Sphere ref={jointRef} args={[size, 12, 12]} position={position}>
			<meshStandardMaterial
				color="#F59E0B"
				emissive="#F59E0B"
				emissiveIntensity={0.3}
				transparent
				opacity={0.8}
			/>
		</Sphere>
	);
};

// Individual bone component with detailed structure
const Bone: React.FC<{
	bone: AnatomicalStructure;
	isSelected: boolean;
	supplementEffects: SupplementEffect[];
	animationSpeed: number;
	showLabels: boolean;
	onClick: () => void;
	onHover: (hovered: boolean) => void;
}> = ({
	bone,
	isSelected,
	supplementEffects,
	animationSpeed,
	showLabels,
	onClick,
	onHover,
}) => {
	const boneRef = useRef<Group>(null);
	const [hovered, setHovered] = useState(false);

	useFrame((state) => {
		if (!boneRef.current) return;

		// Gentle rotation for visual interest
		boneRef.current.rotation.y += 0.002 * animationSpeed;

		// Supplement effects
		if (supplementEffects.length > 0) {
			const time = state.clock.getElapsedTime();
			const effect = supplementEffects[0];
			const pulse =
				Math.sin(time * (effect?.visualEffect?.pulseSpeed || 1)) * 0.5 + 0.5;
			boneRef.current.scale.setScalar(
				1 + pulse * 0.1 * (effect?.intensity || 1),
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

	// Render different bone shapes based on type
	const renderBoneShape = () => {
		if (bone.name.toLowerCase().includes("skull")) {
			return (
				<Sphere args={[bone.size * 0.8, 16, 16]}>
					<meshStandardMaterial
						color={bone.color}
						emissive={isSelected || hovered ? bone.color : "#000000"}
						emissiveIntensity={isSelected ? 0.2 : hovered ? 0.1 : 0}
						transparent
						opacity={0.9}
					/>
				</Sphere>
			);
		}

		if (
			bone.name.toLowerCase().includes("spine") ||
			bone.name.toLowerCase().includes("kręgosłup")
		) {
			return (
				<Cylinder args={[bone.size * 0.3, bone.size * 0.3, bone.size * 1.2, 8]}>
					<meshStandardMaterial
						color={bone.color}
						emissive={isSelected || hovered ? bone.color : "#000000"}
						emissiveIntensity={isSelected ? 0.2 : hovered ? 0.1 : 0}
						transparent
						opacity={0.9}
					/>
				</Cylinder>
			);
		}

		// Default cylindrical bone shape
		return (
			<Cylinder args={[bone.size * 0.2, bone.size * 0.2, bone.size, 8]}>
				<meshStandardMaterial
					color={bone.color}
					emissive={isSelected || hovered ? bone.color : "#000000"}
					emissiveIntensity={isSelected ? 0.2 : hovered ? 0.1 : 0}
					transparent
					opacity={0.9}
				/>
			</Cylinder>
		);
	};

	return (
		<group ref={boneRef} position={bone.position}>
			{renderBoneShape()}

			{/* Bone label */}
			{showLabels && (
				<Html position={[0, bone.size + 0.3, 0]} center>
					<div className="rounded border bg-white/90 px-2 py-1 font-medium text-xs shadow-lg backdrop-blur-sm">
						{bone.polishName}
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
							(bone.size + 0.2),
						0,
						Math.sin((index * Math.PI * 2) / supplementEffects.length) *
							(bone.size + 0.2),
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
				<Sphere args={[bone.size + 0.1, 16, 16]}>
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

// Main skeletal system component
export const SkeletalSystem: React.FC<SkeletalSystemProps> = ({
	selectedSupplements = [],
	animationSpeed = 1,
	showJoints = true,
	showLabels = true,
	onBoneClick,
}) => {
	const [selectedBone, setSelectedBone] = useState<string | null>(null);
	const [hoveredBone, setHoveredBone] = useState<string | null>(null);

	const handleBoneClick = (boneId: string) => {
		setSelectedBone(boneId);
		onBoneClick?.(boneId);
	};

	const handleBoneHover = (boneId: string | null) => {
		setHoveredBone(boneId);
	};

	return (
		<group>
			{/* Render all bones */}
			{skeletalStructures.map((bone) => (
				<Bone
					key={bone.id}
					bone={bone}
					isSelected={selectedBone === bone.id}
					supplementEffects={[]} // TODO: Add supplement effects based on selectedSupplements
					animationSpeed={animationSpeed}
					showLabels={showLabels}
					onClick={() => handleBoneClick(bone.id)}
					onHover={(hovered) => handleBoneHover(hovered ? bone.id : null)}
				/>
			))}

			{/* Joint connections */}
			{showJoints && (
				<>
					{/* Skull to cervical spine */}
					<Joint position={[0, 1.5, 0]} />
					<Joint position={[0, 1.35, 0]} />

					{/* Spine segments */}
					<Joint position={[0, 0.9, 0]} />
					<Joint position={[0, 0.25, 0]} />
					<Joint position={[0, -0.45, 0]} />

					{/* Rib connections */}
					<Joint position={[0, 0.3, 0.6]} />
					<Joint position={[0, 0.3, 1.0]} />

					{/* Pelvis connections */}
					<Joint position={[0, -0.55, 0]} />

					{/* Limb joints */}
					<Joint position={[1.2, 0.8, 0]} />
					<Joint position={[1.2, 0.2, 0]} />
					<Joint position={[0.3, -0.9, 0]} />
					<Joint position={[0.3, -1.5, 0]} />
				</>
			)}

			{/* Connection lines between joints (subtle visualization) */}
			{showJoints && (
				<>
					{/* Spine connections */}
					<Cylinder
						args={[0.02, 0.02, 0.3, 6]}
						position={[0, 1.425, 0]}
						rotation={[0, 0, Math.PI / 2]}
					>
						<meshStandardMaterial color="#D1D5DB" transparent opacity={0.3} />
					</Cylinder>
					<Cylinder
						args={[0.02, 0.02, 0.65, 6]}
						position={[0, 0.775, 0]}
						rotation={[0, 0, Math.PI / 2]}
					>
						<meshStandardMaterial color="#D1D5DB" transparent opacity={0.3} />
					</Cylinder>
					<Cylinder
						args={[0.02, 0.02, 0.7, 6]}
						position={[0, -0.125, 0]}
						rotation={[0, 0, Math.PI / 2]}
					>
						<meshStandardMaterial color="#D1D5DB" transparent opacity={0.3} />
					</Cylinder>
				</>
			)}
		</group>
	);
};
