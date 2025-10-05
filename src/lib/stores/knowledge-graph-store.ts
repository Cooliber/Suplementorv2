import type {
	EvidenceLevel,
	KnowledgeNode,
	KnowledgeRelationship,
	NodeType,
	RelationshipType,
} from "@/types/knowledge-graph";
import type { SupplementWithRelations } from "@/types/supplement";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type GraphLayout =
	| "force"
	| "hierarchical"
	| "circular"
	| "grid"
	| "radial"
	| "tree";
export type GraphMode = "2d" | "3d";
export type ViewMode = "overview" | "focused" | "detailed";

export interface KnowledgeGraphFilters {
	nodeTypes: NodeType[];
	relationshipTypes: RelationshipType[];
	evidenceLevels: EvidenceLevel[];
	searchTerm: string;
	minStrength: number;
	maxStrength: number;
	maxNodes: number;
	showLabels: boolean;
	showRelationshipLabels: boolean;
	minConfidence: number;
	categories: string[];
	timeRange?: {
		start: Date;
		end: Date;
	};
}

interface KnowledgeGraphState {
	// Node selection and interaction
	selectedNodes: string[];
	setSelectedNodes: (nodeIds: string[]) => void;
	addSelectedNode: (nodeId: string) => void;
	removeSelectedNode: (nodeId: string) => void;
	clearSelectedNodes: () => void;

	// Filters and search
	filters: KnowledgeGraphFilters;
	setFilters: (filters: Partial<KnowledgeGraphFilters>) => void;
	resetFilters: () => void;

	// Graph layout and visualization
	layout: GraphLayout;
	setLayout: (layout: GraphLayout) => void;
	graphMode: GraphMode;
	setGraphMode: (mode: GraphMode) => void;
	viewMode: ViewMode;
	setViewMode: (mode: ViewMode) => void;

	// Zoom and camera controls
	zoomLevel: number;
	setZoomLevel: (level: number) => void;
	resetZoom: () => void;
	cameraPosition: { x: number; y: number; z?: number };
	setCameraPosition: (position: { x: number; y: number; z?: number }) => void;

	// Animation and simulation
	isPlaying: boolean;
	togglePlay: () => void;
	setIsPlaying: (playing: boolean) => void;
	animationSpeed: number;
	setAnimationSpeed: (speed: number) => void;

	// Highlighting and focus
	highlightNode: string | null;
	setHighlightNode: (nodeId: string | null) => void;
	highlightRelationship: string | null;
	setHighlightRelationship: (relId: string | null) => void;
	focusedNode: string | null;
	setFocusedNode: (nodeId: string | null) => void;

	// Supplement-specific features
	selectedSupplements: SupplementWithRelations[];
	addSupplement: (supplement: SupplementWithRelations) => void;
	removeSupplement: (supplementId: string) => void;
	clearSupplements: () => void;

	// Graph analysis
	showClusters: boolean;
	setShowClusters: (show: boolean) => void;
	showPaths: boolean;
	setShowPaths: (show: boolean) => void;
	pathSource: string | null;
	pathTarget: string | null;
	setPathEndpoints: (source: string | null, target: string | null) => void;

	// UI state
	sidebarOpen: boolean;
	setSidebarOpen: (open: boolean) => void;
	legendOpen: boolean;
	setLegendOpen: (open: boolean) => void;
	showLabels: boolean;
	toggleShowLabels: () => void;

	// Performance settings
	enablePhysics: boolean;
	setEnablePhysics: (enable: boolean) => void;
	maxRenderNodes: number;
	setMaxRenderNodes: (max: number) => void;
}

const defaultFilters: KnowledgeGraphFilters = {
	nodeTypes: [],
	relationshipTypes: [],
	evidenceLevels: [],
	searchTerm: "",
	minStrength: 0,
	maxStrength: 1,
	maxNodes: 100,
	showLabels: true,
	showRelationshipLabels: false,
	minConfidence: 0,
	categories: [],
};

export const useKnowledgeGraphStore = create<KnowledgeGraphState>()(
	persist(
		(set, get) => ({
			// Node selection and interaction
			selectedNodes: [],
			setSelectedNodes: (nodeIds) => set({ selectedNodes: nodeIds }),
			addSelectedNode: (nodeId) =>
				set((state) => ({
					selectedNodes: state.selectedNodes.includes(nodeId)
						? state.selectedNodes
						: [...state.selectedNodes, nodeId],
				})),
			removeSelectedNode: (nodeId) =>
				set((state) => ({
					selectedNodes: state.selectedNodes.filter((id) => id !== nodeId),
				})),
			clearSelectedNodes: () => set({ selectedNodes: [] }),

			// Filters and search
			filters: defaultFilters,
			setFilters: (newFilters) =>
				set((state) => ({
					filters: { ...state.filters, ...newFilters },
				})),
			resetFilters: () => set({ filters: defaultFilters }),

			// Graph layout and visualization
			layout: "force",
			setLayout: (layout) => set({ layout }),
			graphMode: "2d",
			setGraphMode: (mode) => set({ graphMode: mode }),
			viewMode: "overview",
			setViewMode: (mode) => set({ viewMode: mode }),

			// Zoom and camera controls
			zoomLevel: 1,
			setZoomLevel: (level) =>
				set({ zoomLevel: Math.max(0.1, Math.min(10, level)) }),
			resetZoom: () => set({ zoomLevel: 1 }),
			cameraPosition: { x: 0, y: 0, z: 0 },
			setCameraPosition: (position) => set({ cameraPosition: position }),

			// Animation and simulation
			isPlaying: true,
			togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
			setIsPlaying: (playing) => set({ isPlaying: playing }),
			animationSpeed: 1,
			setAnimationSpeed: (speed) =>
				set({ animationSpeed: Math.max(0.1, Math.min(5, speed)) }),

			// Highlighting and focus
			highlightNode: null,
			setHighlightNode: (nodeId) => set({ highlightNode: nodeId }),
			highlightRelationship: null,
			setHighlightRelationship: (relId) =>
				set({ highlightRelationship: relId }),
			focusedNode: null,
			setFocusedNode: (nodeId) => set({ focusedNode: nodeId }),

			// Supplement-specific features
			selectedSupplements: [],
			addSupplement: (supplement) =>
				set((state) => ({
					selectedSupplements: state.selectedSupplements.find(
						(s) => s.id === supplement.id,
					)
						? state.selectedSupplements
						: [...state.selectedSupplements, supplement],
				})),
			removeSupplement: (supplementId) =>
				set((state) => ({
					selectedSupplements: state.selectedSupplements.filter(
						(s) => s.id !== supplementId,
					),
				})),
			clearSupplements: () => set({ selectedSupplements: [] }),

			// Graph analysis
			showClusters: false,
			setShowClusters: (show) => set({ showClusters: show }),
			showPaths: false,
			setShowPaths: (show) => set({ showPaths: show }),
			pathSource: null,
			pathTarget: null,
			setPathEndpoints: (source, target) =>
				set({ pathSource: source, pathTarget: target }),

			// UI state
			sidebarOpen: true,
			setSidebarOpen: (open) => set({ sidebarOpen: open }),
			legendOpen: true,
			setLegendOpen: (open) => set({ legendOpen: open }),
			showLabels: true,
			toggleShowLabels: () =>
				set((state) => ({ showLabels: !state.showLabels })),

			// Performance settings
			enablePhysics: true,
			setEnablePhysics: (enable) => set({ enablePhysics: enable }),
			maxRenderNodes: 500,
			setMaxRenderNodes: (max) =>
				set({ maxRenderNodes: Math.max(10, Math.min(2000, max)) }),
		}),
		{
			name: "knowledge-graph-store",
			partialize: (state) => ({
				layout: state.layout,
				graphMode: state.graphMode,
				viewMode: state.viewMode,
				filters: state.filters,
				sidebarOpen: state.sidebarOpen,
				legendOpen: state.legendOpen,
				enablePhysics: state.enablePhysics,
				maxRenderNodes: state.maxRenderNodes,
			}),
		},
	),
);
