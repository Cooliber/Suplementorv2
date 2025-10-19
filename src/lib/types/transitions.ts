// TypeScript interfaces for animated transition effects between body systems

export interface TransitionConfig {
	id: string;
	sourceSystemId: string;
	targetSystemId: string;
	duration: number;
	easing: TransitionEasing;
	cameraPath: CameraPath;
	overlayEffect: OverlayEffect;
	particleEffect?: ParticleEffect;
	glowEffect?: GlowEffect;
	depthOfField?: DepthOfFieldEffect;
	colorGrading?: ColorGradingEffect;
	polishLabels?: PolishLabelConfig;
	voiceOver?: VoiceOverConfig;
	accessibility?: AccessibilityConfig;
	performance?: PerformanceConfig;
}

export interface CameraPath {
	type: "linear" | "curved" | "orbital" | "spiral" | "cinematic";
	waypoints: CameraWaypoint[];
	rotation: CameraRotation;
	zoom: CameraZoom;
}

export interface CameraWaypoint {
	position: Vector3D;
	rotation: Vector3D;
	zoom: number;
	duration: number;
	easing: TransitionEasing;
}

export interface CameraRotation {
	pitch: number;
	yaw: number;
	roll: number;
	smoothness: number;
}

export interface CameraZoom {
	start: number;
	end: number;
	smoothness: number;
}

export interface Vector3D {
	x: number;
	y: number;
	z: number;
}

export type TransitionEasing =
	| "linear"
	| "easeIn"
	| "easeOut"
	| "easeInOut"
	| "easeInCubic"
	| "easeOutCubic"
	| "easeInOutCubic"
	| "easeInQuart"
	| "easeOutQuart"
	| "easeInOutQuart"
	| "easeInSine"
	| "easeOutSine"
	| "easeInOutSine";

export interface OverlayEffect {
	type: "fade" | "blend" | "slide" | "zoom" | "anatomical";
	opacity: number;
	blendMode: "normal" | "multiply" | "screen" | "overlay" | "soft-light";
	anatomicalOverlay?: AnatomicalOverlay;
}

export interface AnatomicalOverlay {
	showOrgans: boolean;
	showConnections: boolean;
	showFunctions: boolean;
	opacity: number;
	color: string;
	animation: "pulse" | "glow" | "flow" | "none";
}

export interface ParticleEffect {
	enabled: boolean;
	type: "trail" | "spark" | "flow" | "connection";
	count: number;
	size: number;
	speed: number;
	color: string;
	lifetime: number;
	followCamera: boolean;
}

export interface GlowEffect {
	enabled: boolean;
	targetSystem: string;
	intensity: number;
	color: string;
	radius: number;
	animation: "pulse" | "breathe" | "steady";
}

export interface DepthOfFieldEffect {
	enabled: boolean;
	focusPoint: Vector3D;
	focalLength: number;
	aperture: number;
	blurStrength: number;
	transitionSmoothness: number;
}

export interface ColorGradingEffect {
	enabled: boolean;
	sourceColor: ColorTheme;
	targetColor: ColorTheme;
	transitionProgress: number;
	intensity: number;
}

export interface ColorTheme {
	primary: string;
	secondary: string;
	accent: string;
	background: string;
	surface: string;
}

export interface PolishLabelConfig {
	showLabels: boolean;
	labels: PolishLabel[];
	animation: "fade" | "slide" | "typewriter" | "none";
	fontSize: number;
	fontFamily: string;
	color: string;
	position: "top" | "bottom" | "center" | "auto";
}

export interface PolishLabel {
	systemId: string;
	text: string;
	translation: string;
	pronunciation?: string;
	medicalTerm: string;
	position: Vector3D;
	showDuration: number;
}

export interface VoiceOverConfig {
	enabled: boolean;
	language: "pl" | "en";
	voice: "male" | "female" | "neutral";
	speed: number;
	pitch: number;
	volume: number;
	text: string;
	timing: VoiceTiming[];
}

export interface VoiceTiming {
	startTime: number;
	endTime: number;
	text: string;
	emphasis?: "none" | "slight" | "moderate" | "strong";
}

export interface AccessibilityConfig {
	reduceMotion: boolean;
	highContrast: boolean;
	screenReader: boolean;
	keyboardNavigation: boolean;
	alternativeText: string;
	descriptiveAudio: boolean;
}

export interface PerformanceConfig {
	targetFPS: number;
	adaptiveQuality: boolean;
	maxParticles: number;
	renderScale: number;
	enableLOD: boolean;
	memoryLimit: number;
}

export interface TransitionState {
	isActive: boolean;
	progress: number;
	currentConfig: TransitionConfig | null;
	queue: TransitionConfig[];
	isPaused: boolean;
	error?: string;
}

export interface SystemTransitionEvent {
	type: "start" | "progress" | "complete" | "error" | "cancel";
	transitionId: string;
	progress: number;
	timestamp: number;
	data?: any;
}

export interface DeviceCapabilities {
	supportsWebGL: boolean;
	maxTextureSize: number;
	supportsWebGL2: boolean;
	maxRenderbufferSize: number;
	supportsFloatTextures: boolean;
	supportsHalfFloatTextures: boolean;
	maxViewportDims: [number, number];
	maxFragmentUniformVectors: number;
	maxVertexUniformVectors: number;
	renderer: string;
	vendor: string;
}

export interface TouchGestureConfig {
	enabled: boolean;
	swipeThreshold: number;
	pinchThreshold: number;
	doubleTapDelay: number;
	longPressDelay: number;
	gestureSensitivity: number;
}

export interface WebGLContext {
	gl: WebGLRenderingContext | WebGL2RenderingContext;
	canvas: HTMLCanvasElement;
	programs: Map<string, WebGLProgram>;
	buffers: Map<string, WebGLBuffer>;
	textures: Map<string, WebGLTexture>;
	framebuffers: Map<string, WebGLFramebuffer>;
	isContextLost: boolean;
}

export interface AnimationFrame {
	id: number;
	startTime: number;
	duration: number;
	callback: (progress: number) => void;
	easing: TransitionEasing;
}

export interface MemoryPool {
	buffers: Map<string, ArrayBuffer>;
	textures: Map<string, WebGLTexture>;
	geometries: Map<string, Float32Array>;
	currentUsage: number;
	maxUsage: number;
}
