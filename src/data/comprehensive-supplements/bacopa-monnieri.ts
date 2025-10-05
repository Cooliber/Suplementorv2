/**
 * Bacopa Monnieri
 * Comprehensive supplement profile with Polish translations
 */

import type { ComprehensiveSupplementProfile } from "./types";

export const bacopa_monnieri: ComprehensiveSupplementProfile = {
	id: "bacopa-monnieri",
	name: "Bacopa Monnieri",
	polishName: "Bakopa drobnolistna",
	scientificName: "Bacopa monnieri",
	commonNames: ["Brahmi", "Water Hyssop", "Herb of Grace"],
	polishCommonNames: ["Brahmi", "Hyzop wodny", "Ziele łaski"],
	category: "HERB",

	activeCompounds: [
		{
			name: "Bacosides A & B",
			polishName: "Bakozyd A i B",
			concentration: "20-50% standardized extract",
			bioavailability: 65,
			halfLife: "6-8 hours",
			metabolicPathway: ["Hepatic metabolism", "Glucuronidation"],
			targetReceptors: [
				"GABA receptors",
				"Serotonin receptors",
				"Dopamine receptors",
			],
		},
	],

	clinicalApplications: [
		{
			condition: "Memory Enhancement",
			polishCondition: "Wzmocnienie pamięci",
			effectivenessRating: 8,
			evidenceLevel: "STRONG",
			efficacy: "high",
			recommendedDose: "300-600mg daily (standardized to 50% bacosides)",
			duration: "8-12 weeks",
		},
		{
			condition: "Anxiety Reduction",
			polishCondition: "Redukcja lęku",
			effectivenessRating: 7,
			evidenceLevel: "MODERATE",
			efficacy: "moderate",
			recommendedDose: "300mg twice daily",
			duration: "4-8 weeks",
		},
	],

	mechanisms: [
		{
			pathway: "Cholinergic Enhancement",
			polishPathway: "Wzmocnienie cholinergiczne",
			description:
				"Bacosides enhance acetylcholine synthesis and release while protecting cholinergic neurons",
			polishDescription:
				"Bakozyd wzmacniają syntezę i uwalnianie acetylocholiny, chroniąc neurony cholinergiczne",
			targetSystems: ["Hippocampus", "Frontal cortex", "Cholinergic neurons"],
			evidenceLevel: "STRONG",
			timeToEffect: "4-8 weeks",
		},
	],

	pharmacokinetics: {
		absorption: {
			rate: "Moderate (65% bioavailability)",
			factors: ["Take with fat for better absorption", "Food enhances uptake"],
			polishFactors: [
				"Przyjmować z tłuszczem dla lepszego wchłaniania",
				"Jedzenie zwiększa wchłanianie",
			],
			optimalTiming: "With meals",
			polishOptimalTiming: "Z posiłkami",
		},
		distribution: {
			volumeOfDistribution: "Moderate CNS penetration",
			proteinBinding: "moderate",
			brainPenetration: true,
			placentalCrossing: true,
		},
		metabolism: {
			primaryPathway: "Hepatic glucuronidation",
			polishPrimaryPathway: "Wątrobowa glukuronidacja",
			enzymes: ["UGT enzymes", "CYP450 (minor)"],
			metabolites: ["Bacoside metabolites", "Glucuronide conjugates"],
		},
		elimination: {
			halfLife: "6-8 hours",
			excretionRoute: "Renal excretion",
			renalClearance: "Normal in healthy individuals",
		},
	},

	sideEffects: [
		{
			effect: "Gastrointestinal upset",
			polishEffect: "Dolegliwości żołądkowo-jelitowe",
			frequency: "uncommon",
			severity: "mild",
			reversible: true,
			management: "Take with food, reduce dose",
			polishManagement: "Przyjmować z jedzeniem, zmniejszyć dawkę",
		},
		{
			effect: "Fatigue",
			polishEffect: "Zmęczenie",
			frequency: "uncommon",
			severity: "mild",
			reversible: true,
			management: "Take in evening, reduce dose",
			polishManagement: "Przyjmować wieczorem, zmniejszyć dawkę",
		},
	],

	interactions: [
		{
			substance: "Thyroid medications",
			polishSubstance: "Leki tarczycowe",
			type: "synergistic",
			description: "May increase thyroid hormone levels",
			severity: "moderate",
			clinicalSignificance: "Monitor thyroid function",
			polishClinicalSignificance: "Monitorować funkcję tarczycy",
			recommendation: "Consult healthcare provider",
			polishRecommendation: "Skonsultować się z lekarzem",
		},
	],

	evidenceLevel: "STRONG",
	researchStudies: [
		{
			id: "stough-2001",
			title:
				"The chronic effects of an extract of Bacopa monniera on cognitive function in healthy human subjects",
			polishTitle:
				"Przewlekłe działanie ekstraktu Bacopa monniera na funkcje poznawcze u zdrowych ludzi",
			authors: ["Stough C", "Lloyd J", "Clarke J", "et al."],
			journal: "Psychopharmacology",
			year: 2001,
			studyType: "RANDOMIZED_CONTROLLED_TRIAL",
			evidenceLevel: "MODERATE",

			findings: "Study findings",
			polishFindings: "Wyniki badania",
			lastUpdated: "2024-01-15T00:00:00Z",
			participantCount: 76,
			duration: "12 weeks",
			primaryOutcome: "Memory performance improvement",
			polishPrimaryOutcome: "Poprawa wydajności pamięci",
			results: "Significant improvement in memory acquisition and retention",
			polishResults: "Znacząca poprawa w nabywaniu i utrzymywaniu pamięci",
			doi: "10.1007/s002130100815",
		},
	],

	educationalContent: {
		beginnerExplanation:
			"Bacopa Monnieri is an ancient Ayurvedic herb that has been shown to improve memory and reduce anxiety through its effects on brain neurotransmitters.",
		polishBeginnerExplanation:
			"Bacopa Monnieri to starożytne zioło ajurwedyjskie, które poprawia pamięć i zmniejsza lęk poprzez wpływ na neuroprzekaźniki mózgu.",
		intermediateDetails:
			"The active compounds bacosides enhance cholinergic function and provide neuroprotection. Clinical studies show consistent memory improvements after 8-12 weeks of use.",
		polishIntermediateDetails:
			"Aktywne związki bakozyd wzmacniają funkcję cholinergiczną i zapewniają neuroprotekcję. Badania kliniczne pokazują stałą poprawę pamięci po 8-12 tygodniach stosowania.",
		expertAnalysis:
			"Bacopa demonstrates dose-dependent cognitive enhancement with optimal effects at 300-600mg daily. The herb shows adaptogenic properties and may modulate stress response.",
		polishExpertAnalysis:
			"Bacopa wykazuje zależne od dawki wzmocnienie funkcji poznawczych z optymalnym działaniem przy 300-600mg dziennie. Zioło wykazuje właściwości adaptogenne i może modulować odpowiedź na stres.",
		keyTakeaways: [
			"Well-researched memory enhancer",
			"Requires 8-12 weeks for full effects",
			"Also reduces anxiety and stress",
			"Ancient Ayurvedic medicine",
		],
		polishKeyTakeaways: [
			"Dobrze zbadany wzmacniacz pamięci",
			"Wymaga 8-12 tygodni dla pełnego działania",
			"Również zmniejsza lęk i stres",
			"Starożytna medycyna ajurwedyjska",
		],
	},

	clinicalEvidence: {
		totalStudies: 25,
		metaAnalyses: 3,
		rctCount: 12,
		observationalStudies: 10,
		lastReviewDate: "2023-08-20",
		cochranReviews: ["Bacopa monnieri for cognitive enhancement"],
	},

	qualityConsiderations: {
		standardization: "Look for extracts standardized to 20-50% bacosides",
		polishStandardization:
			"Szukać ekstraktów standaryzowanych do 20-50% bakozydów",
		bioavailabilityForms: ["Standardized extract", "Whole herb powder"],
		polishBioavailabilityForms: [
			"Standaryzowany ekstrakt",
			"Proszek z całego zioła",
		],
		qualityMarkers: [
			"Bacoside content",
			"Heavy metal testing",
			"Pesticide screening",
		],
		polishQualityMarkers: [
			"Zawartość bakozydów",
			"Testowanie metali ciężkich",
			"Badanie pestycydów",
		],
		storageRequirements: "Cool, dry place, protect from light",
		polishStorageRequirements: "Chłodne, suche miejsce, chronić przed światłem",
		shelfLife: "2-3 years unopened",
	},

	economicData: {
		averageCostPerMonth: {
			low: 12,
			average: 20,
			high: 35,
			currency: "EUR",
		},
		costEffectivenessRating: "Excellent",
		polishCostEffectivenessRating: "Doskonała",
		valueProposition: "Low cost for well-established cognitive benefits",
		polishValueProposition:
			"Niski koszt za dobrze udokumentowane korzyści poznawcze",
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
