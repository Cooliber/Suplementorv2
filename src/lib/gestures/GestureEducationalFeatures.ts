/**
 * Educational Gesture Features
 * Implements learning mode, tutorials, and progress tracking for gesture-based 3D brain model interaction
 */

import {
	type EducationalState,
	GestureAction,
	type GestureCondition,
	type GestureEvent,
	GestureSequence,
	type GestureTutorial,
	type GestureType,
	type PolishGestureLabels,
	type TutorialStep,
} from "../types/gestures";

export class GestureEducationalFeatures {
	private state: EducationalState;
	private tutorials: Map<string, GestureTutorial> = new Map();
	private gestureHistory: Map<GestureType, number[]> = new Map(); // Track usage frequency
	private proficiencyScores: Map<string, number> = new Map(); // Track user proficiency
	private polishLabels: PolishGestureLabels;
	private eventListeners: Map<string, ((event: any) => void)[]> = new Map();

	constructor(polishLabels: PolishGestureLabels) {
		this.polishLabels = polishLabels;
		this.state = {
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

		this.initializeDefaultTutorials();
		this.loadProgressFromStorage();
	}

	/**
	 * Initialize default gesture tutorials
	 */
	private initializeDefaultTutorials(): void {
		const tutorials: GestureTutorial[] = [
			{
				id: "basic-navigation",
				name: "Basic Navigation",
				polishName: "Podstawowa nawigacja",
				description: "Learn basic camera controls and model interaction",
				polishDescription:
					"Naucz się podstawowych kontroli kamery i interakcji z modelem",
				category: "basic",
				difficulty: 1,
				steps: [
					{
						id: "tap-select",
						instruction: "Tap on brain regions to select them",
						polishInstruction: "Dotknij regionów mózgu, aby je wybrać",
						gesture: "tap",
						target: "brain-region",
						successCriteria: [
							{ type: "duration", operator: "less", value: 500 },
							{ type: "distance", operator: "less", value: 50 },
						],
						hints: ["Try tapping gently on different colored areas"],
						polishHints: [
							"Spróbuj delikatnie dotknąć różnych kolorowych obszarów",
						],
						visualGuide: {
							showPath: false,
							showTarget: true,
							color: "#4F46E5",
						},
					},
					{
						id: "pinch-zoom",
						instruction: "Use pinch gesture to zoom in and out",
						polishInstruction:
							"Użyj gestu szczypania, aby przybliżyć i oddalić",
						gesture: "pinch",
						target: "camera",
						successCriteria: [
							{ type: "distance", operator: "greater", value: 100 },
							{ type: "finger-count", operator: "equal", value: 2 },
						],
						hints: [
							"Place two fingers on screen and move them apart to zoom in",
						],
						polishHints: [
							"Umieść dwa palce na ekranie i rozsuń je, aby przybliżyć",
						],
						visualGuide: {
							showPath: true,
							showTarget: false,
							color: "#10B981",
						},
					},
					{
						id: "pan-orbit",
						instruction: "Pan with one finger to orbit around the model",
						polishInstruction:
							"Przesuń jednym palcem, aby obracać się wokół modelu",
						gesture: "pan",
						target: "camera",
						successCriteria: [
							{ type: "distance", operator: "greater", value: 200 },
							{ type: "velocity", operator: "greater", value: 0.5 },
						],
						hints: ["Drag your finger across the screen to rotate the view"],
						polishHints: ["Przeciągnij palcem po ekranie, aby obrócić widok"],
						visualGuide: {
							showPath: true,
							showTarget: false,
							color: "#F59E0B",
						},
					},
				],
				prerequisites: [],
				rewards: {
					points: 100,
					badges: ["Pierwszy krok", "Eksplorer mózgu"],
				},
			},
			{
				id: "advanced-manipulation",
				name: "Advanced Manipulation",
				polishName: "Zaawansowana manipulacja",
				description: "Learn dissection and multi-region selection",
				polishDescription: "Naucz się sekcji i wyboru wielu regionów",
				category: "advanced",
				difficulty: 3,
				steps: [
					{
						id: "long-press-dissect",
						instruction: "Long press on a region to start dissection",
						polishInstruction: "Przytrzymaj region, aby rozpocząć sekcję",
						gesture: "long-press",
						target: "brain-region",
						successCriteria: [
							{ type: "duration", operator: "greater", value: 1000 },
							{ type: "pressure", operator: "greater", value: 0.7 },
						],
						hints: ["Press and hold firmly on a brain region"],
						polishHints: ["Naciśnij i przytrzymaj mocno na regionie mózgu"],
						visualGuide: {
							showPath: false,
							showTarget: true,
							color: "#EF4444",
						},
					},
					{
						id: "multi-select",
						instruction: "Select multiple regions using multi-tap",
						polishInstruction:
							"Wybierz wiele regionów używając wielokrotnego dotyku",
						gesture: "tap",
						target: "brain-regions",
						successCriteria: [
							{ type: "finger-count", operator: "equal", value: 1 },
						],
						hints: ["Tap multiple regions while holding shift (on desktop)"],
						polishHints: [
							"Dotknij wielu regionów, przytrzymując shift (na komputerze)",
						],
						visualGuide: {
							showPath: false,
							showTarget: true,
							color: "#8B5CF6",
						},
					},
				],
				prerequisites: ["basic-navigation"],
				rewards: {
					points: 250,
					badges: ["Chirurg mózgu", "Anatom"],
				},
			},
			{
				id: "expert-techniques",
				name: "Expert Techniques",
				polishName: "Techniki eksperckie",
				description: "Master complex gesture combinations and sequences",
				polishDescription: "Opanuj złożone kombinacje gestów i sekwencje",
				category: "expert",
				difficulty: 5,
				steps: [
					{
						id: "gesture-sequence",
						instruction: "Perform gesture sequence: tap → pinch → rotate",
						polishInstruction:
							"Wykonaj sekwencję gestów: dotknij → szczypnij → obróć",
						gesture: "tap",
						target: "sequence-start",
						successCriteria: [
							{ type: "duration", operator: "between", value: [100, 500] },
						],
						hints: ["Complete the sequence within 3 seconds"],
						polishHints: ["Ukończ sekwencję w ciągu 3 sekund"],
						visualGuide: {
							showPath: true,
							showTarget: true,
							color: "#EC4899",
						},
					},
				],
				prerequisites: ["basic-navigation", "advanced-manipulation"],
				rewards: {
					points: 500,
					badges: ["Mistrz gestów", "Neurochirurg"],
				},
			},
		];

		tutorials.forEach((tutorial) => {
			this.tutorials.set(tutorial.id, tutorial);
		});
	}

	/**
	 * Start learning mode and tutorial
	 */
	async startTutorial(tutorialId: string): Promise<boolean> {
		const tutorial = this.tutorials.get(tutorialId);
		if (!tutorial) {
			console.warn(`Tutorial ${tutorialId} not found`);
			return false;
		}

		// Check prerequisites
		for (const prereq of tutorial.prerequisites) {
			if (!this.state.completedGestures.includes(prereq)) {
				console.warn(`Prerequisites not met for tutorial ${tutorialId}`);
				return false;
			}
		}

		this.state.learningMode = true;
		this.state.currentLesson = tutorialId;
		this.state.tutorials.currentStep = 0;

		// Show tutorial UI
		this.showTutorialUI(tutorial);

		// Start first step
		await this.startTutorialStep(tutorial.steps[0]);

		const event = new CustomEvent("tutorialStarted", {
			detail: { tutorialId, tutorial },
		});
		window.dispatchEvent(event);

		return true;
	}

	/**
	 * Start a specific tutorial step
	 */
	private async startTutorialStep(step: TutorialStep): Promise<void> {
		// Show visual guide
		if (step.visualGuide) {
			this.showVisualGuide(step);
		}

		// Show instruction
		this.showStepInstruction(step);

		// Set up gesture monitoring for this step
		this.monitorStepGesture(step);

		const event = new CustomEvent("tutorialStepStarted", {
			detail: { step },
		});
		window.dispatchEvent(event);
	}

	/**
	 * Monitor gestures for tutorial step completion
	 */
	private monitorStepGesture(step: TutorialStep): void {
		const checkGesture = (event: GestureEvent) => {
			if (this.evaluateStepSuccess(event, step)) {
				this.completeTutorialStep(step);
				window.removeEventListener("gesture", checkGesture);
			}
		};

		window.addEventListener("gesture", checkGesture);
	}

	/**
	 * Evaluate if a gesture completes the current step
	 */
	private evaluateStepSuccess(
		event: GestureEvent,
		step: TutorialStep,
	): boolean {
		if (event.type !== step.gesture) return false;

		return step.successCriteria.every((condition) =>
			this.checkGestureCondition(event, condition),
		);
	}

	/**
	 * Check if gesture meets a specific condition
	 */
	private checkGestureCondition(
		event: GestureEvent,
		condition: GestureCondition,
	): boolean {
		const value = this.getConditionValue(event, condition.type);

		switch (condition.operator) {
			case "greater":
				return value > condition.value;
			case "less":
				return value < condition.value;
			case "equal":
				return Math.abs(value - condition.value) <= (condition.tolerance || 0);
			case "between": {
				const [min, max] = condition.value as number[];
				return value >= min && value <= max;
			}
			default:
				return false;
		}
	}

	/**
	 * Get value for condition checking
	 */
	private getConditionValue(event: GestureEvent, type: string): number {
		switch (type) {
			case "duration":
				return event.state.duration;
			case "distance":
				return event.data.translation
					? Math.sqrt(
							event.data.translation.x ** 2 + event.data.translation.y ** 2,
						)
					: 0;
			case "velocity":
				return event.data.velocity
					? Math.sqrt(event.data.velocity.x ** 2 + event.data.velocity.y ** 2)
					: 0;
			case "pressure":
				return event.data.pressure || 0;
			case "finger-count":
				return event.data.touchCount || 1;
			default:
				return 0;
		}
	}

	/**
	 * Complete a tutorial step
	 */
	private async completeTutorialStep(step: TutorialStep): Promise<void> {
		const tutorial = this.tutorials.get(this.state.currentLesson!);
		if (!tutorial) return;

		// Update proficiency
		this.updateGestureProficiency(step.gesture);

		// Show success feedback
		this.showSuccessFeedback(step);

		// Move to next step or complete tutorial
		const currentIndex = tutorial.steps.findIndex((s) => s.id === step.id);
		if (currentIndex < tutorial.steps.length - 1) {
			if (this.state.tutorials.autoAdvance) {
				setTimeout(() => {
					this.state.tutorials.currentStep = currentIndex + 1;
					this.startTutorialStep(tutorial.steps[currentIndex + 1]);
				}, 1500);
			}
		} else {
			await this.completeTutorial(tutorial);
		}

		const event = new CustomEvent("tutorialStepCompleted", {
			detail: { step, nextStep: currentIndex + 1 },
		});
		window.dispatchEvent(event);
	}

	/**
	 * Complete entire tutorial
	 */
	private async completeTutorial(tutorial: GestureTutorial): Promise<void> {
		// Mark tutorial as completed
		if (!this.state.completedGestures.includes(tutorial.id)) {
			this.state.completedGestures.push(tutorial.id);
		}

		// Award points and badges
		this.awardTutorialRewards(tutorial);

		// Show completion UI
		this.showTutorialCompletion(tutorial);

		// Exit learning mode
		this.state.learningMode = false;
		this.state.currentLesson = null;

		// Save progress
		this.saveProgressToStorage();

		const event = new CustomEvent("tutorialCompleted", {
			detail: { tutorial, rewards: tutorial.rewards },
		});
		window.dispatchEvent(event);
	}

	/**
	 * Update gesture proficiency based on performance
	 */
	private updateGestureProficiency(gestureType: GestureType): void {
		const currentScore = this.state.proficiency[gestureType] || 0;
		const history = this.gestureHistory.get(gestureType) || [];

		// Calculate new proficiency based on recent performance
		const recentPerformance = history.slice(-10); // Last 10 uses
		const averageAccuracy =
			recentPerformance.reduce((sum, acc) => sum + acc, 0) /
			recentPerformance.length;

		// Update proficiency with smoothing
		const smoothingFactor = 0.3;
		const newScore =
			currentScore * (1 - smoothingFactor) + averageAccuracy * smoothingFactor;

		this.state.proficiency[gestureType] = Math.max(0, Math.min(1, newScore));
		this.proficiencyScores.set(gestureType, newScore);

		const event = new CustomEvent("proficiencyUpdated", {
			detail: { gestureType, proficiency: newScore },
		});
		window.dispatchEvent(event);
	}

	/**
	 * Track gesture usage for proficiency calculation
	 */
	trackGestureUsage(event: GestureEvent): void {
		if (!this.gestureHistory.has(event.type)) {
			this.gestureHistory.set(event.type, []);
		}

		const history = this.gestureHistory.get(event.type)!;

		// Calculate accuracy based on gesture quality
		const accuracy = this.calculateGestureAccuracy(event);
		history.push(accuracy);

		// Keep only recent history
		if (history.length > 50) {
			history.shift();
		}
	}

	/**
	 * Calculate gesture accuracy for proficiency tracking
	 */
	private calculateGestureAccuracy(event: GestureEvent): number {
		let accuracy = 1.0;

		// Penalize based on various factors
		if (event.state.duration > 1000) accuracy -= 0.1; // Too slow
		if (event.data.velocity && Math.abs(event.data.velocity.x) > 5)
			accuracy -= 0.1; // Too fast

		// Reward precision
		if (event.data.center) {
			const distanceFromCenter = Math.sqrt(
				event.data.center.x ** 2 + event.data.center.y ** 2,
			);
			if (distanceFromCenter < 100) accuracy += 0.1; // Precise gesture
		}

		return Math.max(0, Math.min(1, accuracy));
	}

	/**
	 * Award tutorial completion rewards
	 */
	private awardTutorialRewards(tutorial: GestureTutorial): void {
		const event = new CustomEvent("tutorialRewards", {
			detail: {
				points: tutorial.rewards.points,
				badges: tutorial.rewards.badges,
			},
		});
		window.dispatchEvent(event);
	}

	/**
	 * Show tutorial UI overlay
	 */
	private showTutorialUI(tutorial: GestureTutorial): void {
		// This would create and show the tutorial UI
		// For now, we'll emit an event for the UI to handle
		const event = new CustomEvent("showTutorialUI", {
			detail: { tutorial },
		});
		window.dispatchEvent(event);
	}

	/**
	 * Show step instruction
	 */
	private showStepInstruction(step: TutorialStep): void {
		const instruction = this.state.learningMode
			? step.polishInstruction
			: step.instruction;

		const event = new CustomEvent("showStepInstruction", {
			detail: { instruction, step },
		});
		window.dispatchEvent(event);
	}

	/**
	 * Show visual guide for tutorial step
	 */
	private showVisualGuide(step: TutorialStep): void {
		if (!step.visualGuide) return;

		const event = new CustomEvent("showVisualGuide", {
			detail: { visualGuide: step.visualGuide, target: step.target },
		});
		window.dispatchEvent(event);
	}

	/**
	 * Show success feedback
	 */
	private showSuccessFeedback(step: TutorialStep): void {
		const message = this.state.learningMode
			? "Świetnie! Ukończono krok."
			: "Great! Step completed.";

		const event = new CustomEvent("showSuccessFeedback", {
			detail: { message, step },
		});
		window.dispatchEvent(event);
	}

	/**
	 * Show tutorial completion
	 */
	private showTutorialCompletion(tutorial: GestureTutorial): void {
		const title = this.state.learningMode
			? `Ukończono: ${tutorial.polishName}`
			: `Completed: ${tutorial.name}`;

		const event = new CustomEvent("showTutorialCompletion", {
			detail: { title, tutorial, rewards: tutorial.rewards },
		});
		window.dispatchEvent(event);
	}

	/**
	 * Get gesture proficiency level
	 */
	getGestureProficiency(gestureType: GestureType): number {
		return this.state.proficiency[gestureType] || 0;
	}

	/**
	 * Get proficiency level description in Polish
	 */
	getProficiencyDescription(proficiency: number): string {
		if (proficiency < 0.3) return "Początkujący";
		if (proficiency < 0.6) return "Średnio zaawansowany";
		if (proficiency < 0.8) return "Zaawansowany";
		return "Ekspert";
	}

	/**
	 * Get available tutorials based on completed prerequisites
	 */
	getAvailableTutorials(): GestureTutorial[] {
		return Array.from(this.tutorials.values()).filter((tutorial) =>
			tutorial.prerequisites.every((prereq) =>
				this.state.completedGestures.includes(prereq),
			),
		);
	}

	/**
	 * Get tutorial progress
	 */
	getTutorialProgress(tutorialId: string): {
		completed: number;
		total: number;
	} {
		const tutorial = this.tutorials.get(tutorialId);
		if (!tutorial) return { completed: 0, total: 0 };

		const completedSteps = tutorial.steps.filter((step) =>
			this.state.completedGestures.includes(step.id),
		).length;

		return { completed: completedSteps, total: tutorial.steps.length };
	}

	/**
	 * Enable or disable learning mode
	 */
	setLearningMode(enabled: boolean): void {
		this.state.learningMode = enabled;

		if (!enabled) {
			this.state.currentLesson = null;
			this.state.tutorials.currentStep = 0;
		}

		const event = new CustomEvent("learningModeChanged", {
			detail: { enabled },
		});
		window.dispatchEvent(event);
	}

	/**
	 * Get localized gesture instruction
	 */
	getLocalizedInstruction(gestureType: GestureType, context?: string): string {
		const baseKey = `gestures.${gestureType}`;
		const contextKey = context ? `${baseKey}.${context}` : baseKey;

		return (
			this.polishLabels.instructions[contextKey] ||
			this.polishLabels.gestures[gestureType] ||
			gestureType
		);
	}

	/**
	 * Save progress to local storage
	 */
	private saveProgressToStorage(): void {
		try {
			localStorage.setItem(
				"gesture-learning-progress",
				JSON.stringify({
					completedGestures: this.state.completedGestures,
					proficiency: this.state.proficiency,
					lastUpdated: Date.now(),
				}),
			);
		} catch (error) {
			console.warn("Failed to save progress to storage:", error);
		}
	}

	/**
	 * Load progress from local storage
	 */
	private loadProgressFromStorage(): void {
		try {
			const saved = localStorage.getItem("gesture-learning-progress");
			if (saved) {
				const progress = JSON.parse(saved);
				this.state.completedGestures = progress.completedGestures || [];
				this.state.proficiency = progress.proficiency || {};
			}
		} catch (error) {
			console.warn("Failed to load progress from storage:", error);
		}
	}

	/**
	 * Get educational statistics
	 */
	getEducationalStats() {
		const totalTutorials = this.tutorials.size;
		const completedTutorials = this.state.completedGestures.length;
		const averageProficiency =
			Object.values(this.state.proficiency).reduce(
				(sum, prof) => sum + prof,
				0,
			) / Math.max(Object.keys(this.state.proficiency).length, 1);

		return {
			totalTutorials,
			completedTutorials,
			completionRate: completedTutorials / totalTutorials,
			averageProficiency,
			totalGestureUses: Array.from(this.gestureHistory.values()).reduce(
				(sum, uses) => sum + uses.length,
				0,
			),
			learningStreak: this.calculateLearningStreak(),
		};
	}

	/**
	 * Calculate current learning streak (days)
	 */
	private calculateLearningStreak(): number {
		// This would track daily usage for streak calculation
		// For now, return a placeholder
		return 0;
	}

	/**
	 * Reset all progress
	 */
	resetProgress(): void {
		this.state.completedGestures = [];
		this.state.proficiency = {};
		this.gestureHistory.clear();
		this.proficiencyScores.clear();

		localStorage.removeItem("gesture-learning-progress");

		const event = new CustomEvent("progressReset", {});
		window.dispatchEvent(event);
	}

	/**
	 * Get current state
	 */
	getState(): EducationalState {
		return { ...this.state };
	}

	/**
	 * Dispose of resources
	 */
	dispose(): void {
		this.saveProgressToStorage();

		// Clear all event listeners
		for (const [event, listeners] of this.eventListeners) {
			for (const listener of listeners) {
				window.removeEventListener(event, listener);
			}
		}
		this.eventListeners.clear();
	}
}
