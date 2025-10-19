/**
 * Main Gesture Manager
 * Integrates all gesture systems and provides unified interface for 3D brain model interaction
 */

import type { Camera, Group } from "three";
import {
	type BrainRegion,
	type EducationalState,
	type GestureConfig,
	type GestureEvent,
	GestureHandlers,
	type GestureManipulationConfig,
	type GestureNavigationConfig,
	type GestureState,
	type GestureManager as IGestureManager,
	type ManipulationState,
	type NavigationState,
	type PerformanceConfig,
	type PlatformConfig,
	PolishGestureLabels,
	UseGestureReturn,
} from "../types/gestures";
import { CrossPlatformCompatibility } from "./CrossPlatformCompatibility";
import { GestureEducationalFeatures } from "./GestureEducationalFeatures";
import { GestureModelManipulation } from "./GestureModelManipulation";
import { GestureNavigationControls } from "./GestureNavigationControls";
import { GestureRecognitionEngine } from "./GestureRecognitionEngine";
import { PerformanceOptimizer } from "./PerformanceOptimizer";
import { PolishGestureLocalization } from "./PolishGestureLocalization";

export class GestureManager implements IGestureManager {
	// Core systems
	private recognitionEngine: GestureRecognitionEngine;
	private navigationControls: GestureNavigationControls;
	private modelManipulation: GestureModelManipulation;
	private educationalFeatures: GestureEducationalFeatures;
	private localization: PolishGestureLocalization;
	private platformCompatibility: CrossPlatformCompatibility;
	private performanceOptimizer: PerformanceOptimizer;

	// Configuration
	private config: GestureConfig &
		GestureNavigationConfig &
		GestureManipulationConfig;
	private platformConfig: PlatformConfig;
	private performanceConfig: PerformanceConfig;

	// State
	private state: GestureState &
		NavigationState &
		ManipulationState &
		EducationalState;
	private isInitialized = false;
	private eventListeners: Map<string, ((event: any) => void)[]> = new Map();

	constructor(
		camera: Camera,
		scene: Group,
		brainRegions: BrainRegion[],
		config?: Partial<
			GestureConfig & GestureNavigationConfig & GestureManipulationConfig
		>,
	) {
		// Initialize localization first
		this.localization = new PolishGestureLocalization();

		// Default configurations
		this.config = this.getDefaultConfig();
		this.platformConfig = this.getDefaultPlatformConfig();
		this.performanceConfig = this.getDefaultPerformanceConfig();

		// Apply custom configuration
		if (config) {
			this.config = { ...this.config, ...config };
		}

		// Initialize core systems
		this.recognitionEngine = new GestureRecognitionEngine(
			this.config,
			this.platformConfig,
			this.performanceConfig,
			this.localization.exportLabels(),
		);

		this.navigationControls = new GestureNavigationControls(
			camera,
			this.config as GestureNavigationConfig,
		);

		this.modelManipulation = new GestureModelManipulation(
			scene,
			camera,
			brainRegions,
			this.config as GestureManipulationConfig,
		);

		this.educationalFeatures = new GestureEducationalFeatures(
			this.localization.exportLabels(),
		);
		this.platformCompatibility = new CrossPlatformCompatibility();
		this.performanceOptimizer = new PerformanceOptimizer(
			this.performanceConfig,
		);

		// Initialize combined state
		this.state = {
			// Gesture state
			isActive: false,
			startTime: 0,
			currentTime: 0,
			duration: 0,
			velocity: { x: 0, y: 0 },
			acceleration: { x: 0, y: 0 },
			pressure: 0,

			// Navigation state
			camera: {
				position: { x: 5, y: 2, z: 5 },
				target: { x: 0, y: 0, z: 0 },
				distance: 7,
				angle: { x: 0, y: Math.PI / 4 },
			},
			controls: {
				orbit: true,
				zoom: true,
				pan: true,
				rotate: true,
				focus: true,
			},
			constraints: {
				minDistance: 1,
				maxDistance: 50,
				minPolarAngle: 0,
				maxPolarAngle: Math.PI,
				enableDamping: true,
				dampingFactor: 0.05,
			},

			// Manipulation state
			selectedRegions: [],
			highlightedRegions: [],
			dissectedRegions: [],
			visibleLayers: ["surface"],
			transparency: {},
			dissection: {
				active: false,
				progress: 0,
				animationSpeed: 1,
			},

			// Educational state
			learningMode: false,
			currentLesson: null,
			completedGestures: [],
			proficiency: {},
			tutorials: {
				enabled: true,
				currentStep: 0,
				autoAdvance: true,
			},
		};

		this.setupEventListeners();
	}

	/**
	 * Get default gesture configuration
	 */
	private getDefaultConfig(): GestureConfig {
		return {
			tap: {
				maxDuration: 250,
				maxMovement: 10,
				maxPressureChange: 0.1,
			},
			longPress: {
				minDuration: 1000,
				maxMovement: 20,
				activationPressure: 0.7,
			},
			pan: {
				minDistance: 15,
				minVelocity: 0.3,
				momentum: true,
				directionalLock: false,
			},
			pinch: {
				minScaleChange: 0.05,
				maxScaleVelocity: 5,
				snapToGrid: false,
				minScale: 0.1,
				maxScale: 5,
			},
			rotate: {
				minAngleChange: 5,
				maxAngularVelocity: 10,
				snapAngles: [0, 90, 180, 270],
			},
			swipe: {
				minVelocity: 1.0,
				maxDuration: 500,
				minDistance: 100,
				directions: ["up", "down", "left", "right"],
			},
			pressure: {
				enabled: true,
				sensitivity: 0.7,
				deadzone: 0.1,
				curve: "linear",
			},
			multiTouch: {
				maxTouches: 5,
				requireAllFingers: false,
				fingerSpacing: 50,
			},
		};
	}

	/**
	 * Get default platform configuration
	 */
	private getDefaultPlatformConfig(): PlatformConfig {
		return {
			touch: {
				enabled: true,
				maxTouches: 10,
				pressureSupport: false,
			},
			mouse: {
				enabled: true,
				wheelSupport: true,
				rightClickPan: true,
			},
			stylus: {
				enabled: false,
				pressureSensitivity: false,
				tiltSupport: false,
			},
			trackpad: {
				enabled: false,
				gestureSupport: false,
				momentumScroll: false,
			},
		};
	}

	/**
	 * Get default performance configuration
	 */
	private getDefaultPerformanceConfig(): PerformanceConfig {
		return {
			gestureProcessing: {
				debounceMs: 50,
				throttleMs: 16,
				maxQueueSize: 20,
			},
			rendering: {
				frameRate: 60,
				quality: "high",
				adaptiveQuality: true,
			},
			memory: {
				maxGestureHistory: 30,
				cleanupInterval: 5000,
			},
		};
	}

	/**
	 * Setup event listeners for system integration
	 */
	private setupEventListeners(): void {
		// Gesture recognition events
		this.addEventListener("touchstart", this.handleTouchStart.bind(this));
		this.addEventListener("touchmove", this.handleTouchMove.bind(this));
		this.addEventListener("touchend", this.handleTouchEnd.bind(this));
		this.addEventListener("mousedown", this.handleMouseDown.bind(this));
		this.addEventListener("mousemove", this.handleMouseMove.bind(this));
		this.addEventListener("mouseup", this.handleMouseUp.bind(this));
		this.addEventListener("wheel", this.handleWheel.bind(this));

		// Platform compatibility events
		this.addEventListener(
			"platformTouchStart",
			this.handlePlatformTouchStart.bind(this),
		);
		this.addEventListener(
			"platformTouchMove",
			this.handlePlatformTouchMove.bind(this),
		);
		this.addEventListener(
			"platformTouchEnd",
			this.handlePlatformTouchEnd.bind(this),
		);
		this.addEventListener(
			"platformMouseDown",
			this.handlePlatformMouseDown.bind(this),
		);
		this.addEventListener(
			"platformMouseMove",
			this.handlePlatformMouseMove.bind(this),
		);
		this.addEventListener(
			"platformMouseUp",
			this.handlePlatformMouseUp.bind(this),
		);

		// Optimized gesture events
		this.addEventListener(
			"optimizedGesture",
			this.handleOptimizedGesture.bind(this),
		);

		// Educational events
		this.addEventListener(
			"tutorialStarted",
			this.handleTutorialStarted.bind(this),
		);
		this.addEventListener(
			"tutorialCompleted",
			this.handleTutorialCompleted.bind(this),
		);
		this.addEventListener(
			"proficiencyUpdated",
			this.handleProficiencyUpdated.bind(this),
		);

		// Performance events
		this.addEventListener(
			"reduceQuality",
			this.handleQualityReduction.bind(this),
		);
		this.addEventListener(
			"increaseQuality",
			this.handleQualityIncrease.bind(this),
		);
	}

	/**
	 * Initialize the gesture manager
	 */
	async initialize(): Promise<void> {
		if (this.isInitialized) return;

		try {
			// Apply platform optimizations
			this.platformCompatibility.applyPlatformOptimizations();

			// Pre-allocate resources for better performance
			this.performanceOptimizer.preallocateResources();

			// Start performance monitoring
			this.performanceOptimizer.startMonitoring();

			// Auto-detect and optimize for current device
			const deviceType = this.detectDeviceType();
			this.performanceOptimizer.optimizeForDevice(deviceType);

			this.isInitialized = true;

			const event = new CustomEvent("gestureManagerInitialized", {
				detail: { success: true, deviceType },
			});
			window.dispatchEvent(event);
		} catch (error) {
			console.error("Failed to initialize GestureManager:", error);

			const event = new CustomEvent("gestureManagerInitialized", {
				detail: { success: false, error },
			});
			window.dispatchEvent(event);
		}
	}

	/**
	 * Detect current device type for optimization
	 */
	private detectDeviceType(): string {
		const userAgent = navigator.userAgent.toLowerCase();
		const canvas = document.createElement("canvas");
		const gl =
			canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

		if (
			/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
				userAgent,
			)
		) {
			// Mobile device
			if (gl && (navigator as any).deviceMemory > 4) {
				return "mobile-high-end";
			}
			return "mobile-low-end";
		}
		// Desktop device
		if (
			gl &&
			navigator.hardwareConcurrency > 4 &&
			(navigator as any).deviceMemory > 8
		) {
			return "desktop-high-end";
		}
		return "desktop-low-end";
	}

	/**
	 * Event handlers for touch input
	 */
	private handleTouchStart(event: TouchEvent): void {
		const gestures = this.recognitionEngine.processTouchEvent(event);
		gestures.forEach((gesture) => this.processGesture(gesture));
	}

	private handleTouchMove(event: TouchEvent): void {
		const gestures = this.recognitionEngine.processTouchEvent(event);
		gestures.forEach((gesture) => this.processGesture(gesture));
	}

	private handleTouchEnd(event: TouchEvent): void {
		const gestures = this.recognitionEngine.processTouchEvent(event);
		gestures.forEach((gesture) => this.processGesture(gesture));
	}

	/**
	 * Event handlers for mouse input
	 */
	private handleMouseDown(event: MouseEvent): void {
		const gestures = this.recognitionEngine.processMouseEvent(event);
		gestures.forEach((gesture) => this.processGesture(gesture));
	}

	private handleMouseMove(event: MouseEvent): void {
		const gestures = this.recognitionEngine.processMouseEvent(event);
		gestures.forEach((gesture) => this.processGesture(gesture));
	}

	private handleMouseUp(event: MouseEvent): void {
		const gestures = this.recognitionEngine.processMouseEvent(event);
		gestures.forEach((gesture) => this.processGesture(gesture));
	}

	private handleWheel(event: WheelEvent): void {
		const gestures = this.recognitionEngine.processMouseEvent(event);
		gestures.forEach((gesture) => this.processGesture(gesture));
	}

	/**
	 * Platform compatibility event handlers
	 */
	private handlePlatformTouchStart(event: CustomEvent): void {
		const gestures = this.recognitionEngine.processTouchEvent(event.detail);
		gestures.forEach((gesture) => this.processGesture(gesture));
	}

	private handlePlatformTouchMove(event: CustomEvent): void {
		const gestures = this.recognitionEngine.processTouchEvent(event.detail);
		gestures.forEach((gesture) => this.processGesture(gesture));
	}

	private handlePlatformTouchEnd(event: CustomEvent): void {
		const gestures = this.recognitionEngine.processTouchEvent(event.detail);
		gestures.forEach((gesture) => this.processGesture(gesture));
	}

	private handlePlatformMouseDown(event: CustomEvent): void {
		const gestures = this.recognitionEngine.processMouseEvent(event.detail);
		gestures.forEach((gesture) => this.processGesture(gesture));
	}

	private handlePlatformMouseMove(event: CustomEvent): void {
		const gestures = this.recognitionEngine.processMouseEvent(event.detail);
		gestures.forEach((gesture) => this.processGesture(gesture));
	}

	private handlePlatformMouseUp(event: CustomEvent): void {
		const gestures = this.recognitionEngine.processMouseEvent(event.detail);
		gestures.forEach((gesture) => this.processGesture(gesture));
	}

	/**
	 * Handle optimized gesture events
	 */
	private handleOptimizedGesture(event: CustomEvent): void {
		this.processGesture(event.detail);
	}

	/**
	 * Process incoming gesture
	 */
	private processGesture(gesture: GestureEvent): void {
		// Update state
		this.state.isActive = gesture.state.isActive;
		this.state.currentTime = gesture.timestamp;
		this.state.duration = gesture.state.duration;
		this.state.velocity = gesture.data.velocity || { x: 0, y: 0 };
		this.state.acceleration = gesture.data.velocity
			? { x: 0, y: 0 }
			: { x: 0, y: 0 }; // Simplified
		this.state.pressure = gesture.data.pressure || 0;

		// Route to appropriate system
		this.navigationControls.handleGesture(gesture);
		this.modelManipulation.handleGesture(gesture);

		// Track for educational features
		this.educationalFeatures.trackGestureUsage(gesture);

		// Queue for performance optimization
		this.performanceOptimizer.queueGesture(gesture);

		// Emit processed gesture event
		const event = new CustomEvent("gestureProcessed", {
			detail: gesture,
		});
		window.dispatchEvent(event);
	}

	/**
	 * Educational event handlers
	 */
	private handleTutorialStarted(event: CustomEvent): void {
		this.state.learningMode = true;
		this.state.currentLesson = event.detail.tutorialId;
		this.state.tutorials.currentStep = 0;
	}

	private handleTutorialCompleted(event: CustomEvent): void {
		this.state.learningMode = false;
		this.state.currentLesson = null;
		this.state.completedGestures.push(event.detail.tutorial.id);
	}

	private handleProficiencyUpdated(event: CustomEvent): void {
		const { gestureType, proficiency } = event.detail;
		this.state.proficiency[gestureType] = proficiency;
	}

	/**
	 * Performance event handlers
	 */
	private handleQualityReduction(event: CustomEvent): void {
		// Reduce rendering quality
		this.performanceConfig.rendering.quality = "medium";
		this.performanceOptimizer.updateConfig(this.performanceConfig);
	}

	private handleQualityIncrease(event: CustomEvent): void {
		// Increase rendering quality
		this.performanceConfig.rendering.quality = "high";
		this.performanceOptimizer.updateConfig(this.performanceConfig);
	}

	/**
	 * Recognize gesture from raw event
	 */
	recognizeGesture(
		event: TouchEvent | MouseEvent | PointerEvent,
	): GestureEvent | null {
		if (event instanceof TouchEvent) {
			const gestures = this.recognitionEngine.processTouchEvent(event);
			return gestures[0] || null;
		}
		if (event instanceof MouseEvent) {
			const gestures = this.recognitionEngine.processMouseEvent(event);
			return gestures[0] || null;
		}
		if (event instanceof PointerEvent) {
			const gestures = this.recognitionEngine.processPointerEvent(event);
			return gestures[0] || null;
		}

		return null;
	}

	/**
	 * Process gesture sequence for complex operations
	 */
	async processGestureSequence(sequenceId: string): Promise<boolean> {
		const tutorial = this.educationalFeatures.tutorials.get(sequenceId);
		if (!tutorial) return false;

		// This would need to be implemented in the educational features
		return false;
	}

	/**
	 * Update navigation state
	 */
	updateNavigationState(state: Partial<NavigationState>): void {
		this.state = { ...this.state, ...state };
		this.navigationControls.updateControls(state.controls || {});
	}

	/**
	 * Update manipulation state
	 */
	updateManipulationState(state: Partial<ManipulationState>): void {
		this.state = { ...this.state, ...state };
		this.modelManipulation.updateConfig(
			this.config as GestureManipulationConfig,
		);
	}

	/**
	 * Start tutorial
	 */
	async startTutorial(tutorialId: string): Promise<void> {
		return this.educationalFeatures.startTutorial(tutorialId);
	}

	/**
	 * End tutorial
	 */
	endTutorial(): void {
		this.educationalFeatures.setLearningMode(false);
	}

	/**
	 * Get gesture proficiency
	 */
	getGestureProficiency(gestureType: any): number {
		return this.educationalFeatures.getGestureProficiency(gestureType);
	}

	/**
	 * Set language
	 */
	setLanguage(language: "pl" | "en"): void {
		this.localization.setLanguage(language);
	}

	/**
	 * Get localized string
	 */
	getLocalizedString(key: string, params?: Record<string, string>): string {
		return this.localization.getLocalizedString(key, params);
	}

	/**
	 * Get performance statistics
	 */
	getPerformanceStats() {
		return this.performanceOptimizer.getPerformanceStats();
	}

	/**
	 * Optimize for device
	 */
	optimizeForDevice(deviceType: string): void {
		this.performanceOptimizer.optimizeForDevice(deviceType);
	}

	/**
	 * Event listener management
	 */
	private addEventListener(event: string, handler: (event: any) => void): void {
		if (!this.eventListeners.has(event)) {
			this.eventListeners.set(event, []);
		}
		this.eventListeners.get(event)?.push(handler);
		window.addEventListener(event, handler);
	}

	/**
	 * Get current state
	 */
	get state(): GestureState &
		NavigationState &
		ManipulationState &
		EducationalState {
		return {
			// Gesture state
			isActive: this.state.isActive,
			startTime: this.state.startTime,
			currentTime: this.state.currentTime,
			duration: this.state.duration,
			velocity: this.state.velocity,
			acceleration: this.state.acceleration,
			pressure: this.state.pressure,

			// Navigation state
			camera: this.navigationControls.getState().camera,
			controls: this.navigationControls.getState().controls,
			constraints: this.navigationControls.getState().constraints,

			// Manipulation state
			selectedRegions: this.modelManipulation.getState().selectedRegions,
			highlightedRegions: this.modelManipulation.getState().highlightedRegions,
			dissectedRegions: this.modelManipulation.getState().dissectedRegions,
			visibleLayers: this.modelManipulation.getState().visibleLayers,
			transparency: this.modelManipulation.getState().transparency,
			dissection: this.modelManipulation.getState().dissection,

			// Educational state
			learningMode: this.educationalFeatures.getState().learningMode,
			currentLesson: this.educationalFeatures.getState().currentLesson,
			completedGestures: this.educationalFeatures.getState().completedGestures,
			proficiency: this.educationalFeatures.getState().proficiency,
			tutorials: this.educationalFeatures.getState().tutorials,
		};
	}

	/**
	 * Set state
	 */
	set state(newState: GestureState &
		NavigationState &
		ManipulationState &
		EducationalState) {
		this.state = newState;
	}

	/**
	 * Event handlers (implementing interface)
	 */
	onGestureStart: (event: GestureEvent) => void = () => {};
	onGestureChange: (event: GestureEvent) => void = () => {};
	onGestureEnd: (event: GestureEvent) => void = () => {};

	/**
	 * Dispose of resources
	 */
	dispose(): void {
		// Dispose of all systems
		this.recognitionEngine = null as any;
		this.navigationControls.dispose();
		this.modelManipulation.dispose();
		this.educationalFeatures.dispose();
		this.performanceOptimizer.dispose();

		// Clear event listeners
		for (const [event, listeners] of this.eventListeners) {
			for (const listener of listeners) {
				window.removeEventListener(event, listener);
			}
		}
		this.eventListeners.clear();
	}
}
