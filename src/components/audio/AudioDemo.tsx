/**
 * Audio System Demo Component for Suplementor
 * Demonstrates all audio and haptic feedback features
 */

"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSuplementorAudio } from "@/hooks/useSuplementorAudio";
import {
	Brain,
	CheckCircle,
	Headphones,
	Info,
	Pause,
	Pill,
	Play,
	RotateCcw,
	Settings,
	Speaker,
	Vibration,
	Volume2,
	VolumeX,
	Waveform,
	XCircle,
	Zap,
} from "lucide-react";
import type React from "react";
import { useCallback, useState } from "react";

interface AudioDemoProps {
	className?: string;
}

export const AudioDemo: React.FC<AudioDemoProps> = ({ className = "" }) => {
	const [activeDemo, setActiveDemo] = useState<string>("overview");
	const [testResults, setTestResults] = useState<{
		audio: boolean;
		haptics: boolean;
		voice: boolean;
	} | null>(null);

	// Audio system integration
	const {
		isInitialized,
		isEnabled,
		config,
		playSFX,
		playMusic,
		playVoice,
		playAmbient,
		playBrainRegionAudio,
		playNeurotransmitterAudio,
		playSupplementAudio,
		speakBrainRegion,
		speakNeurotransmitter,
		speakSupplement,
		speakEducationalContent,
		triggerHaptic,
		triggerSuccessHaptic,
		triggerErrorHaptic,
		triggerNavigationHaptic,
		updateConfig,
		testAudio,
	} = useSuplementorAudio({
		enabled: true,
		autoInitialize: true,
	});

	/**
	 * Handle audio test
	 */
	const handleTestAudio = useCallback(async () => {
		const results = await testAudio();
		setTestResults(results);
	}, [testAudio]);

	/**
	 * Demo brain region audio
	 */
	const demoBrainRegionAudio = useCallback(async () => {
		await playBrainRegionAudio("prefrontal-cortex", "select");
		await speakBrainRegion("prefrontal-cortex");
	}, [playBrainRegionAudio, speakBrainRegion]);

	/**
	 * Demo neurotransmitter audio
	 */
	const demoNeurotransmitterAudio = useCallback(async () => {
		await playNeurotransmitterAudio("dopamine", "activate");
		await speakNeurotransmitter("dopamine");
	}, [playNeurotransmitterAudio, speakNeurotransmitter]);

	/**
	 * Demo supplement audio
	 */
	const demoSupplementAudio = useCallback(async () => {
		await playSupplementAudio("omega-3-epa-dha", "apply");
		await speakSupplement("omega-3-epa-dha");
	}, [playSupplementAudio, speakSupplement]);

	/**
	 * Demo educational content
	 */
	const demoEducationalContent = useCallback(async () => {
		await speakEducationalContent(
			"Funkcje mózgu",
			"Mózg jest niesamowitym organem kontrolującym wszystkie funkcje naszego ciała. Składa się z miliardów neuronów komunikujących się za pomocą neuroprzekaźników.",
		);
	}, [speakEducationalContent]);

	/**
	 * Demo haptic patterns
	 */
	const demoHapticPatterns = useCallback(async () => {
		await triggerSuccessHaptic();
		setTimeout(() => triggerNavigationHaptic(), 500);
		setTimeout(() => triggerErrorHaptic(), 1000);
	}, [triggerSuccessHaptic, triggerNavigationHaptic, triggerErrorHaptic]);

	/**
	 * Demo ambient sounds
	 */
	const demoAmbientSounds = useCallback(async () => {
		await playAmbient("brain-ambient-neural", { volume: 0.3, loop: false });
	}, [playAmbient]);

	/**
	 * Demo background music
	 */
	const demoBackgroundMusic = useCallback(async () => {
		await playMusic("bg-calm-educational", { volume: 0.4, loop: true });
		setTimeout(() => {
			// Stop after 10 seconds for demo
			playMusic("bg-calm-educational", { volume: 0, loop: false });
		}, 10000);
	}, [playMusic]);

	return (
		<div className={`mx-auto max-w-6xl space-y-6 p-6 ${className}`}>
			{/* Header */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Headphones className="h-6 w-6" />
						Demonstracja systemu audio suplementor
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							<Badge variant={isInitialized ? "default" : "secondary"}>
								{isInitialized ? "Zainicjalizowany" : "Nie zainicjalizowany"}
							</Badge>
							<Badge variant={isEnabled ? "default" : "secondary"}>
								{isEnabled ? "Włączony" : "Wyłączony"}
							</Badge>
						</div>
						<Button onClick={handleTestAudio} variant="outline">
							<Settings className="mr-2 h-4 w-4" />
							Testuj system
						</Button>
					</div>

					{testResults && (
						<div className="mt-4 grid grid-cols-3 gap-4">
							<div className="flex items-center gap-2">
								{testResults.audio ? (
									<CheckCircle className="h-4 w-4 text-green-500" />
								) : (
									<XCircle className="h-4 w-4 text-red-500" />
								)}
								<span className="text-sm">Audio</span>
							</div>
							<div className="flex items-center gap-2">
								{testResults.haptics ? (
									<CheckCircle className="h-4 w-4 text-green-500" />
								) : (
									<XCircle className="h-4 w-4 text-red-500" />
								)}
								<span className="text-sm">Haptyka</span>
							</div>
							<div className="flex items-center gap-2">
								{testResults.voice ? (
									<CheckCircle className="h-4 w-4 text-green-500" />
								) : (
									<XCircle className="h-4 w-4 text-red-500" />
								)}
								<span className="text-sm">Głos</span>
							</div>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Demo Controls */}
			<Tabs
				value={activeDemo}
				onValueChange={setActiveDemo}
				className="space-y-4"
			>
				<TabsList className="grid w-full grid-cols-5">
					<TabsTrigger value="overview">Przegląd</TabsTrigger>
					<TabsTrigger value="brain-audio">Audio mózgu</TabsTrigger>
					<TabsTrigger value="haptics">Haptyka</TabsTrigger>
					<TabsTrigger value="voice">Głos</TabsTrigger>
					<TabsTrigger value="settings">Ustawienia</TabsTrigger>
				</TabsList>

				{/* Overview Tab */}
				<TabsContent value="overview" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Info className="h-5 w-5" />
								Przegląd funkcji audio
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
								<Button
									onClick={demoBrainRegionAudio}
									className="h-20 flex-col gap-2"
									disabled={!isInitialized || !isEnabled}
								>
									<Brain className="h-6 w-6" />
									<span>Region mózgu</span>
								</Button>

								<Button
									onClick={demoNeurotransmitterAudio}
									className="h-20 flex-col gap-2"
									disabled={!isInitialized || !isEnabled}
								>
									<Zap className="h-6 w-6" />
									<span>Neuroprzekaźnik</span>
								</Button>

								<Button
									onClick={demoSupplementAudio}
									className="h-20 flex-col gap-2"
									disabled={!isInitialized || !isEnabled}
								>
									<Pill className="h-6 w-6" />
									<span>Suplement</span>
								</Button>

								<Button
									onClick={demoHapticPatterns}
									className="h-20 flex-col gap-2"
									disabled={!isInitialized || !isEnabled}
								>
									<Vibration className="h-6 w-6" />
									<span>Wibracje</span>
								</Button>

								<Button
									onClick={demoAmbientSounds}
									className="h-20 flex-col gap-2"
									disabled={!isInitialized || !isEnabled}
								>
									<Waveform className="h-6 w-6" />
									<span>Otoczenie</span>
								</Button>

								<Button
									onClick={demoBackgroundMusic}
									className="h-20 flex-col gap-2"
									disabled={!isInitialized || !isEnabled}
								>
									<Speaker className="h-6 w-6" />
									<span>Muzyka</span>
								</Button>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Brain Audio Tab */}
				<TabsContent value="brain-audio" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Brain className="h-5 w-5" />
								Audio interakcji z mózgiem
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
								<div className="space-y-2">
									<h4 className="font-medium">Regiony mózgu</h4>
									<Button
										onClick={() => demoBrainRegionAudio()}
										variant="outline"
										className="w-full"
										disabled={!isInitialized || !isEnabled}
									>
										<Brain className="mr-2 h-4 w-4" />
										Demonstruj interakcję z regionem
									</Button>
									<Button
										onClick={() => speakBrainRegion("hippocampus")}
										variant="outline"
										className="w-full"
										disabled={!isInitialized || !isEnabled}
									>
										<Volume2 className="mr-2 h-4 w-4" />
										Mów o hipokampie
									</Button>
								</div>

								<div className="space-y-2">
									<h4 className="font-medium">Neuroprzekaźniki</h4>
									<Button
										onClick={() => demoNeurotransmitterAudio()}
										variant="outline"
										className="w-full"
										disabled={!isInitialized || !isEnabled}
									>
										<Zap className="mr-2 h-4 w-4" />
										Demonstruj neuroprzekaźnik
									</Button>
									<Button
										onClick={() => speakNeurotransmitter("acetylcholine")}
										variant="outline"
										className="w-full"
										disabled={!isInitialized || !isEnabled}
									>
										<Volume2 className="mr-2 h-4 w-4" />
										Mów o acetylocholinie
									</Button>
								</div>

								<div className="space-y-2">
									<h4 className="font-medium">Suplementy</h4>
									<Button
										onClick={() => demoSupplementAudio()}
										variant="outline"
										className="w-full"
										disabled={!isInitialized || !isEnabled}
									>
										<Pill className="mr-2 h-4 w-4" />
										Demonstruj suplement
									</Button>
									<Button
										onClick={() => speakSupplement("lions-mane-mushroom")}
										variant="outline"
										className="w-full"
										disabled={!isInitialized || !isEnabled}
									>
										<Volume2 className="mr-2 h-4 w-4" />
										Mów o soplówce jeżowatej
									</Button>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Haptics Tab */}
				<TabsContent value="haptics" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Vibration className="h-5 w-5" />
								Haptyka i wibracje
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
								<Button
									onClick={triggerSuccessHaptic}
									variant="outline"
									className="h-16 flex-col gap-2"
									disabled={!isInitialized || !isEnabled}
								>
									<CheckCircle className="h-5 w-5 text-green-500" />
									<span>Sukces</span>
								</Button>

								<Button
									onClick={triggerErrorHaptic}
									variant="outline"
									className="h-16 flex-col gap-2"
									disabled={!isInitialized || !isEnabled}
								>
									<XCircle className="h-5 w-5 text-red-500" />
									<span>Błąd</span>
								</Button>

								<Button
									onClick={triggerNavigationHaptic}
									variant="outline"
									className="h-16 flex-col gap-2"
									disabled={!isInitialized || !isEnabled}
								>
									<Settings className="h-5 w-5 text-blue-500" />
									<span>Nawigacja</span>
								</Button>
							</div>

							<Button
								onClick={demoHapticPatterns}
								variant="outline"
								className="w-full"
								disabled={!isInitialized || !isEnabled}
							>
								<Vibration className="mr-2 h-4 w-4" />
								Demonstruj wszystkie wzorce wibracji
							</Button>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Voice Tab */}
				<TabsContent value="voice" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Volume2 className="h-5 w-5" />
								Synteza mowy w języku polskim
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
								<div className="space-y-2">
									<h4 className="font-medium">Treści edukacyjne</h4>
									<Button
										onClick={demoEducationalContent}
										variant="outline"
										className="w-full"
										disabled={!isInitialized || !isEnabled}
									>
										<Volume2 className="mr-2 h-4 w-4" />
										Mów o funkcjach mózgu
									</Button>
								</div>

								<div className="space-y-2">
									<h4 className="font-medium">Nawigacja</h4>
									<Button
										onClick={() =>
											playVoice("Przejdź do następnego regionu mózgu", {
												context: "navigation",
											})
										}
										variant="outline"
										className="w-full"
										disabled={!isInitialized || !isEnabled}
									>
										<Volume2 className="mr-2 h-4 w-4" />
										Komunikat nawigacyjny
									</Button>
								</div>
							</div>

							<div className="space-y-2">
								<h4 className="font-medium">Informacje zwrotne</h4>
								<div className="grid grid-cols-2 gap-2">
									<Button
										onClick={() =>
											playVoice("Doskonale! Poprawna odpowiedź.", {
												context: "feedback",
												emphasis: "strong",
											})
										}
										variant="outline"
										disabled={!isInitialized || !isEnabled}
									>
										<CheckCircle className="mr-2 h-4 w-4 text-green-500" />
										Pochwała
									</Button>
									<Button
										onClick={() =>
											playVoice(
												"Spróbuj ponownie. To nie jest poprawna odpowiedź.",
												{ context: "feedback" },
											)
										}
										variant="outline"
										disabled={!isInitialized || !isEnabled}
									>
										<XCircle className="mr-2 h-4 w-4 text-red-500" />
										Korekta
									</Button>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Settings Tab */}
				<TabsContent value="settings" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Settings className="h-5 w-5" />
								Ustawienia audio
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-6">
							{/* Volume Controls */}
							<div className="space-y-4">
								<h4 className="font-medium">Głośność</h4>

								<div className="space-y-3">
									<div className="flex items-center justify-between">
										<span className="text-sm">Główna głośność</span>
										<span className="text-sm">
											{Math.round(config.masterVolume * 100)}%
										</span>
									</div>
									<Slider
										value={[config.masterVolume]}
										onValueChange={([value]) =>
											updateConfig({ masterVolume: value })
										}
										min={0}
										max={1}
										step={0.1}
										className="w-full"
									/>
								</div>

								<div className="space-y-3">
									<div className="flex items-center justify-between">
										<span className="text-sm">Efekty dźwiękowe</span>
										<span className="text-sm">
											{Math.round(config.sfxVolume * 100)}%
										</span>
									</div>
									<Slider
										value={[config.sfxVolume]}
										onValueChange={([value]) =>
											updateConfig({ sfxVolume: value })
										}
										min={0}
										max={1}
										step={0.1}
										className="w-full"
									/>
								</div>

								<div className="space-y-3">
									<div className="flex items-center justify-between">
										<span className="text-sm">Muzyka</span>
										<span className="text-sm">
											{Math.round(config.musicVolume * 100)}%
										</span>
									</div>
									<Slider
										value={[config.musicVolume]}
										onValueChange={([value]) =>
											updateConfig({ musicVolume: value })
										}
										min={0}
										max={1}
										step={0.1}
										className="w-full"
									/>
								</div>

								<div className="space-y-3">
									<div className="flex items-center justify-between">
										<span className="text-sm">Głos</span>
										<span className="text-sm">
											{Math.round(config.voiceVolume * 100)}%
										</span>
									</div>
									<Slider
										value={[config.voiceVolume]}
										onValueChange={([value]) =>
											updateConfig({ voiceVolume: value })
										}
										min={0}
										max={1}
										step={0.1}
										className="w-full"
									/>
								</div>
							</div>

							{/* Voice Settings */}
							<div className="space-y-4">
								<h4 className="font-medium">Ustawienia głosu</h4>

								<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
									<div className="space-y-2">
										<label className="font-medium text-sm">Szybkość</label>
										<Slider
											value={[config.voiceRate]}
											onValueChange={([value]) =>
												updateConfig({ voiceRate: value })
											}
											min={0.5}
											max={2}
											step={0.1}
											className="w-full"
										/>
									</div>

									<div className="space-y-2">
										<label className="font-medium text-sm">Wysokość</label>
										<Slider
											value={[config.voicePitch]}
											onValueChange={([value]) =>
												updateConfig({ voicePitch: value })
											}
											min={0.5}
											max={2}
											step={0.1}
											className="w-full"
										/>
									</div>

									<div className="space-y-2">
										<label className="font-medium text-sm">
											Intensywność haptyki
										</label>
										<Slider
											value={[config.hapticIntensity]}
											onValueChange={([value]) =>
												updateConfig({ hapticIntensity: value })
											}
											min={0}
											max={1}
											step={0.1}
											className="w-full"
										/>
									</div>
								</div>
							</div>

							{/* Quality Settings */}
							<div className="space-y-4">
								<h4 className="font-medium">Jakość audio</h4>

								<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<label
											htmlFor="audio-quality-select"
											className="font-medium text-sm"
										>
											Jakość ogólna
										</label>
										<select
											id="audio-quality-select"
											value={config.quality}
											onChange={(e) =>
												updateConfig({ quality: e.target.value as any })
											}
											className="w-full rounded-md border p-2"
										>
											<option value="low">Niska</option>
											<option value="medium">Średnia</option>
											<option value="high">Wysoka</option>
											<option value="ultra">Ultra</option>
										</select>
									</div>

									<div className="space-y-2">
										<label
											htmlFor="max-sounds-input"
											className="font-medium text-sm"
										>
											Maksymalne dźwięki
										</label>
										<input
											id="max-sounds-input"
											type="number"
											value={config.maxConcurrentSounds}
											onChange={(e) =>
												updateConfig({
													maxConcurrentSounds: Number.parseInt(e.target.value),
												})
											}
											min={1}
											max={32}
											className="w-full rounded-md border p-2"
										/>
									</div>
								</div>
							</div>

							{/* Feature Toggles */}
							<div className="space-y-4">
								<h4 className="font-medium">Funkcje</h4>

								<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
									<div className="flex items-center justify-between">
										<span className="text-sm">Audio przestrzenne 3D</span>
										<Switch
											checked={config.enableSpatialAudio}
											onCheckedChange={(checked) =>
												updateConfig({ enableSpatialAudio: checked })
											}
										/>
									</div>

									<div className="flex items-center justify-between">
										<span className="text-sm">Cache audio</span>
										<Switch
											checked={config.enableAudioCache}
											onCheckedChange={(checked) =>
												updateConfig({ enableAudioCache: checked })
											}
										/>
									</div>

									<div className="flex items-center justify-between">
										<span className="text-sm">Haptyka</span>
										<Switch
											checked={config.hapticEnabled}
											onCheckedChange={(checked) =>
												updateConfig({ hapticEnabled: checked })
											}
										/>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>

			{/* Status Footer */}
			<Card>
				<CardContent className="pt-6">
					<div className="flex items-center justify-between text-gray-600 text-sm">
						<div className="flex items-center gap-4">
							<span>Status: {isInitialized ? "Aktywny" : "Nieaktywny"}</span>
							<span>•</span>
							<span>Jakość: {config.quality}</span>
							<span>•</span>
							<span>Głos: {config.voiceLanguage}</span>
						</div>
						<div className="flex items-center gap-2">
							<Button
								size="sm"
								variant="outline"
								onClick={() =>
									playVoice("System audio suplementor jest gotowy do użycia.", {
										context: "feedback",
									})
								}
								disabled={!isInitialized || !isEnabled}
							>
								<Volume2 className="h-4 w-4" />
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default AudioDemo;
