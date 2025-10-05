import GraphLegend from "@/components/graph/GraphLegend";
import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";

// Mock the store
vi.mock("@/lib/stores/knowledge-graph-store", () => ({
	useKnowledgeGraphStore: vi.fn(() => ({
		filters: {
			nodeTypes: [],
			relationshipTypes: [],
		},
		setFilters: vi.fn(),
	})),
}));

describe("GraphLegend Component", () => {
	it("renders legend with node type categories", () => {
		render(<GraphLegend />);

		// Check for the main legend container
		const legendContainer = screen.getByRole("list");
		expect(legendContainer).toBeInTheDocument();

		// Check for various node type categories in the legend
		expect(screen.getByText("SUPPLEMENT")).toBeInTheDocument();
		expect(screen.getByText("NEUROTRANSMITTER")).toBeInTheDocument();
		expect(screen.getByText("BRAIN_REGION")).toBeInTheDocument();
		expect(screen.getByText("COGNITIVE_FUNCTION")).toBeInTheDocument();
		expect(screen.getByText("PATHWAY")).toBeInTheDocument();
		expect(screen.getByText("MECHANISM")).toBeInTheDocument();

		// Check for vitamin and mineral categories
		expect(screen.getByText("VITAMIN")).toBeInTheDocument();
		expect(screen.getByText("MINERAL")).toBeInTheDocument();
	});

	it("renders legend with relationship type categories", () => {
		render(<GraphLegend />);

		// Check for relationship type categories in the legend
		expect(screen.getByText("ENHANCES")).toBeInTheDocument();
		expect(screen.getByText("INHIBITS")).toBeInTheDocument();
		expect(screen.getByText("MODULATES")).toBeInTheDocument();
		expect(screen.getByText("SYNERGIZES")).toBeInTheDocument();
		expect(screen.getByText("ANTAGONIZES")).toBeInTheDocument();
	});

	it("renders with correct styling and structure", () => {
		render(<GraphLegend />);

		// Check for the main legend container class
		const legendContainer = screen.getByRole("list");
		expect(legendContainer).toHaveClass("space-y-2");

		// Check for legend items
		const legendItems = screen.getAllByRole("listitem");
		expect(legendItems.length).toBeGreaterThan(0);
	});
});
