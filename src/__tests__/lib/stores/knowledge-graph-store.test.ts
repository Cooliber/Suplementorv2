import {
	type KnowledgeGraphState,
	createKnowledgeGraphStore,
} from "@/lib/stores/knowledge-graph-store";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { create } from "zustand";

// Mock the type
vi.mock("@/types/knowledge-graph", () => ({}));

describe("KnowledgeGraphStore", () => {
	const createStore = () => create(createKnowledgeGraphStore);

	it("initializes with default values", () => {
		const useStore = createStore();
		const state = useStore.getState();

		expect(state.filters).toEqual({
			nodeTypes: [],
			relationshipTypes: [],
			evidenceLevels: [],
			searchTerm: "",
			minStrength: 0,
			maxNodes: 100,
			showLabels: true,
		});

		expect(state.selectedNodes).toEqual([]);
		expect(state.layout).toBe("force");
		expect(state.zoomLevel).toBe(1);
		expect(state.isPlaying).toBe(true);
		expect(state.highlightNode).toBeNull();
		expect(state.maxRenderNodes).toBe(500);
	});

	it("updates filters correctly", () => {
		const useStore = createStore();
		const store = useStore;

		store
			.getState()
			.setFilters({ searchTerm: "test", nodeTypes: ["SUPPLEMENT"] });

		expect(store.getState().filters).toEqual({
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
		const useStore = createStore();
		const store = useStore;

		// Set some filters
		store
			.getState()
			.setFilters({ searchTerm: "test", nodeTypes: ["SUPPLEMENT"] });

		// Verify filters are set
		expect(store.getState().filters.searchTerm).toBe("test");
		expect(store.getState().filters.nodeTypes).toEqual(["SUPPLEMENT"]);

		// Reset filters
		store.getState().resetFilters();

		// Verify filters are reset
		expect(store.getState().filters).toEqual({
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
		const useStore = createStore();
		const store = useStore;

		// Add a node
		store.getState().addSelectedNode("node-1");
		expect(store.getState().selectedNodes).toEqual(["node-1"]);

		// Add another node
		store.getState().addSelectedNode("node-2");
		expect(store.getState().selectedNodes).toEqual(["node-1", "node-2"]);

		// Remove a node
		store.getState().removeSelectedNode("node-1");
		expect(store.getState().selectedNodes).toEqual(["node-2"]);

		// Clear all nodes
		store.getState().clearSelectedNodes();
		expect(store.getState().selectedNodes).toEqual([]);
	});

	it("toggles node selection", () => {
		const useStore = createStore();
		const store = useStore;

		// Toggle to add a node
		store.getState().toggleSelectNode("node-1");
		expect(store.getState().selectedNodes).toEqual(["node-1"]);

		// Toggle to remove the same node
		store.getState().toggleSelectNode("node-1");
		expect(store.getState().selectedNodes).toEqual([]);
	});

	it("updates layout configuration", () => {
		const useStore = createStore();
		const store = useStore;

		store.getState().setLayout("radial");
		expect(store.getState().layout).toBe("radial");

		store.getState().setLayout("force");
		expect(store.getState().layout).toBe("force");
	});

	it("toggles label visibility", () => {
		const useStore = createStore();
		const store = useStore;

		// Start with labels shown
		expect(store.getState().showLabels).toBe(true);

		// Toggle to hide
		store.getState().toggleShowLabels();
		expect(store.getState().showLabels).toBe(false);

		// Toggle to show again
		store.getState().toggleShowLabels();
		expect(store.getState().showLabels).toBe(true);
	});

	it("manages play state", () => {
		const useStore = createStore();
		const store = useStore;

		// Start with playing
		expect(store.getState().isPlaying).toBe(true);

		// Toggle to pause
		store.getState().togglePlay();
		expect(store.getState().isPlaying).toBe(false);

		// Toggle to play again
		store.getState().togglePlay();
		expect(store.getState().isPlaying).toBe(true);

		// Set directly
		store.getState().setIsPlaying(false);
		expect(store.getState().isPlaying).toBe(false);
	});

	it("manages zoom level", () => {
		const useStore = createStore();
		const store = useStore;

		// Start with default zoom
		expect(store.getState().zoomLevel).toBe(1);

		// Set new zoom level
		store.getState().setZoomLevel(1.5);
		expect(store.getState().zoomLevel).toBe(1.5);

		// Reset zoom
		store.getState().resetZoom();
		expect(store.getState().zoomLevel).toBe(1);
	});

	it("manages highlighting", () => {
		const useStore = createStore();
		const store = useStore;

		// Start with no highlights
		expect(store.getState().highlightNode).toBeNull();
		expect(store.getState().highlightRelationship).toBeNull();

		// Set node highlight
		store.getState().setHighlightNode("node-1");
		expect(store.getState().highlightNode).toBe("node-1");

		// Set relationship highlight
		store.getState().setHighlightRelationship("rel-1");
		expect(store.getState().highlightRelationship).toBe("rel-1");

		// Clear highlights
		store.getState().clearHighlights();
		expect(store.getState().highlightNode).toBeNull();
		expect(store.getState().highlightRelationship).toBeNull();
	});

	it("manages node expansion", () => {
		const useStore = createStore();
		const store = useStore;

		// Initially no expanded nodes
		expect(store.getState().expandedNodes).toEqual([]);

		// Expand a node
		store.getState().expandNode("node-1");
		expect(store.getState().expandedNodes).toEqual(["node-1"]);

		// Collapse a node
		store.getState().collapseNode("node-1");
		expect(store.getState().expandedNodes).toEqual([]);

		// Toggle expansion
		store.getState().toggleNodeExpansion("node-1");
		expect(store.getState().expandedNodes).toEqual(["node-1"]);
		store.getState().toggleNodeExpansion("node-1");
		expect(store.getState().expandedNodes).toEqual([]);
	});

	it("manages physics settings", () => {
		const useStore = createStore();
		const store = useStore;

		// Start with physics enabled
		expect(store.getState().enablePhysics).toBe(true);

		// Disable physics
		store.getState().setEnablePhysics(false);
		expect(store.getState().enablePhysics).toBe(false);

		// Enable physics again
		store.getState().setEnablePhysics(true);
		expect(store.getState().enablePhysics).toBe(true);
	});
});
