import GraphControls from "@/components/graph/GraphControls";
import { useKnowledgeGraphStore } from "@/lib/stores/knowledge-graph-store";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock the store
vi.mock("@/lib/stores/knowledge-graph-store", () => ({
	useKnowledgeGraphStore: vi.fn(),
}));

describe("GraphControls Component", () => {
	const mockSetFilters = vi.fn();
	const mockResetFilters = vi.fn();
	const mockSetLayout = vi.fn();
	const mockToggleShowLabels = vi.fn();
	const mockSetHighlightNode = vi.fn();
	const mockSetHighlightRelationship = vi.fn();

	beforeEach(() => {
		(useKnowledgeGraphStore as unknown as vi.Mock).mockReturnValue({
			filters: {
				nodeTypes: [],
				relationshipTypes: [],
				evidenceLevels: [],
				searchTerm: "",
				minStrength: 0,
				maxNodes: 100,
			},
			setFilters: mockSetFilters,
			resetFilters: mockResetFilters,
			layout: "force",
			setLayout: mockSetLayout,
			showLabels: true,
			toggleShowLabels: mockToggleShowLabels,
			setHighlightNode: mockSetHighlightNode,
			setHighlightRelationship: mockSetHighlightRelationship,
		});
	});

	it("renders all control elements", () => {
		render(<GraphControls />);

		// Check for the main container
		const controlsContainer = screen.getByRole("form");
		expect(controlsContainer).toBeInTheDocument();

		// Check for search input
		const searchInput = screen.getByPlaceholderText(/szukaj/i);
		expect(searchInput).toBeInTheDocument();

		// Check for layout selector
		const layoutSelect = screen.getByRole("combobox");
		expect(layoutSelect).toBeInTheDocument();

		// Check for filter buttons
		const resetButton = screen.getByRole("button", { name: /reset/i });
		expect(resetButton).toBeInTheDocument();

		// Check for label toggle
		const labelToggle = screen.getByRole("checkbox", { name: /etykiety/i });
		expect(labelToggle).toBeInTheDocument();
	});

	it("handles search input changes", () => {
		render(<GraphControls />);

		const searchInput = screen.getByPlaceholderText(/szukaj/i);
		fireEvent.change(searchInput, { target: { value: "test search" } });

		expect(mockSetFilters).toHaveBeenCalledWith({
			searchTerm: "test search",
		});
	});

	it("toggles label visibility", () => {
		render(<GraphControls />);

		const labelToggle = screen.getByRole("checkbox", { name: /etykiety/i });
		fireEvent.click(labelToggle);

		expect(mockToggleShowLabels).toHaveBeenCalled();
	});

	it("resets filters correctly", () => {
		render(<GraphControls />);

		const resetButton = screen.getByRole("button", { name: /reset/i });
		fireEvent.click(resetButton);

		expect(mockResetFilters).toHaveBeenCalled();
	});

	it("changes layout when selected", () => {
		render(<GraphControls />);

		const layoutSelect = screen.getByRole("combobox");
		fireEvent.change(layoutSelect, { target: { value: "radial" } });

		expect(mockSetLayout).toHaveBeenCalledWith("radial");
	});
});
