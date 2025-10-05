/**
 * Research Evidence MongoDB Schema
 * Comprehensive schema for storing and managing research studies and evidence
 */

import mongoose, { Schema, type Document, type Model } from "mongoose";

// Author Schema
const AuthorSchema = new Schema(
	{
		name: { type: String, required: true },
		affiliation: { type: String },
		orcid: { type: String },
		email: { type: String },
		isCorresponding: { type: Boolean, default: false },
	},
	{ _id: false },
);

// Study Population Schema
const StudyPopulationSchema = new Schema(
	{
		totalParticipants: { type: Number, required: true },
		demographics: {
			ageRange: { type: String },
			meanAge: { type: Number },
			genderDistribution: {
				male: { type: Number },
				female: { type: Number },
				other: { type: Number },
			},
			ethnicity: [{ type: String }],
			healthStatus: { type: String },
			polishHealthStatus: { type: String },
		},
		inclusionCriteria: [{ type: String }],
		polishInclusionCriteria: [{ type: String }],
		exclusionCriteria: [{ type: String }],
		polishExclusionCriteria: [{ type: String }],
		dropoutRate: { type: Number },
		dropoutReasons: [{ type: String }],
		polishDropoutReasons: [{ type: String }],
	},
	{ _id: false },
);

// Intervention Schema
const InterventionSchema = new Schema(
	{
		supplementId: { type: String, required: true },
		supplementName: { type: String, required: true },
		polishSupplementName: { type: String, required: true },
		dosage: { type: String, required: true },
		frequency: { type: String, required: true },
		polishFrequency: { type: String, required: true },
		duration: { type: String, required: true },
		polishDuration: { type: String, required: true },
		form: { type: String, required: true },
		polishForm: { type: String, required: true },
		manufacturer: { type: String },
		batchNumber: { type: String },
		purity: { type: String },
		standardization: { type: String },
		polishStandardization: { type: String },
		administrationMethod: { type: String },
		polishAdministrationMethod: { type: String },
		compliance: {
			measured: { type: Boolean, default: false },
			method: { type: String },
			polishMethod: { type: String },
			rate: { type: Number },
		},
	},
	{ _id: false },
);

// Outcome Measure Schema
const OutcomeMeasureSchema = new Schema(
	{
		name: { type: String, required: true },
		polishName: { type: String, required: true },
		type: {
			type: String,
			enum: ["PRIMARY", "SECONDARY", "EXPLORATORY"],
			required: true,
		},
		category: {
			type: String,
			enum: ["COGNITIVE", "PHYSICAL", "BIOCHEMICAL", "PSYCHOLOGICAL", "SAFETY"],
			required: true,
		},
		polishCategory: { type: String, required: true },
		measurementTool: { type: String, required: true },
		polishMeasurementTool: { type: String, required: true },
		unit: { type: String },
		polishUnit: { type: String },
		timepoints: [{ type: String }],
		polishTimepoints: [{ type: String }],
		results: {
			baseline: {
				intervention: { type: Number },
				control: { type: Number },
				pValue: { type: Number },
			},
			endpoint: {
				intervention: { type: Number },
				control: { type: Number },
				pValue: { type: Number },
				effectSize: { type: Number },
				confidenceInterval: { type: String },
			},
			changeFromBaseline: {
				intervention: { type: Number },
				control: { type: Number },
				difference: { type: Number },
				pValue: { type: Number },
				clinicalSignificance: { type: String },
				polishClinicalSignificance: { type: String },
			},
		},
	},
	{ _id: false },
);

// Quality Assessment Schema
const QualityAssessmentSchema = new Schema(
	{
		tool: {
			type: String,
			enum: ["COCHRANE_ROB", "JADAD", "PEDRO", "NEWCASTLE_OTTAWA", "CASP"],
			required: true,
		},
		overallRating: {
			type: String,
			enum: ["HIGH", "MODERATE", "LOW", "VERY_LOW"],
			required: true,
		},
		polishOverallRating: { type: String, required: true },
		domains: [
			{
				domain: { type: String, required: true },
				polishDomain: { type: String, required: true },
				rating: {
					type: String,
					enum: ["LOW_RISK", "HIGH_RISK", "UNCLEAR"],
					required: true,
				},
				polishRating: { type: String, required: true },
				justification: { type: String },
				polishJustification: { type: String },
			},
		],
		limitations: [{ type: String }],
		polishLimitations: [{ type: String }],
		strengths: [{ type: String }],
		polishStrengths: [{ type: String }],
	},
	{ _id: false },
);

// Statistical Analysis Schema
const StatisticalAnalysisSchema = new Schema(
	{
		analysisType: { type: String, required: true },
		polishAnalysisType: { type: String, required: true },
		powerCalculation: {
			performed: { type: Boolean, required: true },
			targetPower: { type: Number },
			effectSize: { type: Number },
			alpha: { type: Number },
			calculatedSampleSize: { type: Number },
		},
		statisticalTests: [{ type: String }],
		polishStatisticalTests: [{ type: String }],
		multipleComparisons: {
			correction: { type: String },
			polishCorrection: { type: String },
		},
		missingDataHandling: { type: String },
		polishMissingDataHandling: { type: String },
		intentionToTreat: { type: Boolean },
		perProtocol: { type: Boolean },
	},
	{ _id: false },
);

// Funding and Conflicts Schema
const FundingConflictsSchema = new Schema(
	{
		fundingSources: [{ type: String }],
		polishFundingSources: [{ type: String }],
		industrySponsorship: { type: Boolean, required: true },
		conflictsOfInterest: [{ type: String }],
		polishConflictsOfInterest: [{ type: String }],
		authorDisclosures: [{ type: String }],
		polishAuthorDisclosures: [{ type: String }],
		independentAnalysis: { type: Boolean },
		dataAvailability: { type: String },
		polishDataAvailability: { type: String },
	},
	{ _id: false },
);

// Main Research Study Schema
const ResearchStudySchema = new Schema(
	{
		// Basic identification
		pubmedId: { type: String, unique: true, sparse: true, index: true },
		doi: { type: String, unique: true, sparse: true, index: true },
		title: { type: String, required: true, index: true },
		polishTitle: { type: String, required: true, index: true },

		// Publication details
		journal: { type: String, required: true, index: true },
		volume: { type: String },
		issue: { type: String },
		pages: { type: String },
		publicationDate: { type: Date, required: true, index: true },
		onlineDate: { type: Date },

		// Study design
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
			index: true,
		},
		polishStudyType: { type: String, required: true },
		studyDesign: { type: String, required: true },
		polishStudyDesign: { type: String, required: true },

		// Content
		abstract: { type: String, required: true },
		polishAbstract: { type: String, required: true },
		keywords: [{ type: String }],
		polishKeywords: [{ type: String }],
		meshTerms: [{ type: String, index: true }],

		// Study details
		authors: [AuthorSchema],
		studyPopulation: StudyPopulationSchema,
		interventions: [InterventionSchema],
		outcomeMeasures: [OutcomeMeasureSchema],

		// Quality and analysis
		qualityAssessment: QualityAssessmentSchema,
		statisticalAnalysis: StatisticalAnalysisSchema,
		fundingConflicts: FundingConflictsSchema,

		// Results and conclusions
		primaryFindings: { type: String, required: true },
		polishPrimaryFindings: { type: String, required: true },
		secondaryFindings: [{ type: String }],
		polishSecondaryFindings: [{ type: String }],
		conclusions: { type: String, required: true },
		polishConclusions: { type: String, required: true },
		clinicalImplications: { type: String },
		polishClinicalImplications: { type: String },
		futureResearch: { type: String },
		polishFutureResearch: { type: String },

		// Evidence assessment
		evidenceLevel: {
			type: String,
			enum: ["STRONG", "MODERATE", "WEAK", "INSUFFICIENT", "CONFLICTING"],
			required: true,
			index: true,
		},
		polishEvidenceLevel: { type: String, required: true },
		gradeRating: { type: String },
		polishGradeRating: { type: String },

		// Metrics
		citationCount: { type: Number, default: 0 },
		impactFactor: { type: Number },
		altmetricScore: { type: Number },

		// Categorization
		supplementIds: [{ type: String, index: true }],
		brainRegionIds: [{ type: String, index: true }],
		neurotransmitterIds: [{ type: String, index: true }],
		conditionsStudied: [{ type: String }],
		polishConditionsStudied: [{ type: String }],

		// Metadata
		tags: [{ type: String }],
		polishTags: [{ type: String }],
		lastUpdated: { type: Date, default: Date.now },
		version: { type: String, default: "1.0.0" },
		isActive: { type: Boolean, default: true, index: true },

		// Data extraction
		extractedBy: { type: String },
		extractedDate: { type: Date },
		reviewedBy: { type: String },
		reviewedDate: { type: Date },
		extractionNotes: { type: String },
		polishExtractionNotes: { type: String },
	},
	{
		timestamps: true,
		collection: "research_studies",
	},
);

// Indexes for performance
ResearchStudySchema.index({
	title: "text",
	polishTitle: "text",
	abstract: "text",
	polishAbstract: "text",
});
ResearchStudySchema.index({ studyType: 1, evidenceLevel: 1 });
ResearchStudySchema.index({ publicationDate: -1 });
ResearchStudySchema.index({ journal: 1, publicationDate: -1 });
ResearchStudySchema.index({ "interventions.supplementId": 1 });
ResearchStudySchema.index({ conditionsStudied: 1 });
ResearchStudySchema.index({ polishConditionsStudied: 1 });
ResearchStudySchema.index({ keywords: 1 });
ResearchStudySchema.index({ polishKeywords: 1 });
ResearchStudySchema.index({ citationCount: -1 });
ResearchStudySchema.index({
	isActive: 1,
	evidenceLevel: 1,
	publicationDate: -1,
});

// Methods
ResearchStudySchema.methods.getSupplementInterventions = function (
	supplementId?: string,
) {
	if (supplementId) {
		return this.interventions.filter(
			(intervention: any) => intervention.supplementId === supplementId,
		);
	}
	return this.interventions;
};

ResearchStudySchema.methods.getPrimaryOutcomes = function () {
	return this.outcomeMeasures.filter(
		(outcome: any) => outcome.type === "PRIMARY",
	);
};

ResearchStudySchema.methods.getSecondaryOutcomes = function () {
	return this.outcomeMeasures.filter(
		(outcome: any) => outcome.type === "SECONDARY",
	);
};

ResearchStudySchema.methods.getQualityScore = function () {
	const rating = this.qualityAssessment?.overallRating;
	switch (rating) {
		case "HIGH":
			return 4;
		case "MODERATE":
			return 3;
		case "LOW":
			return 2;
		case "VERY_LOW":
			return 1;
		default:
			return 0;
	}
};

// Static methods
ResearchStudySchema.statics.findBySupplementId = function (
	supplementId: string,
) {
	return this.find({
		"interventions.supplementId": supplementId,
		isActive: true,
	}).sort({ publicationDate: -1 });
};

ResearchStudySchema.statics.findByEvidenceLevel = function (level: string) {
	return this.find({
		evidenceLevel: level,
		isActive: true,
	}).sort({ publicationDate: -1 });
};

ResearchStudySchema.statics.findByStudyType = function (type: string) {
	return this.find({
		studyType: type,
		isActive: true,
	}).sort({ publicationDate: -1 });
};

ResearchStudySchema.statics.searchStudies = function (
	query: string,
	language: "en" | "pl" = "pl",
) {
	return this.find({
		$text: { $search: query },
		isActive: true,
	}).sort({ score: { $meta: "textScore" }, publicationDate: -1 });
};

ResearchStudySchema.statics.getRecentStudies = function (days = 30) {
	const cutoffDate = new Date();
	cutoffDate.setDate(cutoffDate.getDate() - days);

	return this.find({
		publicationDate: { $gte: cutoffDate },
		isActive: true,
	}).sort({ publicationDate: -1 });
};

// Interface for TypeScript
export interface IResearchStudy extends Document {
	pubmedId?: string;
	doi?: string;
	title: string;
	polishTitle: string;
	journal: string;
	volume?: string;
	issue?: string;
	pages?: string;
	publicationDate: Date;
	onlineDate?: Date;
	studyType: string;
	polishStudyType: string;
	studyDesign: string;
	polishStudyDesign: string;
	abstract: string;
	polishAbstract: string;
	keywords: string[];
	polishKeywords: string[];
	meshTerms: string[];
	authors: any[];
	studyPopulation: any;
	interventions: any[];
	outcomeMeasures: any[];
	qualityAssessment: any;
	statisticalAnalysis: any;
	fundingConflicts: any;
	primaryFindings: string;
	polishPrimaryFindings: string;
	secondaryFindings: string[];
	polishSecondaryFindings: string[];
	conclusions: string;
	polishConclusions: string;
	clinicalImplications?: string;
	polishClinicalImplications?: string;
	futureResearch?: string;
	polishFutureResearch?: string;
	evidenceLevel: string;
	polishEvidenceLevel: string;
	gradeRating?: string;
	polishGradeRating?: string;
	citationCount: number;
	impactFactor?: number;
	altmetricScore?: number;
	supplementIds: string[];
	brainRegionIds: string[];
	neurotransmitterIds: string[];
	conditionsStudied: string[];
	polishConditionsStudied: string[];
	tags: string[];
	polishTags: string[];
	lastUpdated: Date;
	version: string;
	isActive: boolean;
	extractedBy?: string;
	extractedDate?: Date;
	reviewedBy?: string;
	reviewedDate?: Date;
	extractionNotes?: string;
	polishExtractionNotes?: string;

	// Methods
	getSupplementInterventions(supplementId?: string): any[];
	getPrimaryOutcomes(): any[];
	getSecondaryOutcomes(): any[];
	getQualityScore(): number;
}

// Create and export the model
const ResearchStudy: Model<IResearchStudy> =
	mongoose.models.ResearchStudy ||
	mongoose.model<IResearchStudy>("ResearchStudy", ResearchStudySchema);

export default ResearchStudy;
