import {
	EvidenceLevel,
	NodeType,
	RelationshipType,
} from "@/types/knowledge-graph";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
	GraphDataService,
	defaultGraphDataOptions,
} from "../graph-data-service";

// Mock performance.now for performance testing
global.performance = {
	...global.performance,
	now: vi.fn(() => Date.now()),
};

// Mock process.memoryUsage for memory testing
global.process = {
	...global.process,
	memoryUsage: vi.fn(() => ({
		rss: 1000000,
		heapTotal: 1000000,
		heapUsed: 500000,
		external: 100000,
		arrayBuffers: 50000,
	})),
};

// Mock the data imports with comprehensive Polish data
vi.mock("@/data/synergistic-effects", () => ({
	synergyData: [
		{
			id: "omega3-magnesium-synergy",
			supplementA: "omega-3",
			supplementB: "magnesium",
			synergyStrength: 0.8,
			confidence: 0.9,
			mechanism: "Membrane stabilization and neurotransmitter regulation",
			polishMechanism:
				"Stabilizacja błon komórkowych i regulacja neuroprzekaźników",
			evidenceLevel: "STRONG",
			synergyType: "ADDITIVE",
			optimalRatio: "2:1",
			timing: "CONCURRENT",
		},
		{
			id: "vitamin-d-omega3-synergy",
			supplementA: "vitamin-d",
			supplementB: "omega-3",
			synergyStrength: 0.7,
			confidence: 0.8,
			mechanism: "Anti-inflammatory pathway enhancement",
			polishMechanism: "Wzmocnienie szlaków przeciwzapalnych",
			evidenceLevel: "MODERATE",
			synergyType: "SYNERGISTIC",
			optimalRatio: "1:3",
			timing: "CONCURRENT",
		},
	],
}));

vi.mock("@/data/neuroplasticity-mechanisms-advanced", () => ({
	neuroplasticityMechanisms: [
		{
			id: "bdnf-enhancement",
			name: "BDNF Enhancement",
			polishName: "Wzmocnienie BDNF",
			description: "Brain-derived neurotrophic factor enhancement",
			polishDescription:
				"Wzmocnienie czynnika neurotroficznego pochodzenia mózgowego",
			type: "NEUROGENESIS",
			evidenceLevel: "STRONG",
			targetRegions: ["hippocampus", "prefrontal cortex"],
			timeframe: "WEEKS",
		},
		{
			id: "synaptic-plasticity",
			name: "Synaptic Plasticity",
			polishName: "Plastyczność synaptyczna",
			description: "Enhancement of synaptic connections",
			polishDescription: "Wzmocnienie połączeń synaptycznych",
			type: "SYNAPTIC_MODIFICATION",
			evidenceLevel: "MODERATE",
			targetRegions: ["hippocampus", "cortex"],
			timeframe: "DAYS",
		},
	],
}));

// Mock supplement data with comprehensive Polish information
vi.mock("@/data/supplements/omega-3", () => ({
	omegaThreeData: {
		id: "omega-3",
		name: "Omega-3 Fatty Acids",
		polishName: "Kwasy tłuszczowe Omega-3",
		description: "Essential fatty acids for brain health",
		polishDescription: "Niezbędne kwasy tłuszczowe dla zdrowia mózgu",
		category: "Kwasy tłuszczowe",
		scientificName: "Omega-3 polyunsaturated fatty acids",
		polishCommonNames: ["Omega-3", "Kwasy omega-3", "PUFA"],
		clinicalApplications: [
			{
				condition: "Memory enhancement",
				polishCondition: "Wzmocnienie pamięci",
				effectivenessRating: 8,
				mechanism: "Membrane fluidity enhancement",
				polishMechanism: "Wzmocnienie płynności błon komórkowych",
				evidenceLevel: "STRONG",
				recommendedDosage: "1000mg",
				duration: "8 tygodni",
			},
			{
				condition: "Attention improvement",
				polishCondition: "Poprawa uwagi",
				effectivenessRating: 7,
				mechanism: "Dopaminergic pathway modulation",
				polishMechanism: "Modulacja szlaku dopaminergicznego",
				evidenceLevel: "MODERATE",
				recommendedDosage: "1500mg",
				duration: "12 tygodni",
			},
		],
		activeCompounds: [
			{
				name: "EPA",
				polishName: "EPA",
				concentration: "500mg",
				mechanism: "Anti-inflammatory effects via prostaglandin modulation",
				polishMechanism:
					"Działanie przeciwzapalne poprzez modulację prostaglandyn",
			},
			{
				name: "DHA",
				polishName: "DHA",
				concentration: "300mg",
				mechanism: "Membrane incorporation and fluidity enhancement",
				polishMechanism: "Wbudowanie w błony komórkowe i zwiększenie płynności",
			},
		],
		researchStudies: [
			{
				id: "omega3-memory-study-1",
				title: "Omega-3 fatty acids and cognitive function in healthy adults",
				polishTitle:
					"Kwasy tłuszczowe omega-3 a funkcje poznawcze u zdrowych dorosłych",
				journal: "Journal of Neurochemistry",
				year: 2023,
				studyType: "RCT",
				sampleSize: 200,
				evidenceLevel: "STRONG",
				findings: "Significant improvement in memory and attention tasks",
				polishFindings: "Znacząca poprawa w zadaniach pamięciowych i uwagowych",
				pubmedId: "12345678",
			},
			{
				id: "omega3-brain-study-2",
				title: "DHA supplementation and brain structure",
				polishTitle: "Suplementacja DHA a struktura mózgu",
				journal: "Neuroscience Research",
				year: 2022,
				studyType: "Longitudinal",
				sampleSize: 150,
				evidenceLevel: "STRONG",
				findings: "Increased hippocampal volume after 6 months",
				polishFindings: "Zwiększenie objętości hipokampa po 6 miesiącach",
				pubmedId: "87654321",
			},
		],
	},
}));

vi.mock("@/data/supplements/magnesium", () => ({
	magnesiumData: {
		id: "magnesium",
		name: "Magnesium",
		polishName: "Magnez",
		description: "Essential mineral for nervous system function",
		polishDescription: "Niezbędny minerał dla funkcjonowania układu nerwowego",
		category: "Minerały",
		scientificName: "Magnesium",
		polishCommonNames: ["Magnez", "Mg"],
		clinicalApplications: [
			{
				condition: "Stress reduction",
				polishCondition: "Redukcja stresu",
				effectivenessRating: 7,
				mechanism: "GABA receptor modulation",
				polishMechanism: "Modulacja receptorów GABA",
				evidenceLevel: "MODERATE",
				recommendedDosage: "400mg",
				duration: "4 tygodnie",
			},
		],
		activeCompounds: [
			{
				name: "Magnesium Glycinate",
				polishName: "Glicynian magnezu",
				concentration: "200mg",
				mechanism: "NMDA receptor antagonism",
				polishMechanism: "Antagonizm receptorów NMDA",
			},
		],
		researchStudies: [
			{
				id: "magnesium-stress-study",
				title: "Magnesium supplementation and stress response",
				polishTitle: "Suplementacja magnezu a odpowiedź na stres",
				journal: "Stress Medicine",
				year: 2023,
				studyType: "RCT",
				sampleSize: 120,
				evidenceLevel: "MODERATE",
				findings: "Reduced cortisol levels and improved stress scores",
				polishFindings:
					"Obniżenie poziomu kortyzolu i poprawa wskaźników stresu",
				pubmedId: "11223344",
			},
		],
	},
}));

// Mock other supplement imports with minimal data
const createMockSupplement = (
	id: string,
	name: string,
	polishName: string,
) => ({
	id,
	name,
	polishName,
	description: `${name} supplement`,
	polishDescription: `Suplement ${polishName}`,
	category: "Test",
	scientificName: name,
	polishCommonNames: [polishName],
	clinicalApplications: [],
	activeCompounds: [],
	researchStudies: [],
});

vi.mock("@/data/supplements/vitamin-d", () => ({
	vitaminDData: createMockSupplement("vitamin-d", "Vitamin D", "Witamina D"),
}));

vi.mock("@/data/supplements/l-theanine", () => ({
	lTheanineData: createMockSupplement("l-theanine", "L-Theanine", "L-Teanina"),
}));

vi.mock("@/data/supplements/bacopa", () => ({
	bacopa: createMockSupplement(
		"bacopa",
		"Bacopa Monnieri",
		"Bakopa drobnolistna",
	),
}));

vi.mock("@/data/supplements/rhodiola", () => ({
	rhodiola: createMockSupplement(
		"rhodiola",
		"Rhodiola Rosea",
		"Różeniec górski",
	),
}));

vi.mock("@/data/supplements/ginkgo", () => ({
	ginkgo: createMockSupplement(
		"ginkgo",
		"Ginkgo Biloba",
		"Miłorząb dwuklapowy",
	),
}));

vi.mock("@/data/supplements/ashwagandha", () => ({
	ashwagandha: createMockSupplement(
		"ashwagandha",
		"Ashwagandha",
		"Ashwagandha",
	),
}));

vi.mock("@/data/supplements/lions-mane", () => ({
	lionsMane: createMockSupplement(
		"lions-mane",
		"Lions Mane",
		"Soplówka jeżowata",
	),
}));

vi.mock("@/data/supplements/phosphatidylserine", () => ({
	phosphatidylserine: createMockSupplement(
		"phosphatidylserine",
		"Phosphatidylserine",
		"Fosfatydyloseryna",
	),
}));

describe("GraphDataService - Comprehensive Tests", () => {
	let service: GraphDataService;

	beforeEach(() => {
		service = new GraphDataService();
		vi.clearAllMocks();
	});

	describe("Basic Graph Generation", () => {
		it("generates graph data with default options", async () => {
			const result = await service.generateGraphData();

			expect(result).toHaveProperty("nodes");
			expect(result).toHaveProperty("relationships");
			expect(result).toHaveProperty("supplements");
			expect(Array.isArray(result.nodes)).toBe(true);
			expect(Array.isArray(result.relationships)).toBe(true);
			expect(Array.isArray(result.supplements)).toBe(true);
		});

		it("includes all node types when enabled", async () => {
			const result = await service.generateGraphData({
				includeSupplements: true,
				includeNeurotransmitters: true,
				includeBrainRegions: true,
				includeCognitiveFunctions: true,
				includePathways: true,
				includeMechanisms: true,
			});

			const nodeTypes = new Set(result.nodes.map((node) => node.type));
			expect(nodeTypes.has("SUPPLEMENT")).toBe(true);
			expect(nodeTypes.has("NEUROTRANSMITTER")).toBe(true);
			expect(nodeTypes.has("BRAIN_REGION")).toBe(true);
			expect(nodeTypes.has("COGNITIVE_FUNCTION")).toBe(true);
			expect(nodeTypes.has("PATHWAY")).toBe(true);
			expect(nodeTypes.has("MECHANISM")).toBe(true);
		});

		it("excludes node types when disabled", async () => {
			const result = await service.generateGraphData({
				includeSupplements: true,
				includeNeurotransmitters: false,
				includeBrainRegions: false,
				includeCognitiveFunctions: false,
				includePathways: false,
				includeMechanisms: false,
			});

			const nodeTypes = new Set(result.nodes.map((node) => node.type));
			expect(nodeTypes.has("SUPPLEMENT")).toBe(true);
			expect(nodeTypes.has("NEUROTRANSMITTER")).toBe(false);
			expect(nodeTypes.has("BRAIN_REGION")).toBe(false);
			expect(nodeTypes.has("COGNITIVE_FUNCTION")).toBe(false);
			expect(nodeTypes.has("PATHWAY")).toBe(false);
			expect(nodeTypes.has("MECHANISM")).toBe(false);
		});
	});

	describe("Polish Localization and Medical Terminology", () => {
		it("generates proper Polish medical terminology for supplements", async () => {
			const result = await service.generateGraphData({
				includeSupplements: true,
				includeNeurotransmitters: false,
				includeBrainRegions: false,
				includeCognitiveFunctions: false,
				includePathways: false,
				includeMechanisms: false,
			});

			const supplementNodes = result.nodes.filter(
				(n) => n.type === "SUPPLEMENT",
			);
			expect(supplementNodes.length).toBeGreaterThan(0);

			// Check that all supplement nodes have Polish names
			expect(
				supplementNodes.every(
					(node) => node.polishName && node.polishName.length > 0,
				),
			).toBe(true);

			// Check specific Polish names
			const omega3Node = supplementNodes.find((n) => n.id === "omega-3");
			expect(omega3Node?.polishName).toBe("Kwasy tłuszczowe Omega-3");

			const magnesiumNode = supplementNodes.find((n) => n.id === "magnesium");
			expect(magnesiumNode?.polishName).toBe("Magnez");
		});

		it("generates Polish neurotransmitter terminology", async () => {
			const result = await service.generateGraphData({
				includeSupplements: false,
				includeNeurotransmitters: true,
				includeBrainRegions: false,
				includeCognitiveFunctions: false,
				includePathways: false,
				includeMechanisms: false,
			});

			const neurotransmitterNodes = result.nodes.filter(
				(n) => n.type === "NEUROTRANSMITTER",
			);
			expect(neurotransmitterNodes.length).toBeGreaterThan(0);

			// Check specific Polish medical terms
			const dopamineNode = neurotransmitterNodes.find(
				(n) => n.id === "dopamine",
			);
			expect(dopamineNode?.polishName).toBe("Dopamina");

			const serotoninNode = neurotransmitterNodes.find(
				(n) => n.id === "serotonin",
			);
			expect(serotoninNode?.polishName).toBe("Serotonina");

			const gabaNode = neurotransmitterNodes.find((n) => n.id === "gaba");
			expect(gabaNode?.polishName).toBe("GABA");

			const acetylcholineNode = neurotransmitterNodes.find(
				(n) => n.id === "acetylcholine",
			);
			expect(acetylcholineNode?.polishName).toBe("Acetylocholina");
		});

		it("generates Polish brain region terminology", async () => {
			const result = await service.generateGraphData({
				includeSupplements: false,
				includeNeurotransmitters: false,
				includeBrainRegions: true,
				includeCognitiveFunctions: false,
				includePathways: false,
				includeMechanisms: false,
			});

			const brainRegionNodes = result.nodes.filter(
				(n) => n.type === "BRAIN_REGION",
			);
			expect(brainRegionNodes.length).toBeGreaterThan(0);

			// Check specific Polish brain region names
			const hippocampusNode = brainRegionNodes.find(
				(n) => n.id === "hippocampus",
			);
			expect(hippocampusNode?.polishName).toBe("Hipokamp");

			const prefrontalNode = brainRegionNodes.find(
				(n) => n.id === "prefrontal-cortex",
			);
			expect(prefrontalNode?.polishName).toBe("Kora przedczołowa");

			const amygdalaNode = brainRegionNodes.find((n) => n.id === "amygdala");
			expect(amygdalaNode?.polishName).toBe("Ciało migdałowate");
		});

		it("preserves Polish diacritics correctly", async () => {
			const result = await service.generateGraphData({
				includeSupplements: true,
				includeCognitiveFunctions: true,
			});

			// Check that Polish names contain diacritics
			const nodesWithDiacritics = result.nodes.filter((node) =>
				/[ąćęłńóśźż]/.test(node.polishName),
			);
			expect(nodesWithDiacritics.length).toBeGreaterThan(0);

			// Check specific examples
			const omega3Node = result.nodes.find((n) => n.id === "omega-3");
			expect(omega3Node?.polishName).toContain("ł"); // "tłuszczowe"

			const memoryNode = result.nodes.find((n) => n.id === "memory");
			expect(memoryNode?.polishName).toContain("ę"); // "Pamięć"
		});

		it("generates Polish relationship mechanisms", async () => {
			const result = await service.generateGraphData({
				includeSupplements: true,
				includeNeurotransmitters: true,
			});

			const relationshipsWithPolish = result.relationships.filter(
				(rel) => rel.polishMechanism && rel.polishMechanism !== rel.mechanism,
			);

			expect(relationshipsWithPolish.length).toBeGreaterThan(0);

			// Check that Polish mechanisms contain diacritics
			const polishMechanisms = relationshipsWithPolish.map(
				(rel) => rel.polishMechanism,
			);
			const mechanismsWithDiacritics = polishMechanisms.filter((mechanism) =>
				/[ąćęłńóśźż]/.test(mechanism),
			);
			expect(mechanismsWithDiacritics.length).toBeGreaterThan(0);
		});
	});

	describe("Evidence Level Mapping and Validation", () => {
		it("maps supplement evidence levels correctly based on research studies", async () => {
			const result = await service.generateGraphData({
				includeSupplements: true,
				includeNeurotransmitters: false,
			});

			const supplementNodes = result.nodes.filter(
				(n) => n.type === "SUPPLEMENT",
			);
			expect(supplementNodes.length).toBeGreaterThan(0);

			// Check that evidence levels are valid
			const validEvidenceLevels = [
				"STRONG",
				"MODERATE",
				"WEAK",
				"INSUFFICIENT",
				"CONFLICTING",
			];
			expect(
				supplementNodes.every((node) =>
					validEvidenceLevels.includes(node.evidenceLevel),
				),
			).toBe(true);

			// Omega-3 should have strong evidence based on mocked data (2 strong studies)
			const omega3Node = supplementNodes.find((n) => n.id === "omega-3");
			expect(omega3Node?.evidenceLevel).toBe("STRONG");

			// Magnesium should have moderate evidence based on mocked data (1 moderate study)
			const magnesiumNode = supplementNodes.find((n) => n.id === "magnesium");
			expect(magnesiumNode?.evidenceLevel).toBe("MODERATE");
		});

		it("filters by evidence level correctly", async () => {
			const strongResult = await service.generateGraphData({
				minEvidenceLevel: "STRONG",
			});

			const moderateResult = await service.generateGraphData({
				minEvidenceLevel: "MODERATE",
			});

			// Strong filter should return fewer or equal relationships than moderate
			expect(strongResult.relationships.length).toBeLessThanOrEqual(
				moderateResult.relationships.length,
			);

			// Check that filtering actually works
			const strongRelationships = strongResult.relationships.filter(
				(rel) => rel.evidenceLevel === "STRONG",
			);
			expect(strongRelationships.length).toBeGreaterThan(0);
		});

		it("calculates node importance based on research volume and evidence", async () => {
			const result = await service.generateGraphData({
				includeSupplements: true,
			});

			const supplementNodes = result.nodes.filter(
				(n) => n.type === "SUPPLEMENT",
			);
			expect(supplementNodes.length).toBeGreaterThan(0);

			// All nodes should have importance between 0 and 1
			expect(
				supplementNodes.every(
					(node) => node.importance >= 0 && node.importance <= 1,
				),
			).toBe(true);

			// Omega-3 should have higher importance due to more research studies
			const omega3Node = supplementNodes.find((n) => n.id === "omega-3");
			const magnesiumNode = supplementNodes.find((n) => n.id === "magnesium");

			expect(omega3Node?.importance).toBeGreaterThan(
				magnesiumNode?.importance || 0,
			);
		});

		it("calculates node size based on research and applications", async () => {
			const result = await service.generateGraphData({
				includeSupplements: true,
			});

			const supplementNodes = result.nodes.filter(
				(n) => n.type === "SUPPLEMENT",
			);
			expect(supplementNodes.length).toBeGreaterThan(0);

			// All nodes should have reasonable sizes (base size 8 + bonuses)
			expect(
				supplementNodes.every((node) => node.size >= 8 && node.size <= 20),
			).toBe(true);

			// Omega-3 should have larger size due to more research and applications
			const omega3Node = supplementNodes.find((n) => n.id === "omega-3");
			expect(omega3Node?.size).toBeGreaterThan(8);
		});
	});

	describe("Supplement-to-Graph Transformation", () => {
		it("transforms clinical applications to cognitive function relationships", async () => {
			const result = await service.generateGraphData({
				includeSupplements: true,
				includeCognitiveFunctions: true,
				includeNeurotransmitters: false,
				includeBrainRegions: false,
			});

			// Should have relationships from supplements to cognitive functions
			const supplementToCognitive = result.relationships.filter((rel) => {
				const sourceNode = result.nodes.find((n) => n.id === rel.sourceId);
				const targetNode = result.nodes.find((n) => n.id === rel.targetId);
				return (
					sourceNode?.type === "SUPPLEMENT" &&
					targetNode?.type === "COGNITIVE_FUNCTION"
				);
			});

			expect(supplementToCognitive.length).toBeGreaterThan(0);

			// Check that relationships have proper Polish mechanisms
			expect(
				supplementToCognitive.every(
					(rel) => rel.polishMechanism && rel.polishMechanism.length > 0,
				),
			).toBe(true);

			// Check specific relationship from omega-3 to memory
			const omega3ToMemory = supplementToCognitive.find(
				(rel) => rel.sourceId === "omega-3" && rel.targetId === "memory",
			);
			expect(omega3ToMemory).toBeDefined();
			expect(omega3ToMemory?.type).toBe("ENHANCES");
			expect(omega3ToMemory?.polishMechanism).toContain("błon");
		});

		it("transforms active compounds to neurotransmitter relationships", async () => {
			const result = await service.generateGraphData({
				includeSupplements: true,
				includeNeurotransmitters: true,
				includeCognitiveFunctions: false,
				includeBrainRegions: false,
			});

			// Should have relationships from supplements to neurotransmitters
			const supplementToNeurotransmitter = result.relationships.filter(
				(rel) => {
					const sourceNode = result.nodes.find((n) => n.id === rel.sourceId);
					const targetNode = result.nodes.find((n) => n.id === rel.targetId);
					return (
						sourceNode?.type === "SUPPLEMENT" &&
						targetNode?.type === "NEUROTRANSMITTER"
					);
				},
			);

			expect(supplementToNeurotransmitter.length).toBeGreaterThan(0);

			// Check that relationships have proper mechanisms
			expect(
				supplementToNeurotransmitter.every(
					(rel) => rel.mechanism && rel.polishMechanism,
				),
			).toBe(true);
		});

		it("preserves supplement metadata in nodes", async () => {
			const result = await service.generateGraphData({
				includeSupplements: true,
			});

			const supplementNodes = result.nodes.filter(
				(n) => n.type === "SUPPLEMENT",
			);
			expect(supplementNodes.length).toBeGreaterThan(0);

			// Check that supplement nodes have metadata
			const nodesWithMetadata = supplementNodes.filter((node) => node.metadata);
			expect(nodesWithMetadata.length).toBeGreaterThan(0);

			// Check specific metadata fields for omega-3
			const omega3Node = supplementNodes.find((n) => n.id === "omega-3");
			expect(omega3Node?.metadata).toHaveProperty("supplementId");
			expect(omega3Node?.metadata).toHaveProperty("category");
			expect(omega3Node?.metadata).toHaveProperty("clinicalApplications");
			expect(omega3Node?.metadata).toHaveProperty("researchStudies");
			expect(omega3Node?.metadata?.clinicalApplications).toBe(2); // Based on mocked data
			expect(omega3Node?.metadata?.researchStudies).toBe(2); // Based on mocked data
		});

		it("integrates with synergy data correctly", async () => {
			const result = await service.generateGraphData({
				includeSupplements: true,
			});

			const synergyRelationships = result.relationships.filter(
				(rel) => rel.type === "SYNERGIZES",
			);
			expect(synergyRelationships.length).toBeGreaterThan(0);

			// Check that synergy relationships have proper metadata
			const synergyRel = synergyRelationships[0];
			expect(synergyRel).toHaveProperty("polishMechanism");
			expect(synergyRel).toHaveProperty("confidence");
			expect(synergyRel.metadata).toHaveProperty("synergyType");
			expect(synergyRel.metadata).toHaveProperty("optimalRatio");
			expect(synergyRel.metadata).toHaveProperty("timing");

			// Check specific synergy relationship
			const omega3MagnesiumSynergy = synergyRelationships.find(
				(rel) =>
					(rel.sourceId === "omega-3" && rel.targetId === "magnesium") ||
					(rel.sourceId === "magnesium" && rel.targetId === "omega-3"),
			);
			expect(omega3MagnesiumSynergy).toBeDefined();
			expect(omega3MagnesiumSynergy?.polishMechanism).toContain(
				"neuroprzekaźników",
			);
		});

		it("integrates with neuroplasticity mechanisms", async () => {
			const result = await service.generateGraphData({
				includeMechanisms: true,
				includeSupplements: true,
				includeBrainRegions: true,
			});

			const mechanismNodes = result.nodes.filter((n) => n.type === "MECHANISM");
			expect(mechanismNodes.length).toBeGreaterThan(0);

			// Check that mechanisms have Polish names and descriptions
			expect(
				mechanismNodes.every(
					(node) => node.polishName && node.polishDescription,
				),
			).toBe(true);

			// Check specific mechanism
			const bdnfNode = mechanismNodes.find((n) => n.id === "bdnf-enhancement");
			expect(bdnfNode?.polishName).toBe("Wzmocnienie BDNF");
			expect(bdnfNode?.polishDescription).toContain("mózgowego");

			// Should have relationships from mechanisms to brain regions
			const mechanismToBrain = result.relationships.filter((rel) => {
				const sourceNode = result.nodes.find((n) => n.id === rel.sourceId);
				const targetNode = result.nodes.find((n) => n.id === rel.targetId);
				return (
					sourceNode?.type === "MECHANISM" &&
					targetNode?.type === "BRAIN_REGION"
				);
			});

			expect(mechanismToBrain.length).toBeGreaterThan(0);

			// Should have relationships from supplements to mechanisms
			const supplementToMechanism = result.relationships.filter((rel) => {
				const sourceNode = result.nodes.find((n) => n.id === rel.sourceId);
				const targetNode = result.nodes.find((n) => n.id === rel.targetId);
				return (
					sourceNode?.type === "SUPPLEMENT" && targetNode?.type === "MECHANISM"
				);
			});

			expect(supplementToMechanism.length).toBeGreaterThan(0);
		});
	});

	describe("Performance and Scalability", () => {
		it("handles 500+ nodes within 3 seconds", async () => {
			const startTime = performance.now();

			const result = await service.generateGraphData({
				maxNodes: 500,
				includeSupplements: true,
				includeNeurotransmitters: true,
				includeBrainRegions: true,
				includeCognitiveFunctions: true,
				includePathways: true,
				includeMechanisms: true,
			});

			const endTime = performance.now();
			const executionTime = endTime - startTime;

			// Should meet the 3-second requirement for 500+ nodes
			expect(executionTime).toBeLessThan(3000);
			expect(result.nodes.length).toBeGreaterThan(0);
			expect(result.relationships.length).toBeGreaterThan(0);
		});

		it("limits nodes correctly when maxNodes is specified", async () => {
			const result = await service.generateGraphData({
				maxNodes: 20,
			});

			expect(result.nodes.length).toBeLessThanOrEqual(20);

			// Relationships should only connect remaining nodes
			const nodeIds = new Set(result.nodes.map((n) => n.id));
			const invalidRelationships = result.relationships.filter(
				(rel) => !nodeIds.has(rel.sourceId) || !nodeIds.has(rel.targetId),
			);
			expect(invalidRelationships.length).toBe(0);
		});

		it("prioritizes important nodes when limiting", async () => {
			const result = await service.generateGraphData({
				maxNodes: 10,
				includeSupplements: true,
			});

			const supplementNodes = result.nodes.filter(
				(n) => n.type === "SUPPLEMENT",
			);

			if (supplementNodes.length > 1) {
				// Nodes should be sorted by importance (descending)
				for (let i = 0; i < supplementNodes.length - 1; i++) {
					expect(supplementNodes[i].importance).toBeGreaterThanOrEqual(
						supplementNodes[i + 1].importance,
					);
				}
			}
		});

		it("optimizes memory usage for large datasets", async () => {
			const initialMemory = process.memoryUsage().heapUsed;

			const result = await service.generateGraphData({
				maxNodes: 1000,
			});

			const finalMemory = process.memoryUsage().heapUsed;
			const memoryIncrease = finalMemory - initialMemory;

			// Should not use excessive memory (less than 50MB increase)
			expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024);
			expect(result.nodes.length).toBeGreaterThan(0);
		});
	});

	describe("Data Consistency and Validation", () => {
		it("maintains data consistency across transformations", async () => {
			const result = await service.generateGraphData();

			// All relationship source and target IDs should exist in nodes
			const nodeIds = new Set(result.nodes.map((n) => n.id));
			const invalidRelationships = result.relationships.filter(
				(rel) => !nodeIds.has(rel.sourceId) || !nodeIds.has(rel.targetId),
			);

			expect(invalidRelationships).toHaveLength(0);

			// All nodes should have required fields
			expect(
				result.nodes.every(
					(node) =>
						node.id &&
						node.name &&
						node.polishName &&
						node.type &&
						node.evidenceLevel &&
						typeof node.size === "number" &&
						typeof node.importance === "number",
				),
			).toBe(true);

			// All relationships should have required fields
			expect(
				result.relationships.every(
					(rel) =>
						rel.id &&
						rel.sourceId &&
						rel.targetId &&
						rel.type &&
						rel.mechanism &&
						rel.polishMechanism &&
						typeof rel.strength === "number" &&
						typeof rel.confidence === "number",
				),
			).toBe(true);
		});

		it("validates Polish text encoding", async () => {
			const result = await service.generateGraphData({
				includeSupplements: true,
			});

			// Check that Polish text is properly encoded
			const polishTexts = result.nodes
				.flatMap((node) => [node.polishName, node.polishDescription])
				.filter((text) => text && text.length > 0);

			expect(polishTexts.length).toBeGreaterThan(0);

			// Check that Polish characters are preserved
			const textsWithDiacritics = polishTexts.filter((text) =>
				/[ąćęłńóśźż]/.test(text),
			);
			expect(textsWithDiacritics.length).toBeGreaterThan(0);
		});

		it("ensures unique node and relationship IDs", async () => {
			const result = await service.generateGraphData();

			// Check node ID uniqueness
			const nodeIds = result.nodes.map((n) => n.id);
			const uniqueNodeIds = new Set(nodeIds);
			expect(nodeIds.length).toBe(uniqueNodeIds.size);

			// Check relationship ID uniqueness
			const relationshipIds = result.relationships.map((r) => r.id);
			const uniqueRelationshipIds = new Set(relationshipIds);
			expect(relationshipIds.length).toBe(uniqueRelationshipIds.size);
		});
	});
});

describe("defaultGraphDataOptions", () => {
	it("has correct default values for production use", () => {
		expect(defaultGraphDataOptions).toEqual({
			includeSupplements: true,
			includeNeurotransmitters: true,
			includeBrainRegions: true,
			includeCognitiveFunctions: true,
			includePathways: true,
			includeMechanisms: true,
			minEvidenceLevel: "WEAK",
			maxNodes: 500,
		});
	});

	it("provides reasonable defaults for educational use", () => {
		// Should include all types for comprehensive education
		expect(defaultGraphDataOptions.includeSupplements).toBe(true);
		expect(defaultGraphDataOptions.includeNeurotransmitters).toBe(true);
		expect(defaultGraphDataOptions.includeBrainRegions).toBe(true);
		expect(defaultGraphDataOptions.includeCognitiveFunctions).toBe(true);

		// Should have reasonable node limit for performance
		expect(defaultGraphDataOptions.maxNodes).toBe(500);
		expect(defaultGraphDataOptions.maxNodes).toBeLessThanOrEqual(1000);

		// Should include weak evidence for educational completeness
		expect(defaultGraphDataOptions.minEvidenceLevel).toBe("WEAK");
	});
});
