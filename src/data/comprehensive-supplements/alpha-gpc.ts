/**
 * Alpha-GPC (Alpha-Glycerylphosphorylcholine)
 * Comprehensive supplement profile with Polish translations
 */

import type { ComprehensiveSupplementProfile } from "./types";

export const alpha_gpc: ComprehensiveSupplementProfile = {
	id: "alpha-gpc",
	name: "Alpha-GPC",
	polishName: "Alfa-GPC",
	scientificName: "Alpha-Glycerylphosphorylcholine",
	commonNames: ["Alpha-GPC", "Choline Alfoscerate", "L-Alpha-GPC"],
	polishCommonNames: ["Alfa-GPC", "Alfoscerat choliny", "L-Alfa-GPC"],
	category: "NOOTROPIC",

	activeCompounds: [
		{
			name: "Alpha-Glycerylphosphorylcholine",
			polishName: "Alfa-glicerylofosforylcholina",
			concentration: "300-600mg",
			bioavailability: 88,
			halfLife: "4-6 hours",
			metabolicPathway: ["Cholinergic pathway", "Phospholipid metabolism"],
			targetReceptors: ["Nicotinic receptors", "Muscarinic receptors"],
		},
	],

	clinicalApplications: [
		{
			condition: "Cognitive Enhancement",
			polishCondition: "Wzmocnienie funkcji poznawczych",
			effectivenessRating: 8,
			evidenceLevel: "MODERATE",
			efficacy: "high",
			recommendedDose: "300-600mg daily",
			duration: "4-12 weeks",
		},
		{
			condition: "Alzheimer's Disease Support",
			efficacy: "insufficient",
			polishCondition: "Wsparcie w chorobie Alzheimera",
			effectivenessRating: 7,
			evidenceLevel: "MODERATE",
			recommendedDose: "400mg 3x daily",
			duration: "6+ months",
		},
	],

	mechanisms: [
		{
			pathway: "Acetylcholine Synthesis",
			polishPathway: "Synteza acetylocholiny",
			description:
				"Alpha-GPC crosses the blood-brain barrier and provides choline for acetylcholine synthesis",
			polishDescription:
				"Alfa-GPC przekracza barierę krew-mózg i dostarcza cholinę do syntezy acetylocholiny",
			targetSystems: [
				"Cholinergic neurons",
				"Hippocampus",
				"Prefrontal cortex",
			],
			evidenceLevel: "STRONG",
			timeToEffect: "1-2 hours",
		},
		{
			pathway: "Growth Hormone Release",
			polishPathway: "Uwalnianie hormonu wzrostu",
			description: "Stimulates growth hormone release from the pituitary gland",
			polishDescription:
				"Stymuluje uwalnianie hormonu wzrostu z przysadki mózgowej",
			targetSystems: ["Pituitary gland", "Hypothalamus"],
			evidenceLevel: "MODERATE",
			timeToEffect: "30-60 minutes",
		},
	],

	pharmacokinetics: {
		absorption: {
			rate: "Rapid (88% bioavailability)",
			factors: ["Empty stomach increases absorption", "Fat-soluble"],
			polishFactors: [
				"Pusty żołądek zwiększa wchłanianie",
				"Rozpuszczalny w tłuszczach",
			],
			optimalTiming: "Morning or pre-workout",
			polishOptimalTiming: "Rano lub przed treningiem",
		},
		distribution: {
			volumeOfDistribution: "High CNS penetration",
			proteinBinding: "Low",
			brainPenetration: true,
			placentalCrossing: true,
		},
		metabolism: {
			primaryPathway: "Hydrolysis to choline and glycerophosphate",
			polishPrimaryPathway: "Hydroliza do choliny i glicerofosfatu",
			enzymes: ["Phospholipase A2", "Phospholipase D"],
			metabolites: ["Choline", "Glycerophosphate"],
		},
		elimination: {
			halfLife: "4-6 hours",
			excretionRoute: "Renal excretion",
			renalClearance: "Normal in healthy individuals",
		},
	},

	sideEffects: [
		{
			effect: "Headache",
			polishEffect: "Ból głowy",
			frequency: "uncommon",
			severity: "mild",
			reversible: true,
			management: "Reduce dose, ensure adequate hydration",
			polishManagement: "Zmniejszyć dawkę, zapewnić odpowiednie nawodnienie",
		},
		{
			effect: "Nausea",
			polishEffect: "Nudności",
			frequency: "uncommon",
			severity: "mild",
			reversible: true,
			management: "Take with food, divide doses",
			polishManagement: "Przyjmować z jedzeniem, podzielić dawki",
		},
		{
			effect: "Insomnia",
			polishEffect: "Bezsenność",
			frequency: "uncommon",
			severity: "mild",
			reversible: true,
			management: "Avoid evening doses, reduce total daily dose",
			polishManagement:
				"Unikać dawek wieczornych, zmniejszyć całkowitą dawkę dzienną",
		},
	],

	interactions: [
		{
			substance: "Anticholinergic medications",
			polishSubstance: "Leki antycholinergiczne",
			type: "antagonistic",
			description: "Opposing effects on cholinergic system",
			severity: "moderate",
			clinicalSignificance: "May reduce effectiveness of both substances",
			polishClinicalSignificance: "Może zmniejszyć skuteczność obu substancji",
			recommendation: "Monitor for reduced efficacy",
			polishRecommendation: "Monitorować zmniejszoną skuteczność",
		},
	],

	evidenceLevel: "MODERATE",
	researchStudies: [
		{
			id: "parnetti-2007",
			title:
				"Cholinesterase inhibitors in Alzheimer's disease: from the cholinergic hypothesis to the disease-modifying approach",
			polishTitle:
				"Inhibitory cholinoesterazy w chorobie Alzheimera: od hipotezy cholinergicznej do podejścia modyfikującego chorobę",
			authors: ["Parnetti L", "Amenta F", "Gallai V"],
			journal: "Drugs & Aging",
			year: 2007,
			studyType: "SYSTEMATIC_REVIEW",
			evidenceLevel: "STRONG",
			findings: "Positive results demonstrated",
			lastUpdated: "2024-01-01",
			participantCount: 0,
			duration: "N/A",
			primaryOutcome: "Cognitive function improvement",
			polishPrimaryOutcome: "Poprawa funkcji poznawczych",
			results: "Significant improvement in cognitive tests",
			polishResults: "Znacząca poprawa w testach poznawczych",
			doi: "10.2165/00002512-200724120-00004",
		},
	],

	educationalContent: {
		beginnerExplanation:
			"Alpha-GPC is a natural choline compound that supports brain health by increasing acetylcholine levels, which is important for memory and learning.",
		polishBeginnerExplanation:
			"Alfa-GPC to naturalny związek choliny, który wspiera zdrowie mózgu poprzez zwiększanie poziomu acetylocholiny, ważnej dla pamięci i uczenia się.",
		intermediateDetails:
			"Alpha-GPC is highly bioavailable and crosses the blood-brain barrier efficiently. It provides choline for acetylcholine synthesis and may also stimulate growth hormone release.",
		polishIntermediateDetails:
			"Alfa-GPC ma wysoką biodostępność i skutecznie przekracza barierę krew-mózg. Dostarcza cholinę do syntezy acetylocholiny i może również stymulować uwalnianie hormonu wzrostu.",
		expertAnalysis:
			"Clinical studies show Alpha-GPC improves cognitive function in both healthy individuals and those with cognitive impairment. The compound demonstrates neuroprotective properties and may support neuroplasticity.",
		polishExpertAnalysis:
			"Badania kliniczne pokazują, że Alfa-GPC poprawia funkcje poznawcze zarówno u zdrowych osób, jak i u osób z zaburzeniami poznawczymi. Związek wykazuje właściwości neuroprotekcyjne i może wspierać neuroplastyczność.",
		keyTakeaways: [
			"Highly bioavailable choline source",
			"Crosses blood-brain barrier effectively",
			"Supports acetylcholine synthesis",
			"May enhance growth hormone release",
		],
		polishKeyTakeaways: [
			"Wysokobiodostępne źródło choliny",
			"Skutecznie przekracza barierę krew-mózg",
			"Wspiera syntezę acetylocholiny",
			"Może zwiększać uwalnianie hormonu wzrostu",
		],
	},

	clinicalEvidence: {
		totalStudies: 15,
		metaAnalyses: 2,
		rctCount: 8,
		observationalStudies: 5,
		lastReviewDate: "2023-06-15",
		cochranReviews: [],
	},

	qualityConsiderations: {
		standardization: "Look for pharmaceutical-grade Alpha-GPC with >99% purity",
		polishStandardization: "Szukać farmaceutycznego Alfa-GPC o czystości >99%",
		bioavailabilityForms: ["Capsules", "Powder", "Liquid"],
		polishBioavailabilityForms: ["Kapsułki", "Proszek", "Płyn"],
		qualityMarkers: [
			"Purity testing",
			"Heavy metal screening",
			"Microbiological testing",
		],
		polishQualityMarkers: [
			"Testowanie czystości",
			"Badanie metali ciężkich",
			"Testowanie mikrobiologiczne",
		],
		storageRequirements: "Cool, dry place, protect from moisture",
		polishStorageRequirements: "Chłodne, suche miejsce, chronić przed wilgocią",
		shelfLife: "2-3 years unopened",
	},

	economicData: {
		averageCostPerMonth: {
			low: 15,
			average: 25,
			high: 45,
			currency: "EUR",
		},
		costEffectivenessRating: "Good",
		polishCostEffectivenessRating: "Dobra",
		valueProposition:
			"Moderate cost for well-researched cognitive enhancement benefits",
		polishValueProposition:
			"Umiarkowany koszt za dobrze zbadane korzyści wzmacniania funkcji poznawczych",
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
			min: 300,
			max: 600,
			unit: "mg",
		},
		timing: ["Morning", "With meals"],
		withFood: true,
		contraindications: [
			"Pregnancy",
			"Breastfeeding",
			"Anticholinergic medications",
		],
		polishContraindications: [
			"Ciąża",
			"Karmienie piersią",
			"Leki antycholinergiczne",
		],
		interactions: [],
	},

	tags: [
		"nootropic",
		"cognitive enhancement",
		"memory support",
		"choline source",
		"acetylcholine precursor",
	],
	lastUpdated: "2024-01-15T00:00:00Z",
	createdAt: "2024-01-15T00:00:00Z",
};
