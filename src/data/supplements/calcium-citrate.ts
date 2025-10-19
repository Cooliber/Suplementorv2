/**
 * Calcium Citrate Supplement Profile
 * Highly bioavailable form of calcium for bone health, muscle function, and cardiovascular support
 * Comprehensive profile with Polish medical compliance
 */

import type { SupplementWithRelations } from "../../types/supplement";

export const calciumCitrateProfile: SupplementWithRelations = {
	id: "calcium-citrate",
	name: "Calcium Citrate",
	polishName: "Cytrynian wapnia",
	scientificName: "Calcium citrate",
	commonNames: [
		"Calcium citrate",
		"Citrate calcium",
		"Bioavailable calcium",
		"Calcium citrate malate",
		"CCM calcium",
	],
	polishCommonNames: [
		"Cytrynian wapnia",
		"Wapń cytrynianowy",
		"Biodostępny wapń",
		"Cytrynian jabłczan wapnia",
		"Wapń CCM",
	],
	category: "MINERAL",
	description:
		"Calcium citrate is a highly bioavailable form of calcium that supports bone health, muscle function, nerve transmission, and cardiovascular health. It offers excellent absorption, particularly when taken without food, and is well-tolerated with minimal gastrointestinal side effects.",
	polishDescription:
		"Cytrynian wapnia to wysoce biodostępna forma wapnia, która wspiera zdrowie kości, funkcję mięśni, transmisję nerwową i zdrowie sercowo-naczyniowe. Oferuje doskonałe wchłanianie, szczególnie gdy przyjmowany bez jedzenia, i jest dobrze tolerowany przy minimalnych skutkach ubocznych ze strony przewodu pokarmowego.",

	// Active compounds with detailed bioavailability data
	activeCompounds: [
		{
			name: "Calcium citrate",
			polishName: "Cytrynian wapnia",
			concentration: "500mg",
			bioavailability: 40,
			halfLife: "4-6 hours",
			metabolicPathway: [
				"Intestinal absorption",
				"Bone mineralization",
				"Cellular signaling",
			],
			targetReceptors: [
				"Calcium channels",
				"Calmodulin",
				"Vitamin D receptors",
			],
		},
		{
			name: "Elemental calcium",
			polishName: "Wapń pierwiastkowy",
			concentration: "105mg",
			bioavailability: 45,
			halfLife: "4-6 hours",
			metabolicPathway: [
				"Active transport",
				"Passive diffusion",
				"Bone incorporation",
			],
			targetReceptors: ["Calcium-sensing receptors", "Ion channels"],
		},
	],

	// Clinical applications with Polish translations
	clinicalApplications: [
		{
			condition: "Osteoporosis prevention",
			polishCondition: "Zapobieganie osteoporozie",
			indication: "Bone density maintenance and fracture prevention",
			polishIndication: "Utrzymanie gęstości kości i zapobieganie złamaniom",
			efficacy: "high",
			effectivenessRating: 8,
			evidenceLevel: "STRONG",
			recommendedDose: "500-1000mg elemental calcium daily",
			duration: "Long-term supplementation",
			effectSize: 0.5,
			studyCount: 50,
			participantCount: 15000,
			recommendationGrade: "A",
		},
		{
			condition: "Bone health maintenance",
			polishCondition: "Utrzymanie zdrowia kości",
			indication: "Daily calcium requirements and bone mineralization",
			polishIndication: "Dzienne zapotrzebowanie na wapń i mineralizacja kości",
			efficacy: "high",
			effectivenessRating: 8,
			evidenceLevel: "STRONG",
			recommendedDose: "500-800mg elemental calcium daily",
			duration: "Ongoing supplementation",
			effectSize: 0.4,
			studyCount: 40,
			participantCount: 10000,
			recommendationGrade: "A",
		},
		{
			condition: "Muscle function",
			polishCondition: "Funkcja mięśni",
			indication: "Muscle contraction and cramp prevention",
			polishIndication: "Skurcz mięśni i zapobieganie skurczom",
			efficacy: "moderate",
			effectivenessRating: 7,
			evidenceLevel: "MODERATE",
			recommendedDose: "400-600mg elemental calcium daily",
			duration: "Ongoing for muscle support",
			effectSize: 0.35,
			studyCount: 20,
			participantCount: 3000,
			recommendationGrade: "B",
		},
		{
			condition: "Cardiovascular health",
			polishCondition: "Zdrowie sercowo-naczyniowe",
			indication: "Blood pressure regulation and vascular health",
			polishIndication: "Regulacja ciśnienia krwi i zdrowie naczyń",
			efficacy: "moderate",
			effectivenessRating: 6,
			evidenceLevel: "MODERATE",
			recommendedDose: "500-800mg elemental calcium daily",
			duration: "Long-term cardiovascular support",
			effectSize: 0.25,
			studyCount: 25,
			participantCount: 8000,
			recommendationGrade: "B",
		},
		{
			condition: "PMS symptom relief",
			polishCondition: "Łagodzenie objawów PMS",
			indication: "Premenstrual syndrome symptom management",
			polishIndication:
				"Zarządzanie objawami zespołu napięcia przedmiesiączkowego",
			efficacy: "moderate",
			effectivenessRating: 6,
			evidenceLevel: "MODERATE",
			recommendedDose: "500-600mg elemental calcium daily",
			duration: "Throughout menstrual cycle",
			effectSize: 0.3,
			studyCount: 15,
			participantCount: 2000,
			recommendationGrade: "B",
		},
	],

	// Mechanisms of action with detailed pathways
	mechanisms: [
		{
			id: "bone-mineralization",
			name: "Bone mineralization and density maintenance",
			polishName: "Mineralizacja kości i utrzymanie gęstości",
			pathway: "Bone remodeling",
			polishPathway: "Remodeling kości",
			description:
				"Calcium is essential for bone mineralization, working with vitamin D and phosphorus to maintain bone density and prevent osteoporosis. It supports osteoblast activity and bone formation.",
			polishDescription:
				"Wapń jest niezbędny do mineralizacji kości, współpracując z witaminą D i fosforem w utrzymaniu gęstości kości i zapobieganiu osteoporozie. Wspiera aktywność osteoblastów i tworzenie kości.",
			evidenceLevel: "STRONG",
			targetSystems: ["Skeletal system", "Bone metabolism", "Osteoblasts"],
			timeToEffect: "2-4 weeks",
			duration: "Chronic supplementation required",
		},
		{
			id: "muscle-contraction",
			name: "Muscle contraction and nerve transmission",
			polishName: "Skurcz mięśni i transmisja nerwowa",
			pathway: "Calcium signaling",
			polishPathway: "Sygnalizacja wapniowa",
			description:
				"Calcium ions are essential for muscle contraction, nerve impulse transmission, and neurotransmitter release. They act as intracellular messengers in numerous physiological processes.",
			polishDescription:
				"Jony wapnia są niezbędne do skurczu mięśni, transmisji impulsów nerwowych i uwalniania neurotransmiterów. Działają jako wewnątrzkomórkowe przekaźniki w licznych procesach fizjologicznych.",
			evidenceLevel: "STRONG",
			targetSystems: [
				"Muscular system",
				"Nervous system",
				"Neuromuscular junction",
			],
			timeToEffect: "30-60 minutes",
			duration: "Ongoing for physiological functions",
		},
		{
			id: "cardiovascular-function",
			name: "Cardiovascular function and blood pressure regulation",
			polishName: "Funkcja sercowo-naczyniowa i regulacja ciśnienia krwi",
			pathway: "Vascular smooth muscle",
			polishPathway: "Gładkie mięśnie naczyniowe",
			description:
				"Calcium supports vascular smooth muscle contraction and cardiac muscle function, contributing to blood pressure regulation and cardiovascular health.",
			polishDescription:
				"Wapń wspiera skurcz mięśni gładkich naczyń i funkcję mięśnia sercowego, przyczyniając się do regulacji ciśnienia krwi i zdrowia sercowo-naczyniowego.",
			evidenceLevel: "MODERATE",
			targetSystems: [
				"Cardiovascular system",
				"Vascular smooth muscle",
				"Cardiac muscle",
			],
			timeToEffect: "1-2 weeks",
			duration: "Ongoing for cardiovascular support",
		},
		{
			id: "hormonal-balance",
			name: "Hormonal balance and cell signaling",
			polishName: "Równowaga hormonalna i sygnalizacja komórkowa",
			pathway: "Endocrine regulation",
			polishPathway: "Regulacja endokrynna",
			description:
				"Calcium participates in hormone secretion and cell signaling pathways, supporting endocrine function and cellular communication.",
			polishDescription:
				"Wapń uczestniczy w wydzielaniu hormonów i szlakach sygnalizacji komórkowej, wspierając funkcję endokrynną i komunikację komórkową.",
			evidenceLevel: "MODERATE",
			targetSystems: [
				"Endocrine system",
				"Cell signaling",
				"Hormone secretion",
			],
			timeToEffect: "1-2 weeks",
			duration: "Ongoing for endocrine support",
		},
	],

	// Comprehensive dosage guidelines
	dosageGuidelines: {
		therapeuticRange: {
			min: 400,
			max: 1000,
			unit: "mg",
		},
		timing: ["with meals", "between meals"],
		withFood: false,
		contraindications: [
			"Hypercalcemia",
			"Hyperparathyroidism",
			"Kidney stones (calcium oxalate)",
			"Sarcoidosis",
		],
		polishContraindications: [
			"Hiperkalcemia",
			"Nadczynność przytarczyc",
			"Kamienie nerkowe (szczawian wapnia)",
			"Sarkoidoza",
		],
		interactions: [
			{
				substance: "Vitamin D",
				polishSubstance: "Witamina D",
				type: "synergistic",
				severity: "beneficial",
				description: "Vitamin D enhances calcium absorption",
				clinicalSignificance: "Improved calcium bioavailability",
				polishClinicalSignificance: "Poprawiona biodostępność wapnia",
				polishDescription: "Witamina D wzmacnia wchłanianie wapnia",
				recommendation: "Take together for enhanced absorption",
				polishRecommendation: "Przyjmuj razem dla lepszego wchłaniania",
				evidenceLevel: "STRONG",
			},
			{
				substance: "Iron supplements",
				polishSubstance: "Suplementy żelaza",
				type: "antagonistic",
				severity: "minor",
				description: "May compete for absorption",
				clinicalSignificance: "May reduce absorption of both minerals",
				polishClinicalSignificance: "Może zmniejszyć wchłanianie obu minerałów",
				polishDescription: "Może konkurować o wchłanianie",
				recommendation: "Take 2 hours apart",
				polishRecommendation: "Przyjmuj 2 godziny odstępu",
				evidenceLevel: "MODERATE",
			},
			{
				substance: "Tetracycline antibiotics",
				polishSubstance: "Antybiotyki tetracyklinowe",
				type: "antagonistic",
				severity: "moderate",
				description: "Calcium may reduce antibiotic absorption",
				clinicalSignificance: "May decrease antibiotic effectiveness",
				polishClinicalSignificance: "Może zmniejszyć skuteczność antybiotyku",
				polishDescription: "Wapń może zmniejszyć wchłanianie antybiotyku",
				recommendation:
					"Take antibiotics 2 hours before or 4-6 hours after calcium",
				polishRecommendation:
					"Przyjmuj antybiotyki 2 godziny przed lub 4-6 godzin po wapniu",
				evidenceLevel: "MODERATE",
			},
		],
	},

	// Side effects with frequency and management
	sideEffects: [
		{
			effect: "Gastrointestinal upset",
			polishEffect: "Zaburzenia żołądkowo-jelitowe",
			frequency: "uncommon",
			severity: "mild",
			reversible: true,
			dosageDependent: true,
			timeToOnset: "1-4 hours",
			management: "Take with food, reduce dose, or divide throughout day",
			polishManagement:
				"Przyjmuj z jedzeniem, zmniejsz dawkę lub podziel w ciągu dnia",
		},
		{
			effect: "Constipation",
			polishEffect: "Zaparcia",
			frequency: "rare",
			severity: "mild",
			reversible: true,
			dosageDependent: true,
			timeToOnset: "1-3 days",
			management: "Increase fiber intake, ensure adequate hydration",
			polishManagement:
				"Zwiększ spożycie błonnika, zapewnij odpowiednie nawodnienie",
		},
		{
			effect: "Kidney stones",
			polishEffect: "Kamienie nerkowe",
			frequency: "very_rare",
			severity: "moderate",
			reversible: true,
			dosageDependent: true,
			timeToOnset: "Months of high-dose use",
			management: "Avoid excessive doses, ensure adequate hydration",
			polishManagement:
				"Unikaj nadmiernych dawek, zapewnij odpowiednie nawodnienie",
		},
	],

	// Supplement interactions
	interactions: [
		{
			substance: "Vitamin D",
			polishSubstance: "Witamina D",
			type: "synergistic",
			severity: "beneficial",
			description:
				"Essential partnership for calcium absorption and bone health",
			polishDescription:
				"Niezbędne partnerstwo dla wchłaniania wapnia i zdrowia kości",
			clinicalSignificance: "Enhanced therapeutic effects for bone health",
			polishClinicalSignificance:
				"Wzmocnione efekty terapeutyczne dla zdrowia kości",
			mechanism: "Vitamin D regulates calcium absorption in intestines",
			polishMechanism: "Witamina D reguluje wchłanianie wapnia w jelitach",
			recommendation: "Essential combination for optimal bone health",
			polishRecommendation:
				"Niezbędne połączenie dla optymalnego zdrowia kości",
			evidenceLevel: "STRONG",
		},
		{
			substance: "Magnesium",
			polishSubstance: "Magnez",
			type: "synergistic",
			clinicalSignificance:
				"Complementary roles in bone metabolism and muscle function",
			polishClinicalSignificance:
				"Komplementarne role w metabolizmie kości i funkcji mięśni",
			severity: "beneficial",
			mechanism:
				"Magnesium supports calcium utilization and prevents vascular calcification",
			polishMechanism:
				"Magnez wspiera wykorzystanie wapnia i zapobiega wapnieniu naczyń",
			description:
				"Magnesium and calcium work together for optimal bone health and muscle function",
			polishDescription:
				"Magnez i wapń współpracują dla optymalnego zdrowia kości i funkcji mięśni",
			recommendation: "Beneficial combination in appropriate ratios",
			polishRecommendation: "Korzystne połączenie w odpowiednich proporcjach",
			evidenceLevel: "MODERATE",
		},
	],

	// Evidence level and research studies
	evidenceLevel: "STRONG",
	researchStudies: [
		{
			id: "dawson-hughes-1990",
			title:
				"A controlled trial of the effect of calcium supplementation on bone density in postmenopausal women",
			polishTitle:
				"Kontrolowane badanie wpływu suplementacji wapnia na gęstość kości u kobiet po menopauzie",
			authors: ["Dawson-Hughes B", "Dallal GE", "Krall EA"],
			journal: "New England Journal of Medicine",
			year: 1990,
			studyType: "RANDOMIZED_CONTROLLED_TRIAL",
			primaryOutcome: "Bone density changes with calcium supplementation",
			polishPrimaryOutcome: "Zmiany gęstości kości przy suplementacji wapnia",
			findings:
				"Calcium supplementation significantly reduced bone loss in postmenopausal women",
			polishFindings:
				"Suplementacja wapnia znacząco zmniejszyła utratę kości u kobiet po menopauzie",
			evidenceLevel: "STRONG",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "2407956",
			doi: "10.1056/NEJM199009273231301",
			qualityScore: 9.0,
		},
		{
			id: "reid-2006",
			title: "Calcium supplementation and bone mineral density",
			polishTitle: "Suplementacja wapnia a gęstość mineralna kości",
			authors: ["Reid IR", "Mason B", "Horne A"],
			journal: "Annals of Internal Medicine",
			year: 2006,
			studyType: "META_ANALYSIS",
			primaryOutcome: "Calcium supplementation effects on bone density",
			polishPrimaryOutcome: "Efekty suplementacji wapnia na gęstość kości",
			findings:
				"Calcium supplementation has modest but significant effects on bone density",
			polishFindings:
				"Suplementacja wapnia ma skromne ale znaczące efekty na gęstość kości",
			evidenceLevel: "MODERATE",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "17090841",
			doi: "10.7326/0003-4819-145-8-200610170-00005",
			qualityScore: 8.5,
		},
		{
			id: "bolland-2010",
			title: "Effect of calcium supplements on risk of myocardial infarction",
			polishTitle:
				"Wpływ suplementów wapnia na ryzyko zawału mięśnia sercowego",
			authors: ["Bolland MJ", "Avenell A", "Baron JA"],
			journal: "British Medical Journal",
			year: 2010,
			studyType: "META_ANALYSIS",
			primaryOutcome: "Cardiovascular effects of calcium supplementation",
			polishPrimaryOutcome: "Efekty sercowo-naczyniowe suplementacji wapnia",
			findings:
				"Calcium supplementation may increase risk of myocardial infarction",
			polishFindings:
				"Suplementacja wapnia może zwiększać ryzyko zawału mięśnia sercowego",
			evidenceLevel: "MODERATE",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "20671013",
			doi: "10.1136/bmj.c3691",
			qualityScore: 8.0,
		},
	],

	// Metadata
	tags: [
		"mineral",
		"essential mineral",
		"bone health",
		"osteoporosis",
		"muscle function",
		"cardiovascular health",
		"nerve transmission",
		"calcium citrate",
		"highly bioavailable",
		"bone density",
		"fracture prevention",
	],
	lastUpdated: "2024-01-15T00:00:00Z",
	createdAt: "2024-01-15T00:00:00Z",

	// Additional fields for Prisma compatibility
	knowledgeNodeId: null,
};

export default calciumCitrateProfile;
