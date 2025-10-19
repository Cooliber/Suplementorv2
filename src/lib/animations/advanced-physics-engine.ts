"use client";

import {
	AdditiveBlending,
	BufferGeometry,
	Color,
	DynamicDrawUsage,
	Float32BufferAttribute,
	InstancedMesh,
	Matrix4,
	Object3D,
	ShaderMaterial,
	Vector3,
} from "three";
import {
	type AdvancedParticle,
	AdvancedParticleConfig,
	type PhysicsEnvironment,
} from "./advanced-particle-physics";

// Advanced physics simulation types
export type PhysicsSimulationType =
	| "sph-fluid"
	| "electrostatic"
	| "brownian-motion"
	| "lennard-jones"
	| "multi-scale"
	| "real-time-biological";

// SPH (Smoothed Particle Hydrodynamics) configuration
export interface SPHConfig {
	restDensity: number;
	gasConstant: number;
	viscosity: number;
	surfaceTension: number;
	smoothingLength: number;
	particleMass: number;
	gravity: Vector3;
}

// Electrostatic simulation configuration
export interface ElectrostaticConfig {
	dielectricConstant: number;
	debyeLength: number;
	temperature: number;
	ionicStrength: number;
}

// Advanced physics engine class
export class AdvancedPhysicsEngine {
	private particles: Map<string, AdvancedParticle> = new Map();
	private simulationType: PhysicsSimulationType;
	private sphConfig?: SPHConfig;
	private electrostaticConfig?: ElectrostaticConfig;
	private timeStep: number = 1 / 60; // 60 FPS
	private subSteps = 8; // Physics substeps for stability
	private spatialHash: Map<string, AdvancedParticle[]> = new Map();
	private hashCellSize = 0.1;

	// GPU-accelerated computation
	private computeShader?: ShaderMaterial;
	private computeMesh?: InstancedMesh;

	constructor(simulationType: PhysicsSimulationType) {
		this.simulationType = simulationType;
		this.initializePhysicsEngine();
	}

	private initializePhysicsEngine(): void {
		switch (this.simulationType) {
			case "sph-fluid":
				this.initializeSPH();
				break;
			case "electrostatic":
				this.initializeElectrostatics();
				break;
			case "brownian-motion":
				this.initializeBrownianMotion();
				break;
			case "lennard-jones":
				this.initializeLennardJones();
				break;
			case "multi-scale":
				this.initializeMultiScale();
				break;
			case "real-time-biological":
				this.initializeBiologicalPhysics();
				break;
		}
	}

	private initializeSPH(): void {
		this.sphConfig = {
			restDensity: 1000, // kg/m³ (water-like)
			gasConstant: 1000,
			viscosity: 0.01,
			surfaceTension: 0.1,
			smoothingLength: 0.1,
			particleMass: 0.001,
			gravity: new Vector3(0, -9.8, 0),
		};
	}

	private initializeElectrostatics(): void {
		this.electrostaticConfig = {
			dielectricConstant: 80, // Water
			debyeLength: 1e-9, // 1 nm
			temperature: 310, // 37°C
			ionicStrength: 0.15, // Physiological saline
		};
	}

	private initializeBrownianMotion(): void {
		// Brownian motion uses existing diffusion coefficients
		this.hashCellSize = 0.05;
	}

	private initializeLennardJones(): void {
		// Lennard-Jones potential for molecular interactions
		this.hashCellSize = 0.02;
	}

	private initializeMultiScale(): void {
		// Multi-scale simulation combining different physics
		this.initializeSPH();
		this.initializeElectrostatics();
		this.hashCellSize = 0.05;
	}

	private initializeBiologicalPhysics(): void {
		// Real-time biological physics simulation
		this.initializeSPH();
		this.initializeElectrostatics();
		this.hashCellSize = 0.03;
	}

	// Add particle to physics simulation
	public addParticle(particle: AdvancedParticle): void {
		this.particles.set(particle.id, particle);
	}

	// Remove particle from simulation
	public removeParticle(id: string): void {
		this.particles.delete(id);
	}

	// Main physics update
	public update(deltaTime: number): void {
		const subDeltaTime = deltaTime / this.subSteps;

		// Build spatial hash for efficient neighbor finding
		this.buildSpatialHash();

		for (let step = 0; step < this.subSteps; step++) {
			this.physicsStep(subDeltaTime);
		}

		// Update GPU compute if available
		this.updateGPUCompute();
	}

	private buildSpatialHash(): void {
		this.spatialHash.clear();

		this.particles.forEach((particle) => {
			if (!particle.active) return;

			const hash = this.hashPosition(particle.position);
			if (!this.spatialHash.has(hash)) {
				this.spatialHash.set(hash, []);
			}
			this.spatialHash.get(hash)?.push(particle);
		});
	}

	private hashPosition(position: Vector3): string {
		const x = Math.floor(position.x / this.hashCellSize);
		const y = Math.floor(position.y / this.hashCellSize);
		const z = Math.floor(position.z / this.hashCellSize);
		return `${x},${y},${z}`;
	}

	private physicsStep(deltaTime: number): void {
		switch (this.simulationType) {
			case "sph-fluid":
				this.sphStep(deltaTime);
				break;
			case "electrostatic":
				this.electrostaticStep(deltaTime);
				break;
			case "brownian-motion":
				this.brownianStep(deltaTime);
				break;
			case "lennard-jones":
				this.lennardJonesStep(deltaTime);
				break;
			case "multi-scale":
				this.multiScaleStep(deltaTime);
				break;
			case "real-time-biological":
				this.biologicalStep(deltaTime);
				break;
		}
	}

	private sphStep(deltaTime: number): void {
		if (!this.sphConfig) return;

		this.particles.forEach((particle) => {
			if (!particle.active) return;

			// Calculate SPH density and pressure
			const density = this.calculateSPHValue(particle, "density");
			const pressure =
				this.sphConfig.gasConstant * (density - this.sphConfig.restDensity);

			// Calculate forces
			const pressureForce = this.calculateSPHGradient(
				particle,
				"pressure",
				pressure,
			);
			const viscosityForce = this.calculateSPHGradient(
				particle,
				"viscosity",
				0,
			);
			const surfaceTensionForce = this.calculateSurfaceTension(particle);

			// Apply forces
			const totalForce = new Vector3()
				.add(pressureForce.multiplyScalar(-1))
				.add(viscosityForce.multiplyScalar(this.sphConfig.viscosity))
				.add(surfaceTensionForce.multiplyScalar(this.sphConfig.surfaceTension))
				.add(this.sphConfig.gravity.clone().multiplyScalar(particle.mass));

			// Integrate
			this.integrateParticle(particle, totalForce, deltaTime);
		});
	}

	private calculateSPHValue(
		particle: AdvancedParticle,
		property: "density" | "pressure" | "viscosity",
	): number {
		if (!this.sphConfig) return 0;

		const neighbors = this.getNeighbors(particle);
		let value = 0;

		neighbors.forEach((neighbor) => {
			const distance = particle.position.distanceTo(neighbor.position);
			if (distance < this.sphConfig.smoothingLength) {
				const weight = this.sphKernel(
					distance / this.sphConfig.smoothingLength,
				);
				value += neighbor.mass * weight;
			}
		});

		return value;
	}

	private calculateSPHGradient(
		particle: AdvancedParticle,
		property: string,
		particleValue: number,
	): Vector3 {
		if (!this.sphConfig) return new Vector3();

		const neighbors = this.getNeighbors(particle);
		const gradient = new Vector3();

		neighbors.forEach((neighbor) => {
			const distance = particle.position.distanceTo(neighbor.position);
			const direction = new Vector3()
				.subVectors(neighbor.position, particle.position)
				.normalize();

			if (distance < this.sphConfig.smoothingLength && distance > 0) {
				const weight = this.sphKernel(
					distance / this.sphConfig.smoothingLength,
				);
				const weightGradient = this.sphKernelGradient(
					distance / this.sphConfig.smoothingLength,
					direction,
				);

				let value = 0;
				if (property === "pressure") {
					const neighborDensity = this.calculateSPHValue(neighbor, "density");
					const neighborPressure =
						this.sphConfig.gasConstant *
						(neighborDensity - this.sphConfig.restDensity);
					value = (particleValue + neighborPressure) / (2 * neighborDensity);
				}

				gradient.add(
					weightGradient.clone().multiplyScalar(value * neighbor.mass),
				);
			}
		});

		return gradient;
	}

	private calculateSurfaceTension(particle: AdvancedParticle): Vector3 {
		if (!this.sphConfig) return new Vector3();

		const neighbors = this.getNeighbors(particle);
		const surfaceTension = new Vector3();

		neighbors.forEach((neighbor) => {
			const distance = particle.position.distanceTo(neighbor.position);
			if (distance < this.sphConfig.smoothingLength) {
				const direction = new Vector3()
					.subVectors(neighbor.position, particle.position)
					.normalize();
				const weight = this.sphKernel(
					distance / this.sphConfig.smoothingLength,
				);
				surfaceTension.add(direction.clone().multiplyScalar(weight));
			}
		});

		return surfaceTension.multiplyScalar(-1);
	}

	private sphKernel(r: number): number {
		if (r > 1) return 0;

		const h = 1.0; // Normalized smoothing length
		return (
			((1 - r * r) * (1 - r * r) * (1 - r * r)) / (4 * Math.PI * h * h * h)
		);
	}

	private sphKernelGradient(r: number, direction: Vector3): Vector3 {
		if (r > 1 || r === 0) return new Vector3();

		const h = 1.0;
		const factor =
			(-3 * (1 - r * r) * (1 - r * r)) / (4 * Math.PI * h * h * h * h);
		return direction.clone().multiplyScalar(factor / r);
	}

	private electrostaticStep(deltaTime: number): void {
		if (!this.electrostaticConfig) return;

		this.particles.forEach((particle) => {
			if (!particle.active || particle.charge === 0) return;

			const neighbors = this.getNeighbors(particle);
			const electricForce = new Vector3();

			neighbors.forEach((neighbor) => {
				if (neighbor.id === particle.id || neighbor.charge === 0) return;

				const distance = particle.position.distanceTo(neighbor.position);
				if (distance > 0) {
					const direction = new Vector3()
						.subVectors(neighbor.position, particle.position)
						.normalize();

					// Coulomb's law with Debye screening
					const k = 8.99e9; // Coulomb's constant
					const debyeFactor = Math.exp(
						-distance / this.electrostaticConfig.debyeLength,
					);
					const forceMagnitude =
						(k * Math.abs(particle.charge * neighbor.charge) * debyeFactor) /
						(distance * distance);

					if (particle.charge * neighbor.charge > 0) {
						// Repulsion
						electricForce.sub(direction.clone().multiplyScalar(forceMagnitude));
					} else {
						// Attraction
						electricForce.add(direction.clone().multiplyScalar(forceMagnitude));
					}
				}
			});

			this.integrateParticle(particle, electricForce, deltaTime);
		});
	}

	private brownianStep(deltaTime: number): void {
		this.particles.forEach((particle) => {
			if (!particle.active) return;

			// Generate random Brownian force
			const brownianForce = this.generateBrownianForce(particle, deltaTime);

			// Apply diffusion
			const diffusionForce = brownianForce.multiplyScalar(
				Math.sqrt((2 * particle.config.diffusionCoefficient) / deltaTime),
			);

			this.integrateParticle(particle, diffusionForce, deltaTime);
		});
	}

	private lennardJonesStep(deltaTime: number): void {
		this.particles.forEach((particle) => {
			if (!particle.active) return;

			const neighbors = this.getNeighbors(particle);
			const ljForce = new Vector3();

			neighbors.forEach((neighbor) => {
				if (neighbor.id === particle.id) return;

				const distance = particle.position.distanceTo(neighbor.position);
				if (distance > 0 && distance < 0.1) {
					// Cutoff distance
					const direction = new Vector3()
						.subVectors(neighbor.position, particle.position)
						.normalize();

					// Lennard-Jones potential
					const sigma = (particle.radius + neighbor.radius) * 0.5;
					const epsilon = 1e-21; // Depth of potential well

					const r6 = (sigma / distance) ** 6;
					const r12 = r6 * r6;

					const forceMagnitude = (24 * epsilon * (2 * r12 - r6)) / distance;
					ljForce.add(direction.clone().multiplyScalar(forceMagnitude));
				}
			});

			this.integrateParticle(particle, ljForce, deltaTime);
		});
	}

	private multiScaleStep(deltaTime: number): void {
		// Combine multiple physics simulations
		this.sphStep(deltaTime);
		this.electrostaticStep(deltaTime);
		this.brownianStep(deltaTime);
	}

	private biologicalStep(deltaTime: number): void {
		// Real-time biological physics with adaptive parameters
		this.multiScaleStep(deltaTime);

		// Add biological constraints
		this.particles.forEach((particle) => {
			if (!particle.active) return;

			// Biological damping (energy loss)
			particle.velocity.multiplyScalar(0.995);

			// Biological force limits
			const maxForce = particle.mass * 100; // Limit acceleration
			if (particle.velocity.length() > (maxForce * deltaTime) / particle.mass) {
				particle.velocity
					.normalize()
					.multiplyScalar((maxForce * deltaTime) / particle.mass);
			}
		});
	}

	private getNeighbors(particle: AdvancedParticle): AdvancedParticle[] {
		const neighbors: AdvancedParticle[] = [];
		const hash = this.hashPosition(particle.position);

		// Check current cell and adjacent cells
		for (let dx = -1; dx <= 1; dx++) {
			for (let dy = -1; dy <= 1; dy++) {
				for (let dz = -1; dz <= 1; dz++) {
					const neighborHash = `${Number.parseInt(hash.split(",")[0]) + dx},${Number.parseInt(hash.split(",")[1]) + dy},${Number.parseInt(hash.split(",")[2]) + dz}`;
					const cellParticles = this.spatialHash.get(neighborHash);
					if (cellParticles) {
						neighbors.push(...cellParticles);
					}
				}
			}
		}

		return neighbors;
	}

	private generateBrownianForce(
		particle: AdvancedParticle,
		deltaTime: number,
	): Vector3 {
		// Generate Gaussian random numbers using Box-Muller transform
		const u1 = Math.random();
		const u2 = Math.random();

		const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
		const z1 = Math.sqrt(-2 * Math.log(u1)) * Math.sin(2 * Math.PI * u2);

		const sigma = Math.sqrt(
			(2 * particle.config.diffusionCoefficient) / deltaTime,
		);

		return new Vector3(
			z0 * sigma,
			z1 * sigma,
			(Math.random() - 0.5) * 2 * sigma,
		);
	}

	private integrateParticle(
		particle: AdvancedParticle,
		force: Vector3,
		deltaTime: number,
	): void {
		// Verlet integration for better stability
		const acceleration = force.clone().divideScalar(particle.mass);

		// Update velocity
		particle.velocity.add(acceleration.clone().multiplyScalar(deltaTime));

		// Apply biological damping
		particle.velocity.multiplyScalar(particle.config.damping);

		// Update position
		particle.position.add(particle.velocity.clone().multiplyScalar(deltaTime));

		// Boundary conditions
		this.applyBoundaryConditions(particle);
	}

	private applyBoundaryConditions(particle: AdvancedParticle): void {
		const boundary = 5;

		if (Math.abs(particle.position.x) > boundary) {
			particle.position.x = Math.sign(particle.position.x) * boundary;
			particle.velocity.x *= -0.5; // Energy loss on bounce
		}
		if (Math.abs(particle.position.y) > boundary) {
			particle.position.y = Math.sign(particle.position.y) * boundary;
			particle.velocity.y *= -0.5;
		}
		if (Math.abs(particle.position.z) > boundary) {
			particle.position.z = Math.sign(particle.position.z) * boundary;
			particle.velocity.z *= -0.5;
		}
	}

	private updateGPUCompute(): void {
		if (!this.computeMesh) return;

		// Update GPU compute shader uniforms
		const particles = Array.from(this.particles.values()).filter(
			(p) => p.active,
		);

		if (particles.length > 0) {
			// Update compute shader with particle data
			this.updateComputeShaderData(particles);
		}
	}

	private updateComputeShaderData(particles: AdvancedParticle[]): void {
		// Implementation for GPU-accelerated physics computation
		// This would update compute shader buffers with particle positions, velocities, etc.
	}

	// Initialize GPU compute shader
	private initializeGPUCompute(): void {
		if (typeof window === "undefined") return; // Skip on server

		const computeGeometry = new BufferGeometry();
		const positions = new Float32Array(6 * 3); // Full screen quad

		positions[0] = -1;
		positions[1] = -1;
		positions[2] = 0;
		positions[3] = 1;
		positions[4] = -1;
		positions[5] = 0;
		positions[6] = -1;
		positions[7] = 1;
		positions[8] = 0;
		positions[9] = 1;
		positions[10] = 1;
		positions[11] = 0;
		positions[12] = -1;
		positions[13] = 1;
		positions[14] = 0;
		positions[15] = 1;
		positions[16] = -1;
		positions[17] = 0;

		computeGeometry.setAttribute(
			"position",
			new Float32BufferAttribute(positions, 3),
		);

		this.computeShader = new ShaderMaterial({
			uniforms: {
				time: { value: 0 },
				deltaTime: { value: this.timeStep },
				particleCount: { value: 0 },
			},
			vertexShader: `
        void main() {
          gl_Position = vec4(position, 1.0);
        }
      `,
			fragmentShader: `
        uniform float time;
        uniform float deltaTime;
        uniform int particleCount;

        void main() {
          // GPU-accelerated physics computation would go here
          gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
        }
      `,
		});

		this.computeMesh = new InstancedMesh(
			computeGeometry,
			this.computeShader,
			1,
		);
		this.computeMesh.visible = false; // Compute-only mesh
	}

	// Get physics statistics
	public getPhysicsStats(): {
		simulationType: PhysicsSimulationType;
		particleCount: number;
		averageVelocity: number;
		averageForce: number;
		kineticEnergy: number;
		potentialEnergy: number;
	} {
		const particles = Array.from(this.particles.values()).filter(
			(p) => p.active,
		);

		if (particles.length === 0) {
			return {
				simulationType: this.simulationType,
				particleCount: 0,
				averageVelocity: 0,
				averageForce: 0,
				kineticEnergy: 0,
				potentialEnergy: 0,
			};
		}

		const totalVelocity = particles.reduce(
			(sum, p) => sum + p.velocity.length(),
			0,
		);
		const totalForce = particles.reduce((sum, p) => sum + p.force.length(), 0);
		const kineticEnergy = particles.reduce(
			(sum, p) => sum + 0.5 * p.mass * p.velocity.lengthSq(),
			0,
		);

		return {
			simulationType: this.simulationType,
			particleCount: particles.length,
			averageVelocity: totalVelocity / particles.length,
			averageForce: totalForce / particles.length,
			kineticEnergy,
			potentialEnergy: 0, // Would be calculated based on simulation type
		};
	}

	// Set environmental conditions
	public setEnvironment(environment: Partial<PhysicsEnvironment>): void {
		// Update physics parameters based on environment
		if (environment.temperature && this.electrostaticConfig) {
			this.electrostaticConfig.temperature = environment.temperature;
		}

		if (environment.viscosity && this.sphConfig) {
			this.sphConfig.viscosity = environment.viscosity;
		}
	}

	// Adaptive time stepping
	public setAdaptiveTimeStep(targetFPS = 60): void {
		const stats = this.getPhysicsStats();
		const currentFPS = 1 / this.timeStep;

		if (Math.abs(currentFPS - targetFPS) > 5) {
			this.timeStep = 1 / targetFPS;
			this.subSteps = Math.max(1, Math.floor(targetFPS / 30));
		}
	}

	// Get particles by region for multi-scale simulation
	public getParticlesInRegion(
		center: Vector3,
		radius: number,
	): AdvancedParticle[] {
		return Array.from(this.particles.values()).filter((particle) => {
			if (!particle.active) return false;
			return particle.position.distanceTo(center) <= radius;
		});
	}

	// Apply external forces (for interactive manipulation)
	public applyExternalForce(
		position: Vector3,
		force: Vector3,
		radius: number,
	): void {
		this.particles.forEach((particle) => {
			if (!particle.active) return;

			const distance = particle.position.distanceTo(position);
			if (distance <= radius) {
				const falloff = 1 - distance / radius;
				const appliedForce = force.clone().multiplyScalar(falloff);
				particle.velocity.add(
					appliedForce.multiplyScalar(this.timeStep / particle.mass),
				);
			}
		});
	}

	// Cleanup resources
	public dispose(): void {
		this.particles.clear();
		this.spatialHash.clear();

		if (this.computeMesh) {
			this.computeMesh.geometry.dispose();
			if (this.computeMesh.material instanceof ShaderMaterial) {
				this.computeMesh.material.dispose();
			}
		}
	}
}

// Physics engine manager for multiple simulation types
export class PhysicsEngineManager {
	private engines: Map<string, AdvancedPhysicsEngine> = new Map();
	private activeEngines: Set<string> = new Set();

	public createEngine(
		id: string,
		type: PhysicsSimulationType,
	): AdvancedPhysicsEngine {
		const engine = new AdvancedPhysicsEngine(type);
		this.engines.set(id, engine);
		return engine;
	}

	public getEngine(id: string): AdvancedPhysicsEngine | undefined {
		return this.engines.get(id);
	}

	public startEngine(id: string): void {
		this.activeEngines.add(id);
	}

	public stopEngine(id: string): void {
		this.activeEngines.delete(id);
	}

	public update(deltaTime: number): void {
		this.activeEngines.forEach((engineId) => {
			const engine = this.engines.get(engineId);
			if (engine) {
				engine.update(deltaTime);
			}
		});
	}

	public getAllStats(): Record<string, any> {
		const stats: Record<string, any> = {};

		this.engines.forEach((engine, id) => {
			stats[id] = engine.getPhysicsStats();
		});

		return stats;
	}

	public dispose(): void {
		this.engines.forEach((engine) => engine.dispose());
		this.engines.clear();
		this.activeEngines.clear();
	}
}

// Predefined physics configurations for biological systems
export const BIOLOGICAL_PHYSICS_CONFIGS = {
	bloodFlow: {
		type: "sph-fluid" as PhysicsSimulationType,
		sphConfig: {
			restDensity: 1060, // Blood density kg/m³
			gasConstant: 2000,
			viscosity: 0.0035, // Blood viscosity Pa·s
			surfaceTension: 0.05,
			smoothingLength: 0.08,
			particleMass: 0.001,
			gravity: new Vector3(0, 0, 0), // Minimal gravity at cellular scale
		},
	},

	molecularDiffusion: {
		type: "brownian-motion" as PhysicsSimulationType,
		hashCellSize: 0.02,
	},

	electrostaticInteractions: {
		type: "electrostatic" as PhysicsSimulationType,
		electrostaticConfig: {
			dielectricConstant: 80,
			debyeLength: 0.8e-9, // 0.8 nm in physiological conditions
			temperature: 310,
			ionicStrength: 0.15,
		},
	},

	multiScaleCellular: {
		type: "multi-scale" as PhysicsSimulationType,
		hashCellSize: 0.03,
		adaptiveTimeStep: true,
	},
};

export default AdvancedPhysicsEngine;
