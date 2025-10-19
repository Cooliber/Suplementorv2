"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Environment,
	Html,
	OrbitControls,
	Stats,
	Text,
} from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
	Activity,
	Brain,
	Dna,
	Eye,
	EyeOff,
	Heart,
	Info,
	Microscope,
	Pause,
	Pill,
	Play,
	RotateCcw,
	Settings,
	Volume2,
	VolumeX,
	Zap,
} from "lucide-react";
import type React from "react";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Color, type Group, Vector3 } from "three";

import {
	AdvancedPhysicsEngine,
	BIOLOGICAL_PHYSICS_CONFIGS,
} from "@/lib/animations/advanced-physics-engine";
// Import our advanced particle systems
import {
	CELLULAR_PARTICLE_SYSTEMS,
	CellularParticleSystem,
} from "@/lib/animations/cellular-particle-systems";
import {
	MOLECULAR_INTERACTION_SYSTEMS,
	MolecularInteractionSystem,
} from "@/lib/animations/molecular-interaction-systems";
import {
	PHYSIOLOGICAL_SIMULATIONS,
	PhysiologicalSimulationSystem,
} from "@/lib/animations/physiological-process-simulations";
import {
	BIOLOGICAL_PROCESS_ANNOTATIONS,
	CELLULAR_STRUCTURE_ANNOTATIONS,
	PolishLanguageManager,
} from "@/lib/animations/polish-language-integration";

interface AdvancedCellularVisualizationProps {
	supplementId?: string;
	visualizationType?:
		| "cellular"
		| "molecular"
		| "physiological"
		| "multi-scale";
	autoPlay?: boolean;
	showControls?: boolean;
	showEducationalContent?: boolean;
	className?: string;
	onProgress?: (progress: number) => void;
	onInteraction?: (interaction: string) => void;
}

// Main visualization component
export const AdvancedCellularVisualization: React.FC<
	AdvancedCellularVisualizationProps
> = ({
	supplementId,
	visualizationType = "cellular",
	autoPlay = true,
	showControls = true,
	showEducationalContent = true,
	className = "",
	onProgress,
	onInteraction,
}) => {
	const [isPlaying, setIsPlaying] = useState(autoPlay);
	const [currentSystem, setCurrentSystem] = useState<string>("blood-flow");
	const [animationSpeed, setAnimationSpeed] = useState(1);
	const [showAnnotations, setShowAnnotations] = useState(true);
	const [showTrails, setShowTrails] = useState(true);
	const [audioEnabled, setAudioEnabled] = useState(false);
	const [currentStep, setCurrentStep] = useState(0);
	const [performanceMode, setPerformanceMode] = useState<
		"high" | "medium" | "low"
	>("medium");

	// Refs for particle systems
	const cellularSystemRef = useRef<CellularParticleSystem>();
	const molecularSystemRef = useRef<MolecularInteractionSystem>();
	const physiologicalSystemRef = useRef<PhysiologicalSimulationSystem>();
	const physicsEngineRef = useRef<AdvancedPhysicsEngine>();
	const polishManagerRef = useRef<PolishLanguageManager>();

	// Initialize systems
	useEffect(() => {
		// Initialize Polish language manager
		polishManagerRef.current = new PolishLanguageManager();

		// Initialize educational annotations
		CELLULAR_STRUCTURE_ANNOTATIONS.forEach((annotation, index) => {
			const id = `structure-${index}`;
			const position = new Vector3(
				(Math.random() - 0.5) * 4,
				(Math.random() - 0.5) * 4,
				0,
			);

			const fullAnnotation = {
				id,
				position,
				...annotation,
			};

			polishManagerRef.current?.addAnnotation(fullAnnotation);
		});

		// Initialize physics engine
		physicsEngineRef.current = new AdvancedPhysicsEngine("multi-scale");

		return () => {
			// Cleanup
			cellularSystemRef.current?.dispose();
			molecularSystemRef.current?.dispose();
			physiologicalSystemRef.current?.dispose();
			physicsEngineRef.current?.dispose();
		};
	}, []);

	// Update current system when type changes
	useEffect(() => {
		switch (visualizationType) {
			case "cellular": {
				if (cellularSystemRef.current) {
					cellularSystemRef.current.dispose();
				}
				const cellularConfig = CELLULAR_PARTICLE_SYSTEMS[currentSystem];
				if (cellularConfig) {
					cellularSystemRef.current = new CellularParticleSystem(
						cellularConfig,
					);
				}
				break;
			}

			case "molecular": {
				if (molecularSystemRef.current) {
					molecularSystemRef.current.dispose();
				}
				const molecularConfig = MOLECULAR_INTERACTION_SYSTEMS[currentSystem];
				if (molecularConfig) {
					molecularSystemRef.current = new MolecularInteractionSystem(
						100,
						molecularConfig,
						{
							particles: [],
							temperature: 310,
							viscosity: 0.001,
							gravity: new Vector3(0, 0, 0),
						},
					);
				}
				break;
			}

			case "physiological": {
				if (physiologicalSystemRef.current) {
					physiologicalSystemRef.current.dispose();
				}
				const physiologicalConfig = PHYSIOLOGICAL_SIMULATIONS[currentSystem];
				if (physiologicalConfig) {
					physiologicalSystemRef.current = new PhysiologicalSimulationSystem(
						100,
						physiologicalConfig,
						{
							particles: [],
							temperature: 310,
							viscosity: 0.001,
							gravity: new Vector3(0, 0, 0),
						},
					);
				}
				break;
			}
		}
	}, [visualizationType, currentSystem]);

	// Animation loop
	useEffect(() => {
		if (!isPlaying) return;

		const animate = () => {
			if (!isPlaying) return;

			const deltaTime = 1 / 60; // 60 FPS

			// Update particle systems
			if (cellularSystemRef.current) {
				cellularSystemRef.current.update(deltaTime * animationSpeed);
			}
			if (molecularSystemRef.current) {
				molecularSystemRef.current.update(deltaTime * animationSpeed);
			}
			if (physiologicalSystemRef.current) {
				physiologicalSystemRef.current.update(deltaTime * animationSpeed);
			}
			if (physicsEngineRef.current) {
				physicsEngineRef.current.update(deltaTime * animationSpeed);
			}

			// Update step counter
			setCurrentStep((prev) => (prev + 1) % 100);

			requestAnimationFrame(animate);
		};

		const animationId = requestAnimationFrame(animate);
		return () => cancelAnimationFrame(animationId);
	}, [isPlaying, animationSpeed]);

	const handleSystemChange = (systemId: string) => {
		setCurrentSystem(systemId);
		onInteraction?.(`system-changed:${systemId}`);
	};

	const handlePlayPause = () => {
		setIsPlaying(!isPlaying);
		onInteraction?.(isPlaying ? "paused" : "played");
	};

	const handleReset = () => {
		setCurrentStep(0);
		// Reset particle systems
		if (cellularSystemRef.current) {
			cellularSystemRef.current.dispose();
			const config = CELLULAR_PARTICLE_SYSTEMS[currentSystem];
			if (config) {
				cellularSystemRef.current = new CellularParticleSystem(config);
			}
		}
		onInteraction?.("reset");
	};

	return (
		<Card className={`w-full ${className}`}>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Microscope className="h-5 w-5" />
					Zaawansowana wizualizacja komórkowa
				</CardTitle>
				<p className="text-gray-600 text-sm">
					Interaktywne symulacje procesów biologicznych na poziomie molekularnym
				</p>
			</CardHeader>

			<CardContent className="space-y-4">
				{/* 3D Visualization Canvas */}
				<div
					className="relative overflow-hidden rounded-lg bg-gray-900"
					style={{ height: "500px" }}
				>
					<Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
						<Suspense fallback={null}>
							<VisualizationScene
								visualizationType={visualizationType}
								currentSystem={currentSystem}
								isPlaying={isPlaying}
								showAnnotations={showAnnotations}
								showTrails={showTrails}
								performanceMode={performanceMode}
								cellularSystemRef={cellularSystemRef}
								molecularSystemRef={molecularSystemRef}
								physiologicalSystemRef={physiologicalSystemRef}
								physicsEngineRef={physicsEngineRef}
								polishManagerRef={polishManagerRef}
								onProgress={onProgress}
							/>
							<OrbitControls
								enablePan={true}
								enableZoom={true}
								enableRotate={true}
							/>
							<Environment preset="city" />
							{process.env.NODE_ENV === "development" && <Stats />}
						</Suspense>
					</Canvas>

					{/* Overlay UI */}
					<div className="absolute top-4 left-4 space-y-2">
						<Badge variant="secondary" className="bg-black/70 text-white">
							Krok: {currentStep}
						</Badge>
						{isPlaying && (
							<Badge variant="default" className="bg-green-600">
								<Activity className="mr-1 h-3 w-3" />
								Aktywna
							</Badge>
						)}
					</div>

					{/* Educational annotations overlay */}
					{showEducationalContent && showAnnotations && (
						<AnnotationOverlay
							polishManagerRef={polishManagerRef}
							visualizationType={visualizationType}
						/>
					)}
				</div>

				{/* Controls */}
				{showControls && (
					<div className="space-y-4">
						{/* Playback controls */}
						<div className="flex items-center gap-2">
							<Button
								size="sm"
								variant={isPlaying ? "default" : "outline"}
								onClick={handlePlayPause}
							>
								{isPlaying ? (
									<Pause className="h-4 w-4" />
								) : (
									<Play className="h-4 w-4" />
								)}
							</Button>

							<Button size="sm" variant="outline" onClick={handleReset}>
								<RotateCcw className="h-4 w-4" />
							</Button>

							<div className="flex-1">
								<Slider
									value={[animationSpeed]}
									onValueChange={([value]) => setAnimationSpeed(value || 1)}
									min={0.1}
									max={3}
									step={0.1}
									className="w-full"
								/>
							</div>

							<Badge variant="outline">{animationSpeed.toFixed(1)}x</Badge>
						</div>

						{/* System selection */}
						<div className="grid grid-cols-2 gap-2">
							<div className="space-y-2">
								<Label className="font-medium text-sm">Typ wizualizacji</Label>
								<Select
									value={visualizationType}
									onValueChange={(value: any) => setCurrentSystem(value)}
								>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="cellular">Procesy komórkowe</SelectItem>
										<SelectItem value="molecular">
											Interakcje molekularne
										</SelectItem>
										<SelectItem value="physiological">
											Procesy fizjologiczne
										</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-2">
								<Label className="font-medium text-sm">System</Label>
								<Select
									value={currentSystem}
									onValueChange={handleSystemChange}
								>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{Object.entries(
											visualizationType === "cellular"
												? CELLULAR_PARTICLE_SYSTEMS
												: visualizationType === "molecular"
													? MOLECULAR_INTERACTION_SYSTEMS
													: PHYSIOLOGICAL_SIMULATIONS,
										).map(([id, config]: [string, any]) => (
											<SelectItem key={id} value={id}>
												{config.polishName}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>

						{/* Display options */}
						<div className="grid grid-cols-2 gap-4">
							<div className="flex items-center space-x-2">
								<Switch
									id="annotations"
									checked={showAnnotations}
									onCheckedChange={setShowAnnotations}
								/>
								<Label htmlFor="annotations" className="text-sm">
									Adnotacje edukacyjne
								</Label>
							</div>

							<div className="flex items-center space-x-2">
								<Switch
									id="trails"
									checked={showTrails}
									onCheckedChange={setShowTrails}
								/>
								<Label htmlFor="trails" className="text-sm">
									Ślady cząsteczek
								</Label>
							</div>

							<div className="flex items-center space-x-2">
								<Switch
									id="audio"
									checked={audioEnabled}
									onCheckedChange={setAudioEnabled}
								/>
								<Label htmlFor="audio" className="text-sm">
									Wyjaśnienia głosowe
								</Label>
							</div>

							<div className="space-y-2">
								<Label className="font-medium text-sm">Jakość</Label>
								<Select
									value={performanceMode}
									onValueChange={(value: any) => setPerformanceMode(value)}
								>
									<SelectTrigger className="h-8">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="low">Niska</SelectItem>
										<SelectItem value="medium">Średnia</SelectItem>
										<SelectItem value="high">Wysoka</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>

						{/* Educational content tabs */}
						{showEducationalContent && (
							<Tabs defaultValue="overview" className="w-full">
								<TabsList className="grid w-full grid-cols-3">
									<TabsTrigger value="overview">Przegląd</TabsTrigger>
									<TabsTrigger value="details">Szczegóły</TabsTrigger>
									<TabsTrigger value="quiz">Quiz</TabsTrigger>
								</TabsList>

								<TabsContent value="overview" className="space-y-2">
									<div className="text-gray-600 text-sm">
										<p>
											Aktualny system:{" "}
											<strong>
												{CELLULAR_PARTICLE_SYSTEMS[currentSystem]?.polishName}
											</strong>
										</p>
										<p>
											{
												CELLULAR_PARTICLE_SYSTEMS[currentSystem]
													?.polishDescription
											}
										</p>
									</div>
								</TabsContent>

								<TabsContent value="details" className="space-y-2">
									<div className="text-gray-600 text-sm">
										<p>
											Typ wizualizacji: <strong>{visualizationType}</strong>
										</p>
										<p>
											Liczba cząsteczek: <strong>~100</strong>
										</p>
										<p>
											Prędkość animacji: <strong>{animationSpeed}x</strong>
										</p>
									</div>
								</TabsContent>

								<TabsContent value="quiz" className="space-y-2">
									<QuizComponent
										polishManagerRef={polishManagerRef}
										currentSystem={currentSystem}
										onInteraction={onInteraction}
									/>
								</TabsContent>
							</Tabs>
						)}
					</div>
				)}
			</CardContent>
		</Card>
	);
};

// 3D Scene component
interface VisualizationSceneProps {
	visualizationType: string;
	currentSystem: string;
	isPlaying: boolean;
	showAnnotations: boolean;
	showTrails: boolean;
	performanceMode: "high" | "medium" | "low";
	cellularSystemRef: React.MutableRefObject<CellularParticleSystem | undefined>;
	molecularSystemRef: React.MutableRefObject<
		MolecularInteractionSystem | undefined
	>;
	physiologicalSystemRef: React.MutableRefObject<
		PhysiologicalSimulationSystem | undefined
	>;
	physicsEngineRef: React.MutableRefObject<AdvancedPhysicsEngine | undefined>;
	polishManagerRef: React.MutableRefObject<PolishLanguageManager | undefined>;
	onProgress?: (progress: number) => void;
}

const VisualizationScene: React.FC<VisualizationSceneProps> = ({
	visualizationType,
	currentSystem,
	isPlaying,
	showAnnotations,
	showTrails,
	performanceMode,
	cellularSystemRef,
	molecularSystemRef,
	physiologicalSystemRef,
	physicsEngineRef,
	polishManagerRef,
	onProgress,
}) => {
	const groupRef = useRef<Group>(null);

	// Render appropriate particle system
	const renderParticleSystem = () => {
		switch (visualizationType) {
			case "cellular":
				return cellularSystemRef.current?.getMesh();
			case "molecular":
				return molecularSystemRef.current?.getMesh();
			case "physiological":
				return physiologicalSystemRef.current?.getMesh();
			default:
				return null;
		}
	};

	// Render anatomical structures for physiological simulations
	const renderAnatomicalStructures = () => {
		if (
			visualizationType === "physiological" &&
			physiologicalSystemRef.current
		) {
			return (
				<primitive
					object={physiologicalSystemRef.current.getAnatomicalStructures()}
				/>
			);
		}
		return null;
	};

	useFrame((state) => {
		if (groupRef.current) {
			// Update camera based on system
			const time = state.clock.elapsedTime;
			const radius = 8;
			const height = Math.sin(time * 0.1) * 2;

			state.camera.position.x = Math.cos(time * 0.2) * radius;
			state.camera.position.z = Math.sin(time * 0.2) * radius;
			state.camera.position.y = height;
			state.camera.lookAt(0, 0, 0);
		}

		// Update progress
		onProgress?.((state.clock.elapsedTime % 100) / 100);
	});

	return (
		<group ref={groupRef}>
			{/* Lighting */}
			<ambientLight intensity={0.6} />
			<pointLight position={[10, 10, 10]} intensity={0.8} />
			<pointLight position={[-10, -10, -10]} intensity={0.4} color="#4444ff" />

			{/* Particle system */}
			{renderParticleSystem()}

			{/* Anatomical structures */}
			{renderAnatomicalStructures()}

			{/* Educational annotations */}
			{showAnnotations && polishManagerRef.current && (
				<EducationalAnnotations
					polishManager={polishManagerRef.current}
					currentSystem={currentSystem}
				/>
			)}

			{/* Background grid */}
			<gridHelper args={[20, 40]} />
		</group>
	);
};

// Educational annotations component
interface EducationalAnnotationsProps {
	polishManager: PolishLanguageManager;
	currentSystem: string;
}

const EducationalAnnotations: React.FC<EducationalAnnotationsProps> = ({
	polishManager,
	currentSystem,
}) => {
	const annotations = polishManager.getAllAnnotations();

	return (
		<group>
			{annotations.map((annotation) => (
				<Html
					key={annotation.id}
					position={[
						annotation.position.x,
						annotation.position.y + 0.5,
						annotation.position.z,
					]}
					center
				>
					<div className="max-w-xs rounded bg-black/80 p-2 text-white text-xs">
						<div className="font-semibold">{annotation.polishTitle}</div>
						<div className="mt-1 text-gray-300">
							{annotation.polishDescription}
						</div>
						{annotation.importance === "high" && (
							<Badge variant="destructive" className="mt-1 text-xs">
								Ważne
							</Badge>
						)}
					</div>
				</Html>
			))}
		</group>
	);
};

// Quiz component for educational interaction
interface QuizComponentProps {
	polishManagerRef: React.MutableRefObject<PolishLanguageManager | undefined>;
	currentSystem: string;
	onInteraction?: (interaction: string) => void;
}

const QuizComponent: React.FC<QuizComponentProps> = ({
	polishManagerRef,
	currentSystem,
	onInteraction,
}) => {
	const [currentQuestion, setCurrentQuestion] = useState<any>(null);
	const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
	const [showResult, setShowResult] = useState(false);
	const [score, setScore] = useState(0);
	const [totalQuestions, setTotalQuestions] = useState(0);

	useEffect(() => {
		if (polishManagerRef.current) {
			// Generate quiz question based on current system
			const question = polishManagerRef.current.generateQuizQuestion([]);
			setCurrentQuestion(question);
		}
	}, [currentSystem, polishManagerRef]);

	const handleAnswerSelect = (answerIndex: number) => {
		setSelectedAnswer(answerIndex);
		setShowResult(true);

		if (currentQuestion && answerIndex === currentQuestion.correctAnswer) {
			setScore((prev) => prev + 1);
			onInteraction?.("quiz-correct");
		} else {
			onInteraction?.("quiz-incorrect");
		}
		setTotalQuestions((prev) => prev + 1);
	};

	const handleNextQuestion = () => {
		setSelectedAnswer(null);
		setShowResult(false);

		if (polishManagerRef.current) {
			const question = polishManagerRef.current.generateQuizQuestion([]);
			setCurrentQuestion(question);
		}
	};

	if (!currentQuestion) {
		return (
			<div className="py-4 text-center text-gray-500 text-sm">
				Brak dostępnych pytań dla tego systemu
			</div>
		);
	}

	return (
		<div className="space-y-3">
			<div className="font-medium text-sm">
				{currentQuestion.polishQuestion}
			</div>

			<div className="space-y-2">
				{currentQuestion.options.map((option: string, index: number) => (
					<Button
						key={index}
						variant={selectedAnswer === index ? "default" : "outline"}
						size="sm"
						className="w-full justify-start text-left"
						onClick={() => !showResult && handleAnswerSelect(index)}
						disabled={showResult}
					>
						{option}
					</Button>
				))}
			</div>

			{showResult && (
				<div className="space-y-2">
					<div
						className={`rounded p-2 text-sm ${
							selectedAnswer === currentQuestion.correctAnswer
								? "bg-green-100 text-green-800"
								: "bg-red-100 text-red-800"
						}`}
					>
						{selectedAnswer === currentQuestion.correctAnswer
							? "✓ Poprawna odpowiedź!"
							: "✗ Niepoprawna odpowiedź"}
					</div>

					<div className="text-gray-600 text-xs">
						{currentQuestion.polishExplanation}
					</div>

					<Button size="sm" onClick={handleNextQuestion} className="w-full">
						Następne pytanie
					</Button>
				</div>
			)}

			<div className="text-center text-gray-500 text-xs">
				Wynik: {score}/{totalQuestions}
			</div>
		</div>
	);
};

// Annotation overlay component
interface AnnotationOverlayProps {
	polishManagerRef: React.MutableRefObject<PolishLanguageManager | undefined>;
	visualizationType: string;
}

const AnnotationOverlay: React.FC<AnnotationOverlayProps> = ({
	polishManagerRef,
	visualizationType,
}) => {
	const [visibleAnnotations, setVisibleAnnotations] = useState<any[]>([]);

	useEffect(() => {
		if (polishManagerRef.current) {
			const annotations = polishManagerRef.current.getAllAnnotations();
			setVisibleAnnotations(annotations.slice(0, 3)); // Show first 3 annotations
		}
	}, [polishManagerRef, visualizationType]);

	return (
		<div className="absolute right-4 bottom-4 max-w-sm space-y-2">
			{visibleAnnotations.map((annotation) => (
				<div
					key={annotation.id}
					className="rounded bg-black/80 p-3 text-white text-xs"
				>
					<div className="font-semibold">{annotation.polishTitle}</div>
					<div className="mt-1 text-gray-300 text-xs">
						{annotation.polishDescription}
					</div>
				</div>
			))}
		</div>
	);
};

export default AdvancedCellularVisualization;
