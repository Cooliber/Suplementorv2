/**
 * Vitamin D3
 * Comprehensive supplement profile with Polish translations
 */

import type { ComprehensiveSupplementProfile } from "./types";

export const vitamin_d3: ComprehensiveSupplementProfile = {
	id: "vitamin-d3",
	name: "Vitamin D3",
	polishName: "Witamina D3",
	scientificName: "Cholecalciferol",
	commonNames: ["Cholecalciferol", "Vitamin D3", "Sunshine Vitamin"],
	polishCommonNames: ["Cholekalcyferol", "Witamina D3", "Witamina słońca"],
	category: "VITAMIN",

	activeCompounds: [
		{
			name: "Cholecalciferol",
			polishName: "Cholekalcyferol",
			concentration: "1000-5000 IU",
			bioavailability: 87,
			halfLife: "2-3 weeks",
			metabolicPathway: [
				"25-hydroxylation in liver",
				"1α-hydroxylation in kidneys",
			],
			targetReceptors: [
				"Vitamin D receptor (VDR)",
				"Nuclear hormone receptors",
			],
		},
	],

	clinicalApplications: [
		{
			condition: "Vitamin D Deficiency",
			polishCondition: "Niedobór witaminy D",
			effectivenessRating: 10,
			evidenceLevel: "STRONG",
			efficacy: "high",
			recommendedDose: "1000-4000 IU daily",
			duration: "3-6 months for correction",
		},
		{
			condition: "Mood Support",
			polishCondition: "Wsparcie nastroju",
			effectivenessRating: 7,
			evidenceLevel: "MODERATE",
			efficacy: "moderate",
			recommendedDose: "2000-4000 IU daily",
			duration: "8-12 weeks",
		},
	],

	mechanisms: [
		{
			pathway: "Gene Expression Regulation",
			polishPathway: "Regulacja ekspresji genów",
			description:
				"Calcitriol binds to vitamin D receptors, regulating over 1000 genes including those involved in neurotransmitter synthesis",
			polishDescription:
				"Kalcytriol wiąże się z receptorami witaminy D, regulując ponad 1000 genów, w tym tych zaangażowanych w syntezę neuroprzekaźników",
			targetSystems: ["Brain tissue", "Immune cells", "Bone tissue"],
			evidenceLevel: "STRONG",
			timeToEffect: "4-8 weeks",
		},
	],

	pharmacokinetics: {
		absorption: {
			rate: "Good (87% bioavailability)",
			factors: ["Fat enhances absorption", "Magnesium required for activation"],
			polishFactors: [
				"Tłuszcz zwiększa wchłanianie",
				"Magnez wymagany do aktywacji",
			],
			optimalTiming: "With largest meal of the day",
			polishOptimalTiming: "Z największym posiłkiem dnia",
		},
		distribution: {
			volumeOfDistribution: "Stored in fat tissue and muscle",
			proteinBinding: "99.9%",
			brainPenetration: true,
			placentalCrossing: true,
		},
		metabolism: {
			primaryPathway: "Liver 25-hydroxylation, kidney 1α-hydroxylation",
			polishPrimaryPathway:
				"Wątrobowa 25-hydroksylacja, nerkowa 1α-hydroksylacja",
			enzymes: ["CYP2R1", "CYP27B1", "CYP24A1"],
			metabolites: ["25(OH)D3", "1,25(OH)2D3 (calcitriol)"],
		},
		elimination: {
			halfLife: "2-3 weeks",
			excretionRoute: "Hepatic metabolism, minimal renal excretion",
			renalClearance: "Slow, fat-soluble storage",
		},
	},

	sideEffects: [
		{
			effect: "Hypercalcemia",
			polishEffect: "Hiperkalcemia",
			frequency: "uncommon",
			severity: "moderate",
			reversible: true,
			management: "Reduce dose, monitor calcium levels",
			polishManagement: "Zmniejszyć dawkę, monitorować poziom wapnia",
		},
		{
			effect: "Kidney stones",
			polishEffect: "Kamienie nerkowe",
			frequency: "uncommon",
			severity: "moderate",
			reversible: true,
			management: "Increase fluid intake, reduce dose",
			polishManagement: "Zwiększyć spożycie płynów, zmniejszyć dawkę",
		},
	],

	interactions: [
		{
			substance: "Thiazide diuretics",
			polishSubstance: "Diuretyki tiazydowe",
			type: "synergistic",
			description: "Increased calcium retention",
			severity: "moderate",
			clinicalSignificance: "Risk of hypercalcemia",
			polishClinicalSignificance: "Ryzyko hiperkalcemii",
			recommendation: "Monitor calcium levels",
			polishRecommendation: "Monitorować poziom wapnia",
		},
	],

	evidenceLevel: "STRONG",
	researchStudies: [
		{
			id: "holick-2011",
			title: "Evaluation, treatment, and prevention of vitamin D deficiency",
			polishTitle: "Ocena, leczenie i zapobieganie niedoborowi witaminy D",
			authors: ["Holick MF"],
			journal: "Journal of Clinical Endocrinology & Metabolism",
			year: 2011,
			studyType: "SYSTEMATIC_REVIEW",
			evidenceLevel: "MODERATE",

			findings: "Study findings",
			polishFindings: "Wyniki badania",
			lastUpdated: "2024-01-15T00:00:00Z",
			participantCount: 0,
			duration: "N/A",
			primaryOutcome: "Vitamin D status optimization",
			polishPrimaryOutcome: "Optymalizacja statusu witaminy D",
			results: "Clear guidelines for vitamin D supplementation",
			polishResults: "Jasne wytyczne dotyczące suplementacji witaminy D",
			doi: "10.1210/jc.2011-0385",
		},
	],

	educationalContent: {
		beginnerExplanation:
			"Vitamin D3 is essential for bone health, immune function, and mood regulation. Many people are deficient, especially in northern climates.",
		polishBeginnerExplanation:
			"Witamina D3 jest niezbędna dla zdrowia kości, funkcji immunologicznej i regulacji nastroju. Wiele osób ma niedobory, szczególnie w klimacie północnym.",
		intermediateDetails:
			"Vitamin D3 is converted to the active hormone calcitriol, which regulates calcium absorption and has widespread effects on gene expression.",
		polishIntermediateDetails:
			"Witamina D3 jest przekształcana w aktywny hormon kalcytriol, który reguluje wchłanianie wapnia i ma szerokie działanie na ekspresję genów.",
		expertAnalysis:
			"Optimal vitamin D status (25(OH)D levels 30-50 ng/mL) supports immune function, mood, and may reduce risk of various chronic diseases.",
		polishExpertAnalysis:
			"Optymalny status witaminy D (poziomy 25(OH)D 30-50 ng/mL) wspiera funkcję immunologiczną, nastrój i może zmniejszać ryzyko różnych chorób przewlekłych.",
		keyTakeaways: [
			"Essential for bone and immune health",
			"Many people are deficient",
			"Take with fat for better absorption",
			"Monitor blood levels for optimization",
		],
		polishKeyTakeaways: [
			"Niezbędna dla zdrowia kości i odporności",
			"Wiele osób ma niedobory",
			"Przyjmować z tłuszczem dla lepszego wchłaniania",
			"Monitorować poziomy we krwi dla optymalizacji",
		],
	},

	clinicalEvidence: {
		totalStudies: 500,
		metaAnalyses: 25,
		rctCount: 150,
		observationalStudies: 325,
		lastReviewDate: "2023-11-01",
		cochranReviews: ["Vitamin D supplementation for prevention of mortality"],
	},

	qualityConsiderations: {
		standardization: "Look for third-party tested D3 (cholecalciferol) not D2",
		polishStandardization:
			"Szukać testowanej przez strony trzecie D3 (cholekalcyferol), nie D2",
		bioavailabilityForms: ["Softgels with oil", "Liquid drops", "Tablets"],
		polishBioavailabilityForms: [
			"Kapsułki żelowe z olejem",
			"Krople płynne",
			"Tabletki",
		],
		qualityMarkers: [
			"Third-party testing",
			"USP verification",
			"Potency guarantee",
		],
		polishQualityMarkers: [
			"Testowanie przez strony trzecie",
			"Weryfikacja USP",
			"Gwarancja mocy",
		],
		storageRequirements: "Cool, dry place, protect from light",
		polishStorageRequirements: "Chłodne, suche miejsce, chronić przed światłem",
		shelfLife: "2-3 years unopened",
	},

	economicData: {
		averageCostPerMonth: {
			low: 5,
			average: 12,
			high: 25,
			currency: "EUR",
		},
		costEffectivenessRating: "Excellent",
		polishCostEffectivenessRating: "Doskonała",
		valueProposition: "Very low cost for essential health benefits",
		polishValueProposition:
			"Bardzo niski koszt za niezbędne korzyści zdrowotne",
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
