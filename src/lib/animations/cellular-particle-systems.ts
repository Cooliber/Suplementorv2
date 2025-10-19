"use client";

import {
	Color,
	Group,
	Mesh,
	MeshBasicMaterial,
	SphereGeometry,
	Vector3,
} from "three";
import {
	AdvancedParticle,
	type AdvancedParticleConfig,
	AdvancedParticleSystem,
	BiologicalParticleConfigs,
	type PhysicsEnvironment,
	PhysicsEnvironments,
} from "./advanced-particle-physics";

// Cellular process types
export type CellularProcessType =
	| "blood-flow"
	| "neural-signals"
	| "hormone-diffusion"
	| "immune-response"
	| "atp-synthesis"
	| "cellular-respiration"
	| "protein-synthesis"
	| "ion-transport";

// Configuration for cellular particle systems
export interface CellularParticleSystemConfig {
	processType: CellularProcessType;
	particleCount: number;
	emissionRate: number;
	environment: PhysicsEnvironment;
	bounds: { min: Vector3; max: Vector3 };
	polishName: string;
	description: string;
	polishDescription: string;
}

// Advanced cellular particle system class
export class CellularParticleSystem extends AdvancedParticleSystem {
	public config: CellularParticleSystemConfig;
	private emissionTimer = 0;
	private lastEmission = 0;
	private activeProcesses: Map<string, boolean> = new Map();

	constructor(config: CellularParticleSystemConfig) {
		const environment = { ...config.environment };
		super(config.particleCount, environment);
		this.config = config;

		this.initializeCellularProcess();
	}

	private initializeCellularProcess(): void {
		this.activeProcesses.set("main-process", true);

		// Initialize particles based on process type
		switch (this.config.processType) {
			case "blood-flow":
				this.initializeBloodFlow();
				break;
			case "neural-signals":
				this.initializeNeuralSignals();
				break;
			case "hormone-diffusion":
				this.initializeHormoneDiffusion();
				break;
			case "immune-response":
				this.initializeImmuneResponse();
				break;
			case "atp-synthesis":
				this.initializeATPSynthesis();
				break;
			case "cellular-respiration":
				this.initializeCellularRespiration();
				break;
			case "protein-synthesis":
				this.initializeProteinSynthesis();
				break;
			case "ion-transport":
				this.initializeIonTransport();
				break;
		}
	}

	private initializeBloodFlow(): void {
		// Create red blood cells flowing through vessels
		for (let i = 0; i < this.config.particleCount * 0.6; i++) {
			const position = new Vector3(
				this.config.bounds.min.x +
					Math.random() * (this.config.bounds.max.x - this.config.bounds.min.x),
				this.config.bounds.min.y +
					Math.random() * (this.config.bounds.max.y - this.config.bounds.min.y),
				0,
			);

			const config = BiologicalParticleConfigs.redBloodCell(position);
			const particle = new AdvancedParticle(`rbc-${i}`, position, config);
			this.addParticle(particle);
		}

		// Add some white blood cells
		for (let i = 0; i < this.config.particleCount * 0.1; i++) {
			const position = new Vector3(
				this.config.bounds.min.x +
					Math.random() * (this.config.bounds.max.x - this.config.bounds.min.x),
				this.config.bounds.min.y +
					Math.random() * (this.config.bounds.max.y - this.config.bounds.min.y),
				0,
			);

			const config = BiologicalParticleConfigs.whiteBloodCell(position);
			const particle = new AdvancedParticle(`wbc-${i}`, position, config);
			this.addParticle(particle);
		}
	}

	private initializeNeuralSignals(): void {
		// Create neurotransmitters and neural signal particles
		for (let i = 0; i < this.config.particleCount * 0.7; i++) {
			const position = new Vector3(
				this.config.bounds.min.x +
					Math.random() * (this.config.bounds.max.x - this.config.bounds.min.x),
				this.config.bounds.min.y +
					Math.random() * (this.config.bounds.max.y - this.config.bounds.min.y),
				0,
			);

			const config = BiologicalParticleConfigs.dopamine(position);
			const particle = new AdvancedParticle(
				`neurotransmitter-${i}`,
				position,
				config,
			);
			this.addParticle(particle);
		}

		// Add receptor sites
		for (let i = 0; i < this.config.particleCount * 0.3; i++) {
			const position = new Vector3(
				this.config.bounds.min.x +
					Math.random() * (this.config.bounds.max.x - this.config.bounds.min.x),
				this.config.bounds.min.y +
					Math.random() * (this.config.bounds.max.y - this.config.bounds.min.y),
				0,
			);

			const receptorConfig: AdvancedParticleConfig = {
				mass: 1e-15,
				charge: -1,
				radius: 0.001,
				damping: 1.0,
				biologicalType: "receptor",
				halfLife: Number.POSITIVE_INFINITY,
				diffusionCoefficient: 0,
				color: new Color(0xef4444),
				opacity: 0.8,
				size: 0.006,
				interactionRadius: 0.02,
				bindingStrength: 0.9,
				repulsionStrength: 0.1,
			};

			const particle = new AdvancedParticle(
				`receptor-${i}`,
				position,
				receptorConfig,
			);
			this.addParticle(particle);
		}
	}

	private initializeHormoneDiffusion(): void {
		// Create hormone molecules
		for (let i = 0; i < this.config.particleCount * 0.8; i++) {
			const position = new Vector3(
				this.config.bounds.min.x +
					Math.random() * (this.config.bounds.max.x - this.config.bounds.min.x),
				this.config.bounds.min.y +
					Math.random() * (this.config.bounds.max.y - this.config.bounds.min.y),
				0,
			);

			const config = BiologicalParticleConfigs.hormone(position, "insulin");
			const particle = new AdvancedParticle(`hormone-${i}`, position, config);
			this.addParticle(particle);
		}

		// Add target receptors
		for (let i = 0; i < this.config.particleCount * 0.2; i++) {
			const position = new Vector3(
				this.config.bounds.min.x +
					Math.random() * (this.config.bounds.max.x - this.config.bounds.min.x),
				this.config.bounds.min.y +
					Math.random() * (this.config.bounds.max.y - this.config.bounds.min.y),
				0,
			);

			const receptorConfig: AdvancedParticleConfig = {
				mass: 1e-15,
				charge: 0,
				radius: 0.001,
				damping: 1.0,
				biologicalType: "receptor",
				halfLife: Number.POSITIVE_INFINITY,
				diffusionCoefficient: 0,
				color: new Color(0x8b5cf6),
				opacity: 0.8,
				size: 0.006,
				interactionRadius: 0.02,
				bindingStrength: 0.8,
				repulsionStrength: 0.2,
			};

			const particle = new AdvancedParticle(
				`hormone-receptor-${i}`,
				position,
				receptorConfig,
			);
			this.addParticle(particle);
		}
	}

	private initializeImmuneResponse(): void {
		// Create immune cells (white blood cells)
		for (let i = 0; i < this.config.particleCount * 0.4; i++) {
			const position = new Vector3(
				this.config.bounds.min.x +
					Math.random() * (this.config.bounds.max.x - this.config.bounds.min.x),
				this.config.bounds.min.y +
					Math.random() * (this.config.bounds.max.y - this.config.bounds.min.y),
				0,
			);

			const config = BiologicalParticleConfigs.whiteBloodCell(position);
			const particle = new AdvancedParticle(
				`immune-cell-${i}`,
				position,
				config,
			);
			this.addParticle(particle);
		}

		// Create pathogens/bacteria
		for (let i = 0; i < this.config.particleCount * 0.3; i++) {
			const position = new Vector3(
				this.config.bounds.min.x +
					Math.random() * (this.config.bounds.max.x - this.config.bounds.min.x),
				this.config.bounds.min.y +
					Math.random() * (this.config.bounds.max.y - this.config.bounds.min.y),
				0,
			);

			const pathogenConfig: AdvancedParticleConfig = {
				mass: 1e-15,
				charge: -1,
				radius: 0.002,
				damping: 0.95,
				biologicalType: "pathogen",
				halfLife: 1800, // 30 minutes
				diffusionCoefficient: 1e-12,
				color: new Color(0x7c2d12),
				opacity: 0.8,
				size: 0.004,
				interactionRadius: 0.015,
				bindingStrength: 0.1,
				repulsionStrength: 0.3,
			};

			const particle = new AdvancedParticle(
				`pathogen-${i}`,
				position,
				pathogenConfig,
			);
			this.addParticle(particle);
		}
	}

	private initializeATPSynthesis(): void {
		// Create ADP molecules
		for (let i = 0; i < this.config.particleCount * 0.4; i++) {
			const position = new Vector3(
				this.config.bounds.min.x +
					Math.random() * (this.config.bounds.max.x - this.config.bounds.min.x),
				this.config.bounds.min.y +
					Math.random() * (this.config.bounds.max.y - this.config.bounds.min.y),
				0,
			);

			const adpConfig: AdvancedParticleConfig = {
				mass: 1e-18,
				charge: -3,
				radius: 0.001,
				damping: 0.98,
				biologicalType: "molecule",
				halfLife: 3600,
				diffusionCoefficient: 1e-10,
				color: new Color(0xf59e0b),
				opacity: 0.7,
				size: 0.003,
				interactionRadius: 0.008,
				bindingStrength: 0.6,
				repulsionStrength: 0.2,
			};

			const particle = new AdvancedParticle(`adp-${i}`, position, adpConfig);
			this.addParticle(particle);
		}

		// Create ATP synthase complexes (stationary)
		for (let i = 0; i < this.config.particleCount * 0.1; i++) {
			const position = new Vector3(
				this.config.bounds.min.x +
					Math.random() * (this.config.bounds.max.x - this.config.bounds.min.x),
				this.config.bounds.min.y +
					Math.random() * (this.config.bounds.max.y - this.config.bounds.min.y),
				0,
			);

			const atpSynthaseConfig: AdvancedParticleConfig = {
				mass: 1e-12,
				charge: 0,
				radius: 0.005,
				damping: 1.0,
				biologicalType: "enzyme",
				halfLife: Number.POSITIVE_INFINITY,
				diffusionCoefficient: 0,
				color: new Color(0x059669),
				opacity: 0.9,
				size: 0.01,
				interactionRadius: 0.02,
				bindingStrength: 0.8,
				repulsionStrength: 0.1,
			};

			const particle = new AdvancedParticle(
				`atp-synthase-${i}`,
				position,
				atpSynthaseConfig,
			);
			this.addParticle(particle);
		}
	}

	private initializeCellularRespiration(): void {
		// Create glucose molecules
		for (let i = 0; i < this.config.particleCount * 0.3; i++) {
			const position = new Vector3(
				this.config.bounds.min.x +
					Math.random() * (this.config.bounds.max.x - this.config.bounds.min.x),
				this.config.bounds.min.y +
					Math.random() * (this.config.bounds.max.y - this.config.bounds.min.y),
				0,
			);

			const glucoseConfig: AdvancedParticleConfig = {
				mass: 3e-19,
				charge: 0,
				radius: 0.001,
				damping: 0.98,
				biologicalType: "molecule",
				halfLife: 1800,
				diffusionCoefficient: 1e-10,
				color: new Color(0x10b981),
				opacity: 0.7,
				size: 0.003,
				interactionRadius: 0.008,
				bindingStrength: 0.5,
				repulsionStrength: 0.2,
			};

			const particle = new AdvancedParticle(
				`glucose-${i}`,
				position,
				glucoseConfig,
			);
			this.addParticle(particle);
		}

		// Create mitochondria
		for (let i = 0; i < this.config.particleCount * 0.2; i++) {
			const position = new Vector3(
				this.config.bounds.min.x +
					Math.random() * (this.config.bounds.max.x - this.config.bounds.min.x),
				this.config.bounds.min.y +
					Math.random() * (this.config.bounds.max.y - this.config.bounds.min.y),
				0,
			);

			const mitochondriaConfig: AdvancedParticleConfig = {
				mass: 1e-10,
				charge: -2,
				radius: 0.008,
				damping: 1.0,
				biologicalType: "organelle",
				halfLife: Number.POSITIVE_INFINITY,
				diffusionCoefficient: 0,
				color: new Color(0xdc2626),
				opacity: 0.8,
				size: 0.016,
				interactionRadius: 0.03,
				bindingStrength: 0.7,
				repulsionStrength: 0.3,
			};

			const particle = new AdvancedParticle(
				`mitochondria-${i}`,
				position,
				mitochondriaConfig,
			);
			this.addParticle(particle);
		}
	}

	private initializeProteinSynthesis(): void {
		// Create amino acids
		for (let i = 0; i < this.config.particleCount * 0.5; i++) {
			const position = new Vector3(
				this.config.bounds.min.x +
					Math.random() * (this.config.bounds.max.x - this.config.bounds.min.x),
				this.config.bounds.min.y +
					Math.random() * (this.config.bounds.max.y - this.config.bounds.min.y),
				0,
			);

			const aminoAcidConfig: AdvancedParticleConfig = {
				mass: 1.5e-19,
				charge: 0,
				radius: 0.0008,
				damping: 0.98,
				biologicalType: "molecule",
				halfLife: 7200,
				diffusionCoefficient: 1e-10,
				color: new Color(0x3b82f6),
				opacity: 0.7,
				size: 0.002,
				interactionRadius: 0.006,
				bindingStrength: 0.6,
				repulsionStrength: 0.2,
			};

			const particle = new AdvancedParticle(
				`amino-acid-${i}`,
				position,
				aminoAcidConfig,
			);
			this.addParticle(particle);
		}

		// Create ribosomes
		for (let i = 0; i < this.config.particleCount * 0.1; i++) {
			const position = new Vector3(
				this.config.bounds.min.x +
					Math.random() * (this.config.bounds.max.x - this.config.bounds.min.x),
				this.config.bounds.min.y +
					Math.random() * (this.config.bounds.max.y - this.config.bounds.min.y),
				0,
			);

			const ribosomeConfig: AdvancedParticleConfig = {
				mass: 1e-12,
				charge: -1,
				radius: 0.004,
				damping: 1.0,
				biologicalType: "ribosome",
				halfLife: Number.POSITIVE_INFINITY,
				diffusionCoefficient: 0,
				color: new Color(0x7c3aed),
				opacity: 0.8,
				size: 0.008,
				interactionRadius: 0.02,
				bindingStrength: 0.8,
				repulsionStrength: 0.1,
			};

			const particle = new AdvancedParticle(
				`ribosome-${i}`,
				position,
				ribosomeConfig,
			);
			this.addParticle(particle);
		}
	}

	private initializeIonTransport(): void {
		// Create sodium ions
		for (let i = 0; i < this.config.particleCount * 0.4; i++) {
			const position = new Vector3(
				this.config.bounds.min.x +
					Math.random() * (this.config.bounds.max.x - this.config.bounds.min.x),
				this.config.bounds.min.y +
					Math.random() * (this.config.bounds.max.y - this.config.bounds.min.y),
				0,
			);

			const config = BiologicalParticleConfigs.sodiumIon(position);
			const particle = new AdvancedParticle(`na-${i}`, position, config);
			this.addParticle(particle);
		}

		// Create potassium ions
		for (let i = 0; i < this.config.particleCount * 0.3; i++) {
			const position = new Vector3(
				this.config.bounds.min.x +
					Math.random() * (this.config.bounds.max.x - this.config.bounds.min.x),
				this.config.bounds.min.y +
					Math.random() * (this.config.bounds.max.y - this.config.bounds.min.y),
				0,
			);

			const potassiumConfig: AdvancedParticleConfig = {
				mass: 6.5e-26,
				charge: 1.6e-19,
				radius: 0.000138,
				damping: 0.98,
				biologicalType: "ion",
				halfLife: Number.POSITIVE_INFINITY,
				diffusionCoefficient: 2e-9,
				color: new Color(0xf97316),
				opacity: 0.7,
				size: 0.002,
				interactionRadius: 0.005,
				bindingStrength: 0.3,
				repulsionStrength: 0.8,
			};

			const particle = new AdvancedParticle(
				`k-${i}`,
				position,
				potassiumConfig,
			);
			this.addParticle(particle);
		}

		// Create ion channels
		for (let i = 0; i < this.config.particleCount * 0.1; i++) {
			const position = new Vector3(
				this.config.bounds.min.x +
					Math.random() * (this.config.bounds.max.x - this.config.bounds.min.x),
				this.config.bounds.min.y +
					Math.random() * (this.config.bounds.max.y - this.config.bounds.min.y),
				0,
			);

			const channelConfig: AdvancedParticleConfig = {
				mass: 1e-14,
				charge: 0,
				radius: 0.003,
				damping: 1.0,
				biologicalType: "ion-channel",
				halfLife: Number.POSITIVE_INFINITY,
				diffusionCoefficient: 0,
				color: new Color(0x06b6d4),
				opacity: 0.9,
				size: 0.006,
				interactionRadius: 0.01,
				bindingStrength: 0.5,
				repulsionStrength: 0.2,
			};

			const particle = new AdvancedParticle(
				`ion-channel-${i}`,
				position,
				channelConfig,
			);
			this.addParticle(particle);
		}
	}

	// Update the cellular process
	public update(deltaTime: number): void {
		super.update(deltaTime);

		// Emit new particles based on process requirements
		this.handleEmissions(deltaTime);

		// Update process-specific behaviors
		this.updateCellularProcess(deltaTime);
	}

	private handleEmissions(deltaTime: number): void {
		this.emissionTimer += deltaTime;

		if (
			this.emissionTimer - this.lastEmission >=
			1.0 / this.config.emissionRate
		) {
			this.emitProcessParticles();
			this.lastEmission = this.emissionTimer;
		}
	}

	private emitProcessParticles(): void {
		switch (this.config.processType) {
			case "blood-flow":
				this.emitBloodCells();
				break;
			case "neural-signals":
				this.emitNeuralSignals();
				break;
			case "hormone-diffusion":
				this.emitHormones();
				break;
			case "immune-response":
				this.emitImmuneFactors();
				break;
			case "atp-synthesis":
				this.emitEnergyParticles();
				break;
		}
	}

	private emitBloodCells(): void {
		if (Math.random() < 0.3) {
			// 30% chance to emit red blood cell
			const position = new Vector3(
				this.config.bounds.min.x,
				Math.random() * 2 - 1,
				0,
			);
			const config = BiologicalParticleConfigs.redBloodCell(position);
			const particle = new AdvancedParticle(
				`rbc-emitted-${Date.now()}`,
				position,
				config,
			);
			this.addParticle(particle);
		}
	}

	private emitNeuralSignals(): void {
		if (Math.random() < 0.5) {
			// 50% chance to emit neurotransmitter
			const position = new Vector3(
				this.config.bounds.min.x + Math.random() * 2,
				Math.random() * 2 - 1,
				0,
			);
			const config = BiologicalParticleConfigs.dopamine(position);
			const particle = new AdvancedParticle(
				`neuro-emitted-${Date.now()}`,
				position,
				config,
			);
			this.addParticle(particle);
		}
	}

	private emitHormones(): void {
		if (Math.random() < 0.4) {
			// 40% chance to emit hormone
			const position = new Vector3(
				Math.random() * 2 - 1,
				this.config.bounds.max.y,
				0,
			);
			const config = BiologicalParticleConfigs.hormone(position, "insulin");
			const particle = new AdvancedParticle(
				`hormone-emitted-${Date.now()}`,
				position,
				config,
			);
			this.addParticle(particle);
		}
	}

	private emitImmuneFactors(): void {
		if (Math.random() < 0.2) {
			// 20% chance to emit immune cell
			const position = new Vector3(
				this.config.bounds.min.x + Math.random() * 2,
				Math.random() * 2 - 1,
				0,
			);
			const config = BiologicalParticleConfigs.whiteBloodCell(position);
			const particle = new AdvancedParticle(
				`immune-emitted-${Date.now()}`,
				position,
				config,
			);
			this.addParticle(particle);
		}
	}

	private emitEnergyParticles(): void {
		if (Math.random() < 0.6) {
			// 60% chance to emit ATP
			const position = new Vector3(
				Math.random() * 2 - 1,
				Math.random() * 2 - 1,
				0,
			);
			const atpConfig: AdvancedParticleConfig = {
				mass: 1e-18,
				charge: -4,
				radius: 0.001,
				damping: 0.98,
				biologicalType: "molecule",
				halfLife: 1800,
				diffusionCoefficient: 1e-10,
				color: new Color(0xf59e0b),
				emissiveColor: new Color(0xf59e0b),
				opacity: 0.8,
				size: 0.003,
				interactionRadius: 0.008,
				bindingStrength: 0.4,
				repulsionStrength: 0.3,
			};

			const particle = new AdvancedParticle(
				`atp-emitted-${Date.now()}`,
				position,
				atpConfig,
			);
			this.addParticle(particle);
		}
	}

	private updateCellularProcess(deltaTime: number): void {
		// Update process-specific behaviors
		switch (this.config.processType) {
			case "blood-flow":
				this.updateBloodFlow(deltaTime);
				break;
			case "neural-signals":
				this.updateNeuralSignals(deltaTime);
				break;
			case "hormone-diffusion":
				this.updateHormoneDiffusion(deltaTime);
				break;
			case "immune-response":
				this.updateImmuneResponse(deltaTime);
				break;
			case "atp-synthesis":
				this.updateATPSynthesis(deltaTime);
				break;
		}
	}

	private updateBloodFlow(deltaTime: number): void {
		// Update blood flow velocity field
		const time = Date.now() * 0.001;
		const flowSpeed = 0.1 + Math.sin(time) * 0.05;

		this.setEnvironment({
			flowField: (position: Vector3) => new Vector3(flowSpeed, 0, 0),
		});
	}

	private updateNeuralSignals(deltaTime: number): void {
		// Create electrical field variations for neural activity
		const time = Date.now() * 0.002;
		const fieldStrength = Math.sin(time) * 0.1;

		this.setEnvironment({
			electricField: new Vector3(fieldStrength, 0, 0),
		});
	}

	private updateHormoneDiffusion(deltaTime: number): void {
		// Update diffusion gradient
		const particles = this.getActiveParticles();
		const hormones = particles.filter(
			(p) => p.config.biologicalType === "hormone",
		);

		if (hormones.length > 0) {
			// Create concentration gradient
			const avgPosition = hormones
				.reduce((sum, p) => sum.add(p.position), new Vector3())
				.divideScalar(hormones.length);

			this.setEnvironment({
				flowField: (position: Vector3) => {
					const direction = avgPosition.clone().sub(position).normalize();
					return direction.multiplyScalar(0.02);
				},
			});
		}
	}

	private updateImmuneResponse(deltaTime: number): void {
		// Update immune cell targeting behavior
		const particles = this.getActiveParticles();
		const immuneCells = particles.filter(
			(p) => p.config.biologicalType === "immune-cell",
		);
		const pathogens = particles.filter(
			(p) => p.config.biologicalType === "pathogen",
		);

		immuneCells.forEach((immuneCell) => {
			if (pathogens.length > 0) {
				// Find nearest pathogen
				let nearestPathogen = pathogens[0];
				let nearestDistance = immuneCell.position.distanceTo(
					nearestPathogen.position,
				);

				pathogens.forEach((pathogen) => {
					const distance = immuneCell.position.distanceTo(pathogen.position);
					if (distance < nearestDistance) {
						nearestDistance = distance;
						nearestPathogen = pathogen;
					}
				});

				// Move towards pathogen
				const direction = nearestPathogen.position
					.clone()
					.sub(immuneCell.position)
					.normalize();
				immuneCell.velocity.add(direction.multiplyScalar(0.01));
			}
		});
	}

	private updateATPSynthesis(deltaTime: number): void {
		// Update ATP synthesis activity
		const particles = this.getActiveParticles();
		const mitochondria = particles.filter(
			(p) => p.config.biologicalType === "organelle",
		);
		const adp = particles.filter((p) => p.config.biologicalType === "molecule");

		mitochondria.forEach((mito) => {
			adp.forEach((adpMol) => {
				const distance = mito.position.distanceTo(adpMol.position);
				if (distance < 0.05) {
					// Convert ADP to ATP
					adpMol.color.setHex(0x22c55e); // Green for ATP
					adpMol.config.biologicalType = "atp";
				}
			});
		});
	}

	// Get process-specific statistics
	public getProcessStats(): {
		processType: CellularProcessType;
		particleCount: number;
		activeParticles: number;
		bindingEvents: number;
		averageVelocity: number;
		energyLevel: number;
	} {
		const particles = this.getActiveParticles();
		const bindingEvents = particles.reduce(
			(sum, p) => sum + p.boundParticles.size,
			0,
		);
		const averageVelocity =
			particles.reduce((sum, p) => sum + p.velocity.length(), 0) /
				particles.length || 0;

		// Calculate energy level based on particle activity
		const energyLevel = Math.min(1, averageVelocity * 10 + bindingEvents * 0.1);

		return {
			processType: this.config.processType,
			particleCount: this.particles.size,
			activeParticles: particles.length,
			bindingEvents,
			averageVelocity,
			energyLevel,
		};
	}

	// Start/stop specific cellular process
	public setProcessActive(process: string, active: boolean): void {
		this.activeProcesses.set(process, active);
	}

	public isProcessActive(process: string): boolean {
		return this.activeProcesses.get(process) || false;
	}
}

// Predefined cellular particle system configurations
export const CELLULAR_PARTICLE_SYSTEMS: Record<
	string,
	CellularParticleSystemConfig
> = {
	"blood-flow": {
		processType: "blood-flow",
		particleCount: 100,
		emissionRate: 5,
		environment: PhysicsEnvironments.bloodstream(),
		bounds: { min: new Vector3(-5, -2, -1), max: new Vector3(5, 2, 1) },
		polishName: "Przepływ krwi",
		description: "Visualization of blood cells flowing through vessels",
		polishDescription:
			"Wizualizacja przepływu krwinek przez naczynia krwionośne",
	},

	"neural-signals": {
		processType: "neural-signals",
		particleCount: 80,
		emissionRate: 8,
		environment: PhysicsEnvironments.synapticCleft(),
		bounds: { min: new Vector3(-4, -2, -1), max: new Vector3(4, 2, 1) },
		polishName: "Sygnały nerwowe",
		description: "Neural signal propagation and neurotransmitter release",
		polishDescription:
			"Propagacja sygnałów nerwowych i uwalnianie neuroprzekaźników",
	},

	"hormone-diffusion": {
		processType: "hormone-diffusion",
		particleCount: 60,
		emissionRate: 3,
		environment: PhysicsEnvironments.extracellularMatrix(),
		bounds: { min: new Vector3(-3, -3, -1), max: new Vector3(3, 3, 1) },
		polishName: "Dyfuzja hormonów",
		description: "Hormone molecules diffusing through tissues",
		polishDescription: "Dyfuzja cząsteczek hormonów przez tkanki",
	},

	"immune-response": {
		processType: "immune-response",
		particleCount: 70,
		emissionRate: 2,
		environment: PhysicsEnvironments.bloodstream(),
		bounds: { min: new Vector3(-4, -2, -1), max: new Vector3(4, 2, 1) },
		polishName: "Odpowiedź immunologiczna",
		description: "Immune cells responding to pathogens",
		polishDescription: "Komórki układu odpornościowego reagujące na patogeny",
	},

	"atp-synthesis": {
		processType: "atp-synthesis",
		particleCount: 90,
		emissionRate: 6,
		environment: PhysicsEnvironments.cellularInterior(),
		bounds: { min: new Vector3(-2, -2, -1), max: new Vector3(2, 2, 1) },
		polishName: "Synteza ATP",
		description: "ATP production in mitochondria",
		polishDescription: "Produkcja ATP w mitochondriach",
	},
};

export default CellularParticleSystem;
