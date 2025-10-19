"use client";

/**
 * Enhanced Screen Reader Announcement System with Polish Language Support
 * Provides comprehensive screen reader support for body systems content
 */

import { useRouter } from "next/navigation";
import type React from "react";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";

interface ScreenReaderContextType {
	announce: (message: string, priority?: "polite" | "assertive") => void;
	announceOrgan: (organId: string, action?: string) => void;
	announceSystem: (systemId: string, action?: string) => void;
	announceSupplement: (supplementId: string, action?: string) => void;
	setLanguage: (language: "pl" | "en") => void;
	isEnabled: boolean;
	currentLanguage: "pl" | "en";
}

const ScreenReaderContext = createContext<ScreenReaderContextType | undefined>(
	undefined,
);

interface EnhancedScreenReaderProps {
	children: React.ReactNode;
	defaultLanguage?: "pl" | "en";
	autoDetect?: boolean;
}

export const EnhancedScreenReader: React.FC<EnhancedScreenReaderProps> = ({
	children,
	defaultLanguage = "pl",
	autoDetect = true,
}) => {
	const [isEnabled, setIsEnabled] = useState(false);
	const [currentLanguage, setCurrentLanguage] = useState<"pl" | "en">(
		defaultLanguage,
	);
	const [announcementQueue, setAnnouncementQueue] = useState<string[]>([]);

	const router = useRouter();

	// Auto-detect screen reader
	useEffect(() => {
		if (!autoDetect) {
			setIsEnabled(true);
			return;
		}

		const detectScreenReader = () => {
			const userAgent = navigator.userAgent;
			const hasScreenReader = /NVDA|JAWS|VoiceOver|TalkBack|Narrator/i.test(
				userAgent,
			);

			// Also check for common screen reader indicators
			const screenReaderIndicators = [
				"NVDA",
				"JAWS",
				"VoiceOver",
				"TalkBack",
				"Narrator",
				"screenReader",
				"assistiveTechnology",
			];

			const hasIndicators = screenReaderIndicators.some(
				(indicator) =>
					userAgent.includes(indicator) || (window as any)[indicator] === true,
			);

			return hasScreenReader || hasIndicators;
		};

		const checkScreenReader = () => {
			setIsEnabled(detectScreenReader());
		};

		checkScreenReader();

		// Check periodically for screen reader activation
		const interval = setInterval(checkScreenReader, 5000);

		return () => clearInterval(interval);
	}, [autoDetect]);

	// Process announcement queue
	useEffect(() => {
		if (announcementQueue.length === 0 || !isEnabled) return;

		const processQueue = async () => {
			const message = announcementQueue[0];

			if (typeof window !== "undefined" && "speechSynthesis" in window) {
				try {
					const utterance = new SpeechSynthesisUtterance(message);
					utterance.lang = currentLanguage === "pl" ? "pl-PL" : "en-US";
					utterance.rate = 0.8;
					utterance.pitch = 1;
					utterance.volume = 0.8;

					// Wait for previous announcement to finish
					if (window.speechSynthesis.speaking) {
						window.speechSynthesis.cancel();
					}

					window.speechSynthesis.speak(utterance);

					// Remove from queue after announcement
					setTimeout(() => {
						setAnnouncementQueue((prev) => prev.slice(1));
					}, 1000);
				} catch (error) {
					console.error("Screen reader announcement failed:", error);
					setAnnouncementQueue((prev) => prev.slice(1));
				}
			} else {
				// Fallback for environments without speech synthesis
				console.log("Screen Reader:", message);
				setAnnouncementQueue((prev) => prev.slice(1));
			}
		};

		processQueue();
	}, [announcementQueue, isEnabled, currentLanguage]);

	const announce = useCallback(
		(message: string, priority: "polite" | "assertive" = "polite") => {
			if (!isEnabled) return;

			const fullMessage = `${priority === "assertive" ? "Important: " : ""}${message}`;
			setAnnouncementQueue((prev) => [...prev, fullMessage]);
		},
		[isEnabled],
	);

	const announceOrgan = useCallback(
		(organId: string, action = "selected") => {
			const messages = {
				pl: {
					selected: `Wybrano narząd. ${organId}`,
					focused: `Skupiono na narządzie. ${organId}`,
					activated: `Aktywowano narząd. ${organId}`,
					navigated: `Nawigacja do narządu. ${organId}`,
				},
				en: {
					selected: `Selected organ. ${organId}`,
					focused: `Focused on organ. ${organId}`,
					activated: `Activated organ. ${organId}`,
					navigated: `Navigated to organ. ${organId}`,
				},
			};

			announce(
				messages[currentLanguage][action as keyof typeof messages.pl] ||
					messages[currentLanguage].selected,
			);
		},
		[announce, currentLanguage],
	);

	const announceSystem = useCallback(
		(systemId: string, action = "selected") => {
			const messages = {
				pl: {
					selected: `Wybrano układ ciała. ${systemId}`,
					focused: `Skupiono na układzie ciała. ${systemId}`,
					activated: `Aktywowano układ ciała. ${systemId}`,
					navigated: `Nawigacja do układu ciała. ${systemId}`,
				},
				en: {
					selected: `Selected body system. ${systemId}`,
					focused: `Focused on body system. ${systemId}`,
					activated: `Activated body system. ${systemId}`,
					navigated: `Navigated to body system. ${systemId}`,
				},
			};

			announce(
				messages[currentLanguage][action as keyof typeof messages.pl] ||
					messages[currentLanguage].selected,
			);
		},
		[announce, currentLanguage],
	);

	const announceSupplement = useCallback(
		(supplementId: string, action = "selected") => {
			const messages = {
				pl: {
					selected: `Wybrano suplement. ${supplementId}`,
					focused: `Skupiono na suplemencie. ${supplementId}`,
					activated: `Aktywowano suplement. ${supplementId}`,
					navigated: `Nawigacja do suplementu. ${supplementId}`,
				},
				en: {
					selected: `Selected supplement. ${supplementId}`,
					focused: `Focused on supplement. ${supplementId}`,
					activated: `Activated supplement. ${supplementId}`,
					navigated: `Navigated to supplement. ${supplementId}`,
				},
			};

			announce(
				messages[currentLanguage][action as keyof typeof messages.pl] ||
					messages[currentLanguage].selected,
			);
		},
		[announce, currentLanguage],
	);

	const setLanguage = useCallback(
		(language: "pl" | "en") => {
			setCurrentLanguage(language);
			announce(
				language === "pl"
					? "Zmieniono język na polski"
					: "Language changed to English",
			);
		},
		[announce],
	);

	const contextValue: ScreenReaderContextType = {
		announce,
		announceOrgan,
		announceSystem,
		announceSupplement,
		setLanguage,
		isEnabled,
		currentLanguage,
	};

	return (
		<ScreenReaderContext.Provider value={contextValue}>
			{children}
			{/* Hidden ARIA live regions for screen reader announcements */}
			<div aria-live="polite" aria-atomic="true" className="sr-only" />
			<div aria-live="assertive" aria-atomic="true" className="sr-only" />
		</ScreenReaderContext.Provider>
	);
};

export const useScreenReader = (): ScreenReaderContextType => {
	const context = useContext(ScreenReaderContext);
	if (context === undefined) {
		throw new Error(
			"useScreenReader must be used within an EnhancedScreenReader provider",
		);
	}
	return context;
};

// Hook for organ-specific screen reader support
export const useOrganScreenReader = (organId: string) => {
	const { announce, announceOrgan } = useScreenReader();

	const announceOrganAction = useCallback(
		(action: string, customMessage?: string) => {
			if (customMessage) {
				announce(customMessage);
			} else {
				announceOrgan(organId, action);
			}
		},
		[announce, announceOrgan, organId],
	);

	return { announceOrganAction };
};

// Hook for body system-specific screen reader support
export const useBodySystemScreenReader = (systemId: string) => {
	const { announce, announceSystem } = useScreenReader();

	const announceSystemAction = useCallback(
		(action: string, customMessage?: string) => {
			if (customMessage) {
				announce(customMessage);
			} else {
				announceSystem(systemId, action);
			}
		},
		[announce, announceSystem, systemId],
	);

	return { announceSystemAction };
};

// Hook for supplement-specific screen reader support
export const useSupplementScreenReader = (supplementId: string) => {
	const { announce, announceSupplement } = useScreenReader();

	const announceSupplementAction = useCallback(
		(action: string, customMessage?: string) => {
			if (customMessage) {
				announce(customMessage);
			} else {
				announceSupplement(supplementId, action);
			}
		},
		[announce, announceSupplement, supplementId],
	);

	return { announceSupplementAction };
};

// Component for screen reader-only content
export const ScreenReaderOnly: React.FC<{
	children: React.ReactNode;
}> = ({ children }) => {
	return (
		<div className="sr-only" aria-hidden="false">
			{children}
		</div>
	);
};

// Component for visual-only content (hidden from screen readers)
export const VisualOnly: React.FC<{
	children: React.ReactNode;
}> = ({ children }) => {
	return (
		<div aria-hidden="true" className="sr-only-when-focused">
			{children}
		</div>
	);
};

// Enhanced button component with screen reader support
export const AccessibleButton: React.FC<{
	children: React.ReactNode;
	onClick: () => void;
	ariaLabel?: string;
	polishAriaLabel?: string;
	announcement?: string;
	polishAnnouncement?: string;
	disabled?: boolean;
	variant?: "primary" | "secondary" | "outline";
	size?: "sm" | "md" | "lg";
}> = ({
	children,
	onClick,
	ariaLabel,
	polishAriaLabel,
	announcement,
	polishAnnouncement,
	disabled = false,
	variant = "primary",
	size = "md",
}) => {
	const { announce, currentLanguage } = useScreenReader();

	const handleClick = () => {
		if (disabled) return;

		onClick();

		if (announcement || polishAnnouncement) {
			const message =
				currentLanguage === "pl" ? polishAnnouncement : announcement;
			if (message) {
				announce(message);
			}
		}
	};

	const label = currentLanguage === "pl" ? polishAriaLabel : ariaLabel;

	return (
		<button
			onClick={handleClick}
			disabled={disabled}
			aria-label={label}
			className={`rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${variant === "primary" ? "bg-blue-600 text-white hover:bg-blue-700" : ""}
        ${variant === "secondary" ? "bg-gray-200 text-gray-900 hover:bg-gray-300" : ""}
        ${variant === "outline" ? "border border-gray-300 text-gray-700 hover:bg-gray-50" : ""}
        ${size === "sm" ? "px-3 py-1 text-sm" : ""}
        ${size === "md" ? "px-4 py-2 text-base" : ""}
        ${size === "lg" ? "px-6 py-3 text-lg" : ""}
      `}
		>
			{children}
		</button>
	);
};

// Enhanced card component with screen reader support
export const AccessibleCard: React.FC<{
	children: React.ReactNode;
	title?: string;
	polishTitle?: string;
	description?: string;
	polishDescription?: string;
	onClick?: () => void;
	onFocus?: () => void;
	onBlur?: () => void;
	selected?: boolean;
	expanded?: boolean;
}> = ({
	children,
	title,
	polishTitle,
	description,
	polishDescription,
	onClick,
	onFocus,
	onBlur,
	selected = false,
	expanded = false,
}) => {
	const { announce, currentLanguage } = useScreenReader();

	const handleFocus = () => {
		onFocus?.();

		const titleText = currentLanguage === "pl" ? polishTitle : title;
		const descText = currentLanguage === "pl" ? polishDescription : description;

		if (titleText) {
			announce(`Skupiono na: ${titleText}${descText ? `. ${descText}` : ""}`);
		}
	};

	const handleClick = () => {
		onClick?.();

		if (expanded) {
			announce(currentLanguage === "pl" ? "Karta rozwinięta" : "Card expanded");
		} else {
			announce(currentLanguage === "pl" ? "Karta zwinięta" : "Card collapsed");
		}
	};

	const displayTitle = currentLanguage === "pl" ? polishTitle : title;
	const displayDescription =
		currentLanguage === "pl" ? polishDescription : description;

	return onClick ? (
		<button
			onClick={handleClick}
			onFocus={handleFocus}
			onBlur={onBlur}
			aria-label={displayTitle}
			aria-describedby={displayDescription ? "card-description" : undefined}
			className={`w-full rounded-lg text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${selected ? "ring-2 ring-blue-500" : ""}cursor-pointer hover:bg-gray-50 `}
		>
			{(title || polishTitle) && (
				<h3 className="mb-2 font-semibold text-lg">{displayTitle}</h3>
			)}

			{(description || polishDescription) && (
				<div id="card-description" className="mb-4 text-gray-600">
					{displayDescription}
				</div>
			)}

			{children}
		</button>
	) : (
		<div
			role="region"
			aria-label={displayTitle}
			aria-describedby={displayDescription ? "card-description" : undefined}
			className="rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
		>
			{(title || polishTitle) && (
				<h3 className="mb-2 font-semibold text-lg">{displayTitle}</h3>
			)}

			{(description || polishDescription) && (
				<div id="card-description" className="mb-4 text-gray-600">
					{displayDescription}
				</div>
			)}

			{children}
		</div>
	);
};

// Navigation announcer for route changes
export const NavigationAnnouncer: React.FC = () => {
	const { announce } = useScreenReader();

	useEffect(() => {
		const handleRouteChange = (url: string) => {
			// Extract page name from URL
			const pageName = url.split("/").pop() || "home";
			announce(`Nawigacja do strony: ${pageName}`, "assertive");
		};

		// Listen for route changes (this would need to be adapted for Next.js App Router)
		// For now, we'll listen for popstate events
		const handlePopState = () => {
			handleRouteChange(window.location.pathname);
		};

		window.addEventListener("popstate", handlePopState);

		return () => {
			window.removeEventListener("popstate", handlePopState);
		};
	}, [announce]);

	return null;
};

// Live region for dynamic content updates
export const LiveRegionPolite: React.FC<{
	children: React.ReactNode;
}> = ({ children }) => {
	return (
		<div aria-live="polite" aria-atomic="true" className="sr-only">
			{children}
		</div>
	);
};

export const LiveRegionAssertive: React.FC<{
	children: React.ReactNode;
}> = ({ children }) => {
	return (
		<div aria-live="assertive" aria-atomic="true" className="sr-only">
			{children}
		</div>
	);
};

// Legacy alias for backward compatibility
export const LiveRegion: React.FC<{
	children: React.ReactNode;
	priority?: "polite" | "assertive";
	atomic?: boolean;
}> = ({ children, priority = "polite", atomic = true }) => {
	const Component =
		priority === "polite" ? LiveRegionPolite : LiveRegionAssertive;
	return <Component>{children}</Component>;
};

// Progress announcer for loading states
export const ProgressAnnouncer: React.FC<{
	isLoading: boolean;
	loadingMessage?: string;
	polishLoadingMessage?: string;
	completionMessage?: string;
	polishCompletionMessage?: string;
}> = ({
	isLoading,
	loadingMessage = "Loading",
	polishLoadingMessage = "Ładowanie",
	completionMessage = "Loading complete",
	polishCompletionMessage = "Ładowanie zakończone",
}) => {
	const { announce, currentLanguage } = useScreenReader();

	useEffect(() => {
		if (isLoading) {
			const message =
				currentLanguage === "pl" ? polishLoadingMessage : loadingMessage;
			announce(message, "polite");
		} else {
			const message =
				currentLanguage === "pl" ? polishCompletionMessage : completionMessage;
			announce(message, "polite");
		}
	}, [
		isLoading,
		announce,
		currentLanguage,
		loadingMessage,
		polishLoadingMessage,
		completionMessage,
		polishCompletionMessage,
	]);

	return (
		<LiveRegion priority="polite">
			{isLoading
				? currentLanguage === "pl"
					? polishLoadingMessage
					: loadingMessage
				: currentLanguage === "pl"
					? polishCompletionMessage
					: completionMessage}
		</LiveRegion>
	);
};

// Error announcer for error states
export const ErrorAnnouncer: React.FC<{
	error?: string;
	polishError?: string;
	hasError: boolean;
}> = ({ error, polishError, hasError }) => {
	const { announce, currentLanguage } = useScreenReader();

	useEffect(() => {
		if (hasError && (error || polishError)) {
			const message = currentLanguage === "pl" ? polishError : error;
			announce(`Error: ${message}`, "assertive");
		}
	}, [hasError, error, polishError, announce, currentLanguage]);

	if (!hasError) return null;

	return (
		<LiveRegion priority="assertive">
			{currentLanguage === "pl" ? polishError : error}
		</LiveRegion>
	);
};

// Table announcer for data tables
export const TableAnnouncer: React.FC<{
	tableId: string;
	caption?: string;
	polishCaption?: string;
	rowCount: number;
	columnCount: number;
}> = ({ tableId, caption, polishCaption, rowCount, columnCount }) => {
	const { announce, currentLanguage } = useScreenReader();

	useEffect(() => {
		const tableCaption = currentLanguage === "pl" ? polishCaption : caption;
		const summary = `Table with ${rowCount} rows and ${columnCount} columns${tableCaption ? `: ${tableCaption}` : ""}`;
		announce(summary, "polite");
	}, [
		tableId,
		caption,
		polishCaption,
		rowCount,
		columnCount,
		announce,
		currentLanguage,
	]);

	return (
		<ScreenReaderOnly>
			{currentLanguage === "pl" ? polishCaption : caption}
		</ScreenReaderOnly>
	);
};

// Form announcer for form interactions
export const FormAnnouncer: React.FC<{
	formId: string;
	isSubmitting?: boolean;
	hasErrors?: boolean;
	errorCount?: number;
}> = ({ formId, isSubmitting = false, hasErrors = false, errorCount = 0 }) => {
	const { announce, currentLanguage } = useScreenReader();

	useEffect(() => {
		if (isSubmitting) {
			announce(
				currentLanguage === "pl"
					? "Formularz jest przetwarzany"
					: "Form is being submitted",
				"polite",
			);
		}
	}, [isSubmitting, announce, currentLanguage]);

	useEffect(() => {
		if (hasErrors && errorCount > 0) {
			announce(
				currentLanguage === "pl"
					? `Formularz zawiera ${errorCount} błędów`
					: `Form contains ${errorCount} errors`,
				"assertive",
			);
		}
	}, [hasErrors, errorCount, announce, currentLanguage]);

	return null;
};

// Landmark announcer for page structure
export const LandmarkAnnouncer: React.FC<{
	landmarks: Array<{
		role: string;
		label: string;
		polishLabel: string;
	}>;
}> = ({ landmarks }) => {
	const { announce, currentLanguage } = useScreenReader();

	useEffect(() => {
		const landmarkList = landmarks
			.map((landmark) =>
				currentLanguage === "pl" ? landmark.polishLabel : landmark.label,
			)
			.join(", ");

		announce(
			currentLanguage === "pl"
				? `Strona zawiera następujące obszary: ${landmarkList}`
				: `Page contains the following landmarks: ${landmarkList}`,
			"polite",
		);
	}, [landmarks, announce, currentLanguage]);

	return null;
};

// Skip link component for keyboard navigation
export const SkipLinks: React.FC = () => {
	const { announce, currentLanguage } = useScreenReader();

	const handleSkipToMain = () => {
		const mainContent = document.querySelector('main, [role="main"]');
		if (mainContent) {
			(mainContent as HTMLElement).focus();
			announce(
				currentLanguage === "pl"
					? "Przeskoczono do głównej treści"
					: "Skipped to main content",
				"assertive",
			);
		}
	};

	const handleSkipToNavigation = () => {
		const navigation = document.querySelector('nav, [role="navigation"]');
		if (navigation) {
			(navigation as HTMLElement).focus();
			announce(
				currentLanguage === "pl"
					? "Przeskoczono do nawigacji"
					: "Skipped to navigation",
				"assertive",
			);
		}
	};

	return (
		<div className="skip-links">
			<a
				href="#main-content"
				onClick={handleSkipToMain}
				className="sr-only z-50 rounded bg-blue-600 px-4 py-2 text-white focus:not-sr-only focus:absolute focus:top-4 focus:left-4"
			>
				{currentLanguage === "pl"
					? "Przejdź do treści głównej"
					: "Skip to main content"}
			</a>
			<a
				href="#navigation"
				onClick={handleSkipToNavigation}
				className="sr-only z-50 rounded bg-blue-600 px-4 py-2 text-white focus:not-sr-only focus:absolute focus:top-4 focus:left-4"
			>
				{currentLanguage === "pl"
					? "Przejdź do nawigacji"
					: "Skip to navigation"}
			</a>
		</div>
	);
};

// Instructions announcer for complex interactions
export const InstructionsAnnouncer: React.FC<{
	instructions: string;
	polishInstructions: string;
	trigger?: "focus" | "hover" | "click";
}> = ({ instructions, polishInstructions, trigger = "focus" }) => {
	const { announce, currentLanguage } = useScreenReader();
	const [hasAnnounced, setHasAnnounced] = useState(false);

	const handleTrigger = () => {
		if (!hasAnnounced) {
			const message =
				currentLanguage === "pl" ? polishInstructions : instructions;
			announce(message, "polite");
			setHasAnnounced(true);
		}
	};

	useEffect(() => {
		setHasAnnounced(false);
	}, [currentLanguage]);

	return (
		<div
			onFocus={trigger === "focus" ? handleTrigger : undefined}
			onMouseEnter={trigger === "hover" ? handleTrigger : undefined}
			onClick={trigger === "click" ? handleTrigger : undefined}
		>
			<ScreenReaderOnly>
				{currentLanguage === "pl" ? polishInstructions : instructions}
			</ScreenReaderOnly>
		</div>
	);
};

// Status announcer for dynamic status updates
export const StatusAnnouncer: React.FC<{
	status: string;
	polishStatus: string;
	previousStatus?: string;
	previousPolishStatus?: string;
}> = ({ status, polishStatus, previousStatus, previousPolishStatus }) => {
	const { announce, currentLanguage } = useScreenReader();

	useEffect(() => {
		if (status !== previousStatus) {
			const message = currentLanguage === "pl" ? polishStatus : status;
			announce(`Status updated: ${message}`, "polite");
		}
	}, [
		status,
		polishStatus,
		previousStatus,
		previousPolishStatus,
		announce,
		currentLanguage,
	]);

	return (
		<LiveRegion>{currentLanguage === "pl" ? polishStatus : status}</LiveRegion>
	);
};

// Help announcer for contextual help
export const HelpAnnouncer: React.FC<{
	helpText: string;
	polishHelpText: string;
	shortcut?: string;
}> = ({ helpText, polishHelpText, shortcut }) => {
	const { announce, currentLanguage } = useScreenReader();

	const showHelp = () => {
		const message = currentLanguage === "pl" ? polishHelpText : helpText;
		const fullMessage = shortcut
			? `${message} ${currentLanguage === "pl" ? "Skrót:" : "Shortcut:"} ${shortcut}`
			: message;

		announce(fullMessage, "polite");
	};

	return (
		<button
			onClick={showHelp}
			aria-label={currentLanguage === "pl" ? "Pokaż pomoc" : "Show help"}
			className="help-button"
		>
			<ScreenReaderOnly>
				{currentLanguage === "pl"
					? "Kliknij aby uzyskać pomoc"
					: "Click for help"}
			</ScreenReaderOnly>
			<VisualOnly>?</VisualOnly>
		</button>
	);
};

// Announcement history for debugging
export const AnnouncementHistory: React.FC = () => {
	const [history, setHistory] = useState<string[]>([]);
	const { announce } = useScreenReader();

	useEffect(() => {
		const originalAnnounce = announce;
		const announceWithHistory = (message: string) => {
			setHistory((prev) => [
				...prev.slice(-9),
				`${new Date().toLocaleTimeString()}: ${message}`,
			]);
			originalAnnounce(message);
		};

		// Replace the announce function in the context
		// This is a simplified version - in practice, you'd need to modify the context
	}, []);

	if (process.env.NODE_ENV !== "development") return null;

	return (
		<div className="fixed right-4 bottom-4 max-h-64 max-w-sm overflow-auto rounded bg-black p-4 text-white">
			<h4 className="mb-2 font-bold">Announcement History</h4>
			{history.map((announcement, index) => (
				<div key={index} className="mb-1 text-xs">
					{announcement}
				</div>
			))}
		</div>
	);
};

// Export utility functions
export const screenReaderUtils = {
	// Check if screen reader is active
	isScreenReaderActive: (): boolean => {
		if (typeof window === "undefined") return false;

		const userAgent = navigator.userAgent;
		return /NVDA|JAWS|VoiceOver|TalkBack|Narrator/i.test(userAgent);
	},

	// Get preferred language for screen reader
	getScreenReaderLanguage: (): "pl" | "en" => {
		if (typeof navigator === "undefined") return "pl";

		const languages = navigator.languages || [navigator.language];
		const polishLanguages = ["pl", "pl-PL"];

		return polishLanguages.some((lang) =>
			languages.some((userLang) => userLang.toLowerCase().startsWith(lang)),
		)
			? "pl"
			: "en";
	},

	// Announce to screen reader immediately
	announceImmediately: (
		message: string,
		language: "pl" | "en" = "pl",
	): void => {
		if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

		try {
			const utterance = new SpeechSynthesisUtterance(message);
			utterance.lang = language === "pl" ? "pl-PL" : "en-US";
			utterance.rate = 0.8;

			if (window.speechSynthesis.speaking) {
				window.speechSynthesis.cancel();
			}

			window.speechSynthesis.speak(utterance);
		} catch (error) {
			console.error("Immediate announcement failed:", error);
		}
	},
};
