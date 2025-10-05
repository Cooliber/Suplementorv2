/**
 * Mongoose Schema for Supplements
 * Comprehensive model with Polish localization and evidence-based data
 */

import type {
	ActiveCompound,
	ClinicalApplication,
	DosageGuidelines,
	MechanismOfAction,
	ResearchStudy,
	SideEffect,
	SupplementInteraction,
	SupplementWithRelations,
} from "@/types/supplement";
import mongoose, { Schema, type Document, type Model } from "mongoose";

// Subdocument schemas
const ActiveCompoundSchema = new Schema(
	{
		name: { type: String, required: true },
		polishName: { type: String },
		concentration: { type: String },
		bioavailability: { type: Number, min: 0, max: 100 },
		halfLife: { type: String },
		metabolicPathway: [{ type: String }],
		targetReceptors: [{ type: String }],
	},
	{ _id: false },
);

const ClinicalApplicationSchema = new Schema(
	{
		condition: { type: String, required: true },
		polishCondition: { type: String, required: true },
		indication: { type: String },
		polishIndication: { type: String },
		efficacy: {
			type: String,
			enum: ["high", "moderate", "low", "insufficient"],
			required: true,
		},
		effectivenessRating: { type: Number, required: true, min: 0, max: 10 },
		evidenceLevel: {
			type: String,
			enum: ["STRONG", "MODERATE", "WEAK", "INSUFFICIENT", "CONFLICTING"],
			required: true,
		},
		recommendedDose: { type: String, required: true },
		duration: { type: String },
		effectSize: { type: Number },
		studyCount: { type: Number },
		participantCount: { type: Number },
		recommendationGrade: { type: String },
	},
	{ _id: false },
);

const MechanismOfActionSchema = new Schema(
	{
		id: { type: String },
		name: { type: String },
		polishName: { type: String },
		pathway: { type: String, required: true },
		polishPathway: { type: String, required: true },
		description: { type: String, required: true },
		polishDescription: { type: String, required: true },
		evidenceLevel: {
			type: String,
			enum: ["STRONG", "MODERATE", "WEAK", "INSUFFICIENT", "CONFLICTING"],
			required: true,
		},
		targetSystems: [{ type: String }],
		timeToEffect: { type: String },
		duration: { type: String },
	},
	{ _id: false },
);

const SideEffectSchema = new Schema(
	{
		effect: { type: String, required: true },
		polishEffect: { type: String, required: true },
		frequency: {
			type: String,
			enum: ["common", "uncommon", "rare", "very_rare"],
			required: true,
		},
		severity: {
			type: String,
			enum: ["mild", "moderate", "severe"],
			required: true,
		},
		reversible: { type: Boolean, required: true },
		dosageDependent: { type: Boolean },
		timeToOnset: { type: String },
		management: { type: String },
		polishManagement: { type: String },
	},
	{ _id: false },
);

const SupplementInteractionSchema = new Schema(
	{
		substance: { type: String, required: true },
		polishSubstance: { type: String },
		type: {
			type: String,
			enum: ["synergistic", "antagonistic", "additive", "competitive"],
			required: true,
		},
		severity: {
			type: String,
			enum: ["severe", "moderate", "minor", "beneficial"],
			required: true,
		},
		clinicalSignificance: { type: String, required: true },
		polishClinicalSignificance: { type: String, required: true },
		mechanism: { type: String },
		polishMechanism: { type: String },
		description: { type: String, required: true },
		polishDescription: { type: String },
		recommendation: { type: String },
		polishRecommendation: { type: String },
		evidenceLevel: {
			type: String,
			enum: ["STRONG", "MODERATE", "WEAK", "INSUFFICIENT", "CONFLICTING"],
		},
	},
	{ _id: false },
);

const DosageGuidelinesSchema = new Schema(
	{
		therapeuticRange: {
			min: { type: Number, required: true, min: 0 },
			max: { type: Number, required: true, min: 0 },
			unit: { type: String, required: true },
		},
		timing: [{ type: String, required: true }],
		withFood: { type: Boolean, required: true },
		contraindications: [{ type: String }],
		polishContraindications: [{ type: String }],
		interactions: [SupplementInteractionSchema],
	},
	{ _id: false },
);

const ResearchStudySchema = new Schema(
	{
		id: { type: String },
		title: { type: String, required: true },
		polishTitle: { type: String },
		authors: [{ type: String, required: true }],
		journal: { type: String, required: true },
		year: {
			type: Number,
			required: true,
			min: 1900,
			max: new Date().getFullYear(),
		},
		studyType: {
			type: String,
			enum: [
				"SYSTEMATIC_REVIEW",
				"META_ANALYSIS",
				"RANDOMIZED_CONTROLLED_TRIAL",
				"COHORT_STUDY",
				"CASE_CONTROL_STUDY",
				"CROSS_SECTIONAL_STUDY",
				"CASE_SERIES",
				"CASE_REPORT",
				"EXPERT_OPINION",
				"IN_VITRO",
				"ANIMAL_STUDY",
			],
			required: true,
		},
		primaryOutcome: { type: String, required: true },
		polishPrimaryOutcome: { type: String },
		findings: { type: String, required: true },
		polishFindings: { type: String },
		evidenceLevel: {
			type: String,
			enum: ["STRONG", "MODERATE", "WEAK", "INSUFFICIENT", "CONFLICTING"],
			required: true,
		},
		lastUpdated: { type: Date, required: true },
		pubmedId: { type: String },
		pmid: { type: String },
		doi: { type: String },
		sampleSize: { type: Number },
		participantCount: { type: Number },
		duration: { type: String },
		dosage: { type: String },
		results: { type: String },
		polishResults: { type: String },
		secondaryOutcomes: [{ type: String }],
		polishSecondaryOutcomes: [{ type: String }],
		limitations: { type: String },
		polishLimitations: { type: String },
		qualityScore: { type: Number },
		conflictOfInterest: { type: String },
		polishConflictOfInterest: { type: String },
		funding: { type: String },
		polishFunding: { type: String },
		url: { type: String },
		abstract: { type: String },
		polishAbstract: { type: String },
		keywords: [{ type: String }],
		meshTerms: [{ type: String }],
		citationCount: { type: Number },
	},
	{ _id: false },
);

// Main Supplement Schema
const SupplementSchema = new Schema(
	{
		_id: { type: String, required: true }, // Custom ID instead of ObjectId
		name: { type: String, required: true, index: true },
		polishName: { type: String, required: true, index: true },
		scientificName: { type: String },
		commonNames: [{ type: String }],
		polishCommonNames: [{ type: String }],
		category: {
			type: String,
			enum: [
				"VITAMIN",
				"MINERAL",
				"AMINO_ACID",
				"FATTY_ACID",
				"HERB",
				"NOOTROPIC",
				"ADAPTOGEN",
				"PROBIOTIC",
				"ENZYME",
				"OTHER",
			],
			required: true,
			index: true,
		},
		description: { type: String },
		polishDescription: { type: String },

		// Complex nested data
		activeCompounds: [ActiveCompoundSchema],
		clinicalApplications: [ClinicalApplicationSchema],
		mechanisms: [MechanismOfActionSchema],
		dosageGuidelines: { type: DosageGuidelinesSchema, required: true },
		sideEffects: [SideEffectSchema],
		interactions: [SupplementInteractionSchema],

		// Evidence and research
		evidenceLevel: {
			type: String,
			enum: ["STRONG", "MODERATE", "WEAK", "INSUFFICIENT", "CONFLICTING"],
			required: true,
			index: true,
		},
		researchStudies: [ResearchStudySchema],

		// Metadata
		tags: [{ type: String }],

		// Knowledge graph reference
		knowledgeNodeId: { type: String, ref: "KnowledgeNode" },
	},
	{
		timestamps: true, // Automatically adds createdAt and updatedAt
		collection: "supplements",
	},
);

// Indexes for performance
SupplementSchema.index({
	name: "text",
	polishName: "text",
	description: "text",
});
SupplementSchema.index({ category: 1, evidenceLevel: 1 });
SupplementSchema.index({ tags: 1 });
SupplementSchema.index({ "activeCompounds.name": 1 });

// Virtual for ID compatibility
SupplementSchema.virtual("id").get(function () {
	return this._id;
});

// Ensure virtual fields are serialized
SupplementSchema.set("toJSON", {
	virtuals: true,
	transform: (doc, ret: any) => {
		ret.id = ret._id;
		ret._id = undefined;
		ret.__v = undefined;
		return ret;
	},
});

// Document interface
export interface ISupplementDocument
	extends Document,
		Omit<SupplementWithRelations, "id"> {
	_id: string;
}

// Model interface
export interface ISupplementModel extends Model<ISupplementDocument> {
	findByCategory(category: string): Promise<ISupplementDocument[]>;
	findByEvidenceLevel(level: string): Promise<ISupplementDocument[]>;
	searchByText(query: string): Promise<ISupplementDocument[]>;
}

// Static methods
SupplementSchema.statics.findByCategory = function (category: string) {
	return this.find({ category });
};

SupplementSchema.statics.findByEvidenceLevel = function (level: string) {
	return this.find({ evidenceLevel: level });
};

SupplementSchema.statics.searchByText = function (query: string) {
	return this.find({ $text: { $search: query } });
};

// Create and export model
const Supplement =
	(mongoose.models.Supplement as unknown as ISupplementModel) ||
	mongoose.model<ISupplementDocument, ISupplementModel>(
		"Supplement",
		SupplementSchema,
	);

export default Supplement;
