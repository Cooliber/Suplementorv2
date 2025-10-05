import AccessibleGraphLegend from "@/components/graph/AccessibleGraphLegend";
import { useKnowledgeGraphStore } from "@/lib/stores/knowledge-graph-store";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock the store
vi.mock("@/lib/stores/knowledge-graph-store", () => ({
	useKnowledgeGraphStore: vi.fn(),
}));

describe("AccessibleGraphLegend Component", () => {
	const mockSetFilters = vi.fn();
	const mockFilters = {
		nodeTypes: [],
		relationshipTypes: [],
		evidenceLevels: [],
		searchTerm: "",
		minStrength: 0,
		maxNodes: 100,
		showLabels: true,
	};

	const mockStore = {
		filters: mockFilters,
		setFilters: mockSetFilters,
	};

	beforeEach(() => {
		(useKnowledgeGraphStore as unknown as vi.Mock).mockReturnValue(mockStore);
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("renders with proper accessibility attributes", () => {
		render(<AccessibleGraphLegend />);

		const legendContainer = screen.getByRole("region", {
			name: /legenda grafu wiedzy/i,
		});
		expect(legendContainer).toBeInTheDocument();
		expect(legendContainer).toHaveAttribute(
			"aria-label",
			"Legenda grafu wiedzy",
		);
	});

	it("displays node type headings", () => {
		render(<AccessibleGraphLegend />);

		const nodeTypesHeading = screen.getByRole("heading", {
			name: /typy węzłów/i,
		});
		const relationshipTypesHeading = screen.getByRole("heading", {
			name: /typy relacji/i,
		});
		const evidenceLevelsHeading = screen.getByRole("heading", {
			name: /poziomy dowodów/i,
		});

		expect(nodeTypesHeading).toBeInTheDocument();
		expect(relationshipTypesHeading).toBeInTheDocument();
		expect(evidenceLevelsHeading).toBeInTheDocument();
	});

	it("renders all node type options", () => {
		render(<AccessibleGraphLegend />);

		// Check for key node types
		expect(screen.getByText("Suplement")).toBeInTheDocument();
		expect(screen.getByText("Neuroprzekaźnik")).toBeInTheDocument();
		expect(screen.getByText("Obszar mózgu")).toBeInTheDocument();
		expect(screen.getByText("Funkcja poznawcza")).toBeInTheDocument();
		expect(screen.getByText("Szlak")).toBeInTheDocument();
		expect(screen.getByText("Mechanizm")).toBeInTheDocument();
		expect(screen.getByText("Witamina")).toBeInTheDocument();
		expect(screen.getByText("Minerał")).toBeInTheDocument();
		expect(screen.getByText("Aminokwas")).toBeInTheDocument();
		expect(screen.getByText("Kwas tłuszczowy")).toBeInTheDocument();
		expect(screen.getByText("Zioło")).toBeInTheDocument();
		expect(screen.getByText("Nootropik")).toBeInTheDocument();
		expect(screen.getByText("Adaptogen")).toBeInTheDocument();
	});

	it("renders all relationship type options", () => {
		render(<AccessibleGraphLegend />);

		// Check for key relationship types
		expect(screen.getByText("Wzmacnia")).toBeInTheDocument();
		expect(screen.getByText("Hamuje")).toBeInTheDocument();
		expect(screen.getByText("Moduluje")).toBeInTheDocument();
		expect(screen.getByText("Synergizuje")).toBeInTheDocument();
		expect(screen.getByText("Antagonizuje")).toBeInTheDocument();
		expect(screen.getByText("Wymaga")).toBeInTheDocument();
		expect(screen.getByText("Produkuje")).toBeInTheDocument();
		expect(screen.getByText("Metabolizuje")).toBeInTheDocument();
	});

	it("renders all evidence level options", () => {
		render(<AccessibleGraphLegend />);

		// Check for evidence levels
		expect(screen.getByText("STRONG")).toBeInTheDocument();
		expect(screen.getByText("MODERATE")).toBeInTheDocument();
		expect(screen.getByText("WEAK")).toBeInTheDocument();
		expect(screen.getByText("INSUFFICIENT")).toBeInTheDocument();
		expect(screen.getByText("CONFLICTING")).toBeInTheDocument();
	});

	it("handles node type filter toggling", () => {
		render(<AccessibleGraphLegend />);

		const supplementButton = screen.getByRole("switch", {
			name: /filtruj po typie suplement/i,
		});
		fireEvent.click(supplementButton);

		expect(mockSetFilters).toHaveBeenCalledWith({
			nodeTypes: ["SUPPLEMENT"],
		});

		// Click again to remove filter
		fireEvent.click(supplementButton);
		expect(mockSetFilters).toHaveBeenCalledWith({
			nodeTypes: [],
		});
	});

	it("handles relationship type filter toggling", () => {
		render(<AccessibleGraphLegend />);

		const enhancesButton = screen.getByRole("switch", {
			name: /filtruj po relacji wzmacnia/i,
		});
		fireEvent.click(enhancesButton);

		expect(mockSetFilters).toHaveBeenCalledWith({
			relationshipTypes: ["ENHANCES"],
		});

		// Click again to remove filter
		fireEvent.click(enhancesButton);
		expect(mockSetFilters).toHaveBeenCalledWith({
			relationshipTypes: [],
		});
	});

	it("handles evidence level filter toggling", () => {
		render(<AccessibleGraphLegend />);

		const strongButton = screen.getByRole("switch", {
			name: /filtruj po poziomie dowodów strong/i,
		});
		fireEvent.click(strongButton);

		expect(mockSetFilters).toHaveBeenCalledWith({
			evidenceLevels: ["STRONG"],
		});

		// Click again to remove filter
		fireEvent.click(strongButton);
		expect(mockSetFilters).toHaveBeenCalledWith({
			evidenceLevels: [],
		});
	});

	it("supports multiple simultaneous filters", () => {
		render(<AccessibleGraphLegend />);

		const supplementButton = screen.getByRole("switch", {
			name: /filtruj po typie suplement/i,
		});
		const enhancesButton = screen.getByRole("switch", {
			name: /filtruj po relacji wzmacnia/i,
		});
		const strongButton = screen.getByRole("switch", {
			name: /filtruj po poziomie dowodów strong/i,
		});

		fireEvent.click(supplementButton);
		fireEvent.click(enhancesButton);
		fireEvent.click(strongButton);

		expect(mockSetFilters).toHaveBeenNthCalledWith(1, {
			nodeTypes: ["SUPPLEMENT"],
		});
		expect(mockSetFilters).toHaveBeenNthCalledWith(2, {
			relationshipTypes: ["ENHANCES"],
		});
		expect(mockSetFilters).toHaveBeenNthCalledWith(3, {
			evidenceLevels: ["STRONG"],
		});
	});

	it("updates button states based on active filters", () => {
		const filteredStore = {
			...mockStore,
			filters: {
				...mockFilters,
				nodeTypes: ["SUPPLEMENT"],
				relationshipTypes: ["ENHANCES"],
				evidenceLevels: ["STRONG"],
			},
		};

		(useKnowledgeGraphStore as unknown as vi.Mock).mockReturnValue(
			filteredStore,
		);

		render(<AccessibleGraphLegend />);

		const supplementButton = screen.getByRole("switch", {
			name: /filtruj po typie suplement/i,
		});
		const enhancesButton = screen.getByRole("switch", {
			name: /filtruj po relacji wzmacnia/i,
		});
		const strongButton = screen.getByRole("switch", {
			name: /filtruj po poziomie dowodów strong/i,
		});

		// Check that buttons reflect active state
		expect(supplementButton).toHaveAttribute("aria-checked", "true");
		expect(enhancesButton).toHaveAttribute("aria-checked", "true");
		expect(strongButton).toHaveAttribute("aria-checked", "true");
	});

	it("provides proper labeling for screen readers", () => {
		render(<AccessibleGraphLegend />);

		// Check that aria labels are present
		const supplementButton = screen.getByRole("switch", {
			name: /filtruj po typie suplement/i,
		});
		const enhancesButton = screen.getByRole("switch", {
			name: /filtruj po relacji wzmacnia/i,
		});

		expect(supplementButton).toHaveAttribute("aria-label");
		expect(enhancesButton).toHaveAttribute("aria-label");
	});

	it("uses proper semantic HTML structure", () => {
		render(<AccessibleGraphLegend />);

		// Check for proper heading hierarchy
		const headings = screen.getAllByRole("heading");
		expect(headings.length).toBeGreaterThanOrEqual(3);

		// Check for proper list structure
		const lists = screen.getAllByRole("list");
		expect(lists.length).toBeGreaterThanOrEqual(1);

		// Check for proper list items
		const listItems = screen.getAllByRole("listitem");
		expect(listItems.length).toBeGreaterThanOrEqual(1);
	});
});
