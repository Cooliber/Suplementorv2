"use client";

import type {
	AnatomicalStructure,
	SupplementEffect,
} from "@/types/body-systems";
import { Cylinder, Html, Sphere, Torus } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import { type Group, type Mesh, Vector3 } from "three";
import { InteractiveOrgan } from "./InteractiveOrgan";

interface RespiratorySystemProps {
	selectedSupplements?: string[];
	animationSpeed?: number;
	showBreathing?: boolean;
	showGasExchange?: boolean;
	showLabels?: boolean;
	onOrganClick?: (organId: string) => void;
}

// Detailed respiratory structure data
const respiratoryStructures: AnatomicalStructure[] = [
	// Lungs
	{
		id: "left-lung",
		name: "Left Lung",
		polishName: "Lewe płuco",
		position: [-0.6, 0.5, 0.5],
		color: "#2563EB",
		size: 0.8,
		category: {
			id: "respiratory",
			name: "Respiratory System",
			polishName: "Układ oddechowy",
			color: "#2563EB",
			icon: "Wind",
			description: "Facilitates gas exchange between blood and air",
			polishDescription: "Umożliwia wymianę gazową między krwią a powietrzem",
			organs: ["Lungs", "Trachea", "Bronchi", "Diaphragm"],
			polishOrgans: ["Płuca", "Tchawica", "Oskrzela", "Przepona"],
		},
		system: "respiratory",
		polishSystem: "Układ oddechowy",
	},
	{
		id: "right-lung",
		name: "Right Lung",
		polishName: "Prawe płuco",
		position: [0.6, 0.5, 0.5],
		color: "#2563EB",
		size: 0.8,
		category: {
			id: "respiratory",
			name: "Respiratory System",
			polishName: "Układ oddechowy",
			color: "#2563EB",
			icon: "Wind",
			description: "Facilitates gas exchange between blood and air",
			polishDescription: "Umożliwia wymianę gazową między krwią a powietrzem",
			organs: ["Lungs", "Trachea", "Bronchi", "Diaphragm"],
			polishOrgans: ["Płuca", "Tchawica", "Oskrzela", "Przepona"],
		},
		system: "respiratory",
		polishSystem: "Układ oddechowy",
	},

	// Trachea and bronchi
	{
		id: "trachea",
		name: "Trachea",
		polishName: "Tchawica",
		position: [0, 0.8, 0.8],
		color: "#2563EB",
		size: 0.4,
		category: {
			id: "respiratory",
			name: "Respiratory System",
			polishName: "Układ oddechowy",
			color: "#2563EB",
			icon: "Wind",
			description: "Facilitates gas exchange between blood and air",
			polishDescription: "Umożliwia wymianę gazową między krwią a powietrzem",
			organs: ["Lungs", "Trachea", "Bronchi", "Diaphragm"],
			polishOrgans: ["Płuca", "Tchawica", "Oskrzela", "Przepona"],
		},
		system: "respiratory",
		polishSystem: "Układ oddechowy",
	},

	// Diaphragm
	{
		id: "diaphragm",
		name: "Diaphragm",
		polishName: "Przepona",
		position: [0, -0.2, 0.5],
		color: "#2563EB",
		size: 0.9,
		category: {
			id: "respiratory",
			name: "Respiratory System",
			polishName: "Układ oddechowy",
			color: "#2563EB",
			icon: "Wind",
			description: "Facilitates gas exchange between blood and air",
			polishDescription: "Umożliwia wymianę gazową między krwią a powietrzem",
			organs: ["Lungs", "Trachea", "Bronchi", "Diaphragm"],
			polishOrgans: ["Płuca", "Tchawica", "Oskrzela", "Przepona"],
		},
		system: "respiratory",
		polishSystem: "Układ oddechowy",
	},
];

// Alveolus component for gas exchange visualization
const Alveolus: React.FC<{
	position: [number, number, number];
	showGasExchange?: boolean;
	oxygenLevel?: number;
}> = ({ position, showGasExchange = false, oxygenLevel = 0.8 }) => {
	const alveolusRef = useRef<Mesh>(null);

	useFrame((state) => {
		if (!alveolusRef.current || !showGasExchange) return;

		// Pulsing animation for gas exchange
		const time = state.clock.getElapsedTime();
		const pulse = Math.sin(time * 3) * 0.3 + 1;
		alveolusRef.current.scale.setScalar(pulse);

		// Color based on oxygen level
		const hue = oxygenLevel * 120; // 0 = red, 120 = green
		alveolusRef.current.material.color.setHSL(hue / 360, 0.8, 0.5);
	});

	return (
		<group position={position}>
			<Sphere ref={alveolusRef} args={[0.05, 8, 8]}>
				<meshStandardMaterial
					color="#10B981"
					emissive="#10B981"
					emissiveIntensity={showGasExchange ? 0.3 : 0.1}
					transparent
					opacity={0.7}
				/>
			</Sphere>

			{/* Capillary network around alveolus */}
			{showGasExchange &&
				Array.from({ length: 6 }).map((_, index) => (
					<Sphere
						key={index}
						args={[0.02, 6, 6]}
						position={[
							Math.cos((index * Math.PI * 2) / 6) * 0.08,
							Math.sin((index * Math.PI * 2) / 6) * 0.08,
							0,
						]}
					>
						<meshStandardMaterial
							color="#DC2626"
							emissive="#DC2626"
							emissiveIntensity={0.2}
							transparent
							opacity={0.6}
						/>
					</Sphere>
				))}
		</group>
	);
};

// Bronchiole component for airway visualization
const Bronchiole: React.FC<{
	startPosition: [number, number, number];
	endPosition: [number, number, number];
	showAnimation?: boolean;
}> = ({ startPosition, endPosition, showAnimation = false }) => {
	const bronchioleRef = useRef<Mesh>(null);

	useFrame((state) => {
		if (!bronchioleRef.current || !showAnimation) return;

		// Subtle movement animation
		const time = state.clock.getElapsedTime();
		const offset = Math.sin(time * 2) * 0.01;
		bronchioleRef.current.position.y += offset;
	});

	// Calculate midpoint and direction for cylinder
	const midpoint: [number, number, number] = [
		(startPosition[0] + endPosition[0]) / 2,
		(startPosition[1] + endPosition[1]) / 2,
		(startPosition[2] + endPosition[2]) / 2,
	];

	const direction = new Vector3(...endPosition).sub(
		new Vector3(...startPosition),
	);
	const length = direction.length();
	const angle = Math.atan2(direction.x, direction.z);

	return (
		<Cylinder
			ref={bronchioleRef}
			args={[0.03, 0.03, length, 8]}
			position={midpoint}
			rotation={[0, angle, Math.PI / 2]}
		>
			<meshStandardMaterial
				color="#1D4ED8"
				emissive="#1D4ED8"
				emissiveIntensity={showAnimation ? 0.2 : 0}
				transparent
				opacity={0.8}
			/>
		</Cylinder>
	);
};

// Individual respiratory organ component
const RespiratoryOrgan: React.FC<{
	organ: AnatomicalStructure;
	isSelected: boolean;
	supplementEffects: SupplementEffect[];
	animationSpeed: number;
	showBreathing: boolean;
	showGasExchange: boolean;
	showLabels: boolean;
	onClick: () => void;
	onHover: (hovered: boolean) => void;
}> = ({
	organ,
	isSelected,
	supplementEffects,
	animationSpeed,
	showBreathing,
	showGasExchange,
	showLabels,
	onClick,
	onHover,
}) => {
	const organRef = useRef<Group>(null);
	const [hovered, setHovered] = useState(false);

	useFrame((state) => {
		if (!organRef.current) return;

		// Breathing animation
		if (
			showBreathing &&
			(organ.name.toLowerCase().includes("lung") ||
				organ.name.toLowerCase().includes("płuc"))
		) {
			const time = state.clock.getElapsedTime();
			const breathingCycle = Math.sin(time * animationSpeed) * 0.5 + 0.5;
			organRef.current.scale.y = 1 + breathingCycle * 0.3;
			organRef.current.position.y = organ.position[1] + breathingCycle * 0.1;
		}

		// Diaphragm contraction animation
		if (
			showBreathing &&
			(organ.name.toLowerCase().includes("diaphragm") ||
				organ.name.toLowerCase().includes("przepona"))
		) {
			const time = state.clock.getElapsedTime();
			const breathingCycle = Math.sin(time * animationSpeed) * 0.5 + 0.5;
			organRef.current.position.y = organ.position[1] - breathingCycle * 0.2;
		}

		// Supplement effects
		if (supplementEffects.length > 0) {
			const time = state.clock.getElapsedTime();
			const effect = supplementEffects[0];
			const pulse =
				Math.sin(time * (effect?.visualEffect?.pulseSpeed || 1)) * 0.5 + 0.5;
			organRef.current.scale.x = 1 + pulse * 0.1 * (effect?.intensity || 1);
			organRef.current.scale.z = 1 + pulse * 0.1 * (effect?.intensity || 1);
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

	// Render different respiratory organ shapes
	const renderRespiratoryShape = () => {
		if (
			organ.name.toLowerCase().includes("lung") ||
			organ.name.toLowerCase().includes("płuc")
		) {
			return (
				<Sphere args={[organ.size * 0.7, 16, 16]}>
					<meshStandardMaterial
						color={organ.color}
						emissive={isSelected || hovered ? organ.color : "#000000"}
						emissiveIntensity={isSelected ? 0.3 : hovered ? 0.1 : 0}
						transparent
						opacity={0.8}
					/>
				</Sphere>
			);
		}

		if (
			organ.name.toLowerCase().includes("trachea") ||
			organ.name.toLowerCase().includes("tchawica")
		) {
			return (
				<Cylinder
					args={[organ.size * 0.3, organ.size * 0.2, organ.size * 1.5, 12]}
				>
					<meshStandardMaterial
						color={organ.color}
						emissive={isSelected || hovered ? organ.color : "#000000"}
						emissiveIntensity={isSelected ? 0.3 : hovered ? 0.1 : 0}
						transparent
						opacity={0.8}
					/>
				</Cylinder>
			);
		}

		if (
			organ.name.toLowerCase().includes("diaphragm") ||
			organ.name.toLowerCase().includes("przepona")
		) {
			return (
				<Torus args={[organ.size * 0.6, organ.size * 0.1, 8, 16]}>
					<meshStandardMaterial
						color={organ.color}
						emissive={isSelected || hovered ? organ.color : "#000000"}
						emissiveIntensity={isSelected ? 0.3 : hovered ? 0.1 : 0}
						transparent
						opacity={0.8}
					/>
				</Torus>
			);
		}

		// Default shape
		return (
			<Sphere args={[organ.size, 12, 12]}>
				<meshStandardMaterial
					color={organ.color}
					emissive={isSelected || hovered ? organ.color : "#000000"}
					emissiveIntensity={isSelected ? 0.3 : hovered ? 0.1 : 0}
					transparent
					opacity={0.8}
				/>
			</Sphere>
		);
	};

	return (
		<group ref={organRef} position={organ.position}>
			{renderRespiratoryShape()}

			{/* Alveoli for lung structures */}
			{showGasExchange &&
				(organ.name.toLowerCase().includes("lung") ||
					organ.name.toLowerCase().includes("płuc")) && (
					<group>
						{/* Add alveoli clusters */}
						{Array.from({ length: 8 }).map((_, index) => (
							<Alveolus
								key={index}
								position={[
									organ.size * 0.5 * Math.cos((index * Math.PI * 2) / 8),
									organ.size * 0.3 * Math.sin((index * Math.PI * 2) / 8),
									0,
								]}
								showGasExchange={showGasExchange}
								oxygenLevel={0.8}
							/>
						))}
					</group>
				)}

			{/* Organ label */}
			{showLabels && (
				<Html position={[0, organ.size + 0.3, 0]} center>
					<div className="rounded border bg-white/90 px-2 py-1 font-medium text-xs shadow-lg backdrop-blur-sm">
						{organ.polishName}
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
							(organ.size + 0.2),
						0,
						Math.sin((index * Math.PI * 2) / supplementEffects.length) *
							(organ.size + 0.2),
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
				<Sphere args={[organ.size + 0.1, 16, 16]}>
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

// Main respiratory system component
export const RespiratorySystem: React.FC<RespiratorySystemProps> = ({
	selectedSupplements = [],
	animationSpeed = 1,
	showBreathing = true,
	showGasExchange = true,
	showLabels = true,
	onOrganClick,
}) => {
	const [selectedOrgan, setSelectedOrgan] = useState<string | null>(null);
	const [hoveredOrgan, setHoveredOrgan] = useState<string | null>(null);

	const handleOrganClick = (organId: string) => {
		setSelectedOrgan(organId);
		onOrganClick?.(organId);
	};

	const handleOrganHover = (organId: string | null) => {
		setHoveredOrgan(organId);
	};

	return (
		<group>
			{/* Render all respiratory organs */}
			{respiratoryStructures.map((organ) => (
				<RespiratoryOrgan
					key={organ.id}
					organ={organ}
					isSelected={selectedOrgan === organ.id}
					supplementEffects={[]} // TODO: Add supplement effects based on selectedSupplements
					animationSpeed={animationSpeed}
					showBreathing={showBreathing}
					showGasExchange={showGasExchange}
					showLabels={showLabels}
					onClick={() => handleOrganClick(organ.id)}
					onHover={(hovered) => handleOrganHover(hovered ? organ.id : null)}
				/>
			))}

			{/* Bronchial tree connections */}
			{showGasExchange && (
				<>
					{/* Main bronchi from trachea */}
					<Bronchiole
						startPosition={[0, 0.8, 0.8]}
						endPosition={[-0.3, 0.6, 0.6]}
						showAnimation={showBreathing}
					/>
					<Bronchiole
						startPosition={[0, 0.8, 0.8]}
						endPosition={[0.3, 0.6, 0.6]}
						showAnimation={showBreathing}
					/>

					{/* Secondary bronchi */}
					<Bronchiole
						startPosition={[-0.3, 0.6, 0.6]}
						endPosition={[-0.5, 0.4, 0.5]}
						showAnimation={showBreathing}
					/>
					<Bronchiole
						startPosition={[0.3, 0.6, 0.6]}
						endPosition={[0.5, 0.4, 0.5]}
						showAnimation={showBreathing}
					/>
				</>
			)}

			{/* Gas exchange indicators */}
			{showGasExchange && (
				<>
					{/* Oxygen intake indicator */}
					<Sphere args={[0.05, 8, 8]} position={[0, 1.2, 0.8]}>
						<meshStandardMaterial
							color="#10B981"
							emissive="#10B981"
							emissiveIntensity={0.5}
							transparent
							opacity={0.8}
						/>
					</Sphere>

					{/* CO2 output indicator */}
					<Sphere args={[0.05, 8, 8]} position={[0, 1.0, 0.8]}>
						<meshStandardMaterial
							color="#EF4444"
							emissive="#EF4444"
							emissiveIntensity={0.3}
							transparent
							opacity={0.6}
						/>
					</Sphere>
				</>
			)}
		</group>
	);
};
