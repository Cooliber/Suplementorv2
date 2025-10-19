"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Activity,
	BookOpen,
	Bookmark,
	BookmarkPlus,
	Brain,
	Clock,
	Droplets,
	Dumbbell,
	Heart,
	Layers,
	Pause,
	Play,
	Repeat,
	Repeat1,
	RotateCcw,
	Settings,
	Shuffle,
	SkipBack,
	SkipForward,
	Square,
	Timer,
	Volume2,
	VolumeX,
	Wind,
	Zap,
} from "lucide-react";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";

import {
	type PhysiologicalAnimationController as AnimationController,
	type AnimationController as AnimationControllerType,
	EASING_FUNCTIONS,
	PHYSIOLOGICAL_ANIMATIONS,
	type PhysiologicalAnimation,
	SUPPLEMENT_MOLECULAR_EFFECTS,
} from "@/lib/animations/physiological-animations";

interface PhysiologicalAnimationControllerProps {
	selectedSupplements?: string[];
	onAnimationChange?: (animationId: string, isActive: boolean) => void;
	onSupplementEffectToggle?: (supplementId: string, enabled: boolean) => void;
	className?: string;
	compact?: boolean;
}

interface AnimationSequence {
	id: string;
	name: string;
	polishName: string;
	description: string;
	polishDescription: string;
	animations: string[];
	duration: number;
	educational: boolean;
}

const ANIMATION_SEQUENCES: AnimationSequence[] = [
	{
		id: "basic-life-processes",
		name: "Basic Life Processes",
		polishName: "Podstawowe procesy życiowe",
		description: "Essential physiological processes for human life",
		polishDescription: "Niezbędne procesy fizjologiczne dla życia człowieka",
		animations: ["breathing-cycle", "heartbeat-cycle"],
		duration: 8000,
		educational: true,
	},
	{
		id: "nervous-system-activity",
		name: "Nervous System Activity",
		polishName: "Aktywność układu nerwowego",
		description: "Neural communication and brain activity patterns",
		polishDescription: "Komunikacja neuronalna i wzorce aktywności mózgu",
		animations: ["nerve-impulse", "blood-flow-circulation"],
		duration: 10000,
		educational: true,
	},
	{
		id: "muscle-contraction-sequence",
		name: "Muscle Contraction Sequence",
		polishName: "Sekwencja skurczu mięśni",
		description: "Complete muscle contraction and relaxation cycle",
		polishDescription: "Pełny cykl skurczu i rozkurczu mięśni",
		animations: ["muscle-contraction"],
		duration: 2000,
		educational: true,
	},
	{
		id: "endocrine-harmony",
		name: "Endocrine Harmony",
		polishName: "Harmonia endokrynna",
		description: "Hormone production and regulation processes",
		polishDescription: "Procesy produkcji i regulacji hormonów",
		animations: ["hormone-release"],
		duration: 3000,
		educational: true,
	},
];

export const PhysiologicalAnimationController: React.FC<
	PhysiologicalAnimationControllerProps
> = ({
	selectedSupplements = [],
	onAnimationChange,
	onSupplementEffectToggle,
	className = "",
	compact = false,
}) => {
	const animationControllerRef = useRef<AnimationController | null>(null);
	const [activeAnimations, setActiveAnimations] = useState<string[]>([]);
	const [currentSequence, setCurrentSequence] =
		useState<AnimationSequence | null>(null);
	const [sequenceProgress, setSequenceProgress] = useState(0);
	const [isPlaying, setIsPlaying] = useState(false);
	const [playbackSpeed, setPlaybackSpeed] = useState(1);
	const [loopMode, setLoopMode] = useState<"none" | "sequence" | "all">(
		"sequence",
	);
	const [audioEnabled, setAudioEnabled] = useState(true);
	const [bookmarks, setBookmarks] = useState<string[]>([]);
	const [currentTime, setCurrentTime] = useState(0);
	const [selectedAnimation, setSelectedAnimation] = useState<string | null>(
		null,
	);

	// Initialize animation controller
	useEffect(() => {
		animationControllerRef.current = new PhysiologicalAnimationController();

		animationControllerRef.current.setAnimationUpdateCallback(
			(animationId, progress) => {
				setCurrentTime(
					progress *
						PHYSIOLOGICAL_ANIMATIONS.find((a) => a.id === animationId)
							?.duration || 0,
				);

				// Update sequence progress if playing a sequence
				if (currentSequence) {
					const totalDuration = currentSequence.duration;
					const elapsedTime = activeAnimations.reduce((total, animId) => {
						const animation = PHYSIOLOGICAL_ANIMATIONS.find(
							(a) => a.id === animId,
						);
						return total + (animation ? animation.duration * progress : 0);
					}, 0);
					setSequenceProgress(
						Math.min(100, (elapsedTime / totalDuration) * 100),
					);
				}
			},
		);

		return () => {
			animationControllerRef.current?.dispose();
		};
	}, [currentSequence]);

	const startAnimation = useCallback(
		(animationId: string) => {
			if (!animationControllerRef.current) return;

			animationControllerRef.current.startAnimation(animationId, {
				playbackSpeed,
				loop: loopMode !== "none",
				onUpdate: (progress) => {
					setCurrentTime(
						progress *
							PHYSIOLOGICAL_ANIMATIONS.find((a) => a.id === animationId)
								?.duration || 0,
					);
				},
			});

			setActiveAnimations((prev) => [...prev, animationId]);
			setSelectedAnimation(animationId);
			setIsPlaying(true);
			onAnimationChange?.(animationId, true);
		},
		[playbackSpeed, loopMode, onAnimationChange],
	);

	const pauseAllAnimations = useCallback(() => {
		if (!animationControllerRef.current) return;

		activeAnimations.forEach((animationId) => {
			animationControllerRef.current?.pauseAnimation(animationId);
		});
		setIsPlaying(false);
	}, [activeAnimations]);

	const resumeAllAnimations = useCallback(() => {
		if (!animationControllerRef.current) return;

		activeAnimations.forEach((animationId) => {
			animationControllerRef.current?.resumeAnimation(animationId);
		});
		setIsPlaying(true);
	}, [activeAnimations]);

	const stopAllAnimations = useCallback(() => {
		if (!animationControllerRef.current) return;

		activeAnimations.forEach((animationId) => {
			animationControllerRef.current?.stopAnimation(animationId);
		});
		setActiveAnimations([]);
		setIsPlaying(false);
		setCurrentTime(0);
		setSequenceProgress(0);
		onAnimationChange?.("", false);
	}, [activeAnimations, onAnimationChange]);

	const startSequence = useCallback(
		(sequence: AnimationSequence) => {
			setCurrentSequence(sequence);
			setSequenceProgress(0);

			// Start all animations in the sequence
			sequence.animations.forEach((animationId, index) => {
				setTimeout(() => {
					startAnimation(animationId);
				}, index * 500); // Stagger start times
			});
		},
		[startAnimation],
	);

	const addBookmark = useCallback(() => {
		if (selectedAnimation && currentTime > 0) {
			const bookmarkId = `${selectedAnimation}-${Math.round(currentTime)}`;
			setBookmarks((prev) => [...prev, bookmarkId]);
		}
	}, [selectedAnimation, currentTime]);

	const jumpToBookmark = useCallback(
		(bookmarkId: string) => {
			const [animationId, timeStr] = bookmarkId.split("-");
			const time = Number.parseInt(timeStr);

			if (animationControllerRef.current) {
				// Stop current animation and restart at bookmark time
				if (selectedAnimation) {
					animationControllerRef.current.stopAnimation(selectedAnimation);
					setTimeout(() => {
						animationControllerRef.current?.startAnimation(animationId, {
							playbackSpeed,
							loop: loopMode !== "none",
						});
					}, 100);
				}
				setSelectedAnimation(animationId);
				setCurrentTime(time);
			}
		},
		[selectedAnimation, playbackSpeed, loopMode],
	);

	const getAnimationIcon = (animationType: string) => {
		switch (animationType) {
			case "breathing":
				return <Wind className="h-4 w-4" />;
			case "heartbeat":
				return <Heart className="h-4 w-4" />;
			case "muscle_contraction":
				return <Dumbbell className="h-4 w-4" />;
			case "nerve_impulse":
				return <Zap className="h-4 w-4" />;
			case "blood_flow":
				return <Droplets className="h-4 w-4" />;
			case "hormone_release":
				return <Activity className="h-4 w-4" />;
			default:
				return <Activity className="h-4 w-4" />;
		}
	};

	const getLoopIcon = () => {
		switch (loopMode) {
			case "none":
				return <Square className="h-4 w-4" />;
			case "sequence":
				return <Repeat className="h-4 w-4" />;
			case "all":
				return <Repeat1 className="h-4 w-4" />;
			default:
				return <Repeat className="h-4 w-4" />;
		}
	};

	if (compact) {
		return (
			<Card className={`w-full ${className}`}>
				<CardContent className="p-4">
					<div className="flex items-center gap-2">
						<Button
							size="sm"
							variant={isPlaying ? "default" : "outline"}
							onClick={isPlaying ? pauseAllAnimations : resumeAllAnimations}
						>
							{isPlaying ? (
								<Pause className="h-3 w-3" />
							) : (
								<Play className="h-3 w-3" />
							)}
						</Button>

						<div className="flex-1">
							<Progress value={sequenceProgress} className="h-2" />
						</div>

						<span className="text-gray-500 text-xs">
							{Math.round(currentTime)}ms
						</span>

						<Button
							size="sm"
							variant="outline"
							onClick={() =>
								setLoopMode((prev) => (prev === "none" ? "sequence" : "none"))
							}
						>
							{getLoopIcon()}
						</Button>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className={`space-y-4 ${className}`}>
			{/* Main Animation Controller */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Settings className="h-5 w-5" />
						Kontroler animacji fizjologicznych
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					{/* Playback Controls */}
					<div className="flex items-center gap-2">
						<Button
							size="sm"
							variant={isPlaying ? "default" : "outline"}
							onClick={isPlaying ? pauseAllAnimations : resumeAllAnimations}
						>
							{isPlaying ? (
								<Pause className="h-4 w-4" />
							) : (
								<Play className="h-4 w-4" />
							)}
						</Button>

						<Button size="sm" variant="outline" onClick={stopAllAnimations}>
							<Square className="h-4 w-4" />
						</Button>

						<Button
							size="sm"
							variant="outline"
							onClick={() =>
								setLoopMode((prev) => {
									const modes: Array<"none" | "sequence" | "all"> = [
										"none",
										"sequence",
										"all",
									];
									const currentIndex = modes.indexOf(prev);
									return modes[(currentIndex + 1) % modes.length];
								})
							}
						>
							{getLoopIcon()}
						</Button>

						<div className="flex-1">
							<Progress value={sequenceProgress} className="h-2" />
						</div>

						<span className="font-mono text-sm">
							{Math.round(currentTime)}ms
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
					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<span className="text-sm">Prędkość odtwarzania</span>
							<Badge variant="outline">{playbackSpeed.toFixed(1)}x</Badge>
						</div>
						<Slider
							value={[playbackSpeed]}
							onValueChange={([value]) => setPlaybackSpeed(value || 1)}
							min={0.1}
							max={3}
							step={0.1}
							className="w-full"
						/>
					</div>

					{/* Animation Tabs */}
					<Tabs defaultValue="individual" className="w-full">
						<TabsList className="grid w-full grid-cols-3">
							<TabsTrigger value="individual">Pojedyncze</TabsTrigger>
							<TabsTrigger value="sequences">Sekwencje</TabsTrigger>
							<TabsTrigger value="supplements">Suplementy</TabsTrigger>
						</TabsList>

						<TabsContent value="individual" className="space-y-3">
							<div className="grid grid-cols-2 gap-2">
								{PHYSIOLOGICAL_ANIMATIONS.map((animation) => (
									<Button
										key={animation.id}
										size="sm"
										variant={
											activeAnimations.includes(animation.id)
												? "default"
												: "outline"
										}
										className="flex h-auto flex-col items-start p-3"
										onClick={() => {
											if (activeAnimations.includes(animation.id)) {
												animationControllerRef.current?.stopAnimation(
													animation.id,
												);
												setActiveAnimations((prev) =>
													prev.filter((id) => id !== animation.id),
												);
												onAnimationChange?.(animation.id, false);
											} else {
												startAnimation(animation.id);
											}
										}}
									>
										<div className="flex w-full items-center gap-2">
											{getAnimationIcon(animation.animationType)}
											<span className="font-medium text-xs">
												{animation.polishName}
											</span>
										</div>
										<span className="mt-1 text-gray-500 text-xs">
											{animation.duration}ms
										</span>
									</Button>
								))}
							</div>
						</TabsContent>

						<TabsContent value="sequences" className="space-y-3">
							<div className="space-y-2">
								{ANIMATION_SEQUENCES.map((sequence) => (
									<Card key={sequence.id} className="p-3">
										<div className="flex items-center justify-between">
											<div className="flex-1">
												<h4 className="font-medium text-sm">
													{sequence.polishName}
												</h4>
												<p className="text-gray-500 text-xs">
													{sequence.polishDescription}
												</p>
												<div className="mt-1 flex items-center gap-2">
													<Badge variant="outline" className="text-xs">
														{sequence.duration}ms
													</Badge>
													{sequence.educational && (
														<Badge variant="secondary" className="text-xs">
															<BookOpen className="mr-1 h-2 w-2" />
															Edukacyjna
														</Badge>
													)}
												</div>
											</div>
											<Button
												size="sm"
												onClick={() => startSequence(sequence)}
												disabled={activeAnimations.length > 0}
											>
												<Play className="h-3 w-3" />
											</Button>
										</div>
									</Card>
								))}
							</div>
						</TabsContent>

						<TabsContent value="supplements" className="space-y-3">
							<div className="space-y-2">
								{SUPPLEMENT_MOLECULAR_EFFECTS.map((effect) => (
									<Card key={effect.supplementId} className="p-3">
										<div className="flex items-center justify-between">
											<div className="flex-1">
												<h4 className="font-medium text-sm">
													{effect.polishSupplementName}
												</h4>
												<p className="text-gray-500 text-xs">
													{effect.polishMechanism}
												</p>
												<div className="mt-1 flex items-center gap-2">
													<div
														className="h-3 w-3 rounded-full"
														style={{
															backgroundColor: effect.visualEffect.color,
														}}
													/>
													<Badge variant="outline" className="text-xs">
														{effect.targetOrgans.length} narządów
													</Badge>
												</div>
											</div>
											<Switch
												checked={selectedSupplements.includes(
													effect.supplementId,
												)}
												onCheckedChange={(checked) => {
													onSupplementEffectToggle?.(
														effect.supplementId,
														checked,
													);
												}}
											/>
										</div>
									</Card>
								))}
							</div>
						</TabsContent>
					</Tabs>

					{/* Bookmarks */}
					{bookmarks.length > 0 && (
						<div className="space-y-2">
							<div className="flex items-center gap-2">
								<Bookmark className="h-4 w-4" />
								<span className="font-medium text-sm">Zakładki</span>
								<Button size="sm" variant="outline" onClick={addBookmark}>
									<BookmarkPlus className="h-3 w-3" />
								</Button>
							</div>
							<div className="flex flex-wrap gap-1">
								{bookmarks.slice(-8).map((bookmark) => (
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
						</div>
					)}

					{/* Current Animation Info */}
					{selectedAnimation && (
						<Card className="bg-blue-50">
							<CardContent className="p-3">
								<div className="flex items-center justify-between">
									<div>
										<h4 className="font-medium text-sm">
											{
												PHYSIOLOGICAL_ANIMATIONS.find(
													(a) => a.id === selectedAnimation,
												)?.polishName
											}
										</h4>
										<p className="text-gray-600 text-xs">
											Czas: {Math.round(currentTime)}ms /{" "}
											{
												PHYSIOLOGICAL_ANIMATIONS.find(
													(a) => a.id === selectedAnimation,
												)?.duration
											}
											ms
										</p>
									</div>
									<div className="flex items-center gap-1">
										<Clock className="h-3 w-3" />
										<span className="text-xs">
											{Math.round(
												(currentTime /
													(PHYSIOLOGICAL_ANIMATIONS.find(
														(a) => a.id === selectedAnimation,
													)?.duration || 1)) *
													100,
											)}
											%
										</span>
									</div>
								</div>
							</CardContent>
						</Card>
					)}
				</CardContent>
			</Card>
		</div>
	);
};
