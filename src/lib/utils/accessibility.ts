/**
 * Accessibility Utilities for WCAG 2.1 AA Compliance
 * Provides utilities for keyboard navigation, screen reader support, and high contrast mode
 */

// Polish ARIA labels and descriptions
export const polishAriaLabels = {
	// Graph navigation
	graphCanvas: "Interaktywny graf wiedzy o suplementach",
	graphNode: "Węzeł grafu",
	graphRelationship: "Połączenie między węzłami",
	graphZoomIn: "Powiększ graf",
	graphZoomOut: "Pomniejsz graf",
	graphReset: "Resetuj widok grafu",
	graphCenter: "Wyśrodkuj graf",

	// Node types
	supplementNode: "Węzeł suplementu",
	neurotransmitterNode: "Węzeł neuroprzekaźnika",
	brainRegionNode: "Węzeł regionu mózgu",
	cognitiveFunctionNode: "Węzeł funkcji poznawczej",
	pathwayNode: "Węzeł szlaku neuronalnego",
	mechanismNode: "Węzeł mechanizmu działania",

	// Relationship types
	enhancesRelationship: "Relacja wzmacniająca",
	modulatesRelationship: "Relacja modulująca",
	synergizesRelationship: "Relacja synergiczna",
	inhibitsRelationship: "Relacja hamująca",
	antagonizesRelationship: "Relacja antagonistyczna",

	// Controls
	sidebar: "Panel kontrolny grafu",
	legend: "Legenda grafu",
	filters: "Filtry grafu",
	search: "Wyszukiwanie w grafie",
	exportImport: "Eksport i import danych",

	// Navigation
	previousNode: "Poprzedni węzeł",
	nextNode: "Następny węzeł",
	selectNode: "Wybierz węzeł",
	deselectNode: "Odznacz węzeł",

	// Status
	loading: "Ładowanie grafu",
	error: "Błąd ładowania grafu",
	empty: "Brak danych do wyświetlenia",

	// Performance
	performanceGood: "Wydajność dobra",
	performanceWarning: "Ostrzeżenie wydajności",
	performanceCritical: "Krytyczna wydajność",
};

// Polish live region announcements
export const polishLiveRegionMessages = {
	nodeSelected: (nodeName: string) => `Wybrano węzeł: ${nodeName}`,
	nodeDeselected: (nodeName: string) => `Odznaczono węzeł: ${nodeName}`,
	nodesFiltered: (count: number) => `Przefiltrowano do ${count} węzłów`,
	graphLoaded: (nodeCount: number, relationshipCount: number) =>
		`Graf załadowany: ${nodeCount} węzłów, ${relationshipCount} połączeń`,
	exportStarted: (format: string) => `Rozpoczęto eksport w formacie ${format}`,
	exportCompleted: (format: string) =>
		`Eksport w formacie ${format} zakończony`,
	importStarted: () => "Rozpoczęto import danych",
	importCompleted: (nodeCount: number) =>
		`Import zakończony: ${nodeCount} węzłów`,
	searchResults: (count: number, term: string) =>
		`Znaleziono ${count} wyników dla "${term}"`,
	performanceIssue: (issue: string) => `Problem wydajności: ${issue}`,
	layoutChanged: (layout: string) => `Zmieniono układ na: ${layout}`,
	zoomChanged: (level: number) =>
		`Zmieniono powiększenie na ${Math.round(level * 100)}%`,
};

// Keyboard navigation constants
export const keyboardNavigation = {
	// Graph navigation
	ZOOM_IN: ["Equal", "NumpadAdd", "Plus"],
	ZOOM_OUT: ["Minus", "NumpadSubtract"],
	RESET_VIEW: ["KeyR", "Home"],
	CENTER_GRAPH: ["KeyC"],

	// Node selection
	SELECT_NEXT: ["ArrowRight", "Tab"],
	SELECT_PREVIOUS: ["ArrowLeft", "ShiftTab"],
	SELECT_UP: ["ArrowUp"],
	SELECT_DOWN: ["ArrowDown"],
	ACTIVATE_NODE: ["Enter", "Space"],
	DESELECT_ALL: ["Escape"],

	// Filters and search
	OPEN_SEARCH: ["KeyF", "Slash"],
	CLEAR_SEARCH: ["Escape"],
	OPEN_FILTERS: ["KeyG"],

	// Export/Import
	EXPORT_JSON: ["CtrlKeyE"],
	IMPORT_FILE: ["CtrlKeyI"],

	// Help
	SHOW_HELP: ["KeyH", "F1"],
};

// Focus management utilities
export class FocusManager {
	private focusableElements: HTMLElement[] = [];
	private currentIndex = -1;
	private container: HTMLElement | null = null;

	constructor(container: HTMLElement) {
		this.container = container;
		this.updateFocusableElements();
	}

	updateFocusableElements(): void {
		if (!this.container) return;

		const selector = [
			"button:not([disabled])",
			"input:not([disabled])",
			"select:not([disabled])",
			"textarea:not([disabled])",
			"a[href]",
			'[tabindex]:not([tabindex="-1"])',
			'[role="button"]:not([disabled])',
			'[role="link"]:not([disabled])',
		].join(", ");

		this.focusableElements = Array.from(
			this.container.querySelectorAll(selector),
		) as HTMLElement[];
	}

	focusFirst(): void {
		if (this.focusableElements.length > 0) {
			this.currentIndex = 0;
			this.focusableElements[0]?.focus();
		}
	}

	focusLast(): void {
		if (this.focusableElements.length > 0) {
			this.currentIndex = this.focusableElements.length - 1;
			this.focusableElements[this.currentIndex]?.focus();
		}
	}

	focusNext(): boolean {
		if (this.focusableElements.length === 0) return false;

		this.currentIndex = (this.currentIndex + 1) % this.focusableElements.length;
		this.focusableElements[this.currentIndex]?.focus();
		return true;
	}

	focusPrevious(): boolean {
		if (this.focusableElements.length === 0) return false;

		this.currentIndex =
			this.currentIndex <= 0
				? this.focusableElements.length - 1
				: this.currentIndex - 1;
		this.focusableElements[this.currentIndex]?.focus();
		return true;
	}

	getCurrentFocusedElement(): HTMLElement | null {
		return this.currentIndex >= 0
			? (this.focusableElements[this.currentIndex] ?? null)
			: null;
	}

	trapFocus(event: KeyboardEvent): void {
		if (event.key !== "Tab") return;

		event.preventDefault();

		if (event.shiftKey) {
			this.focusPrevious();
		} else {
			this.focusNext();
		}
	}
}

// Screen reader utilities
export class ScreenReaderUtils {
	private liveRegion: HTMLElement | null = null;
	private politeRegion: HTMLElement | null = null;

	constructor() {
		this.createLiveRegions();
	}

	private createLiveRegions(): void {
		// Assertive live region for important announcements
		this.liveRegion = document.createElement("div");
		this.liveRegion.setAttribute("aria-live", "assertive");
		this.liveRegion.setAttribute("aria-atomic", "true");
		this.liveRegion.setAttribute("class", "sr-only");
		this.liveRegion.style.cssText = `
      position: absolute !important;
      width: 1px !important;
      height: 1px !important;
      padding: 0 !important;
      margin: -1px !important;
      overflow: hidden !important;
      clip: rect(0, 0, 0, 0) !important;
      white-space: nowrap !important;
      border: 0 !important;
    `;
		document.body.appendChild(this.liveRegion);

		// Polite live region for less important announcements
		this.politeRegion = document.createElement("div");
		this.politeRegion.setAttribute("aria-live", "polite");
		this.politeRegion.setAttribute("aria-atomic", "true");
		this.politeRegion.setAttribute("class", "sr-only");
		this.politeRegion.style.cssText = this.liveRegion.style.cssText;
		document.body.appendChild(this.politeRegion);
	}

	announce(message: string, priority: "assertive" | "polite" = "polite"): void {
		const region =
			priority === "assertive" ? this.liveRegion : this.politeRegion;
		if (region) {
			// Clear and then set the message to ensure it's announced
			region.textContent = "";
			setTimeout(() => {
				region.textContent = message;
			}, 100);
		}
	}

	announceNodeSelection(nodeName: string, nodeType: string): void {
		const message = polishLiveRegionMessages.nodeSelected(
			`${nodeName} (${this.getPolishNodeType(nodeType)})`,
		);
		this.announce(message, "assertive");
	}

	announceSearchResults(count: number, searchTerm: string): void {
		const message = polishLiveRegionMessages.searchResults(count, searchTerm);
		this.announce(message, "polite");
	}

	announceGraphLoad(nodeCount: number, relationshipCount: number): void {
		const message = polishLiveRegionMessages.graphLoaded(
			nodeCount,
			relationshipCount,
		);
		this.announce(message, "polite");
	}

	announcePerformanceIssue(issue: string): void {
		const message = polishLiveRegionMessages.performanceIssue(issue);
		this.announce(message, "assertive");
	}

	private getPolishNodeType(nodeType: string): string {
		const typeMap: Record<string, string> = {
			SUPPLEMENT: "suplement",
			NEUROTRANSMITTER: "neuroprzekaźnik",
			BRAIN_REGION: "region mózgu",
			COGNITIVE_FUNCTION: "funkcja poznawcza",
			PATHWAY: "szlak neuronalny",
			MECHANISM: "mechanizm działania",
		};
		return typeMap[nodeType] || nodeType.toLowerCase();
	}

	cleanup(): void {
		if (this.liveRegion) {
			document.body.removeChild(this.liveRegion);
			this.liveRegion = null;
		}
		if (this.politeRegion) {
			document.body.removeChild(this.politeRegion);
			this.politeRegion = null;
		}
	}
}

// High contrast mode utilities
export class HighContrastManager {
	private isHighContrast = false;
	private originalStyles: Map<HTMLElement, string> = new Map();

	constructor() {
		this.detectSystemHighContrast();
	}

	private detectSystemHighContrast(): void {
		// Check for system high contrast mode
		if (window.matchMedia) {
			const mediaQuery = window.matchMedia("(prefers-contrast: high)");
			this.isHighContrast = mediaQuery.matches;

			mediaQuery.addEventListener("change", (e) => {
				this.isHighContrast = e.matches;
				this.applyHighContrastMode(this.isHighContrast);
			});
		}
	}

	toggleHighContrast(): void {
		this.isHighContrast = !this.isHighContrast;
		this.applyHighContrastMode(this.isHighContrast);
	}

	applyHighContrastMode(enable: boolean): void {
		const graphElements = document.querySelectorAll("[data-graph-element]");

		graphElements.forEach((element) => {
			const htmlElement = element as HTMLElement;

			if (enable) {
				// Store original styles
				this.originalStyles.set(htmlElement, htmlElement.style.cssText);

				// Apply high contrast styles
				this.applyHighContrastStyles(htmlElement);
			} else {
				// Restore original styles
				const originalStyle = this.originalStyles.get(htmlElement);
				if (originalStyle !== undefined) {
					htmlElement.style.cssText = originalStyle;
					this.originalStyles.delete(htmlElement);
				}
			}
		});

		// Update CSS custom properties for high contrast
		document.documentElement.style.setProperty(
			"--graph-high-contrast",
			enable ? "1" : "0",
		);
	}

	private applyHighContrastStyles(element: HTMLElement): void {
		const elementType = element.getAttribute("data-graph-element");

		switch (elementType) {
			case "node":
				element.style.stroke = "#000000";
				element.style.strokeWidth = "3px";
				element.style.fill = "#ffffff";
				break;
			case "relationship":
				element.style.stroke = "#000000";
				element.style.strokeWidth = "2px";
				break;
			case "text":
				element.style.fill = "#000000";
				element.style.fontSize = "14px";
				element.style.fontWeight = "bold";
				break;
			case "background":
				element.style.backgroundColor = "#ffffff";
				break;
		}
	}

	isHighContrastEnabled(): boolean {
		return this.isHighContrast;
	}
}

// Color contrast utilities
export function calculateContrastRatio(color1: string, color2: string): number {
	const getLuminance = (color: string): number => {
		// Convert hex to RGB
		const hex = color.replace("#", "");
		const r = Number.parseInt(hex.substr(0, 2), 16) / 255;
		const g = Number.parseInt(hex.substr(2, 2), 16) / 255;
		const b = Number.parseInt(hex.substr(4, 2), 16) / 255;

		// Calculate relative luminance
		const sRGB = [r, g, b].map((c) => {
			return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
		}) as [number, number, number];

		return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
	};

	const lum1 = getLuminance(color1);
	const lum2 = getLuminance(color2);
	const brightest = Math.max(lum1, lum2);
	const darkest = Math.min(lum1, lum2);

	return (brightest + 0.05) / (darkest + 0.05);
}

export function meetsWCAGContrast(
	foreground: string,
	background: string,
	level: "AA" | "AAA" = "AA",
	size: "normal" | "large" = "normal",
): boolean {
	const ratio = calculateContrastRatio(foreground, background);

	if (level === "AAA") {
		return size === "large" ? ratio >= 4.5 : ratio >= 7;
	}
	return size === "large" ? ratio >= 3 : ratio >= 4.5;
}

// Keyboard event utilities
export function isKeyboardEvent(event: Event): event is KeyboardEvent {
	return event.type.startsWith("key");
}

export function getKeyboardShortcut(event: KeyboardEvent): string {
	const modifiers = [];
	if (event.ctrlKey) modifiers.push("Ctrl");
	if (event.altKey) modifiers.push("Alt");
	if (event.shiftKey) modifiers.push("Shift");
	if (event.metaKey) modifiers.push("Meta");

	modifiers.push(event.code);
	return modifiers.join("");
}

export function matchesKeyboardShortcut(
	event: KeyboardEvent,
	shortcuts: string[],
): boolean {
	const eventShortcut = getKeyboardShortcut(event);
	return shortcuts.some((shortcut) => {
		if (
			shortcut.includes("Ctrl") ||
			shortcut.includes("Shift") ||
			shortcut.includes("Alt")
		) {
			return eventShortcut === shortcut;
		}
		return event.code === shortcut;
	});
}

// Export singleton instances
export const screenReader = new ScreenReaderUtils();
export const highContrastManager = new HighContrastManager();
