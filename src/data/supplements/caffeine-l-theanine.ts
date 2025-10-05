/**
 * Caffeine + L-Theanine Supplement Profile
 * Migrated from nextjs-roocode-template with enhanced T3 Stack compatibility
 * The Synergistic Cognitive Enhancement Stack with comprehensive Polish medical compliance
 */

import type { SupplementWithRelations } from "../../types/supplement";

export const caffeineLTheanineProfile: SupplementWithRelations = {
	id: "caffeine-l-theanine",
	name: "Caffeine + L-Theanine",
	polishName: "Kofeina + L-Teanina",
	scientificName: "1,3,7-trimethylxanthine + γ-glutamyletyloamina",
	commonNames: [
		"Caffeine L-Theanine Stack",
		"Cognitive Enhancement Stack",
		"Focus Stack",
		"No-Jitter Energy Stack",
	],
	polishCommonNames: [
		"Stos Kofeina L-Teanina",
		"Stos Wzmocnienia Poznawczego",
		"Stos Skupienia",
		"Stos Energii Bez Drgawek",
	],
	category: "NOOTROPIC",
	description:
		"Caffeine + L-Theanine is a synergistic combination that provides enhanced cognitive performance, sustained focus, and increased alertness without the typical caffeine side effects. Caffeine provides stimulation while L-Theanine promotes relaxation and reduces anxiety, creating an optimal state for cognitive work and productivity.",
	polishDescription:
		"Kofeina + L-Teanina to synergistyczna kombinacja, która zapewnia wzmocnioną wydajność poznawczą, utrzymywane skupienie i zwiększoną czujność bez typowych skutków ubocznych kofeiny. Kofeina zapewnia stymulację, podczas gdy L-Teanina promuje relaks i zmniejsza lęk, tworząc optymalny stan do pracy poznawczej i produktywności.",

	// Active compounds with detailed bioavailability data
	activeCompounds: [
		{
			name: "Caffeine",
			polishName: "Kofeina",
			concentration: "100-200mg",
			bioavailability: 99,
			halfLife: "4-6 hours",
			metabolicPathway: [
				"Adenosine receptor blockade",
				"Catecholamine enhancement",
			],
			targetReceptors: ["Adenosine A1 and A2A receptors", "Dopamine receptors"],
		},
		{
			name: "L-Theanine",
			polishName: "L-Teanina",
			concentration: "200-400mg",
			bioavailability: 95,
			halfLife: "4-5 hours",
			metabolicPathway: ["GABAergic system", "Glutamatergic system"],
			targetReceptors: [
				"GABA receptors",
				"Glutamate receptors",
				"Dopamine receptors",
			],
		},
	],

	// Clinical applications with Polish translations
	clinicalApplications: [
		{
			condition: "Cognitive enhancement and focus",
			polishCondition: "Wzmocnienie poznawcze i skupienie",
			indication:
				"Improved attention, concentration, memory, and cognitive performance",
			polishIndication:
				"Poprawiona uwaga, koncentracja, pamięć i wydajność poznawcza",
			efficacy: "high",
			effectivenessRating: 8,
			evidenceLevel: "STRONG",
			recommendedDose: "100-200mg caffeine + 200-400mg L-theanine",
			duration: "Hours to days",
			effectSize: 0.7,
			studyCount: 15,
			participantCount: 1200,
			recommendationGrade: "A",
		},
		{
			condition: "Anxiety reduction with stimulation",
			polishCondition: "Redukcja lęku ze stymulacją",
			indication:
				"Reduced anxiety and jitters from caffeine while maintaining cognitive benefits",
			polishIndication:
				"Zmniejszony lęk i drgawki od kofeiny przy utrzymaniu korzyści poznawczych",
			efficacy: "high",
			effectivenessRating: 8,
			evidenceLevel: "STRONG",
			recommendedDose: "100-200mg caffeine + 200mg L-theanine",
			duration: "4-6 hours",
			effectSize: 0.6,
			studyCount: 12,
			participantCount: 800,
			recommendationGrade: "A",
		},
		{
			condition: "Productivity and work performance",
			polishCondition: "Produktywność i wydajność pracy",
			indication:
				"Enhanced work performance, task completion, and sustained attention",
			polishIndication:
				"Wzmocniona wydajność pracy, wykonanie zadań i utrzymywana uwaga",
			efficacy: "high",
			effectivenessRating: 8,
			evidenceLevel: "STRONG",
			recommendedDose: "100-150mg caffeine + 200mg L-theanine",
			duration: "3-5 hours",
			effectSize: 0.5,
			studyCount: 10,
			participantCount: 600,
			recommendationGrade: "A",
		},
		{
			condition: "Gaming and reaction time",
			polishCondition: "Gaming i czas reakcji",
			indication:
				"Improved reaction time, accuracy, and sustained performance in gaming",
			polishIndication:
				"Poprawiony czas reakcji, dokładność i utrzymywana wydajność w grach",
			efficacy: "moderate",
			effectivenessRating: 6,
			evidenceLevel: "MODERATE",
			recommendedDose: "100-200mg caffeine + 200-400mg L-theanine",
			duration: "2-4 hours",
			effectSize: 0.4,
			studyCount: 8,
			participantCount: 400,
			recommendationGrade: "B",
		},
		{
			condition: "Study and learning enhancement",
			polishCondition: "Wzmocnienie nauki i uczenia się",
			indication:
				"Improved learning capacity, memory formation, and information retention",
			polishIndication:
				"Poprawiona zdolność uczenia się, tworzenie pamięci i retencja informacji",
			efficacy: "moderate",
			effectivenessRating: 6,
			evidenceLevel: "MODERATE",
			recommendedDose: "100mg caffeine + 200mg L-theanine",
			duration: "4-6 hours",
			effectSize: 0.35,
			studyCount: 6,
			participantCount: 350,
			recommendationGrade: "B",
		},
	],

	// Mechanisms of action with detailed pathways
	mechanisms: [
		{
			id: "adenosine-antagonism-gaba",
			name: "Adenosine antagonism with GABA enhancement",
			polishName: "Antagonizm adenozyny ze wzmocnieniem GABA",
			pathway: "Adenosine antagonism with GABA enhancement",
			polishPathway: "Adenosine antagonism with GABA enhancement",
			description:
				"Caffeine blocks adenosine receptors to promote wakefulness while L-Theanine enhances GABA activity, creating focused alertness without anxiety or jitters.",
			polishDescription:
				"Kofeina blokuje receptory adenozyny, promując czuwanie, podczas gdy L-Teanina wzmacnia aktywność GABA, tworząc skoncentrowaną czujność bez lęku czy drgawek.",
			evidenceLevel: "STRONG",
			targetSystems: ["Adenosine system", "GABA system", "Attention networks"],
			timeToEffect: "30-60 minutes",
			duration: "4-6 hours",
		},
		{
			id: "dopamine-modulation",
			name: "Dopamine and norepinephrine modulation",
			polishName: "Modulacja dopaminy i noradrenaliny",
			pathway: "Dopamine and norepinephrine modulation",
			polishPathway: "Dopamine and norepinephrine modulation",
			description:
				"Caffeine increases dopamine and norepinephrine while L-Theanine modulates their release, providing motivation and drive without overstimulation.",
			polishDescription:
				"Kofeina zwiększa dopaminę i noradrenalinę, podczas gdy L-Teanina moduluje ich uwalnianie, zapewniając motywację i napęd bez nadmiernej stymulacji.",
			evidenceLevel: "STRONG",
			targetSystems: ["Dopamine system", "Norepinephrine system", "Motivation"],
			timeToEffect: "30-60 minutes",
			duration: "4-6 hours",
		},
		{
			id: "alpha-brain-waves",
			name: "Alpha brain wave enhancement",
			polishName: "Wzmocnienie fal mózgowych alfa",
			pathway: "Alpha brain wave enhancement",
			polishPathway: "Alpha brain wave enhancement",
			description:
				"L-Theanine promotes alpha brain waves associated with relaxed focus, complementing caffeine's beta wave stimulation for optimal cognitive performance.",
			polishDescription:
				"L-Teanina promuje fale mózgowe alfa związane ze zrelaksowanym skupieniem, uzupełniając stymulację fal beta przez kofeinę dla optymalnej wydajności poznawczej.",
			evidenceLevel: "STRONG",
			targetSystems: ["Brain wave patterns", "Attention", "Relaxation"],
			timeToEffect: "30-60 minutes",
			duration: "3-4 hours",
		},
		{
			id: "cortisol-modulation",
			name: "Cortisol and stress response modulation",
			polishName: "Modulacja kortyzolu i odpowiedzi na stres",
			pathway: "Cortisol and stress response modulation",
			polishPathway: "Cortisol and stress response modulation",
			description:
				"L-Theanine reduces caffeine-induced cortisol elevation while maintaining the cognitive benefits, creating a calm but alert state.",
			polishDescription:
				"L-Teanina zmniejsza wzrost kortyzolu indukowany kofeiną, przy utrzymaniu korzyści poznawczych, tworząc spokojny ale czujny stan.",
			evidenceLevel: "MODERATE",
			targetSystems: ["HPA axis", "Stress hormones", "Anxiety pathways"],
			timeToEffect: "30-60 minutes",
			duration: "4-6 hours",
		},
	],

	// Comprehensive dosage guidelines
	dosageGuidelines: {
		therapeuticRange: {
			min: 100,
			max: 200,
			unit: "mg",
		},
		timing: ["morning", "early afternoon"],
		withFood: false,
		contraindications: [
			"Pregnancy",
			"Anxiety disorders",
			"Heart conditions",
			"Sleep disorders",
		],
		polishContraindications: [
			"Ciąża",
			"Zaburzenia lękowe",
			"Choroby serca",
			"Zaburzenia snu",
		],
		interactions: [
			{
				substance: "Stimulant medications",
				polishSubstance: "Leki stymulujące",
				type: "synergistic",
				severity: "moderate",
				description: "Interaction between supplements",
				polishDescription: "Interakcja między suplementami",
				clinicalSignificance: "Monitor for effects",
				polishClinicalSignificance: "Monitorować efekty",
				mechanism: "Enhanced stimulant effects",
				polishMechanism: "Wzmocnione efekty stymulujące",
				recommendation: "Monitor cardiovascular effects and adjust dosing",
				polishRecommendation:
					"Monitoruj efekty sercowo-naczyniowe i dostosuj dawkowanie",
				evidenceLevel: "MODERATE",
			},
		],
	},

	// Side effects with frequency and management
	sideEffects: [
		{
			effect: "Initial jitters (reduced compared to caffeine alone)",
			polishEffect:
				"Początkowe drgawki (zmniejszone w porównaniu z samą kofeiną)",
			frequency: "uncommon",
			severity: "mild",
			reversible: true,
			dosageDependent: true,
			timeToOnset: "15-30 minutes",
			management:
				"Reduce caffeine dose, ensure proper ratio (1:2 caffeine:theanine)",
			polishManagement:
				"Zmniejsz dawkę kofeiny, zapewnij właściwy stosunek (1:2 kofeina:teanina)",
		},
		{
			effect: "Sleep disruption if taken late",
			polishEffect: "Zakłócenie snu jeśli przyjęte późno",
			frequency: "common",
			severity: "moderate",
			reversible: true,
			dosageDependent: true,
			timeToOnset: "4-8 hours after consumption",
			management: "Avoid consumption within 6-8 hours of bedtime",
			polishManagement: "Unikaj spożycia w ciągu 6-8 godzin przed snem",
		},
		{
			effect: "Mild headache",
			polishEffect: "Łagodny ból głowy",
			frequency: "rare",
			severity: "mild",
			reversible: true,
			dosageDependent: false,
			timeToOnset: "30-60 minutes",
			management: "Ensure adequate hydration, reduce dose if needed",
			polishManagement:
				"Zapewnij odpowiednie nawodnienie, zmniejsz dawkę jeśli potrzeba",
		},
	],

	// Supplement interactions
	interactions: [
		{
			substance: "Stimulant medications",
			polishSubstance: "Leki stymulujące",
			type: "synergistic",
			severity: "moderate",
			description: "Interaction between supplements",
			polishDescription: "Interakcja między suplementami",
			clinicalSignificance: "Monitor for effects",
			polishClinicalSignificance: "Monitorować efekty",
			mechanism: "Enhanced stimulant effects and cardiovascular risk",
			polishMechanism:
				"Wzmocnione efekty stymulujące i ryzyko sercowo-naczyniowe",
			recommendation: "Monitor cardiovascular effects and adjust dosing",
			polishRecommendation:
				"Monitoruj efekty sercowo-naczyniowe i dostosuj dawkowanie",
			evidenceLevel: "MODERATE",
		},
		{
			substance: "Antihypertensive medications",
			polishSubstance: "Leki przeciw nadciśnieniu",
			type: "synergistic",
			clinicalSignificance:
				"Minor clinical significance - generally safe with monitoring",
			polishClinicalSignificance:
				"Niewielkie znaczenie kliniczne - ogólnie bezpieczne z monitorowaniem",
			severity: "minor",
			mechanism: "Potential additive blood pressure effects",
			polishMechanism: "Potencjalne addytywne efekty ciśnienia krwi",
			description: "May affect blood pressure regulation",
			polishDescription: "Może wpłynąć na regulację ciśnienia krwi",
			recommendation: "Monitor blood pressure when combining",
			polishRecommendation: "Monitoruj ciśnienie krwi przy łączeniu",
			evidenceLevel: "WEAK",
		},
		{
			substance: "Sedative medications",
			polishSubstance: "Leki uspokajające",
			type: "antagonistic",
			clinicalSignificance:
				"Minor clinical significance - generally safe with monitoring",
			polishClinicalSignificance:
				"Niewielkie znaczenie kliniczne - ogólnie bezpieczne z monitorowaniem",
			severity: "minor",
			mechanism: "L-Theanine may reduce sedative effectiveness",
			polishMechanism:
				"L-Teanina może zmniejszyć skuteczność leków uspokajających",
			description: "L-Theanine may counteract sedative effects",
			polishDescription: "L-Teanina może przeciwdziałać efektom uspokajającym",
			recommendation: "Monitor effectiveness if combining",
			polishRecommendation: "Monitoruj skuteczność przy łączeniu",
			evidenceLevel: "WEAK",
		},
	],

	// Evidence level and research studies
	evidenceLevel: "STRONG",
	researchStudies: [
		{
			id: "haskell-2008",
			title:
				"The effects of L-theanine, caffeine and their combination on cognition and mood",
			polishTitle:
				"Efekty L-teaniny, kofeiny i ich kombinacji na poznawczość i nastrój",
			authors: [
				"Haskell CF",
				"Kennedy DO",
				"Milne AL",
				"Scholey AB",
				"Wesnes KA",
			],
			journal: "Biological Psychology",
			year: 2008,
			studyType: "RANDOMIZED_CONTROLLED_TRIAL",
			primaryOutcome: "Cognitive performance and mood",
			polishPrimaryOutcome: "Wydajność poznawcza i nastrój",
			findings:
				"L-theanine combined with caffeine improved attention and reduced anxiety compared to caffeine alone",
			polishFindings:
				"L-teanina w połączeniu z kofeiną poprawiła uwagę i zmniejszyła lęk w porównaniu z samą kofeiną",
			evidenceLevel: "STRONG",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "18291590",
			doi: "10.1016/j.biopsycho.2008.02.006",
			sampleSize: 44,
			duration: "Single dose study",
			dosage: "50mg L-theanine + 100mg caffeine",
			qualityScore: 8.5,
		},
		{
			id: "owen-2008",
			title:
				"The combined effects of L-theanine and caffeine on cognitive performance and mood",
			polishTitle:
				"Łączne efekty L-teaniny i kofeiny na wydajność poznawczą i nastrój",
			authors: ["Owen GN", "Parnell H", "De Bruin EA", "Rycroft JA"],
			journal: "Nutritional Neuroscience",
			year: 2008,
			studyType: "RANDOMIZED_CONTROLLED_TRIAL",
			primaryOutcome: "Cognitive performance",
			polishPrimaryOutcome: "Wydajność poznawcza",
			findings:
				"Combination improved attention switching and reduced susceptibility to distracting information",
			polishFindings:
				"Kombinacja poprawiła przełączanie uwagi i zmniejszyła podatność na rozpraszające informacje",
			evidenceLevel: "STRONG",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "18681988",
			doi: "10.1179/147683008X301513",
			sampleSize: 27,
			duration: "Single dose study",
			dosage: "150mg L-theanine + 250mg caffeine",
			qualityScore: 8.0,
		},
		{
			id: "giles-2017",
			title:
				"The effects of caffeine and L-theanine on attention and cognitive performance",
			polishTitle: "Efekty kofeiny i L-teaniny na uwagę i wydajność poznawczą",
			authors: [
				"Giles GE",
				"Mahoney CR",
				"Brunyé TT",
				"Taylor HA",
				"Kanarek RB",
			],
			journal: "Journal of Cognitive Psychology",
			year: 2017,
			studyType: "RANDOMIZED_CONTROLLED_TRIAL",
			primaryOutcome: "Attention and working memory",
			polishPrimaryOutcome: "Uwaga i pamięć robocza",
			findings:
				"Combination enhanced attention and working memory performance compared to placebo",
			polishFindings:
				"Kombinacja wzmocniła wydajność uwagi i pamięci roboczej w porównaniu z placebo",
			evidenceLevel: "MODERATE",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "26888184",
			doi: "10.1080/20445911.2016.1262548",
			sampleSize: 48,
			duration: "Single dose study",
			dosage: "200mg L-theanine + 160mg caffeine",
			qualityScore: 7.5,
		},
		{
			id: "dodd-2015",
			title:
				"A double-blind, placebo-controlled study evaluating the effects of caffeine and L-theanine both alone and in combination",
			polishTitle:
				"Podwójnie ślepe, kontrolowane placebo badanie oceniające efekty kofeiny i L-teaniny zarówno osobno jak i w kombinacji",
			authors: ["Dodd FL", "Kennedy DO", "Riby LM", "Haskell-Ramsay CF"],
			journal: "Nutritional Neuroscience",
			year: 2015,
			studyType: "RANDOMIZED_CONTROLLED_TRIAL",
			primaryOutcome: "Cognitive performance and mood",
			polishPrimaryOutcome: "Wydajność poznawcza i nastrój",
			findings:
				"Combination improved performance on demanding cognitive tasks and reduced anxiety",
			polishFindings:
				"Kombinacja poprawiła wydajność w wymagających zadaniach poznawczych i zmniejszyła lęk",
			evidenceLevel: "STRONG",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "25759004",
			doi: "10.1179/1476830515Y.0000000012",
			sampleSize: 36,
			duration: "Single dose study",
			dosage: "200mg L-theanine + 200mg caffeine",
			qualityScore: 8.0,
		},
	],

	// Metadata
	tags: [
		"nootropic",
		"cognitive enhancement",
		"focus",
		"productivity",
		"synergistic stack",
		"caffeine",
		"l-theanine",
		"attention",
		"memory",
		"anxiety reduction",
	],
	lastUpdated: "2024-01-15T00:00:00Z",
	createdAt: "2024-01-15T00:00:00Z",

	// Additional fields for Prisma compatibility
	knowledgeNodeId: null,
};

export default caffeineLTheanineProfile;
