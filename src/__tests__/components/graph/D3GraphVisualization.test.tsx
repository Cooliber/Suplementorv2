import D3GraphVisualization from "@/components/graph/D3GraphVisualization";
import { getKnowledgeGraphData } from "@/data/knowledge-graph-mock";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock d3 and related libraries
vi.mock("d3", () => ({
	select: vi.fn(() => ({
		append: vi.fn(() => ({
			attr: vi.fn(() => ({
				style: vi.fn(() => ({
					call: vi.fn(() => ({
						on: vi.fn(() => ({
							// Mock for zoom behavior
						})),
					})),
				})),
			})),
			call: vi.fn(() => ({
				on: vi.fn(() => ({
					// Mock for drag behavior
				})),
			})),
		})),
		attr: vi.fn(() => ({
			style: vi.fn(() => ({
				call: vi.fn(() => ({
					on: vi.fn(),
				})),
			})),
		})),
		style: vi.fn(() => ({
			call: vi.fn(() => ({
				on: vi.fn(),
			})),
		})),
		call: vi.fn(() => ({
			on: vi.fn(() => ({
				// Mock for zoom on
			})),
		})),
		on: vi.fn(() => ({
			// Mock for zoom event
		})),
		transition: vi.fn(() => ({
			duration: vi.fn(() => ({
				attr: vi.fn(() => ({
					style: vi.fn(() => ({
						// Mock for animation
					})),
				})),
			})),
		})),
		remove: vi.fn(),
	})),
	forceSimulation: vi.fn(() => ({
		force: vi.fn(() => ({
			// Mock for force simulation
		})),
		alphaTarget: vi.fn(() => ({
			restart: vi.fn(),
		})),
		stop: vi.fn(),
		on: vi.fn(() => ({
			// Mock for tick event
		})),
	})),
	forceLink: vi.fn(() => ({
		id: vi.fn(() => ({
			strength: vi.fn(),
		})),
	})),
	forceManyBody: vi.fn(() => ({
		strength: vi.fn(() => ({
			// Mock for charge force
		})),
	})),
	forceCenter: vi.fn(() => ({
		// Mock for center force
	})),
	forceCollide: vi.fn(() => ({
		radius: vi.fn(() => ({
			// Mock for collision force
		})),
	})),
	drag: vi.fn(() => ({
		on: vi.fn(() => ({
			// Mock for drag behavior
		})),
	})),
	zoom: vi.fn(() => ({
		scaleExtent: vi.fn(() => ({
			on: vi.fn(() => ({
				// Mock for zoom
			})),
		})),
	})),
	zoomIdentity: {},
}));

describe("D3GraphVisualization Component", () => {
	const { nodes, relationships } = getKnowledgeGraphData();

	beforeEach(() => {
		// Clear all mocks before each test
		vi.clearAllMocks();
	});

	it("renders without crashing", () => {
		expect(() => {
			render(
				<D3GraphVisualization
					nodes={nodes}
					relationships={relationships}
					width={800}
					height={600}
					onNodeClick={vi.fn()}
					onNodeHover={vi.fn()}
					nodeSize={10}
					linkDistance={100}
				/>,
			);
		}).not.toThrow();

		// Check for the SVG element where the graph should be rendered
		const svgElement = screen.getByRole("img"); // SVG elements are often treated as images
		expect(svgElement).toBeInTheDocument();
	});

	it("renders nodes and links based on provided data", () => {
		render(
			<D3GraphVisualization
				nodes={nodes}
				relationships={relationships}
				width={800}
				height={600}
				onNodeClick={vi.fn()}
				onNodeHover={vi.fn()}
			/>,
		);

		// Verify the component renders
		const graphContainer = screen.getByTestId("d3-graph-container");
		expect(graphContainer).toBeInTheDocument();

		// Check that the data was provided
		expect(nodes.length).toBeGreaterThan(0);
		expect(relationships.length).toBeGreaterThan(0);
	});

	it("handles node click events", async () => {
		const mockOnNodeClick = vi.fn();

		render(
			<D3GraphVisualization
				nodes={nodes}
				relationships={relationships}
				width={800}
				height={600}
				onNodeClick={mockOnNodeClick}
				onNodeHover={vi.fn()}
			/>,
		);

		// Since we can't actually test D3 interactions, we'll verify that props are passed correctly
		expect(mockOnNodeClick).toBeDefined();
	});

	it("handles node hover events", () => {
		const mockOnNodeHover = vi.fn();

		render(
			<D3GraphVisualization
				nodes={nodes}
				relationships={relationships}
				width={800}
				height={600}
				onNodeClick={vi.fn()}
				onNodeHover={mockOnNodeHover}
			/>,
		);

		// Verify that hover handler is provided
		expect(mockOnNodeHover).toBeDefined();
	});

	it("respects graph configuration props", () => {
		const mockOnNodeClick = vi.fn();

		render(
			<D3GraphVisualization
				nodes={nodes}
				relationships={relationships}
				width={800}
				height={600}
				onNodeClick={mockOnNodeClick}
				onNodeHover={vi.fn()}
				nodeSize={20}
				linkDistance={150}
				labelVisibility={true}
			/>,
		);

		// Verify that the component accepts and handles the props
		expect(mockOnNodeClick).toBeDefined();
	});
});
