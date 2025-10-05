import type {
	KnowledgeNode,
	KnowledgeRelationship,
} from "@/types/knowledge-graph";
import type { SupplementWithRelations } from "@/types/supplement";
import { action } from "@storybook/addon-actions";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import GraphDashboard from "./GraphDashboard";

// Mock Zustand store for Storybook
const mockStoreProvider = (Story: any) => {
	// Mock the store hook
	const mockStore = {
		selectedNodes: [],
		sidebarOpen: true,
		setSidebarOpen: action("setSidebarOpen"),
		legendOpen: true,
		setLegendOpen: action("setLegendOpen"),
		graphMode: "2d" as const,
		setGraphMode: action("setGraphMode"),
		viewMode: "overview" as const,
		setViewMode: action("setViewMode"),
		layout: "force" as const,
		setLayout: action("setLayout"),
		filters: {
			nodeTypes: [],
			relationshipTypes: [],
			evidenceLevels: [],
			searchTerm: "",
			minStrength: 0,
			maxStrength: 1,
			maxNodes: 100,
			showLabels: true,
			showRelationshipLabels: false,
			minConfidence: 0,
			categories: [],
		},
		setFilters: action("setFilters"),
		resetFilters: action("resetFilters"),
		zoomLevel: 1,
		setZoomLevel: action("setZoomLevel"),
		isPlaying: true,
		setIsPlaying: action("setIsPlaying"),
		highlightNode: null,
		setHighlightNode: action("setHighlightNode"),
		enablePhysics: true,
		setEnablePhysics: action("setEnablePhysics"),
		maxRenderNodes: 500,
		setMaxRenderNodes: action("setMaxRenderNodes"),
	};

	// Mock the hook
	require("@/lib/stores/knowledge-graph-store").useKnowledgeGraphStore = () =>
		mockStore;

	return <Story />;
};

// Sample Polish supplement data for stories
const polishSupplementNodes: KnowledgeNode[] = [
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
		id: "vitamin-d",
		name: "Vitamin D3",
		polishName: "Witamina D3",
		type: "SUPPLEMENT",
		description: "Vitamin for immune and bone health",
		polishDescription: "Witamina dla odporności i zdrowia kości",
		category: "Witaminy",
		evidenceLevel: "STRONG",
		size: 11,
		importance: 0.85,
		x: 300,
		y: 150,
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
		x: 400,
		y: 250,
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
		x: 500,
		y: 300,
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
		id: "vitamin-d-hippocampus",
		sourceId: "vitamin-d",
		targetId: "hippocampus",
		type: "SYNERGIZES",
		strength: 0.75,
		confidence: 0.85,
		mechanism: "Neuroplasticity enhancement",
		polishMechanism: "Wzmocnienie neuroplastyczności",
		evidenceLevel: "STRONG",
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

// Generate large dataset for performance testing
const generateLargeDataset = (nodeCount: number) => {
	const nodes: KnowledgeNode[] = [];
	const relationships: KnowledgeRelationship[] = [];

	const polishNames = [
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

	for (let i = 0; i < nodeCount; i++) {
		const nameIndex = i % polishNames.length;
		nodes.push({
			id: `node-${i}`,
			name: `Node ${i}`,
			polishName: `${polishNames[nameIndex]} ${i}`,
			type: i % 2 === 0 ? "SUPPLEMENT" : "NEUROTRANSMITTER",
			description: `Description ${i}`,
			polishDescription: `Opis ${i}`,
			category: "Test",
			evidenceLevel: i % 3 === 0 ? "STRONG" : "MODERATE",
			size: 8 + (i % 5),
			importance: Math.random(),
			x: Math.random() * 800,
			y: Math.random() * 600,
		});
	}

	// Generate relationships
	for (let i = 0; i < Math.min(nodeCount / 2, 100); i++) {
		const sourceIndex = Math.floor(Math.random() * nodeCount);
		const targetIndex = Math.floor(Math.random() * nodeCount);

		if (sourceIndex !== targetIndex) {
			relationships.push({
				id: `rel-${i}`,
				sourceId: `node-${sourceIndex}`,
				targetId: `node-${targetIndex}`,
				type: "ENHANCES",
				strength: Math.random(),
				confidence: 0.5 + Math.random() * 0.5,
				mechanism: `Mechanism ${i}`,
				polishMechanism: `Mechanizm ${i}`,
				evidenceLevel: "MODERATE",
			});
		}
	}

	return { nodes, relationships };
};

const meta: Meta<typeof GraphDashboard> = {
	title: "Graph/GraphDashboard",
	component: GraphDashboard,
	decorators: [mockStoreProvider],
	parameters: {
		layout: "fullscreen",
		docs: {
			description: {
				component:
					"Główny komponent dashboardu grafu wiedzy o suplementach z pełną funkcjonalnością polskiej lokalizacji.",
			},
		},
	},
	argTypes: {
		nodes: {
			description: "Tablica węzłów grafu z polskimi nazwami i opisami",
		},
		relationships: {
			description: "Tablica relacji między węzłami z polskimi mechanizmami",
		},
		supplements: {
			description: "Tablica suplementów z pełnymi danymi klinicznymi",
		},
		onDataLoad: {
			description: "Callback wywoływany po załadowaniu danych",
		},
		className: {
			description: "Dodatkowe klasy CSS",
		},
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic story with Polish supplements
export const Default: Story = {
	args: {
		nodes: polishSupplementNodes,
		relationships: polishRelationships,
		supplements: polishSupplements,
		onDataLoad: action("onDataLoad"),
	},
	parameters: {
		docs: {
			description: {
				story:
					"Podstawowy graf z polskimi suplementami i ich połączeniami. Pokazuje główne funkcjonalności dashboardu.",
			},
		},
	},
};

// Small dataset for quick testing
export const SmallDataset: Story = {
	args: {
		nodes: polishSupplementNodes.slice(0, 3),
		relationships: polishRelationships.slice(0, 2),
		supplements: polishSupplements,
		onDataLoad: action("onDataLoad"),
	},
	parameters: {
		docs: {
			description: {
				story:
					"Mały zbiór danych idealny do testowania funkcjonalności bez przeciążenia wizualnego.",
			},
		},
	},
};

// Medium dataset for typical usage
export const MediumDataset: Story = {
	args: {
		...generateLargeDataset(50),
		supplements: polishSupplements,
		onDataLoad: action("onDataLoad"),
	},
	parameters: {
		docs: {
			description: {
				story:
					"Średni zbiór danych (50 węzłów) reprezentujący typowe użycie w aplikacji produkcyjnej.",
			},
		},
	},
};

// Large dataset for performance testing
export const LargeDataset: Story = {
	args: {
		...generateLargeDataset(200),
		supplements: polishSupplements,
		onDataLoad: action("onDataLoad"),
	},
	parameters: {
		docs: {
			description: {
				story:
					"Duży zbiór danych (200 węzłów) do testowania wydajności i optymalizacji.",
			},
		},
	},
};

// Empty state
export const EmptyState: Story = {
	args: {
		nodes: [],
		relationships: [],
		supplements: [],
		onDataLoad: action("onDataLoad"),
	},
	parameters: {
		docs: {
			description: {
				story:
					"Stan pusty - brak danych do wyświetlenia. Testuje obsługę pustych zbiorów danych.",
			},
		},
	},
};

// Only supplements (no neurotransmitters or brain regions)
export const SupplementsOnly: Story = {
	args: {
		nodes: polishSupplementNodes.filter((n) => n.type === "SUPPLEMENT"),
		relationships: polishRelationships.filter((r) => {
			const supplementIds = polishSupplementNodes
				.filter((n) => n.type === "SUPPLEMENT")
				.map((n) => n.id);
			return (
				supplementIds.includes(r.sourceId) && supplementIds.includes(r.targetId)
			);
		}),
		supplements: polishSupplements,
		onDataLoad: action("onDataLoad"),
	},
	parameters: {
		docs: {
			description: {
				story:
					"Graf zawierający tylko suplementy - przydatny do analizy interakcji między suplementami.",
			},
		},
	},
};

// High evidence only
export const HighEvidenceOnly: Story = {
	args: {
		nodes: polishSupplementNodes.filter((n) => n.evidenceLevel === "STRONG"),
		relationships: polishRelationships.filter(
			(r) => r.evidenceLevel === "STRONG",
		),
		supplements: polishSupplements,
		onDataLoad: action("onDataLoad"),
	},
	parameters: {
		docs: {
			description: {
				story:
					"Graf pokazujący tylko węzły i relacje z silnymi dowodami naukowymi.",
			},
		},
	},
};

// Interactive testing story
export const InteractiveTest: Story = {
	args: {
		nodes: polishSupplementNodes,
		relationships: polishRelationships,
		supplements: polishSupplements,
		onDataLoad: action("onDataLoad"),
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		// Test sidebar toggle
		const sidebarToggle = canvas.getByRole("button", {
			name: /panel kontrolny/i,
		});
		await userEvent.click(sidebarToggle);

		// Test legend toggle
		const legendToggle = canvas.getByRole("button", { name: /legenda/i });
		await userEvent.click(legendToggle);

		// Test layout change
		const layoutButton = canvas.getByRole("button", { name: /hierarchiczny/i });
		await userEvent.click(layoutButton);

		// Verify graph is rendered
		expect(canvas.getByText("Graf wiedzy o suplementach")).toBeInTheDocument();
	},
	parameters: {
		docs: {
			description: {
				story:
					"Interaktywny test funkcjonalności dashboardu z automatycznymi akcjami użytkownika.",
			},
		},
	},
};

// Polish diacritics test
export const PolishDiacriticsTest: Story = {
	args: {
		nodes: [
			{
				id: "diacritics-test",
				name: "Diacritics Test",
				polishName: "Test polskich znaków: ąćęłńóśźż",
				type: "SUPPLEMENT",
				description: "Testing Polish diacritics",
				polishDescription:
					"Testowanie polskich znaków diakrytycznych: ąćęłńóśźż",
				category: "Test",
				evidenceLevel: "MODERATE",
				size: 10,
				importance: 0.5,
				x: 100,
				y: 100,
			},
		],
		relationships: [],
		supplements: polishSupplements,
		onDataLoad: action("onDataLoad"),
	},
	parameters: {
		docs: {
			description: {
				story:
					"Test poprawnego wyświetlania polskich znaków diakrytycznych w grafie.",
			},
		},
	},
};

// Mobile responsive test
export const MobileView: Story = {
	args: {
		nodes: polishSupplementNodes.slice(0, 4),
		relationships: polishRelationships.slice(0, 3),
		supplements: polishSupplements,
		onDataLoad: action("onDataLoad"),
	},
	parameters: {
		viewport: {
			defaultViewport: "mobile1",
		},
		docs: {
			description: {
				story:
					"Widok mobilny dashboardu - testuje responsywność na małych ekranach.",
			},
		},
	},
};

// Dark mode test (if supported)
export const DarkMode: Story = {
	args: {
		nodes: polishSupplementNodes,
		relationships: polishRelationships,
		supplements: polishSupplements,
		onDataLoad: action("onDataLoad"),
		className: "dark",
	},
	parameters: {
		backgrounds: {
			default: "dark",
		},
		docs: {
			description: {
				story:
					"Dashboard w trybie ciemnym (jeśli obsługiwany przez aplikację).",
			},
		},
	},
};
