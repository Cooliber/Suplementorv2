"use client";

import type {
	ParticleEffect,
	Vector3D,
	WebGLContext,
} from "@/lib/types/transitions";
import { useCallback, useEffect, useRef, useState } from "react";

interface ParticleSystemProps {
	particleEffect: ParticleEffect;
	onProgress?: (progress: number) => void;
	onComplete?: () => void;
	autoStart?: boolean;
	duration?: number;
	children?: React.ReactNode;
}

interface Particle {
	id: string;
	position: Vector3D;
	velocity: Vector3D;
	acceleration: Vector3D;
	life: number;
	maxLife: number;
	size: number;
	color: string;
	opacity: number;
	trail: Vector3D[];
	rotation: number;
	angularVelocity: number;
}

interface ParticleSystemState {
	particles: Particle[];
	isAnimating: boolean;
	progress: number;
	emissionRate: number;
	activeEmitters: number;
}

export class ParticleSystemManager {
	private animationId: number | null = null;
	private startTime = 0;
	private isAnimating = false;
	private particles: Particle[] = [];
	private webglContext: WebGLContext | null;
	private lastEmissionTime = 0;
	private emissionInterval: number;

	constructor(
		private particleEffect: ParticleEffect,
		webglContext?: WebGLContext | null,
	) {
		this.webglContext = webglContext || null;
		this.emissionInterval = 1000 / (this.particleEffect.count * 2); // Emission rate based on particle count
		this.initializeParticles();
	}

	private initializeParticles(): void {
		// Create initial particle pool
		for (let i = 0; i < this.particleEffect.count; i++) {
			this.particles.push(this.createParticle());
		}
	}

	private createParticle(): Particle {
		return {
			id: `particle-${Math.random().toString(36).substr(2, 9)}`,
			position: this.getRandomSpawnPosition(),
			velocity: this.getRandomVelocity(),
			acceleration: { x: 0, y: 0, z: 0 },
			life: 1.0,
			maxLife: this.particleEffect.lifetime / 1000, // Convert to seconds
			size: this.particleEffect.size,
			color: this.particleEffect.color,
			opacity: 1.0,
			trail: [],
			rotation: Math.random() * Math.PI * 2,
			angularVelocity: (Math.random() - 0.5) * 0.1,
		};
	}

	private getRandomSpawnPosition(): Vector3D {
		switch (this.particleEffect.type) {
			case "trail":
				return { x: 0, y: 0, z: 0 }; // Start at origin, will follow camera
			case "spark":
				return {
					x: (Math.random() - 0.5) * 2,
					y: (Math.random() - 0.5) * 2,
					z: (Math.random() - 0.5) * 2,
				};
			case "flow":
				return {
					x: (Math.random() - 0.5) * 0.5,
					y: (Math.random() - 0.5) * 0.5,
					z: 0,
				};
			case "connection":
				return {
					x: Math.random() - 0.5,
					y: Math.random() - 0.5,
					z: Math.random() - 0.5,
				};
			default:
				return { x: 0, y: 0, z: 0 };
		}
	}

	private getRandomVelocity(): Vector3D {
		const speed = this.particleEffect.speed;
		return {
			x: (Math.random() - 0.5) * speed,
			y: (Math.random() - 0.5) * speed,
			z: (Math.random() - 0.5) * speed,
		};
	}

	async start(duration = 2000): Promise<void> {
		return new Promise((resolve) => {
			if (this.isAnimating) {
				resolve();
				return;
			}

			this.isAnimating = true;
			this.startTime = performance.now();

			const animate = (currentTime: number) => {
				const elapsed = currentTime - this.startTime;
				const progress = Math.min(elapsed / duration, 1);

				this.updateParticles(elapsed);

				if (progress >= 1) {
					this.isAnimating = false;
					resolve();
				} else {
					this.animationId = requestAnimationFrame(animate);
				}
			};

			this.animationId = requestAnimationFrame(animate);
		});
	}

	stop(): void {
		if (this.animationId) {
			cancelAnimationFrame(this.animationId);
			this.animationId = null;
		}
		this.isAnimating = false;
	}

	getProgress(): number {
		if (!this.isAnimating) return 0;
		const elapsed = performance.now() - this.startTime;
		return Math.min(elapsed / 2000, 1);
	}

	private updateParticles(elapsedTime: number): void {
		const deltaTime = 0.016; // ~60fps

		// Emit new particles
		this.emitParticles(elapsedTime);

		// Update existing particles
		this.particles.forEach((particle) => {
			this.updateParticle(particle, deltaTime);
		});

		// Remove dead particles
		this.particles = this.particles.filter((particle) => particle.life > 0);

		// Add new particles if needed
		while (this.particles.length < this.particleEffect.count) {
			this.particles.push(this.createParticle());
		}
	}

	private emitParticles(elapsedTime: number): void {
		if (elapsedTime - this.lastEmissionTime >= this.emissionInterval) {
			// Emit particles based on effect type
			const emissionCount = Math.max(
				1,
				Math.floor(this.particleEffect.count / 20),
			);

			for (let i = 0; i < emissionCount; i++) {
				if (this.particles.length < this.particleEffect.count * 2) {
					// Allow some overflow
					this.particles.push(this.createParticle());
				}
			}

			this.lastEmissionTime = elapsedTime;
		}
	}

	private updateParticle(particle: Particle, deltaTime: number): void {
		// Apply forces based on particle effect type
		this.applyForces(particle, deltaTime);

		// Update position
		particle.velocity.x += particle.acceleration.x * deltaTime;
		particle.velocity.y += particle.acceleration.y * deltaTime;
		particle.velocity.z += particle.acceleration.z * deltaTime;

		particle.position.x += particle.velocity.x * deltaTime;
		particle.position.y += particle.velocity.y * deltaTime;
		particle.position.z += particle.velocity.z * deltaTime;

		// Update rotation
		particle.rotation += particle.angularVelocity * deltaTime;

		// Update trail
		if (this.particleEffect.type === "trail") {
			particle.trail.push({ ...particle.position });
			if (particle.trail.length > 15) {
				particle.trail.shift();
			}
		}

		// Update life
		particle.life -= deltaTime / particle.maxLife;

		// Update opacity based on life
		particle.opacity = Math.max(0, particle.life);
	}

	private applyForces(particle: Particle, deltaTime: number): void {
		switch (this.particleEffect.type) {
			case "trail":
				this.applyTrailForces(particle, deltaTime);
				break;
			case "spark":
				this.applySparkForces(particle, deltaTime);
				break;
			case "flow":
				this.applyFlowForces(particle, deltaTime);
				break;
			case "connection":
				this.applyConnectionForces(particle, deltaTime);
				break;
		}
	}

	private applyTrailForces(particle: Particle, deltaTime: number): void {
		// Follow camera movement
		const followStrength = 0.05;
		particle.acceleration.x = -particle.position.x * followStrength;
		particle.acceleration.y = -particle.position.y * followStrength;
		particle.acceleration.z = -particle.position.z * followStrength;

		// Add some turbulence
		particle.acceleration.x += (Math.random() - 0.5) * 0.1;
		particle.acceleration.y += (Math.random() - 0.5) * 0.1;
		particle.acceleration.z += (Math.random() - 0.5) * 0.1;
	}

	private applySparkForces(particle: Particle, deltaTime: number): void {
		// Gravity effect
		particle.acceleration.y -= 0.1;

		// Air resistance
		particle.acceleration.x *= 0.98;
		particle.acceleration.y *= 0.98;
		particle.acceleration.z *= 0.98;

		// Random spark effect
		if (Math.random() < 0.02) {
			particle.velocity.x += (Math.random() - 0.5) * 0.2;
			particle.velocity.y += (Math.random() - 0.5) * 0.2;
			particle.velocity.z += (Math.random() - 0.5) * 0.2;
		}
	}

	private applyFlowForces(particle: Particle, deltaTime: number): void {
		// Flow along a path
		const flowDirection = Math.sin(performance.now() * 0.001) * 0.5;
		particle.acceleration.x += flowDirection * 0.1;
		particle.acceleration.z += Math.cos(performance.now() * 0.001) * 0.1;

		// Gentle upward drift
		particle.acceleration.y += 0.02;
	}

	private applyConnectionForces(particle: Particle, deltaTime: number): void {
		// Move towards connection points
		const targetX = Math.sin(performance.now() * 0.002) * 0.5;
		const targetZ = Math.cos(performance.now() * 0.002) * 0.5;

		particle.acceleration.x += (targetX - particle.position.x) * 0.02;
		particle.acceleration.z += (targetZ - particle.position.z) * 0.02;

		// Network effect - particles attract each other
		this.particles.forEach((otherParticle) => {
			if (otherParticle.id !== particle.id) {
				const dx = otherParticle.position.x - particle.position.x;
				const dy = otherParticle.position.y - particle.position.y;
				const dz = otherParticle.position.z - particle.position.z;
				const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

				if (distance < 0.2 && distance > 0) {
					const force = 0.01 / (distance * distance + 0.01);
					particle.acceleration.x += (dx / distance) * force;
					particle.acceleration.y += (dy / distance) * force;
					particle.acceleration.z += (dz / distance) * force;
				}
			}
		});
	}

	getParticles(): Particle[] {
		return [...this.particles];
	}

	setCameraPosition(position: Vector3D): void {
		// Update particle positions relative to camera
		if (this.particleEffect.followCamera) {
			this.particles.forEach((particle) => {
				// Offset particles relative to camera position
				particle.position.x += position.x * 0.1;
				particle.position.y += position.y * 0.1;
				particle.position.z += position.z * 0.1;
			});
		}
	}
}

// React Hook for using ParticleSystemManager
export function useParticleSystem(
	particleEffect: ParticleEffect,
	options: {
		autoStart?: boolean;
		duration?: number;
		onProgress?: (progress: number) => void;
		onComplete?: () => void;
	} = {},
) {
	const systemRef = useRef<ParticleSystemManager | null>(null);
	const [isAnimating, setIsAnimating] = useState(false);
	const [progress, setProgress] = useState(0);
	const [particles, setParticles] = useState<Particle[]>([]);

	const {
		autoStart = false,
		duration = 2000,
		onProgress,
		onComplete,
	} = options;

	useEffect(() => {
		systemRef.current = new ParticleSystemManager(particleEffect);

		if (autoStart) {
			startAnimation();
		}

		return () => {
			systemRef.current?.stop();
		};
	}, [particleEffect]);

	const startAnimation = useCallback(async () => {
		if (!systemRef.current) return;

		setIsAnimating(true);
		setProgress(0);

		try {
			await systemRef.current.start(duration);
			setIsAnimating(false);
			setProgress(1);
			onComplete?.();
		} catch (error) {
			console.error("Particle system error:", error);
			setIsAnimating(false);
		}
	}, [duration, onComplete]);

	const stopAnimation = useCallback(() => {
		systemRef.current?.stop();
		setIsAnimating(false);
	}, []);

	// Update particles periodically
	useEffect(() => {
		if (!isAnimating || !systemRef.current) return;

		const interval = setInterval(() => {
			const currentProgress = systemRef.current?.getProgress();
			const currentParticles = systemRef.current?.getParticles();

			setProgress(currentProgress);
			setParticles(currentParticles);

			onProgress?.(currentProgress);

			if (currentProgress >= 1) {
				clearInterval(interval);
			}
		}, 16); // ~60fps

		return () => clearInterval(interval);
	}, [isAnimating, onProgress]);

	return {
		startAnimation,
		stopAnimation,
		isAnimating,
		progress,
		particles,
		setCameraPosition: (position: Vector3D) =>
			systemRef.current?.setCameraPosition(position),
	};
}

// React Component for ParticleSystem
export function ParticleSystemComponent({
	particleEffect,
	onProgress,
	onComplete,
	autoStart = false,
	duration = 2000,
	children,
}: ParticleSystemProps) {
	const {
		startAnimation,
		stopAnimation,
		isAnimating,
		progress,
		particles,
		setCameraPosition,
	} = useParticleSystem(particleEffect, {
		autoStart,
		duration,
		onProgress,
		onComplete,
	});

	return (
		<div className="particle-system">
			{/* Particle rendering */}
			<div
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					width: "100%",
					height: "100%",
					pointerEvents: "none",
					zIndex: 8,
					overflow: "hidden",
				}}
			>
				{particles.map((particle) => (
					<ParticleComponent
						key={particle.id}
						particle={particle}
						progress={progress}
					/>
				))}
			</div>

			{/* Children content */}
			<div style={{ position: "relative", zIndex: 1 }}>{children}</div>
		</div>
	);
}

// Individual Particle Component
interface ParticleComponentProps {
	particle: Particle;
	progress: number;
}

function ParticleComponent({ particle, progress }: ParticleComponentProps) {
	const particleStyle: React.CSSProperties = {
		position: "absolute",
		left: `${50 + particle.position.x * 100}%`,
		top: `${50 + particle.position.y * 100}%`,
		width: `${particle.size * 20}px`,
		height: `${particle.size * 20}px`,
		backgroundColor: particle.color,
		borderRadius: "50%",
		opacity: particle.opacity * progress,
		boxShadow: `0 0 ${particle.size * 10}px ${particle.color}`,
		transform: `translate(-50%, -50%) rotate(${particle.rotation}rad)`,
		transition: "opacity 0.1s ease-out",
		zIndex: 10,
	};

	// Render trail for trail-type particles
	if (particle.trail.length > 1 && particleEffect.type === "trail") {
		return (
			<>
				{/* Trail segments */}
				{particle.trail.map((trailPoint, index) => (
					<div
						key={`${particle.id}-trail-${index}`}
						style={{
							position: "absolute",
							left: `${50 + trailPoint.x * 100}%`,
							top: `${50 + trailPoint.y * 100}%`,
							width: `${particle.size * 20 * (index / particle.trail.length)}px`,
							height: `${particle.size * 20 * (index / particle.trail.length)}px`,
							backgroundColor: particle.color,
							borderRadius: "50%",
							opacity:
								(particle.opacity * progress * index) / particle.trail.length,
							transform: "translate(-50%, -50%)",
							zIndex: 9,
						}}
					/>
				))}

				{/* Main particle */}
				<div style={particleStyle} />
			</>
		);
	}

	return <div style={particleStyle} />;
}

// WebGL Particle System for high-performance rendering
export class WebGLParticleSystem {
	private gl: WebGLRenderingContext | null = null;
	private program: WebGLProgram | null = null;
	private vertexBuffer: WebGLBuffer | null = null;
	private particles: Float32Array | null = null;
	private particleCount = 0;
	private isInitialized = false;

	constructor(webglContext: WebGLContext | null, maxParticles = 1000) {
		if (webglContext?.gl) {
			this.gl = webglContext.gl;
			this.particleCount = maxParticles;
			this.initializeWebGL();
		}
	}

	private initializeWebGL(): void {
		if (!this.gl) return;

		// Vertex shader
		const vertexShaderSource = `
			attribute vec3 a_position;
			attribute float a_size;
			attribute vec4 a_color;
			attribute float a_life;

			uniform mat4 u_mvpMatrix;
			uniform float u_time;

			varying vec4 v_color;
			varying float v_life;

			void main() {
				gl_Position = u_mvpMatrix * vec4(a_position, 1.0);
				gl_PointSize = a_size * (1.0 + a_life * 2.0);

				// Add some animation to particle size
				gl_PointSize *= (1.0 + sin(u_time * 2.0 + a_position.x) * 0.3);

				v_color = a_color;
				v_life = a_life;
			}
		`;

		// Fragment shader
		const fragmentShaderSource = `
			precision mediump float;

			varying vec4 v_color;
			varying float v_life;

			void main() {
				// Create circular particles
				vec2 coord = gl_PointCoord - vec2(0.5);
				float dist = length(coord);

				if (dist > 0.5) discard;

				// Soft edges
				float alpha = 1.0 - smoothstep(0.2, 0.5, dist);

				// Fade based on life
				alpha *= v_life;

				gl_FragColor = vec4(v_color.rgb, alpha * v_color.a);
			}
		`;

		// Create and compile shaders
		const vertexShader = this.createShader(
			this.gl.VERTEX_SHADER,
			vertexShaderSource,
		);
		const fragmentShader = this.createShader(
			this.gl.FRAGMENT_SHADER,
			fragmentShaderSource,
		);

		if (!vertexShader || !fragmentShader) return;

		// Create program
		this.program = this.gl.createProgram();
		if (!this.program) return;

		this.gl.attachShader(this.program, vertexShader);
		this.gl.attachShader(this.program, fragmentShader);
		this.gl.linkProgram(this.program);

		if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
			console.error("WebGL particle program linking failed");
			return;
		}

		// Create buffer for particle data
		this.vertexBuffer = this.gl.createBuffer();
		this.particles = new Float32Array(this.particleCount * 9); // 9 floats per particle

		this.isInitialized = true;
	}

	private createShader(type: number, source: string): WebGLShader | null {
		if (!this.gl) return null;

		const shader = this.gl.createShader(type);
		if (!shader) return null;

		this.gl.shaderSource(shader, source);
		this.gl.compileShader(shader);

		if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
			console.error(
				"Particle shader compilation failed:",
				this.gl.getShaderInfoLog(shader),
			);
			this.gl.deleteShader(shader);
			return null;
		}

		return shader;
	}

	updateParticles(particles: Particle[]): void {
		if (!this.gl || !this.particles || !this.isInitialized) return;

		// Update particle buffer data
		for (let i = 0; i < Math.min(particles.length, this.particleCount); i++) {
			const particle = particles[i];
			const baseIndex = i * 9;

			this.particles[baseIndex] = particle.position.x; // position x
			this.particles[baseIndex + 1] = particle.position.y; // position y
			this.particles[baseIndex + 2] = particle.position.z; // position z
			this.particles[baseIndex + 3] = particle.size; // size
			this.particles[baseIndex + 4] =
				Number.parseInt(particle.color.slice(1, 3), 16) / 255; // r
			this.particles[baseIndex + 5] =
				Number.parseInt(particle.color.slice(3, 5), 16) / 255; // g
			this.particles[baseIndex + 6] =
				Number.parseInt(particle.color.slice(5, 7), 16) / 255; // b
			this.particles[baseIndex + 7] = particle.opacity; // a
			this.particles[baseIndex + 8] = particle.life; // life
		}

		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
		this.gl.bufferData(
			this.gl.ARRAY_BUFFER,
			this.particles,
			this.gl.DYNAMIC_DRAW,
		);
	}

	render(mvpMatrix: Float32Array, time: number): void {
		if (!this.gl || !this.program || !this.isInitialized) return;

		this.gl.useProgram(this.program);

		// Set up attributes
		const positionLocation = this.gl.getAttribLocation(
			this.program,
			"a_position",
		);
		const sizeLocation = this.gl.getAttribLocation(this.program, "a_size");
		const colorLocation = this.gl.getAttribLocation(this.program, "a_color");
		const lifeLocation = this.gl.getAttribLocation(this.program, "a_life");

		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);

		// Position (vec3)
		this.gl.enableVertexAttribArray(positionLocation);
		this.gl.vertexAttribPointer(
			positionLocation,
			3,
			this.gl.FLOAT,
			false,
			36,
			0,
		);

		// Size (float)
		this.gl.enableVertexAttribArray(sizeLocation);
		this.gl.vertexAttribPointer(sizeLocation, 1, this.gl.FLOAT, false, 36, 12);

		// Color (vec4)
		this.gl.enableVertexAttribArray(colorLocation);
		this.gl.vertexAttribPointer(colorLocation, 4, this.gl.FLOAT, false, 36, 16);

		// Life (float)
		this.gl.enableVertexAttribArray(lifeLocation);
		this.gl.vertexAttribPointer(lifeLocation, 1, this.gl.FLOAT, false, 36, 32);

		// Set uniforms
		const mvpMatrixLocation = this.gl.getUniformLocation(
			this.program,
			"u_mvpMatrix",
		);
		const timeLocation = this.gl.getUniformLocation(this.program, "u_time");

		this.gl.uniformMatrix4fv(mvpMatrixLocation, false, mvpMatrix);
		this.gl.uniform1f(timeLocation, time);

		// Enable blending for transparency
		this.gl.enable(this.gl.BLEND);
		this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

		// Render particles
		this.gl.drawArrays(
			this.gl.POINTS,
			0,
			Math.min(this.particles.length / 9, this.particleCount),
		);

		this.gl.disable(this.gl.BLEND);
	}

	dispose(): void {
		if (this.gl) {
			if (this.program) this.gl.deleteProgram(this.program);
			if (this.vertexBuffer) this.gl.deleteBuffer(this.vertexBuffer);
		}
		this.isInitialized = false;
	}
}

// Utility functions for creating common particle effects
export const createParticleEffects = {
	trail: (color = "#ffffff", count = 50): ParticleEffect => ({
		enabled: true,
		type: "trail",
		count,
		size: 0.02,
		speed: 0.5,
		color,
		lifetime: 2000,
		followCamera: true,
	}),

	spark: (color = "#ffff00", count = 100): ParticleEffect => ({
		enabled: true,
		type: "spark",
		count,
		size: 0.03,
		speed: 1.0,
		color,
		lifetime: 1500,
		followCamera: false,
	}),

	flow: (color = "#00ffff", count = 30): ParticleEffect => ({
		enabled: true,
		type: "flow",
		count,
		size: 0.025,
		speed: 0.3,
		color,
		lifetime: 3000,
		followCamera: false,
	}),

	connection: (color = "#ff00ff", count = 75): ParticleEffect => ({
		enabled: true,
		type: "connection",
		count,
		size: 0.02,
		speed: 0.4,
		color,
		lifetime: 2500,
		followCamera: false,
	}),
};
