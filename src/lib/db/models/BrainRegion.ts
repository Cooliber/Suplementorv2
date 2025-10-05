/**
 * Brain Region MongoDB Schema
 * Schema for 3D brain visualization and educational content with Polish translations
 */

import mongoose, { Schema, type Document, type Model } from "mongoose";

// Supplement Effect Schema for brain regions
const SupplementEffectSchema = new Schema(
	{
		supplementId: { type: String, required: true },
		supplementName: { type: String, required: true },
		polishSupplementName: { type: String, required: true },
		effectType: {
			type: String,
			enum: ["ENHANCES", "MODULATES", "PROTECTS", "STIMULATES", "INHIBITS"],
			required: true,
		},
		intensity: { type: Number, required: true, min: 0, max: 1 },
		mechanism: { type: String, required: true },
		polishMechanism: { type: String, required: true },
		evidenceLevel: {
			type: String,
			enum: ["STRONG", "MODERATE", "WEAK", "INSUFFICIENT"],
			required: true,
		},
		visualEffect: {
			color: { type: String, required: true },
			pulseSpeed: { type: Number, required: true, min: 0.1, max: 5 },
			glowIntensity: { type: Number, required: true, min: 0, max: 1 },
		},
		timeToEffect: { type: String },
		polishTimeToEffect: { type: String },
		duration: { type: String },
		polishDuration: { type: String },
	},
	{ _id: false },
);

// Anatomical Information Schema
const AnatomicalInfoSchema = new Schema(
	{
		volume: { type: Number, required: true }, // cm³
		coordinates: {
			x: { type: Number, required: true },
			y: { type: Number, required: true },
			z: { type: Number, required: true },
		},
		connections: [{ type: String }],
		polishConnections: [{ type: String }],
		cytoarchitecture: { type: String },
		polishCytoarchitecture: { type: String },
		bloodSupply: [{ type: String }],
		polishBloodSupply: [{ type: String }],
		clinicalRelevance: { type: String, required: true },
		polishClinicalRelevance: { type: String, required: true },
	},
	{ _id: false },
);

// Neurotransmitter Activity Schema
const NeurotransmitterActivitySchema = new Schema(
	{
		neurotransmitter: { type: String, required: true },
		polishNeurotransmitter: { type: String, required: true },
		receptorTypes: [{ type: String }],
		polishReceptorTypes: [{ type: String }],
		activity: {
			type: String,
			enum: ["HIGH", "MODERATE", "LOW", "VARIABLE"],
			required: true,
		},
		function: { type: String, required: true },
		polishFunction: { type: String, required: true },
		pathways: [{ type: String }],
		polishPathways: [{ type: String }],
	},
	{ _id: false },
);

// Functional Network Schema
const FunctionalNetworkSchema = new Schema(
	{
		networkName: { type: String, required: true },
		polishNetworkName: { type: String, required: true },
		role: { type: String, required: true },
		polishRole: { type: String, required: true },
		connectivity: { type: Number, required: true, min: 0, max: 1 },
		hubStatus: { type: Boolean, default: false },
		associatedDisorders: [{ type: String }],
		polishAssociatedDisorders: [{ type: String }],
	},
	{ _id: false },
);

// Educational Content Schema
const EducationalContentSchema = new Schema(
	{
		beginnerDescription: { type: String, required: true },
		polishBeginnerDescription: { type: String, required: true },
		intermediateDescription: { type: String, required: true },
		polishIntermediateDescription: { type: String, required: true },
		expertDescription: { type: String, required: true },
		polishExpertDescription: { type: String, required: true },
		keyFacts: [{ type: String }],
		polishKeyFacts: [{ type: String }],
		interactiveTips: [{ type: String }],
		polishInteractiveTips: [{ type: String }],
		relatedConcepts: [{ type: String }],
		polishRelatedConcepts: [{ type: String }],
	},
	{ _id: false },
);

// Visualization Properties Schema
const VisualizationPropertiesSchema = new Schema(
	{
		position: {
			x: { type: Number, required: true },
			y: { type: Number, required: true },
			z: { type: Number, required: true },
		},
		size: { type: Number, required: true, min: 0.1, max: 2 },
		color: { type: String, required: true },
		opacity: { type: Number, required: true, min: 0, max: 1 },
		shape: {
			type: String,
			enum: ["SPHERE", "ELLIPSOID", "IRREGULAR"],
			default: "SPHERE",
		},
		animationProperties: {
			rotationSpeed: { type: Number, default: 0.005 },
			pulseEnabled: { type: Boolean, default: false },
			pulseSpeed: { type: Number, default: 1 },
			hoverEffect: { type: Boolean, default: true },
		},
		labelPosition: {
			x: { type: Number, default: 0 },
			y: { type: Number, default: 0.3 },
			z: { type: Number, default: 0 },
		},
	},
	{ _id: false },
);

// Main Brain Region Schema
const BrainRegionSchema = new Schema(
	{
		id: { type: String, required: true, unique: true, index: true },
		name: { type: String, required: true, index: true },
		polishName: { type: String, required: true, index: true },
		category: {
			type: String,
			enum: ["CORTEX", "SUBCORTICAL", "BRAINSTEM", "CEREBELLUM", "LIMBIC"],
			required: true,
			index: true,
		},
		hemisphere: {
			type: String,
			enum: ["LEFT", "RIGHT", "BILATERAL"],
			required: true,
		},

		// Core properties
		functions: [{ type: String, required: true }],
		polishFunctions: [{ type: String, required: true }],
		description: { type: String, required: true },
		polishDescription: { type: String, required: true },

		// Embedded schemas
		anatomicalInfo: AnatomicalInfoSchema,
		neurotransmitterActivity: [NeurotransmitterActivitySchema],
		functionalNetworks: [FunctionalNetworkSchema],
		supplementEffects: [SupplementEffectSchema],
		educationalContent: EducationalContentSchema,
		visualizationProperties: VisualizationPropertiesSchema,

		// Clinical and research data
		clinicalSignificance: { type: String, required: true },
		polishClinicalSignificance: { type: String, required: true },
		associatedDisorders: [{ type: String }],
		polishAssociatedDisorders: [{ type: String }],
		researchAreas: [{ type: String }],
		polishResearchAreas: [{ type: String }],

		// Metadata
		tags: [{ type: String }],
		polishTags: [{ type: String }],
		lastUpdated: { type: Date, default: Date.now },
		version: { type: String, default: "1.0.0" },
		isActive: { type: Boolean, default: true, index: true },

		// Educational level
		difficultyLevel: {
			type: String,
			enum: ["BEGINNER", "INTERMEDIATE", "ADVANCED"],
			default: "INTERMEDIATE",
			index: true,
		},

		// 3D model references
		modelFile: { type: String }, // Path to 3D model file
		textureFiles: [{ type: String }], // Paths to texture files
	},
	{
		timestamps: true,
		collection: "brain_regions",
	},
);

// Indexes for performance
BrainRegionSchema.index({
	name: "text",
	polishName: "text",
	description: "text",
	polishDescription: "text",
});
BrainRegionSchema.index({ category: 1, hemisphere: 1 });
BrainRegionSchema.index({ functions: 1 });
BrainRegionSchema.index({ polishFunctions: 1 });
BrainRegionSchema.index({ "supplementEffects.supplementId": 1 });
BrainRegionSchema.index({ "neurotransmitterActivity.neurotransmitter": 1 });
BrainRegionSchema.index({ tags: 1 });
BrainRegionSchema.index({ polishTags: 1 });
BrainRegionSchema.index({ isActive: 1, difficultyLevel: 1 });
BrainRegionSchema.index({
	"visualizationProperties.position.x": 1,
	"visualizationProperties.position.y": 1,
	"visualizationProperties.position.z": 1,
});

// Virtual for full position
BrainRegionSchema.virtual("position").get(function () {
	return this.visualizationProperties?.position;
});

// Methods
BrainRegionSchema.methods.getSupplementEffects = function (
	supplementId?: string,
) {
	if (supplementId) {
		return this.supplementEffects.filter(
			(effect: any) => effect.supplementId === supplementId,
		);
	}
	return this.supplementEffects;
};

BrainRegionSchema.methods.getNeurotransmitterActivity = function (
	neurotransmitter?: string,
) {
	if (neurotransmitter) {
		return this.neurotransmitterActivity.filter(
			(activity: any) =>
				activity.neurotransmitter.toLowerCase() ===
				neurotransmitter.toLowerCase(),
		);
	}
	return this.neurotransmitterActivity;
};

BrainRegionSchema.methods.getEducationalContent = function (
	level: "beginner" | "intermediate" | "expert" = "intermediate",
) {
	const content = this.educationalContent;
	switch (level) {
		case "beginner":
			return {
				description: content.polishBeginnerDescription,
				facts: content.polishKeyFacts?.slice(0, 3) || [],
				tips: content.polishInteractiveTips?.slice(0, 2) || [],
			};
		case "expert":
			return {
				description: content.polishExpertDescription,
				facts: content.polishKeyFacts || [],
				tips: content.polishInteractiveTips || [],
				concepts: content.polishRelatedConcepts || [],
			};
		default:
			return {
				description: content.polishIntermediateDescription,
				facts: content.polishKeyFacts?.slice(0, 5) || [],
				tips: content.polishInteractiveTips || [],
			};
	}
};

// Static methods
BrainRegionSchema.statics.findByCategory = function (category: string) {
	return this.find({ category: category.toUpperCase(), isActive: true });
};

BrainRegionSchema.statics.findByFunction = function (functionName: string) {
	return this.find({
		$or: [
			{ functions: new RegExp(functionName, "i") },
			{ polishFunctions: new RegExp(functionName, "i") },
		],
		isActive: true,
	});
};

BrainRegionSchema.statics.findBySupplementEffect = function (
	supplementId: string,
) {
	return this.find({
		"supplementEffects.supplementId": supplementId,
		isActive: true,
	});
};

BrainRegionSchema.statics.searchRegions = function (
	query: string,
	language: "en" | "pl" = "pl",
) {
	const searchFields =
		language === "pl"
			? {
					polishName: "text",
					polishDescription: "text",
					polishFunctions: "text",
				}
			: { name: "text", description: "text", functions: "text" };

	return this.find({
		$text: { $search: query },
		isActive: true,
	}).sort({ score: { $meta: "textScore" } });
};

// Interface for TypeScript
export interface IBrainRegion extends Document {
	id: string;
	name: string;
	polishName: string;
	category: string;
	hemisphere: string;
	functions: string[];
	polishFunctions: string[];
	description: string;
	polishDescription: string;
	anatomicalInfo: any;
	neurotransmitterActivity: any[];
	functionalNetworks: any[];
	supplementEffects: any[];
	educationalContent: any;
	visualizationProperties: any;
	clinicalSignificance: string;
	polishClinicalSignificance: string;
	associatedDisorders: string[];
	polishAssociatedDisorders: string[];
	researchAreas: string[];
	polishResearchAreas: string[];
	tags: string[];
	polishTags: string[];
	lastUpdated: Date;
	version: string;
	isActive: boolean;
	difficultyLevel: string;
	modelFile?: string;
	textureFiles: string[];

	// Methods
	getSupplementEffects(supplementId?: string): any[];
	getNeurotransmitterActivity(neurotransmitter?: string): any[];
	getEducationalContent(level?: "beginner" | "intermediate" | "expert"): any;
}

// Create and export the model
const BrainRegion: Model<IBrainRegion> =
	mongoose.models.BrainRegion ||
	mongoose.model<IBrainRegion>("BrainRegion", BrainRegionSchema);

export default BrainRegion;
