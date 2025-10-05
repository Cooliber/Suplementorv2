import NodeDetails from "@/components/graph/NodeDetails";
import type { KnowledgeNode } from "@/types/knowledge-graph";
import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";

// Mock the store
vi.mock("@/lib/stores/knowledge-graph-store", () => ({
	useKnowledgeGraphStore: vi.fn(() => ({
		selectedNodes: [],
		focusedNode: null,
		setFocusedNode: vi.fn(),
	})),
}));

describe("NodeDetails Component", () => {
	const mockNode: KnowledgeNode = {
		id: "test-node-1",
		name: "Test Node",
		polishName: "Test Węzeł",
		type: "SUPPLEMENT",
		description: "Test description",
		polishDescription: "Opis testowy",
		evidenceLevel: "STRONG",
		category: "NOOTROPIC",
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
		x: 0,
		y: 0,
		size: 10,
		importance: 1,
	};

	it("renders node details when a node is provided", () => {
		render(<NodeDetails node={mockNode} />);

		// Check for the main container
		const container = screen.getByRole("region");
		expect(container).toBeInTheDocument();

		// Check for node name
		expect(screen.getByText("Test Węzeł")).toBeInTheDocument();
		expect(screen.getByText("Test Node")).toBeInTheDocument();

		// Check for node type
		expect(screen.getByText("SUPPLEMENT")).toBeInTheDocument();

		// Check for description
		expect(screen.getByText("Opis testowy")).toBeInTheDocument();
		expect(screen.getByText("Test description")).toBeInTheDocument();
	});

	it("does not render when no node is provided", () => {
		// Render with undefined node
		render(<NodeDetails node={undefined} />);

		// Should not render any content
		const container = screen.queryByRole("region");
		expect(container).not.toBeInTheDocument();
	});

	it("displays evidence level badge", () => {
		render(<NodeDetails node={mockNode} />);

		// Check for evidence level badge
		expect(screen.getByText("STRONG")).toBeInTheDocument();
	});

	it("displays category information", () => {
		render(<NodeDetails node={mockNode} />);

		// Check for category
		expect(screen.getByText("NOOTROPIC")).toBeInTheDocument();
	});

	it("renders with proper styling and structure", () => {
		render(<NodeDetails node={mockNode} />);

		// Check for card structure
		const card = screen.getByRole("region");
		expect(card).toHaveClass("border", "rounded-lg", "p-4");
	});
});
