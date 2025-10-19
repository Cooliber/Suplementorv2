/**
 * 5-HTP (5-Hydroxytryptophan) Supplement Profile
 * Comprehensive scientific data for serotonin support and mood regulation
 */

import type { SupplementWithRelations } from "../../types/supplement";

export const fiveHTPProfile: SupplementWithRelations = {
	id: "5-htp",
	name: "5-HTP",
	polishName: "5-HTP",
	scientificName: "5-Hydroxytryptophan",
	commonNames: ["5-Hydroxytryptophan", "Oxitriptan"],
	polishCommonNames: ["5-Hydroksytryptofan", "Oksytryptan"],
	category: "AMINO_ACID",
	description:
		"5-HTP is a naturally occurring amino acid and precursor to serotonin, used for mood support, sleep regulation, and appetite control. It crosses the blood-brain barrier and is converted to serotonin in the central nervous system.",
	polishDescription:
		"5-HTP to naturalnie występujący aminokwas i prekursor serotoniny, stosowany dla wsparcia nastroju, regulacji snu i kontroli apetytu. Przekracza barierę krew-mózg i jest przekształcany w serotoninę w ośrodkowym układzie nerwowym.",

	activeCompounds: [
		{
			name: "5-Hydroxytryptophan",
			polishName: "5-Hydroksytryptofan",
			concentration: "50-300mg",
			bioavailability: 70,
			halfLife: "2-4 hours",
			metabolicPathway: [
				"Serotonin synthesis",
				"Decarboxylation",
				"Blood-brain barrier transport",
			],
			targetReceptors: ["Aromatic L-amino acid decarboxylase"],
		},
	],

	clinicalApplications: [
		{
			condition: "Depression and mood disorders",
			polishCondition: "Depresja i zaburzenia nastroju",
			indication: "Adjunctive treatment for mild to moderate depression",
			polishIndication:
				"Leczenie wspomagające łagodnej do umiarkowanej depresji",
			efficacy: "moderate",
			effectivenessRating: 6,
			evidenceLevel: "MODERATE",
			recommendedDose: "100-300mg daily",
			duration: "4-8 weeks",
			effectSize: 0.4,
			studyCount: 20,
			participantCount: 1500,
			recommendationGrade: "B",
		},
		{
			condition: "Sleep disorders and insomnia",
			polishCondition: "Zaburzenia snu i bezsenność",
			indication: "Support for sleep onset and quality improvement",
			polishIndication: "Wsparcie zasypiania i poprawa jakości snu",
			efficacy: "moderate",
			effectivenessRating: 6,
			evidenceLevel: "WEAK",
			recommendedDose: "100-200mg before bedtime",
			duration: "2-4 weeks",
			effectSize: 0.3,
			studyCount: 15,
			participantCount: 800,
			recommendationGrade: "C",
		},
	],

	mechanisms: [
		{
			id: "serotonin-synthesis",
			name: "Serotonin precursor and neurotransmitter support",
			polishName: "Prekursor serotoniny i wsparcie neuroprzekaźnictwa",
			pathway: "Serotonin synthesis",
			polishPathway: "Synteza serotoniny",
			description:
				"5-HTP is converted to serotonin by aromatic L-amino acid decarboxylase, increasing serotonin levels in the brain and supporting mood, sleep, and appetite regulation.",
			polishDescription:
				"5-HTP jest przekształcany w serotoninę przez aromatyczną L-aminokwasową dekarboksylazę, zwiększając poziom serotoniny w mózgu i wspierając regulację nastroju, snu i apetytu.",
			evidenceLevel: "STRONG",
			targetSystems: [
				"Serotonin synthesis",
				"Mood regulation",
				"Sleep-wake cycle",
				"Appetite control",
			],
			timeToEffect: "1-2 hours",
			duration: "4-6 hours",
		},
	],

	dosageGuidelines: {
		therapeuticRange: {
			min: 50,
			max: 300,
			unit: "mg",
		},
		timing: ["evening"],
		withFood: false,
		contraindications: ["MAOI use", "Serotonin syndrome risk", "Pregnancy"],
		polishContraindications: [
			"Stosowanie IMAO",
			"Ryzyko zespołu serotoninowego",
			"Ciąża",
		],
		interactions: [
			{
				substance: "SSRIs",
				polishSubstance: "SSRI",
				type: "antagonistic",
				severity: "severe",
				description: "Risk of serotonin syndrome",
				polishDescription: "Ryzyko zespołu serotoninowego",
				clinicalSignificance: "Potentially dangerous serotonin excess",
				polishClinicalSignificance:
					"Potencjalnie niebezpieczny nadmiar serotoniny",
				mechanism: "Additive serotonin increase",
				polishMechanism: "Addytywny wzrost serotoniny",
				recommendation: "Contraindicated combination",
				polishRecommendation: "Przeciwwskazane połączenie",
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
			substance: "Vitamin B6",
			polishSubstance: "Witamina B6",
			type: "synergistic",
			severity: "beneficial",
			description: "Enhanced serotonin synthesis",
			polishDescription: "Wzmocniona synteza serotoniny",
			clinicalSignificance: "Improved therapeutic effects",
			polishClinicalSignificance: "Poprawione efekty terapeutyczne",
			mechanism: "Cofactor for decarboxylation enzyme",
			polishMechanism: "Kofaktor dla enzymu dekarboksylacji",
			recommendation: "Beneficial combination",
			polishRecommendation: "Korzystne połączenie",
			evidenceLevel: "MODERATE",
		},
	],

	evidenceLevel: "MODERATE",
	researchStudies: [
		{
			id: "shaw-2002",
			title: "5-HTP for depression",
			polishTitle: "5-HTP w depresji",
			authors: ["Shaw K", "Turner J", "Del Mar C"],
			journal: "Cochrane Database of Systematic Reviews",
			year: 2002,
			studyType: "SYSTEMATIC_REVIEW",
			primaryOutcome: "Depression symptom improvement",
			polishPrimaryOutcome: "Poprawa objawów depresji",
			findings: "5-HTP may be effective for depression",
			polishFindings: "5-HTP może być skuteczne w depresji",
			evidenceLevel: "MODERATE",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "11869656",
			doi: "10.1002/14651858.CD003198",
			sampleSize: 0,
			qualityScore: 7.5,
		},
	],

	tags: [
		"5-htp",
		"serotonin",
		"mood",
		"sleep",
		"depression",
		"amino acid",
		"neurotransmitter",
	],
	lastUpdated: "2024-01-15T00:00:00Z",
	createdAt: "2024-01-15T00:00:00Z",
	knowledgeNodeId: null,
};

export default fiveHTPProfile;
