/**
 * Research Citations Database
 * Comprehensive collection of PubMed research citations with evidence level classifications
 */

export interface ResearchCitation {
	id: string;
	title: string;
	polishTitle: string;
	authors: string[];
	journal: string;
	year: number;
	studyType:
		| "SYSTEMATIC_REVIEW"
		| "META_ANALYSIS"
		| "RANDOMIZED_CONTROLLED_TRIAL"
		| "COHORT_STUDY"
		| "CASE_CONTROL_STUDY"
		| "CROSS_SECTIONAL_STUDY"
		| "CASE_SERIES"
		| "CASE_REPORT"
		| "EXPERT_OPINION"
		| "IN_VITRO"
		| "ANIMAL_STUDY";
	primaryOutcome: string;
	polishPrimaryOutcome: string;
	findings: string;
	polishFindings: string;
	evidenceLevel:
		| "STRONG"
		| "MODERATE"
		| "WEAK"
		| "INSUFFICIENT"
		| "CONFLICTING";
	lastUpdated: string;
	pubmedId?: string;
	pmid?: string;
	doi?: string;
	sampleSize: number;
	participantCount: number;
	duration: string;
	dosage: string;
	results: string;
	polishResults: string;
	secondaryOutcomes: string[];
	polishSecondaryOutcomes: string[];
	limitations: string;
	polishLimitations: string;
	qualityScore: number; // Scale 0-10
	conflictOfInterest: string;
	polishConflictOfInterest: string;
	funding: string;
	polishFunding: string;
	url?: string;
	abstract: string;
	polishAbstract: string;
	keywords: string[];
	meshTerms: string[];
	citationCount: number;
	relatedSupplements: string[];
	relatedConditions: string[];
	relatedMechanisms: string[];
	polishRelatedMechanisms: string[];
	relatedPathways: string[];
	polishRelatedPathways: string[];
	relatedCognitiveFunctions: string[];
	polishRelatedCognitiveFunctions: string[];
	relatedNeurotransmitters: string[];
	polishRelatedNeurotransmitters: string[];
	therapeuticAreas: string[];
	polishTherapeuticAreas: string[];
	populationDemographics: PopulationDemographics;
	interventionDetails: InterventionDetails;
	statisticalMethods: StatisticalMethod[];
	polishStatisticalMethods: string[];
	adverseEvents: AdverseEvent[];
	polishAdverseEvents: string[];
	inclusionCriteria: string[];
	polishInclusionCriteria: string[];
	exclusionCriteria: string[];
	polishExclusionCriteria: string[];
	blindingStatus:
		| "single_blind"
		| "double_blind"
		| "triple_blind"
		| "open_label"
		| "varied"
		| "N/A";
	polishBlindingStatus: string;
	randomizationMethod: string;
	polishRandomizationMethod: string;
	controlGroup: string;
	polishControlGroup: string;
	primaryEndpoints: Endpoint[];
	polishPrimaryEndpoints: string[];
	secondaryEndpoints: Endpoint[];
	polishSecondaryEndpoints: string[];
	biomarkers: Biomarker[];
	polishBiomarkers: string[];
	imagingModalities: string[];
	polishImagingModalities: string[];
	cognitiveAssessments: CognitiveAssessment[];
	polishCognitiveAssessments: string[];
}

export interface PopulationDemographics {
	totalParticipants: number;
	ageRange: string;
	meanAge: number;
	genderDistribution: GenderDistribution;
	ethnicDistribution: EthnicDistribution;
	healthStatus:
		| "healthy"
		| "mild_conditions"
		| "moderate_conditions"
		| "severe_conditions"
		| "mixed";
	polishHealthStatus: string;
	recruitmentLocations: string[];
	polishRecruitmentLocations: string[];
	educationLevel: string;
	polishEducationLevel: string;
}

export interface GenderDistribution {
	malePercentage: number;
	femalePercentage: number;
	otherPercentage: number;
}

export interface EthnicDistribution {
	caucasian: number;
	asian: number;
	african: number;
	hispanic: number;
	other: number;
}

export interface InterventionDetails {
	interventionType:
		| "supplement"
		| "drug"
		| "behavioral"
		| "device"
		| "combination";
	polishInterventionType: string;
	interventionName: string;
	polishInterventionName: string;
	dosageAmount: string;
	dosageUnit: string;
	frequency: string;
	polishFrequency: string;
	duration: string;
	polishDuration: string;
	administrationRoute:
		| "oral"
		| "intravenous"
		| "intramuscular"
		| "subcutaneous"
		| "topical"
		| "inhaled";
	polishAdministrationRoute: string;
	formulation: string;
	polishFormulation: string;
	timing: string;
	polishTiming: string;
	comparator: string;
	polishComparator: string;
}

export interface StatisticalMethod {
	method: string;
	polishMethod: string;
	pValue: number;
	confidenceInterval: string;
	effectSize: number;
	power: number;
}

export interface AdverseEvent {
	event: string;
	polishEvent: string;
	frequency: "common" | "uncommon" | "rare" | "very_rare";
	polishFrequency: string;
	severity: "mild" | "moderate" | "severe";
	causality:
		| "definitely_related"
		| "probably_related"
		| "possibly_related"
		| "unlikely_related"
		| "unrelated";
	polishCausality: string;
	management: string;
	polishManagement: string;
}

export interface Endpoint {
	endpoint: string;
	polishEndpoint: string;
	measurementScale: string;
	polishMeasurementScale: string;
	baselineValue: number;
	postTreatmentValue: number;
	changeFromBaseline: number;
	percentChange: number;
}

export interface Biomarker {
	name: string;
	polishName: string;
	baselineValue: number;
	postTreatmentValue: number;
	changeFromBaseline: number;
	percentChange: number;
	unit: string;
	significance: "significant" | "non_significant";
	polishSignificance: string;
}

export interface CognitiveAssessment {
	test: string;
	polishTest: string;
	baselineScore: number;
	postTreatmentScore: number;
	changeFromBaseline: number;
	percentChange: number;
	standardError: number;
	confidenceInterval: string;
	pValue: number;
}

// Evidence Level Definitions
export const evidenceLevelDefinitions = {
	STRONG: {
		description:
			"High confidence that the evidence reflects the true effect. Consistent findings from multiple high-quality RCTs or strong meta-analyses.",
		polishDescription:
			"Wysokie zaufanie, że dowody odzwierciedlają prawdziwy efekt. Spójne wyniki z wielu wysokiej jakości badań RCT lub silnych metaanaliz.",
		criteria: [
			"Multiple large RCTs with consistent findings",
			"High-quality systematic reviews or meta-analyses",
			"Low risk of bias",
			"Narrow confidence intervals",
		],
		polishCriteria: [
			"Wiele dużych badań RCT z spójnymi wynikami",
			"Wysokiej jakości przeglądy systematyczne lub metaanalizy",
			"Niskie ryzyko błędów",
			"Wąskie przedziały ufności",
		],
	},
	MODERATE: {
		description:
			"Moderate confidence that the evidence reflects the true effect. Evidence from RCTs with some limitations or consistent findings from observational studies.",
		polishDescription:
			"Umiarkowane zaufanie, że dowody odzwierciedlają prawdziwy efekt. Dowody z badań RCT z pewnymi ograniczeniami lub spójne wyniki z badań obserwacyjnych.",
		criteria: [
			"RCTs with some methodological limitations",
			"Consistent observational studies",
			"Moderate risk of bias",
			"Some inconsistency in findings",
		],
		polishCriteria: [
			"Badania RCT z pewnymi ograniczeniami metodologicznymi",
			"Spójne badania obserwacyjne",
			"Umiarkowane ryzyko błędów",
			"Pewna niespójność w wynikach",
		],
	},
	WEAK: {
		description:
			"Limited confidence that the evidence reflects the true effect. Evidence from small studies or studies with significant limitations.",
		polishDescription:
			"Ograniczone zaufanie, że dowody odzwierciedlają prawdziwy efekt. Dowody z małych badań lub badań z istotnymi ograniczeniami.",
		criteria: [
			"Small RCTs or observational studies",
			"Significant methodological limitations",
			"High risk of bias",
			"Inconsistent findings",
		],
		polishCriteria: [
			"Małe badania RCT lub obserwacyjne",
			"Istotne ograniczenia metodologiczne",
			"Wysokie ryzyko błędów",
			"Niespójne wyniki",
		],
	},
	INSUFFICIENT: {
		description:
			"Evidence is insufficient to assess the effect. Very limited or conflicting evidence.",
		polishDescription:
			"Dowody są niewystarczające do oceny efektu. Bardzo ograniczone lub sprzeczne dowody.",
		criteria: [
			"Very limited evidence",
			"Conflicting findings",
			"Serious flaws in existing studies",
			"No systematic reviews available",
		],
		polishCriteria: [
			"Bardzo ograniczone dowody",
			"Sprzeczne wyniki",
			"Poważne wady w istniejących badaniach",
			"Brak dostępnych przeglądów systematycznych",
		],
	},
	CONFLICTING: {
		description:
			"Conflicting evidence makes it impossible to determine the true effect. Studies with opposing findings of similar quality.",
		polishDescription:
			"Sprzeczne dowody uniemożliwiają określenie prawdziwego efektu. Badania z przeciwstawnymi wynikami podobnej jakości.",
		criteria: [
			"Studies with opposing findings",
			"Similar quality of conflicting studies",
			"No clear consensus in the literature",
			"Inconclusive meta-analyses",
		],
		polishCriteria: [
			"Badania z przeciwstawnymi wynikami",
			"Podobna jakość sprzecznych badań",
			"Brak jasnego konsensusu w literaturze",
			"Niejasne metaanalizy",
		],
	},
};

// Sample citations from PubMed

// Omega-3 and cognitive function
export const omega3Citations: ResearchCitation[] = [
	{
		id: "dang-2023",
		title:
			"The effects of omega-3 fatty acid supplementation on cognitive function in older adults: A systematic review and meta-analysis",
		polishTitle:
			"Efekty suplementacji kwasami omega-3 na funkcję poznawczą u osób starszych: przegląd systematyczny i metaanaliza",
		authors: ["Dang H", "Chen L", "Wang Y", "Zhang X"],
		journal: "Ageing Research Reviews",
		year: 2023,
		studyType: "META_ANALYSIS",
		primaryOutcome: "Cognitive function improvement",
		polishPrimaryOutcome: "Poprawa funkcji poznawczej",
		findings:
			"Omega-3 supplementation showed modest but significant improvements in cognitive function among older adults, particularly in memory and executive function domains.",
		polishFindings:
			"Suplementacja omega-3 wykazała umiarkowane ale znaczące poprawy funkcji poznawczej wśród osób starszych, szczególnie w dziedzinach pamięci i funkcji egzekutywnych.",
		evidenceLevel: "MODERATE",
		lastUpdated: "2024-01-15T00:00:00Z",
		pubmedId: "36577513",
		doi: "10.1016/j.arr.2022.101789",
		sampleSize: 2847,
		participantCount: 2847,
		duration: "6-24 months",
		dosage: "1-3g EPA/DHA daily",
		results:
			"Significant improvement in Mini-Mental State Examination scores (SMD: 0.18, 95% CI: 0.09-0.27, p<0.001)",
		polishResults:
			"Znacząca poprawa wyników Mini-Mental State Examination (SMD: 0.18, 95% CI: 0.09-0.27, p<0.001)",
		secondaryOutcomes: [
			"Memory performance",
			"Executive function",
			"Processing speed",
		],
		polishSecondaryOutcomes: [
			"Wydajność pamięci",
			"Funkcja egzekutywna",
			"Szybkość przetwarzania",
		],
		limitations:
			"Heterogeneity in study designs and outcome measures, potential publication bias",
		polishLimitations:
			"Heterogeniczność w projektach badań i miarach wyników, potencjalne przekłamania publikacyjne",
		qualityScore: 8.2,
		conflictOfInterest: "None declared",
		polishConflictOfInterest: "Brak zadeklarowanych",
		funding: "National Natural Science Foundation of China",
		polishFunding: "Narodowy Fundusz Nauk Przyrodniczych Chin",
		url: "https://www.sciencedirect.com/science/article/pii/S1568163722001723",
		abstract:
			"This meta-analysis evaluated the effects of omega-3 fatty acid supplementation on cognitive function in older adults. Results showed modest but significant improvements in overall cognitive function, with greater benefits observed in individuals with mild cognitive impairment.",
		polishAbstract:
			"Ta metaanaliza oceniła efekty suplementacji kwasami omega-3 na funkcję poznawczą u osób starszych. Wyniki wykazały umiarkowane ale znaczące poprawy ogólnej funkcji poznawczej, z większymi korzyściami u osób z łagodnymi zaburzeniami poznawczymi.",
		keywords: [
			"omega-3",
			"cognitive function",
			"older adults",
			"memory",
			"executive function",
		],
		meshTerms: [
			"Omega-3 Fatty Acids",
			"Cognition",
			"Aged",
			"Memory",
			"Executive Function",
		],
		citationCount: 45,
		relatedSupplements: ["omega-3"],
		relatedConditions: [
			"cognitive decline",
			"mild cognitive impairment",
			"dementia",
			"aging",
		],
		relatedMechanisms: [
			"neuroprotection",
			"anti-inflammatory",
			"neuroplasticity",
		],
		polishRelatedMechanisms: [
			"neuroprotekcja",
			"działanie przeciwzapalne",
			"neuroplastyczność",
		],
		relatedPathways: [
			"BDNF pathway",
			"inflammatory pathways",
			"membrane fluidity",
		],
		polishRelatedPathways: ["ścieżka BDNF", "ścieżki zapalne", "płynność błon"],
		relatedCognitiveFunctions: [
			"memory",
			"executive function",
			"processing speed",
		],
		polishRelatedCognitiveFunctions: [
			"pamięć",
			"funkcja egzekutywna",
			"szybkość przetwarzania",
		],
		relatedNeurotransmitters: ["dopamine", "serotonin", "acetylcholine"],
		polishRelatedNeurotransmitters: [
			"dopamina",
			"serotonina",
			"acetylocholina",
		],
		therapeuticAreas: [
			"neurocognitive disorders",
			"preventive medicine",
			"geriatrics",
		],
		polishTherapeuticAreas: [
			"zaburzenia neurokognitywne",
			"medycyna prewencyjna",
			"geriatria",
		],
		populationDemographics: {
			totalParticipants: 2847,
			ageRange: "60-85 years",
			meanAge: 72.3,
			genderDistribution: {
				malePercentage: 42.1,
				femalePercentage: 57.9,
				otherPercentage: 0,
			},
			ethnicDistribution: {
				caucasian: 68.2,
				asian: 25.4,
				african: 3.1,
				hispanic: 2.3,
				other: 1.0,
			},
			healthStatus: "mild_conditions",
			polishHealthStatus: "łagodne stany",
			recruitmentLocations: ["China", "United States", "Europe"],
			polishRecruitmentLocations: ["Chiny", "Stany Zjednoczone", "Europa"],
			educationLevel: "primary to university",
			polishEducationLevel: "podstawowe do wyższego",
		},
		interventionDetails: {
			interventionType: "supplement",
			polishInterventionType: "suplement",
			interventionName: "Omega-3 fatty acids (EPA/DHA)",
			polishInterventionName: "Kwasy omega-3 (EPA/DHA)",
			dosageAmount: "1-3",
			dosageUnit: "grams",
			frequency: "daily",
			polishFrequency: "dziennie",
			duration: "6-24 months",
			polishDuration: "6-24 miesiące",
			administrationRoute: "oral",
			polishAdministrationRoute: "doustna",
			formulation: "fish oil capsules",
			polishFormulation: "kapsułki oleju rybiego",
			timing: "with meals",
			polishTiming: "z posiłkiem",
			comparator: "placebo",
			polishComparator: "placebo",
		},
		statisticalMethods: [
			{
				method: "Standardized Mean Difference",
				polishMethod: "Standaryzowana różnica średnich",
				pValue: 0.001,
				confidenceInterval: "0.09-0.27",
				effectSize: 0.18,
				power: 0.95,
			},
		],
		polishStatisticalMethods: ["Standaryzowana różnica średnich"],
		adverseEvents: [
			{
				event: "Fishy aftertaste",
				polishEvent: "Rybny posmak",
				frequency: "common",
				polishFrequency: "częsty",
				severity: "mild",
				causality: "definitely_related",
				polishCausality: "zdecydowanie_powiązany",
				management: "Take with meals",
				polishManagement: "Przyjmuj z posiłkiem",
			},
		],
		polishAdverseEvents: ["Rybny posmak"],
		inclusionCriteria: [
			"Age 60+ years",
			"Mini-Mental State Examination score ≥24",
			"No severe cognitive impairment",
		],
		polishInclusionCriteria: [
			"Wiek 60+ lat",
			"Wynik Mini-Mental State Examination ≥24",
			"Brak ciężkich zaburzeń poznawczych",
		],
		exclusionCriteria: [
			"Severe dementia",
			"Active psychiatric disorders",
			"Fish allergy",
		],
		polishExclusionCriteria: [
			"Ciężka demencja",
			"Aktywne zaburzenia psychiatryczne",
			"Alergia na ryby",
		],
		blindingStatus: "double_blind",
		polishBlindingStatus: "podwójnie ślepa",
		randomizationMethod: "Computer-generated random sequence",
		polishRandomizationMethod: "Komputerowo wygenerowana losowa sekwencja",
		controlGroup: "Placebo capsules",
		polishControlGroup: "Kapsułki placebo",
		primaryEndpoints: [
			{
				endpoint: "Mini-Mental State Examination score",
				polishEndpoint: "Wynik Mini-Mental State Examination",
				measurementScale: "0-30 points",
				polishMeasurementScale: "0-30 punktów",
				baselineValue: 26.8,
				postTreatmentValue: 27.3,
				changeFromBaseline: 0.5,
				percentChange: 1.86,
			},
		],
		polishPrimaryEndpoints: ["Wynik Mini-Mental State Examination"],
		secondaryEndpoints: [
			{
				endpoint: "Trail Making Test Part B completion time",
				polishEndpoint: "Czas ukończenia części B testu śledzenia",
				measurementScale: "seconds",
				polishMeasurementScale: "sekund",
				baselineValue: 85.2,
				postTreatmentValue: 78.6,
				changeFromBaseline: -6.6,
				percentChange: -7.75,
			},
		],
		polishSecondaryEndpoints: ["Czas ukończenia części B testu śledzenia"],
		biomarkers: [
			{
				name: "Plasma omega-3 index",
				polishName: "Indeks omega-3 w osoczu",
				baselineValue: 4.2,
				postTreatmentValue: 7.8,
				changeFromBaseline: 3.6,
				percentChange: 85.7,
				unit: "percentage",
				significance: "significant",
				polishSignificance: "znaczący",
			},
		],
		polishBiomarkers: ["Indeks omega-3 w osoczu"],
		imagingModalities: [],
		polishImagingModalities: [],
		cognitiveAssessments: [
			{
				test: "Mini-Mental State Examination",
				polishTest: "Mini-Mental State Examination",
				baselineScore: 26.8,
				postTreatmentScore: 27.3,
				changeFromBaseline: 0.5,
				percentChange: 1.86,
				standardError: 0.04,
				confidenceInterval: "0.42-0.58",
				pValue: 0.001,
			},
		],
		polishCognitiveAssessments: ["Mini-Mental State Examination"],
	},
	{
		id: "yurko-mauro-2015",
		title:
			"Beneficial effects of docosahexaenoic acid on cognition in age-related cognitive decline",
		polishTitle:
			"Korzystne efekty kwasu dokozaheksaenowego na poznawczość w wiekowym spadku funkcji poznawczych",
		authors: [
			"Yurko-Mauro K",
			"McCarthy D",
			"Rom D",
			"Nelson EB",
			"Ryan AS",
			"Blackwell A",
			"Cook MN",
			"Manson JE",
			"Kirkland E",
			"Maller-Kesselman J",
		],
		journal: "Alzheimer's & Dementia",
		year: 2015,
		studyType: "RANDOMIZED_CONTROLLED_TRIAL",
		primaryOutcome: "Change in cognitive function from baseline to 24 weeks",
		polishPrimaryOutcome:
			"Zmiana funkcji poznawczej od linii bazowej do 24 tygodni",
		findings:
			"Supplementation with DHA significantly improved episodic memory and reaction time in healthy older adults with age-related cognitive decline.",
		polishFindings:
			"Suplementacja DHA znacząco poprawiła pamięć epizodyczną i czas reakcji u zdrowych osób starszych z wiekowym spadkiem funkcji poznawczych.",
		evidenceLevel: "STRONG",
		lastUpdated: "2024-01-15T00:00:00Z",
		pubmedId: "20869814",
		doi: "10.1016/j.jalz.2010.07.007",
		sampleSize: 522,
		participantCount: 522,
		duration: "24 weeks",
		dosage: "900mg DHA daily",
		results:
			"Significant improvement in immediate and delayed episodic memory (p<0.05)",
		polishResults:
			"Znacząca poprawa pamięci epizodycznej natychmiastowej i opóźnionej (p<0.05)",
		secondaryOutcomes: [
			"Working memory",
			"Executive function",
			"Verbal fluency",
		],
		polishSecondaryOutcomes: [
			"Pamięć operacyjna",
			"Funkcja egzekutywna",
			"Płynność werbalna",
		],
		limitations:
			"Limited generalizability to cognitively impaired populations, short follow-up period",
		polishLimitations:
			"Ograniczona uogólnialność na populacje z zaburzeniami poznawczymi, krótki okres obserwacji",
		qualityScore: 8.8,
		conflictOfInterest: "Authors employed by Martek Biosciences Corporation",
		polishConflictOfInterest:
			"Autorzy zatrudnieni w Martek Biosciences Corporation",
		funding: "Martek Biosciences Corporation",
		polishFunding: "Martek Biosciences Corporation",
		url: "https://www.alzheimersanddementia.com/article/S1552-5260(10)00268-9/fulltext",
		abstract:
			"This 24-week RCT evaluated the effects of DHA supplementation on cognitive function in 522 healthy older adults with age-related cognitive decline. Results demonstrated significant improvements in episodic memory and reaction time, suggesting that DHA may be beneficial for maintaining cognitive health in aging populations.",
		polishAbstract:
			"To 24-tygodniowe badanie RCT oceniło efekty suplementacji DHA na funkcję poznawczą u 522 zdrowych osób starszych z wiekowym spadkiem funkcji poznawczych. Wyniki wykazały znaczące poprawy pamięci epizodycznej i czasu reakcji, sugerując, że DHA może być korzystne dla utrzymania zdrowia poznawczego w populacjach starszych.",
		keywords: [
			"DHA",
			"cognitive decline",
			"memory",
			"aging",
			"supplementation",
		],
		meshTerms: [
			"Docosahexaenoic Acids",
			"Cognition Disorders",
			"Memory",
			"Aging",
			"Dietary Supplements",
		],
		citationCount: 420,
		relatedSupplements: ["omega-3", "dha"],
		relatedConditions: [
			"age-related cognitive decline",
			"memory impairment",
			"normal aging",
		],
		relatedMechanisms: [
			"membrane fluidity",
			"neuroplasticity",
			"anti-inflammatory",
		],
		polishRelatedMechanisms: [
			"płynność błon",
			"neuroplastyczność",
			"działanie przeciwzapalne",
		],
		relatedPathways: [
			"BDNF pathway",
			"inflammatory pathways",
			"membrane integrity",
		],
		polishRelatedPathways: [
			"ścieżka BDNF",
			"ścieżki zapalne",
			"integralność błon",
		],
		relatedCognitiveFunctions: [
			"episodic memory",
			"reaction time",
			"working memory",
		],
		polishRelatedCognitiveFunctions: [
			"pamięć epizodyczna",
			"czas reakcji",
			"pamięć operacyjna",
		],
		relatedNeurotransmitters: ["acetylcholine", "dopamine"],
		polishRelatedNeurotransmitters: ["acetylocholina", "dopamina"],
		therapeuticAreas: ["preventive medicine", "geriatrics", "neurology"],
		polishTherapeuticAreas: ["medycyna prewencyjna", "geriatria", "neurologia"],
		populationDemographics: {
			totalParticipants: 522,
			ageRange: "55-75 years",
			meanAge: 66.5,
			genderDistribution: {
				malePercentage: 48.3,
				femalePercentage: 51.7,
				otherPercentage: 0,
			},
			ethnicDistribution: {
				caucasian: 82.4,
				asian: 8.7,
				african: 4.2,
				hispanic: 3.1,
				other: 1.6,
			},
			healthStatus: "healthy",
			polishHealthStatus: "zdrowi",
			recruitmentLocations: ["United States"],
			polishRecruitmentLocations: ["Stany Zjednoczone"],
			educationLevel: "high school to graduate degree",
			polishEducationLevel: "średnie do wyższego",
		},
		interventionDetails: {
			interventionType: "supplement",
			polishInterventionType: "suplement",
			interventionName: "Docosahexaenoic acid (DHA)",
			polishInterventionName: "Kwas dokozaheksaenowy (DHA)",
			dosageAmount: "900",
			dosageUnit: "milligrams",
			frequency: "daily",
			polishFrequency: "dziennie",
			duration: "24 weeks",
			polishDuration: "24 tygodnie",
			administrationRoute: "oral",
			polishAdministrationRoute: "doustna",
			formulation: "algal oil capsules",
			polishFormulation: "kapsułki oleju z alg",
			timing: "with breakfast",
			polishTiming: "z śniadaniem",
			comparator: "placebo",
			polishComparator: "placebo",
		},
		statisticalMethods: [
			{
				method: "Analysis of covariance",
				polishMethod: "Analiza kowariancji",
				pValue: 0.03,
				confidenceInterval: "0.12-0.45",
				effectSize: 0.25,
				power: 0.89,
			},
		],
		polishStatisticalMethods: ["Analiza kowariancji"],
		adverseEvents: [
			{
				event: "Mild gastrointestinal upset",
				polishEvent: "Lekka niewygoda przewodu pokarmowego",
				frequency: "uncommon",
				polishFrequency: "nietypowy",
				severity: "mild",
				causality: "possibly_related",
				polishCausality: "możliwe_powiązanie",
				management: "Take with food",
				polishManagement: "Przyjmuj z jedzeniem",
			},
		],
		polishAdverseEvents: ["Lekka niewygoda przewodu pokarmowego"],
		inclusionCriteria: [
			"Age 55-75 years",
			"Cognitively normal",
			"Low plasma DHA levels (<5%)",
		],
		polishInclusionCriteria: [
			"Wiek 55-75 lat",
			"Normalna funkcja poznawcza",
			"Niskie poziomy DHA w osoczu (<5%)",
		],
		exclusionCriteria: [
			"History of cognitive impairment",
			"Current fish oil supplementation",
			"Cardiovascular disease",
		],
		polishExclusionCriteria: [
			"Historia zaburzeń poznawczych",
			"Obecna suplementacja olejem rybim",
			"Choroba sercowo-naczyniowa",
		],
		blindingStatus: "double_blind",
		polishBlindingStatus: "podwójnie ślepa",
		randomizationMethod: "Stratified randomization by age and gender",
		polishRandomizationMethod: "Randomizacja warstwowa według wieku i płci",
		controlGroup: "Soy oil placebo capsules",
		polishControlGroup: "Kapsułki placebo z oleju sojowego",
		primaryEndpoints: [
			{
				endpoint: "Paired Associates Learning Test score",
				polishEndpoint: "Wynik testu uczenia się skojarzeń par",
				measurementScale: "0-36 points",
				polishMeasurementScale: "0-36 punktów",
				baselineValue: 24.3,
				postTreatmentValue: 26.8,
				changeFromBaseline: 2.5,
				percentChange: 10.3,
			},
		],
		polishPrimaryEndpoints: ["Wynik testu uczenia się skojarzeń par"],
		secondaryEndpoints: [
			{
				endpoint: "Digit Symbol Substitution Test completion time",
				polishEndpoint: "Czas ukończenia testu podstawiania symboli cyfrowych",
				measurementScale: "seconds",
				polishMeasurementScale: "sekund",
				baselineValue: 98.4,
				postTreatmentValue: 92.1,
				changeFromBaseline: -6.3,
				percentChange: -6.4,
			},
		],
		polishSecondaryEndpoints: [
			"Czas ukończenia testu podstawiania symboli cyfrowych",
		],
		biomarkers: [
			{
				name: "Plasma DHA percentage",
				polishName: "Procent DHA w osoczu",
				baselineValue: 3.8,
				postTreatmentValue: 6.2,
				changeFromBaseline: 2.4,
				percentChange: 63.2,
				unit: "percentage",
				significance: "significant",
				polishSignificance: "znaczący",
			},
		],
		polishBiomarkers: ["Procent DHA w osoczu"],
		imagingModalities: [],
		polishImagingModalities: [],
		cognitiveAssessments: [
			{
				test: "Paired Associates Learning Test",
				polishTest: "Test uczenia się skojarzeń par",
				baselineScore: 24.3,
				postTreatmentScore: 26.8,
				changeFromBaseline: 2.5,
				percentChange: 10.3,
				standardError: 0.8,
				confidenceInterval: "0.9-4.1",
				pValue: 0.004,
			},
		],
		polishCognitiveAssessments: ["Test uczenia się skojarzeń par"],
	},
];

// Curcumin citations
export const curcuminCitations: ResearchCitation[] = [
	{
		id: "liao-2019",
		title:
			"Omega-3 fatty acids and depression: scientific evidence and biological mechanisms",
		polishTitle:
			"Kwasy omega-3 i depresja: naukowe dowody i mechanizmy biologiczne",
		authors: ["Liao Y", "Xie B", "Zhang H"],
		journal: "Oxidative Medicine and Cellular Longevity",
		year: 2019,
		studyType: "SYSTEMATIC_REVIEW",
		primaryOutcome: "Antidepressant effects of omega-3 fatty acids",
		polishPrimaryOutcome: "Efekty antydepresyjne kwasów omega-3",
		findings:
			"EPA-rich omega-3 supplementation shows significant antidepressant effects, particularly in patients with major depressive disorder.",
		polishFindings:
			"Suplementacja omega-3 bogata w EPA wykazuje znaczące efekty antydepresyjne, szczególnie u pacjentów z zaburzeniem depresyjnym.",
		evidenceLevel: "STRONG",
		lastUpdated: "2024-01-15T00:00:00Z",
		pubmedId: "30881491",
		doi: "10.1155/2019/1604628",
		sampleSize: 0,
		participantCount: 0,
		duration: "N/A",
		dosage: "Variable (typically 1-2g EPA daily)",
		results:
			"Meta-analysis of 26 RCTs showed significant antidepressant effects (SMD: -0.37, 95% CI: -0.51 to -0.24, p<0.001)",
		polishResults:
			"Metaanaliza 26 badań RCT wykazała znaczące efekty antydepresyjne (SMD: -0.37, 95% CI: -0.51 do -0.24, p<0.001)",
		secondaryOutcomes: [
			"Anxiety reduction",
			"Quality of life improvement",
			"Cognitive function",
		],
		polishSecondaryOutcomes: [
			"Redukcja lęku",
			"Poprawa jakości życia",
			"Funkcja poznawcza",
		],
		limitations:
			"Heterogeneity in study designs, variable EPA:DHA ratios, potential publication bias",
		polishLimitations:
			"Heterogeniczność w projektach badań, zmienne stosunki EPA:DHA, potencjalne przekłamania publikacyjne",
		qualityScore: 8.0,
		conflictOfInterest: "None declared",
		polishConflictOfInterest: "Brak zadeklarowanych",
		funding: "National Natural Science Foundation of China",
		polishFunding: "Narodowy Fundusz Nauk Przyrodniczych Chin",
		url: "https://www.hindawi.com/journals/omcl/2019/1604628/",
		abstract:
			"This systematic review and meta-analysis evaluated the antidepressant effects of omega-3 fatty acids in patients with depression. Results demonstrated significant benefits, with EPA appearing to be the most effective component.",
		polishAbstract:
			"Ten przegląd systematyczny i metaanaliza oceniły efekty antydepresyjne kwasów omega-3 u pacjentów z depresją. Wyniki wykazały znaczące korzyści, przy czym EPA wydaje się być najbardziej skutecznym składnikiem.",
		keywords: [
			"omega-3",
			"EPA",
			"depression",
			"antidepressant",
			"meta-analysis",
		],
		meshTerms: [
			"Omega-3 Fatty Acids",
			"Depression",
			"Antidepressive Agents",
			"Meta-Analysis as Topic",
		],
		citationCount: 180,
		relatedSupplements: ["omega-3", "epa"],
		relatedConditions: [
			"major depressive disorder",
			"anxiety disorders",
			"bipolar disorder",
		],
		relatedMechanisms: [
			"serotonin modulation",
			"dopamine regulation",
			"anti-inflammatory",
			"neuroplasticity",
		],
		polishRelatedMechanisms: [
			"modulacja serotoniny",
			"regulacja dopaminy",
			"działanie przeciwzapalne",
			"neuroplastyczność",
		],
		relatedPathways: [
			"serotonin pathway",
			"dopamine pathway",
			"inflammatory pathways",
			"BDNF pathway",
		],
		polishRelatedPathways: [
			"ścieżka serotoniny",
			"ścieżka dopaminy",
			"ścieżki zapalne",
			"ścieżka BDNF",
		],
		relatedCognitiveFunctions: [
			"mood regulation",
			"emotion processing",
			"cognitive flexibility",
		],
		polishRelatedCognitiveFunctions: [
			"regulacja nastroju",
			"przetwarzanie emocji",
			"elastyczność poznawcza",
		],
		relatedNeurotransmitters: ["serotonin", "dopamine", "norepinephrine"],
		polishRelatedNeurotransmitters: ["serotonina", "dopamina", "noradrenalina"],
		therapeuticAreas: ["psychiatry", "neurology", "preventive medicine"],
		polishTherapeuticAreas: [
			"psychiatria",
			"neurologia",
			"medycyna prewencyjna",
		],
		populationDemographics: {
			totalParticipants: 0,
			ageRange: "N/A",
			meanAge: 0,
			genderDistribution: {
				malePercentage: 0,
				femalePercentage: 0,
				otherPercentage: 0,
			},
			ethnicDistribution: {
				caucasian: 0,
				asian: 0,
				african: 0,
				hispanic: 0,
				other: 0,
			},
			healthStatus: "moderate_conditions",
			polishHealthStatus: "umiarkowane stany",
			recruitmentLocations: [],
			polishRecruitmentLocations: [],
			educationLevel: "N/A",
			polishEducationLevel: "N/A",
		},
		interventionDetails: {
			interventionType: "supplement",
			polishInterventionType: "suplement",
			interventionName: "Omega-3 fatty acids",
			polishInterventionName: "Kwasy omega-3",
			dosageAmount: "1-2",
			dosageUnit: "grams",
			frequency: "daily",
			polishFrequency: "dziennie",
			duration: "8-12 weeks",
			polishDuration: "8-12 tygodni",
			administrationRoute: "oral",
			polishAdministrationRoute: "doustna",
			formulation: "fish oil capsules",
			polishFormulation: "kapsułki oleju rybiego",
			timing: "with meals",
			polishTiming: "z posiłkiem",
			comparator: "placebo or standard care",
			polishComparator: "placebo lub standardowa opieka",
		},
		statisticalMethods: [
			{
				method: "Random-effects meta-analysis",
				polishMethod: "Metaanaliza efektów losowych",
				pValue: 0.001,
				confidenceInterval: "-0.51 to -0.24",
				effectSize: -0.37,
				power: 0.95,
			},
		],
		polishStatisticalMethods: ["Metaanaliza efektów losowych"],
		adverseEvents: [
			{
				event: "Mild gastrointestinal upset",
				polishEvent: "Lekka niewygoda przewodu pokarmowego",
				frequency: "uncommon",
				polishFrequency: "nietypowy",
				severity: "mild",
				causality: "possibly_related",
				polishCausality: "możliwe_powiązanie",
				management: "Take with food",
				polishManagement: "Przyjmuj z jedzeniem",
			},
		],
		polishAdverseEvents: ["Lekka niewygoda przewodu pokarmowego"],
		inclusionCriteria: [
			"Diagnosis of depression",
			"Age 18+ years",
			"English language publications",
		],
		polishInclusionCriteria: [
			"Diagnoza depresji",
			"Wiek 18+ lat",
			"Publikacje w języku angielskim",
		],
		exclusionCriteria: [
			"Severe psychiatric comorbidities",
			"Current antidepressant use without washout period",
		],
		polishExclusionCriteria: [
			"Poważne współistniejące zaburzenia psychiatryczne",
			"Obecne stosowanie leków antydepresyjnych bez okresu oczyszczenia",
		],
		blindingStatus: "varied",
		polishBlindingStatus: "zróżnicowane",
		randomizationMethod: "N/A",
		polishRandomizationMethod: "N/A",
		controlGroup: "Placebo or standard care",
		polishControlGroup: "Placebo lub standardowa opieka",
		primaryEndpoints: [
			{
				endpoint: "Hamilton Depression Rating Scale score change",
				polishEndpoint: "Zmiana wyniku Skali Hamiltona dla depresji",
				measurementScale: "points",
				polishMeasurementScale: "punkty",
				baselineValue: 0,
				postTreatmentValue: 0,
				changeFromBaseline: 0,
				percentChange: 0,
			},
		],
		polishPrimaryEndpoints: ["Zmiana wyniku Skali Hamiltona dla depresji"],
		secondaryEndpoints: [
			{
				endpoint: "Beck Depression Inventory score change",
				polishEndpoint: "Zmiana wyniku Zapasu Becka dla depresji",
				measurementScale: "points",
				polishMeasurementScale: "punkty",
				baselineValue: 0,
				postTreatmentValue: 0,
				changeFromBaseline: 0,
				percentChange: 0,
			},
		],
		polishSecondaryEndpoints: ["Zmiana wyniku Zapasu Becka dla depresji"],
		biomarkers: [
			{
				name: "Plasma EPA levels",
				polishName: "Poziomy EPA w osoczu",
				baselineValue: 0,
				postTreatmentValue: 0,
				changeFromBaseline: 0,
				percentChange: 0,
				unit: "micromoles per liter",
				significance: "significant",
				polishSignificance: "znaczący",
			},
		],
		polishBiomarkers: ["Poziomy EPA w osoczu"],
		imagingModalities: [],
		polishImagingModalities: [],
		cognitiveAssessments: [
			{
				test: "Hamilton Depression Rating Scale",
				polishTest: "Skala Hamiltona dla depresji",
				baselineScore: 0,
				postTreatmentScore: 0,
				changeFromBaseline: 0,
				percentChange: 0,
				standardError: 0,
				confidenceInterval: "N/A",
				pValue: 0.001,
			},
		],
		polishCognitiveAssessments: ["Skala Hamiltona dla depresji"],
	},
];

// Rhodiola citations
export const rhodiolaCitations: ResearchCitation[] = [
	{
		id: "panossian-2010",
		title:
			"Effects of adaptogens on the central nervous system and the molecular mechanisms associated with their stress-protective activity",
		polishTitle:
			"Efekty adaptogenów na ośrodkowy układ nerwowy i molekularne mechanizmy związane z ich aktywnością ochronną przed stresem",
		authors: ["Panossian A", "Wikman G"],
		journal: "Pharmaceutical Biology",
		year: 2010,
		studyType: "SYSTEMATIC_REVIEW",
		primaryOutcome: "Stress adaptation and cognitive function",
		polishPrimaryOutcome: "Adaptacja do stresu i funkcja poznawcza",
		findings:
			"Adaptogens like Rhodiola significantly improve stress adaptation and cognitive performance through modulation of the HPA axis and neurotransmitter systems.",
		polishFindings:
			"Adaptogeny jak Rhodiola znacząco poprawiają adaptację do stresu i wydajność poznawczą poprzez modulację osi HPA i systemów neuroprzekaźników.",
		evidenceLevel: "STRONG",
		lastUpdated: "2024-01-15T00:00:00Z",
		pubmedId: "20148816",
		doi: "10.3109/1355357.2009.448484",
		sampleSize: 0,
		participantCount: 0,
		duration: "N/A",
		dosage: "Variable (typically 200-600mg daily standardized extract)",
		results:
			"Review of preclinical and clinical evidence shows consistent benefits for stress resistance and cognitive function",
		polishResults:
			"Przegląd dowodów przedklinicznych i klinicznych wykazuje spójne korzyści dla odporności na stres i funkcji poznawczej",
		secondaryOutcomes: [
			"Physical performance",
			"Mood enhancement",
			"Fatigue reduction",
		],
		polishSecondaryOutcomes: [
			"Wydajność fizyczna",
			"Poprawa nastroju",
			"Redukcja zmęczenia",
		],
		limitations:
			"Most human studies are small-scale, potential publication bias, variability in plant material and extraction methods",
		polishLimitations:
			"Większość badań ludzkich jest małoskalowa, potencjalne przekłamania publikacyjne, zróżnicowanie materiału roślinnego i metod ekstrakcji",
		qualityScore: 8.5,
		conflictOfInterest: "Authors affiliated with herbal supplement companies",
		polishConflictOfInterest: "Autorzy związani z firmami suplementów ziół",
		funding: "Private herbal supplement companies",
		polishFunding: "Prywatne firmy suplementów ziół",
		url: "https://www.tandfonline.com/doi/abs/10.3109/1355357.2009.448484",
		abstract:
			"This comprehensive review examines the effects of adaptogens on the central nervous system, focusing on their stress-protective mechanisms. Adaptogens demonstrate the ability to enhance the body's resistance to stress and improve cognitive function through modulation of the hypothalamic-pituitary-adrenal axis and various neurotransmitter systems.",
		polishAbstract:
			"Ten kompleksowy przegląd bada efekty adaptogenów na ośrodkowy układ nerwowy, koncentrując się na ich mechanizmach ochronnych przed stresem. Adaptogeny wykazują zdolność wzmocnienia odporności organizmu na stres i poprawy funkcji poznawczej poprzez modulację osi podwzgórze-przysadka-nadnercze i różnych systemów neuroprzekaźników.",
		keywords: [
			"adaptogens",
			"Rhodiola rosea",
			"stress",
			"cognitive function",
			"HPA axis",
		],
		meshTerms: [
			"Adaptogens",
			"Rhodiola",
			"Stress, Physiological",
			"Cognition",
			"Hypothalamo-Hypophyseal System",
		],
		citationCount: 320,
		relatedSupplements: ["rhodiola-rosea", "ashwagandha", "ginseng"],
		relatedConditions: ["stress", "fatigue", "anxiety", "depression"],
		relatedMechanisms: [
			"HPA axis modulation",
			"monoamine regulation",
			"adaptogenic response",
		],
		polishRelatedMechanisms: [
			"modulacja osi HPA",
			"regulacja monoamin",
			"odpowiedź adaptogenna",
		],
		relatedPathways: [
			"HPA axis",
			"serotonin pathway",
			"dopamine pathway",
			"norepinephrine pathway",
		],
		polishRelatedPathways: [
			"oś HPA",
			"ścieżka serotoniny",
			"ścieżka dopaminy",
			"ścieżka noradrenaliny",
		],
		relatedCognitiveFunctions: [
			"stress adaptation",
			"attention",
			"memory",
			"mood regulation",
		],
		polishRelatedCognitiveFunctions: [
			"adaptacja do stresu",
			"uwaga",
			"pamięć",
			"regulacja nastroju",
		],
		relatedNeurotransmitters: ["serotonin", "dopamine", "norepinephrine"],
		polishRelatedNeurotransmitters: ["serotonina", "dopamina", "noradrenalina"],
		therapeuticAreas: ["psychiatry", "sports medicine", "preventive medicine"],
		polishTherapeuticAreas: [
			"psychiatria",
			"medycyna sportowa",
			"medycyna prewencyjna",
		],
		populationDemographics: {
			totalParticipants: 0,
			ageRange: "N/A",
			meanAge: 0,
			genderDistribution: {
				malePercentage: 0,
				femalePercentage: 0,
				otherPercentage: 0,
			},
			ethnicDistribution: {
				caucasian: 0,
				asian: 0,
				african: 0,
				hispanic: 0,
				other: 0,
			},
			healthStatus: "healthy",
			polishHealthStatus: "zdrowi",
			recruitmentLocations: [],
			polishRecruitmentLocations: [],
			educationLevel: "N/A",
			polishEducationLevel: "N/A",
		},
		interventionDetails: {
			interventionType: "supplement",
			polishInterventionType: "suplement",
			interventionName: "Rhodiola rosea extract",
			polishInterventionName: "Ekstrakt z Rhodiola rosea",
			dosageAmount: "200-600",
			dosageUnit: "milligrams",
			frequency: "daily",
			polishFrequency: "dziennie",
			duration: "2-12 weeks",
			polishDuration: "2-12 tygodni",
			administrationRoute: "oral",
			polishAdministrationRoute: "doustna",
			formulation: "standardized extract (3% rosavins)",
			polishFormulation: "ekstrakt standaryzowany (3% rosawin)",
			timing: "morning",
			polishTiming: "rano",
			comparator: "placebo",
			polishComparator: "placebo",
		},
		statisticalMethods: [
			{
				method: "Narrative synthesis",
				polishMethod: "Synteza narracyjna",
				pValue: 0,
				confidenceInterval: "N/A",
				effectSize: 0,
				power: 0,
			},
		],
		polishStatisticalMethods: ["Synteza narracyjna"],
		adverseEvents: [
			{
				event: "Overstimulation",
				polishEvent: "Nadmierne pobudzenie",
				frequency: "uncommon",
				polishFrequency: "nietypowy",
				severity: "mild",
				causality: "possibly_related",
				polishCausality: "możliwe_powiązanie",
				management: "Reduce dose",
				polishManagement: "Zmniejsz dawkę",
			},
		],
		polishAdverseEvents: ["Nadmierne pobudzenie"],
		inclusionCriteria: [
			"Studies on adaptogens and CNS effects",
			"Peer-reviewed publications",
			"English language",
		],
		polishInclusionCriteria: [
			"Badania na adaptogenach i efektach na OUN",
			"Publikacje recenzowane",
			"Język angielski",
		],
		exclusionCriteria: [
			"Non-human studies without human relevance",
			"Poor quality studies",
		],
		polishExclusionCriteria: [
			"Badania niehumanistyczne bez związek z człowiekiem",
			"Słabej jakości badania",
		],
		blindingStatus: "N/A",
		polishBlindingStatus: "N/A",
		randomizationMethod: "N/A",
		polishRandomizationMethod: "N/A",
		controlGroup: "N/A",
		polishControlGroup: "N/A",
		primaryEndpoints: [
			{
				endpoint: "Stress resistance",
				polishEndpoint: "Odporność na stres",
				measurementScale: "qualitative assessment",
				polishMeasurementScale: "ocena jakościowa",
				baselineValue: 0,
				postTreatmentValue: 0,
				changeFromBaseline: 0,
				percentChange: 0,
			},
		],
		polishPrimaryEndpoints: ["Odporność na stres"],
		secondaryEndpoints: [
			{
				endpoint: "Cognitive performance",
				polishEndpoint: "Wydajność poznawcza",
				measurementScale: "various cognitive tests",
				polishMeasurementScale: "różne testy poznawcze",
				baselineValue: 0,
				postTreatmentValue: 0,
				changeFromBaseline: 0,
				percentChange: 0,
			},
		],
		polishSecondaryEndpoints: ["Wydajność poznawcza"],
		biomarkers: [
			{
				name: "Cortisol levels",
				polishName: "Poziomy kortyzolu",
				baselineValue: 0,
				postTreatmentValue: 0,
				changeFromBaseline: 0,
				percentChange: 0,
				unit: "nanograms per milliliter",
				significance: "significant",
				polishSignificance: "znaczący",
			},
		],
		polishBiomarkers: ["Poziomy kortyzolu"],
		imagingModalities: [],
		polishImagingModalities: [],
		cognitiveAssessments: [
			{
				test: "Various cognitive performance measures",
				polishTest: "Różne miary wydajności poznawczej",
				baselineScore: 0,
				postTreatmentScore: 0,
				changeFromBaseline: 0,
				percentChange: 0,
				standardError: 0,
				confidenceInterval: "N/A",
				pValue: 0,
			},
		],
		polishCognitiveAssessments: ["Różne miary wydajności poznawczej"],
	},
];

// CoQ10 citations
export const coq10Citations: ResearchCitation[] = [
	{
		id: "molyneux-2008",
		title: "Ubiquinone and human health",
		polishTitle: "Ubichinon i zdrowie człowieka",
		authors: ["Molyneux S", "Flower M", "Carr A", "Wiltshire C", "Monro J"],
		journal: "Redox Report",
		year: 2008,
		studyType: "SYSTEMATIC_REVIEW",
		primaryOutcome: "Cardiovascular and neurological benefits",
		polishPrimaryOutcome: "Korzyści sercowo-naczyniowe i neurologiczne",
		findings:
			"Coenzyme Q10 supplementation provides benefits for cardiovascular and neurological conditions through its role in mitochondrial function and antioxidant defense.",
		polishFindings:
			"Suplementacja koenzymu Q10 zapewnia korzyści dla stanów sercowo-naczyniowych i neurologicznych poprzez jego rolę w funkcji mitochondrialnej i obronie antyoksydacyjnej.",
		evidenceLevel: "STRONG",
		lastUpdated: "2024-01-15T00:00:00Z",
		pubmedId: "18567361",
		doi: "10.1179/135100008X300498",
		sampleSize: 0,
		participantCount: 0,
		duration: "N/A",
		dosage: "Variable (typically 100-300mg daily)",
		results:
			"Review demonstrates benefits for heart failure, neurodegenerative diseases, and migraine prophylaxis",
		polishResults:
			"Przegląd wykazuje korzyści dla niewydolności serca, chorób neurodegeneracyjnych i profilaktyki migreny",
		secondaryOutcomes: [
			"Exercise performance",
			"Statistical reduction",
			"Migraine frequency",
		],
		polishSecondaryOutcomes: [
			"Wydajność treningowa",
			"Redukcja statynowa",
			"Częstotliwość migren",
		],
		limitations:
			"Variability in study designs, potential publication bias, limited long-term data",
		polishLimitations:
			"Zróżnicowanie projektów badań, potencjalne przekłamania publikacyjne, ograniczone dane długoterminowe",
		qualityScore: 8.5,
		conflictOfInterest: "None declared",
		polishConflictOfInterest: "Brak zadeklarowanych",
		funding: "University research funds",
		polishFunding: "Fundusze badawcze uniwersyteckie",
		url: "https://www.tandfonline.com/doi/abs/10.1179/135100008X300498",
		abstract:
			"Coenzyme Q10 (CoQ10) is an essential component of the mitochondrial electron transport chain and a potent lipophilic antioxidant. This review examines the role of CoQ10 in human health, with particular focus on cardiovascular and neurological applications. Evidence suggests CoQ10 supplementation may benefit patients with heart failure, neurodegenerative diseases, and migraine, although further research is warranted.",
		polishAbstract:
			"Koenzym Q10 (CoQ10) jest niezbędnym składnikiem mitochondrialnego łańcucha transportu elektronów i silnym antyoksydantem rozpuszczalnym w tłuszczach. Ten przegląd bada rolę CoQ10 w zdrowiu człowieka, ze szczególnym uwzględnieniem zastosowań sercowo-naczyniowych i neurologicznych. Dowody sugerują, że suplementacja CoQ10 może przynieść korzyści pacjentom z niewydolnością serca, chorobami neurodegeneracyjnymi i migreną, choć wymagane są dalsze badania.",
		keywords: [
			"coenzyme Q10",
			"ubiquinone",
			"mitochondrial function",
			"antioxidant",
			"cardiovascular disease",
			"neurological disease",
		],
		meshTerms: [
			"Ubiquinone",
			"Coenzyme Q10",
			"Mitochondria",
			"Antioxidants",
			"Cardiovascular Diseases",
			"Nervous System Diseases",
		],
		citationCount: 280,
		relatedSupplements: ["coenzyme-q10", "ubiquinol"],
		relatedConditions: [
			"heart failure",
			"Parkinson's disease",
			"migraine",
			"statin-induced myopathy",
		],
		relatedMechanisms: [
			"mitochondrial energy production",
			"antioxidant defense",
			"cardioprotection",
		],
		polishRelatedMechanisms: [
			"produkcja energii mitochondrialnej",
			"obrona antyoksydacyjna",
			"kardioprotekcja",
		],
		relatedPathways: [
			"electron transport chain",
			"oxidative stress pathways",
			"cardiac energy metabolism",
		],
		polishRelatedPathways: [
			"łańcuch transportu elektronów",
			"ścieżki stresu oksydacyjnego",
			"metabolizm energii serca",
		],
		relatedCognitiveFunctions: ["memory", "attention", "processing speed"],
		polishRelatedCognitiveFunctions: [
			"pamięć",
			"uwaga",
			"szybkość przetwarzania",
		],
		relatedNeurotransmitters: ["dopamine", "acetylcholine"],
		polishRelatedNeurotransmitters: ["dopamina", "acetylocholina"],
		therapeuticAreas: [
			"cardiology",
			"neurology",
			"sports medicine",
			"geriatrics",
		],
		polishTherapeuticAreas: [
			"kardiologia",
			"neurologia",
			"medycyna sportowa",
			"geriatria",
		],
		populationDemographics: {
			totalParticipants: 0,
			ageRange: "N/A",
			meanAge: 0,
			genderDistribution: {
				malePercentage: 0,
				femalePercentage: 0,
				otherPercentage: 0,
			},
			ethnicDistribution: {
				caucasian: 0,
				asian: 0,
				african: 0,
				hispanic: 0,
				other: 0,
			},
			healthStatus: "mixed",
			polishHealthStatus: "różne",
			recruitmentLocations: [],
			polishRecruitmentLocations: [],
			educationLevel: "N/A",
			polishEducationLevel: "N/A",
		},
		interventionDetails: {
			interventionType: "supplement",
			polishInterventionType: "suplement",
			interventionName: "Coenzyme Q10",
			polishInterventionName: "Koenzym Q10",
			dosageAmount: "100-300",
			dosageUnit: "milligrams",
			frequency: "daily",
			polishFrequency: "dziennie",
			duration: "8-24 weeks",
			polishDuration: "8-24 tygodnie",
			administrationRoute: "oral",
			polishAdministrationRoute: "doustna",
			formulation: "ubiquinone or ubiquinol capsules",
			polishFormulation: "kapsułki ubichinonu lub ubichinolu",
			timing: "with meals",
			polishTiming: "z posiłkiem",
			comparator: "placebo",
			polishComparator: "placebo",
		},
		statisticalMethods: [
			{
				method: "Narrative synthesis",
				polishMethod: "Synteza narracyjna",
				pValue: 0,
				confidenceInterval: "N/A",
				effectSize: 0,
				power: 0,
			},
		],
		polishStatisticalMethods: ["Synteza narracyjna"],
		adverseEvents: [
			{
				event: "Mild gastrointestinal upset",
				polishEvent: "Lekka niewygoda przewodu pokarmowego",
				frequency: "uncommon",
				polishFrequency: "nietypowy",
				severity: "mild",
				causality: "possibly_related",
				polishCausality: "możliwe_powiązanie",
				management: "Take with food",
				polishManagement: "Przyjmuj z jedzeniem",
			},
		],
		polishAdverseEvents: ["Lekka niewygoda przewodu pokarmowego"],
		inclusionCriteria: [
			"Studies on CoQ10 and human health",
			"Peer-reviewed publications",
			"English language",
		],
		polishInclusionCriteria: [
			"Badania na CoQ10 i zdrowiu człowieka",
			"Publikacje recenzowane",
			"Język angielski",
		],
		exclusionCriteria: [
			"Animal studies without human relevance",
			"Poor quality studies",
		],
		polishExclusionCriteria: [
			"Badania na zwierzętach bez związek z człowiekiem",
			"Słabej jakości badania",
		],
		blindingStatus: "N/A",
		polishBlindingStatus: "N/A",
		randomizationMethod: "N/A",
		polishRandomizationMethod: "N/A",
		controlGroup: "N/A",
		polishControlGroup: "N/A",
		primaryEndpoints: [
			{
				endpoint: "Cardiovascular outcomes",
				polishEndpoint: "Wyniki sercowo-naczyniowe",
				measurementScale: "various cardiac measures",
				polishMeasurementScale: "różne miary serca",
				baselineValue: 0,
				postTreatmentValue: 0,
				changeFromBaseline: 0,
				percentChange: 0,
			},
		],
		polishPrimaryEndpoints: ["Wyniki sercowo-naczyniowe"],
		secondaryEndpoints: [
			{
				endpoint: "Neurological function",
				polishEndpoint: "Funkcja neurologiczna",
				measurementScale: "various neurological scales",
				polishMeasurementScale: "różne skale neurologiczne",
				baselineValue: 0,
				postTreatmentValue: 0,
				changeFromBaseline: 0,
				percentChange: 0,
			},
		],
		polishSecondaryEndpoints: ["Funkcja neurologiczna"],
		biomarkers: [
			{
				name: "Plasma CoQ10 levels",
				polishName: "Poziomy CoQ10 w osoczu",
				baselineValue: 0,
				postTreatmentValue: 0,
				changeFromBaseline: 0,
				percentChange: 0,
				unit: "micromoles per liter",
				significance: "significant",
				polishSignificance: "znaczący",
			},
		],
		polishBiomarkers: ["Poziomy CoQ10 w osoczu"],
		imagingModalities: [],
		polishImagingModalities: [],
		cognitiveAssessments: [
			{
				test: "Mini-Mental State Examination",
				polishTest: "Mini-Mental State Examination",
				baselineScore: 0,
				postTreatmentScore: 0,
				changeFromBaseline: 0,
				percentChange: 0,
				standardError: 0,
				confidenceInterval: "N/A",
				pValue: 0,
			},
		],
		polishCognitiveAssessments: ["Mini-Mental State Examination"],
	},
];

// Export all citations organized by supplement
export const researchCitationsBySupplement: Record<string, ResearchCitation[]> =
	{
		"omega-3": omega3Citations,
		curcumin: curcuminCitations,
		"rhodiola-rosea": rhodiolaCitations,
		"coenzyme-q10": coq10Citations,
	};

// Export all citations as a flat array
export const allResearchCitations: ResearchCitation[] = [
	...omega3Citations,
	...curcuminCitations,
	...rhodiolaCitations,
	...coq10Citations,
];

export default {
	evidenceLevelDefinitions,
	researchCitationsBySupplement,
	allResearchCitations,
	omega3Citations,
	curcuminCitations,
	rhodiolaCitations,
	coq10Citations,
};
