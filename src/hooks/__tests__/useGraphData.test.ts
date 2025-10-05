import type {
	KnowledgeNode,
	KnowledgeRelationship,
} from "@/types/knowledge-graph";
import type { SupplementWithRelations } from "@/types/supplement";
import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
	useFilteredGraphData,
	useGraphData,
	useNodeSelection,
	useRealtimeGraphData,
} from "../useGraphData";

// Mock performance.now for performance testing
global.performance = {
	...global.performance,
	now: vi.fn(() => Date.now()),
};

// Mock timers for real-time testing
vi.useFakeTimers();

// Mock the graph data service with comprehensive Polish data
const mockGenerateGraphData = vi.fn();
const mockGraphDataService = {
	generateGraphData: mockGenerateGraphData,
};

vi.mock("@/lib/services/graph-data-service", () => ({
	graphDataService: mockGraphDataService,
	defaultGraphDataOptions: {
		includeSupplements: true,
		includeNeurotransmitters: true,
		includeBrainRegions: true,
		includeCognitiveFunctions: true,
		includePathways: true,
		includeMechanisms: true,
		minEvidenceLevel: "WEAK",
		maxNodes: 500,
	},
}));

// Polish test data with comprehensive coverage
const polishNodes: KnowledgeNode[] = [
	{
		id: "omega-3",
		name: "Omega-3 Fatty Acids",
		polishName: "Kwasy tłuszczowe Omega-3",
		type: "SUPPLEMENT",
		description: "Essential fatty acids for brain health",
		polishDescription: "Niezbędne kwasy tłuszczowe dla zdrowia mózgu",
		category: "Kwasy tłuszczowe",
		evidenceLevel: "STRONG",
		size: 12,
		importance: 0.9,
		x: 100,
		y: 100,
	},
	{
		id: "magnesium",
		name: "Magnesium",
		polishName: "Magnez",
		type: "SUPPLEMENT",
		description: "Essential mineral for nervous system",
		polishDescription: "Niezbędny minerał dla układu nerwowego",
		category: "Minerały",
		evidenceLevel: "MODERATE",
		size: 10,
		importance: 0.8,
		x: 200,
		y: 200,
	},
	{
		id: "dopamine",
		name: "Dopamine",
		polishName: "Dopamina",
		type: "NEUROTRANSMITTER",
		description: "Neurotransmitter for motivation and reward",
		polishDescription: "Neuroprzekaźnik odpowiedzialny za motywację i nagrodę",
		category: "Neuroprzekaźniki",
		evidenceLevel: "STRONG",
		size: 10,
		importance: 0.8,
		x: 300,
		y: 300,
	},
	{
		id: "memory",
		name: "Memory",
		polishName: "Pamięć",
		type: "COGNITIVE_FUNCTION",
		description: "Cognitive function for information storage",
		polishDescription:
			"Funkcja poznawcza odpowiedzialna za przechowywanie informacji",
		category: "Funkcje poznawcze",
		evidenceLevel: "MODERATE",
		size: 8,
		importance: 0.7,
		x: 400,
		y: 400,
	},
];

const polishRelationships: KnowledgeRelationship[] = [
	{
		id: "omega3-dopamine",
		sourceId: "omega-3",
		targetId: "dopamine",
		type: "ENHANCES",
		strength: 0.8,
		confidence: 0.9,
		mechanism: "Membrane fluidity enhancement",
		polishMechanism: "Wzmocnienie płynności błon komórkowych",
		evidenceLevel: "STRONG",
	},
	{
		id: "magnesium-memory",
		sourceId: "magnesium",
		targetId: "memory",
		type: "MODULATES",
		strength: 0.6,
		confidence: 0.7,
		mechanism: "NMDA receptor modulation",
		polishMechanism: "Modulacja receptorów NMDA",
		evidenceLevel: "MODERATE",
	},
	{
		id: "dopamine-memory",
		sourceId: "dopamine",
		targetId: "memory",
		type: "ENHANCES",
		strength: 0.7,
		confidence: 0.8,
		mechanism: "Dopaminergic pathway activation",
		polishMechanism: "Aktywacja szlaku dopaminergicznego",
		evidenceLevel: "MODERATE",
	},
];

const polishSupplements: SupplementWithRelations[] = [
	{
		id: "omega-3",
		name: "Omega-3 Fatty Acids",
		polishName: "Kwasy tłuszczowe Omega-3",
		category: "Kwasy tłuszczowe",
		description: "Essential fatty acids",
		polishDescription: "Niezbędne kwasy tłuszczowe",
		scientificName: "Omega-3 polyunsaturated fatty acids",
		polishCommonNames: ["Omega-3", "Kwasy omega-3", "PUFA"],
		activeCompounds: [
			{
				name: "EPA",
				polishName: "EPA",
				concentration: "500mg",
				mechanism: "Anti-inflammatory",
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
				id: "study1",
				title: "Omega-3 and cognitive function",
				polishTitle: "Omega-3 a funkcje poznawcze",
				journal: "Neuroscience Journal",
				year: 2023,
				studyType: "RCT",
				sampleSize: 200,
				evidenceLevel: "STRONG",
				findings: "Significant improvement in memory",
				polishFindings: "Znacząca poprawa pamięci",
				pubmedId: "12345678",
			},
		],
	},
];

describe("useGraphData - Comprehensive Tests", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockGenerateGraphData.mockResolvedValue({
			nodes: polishNodes,
			relationships: polishRelationships,
			supplements: polishSupplements,
		});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe("Data Fetching and Caching", () => {
		it("fetches data automatically when autoFetch is true", async () => {
			const { result } = renderHook(() => useGraphData({ autoFetch: true }));

			expect(result.current.isLoading).toBe(true);
			expect(result.current.nodes).toEqual([]);
			expect(result.current.relationships).toEqual([]);

			await waitFor(() => {
				expect(result.current.isLoading).toBe(false);
			});

			expect(result.current.nodes).toEqual(polishNodes);
			expect(result.current.relationships).toEqual(polishRelationships);
			expect(result.current.supplements).toEqual(polishSupplements);
			expect(mockGenerateGraphData).toHaveBeenCalledTimes(1);
		});

		it("does not fetch data automatically when autoFetch is false", async () => {
			const { result } = renderHook(() => useGraphData({ autoFetch: false }));

			expect(result.current.isLoading).toBe(false);
			expect(result.current.nodes).toEqual([]);
			expect(result.current.relationships).toEqual([]);
			expect(mockGenerateGraphData).not.toHaveBeenCalled();
		});

		it("caches data between re-renders", async () => {
			const { result, rerender } = renderHook(() =>
				useGraphData({ autoFetch: true }),
			);

			await waitFor(() => {
				expect(result.current.isLoading).toBe(false);
			});

			const initialNodes = result.current.nodes;
			const initialRelationships = result.current.relationships;

			rerender();

			expect(result.current.nodes).toBe(initialNodes);
			expect(result.current.relationships).toBe(initialRelationships);
			expect(mockGenerateGraphData).toHaveBeenCalledTimes(1); // Should not refetch
		});

		it("handles concurrent fetch requests correctly", async () => {
			const { result } = renderHook(() => useGraphData({ autoFetch: false }));

			// Start multiple concurrent fetches
			const promise1 = act(async () => {
				await result.current.refetch();
			});

			const promise2 = act(async () => {
				await result.current.refetch();
			});

			await Promise.all([promise1, promise2]);

			// Should have made at least one call, but not necessarily two due to deduplication
			expect(mockGenerateGraphData).toHaveBeenCalled();
			expect(result.current.nodes).toEqual(polishNodes);
		});

		it("performs efficiently with large datasets (500+ nodes)", async () => {
			const largeNodes = Array.from({ length: 500 }, (_, i) => ({
				id: `node${i}`,
				name: `Node ${i}`,
				polishName: `Węzeł ${i}`,
				type: "SUPPLEMENT" as const,
				description: `Description ${i}`,
				polishDescription: `Opis ${i}`,
				category: "Test",
				evidenceLevel: "MODERATE" as const,
				size: 8,
				importance: 0.5,
				x: Math.random() * 800,
				y: Math.random() * 600,
			}));

			const largeRelationships = Array.from({ length: 250 }, (_, i) => ({
				id: `rel${i}`,
				sourceId: `node${i}`,
				targetId: `node${(i + 1) % 500}`,
				type: "ENHANCES" as const,
				strength: 0.5,
				confidence: 0.7,
				mechanism: `Mechanism ${i}`,
				polishMechanism: `Mechanizm ${i}`,
				evidenceLevel: "MODERATE" as const,
			}));

			mockGenerateGraphData.mockResolvedValue({
				nodes: largeNodes,
				relationships: largeRelationships,
				supplements: [],
			});

			const startTime = performance.now();
			const { result } = renderHook(() =>
				useGraphData({
					autoFetch: true,
					maxNodes: 500,
				}),
			);

			await waitFor(() => {
				expect(result.current.isLoading).toBe(false);
			});

			const endTime = performance.now();
			const loadTime = endTime - startTime;

			// Should load within 3 seconds as per requirement
			expect(loadTime).toBeLessThan(3000);
			expect(result.current.nodes).toHaveLength(500);
			expect(result.current.relationships).toHaveLength(250);
		});
	});

	describe("Error Handling", () => {
		it("handles network errors gracefully", async () => {
			const networkError = new Error("Network error");
			mockGenerateGraphData.mockRejectedValue(networkError);

			const { result } = renderHook(() => useGraphData({ autoFetch: true }));

			await waitFor(() => {
				expect(result.current.isLoading).toBe(false);
			});

			expect(result.current.error).toBe("Network error");
			expect(result.current.nodes).toEqual([]);
			expect(result.current.relationships).toEqual([]);
		});

		it("handles malformed Polish data gracefully", async () => {
			const malformedData = {
				nodes: [
					{
						id: "malformed",
						name: "Test",
						polishName: "", // Empty Polish name
						type: "SUPPLEMENT",
						description: "Test",
						// Missing polishDescription
						category: "Test",
						evidenceLevel: "MODERATE",
						size: 8,
						importance: 0.5,
						x: 100,
						y: 100,
					},
				],
				relationships: [],
				supplements: [],
			};

			mockGenerateGraphData.mockResolvedValue(malformedData);

			const { result } = renderHook(() => useGraphData({ autoFetch: true }));

			await waitFor(() => {
				expect(result.current.isLoading).toBe(false);
			});

			expect(result.current.error).toBeNull();
			expect(result.current.nodes).toHaveLength(1);
		});

		it("calls onError callback when error occurs", async () => {
			const errorMessage = "Test error";
			const onError = vi.fn();
			mockGenerateGraphData.mockRejectedValue(new Error(errorMessage));

			renderHook(() =>
				useGraphData({
					autoFetch: true,
					onError,
				}),
			);

			await waitFor(() => {
				expect(onError).toHaveBeenCalledWith(errorMessage);
			});
		});

		it("retries failed requests correctly", async () => {
			mockGenerateGraphData
				.mockRejectedValueOnce(new Error("First failure"))
				.mockResolvedValueOnce({
					nodes: polishNodes,
					relationships: polishRelationships,
					supplements: polishSupplements,
				});

			const { result } = renderHook(() => useGraphData({ autoFetch: false }));

			// First attempt should fail
			await act(async () => {
				await result.current.refetch();
			});

			expect(result.current.error).toBe("First failure");

			// Second attempt should succeed
			await act(async () => {
				await result.current.refetch();
			});

			expect(result.current.error).toBeNull();
			expect(result.current.nodes).toEqual(polishNodes);
		});
	});

	describe("Options and Configuration", () => {
		it("passes service options correctly", async () => {
			const options = {
				includeSupplements: false,
				maxNodes: 200,
				minEvidenceLevel: "STRONG" as const,
			};

			renderHook(() =>
				useGraphData({
					autoFetch: true,
					...options,
				}),
			);

			await waitFor(() => {
				expect(mockGenerateGraphData).toHaveBeenCalledWith(
					expect.objectContaining(options),
				);
			});
		});

		it("updates options correctly", async () => {
			const { result } = renderHook(() => useGraphData({ autoFetch: false }));

			act(() => {
				result.current.updateOptions({ maxNodes: 100 });
			});

			await act(async () => {
				await result.current.refetch();
			});

			expect(mockGenerateGraphData).toHaveBeenCalledWith(
				expect.objectContaining({ maxNodes: 100 }),
			);
		});

		it("merges options correctly with defaults", async () => {
			const customOptions = {
				includeSupplements: false,
				maxNodes: 300,
			};

			renderHook(() =>
				useGraphData({
					autoFetch: true,
					...customOptions,
				}),
			);

			await waitFor(() => {
				expect(mockGenerateGraphData).toHaveBeenCalledWith(
					expect.objectContaining({
						includeSupplements: false,
						maxNodes: 300,
						includeNeurotransmitters: true, // Should keep default
						minEvidenceLevel: "WEAK", // Should keep default
					}),
				);
			});
		});
	});

	describe("Callbacks and Events", () => {
		it("calls onDataLoaded callback when data is loaded", async () => {
			const onDataLoaded = vi.fn();

			renderHook(() =>
				useGraphData({
					autoFetch: true,
					onDataLoaded,
				}),
			);

			await waitFor(() => {
				expect(onDataLoaded).toHaveBeenCalledWith({
					nodes: polishNodes,
					relationships: polishRelationships,
					supplements: polishSupplements,
				});
			});
		});

		it("calls onDataLoaded with Polish data correctly", async () => {
			const onDataLoaded = vi.fn();

			renderHook(() =>
				useGraphData({
					autoFetch: true,
					onDataLoaded,
				}),
			);

			await waitFor(() => {
				expect(onDataLoaded).toHaveBeenCalled();
				const callArgs = onDataLoaded.mock.calls[0][0];
				expect(callArgs.nodes[0].polishName).toBe("Kwasy tłuszczowe Omega-3");
				expect(callArgs.relationships[0].polishMechanism).toBe(
					"Wzmocnienie płynności błon komórkowych",
				);
			});
		});

		it("does not call onDataLoaded when data loading fails", async () => {
			const onDataLoaded = vi.fn();
			mockGenerateGraphData.mockRejectedValue(new Error("Test error"));

			renderHook(() =>
				useGraphData({
					autoFetch: true,
					onDataLoaded,
				}),
			);

			await waitFor(() => {
				expect(mockGenerateGraphData).toHaveBeenCalled();
			});

			expect(onDataLoaded).not.toHaveBeenCalled();
		});
	});

	describe("Refetch Functionality", () => {
		it("refetches data when refetch is called", async () => {
			const { result } = renderHook(() => useGraphData({ autoFetch: false }));

			await act(async () => {
				await result.current.refetch();
			});

			expect(mockGenerateGraphData).toHaveBeenCalledTimes(1);
			expect(result.current.nodes).toEqual(polishNodes);
			expect(result.current.relationships).toEqual(polishRelationships);
		});

		it("refetches with new options when provided", async () => {
			const { result } = renderHook(() => useGraphData({ autoFetch: false }));

			const newOptions = { maxNodes: 50, includeSupplements: false };

			await act(async () => {
				await result.current.refetch(newOptions);
			});

			expect(mockGenerateGraphData).toHaveBeenCalledWith(
				expect.objectContaining(newOptions),
			);
		});

		it("maintains loading state during refetch", async () => {
			const { result } = renderHook(() => useGraphData({ autoFetch: false }));

			const loadingStates: boolean[] = [];

			// Monitor loading state changes
			const promise = act(async () => {
				loadingStates.push(result.current.isLoading);
				await result.current.refetch();
				loadingStates.push(result.current.isLoading);
			});

			// Should be loading during fetch
			expect(result.current.isLoading).toBe(true);

			await promise;

			// Should not be loading after fetch
			expect(result.current.isLoading).toBe(false);
		});
	});
});

describe("useFilteredGraphData - Advanced Filtering", () => {
	const filters = {
		nodeTypes: [],
		relationshipTypes: [],
		evidenceLevels: [],
		searchTerm: "",
		minStrength: 0,
		maxStrength: 1,
		maxNodes: 100,
	};

	describe("Node Filtering", () => {
		it("filters nodes by type correctly", () => {
			const filtersWithType = {
				...filters,
				nodeTypes: ["SUPPLEMENT"],
			};

			const { result } = renderHook(() =>
				useFilteredGraphData(polishNodes, polishRelationships, filtersWithType),
			);

			expect(result.current.nodes).toHaveLength(2); // omega-3 and magnesium
			expect(
				result.current.nodes.every((node) => node.type === "SUPPLEMENT"),
			).toBe(true);
		});

		it("filters nodes by Polish search term", () => {
			const filtersWithSearch = {
				...filters,
				searchTerm: "magnez",
			};

			const { result } = renderHook(() =>
				useFilteredGraphData(
					polishNodes,
					polishRelationships,
					filtersWithSearch,
				),
			);

			expect(result.current.nodes).toHaveLength(1);
			expect(result.current.nodes[0].polishName).toBe("Magnez");
		});

		it("filters nodes by Polish description", () => {
			const filtersWithSearch = {
				...filters,
				searchTerm: "neuroprzekaźnik",
			};

			const { result } = renderHook(() =>
				useFilteredGraphData(
					polishNodes,
					polishRelationships,
					filtersWithSearch,
				),
			);

			expect(result.current.nodes).toHaveLength(1);
			expect(result.current.nodes[0].id).toBe("dopamine");
		});

		it("handles Polish diacritics in search", () => {
			const filtersWithDiacritics = {
				...filters,
				searchTerm: "pamięć",
			};

			const { result } = renderHook(() =>
				useFilteredGraphData(
					polishNodes,
					polishRelationships,
					filtersWithDiacritics,
				),
			);

			expect(result.current.nodes).toHaveLength(1);
			expect(result.current.nodes[0].polishName).toBe("Pamięć");
		});

		it("filters nodes by evidence level", () => {
			const filtersWithEvidence = {
				...filters,
				evidenceLevels: ["STRONG"],
			};

			const { result } = renderHook(() =>
				useFilteredGraphData(
					polishNodes,
					polishRelationships,
					filtersWithEvidence,
				),
			);

			expect(result.current.nodes).toHaveLength(2); // omega-3 and dopamine
			expect(
				result.current.nodes.every((node) => node.evidenceLevel === "STRONG"),
			).toBe(true);
		});

		it("limits nodes when maxNodes is exceeded", () => {
			const filtersWithLimit = {
				...filters,
				maxNodes: 2,
			};

			const { result } = renderHook(() =>
				useFilteredGraphData(
					polishNodes,
					polishRelationships,
					filtersWithLimit,
				),
			);

			expect(result.current.nodes).toHaveLength(2);
			// Should prioritize by importance
			expect(result.current.nodes[0].importance).toBeGreaterThanOrEqual(
				result.current.nodes[1].importance,
			);
		});

		it("combines multiple node filters correctly", () => {
			const combinedFilters = {
				...filters,
				nodeTypes: ["SUPPLEMENT", "NEUROTRANSMITTER"],
				evidenceLevels: ["STRONG"],
				searchTerm: "omega",
			};

			const { result } = renderHook(() =>
				useFilteredGraphData(polishNodes, polishRelationships, combinedFilters),
			);

			expect(result.current.nodes).toHaveLength(1);
			expect(result.current.nodes[0].id).toBe("omega-3");
		});
	});

	describe("Relationship Filtering", () => {
		it("filters relationships by type", () => {
			const filtersWithRelType = {
				...filters,
				relationshipTypes: ["ENHANCES"],
			};

			const { result } = renderHook(() =>
				useFilteredGraphData(
					polishNodes,
					polishRelationships,
					filtersWithRelType,
				),
			);

			const enhancesRels = result.current.relationships.filter(
				(rel) => rel.type === "ENHANCES",
			);
			expect(enhancesRels).toHaveLength(2);
		});

		it("filters relationships by strength range", () => {
			const filtersWithStrength = {
				...filters,
				minStrength: 0.7,
				maxStrength: 0.9,
			};

			const { result } = renderHook(() =>
				useFilteredGraphData(
					polishNodes,
					polishRelationships,
					filtersWithStrength,
				),
			);

			expect(
				result.current.relationships.every(
					(rel) => rel.strength >= 0.7 && rel.strength <= 0.9,
				),
			).toBe(true);
		});

		it("only includes relationships between filtered nodes", () => {
			const filtersWithType = {
				...filters,
				nodeTypes: ["SUPPLEMENT"], // Only includes omega-3 and magnesium
			};

			const { result } = renderHook(() =>
				useFilteredGraphData(polishNodes, polishRelationships, filtersWithType),
			);

			// Should exclude relationships to dopamine and memory
			const nodeIds = new Set(result.current.nodes.map((n) => n.id));
			expect(
				result.current.relationships.every(
					(rel) => nodeIds.has(rel.sourceId) && nodeIds.has(rel.targetId),
				),
			).toBe(true);
		});

		it("preserves Polish relationship mechanisms", () => {
			const { result } = renderHook(() =>
				useFilteredGraphData(polishNodes, polishRelationships, filters),
			);

			const polishMechanisms = result.current.relationships.map(
				(rel) => rel.polishMechanism,
			);
			expect(polishMechanisms).toContain(
				"Wzmocnienie płynności błon komórkowych",
			);
			expect(polishMechanisms).toContain("Modulacja receptorów NMDA");
		});
	});

	describe("Performance with Large Datasets", () => {
		it("filters large datasets efficiently", () => {
			const largeNodes = Array.from({ length: 1000 }, (_, i) => ({
				id: `node${i}`,
				name: `Node ${i}`,
				polishName: `Węzeł ${i}`,
				type: (i % 2 === 0 ? "SUPPLEMENT" : "NEUROTRANSMITTER") as const,
				description: `Description ${i}`,
				polishDescription: `Opis ${i}`,
				category: "Test",
				evidenceLevel: (i % 3 === 0 ? "STRONG" : "MODERATE") as const,
				size: 8,
				importance: Math.random(),
				x: Math.random() * 800,
				y: Math.random() * 600,
			}));

			const largeRelationships = Array.from({ length: 500 }, (_, i) => ({
				id: `rel${i}`,
				sourceId: `node${i}`,
				targetId: `node${(i + 1) % 1000}`,
				type: "ENHANCES" as const,
				strength: Math.random(),
				confidence: 0.7,
				mechanism: `Mechanism ${i}`,
				polishMechanism: `Mechanizm ${i}`,
				evidenceLevel: "MODERATE" as const,
			}));

			const startTime = performance.now();

			const { result } = renderHook(() =>
				useFilteredGraphData(largeNodes, largeRelationships, {
					...filters,
					nodeTypes: ["SUPPLEMENT"],
					maxNodes: 100,
				}),
			);

			const endTime = performance.now();
			const filterTime = endTime - startTime;

			// Should filter within reasonable time
			expect(filterTime).toBeLessThan(1000);
			expect(result.current.nodes).toHaveLength(100);
			expect(
				result.current.nodes.every((node) => node.type === "SUPPLEMENT"),
			).toBe(true);
		});
	});
});

describe("useNodeSelection - Node Management", () => {
	describe("Basic Selection", () => {
		it("initializes with empty selection", () => {
			const { result } = renderHook(() =>
				useNodeSelection(polishNodes, polishRelationships),
			);

			expect(result.current.selectedNodeIds).toEqual([]);
			expect(result.current.selectedNodes).toEqual([]);
			expect(result.current.focusedNodeId).toBeNull();
			expect(result.current.focusedNode).toBeNull();
		});

		it("adds selected nodes correctly", () => {
			const { result } = renderHook(() =>
				useNodeSelection(polishNodes, polishRelationships),
			);

			act(() => {
				result.current.addSelectedNode("omega-3");
			});

			expect(result.current.selectedNodeIds).toEqual(["omega-3"]);
			expect(result.current.selectedNodes).toHaveLength(1);
			expect(result.current.selectedNodes[0].polishName).toBe(
				"Kwasy tłuszczowe Omega-3",
			);
		});

		it("does not add duplicate nodes", () => {
			const { result } = renderHook(() =>
				useNodeSelection(polishNodes, polishRelationships),
			);

			act(() => {
				result.current.addSelectedNode("omega-3");
				result.current.addSelectedNode("omega-3");
			});

			expect(result.current.selectedNodeIds).toEqual(["omega-3"]);
			expect(result.current.selectedNodes).toHaveLength(1);
		});

		it("removes selected nodes correctly", () => {
			const { result } = renderHook(() =>
				useNodeSelection(polishNodes, polishRelationships),
			);

			act(() => {
				result.current.addSelectedNode("omega-3");
				result.current.addSelectedNode("magnesium");
			});

			act(() => {
				result.current.removeSelectedNode("omega-3");
			});

			expect(result.current.selectedNodeIds).toEqual(["magnesium"]);
			expect(result.current.selectedNodes).toHaveLength(1);
			expect(result.current.selectedNodes[0].polishName).toBe("Magnez");
		});

		it("clears selection correctly", () => {
			const { result } = renderHook(() =>
				useNodeSelection(polishNodes, polishRelationships),
			);

			act(() => {
				result.current.addSelectedNode("omega-3");
				result.current.setFocusedNodeId("omega-3");
			});

			act(() => {
				result.current.clearSelection();
			});

			expect(result.current.selectedNodeIds).toEqual([]);
			expect(result.current.focusedNodeId).toBeNull();
		});
	});

	describe("Focus Management", () => {
		it("selects and focuses node correctly", () => {
			const { result } = renderHook(() =>
				useNodeSelection(polishNodes, polishRelationships),
			);

			act(() => {
				result.current.selectNode("dopamine");
			});

			expect(result.current.selectedNodeIds).toEqual(["dopamine"]);
			expect(result.current.focusedNodeId).toBe("dopamine");
			expect(result.current.focusedNode?.polishName).toBe("Dopamina");
		});

		it("finds connected nodes correctly", () => {
			const { result } = renderHook(() =>
				useNodeSelection(polishNodes, polishRelationships),
			);

			act(() => {
				result.current.setFocusedNodeId("dopamine");
			});

			expect(result.current.connectedNodes).toHaveLength(2);
			const connectedIds = result.current.connectedNodes.map((node) => node.id);
			expect(connectedIds).toContain("omega-3"); // Connected via omega3-dopamine relationship
			expect(connectedIds).toContain("memory"); // Connected via dopamine-memory relationship
		});

		it("finds selected relationships correctly", () => {
			const { result } = renderHook(() =>
				useNodeSelection(polishNodes, polishRelationships),
			);

			act(() => {
				result.current.addSelectedNode("omega-3");
				result.current.addSelectedNode("dopamine");
			});

			expect(result.current.selectedRelationships).toHaveLength(2);
			const relIds = result.current.selectedRelationships.map((rel) => rel.id);
			expect(relIds).toContain("omega3-dopamine");
			expect(relIds).toContain("dopamine-memory");
		});

		it("handles Polish node data correctly in selection", () => {
			const { result } = renderHook(() =>
				useNodeSelection(polishNodes, polishRelationships),
			);

			act(() => {
				result.current.selectNode("memory");
			});

			expect(result.current.focusedNode?.polishName).toBe("Pamięć");
			expect(result.current.focusedNode?.polishDescription).toBe(
				"Funkcja poznawcza odpowiedzialna za przechowywanie informacji",
			);
		});
	});
});

describe("useRealtimeGraphData - Real-time Updates", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("auto-refreshes data every 5 minutes", async () => {
		const { result } = renderHook(() =>
			useRealtimeGraphData({ autoFetch: true }),
		);

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		expect(mockGenerateGraphData).toHaveBeenCalledTimes(1);

		// Fast-forward 5 minutes
		act(() => {
			vi.advanceTimersByTime(5 * 60 * 1000);
		});

		await waitFor(() => {
			expect(mockGenerateGraphData).toHaveBeenCalledTimes(2);
		});
	});

	it("updates lastUpdate timestamp correctly", async () => {
		const { result } = renderHook(() =>
			useRealtimeGraphData({ autoFetch: true }),
		);

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		const initialUpdate = result.current.lastUpdate;

		await act(async () => {
			await result.current.refreshData();
		});

		expect(result.current.lastUpdate).not.toBe(initialUpdate);
		expect(result.current.lastUpdate.getTime()).toBeGreaterThan(
			initialUpdate.getTime(),
		);
	});

	it("cleans up interval on unmount", () => {
		const { unmount } = renderHook(() =>
			useRealtimeGraphData({ autoFetch: true }),
		);

		const clearIntervalSpy = vi.spyOn(global, "clearInterval");

		unmount();

		expect(clearIntervalSpy).toHaveBeenCalled();
	});
});
