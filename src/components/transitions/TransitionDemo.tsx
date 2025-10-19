"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { type BodySystem, bodySystems } from "@/data/body-systems";
import React, { useState, useCallback } from "react";
import {
	SystemTransitionManager,
	createCameraPaths,
	createOverlayEffects,
	createParticleEffects,
	createPolishLanguageConfigs,
	createSystemTransition,
	createTransitionPresets,
	createVoiceOverConfigs,
	generateSystemConnections,
	useCameraPathAnimator,
	useConnectionVisualizer,
	useOverlayTransitionEffect,
	useParticleSystem,
	usePolishLanguageIntegration,
	useSystemTransitionManager,
} from "./index";

export function TransitionDemo() {
	const [sourceSystem, setSourceSystem] = useState<BodySystem>(bodySystems[0]);
	const [targetSystem, setTargetSystem] = useState<BodySystem>(bodySystems[1]);
	const [transitionType, setTransitionType] = useState<
		"quick" | "educational" | "cinematic" | "mobile"
	>("educational");
	const [isTransitioning, setIsTransitioning] = useState(false);

	const { startTransition, state, getDeviceCapabilities } =
		useSystemTransitionManager();

	const handleStartTransition = useCallback(async () => {
		if (!sourceSystem || !targetSystem || isTransitioning) return;

		setIsTransitioning(true);

		try {
			// Create transition configuration based on selected type
			let transitionConfig;

			switch (transitionType) {
				case "quick":
					transitionConfig = createTransitionPresets.quickTransition(
						sourceSystem.id,
						targetSystem.id,
					);
					break;
				case "educational":
					transitionConfig = createTransitionPresets.educationalTransition(
						sourceSystem.id,
						targetSystem.id,
					);
					break;
				case "cinematic":
					transitionConfig = createTransitionPresets.cinematricTransition(
						sourceSystem.id,
						targetSystem.id,
					);
					break;
				case "mobile":
					transitionConfig = createTransitionPresets.mobileTransition(
						sourceSystem.id,
						targetSystem.id,
					);
					break;
				default:
					transitionConfig = createTransitionPresets.educationalTransition(
						sourceSystem.id,
						targetSystem.id,
					);
			}

			// Generate connections between systems
			const connections = generateSystemConnections(sourceSystem, targetSystem);

			// Add Polish labels for educational context
			if (transitionType === "educational") {
				transitionConfig.polishLabels = createPolishLanguageConfigs.educational(
					[
						{
							systemId: targetSystem.id,
							text: targetSystem.polishName,
							translation: targetSystem.name,
							pronunciation: targetSystem.polishName.toLowerCase(),
							medicalTerm: targetSystem.polishName,
							position: { x: 0, y: 0, z: 0 },
							showDuration: 2000,
						},
					],
				);

				transitionConfig.voiceOver = createVoiceOverConfigs.polishFemale();
			}

			await startTransition(transitionConfig);
		} catch (error) {
			console.error("Transition error:", error);
		} finally {
			setIsTransitioning(false);
		}
	}, [
		sourceSystem,
		targetSystem,
		transitionType,
		isTransitioning,
		startTransition,
	]);

	const deviceCapabilities = getDeviceCapabilities();

	return (
		<div className="mx-auto max-w-6xl p-6 transition-demo">
			{/* Header */}
			<Card className="mb-6">
				<CardHeader>
					<CardTitle>Systemy Tranzycji Animowanych - Demonstracja</CardTitle>
					<CardDescription>
						Pokazuje płynne przejścia między układami ciała z efektami
						wizualnymi i polskimi opisami edukacyjnymi
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
						{/* Source System Selection */}
						<div>
							<label className="mb-2 block font-medium text-sm">
								Układ źródłowy
							</label>
							<Select
								value={sourceSystem?.id}
								onValueChange={(value) => {
									const system = bodySystems.find((s) => s.id === value);
									if (system) setSourceSystem(system);
								}}
							>
								<SelectTrigger>
									<SelectValue placeholder="Wybierz układ źródłowy" />
								</SelectTrigger>
								<SelectContent>
									{bodySystems.map((system) => (
										<SelectItem key={system.id} value={system.id}>
											{system.polishName}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{/* Target System Selection */}
						<div>
							<label className="mb-2 block font-medium text-sm">
								Układ docelowy
							</label>
							<Select
								value={targetSystem?.id}
								onValueChange={(value) => {
									const system = bodySystems.find((s) => s.id === value);
									if (system) setTargetSystem(system);
								}}
							>
								<SelectTrigger>
									<SelectValue placeholder="Wybierz układ docelowy" />
								</SelectTrigger>
								<SelectContent>
									{bodySystems.map((system) => (
										<SelectItem key={system.id} value={system.id}>
											{system.polishName}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{/* Transition Type Selection */}
						<div>
							<label className="mb-2 block font-medium text-sm">
								Typ tranzycji
							</label>
							<Select
								value={transitionType}
								onValueChange={(value: any) => setTransitionType(value)}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="quick">Szybka</SelectItem>
									<SelectItem value="educational">Edukacyjna</SelectItem>
									<SelectItem value="cinematic">Kinowa</SelectItem>
									<SelectItem value="mobile">Mobilna</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>

					{/* Device Capabilities */}
					<div className="mb-4">
						<h4 className="mb-2 font-medium text-sm">Możliwości urządzenia:</h4>
						<div className="flex flex-wrap gap-2">
							<Badge
								variant={
									deviceCapabilities.supportsWebGL ? "default" : "destructive"
								}
							>
								WebGL: {deviceCapabilities.supportsWebGL ? "Tak" : "Nie"}
							</Badge>
							<Badge variant="outline">
								Max Texture: {deviceCapabilities.maxTextureSize}px
							</Badge>
							<Badge variant="outline">
								WebGL2: {deviceCapabilities.supportsWebGL2 ? "Tak" : "Nie"}
							</Badge>
						</div>
					</div>

					{/* Start Transition Button */}
					<Button
						onClick={handleStartTransition}
						disabled={isTransitioning || !sourceSystem || !targetSystem}
						className="w-full"
					>
						{isTransitioning ? "Przechodzenie..." : "Rozpocznij tranzycję"}
					</Button>
				</CardContent>
			</Card>

			{/* Current Transition Status */}
			{state.isActive && (
				<Card className="mb-6">
					<CardHeader>
						<CardTitle>Status tranzycji</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-2">
							<div className="flex justify-between">
								<span>Postęp:</span>
								<span>{Math.round(state.progress * 100)}%</span>
							</div>
							<div className="h-2 w-full rounded-full bg-gray-200">
								<div
									className="h-2 rounded-full bg-blue-600 transition-all duration-300"
									style={{ width: `${state.progress * 100}%` }}
								/>
							</div>
							<div className="flex gap-2">
								<Badge variant="outline">
									Źródło: {sourceSystem?.polishName}
								</Badge>
								<Badge variant="outline">Cel: {targetSystem?.polishName}</Badge>
							</div>
						</div>
					</CardContent>
				</Card>
			)}

			{/* System Information Cards */}
			<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
				{/* Source System */}
				<Card>
					<CardHeader>
						<CardTitle>Układ źródłowy</CardTitle>
						<CardDescription>{sourceSystem?.polishName}</CardDescription>
					</CardHeader>
					<CardContent>
						<p className="mb-4 text-gray-600 text-sm">
							{sourceSystem?.polishDescription}
						</p>
						<div className="space-y-2">
							<h5 className="font-medium">Główne funkcje:</h5>
							<ul className="space-y-1 text-sm">
								{sourceSystem?.polishFunctions
									.slice(0, 3)
									.map((func, index) => (
										<li key={index} className="text-gray-600">
											• {func}
										</li>
									))}
							</ul>
						</div>
					</CardContent>
				</Card>

				{/* Target System */}
				<Card>
					<CardHeader>
						<CardTitle>Układ docelowy</CardTitle>
						<CardDescription>{targetSystem?.polishName}</CardDescription>
					</CardHeader>
					<CardContent>
						<p className="mb-4 text-gray-600 text-sm">
							{targetSystem?.polishDescription}
						</p>
						<div className="space-y-2">
							<h5 className="font-medium">Główne funkcje:</h5>
							<ul className="space-y-1 text-sm">
								{targetSystem?.polishFunctions
									.slice(0, 3)
									.map((func, index) => (
										<li key={index} className="text-gray-600">
											• {func}
										</li>
									))}
							</ul>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Transition Effects Showcase */}
			<Card className="mt-6">
				<CardHeader>
					<CardTitle>Efekty tranzycji w czasie rzeczywistym</CardTitle>
					<CardDescription>
						Poniżej możesz zobaczyć poszczególne komponenty tranzycji w
						działaniu
					</CardDescription>
				</CardHeader>
				<CardContent>
					<TransitionEffectsShowcase
						sourceSystem={sourceSystem}
						targetSystem={targetSystem}
						transitionType={transitionType}
					/>
				</CardContent>
			</Card>
		</div>
	);
}

// Component showcasing individual transition effects
interface TransitionEffectsShowcaseProps {
	sourceSystem: BodySystem | undefined;
	targetSystem: BodySystem | undefined;
	transitionType: string;
}

function TransitionEffectsShowcase({
	sourceSystem,
	targetSystem,
	transitionType,
}: TransitionEffectsShowcaseProps) {
	if (!sourceSystem || !targetSystem) {
		return (
			<div className="py-8 text-center text-gray-500">
				Wybierz układy do demonstracji efektów
			</div>
		);
	}

	// Generate sample connections
	const connections = generateSystemConnections(sourceSystem, targetSystem);

	// Create sample camera path
	const cameraPath = createCameraPaths.cinematic({ x: 0, y: 0, z: 0 });

	// Create sample overlay effect
	const overlayEffect = createOverlayEffects.fade(0.6);

	// Create sample particle effect
	const particleEffect = createParticleEffects.trail("#ffffff", 30);

	// Create Polish labels
	const polishLabels = createPolishLanguageConfigs.educational([
		{
			systemId: targetSystem.id,
			text: targetSystem.polishName,
			translation: targetSystem.name,
			pronunciation: targetSystem.polishName.toLowerCase(),
			medicalTerm: targetSystem.polishName,
			position: { x: 0, y: 0, z: 0 },
			showDuration: 2000,
		},
	]);

	return (
		<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
			{/* Camera Animation Demo */}
			<Card>
				<CardHeader>
					<CardTitle>Animacja kamery</CardTitle>
					<CardDescription>
						Ścieżka ruchu kamery między układami
					</CardDescription>
				</CardHeader>
				<CardContent>
					<CameraAnimationDemo cameraPath={cameraPath} />
				</CardContent>
			</Card>

			{/* Overlay Effects Demo */}
			<Card>
				<CardHeader>
					<CardTitle>Efekty nakładki</CardTitle>
					<CardDescription>
						Efekty fade i blend podczas tranzycji
					</CardDescription>
				</CardHeader>
				<CardContent>
					<OverlayEffectsDemo overlayEffect={overlayEffect} />
				</CardContent>
			</Card>

			{/* Particle System Demo */}
			<Card>
				<CardHeader>
					<CardTitle>SYSTEM CZĄSTEK</CardTitle>
					<CardDescription>Ślady cząstek podczas ruchu kamery</CardDescription>
				</CardHeader>
				<CardContent>
					<ParticleSystemDemo particleEffect={particleEffect} />
				</CardContent>
			</Card>

			{/* Connection Visualization Demo */}
			<Card>
				<CardHeader>
					<CardTitle>Wizualizacja połączeń</CardTitle>
					<CardDescription>Powiązania między układami ciała</CardDescription>
				</CardHeader>
				<CardContent>
					<ConnectionVisualizationDemo
						sourceSystem={sourceSystem}
						targetSystem={targetSystem}
						connections={connections}
					/>
				</CardContent>
			</Card>

			{/* Polish Language Integration Demo */}
			<Card className="lg:col-span-2">
				<CardHeader>
					<CardTitle>Integracja języka polskiego</CardTitle>
					<CardDescription>
						Etykiety i wymowa medyczna w języku polskim
					</CardDescription>
				</CardHeader>
				<CardContent>
					<PolishLanguageDemo polishLabels={polishLabels} />
				</CardContent>
			</Card>
		</div>
	);
}

// Individual effect demo components
function CameraAnimationDemo({ cameraPath }: { cameraPath: any }) {
	const { isAnimating, progress, currentState } = useCameraPathAnimator(
		cameraPath,
		{
			autoStart: true,
			loop: true,
		},
	);

	return (
		<div className="relative h-48 overflow-hidden rounded-lg bg-gray-100">
			{/* Camera position indicator */}
			<div
				className="absolute h-4 w-4 rounded-full bg-blue-500 shadow-lg transition-all duration-300"
				style={{
					left: `${50 + (currentState?.position.x || 0) * 20}%`,
					top: `${50 + (currentState?.position.y || 0) * 20}%`,
					transform: "translate(-50%, -50%)",
				}}
			/>

			{/* Progress indicator */}
			<div className="absolute bottom-2 left-2 text-gray-600 text-xs">
				Postęp: {Math.round(progress * 100)}%
			</div>
		</div>
	);
}

function OverlayEffectsDemo({ overlayEffect }: { overlayEffect: any }) {
	const { isAnimating, progress, currentState } = useOverlayTransitionEffect(
		overlayEffect,
		{
			autoStart: true,
			loop: true,
			duration: 3000,
		},
	);

	return (
		<div className="relative h-48 overflow-hidden rounded-lg bg-gradient-to-br from-blue-100 to-purple-100">
			{/* Overlay effect visualization */}
			<div
				className="absolute inset-0 transition-all duration-300"
				style={{
					backgroundColor: `rgba(0, 255, 136, ${currentState?.opacity || 0})`,
					transform: `scale(${currentState?.scale || 1})`,
				}}
			/>

			{/* Content behind overlay */}
			<div className="absolute inset-0 flex items-center justify-center text-gray-600">
				Zawartość układu ciała
			</div>
		</div>
	);
}

function ParticleSystemDemo({ particleEffect }: { particleEffect: any }) {
	const { isAnimating, progress, particles } = useParticleSystem(
		particleEffect,
		{
			autoStart: true,
			loop: true,
		},
	);

	return (
		<div className="relative h-48 overflow-hidden rounded-lg bg-black">
			{/* Particle rendering */}
			{particles.map((particle) => (
				<div
					key={particle.id}
					className="absolute rounded-full"
					style={{
						left: `${50 + particle.position.x * 100}%`,
						top: `${50 + particle.position.y * 100}%`,
						width: `${particle.size * 20}px`,
						height: `${particle.size * 20}px`,
						backgroundColor: particle.color,
						opacity: particle.opacity,
						boxShadow: `0 0 10px ${particle.color}`,
						transform: "translate(-50%, -50%)",
					}}
				/>
			))}

			{/* Particle count indicator */}
			<div className="absolute top-2 left-2 text-white text-xs">
				Cząstek: {particles.length}
			</div>
		</div>
	);
}

function ConnectionVisualizationDemo({
	sourceSystem,
	targetSystem,
	connections,
}: {
	sourceSystem: BodySystem;
	targetSystem: BodySystem;
	connections: any[];
}) {
	const { isAnimating, progress, activeConnections } = useConnectionVisualizer(
		sourceSystem,
		targetSystem,
		connections,
		{ autoStart: true, loop: true },
	);

	return (
		<div className="relative h-48 overflow-hidden rounded-lg bg-gray-50">
			{/* SVG for connection lines */}
			<svg className="absolute inset-0 h-full w-full">
				{connections.map((connection) => (
					<line
						key={connection.id}
						x1="20%"
						y1="50%"
						x2="80%"
						y2="30%"
						stroke={
							activeConnections.includes(connection.id) ? "#00ff88" : "#cccccc"
						}
						strokeWidth={activeConnections.includes(connection.id) ? 3 : 1}
						opacity={activeConnections.includes(connection.id) ? 0.8 : 0.3}
					>
						{activeConnections.includes(connection.id) && (
							<animate
								attributeName="stroke-dasharray"
								values="0,20;20,0;0,20"
								dur="2s"
								repeatCount="indefinite"
							/>
						)}
					</line>
				))}
			</svg>

			{/* System labels */}
			<div className="absolute top-4 left-4 font-medium text-gray-700 text-xs">
				{sourceSystem.polishName}
			</div>
			<div className="absolute top-4 right-4 font-medium text-gray-700 text-xs">
				{targetSystem.polishName}
			</div>
		</div>
	);
}

function PolishLanguageDemo({ polishLabels }: { polishLabels: any }) {
	const { isAnimating, progress, currentLabel, labelState } =
		usePolishLanguageIntegration(polishLabels, undefined, {
			autoStart: true,
			loop: true,
		});

	return (
		<div className="relative h-32 overflow-hidden rounded-lg bg-gradient-to-r from-blue-50 to-green-50">
			{/* Polish label display */}
			{currentLabel && (
				<div
					className="absolute inset-0 flex items-center justify-center text-center transition-all duration-500"
					style={{
						opacity: labelState.isVisible ? 1 : 0,
						transform: `scale(${labelState.isVisible ? 1 : 0.8})`,
					}}
				>
					<div>
						<div className="mb-1 font-bold text-2xl text-gray-800">
							{currentLabel.text}
						</div>
						<div className="mb-1 text-gray-600 text-sm">
							{currentLabel.medicalTerm}
						</div>
						<div className="text-gray-500 text-xs">
							{currentLabel.translation}
						</div>
						{currentLabel.pronunciation && (
							<div className="mt-1 font-mono text-gray-400 text-xs">
								/{currentLabel.pronunciation}/
							</div>
						)}
					</div>
				</div>
			)}

			{/* Progress indicator */}
			<div className="absolute bottom-2 left-2 text-gray-600 text-xs">
				Etykieta: {currentLabel ? currentLabel.text : "Brak"}
			</div>
		</div>
	);
}

// Main demo page wrapper with transition manager
export function TransitionDemoPage() {
	return (
		<SystemTransitionManager
			onTransitionComplete={(source, target) => {
				console.log(`Transition completed from ${source} to ${target}`);
			}}
			onTransitionError={(error) => {
				console.error("Transition error:", error);
			}}
		>
			<TransitionDemo />
		</SystemTransitionManager>
	);
}
