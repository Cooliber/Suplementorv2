/**
 * Rhodiola Rosea
 * Comprehensive supplement profile with Polish translations
 */

import type { ComprehensiveSupplementProfile } from "./types";

export const rhodiola_rosea: ComprehensiveSupplementProfile = {
	id: "rhodiola-rosea",
	name: "Rhodiola Rosea",
	polishName: "Różeniec górski",
	scientificName: "Rhodiola rosea",
	commonNames: ["Golden Root", "Arctic Root", "Rose Root"],
	polishCommonNames: ["Złoty korzeń", "Korzeń arktyczny", "Korzeń różany"],
	category: "ADAPTOGEN",

	activeCompounds: [
		{
			name: "Salidroside",
			polishName: "Salidrozyd",
			concentration: "1-3% in standardized extracts",
			bioavailability: 75,
			halfLife: "4-6 hours",
			metabolicPathway: ["Hepatic metabolism", "Phase II conjugation"],
			targetReceptors: ["Monoamine transporters", "HPA axis receptors"],
		},
		{
			name: "Rosavin",
			polishName: "Rozawina",
			concentration: "3-5% in standardized extracts",
			bioavailability: 70,
			halfLife: "3-5 hours",
			metabolicPathway: ["Hepatic metabolism"],
			targetReceptors: ["Stress response pathways"],
		},
	],

	clinicalApplications: [
		{
			condition: "Stress and Fatigue Reduction",
			polishCondition: "Redukcja stresu i zmęczenia",
			effectivenessRating: 9,
			evidenceLevel: "STRONG",
			efficacy: "high",
			recommendedDose: "200-400mg daily (3% rosavins, 1% salidroside)",
			duration: "4-8 weeks",
		},
		{
			condition: "Cognitive Performance Under Stress",
			polishCondition: "Wydajność poznawcza pod wpływem stresu",
			effectivenessRating: 8,
			evidenceLevel: "STRONG",
			efficacy: "high",
			recommendedDose: "300-600mg daily",
			duration: "2-6 weeks",
		},
	],

	mechanisms: [
		{
			pathway: "HPA Axis Modulation",
			polishPathway: "Modulacja osi HPA",
			description:
				"Rhodiola modulates the hypothalamic-pituitary-adrenal axis, reducing cortisol response to stress",
			polishDescription:
				"Rhodiola moduluje oś podwzgórze-przysadka-nadnercza, zmniejszając odpowiedź kortyzolu na stres",
			targetSystems: ["Hypothalamus", "Pituitary gland", "Adrenal cortex"],
			evidenceLevel: "STRONG",
			timeToEffect: "1-2 weeks",
		},
		{
			pathway: "Monoamine Regulation",
			polishPathway: "Regulacja monoamin",
			description:
				"Enhances serotonin, dopamine, and norepinephrine activity while protecting against depletion",
			polishDescription:
				"Wzmacnia aktywność serotoniny, dopaminy i noradrenaliny, chroniąc przed wyczerpaniem",
			targetSystems: ["Synaptic terminals", "Monoamine transporters"],
			evidenceLevel: "MODERATE",
			timeToEffect: "1-3 weeks",
		},
	],

	pharmacokinetics: {
		absorption: {
			rate: "Good (75% bioavailability)",
			factors: ["Empty stomach preferred", "Morning administration optimal"],
			polishFactors: ["Preferowany pusty żołądek", "Optymalne podawanie rano"],
			optimalTiming: "Morning, 30 minutes before breakfast",
			polishOptimalTiming: "Rano, 30 minut przed śniadaniem",
		},
		distribution: {
			volumeOfDistribution: "Wide distribution, good CNS penetration",
			proteinBinding: "moderate",
			brainPenetration: true,
			placentalCrossing: true,
		},
		metabolism: {
			primaryPathway: "Hepatic phase II conjugation",
			polishPrimaryPathway: "Wątrobowa koniugacja fazy II",
			enzymes: ["UGT enzymes", "SULT enzymes"],
			metabolites: ["Salidroside metabolites", "Rosavin metabolites"],
		},
		elimination: {
			halfLife: "4-6 hours",
			excretionRoute: "Renal excretion",
			renalClearance: "Rapid in healthy individuals",
		},
	},

	sideEffects: [
		{
			effect: "Jitteriness/Agitation",
			polishEffect: "Nerwowość/Pobudzenie",
			frequency: "uncommon",
			severity: "mild",
			reversible: true,
			management: "Reduce dose, avoid afternoon doses",
			polishManagement: "Zmniejszyć dawkę, unikać dawek popołudniowych",
		},
		{
			effect: "Insomnia",
			polishEffect: "Bezsenność",
			frequency: "uncommon",
			severity: "mild",
			reversible: true,
			management: "Take only in morning, reduce dose",
			polishManagement: "Przyjmować tylko rano, zmniejszyć dawkę",
		},
	],

	interactions: [
		{
			substance: "Antidepressants (MAOIs)",
			polishSubstance: "Antydepresanty (IMAO)",
			type: "synergistic",
			description: "Additive monoamine effects",
			severity: "severe",
			clinicalSignificance: "Risk of serotonin syndrome",
			polishClinicalSignificance: "Ryzyko zespołu serotoninowego",
			recommendation: "Avoid combination",
			polishRecommendation: "Unikać kombinacji",
		},
	],

	evidenceLevel: "STRONG",
	researchStudies: [
		{
			id: "darbinyan-2000",
			title:
				"Rhodiola rosea in stress induced fatigue - a double blind cross-over study",
			polishTitle:
				"Rhodiola rosea w zmęczeniu wywołanym stresem - podwójnie ślepe badanie krzyżowe",
			authors: ["Darbinyan V", "Kteyan A", "Panossian A", "et al."],
			journal: "Phytomedicine",
			year: 2000,
			studyType: "RANDOMIZED_CONTROLLED_TRIAL",
			evidenceLevel: "MODERATE",

			findings: "Study findings",
			polishFindings: "Wyniki badania",
			lastUpdated: "2024-01-15T00:00:00Z",
			participantCount: 56,
			duration: "4 weeks",
			primaryOutcome: "Fatigue reduction",
			polishPrimaryOutcome: "Redukcja zmęczenia",
			results: "Significant improvement in fatigue and stress symptoms",
			polishResults: "Znacząca poprawa w objawach zmęczenia i stresu",
			doi: "10.1016/S0944-7113(00)80055-0",
		},
	],

	educationalContent: {
		beginnerExplanation:
			"Rhodiola Rosea is an adaptogenic herb that helps the body cope with stress and reduces fatigue while improving mental performance.",
		polishBeginnerExplanation:
			"Rhodiola Rosea to adaptogenne zioło, które pomaga organizmowi radzić sobie ze stresem i zmniejsza zmęczenie, poprawiając wydajność umysłową.",
		intermediateDetails:
			"Rhodiola works by modulating the stress response system and supporting neurotransmitter balance. It's particularly effective for stress-induced fatigue and cognitive decline.",
		polishIntermediateDetails:
			"Rhodiola działa poprzez modulację systemu odpowiedzi na stres i wspieranie równowagi neuroprzekaźników. Jest szczególnie skuteczna w zmęczeniu wywołanym stresem i spadku funkcji poznawczych.",
		expertAnalysis:
			"Clinical evidence strongly supports Rhodiola's anti-fatigue and stress-protective effects. The herb demonstrates biphasic dose response with optimal effects at moderate doses.",
		polishExpertAnalysis:
			"Dowody kliniczne silnie wspierają działanie Rhodioli przeciwzmęczeniowe i ochronne przed stresem. Zioło wykazuje dwufazową odpowiedź dawkową z optymalnym działaniem przy umiarkowanych dawkach.",
		keyTakeaways: [
			"Powerful adaptogenic herb",
			"Reduces stress and fatigue",
			"Improves cognitive performance under stress",
			"Take in morning to avoid insomnia",
		],
		polishKeyTakeaways: [
			"Potężne zioło adaptogenne",
			"Zmniejsza stres i zmęczenie",
			"Poprawia wydajność poznawczą pod wpływem stresu",
			"Przyjmować rano, aby uniknąć bezsenności",
		],
	},

	clinicalEvidence: {
		totalStudies: 35,
		metaAnalyses: 4,
		rctCount: 18,
		observationalStudies: 13,
		lastReviewDate: "2023-09-10",
		cochranReviews: [],
	},

	qualityConsiderations: {
		standardization:
			"Look for extracts standardized to 3% rosavins and 1% salidroside",
		polishStandardization:
			"Szukać ekstraktów standaryzowanych do 3% rozawin i 1% salidrozydu",
		bioavailabilityForms: ["Standardized extract", "Root powder"],
		polishBioavailabilityForms: [
			"Standaryzowany ekstrakt",
			"Proszek z korzenia",
		],
		qualityMarkers: [
			"Rosavin/salidroside ratio",
			"Heavy metal testing",
			"Authenticity verification",
		],
		polishQualityMarkers: [
			"Stosunek rozawina/salidrozyd",
			"Testowanie metali ciężkich",
			"Weryfikacja autentyczności",
		],
		storageRequirements: "Cool, dry place, protect from light",
		polishStorageRequirements: "Chłodne, suche miejsce, chronić przed światłem",
		shelfLife: "2-3 years unopened",
	},

	economicData: {
		averageCostPerMonth: {
			low: 18,
			average: 30,
			high: 50,
			currency: "EUR",
		},
		costEffectivenessRating: "Good",
		polishCostEffectivenessRating: "Dobra",
		valueProposition: "Moderate cost for proven stress and fatigue benefits",
		polishValueProposition:
			"Umiarkowany koszt za udowodnione korzyści przeciwstresowe i przeciwzmęczeniowe",
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
