// Gesture-based navigation system for 3D models
// Comprehensive TypeScript interfaces for multi-touch, mouse, and stylus interactions

export interface Point2D {
	x: number;
	y: number;
}

export interface Point3D {
	x: number;
	y: number;
	z: number;
}

export interface TouchPoint {
	id: number;
	point: Point2D;
	pressure: number; // 0-1, for pressure-sensitive devices
	timestamp: number;
}

export interface GestureState {
	isActive: boolean;
	startTime: number;
	currentTime: number;
	duration: number;
	velocity: Point2D;
	acceleration: Point2D;
	pressure: number;
}

export interface GestureContext {
	deviceType: "touch" | "mouse" | "stylus" | "trackpad";
	inputType: "finger" | "pen" | "mouse" | "trackpad";
	platform: "mobile" | "tablet" | "desktop";
	screenSize: { width: number; height: number };
	pixelRatio: number;
	supportsPressure: boolean;
	maxTouchPoints: number;
}

// Core gesture types
export type GestureType =
	| "tap"
	| "double-tap"
	| "long-press"
	| "pan"
	| "pinch"
	| "rotate"
	| "swipe"
	| "edge-swipe"
	| "two-finger-pan"
	| "three-finger-swipe"
	| "pressure-hold"
	| "hover"
	| "drag"
	| "flick";

// Gesture recognition configuration
export interface GestureConfig {
	// Tap gesture settings
	tap: {
		maxDuration: number; // ms
		maxMovement: number; // pixels
		maxPressureChange: number;
	};

	// Long press settings
	longPress: {
		minDuration: number; // ms
		maxMovement: number; // pixels
		activationPressure: number;
	};

	// Pan gesture settings
	pan: {
		minDistance: number; // pixels
		minVelocity: number; // pixels/ms
		momentum: boolean;
		directionalLock: boolean;
	};

	// Pinch gesture settings
	pinch: {
		minScaleChange: number;
		maxScaleVelocity: number;
		snapToGrid: boolean;
		minScale: number;
		maxScale: number;
	};

	// Rotation gesture settings
	rotate: {
		minAngleChange: number; // degrees
		maxAngularVelocity: number; // deg/ms
		snapAngles: number[]; // degrees to snap to
	};

	// Swipe gesture settings
	swipe: {
		minVelocity: number; // pixels/ms
		maxDuration: number; // ms
		minDistance: number; // pixels
		directions: ("up" | "down" | "left" | "right")[];
	};

	// Pressure sensitivity settings
	pressure: {
		enabled: boolean;
		sensitivity: number; // 0-1
		deadzone: number; // 0-1
		curve: "linear" | "exponential" | "logarithmic";
	};

	// Multi-touch settings
	multiTouch: {
		maxTouches: number;
		requireAllFingers: boolean;
		fingerSpacing: number; // minimum pixels between touches
	};
}

// Gesture event data
export interface GestureEvent {
	type: GestureType;
	state: GestureState;
	context: GestureContext;
	data: GestureData;
	target?: HTMLElement;
	timestamp: number;
}

export interface GestureData {
	// Common data
	center?: Point2D;
	delta?: Point2D;
	velocity?: Point2D;

	// Touch-specific data
	touches?: TouchPoint[];
	touchCount?: number;

	// Pan-specific data
	translation?: Point2D;
	panDirection?: "horizontal" | "vertical" | "diagonal";

	// Pinch-specific data
	scale?: number;
	scaleDelta?: number;
	scaleVelocity?: number;

	// Rotation-specific data
	rotation?: number; // degrees
	rotationDelta?: number;
	angularVelocity?: number;

	// Pressure-specific data
	pressure?: number;
	pressureDelta?: number;

	// Swipe-specific data
	swipeDirection?: "up" | "down" | "left" | "right";
	swipeVelocity?: number;

	// Hover-specific data
	hoverPoint?: Point2D;
	hoverDuration?: number;
}

// Gesture sequence for complex operations
export interface GestureSequence {
	id: string;
	name: string;
	polishName: string;
	description: string;
	polishDescription: string;
	steps: GestureStep[];
	timeout: number; // ms between steps
	repeatable: boolean;
	category: "navigation" | "manipulation" | "education" | "system";
}

export interface GestureStep {
	gestureType: GestureType;
	conditions: GestureCondition[];
	actions: GestureAction[];
	timeout?: number;
}

export interface GestureCondition {
	type:
		| "duration"
		| "distance"
		| "velocity"
		| "pressure"
		| "direction"
		| "finger-count";
	operator: "greater" | "less" | "equal" | "between";
	value: number | number[] | string;
	tolerance?: number;
}

export interface GestureAction {
	type: "camera" | "selection" | "animation" | "ui" | "audio" | "haptic";
	action: string;
	parameters: Record<string, any>;
	duration?: number;
	easing?: "linear" | "ease-in" | "ease-out" | "ease-in-out";
}

// 3D Navigation controls
export interface NavigationState {
	camera: {
		position: Point3D;
		target: Point3D;
		distance: number;
		angle: Point2D; // azimuthal, polar angles
	};

	controls: {
		orbit: boolean;
		zoom: boolean;
		pan: boolean;
		rotate: boolean;
		focus: boolean;
	};

	constraints: {
		minDistance: number;
		maxDistance: number;
		minPolarAngle: number;
		maxPolarAngle: number;
		enableDamping: boolean;
		dampingFactor: number;
	};
}

export interface GestureNavigationConfig {
	sensitivity: {
		orbit: number; // rotation sensitivity
		zoom: number; // zoom sensitivity
		pan: number; // pan sensitivity
		rotate: number; // model rotation sensitivity
	};

	smoothing: {
		enabled: boolean;
		factor: number; // 0-1, higher = smoother but less responsive
	};

	momentum: {
		enabled: boolean;
		friction: number; // 0-1, higher = less momentum
	};

	snapping: {
		enabled: boolean;
		angles: number[]; // degrees to snap to
		tolerance: number; // degrees
	};
}

// Interactive model manipulation
export interface ManipulationState {
	selectedRegions: string[];
	highlightedRegions: string[];
	dissectedRegions: string[];
	visibleLayers: string[];
	transparency: Record<string, number>; // regionId -> opacity 0-1
	dissection: {
		active: boolean;
		progress: number; // 0-1
		animationSpeed: number;
	};
}

export interface GestureManipulationConfig {
	selection: {
		multiSelect: boolean;
		selectionRadius: number; // pixels
		hapticFeedback: boolean;
	};

	dissection: {
		animationDuration: number; // ms
		layers: string[]; // order of dissection layers
		reversible: boolean;
	};

	labeling: {
		showOnHover: boolean;
		showOnTap: boolean;
		duration: number; // ms to show label
		polishLabels: boolean;
	};
}

// Educational gesture features
export interface EducationalState {
	learningMode: boolean;
	currentLesson: string | null;
	completedGestures: string[];
	proficiency: Record<string, number>; // gestureId -> proficiency 0-1
	tutorials: {
		enabled: boolean;
		currentStep: number;
		autoAdvance: boolean;
	};
}

export interface GestureTutorial {
	id: string;
	name: string;
	polishName: string;
	description: string;
	polishDescription: string;
	category: "basic" | "advanced" | "expert";
	difficulty: number; // 1-5
	steps: TutorialStep[];
	prerequisites: string[]; // other tutorial IDs
	rewards: {
		points: number;
		badges: string[];
	};
}

export interface TutorialStep {
	id: string;
	instruction: string;
	polishInstruction: string;
	gesture: GestureType;
	target: string; // what to interact with
	successCriteria: GestureCondition[];
	hints: string[];
	polishHints: string[];
	visualGuide?: {
		showPath: boolean;
		showTarget: boolean;
		color: string;
	};
}

// Polish language integration
export interface PolishGestureLabels {
	gestures: Record<GestureType, string>;
	instructions: Record<string, string>;
	feedback: {
		success: string[];
		error: string[];
		hints: string[];
	};
	tutorials: Record<string, string>;
}

// Cross-platform compatibility
export interface PlatformConfig {
	touch: {
		enabled: boolean;
		maxTouches: number;
		pressureSupport: boolean;
	};

	mouse: {
		enabled: boolean;
		wheelSupport: boolean;
		rightClickPan: boolean;
	};

	stylus: {
		enabled: boolean;
		pressureSensitivity: boolean;
		tiltSupport: boolean;
	};

	trackpad: {
		enabled: boolean;
		gestureSupport: boolean;
		momentumScroll: boolean;
	};
}

// Performance optimization
export interface PerformanceConfig {
	gestureProcessing: {
		debounceMs: number;
		throttleMs: number;
		maxQueueSize: number;
	};

	rendering: {
		frameRate: number;
		quality: "low" | "medium" | "high" | "ultra";
		adaptiveQuality: boolean;
	};

	memory: {
		maxGestureHistory: number;
		cleanupInterval: number; // ms
	};
}

// Main gesture manager interface
export interface GestureManager {
	// Configuration
	config: GestureConfig & GestureNavigationConfig & GestureManipulationConfig;

	// State
	state: GestureState & NavigationState & ManipulationState & EducationalState;

	// Event handlers
	onGestureStart: (event: GestureEvent) => void;
	onGestureChange: (event: GestureEvent) => void;
	onGestureEnd: (event: GestureEvent) => void;

	// Methods
	recognizeGesture(
		event: TouchEvent | MouseEvent | PointerEvent,
	): GestureEvent | null;
	processGestureSequence(sequence: GestureSequence): Promise<boolean>;
	updateNavigationState(state: Partial<NavigationState>): void;
	updateManipulationState(state: Partial<ManipulationState>): void;

	// Educational features
	startTutorial(tutorialId: string): Promise<void>;
	endTutorial(): void;
	getGestureProficiency(gestureType: GestureType): number;

	// Polish language support
	setLanguage(language: "pl" | "en"): void;
	getLocalizedString(key: string, params?: Record<string, string>): string;

	// Performance monitoring
	getPerformanceStats(): PerformanceStats;
	optimizeForDevice(deviceType: string): void;
}

export interface PerformanceStats {
	averageFrameTime: number;
	gestureRecognitionAccuracy: number;
	memoryUsage: number;
	batteryImpact: number;
	userExperienceScore: number;
}

// Event handler types for React integration
export interface GestureHandlers {
	onGestureStart?: (event: GestureEvent) => void;
	onGestureChange?: (event: GestureEvent) => void;
	onGestureEnd?: (event: GestureEvent) => void;
	onGestureSequence?: (sequence: GestureSequence) => void;
	onTutorialStep?: (step: TutorialStep) => void;
	onProficiencyUpdate?: (gestureType: GestureType, proficiency: number) => void;
}

// React hook return type
export interface UseGestureReturn {
	gestureManager: GestureManager;
	handlers: GestureHandlers;
	state: GestureState & NavigationState & ManipulationState & EducationalState;
	tutorials: GestureTutorial[];
	isLoading: boolean;
	error: string | null;
}
