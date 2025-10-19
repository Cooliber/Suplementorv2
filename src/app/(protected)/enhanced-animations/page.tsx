"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Activity,
	BookOpen,
	Brain,
	Droplets,
	Dumbbell,
	Eye,
	EyeOff,
	Heart,
	Layers,
	Pause,
	Play,
	RotateCcw,
	Settings,
	Sparkles,
	Timer,
	Volume2,
	Wind,
	Zap,
} from "lucide-react";
import React, { useState, useEffect } from "react";

import { AnimationTimeline } from "@/components/animations/AnimationTimeline";
import { PhysiologicalAnimationController } from "@/components/animations/PhysiologicalAnimationController";
import { EnhancedBodySystemsViewer } from "@/components/body-systems/EnhancedBodySystemsViewer";
import { EnhancedInteractive3DBrainModel } from "@/components/brain/EnhancedInteractive3DBrainModel";
import {
	AdaptiveAnimationRenderer,
	AnimationBookmarkManager,
	PhysiologicalAnimationController as AnimationController,
	AudioNarrationManager,
	PHYSIOLOGICAL_ANIMATIONS,
	POLISH_ANIMATION_LABELS,
	type PhysiologicalAnimation,
	SUPPLEMENT_MOLECULAR_EFFECTS,
	SYSTEM_TRANSITIONS,
} from "@/lib/animations";

export default function EnhancedAnimationsPage() {
	const [selectedSupplements, setSelectedSupplements] = useState<string[]>([
		"omega-3-epa-dha",
		"magnesium-l-threonate",
		"lions-mane-mushroom",
	]);

	const [activeTab, setActiveTab] = useState("body-systems");
	const [currentSystem, setCurrentSystem] = useState("skeletal");
	const [showAnimations, setShowAnimations] = useState(true);
	const [audioEnabled, setAudioEnabled] = useState(true);

	// Animation system refs
	const animationControllerRef = React.useRef<AnimationController | null>(null);
	const audioManagerRef = React.useRef<AudioNarrationManager | null>(null);
	const bookmarkManagerRef = React.useRef<AnimationBookmarkManager | null>(
		null,
	);
	const rendererRef = React.useRef<AdaptiveAnimationRenderer | null>(null);

	// Initialize systems
	useEffect(() => {
		animationControllerRef.current = new AnimationController();
		audioManagerRef.current = new AudioNarrationManager();
		bookmarkManagerRef.current = new AnimationBookmarkManager();
		rendererRef.current = new AdaptiveAnimationRenderer();

		return () => {
			animationControllerRef.current?.dispose();
			audioManagerRef.current?.dispose();
		};
	}, []);

	const handleSupplementToggle = (supplementId: string, enabled: boolean) => {
		setSelectedSupplements((prev) =>
			enabled
				? [...prev, supplementId]
				: prev.filter((id) => id !== supplementId),
		);
	};

	const handleAnimationChange = (animationId: string, isActive: boolean) => {
		if (isActive) {
			animationControllerRef.current?.startAnimation(animationId);
		} else {
			animationControllerRef.current?.stopAnimation(animationId);
		}
	};

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

	return (
		<div className="container mx-auto space-y-6 p-6">
			{/* Header */}
			<div className="space-y-2 text-center">
				<h1 className="flex items-center justify-center gap-2 font-bold text-3xl">
					<Sparkles className="h-8 w-8" />
					Zaawansowane animacje 3D
				</h1>
				<p className="text-gray-600">
					Interaktywne wizualizacje procesów fizjologicznych z polskimi opisami
				</p>
			</div>

			{/* Main Controls */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Settings className="h-5 w-5" />
						Kontrola globalna
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex items-center gap-4">
						<div className="flex items-center gap-2">
							<span className="text-sm">Animacje:</span>
							<Button
								size="sm"
								variant={showAnimations ? "default" : "outline"}
								onClick={() => setShowAnimations(!showAnimations)}
							>
								{showAnimations ? (
									<Eye className="h-4 w-4" />
								) : (
									<EyeOff className="h-4 w-4" />
								)}
								{showAnimations ? "Włączone" : "Wyłączone"}
							</Button>
						</div>

						<div className="flex items-center gap-2">
							<span className="text-sm">Audio:</span>
							<Button
								size="sm"
								variant={audioEnabled ? "default" : "outline"}
								onClick={() => setAudioEnabled(!audioEnabled)}
							>
								<Volume2 className="h-4 w-4" />
								{audioEnabled ? "Włączone" : "Wyłączone"}
							</Button>
						</div>

						<div className="flex-1" />

						<div className="flex items-center gap-2">
							<span className="text-sm">Aktywne suplementy:</span>
							<div className="flex gap-1">
								{selectedSupplements.map((supplementId) => {
									const supplement = SUPPLEMENT_MOLECULAR_EFFECTS.find(
										(s) => s.supplementId === supplementId,
									);
									return supplement ? (
										<Badge
											key={supplementId}
											variant="secondary"
											className="text-xs"
										>
											{supplement.polishSupplementName}
										</Badge>
									) : null;
								})}
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Main Content Tabs */}
			<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
				<TabsList className="grid w-full grid-cols-4">
					<TabsTrigger value="body-systems">Układy ciała</TabsTrigger>
					<TabsTrigger value="brain-3d">Mózg 3D</TabsTrigger>
					<TabsTrigger value="animation-controller">
						Kontroler animacji
					</TabsTrigger>
					<TabsTrigger value="educational-timeline">
						Oś czasu edukacyjna
					</TabsTrigger>
				</TabsList>

				<TabsContent value="body-systems" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Layers className="h-5 w-5" />
								Zaawansowany przegląd układów ciała
							</CardTitle>
						</CardHeader>
						<CardContent className="p-0">
							<EnhancedBodySystemsViewer
								selectedSupplements={selectedSupplements}
								currentSystem={currentSystem}
								onSystemChange={setCurrentSystem}
								enableAudio={audioEnabled}
								enableBookmarks={true}
								className="w-full"
							/>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="brain-3d" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Brain className="h-5 w-5" />
								Zaawansowany model mózgu 3D
							</CardTitle>
						</CardHeader>
						<CardContent className="p-0">
							<EnhancedInteractive3DBrainModel
								selectedSupplements={selectedSupplements}
								showNeurotransmitters={true}
								animationSpeed={1}
								className="w-full"
							/>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="animation-controller" className="space-y-4">
					<PhysiologicalAnimationController
						selectedSupplements={selectedSupplements}
						onAnimationChange={handleAnimationChange}
						onSupplementEffectToggle={handleSupplementToggle}
						className="w-full"
					/>
				</TabsContent>

				<TabsContent value="educational-timeline" className="space-y-4">
					<AnimationTimeline
						sequenceId="breathing-tutorial"
						autoPlay={false}
						showEducationalContent={true}
						enableAudio={audioEnabled}
						className="w-full"
					/>
				</TabsContent>
			</Tabs>

			{/* Animation Library Overview */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<BookOpen className="h-5 w-5" />
						Biblioteka animacji fizjologicznych
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
						{PHYSIOLOGICAL_ANIMATIONS.map((animation) => (
							<Card key={animation.id} className="p-4">
								<div className="mb-2 flex items-center gap-3">
									{getAnimationIcon(animation.animationType)}
									<div>
										<h4 className="font-medium text-sm">
											{animation.polishName}
										</h4>
										<p className="text-gray-500 text-xs">
											{animation.duration}ms
										</p>
									</div>
								</div>
								<p className="mb-3 text-gray-600 text-xs">
									{animation.polishDescription}
								</p>
								<div className="flex items-center justify-between">
									<Badge variant="outline" className="text-xs">
										{animation.organIds.length} narządów
									</Badge>
									<Button
										size="sm"
										variant="outline"
										onClick={() => handleAnimationChange(animation.id, true)}
									>
										<Play className="h-3 w-3" />
									</Button>
								</div>
							</Card>
						))}
					</div>
				</CardContent>
			</Card>

			{/* System Transitions Demo */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<RotateCcw className="h-5 w-5" />
						Przejścia między układami
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-2 gap-3 md:grid-cols-4">
						{SYSTEM_TRANSITIONS.map((transition) => (
							<Card key={transition.id} className="p-3 text-center">
								<h4 className="mb-1 font-medium text-sm">
									{transition.polishName}
								</h4>
								<p className="mb-2 text-gray-500 text-xs">
									{transition.duration}ms
								</p>
								<Button size="sm" variant="outline" className="w-full text-xs">
									<RotateCcw className="mr-1 h-3 w-3" />
									Przejście
								</Button>
							</Card>
						))}
					</div>
				</CardContent>
			</Card>

			{/* Polish Language Integration Demo */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Volume2 className="h-5 w-5" />
						Integracja języka polskiego
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
						<div>
							<h4 className="mb-3 font-medium">Terminologia medyczna</h4>
							<div className="space-y-2">
								{Object.entries(POLISH_ANIMATION_LABELS)
									.slice(0, 5)
									.map(([term, data]) => (
										<div
											key={term}
											className="flex items-center justify-between rounded bg-gray-50 p-2"
										>
											<span className="font-medium">{term}</span>
											<Badge variant="outline" className="text-xs">
												{data}
											</Badge>
										</div>
									))}
							</div>
						</div>

						<div>
							<h4 className="mb-3 font-medium">Efekty suplementów</h4>
							<div className="space-y-2">
								{SUPPLEMENT_MOLECULAR_EFFECTS.slice(0, 3).map((effect) => (
									<div key={effect.supplementId} className="rounded border p-2">
										<div className="font-medium text-sm">
											{effect.polishSupplementName}
										</div>
										<div className="text-gray-600 text-xs">
											{effect.polishMechanism}
										</div>
										<div className="mt-1 flex items-center gap-2">
											<div
												className="h-3 w-3 rounded-full"
												style={{ backgroundColor: effect.visualEffect.color }}
											/>
											<Badge variant="outline" className="text-xs">
												{effect.targetOrgans.length} narządów
											</Badge>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Performance and Technical Info */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Timer className="h-5 w-5" />
						Informacje techniczne
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
						<div>
							<h4 className="mb-2 font-medium">Funkcje animacji</h4>
							<ul className="space-y-1 text-xs">
								<li>• Płynne animacje procesów fizjologicznych</li>
								<li>• System cząsteczek dla wizualizacji komórkowych</li>
								<li>• Efekty molekularne suplementów w czasie rzeczywistym</li>
								<li>• Przejścia między układami ciała</li>
								<li>• Adaptacyjna jakość oparta na wydajności urządzenia</li>
							</ul>
						</div>

						<div>
							<h4 className="mb-2 font-medium">Funkcje edukacyjne</h4>
							<ul className="space-y-1 text-xs">
								<li>• Oś czasu z kontrolą krok-po-kroku</li>
								<li>• Synchronizowana narracja audio w języku polskim</li>
								<li>• Interaktywne zakładki dla kluczowych momentów</li>
								<li>• Regulowana prędkość nauki</li>
								<li>• Kulturowo odpowiednie terminologie medyczne</li>
							</ul>
						</div>

						<div>
							<h4 className="mb-2 font-medium">Optymalizacje</h4>
							<ul className="space-y-1 text-xs">
								<li>• Pętle animacji z requestAnimationFrame</li>
								<li>
									• Zarządzanie pamięcią dla złożonych systemów cząsteczek
								</li>
								<li>• Płynne 60fps na wszystkich urządzeniach</li>
								<li>• Responsywne kontrolki animacji mobilnych</li>
								<li>• Monitorowanie i adaptacja wydajności</li>
							</ul>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
