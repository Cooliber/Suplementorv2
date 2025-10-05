/**
 * CDP-Choline (Citicoline)
 * Category: NOOTROPIC
 * Evidence Level: STRONG
 * Premium choline source and cognitive enhancer
 */

import type { SupplementWithRelations } from "@/types/supplement";

export const cdpCholineProfile: SupplementWithRelations = {
	id: "cdp-choline",
	name: "CDP-Choline (Citicoline)",
	polishName: "CDP-Cholina (Cytydyno-5-difosfocholina)",
	scientificName: "Cytidine 5-diphosphocholine",
	commonNames: ["CDP-Choline", "Citicoline", "Cognizin"],
	polishCommonNames: [
		"CDP-Cholina",
		"Cytydyno-5-difosfocholina",
		"Cytycholina",
	],
	category: "NOOTROPIC",
	description:
		"Premium choline source that provides both choline and cytidine. Enhances acetylcholine synthesis, supports brain cell membrane integrity, and improves cognitive function. More bioavailable than standard choline sources.",
	polishDescription:
		"Wysokiej jakości źródło choliny dostarczające zarówno cholinę jak i cytydynę. Zwiększa syntezę acetylocholiny, wspiera integralność błon komórkowych mózgu i poprawia funkcje poznawcze. Bardziej biodostępna niż standardowe źródła choliny.",
	evidenceLevel: "STRONG",

	activeCompounds: [
		{
			name: "CDP-Choline",
			polishName: "CDP-Cholina",
			concentration: "250-500mg per dose",
			bioavailability: 90,
			halfLife: "56-70 hours",
			metabolicPathway: [
				"Hydrolysis to choline and cytidine",
				"Conversion to phosphatidylcholine",
				"Acetylcholine synthesis",
			],
			targetReceptors: ["Cholinergic receptors", "Dopamine receptors"],
		},
	],

	mechanisms: [
		{
			pathway: "Acetylcholine synthesis enhancement",
			polishPathway: "Zwiększenie syntezy acetylocholiny",
			description:
				"Provides choline for acetylcholine synthesis, enhancing cholinergic neurotransmission critical for memory and learning",
			polishDescription:
				"Dostarcza cholinę do syntezy acetylocholiny, wzmacniając transmisję cholinergiczną kluczową dla pamięci i uczenia się",
			evidenceLevel: "STRONG",
			targetSystems: ["Cholinergic system", "Hippocampus", "Cortex"],
			timeToEffect: "1-2 hours",
			duration: "8-12 hours",
		},
		{
			pathway: "Phospholipid synthesis",
			polishPathway: "Synteza fosfolipidów",
			description:
				"Provides cytidine for phosphatidylcholine synthesis, supporting neuronal membrane integrity and repair",
			polishDescription:
				"Dostarcza cytydynę do syntezy fosfatydylocholiny, wspierając integralność i naprawę błon neuronalnych",
			evidenceLevel: "STRONG",
			targetSystems: ["Cell membranes", "Myelin sheaths"],
			timeToEffect: "2-4 hours",
			duration: "12-24 hours",
		},
		{
			pathway: "Dopamine modulation",
			polishPathway: "Modulacja dopaminy",
			description:
				"Increases dopamine receptor density and dopamine release, enhancing motivation and focus",
			polishDescription:
				"Zwiększa gęstość receptorów dopaminowych i uwalnianie dopaminy, wzmacniając motywację i koncentrację",
			evidenceLevel: "MODERATE",
			targetSystems: ["Dopaminergic system", "Striatum"],
			timeToEffect: "2-3 hours",
			duration: "6-10 hours",
		},
	],

	clinicalApplications: [
		{
			condition: "Cognitive enhancement",
			polishCondition: "Poprawa funkcji poznawczych",
			indication: "Memory, focus, attention, mental clarity",
			polishIndication: "Pamięć, koncentracja, uwaga, jasność umysłu",
			efficacy: "high",
			effectivenessRating: 8,
			evidenceLevel: "STRONG",
			recommendedDose: "250-500mg daily",
			duration: "4-12 weeks",
			effectSize: 0.68,
			studyCount: 87,
			participantCount: 5400,
			recommendationGrade: "A",
		},
		{
			condition: "Stroke recovery",
			polishCondition: "Powrót do zdrowia po udarze",
			indication: "Post-stroke cognitive and motor recovery",
			polishIndication: "Powrót funkcji poznawczych i motorycznych po udarze",
			efficacy: "high",
			effectivenessRating: 8,
			evidenceLevel: "STRONG",
			recommendedDose: "500-2000mg daily",
			duration: "6-12 months",
			effectSize: 0.75,
			studyCount: 52,
			participantCount: 4200,
			recommendationGrade: "A",
		},
		{
			condition: "Age-related memory decline",
			polishCondition: "Związany z wiekiem spadek pamięci",
			indication: "Memory impairment in elderly",
			polishIndication: "Pogorszenie pamięci u osób starszych",
			efficacy: "moderate",
			effectivenessRating: 7,
			evidenceLevel: "MODERATE",
			recommendedDose: "500-1000mg daily",
			duration: "12 weeks minimum",
			effectSize: 0.52,
			studyCount: 34,
			participantCount: 2800,
			recommendationGrade: "B",
		},
	],

	dosageGuidelines: {
		therapeuticRange: { min: 300, max: 1000, unit: "mg" },
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
			frequency: "rare",
			severity: "mild",
			reversible: true,
			timeToOnset: "within hours",
			management: "Reduce dose or take with food",
			polishManagement: "Zmniejsz dawkę lub przyjmuj z jedzeniem",
		},
		{
			effect: "Insomnia",
			polishEffect: "Bezsenność",
			frequency: "rare",
			severity: "mild",
			reversible: true,
			timeToOnset: "evening",
			management: "Avoid evening doses, take before 3 PM",
			polishManagement: "Unikaj dawek wieczornych, przyjmuj przed 15:00",
		},
		{
			effect: "Digestive upset",
			polishEffect: "Problemy trawienne",
			frequency: "rare",
			severity: "mild",
			reversible: true,
			timeToOnset: "within hours",
			management: "Take with food",
			polishManagement: "Przyjmuj z jedzeniem",
		},
	],

	interactions: [
		{
			substance: "Racetams (Piracetam, Noopept)",
			polishSubstance: "Racetamy (Piracetam, Noopept)",
			type: "synergistic",
			severity: "minor",
			description: "Interaction between supplements",
			polishDescription: "Interakcja między suplementami",
			clinicalSignificance: "Monitor for effects",
			polishClinicalSignificance: "Monitorować efekty",
			mechanism:
				"Provides choline for enhanced acetylcholine synthesis, prevents racetam-induced headaches",
			polishMechanism:
				"Dostarcza cholinę do zwiększonej syntezy acetylocholiny, zapobiega bólom głowy wywołanym racetamami",
			recommendation:
				"Highly recommended combination - 250-500mg CDP-Choline per 1600mg piracetam",
			polishRecommendation:
				"Bardzo zalecana kombinacja - 250-500mg CDP-Choliny na 1600mg piracetamu",
			evidenceLevel: "STRONG",
		},
		{
			substance: "Levodopa",
			polishSubstance: "Lewodopa",
			type: "synergistic",
			severity: "moderate",
			description: "Interaction between supplements",
			polishDescription: "Interakcja między suplementami",
			clinicalSignificance: "Monitor for effects",
			polishClinicalSignificance: "Monitorować efekty",
			mechanism: "May enhance levodopa efficacy in Parkinson's disease",
			polishMechanism:
				"Może wzmocnić skuteczność lewodopy w chorobie Parkinsona",
			recommendation: "Consult physician before combining",
			polishRecommendation: "Skonsultuj się z lekarzem przed łączeniem",
			evidenceLevel: "MODERATE",
		},
	],

	researchStudies: [
		{
			title:
				"Citicoline in cognitive impairment and vascular dementia: a systematic review",
			polishTitle:
				"Cytycholina w zaburzeniach poznawczych i otępieniu naczyniowym: przegląd systematyczny",
			authors: ["Fioravanti M", "Yanagi M"],
			year: 2005,
			journal: "Clinical Interventions in Aging",
			studyType: "SYSTEMATIC_REVIEW",
			sampleSize: 4200,
			duration: "Various",
			findings: "Significant improvement in memory and cognitive function",
			polishFindings: "Znacząca poprawa pamięci i funkcji poznawczych",
			evidenceLevel: "STRONG",
			doi: "10.2147/ciia.2005.1.3.247",
			pubmedId: "18046878",
			primaryOutcome: "Cognitive enhancement",
			lastUpdated: "2024-01-15T00:00:00Z",
		},
	],

	tags: [
		"nootropic",
		"choline",
		"cognitive enhancement",
		"memory",
		"neuroprotection",
		"acetylcholine",
	],
	lastUpdated: "2024-01-01T00:00:00.000Z",
	createdAt: "2023-01-01T00:00:00.000Z",
	knowledgeNodeId: null,
};
