/**
 * Vitamin D3 Supplement Profile
 * Migrated from nextjs-roocode-template with enhanced T3 Stack compatibility
 * The Sunshine Vitamin with comprehensive Polish medical compliance
 */

import type { SupplementWithRelations } from "../../types/supplement";

export const vitaminD3Profile: SupplementWithRelations = {
	id: "vitamin-d3",
	name: "Vitamin D3",
	polishName: "Witamina D3",
	scientificName: "Cholecalciferol",
	commonNames: ["Cholecalciferol", "Vitamin D", "Calcitriol", "Vitamin D3"],
	polishCommonNames: [
		"Cholekalciferol",
		"Witamina D",
		"Kalcitriol",
		"Witamina D3",
	],
	category: "VITAMIN",
	description:
		"Vitamin D3 (cholecalciferol) is a fat-soluble vitamin essential for calcium absorption, bone health, immune function, and cellular processes. It is primarily synthesized in the skin upon sun exposure but can also be obtained through diet and supplementation. Vitamin D3 plays crucial roles in immune modulation, cellular growth, and bone mineralization.",
	polishDescription:
		"Witamina D3 (cholekalciferol) to rozpuszczalna w tłuszczach witamina niezbędna do wchłaniania wapnia, zdrowia kości, funkcji odpornościowych i procesów komórkowych. Jest głównie syntetyzowana w skórze po ekspozycji na słońce, ale można ją również uzyskać przez dietę i suplementację. Witamina D3 odgrywa kluczowe role w modulacji odporności, wzroście komórkowym i mineralizacji kości.",

	// Active compounds with detailed bioavailability data
	activeCompounds: [
		{
			name: "Cholecalciferol",
			polishName: "Cholekalciferol",
			concentration: "2000IU",
			bioavailability: 87,
			halfLife: "24-36 hours",
			metabolicPathway: [
				"Calcium absorption",
				"Immune function",
				"Bone metabolism",
			],
			targetReceptors: [
				"Vitamin D receptors",
				"Calcium channels",
				"Immune cells",
			],
		},
	],

	// Clinical applications with Polish translations
	clinicalApplications: [
		{
			condition: "Bone health and immune function",
			polishCondition: "Zdrowie kości i funkcje immunologiczne",
			indication:
				"Support for bone density, calcium absorption, and immune system function",
			polishIndication:
				"Wsparcie dla gęstości kości, wchłaniania wapnia i funkcji układu odpornościowego",
			efficacy: "high",
			effectivenessRating: 8,
			evidenceLevel: "STRONG",
			recommendedDose: "1000-4000IU daily",
			duration: "Months",
			effectSize: 0.65,
			studyCount: 12,
			participantCount: 2400,
			recommendationGrade: "A",
		},
		{
			condition: "Immune system support",
			polishCondition: "Wsparcie układu odpornościowego",
			indication:
				"Reduction in risk of respiratory infections and immune modulation",
			polishIndication:
				"Redukcja ryzyka infekcji dróg oddechowych i modulacja odporności",
			efficacy: "moderate",
			effectivenessRating: 8,
			evidenceLevel: "STRONG",
			recommendedDose: "2000-4000IU daily",
			duration: "Months",
			effectSize: 0.3,
			studyCount: 8,
			participantCount: 1500,
			recommendationGrade: "A",
		},
		{
			condition: "Mood and depression support",
			polishCondition: "Wsparcie nastroju i depresji",
			indication:
				"Potential support for mood disorders and seasonal affective disorder",
			polishIndication:
				"Potencjalne wsparcie dla zaburzeń nastroju i sezonowego zaburzenia afektywnego",
			efficacy: "moderate",
			effectivenessRating: 6,
			evidenceLevel: "MODERATE",
			recommendedDose: "2000-4000IU daily",
			duration: "8-12 weeks",
			effectSize: 0.25,
			studyCount: 6,
			participantCount: 600,
			recommendationGrade: "B",
		},
		{
			condition: "Cardiovascular health",
			polishCondition: "Zdrowie sercowo-naczyniowe",
			indication:
				"Support for blood pressure regulation and cardiovascular function",
			polishIndication:
				"Wsparcie dla regulacji ciśnienia krwi i funkcji sercowo-naczyniowej",
			efficacy: "low",
			effectivenessRating: 4,
			evidenceLevel: "WEAK",
			recommendedDose: "2000-4000IU daily",
			duration: "6-12 months",
			effectSize: 0.15,
			studyCount: 4,
			participantCount: 800,
			recommendationGrade: "C",
		},
		{
			condition: "Autoimmune disease prevention",
			polishCondition: "Profilaktyka chorób autoimmunologicznych",
			indication: "Potential role in preventing autoimmune conditions",
			polishIndication:
				"Potencjalna rola w zapobieganiu chorobom autoimmunologicznym",
			efficacy: "low",
			effectivenessRating: 4,
			evidenceLevel: "WEAK",
			recommendedDose: "2000-4000IU daily",
			duration: "Years",
			effectSize: 0.2,
			studyCount: 3,
			participantCount: 400,
			recommendationGrade: "C",
		},
	],

	// Mechanisms of action with detailed pathways
	mechanisms: [
		{
			id: "vdr-activation",
			name: "Vitamin D receptor activation and calcium homeostasis",
			polishName: "Aktywacja receptorów witaminy D i homeostaza wapnia",
			pathway: "Vitamin D receptor activation and calcium homeostasis",
			polishPathway: "Vitamin D receptor activation and calcium homeostasis",
			description:
				"Vitamin D3 activates vitamin D receptors throughout the body, regulating calcium absorption and immune function. This is the primary mechanism for bone health and mineralization.",
			polishDescription:
				"Witamina D3 aktywuje receptory witaminy D w całym organizmie, regulując wchłanianie wapnia i funkcję odpornościową. To jest główny mechanizm dla zdrowia kości i mineralizacji.",
			evidenceLevel: "STRONG",
			targetSystems: [
				"Bone metabolism",
				"Calcium absorption",
				"Immune function",
			],
			timeToEffect: "Weeks to months",
			duration: "Continuous regulation",
		},
		{
			id: "immune-modulation",
			name: "Immune system modulation",
			polishName: "Modulacja układu odpornościowego",
			pathway: "Immune system modulation",
			polishPathway: "Immune system modulation",
			description:
				"Vitamin D3 modulates both innate and adaptive immune responses, supporting immune function and reducing inflammatory responses. It enhances antimicrobial peptide production.",
			polishDescription:
				"Witamina D3 moduluje zarówno wrodzone, jak i adaptacyjne odpowiedzi odpornościowe, wspierając funkcję odpornościową i redukując odpowiedzi zapalne. Wzmacnia produkcję peptydów przeciwbakteryjnych.",
			evidenceLevel: "STRONG",
			targetSystems: [
				"Innate immunity",
				"Adaptive immunity",
				"Inflammatory response",
			],
			timeToEffect: "Weeks to months",
			duration: "Continuous immune support",
		},
		{
			id: "cellular-growth",
			name: "Cellular growth and differentiation",
			polishName: "Wzrost i różnicowanie komórek",
			pathway: "Cellular growth and differentiation",
			polishPathway: "Cellular growth and differentiation",
			description:
				"Regulates cellular growth, differentiation, and apoptosis through vitamin D receptors in various tissues. This affects cellular processes throughout the body.",
			polishDescription:
				"Reguluje wzrost komórkowy, różnicowanie i apoptozę poprzez receptory witaminy D w różnych tkankach. Wpływa to na procesy komórkowe w całym organizmie.",
			evidenceLevel: "MODERATE",
			targetSystems: ["Cellular growth", "Differentiation", "Apoptosis"],
			timeToEffect: "Months",
			duration: "Continuous cellular regulation",
		},
		{
			id: "cardiovascular",
			name: "Cardiovascular system support",
			polishName: "Wsparcie układu sercowo-naczyniowego",
			pathway: "Cardiovascular system support",
			polishPathway: "Cardiovascular system support",
			description:
				"Influences cardiovascular health through regulation of blood pressure, vascular function, and inflammatory pathways. May support endothelial function.",
			polishDescription:
				"Wpływa na zdrowie sercowo-naczyniowe poprzez regulację ciśnienia krwi, funkcji naczyń i ścieżek zapalnych. Może wspierać funkcję śródbłonka.",
			evidenceLevel: "WEAK",
			targetSystems: [
				"Blood pressure",
				"Vascular function",
				"Cardiovascular health",
			],
			timeToEffect: "Months",
			duration: "Long-term cardiovascular support",
		},
	],

	// Comprehensive dosage guidelines
	dosageGuidelines: {
		therapeuticRange: {
			min: 1000,
			max: 4000,
			unit: "IU",
		},
		timing: ["morning"],
		withFood: true,
		contraindications: [
			"Hypercalcemia",
			"Hyperparathyroidism",
			"Sarcoidosis",
			"Other granulomatous diseases",
		],
		polishContraindications: [
			"Nadciśnienie wapniowe",
			"Nadczynność przytarczyc",
			"Zespół Sarcoidoza",
			"Inne choroby granulomatyczne",
		],
		interactions: [
			{
				substance: "Thiazide diuretics",
				polishSubstance: "Diuretyki tiazydowe",
				type: "antagonistic",
				severity: "moderate",
				description: "Interaction between supplements",
				polishDescription: "Interakcja między suplementami",
				clinicalSignificance: "Monitor for effects",
				polishClinicalSignificance: "Monitorować efekty",
				mechanism: "Increased risk of hypercalcemia",
				polishMechanism: "Zwiększone ryzyko nadciśnienia wapniowego",
				recommendation: "Monitor calcium levels when combining",
				polishRecommendation: "Monitoruj poziomy wapnia przy łączeniu",
				evidenceLevel: "MODERATE",
			},
		],
	},

	// Side effects with frequency and management
	sideEffects: [
		{
			effect: "Hypercalcemia",
			polishEffect: "Nadciśnienie wapniowe",
			frequency: "rare",
			severity: "severe",
			reversible: true,
			dosageDependent: true,
			timeToOnset: "Weeks to months",
			management: "Discontinue use, monitor calcium levels, hydration",
			polishManagement: "Odstawienie, monitoruj poziomy wapnia, nawodnienie",
		},
		{
			effect: "Gastrointestinal discomfort",
			polishEffect: "Niewygodę jelitową",
			frequency: "uncommon",
			severity: "mild",
			reversible: true,
			dosageDependent: true,
			timeToOnset: "30-60 minutes",
			management: "Take with food, reduce dose if needed",
			polishManagement: "Przyjmuj z jedzeniem, zmniejsz dawkę jeśli potrzeba",
		},
		{
			effect: "Fatigue",
			polishEffect: "Zmęczenie",
			frequency: "rare",
			severity: "mild",
			reversible: true,
			dosageDependent: true,
			timeToOnset: "Days to weeks",
			management: "Reduce dose, monitor response",
			polishManagement: "Zmniejsz dawkę, monitoruj odpowiedź",
		},
	],

	// Supplement interactions
	interactions: [
		{
			substance: "Calcium supplements",
			polishSubstance: "Suplementy wapnia",
			type: "synergistic",
			severity: "moderate",
			description: "Interaction between supplements",
			polishDescription: "Interakcja między suplementami",
			clinicalSignificance: "Monitor for effects",
			polishClinicalSignificance: "Monitorować efekty",
			mechanism: "Enhanced calcium absorption",
			polishMechanism: "Wzmocnione wchłanianie wapnia",
			recommendation: "Monitor total calcium intake to avoid hypercalcemia",
			polishRecommendation:
				"Monitoruj całkowite spożycie wapnia, by uniknąć nadciśnienia wapniowego",
			evidenceLevel: "STRONG",
		},
		{
			substance: "Thiazide diuretics",
			polishSubstance: "Diuretyki tiazydowe",
			type: "antagonistic",
			clinicalSignificance: "Moderate clinical significance - monitor closely",
			polishClinicalSignificance:
				"Umiarkowane znaczenie kliniczne - ścisłe monitorowanie",
			severity: "moderate",
			mechanism: "Increased risk of hypercalcemia",
			polishMechanism: "Zwiększone ryzyko nadciśnienia wapniowego",
			description:
				"May increase risk of hypercalcemia when combined with vitamin D",
			polishDescription:
				"Może zwiększyć ryzyko nadciśnienia wapniowego przy łączeniu z witaminą D",
			recommendation: "Monitor calcium levels when combining",
			polishRecommendation: "Monitoruj poziomy wapnia przy łączeniu",
			evidenceLevel: "MODERATE",
		},
		{
			substance: "Phenytoin and phenobarbital",
			polishSubstance: "Fenytoina i fenobarbital",
			type: "antagonistic",
			clinicalSignificance: "Moderate clinical significance - monitor closely",
			polishClinicalSignificance:
				"Umiarkowane znaczenie kliniczne - ścisłe monitorowanie",
			severity: "moderate",
			mechanism: "Reduced vitamin D effectiveness",
			polishMechanism: "Zmniejszona skuteczność witaminy D",
			description:
				"May reduce vitamin D effectiveness through enzyme induction",
			polishDescription:
				"Może zmniejszyć skuteczność witaminy D poprzez indukcję enzymów",
			recommendation: "Monitor vitamin D levels and adjust dosage if needed",
			polishRecommendation:
				"Monitoruj poziomy witaminy D i dostosuj dawkowanie jeśli potrzeba",
			evidenceLevel: "MODERATE",
		},
	],

	// Evidence level and research studies
	evidenceLevel: "STRONG",
	researchStudies: [
		{
			id: "martineau-2017",
			title:
				"Vitamin D supplementation to prevent acute respiratory tract infections: systematic review and meta-analysis of individual participant data",
			polishTitle:
				"Suplementacja witaminą D w celu zapobiegania ostrym infekcjom dróg oddechowych: przegląd systematyczny i analiza meta danych poszczególnych uczestników",
			authors: ["Martineau AR", "Jolliffe DA", "Hooper RL"],
			journal: "BMJ",
			year: 2017,
			studyType: "SYSTEMATIC_REVIEW",
			primaryOutcome: "Respiratory infection prevention",
			polishPrimaryOutcome: "Profilaktyka infekcji dróg oddechowych",
			findings:
				"Vitamin D supplementation reduced the risk of acute respiratory tract infections",
			polishFindings:
				"Suplementacja witaminą D zmniejszyła ryzyko ostrych infekcji dróg oddechowych",
			evidenceLevel: "STRONG",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "28202713",
			doi: "10.1136/bmj.i6583",
			sampleSize: 11321,
			qualityScore: 9.0,
		},
		{
			id: "bolland-2014",
			title:
				"Vitamin D and bone health: an evidence-based analysis for the Endocrine Society clinical practice guidelines",
			polishTitle:
				"Witamina D i zdrowie kości: analiza oparta na faktach dla wytycznych praktyki klinicznej Towarzystwa Endokrynologicznego",
			authors: ["Bolland MJ", "Grey A", "Gamble GD", "Reid IR"],
			journal: "Journal of Bone and Mineral Research",
			year: 2014,
			studyType: "SYSTEMATIC_REVIEW",
			primaryOutcome: "Bone health outcomes",
			polishPrimaryOutcome: "Wyniki zdrowia kości",
			findings:
				"Vitamin D supplementation improves bone mineral density and reduces fracture risk",
			polishFindings:
				"Suplementacja witaminą D poprawia gęstość mineralną kości i zmniejsza ryzyko złamań",
			evidenceLevel: "STRONG",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "24682727",
			doi: "10.1002/jbmr.2240",
			sampleSize: 0,
			qualityScore: 8.5,
		},
		{
			id: "vacek-2012",
			title:
				"Vitamin D deficiency and supplementation and relation to cardiovascular health",
			polishTitle:
				"Niedobór witaminy D i suplementacja a relacja do zdrowia sercowo-naczyniowego",
			authors: ["Vacek JL", "Vasu S", "Grewal J", "Umland MM"],
			journal: "American Journal of Cardiology",
			year: 2012,
			studyType: "SYSTEMATIC_REVIEW",
			primaryOutcome: "Cardiovascular health",
			polishPrimaryOutcome: "Zdrowie sercowo-naczyniowe",
			findings:
				"Vitamin D deficiency is associated with increased cardiovascular risk",
			polishFindings:
				"Niedobór witaminy D jest związany ze zwiększonym ryzykiem sercowo-naczyniowym",
			evidenceLevel: "MODERATE",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "22325678",
			doi: "10.1016/j.amjcard.2011.12.015",
			sampleSize: 0,
			qualityScore: 7.0,
		},
		{
			id: "angell-2013",
			title: "Vitamin D and the cardiovascular system",
			polishTitle: "Witamina D i układ sercowo-naczyniowy",
			authors: ["Angell SY", "Levi M", "Schulman SP"],
			journal: "Journal of Investigative Medicine",
			year: 2013,
			studyType: "SYSTEMATIC_REVIEW",
			primaryOutcome: "Cardiovascular system effects",
			polishPrimaryOutcome: "Efekty na układ sercowo-naczyniowy",
			findings:
				"Vitamin D may have beneficial effects on cardiovascular health",
			polishFindings:
				"Witamina D może mieć korzystne efekty na zdrowie sercowo-naczyniowe",
			evidenceLevel: "WEAK",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "23385839",
			doi: "10.2310/6650.2012.12012",
			sampleSize: 0,
			qualityScore: 6.0,
		},
	],

	// Metadata
	tags: [
		"vitamin",
		"bone health",
		"immune system",
		"calcium",
		"d3",
		"cholecalciferol",
		"sunshine vitamin",
	],
	lastUpdated: "2024-01-15T00:00:00Z",
	createdAt: "2024-01-15T00:00:00Z",

	// Additional fields for Prisma compatibility
	knowledgeNodeId: null,
};

export const vitaminD3Data = vitaminD3Profile;
export default vitaminD3Profile;
