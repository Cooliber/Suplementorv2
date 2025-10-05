import ConnectionVisualization from "@/components/graph/ConnectionVisualization";
import CytoscapeVisualization from "@/components/graph/CytoscapeVisualization";
import D3GraphVisualization from "@/components/graph/D3GraphVisualization";
import GraphControls from "@/components/graph/GraphControls";
import GraphDashboard from "@/components/graph/GraphDashboard";
import GraphLegend from "@/components/graph/GraphLegend";
import VirtualizedGraphVisualization from "@/components/graph/VirtualizedGraphVisualization";
import { getKnowledgeGraphData } from "@/data/knowledge-graph-mock";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
	title: "Components/Graph",
	component: GraphDashboard,
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta<typeof GraphDashboard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Dashboard: Story = {
	args: {},
};

// D3 Graph Visualization Story
const d3Meta = {
	title: "Components/Graph/D3Graph",
	component: D3GraphVisualization,
	parameters: {
		layout: "centered",
	},
} satisfies Meta<typeof D3GraphVisualization>;

export const D3Graph: StoryObj<typeof D3GraphVisualization> = {
	render: (args) => {
		const { nodes, relationships } = getKnowledgeGraphData();
		return (
			<div style={{ width: "800px", height: "600px" }}>
				<D3GraphVisualization
					nodes={nodes}
					relationships={relationships}
					{...args}
				/>
			</div>
		);
	},
	args: {
		width: 800,
		height: 600,
		nodeSize: 10,
		linkDistance: 100,
	},
};

// Cytoscape Visualization Story
const cytoscapeMeta = {
	title: "Components/Graph/CytoscapeGraph",
	component: CytoscapeVisualization,
	parameters: {
		layout: "centered",
	},
} satisfies Meta<typeof CytoscapeVisualization>;

export const CytoscapeGraph: StoryObj<typeof CytoscapeVisualization> = {
	render: (args) => {
		const { nodes, relationships } = getKnowledgeGraphData();
		return (
			<div style={{ width: "800px", height: "600px" }}>
				<CytoscapeVisualization
					nodes={nodes}
					relationships={relationships}
					{...args}
				/>
			</div>
		);
	},
	args: {
		width: 800,
		height: 600,
		layout: "cose",
	},
};

// Virtualized Graph Visualization Story
const virtualizedMeta = {
	title: "Components/Graph/VirtualizedGraph",
	component: VirtualizedGraphVisualization,
	parameters: {
		layout: "centered",
	},
} satisfies Meta<typeof VirtualizedGraphVisualization>;

export const VirtualizedGraph: StoryObj<typeof VirtualizedGraphVisualization> =
	{
		render: (args) => {
			const { nodes, relationships } = getKnowledgeGraphData();
			return (
				<div style={{ width: "800px", height: "600px" }}>
					<VirtualizedGraphVisualization
						nodes={nodes}
						relationships={relationships}
						{...args}
					/>
				</div>
			);
		},
		args: {
			width: 800,
			height: 600,
		},
	};

// Graph Controls Story
const controlsMeta = {
	title: "Components/Graph/GraphControls",
	component: GraphControls,
	parameters: {
		layout: "centered",
	},
} satisfies Meta<typeof GraphControls>;

export const GraphControlsStory: StoryObj<typeof GraphControls> = {
	args: {},
};

// Graph Legend Story
const legendMeta = {
	title: "Components/Graph/GraphLegend",
	component: GraphLegend,
	parameters: {
		layout: "centered",
	},
} satisfies Meta<typeof GraphLegend>;

export const GraphLegendStory: StoryObj<typeof GraphLegend> = {
	args: {},
};

// Connection Visualization Story
const connectionMeta = {
	title: "Components/Graph/ConnectionVisualization",
	component: ConnectionVisualization,
	parameters: {
		layout: "centered",
	},
} satisfies Meta<typeof ConnectionVisualization>;

export const ConnectionVisualizationStory: StoryObj<
	typeof ConnectionVisualization
> = {
	render: (args) => {
		const { nodes, relationships } = getKnowledgeGraphData();
		return (
			<div style={{ width: "800px", height: "600px" }}>
				<ConnectionVisualization
					nodes={nodes}
					relationships={relationships}
					sourceNodeId={nodes[0]?.id || ""}
					{...args}
				/>
			</div>
		);
	},
	args: {
		sourceNodeId: "node-1",
	},
};
