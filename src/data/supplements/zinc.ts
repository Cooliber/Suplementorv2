/**
 * Zinc Supplement Profile
 * Essential mineral for immune function, testosterone production, and skin health
 * Comprehensive profile with Polish medical compliance
 */

import type { SupplementWithRelations } from "../../types/supplement";

export const zincProfile: SupplementWithRelations = {
	id: "zinc",
	name: "Zinc",
	polishName: "Cynk",
	scientificName: "Zinc",
	commonNames: [
		"Zinc gluconate",
		"Zinc citrate",
		"Zinc picolinate",
		"Zinc sulfate",
		"Zinc acetate",
	],
	polishCommonNames: [
		"Gluconian cynku",
		"Cytrynian cynku",
		"Pikolinian cynku",
		"Siarczan cynku",
		"Octan cynku",
	],
	category: "MINERAL",
	description:
		"Zinc is an essential trace mineral that serves as a cofactor for over 300 enzymes and plays critical roles in immune function, testosterone production, skin health, cognitive function, and antioxidant protection. It supports growth, development, and numerous physiological processes.",
	polishDescription:
		"Cynk to niezbędny pierwiastek śladowy, który służy jako kofaktor dla ponad 300 enzymów i odgrywa kluczowe role w funkcji odpornościowej, produkcji testosteronu, zdrowiu skóry, funkcji poznawczych i ochronie przeciwutleniającej. Wspiera wzrost, rozwój i liczne procesy fizjologiczne.",

	// Active compounds with detailed bioavailability data
	activeCompounds: [
		{
			name: "Zinc picolinate",
			polishName: "Pikolinian cynku",
			concentration: "50mg",
			bioavailability: 85,
			halfLife: "3-5 hours",
			metabolicPathway: [
				"Intestinal absorption",
				"Blood transport",
				"Cellular uptake",
			],
			targetReceptors: ["Zinc transporters", "Metalloenzymes"],
		},
		{
			name: "Zinc citrate",
			polishName: "Cytrynian cynku",
			concentration: "50mg",
			bioavailability: 80,
			halfLife: "3-5 hours",
			metabolicPathway: ["Organic acid transport", "Enhanced absorption"],
			targetReceptors: ["ZIP transporters", "Zinc-binding proteins"],
		},
		{
			name: "Elemental zinc",
			polishName: "Cynk pierwiastkowy",
			concentration: "15mg",
			bioavailability: 85,
			halfLife: "3-5 hours",
			metabolicPathway: ["Ion transport", "Protein binding"],
			targetReceptors: ["Zinc finger proteins", "Enzyme active sites"],
		},
	],

	// Clinical applications with Polish translations
	clinicalApplications: [
		{
			condition: "Immune system support",
			polishCondition: "Wsparcie układu odpornościowego",
			indication: "Common cold prevention and immune function enhancement",
			polishIndication:
				"Zapobieganie przeziębieniom i wzmacnianie funkcji odpornościowej",
			efficacy: "high",
			effectivenessRating: 8,
			evidenceLevel: "STRONG",
			recommendedDose: "15-30mg daily",
			duration: "During cold season or immune challenge",
			effectSize: 0.5,
			studyCount: 25,
			participantCount: 5000,
			recommendationGrade: "A",
		},
		{
			condition: "Testosterone production",
			polishCondition: "Produkcja testosteronu",
			indication: "Hormonal balance and reproductive health support",
			polishIndication:
				"Wsparcie równowagi hormonalnej i zdrowia reprodukcyjnego",
			efficacy: "moderate",
			effectivenessRating: 7,
			evidenceLevel: "MODERATE",
			recommendedDose: "25-50mg daily",
			duration: "8-12 weeks for hormonal effects",
			effectSize: 0.4,
			studyCount: 15,
			participantCount: 1000,
			recommendationGrade: "B",
		},
		{
			condition: "Skin health and wound healing",
			polishCondition: "Zdrowie skóry i gojenie ran",
			indication: "Acne treatment and skin repair support",
			polishIndication: "Leczenie trądziku i wsparcie naprawy skóry",
			efficacy: "moderate",
			effectivenessRating: 7,
			evidenceLevel: "MODERATE",
			recommendedDose: "30-50mg daily",
			duration: "8-12 weeks for skin effects",
			effectSize: 0.35,
			studyCount: 12,
			participantCount: 800,
			recommendationGrade: "B",
		},
		{
			condition: "Cognitive function",
			polishCondition: "Funkcja poznawcza",
			indication: "Memory and cognitive performance support",
			polishIndication: "Wsparcie pamięci i wydajności poznawczej",
			efficacy: "moderate",
			effectivenessRating: 6,
			evidenceLevel: "MODERATE",
			recommendedDose: "15-30mg daily",
			duration: "12-16 weeks for cognitive effects",
			effectSize: 0.3,
			studyCount: 10,
			participantCount: 600,
			recommendationGrade: "B",
		},
		{
			condition: "Antioxidant protection",
			polishCondition: "Ochrona przeciwutleniająca",
			indication: "Oxidative stress reduction and cellular protection",
			polishIndication: "Redukcja stresu oksydacyjnego i ochrona komórek",
			efficacy: "moderate",
			effectivenessRating: 6,
			evidenceLevel: "MODERATE",
			recommendedDose: "20-40mg daily",
			duration: "Ongoing for antioxidant effects",
			effectSize: 0.25,
			studyCount: 18,
			participantCount: 1500,
			recommendationGrade: "C",
		},
	],

	// Mechanisms of action with detailed pathways
	mechanisms: [
		{
			id: "immune-modulation",
			name: "Immune system modulation and defense",
			polishName: "Modulacja układu odpornościowego i obrona",
			pathway: "Immune cell function",
			polishPathway: "Funkcja komórek odpornościowych",
			description:
				"Zinc supports immune function through enhanced T-cell and natural killer cell activity, cytokine production, and antioxidant protection of immune cells.",
			polishDescription:
				"Cynk wspiera funkcję odpornościową poprzez zwiększoną aktywność limfocytów T i komórek NK, produkcję cytokin i ochronę przeciwutleniającą komórek odpornościowych.",
			evidenceLevel: "STRONG",
			targetSystems: ["Immune system", "T lymphocytes", "Natural killer cells"],
			timeToEffect: "24-48 hours",
			duration: "Ongoing supplementation",
		},
		{
			id: "testosterone-production",
			name: "Testosterone synthesis and hormonal balance",
			polishName: "Synteza testosteronu i równowaga hormonalna",
			pathway: "Steroid hormone biosynthesis",
			polishPathway: "Biosynteza hormonów steroidowych",
			description:
				"Zinc acts as a cofactor for enzymes involved in testosterone synthesis and supports reproductive hormone balance, particularly important for male fertility.",
			polishDescription:
				"Cynk działa jako kofaktor dla enzymów zaangażowanych w syntezę testosteronu i wspiera równowagę hormonów reprodukcyjnych, szczególnie ważny dla płodności męskiej.",
			evidenceLevel: "MODERATE",
			targetSystems: ["Reproductive system", "Endocrine system"],
			timeToEffect: "2-4 weeks",
			duration: "8-12 weeks for hormonal effects",
		},
		{
			id: "skin-health",
			name: "Skin health and wound healing support",
			polishName: "Zdrowie skóry i wsparcie gojenia ran",
			pathway: "Collagen synthesis and tissue repair",
			polishPathway: "Synteza kolagenu i naprawa tkanek",
			description:
				"Zinc supports collagen synthesis, keratin production, and tissue repair processes essential for skin health and wound healing.",
			polishDescription:
				"Cynk wspiera syntezę kolagenu, produkcję keratyny i procesy naprawy tkanek niezbędne dla zdrowia skóry i gojenia ran.",
			evidenceLevel: "MODERATE",
			targetSystems: ["Skin", "Connective tissue", "Epithelial cells"],
			timeToEffect: "1-2 weeks",
			duration: "4-8 weeks for tissue effects",
		},
		{
			id: "antioxidant-protection",
			name: "Antioxidant protection and enzyme function",
			polishName: "Ochrona przeciwutleniająca i funkcja enzymów",
			pathway: "Superoxide dismutase activity",
			polishPathway: "Aktywność dysmutazy ponadtlenkowej",
			description:
				"Zinc is a cofactor for superoxide dismutase (SOD), supporting antioxidant defense and protecting cells from oxidative damage.",
			polishDescription:
				"Cynk jest kofaktorem dla dysmutazy ponadtlenkowej (SOD), wspierając obronę przeciwutleniającą i chroniąc komórki przed uszkodzeniami oksydacyjnymi.",
			evidenceLevel: "STRONG",
			targetSystems: ["Antioxidant enzymes", "Cellular protection"],
			timeToEffect: "24-72 hours",
			duration: "Ongoing for antioxidant effects",
		},
	],

	// Comprehensive dosage guidelines
	dosageGuidelines: {
		therapeuticRange: {
			min: 15,
			max: 50,
			unit: "mg",
		},
		timing: ["morning", "with meals"],
		withFood: true,
		contraindications: [
			"Copper deficiency",
			"Hemochromatosis",
			"Wilson's disease",
		],
		polishContraindications: [
			"Niedobór miedzi",
			"Hemochromatoza",
			"Choroba Wilsona",
		],
		interactions: [
			{
				substance: "Copper supplements",
				polishSubstance: "Suplementy miedzi",
				type: "antagonistic",
				severity: "moderate",
				description: "Zinc may interfere with copper absorption",
				clinicalSignificance:
					"May lead to copper deficiency with long-term use",
				polishClinicalSignificance:
					"Może prowadzić do niedoboru miedzi przy długoterminowym stosowaniu",
				polishDescription: "Cynk może zakłócać wchłanianie miedzi",
				recommendation: "Monitor copper status or supplement together",
				polishRecommendation: "Monitoruj status miedzi lub suplementuj razem",
				evidenceLevel: "STRONG",
			},
			{
				substance: "Iron supplements",
				polishSubstance: "Suplementy żelaza",
				type: "antagonistic",
				severity: "minor",
				description: "May compete for absorption",
				clinicalSignificance: "May reduce absorption of both minerals",
				polishClinicalSignificance: "Może zmniejszyć wchłanianie obu minerałów",
				polishDescription: "Może konkurować o wchłanianie",
				recommendation: "Take at different times or 2 hours apart",
				polishRecommendation: "Przyjmuj w różnych porach lub 2 godziny odstępu",
				evidenceLevel: "MODERATE",
			},
			{
				substance: "Tetracycline antibiotics",
				polishSubstance: "Antybiotyki tetracyklinowe",
				type: "antagonistic",
				severity: "moderate",
				description: "Zinc may reduce antibiotic absorption",
				clinicalSignificance: "May decrease antibiotic effectiveness",
				polishClinicalSignificance: "Może zmniejszyć skuteczność antybiotyku",
				polishDescription: "Cynk może zmniejszyć wchłanianie antybiotyku",
				recommendation:
					"Take antibiotics 2 hours before or 4-6 hours after zinc",
				polishRecommendation:
					"Przyjmuj antybiotyki 2 godziny przed lub 4-6 godzin po cynku",
				evidenceLevel: "MODERATE",
			},
		],
	},

	// Side effects with frequency and management
	sideEffects: [
		{
			effect: "Nausea",
			polishEffect: "Nudności",
			frequency: "common",
			severity: "mild",
			reversible: true,
			dosageDependent: true,
			timeToOnset: "30-60 minutes",
			management: "Take with food, reduce dose",
			polishManagement: "Przyjmuj z jedzeniem, zmniejsz dawkę",
		},
		{
			effect: "Gastric irritation",
			polishEffect: "Podrażnienie żołądka",
			frequency: "uncommon",
			severity: "mild",
			reversible: true,
			dosageDependent: true,
			timeToOnset: "1-2 hours",
			management: "Take with meals, use chelated forms",
			polishManagement: "Przyjmuj z posiłkami, używaj form schelatowanych",
		},
		{
			effect: "Copper deficiency symptoms",
			polishEffect: "Objawy niedoboru miedzi",
			frequency: "rare",
			severity: "moderate",
			reversible: true,
			dosageDependent: false,
			timeToOnset: "Months of high-dose use",
			management: "Monitor copper levels, supplement copper if needed",
			polishManagement:
				"Monitoruj poziom miedzi, suplementuj miedź jeśli potrzeba",
		},
	],

	// Supplement interactions
	interactions: [
		{
			substance: "Vitamin A",
			polishSubstance: "Witamina A",
			type: "synergistic",
			severity: "beneficial",
			description: "Complementary roles in immune function and vision",
			polishDescription:
				"Komplementarne role w funkcji odpornościowej i wzroku",
			clinicalSignificance: "Enhanced immune and visual health benefits",
			polishClinicalSignificance: "Wzmocnione korzyści dla odporności i wzroku",
			mechanism: "Complementary nutrient interactions",
			polishMechanism: "Komplementarne interakcje składników odżywczych",
			recommendation: "Beneficial combination for immune support",
			polishRecommendation: "Korzystne połączenie dla wsparcia odporności",
			evidenceLevel: "MODERATE",
		},
		{
			substance: "Magnesium",
			polishSubstance: "Magnez",
			type: "synergistic",
			clinicalSignificance: "Enhanced absorption and enzyme function",
			polishClinicalSignificance: "Wzmocnione wchłanianie i funkcja enzymów",
			severity: "beneficial",
			mechanism: "Complementary mineral metabolism",
			polishMechanism: "Komplementarny metabolizm minerałów",
			description:
				"Zinc and magnesium support each other's absorption and enzyme functions",
			polishDescription:
				"Cynk i magnez wspierają wzajemne wchłanianie i funkcje enzymów",
			recommendation: "Often beneficial when supplemented together",
			polishRecommendation: "Często korzystne gdy suplementowane razem",
			evidenceLevel: "MODERATE",
		},
	],

	// Evidence level and research studies
	evidenceLevel: "STRONG",
	researchStudies: [
		{
			id: "singh-2013",
			title: "Zinc for the common cold",
			polishTitle: "Cynk na przeziębienie",
			authors: ["Singh M", "Das RR"],
			journal: "Cochrane Database of Systematic Reviews",
			year: 2013,
			studyType: "SYSTEMATIC_REVIEW",
			primaryOutcome: "Zinc supplementation for cold treatment and prevention",
			polishPrimaryOutcome:
				"Suplementacja cynku w leczeniu i zapobieganiu przeziębieniu",
			findings:
				"Zinc supplementation may reduce cold duration and severity when taken within 24 hours of symptom onset",
			polishFindings:
				"Suplementacja cynku może skrócić czas trwania i nasilenie przeziębienia gdy przyjmowana w ciągu 24 godzin od wystąpienia objawów",
			evidenceLevel: "MODERATE",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "23775705",
			doi: "10.1002/14651858.CD001364.pub4",
			qualityScore: 9.0,
		},
		{
			id: "prasad-2007",
			title: "Zinc supplementation in clinical medicine",
			polishTitle: "Suplementacja cynku w medycynie klinicznej",
			authors: ["Prasad AS"],
			journal: "Journal of Trace Elements in Medicine and Biology",
			year: 2007,
			studyType: "EXPERT_OPINION",
			primaryOutcome: "Clinical applications of zinc supplementation",
			polishPrimaryOutcome: "Zastosowania kliniczne suplementacji cynku",
			findings:
				"Zinc supplementation has beneficial effects on immune function, growth, and various clinical conditions",
			polishFindings:
				"Suplementacja cynku ma korzystne efekty na funkcję odpornościową, wzrost i różne stany kliniczne",
			evidenceLevel: "STRONG",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "17403558",
			doi: "10.1016/j.jtemb.2007.02.006",
			qualityScore: 8.5,
		},
		{
			id: "roest-1998",
			title: "The effect of zinc on common cold duration",
			polishTitle: "Wpływ cynku na czas trwania przeziębienia",
			authors: ["Roest RW", "van der Meer JW"],
			journal: "Annals of Internal Medicine",
			year: 1998,
			studyType: "META_ANALYSIS",
			primaryOutcome: "Zinc acetate lozenges for common cold treatment",
			polishPrimaryOutcome: "Pastylki octanu cynku w leczeniu przeziębienia",
			findings:
				"Zinc lozenges may reduce common cold duration when started early",
			polishFindings:
				"Pastylki cynku mogą skrócić czas trwania przeziębienia gdy zaczęte wcześnie",
			evidenceLevel: "MODERATE",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "9443270",
			doi: "10.7326/0003-4819-128-1-199801010-00011",
			qualityScore: 8.0,
		},
	],

	// Metadata
	tags: [
		"mineral",
		"essential mineral",
		"immune support",
		"testosterone",
		"skin health",
		"wound healing",
		"cognitive function",
		"antioxidant",
		"growth",
		"reproductive health",
	],
	lastUpdated: "2024-01-15T00:00:00Z",
	createdAt: "2024-01-15T00:00:00Z",

	// Additional fields for Prisma compatibility
	knowledgeNodeId: null,
};

export default zincProfile;
