"use client";

import {
	PARTICLE_SYSTEMS,
	type ParticleSystem as ParticleSystemType,
} from "@/lib/animations/physiological-animations";
import { PointMaterial, Points } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import type React from "react";
import { useEffect, useMemo, useRef } from "react";
import {
	type BufferGeometry,
	Color,
	Float32BufferAttribute,
	type Points as ThreePoints,
	Vector3,
} from "three";

interface ParticleSystemProps {
	systemId: string;
	organPositions?: Record<string, Vector3>;
	isActive: boolean;
	intensity?: number;
	onParticleClick?: (particleIndex: number) => void;
}

interface Particle {
	position: Vector3;
	velocity: Vector3;
	life: number;
	maxLife: number;
	size: number;
	color: Color;
	organId?: string;
}

export const ParticleSystem: React.FC<ParticleSystemProps> = ({
	systemId,
	organPositions = {},
	isActive,
	intensity = 1,
	onParticleClick,
}) => {
	const pointsRef = useRef<ThreePoints>(null);
	const particlesRef = useRef<Particle[]>([]);
	const lastEmissionRef = useRef<number>(0);
	const animationFrameRef = useRef<number>();

	const particleSystem = useMemo(
		() => PARTICLE_SYSTEMS.find((system) => system.id === systemId),
		[systemId],
	);

	// Initialize particles
	useEffect(() => {
		if (!particleSystem || !isActive) return;

		particlesRef.current = [];
		for (let i = 0; i < particleSystem.particleCount; i++) {
			particlesRef.current.push(createParticle(particleSystem, organPositions));
		}
	}, [particleSystem, isActive, organPositions]);

	// Animation loop
	useFrame((state, delta) => {
		if (!isActive || !particleSystem || particlesRef.current.length === 0)
			return;

		const currentTime = state.clock.elapsedTime * 1000;

		// Emit new particles
		if (
			currentTime - lastEmissionRef.current >=
			1000 / (particleSystem.emissionRate * intensity)
		) {
			for (
				let i = 0;
				i < Math.ceil((particleSystem.particleCount / 60) * intensity);
				i++
			) {
				particlesRef.current.push(
					createParticle(particleSystem, organPositions),
				);
			}
			lastEmissionRef.current = currentTime;
		}

		// Update existing particles
		updateParticles(particlesRef.current, delta, particleSystem);

		// Remove expired particles
		particlesRef.current = particlesRef.current.filter(
			(particle) => particle.life > 0,
		);

		// Update geometry
		updateGeometry(pointsRef.current, particlesRef.current);
	});

	if (!particleSystem || !isActive) return null;

	return (
		<Points ref={pointsRef} onClick={onParticleClick}>
			<PointMaterial
				transparent
				size={particleSystem.particleSize * (2 - intensity * 0.5)}
				sizeAttenuation={true}
				vertexColors
				opacity={0.8}
			/>
		</Points>
	);
};

function createParticle(
	system: ParticleSystemType,
	organPositions: Record<string, Vector3>,
): Particle {
	const organId =
		system.affectedOrgans[
			Math.floor(Math.random() * system.affectedOrgans.length)
		];
	const organPosition = organPositions[organId] || new Vector3(0, 0, 0);

	// Start particles near the target organ
	const position = organPosition
		.clone()
		.add(
			new Vector3(
				(Math.random() - 0.5) * system.spread,
				(Math.random() - 0.5) * system.spread,
				(Math.random() - 0.5) * system.spread,
			),
		);

	const velocity = system.velocity
		.clone()
		.add(
			new Vector3(
				(Math.random() - 0.5) * 0.2,
				(Math.random() - 0.5) * 0.2,
				(Math.random() - 0.5) * 0.2,
			),
		);

	return {
		position,
		velocity,
		life: system.lifetime,
		maxLife: system.lifetime,
		size: system.particleSize,
		color: new Color(system.particleColor),
		organId,
	};
}

function updateParticles(
	particles: Particle[],
	deltaTime: number,
	system: ParticleSystemType,
) {
	particles.forEach((particle) => {
		// Update position
		particle.position.add(
			particle.velocity.clone().multiplyScalar(deltaTime * 60),
		);

		// Update life
		particle.life -= deltaTime * 1000;

		// Fade out as life decreases
		const lifeRatio = particle.life / particle.maxLife;
		particle.color.setHSL(
			particle.color.getHSL({ h: 0, s: 0, l: 0 }).h,
			particle.color.getHSL({ h: 0, s: 0, l: 0 }).s,
			Math.max(0, lifeRatio * 0.5),
		);
	});
}

function updateGeometry(points: ThreePoints | null, particles: Particle[]) {
	if (!points || particles.length === 0) return;

	const positions = new Float32Array(particles.length * 3);
	const colors = new Float32Array(particles.length * 3);
	const sizes = new Float32Array(particles.length);

	particles.forEach((particle, i) => {
		const i3 = i * 3;

		// Position
		positions[i3] = particle.position.x;
		positions[i3 + 1] = particle.position.y;
		positions[i3 + 2] = particle.position.z;

		// Color
		colors[i3] = particle.color.r;
		colors[i3 + 1] = particle.color.g;
		colors[i3 + 2] = particle.color.b;

		// Size (fade with life)
		const lifeRatio = particle.life / particle.maxLife;
		sizes[i] = particle.size * lifeRatio;
	});

	const geometry = points.geometry as BufferGeometry;
	geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
	geometry.setAttribute("color", new Float32BufferAttribute(colors, 3));
	geometry.setAttribute("size", new Float32BufferAttribute(sizes, 1));

	geometry.attributes.position.needsUpdate = true;
	geometry.attributes.color.needsUpdate = true;
	geometry.attributes.size.needsUpdate = true;
}

// Preset particle system configurations for different physiological processes
export const PARTICLE_PRESETS = {
	bloodFlow: {
		color: "#DC2626",
		size: 0.02,
		speed: 0.5,
		count: 50,
		lifetime: 8000,
	},
	neuralSignals: {
		color: "#8B5CF6",
		size: 0.01,
		speed: 1.0,
		count: 30,
		lifetime: 2000,
	},
	hormoneRelease: {
		color: "#059669",
		size: 0.015,
		speed: 0.2,
		count: 20,
		lifetime: 10000,
	},
	cellularActivity: {
		color: "#F59E0B",
		size: 0.008,
		speed: 0,
		count: 40,
		lifetime: 3000,
	},
} as const;
