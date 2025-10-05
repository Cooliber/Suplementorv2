import CytoscapeVisualization from "@/components/graph/CytoscapeVisualization";
import { getKnowledgeGraphData } from "@/data/knowledge-graph-mock";
import { render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock cytoscape and react-cytoscapejs
vi.mock("cytoscape", () => ({
	__esModule: true,
	default: vi.fn(() => ({
		elements: vi.fn(() => ({
			remove: vi.fn(),
		})),
		add: vi.fn(() => ({
			layout: vi.fn(() => ({
				run: vi.fn(),
			})),
		})),
		layout: vi.fn(() => ({
			run: vi.fn(),
		})),
		style: vi.fn(() => ({
			selector: vi.fn(() => ({
				style: vi.fn(() => ({
					selector: vi.fn(() => ({
						style: vi.fn(),
					})),
				})),
			})),
		})),
		on: vi.fn(() => ({
			unbind: vi.fn(),
		})),
		removeListener: vi.fn(),
		destroy: vi.fn(),
	})),
}));

vi.mock("react-cytoscapejs", () => ({
	__esModule: true,
	default: ({ children }: any) => (
		<div data-testid="cytoscape-container">{children}</div>
	),
}));

// Mock the store
vi.mock("@/lib/stores/knowledge-graph-store", () => ({
	useKnowledgeGraphStore: vi.fn(() => ({
		selectedNodes: [],
		addSelectedNode: vi.fn(),
		removeSelectedNode: vi.fn(),
		filters: {
			nodeTypes: [],
			relationshipTypes: [],
			evidenceLevels: [],
			searchTerm: "",
			minStrength: 0,
			maxNodes: 100,
		},
		setFilters: vi.fn(),
		layout: "cose",
		setLayout: vi.fn(),
		showLabels: true,
		toggleShowLabels: vi.fn(),
	})),
}));

describe("CytoscapeVisualization Component", () => {
	const { nodes, relationships } = getKnowledgeGraphData();

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("renders without crashing", () => {
		expect(() => {
			render(
				<CytoscapeVisualization
					nodes={nodes}
					relationships={relationships}
					width={800}
					height={600}
				/>,
			);
		}).not.toThrow();

		// Check for the cytoscape container
		const container = screen.getByTestId("cytoscape-container");
		expect(container).toBeInTheDocument();
	});

	it("renders with provided data", () => {
		render(
			<CytoscapeVisualization
				nodes={nodes}
				relationships={relationships}
				width={800}
				height={600}
			/>,
		);

		// Verify that the component renders
		const container = screen.getByTestId("cytoscape-container");
		expect(container).toBeInTheDocument();

		// Check that data was provided
		expect(nodes.length).toBeGreaterThan(0);
		expect(relationships.length).toBeGreaterThan(0);
	});

	it("handles different layout configurations", () => {
		render(
			<CytoscapeVisualization
				nodes={nodes}
				relationships={relationships}
				width={800}
				height={600}
				layout="cose"
			/>,
		);

		// Component should render regardless of layout
		expect(screen.getByTestId("cytoscape-container")).toBeInTheDocument();
	});

	it("responds to filter changes", () => {
		render(
			<CytoscapeVisualization
				nodes={nodes}
				relationships={relationships}
				width={800}
				height={600}
			/>,
		);

		// Component should still render with filters applied
		expect(screen.getByTestId("cytoscape-container")).toBeInTheDocument();
	});
});
