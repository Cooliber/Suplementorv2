"use client";

/**
 * High Contrast Mode Component for Visual Impairments
 * Provides enhanced visibility for users with visual impairments
 */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Contrast, Eye, Palette } from "lucide-react";
import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";

interface HighContrastContextType {
	isEnabled: boolean;
	intensity: number;
	colorScheme: "black-white" | "blue-yellow" | "green-black";
	fontSize: number;
	enable: () => void;
	disable: () => void;
	setIntensity: (intensity: number) => void;
	setColorScheme: (
		scheme: "black-white" | "blue-yellow" | "green-black",
	) => void;
	setFontSize: (size: number) => void;
}

const HighContrastContext = createContext<HighContrastContextType | undefined>(
	undefined,
);

interface HighContrastProviderProps {
	children: React.ReactNode;
	defaultEnabled?: boolean;
	defaultIntensity?: number;
	defaultColorScheme?: "black-white" | "blue-yellow" | "green-black";
	defaultFontSize?: number;
}

export const HighContrastProvider: React.FC<HighContrastProviderProps> = ({
	children,
	defaultEnabled = false,
	defaultIntensity = 1.5,
	defaultColorScheme = "black-white",
	defaultFontSize = 1.2,
}) => {
	const [isEnabled, setIsEnabled] = useState(defaultEnabled);
	const [intensity, setIntensity] = useState(defaultIntensity);
	const [colorScheme, setColorScheme] = useState<
		"black-white" | "blue-yellow" | "green-black"
	>(defaultColorScheme);
	const [fontSize, setFontSize] = useState(defaultFontSize);

	// Apply high contrast styles to document
	useEffect(() => {
		if (typeof document === "undefined") return;

		const root = document.documentElement;
		const body = document.body;

		if (isEnabled) {
			// Apply high contrast CSS variables
			root.style.setProperty("--high-contrast-intensity", intensity.toString());
			root.style.setProperty("--high-contrast-font-size", fontSize.toString());
			root.style.setProperty("--high-contrast-scheme", colorScheme);

			body.classList.add("high-contrast-mode");

			// Apply color scheme specific styles
			switch (colorScheme) {
				case "black-white":
					root.style.setProperty("--high-contrast-bg", "#000000");
					root.style.setProperty("--high-contrast-fg", "#FFFFFF");
					root.style.setProperty("--high-contrast-accent", "#FFFFFF");
					root.style.setProperty("--high-contrast-border", "#FFFFFF");
					break;
				case "blue-yellow":
					root.style.setProperty("--high-contrast-bg", "#000080");
					root.style.setProperty("--high-contrast-fg", "#FFFF00");
					root.style.setProperty("--high-contrast-accent", "#FFFF00");
					root.style.setProperty("--high-contrast-border", "#FFFF00");
					break;
				case "green-black":
					root.style.setProperty("--high-contrast-bg", "#000000");
					root.style.setProperty("--high-contrast-fg", "#00FF00");
					root.style.setProperty("--high-contrast-accent", "#00FF00");
					root.style.setProperty("--high-contrast-border", "#00FF00");
					break;
			}
		} else {
			// Remove high contrast styles
			root.style.removeProperty("--high-contrast-intensity");
			root.style.removeProperty("--high-contrast-font-size");
			root.style.removeProperty("--high-contrast-scheme");
			root.style.removeProperty("--high-contrast-bg");
			root.style.removeProperty("--high-contrast-fg");
			root.style.removeProperty("--high-contrast-accent");
			root.style.removeProperty("--high-contrast-border");

			body.classList.remove("high-contrast-mode");
		}

		return () => {
			// Cleanup on unmount
			root.style.removeProperty("--high-contrast-intensity");
			root.style.removeProperty("--high-contrast-font-size");
			root.style.removeProperty("--high-contrast-scheme");
			body.classList.remove("high-contrast-mode");
		};
	}, [isEnabled, intensity, colorScheme, fontSize]);

	// Persist preferences to localStorage
	useEffect(() => {
		if (typeof localStorage === "undefined") return;

		const preferences = {
			enabled: isEnabled,
			intensity,
			colorScheme,
			fontSize,
		};

		localStorage.setItem(
			"high-contrast-preferences",
			JSON.stringify(preferences),
		);
	}, [isEnabled, intensity, colorScheme, fontSize]);

	// Load preferences from localStorage
	useEffect(() => {
		if (typeof localStorage === "undefined") return;

		try {
			const saved = localStorage.getItem("high-contrast-preferences");
			if (saved) {
				const preferences = JSON.parse(saved);
				setIsEnabled(preferences.enabled || false);
				setIntensity(preferences.intensity || defaultIntensity);
				setColorScheme(preferences.colorScheme || defaultColorScheme);
				setFontSize(preferences.fontSize || defaultFontSize);
			}
		} catch (error) {
			console.warn("Failed to load high contrast preferences:", error);
		}
	}, []);

	const enable = () => setIsEnabled(true);
	const disable = () => setIsEnabled(false);

	const contextValue: HighContrastContextType = {
		isEnabled,
		intensity,
		colorScheme,
		fontSize,
		enable,
		disable,
		setIntensity,
		setColorScheme,
		setFontSize,
	};

	return (
		<HighContrastContext.Provider value={contextValue}>
			{children}
		</HighContrastContext.Provider>
	);
};

export const useHighContrast = (): HighContrastContextType => {
	const context = useContext(HighContrastContext);
	if (context === undefined) {
		throw new Error(
			"useHighContrast must be used within a HighContrastProvider",
		);
	}
	return context;
};

// High contrast mode toggle component
export const HighContrastToggle: React.FC<{
	className?: string;
}> = ({ className = "" }) => {
	const { isEnabled, enable, disable } = useHighContrast();

	return (
		<Button
			variant={isEnabled ? "default" : "outline"}
			size="sm"
			onClick={isEnabled ? disable : enable}
			className={className}
			aria-label={
				isEnabled
					? "Wyłącz tryb wysokiego kontrastu"
					: "Włącz tryb wysokiego kontrastu"
			}
		>
			<Contrast className="mr-2 h-4 w-4" />
			{isEnabled ? "Wyłącz kontrast" : "Wysoki kontrast"}
		</Button>
	);
};

// High contrast mode controls panel
export const HighContrastControls: React.FC<{
	isVisible: boolean;
	onClose?: () => void;
}> = ({ isVisible, onClose }) => {
	const {
		isEnabled,
		intensity,
		colorScheme,
		fontSize,
		enable,
		disable,
		setIntensity,
		setColorScheme,
		setFontSize,
	} = useHighContrast();

	if (!isVisible) return null;

	return (
		<Card className="fixed top-20 right-4 z-50 w-80 bg-white/95 backdrop-blur-sm">
			<CardHeader className="pb-2">
				<CardTitle className="flex items-center justify-between text-sm">
					<div className="flex items-center gap-2">
						<Palette className="h-4 w-4" />
						Tryb wysokiego kontrastu
					</div>
					{onClose && (
						<Button variant="ghost" size="sm" onClick={onClose}>
							×
						</Button>
					)}
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				{/* Enable/disable toggle */}
				<div className="flex items-center justify-between">
					<span className="text-sm">Włącz tryb wysokiego kontrastu</span>
					<Switch
						checked={isEnabled}
						onCheckedChange={(checked) => (checked ? enable() : disable())}
					/>
				</div>

				{isEnabled && (
					<>
						{/* Intensity control */}
						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<span className="text-sm">Intensywność kontrastu</span>
								<Badge variant="outline">{intensity.toFixed(1)}x</Badge>
							</div>
							<input
								type="range"
								min="1"
								max="3"
								step="0.1"
								value={intensity}
								onChange={(e) =>
									setIntensity(Number.parseFloat(e.target.value))
								}
								className="w-full"
								aria-label="Intensywność kontrastu"
							/>
						</div>

						{/* Color scheme selection */}
						<div className="space-y-2">
							<span className="text-sm">Schemat kolorów</span>
							<div className="grid grid-cols-3 gap-2">
								{[
									{
										id: "black-white",
										label: "Czarno-biały",
										colors: ["bg-black", "bg-white"],
									},
									{
										id: "blue-yellow",
										label: "Niebiesko-żółty",
										colors: ["bg-blue-900", "bg-yellow-400"],
									},
									{
										id: "green-black",
										label: "Zielono-czarny",
										colors: ["bg-black", "bg-green-400"],
									},
								].map((scheme) => (
									<button
										key={scheme.id}
										onClick={() => setColorScheme(scheme.id as any)}
										className={`rounded border-2 p-2 text-xs ${
											colorScheme === scheme.id
												? "border-blue-500 bg-blue-50"
												: "border-gray-300 hover:border-gray-400"
										}
                    `}
									>
										<div className="mb-1 flex gap-1">
											{scheme.colors.map((color, index) => (
												<div
													key={index}
													className={`h-3 w-3 rounded ${color}`}
												/>
											))}
										</div>
										{scheme.label}
									</button>
								))}
							</div>
						</div>

						{/* Font size control */}
						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<span className="text-sm">Rozmiar czcionki</span>
								<Badge variant="outline">{Math.round(fontSize * 100)}%</Badge>
							</div>
							<input
								type="range"
								min="0.8"
								max="2"
								step="0.1"
								value={fontSize}
								onChange={(e) => setFontSize(Number.parseFloat(e.target.value))}
								className="w-full"
								aria-label="Rozmiar czcionki"
							/>
						</div>
					</>
				)}

				{/* Preview area */}
				{isEnabled && (
					<div className="rounded border bg-gray-50 p-3">
						<div className="mb-1 font-medium text-sm">Podgląd:</div>
						<div className="space-y-1">
							<div className="font-bold">Nagłówek</div>
							<div className="text-sm">
								Przykładowy tekst w trybie wysokiego kontrastu
							</div>
							<button className="rounded bg-blue-600 px-3 py-1 text-sm text-white">
								Przycisk
							</button>
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
};

// Enhanced focus indicators for high contrast mode
export const HighContrastFocusIndicator: React.FC<{
	children: React.ReactNode;
	showOutline?: boolean;
}> = ({ children, showOutline = true }) => {
	const { isEnabled } = useHighContrast();

	return (
		<div
			className={`
        ${isEnabled && showOutline ? "high-contrast-focus" : ""}
        ${isEnabled ? "high-contrast-content" : ""}
      `}
		>
			{children}
		</div>
	);
};

// Text component with high contrast support
export const HighContrastText: React.FC<{
	children: React.ReactNode;
	variant?: "normal" | "bold" | "large" | "small";
	className?: string;
}> = ({ children, variant = "normal", className = "" }) => {
	const { isEnabled } = useHighContrast();

	const getVariantClasses = () => {
		switch (variant) {
			case "bold":
				return "font-bold";
			case "large":
				return "text-lg";
			case "small":
				return "text-sm";
			default:
				return "";
		}
	};

	return (
		<span
			className={`
        ${isEnabled ? "high-contrast-text" : ""}
        ${getVariantClasses()}
        ${className}
      `}
		>
			{children}
		</span>
	);
};

// High contrast mode status indicator
export const HighContrastStatus: React.FC = () => {
	const { isEnabled, intensity, colorScheme } = useHighContrast();

	if (!isEnabled) return null;

	return (
		<Badge
			variant="outline"
			className="fixed top-4 left-4 z-50"
			aria-label={`Tryb wysokiego kontrastu aktywny: ${colorScheme}, intensywność ${intensity}`}
		>
			<Eye className="mr-1 h-3 w-3" />
			Kontrast: {colorScheme.replace("-", " ")}, {intensity}x
		</Badge>
	);
};

// Hook for detecting high contrast preference
export const useHighContrastPreference = () => {
	const [prefersHighContrast, setPrefersHighContrast] = useState(false);

	useEffect(() => {
		if (typeof window === "undefined") return;

		// Check for Windows high contrast mode
		const checkHighContrast = () => {
			if (window.matchMedia?.("(prefers-contrast: high)").matches) {
				setPrefersHighContrast(true);
			} else {
				setPrefersHighContrast(false);
			}
		};

		checkHighContrast();

		// Listen for changes
		const mediaQuery = window.matchMedia("(prefers-contrast: high)");
		mediaQuery.addEventListener("change", checkHighContrast);

		return () => {
			mediaQuery.removeEventListener("change", checkHighContrast);
		};
	}, []);

	return prefersHighContrast;
};

// High contrast CSS styles (to be included in global CSS)
export const highContrastStyles = `
  .high-contrast-mode {
    filter: contrast(var(--high-contrast-intensity, 1.5));
  }

  .high-contrast-mode * {
    border-color: var(--high-contrast-border, #FFFFFF) !important;
    background-color: var(--high-contrast-bg, #000000) !important;
    color: var(--high-contrast-fg, #FFFFFF) !important;
  }

  .high-contrast-mode .high-contrast-content {
    position: relative;
  }

  .high-contrast-mode .high-contrast-focus {
    outline: 4px solid var(--high-contrast-accent, #FFFFFF) !important;
    outline-offset: 2px !important;
  }

  .high-contrast-mode .high-contrast-text {
    font-weight: bold !important;
    text-shadow: 1px 1px 2px var(--high-contrast-bg, #000000);
  }

  .high-contrast-mode button:not(:disabled) {
    background-color: var(--high-contrast-fg, #FFFFFF) !important;
    color: var(--high-contrast-bg, #000000) !important;
    border: 2px solid var(--high-contrast-border, #FFFFFF) !important;
  }

  .high-contrast-mode input,
  .high-contrast-mode select,
  .high-contrast-mode textarea {
    background-color: var(--high-contrast-bg, #000000) !important;
    color: var(--high-contrast-fg, #FFFFFF) !important;
    border: 2px solid var(--high-contrast-border, #FFFFFF) !important;
  }

  /* Color scheme specific styles */
  .high-contrast-mode[data-scheme="blue-yellow"] {
    --high-contrast-bg: #000080;
    --high-contrast-fg: #FFFF00;
    --high-contrast-accent: #FFFF00;
    --high-contrast-border: #FFFF00;
  }

  .high-contrast-mode[data-scheme="green-black"] {
    --high-contrast-bg: #000000;
    --high-contrast-fg: #00FF00;
    --high-contrast-accent: #00FF00;
    --high-contrast-border: #00FF00;
  }
`;

// Utility function to apply high contrast styles programmatically
export const applyHighContrastStyles = (
	element: HTMLElement,
	isEnabled: boolean,
) => {
	if (isEnabled) {
		element.classList.add("high-contrast-content");
	} else {
		element.classList.remove("high-contrast-content");
	}
};

// Component for testing high contrast mode
export const HighContrastTester: React.FC = () => {
	const { isEnabled, intensity, colorScheme, fontSize } = useHighContrast();

	return (
		<Card className="w-full max-w-md">
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Eye className="h-5 w-5" />
					Tester trybu wysokiego kontrastu
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="grid grid-cols-2 gap-4 text-sm">
					<div>
						<strong>Status:</strong> {isEnabled ? "Włączony" : "Wyłączony"}
					</div>
					<div>
						<strong>Intensywność:</strong> {intensity}x
					</div>
					<div>
						<strong>Schemat:</strong> {colorScheme.replace("-", " ")}
					</div>
					<div>
						<strong>Czcionka:</strong> {Math.round(fontSize * 100)}%
					</div>
				</div>

				<div className="space-y-2">
					<div className="font-bold">Przykładowy nagłówek</div>
					<div className="text-sm">
						Przykładowy tekst w trybie wysokiego kontrastu
					</div>
					<div className="flex gap-2">
						<Button size="sm">Przycisk 1</Button>
						<Button size="sm" variant="outline">
							Przycisk 2
						</Button>
					</div>
				</div>

				<div className="text-gray-600 text-xs">
					Ten komponent pomaga testować wygląd treści w trybie wysokiego
					kontrastu.
				</div>
			</CardContent>
		</Card>
	);
};
