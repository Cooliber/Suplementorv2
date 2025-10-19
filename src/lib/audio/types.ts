/**
 * Comprehensive Audio System Types for Suplementor
 * Provides type definitions for the advanced audio and haptic feedback system
 */

export interface AudioConfig {
	// Master audio settings
	masterVolume: number;
	sfxVolume: number;
	musicVolume: number;
	voiceVolume: number;
	ambientVolume: number;

	// 3D audio settings
	enableSpatialAudio: boolean;
	maxDistance: number;
	refDistance: number;
	rolloffFactor: number;

	// Performance settings
	quality: "low" | "medium" | "high" | "ultra";
	enableAudioCache: boolean;
	maxConcurrentSounds: number;

	// Polish language settings
	voiceLanguage: "pl-PL" | "pl";
	voiceRate: number;
	voicePitch: number;
	voiceGender: "male" | "female" | "neutral";

	// Haptic settings
	hapticEnabled: boolean;
	hapticIntensity: number;
	vibrationPatterns: VibrationPattern[];
}

export interface AudioAsset {
	id: string;
	url: string;
	type: "sfx" | "music" | "voice" | "ambient";
	category: string;
	polishCategory?: string;
	metadata: {
		duration?: number;
		sampleRate?: number;
		channels?: number;
		bitrate?: number;
		size?: number;
	};
	tags: string[];
	polishTags?: string[];
}

export interface SpatialAudioPosition {
	x: number;
	y: number;
	z: number;
}

export interface SpatialAudioOptions {
	position: SpatialAudioPosition;
	orientation?: { x: number; y: number; z: number };
	maxDistance?: number;
	refDistance?: number;
	rolloffFactor?: number;
}

export interface SoundInstance {
	id: string;
	buffer: AudioBuffer;
	source: AudioBufferSourceNode;
	gainNode: GainNode;
	pannerNode?: PannerNode;
	spatialOptions?: SpatialAudioOptions;
	isPlaying: boolean;
	isPaused: boolean;
	currentTime: number;
	duration: number;
	loop: boolean;
	volume: number;
	onEnded?: () => void;
}

export interface HapticPattern {
	id: string;
	name: string;
	polishName: string;
	pattern: number | number[];
	intensity: number;
	duration: number;
	category:
		| "success"
		| "error"
		| "warning"
		| "info"
		| "navigation"
		| "interaction";
}

export interface VibrationPattern {
	id: string;
	name: string;
	polishName: string;
	pattern: number[];
	intensity: number;
	repeat?: number;
	category: string;
}

export interface VoiceSynthesisOptions {
	text: string;
	language?: string;
	voice?: SpeechSynthesisVoice;
	rate?: number;
	pitch?: number;
	volume?: number;
	onStart?: () => void;
	onEnd?: () => void;
	onError?: (error: SpeechSynthesisErrorEvent) => void;
}

export interface AudioContextManager {
	context: AudioContext | null;
	isInitialized: boolean;
	isSuspended: boolean;
	sampleRate: number;
	currentTime: number;
	listener: AudioListener | null;

	// Methods
	initialize(): Promise<void>;
	suspend(): Promise<void>;
	resume(): Promise<void>;
	close(): Promise<void>;
	createBuffer(arrayBuffer: ArrayBuffer): Promise<AudioBuffer>;
	decodeAudioData(arrayBuffer: ArrayBuffer): Promise<AudioBuffer>;
}

export interface AudioAssetManager {
	assets: Map<string, AudioAsset>;
	buffers: Map<string, AudioBuffer>;
	isLoading: boolean;
	loadProgress: number;

	// Methods
	loadAsset(asset: AudioAsset): Promise<void>;
	loadAssets(assets: AudioAsset[]): Promise<void>;
	getBuffer(assetId: string): AudioBuffer | null;
	unloadAsset(assetId: string): void;
	clearCache(): void;
	getAssetsByCategory(category: string): AudioAsset[];
	getAssetsByTag(tag: string): AudioAsset[];
}

export interface SoundManager {
	instances: Map<string, SoundInstance>;
	maxConcurrent: number;
	activeCount: number;

	// Methods
	play(
		assetId: string,
		options?: {
			volume?: number;
			loop?: boolean;
			spatialOptions?: SpatialAudioOptions;
			onEnded?: () => void;
		},
	): Promise<string>;
	playOneShot(
		assetId: string,
		options?: {
			volume?: number;
			spatialOptions?: SpatialAudioOptions;
		},
	): Promise<void>;
	stop(instanceId: string): void;
	stopAll(): void;
	pause(instanceId: string): void;
	resume(instanceId: string): void;
	setVolume(instanceId: string, volume: number): void;
	setPosition(instanceId: string, position: SpatialAudioPosition): void;
}

export interface VoiceManager {
	synthesis: SpeechSynthesis | null;
	voices: SpeechSynthesisVoice[];
	isSupported: boolean;
	isSpeaking: boolean;
	currentUtterance: SpeechSynthesisUtterance | null;

	// Methods
	initialize(): Promise<void>;
	speak(options: VoiceSynthesisOptions): Promise<void>;
	stop(): void;
	pause(): void;
	resume(): void;
	getVoicesByLanguage(language: string): SpeechSynthesisVoice[];
	getOptimalVoice(
		language: string,
		gender?: string,
	): SpeechSynthesisVoice | null;
}

export interface HapticManager {
	isSupported: boolean;
	patterns: Map<string, HapticPattern>;

	// Methods
	initialize(): Promise<void>;
	vibrate(pattern: HapticPattern): Promise<void>;
	vibrateCustom(pattern: number | number[], intensity?: number): Promise<void>;
	stop(): void;
	isVibrating(): boolean;
	getPatternByCategory(category: string): HapticPattern[];
}

export interface AudioSystem {
	config: AudioConfig;
	contextManager: AudioContextManager;
	assetManager: AudioAssetManager;
	soundManager: SoundManager;
	voiceManager: VoiceManager;
	hapticManager: HapticManager;

	// Methods
	initialize(config?: Partial<AudioConfig>): Promise<void>;
	updateConfig(newConfig: Partial<AudioConfig>): void;
	shutdown(): Promise<void>;

	// Quick play methods
	playSFX(
		assetId: string,
		options?: { volume?: number; position?: SpatialAudioPosition },
	): Promise<void>;
	playMusic(
		assetId: string,
		options?: { volume?: number; loop?: boolean },
	): Promise<void>;
	playVoice(
		text: string,
		options?: Partial<VoiceSynthesisOptions>,
	): Promise<void>;
	playAmbient(
		assetId: string,
		options?: { volume?: number; loop?: boolean },
	): Promise<void>;

	// Haptic methods
	triggerHaptic(patternId: string): Promise<void>;
	triggerSuccessHaptic(): Promise<void>;
	triggerErrorHaptic(): Promise<void>;
	triggerNavigationHaptic(): Promise<void>;
}

export interface BrainRegionAudioData {
	regionId: string;
	entrySound: string;
	exitSound: string;
	ambientSound?: string;
	selectionSound: string;
	neurotransmitterSounds: Record<string, string>;
	supplementEffectSounds: Record<string, string>;
}

export interface NeurotransmitterAudioData {
	id: string;
	activationSound: string;
	pathwaySound: string;
	educationalNarration: string;
	polishEducationalNarration: string;
}

export interface SupplementAudioData {
	supplementId: string;
	activationSound: string;
	effectSound: string;
	educationalDescription: string;
	polishEducationalDescription: string;
}

export interface AudioTheme {
	id: string;
	name: string;
	polishName: string;
	backgroundMusic: string;
	ambientSounds: string[];
	transitionSounds: {
		success: string;
		error: string;
		navigation: string;
		completion: string;
	};
	hapticPatterns: {
		success: string;
		error: string;
		navigation: string;
		selection: string;
	};
}

// Audio event types for integration with existing systems
export type AudioEventType =
	| "brain-region-select"
	| "brain-region-hover"
	| "neurotransmitter-activate"
	| "supplement-apply"
	| "quiz-correct"
	| "quiz-incorrect"
	| "navigation"
	| "tutorial-start"
	| "tutorial-complete"
	| "system-ready";

export interface AudioEvent {
	type: AudioEventType;
	targetId?: string;
	position?: SpatialAudioPosition;
	data?: Record<string, any>;
	timestamp: number;
}

export type AudioEventHandler = (event: AudioEvent) => Promise<void> | void;

// Error types
export class AudioSystemError extends Error {
	constructor(
		message: string,
		public code: string,
		public details?: any,
	) {
		super(message);
		this.name = "AudioSystemError";
	}
}

export class AudioAssetLoadError extends AudioSystemError {
	constructor(assetId: string, details?: any) {
		super(
			`Failed to load audio asset: ${assetId}`,
			"ASSET_LOAD_ERROR",
			details,
		);
		this.name = "AudioAssetLoadError";
	}
}

export class AudioContextError extends AudioSystemError {
	constructor(message: string, details?: any) {
		super(`Audio context error: ${message}`, "CONTEXT_ERROR", details);
		this.name = "AudioContextError";
	}
}

export class HapticNotSupportedError extends AudioSystemError {
	constructor(details?: any) {
		super(
			"Haptic feedback not supported on this device",
			"HAPTIC_NOT_SUPPORTED",
			details,
		);
		this.name = "HapticNotSupportedError";
	}
}

export class VoiceSynthesisError extends AudioSystemError {
	constructor(message: string, details?: any) {
		super(
			`Voice synthesis error: ${message}`,
			"VOICE_SYNTHESIS_ERROR",
			details,
		);
		this.name = "VoiceSynthesisError";
	}
}
