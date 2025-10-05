import type {
	KnowledgeNode,
	KnowledgeRelationship,
} from "@/types/knowledge-graph";

/**
 * Mock data provider for knowledge graph visualization
 * This would typically connect to a MongoDB database in a real application
 */
export const mockKnowledgeData = {
	nodes: [
		{
			id: "node-1",
			type: "SUPPLEMENT",
			name: "Omega-3",
			polishName: "Kwasy omega-3",
			description:
				"Essential fatty acids supporting brain health and cognitive function",
			polishDescription:
				"Niezbedne kwasy tłuszczowe wspierające zdrowie mózgu i funkcje poznawcze",
			color: "#3B82F6",
			size: 10,
			properties: {
				category: "FATTY_ACID",
				activeCompounds: ["EPA", "DHA"],
			},
			tags: ["neuroprotection", "cognition", "anti-inflammatory"],
			category: "Fatty Acid",
			evidenceLevel: "STRONG",
			sources: ["study-1", "study-2"],
			lastUpdated: new Date().toISOString(),
			createdAt: new Date().toISOString(),
		},
		{
			id: "node-2",
			type: "SUPPLEMENT",
			name: "Curcumin",
			polishName: "Kurkumina",
			description:
				"Bioactive compound from turmeric with anti-inflammatory and neuroprotective properties",
			polishDescription:
				"Związek bioaktywny z kurkumy o właściwościach przeciwzapalnych i neuroprotekcyjnych",
			color: "#F59E0B",
			size: 8,
			properties: {
				category: "NOOTROPIC",
				activeCompounds: ["Curcuminoids"],
			},
			tags: ["anti-inflammatory", "neuroprotection", "antioxidant"],
			category: "Nootropic",
			evidenceLevel: "MODERATE",
			sources: ["study-3", "study-4"],
			lastUpdated: new Date().toISOString(),
			createdAt: new Date().toISOString(),
		},
		{
			id: "node-3",
			type: "BRAIN_REGION",
			name: "Hippocampus",
			polishName: "Hipokamp",
			description:
				"Brain region critical for memory formation and spatial navigation",
			polishDescription:
				"Obszar mózgu krytyczny dla tworzenia pamięci i nawigacji przestrzennej",
			color: "#8B5CF6",
			size: 12,
			properties: {
				location: "Temporal lobe",
				functions: ["memory", "spatial navigation"],
			},
			tags: ["memory", "learning", "neuroplasticity"],
			category: "Brain Region",
			evidenceLevel: "STRONG",
			sources: ["study-5", "study-6"],
			lastUpdated: new Date().toISOString(),
			createdAt: new Date().toISOString(),
		},
		{
			id: "node-4",
			type: "NEUROTRANSMITTER",
			name: "BDNF",
			polishName: "BDNF",
			description:
				"Brain-Derived Neurotrophic Factor - supports neuron survival and growth",
			polishDescription:
				"Neurotroficzny czynnik pochodny z mózgu - wspiera przeżycie i wzrost neuronów",
			color: "#10B981",
			size: 9,
			properties: {
				function: "Neurotrophin",
				pathways: ["Synaptic plasticity", "Neurogenesis"],
			},
			tags: ["neuroplasticity", "growth factor", "synaptic plasticity"],
			category: "Neurotrophin",
			evidenceLevel: "STRONG",
			sources: ["study-7", "study-8"],
			lastUpdated: new Date().toISOString(),
			createdAt: new Date().toISOString(),
		},
		{
			id: "node-5",
			type: "COGNITIVE_FUNCTION",
			name: "Memory Formation",
			polishName: "Tworzenie Pamięci",
			description: "Process of forming new memories through synaptic changes",
			polishDescription:
				"Proces tworzenia nowych wspomnień poprzez zmiany synaptyczne",
			color: "#EC4899",
			size: 7,
			properties: {
				domain: "Cognition",
				subFunctions: ["Encoding", "Consolidation", "Retrieval"],
			},
			tags: ["memory", "consolidation", "encoding"],
			category: "Cognitive Function",
			evidenceLevel: "STRONG",
			sources: ["study-9", "study-10"],
			lastUpdated: new Date().toISOString(),
			createdAt: new Date().toISOString(),
		},
		{
			id: "node-6",
			type: "SUPPLEMENT",
			name: "Bacopa Monnieri",
			polishName: "Bacopa Monnieri",
			description:
				"Traditional herb used for cognitive enhancement and memory support",
			polishDescription:
				"Tradycyjna ziołoleczna używana do wzmocnienia funkcji poznawczych i wspierania pamięci",
			color: "#3B82F6",
			size: 8,
			properties: {
				category: "HERB",
				activeCompounds: ["Bacosides"],
			},
			tags: ["memory", "cognition", "neuroprotection"],
			category: "Herb",
			evidenceLevel: "MODERATE",
			sources: ["study-11", "study-12"],
			lastUpdated: new Date().toISOString(),
			createdAt: new Date().toISOString(),
		},
		{
			id: "node-7",
			type: "PATHWAY",
			name: "Synaptic Plasticity",
			polishName: "Plastyczność Synaptyczna",
			description: "Mechanism of changing synaptic strength based on activity",
			polishDescription:
				"Mechanizm zmiany siły synaptycznej oparty na aktywności",
			color: "#EF4444",
			size: 10,
			properties: {
				location: "Synapses",
				type: "Molecular Pathway",
			},
			tags: ["synaptic strength", "LTP", "LTD"],
			category: "Pathway",
			evidenceLevel: "STRONG",
			sources: ["study-13", "study-14"],
			lastUpdated: new Date().toISOString(),
			createdAt: new Date().toISOString(),
		},
	] as KnowledgeNode[],

	relationships: [
		{
			id: "rel-1",
			sourceId: "node-1", // Omega-3
			targetId: "node-3", // Hippocampus
			type: "ENHANCES",
			strength: 0.8,
			confidence: 0.9,
			bidirectional: false,
			evidenceLevel: "STRONG",
			mechanism:
				"Omega-3 fatty acids support hippocampal neuroplasticity and memory formation",
			polishMechanism:
				"Kwasy omega-3 wspierają neuroplastyczność hipokampa i tworzenie pamięci",
			polishDescription: "Wsparcie dla neuroplastyczności hipokampa",
			onset: "2-4 weeks",
			duration: "Continuous with regular intake",
			reversibility: "reversible",
			lastUpdated: new Date().toISOString(),
			createdAt: new Date().toISOString(),
		},
		{
			id: "rel-2",
			sourceId: "node-1", // Omega-3
			targetId: "node-4", // BDNF
			type: "ENHANCES",
			strength: 0.75,
			confidence: 0.85,
			bidirectional: false,
			evidenceLevel: "MODERATE",
			mechanism:
				"Omega-3 fatty acids upregulate BDNF expression in hippocampal neurons",
			polishMechanism:
				"Kwasy omega-3 zwiększają ekspresję BDNF w neuronach hipokampa",
			polishDescription: "Zwiększenie ekspresji BDNF",
			onset: "4-6 weeks",
			duration: "Continuous with regular intake",
			reversibility: "reversible",
			lastUpdated: new Date().toISOString(),
			createdAt: new Date().toISOString(),
		},
		{
			id: "rel-3",
			sourceId: "node-2", // Curcumin
			targetId: "node-3", // Hippocampus
			type: "PRODUCES",
			strength: 0.6,
			confidence: 0.8,
			bidirectional: false,
			evidenceLevel: "MODERATE",
			mechanism: "Curcumin reduces neuroinflammation in hippocampal region",
			polishMechanism:
				"Kurkumina zmniejsza neurozapalenie w regionie hipokampa",
			polishDescription: "Redukcja neurozapalenia",
			onset: "2-3 weeks",
			duration: "Continuous with regular intake",
			reversibility: "reversible",
			lastUpdated: new Date().toISOString(),
			createdAt: new Date().toISOString(),
		},
		{
			id: "rel-4",
			sourceId: "node-4", // BDNF
			targetId: "node-5", // Memory Formation
			type: "ENHANCES",
			strength: 0.9,
			confidence: 0.95,
			bidirectional: false,
			evidenceLevel: "STRONG",
			mechanism:
				"BDNF promotes synaptic plasticity necessary for memory formation",
			polishMechanism:
				"BDNF promuje plastyczność synaptyczną niezbędną do tworzenia pamięci",
			polishDescription: "Promowanie plastyczności synaptycznej",
			onset: "Immediate",
			duration: "Ongoing",
			reversibility: "partially_reversible",
			lastUpdated: new Date().toISOString(),
			createdAt: new Date().toISOString(),
		},
		{
			id: "rel-5",
			sourceId: "node-6", // Bacopa
			targetId: "node-5", // Memory Formation
			type: "ENHANCES",
			strength: 0.7,
			confidence: 0.8,
			bidirectional: false,
			evidenceLevel: "MODERATE",
			mechanism:
				"Bacopa enhances memory consolidation through bacoside compounds",
			polishMechanism:
				"Bacopa wzmocnia konsolidację pamięci poprzez związki bakosyjne",
			polishDescription: "Wzmocnienie konsolidacji pamięci",
			onset: "4-6 weeks",
			duration: "Continuous with regular intake",
			reversibility: "reversible",
			lastUpdated: new Date().toISOString(),
			createdAt: new Date().toISOString(),
		},
		{
			id: "rel-6",
			sourceId: "node-6", // Bacopa
			targetId: "node-3", // Hippocampus
			type: "ENHANCES",
			strength: 0.65,
			confidence: 0.75,
			bidirectional: false,
			evidenceLevel: "MODERATE",
			mechanism: "Bacopa improves hippocampal function and neuroplasticity",
			polishMechanism: "Bacopa poprawia funkcje hipokampa i neuroplastyczność",
			polishDescription: "Poprawa funkcji hipokampa",
			onset: "3-6 weeks",
			duration: "Continuous with regular intake",
			reversibility: "reversible",
			lastUpdated: new Date().toISOString(),
			createdAt: new Date().toISOString(),
		},
		{
			id: "rel-7",
			sourceId: "node-7", // Synaptic Plasticity
			targetId: "node-5", // Memory Formation
			type: "REQUIRES",
			strength: 0.95,
			confidence: 0.98,
			bidirectional: false,
			evidenceLevel: "STRONG",
			mechanism: "Memory formation requires synaptic plasticity mechanisms",
			polishMechanism:
				"Tworzenie pamięci wymaga mechanizmów plastyczności synaptycznej",
			polishDescription: "Wymóg plastyczności synaptycznej",
			onset: "Immediate",
			duration: "Ongoing",
			reversibility: "partially_reversible",
			lastUpdated: new Date().toISOString(),
			createdAt: new Date().toISOString(),
		},
		{
			id: "rel-8",
			sourceId: "node-7", // Synaptic Plasticity
			targetId: "node-3", // Hippocampus
			type: "OCCURS_IN",
			strength: 0.85,
			confidence: 0.9,
			bidirectional: false,
			evidenceLevel: "STRONG",
			mechanism:
				"Synaptic plasticity occurs predominantly in hippocampal synapses",
			polishMechanism:
				"Plastyczność synaptyczna zachodzi przede wszystkim w synapsach hipokampa",
			polishDescription: "Zachodzi w synapsach hipokampa",
			onset: "Immediate",
			duration: "Ongoing",
			reversibility: "partially_reversible",
			lastUpdated: new Date().toISOString(),
			createdAt: new Date().toISOString(),
		},
	] as KnowledgeRelationship[],
};

// Helper function to get sample data
export const getKnowledgeGraphData = (): {
	nodes: KnowledgeNode[];
	relationships: KnowledgeRelationship[];
} => {
	return {
		nodes: mockKnowledgeData.nodes,
		relationships: mockKnowledgeData.relationships,
	};
};
