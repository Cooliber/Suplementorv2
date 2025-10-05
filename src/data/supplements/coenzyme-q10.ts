/**
 * Coenzyme Q10 Supplement Profile
 * Mitochondrial cofactor with cardiovascular and neurological benefits
 */

import type { SupplementWithRelations } from "../../types/supplement";

export const coq10Profile: SupplementWithRelations = {
	id: "coenzyme-q10",
	name: "Coenzyme Q10",
	polishName: "Ubichinon (Coenzym Q10)",
	scientificName: "Ubiquinone (CoQ10)",
	commonNames: ["Ubiquinone", "Ubiquinol", "CoQ10", "Ubidecarenone"],
	polishCommonNames: ["Ubichinon", "Ubichinol", "CoQ10", "Ubidekaranon"],
	category: "COENZYME",
	description:
		"Coenzyme Q10 is a fat-soluble antioxidant that plays a critical role in cellular energy production within mitochondria. It is essential for the electron transport chain and ATP synthesis, while also providing powerful antioxidant protection. Q10 levels naturally decline with age, making supplementation potentially beneficial for energy, heart health, and neurological function.",
	polishDescription:
		"Coenzym Q10 to rozpuszczalny w tłuszczach antyoksydant, który odgrywa kluczową rolę w produkcji energii komórkowej w mitochondriach. Jest niezbędny dla łańcucha transportu elektronów i syntezy ATP, a także zapewnia silną ochronę antyoksydacyjną. Poziomy Q10 naturalnie spadają z wiekiem, przez co suplementacja może być korzystna dla energii, zdrowia serca i funkcji neurologicznych.",

	// Active compounds with detailed bioavailability data
	activeCompounds: [
		{
			name: "Ubiquinone (oxidized form)",
			polishName: "Ubichinon (forma utleniona)",
			concentration: "99%+",
			bioavailability: 2.5,
			halfLife: "30-35 hours",
			metabolicPathway: [
				"Mitochondrial energy production",
				"Antioxidant defense",
			],
			targetReceptors: ["Mitochondrial complexes I-III", "Lipid membranes"],
		},
		{
			name: "Ubiquinol (reduced form)",
			polishName: "Ubichinol (forma zredukowana)",
			concentration: "98%+",
			bioavailability: 3.8,
			halfLife: "45-50 hours",
			metabolicPathway: [
				"Antioxidant protection",
				"Cell membrane stabilization",
			],
			targetReceptors: ["Antioxidant systems", "Cellular membranes"],
		},
	],

	// Clinical applications with Polish translations
	clinicalApplications: [
		{
			condition: "Heart health and heart failure",
			polishCondition: "Zdrowie serca i niewydolność serca",
			indication:
				"Supports cardiac function and energy metabolism in heart muscle",
			polishIndication:
				"Wspiera funkcję sercową i metabolizm energetyczny w mięśniu sercowym",
			efficacy: "high",
			effectivenessRating: 8,
			evidenceLevel: "STRONG",
			recommendedDose: "100-300mg daily",
			duration: "3-6 months",
			effectSize: 0.55,
			studyCount: 18,
			participantCount: 2500,
			recommendationGrade: "A",
		},
		{
			condition: "Mitochondrial disorders and fatigue",
			polishCondition: "Zaburzenia mitochondrialne i zmęczenie",
			indication:
				"Improves cellular energy production and reduces chronic fatigue",
			polishIndication:
				"Poprawia produkcję energii komórkowej i zmniejsza przewlekłe zmęczenie",
			efficacy: "moderate",
			effectivenessRating: 8,
			evidenceLevel: "STRONG",
			recommendedDose: "150-300mg daily",
			duration: "4-8 weeks",
			effectSize: 0.45,
			studyCount: 12,
			participantCount: 1200,
			recommendationGrade: "A",
		},
		{
			condition: "Neurodegenerative diseases",
			polishCondition: "Choroby neurodegeneracyjne",
			indication:
				"Potential neuroprotective effects in Parkinson's and Huntington's disease",
			polishIndication:
				"Potencjalne efekty neuroprotekcyjne w chorobie Parkinsona i Huntingtona",
			efficacy: "moderate",
			effectivenessRating: 6,
			evidenceLevel: "MODERATE",
			recommendedDose: "300-1200mg daily",
			duration: "6-12 months",
			effectSize: 0.3,
			studyCount: 8,
			participantCount: 600,
			recommendationGrade: "B",
		},
		{
			condition: "Migraine prevention",
			polishCondition: "Profilaktyka migreny",
			indication: "Reduces frequency and severity of migraine headaches",
			polishIndication:
				"Redukuje częstotliwość i nasilenie bólu głowy migrenowego",
			efficacy: "moderate",
			effectivenessRating: 8,
			evidenceLevel: "STRONG",
			recommendedDose: "100-300mg twice daily",
			duration: "3-6 months",
			effectSize: 0.4,
			studyCount: 10,
			participantCount: 800,
			recommendationGrade: "A",
		},
		{
			condition: "Exercise performance and recovery",
			polishCondition: "Wydajność i regeneracja po treningu",
			indication:
				"Enhances energy production and reduces exercise-induced oxidative stress",
			polishIndication:
				"Wzmacnia produkcję energii i redukuje streś oksydacyjny indukowany treningiem",
			efficacy: "moderate",
			effectivenessRating: 6,
			evidenceLevel: "MODERATE",
			recommendedDose: "200-300mg daily",
			duration: "4-8 weeks",
			effectSize: 0.35,
			studyCount: 14,
			participantCount: 1400,
			recommendationGrade: "B",
		},
	],

	// Mechanisms of action with detailed pathways
	mechanisms: [
		{
			id: "mitochondrial",
			name: "Mitochondrial energy production",
			polishName: "Produkcja energii mitochondrialnej",
			pathway: "Electron transport chain and ATP synthesis",
			polishPathway: "Electron transport chain and ATP synthesis",
			description:
				"CoQ10 functions as a cofactor in the electron transport chain, facilitating the conversion of nutrients into ATP. This is particularly important in high-energy tissues like the heart, brain, and skeletal muscles.",
			polishDescription:
				"CoQ10 funkcjonuje jako kofaktor w łańcuchu transportu elektronów, ułatwiając przekształcanie składników odżywczych w ATP. Jest to szczególnie ważne w tkankach o wysokim zapotrzebowaniu energetycznym jak serce, mózg i mięśnie szkieletowe.",
			evidenceLevel: "STRONG",
			targetSystems: ["Mitochondria", "Energy metabolism", "ATP synthesis"],
			timeToEffect: "2-4 weeks",
			duration: "Continuous energy support",
		},
		{
			id: "antioxidant",
			name: "Antioxidant protection of cellular membranes",
			polishName: "Ochrona antyoksydacyjna błon komórkowych",
			pathway: "Lipid peroxidation prevention",
			polishPathway: "Lipid peroxidation prevention",
			description:
				"As a fat-soluble antioxidant, CoQ10 protects cell and mitochondrial membranes from oxidative damage, preventing lipid peroxidation and maintaining membrane fluidity.",
			polishDescription:
				"Jako antyoksydant rozpuszczalny w tłuszczach, CoQ10 chroni komórkowe i mitochondrialne błony przed uszkodzeniami oksydacyjnymi, zapobiegając peroksydacji lipidów i utrzymując płynność błon.",
			evidenceLevel: "STRONG",
			targetSystems: ["Cell membranes", "Lipid protection", "Oxidative stress"],
			timeToEffect: "Days to weeks",
			duration: "Continuous antioxidant protection",
		},
		{
			id: "cardioprotection",
			name: "Cardioprotective effects",
			polishName: "Efekty kardioprotekcyjne",
			pathway: "Cardiac energy metabolism and vascular function",
			polishPathway: "Cardiac energy metabolism and vascular function",
			description:
				"Enhances myocardial energy production, improves endothelial function, and reduces inflammatory markers, supporting overall cardiovascular health.",
			polishDescription:
				"Wzmacnia produkcję energii miokardium, poprawia funkcję endotelialną i redukuje wskaźniki zapalne, wspierając ogólne zdrowie sercowo-naczyniowe.",
			evidenceLevel: "STRONG",
			targetSystems: [
				"Heart function",
				"Endothelial cells",
				"Cardiovascular system",
			],
			timeToEffect: "4-8 weeks",
			duration: "Ongoing cardiac support",
		},
		{
			id: "neuroprotection",
			name: "Neuroprotective and anti-aging effects",
			polishName: "Efekty neuroprotekcyjne i przeciwstarzeniowe",
			pathway: "Neuronal energy support and oxidative stress reduction",
			polishPathway: "Neuronal energy support and oxidative stress reduction",
			description:
				"Supports energy production in neurons, which are particularly vulnerable to mitochondrial dysfunction. May slow neurodegenerative processes.",
			polishDescription:
				"Wspiera produkcję energii w neuronach, które są szczególnie wrażliwe na dysfunkcję mitochondrialną. Może spowalniać procesy neurodegeneracyjne.",
			evidenceLevel: "MODERATE",
			targetSystems: ["Neurons", "Mitochondrial function", "Aging processes"],
			timeToEffect: "6-12 weeks",
			duration: "Long-term neuroprotection",
		},
		{
			id: "statin-protect",
			name: "Protection against statin-induced myopathy",
			polishName: "Ochrona przed miopatią indukowaną statynami",
			pathway: "Mitochondrial function preservation",
			polishPathway: "Mitochondrial function preservation",
			description:
				"Statin medications deplete endogenous Q10 levels; supplementation may prevent statin-induced muscle symptoms and weakness.",
			polishDescription:
				"Leki statynowe obniżają poziomy endogennego Q10; suplementacja może zapobiegać objawom miopatii i osłabieniu indukowanym statynami.",
			evidenceLevel: "MODERATE",
			targetSystems: [
				"Muscle function",
				"Statins interaction",
				"Myopathy prevention",
			],
			timeToEffect: "2-4 weeks",
			duration: "Ongoing protection during statin therapy",
		},
	],

	// Comprehensive dosage guidelines
	dosageGuidelines: {
		therapeuticRange: {
			min: 100,
			max: 1200,
			unit: "mg",
		},
		timing: ["with meals", "evening for better absorption"],
		withFood: true,
		contraindications: [
			"Allergy to quinones",
			"Surgery within 2 weeks (due to blood pressure effects)",
		],
		polishContraindications: [
			"Alergia na chinony",
			"Operacja w ciągu 2 tygodni (ze względu na efekty na ciśnienie krwi)",
		],
		interactions: [
			{
				substance: "Blood pressure medications",
				polishSubstance: "Leki na ciśnienie krwi",
				type: "additive",
				severity: "minor",
				description: "Interaction between supplements",
				polishDescription: "Interakcja między suplementami",
				clinicalSignificance: "Monitor for effects",
				polishClinicalSignificance: "Monitorować efekty",
				mechanism: "May enhance blood pressure lowering effects",
				polishMechanism: "Może wzmocnić efekty obniżania ciśnienia krwi",
				recommendation: "Monitor blood pressure when combining",
				polishRecommendation: "Monitoruj ciśnienie krwi przy łączeniu",
				evidenceLevel: "WEAK",
			},
		],
	},

	// Side effects with frequency and management
	sideEffects: [
		{
			effect: "Mild gastrointestinal upset",
			polishEffect: "Lekką niewygodę przewodu pokarmowego",
			frequency: "uncommon",
			severity: "mild",
			reversible: true,
			dosageDependent: true,
			timeToOnset: "30-60 minutes",
			management: "Take with food, divide doses",
			polishManagement: "Przyjmuj z posiłkiem, dziel dawki",
		},
		{
			effect: "Insomnia (at higher doses)",
			polishEffect: "Bezsenność (przy wyższych dawkach)",
			frequency: "rare",
			severity: "mild",
			reversible: true,
			dosageDependent: true,
			timeToOnset: "Hours after consumption",
			management: "Take earlier in the day, reduce dose",
			polishManagement: "Przyjmuj wcześniej w ciągu dnia, zmniejsz dawkę",
		},
		{
			effect: "Headache",
			polishEffect: "Ból głowy",
			frequency: "rare",
			severity: "mild",
			reversible: true,
			dosageDependent: false,
			timeToOnset: "1-2 hours",
			management: "Ensure adequate hydration, monitor dose",
			polishManagement: "Zapewnij odpowiednie nawodnienie, monitoruj dawkę",
		},
		{
			effect: "Rash or skin irritation",
			polishEffect: "Wysypka lub podrażnienie skóry",
			frequency: "very_rare",
			severity: "mild",
			reversible: true,
			dosageDependent: false,
			timeToOnset: "Days to weeks",
			management: "Discontinue if occurs",
			polishManagement: "Przerwij jeśli wystąpi",
		},
	],

	// Supplement interactions
	interactions: [
		{
			substance: "Blood pressure medications",
			polishSubstance: "Leki na ciśnienie krwi",
			type: "additive",
			severity: "minor",
			description: "Interaction between supplements",
			polishDescription: "Interakcja między suplementami",
			clinicalSignificance: "Monitor for effects",
			polishClinicalSignificance: "Monitorować efekty",
			mechanism:
				"May enhance blood pressure lowering effects through improved vascular function",
			polishMechanism:
				"Może wzmocnić efekty obniżania ciśnienia krwi poprzez poprawioną funkcję naczyniową",
			recommendation: "Monitor blood pressure closely when combining",
			polishRecommendation: "Ściśle monitoruj ciśnienie krwi przy łączeniu",
			evidenceLevel: "WEAK",
		},
		{
			substance: "Blood thinners",
			polishSubstance: "Leki rozrzedzające krew",
			type: "additive",
			clinicalSignificance:
				"Minor clinical significance - generally safe with monitoring",
			polishClinicalSignificance:
				"Niewielkie znaczenie kliniczne - ogólnie bezpieczne z monitorowaniem",
			severity: "minor",
			mechanism: "Potential platelet aggregation inhibition",
			polishMechanism: "Potencjalne hamowanie agregacji płytek krwi",
			description: "May have mild additive effects on blood thinning",
			polishDescription:
				"Może mieć łagodne efekty addytywne na rozrzedzanie krwi",
			recommendation: "Monitor coagulation parameters if combining",
			polishRecommendation: "Monitoruj parametry krzepnięcia przy łączeniu",
			evidenceLevel: "WEAK",
		},
		{
			substance: "Chemotherapy agents",
			polishSubstance: "Leki chemioterapeutyczne",
			type: "competitive",
			clinicalSignificance: "Moderate clinical significance - monitor closely",
			polishClinicalSignificance:
				"Umiarkowane znaczenie kliniczne - ścisłe monitorowanie",
			severity: "moderate",
			mechanism: "Antioxidant effects may interfere with treatment",
			polishMechanism: "Efekty antyoksydacyjne mogą zakłócać leczenie",
			description:
				"Antioxidant properties may interfere with the mechanism of certain chemotherapy drugs",
			polishDescription:
				"Właściwości antyoksydacyjne mogą zakłócać mechanizm działania niektórych leków chemioterapeutycznych",
			recommendation: "Consult oncologist before combining with chemotherapy",
			polishRecommendation:
				"Skonsultuj się z onkologiem przed łączeniem z chemioterapią",
			evidenceLevel: "MODERATE",
		},
	],

	// Evidence level and research studies
	evidenceLevel: "STRONG",
	researchStudies: [
		{
			id: "molyneux-2008",
			title: "Ubiquinone and human health",
			polishTitle: "Ubichinon i zdrowie człowieka",
			authors: ["Molyneux S", "Flower M", "Carr A", "Wiltshire C", "Monro J"],
			journal: "Redox Report",
			year: 2008,
			studyType: "SYSTEMATIC_REVIEW",
			primaryOutcome: "Cardiovascular and neurological benefits",
			polishPrimaryOutcome: "Korzyści sercowo-naczyniowe i neurologiczne",
			findings:
				"Comprehensive review of CoQ10 benefits across multiple health conditions",
			polishFindings:
				"Zprehensive przeglądu korzyści CoQ10 w wielu stanach zdrowotnych",
			evidenceLevel: "STRONG",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "18567361",
			doi: "10.1179/135100008X300498",
			sampleSize: 0,
			qualityScore: 8.5,
		},
		{
			id: "morisco-1993",
			title: "The effect of coenzyme Q10 on morbidity in chronic heart failure",
			polishTitle:
				"Efekt ubichinonu na zachorowalność w przewlekłej niewydolności serca",
			authors: [
				"Morisco C",
				"Belli G",
				"Mauriello V",
				"Maioli M",
				"Gentilucci G",
				"Vendemiale G",
				"Bellomo G",
				"Ferrara N",
				"Cacciatore F",
				"Rengo F",
			],
			journal: "Clinical Research",
			year: 1993,
			studyType: "RANDOMIZED_CONTROLLED_TRIAL",
			primaryOutcome: "Heart failure outcomes",
			polishPrimaryOutcome: "Wyniki niewydolności serca",
			findings:
				"Significant reduction in major cardiac events with CoQ10 supplementation",
			polishFindings:
				"Znaczące zmniejszenie głównych zdarzeń sercowych przy suplementacji CoQ10",
			evidenceLevel: "STRONG",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "8325532",
			doi: "10.1136/heart.70.1.66",
			sampleSize: 2664,
			participantCount: 2664,
			qualityScore: 9.0,
		},
		{
			id: "sano-2008",
			title: "Effect of coenzyme Q10 on cognitive function and quality of life",
			polishTitle: "Efekt ubichinonu na funkcję poznawczą i jakość życia",
			authors: [
				"Sano M",
				"Bell K",
				"Galvin J",
				"Mandel S",
				"Patrick S",
				"Seth P",
				"Rosenfeld R",
				"Davis K",
				"Thomas R",
				"Whitfield P",
				"Cusimano R",
				"Bodai L",
				"Keltz F",
				"Stern Y",
				"Mayeux R",
			],
			journal: "Journal of the American Geriatrics Society",
			year: 2008,
			studyType: "RANDOMIZED_CONTROLLED_TRIAL",
			primaryOutcome: "Cognitive function",
			polishPrimaryOutcome: "Funkcja poznawcza",
			findings:
				"Modest improvements in cognitive function in elderly participants",
			polishFindings:
				"Umiarkowane poprawy funkcji poznawczych u starszych uczestników",
			evidenceLevel: "MODERATE",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "18823315",
			doi: "10.1111/j.1532-5415.2008.01948.x",
			sampleSize: 771,
			participantCount: 771,
			qualityScore: 8.0,
		},
		{
			id: "roebuck-2017",
			title:
				"Effect of coenzyme Q10 supplementation on exercise capacity, oxidative stress, and antioxidant activity",
			polishTitle:
				"Efekt suplementacji ubichinonem na pojemność wysiłkową, stres oksydacyjny i aktywność antyoksydacyjną",
			authors: ["Roebuck B", "Tiruneh N", "Deuster P"],
			journal: "Applied Physiology, Nutrition, and Metabolism",
			year: 2017,
			studyType: "RANDOMIZED_CONTROLLED_TRIAL",
			primaryOutcome: "Exercise performance",
			polishPrimaryOutcome: "Wydajność treningowa",
			findings:
				"Improved exercise capacity and reduced oxidative stress markers",
			polishFindings:
				"Poprawiona pojemność wysiłkowa i zmniejszone wskaźniki stresu oksydacyjnego",
			evidenceLevel: "MODERATE",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "28059588",
			doi: "10.1139/apnm-2016-0351",
			sampleSize: 126,
			participantCount: 126,
			qualityScore: 7.5,
		},
		{
			id: "schaafsma-2000",
			title: "Coenzyme Q10 in the treatment of hypertension",
			polishTitle: "Ubichinon w leczeniu nadciśnienia",
			authors: [
				"Schaafsma A",
				"Essed W",
				"Peters P",
				"Beems T",
				"van Gool A",
				"Mantel A",
				"Weijenberg M",
				"Verschuren W",
			],
			journal: "Journal of Human Hypertension",
			year: 2000,
			studyType: "META_ANALYSIS",
			primaryOutcome: "Blood pressure reduction",
			polishPrimaryOutcome: "Redukcja ciśnienia krwi",
			findings:
				"Modest but significant reduction in systolic and diastolic blood pressure",
			polishFindings:
				"Umiarkowana ale znacząca redukcja ciśnienia skurczowego i rozkurczowego",
			evidenceLevel: "MODERATE",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "11023123",
			doi: "10.1038/sj.jhh.1003671",
			sampleSize: 0,
			participantCount: 178,
			qualityScore: 8.0,
		},
	],

	// Metadata
	tags: [
		"coenzyme",
		"mitochondria",
		"antioxidant",
		"cardiovascular",
		"heart health",
		"energy",
		"neuroprotection",
		"statin",
		"aging",
	],
	lastUpdated: "2024-01-15T00:00:00Z",
	createdAt: "2024-01-15T00:00:00Z",

	// Additional fields for Prisma compatibility
	knowledgeNodeId: null,
};

export default coq10Profile;
