/**
 * Magnesium L-Threonate
 * Comprehensive supplement profile with Polish translations
 */

import type { ComprehensiveSupplementProfile } from "./types";

export const magnesium_l_threonate: ComprehensiveSupplementProfile = {
	id: "magnesium-l-threonate",
	name: "Magnesium L-Threonate",
	polishName: "L-treonian magnezu",
	scientificName: "Magnesium L-threonate",
	commonNames: ["Magtein", "Brain Magnesium"],
	polishCommonNames: ["Magtein", "Magnez mózgowy"],
	category: "MINERAL",
	description:
		"The only form of magnesium that effectively crosses the blood-brain barrier to enhance synaptic plasticity and memory.",
	polishDescription:
		"Jedyna forma magnezu, która skutecznie przekracza barierę krew-mózg, wzmacniając plastyczność synaptyczną i pamięć.",

	activeCompounds: [
		{
			name: "Magnesium L-Threonate",
			polishName: "L-treonian magnezu",
			concentration: "144mg elemental magnesium per 2g",
			bioavailability: 15,
			halfLife: "24 hours (brain tissue)",
			metabolicPathway: [
				"NMDA receptor modulation",
				"Synaptic plasticity enhancement",
			],
			targetReceptors: ["NMDA receptors", "Voltage-gated calcium channels"],
		},
	],

	clinicalApplications: [
		{
			condition: "Memory Enhancement",
			polishCondition: "Wzmocnienie pamięci",
			effectivenessRating: 8,
			evidenceLevel: "MODERATE",
			efficacy: "high",
			recommendedDose: "1.5-2g daily (144mg elemental Mg)",
			duration: "4-12 weeks",
		},
		{
			condition: "Age-Related Cognitive Decline",
			polishCondition: "Związany z wiekiem spadek funkcji poznawczych",
			effectivenessRating: 7,
			evidenceLevel: "MODERATE",
			efficacy: "moderate",
			recommendedDose: "2g daily",
			duration: "12 weeks minimum",
		},
	],

	mechanisms: [
		{
			pathway: "NMDA Receptor Enhancement",
			polishPathway: "Wzmocnienie receptorów NMDA",
			description:
				"Magnesium removes the voltage-dependent block of NMDA receptors, facilitating long-term potentiation",
			polishDescription:
				"Magnez usuwa napięciowo-zależną blokadę receptorów NMDA, ułatwiając długotrwałe wzmocnienie",
			targetSystems: ["Hippocampal CA1", "Prefrontal cortex", "Dentate gyrus"],
			evidenceLevel: "STRONG",
			timeToEffect: "2-4 weeks",
		},
	],

	dosageGuidelines: {
		therapeuticRange: {
			min: 1500,
			max: 2000,
			unit: "mg",
		},
		timing: ["Evening", "Empty stomach"],
		withFood: false,
		contraindications: [],
		polishContraindications: [],
		interactions: [],
	},

	sideEffects: [
		{
			effect: "Drowsiness",
			polishEffect: "Senność",
			frequency: "uncommon",
			severity: "mild",
			reversible: true,
			management: "Take in evening, reduce dose if needed",
			polishManagement:
				"Przyjmować wieczorem, zmniejszyć dawkę w razie potrzeby",
		},
		{
			effect: "Headache",
			polishEffect: "Ból głowy",
			frequency: "uncommon",
			severity: "mild",
			reversible: true,
			management: "Ensure adequate hydration, reduce dose",
			polishManagement: "Zapewnić odpowiednie nawodnienie, zmniejszyć dawkę",
		},
	],

	interactions: [
		{
			substance: "Antibiotics (Tetracyclines)",
			polishSubstance: "Antybiotyki (tetracykliny)",
			type: "antagonistic",
			description: "Chelation reduces antibiotic absorption",
			severity: "moderate",
			clinicalSignificance: "Reduced antibiotic efficacy",
			polishClinicalSignificance: "Zmniejszona skuteczność antybiotyku",
			recommendation: "Separate by 2-3 hours",
			polishRecommendation: "Oddzielić o 2-3 godziny",
		},
	],

	evidenceLevel: "MODERATE",
	researchStudies: [
		{
			id: "slutsky-2010",
			title: "Enhancement of learning and memory by elevating brain magnesium",
			polishTitle:
				"Wzmocnienie uczenia się i pamięci przez podniesienie poziomu magnezu w mózgu",
			authors: ["Slutsky I", "Abumaria N", "Wu LJ", "et al."],
			journal: "Neuron",
			year: 2010,
			studyType: "ANIMAL_STUDY",
			primaryOutcome: "Study outcome",
			polishPrimaryOutcome: "Wynik badania",
			findings: "Study findings",
			polishFindings: "Wyniki badania",
			lastUpdated: "2024-01-15T00:00:00Z",
			sampleSize: 0,
			duration: "4 weeks",
			results: "Significant improvement in short and long-term memory",
			polishResults: "Znacząca poprawa pamięci krótko- i długotrwałej",
			evidenceLevel: "MODERATE",
			pubmedId: "20152114",
			doi: "10.1016/j.neuron.2009.12.026",
		},
	],

	tags: [
		"cognitive-enhancement",
		"memory",
		"neuroprotection",
		"magnesium",
		"brain-health",
	],
	lastUpdated: "2024-01-15T10:00:00Z",
	createdAt: "2024-01-01T00:00:00Z",
	knowledgeNodeId: "magnesium-l-threonate-node",

	educationalContent: {
		beginnerExplanation:
			"Magnesium L-Threonate is a special form of magnesium that can reach the brain to improve memory and learning.",
		polishBeginnerExplanation:
			"L-treonian magnezu to specjalna forma magnezu, która może dotrzeć do mózgu, poprawiając pamięć i uczenie się.",
		intermediateDetails:
			"Unlike other forms of magnesium, L-Threonate can cross the blood-brain barrier and increase brain magnesium levels by 15%, enhancing synaptic plasticity.",
		polishIntermediateDetails:
			"W przeciwieństwie do innych form magnezu, L-treonian może przekroczyć barierę krew-mózg i zwiększyć poziom magnezu w mózgu o 15%, wzmacniając plastyczność synaptyczną.",
		expertAnalysis:
			"Magnesium L-Threonate specifically targets NMDA receptors and voltage-gated calcium channels, facilitating LTP and memory consolidation through enhanced synaptic transmission.",
		polishExpertAnalysis:
			"L-treonian magnezu specyficznie celuje w receptory NMDA i napięciowo-zależne kanały wapniowe, ułatwiając LTP i konsolidację pamięci poprzez wzmocnioną transmisję synaptyczną.",
		keyTakeaways: [
			"Only magnesium form that effectively crosses blood-brain barrier",
			"Specifically designed for cognitive enhancement",
			"Best taken in evening due to mild sedative effects",
			"Requires 4+ weeks for optimal benefits",
		],
		polishKeyTakeaways: [
			"Jedyna forma magnezu skutecznie przekraczająca barierę krew-mózg",
			"Specjalnie zaprojektowana do wzmacniania funkcji poznawczych",
			"Najlepiej przyjmować wieczorem ze względu na łagodne działanie uspokajające",
			"Wymaga 4+ tygodni dla optymalnych korzyści",
		],
	},

	clinicalEvidence: {
		totalStudies: 25,
		metaAnalyses: 0,
		rctCount: 3,
		observationalStudies: 5,
		lastReviewDate: "2024-01-01",
		cochranReviews: [],
	},

	pharmacokinetics: {
		absorption: {
			rate: "15% brain bioavailability",
			factors: ["Empty stomach preferred", "Time of day"],
			polishFactors: ["Preferowany pusty żołądek", "Pora dnia"],
			optimalTiming: "Evening, 2 hours after last meal",
			polishOptimalTiming: "Wieczorem, 2 godziny po ostatnim posiłku",
		},
		distribution: {
			volumeOfDistribution: "Preferentially accumulates in brain tissue",
			proteinBinding: "Low protein binding",
			brainPenetration: true,
			placentalCrossing: true,
		},
		metabolism: {
			primaryPathway: "Dissociation to magnesium and L-threonic acid",
			polishPrimaryPathway: "Dysocjacja do magnezu i kwasu L-treonowego",
			enzymes: ["Non-enzymatic dissociation"],
			metabolites: ["Mg2+", "L-threonic acid"],
		},
		elimination: {
			halfLife: "24 hours (brain), 6 hours (plasma)",
			excretionRoute: "Renal excretion",
			renalClearance: "95%",
		},
	},

	safetyProfile: {
		pregnancyCategory: "C",
		breastfeedingSafety: "Unknown",
		pediatricUse: {
			approved: false,
			ageLimit: "Not recommended under 18",
			specialConsiderations: ["Insufficient safety data"],
			polishSpecialConsiderations: ["Niewystarczające dane bezpieczeństwa"],
		},
		elderlyConsiderations: [
			"Monitor kidney function",
			"Start with lower doses",
		],
		polishElderlyConsiderations: [
			"Monitorować funkcję nerek",
			"Zaczynać od niższych dawek",
		],
		hepaticImpairment: "No specific adjustments needed",
		polishHepaticImpairment: "Brak specjalnych dostosowań",
		renalImpairment: "Reduce dose in severe impairment",
		polishRenalImpairment: "Zmniejszyć dawkę w ciężkiej niewydolności",
	},

	qualityConsiderations: {
		standardization: "Look for patented Magtein form",
		polishStandardization: "Szukać opatentowanej formy Magtein",
		bioavailabilityForms: ["Magtein (patented)", "Generic L-threonate"],
		polishBioavailabilityForms: [
			"Magtein (opatentowany)",
			"Generyczny L-treonian",
		],
		qualityMarkers: ["Purity >98%", "Heavy metal testing"],
		polishQualityMarkers: ["Czystość >98%", "Testowanie metali ciężkich"],
		storageRequirements: "Cool, dry place, protect from moisture",
		polishStorageRequirements: "Chłodne, suche miejsce, chronić przed wilgocią",
		shelfLife: "3 years unopened",
	},

	economicData: {
		averageCostPerMonth: {
			low: 45,
			average: 65,
			high: 90,
			currency: "EUR",
		},
		costEffectivenessRating: "Good",
		polishCostEffectivenessRating: "Dobra",
		valueProposition:
			"Premium pricing justified by unique brain bioavailability and cognitive benefits",
		polishValueProposition:
			"Wysoka cena uzasadniona unikalną biodostępnością mózgową i korzyściami poznawczymi",
	},
};
