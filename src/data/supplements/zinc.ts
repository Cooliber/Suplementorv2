/**
 * Zinc Supplement Profile
 * Migrated from nextjs-roocode-template with enhanced T3 Stack compatibility
 * Essential Mineral for Brain Function with comprehensive Polish medical compliance
 */

import type { SupplementWithRelations } from "../../types/supplement";

export const zincProfile: SupplementWithRelations = {
	id: "zinc",
	name: "Zinc",
	polishName: "Cynk",
	scientificName: "Zinc",
	commonNames: [
		"Zinc Gluconate",
		"Zinc Picolinate",
		"Zinc Citrate",
		"Zinc Sulfate",
	],
	polishCommonNames: [
		"Cynk Glukonian",
		"Cynk Pikolinyan",
		"Cytrynian cynku",
		"Siarczan cynku",
	],
	category: "MINERAL",
	description:
		"Zinc is an essential trace mineral critical for brain function, immune system support, and numerous enzymatic processes. It serves as a cofactor for over 300 enzymes and plays crucial roles in neurotransmitter function, DNA synthesis, immune cell function, and wound healing. Zinc is particularly important for cognitive function and mental health.",
	polishDescription:
		"Cynk to niezbędny mikroelement mineralny kluczowy dla funkcji mózgu, wsparcia układu odpornościowego i licznych procesów enzymatycznych. Pełni rolę kofaktora dla ponad 300 enzymów i odgrywa kluczowe role w funkcji neuroprzekaźników, syntezie DNA, funkcji komórek odpornościowych i gojeniu ran. Cynk jest szczególnie ważny dla funkcji poznawczych i zdrowia psychicznego.",

	// Active compounds with detailed bioavailability data
	activeCompounds: [
		{
			name: "Zinc",
			polishName: "Cynk",
			concentration: "15mg",
			bioavailability: 40,
			halfLife: "60-70 days",
			metabolicPathway: [
				"Enzyme cofactors",
				"Immune function",
				"Neurotransmitter synthesis",
			],
			targetReceptors: [
				"Zinc transporters",
				"Enzyme active sites",
				"Neurotransmitter receptors",
			],
		},
	],

	// Clinical applications with Polish translations
	clinicalApplications: [
		{
			condition: "Immune function",
			polishCondition: "Funkcja immunologiczna",
			indication:
				"Support for immune system, reduction in cold duration and severity",
			polishIndication:
				"Wsparcie dla układu odpornościowego, redukcja czasu trwania i nasilenia przeziębienia",
			efficacy: "high",
			effectivenessRating: 8,
			evidenceLevel: "STRONG",
			recommendedDose: "15-30mg daily",
			duration: "Months",
			effectSize: 0.6,
			studyCount: 15,
			participantCount: 1800,
			recommendationGrade: "A",
		},
		{
			condition: "Cognitive function",
			polishCondition: "Funkcje poznawcze",
			indication: "Support for memory, attention, and cognitive performance",
			polishIndication: "Wsparcie dla pamięci, uwagi i wydajności poznawczej",
			efficacy: "low",
			effectivenessRating: 4,
			evidenceLevel: "WEAK",
			recommendedDose: "15mg daily",
			duration: "8-12 weeks",
			effectSize: 0.2,
			studyCount: 4,
			participantCount: 300,
			recommendationGrade: "C",
		},
		{
			condition: "Wound healing",
			polishCondition: "Gojenie ran",
			indication: "Enhanced wound healing and tissue repair",
			polishIndication: "Wzmożone gojenie ran i regeneracja tkanek",
			efficacy: "high",
			effectivenessRating: 8,
			evidenceLevel: "STRONG",
			recommendedDose: "30mg daily",
			duration: "2-4 weeks",
			effectSize: 0.55,
			studyCount: 8,
			participantCount: 600,
			recommendationGrade: "A",
		},
		{
			condition: "Acne and skin health",
			polishCondition: "Trądzik i zdrowie skóry",
			indication:
				"Reduction in inflammatory acne and skin condition improvement",
			polishIndication: "Redukcja trądziku zapalnego i poprawa stanu skóry",
			efficacy: "moderate",
			effectivenessRating: 6,
			evidenceLevel: "MODERATE",
			recommendedDose: "30mg daily",
			duration: "3-6 months",
			effectSize: 0.35,
			studyCount: 6,
			participantCount: 450,
			recommendationGrade: "B",
		},
		{
			condition: "Taste and smell disorders",
			polishCondition: "Zaburzenia smaku i węchu",
			indication: "Support for taste and smell function restoration",
			polishIndication: "Wsparcie dla przywrócenia funkcji smaku i węchu",
			efficacy: "high",
			effectivenessRating: 6,
			evidenceLevel: "MODERATE",
			recommendedDose: "30-45mg daily",
			duration: "4-8 weeks",
			effectSize: 0.5,
			studyCount: 5,
			participantCount: 350,
			recommendationGrade: "B",
		},
	],

	// Mechanisms of action with detailed pathways
	mechanisms: [
		{
			id: "neurotransmitter-function",
			name: "Neurotransmitter function",
			polishName: "Funkcja neuroprzekaźników",
			pathway: "Neurotransmitter function",
			polishPathway: "Neurotransmitter function",
			description:
				"Essential for neurotransmitter synthesis and receptor function. Zinc modulates NMDA and GABA receptors, affecting cognitive function and mood regulation.",
			polishDescription:
				"Niezbędny dla syntezy neuroprzekaźników i funkcji receptorów. Cynk moduluje receptory NMDA i GABA, wpływając na funkcję poznawczą i regulację nastroju.",
			evidenceLevel: "STRONG",
			targetSystems: [
				"Neurotransmitter systems",
				"Cognitive function",
				"Mood regulation",
			],
			timeToEffect: "Days to weeks",
			duration: "Continuous neurotransmitter support",
		},
		{
			id: "immune-system-support",
			name: "Immune system support",
			polishName: "Wsparcie układu odpornościowego",
			pathway: "Immune system support",
			polishPathway: "Immune system support",
			description:
				"Supports immune cell function and reduces inflammation. Zinc is essential for T-cell function, natural killer cell activity, and antibody production.",
			polishDescription:
				"Wsparcie dla funkcji komórek odpornościowych i redukcja zapalenia. Cynk jest niezbędny dla funkcji limfocytów T, komórek NK i produkcji przeciwciał.",
			evidenceLevel: "STRONG",
			targetSystems: [
				"T-cell function",
				"NK cell activity",
				"Antibody production",
			],
			timeToEffect: "Days to weeks",
			duration: "Continuous immune support",
		},
		{
			id: "antioxidant-defense",
			name: "Antioxidant defense",
			polishName: "Obrona antyoksydacyjna",
			pathway: "Antioxidant defense",
			polishPathway: "Antioxidant defense",
			description:
				"Component of superoxide dismutase, protecting against oxidative stress. Zinc provides essential antioxidant protection throughout the body.",
			polishDescription:
				"Składnik dysmutazy ponadtlenkowej, chroniącej przed stresem oksydacyjnym. Cynk zapewnia istotną ochronę antyoksydacyjną w całym organizmie.",
			evidenceLevel: "STRONG",
			targetSystems: [
				"Antioxidant system",
				"Oxidative stress",
				"Cellular protection",
			],
			timeToEffect: "Days to weeks",
			duration: "Continuous antioxidant protection",
		},
		{
			id: "enzyme-cofactor",
			name: "Enzyme cofactor function",
			polishName: "Funkcja kofaktora enzymatycznego",
			pathway: "Enzyme cofactor function",
			polishPathway: "Enzyme cofactor function",
			description:
				"Serves as a cofactor for over 300 enzymes involved in metabolism, DNA synthesis, and cellular processes. Critical for numerous biochemical reactions.",
			polishDescription:
				"Pełni rolę kofaktora dla ponad 300 enzymów zaangażowanych w metabolizm, syntezę DNA i procesy komórkowe. Krytyczny dla licznych reakcji biochemicznych.",
			evidenceLevel: "STRONG",
			targetSystems: [
				"Metabolic enzymes",
				"DNA synthesis",
				"Cellular processes",
			],
			timeToEffect: "Days to weeks",
			duration: "Continuous enzymatic support",
		},
	],

	// Comprehensive dosage guidelines
	dosageGuidelines: {
		therapeuticRange: {
			min: 15,
			max: 30,
			unit: "mg",
		},
		timing: ["morning"],
		withFood: true,
		contraindications: [
			"Copper deficiency",
			"Iron deficiency (high zinc doses)",
		],
		polishContraindications: [
			"Niedobór miedzi",
			"Niedobór żelaza (wysokie dawki cynku)",
		],
		interactions: [
			{
				substance: "Antibiotics (tetracycline)",
				polishSubstance: "Antybiotyki (tetracyklina)",
				type: "antagonistic",
				severity: "moderate",
				description: "Interaction between supplements",
				polishDescription: "Interakcja między suplementami",
				clinicalSignificance: "Monitor for effects",
				polishClinicalSignificance: "Monitorować efekty",
				mechanism: "Reduced antibiotic absorption",
				polishMechanism: "Zmniejszone wchłanianie antybiotyku",
				recommendation: "Take antibiotics 2 hours before or 4 hours after zinc",
				polishRecommendation:
					"Przyjmuj antybiotyki 2 godziny przed lub 4 godziny po cynku",
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
			management: "Take with food, reduce dose if needed",
			polishManagement: "Przyjmuj z jedzeniem, zmniejsz dawkę jeśli potrzeba",
		},
		{
			effect: "Metallic taste",
			polishEffect: "Metaliczny smak",
			frequency: "common",
			severity: "mild",
			reversible: true,
			dosageDependent: true,
			timeToOnset: "Minutes",
			management: "Take with food or switch to different zinc form",
			polishManagement: "Przyjmuj z jedzeniem lub przejdź na inną formę cynku",
		},
		{
			effect: "Stomach upset",
			polishEffect: "Niewygodę żołądka",
			frequency: "uncommon",
			severity: "mild",
			reversible: true,
			dosageDependent: true,
			timeToOnset: "30-60 minutes",
			management: "Take with food, reduce dose if needed",
			polishManagement: "Przyjmuj z jedzeniem, zmniejsz dawkę jeśli potrzeba",
		},
		{
			effect: "Copper deficiency (with high doses)",
			polishEffect: "Niedobór miedzi (z wysokimi dawkami)",
			frequency: "rare",
			severity: "moderate",
			reversible: true,
			dosageDependent: true,
			timeToOnset: "Months",
			management: "Ensure adequate copper intake, reduce zinc dose",
			polishManagement:
				"Zapewnij odpowiednie spożycie miedzi, zmniejsz dawkę cynku",
		},
	],

	// Supplement interactions
	interactions: [
		{
			substance: "Antibiotics (tetracycline)",
			polishSubstance: "Antybiotyki (tetracyklina)",
			type: "antagonistic",
			severity: "moderate",
			description: "Interaction between supplements",
			polishDescription: "Interakcja między suplementami",
			clinicalSignificance: "Monitor for effects",
			polishClinicalSignificance: "Monitorować efekty",
			mechanism: "Reduced antibiotic absorption through chelation",
			polishMechanism: "Zmniejszone wchłanianie antybiotyku poprzez chelację",
			recommendation: "Take antibiotics 2 hours before or 4 hours after zinc",
			polishRecommendation:
				"Przyjmuj antybiotyki 2 godziny przed lub 4 godziny po cynku",
			evidenceLevel: "MODERATE",
		},
		{
			substance: "Thyroid medications",
			polishSubstance: "Leki tarczycowe",
			type: "antagonistic",
			clinicalSignificance: "Moderate clinical significance - monitor closely",
			polishClinicalSignificance:
				"Umiarkowane znaczenie kliniczne - ścisłe monitorowanie",
			severity: "moderate",
			mechanism: "Reduced medication absorption",
			polishMechanism: "Zmniejszone wchłanianie leku",
			description: "May reduce thyroid medication effectiveness",
			polishDescription: "Może zmniejszyć skuteczność leku tarczycowego",
			recommendation: "Take 4 hours apart from thyroid medications",
			polishRecommendation:
				"Przyjmuj z 4-godzinnym przerwaniem od leków tarczycowych",
			evidenceLevel: "MODERATE",
		},
		{
			substance: "Copper supplements",
			polishSubstance: "Suplementy miedzi",
			type: "antagonistic",
			clinicalSignificance:
				"Minor clinical significance - generally safe with monitoring",
			polishClinicalSignificance:
				"Niewielkie znaczenie kliniczne - ogólnie bezpieczne z monitorowaniem",
			severity: "minor",
			mechanism: "Competitive mineral effects",
			polishMechanism: "Konkurencyjne efekty mineralne",
			description: "May reduce effectiveness of both minerals",
			polishDescription: "Może zmniejszyć skuteczność obu minerałów",
			recommendation: "Ensure proper balance between zinc and copper intake",
			polishRecommendation:
				"Zapewnij odpowiednią równowagę między spożyciem cynku i miedzi",
			evidenceLevel: "WEAK",
		},
	],

	// Evidence level and research studies
	evidenceLevel: "STRONG",
	researchStudies: [
		{
			id: "petrilli-2017",
			title: "Zinc supplementation for mental health: a systematic review",
			polishTitle:
				"Suplementacja cynkiem na zdrowie psychiczne: przegląd systematyczny",
			authors: ["Petrilli MA", "Kranz TM", "Kleinhaus K"],
			journal: "Nutrients",
			year: 2017,
			studyType: "SYSTEMATIC_REVIEW",
			primaryOutcome: "Mental health",
			polishPrimaryOutcome: "Zdrowie psychiczne",
			findings: "Zinc supplementation may benefit mental health conditions",
			polishFindings:
				"Suplementacja cynkiem może korzystnie wpływać na stany zdrowia psychicznego",
			evidenceLevel: "MODERATE",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "28608815",
			doi: "10.3390/nu9050516",
			sampleSize: 0,
			qualityScore: 7.5,
		},
		{
			id: "rodriguez-2009",
			title: "Therapeutic applications of zinc in the treatment of diabetes",
			polishTitle: "Zastosowania terapeutyczne cynku w leczeniu cukrzycy",
			authors: ["Rodriguez M", "Gibson GE", "Buxbaum JD"],
			journal: "Drug Design, Development and Therapy",
			year: 2009,
			studyType: "SYSTEMATIC_REVIEW",
			primaryOutcome: "Diabetes management",
			polishPrimaryOutcome: "Zarządzanie cukrzycą",
			findings:
				"Zinc has beneficial effects on glucose metabolism and insulin function",
			polishFindings:
				"Cynk ma korzystne efekty na metabolizm glukozy i funkcję insuliny",
			evidenceLevel: "MODERATE",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "19707192",
			sampleSize: 0,
			qualityScore: 7.0,
		},
		{
			id: "haase-2007",
			title: "The role of zinc in neurodegeneration",
			polishTitle: "Rola cynku w neurodegeneracji",
			authors: ["Haase H", "Maret W"],
			journal: "Neuroscience",
			year: 2007,
			studyType: "SYSTEMATIC_REVIEW",
			primaryOutcome: "Neurodegeneration",
			polishPrimaryOutcome: "Neurodegeneracja",
			findings: "Zinc plays complex roles in neurodegenerative processes",
			polishFindings:
				"Cynk odgrywa złożone role w procesach neurodegeneracyjnych",
			evidenceLevel: "MODERATE",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "17959346",
			doi: "10.1016/j.neuroscience.2007.08.032",
			sampleSize: 0,
			qualityScore: 6.5,
		},
		{
			id: "singh-2011",
			title:
				"Zinc supplementation and children's growth: a systematic review and meta-analysis",
			polishTitle:
				"Suplementacja cynkiem i wzrost dzieci: przegląd systematyczny i analiza meta",
			authors: ["Singh M", "Das RR"],
			journal: "International Journal of Food Sciences and Nutrition",
			year: 2011,
			studyType: "META_ANALYSIS",
			primaryOutcome: "Growth outcomes",
			polishPrimaryOutcome: "Wyniki wzrostu",
			findings: "Zinc supplementation improves linear growth in children",
			polishFindings: "Suplementacja cynkiem poprawia liniowy wzrost u dzieci",
			evidenceLevel: "STRONG",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "22111444",
			doi: "10.3109/09637486.2011.622877",
			sampleSize: 0,
			qualityScore: 8.0,
		},
	],

	// Metadata
	tags: [
		"mineral",
		"immune system",
		"brain function",
		"antioxidant",
		"wound healing",
		"enzyme cofactor",
		"neurotransmitter",
	],
	lastUpdated: "2024-01-15T00:00:00Z",
	createdAt: "2024-01-15T00:00:00Z",

	// Additional fields for Prisma compatibility
	knowledgeNodeId: null,
};

export default zincProfile;
