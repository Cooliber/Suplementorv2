/**
 * Cross-Platform Compatibility System
 * Ensures optimal gesture recognition across touch, mouse, stylus, and trackpad devices
 */

import {
	type GestureConfig,
	type GestureContext,
	type GestureEvent,
	type PlatformConfig,
	Point2D,
	TouchPoint,
} from "../types/gestures";

export class CrossPlatformCompatibility {
	private platformConfig: PlatformConfig;
	private context: GestureContext;
	private deviceCapabilities: DeviceCapabilities;
	private adaptationStrategies: Map<string, AdaptationStrategy> = new Map();

	constructor() {
		this.platformConfig = this.getDefaultPlatformConfig();
		this.context = this.detectContext();
		this.deviceCapabilities = this.detectCapabilities();
		this.initializeAdaptationStrategies();
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
	 * Detect current platform context
	 */
	private detectContext(): GestureContext {
		const userAgent = navigator.userAgent.toLowerCase();
		const isMobile =
			/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
				userAgent,
			);
		const isTablet = /ipad|android(?!.*mobi)/i.test(userAgent);
		const isTouchDevice =
			"ontouchstart" in window || navigator.maxTouchPoints > 0;

		// Detect device type
		let deviceType: "touch" | "mouse" | "stylus" | "trackpad" = "mouse";
		let inputType: "finger" | "pen" | "mouse" | "trackpad" = "mouse";
		let platform: "mobile" | "tablet" | "desktop" = "desktop";

		if (isTouchDevice && (isMobile || isTablet)) {
			deviceType = "touch";
			inputType = "finger";
			platform = isMobile ? "mobile" : "tablet";
		}

		// Detect macOS trackpad
		if (userAgent.includes("mac os") && !isTouchDevice) {
			deviceType = "trackpad";
			inputType = "trackpad";
		}

		// Detect Windows touch/pen
		if (userAgent.includes("windows") && isTouchDevice) {
			deviceType = "touch";
			inputType = "finger";
		}

		return {
			deviceType,
			inputType,
			platform,
			screenSize: {
				width: window.screen.width,
				height: window.screen.height,
			},
			pixelRatio: window.devicePixelRatio || 1,
			supportsPressure: this.detectPressureSupport(),
			maxTouchPoints: navigator.maxTouchPoints || 0,
		};
	}

	/**
	 * Detect device capabilities
	 */
	private detectCapabilities(): DeviceCapabilities {
		const canvas = document.createElement("canvas");
		const gl =
			canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

		return {
			touch: {
				maxTouchPoints: navigator.maxTouchPoints || 0,
				pressureSupport:
					"webkitForce" in document.createElement("div") ||
					"force" in new Touch({} as any),
				touchForceSupport: "force" in new Touch({} as any),
				touchRadiusSupport: "radiusX" in new Touch({} as any),
			},
			mouse: {
				wheelSupport: "onwheel" in window,
				rightClickSupport: true,
				middleClickSupport: true,
				movementXSupport: "movementX" in new MouseEvent(""),
			},
			stylus: {
				pointerEventsSupport: "PointerEvent" in window,
				tiltSupport: false, // Would need feature detection
				pressureSupport: "pressure" in new PointerEvent(""),
				tangentialPressureSupport: "tangentialPressure" in new PointerEvent(""),
			},
			trackpad: {
				gestureEventsSupport: "ongesturestart" in window,
				momentumScrollSupport: this.detectMomentumScroll(),
				forceTouchSupport: false, // macOS specific
			},
			performance: {
				hardwareConcurrency: navigator.hardwareConcurrency || 4,
				deviceMemory: (navigator as any).deviceMemory || 4,
				webGLSupport: !!gl,
				maxTextureSize: gl ? gl.getParameter(gl.MAX_TEXTURE_SIZE) : 2048,
			},
			screen: {
				width: window.screen.width,
				height: window.screen.height,
				pixelRatio: window.devicePixelRatio || 1,
				colorDepth: window.screen.colorDepth,
				refreshRate: (window.screen as any).refreshRate || 60,
			},
		};
	}

	/**
	 * Detect pressure sensitivity support
	 */
	private detectPressureSupport(): boolean {
		// Test for various pressure APIs
		const testDiv = document.createElement("div");

		return (
			"webkitForce" in testDiv ||
			"force" in new Touch({} as any) ||
			"pressure" in new PointerEvent("") ||
			(navigator as any).pointerEnabled === true
		);
	}

	/**
	 * Detect momentum scroll support (macOS trackpad)
	 */
	private detectMomentumScroll(): boolean {
		// This is a simplified detection - in practice, you'd need more sophisticated checks
		return (
			navigator.userAgent.includes("mac os") && !("ontouchstart" in window)
		);
	}

	/**
	 * Initialize platform-specific adaptation strategies
	 */
	private initializeAdaptationStrategies(): void {
		// Touch device adaptations
		this.adaptationStrategies.set("touch-mobile", {
			name: "Mobile Touch",
			platform: "mobile",
			optimizations: [
				"reduce-gesture-thresholds",
				"increase-touch-tolerance",
				"enable-simplified-gestures",
				"optimize-for-small-screens",
			],
			gestureConfig: {
				tap: { maxDuration: 300, maxMovement: 20 },
				pan: { minDistance: 15, minVelocity: 0.3 },
				pinch: { minScaleChange: 0.05 },
				swipe: { minVelocity: 0.8, minDistance: 100 },
			},
		});

		// Tablet adaptations
		this.adaptationStrategies.set("touch-tablet", {
			name: "Tablet Touch",
			platform: "tablet",
			optimizations: [
				"standard-gesture-thresholds",
				"enable-multi-touch",
				"optimize-for-precision",
			],
			gestureConfig: {
				tap: { maxDuration: 250, maxMovement: 15 },
				pan: { minDistance: 20, minVelocity: 0.5 },
				pinch: { minScaleChange: 0.03 },
				swipe: { minVelocity: 1.0, minDistance: 150 },
			},
		});

		// Desktop mouse adaptations
		this.adaptationStrategies.set("mouse-desktop", {
			name: "Desktop Mouse",
			platform: "desktop",
			optimizations: [
				"precise-gesture-detection",
				"enable-wheel-zoom",
				"support-right-click-pan",
				"high-precision-mode",
			],
			gestureConfig: {
				tap: { maxDuration: 200, maxMovement: 5 },
				pan: { minDistance: 5, minVelocity: 0.1 },
				pinch: { minScaleChange: 0.01 }, // Mouse wheel precision
				swipe: { minVelocity: 2.0, minDistance: 200 },
			},
		});

		// Stylus adaptations
		this.adaptationStrategies.set("stylus", {
			name: "Stylus/Pen",
			platform: "desktop",
			optimizations: [
				"pressure-sensitive-controls",
				"high-precision-mode",
				"tilt-aware-rotation",
				"palm-rejection",
			],
			gestureConfig: {
				tap: { maxDuration: 150, maxMovement: 2 },
				pan: { minDistance: 2, minVelocity: 0.05 },
				pressure: { sensitivity: 0.8, deadzone: 0.1 },
			},
		});

		// Trackpad adaptations (macOS)
		this.adaptationStrategies.set("trackpad-macos", {
			name: "macOS Trackpad",
			platform: "desktop",
			optimizations: [
				"momentum-scroll",
				"force-touch",
				"gesture-continuity",
				"smooth-scrolling",
			],
			gestureConfig: {
				pan: { minDistance: 10, minVelocity: 0.2, momentum: true },
				pinch: { minScaleChange: 0.02, snapToGrid: true },
				rotate: { minAngleChange: 1, maxAngularVelocity: 5 },
			},
		});
	}

	/**
	 * Adapt gesture configuration for current platform
	 */
	adaptForCurrentPlatform(baseConfig: GestureConfig): GestureConfig {
		const strategy = this.getCurrentStrategy();
		if (!strategy) return baseConfig;

		const adaptedConfig = { ...baseConfig };

		// Apply platform-specific gesture thresholds
		Object.keys(strategy.gestureConfig).forEach((gestureType) => {
			if (adaptedConfig[gestureType as keyof GestureConfig]) {
				adaptedConfig[gestureType as keyof GestureConfig] = {
					...adaptedConfig[gestureType as keyof GestureConfig],
					...strategy.gestureConfig[gestureType as keyof GestureConfig],
				};
			}
		});

		return adaptedConfig;
	}

	/**
	 * Get current adaptation strategy
	 */
	private getCurrentStrategy(): AdaptationStrategy | null {
		const { platform, deviceType, inputType } = this.context;

		// Find the most specific strategy for current context
		const strategyKey = `${deviceType}-${platform}`;
		return this.adaptationStrategies.get(strategyKey) || null;
	}

	/**
	 * Normalize touch events across platforms
	 */
	normalizeTouchEvent(event: TouchEvent): TouchEvent {
		// Platform-specific touch event normalization
		if (this.context.platform === "mobile") {
			return this.normalizeMobileTouch(event);
		}
		if (this.context.platform === "tablet") {
			return this.normalizeTabletTouch(event);
		}

		return event;
	}

	/**
	 * Normalize mobile touch events
	 */
	private normalizeMobileTouch(event: TouchEvent): TouchEvent {
		// Mobile-specific adjustments
		const normalizedEvent = new TouchEvent(event.type, {
			touches: event.touches,
			targetTouches: event.targetTouches,
			changedTouches: event.changedTouches,
			bubbles: event.bubbles,
			cancelable: event.cancelable,
		});

		// Adjust touch coordinates for mobile viewport
		Object.defineProperty(normalizedEvent, "touches", {
			value: Array.from(event.touches).map((touch) => ({
				...touch,
				clientX: touch.clientX * this.context.pixelRatio,
				clientY: touch.clientY * this.context.pixelRatio,
			})),
		});

		return normalizedEvent;
	}

	/**
	 * Normalize tablet touch events
	 */
	private normalizeTabletTouch(event: TouchEvent): TouchEvent {
		// Tablet-specific adjustments for stylus and finger differentiation
		return event;
	}

	/**
	 * Normalize mouse events across platforms
	 */
	normalizeMouseEvent(event: MouseEvent): MouseEvent {
		if (this.context.platform === "desktop") {
			return this.normalizeDesktopMouse(event);
		}

		return event;
	}

	/**
	 * Normalize desktop mouse events
	 */
	private normalizeDesktopMouse(event: MouseEvent): MouseEvent {
		// Desktop-specific mouse handling
		const normalizedEvent = new MouseEvent(event.type, {
			clientX: event.clientX,
			clientY: event.clientY,
			button: event.button,
			buttons: event.buttons,
			bubbles: event.bubbles,
			cancelable: event.cancelable,
		});

		return normalizedEvent;
	}

	/**
	 * Handle platform-specific pointer events
	 */
	handlePointerEvent(event: PointerEvent): GestureEvent[] {
		const events: GestureEvent[] = [];

		switch (event.pointerType) {
			case "mouse":
				events.push(...this.handleMousePointer(event));
				break;
			case "pen":
				events.push(...this.handlePenPointer(event));
				break;
			case "touch":
				events.push(...this.handleTouchPointer(event));
				break;
		}

		return events;
	}

	/**
	 * Handle mouse pointer events
	 */
	private handleMousePointer(event: PointerEvent): GestureEvent[] {
		// Convert pointer events to mouse events for compatibility
		const mouseEvent = new MouseEvent(event.type, {
			clientX: event.clientX,
			clientY: event.clientY,
			button: event.button,
			buttons: event.buttons,
		});

		// Emit custom event for gesture system
		const gestureEvent = new CustomEvent("normalizedMouseEvent", {
			detail: mouseEvent,
		});
		window.dispatchEvent(gestureEvent);

		return [];
	}

	/**
	 * Handle pen/stylus pointer events
	 */
	private handlePenPointer(event: PointerEvent): GestureEvent[] {
		const events: GestureEvent[] = [];

		// Extract stylus-specific data
		const stylusData = {
			pressure: event.pressure,
			tangentialPressure: event.tangentialPressure || 0,
			tiltX: event.tiltX || 0,
			tiltY: event.tiltY || 0,
			twist: event.twist || 0,
		};

		// Create stylus-specific gesture event
		const gestureEvent = new CustomEvent("stylusGesture", {
			detail: {
				type: "stylus",
				point: { x: event.clientX, y: event.clientY },
				stylusData,
				timestamp: Date.now(),
			},
		});

		window.dispatchEvent(gestureEvent);
		return events;
	}

	/**
	 * Handle touch pointer events
	 */
	private handleTouchPointer(event: PointerEvent): GestureEvent[] {
		// Convert touch pointer to touch event
		const touch = new Touch({
			identifier: event.pointerId,
			target: event.target as Element,
			clientX: event.clientX,
			clientY: event.clientY,
			force: event.pressure,
		});

		const touchEvent = new TouchEvent(event.type, {
			touches: [touch],
			targetTouches: [touch],
			changedTouches: [touch],
		});

		const gestureEvent = new CustomEvent("normalizedTouchEvent", {
			detail: touchEvent,
		});
		window.dispatchEvent(gestureEvent);

		return [];
	}

	/**
	 * Apply platform-specific optimizations
	 */
	applyPlatformOptimizations(): void {
		const strategy = this.getCurrentStrategy();
		if (!strategy) return;

		strategy.optimizations.forEach((optimization) => {
			this.applyOptimization(optimization);
		});
	}

	/**
	 * Apply specific optimization
	 */
	private applyOptimization(optimization: string): void {
		switch (optimization) {
			case "reduce-gesture-thresholds":
				this.reduceGestureThresholds();
				break;
			case "increase-touch-tolerance":
				this.increaseTouchTolerance();
				break;
			case "enable-simplified-gestures":
				this.enableSimplifiedGestures();
				break;
			case "optimize-for-small-screens":
				this.optimizeForSmallScreens();
				break;
			case "precise-gesture-detection":
				this.enablePreciseGestureDetection();
				break;
			case "enable-wheel-zoom":
				this.enableWheelZoom();
				break;
			case "pressure-sensitive-controls":
				this.enablePressureSensitiveControls();
				break;
			case "momentum-scroll":
				this.enableMomentumScroll();
				break;
		}
	}

	/**
	 * Reduce gesture thresholds for mobile
	 */
	private reduceGestureThresholds(): void {
		// Lower thresholds for better mobile responsiveness
		const style = document.createElement("style");
		style.textContent = `
      .gesture-target {
        touch-action: manipulation;
        -webkit-tap-highlight-color: transparent;
      }
    `;
		document.head.appendChild(style);
	}

	/**
	 * Increase touch tolerance for better mobile experience
	 */
	private increaseTouchTolerance(): void {
		// Increase hit areas for mobile
		const style = document.createElement("style");
		style.textContent = `
      @media (max-width: 768px) {
        .brain-region {
          min-height: 44px;
          min-width: 44px;
        }
      }
    `;
		document.head.appendChild(style);
	}

	/**
	 * Enable simplified gestures for mobile
	 */
	private enableSimplifiedGestures(): void {
		// Disable complex gestures on mobile
		this.platformConfig.touch.maxTouches = 2;
	}

	/**
	 * Optimize for small screens
	 */
	private optimizeForSmallScreens(): void {
		// Adjust UI for mobile screens
		const viewport = document.querySelector("meta[name=viewport]");
		if (viewport) {
			viewport.setAttribute(
				"content",
				"width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no",
			);
		}
	}

	/**
	 * Enable precise gesture detection for desktop
	 */
	private enablePreciseGestureDetection(): void {
		// Higher precision for mouse input
		this.platformConfig.mouse.wheelSupport = true;
	}

	/**
	 * Enable wheel zoom for desktop
	 */
	private enableWheelZoom(): void {
		// Mouse wheel zoom functionality
		window.addEventListener("wheel", this.handleWheelEvent.bind(this), {
			passive: false,
		});
	}

	/**
	 * Enable pressure-sensitive controls
	 */
	private enablePressureSensitiveControls(): void {
		// Enable pressure-based interactions
		this.platformConfig.stylus.pressureSensitivity = true;
	}

	/**
	 * Enable momentum scroll for trackpad
	 */
	private enableMomentumScroll(): void {
		// Smooth scrolling for trackpad
		document.documentElement.style.scrollBehavior = "smooth";
	}

	/**
	 * Handle wheel events for zoom
	 */
	private handleWheelEvent(event: WheelEvent): void {
		event.preventDefault();

		const zoomEvent = new CustomEvent("zoomGesture", {
			detail: {
				deltaY: event.deltaY,
				center: { x: event.clientX, y: event.clientY },
			},
		});

		window.dispatchEvent(zoomEvent);
	}

	/**
	 * Get platform-specific event listeners
	 */
	getPlatformEventListeners(): { [event: string]: (event: Event) => void } {
		const listeners: { [event: string]: (event: Event) => void } = {};

		if (this.platformConfig.touch.enabled) {
			listeners.touchstart = (e) => this.handleTouchStart(e as TouchEvent);
			listeners.touchmove = (e) => this.handleTouchMove(e as TouchEvent);
			listeners.touchend = (e) => this.handleTouchEnd(e as TouchEvent);
		}

		if (this.platformConfig.mouse.enabled) {
			listeners.mousedown = (e) => this.handleMouseDown(e as MouseEvent);
			listeners.mousemove = (e) => this.handleMouseMove(e as MouseEvent);
			listeners.mouseup = (e) => this.handleMouseUp(e as MouseEvent);
			listeners.wheel = (e) => this.handleWheelEvent(e as WheelEvent);
		}

		if (this.platformConfig.stylus.enabled && "PointerEvent" in window) {
			listeners.pointerdown = (e) => this.handlePointerEvent(e as PointerEvent);
			listeners.pointermove = (e) => this.handlePointerEvent(e as PointerEvent);
			listeners.pointerup = (e) => this.handlePointerEvent(e as PointerEvent);
		}

		return listeners;
	}

	/**
	 * Touch event handlers
	 */
	private handleTouchStart(event: TouchEvent): void {
		const normalizedEvent = this.normalizeTouchEvent(event);
		const gestureEvent = new CustomEvent("platformTouchStart", {
			detail: normalizedEvent,
		});
		window.dispatchEvent(gestureEvent);
	}

	private handleTouchMove(event: TouchEvent): void {
		const normalizedEvent = this.normalizeTouchEvent(event);
		const gestureEvent = new CustomEvent("platformTouchMove", {
			detail: normalizedEvent,
		});
		window.dispatchEvent(gestureEvent);
	}

	private handleTouchEnd(event: TouchEvent): void {
		const normalizedEvent = this.normalizeTouchEvent(event);
		const gestureEvent = new CustomEvent("platformTouchEnd", {
			detail: normalizedEvent,
		});
		window.dispatchEvent(gestureEvent);
	}

	/**
	 * Mouse event handlers
	 */
	private handleMouseDown(event: MouseEvent): void {
		const normalizedEvent = this.normalizeMouseEvent(event);
		const gestureEvent = new CustomEvent("platformMouseDown", {
			detail: normalizedEvent,
		});
		window.dispatchEvent(gestureEvent);
	}

	private handleMouseMove(event: MouseEvent): void {
		const normalizedEvent = this.normalizeMouseEvent(event);
		const gestureEvent = new CustomEvent("platformMouseMove", {
			detail: normalizedEvent,
		});
		window.dispatchEvent(gestureEvent);
	}

	private handleMouseUp(event: MouseEvent): void {
		const normalizedEvent = this.normalizeMouseEvent(event);
		const gestureEvent = new CustomEvent("platformMouseUp", {
			detail: normalizedEvent,
		});
		window.dispatchEvent(gestureEvent);
	}

	/**
	 * Get current context
	 */
	getContext(): GestureContext {
		return { ...this.context };
	}

	/**
	 * Get device capabilities
	 */
	getDeviceCapabilities(): DeviceCapabilities {
		return { ...this.deviceCapabilities };
	}

	/**
	 * Update platform configuration
	 */
	updatePlatformConfig(config: Partial<PlatformConfig>): void {
		this.platformConfig = { ...this.platformConfig, ...config };
	}

	/**
	 * Check if platform supports specific feature
	 */
	supports(feature: string): boolean {
		switch (feature) {
			case "multi-touch":
				return this.deviceCapabilities.touch.maxTouchPoints > 1;
			case "pressure":
				return this.deviceCapabilities.touch.pressureSupport;
			case "stylus":
				return this.deviceCapabilities.stylus.pointerEventsSupport;
			case "momentum-scroll":
				return this.deviceCapabilities.trackpad.momentumScrollSupport;
			case "wheel-zoom":
				return this.deviceCapabilities.mouse.wheelSupport;
			default:
				return false;
		}
	}

	/**
	 * Get platform-specific CSS styles
	 */
	getPlatformStyles(): string {
		const styles: string[] = [];

		if (this.context.platform === "mobile") {
			styles.push(`
        * {
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
        }
        .gesture-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 9999;
        }
      `);
		}

		if (this.context.platform === "desktop") {
			styles.push(`
        .brain-model-container {
          cursor: grab;
        }
        .brain-model-container:active {
          cursor: grabbing;
        }
      `);
		}

		return styles.join("\n");
	}

	/**
	 * Dispose of resources
	 */
	dispose(): void {
		// Remove injected styles
		const styleElements = document.querySelectorAll(
			"style[data-platform-compatibility]",
		);
		styleElements.forEach((el) => el.remove());
	}
}

// Supporting interfaces
interface DeviceCapabilities {
	touch: {
		maxTouchPoints: number;
		pressureSupport: boolean;
		touchForceSupport: boolean;
		touchRadiusSupport: boolean;
	};
	mouse: {
		wheelSupport: boolean;
		rightClickSupport: boolean;
		middleClickSupport: boolean;
		movementXSupport: boolean;
	};
	stylus: {
		pointerEventsSupport: boolean;
		tiltSupport: boolean;
		pressureSupport: boolean;
		tangentialPressureSupport: boolean;
	};
	trackpad: {
		gestureEventsSupport: boolean;
		momentumScrollSupport: boolean;
		forceTouchSupport: boolean;
	};
	performance: {
		hardwareConcurrency: number;
		deviceMemory: number;
		webGLSupport: boolean;
		maxTextureSize: number;
	};
	screen: {
		width: number;
		height: number;
		pixelRatio: number;
		colorDepth: number;
		refreshRate: number;
	};
}

interface AdaptationStrategy {
	name: string;
	platform: string;
	optimizations: string[];
	gestureConfig: Partial<GestureConfig>;
}
