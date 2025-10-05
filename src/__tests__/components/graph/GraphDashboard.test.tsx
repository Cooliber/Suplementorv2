import GraphDashboard from "@/components/graph/GraphDashboard";
import { useGraphData } from "@/hooks/useGraphData";
import { useKnowledgeGraphStore } from "@/lib/stores/knowledge-graph-store";
import { render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

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

describe("GraphDashboard Component", () => {
	const mockUseGraphData = {
		nodes: [
			{
				id: "1",
				name: "Test Node",
				polishName: "Test Węzeł",
				type: "SUPPLEMENT",
				evidenceLevel: "STRONG",
			},
			{
				id: "2",
				name: "Test Node 2",
				polishName: "Test Węzeł 2",
				type: "NEUROTRANSMITTER",
				evidenceLevel: "MODERATE",
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
		},
		setFilters: vi.fn(),
		filteredNodes: [],
		filteredRelationships: [],
		maxRenderNodes: 500,
	};

	beforeEach(() => {
		(useGraphData as unknown as vi.Mock).mockReturnValue(mockUseGraphData);
		(useKnowledgeGraphStore as unknown as vi.Mock).mockReturnValue(mockStore);
	});

	it("renders the main dashboard structure", () => {
		render(<GraphDashboard />);

		// Check for the main dashboard container
		const dashboard = screen.getByRole("main");
		expect(dashboard).toBeInTheDocument();

		// Check for the title
		const title = screen.getByRole("heading", { name: /wizualizacja grafu/i });
		expect(title).toBeInTheDocument();

		// Check for controls
		const controls = screen.getByTestId("graph-controls");
		expect(controls).toBeInTheDocument();

		// Check for legend
		const legend = screen.getByTestId("graph-legend");
		expect(legend).toBeInTheDocument();

		// Check for graph visualization
		const graph = screen.getByTestId("d3-graph");
		expect(graph).toBeInTheDocument();
	});

	it("displays loading state", () => {
		(useGraphData as unknown as vi.Mock).mockReturnValue({
			...mockUseGraphData,
			isLoading: true,
		});

		render(<GraphDashboard />);

		// Should show loading indicator
		const loadingIndicator = screen.getByText(/ładowanie/i);
		expect(loadingIndicator).toBeInTheDocument();
	});

	it("displays error state", () => {
		(useGraphData as unknown as vi.Mock).mockReturnValue({
			...mockUseGraphData,
			error: "Test error occurred",
		});

		render(<GraphDashboard />);

		// Should show error message
		const errorMessage = screen.getByText(/błąd/i);
		expect(errorMessage).toBeInTheDocument();
	});

	it("renders with graph data", () => {
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
});
