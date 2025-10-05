import D3GraphVisualization from "@/components/graph/D3GraphVisualization";
import type {
	KnowledgeNode,
	KnowledgeRelationship,
} from "@/types/knowledge-graph";
import type { SupplementWithRelations } from "@/types/supplement";
import type { Meta, StoryObj } from "@storybook/react";

// Mock data for stories
const mockNodes: KnowledgeNode[] = [
	{
		id: "node-1",
		name: "Alpha-GPC",
		polishName: "Alfa-GPC",
		type: "SUPPLEMENT",
		description: "Choline supplement that crosses the blood-brain barrier",
		polishDescription:
			"Suplement cholinowy, który przechodzi barierę krew-mózg",
		evidenceLevel: "STRONG",
		category: "NOOTROPIC",
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
		x: 0,
		y: 0,
		size: 10,
		importance: 1,
	},
	{
		id: "node-2",
		name: "Acetylcholine",
		polishName: "Acetylocholina",
		type: "NEUROTRANSMITTER",
		description: "Primary neurotransmitter for memory and learning",
		polishDescription: "Główny neuroprzekaźnik dla pamięci i uczenia się",
		evidenceLevel: "STRONG",
		category: "NEUROTRANSMITTER",
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
		x: 100,
		y: 100,
		size: 8,
		importance: 0.8,
	},
	{
		id: "node-3",
		name: "Hippocampus",
		polishName: "Hipokamp",
		type: "BRAIN_REGION",
		description: "Brain region critical for memory formation",
		polishDescription: "Obszar mózgu krytyczny dla tworzenia pamięci",
		evidenceLevel: "STRONG",
		category: "BRAIN_REGION",
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
		x: 200,
		y: 50,
		size: 12,
		importance: 0.9,
	},
];

const mockRelationships: KnowledgeRelationship[] = [
	{
		id: "rel-1",
		sourceId: "node-1",
		targetId: "node-2",
		type: "ENHANCES",
		mechanism: "Provides choline for acetylcholine synthesis",
		polishMechanism: "Dostarcza cholinę do syntezy acetylocholiny",
		strength: 0.8,
		confidence: 0.9,
		evidenceLevel: "STRONG",
		description: "Alpha-GPC enhances acetylcholine production",
		polishDescription: "Alfa-GPC wzmacnia produkcję acetylocholiny",
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	},
	{
		id: "rel-2",
		sourceId: "node-2",
		targetId: "node-3",
		type: "MODULATES",
		mechanism: "Facilitates memory formation in the hippocampus",
		polishMechanism: "Ułatwia tworzenie pamięci w hipokampie",
		strength: 0.7,
		confidence: 0.8,
		evidenceLevel: "STRONG",
		description: "Acetylcholine modulates hippocampal function",
		polishDescription: "Acetylocholina moduluje funkcję hipokampa",
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	},
];

const mockSupplements: SupplementWithRelations[] = [
	{
		id: "supp-1",
		name: "Alpha-GPC",
		polishName: "Alfa-GPC",
		scientificName: "L-Alpha glycerylphosphorylcholine",
		commonNames: ["Choline alfoscerate", "GPC"],
		polishCommonNames: ["Alfoscerat choliny", "GPC"],
		category: "NOOTROPIC",
		description:
			"Alpha-GPC is a highly bioavailable form of choline that crosses the blood-brain barrier effectively.",
		polishDescription:
			"Alfa-GPC to wysoce biodostępna forma choliny, która skutecznie przekracza barierę krew-mózg.",
		activeCompounds: [
			{
				name: "Alpha-GPC",
				polishName: "Alfa-GPC",
				concentration: "300mg",
				bioavailability: 95,
				halfLife: "4-6 hours",
				metabolicPathway: ["Cholinergic pathway", "Phospholipid metabolism"],
				targetReceptors: ["Nicotinic receptors", "Muscarinic receptors"],
			},
		],
		clinicalApplications: [
			{
				condition: "Cognitive enhancement",
				polishName: "Wzmocnienie funkcji poznawczych",
				efficacy: "moderate",
				evidenceLevel: "STRONG",
				recommendedDose: "300-600mg daily",
				duration: "4-12 weeks for noticeable effects",
			},
		],
		mechanisms: [
			{
				id: "cholinergic-enhancement",
				name: "Cholinergic neurotransmission enhancement",
				polishName: "Wzmocnienie neurotransmisji cholinergicznej",
				pathway: "Cholinergic pathway",
				description:
					"Alpha-GPC provides choline for acetylcholine synthesis and contributes to cell membrane integrity through phospholipid production.",
				polishDescription:
					"Alfa-GPC dostarcza cholinę do syntezy acetylocholiny i przyczynia się do integralności błon komórkowych poprzez produkcję fosfolipidów.",
				evidenceLevel: "STRONG",
				targetSystems: ["Central nervous system", "Cholinergic system"],
				timeToEffect: "30-60 minutes",
				duration: "4-6 hours",
			},
		],
		dosageGuidelines: {
			therapeuticRange: {
				min: 300,
				max: 1200,
				unit: "mg",
			},
			timing: ["morning", "afternoon"],
			withFood: true,
			contraindications: ["bipolar disorder"],
			interactions: [],
		},
		safetyProfile: {
			adverseEffects: [
				{
					effect: "Headache",
					frequency: "uncommon",
					severity: "mild",
					reversible: true,
				},
			],
		},
		qualityMarkers: {
			purity: 98,
		},
		researchStudies: [
			{
				title: "Alpha-GPC and power output; growth hormone response",
				authors: ["Ziegenfuss T", "Landis J", "Hofheins J"],
				journal: "Journal of the International Society of Sports Nutrition",
				year: 2008,
				studyType: "randomized_controlled_trial",
				primaryOutcome: "Power output and growth hormone response",
				findings:
					"Alpha-GPC supplementation increased power output and growth hormone response",
				evidenceLevel: "moderate",
				lastUpdated: "2024-01-15T00:00:00Z",
				pubmedId: "18834505",
			},
		],
		regulatoryStatus: {
			fda: "dietary_supplement",
		},
		lastUpdated: "2024-01-15T00:00:00Z",
		createdAt: "2024-01-15T00:00:00Z",
		knowledgeNodeId: "node-1",
	},
];

const meta: Meta<typeof D3GraphVisualization> = {
	title: "Components/Graph/D3GraphVisualization",
	component: D3GraphVisualization,
	parameters: {
		layout: "fullscreen",
	},
	argTypes: {
		width: {
			control: "number",
			description: "Width of the graph visualization in pixels",
		},
		height: {
			control: "number",
			description: "Height of the graph visualization in pixels",
		},
		nodeSize: {
			control: "number",
			description: "Size of nodes in the visualization",
		},
		linkDistance: {
			control: "number",
			description: "Distance between linked nodes",
		},
		className: {
			control: "text",
			description:
				"Additional CSS classes to apply to the visualization container",
		},
	},
};

export default meta;
type Story = StoryObj<typeof D3GraphVisualization>;

export const Default: Story = {
	args: {
		nodes: mockNodes,
		relationships: mockRelationships,
		supplements: mockSupplements,
		width: 800,
		height: 600,
		nodeSize: 10,
		linkDistance: 100,
	},
};

export const SmallGraph: Story = {
	args: {
		nodes: mockNodes.slice(0, 2),
		relationships: mockRelationships.slice(0, 1),
		supplements: mockSupplements.slice(0, 1),
		width: 600,
		height: 400,
		nodeSize: 8,
		linkDistance: 80,
	},
};

export const LargeGraph: Story = {
	args: {
		nodes: Array.from({ length: 50 }, (_, i) => ({
			id: `node-${i}`,
			name: `Node ${i}`,
			polishName: `Węzeł ${i}`,
			type:
				i % 3 === 0
					? "SUPPLEMENT"
					: i % 3 === 1
						? "NEUROTRANSMITTER"
						: "BRAIN_REGION",
			description: `Description for node ${i}`,
			polishDescription: `Opis dla węzła ${i}`,
			evidenceLevel:
				i % 4 === 0
					? "STRONG"
					: i % 4 === 1
						? "MODERATE"
						: i % 4 === 2
							? "WEAK"
							: "INSUFFICIENT",
			category:
				i % 3 === 0
					? "NOOTROPIC"
					: i % 3 === 1
						? "NEUROTRANSMITTER"
						: "BRAIN_REGION",
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			x: (i % 10) * 50,
			y: Math.floor(i / 10) * 50,
			size: 5 + (i % 10),
			importance: 0.1 + (i % 100) / 100,
		})),
		relationships: Array.from({ length: 75 }, (_, i) => ({
			id: `rel-${i}`,
			sourceId: `node-${i % 50}`,
			targetId: `node-${(i + 1) % 50}`,
			type:
				i % 5 === 0
					? "ENHANCES"
					: i % 5 === 1
						? "INHIBITS"
						: i % 5 === 2
							? "MODULATES"
							: i % 5 === 3
								? "SYNERGIZES"
								: "ANTAGONIZES",
			mechanism: `Mechanism ${i}`,
			polishMechanism: `Mechanizm ${i}`,
			strength: 0.1 + (i % 100) / 100,
			confidence: 0.5 + (i % 50) / 100,
			evidenceLevel:
				i % 4 === 0
					? "STRONG"
					: i % 4 === 1
						? "MODERATE"
						: i % 4 === 2
							? "WEAK"
							: "INSUFFICIENT",
			description: `Description for relationship ${i}`,
			polishDescription: `Opis dla relacji ${i}`,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		})),
		supplements: Array.from({ length: 20 }, (_, i) => ({
			id: `supp-${i}`,
			name: `Supplement ${i}`,
			polishName: `Suplement ${i}`,
			scientificName: `Scientific Name ${i}`,
			commonNames: [`Common Name ${i}`],
			polishCommonNames: [`Pospolita Nazwa ${i}`],
			category: "NOOTROPIC",
			description: `Description for supplement ${i}`,
			polishDescription: `Opis dla suplementu ${i}`,
			activeCompounds: [],
			clinicalApplications: [],
			mechanisms: [],
			dosageGuidelines: {
				therapeuticRange: { min: 100, max: 200, unit: "mg" },
				timing: ["morning"],
				withFood: true,
				contraindications: [],
				interactions: [],
			},
			sideEffects: [],
			interactions: [],
			evidenceLevel: "STRONG",
			researchStudies: [],
			tags: [],
			lastUpdated: new Date().toISOString(),
			createdAt: new Date().toISOString(),
			knowledgeNodeId: `node-${i}`,
		})),
		width: 1000,
		height: 800,
		nodeSize: 6,
		linkDistance: 120,
	},
};

export const ForceDirectedLayout: Story = {
	args: {
		nodes: mockNodes,
		relationships: mockRelationships,
		supplements: mockSupplements,
		width: 800,
		height: 600,
		nodeSize: 10,
		linkDistance: 100,
		layout: "force",
	},
};

export const RadialLayout: Story = {
	args: {
		nodes: mockNodes,
		relationships: mockRelationships,
		supplements: mockSupplements,
		width: 800,
		height: 600,
		nodeSize: 10,
		linkDistance: 100,
		layout: "radial",
	},
};

export const HierarchicalLayout: Story = {
	args: {
		nodes: mockNodes,
		relationships: mockRelationships,
		supplements: mockSupplements,
		width: 800,
		height: 600,
		nodeSize: 10,
		linkDistance: 100,
		layout: "hierarchical",
	},
};

export const CustomStyling: Story = {
	args: {
		nodes: mockNodes,
		relationships: mockRelationships,
		supplements: mockSupplements,
		width: 800,
		height: 600,
		nodeSize: 12,
		linkDistance: 150,
		className: "border-2 border-blue-500 rounded-lg bg-gray-100",
	},
};
