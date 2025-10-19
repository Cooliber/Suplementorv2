"use client";

import {
	BufferGeometry,
	Color,
	CylinderGeometry,
	Float32BufferAttribute,
	Group,
	Mesh,
	MeshBasicMaterial,
	MeshStandardMaterial,
	SphereGeometry,
	Vector3,
} from "three";
import {
	AdvancedParticle,
	type AdvancedParticleConfig,
	AdvancedParticleSystem,
	type PhysicsEnvironment,
} from "./advanced-particle-physics";

// Physiological process types
export type PhysiologicalProcessType =
	| "gas-exchange"
	| "nutrient-absorption"
	| "neurotransmitter-release"
	| "muscle-contraction"
	| "kidney-filtration"
	| "cardiac-cycle"
	| "respiratory-cycle"
	| "digestive-process";

// Physiological simulation configuration
export interface PhysiologicalSimulationConfig {
	processType: PhysiologicalProcessType;
	organSystem: string;
	timeScale: number;
	spatialScale: number;
	polishName: string;
	description: string;
	polishDescription: string;
	parameters: Record<string, number>;
}

// Advanced physiological simulation system
export class PhysiologicalSimulationSystem extends AdvancedParticleSystem {
	public config: PhysiologicalSimulationConfig;
	private simulationTimer = 0;
	private cyclePhase = 0;
	private anatomicalStructures: Group = new Group();

	constructor(
		particleCount: number,
		config: PhysiologicalSimulationConfig,
		environment: PhysicsEnvironment,
	) {
		super(particleCount, environment);
		this.config = config;

		this.initializePhysiologicalSimulation();
	}

	private initializePhysiologicalSimulation(): void {
		this.createAnatomicalStructures();

		switch (this.config.processType) {
			case "gas-exchange":
				this.initializeGasExchange();
				break;
			case "nutrient-absorption":
				this.initializeNutrientAbsorption();
				break;
			case "neurotransmitter-release":
				this.initializeNeurotransmitterRelease();
				break;
			case "muscle-contraction":
				this.initializeMuscleContraction();
				break;
			case "kidney-filtration":
				this.initializeKidneyFiltration();
				break;
			case "cardiac-cycle":
				this.initializeCardiacCycle();
				break;
			case "respiratory-cycle":
				this.initializeRespiratoryCycle();
				break;
			case "digestive-process":
				this.initializeDigestiveProcess();
				break;
		}
	}

	private createAnatomicalStructures(): void {
		// Create basic anatomical structures based on process type
		switch (this.config.processType) {
			case "gas-exchange":
				this.createAlveoli();
				break;
			case "nutrient-absorption":
				this.createIntestinalVilli();
				break;
			case "neurotransmitter-release":
				this.createSynapse();
				break;
			case "muscle-contraction":
				this.createSarcomere();
				break;
			case "kidney-filtration":
				this.createGlomerulus();
				break;
			case "cardiac-cycle":
				this.createHeartChambers();
				break;
			case "respiratory-cycle":
				this.createLungTissue();
				break;
			case "digestive-process":
				this.createDigestiveTract();
				break;
		}
	}

	private createAlveoli(): void {
		// Create alveolar sacs
		for (let i = 0; i < 7; i++) {
			const geometry = new SphereGeometry(0.5, 16, 16);
			const material = new MeshBasicMaterial({
				color: 0xfcd34d,
				transparent: true,
				opacity: 0.3,
				wireframe: true,
			});

			const alveolus = new Mesh(geometry, material);
			alveolus.position.set(((i % 3) - 1) * 1.2, Math.floor(i / 3) * 1.2, 0);
			this.anatomicalStructures.add(alveolus);
		}
	}

	private createIntestinalVilli(): void {
		// Create intestinal villi structures
		for (let i = 0; i < 20; i++) {
			const geometry = new CylinderGeometry(0.05, 0.02, 1, 8);
			const material = new MeshBasicMaterial({
				color: 0xf59e0b,
				transparent: true,
				opacity: 0.6,
			});

			const villus = new Mesh(geometry, material);
			villus.position.set(((i % 5) - 2) * 0.3, Math.floor(i / 5) * 0.3, 0);
			this.anatomicalStructures.add(villus);
		}
	}

	private createSynapse(): void {
		// Create presynaptic and postsynaptic membranes
		const preGeometry = new CylinderGeometry(0.8, 0.8, 0.1, 16);
		const postGeometry = new CylinderGeometry(0.8, 0.8, 0.1, 16);

		const membraneMaterial = new MeshBasicMaterial({
			color: 0x6b7280,
			transparent: true,
			opacity: 0.5,
		});

		const presynaptic = new Mesh(preGeometry, membraneMaterial);
		presynaptic.position.set(0, 0.6, 0);
		presynaptic.rotation.x = Math.PI / 2;

		const postsynaptic = new Mesh(postGeometry, membraneMaterial);
		postsynaptic.position.set(0, -0.6, 0);
		postsynaptic.rotation.x = Math.PI / 2;

		this.anatomicalStructures.add(presynaptic, postsynaptic);

		// Synaptic cleft
		const cleftGeometry = new CylinderGeometry(0.6, 0.6, 0.4, 16);
		const cleftMaterial = new MeshBasicMaterial({
			color: 0xdbeafe,
			transparent: true,
			opacity: 0.2,
		});

		const cleft = new Mesh(cleftGeometry, cleftMaterial);
		cleft.position.set(0, 0, 0);
		this.anatomicalStructures.add(cleft);
	}

	private createSarcomere(): void {
		// Create actin and myosin filaments
		const actinGeometry = new CylinderGeometry(0.02, 0.02, 2, 8);
		const myosinGeometry = new CylinderGeometry(0.03, 0.03, 2, 8);

		const actinMaterial = new MeshBasicMaterial({ color: 0xef4444 });
		const myosinMaterial = new MeshBasicMaterial({ color: 0x3b82f6 });

		for (let i = 0; i < 6; i++) {
			const actin = new Mesh(actinGeometry, actinMaterial);
			actin.position.set(
				((i % 3) - 1) * 0.2,
				(Math.floor(i / 3) - 0.5) * 0.4,
				0,
			);
			this.anatomicalStructures.add(actin);

			const myosin = new Mesh(myosinGeometry, myosinMaterial);
			myosin.position.set(
				((i % 3) - 1) * 0.2 + 0.1,
				(Math.floor(i / 3) - 0.5) * 0.4,
				0,
			);
			this.anatomicalStructures.add(myosin);
		}
	}

	private createGlomerulus(): void {
		// Create glomerular capillaries
		for (let i = 0; i < 12; i++) {
			const geometry = new CylinderGeometry(0.02, 0.02, 1, 8);
			const material = new MeshBasicMaterial({
				color: 0xdc2626,
				transparent: true,
				opacity: 0.7,
			});

			const capillary = new Mesh(geometry, material);
			capillary.position.set(
				Math.cos((i * Math.PI) / 6) * 0.5,
				Math.sin((i * Math.PI) / 6) * 0.5,
				0,
			);
			capillary.lookAt(new Vector3(0, 0, 0));
			this.anatomicalStructures.add(capillary);
		}

		// Bowman's capsule
		const capsuleGeometry = new SphereGeometry(0.8, 16, 16);
		const capsuleMaterial = new MeshBasicMaterial({
			color: 0xfde68a,
			transparent: true,
			opacity: 0.3,
			wireframe: true,
		});

		const capsule = new Mesh(capsuleGeometry, capsuleMaterial);
		this.anatomicalStructures.add(capsule);
	}

	private createHeartChambers(): void {
		// Create simplified heart chambers
		const chambers = [
			{ pos: [-0.5, 0, 0], color: 0xdc2626 }, // Left ventricle
			{ pos: [0.5, 0, 0], color: 0xef4444 }, // Right ventricle
			{ pos: [-0.5, 0.8, 0], color: 0xf87171 }, // Left atrium
			{ pos: [0.5, 0.8, 0], color: 0xfca5a5 }, // Right atrium
		];

		chambers.forEach((chamber) => {
			const geometry = new SphereGeometry(0.6, 16, 16);
			const material = new MeshBasicMaterial({
				color: chamber.color,
				transparent: true,
				opacity: 0.6,
			});

			const mesh = new Mesh(geometry, material);
			mesh.position.set(chamber.pos[0], chamber.pos[1], chamber.pos[2]);
			this.anatomicalStructures.add(mesh);
		});
	}

	private createLungTissue(): void {
		// Create bronchial tree structure
		const bronchiGeometry = new CylinderGeometry(0.1, 0.15, 2, 12);
		const bronchiMaterial = new MeshBasicMaterial({
			color: 0xfcd34d,
			transparent: true,
			opacity: 0.5,
		});

		const bronchus = new Mesh(bronchiGeometry, bronchiMaterial);
		bronchus.position.set(0, 0, 0);
		this.anatomicalStructures.add(bronchus);

		// Add alveoli clusters
		for (let i = 0; i < 3; i++) {
			const clusterGroup = new Group();
			clusterGroup.position.set((i - 1) * 1.5, -1, 0);

			for (let j = 0; j < 5; j++) {
				const alveolusGeometry = new SphereGeometry(0.2, 8, 8);
				const alveolusMaterial = new MeshBasicMaterial({
					color: 0xfde68a,
					transparent: true,
					opacity: 0.4,
					wireframe: true,
				});

				const alveolus = new Mesh(alveolusGeometry, alveolusMaterial);
				alveolus.position.set(((j % 3) - 1) * 0.4, Math.floor(j / 3) * 0.4, 0);
				clusterGroup.add(alveolus);
			}

			this.anatomicalStructures.add(clusterGroup);
		}
	}

	private createDigestiveTract(): void {
		// Create intestinal tract
		const tractGeometry = new CylinderGeometry(0.3, 0.3, 4, 16);
		const tractMaterial = new MeshBasicMaterial({
			color: 0xf59e0b,
			transparent: true,
			opacity: 0.4,
		});

		const tract = new Mesh(tractGeometry, tractMaterial);
		tract.position.set(0, 0, 0);
		this.anatomicalStructures.add(tract);

		// Add villi along the tract
		for (let i = 0; i < 8; i++) {
			const villusGeometry = new CylinderGeometry(0.02, 0.01, 0.5, 6);
			const villusMaterial = new MeshBasicMaterial({
				color: 0xfde68a,
				transparent: true,
				opacity: 0.7,
			});

			const villus = new Mesh(villusGeometry, villusMaterial);
			villus.position.set(
				Math.cos((i * Math.PI) / 4) * 0.25,
				(i - 4) * 0.3,
				Math.sin((i * Math.PI) / 4) * 0.25,
			);
			this.anatomicalStructures.add(villus);
		}
	}

	private initializeGasExchange(): void {
		// Create oxygen molecules
		for (let i = 0; i < this.particles.size * 0.4; i++) {
			const position = new Vector3(
				(Math.random() - 0.5) * 6,
				(Math.random() - 0.5) * 6,
				-1,
			);

			const oxygenConfig: AdvancedParticleConfig = {
				mass: 5.3e-26, // kg
				charge: 0,
				radius: 0.00015, // 0.15 nm
				damping: 0.99,
				biologicalType: "gas-molecule",
				halfLife: Number.POSITIVE_INFINITY,
				diffusionCoefficient: 2.1e-5, // m²/s (gas diffusion)
				color: new Color(0x3b82f6),
				opacity: 0.8,
				size: 0.003,
				interactionRadius: 0.008,
				bindingStrength: 0.3,
				repulsionStrength: 0.4,
			};

			const particle = new AdvancedParticle(`o2-${i}`, position, oxygenConfig);
			this.addParticle(particle);
		}

		// Create carbon dioxide molecules
		for (let i = 0; i < this.particles.size * 0.3; i++) {
			const position = new Vector3(
				(Math.random() - 0.5) * 6,
				(Math.random() - 0.5) * 6,
				1,
			);

			const co2Config: AdvancedParticleConfig = {
				mass: 7.3e-26,
				charge: 0,
				radius: 0.00016,
				damping: 0.99,
				biologicalType: "gas-molecule",
				halfLife: Number.POSITIVE_INFINITY,
				diffusionCoefficient: 1.6e-5,
				color: new Color(0x6b7280),
				opacity: 0.8,
				size: 0.003,
				interactionRadius: 0.008,
				bindingStrength: 0.2,
				repulsionStrength: 0.3,
			};

			const particle = new AdvancedParticle(`co2-${i}`, position, co2Config);
			this.addParticle(particle);
		}

		// Create red blood cells in capillaries
		for (let i = 0; i < this.particles.size * 0.3; i++) {
			const position = new Vector3(
				(Math.random() - 0.5) * 4,
				(Math.random() - 0.5) * 4,
				0,
			);

			const rbcConfig: AdvancedParticleConfig = {
				mass: 1e-13,
				charge: -1,
				radius: 0.004,
				damping: 0.95,
				biologicalType: "blood-cell",
				halfLife: 120 * 24 * 3600,
				diffusionCoefficient: 1e-14,
				color: new Color(0xdc2626),
				opacity: 0.8,
				size: 0.008,
				interactionRadius: 0.02,
				bindingStrength: 0.6,
				repulsionStrength: 0.5,
			};

			const particle = new AdvancedParticle(
				`rbc-gas-${i}`,
				position,
				rbcConfig,
			);
			this.addParticle(particle);
		}
	}

	private initializeNutrientAbsorption(): void {
		// Create nutrient molecules (glucose, amino acids, etc.)
		const nutrientTypes = [
			{ name: "glucose", color: 0x10b981, mass: 3e-19 },
			{ name: "amino-acid", color: 0x3b82f6, mass: 1.5e-19 },
			{ name: "fatty-acid", color: 0xf59e0b, mass: 4e-19 },
		];

		nutrientTypes.forEach((nutrient, typeIndex) => {
			for (let i = 0; i < Math.floor(this.particles.size * 0.3); i++) {
				const position = new Vector3(
					(Math.random() - 0.5) * 4,
					(Math.random() - 0.5) * 4,
					-1,
				);

				const nutrientConfig: AdvancedParticleConfig = {
					mass: nutrient.mass,
					charge: 0,
					radius: 0.001,
					damping: 0.98,
					biologicalType: "nutrient",
					halfLife: 3600,
					diffusionCoefficient: 1e-10,
					color: new Color(nutrient.color),
					opacity: 0.7,
					size: 0.003,
					interactionRadius: 0.008,
					bindingStrength: 0.5,
					repulsionStrength: 0.2,
				};

				const particle = new AdvancedParticle(
					`${nutrient.name}-${i}`,
					position,
					nutrientConfig,
				);
				this.addParticle(particle);
			}
		});

		// Create transport proteins on villi
		for (let i = 0; i < this.particles.size * 0.1; i++) {
			const position = new Vector3(
				(Math.random() - 0.5) * 3,
				(Math.random() - 0.5) * 3,
				0,
			);

			const transporterConfig: AdvancedParticleConfig = {
				mass: 1e-14,
				charge: 0,
				radius: 0.003,
				damping: 1.0,
				biologicalType: "transporter",
				halfLife: Number.POSITIVE_INFINITY,
				diffusionCoefficient: 0,
				color: new Color(0x8b5cf6),
				opacity: 0.9,
				size: 0.008,
				interactionRadius: 0.02,
				bindingStrength: 0.8,
				repulsionStrength: 0.1,
			};

			const particle = new AdvancedParticle(
				`transporter-${i}`,
				position,
				transporterConfig,
			);
			this.addParticle(particle);
		}
	}

	private initializeNeurotransmitterRelease(): void {
		// Create synaptic vesicles
		for (let i = 0; i < this.particles.size * 0.4; i++) {
			const position = new Vector3(
				(Math.random() - 0.5) * 1.2,
				0.4,
				(Math.random() - 0.5) * 1.2,
			);

			const vesicleConfig: AdvancedParticleConfig = {
				mass: 1e-17,
				charge: -1,
				radius: 0.002,
				damping: 0.98,
				biologicalType: "vesicle",
				halfLife: 1800,
				diffusionCoefficient: 1e-11,
				color: new Color(0x8b5cf6),
				opacity: 0.8,
				size: 0.006,
				interactionRadius: 0.015,
				bindingStrength: 0.7,
				repulsionStrength: 0.3,
			};

			const particle = new AdvancedParticle(
				`vesicle-${i}`,
				position,
				vesicleConfig,
			);
			this.addParticle(particle);
		}

		// Create neurotransmitters
		for (let i = 0; i < this.particles.size * 0.3; i++) {
			const position = new Vector3(
				(Math.random() - 0.5) * 1.2,
				0,
				(Math.random() - 0.5) * 1.2,
			);

			const ntConfig: AdvancedParticleConfig = {
				mass: 1e-19,
				charge: 1,
				radius: 0.0008,
				damping: 0.97,
				biologicalType: "neurotransmitter",
				halfLife: 60,
				diffusionCoefficient: 6e-10,
				color: new Color(0xec4899),
				opacity: 0.9,
				size: 0.003,
				interactionRadius: 0.008,
				bindingStrength: 0.9,
				repulsionStrength: 0.1,
			};

			const particle = new AdvancedParticle(
				`neurotransmitter-${i}`,
				position,
				ntConfig,
			);
			this.addParticle(particle);
		}

		// Create postsynaptic receptors
		for (let i = 0; i < this.particles.size * 0.3; i++) {
			const position = new Vector3(
				(Math.random() - 0.5) * 1.2,
				-0.4,
				(Math.random() - 0.5) * 1.2,
			);

			const receptorConfig: AdvancedParticleConfig = {
				mass: 1e-15,
				charge: -1,
				radius: 0.002,
				damping: 1.0,
				biologicalType: "receptor",
				halfLife: Number.POSITIVE_INFINITY,
				diffusionCoefficient: 0,
				color: new Color(0xef4444),
				opacity: 0.9,
				size: 0.006,
				interactionRadius: 0.02,
				bindingStrength: 0.9,
				repulsionStrength: 0.1,
			};

			const particle = new AdvancedParticle(
				`postsynaptic-receptor-${i}`,
				position,
				receptorConfig,
			);
			this.addParticle(particle);
		}
	}

	private initializeMuscleContraction(): void {
		// Create calcium ions
		for (let i = 0; i < this.particles.size * 0.4; i++) {
			const position = new Vector3(
				(Math.random() - 0.5) * 4,
				(Math.random() - 0.5) * 4,
				0,
			);

			const caConfig: AdvancedParticleConfig = {
				mass: 6.6e-26,
				charge: 2,
				radius: 0.0001,
				damping: 0.98,
				biologicalType: "ion",
				halfLife: Number.POSITIVE_INFINITY,
				diffusionCoefficient: 8e-10,
				color: new Color(0xec4899),
				opacity: 0.8,
				size: 0.002,
				interactionRadius: 0.005,
				bindingStrength: 0.4,
				repulsionStrength: 0.8,
			};

			const particle = new AdvancedParticle(`ca-${i}`, position, caConfig);
			this.addParticle(particle);
		}

		// Create troponin complexes
		for (let i = 0; i < this.particles.size * 0.3; i++) {
			const position = new Vector3(
				(Math.random() - 0.5) * 4,
				(Math.random() - 0.5) * 4,
				0,
			);

			const troponinConfig: AdvancedParticleConfig = {
				mass: 1e-15,
				charge: -2,
				radius: 0.002,
				damping: 1.0,
				biologicalType: "regulatory-protein",
				halfLife: Number.POSITIVE_INFINITY,
				diffusionCoefficient: 0,
				color: new Color(0x059669),
				opacity: 0.8,
				size: 0.006,
				interactionRadius: 0.02,
				bindingStrength: 0.8,
				repulsionStrength: 0.2,
			};

			const particle = new AdvancedParticle(
				`troponin-${i}`,
				position,
				troponinConfig,
			);
			this.addParticle(particle);
		}
	}

	private initializeKidneyFiltration(): void {
		// Create blood plasma particles
		for (let i = 0; i < this.particles.size * 0.4; i++) {
			const position = new Vector3(
				(Math.random() - 0.5) * 1.2,
				(Math.random() - 0.5) * 1.2,
				-0.5,
			);

			const plasmaConfig: AdvancedParticleConfig = {
				mass: 1e-18,
				charge: 0,
				radius: 0.001,
				damping: 0.98,
				biologicalType: "plasma-molecule",
				halfLife: 3600,
				diffusionCoefficient: 1e-10,
				color: new Color(0xfcd34d),
				opacity: 0.7,
				size: 0.003,
				interactionRadius: 0.008,
				bindingStrength: 0.3,
				repulsionStrength: 0.2,
			};

			const particle = new AdvancedParticle(
				`plasma-${i}`,
				position,
				plasmaConfig,
			);
			this.addParticle(particle);
		}

		// Create filtrate particles
		for (let i = 0; i < this.particles.size * 0.3; i++) {
			const position = new Vector3(
				(Math.random() - 0.5) * 1.2,
				(Math.random() - 0.5) * 1.2,
				0.5,
			);

			const filtrateConfig: AdvancedParticleConfig = {
				mass: 1e-18,
				charge: 0,
				radius: 0.001,
				damping: 0.98,
				biologicalType: "filtrate",
				halfLife: 3600,
				diffusionCoefficient: 1e-10,
				color: new Color(0xdbeafe),
				opacity: 0.7,
				size: 0.003,
				interactionRadius: 0.008,
				bindingStrength: 0.2,
				repulsionStrength: 0.2,
			};

			const particle = new AdvancedParticle(
				`filtrate-${i}`,
				position,
				filtrateConfig,
			);
			this.addParticle(particle);
		}

		// Create podocytes (filtration cells)
		for (let i = 0; i < this.particles.size * 0.3; i++) {
			const position = new Vector3(
				(Math.random() - 0.5) * 1.2,
				(Math.random() - 0.5) * 1.2,
				0,
			);

			const podocyteConfig: AdvancedParticleConfig = {
				mass: 1e-12,
				charge: -1,
				radius: 0.005,
				damping: 1.0,
				biologicalType: "podocyte",
				halfLife: Number.POSITIVE_INFINITY,
				diffusionCoefficient: 0,
				color: new Color(0x7c3aed),
				opacity: 0.8,
				size: 0.01,
				interactionRadius: 0.02,
				bindingStrength: 0.5,
				repulsionStrength: 0.4,
			};

			const particle = new AdvancedParticle(
				`podocyte-${i}`,
				position,
				podocyteConfig,
			);
			this.addParticle(particle);
		}
	}

	private initializeCardiacCycle(): void {
		// Create blood particles in heart chambers
		for (let i = 0; i < this.particles.size * 0.6; i++) {
			const chamber = i % 4;
			const baseX = chamber < 2 ? -0.5 : 0.5;
			const baseY = chamber % 2 === 0 ? 0 : 0.8;

			const position = new Vector3(
				baseX + (Math.random() - 0.5) * 0.8,
				baseY + (Math.random() - 0.5) * 0.4,
				(Math.random() - 0.5) * 0.8,
			);

			const bloodConfig: AdvancedParticleConfig = {
				mass: 1e-13,
				charge: -1,
				radius: 0.004,
				damping: 0.95,
				biologicalType: "blood-cell",
				halfLife: 120 * 24 * 3600,
				diffusionCoefficient: 1e-14,
				color: new Color(0xdc2626),
				opacity: 0.8,
				size: 0.008,
				interactionRadius: 0.02,
				bindingStrength: 0.4,
				repulsionStrength: 0.5,
			};

			const particle = new AdvancedParticle(
				`cardiac-blood-${i}`,
				position,
				bloodConfig,
			);
			this.addParticle(particle);
		}

		// Create heart valve structures
		for (let i = 0; i < 4; i++) {
			const valveConfig: AdvancedParticleConfig = {
				mass: 1e-12,
				charge: 0,
				radius: 0.006,
				damping: 1.0,
				biologicalType: "valve",
				halfLife: Number.POSITIVE_INFINITY,
				diffusionCoefficient: 0,
				color: new Color(0x6b7280),
				opacity: 0.9,
				size: 0.012,
				interactionRadius: 0.02,
				bindingStrength: 0.3,
				repulsionStrength: 0.3,
			};

			const position = new Vector3(
				i % 2 === 0 ? -0.8 : 0.8,
				i < 2 ? -0.2 : 1.0,
				0,
			);

			const particle = new AdvancedParticle(
				`valve-${i}`,
				position,
				valveConfig,
			);
			this.addParticle(particle);
		}
	}

	private initializeRespiratoryCycle(): void {
		// Create air particles
		for (let i = 0; i < this.particles.size * 0.5; i++) {
			const position = new Vector3(
				(Math.random() - 0.5) * 8,
				1 + Math.random() * 2,
				(Math.random() - 0.5) * 8,
			);

			const airConfig: AdvancedParticleConfig = {
				mass: 4.8e-26, // Nitrogen molecule mass
				charge: 0,
				radius: 0.0002,
				damping: 0.99,
				biologicalType: "gas-molecule",
				halfLife: Number.POSITIVE_INFINITY,
				diffusionCoefficient: 2.1e-5,
				color: new Color(0xe5e7eb),
				opacity: 0.6,
				size: 0.002,
				interactionRadius: 0.006,
				bindingStrength: 0.1,
				repulsionStrength: 0.2,
			};

			const particle = new AdvancedParticle(`air-${i}`, position, airConfig);
			this.addParticle(particle);
		}

		// Create surfactant molecules
		for (let i = 0; i < this.particles.size * 0.2; i++) {
			const position = new Vector3(
				(Math.random() - 0.5) * 6,
				(Math.random() - 0.5) * 6,
				0,
			);

			const surfactantConfig: AdvancedParticleConfig = {
				mass: 1e-18,
				charge: -1,
				radius: 0.001,
				damping: 0.98,
				biologicalType: "surfactant",
				halfLife: 7200,
				diffusionCoefficient: 1e-10,
				color: new Color(0xfcd34d),
				opacity: 0.7,
				size: 0.003,
				interactionRadius: 0.008,
				bindingStrength: 0.6,
				repulsionStrength: 0.2,
			};

			const particle = new AdvancedParticle(
				`surfactant-${i}`,
				position,
				surfactantConfig,
			);
			this.addParticle(particle);
		}
	}

	private initializeDigestiveProcess(): void {
		// Create food particles
		for (let i = 0; i < this.particles.size * 0.4; i++) {
			const position = new Vector3(
				(Math.random() - 0.5) * 2,
				1.5,
				(Math.random() - 0.5) * 2,
			);

			const foodConfig: AdvancedParticleConfig = {
				mass: 1e-15,
				charge: 0,
				radius: 0.002,
				damping: 0.96,
				biologicalType: "food-particle",
				halfLife: 1800,
				diffusionCoefficient: 1e-11,
				color: new Color(0x92400e),
				opacity: 0.8,
				size: 0.006,
				interactionRadius: 0.015,
				bindingStrength: 0.4,
				repulsionStrength: 0.3,
			};

			const particle = new AdvancedParticle(`food-${i}`, position, foodConfig);
			this.addParticle(particle);
		}

		// Create digestive enzymes
		for (let i = 0; i < this.particles.size * 0.3; i++) {
			const position = new Vector3(
				(Math.random() - 0.5) * 2,
				(Math.random() - 0.5) * 2,
				(Math.random() - 0.5) * 2,
			);

			const enzymeConfig: AdvancedParticleConfig = {
				mass: 1e-14,
				charge: 0,
				radius: 0.003,
				damping: 1.0,
				biologicalType: "enzyme",
				halfLife: Number.POSITIVE_INFINITY,
				diffusionCoefficient: 5e-11,
				color: new Color(0x059669),
				opacity: 0.8,
				size: 0.008,
				interactionRadius: 0.02,
				bindingStrength: 0.8,
				repulsionStrength: 0.1,
			};

			const particle = new AdvancedParticle(
				`digestive-enzyme-${i}`,
				position,
				enzymeConfig,
			);
			this.addParticle(particle);
		}
	}

	// Update physiological processes
	public update(deltaTime: number): void {
		super.update(deltaTime);

		this.simulationTimer += deltaTime;
		this.cyclePhase =
			(this.simulationTimer * this.config.timeScale) % (Math.PI * 2);

		// Update process-specific behaviors
		this.updatePhysiologicalProcess(deltaTime);
	}

	private updatePhysiologicalProcess(deltaTime: number): void {
		switch (this.config.processType) {
			case "gas-exchange":
				this.updateGasExchange(deltaTime);
				break;
			case "nutrient-absorption":
				this.updateNutrientAbsorption(deltaTime);
				break;
			case "neurotransmitter-release":
				this.updateNeurotransmitterRelease(deltaTime);
				break;
			case "muscle-contraction":
				this.updateMuscleContraction(deltaTime);
				break;
			case "kidney-filtration":
				this.updateKidneyFiltration(deltaTime);
				break;
			case "cardiac-cycle":
				this.updateCardiacCycle(deltaTime);
				break;
			case "respiratory-cycle":
				this.updateRespiratoryCycle(deltaTime);
				break;
			case "digestive-process":
				this.updateDigestiveProcess(deltaTime);
				break;
		}
	}

	private updateGasExchange(deltaTime: number): void {
		const particles = this.getActiveParticles();
		const gasMolecules = particles.filter(
			(p) => p.config.biologicalType === "gas-molecule",
		);
		const bloodCells = particles.filter(
			(p) => p.config.biologicalType === "blood-cell",
		);

		// Simulate breathing cycle
		const breathingPhase = Math.sin(this.cyclePhase);
		const alveoli = this.anatomicalStructures.children;

		alveoli.forEach((alveolus, index) => {
			if (alveolus instanceof Mesh) {
				// Animate alveolar expansion/contraction
				const scale = 1 + breathingPhase * 0.1;
				alveolus.scale.setScalar(scale);
			}
		});

		// Gas exchange between alveoli and blood
		gasMolecules.forEach((gas) => {
			bloodCells.forEach((bloodCell) => {
				const distance = gas.position.distanceTo(bloodCell.position);
				if (distance < 0.1) {
					// Exchange gases
					if (gas.id.startsWith("o2") && bloodCell.position.z < 0) {
						// Oxygen loading into blood
						gas.position.z = bloodCell.position.z;
						gas.color.setHex(0x1e40af); // Darker blue when bound
					} else if (gas.id.startsWith("co2") && bloodCell.position.z > 0) {
						// CO2 unloading from blood
						gas.position.z = 0;
						gas.color.setHex(0x374151); // Darker gray when free
					}
				}
			});
		});
	}

	private updateNutrientAbsorption(deltaTime: number): void {
		const particles = this.getActiveParticles();
		const nutrients = particles.filter(
			(p) => p.config.biologicalType === "nutrient",
		);
		const transporters = particles.filter(
			(p) => p.config.biologicalType === "transporter",
		);

		nutrients.forEach((nutrient) => {
			if (nutrient.position.z < -0.5) {
				transporters.forEach((transporter) => {
					const distance = nutrient.position.distanceTo(transporter.position);
					if (distance < 0.3 && Math.random() < 0.02) {
						// Active transport across membrane
						nutrient.position.z = 0.5;
						nutrient.color.setHex(0x065f46); // Darker green when absorbed
					}
				});
			}
		});
	}

	private updateNeurotransmitterRelease(deltaTime: number): void {
		const particles = this.getActiveParticles();
		const vesicles = particles.filter(
			(p) => p.config.biologicalType === "vesicle",
		);

		vesicles.forEach((vesicle) => {
			// Move vesicles toward presynaptic membrane
			vesicle.position.y -= 0.01;

			if (vesicle.position.y < 0.5) {
				// Release neurotransmitters
				if (Math.random() < 0.1) {
					vesicle.position.y = 0.3;
					vesicle.color.setHex(0x7c2d12); // Released state
				}
			}
		});
	}

	private updateMuscleContraction(deltaTime: number): void {
		const particles = this.getActiveParticles();
		const caIons = particles.filter((p) => p.config.biologicalType === "ion");
		const troponin = particles.filter(
			(p) => p.config.biologicalType === "regulatory-protein",
		);

		// Simulate calcium-troponin binding
		caIons.forEach((ca) => {
			troponin.forEach((tn) => {
				const distance = ca.position.distanceTo(tn.position);
				if (distance < 0.1 && Math.random() < 0.05) {
					tn.color.setHex(0x059669); // Activated state
					ca.color.setHex(0xbe185d); // Bound state
				}
			});
		});

		// Animate sarcomere contraction
		const contractionPhase = Math.sin(this.cyclePhase * 2);
		const actinMyosin = this.anatomicalStructures.children;

		actinMyosin.forEach((filament, index) => {
			if (filament instanceof Mesh) {
				filament.position.x += contractionPhase * 0.001;
			}
		});
	}

	private updateKidneyFiltration(deltaTime: number): void {
		const particles = this.getActiveParticles();
		const plasma = particles.filter(
			(p) => p.config.biologicalType === "plasma-molecule",
		);
		const podocytes = particles.filter(
			(p) => p.config.biologicalType === "podocyte",
		);

		plasma.forEach((plasmaMol) => {
			if (plasmaMol.position.z < 0) {
				podocytes.forEach((podocyte) => {
					const distance = plasmaMol.position.distanceTo(podocyte.position);
					if (distance < 0.2 && Math.random() < 0.01) {
						// Filter plasma into filtrate
						plasmaMol.position.z = 0.5;
						plasmaMol.config.biologicalType = "filtrate";
						plasmaMol.color.setHex(0x3b82f6);
					}
				});
			}
		});
	}

	private updateCardiacCycle(deltaTime: number): void {
		// Animate heart chambers
		const heartPhase = Math.sin(this.cyclePhase * 3);
		const chambers = this.anatomicalStructures.children;

		chambers.forEach((chamber, index) => {
			if (chamber instanceof Mesh) {
				const pulseScale = 1 + Math.abs(heartPhase) * 0.1;
				chamber.scale.setScalar(pulseScale);
			}
		});

		// Animate blood flow through chambers
		const particles = this.getActiveParticles();
		const bloodCells = particles.filter(
			(p) => p.config.biologicalType === "blood-cell",
		);

		bloodCells.forEach((bloodCell) => {
			// Simulate blood movement through heart
			bloodCell.position.x += Math.sin(this.cyclePhase * 2) * 0.02;
			bloodCell.position.y += Math.cos(this.cyclePhase * 2) * 0.01;
		});
	}

	private updateRespiratoryCycle(deltaTime: number): void {
		// Animate lung expansion/contraction
		const breathingPhase = Math.sin(this.cyclePhase);
		const lungStructures = this.anatomicalStructures.children;

		lungStructures.forEach((structure) => {
			if (structure instanceof Mesh) {
				const breatheScale = 1 + breathingPhase * 0.15;
				structure.scale.setScalar(breatheScale);
			}
		});

		// Animate air flow
		const particles = this.getActiveParticles();
		const airMolecules = particles.filter(
			(p) => p.config.biologicalType === "gas-molecule",
		);

		airMolecules.forEach((air) => {
			air.position.y += breathingPhase * 0.01;
		});
	}

	private updateDigestiveProcess(deltaTime: number): void {
		const particles = this.getActiveParticles();
		const foodParticles = particles.filter(
			(p) => p.config.biologicalType === "food-particle",
		);
		const enzymes = particles.filter(
			(p) => p.config.biologicalType === "enzyme",
		);

		foodParticles.forEach((food) => {
			enzymes.forEach((enzyme) => {
				const distance = food.position.distanceTo(enzyme.position);
				if (distance < 0.2 && Math.random() < 0.02) {
					// Digestion: break down food particles
					food.size *= 0.98;
					food.color.setHex(0x7c2d12); // Darker when digested

					if (food.size < 0.002) {
						food.active = false; // Fully digested
					}
				}
			});
		});
	}

	// Get anatomical structures for rendering
	public getAnatomicalStructures(): Group {
		return this.anatomicalStructures;
	}

	// Get process-specific statistics
	public getProcessStats(): {
		processType: PhysiologicalProcessType;
		cyclePhase: number;
		efficiency: number;
		particleActivity: number;
		bindingEvents: number;
	} {
		const particles = this.getActiveParticles();
		const bindingEvents = particles.reduce(
			(sum, p) => sum + p.boundParticles.size,
			0,
		);
		const averageVelocity =
			particles.reduce((sum, p) => sum + p.velocity.length(), 0) /
				particles.length || 0;

		// Calculate efficiency based on process parameters
		const efficiency = Math.min(
			1,
			0.5 + averageVelocity * 2 + bindingEvents * 0.1,
		);

		return {
			processType: this.config.processType,
			cyclePhase: this.cyclePhase,
			efficiency,
			particleActivity: averageVelocity,
			bindingEvents,
		};
	}
}

// Predefined physiological simulation configurations
export const PHYSIOLOGICAL_SIMULATIONS: Record<
	string,
	PhysiologicalSimulationConfig
> = {
	"gas-exchange": {
		processType: "gas-exchange",
		organSystem: "respiratory",
		timeScale: 1.0,
		spatialScale: 1e-6,
		polishName: "Wymiana gazowa",
		description: "Gas exchange in alveoli",
		polishDescription: "Wymiana gazowa w pęcherzykach płucnych",
		parameters: {
			diffusionRate: 2.1e-5,
			membranePermeability: 0.8,
			bloodFlowRate: 0.1,
		},
	},

	"nutrient-absorption": {
		processType: "nutrient-absorption",
		organSystem: "digestive",
		timeScale: 0.5,
		spatialScale: 1e-6,
		polishName: "Wchłanianie składników odżywczych",
		description: "Nutrient absorption in intestinal villi",
		polishDescription:
			"Wchłanianie składników odżywczych w kosmkach jelitowych",
		parameters: {
			transportRate: 0.02,
			carrierDensity: 0.1,
			concentrationGradient: 0.8,
		},
	},

	"neurotransmitter-release": {
		processType: "neurotransmitter-release",
		organSystem: "nervous",
		timeScale: 2.0,
		spatialScale: 1e-9,
		polishName: "Uwalnianie neuroprzekaźników",
		description: "Neurotransmitter release at synapse",
		polishDescription: "Uwalnianie neuroprzekaźników w synapsie",
		parameters: {
			vesicleReleaseRate: 0.1,
			receptorDensity: 0.3,
			reuptakeRate: 0.05,
		},
	},

	"muscle-contraction": {
		processType: "muscle-contraction",
		organSystem: "muscular",
		timeScale: 1.5,
		spatialScale: 1e-6,
		polishName: "Skurcz mięśni",
		description: "Muscle contraction at sarcomere level",
		polishDescription: "Skurcz mięśni na poziomie sarkomerów",
		parameters: {
			calciumSensitivity: 0.8,
			crossBridgeCycling: 0.6,
			atpConsumption: 0.4,
		},
	},

	"kidney-filtration": {
		processType: "kidney-filtration",
		organSystem: "urinary",
		timeScale: 0.3,
		spatialScale: 1e-6,
		polishName: "Filtrowanie nerkowe",
		description: "Kidney filtration in glomerulus",
		polishDescription: "Filtrowanie nerkowe w kłębuszku nerkowym",
		parameters: {
			filtrationRate: 0.01,
			poreSize: 0.005,
			pressureGradient: 0.7,
		},
	},
};

export default PhysiologicalSimulationSystem;
