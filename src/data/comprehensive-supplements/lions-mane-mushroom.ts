/**
 * Lion's Mane Mushroom (Hericium erinaceus)
 * Comprehensive supplement profile with Polish translations
 */

import type { ComprehensiveSupplementProfile } from "./types";

export const lions_mane_mushroom: ComprehensiveSupplementProfile = {
	id: "lions-mane-mushroom",
	name: "Lion's Mane Mushroom",
	polishName: "Grzyb Soplówka jeżowata",
	scientificName: "Hericium erinaceus",
	commonNames: ["Lion's Mane", "Bearded Tooth Mushroom", "Yamabushitake"],
	polishCommonNames: [
		"Soplówka jeżowata",
		"Grzyb lwie grzywy",
		"Yamabushitake",
	],
	category: "NOOTROPIC",
	description:
		"Medicinal mushroom containing unique compounds that stimulate nerve growth factor (NGF) production and support neurogenesis.",
	polishDescription:
		"Grzyb leczniczy zawierający unikalne związki stymulujące produkcję czynnika wzrostu nerwów (NGF) i wspierające neurogenezę.",

	activeCompounds: [
		{
			name: "Hericenones",
			polishName: "Hericenony",
			concentration: "0.5-3% dry weight",
			bioavailability: 85,
			halfLife: "4-6 hours",
			metabolicPathway: ["NGF stimulation", "Neurotrophin signaling"],
			targetReceptors: ["TrkA receptor", "p75NTR receptor"],
		},
		{
			name: "Erinacines",
			polishName: "Erinacyny",
			concentration: "0.1-0.5% dry weight",
			bioavailability: 90,
			halfLife: "6-8 hours",
			metabolicPathway: ["Blood-brain barrier crossing", "NGF synthesis"],
			targetReceptors: ["Neurotrophin receptors", "CREB pathway"],
		},
	],

	clinicalApplications: [
		{
			condition: "Mild Cognitive Impairment",
			polishCondition: "Łagodne zaburzenia poznawcze",
			effectivenessRating: 7,
			evidenceLevel: "MODERATE",
			efficacy: "moderate",
			recommendedDose: "1000-3000mg daily",
			duration: "16 weeks minimum",
		},
		{
			condition: "Neuroprotection",
			polishCondition: "Neuroprotekcja",
			effectivenessRating: 8,
			evidenceLevel: "MODERATE",
			efficacy: "high",
			recommendedDose: "500-1000mg daily",
			duration: "Long-term",
		},
	],

	mechanisms: [
		{
			pathway: "Nerve Growth Factor Stimulation",
			polishPathway: "Stymulacja czynnika wzrostu nerwów",
			description:
				"Hericenones and erinacines cross the blood-brain barrier and stimulate NGF synthesis",
			polishDescription:
				"Hericenony i erinacyny przekraczają barierę krew-mózg i stymulują syntezę NGF",
			targetSystems: ["Hippocampus", "Cerebral cortex", "Basal forebrain"],
			evidenceLevel: "STRONG",
			timeToEffect: "4-8 weeks",
		},
	],

	dosageGuidelines: {
		therapeuticRange: {
			min: 500,
			max: 3000,
			unit: "mg",
		},
		timing: ["With meals", "Morning or afternoon"],
		withFood: true,
		contraindications: [],
		polishContraindications: [],
		interactions: [],
	},

	sideEffects: [
		{
			effect: "Skin rash",
			polishEffect: "Wysypka skórna",
			frequency: "uncommon",
			severity: "mild",
			reversible: true,
			management: "Discontinue use, consult healthcare provider",
			polishManagement: "Przerwać stosowanie, skonsultować się z lekarzem",
		},
		{
			effect: "Gastrointestinal discomfort",
			polishEffect: "Dyskomfort żołądkowo-jelitowy",
			frequency: "uncommon",
			severity: "mild",
			reversible: true,
			management: "Take with food, reduce dose",
			polishManagement: "Przyjmować z jedzeniem, zmniejszyć dawkę",
		},
	],

	interactions: [
		{
			substance: "Anticoagulants",
			polishSubstance: "Antykoagulanty",
			type: "synergistic",
			description: "Potential additive antiplatelet effects",
			severity: "minor",
			clinicalSignificance: "Monitor for bleeding",
			polishClinicalSignificance: "Monitorować pod kątem krwawienia",
			recommendation: "Use caution, monitor closely",
			polishRecommendation: "Zachować ostrożność, ściśle monitorować",
		},
	],

	evidenceLevel: "MODERATE",
	researchStudies: [
		{
			id: "mori-2009",
			title:
				"Improving effects of the mushroom Yamabushitake on mild cognitive impairment",
			polishTitle:
				"Poprawiające działanie grzyba Yamabushitake na łagodne zaburzenia poznawcze",
			authors: ["Mori K", "Inatomi S", "Ouchi K", "et al."],
			journal: "Phytotherapy Research",
			year: 2009,
			studyType: "RANDOMIZED_CONTROLLED_TRIAL",
			primaryOutcome: "Study outcome",
			polishPrimaryOutcome: "Wynik badania",
			findings: "Study findings",
			polishFindings: "Wyniki badania",
			lastUpdated: "2024-01-15T00:00:00Z",
			sampleSize: 30,
			duration: "16 weeks",
			results: "Significant improvement in cognitive scores (p<0.01)",
			polishResults: "Znacząca poprawa wyników poznawczych (p<0,01)",
			evidenceLevel: "MODERATE",
			pubmedId: "18844328",
			doi: "10.1002/ptr.2634",
		},
	],

	tags: ["nootropic", "neuroprotection", "NGF", "neurogenesis", "mushroom"],
	lastUpdated: "2024-01-15T10:00:00Z",
	createdAt: "2024-01-01T00:00:00Z",
	knowledgeNodeId: "lions-mane-node",

	educationalContent: {
		beginnerExplanation:
			"Lion's Mane is a unique mushroom that can help grow new brain cells and protect existing ones.",
		polishBeginnerExplanation:
			"Soplówka jeżowata to unikalny grzyb, który może pomóc w wytwarzaniu nowych komórek mózgowych i ochronie istniejących.",
		intermediateDetails:
			"Contains hericenones and erinacines that stimulate nerve growth factor (NGF), promoting neurogenesis and myelin repair.",
		polishIntermediateDetails:
			"Zawiera hericenony i erinacyny, które stymulują czynnik wzrostu nerwów (NGF), promując neurogenezę i naprawę mieliny.",
		expertAnalysis:
			"The bioactive compounds in Lion's Mane activate the TrkA/p75NTR signaling pathway, leading to CREB-mediated transcription of neurotrophic factors.",
		polishExpertAnalysis:
			"Bioaktywne związki w Soplówce jeżowatej aktywują szlak sygnałowy TrkA/p75NTR, prowadząc do CREB-mediowanej transkrypcji czynników neurotroficznych.",
		keyTakeaways: [
			"Unique mechanism through NGF stimulation",
			"Supports both neuroprotection and neurogenesis",
			"Generally well-tolerated with minimal side effects",
			"Requires consistent use for 8+ weeks for benefits",
		],
		polishKeyTakeaways: [
			"Unikalny mechanizm poprzez stymulację NGF",
			"Wspiera zarówno neuroprotekcję jak i neurogenezę",
			"Ogólnie dobrze tolerowany z minimalnymi skutkami ubocznymi",
			"Wymaga konsekwentnego stosowania przez 8+ tygodni dla korzyści",
		],
	},

	clinicalEvidence: {
		totalStudies: 45,
		metaAnalyses: 2,
		rctCount: 8,
		observationalStudies: 15,
		lastReviewDate: "2024-01-01",
		cochranReviews: [],
	},

	pharmacokinetics: {
		absorption: {
			rate: "85-90% bioavailable",
			factors: [
				"Food intake improves absorption",
				"Standardized extracts preferred",
			],
			polishFactors: [
				"Spożycie pokarmu poprawia wchłanianie",
				"Preferowane standaryzowane ekstrakty",
			],
			optimalTiming: "With meals for better absorption",
			polishOptimalTiming: "Z posiłkami dla lepszego wchłaniania",
		},
		distribution: {
			volumeOfDistribution: "Widely distributed, crosses blood-brain barrier",
			proteinBinding: "Moderate protein binding",
			brainPenetration: true,
			placentalCrossing: true,
		},
		metabolism: {
			primaryPathway: "Hepatic metabolism, active metabolites formed",
			polishPrimaryPathway:
				"Metabolizm wątrobowy, tworzenie aktywnych metabolitów",
			enzymes: ["CYP450 enzymes", "Phase II conjugation"],
			metabolites: ["Various triterpenes", "Polysaccharide fragments"],
		},
		elimination: {
			halfLife: "4-8 hours (active compounds)",
			excretionRoute: "Hepatic metabolism, renal excretion",
			renalClearance: "60-70%",
		},
	},

	safetyProfile: {
		pregnancyCategory: "Unknown",
		breastfeedingSafety: "Unknown",
		pediatricUse: {
			approved: false,
			ageLimit: "Not recommended under 18",
			specialConsiderations: ["Insufficient safety data"],
			polishSpecialConsiderations: ["Niewystarczające dane bezpieczeństwa"],
		},
		elderlyConsiderations: ["Generally safe", "Start with lower doses"],
		polishElderlyConsiderations: [
			"Ogólnie bezpieczny",
			"Zaczynać od niższych dawek",
		],
		hepaticImpairment: "Use caution, may need dose reduction",
		polishHepaticImpairment: "Zachować ostrożność, może wymagać redukcji dawki",
		renalImpairment: "No specific adjustments needed",
		polishRenalImpairment: "Brak specjalnych dostosowań",
	},

	qualityConsiderations: {
		standardization:
			"Look for standardized extracts with verified hericenones/erinacines content",
		polishStandardization:
			"Szukać standaryzowanych ekstraktów ze zweryfikowaną zawartością hericenów/erinacyn",
		bioavailabilityForms: [
			"Standardized extract",
			"Whole mushroom powder",
			"Dual extract",
		],
		polishBioavailabilityForms: [
			"Standaryzowany ekstrakt",
			"Proszek z całego grzyba",
			"Podwójny ekstrakt",
		],
		qualityMarkers: [
			"Beta-glucan content",
			"Hericenones/erinacines levels",
			"Heavy metal testing",
		],
		polishQualityMarkers: [
			"Zawartość beta-glukanów",
			"Poziomy hericenów/erinacyn",
			"Testowanie metali ciężkich",
		],
		storageRequirements: "Cool, dry place, protect from light",
		polishStorageRequirements: "Chłodne, suche miejsce, chronić przed światłem",
		shelfLife: "2-3 years unopened",
	},

	economicData: {
		averageCostPerMonth: {
			low: 25,
			average: 45,
			high: 80,
			currency: "EUR",
		},
		costEffectivenessRating: "Good",
		polishCostEffectivenessRating: "Dobra",
		valueProposition:
			"Moderate pricing for unique neurogenic benefits not found in other supplements",
		polishValueProposition:
			"Umiarkowana cena za unikalne korzyści neurogenne niedostępne w innych suplementach",
	},
};
