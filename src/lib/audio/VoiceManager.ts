/**
 * Voice Synthesis Manager for Suplementor
 * Handles Polish text-to-speech and educational narration
 */

import {
	type VoiceManager as IVoiceManager,
	VoiceSynthesisError,
	type VoiceSynthesisOptions,
} from "./types";

export class VoiceManager implements IVoiceManager {
	private _synthesis: SpeechSynthesis | null = null;
	private _voices: SpeechSynthesisVoice[] = [];
	private _isSupported = false;
	private _isSpeaking = false;
	private _currentUtterance: SpeechSynthesisUtterance | null = null;
	private _isInitialized = false;

	get synthesis(): SpeechSynthesis | null {
		return this._synthesis;
	}

	get voices(): SpeechSynthesisVoice[] {
		return this._voices;
	}

	get isSupported(): boolean {
		return this._isSupported;
	}

	get isSpeaking(): boolean {
		return this._isSpeaking;
	}

	get currentUtterance(): SpeechSynthesisUtterance | null {
		return this._currentUtterance;
	}

	/**
	 * Initialize voice synthesis system
	 */
	async initialize(): Promise<void> {
		try {
			// Check if speech synthesis is supported
			if (typeof window === "undefined" || !("speechSynthesis" in window)) {
				console.warn("Speech synthesis not supported");
				this._isSupported = false;
				return;
			}

			this._synthesis = window.speechSynthesis;
			this._isSupported = true;

			// Load available voices
			await this.loadVoices();

			// Set up event listeners for voice changes
			if (this._synthesis) {
				this._synthesis.onvoiceschanged = () => {
					this.loadVoices();
				};
			}

			this._isInitialized = true;
		} catch (error) {
			console.error("Failed to initialize voice manager:", error);
			this._isSupported = false;
		}
	}

	/**
	 * Load available voices from the system
	 */
	private async loadVoices(): Promise<void> {
		if (!this._synthesis) {
			return;
		}

		// Get available voices
		const voices = this._synthesis.getVoices();
		this._voices = voices;

		// If voices are not immediately available, wait for them
		if (voices.length === 0) {
			await new Promise<void>((resolve) => {
				const checkVoices = () => {
					const updatedVoices = this._synthesis?.getVoices() || [];
					if (updatedVoices.length > 0) {
						this._voices = updatedVoices;
						resolve();
					} else {
						setTimeout(checkVoices, 100);
					}
				};
				checkVoices();
			});
		}
	}

	/**
	 * Speak text with specified options
	 */
	async speak(options: VoiceSynthesisOptions): Promise<void> {
		if (!this._isSupported || !this._synthesis) {
			throw new VoiceSynthesisError("Voice synthesis not supported");
		}

		try {
			// Stop current speech if speaking
			if (this._isSpeaking) {
				this.stop();
			}

			// Create utterance
			const utterance = new SpeechSynthesisUtterance(options.text);
			this._currentUtterance = utterance;

			// Apply options
			if (options.language) {
				utterance.lang = options.language;
			} else {
				utterance.lang = "pl-PL"; // Default to Polish
			}

			if (options.voice) {
				utterance.voice = options.voice;
			} else {
				// Auto-select optimal Polish voice
				const optimalVoice = this.getOptimalVoice("pl-PL");
				if (optimalVoice) {
					utterance.voice = optimalVoice;
				}
			}

			if (options.rate !== undefined) {
				utterance.rate = Math.max(0.1, Math.min(10, options.rate));
			} else {
				utterance.rate = 1.0; // Normal speed for Polish
			}

			if (options.pitch !== undefined) {
				utterance.pitch = Math.max(0, Math.min(2, options.pitch));
			} else {
				utterance.pitch = 1.0; // Normal pitch
			}

			if (options.volume !== undefined) {
				utterance.volume = Math.max(0, Math.min(1, options.volume));
			} else {
				utterance.volume = 0.8; // Slightly lower for educational content
			}

			// Set up event handlers
			utterance.onstart = () => {
				this._isSpeaking = true;
				options.onStart?.();
			};

			utterance.onend = () => {
				this._isSpeaking = false;
				this._currentUtterance = null;
				options.onEnd?.();
			};

			utterance.onerror = (event) => {
				this._isSpeaking = false;
				this._currentUtterance = null;
				const error = new VoiceSynthesisError(
					`Speech synthesis error: ${event.error}`,
					{ originalError: event },
				);
				options.onError?.(error);
			};

			// Speak the text
			this._synthesis.speak(utterance);
		} catch (error) {
			console.error("Failed to speak text:", error);
			throw new VoiceSynthesisError("Failed to speak text", {
				originalError: error,
				options,
			});
		}
	}

	/**
	 * Stop current speech
	 */
	stop(): void {
		if (this._synthesis && this._isSpeaking) {
			this._synthesis.cancel();
			this._isSpeaking = false;
			this._currentUtterance = null;
		}
	}

	/**
	 * Pause current speech
	 */
	pause(): void {
		if (this._synthesis && this._isSpeaking) {
			this._synthesis.pause();
		}
	}

	/**
	 * Resume paused speech
	 */
	resume(): void {
		if (this._synthesis) {
			this._synthesis.resume();
		}
	}

	/**
	 * Get voices filtered by language
	 */
	getVoicesByLanguage(language: string): SpeechSynthesisVoice[] {
		return this._voices.filter((voice) =>
			voice.lang.toLowerCase().startsWith(language.toLowerCase()),
		);
	}

	/**
	 * Get optimal voice for language and gender preference
	 */
	getOptimalVoice(
		language: string,
		gender?: string,
	): SpeechSynthesisVoice | null {
		const languageVoices = this.getVoicesByLanguage(language);

		if (languageVoices.length === 0) {
			return null;
		}

		// Filter by gender if specified
		if (gender) {
			const genderVoices = languageVoices.filter((voice) => {
				const voiceName = voice.name.toLowerCase();
				if (gender === "female") {
					return (
						voiceName.includes("female") ||
						voiceName.includes("zski") ||
						voiceName.includes("ska") ||
						voiceName.includes("woman")
					);
				}
				if (gender === "male") {
					return (
						voiceName.includes("male") ||
						voiceName.includes("ski") ||
						voiceName.includes("man")
					);
				}
				return true;
			});

			if (genderVoices.length > 0) {
				return genderVoices[0]; // Return first matching voice
			}
		}

		// Return highest quality voice for the language
		return languageVoices.reduce((best, current) => {
			// Prefer local voices over remote ones
			if (
				best.voiceURI.includes("microsoft") &&
				!current.voiceURI.includes("microsoft")
			) {
				return current;
			}
			if (
				!best.voiceURI.includes("microsoft") &&
				current.voiceURI.includes("microsoft")
			) {
				return best;
			}

			// Prefer voices with better names (less generic)
			const bestName = best.name.toLowerCase();
			const currentName = current.name.toLowerCase();

			if (bestName.includes("generic") && !currentName.includes("generic")) {
				return current;
			}
			if (!bestName.includes("generic") && currentName.includes("generic")) {
				return best;
			}

			return best;
		});
	}

	/**
	 * Speak Polish text with educational context
	 */
	async speakPolish(
		text: string,
		options?: {
			context?: "educational" | "navigation" | "feedback" | "description";
			emphasis?: "normal" | "strong" | "gentle";
			speed?: "slow" | "normal" | "fast";
		},
	): Promise<void> {
		const synthesisOptions: VoiceSynthesisOptions = {
			text,
			language: "pl-PL",
			...options,
		};

		// Adjust settings based on context
		switch (options?.context) {
			case "educational":
				synthesisOptions.rate = 0.9; // Slightly slower for better comprehension
				synthesisOptions.pitch = 1.0;
				synthesisOptions.volume = 0.8;
				break;
			case "navigation":
				synthesisOptions.rate = 1.1; // Slightly faster for instructions
				synthesisOptions.pitch = 1.1;
				synthesisOptions.volume = 0.7;
				break;
			case "feedback":
				synthesisOptions.rate = 1.0;
				synthesisOptions.pitch = 1.2; // Higher pitch for positive feedback
				synthesisOptions.volume = 0.8;
				break;
			case "description":
				synthesisOptions.rate = 0.95;
				synthesisOptions.pitch = 1.0;
				synthesisOptions.volume = 0.75;
				break;
		}

		// Adjust emphasis
		switch (options?.emphasis) {
			case "strong":
				synthesisOptions.rate = 0.8;
				synthesisOptions.pitch = 1.3;
				synthesisOptions.volume = 0.9;
				break;
			case "gentle":
				synthesisOptions.rate = 1.1;
				synthesisOptions.pitch = 0.9;
				synthesisOptions.volume = 0.6;
				break;
		}

		// Adjust speed
		switch (options?.speed) {
			case "slow":
				synthesisOptions.rate = 0.7;
				break;
			case "fast":
				synthesisOptions.rate = 1.3;
				break;
		}

		await this.speak(synthesisOptions);
	}

	/**
	 * Speak brain region information in Polish
	 */
	async speakBrainRegion(
		regionName: string,
		description: string,
		functions: string[],
	): Promise<void> {
		const text = `Region mózgu: ${regionName}. ${description}. Główne funkcje: ${functions.join(", ")}.`;

		await this.speakPolish(text, {
			context: "educational",
			emphasis: "normal",
		});
	}

	/**
	 * Speak neurotransmitter information in Polish
	 */
	async speakNeurotransmitter(
		name: string,
		description: string,
		functions: string,
	): Promise<void> {
		const text = `Neuroprzekaźnik: ${name}. ${description}. Funkcje: ${functions}.`;

		await this.speakPolish(text, {
			context: "educational",
			emphasis: "normal",
		});
	}

	/**
	 * Speak supplement information in Polish
	 */
	async speakSupplement(
		name: string,
		description: string,
		effects: string[],
	): Promise<void> {
		const effectsText =
			effects.length > 0 ? ` Efekty: ${effects.join(", ")}.` : "";
		const text = `Suplement: ${name}. ${description}.${effectsText}`;

		await this.speakPolish(text, {
			context: "educational",
			emphasis: "normal",
		});
	}

	/**
	 * Speak educational content with proper Polish pronunciation
	 */
	async speakEducationalContent(
		title: string,
		content: string,
		technicalTerms?: string[],
	): Promise<void> {
		let text = `Temat: ${title}. ${content}`;

		// Add pronunciation guide for technical terms if provided
		if (technicalTerms && technicalTerms.length > 0) {
			text += ` Terminy do zapamiętania: ${technicalTerms.join(", ")}.`;
		}

		await this.speakPolish(text, {
			context: "educational",
			emphasis: "normal",
			speed: "normal",
		});
	}

	/**
	 * Speak navigation instructions in Polish
	 */
	async speakNavigation(text: string): Promise<void> {
		await this.speakPolish(text, {
			context: "navigation",
			emphasis: "gentle",
		});
	}

	/**
	 * Speak success feedback in Polish
	 */
	async speakSuccess(message: string): Promise<void> {
		await this.speakPolish(message, {
			context: "feedback",
			emphasis: "strong",
		});
	}

	/**
	 * Speak error feedback in Polish
	 */
	async speakError(message: string): Promise<void> {
		await this.speakPolish(message, {
			context: "feedback",
			emphasis: "normal",
		});
	}

	/**
	 * Test voice synthesis with Polish text
	 */
	async testVoices(): Promise<{
		supported: boolean;
		voicesCount: number;
		polishVoicesCount: number;
		testSuccessful: boolean;
	}> {
		if (!this._isSupported) {
			return {
				supported: false,
				voicesCount: 0,
				polishVoicesCount: 0,
				testSuccessful: false,
			};
		}

		const polishVoices = this.getVoicesByLanguage("pl");
		let testSuccessful = false;

		try {
			await this.speakPolish(
				"Test syntezy mowy. Jeśli słyszysz ten tekst, synteza działa poprawnie.",
				{
					context: "feedback",
					emphasis: "normal",
				},
			);
			testSuccessful = true;
		} catch (error) {
			console.error("Voice test failed:", error);
		}

		return {
			supported: this._isSupported,
			voicesCount: this._voices.length,
			polishVoicesCount: polishVoices.length,
			testSuccessful,
		};
	}

	/**
	 * Get voice synthesis capabilities
	 */
	getCapabilities(): {
		supported: boolean;
		voicesCount: number;
		languages: string[];
		polishVoicesAvailable: boolean;
		currentlySpeaking: boolean;
	} {
		const languages = Array.from(
			new Set(this._voices.map((voice) => voice.lang)),
		);

		return {
			supported: this._isSupported,
			voicesCount: this._voices.length,
			languages,
			polishVoicesAvailable: this.getVoicesByLanguage("pl").length > 0,
			currentlySpeaking: this._isSpeaking,
		};
	}

	/**
	 * Speak medical terminology with proper Polish pronunciation
	 */
	async speakMedicalTerminology(
		term: string,
		pronunciation: string,
		definition: string,
	): Promise<void> {
		const text = `Termin medyczny: ${term}. Wymowa: ${pronunciation}. Definicja: ${definition}.`;

		await this.speakPolish(text, {
			context: "educational",
			emphasis: "strong",
			speed: "slow",
		});
	}

	/**
	 * Speak quiz questions and answers in Polish
	 */
	async speakQuizQuestion(question: string, options: string[]): Promise<void> {
		const optionsText =
			options.length > 0 ? ` Opcje: ${options.join(", ")}.` : "";
		const text = `Pytanie: ${question}.${optionsText}`;

		await this.speakPolish(text, {
			context: "educational",
			emphasis: "normal",
		});
	}

	/**
	 * Speak quiz results in Polish
	 */
	async speakQuizResult(correct: boolean, explanation?: string): Promise<void> {
		const resultText = correct
			? "Poprawna odpowiedź!"
			: "Niestety, błędna odpowiedź.";
		const explanationText = explanation ? ` ${explanation}` : "";

		await this.speakPolish(resultText + explanationText, {
			context: "feedback",
			emphasis: correct ? "strong" : "normal",
		});
	}
}

// Singleton instance for global use
export const voiceManager = new VoiceManager();
