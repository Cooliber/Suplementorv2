"use client";

import {
	type AnatomicalOverlay,
	type OverlayEffect,
	TransitionEasing,
	type Vector3D,
	type WebGLContext,
} from "@/lib/types/transitions";
import { useCallback, useEffect, useRef, useState } from "react";

interface OverlayTransitionEffectProps {
	overlayEffect: OverlayEffect;
	onProgress?: (progress: number) => void;
	onComplete?: () => void;
	autoStart?: boolean;
	duration?: number;
	children?: React.ReactNode;
}

interface OverlayState {
	opacity: number;
	scale: number;
	rotation: number;
	position: Vector3D;
	blendMode: string;
}

export class OverlayTransitionEffect {
	private animationId: number | null = null;
	private startTime = 0;
	private isAnimating = false;
	private currentState: OverlayState;
	private webglContext: WebGLContext | null;

	constructor(
		private overlayEffect: OverlayEffect,
		webglContext?: WebGLContext | null,
	) {
		this.webglContext = webglContext || null;

		this.currentState = {
			opacity: this.overlayEffect.type === "fade" ? 0 : 1,
			scale: 1,
			rotation: 0,
			position: { x: 0, y: 0, z: 0 },
			blendMode: this.overlayEffect.blendMode,
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

				this.updateOverlayState(progress);

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
		return Math.min(elapsed / 2000, 1); // Default 2s duration
	}

	getCurrentState(): OverlayState {
		return { ...this.currentState };
	}

	private updateOverlayState(progress: number): void {
		switch (this.overlayEffect.type) {
			case "fade":
				this.updateFadeEffect(progress);
				break;
			case "blend":
				this.updateBlendEffect(progress);
				break;
			case "slide":
				this.updateSlideEffect(progress);
				break;
			case "zoom":
				this.updateZoomEffect(progress);
				break;
			case "anatomical":
				this.updateAnatomicalEffect(progress);
				break;
		}
	}

	private updateFadeEffect(progress: number): void {
		this.currentState.opacity = progress * this.overlayEffect.opacity;
		this.currentState.scale = 1 + progress * 0.1; // Slight scale increase
	}

	private updateBlendEffect(progress: number): void {
		this.currentState.opacity =
			this.overlayEffect.opacity * Math.sin(progress * Math.PI);
		this.currentState.rotation = progress * 0.1; // Subtle rotation
	}

	private updateSlideEffect(progress: number): void {
		const slideDistance = 100; // pixels
		this.currentState.position.x = (progress - 1) * slideDistance;
		this.currentState.opacity =
			Math.min(progress * 2, 1) * this.overlayEffect.opacity;
	}

	private updateZoomEffect(progress: number): void {
		const zoomFactor = 0.5 + progress * 0.5; // Zoom from 0.5x to 1x
		this.currentState.scale = zoomFactor;
		this.currentState.opacity = progress * this.overlayEffect.opacity;
	}

	private updateAnatomicalEffect(progress: number): void {
		if (this.overlayEffect.anatomicalOverlay) {
			const anatomical = this.overlayEffect.anatomicalOverlay;

			// Pulsing effect for anatomical elements
			if (anatomical.animation === "pulse") {
				this.currentState.opacity =
					anatomical.opacity * (0.5 + 0.5 * Math.sin(progress * Math.PI * 4));
			} else if (anatomical.animation === "glow") {
				this.currentState.opacity = anatomical.opacity * progress;
			} else if (anatomical.animation === "flow") {
				this.currentState.position.x = Math.sin(progress * Math.PI * 2) * 20;
				this.currentState.opacity = anatomical.opacity;
			} else {
				this.currentState.opacity = anatomical.opacity * progress;
			}
		}
	}
}

// React Hook for using OverlayTransitionEffect
export function useOverlayTransitionEffect(
	overlayEffect: OverlayEffect,
	options: {
		autoStart?: boolean;
		duration?: number;
		onProgress?: (progress: number) => void;
		onComplete?: () => void;
	} = {},
) {
	const effectRef = useRef<OverlayTransitionEffect | null>(null);
	const [isAnimating, setIsAnimating] = useState(false);
	const [progress, setProgress] = useState(0);
	const [currentState, setCurrentState] = useState<OverlayState | null>(null);

	const {
		autoStart = false,
		duration = 2000,
		onProgress,
		onComplete,
	} = options;

	useEffect(() => {
		effectRef.current = new OverlayTransitionEffect(overlayEffect);

		if (autoStart) {
			startAnimation();
		}

		return () => {
			effectRef.current?.stop();
		};
	}, [overlayEffect]);

	const startAnimation = useCallback(async () => {
		if (!effectRef.current) return;

		setIsAnimating(true);
		setProgress(0);

		try {
			await effectRef.current.start(duration);
			setIsAnimating(false);
			setProgress(1);
			onComplete?.();
		} catch (error) {
			console.error("Overlay transition error:", error);
			setIsAnimating(false);
		}
	}, [duration, onComplete]);

	const stopAnimation = useCallback(() => {
		effectRef.current?.stop();
		setIsAnimating(false);
	}, []);

	// Update state periodically
	useEffect(() => {
		if (!isAnimating || !effectRef.current) return;

		const interval = setInterval(() => {
			const currentProgress = effectRef.current?.getProgress();
			const state = effectRef.current?.getCurrentState();

			setProgress(currentProgress);
			setCurrentState(state);

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
		currentState,
	};
}

// React Component for OverlayTransitionEffect
export function OverlayTransitionEffectComponent({
	overlayEffect,
	onProgress,
	onComplete,
	autoStart = false,
	duration = 2000,
	children,
}: OverlayTransitionEffectProps) {
	const { startAnimation, stopAnimation, isAnimating, progress, currentState } =
		useOverlayTransitionEffect(overlayEffect, {
			autoStart,
			duration,
			onProgress,
			onComplete,
		});

	// Apply overlay styles based on current state
	const overlayStyle: React.CSSProperties = {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		pointerEvents: "none",
		opacity: currentState?.opacity || 0,
		transform: `scale(${currentState?.scale || 1}) rotate(${currentState?.rotation || 0}rad) translateX(${currentState?.position.x || 0}px)`,
		mixBlendMode: currentState?.blendMode as any,
		transition: "opacity 0.1s ease-out",
		zIndex: 10,
	};

	return (
		<div className="overlay-transition-effect">
			{/* Anatomical overlay content */}
			{overlayEffect.anatomicalOverlay && (
				<div style={overlayStyle}>
					<AnatomicalOverlayComponent
						overlay={overlayEffect.anatomicalOverlay}
					/>
				</div>
			)}

			{/* Children content */}
			<div style={{ position: "relative", zIndex: 1 }}>{children}</div>
		</div>
	);
}

// Anatomical Overlay Component
interface AnatomicalOverlayComponentProps {
	overlay: AnatomicalOverlay;
}

function AnatomicalOverlayComponent({
	overlay,
}: AnatomicalOverlayComponentProps) {
	return (
		<div className="anatomical-overlay" style={{ opacity: overlay.opacity }}>
			{overlay.showOrgans && (
				<div className="organs-layer">
					{/* Organ visualization would be rendered here */}
					<div
						className="organ-highlight"
						style={{
							position: "absolute",
							width: "100px",
							height: "100px",
							backgroundColor: overlay.color,
							borderRadius: "50%",
							top: "50%",
							left: "50%",
							transform: "translate(-50%, -50%)",
							animation:
								overlay.animation === "pulse" ? "pulse 2s infinite" : "none",
						}}
					>
						<style jsx>{`
							@keyframes pulse {
								0%, 100% { opacity: 0.3; transform: translate(-50%, -50%) scale(1); }
								50% { opacity: 0.7; transform: translate(-50%, -50%) scale(1.1); }
							}
						`}</style>
					</div>
				</div>
			)}

			{overlay.showConnections && (
				<div className="connections-layer">
					{/* Connection lines between organs */}
					<svg
						style={{
							position: "absolute",
							width: "100%",
							height: "100%",
							top: 0,
							left: 0,
						}}
					>
						<line
							x1="50%"
							y1="50%"
							x2="70%"
							y2="30%"
							stroke={overlay.color}
							strokeWidth="2"
							opacity={overlay.opacity * 0.6}
						>
							<animate
								attributeName="stroke-dasharray"
								values="0,20;20,0;0,20"
								dur="3s"
								repeatCount="indefinite"
							/>
						</line>
					</svg>
				</div>
			)}

			{overlay.showFunctions && (
				<div className="functions-layer">
					{/* Function labels */}
					<div
						style={{
							position: "absolute",
							top: "20%",
							left: "10%",
							color: overlay.color,
							fontSize: "14px",
							fontWeight: "bold",
							opacity: overlay.opacity,
							textShadow: "0 0 10px rgba(255,255,255,0.5)",
						}}
					>
						Funkcje organizmu
					</div>
				</div>
			)}
		</div>
	);
}

// WebGL Overlay Effect for advanced visual effects
export class WebGLOverlayEffect {
	private gl: WebGLRenderingContext | null = null;
	private program: WebGLProgram | null = null;
	private vertexBuffer: WebGLBuffer | null = null;
	private texture: WebGLTexture | null = null;
	private framebuffer: WebGLFramebuffer | null = null;
	private isInitialized = false;

	constructor(webglContext: WebGLContext | null) {
		if (webglContext?.gl) {
			this.gl = webglContext.gl;
			this.initializeWebGL();
		}
	}

	private initializeWebGL(): void {
		if (!this.gl) return;

		// Vertex shader for full-screen quad
		const vertexShaderSource = `
			attribute vec2 a_position;
			attribute vec2 a_texCoord;
			varying vec2 v_texCoord;
			void main() {
				gl_Position = vec4(a_position, 0.0, 1.0);
				v_texCoord = a_texCoord;
			}
		`;

		// Fragment shader for overlay effects
		const fragmentShaderSource = `
			precision mediump float;
			uniform float u_time;
			uniform float u_progress;
			uniform vec2 u_resolution;
			uniform sampler2D u_texture;
			varying vec2 v_texCoord;

			void main() {
				vec2 uv = v_texCoord;
				vec4 color = texture2D(u_texture, uv);

				// Apply overlay effect based on progress
				float opacity = u_progress * 0.7;
				vec3 overlayColor = vec3(0.0, 1.0, 0.5); // Cyan overlay

				// Blend modes
				vec3 blended = mix(color.rgb, overlayColor, opacity);

				gl_FragColor = vec4(blended, color.a);
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
			console.error("WebGL program linking failed");
			return;
		}

		// Create buffer for full-screen quad
		this.vertexBuffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);

		const vertices = new Float32Array([
			-1, -1, 0, 1, 1, -1, 1, 1, -1, 1, 0, 0, 1, 1, 1, 0,
		]);

		this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);

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
				"Shader compilation failed:",
				this.gl.getShaderInfoLog(shader),
			);
			this.gl.deleteShader(shader);
			return null;
		}

		return shader;
	}

	render(progress: number, texture?: WebGLTexture): void {
		if (!this.gl || !this.program || !this.isInitialized) return;

		this.gl.useProgram(this.program);

		// Set up attributes and uniforms
		const positionLocation = this.gl.getAttribLocation(
			this.program,
			"a_position",
		);
		const texCoordLocation = this.gl.getAttribLocation(
			this.program,
			"a_texCoord",
		);

		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
		this.gl.enableVertexAttribArray(positionLocation);
		this.gl.vertexAttribPointer(
			positionLocation,
			2,
			this.gl.FLOAT,
			false,
			16,
			0,
		);
		this.gl.enableVertexAttribArray(texCoordLocation);
		this.gl.vertexAttribPointer(
			texCoordLocation,
			2,
			this.gl.FLOAT,
			false,
			16,
			8,
		);

		// Set uniforms
		const timeLocation = this.gl.getUniformLocation(this.program, "u_time");
		const progressLocation = this.gl.getUniformLocation(
			this.program,
			"u_progress",
		);
		const resolutionLocation = this.gl.getUniformLocation(
			this.program,
			"u_resolution",
		);

		this.gl.uniform1f(timeLocation, performance.now() / 1000);
		this.gl.uniform1f(progressLocation, progress);
		this.gl.uniform2f(
			resolutionLocation,
			this.gl.canvas.width,
			this.gl.canvas.height,
		);

		// Render to framebuffer or screen
		this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
	}

	dispose(): void {
		if (this.gl) {
			if (this.program) this.gl.deleteProgram(this.program);
			if (this.vertexBuffer) this.gl.deleteBuffer(this.vertexBuffer);
			if (this.texture) this.gl.deleteTexture(this.texture);
			if (this.framebuffer) this.gl.deleteFramebuffer(this.framebuffer);
		}
		this.isInitialized = false;
	}
}

// Utility functions for creating common overlay effects
export const createOverlayEffects = {
	fade: (opacity = 0.7): OverlayEffect => ({
		type: "fade",
		opacity,
		blendMode: "normal",
	}),

	blend: (
		opacity = 0.5,
		blendMode:
			| "normal"
			| "multiply"
			| "screen"
			| "overlay"
			| "soft-light" = "soft-light",
	): OverlayEffect => ({
		type: "blend",
		opacity,
		blendMode,
	}),

	slide: (opacity = 0.8): OverlayEffect => ({
		type: "slide",
		opacity,
		blendMode: "normal",
	}),

	zoom: (opacity = 0.6): OverlayEffect => ({
		type: "zoom",
		opacity,
		blendMode: "normal",
	}),

	anatomical: (
		showOrgans = true,
		showConnections = true,
		showFunctions = false,
		color = "#00ff88",
	): OverlayEffect => ({
		type: "anatomical",
		opacity: 0.8,
		blendMode: "soft-light",
		anatomicalOverlay: {
			showOrgans,
			showConnections,
			showFunctions,
			opacity: 0.6,
			color,
			animation: "pulse",
		},
	}),
};
