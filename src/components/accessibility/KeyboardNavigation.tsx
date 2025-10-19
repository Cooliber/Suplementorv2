"use client";

/**
 * Keyboard Navigation System for Enhanced Accessibility
 * Provides comprehensive keyboard navigation support with visual indicators
 */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	ArrowDown,
	ArrowLeft,
	ArrowRight,
	ArrowUp,
	Focus,
	Keyboard,
	Navigation,
} from "lucide-react";
import type React from "react";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";

interface KeyboardNavigationContextType {
	isEnabled: boolean;
	showIndicators: boolean;
	currentFocus: string | null;
	navigationPath: string[];
	enable: () => void;
	disable: () => void;
	setShowIndicators: (show: boolean) => void;
	focusElement: (elementId: string) => void;
	navigateTo: (
		direction: "up" | "down" | "left" | "right" | "next" | "previous",
	) => void;
	getNavigationHelp: () => string[];
	getPolishNavigationHelp: () => string[];
}

const KeyboardNavigationContext = createContext<
	KeyboardNavigationContextType | undefined
>(undefined);

interface KeyboardNavigationProviderProps {
	children: React.ReactNode;
	defaultEnabled?: boolean;
	defaultShowIndicators?: boolean;
}

export const KeyboardNavigationProvider: React.FC<
	KeyboardNavigationProviderProps
> = ({ children, defaultEnabled = false, defaultShowIndicators = true }) => {
	const [isEnabled, setIsEnabled] = useState(defaultEnabled);
	const [showIndicators, setShowIndicators] = useState(defaultShowIndicators);
	const [currentFocus, setCurrentFocus] = useState<string | null>(null);
	const [navigationPath, setNavigationPath] = useState<string[]>([]);
	const [focusableElements, setFocusableElements] = useState<
		Map<string, HTMLElement>
	>(new Map());

	// Track focusable elements
	useEffect(() => {
		if (!isEnabled || typeof document === "undefined") return;

		const updateFocusableElements = () => {
			const elements = document.querySelectorAll(
				'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"]), [role="button"]',
			);

			const elementMap = new Map<string, HTMLElement>();
			elements.forEach((element, index) => {
				const id = element.id || `focusable-${index}`;
				if (!element.id) {
					element.id = id;
				}
				elementMap.set(id, element as HTMLElement);
			});

			setFocusableElements(elementMap);
		};

		updateFocusableElements();

		// Update on DOM changes
		const observer = new MutationObserver(updateFocusableElements);
		observer.observe(document.body, { childList: true, subtree: true });

		return () => {
			observer.disconnect();
		};
	}, [isEnabled]);

	// Handle keyboard navigation
	useEffect(() => {
		if (!isEnabled) return;

		const handleKeyDown = (e: KeyboardEvent) => {
			switch (e.key) {
				case "Tab":
					handleTabNavigation(e);
					break;
				case "ArrowUp":
					e.preventDefault();
					navigateTo("up");
					break;
				case "ArrowDown":
					e.preventDefault();
					navigateTo("down");
					break;
				case "ArrowLeft":
					e.preventDefault();
					navigateTo("left");
					break;
				case "ArrowRight":
					e.preventDefault();
					navigateTo("right");
					break;
				case "Enter":
				case " ":
					handleActivation(e);
					break;
				case "Escape":
					handleEscape(e);
					break;
				case "Home":
					e.preventDefault();
					focusFirstElement();
					break;
				case "End":
					e.preventDefault();
					focusLastElement();
					break;
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [isEnabled]);

	// Track focus changes
	useEffect(() => {
		if (!isEnabled) return;

		const handleFocusIn = (e: FocusEvent) => {
			const target = e.target as HTMLElement;
			const elementId = target.id || target.getAttribute("data-focus-id");

			if (elementId) {
				setCurrentFocus(elementId);
				setNavigationPath((prev) => [...prev.slice(-4), elementId]); // Keep last 5 elements
			}
		};

		document.addEventListener("focusin", handleFocusIn);
		return () => document.removeEventListener("focusin", handleFocusIn);
	}, [isEnabled]);

	const handleTabNavigation = (e: KeyboardEvent) => {
		const elements = Array.from(focusableElements.values());
		const currentIndex = currentFocus
			? elements.findIndex((el) => el.id === currentFocus)
			: -1;

		if (e.shiftKey) {
			// Shift+Tab - go to previous element
			if (currentIndex > 0) {
				e.preventDefault();
				elements[currentIndex - 1]?.focus();
			}
		} else {
			// Tab - go to next element
			if (currentIndex < elements.length - 1 && currentIndex !== -1) {
				e.preventDefault();
				elements[currentIndex + 1]?.focus();
			}
		}
	};

	const navigateTo = useCallback(
		(direction: "up" | "down" | "left" | "right" | "next" | "previous") => {
			if (!currentFocus || focusableElements.size === 0) return;

			const elements = Array.from(focusableElements.values());
			const currentElement = focusableElements.get(currentFocus);
			if (!currentElement) return;

			const currentRect = currentElement.getBoundingClientRect();
			let targetElement: HTMLElement | null = null;
			let minDistance = Number.POSITIVE_INFINITY;

			elements.forEach((element) => {
				if (element.id === currentFocus) return;

				const rect = element.getBoundingClientRect();
				let isValidTarget = false;
				let distance = 0;

				switch (direction) {
					case "up":
						isValidTarget =
							rect.bottom <= currentRect.top &&
							Math.abs(rect.left - currentRect.left) < rect.width;
						distance = currentRect.top - rect.bottom;
						break;
					case "down":
						isValidTarget =
							rect.top >= currentRect.bottom &&
							Math.abs(rect.left - currentRect.left) < rect.width;
						distance = rect.top - currentRect.bottom;
						break;
					case "left":
						isValidTarget =
							rect.right <= currentRect.left &&
							Math.abs(rect.top - currentRect.top) < rect.height;
						distance = currentRect.left - rect.right;
						break;
					case "right":
						isValidTarget =
							rect.left >= currentRect.right &&
							Math.abs(rect.top - currentRect.top) < rect.height;
						distance = rect.left - currentRect.right;
						break;
					case "next":
						isValidTarget = true;
						distance = 0; // Will be handled by tab order
						break;
					case "previous":
						isValidTarget = true;
						distance = 0; // Will be handled by reverse tab order
						break;
				}

				if (isValidTarget && distance < minDistance && distance > 0) {
					minDistance = distance;
					targetElement = element;
				}
			});

			if (targetElement) {
				(targetElement as HTMLElement).focus();
			} else if (direction === "next" || direction === "previous") {
				// Fallback to tab order navigation
				const currentIndex = elements.findIndex((el) => el.id === currentFocus);
				if (currentIndex !== -1) {
					const nextIndex =
						direction === "next"
							? Math.min(currentIndex + 1, elements.length - 1)
							: Math.max(currentIndex - 1, 0);
					elements[nextIndex]?.focus();
				}
			}
		},
		[currentFocus, focusableElements],
	);

	const handleActivation = (e: KeyboardEvent) => {
		const target = e.target as HTMLElement;
		if (target && target.getAttribute("role") === "button") {
			// Simulate click for role="button" elements
			target.click();
		}
	};

	const handleEscape = (e: KeyboardEvent) => {
		// Close modals, dropdowns, etc.
		const activeElement = document.activeElement as HTMLElement;
		if (activeElement) {
			// Check if there's a close button or cancel action
			const modal = activeElement.closest('[role="dialog"], .modal, .popup');
			if (modal) {
				const closeButton = modal.querySelector(
					'button[aria-label*="zamknij"], button[aria-label*="close"]',
				) as HTMLElement;
				if (closeButton) {
					closeButton.click();
				}
			}
		}
	};

	const focusFirstElement = () => {
		const elements = Array.from(focusableElements.values());
		if (elements.length > 0) {
			elements[0]?.focus();
		}
	};

	const focusLastElement = () => {
		const elements = Array.from(focusableElements.values());
		if (elements.length > 0) {
			elements[elements.length - 1]?.focus();
		}
	};

	const focusElement = useCallback(
		(elementId: string) => {
			const element = focusableElements.get(elementId);
			if (element) {
				(element as HTMLElement).focus();
			}
		},
		[focusableElements],
	);

	const enable = () => setIsEnabled(true);
	const disable = () => setIsEnabled(false);

	const getNavigationHelp = (): string[] => [
		"Tab - Navigate to next element",
		"Shift + Tab - Navigate to previous element",
		"Arrow keys - Navigate in direction",
		"Enter/Space - Activate focused element",
		"Escape - Close modal or cancel",
		"Home - Go to first element",
		"End - Go to last element",
	];

	const getPolishNavigationHelp = (): string[] => [
		"Tab - Przejdź do następnego elementu",
		"Shift + Tab - Przejdź do poprzedniego elementu",
		"Strzałki - Nawigacja kierunkowa",
		"Enter/Spacja - Aktywuj zaznaczony element",
		"Escape - Zamknij modal lub anuluj",
		"Home - Przejdź do pierwszego elementu",
		"End - Przejdź do ostatniego elementu",
	];

	const contextValue: KeyboardNavigationContextType = {
		isEnabled,
		showIndicators,
		currentFocus,
		navigationPath,
		enable,
		disable,
		setShowIndicators,
		focusElement,
		navigateTo,
		getNavigationHelp,
		getPolishNavigationHelp,
	};

	return (
		<KeyboardNavigationContext.Provider value={contextValue}>
			{children}
			{isEnabled && showIndicators && <KeyboardNavigationIndicators />}
		</KeyboardNavigationContext.Provider>
	);
};

export const useKeyboardNavigation = (): KeyboardNavigationContextType => {
	const context = useContext(KeyboardNavigationContext);
	if (context === undefined) {
		throw new Error(
			"useKeyboardNavigation must be used within a KeyboardNavigationProvider",
		);
	}
	return context;
};

// Visual indicators for keyboard navigation
const KeyboardNavigationIndicators: React.FC = () => {
	const { currentFocus, navigationPath, showIndicators } =
		useKeyboardNavigation();

	if (!showIndicators || !currentFocus) return null;

	return (
		<>
			{/* Current focus indicator */}
			<div className="keyboard-focus-indicator">
				<Badge className="fixed top-16 left-4 z-50 bg-blue-600 text-white">
					<Focus className="mr-1 h-3 w-3" />
					Focus: {currentFocus}
				</Badge>
			</div>

			{/* Navigation path */}
			<div className="keyboard-navigation-path">
				<Card className="fixed top-24 left-4 z-50 w-64 bg-white/95 backdrop-blur-sm">
					<CardHeader className="pb-2">
						<CardTitle className="flex items-center gap-2 text-sm">
							<Navigation className="h-4 w-4" />
							Ścieżka nawigacji
						</CardTitle>
					</CardHeader>
					<CardContent className="pt-0">
						<div className="space-y-1">
							{navigationPath.slice(-3).map((elementId, index) => (
								<div
									key={`${elementId}-${index}`}
									className="flex items-center gap-2 text-xs"
								>
									<div className="h-2 w-2 rounded-full bg-blue-400" />
									<span className="truncate">{elementId}</span>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>
		</>
	);
};

// Keyboard navigation toggle component
export const KeyboardNavigationToggle: React.FC<{
	className?: string;
}> = ({ className = "" }) => {
	const { isEnabled, enable, disable } = useKeyboardNavigation();

	return (
		<Button
			variant={isEnabled ? "default" : "outline"}
			size="sm"
			onClick={isEnabled ? disable : enable}
			className={className}
			aria-label={
				isEnabled ? "Wyłącz nawigację klawiaturą" : "Włącz nawigację klawiaturą"
			}
		>
			<Keyboard className="mr-2 h-4 w-4" />
			{isEnabled ? "Wyłącz klawiaturę" : "Nawigacja klawiaturą"}
		</Button>
	);
};

// Enhanced focusable element wrapper
export const FocusableElement: React.FC<{
	children: React.ReactNode;
	elementId?: string;
	onFocus?: () => void;
	onBlur?: () => void;
	onActivate?: () => void;
	className?: string;
	role?: string;
	ariaLabel?: string;
	ariaDescription?: string;
}> = ({
	children,
	elementId,
	onFocus,
	onBlur,
	onActivate,
	className = "",
	role,
	ariaLabel,
	ariaDescription,
}) => {
	const { isEnabled } = useKeyboardNavigation();
	const [isFocused, setIsFocused] = useState(false);

	const handleFocus = () => {
		setIsFocused(true);
		onFocus?.();
	};

	const handleBlur = () => {
		setIsFocused(false);
		onBlur?.();
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			onActivate?.();
		}
	};

	const focusId =
		elementId || `focusable-${Math.random().toString(36).substr(2, 9)}`;

	return (
		<div
			id={focusId}
			role="button"
			aria-label={ariaLabel}
			aria-describedby={ariaDescription ? `${focusId}-description` : undefined}
			tabIndex={0}
			className={`rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isFocused ? "ring-2 ring-blue-400" : ""}
        ${isEnabled ? "keyboard-navigation-focusable" : ""}
        ${className}
      `}
			onFocus={handleFocus}
			onBlur={handleBlur}
			onKeyDown={handleKeyDown}
		>
			{children}
			{ariaDescription && (
				<div id={`${focusId}-description`} className="sr-only">
					{ariaDescription}
				</div>
			)}
		</div>
	);
};

// Keyboard navigation help panel
export const KeyboardNavigationHelp: React.FC<{
	isVisible: boolean;
	onClose?: () => void;
}> = ({ isVisible, onClose }) => {
	const { getNavigationHelp, getPolishNavigationHelp, isEnabled } =
		useKeyboardNavigation();

	if (!isVisible || !isEnabled) return null;

	return (
		<Card className="fixed top-20 right-4 z-50 w-80 bg-white/95 backdrop-blur-sm">
			<CardHeader className="pb-2">
				<CardTitle className="flex items-center justify-between text-sm">
					<div className="flex items-center gap-2">
						<Keyboard className="h-4 w-4" />
						Skróty klawiaturowe
					</div>
					{onClose && (
						<Button variant="ghost" size="sm" onClick={onClose}>
							×
						</Button>
					)}
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-3">
				<div className="space-y-2">
					<div className="font-medium text-sm">Nawigacja:</div>
					<div className="space-y-1 text-xs">
						{getPolishNavigationHelp().map((help, index) => (
							<div key={index} className="flex items-center gap-2">
								<kbd className="rounded bg-gray-100 px-2 py-1 text-xs">
									{help.split(" - ")[0]}
								</kbd>
								<span>{help.split(" - ")[1]}</span>
							</div>
						))}
					</div>
				</div>

				<div className="space-y-2">
					<div className="font-medium text-sm">Sterowanie kamerą:</div>
					<div className="space-y-1 text-xs">
						<div className="flex items-center gap-2">
							<kbd className="rounded bg-gray-100 px-2 py-1 text-xs">↑↓←→</kbd>
							<span>Nawigacja kamery</span>
						</div>
						<div className="flex items-center gap-2">
							<kbd className="rounded bg-gray-100 px-2 py-1 text-xs">
								Page Up/Down
							</kbd>
							<span>Powiększenie</span>
						</div>
						<div className="flex items-center gap-2">
							<kbd className="rounded bg-gray-100 px-2 py-1 text-xs">Home</kbd>
							<span>Reset widoku</span>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

// Focus trap for modal dialogs
export const FocusTrap: React.FC<{
	children: React.ReactNode;
	isActive: boolean;
	onEscape?: () => void;
}> = ({ children, isActive, onEscape }) => {
	const { isEnabled } = useKeyboardNavigation();
	const [firstFocusableElement, setFirstFocusableElement] =
		useState<HTMLElement | null>(null);
	const [lastFocusableElement, setLastFocusableElement] =
		useState<HTMLElement | null>(null);

	useEffect(() => {
		if (!isActive || !isEnabled) return;

		const updateFocusableElements = () => {
			const focusableSelectors = [
				"a[href]",
				"button:not([disabled])",
				"input:not([disabled])",
				"textarea:not([disabled])",
				"select:not([disabled])",
				'[tabindex]:not([tabindex="-1"])',
				'[role="button"]:not([aria-disabled="true"])',
			].join(", ");

			const focusableElements = Array.from(
				document.querySelectorAll(focusableSelectors),
			) as HTMLElement[];

			if (focusableElements.length > 0) {
				setFirstFocusableElement(focusableElements[0] || null);
				setLastFocusableElement(
					focusableElements[focusableElements.length - 1] || null,
				);
			}
		};

		// Update focusable elements when children change
		updateFocusableElements();

		const observer = new MutationObserver(updateFocusableElements);
		observer.observe(document.body, { childList: true, subtree: true });

		return () => observer.disconnect();
	}, [isActive, isEnabled]);

	useEffect(() => {
		if (!isActive || !isEnabled) return;

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Tab") {
				if (e.shiftKey) {
					// Shift + Tab
					if (
						document.activeElement === firstFocusableElement &&
						lastFocusableElement
					) {
						e.preventDefault();
						lastFocusableElement?.focus();
					}
				} else {
					// Tab
					if (
						document.activeElement === lastFocusableElement &&
						firstFocusableElement
					) {
						e.preventDefault();
						firstFocusableElement?.focus();
					}
				}
			} else if (e.key === "Escape" && onEscape) {
				onEscape();
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [
		isActive,
		isEnabled,
		firstFocusableElement,
		lastFocusableElement,
		onEscape,
	]);

	return <>{children}</>;
};

// Skip links for keyboard navigation
export const KeyboardSkipLinks: React.FC = () => {
	const { isEnabled, focusElement } = useKeyboardNavigation();

	if (!isEnabled) return null;

	const skipToMain = () => {
		focusElement("main-content");
	};

	const skipToNavigation = () => {
		focusElement("main-navigation");
	};

	const skipToSearch = () => {
		focusElement("search-input");
	};

	return (
		<div className="keyboard-skip-links">
			<button
				onClick={skipToMain}
				className="sr-only z-50 rounded bg-blue-600 px-4 py-2 text-white focus:not-sr-only focus:absolute focus:top-4 focus:left-4"
			>
				Przejdź do treści głównej
			</button>
			<button
				onClick={skipToNavigation}
				className="sr-only z-50 rounded bg-blue-600 px-4 py-2 text-white focus:not-sr-only focus:absolute focus:top-4 focus:left-4"
			>
				Przejdź do nawigacji
			</button>
			<button
				onClick={skipToSearch}
				className="sr-only z-50 rounded bg-blue-600 px-4 py-2 text-white focus:not-sr-only focus:absolute focus:top-4 focus:left-4"
			>
				Przejdź do wyszukiwania
			</button>
		</div>
	);
};

// Keyboard navigation status indicator
export const KeyboardNavigationStatus: React.FC = () => {
	const { isEnabled, currentFocus, showIndicators } = useKeyboardNavigation();

	if (!isEnabled || !showIndicators) return null;

	return (
		<div className="keyboard-navigation-status">
			<Badge className="fixed bottom-4 left-4 z-50 bg-green-600 text-white">
				<Keyboard className="mr-1 h-3 w-3" />
				Klawiatura aktywna
				{currentFocus && <span className="ml-2">• Focus: {currentFocus}</span>}
			</Badge>
		</div>
	);
};

// Enhanced button with keyboard support
export const KeyboardAccessibleButton: React.FC<{
	children: React.ReactNode;
	onClick: () => void;
	disabled?: boolean;
	variant?: "primary" | "secondary" | "outline";
	size?: "sm" | "md" | "lg";
	shortcut?: string;
	ariaLabel?: string;
	className?: string;
}> = ({
	children,
	onClick,
	disabled = false,
	variant = "primary",
	size = "md",
	shortcut,
	ariaLabel,
	className = "",
}) => {
	const handleKeyDown = (e: React.KeyboardEvent) => {
		if ((e.key === "Enter" || e.key === " ") && !disabled) {
			e.preventDefault();
			onClick();
		}
	};

	return (
		<button
			onClick={onClick}
			onKeyDown={handleKeyDown}
			disabled={disabled}
			aria-label={ariaLabel}
			className={`rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${variant === "primary" ? "bg-blue-600 text-white hover:bg-blue-700" : ""}
        ${variant === "secondary" ? "bg-gray-200 text-gray-900 hover:bg-gray-300" : ""}
        ${variant === "outline" ? "border border-gray-300 text-gray-700 hover:bg-gray-50" : ""}
        ${size === "sm" ? "px-3 py-1 text-sm" : ""}
        ${size === "md" ? "px-4 py-2 text-base" : ""}
        ${size === "lg" ? "px-6 py-3 text-lg" : ""}
        ${className}
      `}
		>
			{children}
			{shortcut && (
				<kbd className="ml-2 rounded bg-black bg-opacity-20 px-2 py-1 text-xs">
					{shortcut}
				</kbd>
			)}
		</button>
	);
};

// CSS styles for keyboard navigation
export const keyboardNavigationStyles = `
  .keyboard-navigation-focusable {
    position: relative;
  }

  .keyboard-navigation-focusable:focus {
    outline: 3px solid #2563EB;
    outline-offset: 2px;
  }

  .keyboard-focus-indicator {
    pointer-events: none;
    z-index: 9999;
  }

  .keyboard-navigation-path {
    pointer-events: none;
    z-index: 9998;
  }

  .keyboard-skip-links {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 9999;
  }

  .keyboard-navigation-status {
    pointer-events: none;
    z-index: 9997;
  }

  /* Enhanced focus styles for better visibility */
  .keyboard-navigation-mode *:focus {
    outline: 3px solid #2563EB !important;
    outline-offset: 2px !important;
  }

  .keyboard-navigation-mode button:focus,
  .keyboard-navigation-mode a:focus,
  .keyboard-navigation-mode input:focus,
  .keyboard-navigation-mode select:focus,
  .keyboard-navigation-mode textarea:focus {
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.3) !important;
  }
`;
