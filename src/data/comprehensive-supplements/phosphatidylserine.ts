/**
 * Phosphatidylserine
 * Comprehensive supplement profile with Polish translations
 */

import type { ComprehensiveSupplementProfile } from "./types";

export const phosphatidylserine: ComprehensiveSupplementProfile = {
	id: "phosphatidylserine",
	name: "Phosphatidylserine",
	polishName: "Fosfatydyloseryna",
	scientificName: "1,2-diacyl-sn-glycero-3-phospho-L-serine",
	commonNames: ["PS", "Phosphatidylserine", "Brain Phospholipid"],
	polishCommonNames: ["PS", "Fosfatydyloseryna", "Fosfolipid mózgowy"],
	category: "NOOTROPIC",

	activeCompounds: [
		{
			name: "Phosphatidylserine",
			polishName: "Fosfatydyloseryna",
			concentration: "100-300mg",
			bioavailability: 85,
			halfLife: "12-24 hours",
			metabolicPathway: ["Phospholipid metabolism", "Membrane incorporation"],
			targetReceptors: [
				"Cell membrane receptors",
				"Neurotransmitter receptors",
			],
		},
	],

	clinicalApplications: [
		{
			condition: "Age-Related Cognitive Decline",
			polishCondition: "Związany z wiekiem spadek funkcji poznawczych",
			effectivenessRating: 8,
			evidenceLevel: "STRONG",
			efficacy: "high",
			recommendedDose: "300mg daily (divided doses)",
			duration: "8-12 weeks",
		},
		{
			condition: "Memory Enhancement",
			polishCondition: "Wzmocnienie pamięci",
			effectivenessRating: 7,
			evidenceLevel: "MODERATE",
			efficacy: "moderate",
			recommendedDose: "100-200mg daily",
			duration: "4-8 weeks",
		},
	],

	mechanisms: [
		{
			pathway: "Membrane Fluidity Enhancement",
			polishPathway: "Zwiększenie płynności błon",
			description:
				"PS integrates into neuronal membranes, improving membrane fluidity and neurotransmitter receptor function",
			polishDescription:
				"PS integruje się z błonami neuronalnymi, poprawiając płynność błon i funkcję receptorów neuroprzekaźników",
			targetSystems: [
				"Neuronal membranes",
				"Synaptic terminals",
				"Mitochondrial membranes",
			],
			evidenceLevel: "STRONG",
			timeToEffect: "4-8 weeks",
		},
	],

	pharmacokinetics: {
		absorption: {
			rate: "Good (85% bioavailability)",
			factors: ["Fat enhances absorption", "Take with meals"],
			polishFactors: ["Tłuszcz zwiększa wchłanianie", "Przyjmować z posiłkami"],
			optimalTiming: "With meals containing fat",
			polishOptimalTiming: "Z posiłkami zawierającymi tłuszcz",
		},
		distribution: {
			volumeOfDistribution: "Concentrates in brain tissue",
			proteinBinding: "High",
			brainPenetration: true,
			placentalCrossing: true,
		},
		metabolism: {
			primaryPathway: "Phospholipase-mediated breakdown",
			polishPrimaryPathway: "Rozkład mediowany przez fosfolipazy",
			enzymes: ["Phospholipase A2", "Phospholipase C"],
			metabolites: ["Serine", "Fatty acids", "Glycerol"],
		},
		elimination: {
			halfLife: "12-24 hours",
			excretionRoute: "Metabolic incorporation into membranes",
			renalClearance: "Slow, incorporated into cellular structures",
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
			effect: "Insomnia",
			polishEffect: "Bezsenność",
			frequency: "uncommon",
			severity: "mild",
			reversible: true,
			management: "Take earlier in day, reduce evening dose",
			polishManagement:
				"Przyjmować wcześniej w ciągu dnia, zmniejszyć dawkę wieczorną",
		},
	],

	interactions: [
		{
			substance: "Anticoagulants",
			polishSubstance: "Antykoagulanty",
			type: "synergistic",
			description: "May have mild anticoagulant effects",
			severity: "minor",
			mechanism: "May have mild anticoagulant effects",
			polishMechanism: "Może mieć łagodne działanie antykoagulacyjne",
			clinicalSignificance: "Monitor for increased bleeding",
			polishClinicalSignificance: "Monitorować zwiększone krwawienie",
			recommendation: "Caution with high doses",
			polishRecommendation: "Ostrożność z wysokimi dawkami",
		},
	],

	evidenceLevel: "STRONG",
	researchStudies: [
		{
			id: "cenacchi-1993",
			title:
				"Cognitive decline in the elderly: a double-blind, placebo-controlled multicenter study on efficacy of phosphatidylserine",
			polishTitle:
				"Spadek funkcji poznawczych u osób starszych: wieloośrodkowe badanie z podwójnie ślepą próbą na skuteczność fosfatydyloseryny",
			authors: ["Cenacchi T", "Bertoldin T", "Farina C", "et al."],
			journal: "Aging Clinical and Experimental Research",
			year: 1993,
			studyType: "RANDOMIZED_CONTROLLED_TRIAL",
			evidenceLevel: "MODERATE",

			findings: "Study findings",
			polishFindings: "Wyniki badania",
			lastUpdated: "2024-01-15T00:00:00Z",
			participantCount: 494,
			duration: "6 months",
			primaryOutcome: "Cognitive function improvement",
			polishPrimaryOutcome: "Poprawa funkcji poznawczych",
			results: "Significant improvement in memory and learning",
			polishResults: "Znacząca poprawa pamięci i uczenia się",
			doi: "10.1007/BF03324139",
		},
	],

	educationalContent: {
		beginnerExplanation:
			"Phosphatidylserine is a phospholipid that makes up cell membranes, especially in brain cells. Supplementation may help with memory and cognitive function.",
		polishBeginnerExplanation:
			"Fosfatydyloseryna to fosfolipid, który tworzy błony komórkowe, szczególnie w komórkach mózgowych. Suplementacja może pomóc w pamięci i funkcjach poznawczych.",
		intermediateDetails:
			"PS is essential for proper neuronal membrane function and neurotransmitter release. Levels decline with age, making supplementation potentially beneficial for older adults.",
		polishIntermediateDetails:
			"PS jest niezbędna dla prawidłowej funkcji błon neuronalnych i uwalniania neuroprzekaźników. Poziomy spadają z wiekiem, czyniąc suplementację potencjalnie korzystną dla starszych dorosłych.",
		expertAnalysis:
			"Multiple clinical trials demonstrate PS efficacy for age-related cognitive decline. The compound is well-tolerated and shows consistent benefits across cognitive domains.",
		polishExpertAnalysis:
			"Liczne badania kliniczne wykazują skuteczność PS w związanym z wiekiem spadku funkcji poznawczych. Związek jest dobrze tolerowany i pokazuje stałe korzyści w różnych domenach poznawczych.",
		keyTakeaways: [
			"Essential brain membrane component",
			"Declines with age",
			"Well-researched for cognitive decline",
			"Take with fat for better absorption",
		],
		polishKeyTakeaways: [
			"Niezbędny składnik błon mózgowych",
			"Spada z wiekiem",
			"Dobrze zbadana w spadku funkcji poznawczych",
			"Przyjmować z tłuszczem dla lepszego wchłaniania",
		],
	},

	clinicalEvidence: {
		totalStudies: 30,
		metaAnalyses: 4,
		rctCount: 15,
		observationalStudies: 11,
		lastReviewDate: "2023-07-20",
		cochranReviews: [],
	},

	qualityConsiderations: {
		standardization:
			"Look for soy-derived PS (not bovine) with >20% phosphatidylserine content",
		polishStandardization:
			"Szukać PS pochodzącej z soi (nie bydlęcej) z zawartością >20% fosfatydyloseryny",
		bioavailabilityForms: ["Softgels", "Capsules", "Powder"],
		polishBioavailabilityForms: ["Kapsułki żelowe", "Kapsułki", "Proszek"],
		qualityMarkers: [
			"Soy-derived source",
			"Third-party testing",
			"Standardized content",
		],
		polishQualityMarkers: [
			"Źródło sojowe",
			"Testowanie przez strony trzecie",
			"Standaryzowana zawartość",
		],
		storageRequirements: "Cool, dry place, protect from light and heat",
		polishStorageRequirements:
			"Chłodne, suche miejsce, chronić przed światłem i ciepłem",
		shelfLife: "2-3 years unopened",
	},

	economicData: {
		averageCostPerMonth: {
			low: 25,
			average: 40,
			high: 65,
			currency: "EUR",
		},
		costEffectivenessRating: "Good",
		polishCostEffectivenessRating: "Dobra",
		valueProposition:
			"Moderate cost for well-established cognitive benefits in aging",
		polishValueProposition:
			"Umiarkowany koszt za dobrze udokumentowane korzyści poznawcze w starzeniu się",
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
