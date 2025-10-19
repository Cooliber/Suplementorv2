"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import {
	ArrowLeft,
	ArrowRight,
	BookOpen,
	Bookmark,
	BookmarkPlus,
	CheckCircle,
	Circle,
	Clock,
	Info,
	Lightbulb,
	Pause,
	Play,
	RotateCcw,
	SkipBack,
	SkipForward,
	Square,
	StepBack,
	StepForward,
	Timer,
	Volume2,
	VolumeX,
} from "lucide-react";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";

import {
	EASING_FUNCTIONS,
	PHYSIOLOGICAL_ANIMATIONS,
	type PhysiologicalAnimation,
} from "@/lib/animations/physiological-animations";

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
	educationalContent: {
		learningObjectives: string[];
		polishLearningObjectives: string[];
		keyPoints: string[];
		polishKeyPoints: string[];
		clinicalRelevance: string;
		polishClinicalRelevance: string;
	};
	visualCues: {
		highlightOrgans: string[];
		showPathways: string[];
		particleEffects: string[];
	};
	audioNarration?: {
		text: string;
		polishText: string;
		timing: number;
	};
}

interface AnimationTimelineProps {
	sequenceId?: string;
	onStepChange?: (stepId: string, progress: number) => void;
	onAnimationTrigger?: (animationId: string, stepId: string) => void;
	className?: string;
	autoPlay?: boolean;
	showEducationalContent?: boolean;
	enableAudio?: boolean;
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
			educationalContent: {
				learningObjectives: [
					"Understand diaphragm movement",
					"Learn chest expansion mechanics",
				],
				polishLearningObjectives: [
					"Zrozumieć ruch przepony",
					"Nauczyć się mechaniki rozszerzania klatki piersiowej",
				],
				keyPoints: [
					"Diaphragm contracts downward",
					"Intercostal muscles lift ribs",
					"Chest cavity volume increases",
				],
				polishKeyPoints: [
					"Przepona kurczy się w dół",
					"Mięśnie międzyżebrowe unoszą żebra",
					"Objętość jamy klatki piersiowej zwiększa się",
				],
				clinicalRelevance: "Essential for understanding respiratory disorders",
				polishClinicalRelevance:
					"Niezbędne do zrozumienia zaburzeń oddechowych",
			},
			visualCues: {
				highlightOrgans: ["diaphragm", "lungs"],
				showPathways: [],
				particleEffects: ["blood-cells"],
			},
			audioNarration: {
				text: "During inhalation, the diaphragm contracts and moves downward, while the intercostal muscles contract to lift the ribs upward and outward.",
				polishText:
					"Podczas wdechu przepona kurczy się i porusza w dół, podczas gdy mięśnie międzyżebrowe kurczą się, unosząc żebra w górę i na zewnątrz.",
				timing: 0,
			},
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
			educationalContent: {
				learningObjectives: [
					"Understand pressure gradients",
					"Learn gas exchange principles",
				],
				polishLearningObjectives: [
					"Zrozumieć gradienty ciśnienia",
					"Nauczyć się zasad wymiany gazowej",
				],
				keyPoints: [
					"Negative pressure in lungs",
					"Air flows from high to low pressure",
					"Oxygen enters alveoli",
				],
				polishKeyPoints: [
					"Ujemne ciśnienie w płucach",
					"Powietrze płynie z wysokiego do niskiego ciśnienia",
					"Tlen wchodzi do pęcherzyków płucnych",
				],
				clinicalRelevance: "Critical for ventilation assessment",
				polishClinicalRelevance: "Kluczowe dla oceny wentylacji",
			},
			visualCues: {
				highlightOrgans: ["lungs"],
				showPathways: ["respiratory-pathways"],
				particleEffects: ["blood-cells", "cellular-energy"],
			},
			audioNarration: {
				text: "As the chest cavity expands, pressure inside the lungs decreases, creating a vacuum that draws air in through the airways.",
				polishText:
					"Gdy jama klatki piersiowej rozszerza się, ciśnienie wewnątrz płuc spada, tworząc próżnię, która zasysa powietrze przez drogi oddechowe.",
				timing: 1000,
			},
		},
		{
			id: "gas-exchange",
			name: "Gas Exchange",
			polishName: "Wymiana gazowa",
			description: "Oxygen and carbon dioxide exchange in alveoli",
			polishDescription:
				"Wymiana tlenu i dwutlenku węgla w pęcherzykach płucnych",
			animationId: "breathing-cycle",
			duration: 1500,
			startTime: 2500,
			endTime: 4000,
			educationalContent: {
				learningObjectives: [
					"Understand diffusion process",
					"Learn about partial pressures",
				],
				polishLearningObjectives: [
					"Zrozumieć proces dyfuzji",
					"Nauczyć się o ciśnieniach parcjalnych",
				],
				keyPoints: [
					"Oxygen diffuses into blood",
					"Carbon dioxide diffuses out",
					"Driven by partial pressure gradients",
				],
				polishKeyPoints: [
					"Tlen dyfunduje do krwi",
					"Dwutlenek węgla dyfunduje na zewnątrz",
					"Prowadzone przez gradienty ciśnień parcjalnych",
				],
				clinicalRelevance:
					"Essential for understanding hypoxemia and hypercapnia",
				polishClinicalRelevance:
					"Niezbędne do zrozumienia hipoksemii i hiperkapnii",
			},
			visualCues: {
				highlightOrgans: ["lungs"],
				showPathways: ["capillary-network"],
				particleEffects: ["blood-cells", "cellular-energy"],
			},
			audioNarration: {
				text: "In the alveoli, oxygen diffuses from the air into the bloodstream, while carbon dioxide moves from the blood into the lungs to be exhaled.",
				polishText:
					"W pęcherzykach płucnych tlen dyfunduje z powietrza do krwi, podczas gdy dwutlenek węgla przenika z krwi do płuc, aby zostać wydalony.",
				timing: 2500,
			},
		},
	],
	"heartbeat-tutorial": [
		{
			id: "atrial-contraction",
			name: "Atrial Contraction",
			polishName: "Skurcz przedsionków",
			description: "Atria contract to push blood into ventricles",
			polishDescription: "Przedsionki kurczą się, aby wpchnąć krew do komór",
			animationId: "heartbeat-cycle",
			duration: 200,
			startTime: 0,
			endTime: 200,
			educationalContent: {
				learningObjectives: [
					"Understand cardiac electrical activity",
					"Learn about atrial systole",
				],
				polishLearningObjectives: [
					"Zrozumieć elektryczną aktywność serca",
					"Nauczyć się o skurczu przedsionków",
				],
				keyPoints: [
					"SA node initiates signal",
					"Atria contract simultaneously",
					"Blood flows to ventricles",
				],
				polishKeyPoints: [
					"Węzeł SA inicjuje sygnał",
					"Przedsionki kurczą się jednocześnie",
					"Krew płynie do komór",
				],
				clinicalRelevance: "Important for understanding arrhythmias",
				polishClinicalRelevance: "Ważne dla zrozumienia arytmii",
			},
			visualCues: {
				highlightOrgans: ["heart"],
				showPathways: ["electrical-pathways"],
				particleEffects: ["blood-cells"],
			},
		},
		{
			id: "ventricular-contraction",
			name: "Ventricular Contraction",
			polishName: "Skurcz komór",
			description: "Ventricles contract to pump blood to body and lungs",
			polishDescription:
				"Komory kurczą się, aby pompować krew do organizmu i płuc",
			animationId: "heartbeat-cycle",
			duration: 300,
			startTime: 200,
			endTime: 500,
			educationalContent: {
				learningObjectives: [
					"Understand ventricular systole",
					"Learn about cardiac output",
				],
				polishLearningObjectives: [
					"Zrozumieć skurcz komór",
					"Nauczyć się o wydajności serca",
				],
				keyPoints: [
					"AV node delays signal",
					"Ventricles contract from apex up",
					"Blood ejected through arteries",
				],
				polishKeyPoints: [
					"Węzeł AV opóźnia sygnał",
					"Komory kurczą się od koniuszka w górę",
					"Krew wyrzucana przez tętnice",
				],
				clinicalRelevance: "Critical for assessing heart failure",
				polishClinicalRelevance: "Kluczowe dla oceny niewydolności serca",
			},
			visualCues: {
				highlightOrgans: ["heart"],
				showPathways: ["arterial-pathways"],
				particleEffects: ["blood-cells"],
			},
		},
		{
			id: "ventricular-relaxation",
			name: "Ventricular Relaxation",
			polishName: "Rozkurcz komór",
			description: "Ventricles relax and refill with blood",
			polishDescription: "Komory rozkurczają się i ponownie wypełniają krwią",
			animationId: "heartbeat-cycle",
			duration: 300,
			startTime: 500,
			endTime: 800,
			educationalContent: {
				learningObjectives: [
					"Understand ventricular diastole",
					"Learn about filling pressures",
				],
				polishLearningObjectives: [
					"Zrozumieć rozkurcz komór",
					"Nauczyć się o ciśnieniach napełniania",
				],
				keyPoints: [
					"Ventricles relax",
					"AV valves open",
					"Blood flows from atria",
				],
				polishKeyPoints: [
					"Komory rozkurczają się",
					"Zastawki AV otwierają się",
					"Krew płynie z przedsionków",
				],
				clinicalRelevance: "Essential for understanding diastolic dysfunction",
				polishClinicalRelevance:
					"Niezbędne do zrozumienia dysfunkcji rozkurczowej",
			},
			visualCues: {
				highlightOrgans: ["heart"],
				showPathways: ["venous-return"],
				particleEffects: ["blood-cells"],
			},
		},
	],
};

export const AnimationTimeline: React.FC<AnimationTimelineProps> = ({
	sequenceId = "breathing-tutorial",
	onStepChange,
	onAnimationTrigger,
	className = "",
	autoPlay = false,
	showEducationalContent = true,
	enableAudio = true,
}) => {
	const [currentStepIndex, setCurrentStepIndex] = useState(0);
	const [isPlaying, setIsPlaying] = useState(autoPlay);
	const [playbackSpeed, setPlaybackSpeed] = useState(1);
	const [currentTime, setCurrentTime] = useState(0);
	const [audioEnabled, setAudioEnabled] = useState(enableAudio);
	const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
	const [bookmarks, setBookmarks] = useState<string[]>([]);

	const intervalRef = useRef<NodeJS.Timeout | null>(null);
	const audioContextRef = useRef<AudioContext | null>(null);

	const sequence =
		EDUCATIONAL_SEQUENCES[sequenceId] ||
		EDUCATIONAL_SEQUENCES["breathing-tutorial"];

	if (!sequence) return null;

	const currentStep = sequence[currentStepIndex];
	if (!currentStep) return null;
	const totalDuration = sequence.reduce(
		(total, step) => total + step.duration,
		0,
	);

	// Auto-advance through steps
	useEffect(() => {
		if (isPlaying) {
			intervalRef.current = setInterval(() => {
				setCurrentTime((prev) => {
					const newTime = prev + 16 * playbackSpeed; // 60fps

					// Check if we should advance to next step
					if (newTime >= currentStep.endTime) {
						const nextStepIndex = (currentStepIndex + 1) % sequence.length;
						const nextStep = sequence[nextStepIndex];
						if (!nextStep) return newTime;

						setCurrentStepIndex(nextStepIndex);
						setCompletedSteps((prev) => new Set([...prev, currentStep.id]));

						// Trigger animation for new step
						onAnimationTrigger?.(currentStep.animationId, nextStep.id);

						return nextStep.startTime;
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

	// Trigger initial animation
	useEffect(() => {
		if (currentStep) {
			onAnimationTrigger?.(currentStep.animationId, currentStep.id);
			onStepChange?.(currentStep.id, 0);
		}
	}, [currentStep, onAnimationTrigger, onStepChange]);

	const playPause = useCallback(() => {
		setIsPlaying((prev) => !prev);
	}, []);

	const stop = useCallback(() => {
		setIsPlaying(false);
		setCurrentTime(0);
		setCurrentStepIndex(0);
		setCompletedSteps(new Set());
	}, []);

	const nextStep = useCallback(() => {
		if (currentStepIndex < sequence.length - 1) {
			const nextIndex = currentStepIndex + 1;
			const nextSequenceStep = sequence[nextIndex];
			if (!nextSequenceStep) return;

			setCurrentStepIndex(nextIndex);
			setCurrentTime(nextSequenceStep.startTime);
			setCompletedSteps((prev) => new Set([...prev, currentStep.id]));
			onAnimationTrigger?.(nextSequenceStep.animationId, nextSequenceStep.id);
		}
	}, [currentStepIndex, sequence, currentStep, onAnimationTrigger]);

	const previousStep = useCallback(() => {
		if (currentStepIndex > 0) {
			const prevIndex = currentStepIndex - 1;
			const prevSequenceStep = sequence[prevIndex];
			if (!prevSequenceStep) return;

			setCurrentStepIndex(prevIndex);
			setCurrentTime(prevSequenceStep.startTime);
			onAnimationTrigger?.(prevSequenceStep.animationId, prevSequenceStep.id);
		}
	}, [currentStepIndex, sequence, onAnimationTrigger]);

	const jumpToStep = useCallback(
		(stepIndex: number) => {
			const targetStep = sequence[stepIndex];
			if (!targetStep) return;

			setCurrentStepIndex(stepIndex);
			setCurrentTime(targetStep.startTime);
			setCompletedSteps(
				(prev) =>
					new Set([...prev, ...sequence.slice(0, stepIndex).map((s) => s.id)]),
			);
			onAnimationTrigger?.(targetStep.animationId, targetStep.id);
		},
		[sequence, onAnimationTrigger],
	);

	const addBookmark = useCallback(() => {
		const bookmarkId = `${currentStep.id}-${Math.round(currentTime)}`;
		setBookmarks((prev) => [...prev, bookmarkId]);
	}, [currentStep, currentTime]);

	const jumpToBookmark = useCallback(
		(bookmarkId: string) => {
			const [stepId, timeStr] = bookmarkId.split("-");
			const time = Number.parseInt(timeStr);

			const stepIndex = sequence.findIndex((step) => step.id === stepId);
			if (stepIndex !== -1) {
				jumpToStep(stepIndex);
				setCurrentTime(time);
			}
		},
		[sequence, jumpToStep],
	);

	const playAudioNarration = useCallback(
		async (text: string) => {
			if (!audioEnabled || !("speechSynthesis" in window)) return;

			const utterance = new SpeechSynthesisUtterance(text);
			utterance.lang = "pl-PL"; // Polish language
			utterance.rate = 0.9;
			utterance.pitch = 1;

			window.speechSynthesis.speak(utterance);
		},
		[audioEnabled],
	);

	// Play audio when step changes
	useEffect(() => {
		if (currentStep?.audioNarration && audioEnabled) {
			playAudioNarration(currentStep.audioNarration.polishText);
		}
	}, [currentStep, audioEnabled, playAudioNarration]);

	const stepProgress = currentStep
		? ((currentTime - currentStep.startTime) / currentStep.duration) * 100
		: 0;

	const overallProgress = (currentTime / totalDuration) * 100;

	return (
		<div className={`space-y-4 ${className}`}>
			{/* Timeline Controls */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<BookOpen className="h-5 w-5" />
						Oś czasu edukacyjna - {sequence[0]?.polishName}
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					{/* Playback Controls */}
					<div className="flex items-center gap-2">
						<Button
							size="sm"
							variant="outline"
							onClick={previousStep}
							disabled={currentStepIndex === 0}
						>
							<SkipBack className="h-4 w-4" />
						</Button>

						<Button
							size="sm"
							variant={isPlaying ? "default" : "outline"}
							onClick={playPause}
						>
							{isPlaying ? (
								<Pause className="h-4 w-4" />
							) : (
								<Play className="h-4 w-4" />
							)}
						</Button>

						<Button size="sm" variant="outline" onClick={stop}>
							<Square className="h-4 w-4" />
						</Button>

						<Button
							size="sm"
							variant="outline"
							onClick={nextStep}
							disabled={currentStepIndex === sequence.length - 1}
						>
							<SkipForward className="h-4 w-4" />
						</Button>

						<div className="mx-4 flex-1">
							<Progress value={overallProgress} className="h-2" />
						</div>

						<span className="font-mono text-sm">
							{Math.round(currentTime)}ms / {totalDuration}ms
						</span>

						<Button
							size="sm"
							variant="outline"
							onClick={() => setAudioEnabled(!audioEnabled)}
						>
							{audioEnabled ? (
								<Volume2 className="h-4 w-4" />
							) : (
								<VolumeX className="h-4 w-4" />
							)}
						</Button>
					</div>

					{/* Speed Control */}
					<div className="flex items-center gap-4">
						<span className="text-sm">Prędkość:</span>
						<Slider
							value={[playbackSpeed]}
							onValueChange={([value]) => setPlaybackSpeed(value || 1)}
							min={0.5}
							max={2}
							step={0.1}
							className="flex-1"
						/>
						<Badge variant="outline">{playbackSpeed.toFixed(1)}x</Badge>
					</div>
				</CardContent>
			</Card>

			{/* Current Step Display */}
			{currentStep && (
				<Card className="border-blue-200 bg-blue-50">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							{completedSteps.has(currentStep.id) ? (
								<CheckCircle className="h-5 w-5 text-green-600" />
							) : (
								<Circle className="h-5 w-5 text-blue-600" />
							)}
							<span>
								Krok {currentStepIndex + 1} z {sequence.length}
							</span>
							<Badge variant="outline">{currentStep.polishName}</Badge>
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						{/* Step Progress */}
						<div className="space-y-2">
							<div className="flex justify-between text-sm">
								<span>Postęp kroku</span>
								<span>{Math.round(stepProgress)}%</span>
							</div>
							<Progress value={stepProgress} className="h-2" />
						</div>

						{/* Description */}
						<p className="text-gray-700 text-sm">
							{currentStep.polishDescription}
						</p>

						{/* Educational Content */}
						{showEducationalContent && (
							<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
								<div className="space-y-2">
									<h4 className="flex items-center gap-2 font-medium text-sm">
										<Lightbulb className="h-4 w-4" />
										Cele nauki
									</h4>
									<ul className="space-y-1 text-xs">
										{currentStep.educationalContent.polishLearningObjectives.map(
											(objective, index) => (
												<li key={index} className="flex items-start gap-2">
													<ArrowRight className="mt-0.5 h-3 w-3 flex-shrink-0" />
													{objective}
												</li>
											),
										)}
									</ul>
								</div>

								<div className="space-y-2">
									<h4 className="flex items-center gap-2 font-medium text-sm">
										<Info className="h-4 w-4" />
										Kluczowe punkty
									</h4>
									<ul className="space-y-1 text-xs">
										{currentStep.educationalContent.polishKeyPoints.map(
											(point, index) => (
												<li key={index} className="flex items-start gap-2">
													<ArrowRight className="mt-0.5 h-3 w-3 flex-shrink-0" />
													{point}
												</li>
											),
										)}
									</ul>
								</div>
							</div>
						)}

						{/* Visual Cues */}
						<div className="flex flex-wrap gap-2">
							{currentStep.visualCues.highlightOrgans.map((organ) => (
								<Badge key={organ} variant="secondary" className="text-xs">
									Narząd: {organ}
								</Badge>
							))}
							{currentStep.visualCues.particleEffects.map((effect) => (
								<Badge key={effect} variant="outline" className="text-xs">
									Efekt: {effect}
								</Badge>
							))}
						</div>

						{/* Clinical Relevance */}
						{showEducationalContent && (
							<div className="rounded-lg bg-green-50 p-3">
								<h4 className="mb-1 font-medium text-green-800 text-sm">
									Znaczenie kliniczne
								</h4>
								<p className="text-green-700 text-xs">
									{currentStep.educationalContent.polishClinicalRelevance}
								</p>
							</div>
						)}
					</CardContent>
				</Card>
			)}

			{/* Step Navigation */}
			<Card>
				<CardHeader>
					<CardTitle className="text-sm">Nawigacja kroków</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
						{sequence.map((step, index) => (
							<Button
								key={step.id}
								size="sm"
								variant={
									index === currentStepIndex
										? "default"
										: completedSteps.has(step.id)
											? "secondary"
											: "outline"
								}
								className="flex h-auto flex-col items-start p-2"
								onClick={() => jumpToStep(index)}
							>
								<div className="flex w-full items-center gap-2">
									{completedSteps.has(step.id) ? (
										<CheckCircle className="h-3 w-3" />
									) : index === currentStepIndex ? (
										<Circle className="h-3 w-3" />
									) : (
										<div className="h-3 w-3 rounded-full border" />
									)}
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

			{/* Bookmarks */}
			{bookmarks.length > 0 && (
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-sm">
							<Bookmark className="h-4 w-4" />
							Zakładki
							<Button size="sm" variant="outline" onClick={addBookmark}>
								<BookmarkPlus className="h-3 w-3" />
							</Button>
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="flex flex-wrap gap-2">
							{bookmarks.map((bookmark) => (
								<Button
									key={bookmark}
									size="sm"
									variant="outline"
									className="h-6 text-xs"
									onClick={() => jumpToBookmark(bookmark)}
								>
									{bookmark.split("-")[1]}ms
								</Button>
							))}
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
};
