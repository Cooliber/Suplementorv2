/**
 * Acetyl-L-Carnitine Supplement Profile
 * Migrated from nextjs-roocode-template with enhanced T3 Stack compatibility
 * Mitochondrial Energy Enhancer with comprehensive Polish medical compliance
 */

import type { SupplementWithRelations } from "../../types/supplement";

export const acetylLCarnitineProfile: SupplementWithRelations = {
	id: "acetyl-l-carnitine",
	name: "Acetyl-L-Carnitine",
	polishName: "Acetylo-L-karnityna",
	scientificName: "Acetyl-L-carnitine",
	commonNames: ["ALCAR", "ALC", "Acetylcarnitine", "LAC"],
	polishCommonNames: [
		"Acetylo-L-karnityna",
		"ALCAR",
		"ALC",
		"Acetylokarnityna",
	],
	category: "NOOTROPIC",
	description:
		"Acetyl-L-Carnitine (ALCAR) enhances mitochondrial function, provides acetyl groups for acetylcholine synthesis, and supports neuronal energy metabolism. It is a key nootropic for cognitive enhancement and neuroprotection.",
	polishDescription:
		"Acetylo-L-karnityna (ALCAR) wzmocnia funkcję mitochondrialną, dostarcza grupy acetylowe do syntezy acetylocholiny i wspiera metabolizm energetyczny neuronów. Jest kluczowym nootropikiem do wzmocnienia funkcji poznawczych i neuroprotekcji.",

	// Active compounds with detailed bioavailability data
	activeCompounds: [
		{
			name: "Acetyl-L-Carnitine",
			polishName: "Acetylo-L-karnityna",
			concentration: "500mg",
			bioavailability: 85,
			halfLife: "12-15 hours",
			metabolicPathway: [
				"Mitochondrial fatty acid oxidation",
				"Acetylcholine synthesis",
			],
			targetReceptors: [],
		},
	],

	// Clinical applications with Polish translations
	clinicalApplications: [
		{
			condition: "Cognitive decline",
			polishCondition: "Pogorszenie funkcji poznawczych",
			indication:
				"Support for mild cognitive impairment and age-related decline",
			polishIndication:
				"Wsparcie dla łagodnych zaburzeń poznawczych i pogorszenia związanego z wiekiem",
			efficacy: "moderate",
			effectivenessRating: 7,
			evidenceLevel: "MODERATE",
			recommendedDose: "1500-3000mg daily",
			duration: "3-6 months",
			effectSize: 0.4,
			studyCount: 12,
			participantCount: 900,
			recommendationGrade: "B",
		},
		{
			condition: "Neuropathic pain",
			polishCondition: "Ból neuropatyczny",
			indication:
				"Management of diabetic neuropathy and other neuropathic conditions",
			polishIndication:
				"Leczenie neuropatii cukrzycowej i innych stanów neuropatycznych",
			efficacy: "moderate",
			effectivenessRating: 6,
			evidenceLevel: "MODERATE",
			recommendedDose: "1500-3000mg daily",
			duration: "4-12 weeks",
			effectSize: 0.5,
			studyCount: 8,
			participantCount: 600,
			recommendationGrade: "B",
		},
	],

	// Mechanisms of action with detailed pathways
	mechanisms: [
		{
			id: "mitochondrial-enhancement",
			name: "Mitochondrial fatty acid oxidation enhancement",
			polishName:
				"Wzmocnienie utleniania kwasów tłuszczowych mitochondrialnych",
			pathway: "Mitochondrial fatty acid oxidation and acetylcholine synthesis",
			polishPathway:
				"Mitochondrial fatty acid oxidation and acetylcholine synthesis",
			description:
				"ALCAR enhances mitochondrial function, provides acetyl groups for acetylcholine synthesis, and supports neuronal energy metabolism. It improves cellular energy production and protects against oxidative stress.",
			polishDescription:
				"ALCAR wzmocnia funkcję mitochondrialną, dostarcza grupy acetylowe do syntezy acetylocholiny i wspiera metabolizm energetyczny neuronów. Poprawia produkcję energii komórkowej i chroni przed stresem oksydacyjnym.",
			evidenceLevel: "STRONG",
			targetSystems: ["Mitochondrial system", "Cholinergic system"],
			timeToEffect: "2-4 weeks",
			duration: "Chronic supplementation required",
		},
	],

	// Comprehensive dosage guidelines
	dosageGuidelines: {
		therapeuticRange: {
			min: 500,
			max: 3000,
			unit: "mg",
		},
		timing: ["morning", "afternoon"],
		withFood: false,
		contraindications: ["Seizure disorders", "Hypothyroidism"],
		polishContraindications: [
			"Zaburzenia padaczkowe",
			"Niedoczynność tarczycy",
		],
		interactions: [
			{
				substance: "Warfarin",
				polishSubstance: "Waryfarina",
				type: "antagonistic",
				severity: "moderate",
				description: "Interaction between supplements",
				polishDescription: "Interakcja między suplementami",
				clinicalSignificance: "Monitor for effects",
				polishClinicalSignificance: "Monitorować efekty",
				mechanism: "Increased bleeding risk",
				polishMechanism: "Zwiększony ryzyko krwawienia",
				recommendation: "Monitor coagulation parameters if combining",
				polishRecommendation: "Monitoruj parametry krzepnięcia przy łączeniu",
				evidenceLevel: "MODERATE",
			},
		],
	},

	// Side effects with frequency and management
	sideEffects: [
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
			effect: "Restlessness",
			polishEffect: "Niespokojność",
			frequency: "rare",
			severity: "mild",
			reversible: true,
			dosageDependent: true,
			timeToOnset: "1-2 hours",
			management: "Reduce dose, time administration earlier in day",
			polishManagement: "Zmniejsz dawkę, zmień czas podania na wcześniej",
		},
	],

	// Supplement interactions
	interactions: [
		{
			substance: "Anticoagulants",
			polishSubstance: "Leki przeciwzakrzepowe",
			type: "antagonistic",
			severity: "moderate",
			description: "Interaction between supplements",
			polishDescription: "Interakcja między suplementami",
			clinicalSignificance: "Monitor for effects",
			polishClinicalSignificance: "Monitorować efekty",
			mechanism: "Increased bleeding risk",
			polishMechanism: "Zwiększony ryzyko krwawienia",
			recommendation: "Monitor coagulation parameters if combining",
			polishRecommendation: "Monitoruj parametry krzepnięcia przy łączeniu",
			evidenceLevel: "MODERATE",
		},
		{
			substance: "Thyroid hormones",
			polishSubstance: "Hormony tarczycy",
			type: "antagonistic",
			clinicalSignificance: "Moderate clinical significance - monitor closely",
			polishClinicalSignificance:
				"Umiarkowane znaczenie kliniczne - ścisłe monitorowanie",
			severity: "moderate",
			mechanism: "May interfere with thyroid function",
			polishMechanism: "Może zakłócać funkcję tarczycy",
			description: "May interfere with thyroid function and hormone levels",
			polishDescription: "Może zakłócać funkcję tarczycy i poziomy hormonów",
			recommendation: "Avoid in hypothyroidism and monitor thyroid function",
			polishRecommendation:
				"Unikaj przy niedoczynności tarczycy i monitoruj funkcję tarczycy",
			evidenceLevel: "WEAK",
		},
	],

	// Evidence level and research studies
	evidenceLevel: "MODERATE",
	researchStudies: [
		{
			id: "hudson-2003",
			title: "Acetyl-L-carnitine for dementia",
			polishTitle: "Acetylo-L-karnityna w leczeniu demencji",
			authors: ["Hudson S", "Tabet N"],
			journal: "Cochrane Database of Systematic Reviews",
			year: 2003,
			studyType: "META_ANALYSIS",
			primaryOutcome: "Cognitive function improvement",
			polishPrimaryOutcome: "Poprawa funkcji poznawczych",
			findings:
				"Moderate evidence for cognitive benefits in mild cognitive impairment",
			polishFindings:
				"Umiarkowana ilość dowodów na korzyści poznawcze w łagodnych zaburzeniach poznawczych",
			evidenceLevel: "STRONG",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "12917932",
			doi: "10.1002/14651858.CD003158",
			sampleSize: 1526,
			qualityScore: 8.5,
		},
		{
			id: "liu-2015",
			title: "Efficacy of acetyl-L-carnitine in neuropathic pain",
			polishTitle:
				"Skuteczność acetylo-L-karnityny w leczeniu bólu neuropatycznego",
			authors: ["Liu X", "Li F", "Zhang Y"],
			journal: "Clinical Journal of Pain",
			year: 2015,
			studyType: "RANDOMIZED_CONTROLLED_TRIAL",
			primaryOutcome: "Pain reduction in diabetic neuropathy",
			polishPrimaryOutcome: "Redukcja bólu w neuropatii cukrzycowej",
			findings:
				"Acetyl-L-Carnitine significantly reduced pain scores in patients with diabetic neuropathy",
			polishFindings:
				"Acetylo-L-karnityna znacząco zmniejszyła wyniki oceny bólu u pacjentów z neuropatią cukrzycową",
			evidenceLevel: "MODERATE",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "26222328",
			doi: "10.1097/AJP.0000000000000042",
			sampleSize: 229,
			duration: "5 weeks",
			dosage: "1000mg twice daily",
			qualityScore: 7.0,
		},
	],

	// Metadata
	tags: [
		"nootropic",
		"cognitive enhancement",
		"mitochondrial support",
		"energy",
		"neuroprotection",
		"acetylcholine",
		"neuropathic pain",
	],
	lastUpdated: "2024-01-15T00:00:00Z",
	createdAt: "2024-01-15T00:00:00Z",

	// Additional fields for Prisma compatibility
	knowledgeNodeId: null,
};

export default acetylLCarnitineProfile;
