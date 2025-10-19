"use client";

import {
	type PolishLabel,
	type PolishLabelConfig,
	TransitionEasing,
	Vector3D,
	type VoiceOverConfig,
	VoiceTiming,
} from "@/lib/types/transitions";
import { useCallback, useEffect, useRef, useState } from "react";

interface PolishLanguageIntegrationProps {
	polishLabels?: PolishLabelConfig;
	voiceOver?: VoiceOverConfig;
	onLabelShow?: (label: PolishLabel) => void;
	onLabelHide?: (label: PolishLabel) => void;
	onVoiceStart?: (text: string) => void;
	onVoiceEnd?: (text: string) => void;
	autoStart?: boolean;
}

interface LabelState {
	currentLabel: PolishLabel | null;
	showProgress: number;
	hideProgress: number;
	isVisible: boolean;
}

interface VoiceState {
	isPlaying: boolean;
	currentText: string;
	progress: number;
}

// Text-to-Speech utility for Polish pronunciation
class PolishTextToSpeech {
	private speechSynthesis: SpeechSynthesis | null = null;
	private voices: SpeechSynthesisVoice[] = [];
	private polishVoice: SpeechSynthesisVoice | null = null;

	constructor() {
		if (typeof window !== "undefined" && "speechSynthesis" in window) {
			this.speechSynthesis = window.speechSynthesis;
			this.loadVoices();
		}
	}

	private loadVoices(): void {
		if (!this.speechSynthesis) return;

		const loadVoices = () => {
			this.voices = this.speechSynthesis?.getVoices();
			this.polishVoice =
				this.voices.find(
					(voice) =>
						voice.lang.startsWith("pl") ||
						voice.name.toLowerCase().includes("polish"),
				) || null;
		};

		loadVoices();
		this.speechSynthesis.onvoiceschanged = loadVoices;
	}

	speak(text: string, config: VoiceOverConfig): Promise<void> {
		return new Promise((resolve, reject) => {
			if (!this.speechSynthesis || !text) {
				resolve();
				return;
			}

			// Cancel any ongoing speech
			this.speechSynthesis.cancel();

			const utterance = new SpeechSynthesisUtterance(text);
			utterance.lang = config.language === "pl" ? "pl-PL" : "en-US";
			utterance.rate = config.speed;
			utterance.pitch = config.pitch;
			utterance.volume = config.volume;

			// Use Polish voice if available
			if (this.polishVoice) {
				utterance.voice = this.polishVoice;
			}

			utterance.onstart = () => {
				// Voice started
			};

			utterance.onend = () => {
				resolve();
			};

			utterance.onerror = (error) => {
				console.error("Speech synthesis error:", error);
				reject(error);
			};

			this.speechSynthesis.speak(utterance);
		});
	}

	stop(): void {
		if (this.speechSynthesis) {
			this.speechSynthesis.cancel();
		}
	}

	isSpeaking(): boolean {
		return this.speechSynthesis ? this.speechSynthesis.speaking : false;
	}

	getVoices(): SpeechSynthesisVoice[] {
		return this.voices;
	}
}

// Polish Label Animator
export class PolishLabelAnimator {
	private animationId: number | null = null;
	private startTime = 0;
	private isAnimating = false;
	private currentLabelIndex = 0;
	private tts: PolishTextToSpeech;

	constructor(
		private labels: PolishLabel[],
		private config: PolishLabelConfig,
		private onLabelShow?: (label: PolishLabel) => void,
		private onLabelHide?: (label: PolishLabel) => void,
		private onVoiceStart?: (text: string) => void,
		private onVoiceEnd?: (text: string) => void,
	) {
		this.tts = new PolishTextToSpeech();
	}

	async start(): Promise<void> {
		return new Promise((resolve) => {
			if (this.isAnimating || this.labels.length === 0) {
				resolve();
				return;
			}

			this.isAnimating = true;
			this.startTime = performance.now();
			this.currentLabelIndex = 0;

			this.showNextLabel(resolve);
		});
	}

	stop(): void {
		if (this.animationId) {
			cancelAnimationFrame(this.animationId);
			this.animationId = null;
		}
		this.isAnimating = false;
		this.tts.stop();
	}

	private async showNextLabel(resolve: () => void): Promise<void> {
		if (this.currentLabelIndex >= this.labels.length) {
			this.isAnimating = false;
			resolve();
			return;
		}

		const label = this.labels[this.currentLabelIndex];

		// Show label with animation
		await this.animateLabel(label, "show");

		// Speak the text if voice over is enabled
		if (this.config.showLabels) {
			try {
				this.onVoiceStart?.(label.text);
				await this.speakLabel(label);
				this.onVoiceEnd?.(label.text);
			} catch (error) {
				console.error("Voice over error:", error);
			}
		}

		// Wait for label duration
		setTimeout(async () => {
			await this.animateLabel(label, "hide");
			this.currentLabelIndex++;
			this.showNextLabel(resolve);
		}, label.showDuration);
	}

	private async animateLabel(
		label: PolishLabel,
		direction: "show" | "hide",
	): Promise<void> {
		return new Promise((resolve) => {
			const duration = direction === "show" ? 500 : 300;
			const startTime = performance.now();

			const animate = (currentTime: number) => {
				const elapsed = currentTime - startTime;
				const progress = Math.min(elapsed / duration, 1);

				if (direction === "show") {
					if (progress >= 1) {
						this.onLabelShow?.(label);
						resolve();
					}
				} else {
					if (progress >= 1) {
						this.onLabelHide?.(label);
						resolve();
					}
				}
			};

			this.animationId = requestAnimationFrame(animate);
		});
	}

	private async speakLabel(label: PolishLabel): Promise<void> {
		// Speak both Polish and English versions for educational context
		const polishText = `${label.text}. ${label.pronunciation ? `Wymowa: ${label.pronunciation}` : ""}`;
		const englishText = `${label.translation}`;

		// Speak Polish first, then English translation
		await this.tts.speak(polishText, {
			enabled: true,
			language: "pl",
			voice: "female",
			speed: 0.9,
			pitch: 1.0,
			volume: 0.8,
			text: polishText,
			timing: [],
		});

		// Small pause between languages
		await new Promise((resolve) => setTimeout(resolve, 500));

		await this.tts.speak(englishText, {
			enabled: true,
			language: "en",
			voice: "female",
			speed: 1.0,
			pitch: 1.0,
			volume: 0.7,
			text: englishText,
			timing: [],
		});
	}

	getCurrentLabel(): PolishLabel | null {
		return this.currentLabelIndex < this.labels.length
			? this.labels[this.currentLabelIndex]
			: null;
	}

	getProgress(): number {
		if (this.labels.length === 0) return 1;
		return Math.min(this.currentLabelIndex / this.labels.length, 1);
	}
}

// React Hook for Polish Language Integration
export function usePolishLanguageIntegration(
	polishLabels?: PolishLabelConfig,
	voiceOver?: VoiceOverConfig,
	options: {
		autoStart?: boolean;
		onLabelShow?: (label: PolishLabel) => void;
		onLabelHide?: (label: PolishLabel) => void;
		onVoiceStart?: (text: string) => void;
		onVoiceEnd?: (text: string) => void;
	} = {},
) {
	const animatorRef = useRef<PolishLabelAnimator | null>(null);
	const [isAnimating, setIsAnimating] = useState(false);
	const [progress, setProgress] = useState(0);
	const [currentLabel, setCurrentLabel] = useState<PolishLabel | null>(null);
	const [labelState, setLabelState] = useState<LabelState>({
		currentLabel: null,
		showProgress: 0,
		hideProgress: 0,
		isVisible: false,
	});
	const [voiceState, setVoiceState] = useState<VoiceState>({
		isPlaying: false,
		currentText: "",
		progress: 0,
	});

	const {
		autoStart = false,
		onLabelShow,
		onLabelHide,
		onVoiceStart,
		onVoiceEnd,
	} = options;

	useEffect(() => {
		if (polishLabels && polishLabels.labels.length > 0) {
			animatorRef.current = new PolishLabelAnimator(
				polishLabels.labels,
				polishLabels,
				(label) => {
					setCurrentLabel(label);
					setLabelState((prev) => ({
						...prev,
						currentLabel: label,
						isVisible: true,
					}));
					onLabelShow?.(label);
				},
				(label) => {
					setLabelState((prev) => ({
						...prev,
						currentLabel: null,
						isVisible: false,
					}));
					onLabelHide?.(label);
				},
				(text) => {
					setVoiceState((prev) => ({
						...prev,
						isPlaying: true,
						currentText: text,
					}));
					onVoiceStart?.(text);
				},
				(text) => {
					setVoiceState((prev) => ({
						...prev,
						isPlaying: false,
						currentText: "",
					}));
					onVoiceEnd?.(text);
				},
			);

			if (autoStart) {
				startAnimation();
			}
		}

		return () => {
			animatorRef.current?.stop();
		};
	}, [polishLabels]);

	const startAnimation = useCallback(async () => {
		if (!animatorRef.current) return;

		setIsAnimating(true);
		setProgress(0);

		try {
			await animatorRef.current.start();
			setIsAnimating(false);
			setProgress(1);
		} catch (error) {
			console.error("Polish language integration error:", error);
			setIsAnimating(false);
		}
	}, []);

	const stopAnimation = useCallback(() => {
		animatorRef.current?.stop();
		setIsAnimating(false);
	}, []);

	// Update state periodically
	useEffect(() => {
		if (!isAnimating || !animatorRef.current) return;

		const interval = setInterval(() => {
			const currentProgress = animatorRef.current?.getProgress();
			const label = animatorRef.current?.getCurrentLabel();

			setProgress(currentProgress);
			setCurrentLabel(label);

			if (currentProgress >= 1) {
				clearInterval(interval);
			}
		}, 16); // ~60fps

		return () => clearInterval(interval);
	}, [isAnimating]);

	return {
		startAnimation,
		stopAnimation,
		isAnimating,
		progress,
		currentLabel,
		labelState,
		voiceState,
	};
}

// React Component for Polish Language Integration
export function PolishLanguageIntegrationComponent({
	polishLabels,
	voiceOver,
	onLabelShow,
	onLabelHide,
	onVoiceStart,
	onVoiceEnd,
	autoStart = false,
	children,
}: PolishLanguageIntegrationProps & { children?: React.ReactNode }) {
	const {
		startAnimation,
		stopAnimation,
		isAnimating,
		progress,
		currentLabel,
		labelState,
		voiceState,
	} = usePolishLanguageIntegration(polishLabels, voiceOver, {
		autoStart,
		onLabelShow,
		onLabelHide,
		onVoiceStart,
		onVoiceEnd,
	});

	return (
		<div className="polish-language-integration">
			{/* Animated Polish Labels */}
			{polishLabels?.showLabels && currentLabel && (
				<PolishLabelComponent
					label={currentLabel}
					config={polishLabels}
					state={labelState}
					progress={progress}
				/>
			)}

			{/* Voice Over Indicator */}
			{voiceOver?.enabled && voiceState.isPlaying && (
				<VoiceOverIndicator
					text={voiceState.currentText}
					language={voiceOver.language}
					isPlaying={voiceState.isPlaying}
				/>
			)}

			{/* Children content */}
			<div style={{ position: "relative", zIndex: 1 }}>{children}</div>
		</div>
	);
}

// Polish Label Component
interface PolishLabelComponentProps {
	label: PolishLabel;
	config: PolishLabelConfig;
	state: LabelState;
	progress: number;
}

function PolishLabelComponent({
	label,
	config,
	state,
	progress,
}: PolishLabelComponentProps) {
	const labelStyle: React.CSSProperties = {
		position: "absolute",
		left: `${50 + label.position.x * 100}%`,
		top: `${50 + label.position.y * 100}%`,
		transform: "translate(-50%, -50%)",
		fontSize: `${config.fontSize}px`,
		fontFamily: config.fontFamily,
		color: config.color,
		textAlign: "center",
		opacity: state.isVisible ? 1 : 0,
		textShadow: "0 0 20px rgba(0,0,0,0.8)",
		zIndex: 15,
		maxWidth: "300px",
		pointerEvents: "none",
		transition: "opacity 0.3s ease-in-out",
	};

	return (
		<div style={labelStyle}>
			{/* Main Polish text */}
			<div
				style={{
					fontWeight: "bold",
					marginBottom: "4px",
					fontSize: `${config.fontSize * 1.1}px`,
				}}
			>
				{label.text}
			</div>

			{/* Medical term */}
			<div
				style={{
					fontSize: `${config.fontSize * 0.8}px`,
					opacity: 0.9,
					fontStyle: "italic",
				}}
			>
				{label.medicalTerm}
			</div>

			{/* English translation */}
			<div
				style={{
					fontSize: `${config.fontSize * 0.7}px`,
					opacity: 0.8,
					marginTop: "4px",
				}}
			>
				{label.translation}
			</div>

			{/* Pronunciation guide */}
			{label.pronunciation && (
				<div
					style={{
						fontSize: `${config.fontSize * 0.6}px`,
						opacity: 0.7,
						marginTop: "2px",
						fontFamily: "monospace",
					}}
				>
					/{label.pronunciation}/
				</div>
			)}
		</div>
	);
}

// Voice Over Indicator Component
interface VoiceOverIndicatorProps {
	text: string;
	language: "pl" | "en";
	isPlaying: boolean;
}

function VoiceOverIndicator({
	text,
	language,
	isPlaying,
}: VoiceOverIndicatorProps) {
	return (
		<div
			style={{
				position: "absolute",
				bottom: "20px",
				left: "20px",
				backgroundColor: "rgba(0,0,0,0.7)",
				color: "white",
				padding: "8px 12px",
				borderRadius: "8px",
				fontSize: "14px",
				border: `2px solid ${language === "pl" ? "#ff0000" : "#0000ff"}`,
				opacity: isPlaying ? 1 : 0.7,
				transition: "opacity 0.3s ease-in-out",
				zIndex: 20,
			}}
		>
			<div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
				{/* Language indicator */}
				<div
					style={{
						width: "8px",
						height: "8px",
						borderRadius: "50%",
						backgroundColor: language === "pl" ? "#ff0000" : "#0000ff",
						animation: isPlaying ? "pulse 1s infinite" : "none",
					}}
				/>

				{/* Voice indicator */}
				{isPlaying && (
					<div style={{ display: "flex", gap: "2px" }}>
						{[0, 1, 2].map((i) => (
							<div
								key={i}
								style={{
									width: "3px",
									height: "12px",
									backgroundColor: "#00ff00",
									animation: "voiceWave 0.5s infinite ease-in-out",
									animationDelay: `${i * 0.1}s`,
								}}
							/>
						))}
					</div>
				)}

				{/* Text */}
				<span style={{ fontSize: "12px", opacity: 0.8 }}>
					{language === "pl" ? "PL" : "EN"}: {text.substring(0, 30)}...
				</span>
			</div>

			<style jsx>{`
				@keyframes pulse {
					0%, 100% { opacity: 0.3; }
					50% { opacity: 1; }
				}

				@keyframes voiceWave {
					0%, 100% { height: 4px; opacity: 0.4; }
					50% { height: 12px; opacity: 1; }
				}
			`}</style>
		</div>
	);
}

// Medical Terminology Pronunciation System
export class MedicalPronunciationSystem {
	private pronunciationMap = new Map<string, string>();

	constructor() {
		this.initializePronunciationMap();
	}

	private initializePronunciationMap(): void {
		// Common Polish medical terms and their pronunciations
		this.pronunciationMap.set(
			"Układ sercowo-naczyniowy",
			"ookwad ser-tso-vo nach-tsi-nyo-vi",
		);
		this.pronunciationMap.set("Układ pokarmowy", "ookwad po-kar-mo-vi");
		this.pronunciationMap.set("Układ nerwowy", "ookwad ner-vo-vi");
		this.pronunciationMap.set("Układ hormonalny", "ookwad hor-mo-nal-ni");
		this.pronunciationMap.set(
			"Układ odpornościowy",
			"ookwad od-por-no-shchio-vi",
		);
		this.pronunciationMap.set("Układ szkieletowy", "ookwad shkie-le-to-vi");
		this.pronunciationMap.set("Układ mięśniowy", "ookwad mish-nyo-vi");
		this.pronunciationMap.set("Układ oddechowy", "ookwad od-dek-ho-vi");
		this.pronunciationMap.set("Układ limfatyczny", "ookwad lim-fat-ich-ni");
		this.pronunciationMap.set("Układ moczowy", "ookwad mo-cho-vi");
		this.pronunciationMap.set("Układ rozrodczy", "ookwad roz-rod-chi");
		this.pronunciationMap.set("Układ powłokowy", "ookwad pov-wo-ko-vi");
		this.pronunciationMap.set(
			"Układ endokannabinoidowy",
			"ookwad en-do-kan-na-bi-noy-do-vi",
		);
		this.pronunciationMap.set("Neuroprzekaźniki", "ney-ro-pzhe-kaz-ni-ki");
		this.pronunciationMap.set("Homeostaza", "ho-me-o-sta-za");
		this.pronunciationMap.set("Metabolizm", "me-ta-bo-lizm");
		this.pronunciationMap.set("Synteza", "sin-te-za");
		this.pronunciationMap.set("Katabolizm", "ka-ta-bo-lizm");
		this.pronunciationMap.set("Anabolizm", "a-na-bo-lizm");
		this.pronunciationMap.set("Neurogeneza", "ney-ro-ge-ne-za");
		this.pronunciationMap.set("Angiogeneza", "an-gio-ge-ne-za");
		this.pronunciationMap.set("Apoptoza", "a-pop-to-za");
		this.pronunciationMap.set("Autofagia", "ow-to-fa-gia");
	}

	getPronunciation(term: string): string {
		return this.pronunciationMap.get(term) || this.generatePronunciation(term);
	}

	private generatePronunciation(term: string): string {
		// Simple pronunciation generator for unknown terms
		return term
			.toLowerCase()
			.replace(/ą/g, "on")
			.replace(/ć/g, "ch")
			.replace(/ę/g, "en")
			.replace(/ł/g, "w")
			.replace(/ń/g, "n")
			.replace(/ó/g, "oo")
			.replace(/ś/g, "sh")
			.replace(/ź/g, "zh")
			.replace(/ż/g, "zh")
			.replace(/cz/g, "ch")
			.replace(/sz/g, "sh")
			.replace(/rz/g, "zh")
			.replace(/ch/g, "h")
			.replace(/w/g, "v")
			.replace(/j/g, "y");
	}

	speakMedicalTerm(term: string, tts: PolishTextToSpeech): Promise<void> {
		const pronunciation = this.getPronunciation(term);
		const text = `${term}. Wymowa: ${pronunciation}`;

		return tts.speak(text, {
			enabled: true,
			language: "pl",
			voice: "female",
			speed: 0.8,
			pitch: 1.0,
			volume: 0.8,
			text,
			timing: [],
		});
	}
}

// Cultural Context Provider for Polish medical education
export class PolishCulturalContext {
	private culturalNotes = new Map<string, string>();

	constructor() {
		this.initializeCulturalNotes();
	}

	private initializeCulturalNotes(): void {
		// Cultural and educational context for Polish medical terms
		this.culturalNotes.set(
			"Układ sercowo-naczyniowy",
			"W Polsce choroby serca są główną przyczyną zgonów, stąd szczególny nacisk na edukację kardiologiczną",
		);
		this.culturalNotes.set(
			"Układ pokarmowy",
			"Polska kuchnia tradycyjna kładzie duży nacisk na zdrowe odżywianie i równowagę dietetyczną",
		);
		this.culturalNotes.set(
			"Medycyna naturalna",
			"Polacy mają długą tradycję ziołolecznictwa sięgającą czasów Piastów",
		);
		this.culturalNotes.set(
			"Profilaktyka zdrowotna",
			"Polski system opieki zdrowotnej kładzie duży nacisk na badania profilaktyczne",
		);
	}

	getCulturalNote(systemName: string): string {
		return this.culturalNotes.get(systemName) || "";
	}

	getEducationalContext(systemName: string): string {
		// Provide educational context appropriate for Polish medical education
		const contexts: Record<string, string> = {
			"Układ sercowo-naczyniowy":
				"Kardiologia jest jedną z wiodących specjalizacji medycznych w Polsce",
			"Układ nerwowy":
				"Neurologia polska ma bogate tradycje badawcze w dziedzinie neurofizjologii",
			"Układ pokarmowy":
				"Gastroenterologia polska słynie z badań nad mikrobiotą jelitową",
			"Układ odpornościowy":
				"Immunologia polska wniosła znaczący wkład w badania nad szczepionkami",
		};

		return contexts[systemName] || "";
	}
}

// Utility functions for creating Polish language configurations
export const createPolishLanguageConfigs = {
	educational: (labels: PolishLabel[]): PolishLabelConfig => ({
		showLabels: true,
		labels,
		animation: "fade",
		fontSize: 24,
		fontFamily: "Inter, sans-serif",
		color: "#ffffff",
		position: "center",
	}),

	minimal: (labels: PolishLabel[]): PolishLabelConfig => ({
		showLabels: true,
		labels,
		animation: "slide",
		fontSize: 18,
		fontFamily: "Inter, sans-serif",
		color: "#ffffff",
		position: "top",
	}),

	detailed: (labels: PolishLabel[]): PolishLabelConfig => ({
		showLabels: true,
		labels,
		animation: "typewriter",
		fontSize: 28,
		fontFamily: "Inter, sans-serif",
		color: "#ffffff",
		position: "center",
	}),
};

export const createVoiceOverConfigs = {
	polishFemale: (): VoiceOverConfig => ({
		enabled: true,
		language: "pl",
		voice: "female",
		speed: 0.9,
		pitch: 1.0,
		volume: 0.8,
		text: "",
		timing: [],
	}),

	polishMale: (): VoiceOverConfig => ({
		enabled: true,
		language: "pl",
		voice: "male",
		speed: 1.0,
		pitch: 0.9,
		volume: 0.8,
		text: "",
		timing: [],
	}),

	englishFemale: (): VoiceOverConfig => ({
		enabled: true,
		language: "en",
		voice: "female",
		speed: 1.0,
		pitch: 1.1,
		volume: 0.7,
		text: "",
		timing: [],
	}),
};
