/**
 * Phosphatidylserine Supplement Profile
 * Migrated from nextjs-roocode-template with enhanced T3 Stack compatibility
 * Brain Cell Membrane Support with comprehensive Polish medical compliance
 */

import type { SupplementWithRelations } from "../../types/supplement";

export const phosphatidylserineProfile: SupplementWithRelations = {
	id: "phosphatidylserine",
	name: "Phosphatidylserine",
	polishName: "Fosfatydyloseryna",
	scientificName: "1,2-Diacyl-sn-glycero-3-phospho-L-serine",
	commonNames: ["PS", "Serine Phospholipid", "Phosphatidylserine"],
	polishCommonNames: ["PS", "Fosfolipid serynowy", "Fosfatydyloseryna"],
	category: "OTHER",
	description:
		"Phosphatidylserine (PS) is a phospholipid that is a crucial component of cell membranes, particularly in the brain. It supports membrane fluidity, neurotransmitter function, and has shown benefits for cognitive performance, stress management, and age-related cognitive decline. PS is naturally found in high concentrations in neural tissue.",
	polishDescription:
		"Fosfatydyloseryna (PS) to fosfolipid, który jest kluczowym składnikiem błon komórkowych, szczególnie w mózgu. Wspiera płynność błon, funkcję neuroprzekaźników i wykazała korzyści dla wydajności poznawczej, zarządzania stresem i wiekowego spadku poznawczego. PS występuje naturalnie w wysokich stężeniach w tkance nerwowej.",

	// Active compounds with detailed bioavailability data
	activeCompounds: [
		{
			name: "Phosphatidylserine",
			polishName: "Fosfatydyloseryna",
			concentration: "100mg",
			bioavailability: 80,
			halfLife: "6-8 hours",
			metabolicPathway: [
				"Cell membrane formation",
				"Neurotransmitter function",
				"Stress response",
			],
			targetReceptors: [
				"Cellular membranes",
				"Neurotransmitter receptors",
				"Stress pathways",
			],
		},
	],

	// Clinical applications with Polish translations
	clinicalApplications: [
		{
			condition: "Cognitive function and memory",
			polishCondition: "Funkcje poznawcze i pamięć",
			indication:
				"Support for memory formation, learning, and cognitive performance",
			polishIndication:
				"Wsparcie dla tworzenia pamięci, uczenia się i wydajności poznawczej",
			efficacy: "moderate",
			effectivenessRating: 7,
			evidenceLevel: "MODERATE",
			recommendedDose: "100-300mg daily",
			duration: "8-12 weeks",
			effectSize: 0.3,
			studyCount: 8,
			participantCount: 600,
			recommendationGrade: "B",
		},
		{
			condition: "Stress and cortisol management",
			polishCondition: "Zarządzanie stresem i kortyzolem",
			indication:
				"Reduction of cortisol response to stress and support for HPA axis",
			polishIndication:
				"Redukcja odpowiedzi kortyzolowej na stres i wsparcie dla osi HPA",
			efficacy: "moderate",
			effectivenessRating: 6,
			evidenceLevel: "MODERATE",
			recommendedDose: "300mg daily",
			duration: "4-8 weeks",
			effectSize: 0.4,
			studyCount: 6,
			participantCount: 450,
			recommendationGrade: "B",
		},
		{
			condition: "Age-related cognitive decline",
			polishCondition: "Wiekowy spadek funkcji poznawczych",
			indication:
				"Support for age-related memory and cognitive function decline",
			polishIndication:
				"Wsparcie dla wiekowego spadku pamięci i funkcji poznawczych",
			efficacy: "moderate",
			effectivenessRating: 6,
			evidenceLevel: "MODERATE",
			recommendedDose: "300mg daily",
			duration: "12-16 weeks",
			effectSize: 0.35,
			studyCount: 5,
			participantCount: 400,
			recommendationGrade: "B",
		},
		{
			condition: "Sports performance",
			polishCondition: "Wydajność sportowa",
			indication: "Potential cortisol reduction and stress adaptation support",
			polishIndication:
				"Potencjalna redukcja kortyzolu i wsparcie dla adaptacji do stresu",
			efficacy: "low",
			effectivenessRating: 4,
			evidenceLevel: "WEAK",
			recommendedDose: "300mg daily",
			duration: "4-8 weeks",
			effectSize: 0.15,
			studyCount: 3,
			participantCount: 150,
			recommendationGrade: "C",
		},
		{
			condition: "ADHD",
			polishCondition: "ADHD",
			indication: "Potential support for attention and executive function",
			polishIndication:
				"Potencjalne wsparcie dla uwagi i funkcji egzekutywnych",
			efficacy: "low",
			effectivenessRating: 4,
			evidenceLevel: "WEAK",
			recommendedDose: "200mg daily",
			duration: "8-12 weeks",
			effectSize: 0.2,
			studyCount: 2,
			participantCount: 100,
			recommendationGrade: "C",
		},
	],

	// Mechanisms of action with detailed pathways
	mechanisms: [
		{
			id: "cell-membrane-integrity",
			name: "Cell membrane integrity and signaling",
			polishName: "Integralność błon komórkowych i sygnalizacja",
			pathway: "Cell membrane integrity and signaling",
			polishPathway: "Cell membrane integrity and signaling",
			description:
				"Essential component of cell membranes, supports membrane fluidity and receptor function. PS is a key phospholipid component of neural cell membranes, affecting signal transduction and cellular communication.",
			polishDescription:
				"Niezbędny składnik błon komórkowych, wspiera płynność błon i funkcję receptorów. PS jest kluczowym fosfolipidowym składnikiem błon komórek nerwowych, wpływającym na transdukcję sygnałów i komunikację komórkową.",
			evidenceLevel: "STRONG",
			targetSystems: [
				"Cellular membranes",
				"Signal transduction",
				"Neural communication",
			],
			timeToEffect: "2-4 weeks",
			duration: "Continuous membrane support",
		},
		{
			id: "cortisol-regulation",
			name: "Cortisol regulation and stress response",
			polishName: "Regulacja kortyzolu i odpowiedź na stres",
			pathway: "Cortisol regulation and stress response",
			polishPathway: "Cortisol regulation and stress response",
			description:
				"Blunts cortisol response to stress, supporting adrenal function and stress adaptation. PS helps modulate the HPA axis response to stress, reducing the negative effects of chronic stress.",
			polishDescription:
				"Tępi odpowiedź kortyzolową na stres, wspierając funkcję kory nadnerczy i adaptację do stresu. PS pomaga modulować odpowiedź osi HPA na stres, redukując negatywne skutki chronicznego stresu.",
			evidenceLevel: "STRONG",
			targetSystems: ["HPA axis", "Cortisol regulation", "Stress response"],
			timeToEffect: "1-2 weeks",
			duration: "Continuous stress support",
		},
		{
			id: "neurotransmitter-function",
			name: "Neurotransmitter function",
			polishName: "Funkcja neuroprzekaźników",
			pathway: "Neurotransmitter function",
			polishPathway: "Neurotransmitter function",
			description:
				"Supports neurotransmitter release and receptor sensitivity. PS enhances the efficiency of neurotransmitter systems, particularly in aged or stressed neural tissue.",
			polishDescription:
				"Wsparcie dla uwalniania neuroprzekaźników i wrażliwości receptorów. PS wzmacnia wydajność systemów neuroprzekaźników, szczególnie w starzejącej się lub stresowanej tkance nerwowej.",
			evidenceLevel: "MODERATE",
			targetSystems: [
				"Neurotransmitter systems",
				"Receptor sensitivity",
				"Synaptic function",
			],
			timeToEffect: "4-6 weeks",
			duration: "Continuous neurotransmitter support",
		},
		{
			id: "neuroprotection",
			name: "Neuroprotection",
			polishName: "Neuroprotekcja",
			pathway: "Neuroprotection",
			polishPathway: "Neuroprotection",
			description:
				"Protects neurons from age-related decline and supports cognitive function. PS helps maintain neuronal integrity and may slow cognitive decline associated with aging.",
			polishDescription:
				"Chroni neurony przed wiekowym spadkiem i wspiera funkcję poznawczą. PS pomaga utrzymać integralność neuronów i może spowalniać spadek poznawczy związany z wiekiem.",
			evidenceLevel: "MODERATE",
			targetSystems: [
				"Neuronal integrity",
				"Cognitive preservation",
				"Aging brain",
			],
			timeToEffect: "8-12 weeks",
			duration: "Long-term neuroprotection",
		},
	],

	// Comprehensive dosage guidelines
	dosageGuidelines: {
		therapeuticRange: {
			min: 100,
			max: 300,
			unit: "mg",
		},
		timing: ["morning"],
		withFood: false,
		contraindications: ["Soy allergy", "Soy sensitivity"],
		polishContraindications: ["Alergia na soję", "Wrażliwość na soję"],
		interactions: [
			{
				substance: "Anticoagulants",
				polishSubstance: "Leki przeciwzakrzepowe",
				type: "antagonistic",
				severity: "moderate",
				description: "Interaction between supplements",
				polishDescription: "Interakcja między suplementami",
				clinicalSignificance: "Monitor for effects",
				polishClinicalSignificance: "Monitorować efekty",
				mechanism: "Potential blood clotting effects",
				polishMechanism: "Potencjalne efekty krzepnięcia krwi",
				recommendation: "Monitor coagulation parameters if combining",
				polishRecommendation: "Monitoruj parametry krzepnięcia przy łączeniu",
				evidenceLevel: "WEAK",
			},
		],
	},

	// Side effects with frequency and management
	sideEffects: [
		{
			effect: "Gastrointestinal discomfort",
			polishEffect: "Niewygodę jelitową",
			frequency: "rare",
			severity: "mild",
			reversible: true,
			dosageDependent: true,
			timeToOnset: "30-60 minutes",
			management: "Take with food if needed, reduce dose",
			polishManagement: "Przyjmuj z jedzeniem jeśli potrzeba, zmniejsz dawkę",
		},
		{
			effect: "Nausea",
			polishEffect: "Nudności",
			frequency: "very_rare",
			severity: "mild",
			reversible: true,
			dosageDependent: true,
			timeToOnset: "30-60 minutes",
			management: "Take with food, reduce dose",
			polishManagement: "Przyjmuj z jedzeniem, zmniejsz dawkę",
		},
	],

	// Supplement interactions
	interactions: [
		{
			substance: "Anticoagulants",
			polishSubstance: "Leki przeciwzakrzepowe",
			type: "antagonistic",
			severity: "moderate",
			description: "Interaction between supplements",
			polishDescription: "Interakcja między suplementami",
			clinicalSignificance: "Monitor for effects",
			polishClinicalSignificance: "Monitorować efekty",
			mechanism: "Potential additive effects on blood clotting",
			polishMechanism: "Potencjalne efekty addytywne na krzepnięcie krwi",
			recommendation: "Monitor coagulation parameters if combining",
			polishRecommendation: "Monitoruj parametry krzepnięcia przy łączeniu",
			evidenceLevel: "WEAK",
		},
		{
			substance: "Cholinesterase inhibitors",
			polishSubstance: "Inhibitory cholinoesterazy",
			type: "synergistic",
			clinicalSignificance: "Moderate clinical significance - monitor closely",
			polishClinicalSignificance:
				"Umiarkowane znaczenie kliniczne - ścisłe monitorowanie",
			severity: "moderate",
			mechanism: "Enhanced cognitive effects",
			polishMechanism: "Wzmocnione efekty poznawcze",
			description: "May enhance cognitive effects of cholinesterase inhibitors",
			polishDescription:
				"Może wzmocnić efekty poznawcze inhibitorów cholinoesterazy",
			recommendation: "Monitor for excessive cognitive enhancement",
			polishRecommendation: "Monitoruj nadmierne wzmocnienie poznawcze",
			evidenceLevel: "WEAK",
		},
	],

	// Evidence level and research studies
	evidenceLevel: "MODERATE",
	researchStudies: [
		{
			id: "glade-2015",
			title: "Phosphatidylserine and the human brain",
			polishTitle: "Fosfatydyloseryna i ludzki mózg",
			authors: ["Glade MJ", "Smith K"],
			journal: "Nutrition",
			year: 2015,
			studyType: "SYSTEMATIC_REVIEW",
			primaryOutcome: "Brain function",
			polishPrimaryOutcome: "Funkcja mózgu",
			findings:
				"Phosphatidylserine supports brain function and stress management",
			polishFindings:
				"Fosfatydyloseryna wspiera funkcję mózgu i zarządzanie stresem",
			evidenceLevel: "MODERATE",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "25933483",
			doi: "10.1016/j.nut.2014.12.014",
			sampleSize: 0,
			qualityScore: 7.0,
		},
		{
			id: "kidd-2008",
			title:
				"Neurodegeneration from mitochondrial insufficiency: supplements, disease models, and nutritional intervention",
			polishTitle:
				"Neurodegeneracja z niewydolności mitochondrialnej: suplementy, modele chorób i interwencja odżywcza",
			authors: ["Kidd PM"],
			journal: "Alternative Medicine Review",
			year: 2008,
			studyType: "SYSTEMATIC_REVIEW",
			primaryOutcome: "Neuroprotection",
			polishPrimaryOutcome: "Neuroprotekcja",
			findings:
				"Phosphatidylserine shows benefits for neuroprotection and cognitive support",
			polishFindings:
				"Fosfatydyloseryna wykazuje korzyści dla neuroprotekcji i wsparcia poznawczego",
			evidenceLevel: "MODERATE",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "18954318",
			sampleSize: 0,
			qualityScore: 6.5,
		},
		{
			id: "crook-1991",
			title: "Effects of phosphatidylserine in Alzheimer's disease",
			polishTitle: "Efekty fosfatydyloseryny w chorobie Alzheimera",
			authors: ["Crook TH", "Petrie W", "Pirozzo P"],
			journal: "Journal of Clinical Psychiatry",
			year: 1991,
			studyType: "RANDOMIZED_CONTROLLED_TRIAL",
			primaryOutcome: "Cognitive function in Alzheimer's",
			polishPrimaryOutcome: "Funkcja poznawcza w chorobie Alzheimera",
			findings:
				"Phosphatidylserine showed modest improvements in cognitive function",
			polishFindings:
				"Fosfatydyloseryna wykazała umiarkowane poprawy funkcji poznawczych",
			evidenceLevel: "MODERATE",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "1827914",
			sampleSize: 149,
			duration: "12 weeks",
			dosage: "300mg daily",
			qualityScore: 7.5,
		},
	],

	// Metadata
	tags: [
		"phospholipid",
		"brain health",
		"stress",
		"cortisol",
		"cognitive function",
		"neuroprotection",
		"membrane support",
	],
	lastUpdated: "2024-01-15T00:00:00Z",
	createdAt: "2024-01-15T00:00:00Z",

	// Additional fields for Prisma compatibility
	knowledgeNodeId: null,
};

export const phosphatidylserine = phosphatidylserineProfile;
export default phosphatidylserineProfile;
