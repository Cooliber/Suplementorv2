"use client";

import {
	AdditiveBlending,
	BufferGeometry,
	Color,
	DoubleSide,
	DynamicDrawUsage,
	Float32BufferAttribute,
	Group,
	InstancedMesh,
	Matrix4,
	Mesh,
	MeshBasicMaterial,
	Object3D,
	Points,
	ShaderMaterial,
	SphereGeometry,
	TextureLoader,
	Vector3,
} from "three";
import { ParticleSystem as BaseParticleSystem } from "./physiological-animations";

// Advanced particle physics configuration
export interface AdvancedParticleConfig {
	// Physics properties
	mass: number;
	charge: number;
	radius: number;
	damping: number;

	// Biological properties
	biologicalType:
		| "blood-cell"
		| "molecule"
		| "ion"
		| "hormone"
		| "neurotransmitter"
		| "immune-cell";
	halfLife: number; // seconds
	diffusionCoefficient: number; // m²/s

	// Visual properties
	color: Color;
	emissiveColor?: Color;
	opacity: number;
	size: number;

	// Interaction properties
	interactionRadius: number;
	bindingStrength: number;
	repulsionStrength: number;
}

// Advanced particle class with physics simulation
export class AdvancedParticle {
	public id: string;
	public position: Vector3;
	public velocity: Vector3;
	public acceleration: Vector3;
	public age: number;
	public maxAge: number;
	public config: AdvancedParticleConfig;

	// Physics state
	public force: Vector3;
	public mass: number;
	public charge: number;
	public radius: number;

	// Biological state
	public boundParticles: Set<string>;
	public bindingProgress: number;
	public active: boolean;

	// Visual state
	public color: Color;
	public size: number;
	public opacity: number;

	constructor(id: string, position: Vector3, config: AdvancedParticleConfig) {
		this.id = id;
		this.position = position.clone();
		this.velocity = new Vector3();
		this.acceleration = new Vector3();
		this.age = 0;
		this.maxAge = config.halfLife * 2; // 2 half-lives
		this.config = config;

		// Physics initialization
		this.force = new Vector3();
		this.mass = config.mass;
		this.charge = config.charge;
		this.radius = config.radius;

		// Biological state
		this.boundParticles = new Set();
		this.bindingProgress = 0;
		this.active = true;

		// Visual state
		this.color = config.color.clone();
		this.size = config.size;
		this.opacity = config.opacity;
	}

	// Update particle physics
	public update(deltaTime: number, environment: PhysicsEnvironment): void {
		if (!this.active) return;

		this.age += deltaTime;

		// Age-based decay
		if (this.age >= this.maxAge) {
			this.active = false;
			return;
		}

		// Reset forces
		this.force.set(0, 0, 0);

		// Apply environmental forces
		this.applyEnvironmentalForces(environment);

		// Apply inter-particle forces
		this.applyInterParticleForces(environment.particles);

		// Apply biological interactions
		this.applyBiologicalInteractions(environment.particles);

		// Integrate physics (Verlet integration for stability)
		this.integrate(deltaTime);

		// Update visual properties based on state
		this.updateVisualProperties();
	}

	private applyEnvironmentalForces(environment: PhysicsEnvironment): void {
		// Brownian motion (random walk)
		if (
			this.config.biologicalType === "molecule" ||
			this.config.biologicalType === "ion"
		) {
			const brownianForce = this.generateBrownianForce();
			this.force.add(
				brownianForce.multiplyScalar(this.config.diffusionCoefficient),
			);
		}

		// Electrostatic forces from electric fields
		if (this.charge !== 0 && environment.electricField) {
			const electricForce = environment.electricField
				.clone()
				.multiplyScalar(this.charge);
			this.force.add(electricForce);
		}

		// Flow fields (for blood flow, etc.)
		if (environment.flowField) {
			const flowForce = environment.flowField(this.position);
			this.force.add(flowForce.multiplyScalar(this.mass));
		}

		// Gravity (minimal for microscopic particles)
		if (environment.gravity) {
			this.force.add(environment.gravity.clone().multiplyScalar(this.mass));
		}
	}

	private applyInterParticleForces(particles: AdvancedParticle[]): void {
		particles.forEach((other) => {
			if (other.id === this.id || !other.active) return;

			const distance = this.position.distanceTo(other.position);
			const minDistance = this.radius + other.radius;

			if (distance < minDistance && distance > 0) {
				// Collision response
				this.handleCollision(other, distance, minDistance);
			} else if (distance < this.config.interactionRadius) {
				// Long-range interactions
				this.applyInteractionForces(other, distance);
			}
		});
	}

	private applyBiologicalInteractions(particles: AdvancedParticle[]): void {
		if (
			this.config.biologicalType === "hormone" ||
			this.config.biologicalType === "neurotransmitter"
		) {
			particles.forEach((other) => {
				if (other.config.biologicalType === "receptor" && !other.active) return;

				const distance = this.position.distanceTo(other.position);
				if (distance < this.config.interactionRadius * 1.5) {
					// Attempt binding
					this.attemptBinding(other);
				}
			});
		}
	}

	private handleCollision(
		other: AdvancedParticle,
		distance: number,
		minDistance: number,
	): void {
		// Calculate collision normal
		const normal = new Vector3()
			.subVectors(other.position, this.position)
			.normalize();

		// Separate particles
		const overlap = minDistance - distance;
		const separation = normal.clone().multiplyScalar(overlap * 0.5);

		this.position.sub(separation);
		other.position.add(separation);

		// Exchange momentum (elastic collision)
		const relativeVelocity = new Vector3().subVectors(
			this.velocity,
			other.velocity,
		);
		const velocityAlongNormal = relativeVelocity.dot(normal);

		if (velocityAlongNormal > 0) return; // Objects separating

		const restitution = 0.8; // Energy loss in collision
		const impulse =
			(-(1 + restitution) * velocityAlongNormal) /
			(1 / this.mass + 1 / other.mass);

		const impulseVector = normal.clone().multiplyScalar(impulse);
		this.velocity.add(impulseVector.clone().divideScalar(this.mass));
		other.velocity.sub(impulseVector.divideScalar(other.mass));
	}

	private applyInteractionForces(
		other: AdvancedParticle,
		distance: number,
	): void {
		const direction = new Vector3()
			.subVectors(other.position, this.position)
			.normalize();

		// Electrostatic repulsion/attraction
		if (this.charge !== 0 && other.charge !== 0) {
			const k = 8.99e9; // Coulomb's constant (scaled for simulation)
			const forceMagnitude =
				(k * Math.abs(this.charge * other.charge)) / (distance * distance);

			if (this.charge * other.charge > 0) {
				// Repulsion
				this.force.sub(
					direction
						.clone()
						.multiplyScalar(forceMagnitude * this.config.repulsionStrength),
				);
			} else {
				// Attraction
				this.force.add(
					direction
						.clone()
						.multiplyScalar(forceMagnitude * this.config.bindingStrength),
				);
			}
		}

		// Biological interactions
		if (this.canBindWith(other)) {
			const attractionForce = direction
				.clone()
				.multiplyScalar(
					this.config.bindingStrength *
						(1 - distance / this.config.interactionRadius),
				);
			this.force.add(attractionForce);
		}
	}

	private attemptBinding(other: AdvancedParticle): void {
		if (this.boundParticles.has(other.id) || other.boundParticles.has(this.id))
			return;

		// Probabilistic binding based on distance and binding strength
		const distance = this.position.distanceTo(other.position);
		const bindingProbability =
			this.config.bindingStrength *
			(1 - distance / this.config.interactionRadius);

		if (Math.random() < bindingProbability * 0.1) {
			// Scale down for simulation stability
			this.bindTo(other);
		}
	}

	private bindTo(other: AdvancedParticle): void {
		this.boundParticles.add(other.id);
		other.boundParticles.add(this.id);

		// Create binding effect
		this.bindingProgress = Math.min(1, this.bindingProgress + 0.1);
		other.bindingProgress = Math.min(1, other.bindingProgress + 0.1);

		// Adjust velocities for binding
		const averageVelocity = new Vector3()
			.addVectors(this.velocity, other.velocity)
			.multiplyScalar(0.5);

		this.velocity.copy(averageVelocity);
		other.velocity.copy(averageVelocity);
	}

	private canBindWith(other: AdvancedParticle): boolean {
		const compatiblePairs = {
			hormone: ["receptor"],
			neurotransmitter: ["receptor"],
			ion: ["ion-channel"],
			molecule: ["enzyme", "receptor"],
		};

		const compatibleTypes = compatiblePairs[this.config.biologicalType] || [];
		return compatibleTypes.includes(other.config.biologicalType);
	}

	private generateBrownianForce(): Vector3 {
		// Generate random force for Brownian motion
		const sigma = Math.sqrt(2 * this.config.diffusionCoefficient);
		return new Vector3(
			(Math.random() - 0.5) * sigma,
			(Math.random() - 0.5) * sigma,
			(Math.random() - 0.5) * sigma,
		);
	}

	private integrate(deltaTime: number): void {
		// Verlet integration for better stability
		const dt = deltaTime;
		const dt2 = dt * dt;

		// Update acceleration
		this.acceleration.copy(this.force).divideScalar(this.mass);

		// Update velocity with damping
		this.velocity.add(this.acceleration.clone().multiplyScalar(dt));
		this.velocity.multiplyScalar(this.config.damping);

		// Update position
		this.position.add(this.velocity.clone().multiplyScalar(dt));

		// Boundary conditions (periodic boundary for molecular systems)
		this.applyBoundaryConditions();
	}

	private applyBoundaryConditions(): void {
		const boundary = 10; // World boundary

		if (Math.abs(this.position.x) > boundary) {
			this.position.x = -Math.sign(this.position.x) * boundary;
		}
		if (Math.abs(this.position.y) > boundary) {
			this.position.y = -Math.sign(this.position.y) * boundary;
		}
		if (Math.abs(this.position.z) > boundary) {
			this.position.z = -Math.sign(this.position.z) * boundary;
		}
	}

	private updateVisualProperties(): void {
		// Update color based on binding state
		if (this.bindingProgress > 0) {
			this.color.lerp(new Color(0xffd700), this.bindingProgress);
		}

		// Update opacity based on age
		const ageRatio = this.age / this.maxAge;
		this.opacity = this.config.opacity * (1 - ageRatio);

		// Update size based on activity
		this.size = this.config.size * (0.8 + this.bindingProgress * 0.4);
	}

	public dispose(): void {
		this.boundParticles.clear();
	}
}

// Physics environment for particle interactions
export interface PhysicsEnvironment {
	particles: AdvancedParticle[];
	electricField?: Vector3;
	flowField?: (position: Vector3) => Vector3;
	gravity?: Vector3;
	temperature: number;
	viscosity: number;
}

// Advanced particle system with GPU acceleration
export class AdvancedParticleSystem {
	private particles: Map<string, AdvancedParticle> = new Map();
	private environment: PhysicsEnvironment;
	private instancedMesh?: InstancedMesh;
	private dummy: Object3D;
	private geometry: BufferGeometry;
	private material: ShaderMaterial;
	private particleCount: number;
	private lastUpdate = 0;

	// GPU-accelerated rendering
	private positions: Float32Array;
	private colors: Float32Array;
	private scales: Float32Array;
	private velocities: Float32Array; // For GPU-based physics

	constructor(particleCount: number, environment: PhysicsEnvironment) {
		this.particleCount = particleCount;
		this.environment = environment;
		this.dummy = new Object3D();

		// Initialize GPU arrays
		this.positions = new Float32Array(particleCount * 3);
		this.colors = new Float32Array(particleCount * 3);
		this.scales = new Float32Array(particleCount);
		this.velocities = new Float32Array(particleCount * 3);

		this.initializeGeometry();
		this.initializeMaterial();
		this.createInstancedMesh();
	}

	private initializeGeometry(): void {
		this.geometry = new BufferGeometry();

		// Initial positions (random)
		for (let i = 0; i < this.particleCount; i++) {
			const i3 = i * 3;
			this.positions[i3] = (Math.random() - 0.5) * 10;
			this.positions[i3 + 1] = (Math.random() - 0.5) * 10;
			this.positions[i3 + 2] = (Math.random() - 0.5) * 10;

			this.velocities[i3] = (Math.random() - 0.5) * 0.1;
			this.velocities[i3 + 1] = (Math.random() - 0.5) * 0.1;
			this.velocities[i3 + 2] = (Math.random() - 0.5) * 0.1;

			this.scales[i] = 1.0;
			this.colors[i3] = 1.0;
			this.colors[i3 + 1] = 1.0;
			this.colors[i3 + 2] = 1.0;
		}

		this.geometry.setAttribute(
			"position",
			new Float32BufferAttribute(this.positions, 3),
		);
		this.geometry.setAttribute(
			"color",
			new Float32BufferAttribute(this.colors, 3),
		);
		this.geometry.setAttribute(
			"scale",
			new Float32BufferAttribute(this.scales, 1),
		);
		this.geometry.setAttribute(
			"velocity",
			new Float32BufferAttribute(this.velocities, 3),
		);
	}

	private initializeMaterial(): void {
		this.material = new ShaderMaterial({
			uniforms: {
				time: { value: 0.0 },
				pixelRatio: { value: window.devicePixelRatio },
				size: { value: 10.0 },
			},
			vertexShader: `
        attribute vec3 color;
        attribute float scale;
        attribute vec3 velocity;

        varying vec3 vColor;
        varying float vOpacity;
        varying vec3 vVelocity;

        uniform float time;
        uniform float size;

        void main() {
          vColor = color;
          vVelocity = velocity;

          // Calculate opacity based on velocity magnitude (activity)
          float speed = length(velocity);
          vOpacity = 0.3 + (speed * 2.0);

          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mvPosition;

          // Size attenuation with distance and activity
          gl_PointSize = size * scale * (300.0 / -mvPosition.z);
        }
      `,
			fragmentShader: `
        varying vec3 vColor;
        varying float vOpacity;
        varying vec3 vVelocity;

        void main() {
          // Create circular particles
          vec2 center = gl_PointCoord - vec2(0.5);
          float dist = length(center);

          if (dist > 0.5) discard;

          // Soft edges
          float alpha = 1.0 - smoothstep(0.2, 0.5, dist);

          // Color based on velocity (blue = slow, red = fast)
          float speed = length(vVelocity);
          vec3 finalColor = mix(vColor, vec3(1.0, 0.5, 0.0), speed * 2.0);

          gl_FragColor = vec4(finalColor, alpha * vOpacity);
        }
      `,
			blending: AdditiveBlending,
			transparent: true,
			vertexColors: true,
			depthWrite: false,
		});
	}

	private createInstancedMesh(): void {
		this.instancedMesh = new InstancedMesh(
			this.geometry,
			this.material,
			this.particleCount,
		);
		this.instancedMesh.instanceMatrix.setUsage(DynamicDrawUsage);
		this.instancedMesh.frustumCulled = false;
	}

	// Add particle to system
	public addParticle(particle: AdvancedParticle): void {
		this.particles.set(particle.id, particle);
	}

	// Remove particle from system
	public removeParticle(id: string): void {
		const particle = this.particles.get(id);
		if (particle) {
			particle.dispose();
			this.particles.delete(id);
		}
	}

	// Update all particles
	public update(deltaTime: number): void {
		const currentTime = performance.now();
		if (currentTime - this.lastUpdate < 16) return; // Cap at ~60 FPS
		this.lastUpdate = currentTime;

		// Update particle physics
		this.particles.forEach((particle) => {
			particle.update(deltaTime, this.environment);
		});

		// Remove inactive particles
		const activeParticles = Array.from(this.particles.values()).filter(
			(p) => p.active,
		);

		// Update GPU buffers
		this.updateGPUBuffers(activeParticles);

		// Update instance count
		if (this.instancedMesh) {
			this.instancedMesh.count = activeParticles.length;
		}
	}

	private updateGPUBuffers(particles: AdvancedParticle[]): void {
		if (!this.instancedMesh) return;

		particles.forEach((particle, index) => {
			if (index >= this.particleCount) return;

			const i3 = index * 3;

			// Update positions
			this.positions[i3] = particle.position.x;
			this.positions[i3 + 1] = particle.position.y;
			this.positions[i3 + 2] = particle.position.z;

			// Update colors
			this.colors[i3] = particle.color.r;
			this.colors[i3 + 1] = particle.color.g;
			this.colors[i3 + 2] = particle.color.b;

			// Update scales
			this.scales[index] = particle.size;

			// Update velocities for GPU shader
			this.velocities[i3] = particle.velocity.x;
			this.velocities[i3 + 1] = particle.velocity.y;
			this.velocities[i3 + 2] = particle.velocity.z;

			// Update instance matrix
			this.dummy.position.copy(particle.position);
			this.dummy.scale.setScalar(particle.size);
			this.dummy.updateMatrix();
			this.instancedMesh.setMatrixAt(index, this.dummy.matrix);
		});

		// Mark attributes for update
		this.geometry.attributes.position.needsUpdate = true;
		this.geometry.attributes.color.needsUpdate = true;
		this.geometry.attributes.scale.needsUpdate = true;
		this.geometry.attributes.velocity.needsUpdate = true;
		this.instancedMesh.instanceMatrix.needsUpdate = true;
	}

	// Get particle by ID
	public getParticle(id: string): AdvancedParticle | undefined {
		return this.particles.get(id);
	}

	// Get all active particles
	public getActiveParticles(): AdvancedParticle[] {
		return Array.from(this.particles.values()).filter((p) => p.active);
	}

	// Get particles by biological type
	public getParticlesByType(type: string): AdvancedParticle[] {
		return Array.from(this.particles.values()).filter(
			(p) => p.active && p.config.biologicalType === type,
		);
	}

	// Set environmental conditions
	public setEnvironment(environment: Partial<PhysicsEnvironment>): void {
		this.environment = { ...this.environment, ...environment };
	}

	// Get performance statistics
	public getStats(): {
		totalParticles: number;
		activeParticles: number;
		averageAge: number;
		bindingCount: number;
	} {
		const activeParticles = this.getActiveParticles();
		const averageAge =
			activeParticles.reduce((sum, p) => sum + p.age, 0) /
				activeParticles.length || 0;
		const bindingCount = activeParticles.reduce(
			(sum, p) => sum + p.boundParticles.size,
			0,
		);

		return {
			totalParticles: this.particles.size,
			activeParticles: activeParticles.length,
			averageAge,
			bindingCount,
		};
	}

	// Cleanup resources
	public dispose(): void {
		this.particles.forEach((particle) => particle.dispose());
		this.particles.clear();

		if (this.instancedMesh) {
			this.instancedMesh.geometry.dispose();
			if (this.instancedMesh.material instanceof ShaderMaterial) {
				this.instancedMesh.material.dispose();
			}
		}
	}

	// Get Three.js mesh for rendering
	public getMesh(): InstancedMesh | undefined {
		return this.instancedMesh;
	}
}

// Factory functions for creating biological particle configurations
export const BiologicalParticleConfigs = {
	// Blood cells
	redBloodCell: (position: Vector3): AdvancedParticleConfig => ({
		mass: 1e-13, // kg
		charge: 0,
		radius: 0.004, // 4 μm radius
		damping: 0.95,
		biologicalType: "blood-cell",
		halfLife: 120 * 24 * 3600, // 120 days in seconds
		diffusionCoefficient: 1e-14, // m²/s
		color: new Color(0xdc2626),
		opacity: 0.8,
		size: 0.008,
		interactionRadius: 0.02,
		bindingStrength: 0.1,
		repulsionStrength: 0.5,
	}),

	// Molecules and hormones
	hormone: (position: Vector3, type = "insulin"): AdvancedParticleConfig => ({
		mass: 1e-17, // kg (protein molecule)
		charge: type === "insulin" ? -2 : 0, // Insulin has slight negative charge
		radius: 0.002, // 2 nm radius
		damping: 0.99,
		biologicalType: "hormone",
		halfLife: 3600, // 1 hour
		diffusionCoefficient: 1e-10, // m²/s (typical for proteins)
		color: new Color(0x059669),
		opacity: 0.6,
		size: 0.004,
		interactionRadius: 0.01,
		bindingStrength: 0.8,
		repulsionStrength: 0.2,
	}),

	// Ions
	sodiumIon: (position: Vector3): AdvancedParticleConfig => ({
		mass: 3.8e-26, // kg
		charge: 1.6e-19, // C (elementary charge)
		radius: 0.0001, // 0.1 nm radius
		damping: 0.98,
		biologicalType: "ion",
		halfLife: Number.POSITIVE_INFINITY, // Ions don't decay
		diffusionCoefficient: 1.3e-9, // m²/s (typical for Na+)
		color: new Color(0x3b82f6),
		opacity: 0.7,
		size: 0.002,
		interactionRadius: 0.005,
		bindingStrength: 0.3,
		repulsionStrength: 0.8,
	}),

	// Neurotransmitters
	dopamine: (position: Vector3): AdvancedParticleConfig => ({
		mass: 1e-19, // kg
		charge: 1, // Positive charge
		radius: 0.0005, // 0.5 nm radius
		damping: 0.97,
		biologicalType: "neurotransmitter",
		halfLife: 60, // 1 minute
		diffusionCoefficient: 6e-10, // m²/s
		color: new Color(0x8b5cf6),
		opacity: 0.9,
		size: 0.003,
		interactionRadius: 0.008,
		bindingStrength: 0.9,
		repulsionStrength: 0.1,
	}),

	// Immune cells
	whiteBloodCell: (position: Vector3): AdvancedParticleConfig => ({
		mass: 1e-11, // kg
		charge: -1, // Slight negative charge
		radius: 0.006, // 6 μm radius
		damping: 0.9,
		biologicalType: "immune-cell",
		halfLife: 30 * 24 * 3600, // 30 days
		diffusionCoefficient: 1e-13, // m²/s (slower than molecules)
		color: new Color(0xf59e0b),
		opacity: 0.8,
		size: 0.012,
		interactionRadius: 0.03,
		bindingStrength: 0.7,
		repulsionStrength: 0.6,
	}),
};

// Physics environment presets for different biological contexts
export const PhysicsEnvironments = {
	bloodstream: (): PhysicsEnvironment => ({
		particles: [],
		gravity: new Vector3(0, -9.8, 0),
		temperature: 310, // 37°C in Kelvin
		viscosity: 0.0035, // Blood viscosity (Pa·s)
		flowField: (position: Vector3) => {
			// Simulate blood flow velocity field
			return new Vector3(
				0.1 + Math.sin(position.y * 0.1) * 0.05, // Pulsatile flow
				0,
				0,
			);
		},
	}),

	synapticCleft: (): PhysicsEnvironment => ({
		particles: [],
		electricField: new Vector3(0, 0, 0), // Will be updated based on membrane potential
		temperature: 310,
		viscosity: 0.001, // Cerebrospinal fluid viscosity
		gravity: new Vector3(0, 0, 0), // Negligible gravity at this scale
	}),

	cellularInterior: (): PhysicsEnvironment => ({
		particles: [],
		temperature: 310,
		viscosity: 0.001,
		gravity: new Vector3(0, 0, 0),
	}),

	extracellularMatrix: (): PhysicsEnvironment => ({
		particles: [],
		temperature: 310,
		viscosity: 0.002,
		gravity: new Vector3(0, 0, 0),
		flowField: (position: Vector3) => {
			// Slow interstitial flow
			return new Vector3(
				Math.sin(position.z * 0.05) * 0.01,
				Math.cos(position.x * 0.05) * 0.01,
				0,
			);
		},
	}),
};

export default AdvancedParticleSystem;
