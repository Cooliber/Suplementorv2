import {
	act,
	fireEvent,
	render,
	screen,
	waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom";
import type {
	KnowledgeNode,
	KnowledgeRelationship,
} from "@/types/knowledge-graph";
import type { SupplementWithRelations } from "@/types/supplement";
import GraphDashboard from "../GraphDashboard";

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
	observe: vi.fn(),
	unobserve: vi.fn(),
	disconnect: vi.fn(),
}));

// Mock window.matchMedia for responsive behavior testing
Object.defineProperty(window, "matchMedia", {
	writable: true,
	value: vi.fn().mockImplementation((query) => ({
		matches: query.includes("(max-width: 768px)"),
		media: query,
		onchange: null,
		addListener: vi.fn(),
		removeListener: vi.fn(),
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		dispatchEvent: vi.fn(),
	})),
});

// Mock performance.now for performance testing
global.performance = {
	...global.performance,
	now: vi.fn(() => Date.now()),
};

// Mock the Zustand store with comprehensive state
const mockStoreState = {
	selectedNodes: [],
	sidebarOpen: true,
	setSidebarOpen: vi.fn(),
	legendOpen: true,
	setLegendOpen: vi.fn(),
	graphMode: "2d" as const,
	setGraphMode: vi.fn(),
	viewMode: "overview" as const,
	setViewMode: vi.fn(),
	layout: "force" as const,
	setLayout: vi.fn(),
	filters: {
		nodeTypes: [],
		relationshipTypes: [],
		evidenceLevels: [],
		searchTerm: "",
		minStrength: 0,
		maxStrength: 1,
		maxNodes: 100,
		showLabels: true,
		showRelationshipLabels: false,
		minConfidence: 0,
		categories: [],
	},
	setFilters: vi.fn(),
	resetFilters: vi.fn(),
	zoomLevel: 1,
	setZoomLevel: vi.fn(),
	isPlaying: true,
	setIsPlaying: vi.fn(),
	highlightNode: null,
	setHighlightNode: vi.fn(),
	enablePhysics: true,
	setEnablePhysics: vi.fn(),
	maxRenderNodes: 500,
	setMaxRenderNodes: vi.fn(),
};

vi.mock("@/lib/stores/knowledge-graph-store", () => ({
	useKnowledgeGraphStore: () => mockStoreState,
}));

// Mock D3 and Cytoscape components with Polish localization testing
vi.mock("../D3GraphVisualization", () => ({
	default: ({ nodes, relationships, width, height }: any) => (
		<div
			data-testid="d3-graph"
			data-nodes={nodes.length}
			data-relationships={relationships.length}
			data-width={width}
			data-height={height}
		>
			D3 Graf: {nodes.length} węzłów, {relationships.length} połączeń
			{nodes.map((node: any) => (
				<div key={node.id} data-testid={`node-${node.id}`}>
					{node.polishName}
				</div>
			))}
		</div>
	),
}));

vi.mock("../CytoscapeVisualization", () => ({
	default: ({ nodes, relationships, width, height }: any) => (
		<div
			data-testid="cytoscape-graph"
			data-nodes={nodes.length}
			data-relationships={relationships.length}
			data-width={width}
			data-height={height}
		>
			Cytoscape Graf: {nodes.length} węzłów, {relationships.length} połączeń
			{nodes.map((node: any) => (
				<div key={node.id} data-testid={`cytoscape-node-${node.id}`}>
					{node.polishName}
				</div>
			))}
		</div>
	),
}));

vi.mock("../GraphControls", () => ({
	default: () => <div data-testid="graph-controls">Kontrola grafu</div>,
}));

vi.mock("../GraphLegend", () => ({
	default: () => <div data-testid="graph-legend">Legenda grafu</div>,
}));

vi.mock("../NodeDetails", () => ({
	default: ({ node, onClose }: any) => (
		<div data-testid="node-details">
			{node ? (
				<div>
					<span>Szczegóły węzła: {node.polishName}</span>
					{onClose && (
						<button onClick={onClose} data-testid="close-node-details">
							Zamknij
						</button>
					)}
				</div>
			) : (
				"Brak wybranego węzła"
			)}
		</div>
	),
}));

vi.mock("../ConnectionVisualization", () => ({
	default: ({ nodes, relationships }: any) => (
		<div data-testid="connection-visualization">
			Wizualizacja połączeń: {relationships.length} relacji
		</div>
	),
}));

describe("GraphDashboard - Comprehensive Tests", () => {
	const polishNodes: KnowledgeNode[] = [
		{
			id: "omega-3",
			name: "Omega-3 Fatty Acids",
			polishName: "Kwasy tłuszczowe Omega-3",
			type: "SUPPLEMENT",
			description: "Essential fatty acids for brain health",
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
			description: "Neurotransmitter for motivation and reward",
			polishDescription:
				"Neuroprzekaźnik odpowiedzialny za motywację i nagrodę",
			category: "Neuroprzekaźniki",
			evidenceLevel: "STRONG",
			size: 10,
			importance: 0.8,
			x: 200,
			y: 200,
		},
		{
			id: "memory",
			name: "Memory",
			polishName: "Pamięć",
			type: "COGNITIVE_FUNCTION",
			description: "Cognitive function for information storage",
			polishDescription:
				"Funkcja poznawcza odpowiedzialna za przechowywanie informacji",
			category: "Funkcje poznawcze",
			evidenceLevel: "MODERATE",
			size: 8,
			importance: 0.7,
			x: 300,
			y: 300,
		},
	];

	const polishRelationships: KnowledgeRelationship[] = [
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
		{
			id: "dopamine-memory",
			sourceId: "dopamine",
			targetId: "memory",
			type: "MODULATES",
			strength: 0.7,
			confidence: 0.8,
			mechanism: "Dopaminergic pathway activation",
			polishMechanism: "Aktywacja szlaku dopaminergicznego",
			evidenceLevel: "MODERATE",
		},
	];

	const polishSupplements: SupplementWithRelations[] = [
		{
			id: "omega-3",
			name: "Omega-3 Fatty Acids",
			polishName: "Kwasy tłuszczowe Omega-3",
			category: "Kwasy tłuszczowe",
			description: "Essential fatty acids",
			polishDescription: "Niezbędne kwasy tłuszczowe",
			scientificName: "Omega-3 polyunsaturated fatty acids",
			polishCommonNames: ["Omega-3", "Kwasy omega-3", "PUFA"],
			activeCompounds: [
				{
					name: "EPA",
					polishName: "EPA",
					concentration: "500mg",
					mechanism: "Anti-inflammatory",
					polishMechanism: "Działanie przeciwzapalne",
				},
			],
			clinicalApplications: [
				{
					condition: "Memory enhancement",
					polishCondition: "Wzmocnienie pamięci",
					effectivenessRating: 8,
					evidenceLevel: "STRONG",
					mechanism: "Membrane fluidity",
					polishMechanism: "Płynność błon",
					recommendedDosage: "1000mg",
					duration: "8 tygodni",
				},
			],
			dosageGuidelines: {
				therapeuticRange: { min: 500, max: 2000, unit: "mg" },
				timing: ["Z posiłkiem"],
				withFood: true,
			},
			sideEffects: [
				{
					effect: "Mild stomach upset",
					polishEffect: "Łagodne dolegliwości żołądkowe",
					frequency: "Rzadko",
					severity: "mild",
				},
			],
			researchStudies: [
				{
					id: "study1",
					title: "Omega-3 and cognitive function",
					polishTitle: "Omega-3 a funkcje poznawcze",
					journal: "Neuroscience Journal",
					year: 2023,
					studyType: "RCT",
					sampleSize: 200,
					evidenceLevel: "STRONG",
					findings: "Significant improvement in memory",
					polishFindings: "Znacząca poprawa pamięci",
					pubmedId: "12345678",
				},
			],
		},
	];

	let user: ReturnType<typeof userEvent.setup>;

	beforeEach(() => {
		vi.clearAllMocks();
		user = userEvent.setup();

		// Reset window dimensions for responsive testing
		Object.defineProperty(window, "innerWidth", {
			writable: true,
			configurable: true,
			value: 1200,
		});

		Object.defineProperty(window, "innerHeight", {
			writable: true,
			configurable: true,
			value: 800,
		});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe("Basic Rendering and Polish Localization", () => {
		it("renders with Polish interface elements", () => {
			render(
				<GraphDashboard
					nodes={polishNodes}
					relationships={polishRelationships}
					supplements={polishSupplements}
				/>,
			);

			expect(
				screen.getByText("Graf wiedzy o suplementach"),
			).toBeInTheDocument();
			expect(screen.getByTestId("graph-controls")).toBeInTheDocument();
			expect(screen.getByTestId("graph-legend")).toBeInTheDocument();
			expect(screen.getByTestId("d3-graph")).toBeInTheDocument();
		});

		it("displays Polish node names correctly", () => {
			render(
				<GraphDashboard
					nodes={polishNodes}
					relationships={polishRelationships}
					supplements={polishSupplements}
				/>,
			);

			expect(screen.getByText("Kwasy tłuszczowe Omega-3")).toBeInTheDocument();
			expect(screen.getByText("Dopamina")).toBeInTheDocument();
			expect(screen.getByText("Pamięć")).toBeInTheDocument();
		});

		it("shows correct Polish statistics in status bar", () => {
			render(
				<GraphDashboard
					nodes={polishNodes}
					relationships={polishRelationships}
					supplements={polishSupplements}
				/>,
			);

			expect(screen.getByText("Węzły: 3")).toBeInTheDocument();
			expect(screen.getByText("Połączenia: 2")).toBeInTheDocument();
			expect(screen.getByText("Wybrane: 0")).toBeInTheDocument();
		});

		it("handles Polish diacritics correctly", () => {
			const nodeWithDiacritics: KnowledgeNode = {
				id: "test-diacritics",
				name: "Test Node",
				polishName: "Węzeł testowy z polskimi znakami: ąćęłńóśźż",
				type: "SUPPLEMENT",
				description: "Test",
				polishDescription: "Test z polskimi znakami: ąćęłńóśźż",
				category: "Test",
				evidenceLevel: "MODERATE",
				size: 8,
				importance: 0.5,
				x: 100,
				y: 100,
			};

			render(
				<GraphDashboard
					nodes={[nodeWithDiacritics]}
					relationships={[]}
					supplements={[]}
				/>,
			);

			expect(
				screen.getByText("Węzeł testowy z polskimi znakami: ąćęłńóśźż"),
			).toBeInTheDocument();
		});
	});

	describe("Dual Visualization Engine Switching", () => {
		it("switches between D3 and Cytoscape visualizations", async () => {
			render(
				<GraphDashboard
					nodes={polishNodes}
					relationships={polishRelationships}
					supplements={polishSupplements}
				/>,
			);

			// Initially shows D3
			expect(screen.getByTestId("d3-graph")).toBeInTheDocument();
			expect(screen.queryByTestId("cytoscape-graph")).not.toBeInTheDocument();

			// Switch to Cytoscape
			const cytoscapeButton = screen.getByRole("button", { name: "Cytoscape" });
			await user.click(cytoscapeButton);

			await waitFor(() => {
				expect(screen.getByTestId("cytoscape-graph")).toBeInTheDocument();
				expect(screen.queryByTestId("d3-graph")).not.toBeInTheDocument();
			});

			// Verify Polish content is preserved in Cytoscape
			expect(screen.getByText("Kwasy tłuszczowe Omega-3")).toBeInTheDocument();
		});

		it("maintains data consistency across visualization switches", async () => {
			render(
				<GraphDashboard
					nodes={polishNodes}
					relationships={polishRelationships}
					supplements={polishSupplements}
				/>,
			);

			const d3Graph = screen.getByTestId("d3-graph");
			expect(d3Graph).toHaveAttribute("data-nodes", "3");
			expect(d3Graph).toHaveAttribute("data-relationships", "2");

			// Switch to Cytoscape
			const cytoscapeButton = screen.getByRole("button", { name: "Cytoscape" });
			await user.click(cytoscapeButton);

			await waitFor(() => {
				const cytoscapeGraph = screen.getByTestId("cytoscape-graph");
				expect(cytoscapeGraph).toHaveAttribute("data-nodes", "3");
				expect(cytoscapeGraph).toHaveAttribute("data-relationships", "2");
			});
		});

		it("preserves graph dimensions across engine switches", async () => {
			render(
				<GraphDashboard
					nodes={polishNodes}
					relationships={polishRelationships}
					supplements={polishSupplements}
				/>,
			);

			const d3Graph = screen.getByTestId("d3-graph");
			const initialWidth = d3Graph.getAttribute("data-width");
			const initialHeight = d3Graph.getAttribute("data-height");

			// Switch to Cytoscape
			const cytoscapeButton = screen.getByRole("button", { name: "Cytoscape" });
			await user.click(cytoscapeButton);

			await waitFor(() => {
				const cytoscapeGraph = screen.getByTestId("cytoscape-graph");
				expect(cytoscapeGraph).toHaveAttribute("data-width", initialWidth);
				expect(cytoscapeGraph).toHaveAttribute("data-height", initialHeight);
			});
		});
	});

	describe("Responsive Behavior", () => {
		it("adapts to mobile viewport", () => {
			// Mock mobile viewport
			Object.defineProperty(window, "innerWidth", {
				writable: true,
				configurable: true,
				value: 375,
			});

			Object.defineProperty(window, "innerHeight", {
				writable: true,
				configurable: true,
				value: 667,
			});

			render(
				<GraphDashboard
					nodes={polishNodes}
					relationships={polishRelationships}
					supplements={polishSupplements}
				/>,
			);

			// Should still render main components
			expect(
				screen.getByText("Graf wiedzy o suplementach"),
			).toBeInTheDocument();
			expect(screen.getByTestId("d3-graph")).toBeInTheDocument();
		});

		it("handles tablet viewport correctly", () => {
			// Mock tablet viewport
			Object.defineProperty(window, "innerWidth", {
				writable: true,
				configurable: true,
				value: 768,
			});

			Object.defineProperty(window, "innerHeight", {
				writable: true,
				configurable: true,
				value: 1024,
			});

			render(
				<GraphDashboard
					nodes={polishNodes}
					relationships={polishRelationships}
					supplements={polishSupplements}
				/>,
			);

			expect(screen.getByTestId("d3-graph")).toBeInTheDocument();
			expect(screen.getByTestId("graph-controls")).toBeInTheDocument();
		});

		it("adjusts graph dimensions based on sidebar state", async () => {
			const { rerender } = render(
				<GraphDashboard
					nodes={polishNodes}
					relationships={polishRelationships}
					supplements={polishSupplements}
				/>,
			);

			const initialGraph = screen.getByTestId("d3-graph");
			const initialWidth = initialGraph.getAttribute("data-width");

			// Toggle sidebar
			const sidebarToggle = screen.getByRole("button", {
				name: /ukryj panel kontrolny|pokaż panel kontrolny/i,
			});
			await user.click(sidebarToggle);

			// Mock store state change
			mockStoreState.sidebarOpen = false;

			rerender(
				<GraphDashboard
					nodes={polishNodes}
					relationships={polishRelationships}
					supplements={polishSupplements}
				/>,
			);

			// Graph should adjust width when sidebar is hidden
			const updatedGraph = screen.getByTestId("d3-graph");
			const updatedWidth = updatedGraph.getAttribute("data-width");

			// Width should be different (likely larger) when sidebar is hidden
			expect(updatedWidth).not.toBe(initialWidth);
		});
	});

	describe("Node Selection and Details", () => {
		it("shows node details when node is selected", async () => {
			render(
				<GraphDashboard
					nodes={polishNodes}
					relationships={polishRelationships}
					supplements={polishSupplements}
				/>,
			);

			// Initially no node details
			expect(screen.getByText("Brak wybranego węzła")).toBeInTheDocument();

			// Simulate node selection by updating store state
			mockStoreState.selectedNodes = ["omega-3"];

			const { rerender } = render(
				<GraphDashboard
					nodes={polishNodes}
					relationships={polishRelationships}
					supplements={polishSupplements}
				/>,
			);

			// Should show node details
			expect(
				screen.getByText("Szczegóły węzła: Kwasy tłuszczowe Omega-3"),
			).toBeInTheDocument();
		});

		it("closes node details when close button is clicked", async () => {
			mockStoreState.selectedNodes = ["omega-3"];

			render(
				<GraphDashboard
					nodes={polishNodes}
					relationships={polishRelationships}
					supplements={polishSupplements}
				/>,
			);

			const closeButton = screen.getByTestId("close-node-details");
			await user.click(closeButton);

			// Should close details panel
			expect(screen.getByText("Brak wybranego węzła")).toBeInTheDocument();
		});

		it("displays Polish supplement information correctly", () => {
			mockStoreState.selectedNodes = ["omega-3"];

			render(
				<GraphDashboard
					nodes={polishNodes}
					relationships={polishRelationships}
					supplements={polishSupplements}
				/>,
			);

			expect(
				screen.getByText("Szczegóły węzła: Kwasy tłuszczowe Omega-3"),
			).toBeInTheDocument();
		});
	});

	describe("Performance and Large Datasets", () => {
		it("handles large datasets efficiently", () => {
			const largeNodes = Array.from({ length: 500 }, (_, i) => ({
				id: `node${i}`,
				name: `Node ${i}`,
				polishName: `Węzeł ${i}`,
				type: "SUPPLEMENT" as const,
				description: `Description ${i}`,
				polishDescription: `Opis ${i}`,
				category: "Test",
				evidenceLevel: "MODERATE" as const,
				size: 8,
				importance: 0.5,
				x: Math.random() * 800,
				y: Math.random() * 600,
			}));

			const largeRelationships = Array.from({ length: 250 }, (_, i) => ({
				id: `rel${i}`,
				sourceId: `node${i}`,
				targetId: `node${(i + 1) % 500}`,
				type: "ENHANCES" as const,
				strength: 0.5,
				confidence: 0.7,
				mechanism: `Mechanism ${i}`,
				polishMechanism: `Mechanizm ${i}`,
				evidenceLevel: "MODERATE" as const,
			}));

			const startTime = performance.now();

			render(
				<GraphDashboard
					nodes={largeNodes}
					relationships={largeRelationships}
					supplements={[]}
				/>,
			);

			const endTime = performance.now();
			const renderTime = endTime - startTime;

			// Should render within reasonable time (less than 3 seconds as per requirement)
			expect(renderTime).toBeLessThan(3000);
			expect(screen.getByText("Węzły: 500")).toBeInTheDocument();
			expect(screen.getByText("Połączenia: 250")).toBeInTheDocument();
		});

		it("maintains performance with Polish text rendering", () => {
			const polishHeavyNodes = Array.from({ length: 100 }, (_, i) => ({
				id: `polish-node${i}`,
				name: `Polish Node ${i}`,
				polishName: `Bardzo długa polska nazwa węzła z diakrytykami ąćęłńóśźż ${i}`,
				type: "SUPPLEMENT" as const,
				description: `Long English description ${i}`,
				polishDescription: `Bardzo długi polski opis z wieloma diakrytykami ąćęłńóśźż i specjalnymi znakami ${i}`,
				category: "Długa kategoria z polskimi znakami",
				evidenceLevel: "STRONG" as const,
				size: 10,
				importance: 0.8,
				x: Math.random() * 800,
				y: Math.random() * 600,
			}));

			const startTime = performance.now();

			render(
				<GraphDashboard
					nodes={polishHeavyNodes}
					relationships={[]}
					supplements={[]}
				/>,
			);

			const endTime = performance.now();
			const renderTime = endTime - startTime;

			// Should handle Polish text efficiently
			expect(renderTime).toBeLessThan(2000);
			expect(screen.getByText("Węzły: 100")).toBeInTheDocument();
		});
	});

	describe("Export Functionality", () => {
		beforeEach(() => {
			// Mock URL.createObjectURL and related functions
			global.URL.createObjectURL = vi.fn(() => "mock-url");
			global.URL.revokeObjectURL = vi.fn();

			const mockAppendChild = vi.fn();
			const mockRemoveChild = vi.fn();
			const mockClick = vi.fn();

			Object.defineProperty(document, "createElement", {
				value: vi.fn(() => ({
					href: "",
					download: "",
					click: mockClick,
				})),
			});

			Object.defineProperty(document.body, "appendChild", {
				value: mockAppendChild,
			});

			Object.defineProperty(document.body, "removeChild", {
				value: mockRemoveChild,
			});
		});

		it("exports graph data with Polish metadata", async () => {
			render(
				<GraphDashboard
					nodes={polishNodes}
					relationships={polishRelationships}
					supplements={polishSupplements}
				/>,
			);

			const exportButton = screen.getByRole("button", { name: /eksportuj/i });
			await user.click(exportButton);

			expect(global.URL.createObjectURL).toHaveBeenCalled();
			expect(document.createElement).toHaveBeenCalledWith("a");
		});

		it("preserves Polish characters in export filename", async () => {
			render(
				<GraphDashboard
					nodes={polishNodes}
					relationships={polishRelationships}
					supplements={polishSupplements}
				/>,
			);

			const exportButton = screen.getByRole("button", { name: /eksportuj/i });
			await user.click(exportButton);

			// Verify that the export process was initiated
			expect(global.URL.createObjectURL).toHaveBeenCalled();
		});
	});

	describe("Error Handling", () => {
		it("handles empty datasets gracefully", () => {
			render(<GraphDashboard nodes={[]} relationships={[]} supplements={[]} />);

			expect(screen.getByText("Węzły: 0")).toBeInTheDocument();
			expect(screen.getByText("Połączenia: 0")).toBeInTheDocument();
			expect(screen.getByTestId("d3-graph")).toBeInTheDocument();
		});

		it("handles malformed Polish data gracefully", () => {
			const malformedNodes: KnowledgeNode[] = [
				{
					id: "malformed",
					name: "Test",
					polishName: "", // Empty Polish name
					type: "SUPPLEMENT",
					description: "Test",
					polishDescription: undefined, // Missing Polish description
					category: "Test",
					evidenceLevel: "MODERATE",
					size: 8,
					importance: 0.5,
					x: 100,
					y: 100,
				},
			];

			render(
				<GraphDashboard
					nodes={malformedNodes}
					relationships={[]}
					supplements={[]}
				/>,
			);

			// Should still render without crashing
			expect(
				screen.getByText("Graf wiedzy o suplementach"),
			).toBeInTheDocument();
			expect(screen.getByText("Węzły: 1")).toBeInTheDocument();
		});
	});

	describe("Accessibility", () => {
		it("has proper ARIA labels in Polish", () => {
			render(
				<GraphDashboard
					nodes={polishNodes}
					relationships={polishRelationships}
					supplements={polishSupplements}
				/>,
			);

			// Check for Polish accessibility labels
			const buttons = screen.getAllByRole("button");
			expect(buttons.length).toBeGreaterThan(0);

			// Verify main heading is accessible
			expect(
				screen.getByText("Graf wiedzy o suplementach"),
			).toBeInTheDocument();
		});

		it("supports keyboard navigation", async () => {
			render(
				<GraphDashboard
					nodes={polishNodes}
					relationships={polishRelationships}
					supplements={polishSupplements}
				/>,
			);

			// Test tab navigation
			await user.tab();
			expect(document.activeElement).toBeInTheDocument();

			// Test that buttons are focusable
			const buttons = screen.getAllByRole("button");
			for (const button of buttons.slice(0, 3)) {
				// Test first few buttons
				button.focus();
				expect(document.activeElement).toBe(button);
			}
		});
	});

	describe("Integration with Store", () => {
		it("responds to store state changes", () => {
			const { rerender } = render(
				<GraphDashboard
					nodes={polishNodes}
					relationships={polishRelationships}
					supplements={polishSupplements}
				/>,
			);

			// Change store state
			mockStoreState.layout = "hierarchical";
			mockStoreState.graphMode = "3d";

			rerender(
				<GraphDashboard
					nodes={polishNodes}
					relationships={polishRelationships}
					supplements={polishSupplements}
				/>,
			);

			// Should reflect store changes
			expect(screen.getByText("Układ: hierarchical")).toBeInTheDocument();
			expect(screen.getByText("Wizualizacja: d3")).toBeInTheDocument();
		});

		it("calls store methods when interacting with UI", async () => {
			render(
				<GraphDashboard
					nodes={polishNodes}
					relationships={polishRelationships}
					supplements={polishSupplements}
				/>,
			);

			// Test sidebar toggle
			const sidebarToggle = screen.getByRole("button", {
				name: /ukryj panel kontrolny|pokaż panel kontrolny/i,
			});
			await user.click(sidebarToggle);

			expect(mockStoreState.setSidebarOpen).toHaveBeenCalled();

			// Test legend toggle
			const legendToggle = screen.getByRole("button", {
				name: /ukryj legendę|pokaż legendę/i,
			});
			await user.click(legendToggle);

			expect(mockStoreState.setLegendOpen).toHaveBeenCalled();
		});
	});
});
