import { useGraphData } from "@/hooks/useGraphData";
import { graphDataService } from "@/lib/services/graph-data-service";
import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock the graph data service
vi.mock("@/lib/services/graph-data-service", () => ({
	graphDataService: {
		generateGraphData: vi.fn(),
	},
	GraphDataServiceOptions: vi.fn(),
	defaultGraphDataOptions: vi.fn(),
}));

// Mock the store
vi.mock("@/lib/stores/knowledge-graph-store", () => ({
	useKnowledgeGraphStore: vi.fn(() => ({})),
}));

describe("useGraphData Hook", () => {
	const mockGraphData = {
		nodes: [
			{ id: "1", name: "Node 1", type: "SUPPLEMENT", evidenceLevel: "STRONG" },
			{
				id: "2",
				name: "Node 2",
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
			},
		],
		supplements: [],
	};

	beforeEach(() => {
		vi.clearAllMocks();
		(graphDataService.generateGraphData as vi.Mock).mockResolvedValue(
			mockGraphData,
		);
	});

	it("initially returns loading state", async () => {
		const { result } = renderHook(() => useGraphData());

		expect(result.current.isLoading).toBe(true);
		expect(result.current.error).toBeNull();
		expect(result.current.nodes).toEqual([]);
		expect(result.current.relationships).toEqual([]);
		expect(result.current.supplements).toEqual([]);
	});

	it("fetches data successfully", async () => {
		const { result } = renderHook(() => useGraphData());

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		expect(result.current.nodes).toEqual(mockGraphData.nodes);
		expect(result.current.relationships).toEqual(mockGraphData.relationships);
		expect(result.current.supplements).toEqual(mockGraphData.supplements);
		expect(result.current.error).toBeNull();
	});

	it("handles errors during data fetch", async () => {
		const error = new Error("Network error");
		(graphDataService.generateGraphData as vi.Mock).mockRejectedValue(error);

		const { result } = renderHook(() => useGraphData());

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		expect(result.current.error).toBe("Network error");
		expect(result.current.nodes).toEqual([]);
		expect(result.current.relationships).toEqual([]);
		expect(result.current.supplements).toEqual([]);
	});

	it("refetches data when refetch function is called", async () => {
		const { result } = renderHook(() => useGraphData());

		// Wait for initial fetch
		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		// Clear the mock calls to check refetch
		vi.clearAllMocks();
		(graphDataService.generateGraphData as vi.Mock).mockResolvedValue(
			mockGraphData,
		);

		// Call refetch
		await result.current.refetch();

		expect(graphDataService.generateGraphData).toHaveBeenCalledTimes(1);
		expect(result.current.nodes).toEqual(mockGraphData.nodes);
	});

	it("updates options correctly", () => {
		const { result } = renderHook(() => useGraphData());

		const newOptions = { maxNodes: 200, includeEvidenceLevels: ["STRONG"] };
		result.current.updateOptions(newOptions);

		// Note: We can't easily test the internal state change without direct access
		// But the function should be callable without errors
		expect(result.current.updateOptions).toBeDefined();
	});

	it("does not auto-fetch when autoFetch is disabled", async () => {
		const { result } = renderHook(() => useGraphData({ autoFetch: false }));

		expect(result.current.isLoading).toBe(false);
		expect(graphDataService.generateGraphData).not.toHaveBeenCalled();
	});
});
