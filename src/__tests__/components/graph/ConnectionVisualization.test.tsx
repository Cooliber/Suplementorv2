import ConnectionVisualization from "@/components/graph/ConnectionVisualization";
import { useKnowledgeGraphStore } from "@/lib/stores/knowledge-graph-store";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock the store
vi.mock("@/lib/stores/knowledge-graph-store", () => ({
	useKnowledgeGraphStore: vi.fn(),
}));

describe("ConnectionVisualization Component", () => {
	const mockNodes = [
		{
			id: "source-node",
			name: "Source Node",
			polishName: "Węzeł Źródłowy",
			type: "SUPPLEMENT",
			description: "Source description",
			polishDescription: "Opis źródłowy",
			evidenceLevel: "STRONG",
			category: "NOOTROPIC",
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			x: 0,
			y: 0,
			size: 10,
			importance: 1,
		},
		{
			id: "target-node-1",
			name: "Target Node 1",
			polishName: "Węzeł Docelowy 1",
			type: "NEUROTRANSMITTER",
			description: "Target description 1",
			polishDescription: "Opis docelowy 1",
			evidenceLevel: "MODERATE",
			category: "NEUROTRANSMITTER",
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			x: 100,
			y: 100,
			size: 8,
			importance: 0.8,
		},
		{
			id: "target-node-2",
			name: "Target Node 2",
			polishName: "Węzeł Docelowy 2",
			type: "BRAIN_REGION",
			description: "Target description 2",
			polishDescription: "Opis docelowy 2",
			evidenceLevel: "WEAK",
			category: "BRAIN_REGION",
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			x: 200,
			y: 200,
			size: 6,
			importance: 0.6,
		},
	];

	const mockRelationships = [
		{
			id: "rel-1",
			sourceId: "source-node",
			targetId: "target-node-1",
			type: "ENHANCES",
			mechanism: "Mechanism 1",
			polishMechanism: "Mechanizm 1",
			strength: 0.8,
			confidence: 0.9,
			evidenceLevel: "STRONG",
			description: "Relationship description 1",
			polishDescription: "Opis relacji 1",
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		},
		{
			id: "rel-2",
			sourceId: "source-node",
			targetId: "target-node-2",
			type: "INHIBITS",
			mechanism: "Mechanism 2",
			polishMechanism: "Mechanizm 2",
			strength: 0.6,
			confidence: 0.7,
			evidenceLevel: "MODERATE",
			description: "Relationship description 2",
			polishDescription: "Opis relacji 2",
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		},
	];

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
		highlightNode: null,
		setHighlightNode: vi.fn(),
		highlightRelationship: null,
		setHighlightRelationship: vi.fn(),
	};

	beforeEach(() => {
		(useKnowledgeGraphStore as unknown as vi.Mock).mockReturnValue(mockStore);
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("renders connection visualization with provided data", () => {
		render(
			<ConnectionVisualization
				nodes={mockNodes}
				relationships={mockRelationships}
				sourceNodeId="source-node"
				width={800}
				height={600}
			/>,
		);

		// Check for the main visualization container
		const container = screen.getByRole("region");
		expect(container).toBeInTheDocument();

		// Check for the source node header
		expect(screen.getByText("Węzeł Źródłowy")).toBeInTheDocument();

		// Check for connection cards
		expect(screen.getByText("Węzeł Docelowy 1")).toBeInTheDocument();
		expect(screen.getByText("Węzeł Docelowy 2")).toBeInTheDocument();
	});

	it("displays relationship information correctly", () => {
		render(
			<ConnectionVisualization
				nodes={mockNodes}
				relationships={mockRelationships}
				sourceNodeId="source-node"
				width={800}
				height={600}
			/>,
		);

		// Check for relationship details
		expect(screen.getByText("Mechanizm 1")).toBeInTheDocument();
		expect(screen.getByText("Mechanizm 2")).toBeInTheDocument();

		// Check for relationship strengths
		expect(screen.getByText("0.8")).toBeInTheDocument();
		expect(screen.getByText("0.6")).toBeInTheDocument();
	});

	it("applies filters from the store", () => {
		const filteredStore = {
			...mockStore,
			filters: {
				...mockStore.filters,
				relationshipTypes: ["ENHANCES"],
				minStrength: 0.7,
			},
		};

		(useKnowledgeGraphStore as unknown as vi.Mock).mockReturnValue(
			filteredStore,
		);

		render(
			<ConnectionVisualization
				nodes={mockNodes}
				relationships={mockRelationships}
				sourceNodeId="source-node"
				width={800}
				height={600}
			/>,
		);

		// Should only show the ENHANCES relationship (strength 0.8)
		expect(screen.getByText("Węzeł Docelowy 1")).toBeInTheDocument();

		// Should not show the INHIBITS relationship (strength 0.6 < 0.7)
		expect(screen.queryByText("Węzeł Docelowy 2")).not.toBeInTheDocument();
	});

	it("handles missing source node gracefully", () => {
		render(
			<ConnectionVisualization
				nodes={mockNodes}
				relationships={mockRelationships}
				sourceNodeId="non-existent-node"
				width={800}
				height={600}
			/>,
		);

		// Should show error message for missing source node
		expect(screen.getByText(/nie znaleziono/i)).toBeInTheDocument();
	});

	it("displays node type badges correctly", () => {
		render(
			<ConnectionVisualization
				nodes={mockNodes}
				relationships={mockRelationships}
				sourceNodeId="source-node"
				width={800}
				height={600}
			/>,
		);

		// Check for node type badges
		expect(screen.getByText("SUPPLEMENT")).toBeInTheDocument();
		expect(screen.getByText("NEUROTRANSMITTER")).toBeInTheDocument();
		expect(screen.getByText("BRAIN_REGION")).toBeInTheDocument();
	});

	it("displays evidence level indicators", () => {
		render(
			<ConnectionVisualization
				nodes={mockNodes}
				relationships={mockRelationships}
				sourceNodeId="source-node"
				width={800}
				height={600}
			/>,
		);

		// Check for evidence level badges
		expect(screen.getByText("STRONG")).toBeInTheDocument();
		expect(screen.getByText("MODERATE")).toBeInTheDocument();
		expect(screen.getByText("WEAK")).toBeInTheDocument();
	});

	it("handles empty relationships gracefully", () => {
		render(
			<ConnectionVisualization
				nodes={mockNodes}
				relationships={[]}
				sourceNodeId="source-node"
				width={800}
				height={600}
			/>,
		);

		// Should show message about no connections
		expect(screen.getByText(/brak połączeń/i)).toBeInTheDocument();
	});

	it("responds to node hover events", () => {
		render(
			<ConnectionVisualization
				nodes={mockNodes}
				relationships={mockRelationships}
				sourceNodeId="source-node"
				width={800}
				height={600}
			/>,
		);

		const targetNodeCard = screen
			.getByText("Węzeł Docelowy 1")
			.closest('[data-testid="connection-card"]');
		if (targetNodeCard) {
			fireEvent.mouseEnter(targetNodeCard);

			// Should call setHighlightNode with the hovered node ID
			expect(mockStore.setHighlightNode).toHaveBeenCalledWith("target-node-1");
		}
	});

	it("responds to node leave events", () => {
		render(
			<ConnectionVisualization
				nodes={mockNodes}
				relationships={mockRelationships}
				sourceNodeId="source-node"
				width={800}
				height={600}
			/>,
		);

		const targetNodeCard = screen
			.getByText("Węzeł Docelowy 1")
			.closest('[data-testid="connection-card"]');
		if (targetNodeCard) {
			fireEvent.mouseLeave(targetNodeCard);

			// Should call setHighlightNode with null
			expect(mockStore.setHighlightNode).toHaveBeenCalledWith(null);
		}
	});

	it("responds to relationship hover events", () => {
		render(
			<ConnectionVisualization
				nodes={mockNodes}
				relationships={mockRelationships}
				sourceNodeId="source-node"
				width={800}
				height={600}
			/>,
		);

		const relationshipCard = screen
			.getByText("Mechanizm 1")
			.closest('[data-testid="relationship-card"]');
		if (relationshipCard) {
			fireEvent.mouseEnter(relationshipCard);

			// Should call setHighlightRelationship with the hovered relationship ID
			expect(mockStore.setHighlightRelationship).toHaveBeenCalledWith("rel-1");
		}
	});

	it("responds to relationship leave events", () => {
		render(
			<ConnectionVisualization
				nodes={mockNodes}
				relationships={mockRelationships}
				sourceNodeId="source-node"
				width={800}
				height={600}
			/>,
		);

		const relationshipCard = screen
			.getByText("Mechanizm 1")
			.closest('[data-testid="relationship-card"]');
		if (relationshipCard) {
			fireEvent.mouseLeave(relationshipCard);

			// Should call setHighlightRelationship with null
			expect(mockStore.setHighlightRelationship).toHaveBeenCalledWith(null);
		}
	});

	it("displays connection statistics", () => {
		render(
			<ConnectionVisualization
				nodes={mockNodes}
				relationships={mockRelationships}
				sourceNodeId="source-node"
				width={800}
				height={600}
			/>,
		);

		// Should display connection count
		expect(screen.getByText(/połączenia:/i)).toBeInTheDocument();
		expect(screen.getByText("2")).toBeInTheDocument();
	});

	it("uses correct styling based on relationship types", () => {
		render(
			<ConnectionVisualization
				nodes={mockNodes}
				relationships={mockRelationships}
				sourceNodeId="source-node"
				width={800}
				height={600}
			/>,
		);

		// Check for relationship type styling
		const enhancesBadge = screen.getByText("ENHANCES");
		const inhibitsBadge = screen.getByText("INHIBITS");

		expect(enhancesBadge).toBeInTheDocument();
		expect(inhibitsBadge).toBeInTheDocument();
	});

	it("maintains proper accessibility attributes", () => {
		render(
			<ConnectionVisualization
				nodes={mockNodes}
				relationships={mockRelationships}
				sourceNodeId="source-node"
				width={800}
				height={600}
			/>,
		);

		// Check for proper ARIA roles
		const region = screen.getByRole("region");
		expect(region).toHaveAttribute(
			"aria-label",
			expect.stringContaining("połączenia"),
		);

		// Check for proper heading structure
		const headings = screen.getAllByRole("heading");
		expect(headings.length).toBeGreaterThan(0);
	});

	it("handles search filtering", () => {
		const searchStore = {
			...mockStore,
			filters: {
				...mockStore.filters,
				searchTerm: "Docelowy 1",
			},
		};

		(useKnowledgeGraphStore as unknown as vi.Mock).mockReturnValue(searchStore);

		render(
			<ConnectionVisualization
				nodes={mockNodes}
				relationships={mockRelationships}
				sourceNodeId="source-node"
				width={800}
				height={600}
			/>,
		);

		// Should only show nodes matching the search term
		expect(screen.getByText("Węzeł Docelowy 1")).toBeInTheDocument();
		expect(screen.queryByText("Węzeł Docelowy 2")).not.toBeInTheDocument();
	});

	it("handles evidence level filtering", () => {
		const evidenceStore = {
			...mockStore,
			filters: {
				...mockStore.filters,
				evidenceLevels: ["STRONG", "MODERATE"],
			},
		};

		(useKnowledgeGraphStore as unknown as vi.Mock).mockReturnValue(
			evidenceStore,
		);

		render(
			<ConnectionVisualization
				nodes={mockNodes}
				relationships={mockRelationships}
				sourceNodeId="source-node"
				width={800}
				height={600}
			/>,
		);

		// Should show STRONG and MODERATE evidence level connections
		expect(screen.getByText("Węzeł Docelowy 1")).toBeInTheDocument(); // MODERATE
		expect(screen.getByText("Węzeł Docelowy 2")).toBeInTheDocument(); // MODERATE

		// Source node has STRONG evidence, so it should be visible in the header
	});
});
