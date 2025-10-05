/**
 * Alpha-GPC Supplement Profile
 * Migrated from nextjs-roocode-template with enhanced T3 Stack compatibility
 * Premium Choline Source with comprehensive Polish medical compliance
 */

import type { SupplementWithRelations } from "../../types/supplement";

export const alphaGPCProfile: SupplementWithRelations = {
	id: "alpha-gpc",
	name: "Alpha-GPC",
	polishName: "Alfa-GPC",
	scientificName: "L-Alpha glycerylphosphorylcholine",
	commonNames: [
		"Choline alfoscerate",
		"GPC",
		"Glycerophosphocholine",
		"Alpha-glycerophosphocholine",
	],
	polishCommonNames: [
		"Alfoscerat choliny",
		"GPC",
		"Glicerofosfocholina",
		"Alfa-glicerofosfocholina",
	],
	category: "NOOTROPIC",
	description:
		"Alpha-GPC is a highly bioavailable form of choline that crosses the blood-brain barrier effectively. It supports acetylcholine synthesis and contributes to cognitive function, memory formation, and neuroplasticity.",
	polishDescription:
		"Alfa-GPC to wysoce biodostępna forma choliny, która skutecznie przekracza barierę krew-mózg. Wspomaga syntezę acetylocholiny i przyczynia się do funkcji poznawczych, tworzenia pamięci i neuroplastyczności.",

	// Active compounds with detailed bioavailability data
	activeCompounds: [
		{
			name: "Alpha-GPC",
			polishName: "Alfa-GPC",
			concentration: "300mg",
			bioavailability: 95,
			halfLife: "4-6 hours",
			metabolicPathway: ["Cholinergic pathway", "Phospholipid metabolism"],
			targetReceptors: ["Nicotinic receptors", "Muscarinic receptors"],
		},
	],

	// Clinical applications with Polish translations
	clinicalApplications: [
		{
			condition: "Cognitive enhancement",
			polishCondition: "Wzmocnienie funkcji poznawczych",
			indication: "Memory improvement and focus enhancement",
			polishIndication: "Poprawa pamięci i wzmocnienie koncentracji",
			efficacy: "moderate",
			effectivenessRating: 7,
			evidenceLevel: "MODERATE",
			recommendedDose: "300-600mg daily",
			duration: "4-12 weeks for noticeable effects",
			effectSize: 0.3,
			studyCount: 15,
			participantCount: 1200,
			recommendationGrade: "B",
		},
		{
			condition: "Age-related cognitive decline",
			polishCondition: "Związany z wiekiem spadek funkcji poznawczych",
			indication: "Support for mild cognitive impairment",
			polishIndication: "Wsparcie przy łagodnych zaburzeniach poznawczych",
			efficacy: "moderate",
			effectivenessRating: 6,
			evidenceLevel: "MODERATE",
			recommendedDose: "400-800mg daily",
			duration: "6-24 weeks",
			effectSize: 0.4,
			studyCount: 8,
			participantCount: 800,
			recommendationGrade: "B",
		},
		{
			condition: "Athletic performance",
			polishCondition: "Wydolność sportowa",
			indication: "Power output and growth hormone response",
			polishIndication: "Moc wyjściowa i odpowiedź hormonu wzrostu",
			efficacy: "moderate",
			effectivenessRating: 6,
			evidenceLevel: "MODERATE",
			recommendedDose: "600mg pre-workout",
			duration: "Acute supplementation",
			effectSize: 0.25,
			studyCount: 3,
			participantCount: 150,
			recommendationGrade: "C",
		},
	],

	// Mechanisms of action with detailed pathways
	mechanisms: [
		{
			id: "cholinergic-enhancement",
			name: "Cholinergic neurotransmission enhancement",
			polishName: "Wzmocnienie neurotransmisji cholinergicznej",
			pathway: "Cholinergic pathway",
			polishPathway: "Cholinergic pathway",
			description:
				"Alpha-GPC provides choline for acetylcholine synthesis and contributes to cell membrane integrity through phospholipid production. It increases acetylcholine levels in the brain, supporting memory formation and cognitive function.",
			polishDescription:
				"Alfa-GPC dostarcza cholinę do syntezy acetylocholiny i przyczynia się do integralności błon komórkowych poprzez produkcję fosfolipidów. Zwiększa poziom acetylocholiny w mózgu, wspierając tworzenie pamięci i funkcje poznawcze.",
			evidenceLevel: "STRONG",
			targetSystems: ["Central nervous system", "Cholinergic system"],
			timeToEffect: "30-60 minutes",
			duration: "4-6 hours",
		},
		{
			id: "membrane-integrity",
			name: "Cell membrane integrity support",
			polishName: "Wsparcie integralności błon komórkowych",
			pathway: "Phospholipid metabolism",
			polishPathway: "Phospholipid metabolism",
			description:
				"Alpha-GPC contributes to phosphatidylcholine synthesis, supporting neuronal membrane integrity and fluidity, which is crucial for optimal neurotransmitter function.",
			polishDescription:
				"Alfa-GPC przyczynia się do syntezy fosfatydylocholiny, wspierając integralność i płynność błon neuronalnych, co jest kluczowe dla optymalnej funkcji neurotransmiterów.",
			evidenceLevel: "MODERATE",
			targetSystems: ["Neuronal membranes", "Phospholipid metabolism"],
			timeToEffect: "2-4 weeks",
			duration: "Chronic supplementation required",
		},
	],

	// Comprehensive dosage guidelines
	dosageGuidelines: {
		therapeuticRange: {
			min: 300,
			max: 1200,
			unit: "mg",
		},
		timing: ["morning", "afternoon", "pre-workout"],
		withFood: true,
		contraindications: [
			"Bipolar disorder",
			"Active psychosis",
			"Severe depression without medical supervision",
		],
		polishContraindications: [
			"Choroba afektywna dwubiegunowa",
			"Aktywna psychoza",
			"Ciężka depresja bez nadzoru medycznego",
		],
		interactions: [
			{
				substance: "Anticholinergic medications",
				polishSubstance: "Leki antycholinergiczne",
				type: "antagonistic",
				severity: "moderate",
				description: "May reduce effectiveness of anticholinergic medications",
				clinicalSignificance: "May reduce effectiveness; monitor closely",
				polishClinicalSignificance:
					"Może zmniejszyć skuteczność; monitoruj uważnie",
				polishDescription:
					"Może zmniejszyć skuteczność leków antycholinergicznych",
				recommendation: "Consult healthcare provider before combining",
				polishRecommendation: "Skonsultuj się z lekarzem przed łączeniem",
				evidenceLevel: "MODERATE",
			},
		],
	},

	// Side effects with frequency and management
	sideEffects: [
		{
			effect: "Headache",
			polishEffect: "Ból głowy",
			frequency: "uncommon",
			severity: "mild",
			reversible: true,
			dosageDependent: true,
			timeToOnset: "1-2 hours",
			management: "Reduce dose or take with food",
			polishManagement: "Zmniejsz dawkę lub przyjmuj z jedzeniem",
		},
		{
			effect: "Nausea",
			polishEffect: "Nudności",
			frequency: "rare",
			severity: "mild",
			reversible: true,
			dosageDependent: true,
			timeToOnset: "30-60 minutes",
			management: "Take with food, reduce dose",
			polishManagement: "Przyjmuj z jedzeniem, zmniejsz dawkę",
		},
		{
			effect: "Dizziness",
			polishEffect: "Zawroty głowy",
			frequency: "rare",
			severity: "mild",
			reversible: true,
			dosageDependent: true,
			timeToOnset: "1-3 hours",
			management: "Reduce dose, ensure adequate hydration",
			polishManagement: "Zmniejsz dawkę, zapewnij odpowiednie nawodnienie",
		},
	],

	// Supplement interactions
	interactions: [
		{
			substance: "Racetams",
			polishSubstance: "Racetamy",
			type: "synergistic",
			severity: "beneficial",
			description: "Interaction between supplements",
			polishDescription: "Interakcja między suplementami",
			clinicalSignificance: "Monitor for effects",
			polishClinicalSignificance: "Monitorować efekty",
			mechanism: "Enhanced cholinergic activity",
			polishMechanism: "Wzmocniona aktywność cholinergiczna",
			recommendation: "Commonly stacked together for cognitive enhancement",
			polishRecommendation:
				"Często łączone razem dla wzmocnienia funkcji poznawczych",
			evidenceLevel: "MODERATE",
		},
		{
			substance: "Caffeine",
			polishSubstance: "Kofeina",
			type: "synergistic",
			clinicalSignificance: "Beneficial interaction - may enhance effects",
			polishClinicalSignificance: "Korzystna interakcja - może wzmocnić efekty",
			severity: "beneficial",
			mechanism: "Complementary cognitive enhancement",
			polishMechanism: "Komplementarne wzmocnienie funkcji poznawczych",
			description:
				"Caffeine provides alertness while Alpha-GPC supports memory",
			polishDescription:
				"Kofeina zapewnia czujność, podczas gdy Alfa-GPC wspiera pamięć",
			recommendation: "Safe combination for cognitive enhancement",
			polishRecommendation:
				"Bezpieczne połączenie dla wzmocnienia funkcji poznawczych",
			evidenceLevel: "WEAK",
		},
	],

	// Evidence level and research studies
	evidenceLevel: "MODERATE",
	researchStudies: [
		{
			id: "ziegenfuss-2008",
			title: "Alpha-GPC and power output; growth hormone response",
			polishTitle: "Alfa-GPC a moc wyjściowa; odpowiedź hormonu wzrostu",
			authors: ["Ziegenfuss T", "Landis J", "Hofheins J"],
			journal: "Journal of the International Society of Sports Nutrition",
			year: 2008,
			studyType: "RANDOMIZED_CONTROLLED_TRIAL",
			primaryOutcome: "Power output and growth hormone response",
			polishPrimaryOutcome: "Moc wyjściowa i odpowiedź hormonu wzrostu",
			findings:
				"Alpha-GPC supplementation increased power output and growth hormone response in healthy young men",
			polishFindings:
				"Suplementacja Alfa-GPC zwiększyła moc wyjściową i odpowiedź hormonu wzrostu u zdrowych młodych mężczyzn",
			evidenceLevel: "MODERATE",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "18834505",
			doi: "10.1186/1550-2783-5-15",
			sampleSize: 7,
			duration: "6 days",
			dosage: "600mg",
			qualityScore: 7.5,
		},
		{
			id: "parnetti-2007",
			title:
				"Cholinesterase inhibitors and beyond: the pharmacological treatment of dementia",
			polishTitle:
				"Inhibitory cholinoesterazy i dalej: farmakologiczne leczenie demencji",
			authors: ["Parnetti L", "Amenta F", "Gallai V"],
			journal: "Current Alzheimer Research",
			year: 2007,
			studyType: "SYSTEMATIC_REVIEW",
			primaryOutcome: "Cognitive improvement in dementia patients",
			polishPrimaryOutcome:
				"Poprawa funkcji poznawczych u pacjentów z demencją",
			findings:
				"Alpha-GPC showed beneficial effects on cognitive function in patients with mild to moderate dementia",
			polishFindings:
				"Alfa-GPC wykazał korzystne efekty na funkcje poznawcze u pacjentów z łagodną do umiarkowanej demencją",
			evidenceLevel: "MODERATE",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "17430239",
			doi: "10.2174/156720507780362173",
			qualityScore: 8.0,
		},
	],

	// Metadata
	tags: [
		"nootropic",
		"choline",
		"cognitive enhancement",
		"memory",
		"acetylcholine",
		"neuroprotection",
		"sports performance",
	],
	lastUpdated: "2024-01-15T00:00:00Z",
	createdAt: "2024-01-15T00:00:00Z",

	// Additional fields for Prisma compatibility
	knowledgeNodeId: null,
};

export default alphaGPCProfile;
