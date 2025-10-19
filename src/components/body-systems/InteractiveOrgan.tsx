"use client";

import type {
	AnatomicalStructure,
	SupplementEffect,
} from "@/types/body-systems";
import { Box, Cylinder, Html, Sphere, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import { type Mesh, Vector3 } from "three";

interface InteractiveOrganProps {
	organ: AnatomicalStructure;
	isSelected: boolean;
	isHovered: boolean;
	supplementEffects: SupplementEffect[];
	animationSpeed: number;
	showLabels: boolean;
	onClick: () => void;
	onHover: (hovered: boolean) => void;
	children?: React.ReactNode;
}

export const InteractiveOrgan: React.FC<InteractiveOrganProps> = ({
	organ,
	isSelected,
	isHovered,
	supplementEffects,
	animationSpeed,
	showLabels,
	onClick,
	onHover,
	children,
}) => {
	const meshRef = useRef<Mesh>(null);
	const [localHovered, setLocalHovered] = useState(false);

	const handlePointerOver = () => {
		setLocalHovered(true);
		onHover(true);
	};

	const handlePointerOut = () => {
		setLocalHovered(false);
		onHover(false);
	};

	useFrame((state) => {
		if (!meshRef.current) return;

		// Base rotation animation
		meshRef.current.rotation.y += 0.005 * animationSpeed;

		// Supplement effects animation
		if (supplementEffects.length > 0) {
			const time = state.clock.getElapsedTime();
			const effect = supplementEffects[0]; // Use first effect for animation
			const pulseSpeed = effect?.visualEffect?.pulseSpeed ?? 1;
			const pulse = Math.sin(time * pulseSpeed) * 0.5 + 0.5;
			const intensity = effect?.intensity ?? 1;

			meshRef.current.scale.setScalar(
				organ.size * (1 + pulse * 0.2 * intensity),
			);
		}

		// Hover effect
		if (localHovered) {
			meshRef.current.position.y =
				organ.position[1] + Math.sin(state.clock.getElapsedTime() * 3) * 0.05;
		} else {
			meshRef.current.position.set(...organ.position);
		}
	});

	// Determine visual color based on state
	const getVisualColor = () => {
		if (supplementEffects.length > 0) {
			return supplementEffects[0].visualEffect.color;
		}
		return organ.color;
	};

	const visualColor = getVisualColor();
	const emissiveIntensity = isSelected ? 0.3 : localHovered ? 0.1 : 0;

	// Render different shapes based on organ type
	const renderOrganShape = () => {
		const baseProps = {
			ref: meshRef,
			onClick,
			onPointerOver: handlePointerOver,
			onPointerOut: handlePointerOut,
		};

		switch (organ.category.id) {
			case "skeletal":
				// Bones are typically cylindrical or box-shaped
				if (
					organ.name.toLowerCase().includes("skull") ||
					organ.name.toLowerCase().includes("czaszka")
				) {
					return (
						<Sphere {...baseProps} args={[organ.size * 0.8, 16, 16]}>
							<meshStandardMaterial
								color={visualColor}
								emissive={visualColor}
								emissiveIntensity={emissiveIntensity}
								transparent
								opacity={0.8}
							/>
						</Sphere>
					);
				}
				return (
					<Cylinder
						{...baseProps}
						args={[organ.size * 0.3, organ.size * 0.3, organ.size * 1.5, 8]}
					>
						<meshStandardMaterial
							color={visualColor}
							emissive={visualColor}
							emissiveIntensity={emissiveIntensity}
							transparent
							opacity={0.8}
						/>
					</Cylinder>
				);

			case "muscular":
				// Muscles are more organic, rounded shapes
				return (
					<Sphere {...baseProps} args={[organ.size * 0.9, 12, 12]}>
						<meshStandardMaterial
							color={visualColor}
							emissive={visualColor}
							emissiveIntensity={emissiveIntensity}
							transparent
							opacity={0.8}
						/>
					</Sphere>
				);

			case "respiratory":
				// Lungs and respiratory organs are more complex shapes
				if (
					organ.name.toLowerCase().includes("lung") ||
					organ.name.toLowerCase().includes("płuc")
				) {
					return (
						<group>
							<Sphere
								{...baseProps}
								args={[organ.size * 0.7, 16, 16]}
								position={[0, 0, 0]}
							>
								<meshStandardMaterial
									color={visualColor}
									emissive={visualColor}
									emissiveIntensity={emissiveIntensity}
									transparent
									opacity={0.8}
								/>
							</Sphere>
							{/* Add bronchial tree representation */}
							<Sphere args={[organ.size * 0.3, 8, 8]} position={[0, 0.5, 0]}>
								<meshStandardMaterial
									color={visualColor}
									emissive={visualColor}
									emissiveIntensity={emissiveIntensity * 0.5}
									transparent
									opacity={0.6}
								/>
							</Sphere>
						</group>
					);
				}
				return (
					<Cylinder
						{...baseProps}
						args={[organ.size * 0.4, organ.size * 0.2, organ.size, 12]}
					>
						<meshStandardMaterial
							color={visualColor}
							emissive={visualColor}
							emissiveIntensity={emissiveIntensity}
							transparent
							opacity={0.8}
						/>
					</Cylinder>
				);

			case "nervous":
				// Nervous system organs are elongated
				return (
					<Cylinder
						{...baseProps}
						args={[organ.size * 0.2, organ.size * 0.2, organ.size * 2, 8]}
					>
						<meshStandardMaterial
							color={visualColor}
							emissive={visualColor}
							emissiveIntensity={emissiveIntensity}
							transparent
							opacity={0.8}
						/>
					</Cylinder>
				);

			case "endocrine":
				// Endocrine glands are typically small and rounded
				return (
					<Sphere {...baseProps} args={[organ.size * 0.6, 10, 10]}>
						<meshStandardMaterial
							color={visualColor}
							emissive={visualColor}
							emissiveIntensity={emissiveIntensity}
							transparent
							opacity={0.8}
						/>
					</Sphere>
				);

			case "reproductive":
				// Reproductive organs vary in shape
				if (
					organ.name.toLowerCase().includes("test") ||
					organ.name.toLowerCase().includes("jądr")
				) {
					return (
						<Sphere {...baseProps} args={[organ.size * 0.5, 8, 8]}>
							<meshStandardMaterial
								color={visualColor}
								emissive={visualColor}
								emissiveIntensity={emissiveIntensity}
								transparent
								opacity={0.8}
							/>
						</Sphere>
					);
				}
				return (
					<Box
						{...baseProps}
						args={[organ.size * 0.8, organ.size * 0.6, organ.size * 0.4]}
					>
						<meshStandardMaterial
							color={visualColor}
							emissive={visualColor}
							emissiveIntensity={emissiveIntensity}
							transparent
							opacity={0.8}
						/>
					</Box>
				);

			case "integumentary":
				// Skin is represented as a surface layer
				return (
					<Box
						{...baseProps}
						args={[organ.size * 1.2, organ.size * 0.1, organ.size * 1.2]}
					>
						<meshStandardMaterial
							color={visualColor}
							emissive={visualColor}
							emissiveIntensity={emissiveIntensity}
							transparent
							opacity={0.7}
						/>
					</Box>
				);

			default:
				// Default to sphere for unknown organ types
				return (
					<Sphere {...baseProps} args={[organ.size, 16, 16]}>
						<meshStandardMaterial
							color={visualColor}
							emissive={visualColor}
							emissiveIntensity={emissiveIntensity}
							transparent
							opacity={0.8}
						/>
					</Sphere>
				);
		}
	};

	return (
		<group>
			{renderOrganShape()}

			{/* Organ label */}
			{showLabels && (
				<Html
					position={[0, organ.size + 0.3, 0]}
					center
					style={{
						pointerEvents: "none",
						userSelect: "none",
					}}
				>
					<div className="rounded-md border bg-white/90 px-2 py-1 font-medium text-xs shadow-lg backdrop-blur-sm">
						{organ.polishName}
					</div>
				</Html>
			)}

			{/* Supplement effect indicators */}
			{supplementEffects.map((effect, index) => (
				<Sphere
					key={effect.supplementId}
					args={[0.1, 8, 8]}
					position={[
						Math.cos((index * Math.PI * 2) / supplementEffects.length) *
							(organ.size + 0.3),
						0,
						Math.sin((index * Math.PI * 2) / supplementEffects.length) *
							(organ.size + 0.3),
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
				<Sphere args={[organ.size + 0.1, 16, 16]} position={[0, 0, 0]}>
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

			{/* Children components (for complex organs) */}
			{children}
		</group>
	);
};
