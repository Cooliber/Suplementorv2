"use client";

/**
 * Advanced Touch Gesture Recognition Hook for Suplementor Animations
 * Provides comprehensive multi-touch gesture detection and analysis
 */

import { useCallback, useEffect, useRef, useState } from "react";

// Export haptic feedback function for use in other components
export const triggerHapticFeedback = (pattern?: number | number[]) => {
	if (typeof navigator !== "undefined" && "vibrate" in navigator) {
		const vibrationPattern = Array.isArray(pattern) ? pattern : [pattern || 50];
		navigator.vibrate(vibrationPattern);
	}
};
import {
	DEFAULT_GESTURE_OPTIONS,
	type GestureCallbacks,
	type GestureOptions,
	type GestureState,
	type LongPressGesture,
	type MobileAnimationState,
	type PinchGesture,
	type PressureGesture,
	type RotationGesture,
	type SwipeGesture,
	type TapGesture,
	type TouchPoint,
	VOICE_COMMANDS,
	type VoiceCommand,
} from "./mobile-touch-interfaces";

interface TouchGestureHookReturn {
	gestureState: GestureState;
	touchPoints: Map<number, TouchPoint>;
	touchHandlers: {
		onTouchStart: (e: React.TouchEvent) => void;
		onTouchMove: (e: React.TouchEvent) => void;
		onTouchEnd: (e: React.TouchEvent) => void;
	};
	isActive: boolean;
	touchCount: number;
	animationState: MobileAnimationState;
	updateAnimationState: (updates: Partial<MobileAnimationState>) => void;
	triggerHapticFeedback: (pattern?: number | number[]) => void;
	voiceCommands: VoiceCommand[];
	processVoiceCommand: (transcript: string) => VoiceCommand | null;
}

export const useAdvancedTouchGestures = (
	callbacks: GestureCallbacks = {},
	options: GestureOptions = {},
): TouchGestureHookReturn => {
	const opts = { ...DEFAULT_GESTURE_OPTIONS, ...options };
	const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
	const lastTapRef = useRef<number>(0);
	const initialGestureStateRef = useRef<{
		scale?: number;
		rotation?: number;
	} | null>(null);

	const [gestureState, setGestureState] = useState<GestureState>({
		isActive: false,
		startTime: 0,
		lastUpdate: 0,
		touchCount: 0,
		centerX: 0,
		centerY: 0,
		velocity: 0,
		direction: null,
		scale: 1,
		rotation: 0,
		pressure: 0,
	});

	const [touchPoints, setTouchPoints] = useState<Map<number, TouchPoint>>(
		new Map(),
	);

	const [animationState, setAnimationState] = useState<MobileAnimationState>({
		currentAnimation: null,
		isPlaying: false,
		playbackSpeed: 1,
		currentTime: 0,
		duration: 0,
		loop: false,
		gestureMode: "combined",
		voiceControlActive: false,
		hapticFeedbackEnabled: opts.enableHapticFeedback || false,
		performanceMode: "adaptive",
	});

	// Calculate center point of multiple touches
	const calculateCenter = useCallback((points: TouchPoint[]) => {
		if (points.length === 0) return { x: 0, y: 0 };

		const sumX = points.reduce((sum, point) => sum + point.x, 0);
		const sumY = points.reduce((sum, point) => sum + point.y, 0);

		return {
			x: sumX / points.length,
			y: sumY / points.length,
		};
	}, []);

	// Calculate distance between two touch points
	const calculateDistance = useCallback(
		(point1: TouchPoint, point2: TouchPoint) => {
			return Math.sqrt((point2.x - point1.x) ** 2 + (point2.y - point1.y) ** 2);
		},
		[],
	);

	// Calculate angle between two touch points
	const calculateAngle = useCallback(
		(point1: TouchPoint, point2: TouchPoint) => {
			return Math.atan2(point2.y - point1.y, point2.x - point1.x);
		},
		[],
	);

	// Handle touch start
	const handleTouchStart = useCallback(
		(e: React.TouchEvent) => {
			if (!opts.enabled) return;

			e.preventDefault();
			const currentTime = Date.now();
			const touches = Array.from(e.touches).map((touch) => ({
				id: touch.identifier,
				x: touch.clientX,
				y: touch.clientY,
				timestamp: currentTime,
				pressure: touch.force || 1,
				radiusX: touch.radiusX || 1,
				radiusY: touch.radiusY || 1,
			}));

			// Update touch points
			const newTouchPoints = new Map(touchPoints);
			touches.forEach((touch) => newTouchPoints.set(touch.id, touch));
			setTouchPoints(newTouchPoints);

			const touchCount = newTouchPoints.size;
			const center = calculateCenter(touches);

			// Calculate average pressure
			const avgPressure =
				touches.reduce((sum, touch) => sum + (touch.pressure || 1), 0) /
				touches.length;

			// Start gesture
			const newGestureState: GestureState = {
				isActive: true,
				startTime: currentTime,
				lastUpdate: currentTime,
				touchCount,
				centerX: center.x,
				centerY: center.y,
				velocity: 0,
				direction: null,
				scale: gestureState.scale,
				rotation: gestureState.rotation,
				pressure: avgPressure,
			};

			setGestureState(newGestureState);

			// Initialize gesture state for multi-touch
			if (touchCount === 2) {
				const [touch1, touch2] = touches;
				if (touch1 && touch2) {
					initialGestureStateRef.current = {
						scale: calculateDistance(touch1, touch2),
						rotation: calculateAngle(touch1, touch2),
					};
				}
			}

			// Callbacks
			callbacks.onGestureStart?.(touchCount);
			if (touchCount > 1) {
				callbacks.onMultiTouchStart?.(touches);
			}

			// Start long press timer for single touch
			if (touchCount === 1) {
				longPressTimerRef.current = setTimeout(() => {
					const position = { x: touches[0].x, y: touches[0].y };
					const longPressGesture: LongPressGesture = {
						position,
						duration: opts.longPressDelay || 500,
						pressure: touches[0].pressure || 1,
					};
					callbacks.onLongPress?.(longPressGesture);
					triggerHapticFeedback([50, 30, 50]);
				}, opts.longPressDelay || 500);
			}
		},
		[
			opts,
			touchPoints,
			calculateCenter,
			callbacks,
			gestureState.scale,
			gestureState.rotation,
		],
	);

	// Handle touch move
	const handleTouchMove = useCallback(
		(e: React.TouchEvent) => {
			if (!opts.enabled || !gestureState.isActive) return;

			e.preventDefault();
			const currentTime = Date.now();
			const touches = Array.from(e.touches).map((touch) => ({
				id: touch.identifier,
				x: touch.clientX,
				y: touch.clientY,
				timestamp: currentTime,
				pressure: touch.force || 1,
				radiusX: touch.radiusX || 1,
				radiusY: touch.radiusY || 1,
			}));

			// Update touch points
			const newTouchPoints = new Map<number, TouchPoint>();
			touches.forEach((touch) => newTouchPoints.set(touch.id, touch));
			setTouchPoints(newTouchPoints);

			const center = calculateCenter(touches);

			// Calculate velocity
			const deltaTime = currentTime - gestureState.lastUpdate;
			const distance = Math.sqrt(
				(center.x - gestureState.centerX) ** 2 +
					(center.y - gestureState.centerY) ** 2,
			);
			const velocity = distance / deltaTime;

			// Calculate average pressure
			const avgPressure =
				touches.reduce((sum, touch) => sum + (touch.pressure || 1), 0) /
				touches.length;

			// Update gesture state
			setGestureState((prev) => ({
				...prev,
				lastUpdate: currentTime,
				centerX: center.x,
				centerY: center.y,
				velocity,
				pressure: avgPressure,
			}));

			// Multi-touch gestures
			if (
				touches.length === 2 &&
				opts.enableScale &&
				touches[0] &&
				touches[1]
			) {
				const distance = calculateDistance(touches[0], touches[1]);
				const initialDistance =
					initialGestureStateRef.current?.scale || distance;

				const scale = distance / initialDistance;
				const scaleVelocity = Math.abs(scale - gestureState.scale) / deltaTime;

				const pinchGesture: PinchGesture = {
					scale,
					velocity: scaleVelocity,
					centerX: center.x,
					centerY: center.y,
					initialDistance,
					currentDistance: distance,
				};

				callbacks.onPinch?.(pinchGesture);
			}

			if (
				touches.length === 2 &&
				opts.enableRotation &&
				touches[0] &&
				touches[1]
			) {
				const angle = calculateAngle(touches[0], touches[1]);
				const initialAngle = initialGestureStateRef.current?.rotation || angle;

				const rotation = angle - initialAngle;
				const rotationVelocity =
					Math.abs(rotation - gestureState.rotation) / deltaTime;

				const rotationGesture: RotationGesture = {
					angle: rotation,
					velocity: rotationVelocity,
					centerX: center.x,
					centerY: center.y,
					initialAngle,
					currentAngle: angle,
				};

				callbacks.onRotate?.(rotationGesture);
			}

			// Multi-touch callbacks
			if (touches.length > 1) {
				callbacks.onMultiTouchMove?.(touches, center);
			}
		},
		[
			opts,
			gestureState,
			calculateCenter,
			calculateDistance,
			calculateAngle,
			callbacks,
		],
	);

	// Handle touch end
	const handleTouchEnd = useCallback(
		(e: React.TouchEvent) => {
			if (!opts.enabled || !gestureState.isActive) return;

			const currentTime = Date.now();
			const remainingTouches = Array.from(e.touches).map((touch) => ({
				id: touch.identifier,
				x: touch.clientX,
				y: touch.clientY,
				timestamp: currentTime,
				pressure: touch.force || 1,
				radiusX: touch.radiusX || 1,
				radiusY: touch.radiusY || 1,
			}));

			// Update touch points
			const newTouchPoints = new Map<number, TouchPoint>();
			remainingTouches.forEach((touch) => newTouchPoints.set(touch.id, touch));
			setTouchPoints(newTouchPoints);

			// Clear long press timer
			if (longPressTimerRef.current) {
				clearTimeout(longPressTimerRef.current);
				longPressTimerRef.current = null;
			}

			// Single touch gestures
			if (e.changedTouches.length === 1) {
				const touch = e.changedTouches[0];
				if (!touch) return;

				const position = { x: touch.clientX, y: touch.clientY };
				const deltaTime = currentTime - gestureState.startTime;

				// Check for tap vs swipe
				const distance = Math.sqrt(
					(touch.clientX - gestureState.centerX) ** 2 +
						(touch.clientY - gestureState.centerY) ** 2,
				);

				if (
					distance < opts.minSwipeDistance! &&
					deltaTime < opts.maxTapDelay!
				) {
					// Tap gesture
					const timeSinceLastTap = currentTime - lastTapRef.current;
					const tapCount = timeSinceLastTap < opts.maxTapDelay! ? 2 : 1;

					const tapGesture: TapGesture = {
						position,
						duration: deltaTime,
						pressure: touch.force || 1,
						tapCount,
					};

					callbacks.onTap?.(tapGesture);

					if (opts.enableHapticFeedback) {
						triggerHapticFeedback(tapCount === 2 ? [30, 20] : 30);
					}

					lastTapRef.current = currentTime;
				} else if (
					distance >= opts.minSwipeDistance! &&
					gestureState.velocity >= opts.minSwipeVelocity!
				) {
					// Swipe gesture
					const deltaX = touch.clientX - gestureState.centerX;
					const deltaY = touch.clientY - gestureState.centerY;

					let direction: SwipeGesture["direction"] = "left";
					if (Math.abs(deltaX) > Math.abs(deltaY)) {
						direction = deltaX > 0 ? "right" : "left";
					} else {
						direction = deltaY > 0 ? "down" : "up";
					}

					const swipeGesture: SwipeGesture = {
						direction,
						velocity: gestureState.velocity,
						distance,
						duration: deltaTime,
						startPosition: { x: gestureState.centerX, y: gestureState.centerY },
						endPosition: position,
					};

					callbacks.onSwipe?.(swipeGesture);

					if (opts.enableHapticFeedback) {
						triggerHapticFeedback([20, 30, 20]);
					}
				}

				// Pressure gesture if enabled
				if (opts.enablePressure && touch.force) {
					const pressureGesture: PressureGesture = {
						pressure: touch.force,
						pressureChange: touch.force - gestureState.pressure,
						maxPressure: Math.max(touch.force, gestureState.pressure),
						minPressure: Math.min(touch.force, gestureState.pressure),
						duration: deltaTime,
					};

					callbacks.onPressure?.(pressureGesture);
				}
			}

			// End gesture if no touches remain
			if (remainingTouches.length === 0) {
				setGestureState((prev) => ({
					...prev,
					isActive: false,
					touchCount: 0,
				}));
				callbacks.onGestureEnd?.();
				callbacks.onMultiTouchEnd?.(Array.from(touchPoints.values()));
			}
		},
		[opts, gestureState, callbacks, touchPoints],
	);

	// Haptic feedback function
	const triggerHapticFeedback = useCallback(
		(pattern?: number | number[]) => {
			if (!opts.enableHapticFeedback || !("vibrate" in navigator)) return;

			try {
				if (typeof pattern === "number") {
					navigator.vibrate(pattern * opts.hapticIntensity!);
				} else if (Array.isArray(pattern)) {
					const scaledPattern = pattern.map((v) => v * opts.hapticIntensity!);
					navigator.vibrate(scaledPattern);
				}
			} catch (error) {
				console.warn("Haptic feedback not supported:", error);
			}
		},
		[opts.enableHapticFeedback, opts.hapticIntensity],
	);

	// Update animation state
	const updateAnimationState = useCallback(
		(updates: Partial<MobileAnimationState>) => {
			setAnimationState((prev) => ({ ...prev, ...updates }));
		},
		[],
	);

	// Process voice commands
	const processVoiceCommand = useCallback(
		(transcript: string): VoiceCommand | null => {
			const normalizedTranscript = transcript.toLowerCase().trim();

			// Try English commands first, then Polish
			for (const command of VOICE_COMMANDS) {
				if (
					normalizedTranscript.includes(command.command) ||
					normalizedTranscript.includes(command.polishCommand)
				) {
					return command;
				}
			}

			return null;
		},
		[],
	);

	// Touch event handlers for React components
	const touchHandlers = {
		onTouchStart: handleTouchStart,
		onTouchMove: handleTouchMove,
		onTouchEnd: handleTouchEnd,
	};

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			if (longPressTimerRef.current) {
				clearTimeout(longPressTimerRef.current);
			}
		};
	}, []);

	return {
		gestureState,
		touchPoints,
		touchHandlers,
		isActive: gestureState.isActive,
		touchCount: gestureState.touchCount,
		animationState,
		updateAnimationState,
		triggerHapticFeedback,
		voiceCommands: VOICE_COMMANDS,
		processVoiceCommand,
	};
};
