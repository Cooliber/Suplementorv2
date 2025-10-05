/**
 * Magnesium Supplement Profile
 * Migrated from nextjs-roocode-template with enhanced T3 Stack compatibility
 * The Essential Mineral with comprehensive Polish medical compliance
 */

import type { SupplementWithRelations } from "../../types/supplement";

export const magnesiumProfile: SupplementWithRelations = {
	id: "magnesium",
	name: "Magnesium",
	polishName: "Magnez",
	scientificName: "Magnesium",
	commonNames: [
		"Magnesium Glycinate",
		"Magnesium Oxide",
		"Magnesium Citrate",
		"Magnesium Malate",
	],
	polishCommonNames: [
		"Magnez Glicynian",
		"Tlenek Magnezu",
		"Cytrynian Magnezu",
		"Magnez Malinian",
	],
	category: "MINERAL",
	description:
		"Magnesium is an essential mineral that acts as a cofactor in over 300 enzymatic reactions in the body. It plays crucial roles in energy production, muscle function, nerve conduction, and neurotransmitter synthesis. Magnesium deficiency is common and can lead to various health issues.",
	polishDescription:
		"Magnez to niezbędny mineral, który pełni rolę kofaktora w ponad 300 reakcjach enzymatycznych w organizmie. Odgrywa kluczowe role w produkcji energii, funkcji mięśni, przewodzeniu nerwowym i syntezie neuroprzekaźników. Niedobór magnezu jest powszechny i może prowadzić do różnych problemów zdrowotnych.",

	// Active compounds with detailed bioavailability data
	activeCompounds: [
		{
			name: "Magnesium",
			polishName: "Magnez",
			concentration: "400mg",
			bioavailability: 80,
			halfLife: "30-60 hours",
			metabolicPathway: [
				"Enzyme cofactors",
				"ATP activation",
				"Neuromuscular function",
			],
			targetReceptors: ["Calcium channels", "GABA receptors", "NMDA receptors"],
		},
	],

	// Clinical applications with Polish translations
	clinicalApplications: [
		{
			condition: "Muscle cramps and sleep",
			polishCondition: "Spazmy mięśni i sen",
			indication: "Reduction in muscle cramps and improvement in sleep quality",
			polishIndication: "Redukcja skurczy mięśni i poprawa jakości snu",
			efficacy: "high",
			effectivenessRating: 8,
			evidenceLevel: "STRONG",
			recommendedDose: "200-400mg daily",
			duration: "Days to weeks",
			effectSize: 0.65,
			studyCount: 15,
			participantCount: 1200,
			recommendationGrade: "A",
		},
		{
			condition: "Anxiety and stress reduction",
			polishCondition: "Lęk i redukcja stresu",
			indication: "Reduction in anxiety symptoms and stress response",
			polishIndication: "Redukcja objawów lęku i odpowiedzi na stres",
			efficacy: "moderate",
			effectivenessRating: 6,
			evidenceLevel: "MODERATE",
			recommendedDose: "200-400mg daily",
			duration: "2-4 weeks",
			effectSize: 0.35,
			studyCount: 8,
			participantCount: 600,
			recommendationGrade: "B",
		},
		{
			condition: "Migraine prevention",
			polishCondition: "Profilaktyka migreny",
			indication: "Reduction in frequency and severity of migraines",
			polishIndication: "Redukcja częstotliwości i nasilenia migreny",
			efficacy: "moderate",
			effectivenessRating: 6,
			evidenceLevel: "MODERATE",
			recommendedDose: "400-600mg daily",
			duration: "8-12 weeks",
			effectSize: 0.4,
			studyCount: 6,
			participantCount: 450,
			recommendationGrade: "B",
		},
		{
			condition: "Blood pressure management",
			polishCondition: "Zarządzanie ciśnieniem krwi",
			indication:
				"Mild reduction in blood pressure in hypertensive individuals",
			polishIndication:
				"Łagodne obniżenie ciśnienia krwi u osób z nadciśnieniem",
			efficacy: "moderate",
			effectivenessRating: 6,
			evidenceLevel: "MODERATE",
			recommendedDose: "300-500mg daily",
			duration: "4-12 weeks",
			effectSize: 0.3,
			studyCount: 9,
			participantCount: 800,
			recommendationGrade: "B",
		},
		{
			condition: "Cognitive function support",
			polishCondition: "Wsparcie funkcji poznawczych",
			indication: "Support for memory and cognitive performance",
			polishIndication: "Wsparcie dla pamięci i wydajności poznawczej",
			efficacy: "moderate",
			effectivenessRating: 6,
			evidenceLevel: "MODERATE",
			recommendedDose: "200-400mg daily",
			duration: "8-12 weeks",
			effectSize: 0.25,
			studyCount: 7,
			participantCount: 500,
			recommendationGrade: "B",
		},
	],

	// Mechanisms of action with detailed pathways
	mechanisms: [
		{
			id: "enzymatic-cofactor",
			name: "Enzymatic cofactor and neuromuscular function",
			polishName: "Kofaktor enzymatyczny i funkcja neuromięśniowa",
			pathway: "Enzymatic cofactor and neuromuscular function",
			polishPathway: "Enzymatic cofactor and neuromuscular function",
			description:
				"Magnesium acts as a cofactor in over 300 enzymatic reactions and regulates neuromuscular excitability. It is essential for ATP activation and energy metabolism.",
			polishDescription:
				"Magnez pełni rolę kofaktora w ponad 300 reakcjach enzymatycznych i reguluje wzbudzalność neuromięśniową. Jest niezbędny do aktywacji ATP i metabolizmu energetycznego.",
			evidenceLevel: "STRONG",
			targetSystems: ["Energy metabolism", "ATP activation", "Enzyme function"],
			timeToEffect: "Days to weeks",
			duration: "Continuous requirement",
		},
		{
			id: "gaba-enhancement",
			name: "GABA receptor modulation",
			polishName: "Modulacja receptorów GABA",
			pathway: "GABA receptor modulation",
			polishPathway: "GABA receptor modulation",
			description:
				"Magnesium enhances GABA receptor function, promoting relaxation and reducing anxiety. It also antagonizes NMDA receptors, preventing excitotoxicity.",
			polishDescription:
				"Magnez wzmacnia funkcję receptorów GABA, promując relaks i redukując lęk. Blokuje również receptory NMDA, zapobiegając ekscytotoksyczności.",
			evidenceLevel: "MODERATE",
			targetSystems: ["GABA system", "Anxiety pathways", "NMDA receptors"],
			timeToEffect: "Days to weeks",
			duration: "Continuous effect",
		},
		{
			id: "calcium-regulation",
			name: "Calcium channel regulation",
			polishName: "Regulacja kanałów wapniowych",
			pathway: "Calcium channel regulation",
			polishPathway: "Calcium channel regulation",
			description:
				"Magnesium acts as a natural calcium channel blocker, preventing excessive calcium influx into cells. This supports muscle relaxation and prevents cramping.",
			polishDescription:
				"Magnez pełni rolę naturalnego blokera kanałów wapniowych, zapobiegając nadmiernemu napływowi wapnia do komórek. Wspiera to relaksację mięśni i zapobiega skurczom.",
			evidenceLevel: "STRONG",
			targetSystems: [
				"Calcium channels",
				"Muscle function",
				"Nerve conduction",
			],
			timeToEffect: "Days to weeks",
			duration: "Continuous regulation",
		},
		{
			id: "neurotransmitter-synthesis",
			name: "Neurotransmitter synthesis and function",
			polishName: "Synteza i funkcja neuroprzekaźników",
			pathway: "Neurotransmitter synthesis and function",
			polishPathway: "Neurotransmitter synthesis and function",
			description:
				"Magnesium is required for proper synthesis and function of neurotransmitters including serotonin, dopamine, and GABA. This affects mood and cognitive function.",
			polishDescription:
				"Magnez jest wymagany do prawidłowej syntezy i funkcji neuroprzekaźników w tym serotoniny, dopaminy i GABA. Wpływa to na nastrój i funkcję poznawczą.",
			evidenceLevel: "MODERATE",
			targetSystems: ["Serotonin system", "Dopamine system", "GABA system"],
			timeToEffect: "Weeks to months",
			duration: "Continuous requirement",
		},
	],

	// Comprehensive dosage guidelines
	dosageGuidelines: {
		therapeuticRange: {
			min: 200,
			max: 400,
			unit: "mg",
		},
		timing: ["evening"],
		withFood: true,
		contraindications: ["Kidney disease", "Kidney failure"],
		polishContraindications: ["Choroba nerek", "Niewydolność nerek"],
		interactions: [
			{
				substance: "Antibiotics",
				polishSubstance: "Antybiotyki",
				type: "antagonistic",
				severity: "moderate",
				description: "Interaction between supplements",
				polishDescription: "Interakcja między suplementami",
				clinicalSignificance: "Monitor for effects",
				polishClinicalSignificance: "Monitorować efekty",
				mechanism: "Reduced absorption of both substances",
				polishMechanism: "Zmniejszone wchłanianie obu substancji",
				recommendation:
					"Take antibiotics 2 hours before or 4 hours after magnesium",
				polishRecommendation:
					"Przyjmuj antybiotyki 2 godziny przed lub 4 godziny po magnezie",
				evidenceLevel: "MODERATE",
			},
		],
	},

	// Side effects with frequency and management
	sideEffects: [
		{
			effect: "Diarrhea",
			polishEffect: "Biegunka",
			frequency: "common",
			severity: "mild",
			reversible: true,
			dosageDependent: true,
			timeToOnset: "Hours to days",
			management: "Reduce dose, take with food, consider chelated forms",
			polishManagement:
				"Zmniejsz dawkę, przyjmuj z jedzeniem, rozważ formy chelatowane",
		},
		{
			effect: "Nausea",
			polishEffect: "Nudności",
			frequency: "uncommon",
			severity: "mild",
			reversible: true,
			dosageDependent: true,
			timeToOnset: "30-60 minutes",
			management: "Take with food, reduce dose",
			polishManagement: "Przyjmuj z jedzeniem, zmniejsz dawkę",
		},
		{
			effect: "Stomach cramps",
			polishEffect: "Spazmy żołądka",
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
			substance: "Calcium",
			polishSubstance: "Wapń",
			type: "antagonistic",
			severity: "minor",
			description: "Interaction between supplements",
			polishDescription: "Interakcja między suplementami",
			clinicalSignificance: "Monitor for effects",
			polishClinicalSignificance: "Monitorować efekty",
			mechanism: "Competitive absorption",
			polishMechanism: "Konkurencyjne wchłanianie",
			recommendation: "Take separately if high doses are required",
			polishRecommendation: "Przyjmuj osobno przy wymaganych wysokich dawkach",
			evidenceLevel: "WEAK",
		},
		{
			substance: "Zinc",
			polishSubstance: "Cynk",
			type: "antagonistic",
			clinicalSignificance:
				"Minor clinical significance - generally safe with monitoring",
			polishClinicalSignificance:
				"Niewielkie znaczenie kliniczne - ogólnie bezpieczne z monitorowaniem",
			severity: "minor",
			mechanism: "Competitive absorption",
			polishMechanism: "Konkurencyjne wchłanianie",
			description: "High doses of zinc may interfere with magnesium absorption",
			polishDescription:
				"Wysokie dawki cynku mogą zakłócać wchłanianie magnezu",
			recommendation: "Take separately if high doses are required",
			polishRecommendation: "Przyjmuj osobno przy wymaganych wysokich dawkach",
			evidenceLevel: "WEAK",
		},
	],

	// Evidence level and research studies
	evidenceLevel: "STRONG",
	researchStudies: [
		{
			id: "nielsen-2010",
			title:
				"Magnesium supplementation improves indicators of low magnesium status and inflammatory stress",
			polishTitle:
				"Suplementacja magnezem poprawia wskaźniki niskiego stężenia magnezu i stresu zapalnego",
			authors: ["Nielsen FH", "Johnson LK", "Zeng H"],
			journal: "Magnesium Research",
			year: 2010,
			studyType: "RANDOMIZED_CONTROLLED_TRIAL",
			primaryOutcome: "Magnesium status improvement",
			polishPrimaryOutcome: "Poprawa statusu magnezowego",
			findings:
				"Magnesium supplementation significantly improved magnesium status and reduced inflammatory markers",
			polishFindings:
				"Suplementacja magnezem znacząco poprawiła status magnezowy i zmniejszyła wskaźniki zapalne",
			evidenceLevel: "STRONG",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "20228013",
			doi: "10.1684/mrh.2010.0194",
			sampleSize: 23,
			duration: "12 weeks",
			dosage: "368mg daily",
			qualityScore: 7.5,
		},
		{
			id: "zhang-2012",
			title: "The role of magnesium in neurological disorders",
			polishTitle: "Rola magnezu w zaburzeniach neurologicznych",
			authors: ["Zhang DM", "Hu RM", "Jin H", "Yang XL", "Hu FB"],
			journal: "Nutrients",
			year: 2012,
			studyType: "SYSTEMATIC_REVIEW",
			primaryOutcome: "Neurological effects of magnesium",
			polishPrimaryOutcome: "Efekty neurologiczne magnezu",
			findings:
				"Magnesium has demonstrated benefits for migraine, stroke, and other neurological conditions",
			polishFindings:
				"Magnez wykazał korzyści dla migreny, udaru i innych stanów neurologicznych",
			evidenceLevel: "MODERATE",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "23112813",
			doi: "10.3390/nu4091161",
			sampleSize: 0,
			qualityScore: 8.0,
		},
		{
			id: "pfirrmann-2011",
			title: "Association between magnesium intake and sleep duration",
			polishTitle: "Związek między spożyciem magnezu a czasem trwania snu",
			authors: ["Pfirrmann H", "Heinrich J", "Rzehak P"],
			journal: "European Journal of Clinical Nutrition",
			year: 2011,
			studyType: "COHORT_STUDY",
			primaryOutcome: "Sleep quality and duration",
			polishPrimaryOutcome: "Jakość i czas trwania snu",
			findings:
				"Higher magnesium intake was associated with better sleep quality and duration",
			polishFindings:
				"Wyższe spożycie magnezu wiązało się z lepszą jakością i czasem trwania snu",
			evidenceLevel: "MODERATE",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "21448199",
			doi: "10.1038/ejcn.2011.43",
			sampleSize: 742,
			qualityScore: 7.0,
		},
	],

	// Metadata
	tags: [
		"mineral",
		"muscle function",
		"sleep",
		"anxiety",
		"migraine",
		"blood pressure",
		"neurotransmitter",
		"gaba",
		"enzymatic cofactor",
	],
	lastUpdated: "2024-01-15T00:00:00Z",
	createdAt: "2024-01-15T00:00:00Z",

	// Additional fields for Prisma compatibility
	knowledgeNodeId: null,
};

export const magnesiumData = magnesiumProfile;
export default magnesiumProfile;
