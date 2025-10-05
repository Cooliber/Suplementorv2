/**
 * Creatine Monohydrate
 * Comprehensive supplement profile with Polish translations
 */

import type { ComprehensiveSupplementProfile } from "./types";

export const creatine_monohydrate: ComprehensiveSupplementProfile = {
	id: "creatine-monohydrate",
	name: "Creatine Monohydrate",
	polishName: "Monohydrat kreatyny",
	scientificName: "N-(aminoiminomethyl)-N-methylglycine monohydrate",
	commonNames: ["Creatine", "Creatine Monohydrate"],
	polishCommonNames: ["Kreatyna", "Monohydrat kreatyny"],
	category: "AMINO_ACID",

	activeCompounds: [
		{
			name: "Creatine",
			polishName: "Kreatyna",
			concentration: "3-5g daily",
			bioavailability: 95,
			halfLife: "3 hours (plasma), weeks (muscle)",
			metabolicPathway: ["Phosphocreatine system", "Creatine kinase pathway"],
			targetReceptors: ["Creatine transporter", "Mitochondrial receptors"],
		},
	],

	clinicalApplications: [
		{
			condition: "Cognitive Performance",
			polishCondition: "Wydajność poznawcza",
			effectivenessRating: 7,
			evidenceLevel: "MODERATE",
			efficacy: "moderate",
			recommendedDose: "5g daily",
			duration: "4-8 weeks",
		},
		{
			condition: "Mental Fatigue",
			polishCondition: "Zmęczenie umysłowe",
			effectivenessRating: 8,
			evidenceLevel: "MODERATE",
			efficacy: "high",
			recommendedDose: "5g daily",
			duration: "2-6 weeks",
		},
	],

	mechanisms: [
		{
			pathway: "Brain Energy Metabolism",
			polishPathway: "Metabolizm energetyczny mózgu",
			description:
				"Creatine increases phosphocreatine stores in the brain, providing rapid ATP regeneration for high-energy cognitive tasks",
			polishDescription:
				"Kreatyna zwiększa zapasy fosfokreatyny w mózgu, zapewniając szybką regenerację ATP dla wysokoenergetycznych zadań poznawczych",
			targetSystems: ["Brain tissue", "Neurons", "Glial cells"],
			evidenceLevel: "STRONG",
			timeToEffect: "2-4 weeks",
		},
	],

	pharmacokinetics: {
		absorption: {
			rate: "Excellent (95% bioavailability)",
			factors: [
				"Carbohydrates enhance uptake",
				"Insulin sensitivity affects transport",
			],
			polishFactors: [
				"Węglowodany zwiększają wchłanianie",
				"Wrażliwość na insulinę wpływa na transport",
			],
			optimalTiming: "Post-workout or with carbohydrates",
			polishOptimalTiming: "Po treningu lub z węglowodanami",
		},
		distribution: {
			volumeOfDistribution: "Primarily muscle and brain tissue",
			proteinBinding: "Low",
			brainPenetration: true,
			placentalCrossing: true,
		},
		metabolism: {
			primaryPathway: "Spontaneous conversion to creatinine",
			polishPrimaryPathway: "Spontaniczna konwersja do kreatyniny",
			enzymes: ["Creatine kinase", "Non-enzymatic conversion"],
			metabolites: ["Creatinine", "Phosphocreatine"],
		},
		elimination: {
			halfLife: "3 hours (plasma), weeks (tissue)",
			excretionRoute: "Renal excretion as creatinine",
			renalClearance: "Proportional to muscle mass",
		},
	},

	sideEffects: [
		{
			effect: "Water retention",
			polishEffect: "Retencja wody",
			frequency: "uncommon",
			severity: "mild",
			reversible: true,
			management: "Increase water intake, normal response",
			polishManagement: "Zwiększyć spożycie wody, normalna reakcja",
		},
		{
			effect: "Gastrointestinal upset",
			polishEffect: "Dolegliwości żołądkowo-jelitowe",
			frequency: "uncommon",
			severity: "mild",
			reversible: true,
			management: "Take with food, divide doses",
			polishManagement: "Przyjmować z jedzeniem, podzielić dawki",
		},
	],

	interactions: [
		{
			substance: "Caffeine",
			polishSubstance: "Kofeina",
			type: "antagonistic",
			description: "May reduce creatine uptake efficiency",
			severity: "minor",
			clinicalSignificance: "Minimal practical impact",
			polishClinicalSignificance: "Minimalny praktyczny wpływ",
			recommendation: "Separate timing if concerned",
			polishRecommendation: "Rozdzielić czasowo w razie obaw",
		},
	],

	evidenceLevel: "MODERATE",
	researchStudies: [
		{
			id: "rae-2003",
			title:
				"Oral creatine monohydrate supplementation improves brain performance",
			polishTitle:
				"Doustna suplementacja monohydratem kreatyny poprawia wydajność mózgu",
			authors: ["Rae C", "Digney AL", "McEwan SR", "et al."],
			journal: "Proceedings of the Royal Society B",
			year: 2003,
			studyType: "RANDOMIZED_CONTROLLED_TRIAL",
			evidenceLevel: "MODERATE",

			findings: "Study findings",
			polishFindings: "Wyniki badania",
			lastUpdated: "2024-01-15T00:00:00Z",
			participantCount: 45,
			duration: "6 weeks",
			primaryOutcome: "Cognitive performance improvement",
			polishPrimaryOutcome: "Poprawa wydajności poznawczej",
			results: "Significant improvement in working memory and intelligence",
			polishResults: "Znacząca poprawa pamięci roboczej i inteligencji",
			doi: "10.1098/rspb.2003.2492",
		},
	],

	educationalContent: {
		beginnerExplanation:
			"Creatine is naturally found in muscle and brain tissue. Supplementation can improve both physical and mental performance by enhancing cellular energy production.",
		polishBeginnerExplanation:
			"Kreatyna naturalnie występuje w tkance mięśniowej i mózgowej. Suplementacja może poprawić zarówno wydajność fizyczną, jak i umysłową poprzez zwiększenie produkcji energii komórkowej.",
		intermediateDetails:
			"Creatine increases phosphocreatine stores, allowing for rapid ATP regeneration during high-intensity cognitive tasks. Brain benefits are most pronounced in vegetarians.",
		polishIntermediateDetails:
			"Kreatyna zwiększa zapasy fosfokreatyny, umożliwiając szybką regenerację ATP podczas wysokointensywnych zadań poznawczych. Korzyści dla mózgu są najbardziej widoczne u wegetarian.",
		expertAnalysis:
			"Meta-analyses show consistent cognitive benefits, particularly for working memory and processing speed. Effects are more pronounced in populations with lower baseline creatine levels.",
		polishExpertAnalysis:
			"Metaanalizy pokazują stałe korzyści poznawcze, szczególnie dla pamięci roboczej i szybkości przetwarzania. Efekty są bardziej widoczne w populacjach z niższymi poziomami kreatyny.",
		keyTakeaways: [
			"Enhances brain energy metabolism",
			"Improves working memory and processing speed",
			"Safe and well-researched",
			"More effective in vegetarians",
		],
		polishKeyTakeaways: [
			"Zwiększa metabolizm energetyczny mózgu",
			"Poprawia pamięć roboczą i szybkość przetwarzania",
			"Bezpieczna i dobrze zbadana",
			"Bardziej skuteczna u wegetarian",
		],
	},

	clinicalEvidence: {
		totalStudies: 200,
		metaAnalyses: 12,
		rctCount: 85,
		observationalStudies: 103,
		lastReviewDate: "2023-09-25",
		cochranReviews: [],
	},

	qualityConsiderations: {
		standardization:
			"Look for pure creatine monohydrate with Creapure® certification",
		polishStandardization:
			"Szukać czystego monohydratu kreatyny z certyfikatem Creapure®",
		bioavailabilityForms: [
			"Monohydrate powder",
			"Capsules",
			"Micronized powder",
		],
		polishBioavailabilityForms: [
			"Proszek monohydratu",
			"Kapsułki",
			"Proszek mikronizowany",
		],
		qualityMarkers: [
			"Creapure certification",
			"Third-party testing",
			"No additives",
		],
		polishQualityMarkers: [
			"Certyfikat Creapure",
			"Testowanie przez strony trzecie",
			"Bez dodatków",
		],
		storageRequirements: "Cool, dry place, protect from moisture",
		polishStorageRequirements: "Chłodne, suche miejsce, chronić przed wilgocią",
		shelfLife: "3-5 years unopened",
	},

	economicData: {
		averageCostPerMonth: {
			low: 8,
			average: 15,
			high: 25,
			currency: "EUR",
		},
		costEffectivenessRating: "Excellent",
		polishCostEffectivenessRating: "Doskonała",
		valueProposition:
			"Very low cost for proven cognitive and physical benefits",
		polishValueProposition:
			"Bardzo niski koszt za udowodnione korzyści poznawcze i fizyczne",
	},

	safetyProfile: {
		pregnancyCategory: "C",
		breastfeedingSafety: "Caution",
		pediatricUse: {
			approved: false,
			ageLimit: "Not recommended for children under 18",
			specialConsiderations: ["Consult physician before use"],
			polishSpecialConsiderations: ["Skonsultuj się z lekarzem przed użyciem"],
		},
		elderlyConsiderations: [
			"Start with lower doses",
			"Monitor for side effects",
		],
		polishElderlyConsiderations: [
			"Rozpocząć od niższych dawek",
			"Monitorować działania niepożądane",
		],
		hepaticImpairment: "Use with caution",
		polishHepaticImpairment: "Stosować ostrożnie",
		renalImpairment: "Use with caution",
		polishRenalImpairment: "Stosować ostrożnie",
	},

	dosageGuidelines: {
		therapeuticRange: {
			min: 100,
			max: 600,
			unit: "mg",
		},
		timing: ["Morning", "With meals"],
		withFood: true,
		contraindications: [],
		polishContraindications: [],
		interactions: [],
	},

	tags: [
		"nootropic",
		"cognitive enhancement",
		"brain health",
		"memory support",
	],
	lastUpdated: "2024-01-15T00:00:00Z",
	createdAt: "2024-01-15T00:00:00Z",
};
