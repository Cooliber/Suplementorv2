/**
 * Audio Components Index
 * Exports all audio-related components for the suplementor app
 */

export { AudioDemo } from "./AudioDemo";
export { default as AudioDemo } from "./AudioDemo";

// Re-export types for convenience
export type {
	AudioConfig,
	AudioAsset,
	SpatialAudioPosition,
	SpatialAudioOptions,
	SoundInstance,
	HapticPattern,
	VibrationPattern,
	VoiceSynthesisOptions,
	AudioContextManager,
	AudioAssetManager,
	SoundManager,
	VoiceManager,
	HapticManager,
	AudioSystem,
	BrainRegionAudioData,
	NeurotransmitterAudioData,
	SupplementAudioData,
	AudioTheme,
	AudioEvent,
	AudioEventHandler,
} from "@/lib/audio/types";

// Re-export main audio system classes
export {
	AudioContextManager,
	audioContextManager,
} from "@/lib/audio/AudioContextManager";
export { HapticManager, hapticManager } from "@/lib/audio/HapticManager";
export { VoiceManager, voiceManager } from "@/lib/audio/VoiceManager";
export { AudioSystem, audioSystem } from "@/lib/audio/AudioSystem";
export {
	SpatialAudioSystem,
	createSpatialAudioSystem,
} from "@/lib/audio/SpatialAudioSystem";
export {
	MobileAudioOptimizer,
	createMobileAudioOptimizer,
} from "@/lib/audio/MobileAudioOptimizer";

// Re-export audio assets and data
export {
	brainRegionAudioAssets,
	neurotransmitterAudioAssets,
	supplementAudioAssets,
	uiAudioAssets,
	educationalAudioAssets,
	musicAudioAssets,
	allAudioAssets,
	brainRegionAudioData,
	neurotransmitterAudioData,
	supplementAudioData,
	audioCategories,
	audioTags,
} from "@/lib/audio/audioAssets";

// Re-export hook
export { useSuplementorAudio } from "@/hooks/useSuplementorAudio";
