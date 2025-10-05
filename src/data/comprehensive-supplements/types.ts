/**
 * Comprehensive Supplement Types
 * Shared type definitions for all comprehensive supplement profiles
 */

import type {
	EvidenceLevel,
	SupplementCategory,
	SupplementWithRelations,
} from "@/types/supplement";

// Enhanced supplement interface with additional educational content
export interface ComprehensiveSupplementProfile
	extends SupplementWithRelations {
	// Educational content
	educationalContent: {
		beginnerExplanation: string;
		polishBeginnerExplanation: string;
		intermediateDetails: string;
		polishIntermediateDetails: string;
		expertAnalysis: string;
		polishExpertAnalysis: string;
		keyTakeaways: string[];
		polishKeyTakeaways: string[];
	};

	// Enhanced clinical data
	clinicalEvidence: {
		totalStudies: number;
		metaAnalyses: number;
		rctCount: number;
		observationalStudies: number;
		lastReviewDate: string;
		cochranReviews: string[];
	};

	// Bioavailability and pharmacokinetics
	pharmacokinetics: {
		absorption: {
			rate: string;
			factors: string[];
			polishFactors: string[];
			optimalTiming: string;
			polishOptimalTiming: string;
		};
		distribution: {
			volumeOfDistribution: string;
			proteinBinding: string;
			brainPenetration: boolean;
			placentalCrossing: boolean;
		};
		metabolism: {
			primaryPathway: string;
			polishPrimaryPathway: string;
			enzymes: string[];
			metabolites: string[];
		};
		elimination: {
			halfLife: string;
			excretionRoute: string;
			renalClearance: string;
		};
	};

	// Safety and contraindications
	safetyProfile: {
		pregnancyCategory: "A" | "B" | "C" | "D" | "X" | "Unknown";
		breastfeedingSafety: "Safe" | "Caution" | "Avoid" | "Unknown";
		pediatricUse: {
			approved: boolean;
			ageLimit: string;
			specialConsiderations: string[];
			polishSpecialConsiderations: string[];
		};
		elderlyConsiderations: string[];
		polishElderlyConsiderations: string[];
		hepaticImpairment: string;
		polishHepaticImpairment: string;
		renalImpairment: string;
		polishRenalImpairment: string;
	};

	// Quality and sourcing
	qualityConsiderations: {
		standardization: string;
		polishStandardization: string;
		bioavailabilityForms: string[];
		polishBioavailabilityForms: string[];
		qualityMarkers: string[];
		polishQualityMarkers: string[];
		storageRequirements: string;
		polishStorageRequirements: string;
		shelfLife: string;
	};

	// Cost-effectiveness
	economicData: {
		averageCostPerMonth: {
			low: number;
			average: number;
			high: number;
			currency: string;
		};
		costEffectivenessRating: string;
		polishCostEffectivenessRating: string;
		valueProposition: string;
		polishValueProposition: string;
	};
}
