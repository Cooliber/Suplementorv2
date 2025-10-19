"use client";

/**
 * Mobile Touch Gesture System for Suplementor Animations
 * Advanced touch interfaces for mobile-optimized animation control
 */

export interface TouchPoint {
	id: number;
	x: number;
	y: number;
	timestamp: number;
	pressure?: number;
	radiusX?: number;
	radiusY?: number;
}

export interface GestureState {
	isActive: boolean;
	startTime: number;
	lastUpdate: number;
	touchCount: number;
	centerX: number;
	centerY: number;
	velocity: number;
	direction: "up" | "down" | "left" | "right" | null;
	scale: number;
	rotation: number;
	pressure: number;
}

export interface SwipeGesture {
	direction: "up" | "down" | "left" | "right";
	velocity: number;
	distance: number;
	duration: number;
	startPosition: { x: number; y: number };
	endPosition: { x: number; y: number };
}

export interface PinchGesture {
	scale: number;
	velocity: number;
	centerX: number;
	centerY: number;
	initialDistance: number;
	currentDistance: number;
}

export interface RotationGesture {
	angle: number;
	velocity: number;
	centerX: number;
	centerY: number;
	initialAngle: number;
	currentAngle: number;
}

export interface PressureGesture {
	pressure: number;
	pressureChange: number;
	maxPressure: number;
	minPressure: number;
	duration: number;
}

export interface TapGesture {
	position: { x: number; y: number };
	duration: number;
	pressure: number;
	tapCount: number;
}

export interface LongPressGesture {
	position: { x: number; y: number };
	duration: number;
	pressure: number;
}

export interface GestureCallbacks {
	onSwipe?: (gesture: SwipeGesture) => void;
	onPinch?: (gesture: PinchGesture) => void;
	onRotate?: (gesture: RotationGesture) => void;
	onPressure?: (gesture: PressureGesture) => void;
	onTap?: (gesture: TapGesture) => void;
	onLongPress?: (gesture: LongPressGesture) => void;
	onGestureStart?: (touchCount: number) => void;
	onGestureEnd?: () => void;
	onMultiTouchStart?: (touches: TouchPoint[]) => void;
	onMultiTouchMove?: (
		touches: TouchPoint[],
		center: { x: number; y: number },
	) => void;
	onMultiTouchEnd?: (touches: TouchPoint[]) => void;
}

export interface GestureOptions {
	enabled?: boolean;
	minSwipeDistance?: number;
	minSwipeVelocity?: number;
	maxTapDelay?: number;
	longPressDelay?: number;
	maxMultiTouchDistance?: number;
	enableRotation?: boolean;
	enableScale?: boolean;
	enablePressure?: boolean;
	pressureThreshold?: number;
	enableHapticFeedback?: boolean;
	hapticIntensity?: number;
}

export interface AnimationGestureMapping {
	gesture: string;
	animationAction: string;
	parameters?: Record<string, any>;
	polishDescription: string;
}

export interface MobileAnimationConfig {
	enableTouchGestures: boolean;
	enablePressureSensitivity: boolean;
	enableHapticFeedback: boolean;
	adaptiveFrameRate: boolean;
	maxFrameRate: number;
	minFrameRate: number;
	gestureMappings: AnimationGestureMapping[];
	polishInterface: boolean;
	voiceControl: boolean;
	accessibilityFeatures: boolean;
}

export interface TouchAnimationController {
	startAnimation: (animationId: string, config?: any) => void;
	pauseAnimation: (animationId: string) => void;
	resumeAnimation: (animationId: string) => void;
	stopAnimation: (animationId: string) => void;
	setPlaybackSpeed: (animationId: string, speed: number) => void;
	setAnimationIntensity: (animationId: string, intensity: number) => void;
	jumpToTime: (animationId: string, time: number) => void;
	setLoop: (animationId: string, loop: boolean) => void;
}

export interface MobilePerformanceMetrics {
	frameRate: number;
	memoryUsage: number;
	touchResponsiveness: number;
	batteryLevel?: number;
	thermalState?: "nominal" | "fair" | "serious" | "critical";
	gestureRecognitionAccuracy: number;
}

export interface AccessibilityGestureConfig {
	enableVoiceControl: boolean;
	enableScreenReader: boolean;
	enableHighContrast: boolean;
	enableLargeText: boolean;
	enableReducedMotion: boolean;
	polishVoiceCommands: boolean;
	gestureAlternatives: Record<string, string>;
	touchTargetSize: number;
}

export interface VoiceCommand {
	command: string;
	polishCommand: string;
	action: string;
	parameters?: Record<string, any>;
	confidence: number;
}

export interface MobileAnimationState {
	currentAnimation: string | null;
	isPlaying: boolean;
	playbackSpeed: number;
	currentTime: number;
	duration: number;
	loop: boolean;
	gestureMode: "swipe" | "pinch" | "pressure" | "combined";
	voiceControlActive: boolean;
	hapticFeedbackEnabled: boolean;
	performanceMode: "high" | "medium" | "low" | "adaptive";
}

// Default configurations
export const DEFAULT_GESTURE_OPTIONS: GestureOptions = {
	enabled: true,
	minSwipeDistance: 50,
	minSwipeVelocity: 0.3,
	maxTapDelay: 300,
	longPressDelay: 500,
	maxMultiTouchDistance: 200,
	enableRotation: true,
	enableScale: true,
	enablePressure: true,
	pressureThreshold: 0.5,
	enableHapticFeedback: true,
	hapticIntensity: 0.7,
};

export const DEFAULT_MOBILE_ANIMATION_CONFIG: MobileAnimationConfig = {
	enableTouchGestures: true,
	enablePressureSensitivity: true,
	enableHapticFeedback: true,
	adaptiveFrameRate: true,
	maxFrameRate: 60,
	minFrameRate: 15,
	gestureMappings: [
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
			gesture: "pinch-in",
			animationAction: "zoom-out",
			polishDescription: "Pomniejsz animację",
		},
		{
			gesture: "pinch-out",
			animationAction: "zoom-in",
			polishDescription: "Powiększ animację",
		},
		{
			gesture: "pressure-light",
			animationAction: "slow-down",
			parameters: { factor: 0.5 },
			polishDescription: "Zwolnij animację",
		},
		{
			gesture: "pressure-hard",
			animationAction: "speed-up",
			parameters: { factor: 2.0 },
			polishDescription: "Przyspiesz animację",
		},
	],
	polishInterface: true,
	voiceControl: true,
	accessibilityFeatures: true,
};

export const DEFAULT_ACCESSIBILITY_CONFIG: AccessibilityGestureConfig = {
	enableVoiceControl: true,
	enableScreenReader: true,
	enableHighContrast: false,
	enableLargeText: false,
	enableReducedMotion: false,
	polishVoiceCommands: true,
	gestureAlternatives: {
		"swipe-left": "przycisk następny",
		"swipe-right": "przycisk poprzedni",
		pinch: "przyciski powiększenia",
		pressure: "suwaki prędkości",
	},
	touchTargetSize: 44,
};

// Voice command definitions
export const VOICE_COMMANDS: VoiceCommand[] = [
	{
		command: "play animation",
		polishCommand: "włącz animację",
		action: "play",
		confidence: 0.8,
	},
	{
		command: "pause animation",
		polishCommand: "pauza animacja",
		action: "pause",
		confidence: 0.8,
	},
	{
		command: "stop animation",
		polishCommand: "zatrzymaj animację",
		action: "stop",
		confidence: 0.8,
	},
	{
		command: "next step",
		polishCommand: "następny krok",
		action: "nextStep",
		confidence: 0.8,
	},
	{
		command: "previous step",
		polishCommand: "poprzedni krok",
		action: "previousStep",
		confidence: 0.8,
	},
	{
		command: "speed up",
		polishCommand: "przyspiesz",
		action: "increaseSpeed",
		parameters: { factor: 1.5 },
		confidence: 0.7,
	},
	{
		command: "slow down",
		polishCommand: "zwolnij",
		action: "decreaseSpeed",
		parameters: { factor: 0.7 },
		confidence: 0.7,
	},
];
