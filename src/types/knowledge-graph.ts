/**
 * Knowledge Graph Type Definitions for Suplementor T3 Stack
 * Comprehensive types for 3D knowledge visualization and educational content
 */

import type { LucideIcon } from "lucide-react";
import { z } from "zod";

// Define types locally since Prisma schema is not yet set up
export type NodeType =
	| "SUPPLEMENT"
	| "NEUROTRANSMITTER"
	| "BRAIN_REGION"
	| "COGNITIVE_FUNCTION"
	| "PATHWAY"
	| "MECHANISM";
export type RelationshipType =
	| "ENHANCES"
	| "INHIBITS"
	| "MODULATES"
	| "SYNERGIZES"
	| "ANTAGONIZES"
	| "REQUIRES"
	| "PRODUCES"
	| "METABOLIZES";
export type EvidenceLevel =
	| "STRONG"
	| "MODERATE"
	| "WEAK"
	| "INSUFFICIENT"
	| "CONFLICTING";

// Zod Schemas for Validation

export const NodeTypeSchema = z.enum([
	"SUPPLEMENT",
	"NEUROTRANSMITTER",
	"BRAIN_REGION",
	"COGNITIVE_FUNCTION",
	"PATHWAY",
	"MECHANISM",
]);

export const RelationshipTypeSchema = z.enum([
	"ENHANCES",
	"INHIBITS",
	"MODULATES",
	"SYNERGIZES",
	"ANTAGONIZES",
	"REQUIRES",
	"PRODUCES",
	"METABOLIZES",
]);

export const EvidenceLevelSchema = z.enum([
	"STRONG",
	"MODERATE",
	"WEAK",
	"INSUFFICIENT",
	"CONFLICTING",
]);

// 3D Position Schema
export const Position3DSchema = z.object({
	x: z.number(),
	y: z.number(),
	z: z.number(),
});

// Knowledge Node Properties Schema
export const NodePropertiesSchema = z.record(z.unknown());

// Dosage Dependency Schema
export const DosageDependencySchema = z.object({
	threshold: z.number(),
	unit: z.string(),
	effectCurve: z.enum(["linear", "logarithmic", "sigmoid", "inverted_u"]),
});

// Knowledge Node Schema
export const KnowledgeNodeSchema = z.object({
	id: z.string().cuid(),
	type: NodeTypeSchema,
	name: z.string().min(1),
	polishName: z.string().min(1),
	description: z.string().min(1),
	polishDescription: z.string().optional(),

	// Visual properties for 3D rendering
	color: z.string().regex(/^#[0-9A-F]{6}$/i),
	size: z.number().min(1).max(50),
	position: Position3DSchema.optional(),

	// Content properties
	properties: NodePropertiesSchema,
	tags: z.array(z.string()),
	category: z.string(),

	// Evidence and reliability
	evidenceLevel: EvidenceLevelSchema,
	sources: z.array(z.string()),

	// Graph analytics
	centrality: z.number().optional(),
	clustering: z.number().optional(),
	importance: z.number().optional(),

	// D3 force simulation properties
	x: z.number().optional(),
	y: z.number().optional(),
	z: z.number().optional(),
	vx: z.number().optional(),
	vy: z.number().optional(),
	vz: z.number().optional(),
	fx: z.number().nullable().optional(),
	fy: z.number().nullable().optional(),
	fz: z.number().nullable().optional(),

	// Metadata
	lastUpdated: z.string().datetime(),
	createdAt: z.string().datetime(),
});

// Knowledge Relationship Schema
export const KnowledgeRelationshipSchema = z.object({
	id: z.string().cuid(),
	sourceId: z.string().cuid(),
	targetId: z.string().cuid(),
	type: RelationshipTypeSchema,

	// Relationship properties
	strength: z.number().min(0).max(1),
	confidence: z.number().min(0).max(1),
	bidirectional: z.boolean().default(false),

	// Evidence and context
	evidenceLevel: EvidenceLevelSchema,
	mechanism: z.string().min(1),
	polishMechanism: z.string().optional(),
	polishDescription: z.string().optional(),

	// Temporal properties
	onset: z.string().optional(),
	duration: z.string().optional(),
	reversibility: z
		.enum(["reversible", "irreversible", "partially_reversible"])
		.optional(),

	// Dosage dependency
	dosageDependency: DosageDependencySchema.optional(),

	// Metadata
	lastUpdated: z.string().datetime(),
	createdAt: z.string().datetime(),
});

// Knowledge Graph Schema
export const KnowledgeGraphSchema = z.object({
	id: z.string(),
	name: z.string(),
	polishName: z.string(),
	description: z.string(),
	polishDescription: z.string().optional(),
	version: z.string(),

	// Graph data
	nodes: z.array(KnowledgeNodeSchema),
	relationships: z.array(KnowledgeRelationshipSchema),

	// Graph metadata
	metadata: z.object({
		totalNodes: z.number(),
		totalRelationships: z.number(),
		lastUpdated: z.string().datetime(),
		version: z.string(),
		contributors: z.array(z.string()),
		domains: z.array(z.string()),
	}),

	// Graph analytics
	analytics: z.object({
		density: z.number(),
		averageDegree: z.number(),
		clusteringCoefficient: z.number(),
		modularity: z.number(),
		keyNodes: z.array(z.string()),
		keyRelationships: z.array(z.string()),
	}),

	// Quality metrics
	quality: z.object({
		averageEvidenceLevel: EvidenceLevelSchema,
		averageConfidenceScore: z.number().min(0).max(1),
		coverageScore: z.number().min(0).max(1),
		currencyScore: z.number().min(0).max(1),
		completenessScore: z.number().min(0).max(1),
	}),
});

// TypeScript Types (inferred from Zod schemas)
export type Position3D = z.infer<typeof Position3DSchema>;
export type NodeProperties = z.infer<typeof NodePropertiesSchema>;
export type DosageDependency = z.infer<typeof DosageDependencySchema>;
export type KnowledgeNode = z.infer<typeof KnowledgeNodeSchema>;
export type KnowledgeRelationship = z.infer<typeof KnowledgeRelationshipSchema>;
export type KnowledgeGraph = z.infer<typeof KnowledgeGraphSchema>;

// Extended types for UI components
export interface KnowledgeNodeWithRelations extends KnowledgeNode {
	properties: NodeProperties;
	position?: Position3D;
	sourceRelationships: KnowledgeRelationshipWithNodes[];
	targetRelationships: KnowledgeRelationshipWithNodes[];
}

export interface KnowledgeRelationshipWithNodes extends KnowledgeRelationship {
	dosageDependency?: DosageDependency;
	sourceNode: KnowledgeNodeWithRelations;
	targetNode: KnowledgeNodeWithRelations;
}

// 3D Visualization Types
export interface Node3D extends KnowledgeNode {
	icon?: LucideIcon;
	mesh?: unknown; // THREE.Mesh - using unknown to avoid THREE dependency
	selected?: boolean;
	hovered?: boolean;
	visible?: boolean;
	opacity?: number;
}

export interface Edge3D extends KnowledgeRelationship {
	sourceNode: Node3D;
	targetNode: Node3D;
	line?: unknown; // THREE.Line - using unknown to avoid THREE dependency
	visible?: boolean;
	opacity?: number;
}

export interface Graph3D {
	nodes: Node3D[];
	edges: Edge3D[];
	bounds: {
		min: Position3D;
		max: Position3D;
	};
	center: Position3D;
}

// Specialized Node Types
export interface SupplementNode extends KnowledgeNode {
	type: "SUPPLEMENT";
	properties: {
		category: string;
		activeCompounds: string[];
		dosageRange: {
			min: number;
			max: number;
			unit: string;
		};
		evidenceLevel: EvidenceLevel;
		safetyProfile: string;
	};
}

export interface NeurotransmitterNode extends KnowledgeNode {
	type: "NEUROTRANSMITTER";
	properties: {
		chemicalFormula: string;
		molecularWeight: number;
		halfLife: string;
		synthesisPathway: string[];
		degradationPathway: string[];
		receptorTypes: string[];
		brainRegions: string[];
		functions: string[];
		deficiencySymptoms: string[];
		excessSymptoms: string[];
	};
}

export interface BrainRegionNode extends KnowledgeNode {
	type: "BRAIN_REGION";
	properties: {
		anatomicalLocation: string;
		volume: number;
		functions: string[];
		neurotransmitters: string[];
		connections: string[];
		disorders: string[];
		development: string;
	};
}

export interface CognitiveFunctionNode extends KnowledgeNode {
	type: "COGNITIVE_FUNCTION";
	properties: {
		domain: string;
		subFunctions: string[];
		brainRegions: string[];
		neurotransmitters: string[];
		assessmentMethods: string[];
		developmentalTrajectory: string;
		disorders: string[];
	};
}

// Graph Query Types
export interface GraphQuery {
	nodeTypes?: NodeType[];
	relationshipTypes?: RelationshipType[];
	evidenceLevels?: EvidenceLevel[];
	categories?: string[];
	tags?: string[];
	searchTerm?: string;
	maxNodes?: number;
	maxDepth?: number;
	centerNodeId?: string;
}

export interface GraphQueryResult {
	nodes: KnowledgeNodeWithRelations[];
	relationships: KnowledgeRelationshipWithNodes[];
	totalCount: number;
	hasMore: boolean;
}

// Learning Path Types
export interface LearningPath {
	id: string;
	name: string;
	polishName: string;
	description: string;
	polishDescription: string;
	difficulty: "beginner" | "intermediate" | "advanced";
	estimatedTime: number; // in minutes
	nodes: string[]; // ordered list of node IDs
	prerequisites: string[];
	objectives: string[];
	polishObjectives: string[];
}

export interface UserProgress {
	userId: string;
	nodeId: string;
	completed: boolean;
	timeSpent: number;
	lastAccessed: Date;
	comprehensionScore?: number;
	notes?: string;
}

// Validation Functions
export const validateKnowledgeNode = (data: unknown) => {
	try {
		return {
			success: true as const,
			data: KnowledgeNodeSchema.parse(data),
		};
	} catch (error) {
		return {
			success: false as const,
			error:
				error instanceof z.ZodError
					? error.issues
					: [{ message: "Unknown validation error" }],
		};
	}
};

export const validateKnowledgeRelationship = (data: unknown) => {
	try {
		return {
			success: true as const,
			data: KnowledgeRelationshipSchema.parse(data),
		};
	} catch (error) {
		return {
			success: false as const,
			error:
				error instanceof z.ZodError
					? error.issues
					: [{ message: "Unknown validation error" }],
		};
	}
};

export const validateKnowledgeGraph = (data: unknown) => {
	try {
		return {
			success: true as const,
			data: KnowledgeGraphSchema.parse(data),
		};
	} catch (error) {
		return {
			success: false as const,
			error:
				error instanceof z.ZodError
					? error.issues
					: [{ message: "Unknown validation error" }],
		};
	}
};

// Utility Types
export type ValidationResult<T> =
	| { success: true; data: T }
	| { success: false; error: Array<{ message: string }> };

// Types are defined at the top of this file
// export type { NodeType, RelationshipType, EvidenceLevel } - already exported above
