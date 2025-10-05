import { neuroplasticityMechanisms } from "@/data/neuroplasticity-mechanisms-advanced";
import { synergyData } from "@/data/synergistic-effects";
import type {
	EvidenceLevel,
	KnowledgeNode,
	KnowledgeRelationship,
	NodeType,
	RelationshipType,
} from "@/types/knowledge-graph";
import type { SupplementWithRelations } from "@/types/supplement";

import { ashwagandha } from "@/data/supplements/ashwagandha";
import { bacopa } from "@/data/supplements/bacopa";
import { ginkgoBiloba as ginkgo } from "@/data/supplements/ginkgo-biloba";
import { lTheanineData } from "@/data/supplements/l-theanine";
import { lionsMane } from "@/data/supplements/lions-mane";
import { magnesiumData } from "@/data/supplements/magnesium";
// Import supplement data
import { omegaThreeData } from "@/data/supplements/omega-3";
import { phosphatidylserine } from "@/data/supplements/phosphatidylserine";
import { rhodiolaRosea as rhodiola } from "@/data/supplements/rhodiola-rosea";
import { vitaminD3Data as vitaminDData } from "@/data/supplements/vitamin-d3";

export interface GraphDataServiceOptions {
	includeSupplements?: boolean;
	includeNeurotransmitters?: boolean;
	includeBrainRegions?: boolean;
	includeCognitiveFunctions?: boolean;
	includePathways?: boolean;
	includeMechanisms?: boolean;
	minEvidenceLevel?: EvidenceLevel;
	maxNodes?: number;
}

export class GraphDataService {
	private supplements: SupplementWithRelations[] = [];
	private nodes: KnowledgeNode[] = [];
	private relationships: KnowledgeRelationship[] = [];

	constructor() {
		this.initializeSupplementData();
	}

	private initializeSupplementData() {
		this.supplements = [
			omegaThreeData,
			magnesiumData,
			vitaminDData,
			lTheanineData,
			bacopa,
			rhodiola,
			ginkgo,
			ashwagandha,
			lionsMane,
			phosphatidylserine,
		];
	}

	/**
	 * Generate knowledge graph nodes and relationships from supplement data
	 */
	public async generateGraphData(
		options: GraphDataServiceOptions = {},
	): Promise<{
		nodes: KnowledgeNode[];
		relationships: KnowledgeRelationship[];
		supplements: SupplementWithRelations[];
	}> {
		const {
			includeSupplements = true,
			includeNeurotransmitters = true,
			includeBrainRegions = true,
			includeCognitiveFunctions = true,
			includePathways = true,
			includeMechanisms = true,
			minEvidenceLevel = "WEAK",
			maxNodes = 1000,
		} = options;

		this.nodes = [];
		this.relationships = [];

		// Generate supplement nodes
		if (includeSupplements) {
			this.generateSupplementNodes();
		}

		// Generate neurotransmitter nodes
		if (includeNeurotransmitters) {
			this.generateNeurotransmitterNodes();
		}

		// Generate brain region nodes
		if (includeBrainRegions) {
			this.generateBrainRegionNodes();
		}

		// Generate cognitive function nodes
		if (includeCognitiveFunctions) {
			this.generateCognitiveFunctionNodes();
		}

		// Generate pathway nodes
		if (includePathways) {
			this.generatePathwayNodes();
		}

		// Generate mechanism nodes
		if (includeMechanisms) {
			this.generateMechanismNodes();
		}

		// Generate relationships
		this.generateSupplementRelationships();
		this.generateSynergyRelationships();
		this.generateNeuroplasticityRelationships();

		// Filter by evidence level
		this.relationships = this.relationships.filter(
			(rel) =>
				this.getEvidenceLevelWeight(rel.evidenceLevel) >=
				this.getEvidenceLevelWeight(minEvidenceLevel),
		);

		// Limit nodes if necessary
		if (this.nodes.length > maxNodes) {
			// Sort by importance and take top nodes
			this.nodes.sort((a, b) => (b.importance || 0) - (a.importance || 0));
			this.nodes = this.nodes.slice(0, maxNodes);

			// Filter relationships to only include those between remaining nodes
			const nodeIds = new Set(this.nodes.map((n) => n.id));
			this.relationships = this.relationships.filter(
				(rel) => nodeIds.has(rel.sourceId) && nodeIds.has(rel.targetId),
			);
		}

		return {
			nodes: this.nodes,
			relationships: this.relationships,
			supplements: this.supplements,
		};
	}

	private generateSupplementNodes() {
		this.supplements.forEach((supplement) => {
			const node: KnowledgeNode = {
				id: supplement.id,
				name: supplement.name,
				polishName: supplement.polishName,
				type: "SUPPLEMENT" as NodeType,
				description: supplement.description || "No description available",
				polishDescription: supplement.polishDescription,
				category: supplement.category,
				evidenceLevel: this.calculateSupplementEvidenceLevel(supplement),
				size: this.calculateNodeSize(supplement),
				importance: this.calculateSupplementImportance(supplement),
				x: Math.random() * 800,
				y: Math.random() * 600,
				color: this.getNodeColor(supplement.category),
				properties: {
					supplementId: supplement.id,
					category: supplement.category,
					clinicalApplications: supplement.clinicalApplications.length,
					researchStudies: supplement.researchStudies.length,
					activeCompounds: supplement.activeCompounds.length,
				},
				tags: supplement.activeCompounds.map((compound) => compound.name),
				sources: supplement.researchStudies.map((study) => study.title),
				lastUpdated: new Date().toISOString(),
				createdAt: new Date().toISOString(),
			};
			this.nodes.push(node);
		});
	}

	private generateNeurotransmitterNodes() {
		const neurotransmitters = [
			{
				id: "dopamine",
				name: "Dopamine",
				polishName: "Dopamina",
				description: "Neurotransmitter związany z motywacją i nagrodą",
			},
			{
				id: "serotonin",
				name: "Serotonin",
				polishName: "Serotonina",
				description: "Neurotransmitter regulujący nastrój i sen",
			},
			{
				id: "norepinephrine",
				name: "Norepinephrine",
				polishName: "Noradrenalina",
				description: "Neurotransmitter związany z uwagą i czujnością",
			},
			{
				id: "acetylcholine",
				name: "Acetylcholine",
				polishName: "Acetylocholina",
				description: "Neurotransmitter ważny dla pamięci i uczenia się",
			},
			{
				id: "gaba",
				name: "GABA",
				polishName: "GABA",
				description: "Główny hamujący neurotransmitter w mózgu",
			},
			{
				id: "glutamate",
				name: "Glutamate",
				polishName: "Glutaminian",
				description: "Główny pobudzający neurotransmitter w mózgu",
			},
		];

		neurotransmitters.forEach((nt) => {
			const node: KnowledgeNode = {
				id: nt.id,
				name: nt.name,
				polishName: nt.polishName,
				type: "NEUROTRANSMITTER" as NodeType,
				description: nt.description,
				polishDescription: nt.description,
				category: "Neurotransmitter",
				evidenceLevel: "STRONG" as EvidenceLevel,
				size: 10,
				importance: 0.9,
				x: Math.random() * 800,
				y: Math.random() * 600,
				color: this.getNodeColor("neurotransmitter"),
				properties: {
					chemicalFormula: "C8H11NO2",
					molecularWeight: 153.18,
					halfLife: "Short-acting",
					synthesisPathway: ["Tyrosine", "Phenylalanine"],
					degradationPathway: ["MAO", "COMT"],
					receptorTypes: ["D1", "D2", "D3", "D4", "D5"],
					brainRegions: ["Striatum", "Prefrontal cortex"],
					functions: ["Motivation", "Reward", "Motor control"],
					deficiencySymptoms: ["Anhedonia", "Lack of motivation"],
					excessSymptoms: ["Psychosis", "Mania"],
				},
				tags: [nt.name.toLowerCase(), "neurotransmitter", "brain-chemistry"],
				sources: ["Textbook of Medical Physiology", "Neuroscience journals"],
				lastUpdated: new Date().toISOString(),
				createdAt: new Date().toISOString(),
			};
			this.nodes.push(node);
		});
	}

	private generateBrainRegionNodes() {
		const brainRegions = [
			{
				id: "prefrontal-cortex",
				name: "Prefrontal Cortex",
				polishName: "Kora przedczołowa",
				description: "Odpowiedzialna za funkcje wykonawcze",
			},
			{
				id: "hippocampus",
				name: "Hippocampus",
				polishName: "Hipokamp",
				description: "Kluczowy dla pamięci i uczenia się",
			},
			{
				id: "amygdala",
				name: "Amygdala",
				polishName: "Ciało migdałowate",
				description: "Centrum przetwarzania emocji",
			},
			{
				id: "striatum",
				name: "Striatum",
				polishName: "Prążkowie",
				description: "Część systemu nagrody i motywacji",
			},
			{
				id: "cerebellum",
				name: "Cerebellum",
				polishName: "Móżdżek",
				description: "Koordynacja ruchowa i równowaga",
			},
		];

		brainRegions.forEach((region) => {
			const node: KnowledgeNode = {
				id: region.id,
				name: region.name,
				polishName: region.polishName,
				type: "BRAIN_REGION" as NodeType,
				description: region.description,
				polishDescription: region.description,
				category: "Brain Region",
				evidenceLevel: "STRONG" as EvidenceLevel,
				size: 12,
				importance: 0.8,
				x: Math.random() * 800,
				y: Math.random() * 600,
				color: this.getNodeColor("brain-region"),
				properties: {
					anatomicalLocation: region.name,
					volume: 100,
					functions: ["Executive function", "Decision making"],
					neurotransmitters: ["Glutamate", "GABA"],
					connections: ["Thalamus", "Amygdala"],
					disorders: ["ADHD", "Depression"],
					development: "Develops throughout adolescence",
				},
				tags: [region.name.toLowerCase(), "brain-region", "neuroscience"],
				sources: ["Human Brain Mapping", "Neuroanatomy textbooks"],
				lastUpdated: new Date().toISOString(),
				createdAt: new Date().toISOString(),
			};
			this.nodes.push(node);
		});
	}

	private generateCognitiveFunctionNodes() {
		const cognitiveFunctions = [
			{
				id: "memory",
				name: "Memory",
				polishName: "Pamięć",
				description: "Zdolność do przechowywania i odzyskiwania informacji",
			},
			{
				id: "attention",
				name: "Attention",
				polishName: "Uwaga",
				description: "Zdolność do skupienia się na określonych bodźcach",
			},
			{
				id: "executive-function",
				name: "Executive Function",
				polishName: "Funkcje wykonawcze",
				description: "Planowanie, kontrola i elastyczność poznawcza",
			},
			{
				id: "mood",
				name: "Mood",
				polishName: "Nastrój",
				description: "Stan emocjonalny i samopoczucie",
			},
			{
				id: "stress-response",
				name: "Stress Response",
				polishName: "Odpowiedź na stres",
				description: "Reakcja organizmu na czynniki stresowe",
			},
		];

		cognitiveFunctions.forEach((func) => {
			const node: KnowledgeNode = {
				id: func.id,
				name: func.name,
				polishName: func.polishName,
				type: "COGNITIVE_FUNCTION" as NodeType,
				description: func.description,
				polishDescription: func.description,
				category: "Cognitive Function",
				evidenceLevel: "MODERATE" as EvidenceLevel,
				size: 8,
				importance: 0.7,
				x: Math.random() * 800,
				y: Math.random() * 600,
				color: this.getNodeColor("cognitive-function"),
				properties: {
					domain: "Cognitive Psychology",
					subFunctions: ["Working memory", "Long-term memory"],
					brainRegions: ["Hippocampus", "Prefrontal cortex"],
					neurotransmitters: ["Glutamate", "Acetylcholine"],
					assessmentMethods: ["Neuropsychological testing"],
					developmentalTrajectory: "Develops throughout life",
					disorders: ["Alzheimer's", "ADHD"],
				},
				tags: [func.name.toLowerCase(), "cognitive-function", "psychology"],
				sources: ["Cognitive Psychology textbooks", "Neuroscience journals"],
				lastUpdated: new Date().toISOString(),
				createdAt: new Date().toISOString(),
			};
			this.nodes.push(node);
		});
	}

	private generatePathwayNodes() {
		const pathways = [
			{
				id: "dopaminergic-pathway",
				name: "Dopaminergic Pathway",
				polishName: "Szlak dopaminergiczny",
				description: "Ścieżka sygnalizacji dopaminy",
			},
			{
				id: "serotonergic-pathway",
				name: "Serotonergic Pathway",
				polishName: "Szlak serotoninergiczny",
				description: "Ścieżka sygnalizacji serotoniny",
			},
			{
				id: "cholinergic-pathway",
				name: "Cholinergic Pathway",
				polishName: "Szlak cholinergiczny",
				description: "Ścieżka sygnalizacji acetylocholiny",
			},
			{
				id: "gabaergic-pathway",
				name: "GABAergic Pathway",
				polishName: "Szlak GABAergiczny",
				description: "Ścieżka hamująca GABA",
			},
		];

		pathways.forEach((pathway) => {
			const node: KnowledgeNode = {
				id: pathway.id,
				name: pathway.name,
				polishName: pathway.polishName,
				type: "PATHWAY" as NodeType,
				description: pathway.description,
				polishDescription: pathway.description,
				category: "Biochemical Pathway",
				evidenceLevel: "MODERATE" as EvidenceLevel,
				size: 6,
				importance: 0.6,
				x: Math.random() * 800,
				y: Math.random() * 600,
				color: this.getNodeColor("pathway"),
				properties: {
					pathwayType: "Neurotransmitter pathway",
					components: ["Receptors", "Transporters", "Enzymes"],
					regulation: "Feedback mechanisms",
					associatedDisorders: ["Parkinson's", "Depression"],
				},
				tags: [pathway.name.toLowerCase(), "pathway", "biochemistry"],
				sources: ["Biochemistry textbooks", "Pharmacology journals"],
				lastUpdated: new Date().toISOString(),
				createdAt: new Date().toISOString(),
			};
			this.nodes.push(node);
		});
	}

	private generateMechanismNodes() {
		neuroplasticityMechanisms.forEach((mechanism) => {
			const node: KnowledgeNode = {
				id: mechanism.id,
				name: mechanism.name,
				polishName: mechanism.polishName,
				type: "MECHANISM" as NodeType,
				description: mechanism.description,
				polishDescription: mechanism.polishDescription,
				category: "Neuroplasticity Mechanism",
				evidenceLevel: mechanism.evidenceLevel as EvidenceLevel,
				size: 5,
				importance: 0.5,
				x: Math.random() * 800,
				y: Math.random() * 600,
				color: this.getNodeColor("mechanism"),
				properties: {
					mechanismType: mechanism.pathway || "Unknown pathway",
					targetRegions: mechanism.affectedBrainRegions || [],
					timeframe: mechanism.temporalProfile?.duration || "Unknown duration",
				},
				tags: [mechanism.name.toLowerCase(), "mechanism", "neuroplasticity"],
				sources: ["Neuroscience research", "Neuroplasticity studies"],
				lastUpdated: new Date().toISOString(),
				createdAt: new Date().toISOString(),
			};
			this.nodes.push(node);
		});
	}

	private generateSupplementRelationships() {
		this.supplements.forEach((supplement) => {
			// Create relationships based on clinical applications
			supplement.clinicalApplications.forEach((application) => {
				const targetNodeId = this.findCognitiveFunctionNodeId(
					application.polishCondition,
				);
				if (targetNodeId) {
					const relationship: KnowledgeRelationship = {
						id: `${supplement.id}-enhances-${targetNodeId}`,
						sourceId: supplement.id,
						targetId: targetNodeId,
						type: "ENHANCES" as RelationshipType,
						strength: application.effectivenessRating / 10,
						confidence: 0.8,
						mechanism: application.condition,
						polishMechanism: application.polishCondition,
						evidenceLevel: application.evidenceLevel as EvidenceLevel,
						bidirectional: false,
						lastUpdated: new Date().toISOString(),
						createdAt: new Date().toISOString(),
					};
					this.relationships.push(relationship);
				}
			});

			// Create relationships with neurotransmitters
			supplement.activeCompounds.forEach((compound) => {
				if (compound.name) {
					const neurotransmitterIds = this.extractNeurotransmitterIds(
						compound.name,
					);
					neurotransmitterIds.forEach((ntId) => {
						const relationship: KnowledgeRelationship = {
							id: `${supplement.id}-modulates-${ntId}`,
							sourceId: supplement.id,
							targetId: ntId,
							type: "MODULATES" as RelationshipType,
							strength: 0.6,
							confidence: 0.7,
							mechanism: compound.name,
							polishMechanism: compound.name,
							evidenceLevel: "MODERATE" as EvidenceLevel,
							bidirectional: false,
							lastUpdated: new Date().toISOString(),
							createdAt: new Date().toISOString(),
						};
						this.relationships.push(relationship);
					});
				}
			});
		});
	}

	private generateSynergyRelationships() {
		synergyData.forEach((synergy) => {
			// Create relationships between all supplement pairs in the synergy
			for (let i = 0; i < synergy.supplements.length; i++) {
				for (let j = i + 1; j < synergy.supplements.length; j++) {
					const sourceId = synergy.supplements[i];
					const targetId = synergy.supplements[j];

					if (sourceId && targetId) {
						const relationship: KnowledgeRelationship = {
							id: `${synergy.id}-${sourceId}-${targetId}`,
							sourceId: sourceId,
							targetId: targetId,
							type: "SYNERGIZES" as RelationshipType,
							strength: 0.8,
							confidence: 0.9,
							mechanism: synergy.mechanism,
							polishMechanism: synergy.polishMechanism,
							evidenceLevel: synergy.evidenceLevel as EvidenceLevel,
							bidirectional: true,
							lastUpdated: new Date().toISOString(),
							createdAt: new Date().toISOString(),
						};
						this.relationships.push(relationship);
					}
				}
			}
		});
	}

	private generateNeuroplasticityRelationships() {
		neuroplasticityMechanisms.forEach((mechanism) => {
			// Connect mechanisms to brain regions
			mechanism.affectedBrainRegions.forEach((region: string) => {
				const brainRegionId = this.findBrainRegionNodeId(region);
				if (brainRegionId) {
					const relationship: KnowledgeRelationship = {
						id: `${mechanism.id}-affects-${brainRegionId}`,
						sourceId: mechanism.id,
						targetId: brainRegionId,
						type: "MODULATES" as RelationshipType,
						strength: 0.7,
						confidence: 0.8,
						mechanism: mechanism.description,
						polishMechanism: mechanism.polishDescription,
						evidenceLevel: mechanism.evidenceLevel as EvidenceLevel,
						bidirectional: false,
						lastUpdated: new Date().toISOString(),
						createdAt: new Date().toISOString(),
					};
					this.relationships.push(relationship);
				}
			});

			// Connect supplements to mechanisms
			this.supplements.forEach((supplement) => {
				if (
					supplement.activeCompounds.some(
						(compound) =>
							compound.name
								.toLowerCase()
								.includes(mechanism.name.toLowerCase()) ||
							mechanism.description
								.toLowerCase()
								.includes(supplement.name.toLowerCase()),
					)
				) {
					const relationship: KnowledgeRelationship = {
						id: `${supplement.id}-triggers-${mechanism.id}`,
						sourceId: supplement.id,
						targetId: mechanism.id,
						type: "PRODUCES" as RelationshipType,
						strength: 0.5,
						confidence: 0.6,
						mechanism: `${supplement.polishName} aktywuje ${mechanism.polishName}`,
						polishMechanism: `${supplement.polishName} aktywuje ${mechanism.polishName}`,
						evidenceLevel: "WEAK" as EvidenceLevel,
						bidirectional: false,
						lastUpdated: new Date().toISOString(),
						createdAt: new Date().toISOString(),
					};
					this.relationships.push(relationship);
				}
			});
		});
	}

	// Helper methods
	private calculateSupplementEvidenceLevel(
		supplement: SupplementWithRelations,
	): EvidenceLevel {
		const strongStudies = supplement.researchStudies.filter(
			(s) => s.evidenceLevel === "STRONG",
		).length;
		const moderateStudies = supplement.researchStudies.filter(
			(s) => s.evidenceLevel === "MODERATE",
		).length;
		const totalStudies = supplement.researchStudies.length;

		if (strongStudies >= 3) return "STRONG";
		if (strongStudies >= 1 || moderateStudies >= 3) return "MODERATE";
		if (totalStudies >= 2) return "WEAK";
		if (totalStudies >= 1) return "INSUFFICIENT";
		return "CONFLICTING";
	}

	private calculateNodeSize(supplement: SupplementWithRelations): number {
		const baseSize = 8;
		const studyBonus = Math.min(supplement.researchStudies.length * 0.5, 4);
		const applicationBonus = Math.min(
			supplement.clinicalApplications.length * 0.3,
			3,
		);
		return baseSize + studyBonus + applicationBonus;
	}

	private calculateSupplementImportance(
		supplement: SupplementWithRelations,
	): number {
		const studyWeight = supplement.researchStudies.length * 0.1;
		const applicationWeight = supplement.clinicalApplications.length * 0.05;
		const evidenceWeight =
			this.getEvidenceLevelWeight(
				this.calculateSupplementEvidenceLevel(supplement),
			) * 0.3;
		return Math.min(studyWeight + applicationWeight + evidenceWeight, 1.0);
	}

	private getEvidenceLevelWeight(level: EvidenceLevel): number {
		const weights = {
			STRONG: 1.0,
			MODERATE: 0.8,
			WEAK: 0.6,
			INSUFFICIENT: 0.4,
			CONFLICTING: 0.2,
		};
		return weights[level] || 0.2;
	}

	private findCognitiveFunctionNodeId(polishCondition: string): string | null {
		const mappings: Record<string, string> = {
			pamięć: "memory",
			uwaga: "attention",
			koncentracja: "attention",
			nastrój: "mood",
			stres: "stress-response",
			"funkcje wykonawcze": "executive-function",
		};

		const lowerCondition = polishCondition.toLowerCase();
		for (const [key, value] of Object.entries(mappings)) {
			if (lowerCondition.includes(key)) {
				return value;
			}
		}
		return null;
	}

	private findBrainRegionNodeId(region: string): string | null {
		const mappings: Record<string, string> = {
			prefrontal: "prefrontal-cortex",
			hippocampus: "hippocampus",
			amygdala: "amygdala",
			striatum: "striatum",
			cerebellum: "cerebellum",
		};

		const lowerRegion = region.toLowerCase();
		for (const [key, value] of Object.entries(mappings)) {
			if (lowerRegion.includes(key)) {
				return value;
			}
		}
		return null;
	}

	private extractNeurotransmitterIds(mechanism: string): string[] {
		const neurotransmitters: string[] = [];
		const lowerMechanism = mechanism.toLowerCase();

		if (lowerMechanism.includes("dopamin")) neurotransmitters.push("dopamine");
		if (lowerMechanism.includes("serotonin"))
			neurotransmitters.push("serotonin");
		if (
			lowerMechanism.includes("norepinephrine") ||
			lowerMechanism.includes("noradrenalina")
		)
			neurotransmitters.push("norepinephrine");
		if (
			lowerMechanism.includes("acetylcholine") ||
			lowerMechanism.includes("acetylocholina")
		)
			neurotransmitters.push("acetylcholine");
		if (lowerMechanism.includes("gaba")) neurotransmitters.push("gaba");
		if (
			lowerMechanism.includes("glutamate") ||
			lowerMechanism.includes("glutaminian")
		)
			neurotransmitters.push("glutamate");

		return neurotransmitters;
	}

	private getNodeColor(category: string): string {
		const colorMap: Record<string, string> = {
			nootropics: "#3B82F6",
			vitamins: "#10B981",
			minerals: "#F59E0B",
			herbs: "#8B5CF6",
			"amino-acids": "#EF4444",
			neurotransmitter: "#06B6D4",
			"brain-region": "#84CC16",
			"cognitive-function": "#F97316",
			pathway: "#EC4899",
			mechanism: "#6366F1",
		};

		return colorMap[category.toLowerCase()] || "#6B7280";
	}
}

// Export singleton instance
export const graphDataService = new GraphDataService();

// Export default options
export const defaultGraphDataOptions: GraphDataServiceOptions = {
	includeSupplements: true,
	includeNeurotransmitters: true,
	includeBrainRegions: true,
	includeCognitiveFunctions: true,
	includePathways: true,
	includeMechanisms: true,
	minEvidenceLevel: "WEAK",
	maxNodes: 500,
};
