/**
 * Vitamin C (Ascorbic Acid) Supplement Profile
 * Comprehensive scientific data for immune support and antioxidant protection
 */

import type { SupplementWithRelations } from "../../types/supplement";

export const vitaminCProfile: SupplementWithRelations = {
	id: "vitamin-c",
	name: "Vitamin C",
	polishName: "Witamina C",
	scientificName: "Ascorbic acid",
	commonNames: ["Ascorbic acid", "Ascorbate", "L-ascorbic acid"],
	polishCommonNames: ["Kwas askorbinowy", "Askorbinian", "L-askorbinowy"],
	category: "VITAMIN",
	description:
		"Vitamin C is an essential water-soluble vitamin and potent antioxidant that supports immune function, collagen synthesis, and protects cells from oxidative damage. It is required for numerous enzymatic reactions and cannot be synthesized by humans.",
	polishDescription:
		"Witamina C to niezbędna witamina rozpuszczalna w wodzie i silny antyoksydant, który wspiera funkcję immunologiczną, syntezę kolagenu i chroni komórki przed uszkodzeniami oksydacyjnymi. Jest wymagana dla licznych reakcji enzymatycznych i nie może być syntetyzowana przez ludzi.",

	activeCompounds: [
		{
			name: "Ascorbic acid",
			polishName: "Kwas askorbinowy",
			concentration: "500-2000mg",
			bioavailability: 90,
			halfLife: "2-4 hours",
			metabolicPathway: ["Direct absorption", "Cellular uptake", "Oxidation to dehydroascorbate"],
			targetReceptors: ["SVCT1/SVCT2 transporters"],
		},
	],

	clinicalApplications: [
		{
			condition: "Immune system support",
			polishCondition: "Wsparcie układu odpornościowego",
			indication: "Prevention and treatment of common cold and immune enhancement",
			polishIndication: "Zapobieganie i leczenie przeziębienia oraz wzmacnianie odporności",
			efficacy: "moderate",
			effectivenessRating: 6,
			evidenceLevel: "MODERATE",
			recommendedDose: "500-2000mg daily",
			duration: "During illness or for prevention",
			effectSize: 0.3,
			studyCount: 30,
			participantCount: 10000,
			recommendationGrade: "B",
		},
		{
			condition: "Antioxidant protection",
			polishCondition: "Ochrona antyoksydacyjna",
			indication: "General antioxidant support and oxidative stress reduction",
			polishIndication: "Ogólne wsparcie antyoksydacyjne i redukcja stresu oksydacyjnego",
			efficacy: "high",
			effectivenessRating: 8,
			evidenceLevel: "STRONG",
			recommendedDose: "500-1000mg daily",
			duration: "Ongoing",
			effectSize: 0.5,
			studyCount: 50,
			participantCount: 8000,
			recommendationGrade: "A",
		},
	],

	mechanisms: [
		{
			id: "antioxidant-activity",
			name: "Antioxidant and free radical scavenging",
			polishName: "Aktywność antyoksydacyjna i wychwytywanie wolnych rodników",
			pathway: "Oxidative stress protection",
			polishPathway: "Ochrona przed stresem oksydacyjnym",
			description:
				"Vitamin C donates electrons to neutralize free radicals and reactive oxygen species, protecting cellular components from oxidative damage.",
			polishDescription:
				"Witamina C oddaje elektrony do neutralizacji wolnych rodników i reaktywnych form tlenu, chroniąc składniki komórkowe przed uszkodzeniami oksydacyjnymi.",
			evidenceLevel: "STRONG",
			targetSystems: [
				"Free radical scavenging",
				"Cellular membrane protection",
				"DNA protection",
				"Protein protection",
			],
			timeToEffect: "30-60 minutes",
			duration: "4-6 hours",
		},
		{
			id: "collagen-synthesis",
			name: "Collagen synthesis and tissue repair",
			polishName: "Synteza kolagenu i naprawa tkanek",
			pathway: "Connective tissue metabolism",
			polishPathway: "Metabolizm tkanki łącznej",
			description:
				"Vitamin C is essential for collagen synthesis, supporting wound healing, connective tissue strength, and vascular integrity.",
			polishDescription:
				"Witamina C jest niezbędna dla syntezy kolagenu, wspierając gojenie ran, wytrzymałość tkanki łącznej i integralność naczyń krwionośnych.",
			evidenceLevel: "STRONG",
			targetSystems: [
				"Collagen synthesis",
				"Wound healing",
				"Connective tissue",
				"Vascular health",
			],
			timeToEffect: "1-2 weeks",
			duration: "Continuous effect during supplementation",
		},
	],

	dosageGuidelines: {
		therapeuticRange: {
			min: 500,
			max: 2000,
			unit: "mg",
		},
		timing: ["morning", "with_meal"],
		withFood: true,
		contraindications: ["Kidney stones (high doses)", "Iron overload disorders"],
		polishContraindications: ["Kamienie nerkowe (wysokie dawki)", "Zaburzenia przeciążenia żelazem"],
		interactions: [
			{
				substance: "Iron",
				polishSubstance: "Żelazo",
				type: "synergistic",
				severity: "beneficial",
				description: "Enhanced iron absorption",
				polishDescription: "Wzmocnione wchłanianie żelaza",
				clinicalSignificance: "Improved iron bioavailability",
				polishClinicalSignificance: "Poprawiona biodostępność żelaza",
				mechanism: "Reduction of ferric to ferrous iron",
				polishMechanism: "Redukcja żelaza Fe3+ do Fe2+",
				recommendation: "Take together for better absorption",
				polishRecommendation: "Przyjmuj razem dla lepszego wchłaniania",
				evidenceLevel: "STRONG",
			},
		],
	},

	sideEffects: [
		{
			effect: "Gastrointestinal discomfort",
			polishEffect: "Dyskomfort żołądkowo-jelitowy",
			frequency: "common",
			severity: "mild",
			reversible: true,
			dosageDependent: true,
			timeToOnset: "1-2 hours",
			management: "Take with food, reduce dose",
			polishManagement: "Przyjmuj z jedzeniem, zmniejsz dawkę",
		},
	],

	interactions: [
		{
			substance: "Vitamin E",
			polishSubstance: "Witamina E",
			type: "synergistic",
			severity: "beneficial",
			description: "Regeneration of vitamin E antioxidant capacity",
			polishDescription: "Regeneracja zdolności antyoksydacyjnych witaminy E",
			clinicalSignificance: "Enhanced antioxidant protection",
			polishClinicalSignificance: "Wzmocniona ochrona antyoksydacyjna",
			mechanism: "Vitamin C regenerates oxidized vitamin E",
			polishMechanism: "Witamina C regeneruje utlenioną witaminę E",
			recommendation: "Beneficial antioxidant combination",
			polishRecommendation: "Korzystna kombinacja antyoksydacyjna",
			evidenceLevel: "STRONG",
		},
	],

	evidenceLevel: "STRONG",
	researchStudies: [
		{
			id: "hemila-2013",
			title: "Vitamin C for preventing and treating the common cold",
			polishTitle: "Witamina C w zapobieganiu i leczeniu przeziębienia",
			authors: ["Hemilä H", "Chalker E"],
			journal: "Cochrane Database of Systematic Reviews",
			year: 2013,
			studyType: "META_ANALYSIS",
			primaryOutcome: "Common cold prevention and treatment",
			polishPrimaryOutcome: "Zapobieganie i leczenie przeziębienia",
			findings: "Vitamin C reduces cold duration and severity",
			polishFindings: "Witamina C redukuje czas trwania i nasilenie przeziębienia",
			evidenceLevel: "STRONG",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "23440782",
			doi: "10.1002/14651858.CD000980.pub4",
			sampleSize: 0,
			qualityScore: 9.0,
		},
	],

	tags: [
		"vitamin-c",
		"antioxidant",
		"immune",
		"collagen",
		"ascorbic acid",
		"vitamin",
		"essential nutrient",
	],
	lastUpdated: "2024-01-15T00:00:00Z",
	createdAt: "2024-01-15T00:00:00Z",
	knowledgeNodeId: null,
};

export default vitaminCProfile;