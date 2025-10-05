/**
 * BrainSupplementCard Component - Public API
 * Educational component for displaying brain supplement information
 * with Polish localization and interactive brain region visualization
 */

// Main component export
export { BrainSupplementCard, default } from "./BrainSupplementCard";

// Type exports
export type {
	BrainSupplementCardProps,
	BrainSupplementCardState,
	BrainSupplementData,
	BrainRegion,
	SupplementEffect,
	LocalizationContext,
	AccessibilityConfig,
	PerformanceMetrics,
	ComponentValidation,
	BrainRegionId,
	SupplementId,
	EffectType,
	EvidenceLevel,
	ComponentVariant,
	ComponentSize,
	ProgressTrackingData,
} from "./types";

// Re-export commonly used types for convenience
export type { PolishMedicalTerm } from "@/lib/localization/types";
