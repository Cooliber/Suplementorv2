"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
	Contrast,
	Eye,
	EyeOff,
	Focus,
	Headphones,
	Keyboard,
	MonitorSpeaker,
	MousePointer,
	Type,
	Volume2,
	VolumeX,
	Zap,
} from "lucide-react";
import { useEffect, useState } from "react";

interface AccessibilityControlsProps {
	isVisible: boolean;
	highContrast: boolean;
	reducedMotion: boolean;
	largeText: boolean;
	screenReaderSupport: boolean;
	keyboardNavigation: boolean;
	onHighContrastToggle: (enabled: boolean) => void;
	onReducedMotionToggle: (enabled: boolean) => void;
	onLargeTextToggle: (enabled: boolean) => void;
	onScreenReaderToggle: (enabled: boolean) => void;
	onKeyboardNavigationToggle: (enabled: boolean) => void;
	className?: string;
}

// Screen reader announcement utility
export const useScreenReader = () => {
	const [announcements, setAnnouncements] = useState<string[]>([]);

	const announce = (
		message: string,
		priority: "polite" | "assertive" = "polite",
	) => {
		setAnnouncements((prev) => [...prev, message]);

		// Remove announcement after it's been read
		setTimeout(() => {
			setAnnouncements((prev) => prev.slice(1));
		}, 1000);
	};

	useEffect(() => {
		if (typeof window !== "undefined" && "speechSynthesis" in window) {
			announcements.forEach((message, index) => {
				if (index === announcements.length - 1) {
					// Only announce the latest
					const utterance = new SpeechSynthesisUtterance(message);
					utterance.lang = "pl-PL";
					utterance.rate = 0.8;
					utterance.pitch = 1;
					window.speechSynthesis.speak(utterance);
				}
			});
		}
	}, [announcements]);

	return { announce };
};

// Keyboard navigation handler
export const useKeyboardNavigation = (
	enabled: boolean,
	onOrganFocus?: (organId: string) => void,
	onCameraControl?: (action: string) => void,
) => {
	useEffect(() => {
		if (!enabled) return;

		const handleKeyDown = (e: KeyboardEvent) => {
			switch (e.key) {
				case "ArrowUp":
					e.preventDefault();
					onCameraControl?.("moveUp");
					break;
				case "ArrowDown":
					e.preventDefault();
					onCameraControl?.("moveDown");
					break;
				case "ArrowLeft":
					e.preventDefault();
					onCameraControl?.("moveLeft");
					break;
				case "ArrowRight":
					e.preventDefault();
					onCameraControl?.("moveRight");
					break;
				case "PageUp":
					e.preventDefault();
					onCameraControl?.("zoomIn");
					break;
				case "PageDown":
					e.preventDefault();
					onCameraControl?.("zoomOut");
					break;
				case "Home":
					e.preventDefault();
					onCameraControl?.("reset");
					break;
				case "Enter":
				case " ":
					e.preventDefault();
					// Activate focused organ
					break;
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [enabled, onOrganFocus, onCameraControl]);
};

// Focus management for accessibility
export const useFocusManagement = (enabled: boolean) => {
	const [focusedElement, setFocusedElement] = useState<string | null>(null);

	useEffect(() => {
		if (!enabled) return;

		const handleFocusIn = (e: FocusEvent) => {
			const target = e.target as HTMLElement;
			const organId = target.getAttribute("data-organ-id");
			if (organId) {
				setFocusedElement(organId);
			}
		};

		const handleFocusOut = () => {
			setFocusedElement(null);
		};

		document.addEventListener("focusin", handleFocusIn);
		document.addEventListener("focusout", handleFocusOut);

		return () => {
			document.removeEventListener("focusin", handleFocusIn);
			document.removeEventListener("focusout", handleFocusOut);
		};
	}, [enabled]);

	return { focusedElement };
};

// Main accessibility controls component
export const AccessibilityControls: React.FC<AccessibilityControlsProps> = ({
	isVisible,
	highContrast,
	reducedMotion,
	largeText,
	screenReaderSupport,
	keyboardNavigation,
	onHighContrastToggle,
	onReducedMotionToggle,
	onLargeTextToggle,
	onScreenReaderToggle,
	onKeyboardNavigationToggle,
	className = "",
}) => {
	const [fontSize, setFontSize] = useState(1);

	// Apply accessibility styles to document
	useEffect(() => {
		if (typeof document === "undefined") return;

		const root = document.documentElement;

		if (highContrast) {
			root.style.setProperty("--high-contrast", "1");
			document.body.classList.add("high-contrast");
		} else {
			root.style.removeProperty("--high-contrast");
			document.body.classList.remove("high-contrast");
		}

		if (largeText) {
			root.style.setProperty("--font-scale", fontSize.toString());
			document.body.classList.add("large-text");
		} else {
			root.style.removeProperty("--font-scale");
			document.body.classList.remove("large-text");
		}

		if (reducedMotion) {
			root.style.setProperty("--reduced-motion", "1");
			document.body.classList.add("reduced-motion");
		} else {
			root.style.removeProperty("--reduced-motion");
			document.body.classList.remove("reduced-motion");
		}
	}, [highContrast, largeText, fontSize, reducedMotion]);

	if (!isVisible) return null;

	return (
		<div className={`fixed top-4 right-4 z-50 ${className}`}>
			<Card className="w-80 bg-white/95 backdrop-blur-sm">
				<CardHeader className="pb-2">
					<CardTitle className="flex items-center gap-2 text-sm">
						<Focus className="h-4 w-4" />
						Ustawienia dostępności
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					{/* Visual accessibility options */}
					<div className="space-y-3">
						<h4 className="font-medium text-sm">Wyświetlanie</h4>

						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<Contrast className="h-4 w-4" />
								<span className="text-sm">Wysoki kontrast</span>
							</div>
							<Switch
								checked={highContrast}
								onCheckedChange={onHighContrastToggle}
							/>
						</div>

						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<Type className="h-4 w-4" />
								<span className="text-sm">Duży tekst</span>
							</div>
							<Switch checked={largeText} onCheckedChange={onLargeTextToggle} />
						</div>

						{largeText && (
							<div className="space-y-2">
								<span className="text-sm">Rozmiar czcionki</span>
								<Slider
									value={[fontSize]}
									onValueChange={([value]) => setFontSize(value || 1)}
									min={1}
									max={2}
									step={0.1}
									className="w-full"
								/>
							</div>
						)}

						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<Zap className="h-4 w-4" />
								<span className="text-sm">Zmniejszony ruch</span>
							</div>
							<Switch
								checked={reducedMotion}
								onCheckedChange={onReducedMotionToggle}
							/>
						</div>
					</div>

					{/* Audio accessibility options */}
					<div className="space-y-3">
						<h4 className="font-medium text-sm">Dźwięk i nawigacja</h4>

						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<Headphones className="h-4 w-4" />
								<span className="text-sm">Czytnik ekranu</span>
							</div>
							<Switch
								checked={screenReaderSupport}
								onCheckedChange={onScreenReaderToggle}
							/>
						</div>

						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<Keyboard className="h-4 w-4" />
								<span className="text-sm">Nawigacja klawiaturą</span>
							</div>
							<Switch
								checked={keyboardNavigation}
								onCheckedChange={onKeyboardNavigationToggle}
							/>
						</div>
					</div>

					{/* Accessibility status */}
					<div className="border-t pt-2">
						<div className="flex flex-wrap gap-1">
							{highContrast && (
								<Badge variant="outline" className="text-xs">
									Wysoki kontrast
								</Badge>
							)}
							{largeText && (
								<Badge variant="outline" className="text-xs">
									Duży tekst
								</Badge>
							)}
							{reducedMotion && (
								<Badge variant="outline" className="text-xs">
									Zmniejszony ruch
								</Badge>
							)}
							{screenReaderSupport && (
								<Badge variant="outline" className="text-xs">
									Czytnik ekranu
								</Badge>
							)}
							{keyboardNavigation && (
								<Badge variant="outline" className="text-xs">
									Klawiatura
								</Badge>
							)}
						</div>
					</div>

					{/* Keyboard shortcuts help */}
					{keyboardNavigation && (
						<div className="rounded bg-gray-50 p-2 text-gray-600 text-xs">
							<div className="mb-1 font-medium">Skróty klawiaturowe:</div>
							<div>↑↓←→ - Nawigacja kamery</div>
							<div>Page Up/Down - Powiększenie</div>
							<div>Home - Reset widoku</div>
							<div>Enter - Aktywacja organu</div>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
};

// Accessible organ component wrapper
export const AccessibleOrgan: React.FC<{
	organ: {
		id: string;
		name: string;
		polishName: string;
		description?: string;
		polishDescription?: string;
	};
	isSelected: boolean;
	isHovered: boolean;
	onClick: () => void;
	onFocus: () => void;
	onBlur: () => void;
	children: React.ReactNode;
}> = ({ organ, isSelected, isHovered, onClick, onFocus, onBlur, children }) => {
	const { announce } = useScreenReader();

	const handleClick = () => {
		onClick();
		announce(`Wybrano ${organ.polishName}. ${organ.polishDescription || ""}`);
	};

	const handleFocus = () => {
		onFocus();
		announce(`Skupiono na ${organ.polishName}`);
	};

	const handleBlur = () => {
		onBlur();
	};

	return (
		<div
			role="button"
			tabIndex={0}
			aria-label={`${organ.polishName}. ${organ.polishDescription || ""}`}
			data-organ-id={organ.id}
			className={`focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded${isSelected ? "ring-2 ring-blue-500" : ""}
				${isHovered ? "bg-blue-100" : ""}
			`}
			onClick={handleClick}
			onFocus={handleFocus}
			onBlur={onBlur}
		>
			{children}
		</div>
	);
};

// High contrast CSS styles (to be added to global CSS)
export const accessibilityStyles = `
.high-contrast {
	filter: contrast(150%) brightness(120%);
}

.high-contrast * {
	border-color: currentColor !important;
}

.large-text {
	font-size: calc(1rem * var(--font-scale, 1));
	line-height: 1.5;
}

.reduced-motion * {
	animation-duration: 0.01ms !important;
	animation-iteration-count: 1 !important;
	transition-duration: 0.01ms !important;
}

.accessibility-focus {
	outline: 3px solid #2563EB;
	outline-offset: 2px;
}
`;

// ARIA live region for announcements
export const ScreenReaderAnnouncer: React.FC = () => {
	return <div aria-live="polite" aria-atomic="true" className="sr-only" />;
};
