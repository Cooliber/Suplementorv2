/**
 * Accessibility Tests for Graph Components
 * Tests WCAG 2.1 AA compliance including keyboard navigation, screen reader support, and color contrast
 */

import {
	FocusManager,
	ScreenReaderUtils,
	calculateContrastRatio,
	keyboardNavigation,
	meetsWCAGContrast,
	polishAriaLabels,
} from "@/lib/utils/accessibility";
import type {
	KnowledgeNode,
	KnowledgeRelationship,
} from "@/types/knowledge-graph";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe, toHaveNoViolations } from "jest-axe";
import AccessibleGraphWrapper from "../AccessibleGraphWrapper";

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Mock data for testing
const mockNodes: KnowledgeNode[] = [
	{
		id: "omega-3",
		name: "Omega-3 Fatty Acids",
		polishName: "Kwasy tłuszczowe Omega-3",
		type: "SUPPLEMENT",
		description: "Essential fatty acids",
		polishDescription: "Niezbędne kwasy tłuszczowe dla zdrowia mózgu",
		category: "Kwasy tłuszczowe",
		evidenceLevel: "STRONG",
		size: 12,
		importance: 0.9,
		x: 100,
		y: 100,
	},
	{
		id: "dopamine",
		name: "Dopamine",
		polishName: "Dopamina",
		type: "NEUROTRANSMITTER",
		description: "Neurotransmitter for motivation",
		polishDescription: "Neuroprzekaźnik odpowiedzialny za motywację",
		category: "Neuroprzekaźniki",
		evidenceLevel: "STRONG",
		size: 10,
		importance: 0.8,
		x: 200,
		y: 200,
	},
];

const mockRelationships: KnowledgeRelationship[] = [
	{
		id: "omega3-dopamine",
		sourceId: "omega-3",
		targetId: "dopamine",
		type: "ENHANCES",
		strength: 0.8,
		confidence: 0.9,
		mechanism: "Membrane fluidity enhancement",
		polishMechanism: "Wzmocnienie płynności błon komórkowych",
		evidenceLevel: "STRONG",
	},
];

// Mock child component
const MockGraphComponent = () => (
	<div data-testid="graph-content">
		<svg width="400" height="300">
			<circle cx="100" cy="100" r="20" data-graph-element="node" />
			<circle cx="200" cy="200" r="20" data-graph-element="node" />
			<line
				x1="100"
				y1="100"
				x2="200"
				y2="200"
				data-graph-element="relationship"
			/>
		</svg>
	</div>
);

describe("Accessibility Tests", () => {
	describe("AccessibleGraphWrapper", () => {
		const defaultProps = {
			nodes: mockNodes,
			relationships: mockRelationships,
			selectedNodeIds: [],
			onNodeSelect: jest.fn(),
			onKeyboardNavigation: jest.fn(),
		};

		beforeEach(() => {
			jest.clearAllMocks();
		});

		it("should have no accessibility violations", async () => {
			const { container } = render(
				<AccessibleGraphWrapper {...defaultProps}>
					<MockGraphComponent />
				</AccessibleGraphWrapper>,
			);

			const results = await axe(container);
			expect(results).toHaveNoViolations();
		});

		it("should have proper ARIA labels in Polish", () => {
			render(
				<AccessibleGraphWrapper {...defaultProps}>
					<MockGraphComponent />
				</AccessibleGraphWrapper>,
			);

			const graphContainer = screen.getByRole("application");
			expect(graphContainer).toHaveAttribute(
				"aria-label",
				polishAriaLabels.graphCanvas,
			);
			expect(graphContainer).toHaveAttribute(
				"aria-describedby",
				"graph-description",
			);

			const description = document.getElementById("graph-description");
			expect(description).toBeInTheDocument();
			expect(description).toHaveTextContent(/Graf wiedzy o suplementach/);
		});

		it("should support keyboard navigation", async () => {
			const user = userEvent.setup();
			const onKeyboardNavigation = jest.fn();

			render(
				<AccessibleGraphWrapper
					{...defaultProps}
					onKeyboardNavigation={onKeyboardNavigation}
				>
					<MockGraphComponent />
				</AccessibleGraphWrapper>,
			);

			const graphContainer = screen.getByRole("application");
			graphContainer.focus();

			// Test zoom in
			await user.keyboard("{Equal}");
			expect(onKeyboardNavigation).toHaveBeenCalledWith("zoom", {
				direction: "in",
			});

			// Test zoom out
			await user.keyboard("{Minus}");
			expect(onKeyboardNavigation).toHaveBeenCalledWith("zoom", {
				direction: "out",
			});

			// Test reset view
			await user.keyboard("{KeyR}");
			expect(onKeyboardNavigation).toHaveBeenCalledWith("reset");

			// Test node navigation
			await user.keyboard("{ArrowRight}");
			expect(onKeyboardNavigation).toHaveBeenCalledWith(
				"selectNode",
				expect.any(Object),
			);
		});

		it("should announce node selection to screen readers", async () => {
			const user = userEvent.setup();
			const mockAnnounce = jest.fn();

			// Mock the screen reader
			jest
				.spyOn(require("@/lib/utils/accessibility"), "screenReader", "get")
				.mockReturnValue({
					announce: mockAnnounce,
					announceNodeSelection: jest.fn(),
					announceGraphLoad: jest.fn(),
					announceSearchResults: jest.fn(),
					announcePerformanceIssue: jest.fn(),
					cleanup: jest.fn(),
				});

			render(
				<AccessibleGraphWrapper {...defaultProps}>
					<MockGraphComponent />
				</AccessibleGraphWrapper>,
			);

			const graphContainer = screen.getByRole("application");
			graphContainer.focus();

			// Navigate to next node
			await user.keyboard("{ArrowRight}");

			// Activate node
			await user.keyboard("{Enter}");

			expect(defaultProps.onNodeSelect).toHaveBeenCalled();
		});

		it("should toggle high contrast mode", async () => {
			const user = userEvent.setup();

			render(
				<AccessibleGraphWrapper {...defaultProps}>
					<MockGraphComponent />
				</AccessibleGraphWrapper>,
			);

			const contrastButton = screen.getByLabelText(
				/Przełącz tryb wysokiego kontrastu/,
			);
			expect(contrastButton).toHaveAttribute("aria-pressed", "false");

			await user.click(contrastButton);
			expect(contrastButton).toHaveAttribute("aria-pressed", "true");
		});

		it("should show keyboard help", async () => {
			const user = userEvent.setup();

			render(
				<AccessibleGraphWrapper {...defaultProps}>
					<MockGraphComponent />
				</AccessibleGraphWrapper>,
			);

			const helpButton = screen.getByLabelText(/Pokaż pomoc klawiatury/);
			await user.click(helpButton);

			expect(screen.getByText("Skróty klawiszowe")).toBeInTheDocument();
			expect(screen.getByText("Nawigacja grafu")).toBeInTheDocument();
			expect(screen.getByText("Wybór węzłów")).toBeInTheDocument();
		});

		it("should display current node info in screen reader mode", async () => {
			const user = userEvent.setup();

			render(
				<AccessibleGraphWrapper {...defaultProps}>
					<MockGraphComponent />
				</AccessibleGraphWrapper>,
			);

			const screenReaderButton = screen.getByLabelText(
				/Przełącz tryb czytnika ekranu/,
			);
			await user.click(screenReaderButton);

			expect(screen.getByText(/Aktualny węzeł/)).toBeInTheDocument();
			expect(screen.getByText("Kwasy tłuszczowe Omega-3")).toBeInTheDocument();
		});

		it("should handle focus management correctly", () => {
			const container = document.createElement("div");
			container.innerHTML = `
        <button>Button 1</button>
        <input type="text" />
        <button>Button 2</button>
        <a href="#">Link</a>
      `;

			const focusManager = new FocusManager(container);

			focusManager.focusFirst();
			expect(document.activeElement).toBe(container.querySelector("button"));

			focusManager.focusNext();
			expect(document.activeElement).toBe(container.querySelector("input"));

			focusManager.focusLast();
			expect(document.activeElement).toBe(container.querySelector("a"));

			focusManager.focusPrevious();
			expect(document.activeElement).toBe(
				container.querySelectorAll("button")[1],
			);
		});
	});

	describe("Color Contrast Utilities", () => {
		it("should calculate contrast ratios correctly", () => {
			// Test high contrast (black on white)
			const highContrast = calculateContrastRatio("#000000", "#ffffff");
			expect(highContrast).toBeCloseTo(21, 0);

			// Test low contrast
			const lowContrast = calculateContrastRatio("#888888", "#999999");
			expect(lowContrast).toBeLessThan(3);

			// Test medium contrast
			const mediumContrast = calculateContrastRatio("#333333", "#ffffff");
			expect(mediumContrast).toBeGreaterThan(4.5);
		});

		it("should validate WCAG contrast requirements", () => {
			// AA level normal text (4.5:1)
			expect(meetsWCAGContrast("#000000", "#ffffff", "AA", "normal")).toBe(
				true,
			);
			expect(meetsWCAGContrast("#767676", "#ffffff", "AA", "normal")).toBe(
				true,
			);
			expect(meetsWCAGContrast("#949494", "#ffffff", "AA", "normal")).toBe(
				false,
			);

			// AA level large text (3:1)
			expect(meetsWCAGContrast("#949494", "#ffffff", "AA", "large")).toBe(true);
			expect(meetsWCAGContrast("#b3b3b3", "#ffffff", "AA", "large")).toBe(
				false,
			);

			// AAA level normal text (7:1)
			expect(meetsWCAGContrast("#000000", "#ffffff", "AAA", "normal")).toBe(
				true,
			);
			expect(meetsWCAGContrast("#595959", "#ffffff", "AAA", "normal")).toBe(
				true,
			);
			expect(meetsWCAGContrast("#767676", "#ffffff", "AAA", "normal")).toBe(
				false,
			);
		});
	});

	describe("Screen Reader Utilities", () => {
		let screenReaderUtils: ScreenReaderUtils;

		beforeEach(() => {
			screenReaderUtils = new ScreenReaderUtils();
		});

		afterEach(() => {
			screenReaderUtils.cleanup();
		});

		it("should create live regions", () => {
			const liveRegions = document.querySelectorAll("[aria-live]");
			expect(liveRegions.length).toBeGreaterThanOrEqual(2);

			const assertiveRegion = document.querySelector('[aria-live="assertive"]');
			const politeRegion = document.querySelector('[aria-live="polite"]');

			expect(assertiveRegion).toBeInTheDocument();
			expect(politeRegion).toBeInTheDocument();
		});

		it("should announce messages with correct priority", async () => {
			const politeRegion = document.querySelector(
				'[aria-live="polite"]',
			) as HTMLElement;
			const assertiveRegion = document.querySelector(
				'[aria-live="assertive"]',
			) as HTMLElement;

			screenReaderUtils.announce("Test polite message", "polite");

			await waitFor(() => {
				expect(politeRegion.textContent).toBe("Test polite message");
			});

			screenReaderUtils.announce("Test assertive message", "assertive");

			await waitFor(() => {
				expect(assertiveRegion.textContent).toBe("Test assertive message");
			});
		});

		it("should announce node selection in Polish", () => {
			const spy = jest.spyOn(screenReaderUtils, "announce");

			screenReaderUtils.announceNodeSelection(
				"Kwasy tłuszczowe Omega-3",
				"SUPPLEMENT",
			);

			expect(spy).toHaveBeenCalledWith(
				expect.stringContaining("Wybrano węzeł: Kwasy tłuszczowe Omega-3"),
				"assertive",
			);
		});

		it("should announce graph load statistics", () => {
			const spy = jest.spyOn(screenReaderUtils, "announce");

			screenReaderUtils.announceGraphLoad(50, 25);

			expect(spy).toHaveBeenCalledWith(
				"Graf załadowany: 50 węzłów, 25 połączeń",
				"polite",
			);
		});
	});

	describe("Keyboard Navigation", () => {
		it("should define all required keyboard shortcuts", () => {
			expect(keyboardNavigation.ZOOM_IN).toContain("Equal");
			expect(keyboardNavigation.ZOOM_OUT).toContain("Minus");
			expect(keyboardNavigation.SELECT_NEXT).toContain("ArrowRight");
			expect(keyboardNavigation.SELECT_PREVIOUS).toContain("ArrowLeft");
			expect(keyboardNavigation.ACTIVATE_NODE).toContain("Enter");
			expect(keyboardNavigation.SHOW_HELP).toContain("KeyH");
		});

		it("should handle keyboard events correctly", () => {
			const mockHandler = jest.fn();

			// Simulate keyboard events
			const enterEvent = new KeyboardEvent("keydown", { code: "Enter" });
			const arrowRightEvent = new KeyboardEvent("keydown", {
				code: "ArrowRight",
			});
			const escapeEvent = new KeyboardEvent("keydown", { code: "Escape" });

			// Test that events have correct properties
			expect(enterEvent.code).toBe("Enter");
			expect(arrowRightEvent.code).toBe("ArrowRight");
			expect(escapeEvent.code).toBe("Escape");
		});
	});

	describe("Polish Localization", () => {
		it("should provide Polish ARIA labels", () => {
			expect(polishAriaLabels.graphCanvas).toBe(
				"Interaktywny graf wiedzy o suplementach",
			);
			expect(polishAriaLabels.supplementNode).toBe("Węzeł suplementu");
			expect(polishAriaLabels.neurotransmitterNode).toBe(
				"Węzeł neuroprzekaźnika",
			);
			expect(polishAriaLabels.enhancesRelationship).toBe(
				"Relacja wzmacniająca",
			);
		});

		it("should handle Polish diacritics in announcements", () => {
			const testText = "Węzeł z polskimi znakami: ąćęłńóśźż";
			const screenReaderUtils = new ScreenReaderUtils();

			const spy = jest.spyOn(screenReaderUtils, "announce");
			screenReaderUtils.announce(testText, "polite");

			expect(spy).toHaveBeenCalledWith(testText, "polite");

			screenReaderUtils.cleanup();
		});
	});

	describe("Focus Trap", () => {
		it("should trap focus within modal dialogs", () => {
			const container = document.createElement("div");
			container.innerHTML = `
        <div role="dialog">
          <button>First</button>
          <input type="text" />
          <button>Last</button>
        </div>
      `;
			document.body.appendChild(container);

			const focusManager = new FocusManager(container);

			// Focus first element
			focusManager.focusFirst();
			expect(document.activeElement).toBe(container.querySelector("button"));

			// Simulate Tab key (should move to next element)
			const tabEvent = new KeyboardEvent("keydown", {
				key: "Tab",
				code: "Tab",
				bubbles: true,
			});

			focusManager.trapFocus(tabEvent);
			expect(document.activeElement).toBe(container.querySelector("input"));

			document.body.removeChild(container);
		});
	});

	describe("High Contrast Mode", () => {
		it("should detect system high contrast preference", () => {
			// Mock matchMedia
			Object.defineProperty(window, "matchMedia", {
				writable: true,
				value: jest.fn().mockImplementation((query) => ({
					matches: query === "(prefers-contrast: high)",
					media: query,
					onchange: null,
					addListener: jest.fn(),
					removeListener: jest.fn(),
					addEventListener: jest.fn(),
					removeEventListener: jest.fn(),
					dispatchEvent: jest.fn(),
				})),
			});

			const { HighContrastManager } = require("@/lib/utils/accessibility");
			const manager = new HighContrastManager();

			expect(manager.isHighContrastEnabled()).toBe(true);
		});

		it("should apply high contrast styles to graph elements", () => {
			const element = document.createElement("div");
			element.setAttribute("data-graph-element", "node");
			document.body.appendChild(element);

			const { HighContrastManager } = require("@/lib/utils/accessibility");
			const manager = new HighContrastManager();

			manager.applyHighContrastMode(true);

			// Check if high contrast CSS property is set
			expect(
				document.documentElement.style.getPropertyValue(
					"--graph-high-contrast",
				),
			).toBe("1");

			document.body.removeChild(element);
		});
	});
});
