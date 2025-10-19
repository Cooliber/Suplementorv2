/**
 * Main Audio System for Suplementor
 * Orchestrates all audio components including spatial audio, haptic feedback, and voice synthesis
 */

import {
	type AudioContextManager,
	audioContextManager,
} from "./AudioContextManager";
import { type HapticManager, hapticManager } from "./HapticManager";
import { type VoiceManager, voiceManager } from "./VoiceManager";
import {
	type AudioAsset,
	type AudioAssetManager,
	type AudioConfig,
	type AudioEvent,
	type AudioEventHandler,
	AudioSystemError,
	AudioTheme,
	BrainRegionAudioData,
	type AudioSystem as IAudioSystem,
	NeurotransmitterAudioData,
	type SoundManager,
	type SpatialAudioPosition,
	SupplementAudioData,
	type VoiceSynthesisOptions,
} from "./types";

export class AudioSystem implements IAudioSystem {
	private _config: AudioConfig;
	private _contextManager: AudioContextManager;
	private _assetManager: AudioAssetManager;
	private _soundManager: SoundManager;
	private _voiceManager: VoiceManager;
	private _hapticManager: HapticManager;
	private _eventHandlers = new Map<string, AudioEventHandler>();
	private _isInitialized = false;

	constructor(config?: Partial<AudioConfig>) {
		// Default configuration
		this._config = {
			masterVolume: 0.8,
			sfxVolume: 0.7,
			musicVolume: 0.5,
			voiceVolume: 0.8,
			ambientVolume: 0.4,
			enableSpatialAudio: true,
			maxDistance: 100,
			refDistance: 1,
			rolloffFactor: 1,
			quality: "high",
			enableAudioCache: true,
			maxConcurrentSounds: 16,
			voiceLanguage: "pl-PL",
			voiceRate: 1.0,
			voicePitch: 1.0,
			voiceGender: "neutral",
			hapticEnabled: true,
			hapticIntensity: 0.7,
			vibrationPatterns: [],
			...config,
		};

		// Initialize managers
		this._contextManager = audioContextManager;
		this._assetManager = this.createAssetManager();
		this._soundManager = this.createSoundManager();
		this._voiceManager = voiceManager;
		this._hapticManager = hapticManager;
	}

	get config(): AudioConfig {
		return { ...this._config };
	}

	get contextManager(): AudioContextManager {
		return this._contextManager;
	}

	get assetManager(): AudioAssetManager {
		return this._assetManager;
	}

	get soundManager(): SoundManager {
		return this._soundManager;
	}

	get voiceManager(): VoiceManager {
		return this._voiceManager;
	}

	get hapticManager(): HapticManager {
		return this._hapticManager;
	}

	/**
	 * Initialize the complete audio system
	 */
	async initialize(config?: Partial<AudioConfig>): Promise<void> {
		try {
			// Update config if provided
			if (config) {
				this.updateConfig(config);
			}

			// Initialize audio context
			await this._contextManager.initialize();

			// Initialize voice manager
			await this._voiceManager.initialize();

			// Initialize haptic manager
			await this._hapticManager.initialize();

			// Load default audio assets
			await this.loadDefaultAssets();

			// Set up event listeners
			this.setupEventListeners();

			this._isInitialized = true;

			console.log("Audio system initialized successfully");
		} catch (error) {
			console.error("Failed to initialize audio system:", error);
			throw new AudioSystemError(
				"Failed to initialize audio system",
				"INITIALIZATION_ERROR",
				{ originalError: error },
			);
		}
	}

	/**
	 * Update audio configuration
	 */
	updateConfig(newConfig: Partial<AudioConfig>): void {
		this._config = { ...this._config, ...newConfig };

		// Apply configuration changes to managers
		this.applyConfigToManagers();
	}

	/**
	 * Shutdown the audio system
	 */
	async shutdown(): Promise<void> {
		try {
			// Stop all sounds
			this._soundManager.stopAll();

			// Stop voice synthesis
			this._voiceManager.stop();

			// Stop haptic feedback
			this._hapticManager.stop();

			// Close audio context
			await this._contextManager.close();

			this._isInitialized = false;

			console.log("Audio system shutdown complete");
		} catch (error) {
			console.error("Error during audio system shutdown:", error);
		}
	}

	/**
	 * Play sound effect with optional spatial positioning
	 */
	async playSFX(
		assetId: string,
		options?: {
			volume?: number;
			position?: SpatialAudioPosition;
		},
	): Promise<void> {
		if (!this._isInitialized) {
			return;
		}

		try {
			const volume = options?.volume ?? this._config.sfxVolume;
			const spatialOptions = options?.position
				? {
						position: options.position,
						maxDistance: this._config.maxDistance,
						refDistance: this._config.refDistance,
						rolloffFactor: this._config.rolloffFactor,
					}
				: undefined;

			await this._soundManager.play(assetId, {
				volume,
				spatialOptions,
			});
		} catch (error) {
			console.error("Failed to play SFX:", error);
		}
	}

	/**
	 * Play background music
	 */
	async playMusic(
		assetId: string,
		options?: {
			volume?: number;
			loop?: boolean;
		},
	): Promise<void> {
		if (!this._isInitialized) {
			return;
		}

		try {
			const volume = options?.volume ?? this._config.musicVolume;
			const loop = options?.loop ?? true;

			await this._soundManager.play(assetId, {
				volume,
				loop,
			});
		} catch (error) {
			console.error("Failed to play music:", error);
		}
	}

	/**
	 * Play voice synthesis
	 */
	async playVoice(
		text: string,
		options?: Partial<VoiceSynthesisOptions>,
	): Promise<void> {
		if (!this._isInitialized) {
			return;
		}

		try {
			await this._voiceManager.speak({
				text,
				language: this._config.voiceLanguage,
				rate: this._config.voiceRate,
				pitch: this._config.voicePitch,
				volume: this._config.voiceVolume,
				...options,
			});
		} catch (error) {
			console.error("Failed to play voice:", error);
		}
	}

	/**
	 * Play ambient sound
	 */
	async playAmbient(
		assetId: string,
		options?: {
			volume?: number;
			loop?: boolean;
		},
	): Promise<void> {
		if (!this._isInitialized) {
			return;
		}

		try {
			const volume = options?.volume ?? this._config.ambientVolume;
			const loop = options?.loop ?? true;

			await this._soundManager.play(assetId, {
				volume,
				loop,
			});
		} catch (error) {
			console.error("Failed to play ambient sound:", error);
		}
	}

	/**
	 * Trigger haptic feedback
	 */
	async triggerHaptic(patternId: string): Promise<void> {
		if (!this._isInitialized || !this._config.hapticEnabled) {
			return;
		}

		try {
			const pattern = this._hapticManager.getPattern(patternId);
			if (pattern) {
				await this._hapticManager.vibrate(pattern);
			}
		} catch (error) {
			console.error("Failed to trigger haptic feedback:", error);
		}
	}

	/**
	 * Quick haptic methods
	 */
	async triggerSuccessHaptic(): Promise<void> {
		await this.triggerHaptic("success-medium");
	}

	async triggerErrorHaptic(): Promise<void> {
		await this.triggerHaptic("error-medium");
	}

	async triggerNavigationHaptic(): Promise<void> {
		await this.triggerHaptic("navigation-light");
	}

	/**
	 * Register event handler for audio events
	 */
	addEventListener(eventType: string, handler: AudioEventHandler): void {
		this._eventHandlers.set(eventType, handler);
	}

	/**
	 * Remove event handler
	 */
	removeEventListener(eventType: string): void {
		this._eventHandlers.delete(eventType);
	}

	/**
	 * Emit audio event
	 */
	async emitEvent(event: AudioEvent): Promise<void> {
		const handler = this._eventHandlers.get(event.type);
		if (handler) {
			try {
				await handler(event);
			} catch (error) {
				console.error(`Error in audio event handler for ${event.type}:`, error);
			}
		}
	}

	/**
	 * Create asset manager instance
	 */
	private createAssetManager(): AudioAssetManager {
		return {
			assets: new Map(),
			buffers: new Map(),
			isLoading: false,
			loadProgress: 0,

			async loadAsset(asset: AudioAsset): Promise<void> {
				// Implementation would load audio file and decode it
				console.log(`Loading audio asset: ${asset.id}`);
			},

			async loadAssets(assets: AudioAsset[]): Promise<void> {
				// Implementation would load multiple assets
				console.log(`Loading ${assets.length} audio assets`);
			},

			getBuffer(assetId: string): AudioBuffer | null {
				return this.buffers.get(assetId) || null;
			},

			unloadAsset(assetId: string): void {
				this.buffers.delete(assetId);
			},

			clearCache(): void {
				this.buffers.clear();
			},

			getAssetsByCategory(category: string): AudioAsset[] {
				return Array.from(this.assets.values()).filter(
					(asset) => asset.category === category,
				);
			},

			getAssetsByTag(tag: string): AudioAsset[] {
				return Array.from(this.assets.values()).filter((asset) =>
					asset.tags.includes(tag),
				);
			},
		};
	}

	/**
	 * Create sound manager instance
	 */
	private createSoundManager(): SoundManager {
		return {
			instances: new Map(),
			maxConcurrent: this._config.maxConcurrentSounds,
			activeCount: 0,

			async play(
				assetId: string,
				options?: {
					volume?: number;
					loop?: boolean;
					spatialOptions?: any;
					onEnded?: () => void;
				},
			): Promise<string> {
				// Implementation would create and play sound instance
				const instanceId = `sound_${Date.now()}_${Math.random()}`;
				console.log(`Playing sound: ${assetId} with instance: ${instanceId}`);
				return instanceId;
			},

			async playOneShot(
				assetId: string,
				options?: { volume?: number; spatialOptions?: any },
			): Promise<void> {
				await this.play(assetId, { ...options, loop: false });
			},

			stop(instanceId: string): void {
				console.log(`Stopping sound instance: ${instanceId}`);
			},

			stopAll(): void {
				console.log("Stopping all sounds");
			},

			pause(instanceId: string): void {
				console.log(`Pausing sound instance: ${instanceId}`);
			},

			resume(instanceId: string): void {
				console.log(`Resuming sound instance: ${instanceId}`);
			},

			setVolume(instanceId: string, volume: number): void {
				console.log(`Setting volume for ${instanceId}: ${volume}`);
			},

			setPosition(instanceId: string, position: SpatialAudioPosition): void {
				console.log(`Setting position for ${instanceId}:`, position);
			},
		};
	}

	/**
	 * Load default audio assets for the suplementor app
	 */
	private async loadDefaultAssets(): Promise<void> {
		const defaultAssets: AudioAsset[] = [
			// Brain region interaction sounds
			{
				id: "brain-region-select",
				url: "/audio/sfx/brain-region-select.mp3",
				type: "sfx",
				category: "brain-interaction",
				polishCategory: "interakcja-mózg",
				metadata: { duration: 0.5 },
				tags: ["brain", "selection", "interaction"],
				polishTags: ["mózg", "wybór", "interakcja"],
			},
			{
				id: "brain-region-hover",
				url: "/audio/sfx/brain-region-hover.mp3",
				type: "sfx",
				category: "brain-interaction",
				polishCategory: "interakcja-mózg",
				metadata: { duration: 0.2 },
				tags: ["brain", "hover", "subtle"],
				polishTags: ["mózg", "najechanie", "subtelne"],
			},

			// Neurotransmitter sounds
			{
				id: "neurotransmitter-activate",
				url: "/audio/sfx/neurotransmitter-activate.mp3",
				type: "sfx",
				category: "neurotransmitter",
				polishCategory: "neuroprzekaźnik",
				metadata: { duration: 0.8 },
				tags: ["neurotransmitter", "activation", "pulse"],
				polishTags: ["neuroprzekaźnik", "aktywacja", "puls"],
			},

			// Supplement interaction sounds
			{
				id: "supplement-apply",
				url: "/audio/sfx/supplement-apply.mp3",
				type: "sfx",
				category: "supplement-interaction",
				polishCategory: "interakcja-suplement",
				metadata: { duration: 1.2 },
				tags: ["supplement", "application", "enhancement"],
				polishTags: ["suplement", "zastosowanie", "wzmacnianie"],
			},

			// Success and error sounds
			{
				id: "success-chime",
				url: "/audio/sfx/success-chime.mp3",
				type: "sfx",
				category: "feedback",
				polishCategory: "informacja-zwrotna",
				metadata: { duration: 0.6 },
				tags: ["success", "positive", "achievement"],
				polishTags: ["sukces", "pozytywne", "osiągnięcie"],
			},
			{
				id: "error-boop",
				url: "/audio/sfx/error-boop.mp3",
				type: "sfx",
				category: "feedback",
				polishCategory: "informacja-zwrotna",
				metadata: { duration: 0.3 },
				tags: ["error", "negative", "mistake"],
				polishTags: ["błąd", "negatywne", "pomyłka"],
			},

			// Navigation sounds
			{
				id: "navigation-click",
				url: "/audio/sfx/navigation-click.mp3",
				type: "sfx",
				category: "navigation",
				polishCategory: "nawigacja",
				metadata: { duration: 0.1 },
				tags: ["navigation", "click", "ui"],
				polishTags: ["nawigacja", "kliknięcie", "interfejs"],
			},

			// Ambient sounds
			{
				id: "brain-ambient",
				url: "/audio/ambient/brain-ambient.mp3",
				type: "ambient",
				category: "brain-atmosphere",
				polishCategory: "atmosfera-mózg",
				metadata: { duration: 30.0 },
				tags: ["ambient", "brain", "physiological"],
				polishTags: ["otoczenie", "mózg", "fizjologiczne"],
			},

			// Background music
			{
				id: "educational-calm",
				url: "/audio/music/educational-calm.mp3",
				type: "music",
				category: "background-music",
				polishCategory: "muzyka-tła",
				metadata: { duration: 180.0 },
				tags: ["music", "educational", "calm"],
				polishTags: ["muzyka", "edukacyjna", "spokojna"],
			},
		];

		await this._assetManager.loadAssets(defaultAssets);
	}

	/**
	 * Apply configuration changes to all managers
	 */
	private applyConfigToManagers(): void {
		// Apply haptic intensity
		// Apply voice settings
		// Apply audio quality settings
	}

	/**
	 * Set up event listeners for audio context management
	 */
	private setupEventListeners(): void {
		if (typeof window === "undefined") {
			return;
		}

		// Handle page visibility changes
		document.addEventListener("visibilitychange", () => {
			if (document.hidden) {
				this._contextManager.suspend();
			} else {
				this._contextManager.resume();
			}
		});

		// Handle page unload
		window.addEventListener("beforeunload", () => {
			this.shutdown();
		});
	}

	/**
	 * Get system status for debugging
	 */
	getStatus(): {
		initialized: boolean;
		contextState: string;
		activeSounds: number;
		speaking: boolean;
		hapticsSupported: boolean;
		voicesAvailable: number;
	} {
		return {
			initialized: this._isInitialized,
			contextState: this._contextManager.getState(),
			activeSounds: this._soundManager.activeCount,
			speaking: this._voiceManager.isSpeaking,
			hapticsSupported: this._hapticManager.isSupported,
			voicesAvailable: this._voiceManager.voices.length,
		};
	}
}

// Singleton instance for global use
export const audioSystem = new AudioSystem();
