"use client";

import { type BodySystem, bodySystems } from "@/data/body-systems";
import {
	type AnimationFrame,
	type DeviceCapabilities,
	type MemoryPool,
	type SystemTransitionEvent,
	type TransitionConfig,
	type TransitionEasing,
	type TransitionState,
	Vector3D,
} from "@/lib/types/transitions";
import type React from "react";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useReducer,
	useRef,
} from "react";

// Transition Manager Context
interface TransitionManagerContextType {
	state: TransitionState;
	startTransition: (config: TransitionConfig) => Promise<void>;
	cancelTransition: (transitionId: string) => void;
	pauseTransition: (transitionId: string) => void;
	resumeTransition: (transitionId: string) => void;
	queueTransition: (config: TransitionConfig) => void;
	getDeviceCapabilities: () => DeviceCapabilities;
	updatePerformanceSettings: (settings: Partial<PerformanceConfig>) => void;
	onTransitionEvent: (
		callback: (event: SystemTransitionEvent) => void,
	) => () => void;
}

const TransitionManagerContext =
	createContext<TransitionManagerContextType | null>(null);

// Transition State Management
type TransitionAction =
	| { type: "START_TRANSITION"; config: TransitionConfig }
	| { type: "TRANSITION_PROGRESS"; transitionId: string; progress: number }
	| { type: "TRANSITION_COMPLETE"; transitionId: string }
	| { type: "TRANSITION_ERROR"; transitionId: string; error: string }
	| { type: "CANCEL_TRANSITION"; transitionId: string }
	| { type: "PAUSE_TRANSITION"; transitionId: string }
	| { type: "RESUME_TRANSITION"; transitionId: string }
	| { type: "QUEUE_TRANSITION"; config: TransitionConfig }
	| { type: "SET_PERFORMANCE_SETTINGS"; settings: Partial<PerformanceConfig> };

const initialState: TransitionState = {
	isActive: false,
	progress: 0,
	currentConfig: null,
	queue: [],
	isPaused: false,
};

function transitionReducer(
	state: TransitionState,
	action: TransitionAction,
): TransitionState {
	switch (action.type) {
		case "START_TRANSITION":
			return {
				...state,
				isActive: true,
				currentConfig: action.config,
				progress: 0,
				error: undefined,
			};

		case "TRANSITION_PROGRESS":
			return {
				...state,
				progress: action.progress,
			};

		case "TRANSITION_COMPLETE":
			return {
				...state,
				isActive: false,
				currentConfig: null,
				progress: 1,
				queue: state.queue.slice(1), // Remove completed transition from queue
			};

		case "TRANSITION_ERROR":
			return {
				...state,
				isActive: false,
				currentConfig: null,
				error: action.error,
			};

		case "CANCEL_TRANSITION":
			return {
				...state,
				isActive: false,
				currentConfig: null,
				progress: 0,
				queue: [],
			};

		case "PAUSE_TRANSITION":
			return {
				...state,
				isPaused: true,
			};

		case "RESUME_TRANSITION":
			return {
				...state,
				isPaused: false,
			};

		case "QUEUE_TRANSITION":
			return {
				...state,
				queue: [...state.queue, action.config],
			};

		default:
			return state;
	}
}

// Animation Frame Management
class AnimationFrameManager {
	private frames = new Map<number, AnimationFrame>();
	private nextId = 1;

	requestFrame(
		duration: number,
		callback: (progress: number) => void,
		easing: TransitionEasing = "easeInOut",
	): number {
		const id = this.nextId++;
		const startTime = performance.now();

		const frame: AnimationFrame = {
			id,
			startTime,
			duration,
			callback,
			easing,
		};

		this.frames.set(id, frame);
		this.animateFrame(frame);

		return id;
	}

	private animateFrame(frame: AnimationFrame): void {
		const animate = (currentTime: number) => {
			const elapsed = currentTime - frame.startTime;
			const rawProgress = Math.min(elapsed / frame.duration, 1);

			// Apply easing function
			const progress = this.applyEasing(rawProgress, frame.easing);

			frame.callback(progress);

			if (rawProgress < 1) {
				requestAnimationFrame(animate);
			} else {
				this.frames.delete(frame.id);
			}
		};

		requestAnimationFrame(animate);
	}

	private applyEasing(t: number, easing: TransitionEasing): number {
		switch (easing) {
			case "linear":
				return t;
			case "easeIn":
				return t * t;
			case "easeOut":
				return t * (2 - t);
			case "easeInOut":
				return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
			case "easeInCubic":
				return t * t * t;
			case "easeOutCubic":
				return --t * t * t + 1;
			case "easeInOutCubic":
				return t < 0.5
					? 4 * t * t * t
					: (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
			case "easeInQuart":
				return t * t * t * t;
			case "easeOutQuart":
				return 1 - --t * t * t * t;
			case "easeInOutQuart":
				return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
			case "easeInSine":
				return 1 - Math.cos((t * Math.PI) / 2);
			case "easeOutSine":
				return Math.sin((t * Math.PI) / 2);
			case "easeInOutSine":
				return -(Math.cos(Math.PI * t) - 1) / 2;
			default:
				return t;
		}
	}

	cancelFrame(id: number): void {
		this.frames.delete(id);
	}

	cancelAllFrames(): void {
		this.frames.clear();
	}
}

// Memory Management
class MemoryManager {
	private pool: MemoryPool = {
		buffers: new Map(),
		textures: new Map(),
		geometries: new Map(),
		currentUsage: 0,
		maxUsage: 256 * 1024 * 1024, // 256MB default
	};

	allocateBuffer(key: string, size: number): ArrayBuffer | null {
		if (this.pool.currentUsage + size > this.pool.maxUsage) {
			this.cleanup();
		}

		if (this.pool.currentUsage + size <= this.pool.maxUsage) {
			const buffer = new ArrayBuffer(size);
			this.pool.buffers.set(key, buffer);
			this.pool.currentUsage += size;
			return buffer;
		}

		return null;
	}

	deallocateBuffer(key: string): void {
		const buffer = this.pool.buffers.get(key);
		if (buffer) {
			this.pool.currentUsage -= buffer.byteLength;
			this.pool.buffers.delete(key);
		}
	}

	cleanup(): void {
		// Remove unused resources
		this.pool.buffers.clear();
		this.pool.textures.clear();
		this.pool.geometries.clear();
		this.pool.currentUsage = 0;
	}
}

// Main Transition Manager Component
interface SystemTransitionManagerProps {
	children: React.ReactNode;
	onTransitionComplete?: (sourceSystem: string, targetSystem: string) => void;
	onTransitionError?: (error: string) => void;
	defaultPerformanceSettings?: Partial<PerformanceConfig>;
}

export function SystemTransitionManager({
	children,
	onTransitionComplete,
	onTransitionError,
	defaultPerformanceSettings,
}: SystemTransitionManagerProps) {
	const [state, dispatch] = useReducer(transitionReducer, initialState);
	const animationManagerRef = useRef(new AnimationFrameManager());
	const memoryManagerRef = useRef(new MemoryManager());
	const eventListenersRef = useRef(
		new Set<(event: SystemTransitionEvent) => void>(),
	);
	const webglContextRef = useRef<WebGLContext | null>(null);

	// Initialize WebGL context and device capabilities
	useEffect(() => {
		const canvas = document.createElement("canvas");
		canvas.width = 1024;
		canvas.height = 1024;
		canvas.style.display = "none";
		document.body.appendChild(canvas);

		try {
			const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
			if (gl) {
				webglContextRef.current = {
					gl: gl as WebGLRenderingContext,
					canvas,
					programs: new Map(),
					buffers: new Map(),
					textures: new Map(),
					framebuffers: new Map(),
					isContextLost: false,
				};
			}
		} catch (error) {
			console.warn("WebGL not available:", error);
		}

		return () => {
			if (webglContextRef.current) {
				document.body.removeChild(canvas);
			}
		};
	}, []);

	// Process transition queue
	useEffect(() => {
		if (!state.isActive && !state.isPaused && state.queue.length > 0) {
			const nextTransition = state.queue[0];
			startTransition(nextTransition);
		}
	}, [state.isActive, state.isPaused, state.queue]);

	const getDeviceCapabilities = useCallback((): DeviceCapabilities => {
		const canvas = document.createElement("canvas");
		const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
		canvas.remove();

		if (!gl) {
			return {
				supportsWebGL: false,
				maxTextureSize: 0,
				supportsWebGL2: false,
				maxRenderbufferSize: 0,
				supportsFloatTextures: false,
				supportsHalfFloatTextures: false,
				maxViewportDims: [0, 0],
				maxFragmentUniformVectors: 0,
				maxVertexUniformVectors: 0,
				renderer: "",
				vendor: "",
			};
		}

		const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
		const renderer = debugInfo
			? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
			: "";
		const vendor = debugInfo
			? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL)
			: "";

		return {
			supportsWebGL: true,
			maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),
			supportsWebGL2: !!gl.getParameter(gl.VERSION).includes("WebGL 2.0"),
			maxRenderbufferSize: gl.getParameter(gl.MAX_RENDERBUFFER_SIZE),
			supportsFloatTextures: !!gl.getExtension("OES_texture_float"),
			supportsHalfFloatTextures: !!gl.getExtension("OES_texture_half_float"),
			maxViewportDims: gl.getParameter(gl.MAX_VIEWPORT_DIMS),
			maxFragmentUniformVectors: gl.getParameter(
				gl.MAX_FRAGMENT_UNIFORM_VECTORS,
			),
			maxVertexUniformVectors: gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS),
			renderer,
			vendor,
		};
	}, []);

	const emitTransitionEvent = useCallback((event: SystemTransitionEvent) => {
		eventListenersRef.current.forEach((listener) => {
			try {
				listener(event);
			} catch (error) {
				console.error("Error in transition event listener:", error);
			}
		});
	}, []);

	const startTransition = useCallback(
		async (config: TransitionConfig): Promise<void> => {
			dispatch({ type: "START_TRANSITION", config });

			emitTransitionEvent({
				type: "start",
				transitionId: config.id,
				progress: 0,
				timestamp: Date.now(),
			});

			try {
				// Initialize transition components
				const cameraAnimator = new CameraPathAnimator(
					config.cameraPath,
					animationManagerRef.current,
				);
				const overlayEffect = new OverlayTransitionEffect(
					config.overlayEffect,
					webglContextRef.current,
				);
				const particleSystem = config.particleEffect
					? new ParticleSystem(config.particleEffect, webglContextRef.current)
					: null;
				const glowEffect = config.glowEffect
					? new GlowEffect(config.glowEffect, webglContextRef.current)
					: null;

				// Start all animation components
				const promises = [cameraAnimator.start(), overlayEffect.start()];

				if (particleSystem) promises.push(particleSystem.start());
				if (glowEffect) promises.push(glowEffect.start());

				// Monitor progress
				const progressInterval = setInterval(() => {
					const progress = cameraAnimator.getProgress();
					dispatch({
						type: "TRANSITION_PROGRESS",
						transitionId: config.id,
						progress,
					});

					emitTransitionEvent({
						type: "progress",
						transitionId: config.id,
						progress,
						timestamp: Date.now(),
					});
				}, 16); // ~60fps

				// Wait for all animations to complete
				await Promise.all(promises);

				clearInterval(progressInterval);

				dispatch({ type: "TRANSITION_COMPLETE", transitionId: config.id });

				emitTransitionEvent({
					type: "complete",
					transitionId: config.id,
					progress: 1,
					timestamp: Date.now(),
				});

				onTransitionComplete?.(config.sourceSystemId, config.targetSystemId);
			} catch (error) {
				const errorMessage =
					error instanceof Error ? error.message : "Unknown transition error";
				dispatch({
					type: "TRANSITION_ERROR",
					transitionId: config.id,
					error: errorMessage,
				});

				emitTransitionEvent({
					type: "error",
					transitionId: config.id,
					progress: 0,
					timestamp: Date.now(),
					data: { error: errorMessage },
				});

				onTransitionError?.(errorMessage);
			}
		},
		[emitTransitionEvent, onTransitionComplete, onTransitionError],
	);

	const cancelTransition = useCallback(
		(transitionId: string) => {
			animationManagerRef.current.cancelAllFrames();
			dispatch({ type: "CANCEL_TRANSITION", transitionId });

			emitTransitionEvent({
				type: "cancel",
				transitionId,
				progress: state.progress,
				timestamp: Date.now(),
			});
		},
		[state.progress, emitTransitionEvent],
	);

	const pauseTransition = useCallback((transitionId: string) => {
		animationManagerRef.current.cancelAllFrames();
		dispatch({ type: "PAUSE_TRANSITION", transitionId });
	}, []);

	const resumeTransition = useCallback(
		(transitionId: string) => {
			if (state.currentConfig) {
				dispatch({ type: "RESUME_TRANSITION", transitionId });
				startTransition(state.currentConfig);
			}
		},
		[state.currentConfig, startTransition],
	);

	const queueTransition = useCallback((config: TransitionConfig) => {
		dispatch({ type: "QUEUE_TRANSITION", config });
	}, []);

	const updatePerformanceSettings = useCallback(
		(settings: Partial<PerformanceConfig>) => {
			dispatch({ type: "SET_PERFORMANCE_SETTINGS", settings });
		},
		[],
	);

	const onTransitionEvent = useCallback(
		(callback: (event: SystemTransitionEvent) => void) => {
			eventListenersRef.current.add(callback);
			return () => {
				eventListenersRef.current.delete(callback);
			};
		},
		[],
	);

	const contextValue: TransitionManagerContextType = {
		state,
		startTransition,
		cancelTransition,
		pauseTransition,
		resumeTransition,
		queueTransition,
		getDeviceCapabilities,
		updatePerformanceSettings,
		onTransitionEvent,
	};

	return (
		<TransitionManagerContext.Provider value={contextValue}>
			{children}
		</TransitionManagerContext.Provider>
	);
}

// Hook for using the transition manager
export function useSystemTransitionManager() {
	const context = useContext(TransitionManagerContext);
	if (!context) {
		throw new Error(
			"useSystemTransitionManager must be used within a SystemTransitionManager",
		);
	}
	return context;
}

// Helper function to create transition between two body systems
export function createSystemTransition(
	sourceSystem: BodySystem,
	targetSystem: BodySystem,
	options: Partial<TransitionConfig> = {},
): TransitionConfig {
	const transitionId = `transition-${sourceSystem.id}-to-${targetSystem.id}-${Date.now()}`;

	return {
		id: transitionId,
		sourceSystemId: sourceSystem.id,
		targetSystemId: targetSystem.id,
		duration: options.duration || 2000,
		easing: options.easing || "easeInOutCubic",
		cameraPath: options.cameraPath || {
			type: "cinematic",
			waypoints: [
				{
					position: { x: 0, y: 0, z: 5 },
					rotation: { x: 0, y: 0, z: 0 },
					zoom: 1,
					duration: 1000,
					easing: "easeOut",
				},
				{
					position: { x: 2, y: 1, z: 3 },
					rotation: { x: 0.2, y: 0.5, z: 0 },
					zoom: 1.2,
					duration: 1000,
					easing: "easeIn",
				},
			],
			rotation: { pitch: 0, yaw: 0, roll: 0, smoothness: 0.8 },
			zoom: { start: 1, end: 1.2, smoothness: 0.5 },
		},
		overlayEffect: options.overlayEffect || {
			type: "fade",
			opacity: 0.7,
			blendMode: "soft-light",
		},
		particleEffect: options.particleEffect || {
			enabled: true,
			type: "trail",
			count: 50,
			size: 0.02,
			speed: 0.5,
			color: "#ffffff",
			lifetime: 2000,
			followCamera: true,
		},
		glowEffect: options.glowEffect || {
			enabled: true,
			targetSystem: targetSystem.id,
			intensity: 0.8,
			color: "#00ff88",
			radius: 0.5,
			animation: "pulse",
		},
		polishLabels: options.polishLabels || {
			showLabels: true,
			labels: [
				{
					systemId: targetSystem.id,
					text: targetSystem.polishName,
					translation: targetSystem.name,
					pronunciation: targetSystem.polishName.toLowerCase(),
					medicalTerm: targetSystem.polishName,
					position: { x: 0, y: 0, z: 0 },
					showDuration: 1500,
				},
			],
			animation: "fade",
			fontSize: 24,
			fontFamily: "Inter, sans-serif",
			color: "#ffffff",
			position: "center",
		},
		accessibility: options.accessibility || {
			reduceMotion: false,
			highContrast: false,
			screenReader: true,
			keyboardNavigation: true,
			alternativeText: `Transition from ${sourceSystem.polishName} to ${targetSystem.polishName}`,
			descriptiveAudio: true,
		},
		performance: options.performance || {
			targetFPS: 60,
			adaptiveQuality: true,
			maxParticles: 100,
			renderScale: 1.0,
			enableLOD: true,
			memoryLimit: 256 * 1024 * 1024,
		},
	};
}

// Camera Path Animator (placeholder - will be implemented next)
class CameraPathAnimator {
	constructor(
		private cameraPath: CameraPath,
		private animationManager: AnimationFrameManager,
	) {}

	async start(): Promise<void> {
		// Implementation will be added in next step
		return Promise.resolve();
	}

	getProgress(): number {
		return 0;
	}
}

// Overlay Transition Effect (placeholder - will be implemented next)
class OverlayTransitionEffect {
	constructor(
		private overlayEffect: OverlayEffect,
		private webglContext: WebGLContext | null,
	) {}

	async start(): Promise<void> {
		// Implementation will be added in next step
		return Promise.resolve();
	}
}

// Particle System (placeholder - will be implemented next)
class ParticleSystem {
	constructor(
		private particleEffect: ParticleEffect,
		private webglContext: WebGLContext | null,
	) {}

	async start(): Promise<void> {
		// Implementation will be added in next step
		return Promise.resolve();
	}
}

// Glow Effect (placeholder - will be implemented next)
class GlowEffect {
	constructor(
		private glowEffect: GlowEffect,
		private webglContext: WebGLContext | null,
	) {}

	async start(): Promise<void> {
		// Implementation will be added in next step
		return Promise.resolve();
	}
}
