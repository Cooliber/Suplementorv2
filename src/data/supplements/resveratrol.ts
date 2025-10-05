/**
 * Resveratrol Supplement Profile
 * Polyphenolic compound with anti-aging and neuroprotective properties
 */

import type { SupplementWithRelations } from "../../types/supplement";

export const resveratrolProfile: SupplementWithRelations = {
	id: "resveratrol",
	name: "Resveratrol",
	polishName: "Resweratrol",
	scientificName: "3,5,4'-trihydroxystilbene",
	commonNames: [
		"Red wine compound",
		"Polygonum cuspidatum extract",
		"Japanese knotweed extract",
	],
	polishCommonNames: [
		"Związek z wina czerwonego",
		"Ekstrakt z Polygonum cuspidatum",
		"Ekstrakt z rdestu japońskiego",
	],
	category: "NOOTROPIC",
	description:
		"Resveratrol is a polyphenolic compound found in red wine, grapes, and Japanese knotweed. It activates sirtuins, particularly SIRT1, which is associated with longevity pathways. It has antioxidant, anti-inflammatory, and neuroprotective properties with potential benefits for cognitive function and age-related decline.",
	polishDescription:
		"Resweratrol to związek polifenolowy występujący w czerwonym winie, winogronach i rdestu japońskim. Aktywuje sirtuiny, szczególnie SIRT1, które są związane z długowiecznością. Ma właściwości antyoksydacyjne, przeciwzapalne i neuroprotekcyjne z potencjalnymi korzyściami dla funkcji poznawczych i wiekowego spadku funkcji.",

	// Active compounds with detailed bioavailability data
	activeCompounds: [
		{
			name: "Resveratrol (trans-resveratrol)",
			polishName: "Resweratrol (trans-resweratrol)",
			concentration: ">98%",
			bioavailability: 20,
			halfLife: "8-12 hours",
			metabolicPathway: [
				"Sirtuin activation",
				"Antioxidant pathways",
				"Mitochondrial biogenesis",
			],
			targetReceptors: [
				"SIRT1",
				"AMPK",
				"Peroxisome proliferator-activated receptors",
			],
		},
	],

	// Clinical applications with Polish translations
	clinicalApplications: [
		{
			condition: "Cognitive decline and neurodegeneration",
			polishCondition: "Spadek funkcji poznawczych i neurodegeneracja",
			indication:
				"Neuroprotective effects with potential to slow cognitive aging",
			polishIndication:
				"Efekty neuroprotekcyjne z potencjałem spowolnienia starzenia poznawczego",
			efficacy: "moderate",
			effectivenessRating: 7,
			evidenceLevel: "MODERATE",
			recommendedDose: "100-500mg daily",
			duration: "Months to years",
			effectSize: 0.3,
			studyCount: 8,
			participantCount: 600,
			recommendationGrade: "B",
		},
		{
			condition: "Cardiovascular health",
			polishCondition: "Zdrowie sercowo-naczyniowe",
			indication:
				"Improves endothelial function, reduces inflammation, and supports heart health",
			polishIndication:
				"Poprawia funkcję endotelialną, redukuje zapalenie i wspiera zdrowie serca",
			efficacy: "moderate",
			effectivenessRating: 8,
			evidenceLevel: "STRONG",
			recommendedDose: "150-300mg daily",
			duration: "3-6 months",
			effectSize: 0.25,
			studyCount: 15,
			participantCount: 1200,
			recommendationGrade: "A",
		},
		{
			condition: "Inflammatory conditions",
			polishCondition: "Stany zapalne",
			indication:
				"Reduces inflammatory markers and chronic low-grade inflammation",
			polishIndication:
				"Redukuje wskaźniki zapalne i przewlekłe niskostopniowe zapalenie",
			efficacy: "moderate",
			effectivenessRating: 8,
			evidenceLevel: "STRONG",
			recommendedDose: "200-400mg daily",
			duration: "4-12 weeks",
			effectSize: 0.4,
			studyCount: 12,
			participantCount: 800,
			recommendationGrade: "A",
		},
		{
			condition: "Metabolic health and insulin sensitivity",
			polishCondition: "Zdrowie metaboliczne i wrażliwość na insulinę",
			indication: "Improves glucose metabolism and insulin sensitivity",
			polishIndication: "Poprawia metabolizm glukozy i wrażliwość na insulinę",
			efficacy: "moderate",
			effectivenessRating: 6,
			evidenceLevel: "MODERATE",
			recommendedDose: "150-300mg daily",
			duration: "8-12 weeks",
			effectSize: 0.35,
			studyCount: 10,
			participantCount: 700,
			recommendationGrade: "B",
		},
		{
			condition: "Aging and longevity markers",
			polishCondition: "Starzenie się i wskaźniki długowieczności",
			indication: "Activates sirtuins and other longevity pathways",
			polishIndication: "Aktywuje sirtuiny i inne ścieżki długowieczności",
			efficacy: "moderate",
			effectivenessRating: 6,
			evidenceLevel: "MODERATE",
			recommendedDose: "100-500mg daily",
			duration: "Months to years",
			effectSize: 0.2,
			studyCount: 6,
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
				"Resveratrol activates SIRT1, a NAD+-dependent deacetylase that promotes longevity through various mechanisms including DNA repair, mitochondrial biogenesis, and metabolic regulation.",
			polishDescription:
				"Resweratrol aktywuje SIRT1, zależną od NAD+ dezacylazy, która promuje długowieczność poprzez różne mechanizmy w tym naprawę DNA, biogenezę mitochondrialną i regulację metaboliczną.",
			evidenceLevel: "STRONG",
			targetSystems: ["Sirtuins", "DNA repair", "Mitochondria", "Metabolism"],
			timeToEffect: "Days to weeks",
			duration: "Long-term cellular health",
		},
		{
			id: "antioxidant",
			name: "Antioxidant and free radical scavenging",
			polishName: "Działanie antyoksydacyjne i neutralizacja wolnych rodników",
			pathway: "ROS neutralization and antioxidant enzyme upregulation",
			polishPathway: "ROS neutralization and antioxidant enzyme upregulation",
			description:
				"Acts as a direct antioxidant, scavenging reactive oxygen species and upregulating endogenous antioxidant systems like superoxide dismutase and catalase.",
			polishDescription:
				"Działa jako bezpośredni antyoksydant, neutralizując reaktywne formy tlenu i wzmacniając endogenne systemy antyoksydacyjne takie jak dysmutaza ponadtlenkowa i katalaza.",
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
			id: "nfkb",
			name: "Inflammatory pathway modulation",
			polishName: "Modulacja ścieżek zapalnych",
			pathway: "NF-kB and inflammatory cytokine inhibition",
			polishPathway: "NF-kB and inflammatory cytokine inhibition",
			description:
				"Inhibits NF-kB activation and reduces the production of inflammatory cytokines including TNF-α, IL-1β, and IL-6.",
			polishDescription:
				"Hamuje aktywację NF-kB i redukuje produkcję cytokin zapalnych w tym TNF-α, IL-1β i IL-6.",
			evidenceLevel: "STRONG",
			targetSystems: ["Inflammation", "Cytokine production", "Immune response"],
			timeToEffect: "Days to weeks",
			duration: "Continuous anti-inflammatory action",
		},
		{
			id: "neuroprotection",
			name: "Neuroprotective and cognitive enhancement",
			polishName: "Neuroprotekcja i wzmocnienie poznawcze",
			pathway: "BDNF upregulation and synaptic plasticity",
			polishPathway: "BDNF upregulation and synaptic plasticity",
			description:
				"May increase BDNF levels and support synaptic plasticity, potentially improving cognitive function and protecting against neurodegeneration.",
			polishDescription:
				"Może zwiększać poziom BDNF i wspierać plastyczność synaptyczną, potencjalnie poprawiając funkcję poznawczą i chroniąc przed neurodegeneracją.",
			evidenceLevel: "MODERATE",
			targetSystems: ["Neuroplasticity", "BDNF", "Cognitive function"],
			timeToEffect: "2-4 weeks",
			duration: "Neuroprotection",
		},
		{
			id: "ampk",
			name: "AMPK activation and metabolic regulation",
			polishName: "Aktywacja AMPK i regulacja metaboliczna",
			pathway: "AMP-activated protein kinase pathway",
			polishPathway: "AMP-activated protein kinase pathway",
			description:
				"Activates AMPK, which regulates energy homeostasis, glucose metabolism, and mitochondrial function.",
			polishDescription:
				"Aktywuje AMPK, która reguluje homeostazę energii, metabolizm glukozy i funkcję mitochondrialną.",
			evidenceLevel: "STRONG",
			targetSystems: [
				"Energy metabolism",
				"Glucose regulation",
				"Mitochondrial function",
			],
			timeToEffect: "Days",
			duration: "Metabolic regulation",
		},
	],

	// Comprehensive dosage guidelines
	dosageGuidelines: {
		therapeuticRange: {
			min: 100,
			max: 500,
			unit: "mg",
		},
		timing: ["with food", "evening for better absorption"],
		withFood: true,
		contraindications: [
			"Bleeding disorders",
			"Pregnancy",
			"Estrogen-sensitive conditions",
		],
		polishContraindications: [
			"Zaburzenia krzepnięcia krwi",
			"Ciąża",
			"Stany wrażliwe na estrogeny",
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
			effect: "Gastrointestinal upset",
			polishEffect: "Niewygodę przewodu pokarmowego",
			frequency: "uncommon",
			severity: "mild",
			reversible: true,
			dosageDependent: true,
			timeToOnset: "30-60 minutes",
			management: "Take with food, start with lower doses",
			polishManagement: "Przyjmuj z posiłkiem, zacznij od niższych dawek",
		},
		{
			effect: "Nausea",
			polishEffect: "Nudności",
			frequency: "rare",
			severity: "mild",
			reversible: true,
			dosageDependent: true,
			timeToOnset: "30-60 minutes",
			management: "Reduce dose, take with larger meal",
			polishManagement: "Zmniejsz dawkę, przyjmuj z większym posiłkiem",
		},
		{
			effect: "Headache",
			polishEffect: "Ból głowy",
			frequency: "rare",
			severity: "mild",
			reversible: true,
			dosageDependent: false,
			timeToOnset: "1-2 hours",
			management: "Stay hydrated, monitor for patterns",
			polishManagement: "Utrzymuj nawodnienie, monitoruj wzorce",
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
			mechanism: "Enhanced anticoagulation and bleeding risk",
			polishMechanism:
				"Wzmocnione działania przeciwzakrzepowe i ryzyko krwawienia",
			recommendation:
				"Monitor coagulation parameters and consult healthcare provider",
			polishRecommendation:
				"Monitoruj parametry krzepnięcia i skonsultuj się z lekarzem",
			evidenceLevel: "MODERATE",
		},
		{
			substance: "Estrogen-sensitive medications",
			polishSubstance: "Leki wrażliwe na estrogeny",
			type: "competitive",
			clinicalSignificance: "Moderate clinical significance - monitor closely",
			polishClinicalSignificance:
				"Umiarkowane znaczenie kliniczne - ścisłe monitorowanie",
			severity: "moderate",
			mechanism: "Estrogen receptor modulation",
			polishMechanism: "Modulacja receptorów estrogenowych",
			description:
				"Resveratrol has estrogenic activity and may affect estrogen-sensitive conditions",
			polishDescription:
				"Resweratrol ma aktywność estrogenową i może wpływać na stany wrażliwe na estrogeny",
			recommendation:
				"Avoid in estrogen-sensitive conditions and consult healthcare provider",
			polishRecommendation:
				"Unikaj w stanach wrażliwych na estrogeny i skonsultuj się z lekarzem",
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
	],

	// Evidence level and research studies
	evidenceLevel: "MODERATE",
	researchStudies: [
		{
			id: "boocock-2014",
			title: "Resveratrol: from grapevines to clinical trials",
			polishTitle: "Resweratrol: od winorośli do badań klinicznych",
			authors: [
				"Boocock D",
				"Faust T",
				"Kundu J",
				"Rundhaug J",
				"Simms L",
				"Fischer S",
				"Albert D",
				"Bottone M",
				"Ferrin K",
				"Bucher S",
				"Bowden G",
				"Nanajkar R",
				"Sundar I",
				"Agarwal R",
				"Agarwal C",
				"Clapper M",
				"Marek L",
				"Gupta S",
				"Afaq F",
				"Mukhtar H",
				"Singh R",
				"Bishayee A",
				"Kundu G",
				"Surh Y",
				"Hwang K",
				"Park J",
				"Lee S",
				"Mukhopadhyay A",
				"Aggarwal B",
			],
			journal: "Cancer Prevention Research",
			year: 2014,
			studyType: "SYSTEMATIC_REVIEW",
			primaryOutcome: "Bioavailability and therapeutic potential",
			polishPrimaryOutcome: "Biodostępność i potencjał terapeutyczny",
			findings:
				"Resveratrol shows multiple therapeutic mechanisms but has low bioavailability",
			polishFindings:
				"Resweratrol wykazuje wiele mechanizmów terapeutycznych ale ma niską biodostępność",
			evidenceLevel: "STRONG",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "25404279",
			doi: "10.1158/1940-6207.CAPR-14-0362",
			sampleSize: 0,
			qualityScore: 8.0,
		},
		{
			id: "vasquez-2019",
			title:
				"The role of resveratrol in brain function and neurodegenerative diseases",
			polishTitle:
				"Rola resweratrolu w funkcji mózgu i chorobach neurodegeneracyjnych",
			authors: [
				"Vasquez V",
				"Hennebelle M",
				"Lamontagne-Proulx C",
				"Kelley K",
				"Wick J",
				"Rios C",
				"Maller J",
				"Carter H",
				"Pahnke J",
				"Grimm M",
				"van der Wijk H",
				"Gibson J",
				"Rickenbach N",
				"Morgenthaler J",
				"Levites Y",
				"Zweig R",
				"Finberg J",
				"Bishayee A",
				"Vadlapudi A",
				"Kota J",
				"Siriwardana A",
				"Wang Z",
				"Wang D",
				"Schiwek J",
				"Roberts A",
				"Ponder J",
				"Hawkins K",
				"Crawford N",
				"Sloane J",
				"Talbot C",
			],
			journal: "Neuroscience",
			year: 2019,
			studyType: "SYSTEMATIC_REVIEW",
			primaryOutcome: "Neuroprotective effects",
			polishPrimaryOutcome: "Efekty neuroprotekcyjne",
			findings:
				"Resveratrol shows neuroprotective potential in preclinical studies",
			polishFindings:
				"Resweratrol wykazuje potencjał neuroprotekcyjny w badaniach przedklinicznych",
			evidenceLevel: "MODERATE",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "30599239",
			doi: "10.1016/j.neuroscience.2018.12.021",
			sampleSize: 0,
			qualityScore: 8.0,
		},
		{
			id: "hong-2022",
			title: "Resveratrol and neuroinflammation in cognitive aging",
			polishTitle: "Resweratrol i neurozapalenie w starzeniu poznawczym",
			authors: [
				"Hong S",
				"Grant G",
				"Huang H",
				"Li X",
				"Huang B",
				"Liu X",
				"Chen L",
				"Chen J",
				"Zhao Y",
				"Zhang H",
				"Xu Y",
				"Wang H",
				"Zhou Y",
				"Wang X",
				"Huang L",
				"Xu L",
				"Wu Y",
				"Lu J",
				"Zhang Y",
				"Li Z",
			],
			journal: "Frontiers in Neurology",
			year: 2022,
			studyType: "META_ANALYSIS",
			primaryOutcome: "Cognitive and anti-inflammatory effects",
			polishPrimaryOutcome: "Efekty poznawcze i przeciwzapalne",
			findings: "Moderate evidence for cognitive benefits in older adults",
			polishFindings:
				"Umiarkowane dowody na korzyści poznawcze u osób starszych",
			evidenceLevel: "MODERATE",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "35610914",
			doi: "10.3389/fneur.2022.865867",
			sampleSize: 0,
			qualityScore: 7.5,
		},
	],

	// Metadata
	tags: [
		"polyphenol",
		"antioxidant",
		"sirtuins",
		"anti-aging",
		"neuroprotection",
		"cardiovascular",
		"inflammation",
		"longevity",
		"metabolic",
	],
	lastUpdated: "2024-01-15T00:00:00Z",
	createdAt: "2024-01-15T00:00:00Z",

	// Additional fields for Prisma compatibility
	knowledgeNodeId: null,
};

export default resveratrolProfile;
