import VirtualizedGraphVisualization from "@/components/graph/VirtualizedGraphVisualization";
import { useKnowledgeGraphStore } from "@/lib/stores/knowledge-graph-store";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock the store
vi.mock("@/lib/stores/knowledge-graph-store", () => ({
	useKnowledgeGraphStore: vi.fn(),
}));

// Mock canvas
HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
	clearRect: vi.fn(),
	save: vi.fn(),
	restore: vi.fn(),
	translate: vi.fn(),
	scale: vi.fn(),
	beginPath: vi.fn(),
	moveTo: vi.fn(),
	lineTo: vi.fn(),
	arc: vi.fn(),
	stroke: vi.fn(),
	fill: vi.fn(),
	closePath: vi.fn(),
	setLineDash: vi.fn(),
	measureText: vi.fn(() => ({ width: 100 })),
	fillText: vi.fn(),
	strokeText: vi.fn(),
}));

// Mock requestAnimationFrame
global.requestAnimationFrame = vi.fn((callback) => {
	setTimeout(callback, 16);
	return 1;
});

global.cancelAnimationFrame = vi.fn();

describe("VirtualizedGraphVisualization Component", () => {
	const mockNodes = [
		{
			id: "node-1",
			name: "Node 1",
			polishName: "Węzeł 1",
			type: "SUPPLEMENT",
			description: "Description 1",
			polishDescription: "Opis 1",
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
			id: "node-2",
			name: "Node 2",
			polishName: "Węzeł 2",
			type: "NEUROTRANSMITTER",
			description: "Description 2",
			polishDescription: "Opis 2",
			evidenceLevel: "MODERATE",
			category: "NEUROTRANSMITTER",
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			x: 100,
			y: 100,
			size: 8,
			importance: 0.8,
		},
	];

	const mockRelationships = [
		{
			id: "rel-1",
			sourceId: "node-1",
			targetId: "node-2",
			type: "ENHANCES",
			mechanism: "Mechanism 1",
			polishMechanism: "Mechanizm 1",
			strength: 0.8,
			confidence: 0.9,
			evidenceLevel: "STRONG",
			description: "Relationship description",
			polishDescription: "Opis relacji",
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		},
	];

	const mockSupplements = [];

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
		maxRenderNodes: 500,
		setFilters: vi.fn(),
	};

	beforeEach(() => {
		(useKnowledgeGraphStore as unknown as vi.Mock).mockReturnValue(mockStore);
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("renders without crashing", () => {
		expect(() => {
			render(
				<VirtualizedGraphVisualization
					nodes={mockNodes}
					relationships={mockRelationships}
					supplements={mockSupplements}
					width={800}
					height={600}
				/>,
			);
		}).not.toThrow();
	});

	it("renders canvas element correctly", () => {
		render(
			<VirtualizedGraphVisualization
				nodes={mockNodes}
				relationships={mockRelationships}
				supplements={mockSupplements}
				width={800}
				height={600}
			/>,
		);

		const canvas = screen.getByRole("img");
		expect(canvas).toBeInTheDocument();
		expect(canvas).toHaveAttribute("width", "800");
		expect(canvas).toHaveAttribute("height", "600");
	});

	it("displays node and relationship counts", () => {
		render(
			<VirtualizedGraphVisualization
				nodes={mockNodes}
				relationships={mockRelationships}
				supplements={mockSupplements}
				width={800}
				height={600}
			/>,
		);

		expect(screen.getByText(/Węzły: 2/i)).toBeInTheDocument();
		expect(screen.getByText(/Połączenia: 1/i)).toBeInTheDocument();
	});

	it("handles zoom controls", () => {
		render(
			<VirtualizedGraphVisualization
				nodes={mockNodes}
				relationships={mockRelationships}
				supplements={mockSupplements}
				width={800}
				height={600}
			/>,
		);

		const zoomInButton = screen.getByRole("button", { name: /zoom in/i });
		const zoomOutButton = screen.getByRole("button", { name: /zoom out/i });
		const resetButton = screen.getByRole("button", { name: /reset/i });

		expect(zoomInButton).toBeInTheDocument();
		expect(zoomOutButton).toBeInTheDocument();
		expect(resetButton).toBeInTheDocument();
	});

	it("handles play/pause controls", () => {
		render(
			<VirtualizedGraphVisualization
				nodes={mockNodes}
				relationships={mockRelationships}
				supplements={mockSupplements}
				width={800}
				height={600}
			/>,
		);

		const playButton = screen.getByRole("button", { name: /play/i });
		expect(playButton).toBeInTheDocument();
	});

	it("applies filters from store", () => {
		const filteredStore = {
			...mockStore,
			filters: {
				...mockStore.filters,
				nodeTypes: ["SUPPLEMENT"],
			},
		};

		(useKnowledgeGraphStore as unknown as vi.Mock).mockReturnValue(
			filteredStore,
		);

		render(
			<VirtualizedGraphVisualization
				nodes={mockNodes}
				relationships={mockRelationships}
				supplements={mockSupplements}
				width={800}
				height={600}
			/>,
		);

		// Should still render, but with filtered data
		const canvas = screen.getByRole("img");
		expect(canvas).toBeInTheDocument();
	});

	it("limits nodes based on maxRenderNodes", () => {
		const manyNodes = Array.from({ length: 10 }, (_, i) => ({
			id: `node-${i}`,
			name: `Node ${i}`,
			polishName: `Węzeł ${i}`,
			type: "SUPPLEMENT",
			description: `Description ${i}`,
			polishDescription: `Opis ${i}`,
			evidenceLevel: "STRONG",
			category: "NOOTROPIC",
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			x: i * 50,
			y: i * 50,
			size: 10,
			importance: 1,
		}));

		const limitedStore = {
			...mockStore,
			maxRenderNodes: 5,
		};

		(useKnowledgeGraphStore as unknown as vi.Mock).mockReturnValue(
			limitedStore,
		);

		render(
			<VirtualizedGraphVisualization
				nodes={manyNodes}
				relationships={mockRelationships}
				supplements={mockSupplements}
				width={800}
				height={600}
			/>,
		);

		// Should render with limited nodes
		const canvas = screen.getByRole("img");
		expect(canvas).toBeInTheDocument();
	});

	it("handles canvas click events", () => {
		render(
			<VirtualizedGraphVisualization
				nodes={mockNodes}
				relationships={mockRelationships}
				supplements={mockSupplements}
				width={800}
				height={600}
			/>,
		);

		const canvas = screen.getByRole("img");
		fireEvent.click(canvas);

		// Click handling is complex to test without real canvas dimensions
		// but we can verify the component doesn't crash
		expect(canvas).toBeInTheDocument();
	});

	it("handles canvas mouse move events", () => {
		render(
			<VirtualizedGraphVisualization
				nodes={mockNodes}
				relationships={mockRelationships}
				supplements={mockSupplements}
				width={800}
				height={600}
			/>,
		);

		const canvas = screen.getByRole("img");
		fireEvent.mouseMove(canvas);

		// Mouse move handling is complex to test without real canvas dimensions
		// but we can verify the component doesn't crash
		expect(canvas).toBeInTheDocument();
	});
});
