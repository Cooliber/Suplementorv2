/**
 * Mongoose Schema for Knowledge Graph Nodes
 * Optimized for 3D visualization and educational content
 */

import type {
	KnowledgeNodeWithRelations,
	NodeProperties,
	Position3D,
} from "@/types/knowledge-graph";
import mongoose, { Schema, type Document, type Model } from "mongoose";

// Position schema for 3D coordinates
const Position3DSchema = new Schema(
	{
		x: { type: Number, required: true },
		y: { type: Number, required: true },
		z: { type: Number, required: true },
	},
	{ _id: false },
);

// Main Knowledge Node Schema
const KnowledgeNodeSchema = new Schema(
	{
		_id: { type: String, required: true }, // Custom ID instead of ObjectId
		type: {
			type: String,
			enum: [
				"SUPPLEMENT",
				"NEUROTRANSMITTER",
				"BRAIN_REGION",
				"COGNITIVE_FUNCTION",
				"PATHWAY",
				"MECHANISM",
			],
			required: true,
			index: true,
		},
		name: { type: String, required: true, index: true },
		polishName: { type: String, required: true, index: true },
		description: { type: String, required: true },
		polishDescription: { type: String },

		// Visual properties for 3D rendering
		color: {
			type: String,
			required: true,
			match: /^#[0-9A-F]{6}$/i, // Hex color validation
		},
		size: {
			type: Number,
			required: true,
			min: 1,
			max: 50,
		},
		position: Position3DSchema,

		// Content properties (flexible JSON-like structure)
		properties: {
			type: Schema.Types.Mixed,
			default: {},
		},
		tags: [{ type: String }],
		category: { type: String, required: true, index: true },

		// Evidence and reliability
		evidenceLevel: {
			type: String,
			enum: ["STRONG", "MODERATE", "WEAK", "INSUFFICIENT", "CONFLICTING"],
			required: true,
			index: true,
		},
		sources: [{ type: String }],

		// Graph analytics (computed values)
		centrality: { type: Number },
		clustering: { type: Number },
		importance: { type: Number, index: true },

		// D3 force simulation properties (runtime only, not persisted)
		x: { type: Number },
		y: { type: Number },
		z: { type: Number },
		vx: { type: Number },
		vy: { type: Number },
		vz: { type: Number },
		fx: { type: Number },
		fy: { type: Number },
		fz: { type: Number },
	},
	{
		timestamps: true,
		collection: "knowledgeNodes",
	},
);

// Indexes for performance
KnowledgeNodeSchema.index({
	name: "text",
	polishName: "text",
	description: "text",
});
KnowledgeNodeSchema.index({ type: 1, category: 1 });
KnowledgeNodeSchema.index({ evidenceLevel: 1, importance: -1 });
KnowledgeNodeSchema.index({ tags: 1 });

// Virtual for ID compatibility
KnowledgeNodeSchema.virtual("id").get(function () {
	return this._id;
});

// Ensure virtual fields are serialized
KnowledgeNodeSchema.set("toJSON", {
	virtuals: true,
	transform: (doc, ret: any) => {
		ret.id = ret._id;
		ret._id = undefined;
		ret.__v = undefined;
		return ret;
	},
});

// Document interface
export interface IKnowledgeNodeDocument
	extends Document,
		Omit<
			KnowledgeNodeWithRelations,
			"id" | "sourceRelationships" | "targetRelationships"
		> {
	_id: string;
}

// Model interface
export interface IKnowledgeNodeModel extends Model<IKnowledgeNodeDocument> {
	findByType(type: string): Promise<IKnowledgeNodeDocument[]>;
	findByCategory(category: string): Promise<IKnowledgeNodeDocument[]>;
	searchByText(query: string): Promise<IKnowledgeNodeDocument[]>;
	findMostImportant(limit?: number): Promise<IKnowledgeNodeDocument[]>;
}

// Static methods
KnowledgeNodeSchema.statics.findByType = function (type: string) {
	return this.find({ type });
};

KnowledgeNodeSchema.statics.findByCategory = function (category: string) {
	return this.find({ category });
};

KnowledgeNodeSchema.statics.searchByText = function (query: string) {
	return this.find({ $text: { $search: query } });
};

KnowledgeNodeSchema.statics.findMostImportant = function (limit = 10) {
	return this.find({}).sort({ importance: -1, centrality: -1 }).limit(limit);
};

// Create and export model
const KnowledgeNode =
	(mongoose.models.KnowledgeNode as unknown as IKnowledgeNodeModel) ||
	mongoose.model<IKnowledgeNodeDocument, IKnowledgeNodeModel>(
		"KnowledgeNode",
		KnowledgeNodeSchema,
	);

export default KnowledgeNode;
