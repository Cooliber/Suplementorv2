// Body Systems Interactive Diagrams - Main exports

// Core components
export { InteractiveOrgan } from "./InteractiveOrgan";
export { BodySystemsViewer } from "./BodySystemsViewer";
export { DiagramViewer } from "./DiagramViewer";

// System-specific components
export { SkeletalSystem } from "./SkeletalSystem";
export { MuscularSystem } from "./MuscularSystem";
export { RespiratorySystem } from "./RespiratorySystem";

// Mobile and accessibility components
export {
	MobileControls,
	useMobileDetection,
	TouchGestureHandler,
} from "./MobileControls";

export {
	AccessibilityControls,
	useScreenReader,
	useKeyboardNavigation,
	useFocusManagement,
	ScreenReaderAnnouncer,
	accessibilityStyles,
} from "./AccessibilityControls";

// Types and data
export type {
	AnatomicalStructure,
	BodySystem,
	OrganDetail,
	SupplementEffect,
	AnimationConfig,
	InteractionConfig,
	AccessibilityConfig,
	ViewMode,
	CrossSection,
} from "../../types/body-systems";

export {
	BODY_SYSTEMS,
	DEFAULT_VIEW_MODES,
	ANIMATION_PRESETS,
} from "../../types/body-systems";

// Utility hooks and functions
export const useBodySystemsInteraction = () => {
	// Hook for managing body systems interactions
	// TODO: Implement interaction management logic
};

export const useSupplementIntegration = () => {
	// Hook for integrating supplement data with body systems
	// TODO: Implement supplement integration logic
};

export const useEducationalContent = () => {
	// Hook for managing educational content and overlays
	// TODO: Implement educational content management
};
