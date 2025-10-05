/**
 * Neurotransmitter System MongoDB Schema
 * Comprehensive schema for neurotransmitter education with Polish translations
 */

import mongoose, { Schema, type Document, type Model } from "mongoose";

// Chemistry Schema
const ChemistrySchema = new Schema(
	{
		formula: { type: String, required: true },
		molecularWeight: { type: Number, required: true },
		structure: { type: String, required: true }, // SMILES notation
		synthesis: {
			precursor: { type: String, required: true },
			polishPrecursor: { type: String, required: true },
			enzymes: [{ type: String }],
			polishEnzymes: [{ type: String }],
			pathway: { type: String, required: true },
			polishPathway: { type: String, required: true },
		},
		degradation: {
			enzymes: [{ type: String }],
			polishEnzymes: [{ type: String }],
			metabolites: [{ type: String }],
			polishMetabolites: [{ type: String }],
		},
	},
	{ _id: false },
);

// Receptor Schema
const ReceptorSchema = new Schema(
	{
		id: { type: String, required: true },
		name: { type: String, required: true },
		polishName: { type: String, required: true },
		type: {
			type: String,
			enum: ["IONOTROPIC", "METABOTROPIC"],
			required: true,
		},
		location: [{ type: String }],
		polishLocation: [{ type: String }],
		function: { type: String, required: true },
		polishFunction: { type: String, required: true },
		affinity: { type: Number, required: true }, // nM
		signaling: [{ type: String }],
		polishSignaling: [{ type: String }],
		pharmacology: {
			agonists: [{ type: String }],
			polishAgonists: [{ type: String }],
			antagonists: [{ type: String }],
			polishAntagonists: [{ type: String }],
			allostericModulators: [{ type: String }],
			polishAllostericModulators: [{ type: String }],
		},
	},
	{ _id: false },
);

// Pathway Schema
const PathwaySchema = new Schema(
	{
		id: { type: String, required: true },
		name: { type: String, required: true },
		polishName: { type: String, required: true },
		origin: { type: String, required: true },
		polishOrigin: { type: String, required: true },
		targets: [{ type: String }],
		polishTargets: [{ type: String }],
		function: { type: String, required: true },
		polishFunction: { type: String, required: true },
		clinicalRelevance: { type: String, required: true },
		polishClinicalRelevance: { type: String, required: true },
		anatomicalPath: [
			{
				region: { type: String, required: true },
				polishRegion: { type: String, required: true },
				coordinates: {
					x: { type: Number, required: true },
					y: { type: Number, required: true },
					z: { type: Number, required: true },
				},
				connectionType: {
					type: String,
					enum: ["PROJECTION", "INTERNEURON", "FEEDBACK"],
					required: true,
				},
			},
		],
		visualizationData: {
			color: { type: String, required: true },
			thickness: { type: Number, required: true, min: 0.1, max: 5 },
			opacity: { type: Number, required: true, min: 0, max: 1 },
			animationSpeed: { type: Number, default: 1 },
		},
	},
	{ _id: false },
);

// Function Schema
const FunctionSchema = new Schema(
	{
		category: { type: String, required: true },
		polishCategory: { type: String, required: true },
		effects: [{ type: String }],
		polishEffects: [{ type: String }],
		mechanisms: [{ type: String }],
		polishMechanisms: [{ type: String }],
		timeScale: { type: String, required: true },
		polishTimeScale: { type: String, required: true },
		behavioralOutcomes: [{ type: String }],
		polishBehavioralOutcomes: [{ type: String }],
		cognitiveEffects: [{ type: String }],
		polishCognitiveEffects: [{ type: String }],
	},
	{ _id: false },
);

// Supplement Interaction Schema
const SupplementInteractionSchema = new Schema(
	{
		supplementId: { type: String, required: true },
		supplementName: { type: String, required: true },
		polishSupplementName: { type: String, required: true },
		interactionType: {
			type: String,
			enum: ["INCREASES", "DECREASES", "MODULATES", "BLOCKS", "ENHANCES"],
			required: true,
		},
		mechanism: { type: String, required: true },
		polishMechanism: { type: String, required: true },
		evidenceLevel: {
			type: String,
			enum: ["STRONG", "MODERATE", "WEAK", "INSUFFICIENT"],
			required: true,
		},
		clinicalSignificance: { type: String, required: true },
		polishClinicalSignificance: { type: String, required: true },
		doseDependency: { type: Boolean, required: true },
		timeToEffect: { type: String, required: true },
		polishTimeToEffect: { type: String, required: true },
		studyReferences: [
			{
				pubmedId: { type: String },
				doi: { type: String },
				title: { type: String },
				polishTitle: { type: String },
				year: { type: Number },
				studyType: { type: String },
				sampleSize: { type: Number },
			},
		],
	},
	{ _id: false },
);

// Clinical Disorder Schema
const ClinicalDisorderSchema = new Schema(
	{
		condition: { type: String, required: true },
		polishCondition: { type: String, required: true },
		alteration: {
			type: String,
			enum: ["INCREASED", "DECREASED", "DYSREGULATED"],
			required: true,
		},
		mechanism: { type: String, required: true },
		polishMechanism: { type: String, required: true },
		symptoms: [{ type: String }],
		polishSymptoms: [{ type: String }],
		treatments: [{ type: String }],
		polishTreatments: [{ type: String }],
		prevalence: { type: String },
		prognosis: { type: String },
		polishPrognosis: { type: String },
	},
	{ _id: false },
);

// Biomarker Schema
const BiomarkerSchema = new Schema(
	{
		marker: { type: String, required: true },
		polishMarker: { type: String, required: true },
		normalRange: { type: String, required: true },
		unit: { type: String, required: true },
		clinicalSignificance: { type: String, required: true },
		polishClinicalSignificance: { type: String, required: true },
		measurementMethod: { type: String },
		polishMeasurementMethod: { type: String },
		factors: [{ type: String }],
		polishFactors: [{ type: String }],
	},
	{ _id: false },
);

// Educational Content Schema
const EducationalContentSchema = new Schema(
	{
		beginnerExplanation: { type: String, required: true },
		polishBeginnerExplanation: { type: String, required: true },
		intermediateDetails: { type: String, required: true },
		polishIntermediateDetails: { type: String, required: true },
		expertAnalysis: { type: String, required: true },
		polishExpertAnalysis: { type: String, required: true },
		keyFacts: [{ type: String }],
		polishKeyFacts: [{ type: String }],
		commonMisconceptions: [{ type: String }],
		polishCommonMisconceptions: [{ type: String }],
		interactiveElements: [
			{
				type: {
					type: String,
					enum: ["QUIZ", "SIMULATION", "VISUALIZATION", "CASE_STUDY"],
					required: true,
				},
				title: { type: String, required: true },
				polishTitle: { type: String, required: true },
				description: { type: String, required: true },
				polishDescription: { type: String, required: true },
				data: { type: Schema.Types.Mixed }, // Flexible data for different element types
			},
		],
	},
	{ _id: false },
);

// Main Neurotransmitter System Schema
const NeurotransmitterSystemSchema = new Schema(
	{
		id: { type: String, required: true, unique: true, index: true },
		name: { type: String, required: true, index: true },
		polishName: { type: String, required: true, index: true },
		description: { type: String, required: true },
		polishDescription: { type: String, required: true },
		category: {
			type: String,
			enum: ["MONOAMINE", "AMINO_ACID", "PEPTIDE", "GASEOUS", "LIPID"],
			required: true,
			index: true,
		},

		// Embedded schemas
		chemistry: ChemistrySchema,
		receptors: [ReceptorSchema],
		pathways: [PathwaySchema],
		functions: [FunctionSchema],
		supplementInteractions: [SupplementInteractionSchema],
		clinicalAspects: {
			disorders: [ClinicalDisorderSchema],
			biomarkers: [BiomarkerSchema],
		},
		educationalContent: EducationalContentSchema,

		// Research and evidence
		researchStatus: {
			type: String,
			enum: ["WELL_ESTABLISHED", "EMERGING", "EXPERIMENTAL"],
			required: true,
		},
		lastResearchUpdate: { type: Date, required: true },
		keyResearchers: [{ type: String }],
		researchInstitutions: [{ type: String }],

		// Visualization properties
		visualizationProperties: {
			primaryColor: { type: String, required: true },
			secondaryColor: { type: String },
			iconType: { type: String },
			animationStyle: {
				type: String,
				enum: ["PULSE", "FLOW", "STATIC", "WAVE"],
				default: "PULSE",
			},
		},

		// Metadata
		tags: [{ type: String }],
		polishTags: [{ type: String }],
		lastUpdated: { type: Date, default: Date.now },
		version: { type: String, default: "1.0.0" },
		isActive: { type: Boolean, default: true, index: true },

		// Educational level
		complexity: {
			type: String,
			enum: ["BASIC", "INTERMEDIATE", "ADVANCED"],
			default: "INTERMEDIATE",
			index: true,
		},
	},
	{
		timestamps: true,
		collection: "neurotransmitter_systems",
	},
);

// Indexes for performance
NeurotransmitterSystemSchema.index({
	name: "text",
	polishName: "text",
	description: "text",
	polishDescription: "text",
});
NeurotransmitterSystemSchema.index({ category: 1, complexity: 1 });
NeurotransmitterSystemSchema.index({
	"supplementInteractions.supplementId": 1,
});
NeurotransmitterSystemSchema.index({
	"clinicalAspects.disorders.condition": 1,
});
NeurotransmitterSystemSchema.index({
	"clinicalAspects.disorders.polishCondition": 1,
});
NeurotransmitterSystemSchema.index({ tags: 1 });
NeurotransmitterSystemSchema.index({ polishTags: 1 });
NeurotransmitterSystemSchema.index({ isActive: 1, researchStatus: 1 });

// Methods
NeurotransmitterSystemSchema.methods.getSupplementInteractions = function (
	supplementId?: string,
) {
	if (supplementId) {
		return this.supplementInteractions.filter(
			(interaction: any) => interaction.supplementId === supplementId,
		);
	}
	return this.supplementInteractions;
};

NeurotransmitterSystemSchema.methods.getReceptorsByType = function (
	type: "IONOTROPIC" | "METABOTROPIC",
) {
	return this.receptors.filter((receptor: any) => receptor.type === type);
};

NeurotransmitterSystemSchema.methods.getPathwaysByFunction = function (
	functionKeyword: string,
) {
	return this.pathways.filter(
		(pathway: any) =>
			pathway.function.toLowerCase().includes(functionKeyword.toLowerCase()) ||
			pathway.polishFunction
				.toLowerCase()
				.includes(functionKeyword.toLowerCase()),
	);
};

NeurotransmitterSystemSchema.methods.getEducationalContent = function (
	level: "beginner" | "intermediate" | "expert" = "intermediate",
) {
	const content = this.educationalContent;
	switch (level) {
		case "beginner":
			return {
				explanation: content.polishBeginnerExplanation,
				facts: content.polishKeyFacts?.slice(0, 3) || [],
				misconceptions: content.polishCommonMisconceptions?.slice(0, 2) || [],
			};
		case "expert":
			return {
				explanation: content.polishExpertAnalysis,
				facts: content.polishKeyFacts || [],
				misconceptions: content.polishCommonMisconceptions || [],
				interactive: content.interactiveElements || [],
			};
		default:
			return {
				explanation: content.polishIntermediateDetails || "",
				facts: content.polishKeyFacts?.slice(0, 5) || [],
				misconceptions: content.polishCommonMisconceptions || [],
			};
	}
};

// Static methods
NeurotransmitterSystemSchema.statics.findByCategory = function (
	category: string,
) {
	return this.find({ category: category.toUpperCase(), isActive: true });
};

NeurotransmitterSystemSchema.statics.findBySupplementInteraction = function (
	supplementId: string,
) {
	return this.find({
		"supplementInteractions.supplementId": supplementId,
		isActive: true,
	});
};

NeurotransmitterSystemSchema.statics.findByDisorder = function (
	disorder: string,
) {
	return this.find({
		$or: [
			{ "clinicalAspects.disorders.condition": new RegExp(disorder, "i") },
			{
				"clinicalAspects.disorders.polishCondition": new RegExp(disorder, "i"),
			},
		],
		isActive: true,
	});
};

NeurotransmitterSystemSchema.statics.searchSystems = function (
	query: string,
	language: "en" | "pl" = "pl",
) {
	return this.find({
		$text: { $search: query },
		isActive: true,
	}).sort({ score: { $meta: "textScore" } });
};

// Interface for TypeScript
export interface INeurotransmitterSystem extends Document {
	id: string;
	name: string;
	polishName: string;
	description: string;
	polishDescription: string;
	category: string;
	chemistry: any;
	receptors: any[];
	pathways: any[];
	functions: any[];
	supplementInteractions: any[];
	clinicalAspects: any;
	educationalContent: any;
	researchStatus: string;
	lastResearchUpdate: Date;
	keyResearchers: string[];
	researchInstitutions: string[];
	visualizationProperties: any;
	tags: string[];
	polishTags: string[];
	lastUpdated: Date;
	version: string;
	isActive: boolean;
	complexity: string;

	// Methods
	getSupplementInteractions(supplementId?: string): any[];
	getReceptorsByType(type: "IONOTROPIC" | "METABOTROPIC"): any[];
	getPathwaysByFunction(functionKeyword: string): any[];
	getEducationalContent(level?: "beginner" | "intermediate" | "expert"): any;
}

// Create and export the model
const NeurotransmitterSystem: Model<INeurotransmitterSystem> =
	mongoose.models.NeurotransmitterSystem ||
	mongoose.model<INeurotransmitterSystem>(
		"NeurotransmitterSystem",
		NeurotransmitterSystemSchema,
	);

export default NeurotransmitterSystem;
