/**
 * Ashwagandha Supplement Profile
 * Migrated from nextjs-roocode-template with enhanced T3 Stack compatibility
 * The Stress-Reducing Adaptogen with comprehensive Polish medical compliance
 */

import type { SupplementWithRelations } from "../../types/supplement";

export const ashwagandhaProfile: SupplementWithRelations = {
	id: "ashwagandha",
	name: "Ashwagandha",
	polishName: "Ashwagandha",
	scientificName: "Withania somnifera",
	commonNames: [
		"Withania somnifera",
		"Indian Winter Cherry",
		"Poison Gooseberry",
	],
	polishCommonNames: [
		"Withania somnifera",
		"Indyjska Wiśnia Zimowa",
		"Trujący Porzecznik",
	],
	category: "ADAPTOGEN",
	description:
		"Ashwagandha is a powerful adaptogenic herb used in Ayurvedic medicine for centuries. It helps the body adapt to stress, reduces cortisol levels, and supports overall well-being. It is one of the most well-studied adaptogens for stress management and cognitive function.",
	polishDescription:
		"Ashwagandha to potężny ziołowy adaptogen używany w medycynie ajurwedyjskiej od wieków. Pomaga organizmowi adaptować się do stresu, zmniejsza poziom kortyzolu i wspiera ogólne samopoczucie. Jest jednym z najlepiej badanych adaptogenów do zarządzania stresem i funkcją poznawczą.",

	// Active compounds with detailed bioavailability data
	activeCompounds: [
		{
			name: "Withanolides",
			polishName: "Withanolidy",
			concentration: "5%",
			bioavailability: 75,
			halfLife: "6-8 hours",
			metabolicPathway: ["Cortisol regulation", "GABA signaling"],
			targetReceptors: ["GABA receptors", "Cortisol receptors"],
		},
	],

	// Clinical applications with Polish translations
	clinicalApplications: [
		{
			condition: "Stress and anxiety",
			polishCondition: "Stres i lęk",
			indication: "Reduction of stress-related symptoms and anxiety",
			polishIndication: "Redukcja objawów związanych ze stresem i lękiem",
			efficacy: "high",
			effectivenessRating: 8,
			evidenceLevel: "STRONG",
			recommendedDose: "300-600mg daily",
			duration: "8-12 weeks",
			effectSize: 0.6,
			studyCount: 15,
			participantCount: 1100,
			recommendationGrade: "A",
		},
		{
			condition: "Sleep quality improvement",
			polishCondition: "Poprawa jakości snu",
			indication: "Support for better sleep patterns and relaxation",
			polishIndication: "Wsparcie dla lepszych wzorców snu i relaksacji",
			efficacy: "moderate",
			effectivenessRating: 6,
			evidenceLevel: "MODERATE",
			recommendedDose: "300-600mg evening",
			duration: "4-6 weeks",
			effectSize: 0.4,
			studyCount: 7,
			participantCount: 450,
			recommendationGrade: "B",
		},
		{
			condition: "Cognitive function",
			polishCondition: "Funkcja poznawcza",
			indication: "Support for memory and executive function",
			polishIndication: "Wsparcie dla pamięci i funkcji egzekutywnych",
			efficacy: "moderate",
			effectivenessRating: 6,
			evidenceLevel: "MODERATE",
			recommendedDose: "300-600mg daily",
			duration: "8-12 weeks",
			effectSize: 0.3,
			studyCount: 9,
			participantCount: 600,
			recommendationGrade: "B",
		},
	],

	// Mechanisms of action with detailed pathways
	mechanisms: [
		{
			id: "stress-axis-regulation",
			name: "HPA axis and cortisol regulation",
			polishName: "Regulacja osi HPA i kortyzolu",
			pathway: "Hypothalamic-pituitary-adrenal axis",
			polishPathway: "Hypothalamic-pituitary-adrenal axis",
			description:
				"Ashwagandha modulates the stress response by regulating cortisol levels and supporting the HPA axis, while enhancing GABA signaling for relaxation. It helps maintain homeostasis during periods of stress.",
			polishDescription:
				"Ashwagandha moduluje odpowiedź na stres przez regulację poziomu kortyzolu i wspieranie osi HPA, a także wzmacnia sygnalizację GABA dla relaksu. Pomaga utrzymać homeostazę w okresach stresu.",
			evidenceLevel: "STRONG",
			targetSystems: [
				"Neuroendocrine system",
				"Stress response system",
				"GABA system",
			],
			timeToEffect: "1-2 weeks",
			duration: "Chronic supplementation required",
		},
		{
			id: "gaba-enhancement",
			name: "GABA signaling enhancement",
			polishName: "Wzmocnienie sygnalizacji GABA",
			pathway: "GABAergic neurotransmission",
			polishPathway: "GABAergic neurotransmission",
			description:
				"Ashwagandha enhances GABA signaling in the brain, which contributes to its anxiolytic and relaxation properties.",
			polishDescription:
				"Ashwagandha wzmacnia sygnalizację GABA w mózgu, co przyczynia się do jej właściwości przeciwlękowych i relaksacyjnych.",
			evidenceLevel: "MODERATE",
			targetSystems: ["GABA system", "Anxiety pathways"],
			timeToEffect: "2-4 weeks",
			duration: "Chronic supplementation required",
		},
	],

	// Comprehensive dosage guidelines
	dosageGuidelines: {
		therapeuticRange: {
			min: 300,
			max: 1000,
			unit: "mg",
		},
		timing: ["morning", "evening"],
		withFood: true,
		contraindications: ["Pregnancy", "Autoimmune conditions"],
		polishContraindications: ["Ciąża", "Choroby autoimmunologiczne"],
		interactions: [],
	},

	// Side effects with frequency and management
	sideEffects: [
		{
			effect: "Drowsiness",
			polishEffect: "Ozdrowsienie",
			frequency: "uncommon",
			severity: "mild",
			reversible: true,
			dosageDependent: true,
			timeToOnset: "1-2 hours",
			management: "Reduce evening dose, take earlier in day",
			polishManagement:
				"Zmniejsz dawkę wieczorową, przyjmuj wcześniej w ciągu dnia",
		},
		{
			effect: "Upset stomach",
			polishEffect: "Nudności",
			frequency: "rare",
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
			substance: "Sedatives",
			polishSubstance: "Środki uspokajające",
			type: "synergistic",
			severity: "moderate",
			description: "Interaction between supplements",
			polishDescription: "Interakcja między suplementami",
			clinicalSignificance: "Monitor for effects",
			polishClinicalSignificance: "Monitorować efekty",
			mechanism: "Enhanced sedative effects",
			polishMechanism: "Wzmocnione efekty uspokajające",
			recommendation: "Monitor for excessive sedation when combining",
			polishRecommendation: "Monitoruj nadmierne uspokojenie przy łączeniu",
			evidenceLevel: "MODERATE",
		},
		{
			substance: "Immunosuppressants",
			polishSubstance: "Leki immunosupresyjne",
			type: "antagonistic",
			clinicalSignificance: "Moderate clinical significance - monitor closely",
			polishClinicalSignificance:
				"Umiarkowane znaczenie kliniczne - ścisłe monitorowanie",
			severity: "moderate",
			mechanism: "Immune system stimulation",
			polishMechanism: "Stymulacja układu odpornościowego",
			description: "Ashwagandha may enhance immune function",
			polishDescription: "Ashwagandha może wzmocnić funkcję odpornościową",
			recommendation:
				"Avoid in autoimmune conditions and immunosuppressed individuals",
			polishRecommendation:
				"Unikaj w chorobach autoimmunologicznych i osobach z immunosupresją",
			evidenceLevel: "WEAK",
		},
	],

	// Evidence level and research studies
	evidenceLevel: "STRONG",
	researchStudies: [
		{
			id: "chandrasekhar-2012",
			title:
				"A prospective, randomized double-blind, placebo-controlled study of safety and efficacy of a high-concentration full-spectrum extract of ashwagandha root",
			polishTitle:
				"Badanie prospektywne, randomizowane, podwójnie ślepe, kontrolowane placebo dotyczące bezpieczeństwa i skuteczności ekstraktu pełnowidmowego o wysokim stężeniu z korzenia ashwagandy",
			authors: ["Chandrasekhar K", "Kapoor J", "Anishetty S"],
			journal: "Indian Journal of Medical Research",
			year: 2012,
			studyType: "RANDOMIZED_CONTROLLED_TRIAL",
			primaryOutcome: "Stress reduction and cortisol levels",
			polishPrimaryOutcome: "Redukcja stresu i poziomy kortyzolu",
			findings:
				"Significant reduction in stress scores and cortisol levels compared to placebo",
			polishFindings:
				"Znacząca redukcja wyników stresu i poziomów kortyzolu w porównaniu do placebo",
			evidenceLevel: "STRONG",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "23439798",
			doi: "10.4103/0971-5916.96272",
			sampleSize: 64,
			duration: "60 days",
			dosage: "300mg twice daily",
			qualityScore: 8.0,
		},
		{
			id: "langade-2019",
			title:
				"Efficacy and Safety of Ashwagandha Root Extract in Subclinical Hypothyroidism",
			polishTitle:
				"Skuteczność i bezpieczeństwo ekstraktu z korzenia ashwagandy w subklinicznym niedoczynności tarczycy",
			authors: ["Langade D", "Joshi K", "Sharma S"],
			journal: "Journal of Evidence-Based Complementary & Alternative Medicine",
			year: 2019,
			studyType: "RANDOMIZED_CONTROLLED_TRIAL",
			primaryOutcome: "Thyroid function improvement",
			polishPrimaryOutcome: "Poprawa funkcji tarczycy",
			findings:
				"Ashwagandha root extract significantly improved serum TSH and T4 levels",
			polishFindings:
				"Ekstrakt z korzenia ashwagandy znacząco poprawił poziomy TSH i T4 w surowicy",
			evidenceLevel: "MODERATE",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "31482776",
			doi: "10.1177/2156587219874028",
			sampleSize: 50,
			duration: "8 weeks",
			dosage: "300mg twice daily",
			qualityScore: 7.5,
		},
	],

	// Metadata
	tags: [
		"adaptogen",
		"stress reduction",
		"anxiety",
		"cognitive enhancement",
		"sleep",
		"cortisol regulation",
		"ayurvedic",
	],
	lastUpdated: "2024-01-15T00:00:00Z",
	createdAt: "2024-01-15T00:00:00Z",

	// Additional fields for Prisma compatibility
	knowledgeNodeId: null,
};

export const ashwagandha = ashwagandhaProfile;
export default ashwagandhaProfile;
