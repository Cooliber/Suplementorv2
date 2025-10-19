/**
 * Advanced Gesture Recognition Engine
 * Handles multi-touch, mouse, and pressure-sensitive gesture detection
 */

import type {
	GestureAction,
	GestureCondition,
	GestureConfig,
	GestureContext,
	GestureData,
	GestureEvent,
	GestureSequence,
	GestureState,
	GestureStep,
	GestureType,
	PerformanceConfig,
	PlatformConfig,
	Point2D,
	PolishGestureLabels,
	TouchPoint,
} from "../types/gestures";

export class GestureRecognitionEngine {
	private config: GestureConfig;
	private platformConfig: PlatformConfig;
	private performanceConfig: PerformanceConfig;
	private context: GestureContext;
	private activeGestures: Map<string, GestureState> = new Map();
	private gestureHistory: GestureEvent[] = [];
	private polishLabels: PolishGestureLabels;
	private lastCleanup = 0;

	constructor(
		config: GestureConfig,
		platformConfig: PlatformConfig,
		performanceConfig: PerformanceConfig,
		polishLabels: PolishGestureLabels,
	) {
		this.config = config;
		this.platformConfig = platformConfig;
		this.performanceConfig = performanceConfig;
		this.polishLabels = polishLabels;
		this.context = this.detectContext();
	}

	/**
	 * Detect the current device and input context
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

		let deviceType: "touch" | "mouse" | "stylus" | "trackpad" = "mouse";
		let inputType: "finger" | "pen" | "mouse" | "trackpad" = "mouse";
		let platform: "mobile" | "tablet" | "desktop" = "desktop";

		if (isTouchDevice) {
			deviceType = "touch";
			inputType = "finger";
			platform = isMobile ? "mobile" : isTablet ? "tablet" : "desktop";
		}

		// Detect stylus/pen input
		if ("pointerEvents" in window) {
			const pointerEvent = new PointerEvent("test");
			if (pointerEvent.pointerType === "pen") {
				deviceType = "stylus";
				inputType = "pen";
			}
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
			supportsPressure:
				"webkitForce" in document.createElement("div") ||
				"force" in new Touch({} as any),
			maxTouchPoints: navigator.maxTouchPoints || 0,
		};
	}

	/**
	 * Process touch events for gesture recognition
	 */
	processTouchEvent(event: TouchEvent): GestureEvent[] {
		const events: GestureEvent[] = [];
		const touches: TouchPoint[] = [];

		// Convert Touch objects to TouchPoint interface
		for (let i = 0; i < event.touches.length; i++) {
			const touch = event.touches[i];
			touches.push({
				id: touch.identifier,
				point: { x: touch.clientX, y: touch.clientY },
				pressure: touch.force || 1,
				timestamp: Date.now(),
			});
		}

		// Update active gestures
		this.updateActiveGestures(touches);

		// Recognize gestures based on touch count and movement
		if (touches.length === 1) {
			events.push(...this.recognizeSingleTouchGestures(touches[0], event.type));
		} else if (touches.length === 2) {
			events.push(...this.recognizeTwoTouchGestures(touches, event.type));
		} else if (touches.length >= 3) {
			events.push(...this.recognizeMultiTouchGestures(touches, event.type));
		}

		// Cleanup old gestures periodically
		this.cleanupGestures();

		return events;
	}

	/**
	 * Process mouse events for gesture recognition
	 */
	processMouseEvent(event: MouseEvent): GestureEvent[] {
		const events: GestureEvent[] = [];
		const touchPoint: TouchPoint = {
			id: 0, // Mouse always uses ID 0
			point: { x: event.clientX, y: event.clientY },
			pressure: this.normalizeMousePressure(event),
			timestamp: Date.now(),
		};

		// Handle mouse wheel for zoom gestures
		if (event.type === "wheel") {
			events.push(this.recognizeWheelGesture(event));
			return events;
		}

		// Convert mouse events to touch-like gestures
		const touchEvent = this.convertMouseToTouchEvent(event, touchPoint);
		if (touchEvent) {
			events.push(...this.processTouchEvent(touchEvent));
		}

		return events;
	}

	/**
	 * Process pointer events for stylus/pen input
	 */
	processPointerEvent(event: PointerEvent): GestureEvent[] {
		const events: GestureEvent[] = [];

		if (event.pointerType === "pen") {
			const touchPoint: TouchPoint = {
				id: event.pointerId,
				point: { x: event.clientX, y: event.clientY },
				pressure: event.pressure || 1,
				timestamp: Date.now(),
			};

			// Handle stylus-specific features
			if (event.tiltX !== undefined || event.tiltY !== undefined) {
				events.push(this.recognizeStylusGesture(touchPoint, event));
			}
		}

		return events;
	}

	/**
	 * Recognize single touch gestures (tap, long press, pan, swipe)
	 */
	private recognizeSingleTouchGestures(
		touch: TouchPoint,
		eventType: string,
	): GestureEvent[] {
		const events: GestureEvent[] = [];
		const gestureId = `single-${touch.id}`;

		if (eventType === "touchstart") {
			this.startGesture(gestureId, touch);
		} else if (eventType === "touchmove") {
			const gesture = this.activeGestures.get(gestureId);
			if (gesture) {
				this.updateGesture(gestureId, touch);

				// Check for pan gesture
				if (this.isPanGesture(gesture)) {
					events.push(this.createPanGestureEvent(gesture, touch));
				}
			}
		} else if (eventType === "touchend") {
			const gesture = this.activeGestures.get(gestureId);
			if (gesture) {
				// Check for tap, long press, or swipe
				if (this.isTapGesture(gesture)) {
					events.push(this.createTapGestureEvent(gesture, touch));
				} else if (this.isLongPressGesture(gesture)) {
					events.push(this.createLongPressGestureEvent(gesture, touch));
				} else if (this.isSwipeGesture(gesture)) {
					events.push(this.createSwipeGestureEvent(gesture, touch));
				}

				this.endGesture(gestureId);
			}
		}

		return events;
	}

	/**
	 * Recognize two-touch gestures (pinch, rotate)
	 */
	private recognizeTwoTouchGestures(
		touches: TouchPoint[],
		eventType: string,
	): GestureEvent[] {
		const events: GestureEvent[] = [];
		const gestureId = "two-finger";

		if (eventType === "touchstart" && touches.length >= 2) {
			this.startGesture(gestureId, touches[0]);
		} else if (eventType === "touchmove" && touches.length >= 2) {
			const gesture = this.activeGestures.get(gestureId);
			if (gesture) {
				// Calculate pinch and rotation
				const pinchData = this.calculatePinchData(touches);
				const rotationData = this.calculateRotationData(touches);

				if (pinchData.scaleDelta !== 0) {
					events.push(
						this.createPinchGestureEvent(gesture, touches, pinchData),
					);
				}

				if (
					Math.abs(rotationData.rotationDelta) >
					this.config.rotate.minAngleChange
				) {
					events.push(
						this.createRotateGestureEvent(gesture, touches, rotationData),
					);
				}
			}
		} else if (eventType === "touchend") {
			this.endGesture(gestureId);
		}

		return events;
	}

	/**
	 * Recognize multi-touch gestures (three+ fingers)
	 */
	private recognizeMultiTouchGestures(
		touches: TouchPoint[],
		eventType: string,
	): GestureEvent[] {
		const events: GestureEvent[] = [];
		const gestureId = `multi-${touches.length}`;

		if (eventType === "touchstart") {
			this.startGesture(gestureId, touches[0]);
		} else if (eventType === "touchmove") {
			const gesture = this.activeGestures.get(gestureId);
			if (gesture && this.isMultiTouchGesture(gesture, touches)) {
				events.push(this.createMultiTouchGestureEvent(gesture, touches));
			}
		} else if (eventType === "touchend") {
			this.endGesture(gestureId);
		}

		return events;
	}

	/**
	 * Recognize mouse wheel gestures
	 */
	private recognizeWheelGesture(event: MouseEvent): GestureEvent {
		const gestureId = "wheel-zoom";
		const gesture: GestureState = {
			isActive: true,
			startTime: Date.now(),
			currentTime: Date.now(),
			duration: 0,
			velocity: { x: 0, y: 0 },
			acceleration: { x: 0, y: 0 },
			pressure: 1,
		};

		const data: GestureData = {
			scale: event.deltaY > 0 ? 0.9 : 1.1,
			scaleDelta: Math.abs(event.deltaY) / 100,
			scaleVelocity: Math.abs(event.deltaY) / 16, // Approximate timing
			center: { x: event.clientX, y: event.clientY },
		};

		return {
			type: "pinch",
			state: gesture,
			context: this.context,
			data,
			timestamp: Date.now(),
		};
	}

	/**
	 * Recognize stylus-specific gestures
	 */
	private recognizeStylusGesture(
		touch: TouchPoint,
		event: PointerEvent,
	): GestureEvent {
		const gestureId = `stylus-${touch.id}`;
		const gesture: GestureState = {
			isActive: true,
			startTime: Date.now(),
			currentTime: Date.now(),
			duration: 0,
			velocity: { x: 0, y: 0 },
			acceleration: { x: 0, y: 0 },
			pressure: touch.pressure,
		};

		const data: GestureData = {
			pressure: touch.pressure,
			pressureDelta: 0, // Would need previous pressure value
			center: touch.point,
			touches: [touch],
		};

		return {
			type: "pressure-hold",
			state: gesture,
			context: { ...this.context, deviceType: "stylus", inputType: "pen" },
			data,
			timestamp: Date.now(),
		};
	}

	/**
	 * Helper methods for gesture detection
	 */
	private isTapGesture(gesture: GestureState): boolean {
		const duration = gesture.duration;
		const maxMovement = this.config.tap.maxMovement;
		const maxDuration = this.config.tap.maxDuration;

		return duration <= maxDuration && maxMovement <= maxMovement;
	}

	private isLongPressGesture(gesture: GestureState): boolean {
		const minDuration = this.config.longPress.minDuration;
		const maxMovement = this.config.longPress.maxMovement;

		return gesture.duration >= minDuration && maxMovement <= maxMovement;
	}

	private isPanGesture(gesture: GestureState): boolean {
		const minDistance = this.config.pan.minDistance;
		return gesture.duration > 100 && minDistance > minDistance;
	}

	private isSwipeGesture(gesture: GestureState): boolean {
		const minVelocity = this.config.swipe.minVelocity;
		const maxDuration = this.config.swipe.maxDuration;
		const minDistance = this.config.swipe.minDistance;

		return (
			(gesture.duration <= maxDuration && gesture.velocity.x >= minVelocity) ||
			gesture.velocity.y >= minVelocity
		);
	}

	private isMultiTouchGesture(
		gesture: GestureState,
		touches: TouchPoint[],
	): boolean {
		return touches.length >= 3 && gesture.duration > 200;
	}

	private calculatePinchData(touches: TouchPoint[]): {
		scale: number;
		scaleDelta: number;
	} {
		const distance = this.getDistance(touches[0].point, touches[1].point);
		const previousGesture = this.gestureHistory.find((g) => g.type === "pinch");
		const previousDistance = previousGesture?.data.scale || distance;

		return {
			scale: distance / previousDistance,
			scaleDelta: distance - previousDistance,
		};
	}

	private calculateRotationData(touches: TouchPoint[]): {
		rotation: number;
		rotationDelta: number;
	} {
		const angle = this.getAngle(touches[0].point, touches[1].point);
		const previousGesture = this.gestureHistory.find(
			(g) => g.type === "rotate",
		);
		const previousAngle = previousGesture?.data.rotation || angle;

		return {
			rotation: angle,
			rotationDelta: angle - previousAngle,
		};
	}

	private getDistance(p1: Point2D, p2: Point2D): number {
		const dx = p1.x - p2.x;
		const dy = p1.y - p2.y;
		return Math.sqrt(dx * dx + dy * dy);
	}

	private getAngle(p1: Point2D, p2: Point2D): number {
		return Math.atan2(p2.y - p1.y, p2.x - p1.x) * (180 / Math.PI);
	}

	private normalizeMousePressure(event: MouseEvent): number {
		// Simulate pressure based on button state and movement
		if (event.buttons === 1) return 0.7; // Left click
		if (event.buttons === 2) return 0.9; // Right click
		return 0.5;
	}

	private convertMouseToTouchEvent(
		event: MouseEvent,
		touchPoint: TouchPoint,
	): TouchEvent | null {
		// This is a simplified conversion - in a real implementation,
		// you'd need to create a proper TouchEvent polyfill
		return null;
	}

	/**
	 * Gesture lifecycle management
	 */
	private startGesture(gestureId: string, touch: TouchPoint): void {
		const gesture: GestureState = {
			isActive: true,
			startTime: Date.now(),
			currentTime: Date.now(),
			duration: 0,
			velocity: { x: 0, y: 0 },
			acceleration: { x: 0, y: 0 },
			pressure: touch.pressure,
		};

		this.activeGestures.set(gestureId, gesture);
	}

	private updateGesture(gestureId: string, touch: TouchPoint): void {
		const gesture = this.activeGestures.get(gestureId);
		if (!gesture) return;

		const now = Date.now();
		const deltaTime = now - gesture.currentTime;
		const previousVelocity = { ...gesture.velocity };

		gesture.currentTime = now;
		gesture.duration = now - gesture.startTime;
		gesture.pressure = touch.pressure;

		// Calculate velocity and acceleration
		if (deltaTime > 0) {
			gesture.velocity = {
				x: (touch.point.x - gesture.velocity.x) / deltaTime,
				y: (touch.point.y - gesture.velocity.y) / deltaTime,
			};

			gesture.acceleration = {
				x: (gesture.velocity.x - previousVelocity.x) / deltaTime,
				y: (gesture.velocity.y - previousVelocity.y) / deltaTime,
			};
		}
	}

	private updateActiveGestures(touches: TouchPoint[]): void {
		// Remove gestures for touches that are no longer active
		for (const [gestureId] of this.activeGestures) {
			if (gestureId.startsWith("single-")) {
				const touchId = Number.parseInt(gestureId.split("-")[1]);
				const touchExists = touches.some((t) => t.id === touchId);
				if (!touchExists) {
					this.activeGestures.delete(gestureId);
				}
			}
		}
	}

	private endGesture(gestureId: string): void {
		this.activeGestures.delete(gestureId);
	}

	private cleanupGestures(): void {
		const now = Date.now();
		if (
			now - this.lastCleanup <
			this.performanceConfig.memory.cleanupInterval
		) {
			return;
		}

		// Remove old gestures from history
		const maxAge = this.performanceConfig.memory.maxGestureHistory;
		this.gestureHistory = this.gestureHistory.filter(
			(event) => now - event.timestamp < maxAge,
		);

		this.lastCleanup = now;
	}

	/**
	 * Create gesture event objects
	 */
	private createTapGestureEvent(
		gesture: GestureState,
		touch: TouchPoint,
	): GestureEvent {
		return {
			type: "tap",
			state: gesture,
			context: this.context,
			data: {
				center: touch.point,
				touches: [touch],
			},
			timestamp: Date.now(),
		};
	}

	private createLongPressGestureEvent(
		gesture: GestureState,
		touch: TouchPoint,
	): GestureEvent {
		return {
			type: "long-press",
			state: gesture,
			context: this.context,
			data: {
				center: touch.point,
				pressure: touch.pressure,
				touches: [touch],
			},
			timestamp: Date.now(),
		};
	}

	private createPanGestureEvent(
		gesture: GestureState,
		touch: TouchPoint,
	): GestureEvent {
		return {
			type: "pan",
			state: gesture,
			context: this.context,
			data: {
				center: touch.point,
				translation: {
					x: gesture.velocity.x * gesture.duration,
					y: gesture.velocity.y * gesture.duration,
				},
				velocity: gesture.velocity,
				touches: [touch],
			},
			timestamp: Date.now(),
		};
	}

	private createSwipeGestureEvent(
		gesture: GestureState,
		touch: TouchPoint,
	): GestureEvent {
		const velocity = Math.sqrt(
			gesture.velocity.x ** 2 + gesture.velocity.y ** 2,
		);
		const direction = this.getSwipeDirection(gesture.velocity);

		return {
			type: "swipe",
			state: gesture,
			context: this.context,
			data: {
				center: touch.point,
				swipeDirection: direction,
				swipeVelocity: velocity,
				velocity: gesture.velocity,
				touches: [touch],
			},
			timestamp: Date.now(),
		};
	}

	private createPinchGestureEvent(
		gesture: GestureState,
		touches: TouchPoint[],
		pinchData: { scale: number; scaleDelta: number },
	): GestureEvent {
		const center = {
			x: (touches[0].point.x + touches[1].point.x) / 2,
			y: (touches[0].point.y + touches[1].point.y) / 2,
		};

		return {
			type: "pinch",
			state: gesture,
			context: this.context,
			data: {
				center,
				scale: pinchData.scale,
				scaleDelta: pinchData.scaleDelta,
				touches,
				touchCount: touches.length,
			},
			timestamp: Date.now(),
		};
	}

	private createRotateGestureEvent(
		gesture: GestureState,
		touches: TouchPoint[],
		rotationData: { rotation: number; rotationDelta: number },
	): GestureEvent {
		const center = {
			x: (touches[0].point.x + touches[1].point.x) / 2,
			y: (touches[0].point.y + touches[1].point.y) / 2,
		};

		return {
			type: "rotate",
			state: gesture,
			context: this.context,
			data: {
				center,
				rotation: rotationData.rotation,
				rotationDelta: rotationData.rotationDelta,
				touches,
				touchCount: touches.length,
			},
			timestamp: Date.now(),
		};
	}

	private createMultiTouchGestureEvent(
		gesture: GestureState,
		touches: TouchPoint[],
	): GestureEvent {
		const center = touches.reduce(
			(acc, touch) => ({
				x: acc.x + touch.point.x / touches.length,
				y: acc.y + touch.point.y / touches.length,
			}),
			{ x: 0, y: 0 },
		);

		return {
			type: "three-finger-swipe",
			state: gesture,
			context: this.context,
			data: {
				center,
				touches,
				touchCount: touches.length,
				velocity: gesture.velocity,
			},
			timestamp: Date.now(),
		};
	}

	private getSwipeDirection(
		velocity: Point2D,
	): "up" | "down" | "left" | "right" {
		const absX = Math.abs(velocity.x);
		const absY = Math.abs(velocity.y);

		if (absX > absY) {
			return velocity.x > 0 ? "right" : "left";
		}
		return velocity.y > 0 ? "down" : "up";
	}

	/**
	 * Process gesture sequences for complex operations
	 */
	async processGestureSequence(sequence: GestureSequence): Promise<boolean> {
		const startTime = Date.now();
		let currentStep = 0;

		while (currentStep < sequence.steps.length) {
			const step = sequence.steps[currentStep];
			const stepStartTime = Date.now();

			// Wait for gesture with timeout
			const gesture = await this.waitForGesture(step, sequence.timeout);

			if (!gesture) {
				return false; // Timeout or invalid gesture
			}

			// Execute step actions
			await this.executeStepActions(step.actions);

			currentStep++;

			// Check for overall sequence timeout
			if (Date.now() - startTime > sequence.timeout * sequence.steps.length) {
				return false;
			}
		}

		return true;
	}

	private async waitForGesture(
		step: GestureStep,
		timeout: number,
	): Promise<GestureEvent | null> {
		return new Promise((resolve) => {
			const timeoutId = setTimeout(() => resolve(null), timeout);

			const checkGesture = (event: GestureEvent) => {
				if (this.matchesGestureConditions(event, step.conditions)) {
					clearTimeout(timeoutId);
					resolve(event);
				}
			};

			// This would need to be connected to the actual gesture event system
			// For now, this is a placeholder
		});
	}

	private matchesGestureConditions(
		event: GestureEvent,
		conditions: GestureCondition[],
	): boolean {
		return conditions.every((condition) =>
			this.checkCondition(event, condition),
		);
	}

	private checkCondition(
		event: GestureEvent,
		condition: GestureCondition,
	): boolean {
		const value = this.getConditionValue(event, condition.type);

		switch (condition.operator) {
			case "greater":
				return value > condition.value;
			case "less":
				return value < condition.value;
			case "equal":
				return Math.abs(value - condition.value) <= (condition.tolerance || 0);
			case "between": {
				const [min, max] = condition.value as number[];
				return value >= min && value <= max;
			}
			default:
				return false;
		}
	}

	private getConditionValue(event: GestureEvent, type: string): number {
		switch (type) {
			case "duration":
				return event.state.duration;
			case "distance":
				return event.data.translation
					? Math.sqrt(
							event.data.translation.x ** 2 + event.data.translation.y ** 2,
						)
					: 0;
			case "velocity":
				return event.data.velocity
					? Math.sqrt(event.data.velocity.x ** 2 + event.data.velocity.y ** 2)
					: 0;
			case "pressure":
				return event.data.pressure || 0;
			case "finger-count":
				return event.data.touchCount || 1;
			default:
				return 0;
		}
	}

	private async executeStepActions(actions: GestureAction[]): Promise<void> {
		for (const action of actions) {
			await this.executeAction(action);
		}
	}

	private async executeAction(action: GestureAction): Promise<void> {
		// This would integrate with the 3D navigation and manipulation systems
		// For now, this is a placeholder for the action execution
		console.log(
			`Executing action: ${action.type} - ${action.action}`,
			action.parameters,
		);
	}

	/**
	 * Get localized gesture label in Polish
	 */
	getLocalizedGestureLabel(gestureType: GestureType): string {
		return this.polishLabels.gestures[gestureType] || gestureType;
	}

	/**
	 * Get performance statistics
	 */
	getPerformanceStats() {
		const now = Date.now();
		const recentGestures = this.gestureHistory.filter(
			(event) => now - event.timestamp < 1000, // Last second
		);

		return {
			averageFrameTime:
				recentGestures.length > 0 ? 1000 / recentGestures.length : 0,
			gestureRecognitionAccuracy: 0.95, // Would need actual tracking
			memoryUsage: this.gestureHistory.length,
			batteryImpact: 0.1, // Would need actual measurement
			userExperienceScore: 0.9, // Would need user feedback
		};
	}
}
