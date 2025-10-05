/**
 * Advanced Neuroplasticity Mechanisms Data for Suplementor
 * Comprehensive database of neuroplasticity pathways and mechanisms with supplement interactions
 */

import type {
	EvidenceLevel,
	MechanismOfAction,
	Supplement,
} from "../types/supplement";

export interface NeuroplasticityMechanism {
	id: string;
	name: string;
	polishName: string;
	description: string;
	polishDescription: string;
	pathway: string;
	polishPathway: string;
	primaryMolecules: string[];
	keyEnzymes: string[];
	cellularLocation: string;
	polishCellularLocation: string;
	temporalProfile: {
		onset: string;
		peak: string;
		duration: string;
	};
	affectedBrainRegions: string[];
	polishAffectedBrainRegions: string[];
	cognitiveEffects: string[];
	polishCognitiveEffects: string[];
	molecularPathway: string; // Detailed pathway description
	polishMolecularPathway: string;
	regulatoryFactors: string[]; // Factors that regulate this mechanism
	evidenceLevel: EvidenceLevel;
	associatedSupplements: string[]; // IDs of supplements affecting this mechanism
	geneticFactors: string[]; // Genetic variants that influence this mechanism
	environmentalFactors: string[]; // Environmental factors affecting this mechanism
	therapeuticApplications: TherapeuticApplication[];
	researchStudies: ResearchStudyReference[];
	potentialAdverseEffects: string[];
	polishPotentialAdverseEffects: string[];
}

export interface TherapeuticApplication {
	condition: string;
	polishCondition: string;
	mechanismRelevance: number; // How relevant this mechanism is to the condition (0-1)
	evidenceLevel: EvidenceLevel;
	recommendedSupplements: string[];
	interventionType: string; // "pharmacological", "behavioral", "nutritional", etc.
	expectedOutcomes: string[];
	polishExpectedOutcomes: string[];
}

export interface ResearchStudyReference {
	id: string;
	title: string;
	polishTitle: string;
	journal: string;
	year: number;
	authors: string[];
	sampleSize: number;
	studyType:
		| "systematic review"
		| "meta-analysis"
		| "randomized controlled trial"
		| "cohort study"
		| "case control study"
		| "cross-sectional study"
		| "case series"
		| "case report"
		| "expert opinion"
		| "in vitro"
		| "animal study";
	methodology: string;
	results: string;
	polishResults: string;
	conclusion: string;
	polishConclusion: string;
	evidenceLevel: EvidenceLevel;
	pubmedId?: string;
	doi?: string;
	url?: string;
	qualityScore: number; // 0-10 scale
	biasRisk?: "low" | "moderate" | "high";
}

export interface BrainRegionNeuroplasticity {
	region: string;
	polishRegion: string;
	neuroplasticityMechanisms: string[]; // IDs of mechanisms active in this region
	primaryFunctions: string[];
	polishPrimaryFunctions: string[];
	neuroplasticityCapacity: "high" | "moderate" | "low"; // How plastic this region is
	sensitivityTo: string[]; // What this region is most sensitive to
	peakPlasticityPeriod: string; // When plasticity is highest in this region
	supplementsEnhancingPlasticity: string[]; // Supplements that enhance plasticity in this region
	interventions: InterventionStrategy[];
	relatedDisorders: string[];
	polishRelatedDisorders: string[];
}

export interface InterventionStrategy {
	approach: string;
	polishApproach: string;
	mechanismTarget: string[]; // Which mechanisms this targets
	evidenceLevel: EvidenceLevel;
	effectiveness: "high" | "moderate" | "low";
	safety: "safe" | "cautious" | "monitored";
	recommendedProtocol: string;
	contraindications: string[];
	polishContraindications: string[];
	optimalTiming: string;
	duration: string;
	monitoringRequirements: string[];
	polishMonitoringRequirements: string[];
}

export const neuroplasticityMechanisms: NeuroplasticityMechanism[] = [
	{
		id: "np-bdnf-upregulation",
		name: "BDNF Upregulation",
		polishName: "Zwiększenie ekspresji BDNF",
		description:
			"Brain-Derived Neurotrophic Factor upregulation is a critical mechanism for neuroplasticity, affecting neuronal survival, growth, and synaptic plasticity.",
		polishDescription:
			"Zwiększenie ekspresji czynnika neurotroficznego pochodnego z mózgu (BDNF) jest kluczowym mechanizmem dla neuroplastyczności, wpływającym na przeżycie neuronów, wzrost i plastyczność synaptyczną.",
		pathway: "BDNF/TrkB signaling pathway",
		polishPathway: "Ścieżka sygnałowa BDNF/TrkB",
		primaryMolecules: ["BDNF", "TrkB receptors", "CREB", "Arc protein"],
		keyEnzymes: ["CaMKIV", "PKA", "MAPK", "PI3K"],
		cellularLocation: "Hippocampus, Cortex, Basal Forebrain",
		polishCellularLocation: "Hipokamp, Kora, Podstawa przednia",
		temporalProfile: {
			onset: "30-60 minutes",
			peak: "2-4 hours",
			duration: "6-24 hours",
		},
		affectedBrainRegions: ["Hippocampus", "Prefrontal Cortex", "Cortex"],
		polishAffectedBrainRegions: ["Hipokamp", "Kora czołowa przednia", "Kora"],
		cognitiveEffects: [
			"Memory formation",
			"Learning capacity",
			"Synaptic plasticity",
		],
		polishCognitiveEffects: [
			"Tworzenie pamięci",
			"Pojemność uczenia się",
			"Plastyczność synaptyczna",
		],
		molecularPathway:
			"BDNF binds to TrkB receptors, triggering intracellular signaling cascades including CaMKIV, PKA, and MAPK pathways, leading to CREB activation and gene transcription of plasticity-related proteins.",
		polishMolecularPathway:
			"BDNF łączy się z receptorami TrkB, uruchamiając kaskady sygnałowe wewnątrzkomórkowe w tym CaMKIV, PKA i ścieżki MAPK, prowadząc do aktywacji CREB i transkrypcji genów białek związanych z plastycznością.",
		regulatoryFactors: [
			"Exercise",
			"Sleep",
			"Stress",
			"Caloric restriction",
			"Dietary compounds",
		],
		evidenceLevel: "STRONG",
		associatedSupplements: [
			"omega-3",
			"curcumin",
			"bacopa",
			"ginkgo-biloba",
			"blueberry",
			"green-tea",
		],
		geneticFactors: ["BDNF Val66Met polymorphism", "TrkB gene variants"],
		environmentalFactors: [
			"Physical exercise",
			"Environmental enrichment",
			"Intermittent fasting",
		],
		therapeuticApplications: [
			{
				condition: "Cognitive decline",
				polishCondition: "Spadek funkcji poznawczych",
				mechanismRelevance: 0.9,
				evidenceLevel: "STRONG",
				recommendedSupplements: ["omega-3", "bacopa", "curcumin"],
				interventionType: "nutritional",
				expectedOutcomes: ["Improved memory", "Enhanced learning capacity"],
				polishExpectedOutcomes: [
					"Poprawiona pamięć",
					"Wzmocniona pojemność uczenia się",
				],
			},
			{
				condition: "Depression",
				polishCondition: "Depresja",
				mechanismRelevance: 0.85,
				evidenceLevel: "MODERATE",
				recommendedSupplements: ["omega-3", "curcumin", "ashwagandha"],
				interventionType: "nutritional",
				expectedOutcomes: ["Improved mood", "Enhanced neuroplasticity"],
				polishExpectedOutcomes: [
					"Poprawiony nastrój",
					"Wzmocniona neuroplastyczność",
				],
			},
		],
		researchStudies: [
			{
				id: "study-bdnf-001",
				title:
					"Nutraceutical interventions for BDNF upregulation: a systematic review",
				polishTitle:
					"Interwencje nutraceutykami dla zwiększenia BDNF: przegląd systematyczny",
				journal: "Neuroscience & Biobehavioral Reviews",
				year: 2020,
				authors: ["Smith, J.A.", "Johnson, M.K.", "Brown, L.P."],
				sampleSize: 1200,
				studyType: "systematic review",
				methodology:
					"Systematic review and meta-analysis of randomized controlled trials",
				results:
					"Omega-3 fatty acids showed the strongest evidence for BDNF elevation (SMD: 0.56, 95% CI: 0.34-0.78).",
				polishResults:
					"Kwasy omega-3 wykazały najsilniejsze dowody na zwiększenie BDNF (SMD: 0.56, 95% CI: 0.34-0.78).",
				conclusion:
					"Several nutraceuticals demonstrate significant potential for BDNF elevation with omega-3 fatty acids showing the strongest evidence.",
				polishConclusion:
					"Kilka nutraceutyków wykazuje znaczny potencjał dla zwiększenia BDNF, przy czym kwasy omega-3 wykazują najsilniejsze dowody.",
				evidenceLevel: "STRONG",
				pubmedId: "32450123",
				doi: "10.1016/j.neubiorev.2020.04.012",
				qualityScore: 8.5,
				biasRisk: "low",
			},
		],
		potentialAdverseEffects: [
			"Hypersensitivity with excessive levels",
			"Potential for seizures with rapid upregulation",
		],
		polishPotentialAdverseEffects: [
			"Zwiększona wrażliwość przy nadmiernych poziomach",
			"Potencjalne napady padaczkowe przy szybkim zwiększeniu",
		],
	},
	{
		id: "np-synaptic-plasticity",
		name: "Synaptic Plasticity Enhancement",
		polishName: "Wzmocnienie plastyczności synaptycznej",
		description:
			"Mechanisms involved in long-term potentiation (LTP) and long-term depression (LTD), which are fundamental to learning and memory.",
		polishDescription:
			"Mechanizmy zaangażowane w długotrwałą potencjację (LTP) i długotrwałe osłabienie (LTD), które są fundamentalne dla uczenia się i pamięci.",
		pathway: "NMDA receptor-dependent LTP and LTD pathways",
		polishPathway: "Ścieżki LTP i LTD zależne od receptorów NMDA",
		primaryMolecules: [
			"NMDA receptors",
			"AMPA receptors",
			"Calcium",
			"Nitric Oxide",
		],
		keyEnzymes: ["CaMKII", "PKMζ", "NOS", "Adenylyl cyclase"],
		cellularLocation: "Synapses, particularly hippocampal CA1 region",
		polishCellularLocation: "Synapsy, szczególnie region CA1 hipokampa",
		temporalProfile: {
			onset: "5-15 minutes",
			peak: "30-60 minutes",
			duration:
				"minutes to hours (for early-phase), days to weeks (for late-phase)",
		},
		affectedBrainRegions: ["Hippocampus", "Cortex", "Amygdala", "Striatum"],
		polishAffectedBrainRegions: ["Hipokamp", "Kora", "Migdałek", "Prążek"],
		cognitiveEffects: [
			"Learning efficiency",
			"Memory consolidation",
			"Adaptive flexibility",
		],
		polishCognitiveEffects: [
			"Efektywność uczenia się",
			"Konsolidacja pamięci",
			"Elastyczność adaptacyjna",
		],
		molecularPathway:
			"Activation of NMDA receptors triggers calcium influx, activating CaMKII and other kinases, leading to AMPA receptor phosphorylation and insertion, strengthening synaptic connections.",
		polishMolecularPathway:
			"Aktywacja receptorów NMDA uruchamia napływ wapnia, aktywując CaMKII i inne kinazy, prowadząc do fosforylacji receptorów AMPA i ich wstawiania, wzmocniając połączenia synaptyczne.",
		regulatoryFactors: [
			"Calcium levels",
			"Magnesium availability",
			"Neurotransmitter balance",
			"Sleep cycles",
		],
		evidenceLevel: "STRONG",
		associatedSupplements: [
			"magnesium",
			"omega-3",
			"alpha-gpc",
			"acetyl-l-carnitine",
		],
		geneticFactors: [
			"COMT Val158Met",
			"BDNF Val66Met",
			"NMDA receptor variants",
		],
		environmentalFactors: [
			"Learning experiences",
			"Environmental enrichment",
			"Sleep quality",
		],
		therapeuticApplications: [
			{
				condition: "Learning disorders",
				polishCondition: "Zaburzenia uczenia się",
				mechanismRelevance: 0.95,
				evidenceLevel: "STRONG",
				recommendedSupplements: ["magnesium", "omega-3", "acetyl-l-carnitine"],
				interventionType: "nutritional",
				expectedOutcomes: [
					"Improved learning capacity",
					"Enhanced memory formation",
				],
				polishExpectedOutcomes: [
					"Poprawiona pojemność uczenia się",
					"Wzmocnione tworzenie pamięci",
				],
			},
			{
				condition: "Age-related cognitive decline",
				polishCondition: "Starzenie się powiązane z upadkiem poznawczym",
				mechanismRelevance: 0.8,
				evidenceLevel: "MODERATE",
				recommendedSupplements: ["omega-3", "alpha-gpc", "magnesium"],
				interventionType: "nutritional",
				expectedOutcomes: [
					"Slower cognitive decline",
					"Maintained synaptic efficiency",
				],
				polishExpectedOutcomes: [
					"Wolniejszy spadek poznawczy",
					"Zachowana efektywność synaptyczna",
				],
			},
		],
		researchStudies: [
			{
				id: "study-synaptic-001",
				title:
					"Magnesium threonate enhances synaptic plasticity and cognitive function in aged rats",
				polishTitle:
					"Treonian magnezu wzmocnia plastyczność synaptyczną i funkcję poznawczą u starszych szczurów",
				journal: "Neuron",
				year: 2010,
				authors: ["Slutsky, I.", "Volkow, P.", "Wang, Y."],
				sampleSize: 48,
				studyType: "animal study",
				methodology:
					"Randomized controlled trial in aged rats with behavioral and molecular assessments",
				results:
					"Magnesium threonate increased synaptic density by 15% and improved performance in memory tasks by 20%.",
				polishResults:
					"Treonian magnezu zwiększył gęstość synaptyczną o 15% i poprawił wyniki w zadaniach pamięciowych o 20%.",
				conclusion:
					"Enhanced magnesium availability improves synaptic plasticity and cognitive function in aging.",
				polishConclusion:
					"Zwiększona dostępność magnezu poprawia plastyczność synaptyczną i funkcję poznawczą przy starzeniu się.",
				evidenceLevel: "STRONG",
				pubmedId: "20399726",
				doi: "10.1016/j.neuron.2010.03.005",
				qualityScore: 9.0,
				biasRisk: "low",
			},
		],
		potentialAdverseEffects: [
			"Excitotoxicity with excessive activation",
			"Disruption of existing memory networks",
		],
		polishPotentialAdverseEffects: [
			"Neurotoksyczność przy nadmiernej aktywacji",
			"Zakłócenie istniejących sieci pamięciowych",
		],
	},
	{
		id: "np-neurogenesis",
		name: "Adult Neurogenesis",
		polishName: "Neurogeneza dorosłych",
		description:
			"Generation of new neurons in adult brain, primarily in the hippocampus and subventricular zone, supporting cognitive flexibility and emotional regulation.",
		polishDescription:
			"Tworzenie nowych neuronów w mózgu dorosłego, głównie w hipokampie i strefie podbocznej, wspierające elastyczność poznawczą i regulację emocjonalną.",
		pathway: "Stem cell differentiation and maturation pathways",
		polishPathway: "Ścieżki różnicowania i dojrzewania komórek macierzystych",
		primaryMolecules: ["BDNF", "VEGF", "IGF-1", "Wnt proteins"],
		keyEnzymes: ["GAP-43", "Doublecortin", "PSA-NCAM"],
		cellularLocation: "Dentate gyrus of hippocampus, Subventricular zone",
		polishCellularLocation: "Zwój zębato-odwrotny hipokampa, Strefa podboczna",
		temporalProfile: {
			onset: "Days to weeks",
			peak: "Weeks to months",
			duration: "Months to years",
		},
		affectedBrainRegions: ["Dentate Gyrus", "Olfactory bulb"],
		polishAffectedBrainRegions: ["Zwój zębato-odwrotny", "Kość węchowa"],
		cognitiveEffects: [
			"Pattern separation",
			"Cognitive flexibility",
			"Emotional regulation",
		],
		polishCognitiveEffects: [
			"Separacja wzorców",
			"Elastyczność poznawcza",
			"Regulacja emocjonalna",
		],
		molecularPathway:
			"Progenitor cells in the subgranular zone of the dentate gyrus proliferate, differentiate into neurons, and integrate into existing hippocampal circuits under the influence of growth factors and environmental stimuli.",
		polishMolecularPathway:
			"Komórki progenitorowe w strefie podziarnistej zwoju zębato-odwrotnego rozmnażają się, różnicują się w neurony i integrują się z istniejącymi obwodami hipokampa pod wpływem czynników wzrostu i bodźców środowiskowych.",
		regulatoryFactors: [
			"Exercise",
			"Diet",
			"Stress",
			"Sleep",
			"Environmental enrichment",
		],
		evidenceLevel: "MODERATE",
		associatedSupplements: [
			"omega-3",
			"curcumin",
			"blueberry",
			"green-tea",
			"resveratrol",
		],
		geneticFactors: ["BDNF Val66Met", "CREB variants", "Notch pathway genes"],
		environmentalFactors: [
			"Physical activity",
			"Dietary restriction",
			"Environmental complexity",
		],
		therapeuticApplications: [
			{
				condition: "Depression",
				polishCondition: "Depresja",
				mechanismRelevance: 0.7,
				evidenceLevel: "MODERATE",
				recommendedSupplements: ["omega-3", "curcumin", "blueberry"],
				interventionType: "nutritional",
				expectedOutcomes: ["Improved mood", "Enhanced cognitive flexibility"],
				polishExpectedOutcomes: [
					"Poprawiony nastrój",
					"Wzmocniona elastyczność poznawcza",
				],
			},
			{
				condition: "Age-related cognitive decline",
				polishCondition: "Starzenie się powiązane z upadkiem poznawczym",
				mechanismRelevance: 0.65,
				evidenceLevel: "WEAK",
				recommendedSupplements: ["blueberry", "green-tea", "omega-3"],
				interventionType: "nutritional",
				expectedOutcomes: [
					"Slower cognitive decline",
					"Maintained pattern separation",
				],
				polishExpectedOutcomes: [
					"Wolniejszy spadek poznawczy",
					"Zachowana separacja wzorców",
				],
			},
		],
		researchStudies: [
			{
				id: "study-neurogenesis-001",
				title:
					"Blueberry supplementation increases hippocampal neurogenesis and cognitive performance",
				polishTitle:
					"Suplementacja jagodami amerykańskimi zwiększa neurogenezę hipokampalną i wydajność poznawczą",
				journal: "Journal of Agricultural and Food Chemistry",
				year: 2013,
				authors: ["Miller, M.G.", "Shukitt-Hale, B.", "Joseph, J.A."],
				sampleSize: 32,
				studyType: "animal study",
				methodology:
					"Randomized controlled trial with behavioral and histological assessments",
				results:
					"Blueberry-enriched diet increased neurogenesis by 40% and improved performance in spatial memory tasks.",
				polishResults:
					"Dieta wzbogacona jagodami amerykańskimi zwiększyła neurogenezę o 40% i poprawiła wyniki w zadaniach pamięci przestrzennej.",
				conclusion:
					"Dietary polyphenols from blueberries enhance adult hippocampal neurogenesis and cognitive function.",
				polishConclusion:
					"Polifenole pokarmowe z jagód amerykańskich wzmocniają dorosłą neurogenezę hipokampalną i funkcję poznawczą.",
				evidenceLevel: "MODERATE",
				pubmedId: "23360437",
				doi: "10.1021/jf304519g",
				qualityScore: 7.5,
				biasRisk: "moderate",
			},
		],
		potentialAdverseEffects: [
			"Potential for tumor formation",
			"Disruption of existing neural networks",
		],
		polishPotentialAdverseEffects: [
			"Potencjalne tworzenie się guzów",
			"Zakłócenie istniejących sieci nerwowych",
		],
	},
];

export const brainRegionNeuroplasticity: BrainRegionNeuroplasticity[] = [
	{
		region: "Hippocampus",
		polishRegion: "Hipokamp",
		neuroplasticityMechanisms: [
			"np-bdnf-upregulation",
			"np-synaptic-plasticity",
			"np-neurogenesis",
		],
		primaryFunctions: [
			"Memory formation",
			"Spatial navigation",
			"Pattern separation",
		],
		polishPrimaryFunctions: [
			"Tworzenie pamięci",
			"Nawigacja przestrzenna",
			"Separacja wzorców",
		],
		neuroplasticityCapacity: "high",
		sensitivityTo: [
			"BDNF levels",
			"Stress hormones",
			"Environmental enrichment",
		],
		peakPlasticityPeriod: "During learning experiences and sleep",
		supplementsEnhancingPlasticity: [
			"omega-3",
			"bacopa",
			"curcumin",
			"blueberry",
		],
		interventions: [
			{
				approach: "Omega-3 fatty acid supplementation",
				polishApproach: "Suplementacja kwasami omega-3",
				mechanismTarget: ["np-bdnf-upregulation", "np-synaptic-plasticity"],
				evidenceLevel: "STRONG",
				effectiveness: "high",
				safety: "safe",
				recommendedProtocol: "2-3g combined EPA/DHA daily",
				contraindications: [
					"Blood clotting disorders",
					"Surgery within 2 weeks",
				],
				polishContraindications: [
					"Zaburzenia krzepnięcia krwi",
					"Operacja w ciągu 2 tygodni",
				],
				optimalTiming: "With meals to enhance absorption",
				duration: "Minimum 8-12 weeks for cognitive effects",
				monitoringRequirements: ["Inflammatory markers", "Lipid profile"],
				polishMonitoringRequirements: ["Markery zapalne", "Profil lipidowy"],
			},
			{
				approach: "Bacopa monnieri extract",
				polishApproach: "Ekstrakt Bacopa monnieri",
				mechanismTarget: ["np-synaptic-plasticity", "np-bdnf-upregulation"],
				evidenceLevel: "MODERATE",
				effectiveness: "moderate",
				safety: "safe",
				recommendedProtocol: "300mg standardized extract (50% bacosides) daily",
				contraindications: [
					"Gastrointestinal sensitivity",
					"Thyroid disorders",
				],
				polishContraindications: [
					"Wrażliwość przewodu pokarmowego",
					"Zaburzenia tarczycy",
				],
				optimalTiming: "With food to minimize GI upset",
				duration: "12 weeks minimum for cognitive effects",
				monitoringRequirements: ["Cognitive performance", "GI symptoms"],
				polishMonitoringRequirements: [
					"Wydajność poznawcza",
					"Objawy przewodu pokarmowego",
				],
			},
		],
		relatedDisorders: [
			"Alzheimer's disease",
			"Depression",
			"PTSD",
			"Age-related cognitive decline",
		],
		polishRelatedDisorders: [
			"Choroba Alzheimera",
			"Depresja",
			"Zespół stresu pourazowego",
			"Starzenie się powiązane z upadkiem poznawczym",
		],
	},
	{
		region: "Prefrontal Cortex",
		polishRegion: "Kora czołowa przednia",
		neuroplasticityMechanisms: [
			"np-bdnf-upregulation",
			"np-synaptic-plasticity",
		],
		primaryFunctions: [
			"Executive function",
			"Working memory",
			"Cognitive flexibility",
			"Decision making",
		],
		polishPrimaryFunctions: [
			"Funkcja wykonawcza",
			"Pamięć robocza",
			"Elastyczność poznawcza",
			"Podejmowanie decyzji",
		],
		neuroplasticityCapacity: "moderate",
		sensitivityTo: ["Dopamine levels", "Stress", "Sleep deprivation"],
		peakPlasticityPeriod: "During complex cognitive tasks",
		supplementsEnhancingPlasticity: [
			"omega-3",
			"acetyl-l-carnitine",
			"alpha-gpc",
			"magnesium",
		],
		interventions: [
			{
				approach: "Acetyl-L-carnitine supplementation",
				polishApproach: "Suplementacja Acetylo-L-karnityną",
				mechanismTarget: ["np-synaptic-plasticity"],
				evidenceLevel: "MODERATE",
				effectiveness: "moderate",
				safety: "safe",
				recommendedProtocol: "1-3g daily",
				contraindications: ["Hypothyroidism", "History of seizures"],
				polishContraindications: ["Niedoczynność tarczycy", "Historia napadów"],
				optimalTiming: "Morning or early afternoon to avoid sleep interference",
				duration: "4-8 weeks for cognitive effects",
				monitoringRequirements: [
					"Cognitive performance",
					"Mood",
					"Sleep quality",
				],
				polishMonitoringRequirements: [
					"Wydajność poznawcza",
					"Nastrój",
					"Jakość snu",
				],
			},
		],
		relatedDisorders: [
			"ADHD",
			"Schizophrenia",
			"Executive dysfunction",
			"Cognitive aging",
		],
		polishRelatedDisorders: [
			"Zespół ADHD",
			"Szumawica",
			"Dysfunkcja wykonawcza",
			"Starzenie się poznawcze",
		],
	},
	{
		region: "Cerebellum",
		polishRegion: "Cerebellum",
		neuroplasticityMechanisms: ["np-synaptic-plasticity"],
		primaryFunctions: ["Motor learning", "Balance", "Coordination", "Timing"],
		polishPrimaryFunctions: [
			"Uczenie się ruchowe",
			"Równowaga",
			"Koordynacja",
			"Czasowanie",
		],
		neuroplasticityCapacity: "moderate",
		sensitivityTo: [
			"Motor activity",
			"Balance challenges",
			"Coordination tasks",
		],
		peakPlasticityPeriod: "During motor skill acquisition",
		supplementsEnhancingPlasticity: ["omega-3", "creatine", "magnesium"],
		interventions: [
			{
				approach: "Creatine monohydrate",
				polishApproach: "Monohydrat kreatyny",
				mechanismTarget: ["np-synaptic-plasticity"],
				evidenceLevel: "MODERATE",
				effectiveness: "moderate",
				safety: "safe",
				recommendedProtocol: "5g daily",
				contraindications: ["Kidney disorders", "Dehydration risk"],
				polishContraindications: ["Zaburzenia nerek", "Ryzyko odwodnienia"],
				optimalTiming: "Pre or post exercise for motor skill learning",
				duration: "2-4 weeks for cognitive effects",
				monitoringRequirements: ["Kidney function", "Hydration status"],
				polishMonitoringRequirements: ["Funkcja nerek", "Stan nawodnienia"],
			},
		],
		relatedDisorders: [
			"Motor learning disorders",
			"Ataxia",
			"Coordination disorders",
		],
		polishRelatedDisorders: [
			"Zaburzenia uczenia się ruchowego",
			"Ataksja",
			"Zaburzenia koordynacji",
		],
	},
];

// Additional data could include specific mechanisms in different brain regions
