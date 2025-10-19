"use client";

/**
 * Polish Accessibility Features for Suplementor Animations
 * Comprehensive accessibility support for Polish users
 */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Accessibility,
	AlertTriangle,
	Brain,
	CheckCircle,
	Eye,
	EyeOff,
	Hand,
	Heart,
	HelpCircle,
	Settings,
	Type,
	Volume2,
	VolumeX,
	Zap,
} from "lucide-react";
import type React from "react";
import { useCallback, useEffect, useState } from "react";

import { usePolishLocalization } from "./PolishMobileInterface";

interface AccessibilityConfig {
	enableScreenReader: boolean;
	enableHighContrast: boolean;
	enableLargeText: boolean;
	enableReducedMotion: boolean;
	enableAudioDescriptions: boolean;
	enableKeyboardNavigation: boolean;
	enableFocusIndicators: boolean;
	enableColorBlindSupport: boolean;
	touchTargetSize: "normal" | "large" | "extra-large";
	animationSpeed: "normal" | "slow" | "very-slow";
	voiceLanguage: "pl-PL" | "en-US";
	highContrastLevel: "medium" | "high" | "maximum";
}

interface AccessibilityAnnouncement {
	id: string;
	message: string;
	polishMessage: string;
	priority: "low" | "medium" | "high" | "critical";
	category: "animation" | "navigation" | "error" | "success" | "info";
	timestamp: number;
}

interface AccessibilityHookReturn {
	config: AccessibilityConfig;
	announcements: AccessibilityAnnouncement[];
	updateConfig: (updates: Partial<AccessibilityConfig>) => void;
	announce: (
		message: string,
		polishMessage: string,
		priority?: AccessibilityAnnouncement["priority"],
		category?: AccessibilityAnnouncement["category"],
	) => void;
	clearAnnouncements: () => void;
	isAccessible: boolean;
	accessibilityScore: number;
}

const DEFAULT_ACCESSIBILITY_CONFIG: AccessibilityConfig = {
	enableScreenReader: true,
	enableHighContrast: false,
	enableLargeText: false,
	enableReducedMotion: false,
	enableAudioDescriptions: true,
	enableKeyboardNavigation: true,
	enableFocusIndicators: true,
	enableColorBlindSupport: false,
	touchTargetSize: "normal",
	animationSpeed: "normal",
	voiceLanguage: "pl-PL",
	highContrastLevel: "medium",
};

const ACCESSIBILITY_ANNOUNCEMENTS: Record<
	string,
	{ message: string; polishMessage: string }
> = {
	animationStarted: {
		message: "Animation started",
		polishMessage: "Animacja została uruchomiona",
	},
	animationPaused: {
		message: "Animation paused",
		polishMessage: "Animacja została wstrzymana",
	},
	animationStopped: {
		message: "Animation stopped",
		polishMessage: "Animacja została zatrzymana",
	},
	stepChanged: {
		message: "Step changed to",
		polishMessage: "Zmieniono na krok",
	},
	speedChanged: {
		message: "Animation speed changed to",
		polishMessage: "Zmieniono prędkość animacji na",
	},
	gestureRecognized: {
		message: "Gesture recognized",
		polishMessage: "Rozpoznano gest",
	},
	voiceCommandExecuted: {
		message: "Voice command executed",
		polishMessage: "Wykonano polecenie głosowe",
	},
	errorOccurred: {
		message: "Error occurred",
		polishMessage: "Wystąpił błąd",
	},
	performanceWarning: {
		message: "Performance warning",
		polishMessage: "Ostrzeżenie o wydajności",
	},
};

export const usePolishAccessibility = (): AccessibilityHookReturn => {
	const [config, setConfig] = useState<AccessibilityConfig>(
		DEFAULT_ACCESSIBILITY_CONFIG,
	);
	const [announcements, setAnnouncements] = useState<
		AccessibilityAnnouncement[]
	>([]);

	// Calculate accessibility score
	const calculateAccessibilityScore = useCallback(
		(cfg: AccessibilityConfig): number => {
			let score = 0;
			const features = Object.keys(cfg) as Array<keyof AccessibilityConfig>;

			features.forEach((feature) => {
				if (typeof cfg[feature] === "boolean" && cfg[feature]) {
					score += 10; // 10 points per enabled boolean feature
				}
			});

			// Bonus points for Polish-specific features
			if (cfg.voiceLanguage === "pl-PL") score += 5;
			if (cfg.touchTargetSize !== "normal") score += 5;
			if (cfg.animationSpeed !== "normal") score += 5;

			return Math.min(100, score);
		},
		[],
	);

	const [accessibilityScore, setAccessibilityScore] = useState(0);

	// Update accessibility score when config changes
	useEffect(() => {
		setAccessibilityScore(calculateAccessibilityScore(config));
	}, [config, calculateAccessibilityScore]);

	// Apply CSS custom properties for accessibility
	useEffect(() => {
		const root = document.documentElement;

		// Touch target size multiplier
		const touchSizeMultiplier = {
			normal: 1,
			large: 1.5,
			"extra-large": 2,
		}[config.touchTargetSize];

		root.style.setProperty(
			"--accessibility-touch-multiplier",
			touchSizeMultiplier.toString(),
		);

		// Animation speed multiplier
		const animationSpeedMultiplier = {
			normal: 1,
			slow: 0.7,
			"very-slow": 0.5,
		}[config.animationSpeed];

		root.style.setProperty(
			"--accessibility-animation-multiplier",
			animationSpeedMultiplier.toString(),
		);

		// High contrast mode
		if (config.enableHighContrast) {
			root.classList.add("high-contrast-mode");
		} else {
			root.classList.remove("high-contrast-mode");
		}

		// Large text mode
		if (config.enableLargeText) {
			root.classList.add("large-text-mode");
		} else {
			root.classList.remove("large-text-mode");
		}

		// Reduced motion
		if (config.enableReducedMotion) {
			root.classList.add("reduced-motion-mode");
		} else {
			root.classList.remove("reduced-motion-mode");
		}

		// Focus indicators
		if (config.enableFocusIndicators) {
			root.classList.add("focus-indicators-enabled");
		} else {
			root.classList.remove("focus-indicators-enabled");
		}
	}, [config]);

	// Announce to screen reader
	const announce = useCallback(
		(
			message: string,
			polishMessage: string,
			priority: AccessibilityAnnouncement["priority"] = "medium",
			category: AccessibilityAnnouncement["category"] = "info",
		) => {
			if (!config.enableScreenReader) return;

			const announcement: AccessibilityAnnouncement = {
				id: `announcement-${Date.now()}-${Math.random()}`,
				message,
				polishMessage,
				priority,
				category,
				timestamp: Date.now(),
			};

			setAnnouncements((prev) => [announcement, ...prev].slice(0, 20)); // Keep last 20 announcements

			// Create live region announcement
			const liveRegion = document.createElement("div");
			liveRegion.setAttribute(
				"aria-live",
				priority === "critical" ? "assertive" : "polite",
			);
			liveRegion.setAttribute("aria-atomic", "true");
			liveRegion.className = "sr-only";
			liveRegion.textContent =
				config.voiceLanguage === "pl-PL" ? polishMessage : message;

			document.body.appendChild(liveRegion);

			// Remove after announcement
			setTimeout(() => {
				document.body.removeChild(liveRegion);
			}, 1000);

			// Audio announcement for audio descriptions
			if (config.enableAudioDescriptions && "speechSynthesis" in window) {
				const utterance = new SpeechSynthesisUtterance(
					config.voiceLanguage === "pl-PL" ? polishMessage : message,
				);
				utterance.lang = config.voiceLanguage;
				utterance.rate = 0.9;
				utterance.volume = 0.7;

				window.speechSynthesis.speak(utterance);
			}
		},
		[config],
	);

	const clearAnnouncements = useCallback(() => {
		setAnnouncements([]);
	}, []);

	const updateConfig = useCallback((updates: Partial<AccessibilityConfig>) => {
		setConfig((prev) => ({ ...prev, ...updates }));
	}, []);

	const isAccessible = accessibilityScore >= 70;

	return {
		config,
		announcements,
		updateConfig,
		announce,
		clearAnnouncements,
		isAccessible,
		accessibilityScore,
	};
};

// Accessibility control panel component
interface AccessibilityPanelProps {
	position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
	compact?: boolean;
}

export const AccessibilityPanel: React.FC<AccessibilityPanelProps> = ({
	position = "bottom-right",
	compact = false,
}) => {
	const { t } = usePolishLocalization();
	const {
		config,
		updateConfig,
		accessibilityScore,
		isAccessible,
		announcements,
	} = usePolishAccessibility();
	const [showPanel, setShowPanel] = useState(false);

	const positionClasses = {
		"top-left": "top-4 left-4",
		"top-right": "top-4 right-4",
		"bottom-left": "bottom-4 left-4",
		"bottom-right": "bottom-4 right-4",
	};

	if (compact) {
		return (
			<div className={`fixed ${positionClasses[position]} z-50`}>
				<Button
					size="sm"
					variant="outline"
					onClick={() => setShowPanel(!showPanel)}
					className={`bg-white/90 backdrop-blur-sm ${isAccessible ? "border-green-500" : "border-yellow-500"}`}
				>
					<Accessibility className="h-4 w-4" />
				</Button>

				{/* Quick accessibility score */}
				<Badge
					variant="outline"
					className={`-top-2 -right-2 absolute text-xs ${
						isAccessible
							? "bg-green-500 text-white"
							: "bg-yellow-500 text-white"
					}`}
				>
					{accessibilityScore}%
				</Badge>
			</div>
		);
	}

	return (
		<div className={`fixed ${positionClasses[position]} z-50`}>
			{/* Main Accessibility Button */}
			<Button
				size="sm"
				variant="outline"
				onClick={() => setShowPanel(!showPanel)}
				className={`bg-white/90 backdrop-blur-sm ${isAccessible ? "border-green-500" : "border-yellow-500"}`}
			>
				<Accessibility className="mr-2 h-4 w-4" />
				Dostępność
				<Badge variant="outline" className="ml-2 text-xs">
					{accessibilityScore}%
				</Badge>
			</Button>

			{/* Accessibility Panel */}
			{showPanel && (
				<Card className="absolute right-0 bottom-full mb-2 max-h-[80vh] w-96 overflow-y-auto">
					<CardHeader className="pb-3">
						<CardTitle className="flex items-center gap-2 text-base">
							<Accessibility className="h-5 w-5" />
							Ustawienia dostępności
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						{/* Visual Accessibility */}
						<div className="space-y-3">
							<h4 className="flex items-center gap-2 font-medium text-sm">
								<Eye className="h-4 w-4" />
								Widoczność
							</h4>

							<div className="grid grid-cols-2 gap-2">
								<Button
									size="sm"
									variant={config.enableHighContrast ? "default" : "outline"}
									onClick={() =>
										updateConfig({
											enableHighContrast: !config.enableHighContrast,
										})
									}
									className="text-xs"
								>
									{config.enableHighContrast ? (
										<Eye className="mr-1 h-3 w-3" />
									) : (
										<EyeOff className="mr-1 h-3 w-3" />
									)}
									Wysoki kontrast
								</Button>

								<Button
									size="sm"
									variant={config.enableLargeText ? "default" : "outline"}
									onClick={() =>
										updateConfig({ enableLargeText: !config.enableLargeText })
									}
									className="text-xs"
								>
									<Type className="mr-1 h-3 w-3" />
									Duży tekst
								</Button>
							</div>

							<div className="grid grid-cols-2 gap-2">
								<Button
									size="sm"
									variant={config.enableReducedMotion ? "default" : "outline"}
									onClick={() =>
										updateConfig({
											enableReducedMotion: !config.enableReducedMotion,
										})
									}
									className="text-xs"
								>
									<Zap className="mr-1 h-3 w-3" />
									Zmniejszony ruch
								</Button>

								<Button
									size="sm"
									variant={
										config.enableColorBlindSupport ? "default" : "outline"
									}
									onClick={() =>
										updateConfig({
											enableColorBlindSupport: !config.enableColorBlindSupport,
										})
									}
									className="text-xs"
								>
									<Eye className="mr-1 h-3 w-3" />
									Daltonizm
								</Button>
							</div>
						</div>

						{/* Audio Accessibility */}
						<div className="space-y-3">
							<h4 className="flex items-center gap-2 font-medium text-sm">
								<Volume2 className="h-4 w-4" />
								Audio
							</h4>

							<div className="grid grid-cols-2 gap-2">
								<Button
									size="sm"
									variant={config.enableScreenReader ? "default" : "outline"}
									onClick={() =>
										updateConfig({
											enableScreenReader: !config.enableScreenReader,
										})
									}
									className="text-xs"
								>
									{config.enableScreenReader ? (
										<Volume2 className="mr-1 h-3 w-3" />
									) : (
										<VolumeX className="mr-1 h-3 w-3" />
									)}
									Czytnik ekranu
								</Button>

								<Button
									size="sm"
									variant={
										config.enableAudioDescriptions ? "default" : "outline"
									}
									onClick={() =>
										updateConfig({
											enableAudioDescriptions: !config.enableAudioDescriptions,
										})
									}
									className="text-xs"
								>
									<Volume2 className="mr-1 h-3 w-3" />
									Opisy audio
								</Button>
							</div>

							<div>
								<label className="mb-1 block text-xs">Język głosu</label>
								<div className="grid grid-cols-2 gap-1">
									{(["pl-PL", "en-US"] as const).map((lang) => (
										<Button
											key={lang}
											size="sm"
											variant={
												config.voiceLanguage === lang ? "default" : "outline"
											}
											onClick={() => updateConfig({ voiceLanguage: lang })}
											className="text-xs"
										>
											{lang === "pl-PL" ? "🇵🇱 Polski" : "🇬🇧 English"}
										</Button>
									))}
								</div>
							</div>
						</div>

						{/* Motor Accessibility */}
						<div className="space-y-3">
							<h4 className="flex items-center gap-2 font-medium text-sm">
								<Hand className="h-4 w-4" />
								Sterowanie
							</h4>

							<div>
								<label className="mb-1 block text-xs">
									Rozmiar celów dotyku
								</label>
								<div className="grid grid-cols-3 gap-1">
									{(["normal", "large", "extra-large"] as const).map((size) => (
										<Button
											key={size}
											size="sm"
											variant={
												config.touchTargetSize === size ? "default" : "outline"
											}
											onClick={() => updateConfig({ touchTargetSize: size })}
											className="text-xs"
										>
											{size === "normal" && "Normalny"}
											{size === "large" && "Duży"}
											{size === "extra-large" && "Bardzo duży"}
										</Button>
									))}
								</div>
							</div>

							<div className="grid grid-cols-2 gap-2">
								<Button
									size="sm"
									variant={
										config.enableKeyboardNavigation ? "default" : "outline"
									}
									onClick={() =>
										updateConfig({
											enableKeyboardNavigation:
												!config.enableKeyboardNavigation,
										})
									}
									className="text-xs"
								>
									⌨️ Nawigacja klawiaturą
								</Button>

								<Button
									size="sm"
									variant={config.enableFocusIndicators ? "default" : "outline"}
									onClick={() =>
										updateConfig({
											enableFocusIndicators: !config.enableFocusIndicators,
										})
									}
									className="text-xs"
								>
									🎯 Wskaźniki fokusu
								</Button>
							</div>
						</div>

						{/* Animation Speed */}
						<div className="space-y-3">
							<h4 className="flex items-center gap-2 font-medium text-sm">
								<Settings className="h-4 w-4" />
								Animacje
							</h4>

							<div>
								<label className="mb-1 block text-xs">Prędkość animacji</label>
								<div className="grid grid-cols-3 gap-1">
									{(["normal", "slow", "very-slow"] as const).map((speed) => (
										<Button
											key={speed}
											size="sm"
											variant={
												config.animationSpeed === speed ? "default" : "outline"
											}
											onClick={() => updateConfig({ animationSpeed: speed })}
											className="text-xs"
										>
											{speed === "normal" && "Normalna"}
											{speed === "slow" && "Wolna"}
											{speed === "very-slow" && "Bardzo wolna"}
										</Button>
									))}
								</div>
							</div>
						</div>

						{/* Accessibility Status */}
						<div className="border-t pt-3">
							<div className="flex items-center justify-between">
								<span className="text-sm">Ocena dostępności:</span>
								<div className="flex items-center gap-2">
									<Badge
										variant={isAccessible ? "default" : "outline"}
										className="text-xs"
									>
										{accessibilityScore}%
									</Badge>
									{isAccessible ? (
										<CheckCircle className="h-4 w-4 text-green-500" />
									) : (
										<AlertTriangle className="h-4 w-4 text-yellow-500" />
									)}
								</div>
							</div>

							{!isAccessible && (
								<p className="mt-1 text-gray-600 text-xs">
									Włącz więcej opcji dostępności, aby poprawić ocenę
								</p>
							)}
						</div>

						{/* Recent Announcements */}
						{announcements.length > 0 && (
							<div className="border-t pt-3">
								<h5 className="mb-2 font-medium text-sm">
									Ostatnie ogłoszenia
								</h5>
								<div className="max-h-24 space-y-1 overflow-y-auto">
									{announcements.slice(0, 3).map((announcement) => (
										<div
											key={announcement.id}
											className="rounded bg-gray-50 p-2 text-xs"
										>
											<div className="flex items-center gap-2">
												<Badge variant="outline" className="text-xs">
													{announcement.category}
												</Badge>
												<span className="flex-1">
													{config.voiceLanguage === "pl-PL"
														? announcement.polishMessage
														: announcement.message}
												</span>
											</div>
										</div>
									))}
								</div>
							</div>
						)}
					</CardContent>
				</Card>
			)}
		</div>
	);
};

// Screen reader announcements component
interface ScreenReaderAnnouncerProps {
	announcements: AccessibilityAnnouncement[];
	language: "pl-PL" | "en-US";
}

export const ScreenReaderAnnouncer: React.FC<ScreenReaderAnnouncerProps> = ({
	announcements,
	language,
}) => {
	const latestAnnouncement = announcements[0];

	if (!latestAnnouncement) return null;

	return (
		<>
			{latestAnnouncement.priority === "critical" ? (
				<div aria-live="assertive" aria-atomic="true" className="sr-only">
					{language === "pl-PL"
						? latestAnnouncement.polishMessage
						: latestAnnouncement.message}
				</div>
			) : (
				<div aria-live="polite" aria-atomic="true" className="sr-only">
					{language === "pl-PL"
						? latestAnnouncement.polishMessage
						: latestAnnouncement.message}
				</div>
			)}
		</>
	);
};

// High contrast mode CSS (to be included in global styles)
export const highContrastCSS = `
.high-contrast-mode {
  filter: contrast(150%) brightness(120%);
}

.high-contrast-mode * {
  border-color: #000 !important;
}

.large-text-mode {
  font-size: 120% !important;
}

.large-text-mode button,
.large-text-mode .touch-target {
  min-height: calc(44px * var(--accessibility-touch-multiplier, 1)) !important;
  min-width: calc(44px * var(--accessibility-touch-multiplier, 1)) !important;
  padding: calc(12px * var(--accessibility-touch-multiplier, 1)) calc(16px * var(--accessibility-touch-multiplier, 1)) !important;
}

.reduced-motion-mode *,
.reduced-motion-mode *::before,
.reduced-motion-mode *::after {
  animation-duration: calc(0.01ms * var(--accessibility-animation-multiplier, 1)) !important;
  animation-iteration-count: 1 !important;
  transition-duration: calc(0.01ms * var(--accessibility-animation-multiplier, 1)) !important;
}

.focus-indicators-enabled *:focus {
  outline: 3px solid #0066cc !important;
  outline-offset: 2px !important;
}

.sr-only {
  position: absolute !important;
  width: 1px !important;
  height: 1px !important;
  padding: 0 !important;
  margin: -1px !important;
  overflow: hidden !important;
  clip: rect(0, 0, 0, 0) !important;
  white-space: nowrap !important;
  border: 0 !important;
}
`;

// Keyboard navigation handler
export const useKeyboardNavigation = (callbacks: {
	onPlay?: () => void;
	onPause?: () => void;
	onStop?: () => void;
	onNext?: () => void;
	onPrevious?: () => void;
	onToggleControls?: () => void;
	onHelp?: () => void;
}) => {
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			// Only handle if no input is focused
			if (
				document.activeElement?.tagName === "INPUT" ||
				document.activeElement?.tagName === "TEXTAREA" ||
				document.activeElement?.contentEditable === "true"
			) {
				return;
			}

			switch (event.key) {
				case " ":
				case "Enter":
					event.preventDefault();
					callbacks.onPlay?.();
					break;
				case "p":
				case "P":
					event.preventDefault();
					callbacks.onPause?.();
					break;
				case "s":
				case "S":
					event.preventDefault();
					callbacks.onStop?.();
					break;
				case "ArrowRight":
				case "n":
				case "N":
					event.preventDefault();
					callbacks.onNext?.();
					break;
				case "ArrowLeft":
				case "b":
				case "B":
					event.preventDefault();
					callbacks.onPrevious?.();
					break;
				case "c":
				case "C":
					event.preventDefault();
					callbacks.onToggleControls?.();
					break;
				case "h":
				case "H":
				case "?":
					event.preventDefault();
					callbacks.onHelp?.();
					break;
				case "Escape":
					event.preventDefault();
					// Close any open panels
					break;
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [callbacks]);
};
