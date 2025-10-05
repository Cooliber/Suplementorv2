/**
 * Rhodiola Rosea Supplement Profile
 * Adaptogenic herb with cognitive and physical performance benefits
 */

import type { SupplementWithRelations } from "../../types/supplement";

export const rhodiolaRoseaProfile: SupplementWithRelations = {
	id: "rhodiola-rosea",
	name: "Rhodiola Rosea",
	polishName: "Rhodiola różowa",
	scientificName: "Rhodiola rosea",
	commonNames: ["Arctic root", "Golden root", "Rosenroot"],
	polishCommonNames: ["Korzeń arktyczny", "Złoty korzeń", "Różanka"],
	category: "ADAPTOGEN",
	description:
		"Rhodiola rosea is an adaptogenic herb traditionally used in Arctic regions to increase physical and mental performance, reduce fatigue, and enhance resilience to stress. It contains active compounds called rosavins and salidroside that modulate neurotransmitter systems and support stress response.",
	polishDescription:
		"Rhodiola różowa to adaptogeniczne zioło tradycyjnie stosowane w rejonach arktycznych w celu poprawy wydajności fizycznej i psychicznej, zmniejszenia zmęczenia i wzmocnienia odporności na stres. Zawiera aktywne związki zwane rosawinami i salidrozydą, które modyfikują systemy neuroprzekaźników i wspierają odpowiedź na stres.",

	// Active compounds with detailed bioavailability data
	activeCompounds: [
		{
			name: "Rosavins (mixture)",
			polishName: "Rosawiny (mieszanina)",
			concentration: "3-5%",
			bioavailability: 65,
			halfLife: "4-6 hours",
			metabolicPathway: ["Stress response", "Neurotransmitter modulation"],
			targetReceptors: ["Cortisol receptors", "Adrenaline receptors"],
		},
		{
			name: "Salidroside",
			polishName: "Salidrozyd",
			concentration: "1-2%",
			bioavailability: 70,
			halfLife: "6-8 hours",
			metabolicPathway: ["Antioxidant pathways", "Neuroprotection"],
			targetReceptors: ["Dopamine receptors", "Adenosine receptors"],
		},
	],

	// Clinical applications with Polish translations
	clinicalApplications: [
		{
			condition: "Stress and anxiety",
			polishCondition: "Stres i lęk",
			indication:
				"Reduces stress hormones and anxiety symptoms through adaptogenic effects",
			polishIndication:
				"Redukuje hormony stresu i objawy lęku dzięki efektom adaptogennym",
			efficacy: "high",
			effectivenessRating: 8,
			evidenceLevel: "STRONG",
			recommendedDose: "200-400mg daily standardized to 3% rosavins",
			duration: "4-6 weeks",
			effectSize: 0.4,
			studyCount: 15,
			participantCount: 1200,
			recommendationGrade: "A",
		},
		{
			condition: "Fatigue and physical performance",
			polishCondition: "Zmęczenie i wydajność fizyczna",
			indication:
				"Improves physical performance, reduces fatigue, and enhances endurance",
			polishIndication:
				"Poprawia wydajność fizyczną, zmniejsza zmęczenie i zwiększa wytrzymałość",
			efficacy: "high",
			effectivenessRating: 8,
			evidenceLevel: "STRONG",
			recommendedDose: "200-600mg daily",
			duration: "2-4 weeks",
			effectSize: 0.5,
			studyCount: 12,
			participantCount: 800,
			recommendationGrade: "A",
		},
		{
			condition: "Mild to moderate depression",
			polishCondition: "Lekka do umiarkowanej depresji",
			indication: "Supports mood and may have mild antidepressant effects",
			polishIndication:
				"Wspiera nastrój i może mieć łagodne właściwości antydepresyjne",
			efficacy: "moderate",
			effectivenessRating: 6,
			evidenceLevel: "MODERATE",
			recommendedDose: "300-600mg daily",
			duration: "6-8 weeks",
			effectSize: 0.3,
			studyCount: 8,
			participantCount: 500,
			recommendationGrade: "B",
		},
		{
			condition: "Cognitive function and mental clarity",
			polishCondition: "Funkcja poznawcza i klarowność mentalna",
			indication:
				"May improve concentration, memory, and mental performance under stress",
			polishIndication:
				"Może poprawić koncentrację, pamięć i wydajność mentalną pod presją",
			efficacy: "moderate",
			effectivenessRating: 6,
			evidenceLevel: "MODERATE",
			recommendedDose: "200-400mg daily",
			duration: "4-6 weeks",
			effectSize: 0.25,
			studyCount: 6,
			participantCount: 400,
			recommendationGrade: "B",
		},
	],

	// Mechanisms of action with detailed pathways
	mechanisms: [
		{
			id: "stress-response",
			name: "Stress response modulation",
			polishName: "Modulacja odpowiedzi na stres",
			pathway: "HPA axis regulation",
			polishPathway: "HPA axis regulation",
			description:
				"Rhodiola modulates the hypothalamic-pituitary-adrenal (HPA) axis, reducing cortisol levels and counteracting the negative effects of chronic stress on the body and brain.",
			polishDescription:
				"Rhodiola modyfikuje oś podwzgórze-przysadka-nadnercze (HPA), zmniejszając poziom kortyzolu i przeciwdziałając negatywnym skutkom przewlekłego stresu na ciało i mózg.",
			evidenceLevel: "STRONG",
			targetSystems: [
				"HPA axis",
				"Stress hormones",
				"Neurotransmitter balance",
			],
			timeToEffect: "1-2 weeks",
			duration: "Sustained stress adaptation",
		},
		{
			id: "neurotransmitter",
			name: "Neurotransmitter optimization",
			polishName: "Optymalizacja neuroprzekaźników",
			pathway: "Dopamine and serotonin pathways",
			polishPathway: "Dopamine and serotonin pathways",
			description:
				"Rhodiola may increase dopamine and serotonin levels, contributing to improved mood and reduced anxiety.",
			polishDescription:
				"Rhodiola może zwiększać poziom dopaminy i serotoniny, przyczyniając się do poprawy nastroju i zmniejszenia lęku.",
			evidenceLevel: "MODERATE",
			targetSystems: ["Dopamine system", "Serotonin system", "Mood regulation"],
			timeToEffect: "2-4 weeks",
			duration: "Ongoing neurotransmitter support",
		},
		{
			id: "antioxidant",
			name: "Antioxidant and neuroprotective effects",
			polishName: "Efekty antyoksydacyjne i neuroprotekcyjne",
			pathway: "Oxidative stress reduction",
			polishPathway: "Oxidative stress reduction",
			description:
				"Contains compounds that reduce oxidative stress and protect neurons from damage, supporting long-term brain health.",
			polishDescription:
				"Zawiera związki, które redukują stres oksydacyjny i chronią neurony przed uszkodzeniami, wspierając długoterminowe zdrowie mózgu.",
			evidenceLevel: "MODERATE",
			targetSystems: [
				"Antioxidant defense",
				"Neuroprotection",
				"Cellular health",
			],
			timeToEffect: "4-8 weeks",
			duration: "Long-term protection",
		},
		{
			id: "energy-metabolism",
			name: "Cellular energy metabolism",
			polishName: "Metabolizm energii komórkowej",
			pathway: "ATP production and oxygen utilization",
			polishPathway: "ATP production and oxygen utilization",
			description:
				"Enhances cellular energy production and oxygen utilization, contributing to improved physical and mental performance.",
			polishDescription:
				"Wzmacnia produkcję energii komórkowej i wykorzystanie tlenu, przyczyniając się do poprawy wydajności fizycznej i psychicznej.",
			evidenceLevel: "STRONG",
			targetSystems: [
				"Cellular energy",
				"Oxygen utilization",
				"Mitochondrial function",
			],
			timeToEffect: "1-2 weeks",
			duration: "Continuous energy support",
		},
	],

	// Comprehensive dosage guidelines
	dosageGuidelines: {
		therapeuticRange: {
			min: 200,
			max: 600,
			unit: "mg",
		},
		timing: ["morning", "before physical activity"],
		withFood: true,
		contraindications: [
			"Autoimmune conditions",
			"Bipolar disorder",
			"Medications affecting blood pressure",
		],
		polishContraindications: [
			"Zaburzenia autoimmunologiczne",
			"Zaburzenia dwubiegunowe",
			"Leki wpływające na ciśnienie krwi",
		],
		interactions: [
			{
				substance: "Stimulants",
				polishSubstance: "Stymulanty",
				type: "additive",
				severity: "moderate",
				description: "Interaction between supplements",
				polishDescription: "Interakcja między suplementami",
				clinicalSignificance: "Monitor for effects",
				polishClinicalSignificance: "Monitorować efekty",
				mechanism: "May enhance stimulant effects",
				polishMechanism: "Może wzmocnić działanie stymulantów",
				recommendation: "Reduce stimulant doses when combining",
				polishRecommendation: "Zmniejsz dawki stymulantów przy łączeniu",
				evidenceLevel: "WEAK",
			},
		],
	},

	// Side effects with frequency and management
	sideEffects: [
		{
			effect: "Overstimulation",
			polishEffect: "Nadmierne pobudzenie",
			frequency: "uncommon",
			severity: "mild",
			reversible: true,
			dosageDependent: true,
			timeToOnset: "Hours after consumption",
			management: "Reduce dose or take in morning only",
			polishManagement: "Zmniejsz dawkę lub przyjmuj tylko rano",
		},
		{
			effect: "Insomnia",
			polishEffect: "Bezsenność",
			frequency: "uncommon",
			severity: "moderate",
			reversible: true,
			dosageDependent: true,
			timeToOnset: "Hours after consumption",
			management: "Avoid taking in evening hours",
			polishManagement: "Nie przyjmuj w godzinach wieczornych",
		},
		{
			effect: "Dizziness",
			polishEffect: "Zawroty głowy",
			frequency: "rare",
			severity: "mild",
			reversible: true,
			dosageDependent: true,
			timeToOnset: "30-60 minutes",
			management: "Start with lower doses, take with food",
			polishManagement: "Rozpocznij od niższych dawek, przyjmuj z posiłkiem",
		},
	],

	// Supplement interactions
	interactions: [
		{
			substance: "Stimulants",
			polishSubstance: "Stymulanty",
			type: "additive",
			severity: "moderate",
			description: "Interaction between supplements",
			polishDescription: "Interakcja między suplementami",
			clinicalSignificance: "Monitor for effects",
			polishClinicalSignificance: "Monitorować efekty",
			mechanism: "May enhance stimulant effects and cause overstimulation",
			polishMechanism:
				"Może wzmocnić działanie stymulantów i powodować nadmierne pobudzenie",
			recommendation:
				"Monitor effects and reduce stimulant doses when combining",
			polishRecommendation:
				"Monitoruj efekty i zmniejsz dawki stymulantów przy łączeniu",
			evidenceLevel: "WEAK",
		},
		{
			substance: "Blood pressure medications",
			polishSubstance: "Leki na ciśnienie krwi",
			type: "additive",
			clinicalSignificance:
				"Minor clinical significance - generally safe with monitoring",
			polishClinicalSignificance:
				"Niewielkie znaczenie kliniczne - ogólnie bezpieczne z monitorowaniem",
			severity: "minor",
			mechanism: "May have additive effects on blood pressure regulation",
			polishMechanism: "Może mieć addytywne efekty na regulację ciśnienia krwi",
			description: "May potentiate the effects of blood pressure medications",
			polishDescription: "Może wzmocnić efekty leków na ciśnienie krwi",
			recommendation: "Monitor blood pressure closely when combining",
			polishRecommendation: "Ściśle monitoruj ciśnienie krwi przy łączeniu",
			evidenceLevel: "WEAK",
		},
	],

	// Evidence level and research studies
	evidenceLevel: "STRONG",
	researchStudies: [
		{
			id: "panossian-2010",
			title:
				"Effects of adaptogens on the central nervous system and the molecular mechanisms associated with their stress-protective activity",
			polishTitle:
				"Efekty adaptogenów na ośrodkowy układ nerwowy i molekularne mechanizmy związane z ich aktywnością ochronną przed stresem",
			authors: ["Panossian A", "Wikman G"],
			journal: "Pharmaceutical Biology",
			year: 2010,
			studyType: "SYSTEMATIC_REVIEW",
			primaryOutcome: "Stress adaptation and cognitive function",
			polishPrimaryOutcome: "Adaptacja do stresu i funkcja poznawcza",
			findings:
				"Adaptogens like Rhodiola significantly improve stress adaptation and cognitive performance",
			polishFindings:
				"Adaptogeny jak Rhodiola znacząco poprawiają adaptację do stresu i wydajność poznawczą",
			evidenceLevel: "STRONG",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "20148816",
			doi: "10.3109/13885357.2009.448484",
			sampleSize: 0,
			qualityScore: 8.5,
		},
		{
			id: "kumar-2017",
			title: "Rhodiola rosea: A phytomedicinal overview",
			polishTitle: "Rhodiola różowa: przegląd fitomedyczny",
			authors: ["Kumar A", "Mishra A", "Vaidya B", "Chamoli D"],
			journal: "Journal of Pharmacy and Bioallied Sciences",
			year: 2017,
			studyType: "SYSTEMATIC_REVIEW",
			primaryOutcome: "Adaptogenic and neuroprotective effects",
			polishPrimaryOutcome: "Efekty adaptogenne i neuroprotekcyjne",
			findings:
				"Rhodiola shows significant adaptogenic, anti-fatigue, and neuroprotective effects",
			polishFindings:
				"Rhodiola wykazuje znaczące efekty adaptogenne, przeciwzmęczeniowe i neuroprotekcyjne",
			evidenceLevel: "STRONG",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "28819010",
			doi: "10.4103/0975-7406.213421",
			sampleSize: 0,
			qualityScore: 8.0,
		},
		{
			id: "waldmann-2023",
			title:
				"The effectiveness of Rhodiola rosea in the treatment of stress-related fatigue: a systematic review and meta-analysis",
			polishTitle:
				"Skuteczność Rhodioli różowej w leczeniu zmęczenia związanego ze stresem: przegląd systematyczny i metaanaliza",
			authors: ["Waldmann A", "Kempf K", "Rohn S"],
			journal: "Phytomedicine",
			year: 2023,
			studyType: "META_ANALYSIS",
			primaryOutcome: "Fatigue reduction",
			polishPrimaryOutcome: "Redukcja zmęczenia",
			findings: "Significant reduction in fatigue scores compared to placebo",
			polishFindings:
				"Znaczące zmniejszenie wyników zmęczenia w porównaniu z placebo",
			evidenceLevel: "STRONG",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "36577513",
			doi: "10.1016/j.phymed.2022.154628",
			sampleSize: 0,
			qualityScore: 9.0,
		},
	],

	// Metadata
	tags: [
		"adaptogen",
		"stress",
		"energy",
		"cognition",
		"fatigue",
		"depression",
		"physical performance",
		"neurotransmitter",
	],
	lastUpdated: "2024-01-15T00:00:00Z",
	createdAt: "2024-01-15T00:00:00Z",

	// Additional fields for Prisma compatibility
	knowledgeNodeId: null,
};

export const rhodiolaRosea = rhodiolaRoseaProfile;
export default rhodiolaRoseaProfile;
