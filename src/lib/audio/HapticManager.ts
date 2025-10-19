/**
 * Haptic Feedback Manager for Suplementor
 * Provides vibration patterns and haptic feedback for mobile interactions
 */

import {
	HapticNotSupportedError,
	type HapticPattern,
	type HapticManager as IHapticManager,
	VibrationPattern,
} from "./types";

export class HapticManager implements IHapticManager {
	private _isSupported = false;
	private _patterns = new Map<string, HapticPattern>();
	private _isVibrating = false;
	private _currentVibrationId: number | null = null;

	get isSupported(): boolean {
		return this._isSupported;
	}

	get patterns(): Map<string, HapticPattern> {
		return this._patterns;
	}

	/**
	 * Initialize haptic feedback system
	 */
	async initialize(): Promise<void> {
		try {
			// Check if vibration API is supported
			if (typeof window === "undefined" || !("vibrate" in navigator)) {
				console.warn("Vibration API not supported");
				this._isSupported = false;
				return;
			}

			// Check if device actually supports vibration
			const canVibrate = "vibrate" in navigator;
			if (!canVibrate) {
				console.warn("Device does not support vibration");
				this._isSupported = false;
				return;
			}

			this._isSupported = true;

			// Initialize default haptic patterns
			this.initializeDefaultPatterns();
		} catch (error) {
			console.error("Failed to initialize haptic manager:", error);
			this._isSupported = false;
		}
	}

	/**
	 * Initialize default haptic patterns for different interaction types
	 */
	private initializeDefaultPatterns(): void {
		const defaultPatterns: HapticPattern[] = [
			{
				id: "success-light",
				name: "Success Light",
				polishName: "Sukces Lekki",
				pattern: [50, 50, 50],
				intensity: 0.3,
				duration: 150,
				category: "success",
			},
			{
				id: "success-medium",
				name: "Success Medium",
				polishName: "Sukces Średni",
				pattern: [100, 50, 100, 50, 100],
				intensity: 0.6,
				duration: 400,
				category: "success",
			},
			{
				id: "success-strong",
				name: "Success Strong",
				polishName: "Sukces Mocny",
				pattern: [200, 100, 200, 100, 200, 100, 200],
				intensity: 1.0,
				duration: 1000,
				category: "success",
			},
			{
				id: "error-light",
				name: "Error Light",
				polishName: "Błąd Lekki",
				pattern: [100, 50, 100, 50, 100],
				intensity: 0.4,
				duration: 350,
				category: "error",
			},
			{
				id: "error-medium",
				name: "Error Medium",
				polishName: "Błąd Średni",
				pattern: [150, 100, 150, 100, 150, 100, 150],
				intensity: 0.7,
				duration: 750,
				category: "error",
			},
			{
				id: "error-strong",
				name: "Error Strong",
				polishName: "Błąd Mocny",
				pattern: [200, 150, 200, 150, 200, 150, 200, 150, 200],
				intensity: 1.0,
				duration: 1350,
				category: "error",
			},
			{
				id: "navigation-light",
				name: "Navigation Light",
				polishName: "Nawigacja Lekka",
				pattern: [30, 50, 30],
				intensity: 0.2,
				duration: 110,
				category: "navigation",
			},
			{
				id: "navigation-medium",
				name: "Navigation Medium",
				polishName: "Nawigacja Średnia",
				pattern: [50, 30, 50, 30, 50],
				intensity: 0.4,
				duration: 210,
				category: "navigation",
			},
			{
				id: "interaction-select",
				name: "Selection",
				polishName: "Wybór",
				pattern: [40, 30, 40],
				intensity: 0.3,
				duration: 110,
				category: "interaction",
			},
			{
				id: "interaction-hover",
				name: "Hover",
				polishName: "Najechanie",
				pattern: [20],
				intensity: 0.1,
				duration: 20,
				category: "interaction",
			},
			{
				id: "brain-region-select",
				name: "Brain Region Selection",
				polishName: "Wybór Regionu Mózgu",
				pattern: [60, 40, 60, 40, 60],
				intensity: 0.5,
				duration: 260,
				category: "interaction",
			},
			{
				id: "neurotransmitter-activate",
				name: "Neurotransmitter Activation",
				polishName: "Aktywacja Neuroprzekaźnika",
				pattern: [80, 60, 80, 60, 80, 60, 80],
				intensity: 0.7,
				duration: 500,
				category: "interaction",
			},
			{
				id: "supplement-apply",
				name: "Supplement Application",
				polishName: "Zastosowanie Suplementu",
				pattern: [100, 80, 100, 80, 100, 80, 100, 80, 100],
				intensity: 0.8,
				duration: 720,
				category: "interaction",
			},
			{
				id: "tutorial-step",
				name: "Tutorial Step",
				polishName: "Krok Tutoriala",
				pattern: [40, 30, 40, 30, 40, 30, 40],
				intensity: 0.4,
				duration: 250,
				category: "info",
			},
			{
				id: "quiz-correct",
				name: "Quiz Correct",
				polishName: "Quiz Poprawna Odpowiedź",
				pattern: [60, 40, 60, 40, 60, 40, 60, 40, 60],
				intensity: 0.6,
				duration: 420,
				category: "success",
			},
			{
				id: "quiz-incorrect",
				name: "Quiz Incorrect",
				polishName: "Quiz Błędna Odpowiedź",
				pattern: [150, 100, 150, 100, 150],
				intensity: 0.5,
				duration: 550,
				category: "error",
			},
			{
				id: "system-ready",
				name: "System Ready",
				polishName: "System Gotowy",
				pattern: [100, 50, 100, 50, 100, 50, 100],
				intensity: 0.6,
				duration: 450,
				category: "info",
			},
		];

		// Register all default patterns
		defaultPatterns.forEach((pattern) => {
			this._patterns.set(pattern.id, pattern);
		});
	}

	/**
	 * Trigger haptic feedback using a predefined pattern
	 */
	async vibrate(pattern: HapticPattern): Promise<void> {
		if (!this._isSupported) {
			throw new HapticNotSupportedError();
		}

		try {
			// Stop any current vibration
			if (this._isVibrating) {
				this.stop();
			}

			// Apply intensity scaling to pattern
			const scaledPattern = this.scalePatternIntensity(pattern);

			// Trigger vibration
			this._currentVibrationId = navigator.vibrate(scaledPattern);
			this._isVibrating = true;

			// Auto-stop after pattern duration
			setTimeout(() => {
				this._isVibrating = false;
				this._currentVibrationId = null;
			}, pattern.duration);
		} catch (error) {
			console.error("Failed to trigger haptic pattern:", error);
			this._isVibrating = false;
			this._currentVibrationId = null;
		}
	}

	/**
	 * Trigger custom vibration pattern
	 */
	async vibrateCustom(
		pattern: number | number[],
		intensity = 1.0,
	): Promise<void> {
		if (!this._isSupported) {
			throw new HapticNotSupportedError();
		}

		try {
			// Stop any current vibration
			if (this._isVibrating) {
				this.stop();
			}

			// Scale pattern by intensity
			let scaledPattern: number | number[];
			if (typeof pattern === "number") {
				scaledPattern = pattern * intensity;
			} else {
				scaledPattern = pattern.map((duration) => duration * intensity);
			}

			// Trigger vibration
			this._currentVibrationId = navigator.vibrate(scaledPattern);
			this._isVibrating = true;
		} catch (error) {
			console.error("Failed to trigger custom haptic pattern:", error);
			this._isVibrating = false;
			this._currentVibrationId = null;
		}
	}

	/**
	 * Stop current vibration
	 */
	stop(): void {
		if (this._isSupported && this._isVibrating) {
			navigator.vibrate(0);
			this._isVibrating = false;
			this._currentVibrationId = null;
		}
	}

	/**
	 * Check if currently vibrating
	 */
	isVibrating(): boolean {
		return this._isVibrating;
	}

	/**
	 * Get all patterns for a specific category
	 */
	getPatternByCategory(category: string): HapticPattern[] {
		return Array.from(this._patterns.values()).filter(
			(pattern) => pattern.category === category,
		);
	}

	/**
	 * Get pattern by ID
	 */
	getPattern(id: string): HapticPattern | undefined {
		return this._patterns.get(id);
	}

	/**
	 * Add custom haptic pattern
	 */
	addPattern(pattern: HapticPattern): void {
		this._patterns.set(pattern.id, pattern);
	}

	/**
	 * Remove haptic pattern
	 */
	removePattern(id: string): boolean {
		return this._patterns.delete(id);
	}

	/**
	 * Scale pattern intensity based on user preferences and device capabilities
	 */
	private scalePatternIntensity(pattern: HapticPattern): number | number[] {
		// Get device vibration capabilities
		const deviceIntensity = this.getDeviceVibrationIntensity();

		// Scale pattern by intensity and device capabilities
		const scaleFactor = pattern.intensity * deviceIntensity;

		if (typeof pattern.pattern === "number") {
			return pattern.pattern * scaleFactor;
		}
		return pattern.pattern.map((duration) => duration * scaleFactor);
	}

	/**
	 * Estimate device vibration intensity (0-1)
	 * This is a heuristic based on device type and user agent
	 */
	private getDeviceVibrationIntensity(): number {
		if (typeof navigator === "undefined") {
			return 0.5;
		}

		const userAgent = navigator.userAgent.toLowerCase();

		// Mobile devices typically have better vibration
		if (/mobile|android|iphone|ipad|ipod/.test(userAgent)) {
			// iOS devices have more precise vibration control
			if (/iphone|ipad|ipod/.test(userAgent)) {
				return 0.8;
			}
			// Android devices vary, but generally good
			if (/android/.test(userAgent)) {
				return 0.7;
			}
			return 0.6;
		}

		// Desktop/touchpad vibration is usually weaker
		return 0.3;
	}

	/**
	 * Test if haptic feedback is working
	 */
	async testHaptics(): Promise<boolean> {
		if (!this._isSupported) {
			return false;
		}

		try {
			// Use a simple test pattern
			await this.vibrateCustom([100, 50, 100], 0.5);
			return true;
		} catch (error) {
			console.error("Haptic test failed:", error);
			return false;
		}
	}

	/**
	 * Get haptic capabilities info
	 */
	getCapabilities(): {
		supported: boolean;
		estimatedIntensity: number;
		patternsCount: number;
		categories: string[];
	} {
		return {
			supported: this._isSupported,
			estimatedIntensity: this.getDeviceVibrationIntensity(),
			patternsCount: this._patterns.size,
			categories: Array.from(
				new Set(this._patterns.values()).map((p) => p.category),
			),
		};
	}

	/**
	 * Quick access methods for common haptic patterns
	 */
	async triggerSuccessHaptic(
		intensity: "light" | "medium" | "strong" = "medium",
	): Promise<void> {
		const patternId = `success-${intensity}`;
		const pattern = this._patterns.get(patternId);
		if (pattern) {
			await this.vibrate(pattern);
		}
	}

	async triggerErrorHaptic(
		intensity: "light" | "medium" | "strong" = "medium",
	): Promise<void> {
		const patternId = `error-${intensity}`;
		const pattern = this._patterns.get(patternId);
		if (pattern) {
			await this.vibrate(pattern);
		}
	}

	async triggerNavigationHaptic(
		intensity: "light" | "medium" = "light",
	): Promise<void> {
		const patternId = `navigation-${intensity}`;
		const pattern = this._patterns.get(patternId);
		if (pattern) {
			await this.vibrate(pattern);
		}
	}

	async triggerSelectionHaptic(): Promise<void> {
		const pattern = this._patterns.get("interaction-select");
		if (pattern) {
			await this.vibrate(pattern);
		}
	}

	async triggerBrainRegionSelectHaptic(): Promise<void> {
		const pattern = this._patterns.get("brain-region-select");
		if (pattern) {
			await this.vibrate(pattern);
		}
	}

	async triggerNeurotransmitterHaptic(): Promise<void> {
		const pattern = this._patterns.get("neurotransmitter-activate");
		if (pattern) {
			await this.vibrate(pattern);
		}
	}

	async triggerSupplementHaptic(): Promise<void> {
		const pattern = this._patterns.get("supplement-apply");
		if (pattern) {
			await this.vibrate(pattern);
		}
	}

	async triggerQuizCorrectHaptic(): Promise<void> {
		const pattern = this._patterns.get("quiz-correct");
		if (pattern) {
			await this.vibrate(pattern);
		}
	}

	async triggerQuizIncorrectHaptic(): Promise<void> {
		const pattern = this._patterns.get("quiz-incorrect");
		if (pattern) {
			await this.vibrate(pattern);
		}
	}

	async triggerSystemReadyHaptic(): Promise<void> {
		const pattern = this._patterns.get("system-ready");
		if (pattern) {
			await this.vibrate(pattern);
		}
	}
}

// Singleton instance for global use
export const hapticManager = new HapticManager();
