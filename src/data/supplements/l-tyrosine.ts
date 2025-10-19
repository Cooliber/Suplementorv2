/**
 * L-Tyrosine Supplement Profile
 * Migrated from nextjs-roocode-template with enhanced T3 Stack compatibility
 * The Cognitive Amino Acid Precursor with comprehensive Polish medical compliance
 */

import type { SupplementWithRelations } from "../../types/supplement";

export const lTyrosineProfile: SupplementWithRelations = {
	id: "l-tyrosine",
	name: "L-Tyrosine",
	polishName: "L-Tyrozyna",
	scientificName: "L-2-amino-3-(4-hydroxyphenyl)propanoic acid",
	commonNames: ["Tyrosine", "4-hydroxyphenylalanine"],
	polishCommonNames: ["Tyrozyna", "4-hydroksyfenyloalanina"],
	category: "AMINO_ACID",
	description:
		"L-Tyrosine is a non-essential amino acid and precursor to catecholamine neurotransmitters including dopamine, norepinephrine, and epinephrine. It plays a crucial role in cognitive function, stress response, and thyroid hormone production under conditions of stress or cognitive demand.",
	polishDescription:
		"L-Tyrozyna to nieistotny aminokwas i prekursor katecholaminowych neuroprzekaźników, w tym dopaminy, norepinefryny i epinefryny. Odgrywa kluczową rolę w funkcji poznawczej, odpowiedzi na stres i produkcji hormonów tarczycy w warunkach stresu lub wymagań poznawczych.",

	// Active compounds with detailed bioavailability data
	activeCompounds: [
		{
			name: "L-Tyrosine",
			polishName: "L-Tyrozyna",
			concentration: "500mg",
			bioavailability: 60,
			halfLife: "2-3 hours",
			metabolicPathway: ["Catecholamine synthesis", "Thyroid hormone pathway"],
			targetReceptors: [
				"Dopamine receptors",
				"Adrenergic receptors",
				"Thyroid hormone receptors",
			],
		},
	],

	// Clinical applications with Polish translations
	clinicalApplications: [
		{
			condition: "Cognitive performance under stress",
			polishCondition: "Wydajność poznawcza pod stresem",
			indication:
				"Improved working memory and executive function during stress",
			polishIndication:
				"Poprawiona pamięć robocza i funkcja wykonawcza podczas stresu",
			efficacy: "high",
			effectivenessRating: 8,
			evidenceLevel: "STRONG",
			recommendedDose: "100-150mg/kg body weight",
			duration: "Acute stress situations",
			effectSize: 0.7,
			studyCount: 15,
			participantCount: 800,
			recommendationGrade: "A",
		},
		{
			condition: "Stress and fatigue",
			polishCondition: "Stres i zmęczenie",
			indication: "Reduced stress response and improved resilience",
			polishIndication: "Zmniejszona odpowiedź na stres i poprawiona odporność",
			efficacy: "high",
			effectivenessRating: 8,
			evidenceLevel: "STRONG",
			recommendedDose: "500-2000mg daily",
			duration: "Days to weeks",
			effectSize: 0.6,
			studyCount: 12,
			participantCount: 650,
			recommendationGrade: "A",
		},
		{
			condition: "Mood and motivation",
			polishCondition: "Nastrój i motywacja",
			indication: "Enhanced dopamine synthesis and mood improvement",
			polishIndication: "Wzmocniona synteza dopaminy i poprawa nastroju",
			efficacy: "moderate",
			effectivenessRating: 7,
			evidenceLevel: "MODERATE",
			recommendedDose: "500-1000mg daily",
			duration: "2-4 weeks",
			effectSize: 0.4,
			studyCount: 8,
			participantCount: 450,
			recommendationGrade: "B",
		},
		{
			condition: "Thyroid support",
			polishCondition: "Wsparcie tarczycy",
			indication: "Thyroid hormone precursor supplementation",
			polishIndication: "Suplementacja prekursora hormonów tarczycy",
			efficacy: "moderate",
			effectivenessRating: 6,
			evidenceLevel: "MODERATE",
			recommendedDose: "500-1500mg daily",
			duration: "4-8 weeks",
			effectSize: 0.3,
			studyCount: 6,
			participantCount: 300,
			recommendationGrade: "B",
		},
	],

	// Mechanisms of action with detailed pathways
	mechanisms: [
		{
			id: "catecholamine-precursor",
			name: "Catecholamine neurotransmitter precursor",
			polishName: "Prekursor neuroprzekaźników katecholaminowych",
			pathway: "Tyrosine hydroxylase pathway",
			polishPathway: "Ścieżka hydroksylazy tyrozyny",
			description:
				"L-Tyrosine is converted to L-DOPA by tyrosine hydroxylase, then to dopamine by aromatic L-amino acid decarboxylase. Dopamine serves as precursor for norepinephrine and epinephrine, supporting cognitive function and stress response.",
			polishDescription:
				"L-Tyrozyna jest przekształcana w L-DOPA przez hydroksylazę tyrozyny, następnie w dopaminę przez dekarboksylazę aromatycznych L-aminokwasów. Dopamina służy jako prekursor norepinefryny i epinefryny, wspierając funkcję poznawczą i odpowiedź na stres.",
			evidenceLevel: "STRONG",
			targetSystems: [
				"Dopaminergic system",
				"Noradrenergic system",
				"Adrenergic system",
				"Stress response",
			],
			timeToEffect: "30-60 minutes",
			duration: "4-6 hours",
		},
		{
			id: "thyroid-hormone",
			name: "Thyroid hormone synthesis support",
			polishName: "Wsparcie syntezy hormonów tarczycy",
			pathway: "Thyroid hormone pathway",
			polishPathway: "Ścieżka hormonów tarczycy",
			description:
				"L-Tyrosine serves as a precursor for thyroid hormones T3 and T4 synthesis, supporting metabolic function and energy regulation under stress conditions.",
			polishDescription:
				"L-Tyrozyna służy jako prekursor syntezy hormonów tarczycy T3 i T4, wspierając funkcję metaboliczną i regulację energii w warunkach stresu.",
			evidenceLevel: "STRONG",
			targetSystems: [
				"Thyroid function",
				"Metabolic regulation",
				"Energy metabolism",
			],
			timeToEffect: "2-4 hours",
			duration: "6-8 hours",
		},
		{
			id: "cognitive-enhancement",
			name: "Cognitive performance enhancement",
			polishName: "Wzmocnienie wydajności poznawczej",
			pathway: "Prefrontal cortex activation",
			polishPathway: "Aktywacja kory przedczołowej",
			description:
				"L-Tyrosine supplementation enhances catecholamine availability in the prefrontal cortex, improving working memory, executive function, and cognitive performance under stressful conditions.",
			polishDescription:
				"Suplementacja L-tyrozyny zwiększa dostępność katecholamin w korze przedczołowej, poprawiając pamięć roboczą, funkcję wykonawczą i wydajność poznawczą w warunkach stresowych.",
			evidenceLevel: "STRONG",
			targetSystems: [
				"Prefrontal cortex",
				"Working memory",
				"Executive function",
			],
			timeToEffect: "45-90 minutes",
			duration: "4-6 hours",
		},
	],

	// Comprehensive dosage guidelines
	dosageGuidelines: {
		therapeuticRange: {
			min: 500,
			max: 2000,
			unit: "mg",
		},
		timing: ["morning", "pre-stress"],
		withFood: false,
		contraindications: ["Phenylketonuria", "Melanoma", "Hypertension"],
		polishContraindications: ["Fenyloketonuria", "Czerniak", "Nadciśnienie"],
		interactions: [
			{
				substance: "MAO inhibitors",
				polishSubstance: "Inhibitory MAO",
				type: "antagonistic",
				severity: "severe",
				description: "Tyramine-like effects with MAO inhibitors",
				polishDescription: "Efekty podobne do tyraminy z inhibitorami MAO",
				clinicalSignificance: "Risk of hypertensive crisis",
				polishClinicalSignificance: "Ryzyko przełomu nadciśnieniowego",
				mechanism: "Increased catecholamine levels",
				polishMechanism: "Zwiększone poziomy katecholamin",
				recommendation: "Avoid combination",
				polishRecommendation: "Unikaj kombinacji",
				evidenceLevel: "STRONG",
			},
			{
				substance: "Levodopa",
				polishSubstance: "Lewodopa",
				type: "synergistic",
				severity: "beneficial",
				description: "Enhanced dopamine synthesis",
				polishDescription: "Wzmocniona synteza dopaminy",
				clinicalSignificance: "Improved efficacy",
				polishClinicalSignificance: "Poprawiona skuteczność",
				mechanism: "Precursor relationship",
				polishMechanism: "Relacja prekursor-produkt",
				recommendation: "May be beneficial in combination",
				polishRecommendation: "Może być korzystne w kombinacji",
				evidenceLevel: "MODERATE",
			},
		],
	},

	// Side effects with frequency and management
	sideEffects: [
		{
			effect: "Gastrointestinal discomfort",
			polishEffect: "Dyskomfort żołądkowo-jelitowy",
			frequency: "common",
			severity: "mild",
			reversible: true,
			dosageDependent: true,
			timeToOnset: "30-60 minutes",
			management: "Take with food, reduce dose",
			polishManagement: "Przyjmuj z jedzeniem, zmniejsz dawkę",
		},
		{
			effect: "Headache",
			polishEffect: "Ból głowy",
			frequency: "uncommon",
			severity: "mild",
			reversible: true,
			dosageDependent: true,
			timeToOnset: "1-2 hours",
			management: "Reduce dose, ensure hydration",
			polishManagement: "Zmniejsz dawkę, zapewnij nawodnienie",
		},
		{
			effect: "Insomnia",
			polishEffect: "Bezsenność",
			frequency: "uncommon",
			severity: "moderate",
			reversible: true,
			dosageDependent: true,
			timeToOnset: "4-6 hours",
			management: "Take earlier in day, reduce evening dose",
			polishManagement:
				"Przyjmuj wcześniej w ciągu dnia, zmniejsz dawkę wieczorną",
		},
	],

	// Supplement interactions
	interactions: [
		{
			substance: "Caffeine",
			polishSubstance: "Kofeina",
			type: "synergistic",
			severity: "beneficial",
			description: "Enhanced cognitive effects under stress",
			polishDescription: "Wzmocnione efekty poznawcze pod stresem",
			clinicalSignificance: "Improved stress resilience",
			polishClinicalSignificance: "Poprawiona odporność na stres",
			mechanism: "Complementary catecholamine modulation",
			polishMechanism: "Komplementarna modulacja katecholamin",
			recommendation: "Beneficial combination for cognitive performance",
			polishRecommendation: "Korzystna kombinacja dla wydajności poznawczej",
			evidenceLevel: "MODERATE",
		},
		{
			substance: "B-complex vitamins",
			polishSubstance: "Witaminy z grupy B",
			type: "synergistic",
			severity: "beneficial",
			description: "Enhanced neurotransmitter synthesis",
			polishDescription: "Wzmocniona synteza neuroprzekaźników",
			clinicalSignificance: "Improved efficacy",
			polishClinicalSignificance: "Poprawiona skuteczność",
			mechanism: "Cofactor support for tyrosine hydroxylase",
			polishMechanism: "Wsparcie kofaktorów dla hydroksylazy tyrozyny",
			recommendation: "Beneficial for optimal neurotransmitter synthesis",
			polishRecommendation:
				"Korzystne dla optymalnej syntezy neuroprzekaźników",
			evidenceLevel: "MODERATE",
		},
		{
			substance: "MAO inhibitors",
			polishSubstance: "Inhibitory MAO",
			type: "antagonistic",
			severity: "severe",
			description: "Risk of hypertensive crisis",
			polishDescription: "Ryzyko przełomu nadciśnieniowego",
			clinicalSignificance: "Dangerous interaction",
			polishClinicalSignificance: "Niebezpieczna interakcja",
			mechanism: "Increased catecholamine accumulation",
			polishMechanism: "Zwiększone gromadzenie katecholamin",
			recommendation: "Contraindicated combination",
			polishRecommendation: "Kombinacja przeciwwskazana",
			evidenceLevel: "STRONG",
		},
	],

	// Evidence level and research studies
	evidenceLevel: "STRONG",
	researchStudies: [
		{
			id: "deijen-1999",
			title:
				"Tyrosine improves cognitive performance and reduces blood pressure in cadets",
			polishTitle:
				"Tyrozyna poprawia wydajność poznawczą i obniża ciśnienie krwi u kadetów",
			authors: [
				"Deijen JB",
				"Wientjes CJ",
				"Vullinghs HF",
				"Cloin PA",
				"Langefeld JJ",
			],
			journal: "Brain Research Bulletin",
			year: 1999,
			studyType: "RANDOMIZED_CONTROLLED_TRIAL",
			primaryOutcome: "Cognitive performance under stress",
			polishPrimaryOutcome: "Wydajność poznawcza pod stresem",
			findings:
				"L-Tyrosine significantly improved cognitive performance during stress",
			polishFindings:
				"L-Tyrozyna znacząco poprawiła wydajność poznawczą podczas stresu",
			evidenceLevel: "STRONG",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "10372549",
			doi: "10.1016/S0361-9230(98)00165-9",
			sampleSize: 21,
			duration: "Single dose study",
			dosage: "2g L-tyrosine",
			qualityScore: 8.0,
		},
		{
			id: "thomas-1999",
			title: "Tyrosine improves working memory in a multitasking environment",
			polishTitle:
				"Tyrozyna poprawia pamięć roboczą w środowisku wielozadaniowym",
			authors: ["Thomas JR", "Lockwood PA", "Singh A", "Deuster PA"],
			journal: "Pharmacology Biochemistry and Behavior",
			year: 1999,
			studyType: "RANDOMIZED_CONTROLLED_TRIAL",
			primaryOutcome: "Working memory performance",
			polishPrimaryOutcome: "Wydajność pamięci roboczej",
			findings:
				"L-Tyrosine enhanced working memory during stressful multitasking",
			polishFindings:
				"L-Tyrozyna wzmocniła pamięć roboczą podczas stresującego wielozadaniowości",
			evidenceLevel: "STRONG",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "10515309",
			doi: "10.1016/S0091-3057(99)00116-1",
			sampleSize: 10,
			duration: "Single dose study",
			dosage: "150mg/kg L-tyrosine",
			qualityScore: 7.5,
		},
		{
			id: "neri-1995",
			title:
				"The effects of tyrosine on cognitive performance during extended wakefulness",
			polishTitle:
				"Efekty tyrozyny na wydajność poznawczą podczas przedłużonej bezsenności",
			authors: [
				"Neri DF",
				"Wiegmann D",
				"Stanny RR",
				"Shappell SA",
				"McCardie A",
				"McKay DL",
			],
			journal: "Aviation, Space, and Environmental Medicine",
			year: 1995,
			studyType: "RANDOMIZED_CONTROLLED_TRIAL",
			primaryOutcome: "Cognitive performance during sleep deprivation",
			polishPrimaryOutcome: "Wydajność poznawcza podczas deprywacji snu",
			findings:
				"L-Tyrosine prevented cognitive decline during extended wakefulness",
			polishFindings:
				"L-Tyrozyna zapobiegła spadkowi poznawczemu podczas przedłużonej bezsenności",
			evidenceLevel: "MODERATE",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "8579614",
			doi: "10.3357/asem.1799.1995",
			sampleSize: 47,
			duration: "28 hours sleep deprivation",
			dosage: "2g L-tyrosine every 4 hours",
			qualityScore: 7.0,
		},
	],

	// Metadata
	tags: [
		"amino acid",
		"neurotransmitter precursor",
		"cognitive enhancement",
		"stress management",
		"dopamine",
		"catecholamines",
		"thyroid support",
	],
	lastUpdated: "2024-01-15T00:00:00Z",
	createdAt: "2024-01-15T00:00:00Z",

	// Additional fields for Prisma compatibility
	knowledgeNodeId: null,
};

export const lTyrosineData = lTyrosineProfile;
export default lTyrosineProfile;
