import {
	type KnowledgeGraphState,
	useKnowledgeGraphStore,
} from "@/lib/stores/knowledge-graph-store";
import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

// Mock the type
vi.mock("@/types/knowledge-graph", () => ({}));

describe("KnowledgeGraphStore", () => {
	it("initializes with default values", () => {
		const { result } = renderHook(() => useKnowledgeGraphStore());

		expect(result.current.filters).toEqual({
			nodeTypes: [],
			relationshipTypes: [],
			evidenceLevels: [],
			searchTerm: "",
			minStrength: 0,
			maxNodes: 100,
			showLabels: true,
		});

		expect(result.current.selectedNodes).toEqual([]);
		expect(result.current.layout).toBe("force");
		expect(result.current.zoomLevel).toBe(1);
		expect(result.current.isPlaying).toBe(true);
		expect(result.current.highlightNode).toBeNull();
		expect(result.current.maxRenderNodes).toBe(500);
	});

	it("updates filters correctly", () => {
		const { result } = renderHook(() => useKnowledgeGraphStore());

		act(() => {
			result.current.setFilters({
				searchTerm: "test",
				nodeTypes: ["SUPPLEMENT"],
			});
		});

		expect(result.current.filters).toEqual({
			nodeTypes: ["SUPPLEMENT"],
			relationshipTypes: [],
			evidenceLevels: [],
			searchTerm: "test",
			minStrength: 0,
			maxNodes: 100,
			showLabels: true,
		});
	});

	it("resets filters to default", () => {
		const { result } = renderHook(() => useKnowledgeGraphStore());

		act(() => {
			result.current.setFilters({
				searchTerm: "test",
				nodeTypes: ["SUPPLEMENT"],
			});
		});

		expect(result.current.filters.searchTerm).toBe("test");

		act(() => {
			result.current.resetFilters();
		});

		expect(result.current.filters).toEqual({
			nodeTypes: [],
			relationshipTypes: [],
			evidenceLevels: [],
			searchTerm: "",
			minStrength: 0,
			maxNodes: 100,
			showLabels: true,
		});
	});

	it("manages selected nodes", () => {
		const { result } = renderHook(() => useKnowledgeGraphStore());

		act(() => {
			result.current.addSelectedNode("node-1");
		});
		expect(result.current.selectedNodes).toEqual(["node-1"]);

		act(() => {
			result.current.addSelectedNode("node-2");
		});
		expect(result.current.selectedNodes).toEqual(["node-1", "node-2"]);

		act(() => {
			result.current.removeSelectedNode("node-1");
		});
		expect(result.current.selectedNodes).toEqual(["node-2"]);

		act(() => {
			result.current.clearSelectedNodes();
		});
		expect(result.current.selectedNodes).toEqual([]);
	});

	it("toggles node selection", () => {
		const { result } = renderHook(() => useKnowledgeGraphStore());

		act(() => {
			result.current.toggleSelectNode("node-1");
		});
		expect(result.current.selectedNodes).toEqual(["node-1"]);

		act(() => {
			result.current.toggleSelectNode("node-1");
		});
		expect(result.current.selectedNodes).toEqual([]);
	});

	it("updates layout configuration", () => {
		const { result } = renderHook(() => useKnowledgeGraphStore());

		act(() => {
			result.current.setLayout("radial");
		});
		expect(result.current.layout).toBe("radial");
	});

	it("toggles label visibility", () => {
		const { result } = renderHook(() => useKnowledgeGraphStore());

		act(() => {
			result.current.toggleShowLabels();
		});
		expect(result.current.showLabels).toBe(false);
	});

	it("manages play state", () => {
		const { result } = renderHook(() => useKnowledgeGraphStore());

		act(() => {
			result.current.togglePlay();
		});
		expect(result.current.isPlaying).toBe(false);
	});

	it("manages zoom level", () => {
		const { result } = renderHook(() => useKnowledgeGraphStore());

		act(() => {
			result.current.setZoomLevel(1.5);
		});
		expect(result.current.zoomLevel).toBe(1.5);
	});

	it("manages highlighting", () => {
		const { result } = renderHook(() => useKnowledgeGraphStore());

		act(() => {
			result.current.setHighlightNode("node-1");
		});
		expect(result.current.highlightNode).toBe("node-1");
	});

	it("manages node expansion", () => {
		const { result } = renderHook(() => useKnowledgeGraphStore());

		act(() => {
			result.current.expandNode("node-1");
		});
		expect(result.current.expandedNodes).toEqual(["node-1"]);
	});

	it("manages physics settings", () => {
		const { result } = renderHook(() => useKnowledgeGraphStore());

		act(() => {
			result.current.setEnablePhysics(false);
		});
		expect(result.current.enablePhysics).toBe(false);
	});
});
