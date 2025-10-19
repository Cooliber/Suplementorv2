/**
 * React Hook for Gesture Manager Integration
 * Provides easy-to-use hook for integrating gesture controls with React components
 */

import { useCallback, useEffect, useRef, useState } from "react";
import type { Camera, Group } from "three";
import type {
	BrainRegion,
	GestureEvent,
	GestureHandlers,
	GestureTutorial,
	UseGestureReturn,
} from "../types/gestures";
import { GestureManager } from "./GestureManager";

export interface UseGestureManagerOptions {
	camera?: Camera;
	scene?: Group;
	brainRegions?: BrainRegion[];
	enabled?: boolean;
	language?: "pl" | "en";
	learningMode?: boolean;
	onGestureStart?: (event: GestureEvent) => void;
	onGestureChange?: (event: GestureEvent) => void;
	onGestureEnd?: (event: GestureEvent) => void;
	onRegionSelect?: (regionId: string) => void;
	onTutorialComplete?: (tutorialId: string) => void;
}

export function useGestureManager(
	options: UseGestureManagerOptions = {},
): UseGestureReturn {
	const {
		camera,
		scene,
		brainRegions = [],
		enabled = true,
		language = "pl",
		learningMode = false,
		onGestureStart,
		onGestureChange,
		onGestureEnd,
		onRegionSelect,
		onTutorialComplete,
	} = options;

	// Refs for persistent objects
	const gestureManagerRef = useRef<GestureManager | null>(null);
	const cameraRef = useRef<Camera | null>(camera || null);
	const sceneRef = useRef<Group | null>(scene || null);

	// State
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [tutorials, setTutorials] = useState<GestureTutorial[]>([]);

	// Update refs when props change
	useEffect(() => {
		cameraRef.current = camera || null;
		sceneRef.current = scene || null;
	}, [camera, scene]);

	// Initialize gesture manager
	useEffect(() => {
		if (!enabled || (!cameraRef.current && !sceneRef.current)) {
			setIsLoading(false);
			return;
		}

		const initializeGestureManager = async () => {
			try {
				setIsLoading(true);
				setError(null);

				// Create gesture manager instance
				const manager = new GestureManager(
					cameraRef.current!,
					sceneRef.current!,
					brainRegions,
				);

				// Set up event handlers
				if (onGestureStart) manager.onGestureStart = onGestureStart;
				if (onGestureChange) manager.onGestureChange = onGestureChange;
				if (onGestureEnd) manager.onGestureEnd = onGestureEnd;

				// Set language
				manager.setLanguage(language);

				// Initialize
				await manager.initialize();

				gestureManagerRef.current = manager;

				// Get available tutorials
				if (manager.educationalFeatures) {
					const availableTutorials =
						manager.educationalFeatures.getAvailableTutorials();
					setTutorials(availableTutorials);
				}

				// Enable learning mode if requested
				if (learningMode) {
					manager.educationalFeatures.setLearningMode(true);
				}

				setIsLoading(false);
			} catch (err) {
				console.error("Failed to initialize gesture manager:", err);
				setError(err instanceof Error ? err.message : "Unknown error");
				setIsLoading(false);
			}
		};

		initializeGestureManager();

		// Cleanup function
		return () => {
			if (gestureManagerRef.current) {
				gestureManagerRef.current.dispose();
				gestureManagerRef.current = null;
			}
		};
	}, [enabled, camera, scene, brainRegions.length, language, learningMode]);

	// Gesture event handlers for React integration
	const handlers: GestureHandlers = {
		onGestureStart: useCallback(
			(event: GestureEvent) => {
				onGestureStart?.(event);
			},
			[onGestureStart],
		),

		onGestureChange: useCallback(
			(event: GestureEvent) => {
				onGestureChange?.(event);
			},
			[onGestureChange],
		),

		onGestureEnd: useCallback(
			(event: GestureEvent) => {
				onGestureEnd?.(event);
			},
			[onGestureEnd],
		),

		onGestureSequence: useCallback((sequence) => {
			console.log("Gesture sequence completed:", sequence);
		}, []),

		onTutorialStep: useCallback((step) => {
			console.log("Tutorial step reached:", step);
		}, []),

		onProficiencyUpdate: useCallback((gestureType, proficiency) => {
			console.log(`Proficiency updated for ${gestureType}:`, proficiency);
		}, []),
	};

	// Helper functions
	const startTutorial = useCallback(
		async (tutorialId: string): Promise<void> => {
			if (!gestureManagerRef.current) return;

			try {
				await gestureManagerRef.current.startTutorial(tutorialId);
			} catch (err) {
				console.error("Failed to start tutorial:", err);
				setError(
					err instanceof Error ? err.message : "Failed to start tutorial",
				);
			}
		},
		[],
	);

	const endTutorial = useCallback((): void => {
		if (!gestureManagerRef.current) return;
		gestureManagerRef.current.endTutorial();
	}, []);

	const getGestureProficiency = useCallback((gestureType: any): number => {
		if (!gestureManagerRef.current) return 0;
		return gestureManagerRef.current.getGestureProficiency(gestureType);
	}, []);

	const getLocalizedString = useCallback(
		(key: string, params?: Record<string, string>): string => {
			if (!gestureManagerRef.current) return key;
			return gestureManagerRef.current.getLocalizedString(key, params);
		},
		[],
	);

	const getPerformanceStats = useCallback(() => {
		if (!gestureManagerRef.current) return null;
		return gestureManagerRef.current.getPerformanceStats();
	}, []);

	const optimizeForDevice = useCallback((deviceType: string): void => {
		if (!gestureManagerRef.current) return;
		gestureManagerRef.current.optimizeForDevice(deviceType);
	}, []);

	// Get current state from gesture manager
	const state = gestureManagerRef.current?.state || {
		isActive: false,
		startTime: 0,
		currentTime: 0,
		duration: 0,
		velocity: { x: 0, y: 0 },
		acceleration: { x: 0, y: 0 },
		pressure: 0,
		camera: {
			position: { x: 5, y: 2, z: 5 },
			target: { x: 0, y: 0, z: 0 },
			distance: 7,
			angle: { x: 0, y: Math.PI / 4 },
		},
		controls: {
			orbit: true,
			zoom: true,
			pan: true,
			rotate: true,
			focus: true,
		},
		constraints: {
			minDistance: 1,
			maxDistance: 50,
			minPolarAngle: 0,
			maxPolarAngle: Math.PI,
			enableDamping: true,
			dampingFactor: 0.05,
		},
		selectedRegions: [],
		highlightedRegions: [],
		dissectedRegions: [],
		visibleLayers: ["surface"],
		transparency: {},
		dissection: {
			active: false,
			progress: 0,
			animationSpeed: 1,
		},
		learningMode: false,
		currentLesson: null,
		completedGestures: [],
		proficiency: {},
		tutorials: {
			enabled: true,
			currentStep: 0,
			autoAdvance: true,
		},
	};

	return {
		gestureManager: gestureManagerRef.current,
		handlers,
		state,
		tutorials,
		isLoading,
		error,
		// Helper functions
		startTutorial,
		endTutorial,
		getGestureProficiency,
		getLocalizedString,
		getPerformanceStats,
		optimizeForDevice,
	};
}
