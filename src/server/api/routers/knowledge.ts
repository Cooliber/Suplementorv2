/**
 * Knowledge Graph tRPC Router
 * Comprehensive API for knowledge graph data and educational content
 */

import {
	createTRPCRouter,
	protectedProcedure,
	publicProcedure,
} from "@/server/api/trpc";
import {
	EvidenceLevelSchema,
	type GraphQueryResult,
	type KnowledgeNodeWithRelations,
	type KnowledgeRelationshipWithNodes,
	NodeTypeSchema,
	RelationshipTypeSchema,
} from "@/types/knowledge-graph";
import { z } from "zod";

// Input validation schemas
const GetGraphInputSchema = z.object({
	nodeTypes: z.array(NodeTypeSchema).optional(),
	relationshipTypes: z.array(RelationshipTypeSchema).optional(),
	evidenceLevels: z.array(EvidenceLevelSchema).optional(),
	categories: z.array(z.string()).optional(),
	tags: z.array(z.string()).optional(),
	maxNodes: z.number().min(1).max(500).default(100),
	maxDepth: z.number().min(1).max(5).default(2),
	centerNodeId: z.string().cuid().optional(),
});

const GetNodeInputSchema = z.object({
	id: z.string().cuid(),
	includeRelationships: z.boolean().default(true),
	maxRelationships: z.number().min(1).max(100).default(50),
});

const GetRelatedNodesInputSchema = z.object({
	nodeId: z.string().cuid(),
	depth: z.number().min(1).max(3).default(1),
	relationshipTypes: z.array(RelationshipTypeSchema).optional(),
	nodeTypes: z.array(NodeTypeSchema).optional(),
	maxNodes: z.number().min(1).max(100).default(20),
});

const SearchKnowledgeInputSchema = z.object({
	query: z.string().min(1),
	nodeTypes: z.array(NodeTypeSchema).optional(),
	categories: z.array(z.string()).optional(),
	evidenceLevels: z.array(EvidenceLevelSchema).optional(),
	limit: z.number().min(1).max(50).default(20),
});

const GetLearningPathInputSchema = z.object({
	startNodeId: z.string().cuid(),
	endNodeId: z.string().cuid(),
	difficulty: z.enum(["beginner", "intermediate", "advanced"]).optional(),
	maxSteps: z.number().min(1).max(20).default(10),
});

export const knowledgeRouter = createTRPCRouter({
	/**
	 * Get knowledge graph data with filtering
	 */
	getGraph: publicProcedure
		.input(GetGraphInputSchema)
		.query(async ({ ctx, input }) => {
			const {
				nodeTypes,
				relationshipTypes,
				evidenceLevels,
				categories,
				tags,
				maxNodes,
				centerNodeId,
			} = input;

			// Build where clause for nodes
			const nodeWhere: any = {};

			if (nodeTypes && nodeTypes.length > 0) {
				nodeWhere.type = { $in: nodeTypes };
			}

			if (evidenceLevels && evidenceLevels.length > 0) {
				nodeWhere.evidenceLevel = { $in: evidenceLevels };
			}

			if (categories && categories.length > 0) {
				nodeWhere.category = { $in: categories };
			}

			if (tags && tags.length > 0) {
				nodeWhere.tags = { $in: tags };
			}

			// Get nodes
			let nodes = await ctx.db.knowledgeNode
				.find(nodeWhere)
				.limit(maxNodes)
				.sort({ importance: -1, centrality: -1, name: 1 })
				.lean();

			// If center node is specified, prioritize nodes connected to it
			if (centerNodeId) {
				// Fetch relationships around the center node (no Prisma-style include)
				const centerRels = await ctx.db.knowledgeRelationship
					.find({
						$or: [{ sourceId: centerNodeId }, { targetId: centerNodeId }],
						...(relationshipTypes ? { type: { $in: relationshipTypes } } : {}),
					})
					.lean();
				const connectedNodeIds = new Set<string>([
					centerNodeId,
					...centerRels.map((r: any) => r.targetId).filter(Boolean),
					...centerRels.map((r: any) => r.sourceId).filter(Boolean),
				]);

				// Filter and prioritize connected nodes
				nodes = nodes.filter((node: any) =>
					connectedNodeIds.has(node._id ?? node.id),
				);
			}

			// Get all relationships between the selected nodes
			const nodeIds = nodes.map((n: any) => n._id ?? n.id);
			const relationships = await ctx.db.knowledgeRelationship
				.find({
					sourceId: { $in: nodeIds },
					targetId: { $in: nodeIds },
					...(relationshipTypes ? { type: { $in: relationshipTypes } } : {}),
				})
				.lean();

			// Attach minimal node objects for frontend convenience
			const nodeMap = new Map<string, any>(
				nodes.map((n: any) => [String(n._id ?? n.id), n]),
			);
			const relationshipsWithNodes = relationships.map((rel: any) => ({
				...rel,
				id: rel._id ?? rel.id,
				sourceNode: nodeMap.get(String(rel.sourceId)) ?? null,
				targetNode: nodeMap.get(String(rel.targetId)) ?? null,
			}));

			return {
				nodes: nodes.map((node: any) => ({
					...node,
					id: node.id ?? node._id,
					properties: node.properties as any,
					position: node.position as any,
				})) as KnowledgeNodeWithRelations[],
				relationships: relationshipsWithNodes as KnowledgeRelationshipWithNodes[],
				totalNodes: nodes.length,
				totalRelationships: relationships.length,
				metadata: {
					queryTime: new Date().toISOString(),
					filters: {
						nodeTypes,
						relationshipTypes,
						evidenceLevels,
						categories,
						tags,
					},
				},
			};
		}),

	/**
	 * Get detailed information about a specific knowledge node
	 */
	getNode: publicProcedure
		.input(GetNodeInputSchema)
		.query(async ({ ctx, input }) => {
			const { id, includeRelationships, maxRelationships } = input;

			const node = await ctx.db.knowledgeNode
				.findOne({ _id: id })
				.lean();

			if (!node) return null;

			let sourceRelationships: any[] = [];
			let targetRelationships: any[] = [];
			if (includeRelationships) {
				const rels = await ctx.db.knowledgeRelationship
					.find({ $or: [{ sourceId: id }, { targetId: id }] })
					.sort({ strength: -1 })
					.limit(maxRelationships)
					.lean();
				sourceRelationships = rels.filter((r: any) => r.sourceId === id);
				targetRelationships = rels.filter((r: any) => r.targetId === id);
			}

			return {
				...node,
				id: node._id ?? node.id,
				sourceRelationships,
				targetRelationships,
			} as any;


		}),

	/**
	 * Get nodes related to a specific node
	 */
	getRelatedNodes: publicProcedure
		.input(GetRelatedNodesInputSchema)
		.query(async ({ ctx, input }) => {
			const { nodeId, depth, relationshipTypes, nodeTypes, maxNodes } = input;

			// Start with the initial node
			let currentNodeIds = new Set([nodeId]);
			const allNodeIds = new Set([nodeId]);
			const allRelationshipIds = new Set<string>();

			// Traverse the graph to the specified depth
			for (let d = 0; d < depth; d++) {
				const relationships = await ctx.db.knowledgeRelationship
					.find({
						$or: [
							{ sourceId: { $in: Array.from(currentNodeIds) } },
							{ targetId: { $in: Array.from(currentNodeIds) } },
						],
						...(relationshipTypes ? { type: { $in: relationshipTypes } } : {}),
					})
					.lean();

				const nextNodeIds = new Set<string>();
				relationships.forEach((rel: any) => {
					allRelationshipIds.add(String(rel._id ?? rel.id));
					if (currentNodeIds.has(rel.sourceId)) {
						nextNodeIds.add(rel.targetId);
					}
					if (currentNodeIds.has(rel.targetId)) {
						nextNodeIds.add(rel.sourceId);
					}
				});

				// Add new nodes to the collection
				nextNodeIds.forEach((id) => allNodeIds.add(id));
				currentNodeIds = nextNodeIds;

				// Stop if we've reached the max nodes limit
				if (allNodeIds.size >= maxNodes) break;
			}

			// Get the actual node data
			const nodes = await ctx.db.knowledgeNode
				.find({
					_id: { $in: Array.from(allNodeIds) },
					...(nodeTypes ? { type: { $in: nodeTypes } } : {}),
				})
				.limit(maxNodes)
				.lean();

			return {
				nodes: nodes.map((node: any) => ({
					...node,
					id: node.id ?? node._id,
					properties: node.properties as any,
					position: node.position as any,
				})) as KnowledgeNodeWithRelations[],
				depth,
				totalFound: nodes.length,
				centerNodeId: nodeId,
			};
		}),

	/**
	 * Search knowledge base
	 */
	searchKnowledge: publicProcedure
		.input(SearchKnowledgeInputSchema)
		.query(async ({ ctx, input }) => {
			const { query, nodeTypes, categories, evidenceLevels, limit } = input;

			// Build MongoDB filter
			const regex = new RegExp(query, "i");
			const filter: any = {
				$or: [
					{ name: regex },
					{ polishName: regex },
					{ description: regex },
					{ polishDescription: regex },
					{ tags: { $in: [query] } },
				],
			};

			if (nodeTypes && nodeTypes.length > 0) {
				filter.type = { $in: nodeTypes };
			}

			if (categories && categories.length > 0) {
				filter.category = { $in: categories };
			}

			if (evidenceLevels && evidenceLevels.length > 0) {
				filter.evidenceLevel = { $in: evidenceLevels };
			}

			const nodes = await ctx.db.knowledgeNode
				.find(filter)
				.limit(limit)
				.sort({ importance: -1, evidenceLevel: -1, name: 1 })
				.lean();

			return nodes.map((node: any) => ({
				...node,
				properties: node.properties as any,
				position: node.position as any,
			})) as KnowledgeNodeWithRelations[];
		}),

	/**
	 * Get learning path between two nodes
	 */
	getLearningPath: publicProcedure
		.input(GetLearningPathInputSchema)
		.query(async ({ ctx, input }) => {
			const { startNodeId, endNodeId, difficulty, maxSteps } = input;

			// Simple pathfinding algorithm (can be enhanced with more sophisticated algorithms)
			const visited = new Set<string>();
			const queue = [{ nodeId: startNodeId, path: [startNodeId], depth: 0 }];

			while (queue.length > 0 && (queue[0]?.depth ?? 0) < maxSteps) {
				const current = queue.shift();
				if (!current) break;

				if (current.nodeId === endNodeId) {
					// Found the target, get the full path data
					const pathNodes = await ctx.db.knowledgeNode
						.find({ _id: { $in: current.path } })
						.lean();

					// Order nodes according to the path
					const orderedNodes = current.path.map(
						(id) => pathNodes.find((node: any) => (node._id ?? node.id) === id)!,
					);

					return {
						path: orderedNodes.map((node: any) => ({
							...node,
							properties: node.properties as any,
							position: node.position as any,
						})) as KnowledgeNodeWithRelations[],
						pathLength: current.path.length,
						difficulty: difficulty || "intermediate",
						estimatedTime: current.path.length * 15, // 15 minutes per node
					};
				}

				if (visited.has(current.nodeId)) continue;
				visited.add(current.nodeId);

				// Get connected nodes
				const relationships = await ctx.db.knowledgeRelationship
					.find({ $or: [{ sourceId: current.nodeId }, { targetId: current.nodeId }] })
					.lean();

				relationships.forEach((rel) => {
					const nextNodeId =
						rel.sourceId === current.nodeId ? rel.targetId : rel.sourceId;
					if (!visited.has(nextNodeId)) {
						queue.push({
							nodeId: nextNodeId,
							path: [...current.path, nextNodeId],
							depth: current.depth + 1,
						});
					}
				});
			}

			// No path found
			return {
				path: [],
				pathLength: 0,
				difficulty: difficulty || "intermediate",
				estimatedTime: 0,
				error: "No learning path found between the specified nodes",
			};
		}),

	/**
	 * Get knowledge graph statistics
	 */
	getStatistics: publicProcedure.query(async ({ ctx }) => {
		const [
			totalNodes,
			totalRelationships,
			nodesByType,
			relationshipsByType,
			evidenceLevelDistribution,
		] = await Promise.all([
			ctx.db.knowledgeNode.countDocuments(),
			ctx.db.knowledgeRelationship.countDocuments(),
			ctx.db.knowledgeNode.aggregate([
				{ $group: { _id: "$type", _count: { $sum: 1 } } },
			]),
			ctx.db.knowledgeRelationship.aggregate([
				{ $group: { _id: "$type", _count: { $sum: 1 } } },
			]),
			ctx.db.knowledgeNode.aggregate([
				{ $group: { _id: "$evidenceLevel", _count: { $sum: 1 } } },
			]),
		]);

		return {
			totalNodes,
			totalRelationships,
			nodesByType: nodesByType.map((item: any) => ({
				type: item._id,
				count: item._count,
			})),
			relationshipsByType: relationshipsByType.map((item: any) => ({
				type: item._id,
				count: item._count,
			})),
			evidenceLevelDistribution: evidenceLevelDistribution.map((item: any) => ({
				level: item._id,
				count: item._count,
			})),
			lastUpdated: new Date().toISOString(),
		};
	}),
});
