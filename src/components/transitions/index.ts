// Export all transition-related components and utilities

// Core transition management
export {
	SystemTransitionManager,
	useSystemTransitionManager,
	createSystemTransition,
} from "./SystemTransitionManager";

// Camera animation system
export {
	CameraPathAnimator,
	useCameraPathAnimator,
	CameraPathAnimatorComponent,
	createCameraPaths,
} from "./CameraPathAnimator";

// Overlay effects
export {
	OverlayTransitionEffect,
	useOverlayTransitionEffect,
	OverlayTransitionEffectComponent,
	WebGLOverlayEffect,
	createOverlayEffects,
} from "./OverlayTransitionEffect";

// Connection visualization
export {
	ConnectionVisualizer,
	useConnectionVisualizer,
	ConnectionVisualizerComponent,
	generateSystemConnections,
} from "./ConnectionVisualizer";

// Particle systems
export {
	ParticleSystemManager,
	useParticleSystem,
	ParticleSystemComponent,
	WebGLParticleSystem,
	createParticleEffects,
} from "./ParticleSystem";

// Polish language integration
export {
	PolishLabelAnimator,
	usePolishLanguageIntegration,
	PolishLanguageIntegrationComponent,
	PolishTextToSpeech,
	MedicalPronunciationSystem,
	PolishCulturalContext,
	createPolishLanguageConfigs,
	createVoiceOverConfigs,
} from "./PolishLanguageIntegration";

// Re-export types for convenience
export type {
	TransitionConfig,
	TransitionState,
	SystemTransitionEvent,
	DeviceCapabilities,
	CameraPath,
	CameraWaypoint,
	Vector3D,
	TransitionEasing,
	OverlayEffect,
	AnatomicalOverlay,
	ParticleEffect,
	GlowEffect,
	DepthOfFieldEffect,
	ColorGradingEffect,
	ColorTheme,
	PolishLabelConfig,
	PolishLabel,
	VoiceOverConfig,
	VoiceTiming,
	AccessibilityConfig,
	PerformanceConfig,
	TouchGestureConfig,
	WebGLContext,
	AnimationFrame,
	MemoryPool,
	SystemConnection,
	ConnectionPath,
} from "@/lib/types/transitions";

// Utility functions for creating common transition configurations
export const createTransitionPresets = {
	// Quick transition between body systems
	quickTransition: (sourceId: string, targetId: string) => ({
		id: `quick-${sourceId}-to-${targetId}`,
		sourceSystemId: sourceId,
		targetSystemId: targetId,
		duration: 1500,
		easing: "easeInOut" as TransitionEasing,
		cameraPath: createCameraPaths.cinematic({ x: 0, y: 0, z: 0 }),
		overlayEffect: createOverlayEffects.fade(0.6),
		particleEffect: createParticleEffects.trail("#ffffff", 30),
	}),

	// Educational transition with detailed explanations
	educationalTransition: (sourceId: string, targetId: string) => ({
		id: `educational-${sourceId}-to-${targetId}`,
		sourceSystemId: sourceId,
		targetSystemId: targetId,
		duration: 3000,
		easing: "easeInOutCubic" as TransitionEasing,
		cameraPath: createCameraPaths.orbital({ x: 0, y: 0, z: 0 }, 3),
		overlayEffect: createOverlayEffects.anatomical(true, true, true, "#00ff88"),
		particleEffect: createParticleEffects.flow("#00ffff", 40),
		polishLabels: createPolishLanguageConfigs.educational([]),
		voiceOver: createVoiceOverConfigs.polishFemale(),
	}),

	// Cinematic transition for dramatic effect
	cinematricTransition: (sourceId: string, targetId: string) => ({
		id: `cinematic-${sourceId}-to-${targetId}`,
		sourceSystemId: sourceId,
		targetSystemId: targetId,
		duration: 4000,
		easing: "easeInOutQuart" as TransitionEasing,
		cameraPath: createCameraPaths.spiral({ x: 0, y: 0, z: 0 }, 4),
		overlayEffect: createOverlayEffects.blend(0.8, "soft-light"),
		particleEffect: createParticleEffects.spark("#ffff00", 80),
		glowEffect: {
			enabled: true,
			targetSystem: targetId,
			intensity: 1.0,
			color: "#ff0080",
			radius: 1.0,
			animation: "breathe" as const,
		},
	}),

	// Mobile-optimized transition
	mobileTransition: (sourceId: string, targetId: string) => ({
		id: `mobile-${sourceId}-to-${targetId}`,
		sourceSystemId: sourceId,
		targetSystemId: targetId,
		duration: 1000,
		easing: "easeOut" as TransitionEasing,
		cameraPath: createCameraPaths.linear(
			{ x: 0, y: 0, z: 2 },
			{ x: 0, y: 0, z: 0 },
		),
		overlayEffect: createOverlayEffects.fade(0.4),
		particleEffect: createParticleEffects.trail("#ffffff", 20),
		performance: {
			targetFPS: 30,
			adaptiveQuality: true,
			maxParticles: 50,
			renderScale: 0.7,
			enableLOD: true,
			memoryLimit: 128 * 1024 * 1024,
		},
	}),
};

// Integration helper for existing suplementor navigation
export function integrateWithSuplementorNavigation() {
	// This function would integrate the transition system with existing navigation
	// For now, it provides a placeholder for future integration

	return {
		// Navigation integration methods would go here
		setupNavigationTransitions: (navigationElement: HTMLElement) => {
			console.log("Setting up navigation transitions for:", navigationElement);
		},

		// Touch gesture integration
		setupTouchGestures: (containerElement: HTMLElement) => {
			console.log("Setting up touch gestures for:", containerElement);
		},

		// Accessibility integration
		setupAccessibility: (rootElement: HTMLElement) => {
			console.log("Setting up accessibility features for:", rootElement);
		},
	};
}

// Performance monitoring utilities
export const performanceUtils = {
	// Monitor frame rate
	monitorFPS: (callback: (fps: number) => void) => {
		let frameCount = 0;
		let lastTime = performance.now();

		const monitor = () => {
			frameCount++;
			const currentTime = performance.now();

			if (currentTime - lastTime >= 1000) {
				const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
				callback(fps);
				frameCount = 0;
				lastTime = currentTime;
			}

			requestAnimationFrame(monitor);
		};

		requestAnimationFrame(monitor);
	},

	// Monitor memory usage
	monitorMemory: (
		callback: (memoryInfo: {
			used: number;
			total: number;
			percentage: number;
		}) => void,
	) => {
		const checkMemory = () => {
			if ("memory" in performance) {
				const memory = (performance as any).memory;
				callback({
					used: memory.usedJSHeapSize,
					total: memory.totalJSHeapSize,
					percentage: (memory.usedJSHeapSize / memory.totalJSHeapSize) * 100,
				});
			}
		};

		const interval = setInterval(checkMemory, 5000); // Check every 5 seconds
		return () => clearInterval(interval);
	},

	// Adaptive quality adjustment
	adjustQuality: (currentFPS: number, targetFPS = 60) => {
		const qualityScale = Math.max(0.5, Math.min(1.0, currentFPS / targetFPS));

		return {
			renderScale: qualityScale,
			maxParticles: Math.floor(100 * qualityScale),
			enableComplexEffects: qualityScale > 0.8,
			simplifyGeometry: qualityScale < 0.6,
		};
	},
};

// Accessibility utilities
export const accessibilityUtils = {
	// Reduce motion for users who prefer it
	respectReducedMotion: (): boolean => {
		if (typeof window === "undefined") return false;
		return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	},

	// High contrast mode detection
	isHighContrast: (): boolean => {
		if (typeof window === "undefined") return false;
		return window.matchMedia("(prefers-contrast: high)").matches;
	},

	// Screen reader detection
	hasScreenReader: (): boolean => {
		if (typeof window === "undefined") return false;
		return (
			window.navigator.userAgent.includes("NVDA") ||
			window.navigator.userAgent.includes("JAWS") ||
			window.navigator.userAgent.includes("VoiceOver")
		);
	},

	// Announce transition to screen readers
	announceTransition: (
		message: string,
		priority: "polite" | "assertive" = "polite",
	) => {
		if (typeof window === "undefined") return;

		const announcement = document.createElement("div");
		announcement.setAttribute("aria-live", priority);
		announcement.setAttribute("aria-atomic", "true");
		announcement.style.position = "absolute";
		announcement.style.left = "-10000px";
		announcement.style.width = "1px";
		announcement.style.height = "1px";
		announcement.style.overflow = "hidden";

		document.body.appendChild(announcement);
		announcement.textContent = message;

		// Remove after announcement
		setTimeout(() => {
			document.body.removeChild(announcement);
		}, 1000);
	},
};

// Mobile optimization utilities
export const mobileUtils = {
	// Touch gesture detection
	setupTouchGestures: (
		element: HTMLElement,
		callbacks: {
			onSwipeLeft?: () => void;
			onSwipeRight?: () => void;
			onSwipeUp?: () => void;
			onSwipeDown?: () => void;
			onPinch?: (scale: number) => void;
			onDoubleTap?: () => void;
		},
	) => {
		let startX = 0;
		let startY = 0;
		let startDistance = 0;
		let lastTap = 0;

		element.addEventListener("touchstart", (e) => {
			if (e.touches.length === 1) {
				startX = e.touches[0].clientX;
				startY = e.touches[0].clientY;

				// Double tap detection
				const now = Date.now();
				if (now - lastTap < 300) {
					callbacks.onDoubleTap?.();
				}
				lastTap = now;
			} else if (e.touches.length === 2) {
				startDistance = Math.hypot(
					e.touches[0].clientX - e.touches[1].clientX,
					e.touches[0].clientY - e.touches[1].clientY,
				);
			}
		});

		element.addEventListener("touchmove", (e) => {
			if (e.touches.length === 1 && startX && startY) {
				const currentX = e.touches[0].clientX;
				const currentY = e.touches[0].clientY;
				const diffX = startX - currentX;
				const diffY = startY - currentY;

				// Detect significant movement
				if (Math.abs(diffX) > 50 || Math.abs(diffY) > 50) {
					if (Math.abs(diffX) > Math.abs(diffY)) {
						if (diffX > 0) {
							callbacks.onSwipeLeft?.();
						} else {
							callbacks.onSwipeRight?.();
						}
					} else {
						if (diffY > 0) {
							callbacks.onSwipeUp?.();
						} else {
							callbacks.onSwipeDown?.();
						}
					}
					startX = 0;
					startY = 0;
				}
			} else if (e.touches.length === 2 && startDistance) {
				const currentDistance = Math.hypot(
					e.touches[0].clientX - e.touches[1].clientX,
					e.touches[0].clientY - e.touches[1].clientY,
				);
				const scale = currentDistance / startDistance;
				callbacks.onPinch?.(scale);
			}
		});
	},

	// Device capability detection
	getDeviceCapabilities: (): {
		isMobile: boolean;
		isTablet: boolean;
		hasTouch: boolean;
		screenSize: { width: number; height: number };
		pixelRatio: number;
	} => {
		if (typeof window === "undefined") {
			return {
				isMobile: false,
				isTablet: false,
				hasTouch: false,
				screenSize: { width: 1920, height: 1080 },
				pixelRatio: 1,
			};
		}

		const userAgent = window.navigator.userAgent;
		const isMobile =
			/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
				userAgent,
			);
		const isTablet = /iPad|Android(?!.*Mobile)/i.test(userAgent);
		const hasTouch =
			"ontouchstart" in window || window.navigator.maxTouchPoints > 0;

		return {
			isMobile,
			isTablet,
			hasTouch,
			screenSize: {
				width: window.screen.width,
				height: window.screen.height,
			},
			pixelRatio: window.devicePixelRatio || 1,
		};
	},
};

// WebGL utilities
export const webglUtils = {
	// Create WebGL context with fallbacks
	createContext: (canvas: HTMLCanvasElement): WebGLContext | null => {
		let gl = canvas.getContext("webgl2") as WebGL2RenderingContext;

		if (!gl) {
			gl = canvas.getContext("webgl") as WebGLRenderingContext;
		}

		if (!gl) {
			console.warn("WebGL not supported");
			return null;
		}

		return {
			gl,
			canvas,
			programs: new Map(),
			buffers: new Map(),
			textures: new Map(),
			framebuffers: new Map(),
			isContextLost: false,
		};
	},

	// Compile shader
	compileShader: (
		gl: WebGLRenderingContext,
		source: string,
		type: number,
	): WebGLShader | null => {
		const shader = gl.createShader(type);
		if (!shader) return null;

		gl.shaderSource(shader, source);
		gl.compileShader(shader);

		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
			console.error("Shader compilation error:", gl.getShaderInfoLog(shader));
			gl.deleteShader(shader);
			return null;
		}

		return shader;
	},

	// Create shader program
	createProgram: (
		gl: WebGLRenderingContext,
		vertexShader: WebGLShader,
		fragmentShader: WebGLShader,
	): WebGLProgram | null => {
		const program = gl.createProgram();
		if (!program) return null;

		gl.attachShader(program, vertexShader);
		gl.attachShader(program, fragmentShader);
		gl.linkProgram(program);

		if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
			console.error("Program linking error:", gl.getProgramInfoLog(program));
			gl.deleteProgram(program);
			return null;
		}

		return program;
	},

	// Create buffer
	createBuffer: (
		gl: WebGLRenderingContext,
		data: number[],
	): WebGLBuffer | null => {
		const buffer = gl.createBuffer();
		if (!buffer) return null;

		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);

		return buffer;
	},
};

// Animation easing functions
export const easingFunctions = {
	linear: (t: number): number => t,

	easeIn: (t: number): number => t * t,

	easeOut: (t: number): number => t * (2 - t),

	easeInOut: (t: number): number =>
		t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,

	easeInCubic: (t: number): number => t * t * t,

	easeOutCubic: (t: number): number => --t * t * t + 1,

	easeInOutCubic: (t: number): number =>
		t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,

	easeInQuart: (t: number): number => t * t * t * t,

	easeOutQuart: (t: number): number => 1 - --t * t * t * t,

	easeInOutQuart: (t: number): number =>
		t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t,

	easeInSine: (t: number): number => 1 - Math.cos((t * Math.PI) / 2),

	easeOutSine: (t: number): number => Math.sin((t * Math.PI) / 2),

	easeInOutSine: (t: number): number => -(Math.cos(Math.PI * t) - 1) / 2,
};

// Color utility functions
export const colorUtils = {
	// Convert hex to RGB
	hexToRgb: (hex: string): { r: number; g: number; b: number } | null => {
		const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result
			? {
					r: Number.parseInt(result[1], 16),
					g: Number.parseInt(result[2], 16),
					b: Number.parseInt(result[3], 16),
				}
			: null;
	},

	// Convert RGB to hex
	rgbToHex: (r: number, g: number, b: number): string => {
		return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
	},

	// Interpolate between two colors
	interpolateColor: (
		color1: string,
		color2: string,
		factor: number,
	): string => {
		const rgb1 = colorUtils.hexToRgb(color1);
		const rgb2 = colorUtils.hexToRgb(color2);

		if (!rgb1 || !rgb2) return color1;

		const r = Math.round(rgb1.r + (rgb2.r - rgb1.r) * factor);
		const g = Math.round(rgb1.g + (rgb2.g - rgb1.g) * factor);
		const b = Math.round(rgb1.b + (rgb2.b - rgb1.b) * factor);

		return colorUtils.rgbToHex(r, g, b);
	},

	// Get system-specific colors for Polish medical education
	getSystemColor: (systemName: string): string => {
		const colorMap: Record<string, string> = {
			"Układ sercowo-naczyniowy": "#ff0080", // Pink for cardiovascular
			"Układ pokarmowy": "#ff8000", // Orange for digestive
			"Układ nerwowy": "#ffff00", // Yellow for nervous
			"Układ hormonalny": "#00ffff", // Cyan for endocrine
			"Układ odpornościowy": "#00ff00", // Green for immune
			"Układ szkieletowy": "#ffffff", // White for skeletal
			"Układ mięśniowy": "#ff8000", // Orange for muscular
			"Układ oddechowy": "#80ff80", // Light green for respiratory
			"Układ limfatyczny": "#ff80ff", // Light pink for lymphatic
			"Układ moczowy": "#8080ff", // Light blue for urinary
			"Układ rozrodczy": "#ff8080", // Light red for reproductive
			"Układ powłokowy": "#80ffff", // Light cyan for integumentary
			"Układ endokannabinoidowy": "#8000ff", // Purple for endocannabinoid
		};

		return colorMap[systemName] || "#ffffff";
	},
};
