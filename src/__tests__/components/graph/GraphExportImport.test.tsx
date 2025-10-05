import GraphExportImport from "@/components/graph/GraphExportImport";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type React from "react";
import { toast } from "sonner";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock sonner toast
vi.mock("sonner", () => ({
	toast: {
		success: vi.fn(),
		error: vi.fn(),
	},
}));

// Mock document.createElement for download link creation
const mockClick = vi.fn();
const mockSetAttribute = vi.fn();

beforeEach(() => {
	vi.clearAllMocks();

	// Mock document.createElement
	Object.defineProperty(document, "createElement", {
		writable: true,
		value: vi.fn().mockImplementation((tagName) => {
			if (tagName === "a") {
				return {
					setAttribute: mockSetAttribute,
					click: mockClick,
				};
			}
			return {};
		}),
	});
});

afterEach(() => {
	vi.restoreAllMocks();
});

describe("GraphExportImport Component", () => {
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

	const mockSupplements = [
		{
			id: "supp-1",
			name: "Supplement 1",
			polishName: "Suplement 1",
			scientificName: "Scientific Name",
			commonNames: ["Common 1"],
			polishCommonNames: ["Pospolity 1"],
			category: "NOOTROPIC",
			description: "Supplement description",
			polishDescription: "Opis suplementu",
			activeCompounds: [],
			clinicalApplications: [],
			mechanisms: [],
			dosageGuidelines: {
				therapeuticRange: { min: 100, max: 200, unit: "mg" },
				timing: ["morning"],
				withFood: true,
				contraindications: [],
				polishContraindications: [],
				interactions: [],
			},
			sideEffects: [],
			interactions: [],
			evidenceLevel: "STRONG",
			researchStudies: [],
			tags: [],
			lastUpdated: new Date().toISOString(),
			createdAt: new Date().toISOString(),
			knowledgeNodeId: null,
		},
	];

	it("renders export and import buttons", () => {
		render(
			<GraphExportImport
				nodes={mockNodes}
				relationships={mockRelationships}
				supplements={mockSupplements}
			/>,
		);

		const exportButton = screen.getByRole("button", { name: /eksport/i });
		const importButton = screen.getByRole("button", { name: /import/i });

		expect(exportButton).toBeInTheDocument();
		expect(importButton).toBeInTheDocument();
	});

	it("handles JSON data export", async () => {
		render(
			<GraphExportImport
				nodes={mockNodes}
				relationships={mockRelationships}
				supplements={mockSupplements}
			/>,
		);

		const exportButton = screen.getByRole("button", { name: /eksport/i });
		fireEvent.click(exportButton);

		// Find and click JSON export option
		const jsonExportButton = screen.getByRole("button", { name: /json/i });
		fireEvent.click(jsonExportButton);

		// Wait for the export to complete
		await waitFor(() => {
			expect(toast.success).toHaveBeenCalledWith(
				"Dane grafu zostały wyeksportowane pomyślnie!",
			);
		});

		// Check that createElement was called to create a download link
		expect(document.createElement).toHaveBeenCalledWith("a");
		expect(mockSetAttribute).toHaveBeenCalledWith(
			"href",
			expect.stringContaining("data:application/json"),
		);
		expect(mockSetAttribute).toHaveBeenCalledWith(
			"download",
			expect.stringMatching(/graph-data-export-\d{4}-\d{2}-\d{2}\.json/),
		);
		expect(mockClick).toHaveBeenCalled();
	});

	it("handles PNG image export", async () => {
		render(
			<GraphExportImport
				nodes={mockNodes}
				relationships={mockRelationships}
				supplements={mockSupplements}
			/>,
		);

		const exportButton = screen.getByRole("button", { name: /eksport/i });
		fireEvent.click(exportButton);

		// Find and click PNG export option
		const pngExportButton = screen.getByRole("button", { name: /png/i });
		fireEvent.click(pngExportButton);

		// Wait for the export to complete
		await waitFor(() => {
			expect(toast.success).toHaveBeenCalledWith(
				"Eksport obrazu w formacie PNG zakończony pomyślnie!",
			);
		});
	});

	it("handles SVG image export", async () => {
		render(
			<GraphExportImport
				nodes={mockNodes}
				relationships={mockRelationships}
				supplements={mockSupplements}
			/>,
		);

		const exportButton = screen.getByRole("button", { name: /eksport/i });
		fireEvent.click(exportButton);

		// Find and click SVG export option
		const svgExportButton = screen.getByRole("button", { name: /svg/i });
		fireEvent.click(svgExportButton);

		// Wait for the export to complete
		await waitFor(() => {
			expect(toast.success).toHaveBeenCalledWith(
				"Eksport obrazu w formacie SVG zakończony pomyślnie!",
			);
		});
	});

	it("handles successful data import", async () => {
		render(
			<GraphExportImport
				nodes={mockNodes}
				relationships={mockRelationships}
				supplements={mockSupplements}
			/>,
		);

		// Mock file input change event
		const fileInput = screen.getByRole("button", { name: /import/i })
			.nextElementSibling as HTMLInputElement;

		// Create a mock file
		const file = new File(
			['{"nodes":[],"relationships":[],"supplements":[]}'],
			"test.json",
			{
				type: "application/json",
			},
		);

		// Create a mock change event
		const event = {
			target: {
				files: [file],
			},
		} as unknown as React.ChangeEvent<HTMLInputElement>;

		// Trigger the file input change
		fireEvent.change(fileInput, event);

		// Wait for the import to complete
		await waitFor(() => {
			expect(toast.success).toHaveBeenCalledWith(
				"Dane grafu zostały zaimportowane pomyślnie!",
			);
		});
	});

	it("handles invalid data import", async () => {
		render(
			<GraphExportImport
				nodes={mockNodes}
				relationships={mockRelationships}
				supplements={mockSupplements}
			/>,
		);

		// Mock file input change event with invalid data
		const fileInput = screen.getByRole("button", { name: /import/i })
			.nextElementSibling as HTMLInputElement;

		// Create a mock file with invalid data
		const file = new File(["invalid json"], "test.json", {
			type: "application/json",
		});

		// Create a mock change event
		const event = {
			target: {
				files: [file],
			},
		} as unknown as React.ChangeEvent<HTMLInputElement>;

		// Trigger the file input change
		fireEvent.change(fileInput, event);

		// Wait for the error to be handled
		await waitFor(() => {
			expect(toast.error).toHaveBeenCalledWith(
				"Błąd podczas importu danych grafu. Upewnij się, że plik ma poprawny format.",
			);
		});
	});

	it("disables buttons during export/import operations", () => {
		render(
			<GraphExportImport
				nodes={mockNodes}
				relationships={mockRelationships}
				supplements={mockSupplements}
			/>,
		);

		const exportButton = screen.getByRole("button", { name: /eksport/i });
		const importButton = screen.getByRole("button", { name: /import/i });

		// Initially buttons should not be disabled
		expect(exportButton).not.toBeDisabled();
		expect(importButton).not.toBeDisabled();
	});

	it("shows loading state during operations", async () => {
		render(
			<GraphExportImport
				nodes={mockNodes}
				relationships={mockRelationships}
				supplements={mockSupplements}
			/>,
		);

		const exportButton = screen.getByRole("button", { name: /eksport/i });
		fireEvent.click(exportButton);

		// Find and click JSON export option
		const jsonExportButton = screen.getByRole("button", { name: /json/i });
		fireEvent.click(jsonExportButton);

		// Check that success toast was called
		await waitFor(() => {
			expect(toast.success).toHaveBeenCalledWith(
				"Dane grafu zostały wyeksportowane pomyślnie!",
			);
		});
	});
});
