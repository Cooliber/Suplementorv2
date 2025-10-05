/**
 * BrainSupplementCard Component Types
 * Educational component for displaying brain supplement information
 * with Polish localization and interactive brain region visualization
 */

import type { PolishMedicalTerm } from "@/lib/localization/types";

// Brain region data structure
export interface BrainRegion {
	id: string;
	name: string;
	polishName: string;
	description: string;
	polishDescription: string;
	coordinates: {
		x: number;
		y: number;
		z?: number;
	};
	functions: string[];
	polishFunctions: string[];
	supplementEffects: SupplementEffect[];
	color: string;
	size: "small" | "medium" | "large";
}

// Supplement effect on brain regions
export interface SupplementEffect {
	type: "enhancement" | "protection" | "modulation" | "restoration";
	polishType: string;
	strength: "weak" | "moderate" | "strong" | "very-strong";
	mechanism: string;
	polishMechanism: string;
	evidenceLevel: "weak" | "moderate" | "strong";
	duration: string;
	polishDuration: string;
}

// Main supplement data interface
export interface BrainSupplementData {
	id: string;
	name: string;
	polishName: string;
	scientificName?: string;
	category:
		| "vitamin"
		| "mineral"
		| "herb"
		| "amino-acid"
		| "nootropic"
		| "adaptogen";
	polishCategory: string;

	// Description and educational content
	description: string;
	polishDescription: string;
	educationalContent: {
		howItWorks: string;
		polishHowItWorks: string;
		researchSummary: string;
		polishResearchSummary: string;
		safetyProfile: string;
		polishSafetyProfile: string;
	};

	// Brain region interactions
	primaryBrainRegions: BrainRegion[];
	secondaryBrainRegions: BrainRegion[];
	affectedSystems: string[];
	polishAffectedSystems: string[];

	// Clinical data
	evidenceLevel: "weak" | "moderate" | "strong" | "very-strong";
	studyCount: number;
	participantCount: number;
	effectSize: number;

	// Dosage and administration
	recommendedDosage: {
		min: number;
		max: number;
		unit: string;
		frequency: string;
		polishFrequency: string;
		timing: string[];
		withFood: boolean;
	};

	// Safety information
	contraindications: string[];
	polishContraindications: string[];
	sideEffects: {
		common: string[];
		uncommon: string[];
		rare: string[];
	};
	interactions: string[];
	polishInteractions: string[];

	// Educational metadata
	difficultyLevel: "beginner" | "intermediate" | "advanced";
	learningObjectives: string[];
	polishLearningObjectives: string[];
	relatedTopics: string[];
	polishRelatedTopics: string[];

	// Media and visuals
	imageUrl?: string;
	brainVisualizationData?: {
		nodes: Array<{
			id: string;
			regionId: string;
			intensity: number;
			color: string;
		}>;
		connections: Array<{
			from: string;
			to: string;
			strength: number;
		}>;
	};
}

// Component props interface
export interface BrainSupplementCardProps {
	// Core data
	supplement: BrainSupplementData;
	variant?: "default" | "compact" | "detailed" | "educational";
	size?: "small" | "medium" | "large";

	// Interactive features
	interactive?: boolean;
	showBrainVisualization?: boolean;
	showProgressTracking?: boolean;
	allowBookmark?: boolean;

	// Polish localization
	language?: "pl" | "en";
	enableMedicalTerms?: boolean;
	validatePolishChars?: boolean;

	// Accessibility
	ariaLabel?: string;
	ariaDescription?: string;
	highContrast?: boolean;
	reducedMotion?: boolean;

	// Event handlers
	onRegionClick?: (region: BrainRegion) => void;
	onSupplementClick?: (supplement: BrainSupplementData) => void;
	onBookmark?: (supplementId: string) => void;
	onProgressUpdate?: (progress: number) => void;

	// Customization
	className?: string;
	style?: React.CSSProperties;
	theme?: "light" | "dark" | "auto";

	// Performance
	lazyLoad?: boolean;
	preloadImages?: boolean;

	// Testing
	"data-testid"?: string;
}

// Component state interface
export interface BrainSupplementCardState {
	selectedRegion: BrainRegion | null;
	isBookmarked: boolean;
	progress: number;
	isLoading: boolean;
	error: string | null;
	language: "pl" | "en";
	showDetails: boolean;
	activeTab: "overview" | "brain-regions" | "research" | "safety";
}

// Brain visualization props
export interface BrainVisualizationProps {
	brainRegions: BrainRegion[];
	selectedRegion?: BrainRegion | null;
	interactive: boolean;
	width?: number;
	height?: number;
	showLabels?: boolean;
	animationDuration?: number;
	onRegionSelect?: (region: BrainRegion) => void;
	className?: string;
}

// Progress tracking interface
export interface ProgressTrackingData {
	supplementId: string;
	userId?: string;
	progress: number;
	completedSections: string[];
	timeSpent: number;
	lastAccessed: Date;
	notes?: string;
	polishNotes?: string;
}

// Localization context
export interface LocalizationContext {
	t: (key: string, fallback?: string) => string;
	formatMedicalTerm: (english: string, polish: string) => string;
	validatePolishText: (text: string) => {
		isValid: boolean;
		errors: string[];
		suggestions: string[];
	};
	language: "pl" | "en";
	medicalTerms: Map<string, PolishMedicalTerm>;
}

// Accessibility configuration
export interface AccessibilityConfig {
	enableScreenReader: boolean;
	highContrast: boolean;
	reducedMotion: boolean;
	keyboardNavigation: boolean;
	focusManagement: boolean;
	ariaLabels: boolean;
	liveRegions: boolean;
}

// Performance metrics
export interface PerformanceMetrics {
	loadTime: number;
	renderTime: number;
	memoryUsage: number;
	bundleSize: number;
	accessibilityScore: number;
}

// Component validation
export interface ComponentValidation {
	isValid: boolean;
	errors: string[];
	warnings: string[];
	polishCharValidation: {
		isValid: boolean;
		missingChars: string[];
		invalidSequences: string[];
	};
	accessibilityValidation: {
		score: number;
		issues: string[];
		passed: string[];
	};
	performanceValidation: {
		score: number;
		optimizations: string[];
		recommendations: string[];
	};
}

// Export utility types
export type BrainRegionId = string;
export type SupplementId = string;
export type EffectType = SupplementEffect["type"];
export type EvidenceLevel = BrainSupplementData["evidenceLevel"];
export type ComponentVariant = BrainSupplementCardProps["variant"];
export type ComponentSize = BrainSupplementCardProps["size"];
