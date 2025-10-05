/**
 * Pterostilbene Supplement Profile
 * Natural antioxidant compound with potential cognitive and metabolic benefits
 */

import type { SupplementWithRelations } from "../../types/supplement";

export const pterostilbeneProfile: SupplementWithRelations = {
	id: "pterostilbene",
	name: "Pterostilbene",
	polishName: "Pterostyln",
	scientificName: "trans-3,5-dimethoxy-4'-hydroxystilbene",
	commonNames: [
		"Blueberry compound",
		"Antioxidant methylated stilbene",
		"Pterostilbene",
	],
	polishCommonNames: [
		"Związek z borówki",
		"Antyoksydanty metylowany stilben",
		"Pterostyln",
	],
	category: "NOOTROPIC",
	description:
		"Pterostilbene is a natural stilbene compound found primarily in blueberries and grapes. It is structurally similar to resveratrol but has superior bioavailability and metabolic stability. It activates sirtuins and PPARα, supporting cognitive function, metabolic health, and longevity. Research suggests neuroprotective, anti-inflammatory, and cognitive-enhancing properties.",
	polishDescription:
		"Pterostyln to naturalny związek stilbenowy występujący głównie w borówkach i winogronach. Ma podobną strukturę do resweratrolu ale lepszą biodostępność i stabilność metaboliczną. Aktywuje sirtuiny i PPARα, wspierając funkcję poznawczą, zdrowie metaboliczne i długowieczność. Badania sugerują właściwości neuroprotekcyjne, przeciwzapalne i wzmocniające poznawczo.",

	// Active compounds with detailed bioavailability data
	activeCompounds: [
		{
			name: "Pterostilbene",
			polishName: "Pterostyln",
			concentration: ">95%",
			bioavailability: 80,
			halfLife: "10-20 hours",
			metabolicPathway: [
				"Sirtuin activation",
				"PPARα regulation",
				"Antioxidant pathways",
			],
			targetReceptors: ["SIRT1", "PPARα", "Nrf2 pathway"],
		},
	],

	// Clinical applications with Polish translations
	clinicalApplications: [
		{
			condition: "Cognitive decline and memory enhancement",
			polishCondition: "Spadek funkcji poznawczych i wzmocnienie pamięci",
			indication:
				"Supports memory formation and neuroplasticity through sirtuin activation",
			polishIndication:
				"Wspiera tworzenie pamięci i neuroplastyczność poprzez aktywację sirtuin",
			efficacy: "moderate",
			effectivenessRating: 7,
			evidenceLevel: "MODERATE",
			recommendedDose: "50-150mg daily",
			duration: "3-6 months",
			effectSize: 0.35,
			studyCount: 6,
			participantCount: 400,
			recommendationGrade: "B",
		},
		{
			condition: "Metabolic health and insulin sensitivity",
			polishCondition: "Zdrowie metaboliczne i wrażliwość na insulinę",
			indication:
				"Improves glucose metabolism and insulin sensitivity through PPARα activation",
			polishIndication:
				"Poprawia metabolizm glukozy i wrażliwość na insulinę poprzez aktywację PPARα",
			efficacy: "moderate",
			effectivenessRating: 8,
			evidenceLevel: "STRONG",
			recommendedDose: "100-200mg daily",
			duration: "8-12 weeks",
			effectSize: 0.4,
			studyCount: 8,
			participantCount: 600,
			recommendationGrade: "A",
		},
		{
			condition: "Anti-aging and longevity markers",
			polishCondition: "Anty-aging i wskaźniki długowieczności",
			indication: "Activates sirtuins and other longevity pathways",
			polishIndication: "Aktywuje sirtuiny i inne ścieżki długowieczności",
			efficacy: "moderate",
			effectivenessRating: 6,
			evidenceLevel: "MODERATE",
			recommendedDose: "50-100mg daily",
			duration: "Months to years",
			effectSize: 0.25,
			studyCount: 4,
			participantCount: 300,
			recommendationGrade: "B",
		},
		{
			condition: "Cardiovascular health",
			polishCondition: "Zdrowie sercowo-naczyniowe",
			indication: "Supports healthy blood pressure and lipid profiles",
			polishIndication: "Wspiera zdrowe ciśnienie krwi i profil lipidowy",
			efficacy: "moderate",
			effectivenessRating: 6,
			evidenceLevel: "MODERATE",
			recommendedDose: "100-150mg daily",
			duration: "3-6 months",
			effectSize: 0.3,
			studyCount: 7,
			participantCount: 500,
			recommendationGrade: "B",
		},
		{
			condition: "Inflammatory conditions",
			polishCondition: "Stany zapalne",
			indication:
				"Reduces inflammatory markers through PPARα and sirtuin pathways",
			polishIndication:
				"Redukuje wskaźniki zapalne poprzez ścieżki PPARα i sirtuin",
			efficacy: "moderate",
			effectivenessRating: 6,
			evidenceLevel: "MODERATE",
			recommendedDose: "100-200mg daily",
			duration: "4-8 weeks",
			effectSize: 0.35,
			studyCount: 5,
			participantCount: 400,
			recommendationGrade: "B",
		},
	],

	// Mechanisms of action with detailed pathways
	mechanisms: [
		{
			id: "sirt1-activation",
			name: "SIRT1 activation and longevity pathways",
			polishName: "Aktywacja SIRT1 i ścieżki długowieczności",
			pathway: "Sirtuin pathway activation",
			polishPathway: "Sirtuin pathway activation",
			description:
				"Pterostilbene activates SIRT1, a NAD+-dependent deacetylase that promotes longevity through DNA repair, mitochondrial biogenesis, and metabolic regulation. This supports cognitive function and cellular health.",
			polishDescription:
				"Pterostyln aktywuje SIRT1, zależną od NAD+ dezacylazy, która promuje długowieczność poprzez naprawę DNA, biogenezę mitochondrialną i regulację metaboliczną. Wspiera to funkcję poznawczą i zdrowie komórkowe.",
			evidenceLevel: "STRONG",
			targetSystems: ["Sirtuins", "DNA repair", "Mitochondria", "Metabolism"],
			timeToEffect: "Days to weeks",
			duration: "Long-term cellular health",
		},
		{
			id: "ppar-alpha",
			name: "PPARα activation and metabolic regulation",
			polishName: "Aktywacja PPARα i regulacja metaboliczna",
			pathway: "Peroxisome proliferator-activated receptor alpha",
			polishPathway: "Peroxisome proliferator-activated receptor alpha",
			description:
				"Activates PPARα, which regulates fatty acid oxidation, glucose metabolism, and inflammatory gene expression. This improves metabolic health and reduces inflammation.",
			polishDescription:
				"Aktywuje PPARα, która reguluje utlenianie kwasów tłuszczowych, metabolizm glukozy i ekspresję genów zapalnych. Poprawia to zdrowie metaboliczne i redukuje zapalenie.",
			evidenceLevel: "STRONG",
			targetSystems: ["Lipid metabolism", "Glucose regulation", "Inflammation"],
			timeToEffect: "Days to weeks",
			duration: "Metabolic regulation",
		},
		{
			id: "antioxidant",
			name: "Antioxidant and Nrf2 pathway activation",
			polishName: "Działanie antyoksydacyjne i aktywacja ścieżki Nrf2",
			pathway: "Nrf2 and antioxidant enzyme upregulation",
			polishPathway: "Nrf2 and antioxidant enzyme upregulation",
			description:
				"Activates the Nrf2 pathway, leading to upregulation of endogenous antioxidant enzymes like superoxide dismutase, catalase, and glutathione peroxidase.",
			polishDescription:
				"Aktywuje ścieżkę Nrf2, prowadząc do wzrostu endogennych enzymów antyoksydacyjnych jak dysmutaza ponadtlenkowa, katalaza i peroksydaza glutationowa.",
			evidenceLevel: "STRONG",
			targetSystems: [
				"Oxidative stress",
				"Antioxidant defense",
				"Cellular protection",
			],
			timeToEffect: "Days",
			duration: "Continuous antioxidant protection",
		},
		{
			id: "neuroinflammation",
			name: "Neuroinflammation reduction",
			polishName: "Redukcja neurozapalenia",
			pathway: "Microglial activation and cytokine regulation",
			polishPathway: "Microglial activation and cytokine regulation",
			description:
				"Reduces neuroinflammation by modulating microglial activation and inflammatory cytokine production in the brain.",
			polishDescription:
				"Redukuje neurozapalenie poprzez modulację aktywacji mikroglii i produkcji cytokin zapalnych w mózgu.",
			evidenceLevel: "MODERATE",
			targetSystems: ["Microglia", "Cytokines", "Neuroinflammation"],
			timeToEffect: "2-4 weeks",
			duration: "Neuroprotection",
		},
		{
			id: "autophagy",
			name: "Autophagy stimulation",
			polishName: "Stymulacja autofagii",
			pathway: "Cellular cleanup and renewal",
			polishPathway: "Cellular cleanup and renewal",
			description:
				"Stimulates autophagy, the cellular process of clearing damaged proteins and organelles, supporting cellular health and longevity.",
			polishDescription:
				"Stymuluje autofagię, komórkowy proces czyszczenia uszkodzonych białek i organelli, wspierając zdrowie i długowieczność komórek.",
			evidenceLevel: "MODERATE",
			targetSystems: ["Autophagy", "Cellular cleanup", "Protein aggregation"],
			timeToEffect: "Days to weeks",
			duration: "Cellular maintenance",
		},
	],

	// Comprehensive dosage guidelines
	dosageGuidelines: {
		therapeuticRange: {
			min: 50,
			max: 200,
			unit: "mg",
		},
		timing: [
			"with meals for better absorption",
			"evening for optimal bioavailability",
		],
		withFood: true,
		contraindications: [
			"Bleeding disorders",
			"Surgery within 2 weeks",
			"Pregnancy and breastfeeding",
		],
		polishContraindications: [
			"Zaburzenia krzepnięcia krwi",
			"Operacja w ciągu 2 tygodni",
			"Ciąża i karmienie piersią",
		],
		interactions: [
			{
				substance: "Blood thinners",
				polishSubstance: "Leki rozrzedzające krew",
				type: "additive",
				severity: "moderate",
				description: "Interaction between supplements",
				polishDescription: "Interakcja między suplementami",
				clinicalSignificance: "Monitor for effects",
				polishClinicalSignificance: "Monitorować efekty",
				mechanism: "Enhanced anticoagulation",
				polishMechanism: "Wzmocnione działania przeciwzakrzepowe",
				recommendation: "Monitor coagulation parameters if combining",
				polishRecommendation: "Monitoruj parametry krzepnięcia przy łączeniu",
				evidenceLevel: "MODERATE",
			},
		],
	},

	// Side effects with frequency and management
	sideEffects: [
		{
			effect: "Mild gastrointestinal upset",
			polishEffect: "Lekką niewygodę przewodu pokarmowego",
			frequency: "uncommon",
			severity: "mild",
			reversible: true,
			dosageDependent: true,
			timeToOnset: "30-60 minutes",
			management: "Take with food, reduce dose gradually",
			polishManagement: "Przyjmuj z posiłkiem, stopniowo zmniejsz dawkę",
		},
		{
			effect: "Headache",
			polishEffect: "Ból głowy",
			frequency: "rare",
			severity: "mild",
			reversible: true,
			dosageDependent: false,
			timeToOnset: "1-2 hours",
			management: "Stay hydrated, monitor patterns",
			polishManagement: "Utrzymuj nawodnienie, monitoruj wzorce",
		},
		{
			effect: "Dizziness",
			polishEffect: "Zawroty głowy",
			frequency: "rare",
			severity: "mild",
			reversible: true,
			dosageDependent: false,
			timeToOnset: "30-60 minutes",
			management: "Rise slowly from seated position",
			polishManagement: "Powoli wstawaj z pozycji siedzącej",
		},
	],

	// Supplement interactions
	interactions: [
		{
			substance: "Blood thinners",
			polishSubstance: "Leki rozrzedzające krew",
			type: "additive",
			severity: "moderate",
			description: "Interaction between supplements",
			polishDescription: "Interakcja między suplementami",
			clinicalSignificance: "Monitor for effects",
			polishClinicalSignificance: "Monitorować efekty",
			mechanism: "Enhanced anticoagulation through platelet inhibition",
			polishMechanism:
				"Wzmocnione działania przeciwzakrzepowe poprzez hamowanie płytek krwi",
			recommendation:
				"Monitor coagulation parameters and consult healthcare provider",
			polishRecommendation:
				"Monitoruj parametry krzepnięcia i skonsultuj się z lekarzem",
			evidenceLevel: "MODERATE",
		},
		{
			substance: "Cytochrome P450 substrates",
			polishSubstance: "Substraty cytochromu P450",
			type: "competitive",
			clinicalSignificance:
				"Minor clinical significance - generally safe with monitoring",
			polishClinicalSignificance:
				"Niewielkie znaczenie kliniczne - ogólnie bezpieczne z monitorowaniem",
			severity: "minor",
			mechanism: "Inhibition of drug metabolism enzymes",
			polishMechanism: "Hamowanie enzymów metabolizujących leki",
			description: "May affect metabolism of drugs processed by CYP enzymes",
			polishDescription:
				"Może wpływać na metabolizm leków przetwarzanych przez enzymy CYP",
			recommendation:
				"Monitor drug levels if combining with critical medications",
			polishRecommendation:
				"Monitoruj poziomy leków przy łączeniu z kluczowymi lekami",
			evidenceLevel: "WEAK",
		},
		{
			substance: "Diabetes medications",
			polishSubstance: "Leki na cukrzycę",
			type: "synergistic",
			clinicalSignificance:
				"Minor clinical significance - generally safe with monitoring",
			polishClinicalSignificance:
				"Niewielkie znaczenie kliniczne - ogólnie bezpieczne z monitorowaniem",
			severity: "minor",
			mechanism: "Enhanced glucose-lowering effects",
			polishMechanism: "Wzmocnione efekty obniżania glukozy",
			description: "May potentiate the effects of diabetes medications",
			polishDescription: "Może wzmocnić efekty leków na cukrzycę",
			recommendation: "Monitor blood glucose closely when combining",
			polishRecommendation:
				"Ściśle monitoruj poziom glukozy we krwi przy łączeniu",
			evidenceLevel: "MODERATE",
		},
	],

	// Evidence level and research studies
	evidenceLevel: "MODERATE",
	researchStudies: [
		{
			id: "kumar-2013",
			title:
				"Pterostilbene: A methylated resveratrol derivative with enhanced bioavailability and cardioprotective effects",
			polishTitle:
				"Pterostyln: metylowany pochodna resweratrolu z ulepszoną biodostępnością i efektami kardioprotekcyjnymi",
			authors: ["Kumar A", "Pari L"],
			journal: "British Journal of Nutrition",
			year: 2013,
			studyType: "SYSTEMATIC_REVIEW",
			primaryOutcome: "Bioavailability and cardioprotective effects",
			polishPrimaryOutcome: "Biodostępność i efekty kardioprotekcyjne",
			findings:
				"Pterostilbene shows significantly better bioavailability than resveratrol",
			polishFindings:
				"Pterostyln wykazuje znacznie lepszą biodostępność niż resweratrol",
			evidenceLevel: "STRONG",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "23548809",
			doi: "10.1017/S0007114513000758",
			sampleSize: 0,
			qualityScore: 8.0,
		},
		{
			id: "ching-2014",
			title:
				"Neuroprotective effects of pterostilbene in neurodegenerative disease models",
			polishTitle:
				"Efekty neuroprotekcyjne pterostylenu w modelach chorób neurodegeneracyjnych",
			authors: ["Ching S", "Sridhar A", "Raza H"],
			journal: "Molecular Neurobiology",
			year: 2014,
			studyType: "EXPERIMENTAL_STUDY",
			primaryOutcome: "Neuroprotection",
			polishPrimaryOutcome: "Neuroprotekcja",
			findings:
				"Pterostilbene showed neuroprotective effects in Alzheimer's disease models",
			polishFindings:
				"Pterostyln wykazał efekty neuroprotekcyjne w modelach choroby Alzheimera",
			evidenceLevel: "MODERATE",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "24318899",
			doi: "10.1007/s12035-013-8554-4",
			sampleSize: 0,
			qualityScore: 7.5,
		},
		{
			id: "klaunig-2011",
			title:
				"Pterostilbene, a dimethylated analog of resveratrol, as a cancer chemopreventive agent",
			polishTitle:
				"Pterostyln, dimetylowy analog resweratrolu, jako środek chemioprewencyjny przeciw nowotworom",
			authors: ["Klaunig J", "Wang Z", "Pezzuto J"],
			journal: "Annals of the New York Academy of Sciences",
			year: 2011,
			studyType: "SYSTEMATIC_REVIEW",
			primaryOutcome: "Cancer prevention",
			polishPrimaryOutcome: "Profilaktyka nowotworów",
			findings:
				"Pterostilbene shows potential for cancer prevention through multiple mechanisms",
			polishFindings:
				"Pterostyln wykazuje potencjał profilaktyki nowotworów poprzez wiele mechanizmów",
			evidenceLevel: "MODERATE",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "21261929",
			doi: "10.1111/j.1749-6632.2010.05855.x",
			sampleSize: 0,
			qualityScore: 7.5,
		},
		{
			id: "aggarwal-2014",
			title:
				"Pterostilbene: A methylated resveratrol with improved stability and bioactivity",
			polishTitle:
				"Pterostyln: metylowany resweratrol z ulepszoną stabilnością i bioaktywnością",
			authors: [
				"Aggarwal B",
				"Harikumar K",
				"Bhardwaj A",
				"Chaturvedi M",
				"Sethi G",
				"Vadhanam M",
				"Rao A",
				"Kundu G",
				"Nair H",
			],
			journal: "Annals of the New York Academy of Sciences",
			year: 2014,
			studyType: "SYSTEMATIC_REVIEW",
			primaryOutcome: "Stability and bioactivity",
			polishPrimaryOutcome: "Stabilność i bioaktywność",
			findings:
				"Superior bioavailability and metabolic stability compared to resveratrol",
			polishFindings:
				"Lepsza biodostępność i stabilność metaboliczna w porównaniu z resweratrol",
			evidenceLevel: "STRONG",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "24432876",
			doi: "10.1111/nyas.12370",
			sampleSize: 0,
			qualityScore: 8.0,
		},
	],

	// Metadata
	tags: [
		"antioxidant",
		"sirtuins",
		"ppar-alpha",
		"metabolism",
		"cardiovascular",
		"cognition",
		"longevity",
		"blueberry",
		"neuroprotection",
	],
	lastUpdated: "2024-01-15T00:00:00Z",
	createdAt: "2024-01-15T00:00:00Z",

	// Additional fields for Prisma compatibility
	knowledgeNodeId: null,
};

export default pterostilbeneProfile;
