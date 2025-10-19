/**
 * =================================================================
 * ENHANCED ATOMIC CONTENT STRUCTURE
 *
 * This file defines the types for a comprehensive, scientifically-accurate
 * supplement knowledge base with enhanced atomic design principles.
 * Integrates detailed scientific data, clinical applications, safety profiles,
 * and research integration for powering supplement recommendation engines.
 * =================================================================
 */

// Define locally since they don't exist in Prisma client
export type EvidenceLevel = "STRONG" | "MODERATE" | "WEAK" | "INSUFFICIENT";
export type StudyType =
	| "RANDOMIZED_CONTROLLED_TRIAL"
	| "OBSERVATIONAL"
	| "META_ANALYSIS"
	| "CASE_STUDY"
	| "REVIEW";

// ----------------------------------------------------------------
// 1. ENHANCED ATOMS (Smallest, indivisible pieces of content)
// ----------------------------------------------------------------

/**
 * A single dosage instruction with comprehensive pharmacokinetic data.
 * e.g., "5g daily" for maintenance with bioavailability and timing data.
 */
export interface DosageAtom {
	id: string;
	type:
		| "loading"
		| "maintenance"
		| "therapeutic"
		| "general"
		| "acute"
		| "chronic";
	amount: {
		value: number;
		unit: "g" | "mg" | "mcg" | "iu";
		per: "day" | "kg" | "dose";
	};
	frequency?: string;
	duration?: string;
	timing?: string;
	notes?: string;
	// Enhanced scientific data
	bioavailability?: number; // Percentage 0-100
	halfLife?: string;
	absorptionRate?: string;
	peakTime?: string;
	foodInteraction?: "with_food" | "without_food" | "either";
	cycling?: {
		onWeeks: number;
		offWeeks: number;
		reason: string;
	};
}

/**
 * A single mechanism of action with detailed molecular pathways.
 * e.g., "ATP Energy System Replenishment" with receptor binding data.
 */
export interface MechanismAtom {
	id: string;
	name: string;
	polishName?: string;
	shortDescription: string;
	detailedDescription: string;
	evidenceLevel: EvidenceLevel;
	citations?: string[]; // e.g., ['PMID:123456']
	// Enhanced scientific data
	molecularFormula?: string;
	chemicalName?: string;
	targetReceptors?: string[];
	enzymeTargets?: string[];
	pathwayInteractions?: string[];
	metabolicPathway?: string[];
	timeToEffect?: string;
	duration?: string;
	doseDependent?: boolean;
	synergisticCompounds?: string[];
}

/**
 * A single safety consideration with comprehensive risk assessment.
 * e.g., "No evidence of harm to kidneys in healthy individuals."
 */
export interface SafetyAtom {
	id: string;
	type:
		| "general"
		| "precaution"
		| "side-effect"
		| "contraindication"
		| "interaction"
		| "overdose"
		| "long-term";
	summary: string;
	details: string;
	evidenceLevel: EvidenceLevel;
	citations?: string[];
	// Enhanced safety data
	frequency?: "common" | "uncommon" | "rare" | "very_rare";
	severity?: "mild" | "moderate" | "severe" | "critical";
	populationRisk?: string[];
	monitoringRequired?: boolean;
	management?: string;
	polishManagement?: string;
	doseDependent?: boolean;
	timeToOnset?: string;
	duration?: string;
}

/**
 * A single clinical application with therapeutic protocols.
 * e.g., "Cognitive enhancement in healthy adults"
 */
export interface ClinicalApplicationAtom {
	id: string;
	condition: string;
	polishCondition?: string;
	indication: string;
	polishIndication?: string;
	efficacy: "high" | "moderate" | "low" | "insufficient" | "conflicting";
	effectivenessRating: number; // 0-10 scale
	evidenceLevel: EvidenceLevel;
	// Enhanced clinical data
	therapeuticProtocol?: {
		dose: string;
		duration: string;
		monitoring: string[];
		outcomeMeasures: string[];
	};
	population?: string[];
	contraindications?: string[];
	combinations?: string[];
	clinicalGuidelines?: string[];
}

/**
 * A single research study with comprehensive metadata.
 * e.g., "Double-blind RCT on creatine for athletic performance"
 */
export interface ResearchAtom {
	id: string;
	title: string;
	polishTitle?: string;
	authors: string[];
	journal: string;
	year: number;
	studyType: StudyType;
	// Enhanced research data
	pmid?: string;
	doi?: string;
	abstract?: string;
	polishAbstract?: string;
	sampleSize?: number;
	participantCount?: number;
	duration?: string;
	dosage?: string;
	methodology?: string;
	results?: string;
	polishResults?: string;
	conclusions?: string;
	polishConclusions?: string;
	limitations?: string[];
	qualityScore?: number; // 0-10 scale
	conflictOfInterest?: string;
	funding?: string;
	keywords?: string[];
	meshTerms?: string[];
	citationCount?: number;
	url?: string;
	lastUpdated: string;
}

/**
 * A single supplement interaction with mechanism details.
 * e.g., "Caffeine + Creatine: Competitive inhibition"
 */
export interface InteractionAtom {
	id: string;
	substance: string;
	polishSubstance?: string;
	type: "synergistic" | "antagonistic" | "additive" | "competitive" | "unknown";
	severity: "severe" | "moderate" | "minor" | "beneficial" | "unknown";
	mechanism?: string;
	polishMechanism?: string;
	description: string;
	polishDescription?: string;
	clinicalSignificance: string;
	polishClinicalSignificance?: string;
	recommendation?: string;
	polishRecommendation?: string;
	evidenceLevel?: EvidenceLevel;
	doseDependent?: boolean;
	management?: string;
}

// ----------------------------------------------------------------
// 2. ENHANCED MOLECULES (Groups of related atoms)
// ----------------------------------------------------------------

export interface DosageMolecule {
	id: string;
	name: string;
	polishName?: string;
	summary: string;
	dosages: DosageAtom[];
	notes?: string[];
	// Enhanced dosage data
	protocols?: {
		beginner: DosageAtom[];
		intermediate: DosageAtom[];
		advanced: DosageAtom[];
		therapeutic: DosageAtom[];
	};
	contraindications?: string[];
	monitoring?: string[];
	adjustments?: {
		age?: string;
		weight?: string;
		condition?: string;
		activity?: string;
	};
}

export interface MechanismsMolecule {
	id: string;
	name: string;
	polishName?: string;
	summary: string;
	mechanisms: MechanismAtom[];
	// Enhanced mechanism data
	primaryPathways?: string[];
	secondaryEffects?: string[];
	synergisticMechanisms?: string[];
	timeCourse?: {
		onset: string;
		peak: string;
		duration: string;
	};
	doseResponse?: {
		minimum: string;
		optimum: string;
		maximum: string;
	};
}

export interface SafetyMolecule {
	id: string;
	name: string;
	polishName?: string;
	summary: string;
	safetyAspects: SafetyAtom[];
	// Enhanced safety data
	riskAssessment?: {
		overall: "low" | "medium" | "high" | "very_high";
		population: Record<string, "low" | "medium" | "high">;
		doseDependent: boolean;
	};
	monitoringRequirements?: string[];
	contraindications?: {
		absolute: string[];
		relative: string[];
		age: string[];
		condition: string[];
	};
	drugInteractions?: InteractionAtom[];
	supplementInteractions?: InteractionAtom[];
}

export interface ClinicalApplicationsMolecule {
	id: string;
	name: string;
	polishName?: string;
	summary: string;
	applications: ClinicalApplicationAtom[];
	// Enhanced clinical data
	therapeuticAreas?: string[];
	populationSpecific?: {
		ageGroups: string[];
		conditions: string[];
		contraindications: string[];
	};
	protocols?: {
		standard: string[];
		advanced: string[];
		combination: string[];
	};
	outcomeMeasures?: string[];
	successRates?: Record<string, number>;
}

export interface ResearchMolecule {
	id: string;
	name: string;
	polishName?: string;
	summary: string;
	studies: ResearchAtom[];
	// Enhanced research data
	evidenceSynthesis?: {
		overallLevel: EvidenceLevel;
		consistency: "high" | "moderate" | "low" | "conflicting";
		quality: number; // 0-10 scale
		publicationBias: "low" | "moderate" | "high" | "unknown";
	};
	metaAnalysis?: {
		effectSize: number;
		confidenceInterval: string;
		heterogeneity: string;
		publicationCount: number;
		totalParticipants: number;
	};
	clinicalGuidelines?: string[];
	futureResearch?: string[];
}

// ----------------------------------------------------------------
// 3. ENHANCED ORGANISMS (Complex content sections composed of molecules)
// ----------------------------------------------------------------

export interface SupplementContentOrganism {
	id: string;
	supplementId: string; // Foreign key to the main Supplement model
	name: string;
	polishName?: string;
	quickFacts: {
		evidenceLevel: EvidenceLevel;
		primaryBenefit: string;
		polishPrimaryBenefit?: string;
		secondaryBenefits?: string[];
		riskLevel: "low" | "medium" | "high";
	};
	dosage: DosageMolecule;
	mechanisms: MechanismsMolecule;
	safety: SafetyMolecule;
	clinicalApplications?: ClinicalApplicationsMolecule;
	research?: ResearchMolecule;
	// Enhanced organism data
	metadata?: {
		lastScientificReview: string;
		nextReviewDate: string;
		reviewers: string[];
		version: string;
		confidence: number; // 0-10 scale
	};
	qualityMetrics?: {
		completeness: number; // 0-100 percentage
		reliability: number; // 0-10 scale
		currency: number; // 0-10 scale
		consistency: number; // 0-10 scale
	};
}

// ----------------------------------------------------------------
// 4. ADVANCED TYPES FOR INTERACTIONS AND SYNERGIES
// ----------------------------------------------------------------

export interface SupplementSynergy {
	id: string;
	supplements: string[]; // Array of supplement IDs
	name: string;
	polishName?: string;
	description: string;
	polishDescription?: string;
	mechanism: string;
	polishMechanism?: string;
	evidenceLevel: EvidenceLevel;
	studies?: string[]; // PMID references
	benefits: string[];
	polishBenefits?: string[];
	risks?: string[];
	polishRisks?: string[];
	recommendedRatios?: Record<string, number>;
	dosingProtocol?: string;
	contraindications?: string[];
	populationSpecific?: string[];
}

export interface InteractionNetwork {
	supplementId: string;
	interactions: {
		with: string;
		type: "synergistic" | "antagonistic" | "additive" | "competitive";
		strength: number; // 0-1 scale
		mechanism: string;
		evidence: EvidenceLevel;
		clinicalSignificance: string;
	}[];
	synergies: SupplementSynergy[];
	contraindications: string[];
}

// ----------------------------------------------------------------
// 5. USER PROFILE AND PERSONALIZATION TYPES
// ----------------------------------------------------------------

export interface UserProfile {
	id: string;
	age?: number;
	weight?: number;
	height?: number;
	gender?: "male" | "female" | "other";
	activityLevel?: "sedentary" | "light" | "moderate" | "active" | "very_active";
	healthConditions?: string[];
	medications?: string[];
	allergies?: string[];
	dietaryRestrictions?: string[];
	goals?: (
		| "cognitive_enhancement"
		| "physical_performance"
		| "longevity"
		| "general_health"
		| "weight_management"
		| "stress_reduction"
	)[];
	preferences?: {
		vegan: boolean;
		vegetarian: boolean;
		glutenFree: boolean;
		dairyFree: boolean;
		naturalOnly: boolean;
		syntheticPreferred: boolean;
	};
	geneticFactors?: Record<string, string>;
	biomarkers?: Record<string, number>;
}

export interface PersonalizedRecommendation {
	userId: string;
	supplementId: string;
	reasoning: string[];
	polishReasoning?: string[];
	confidence: number; // 0-1 scale
	priority: number; // 1-10 scale
	customDosage?: DosageAtom[];
	contraindications?: string[];
	monitoring?: string[];
	followUp?: string;
	alternatives?: string[];
}

// ----------------------------------------------------------------
// 6. DOSING PROTOCOLS AND SCHEDULING TYPES
// ----------------------------------------------------------------

export interface DosingSchedule {
	id: string;
	name: string;
	polishName?: string;
	description: string;
	polishDescription?: string;
	protocol: "fixed" | "titrating" | "cycling" | "conditional" | "adaptive";
	schedule: {
		time: string; // HH:MM format
		dose: number;
		unit: string;
		withFood?: boolean;
		notes?: string;
	}[];
	duration?: string;
	cycling?: {
		onDays: number;
		offDays: number;
		totalCycles?: number;
	};
	adjustments?: {
		age?: string;
		weight?: string;
		condition?: string;
		activity?: string;
	};
	monitoring?: string[];
	titration?: {
		starting: number;
		target: number;
		increment: number;
		frequency: string;
	};
}

export interface SupplementProtocol {
	supplementId: string;
	condition: string;
	polishCondition?: string;
	protocol: DosingSchedule;
	monitoring: string[];
	outcomes: string[];
	duration: string;
	evidenceLevel: EvidenceLevel;
	studies?: string[];
}

// ----------------------------------------------------------------
// 7. MONITORING AND TRACKING TYPES
// ----------------------------------------------------------------

export interface Biomarker {
	id: string;
	name: string;
	polishName?: string;
	category: "blood" | "cognitive" | "physical" | "metabolic" | "hormonal";
	normalRange?: {
		min: number;
		max: number;
		unit: string;
	};
	optimalRange?: {
		min: number;
		max: number;
		unit: string;
	};
	testingFrequency?: string;
	testingMethod?: string;
	relevance?: string[];
}

export interface TrackingEntry {
	id: string;
	userId: string;
	supplementId: string;
	date: string;
	dose: number;
	unit: string;
	time: string;
	withFood?: boolean;
	effects?: string[];
	sideEffects?: string[];
	mood?: number; // 1-10 scale
	energy?: number; // 1-10 scale
	cognitiveFunction?: number; // 1-10 scale
	physicalPerformance?: number; // 1-10 scale
	notes?: string;
	biomarkers?: Record<string, number>;
}

export interface ProgressReport {
	userId: string;
	period: {
		start: string;
		end: string;
	};
	supplements: {
		supplementId: string;
		adherence: number; // 0-100 percentage
		averageDose: number;
		consistency: number; // 0-100 percentage
	}[];
	biomarkers: {
		biomarkerId: string;
		values: { date: string; value: number }[];
		trend: "improving" | "stable" | "declining" | "fluctuating";
	}[];
	outcomes: {
		goal: string;
		progress: number; // 0-100 percentage
		notes: string;
	}[];
	recommendations: string[];
}

// ----------------------------------------------------------------
// 8. KNOWLEDGE BASE MANAGEMENT TYPES
// ----------------------------------------------------------------

export interface KnowledgeBaseEntry {
	id: string;
	supplementId: string;
	version: string;
	lastUpdated: string;
	updatedBy: string;
	status: "draft" | "review" | "published" | "deprecated";
	content: SupplementContentOrganism;
	reviewHistory?: {
		date: string;
		reviewer: string;
		changes: string[];
		approval: boolean;
	}[];
	validation?: {
		completeness: number; // 0-100
		accuracy: number; // 0-10
		currency: number; // 0-10
		consistency: number; // 0-10
	};
	citations?: string[];
	confidence?: number; // 0-10
}

export interface EvidenceUpdate {
	supplementId: string;
	field: string;
	oldValue: any;
	newValue: any;
	evidence: string[]; // PMID references
	reason: string;
	impact: "minor" | "moderate" | "major";
	approvedBy: string;
	date: string;
}
