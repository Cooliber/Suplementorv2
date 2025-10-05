/**
 * Graph Database Integration Service
 * Shows how the graph system integrates with the existing MongoDB supplement database
 * and external APIs for real-time data updates
 *
 * TODO: Add Prisma models for supplement, knowledgeNode, knowledgeRelationship to schema.prisma
 * Currently disabled because these models don't exist in Prisma schema
 */

// @ts-nocheck - Disabled until Prisma schema includes required models
/* eslint-disable */

import { db } from "@/server/db";
import type {
	KnowledgeNode,
	KnowledgeRelationship,
	RelationshipType,
} from "@/types/knowledge-graph";
import type { SupplementWithRelations } from "@/types/supplement";
import { cache } from "react";

// Define the data mapping between supplement data and graph nodes
interface SupplementToGraphNodeMapping {
	supplement: SupplementWithRelations;
	nodeId: string;
	nodeType:
		| "SUPPLEMENT"
		| "NEUROTRANSMITTER"
		| "BRAIN_REGION"
		| "COGNITIVE_FUNCTION"
		| "PATHWAY"
		| "MECHANISM";
	relationships: KnowledgeRelationship[];
}

// Cached database access functions
const getCachedSupplements = cache(async () => {
	return await db.supplement.findMany({
		include: {
			activeCompounds: true,
			clinicalApplications: true,
			mechanisms: true,
			dosageGuidelines: true,
			sideEffects: true,
			interactions: true,
			researchStudies: true,
		},
	});
});

const getCachedKnowledgeNodes = cache(async () => {
	return await db.knowledgeNode.findMany();
});

const getCachedKnowledgeRelationships = cache(async () => {
	return await db.knowledgeRelationship.findMany();
});

/**
 * Integration service for connecting graph visualization with database
 */
export class GraphDatabaseIntegrationService {
	/**
	 * Fetches and transforms supplement data into graph-compatible format
	 */
	static async getSupplementGraphData(): Promise<{
		nodes: KnowledgeNode[];
		relationships: KnowledgeRelationship[];
		supplements: SupplementWithRelations[];
	}> {
		try {
			// Fetch data from database using cached functions
			const [supplements, knowledgeNodes, knowledgeRelationships] =
				await Promise.all([
					getCachedSupplements(),
					getCachedKnowledgeNodes(),
					getCachedKnowledgeRelationships(),
				]);

			// Create mapping from supplement data to graph nodes
			const supplementNodes: KnowledgeNode[] = supplements.map(
				(supplement) => ({
					id: `supplement-${supplement.id}`,
					name: supplement.name,
					polishName: supplement.polishName,
					type: "SUPPLEMENT",
					description: supplement.description || "",
					polishDescription:
						supplement.polishDescription || supplement.description || "",
					evidenceLevel: supplement.evidenceLevel,
					category: supplement.category,
					createdAt: supplement.createdAt.toISOString(),
					updatedAt: supplement.updatedAt.toISOString(),
					x: 0, // Will be positioned by visualization
					y: 0,
					size: 12,
					importance: 1,
				}),
			);

			// Combine supplement nodes with knowledge graph nodes
			const allNodes = [
				...knowledgeNodes,
				...supplementNodes,
			] as KnowledgeNode[];

			// Create relationships based on supplement interactions and mechanisms
			const supplementRelationships: KnowledgeRelationship[] = [];

			for (const supplement of supplements) {
				// Add relationships for mechanisms of action
				for (const mechanism of supplement.mechanisms) {
					// Find corresponding knowledge nodes for this mechanism
					const mechanismNode = allNodes.find((n) =>
						n.name
							.toLowerCase()
							.includes(
								mechanism.name?.toLowerCase() ||
									mechanism.pathway.toLowerCase(),
							),
					);

					if (mechanismNode) {
						supplementRelationships.push({
							id: `rel-${supplement.id}-${mechanismNode.id}`,
							sourceId: `supplement-${supplement.id}`,
							targetId: mechanismNode.id,
							type: "MODULATES" as RelationshipType,
							mechanism: mechanism.description || mechanism.name || "",
							polishMechanism:
								mechanism.polishDescription || mechanism.name || "",
							strength: 0.7,
							confidence: 0.8,
							evidenceLevel: mechanism.evidenceLevel,
							bidirectional: false,
							lastUpdated: new Date().toISOString(),
							createdAt: new Date().toISOString(),
						});
					}
				}

				// Add relationships for supplement interactions
				for (const interaction of supplement.interactions) {
					// Find corresponding knowledge nodes for interacting substances
					const targetNode = allNodes.find(
						(n) =>
							n.name
								.toLowerCase()
								.includes(interaction.substance.toLowerCase()) ||
							n.polishName
								.toLowerCase()
								.includes(interaction.polishSubstance?.toLowerCase() || ""),
					);

					if (targetNode) {
						supplementRelationships.push({
							id: `interaction-${supplement.id}-${targetNode.id}`,
							sourceId: `supplement-${supplement.id}`,
							targetId: targetNode.id,
							type: GraphDatabaseIntegrationService.mapInteractionToRelationshipType(
								interaction.type,
							),
							mechanism: interaction.mechanism || interaction.substance || "",
							polishMechanism:
								interaction.polishMechanism ||
								interaction.polishSubstance ||
								"",
							strength:
								GraphDatabaseIntegrationService.interactionTypeToStrength(
									interaction.type,
								),
							confidence: 0.7,
							evidenceLevel: interaction.evidenceLevel || "MODERATE",
							bidirectional: false,
							lastUpdated: new Date().toISOString(),
							createdAt: new Date().toISOString(),
						});
					}
				}
			}

			// Combine with existing knowledge relationships
			const allRelationships = [
				...knowledgeRelationships,
				...supplementRelationships,
			] as KnowledgeRelationship[];

			return {
				nodes: allNodes,
				relationships: allRelationships,
				supplements,
			};
		} catch (error) {
			console.error("Error fetching graph data from database:", error);
			throw new Error("Failed to fetch graph data from database");
		}
	}

	/**
	 * Maps supplement interaction types to knowledge graph relationship types
	 */
	private static mapInteractionToRelationshipType(
		interactionType: string,
	): RelationshipType {
		switch (interactionType.toLowerCase()) {
			case "synergistic":
				return "SYNERGIZES";
			case "antagonistic":
				return "ANTAGONIZES";
			case "additive":
				return "ENHANCES";
			case "competitive":
				return "INHIBITS";
			default:
				return "MODULATES";
		}
	}

	/**
	 * Converts interaction type to relationship strength
	 */
	private static interactionTypeToStrength(interactionType: string): number {
		switch (interactionType.toLowerCase()) {
			case "synergistic":
				return 0.8;
			case "antagonistic":
				return 0.7;
			case "additive":
				return 0.6;
			case "competitive":
				return 0.6;
			case "beneficial":
				return 0.9;
			default:
				return 0.5;
		}
	}

	/**
	 * Syncs supplement data with knowledge graph nodes
	 */
	static async syncSupplementDataWithGraph(): Promise<void> {
		try {
			const supplements = await getCachedSupplements();

			for (const supplement of supplements) {
				// Check if a knowledge node exists for this supplement
				const existingNode = await db.knowledgeNode.findUnique({
					where: { id: `supplement-${supplement.id}` },
				});

				if (!existingNode) {
					// Create a knowledge node for the supplement
					await db.knowledgeNode.create({
						data: {
							id: `supplement-${supplement.id}`,
							name: supplement.name,
							polishName: supplement.polishName,
							type: "SUPPLEMENT",
							description: supplement.description || "",
							polishDescription:
								supplement.polishDescription || supplement.description || "",
							evidenceLevel: supplement.evidenceLevel,
							category: supplement.category,
							x: null,
							y: null,
							size: 12,
							importance: 1,
						},
					});
				} else {
					// Update existing node with latest data
					await db.knowledgeNode.update({
						where: { id: existingNode.id },
						data: {
							name: supplement.name,
							polishName: supplement.polishName,
							description: supplement.description || "",
							polishDescription:
								supplement.polishDescription || supplement.description || "",
							evidenceLevel: supplement.evidenceLevel,
							category: supplement.category,
							updatedAt: new Date(),
						},
					});
				}
			}
		} catch (error) {
			console.error("Error syncing supplement data with graph:", error);
			throw new Error("Failed to sync supplement data with knowledge graph");
		}
	}

	/**
	 * Fetches live data from external APIs and updates the local graph
	 */
	static async fetchExternalDataAndSync(): Promise<void> {
		try {
			// This would integrate with external APIs like:
			// - PubMed API for latest research
			// - ClinicalTrials.gov for trial data
			// - Nutritional databases for new supplement information

			// Example API calls (these are illustrative):
			/*
      const pubmedData = await this.fetchPubmedData();
      const clinicalTrialData = await this.fetchClinicalTrialData();
      
      // Process and integrate external data
      await this.integrateExternalData(pubmedData, clinicalTrialData);
      */

			// For now, we'll just sync with the local database
			await GraphDatabaseIntegrationService.syncSupplementDataWithGraph();
		} catch (error) {
			console.error("Error fetching external data and syncing:", error);
			throw new Error("Failed to fetch external data and sync with graph");
		}
	}

	/**
	 * Finds related nodes for a given supplement
	 */
	static async findSupplementRelatedNodes(supplementId: string): Promise<{
		connectedNodes: KnowledgeNode[];
		relationships: KnowledgeRelationship[];
	}> {
		try {
			const { nodes, relationships } =
				await GraphDatabaseIntegrationService.getSupplementGraphData();

			// Find relationships connected to this supplement
			const connectedRelationships = relationships.filter(
				(rel) =>
					rel.sourceId === `supplement-${supplementId}` ||
					rel.targetId === `supplement-${supplementId}`,
			);

			// Find the connected nodes
			const connectedNodeIds = new Set<string>();
			connectedRelationships.forEach((rel) => {
				connectedNodeIds.add(rel.sourceId);
				connectedNodeIds.add(rel.targetId);
			});

			const connectedNodes = nodes.filter(
				(node) =>
					connectedNodeIds.has(node.id) &&
					node.id !== `supplement-${supplementId}`,
			);

			return {
				connectedNodes,
				relationships: connectedRelationships,
			};
		} catch (error) {
			console.error("Error finding related nodes:", error);
			throw new Error("Failed to find related nodes for supplement");
		}
	}
}

// Export a singleton instance for easy use
export const graphDatabaseIntegrationService =
	new GraphDatabaseIntegrationService();

// Type definitions for external API responses
export interface ExternalResearchData {
	pubmedId?: string;
	title: string;
	authors: string[];
	journal: string;
	year: number;
	abstract?: string;
	doi?: string;
	studyType?: string;
	findings?: string;
	evidenceLevel?: "STRONG" | "MODERATE" | "WEAK" | "INSUFFICIENT";
}

export interface ExternalClinicalTrialData {
	nctId?: string;
	title: string;
	status: string;
	conditions: string[];
	interventions: string[];
	startDate?: string;
	completionDate?: string;
	results?: string;
}
