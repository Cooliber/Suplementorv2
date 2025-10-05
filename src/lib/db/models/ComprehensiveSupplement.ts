/**
 * Comprehensive Supplement MongoDB Schema
 * Enhanced schema for Polish supplement education platform with full educational content
 */

import mongoose, { Schema, type Document, type Model } from "mongoose";

// Active Compound Schema
const ActiveCompoundSchema = new Schema(
	{
		name: { type: String, required: true },
		polishName: { type: String, required: true },
		concentration: { type: String, required: true },
		bioavailability: { type: Number, required: true, min: 0, max: 100 },
		halfLife: { type: String },
		polishHalfLife: { type: String },
		metabolites: [{ type: String }],
		polishMetabolites: [{ type: String }],
	},
	{ _id: false },
);

// Mechanism Schema
const MechanismSchema = new Schema(
	{
		pathway: { type: String, required: true },
		polishPathway: { type: String, required: true },
		targetSite: { type: String, required: true },
		polishTargetSite: { type: String, required: true },
		description: { type: String, required: true },
		polishDescription: { type: String, required: true },
		evidenceLevel: {
			type: String,
			enum: ["STRONG", "MODERATE", "WEAK", "INSUFFICIENT"],
			required: true,
		},
		timeToEffect: { type: String },
		polishTimeToEffect: { type: String },
	},
	{ _id: false },
);

// Clinical Application Schema
const ClinicalApplicationSchema = new Schema(
	{
		condition: { type: String, required: true },
		polishCondition: { type: String, required: true },
		effectivenessRating: { type: Number, required: true, min: 0, max: 10 },
		evidenceLevel: {
			type: String,
			enum: ["STRONG", "MODERATE", "WEAK", "INSUFFICIENT"],
			required: true,
		},
		recommendedDosage: { type: String, required: true },
		duration: { type: String, required: true },
		mechanism: { type: String, required: true },
		polishMechanism: { type: String, required: true },
		contraindications: [{ type: String }],
		polishContraindications: [{ type: String }],
		monitoringRequirements: [{ type: String }],
		polishMonitoringRequirements: [{ type: String }],
	},
	{ _id: false },
);

// Pharmacokinetics Schema
const PharmacokineticsSchema = new Schema(
	{
		absorption: {
			rate: { type: String },
			factors: [{ type: String }],
			polishFactors: [{ type: String }],
			bioavailability: { type: Number, min: 0, max: 100 },
		},
		distribution: {
			volumeOfDistribution: { type: String },
			proteinBinding: { type: Number, min: 0, max: 100 },
			tissueDistribution: [{ type: String }],
			polishTissueDistribution: [{ type: String }],
		},
		metabolism: {
			primaryPathway: { type: String },
			polishPrimaryPathway: { type: String },
			enzymes: [{ type: String }],
			metabolites: [{ type: String }],
			polishMetabolites: [{ type: String }],
		},
		elimination: {
			halfLife: { type: String },
			clearance: { type: String },
			excretionRoute: { type: String },
			polishExcretionRoute: { type: String },
		},
	},
	{ _id: false },
);

// Safety Profile Schema
const SafetyProfileSchema = new Schema(
	{
		pregnancyCategory: {
			type: String,
			enum: ["A", "B", "C", "D", "X", "UNKNOWN"],
			required: true,
		},
		breastfeedingSafety: {
			type: String,
			enum: ["Safe", "Caution", "Avoid", "Unknown"],
			required: true,
		},
		pediatricUse: {
			approved: { type: Boolean, required: true },
			ageRestrictions: { type: String },
			polishAgeRestrictions: { type: String },
			dosageAdjustments: { type: String },
			polishDosageAdjustments: { type: String },
		},
		elderlyConsiderations: [{ type: String }],
		polishElderlyConsiderations: [{ type: String }],
		hepaticImpairment: { type: String },
		polishHepaticImpairment: { type: String },
		renalImpairment: { type: String },
		polishRenalImpairment: { type: String },
	},
	{ _id: false },
);

// Side Effect Schema
const SideEffectSchema = new Schema(
	{
		effect: { type: String, required: true },
		polishEffect: { type: String, required: true },
		frequency: { type: String, required: true },
		severity: {
			type: String,
			enum: ["Mild", "Moderate", "Severe"],
			required: true,
		},
		polishSeverity: { type: String, required: true },
		onset: { type: String },
		polishOnset: { type: String },
		duration: { type: String },
		polishDuration: { type: String },
		management: { type: String },
		polishManagement: { type: String },
	},
	{ _id: false },
);

// Interaction Schema
const InteractionSchema = new Schema(
	{
		substance: { type: String, required: true },
		polishSubstance: { type: String, required: true },
		type: {
			type: String,
			enum: ["DRUG", "SUPPLEMENT", "FOOD", "HERB"],
			required: true,
		},
		severity: {
			type: String,
			enum: ["MILD", "MODERATE", "SEVERE"],
			required: true,
		},
		mechanism: { type: String, required: true },
		polishMechanism: { type: String, required: true },
		clinicalEffect: { type: String, required: true },
		polishClinicalEffect: { type: String, required: true },
		recommendation: { type: String, required: true },
		polishRecommendation: { type: String, required: true },
		evidenceLevel: {
			type: String,
			enum: ["STRONG", "MODERATE", "WEAK", "THEORETICAL"],
			required: true,
		},
	},
	{ _id: false },
);

// Dosage Guidelines Schema
const DosageGuidelinesSchema = new Schema(
	{
		therapeuticRange: {
			min: { type: Number, required: true },
			optimal: { type: Number, required: true },
			max: { type: Number, required: true },
			unit: { type: String, required: true },
		},
		timing: [{ type: String }],
		polishTiming: [{ type: String }],
		frequency: { type: String, required: true },
		polishFrequency: { type: String, required: true },
		specialPopulations: { type: Map, of: String },
		polishSpecialPopulations: { type: Map, of: String },
	},
	{ _id: false },
);

// Clinical Evidence Schema
const ClinicalEvidenceSchema = new Schema(
	{
		totalStudies: { type: Number, required: true, min: 0 },
		rctCount: { type: Number, required: true, min: 0 },
		metaAnalyses: { type: Number, required: true, min: 0 },
		observationalStudies: { type: Number, required: true, min: 0 },
		lastUpdated: { type: Date, required: true },
		keyStudies: [
			{
				title: { type: String, required: true },
				polishTitle: { type: String, required: true },
				authors: [{ type: String }],
				journal: { type: String, required: true },
				year: { type: Number, required: true },
				pubmedId: { type: String },
				doi: { type: String },
				studyType: { type: String, required: true },
				sampleSize: { type: Number, required: true },
				findings: { type: String, required: true },
				polishFindings: { type: String, required: true },
			},
		],
	},
	{ _id: false },
);

// Economic Data Schema
const EconomicDataSchema = new Schema(
	{
		averageCostPerMonth: {
			low: { type: Number, required: true },
			average: { type: Number, required: true },
			high: { type: Number, required: true },
			currency: { type: String, default: "EUR" },
		},
		costEffectivenessRating: {
			type: String,
			enum: ["Excellent", "Good", "Fair", "Poor"],
			required: true,
		},
		polishCostEffectivenessRating: { type: String, required: true },
		availabilityInPoland: { type: Boolean, required: true },
		prescriptionRequired: { type: Boolean, required: true },
		reimbursementStatus: {
			type: String,
			enum: ["Full", "Partial", "None"],
			required: true,
		},
	},
	{ _id: false },
);

// Quality Considerations Schema
const QualityConsiderationsSchema = new Schema(
	{
		bioavailabilityForms: [{ type: String }],
		polishBioavailabilityForms: [{ type: String }],
		qualityMarkers: [{ type: String }],
		polishQualityMarkers: [{ type: String }],
		standardization: { type: String },
		polishStandardization: { type: String },
		storageRequirements: { type: String },
		polishStorageRequirements: { type: String },
		shelfLife: { type: String },
		contaminationRisks: [{ type: String }],
		polishContaminationRisks: [{ type: String }],
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
		keyTakeaways: [{ type: String }],
		polishKeyTakeaways: [{ type: String }],
		commonMisconceptions: [{ type: String }],
		polishCommonMisconceptions: [{ type: String }],
		practicalTips: [{ type: String }],
		polishPracticalTips: [{ type: String }],
	},
	{ _id: false },
);

// Main Comprehensive Supplement Schema
const ComprehensiveSupplementSchema = new Schema(
	{
		id: { type: String, required: true, unique: true, index: true },
		name: { type: String, required: true, index: true },
		polishName: { type: String, required: true, index: true },
		category: {
			type: String,
			enum: [
				"NOOTROPIC",
				"FATTY_ACID",
				"MINERAL",
				"VITAMIN",
				"HERB",
				"AMINO_ACID",
				"ADAPTOGEN",
				"COENZYME",
				"PROBIOTIC",
				"ENZYME",
				"OTHER",
			],
			required: true,
			index: true,
		},
		description: { type: String, required: true },
		polishDescription: { type: String, required: true },
		evidenceLevel: {
			type: String,
			enum: ["STRONG", "MODERATE", "WEAK", "INSUFFICIENT"],
			required: true,
			index: true,
		},

		// Embedded schemas
		activeCompounds: [ActiveCompoundSchema],
		mechanisms: [MechanismSchema],
		clinicalApplications: [ClinicalApplicationSchema],
		pharmacokinetics: PharmacokineticsSchema,
		safetyProfile: SafetyProfileSchema,
		sideEffects: [SideEffectSchema],
		interactions: [InteractionSchema],
		dosageGuidelines: DosageGuidelinesSchema,
		clinicalEvidence: ClinicalEvidenceSchema,
		economicData: EconomicDataSchema,
		qualityConsiderations: QualityConsiderationsSchema,
		educationalContent: EducationalContentSchema,

		// Metadata
		tags: [{ type: String }],
		polishTags: [{ type: String }],
		lastUpdated: { type: Date, default: Date.now },
		version: { type: String, default: "1.0.0" },
		isActive: { type: Boolean, default: true, index: true },

		// Search optimization
		searchKeywords: [{ type: String, index: true }],
		polishSearchKeywords: [{ type: String, index: true }],
	},
	{
		timestamps: true,
		collection: "supplements",
	},
);

// Indexes for performance
ComprehensiveSupplementSchema.index({
	name: "text",
	polishName: "text",
	description: "text",
	polishDescription: "text",
});
ComprehensiveSupplementSchema.index({ category: 1, evidenceLevel: 1 });
ComprehensiveSupplementSchema.index({ "clinicalApplications.condition": 1 });
ComprehensiveSupplementSchema.index({
	"clinicalApplications.polishCondition": 1,
});
ComprehensiveSupplementSchema.index({ tags: 1 });
ComprehensiveSupplementSchema.index({ polishTags: 1 });
ComprehensiveSupplementSchema.index({ isActive: 1, lastUpdated: -1 });
// Performance indexes for popular sorting and search
ComprehensiveSupplementSchema.index({
	"clinicalEvidence.totalStudies": -1,
	evidenceLevel: -1,
});
ComprehensiveSupplementSchema.index({ commonNames: 1 });
ComprehensiveSupplementSchema.index({ polishCommonNames: 1 });

// Interface for TypeScript
export interface IComprehensiveSupplement extends Document {
	id: string;
	name: string;
	polishName: string;
	category: string;
	description: string;
	polishDescription: string;
	evidenceLevel: string;
	activeCompounds: any[];
	mechanisms: any[];
	clinicalApplications: any[];
	pharmacokinetics: any;
	safetyProfile: any;
	sideEffects: any[];
	interactions: any[];
	dosageGuidelines: any;
	clinicalEvidence: any;
	economicData: any;
	qualityConsiderations: any;
	educationalContent: any;
	tags: string[];
	polishTags: string[];
	lastUpdated: Date;
	version: string;
	isActive: boolean;
	searchKeywords: string[];
	polishSearchKeywords: string[];
}

// Create and export the model
const ComprehensiveSupplement: Model<IComprehensiveSupplement> =
	mongoose.models.ComprehensiveSupplement ||
	mongoose.model<IComprehensiveSupplement>(
		"ComprehensiveSupplement",
		ComprehensiveSupplementSchema,
	);

export default ComprehensiveSupplement;
