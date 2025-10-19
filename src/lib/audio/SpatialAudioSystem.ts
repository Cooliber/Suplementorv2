/**
 * 3D Spatial Audio System for Suplementor
 * Provides immersive 3D audio positioning for anatomical interactions
 */

import type { AudioContextManager } from "./AudioContextManager";
import {
	AudioSystemError,
	type SoundInstance,
	type SpatialAudioOptions,
	type SpatialAudioPosition,
} from "./types";

export class SpatialAudioSystem {
	private contextManager: AudioContextManager;
	private soundInstances = new Map<string, SoundInstance>();
	private listenerPosition: SpatialAudioPosition = { x: 0, y: 0, z: 0 };
	private listenerOrientation = {
		forward: { x: 0, y: 0, z: -1 },
		up: { x: 0, y: 1, z: 0 },
	};

	constructor(contextManager: AudioContextManager) {
		this.contextManager = contextManager;
	}

	/**
	 * Initialize spatial audio system
	 */
	async initialize(): Promise<void> {
		if (!this.contextManager.isInitialized) {
			await this.contextManager.initialize();
		}

		this.setupDefaultListenerPosition();
	}

	/**
	 * Set up default listener position and orientation
	 */
	private setupDefaultListenerPosition(): void {
		// Position listener at the center of the brain model
		this.setListenerPosition(0, 0, 5);
		this.setListenerOrientation(0, 0, -1, 0, 1, 0);
	}

	/**
	 * Set listener position for 3D audio
	 */
	setListenerPosition(x: number, y: number, z: number): void {
		this.listenerPosition = { x, y, z };
		this.contextManager.setListenerPosition(x, y, z);
	}

	/**
	 * Set listener orientation for 3D audio
	 */
	setListenerOrientation(
		forwardX: number,
		forwardY: number,
		forwardZ: number,
		upX: number,
		upY: number,
		upZ: number,
	): void {
		this.listenerOrientation = {
			forward: { x: forwardX, y: forwardY, z: forwardZ },
			up: { x: upX, y: upY, z: upZ },
		};
		this.contextManager.setListenerOrientation(
			forwardX,
			forwardY,
			forwardZ,
			upX,
			upY,
			upZ,
		);
	}

	/**
	 * Create spatially positioned sound instance
	 */
	async createSpatialSound(
		buffer: AudioBuffer,
		options: SpatialAudioOptions & {
			volume?: number;
			loop?: boolean;
			onEnded?: () => void;
		},
	): Promise<string> {
		if (!this.contextManager.context) {
			throw new AudioSystemError("Audio context not initialized");
		}

		const instanceId = `spatial_${Date.now()}_${Math.random()}`;

		try {
			// Create audio nodes
			const source = this.contextManager.context.createBufferSource();
			const gainNode = this.contextManager.context.createGain();
			const pannerNode = this.contextManager.context.createPanner();

			// Configure source
			source.buffer = buffer;
			source.loop = options.loop ?? false;
			if (options.onEnded) {
				source.onended = options.onEnded;
			}

			// Configure volume
			gainNode.gain.value = options.volume ?? 1.0;

			// Configure 3D panning
			this.configurePannerNode(pannerNode, options);

			// Connect nodes
			source.connect(pannerNode);
			pannerNode.connect(gainNode);
			gainNode.connect(this.contextManager.context.destination);

			// Create sound instance
			const soundInstance: SoundInstance = {
				id: instanceId,
				buffer,
				source,
				gainNode,
				pannerNode,
				spatialOptions: options,
				isPlaying: false,
				isPaused: false,
				currentTime: 0,
				duration: buffer.duration,
				loop: options.loop ?? false,
				volume: options.volume ?? 1.0,
				onEnded: options.onEnded,
			};

			this.soundInstances.set(instanceId, soundInstance);

			return instanceId;
		} catch (error) {
			console.error("Failed to create spatial sound:", error);
			throw new AudioSystemError(
				"Failed to create spatial sound",
				"SPATIAL_SOUND_ERROR",
				{ originalError: error },
			);
		}
	}

	/**
	 * Configure panner node for 3D audio positioning
	 */
	private configurePannerNode(
		pannerNode: PannerNode,
		options: SpatialAudioOptions,
	): void {
		// Set position
		pannerNode.positionX.value = options.position.x;
		pannerNode.positionY.value = options.position.y;
		pannerNode.positionZ.value = options.position.z;

		// Set distance model
		pannerNode.distanceModel = "inverse"; // More realistic for anatomical sounds
		pannerNode.refDistance = options.refDistance ?? 1;
		pannerNode.maxDistance = options.maxDistance ?? 100;
		pannerNode.rolloffFactor = options.rolloffFactor ?? 1;

		// Set panning model for better 3D effect
		pannerNode.panningModel = "HRTF"; // Head-Related Transfer Function for realistic 3D

		// Set orientation if provided
		if (options.orientation) {
			pannerNode.orientationX.value = options.orientation.x;
			pannerNode.orientationY.value = options.orientation.y;
			pannerNode.orientationZ.value = options.orientation.z;
		}
	}

	/**
	 * Play sound at specific 3D position
	 */
	async playAtPosition(
		buffer: AudioBuffer,
		position: SpatialAudioPosition,
		options?: {
			volume?: number;
			loop?: boolean;
			maxDistance?: number;
			refDistance?: number;
			rolloffFactor?: number;
			onEnded?: () => void;
		},
	): Promise<string> {
		const spatialOptions: SpatialAudioOptions = {
			position,
			maxDistance: options?.maxDistance,
			refDistance: options?.refDistance,
			rolloffFactor: options?.rolloffFactor,
		};

		return this.createSpatialSound(buffer, {
			...spatialOptions,
			volume: options?.volume,
			loop: options?.loop,
			onEnded: options?.onEnded,
		});
	}

	/**
	 * Start playing a spatial sound instance
	 */
	play(instanceId: string): void {
		const instance = this.soundInstances.get(instanceId);
		if (!instance) {
			console.warn(`Sound instance not found: ${instanceId}`);
			return;
		}

		try {
			instance.source.start();
			instance.isPlaying = true;
			instance.isPaused = false;
		} catch (error) {
			console.error("Failed to play spatial sound:", error);
		}
	}

	/**
	 * Stop spatial sound instance
	 */
	stop(instanceId: string): void {
		const instance = this.soundInstances.get(instanceId);
		if (!instance) {
			return;
		}

		try {
			instance.source.stop();
			instance.isPlaying = false;
			this.soundInstances.delete(instanceId);
		} catch (error) {
			console.error("Failed to stop spatial sound:", error);
		}
	}

	/**
	 * Pause spatial sound instance
	 */
	pause(instanceId: string): void {
		const instance = this.soundInstances.get(instanceId);
		if (!instance || !instance.isPlaying) {
			return;
		}

		try {
			instance.source.stop();
			instance.isPaused = true;
			instance.isPlaying = false;
			instance.currentTime = this.contextManager.currentTime;
		} catch (error) {
			console.error("Failed to pause spatial sound:", error);
		}
	}

	/**
	 * Resume paused spatial sound instance
	 */
	resume(instanceId: string): void {
		const instance = this.soundInstances.get(instanceId);
		if (!instance || !instance.isPaused) {
			return;
		}

		try {
			// Create new source for resumed playback
			const newSource = this.contextManager.context?.createBufferSource();
			newSource.buffer = instance.buffer;
			newSource.loop = instance.loop;

			// Connect to existing nodes
			newSource.connect(instance.pannerNode!);
			instance.pannerNode?.connect(instance.gainNode);

			// Start from where it was paused
			newSource.start(0, instance.currentTime);

			instance.source = newSource;
			instance.isPlaying = true;
			instance.isPaused = false;
		} catch (error) {
			console.error("Failed to resume spatial sound:", error);
		}
	}

	/**
	 * Update position of spatial sound instance
	 */
	updatePosition(instanceId: string, position: SpatialAudioPosition): void {
		const instance = this.soundInstances.get(instanceId);
		if (!instance || !instance.pannerNode) {
			return;
		}

		try {
			instance.pannerNode.positionX.value = position.x;
			instance.pannerNode.positionY.value = position.y;
			instance.pannerNode.positionZ.value = position.z;

			// Update stored options
			if (instance.spatialOptions) {
				instance.spatialOptions.position = position;
			}
		} catch (error) {
			console.error("Failed to update sound position:", error);
		}
	}

	/**
	 * Update volume of spatial sound instance
	 */
	updateVolume(instanceId: string, volume: number): void {
		const instance = this.soundInstances.get(instanceId);
		if (!instance) {
			return;
		}

		try {
			instance.gainNode.gain.value = Math.max(0, Math.min(1, volume));
			instance.volume = volume;
		} catch (error) {
			console.error("Failed to update sound volume:", error);
		}
	}

	/**
	 * Stop all spatial sounds
	 */
	stopAll(): void {
		const instanceIds = Array.from(this.soundInstances.keys());
		instanceIds.forEach((id) => this.stop(id));
	}

	/**
	 * Get all active sound instances
	 */
	getActiveInstances(): SoundInstance[] {
		return Array.from(this.soundInstances.values()).filter(
			(instance) => instance.isPlaying || instance.isPaused,
		);
	}

	/**
	 * Clean up completed sound instances
	 */
	cleanup(): void {
		const toRemove: string[] = [];

		this.soundInstances.forEach((instance, id) => {
			// Check if source has ended (not available in all browsers)
			if (instance.source && "playbackState" in instance.source) {
				const state = (instance.source as any).playbackState;
				if (state === "FINISHED") {
					toRemove.push(id);
				}
			}
		});

		toRemove.forEach((id) => this.soundInstances.delete(id));
	}

	/**
	 * Calculate distance between two 3D positions
	 */
	private calculateDistance(
		pos1: SpatialAudioPosition,
		pos2: SpatialAudioPosition,
	): number {
		const dx = pos1.x - pos2.x;
		const dy = pos1.y - pos2.y;
		const dz = pos1.z - pos2.z;
		return Math.sqrt(dx * dx + dy * dy + dz * dz);
	}

	/**
	 * Calculate optimal volume based on distance from listener
	 */
	calculateDistanceVolume(
		soundPosition: SpatialAudioPosition,
		maxDistance = 100,
		refDistance = 1,
	): number {
		const distance = this.calculateDistance(
			soundPosition,
			this.listenerPosition,
		);

		if (distance <= refDistance) {
			return 1.0;
		}

		if (distance >= maxDistance) {
			return 0.0;
		}

		// Inverse distance model: volume = refDistance / (refDistance + rolloffFactor * (distance - refDistance))
		const rolloffFactor = 1;
		return (
			refDistance / (refDistance + rolloffFactor * (distance - refDistance))
		);
	}

	/**
	 * Convert brain region position to spatial audio coordinates
	 */
	brainRegionToSpatialAudio(
		regionPosition: [number, number, number],
		brainCenter: [number, number, number] = [0, 0, 0],
	): SpatialAudioPosition {
		// Scale brain coordinates to audio space
		const scale = 2.0;
		return {
			x: (regionPosition[0] - brainCenter[0]) * scale,
			y: (regionPosition[1] - brainCenter[1]) * scale,
			z: (regionPosition[2] - brainCenter[2]) * scale,
		};
	}

	/**
	 * Create spatial sound for brain region interaction
	 */
	async playBrainRegionSound(
		buffer: AudioBuffer,
		regionPosition: [number, number, number],
		options?: {
			volume?: number;
			type?: "select" | "hover" | "ambient";
		},
	): Promise<string> {
		const spatialPosition = this.brainRegionToSpatialAudio(regionPosition);

		// Adjust settings based on interaction type
		let volume = options?.volume ?? 0.7;
		let loop = false;

		switch (options?.type) {
			case "ambient":
				volume = 0.3;
				loop = true;
				break;
			case "hover":
				volume = 0.4;
				break;
			default:
				volume = 0.7;
				break;
		}

		return this.playAtPosition(buffer, spatialPosition, {
			volume,
			loop,
			maxDistance: 50,
			refDistance: 2,
		});
	}

	/**
	 * Create spatial sound for neurotransmitter pathway
	 */
	async playNeurotransmitterPathwaySound(
		buffer: AudioBuffer,
		pathwayPoints: [number, number, number][],
		options?: {
			volume?: number;
			followPath?: boolean;
		},
	): Promise<string> {
		if (pathwayPoints.length === 0) {
			throw new AudioSystemError("Pathway must have at least one point");
		}

		// Use midpoint of pathway as sound position
		const midPoint = pathwayPoints[Math.floor(pathwayPoints.length / 2)];
		const spatialPosition = this.brainRegionToSpatialAudio(midPoint);

		const volume = options?.volume ?? 0.5;

		return this.playAtPosition(buffer, spatialPosition, {
			volume,
			loop: false,
			maxDistance: 30,
			refDistance: 1,
		});
	}

	/**
	 * Update listener position based on camera position in 3D scene
	 */
	updateListenerFromCamera(cameraPosition: {
		x: number;
		y: number;
		z: number;
	}): void {
		// Convert camera coordinates to audio listener coordinates
		this.setListenerPosition(
			cameraPosition.x,
			cameraPosition.y,
			cameraPosition.z,
		);
	}

	/**
	 * Get spatial audio statistics
	 */
	getStats(): {
		activeInstances: number;
		listenerPosition: SpatialAudioPosition;
		contextState: string;
		sampleRate: number;
	} {
		return {
			activeInstances: this.getActiveInstances().length,
			listenerPosition: this.listenerPosition,
			contextState: this.contextManager.getState(),
			sampleRate: this.contextManager.sampleRate,
		};
	}
}

// Factory function to create spatial audio system
export function createSpatialAudioSystem(
	contextManager: AudioContextManager,
): SpatialAudioSystem {
	return new SpatialAudioSystem(contextManager);
}
