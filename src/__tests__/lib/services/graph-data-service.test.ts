import { graphDataService } from "@/lib/services/graph-data-service";
import type {
	KnowledgeNode,
	KnowledgeRelationship,
} from "@/types/knowledge-graph";
import type { SupplementWithRelations } from "@/types/supplement";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock database access
vi.mock("@/server/db", () => ({
	db: {
		knowledgeNode: {
			findMany: vi.fn(),
		},
		knowledgeRelationship: {
			findMany: vi.fn(),
		},
		supplement: {
			findMany: vi.fn(),
		},
	},
}));

describe("GraphDataService", () => {
	const mockNodes: KnowledgeNode[] = [
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

	const mockRelationships: KnowledgeRelationship[] = [
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

	const mockSupplements: SupplementWithRelations[] = [
		{
			id: "supp-1",
			name: "Supplement 1",
			polishName: "Suplement 1",
			scientificName: "Supplement Scientific Name",
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

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("generates graph data with default options", async () => {
		const { db } = await import("@/server/db");
		(db.knowledgeNode.findMany as vi.Mock).mockResolvedValue(mockNodes);
		(db.knowledgeRelationship.findMany as vi.Mock).mockResolvedValue(
			mockRelationships,
		);
		(db.supplement.findMany as vi.Mock).mockResolvedValue(mockSupplements);

		const result = await graphDataService.generateGraphData();

		expect(result).toHaveProperty("nodes");
		expect(result).toHaveProperty("relationships");
		expect(result).toHaveProperty("supplements");
		expect(Array.isArray(result.nodes)).toBe(true);
		expect(Array.isArray(result.relationships)).toBe(true);
		expect(Array.isArray(result.supplements)).toBe(true);
	});

	it("applies filtering based on options", async () => {
		const { db } = await import("@/server/db");
		(db.knowledgeNode.findMany as vi.Mock).mockResolvedValue(mockNodes);
		(db.knowledgeRelationship.findMany as vi.Mock).mockResolvedValue(
			mockRelationships,
		);
		(db.supplement.findMany as vi.Mock).mockResolvedValue(mockSupplements);

		const options = {
			nodeTypes: ["SUPPLEMENT"],
			relationshipTypes: ["ENHANCES"],
			evidenceLevels: ["STRONG"],
			maxNodes: 50,
			includeEvidenceLevels: ["STRONG", "MODERATE"],
		};

		const result = await graphDataService.generateGraphData(options);

		// Should return filtered data
		expect(result.nodes.length).toBeLessThanOrEqual(50);
		expect(Array.isArray(result.nodes)).toBe(true);
	});

	it("handles errors gracefully", async () => {
		const { db } = await import("@/server/db");
		(db.knowledgeNode.findMany as vi.Mock).mockRejectedValue(
			new Error("Database error"),
		);

		await expect(graphDataService.generateGraphData()).rejects.toThrow(
			"Database error",
		);
	});

	it("generates data with search filtering", async () => {
		const { db } = await import("@/server/db");
		(db.knowledgeNode.findMany as vi.Mock).mockResolvedValue(mockNodes);
		(db.knowledgeRelationship.findMany as vi.Mock).mockResolvedValue(
			mockRelationships,
		);
		(db.supplement.findMany as vi.Mock).mockResolvedValue(mockSupplements);

		const options = {
			searchTerm: "test",
			maxNodes: 100,
		};

		const result = await graphDataService.generateGraphData(options);

		// Should return data even with search term
		expect(result).toHaveProperty("nodes");
		expect(result).toHaveProperty("relationships");
		expect(result).toHaveProperty("supplements");
	});

	it("respects maxNodes limit", async () => {
		const manyNodes = Array.from({ length: 100 }, (_, i) => ({
			id: `node-${i}`,
			name: `Node ${i}`,
			polishName: `Węzeł ${i}`,
			type: "SUPPLEMENT",
			description: "Description",
			polishDescription: "Opis",
			evidenceLevel: "STRONG",
			category: "NOOTROPIC",
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			x: 0,
			y: 0,
			size: 10,
			importance: 1,
		}));

		const { db } = await import("@/server/db");
		(db.knowledgeNode.findMany as vi.Mock).mockResolvedValue(manyNodes);
		(db.knowledgeRelationship.findMany as vi.Mock).mockResolvedValue(
			mockRelationships,
		);
		(db.supplement.findMany as vi.Mock).mockResolvedValue(mockSupplements);

		const options = {
			maxNodes: 10,
		};

		const result = await graphDataService.generateGraphData(options);

		// Should respect the maxNodes limit
		expect(result.nodes.length).toBeLessThanOrEqual(10);
	});
});
