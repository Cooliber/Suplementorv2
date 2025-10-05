/**
 * Modafinil (Prescription - Educational Reference)
 * Comprehensive supplement profile with Polish translations
 */

import type { ComprehensiveSupplementProfile } from "./types";

export const modafinil: ComprehensiveSupplementProfile = {
	id: "modafinil",
	name: "Modafinil",
	polishName: "Modafinil",
	scientificName: "2-[(diphenylmethyl)sulfinyl]acetamide",
	commonNames: ["Provigil", "Modalert", "Modvigil"],
	polishCommonNames: ["Provigil", "Modalert", "Modvigil"],
	category: "NOOTROPIC",

	activeCompounds: [
		{
			name: "Modafinil",
			polishName: "Modafinil",
			concentration: "100-200mg tablets",
			bioavailability: 80,
			halfLife: "12-15 hours",
			metabolicPathway: ["CYP3A4", "CYP2C19", "Amide hydrolysis"],
			targetReceptors: [
				"Dopamine transporter",
				"Norepinephrine transporter",
				"Histamine H3 receptor",
			],
		},
	],

	clinicalApplications: [
		{
			condition: "Narcolepsy",
			polishCondition: "Narkolepsja",
			effectivenessRating: 10,
			evidenceLevel: "STRONG",
			efficacy: "high",
			recommendedDose: "200mg daily (morning)",
			duration: "Long-term as prescribed",
		},
		{
			condition: "Shift Work Sleep Disorder",
			polishCondition: "Zaburzenia snu przy pracy zmianowej",
			effectivenessRating: 9,
			evidenceLevel: "STRONG",
			efficacy: "high",
			recommendedDose: "200mg 1 hour before work shift",
			duration: "As needed for shift work",
		},
	],

	mechanisms: [
		{
			pathway: "Dopamine Reuptake Inhibition",
			polishPathway: "Inhibicja wychwytu zwrotnego dopaminy",
			description:
				"Modafinil blocks dopamine transporter, increasing dopamine levels in key brain regions",
			polishDescription:
				"Modafinil blokuje transporter dopaminy, zwiększając poziom dopaminy w kluczowych obszarach mózgu",
			targetSystems: ["Nucleus accumbens", "Prefrontal cortex", "Striatum"],
			evidenceLevel: "STRONG",
			timeToEffect: "1-2 hours",
		},
	],

	pharmacokinetics: {
		absorption: {
			rate: "Good (80% bioavailability)",
			factors: [
				"Food delays but doesn't reduce absorption",
				"Peak levels at 2-4 hours",
			],
			polishFactors: [
				"Jedzenie opóźnia, ale nie zmniejsza wchłaniania",
				"Szczytowe poziomy po 2-4 godzinach",
			],
			optimalTiming: "Morning administration",
			polishOptimalTiming: "Podawanie poranne",
		},
		distribution: {
			volumeOfDistribution: "Moderate, good CNS penetration",
			proteinBinding: "60%",
			brainPenetration: true,
			placentalCrossing: true,
		},
		metabolism: {
			primaryPathway: "Hepatic metabolism via CYP3A4",
			polishPrimaryPathway: "Metabolizm wątrobowy przez CYP3A4",
			enzymes: ["CYP3A4", "CYP2C19", "Amide hydrolysis"],
			metabolites: ["Modafinil acid", "Modafinil sulfone"],
		},
		elimination: {
			halfLife: "12-15 hours",
			excretionRoute: "Hepatic metabolism, renal excretion",
			renalClearance: "Reduced in elderly and hepatic impairment",
		},
	},

	sideEffects: [
		{
			effect: "Headache",
			polishEffect: "Ból głowy",
			frequency: "uncommon",
			severity: "mild",
			reversible: true,
			management: "Adequate hydration, dose reduction",
			polishManagement: "Odpowiednie nawodnienie, redukcja dawki",
		},
		{
			effect: "Insomnia",
			polishEffect: "Bezsenność",
			frequency: "uncommon",
			severity: "moderate",
			reversible: true,
			management: "Early morning dosing only",
			polishManagement: "Tylko wczesne poranne dawkowanie",
		},
		{
			effect: "Stevens-Johnson Syndrome",
			polishEffect: "Zespół Stevensa-Johnsona",
			frequency: "uncommon",
			severity: "severe",
			reversible: true,
			management: "Immediate discontinuation, emergency care",
			polishManagement: "Natychmiastowe przerwanie, opieka ratunkowa",
		},
	],

	interactions: [
		{
			substance: "Hormonal contraceptives",
			polishSubstance: "Hormonalne środki antykoncepcyjne",
			type: "antagonistic",
			description: "CYP3A4 induction reduces contraceptive efficacy",
			severity: "moderate",
			clinicalSignificance: "Reduced contraceptive effectiveness",
			polishClinicalSignificance: "Zmniejszona skuteczność antykoncepcji",
			recommendation: "Use alternative contraception",
			polishRecommendation: "Stosować alternatywną antykoncepcję",
		},
	],

	evidenceLevel: "STRONG",
	researchStudies: [
		{
			id: "fda-approval-1998",
			title: "FDA approval of modafinil for narcolepsy treatment",
			polishTitle: "Zatwierdzenie modafinilu przez FDA do leczenia narkolepsji",
			authors: ["FDA"],
			journal: "Federal Register",
			year: 1998,
			studyType: "SYSTEMATIC_REVIEW",
			evidenceLevel: "MODERATE",

			findings: "Study findings",
			polishFindings: "Wyniki badania",
			lastUpdated: "2024-01-15T00:00:00Z",
			participantCount: 558,
			duration: "Various",
			primaryOutcome: "Wakefulness improvement",
			polishPrimaryOutcome: "Poprawa czuwania",
			results: "Significant improvement in excessive daytime sleepiness",
			polishResults: "Znacząca poprawa w nadmiernej senności dziennej",
			doi: "N/A",
		},
	],

	educationalContent: {
		beginnerExplanation:
			"Modafinil is a prescription medication used to treat sleep disorders. It promotes wakefulness and is sometimes used off-label for cognitive enhancement.",
		polishBeginnerExplanation:
			"Modafinil to lek na receptę używany do leczenia zaburzeń snu. Promuje czuwanie i czasami jest używany poza wskazaniami do wzmacniania funkcji poznawczych.",
		intermediateDetails:
			"Modafinil works differently from traditional stimulants, primarily affecting dopamine and norepinephrine systems without the jittery side effects of amphetamines.",
		polishIntermediateDetails:
			"Modafinil działa inaczej niż tradycyjne stymulanty, wpływając głównie na systemy dopaminy i noradrenaliny bez nerwowych skutków ubocznych amfetamin.",
		expertAnalysis:
			"Clinical studies demonstrate modafinil's efficacy in treating narcolepsy and shift work sleep disorder. Off-label cognitive enhancement use lacks long-term safety data.",
		polishExpertAnalysis:
			"Badania kliniczne wykazują skuteczność modafinilu w leczeniu narkolepsji i zaburzeń snu przy pracy zmianowej. Stosowanie poza wskazaniami do wzmacniania funkcji poznawczych nie ma danych o długoterminowym bezpieczeństwie.",
		keyTakeaways: [
			"Prescription medication only",
			"Effective for sleep disorders",
			"Different mechanism than stimulants",
			"Requires medical supervision",
		],
		polishKeyTakeaways: [
			"Tylko lek na receptę",
			"Skuteczny w zaburzeniach snu",
			"Inny mechanizm niż stymulanty",
			"Wymaga nadzoru medycznego",
		],
	},

	clinicalEvidence: {
		totalStudies: 150,
		metaAnalyses: 8,
		rctCount: 45,
		observationalStudies: 97,
		lastReviewDate: "2023-10-15",
		cochranReviews: ["Modafinil for narcolepsy"],
	},

	qualityConsiderations: {
		standardization:
			"Prescription medication with strict pharmaceutical standards",
		polishStandardization:
			"Lek na receptę ze ścisłymi standardami farmaceutycznymi",
		bioavailabilityForms: ["Tablets"],
		polishBioavailabilityForms: ["Tabletki"],
		qualityMarkers: ["USP standards", "FDA approval", "GMP manufacturing"],
		polishQualityMarkers: [
			"Standardy USP",
			"Zatwierdzenie FDA",
			"Produkcja GMP",
		],
		storageRequirements: "Room temperature, protect from moisture",
		polishStorageRequirements: "Temperatura pokojowa, chronić przed wilgocią",
		shelfLife: "3-5 years",
	},

	economicData: {
		averageCostPerMonth: {
			low: 150,
			average: 300,
			high: 500,
			currency: "EUR",
		},
		costEffectivenessRating: "Poor",
		polishCostEffectivenessRating: "Słaba (wymagana recepta)",
		valueProposition: "High cost but medically necessary for sleep disorders",
		polishValueProposition:
			"Wysoki koszt, ale medycznie konieczny w zaburzeniach snu",
	},

	safetyProfile: {
		pregnancyCategory: "C",
		breastfeedingSafety: "Caution",
		pediatricUse: {
			approved: false,
			ageLimit: "Not recommended for children under 18",
			specialConsiderations: ["Consult physician before use"],
			polishSpecialConsiderations: ["Skonsultuj się z lekarzem przed użyciem"],
		},
		elderlyConsiderations: [
			"Start with lower doses",
			"Monitor for side effects",
		],
		polishElderlyConsiderations: [
			"Rozpocząć od niższych dawek",
			"Monitorować działania niepożądane",
		],
		hepaticImpairment: "Use with caution",
		polishHepaticImpairment: "Stosować ostrożnie",
		renalImpairment: "Use with caution",
		polishRenalImpairment: "Stosować ostrożnie",
	},

	dosageGuidelines: {
		therapeuticRange: {
			min: 100,
			max: 600,
			unit: "mg",
		},
		timing: ["Morning", "With meals"],
		withFood: true,
		contraindications: [],
		polishContraindications: [],
		interactions: [],
	},

	tags: [
		"nootropic",
		"cognitive enhancement",
		"brain health",
		"memory support",
	],
	lastUpdated: "2024-01-15T00:00:00Z",
	createdAt: "2024-01-15T00:00:00Z",
};
