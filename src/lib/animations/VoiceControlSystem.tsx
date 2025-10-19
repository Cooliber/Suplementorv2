"use client";

/**
 * Voice Control System for Suplementor Animations
 * Hands-free operation with Polish and English voice commands
 */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	AlertCircle,
	CheckCircle,
	HelpCircle,
	Loader2,
	Mic,
	MicOff,
	Settings,
	Volume2,
	VolumeX,
} from "lucide-react";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";

import { usePolishLocalization } from "./PolishMobileInterface";
import { triggerHapticFeedback } from "./useAdvancedTouchGestures";

interface VoiceCommand {
	id: string;
	command: string;
	polishCommand: string;
	action: string;
	parameters?: Record<string, any>;
	confidence: number;
	category: "playback" | "navigation" | "settings" | "educational";
}

interface VoiceControlCallbacks {
	onPlay?: () => void;
	onPause?: () => void;
	onStop?: () => void;
	onNextStep?: () => void;
	onPreviousStep?: () => void;
	onSpeedChange?: (speed: number) => void;
	onAnimationSelect?: (animationId: string) => void;
	onToggleAudio?: () => void;
	onToggleControls?: () => void;
	onHelp?: () => void;
	onSettings?: () => void;
}

interface VoiceControlConfig {
	language: "pl-PL" | "en-US" | "auto";
	continuousListening: boolean;
	enableInterimResults: boolean;
	confidenceThreshold: number;
	enableHapticFeedback: boolean;
	enableVisualFeedback: boolean;
	maxCommandsHistory: number;
}

interface SpeechRecognitionResult {
	transcript: string;
	confidence: number;
	isFinal: boolean;
}

interface VoiceControlHookReturn {
	isListening: boolean;
	isSupported: boolean;
	currentTranscript: string;
	lastCommand: VoiceCommand | null;
	commandsHistory: VoiceCommand[];
	error: string | null;
	startListening: () => void;
	stopListening: () => void;
	toggleListening: () => void;
	clearHistory: () => void;
	testCommand: (command: string) => VoiceCommand | null;
}

const VOICE_COMMANDS: VoiceCommand[] = [
	// Playback controls
	{
		id: "play",
		command: "play",
		polishCommand: "odtwarzaj",
		action: "play",
		confidence: 0.8,
		category: "playback",
	},
	{
		id: "pause",
		command: "pause",
		polishCommand: "pauza",
		action: "pause",
		confidence: 0.8,
		category: "playback",
	},
	{
		id: "stop",
		command: "stop",
		polishCommand: "zatrzymaj",
		action: "stop",
		confidence: 0.8,
		category: "playback",
	},
	{
		id: "play-animation",
		command: "play animation",
		polishCommand: "włącz animację",
		action: "play",
		confidence: 0.8,
		category: "playback",
	},
	{
		id: "pause-animation",
		command: "pause animation",
		polishCommand: "pauza animacja",
		action: "pause",
		confidence: 0.8,
		category: "playback",
	},

	// Navigation
	{
		id: "next",
		command: "next",
		polishCommand: "następny",
		action: "nextStep",
		confidence: 0.8,
		category: "navigation",
	},
	{
		id: "previous",
		command: "previous",
		polishCommand: "poprzedni",
		action: "previousStep",
		confidence: 0.8,
		category: "navigation",
	},
	{
		id: "next-step",
		command: "next step",
		polishCommand: "następny krok",
		action: "nextStep",
		confidence: 0.8,
		category: "navigation",
	},
	{
		id: "previous-step",
		command: "previous step",
		polishCommand: "poprzedni krok",
		action: "previousStep",
		confidence: 0.8,
		category: "navigation",
	},

	// Speed control
	{
		id: "speed-up",
		command: "speed up",
		polishCommand: "przyspiesz",
		action: "speedChange",
		parameters: { factor: 1.5 },
		confidence: 0.7,
		category: "playback",
	},
	{
		id: "slow-down",
		command: "slow down",
		polishCommand: "zwolnij",
		action: "speedChange",
		parameters: { factor: 0.7 },
		confidence: 0.7,
		category: "playback",
	},
	{
		id: "faster",
		command: "faster",
		polishCommand: "szybciej",
		action: "speedChange",
		parameters: { factor: 1.3 },
		confidence: 0.7,
		category: "playback",
	},
	{
		id: "slower",
		command: "slower",
		polishCommand: "wolniej",
		action: "speedChange",
		parameters: { factor: 0.8 },
		confidence: 0.7,
		category: "playback",
	},

	// Animation selection
	{
		id: "breathing",
		command: "breathing",
		polishCommand: "oddychanie",
		action: "animationSelect",
		parameters: { animationId: "breathing-cycle" },
		confidence: 0.7,
		category: "playback",
	},
	{
		id: "heartbeat",
		command: "heartbeat",
		polishCommand: "serce",
		action: "animationSelect",
		parameters: { animationId: "heartbeat-cycle" },
		confidence: 0.7,
		category: "playback",
	},
	{
		id: "muscle",
		command: "muscle",
		polishCommand: "mięśnie",
		action: "animationSelect",
		parameters: { animationId: "muscle-contraction" },
		confidence: 0.7,
		category: "playback",
	},

	// Audio control
	{
		id: "audio-on",
		command: "audio on",
		polishCommand: "dźwięk włącz",
		action: "toggleAudio",
		confidence: 0.7,
		category: "settings",
	},
	{
		id: "audio-off",
		command: "audio off",
		polishCommand: "dźwięk wyłącz",
		action: "toggleAudio",
		confidence: 0.7,
		category: "settings",
	},
	{
		id: "mute",
		command: "mute",
		polishCommand: "wycisz",
		action: "toggleAudio",
		confidence: 0.7,
		category: "settings",
	},

	// Interface control
	{
		id: "show-controls",
		command: "show controls",
		polishCommand: "pokaż kontrolki",
		action: "toggleControls",
		confidence: 0.7,
		category: "settings",
	},
	{
		id: "hide-controls",
		command: "hide controls",
		polishCommand: "ukryj kontrolki",
		action: "toggleControls",
		confidence: 0.7,
		category: "settings",
	},

	// Help and settings
	{
		id: "help",
		command: "help",
		polishCommand: "pomoc",
		action: "help",
		confidence: 0.8,
		category: "settings",
	},
	{
		id: "settings",
		command: "settings",
		polishCommand: "ustawienia",
		action: "settings",
		confidence: 0.8,
		category: "settings",
	},
];

const DEFAULT_CONFIG: VoiceControlConfig = {
	language: "auto",
	continuousListening: true,
	enableInterimResults: true,
	confidenceThreshold: 0.7,
	enableHapticFeedback: true,
	enableVisualFeedback: true,
	maxCommandsHistory: 10,
};

export const useVoiceControl = (
	callbacks: VoiceControlCallbacks = {},
	config: Partial<VoiceControlConfig> = {},
): VoiceControlHookReturn => {
	const voiceConfig = { ...DEFAULT_CONFIG, ...config };
	const recognitionRef = useRef<SpeechRecognition | null>(null);
	const [isListening, setIsListening] = useState(false);
	const [isSupported, setIsSupported] = useState(false);
	const [currentTranscript, setCurrentTranscript] = useState("");
	const [lastCommand, setLastCommand] = useState<VoiceCommand | null>(null);
	const [commandsHistory, setCommandsHistory] = useState<VoiceCommand[]>([]);
	const [error, setError] = useState<string | null>(null);

	// Check browser support
	useEffect(() => {
		const supported =
			"webkitSpeechRecognition" in window || "SpeechRecognition" in window;
		setIsSupported(supported);

		if (!supported) {
			setError("Speech recognition not supported in this browser");
			return;
		}

		// Initialize speech recognition
		const SpeechRecognition =
			window.webkitSpeechRecognition || window.SpeechRecognition;
		recognitionRef.current = new SpeechRecognition();

		recognitionRef.current.continuous = voiceConfig.continuousListening;
		recognitionRef.current.interimResults = voiceConfig.enableInterimResults;
		recognitionRef.current.maxAlternatives = 3;

		// Set language
		if (voiceConfig.language === "auto") {
			recognitionRef.current.lang = navigator.language;
		} else {
			recognitionRef.current.lang = voiceConfig.language;
		}

		// Event handlers
		recognitionRef.current.onstart = () => {
			setIsListening(true);
			setError(null);
		};

		recognitionRef.current.onend = () => {
			setIsListening(false);
			if (voiceConfig.continuousListening) {
				// Restart listening if continuous mode is enabled
				setTimeout(() => {
					if (recognitionRef.current && !isListening) {
						recognitionRef.current.start();
					}
				}, 100);
			}
		};

		recognitionRef.current.onerror = (event) => {
			setError(`Speech recognition error: ${event.error}`);
			setIsListening(false);
		};

		recognitionRef.current.onresult = (event) => {
			let finalTranscript = "";
			let maxConfidence = 0;

			// Process all results
			for (let i = 0; i < event.results.length; i++) {
				const result = event.results[i];
				const transcript = result[0].transcript.toLowerCase().trim();

				if (result.isFinal) {
					finalTranscript = transcript;
					maxConfidence = Math.max(maxConfidence, result[0].confidence);
				} else if (voiceConfig.enableInterimResults) {
					setCurrentTranscript(transcript);
				}
			}

			if (finalTranscript && maxConfidence >= voiceConfig.confidenceThreshold) {
				setCurrentTranscript(finalTranscript);
				const command = processVoiceCommand(finalTranscript);

				if (command) {
					executeVoiceCommand(command);
				}
			}
		};

		return () => {
			if (recognitionRef.current) {
				recognitionRef.current.stop();
			}
		};
	}, [voiceConfig]);

	// Process voice command from transcript
	const processVoiceCommand = useCallback(
		(transcript: string): VoiceCommand | null => {
			let bestMatch: VoiceCommand | null = null;
			let bestConfidence = 0;

			for (const command of VOICE_COMMANDS) {
				// Check for English commands
				if (transcript.includes(command.command)) {
					const confidence = calculateConfidence(transcript, command.command);
					if (
						confidence > bestConfidence &&
						confidence >= voiceConfig.confidenceThreshold
					) {
						bestMatch = command;
						bestConfidence = confidence;
					}
				}

				// Check for Polish commands
				if (transcript.includes(command.polishCommand)) {
					const confidence = calculateConfidence(
						transcript,
						command.polishCommand,
					);
					if (
						confidence > bestConfidence &&
						confidence >= voiceConfig.confidenceThreshold
					) {
						bestMatch = command;
						bestConfidence = confidence;
					}
				}
			}

			return bestMatch;
		},
		[voiceConfig.confidenceThreshold],
	);

	// Calculate confidence based on string similarity
	const calculateConfidence = (transcript: string, command: string): number => {
		const transcriptWords = transcript.split(" ");
		const commandWords = command.split(" ");

		let matches = 0;
		for (const commandWord of commandWords) {
			if (
				transcriptWords.some(
					(word) => word.includes(commandWord) || commandWord.includes(word),
				)
			) {
				matches++;
			}
		}

		return matches / commandWords.length;
	};

	// Execute voice command
	const executeVoiceCommand = useCallback(
		(command: VoiceCommand) => {
			setLastCommand(command);

			// Add to history
			setCommandsHistory((prev) => {
				const newHistory = [command, ...prev].slice(
					0,
					voiceConfig.maxCommandsHistory,
				);
				return newHistory;
			});

			// Execute callback
			switch (command.action) {
				case "play":
					callbacks.onPlay?.();
					break;
				case "pause":
					callbacks.onPause?.();
					break;
				case "stop":
					callbacks.onStop?.();
					break;
				case "nextStep":
					callbacks.onNextStep?.();
					break;
				case "previousStep":
					callbacks.onPreviousStep?.();
					break;
				case "speedChange": {
					const speedFactor = command.parameters?.factor || 1;
					// This would need current speed from parent component
					callbacks.onSpeedChange?.(speedFactor);
					break;
				}
				case "animationSelect":
					callbacks.onAnimationSelect?.(command.parameters?.animationId);
					break;
				case "toggleAudio":
					callbacks.onToggleAudio?.();
					break;
				case "toggleControls":
					callbacks.onToggleControls?.();
					break;
				case "help":
					callbacks.onHelp?.();
					break;
				case "settings":
					callbacks.onSettings?.();
					break;
			}

			// Haptic feedback
			if (voiceConfig.enableHapticFeedback) {
				triggerHapticFeedback([30, 20, 30]);
			}
		},
		[callbacks, voiceConfig],
	);

	// Control functions
	const startListening = useCallback(() => {
		if (recognitionRef.current && !isListening) {
			recognitionRef.current.start();
		}
	}, [isListening]);

	const stopListening = useCallback(() => {
		if (recognitionRef.current && isListening) {
			recognitionRef.current.stop();
		}
	}, [isListening]);

	const toggleListening = useCallback(() => {
		if (isListening) {
			stopListening();
		} else {
			startListening();
		}
	}, [isListening, startListening, stopListening]);

	const clearHistory = useCallback(() => {
		setCommandsHistory([]);
		setLastCommand(null);
	}, []);

	const testCommand = useCallback(
		(commandText: string): VoiceCommand | null => {
			return processVoiceCommand(commandText.toLowerCase());
		},
		[processVoiceCommand],
	);

	return {
		isListening,
		isSupported,
		currentTranscript,
		lastCommand,
		commandsHistory,
		error,
		startListening,
		stopListening,
		toggleListening,
		clearHistory,
		testCommand,
	};
};

// Voice control component
interface VoiceControlButtonProps {
	callbacks?: VoiceControlCallbacks;
	config?: Partial<VoiceControlConfig>;
	showHistory?: boolean;
	compact?: boolean;
}

export const VoiceControlButton: React.FC<VoiceControlButtonProps> = ({
	callbacks = {},
	config = {},
	showHistory = false,
	compact = false,
}) => {
	const { t } = usePolishLocalization();
	const [showHelp, setShowHelp] = useState(false);

	const {
		isListening,
		isSupported,
		currentTranscript,
		lastCommand,
		commandsHistory,
		error,
		toggleListening,
		clearHistory,
	} = useVoiceControl(callbacks, config);

	if (!isSupported) {
		return (
			<Button
				size="sm"
				variant="outline"
				disabled
				className="opacity-50"
				title="Speech recognition not supported"
			>
				<MicOff className="h-4 w-4" />
				{!compact && <span className="ml-2">Voice Control</span>}
			</Button>
		);
	}

	return (
		<div className="relative">
			{/* Main Voice Control Button */}
			<Button
				size={compact ? "sm" : "default"}
				variant={isListening ? "default" : "outline"}
				onClick={toggleListening}
				className={`transition-all duration-200 ${
					isListening
						? "animate-pulse bg-red-500 text-white hover:bg-red-600"
						: ""
				}`}
			>
				{isListening ? (
					<Mic className="h-4 w-4" />
				) : (
					<MicOff className="h-4 w-4" />
				)}
				{!compact && (
					<span className="ml-2">
						{isListening ? t("voiceControl") : "Voice Control"}
					</span>
				)}
			</Button>

			{/* Status Indicator */}
			{isListening && (
				<div className="-top-1 -right-1 absolute">
					<div className="h-3 w-3 animate-ping rounded-full bg-red-500" />
					<div className="absolute top-0 left-0 h-3 w-3 rounded-full bg-red-500" />
				</div>
			)}

			{/* Current Transcript */}
			{isListening && currentTranscript && (
				<div className="absolute top-full left-0 z-50 mt-2 whitespace-nowrap rounded bg-black/80 px-2 py-1 text-white text-xs">
					"{currentTranscript}"
				</div>
			)}

			{/* Last Command Success Indicator */}
			{lastCommand && (
				<div className="-top-1 -left-1 absolute">
					<CheckCircle className="h-4 w-4 rounded-full bg-white text-green-500" />
				</div>
			)}

			{/* Error Indicator */}
			{error && (
				<div className="-top-1 -left-1 absolute">
					<AlertCircle className="h-4 w-4 rounded-full bg-white text-red-500" />
				</div>
			)}

			{/* Help Button */}
			<Button
				size="sm"
				variant="ghost"
				onClick={() => setShowHelp(!showHelp)}
				className="-bottom-1 -right-1 absolute h-5 w-5 bg-white/80 p-0 hover:bg-white"
			>
				<HelpCircle className="h-3 w-3" />
			</Button>

			{/* Help Panel */}
			{showHelp && (
				<Card className="absolute top-full right-0 z-50 mt-2 w-80">
					<CardContent className="p-4">
						<div className="mb-3 flex items-center justify-between">
							<h4 className="font-medium">{t("voiceCommands")}</h4>
							<Button
								size="sm"
								variant="ghost"
								onClick={() => setShowHelp(false)}
							>
								✕
							</Button>
						</div>

						{/* Command Categories */}
						<div className="space-y-3">
							<div>
								<h5 className="mb-2 font-medium text-sm">Odtwarzanie</h5>
								<div className="grid grid-cols-2 gap-1 text-xs">
									{VOICE_COMMANDS.filter(
										(cmd) => cmd.category === "playback",
									).map((cmd) => (
										<div key={cmd.id} className="rounded bg-gray-50 p-1">
											"{cmd.polishCommand}"
										</div>
									))}
								</div>
							</div>

							<div>
								<h5 className="mb-2 font-medium text-sm">Nawigacja</h5>
								<div className="grid grid-cols-2 gap-1 text-xs">
									{VOICE_COMMANDS.filter(
										(cmd) => cmd.category === "navigation",
									).map((cmd) => (
										<div key={cmd.id} className="rounded bg-gray-50 p-1">
											"{cmd.polishCommand}"
										</div>
									))}
								</div>
							</div>

							<div>
								<h5 className="mb-2 font-medium text-sm">Animacje</h5>
								<div className="grid grid-cols-1 gap-1 text-xs">
									<div className="rounded bg-blue-50 p-1">"oddychanie"</div>
									<div className="rounded bg-blue-50 p-1">"serce"</div>
									<div className="rounded bg-blue-50 p-1">"mięśnie"</div>
								</div>
							</div>
						</div>

						{/* Status */}
						<div className="mt-3 border-t pt-3">
							<div className="flex items-center justify-between text-xs">
								<span>Status:</span>
								<Badge
									variant={isListening ? "default" : "outline"}
									className="text-xs"
								>
									{isListening ? "Słucham" : "Wyłączone"}
								</Badge>
							</div>
							{error && (
								<div className="mt-1 text-red-600 text-xs">{error}</div>
							)}
						</div>
					</CardContent>
				</Card>
			)}

			{/* Commands History */}
			{showHistory && commandsHistory.length > 0 && (
				<Card className="absolute top-full left-0 z-50 mt-2 max-h-48 w-64 overflow-y-auto">
					<CardContent className="p-3">
						<div className="mb-2 flex items-center justify-between">
							<h5 className="font-medium text-sm">Historia poleceń</h5>
							<Button
								size="sm"
								variant="ghost"
								onClick={clearHistory}
								className="text-xs"
							>
								Wyczyść
							</Button>
						</div>
						<div className="space-y-1">
							{commandsHistory.slice(0, 5).map((cmd, index) => (
								<div
									key={index}
									className="flex justify-between rounded bg-gray-50 p-1 text-xs"
								>
									<span>"{cmd.polishCommand}"</span>
									<Badge variant="outline" className="text-xs">
										{cmd.category}
									</Badge>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
};
