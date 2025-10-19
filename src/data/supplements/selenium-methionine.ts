/**
 * Selenium Methionine Supplement Profile
 * Essential trace mineral for antioxidant protection, thyroid function, and immune support
 * Comprehensive profile with Polish medical compliance
 */

import type { SupplementWithRelations } from "../../types/supplement";

export const seleniumMethionineProfile: SupplementWithRelations = {
	id: "selenium-methionine",
	name: "Selenium Methionine",
	polishName: "Selenometionina",
	scientificName: "L-selenomethionine",
	commonNames: [
		"Selenium methionine",
		"L-selenomethionine",
		"Organic selenium",
		"Selenomethionine",
		"Yeast selenium",
	],
	polishCommonNames: [
		"Selenometionina",
		"L-selenometionina",
		"Selen organiczny",
		"Selenometionina",
		"Selen z drożdży",
	],
	category: "MINERAL",
	description:
		"Selenium methionine is a highly bioavailable organic form of selenium that serves as a cofactor for glutathione peroxidase and supports thyroid function, antioxidant protection, immune health, and reproductive function. It offers superior absorption and retention compared to inorganic selenium forms.",
	polishDescription:
		"Selenometionina to wysoce biodostępna organiczna forma selenu, która służy jako kofaktor dla peroksydazy glutationowej i wspiera funkcję tarczycy, ochronę przeciwutleniającą, zdrowie odpornościowe i funkcję reprodukcyjną. Oferuje lepsze wchłanianie i retencję w porównaniu z nieorganicznymi formami selenu.",

	// Active compounds with detailed bioavailability data
	activeCompounds: [
		{
			name: "L-selenomethionine",
			polishName: "L-selenometionina",
			concentration: "200mcg",
			bioavailability: 95,
			halfLife: "24-48 hours",
			metabolicPathway: [
				"Amino acid metabolism",
				"Selenoprotein synthesis",
				"Glutathione peroxidase pathway",
			],
			targetReceptors: [
				"Selenocysteine insertion machinery",
				"Thyroid hormone receptors",
			],
		},
		{
			name: "Elemental selenium",
			polishName: "Selen pierwiastkowy",
			concentration: "90mcg",
			bioavailability: 98,
			halfLife: "24-48 hours",
			metabolicPathway: [
				"Selenide formation",
				"Selenophosphate synthesis",
				"Selenoprotein incorporation",
			],
			targetReceptors: ["Selenoprotein P receptors", "Glutathione peroxidase"],
		},
	],

	// Clinical applications with Polish translations
	clinicalApplications: [
		{
			condition: "Antioxidant protection",
			polishCondition: "Ochrona przeciwutleniająca",
			indication: "Oxidative stress reduction and cellular protection",
			polishIndication: "Redukcja stresu oksydacyjnego i ochrona komórek",
			efficacy: "high",
			effectivenessRating: 8,
			evidenceLevel: "STRONG",
			recommendedDose: "100-200mcg daily",
			duration: "Ongoing supplementation",
			effectSize: 0.5,
			studyCount: 30,
			participantCount: 5000,
			recommendationGrade: "A",
		},
		{
			condition: "Thyroid function support",
			polishCondition: "Wsparcie funkcji tarczycy",
			indication: "Thyroid hormone metabolism and autoimmune thyroiditis",
			polishIndication:
				"Metabolizm hormonów tarczycy i autoimmunologiczne zapalenie tarczycy",
			efficacy: "moderate",
			effectivenessRating: 7,
			evidenceLevel: "MODERATE",
			recommendedDose: "100-200mcg daily",
			duration: "3-6 months for thyroid effects",
			effectSize: 0.4,
			studyCount: 20,
			participantCount: 3000,
			recommendationGrade: "B",
		},
		{
			condition: "Immune system enhancement",
			polishCondition: "Wzmocnienie układu odpornościowego",
			indication: "Immune function and infection resistance",
			polishIndication: "Funkcja odpornościowa i odporność na infekcje",
			efficacy: "moderate",
			effectivenessRating: 7,
			evidenceLevel: "MODERATE",
			recommendedDose: "100-200mcg daily",
			duration: "Ongoing for immune support",
			effectSize: 0.35,
			studyCount: 25,
			participantCount: 4000,
			recommendationGrade: "B",
		},
		{
			condition: "Reproductive health",
			polishCondition: "Zdrowie reprodukcyjne",
			indication: "Male fertility and sperm quality support",
			polishIndication: "Wsparcie płodności męskiej i jakości nasienia",
			efficacy: "moderate",
			effectivenessRating: 6,
			evidenceLevel: "MODERATE",
			recommendedDose: "100-200mcg daily",
			duration: "3-6 months for reproductive effects",
			effectSize: 0.3,
			studyCount: 15,
			participantCount: 2000,
			recommendationGrade: "B",
		},
		{
			condition: "Cardiovascular protection",
			polishCondition: "Ochrona sercowo-naczyniowa",
			indication: "Heart health and lipid metabolism",
			polishIndication: "Zdrowie serca i metabolizm lipidów",
			efficacy: "moderate",
			effectivenessRating: 6,
			evidenceLevel: "MODERATE",
			recommendedDose: "100-200mcg daily",
			duration: "6-12 months for cardiovascular effects",
			effectSize: 0.25,
			studyCount: 20,
			participantCount: 3500,
			recommendationGrade: "C",
		},
	],

	// Mechanisms of action with detailed pathways
	mechanisms: [
		{
			id: "antioxidant-defense",
			name: "Antioxidant defense and glutathione peroxidase activity",
			polishName:
				"Obrona przeciwutleniająca i aktywność peroksydazy glutationowej",
			pathway: "Selenoprotein synthesis",
			polishPathway: "Synteza selenoprotein",
			description:
				"Selenium is essential for glutathione peroxidase activity, protecting cells from oxidative damage and supporting the body's antioxidant defense system.",
			polishDescription:
				"Selen jest niezbędny dla aktywności peroksydazy glutationowej, chroniąc komórki przed uszkodzeniami oksydacyjnymi i wspierając system obrony przeciwutleniającej organizmu.",
			evidenceLevel: "STRONG",
			targetSystems: [
				"Antioxidant enzymes",
				"Cellular protection",
				"Glutathione system",
			],
			timeToEffect: "1-2 weeks",
			duration: "Ongoing for antioxidant protection",
		},
		{
			id: "thyroid-function",
			name: "Thyroid hormone metabolism and deiodinase activity",
			polishName: "Metabolizm hormonów tarczycy i aktywność dejodynaz",
			pathway: "Thyroid hormone conversion",
			polishPathway: "Konwersja hormonów tarczycy",
			description:
				"Selenium supports thyroid function through deiodinase enzymes that convert T4 to active T3 and protects thyroid cells from oxidative damage.",
			polishDescription:
				"Selen wspiera funkcję tarczycy poprzez enzymy dejodynazy, które przekształcają T4 w aktywny T3 i chronią komórki tarczycy przed uszkodzeniami oksydacyjnymi.",
			evidenceLevel: "STRONG",
			targetSystems: [
				"Thyroid gland",
				"Endocrine system",
				"Hormone metabolism",
			],
			timeToEffect: "2-4 weeks",
			duration: "Chronic supplementation required",
		},
		{
			id: "immune-modulation",
			name: "Immune system modulation and inflammation control",
			polishName: "Modulacja układu odpornościowego i kontrola zapalenia",
			pathway: "Immune cell function",
			polishPathway: "Funkcja komórek odpornościowych",
			description:
				"Selenium supports immune function through enhanced natural killer cell activity, cytokine production, and regulation of inflammatory responses.",
			polishDescription:
				"Selen wspiera funkcję odpornościową poprzez zwiększoną aktywność komórek NK, produkcję cytokin i regulację odpowiedzi zapalnych.",
			evidenceLevel: "MODERATE",
			targetSystems: [
				"Immune system",
				"Natural killer cells",
				"Cytokine production",
			],
			timeToEffect: "2-4 weeks",
			duration: "Ongoing for immune maintenance",
		},
		{
			id: "reproductive-health",
			name: "Reproductive health and spermatogenesis support",
			polishName: "Zdrowie reprodukcyjne i wsparcie spermatogenezy",
			pathway: "Sperm maturation",
			polishPathway: "Dojrzewanie plemników",
			description:
				"Selenium supports male fertility through protection of sperm from oxidative damage and support of sperm motility and morphology.",
			polishDescription:
				"Selen wspiera płodność męską poprzez ochronę plemników przed uszkodzeniami oksydacyjnymi i wsparcie ruchliwości oraz morfologii plemników.",
			evidenceLevel: "MODERATE",
			targetSystems: ["Reproductive system", "Testes", "Spermatozoa"],
			timeToEffect: "8-12 weeks",
			duration: "Chronic supplementation for reproductive effects",
		},
	],

	// Comprehensive dosage guidelines
	dosageGuidelines: {
		therapeuticRange: {
			min: 50,
			max: 200,
			unit: "mcg",
		},
		timing: ["morning", "with meals"],
		withFood: true,
		contraindications: [
			"Selenium toxicity risk",
			"Previous selenium overdose",
			"Certain cancers (discuss with oncologist)",
		],
		polishContraindications: [
			"Ryzyko toksyczności selenu",
			"Poprzednie przedawkowanie selenu",
			"Niektóre nowotwory (skonsultuj z onkologiem)",
		],
		interactions: [
			{
				substance: "Vitamin E",
				polishSubstance: "Witamina E",
				type: "synergistic",
				severity: "beneficial",
				description: "Complementary antioxidant protection",
				clinicalSignificance: "Enhanced antioxidant effects",
				polishClinicalSignificance: "Wzmocnione efekty przeciwutleniające",
				polishDescription: "Komplementarna ochrona przeciwutleniająca",
				recommendation: "Beneficial combination for antioxidant support",
				polishRecommendation:
					"Korzystne połączenie dla wsparcia przeciwutleniającego",
				evidenceLevel: "MODERATE",
			},
			{
				substance: "Vitamin C",
				polishSubstance: "Witamina C",
				type: "synergistic",
				severity: "beneficial",
				description: "Enhanced glutathione regeneration",
				clinicalSignificance: "Improved antioxidant recycling",
				polishClinicalSignificance: "Poprawiona regeneracja przeciwutleniaczy",
				polishDescription: "Wzmocniona regeneracja glutationu",
				recommendation: "Beneficial for comprehensive antioxidant protection",
				polishRecommendation:
					"Korzystne dla kompleksowej ochrony przeciwutleniającej",
				evidenceLevel: "MODERATE",
			},
		],
	},

	// Side effects with frequency and management
	sideEffects: [
		{
			effect: "Gastrointestinal upset",
			polishEffect: "Zaburzenia żołądkowo-jelitowe",
			frequency: "rare",
			severity: "mild",
			reversible: true,
			dosageDependent: true,
			timeToOnset: "1-4 hours",
			management: "Take with food, reduce dose",
			polishManagement: "Przyjmuj z jedzeniem, zmniejsz dawkę",
		},
		{
			effect: "Garlic-like breath odor",
			polishEffect: "Czosnkowy zapach oddechu",
			frequency: "uncommon",
			severity: "mild",
			reversible: true,
			dosageDependent: true,
			timeToOnset: "2-6 hours",
			management: "Normal side effect, resolves after discontinuation",
			polishManagement: "Normalny efekt uboczny, ustępuje po odstawieniu",
		},
		{
			effect: "Selenosis symptoms",
			polishEffect: "Objawy selenozy",
			frequency: "very_rare",
			severity: "moderate",
			reversible: true,
			dosageDependent: true,
			timeToOnset: "Weeks of high-dose use",
			management: "Discontinue use, monitor selenium levels",
			polishManagement: "Przerwij stosowanie, monitoruj poziom selenu",
		},
	],

	// Supplement interactions
	interactions: [
		{
			substance: "Vitamin E",
			polishSubstance: "Witamina E",
			type: "synergistic",
			severity: "beneficial",
			description: "Complementary antioxidant protection and immune support",
			polishDescription:
				"Komplementarna ochrona przeciwutleniająca i wsparcie odporności",
			clinicalSignificance: "Enhanced antioxidant and immune effects",
			polishClinicalSignificance:
				"Wzmocnione efekty przeciwutleniające i odpornościowe",
			mechanism:
				"Selenium and vitamin E work together in glutathione peroxidase",
			polishMechanism:
				"Selen i witamina E współpracują w peroksydazie glutationowej",
			recommendation:
				"Beneficial combination for comprehensive antioxidant protection",
			polishRecommendation:
				"Korzystne połączenie dla kompleksowej ochrony przeciwutleniającej",
			evidenceLevel: "MODERATE",
		},
		{
			substance: "Iodine",
			polishSubstance: "Jod",
			type: "synergistic",
			clinicalSignificance: "Enhanced thyroid function and hormone production",
			polishClinicalSignificance:
				"Wzmocniona funkcja tarczycy i produkcja hormonów",
			severity: "beneficial",
			mechanism: "Complementary roles in thyroid hormone metabolism",
			polishMechanism: "Komplementarne role w metabolizmie hormonów tarczycy",
			description:
				"Selenium and iodine work together for optimal thyroid function",
			polishDescription:
				"Selen i jod współpracują dla optymalnej funkcji tarczycy",
			recommendation: "Beneficial combination for thyroid health",
			polishRecommendation: "Korzystne połączenie dla zdrowia tarczycy",
			evidenceLevel: "MODERATE",
		},
	],

	// Evidence level and research studies
	evidenceLevel: "MODERATE",
	researchStudies: [
		{
			id: "rayman-2000",
			title: "The importance of selenium to human health",
			polishTitle: "Znaczenie selenu dla zdrowia człowieka",
			authors: ["Rayman MP"],
			journal: "Lancet",
			year: 2000,
			studyType: "EXPERT_OPINION",
			primaryOutcome: "Selenium requirements and health effects",
			polishPrimaryOutcome: "Wymagania selenu i efekty zdrowotne",
			findings:
				"Selenium is essential for human health with important roles in antioxidant protection and thyroid function",
			polishFindings:
				"Selen jest niezbędny dla zdrowia człowieka z ważnymi rolami w ochronie przeciwutleniającej i funkcji tarczycy",
			evidenceLevel: "STRONG",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "10918987",
			doi: "10.1016/S0140-6736(00)02539-8",
			qualityScore: 9.0,
		},
		{
			id: "thomson-2008",
			title: "Selenium and iodine in autoimmune thyroiditis",
			polishTitle: "Selen i jod w autoimmunologicznym zapaleniu tarczycy",
			authors: ["Thomson CD", "McLachlan SM", "Wilson R"],
			journal: "Thyroid",
			year: 2008,
			studyType: "RANDOMIZED_CONTROLLED_TRIAL",
			primaryOutcome: "Selenium supplementation in autoimmune thyroid disease",
			polishPrimaryOutcome:
				"Suplementacja selenu w autoimmunologicznych chorobach tarczycy",
			findings:
				"Selenium supplementation may benefit patients with autoimmune thyroiditis",
			polishFindings:
				"Suplementacja selenu może korzystnie wpływać na pacjentów z autoimmunologicznym zapaleniem tarczycy",
			evidenceLevel: "MODERATE",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "18631005",
			doi: "10.1089/thy.2008.0080",
			qualityScore: 8.0,
		},
		{
			id: "fairweather-tait-2011",
			title: "Selenium in human health and disease",
			polishTitle: "Selen w zdrowiu i chorobach człowieka",
			authors: ["Fairweather-Tait SJ", "Bao Y", "Broadley MR"],
			journal: "Antioxidants & Redox Signaling",
			year: 2011,
			studyType: "SYSTEMATIC_REVIEW",
			primaryOutcome: "Selenium status and health outcomes",
			polishPrimaryOutcome: "Status selenu i wyniki zdrowotne",
			findings:
				"Optimal selenium status is important for antioxidant protection and thyroid function",
			polishFindings:
				"Optymalny status selenu jest ważny dla ochrony przeciwutleniającej i funkcji tarczycy",
			evidenceLevel: "MODERATE",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "20812787",
			doi: "10.1089/ars.2010.3275",
			qualityScore: 8.5,
		},
	],

	// Metadata
	tags: [
		"mineral",
		"trace mineral",
		"antioxidant",
		"thyroid function",
		"immune support",
		"reproductive health",
		"cardiovascular protection",
		"selenomethionine",
		"organic selenium",
		"glutathione peroxidase",
		"highly bioavailable",
	],
	lastUpdated: "2024-01-15T00:00:00Z",
	createdAt: "2024-01-15T00:00:00Z",

	// Additional fields for Prisma compatibility
	knowledgeNodeId: null,
};

export default seleniumMethionineProfile;
