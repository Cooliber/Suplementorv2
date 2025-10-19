"use client";

import { Color, Group, Object3D, Vector3 } from "three";

// System transition animation framework
export interface SystemTransition {
	id: string;
	name: string;
	polishName: string;
	fromSystem: string;
	toSystem: string;
	duration: number;
	transitionType: "fade" | "slide" | "zoom" | "morph" | "dissolve";
	easing: string;
	description: string;
	polishDescription: string;
	visualEffects: {
		particleSystem?: string;
		colorTransition?: {
			fromColor: string;
			toColor: string;
		};
		cameraMovement?: {
			startPosition: [number, number, number];
			endPosition: [number, number, number];
			startTarget: [number, number, number];
			endTarget: [number, number, number];
		};
	};
}

export interface TransitionController {
	isTransitioning: boolean;
	currentTransition: SystemTransition | null;
	progress: number;
	onComplete?: (fromSystem: string, toSystem: string) => void;
	onProgress?: (progress: number) => void;
}

// System transition definitions
export const SYSTEM_TRANSITIONS: SystemTransition[] = [
	{
		id: "skeletal-to-muscular",
		name: "Skeletal to Muscular",
		polishName: "Szkielet do mięśni",
		fromSystem: "skeletal",
		toSystem: "muscular",
		duration: 1500,
		transitionType: "morph",
		easing: "easeInOutCubic",
		description:
			"Smooth transition showing skeletal support for muscular movement",
		polishDescription:
			"Płynne przejście pokazujące wsparcie szkieletu dla ruchu mięśni",
		visualEffects: {
			particleSystem: "cellular-energy",
			colorTransition: {
				fromColor: "#E5E7EB",
				toColor: "#DC2626",
			},
			cameraMovement: {
				startPosition: [0, 0, 5],
				endPosition: [0, 0, 4],
				startTarget: [0, 0, 0],
				endTarget: [0, 0, 0],
			},
		},
	},
	{
		id: "respiratory-to-nervous",
		name: "Respiratory to Nervous",
		polishName: "Oddech do nerwów",
		fromSystem: "respiratory",
		toSystem: "nervous",
		duration: 2000,
		transitionType: "dissolve",
		easing: "easeInOutQuart",
		description: "Transition showing oxygen supply to neural tissue",
		polishDescription:
			"Przejście pokazujące dostarczanie tlenu do tkanki nerwowej",
		visualEffects: {
			particleSystem: "blood-cells",
			colorTransition: {
				fromColor: "#2563EB",
				toColor: "#7C3AED",
			},
			cameraMovement: {
				startPosition: [0, 0, 4],
				endPosition: [0, 1, 3],
				startTarget: [0, 0, 0],
				endTarget: [0, 0, 0],
			},
		},
	},
	{
		id: "endocrine-to-reproductive",
		name: "Endocrine to Reproductive",
		polishName: "Hormony do rozrodu",
		fromSystem: "endocrine",
		toSystem: "reproductive",
		duration: 1800,
		transitionType: "fade",
		easing: "easeInOutSine",
		description: "Hormonal regulation of reproductive processes",
		polishDescription: "Regulacja hormonalna procesów rozrodczych",
		visualEffects: {
			particleSystem: "hormone-molecules",
			colorTransition: {
				fromColor: "#059669",
				toColor: "#BE123C",
			},
			cameraMovement: {
				startPosition: [0, 0, 4],
				endPosition: [0, -1, 3],
				startTarget: [0, 0, 0],
				endTarget: [0, 0, 0],
			},
		},
	},
	{
		id: "nervous-to-endocrine",
		name: "Nervous to Endocrine",
		polishName: "Nerwy do hormonów",
		fromSystem: "nervous",
		toSystem: "endocrine",
		duration: 1600,
		transitionType: "slide",
		easing: "easeInOutQuad",
		description: "Neural control of endocrine hormone release",
		polishDescription: "Kontrola nerwowa wydzielania hormonów endokrynnych",
		visualEffects: {
			particleSystem: "neural-signals",
			colorTransition: {
				fromColor: "#7C3AED",
				toColor: "#059669",
			},
			cameraMovement: {
				startPosition: [0, 1, 3],
				endPosition: [0, 0, 4],
				startTarget: [0, 0, 0],
				endTarget: [0, 0, 0],
			},
		},
	},
];

// Transition controller class
export class SystemTransitionController {
	private activeTransitions: Map<string, TransitionController> = new Map();
	private animationFrameId: number | null = null;
	private lastTime = 0;

	public startTransition(transitionId: string): Promise<void> {
		return new Promise((resolve) => {
			const transition = SYSTEM_TRANSITIONS.find((t) => t.id === transitionId);
			if (!transition) {
				resolve();
				return;
			}

			const controller: TransitionController = {
				isTransitioning: true,
				currentTransition: transition,
				progress: 0,
				onComplete: () => {
					this.activeTransitions.delete(transitionId);
					resolve();
				},
			};

			this.activeTransitions.set(transitionId, controller);
			this.startTransitionLoop();
		});
	}

	public isTransitionActive(transitionId: string): boolean {
		return this.activeTransitions.has(transitionId);
	}

	public getTransitionProgress(transitionId: string): number {
		return this.activeTransitions.get(transitionId)?.progress || 0;
	}

	private startTransitionLoop() {
		if (this.animationFrameId !== null) return;

		const animate = (currentTime: number) => {
			if (this.lastTime === 0) this.lastTime = currentTime;
			const deltaTime = currentTime - this.lastTime;
			this.lastTime = currentTime;

			this.activeTransitions.forEach((controller, transitionId) => {
				if (!controller.isTransitioning || !controller.currentTransition)
					return;

				controller.progress +=
					deltaTime / controller.currentTransition.duration;

				if (controller.progress >= 1) {
					controller.progress = 1;
					controller.isTransitioning = false;
					controller.onComplete?.(
						controller.currentTransition.fromSystem,
						controller.currentTransition.toSystem,
					);
				}

				controller.onProgress?.(controller.progress);
			});

			if (this.activeTransitions.size > 0) {
				this.animationFrameId = requestAnimationFrame(animate);
			} else {
				this.animationFrameId = null;
			}
		};

		this.animationFrameId = requestAnimationFrame(animate);
	}

	public dispose() {
		if (this.animationFrameId !== null) {
			cancelAnimationFrame(this.animationFrameId);
			this.animationFrameId = null;
		}
		this.activeTransitions.clear();
	}
}

// Polish language integration for animations
export const POLISH_ANIMATION_LABELS = {
	// Animation types
	breathing: "Oddychanie",
	heartbeat: "Bicie serca",
	muscle_contraction: "Skurcz mięśni",
	nerve_impulse: "Impuls nerwowy",
	blood_flow: "Przepływ krwi",
	hormone_release: "Wydzielanie hormonów",

	// Animation controls
	play: "Odtwórz",
	pause: "Pauza",
	stop: "Stop",
	speed: "Prędkość",
	intensity: "Intensywność",
	bookmarks: "Zakładki",
	timeline: "Oś czasu",

	// System names
	skeletal: "Układ szkieletowy",
	muscular: "Układ mięśniowy",
	respiratory: "Układ oddechowy",
	nervous: "Układ nerwowy",
	endocrine: "Układ hormonalny",
	reproductive: "Układ rozrodczy",
	integumentary: "Układ powłokowy",

	// Educational content
	learning_objectives: "Cele nauki",
	key_points: "Kluczowe punkty",
	clinical_relevance: "Znaczenie kliniczne",
	anatomical_info: "Informacje anatomiczne",
	neural_activity: "Aktywność neuronalna",
	supplement_effects: "Efekty suplementów",

	// Performance
	performance: "Wydajność",
	fps: "FPS",
	memory: "Pamięć",
	quality: "Jakość",

	// Accessibility
	show_labels: "Pokaż etykiety",
	hide_labels: "Ukryj etykiety",
	audio_narration: "Narracja audio",
	visual_effects: "Efekty wizualne",
	reduced_motion: "Zmniejszony ruch",
} as const;

// Culturally appropriate medical terminology animations
export const MEDICAL_TERMINOLOGY_ANIMATIONS = {
	// Polish anatomical terms with pronunciation guides
	anatomicalTerms: {
		kość: { pronunciation: "kość", emphasis: "kość" },
		mięsień: { pronunciation: "mię-śień", emphasis: "mięsień" },
		nerw: { pronunciation: "nerf", emphasis: "nerw" },
		tętnica: { pronunciation: "tęt-ni-ca", emphasis: "tętnica" },
		żyła: { pronunciation: "ży-ła", emphasis: "żyła" },
		serce: { pronunciation: "ser-tse", emphasis: "serce" },
		płuco: { pronunciation: "płu-co", emphasis: "płuco" },
		wątroba: { pronunciation: "wą-tro-ba", emphasis: "wątroba" },
		nerka: { pronunciation: "ner-ka", emphasis: "nerka" },
		mózg: { pronunciation: "mózg", emphasis: "mózg" },
	},

	// Regional medical terminology variations
	regionalVariations: {
		// Standard Polish medical terms
		standard: {
			brain: "mózg",
			heart: "serce",
			liver: "wątroba",
			kidney: "nerka",
			lung: "płuco",
			stomach: "żołądek",
			intestine: "jelito",
			muscle: "mięsień",
			bone: "kość",
			nerve: "nerw",
		},

		// Common colloquial terms (for patient education)
		colloquial: {
			brain: "głowa",
			heart: "serduszko",
			liver: "wątróbka",
			kidney: "nerka",
			lung: "płuco",
			stomach: "brzuszek",
			intestine: "jelitko",
			muscle: "mięsień",
			bone: "kostka",
			nerve: "nerwek",
		},
	},

	// Medical animations with Polish context
	medicalAnimations: {
		"cardiac-cycle": {
			name: "Cykl serca",
			description: "Animacja pokazująca pracę serca w cyklu pracy",
			keyTerms: ["skurcz", "rozkurcz", "przedsionek", "komora"],
			culturalContext:
				"Ważne dla zrozumienia chorób serca w populacji polskiej",
		},
		"respiratory-process": {
			name: "Proces oddychania",
			description: "Animacja wymiany gazowej w płucach",
			keyTerms: ["wdychanie", "wydychanie", "pęcherzyki", "dyfuzja"],
			culturalContext: "Kluczowe dla edukacji o chorobach płuc",
		},
		"neural-transmission": {
			name: "Przekazywanie neuronalne",
			description: "Animacja sygnałów nerwowych w mózgu",
			keyTerms: ["synapsa", "neuroprzekaźnik", "impuls", "receptor"],
			culturalContext: "Pomocne w zrozumieniu chorób neurologicznych",
		},
	},
};

// Voice-over integration for educational sequences
export class AudioNarrationManager {
	private speechSynthesis: SpeechSynthesis | null = null;
	private currentUtterance: SpeechSynthesisUtterance | null = null;
	private audioQueue: Array<{
		text: string;
		polishText: string;
		timing: number;
		priority: "low" | "medium" | "high";
	}> = [];

	constructor() {
		if (typeof window !== "undefined" && "speechSynthesis" in window) {
			this.speechSynthesis = window.speechSynthesis;
		}
	}

	public queueNarration(
		text: string,
		polishText: string,
		timing = 0,
		priority: "low" | "medium" | "high" = "medium",
	) {
		this.audioQueue.push({ text, polishText, timing, priority });

		// Sort by priority and timing
		this.audioQueue.sort((a, b) => {
			const priorityOrder = { high: 3, medium: 2, low: 1 };
			const priorityDiff =
				priorityOrder[b.priority] - priorityOrder[a.priority];
			if (priorityDiff !== 0) return priorityDiff;
			return a.timing - b.timing;
		});
	}

	public playNextNarration(language: "en" | "pl" = "pl") {
		if (!this.speechSynthesis || this.audioQueue.length === 0) return;

		const nextItem = this.audioQueue.shift();
		if (!nextItem) return;

		// Cancel current speech if playing
		if (this.currentUtterance) {
			this.speechSynthesis.cancel();
		}

		const text = language === "pl" ? nextItem.polishText : nextItem.text;

		this.currentUtterance = new SpeechSynthesisUtterance(text);
		this.currentUtterance.lang = language === "pl" ? "pl-PL" : "en-US";
		this.currentUtterance.rate = 0.9;
		this.currentUtterance.pitch = 1;
		this.currentUtterance.volume = 0.8;

		this.currentUtterance.onend = () => {
			this.currentUtterance = null;
			// Auto-play next item if available
			setTimeout(() => this.playNextNarration(language), 500);
		};

		this.speechSynthesis.speak(this.currentUtterance);
	}

	public pauseNarration() {
		if (this.speechSynthesis && this.currentUtterance) {
			this.speechSynthesis.pause();
		}
	}

	public resumeNarration() {
		if (this.speechSynthesis && this.currentUtterance) {
			this.speechSynthesis.resume();
		}
	}

	public stopNarration() {
		if (this.speechSynthesis) {
			this.speechSynthesis.cancel();
			this.currentUtterance = null;
			this.audioQueue = [];
		}
	}

	public setVoice(language: "en" | "pl" = "pl") {
		if (!this.speechSynthesis) return;

		const voices = this.speechSynthesis.getVoices();
		const preferredVoice = voices.find((voice) =>
			language === "pl"
				? voice.lang.startsWith("pl")
				: voice.lang.startsWith("en"),
		);

		if (preferredVoice && this.currentUtterance) {
			this.currentUtterance.voice = preferredVoice;
		}
	}

	public isSupported(): boolean {
		return !!this.speechSynthesis;
	}

	public dispose() {
		this.stopNarration();
		this.audioQueue = [];
	}
}

// Animation bookmark system with Polish labels
export interface AnimationBookmark {
	id: string;
	name: string;
	polishName: string;
	animationId: string;
	timestamp: number;
	description: string;
	polishDescription: string;
	visualSnapshot?: string;
	category: "educational" | "clinical" | "anatomical" | "physiological";
}

export class AnimationBookmarkManager {
	private bookmarks: Map<string, AnimationBookmark> = new Map();
	private onBookmarkChange?: (bookmarks: AnimationBookmark[]) => void;

	public addBookmark(bookmark: Omit<AnimationBookmark, "id">) {
		const id = `${bookmark.animationId}-${bookmark.timestamp}-${Date.now()}`;
		const fullBookmark: AnimationBookmark = { ...bookmark, id };

		this.bookmarks.set(id, fullBookmark);
		this.onBookmarkChange?.(Array.from(this.bookmarks.values()));

		return id;
	}

	public removeBookmark(bookmarkId: string) {
		this.bookmarks.delete(bookmarkId);
		this.onBookmarkChange?.(Array.from(this.bookmarks.values()));
	}

	public getBookmarksByAnimation(animationId: string): AnimationBookmark[] {
		return Array.from(this.bookmarks.values()).filter(
			(b) => b.animationId === animationId,
		);
	}

	public getBookmarksByCategory(
		category: AnimationBookmark["category"],
	): AnimationBookmark[] {
		return Array.from(this.bookmarks.values()).filter(
			(b) => b.category === category,
		);
	}

	public jumpToBookmark(bookmarkId: string): AnimationBookmark | null {
		return this.bookmarks.get(bookmarkId) || null;
	}

	public setBookmarkChangeCallback(
		callback: (bookmarks: AnimationBookmark[]) => void,
	) {
		this.onBookmarkChange = callback;
	}

	public exportBookmarks(): string {
		return JSON.stringify(Array.from(this.bookmarks.values()), null, 2);
	}

	public importBookmarks(jsonData: string) {
		try {
			const importedBookmarks = JSON.parse(jsonData) as AnimationBookmark[];
			this.bookmarks.clear();
			importedBookmarks.forEach((bookmark) => {
				this.bookmarks.set(bookmark.id, bookmark);
			});
			this.onBookmarkChange?.(Array.from(this.bookmarks.values()));
		} catch (error) {
			console.error("Failed to import bookmarks:", error);
		}
	}

	public getAllBookmarks(): AnimationBookmark[] {
		return Array.from(this.bookmarks.values());
	}
}

// Performance-optimized animation rendering
export class AdaptiveAnimationRenderer {
	private performanceHistory: number[] = [];
	private targetFPS = 60;
	private qualityLevel: "low" | "medium" | "high" = "high";

	public updatePerformance(fps: number) {
		this.performanceHistory.push(fps);

		// Keep only last 60 measurements
		if (this.performanceHistory.length > 60) {
			this.performanceHistory.shift();
		}

		this.adjustQuality();
	}

	private adjustQuality() {
		const averageFPS =
			this.performanceHistory.reduce((a, b) => a + b, 0) /
			this.performanceHistory.length;

		if (averageFPS < 30 && this.qualityLevel !== "low") {
			this.qualityLevel = "low";
		} else if (averageFPS < 45 && this.qualityLevel !== "medium") {
			this.qualityLevel = "medium";
		} else if (averageFPS >= 50 && this.qualityLevel !== "high") {
			this.qualityLevel = "high";
		}
	}

	public getQualitySettings() {
		switch (this.qualityLevel) {
			case "low":
				return {
					particleCount: 0.3,
					animationComplexity: 0.5,
					shadowQuality: "off",
					antiAliasing: false,
					textureResolution: 0.5,
				};
			case "medium":
				return {
					particleCount: 0.7,
					animationComplexity: 0.8,
					shadowQuality: "low",
					antiAliasing: true,
					textureResolution: 0.8,
				};
			case "high":
				return {
					particleCount: 1.0,
					animationComplexity: 1.0,
					shadowQuality: "high",
					antiAliasing: true,
					textureResolution: 1.0,
				};
		}
	}

	public shouldRenderFrame(currentFPS: number): boolean {
		return currentFPS >= this.targetFPS * 0.8;
	}

	public getRecommendedFrameRate(): number {
		const averageFPS =
			this.performanceHistory.reduce((a, b) => a + b, 0) /
			this.performanceHistory.length;
		return Math.max(30, Math.min(this.targetFPS, averageFPS * 0.9));
	}
}
