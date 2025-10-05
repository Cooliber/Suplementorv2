/**
 * Caffeine + L-Theanine
 * Comprehensive supplement profile with Polish translations
 */

import type { ComprehensiveSupplementProfile } from "./types";

export const caffeine_l_theanine: ComprehensiveSupplementProfile = {
	id: "caffeine-l-theanine",
	name: "Caffeine + L-Theanine",
	polishName: "Kofeina + L-Teanina",
	scientificName: "1,3,7-trimethylxanthine + N-ethyl-L-glutamine",
	commonNames: ["Caffeine-Theanine Stack", "Alert Calm Stack"],
	polishCommonNames: ["Stos Kofeina-Teanina", "Stos Spokojnej Czujności"],
	category: "NOOTROPIC",

	activeCompounds: [
		{
			name: "Caffeine",
			polishName: "Kofeina",
			concentration: "100-200mg",
			bioavailability: 99,
			halfLife: "3-5 hours",
			metabolicPathway: ["CYP1A2", "Demethylation"],
			targetReceptors: ["Adenosine A1", "Adenosine A2A"],
		},
		{
			name: "L-Theanine",
			polishName: "L-Teanina",
			concentration: "200-400mg",
			bioavailability: 95,
			halfLife: "1-3 hours",
			metabolicPathway: ["Glutamate pathway", "GABA synthesis"],
			targetReceptors: ["GABA receptors", "Glutamate receptors"],
		},
	],

	clinicalApplications: [
		{
			condition: "Focus and Alertness",
			polishCondition: "Koncentracja i czujność",
			effectivenessRating: 9,
			evidenceLevel: "STRONG",
			efficacy: "high",
			recommendedDose: "100mg caffeine + 200mg L-theanine",
			duration: "As needed, max 2-3 times daily",
		},
		{
			condition: "Cognitive Performance",
			polishCondition: "Wydajność poznawcza",
			effectivenessRating: 8,
			evidenceLevel: "STRONG",
			efficacy: "high",
			recommendedDose: "50-100mg caffeine + 100-200mg L-theanine",
			duration: "Acute use, 4-6 hours effect",
		},
	],

	mechanisms: [
		{
			pathway: "Adenosine Receptor Antagonism + GABA Modulation",
			polishPathway: "Antagonizm receptorów adenozyny + Modulacja GABA",
			description:
				"Caffeine blocks adenosine receptors increasing alertness, while L-theanine promotes GABA activity reducing jitters",
			polishDescription:
				"Kofeina blokuje receptory adenozyny zwiększając czujność, podczas gdy L-teanina promuje aktywność GABA zmniejszając nerwowość",
			targetSystems: ["Prefrontal cortex", "Striatum", "Thalamus"],
			evidenceLevel: "STRONG",
			timeToEffect: "30-60 minutes",
		},
	],

	pharmacokinetics: {
		absorption: {
			rate: "Rapid (both compounds >95% bioavailability)",
			factors: [
				"Empty stomach increases absorption rate",
				"Food delays but doesn't reduce absorption",
			],
			polishFactors: [
				"Pusty żołądek zwiększa szybkość wchłaniania",
				"Jedzenie opóźnia, ale nie zmniejsza wchłaniania",
			],
			optimalTiming: "30-60 minutes before cognitive tasks",
			polishOptimalTiming: "30-60 minut przed zadaniami poznawczymi",
		},
		distribution: {
			volumeOfDistribution: "Both cross blood-brain barrier effectively",
			proteinBinding: "Low to moderate",
			brainPenetration: true,
			placentalCrossing: true,
		},
		metabolism: {
			primaryPathway: "Caffeine: CYP1A2, L-theanine: glutamate pathway",
			polishPrimaryPathway: "Kofeina: CYP1A2, L-teanina: szlak glutaminianowy",
			enzymes: ["CYP1A2", "Glutaminase", "GABA transaminase"],
			metabolites: ["Paraxanthine", "Glutamate", "GABA"],
		},
		elimination: {
			halfLife: "Caffeine: 3-5h, L-theanine: 1-3h",
			excretionRoute: "Renal (primary)",
			renalClearance: "Variable based on CYP1A2 activity",
		},
	},

	sideEffects: [
		{
			effect: "Mild jitters (reduced vs caffeine alone)",
			polishEffect: "Łagodna nerwowość (zmniejszona vs sama kofeina)",
			frequency: "uncommon",
			severity: "mild",
			reversible: true,
			management: "Reduce caffeine dose, increase L-theanine ratio",
			polishManagement:
				"Zmniejszyć dawkę kofeiny, zwiększyć proporcję L-teaniny",
		},
		{
			effect: "Headache (withdrawal)",
			polishEffect: "Ból głowy (odstawienie)",
			frequency: "uncommon",
			severity: "mild",
			reversible: true,
			management: "Gradual dose reduction, maintain hydration",
			polishManagement: "Stopniowa redukcja dawki, utrzymanie nawodnienia",
		},
	],

	interactions: [
		{
			substance: "Stimulant medications",
			polishSubstance: "Leki stymulujące",
			type: "synergistic",
			description: "Additive stimulant effects",
			severity: "moderate",
			mechanism: "Additive stimulant effects",
			polishMechanism: "Addytywne efekty stymulujące",
			clinicalSignificance: "Risk of overstimulation",
			polishClinicalSignificance: "Ryzyko nadmiernej stymulacji",
			recommendation: "Reduce doses of both substances",
			polishRecommendation: "Zmniejszyć dawki obu substancji",
		},
	],

	evidenceLevel: "STRONG",
	researchStudies: [
		{
			id: "owen-2008",
			title:
				"The combined effects of L-theanine and caffeine on cognitive performance and mood",
			polishTitle:
				"Połączone działanie L-teaniny i kofeiny na wydajność poznawczą i nastrój",
			authors: ["Owen GN", "Parnell H", "De Bruin EA", "Rycroft JA"],
			journal: "Biological Psychology",
			year: 2008,
			studyType: "RANDOMIZED_CONTROLLED_TRIAL",
			evidenceLevel: "MODERATE",

			findings: "Study findings",
			polishFindings: "Wyniki badania",
			lastUpdated: "2024-01-15T00:00:00Z",
			participantCount: 27,
			duration: "Acute (single dose)",
			primaryOutcome: "Cognitive performance and mood",
			polishPrimaryOutcome: "Wydajność poznawcza i nastrój",
			results: "Improved attention and reduced mind-wandering",
			polishResults: "Poprawa uwagi i zmniejszenie błądzenia umysłu",
			doi: "10.1016/j.biopsycho.2007.09.008",
		},
	],

	educationalContent: {
		beginnerExplanation:
			"This combination provides the alertness benefits of caffeine while L-theanine reduces jitters and promotes calm focus.",
		polishBeginnerExplanation:
			"Ta kombinacja zapewnia korzyści czujności kofeiny, podczas gdy L-teanina zmniejsza nerwowość i promuje spokojną koncentrację.",
		intermediateDetails:
			"The 2:1 ratio of L-theanine to caffeine is optimal for balanced stimulation without anxiety. Effects last 4-6 hours.",
		polishIntermediateDetails:
			"Stosunek 2:1 L-teaniny do kofeiny jest optymalny dla zrównoważonej stymulacji bez lęku. Działanie trwa 4-6 godzin.",
		expertAnalysis:
			"Clinical studies consistently show synergistic effects on attention, working memory, and mood with reduced side effects compared to caffeine alone.",
		polishExpertAnalysis:
			"Badania kliniczne konsekwentnie pokazują synergistyczne działanie na uwagę, pamięć roboczą i nastrój ze zmniejszonymi skutkami ubocznymi w porównaniu do samej kofeiny.",
		keyTakeaways: [
			"Synergistic combination for focus",
			"Reduces caffeine jitters",
			"Optimal ratio is 2:1 (theanine:caffeine)",
			"Effects last 4-6 hours",
		],
		polishKeyTakeaways: [
			"Synergistyczna kombinacja dla koncentracji",
			"Zmniejsza nerwowość od kofeiny",
			"Optymalny stosunek to 2:1 (teanina:kofeina)",
			"Działanie trwa 4-6 godzin",
		],
	},

	clinicalEvidence: {
		totalStudies: 45,
		metaAnalyses: 3,
		rctCount: 20,
		observationalStudies: 22,
		lastReviewDate: "2023-08-15",
		cochranReviews: [],
	},

	qualityConsiderations: {
		standardization:
			"Look for pharmaceutical-grade caffeine and L-theanine with verified purity",
		polishStandardization:
			"Szukać farmaceutycznej kofeiny i L-teaniny o zweryfikowanej czystości",
		bioavailabilityForms: ["Capsules", "Tablets", "Powder"],
		polishBioavailabilityForms: ["Kapsułki", "Tabletki", "Proszek"],
		qualityMarkers: [
			"Third-party testing",
			"USP grade",
			"No artificial additives",
		],
		polishQualityMarkers: [
			"Testowanie przez strony trzecie",
			"Klasa USP",
			"Bez sztucznych dodatków",
		],
		storageRequirements: "Cool, dry place, protect from light",
		polishStorageRequirements: "Chłodne, suche miejsce, chronić przed światłem",
		shelfLife: "2-3 years unopened",
	},

	economicData: {
		averageCostPerMonth: {
			low: 10,
			average: 18,
			high: 30,
			currency: "EUR",
		},
		costEffectivenessRating: "Excellent",
		polishCostEffectivenessRating: "Doskonała",
		valueProposition:
			"Low cost for immediate and reliable cognitive enhancement",
		polishValueProposition:
			"Niski koszt za natychmiastowe i niezawodne wzmocnienie funkcji poznawczych",
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
