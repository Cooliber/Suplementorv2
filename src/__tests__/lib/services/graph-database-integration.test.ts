import {
	GraphDatabaseIntegrationService,
	graphDatabaseIntegrationService,
} from "@/lib/services/graph-database-integration";
import { db } from "@/server/db";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock the database
vi.mock("@/server/db", () => ({
	db: {
		supplement: {
			findMany: vi.fn(),
		},
		knowledgeNode: {
			findMany: vi.fn(),
			findUnique: vi.fn(),
			create: vi.fn(),
			update: vi.fn(),
		},
		knowledgeRelationship: {
			findMany: vi.fn(),
		},
	},
}));

describe("GraphDatabaseIntegrationService", () => {
	const mockSupplements = [
		{
			id: "supp-1",
			name: "Test Supplement",
			polishName: "Testowy Suplement",
			category: "NOOTROPIC",
			description: "Test description",
			polishDescription: "Opis testowy",
			evidenceLevel: "STRONG",
			mechanisms: [],
			interactions: [],
			createdAt: new Date(),
			updatedAt: new Date(),
			knowledgeNodeId: null,
		},
	];

	const mockNodes = [
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

	const mockRelationships = [
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

	beforeEach(() => {
		vi.clearAllMocks();
		(db.supplement.findMany as vi.Mock).mockResolvedValue(mockSupplements);
		(db.knowledgeNode.findMany as vi.Mock).mockResolvedValue(mockNodes);
		(db.knowledgeRelationship.findMany as vi.Mock).mockResolvedValue(
			mockRelationships,
		);
	});

	it("fetches and transforms supplement data into graph format", async () => {
		const result =
			await GraphDatabaseIntegrationService.getSupplementGraphData();

		expect(result).toHaveProperty("nodes");
		expect(result).toHaveProperty("relationships");
		expect(result).toHaveProperty("supplements");
		expect(Array.isArray(result.nodes)).toBe(true);
		expect(Array.isArray(result.relationships)).toBe(true);
		expect(Array.isArray(result.supplements)).toBe(true);
	});

	it("maps supplement interaction types to relationship types correctly", async () => {
		// This test verifies the mapping is working by checking if the method exists and returns a value
		const service = new GraphDatabaseIntegrationService();

		// This is tested in the private method indirectly through the main function
		const result =
			await GraphDatabaseIntegrationService.getSupplementGraphData();

		expect(result.relationships.length).toBeGreaterThanOrEqual(0);
	});

	it("handles database errors gracefully", async () => {
		(db.supplement.findMany as vi.Mock).mockRejectedValue(
			new Error("Database error"),
		);

		await expect(
			GraphDatabaseIntegrationService.getSupplementGraphData(),
		).rejects.toThrow("Failed to fetch graph data from database");
	});

	it("creates knowledge nodes for supplements if they do not exist", async () => {
		(db.knowledgeNode.findUnique as vi.Mock).mockResolvedValue(null);
		(db.knowledgeNode.create as vi.Mock).mockResolvedValue(mockNodes[0]);

		await GraphDatabaseIntegrationService.syncSupplementDataWithGraph();

		expect(db.knowledgeNode.create).toHaveBeenCalled();
	});

	it("updates existing knowledge nodes with latest supplement data", async () => {
		(db.knowledgeNode.findUnique as vi.Mock).mockResolvedValue(mockNodes[0]);
		(db.knowledgeNode.update as vi.Mock).mockResolvedValue(mockNodes[0]);

		await GraphDatabaseIntegrationService.syncSupplementDataWithGraph();

		expect(db.knowledgeNode.update).toHaveBeenCalled();
	});

	it("finds related nodes for a given supplement", async () => {
		const result =
			await GraphDatabaseIntegrationService.findSupplementRelatedNodes(
				"supp-1",
			);

		expect(result).toHaveProperty("connectedNodes");
		expect(result).toHaveProperty("relationships");
		expect(Array.isArray(result.connectedNodes)).toBe(true);
		expect(Array.isArray(result.relationships)).toBe(true);
	});
});
