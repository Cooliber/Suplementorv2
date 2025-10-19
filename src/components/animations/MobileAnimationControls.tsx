"use client";

/**
 * Mobile-Optimized Animation Controls for Suplementor
 * Touch-friendly animation playback controls with gesture support
 */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import {
	Activity,
	Eye,
	EyeOff,
	Hand,
	Mic,
	MicOff,
	Pause,
	Play,
	RotateCcw,
	Settings,
	SkipBack,
	SkipForward,
	Square,
	Timer,
	Volume2,
	VolumeX,
	Zap,
} from "lucide-react";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";

import {
	DEFAULT_MOBILE_ANIMATION_CONFIG,
	type GestureCallbacks,
	type MobileAnimationConfig,
	MobileAnimationState,
	VOICE_COMMANDS,
} from "@/lib/animations/mobile-touch-interfaces";
import { useAdvancedTouchGestures } from "@/lib/animations/useAdvancedTouchGestures";

interface MobileAnimationControlsProps {
	sequenceId?: string;
	onStepChange?: (stepId: string, progress: number) => void;
	onAnimationTrigger?: (animationId: string, stepId: string) => void;
	className?: string;
	autoPlay?: boolean;
	showEducationalContent?: boolean;
	enableAudio?: boolean;
	config?: Partial<MobileAnimationConfig>;
}

interface TimelineStep {
	id: string;
	name: string;
	polishName: string;
	description: string;
	polishDescription: string;
	animationId: string;
	duration: number;
	startTime: number;
	endTime: number;
}

const EDUCATIONAL_SEQUENCES: Record<string, TimelineStep[]> = {
	"breathing-tutorial": [
		{
			id: "inhalation-preparation",
			name: "Inhalation Preparation",
			polishName: "Przygotowanie do wdechu",
			description: "Diaphragm contracts and chest cavity expands",
			polishDescription:
				"Przepona się kurczy, a jama klatki piersiowej rozszerza",
			animationId: "breathing-cycle",
			duration: 1000,
			startTime: 0,
			endTime: 1000,
		},
		{
			id: "air-intake",
			name: "Air Intake",
			polishName: "Pobieranie powietrza",
			description: "Air flows into lungs due to pressure difference",
			polishDescription: "Powietrze wpływa do płuc z powodu różnicy ciśnień",
			animationId: "breathing-cycle",
			duration: 1500,
			startTime: 1000,
			endTime: 2500,
		},
	],
};

export const MobileAnimationControls: React.FC<
	MobileAnimationControlsProps
> = ({
	sequenceId = "breathing-tutorial",
	onStepChange,
	onAnimationTrigger,
	className = "",
	autoPlay = false,
	showEducationalContent = true,
	enableAudio = true,
	config = {},
}) => {
	const mobileConfig = { ...DEFAULT_MOBILE_ANIMATION_CONFIG, ...config };

	const [currentStepIndex, setCurrentStepIndex] = useState(0);
	const [isPlaying, setIsPlaying] = useState(autoPlay);
	const [playbackSpeed, setPlaybackSpeed] = useState(1);
	const [currentTime, setCurrentTime] = useState(0);
	const [audioEnabled, setAudioEnabled] = useState(enableAudio);
	const [voiceControlActive, setVoiceControlActive] = useState(false);
	const [gestureMode, setGestureMode] = useState<
		"swipe" | "pinch" | "pressure" | "combined"
	>("combined");
	const [showAdvancedControls, setShowAdvancedControls] = useState(false);

	const intervalRef = useRef<NodeJS.Timeout | null>(null);
	const recognitionRef = useRef<SpeechRecognition | null>(null);

	const sequence =
		EDUCATIONAL_SEQUENCES[sequenceId] ||
		EDUCATIONAL_SEQUENCES["breathing-tutorial"];
	const currentStep = sequence[currentStepIndex];
	const totalDuration = sequence.reduce(
		(total, step) => total + step.duration,
		0,
	);

	// Gesture callbacks for animation control
	const gestureCallbacks: GestureCallbacks = {
		onSwipe: (gesture) => {
			if (!mobileConfig.enableTouchGestures) return;

			switch (gesture.direction) {
				case "left":
					nextStep();
					break;
				case "right":
					previousStep();
					break;
				case "up":
					if (gesture.velocity > 0.5) {
						setPlaybackSpeed((prev) => Math.min(3, prev + 0.2));
					}
					break;
				case "down":
					if (gesture.velocity > 0.5) {
						setPlaybackSpeed((prev) => Math.max(0.1, prev - 0.2));
					}
					break;
			}
		},

		onPinch: (gesture) => {
			if (
				!mobileConfig.enableTouchGestures ||
				(gestureMode !== "pinch" && gestureMode !== "combined")
			)
				return;

			// Use pinch for zoom-like speed control
			const speedMultiplier = gesture.scale;
			const newSpeed = Math.max(0.1, Math.min(3, speedMultiplier));
			setPlaybackSpeed(newSpeed);
		},

		onPressure: (gesture) => {
			if (!mobileConfig.enablePressureSensitivity) return;

			// Use pressure for dynamic speed control
			const pressureNormalized = gesture.pressure;
			const speedFromPressure = 0.5 + pressureNormalized * 1.5; // 0.5x to 2x speed
			setPlaybackSpeed(speedFromPressure);
		},

		onTap: (gesture) => {
			if (gesture.tapCount === 2) {
				// Double tap to toggle play/pause
				setIsPlaying((prev) => !prev);
			}
		},

		onLongPress: (gesture) => {
			// Long press for advanced controls
			setShowAdvancedControls(true);
		},
	};

	const {
		gestureState,
		touchHandlers,
		animationState,
		updateAnimationState,
		triggerHapticFeedback,
		processVoiceCommand,
	} = useAdvancedTouchGestures(gestureCallbacks, {
		enabled: mobileConfig.enableTouchGestures,
		enablePressure: mobileConfig.enablePressureSensitivity,
		enableHapticFeedback: mobileConfig.enableHapticFeedback,
		hapticIntensity: 0.7,
	});

	// Auto-advance through steps
	useEffect(() => {
		if (isPlaying) {
			intervalRef.current = setInterval(() => {
				setCurrentTime((prev) => {
					const newTime = prev + 16 * playbackSpeed;

					if (currentStep && newTime >= currentStep.endTime) {
						const nextStepIndex = (currentStepIndex + 1) % sequence.length;
						setCurrentStepIndex(nextStepIndex);

						onAnimationTrigger?.(
							currentStep.animationId,
							sequence[nextStepIndex].id,
						);

						return sequence[nextStepIndex].startTime;
					}

					return newTime;
				});
			}, 16);
		} else {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
				intervalRef.current = null;
			}
		}

		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		};
	}, [
		isPlaying,
		currentStepIndex,
		currentStep,
		playbackSpeed,
		sequence,
		onAnimationTrigger,
	]);

	// Voice control setup
	useEffect(() => {
		if (voiceControlActive && "webkitSpeechRecognition" in window) {
			const SpeechRecognition = window.webkitSpeechRecognition;
			recognitionRef.current = new SpeechRecognition();

			recognitionRef.current.continuous = true;
			recognitionRef.current.interimResults = false;
			recognitionRef.current.lang = mobileConfig.polishInterface
				? "pl-PL"
				: "en-US";

			recognitionRef.current.onresult = (event) => {
				const transcript =
					event.results[event.results.length - 1][0].transcript;
				const command = processVoiceCommand(transcript);

				if (command) {
					handleVoiceCommand(command);
					triggerHapticFeedback([20, 30, 20]);
				}
			};

			recognitionRef.current.start();

			return () => {
				recognitionRef.current?.stop();
			};
		}
	}, [
		voiceControlActive,
		mobileConfig.polishInterface,
		processVoiceCommand,
		triggerHapticFeedback,
	]);

	const playPause = useCallback(() => {
		setIsPlaying((prev) => !prev);
		triggerHapticFeedback(isPlaying ? [50, 30, 50] : [30, 50]);
	}, [isPlaying, triggerHapticFeedback]);

	const stop = useCallback(() => {
		setIsPlaying(false);
		setCurrentTime(0);
		setCurrentStepIndex(0);
		triggerHapticFeedback([100, 50, 100]);
	}, [triggerHapticFeedback]);

	const nextStep = useCallback(() => {
		if (currentStepIndex < sequence.length - 1) {
			const nextIndex = currentStepIndex + 1;
			setCurrentStepIndex(nextIndex);
			setCurrentTime(sequence[nextIndex].startTime);
			onAnimationTrigger?.(
				sequence[nextIndex].animationId,
				sequence[nextIndex].id,
			);
			triggerHapticFeedback([30, 20]);
		}
	}, [currentStepIndex, sequence, onAnimationTrigger, triggerHapticFeedback]);

	const previousStep = useCallback(() => {
		if (currentStepIndex > 0) {
			const prevIndex = currentStepIndex - 1;
			setCurrentStepIndex(prevIndex);
			setCurrentTime(sequence[prevIndex].startTime);
			onAnimationTrigger?.(
				sequence[prevIndex].animationId,
				sequence[prevIndex].id,
			);
			triggerHapticFeedback([30, 20]);
		}
	}, [currentStepIndex, sequence, onAnimationTrigger, triggerHapticFeedback]);

	const handleVoiceCommand = useCallback(
		(command: any) => {
			switch (command.action) {
				case "play":
					setIsPlaying(true);
					break;
				case "pause":
					setIsPlaying(false);
					break;
				case "stop":
					stop();
					break;
				case "nextStep":
					nextStep();
					break;
				case "previousStep":
					previousStep();
					break;
				case "increaseSpeed":
					setPlaybackSpeed((prev) =>
						Math.min(3, prev * (command.parameters?.factor || 1.5)),
					);
					break;
				case "decreaseSpeed":
					setPlaybackSpeed((prev) =>
						Math.max(0.1, prev * (command.parameters?.factor || 0.7)),
					);
					break;
			}
		},
		[stop, nextStep, previousStep],
	);

	const toggleVoiceControl = useCallback(() => {
		setVoiceControlActive((prev) => !prev);
		triggerHapticFeedback([40, 30]);
	}, [triggerHapticFeedback]);

	const stepProgress = currentStep
		? ((currentTime - currentStep.startTime) / currentStep.duration) * 100
		: 0;

	const overallProgress = (currentTime / totalDuration) * 100;

	return (
		<div className={`space-y-3 ${className}`} {...touchHandlers}>
			{/* Main Playback Controls - Mobile Optimized */}
			<Card className="touch-manipulation">
				<CardContent className="p-4">
					<div className="flex items-center gap-3">
						{/* Previous Step */}
						<Button
							size="lg"
							variant="outline"
							onClick={previousStep}
							disabled={currentStepIndex === 0}
							className="min-h-[48px] min-w-[48px] touch-manipulation p-0"
						>
							<SkipBack className="h-5 w-5" />
						</Button>

						{/* Play/Pause - Large touch target */}
						<Button
							size="lg"
							variant={isPlaying ? "default" : "outline"}
							onClick={playPause}
							className="min-h-[64px] min-w-[64px] touch-manipulation rounded-full"
						>
							{isPlaying ? (
								<Pause className="h-6 w-6" />
							) : (
								<Play className="h-6 w-6" />
							)}
						</Button>

						{/* Next Step */}
						<Button
							size="lg"
							variant="outline"
							onClick={nextStep}
							disabled={currentStepIndex === sequence.length - 1}
							className="min-h-[48px] min-w-[48px] touch-manipulation p-0"
						>
							<SkipForward className="h-5 w-5" />
						</Button>

						{/* Stop */}
						<Button
							size="lg"
							variant="outline"
							onClick={stop}
							className="min-h-[48px] min-w-[48px] touch-manipulation p-0"
						>
							<Square className="h-5 w-5" />
						</Button>
					</div>

					{/* Progress Bar - Touch draggable */}
					<div className="mt-4 space-y-2">
						<div className="flex justify-between text-sm">
							<span>
								Krok {currentStepIndex + 1} z {sequence.length}
							</span>
							<span>
								{Math.round(currentTime)}ms / {totalDuration}ms
							</span>
						</div>
						<div className="relative">
							<Progress
								value={overallProgress}
								className="h-3 cursor-pointer touch-manipulation"
								onClick={(e) => {
									// Allow clicking on progress bar to scrub
									const rect = e.currentTarget.getBoundingClientRect();
									const clickX = e.clientX - rect.left;
									const percentage = clickX / rect.width;
									const newTime = percentage * totalDuration;
									setCurrentTime(newTime);

									// Find appropriate step
									const stepIndex = sequence.findIndex(
										(step) =>
											newTime >= step.startTime && newTime <= step.endTime,
									);
									if (stepIndex !== -1) {
										setCurrentStepIndex(stepIndex);
									}
								}}
							/>
						</div>
					</div>

					{/* Speed Control - Touch optimized */}
					<div className="mt-4 flex items-center gap-3">
						<span className="font-medium text-sm">Prędkość:</span>
						<div className="flex-1">
							<Slider
								value={[playbackSpeed]}
								onValueChange={([value]) => setPlaybackSpeed(value || 1)}
								min={0.1}
								max={3}
								step={0.1}
								className="touch-manipulation"
							/>
						</div>
						<Badge variant="outline" className="min-w-[40px] text-center">
							{playbackSpeed.toFixed(1)}x
						</Badge>
					</div>
				</CardContent>
			</Card>

			{/* Current Step Display - Mobile friendly */}
			{currentStep && (
				<Card className="border-blue-200 bg-blue-50">
					<CardHeader className="pb-3">
						<CardTitle className="flex items-center justify-between text-base">
							<span className="flex items-center gap-2">
								{gestureState.isActive && (
									<Hand className="h-4 w-4 text-blue-600" />
								)}
								{currentStep.polishName}
							</span>
							<Badge variant="outline" className="text-xs">
								Krok {currentStepIndex + 1}
							</Badge>
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3">
						{/* Step Progress */}
						<div className="space-y-2">
							<div className="flex justify-between text-sm">
								<span>Postęp kroku</span>
								<span>{Math.round(stepProgress)}%</span>
							</div>
							<Progress value={stepProgress} className="h-2" />
						</div>

						{/* Description */}
						<p className="text-gray-700 text-sm leading-relaxed">
							{currentStep.polishDescription}
						</p>

						{/* Gesture Mode Indicator */}
						<div className="flex items-center justify-between rounded-lg bg-white/50 p-2">
							<span className="font-medium text-xs">Tryb gestów:</span>
							<div className="flex gap-1">
								{(["swipe", "pinch", "pressure", "combined"] as const).map(
									(mode) => (
										<Button
											key={mode}
											size="sm"
											variant={gestureMode === mode ? "default" : "outline"}
											className="h-7 px-2 text-xs"
											onClick={() => {
												setGestureMode(mode);
												triggerHapticFeedback(20);
											}}
										>
											{mode === "swipe" && "↔️"}
											{mode === "pinch" && "🔍"}
											{mode === "pressure" && "💪"}
											{mode === "combined" && "🎛️"}
										</Button>
									),
								)}
							</div>
						</div>
					</CardContent>
				</Card>
			)}

			{/* Mobile Control Panel */}
			<Card>
				<CardContent className="p-3">
					<div className="grid grid-cols-4 gap-2">
						{/* Audio Toggle */}
						<Button
							size="sm"
							variant={audioEnabled ? "default" : "outline"}
							onClick={() => setAudioEnabled(!audioEnabled)}
							className="flex min-h-[44px] touch-manipulation flex-col gap-1"
						>
							{audioEnabled ? (
								<Volume2 className="h-4 w-4" />
							) : (
								<VolumeX className="h-4 w-4" />
							)}
							<span className="text-xs">Audio</span>
						</Button>

						{/* Voice Control */}
						<Button
							size="sm"
							variant={voiceControlActive ? "default" : "outline"}
							onClick={toggleVoiceControl}
							className="flex min-h-[44px] touch-manipulation flex-col gap-1"
						>
							{voiceControlActive ? (
								<Mic className="h-4 w-4" />
							) : (
								<MicOff className="h-4 w-4" />
							)}
							<span className="text-xs">Głos</span>
						</Button>

						{/* Advanced Controls */}
						<Button
							size="sm"
							variant={showAdvancedControls ? "default" : "outline"}
							onClick={() => setShowAdvancedControls(!showAdvancedControls)}
							className="flex min-h-[44px] touch-manipulation flex-col gap-1"
						>
							<Settings className="h-4 w-4" />
							<span className="text-xs">Więcej</span>
						</Button>

						{/* Gesture Feedback */}
						<Button
							size="sm"
							variant="outline"
							className="flex min-h-[44px] touch-manipulation flex-col gap-1"
							disabled
						>
							<Activity className="h-4 w-4" />
							<span className="text-xs">
								{gestureState.touchCount > 0
									? `${gestureState.touchCount}🔥`
									: "Gest"}
							</span>
						</Button>
					</div>

					{/* Advanced Controls Panel */}
					{showAdvancedControls && (
						<div className="mt-3 space-y-3 border-t pt-3">
							{/* Gesture Sensitivity */}
							<div className="space-y-2">
								<div className="flex items-center justify-between">
									<span className="text-sm">Czułość gestów</span>
									<Badge variant="outline" className="text-xs">
										{gestureState.velocity.toFixed(2)}
									</Badge>
								</div>
								<Progress
									value={(gestureState.velocity / 2) * 100}
									className="h-2"
								/>
							</div>

							{/* Pressure Sensitivity */}
							{mobileConfig.enablePressureSensitivity && (
								<div className="space-y-2">
									<div className="flex items-center justify-between">
										<span className="text-sm">Ciśnienie</span>
										<Badge variant="outline" className="text-xs">
											{gestureState.pressure.toFixed(2)}
										</Badge>
									</div>
									<Progress
										value={gestureState.pressure * 100}
										className="h-2"
									/>
								</div>
							)}

							{/* Voice Commands Help */}
							{voiceControlActive && (
								<div className="rounded-lg bg-green-50 p-3">
									<h4 className="mb-2 font-medium text-green-800 text-sm">
										Polecenia głosowe
									</h4>
									<div className="grid grid-cols-2 gap-1 text-xs">
										{VOICE_COMMANDS.slice(0, 6).map((cmd, index) => (
											<div key={index} className="text-green-700">
												"{cmd.polishCommand}"
											</div>
										))}
									</div>
								</div>
							)}
						</div>
					)}
				</CardContent>
			</Card>

			{/* Step Navigation - Mobile optimized grid */}
			<Card>
				<CardHeader className="pb-3">
					<CardTitle className="text-sm">Szybka nawigacja</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-2 gap-2">
						{sequence.map((step, index) => (
							<Button
								key={step.id}
								size="sm"
								variant={index === currentStepIndex ? "default" : "outline"}
								className="flex h-auto touch-manipulation flex-col items-start p-3"
								onClick={() => {
									setCurrentStepIndex(index);
									setCurrentTime(step.startTime);
									onAnimationTrigger?.(step.animationId, step.id);
									triggerHapticFeedback(25);
								}}
							>
								<div className="flex w-full items-center gap-2">
									<span className="font-medium text-xs">{step.polishName}</span>
								</div>
								<span className="mt-1 text-gray-500 text-xs">
									{step.duration}ms
								</span>
							</Button>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
};
