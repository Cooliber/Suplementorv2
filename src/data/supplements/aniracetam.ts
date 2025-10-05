/**
 * Aniracetam Supplement Profile
 * Migrated from nextjs-roocode-template with enhanced T3 Stack compatibility
 * The Mood-Enhancing Racetam with comprehensive Polish medical compliance
 */

import type { SupplementWithRelations } from "../../types/supplement";

export const aniracetamProfile: SupplementWithRelations = {
	id: "aniracetam",
	name: "Aniracetam",
	polishName: "Aniracetam",
	scientificName: "1-(4-methoxybenzoyl)-2-pyrrolidinone",
	commonNames: ["Draganon", "Sarpul", "Ampamet", "Memodrin"],
	polishCommonNames: ["Draganon", "Sarpul", "Ampamet", "Memodrin"],
	category: "NOOTROPIC",
	description:
		"Aniracetam is a lipophilic nootropic belonging to the racetam family. It is known for its mood-enhancing and anxiolytic properties, making it unique among racetams. It modulates both glutamatergic and monoaminergic systems.",
	polishDescription:
		"Aniracetam to lipofilowy nootropik należący do rodziny racetamów. Jest znany z właściwości wzmocniających nastrój i przeciw lękowych, co czyni go unikalnym wśród racetamów. Moduluje zarówno systemy glutaminergiczne, jak i monoaminergiczne.",

	// Active compounds with detailed bioavailability data
	activeCompounds: [
		{
			name: "Aniracetam",
			polishName: "Aniracetam",
			concentration: "750mg",
			bioavailability: 85,
			halfLife: "15-25 minutes",
			metabolicPathway: ["Glutamatergic system", "Monoaminergic system"],
			targetReceptors: [
				"AMPA receptors",
				"Dopamine receptors",
				"Serotonin receptors",
			],
		},
	],

	// Clinical applications with Polish translations
	clinicalApplications: [
		{
			condition: "Cognitive enhancement",
			polishCondition: "Wzmocnienie funkcji poznawczych",
			indication: "Support for memory, focus, and mental clarity",
			polishIndication:
				"Wsparcie dla pamięci, koncentracji i przejrzystości mentalnej",
			efficacy: "moderate",
			effectivenessRating: 7,
			evidenceLevel: "MODERATE",
			recommendedDose: "750-1500mg daily",
			duration: "4-8 weeks for noticeable effects",
			effectSize: 0.3,
			studyCount: 8,
			participantCount: 400,
			recommendationGrade: "C",
		},
		{
			condition: "Anxiety and mood disorders",
			polishCondition: "Zaburzenia lękowe i naстроju",
			indication: "Anxiolytic and mood-enhancing effects",
			polishIndication: "Efekty przeciwlękowe i wzmocniające nastrój",
			efficacy: "moderate",
			effectivenessRating: 4,
			evidenceLevel: "WEAK",
			recommendedDose: "750-1500mg daily",
			duration: "2-4 weeks",
			effectSize: 0.25,
			studyCount: 5,
			participantCount: 200,
			recommendationGrade: "D",
		},
	],

	// Mechanisms of action with detailed pathways
	mechanisms: [
		{
			id: "glutamatergic-modulation",
			name: "Glutamatergic and monoaminergic systems modulation",
			polishName: "Modulacja systemów glutaminergicznego i monoaminergicznego",
			pathway: "Glutamatergic and monoaminergic systems",
			polishPathway: "Glutamatergic and monoaminergic systems",
			description:
				"Aniracetam modulates AMPA receptors while also affecting dopamine and serotonin neurotransmission, contributing to its mood-enhancing effects. It enhances cognitive function and provides anxiolytic benefits.",
			polishDescription:
				"Aniracetam moduluje receptory AMPA, a także wpływa na transmisję dopaminy i serotoniny, co przyczynia się do jego efektów wzmocniających nastrój. Wzmocnia funkcję poznawczą i zapewnia korzyści przeciwlękowe.",
			evidenceLevel: "MODERATE",
			targetSystems: [
				"Glutamatergic system",
				"Dopaminergic system",
				"Serotoninergic system",
			],
			timeToEffect: "30-60 minutes",
			duration: "4-6 hours",
		},
	],

	// Comprehensive dosage guidelines
	dosageGuidelines: {
		therapeuticRange: {
			min: 750,
			max: 3000,
			unit: "mg",
		},
		timing: ["morning", "afternoon"],
		withFood: true,
		contraindications: ["Pregnancy", "Breastfeeding"],
		polishContraindications: ["Ciąża", "Karmienie piersią"],
		interactions: [],
	},

	// Side effects with frequency and management
	sideEffects: [
		{
			effect: "Headache",
			polishEffect: "Ból głowy",
			frequency: "uncommon",
			severity: "mild",
			reversible: true,
			dosageDependent: true,
			timeToOnset: "1-2 hours",
			management: "Reduce dose or supplement with choline",
			polishManagement: "Zmniejsz dawkę lub suplementuj choliną",
		},
		{
			effect: "Fatigue",
			polishEffect: "Zmęczenie",
			frequency: "rare",
			severity: "mild",
			reversible: true,
			dosageDependent: false,
			timeToOnset: "2-4 hours",
			management: "Reduce dose, take earlier in day",
			polishManagement: "Zmniejsz dawkę, przyjmuj wcześniej w ciągu dnia",
		},
	],

	// Supplement interactions
	interactions: [
		{
			substance: "Choline supplements",
			polishSubstance: "Suplementy choliny",
			type: "synergistic",
			severity: "beneficial",
			description: "Interaction between supplements",
			polishDescription: "Interakcja między suplementami",
			clinicalSignificance: "Monitor for effects",
			polishClinicalSignificance: "Monitorować efekty",
			mechanism: "Enhanced cognitive effects",
			polishMechanism: "Wzmocnione efekty poznawcze",
			recommendation: "Commonly stacked with choline sources",
			polishRecommendation: "Często łączone z źródłami choliny",
			evidenceLevel: "WEAK",
		},
	],

	// Evidence level and research studies
	evidenceLevel: "WEAK",
	researchStudies: [
		{
			id: "nakamura-2001",
			title:
				"Aniracetam: its novel therapeutic potential in cerebral dysfunction",
			polishTitle:
				"Aniracetam: jego nowe potencjalne właściwości terapeutyczne w zaburzeniach mózgowych",
			authors: ["Nakamura K", "Kurasawa M"],
			journal: "CNS Drug Reviews",
			year: 2001,
			studyType: "SYSTEMATIC_REVIEW",
			primaryOutcome: "Cognitive function improvement",
			polishPrimaryOutcome: "Poprawa funkcji poznawczych",
			findings:
				"Aniracetam showed potential for cognitive enhancement and mood improvement",
			polishFindings:
				"Aniracetam wykazał potencjał do wzmocnienia funkcji poznawczych i poprawy nastroju",
			evidenceLevel: "MODERATE",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "11420138",
			doi: "10.1111/j.1527-3458.2001.tb00186.x",
			sampleSize: 0, // Systematic review - total participants from included studies
			qualityScore: 7.0,
		},
	],

	// Metadata
	tags: [
		"nootropic",
		"racetam",
		"cognitive enhancement",
		"mood enhancement",
		"anxiety reduction",
		"ampakine",
		"glutamate modulation",
	],
	lastUpdated: "2024-01-15T00:00:00Z",
	createdAt: "2024-01-15T00:00:00Z",

	// Additional fields for Prisma compatibility
	knowledgeNodeId: null,
};

export default aniracetamProfile;
