/**
 * St. John's Wort Supplement Profile
 * Migrated from nextjs-roocode-template with enhanced T3 Stack compatibility
 * Traditional Mood Support Herb with comprehensive Polish medical compliance
 */

import type { SupplementWithRelations } from "../../types/supplement";

export const stJohnsWortProfile: SupplementWithRelations = {
	id: "st-johns-wort",
	name: "St. John's Wort",
	polishName: "Dziurawiec zwyczajny",
	scientificName: "Hypericum perforatum",
	commonNames: [
		"St. John's Wort",
		"Hypericum",
		"Common St. Johns Wort",
		"Perforate St Johns-wort",
	],
	polishCommonNames: [
		"Dziurawiec zwyczajny",
		"Dziurawiec perforowany",
		"Ziele dziurawca",
		"Hypericum",
	],
	category: "HERB",
	description:
		"St. John's Wort is a well-studied herb traditionally used for mood disorders and depression. Rich in hypericin and hyperforin, it exerts antidepressant effects primarily through serotonin reuptake inhibition, similar to conventional antidepressants. It is particularly effective for mild to moderate depression but requires careful monitoring due to significant drug interactions.",
	polishDescription:
		"Dziurawiec zwyczajny to dobrze zbadane zioło tradycyjnie stosowane w zaburzeniach nastroju i depresji. Bogate w hypericynę i hyperforynę, wywiera działanie antydepresyjne głównie poprzez hamowanie wychwytu zwrotnego serotoniny, podobnie do konwencjonalnych antydepresantów. Jest szczególnie skuteczny w łagodnej do umiarkowanej depresji, ale wymaga ostrożnego monitorowania ze względu na znaczące interakcje z lekami.",

	// Active compounds with detailed bioavailability data
	activeCompounds: [
		{
			name: "Hypericin",
			polishName: "Hypericyna",
			concentration: "0.3%",
			bioavailability: 14,
			halfLife: "24-48 hours",
			metabolicPathway: [
				"Hepatic metabolism",
				"CYP3A4 induction",
				"P-glycoprotein modulation",
			],
			targetReceptors: [
				"Serotonin transporters",
				"MAO-A",
				"MAO-B",
				"GABA receptors",
			],
		},
		{
			name: "Hyperforin",
			polishName: "Hyperforyna",
			concentration: "2-4%",
			bioavailability: 20,
			halfLife: "9 hours",
			metabolicPathway: ["CYP3A4 induction", "P-glycoprotein activation"],
			targetReceptors: [
				"TRPC6 channels",
				"Serotonin reuptake inhibition",
				"Norepinephrine reuptake",
			],
		},
	],

	// Clinical applications with Polish translations
	clinicalApplications: [
		{
			condition: "Mild to moderate depression",
			polishCondition: "Łagodna do umiarkowanej depresja",
			indication: "Primary treatment for mild to moderate depressive episodes",
			polishIndication:
				"Podstawowe leczenie łagodnych do umiarkowanych epizodów depresyjnych",
			efficacy: "high",
			effectivenessRating: 8,
			evidenceLevel: "STRONG",
			recommendedDose: "300mg three times daily (standardized extract)",
			duration: "4-6 weeks for initial effects, 8-12 weeks for full benefits",
			effectSize: 0.7,
			studyCount: 35,
			participantCount: 4000,
			recommendationGrade: "A",
		},
		{
			condition: "Seasonal Affective Disorder (SAD)",
			polishCondition: "Sezonowe zaburzenia afektywne (SAD)",
			indication: "Treatment of seasonal depression and mood changes",
			polishIndication: "Leczenie sezonowej depresji i zmian nastroju",
			efficacy: "moderate",
			effectivenessRating: 6,
			evidenceLevel: "MODERATE",
			recommendedDose: "300mg twice daily",
			duration: "Throughout seasonal period (autumn/winter)",
			effectSize: 0.5,
			studyCount: 8,
			participantCount: 800,
			recommendationGrade: "B",
		},
		{
			condition: "Anxiety disorders",
			polishCondition: "Zaburzenia lękowe",
			indication: "Adjunctive treatment for generalized anxiety",
			polishIndication: "Leczenie wspomagające uogólnionego lęku",
			efficacy: "moderate",
			effectivenessRating: 6,
			evidenceLevel: "MODERATE",
			recommendedDose: "300mg twice daily",
			duration: "6-8 weeks",
			effectSize: 0.4,
			studyCount: 12,
			participantCount: 1200,
			recommendationGrade: "B",
		},
	],

	// Mechanisms of action with detailed pathways
	mechanisms: [
		{
			id: "serotonin-reuptake-inhibition",
			name: "Serotonin reuptake inhibition",
			polishName: "Hamowanie wychwytu zwrotnego serotoniny",
			pathway: "Serotonergic neurotransmission",
			polishPathway: "Serotonergic neurotransmission",
			description:
				"Hyperforin inhibits serotonin reuptake by blocking sodium channels and increasing synaptic serotonin availability, similar to SSRIs but through a different mechanism.",
			polishDescription:
				"Hyperforyna hamuje wychwyt zwrotny serotoniny poprzez blokowanie kanałów sodowych i zwiększanie dostępności serotoniny synaptycznej, podobnie do SSRI, ale przez inny mechanizm.",
			evidenceLevel: "STRONG",
			targetSystems: ["Serotonergic system", "Synaptic transmission"],
			timeToEffect: "2-4 weeks",
			duration: "Chronic supplementation required",
		},
		{
			id: "mao-inhibition",
			name: "Monoamine oxidase inhibition",
			polishName: "Hamowanie oksydazy monoaminowej",
			pathway: "MAO-A and MAO-B inhibition",
			polishPathway: "MAO-A and MAO-B inhibition",
			description:
				"Hypericin weakly inhibits both MAO-A and MAO-B enzymes, reducing breakdown of serotonin, norepinephrine, and dopamine.",
			polishDescription:
				"Hypericyna słabo hamuje enzymy MAO-A i MAO-B, zmniejszając rozkład serotoniny, noradrenaliny i dopaminy.",
			evidenceLevel: "MODERATE",
			targetSystems: ["Monoamine metabolism", "Neurotransmitter degradation"],
			timeToEffect: "1-2 weeks",
			duration: "During supplementation period",
		},
	],

	// Comprehensive dosage guidelines
	dosageGuidelines: {
		therapeuticRange: {
			min: 300,
			max: 900,
			unit: "mg",
		},
		timing: ["morning", "afternoon", "evening"],
		withFood: true,
		contraindications: [
			"Severe depression requiring immediate medical intervention",
			"Bipolar disorder (risk of mania induction)",
			"Pregnancy and breastfeeding",
			"Concurrent use with antidepressants",
			"Photosensitizing medications",
			"Organ transplant recipients (immunosuppressant interactions)",
		],
		polishContraindications: [
			"Ciężka depresja wymagająca natychmiastowej interwencji medycznej",
			"Zaburzenia dwubiegunowe (ryzyko wywołania manii)",
			"Ciąża i karmienie piersią",
			"Jednoczesne stosowanie z antydepresantami",
			"Leki fotouczulające",
			"Biorcy przeszczepów narządów (interakcje z immunosupresantami)",
		],
		interactions: [
			{
				substance: "SSRIs/SNRIs",
				polishSubstance: "SSRI/SNRI",
				type: "antagonistic",
				severity: "severe",
				description: "Risk of serotonin syndrome",
				clinicalSignificance: "Significant interaction; avoid combination",
				polishClinicalSignificance: "Znacząca interakcja; unikaj kombinacji",
				polishDescription: "Ryzyko zespołu serotoninowego",
				recommendation: "Avoid concurrent use, consult physician",
				polishRecommendation:
					"Unikaj jednoczesnego stosowania, skonsultuj się z lekarzem",
				evidenceLevel: "STRONG",
			},
		],
	},

	// Side effects with frequency and management
	sideEffects: [
		{
			effect: "Photosensitivity",
			polishEffect: "Fotowrażliwość",
			frequency: "common",
			severity: "mild",
			reversible: true,
			dosageDependent: true,
			timeToOnset: "1-2 weeks",
			management: "Use sunscreen, limit sun exposure",
			polishManagement:
				"Używaj kremów z filtrem, ogranicz ekspozycję na słońce",
		},
		{
			effect: "Gastrointestinal upset",
			polishEffect: "Rozstrój żołądkowo-jelitowy",
			frequency: "uncommon",
			severity: "mild",
			reversible: true,
			dosageDependent: true,
			timeToOnset: "1-7 days",
			management: "Take with food, reduce dose if severe",
			polishManagement: "Przyjmuj z jedzeniem, zmniejsz dawkę jeśli ciężkie",
		},
	],

	// Supplement interactions
	interactions: [
		{
			substance: "Warfarin",
			polishSubstance: "Warfaryna",
			type: "antagonistic",
			severity: "severe",
			description: "Interaction between supplements",
			polishDescription: "Interakcja między suplementami",
			clinicalSignificance: "Monitor for effects",
			polishClinicalSignificance: "Monitorować efekty",
			mechanism: "CYP3A4 induction reduces warfarin effectiveness",
			polishMechanism: "Indukcja CYP3A4 zmniejsza skuteczność warfaryny",
			recommendation: "Avoid combination, monitor INR closely if used",
			polishRecommendation:
				"Unikaj kombinacji, ściśle monitoruj INR jeśli stosowane",
			evidenceLevel: "STRONG",
		},
	],

	// Evidence level and research studies
	evidenceLevel: "STRONG",
	researchStudies: [
		{
			id: "linde-2008",
			title: "St Johns wort for major depression",
			polishTitle: "Dziurawiec zwyczajny w dużej depresji",
			authors: ["Linde K", "Berner MM", "Kriston L"],
			journal: "Cochrane Database of Systematic Reviews",
			year: 2008,
			studyType: "SYSTEMATIC_REVIEW",
			primaryOutcome: "Depression severity reduction",
			polishPrimaryOutcome: "Zmniejszenie nasilenia depresji",
			findings:
				"St Johns wort extracts are superior to placebo and similarly effective as standard antidepressants for major depression",
			polishFindings:
				"Ekstrakty dziurawca są lepsze od placebo i podobnie skuteczne jak standardowe antydepresanty w dużej depresji",
			evidenceLevel: "STRONG",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "18843608",
			doi: "10.1002/14651858.CD000448.pub3",
			qualityScore: 9.5,
		},
	],

	// Metadata
	tags: [
		"herb",
		"antidepressant",
		"mood support",
		"serotonin",
		"depression",
		"anxiety",
		"traditional medicine",
		"photosensitivity",
		"drug interactions",
		"migrated",
	],
	lastUpdated: "2024-01-15T00:00:00Z",
	createdAt: "2024-01-15T00:00:00Z",

	// Additional fields for Prisma compatibility
	knowledgeNodeId: null,
};

export default stJohnsWortProfile;
