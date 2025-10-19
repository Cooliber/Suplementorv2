"use client";

import {
	Color,
	CylinderGeometry,
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

// Molecular interaction types
export type MolecularInteractionType =
	| "supplement-transport"
	| "receptor-binding"
	| "enzyme-catalysis"
	| "dna-transcription"
	| "ion-channel"
	| "membrane-transport"
	| "protein-folding"
	| "signal-transduction";

// Molecular interaction configuration
export interface MolecularInteractionConfig {
	interactionType: MolecularInteractionType;
	moleculeType: string;
	targetType: string;
	bindingAffinity: number;
	reactionRate: number;
	activationEnergy: number;
	polishName: string;
	description: string;
	polishDescription: string;
}

// Advanced molecular interaction system
export class MolecularInteractionSystem extends AdvancedParticleSystem {
	public config: MolecularInteractionConfig;
	private interactionTimer = 0;
	private reactionSites: AdvancedParticle[] = [];
	private bindingEvents: Array<{
		time: number;
		particle1: string;
		particle2: string;
		type: string;
	}> = [];

	constructor(
		particleCount: number,
		config: MolecularInteractionConfig,
		environment: PhysicsEnvironment,
	) {
		super(particleCount, environment);
		this.config = config;

		this.initializeMolecularSystem();
	}

	private initializeMolecularSystem(): void {
		switch (this.config.interactionType) {
			case "supplement-transport":
				this.initializeSupplementTransport();
				break;
			case "receptor-binding":
				this.initializeReceptorBinding();
				break;
			case "enzyme-catalysis":
				this.initializeEnzymeCatalysis();
				break;
			case "dna-transcription":
				this.initializeDNATranscription();
				break;
			case "ion-channel":
				this.initializeIonChannel();
				break;
			case "membrane-transport":
				this.initializeMembraneTransport();
				break;
			case "protein-folding":
				this.initializeProteinFolding();
				break;
			case "signal-transduction":
				this.initializeSignalTransduction();
				break;
		}
	}

	private initializeSupplementTransport(): void {
		// Create supplement molecules
		for (let i = 0; i < this.particles.size * 0.6; i++) {
			const position = new Vector3(
				(Math.random() - 0.5) * 8,
				(Math.random() - 0.5) * 8,
				-2,
			);

			const supplementConfig: AdvancedParticleConfig = {
				mass: 1e-18,
				charge: 0,
				radius: 0.001,
				damping: 0.98,
				biologicalType: "supplement-molecule",
				halfLife: 3600,
				diffusionCoefficient: 1e-10,
				color: new Color(0x10b981),
				opacity: 0.8,
				size: 0.004,
				interactionRadius: 0.01,
				bindingStrength: 0.5,
				repulsionStrength: 0.3,
			};

			const particle = new AdvancedParticle(
				`supplement-${i}`,
				position,
				supplementConfig,
			);
			this.addParticle(particle);
		}

		// Create cell membrane
		this.createMembrane();
	}

	private initializeReceptorBinding(): void {
		// Create ligand molecules (supplements/neurotransmitters)
		for (let i = 0; i < this.particles.size * 0.7; i++) {
			const position = new Vector3(
				(Math.random() - 0.5) * 6,
				(Math.random() - 0.5) * 6,
				0,
			);

			const ligandConfig: AdvancedParticleConfig = {
				mass: 1e-19,
				charge: 1,
				radius: 0.0008,
				damping: 0.97,
				biologicalType: "ligand",
				halfLife: 1800,
				diffusionCoefficient: 8e-10,
				color: new Color(0x8b5cf6),
				opacity: 0.8,
				size: 0.003,
				interactionRadius: 0.008,
				bindingStrength: 0.8,
				repulsionStrength: 0.2,
			};

			const particle = new AdvancedParticle(
				`ligand-${i}`,
				position,
				ligandConfig,
			);
			this.addParticle(particle);
		}

		// Create receptors on cell surface
		for (let i = 0; i < this.particles.size * 0.3; i++) {
			const angle = (i / (this.particles.size * 0.3)) * Math.PI * 2;
			const radius = 3;
			const position = new Vector3(
				Math.cos(angle) * radius,
				Math.sin(angle) * radius,
				0,
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
				`receptor-${i}`,
				position,
				receptorConfig,
			);
			this.reactionSites.push(particle);
			this.addParticle(particle);
		}
	}

	private initializeEnzymeCatalysis(): void {
		// Create substrate molecules
		for (let i = 0; i < this.particles.size * 0.6; i++) {
			const position = new Vector3(
				(Math.random() - 0.5) * 6,
				(Math.random() - 0.5) * 6,
				0,
			);

			const substrateConfig: AdvancedParticleConfig = {
				mass: 2e-19,
				charge: 0,
				radius: 0.001,
				damping: 0.98,
				biologicalType: "substrate",
				halfLife: 3600,
				diffusionCoefficient: 1e-10,
				color: new Color(0xf59e0b),
				opacity: 0.7,
				size: 0.003,
				interactionRadius: 0.008,
				bindingStrength: 0.6,
				repulsionStrength: 0.2,
			};

			const particle = new AdvancedParticle(
				`substrate-${i}`,
				position,
				substrateConfig,
			);
			this.addParticle(particle);
		}

		// Create enzyme molecules
		for (let i = 0; i < this.particles.size * 0.2; i++) {
			const position = new Vector3(
				(Math.random() - 0.5) * 6,
				(Math.random() - 0.5) * 6,
				0,
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
				`enzyme-${i}`,
				position,
				enzymeConfig,
			);
			this.reactionSites.push(particle);
			this.addParticle(particle);
		}
	}

	private initializeDNATranscription(): void {
		// Create DNA strand (stationary)
		this.createDNAStrand();

		// Create RNA polymerase
		const polymeraseConfig: AdvancedParticleConfig = {
			mass: 1e-13,
			charge: 0,
			radius: 0.004,
			damping: 0.99,
			biologicalType: "enzyme",
			halfLife: Number.POSITIVE_INFINITY,
			diffusionCoefficient: 1e-11,
			color: new Color(0x7c3aed),
			opacity: 0.9,
			size: 0.01,
			interactionRadius: 0.02,
			bindingStrength: 0.7,
			repulsionStrength: 0.2,
		};

		const polymerase = new AdvancedParticle(
			"rna-polymerase",
			new Vector3(-3, 0, 0),
			polymeraseConfig,
		);
		this.addParticle(polymerase);

		// Create nucleotides
		for (let i = 0; i < this.particles.size * 0.4; i++) {
			const position = new Vector3(
				(Math.random() - 0.5) * 8,
				(Math.random() - 0.5) * 8,
				0,
			);

			const nucleotideConfig: AdvancedParticleConfig = {
				mass: 1e-19,
				charge: -1,
				radius: 0.0008,
				damping: 0.97,
				biologicalType: "nucleotide",
				halfLife: 7200,
				diffusionCoefficient: 2e-10,
				color: new Color(0x06b6d4),
				opacity: 0.7,
				size: 0.002,
				interactionRadius: 0.006,
				bindingStrength: 0.5,
				repulsionStrength: 0.3,
			};

			const particle = new AdvancedParticle(
				`nucleotide-${i}`,
				position,
				nucleotideConfig,
			);
			this.addParticle(particle);
		}
	}

	private initializeIonChannel(): void {
		// Create ion channel (stationary structure)
		this.createIonChannel();

		// Create ions (sodium, potassium, calcium)
		const ionTypes = [
			{ name: "sodium", color: 0x3b82f6, charge: 1 },
			{ name: "potassium", color: 0xf97316, charge: 1 },
			{ name: "calcium", color: 0xec4899, charge: 2 },
		];

		for (let type = 0; type < ionTypes.length; type++) {
			const ionType = ionTypes[type];
			for (let i = 0; i < this.particles.size * 0.2; i++) {
				const position = new Vector3(
					(Math.random() - 0.5) * 8,
					(Math.random() - 0.5) * 8,
					type * 2 - 2, // Distribute by type
				);

				const ionConfig: AdvancedParticleConfig = {
					mass: type === 0 ? 3.8e-26 : type === 1 ? 6.5e-26 : 6.6e-26,
					charge: ionType.charge * 1.6e-19,
					radius: 0.0001,
					damping: 0.98,
					biologicalType: "ion",
					halfLife: Number.POSITIVE_INFINITY,
					diffusionCoefficient: type === 0 ? 1.3e-9 : type === 1 ? 2e-9 : 8e-10,
					color: new Color(ionType.color),
					opacity: 0.8,
					size: 0.002,
					interactionRadius: 0.005,
					bindingStrength: 0.3,
					repulsionStrength: 0.8,
				};

				const particle = new AdvancedParticle(
					`${ionType.name}-${i}`,
					position,
					ionConfig,
				);
				this.addParticle(particle);
			}
		}
	}

	private initializeMembraneTransport(): void {
		// Create cell membrane layers
		this.createCellMembrane();

		// Create transport proteins
		for (let i = 0; i < 8; i++) {
			const angle = (i / 8) * Math.PI * 2;
			const position = new Vector3(
				Math.cos(angle) * 2.5,
				Math.sin(angle) * 2.5,
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
			this.reactionSites.push(particle);
			this.addParticle(particle);
		}

		// Create molecules to transport
		for (let i = 0; i < this.particles.size * 0.5; i++) {
			const position = new Vector3(
				(Math.random() - 0.5) * 6,
				(Math.random() - 0.5) * 6,
				-1.5,
			);

			const moleculeConfig: AdvancedParticleConfig = {
				mass: 1e-18,
				charge: 0,
				radius: 0.001,
				damping: 0.98,
				biologicalType: "molecule",
				halfLife: 3600,
				diffusionCoefficient: 1e-10,
				color: new Color(0x10b981),
				opacity: 0.7,
				size: 0.003,
				interactionRadius: 0.008,
				bindingStrength: 0.6,
				repulsionStrength: 0.2,
			};

			const particle = new AdvancedParticle(
				`molecule-${i}`,
				position,
				moleculeConfig,
			);
			this.addParticle(particle);
		}
	}

	private initializeProteinFolding(): void {
		// Create unfolded protein chain
		this.createProteinChain();

		// Create chaperone proteins
		for (let i = 0; i < this.particles.size * 0.2; i++) {
			const position = new Vector3(
				(Math.random() - 0.5) * 6,
				(Math.random() - 0.5) * 6,
				0,
			);

			const chaperoneConfig: AdvancedParticleConfig = {
				mass: 1e-14,
				charge: 0,
				radius: 0.003,
				damping: 1.0,
				biologicalType: "chaperone",
				halfLife: Number.POSITIVE_INFINITY,
				diffusionCoefficient: 5e-11,
				color: new Color(0xf59e0b),
				opacity: 0.8,
				size: 0.008,
				interactionRadius: 0.02,
				bindingStrength: 0.7,
				repulsionStrength: 0.1,
			};

			const particle = new AdvancedParticle(
				`chaperone-${i}`,
				position,
				chaperoneConfig,
			);
			this.reactionSites.push(particle);
			this.addParticle(particle);
		}
	}

	private initializeSignalTransduction(): void {
		// Create signaling molecules
		for (let i = 0; i < this.particles.size * 0.5; i++) {
			const position = new Vector3(
				(Math.random() - 0.5) * 6,
				(Math.random() - 0.5) * 6,
				0,
			);

			const signalConfig: AdvancedParticleConfig = {
				mass: 1e-19,
				charge: 0,
				radius: 0.0008,
				damping: 0.97,
				biologicalType: "signal-molecule",
				halfLife: 1800,
				diffusionCoefficient: 8e-10,
				color: new Color(0xef4444),
				opacity: 0.8,
				size: 0.003,
				interactionRadius: 0.008,
				bindingStrength: 0.6,
				repulsionStrength: 0.2,
			};

			const particle = new AdvancedParticle(
				`signal-${i}`,
				position,
				signalConfig,
			);
			this.addParticle(particle);
		}

		// Create cascade of receptors and effectors
		this.createSignalCascade();
	}

	// Helper methods for creating molecular structures
	private createMembrane(): void {
		// Create a simple membrane representation
		const membraneGeometry = new CylinderGeometry(3, 3, 0.1, 32);
		const membraneMaterial = new MeshBasicMaterial({
			color: 0xfcd34d,
			transparent: true,
			opacity: 0.3,
		});

		const membrane = new Mesh(membraneGeometry, membraneMaterial);
		membrane.position.set(0, 0, 0);
		membrane.rotation.x = Math.PI / 2;
	}

	private createDNAStrand(): void {
		// Create a simplified DNA double helix
		const dnaGroup = new Group();

		for (let i = 0; i < 20; i++) {
			const y = (i - 10) * 0.3;
			const angle = i * 0.5;

			// DNA backbone
			const backboneGeometry = new CylinderGeometry(0.02, 0.02, 0.1, 8);
			const backboneMaterial = new MeshBasicMaterial({ color: 0x6b7280 });

			const strand1 = new Mesh(backboneGeometry, backboneMaterial);
			strand1.position.set(Math.cos(angle) * 0.5, y, Math.sin(angle) * 0.5);

			const strand2 = new Mesh(backboneGeometry, backboneMaterial);
			strand2.position.set(-Math.cos(angle) * 0.5, y, -Math.sin(angle) * 0.5);

			dnaGroup.add(strand1, strand2);

			// Base pairs
			if (i % 2 === 0) {
				const pairGeometry = new SphereGeometry(0.05, 8, 8);
				const pairMaterial = new MeshBasicMaterial({
					color: [0x22c55e, 0x3b82f6, 0xf59e0b, 0xef4444][i % 4],
				});

				const basePair = new Mesh(pairGeometry, pairMaterial);
				basePair.position.set(0, y, 0);
				dnaGroup.add(basePair);
			}
		}

		dnaGroup.position.set(-3, 0, 0);
	}

	private createIonChannel(): void {
		// Create ion channel structure
		const channelGeometry = new CylinderGeometry(0.1, 0.1, 1, 16);
		const channelMaterial = new MeshStandardMaterial({
			color: 0x06b6d4,
			transparent: true,
			opacity: 0.6,
		});

		const channel = new Mesh(channelGeometry, channelMaterial);
		channel.position.set(0, 0, 0);
	}

	private createCellMembrane(): void {
		// Create lipid bilayer representation
		const bilayerGroup = new Group();

		for (let layer = 0; layer < 2; layer++) {
			const z = (layer - 0.5) * 0.2;
			const geometry = new CylinderGeometry(3, 3, 0.05, 32);
			const material = new MeshBasicMaterial({
				color: layer === 0 ? 0xfde68a : 0xf59e0b,
				transparent: true,
				opacity: 0.4,
			});

			const layerMesh = new Mesh(geometry, material);
			layerMesh.position.set(0, 0, z);
			layerMesh.rotation.x = Math.PI / 2;
			bilayerGroup.add(layerMesh);
		}
	}

	private createProteinChain(): void {
		// Create unfolded protein as a chain of spheres
		const chainGroup = new Group();

		for (let i = 0; i < 15; i++) {
			const geometry = new SphereGeometry(0.08, 8, 8);
			const material = new MeshBasicMaterial({
				color: new Color().setHSL(i / 15, 0.7, 0.5),
			});

			const aminoAcid = new Mesh(geometry, material);
			aminoAcid.position.set(
				(i - 7) * 0.2,
				Math.sin(i * 0.5) * 0.3,
				Math.cos(i * 0.5) * 0.3,
			);

			chainGroup.add(aminoAcid);
		}
	}

	private createSignalCascade(): void {
		// Create a cascade of signaling components
		const cascadePositions = [
			new Vector3(-3, 2, 0),
			new Vector3(-1, 2, 0),
			new Vector3(1, 2, 0),
			new Vector3(3, 2, 0),
			new Vector3(3, 0, 0),
			new Vector3(3, -2, 0),
		];

		cascadePositions.forEach((pos, i) => {
			const componentConfig: AdvancedParticleConfig = {
				mass: 1e-15,
				charge: 0,
				radius: 0.002,
				damping: 1.0,
				biologicalType:
					i === 0
						? "receptor"
						: i === cascadePositions.length - 1
							? "effector"
							: "kinase",
				halfLife: Number.POSITIVE_INFINITY,
				diffusionCoefficient: 0,
				color: new Color(
					[0xef4444, 0xf59e0b, 0x8b5cf6, 0x059669, 0xdc2626, 0x7c3aed][i],
				),
				opacity: 0.9,
				size: 0.006,
				interactionRadius: 0.02,
				bindingStrength: 0.8,
				repulsionStrength: 0.1,
			};

			const particle = new AdvancedParticle(
				`cascade-${i}`,
				pos,
				componentConfig,
			);
			this.reactionSites.push(particle);
			this.addParticle(particle);
		});
	}

	// Update molecular interactions
	public update(deltaTime: number): void {
		super.update(deltaTime);

		this.interactionTimer += deltaTime;

		// Update molecular processes
		this.updateMolecularProcesses(deltaTime);

		// Handle reactions
		this.handleMolecularReactions(deltaTime);

		// Update binding events
		this.updateBindingEvents(deltaTime);
	}

	private updateMolecularProcesses(deltaTime: number): void {
		switch (this.config.interactionType) {
			case "supplement-transport":
				this.updateSupplementTransport(deltaTime);
				break;
			case "receptor-binding":
				this.updateReceptorBinding(deltaTime);
				break;
			case "enzyme-catalysis":
				this.updateEnzymeCatalysis(deltaTime);
				break;
			case "dna-transcription":
				this.updateDNATranscription(deltaTime);
				break;
			case "ion-channel":
				this.updateIonChannel(deltaTime);
				break;
			case "membrane-transport":
				this.updateMembraneTransport(deltaTime);
				break;
			case "protein-folding":
				this.updateProteinFolding(deltaTime);
				break;
			case "signal-transduction":
				this.updateSignalTransduction(deltaTime);
				break;
		}
	}

	private updateSupplementTransport(deltaTime: number): void {
		const particles = this.getActiveParticles();
		const supplements = particles.filter(
			(p) => p.config.biologicalType === "supplement-molecule",
		);
		const transporters = particles.filter(
			(p) => p.config.biologicalType === "transporter",
		);

		supplements.forEach((supplement) => {
			transporters.forEach((transporter) => {
				const distance = supplement.position.distanceTo(transporter.position);
				if (distance < 0.5 && Math.random() < this.config.reactionRate) {
					// Transport across membrane
					supplement.position.z += 0.1;
					supplement.color.setHex(0x22c55e); // Change color after transport
				}
			});
		});
	}

	private updateReceptorBinding(deltaTime: number): void {
		const particles = this.getActiveParticles();
		const ligands = particles.filter(
			(p) => p.config.biologicalType === "ligand",
		);

		ligands.forEach((ligand) => {
			this.reactionSites.forEach((receptor) => {
				const distance = ligand.position.distanceTo(receptor.position);
				if (distance < 0.3) {
					// Attempt binding
					if (Math.random() < this.config.bindingAffinity) {
						ligand.bindTo(receptor);
						this.recordBindingEvent(ligand.id, receptor.id, "receptor-binding");
					}
				}
			});
		});
	}

	private updateEnzymeCatalysis(deltaTime: number): void {
		const particles = this.getActiveParticles();
		const substrates = particles.filter(
			(p) => p.config.biologicalType === "substrate",
		);

		substrates.forEach((substrate) => {
			this.reactionSites.forEach((enzyme) => {
				const distance = substrate.position.distanceTo(enzyme.position);
				if (distance < 0.4 && Math.random() < this.config.reactionRate) {
					// Catalysis: convert substrate to product
					substrate.color.setHex(0x22c55e);
					substrate.config.biologicalType = "product";
					this.recordBindingEvent(substrate.id, enzyme.id, "catalysis");
				}
			});
		});
	}

	private updateDNATranscription(deltaTime: number): void {
		const particles = this.getActiveParticles();
		const polymerase = particles.find((p) => p.id === "rna-polymerase");
		const nucleotides = particles.filter(
			(p) => p.config.biologicalType === "nucleotide",
		);

		if (polymerase) {
			// Move polymerase along DNA
			polymerase.position.x += 0.01;

			nucleotides.forEach((nucleotide) => {
				const distance = polymerase.position.distanceTo(nucleotide.position);
				if (distance < 0.3) {
					// Incorporate nucleotide into RNA
					nucleotide.position.copy(polymerase.position);
					nucleotide.position.x += 0.5;
					nucleotide.color.setHex(0xf97316); // Orange for RNA
				}
			});
		}
	}

	private updateIonChannel(deltaTime: number): void {
		const particles = this.getActiveParticles();
		const ions = particles.filter((p) => p.config.biologicalType === "ion");

		ions.forEach((ion) => {
			// Simulate channel opening/closing
			if (Math.random() < 0.01) {
				// 1% chance per frame
				const channelOpen = Math.random() > 0.5;
				if (channelOpen) {
					ion.position.z += 0.1; // Move through channel
					ion.color.setHex(0x10b981); // Green when passing through
				}
			}
		});
	}

	private updateMembraneTransport(deltaTime: number): void {
		const particles = this.getActiveParticles();
		const molecules = particles.filter(
			(p) => p.config.biologicalType === "molecule",
		);

		molecules.forEach((molecule) => {
			if (molecule.position.z < -0.5) {
				this.reactionSites.forEach((transporter) => {
					const distance = molecule.position.distanceTo(transporter.position);
					if (distance < 0.4 && Math.random() < this.config.reactionRate) {
						// Active transport across membrane
						molecule.position.z = 0.5;
						molecule.color.setHex(0x8b5cf6);
						this.recordBindingEvent(molecule.id, transporter.id, "transport");
					}
				});
			}
		});
	}

	private updateProteinFolding(deltaTime: number): void {
		const particles = this.getActiveParticles();
		const proteinChain = particles.filter((p) => p.id.startsWith("protein-"));
		const chaperones = particles.filter(
			(p) => p.config.biologicalType === "chaperone",
		);

		proteinChain.forEach((aminoAcid, index) => {
			chaperones.forEach((chaperone) => {
				const distance = aminoAcid.position.distanceTo(chaperone.position);
				if (distance < 0.5) {
					// Fold protein towards native structure
					const targetPosition = new Vector3(
						Math.sin(index * 0.5) * 0.5,
						Math.cos(index * 0.5) * 0.5,
						0,
					);
					aminoAcid.position.lerp(targetPosition, 0.02);
					aminoAcid.color.setHex(0x22c55e); // Green when folded
				}
			});
		});
	}

	private updateSignalTransduction(deltaTime: number): void {
		const particles = this.getActiveParticles();
		const signals = particles.filter(
			(p) => p.config.biologicalType === "signal-molecule",
		);

		signals.forEach((signal) => {
			this.reactionSites.forEach((component, index) => {
				const distance = signal.position.distanceTo(component.position);
				if (distance < 0.3 && index < this.reactionSites.length - 1) {
					// Activate next component in cascade
					const nextComponent = this.reactionSites[index + 1];
					if (nextComponent) {
						nextComponent.color.setHex(0xf59e0b); // Yellow for activated
						this.recordBindingEvent(
							signal.id,
							component.id,
							"signal-transduction",
						);
					}
				}
			});
		});
	}

	private handleMolecularReactions(deltaTime: number): void {
		// Handle reaction-specific logic
		if (this.interactionTimer > 1.0) {
			// Check every second
			this.processMolecularReactions();
			this.interactionTimer = 0;
		}
	}

	private processMolecularReactions(): void {
		// Process any pending molecular reactions
		const particles = this.getActiveParticles();

		particles.forEach((particle) => {
			if (particle.boundParticles.size > 0) {
				// Process bound state changes
				particle.boundParticles.forEach((boundId) => {
					const boundParticle = this.getParticle(boundId);
					if (boundParticle) {
						this.handleBoundInteraction(particle, boundParticle);
					}
				});
			}
		});
	}

	private handleBoundInteraction(
		particle1: AdvancedParticle,
		particle2: AdvancedParticle,
	): void {
		// Handle specific interactions between bound particles
		if (
			particle1.config.biologicalType === "enzyme" &&
			particle2.config.biologicalType === "substrate"
		) {
			// Catalysis reaction
			particle2.color.setHex(0x22c55e); // Product color
			particle2.config.biologicalType = "product";
		}
	}

	private updateBindingEvents(deltaTime: number): void {
		// Update binding event history
		this.bindingEvents = this.bindingEvents.filter(
			(event) => Date.now() - event.time < 5000, // Keep events for 5 seconds
		);
	}

	private recordBindingEvent(
		particle1: string,
		particle2: string,
		type: string,
	): void {
		this.bindingEvents.push({
			time: Date.now(),
			particle1,
			particle2,
			type,
		});
	}

	// Get molecular interaction statistics
	public getInteractionStats(): {
		totalParticles: number;
		bindingEvents: number;
		reactionRate: number;
		bindingEfficiency: number;
		molecularTypes: Record<string, number>;
	} {
		const particles = this.getActiveParticles();
		const molecularTypes: Record<string, number> = {};

		particles.forEach((p) => {
			molecularTypes[p.config.biologicalType] =
				(molecularTypes[p.config.biologicalType] || 0) + 1;
		});

		const recentEvents = this.bindingEvents.filter(
			(e) => Date.now() - e.time < 1000,
		).length;
		const reactionRate = recentEvents / 1.0; // Events per second

		return {
			totalParticles: particles.length,
			bindingEvents: this.bindingEvents.length,
			reactionRate,
			bindingEfficiency: this.config.bindingAffinity,
			molecularTypes,
		};
	}

	// Set environmental conditions for molecular interactions
	public setMolecularEnvironment(
		temperature: number,
		ph: number,
		ionicStrength: number,
	): void {
		this.setEnvironment({
			temperature,
			flowField: (position: Vector3) => {
				// Adjust flow based on molecular conditions
				const baseFlow = new Vector3(0.01, 0, 0);
				const temperatureFactor = (temperature - 310) / 310; // Normalized temperature effect
				return baseFlow.multiplyScalar(1 + temperatureFactor * 0.5);
			},
		});
	}
}

// Predefined molecular interaction configurations
export const MOLECULAR_INTERACTION_SYSTEMS: Record<
	string,
	MolecularInteractionConfig
> = {
	"creatine-transport": {
		interactionType: "supplement-transport",
		moleculeType: "creatine",
		targetType: "muscle-cell",
		bindingAffinity: 0.7,
		reactionRate: 0.1,
		activationEnergy: 0.5,
		polishName: "Transport kreatyny",
		description: "Creatine transport into muscle cells",
		polishDescription: "Transport kreatyny do komórek mięśniowych",
	},

	"magnesium-binding": {
		interactionType: "receptor-binding",
		moleculeType: "magnesium",
		targetType: "nmda-receptor",
		bindingAffinity: 0.8,
		reactionRate: 0.15,
		activationEnergy: 0.3,
		polishName: "Wiązanie magnezu",
		description: "Magnesium binding to NMDA receptors",
		polishDescription: "Wiązanie magnezu z receptorami NMDA",
	},

	"coq10-mitochondria": {
		interactionType: "membrane-transport",
		moleculeType: "coenzyme-q10",
		targetType: "mitochondrial-membrane",
		bindingAffinity: 0.9,
		reactionRate: 0.2,
		activationEnergy: 0.2,
		polishName: "Transport CoQ10",
		description: "Coenzyme Q10 transport into mitochondria",
		polishDescription: "Transport koenzymu Q10 do mitochondriów",
	},

	"dna-transcription": {
		interactionType: "dna-transcription",
		moleculeType: "rna-polymerase",
		targetType: "dna-strand",
		bindingAffinity: 0.6,
		reactionRate: 0.08,
		activationEnergy: 0.8,
		polishName: "Transkrypcja DNA",
		description: "DNA transcription process",
		polishDescription: "Proces transkrypcji DNA",
	},

	"ion-channel-sodium": {
		interactionType: "ion-channel",
		moleculeType: "sodium-ion",
		targetType: "voltage-gated-channel",
		bindingAffinity: 0.5,
		reactionRate: 0.3,
		activationEnergy: 0.1,
		polishName: "Kanał sodowy",
		description: "Sodium ion channel conductance",
		polishDescription: "Przewodzenie kanału sodowego",
	},
};

export default MolecularInteractionSystem;
