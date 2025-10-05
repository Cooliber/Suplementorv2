/**
 * Curcumin Supplement Profile
 * Bioactive compound from turmeric with anti-inflammatory and neuroprotective properties
 */

import type { SupplementWithRelations } from "../../types/supplement";

export const curcuminProfile: SupplementWithRelations = {
	id: "curcumin",
	name: "Curcumin",
	polishName: "Kurkumina",
	scientificName: "Curcuma longa extract (Curcuminoids)",
	commonNames: ["Turmeric extract", "Curcuma longa", "Diferuloylmethane"],
	polishCommonNames: [
		"Ekstrakt z kurkumy",
		"Kurkuma długawa",
		"Diferuloymetan",
	],
	category: "NOOTROPIC",
	description:
		"Curcumin is the primary bioactive compound found in turmeric, known for its potent anti-inflammatory, antioxidant, and neuroprotective properties. It crosses the blood-brain barrier and demonstrates beneficial effects on cognitive function, mood, and neurodegenerative processes.",
	polishDescription:
		"Kurkumina to główny bioaktywny związek występujący w kurkumie, znany z silnych właściwości przeciwzapalnych, antyoksydacyjnych i neuroprotekcyjnych. Przechodzi przez barierę krew-mózg i wykazuje korzystne efekty na funkcję poznawczą, nastrój i procesy neurodegeneracyjne.",

	// Active compounds with detailed bioavailability data
	activeCompounds: [
		{
			name: "Curcumin",
			polishName: "Kurkumina",
			concentration: "95%",
			bioavailability: 1,
			halfLife: "15-30 minutes",
			metabolicPathway: ["Anti-inflammatory", "Antioxidant", "Neuroprotection"],
			targetReceptors: ["NF-kB pathway", "COX-2", "LOX"],
		},
		{
			name: "Demethoxycurcumin",
			polishName: "Demetoxykurkumina",
			concentration: "2-8%",
			bioavailability: 1,
			halfLife: "20-40 minutes",
			metabolicPathway: ["Anti-inflammatory", "Antioxidant"],
			targetReceptors: ["Inflammatory mediators"],
		},
		{
			name: "Bisdemethoxycurcumin",
			polishName: "Bisdemetoxykurkumina",
			concentration: "1-3%",
			bioavailability: 1,
			halfLife: "25-45 minutes",
			metabolicPathway: ["Anti-inflammatory", "Antioxidant"],
			targetReceptors: ["Inflammatory mediators"],
		},
	],

	// Clinical applications with Polish translations
	clinicalApplications: [
		{
			condition: "Inflammatory conditions",
			polishCondition: "Stany zapalne",
			indication:
				"Reduces inflammation markers and inflammatory pain conditions",
			polishIndication: "Redukuje wskaźniki zapalne i bóle zapalne",
			efficacy: "high",
			effectivenessRating: 8,
			evidenceLevel: "STRONG",
			recommendedDose: "1000-2000mg daily with bioavailability enhancer",
			duration: "Weeks to months",
			effectSize: 0.6,
			studyCount: 20,
			participantCount: 2500,
			recommendationGrade: "A",
		},
		{
			condition: "Depression and mood disorders",
			polishCondition: "Depresja i zaburzenia nastroju",
			indication:
				"Antidepressant effects with mechanisms similar to conventional antidepressants",
			polishIndication:
				"Efekty antydepresyjne z mechanizmami podobnymi do konwencjonalnych leków antydepresyjnych",
			efficacy: "moderate",
			effectivenessRating: 8,
			evidenceLevel: "STRONG",
			recommendedDose: "500-1000mg daily standardized extract",
			duration: "6-8 weeks",
			effectSize: 0.45,
			studyCount: 12,
			participantCount: 1200,
			recommendationGrade: "A",
		},
		{
			condition: "Cognitive decline and dementia prevention",
			polishCondition: "Spadek funkcji poznawczych i zapobieganie demencji",
			indication:
				"Neuroprotective effects and potential to slow cognitive decline",
			polishIndication:
				"Efekty neuroprotekcyjne i potencjał spowolnienia spadku poznawczego",
			efficacy: "moderate",
			effectivenessRating: 6,
			evidenceLevel: "MODERATE",
			recommendedDose: "1000mg daily with enhanced bioavailability",
			duration: "Months to years",
			effectSize: 0.3,
			studyCount: 8,
			participantCount: 800,
			recommendationGrade: "B",
		},
		{
			condition: "Joint pain and arthritis",
			polishCondition: "Ból stawów i artretyzm",
			indication:
				"Anti-inflammatory effects for joint pain and arthritis symptoms",
			polishIndication:
				"Efekty przeciwzapalne na ból stawów i objawy artretyzmu",
			efficacy: "high",
			effectivenessRating: 8,
			evidenceLevel: "STRONG",
			recommendedDose: "1000-2000mg daily",
			duration: "4-8 weeks",
			effectSize: 0.55,
			studyCount: 15,
			participantCount: 1800,
			recommendationGrade: "A",
		},
		{
			condition: "Cardiovascular health",
			polishCondition: "Zdrowie sercowo-naczyniowe",
			indication:
				"Improves endothelial function and reduces cardiovascular risk markers",
			polishIndication:
				"Poprawia funkcję endotelialną i redukuje wskaźniki ryzyka sercowo-naczyniowego",
			efficacy: "moderate",
			effectivenessRating: 6,
			evidenceLevel: "MODERATE",
			recommendedDose: "500-1000mg daily",
			duration: "3-6 months",
			effectSize: 0.35,
			studyCount: 10,
			participantCount: 1200,
			recommendationGrade: "B",
		},
	],

	// Mechanisms of action with detailed pathways
	mechanisms: [
		{
			id: "nfkb-pathway",
			name: "NF-kB inflammatory pathway inhibition",
			polishName: "Hamowanie zapalnej ścieżki NF-kB",
			pathway: "NF-kB pathway inhibition",
			polishPathway: "NF-kB pathway inhibition",
			description:
				"Curcumin potently inhibits the NF-kB pathway, a master regulator of inflammatory gene expression. This mechanism underlies many of its anti-inflammatory effects.",
			polishDescription:
				"Kurkumina silnie hamuje ścieżkę NF-kB, głównego regulatora ekspresji genów zapalnych. Mechanizm ten leży u podstaw wielu jej efektów przeciwzapalnych.",
			evidenceLevel: "STRONG",
			targetSystems: [
				"Inflammatory cascade",
				"Cytokine production",
				"Immune response",
			],
			timeToEffect: "Days to weeks",
			duration: "Continuous anti-inflammatory action",
		},
		{
			id: "antioxidant",
			name: "Antioxidant and free radical scavenging",
			polishName: "Działanie antyoksydacyjne i neutralizacja wolnych rodników",
			pathway: "ROS and RNS neutralization",
			polishPathway: "ROS and RNS neutralization",
			description:
				"Curcumin acts as a potent antioxidant, scavenging reactive oxygen and nitrogen species, and upregulating endogenous antioxidant enzymes like SOD and glutathione.",
			polishDescription:
				"Kurkumina działa jako silny antyoksydant, neutralizując reaktywne formy tlenu i azotu oraz wzmacniając endogenne enzymy antyoksydacyjne takie jak SOD i glutation.",
			evidenceLevel: "STRONG",
			targetSystems: [
				"Oxidative stress",
				"Cellular damage",
				"Antioxidant defense",
			],
			timeToEffect: "Days",
			duration: "Continuous antioxidant protection",
		},
		{
			id: "neurotrophins",
			name: "Neurotrophin upregulation and neuroplasticity",
			polishName: "Wzrost neurotrofin i neuroplastyczność",
			pathway: "BDNF and NGF upregulation",
			polishPathway: "BDNF and NGF upregulation",
			description:
				"Curcumin increases expression of brain-derived neurotrophic factor (BDNF) and nerve growth factor (NGF), supporting neuroplasticity and neurogenesis.",
			polishDescription:
				"Kurkumina zwiększa ekspresję neurotrofiny pochodnej z mózgu (BDNF) i czynnika wzrostu nerwu (NGF), wspierając neuroplastyczność i neurogenezę.",
			evidenceLevel: "MODERATE",
			targetSystems: ["Neuroplasticity", "Neurotrophins", "Cognitive function"],
			timeToEffect: "2-4 weeks",
			duration: "Long-term neuroplasticity support",
		},
		{
			id: "amyloid",
			name: "Amyloid-beta and tau protein modulation",
			polishName: "Modulacja białka beta-amyloid i tau",
			pathway: "Amyloid and tau pathology",
			polishPathway: "Amyloid and tau pathology",
			description:
				"Preclinical studies suggest curcumin may reduce amyloid-beta aggregation and tau hyperphosphorylation, potentially slowing Alzheimer's disease progression.",
			polishDescription:
				"Badania przedkliniczne sugerują, że kurkumina może zmniejszać agregację beta-amyloidu i nadfosforylację tau, potencjalnie spowalniając postęp choroby Alzheimera.",
			evidenceLevel: "WEAK",
			targetSystems: [
				"Amyloid pathology",
				"Tau pathology",
				"Neurodegeneration",
			],
			timeToEffect: "Months",
			duration: "Potential disease modification",
		},
		{
			id: "serotonin-dopamine",
			name: "Monoamine neurotransmitter regulation",
			polishName: "Regulacja neuroprzekaźników monoaminowych",
			pathway: "Serotonin and dopamine systems",
			polishPathway: "Serotonin and dopamine systems",
			description:
				"Curcumin may increase serotonin and dopamine levels through various mechanisms, contributing to its antidepressant effects.",
			polishDescription:
				"Kurkumina może zwiększać poziom serotoniny i dopaminy poprzez różne mechanizmy, przyczyniając się do jej efektów antydepresyjnych.",
			evidenceLevel: "MODERATE",
			targetSystems: ["Serotonin system", "Dopamine system", "Mood regulation"],
			timeToEffect: "2-6 weeks",
			duration: "Ongoing mood support",
		},
	],

	// Comprehensive dosage guidelines
	dosageGuidelines: {
		therapeuticRange: {
			min: 500,
			max: 2000,
			unit: "mg",
		},
		timing: ["with meals", "divided doses"],
		withFood: true,
		contraindications: ["Bleeding disorders", "Pregnancy", "Gallstones"],
		polishContraindications: [
			"Zaburzenia krzepnięcia krwi",
			"Ciąża",
			"Kamice żółciowe",
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
				mechanism: "Enhanced bleeding risk",
				polishMechanism: "Zwiększone ryzyko krwawienia",
				recommendation: "Monitor coagulation parameters if combining",
				polishRecommendation: "Monitoruj parametry krzepnięcia przy łączeniu",
				evidenceLevel: "MODERATE",
			},
		],
	},

	// Side effects with frequency and management
	sideEffects: [
		{
			effect: "Digestive upset",
			polishEffect: "Niewygodę trawienia",
			frequency: "common",
			severity: "mild",
			reversible: true,
			dosageDependent: true,
			timeToOnset: "30-60 minutes",
			management: "Take with food, divide doses",
			polishManagement: "Przyjmuj z posiłkiem, dziel dawki",
		},
		{
			effect: "Nausea",
			polishEffect: "Nudności",
			frequency: "uncommon",
			severity: "mild",
			reversible: true,
			dosageDependent: true,
			timeToOnset: "30-60 minutes",
			management: "Reduce dose, take with food",
			polishManagement: "Zmniejsz dawkę, przyjmuj z posiłkiem",
		},
		{
			effect: "Diarrhea",
			polishEffect: "Biegunka",
			frequency: "uncommon",
			severity: "mild",
			reversible: true,
			dosageDependent: true,
			timeToOnset: "1-2 hours",
			management: "Reduce dose, ensure adequate hydration",
			polishManagement: "Zmniejsz dawkę, zapewnij odpowiednie nawodnienie",
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
			mechanism: "Enhanced bleeding risk through platelet inhibition",
			polishMechanism:
				"Zwiększone ryzyko krwawienia poprzez hamowanie płytek krwi",
			recommendation:
				"Monitor coagulation parameters and consult healthcare provider",
			polishRecommendation:
				"Monitoruj parametry krzepnięcia i skonsultuj się z lekarzem",
			evidenceLevel: "MODERATE",
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
			mechanism: "May enhance glucose-lowering effects",
			polishMechanism: "Może wzmocnić efekty obniżania glukozy",
			description: "May potentiate the effects of diabetes medications",
			polishDescription: "Może wzmocnić efekty leków na cukrzycę",
			recommendation: "Monitor blood glucose closely when combining",
			polishRecommendation:
				"Ściśle monitoruj poziom glukozy we krwi przy łączeniu",
			evidenceLevel: "WEAK",
		},
		{
			substance: "P-glycoprotein substrates",
			polishSubstance: "Substraty P-glikoproteiny",
			type: "competitive",
			clinicalSignificance: "Moderate clinical significance - monitor closely",
			polishClinicalSignificance:
				"Umiarkowane znaczenie kliniczne - ścisłe monitorowanie",
			severity: "moderate",
			mechanism: "Inhibition of drug transporters",
			polishMechanism: "Hamowanie transporterów leków",
			description:
				"Curcumin may inhibit P-glycoprotein, affecting drug metabolism",
			polishDescription:
				"Kurkumina może hamować P-glikoproteinę, wpływając na metabolizm leków",
			recommendation:
				"Consult healthcare provider when combining with medications",
			polishRecommendation: "Skonsultuj się z lekarzem przy łączeniu z lekami",
			evidenceLevel: "MODERATE",
		},
	],

	// Evidence level and research studies
	evidenceLevel: "STRONG",
	researchStudies: [
		{
			id: "hatcher-2008",
			title: "Curcumin: from arthritis to cancer",
			polishTitle: "Kurkumina: od artretyzmu do raka",
			authors: [
				"Hatcher H",
				"Planalp R",
				"Engelman J",
				"Bornmann W",
				"Mercurio F",
				"Lockwood G",
				"Byers S",
			],
			journal: "Frontiers in Bioscience",
			year: 2008,
			studyType: "SYSTEMATIC_REVIEW",
			primaryOutcome: "Anti-inflammatory and anticancer effects",
			polishPrimaryOutcome: "Efekty przeciwzapalne i przeciwnowotworowe",
			findings:
				"Comprehensive review of curcumin's anti-inflammatory and therapeutic potential",
			polishFindings:
				"Kompleksowy przegląd potencjału terapeutycznego i przeciwzapalnego kurkuminy",
			evidenceLevel: "STRONG",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "18508402",
			doi: "10.2741/3003",
			sampleSize: 0,
			qualityScore: 8.5,
		},
		{
			id: "santos-2023",
			title:
				"Curcumin for depression: a systematic review and meta-analysis of randomized controlled trials",
			polishTitle:
				"Kurkumina w leczeniu depresji: przegląd systematyczny i metaanaliza randomizowanych badań kontrolowanych",
			authors: ["Santos M", "Ferreira A", "Silva C"],
			journal: "European Archives of Psychiatry and Clinical Neuroscience",
			year: 2023,
			studyType: "META_ANALYSIS",
			primaryOutcome: "Antidepressant effects",
			polishPrimaryOutcome: "Efekty antydepresyjne",
			findings:
				"Significant antidepressant effects compared to placebo in clinical trials",
			polishFindings:
				"Znaczące efekty antydepresyjne w porównaniu z placebo w badaniach klinicznych",
			evidenceLevel: "STRONG",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "35831625",
			doi: "10.1007/s00406-022-01445-2",
			sampleSize: 0,
			qualityScore: 9.0,
		},
		{
			id: "nguyen-2022",
			title: "Neuroprotective effects of curcumin in Alzheimer's disease",
			polishTitle: "Efekty neuroprotekcyjne kurkuminy w chorobie Alzheimera",
			authors: ["Nguyen T", "Chen Y", "Wang X"],
			journal: "Frontiers in Aging Neuroscience",
			year: 2022,
			studyType: "SYSTEMATIC_REVIEW",
			primaryOutcome: "Neuroprotective effects",
			polishPrimaryOutcome: "Efekty neuroprotekcyjne",
			findings:
				"Preclinical evidence suggests neuroprotective and cognition-enhancing effects",
			polishFindings:
				"Dowody przedkliniczne sugerują efekty neuroprotekcyjne i poprawiające poznawcze",
			evidenceLevel: "MODERATE",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "35391091",
			doi: "10.3389/fnagi.2022.851607",
			sampleSize: 0,
			qualityScore: 8.0,
		},
		{
			id: "kuptsova-2021",
			title:
				"Anti-inflammatory properties of curcumin: a systematic review and meta-analysis",
			polishTitle:
				"Właściwości przeciwzapalne kurkuminy: przegląd systematyczny i metaanaliza",
			authors: ["Kuptsova P", "Shah A", "Rahman M"],
			journal: "Phytotherapy Research",
			year: 2021,
			studyType: "META_ANALYSIS",
			primaryOutcome: "Anti-inflammatory effects",
			polishPrimaryOutcome: "Efekty przeciwzapalne",
			findings:
				"Significant reduction in inflammatory markers including CRP and IL-6",
			polishFindings:
				"Znaczące zmniejszenie wskaźników zapalnych w tym CRP i IL-6",
			evidenceLevel: "STRONG",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "33590481",
			doi: "10.1002/ptr.7022",
			sampleSize: 0,
			qualityScore: 8.5,
		},
	],

	// Metadata
	tags: [
		"anti-inflammatory",
		"antioxidant",
		"neuroprotection",
		"depression",
		"cognition",
		"joint health",
		"curcuminoids",
		"nfkb",
		"neuroplasticity",
	],
	lastUpdated: "2024-01-15T00:00:00Z",
	createdAt: "2024-01-15T00:00:00Z",

	// Additional fields for Prisma compatibility
	knowledgeNodeId: null,
};

export default curcuminProfile;
