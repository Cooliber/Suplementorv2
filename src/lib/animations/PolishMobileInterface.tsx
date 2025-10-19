"use client";

/**
 * Polish Language Mobile Interface for Suplementor Animations
 * Culturally adapted mobile interface with Polish localization
 */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Globe,
	Heart,
	HelpCircle,
	Languages,
	Settings,
	Smartphone,
	Users,
	Volume2,
	VolumeX,
} from "lucide-react";
import type React from "react";
import { useCallback, useEffect, useState } from "react";

interface PolishLocalization {
	// Animation controls
	play: string;
	pause: string;
	stop: string;
	nextStep: string;
	previousStep: string;
	speed: string;
	step: string;
	of: string; // "z" as in "Krok 1 z 5"

	// Gesture descriptions
	swipeLeft: string;
	swipeRight: string;
	swipeUp: string;
	swipeDown: string;
	pinchIn: string;
	pinchOut: string;
	tap: string;
	doubleTap: string;
	longPress: string;

	// Voice commands
	voiceControl: string;
	voiceCommands: string;
	sayCommands: string;

	// Performance
	performance: string;
	battery: string;
	memory: string;
	quality: string;
	frameRate: string;

	// Accessibility
	accessibility: string;
	screenReader: string;
	highContrast: string;
	largeText: string;
	reducedMotion: string;

	// Interface elements
	controls: string;
	settings: string;
	help: string;
	close: string;
	open: string;
	enabled: string;
	disabled: string;

	// Educational content
	educationalContent: string;
	learningObjectives: string;
	keyPoints: string;
	clinicalRelevance: string;

	// Animation types (Polish names)
	breathingCycle: string;
	heartbeatCycle: string;
	muscleContraction: string;
	nerveImpulse: string;
	bloodFlow: string;
	hormoneRelease: string;

	// Status messages
	loading: string;
	error: string;
	success: string;
	warning: string;
	info: string;

	// Mobile-specific
	touchOptimized: string;
	gestureMode: string;
	hapticFeedback: string;
	adaptiveLayout: string;
	splitScreen: string;
}

const POLISH_LOCALIZATION: PolishLocalization = {
	// Animation controls
	play: "Odtwórz",
	pause: "Pauza",
	stop: "Zatrzymaj",
	nextStep: "Następny krok",
	previousStep: "Poprzedni krok",
	speed: "Prędkość",
	step: "Krok",
	of: "z",

	// Gesture descriptions
	swipeLeft: "Przesuń w lewo",
	swipeRight: "Przesuń w prawo",
	swipeUp: "Przesuń w górę",
	swipeDown: "Przesuń w dół",
	pinchIn: "Ściśnij",
	pinchOut: "Rozciągnij",
	tap: "Dotknij",
	doubleTap: "Dotknij dwa razy",
	longPress: "Przytrzymaj",

	// Voice commands
	voiceControl: "Sterowanie głosowe",
	voiceCommands: "Polecenia głosowe",
	sayCommands: "Powiedz polecenie",

	// Performance
	performance: "Wydajność",
	battery: "Bateria",
	memory: "Pamięć",
	quality: "Jakość",
	frameRate: "Klatki/sek",

	// Accessibility
	accessibility: "Dostępność",
	screenReader: "Czytnik ekranu",
	highContrast: "Wysoki kontrast",
	largeText: "Duży tekst",
	reducedMotion: "Zmniejszony ruch",

	// Interface elements
	controls: "Kontrolki",
	settings: "Ustawienia",
	help: "Pomoc",
	close: "Zamknij",
	open: "Otwórz",
	enabled: "Włączone",
	disabled: "Wyłączone",

	// Educational content
	educationalContent: "Zawartość edukacyjna",
	learningObjectives: "Cele nauki",
	keyPoints: "Kluczowe punkty",
	clinicalRelevance: "Znaczenie kliniczne",

	// Animation types (Polish names)
	breathingCycle: "Cykl oddechowy",
	heartbeatCycle: "Cykl serca",
	muscleContraction: "Skurcz mięśni",
	nerveImpulse: "Impuls nerwowy",
	bloodFlow: "Krążenie krwi",
	hormoneRelease: "Wydzielanie hormonów",

	// Status messages
	loading: "Ładowanie...",
	error: "Błąd",
	success: "Sukces",
	warning: "Ostrzeżenie",
	info: "Informacja",

	// Mobile-specific
	touchOptimized: "Zoptymalizowane dla dotyku",
	gestureMode: "Tryb gestów",
	hapticFeedback: "Informacje zwrotne dotykiem",
	adaptiveLayout: "Adaptacyjny układ",
	splitScreen: "Ekran dzielony",
};

interface PolishMobileInterfaceProps {
	children: React.ReactNode;
	enablePolishLocalization?: boolean;
	enableCulturalAdaptations?: boolean;
	enableRegionalSettings?: boolean;
	className?: string;
}

interface CulturalSettings {
	dateFormat: "DD.MM.YYYY" | "MM/DD/YYYY" | "YYYY-MM-DD";
	timeFormat: "24h" | "12h";
	numberFormat: "comma" | "dot"; // Decimal separator
	gestureSensitivity: "low" | "medium" | "high";
	hapticIntensity: "subtle" | "normal" | "strong";
	colorScheme: "natural" | "vibrant" | "medical";
}

// Polish cultural gesture preferences
const POLISH_GESTURE_PREFERENCES = {
	// Poles tend to prefer more deliberate, less sensitive gestures
	sensitivity: "medium" as const,
	// Subtle haptic feedback is preferred
	hapticIntensity: "subtle" as const,
	// Natural color scheme for medical/educational content
	colorScheme: "medical" as const,
	// Conservative UI spacing
	spacing: "comfortable" as const,
};

export const PolishMobileInterface: React.FC<PolishMobileInterfaceProps> = ({
	children,
	enablePolishLocalization = true,
	enableCulturalAdaptations = true,
	enableRegionalSettings = true,
	className = "",
}) => {
	const [currentLanguage, setCurrentLanguage] = useState<"pl" | "en">("pl");
	const [culturalSettings, setCulturalSettings] = useState<CulturalSettings>({
		dateFormat: "DD.MM.YYYY",
		timeFormat: "24h",
		numberFormat: "comma",
		gestureSensitivity: POLISH_GESTURE_PREFERENCES.sensitivity,
		hapticIntensity: POLISH_GESTURE_PREFERENCES.hapticIntensity,
		colorScheme: POLISH_GESTURE_PREFERENCES.colorScheme,
	});

	const [showLocalizationPanel, setShowLocalizationPanel] = useState(false);

	// Apply cultural settings to CSS custom properties
	useEffect(() => {
		if (!enableCulturalAdaptations) return;

		const root = document.documentElement;

		// Gesture sensitivity affects touch target sizes
		const sensitivityMultiplier = {
			low: 1.2,
			medium: 1.0,
			high: 0.8,
		}[culturalSettings.gestureSensitivity];

		root.style.setProperty(
			"--polish-touch-target-multiplier",
			sensitivityMultiplier.toString(),
		);

		// Haptic intensity affects animation timing
		const hapticMultiplier = {
			subtle: 0.7,
			normal: 1.0,
			strong: 1.3,
		}[culturalSettings.hapticIntensity];

		root.style.setProperty(
			"--polish-haptic-multiplier",
			hapticMultiplier.toString(),
		);

		// Color scheme affects the overall theme
		const colorSchemes = {
			natural: { primary: "hsl(220, 13%, 28%)", accent: "hsl(220, 13%, 46%)" },
			vibrant: { primary: "hsl(262, 83%, 58%)", accent: "hsl(262, 83%, 68%)" },
			medical: { primary: "hsl(204, 96%, 53%)", accent: "hsl(204, 96%, 63%)" },
		};

		const colors = colorSchemes[culturalSettings.colorScheme];
		root.style.setProperty("--polish-primary-color", colors.primary);
		root.style.setProperty("--polish-accent-color", colors.accent);
	}, [culturalSettings, enableCulturalAdaptations]);

	// Language toggle
	const toggleLanguage = useCallback(() => {
		setCurrentLanguage((prev) => (prev === "pl" ? "en" : "pl"));
	}, []);

	// Update cultural settings
	const updateCulturalSettings = useCallback(
		(updates: Partial<CulturalSettings>) => {
			setCulturalSettings((prev) => ({ ...prev, ...updates }));
		},
		[],
	);

	// Get localized text
	const t = useCallback(
		(key: keyof PolishLocalization): string => {
			if (!enablePolishLocalization || currentLanguage === "en") {
				// Return English fallbacks
				const englishFallbacks: Partial<PolishLocalization> = {
					play: "Play",
					pause: "Pause",
					stop: "Stop",
					nextStep: "Next step",
					previousStep: "Previous step",
					speed: "Speed",
					step: "Step",
					of: "of",
					// Add more English fallbacks as needed
				};
				return englishFallbacks[key] || key;
			}

			return POLISH_LOCALIZATION[key];
		},
		[enablePolishLocalization, currentLanguage],
	);

	// Context value for child components
	const contextValue = {
		t,
		currentLanguage,
		culturalSettings,
		updateCulturalSettings,
		toggleLanguage,
		isPolish: currentLanguage === "pl",
	};

	return (
		<div className={`polish-mobile-interface ${className}`}>
			{/* Language/Cultural Settings Button */}
			<Button
				size="sm"
				variant="outline"
				onClick={() => setShowLocalizationPanel(!showLocalizationPanel)}
				className="fixed top-4 left-4 z-50 bg-white/90 backdrop-blur-sm"
			>
				<Languages className="mr-2 h-4 w-4" />
				{currentLanguage === "pl" ? "PL" : "EN"}
			</Button>

			{/* Localization Panel */}
			{showLocalizationPanel && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
					<div className="w-full max-w-md rounded-lg bg-white p-6">
						<div className="mb-4 flex items-center justify-between">
							<h3 className="flex items-center gap-2 font-semibold text-lg">
								<Globe className="h-5 w-5" />
								Ustawienia językowe
							</h3>
							<Button
								size="sm"
								variant="outline"
								onClick={() => setShowLocalizationPanel(false)}
							>
								✕
							</Button>
						</div>

						{/* Language Selection */}
						<div className="space-y-4">
							<div>
								<label className="mb-2 block font-medium text-sm">
									Język interfejsu
								</label>
								<div className="flex gap-2">
									<Button
										size="sm"
										variant={currentLanguage === "pl" ? "default" : "outline"}
										onClick={() => setCurrentLanguage("pl")}
										className="flex-1"
									>
										🇵🇱 Polski
									</Button>
									<Button
										size="sm"
										variant={currentLanguage === "en" ? "default" : "outline"}
										onClick={() => setCurrentLanguage("en")}
										className="flex-1"
									>
										🇬🇧 English
									</Button>
								</div>
							</div>

							{/* Cultural Settings */}
							{enableCulturalAdaptations && (
								<div className="space-y-3">
									<h4 className="flex items-center gap-2 font-medium">
										<Users className="h-4 w-4" />
										Ustawienia kulturowe
									</h4>

									<div>
										<label className="mb-1 block text-sm">Czułość gestów</label>
										<div className="grid grid-cols-3 gap-1">
											{(["low", "medium", "high"] as const).map(
												(sensitivity) => (
													<Button
														key={sensitivity}
														size="sm"
														variant={
															culturalSettings.gestureSensitivity ===
															sensitivity
																? "default"
																: "outline"
														}
														onClick={() =>
															updateCulturalSettings({
																gestureSensitivity: sensitivity,
															})
														}
														className="text-xs"
													>
														{sensitivity === "low" && "Niska"}
														{sensitivity === "medium" && "Średnia"}
														{sensitivity === "high" && "Wysoka"}
													</Button>
												),
											)}
										</div>
									</div>

									<div>
										<label className="mb-1 block text-sm">
											Intensywność haptyczna
										</label>
										<div className="grid grid-cols-3 gap-1">
											{(["subtle", "normal", "strong"] as const).map(
												(intensity) => (
													<Button
														key={intensity}
														size="sm"
														variant={
															culturalSettings.hapticIntensity === intensity
																? "default"
																: "outline"
														}
														onClick={() =>
															updateCulturalSettings({
																hapticIntensity: intensity,
															})
														}
														className="text-xs"
													>
														{intensity === "subtle" && "Subtelna"}
														{intensity === "normal" && "Normalna"}
														{intensity === "strong" && "Silna"}
													</Button>
												),
											)}
										</div>
									</div>

									<div>
										<label className="mb-1 block text-sm">
											Schemat kolorów
										</label>
										<div className="grid grid-cols-3 gap-1">
											{(["natural", "vibrant", "medical"] as const).map(
												(scheme) => (
													<Button
														key={scheme}
														size="sm"
														variant={
															culturalSettings.colorScheme === scheme
																? "default"
																: "outline"
														}
														onClick={() =>
															updateCulturalSettings({ colorScheme: scheme })
														}
														className="text-xs"
													>
														{scheme === "natural" && "Naturalny"}
														{scheme === "vibrant" && "Żywy"}
														{scheme === "medical" && "Medyczny"}
													</Button>
												),
											)}
										</div>
									</div>
								</div>
							)}

							{/* Regional Settings */}
							{enableRegionalSettings && (
								<div className="space-y-3">
									<h4 className="font-medium">Ustawienia regionalne</h4>

									<div>
										<label className="mb-1 block text-sm">Format daty</label>
										<div className="grid grid-cols-3 gap-1">
											{(
												["DD.MM.YYYY", "MM/DD/YYYY", "YYYY-MM-DD"] as const
											).map((format) => (
												<Button
													key={format}
													size="sm"
													variant={
														culturalSettings.dateFormat === format
															? "default"
															: "outline"
													}
													onClick={() =>
														updateCulturalSettings({ dateFormat: format })
													}
													className="text-xs"
												>
													{format}
												</Button>
											))}
										</div>
									</div>

									<div>
										<label className="mb-1 block text-sm">Format czasu</label>
										<div className="grid grid-cols-2 gap-1">
											{(["24h", "12h"] as const).map((format) => (
												<Button
													key={format}
													size="sm"
													variant={
														culturalSettings.timeFormat === format
															? "default"
															: "outline"
													}
													onClick={() =>
														updateCulturalSettings({ timeFormat: format })
													}
													className="text-xs"
												>
													{format}
												</Button>
											))}
										</div>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			)}

			{/* Main content with localization context */}
			<div
				data-language={currentLanguage}
				data-cultural-settings={JSON.stringify(culturalSettings)}
			>
				{children}
			</div>

			{/* Cultural Adaptation Indicator */}
			{enableCulturalAdaptations && (
				<div className="fixed bottom-4 left-4 z-40">
					<Badge variant="outline" className="bg-white/90 backdrop-blur-sm">
						<Heart className="mr-1 h-3 w-3" />
						Polska lokalizacja
					</Badge>
				</div>
			)}
		</div>
	);
};

// Hook for using Polish localization in components
export const usePolishLocalization = () => {
	const [isPolish, setIsPolish] = useState(true);

	const t = useCallback(
		(key: keyof PolishLocalization): string => {
			if (!isPolish) {
				const englishFallbacks: Partial<PolishLocalization> = {
					play: "Play",
					pause: "Pause",
					stop: "Stop",
					nextStep: "Next step",
					previousStep: "Previous step",
					speed: "Speed",
					step: "Step",
					of: "of",
					swipeLeft: "Swipe left",
					swipeRight: "Swipe right",
					swipeUp: "Swipe up",
					swipeDown: "Swipe down",
					pinchIn: "Pinch in",
					pinchOut: "Pinch out",
					tap: "Tap",
					doubleTap: "Double tap",
					longPress: "Long press",
					voiceControl: "Voice control",
					voiceCommands: "Voice commands",
					sayCommands: "Say command",
					performance: "Performance",
					battery: "Battery",
					memory: "Memory",
					quality: "Quality",
					frameRate: "Frame rate",
					accessibility: "Accessibility",
					screenReader: "Screen reader",
					highContrast: "High contrast",
					largeText: "Large text",
					reducedMotion: "Reduced motion",
					controls: "Controls",
					settings: "Settings",
					help: "Help",
					close: "Close",
					open: "Open",
					enabled: "Enabled",
					disabled: "Disabled",
					educationalContent: "Educational content",
					learningObjectives: "Learning objectives",
					keyPoints: "Key points",
					clinicalRelevance: "Clinical relevance",
					breathingCycle: "Breathing cycle",
					heartbeatCycle: "Heartbeat cycle",
					muscleContraction: "Muscle contraction",
					nerveImpulse: "Nerve impulse",
					bloodFlow: "Blood flow",
					hormoneRelease: "Hormone release",
					loading: "Loading...",
					error: "Error",
					success: "Success",
					warning: "Warning",
					info: "Information",
					touchOptimized: "Touch optimized",
					gestureMode: "Gesture mode",
					hapticFeedback: "Haptic feedback",
					adaptiveLayout: "Adaptive layout",
					splitScreen: "Split screen",
				};
				return englishFallbacks[key] || key;
			}

			return POLISH_LOCALIZATION[key];
		},
		[isPolish],
	);

	return {
		t,
		isPolish,
		setIsPolish,
		toggleLanguage: () => setIsPolish((prev) => !prev),
	};
};

// Gesture help component with Polish descriptions
interface GestureHelpProps {
	compact?: boolean;
}

export const GestureHelp: React.FC<GestureHelpProps> = ({
	compact = false,
}) => {
	const { t } = usePolishLocalization();

	if (compact) {
		return (
			<div className="fixed right-4 bottom-4 z-40">
				<Button
					size="sm"
					variant="outline"
					className="bg-white/90 backdrop-blur-sm"
					title="Pomoc z gestami"
				>
					<HelpCircle className="h-4 w-4" />
				</Button>
			</div>
		);
	}

	return (
		<div className="fixed right-4 bottom-4 z-40 max-w-xs rounded-lg bg-white/90 p-4 backdrop-blur-sm">
			<h4 className="mb-3 flex items-center gap-2 font-medium">
				<Smartphone className="h-4 w-4" />
				Gesty dotykowe
			</h4>
			<div className="space-y-2 text-sm">
				<div className="flex justify-between">
					<span>{t("swipeLeft")}:</span>
					<span className="font-medium">{t("nextStep")}</span>
				</div>
				<div className="flex justify-between">
					<span>{t("swipeRight")}:</span>
					<span className="font-medium">{t("previousStep")}</span>
				</div>
				<div className="flex justify-between">
					<span>{t("doubleTap")}:</span>
					<span className="font-medium">
						{t("play")}/{t("pause")}
					</span>
				</div>
				<div className="flex justify-between">
					<span>{t("pinchOut")}:</span>
					<span className="font-medium">Powiększ</span>
				</div>
				<div className="flex justify-between">
					<span>{t("longPress")}:</span>
					<span className="font-medium">{t("settings")}</span>
				</div>
			</div>
		</div>
	);
};
