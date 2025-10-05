/**
 * Vitamins and Minerals Database
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
			{
				condition: "Immune function",
				polishCondition: "Funkcja immunologiczna",
				indication: "Support for immune system regulation",
				polishIndication: "Wsparcie dla regulacji układu odpornościowego",
				efficacy: "moderate",
				effectivenessRating: 7,
				evidenceLevel: "MODERATE",
				recommendedDose: "2000-4000 IU daily",
				duration: "3-6 months",
				effectSize: 0.4,
				studyCount: 200,
				participantCount: 15000,
				recommendationGrade: "B",
			},
			{
				condition: "Mood regulation",
				polishCondition: "Regulacja nastroju",
				indication: "Support for seasonal affective disorder and depression",
				polishIndication:
					"Wsparcie dla sezonowych zaburzeń afektywnych i depresji",
				efficacy: "moderate",
				effectivenessRating: 6,
				evidenceLevel: "MODERATE",
				recommendedDose: "2000-5000 IU daily",
				duration: "2-4 months",
				effectSize: 0.5,
				studyCount: 50,
				participantCount: 3000,
				recommendationGrade: "B",
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

	// TODO: Add more vitamin and mineral profiles here
	// Magnesium Glycinate and other minerals will be added in Phase 6 with proper structure
];

export default vitaminsAndMinerals;
