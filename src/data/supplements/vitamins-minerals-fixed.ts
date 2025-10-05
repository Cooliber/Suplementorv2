/**
 * Vitamins and Minerals Database - FIXED
 * Comprehensive profiles for essential micronutrients with cognitive and health benefits
 */

import type { SupplementWithRelations } from "@/types/supplement";

export const vitaminsAndMinerals: SupplementWithRelations[] = [
	{
		id: "vitamin-d3-cholecalciferol",
		name: "Vitamin D3 (Cholecalciferol)",
		polishName: "Witamina D3 (Cholekalcyferol)",
		scientificName: "Cholecalciferol",
		commonNames: ["Vitamin D3", "Cholecalciferol", "Sunshine Vitamin"],
		polishCommonNames: ["Witamina D3", "Cholekalcyferol", "Witamina słońca"],
		category: "VITAMIN",
		description:
			"Essential fat-soluble vitamin crucial for bone health, immune function, and cognitive performance",
		polishDescription:
			"Niezbędna witamina rozpuszczalna w tłuszczach, kluczowa dla zdrowia kości, funkcji immunologicznej i wydajności poznawczej",

		activeCompounds: [
			{
				name: "Cholecalciferol",
				polishName: "Cholekalcyferol",
				concentration: "100%",
				bioavailability: 80,
				halfLife: "15-25 days",
				metabolicPathway: ["Liver hydroxylation", "Kidney activation"],
				targetReceptors: ["Vitamin D receptors (VDR)"],
			},
		],

		clinicalApplications: [
			{
				condition: "Bone health",
				polishCondition: "Zdrowie kości",
				indication: "Prevention of osteoporosis and bone fractures",
				polishIndication: "Zapobieganie osteoporozie i złamaniom kości",
				efficacy: "high",
				effectivenessRating: 9,
				evidenceLevel: "STRONG",
				recommendedDose: "1000-4000 IU daily",
				duration: "6-12 months",
				effectSize: 0.7,
				studyCount: 800,
				participantCount: 50000,
				recommendationGrade: "A",
			},
		],

		mechanisms: [
			{
				id: "vdr-activation",
				name: "Vitamin D receptor activation",
				polishName: "Aktywacja receptora witaminy D",
				pathway: "Vitamin D endocrine system",
				polishPathway: "Układ endokrynny witaminy D",
				description:
					"Vitamin D3 activates vitamin D receptors (VDR) throughout the body, regulating calcium absorption, immune function, and gene expression",
				polishDescription:
					"Witamina D3 aktywuje receptory witaminy D (VDR) w całym organizmie, regulując absorpcję wapnia, funkcję immunologiczną i ekspresję genów",
				evidenceLevel: "STRONG",
				targetSystems: ["Skeletal system", "Immune system", "Nervous system"],
				timeToEffect: "1-2 weeks",
				duration: "Chronic supplementation required",
			},
		],

		dosageGuidelines: {
			therapeuticRange: {
				min: 1000,
				max: 4000,
				unit: "IU",
			},
			timing: ["with meals", "morning", "with fat"],
			withFood: true,
			contraindications: ["hypercalcemia", "kidney disease"],
			polishContraindications: ["hiperkalcemia", "choroba nerek"],
			interactions: [
				{
					substance: "Thiazide diuretics",
					polishSubstance: "Diuretyki tiazydowe",
					type: "antagonistic",
					severity: "moderate",
					mechanism: "Calcium metabolism interference",
					polishMechanism: "Zakłócenie metabolizmu wapnia",
					description: "May increase calcium levels",
					polishDescription: "Może zwiększać poziomy wapnia",
					clinicalSignificance: "Monitor calcium levels regularly",
					polishClinicalSignificance: "Regularnie monitorować poziomy wapnia",
					recommendation: "Monitor calcium and vitamin D levels",
					polishRecommendation: "Monitorować poziomy wapnia i witaminy D",
					evidenceLevel: "MODERATE",
				},
			],
		},

		sideEffects: [
			{
				effect: "Hypercalcemia (high doses)",
				polishEffect: "Hiperkalcemia (wysokie dawki)",
				frequency: "rare",
				severity: "moderate",
				reversible: true,
				dosageDependent: true,
				timeToOnset: "1-3 months",
				management: "Reduce dose, monitor calcium levels",
				polishManagement: "Zmniejszyć dawkę, monitorować poziomy wapnia",
			},
		],

		interactions: [
			{
				substance: "Thiazide diuretics",
				polishSubstance: "Diuretyki tiazydowe",
				type: "antagonistic",
				severity: "moderate",
				mechanism: "Calcium metabolism interference",
				polishMechanism: "Zakłócenie metabolizmu wapnia",
				description: "May increase calcium levels",
				polishDescription: "Może zwiększać poziomy wapnia",
				clinicalSignificance: "Monitor calcium levels regularly",
				polishClinicalSignificance: "Regularnie monitorować poziomy wapnia",
				recommendation: "Monitor calcium and vitamin D levels",
				polishRecommendation: "Monitorować poziomy wapnia i witaminy D",
				evidenceLevel: "MODERATE",
			},
			{
				substance: "Calcium",
				polishSubstance: "Wapń",
				type: "synergistic",
				severity: "beneficial",
				mechanism: "Enhanced calcium absorption",
				polishMechanism: "Wzmocniona absorpcja wapnia",
				description: "Vitamin D enhances calcium absorption",
				polishDescription: "Witamina D wzmacnia absorpcję wapnia",
				clinicalSignificance: "Take together for optimal absorption",
				polishClinicalSignificance: "Przyjmować razem dla optymalnej absorpcji",
				recommendation: "Take together for bone health benefits",
				polishRecommendation: "Przyjmować razem dla korzyści zdrowotnych kości",
				evidenceLevel: "STRONG",
			},
		],

		evidenceLevel: "STRONG",
		researchStudies: [
			{
				id: "wang-2008",
				title: "Vitamin D deficiency and risk of cardiovascular disease",
				polishTitle: "Niedobór witaminy D a ryzyko chorób sercowo-naczyniowych",
				authors: ["Wang TJ", "Pencina MJ", "Booth SL"],
				journal: "Circulation",
				year: 2008,
				studyType: "COHORT_STUDY",
				primaryOutcome: "Cardiovascular risk assessment",
				polishPrimaryOutcome: "Ocena ryzyka sercowo-naczyniowego",
				findings:
					"Vitamin D deficiency associated with increased cardiovascular risk",
				polishFindings:
					"Niedobór witaminy D związany ze zwiększonym ryzykiem sercowo-naczyniowym",
				evidenceLevel: "MODERATE",
				lastUpdated: "2024-01-15T00:00:00Z",
				pubmedId: "18458125",
				doi: "10.1161/CIRCULATIONAHA.107.706127",
				sampleSize: 1739,
				duration: "5.4 years",
				dosage: "Various",
				qualityScore: 9,
			},
		],

		tags: [
			"vitamin",
			"bone-health",
			"immune-system",
			"mood",
			"deficiency-common",
			"fat-soluble",
			"cholecalciferol",
			"sunshine-vitamin",
			"calcium-absorption",
		],
		lastUpdated: "2024-01-15T00:00:00Z",
		createdAt: "2024-01-15T00:00:00Z",
	},

	{
		id: "magnesium-glycinate",
		name: "Magnesium Glycinate",
		polishName: "Glicynian Magnezu",
		scientificName: "Magnesium bis-glycinate",
		commonNames: [
			"Magnesium Glycinate",
			"Magnesium Bisglycinate",
			"Chelated Magnesium",
		],
		polishCommonNames: [
			"Glicynian magnezu",
			"Bisglicynian magnezu",
			"Magnez chelatowany",
		],
		category: "MINERAL",
		description:
			"Highly bioavailable form of magnesium chelated with glycine for optimal absorption and minimal digestive upset",
		polishDescription:
			"Wysoce biodostępna forma magnezu skojarzona z glicyną dla optymalnej absorpcji i minimalnych dolegliwości trawiennych",

		activeCompounds: [
			{
				name: "Magnesium",
				polishName: "Magnez",
				concentration: "14-18%",
				bioavailability: 85,
				halfLife: "4-6 hours",
				metabolicPathway: ["ATP synthesis", "Muscle relaxation"],
				targetReceptors: ["NMDA receptors", "Calcium channels"],
			},
		],

		clinicalApplications: [
			{
				condition: "Sleep quality improvement",
				polishCondition: "Poprawa jakości snu",
				indication: "Support for better sleep patterns and relaxation",
				polishIndication: "Wsparcie dla lepszych wzorców snu i relaksacji",
				efficacy: "moderate",
				effectivenessRating: 7,
				evidenceLevel: "MODERATE",
				recommendedDose: "300-600mg evening",
				duration: "4-6 weeks",
				effectSize: 0.6,
				studyCount: 15,
				participantCount: 800,
				recommendationGrade: "B",
			},
		],

		mechanisms: [
			{
				id: "enzymatic-cofactor",
				name: "Enzymatic cofactor",
				polishName: "Kofaktor enzymatyczny",
				pathway: "ATP-dependent enzymatic reactions",
				polishPathway: "Reakcje enzymatyczne zależne od ATP",
				description:
					"Magnesium serves as a cofactor for over 300 enzymatic reactions, including energy production, protein synthesis, and muscle/nerve function",
				polishDescription:
					"Magnez służy jako kofaktor dla ponad 300 reakcji enzymatycznych, w tym produkcji energii, syntezy białek oraz funkcji mięśni i nerwów",
				evidenceLevel: "STRONG",
				targetSystems: [
					"Energy metabolism",
					"Muscle function",
					"Nervous system",
				],
				timeToEffect: "1-2 weeks",
				duration: "Chronic supplementation required",
			},
		],

		dosageGuidelines: {
			therapeuticRange: {
				min: 200,
				max: 800,
				unit: "mg",
			},
			timing: ["evening", "with meals", "before bed"],
			withFood: true,
			contraindications: ["severe kidney disease"],
			polishContraindications: ["ciężka choroba nerek"],
			interactions: [
				{
					substance: "Antibiotics (tetracyclines, quinolones)",
					polishSubstance: "Antybiotyki (tetracykliny, chinolony)",
					type: "antagonistic",
					severity: "moderate",
					mechanism: "Chelation reduces antibiotic absorption",
					polishMechanism: "Chelacja zmniejsza absorpcję antybiotyku",
					description: "Magnesium may reduce antibiotic absorption",
					polishDescription: "Magnez może zmniejszać absorpcję antybiotyku",
					clinicalSignificance:
						"Take magnesium 2-3 hours apart from antibiotics",
					polishClinicalSignificance:
						"Przyjmować magnez 2-3 godziny od antybiotyków",
					recommendation: "Separate administration by 2-3 hours",
					polishRecommendation: "Oddzielić podawanie o 2-3 godziny",
					evidenceLevel: "STRONG",
				},
			],
		},

		sideEffects: [
			{
				effect: "Loose stools (high doses)",
				polishEffect: "Luźne stolce (wysokie dawki)",
				frequency: "uncommon",
				severity: "mild",
				reversible: true,
				dosageDependent: true,
				timeToOnset: "2-4 hours",
				management: "Reduce dose, take with food",
				polishManagement: "Zmniejszyć dawkę, przyjmować z jedzeniem",
			},
		],

		interactions: [
			{
				substance: "Antibiotics (tetracyclines, quinolones)",
				polishSubstance: "Antybiotyki (tetracykliny, chinolony)",
				type: "antagonistic",
				severity: "moderate",
				mechanism: "Chelation reduces antibiotic absorption",
				polishMechanism: "Chelacja zmniejsza absorpcję antybiotyku",
				description: "Magnesium may reduce antibiotic absorption",
				polishDescription: "Magnez może zmniejszać absorpcję antybiotyku",
				clinicalSignificance: "Take magnesium 2-3 hours apart from antibiotics",
				polishClinicalSignificance:
					"Przyjmować magnez 2-3 godziny od antybiotyków",
				recommendation: "Separate administration by 2-3 hours",
				polishRecommendation: "Oddzielić podawanie o 2-3 godziny",
				evidenceLevel: "STRONG",
			},
			{
				substance: "Calcium",
				polishSubstance: "Wapń",
				type: "competitive",
				severity: "minor",
				mechanism: "Competitive absorption in intestine",
				polishMechanism: "Konkurencyjna absorpcja w jelicie",
				description: "High doses may compete for absorption",
				polishDescription: "Wysokie dawki mogą konkurować o absorpcję",
				clinicalSignificance:
					"Take at different times or use 2:1 calcium:magnesium ratio",
				polishClinicalSignificance:
					"Przyjmować o różnych porach lub używać stosunku 2:1 wapń:magnez",
				recommendation: "Separate doses or maintain proper ratio",
				polishRecommendation: "Oddzielić dawki lub utrzymać właściwy stosunek",
				evidenceLevel: "MODERATE",
			},
		],

		evidenceLevel: "STRONG",
		researchStudies: [
			{
				id: "abbasi-2012",
				title:
					"The effect of magnesium supplementation on primary insomnia in elderly",
				polishTitle:
					"Wpływ suplementacji magnezu na pierwotną bezsenność u osób starszych",
				authors: [
					"Abbasi B",
					"Kimiagar M",
					"Sadeghniiat K",
					"Shirazi MM",
					"Hedayati M",
					"Rashidkhani B",
				],
				journal: "Journal of Research in Medical Sciences",
				year: 2012,
				studyType: "RANDOMIZED_CONTROLLED_TRIAL",
				primaryOutcome: "Sleep quality improvement",
				polishPrimaryOutcome: "Poprawa jakości snu",
				findings: "Significant improvement in sleep quality and duration",
				polishFindings: "Znacząca poprawa jakości i czasu trwania snu",
				evidenceLevel: "MODERATE",
				lastUpdated: "2024-01-15T00:00:00Z",
				pubmedId: "23264763",
				doi: "10.4103/1735-1995.104917",
				sampleSize: 46,
				duration: "8 weeks",
				dosage: "500mg daily",
				qualityScore: 7,
			},
		],

		tags: [
			"mineral",
			"magnesium",
			"chelated",
			"sleep",
			"muscle-function",
			"heart-health",
			"bone-health",
			"stress-reduction",
			"glycinate",
			"bioavailable",
		],
		lastUpdated: "2024-01-15T00:00:00Z",
		createdAt: "2024-01-15T00:00:00Z",
	},
];

export default vitaminsAndMinerals;
