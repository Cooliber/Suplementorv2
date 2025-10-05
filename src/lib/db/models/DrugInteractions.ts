/**
 * Drug-Supplement Interaction Models
 * MongoDB schemas for tracking medication interactions with supplements
 */

import mongoose, { Schema, type Document } from "mongoose";

// ==================== DRUG INTERACTION MODEL ====================

export interface IDrugSupplementInteraction extends Document {
	id: string;

	// Drug Information
	drugInfo: {
		name: string;
		polishName: string;
		genericName: string;
		polishGenericName: string;
		brandNames: string[];
		polishBrandNames: string[];
		drugClass: string;
		polishDrugClass: string;
		atcCode: string; // Anatomical Therapeutic Chemical code
		mechanism: string;
		polishMechanism: string;
	};

	// Supplement Information
	supplementInfo: {
		supplementId: string;
		name: string;
		polishName: string;
		category: string;
		polishCategory: string;
		activeCompounds: Array<{
			compound: string;
			polishCompound: string;
			concentration: string;
		}>;
	};

	// Interaction Details
	interaction: {
		type: "MAJOR" | "MODERATE" | "MINOR" | "THEORETICAL" | "BENEFICIAL";
		polishType: string;
		severity:
			| "LIFE_THREATENING"
			| "SEVERE"
			| "MODERATE"
			| "MILD"
			| "NEGLIGIBLE";
		polishSeverity: string;
		mechanism: string;
		polishMechanism: string;
		description: string;
		polishDescription: string;
		clinicalSignificance: string;
		polishClinicalSignificance: string;
		onset: "IMMEDIATE" | "RAPID" | "DELAYED" | "VARIABLE";
		polishOnset: string;
		timeToOnset: string;
		polishTimeToOnset: string;
		duration: string;
		polishDuration: string;
	};

	// Clinical Evidence
	evidence: {
		level: "STRONG" | "MODERATE" | "WEAK" | "THEORETICAL" | "ANECDOTAL";
		polishLevel: string;
		studies: Array<{
			title: string;
			polishTitle: string;
			authors: string;
			year: number;
			journal: string;
			polishJournal: string;
			studyType: string;
			polishStudyType: string;
			participants: number;
			findings: string;
			polishFindings: string;
			qualityScore: number;
		}>;
		caseReports: Array<{
			title: string;
			polishTitle: string;
			description: string;
			polishDescription: string;
			outcome: string;
			polishOutcome: string;
			year: number;
		}>;
		mechanisticEvidence: string[];
		polishMechanisticEvidence: string[];
	};

	// Risk Assessment
	riskAssessment: {
		riskLevel: "VERY_HIGH" | "HIGH" | "MODERATE" | "LOW" | "VERY_LOW";
		polishRiskLevel: string;
		riskFactors: Array<{
			factor: string;
			polishFactor: string;
			impact: "INCREASES" | "DECREASES" | "MODIFIES";
			polishImpact: string;
			description: string;
			polishDescription: string;
		}>;
		vulnerablePopulations: Array<{
			population: string;
			polishPopulation: string;
			reason: string;
			polishReason: string;
			additionalRisk: string;
			polishAdditionalRisk: string;
		}>;
		doseDependency: {
			isDoseDependent: boolean;
			thresholdDose: string;
			polishThresholdDose: string;
			description: string;
			polishDescription: string;
		};
	};

	// Management Strategies
	management: {
		recommendation:
			| "AVOID"
			| "MONITOR_CLOSELY"
			| "ADJUST_DOSE"
			| "SEPARATE_TIMING"
			| "CAUTION"
			| "SAFE";
		polishRecommendation: string;
		strategies: Array<{
			strategy: string;
			polishStrategy: string;
			description: string;
			polishDescription: string;
			effectiveness: "HIGH" | "MODERATE" | "LOW";
			polishEffectiveness: string;
		}>;
		monitoringParameters: Array<{
			parameter: string;
			polishParameter: string;
			frequency: string;
			polishFrequency: string;
			normalRange: string;
			polishNormalRange: string;
			warningSignals: string[];
			polishWarningSignals: string[];
		}>;
		timingSeparation: {
			required: boolean;
			minimumHours: number;
			optimalHours: number;
			reason: string;
			polishReason: string;
		};
		doseAdjustments: Array<{
			substance: "DRUG" | "SUPPLEMENT";
			polishSubstance: string;
			adjustment: string;
			polishAdjustment: string;
			rationale: string;
			polishRationale: string;
		}>;
	};

	// Clinical Scenarios
	clinicalScenarios: Array<{
		scenario: string;
		polishScenario: string;
		patientProfile: string;
		polishPatientProfile: string;
		riskLevel: string;
		polishRiskLevel: string;
		recommendations: string[];
		polishRecommendations: string[];
		monitoring: string[];
		polishMonitoring: string[];
	}>;

	// Alternative Options
	alternatives: {
		drugAlternatives: Array<{
			drugName: string;
			polishDrugName: string;
			interactionRisk: string;
			polishInteractionRisk: string;
			efficacyComparison: string;
			polishEfficacyComparison: string;
			notes: string;
			polishNotes: string;
		}>;
		supplementAlternatives: Array<{
			supplementName: string;
			polishSupplementName: string;
			interactionRisk: string;
			polishInteractionRisk: string;
			efficacyComparison: string;
			polishEfficacyComparison: string;
			notes: string;
			polishNotes: string;
		}>;
	};

	// Regulatory Information
	regulatoryInfo: {
		fdaWarnings: string[];
		polishFdaWarnings: string[];
		emaWarnings: string[];
		polishEmaWarnings: string[];
		otherAgencyWarnings: Array<{
			agency: string;
			polishAgency: string;
			warning: string;
			polishWarning: string;
			date: Date;
		}>;
		prescribingInformation: string;
		polishPrescribingInformation: string;
	};

	// User Reports
	userReports: {
		totalReports: number;
		severityDistribution: {
			mild: number;
			moderate: number;
			severe: number;
			lifeThreatening: number;
		};
		commonSymptoms: Array<{
			symptom: string;
			polishSymptom: string;
			frequency: number;
			severity: string;
			polishSeverity: string;
		}>;
		timeToOnset: {
			immediate: number;
			hours: number;
			days: number;
			weeks: number;
		};
	};

	// Metadata
	lastReviewed: Date;
	reviewedBy: string;
	sources: Array<{
		type: "STUDY" | "DATABASE" | "GUIDELINE" | "EXPERT_OPINION";
		polishType: string;
		name: string;
		polishName: string;
		url?: string;
		accessDate: Date;
		reliability: "HIGH" | "MODERATE" | "LOW";
		polishReliability: string;
	}>;

	isActive: boolean;
	lastUpdated: Date;
	version: string;
}

const DrugSupplementInteractionSchema = new Schema<IDrugSupplementInteraction>(
	{
		id: { type: String, required: true, unique: true },

		drugInfo: {
			name: { type: String, required: true },
			polishName: { type: String, required: true },
			genericName: { type: String, required: true },
			polishGenericName: { type: String, required: true },
			brandNames: [{ type: String }],
			polishBrandNames: [{ type: String }],
			drugClass: { type: String, required: true },
			polishDrugClass: { type: String, required: true },
			atcCode: { type: String },
			mechanism: { type: String, required: true },
			polishMechanism: { type: String, required: true },
		},

		supplementInfo: {
			supplementId: { type: String, required: true },
			name: { type: String, required: true },
			polishName: { type: String, required: true },
			category: { type: String, required: true },
			polishCategory: { type: String, required: true },
			activeCompounds: [
				{
					compound: { type: String, required: true },
					polishCompound: { type: String, required: true },
					concentration: { type: String },
				},
			],
		},

		interaction: {
			type: {
				type: String,
				required: true,
				enum: ["MAJOR", "MODERATE", "MINOR", "THEORETICAL", "BENEFICIAL"],
			},
			polishType: { type: String, required: true },
			severity: {
				type: String,
				required: true,
				enum: ["LIFE_THREATENING", "SEVERE", "MODERATE", "MILD", "NEGLIGIBLE"],
			},
			polishSeverity: { type: String, required: true },
			mechanism: { type: String, required: true },
			polishMechanism: { type: String, required: true },
			description: { type: String, required: true },
			polishDescription: { type: String, required: true },
			clinicalSignificance: { type: String, required: true },
			polishClinicalSignificance: { type: String, required: true },
			onset: {
				type: String,
				required: true,
				enum: ["IMMEDIATE", "RAPID", "DELAYED", "VARIABLE"],
			},
			polishOnset: { type: String, required: true },
			timeToOnset: { type: String, required: true },
			polishTimeToOnset: { type: String, required: true },
			duration: { type: String, required: true },
			polishDuration: { type: String, required: true },
		},

		evidence: {
			level: {
				type: String,
				required: true,
				enum: ["STRONG", "MODERATE", "WEAK", "THEORETICAL", "ANECDOTAL"],
			},
			polishLevel: { type: String, required: true },
			studies: [
				{
					title: { type: String, required: true },
					polishTitle: { type: String, required: true },
					authors: { type: String, required: true },
					year: { type: Number, required: true },
					journal: { type: String, required: true },
					polishJournal: { type: String, required: true },
					studyType: { type: String, required: true },
					polishStudyType: { type: String, required: true },
					participants: { type: Number, required: true },
					findings: { type: String, required: true },
					polishFindings: { type: String, required: true },
					qualityScore: { type: Number, min: 1, max: 10 },
				},
			],
			caseReports: [
				{
					title: { type: String, required: true },
					polishTitle: { type: String, required: true },
					description: { type: String, required: true },
					polishDescription: { type: String, required: true },
					outcome: { type: String, required: true },
					polishOutcome: { type: String, required: true },
					year: { type: Number, required: true },
				},
			],
			mechanisticEvidence: [{ type: String }],
			polishMechanisticEvidence: [{ type: String }],
		},

		riskAssessment: {
			riskLevel: {
				type: String,
				required: true,
				enum: ["VERY_HIGH", "HIGH", "MODERATE", "LOW", "VERY_LOW"],
			},
			polishRiskLevel: { type: String, required: true },
			riskFactors: [
				{
					factor: { type: String, required: true },
					polishFactor: { type: String, required: true },
					impact: {
						type: String,
						required: true,
						enum: ["INCREASES", "DECREASES", "MODIFIES"],
					},
					polishImpact: { type: String, required: true },
					description: { type: String, required: true },
					polishDescription: { type: String, required: true },
				},
			],
			vulnerablePopulations: [
				{
					population: { type: String, required: true },
					polishPopulation: { type: String, required: true },
					reason: { type: String, required: true },
					polishReason: { type: String, required: true },
					additionalRisk: { type: String, required: true },
					polishAdditionalRisk: { type: String, required: true },
				},
			],
			doseDependency: {
				isDoseDependent: { type: Boolean, required: true },
				thresholdDose: { type: String },
				polishThresholdDose: { type: String },
				description: { type: String },
				polishDescription: { type: String },
			},
		},

		management: {
			recommendation: {
				type: String,
				required: true,
				enum: [
					"AVOID",
					"MONITOR_CLOSELY",
					"ADJUST_DOSE",
					"SEPARATE_TIMING",
					"CAUTION",
					"SAFE",
				],
			},
			polishRecommendation: { type: String, required: true },
			strategies: [
				{
					strategy: { type: String, required: true },
					polishStrategy: { type: String, required: true },
					description: { type: String, required: true },
					polishDescription: { type: String, required: true },
					effectiveness: {
						type: String,
						required: true,
						enum: ["HIGH", "MODERATE", "LOW"],
					},
					polishEffectiveness: { type: String, required: true },
				},
			],
			monitoringParameters: [
				{
					parameter: { type: String, required: true },
					polishParameter: { type: String, required: true },
					frequency: { type: String, required: true },
					polishFrequency: { type: String, required: true },
					normalRange: { type: String, required: true },
					polishNormalRange: { type: String, required: true },
					warningSignals: [{ type: String }],
					polishWarningSignals: [{ type: String }],
				},
			],
			timingSeparation: {
				required: { type: Boolean, required: true },
				minimumHours: { type: Number },
				optimalHours: { type: Number },
				reason: { type: String },
				polishReason: { type: String },
			},
			doseAdjustments: [
				{
					substance: {
						type: String,
						required: true,
						enum: ["DRUG", "SUPPLEMENT"],
					},
					polishSubstance: { type: String, required: true },
					adjustment: { type: String, required: true },
					polishAdjustment: { type: String, required: true },
					rationale: { type: String, required: true },
					polishRationale: { type: String, required: true },
				},
			],
		},

		clinicalScenarios: [
			{
				scenario: { type: String, required: true },
				polishScenario: { type: String, required: true },
				patientProfile: { type: String, required: true },
				polishPatientProfile: { type: String, required: true },
				riskLevel: { type: String, required: true },
				polishRiskLevel: { type: String, required: true },
				recommendations: [{ type: String }],
				polishRecommendations: [{ type: String }],
				monitoring: [{ type: String }],
				polishMonitoring: [{ type: String }],
			},
		],

		alternatives: {
			drugAlternatives: [
				{
					drugName: { type: String, required: true },
					polishDrugName: { type: String, required: true },
					interactionRisk: { type: String, required: true },
					polishInteractionRisk: { type: String, required: true },
					efficacyComparison: { type: String, required: true },
					polishEfficacyComparison: { type: String, required: true },
					notes: { type: String },
					polishNotes: { type: String },
				},
			],
			supplementAlternatives: [
				{
					supplementName: { type: String, required: true },
					polishSupplementName: { type: String, required: true },
					interactionRisk: { type: String, required: true },
					polishInteractionRisk: { type: String, required: true },
					efficacyComparison: { type: String, required: true },
					polishEfficacyComparison: { type: String, required: true },
					notes: { type: String },
					polishNotes: { type: String },
				},
			],
		},

		regulatoryInfo: {
			fdaWarnings: [{ type: String }],
			polishFdaWarnings: [{ type: String }],
			emaWarnings: [{ type: String }],
			polishEmaWarnings: [{ type: String }],
			otherAgencyWarnings: [
				{
					agency: { type: String, required: true },
					polishAgency: { type: String, required: true },
					warning: { type: String, required: true },
					polishWarning: { type: String, required: true },
					date: { type: Date, required: true },
				},
			],
			prescribingInformation: { type: String },
			polishPrescribingInformation: { type: String },
		},

		userReports: {
			totalReports: { type: Number, default: 0 },
			severityDistribution: {
				mild: { type: Number, default: 0 },
				moderate: { type: Number, default: 0 },
				severe: { type: Number, default: 0 },
				lifeThreatening: { type: Number, default: 0 },
			},
			commonSymptoms: [
				{
					symptom: { type: String, required: true },
					polishSymptom: { type: String, required: true },
					frequency: { type: Number, required: true },
					severity: { type: String, required: true },
					polishSeverity: { type: String, required: true },
				},
			],
			timeToOnset: {
				immediate: { type: Number, default: 0 },
				hours: { type: Number, default: 0 },
				days: { type: Number, default: 0 },
				weeks: { type: Number, default: 0 },
			},
		},

		lastReviewed: { type: Date, required: true },
		reviewedBy: { type: String, required: true },
		sources: [
			{
				type: {
					type: String,
					required: true,
					enum: ["STUDY", "DATABASE", "GUIDELINE", "EXPERT_OPINION"],
				},
				polishType: { type: String, required: true },
				name: { type: String, required: true },
				polishName: { type: String, required: true },
				url: { type: String },
				accessDate: { type: Date, required: true },
				reliability: {
					type: String,
					required: true,
					enum: ["HIGH", "MODERATE", "LOW"],
				},
				polishReliability: { type: String, required: true },
			},
		],

		isActive: { type: Boolean, default: true },
		lastUpdated: { type: Date, default: Date.now },
		version: { type: String, required: true },
	},
	{
		timestamps: true,
		collection: "drug_supplement_interactions",
	},
);

// Create indexes
DrugSupplementInteractionSchema.index({
	"drugInfo.name": 1,
	"supplementInfo.supplementId": 1,
});
DrugSupplementInteractionSchema.index({ "drugInfo.genericName": 1 });
DrugSupplementInteractionSchema.index({ "supplementInfo.supplementId": 1 });
DrugSupplementInteractionSchema.index({ "interaction.severity": 1 });
DrugSupplementInteractionSchema.index({ "riskAssessment.riskLevel": 1 });
DrugSupplementInteractionSchema.index({ "management.recommendation": 1 });

// Export model
export const DrugSupplementInteraction =
	mongoose.models.DrugSupplementInteraction ||
	mongoose.model<IDrugSupplementInteraction>(
		"DrugSupplementInteraction",
		DrugSupplementInteractionSchema,
	);
