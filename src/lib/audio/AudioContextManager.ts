/**
 * Audio Context Manager for Suplementor
 * Handles Web Audio API context lifecycle and provides utilities for audio processing
 */

import {
	AudioContextError,
	type AudioContextManager as IAudioContextManager,
} from "./types";

export class AudioContextManager implements IAudioContextManager {
	private _context: AudioContext | null = null;
	private _isInitialized = false;
	private _isSuspended = false;

	get context(): AudioContext | null {
		return this._context;
	}

	get isInitialized(): boolean {
		return this._isInitialized;
	}

	get isSuspended(): boolean {
		return this._isSuspended;
	}

	get sampleRate(): number {
		return this._context?.sampleRate ?? 44100;
	}

	get currentTime(): number {
		return this._context?.currentTime ?? 0;
	}

	get listener(): AudioListener | null {
		return this._context?.listener ?? null;
	}

	/**
	 * Initialize the audio context
	 * Must be called after user interaction to comply with browser policies
	 */
	async initialize(): Promise<void> {
		try {
			// Check if Web Audio API is supported
			if (typeof window === "undefined" || !window.AudioContext) {
				throw new AudioContextError(
					"Web Audio API is not supported in this environment",
					{ browserSupport: false },
				);
			}

			// Create audio context if it doesn't exist
			if (!this._context) {
				// Use AudioContext with fallback to webkitAudioContext
				const AudioContextClass =
					window.AudioContext || (window as any).webkitAudioContext;
				this._context = new AudioContextClass();

				// Configure optimal settings
				if (this._context.state === "suspended") {
					await this._context.resume();
				}

				// Set up context properties for better performance
				this._context.latencyHint = "interactive";
			}

			this._isInitialized = true;
			this._isSuspended = this._context.state === "suspended";
		} catch (error) {
			console.error("Failed to initialize audio context:", error);
			throw new AudioContextError("Failed to initialize audio context", {
				originalError: error,
			});
		}
	}

	/**
	 * Suspend the audio context to save battery
	 */
	async suspend(): Promise<void> {
		if (!this._context || !this._isInitialized) {
			return;
		}

		try {
			await this._context.suspend();
			this._isSuspended = true;
		} catch (error) {
			console.error("Failed to suspend audio context:", error);
			throw new AudioContextError("Failed to suspend audio context", {
				originalError: error,
			});
		}
	}

	/**
	 * Resume the audio context
	 */
	async resume(): Promise<void> {
		if (!this._context || !this._isInitialized) {
			return;
		}

		try {
			await this._context.resume();
			this._isSuspended = false;
		} catch (error) {
			console.error("Failed to resume audio context:", error);
			throw new AudioContextError("Failed to resume audio context", {
				originalError: error,
			});
		}
	}

	/**
	 * Close and cleanup the audio context
	 */
	async close(): Promise<void> {
		if (!this._context) {
			return;
		}

		try {
			await this._context.close();
			this._context = null;
			this._isInitialized = false;
			this._isSuspended = false;
		} catch (error) {
			console.error("Failed to close audio context:", error);
			throw new AudioContextError("Failed to close audio context", {
				originalError: error,
			});
		}
	}

	/**
	 * Create an AudioBuffer from ArrayBuffer data
	 */
	async createBuffer(arrayBuffer: ArrayBuffer): Promise<AudioBuffer> {
		if (!this._context) {
			throw new AudioContextError("Audio context not initialized");
		}

		try {
			return await this._context.decodeAudioData(arrayBuffer);
		} catch (error) {
			console.error("Failed to create audio buffer:", error);
			throw new AudioContextError("Failed to create audio buffer", {
				originalError: error,
				arrayBufferSize: arrayBuffer.byteLength,
			});
		}
	}

	/**
	 * Decode audio data (alias for createBuffer for compatibility)
	 */
	async decodeAudioData(arrayBuffer: ArrayBuffer): Promise<AudioBuffer> {
		return this.createBuffer(arrayBuffer);
	}

	/**
	 * Get the current state of the audio context
	 */
	getState(): AudioContextState {
		return this._context?.state ?? "closed";
	}

	/**
	 * Check if the audio context is running
	 */
	isRunning(): boolean {
		return this._context?.state === "running";
	}

	/**
	 * Get audio context latency (if available)
	 */
	getLatency(): number {
		return this._context?.baseLatency ?? 0;
	}

	/**
	 * Set up 3D audio listener orientation for spatial audio
	 */
	setListenerOrientation(
		forwardX: number,
		forwardY: number,
		forwardZ: number,
		upX: number,
		upY: number,
		upZ: number,
	): void {
		if (!this._context?.listener) {
			return;
		}

		try {
			this._context.listener.forwardX.value = forwardX;
			this._context.listener.forwardY.value = forwardY;
			this._context.listener.forwardZ.value = forwardZ;
			this._context.listener.upX.value = upX;
			this._context.listener.upY.value = upY;
			this._context.listener.upZ.value = upZ;
		} catch (error) {
			console.warn("Failed to set listener orientation:", error);
		}
	}

	/**
	 * Set listener position for 3D spatial audio
	 */
	setListenerPosition(x: number, y: number, z: number): void {
		if (!this._context?.listener) {
			return;
		}

		try {
			this._context.listener.positionX.value = x;
			this._context.listener.positionY.value = y;
			this._context.listener.positionZ.value = z;
		} catch (error) {
			console.warn("Failed to set listener position:", error);
		}
	}

	/**
	 * Create a gain node for volume control
	 */
	createGainNode(value = 1): GainNode | null {
		if (!this._context) {
			return null;
		}

		try {
			const gainNode = this._context.createGain();
			gainNode.gain.value = value;
			return gainNode;
		} catch (error) {
			console.error("Failed to create gain node:", error);
			return null;
		}
	}

	/**
	 * Create a panner node for 3D spatial audio
	 */
	createPannerNode(): PannerNode | null {
		if (!this._context) {
			return null;
		}

		try {
			const pannerNode = this._context.createPanner();
			// Set default 3D audio properties
			pannerNode.panningModel = "HRTF";
			pannerNode.distanceModel = "inverse";
			pannerNode.refDistance = 1;
			pannerNode.maxDistance = 100;
			pannerNode.rolloffFactor = 1;
			return pannerNode;
		} catch (error) {
			console.error("Failed to create panner node:", error);
			return null;
		}
	}

	/**
	 * Create a convolver node for reverb effects
	 */
	createConvolverNode(): ConvolverNode | null {
		if (!this._context) {
			return null;
		}

		try {
			return this._context.createConvolver();
		} catch (error) {
			console.error("Failed to create convolver node:", error);
			return null;
		}
	}

	/**
	 * Create a biquad filter node for audio effects
	 */
	createBiquadFilterNode(
		type: BiquadFilterType = "lowpass",
	): BiquadFilterNode | null {
		if (!this._context) {
			return null;
		}

		try {
			const filterNode = this._context.createBiquadFilter();
			filterNode.type = type;
			return filterNode;
		} catch (error) {
			console.error("Failed to create biquad filter node:", error);
			return null;
		}
	}

	/**
	 * Handle visibility change events to manage audio context state
	 */
	handleVisibilityChange(): void {
		if (typeof document === "undefined") {
			return;
		}

		document.addEventListener("visibilitychange", async () => {
			try {
				if (document.hidden && this._context && this.isRunning()) {
					await this.suspend();
				} else if (!document.hidden && this._context && this._isSuspended) {
					await this.resume();
				}
			} catch (error) {
				console.warn("Failed to handle visibility change:", error);
			}
		});
	}

	/**
	 * Setup audio context for optimal performance
	 */
	private setupOptimalSettings(): void {
		if (!this._context) {
			return;
		}

		// Set latency hint for interactive audio
		if ("latencyHint" in this._context) {
			(this._context as any).latencyHint = "interactive";
		}

		// Set up visibility change handling
		this.handleVisibilityChange();
	}

	/**
	 * Get audio context statistics for debugging
	 */
	getStats(): {
		state: AudioContextState;
		sampleRate: number;
		currentTime: number;
		latency: number;
		isInitialized: boolean;
		isSuspended: boolean;
	} {
		return {
			state: this.getState(),
			sampleRate: this.sampleRate,
			currentTime: this.currentTime,
			latency: this.getLatency(),
			isInitialized: this._isInitialized,
			isSuspended: this._isSuspended,
		};
	}
}

// Singleton instance for global use
export const audioContextManager = new AudioContextManager();
