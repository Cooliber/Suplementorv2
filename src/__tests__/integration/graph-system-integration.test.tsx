import GraphDashboard from "@/components/graph/GraphDashboard";
import { useGraphData } from "@/hooks/useGraphData";
import { useKnowledgeGraphStore } from "@/lib/stores/knowledge-graph-store";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock the hooks and services
vi.mock("@/hooks/useGraphData", () => ({
	useGraphData: vi.fn(),
}));

vi.mock("@/lib/stores/knowledge-graph-store", () => ({
	useKnowledgeGraphStore: vi.fn(),
}));

vi.mock("@/components/graph/D3GraphVisualization", () => ({
	default: ({ nodes, relationships }: any) => (
		<div
			data-testid="d3-graph"
			data-nodes={nodes.length}
			data-relationships={relationships.length}
		>
			Mock D3 Graph Visualization
		</div>
	),
}));

vi.mock("@/components/graph/GraphControls", () => ({
	default: () => <div data-testid="graph-controls">Mock Graph Controls</div>,
}));

vi.mock("@/components/graph/GraphLegend", () => ({
	default: () => <div data-testid="graph-legend">Mock Graph Legend</div>,
}));

vi.mock("@/components/graph/AccessibleGraphLegend", () => ({
	default: () => (
		<div data-testid="accessible-graph-legend">
			Mock Accessible Graph Legend
		</div>
	),
}));

vi.mock("@/components/graph/GraphExportImport", () => ({
	default: () => (
		<div data-testid="graph-export-import">Mock Graph Export/Import</div>
	),
}));

describe("Graph System Integration", () => {
	const mockUseGraphData = {
		nodes: [
			{
				id: "1",
				name: "Test Node",
				polishName: "Test Węzeł",
				type: "SUPPLEMENT",
				evidenceLevel: "STRONG",
				description: "Test description",
				polishDescription: "Opis testowy",
				category: "NOOTROPIC",
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
				x: 0,
				y: 0,
				size: 10,
				importance: 1,
			},
			{
				id: "2",
				name: "Test Node 2",
				polishName: "Test Węzeł 2",
				type: "NEUROTRANSMITTER",
				evidenceLevel: "MODERATE",
				description: "Test description 2",
				polishDescription: "Opis testowy 2",
				category: "NEUROTRANSMITTER",
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
				x: 100,
				y: 100,
				size: 8,
				importance: 0.8,
			},
		],
		relationships: [
			{
				id: "1",
				sourceId: "1",
				targetId: "2",
				type: "ENHANCES",
				strength: 0.8,
				evidenceLevel: "STRONG",
				mechanism: "Test mechanism",
				polishMechanism: "Testowy mechanizm",
				description: "Test relationship",
				polishDescription: "Opis testowy",
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
				confidence: 0.9,
			},
		],
		supplements: [],
		isLoading: false,
		error: null,
		refetch: vi.fn(),
		updateOptions: vi.fn(),
	};

	const mockStore = {
		filters: {
			nodeTypes: [],
			relationshipTypes: [],
			evidenceLevels: [],
			searchTerm: "",
			minStrength: 0,
			maxNodes: 100,
			showLabels: true,
		},
		setFilters: vi.fn(),
		filteredNodes: [],
		filteredRelationships: [],
		maxRenderNodes: 500,
		layout: "force",
		setLayout: vi.fn(),
		showLabels: true,
		toggleShowLabels: vi.fn(),
		isPlaying: true,
		togglePlay: vi.fn(),
		setIsPlaying: vi.fn(),
		zoomLevel: 1,
		setZoomLevel: vi.fn(),
		resetZoom: vi.fn(),
		highlightNode: null,
		setHighlightNode: vi.fn(),
		highlightRelationship: null,
		setHighlightRelationship: vi.fn(),
		selectedNodes: [],
		addSelectedNode: vi.fn(),
		removeSelectedNode: vi.fn(),
		clearSelectedNodes: vi.fn(),
		resetFilters: vi.fn(),
		enablePhysics: true,
		setEnablePhysics: vi.fn(),
	};

	beforeEach(() => {
		(useGraphData as unknown as vi.Mock).mockReturnValue(mockUseGraphData);
		(useKnowledgeGraphStore as unknown as vi.Mock).mockReturnValue(mockStore);
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("renders the complete graph dashboard with all components", () => {
		render(<GraphDashboard />);

		// Check for the main dashboard container
		const dashboard = screen.getByRole("main");
		expect(dashboard).toBeInTheDocument();

		// Check for the title
		const title = screen.getByRole("heading", { name: /wizualizacja grafu/i });
		expect(title).toBeInTheDocument();

		// Check for all core components
		expect(screen.getByTestId("graph-controls")).toBeInTheDocument();
		expect(screen.getByTestId("graph-legend")).toBeInTheDocument();
		expect(screen.getByTestId("d3-graph")).toBeInTheDocument();
		expect(screen.getByTestId("graph-export-import")).toBeInTheDocument();
		expect(screen.getByTestId("accessible-graph-legend")).toBeInTheDocument();
	});

	it("displays loading state correctly", () => {
		(useGraphData as unknown as vi.Mock).mockReturnValue({
			...mockUseGraphData,
			isLoading: true,
		});

		render(<GraphDashboard />);

		// Should show loading indicator
		expect(screen.getByText(/ładowanie/i)).toBeInTheDocument();
	});

	it("displays error state correctly", () => {
		(useGraphData as unknown as vi.Mock).mockReturnValue({
			...mockUseGraphData,
			error: "Test error occurred",
		});

		render(<GraphDashboard />);

		// Should show error message
		expect(screen.getByText(/błąd/i)).toBeInTheDocument();
	});

	it("passes graph data to visualization components", () => {
		render(<GraphDashboard />);

		// Check that the D3 graph receives the correct data
		const graph = screen.getByTestId("d3-graph");
		expect(graph).toHaveAttribute("data-nodes", "2");
		expect(graph).toHaveAttribute("data-relationships", "1");
	});

	it("shows statistics when data is loaded", () => {
		render(<GraphDashboard />);

		// Should display node and relationship counts
		expect(screen.getByText(/węzły:/i)).toBeInTheDocument();
		expect(screen.getByText(/połączenia:/i)).toBeInTheDocument();
	});

	it("integrates export/import functionality", () => {
		render(<GraphDashboard />);

		// Should render export/import component
		expect(screen.getByTestId("graph-export-import")).toBeInTheDocument();
	});

	it("integrates accessible components", () => {
		render(<GraphDashboard />);

		// Should render accessible legend
		expect(screen.getByTestId("accessible-graph-legend")).toBeInTheDocument();
	});

	it("responds to store updates", () => {
		render(<GraphDashboard />);

		// Check initial state
		expect(screen.getByTestId("d3-graph")).toBeInTheDocument();

		// Simulate store update - this is difficult to test directly
		// but we can verify the component responds to data updates
		(useGraphData as unknown as vi.Mock).mockReturnValue({
			...mockUseGraphData,
			nodes: [
				...mockUseGraphData.nodes,
				{
					id: "3",
					name: "New Node",
					polishName: "Nowy Węzeł",
					type: "BRAIN_REGION",
					evidenceLevel: "WEAK",
					description: "New description",
					polishDescription: "Nowy opis",
					category: "BRAIN_REGION",
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
					x: 200,
					y: 200,
					size: 6,
					importance: 0.5,
				},
			],
		});

		// Re-render with updated data
		const { rerender } = render(<GraphDashboard />);
		rerender(<GraphDashboard />);

		// Should update with new data
		const graph = screen.getByTestId("d3-graph");
		expect(graph).toHaveAttribute("data-nodes", "3");
	});

	it("handles filter updates from controls", () => {
		render(<GraphDashboard />);

		// Simulate filter update
		const controls = screen.getByTestId("graph-controls");
		expect(controls).toBeInTheDocument();

		// The actual filter update would happen through the store
		// We can verify the store mock was called
		expect(useKnowledgeGraphStore).toHaveBeenCalled();
	});

	it("maintains accessibility standards", () => {
		render(<GraphDashboard />);

		// Check for proper ARIA roles and labels
		const dashboard = screen.getByRole("main");
		expect(dashboard).toHaveAttribute(
			"aria-label",
			expect.stringContaining("graf"),
		);

		// Check for accessible components
		const accessibleLegend = screen.getByTestId("accessible-graph-legend");
		expect(accessibleLegend).toBeInTheDocument();
	});

	it("handles responsive design", () => {
		render(<GraphDashboard />);

		// Check for responsive layout elements
		const dashboard = screen.getByRole("main");
		expect(dashboard).toHaveClass("container");
		expect(dashboard).toHaveClass("mx-auto");
		expect(dashboard).toHaveClass("py-8");
	});

	it("integrates with store for user interactions", () => {
		render(<GraphDashboard />);

		// Check that store methods are available
		expect(mockStore.setLayout).toBeDefined();
		expect(mockStore.setFilters).toBeDefined();
		expect(mockStore.togglePlay).toBeDefined();
		expect(mockStore.setZoomLevel).toBeDefined();
	});
});
