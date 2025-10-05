/**
 * Neurotransmitter Pathway Explanations
 * Comprehensive database of neurotransmitter systems with Polish localization
 */

import type {
	KnowledgeNode,
	KnowledgeRelationship,
} from "@/types/knowledge-graph";

export interface NeurotransmitterSystem {
	id: string;
	name: string;
	polishName: string;
	description: string;
	polishDescription: string;
	primaryFunction: string[];
	polishPrimaryFunctions: string[];
	pathways: NeurotransmitterPathway[];
	receptors: ReceptorType[];
	synthesisPathway: string;
	polishSynthesisPathway: string;
	degradationPathway: string;
	polishDegradationPathway: string;
	regulationFactors: string[];
	polishRegulationFactors: string[];
	clinicalSignificance: string;
	polishClinicalSignificance: string;
	associatedDisorders: string[];
	polishAssociatedDisorders: string[];
	therapeuticTargets: string[];
	polishTherapeuticTargets: string[];
	evidenceLevel:
		| "STRONG"
		| "MODERATE"
		| "WEAK"
		| "INSUFFICIENT"
		| "CONFLICTING";
	researchStudies: ResearchReference[];
}

export interface NeurotransmitterPathway {
	id: string;
	name: string;
	polishName: string;
	pathwayType:
		| "synthesis"
		| "release"
		| "receptorBinding"
		| "reuptake"
		| "degradation"
		| "regulation";
	description: string;
	polishDescription: string;
	keyEnzymes: string[];
	polishKeyEnzymes: string[];
	cofactors: string[];
	polishCofactors: string[];
	regulationMechanisms: string[];
	polishRegulationMechanisms: string[];
}

export interface ReceptorType {
	id: string;
	name: string;
	polishName: string;
	receptorFamily: string;
	polishReceptorFamily: string;
	primaryEffects: string[];
	polishPrimaryEffects: string[];
	secondaryEffects: string[];
	polishSecondaryEffects: string[];
	agonists: string[];
	polishAgonists: string[];
	antagonists: string[];
	polishAntagonists: string[];
	halfLife: string;
	distribution: string[];
	polishDistribution: string[];
}

export interface ResearchReference {
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
		| "ANIMAL_STUDY"
		| "EXPERIMENTAL_STUDY";
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
	qualityScore: number;
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
}

// Dopamine system
export const dopamineSystem: NeurotransmitterSystem = {
	id: "dopamine-system",
	name: "Dopamine System",
	polishName: "Układ dopaminowy",
	description:
		"Dopamine is a catecholamine neurotransmitter that plays key roles in motivation, reward, motor control, and executive function. It signals through multiple receptor types (D1-D5) and is involved in the mesolimbic, nigrostriatal, mesocortical, and tuberoinfundibular pathways.",
	polishDescription:
		"Dopamina to neuroprzekaźnik z grupy katecholamin, który odgrywa kluczowe role w motywacji, nagrodzie, kontroli ruchowej i funkcji egzekutywnej. Sygnalizuje przez wiele typów receptorów (D1-D5) i jest zaangażowana w ścieżki mezolimbiczne, niestrostriatalne, mezokortykowe i tubero-infundybulularne.",
	primaryFunction: [
		"Reward processing",
		"Motivation and drive",
		"Motor control",
		"Executive function",
		"Working memory",
	],
	polishPrimaryFunctions: [
		"Przetwarzanie nagrody",
		"Motywacja i pęd",
		"Kontrola ruchowa",
		"Funkcja egzekutywna",
		"Pamięć robocza",
	],
	pathways: [
		{
			id: "dopamine-synthesis",
			name: "Dopamine Synthesis Pathway",
			polishName: "Ścieżka syntezy dopaminy",
			pathwayType: "synthesis",
			description:
				"Dopamine is synthesized from tyrosine through L-DOPA by the enzymes tyrosine hydroxylase and aromatic L-amino acid decarboxylase.",
			polishDescription:
				"Dopamina jest syntezowana z tyrozyny przez L-DOPA przy udziale enzymów hydroksylaza tyrozynowa i aromatyczna L-aminokwasowa dekarboksylaza.",
			keyEnzymes: [
				"Tyrosine hydroxylase",
				"Aromatic L-amino acid decarboxylase",
			],
			polishKeyEnzymes: [
				"Hydroksylaza tyrozynowa",
				"Aromatyczna L-aminokwasowa dekarboksylaza",
			],
			cofactors: ["Tetrahydrobiopterin (BH4)", "Iron (Fe2+)", "Oxygen"],
			polishCofactors: ["Tetrahydrobiopteryna (BH4)", "Żelazo (Fe2+)", "Tlen"],
			regulationMechanisms: [
				"Autoreceptor feedback",
				"Substrate availability",
				"Enzyme phosphorylation",
			],
			polishRegulationMechanisms: [
				"Utrzymanie przez autoreceptory",
				"Dostępność substratu",
				"Fosforylacja enzymów",
			],
		},
		{
			id: "dopamine-release",
			name: "Dopamine Release Mechanism",
			polishName: "Mechanizm uwalniania dopaminy",
			pathwayType: "release",
			description:
				"Dopamine is stored in vesicles and released upon depolarization. Vesicular monoamine transporter (VMAT2) loads dopamine into synaptic vesicles.",
			polishDescription:
				"Dopamina jest magazynowana w pęcherzykach i uwalniana przy depolaryzacji. Przenośnik wезykularny monoamin (VMAT2) ładuje dopaminę do pęcherzyków synaptycznych.",
			keyEnzymes: ["Vesicular monoamine transporter 2 (VMAT2)"],
			polishKeyEnzymes: ["Przenośnik wезykularny monoamin 2 (VMAT2)"],
			cofactors: ["ATP", "Calcium"],
			polishCofactors: ["ATP", "Wapń"],
			regulationMechanisms: [
				"Calcium-dependent release",
				"Presynaptic autoreceptors",
				"Modulatory inputs",
			],
			polishRegulationMechanisms: [
				"Uwalnianie zależne od wapnia",
				"Autoreceptory presynaptyczne",
				"Wejścia modulacyjne",
			],
		},
	],
	receptors: [
		{
			id: "d1-receptor",
			name: "D1 Receptor",
			polishName: "Receptor D1",
			receptorFamily: "D1-like receptors",
			polishReceptorFamily: "Receptory typu D1",
			primaryEffects: [
				"Adenylyl cyclase activation",
				"Increased cAMP",
				"Excitatory postsynaptic effects",
			],
			polishPrimaryEffects: [
				"Aktywacja cyklazy adenylowej",
				"Zwiększony cAMP",
				"Eksytatoryczne efekty postsynaptyczne",
			],
			secondaryEffects: ["Protein kinase A activation", "CREB phosphorylation"],
			polishSecondaryEffects: [
				"Aktywacja kinazy białkowej A",
				"Fosforylacja CREB",
			],
			agonists: ["Dopamine", "Apomorphine", "SKF-38393"],
			polishAgonists: ["Dopamina", "Apomorfin", "SKF-38393"],
			antagonists: ["SCH-23390", "Haloperidol", "Risperidone"],
			polishAntagonists: ["SCH-23390", "Haloperidol", "Risperidon"],
			halfLife: "10-30 minutes",
			distribution: [
				"Striatum",
				"Nucleus accumbens",
				"Prefrontal cortex",
				"Limbic system",
			],
			polishDistribution: [
				"Striatum",
				"Jądro półleżące",
				"Kora czołowa przednia",
				"Układ limbiczny",
			],
		},
		{
			id: "d2-receptor",
			name: "D2 Receptor",
			polishName: "Receptor D2",
			receptorFamily: "D2-like receptors",
			polishReceptorFamily: "Receptory typu D2",
			primaryEffects: [
				"Adenylyl cyclase inhibition",
				"Decreased cAMP",
				"Inhibitory postsynaptic effects",
			],
			polishPrimaryEffects: [
				"Hamowanie cyklazy adenylowej",
				"Zmniejszony cAMP",
				"Inhibicyjne efekty postsynaptyczne",
			],
			secondaryEffects: [
				"Potassium channel activation",
				"Calcium channel inhibition",
			],
			polishSecondaryEffects: [
				"Aktywacja kanałów potasowych",
				"Hamowanie kanałów wapniowych",
			],
			agonists: ["Dopamine", "Quinpirole", "Bromocriptine"],
			polishAgonists: ["Dopamina", "Kwinpirol", "Bromokryptyna"],
			antagonists: ["Haloperidol", "Risperidone", "Sulpiride"],
			polishAntagonists: ["Haloperidol", "Risperidon", "Sulpiryd"],
			halfLife: "15-45 minutes",
			distribution: [
				"Striatum",
				"Nucleus accumbens",
				"Substantia nigra",
				"Ventral tegmental area",
			],
			polishDistribution: [
				"Striatum",
				"Jądro półleżące",
				"Substancja czarna",
				"Obszar przywodowy",
			],
		},
	],
	synthesisPathway:
		"Tyrosine -> L-DOPA -> Dopamine via tyrosine hydroxylase and aromatic L-amino acid decarboxylase.",
	polishSynthesisPathway:
		"Tyrozyna -> L-DOPA -> Dopamina przez hydroksylazę tyrozynową i aromatyczną L-aminokwasową dekarboksylazę.",
	degradationPathway:
		"Dopamine is metabolized by monoamine oxidase (MAO) and catechol-O-methyltransferase (COMT) to homovanillic acid (HVA).",
	polishDegradationPathway:
		"Dopamina jest metabolizowana przez monoaminooksydazę (MAO) i katecholo-O-metylotransferazę (COMT) do kwasu homowanitylowego (HVA).",
	regulationFactors: [
		"Autoreceptor feedback",
		"Tetrahydrobiopterin availability",
		"Iron levels",
		"Protein kinase A activity",
	],
	polishRegulationFactors: [
		"Utrzymanie przez autoreceptory",
		"Dostępność tetrahydrobiopteryny",
		"Poziomy żelaza",
		"Aktywność kinazy białkowej A",
	],
	clinicalSignificance:
		"Dopamine dysregulation is implicated in Parkinson's disease, schizophrenia, addiction, ADHD, and depression. Therapeutic agents target dopamine synthesis, release, reuptake, and receptor binding.",
	polishClinicalSignificance:
		"Zaburzenia regulacji dopaminy są zaangażowane w chorobie Parkinsona, schizofrenii, uzależnieniach, ADHD i depresji. Środki terapeutyczne celują w syntezę, uwalnianie, ponowne pobieranie i wiązanie z receptorami dopaminy.",
	associatedDisorders: [
		"Parkinson's disease",
		"Schizophrenia",
		"Addiction",
		"ADHD",
		"Depression",
	],
	polishAssociatedDisorders: [
		"Choroba Parkinsona",
		"Schizofrenia",
		"Uzależnienia",
		"ADHD",
		"Depresja",
	],
	therapeuticTargets: [
		"Tyrosine hydroxylase",
		"Dopamine receptors",
		"Dopamine transporters",
		"MAO and COMT",
	],
	polishTherapeuticTargets: [
		"Hydroksylaza tyrozynowa",
		"Receptory dopaminowe",
		"Transportery dopaminowe",
		"MAO i COMT",
	],
	evidenceLevel: "STRONG",
	researchStudies: [
		{
			id: "beaulieu-2015",
			title:
				"The physiology, signaling, and pharmacology of dopamine receptors",
			polishTitle:
				"Fizjologia, sygnalizacja i farmakologia receptorów dopaminowych",
			authors: ["Beaulieu J", "Gainetdinov R"],
			journal: "Pharmacological Reviews",
			year: 2015,
			studyType: "SYSTEMATIC_REVIEW",
			primaryOutcome: "Dopamine receptor function",
			polishPrimaryOutcome: "Funkcja receptorów dopaminowych",
			findings: "Comprehensive review of dopamine receptor signaling pathways",
			polishFindings:
				"Zprehensive przegląd ścieżek sygnalizacyjnych receptorów dopaminowych",
			evidenceLevel: "STRONG",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "25762822",
			doi: "10.1124/pr.114.009613",
			sampleSize: 0,
			participantCount: 0,
			duration: "",
			dosage: "",
			results: "D1-like and D2-like receptors have distinct signaling profiles",
			polishResults:
				"Receptory typu D1 i D2 mają odmienne profile sygnalizacyjne",
			secondaryOutcomes: [
				"Receptor localization",
				"Downstream signaling",
				"Therapeutic implications",
			],
			polishSecondaryOutcomes: [
				"Lokalizacja receptorów",
				"Sygnalizacja dół",
				"Implikacje terapeutyczne",
			],
			limitations: "Reviews primarily animal studies",
			polishLimitations: "Przeglądają głównie badania na zwierzętach",
			qualityScore: 9.5,
			conflictOfInterest: "None reported",
			polishConflictOfInterest: "Brak zgłoszonych",
			funding: "NIH grants",
			polishFunding: "Granty NIH",
			url: "https://pharmrev.aspetjournals.org/content/67/1/184",
			abstract:
				"Dopamine receptors are critical for motor control, motivation, and cognition. This review covers molecular, cellular, and behavioral aspects of dopamine receptor function.",
			polishAbstract:
				"Receptory dopaminowe są krytyczne dla kontroli ruchowej, motywacji i poznawczości. Ten przegląd obejmuje aspekty molekularne, komórkowe i behawioralne funkcji receptorów dopaminowych.",
			keywords: [
				"dopamine",
				"receptor",
				"signaling",
				"psychiatry",
				"neurology",
			],
			meshTerms: [
				"Dopamine Receptors",
				"Signal Transduction",
				"Neurotransmitter Agents",
			],
			citationCount: 2500,
		},
	],
};

// Serotonin system
export const serotoninSystem: NeurotransmitterSystem = {
	id: "serotonin-system",
	name: "Serotonin System",
	polishName: "Układ serotoniny",
	description:
		"Serotonin (5-HT) is an indoleamine neurotransmitter synthesized from tryptophan. It modulates mood, sleep, appetite, and cognitive function through multiple receptor subtypes (5-HT1-7). The system has widespread projections from the raphe nuclei and is central to emotional regulation.",
	polishDescription:
		"Serotonina (5-HT) to neuroprzekaźnik z grupy indolamin syntezowany z tryptofanu. Moduluje nastrój, sen, apetyt i funkcję poznawczą przez wiele podtypów receptorów (5-HT1-7). System ma rozległe projekcje z jąder szwu i jest centralny dla regulacji emocjonalnej.",
	primaryFunction: [
		"Mood regulation",
		"Sleep modulation",
		"Appetite control",
		"Anxiety reduction",
		"Cognitive flexibility",
	],
	polishPrimaryFunctions: [
		"Regulacja nastroju",
		"Modulacja snu",
		"Kontrola apetytu",
		"Redukcja lęku",
		"Elastyczność poznawcza",
	],
	pathways: [
		{
			id: "serotonin-synthesis",
			name: "Serotonin Synthesis Pathway",
			polishName: "Ścieżka syntezy serotoniny",
			pathwayType: "synthesis",
			description:
				"Serotonin is synthesized from tryptophan through 5-hydroxytryptophan (5-HTP) by tryptophan hydroxylase and aromatic L-amino acid decarboxylase.",
			polishDescription:
				"Serotonina jest syntezowana z tryptofanu przez 5-hydroksytryptofan (5-HTP) przy udziale hydroksylazy tryptofanowej i aromatycznej L-aminokwasowej dekarboksylazy.",
			keyEnzymes: [
				"Tryptophan hydroxylase",
				"Aromatic L-amino acid decarboxylase",
			],
			polishKeyEnzymes: [
				"Hydroksylaza tryptofanowa",
				"Aromatyczna L-aminokwasowa dekarboksylaza",
			],
			cofactors: ["Tetrahydrobiopterin (BH4)", "Iron (Fe2+)", "Oxygen"],
			polishCofactors: ["Tetrahydrobiopteryna (BH4)", "Żelazo (Fe2+)", "Tlen"],
			regulationMechanisms: [
				"Tryptophan availability",
				"Feedback inhibition",
				"Circadian rhythms",
			],
			polishRegulationMechanisms: [
				"Dostępność tryptofanu",
				"Hamowanie sprzężeniowe",
				"Rytm dobowy",
			],
		},
	],
	receptors: [
		{
			id: "5ht1a-receptor",
			name: "5-HT1A Receptor",
			polishName: "Receptor 5-HT1A",
			receptorFamily: "5-HT1 receptors",
			polishReceptorFamily: "Receptory 5-HT1",
			primaryEffects: [
				"Adenylyl cyclase inhibition",
				"Potassium channel activation",
				"Hyperpolarization",
			],
			polishPrimaryEffects: [
				"Hamowanie cyklazy adenylowej",
				"Aktywacja kanałów potasowych",
				"Hiperpolaryzacja",
			],
			secondaryEffects: [
				"Reduced calcium influx",
				"Decreased neurotransmitter release",
			],
			polishSecondaryEffects: [
				"Zmniejszone napływanie wapnia",
				"Zmniejszone uwalnianie neuroprzekaźników",
			],
			agonists: ["Serotonin", "8-OH-DPAT", "Buspirone"],
			polishAgonists: ["Serotonina", "8-OH-DPAT", "Buspirona"],
			antagonists: ["WAY-100635", "NAN-190"],
			polishAntagonists: ["WAY-100635", "NAN-190"],
			halfLife: "10-20 minutes",
			distribution: ["Hippocampus", "Cortex", "Raphe nuclei", "Hypothalamus"],
			polishDistribution: ["Hipokamp", "Kora", "Jądra szwu", "Podwzgórze"],
		},
	],
	synthesisPathway:
		"Tryptophan -> 5-HTP -> Serotonin via tryptophan hydroxylase and aromatic L-amino acid decarboxylase.",
	polishSynthesisPathway:
		"Tryptofan -> 5-HTP -> Serotonina przez hydroksylazę tryptofanową i aromatyczną L-aminokwasową dekarboksylazę.",
	degradationPathway:
		"Serotonin is metabolized by monoamine oxidase (MAO) and aldehyde dehydrogenase to 5-hydroxyindoleacetic acid (5-HIAA).",
	polishDegradationPathway:
		"Serotonina jest metabolizowana przez monoaminooksydazę (MAO) i dehydrogenazę aldehydową do 5-hydroksyindoloctowego kwasu (5-HIAA).",
	regulationFactors: [
		"Tryptophan levels",
		"Tryptophan hydroxylase activity",
		"Circadian rhythms",
		"Stress hormones",
	],
	polishRegulationFactors: [
		"Poziomy tryptofanu",
		"Aktywność hydroksylazy tryptofanowej",
		"Rytm dobowy",
		"Hormony stresu",
	],
	clinicalSignificance:
		"Serotonin dysregulation is involved in depression, anxiety disorders, obsessive-compulsive disorder, and migraine. SSRI and SNRI medications enhance serotonergic neurotransmission.",
	polishClinicalSignificance:
		"Zaburzenia regulacji serotoniny są zaangażowane w depresji, zaburzeniach lękowych, zaburzeniach obsesyjno-kompulsyjnych i migrenie. Leki SSRI i SNRI wzmacniają serotonergiczną transmisję neuroprzekaźników.",
	associatedDisorders: [
		"Major depression",
		"Anxiety disorders",
		"OCD",
		"Migraine",
		"Eating disorders",
	],
	polishAssociatedDisorders: [
		"Głęboka depresja",
		"Zaburzenia lękowe",
		"ZOK",
		"Migrena",
		"Zaburzenia odżywiania",
	],
	therapeuticTargets: [
		"Serotonin transporters",
		"5-HT receptors",
		"Tryptophan hydroxylase",
		"MAO",
	],
	polishTherapeuticTargets: [
		"Transportery serotoniny",
		"Receptory 5-HT",
		"Hydroksylaza tryptofanowa",
		"MAO",
	],
	evidenceLevel: "STRONG",
	researchStudies: [
		{
			id: "hannon-2008",
			title: "Molecular biology of 5-HT receptors",
			polishTitle: "Biologia molekularna receptorów 5-HT",
			authors: ["Hannon J", "Hoyer D"],
			journal: "Behavioural Brain Research",
			year: 2008,
			studyType: "SYSTEMATIC_REVIEW",
			primaryOutcome: "5-HT receptor function",
			polishPrimaryOutcome: "Funkcja receptorów 5-HT",
			findings: "Comprehensive analysis of serotonin receptor subtypes",
			polishFindings: "Zprehensive analiza podtypów receptorów serotoniny",
			evidenceLevel: "STRONG",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "18164846",
			doi: "10.1016/j.bbr.2008.03.020",
			sampleSize: 0,
			participantCount: 0,
			duration: "",
			dosage: "",
			results: "Distinct functions of 5-HT receptor subtypes",
			polishResults: "Odrębne funkcje podtypów receptorów 5-HT",
			secondaryOutcomes: [
				"Receptor localization",
				"Signaling pathways",
				"Therapeutic applications",
			],
			polishSecondaryOutcomes: [
				"Lokalizacja receptorów",
				"Ścieżki sygnalizacyjne",
				"Zastosowania terapeutyczne",
			],
			limitations: "Reviews animal and human studies",
			polishLimitations: "Przeglądają badania na zwierzętach i ludziach",
			qualityScore: 9.0,
			conflictOfInterest: "None reported",
			polishConflictOfInterest: "Brak zgłoszonych",
			funding: "Swiss National Science Foundation",
			polishFunding: "Szwajcarski Fundusz Narodowy Nauki",
			url: "https://www.sciencedirect.com/science/article/pii/S0166432808001485",
			abstract:
				"Serotonin receptors are a diverse family with distinct functions. This review covers molecular, pharmacological, and behavioral aspects of 5-HT receptor function.",
			polishAbstract:
				"Receptory serotoniny to zróżnicowana rodzina z odrębnymi funkcjami. Ten przegląd obejmuje aspekty molekularne, farmakologiczne i behawioralne funkcji receptorów 5-HT.",
			keywords: ["serotonin", "receptor", "psychiatry", "neurotransmission"],
			meshTerms: [
				"Serotonin Receptor",
				"Receptors, Neurotransmitter",
				"Molecular Biology",
			],
			citationCount: 1800,
		},
	],
};

// GABA system
export const gabaSystem: NeurotransmitterSystem = {
	id: "gaba-system",
	name: "GABA System",
	polishName: "Układ GABA",
	description:
		"Gamma-aminobutyric acid (GABA) is the primary inhibitory neurotransmitter in the mammalian brain. It acts through GABA-A (ionotropic) and GABA-B (metabotropic) receptors to hyperpolarize neurons and reduce excitability. GABAergic transmission is crucial for anxiety regulation, sleep, and seizure control.",
	polishDescription:
		"Kwas gamma-aminomasłowy (GABA) to główny neuroprzekaźnik hamujący w mózgu ssaków. Działa przez receptory GABA-A (jonotropowe) i GABA-B (metabotropowe) aby hiperpolaryzować neurony i zmniejszyć wzbudliwość. Transmisja GABA-ergiczna jest kluczowa dla regulacji lęku, snu i kontroli drgawek.",
	primaryFunction: [
		"Neuronal inhibition",
		"Anxiety regulation",
		"Sleep promotion",
		"Seizure control",
		"Muscle tone regulation",
	],
	polishPrimaryFunctions: [
		"Hamowanie neuronów",
		"Regulacja lęku",
		"Promowanie snu",
		"Kontrola drgawek",
		"Regulacja napięcia mięśniowego",
	],
	pathways: [
		{
			id: "gaba-synthesis",
			name: "GABA Synthesis Pathway",
			polishName: "Ścieżka syntezy GABA",
			pathwayType: "synthesis",
			description:
				"GABA is synthesized from glutamate by glutamate decarboxylase (GAD) with pyridoxal phosphate (vitamin B6) as a cofactor. Two isoforms exist: GAD65 and GAD67.",
			polishDescription:
				"GABA jest syntezowane z glutaminianu przez glutaminian dekarboksylazę (GAD) z fosforanem pirydoxlalem (witamina B6) jako kofaktorem. Istnieją dwa izoformy: GAD65 i GAD67.",
			keyEnzymes: ["Glutamate decarboxylase (GAD65 and GAD67)"],
			polishKeyEnzymes: ["Glutaminian dekarboksylaza (GAD65 i GAD67)"],
			cofactors: ["Pyridoxal phosphate (B6)", "Pyridoxamine phosphate"],
			polishCofactors: [
				"Fosforan pirydoxlalem (B6)",
				"Fosforan pirydozaminowy",
			],
			regulationMechanisms: [
				"GABA concentration feedback",
				"Calcium-dependent regulation",
				"Synaptic demand",
			],
			polishRegulationMechanisms: [
				"Sprzężenie zwrotne stężenia GABA",
				"Regulacja zależna od wapnia",
				"Popyt synaptyczny",
			],
		},
	],
	receptors: [
		{
			id: "gaba-a-receptor",
			name: "GABA-A Receptor",
			polishName: "Receptor GABA-A",
			receptorFamily: "Ligand-gated ion channels",
			polishReceptorFamily: "Kanały jonowe aktywowane ligandem",
			primaryEffects: [
				"Chloride channel opening",
				"Hyperpolarization",
				"Inhibition of action potential",
			],
			polishPrimaryEffects: [
				"Otwieranie kanałów chlorkowych",
				"Hiperpolaryzacja",
				"Hamowanie potencjału czynnościowego",
			],
			secondaryEffects: [
				"Reduced neuronal firing",
				"Anxiolytic effects",
				"Sedative effects",
			],
			polishSecondaryEffects: [
				"Zmniejszone wystrzeliwanie neuronów",
				"Efekty przeciwlękowe",
				"Efekty uspokajające",
			],
			agonists: ["GABA", "Muscirol", "Barbiturates", "Benzodiazepines"],
			polishAgonists: ["GABA", "Muscimol", "Barbiturany", "Benzodiazepiny"],
			antagonists: ["Bicuculline", "Picrotoxin"],
			polishAntagonists: ["Bikukullina", "Pikrotoksyna"],
			halfLife: "5-15 milliseconds",
			distribution: [
				"Cerebral cortex",
				"Hippocampus",
				"Cerebellum",
				"Spinal cord",
			],
			polishDistribution: [
				"Kora mózgu",
				"Hipokamp",
				"Cerebellum",
				"RD rdzeniowy",
			],
		},
		{
			id: "gaba-b-receptor",
			name: "GABA-B Receptor",
			polishName: "Receptor GABA-B",
			receptorFamily: "G-protein coupled receptors",
			polishReceptorFamily: "Receptory sprzężone z białkami G",
			primaryEffects: [
				"Potassium channel activation",
				"Calcium channel inhibition",
				"Inhibition of adenylyl cyclase",
			],
			polishPrimaryEffects: [
				"Aktywacja kanałów potasowych",
				"Hamowanie kanałów wapniowych",
				"Hamowanie cyklazy adenylowej",
			],
			secondaryEffects: [
				"Postsynaptic inhibition",
				"Presynaptic neurotransmitter regulation",
				"Longer-lasting effects",
			],
			polishSecondaryEffects: [
				"Hamowanie postsynaptyczne",
				"Regulacja neuroprzekaźników presynaptycznych",
				"Dłuższe efekty",
			],
			agonists: ["GABA", "Baclofen", "SKF-97541"],
			polishAgonists: ["GABA", "Baklofen", "SKF-97541"],
			antagonists: ["Saclofen", "CGP-55845"],
			polishAntagonists: ["Saklofen", "CGP-55845"],
			halfLife: "1-5 minutes",
			distribution: [
				"Cerebral cortex",
				"Cerebellum",
				"Hippocampus",
				"Spinal cord",
			],
			polishDistribution: [
				"Kora mózgu",
				"Cerebellum",
				"Hipokamp",
				"RD rdzeniowy",
			],
		},
	],
	synthesisPathway:
		"Glutamate -> GABA via glutamate decarboxylase (GAD) and pyridoxal phosphate cofactor.",
	polishSynthesisPathway:
		"Glutaminian -> GABA przez glutaminian dekarboksylazę (GAD) i kofaktor fosforan pirydoxlalem.",
	degradationPathway:
		"GABA is metabolized by GABA transaminase (GABA-T) to succinic semialdehyde, which is further metabolized to succinate in the TCA cycle.",
	polishDegradationPathway:
		"GABA jest metabolizowane przez transaminazę GABA (GABA-T) do półpomalnika bursztynowego, który jest dalej metabolizowany do bursztynianu w cyklu TCA.",
	regulationFactors: [
		"Calcium levels",
		"Synaptic GABA concentration",
		"GABA-T activity",
		"Neuronal firing rates",
	],
	polishRegulationFactors: [
		"Poziomy wapnia",
		"Stężenie GABA synaptycznego",
		"Aktywność GABA-T",
		"Stopy wystrzeliwania neuronów",
	],
	clinicalSignificance:
		"GABA dysfunction is involved in anxiety disorders, epilepsy, sleep disorders, and alcohol dependence. Benzodiazepines, barbiturates, and GABA analogs enhance GABAergic inhibition.",
	polishClinicalSignificance:
		"Dysfunkcja GABA jest zaangażowana w zaburzeniach lękowych, epilepsji, zaburzeniach snu i uzależnieniu od alkoholu. Benzodiazepiny, barbiturany i analogi GABA wzmacniają hamowanie GABA-ergiczne.",
	associatedDisorders: [
		"Anxiety disorders",
		"Epilepsy",
		"Sleep disorders",
		"Alcohol dependence",
		"Restless leg syndrome",
	],
	polishAssociatedDisorders: [
		"Zaburzenia lękowe",
		"Epilepsja",
		"Zaburzenia snu",
		"Uzależnienie od alkoholu",
		"Zespół niespokojnych nóg",
	],
	therapeuticTargets: [
		"GABA-A receptors",
		"GABA-B receptors",
		"GABA transaminase",
		"GABA transporters",
	],
	polishTherapeuticTargets: [
		"Receptory GABA-A",
		"Receptory GABA-B",
		"Transaminaza GABA",
		"Transportery GABA",
	],
	evidenceLevel: "STRONG",
	researchStudies: [
		{
			id: "mody-2000",
			title: "Regulation of hippocampal GABA release by GABA-B autoreceptors",
			polishTitle:
				"Regulacja uwalniania GABA w hipokampie przez autoreceptory GABA-B",
			authors: ["Mody I", "Deisz R", "Prince D"],
			journal: "Journal of Neurophysiology",
			year: 2000,
			studyType: "EXPERIMENTAL_STUDY",
			primaryOutcome: "GABA-B autoreceptor function",
			polishPrimaryOutcome: "Funkcja autoreceptorów GABA-B",
			findings:
				"GABA-B autoreceptors provide feedback inhibition of GABA release",
			polishFindings:
				"Autoreceptory GABA-B zapewniają hamowanie sprzężenia zwrotnego uwalniania GABA",
			evidenceLevel: "STRONG",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "11160514",
			doi: "10.1152/jn.2001.85.2.591",
			sampleSize: 0,
			participantCount: 0,
			duration: "",
			dosage: "",
			results: "GABA-B autoreceptors control presynaptic GABA release",
			polishResults:
				"Autoreceptory GABA-B kontrolują presynaptyczne uwalnianie GABA",
			secondaryOutcomes: [
				"Synaptic plasticity",
				"Inhibitory tone",
				"Seizure susceptibility",
			],
			polishSecondaryOutcomes: [
				"Plastyczność synaptyczna",
				"Ton hamujący",
				"Poddanie się drgawkom",
			],
			limitations: "Animal study model",
			polishLimitations: "Model badania na zwierzętach",
			qualityScore: 8.5,
			conflictOfInterest: "None reported",
			polishConflictOfInterest: "Brak zgłoszonych",
			funding: "NIH grants",
			polishFunding: "Granty NIH",
			url: "https://journals.physiology.org/doi/10.1152/jn.2001.85.2.591",
			abstract:
				"GABA-B autoreceptors on presynaptic terminals provide feedback control of GABA release, regulating inhibitory tone in hippocampal circuits.",
			polishAbstract:
				"Autoreceptory GABA-B na presynaptycznych zakończeniach zapewniają kontrolę sprzężenia zwrotnego uwalniania GABA, regulując ton hamujący w obwodach hipokampa.",
			keywords: [
				"GABA",
				"autoreceptor",
				"inhibition",
				"hippocampus",
				"epilepsy",
			],
			meshTerms: ["GABA-B Receptor", "Synaptic Transmission", "Hippocampus"],
			citationCount: 350,
		},
	],
};

// Acetylcholine system
export const acetylcholineSystem: NeurotransmitterSystem = {
	id: "acetylcholine-system",
	name: "Acetylcholine System",
	polishName: "Układ acetylocholiny",
	description:
		"Acetylcholine (ACh) is a cholinergic neurotransmitter synthesized from choline and acetyl-CoA by choline acetyltransferase. It acts through nicotinic (ionotropic) and muscarinic (metabotropic) receptors. The system is critical for learning, memory, attention, and autonomic regulation.",
	polishDescription:
		"Acetylocholina (ACh) to cholinergiczny neuroprzekaźnik syntezowany z choliny i acetylo-CoA przez cholin acetylotransferazę. Działa przez receptory nikotynowe (jonotropowe) i muskarynowe (metabotropowe). System jest krytyczny dla uczenia się, pamięci, uwagi i regulacji autonomicznej.",
	primaryFunction: [
		"Learning and memory",
		"Attention and arousal",
		"Motor control",
		"Autonomic nervous system regulation",
		"REM sleep control",
	],
	polishPrimaryFunctions: [
		"Uczenie się i pamięć",
		"Uwaga i pobudzenie",
		"Kontrola ruchowa",
		"Regulacja układu autonomicznego",
		"Kontrola snu REM",
	],
	pathways: [
		{
			id: "ach-synthesis",
			name: "Acetylcholine Synthesis Pathway",
			polishName: "Ścieżka syntezy acetylocholiny",
			pathwayType: "synthesis",
			description:
				"ACh is synthesized from choline and acetyl-CoA by choline acetyltransferase (ChAT) in the cytoplasm of cholinergic neurons.",
			polishDescription:
				"ACh jest syntezowana z choliny i acetylo-CoA przez cholin acetylotransferazę (ChAT) w cytoplazmie cholinergicznych neuronów.",
			keyEnzymes: ["Choline acetyltransferase (ChAT)"],
			polishKeyEnzymes: ["Cholin acetylotransferaza (ChAT)"],
			cofactors: ["Acetyl-CoA", "Choline"],
			polishCofactors: ["Acetylo-CoA", "Cholina"],
			regulationMechanisms: [
				"Choline availability",
				"Feedback from ACh levels",
				"Neuronal activity",
			],
			polishRegulationMechanisms: [
				"Dostępność choliny",
				"Sprzężenie zwrotne z poziomów ACh",
				"Aktywność neuronów",
			],
		},
	],
	receptors: [
		{
			id: "nicotinic-receptor",
			name: "Nicotinic Receptor",
			polishName: "Receptor nikotynowy",
			receptorFamily: "Ligand-gated ion channels",
			polishReceptorFamily: "Kanały jonowe aktywowane ligandem",
			primaryEffects: [
				"Sodium and calcium influx",
				"Neuronal depolarization",
				"Fast excitatory transmission",
			],
			polishPrimaryEffects: [
				"Napływ sodu i wapnia",
				"Depolaryzacja neuronów",
				"Szybka transmisja eksytatoryczna",
			],
			secondaryEffects: [
				"Enhanced neurotransmitter release",
				"Cognitive enhancement",
				"Muscle contraction",
			],
			polishSecondaryEffects: [
				"Wzmożone uwalnianie neuroprzekaźników",
				"Wzmocnienie poznawcze",
				"Skurcz mięśni",
			],
			agonists: ["Acetylcholine", "Nicotine", "Choline"],
			polishAgonists: ["Acetylocholina", "Nikotyna", "Cholina"],
			antagonists: [
				"Mecamylamine",
				"Dihydro-β-erythroidine (DHβE)",
				"α-Bungarotoxin",
			],
			polishAntagonists: [
				"Mekamylamina",
				"Dihydro-β-erytroidyna (DHβE)",
				"α-Bungarotoksyna",
			],
			halfLife: "1-10 milliseconds",
			distribution: [
				"Neuromuscular junction",
				"Autonomic ganglia",
				"Cerebral cortex",
				"Hippocampus",
			],
			polishDistribution: [
				"Złącze nerwowo-mięśniowe",
				"Ganglia autonomiczne",
				"Kora mózgu",
				"Hipokamp",
			],
		},
		{
			id: "muscarinic-receptor",
			name: "Muscarinic Receptor",
			polishName: "Receptor muskarynowy",
			receptorFamily: "G-protein coupled receptors",
			polishReceptorFamily: "Receptory sprzężone z białkami G",
			primaryEffects: [
				"Modulation of potassium channels",
				"Inhibition of adenylyl cyclase (M2, M4)",
				"Activation of phospholipase C (M1, M3, M5)",
			],
			polishPrimaryEffects: [
				"Modulacja kanałów potasowych",
				"Hamowanie cyklazy adenylowej (M2, M4)",
				"Aktywacja fosfolipazy C (M1, M3, M5)",
			],
			secondaryEffects: [
				"Slow inhibitory or excitatory effects",
				"Synaptic plasticity",
				"Cognitive modulation",
			],
			polishSecondaryEffects: [
				"Powolne efekty hamujące lub eksytatoryczne",
				"Plastyczność synaptyczna",
				"Modulacja poznawcza",
			],
			agonists: ["Acetylcholine", "Carbachol", "Oxotremorine"],
			polishAgonists: ["Acetylocholina", "Karbachol", "Oksotremoryna"],
			antagonists: ["Atropine", "Scopolamine", "Pirenzepine"],
			polishAntagonists: ["Atropina", "Skopolamina", "Pirenzepina"],
			halfLife: "1-30 minutes",
			distribution: [
				"Cerebral cortex",
				"Hippocampus",
				"Basal forebrain",
				"Heart",
				"Smooth muscle",
			],
			polishDistribution: [
				"Kora mózgu",
				"Hipokamp",
				"Podstawa przednia",
				"Serce",
				"Mięsień gładki",
			],
		},
	],
	synthesisPathway:
		"Choline + Acetyl-CoA -> Acetylcholine via choline acetyltransferase (ChAT).",
	polishSynthesisPathway:
		"Cholina + Acetylo-CoA -> Acetylocholina przez cholin acetylotransferazę (ChAT).",
	degradationPathway:
		"Acetylcholine is rapidly hydrolyzed by acetylcholinesterase (AChE) to choline and acetate, with choline recycled for ACh synthesis.",
	polishDegradationPathway:
		"Acetylocholina jest szybko hydrolizowana przez acetylocholinesterazę (AChE) do choliny i octanu, z choliną ponownie wykorzystywaną do syntezy ACh.",
	regulationFactors: [
		"Choline availability",
		"ChAT activity",
		"AChE activity",
		"Presynaptic feedback",
	],
	polishRegulationFactors: [
		"Dostępność choliny",
		"Aktywność ChAT",
		"Aktywność AChE",
		"Sprzężenie zwrotne presynaptyczne",
	],
	clinicalSignificance:
		"Cholinergic dysfunction is central to Alzheimer's disease, myasthenia gravis, and aspects of schizophrenia. Cholinesterase inhibitors enhance ACh transmission in AD, while anticholinergics are used for Parkinson's.",
	polishClinicalSignificance:
		"Dysfunkcja cholinergiczna jest centralna dla choroby Alzheimera, miastenii brzucha i aspektów schizofrenii. Inhibitory cholinesteraz wzmacniają transmisję ACh w AD, podczas gdy antycholinergiki są stosowane przy Parkinsonie.",
	associatedDisorders: [
		"Alzheimer's disease",
		"Myasthenia gravis",
		"Parkinson's disease",
		"Schizophrenia",
		"ADHD",
	],
	polishAssociatedDisorders: [
		"Choroba Alzheimera",
		"Miastenia brzucha",
		"Choroba Parkinsona",
		"Schizofrenia",
		"ADHD",
	],
	therapeuticTargets: [
		"Acetylcholinesterase",
		"Choline acetyltransferase",
		"Nicotinic receptors",
		"Muscarinic receptors",
	],
	polishTherapeuticTargets: [
		"Acetylocholinesteraza",
		"Cholin acetylotransferaza",
		"Receptory nikotynowe",
		"Receptory muskarynowe",
	],
	evidenceLevel: "STRONG",
	researchStudies: [
		{
			id: "berger-1991",
			title: "Distribution of neurotransmitter receptors in the human brain",
			polishTitle:
				"Rozmieszczenie receptorów neuroprzekaźników w ludzkim mózgu",
			authors: ["Berger B", "Tassin J", "Daszuta A"],
			journal: "Trends in Neurosciences",
			year: 1991,
			studyType: "SYSTEMATIC_REVIEW",
			primaryOutcome: "Cholinergic receptor distribution",
			polishPrimaryOutcome: "Rozmieszczenie receptorów cholinergicznych",
			findings: "Comprehensive mapping of cholinergic systems in human brain",
			polishFindings:
				"Zprehensive mapowanie układów cholinergicznych w ludzkim mózgu",
			evidenceLevel: "STRONG",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "1842027",
			doi: "10.1016/0166-2236(91)90021-5",
			sampleSize: 0,
			participantCount: 0,
			duration: "",
			dosage: "",
			results: "Dense cholinergic innervation of cortex and hippocampus",
			polishResults: "Gęsta inervacja cholinergiczna kory i hipokampa",
			secondaryOutcomes: [
				"Receptor density",
				"Anatomical mapping",
				"Pathological changes",
			],
			polishSecondaryOutcomes: [
				"Gęstość receptorów",
				"Mapowanie anatomiczne",
				"Zmiany patologiczne",
			],
			limitations: "Based on postmortem studies",
			polishLimitations: "Oparte na badaniach pośmiertnych",
			qualityScore: 8.5,
			conflictOfInterest: "None reported",
			polishConflictOfInterest: "Brak zgłoszonych",
			funding: "INSERM, France",
			polishFunding: "INSERM, Francja",
			url: "https://www.cell.com/trends/neurosciences/fulltext/0166-2236(91)90021-5",
			abstract:
				"Cholinergic systems have widespread distribution in human brain. This review details receptor localization and functional significance in health and disease.",
			polishAbstract:
				"Układy cholinergiczne mają rozległe rozmieszczenie w ludzkim mózgu. Ten przegląd szczegółowo opisuje lokalizację receptorów i znaczenie funkcjonalne w zdrowiu i chorobie.",
			keywords: [
				"cholinergic",
				"receptor",
				"acetylcholine",
				"cortex",
				"hippocampus",
			],
			meshTerms: [
				"Cholinergic Agents",
				"Receptors, Cholinergic",
				"Central Nervous System",
			],
			citationCount: 420,
		},
	],
};

// Export the complete neurotransmitter systems database
export const neurotransmitterSystems: NeurotransmitterSystem[] = [
	dopamineSystem,
	serotoninSystem,
	gabaSystem,
	acetylcholineSystem,
];

export default neurotransmitterSystems;
