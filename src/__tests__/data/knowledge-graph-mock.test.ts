import {
	getKnowledgeGraphData,
	mockKnowledgeData,
} from "@/data/knowledge-graph-mock";
import { describe, expect, it } from "vitest";

describe("Knowledge Graph Mock Data", () => {
	it("contains valid knowledge nodes", () => {
		const { nodes } = mockKnowledgeData;

		expect(nodes).toBeDefined();
		expect(Array.isArray(nodes)).toBe(true);
		expect(nodes.length).toBeGreaterThan(0);

		nodes.forEach((node) => {
			expect(node.id).toBeDefined();
			expect(node.name).toBeDefined();
			expect(node.polishName).toBeDefined();
			expect(node.type).toBeDefined();
			expect(node.description).toBeDefined();
			expect(node.color).toBeDefined();
			expect(node.size).toBeDefined();
			expect(node.lastUpdated).toBeDefined();
			expect(node.createdAt).toBeDefined();
		});
	});

	it("contains valid knowledge relationships", () => {
		const { relationships } = mockKnowledgeData;

		expect(relationships).toBeDefined();
		expect(Array.isArray(relationships)).toBe(true);
		expect(relationships.length).toBeGreaterThan(0);

		relationships.forEach((rel) => {
			expect(rel.id).toBeDefined();
			expect(rel.sourceId).toBeDefined();
			expect(rel.targetId).toBeDefined();
			expect(rel.type).toBeDefined();
			expect(rel.strength).toBeDefined();
			expect(rel.confidence).toBeDefined();
			expect(rel.evidenceLevel).toBeDefined();
			expect(rel.mechanism).toBeDefined();
			expect(rel.lastUpdated).toBeDefined();
			expect(rel.createdAt).toBeDefined();
		});
	});

	it("has relationships that reference valid nodes", () => {
		const { nodes, relationships } = mockKnowledgeData;
		const nodeIds = new Set(nodes.map((n) => n.id));

		relationships.forEach((rel) => {
			expect(nodeIds.has(rel.sourceId)).toBe(true);
			expect(nodeIds.has(rel.targetId)).toBe(true);
		});
	});

	it("returns data in the expected format", () => {
		const data = getKnowledgeGraphData();

		expect(data).toBeDefined();
		expect(data.nodes).toBeDefined();
		expect(data.relationships).toBeDefined();
		expect(Array.isArray(data.nodes)).toBe(true);
		expect(Array.isArray(data.relationships)).toBe(true);
	});

	it("contains expected node types", () => {
		const { nodes } = mockKnowledgeData;
		const nodeTypes = new Set(nodes.map((n) => n.type));

		// Check that we have the expected node types
		expect(nodeTypes.size).toBeGreaterThan(0);
		expect(Array.from(nodeTypes)).toContain("SUPPLEMENT");
		expect(Array.from(nodeTypes)).toContain("BRAIN_REGION");
		expect(Array.from(nodeTypes)).toContain("NEUROTRANSMITTER");
	});
});
