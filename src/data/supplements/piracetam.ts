/**
 * Piracetam
 * Category: NOOTROPIC
 * Evidence Level: STRONG
 * The first nootropic ever synthesized - Pierwszy syntetyzowany nootropik
 */

import type { SupplementWithRelations } from "@/types/supplement";

export const piracetamProfile: SupplementWithRelations = {
	id: "piracetam",
	name: "Piracetam",
	polishName: "Piracetam",
	scientificName: "2-oxo-1-pyrrolidine acetamide",
	commonNames: ["Piracetam", "Nootropil", "Lucetam"],
	polishCommonNames: ["Piracetam", "Nootropil", "Lucetam"],
	category: "NOOTROPIC",
	description:
		"The first nootropic compound ever synthesized, developed in 1964. Enhances cognitive function, memory, and learning capacity through modulation of neurotransmitter systems.",
	polishDescription:
		"Pierwszy syntetyzowany związek nootropowy, opracowany w 1964 roku. Poprawia funkcje poznawcze, pamięć i zdolność uczenia się poprzez modulację układów neuroprzekaźników.",
	evidenceLevel: "STRONG",

	activeCompounds: [
		{
			name: "Piracetam",
			polishName: "Piracetam",
			concentration: "800mg per tablet",
			bioavailability: 95,
			halfLife: "4-5 hours",
			metabolicPathway: [
				"Minimal hepatic metabolism",
				"Renal excretion unchanged",
			],
			targetReceptors: ["AMPA receptors", "Acetylcholine receptors"],
		},
	],

	mechanisms: [
		{
			pathway: "AMPA receptor modulation",
			polishPathway: "Modulacja receptorów AMPA",
			description:
				"Enhances AMPA receptor sensitivity, improving synaptic plasticity and long-term potentiation",
			polishDescription:
				"Zwiększa wrażliwość receptorów AMPA, poprawiając plastyczność synaptyczną i długotrwałe wzmocnienie",
			evidenceLevel: "STRONG",
			targetSystems: ["Glutamatergic system", "Cholinergic system"],
			timeToEffect: "30-60 minutes",
			duration: "4-6 hours",
		},
		{
			pathway: "Membrane fluidity enhancement",
			polishPathway: "Zwiększenie płynności błon komórkowych",
			description:
				"Improves neuronal membrane fluidity, facilitating neurotransmitter release and receptor function",
			polishDescription:
				"Poprawia płynność błon neuronalnych, ułatwiając uwalnianie neuroprzekaźników i funkcję receptorów",
			evidenceLevel: "MODERATE",
			targetSystems: ["Neuronal membranes", "Synaptic transmission"],
			timeToEffect: "1-2 hours",
			duration: "6-8 hours",
		},
	],

	clinicalApplications: [
		{
			condition: "Cognitive decline",
			polishCondition: "Pogorszenie funkcji poznawczych",
			indication: "Age-related cognitive impairment, mild cognitive decline",
			polishIndication:
				"Związane z wiekiem pogorszenie funkcji poznawczych, łagodny spadek funkcji poznawczych",
			efficacy: "high",
			effectivenessRating: 8,
			evidenceLevel: "STRONG",
			recommendedDose: "2400-4800mg daily in divided doses",
			duration: "8-12 weeks minimum",
			effectSize: 0.65,
			studyCount: 142,
			participantCount: 11000,
			recommendationGrade: "A",
		},
		{
			condition: "Memory enhancement",
			polishCondition: "Poprawa pamięci",
			indication: "Learning, memory consolidation, recall improvement",
			polishIndication:
				"Uczenie się, konsolidacja pamięci, poprawa przypominania",
			efficacy: "moderate",
			effectivenessRating: 7,
			evidenceLevel: "MODERATE",
			recommendedDose: "1600-3200mg daily",
			duration: "4-8 weeks",
			effectSize: 0.45,
			studyCount: 89,
			participantCount: 6500,
			recommendationGrade: "B",
		},
		{
			condition: "Dyslexia",
			polishCondition: "Dysleksja",
			indication: "Reading difficulties, learning disabilities",
			polishIndication: "Trudności w czytaniu, trudności w nauce",
			efficacy: "moderate",
			effectivenessRating: 6,
			evidenceLevel: "MODERATE",
			recommendedDose: "3200mg daily",
			duration: "12 weeks minimum",
			effectSize: 0.38,
			studyCount: 24,
			participantCount: 1200,
			recommendationGrade: "B",
		},
	],

	dosageGuidelines: {
		therapeuticRange: { min: 800, max: 4800, unit: "mg" },
		timing: ["morning", "afternoon"],
		withFood: true,
		contraindications: [],
		polishContraindications: [],
		interactions: [],
	},

	sideEffects: [
		{
			effect: "Headache",
			polishEffect: "Ból głowy",
			frequency: "uncommon",
			severity: "mild",
			reversible: true,
			timeToOnset: "within hours",
			management: "Add choline source (Alpha-GPC, CDP-Choline) or reduce dose",
			polishManagement:
				"Dodaj źródło choliny (Alpha-GPC, CDP-Choline) lub zmniejsz dawkę",
		},
		{
			effect: "Insomnia",
			polishEffect: "Bezsenność",
			frequency: "rare",
			severity: "mild",
			reversible: true,
			timeToOnset: "evening/night",
			management: "Take earlier in the day, avoid evening doses",
			polishManagement:
				"Przyjmuj wcześniej w ciągu dnia, unikaj dawek wieczornych",
		},
		{
			effect: "Nervousness",
			polishEffect: "Nerwowość",
			frequency: "rare",
			severity: "mild",
			reversible: true,
			timeToOnset: "within hours",
			management: "Reduce dose or discontinue",
			polishManagement: "Zmniejsz dawkę lub przerwij stosowanie",
		},
	],

	interactions: [
		{
			substance: "Choline sources (Alpha-GPC, CDP-Choline)",
			polishSubstance: "Źródła choliny (Alpha-GPC, CDP-Choline)",
			type: "synergistic",
			severity: "minor",
			description: "Interaction between supplements",
			polishDescription: "Interakcja między suplementami",
			clinicalSignificance: "Monitor for effects",
			polishClinicalSignificance: "Monitorować efekty",
			mechanism: "Enhanced acetylcholine synthesis, reduced headache risk",
			polishMechanism:
				"Zwiększona synteza acetylocholiny, zmniejszone ryzyko bólu głowy",
			recommendation:
				"Recommended combination - 300-600mg Alpha-GPC with piracetam",
			polishRecommendation:
				"Zalecana kombinacja - 300-600mg Alpha-GPC z piracetamem",
			evidenceLevel: "STRONG",
		},
		{
			substance: "Anticoagulants (Warfarin, Aspirin)",
			polishSubstance: "Antykoagulanty (Warfaryna, Aspiryna)",
			type: "additive",
			severity: "moderate",
			description: "Interaction between supplements",
			polishDescription: "Interakcja między suplementami",
			clinicalSignificance: "Monitor for effects",
			polishClinicalSignificance: "Monitorować efekty",
			mechanism: "May enhance antiplatelet effects",
			polishMechanism: "Może wzmocnić działanie przeciwpłytkowe",
			recommendation: "Monitor for bleeding, consult physician",
			polishRecommendation: "Monitoruj krwawienia, skonsultuj się z lekarzem",
			evidenceLevel: "MODERATE",
		},
	],

	researchStudies: [
		{
			title:
				"Piracetam in the treatment of cognitive impairment: a meta-analysis",
			polishTitle: "Piracetam w leczeniu zaburzeń poznawczych: metaanaliza",
			authors: ["Waegemans T", "Wilsher CR", "Danniau A"],
			year: 2002,
			journal: "Dementia and Geriatric Cognitive Disorders",
			studyType: "META_ANALYSIS",
			sampleSize: 11000,
			duration: "Various",
			findings:
				"Significant improvement in cognitive function across 142 studies",
			polishFindings: "Znacząca poprawa funkcji poznawczych w 142 badaniach",
			evidenceLevel: "STRONG",
			doi: "10.1159/000057700",
			pubmedId: "12006732",
			primaryOutcome: "Cognitive enhancement",
			lastUpdated: "2024-01-15T00:00:00Z",
		},
	],

	tags: [
		"nootropic",
		"racetam",
		"cognitive enhancement",
		"memory",
		"learning",
		"neuroprotection",
	],
	lastUpdated: "2024-01-01T00:00:00.000Z",
	createdAt: "2023-01-01T00:00:00.000Z",
	knowledgeNodeId: null,
};
