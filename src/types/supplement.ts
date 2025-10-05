/**
 * Supplement Type Definitions for Suplementor T3 Stack
 * Comprehensive types with Polish localization and Zod validation
 */

import { z } from "zod";
// TODO: Re-enable when Prisma is set up
// import type {
//   Supplement as PrismaSupplement,
//   SupplementCategory,
//   EvidenceLevel,
//   StudyType
// } from '@prisma/client';

// Zod Schemas for Validation

// Define types that would come from Prisma
export type SupplementCategory =
	| "VITAMIN"
	| "MINERAL"
	| "AMINO_ACID"
	| "FATTY_ACID"
	| "HERB"
	| "NOOTROPIC"
	| "ADAPTOGEN"
	| "COENZYME"
	| "PROBIOTIC"
	| "ENZYME"
	| "OTHER";
export type EvidenceLevel =
	| "STRONG"
	| "MODERATE"
	| "WEAK"
	| "INSUFFICIENT"
	| "CONFLICTING";
export type StudyType =
	| "SYSTEMATIC_REVIEW"
	| "META_ANALYSIS"
	| "RANDOMIZED_CONTROLLED_TRIAL"
	| "COHORT_STUDY"
	| "CASE_CONTROL_STUDY"
	| "CROSS_SECTIONAL_STUDY"
	| "CASE_SERIES"
	| "CASE_REPORT"
	| "EXPERT_OPINION"
	| "IN_VITRO"
	| "ANIMAL_STUDY"
	| "EXPERIMENTAL_STUDY";

export const SupplementCategorySchema = z.enum([
	"VITAMIN",
	"MINERAL",
	"AMINO_ACID",
	"FATTY_ACID",
	"HERB",
	"NOOTROPIC",
	"ADAPTOGEN",
	"COENZYME",
	"PROBIOTIC",
	"ENZYME",
	"OTHER",
]);

export const EvidenceLevelSchema = z.enum([
	"STRONG",
	"MODERATE",
	"WEAK",
	"INSUFFICIENT",
	"CONFLICTING",
]);

export const StudyTypeSchema = z.enum([
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
	"EXPERIMENTAL_STUDY",
]);

// Active Compound Schema
export const ActiveCompoundSchema = z.object({
	name: z.string().min(1),
	polishName: z.string().optional(),
	concentration: z.string().optional(),
	bioavailability: z.number().min(0).max(100).optional(),
	halfLife: z.string().optional(),
	metabolicPathway: z.array(z.string()).optional(),
	targetReceptors: z.array(z.string()).optional(),
});

// Clinical Application Schema
export const ClinicalApplicationSchema = z.object({
	condition: z.string().min(1),
	polishCondition: z.string().min(1),
	indication: z.string().optional(),
	polishIndication: z.string().optional(),
	efficacy: z.enum(["high", "moderate", "low", "insufficient"]),
	effectivenessRating: z.number().min(0).max(10),
	evidenceLevel: EvidenceLevelSchema,
	recommendedDose: z.string().min(1),
	duration: z.string().optional(),
	effectSize: z.number().optional(),
	studyCount: z.number().optional(),
	participantCount: z.number().optional(),
	recommendationGrade: z.string().optional(),
});

// Mechanism of Action Schema
export const MechanismOfActionSchema = z.object({
	id: z.string().optional(),
	name: z.string().optional(),
	polishName: z.string().optional(),
	pathway: z.string().min(1),
	polishPathway: z.string().min(1),
	description: z.string().min(1),
	polishDescription: z.string().min(1),
	evidenceLevel: EvidenceLevelSchema,
	targetSystems: z.array(z.string()).optional(),
	timeToEffect: z.string().optional(),
	duration: z.string().optional(),
});

// Side Effect Schema
export const SideEffectSchema = z.object({
	effect: z.string().min(1),
	polishEffect: z.string().min(1),
	frequency: z.enum(["common", "uncommon", "rare", "very_rare"]),
	severity: z.enum(["mild", "moderate", "severe"]),
	reversible: z.boolean(),
	dosageDependent: z.boolean().optional(),
	timeToOnset: z.string().optional(),
	management: z.string().optional(),
	polishManagement: z.string().optional(),
});

// Supplement Interaction Schema
export const SupplementInteractionSchema = z.object({
	substance: z.string().min(1),
	polishSubstance: z.string().optional(),
	type: z.enum(["synergistic", "antagonistic", "additive", "competitive"]),
	severity: z.enum(["severe", "moderate", "minor", "beneficial"]),
	mechanism: z.string().optional(),
	polishMechanism: z.string().optional(),
	description: z.string().min(1),
	polishDescription: z.string().optional(),
	clinicalSignificance: z.string().min(1),
	polishClinicalSignificance: z.string().min(1),
	recommendation: z.string().optional(),
	polishRecommendation: z.string().optional(),
	evidenceLevel: EvidenceLevelSchema.optional(),
});

// Dosage Guidelines Schema
export const DosageGuidelinesSchema = z.object({
	therapeuticRange: z.object({
		min: z.number().positive(),
		max: z.number().positive(),
		unit: z.string().min(1),
	}),
	timing: z.array(z.string()),
	withFood: z.boolean(),
	contraindications: z.array(z.string()),
	polishContraindications: z.array(z.string()),
	interactions: z.array(SupplementInteractionSchema),
});

// Research Study Schema
export const ResearchStudySchema = z.object({
	id: z.string().optional(),
	title: z.string().min(1),
	polishTitle: z.string().optional(),
	authors: z.array(z.string()),
	journal: z.string().min(1),
	year: z.number().min(1900).max(new Date().getFullYear()),
	studyType: StudyTypeSchema,
	primaryOutcome: z.string().min(1),
	polishPrimaryOutcome: z.string().optional(),
	findings: z.string().min(1),
	polishFindings: z.string().optional(),
	evidenceLevel: EvidenceLevelSchema,
	lastUpdated: z.string().datetime(),
	pubmedId: z.string().optional(),
	pmid: z.string().optional(),
	doi: z.string().optional(),
	sampleSize: z.number().optional(),
	participantCount: z.number().optional(),
	duration: z.string().optional(),
	dosage: z.string().optional(),
	results: z.string().optional(),
	polishResults: z.string().optional(),
	secondaryOutcomes: z.array(z.string()).optional(),
	polishSecondaryOutcomes: z.array(z.string()).optional(),
	limitations: z.string().optional(),
	polishLimitations: z.string().optional(),
	qualityScore: z.number().optional(),
	conflictOfInterest: z.string().optional(),
	polishConflictOfInterest: z.string().optional(),
	funding: z.string().optional(),
	polishFunding: z.string().optional(),
	url: z.string().url().optional(),
	abstract: z.string().optional(),
	polishAbstract: z.string().optional(),
	keywords: z.array(z.string()).optional(),
	meshTerms: z.array(z.string()).optional(),
	citationCount: z.number().optional(),
});

// Main Supplement Schema
export const SupplementSchema = z.object({
	id: z.string().cuid(),
	name: z.string().min(2).max(100),
	polishName: z.string().min(2).max(100),
	scientificName: z.string().optional(),
	commonNames: z.array(z.string()),
	polishCommonNames: z.array(z.string()),
	category: SupplementCategorySchema,
	description: z.string().max(1000).optional(),
	polishDescription: z.string().max(1000).optional(),

	// Complex nested data
	activeCompounds: z.array(ActiveCompoundSchema),
	clinicalApplications: z.array(ClinicalApplicationSchema),
	mechanisms: z.array(MechanismOfActionSchema),
	dosageGuidelines: DosageGuidelinesSchema,
	sideEffects: z.array(SideEffectSchema),
	interactions: z.array(SupplementInteractionSchema),

	// Evidence and research
	evidenceLevel: EvidenceLevelSchema,
	researchStudies: z.array(ResearchStudySchema),

	// Metadata
	tags: z.array(z.string()),
	lastUpdated: z.string().datetime(),
	createdAt: z.string().datetime(),
});

// TypeScript Types (inferred from Zod schemas)
export type ActiveCompound = z.infer<typeof ActiveCompoundSchema>;
export type ClinicalApplication = z.infer<typeof ClinicalApplicationSchema>;
export type MechanismOfAction = z.infer<typeof MechanismOfActionSchema>;
export type SideEffect = z.infer<typeof SideEffectSchema>;
export type SupplementInteraction = z.infer<typeof SupplementInteractionSchema>;
export type DosageGuidelines = z.infer<typeof DosageGuidelinesSchema>;
export type ResearchStudy = z.infer<typeof ResearchStudySchema>;
export type Supplement = z.infer<typeof SupplementSchema>;

// Extended types for UI components (standalone version for migration)
export interface SupplementWithRelations {
	id: string;
	name: string;
	polishName: string;
	scientificName?: string;
	commonNames: string[];
	polishCommonNames: string[];
	category: SupplementCategory;
	description?: string;
	polishDescription?: string;
	activeCompounds: ActiveCompound[];
	clinicalApplications: ClinicalApplication[];
	mechanisms: MechanismOfAction[];
	dosageGuidelines: DosageGuidelines;
	sideEffects: SideEffect[];
	interactions: SupplementInteraction[];
	evidenceLevel: EvidenceLevel;
	researchStudies: ResearchStudy[];
	tags: string[];
	lastUpdated: string;
	createdAt: string;
	knowledgeNodeId?: string | null;
}

// Supplement Stack Types
export interface StackSupplement {
	supplement: SupplementWithRelations;
	customDosage?: string;
	customTiming?: string[];
	priority: number;
	notes?: string;
}

export interface SupplementStack {
	id: string;
	name: string;
	description?: string;
	purpose: string[];
	supplements: StackSupplement[];
	createdAt: string;
	updatedAt: string;
	active: boolean;
}

// Interaction Analysis Types
export interface InteractionAnalysis {
	type: "warning" | "danger" | "info" | "beneficial";
	message: string;
	polishMessage: string;
	severity: "low" | "medium" | "high";
	supplements: string[];
	recommendation: string;
	polishRecommendation: string;
}

export interface SafetyProfile {
	overallRisk: "low" | "medium" | "high";
	interactions: InteractionAnalysis[];
	warnings: string[];
	polishWarnings: string[];
	contraindications: string[];
	polishContraindications: string[];
	dosageWarnings: string[];
	polishDosageWarnings: string[];
	timingConflicts: string[];
	polishTimingConflicts: string[];
	cycleRecommendations: string[];
	polishCycleRecommendations: string[];
}

// Validation Functions
export const validateSupplement = (data: unknown) => {
	try {
		return {
			success: true as const,
			data: SupplementSchema.parse(data),
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

export const validateActiveCompound = (data: unknown) => {
	try {
		return {
			success: true as const,
			data: ActiveCompoundSchema.parse(data),
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

// TODO: Re-enable when Prisma is set up
// export type { SupplementCategory, EvidenceLevel, StudyType } from '@prisma/client';
