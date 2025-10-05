import type {
	KnowledgeNode,
	KnowledgeRelationship,
} from "@/types/knowledge-graph";
import { action } from "@storybook/addon-actions";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import D3GraphVisualization from "./D3GraphVisualization";

// Sample Polish data for D3 visualization
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
	{
		id: "hippocampus",
		name: "Hippocampus",
		polishName: "Hipokamp",
		type: "BRAIN_REGION",
		description: "Brain region crucial for memory formation",
		polishDescription: "Region mózgu kluczowy dla tworzenia pamięci",
		category: "Regiony mózgu",
		evidenceLevel: "STRONG",
		size: 9,
		importance: 0.75,
		x: 150,
		y: 350,
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
	{
		id: "hippocampus-memory",
		sourceId: "hippocampus",
		targetId: "memory",
		type: "SYNERGIZES",
		strength: 0.9,
		confidence: 0.95,
		mechanism: "Memory consolidation",
		polishMechanism: "Konsolidacja pamięci",
		evidenceLevel: "STRONG",
	},
];

// Generate complex network for testing
const generateComplexNetwork = (nodeCount: number) => {
	const nodes: KnowledgeNode[] = [];
	const relationships: KnowledgeRelationship[] = [];

	const polishSupplementNames = [
		"Kwasy tłuszczowe Omega-3",
		"Magnez",
		"Witamina D3",
		"L-Teanina",
		"Bakopa drobnolistna",
		"Różeniec górski",
		"Miłorząb dwuklapowy",
		"Ashwagandha",
		"Soplówka jeżowata",
		"Fosfatydyloseryna",
	];

	const nodeTypes = [
		"SUPPLEMENT",
		"NEUROTRANSMITTER",
		"COGNITIVE_FUNCTION",
		"BRAIN_REGION",
	] as const;

	// Generate nodes
	for (let i = 0; i < nodeCount; i++) {
		const nameIndex = i % polishSupplementNames.length;
		const typeIndex = i % nodeTypes.length;

		nodes.push({
			id: `node-${i}`,
			name: `Node ${i}`,
			polishName: `${polishSupplementNames[nameIndex]} ${i}`,
			type: nodeTypes[typeIndex],
			description: `Description ${i}`,
			polishDescription: `Opis węzła ${i} z polskimi znakami: ąćęłńóśźż`,
			category: "Test",
			evidenceLevel: i % 3 === 0 ? "STRONG" : i % 3 === 1 ? "MODERATE" : "WEAK",
			size: 8 + (i % 5),
			importance: Math.random(),
			x: Math.random() * 800,
			y: Math.random() * 600,
		});
	}

	// Generate relationships with realistic patterns
	for (let i = 0; i < Math.min(nodeCount * 1.5, 150); i++) {
		const sourceIndex = Math.floor(Math.random() * nodeCount);
		let targetIndex = Math.floor(Math.random() * nodeCount);

		// Avoid self-loops
		while (targetIndex === sourceIndex) {
			targetIndex = Math.floor(Math.random() * nodeCount);
		}

		const relationshipTypes = [
			"ENHANCES",
			"MODULATES",
			"SYNERGIZES",
			"INHIBITS",
		] as const;
		const type = relationshipTypes[i % relationshipTypes.length];

		relationships.push({
			id: `rel-${i}`,
			sourceId: `node-${sourceIndex}`,
			targetId: `node-${targetIndex}`,
			type,
			strength: 0.3 + Math.random() * 0.7,
			confidence: 0.5 + Math.random() * 0.5,
			mechanism: `Mechanism ${i}`,
			polishMechanism: `Mechanizm ${i} z polskimi znakami`,
			evidenceLevel: i % 3 === 0 ? "STRONG" : "MODERATE",
		});
	}

	return { nodes, relationships };
};

const meta: Meta<typeof D3GraphVisualization> = {
	title: "Graph/D3GraphVisualization",
	component: D3GraphVisualization,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"Komponent wizualizacji grafu używający D3.js z obsługą polskich nazw i interaktywnych funkcji.",
			},
		},
	},
	argTypes: {
		nodes: {
			description: "Tablica węzłów grafu z polskimi nazwami",
		},
		relationships: {
			description: "Tablica relacji między węzłami",
		},
		width: {
			control: { type: "range", min: 300, max: 1200, step: 50 },
			description: "Szerokość wizualizacji w pikselach",
		},
		height: {
			control: { type: "range", min: 200, max: 800, step: 50 },
			description: "Wysokość wizualizacji w pikselach",
		},
		onNodeClick: {
			description: "Callback wywoływany po kliknięciu węzła",
		},
		onNodeHover: {
			description: "Callback wywoływany po najechaniu na węzeł",
		},
		selectedNodeIds: {
			description: "Tablica ID wybranych węzłów",
		},
		enablePhysics: {
			description: "Włącza/wyłącza symulację fizyki",
		},
		showLabels: {
			description: "Pokazuje/ukrywa etykiety węzłów",
		},
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic D3 visualization
export const Default: Story = {
	args: {
		nodes: polishNodes,
		relationships: polishRelationships,
		width: 800,
		height: 600,
		onNodeClick: action("nodeClick"),
		onNodeHover: action("nodeHover"),
		enablePhysics: true,
		showLabels: true,
	},
	parameters: {
		docs: {
			description: {
				story:
					"Podstawowa wizualizacja D3 z polskimi suplementami i ich połączeniami.",
			},
		},
	},
};

// Small viewport
export const SmallViewport: Story = {
	args: {
		nodes: polishNodes.slice(0, 3),
		relationships: polishRelationships.slice(0, 2),
		width: 400,
		height: 300,
		onNodeClick: action("nodeClick"),
		onNodeHover: action("nodeHover"),
		enablePhysics: true,
		showLabels: true,
	},
	parameters: {
		docs: {
			description: {
				story:
					"Wizualizacja w małym oknie - testuje responsywność i czytelność.",
			},
		},
	},
};

// Large viewport with many nodes
export const LargeViewport: Story = {
	args: {
		...generateComplexNetwork(50),
		width: 1000,
		height: 700,
		onNodeClick: action("nodeClick"),
		onNodeHover: action("nodeHover"),
		enablePhysics: true,
		showLabels: false, // Hide labels for better performance
	},
	parameters: {
		docs: {
			description: {
				story: "Duża wizualizacja z wieloma węzłami - testuje wydajność D3.",
			},
		},
	},
};

// Without physics simulation
export const StaticLayout: Story = {
	args: {
		nodes: polishNodes,
		relationships: polishRelationships,
		width: 800,
		height: 600,
		onNodeClick: action("nodeClick"),
		onNodeHover: action("nodeHover"),
		enablePhysics: false,
		showLabels: true,
	},
	parameters: {
		docs: {
			description: {
				story:
					"Statyczny układ bez symulacji fizyki - węzły pozostają w stałych pozycjach.",
			},
		},
	},
};

// Without labels
export const NoLabels: Story = {
	args: {
		nodes: polishNodes,
		relationships: polishRelationships,
		width: 800,
		height: 600,
		onNodeClick: action("nodeClick"),
		onNodeHover: action("nodeHover"),
		enablePhysics: true,
		showLabels: false,
	},
	parameters: {
		docs: {
			description: {
				story: "Wizualizacja bez etykiet - czysta wizualizacja połączeń.",
			},
		},
	},
};

// With selected nodes
export const WithSelection: Story = {
	args: {
		nodes: polishNodes,
		relationships: polishRelationships,
		width: 800,
		height: 600,
		onNodeClick: action("nodeClick"),
		onNodeHover: action("nodeHover"),
		selectedNodeIds: ["omega-3", "dopamine"],
		enablePhysics: true,
		showLabels: true,
	},
	parameters: {
		docs: {
			description: {
				story:
					"Wizualizacja z wybranymi węzłami - pokazuje podświetlenie wybranych elementów.",
			},
		},
	},
};

// Dense network
export const DenseNetwork: Story = {
	args: {
		...generateComplexNetwork(30),
		width: 800,
		height: 600,
		onNodeClick: action("nodeClick"),
		onNodeHover: action("nodeHover"),
		enablePhysics: true,
		showLabels: true,
	},
	parameters: {
		docs: {
			description: {
				story: "Gęsta sieć połączeń - testuje czytelność przy wielu relacjach.",
			},
		},
	},
};

// Sparse network
export const SparseNetwork: Story = {
	args: {
		nodes: polishNodes,
		relationships: polishRelationships.slice(0, 1),
		width: 800,
		height: 600,
		onNodeClick: action("nodeClick"),
		onNodeHover: action("nodeHover"),
		enablePhysics: true,
		showLabels: true,
	},
	parameters: {
		docs: {
			description: {
				story:
					"Rzadka sieć z niewieloma połączeniami - pokazuje izolowane węzły.",
			},
		},
	},
};

// Different node types
export const NodeTypes: Story = {
	args: {
		nodes: [
			...polishNodes,
			{
				id: "pathway-1",
				name: "Dopaminergic Pathway",
				polishName: "Szlak dopaminergiczny",
				type: "PATHWAY",
				description: "Neural pathway",
				polishDescription: "Szlak neuronalny",
				category: "Szlaki",
				evidenceLevel: "STRONG",
				size: 7,
				importance: 0.6,
				x: 250,
				y: 250,
			},
			{
				id: "mechanism-1",
				name: "Neuroplasticity",
				polishName: "Neuroplastyczność",
				type: "MECHANISM",
				description: "Brain adaptation mechanism",
				polishDescription: "Mechanizm adaptacji mózgu",
				category: "Mechanizmy",
				evidenceLevel: "MODERATE",
				size: 6,
				importance: 0.5,
				x: 350,
				y: 150,
			},
		],
		relationships: polishRelationships,
		width: 800,
		height: 600,
		onNodeClick: action("nodeClick"),
		onNodeHover: action("nodeHover"),
		enablePhysics: true,
		showLabels: true,
	},
	parameters: {
		docs: {
			description: {
				story: "Różne typy węzłów - pokazuje wizualne różnice między typami.",
			},
		},
	},
};

// Interactive test
export const InteractiveTest: Story = {
	args: {
		nodes: polishNodes,
		relationships: polishRelationships,
		width: 800,
		height: 600,
		onNodeClick: action("nodeClick"),
		onNodeHover: action("nodeHover"),
		enablePhysics: true,
		showLabels: true,
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);

		// Wait for D3 to render
		await new Promise((resolve) => setTimeout(resolve, 1000));

		// Try to find and interact with nodes
		const svgElement =
			canvas.getByRole("img", { hidden: true }) ||
			canvasElement.querySelector("svg");

		if (svgElement) {
			// Simulate node click
			await userEvent.click(svgElement);

			// Verify callbacks were called
			expect(args.onNodeClick).toHaveBeenCalled();
		}
	},
	parameters: {
		docs: {
			description: {
				story:
					"Test interaktywności - automatycznie testuje kliknięcia i hover.",
			},
		},
	},
};

// Performance test
export const PerformanceTest: Story = {
	args: {
		...generateComplexNetwork(100),
		width: 800,
		height: 600,
		onNodeClick: action("nodeClick"),
		onNodeHover: action("nodeHover"),
		enablePhysics: true,
		showLabels: false,
	},
	parameters: {
		docs: {
			description: {
				story: "Test wydajności z 100 węzłami - sprawdza płynność animacji.",
			},
		},
	},
};

// Polish diacritics showcase
export const PolishDiacritics: Story = {
	args: {
		nodes: [
			{
				id: "diacritics-1",
				name: "Polish Characters Test",
				polishName: "Ąćęłńóśźż - wszystkie polskie znaki",
				type: "SUPPLEMENT",
				description: "Testing Polish diacritics",
				polishDescription:
					"Testowanie polskich znaków diakrytycznych w długim tekście z ąćęłńóśźż",
				category: "Test znaków",
				evidenceLevel: "MODERATE",
				size: 10,
				importance: 0.5,
				x: 200,
				y: 200,
			},
			{
				id: "diacritics-2",
				name: "Another Test",
				polishName: "Żółć, łąka, ćma, źródło",
				type: "NEUROTRANSMITTER",
				description: "More Polish characters",
				polishDescription: "Więcej polskich znaków w opisie węzła",
				category: "Test",
				evidenceLevel: "STRONG",
				size: 8,
				importance: 0.7,
				x: 400,
				y: 300,
			},
		],
		relationships: [
			{
				id: "diacritics-rel",
				sourceId: "diacritics-1",
				targetId: "diacritics-2",
				type: "ENHANCES",
				strength: 0.8,
				confidence: 0.9,
				mechanism: "Polish mechanism test",
				polishMechanism: "Mechanizm z polskimi znakami: ąćęłńóśźż",
				evidenceLevel: "STRONG",
			},
		],
		width: 800,
		height: 600,
		onNodeClick: action("nodeClick"),
		onNodeHover: action("nodeHover"),
		enablePhysics: true,
		showLabels: true,
	},
	parameters: {
		docs: {
			description: {
				story:
					"Test polskich znaków diakrytycznych - sprawdza poprawne renderowanie ąćęłńóśźż.",
			},
		},
	},
};

// Empty state
export const EmptyState: Story = {
	args: {
		nodes: [],
		relationships: [],
		width: 800,
		height: 600,
		onNodeClick: action("nodeClick"),
		onNodeHover: action("nodeHover"),
		enablePhysics: true,
		showLabels: true,
	},
	parameters: {
		docs: {
			description: {
				story: "Stan pusty - brak węzłów do wyświetlenia.",
			},
		},
	},
};
