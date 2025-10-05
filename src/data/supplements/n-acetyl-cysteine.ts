/**
 * N-Acetyl Cysteine Supplement Profile
 * Migrated from nextjs-roocode-template with enhanced T3 Stack compatibility
 * The Glutathione Precursor with comprehensive Polish medical compliance
 */

import type { SupplementWithRelations } from "../../types/supplement";

export const nAcetylCysteineProfile: SupplementWithRelations = {
	id: "n-acetyl-cysteine",
	name: "N-Acetyl Cysteine",
	polishName: "N-Acetylocysteina",
	scientificName: "N-Acetyl-L-cysteine",
	commonNames: ["NAC", "Acetylcysteine", "N-Acetylcysteine"],
	polishCommonNames: ["NAC", "Acetylocysteina", "N-Acetylocysteina"],
	category: "AMINO_ACID",
	description:
		"N-Acetyl Cysteine (NAC) is a stable, bioavailable form of the amino acid cysteine that serves as a precursor to glutathione, the body's primary antioxidant. It supports cellular defense against oxidative stress, modulates glutamatergic neurotransmission, and has shown therapeutic potential in psychiatric disorders, addiction recovery, and respiratory health.",
	polishDescription:
		"N-Acetylocysteina (NAC) to stabilna, biodostępna forma aminokwasu cysteiny, która pełni rolę prekursora glutationu, głównego antyoksydantu organizmu. Wspiera obronę komórkową przed stresem oksydacyjnym, moduluje neurotransmisję glutaminergiczną i wykazała potencjał terapeutyczny w zaburzeniach psychiatrycznych, odzyskiwaniu z uzależnień i zdrowiu oddechowym.",

	// Active compounds with detailed bioavailability data
	activeCompounds: [
		{
			name: "N-Acetyl Cysteine",
			polishName: "N-Acetylocysteina",
			concentration: "99%",
			bioavailability: 10,
			halfLife: "2-3 hours",
			metabolicPathway: [
				"Glutathione synthesis",
				"Antioxidant pathways",
				"Mucolytic action",
			],
			targetReceptors: ["Glutathione precursors", "Mucolytic targets"],
		},
	],

	// Clinical applications with Polish translations
	clinicalApplications: [
		{
			condition: "Oxidative stress and antioxidant support",
			polishCondition: "Stres oksydacyjny i wsparcie antyoksydacyjne",
			indication: "Protection against free radical damage and oxidative stress",
			polishIndication:
				"Ochrona przed uszkodzeniami wolnymi rodnikami i stresem oksydacyjnym",
			efficacy: "high",
			effectivenessRating: 8,
			evidenceLevel: "STRONG",
			recommendedDose: "600-1200mg daily",
			duration: "Days to weeks",
			effectSize: 0.7,
			studyCount: 10,
			participantCount: 800,
			recommendationGrade: "A",
		},
		{
			condition: "Psychiatric disorders and mood support",
			polishCondition: "Zaburzenia psychiatryczne i wsparcie nastroju",
			indication:
				"Support for depression, bipolar disorder, and other psychiatric conditions",
			polishIndication:
				"Wsparcie dla depresji, zaburzeń dwubiegunowych i innych stanów psychiatrycznych",
			efficacy: "moderate",
			effectivenessRating: 6,
			evidenceLevel: "MODERATE",
			recommendedDose: "1000-2000mg daily",
			duration: "4-12 weeks",
			effectSize: 0.4,
			studyCount: 15,
			participantCount: 1200,
			recommendationGrade: "B",
		},
		{
			condition: "Addiction recovery and craving reduction",
			polishCondition: "Odzyskiwanie z uzależnień i redukcja głodu",
			indication:
				"Reduction in cravings for substances including cocaine, cannabis, and nicotine",
			polishIndication:
				"Redukcja głodu wobec substancji w tym kokainy, marihuany i nikotyny",
			efficacy: "moderate",
			effectivenessRating: 6,
			evidenceLevel: "MODERATE",
			recommendedDose: "1200-2400mg daily",
			duration: "8-12 weeks",
			effectSize: 0.45,
			studyCount: 8,
			participantCount: 500,
			recommendationGrade: "B",
		},
		{
			condition: "Respiratory health and mucus clearance",
			polishCondition: "Zdrowie układu oddechowego i usuwanie śluzu",
			indication: "Breakdown of mucus and support for respiratory conditions",
			polishIndication: "Rozkład śluzu i wsparcie dla stanów oddechowych",
			efficacy: "high",
			effectivenessRating: 8,
			evidenceLevel: "STRONG",
			recommendedDose: "600mg daily",
			duration: "Days to weeks",
			effectSize: 0.6,
			studyCount: 7,
			participantCount: 450,
			recommendationGrade: "A",
		},
		{
			condition: "Neuroprotection",
			polishCondition: "Neuroprotekcja",
			indication: "Protection against neurodegeneration and cognitive decline",
			polishIndication: "Ochrona przed neurodegeneracją i spadkiem poznawczym",
			efficacy: "moderate",
			effectivenessRating: 4,
			evidenceLevel: "WEAK",
			recommendedDose: "1200-1800mg daily",
			duration: "Months",
			effectSize: 0.25,
			studyCount: 4,
			participantCount: 300,
			recommendationGrade: "C",
		},
	],

	// Mechanisms of action with detailed pathways
	mechanisms: [
		{
			id: "glutathione-synthesis",
			name: "Glutathione synthesis and antioxidant defense",
			polishName: "Synteza glutationu i obrona antyoksydacyjna",
			pathway: "Glutathione synthesis and antioxidant defense",
			polishPathway: "Glutathione synthesis and antioxidant defense",
			description:
				"Precursor to glutathione, the body's primary antioxidant, protecting cells from oxidative stress and free radical damage. NAC replenishes glutathione stores, especially in the liver and respiratory system.",
			polishDescription:
				"Prekursor glutationu, głównego antyoksydantu organizmu, chroniącego komórki przed stresem oksydacyjnym i uszkodzeniami wolnymi rodnikami. NAC uzupełnia zapasy glutationu, szczególnie w wątrobie i układzie oddechowym.",
			evidenceLevel: "STRONG",
			targetSystems: [
				"Antioxidant system",
				"Glutathione synthesis",
				"Cellular protection",
			],
			timeToEffect: "Days to weeks",
			duration: "Continuous protection",
		},
		{
			id: "glutamatergic-modulation",
			name: "Glutamatergic system modulation",
			polishName: "Modulacja systemu glutaminergicznego",
			pathway: "Glutamatergic system modulation",
			polishPathway: "Glutamatergic system modulation",
			description:
				"Modulates glutamate levels and supports glutamatergic neurotransmission in the brain. This mechanism underlies many of NAC's psychiatric applications and addiction treatment potential.",
			polishDescription:
				"Moduluje poziomy glutaminianu i wspiera neurotransmisję glutaminergiczną w mózgu. Ten mechanizm leży u podstaw wielu psychiatrycznych zastosowań NAC i potencjału w leczeniu uzależnień.",
			evidenceLevel: "STRONG",
			targetSystems: [
				"Glutamatergic system",
				"Psychiatric function",
				"Addiction pathways",
			],
			timeToEffect: "2-4 weeks",
			duration: "Continuous modulation",
		},
		{
			id: "anti-inflammatory",
			name: "Anti-inflammatory effects",
			polishName: "Efekty przeciwzapalne",
			pathway: "Anti-inflammatory effects",
			polishPathway: "Anti-inflammatory effects",
			description:
				"Reduces inflammation through multiple pathways including NF-κB inhibition and cytokine modulation. NAC affects inflammatory signaling at multiple levels.",
			polishDescription:
				"Redukuje zapalenie przez wiele ścieżek w tym inhibicję NF-κB i modulację cytokin. NAC wpływa na sygnalizację zapalną na wielu poziomach.",
			evidenceLevel: "STRONG",
			targetSystems: [
				"Inflammatory system",
				"NF-κB pathways",
				"Cytokine regulation",
			],
			timeToEffect: "Days to weeks",
			duration: "Continuous anti-inflammatory action",
		},
		{
			id: "mucolytic-detox",
			name: "Mucolytic and detoxification effects",
			polishName: "Efekty mucołityczne i detoksykacyjne",
			pathway: "Mucolytic and detoxification effects",
			polishPathway: "Mucolytic and detoxification effects",
			description:
				"Breaks down mucus and supports detoxification processes in the liver and respiratory system. NAC cleaves disulfide bonds in mucus, making it less viscous.",
			polishDescription:
				"Rozkłada śluz i wspiera procesy detoksykacyjne w wątrobie i układzie oddechowym. NAC rozrywa wiązania disulfidowe w śluzie, czyniąc go mniej lepko.",
			evidenceLevel: "STRONG",
			targetSystems: [
				"Respiratory system",
				"Mucus clearance",
				"Detoxification",
			],
			timeToEffect: "Hours to days",
			duration: "Continuous mucolytic action",
		},
	],

	// Comprehensive dosage guidelines
	dosageGuidelines: {
		therapeuticRange: {
			min: 600,
			max: 2400,
			unit: "mg",
		},
		timing: ["morning", "evening"],
		withFood: true,
		contraindications: ["Asthma", "Bleeding disorders"],
		polishContraindications: ["Asthma", "Zaburzenia krzepnięcia"],
		interactions: [
			{
				substance: "Activated charcoal",
				polishSubstance: "Węgiel aktywny",
				type: "antagonistic",
				severity: "severe",
				description: "Interaction between supplements",
				polishDescription: "Interakcja między suplementami",
				clinicalSignificance: "Monitor for effects",
				polishClinicalSignificance: "Monitorować efekty",
				mechanism: "Reduced absorption",
				polishMechanism: "Zmniejszone wchłanianie",
				recommendation: "Do not take together; separate by at least 2 hours",
				polishRecommendation:
					"Nie przyjmuj razem; rozdziel przez co najmniej 2 godziny",
				evidenceLevel: "MODERATE",
			},
		],
	},

	// Side effects with frequency and management
	sideEffects: [
		{
			effect: "Gastrointestinal discomfort",
			polishEffect: "Niewygodę jelitową",
			frequency: "common",
			severity: "mild",
			reversible: true,
			dosageDependent: true,
			timeToOnset: "30-60 minutes",
			management: "Take with food, reduce dose gradually",
			polishManagement: "Przyjmuj z jedzeniem, stopniowo zmniejsz dawkę",
		},
		{
			effect: "Nausea",
			polishEffect: "Nudności",
			frequency: "uncommon",
			severity: "mild",
			reversible: true,
			dosageDependent: true,
			timeToOnset: "30-60 minutes",
			management: "Take with food, reduce dose",
			polishManagement: "Przyjmuj z jedzeniem, zmniejsz dawkę",
		},
		{
			effect: "Skin rash",
			polishEffect: "Wysypkę skórną",
			frequency: "rare",
			severity: "mild",
			reversible: true,
			dosageDependent: false,
			timeToOnset: "Days to weeks",
			management: "Discontinue if allergic reaction occurs",
			polishManagement: "Odstawienie przy wystąpieniu reakcji alergicznej",
		},
		{
			effect: "Headache",
			polishEffect: "Ból głowy",
			frequency: "uncommon",
			severity: "mild",
			reversible: true,
			dosageDependent: true,
			timeToOnset: "1-2 hours",
			management: "Reduce dose, ensure adequate hydration",
			polishManagement: "Zmniejsz dawkę, zapewnij odpowiednie nawodnienie",
		},
	],

	// Supplement interactions
	interactions: [
		{
			substance: "Nitroglycerin and other nitrates",
			polishSubstance: "Nitrogliceryna i inne azotany",
			type: "synergistic",
			severity: "moderate",
			description: "Interaction between supplements",
			polishDescription: "Interakcja między suplementami",
			clinicalSignificance: "Monitor for effects",
			polishClinicalSignificance: "Monitorować efekty",
			mechanism: "Enhanced vasodilation",
			polishMechanism: "Wzmocniona wazodylacja",
			recommendation: "Monitor blood pressure when combining",
			polishRecommendation: "Monitoruj ciśnienie krwi przy łączeniu",
			evidenceLevel: "MODERATE",
		},
		{
			substance: "Activated charcoal",
			polishSubstance: "Węgiel aktywny",
			type: "antagonistic",
			clinicalSignificance: "High clinical significance - avoid combination",
			polishClinicalSignificance:
				"Wysokie znaczenie kliniczne - unikać kombinacji",
			severity: "severe",
			mechanism: "Reduced absorption",
			polishMechanism: "Zmniejszone wchłanianie",
			description: "May significantly reduce NAC absorption",
			polishDescription: "Może znacząco zmniejszyć wchłanianie NAC",
			recommendation: "Do not take together; separate by at least 2 hours",
			polishRecommendation:
				"Nie przyjmuj razem; rozdziel przez co najmniej 2 godziny",
			evidenceLevel: "STRONG",
		},
		{
			substance: "Cisplatin",
			polishSubstance: "Cysplatyna",
			type: "antagonistic",
			clinicalSignificance: "Moderate clinical significance - monitor closely",
			polishClinicalSignificance:
				"Umiarkowane znaczenie kliniczne - ścisłe monitorowanie",
			severity: "moderate",
			mechanism: "Reduced chemotherapy effectiveness",
			polishMechanism: "Zmniejszona skuteczność chemioterapii",
			description: "May reduce effectiveness of cisplatin chemotherapy",
			polishDescription: "Może zmniejszyć skuteczność chemioterapii cysplatyną",
			recommendation:
				"Avoid during cisplatin treatment unless directed by oncologist",
			polishRecommendation:
				"Unikaj podczas leczenia cysplatyną chyba że zaleci onkolog",
			evidenceLevel: "MODERATE",
		},
	],

	// Evidence level and research studies
	evidenceLevel: "STRONG",
	researchStudies: [
		{
			id: "dean-2011",
			title:
				"N-acetylcysteine in psychiatry: current therapeutic evidence and potential mechanisms of action",
			polishTitle:
				"N-acetylocysteina w psychiatrii: obecne dowody terapeutyczne i potencjalne mechanizmy działania",
			authors: ["Dean O", "Giorlando F", "Berk M"],
			journal: "Journal of Psychiatry & Neuroscience",
			year: 2011,
			studyType: "SYSTEMATIC_REVIEW",
			primaryOutcome: "Psychiatric applications",
			polishPrimaryOutcome: "Zastosowania psychiatryczne",
			findings:
				"NAC shows promise in treating various psychiatric conditions through glutamatergic modulation",
			polishFindings:
				"NAC wykazuje potencjał w leczeniu różnych stanów psychiatrycznych poprzez modulację glutaminergiczną",
			evidenceLevel: "STRONG",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "21118657",
			doi: "10.1503/jpn.100039",
			sampleSize: 0,
			qualityScore: 8.0,
		},
		{
			id: "berk-2014",
			title:
				"N-acetylcysteine as an adjunctive therapy in major depressive disorder",
			polishTitle:
				"N-acetylocysteina jako terapia wspomagająca w głównym zaburzeniu depresyjnym",
			authors: ["Berk M", "Malhi GS", "Gray LJ"],
			journal: "Journal of Clinical Psychiatry",
			year: 2014,
			studyType: "RANDOMIZED_CONTROLLED_TRIAL",
			primaryOutcome: "Depression treatment",
			polishPrimaryOutcome: "Leczenie depresji",
			findings:
				"NAC augmentation therapy showed significant antidepressant effects",
			polishFindings:
				"Terapia wzmacniająca NAC wykazała znaczące efekty antydepresyjne",
			evidenceLevel: "MODERATE",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "25004186",
			doi: "10.4088/JCP.13m08808",
			sampleSize: 75,
			duration: "16 weeks",
			dosage: "1000mg twice daily",
			qualityScore: 7.5,
		},
		{
			id: "ooi-2018",
			title: "N-acetylcysteine for the treatment of psychiatric disorders",
			polishTitle: "N-acetylocysteina w leczeniu zaburzeń psychiatrycznych",
			authors: ["Ooi SL", "Green R", "Pak SC"],
			journal: "International Journal of Molecular Sciences",
			year: 2018,
			studyType: "SYSTEMATIC_REVIEW",
			primaryOutcome: "Psychiatric treatment outcomes",
			polishPrimaryOutcome: "Wyniki leczenia psychiatrycznego",
			findings:
				"NAC demonstrates potential benefits across multiple psychiatric conditions",
			polishFindings:
				"NAC wykazuje potencjalne korzyści w wielu stanach psychiatrycznych",
			evidenceLevel: "MODERATE",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "30513809",
			doi: "10.3390/ijms19123924",
			sampleSize: 0,
			qualityScore: 7.5,
		},
		{
			id: "riordan-2004",
			title:
				"A case of chronic fatigue syndrome treated with intravenous hydrogen peroxide and N-acetylcysteine",
			polishTitle:
				"Przypadek przewlekłego zmęczenia leczony podawaniem dożylnym nadtlenku wodoru i n-acetylocysteiną",
			authors: ["Riordan NH", "Hunninghake RB", "Fourie J"],
			journal: "Journal of Orthomolecular Medicine",
			year: 2004,
			studyType: "CASE_REPORT",
			primaryOutcome: "Fatigue reduction",
			polishPrimaryOutcome: "Redukcja zmęczenia",
			findings: "NAC showed benefit for antioxidant support and detoxification",
			polishFindings:
				"NAC wykazała korzyści dla wsparcia antyoksydacyjnego i detoksykacji",
			evidenceLevel: "WEAK",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "22344880",
			sampleSize: 1,
			qualityScore: 4.0,
		},
	],

	// Metadata
	tags: [
		"amino acid",
		"antioxidant",
		"glutathione",
		"psychiatric support",
		"addiction",
		"respiratory",
		"detoxification",
		"mucolytic",
		"glutamate modulation",
	],
	lastUpdated: "2024-01-15T00:00:00Z",
	createdAt: "2024-01-15T00:00:00Z",

	// Additional fields for Prisma compatibility
	knowledgeNodeId: null,
};

export default nAcetylCysteineProfile;
