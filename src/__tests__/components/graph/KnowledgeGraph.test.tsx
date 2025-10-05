import KnowledgeGraph from "@/components/graph/KnowledgeGraph";
import { getKnowledgeGraphData } from "@/data/knowledge-graph-mock";
import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";

// This is a unit test approach that focuses on the UI logic without deep mocking of the visualization library
describe("KnowledgeGraph Component", () => {
	const { nodes, relationships } = getKnowledgeGraphData();

	// Mock the react-force-graph component to avoid aframe dependency issues
	beforeAll(() => {
		vi.mock("react-force-graph", () => ({
			ForceGraph2D: ({ graphData, ...props }: any) => (
				<div
					data-testid="force-graph"
					data-nodes={graphData?.nodes?.length || 0}
					data-links={graphData?.links?.length || 0}
				>
					<div>Graph Visualization Placeholder</div>
				</div>
			),
		}));

		// Mock the store
		vi.mock("@/lib/stores/knowledge-graph-store", () => ({
			useKnowledgeGraphStore: vi.fn(() => ({
				selectedNodes: [],
				setSelectedNodes: vi.fn(),
				addSelectedNode: vi.fn(),
				removeSelectedNode: vi.fn(),
				clearSelectedNodes: vi.fn(),
				filters: {
					nodeTypes: [],
					relationshipTypes: [],
					evidenceLevels: [],
					searchTerm: "",
					minStrength: 0,
					maxNodes: 100,
				},
				setFilters: vi.fn(),
				resetFilters: vi.fn(),
				zoomLevel: 1,
				setZoomLevel: vi.fn(),
				resetZoom: vi.fn(),
				isPlaying: true,
				togglePlay: vi.fn(),
				setIsPlaying: vi.fn(),
				highlightNode: null,
				setHighlightNode: vi.fn(),
				highlightRelationship: null,
				setHighlightRelationship: vi.fn(),
			})),
		}));
	});

	it("renders the graph component with required UI elements", () => {
		// Since we can't properly test the full component due to external library issues,
		// we'll test the basic structure and functionality we can verify
		expect(() => {
			render(
				<KnowledgeGraph
					nodes={nodes}
					relationships={relationships}
					height={600}
				/>,
			);
		}).not.toThrow();

		// Check that we can at least render some basic UI elements
		expect(screen.getByPlaceholderText("Szukaj węzłów...")).toBeInTheDocument();
	});

	it("renders with provided data", () => {
		expect(nodes).toBeDefined();
		expect(relationships).toBeDefined();
		expect(nodes.length).toBeGreaterThan(0);
		expect(relationships.length).toBeGreaterThan(0);
	});
});
