"use client";

import type React from "react";

/**
 * Comprehensive Mobile Touch Gesture System for Suplementor Animations
 * Complete TypeScript interfaces and exports for mobile-optimized animation control
 */

// Core gesture interfaces
export type {
	TouchPoint,
	GestureState,
	SwipeGesture,
	PinchGesture,
	RotationGesture,
	PressureGesture,
	TapGesture,
	LongPressGesture,
	GestureCallbacks,
	GestureOptions,
	AnimationGestureMapping,
	MobileAnimationConfig,
	TouchAnimationController,
	MobilePerformanceMetrics,
	AccessibilityGestureConfig,
	VoiceCommand,
	MobileAnimationState,
} from "./mobile-touch-interfaces";

// Default configurations
export {
	DEFAULT_GESTURE_OPTIONS,
	DEFAULT_MOBILE_ANIMATION_CONFIG,
	DEFAULT_ACCESSIBILITY_CONFIG,
	VOICE_COMMANDS,
} from "./mobile-touch-interfaces";

// Advanced touch gesture hook
export { useAdvancedTouchGestures } from "./useAdvancedTouchGestures";

// Mobile animation controls component
export { MobileAnimationControls } from "../../components/animations/MobileAnimationControls";

// Responsive animation interface component
export { ResponsiveAnimationInterface } from "../../components/animations/ResponsiveAnimationInterface";

// Performance optimization system
export {
	useMobilePerformanceOptimizer,
	PerformanceMonitor,
} from "./MobilePerformanceOptimizer";

// Polish language mobile interface
export {
	PolishMobileInterface,
	usePolishLocalization,
	GestureHelp,
} from "./PolishMobileInterface";

// Voice control system
export { useVoiceControl, VoiceControlButton } from "./VoiceControlSystem";

// Accessibility features
export {
	usePolishAccessibility,
	AccessibilityPanel,
	ScreenReaderAnnouncer,
	useKeyboardNavigation,
} from "./PolishAccessibilityFeatures";

// Animation system integration
export {
	PhysiologicalAnimationController,
	PHYSIOLOGICAL_ANIMATIONS,
	SUPPLEMENT_MOLECULAR_EFFECTS,
	EASING_FUNCTIONS,
	type PhysiologicalAnimation,
	type AnimationController,
} from "./physiological-animations";

// System transition components
export {
	AudioNarrationManager,
	AnimationBookmarkManager,
	AdaptiveAnimationRenderer,
	SYSTEM_TRANSITIONS,
	POLISH_ANIMATION_LABELS,
} from "./system-transitions";

// Utility functions for gesture management
export const GestureUtils = {
	/**
	 * Calculate distance between two touch points
	 */
	calculateDistance: (point1: TouchPoint, point2: TouchPoint): number => {
		return Math.sqrt((point2.x - point1.x) ** 2 + (point2.y - point1.y) ** 2);
	},

	/**
	 * Calculate angle between two touch points
	 */
	calculateAngle: (point1: TouchPoint, point2: TouchPoint): number => {
		return Math.atan2(point2.y - point1.y, point2.x - point1.x);
	},

	/**
	 * Calculate center point of multiple touches
	 */
	calculateCenter: (points: TouchPoint[]): { x: number; y: number } => {
		if (points.length === 0) return { x: 0, y: 0 };

		const sumX = points.reduce((sum, point) => sum + point.x, 0);
		const sumY = points.reduce((sum, point) => sum + point.y, 0);

		return {
			x: sumX / points.length,
			y: sumY / points.length,
		};
	},

	/**
	 * Calculate velocity from touch points
	 */
	calculateVelocity: (
		currentPoints: TouchPoint[],
		previousPoints: TouchPoint[],
		deltaTime: number,
	): number => {
		if (
			currentPoints.length === 0 ||
			previousPoints.length === 0 ||
			deltaTime === 0
		) {
			return 0;
		}

		const currentCenter = GestureUtils.calculateCenter(currentPoints);
		const previousCenter = GestureUtils.calculateCenter(previousPoints);

		const distance = Math.sqrt(
			(currentCenter.x - previousCenter.x) ** 2 +
				(currentCenter.y - previousCenter.y) ** 2,
		);

		return distance / deltaTime;
	},

	/**
	 * Normalize pressure values (0-1)
	 */
	normalizePressure: (pressure: number): number => {
		return Math.max(0, Math.min(1, pressure));
	},

	/**
	 * Check if gesture is within valid bounds
	 */
	isValidGesture: (
		gesture: SwipeGesture | PinchGesture | RotationGesture,
	): boolean => {
		if ("velocity" in gesture && gesture.velocity < 0.1) {
			return false; // Too slow
		}

		if ("distance" in gesture && gesture.distance < 10) {
			return false; // Too short
		}

		return true;
	},

	/**
	 * Convert gesture to animation action
	 */
	gestureToAnimationAction: (
		gesture: string,
		parameters?: Record<string, any>,
	) => {
		const mappings: Record<string, any> = {
			"swipe-left": { action: "nextStep", polishDescription: "Następny krok" },
			"swipe-right": {
				action: "previousStep",
				polishDescription: "Poprzedni krok",
			},
			"swipe-up": {
				action: "increaseSpeed",
				parameters: { factor: 1.2 },
				polishDescription: "Przyspiesz",
			},
			"swipe-down": {
				action: "decreaseSpeed",
				parameters: { factor: 0.8 },
				polishDescription: "Zwolnij",
			},
			"pinch-in": { action: "zoomOut", polishDescription: "Pomniejsz" },
			"pinch-out": { action: "zoomIn", polishDescription: "Powiększ" },
			"double-tap": {
				action: "togglePlayPause",
				polishDescription: "Odtwórz/Pauza",
			},
			"long-press": { action: "showMenu", polishDescription: "Pokaż menu" },
		};

		return (
			mappings[gesture] || { action: "none", polishDescription: "Brak akcji" }
		);
	},

	/**
	 * Get culturally adapted gesture settings for Polish users
	 */
	getPolishGestureSettings: () => ({
		sensitivity: "medium" as const,
		hapticIntensity: "subtle" as const,
		touchTargetSize: 48, // Slightly larger for comfort
		animationSpeed: "normal" as const,
		voiceLanguage: "pl-PL" as const,
	}),

	/**
	 * Validate mobile device capabilities
	 */
	validateDeviceCapabilities: () => {
		const capabilities = {
			hasTouch: "ontouchstart" in window,
			maxTouchPoints: (navigator as any).maxTouchPoints || 1,
			hasPressure:
				"webkitForce" in document.createElement("div") ||
				"force" in document.createElement("div"),
			hasVibration: "vibrate" in navigator,
			hasSpeechRecognition:
				"webkitSpeechRecognition" in window || "SpeechRecognition" in window,
			screenWidth: window.innerWidth,
			screenHeight: window.innerHeight,
			pixelRatio: window.devicePixelRatio || 1,
		};

		return capabilities;
	},

	/**
	 * Get optimal performance settings for current device
	 */
	getOptimalPerformanceSettings: () => {
		const capabilities = GestureUtils.validateDeviceCapabilities();

		return {
			maxFrameRate:
				capabilities.hasTouch && capabilities.screenWidth < 768 ? 30 : 60,
			adaptiveQuality: true,
			batterySavingMode: capabilities.hasTouch && "getBattery" in navigator,
			memoryLimit: capabilities.screenWidth < 768 ? 50 : 100, // MB
			enableHapticFeedback: capabilities.hasVibration,
			enableVoiceControl: capabilities.hasSpeechRecognition,
		};
	},
};

// Animation gesture manager class
export class AnimationGestureManager {
	private gestureMappings: Map<string, AnimationGestureMapping> = new Map();
	private activeGestures: Set<string> = new Set();
	private animationController: TouchAnimationController | null = null;

	constructor(animationController?: TouchAnimationController) {
		this.animationController = animationController || null;
	}

	/**
	 * Register gesture mapping
	 */
	registerGesture(gesture: string, mapping: AnimationGestureMapping): void {
		this.gestureMappings.set(gesture, mapping);
	}

	/**
	 * Process gesture and execute animation action
	 */
	processGesture(gesture: string, parameters?: Record<string, any>): boolean {
		const mapping = this.gestureMappings.get(gesture);
		if (!mapping || !this.animationController) {
			return false;
		}

		this.activeGestures.add(gesture);

		try {
			switch (mapping.animationAction) {
				case "next-step":
					this.animationController.jumpToTime("current", 0); // This would need proper implementation
					break;
				case "previous-step":
					this.animationController.jumpToTime("current", 0); // This would need proper implementation
					break;
				case "speed-up":
					// Speed up animation based on parameters
					break;
				case "slow-down":
					// Slow down animation based on parameters
					break;
				case "zoom-in":
				case "zoom-out":
					// Handle zoom gestures
					break;
				default:
					console.warn(`Unknown animation action: ${mapping.animationAction}`);
			}

			return true;
		} catch (error) {
			console.error("Error processing gesture:", error);
			return false;
		} finally {
			this.activeGestures.delete(gesture);
		}
	}

	/**
	 * Get active gestures
	 */
	getActiveGestures(): string[] {
		return Array.from(this.activeGestures);
	}

	/**
	 * Check if gesture is currently active
	 */
	isGestureActive(gesture: string): boolean {
		return this.activeGestures.has(gesture);
	}

	/**
	 * Clear all gesture mappings
	 */
	clearMappings(): void {
		this.gestureMappings.clear();
	}

	/**
	 * Get gesture mapping
	 */
	getGestureMapping(gesture: string): AnimationGestureMapping | undefined {
		return this.gestureMappings.get(gesture);
	}
}

// Mobile animation preset configurations
export const MOBILE_ANIMATION_PRESETS = {
	/**
	 * Educational mobile preset - optimized for learning
	 */
	educational: {
		enableTouchGestures: true,
		enablePressureSensitivity: false,
		enableHapticFeedback: true,
		adaptiveFrameRate: true,
		maxFrameRate: 30,
		minFrameRate: 15,
		gestureMappings: [
			{
				gesture: "swipe-left",
				animationAction: "next-step",
				polishDescription: "Następny krok edukacyjny",
			},
			{
				gesture: "swipe-right",
				animationAction: "previous-step",
				polishDescription: "Poprzedni krok edukacyjny",
			},
			{
				gesture: "double-tap",
				animationAction: "toggle-play-pause",
				polishDescription: "Odtwórz lub wstrzymaj animację",
			},
		],
		polishInterface: true,
		voiceControl: true,
		accessibilityFeatures: true,
	},

	/**
	 * Performance mobile preset - optimized for smooth animation
	 */
	performance: {
		enableTouchGestures: true,
		enablePressureSensitivity: true,
		enableHapticFeedback: true,
		adaptiveFrameRate: true,
		maxFrameRate: 60,
		minFrameRate: 30,
		gestureMappings: [
			{
				gesture: "pressure-light",
				animationAction: "slow-down",
				parameters: { factor: 0.5 },
				polishDescription: "Lekkie naciśnięcie - zwolnij animację",
			},
			{
				gesture: "pressure-hard",
				animationAction: "speed-up",
				parameters: { factor: 2.0 },
				polishDescription: "Silne naciśnięcie - przyspiesz animację",
			},
		],
		polishInterface: false,
		voiceControl: false,
		accessibilityFeatures: false,
	},

	/**
	 * Accessibility mobile preset - optimized for users with disabilities
	 */
	accessibility: {
		enableTouchGestures: true,
		enablePressureSensitivity: false,
		enableHapticFeedback: true,
		adaptiveFrameRate: false,
		maxFrameRate: 30,
		minFrameRate: 15,
		gestureMappings: [
			{
				gesture: "swipe-left",
				animationAction: "next-step",
				polishDescription: "Następny krok - przesuń palcem w lewo",
			},
			{
				gesture: "swipe-right",
				animationAction: "previous-step",
				polishDescription: "Poprzedni krok - przesuń palcem w prawo",
			},
		],
		polishInterface: true,
		voiceControl: true,
		accessibilityFeatures: true,
	},
};

// Integration helper for existing animation components
export const MobileAnimationIntegration = {
	/**
	 * Enhance existing AnimationTimeline with mobile gestures
	 */
	enhanceAnimationTimeline: (
		timelineComponent: any,
		mobileOptions?: Partial<MobileAnimationConfig>,
	) => {
		const enhancedProps = {
			...timelineComponent.props,
			mobileConfig: { ...DEFAULT_MOBILE_ANIMATION_CONFIG, ...mobileOptions },
			enableTouchGestures: true,
			enableHapticFeedback: true,
		};

		return {
			...timelineComponent,
			props: enhancedProps,
		};
	},

	/**
	 * Create mobile-optimized animation sequence
	 */
	createMobileSequence: (
		steps: any[],
		options?: {
			enableVoiceControl?: boolean;
			enableAccessibility?: boolean;
			polishInterface?: boolean;
		},
	) => {
		return {
			...steps,
			mobileOptimized: true,
			voiceCommands: options?.enableVoiceControl !== false,
			accessibility: options?.enableAccessibility !== false,
			polishInterface: options?.polishInterface !== false,
		};
	},

	/**
	 * Validate mobile animation compatibility
	 */
	validateMobileCompatibility: (
		animationConfig: any,
	): {
		isCompatible: boolean;
		warnings: string[];
		recommendations: string[];
	} => {
		const warnings: string[] = [];
		const recommendations: string[] = [];

		if (!animationConfig.enableTouchGestures) {
			warnings.push("Touch gestures are disabled");
			recommendations.push(
				"Enable touch gestures for better mobile experience",
			);
		}

		if (animationConfig.maxFrameRate > 30) {
			warnings.push("High frame rate may cause performance issues on mobile");
			recommendations.push(
				"Consider reducing max frame rate to 30fps for mobile",
			);
		}

		if (!animationConfig.adaptiveFrameRate) {
			recommendations.push(
				"Enable adaptive frame rate for better battery life",
			);
		}

		return {
			isCompatible: warnings.length === 0,
			warnings,
			recommendations,
		};
	},
};

// Export all interfaces and types for external use
export type * from "./mobile-touch-interfaces";
export type * from "./useAdvancedTouchGestures";
export type * from "./PolishMobileInterface";
export type * from "./VoiceControlSystem";
export type * from "./PolishAccessibilityFeatures";
export type * from "./physiological-animations";

// Main mobile animation system class
export class MobileAnimationSystem {
	private gestureManager: AnimationGestureManager;
	private performanceOptimizer: any; // Would be the performance optimizer hook
	private accessibilityFeatures: any; // Would be the accessibility hook
	private voiceControl: any; // Would be the voice control hook

	constructor(options?: {
		enablePerformanceOptimization?: boolean;
		enableAccessibility?: boolean;
		enableVoiceControl?: boolean;
		polishInterface?: boolean;
	}) {
		this.gestureManager = new AnimationGestureManager();

		// Initialize default gesture mappings
		this.initializeDefaultMappings();

		if (options?.enablePerformanceOptimization) {
			// Initialize performance optimizer
		}

		if (options?.enableAccessibility) {
			// Initialize accessibility features
		}

		if (options?.enableVoiceControl) {
			// Initialize voice control
		}
	}

	private initializeDefaultMappings(): void {
		const defaultMappings: AnimationGestureMapping[] = [
			{
				gesture: "swipe-left",
				animationAction: "next-step",
				polishDescription: "Przejdź do następnego kroku",
			},
			{
				gesture: "swipe-right",
				animationAction: "previous-step",
				polishDescription: "Przejdź do poprzedniego kroku",
			},
			{
				gesture: "double-tap",
				animationAction: "toggle-play-pause",
				polishDescription: "Odtwórz lub wstrzymaj",
			},
			{
				gesture: "pinch-in",
				animationAction: "zoom-out",
				polishDescription: "Pomniejsz animację",
			},
			{
				gesture: "pinch-out",
				animationAction: "zoom-in",
				polishDescription: "Powiększ animację",
			},
		];

		defaultMappings.forEach((mapping) => {
			this.gestureManager.registerGesture(mapping.gesture, mapping);
		});
	}

	/**
	 * Process gesture input
	 */
	processGesture(gesture: string, parameters?: Record<string, any>): boolean {
		return this.gestureManager.processGesture(gesture, parameters);
	}

	/**
	 * Get system status
	 */
	getSystemStatus(): {
		activeGestures: string[];
		performanceLevel: "low" | "medium" | "high";
		accessibilityScore: number;
		voiceControlActive: boolean;
	} {
		return {
			activeGestures: this.gestureManager.getActiveGestures(),
			performanceLevel: "high", // Would be calculated from performance optimizer
			accessibilityScore: 85, // Would be calculated from accessibility features
			voiceControlActive: false, // Would be from voice control hook
		};
	}

	/**
	 * Update system configuration
	 */
	updateConfiguration(config: Partial<MobileAnimationConfig>): void {
		// Update various system components based on config
		if (config.gestureMappings) {
			config.gestureMappings.forEach((mapping) => {
				this.gestureManager.registerGesture(mapping.gesture, mapping);
			});
		}
	}
}

// React component that provides the complete mobile animation system
interface MobileAnimationProviderProps {
	children: React.ReactNode;
	config?: Partial<MobileAnimationConfig>;
	onGesture?: (gesture: string, parameters?: Record<string, any>) => void;
	onAnimationStateChange?: (state: MobileAnimationState) => void;
}

export const MobileAnimationProvider: React.FC<
	MobileAnimationProviderProps
> = ({ children, config = {}, onGesture, onAnimationStateChange }) => {
	const mobileSystem = new MobileAnimationSystem({
		enablePerformanceOptimization: true,
		enableAccessibility: true,
		enableVoiceControl: true,
		polishInterface: true,
	});

	return (
		<div className="mobile-animation-system" data-mobile-optimized="true">
			{children}
		</div>
	);
};

// Export everything needed for mobile animation development
export default {
	// Main components
	MobileAnimationControls,
	ResponsiveAnimationInterface,
	PerformanceMonitor,
	PolishMobileInterface,
	VoiceControlButton,
	AccessibilityPanel,

	// Hooks
	useAdvancedTouchGestures,
	useMobilePerformanceOptimizer,
	usePolishLocalization,
	useVoiceControl,
	usePolishAccessibility,
	useKeyboardNavigation,

	// Utilities
	GestureUtils,
	AnimationGestureManager,
	MobileAnimationSystem,
	MobileAnimationIntegration,

	// Presets
	MOBILE_ANIMATION_PRESETS,

	// Types (re-exported for convenience)
	type: {
		TouchPoint,
		GestureState,
		MobileAnimationConfig,
		AccessibilityConfig,
		VoiceCommand,
	},
};
