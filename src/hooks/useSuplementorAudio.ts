/**
 * Suplementor Audio Hook
 * Main React hook for integrating comprehensive audio and haptic feedback
 */

import { audioSystem } from "@/lib/audio/AudioSystem";
import {
	type SpatialAudioSystem,
	createSpatialAudioSystem,
} from "@/lib/audio/SpatialAudioSystem";
import {
	brainRegionAudioData,
	neurotransmitterAudioData,
	supplementAudioData,
} from "@/lib/audio/audioAssets";
import {
	type AudioConfig,
	type AudioEvent,
	BrainRegionAudioData,
	NeurotransmitterAudioData,
	type SpatialAudioPosition,
	SupplementAudioData,
} from "@/lib/audio/types";
import { useCallback, useEffect, useRef, useState } from "react";

interface UseSuplementorAudioOptions {
	enabled?: boolean;
	config?: Partial<AudioConfig>;
	autoInitialize?: boolean;
}

interface UseSuplementorAudioReturn {
	// System state
	isInitialized: boolean;
	isEnabled: boolean;
	config: AudioConfig;

	// Audio controls
	playSFX: (
		assetId: string,
		options?: { volume?: number; position?: SpatialAudioPosition },
	) => Promise<void>;
	playMusic: (
		assetId: string,
		options?: { volume?: number; loop?: boolean },
	) => Promise<void>;
	playVoice: (
		text: string,
		options?: { context?: string; emphasis?: string },
	) => Promise<void>;
	playAmbient: (
		assetId: string,
		options?: { volume?: number; loop?: boolean },
	) => Promise<void>;

	// Brain-specific audio
	playBrainRegionAudio: (
		regionId: string,
		action: "select" | "hover" | "ambient",
	) => Promise<void>;
	playNeurotransmitterAudio: (
		neurotransmitterId: string,
		action: "activate" | "pathway",
	) => Promise<void>;
	playSupplementAudio: (
		supplementId: string,
		action: "apply" | "enhance",
	) => Promise<void>;

	// Haptic feedback
	triggerHaptic: (patternId: string) => Promise<void>;
	triggerSuccessHaptic: () => Promise<void>;
	triggerErrorHaptic: () => Promise<void>;
	triggerNavigationHaptic: () => Promise<void>;

	// Educational content
	speakBrainRegion: (regionId: string) => Promise<void>;
	speakNeurotransmitter: (neurotransmitterId: string) => Promise<void>;
	speakSupplement: (supplementId: string) => Promise<void>;
	speakEducationalContent: (title: string, content: string) => Promise<void>;

	// 3D spatial audio
	spatialAudioSystem: SpatialAudioSystem | null;
	updateListenerPosition: (position: SpatialAudioPosition) => void;

	// System control
	updateConfig: (newConfig: Partial<AudioConfig>) => void;
	shutdown: () => Promise<void>;
	testAudio: () => Promise<{
		audio: boolean;
		haptics: boolean;
		voice: boolean;
	}>;
}

export function useSuplementorAudio(
	options: UseSuplementorAudioOptions = {},
): UseSuplementorAudioReturn {
	const {
		enabled = true,
		config: initialConfig = {},
		autoInitialize = true,
	} = options;

	const [isInitialized, setIsInitialized] = useState(false);
	const [isEnabled, setIsEnabled] = useState(enabled);
	const [config, setConfig] = useState<AudioConfig>(audioSystem.config);
	const spatialAudioSystemRef = useRef<SpatialAudioSystem | null>(null);
	const initializedRef = useRef(false);

	/**
	 * Initialize audio system
	 */
	const initialize = useCallback(async () => {
		if (initializedRef.current || !isEnabled) {
			return;
		}

		try {
			await audioSystem.initialize(initialConfig);
			spatialAudioSystemRef.current = createSpatialAudioSystem(
				audioSystem.contextManager,
			);

			// Set up audio event handlers
			setupAudioEventHandlers();

			setIsInitialized(true);
			setConfig(audioSystem.config);
			initializedRef.current = true;

			console.log("Suplementor audio system initialized");
		} catch (error) {
			console.error("Failed to initialize suplementor audio:", error);
		}
	}, [isEnabled, initialConfig]);

	/**
	 * Setup audio event handlers for brain interactions
	 */
	const setupAudioEventHandlers = useCallback(() => {
		// Brain region selection events
		audioSystem.addEventListener(
			"brain-region-select",
			async (event: AudioEvent) => {
				if (event.targetId) {
					await audioSystem.playSFX("brain-region-select-soft", {
						position: event.position,
					});
					await audioSystem.triggerHaptic("brain-region-select");
				}
			},
		);

		// Neurotransmitter activation events
		audioSystem.addEventListener(
			"neurotransmitter-activate",
			async (event: AudioEvent) => {
				if (event.targetId) {
					await audioSystem.playSFX("neurotransmitter-activate", {
						position: event.position,
					});
					await audioSystem.triggerHaptic("neurotransmitter-activate");
				}
			},
		);

		// Supplement application events
		audioSystem.addEventListener(
			"supplement-apply",
			async (event: AudioEvent) => {
				if (event.targetId) {
					await audioSystem.playSFX("supplement-apply", {
						position: event.position,
					});
					await audioSystem.triggerHaptic("supplement-apply");
				}
			},
		);

		// Quiz and educational events
		audioSystem.addEventListener("quiz-correct", async () => {
			await audioSystem.playSFX("success-chime");
			await audioSystem.triggerSuccessHaptic();
		});

		audioSystem.addEventListener("quiz-incorrect", async () => {
			await audioSystem.playSFX("error-boop");
			await audioSystem.triggerErrorHaptic();
		});

		// Navigation events
		audioSystem.addEventListener("navigation", async () => {
			await audioSystem.playSFX("navigation-click");
			await audioSystem.triggerNavigationHaptic();
		});
	}, []);

	/**
	 * Play sound effect with optional spatial positioning
	 */
	const playSFX = useCallback(
		async (
			assetId: string,
			options?: { volume?: number; position?: SpatialAudioPosition },
		) => {
			if (!isInitialized || !isEnabled) return;
			await audioSystem.playSFX(assetId, options);
		},
		[isInitialized, isEnabled],
	);

	/**
	 * Play background music
	 */
	const playMusic = useCallback(
		async (assetId: string, options?: { volume?: number; loop?: boolean }) => {
			if (!isInitialized || !isEnabled) return;
			await audioSystem.playMusic(assetId, options);
		},
		[isInitialized, isEnabled],
	);

	/**
	 * Play voice synthesis
	 */
	const playVoice = useCallback(
		async (text: string, options?: { context?: string; emphasis?: string }) => {
			if (!isInitialized || !isEnabled) return;
			await audioSystem.playVoice(text, options);
		},
		[isInitialized, isEnabled],
	);

	/**
	 * Play ambient sound
	 */
	const playAmbient = useCallback(
		async (assetId: string, options?: { volume?: number; loop?: boolean }) => {
			if (!isInitialized || !isEnabled) return;
			await audioSystem.playAmbient(assetId, options);
		},
		[isInitialized, isEnabled],
	);

	/**
	 * Play brain region specific audio
	 */
	const playBrainRegionAudio = useCallback(
		async (regionId: string, action: "select" | "hover" | "ambient") => {
			if (!isInitialized || !isEnabled) return;

			const regionData = brainRegionAudioData[regionId];
			if (!regionData) return;

			let assetId: string;
			switch (action) {
				case "select":
					assetId = regionData.selectionSound;
					break;
				case "hover":
					assetId = regionData.selectionSound; // Use same as select for now
					break;
				case "ambient":
					assetId = regionData.ambientSound || "brain-ambient-neural";
					break;
				default:
					return;
			}

			await playSFX(assetId);
		},
		[isInitialized, isEnabled, playSFX],
	);

	/**
	 * Play neurotransmitter specific audio
	 */
	const playNeurotransmitterAudio = useCallback(
		async (neurotransmitterId: string, action: "activate" | "pathway") => {
			if (!isInitialized || !isEnabled) return;

			const ntData = neurotransmitterAudioData[neurotransmitterId];
			if (!ntData) return;

			const assetId =
				action === "activate" ? ntData.activationSound : ntData.pathwaySound;
			await playSFX(assetId);
		},
		[isInitialized, isEnabled, playSFX],
	);

	/**
	 * Play supplement specific audio
	 */
	const playSupplementAudio = useCallback(
		async (supplementId: string, action: "apply" | "enhance") => {
			if (!isInitialized || !isEnabled) return;

			const suppData = supplementAudioData[supplementId];
			if (!suppData) return;

			const assetId =
				action === "apply" ? suppData.activationSound : suppData.effectSound;
			await playSFX(assetId);
		},
		[isInitialized, isEnabled, playSFX],
	);

	/**
	 * Trigger haptic feedback
	 */
	const triggerHaptic = useCallback(
		async (patternId: string) => {
			if (!isInitialized || !isEnabled) return;
			await audioSystem.triggerHaptic(patternId);
		},
		[isInitialized, isEnabled],
	);

	/**
	 * Quick haptic methods
	 */
	const triggerSuccessHaptic = useCallback(async () => {
		if (!isInitialized || !isEnabled) return;
		await audioSystem.triggerSuccessHaptic();
	}, [isInitialized, isEnabled]);

	const triggerErrorHaptic = useCallback(async () => {
		if (!isInitialized || !isEnabled) return;
		await audioSystem.triggerErrorHaptic();
	}, [isInitialized, isEnabled]);

	const triggerNavigationHaptic = useCallback(async () => {
		if (!isInitialized || !isEnabled) return;
		await audioSystem.triggerNavigationHaptic();
	}, [isInitialized, isEnabled]);

	/**
	 * Speak brain region information in Polish
	 */
	const speakBrainRegion = useCallback(
		async (regionId: string) => {
			if (!isInitialized || !isEnabled) return;

			// This would use the actual brain region data from the app
			const regionInfo = {
				name: "Hipokamp",
				description: "Kluczowy dla tworzenia pamięci i nawigacji przestrzennej",
				functions: [
					"Tworzenie pamięci",
					"Uczenie się",
					"Nawigacja przestrzenna",
				],
			};

			await audioSystem.voiceManager.speakBrainRegion(
				regionInfo.name,
				regionInfo.description,
				regionInfo.functions,
			);
		},
		[isInitialized, isEnabled],
	);

	/**
	 * Speak neurotransmitter information in Polish
	 */
	const speakNeurotransmitter = useCallback(
		async (neurotransmitterId: string) => {
			if (!isInitialized || !isEnabled) return;

			const ntData = neurotransmitterAudioData[neurotransmitterId];
			if (!ntData) return;

			await audioSystem.voiceManager.speakNeurotransmitter(
				neurotransmitterId,
				ntData.polishEducationalNarration,
				"Motywacja, nagroda, kontrola ruchowa",
			);
		},
		[isInitialized, isEnabled],
	);

	/**
	 * Speak supplement information in Polish
	 */
	const speakSupplement = useCallback(
		async (supplementId: string) => {
			if (!isInitialized || !isEnabled) return;

			const suppData = supplementAudioData[supplementId];
			if (!suppData) return;

			await audioSystem.voiceManager.speakSupplement(
				supplementId,
				suppData.polishEducationalDescription,
				["Neuroprotekcja", "Wzmacnianie funkcji poznawczych"],
			);
		},
		[isInitialized, isEnabled],
	);

	/**
	 * Speak educational content in Polish
	 */
	const speakEducationalContent = useCallback(
		async (title: string, content: string) => {
			if (!isInitialized || !isEnabled) return;

			await audioSystem.voiceManager.speakEducationalContent(title, content);
		},
		[isInitialized, isEnabled],
	);

	/**
	 * Update listener position for 3D spatial audio
	 */
	const updateListenerPosition = useCallback(
		(position: SpatialAudioPosition) => {
			if (spatialAudioSystemRef.current) {
				spatialAudioSystemRef.current.updateListenerFromCamera(position);
			}
		},
		[],
	);

	/**
	 * Update audio configuration
	 */
	const updateConfig = useCallback((newConfig: Partial<AudioConfig>) => {
		audioSystem.updateConfig(newConfig);
		setConfig(audioSystem.config);
	}, []);

	/**
	 * Shutdown audio system
	 */
	const shutdown = useCallback(async () => {
		try {
			await audioSystem.shutdown();
			setIsInitialized(false);
			initializedRef.current = false;
		} catch (error) {
			console.error("Error shutting down audio system:", error);
		}
	}, []);

	/**
	 * Test all audio systems
	 */
	const testAudio = useCallback(async () => {
		if (!isInitialized) {
			return { audio: false, haptics: false, voice: false };
		}

		let audio = false;
		let haptics = false;
		let voice = false;

		try {
			// Test basic audio playback
			await playSFX("ui-navigation-click");
			audio = true;
		} catch (error) {
			console.error("Audio test failed:", error);
		}

		try {
			// Test haptic feedback
			await triggerSuccessHaptic();
			haptics = true;
		} catch (error) {
			console.error("Haptics test failed:", error);
		}

		try {
			// Test voice synthesis
			await playVoice("Test systemu audio suplementor.", {
				context: "feedback",
			});
			voice = true;
		} catch (error) {
			console.error("Voice test failed:", error);
		}

		return { audio, haptics, voice };
	}, [isInitialized, playSFX, triggerSuccessHaptic, playVoice]);

	// Initialize on mount if autoInitialize is true
	useEffect(() => {
		if (autoInitialize && isEnabled && !initializedRef.current) {
			initialize();
		}

		// Cleanup on unmount
		return () => {
			if (initializedRef.current) {
				shutdown();
			}
		};
	}, [autoInitialize, isEnabled, initialize, shutdown]);

	// Update enabled state
	useEffect(() => {
		setIsEnabled(enabled);
	}, [enabled]);

	return {
		// System state
		isInitialized,
		isEnabled,
		config,

		// Audio controls
		playSFX,
		playMusic,
		playVoice,
		playAmbient,

		// Brain-specific audio
		playBrainRegionAudio,
		playNeurotransmitterAudio,
		playSupplementAudio,

		// Haptic feedback
		triggerHaptic,
		triggerSuccessHaptic,
		triggerErrorHaptic,
		triggerNavigationHaptic,

		// Educational content
		speakBrainRegion,
		speakNeurotransmitter,
		speakSupplement,
		speakEducationalContent,

		// 3D spatial audio
		spatialAudioSystem: spatialAudioSystemRef.current,
		updateListenerPosition,

		// System control
		updateConfig,
		shutdown,
		testAudio,
	};
}
