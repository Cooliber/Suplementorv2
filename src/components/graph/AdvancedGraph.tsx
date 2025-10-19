"use client";

import { Group } from "@visx/group";
import { Graph } from "@visx/network";
import { scaleOrdinal } from "@visx/scale";
import { Circle } from "@visx/shape";
import React from "react";
import { links, nodes } from "../../data/mock-graph-data";

const AdvancedGraph = () => {
	// Add positional data to nodes
	const nodesWithPositions = nodes.map((node, index) => ({
		...node,
		x: 200 + (index % 2) * 400, // Alternate between left and right
		y: 150 + Math.floor(index / 2) * 150, // Stack vertically
	}));

	// Convert string links to node references
	const linksWithNodes = links.map((link) => ({
		...link,
		source:
			nodesWithPositions.find((n) => n.id === link.source) ||
			nodesWithPositions[0],
		target:
			nodesWithPositions.find((n) => n.id === link.target) ||
			nodesWithPositions[0],
	}));

	const graph = {
		nodes: nodesWithPositions,
		links: linksWithNodes,
	};

	const colorScale = scaleOrdinal({
		domain: nodesWithPositions.map((n) => n.id),
		range: ["#3B82F6", "#10B981", "#8B5CF6", "#F59E0B"],
	});

	return (
		<svg width={800} height={600}>
			<Graph
				graph={graph}
				nodeComponent={({ node }) => (
					<Circle
						cx={(node as any).x}
						cy={(node as any).y}
						r={15}
						fill={colorScale((node as any).id)}
					/>
				)}
				linkComponent={({ link }) => (
					<line
						x1={(link as any).source.x}
						y1={(link as any).source.y}
						x2={(link as any).target.x}
						y2={(link as any).target.y}
						strokeWidth={2}
						stroke="#999"
					/>
				)}
			/>
		</svg>
	);
};

export default AdvancedGraph;
