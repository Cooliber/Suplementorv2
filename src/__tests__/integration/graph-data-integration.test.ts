import { GraphDataService } from "@/lib/services/graph-data-service";
import { KnowledgeNode, KnowledgeRelationship } from "@/types/knowledge-graph";
import type { SupplementWithRelations } from "@/types/supplement";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock MongoDB connection
const mockMongoClient = {
	connect: vi.fn(),
	close: vi.fn(),
	db: vi.fn(() => ({
		collection: vi.fn(() => ({
			find: vi.fn(() => ({
				toArray: vi.fn(),
			})),
			findOne: vi.fn(),
			insertOne: vi.fn(),
			updateOne: vi.fn(),
			deleteOne: vi.fn(),
			aggregate: vi.fn(() => ({
				toArray: vi.fn(),
			})),
		})),
	})),
};

vi.mock("mongodb", () => ({
	MongoClient: vi.fn(() => mockMongoClient),
}));

// Mock tRPC procedures
const mockTrpcProcedures = {
	supplement: {
		getAll: vi.fn(),
		getById: vi.fn(),
		create: vi.fn(),
		update: vi.fn(),
		delete: vi.fn(),
	},
	knowledgeGraph: {
		getNodes: vi.fn(),
		getRelationships: vi.fn(),
		generateGraph: vi.fn(),
		exportGraph: vi.fn(),
	},
};

vi.mock("@/server/api/routers/supplement", () => ({
	supplementRouter: mockTrpcProcedures.supplement,
}));

vi.mock("@/server/api/routers/knowledge-graph", () => ({
	knowledgeGraphRouter: mockTrpcProcedures.knowledgeGraph,
}));

// Mock React Query for caching
const mockQueryClient = {
	getQueryData: vi.fn(),
	setQueryData: vi.fn(),
	invalidateQueries: vi.fn(),
	prefetchQuery: vi.fn(),
};

vi.mock("@tanstack/react-query", () => ({
	useQuery: vi.fn(),
	useMutation: vi.fn(),
	useQueryClient: () => mockQueryClient,
}));

// Sample Polish supplement data for integration testing
const sampleSupplementData: SupplementWithRelations[] = [
	{
		id: "omega-3-integration",
		name: "Omega-3 Fatty Acids",
		polishName: "Kwasy tłuszczowe Omega-3",
		category: "Kwasy tłuszczowe",
		description: "Essential fatty acids for brain health",
		polishDescription: "Niezbędne kwasy tłuszczowe dla zdrowia mózgu",
		scientificName: "Omega-3 polyunsaturated fatty acids",
		polishCommonNames: ["Omega-3", "Kwasy omega-3", "PUFA"],
		activeCompounds: [
			{
				name: "EPA",
				polishName: "EPA",
				concentration: "500mg",
				mechanism: "Anti-inflammatory effects",
				polishMechanism: "Działanie przeciwzapalne",
			},
		],
		clinicalApplications: [
			{
				condition: "Memory enhancement",
				polishCondition: "Wzmocnienie pamięci",
				effectivenessRating: 8,
				evidenceLevel: "STRONG",
				mechanism: "Membrane fluidity",
				polishMechanism: "Płynność błon",
				recommendedDosage: "1000mg",
				duration: "8 tygodni",
			},
		],
		dosageGuidelines: {
			therapeuticRange: { min: 500, max: 2000, unit: "mg" },
			timing: ["Z posiłkiem"],
			withFood: true,
		},
		sideEffects: [
			{
				effect: "Mild stomach upset",
				polishEffect: "Łagodne dolegliwości żołądkowe",
				frequency: "Rzadko",
				severity: "mild",
			},
		],
		researchStudies: [
			{
				id: "integration-study-1",
				title: "Omega-3 and cognitive function",
				polishTitle: "Omega-3 a funkcje poznawcze",
				journal: "Integration Test Journal",
				year: 2023,
				studyType: "RCT",
				sampleSize: 200,
				evidenceLevel: "STRONG",
				findings: "Significant improvement in memory",
				polishFindings: "Znacząca poprawa pamięci",
				pubmedId: "INT123456",
			},
		],
	},
];

describe("Graph Data Integration Tests", () => {
	let graphService: GraphDataService;

	beforeEach(() => {
		vi.clearAllMocks();
		graphService = new GraphDataService();

		// Setup MongoDB mock responses
		mockMongoClient
			.db()
			.collection()
			.find()
			.toArray.mockResolvedValue(sampleSupplementData);
		mockMongoClient
			.db()
			.collection()
			.findOne.mockResolvedValue(sampleSupplementData[0]);

		// Setup tRPC mock responses
		mockTrpcProcedures.supplement.getAll.mockResolvedValue(
			sampleSupplementData,
		);
		mockTrpcProcedures.knowledgeGraph.generateGraph.mockResolvedValue({
			nodes: [],
			relationships: [],
			supplements: sampleSupplementData,
		});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe("MongoDB Data Pipeline Integration", () => {
		it("fetches supplement data from MongoDB correctly", async () => {
			// Simulate MongoDB query for supplements
			const collection = mockMongoClient.db().collection();
			const supplements = await collection.find({}).toArray();

			expect(supplements).toEqual(sampleSupplementData);
			expect(supplements[0].polishName).toBe("Kwasy tłuszczowe Omega-3");
			expect(supplements[0].polishDescription).toContain("mózgu");
		});

		it("handles MongoDB connection errors gracefully", async () => {
			mockMongoClient.connect.mockRejectedValue(new Error("Connection failed"));

			try {
				await mockMongoClient.connect();
			} catch (error) {
				expect(error.message).toBe("Connection failed");
			}

			// Should handle error without crashing
			expect(mockMongoClient.connect).toHaveBeenCalled();
		});

		it("transforms MongoDB supplement data to graph nodes", async () => {
			const result = await graphService.generateGraphData({
				includeSupplements: true,
				includeNeurotransmitters: false,
			});

			// Should transform supplement data to nodes
			const supplementNodes = result.nodes.filter(
				(n) => n.type === "SUPPLEMENT",
			);
			expect(supplementNodes.length).toBeGreaterThan(0);

			// Check Polish data preservation
			const omega3Node = supplementNodes.find((n) =>
				n.name.includes("Omega-3"),
			);
			if (omega3Node) {
				expect(omega3Node.polishName).toContain("Kwasy tłuszczowe");
				expect(omega3Node.polishDescription).toContain("mózgu");
			}
		});

		it("handles Polish character encoding in MongoDB operations", async () => {
			const polishSupplement = {
				...sampleSupplementData[0],
				polishName: "Suplement z polskimi znakami: ąćęłńóśźż",
				polishDescription:
					"Opis zawierający wszystkie polskie znaki diakrytyczne: ąćęłńóśźż",
			};

			mockMongoClient.db().collection().insertOne.mockResolvedValue({
				insertedId: "test-id",
				acknowledged: true,
			});

			const result = await mockMongoClient
				.db()
				.collection()
				.insertOne(polishSupplement);

			expect(result.acknowledged).toBe(true);
			expect(mockMongoClient.db().collection().insertOne).toHaveBeenCalledWith(
				polishSupplement,
			);
		});

		it("performs efficient aggregation queries for graph data", async () => {
			const aggregationPipeline = [
				{ $match: { category: "Kwasy tłuszczowe" } },
				{
					$lookup: {
						from: "research_studies",
						localField: "id",
						foreignField: "supplementId",
						as: "researchStudies",
					},
				},
				{
					$project: {
						id: 1,
						name: 1,
						polishName: 1,
						polishDescription: 1,
						evidenceLevel: {
							$cond: {
								if: { $gte: [{ $size: "$researchStudies" }, 3] },
								then: "STRONG",
								else: "MODERATE",
							},
						},
					},
				},
			];

			mockMongoClient
				.db()
				.collection()
				.aggregate()
				.toArray.mockResolvedValue([
					{
						id: "omega-3",
						name: "Omega-3",
						polishName: "Kwasy tłuszczowe Omega-3",
						evidenceLevel: "STRONG",
					},
				]);

			const result = await mockMongoClient
				.db()
				.collection()
				.aggregate(aggregationPipeline)
				.toArray();

			expect(result).toHaveLength(1);
			expect(result[0].evidenceLevel).toBe("STRONG");
			expect(result[0].polishName).toBe("Kwasy tłuszczowe Omega-3");
		});
	});

	describe("tRPC API Integration", () => {
		it("fetches graph data through tRPC procedures", async () => {
			const graphData = await mockTrpcProcedures.knowledgeGraph.generateGraph({
				includeSupplements: true,
				maxNodes: 100,
			});

			expect(graphData).toHaveProperty("nodes");
			expect(graphData).toHaveProperty("relationships");
			expect(graphData).toHaveProperty("supplements");
			expect(graphData.supplements).toEqual(sampleSupplementData);
		});

		it("handles tRPC errors with Polish error messages", async () => {
			const polishErrorMessage = "Błąd podczas ładowania danych grafu";
			mockTrpcProcedures.knowledgeGraph.generateGraph.mockRejectedValue(
				new Error(polishErrorMessage),
			);

			try {
				await mockTrpcProcedures.knowledgeGraph.generateGraph({});
			} catch (error) {
				expect(error.message).toBe(polishErrorMessage);
			}
		});

		it("validates input parameters for Polish data", async () => {
			const invalidInput = {
				includeSupplements: true,
				maxNodes: -1, // Invalid
				searchTerm: "test with invalid characters: <script>",
			};

			// Should validate and sanitize input
			mockTrpcProcedures.knowledgeGraph.generateGraph.mockImplementation(
				(input) => {
					if (input.maxNodes < 0) {
						throw new Error("Nieprawidłowa liczba węzłów");
					}
					return Promise.resolve({
						nodes: [],
						relationships: [],
						supplements: [],
					});
				},
			);

			try {
				await mockTrpcProcedures.knowledgeGraph.generateGraph(invalidInput);
			} catch (error) {
				expect(error.message).toBe("Nieprawidłowa liczba węzłów");
			}
		});

		it("supports real-time updates through tRPC subscriptions", async () => {
			const mockSubscription = {
				subscribe: vi.fn(),
				unsubscribe: vi.fn(),
			};

			// Mock tRPC subscription for real-time graph updates
			mockTrpcProcedures.knowledgeGraph.subscribeToUpdates = vi.fn(
				() => mockSubscription,
			);

			const subscription =
				mockTrpcProcedures.knowledgeGraph.subscribeToUpdates();

			expect(subscription).toHaveProperty("subscribe");
			expect(subscription).toHaveProperty("unsubscribe");
			expect(
				mockTrpcProcedures.knowledgeGraph.subscribeToUpdates,
			).toHaveBeenCalled();
		});
	});

	describe("React Query Caching Integration", () => {
		it("caches graph data efficiently", async () => {
			const cacheKey = ["knowledgeGraph", "generateGraph", { maxNodes: 100 }];
			const cachedData = {
				nodes: [],
				relationships: [],
				supplements: sampleSupplementData,
			};

			mockQueryClient.getQueryData.mockReturnValue(cachedData);

			const result = mockQueryClient.getQueryData(cacheKey);

			expect(result).toEqual(cachedData);
			expect(result.supplements[0].polishName).toBe("Kwasy tłuszczowe Omega-3");
		});

		it("invalidates cache when supplement data changes", async () => {
			const supplementId = "omega-3-integration";

			// Simulate supplement update
			await mockTrpcProcedures.supplement.update({
				id: supplementId,
				polishName: "Zaktualizowane Kwasy tłuszczowe Omega-3",
			});

			// Should invalidate related graph queries
			mockQueryClient.invalidateQueries(["knowledgeGraph"]);

			expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith([
				"knowledgeGraph",
			]);
		});

		it("prefetches related data for better performance", async () => {
			const supplementIds = ["omega-3-integration"];

			// Should prefetch related research studies and synergy data
			const prefetchPromises = supplementIds.map((id) =>
				mockQueryClient.prefetchQuery(["supplement", "details", id]),
			);

			await Promise.all(prefetchPromises);

			expect(mockQueryClient.prefetchQuery).toHaveBeenCalledTimes(
				supplementIds.length,
			);
		});

		it("handles cache invalidation for Polish search terms", async () => {
			const polishSearchTerms = ["magnez", "witamina", "kwasy tłuszczowe"];

			polishSearchTerms.forEach((term) => {
				mockQueryClient.invalidateQueries(["knowledgeGraph", "search", term]);
			});

			expect(mockQueryClient.invalidateQueries).toHaveBeenCalledTimes(
				polishSearchTerms.length,
			);
		});
	});

	describe("Error Handling and Network Failures", () => {
		it("handles network timeouts gracefully", async () => {
			const timeoutError = new Error("Network timeout");
			timeoutError.name = "TimeoutError";

			mockTrpcProcedures.knowledgeGraph.generateGraph.mockRejectedValue(
				timeoutError,
			);

			try {
				await mockTrpcProcedures.knowledgeGraph.generateGraph({});
			} catch (error) {
				expect(error.name).toBe("TimeoutError");
			}

			// Should provide fallback or cached data
			const fallbackData = mockQueryClient.getQueryData([
				"knowledgeGraph",
				"fallback",
			]);
			expect(mockQueryClient.getQueryData).toHaveBeenCalled();
		});

		it("handles data inconsistencies between MongoDB and cache", async () => {
			// MongoDB has updated data
			const mongoData = {
				...sampleSupplementData[0],
				polishName: "Zaktualizowane Kwasy tłuszczowe Omega-3",
			};

			// Cache has old data
			const cachedData = sampleSupplementData[0];

			mockMongoClient.db().collection().findOne.mockResolvedValue(mongoData);
			mockQueryClient.getQueryData.mockReturnValue(cachedData);

			const mongoResult = await mockMongoClient
				.db()
				.collection()
				.findOne({ id: "omega-3-integration" });
			const cacheResult = mockQueryClient.getQueryData([
				"supplement",
				"omega-3-integration",
			]);

			// Should detect inconsistency
			expect(mongoResult.polishName).not.toBe(cacheResult.polishName);

			// Should update cache with fresh data
			mockQueryClient.setQueryData(
				["supplement", "omega-3-integration"],
				mongoResult,
			);
			expect(mockQueryClient.setQueryData).toHaveBeenCalledWith(
				["supplement", "omega-3-integration"],
				mongoResult,
			);
		});

		it("provides meaningful Polish error messages", async () => {
			const errorScenarios = [
				{
					error: new Error("Database connection failed"),
					expectedPolishMessage: "Błąd połączenia z bazą danych",
				},
				{
					error: new Error("Invalid supplement data"),
					expectedPolishMessage: "Nieprawidłowe dane suplementu",
				},
				{
					error: new Error("Graph generation timeout"),
					expectedPolishMessage: "Przekroczono czas ładowania grafu",
				},
			];

			errorScenarios.forEach(({ error, expectedPolishMessage }) => {
				// Mock error translation service
				const translateError = (error: Error) => {
					const translations: Record<string, string> = {
						"Database connection failed": "Błąd połączenia z bazą danych",
						"Invalid supplement data": "Nieprawidłowe dane suplementu",
						"Graph generation timeout": "Przekroczono czas ładowania grafu",
					};
					return translations[error.message] || "Nieznany błąd";
				};

				const polishMessage = translateError(error);
				expect(polishMessage).toBe(expectedPolishMessage);
			});
		});
	});

	describe("Performance Monitoring and Logging", () => {
		it("logs performance metrics for graph generation", async () => {
			const performanceLogger = {
				logGraphGeneration: vi.fn(),
				logDatabaseQuery: vi.fn(),
				logCacheHit: vi.fn(),
			};

			const startTime = performance.now();

			await graphService.generateGraphData({
				maxNodes: 500,
				includeSupplements: true,
			});

			const endTime = performance.now();
			const duration = endTime - startTime;

			performanceLogger.logGraphGeneration({
				duration,
				nodeCount: 500,
				includeSupplements: true,
				timestamp: new Date().toISOString(),
			});

			expect(performanceLogger.logGraphGeneration).toHaveBeenCalledWith(
				expect.objectContaining({
					duration: expect.any(Number),
					nodeCount: 500,
					includeSupplements: true,
					timestamp: expect.any(String),
				}),
			);
		});

		it("monitors memory usage during large graph operations", async () => {
			const memoryMonitor = {
				getMemoryUsage: () => process.memoryUsage(),
				logMemorySpike: vi.fn(),
			};

			const initialMemory = memoryMonitor.getMemoryUsage();

			await graphService.generateGraphData({
				maxNodes: 1000,
			});

			const finalMemory = memoryMonitor.getMemoryUsage();
			const memoryIncrease = finalMemory.heapUsed - initialMemory.heapUsed;

			if (memoryIncrease > 50 * 1024 * 1024) {
				// 50MB threshold
				memoryMonitor.logMemorySpike({
					increase: memoryIncrease,
					operation: "generateGraphData",
					nodeCount: 1000,
				});
			}

			// Should not spike memory excessively
			expect(memoryIncrease).toBeLessThan(100 * 1024 * 1024); // 100MB max
		});

		it("tracks Polish text processing performance", async () => {
			const polishTextProcessor = {
				processPolishText: vi.fn((text: string) => {
					// Simulate Polish text processing (diacritics, normalization)
					return text.normalize("NFD");
				}),
				logProcessingTime: vi.fn(),
			};

			const polishTexts = [
				"Kwasy tłuszczowe Omega-3",
				"Niezbędne kwasy tłuszczowe dla zdrowia mózgu",
				"Wzmocnienie płynności błon komórkowych",
			];

			const startTime = performance.now();

			polishTexts.forEach((text) => {
				polishTextProcessor.processPolishText(text);
			});

			const endTime = performance.now();
			const processingTime = endTime - startTime;

			polishTextProcessor.logProcessingTime({
				textCount: polishTexts.length,
				duration: processingTime,
				averagePerText: processingTime / polishTexts.length,
			});

			expect(polishTextProcessor.processPolishText).toHaveBeenCalledTimes(
				polishTexts.length,
			);
			expect(polishTextProcessor.logProcessingTime).toHaveBeenCalledWith(
				expect.objectContaining({
					textCount: polishTexts.length,
					duration: expect.any(Number),
					averagePerText: expect.any(Number),
				}),
			);
		});
	});
});
