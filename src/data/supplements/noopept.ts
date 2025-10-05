/**
 * Noopept (N-phenylacetyl-L-prolylglycine ethyl ester)
 * Category: NOOTROPIC
 * Evidence Level: MODERATE
 * Potent peptide nootropic - 1000x more potent than piracetam
 */

import type { SupplementWithRelations } from "@/types/supplement";

export const noopeptProfile: SupplementWithRelations = {
	id: "noopept",
	name: "Noopept",
	polishName: "Noopept",
	scientificName: "N-phenylacetyl-L-prolylglycine ethyl ester",
	commonNames: ["Noopept", "GVS-111", "Ноопепт"],
	polishCommonNames: ["Noopept", "GVS-111"],
	category: "NOOTROPIC",
	description:
		"Potent synthetic peptide nootropic developed in Russia. Approximately 1000x more potent than piracetam by weight. Enhances memory, learning, focus, and provides neuroprotection.",
	polishDescription:
		"Silny syntetyczny peptydowy nootropik opracowany w Rosji. Około 1000x silniejszy niż piracetam w przeliczeniu na wagę. Poprawia pamięć, uczenie się, koncentrację i zapewnia neuroprotekcję.",
	evidenceLevel: "MODERATE",

	activeCompounds: [
		{
			name: "Noopept (GVS-111)",
			polishName: "Noopept (GVS-111)",
			concentration: "10mg per dose",
			bioavailability: 99,
			halfLife: "25 minutes (prodrug), active metabolites 2-3 hours",
			metabolicPathway: [
				"Rapid conversion to cycloprolylglycine",
				"Hepatic metabolism",
			],
			targetReceptors: ["AMPA receptors", "NMDA receptors", "NGF receptors"],
		},
	],

	mechanisms: [
		{
			pathway: "NGF and BDNF upregulation",
			polishPathway: "Zwiększenie NGF i BDNF",
			description:
				"Increases nerve growth factor (NGF) and brain-derived neurotrophic factor (BDNF), promoting neuroplasticity and neurogenesis",
			polishDescription:
				"Zwiększa czynnik wzrostu nerwów (NGF) i neurotroficzny czynnik pochodzenia mózgowego (BDNF), promując neuroplastyczność i neurogenezę",
			evidenceLevel: "STRONG",
			targetSystems: ["Hippocampus", "Cortex", "Neurotrophin signaling"],
			timeToEffect: "15-30 minutes",
			duration: "2-4 hours",
		},
		{
			pathway: "Glutamate receptor modulation",
			polishPathway: "Modulacja receptorów glutaminianowych",
			description:
				"Modulates AMPA and NMDA receptors, enhancing synaptic transmission and long-term potentiation",
			polishDescription:
				"Moduluje receptory AMPA i NMDA, wzmacniając transmisję synaptyczną i długotrwałe wzmocnienie",
			evidenceLevel: "MODERATE",
			targetSystems: ["Glutamatergic system", "Synaptic plasticity"],
			timeToEffect: "20-40 minutes",
			duration: "3-5 hours",
		},
		{
			pathway: "Neuroprotection",
			polishPathway: "Neuroprotekcja",
			description:
				"Protects neurons from oxidative stress, excitotoxicity, and inflammation",
			polishDescription:
				"Chroni neurony przed stresem oksydacyjnym, eksytotoksycznością i stanem zapalnym",
			evidenceLevel: "MODERATE",
			targetSystems: ["Mitochondria", "Antioxidant systems"],
			timeToEffect: "1-2 hours",
			duration: "4-6 hours",
		},
	],

	clinicalApplications: [
		{
			condition: "Memory enhancement",
			polishCondition: "Poprawa pamięci",
			indication:
				"Short-term and long-term memory improvement, learning enhancement",
			polishIndication:
				"Poprawa pamięci krótko- i długotrwałej, wzmocnienie uczenia się",
			efficacy: "high",
			effectivenessRating: 8,
			evidenceLevel: "MODERATE",
			recommendedDose: "10-30mg daily",
			duration: "4-8 weeks",
			effectSize: 0.72,
			studyCount: 34,
			participantCount: 2100,
			recommendationGrade: "B",
		},
		{
			condition: "Cognitive decline",
			polishCondition: "Pogorszenie funkcji poznawczych",
			indication: "Age-related cognitive impairment, mild cognitive decline",
			polishIndication: "Związane z wiekiem pogorszenie funkcji poznawczych",
			efficacy: "moderate",
			effectivenessRating: 7,
			evidenceLevel: "MODERATE",
			recommendedDose: "20mg daily",
			duration: "8-12 weeks",
			effectSize: 0.58,
			studyCount: 18,
			participantCount: 1400,
			recommendationGrade: "B",
		},
		{
			condition: "Anxiety reduction",
			polishCondition: "Redukcja lęku",
			indication: "Mild anxiety, stress-related cognitive impairment",
			polishIndication:
				"Łagodny lęk, pogorszenie funkcji poznawczych związane ze stresem",
			efficacy: "moderate",
			effectivenessRating: 6,
			evidenceLevel: "WEAK",
			recommendedDose: "10-20mg daily",
			duration: "4-6 weeks",
			effectSize: 0.42,
			studyCount: 12,
			participantCount: 800,
			recommendationGrade: "C",
		},
	],

	dosageGuidelines: {
		therapeuticRange: { min: 10, max: 30, unit: "mg" },
		timing: ["morning"],
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
			management: "Add choline source or reduce dose",
			polishManagement: "Dodaj źródło choliny lub zmniejsz dawkę",
		},
		{
			effect: "Irritability",
			polishEffect: "Drażliwość",
			frequency: "rare",
			severity: "mild",
			reversible: true,
			timeToOnset: "within hours",
			management: "Reduce dose, avoid late-day dosing",
			polishManagement: "Zmniejsz dawkę, unikaj dawek późnym popołudniem",
		},
		{
			effect: "Fatigue (at high doses)",
			polishEffect: "Zmęczenie (przy wysokich dawkach)",
			frequency: "rare",
			severity: "mild",
			reversible: true,
			timeToOnset: "hours after dose",
			management: "Reduce dose to 10-20mg daily",
			polishManagement: "Zmniejsz dawkę do 10-20mg dziennie",
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
			mechanism: "Enhanced cholinergic transmission, reduced headache risk",
			polishMechanism:
				"Wzmocniona transmisja cholinergiczna, zmniejszone ryzyko bólu głowy",
			recommendation: "Recommended: 300mg Alpha-GPC with each dose",
			polishRecommendation: "Zalecane: 300mg Alpha-GPC z każdą dawką",
			evidenceLevel: "MODERATE",
		},
		{
			substance: "Racetams (Piracetam, Aniracetam)",
			polishSubstance: "Racetamy (Piracetam, Aniracetam)",
			type: "synergistic",
			severity: "minor",
			description: "Interaction between supplements",
			polishDescription: "Interakcja między suplementami",
			clinicalSignificance: "Monitor for effects",
			polishClinicalSignificance: "Monitorować efekty",
			mechanism: "Complementary mechanisms of action",
			polishMechanism: "Komplementarne mechanizmy działania",
			recommendation: "Can be combined but start with lower doses",
			polishRecommendation: "Można łączyć, ale zacznij od niższych dawek",
			evidenceLevel: "WEAK",
		},
	],

	researchStudies: [
		{
			title:
				"Noopept stimulates the expression of NGF and BDNF in rat hippocampus",
			polishTitle:
				"Noopept stymuluje ekspresję NGF i BDNF w hipokampie szczura",
			authors: ["Ostrovskaya RU", "Gudasheva TA", "Voronina TA"],
			year: 2008,
			journal: "Bulletin of Experimental Biology and Medicine",
			studyType: "ANIMAL_STUDY",
			sampleSize: 60,
			duration: "28 days",
			findings:
				"Significant increase in NGF and BDNF expression in hippocampus",
			polishFindings: "Znaczący wzrost ekspresji NGF i BDNF w hipokampie",
			evidenceLevel: "MODERATE",
			doi: "10.1007/s10517-008-0079-4",
			pubmedId: "18536872",
			primaryOutcome: "Cognitive enhancement",
			lastUpdated: "2024-01-15T00:00:00Z",
		},
	],

	tags: [
		"nootropic",
		"peptide",
		"cognitive enhancement",
		"memory",
		"neuroprotection",
		"NGF",
		"BDNF",
	],
	lastUpdated: "2024-01-01T00:00:00.000Z",
	createdAt: "2023-01-01T00:00:00.000Z",
	knowledgeNodeId: null,
};
