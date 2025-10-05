/**
 * Caffeine Supplement Profile
 * Migrated from nextjs-roocode-template with enhanced T3 Stack compatibility
 * The World's Most Popular Stimulant with comprehensive Polish medical compliance
 */

import type { SupplementWithRelations } from "../../types/supplement";

export const caffeineProfile: SupplementWithRelations = {
	id: "caffeine",
	name: "Caffeine",
	polishName: "Kofeina",
	scientificName: "1,3,7-trimethylxanthine",
	commonNames: ["Guaranine", "Theine", "Mateine", "Methyltheobromine"],
	polishCommonNames: ["Gwaranina", "Teina", "Mateina", "Metyleoteobromina"],
	category: "OTHER",
	description:
		"Caffeine is a central nervous system stimulant and the world's most widely consumed psychoactive substance. It blocks adenosine receptors to promote alertness and vigilance while enhancing dopamine and norepinephrine signaling for improved cognitive performance and mood.",
	polishDescription:
		"Kofeina to stymulant ośrodkowego układu nerwowego i najpowszechniej spożywana substancja psychoaktywna na świecie. Blokuje receptory adenozynowe, promując czujność i wrażliwość, podczas gdy wzmacnia sygnalizację dopaminy i noradrenaliny dla poprawy wydajności poznawczej i nastroju.",

	// Active compounds with detailed bioavailability data
	activeCompounds: [
		{
			name: "Caffeine",
			polishName: "Kofeina",
			concentration: "100mg",
			bioavailability: 99,
			halfLife: "4-6 hours",
			metabolicPathway: [
				"Adenosine receptor blockade",
				"Catecholamine enhancement",
			],
			targetReceptors: ["Adenosine A1 and A2A receptors", "Dopamine receptors"],
		},
	],

	// Clinical applications with Polish translations
	clinicalApplications: [
		{
			condition: "Cognitive enhancement",
			polishCondition: "Wzmocnienie funkcji poznawczych",
			indication:
				"Improved alertness, attention, concentration, and cognitive performance",
			polishIndication:
				"Poprawiona czujność, koncentracja, skupienie i wydajność poznawcza",
			efficacy: "high",
			effectivenessRating: 8,
			evidenceLevel: "STRONG",
			recommendedDose: "100-400mg daily",
			duration: "Hours to days",
			effectSize: 0.5,
			studyCount: 25,
			participantCount: 2500,
			recommendationGrade: "A",
		},
		{
			condition: "Physical performance enhancement",
			polishCondition: "Wzmocnienie wydajności fizycznej",
			indication: "Improved endurance, strength, and exercise performance",
			polishIndication:
				"Poprawiona wytrzymałość, siła i wydajność w ćwiczeniach",
			efficacy: "high",
			effectivenessRating: 8,
			evidenceLevel: "STRONG",
			recommendedDose: "3-6mg/kg body weight",
			duration: "2-4 hours",
			effectSize: 0.4,
			studyCount: 20,
			participantCount: 1800,
			recommendationGrade: "A",
		},
		{
			condition: "Fatigue reduction",
			polishCondition: "Redukcja zmęczenia",
			indication: "Reduction of mental and physical fatigue",
			polishIndication: "Redukcja zmęczenia mentalnego i fizycznego",
			efficacy: "high",
			effectivenessRating: 8,
			evidenceLevel: "STRONG",
			recommendedDose: "100-200mg as needed",
			duration: "4-6 hours",
			effectSize: 0.6,
			studyCount: 15,
			participantCount: 1200,
			recommendationGrade: "A",
		},
		{
			condition: "Mood enhancement",
			polishCondition: "Wzmocnienie nastroju",
			indication: "Improved mood and reduced symptoms of depression",
			polishIndication: "Poprawiony nastrój i zmniejszone objawy depresji",
			efficacy: "moderate",
			effectivenessRating: 6,
			evidenceLevel: "MODERATE",
			recommendedDose: "100-300mg daily",
			duration: "Days to weeks",
			effectSize: 0.25,
			studyCount: 10,
			participantCount: 800,
			recommendationGrade: "B",
		},
	],

	// Mechanisms of action with detailed pathways
	mechanisms: [
		{
			id: "adenosinergic-blocking",
			name: "Adenosinergic and catecholaminergic systems",
			polishName: "Systemy adenozynowe i katecholaminowe",
			pathway: "Adenosinergic and catecholaminergic systems",
			polishPathway: "Adenosinergic and catecholaminergic systems",
			description:
				"Caffeine blocks adenosine receptors, preventing drowsiness, while enhancing dopamine and norepinephrine signaling. This dual mechanism promotes alertness and cognitive enhancement.",
			polishDescription:
				"Kofeina blokuje receptory adenozynowe, zapobiegając osowieniu, podczas gdy wzmacnia sygnalizację dopaminy i noradrenaliny. Ten podwójny mechanizm promuje czujność i wzmocnienie poznawcze.",
			evidenceLevel: "STRONG",
			targetSystems: [
				"Adenosine system",
				"Dopamine system",
				"Norepinephrine system",
			],
			timeToEffect: "15-45 minutes",
			duration: "4-6 hours",
		},
		{
			id: "neurotransmitter-modulation",
			name: "Neurotransmitter modulation",
			polishName: "Modulacja neuroprzekaźników",
			pathway: "Neurotransmitter modulation",
			polishPathway: "Neurotransmitter modulation",
			description:
				"Caffeine increases the release and activity of several neurotransmitters including dopamine, norepinephrine, and acetylocholine, leading to enhanced cognitive and physical performance.",
			polishDescription:
				"Kofeina zwiększa uwalnianie i aktywność kilku neuroprzekaźników, w tym dopaminy, noradrenaliny i acetylocholiny, prowadząc do wzmocnienia poznawczego i fizycznego.",
			evidenceLevel: "STRONG",
			targetSystems: [
				"Dopamine system",
				"Norepinephrine system",
				"Cholinergic system",
			],
			timeToEffect: "30-60 minutes",
			duration: "4-6 hours",
		},
		{
			id: "metabolic-activation",
			name: "Metabolic activation",
			polishName: "Aktywacja metaboliczna",
			pathway: "Metabolic activation",
			polishPathway: "Metabolic activation",
			description:
				"Caffeine stimulates metabolism by increasing lipolysis and thermogenesis, contributing to increased energy expenditure and fat oxidation.",
			polishDescription:
				"Kofeina stymuluje metabolizm przez zwiększanie lipolizy i termogenezy, przyczyniając się do zwiększonego wydatkowania energii i utleniania tłuszczu.",
			evidenceLevel: "MODERATE",
			targetSystems: ["Metabolic system", "Fat oxidation", "Thermogenesis"],
			timeToEffect: "30-90 minutes",
			duration: "3-4 hours",
		},
	],

	// Comprehensive dosage guidelines
	dosageGuidelines: {
		therapeuticRange: {
			min: 50,
			max: 400,
			unit: "mg",
		},
		timing: ["morning", "afternoon"],
		withFood: false,
		contraindications: ["Pregnancy", "Anxiety disorders", "Heart conditions"],
		polishContraindications: ["Ciąża", "Zaburzenia lękowe", "Choroby serca"],
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
			effect: "Jitteriness",
			polishEffect: "Drgawki",
			frequency: "common",
			severity: "mild",
			reversible: true,
			dosageDependent: true,
			timeToOnset: "15-30 minutes",
			management: "Reduce dose, take with food",
			polishManagement: "Zmniejsz dawkę, przyjmuj z jedzeniem",
		},
		{
			effect: "Insomnia",
			polishEffect: "Bezsenność",
			frequency: "common",
			severity: "moderate",
			reversible: true,
			dosageDependent: true,
			timeToOnset: "Hours after consumption",
			management: "Avoid consumption within 6 hours of bedtime",
			polishManagement: "Unikaj spożycia w ciągu 6 godzin przed snem",
		},
		{
			effect: "Increased heart rate",
			polishEffect: "Zwiększona częstość akcji serca",
			frequency: "common",
			severity: "mild",
			reversible: true,
			dosageDependent: true,
			timeToOnset: "15-30 minutes",
			management: "Reduce dose, avoid if heart conditions present",
			polishManagement: "Zmniejsz dawkę, unikaj przy chorobach serca",
		},
		{
			effect: "Anxiety",
			polishEffect: "Lęk",
			frequency: "uncommon",
			severity: "moderate",
			reversible: true,
			dosageDependent: true,
			timeToOnset: "15-45 minutes",
			management: "Reduce dose or discontinue if anxiety increases",
			polishManagement: "Zmniejsz dawkę lub odstaw, jeśli lęk się nasila",
		},
		{
			effect: "Stomach irritation",
			polishEffect: "Podrażnienie żołądka",
			frequency: "uncommon",
			severity: "mild",
			reversible: true,
			dosageDependent: true,
			timeToOnset: "30-60 minutes",
			management: "Take with food, reduce dose",
			polishManagement: "Przyjmuj z jedzeniem, zmniejsz dawkę",
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
			substance: "Adenosine diphosphate receptor antagonists",
			polishSubstance: "Antagoniści receptora adenozyny difosforanu",
			type: "antagonistic",
			clinicalSignificance: "Moderate clinical significance - monitor closely",
			polishClinicalSignificance:
				"Umiarkowane znaczenie kliniczne - ścisłe monitorowanie",
			severity: "moderate",
			mechanism: "Reduced effectiveness of antiplatelet therapy",
			polishMechanism: "Zmniejszona skuteczność terapii antypłytkowej",
			description: "May reduce the effectiveness of antiplatelet medications",
			polishDescription: "Może zmniejszyć skuteczność leków antypłytkowych",
			recommendation: "Monitor bleeding risk and platelet aggregation",
			polishRecommendation: "Monitoruj ryzyko krwawienia i agregację płytek",
			evidenceLevel: "WEAK",
		},
	],

	// Evidence level and research studies
	evidenceLevel: "STRONG",
	researchStudies: [
		{
			id: "lieberman-1992",
			title: "The effects of caffeine on cognitive performance",
			polishTitle: "Efekty kofeiny na wydajność poznawczą",
			authors: ["Lieberman HR"],
			journal: "Psychopharmacology",
			year: 1992,
			studyType: "SYSTEMATIC_REVIEW",
			primaryOutcome: "Cognitive performance enhancement",
			polishPrimaryOutcome: "Wzmocnienie wydajności poznawczej",
			findings:
				"Caffeine significantly improves alertness, attention, and cognitive performance",
			polishFindings:
				"Kofeina znacząco poprawia czujność, uwagę i wydajność poznawczą",
			evidenceLevel: "STRONG",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "1439789",
			doi: "10.1007/BF02245190",
			sampleSize: 0,
			qualityScore: 8.5,
		},
		{
			id: "goldstein-2010",
			title:
				"International society of sports nutrition position stand: caffeine and performance",
			polishTitle:
				"Stanowisko Międzynarodowego Towarzystwa Naukowego ds. Żywienia Sportowego: kofeina i wydajność",
			authors: ["Goldstein ER", "Ziegenfuss T", "Kalman D"],
			journal: "Journal of the International Society of Sports Nutrition",
			year: 2010,
			studyType: "SYSTEMATIC_REVIEW",
			primaryOutcome: "Physical performance enhancement",
			polishPrimaryOutcome: "Wzmocnienie wydajności fizycznej",
			findings:
				"Caffeine ingestion enhances endurance, strength, and power performance",
			polishFindings: "Spożycie kofeiny wzmacnia wytrzymałość, siłę i moc",
			evidenceLevel: "STRONG",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "20858288",
			doi: "10.1186/1550-2783-7-5",
			sampleSize: 0,
			qualityScore: 9.0,
		},
		{
			id: "rodriguez-2009",
			title:
				"American College of Sports Medicine position stand: exercise and fluid replacement",
			polishTitle:
				"Stanowisko Amerykańskiego Kolegium Medycyny Sportowej: ćwiczenia i zastępowanie płynów",
			authors: ["Rodriguez NR", "Di Marco NM", "Langley S"],
			journal: "Medicine and Science in Sports and Exercise",
			year: 2009,
			studyType: "SYSTEMATIC_REVIEW",
			primaryOutcome: "Hydration and performance",
			polishPrimaryOutcome: "Nawodnienie i wydajność",
			findings:
				"Caffeine can improve exercise performance without significantly affecting hydration status",
			polishFindings:
				"Kofeina może poprawić wydajność w ćwiczeniach bez znaczącego wpływu na stan nawodnienia",
			evidenceLevel: "MODERATE",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "19240447",
			doi: "10.1249/MSS.0b013e31890eb86",
			sampleSize: 0,
			qualityScore: 8.0,
		},
	],

	// Metadata
	tags: [
		"stimulant",
		"cognitive enhancement",
		"physical performance",
		"alertness",
		"mood enhancement",
		"neurotransmitter modulation",
	],
	lastUpdated: "2024-01-15T00:00:00Z",
	createdAt: "2024-01-15T00:00:00Z",

	// Additional fields for Prisma compatibility
	knowledgeNodeId: null,
};

export default caffeineProfile;
