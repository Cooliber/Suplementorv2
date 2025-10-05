// Main graph components
export {
	default as GraphDashboard,
	type GraphDashboardProps,
} from "./GraphDashboard";

export { default as D3GraphVisualization } from "./D3GraphVisualization";
export { default as CytoscapeVisualization } from "./CytoscapeVisualization";
export { default as VirtualizedGraphVisualization } from "./VirtualizedGraphVisualization";

export { default as GraphControls } from "./GraphControls";
export { default as GraphLegend } from "./GraphLegend";
export { default as AccessibleGraphLegend } from "./AccessibleGraphLegend";
export {
	default as GraphExportImport,
	type GraphExportImportProps,
} from "./GraphExportImport";

// Visualization components
export {
	default as ConnectionVisualization,
	type ConnectionVisualizationProps,
} from "./ConnectionVisualization";
export { default as NodeDetails } from "./NodeDetails";

// Re-export the existing KnowledgeGraph component for backward compatibility
export { default as KnowledgeGraph } from "./KnowledgeGraph";
