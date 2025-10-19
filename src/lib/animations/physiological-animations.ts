"use client";

import { Color, Group, Mesh, type Object3D, Vector3 } from "three";

// Advanced physiological animation framework
export interface PhysiologicalAnimation {
	id: string;
	name: string;
	polishName: string;
	duration: number;
	organIds: string[];
	animationType:
		| "breathing"
		| "heartbeat"
		| "muscle_contraction"
		| "nerve_impulse"
		| "blood_flow"
		| "hormone_release";
	easing: string;
	intensity: number;
	description: string;
	polishDescription: string;
}

export interface ParticleSystem {
	id: string;
	name: string;
	polishName: string;
	particleCount: number;
	particleSize: number;
	particleColor: string;
	emissionRate: number;
	lifetime: number;
	velocity: Vector3;
	spread: number;
	affectedOrgans: string[];
	animationType:
		| "blood_flow"
		| "neural_signals"
		| "hormone_release"
		| "cellular_activity";
}

export interface AnimationController {
	isPlaying: boolean;
	currentTime: number;
	playbackSpeed: number;
	loop: boolean;
	autoPlay: boolean;
	onComplete?: () => void;
	onUpdate?: (progress: number) => void;
}

export interface SupplementMolecularEffect {
	supplementId: string;
	supplementName: string;
	polishSupplementName: string;
	targetOrgans: string[];
	molecularTargets: string[];
	visualEffect: {
		color: string;
		glowIntensity: number;
		pulseSpeed: number;
		particleTrail: boolean;
	};
	mechanism: string;
	polishMechanism: string;
}

// Physiological animation definitions
export const PHYSIOLOGICAL_ANIMATIONS: PhysiologicalAnimation[] = [
	{
		id: "breathing-cycle",
		name: "Breathing Cycle",
		polishName: "Cykl oddechowy",
		duration: 4000,
		organIds: ["lungs", "diaphragm"],
		animationType: "breathing",
		easing: "easeInOutSine",
		intensity: 1.0,
		description:
			"Smooth breathing animation showing lung expansion and diaphragm movement",
		polishDescription:
			"Płynna animacja oddechu pokazująca rozszerzanie płuc i ruch przepony",
	},
	{
		id: "heartbeat-cycle",
		name: "Heartbeat Cycle",
		polishName: "Cykl serca",
		duration: 800,
		organIds: ["heart"],
		animationType: "heartbeat",
		easing: "easeInOutQuad",
		intensity: 1.2,
		description:
			"Cardiac cycle animation with ventricular contraction and relaxation",
		polishDescription: "Animacja cyklu serca ze skurczem i rozkurczem komór",
	},
	{
		id: "muscle-contraction",
		name: "Muscle Contraction",
		polishName: "Skurcz mięśni",
		duration: 2000,
		organIds: ["skeletal-muscles", "biceps", "quadriceps"],
		animationType: "muscle_contraction",
		easing: "easeOutQuart",
		intensity: 0.8,
		description: "Muscle fiber contraction and relaxation sequence",
		polishDescription: "Sekwencja skurczu i rozkurczu włókien mięśniowych",
	},
	{
		id: "nerve-impulse",
		name: "Nerve Impulse",
		polishName: "Impuls nerwowy",
		duration: 1000,
		organIds: ["nerves", "brain", "spinal-cord"],
		animationType: "nerve_impulse",
		easing: "linear",
		intensity: 1.5,
		description: "Neural signal propagation along nerve pathways",
		polishDescription: "Propagacja sygnału nerwowego wzdłuż szlaków nerwowych",
	},
	{
		id: "blood-flow-circulation",
		name: "Blood Flow Circulation",
		polishName: "Krążenie krwi",
		duration: 6000,
		organIds: ["heart", "arteries", "veins", "lungs"],
		animationType: "blood_flow",
		easing: "easeInOutCubic",
		intensity: 0.6,
		description:
			"Systemic circulation showing oxygenated and deoxygenated blood flow",
		polishDescription:
			"Krążenie systemowe pokazujące przepływ krwi utlenowanej i odtlenowanej",
	},
	{
		id: "hormone-release",
		name: "Hormone Release",
		polishName: "Wydzielanie hormonów",
		duration: 3000,
		organIds: ["thyroid", "adrenals", "pituitary"],
		animationType: "hormone_release",
		easing: "easeOutExpo",
		intensity: 0.9,
		description: "Endocrine hormone secretion and distribution",
		polishDescription: "Wydzielanie i dystrybucja hormonów endokrynnych",
	},
];

// Particle systems for cellular-level visualizations
export const PARTICLE_SYSTEMS: ParticleSystem[] = [
	{
		id: "blood-cells",
		name: "Blood Cells",
		polishName: "Komórki krwi",
		particleCount: 50,
		particleSize: 0.02,
		particleColor: "#DC2626",
		emissionRate: 10,
		lifetime: 8000,
		velocity: new Vector3(0.5, 0, 0),
		spread: 0.3,
		affectedOrgans: ["heart", "arteries", "veins"],
		animationType: "blood_flow",
	},
	{
		id: "neural-signals",
		name: "Neural Signals",
		polishName: "Sygnały nerwowe",
		particleCount: 30,
		particleSize: 0.01,
		particleColor: "#8B5CF6",
		emissionRate: 15,
		lifetime: 2000,
		velocity: new Vector3(1, 0, 0),
		spread: 0.1,
		affectedOrgans: ["brain", "spinal-cord", "nerves"],
		animationType: "neural_signals",
	},
	{
		id: "hormone-molecules",
		name: "Hormone Molecules",
		polishName: "Cząsteczki hormonów",
		particleCount: 20,
		particleSize: 0.015,
		particleColor: "#059669",
		emissionRate: 5,
		lifetime: 10000,
		velocity: new Vector3(0.2, 0.1, 0.2),
		spread: 0.5,
		affectedOrgans: ["thyroid", "adrenals", "pituitary"],
		animationType: "hormone_release",
	},
	{
		id: "cellular-energy",
		name: "Cellular Energy",
		polishName: "Energia komórkowa",
		particleCount: 40,
		particleSize: 0.008,
		particleColor: "#F59E0B",
		emissionRate: 20,
		lifetime: 3000,
		velocity: new Vector3(0, 0, 0),
		spread: 0.2,
		affectedOrgans: ["mitochondria", "cells"],
		animationType: "cellular_activity",
	},
];

// Supplement molecular effects
export const SUPPLEMENT_MOLECULAR_EFFECTS: SupplementMolecularEffect[] = [
	{
		supplementId: "omega-3-epa-dha",
		supplementName: "Omega-3 EPA/DHA",
		polishSupplementName: "Omega-3 EPA/DHA",
		targetOrgans: ["brain", "heart", "joints"],
		molecularTargets: ["cell-membranes", "receptors"],
		visualEffect: {
			color: "#10B981",
			glowIntensity: 0.6,
			pulseSpeed: 1.5,
			particleTrail: true,
		},
		mechanism: "Improves membrane fluidity and reduces inflammation",
		polishMechanism: "Poprawia płynność błon i zmniejsza stan zapalny",
	},
	{
		supplementId: "magnesium-l-threonate",
		supplementName: "Magnesium L-Threonate",
		polishSupplementName: "L-treonian magnezu",
		targetOrgans: ["brain", "nervous-system"],
		molecularTargets: ["nmda-receptors", "synapses"],
		visualEffect: {
			color: "#8B5CF6",
			glowIntensity: 0.8,
			pulseSpeed: 2.0,
			particleTrail: true,
		},
		mechanism: "Enhances synaptic plasticity and cognitive function",
		polishMechanism: "Wzmacnia plastyczność synaptyczną i funkcje poznawcze",
	},
	{
		supplementId: "lions-mane-mushroom",
		supplementName: "Lion's Mane Mushroom",
		polishSupplementName: "Soplówka jeżowata",
		targetOrgans: ["brain", "nervous-system"],
		molecularTargets: ["ngf-receptors", "myelin"],
		visualEffect: {
			color: "#F97316",
			glowIntensity: 0.9,
			pulseSpeed: 1.8,
			particleTrail: true,
		},
		mechanism: "Stimulates NGF production and neurogenesis",
		polishMechanism: "Stymuluje produkcję NGF i neurogenezę",
	},
];

// Animation controller class
export class PhysiologicalAnimationController {
	private animations: Map<string, PhysiologicalAnimation> = new Map();
	private activeAnimations: Map<string, AnimationController> = new Map();
	private animationFrameId: number | null = null;
	private lastTime = 0;
	private onAnimationUpdate?: (animationId: string, progress: number) => void;

	constructor() {
		this.initializeAnimations();
	}

	private initializeAnimations() {
		PHYSIOLOGICAL_ANIMATIONS.forEach((animation) => {
			this.animations.set(animation.id, animation);
		});
	}

	public startAnimation(
		animationId: string,
		config?: Partial<AnimationController>,
	) {
		const animation = this.animations.get(animationId);
		if (!animation) return;

		const controller: AnimationController = {
			isPlaying: true,
			currentTime: 0,
			playbackSpeed: 1,
			loop: true,
			autoPlay: true,
			...config,
		};

		this.activeAnimations.set(animationId, controller);
		this.startAnimationLoop();
	}

	public pauseAnimation(animationId: string) {
		const controller = this.activeAnimations.get(animationId);
		if (controller) {
			controller.isPlaying = false;
		}
	}

	public resumeAnimation(animationId: string) {
		const controller = this.activeAnimations.get(animationId);
		if (controller) {
			controller.isPlaying = true;
		}
	}

	public stopAnimation(animationId: string) {
		this.activeAnimations.delete(animationId);
		if (this.activeAnimations.size === 0) {
			this.stopAnimationLoop();
		}
	}

	public setPlaybackSpeed(animationId: string, speed: number) {
		const controller = this.activeAnimations.get(animationId);
		if (controller) {
			controller.playbackSpeed = Math.max(0.1, Math.min(3, speed));
		}
	}

	public setAnimationIntensity(animationId: string, intensity: number) {
		const animation = this.animations.get(animationId);
		if (animation) {
			animation.intensity = Math.max(0, Math.min(2, intensity));
		}
	}

	private startAnimationLoop() {
		if (this.animationFrameId !== null) return;

		const animate = (currentTime: number) => {
			if (this.lastTime === 0) this.lastTime = currentTime;
			const deltaTime = currentTime - this.lastTime;
			this.lastTime = currentTime;

			this.activeAnimations.forEach((controller, animationId) => {
				if (!controller.isPlaying) return;

				const animation = this.animations.get(animationId);
				if (!animation) return;

				controller.currentTime += deltaTime * controller.playbackSpeed;

				const progress =
					(controller.currentTime % animation.duration) / animation.duration;

				// Apply animation effects based on type
				this.applyAnimationEffects(animationId, progress, animation);

				controller.onUpdate?.(progress);

				if (progress >= 1 && !controller.loop) {
					controller.isPlaying = false;
					controller.onComplete?.();
				}
			});

			this.onAnimationUpdate?.(Array.from(this.activeAnimations.keys())[0], 0);

			if (this.activeAnimations.size > 0) {
				this.animationFrameId = requestAnimationFrame(animate);
			} else {
				this.animationFrameId = null;
			}
		};

		this.animationFrameId = requestAnimationFrame(animate);
	}

	private stopAnimationLoop() {
		if (this.animationFrameId !== null) {
			cancelAnimationFrame(this.animationFrameId);
			this.animationFrameId = null;
		}
	}

	private applyAnimationEffects(
		animationId: string,
		progress: number,
		animation: PhysiologicalAnimation,
	) {
		// This method will be implemented to apply specific animation effects
		// to 3D objects based on the animation type and progress
	}

	public getActiveAnimations(): string[] {
		return Array.from(this.activeAnimations.keys());
	}

	public isAnimationActive(animationId: string): boolean {
		return this.activeAnimations.has(animationId);
	}

	public setAnimationUpdateCallback(
		callback: (animationId: string, progress: number) => void,
	) {
		this.onAnimationUpdate = callback;
	}

	public dispose() {
		this.stopAnimationLoop();
		this.activeAnimations.clear();
		this.animations.clear();
	}
}

// Particle system manager
export class ParticleSystemManager {
	private particleSystems: Map<string, ParticleSystem> = new Map();
	private activeParticles: Map<string, Object3D[]> = new Map();
	private animationFrameId: number | null = null;
	private lastEmission: Map<string, number> = new Map();

	constructor() {
		this.initializeParticleSystems();
	}

	private initializeParticleSystems() {
		PARTICLE_SYSTEMS.forEach((system) => {
			this.particleSystems.set(system.id, system);
			this.lastEmission.set(system.id, 0);
		});
	}

	public startParticleSystem(systemId: string) {
		const system = this.particleSystems.get(systemId);
		if (!system) return;

		if (!this.activeParticles.has(systemId)) {
			this.activeParticles.set(systemId, []);
			this.emitParticles(systemId);
		}
	}

	public stopParticleSystem(systemId: string) {
		const particles = this.activeParticles.get(systemId);
		if (particles) {
			particles.forEach((particle) => particle.clear());
			this.activeParticles.delete(systemId);
		}
	}

	private emitParticles(systemId: string) {
		const system = this.particleSystems.get(systemId);
		if (!system) return;

		const currentTime = Date.now();
		const lastEmission = this.lastEmission.get(systemId) || 0;
		const timeSinceLastEmission = currentTime - lastEmission;

		if (timeSinceLastEmission >= 1000 / system.emissionRate) {
			// Emit new particles
			for (let i = 0; i < system.particleCount / 60; i++) {
				// 60 FPS emission rate
				this.createParticle(systemId, system);
			}
			this.lastEmission.set(systemId, currentTime);
		}

		// Update existing particles
		this.updateParticles(systemId);

		if (this.activeParticles.has(systemId)) {
			requestAnimationFrame(() => this.emitParticles(systemId));
		}
	}

	private createParticle(systemId: string, system: ParticleSystem) {
		const particles = this.activeParticles.get(systemId);
		if (!particles) return;

		// Create particle geometry and material
		const particleGeometry = new SphereGeometry(system.particleSize, 8, 8);
		const particleMaterial = new MeshBasicMaterial({
			color: new Color(system.particleColor),
			transparent: true,
			opacity: 0.8,
		});

		const particle = new Mesh(particleGeometry, particleMaterial);
		particle.position.copy(
			new Vector3(
				(Math.random() - 0.5) * system.spread,
				(Math.random() - 0.5) * system.spread,
				(Math.random() - 0.5) * system.spread,
			),
		);

		particle.userData = {
			velocity: system.velocity
				.clone()
				.add(
					new Vector3(
						(Math.random() - 0.5) * 0.2,
						(Math.random() - 0.5) * 0.2,
						(Math.random() - 0.5) * 0.2,
					),
				),
			lifetime: system.lifetime,
			createdAt: Date.now(),
		};

		particles.push(particle);
	}

	private updateParticles(systemId: string) {
		const particles = this.activeParticles.get(systemId);
		if (!particles) return;

		const currentTime = Date.now();

		particles.forEach((particle, index) => {
			const data = particle.userData;
			const age = currentTime - data.createdAt;

			if (age > data.lifetime) {
				// Remove expired particle
				particle.geometry.dispose();
				if (particle.material instanceof Material) {
					particle.material.dispose();
				}
				particles.splice(index, 1);
				return;
			}

			// Update particle position
			particle.position.add(data.velocity.clone().multiplyScalar(0.016)); // 60 FPS

			// Update opacity based on age
			if (
				particle.material instanceof Material &&
				"opacity" in particle.material
			) {
				const lifeProgress = age / data.lifetime;
				particle.material.opacity = 0.8 * (1 - lifeProgress);
			}
		});
	}

	public dispose() {
		this.activeParticles.forEach((particles) => {
			particles.forEach((particle) => {
				particle.geometry.dispose();
				if (particle.material instanceof Material) {
					particle.material.dispose();
				}
			});
		});
		this.activeParticles.clear();
	}
}

// Animation easing functions
export const EASING_FUNCTIONS = {
	linear: (t: number) => t,
	easeInOutSine: (t: number) => -(Math.cos(Math.PI * t) - 1) / 2,
	easeInOutQuad: (t: number) =>
		t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2,
	easeOutQuart: (t: number) => 1 - (1 - t) ** 4,
	easeInOutCubic: (t: number) =>
		t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2,
	easeOutExpo: (t: number) => (t === 1 ? 1 : 1 - 2 ** (-10 * t)),
};

// Performance monitoring
export class AnimationPerformanceMonitor {
	private frameCount = 0;
	private lastTime = performance.now();
	private fpsHistory: number[] = [];
	private memoryUsage: number[] = [];

	public update() {
		this.frameCount++;
		const currentTime = performance.now();

		if (currentTime - this.lastTime >= 1000) {
			const fps = Math.round(
				(this.frameCount * 1000) / (currentTime - this.lastTime),
			);
			this.fpsHistory.push(fps);

			// Keep only last 60 measurements
			if (this.fpsHistory.length > 60) {
				this.fpsHistory.shift();
			}

			// Monitor memory usage if available
			if ("memory" in performance) {
				const memoryInfo = (performance as any).memory;
				this.memoryUsage.push(
					memoryInfo.usedJSHeapSize / memoryInfo.jsHeapSizeLimit,
				);
			}

			this.frameCount = 0;
			this.lastTime = currentTime;
		}
	}

	public getAverageFPS(): number {
		if (this.fpsHistory.length === 0) return 60;
		return this.fpsHistory.reduce((a, b) => a + b, 0) / this.fpsHistory.length;
	}

	public getMemoryUsage(): number {
		if (this.memoryUsage.length === 0) return 0;
		return this.memoryUsage[this.memoryUsage.length - 1];
	}

	public shouldReduceQuality(): boolean {
		const avgFPS = this.getAverageFPS();
		const memoryUsage = this.getMemoryUsage();
		return avgFPS < 30 || memoryUsage > 0.8;
	}
}

// Device capability detection
export class DeviceCapabilities {
	public static detect(): {
		isMobile: boolean;
		hasWebGL: boolean;
		maxTextureSize: number;
		recommendedQuality: "low" | "medium" | "high";
	} {
		const canvas = document.createElement("canvas");
		const gl =
			canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

		const isMobile =
			/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
				navigator.userAgent,
			);

		const hasWebGL = !!gl;
		const maxTextureSize = hasWebGL ? gl.getParameter(gl.MAX_TEXTURE_SIZE) : 0;

		let recommendedQuality: "low" | "medium" | "high" = "high";

		if (isMobile || !hasWebGL || maxTextureSize < 2048) {
			recommendedQuality = "low";
		} else if (maxTextureSize < 4096) {
			recommendedQuality = "medium";
		}

		return {
			isMobile,
			hasWebGL,
			maxTextureSize,
			recommendedQuality,
		};
	}
}
