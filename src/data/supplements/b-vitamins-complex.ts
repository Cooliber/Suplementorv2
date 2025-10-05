/**
 * B Vitamins Complex Supplement Profile
 * Migrated from nextjs-roocode-template with enhanced T3 Stack compatibility
 * Essential Brain Nutrients with comprehensive Polish medical compliance
 */

import type { SupplementWithRelations } from "../../types/supplement";

export const bVitaminsComplexProfile: SupplementWithRelations = {
	id: "b-vitamins-complex",
	name: "B Vitamins Complex",
	polishName: "Kompleks witamin B",
	scientificName: "Vitamin B Complex",
	commonNames: ["B-Complex", "Vitamin B Complex", "Kompleks Witamin B"],
	polishCommonNames: [
		"B-Kompleks",
		"Zespoł Witamin B",
		"Kompleks Witamin Grupy B",
	],
	category: "VITAMIN",
	description:
		"B Vitamins Complex is a synergistic blend of essential water-soluble vitamins crucial for energy metabolism, brain function, nervous system health, and cellular processes. Each vitamin serves specific roles while working together for optimal health outcomes.",
	polishDescription:
		"Kompleks Witamin B to synergistyczna mieszanka niezbędnych rozpuszczalnych w wodzie witamin kluczowych dla metabolizmu energetycznego, funkcji mózgu, zdrowia układu nerwowego i procesów komórkowych. Każda witamina pełni specyficzne role, działając razem dla optymalnych wyników zdrowotnych.",

	// Active compounds with detailed bioavailability data
	activeCompounds: [
		{
			name: "Vitamin B1 (Thiamine)",
			polishName: "Witamina B1 (Tiamina)",
			concentration: "50mg",
			bioavailability: 90,
			halfLife: "1.5 days",
			metabolicPathway: ["Energy metabolism", "Carbohydrate metabolism"],
			targetReceptors: ["Thiamine pyrophosphate"],
		},
		{
			name: "Vitamin B2 (Riboflavin)",
			polishName: "Witamina B2 (Ryboflawina)",
			concentration: "50mg",
			bioavailability: 85,
			halfLife: "1.1 days",
			metabolicPathway: ["Energy metabolism", "Electron transport chain"],
			targetReceptors: ["FAD", "FMN"],
		},
		{
			name: "Vitamin B3 (Niacin)",
			polishName: "Witamina B3 (Niacyna)",
			concentration: "50mg",
			bioavailability: 80,
			halfLife: "1.5 hours",
			metabolicPathway: ["Energy metabolism", "DNA repair"],
			targetReceptors: ["NAD+", "NADP+"],
		},
		{
			name: "Vitamin B5 (Pantothenic Acid)",
			polishName: "Witamina B5 (Kwas pantotenowy)",
			concentration: "50mg",
			bioavailability: 70,
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
			bioavailability: 95,
			halfLife: "6-8 hours",
			metabolicPathway: ["Carboxylation reactions", "Glucose metabolism"],
			targetReceptors: ["Biotin-dependent carboxylases"],
		},
		{
			name: "Vitamin B9 (Folate)",
			polishName: "Witamina B9 (Kwas foliowy)",
			concentration: "400mcg",
			bioavailability: 85,
			halfLife: "40-60 days",
			metabolicPathway: ["Methylation", "DNA synthesis"],
			targetReceptors: ["Methylfolate"],
		},
		{
			name: "Vitamin B12 (Cobalamin)",
			polishName: "Witamina B12 (Kobalamina)",
			concentration: "1000mcg",
			bioavailability: 50,
			halfLife: "3-5 years",
			metabolicPathway: ["Methylation", "Red blood cell formation"],
			targetReceptors: ["Intrinsic factor receptors"],
		},
	],

	// Clinical applications with Polish translations
	clinicalApplications: [
		{
			condition: "Energy and fatigue reduction",
			polishCondition: "Energia i redukcja zmęczenia",
			indication:
				"Support for cellular energy production and fatigue reduction",
			polishIndication:
				"Wsparcie dla produkcji energii komórkowej i redukcji zmęczenia",
			efficacy: "high",
			effectivenessRating: 8,
			evidenceLevel: "STRONG",
			recommendedDose: "1-2 tablets daily",
			duration: "2-4 weeks",
			effectSize: 0.55,
			studyCount: 18,
			participantCount: 2000,
			recommendationGrade: "A",
		},
		{
			condition: "Cognitive function and mental clarity",
			polishCondition: "Funkcje poznawcze i jasność umysłu",
			indication: "Support for brain function and mental clarity",
			polishIndication: "Wsparcie dla funkcji mózgu i jasności umysłu",
			efficacy: "moderate",
			effectivenessRating: 8,
			evidenceLevel: "STRONG",
			recommendedDose: "1 tablet daily",
			duration: "8-12 weeks",
			effectSize: 0.35,
			studyCount: 15,
			participantCount: 1500,
			recommendationGrade: "A",
		},
		{
			condition: "Mood support and stress management",
			polishCondition: "Wsparcie nastroju i zarządzanie stresem",
			indication: "Support for mood regulation and stress response",
			polishIndication: "Wsparcie dla regulacji nastroju i odpowiedzi na stres",
			efficacy: "moderate",
			effectivenessRating: 6,
			evidenceLevel: "MODERATE",
			recommendedDose: "1 tablet daily",
			duration: "6-8 weeks",
			effectSize: 0.25,
			studyCount: 10,
			participantCount: 800,
			recommendationGrade: "B",
		},
		{
			condition: "Neurological health and nerve function",
			polishCondition: "Zdrowie neurologiczne i funkcja nerwów",
			indication: "Support for nervous system maintenance and repair",
			polishIndication: "Wsparcie dla utrzymania i naprawy układu nerwowego",
			efficacy: "moderate",
			effectivenessRating: 6,
			evidenceLevel: "MODERATE",
			recommendedDose: "1 tablet daily",
			duration: "12-16 weeks",
			effectSize: 0.3,
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
				"B vitamins are essential cofactors in cellular energy production, supporting mitochondrial function and ATP synthesis. They facilitate the conversion of food into energy.",
			polishDescription:
				"Witaminy B są niezbędnymi kofaktorami w produkcji energii komórkowej, wspierając funkcję mitochondrialną i syntezę ATP. Ułatwiają przekształcanie pokarmu w energię.",
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
			name: "Neurotransmitter synthesis and regulation",
			polishName: "Synteza i regulacja neuroprzekaźników",
			pathway: "Neurotransmitter synthesis and regulation",
			polishPathway: "Neurotransmitter synthesis and regulation",
			description:
				"Critical for synthesis of neurotransmitters including serotonin, dopamine, GABA, and norepinephrine. B6 serves as a crucial cofactor for amino acid metabolism and neurotransmitter production.",
			polishDescription:
				"Kluczowe dla syntezy neuroprzekaźników w tym serotoniny, dopaminy, GABA i noradrenaliny. B6 pełni rolę kluczowego kofaktora w metabolizmie aminokwasów i produkcji neuroprzekaźników.",
			evidenceLevel: "STRONG",
			targetSystems: [
				"Serotonin system",
				"Dopamine system",
				"GABA system",
				"Norepinephrine system",
			],
			timeToEffect: "2-4 weeks",
			duration: "Continuous requirement",
		},
		{
			id: "homocysteine-methylation",
			name: "Homocysteine metabolism and methylation",
			polishName: "Metabolizm homocysteiny i metylacja",
			pathway: "Homocysteine metabolism and methylation",
			polishPathway: "Homocysteine metabolism and methylation",
			description:
				"B6, B9, and B12 regulate homocysteine levels and support methylation processes essential for brain function. Proper methylation supports gene expression and cellular repair.",
			polishDescription:
				"B6, B9 i B12 regulują poziomy homocysteiny i wspierają procesy metylacji niezbędne dla funkcji mózgu. Poprawna metylacja wspiera ekspresję genów i naprawę komórkową.",
			evidenceLevel: "STRONG",
			targetSystems: [
				"Methylation system",
				"Cardiovascular health",
				"Brain function",
			],
			timeToEffect: "4-6 weeks",
			duration: "Long-term requirement",
		},
		{
			id: "nervous-system-maintenance",
			name: "Nervous system maintenance and repair",
			polishName: "Utrzymanie i naprawa układu nerwowego",
			pathway: "Nervous system maintenance and repair",
			polishPathway: "Nervous system maintenance and repair",
			description:
				"Support myelin sheath formation, nerve signaling, and protection against neurological damage. Essential for proper nervous system function and neural integrity.",
			polishDescription:
				"Wsparcie dla tworzenia osłonki mielinowej, sygnalizacji nerwowej i ochrony przed uszkodzeniami neurologicznymi. Niezbędne dla prawidłowej funkcji układu nerwowego i integralności neuronów.",
			evidenceLevel: "STRONG",
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
		contraindications: ["Cancer patients on specific treatments"],
		polishContraindications: [
			"Pacjenci z nowotworami otrzymujący specyficzne leczenie",
		],
		interactions: [],
	},

	// Side effects with frequency and management
	sideEffects: [
		{
			effect: "Gastrointestinal discomfort",
			polishEffect: "Niewygodę jelitową",
			frequency: "uncommon",
			severity: "mild",
			reversible: true,
			dosageDependent: true,
			timeToOnset: "30-60 minutes",
			management: "Take with food, reduce dose",
			polishManagement: "Przyjmuj z jedzeniem, zmniejsz dawkę",
		},
		{
			effect: "Skin flushing (with high niacin)",
			polishEffect: "Zaczerwienienie skóry (przy wysokiej niacynie)",
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
	],

	// Evidence level and research studies
	evidenceLevel: "STRONG",
	researchStudies: [
		{
			id: "kennedy-2016",
			title: "B Vitamins and the Brain: Mechanisms, Dose and Efficacy—A Review",
			polishTitle:
				"Witaminy B i mózg: mechanizmy, dawki i skuteczność - Przegląd",
			authors: ["Kennedy DO"],
			journal: "Nutrients",
			year: 2016,
			studyType: "SYSTEMATIC_REVIEW",
			primaryOutcome: "B-vitamin effects on brain function",
			polishPrimaryOutcome: "Efekty witamin B na funkcję mózgu",
			findings:
				"B vitamins play crucial roles in brain function and supplementation can support cognitive health",
			polishFindings:
				"Witaminy B odgrywają kluczowe role w funkcji mózgu, a suplementacja może wspierać zdrowie poznawcze",
			evidenceLevel: "STRONG",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "26828517",
			doi: "10.3390/nu8020068",
			sampleSize: 0,
			qualityScore: 8.5,
		},
		{
			id: "zhang-2017",
			title:
				"The effect of vitamin B supplementation on cognitive function in the elderly",
			polishTitle:
				"Efekt suplementacji witamin B na funkcję poznawczą u osób starszych",
			authors: ["Zhang DM", "Ye JX", "Mu JS"],
			journal: "Journal of Clinical Biochemistry and Nutrition",
			year: 2017,
			studyType: "META_ANALYSIS",
			primaryOutcome: "Cognitive function in elderly",
			polishPrimaryOutcome: "Funkcja poznawcza u osób starszych",
			findings:
				"B-vitamin supplementation improves cognitive function in older adults",
			polishFindings:
				"Suplementacja witamin B poprawia funkcję poznawczą u osób starszych",
			evidenceLevel: "STRONG",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "28070194",
			doi: "10.3164/jcbn.16-108",
			sampleSize: 0,
			qualityScore: 8.0,
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
			primaryOutcome: "Depression risk after stroke",
			polishPrimaryOutcome: "Ryzyko depresji po udarze",
			findings:
				"B-vitamin supplementation significantly reduced depression risk in stroke patients",
			polishFindings:
				"Suplementacja witamin B znacząco zmniejszyła ryzyko depresji u pacjentów po udarze",
			evidenceLevel: "MODERATE",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "20687128",
			doi: "10.1002/ana.22108",
			sampleSize: 1076,
			duration: "2 years",
			qualityScore: 8.5,
		},
	],

	// Metadata
	tags: [
		"vitamin",
		"energy",
		"cognitive function",
		"neurotransmitter synthesis",
		"methylation",
		"nervous system",
		"homocysteine",
	],
	lastUpdated: "2024-01-15T00:00:00Z",
	createdAt: "2024-01-15T00:00:00Z",

	// Additional fields for Prisma compatibility
	knowledgeNodeId: null,
};

export default bVitaminsComplexProfile;
