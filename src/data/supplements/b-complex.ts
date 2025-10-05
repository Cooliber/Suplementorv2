/**
 * B-Complex Vitamins Supplement Profile
 * Migrated from nextjs-roocode-template with enhanced T3 Stack compatibility
 * Essential Brain Nutrients with comprehensive Polish medical compliance
 */

import type { SupplementWithRelations } from "../../types/supplement";

export const bComplexProfile: SupplementWithRelations = {
	id: "b-complex",
	name: "B-Complex Vitamins",
	polishName: "Witaminy z grupy B",
	scientificName: "Vitamin B Complex",
	commonNames: [
		"B Vitamins",
		"Vitamin B Complex",
		"Complex Witaminowy Grupy B",
	],
	polishCommonNames: [
		"Witaminy B",
		"Zespoł Witamin Grupy B",
		"Complex Witaminowy Grupy B",
	],
	category: "VITAMIN",
	description:
		"B-Complex vitamins are a group of eight essential water-soluble vitamins that work synergistically to support cellular energy production, brain function, neurotransmitter synthesis, and overall metabolic health. These vitamins serve as crucial cofactors in numerous biochemical reactions.",
	polishDescription:
		"Witaminy z grupy B to grupa ośmiu niezbędnych rozpuszczalnych w wodzie witamin, które działają synergistycznie, wspierając produkcję energii komórkowej, funkcję mózgu, syntezę neuroprzekaźników i ogólne zdrowie metaboliczne. Witaminy te pełnią rolę kluczowych kofaktorów w licznych reakcjach biochemicznych.",

	// Active compounds with detailed bioavailability data
	activeCompounds: [
		{
			name: "Vitamin B1 (Thiamine)",
			polishName: "Witamina B1 (Tiamina)",
			concentration: "50mg",
			bioavailability: 25,
			halfLife: "1.5 days",
			metabolicPathway: ["Energy metabolism", "Carbohydrate metabolism"],
			targetReceptors: ["Thiamine pyrophosphate"],
		},
		{
			name: "Vitamin B2 (Riboflavin)",
			polishName: "Witamina B2 (Ryboflawina)",
			concentration: "50mg",
			bioavailability: 30,
			halfLife: "1.1 days",
			metabolicPathway: ["Energy metabolism", "Electron transport chain"],
			targetReceptors: ["FAD", "FMN"],
		},
		{
			name: "Vitamin B3 (Niacin)",
			polishName: "Witamina B3 (Niacyna)",
			concentration: "50mg",
			bioavailability: 35,
			halfLife: "1.5 hours",
			metabolicPathway: ["Energy metabolism", "DNA repair"],
			targetReceptors: ["NAD+", "NADP+"],
		},
		{
			name: "Vitamin B5 (Pantothenic Acid)",
			polishName: "Witamina B5 (Kwas pantotenowy)",
			concentration: "50mg",
			bioavailability: 40,
			halfLife: "1.8 hours",
			metabolicPathway: ["Energy metabolism", "Coenzyme A synthesis"],
			targetReceptors: ["Coenzyme A"],
		},
		{
			name: "Vitamin B6 (Pyridoxine)",
			polishName: "Witamina B6 (Pirydoksyna)",
			concentration: "50mg",
			bioavailability: 75,
			halfLife: "15-20 days",
			metabolicPathway: ["Neurotransmitter synthesis", "Amino acid metabolism"],
			targetReceptors: ["PLP (Pyridoxal phosphate)"],
		},
		{
			name: "Vitamin B7 (Biotin)",
			polishName: "Witamina B7 (Biotyna)",
			concentration: "300mcg",
			bioavailability: 20,
			halfLife: "6-8 hours",
			metabolicPathway: ["Carboxylation reactions", "Glucose metabolism"],
			targetReceptors: ["Biotin-dependent carboxylases"],
		},
		{
			name: "Vitamin B9 (Folate)",
			polishName: "Witamina B9 (Kwas foliowy)",
			concentration: "400mcg",
			bioavailability: 50,
			halfLife: "40-60 days",
			metabolicPathway: ["Methylation", "DNA synthesis"],
			targetReceptors: ["Methylfolate"],
		},
		{
			name: "Vitamin B12 (Cobalamin)",
			polishName: "Witamina B12 (Kobalamina)",
			concentration: "1000mcg",
			bioavailability: 45,
			halfLife: "3-5 years",
			metabolicPathway: ["Methylation", "Red blood cell formation"],
			targetReceptors: ["Intrinsic factor receptors"],
		},
	],

	// Clinical applications with Polish translations
	clinicalApplications: [
		{
			condition: "Energy and fatigue",
			polishCondition: "Energia i zmęczenie",
			indication:
				"Support for cellular energy production and fatigue reduction",
			polishIndication:
				"Wsparcie dla produkcji energii komórkowej i redukcji zmęczenia",
			efficacy: "high",
			effectivenessRating: 8,
			evidenceLevel: "STRONG",
			recommendedDose: "1-2 tablets daily",
			duration: "2-4 weeks",
			effectSize: 0.5,
			studyCount: 20,
			participantCount: 2500,
			recommendationGrade: "A",
		},
		{
			condition: "Cognitive function and memory",
			polishCondition: "Funkcje poznawcze i pamięć",
			indication: "Support for brain function and memory formation",
			polishIndication: "Wsparcie dla funkcji mózgu i tworzenia pamięci",
			efficacy: "moderate",
			effectivenessRating: 6,
			evidenceLevel: "MODERATE",
			recommendedDose: "1 tablet daily",
			duration: "8-12 weeks",
			effectSize: 0.3,
			studyCount: 12,
			participantCount: 1200,
			recommendationGrade: "B",
		},
		{
			condition: "Mood and depression support",
			polishCondition: "Wsparcie nastroju i depresji",
			indication: "Support for mood regulation and depression management",
			polishIndication:
				"Wsparcie dla regulacji nastroju i zarządzania depresją",
			efficacy: "moderate",
			effectivenessRating: 6,
			evidenceLevel: "MODERATE",
			recommendedDose: "1-2 tablets daily",
			duration: "6-12 weeks",
			effectSize: 0.25,
			studyCount: 10,
			participantCount: 800,
			recommendationGrade: "B",
		},
		{
			condition: "Stress and anxiety",
			polishCondition: "Stres i lęk",
			indication: "Support for stress response and anxiety management",
			polishIndication: "Wsparcie dla odpowiedzi na stres i zarządzania lękiem",
			efficacy: "low",
			effectivenessRating: 4,
			evidenceLevel: "WEAK",
			recommendedDose: "1 tablet daily",
			duration: "4-8 weeks",
			effectSize: 0.15,
			studyCount: 6,
			participantCount: 450,
			recommendationGrade: "C",
		},
		{
			condition: "Neuropathy and nerve health",
			polishCondition: "Neuropatia i zdrowie nerwów",
			indication: "Support for nerve function and myelination",
			polishIndication: "Wsparcie dla funkcji nerwów i mielinizacji",
			efficacy: "moderate",
			effectivenessRating: 6,
			evidenceLevel: "MODERATE",
			recommendedDose: "1-2 tablets daily",
			duration: "12-16 weeks",
			effectSize: 0.35,
			studyCount: 8,
			participantCount: 600,
			recommendationGrade: "B",
		},
	],

	// Mechanisms of action with detailed pathways
	mechanisms: [
		{
			id: "energy-metabolism",
			name: "Energy metabolism and ATP production",
			polishName: "Metabolizm energetyczny i produkcja ATP",
			pathway: "Energy metabolism and ATP production",
			polishPathway: "Energy metabolism and ATP production",
			description:
				"Essential cofactors in cellular energy production, supporting brain metabolism and function. B vitamins serve as coenzymes in the Krebs cycle and electron transport chain.",
			polishDescription:
				"Niezbędne kofaktory w produkcji energii komórkowej, wspierające metabolizm mózgu i funkcję. Witaminy B pełnią rolę koenzymów w cyklu Krebsa i łańcuchu transportu elektronów.",
			evidenceLevel: "STRONG",
			targetSystems: [
				"Energy metabolism",
				"ATP production",
				"Mitochondrial function",
			],
			timeToEffect: "Days to weeks",
			duration: "Continuous requirement",
		},
		{
			id: "neurotransmitter-synthesis",
			name: "Neurotransmitter synthesis",
			polishName: "Synteza neuroprzekaźników",
			pathway: "Neurotransmitter synthesis",
			polishPathway: "Neurotransmitter synthesis",
			description:
				"Required for synthesis of serotonin, dopamine, GABA, and other neurotransmitters. B6 (pyridoxal phosphate) is particularly important for amino acid metabolism and neurotransmitter production.",
			polishDescription:
				"Wymagane do syntezy serotoniny, dopaminy, GABA i innych neuroprzekaźników. B6 (pirydoksal fosforan) jest szczególnie ważna dla metabolizmu aminokwasów i produkcji neuroprzekaźników.",
			evidenceLevel: "STRONG",
			targetSystems: ["Serotonin system", "Dopamine system", "GABA system"],
			timeToEffect: "2-4 weeks",
			duration: "Continuous requirement",
		},
		{
			id: "homocysteine-metabolism",
			name: "Homocysteine metabolism",
			polishName: "Metabolizm homocysteiny",
			pathway: "Homocysteine metabolism",
			polishPathway: "Homocysteine metabolism",
			description:
				"B6, B9, and B12 regulate homocysteine levels, supporting cardiovascular and brain health. Elevated homocysteine is associated with cognitive decline and cardiovascular risk.",
			polishDescription:
				"B6, B9 i B12 regulują poziomy homocysteiny, wspierając zdrowie sercowo-naczyniowe i mózgowe. Podwyższona homocysteina jest związana ze spadkiem funkcji poznawczych i ryzykiem sercowo-naczyniowym.",
			evidenceLevel: "STRONG",
			targetSystems: ["Cardiovascular system", "Brain health", "Methylation"],
			timeToEffect: "4-6 weeks",
			duration: "Long-term requirement",
		},
		{
			id: "methylation-dna-synthesis",
			name: "Methylation and DNA synthesis",
			polishName: "Metylacja i synteza DNA",
			pathway: "Methylation and DNA synthesis",
			polishPathway: "Methylation and DNA synthesis",
			description:
				"B9 and B12 are essential for methylation processes and DNA synthesis. Methylation is critical for gene expression, neurotransmitter synthesis, and cellular repair.",
			polishDescription:
				"B9 i B12 są niezbędne dla procesów metylacji i syntezy DNA. Metylacja jest krytyczna dla ekspresji genów, syntezy neuroprzekaźników i naprawy komórkowej.",
			evidenceLevel: "STRONG",
			targetSystems: ["DNA synthesis", "Gene expression", "Cellular repair"],
			timeToEffect: "Weeks to months",
			duration: "Continuous requirement",
		},
		{
			id: "nerve-function",
			name: "Nerve function and myelination",
			polishName: "Funkcja nerwów i mielinizacja",
			pathway: "Nerve function and myelination",
			polishPathway: "Nerve function and myelination",
			description:
				"B1, B6, and B12 support nerve function and myelin sheath maintenance. These vitamins are crucial for proper nervous system function and neural integrity.",
			polishDescription:
				"B1, B6 i B12 wspierają funkcję nerwów i utrzymanie osłonki mielinowej. Te witaminy są kluczowe dla prawidłowej funkcji układu nerwowego i integralności neuronów.",
			evidenceLevel: "MODERATE",
			targetSystems: ["Nervous system", "Myelination", "Neural function"],
			timeToEffect: "4-8 weeks",
			duration: "Continuous requirement",
		},
	],

	// Comprehensive dosage guidelines
	dosageGuidelines: {
		therapeuticRange: {
			min: 1,
			max: 2,
			unit: "tablet",
		},
		timing: ["morning"],
		withFood: true,
		contraindications: ["Cancer", "Pregnancy (high doses)"],
		polishContraindications: ["Nowotwory", "Ciąża (wysokie dawki)"],
		interactions: [
			{
				substance: "Levodopa",
				polishSubstance: "Levodopa",
				type: "antagonistic",
				severity: "moderate",
				description: "Interaction between supplements",
				polishDescription: "Interakcja między suplementami",
				clinicalSignificance: "Monitor for effects",
				polishClinicalSignificance: "Monitorować efekty",
				mechanism: "Reduced efficacy",
				polishMechanism: "Zmniejszona skuteczność",
				recommendation: "Separate administration by at least 2 hours",
				polishRecommendation: "Oddzielone podanie o przynajmniej 2 godziny",
				evidenceLevel: "MODERATE",
			},
		],
	},

	// Side effects with frequency and management
	sideEffects: [
		{
			effect: "Nausea",
			polishEffect: "Nudności",
			frequency: "uncommon",
			severity: "mild",
			reversible: true,
			dosageDependent: true,
			timeToOnset: "30-60 minutes",
			management: "Take with food, space out doses",
			polishManagement: "Przyjmuj z jedzeniem, rozłóż dawki",
		},
		{
			effect: "Skin flushing",
			polishEffect: "Zaczerwienienie skóry",
			frequency: "uncommon",
			severity: "mild",
			reversible: true,
			dosageDependent: true,
			timeToOnset: "30-60 minutes",
			management: "Reduce dose, take with food",
			polishManagement: "Zmniejsz dawkę, przyjmuj z jedzeniem",
		},
		{
			effect: "Bright yellow urine",
			polishEffect: "Jasnożółta mocz",
			frequency: "common",
			severity: "mild",
			reversible: true,
			dosageDependent: false,
			timeToOnset: "Within hours",
			management: "Reassurance - harmless side effect",
			polishManagement: "Zapewnienie - nieszkodliwy skutek uboczny",
		},
	],

	// Supplement interactions
	interactions: [
		{
			substance: "Alcohol",
			polishSubstance: "Alkohol",
			type: "antagonistic",
			severity: "moderate",
			description: "Interaction between supplements",
			polishDescription: "Interakcja między suplementami",
			clinicalSignificance: "Monitor for effects",
			polishClinicalSignificance: "Monitorować efekty",
			mechanism: "Depletion of B vitamins",
			polishMechanism: "Wyczerpanie witamin z grupy B",
			recommendation: "Supplement additional B vitamins if consuming alcohol",
			polishRecommendation:
				"Suplementuj dodatkowe witaminy B przy spożyciu alkoholu",
			evidenceLevel: "MODERATE",
		},
		{
			substance: "Oral contraceptives",
			polishSubstance: "Środki antykoncepcyjne doustne",
			type: "antagonistic",
			clinicalSignificance: "Moderate clinical significance - monitor closely",
			polishClinicalSignificance:
				"Umiarkowane znaczenie kliniczne - ścisłe monitorowanie",
			severity: "moderate",
			mechanism: "Reduced B vitamin levels",
			polishMechanism: "Zmniejszone poziomy witamin B",
			description:
				"May deplete B vitamins, requiring additional supplementation",
			polishDescription:
				"Może wyczerpywać witaminy B, wymagając dodatkowego suplementowania",
			recommendation:
				"Consider increasing B vitamin intake while on contraceptives",
			polishRecommendation:
				"Rozważ zwiększenie spożycia witamin B podczas stosowania antykoncepcji",
			evidenceLevel: "MODERATE",
		},
	],

	// Evidence level and research studies
	evidenceLevel: "STRONG",
	researchStudies: [
		{
			id: "kennedy-2016",
			title: "B Vitamins and the Brain: Mechanisms, Dose and Efficacy—A Review",
			polishTitle:
				"Witaminy B i mózg: mechanizmy, dawki i skuteczność - przegląd",
			authors: ["Kennedy DO"],
			journal: "Nutrients",
			year: 2016,
			studyType: "SYSTEMATIC_REVIEW",
			primaryOutcome: "Brain function",
			polishPrimaryOutcome: "Funkcja mózgu",
			findings:
				"B vitamins are essential for brain function and cognitive health",
			polishFindings:
				"Witaminy B są niezbędne dla funkcji mózgu i zdrowia poznawczego",
			evidenceLevel: "MODERATE",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "26828517",
			doi: "10.3390/nu8020068",
			sampleSize: 0,
			qualityScore: 8.0,
		},
		{
			id: "zhang-2017",
			title:
				"Effects of B vitamin supplementation on cognitive function in elderly patients",
			polishTitle:
				"Efekty suplementacji witamin B na funkcję poznawczą u pacjentów starszych",
			authors: ["Zhang DM", "Ye JX", "Mu JS"],
			journal: "Neural Regeneration Research",
			year: 2017,
			studyType: "SYSTEMATIC_REVIEW",
			primaryOutcome: "Cognitive function",
			polishPrimaryOutcome: "Funkcja poznawcza",
			findings:
				"B vitamin supplementation may benefit cognitive function in elderly",
			polishFindings:
				"Suplementacja witamin B może poprawić funkcję poznawczą u osób starszych",
			evidenceLevel: "MODERATE",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "28250762",
			doi: "10.4103/1673-5374.202923",
			sampleSize: 0,
			qualityScore: 7.5,
		},
		{
			id: "almeida-2010",
			title: "B-vitamins reduce the long-term risk of depression after stroke",
			polishTitle:
				"Witaminy B zmniejszają długoterminowe ryzyko depresji po udarze",
			authors: ["Almeida OP", "Marsh K", "Alfonso H"],
			journal: "Annals of Neurology",
			year: 2010,
			studyType: "COHORT_STUDY",
			primaryOutcome: "Depression risk",
			polishPrimaryOutcome: "Ryzyko depresji",
			findings: "B vitamins reduce depression risk after stroke",
			polishFindings: "Witaminy B zmniejszają ryzyko depresji po udarze",
			evidenceLevel: "MODERATE",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "20687128",
			doi: "10.1002/ana.22108",
			sampleSize: 1076,
			duration: "2 years",
			qualityScore: 8.5,
		},
		{
			id: "ravaglia-2005",
			title: "Homocysteine and cognitive function",
			polishTitle: "Homocysteina i funkcja poznawcza",
			authors: ["Ravaglia G", "Forti P", "Maioli F"],
			journal: "Neurology",
			year: 2005,
			studyType: "COHORT_STUDY",
			primaryOutcome: "Cognitive function",
			polishPrimaryOutcome: "Funkcja poznawcza",
			findings: "High homocysteine levels associated with cognitive decline",
			polishFindings:
				"Wysokie poziomy homocysteiny związane ze spadkiem funkcji poznawczych",
			evidenceLevel: "MODERATE",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "16275831",
			doi: "10.1212/01.wnl.0000186188.83979.14",
			sampleSize: 1092,
			qualityScore: 8.0,
		},
		{
			id: "hankey-2012",
			title:
				"B vitamins in patients with recent transient ischaemic attack or stroke in the VITAmins TO Prevent Stroke (VITATOPS) trial",
			polishTitle:
				"Witaminy B u pacjentów z niedawnym przemijającym napadem niedokrwiennym mózgu lub udarem w badaniu VITAmins TO Prevent Stroke (VITATOPS)",
			authors: ["Hankey GJ", "Ford AH", "Yi Q"],
			journal: "Stroke",
			year: 2012,
			studyType: "RANDOMIZED_CONTROLLED_TRIAL",
			primaryOutcome: "Stroke prevention",
			polishPrimaryOutcome: "Profilaktyka udaru",
			findings: "B vitamins may reduce stroke risk in deficient individuals",
			polishFindings:
				"Witaminy B mogą zmniejszyć ryzyko udaru u osób z niedoborami",
			evidenceLevel: "MODERATE",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "22851546",
			doi: "10.1161/STROKEAHA.112.660953",
			sampleSize: 10747,
			duration: "3.4 years",
			dosage: "B6 (40mg) + B9 (2mg) + B12 (500mcg)",
			qualityScore: 9.0,
		},
	],

	// Metadata
	tags: [
		"vitamin",
		"energy",
		"cognitive function",
		"neurotransmitter synthesis",
		"methylation",
		"homocysteine",
		"mood support",
	],
	lastUpdated: "2024-01-15T00:00:00Z",
	createdAt: "2024-01-15T00:00:00Z",

	// Additional fields for Prisma compatibility
	knowledgeNodeId: null,
};

export default bComplexProfile;
