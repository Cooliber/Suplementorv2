/**
 * Vitamin B12 (Cobalamin) Supplement Profile
 * Essential vitamin for neurological function, red blood cell formation, and DNA synthesis
 * Comprehensive profile with Polish medical compliance
 */

import type { SupplementWithRelations } from "../../types/supplement";

export const vitaminB12Profile: SupplementWithRelations = {
	id: "vitamin-b12",
	name: "Vitamin B12",
	polishName: "Witamina B12",
	scientificName: "Cobalamin",
	commonNames: [
		"Cobalamin",
		"Cyanocobalamin",
		"Methylcobalamin",
		"Hydroxocobalamin",
		"Adenosylcobalamin",
	],
	polishCommonNames: [
		"Kobalamina",
		"Cyjanokobalamina",
		"Metylokobalamina",
		"Hydroksokobalamina",
		"Adenozylokobalamina",
	],
	category: "VITAMIN",
	description:
		"Vitamin B12 is an essential water-soluble vitamin that plays crucial roles in red blood cell formation, neurological function, DNA synthesis, and homocysteine metabolism. It exists in several forms, with methylcobalamin and adenosylcobalamin being the active coenzyme forms.",
	polishDescription:
		"Witamina B12 to niezbędna witamina rozpuszczalna w wodzie, która odgrywa kluczowe role w tworzeniu czerwonych krwinek, funkcji neurologicznych, syntezie DNA i metabolizmie homocysteiny. Występuje w kilku formach, przy czym metylokobalamina i adenozylokobalamina są aktywnymi formami koenzymów.",

	// Active compounds with detailed bioavailability data
	activeCompounds: [
		{
			name: "Methylcobalamin",
			polishName: "Metylokobalamina",
			concentration: "1000mcg",
			bioavailability: 85,
			halfLife: "6-12 hours",
			metabolicPathway: ["Methionine synthase pathway", "Methylmalonyl-CoA mutase pathway"],
			targetReceptors: ["Methylcobalamin receptors", "Adenosylcobalamin receptors"],
		},
		{
			name: "Cyanocobalamin",
			polishName: "Cyjanokobalamina",
			concentration: "1000mcg",
			bioavailability: 70,
			halfLife: "24-48 hours",
			metabolicPathway: ["Conversion to active forms", "Methylation pathway"],
			targetReceptors: ["Cobalamin transporters"],
		},
	],

	// Clinical applications with Polish translations
	clinicalApplications: [
		{
			condition: "Vitamin B12 deficiency",
			polishCondition: "Niedobór witaminy B12",
			indication: "Treatment of deficiency states including pernicious anemia",
			polishIndication: "Leczenie stanów niedoboru, w tym niedokrwistości złośliwej",
			efficacy: "high",
			effectivenessRating: 9,
			evidenceLevel: "STRONG",
			recommendedDose: "1000-2000mcg daily",
			duration: "4-8 weeks for initial treatment",
			effectSize: 0.8,
			studyCount: 50,
			participantCount: 5000,
			recommendationGrade: "A",
		},
		{
			condition: "Neurological disorders",
			polishCondition: "Zaburzenia neurologiczne",
			indication: "Peripheral neuropathy and cognitive function support",
			polishIndication: "Wsparcie neuropatii obwodowej i funkcji poznawczych",
			efficacy: "moderate",
			effectivenessRating: 7,
			evidenceLevel: "MODERATE",
			recommendedDose: "1000-5000mcg daily",
			duration: "3-6 months",
			effectSize: 0.4,
			studyCount: 25,
			participantCount: 2000,
			recommendationGrade: "B",
		},
		{
			condition: "Homocysteine management",
			polishCondition: "Regulacja homocysteiny",
			indication: "Cardiovascular health and methylation support",
			polishIndication: "Zdrowie sercowo-naczyniowe i wsparcie metylacji",
			efficacy: "moderate",
			effectivenessRating: 7,
			evidenceLevel: "MODERATE",
			recommendedDose: "500-1000mcg daily",
			duration: "Ongoing supplementation",
			effectSize: 0.3,
			studyCount: 30,
			participantCount: 3000,
			recommendationGrade: "B",
		},
		{
			condition: "Energy metabolism",
			polishCondition: "Metabolizm energetyczny",
			indication: "Fatigue and energy production support",
			polishIndication: "Wsparcie przy zmęczeniu i produkcji energii",
			efficacy: "moderate",
			effectivenessRating: 6,
			evidenceLevel: "MODERATE",
			recommendedDose: "500-2000mcg daily",
			duration: "2-4 weeks for effects",
			effectSize: 0.25,
			studyCount: 15,
			participantCount: 1200,
			recommendationGrade: "C",
		},
	],

	// Mechanisms of action with detailed pathways
	mechanisms: [
		{
			id: "dna-synthesis",
			name: "DNA synthesis and cell division",
			polishName: "Synteza DNA i podział komórek",
			pathway: "Nucleotide metabolism",
			polishPathway: "Metabolizm nukleotydów",
			description:
				"Vitamin B12 is essential for DNA synthesis through its role in thymidine production. It acts as a cofactor for methionine synthase, converting homocysteine to methionine, which is required for DNA methylation and synthesis.",
			polishDescription:
				"Witamina B12 jest niezbędna do syntezy DNA poprzez swoją rolę w produkcji tymidyny. Działa jako kofaktor dla syntazy metioniny, przekształcając homocysteinę w metioninę, która jest wymagana do metylacji i syntezy DNA.",
			evidenceLevel: "STRONG",
			targetSystems: ["Hematopoietic system", "Nervous system", "DNA synthesis"],
			timeToEffect: "2-4 weeks",
			duration: "Ongoing for cellular processes",
		},
		{
			id: "neurological-function",
			name: "Neurological function support",
			polishName: "Wsparcie funkcji neurologicznych",
			pathway: "Myelin synthesis",
			polishPathway: "Synteza mieliny",
			description:
				"Vitamin B12 supports myelin sheath formation and maintenance through its role in fatty acid metabolism. It contributes to nerve signal transmission and neurological health.",
			polishDescription:
				"Witamina B12 wspiera tworzenie i utrzymanie osłonek mielinowych poprzez swoją rolę w metabolizmie kwasów tłuszczowych. Przyczynia się do transmisji sygnałów nerwowych i zdrowia neurologicznego.",
			evidenceLevel: "STRONG",
			targetSystems: ["Central nervous system", "Peripheral nervous system"],
			timeToEffect: "4-8 weeks",
			duration: "Chronic supplementation required",
		},
		{
			id: "homocysteine-metabolism",
			name: "Homocysteine metabolism regulation",
			polishName: "Regulacja metabolizmu homocysteiny",
			pathway: "Methylation cycle",
			polishPathway: "Cykl metylacji",
			description:
				"Vitamin B12 acts as a cofactor for methionine synthase in the conversion of homocysteine to methionine, supporting cardiovascular health and reducing homocysteine levels.",
			polishDescription:
				"Witamina B12 działa jako kofaktor dla syntazy metioniny w przekształcaniu homocysteiny w metioninę, wspierając zdrowie sercowo-naczyniowe i obniżając poziom homocysteiny.",
			evidenceLevel: "STRONG",
			targetSystems: ["Cardiovascular system", "Methylation pathways"],
			timeToEffect: "1-2 weeks",
			duration: "Ongoing supplementation",
		},
	],

	// Comprehensive dosage guidelines
	dosageGuidelines: {
		therapeuticRange: {
			min: 500,
			max: 5000,
			unit: "mcg",
		},
		timing: ["morning", "with meals"],
		withFood: true,
		contraindications: [
			"Leber's hereditary optic neuropathy",
			"Hypersensitivity to cobalamin",
			"Cobalt allergy",
		],
		polishContraindications: [
			"Dziedziczna neuropatia nerwu wzrokowego Lebera",
			"Nadwrażliwość na kobalaminę",
			"Alergia na kobalt",
		],
		interactions: [
			{
				substance: "Chloramphenicol",
				polishSubstance: "Chloramfenikol",
				type: "antagonistic",
				severity: "moderate",
				description: "May interfere with B12 absorption and efficacy",
				clinicalSignificance: "May reduce B12 effectiveness; monitor closely",
				polishClinicalSignificance:
					"Może zmniejszyć skuteczność B12; monitoruj uważnie",
				polishDescription:
					"Może zakłócać wchłanianie i skuteczność B12",
				recommendation: "Avoid concurrent use or monitor B12 levels",
				polishRecommendation: "Unikaj jednoczesnego stosowania lub monitoruj poziom B12",
				evidenceLevel: "MODERATE",
			},
			{
				substance: "Proton pump inhibitors",
				polishSubstance: "Inhibitory pompy protonowej",
				type: "antagonistic",
				severity: "minor",
				description: "Long-term use may reduce B12 absorption",
				clinicalSignificance: "May lead to deficiency with chronic use",
				polishClinicalSignificance:
					"Może prowadzić do niedoboru przy chronicznym stosowaniu",
				polishDescription:
					"Długoterminowe stosowanie może zmniejszyć wchłanianie B12",
				recommendation: "Monitor B12 status with long-term PPI use",
				polishRecommendation: "Monitoruj status B12 przy długoterminowym stosowaniu IPP",
				evidenceLevel: "MODERATE",
			},
		],
	},

	// Side effects with frequency and management
	sideEffects: [
		{
			effect: "Mild diarrhea",
			polishEffect: "Łagodna biegunka",
			frequency: "rare",
			severity: "mild",
			reversible: true,
			dosageDependent: false,
			timeToOnset: "1-3 days",
			management: "Usually resolves spontaneously",
			polishManagement: "Zazwyczaj ustępuje samoistnie",
		},
		{
			effect: "Skin rash",
			polishEffect: "Wysypka skórna",
			frequency: "very_rare",
			severity: "mild",
			reversible: true,
			dosageDependent: false,
			timeToOnset: "1-7 days",
			management: "Discontinue use if persistent",
			polishManagement: "Przerwij stosowanie jeśli utrzymuje się",
		},
		{
			effect: "Itching",
			polishEffect: "Świąd",
			frequency: "very_rare",
			severity: "mild",
			reversible: true,
			dosageDependent: false,
			timeToOnset: "1-5 days",
			management: "Usually mild and transient",
			polishManagement: "Zazwyczaj łagodny i przemijający",
		},
	],

	// Supplement interactions
	interactions: [
		{
			substance: "Folic acid",
			polishSubstance: "Kwas foliowy",
			type: "synergistic",
			severity: "beneficial",
			description: "Complementary action in methylation and DNA synthesis",
			polishDescription: "Komplementarne działanie w metylacji i syntezie DNA",
			clinicalSignificance: "Enhanced therapeutic effects",
			polishClinicalSignificance: "Wzmocnione efekty terapeutyczne",
			mechanism: "Complementary roles in one-carbon metabolism",
			polishMechanism: "Komplementarne role w metabolizmie jednowęglowym",
			recommendation: "Often supplemented together for optimal methylation",
			polishRecommendation:
				"Często suplementowane razem dla optymalnej metylacji",
			evidenceLevel: "STRONG",
		},
		{
			substance: "Vitamin B6",
			polishSubstance: "Witamina B6",
			type: "synergistic",
			clinicalSignificance: "Enhanced homocysteine metabolism",
			polishClinicalSignificance: "Wzmocniony metabolizm homocysteiny",
			severity: "beneficial",
			mechanism: "Complementary roles in amino acid metabolism",
			polishMechanism: "Komplementarne role w metabolizmie aminokwasów",
			description:
				"B6 and B12 work together in homocysteine metabolism and neurotransmitter synthesis",
			polishDescription:
				"B6 i B12 współpracują w metabolizmie homocysteiny i syntezie neurotransmiterów",
			recommendation: "Beneficial combination for cardiovascular health",
			polishRecommendation:
				"Korzystne połączenie dla zdrowia sercowo-naczyniowego",
			evidenceLevel: "MODERATE",
		},
	],

	// Evidence level and research studies
	evidenceLevel: "STRONG",
	researchStudies: [
		{
			id: "smith-2010",
			title: "Vitamin B12 deficiency: an update",
			polishTitle: "Niedobór witaminy B12: aktualizacja",
			authors: ["Smith AD", "Refsum H"],
			journal: "Advances in Clinical Chemistry",
			year: 2010,
			studyType: "SYSTEMATIC_REVIEW",
			primaryOutcome: "Clinical manifestations and treatment of B12 deficiency",
			polishPrimaryOutcome: "Objawy kliniczne i leczenie niedoboru B12",
			findings:
				"Comprehensive review of B12 deficiency states, neurological manifestations, and treatment approaches",
			polishFindings:
				"Kompleksowy przegląd stanów niedoboru B12, objawów neurologicznych i podejść terapeutycznych",
			evidenceLevel: "STRONG",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "21275367",
			doi: "10.1016/S0065-2423(10)51003-2",
			qualityScore: 9.0,
		},
		{
			id: "stabler-2013",
			title: "Vitamin B12 deficiency",
			polishTitle: "Niedobór witaminy B12",
			authors: ["Stabler SP"],
			journal: "New England Journal of Medicine",
			year: 2013,
			studyType: "EXPERT_OPINION",
			primaryOutcome: "Clinical presentation and diagnosis of B12 deficiency",
			polishPrimaryOutcome: "Prezentacja kliniczna i diagnostyka niedoboru B12",
			findings:
				"Essential reference for understanding B12 deficiency diagnosis and management",
			polishFindings:
				"Niezbędne źródło do zrozumienia diagnostyki i leczenia niedoboru B12",
			evidenceLevel: "STRONG",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "23480045",
			doi: "10.1056/NEJMcp1113996",
			qualityScore: 9.5,
		},
		{
			id: "moore-2014",
			title: "Cognitive impairment and vitamin B12: a review",
			polishTitle: "Zaburzenia poznawcze a witamina B12: przegląd",
			authors: ["Moore E", "Mander A", "Ames D"],
			journal: "International Psychogeriatrics",
			year: 2014,
			studyType: "SYSTEMATIC_REVIEW",
			primaryOutcome: "B12 supplementation effects on cognitive function",
			polishPrimaryOutcome: "Efekty suplementacji B12 na funkcje poznawcze",
			findings:
				"B12 supplementation may benefit cognitive function in deficient individuals",
			polishFindings:
				"Suplementacja B12 może korzystnie wpływać na funkcje poznawcze u osób z niedoborem",
			evidenceLevel: "MODERATE",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "24524667",
			doi: "10.1017/S1041610213002364",
			qualityScore: 8.0,
		},
	],

	// Metadata
	tags: [
		"vitamin",
		"essential nutrient",
		"neurological health",
		"energy metabolism",
		"methylation",
		"cardiovascular health",
		"homocysteine",
		"DNA synthesis",
		"red blood cells",
		"cognitive function",
	],
	lastUpdated: "2024-01-15T00:00:00Z",
	createdAt: "2024-01-15T00:00:00Z",

	// Additional fields for Prisma compatibility
	knowledgeNodeId: null,
};

export default vitaminB12Profile;