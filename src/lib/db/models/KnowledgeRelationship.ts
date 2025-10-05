/**
 * Mongoose Schema for Knowledge Graph Relationships
 * Optimized for graph traversal and relationship analysis
 */

import type {
	DosageDependency,
	KnowledgeRelationshipWithNodes,
} from "@/types/knowledge-graph";
import mongoose, { Schema, type Document, type Model } from "mongoose";

// Dosage Dependency Schema
const DosageDependencySchema = new Schema(
	{
		threshold: { type: Number, required: true },
		unit: { type: String, required: true },
		effectCurve: {
			type: String,
			enum: ["linear", "logarithmic", "sigmoid", "inverted_u"],
			required: true,
		},
	},
	{ _id: false },
);

// Main Knowledge Relationship Schema
const KnowledgeRelationshipSchema = new Schema(
	{
		_id: { type: String, required: true }, // Custom ID instead of ObjectId
		sourceId: {
			type: String,
			ref: "KnowledgeNode",
			required: true,
			index: true,
		},
		targetId: {
			type: String,
			ref: "KnowledgeNode",
			required: true,
			index: true,
		},
		type: {
			type: String,
			enum: [
				"ENHANCES",
				"INHIBITS",
				"MODULATES",
				"SYNERGIZES",
				"ANTAGONIZES",
				"REQUIRES",
				"PRODUCES",
				"METABOLIZES",
			],
			required: true,
			index: true,
		},

		// Relationship properties
		strength: {
			type: Number,
			required: true,
			min: 0,
			max: 1,
		},
		confidence: {
			type: Number,
			required: true,
			min: 0,
			max: 1,
		},
		bidirectional: {
			type: Boolean,
			default: false,
		},

		// Evidence and context
		evidenceLevel: {
			type: String,
			enum: ["STRONG", "MODERATE", "WEAK", "INSUFFICIENT", "CONFLICTING"],
			required: true,
			index: true,
		},
		mechanism: { type: String, required: true },
		polishMechanism: { type: String },
		polishDescription: { type: String },

		// Temporal properties
		onset: { type: String },
		duration: { type: String },
		reversibility: {
			type: String,
			enum: ["reversible", "irreversible", "partially_reversible"],
		},

		// Dosage dependency
		dosageDependency: DosageDependencySchema,
	},
	{
		timestamps: true,
		collection: "knowledgeRelationships",
	},
);

// Compound indexes for efficient graph traversal
KnowledgeRelationshipSchema.index({ sourceId: 1, type: 1 });
KnowledgeRelationshipSchema.index({ targetId: 1, type: 1 });
KnowledgeRelationshipSchema.index({ sourceId: 1, targetId: 1 });
KnowledgeRelationshipSchema.index({ type: 1, strength: -1 });
KnowledgeRelationshipSchema.index({ evidenceLevel: 1, confidence: -1 });

// Unique constraint to prevent duplicate relationships
KnowledgeRelationshipSchema.index(
	{ sourceId: 1, targetId: 1, type: 1 },
	{ unique: true },
);

// Virtual for ID compatibility
KnowledgeRelationshipSchema.virtual("id").get(function () {
	return this._id;
});

// Ensure virtual fields are serialized
KnowledgeRelationshipSchema.set("toJSON", {
	virtuals: true,
	transform: (doc, ret: any) => {
		ret.id = ret._id;
		ret._id = undefined;
		ret.__v = undefined;
		return ret;
	},
});

// Document interface
export interface IKnowledgeRelationshipDocument
	extends Document,
		Omit<KnowledgeRelationshipWithNodes, "id" | "sourceNode" | "targetNode"> {
	_id: string;
}

// Model interface
export interface IKnowledgeRelationshipModel
	extends Model<IKnowledgeRelationshipDocument> {
	findBySourceId(sourceId: string): Promise<IKnowledgeRelationshipDocument[]>;
	findByTargetId(targetId: string): Promise<IKnowledgeRelationshipDocument[]>;
	findByNodeId(nodeId: string): Promise<IKnowledgeRelationshipDocument[]>;
	findByType(type: string): Promise<IKnowledgeRelationshipDocument[]>;
	findStrongestRelationships(
		limit?: number,
	): Promise<IKnowledgeRelationshipDocument[]>;
	findPath(
		sourceId: string,
		targetId: string,
		maxDepth?: number,
	): Promise<IKnowledgeRelationshipDocument[]>;
}

// Static methods
KnowledgeRelationshipSchema.statics.findBySourceId = function (
	sourceId: string,
) {
	return this.find({ sourceId }).populate("targetId");
};

KnowledgeRelationshipSchema.statics.findByTargetId = function (
	targetId: string,
) {
	return this.find({ targetId }).populate("sourceId");
};

KnowledgeRelationshipSchema.statics.findByNodeId = function (nodeId: string) {
	return this.find({
		$or: [{ sourceId: nodeId }, { targetId: nodeId }],
	}).populate(["sourceId", "targetId"]);
};

KnowledgeRelationshipSchema.statics.findByType = function (type: string) {
	return this.find({ type }).populate(["sourceId", "targetId"]);
};

KnowledgeRelationshipSchema.statics.findStrongestRelationships = function (
	limit = 10,
) {
	return this.find({})
		.sort({ strength: -1, confidence: -1 })
		.limit(limit)
		.populate(["sourceId", "targetId"]);
};

KnowledgeRelationshipSchema.statics.findPath = async function (
	sourceId: string,
	targetId: string,
	maxDepth = 3,
) {
	// Simple pathfinding using aggregation pipeline
	const pipeline = [
		{
			$match: {
				$or: [{ sourceId: sourceId }, { targetId: sourceId }],
			},
		},
		{
			$graphLookup: {
				from: "knowledgeRelationships",
				startWith: "$targetId",
				connectFromField: "targetId",
				connectToField: "sourceId",
				as: "path",
				maxDepth: maxDepth,
				restrictSearchWithMatch: {
					targetId: targetId,
				},
			},
		},
		{
			$match: {
				"path.targetId": targetId,
			},
		},
		{
			$limit: 1,
		},
	];

	return this.aggregate(pipeline);
};

// Instance methods
KnowledgeRelationshipSchema.methods.getOppositeNodeId = function (
	nodeId: string,
): string | null {
	if (this.sourceId === nodeId) {
		return this.targetId;
	}
	if (this.targetId === nodeId) {
		return this.sourceId;
	}
	return null;
};

KnowledgeRelationshipSchema.methods.isStrongRelationship =
	function (): boolean {
		return this.strength > 0.7 && this.confidence > 0.8;
	};

KnowledgeRelationshipSchema.methods.getEffectDescription = function (
	language: "en" | "pl" = "en",
): string {
	if (language === "pl" && this.polishDescription) {
		return this.polishDescription;
	}
	return this.mechanism;
};

// Create and export model
const KnowledgeRelationship =
	(mongoose.models
		.KnowledgeRelationship as unknown as IKnowledgeRelationshipModel) ||
	mongoose.model<IKnowledgeRelationshipDocument, IKnowledgeRelationshipModel>(
		"KnowledgeRelationship",
		KnowledgeRelationshipSchema,
	);

export default KnowledgeRelationship;
