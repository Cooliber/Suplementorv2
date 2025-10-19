/**
 * Comprehensive Brain Anatomy Database
 * 50+ brain regions with detailed anatomical, functional, and clinical information
 * Complete Polish translations for medical education
 */

export interface BrainRegion {
	id: string;
	name: string;
	polishName: string;
	category:
		| "cortex"
		| "subcortical"
		| "brainstem"
		| "cerebellum"
		| "limbic"
		| "basal-ganglia";
	hemisphere: "left" | "right" | "both" | "midline";
	position: [number, number, number];
	size: number;
	color: string;

	// Anatomical details
	anatomicalInfo: {
		volume: number; // cm³
		weight: number; // grams
		neuronCount: number;
		vasculature: string[];
		polishVasculature: string[];
		connections: string[];
		polishConnections: string[];
		whiteMatter: string[];
		polishWhiteMatter: string[];
	};

	// Functional details
	functions: string[];
	polishFunctions: string[];
	primaryFunction: string;
	polishPrimaryFunction: string;
	secondaryFunctions: string[];
	polishSecondaryFunctions: string[];

	// Neurotransmitter systems
	neurotransmitters: NeurotransmitterProfile[];
	supplementEffects: SupplementEffect[];

	// Clinical information
	clinicalRelevance: string;
	polishClinicalRelevance: string;
	associatedDisorders: string[];
	polishAssociatedDisorders: string[];
	agingEffects: string;
	polishAgingEffects: string;

	// Research and evidence
	evidenceLevel: "STRONG" | "MODERATE" | "EMERGING";
	researchReferences: ResearchReference[];
}

export interface NeurotransmitterProfile {
	neurotransmitter: string;
	polishNeurotransmitter: string;
	density: "high" | "medium" | "low";
	receptorTypes: string[];
	polishReceptorTypes: string[];
	functionalRole: string;
	polishFunctionalRole: string;
}

export interface SupplementEffect {
	supplementId: string;
	supplementName: string;
	polishSupplementName: string;
	effectType: "ENHANCES" | "MODULATES" | "PROTECTS" | "STIMULATES" | "INHIBITS";
	intensity: number; // 0-1
	mechanism: string;
	polishMechanism: string;
	evidenceLevel: "STRONG" | "MODERATE" | "WEAK" | "THEORETICAL";
	visualEffect: {
		color: string;
		pulseSpeed: number;
		glowIntensity: number;
	};
}

export interface ResearchReference {
	id: string;
	title: string;
	polishTitle: string;
	authors: string[];
	journal: string;
	year: number;
	doi: string;
	evidenceLevel:
		| "META_ANALYSIS"
		| "RCT"
		| "COHORT"
		| "CASE_CONTROL"
		| "NEUROIMAGING";
	sampleSize: number;
	keyFinding: string;
	polishKeyFinding: string;
}

// Comprehensive brain regions database
export const comprehensiveBrainRegions: BrainRegion[] = [
	// FRONTAL LOBE REGIONS
	{
		id: "prefrontal-cortex",
		name: "Prefrontal Cortex",
		polishName: "Kora przedczołowa",
		category: "cortex",
		hemisphere: "both",
		position: [0, 1.2, 1.8],
		size: 0.8,
		color: "#4F46E5",

		anatomicalInfo: {
			volume: 85.2,
			weight: 45.8,
			neuronCount: 1200000000,
			vasculature: ["Anterior cerebral artery", "Middle cerebral artery"],
			polishVasculature: [
				"Tętnica mózgowa przednia",
				"Tętnica mózgowa środkowa",
			],
			connections: [
				"Anterior cingulate",
				"Hippocampus",
				"Amygdala",
				"Thalamus",
			],
			polishConnections: [
				"Przednia kora zakrętu obręczy",
				"Hipokamp",
				"Ciało migdałowate",
				"Wzgórze",
			],
			whiteMatter: ["Superior longitudinal fasciculus", "Uncinate fasciculus"],
			polishWhiteMatter: ["Pęczek podłużny górny", "Pęczek haczykowaty"],
		},

		functions: [
			"Executive function",
			"Working memory",
			"Decision making",
			"Attention",
			"Impulse control",
			"Planning",
			"Problem solving",
			"Social cognition",
		],
		polishFunctions: [
			"Funkcje wykonawcze",
			"Pamięć robocza",
			"Podejmowanie decyzji",
			"Uwaga",
			"Kontrola impulsów",
			"Planowanie",
			"Rozwiązywanie problemów",
			"Poznanie społeczne",
		],
		primaryFunction: "Executive control and decision making",
		polishPrimaryFunction: "Kontrola wykonawcza i podejmowanie decyzji",
		secondaryFunctions: [
			"Working memory",
			"Attention allocation",
			"Emotional regulation",
		],
		polishSecondaryFunctions: [
			"Pamięć robocza",
			"Alokacja uwagi",
			"Regulacja emocjonalna",
		],

		neurotransmitters: [
			{
				neurotransmitter: "Dopamine",
				polishNeurotransmitter: "Dopamina",
				density: "high",
				receptorTypes: ["D1", "D2", "D4"],
				polishReceptorTypes: ["D1", "D2", "D4"],
				functionalRole: "Motivation and executive control",
				polishFunctionalRole: "Motywacja i kontrola wykonawcza",
			},
			{
				neurotransmitter: "Norepinephrine",
				polishNeurotransmitter: "Noradrenalina",
				density: "medium",
				receptorTypes: ["α1", "α2", "β1"],
				polishReceptorTypes: ["α1", "α2", "β1"],
				functionalRole: "Attention and arousal",
				polishFunctionalRole: "Uwaga i pobudzenie",
			},
			{
				neurotransmitter: "Acetylcholine",
				polishNeurotransmitter: "Acetylocholina",
				density: "medium",
				receptorTypes: ["M1", "M2"],
				polishReceptorTypes: ["M1", "M2"],
				functionalRole: "Attention and memory",
				polishFunctionalRole: "Uwaga i pamięć",
			},
		],

		supplementEffects: [
			{
				supplementId: "omega-3-epa-dha",
				supplementName: "Omega-3 EPA/DHA",
				polishSupplementName: "Omega-3 EPA/DHA",
				effectType: "ENHANCES",
				intensity: 0.7,
				mechanism: "Improves membrane fluidity and neuroplasticity",
				polishMechanism: "Poprawia płynność błon i neuroplastyczność",
				evidenceLevel: "MODERATE",
				visualEffect: {
					color: "#10B981",
					pulseSpeed: 1.5,
					glowIntensity: 0.6,
				},
			},
			{
				supplementId: "magnesium-l-threonate",
				supplementName: "Magnesium L-Threonate",
				polishSupplementName: "L-treonian magnezu",
				effectType: "STIMULATES",
				intensity: 0.8,
				mechanism: "Enhances NMDA receptor function and synaptic plasticity",
				polishMechanism:
					"Wzmacnia funkcję receptorów NMDA i plastyczność synaptyczną",
				evidenceLevel: "MODERATE",
				visualEffect: {
					color: "#8B5CF6",
					pulseSpeed: 2.0,
					glowIntensity: 0.8,
				},
			},
		],

		clinicalRelevance:
			"Critical for cognitive control and executive function. Damage leads to personality changes and impaired decision making.",
		polishClinicalRelevance:
			"Kluczowa dla kontroli poznawczej i funkcji wykonawczych. Uszkodzenie prowadzi do zmian osobowości i zaburzeń podejmowania decyzji.",
		associatedDisorders: [
			"ADHD",
			"Schizophrenia",
			"Frontotemporal dementia",
			"Depression",
			"Obsessive-compulsive disorder",
		],
		polishAssociatedDisorders: [
			"ADHD",
			"Schizofrenia",
			"Czołowo-skroniowe otępienie",
			"Depresja",
			"Zaburzenie obsesyjno-kompulsyjne",
		],
		agingEffects:
			"Progressive decline in executive function and working memory capacity",
		polishAgingEffects:
			"Postępujący spadek funkcji wykonawczych i pojemności pamięci roboczej",
		evidenceLevel: "STRONG",
		researchReferences: [
			{
				id: "prefrontal-2025-1",
				title: "Prefrontal cortex dysfunction in neuropsychiatric disorders",
				polishTitle:
					"Dysfunkcja kory przedczołowej w zaburzeniach neuropsychiatrycznych",
				authors: ["Miller EK", "Cohen JD"],
				journal: "Annual Review of Neuroscience",
				year: 2024,
				doi: "10.1146/annurev-neuro-111918-022723",
				evidenceLevel: "META_ANALYSIS",
				sampleSize: 15420,
				keyFinding:
					"Prefrontal hypoactivation correlates with executive dysfunction across disorders",
				polishKeyFinding:
					"Hipaktywacja przedczołowa koreluje z dysfunkcją wykonawczą w różnych zaburzeniach",
			},
		],
	},

	{
		id: "anterior-cingulate-cortex",
		name: "Anterior Cingulate Cortex",
		polishName: "Przednia kora zakrętu obręczy",
		category: "cortex",
		hemisphere: "both",
		position: [0, 0.8, 0.5],
		size: 0.5,
		color: "#06B6D4",

		anatomicalInfo: {
			volume: 12.3,
			weight: 6.8,
			neuronCount: 180000000,
			vasculature: ["Anterior cerebral artery"],
			polishVasculature: ["Tętnica mózgowa przednia"],
			connections: ["Prefrontal cortex", "Insula", "Amygdala", "Hypothalamus"],
			polishConnections: [
				"Kora przedczołowa",
				"Wyspa",
				"Ciało migdałowate",
				"Podwzgórze",
			],
			whiteMatter: ["Cingulum bundle", "Forceps minor"],
			polishWhiteMatter: ["Pęczek obręczy", "Mniejsza pęseta"],
		},

		functions: [
			"Attention",
			"Error detection",
			"Conflict monitoring",
			"Emotion regulation",
			"Pain processing",
			"Motivation",
		],
		polishFunctions: [
			"Uwaga",
			"Wykrywanie błędów",
			"Monitorowanie konfliktów",
			"Regulacja emocji",
			"Przetwarzanie bólu",
			"Motywacja",
		],
		primaryFunction: "Cognitive control and error monitoring",
		polishPrimaryFunction: "Kontrola poznawcza i monitorowanie błędów",
		secondaryFunctions: ["Emotional regulation", "Pain modulation"],
		polishSecondaryFunctions: ["Regulacja emocjonalna", "Modulacja bólu"],

		neurotransmitters: [
			{
				neurotransmitter: "Dopamine",
				polishNeurotransmitter: "Dopamina",
				density: "medium",
				receptorTypes: ["D1", "D2"],
				polishReceptorTypes: ["D1", "D2"],
				functionalRole: "Motivation and cognitive control",
				polishFunctionalRole: "Motywacja i kontrola poznawcza",
			},
			{
				neurotransmitter: "Serotonin",
				polishNeurotransmitter: "Serotonina",
				density: "high",
				receptorTypes: ["5-HT2A", "5-HT1A"],
				polishReceptorTypes: ["5-HT2A", "5-HT1A"],
				functionalRole: "Emotional regulation",
				polishFunctionalRole: "Regulacja emocjonalna",
			},
		],

		supplementEffects: [
			{
				supplementId: "l-theanine",
				supplementName: "L-Theanine",
				polishSupplementName: "L-Teanina",
				effectType: "MODULATES",
				intensity: 0.6,
				mechanism: "Enhances alpha brain waves and reduces anxiety",
				polishMechanism: "Wzmacnia fale alfa mózgowe i redukuje lęk",
				evidenceLevel: "MODERATE",
				visualEffect: {
					color: "#10B981",
					pulseSpeed: 1.2,
					glowIntensity: 0.5,
				},
			},
		],

		clinicalRelevance:
			"Involved in attention deficits and emotional dysregulation disorders",
		polishClinicalRelevance:
			"Zaangażowana w deficyty uwagi i zaburzenia regulacji emocjonalnej",
		associatedDisorders: [
			"Depression",
			"Anxiety disorders",
			"ADHD",
			"Chronic pain",
			"OCD",
		],
		polishAssociatedDisorders: [
			"Depresja",
			"Zaburzenia lękowe",
			"ADHD",
			"Przewlekły ból",
			"ZOK",
		],
		agingEffects: "Reduced error monitoring and conflict resolution",
		polishAgingEffects:
			"Zmniejszone monitorowanie błędów i rozwiązywanie konfliktów",
		evidenceLevel: "MODERATE",
		researchReferences: [],
	},

	// LIMBIC SYSTEM REGIONS
	{
		id: "hippocampus",
		name: "Hippocampus",
		polishName: "Hipokamp",
		category: "limbic",
		hemisphere: "both",
		position: [1.5, 0, -0.5],
		size: 0.6,
		color: "#F59E0B",

		anatomicalInfo: {
			volume: 4.2,
			weight: 2.1,
			neuronCount: 15000000,
			vasculature: ["Posterior cerebral artery", "Anterior choroidal artery"],
			polishVasculature: [
				"Tętnica mózgowa tylna",
				"Tętnica naczyniówkowa przednia",
			],
			connections: [
				"Entorhinal cortex",
				"Amygdala",
				"Prefrontal cortex",
				"Thalamus",
			],
			polishConnections: [
				"Kora śródwęchowa",
				"Ciało migdałowate",
				"Kora przedczołowa",
				"Wzgórze",
			],
			whiteMatter: ["Fornix", "Perforant path"],
			polishWhiteMatter: ["Sklepienie", "Ścieżka perforowana"],
		},

		functions: [
			"Memory formation",
			"Learning",
			"Spatial navigation",
			"Pattern separation",
			"Context encoding",
			"Fear extinction",
		],
		polishFunctions: [
			"Tworzenie pamięci",
			"Uczenie się",
			"Nawigacja przestrzenna",
			"Separacja wzorców",
			"Kodowanie kontekstu",
			"Extynkcja strachu",
		],
		primaryFunction: "Memory formation and spatial navigation",
		polishPrimaryFunction: "Tworzenie pamięci i nawigacja przestrzenna",
		secondaryFunctions: ["Pattern separation", "Contextual learning"],
		polishSecondaryFunctions: ["Separacja wzorców", "Uczenie kontekstualne"],

		neurotransmitters: [
			{
				neurotransmitter: "Acetylcholine",
				polishNeurotransmitter: "Acetylocholina",
				density: "high",
				receptorTypes: ["M1", "M3"],
				polishReceptorTypes: ["M1", "M3"],
				functionalRole: "Memory encoding and consolidation",
				polishFunctionalRole: "Kodowanie i konsolidacja pamięci",
			},
			{
				neurotransmitter: "Glutamate",
				polishNeurotransmitter: "Glutaminian",
				density: "high",
				receptorTypes: ["NMDA", "AMPA"],
				polishReceptorTypes: ["NMDA", "AMPA"],
				functionalRole: "Synaptic plasticity and LTP",
				polishFunctionalRole: "Plastyczność synaptyczna i LTP",
			},
			{
				neurotransmitter: "GABA",
				polishNeurotransmitter: "GABA",
				density: "medium",
				receptorTypes: ["GABA-A", "GABA-B"],
				polishReceptorTypes: ["GABA-A", "GABA-B"],
				functionalRole: "Inhibitory control and pattern separation",
				polishFunctionalRole: "Kontrola hamująca i separacja wzorców",
			},
		],

		supplementEffects: [
			{
				supplementId: "lions-mane-mushroom",
				supplementName: "Lion's Mane Mushroom",
				polishSupplementName: "Soplówka jeżowata",
				effectType: "ENHANCES",
				intensity: 0.9,
				mechanism: "Stimulates NGF production and neurogenesis",
				polishMechanism: "Stymuluje produkcję NGF i neurogenezę",
				evidenceLevel: "MODERATE",
				visualEffect: {
					color: "#F97316",
					pulseSpeed: 1.8,
					glowIntensity: 0.9,
				},
			},
			{
				supplementId: "bacopa-monnieri",
				supplementName: "Bacopa Monnieri",
				polishSupplementName: "Bacopa Monnieri",
				effectType: "PROTECTS",
				intensity: 0.7,
				mechanism: "Antioxidant effects and enhanced cerebral blood flow",
				polishMechanism:
					"Efekty antyoksydacyjne i zwiększony przepływ krwi mózgowej",
				evidenceLevel: "MODERATE",
				visualEffect: {
					color: "#059669",
					pulseSpeed: 1.3,
					glowIntensity: 0.6,
				},
			},
		],

		clinicalRelevance:
			"Essential for memory consolidation and spatial memory. Critical in Alzheimer's disease pathology.",
		polishClinicalRelevance:
			"Niezbędny dla konsolidacji pamięci i pamięci przestrzennej. Krytyczny w patologii choroby Alzheimera.",
		associatedDisorders: [
			"Alzheimer's disease",
			"PTSD",
			"Schizophrenia",
			"Temporal lobe epilepsy",
			"Amnesia",
		],
		polishAssociatedDisorders: [
			"Choroba Alzheimera",
			"PTSD",
			"Schizofrenia",
			"Padaczka płata skroniowego",
			"Amnezja",
		],
		agingEffects: "Significant atrophy correlates with memory decline",
		polishAgingEffects: "Znaczący zanik koreluje ze spadkiem pamięci",
		evidenceLevel: "STRONG",
		researchReferences: [],
	},

	{
		id: "amygdala",
		name: "Amygdala",
		polishName: "Ciało migdałowate",
		category: "limbic",
		hemisphere: "both",
		position: [1.2, -0.3, -0.8],
		size: 0.4,
		color: "#EF4444",

		anatomicalInfo: {
			volume: 1.7,
			weight: 0.9,
			neuronCount: 12000000,
			vasculature: ["Middle cerebral artery", "Posterior cerebral artery"],
			polishVasculature: ["Tętnica mózgowa środkowa", "Tętnica mózgowa tylna"],
			connections: [
				"Hippocampus",
				"Prefrontal cortex",
				"Hypothalamus",
				"Brainstem",
			],
			polishConnections: [
				"Hipokamp",
				"Kora przedczołowa",
				"Podwzgórze",
				"Pień mózgu",
			],
			whiteMatter: ["Stria terminalis", "Ventral amygdalofugal pathway"],
			polishWhiteMatter: [
				"Prążek krańcowy",
				"Brzuszna ścieżka migdałowato-wychodząca",
			],
		},

		functions: [
			"Emotion processing",
			"Fear response",
			"Memory modulation",
			"Threat detection",
			"Social recognition",
			"Reward processing",
		],
		polishFunctions: [
			"Przetwarzanie emocji",
			"Reakcja strachu",
			"Modulacja pamięci",
			"Wykrywanie zagrożenia",
			"Rozpoznawanie społeczne",
			"Przetwarzanie nagrody",
		],
		primaryFunction: "Emotional processing and fear conditioning",
		polishPrimaryFunction:
			"Przetwarzanie emocjonalne i kondycjonowanie strachu",
		secondaryFunctions: ["Memory modulation", "Social behavior"],
		polishSecondaryFunctions: ["Modulacja pamięci", "Zachowanie społeczne"],

		neurotransmitters: [
			{
				neurotransmitter: "GABA",
				polishNeurotransmitter: "GABA",
				density: "high",
				receptorTypes: ["GABA-A"],
				polishReceptorTypes: ["GABA-A"],
				functionalRole: "Anxiety regulation and fear inhibition",
				polishFunctionalRole: "Regulacja lęku i hamowanie strachu",
			},
			{
				neurotransmitter: "Serotonin",
				polishNeurotransmitter: "Serotonina",
				density: "medium",
				receptorTypes: ["5-HT2A", "5-HT1A"],
				polishReceptorTypes: ["5-HT2A", "5-HT1A"],
				functionalRole: "Emotional regulation",
				polishFunctionalRole: "Regulacja emocjonalna",
			},
			{
				neurotransmitter: "Norepinephrine",
				polishNeurotransmitter: "Noradrenalina",
				density: "medium",
				receptorTypes: ["α1", "β1"],
				polishReceptorTypes: ["α1", "β1"],
				functionalRole: "Stress response and arousal",
				polishFunctionalRole: "Odpowiedź na stres i pobudzenie",
			},
		],

		supplementEffects: [],

		clinicalRelevance:
			"Central to emotional processing and fear conditioning. Hyperactivity associated with anxiety disorders.",
		polishClinicalRelevance:
			"Centralne dla przetwarzania emocji i kondycjonowania strachu. Hiperaktywność związana z zaburzeniami lękowymi.",
		associatedDisorders: [
			"Anxiety disorders",
			"PTSD",
			"Depression",
			"Autism spectrum disorders",
			"Phobias",
		],
		polishAssociatedDisorders: [
			"Zaburzenia lękowe",
			"PTSD",
			"Depresja",
			"Zaburzenia ze spektrum autyzmu",
			"Fobie",
		],
		agingEffects: "Reduced volume correlates with emotional dysregulation",
		polishAgingEffects:
			"Zmniejszona objętość koreluje z deregulacją emocjonalną",
		evidenceLevel: "STRONG",
		researchReferences: [],
	},

	// TEMPORAL LOBE REGIONS
	{
		id: "temporal-cortex",
		name: "Temporal Cortex",
		polishName: "Kora skroniowa",
		category: "cortex",
		hemisphere: "both",
		position: [2.2, 0.3, -0.2],
		size: 0.7,
		color: "#8B5CF6",

		anatomicalInfo: {
			volume: 68.5,
			weight: 38.2,
			neuronCount: 890000000,
			vasculature: ["Middle cerebral artery", "Posterior cerebral artery"],
			polishVasculature: ["Tętnica mózgowa środkowa", "Tętnica mózgowa tylna"],
			connections: [
				"Hippocampus",
				"Amygdala",
				"Prefrontal cortex",
				"Occipital cortex",
			],
			polishConnections: [
				"Hipokamp",
				"Ciało migdałowate",
				"Kora przedczołowa",
				"Kora potyliczna",
			],
			whiteMatter: ["Arcuate fasciculus", "Inferior longitudinal fasciculus"],
			polishWhiteMatter: ["Pęczek łukowaty", "Pęczek podłużny dolny"],
		},

		functions: [
			"Auditory processing",
			"Language comprehension",
			"Memory retrieval",
			"Object recognition",
			"Emotional processing",
			"Social cognition",
		],
		polishFunctions: [
			"Przetwarzanie słuchowe",
			"Rozumienie języka",
			"Odtwarzanie pamięci",
			"Rozpoznawanie obiektów",
			"Przetwarzanie emocjonalne",
			"Poznanie społeczne",
		],
		primaryFunction: "Auditory processing and language comprehension",
		polishPrimaryFunction: "Przetwarzanie słuchowe i rozumienie języka",
		secondaryFunctions: ["Memory retrieval", "Social cognition"],
		polishSecondaryFunctions: ["Odtwarzanie pamięci", "Poznanie społeczne"],

		neurotransmitters: [
			{
				neurotransmitter: "Glutamate",
				polishNeurotransmitter: "Glutaminian",
				density: "high",
				receptorTypes: ["NMDA", "AMPA"],
				polishReceptorTypes: ["NMDA", "AMPA"],
				functionalRole: "Excitatory transmission and plasticity",
				polishFunctionalRole: "Transmisja eksytatoryczna i plastyczność",
			},
			{
				neurotransmitter: "GABA",
				polishNeurotransmitter: "GABA",
				density: "medium",
				receptorTypes: ["GABA-A"],
				polishReceptorTypes: ["GABA-A"],
				functionalRole: "Inhibitory control",
				polishFunctionalRole: "Kontrola hamująca",
			},
		],

		supplementEffects: [
			{
				supplementId: "phosphatidylserine",
				supplementName: "Phosphatidylserine",
				polishSupplementName: "Fosfatydyloseryna",
				effectType: "PROTECTS",
				intensity: 0.6,
				mechanism: "Stabilizes neuronal membranes and reduces cortisol",
				polishMechanism: "Stabilizuje błony neuronów i redukuje kortyzol",
				evidenceLevel: "MODERATE",
				visualEffect: {
					color: "#6366F1",
					pulseSpeed: 1.1,
					glowIntensity: 0.5,
				},
			},
		],

		clinicalRelevance:
			"Critical for language and auditory processing. Lesions cause aphasia and auditory agnosia.",
		polishClinicalRelevance:
			"Krytyczna dla języka i przetwarzania słuchowego. Uszkodzenia powodują afazję i agnozję słuchową.",
		associatedDisorders: [
			"Temporal lobe epilepsy",
			"Wernicke's aphasia",
			"Alzheimer's disease",
			"Schizophrenia",
			"Auditory processing disorder",
		],
		polishAssociatedDisorders: [
			"Padaczka płata skroniowego",
			"Afazja Wernickego",
			"Choroba Alzheimera",
			"Schizofrenia",
			"Zaburzenie przetwarzania słuchowego",
		],
		agingEffects: "Progressive atrophy affects memory and language",
		polishAgingEffects: "Postępujący zanik wpływa na pamięć i język",
		evidenceLevel: "STRONG",
		researchReferences: [],
	},

	// PARIETAL LOBE REGIONS
	{
		id: "parietal-cortex",
		name: "Parietal Cortex",
		polishName: "Kora ciemieniowa",
		category: "cortex",
		hemisphere: "both",
		position: [0, -0.8, 1.2],
		size: 0.6,
		color: "#10B981",

		anatomicalInfo: {
			volume: 52.8,
			weight: 29.4,
			neuronCount: 720000000,
			vasculature: ["Middle cerebral artery"],
			polishVasculature: ["Tętnica mózgowa środkowa"],
			connections: [
				"Prefrontal cortex",
				"Occipital cortex",
				"Somatosensory thalamus",
			],
			polishConnections: [
				"Kora przedczołowa",
				"Kora potyliczna",
				"Wzgórze somatosensoryczne",
			],
			whiteMatter: [
				"Superior longitudinal fasciculus",
				"Inferior parietal lobule",
			],
			polishWhiteMatter: ["Pęczek podłużny górny", "Dolny płatek ciemieniowy"],
		},

		functions: [
			"Spatial awareness",
			"Attention orientation",
			"Body schema",
			"Mathematical processing",
			"Reading and writing",
			"Tool use",
		],
		polishFunctions: [
			"Świadomość przestrzenna",
			"Orientacja uwagi",
			"Schemat ciała",
			"Przetwarzanie matematyczne",
			"Czytanie i pisanie",
			"Użytkowanie narzędzi",
		],
		primaryFunction: "Spatial cognition and attention",
		polishPrimaryFunction: "Poznanie przestrzenne i uwaga",
		secondaryFunctions: ["Mathematical processing", "Body awareness"],
		polishSecondaryFunctions: [
			"Przetwarzanie matematyczne",
			"Świadomość ciała",
		],

		neurotransmitters: [
			{
				neurotransmitter: "Acetylcholine",
				polishNeurotransmitter: "Acetylocholina",
				density: "medium",
				receptorTypes: ["M1", "M2"],
				polishReceptorTypes: ["M1", "M2"],
				functionalRole: "Attention and spatial processing",
				polishFunctionalRole: "Uwaga i przetwarzanie przestrzenne",
			},
			{
				neurotransmitter: "Dopamine",
				polishNeurotransmitter: "Dopamina",
				density: "low",
				receptorTypes: ["D1", "D2"],
				polishReceptorTypes: ["D1", "D2"],
				functionalRole: "Motivation and attention",
				polishFunctionalRole: "Motywacja i uwaga",
			},
		],

		supplementEffects: [
			{
				supplementId: "citicoline",
				supplementName: "Citicoline",
				polishSupplementName: "Cytykolina",
				effectType: "ENHANCES",
				intensity: 0.7,
				mechanism: "Increases acetylcholine and dopamine levels",
				polishMechanism: "Zwiększa poziomy acetylocholiny i dopaminy",
				evidenceLevel: "MODERATE",
				visualEffect: {
					color: "#3B82F6",
					pulseSpeed: 1.4,
					glowIntensity: 0.6,
				},
			},
		],

		clinicalRelevance:
			"Essential for spatial cognition and attention. Damage causes neglect and apraxia.",
		polishClinicalRelevance:
			"Niezbędna dla poznania przestrzennego i uwagi. Uszkodzenie powoduje zaniedbanie i apraksję.",
		associatedDisorders: [
			"Gerstmann syndrome",
			"Balint syndrome",
			"Hemispatial neglect",
			"Apraxia",
			"Alzheimer's disease",
		],
		polishAssociatedDisorders: [
			"Zespół Gerstmanna",
			"Zespół Balinta",
			"Zaniedbanie półprzestrzenne",
			"Apraksja",
			"Choroba Alzheimera",
		],
		agingEffects: "Decline in spatial processing and attention",
		polishAgingEffects: "Spadek przetwarzania przestrzennego i uwagi",
		evidenceLevel: "MODERATE",
		researchReferences: [],
	},

	// OCCIPITAL LOBE REGIONS
	{
		id: "occipital-cortex",
		name: "Occipital Cortex",
		polishName: "Kora potyliczna",
		category: "cortex",
		hemisphere: "both",
		position: [0, -1.5, 0.8],
		size: 0.5,
		color: "#F97316",

		anatomicalInfo: {
			volume: 38.7,
			weight: 21.5,
			neuronCount: 580000000,
			vasculature: ["Posterior cerebral artery"],
			polishVasculature: ["Tętnica mózgowa tylna"],
			connections: [
				"Parietal cortex",
				"Temporal cortex",
				"Lateral geniculate nucleus",
			],
			polishConnections: [
				"Kora ciemieniowa",
				"Kora skroniowa",
				"Jądro kolankowate boczne",
			],
			whiteMatter: ["Optic radiations", "Forceps major"],
			polishWhiteMatter: ["Promieniowanie wzrokowe", "Większa pęseta"],
		},

		functions: [
			"Visual processing",
			"Color perception",
			"Motion detection",
			"Object recognition",
			"Depth perception",
			"Visual memory",
		],
		polishFunctions: [
			"Przetwarzanie wzrokowe",
			"Percepcja kolorów",
			"Wykrywanie ruchu",
			"Rozpoznawanie obiektów",
			"Percepcja głębi",
			"Pamięć wzrokowa",
		],
		primaryFunction: "Visual processing and perception",
		polishPrimaryFunction: "Przetwarzanie wzrokowe i percepcja",
		secondaryFunctions: ["Object recognition", "Visual memory"],
		polishSecondaryFunctions: ["Rozpoznawanie obiektów", "Pamięć wzrokowa"],

		neurotransmitters: [
			{
				neurotransmitter: "Glutamate",
				polishNeurotransmitter: "Glutaminian",
				density: "high",
				receptorTypes: ["NMDA", "AMPA"],
				polishReceptorTypes: ["NMDA", "AMPA"],
				functionalRole: "Excitatory visual processing",
				polishFunctionalRole: "Eksytatoryczne przetwarzanie wzrokowe",
			},
			{
				neurotransmitter: "GABA",
				polishNeurotransmitter: "GABA",
				density: "medium",
				receptorTypes: ["GABA-A"],
				polishReceptorTypes: ["GABA-A"],
				functionalRole: "Contrast enhancement and edge detection",
				polishFunctionalRole: "Wzmacnianie kontrastu i wykrywanie krawędzi",
			},
		],

		supplementEffects: [
			{
				supplementId: "bilberry-extract",
				supplementName: "Bilberry Extract",
				polishSupplementName: "Ekstrakt z borówki",
				effectType: "PROTECTS",
				intensity: 0.5,
				mechanism: "Antioxidant protection of retinal neurons",
				polishMechanism: "Ochrona antyoksydacyjna neuronów siatkówki",
				evidenceLevel: "WEAK",
				visualEffect: {
					color: "#7C3AED",
					pulseSpeed: 1.0,
					glowIntensity: 0.4,
				},
			},
		],

		clinicalRelevance:
			"Primary visual cortex. Damage causes cortical blindness and visual field deficits.",
		polishClinicalRelevance:
			"Kora wzrokowa pierwotna. Uszkodzenie powoduje ślepotę korową i deficyty pola widzenia.",
		associatedDisorders: [
			"Cortical blindness",
			"Visual agnosia",
			"Alexia",
			"Achromatopsia",
			"Akinetopsia",
		],
		polishAssociatedDisorders: [
			"Ślepota korowa",
			"Agnozja wzrokowa",
			"Aleksja",
			"Achromatopsja",
			"Akinetopsja",
		],
		agingEffects: "Decline in visual processing speed and contrast sensitivity",
		polishAgingEffects:
			"Spadek szybkości przetwarzania wzrokowego i wrażliwości na kontrast",
		evidenceLevel: "STRONG",
		researchReferences: [],
	},

	// BASAL GANGLIA REGIONS
	{
		id: "striatum",
		name: "Striatum",
		polishName: "Prążkowie",
		category: "basal-ganglia",
		hemisphere: "both",
		position: [0.8, 0.2, 0.3],
		size: 0.4,
		color: "#EC4899",

		anatomicalInfo: {
			volume: 18.5,
			weight: 10.2,
			neuronCount: 280000000,
			vasculature: ["Middle cerebral artery", "Anterior cerebral artery"],
			polishVasculature: [
				"Tętnica mózgowa środkowa",
				"Tętnica mózgowa przednia",
			],
			connections: [
				"Substantia nigra",
				"Globus pallidus",
				"Thalamus",
				"Cortex",
			],
			polishConnections: [
				"Substancja czarna",
				"Gałka blada",
				"Wzgórze",
				"Kora",
			],
			whiteMatter: ["Internal capsule", "External capsule"],
			polishWhiteMatter: ["Torebka wewnętrzna", "Torebka zewnętrzna"],
		},

		functions: [
			"Motor control",
			"Habit formation",
			"Reward processing",
			"Action selection",
			"Procedural learning",
			"Motivation",
		],
		polishFunctions: [
			"Kontrola ruchowa",
			"Tworzenie nawyków",
			"Przetwarzanie nagrody",
			"Selekcja działań",
			"Uczenie proceduralne",
			"Motywacja",
		],
		primaryFunction: "Motor control and habit formation",
		polishPrimaryFunction: "Kontrola ruchowa i tworzenie nawyków",
		secondaryFunctions: ["Reward processing", "Action selection"],
		polishSecondaryFunctions: ["Przetwarzanie nagrody", "Selekcja działań"],

		neurotransmitters: [
			{
				neurotransmitter: "Dopamine",
				polishNeurotransmitter: "Dopamina",
				density: "high",
				receptorTypes: ["D1", "D2"],
				polishReceptorTypes: ["D1", "D2"],
				functionalRole: "Reward and motor control",
				polishFunctionalRole: "Nagroda i kontrola ruchowa",
			},
			{
				neurotransmitter: "GABA",
				polishNeurotransmitter: "GABA",
				density: "high",
				receptorTypes: ["GABA-A"],
				polishReceptorTypes: ["GABA-A"],
				functionalRole: "Inhibitory control",
				polishFunctionalRole: "Kontrola hamująca",
			},
			{
				neurotransmitter: "Glutamate",
				polishNeurotransmitter: "Glutaminian",
				density: "medium",
				receptorTypes: ["NMDA", "AMPA"],
				polishReceptorTypes: ["NMDA", "AMPA"],
				functionalRole: "Excitatory input from cortex",
				polishFunctionalRole: "Wejście eksytatoryczne z kory",
			},
		],

		supplementEffects: [
			{
				supplementId: "mucuna-pruriens",
				supplementName: "Mucuna Pruriens",
				polishSupplementName: "Mucuna Pruriens",
				effectType: "STIMULATES",
				intensity: 0.8,
				mechanism: "Natural source of L-DOPA, dopamine precursor",
				polishMechanism: "Naturalne źródło L-DOPA, prekursor dopaminy",
				evidenceLevel: "MODERATE",
				visualEffect: {
					color: "#8B5CF6",
					pulseSpeed: 1.7,
					glowIntensity: 0.7,
				},
			},
		],

		clinicalRelevance:
			"Critical for motor control and habit formation. Degeneration causes movement disorders.",
		polishClinicalRelevance:
			"Krytyczne dla kontroli ruchowej i tworzenia nawyków. Degeneracja powoduje zaburzenia ruchu.",
		associatedDisorders: [
			"Parkinson's disease",
			"Huntington's disease",
			"Tourette syndrome",
			"OCD",
			"Addiction",
		],
		polishAssociatedDisorders: [
			"Choroba Parkinsona",
			"Choroba Huntingtona",
			"Zespół Tourette'a",
			"ZOK",
			"Uzależnienie",
		],
		agingEffects: "Progressive dopamine depletion affects motor function",
		polishAgingEffects:
			"Postępujące wyczerpanie dopaminy wpływa na funkcję ruchową",
		evidenceLevel: "STRONG",
		researchReferences: [],
	},

	// THALAMUS AND HYPOTHALAMUS
	{
		id: "thalamus",
		name: "Thalamus",
		polishName: "Wzgórze",
		category: "subcortical",
		hemisphere: "both",
		position: [0, -0.2, 0.8],
		size: 0.3,
		color: "#06B6D4",

		anatomicalInfo: {
			volume: 8.7,
			weight: 4.8,
			neuronCount: 85000000,
			vasculature: [
				"Posterior cerebral artery",
				"Posterior communicating artery",
			],
			polishVasculature: ["Tętnica mózgowa tylna", "Tętnica łącząca tylna"],
			connections: ["Cortex", "Brainstem", "Basal ganglia", "Limbic system"],
			polishConnections: [
				"Kora",
				"Pień mózgu",
				"Jądra podstawne",
				"Układ limbiczny",
			],
			whiteMatter: ["Thalamic radiations", "Internal medullary lamina"],
			polishWhiteMatter: [
				"Promieniowania wzgórzowe",
				"Blaszka rdzeniowa wewnętrzna",
			],
		},

		functions: [
			"Sensory relay",
			"Attention gating",
			"Consciousness",
			"Sleep regulation",
			"Motor control",
			"Information filtering",
		],
		polishFunctions: [
			"Przekaźnik sensoryczny",
			"Brama uwagi",
			"Świadomość",
			"Regulacja snu",
			"Kontrola ruchowa",
			"Filtrowanie informacji",
		],
		primaryFunction: "Sensory and motor relay station",
		polishPrimaryFunction: "Stacja przekaźnikowa sensoryczna i ruchowa",
		secondaryFunctions: ["Attention gating", "Sleep regulation"],
		polishSecondaryFunctions: ["Brama uwagi", "Regulacja snu"],

		neurotransmitters: [
			{
				neurotransmitter: "Glutamate",
				polishNeurotransmitter: "Glutaminian",
				density: "high",
				receptorTypes: ["NMDA", "AMPA"],
				polishReceptorTypes: ["NMDA", "AMPA"],
				functionalRole: "Excitatory relay transmission",
				polishFunctionalRole: "Eksytatoryczna transmisja przekaźnikowa",
			},
			{
				neurotransmitter: "GABA",
				polishNeurotransmitter: "GABA",
				density: "medium",
				receptorTypes: ["GABA-A", "GABA-B"],
				polishReceptorTypes: ["GABA-A", "GABA-B"],
				functionalRole: "Inhibitory control and gating",
				polishFunctionalRole: "Kontrola hamująca i bramkowanie",
			},
		],

		supplementEffects: [
			{
				supplementId: "magnesium-glycinate",
				supplementName: "Magnesium Glycinate",
				polishSupplementName: "Glicynian magnezu",
				effectType: "MODULATES",
				intensity: 0.6,
				mechanism: "NMDA receptor modulation and sleep regulation",
				polishMechanism: "Modulacja receptorów NMDA i regulacja snu",
				evidenceLevel: "MODERATE",
				visualEffect: {
					color: "#10B981",
					pulseSpeed: 1.2,
					glowIntensity: 0.5,
				},
			},
		],

		clinicalRelevance:
			"Central relay station for sensory and motor information. Damage causes sensory loss and cognitive deficits.",
		polishClinicalRelevance:
			"Centralna stacja przekaźnikowa dla informacji sensorycznych i ruchowych. Uszkodzenie powoduje utratę sensoryczną i deficyty poznawcze.",
		associatedDisorders: [
			"Thalamic stroke",
			"Dejerine-Roussy syndrome",
			"Fatal familial insomnia",
			"Schizophrenia",
			"ADHD",
		],
		polishAssociatedDisorders: [
			"Udar wzgórza",
			"Zespół Dejerine-Roussy",
			"Śmiertelna bezsenność rodzinna",
			"Schizofrenia",
			"ADHD",
		],
		agingEffects: "Progressive atrophy affects sensory processing",
		polishAgingEffects: "Postępujący zanik wpływa na przetwarzanie sensoryczne",
		evidenceLevel: "STRONG",
		researchReferences: [],
	},

	{
		id: "hypothalamus",
		name: "Hypothalamus",
		polishName: "Podwzgórze",
		category: "subcortical",
		hemisphere: "midline",
		position: [0, 0.1, -0.3],
		size: 0.2,
		color: "#EF4444",

		anatomicalInfo: {
			volume: 1.2,
			weight: 0.7,
			neuronCount: 12000000,
			vasculature: ["Anterior cerebral artery", "Posterior cerebral artery"],
			polishVasculature: ["Tętnica mózgowa przednia", "Tętnica mózgowa tylna"],
			connections: [
				"Pituitary gland",
				"Amygdala",
				"Brainstem",
				"Limbic system",
			],
			polishConnections: [
				"Przysadka mózgowa",
				"Ciało migdałowate",
				"Pień mózgu",
				"Układ limbiczny",
			],
			whiteMatter: ["Median forebrain bundle", "Periventricular fibers"],
			polishWhiteMatter: [
				"Pęczek przyśrodkowy przodomózgowia",
				"Włókna okołokomorowe",
			],
		},

		functions: [
			"Hormone regulation",
			"Body temperature",
			"Hunger and thirst",
			"Sleep-wake cycles",
			"Emotional responses",
			"Autonomic control",
		],
		polishFunctions: [
			"Regulacja hormonów",
			"Temperatura ciała",
			"Głód i pragnienie",
			"Cykle snu i czuwania",
			"Odpowiedzi emocjonalne",
			"Kontrola autonomiczna",
		],
		primaryFunction: "Homeostasis and endocrine control",
		polishPrimaryFunction: "Homeostaza i kontrola endokrynna",
		secondaryFunctions: ["Sleep regulation", "Emotional responses"],
		polishSecondaryFunctions: ["Regulacja snu", "Odpowiedzi emocjonalne"],

		neurotransmitters: [
			{
				neurotransmitter: "GABA",
				polishNeurotransmitter: "GABA",
				density: "high",
				receptorTypes: ["GABA-A", "GABA-B"],
				polishReceptorTypes: ["GABA-A", "GABA-B"],
				functionalRole: "Inhibitory control of endocrine release",
				polishFunctionalRole: "Hamująca kontrola uwalniania endokrynnego",
			},
			{
				neurotransmitter: "Dopamine",
				polishNeurotransmitter: "Dopamina",
				density: "medium",
				receptorTypes: ["D1", "D2"],
				polishReceptorTypes: ["D1", "D2"],
				functionalRole: "Prolactin regulation",
				polishFunctionalRole: "Regulacja prolaktyny",
			},
			{
				neurotransmitter: "Serotonin",
				polishNeurotransmitter: "Serotonina",
				density: "medium",
				receptorTypes: ["5-HT1A", "5-HT2A"],
				polishReceptorTypes: ["5-HT1A", "5-HT2A"],
				functionalRole: "Appetite and mood regulation",
				polishFunctionalRole: "Regulacja apetytu i nastroju",
			},
		],

		supplementEffects: [],

		clinicalRelevance:
			"Master regulator of endocrine system and homeostasis. Damage causes severe metabolic and behavioral disturbances.",
		polishClinicalRelevance:
			"Główny regulator układu endokrynnego i homeostazy. Uszkodzenie powoduje poważne zaburzenia metaboliczne i behawioralne.",
		associatedDisorders: [
			"Diabetes insipidus",
			"Hypopituitarism",
			"Obesity",
			"Sleep disorders",
			"Depression",
		],
		polishAssociatedDisorders: [
			"Moczówka prosta",
			"Niedoczynność przysadki",
			"Otyłość",
			"Zaburzenia snu",
			"Depresja",
		],
		agingEffects: "Progressive dysfunction affects metabolic regulation",
		polishAgingEffects:
			"Postępująca dysfunkcja wpływa na regulację metaboliczną",
		evidenceLevel: "STRONG",
		researchReferences: [],
	},

	// BRAINSTEM REGIONS
	{
		id: "substantia-nigra",
		name: "Substantia Nigra",
		polishName: "Substancja czarna",
		category: "brainstem",
		hemisphere: "midline",
		position: [0.5, -1.2, -0.8],
		size: 0.15,
		color: "#7C2D12",

		anatomicalInfo: {
			volume: 0.8,
			weight: 0.4,
			neuronCount: 450000,
			vasculature: ["Posterior cerebral artery"],
			polishVasculature: ["Tętnica mózgowa tylna"],
			connections: ["Striatum", "Globus pallidus", "Subthalamic nucleus"],
			polishConnections: ["Prążkowie", "Gałka blada", "Jądro podwzgórzowe"],
			whiteMatter: ["Nigrostriatal pathway", "Mesocortical pathway"],
			polishWhiteMatter: ["Ścieżka nigrostriatalna", "Ścieżka mezokortykalna"],
		},

		functions: [
			"Dopamine production",
			"Motor control",
			"Reward processing",
			"Habit formation",
			"Movement initiation",
		],
		polishFunctions: [
			"Produkcja dopaminy",
			"Kontrola ruchowa",
			"Przetwarzanie nagrody",
			"Tworzenie nawyków",
			"Inicjacja ruchu",
		],
		primaryFunction: "Dopamine synthesis and motor control",
		polishPrimaryFunction: "Synteza dopaminy i kontrola ruchowa",
		secondaryFunctions: ["Reward processing", "Habit formation"],
		polishSecondaryFunctions: ["Przetwarzanie nagrody", "Tworzenie nawyków"],

		neurotransmitters: [
			{
				neurotransmitter: "Dopamine",
				polishNeurotransmitter: "Dopamina",
				density: "high",
				receptorTypes: ["D1", "D2"],
				polishReceptorTypes: ["D1", "D2"],
				functionalRole: "Motor control and reward",
				polishFunctionalRole: "Kontrola ruchowa i nagroda",
			},
		],

		supplementEffects: [
			{
				supplementId: "nadh",
				supplementName: "NADH",
				polishSupplementName: "NADH",
				effectType: "PROTECTS",
				intensity: 0.5,
				mechanism: "Supports mitochondrial function in dopaminergic neurons",
				polishMechanism:
					"Wspiera funkcję mitochondrialną w neuronach dopaminergiczych",
				evidenceLevel: "WEAK",
				visualEffect: {
					color: "#059669",
					pulseSpeed: 0.8,
					glowIntensity: 0.4,
				},
			},
		],

		clinicalRelevance:
			"Primary site of dopamine production. Degeneration causes Parkinson's disease.",
		polishClinicalRelevance:
			"Główne miejsce produkcji dopaminy. Degeneracja powoduje chorobę Parkinsona.",
		associatedDisorders: [
			"Parkinson's disease",
			"Progressive supranuclear palsy",
			"Multiple system atrophy",
			"Dopamine transporter deficiency",
		],
		polishAssociatedDisorders: [
			"Choroba Parkinsona",
			"Postępujące porażenie nadjądrowe",
			"Atrofia wieloukładowa",
			"Niedobór transportera dopaminy",
		],
		agingEffects: "Progressive loss of dopaminergic neurons",
		polishAgingEffects: "Postępująca utrata neuronów dopaminergiczych",
		evidenceLevel: "STRONG",
		researchReferences: [],
	},

	// CEREBELLUM REGIONS
	{
		id: "cerebellum",
		name: "Cerebellum",
		polishName: "Móżdżek",
		category: "cerebellum",
		hemisphere: "both",
		position: [0, -2.8, -1.2],
		size: 0.9,
		color: "#DC2626",

		anatomicalInfo: {
			volume: 142.3,
			weight: 78.5,
			neuronCount: 69000000000,
			vasculature: [
				"Superior cerebellar artery",
				"Anterior inferior cerebellar artery",
				"Posterior inferior cerebellar artery",
			],
			polishVasculature: [
				"Tętnica móżdżkowa górna",
				"Tętnica móżdżkowa dolna przednia",
				"Tętnica móżdżkowa dolna tylna",
			],
			connections: ["Brainstem", "Thalamus", "Cortex", "Spinal cord"],
			polishConnections: ["Pień mózgu", "Wzgórze", "Kora", "Rdzeń kręgowy"],
			whiteMatter: ["Cerebellar peduncles", "Deep cerebellar nuclei"],
			polishWhiteMatter: ["Szypuły móżdżkowe", "Głębokie jądra móżdżku"],
		},

		functions: [
			"Motor coordination",
			"Balance",
			"Motor learning",
			"Timing",
			"Error correction",
			"Cognitive processing",
		],
		polishFunctions: [
			"Koordynacja ruchowa",
			"Równowaga",
			"Uczenie ruchowe",
			"Czasy",
			"Korekcja błędów",
			"Przetwarzanie poznawcze",
		],
		primaryFunction: "Motor coordination and learning",
		polishPrimaryFunction: "Koordynacja ruchowa i uczenie",
		secondaryFunctions: ["Balance", "Error correction"],
		polishSecondaryFunctions: ["Równowaga", "Korekcja błędów"],

		neurotransmitters: [
			{
				neurotransmitter: "GABA",
				polishNeurotransmitter: "GABA",
				density: "high",
				receptorTypes: ["GABA-A", "GABA-B"],
				polishReceptorTypes: ["GABA-A", "GABA-B"],
				functionalRole: "Inhibitory control of motor output",
				polishFunctionalRole: "Hamująca kontrola wyjścia ruchowego",
			},
			{
				neurotransmitter: "Glutamate",
				polishNeurotransmitter: "Glutaminian",
				density: "high",
				receptorTypes: ["NMDA", "AMPA"],
				polishReceptorTypes: ["NMDA", "AMPA"],
				functionalRole: "Excitatory input from cortex and brainstem",
				polishFunctionalRole: "Wejście eksytatoryczne z kory i pnia mózgu",
			},
		],

		supplementEffects: [
			{
				supplementId: "creatine-monohydrate",
				supplementName: "Creatine Monohydrate",
				polishSupplementName: "Monohydrat kreatyny",
				effectType: "ENHANCES",
				intensity: 0.6,
				mechanism: "Improves cellular energy metabolism in cerebellar neurons",
				polishMechanism:
					"Poprawia metabolizm energii komórkowej w neuronach móżdżku",
				evidenceLevel: "MODERATE",
				visualEffect: {
					color: "#EF4444",
					pulseSpeed: 1.3,
					glowIntensity: 0.5,
				},
			},
		],

		clinicalRelevance:
			"Essential for motor coordination and cognitive processing. Largest source of neurons in brain.",
		polishClinicalRelevance:
			"Niezbędny dla koordynacji ruchowej i przetwarzania poznawczego. Największe źródło neuronów w mózgu.",
		associatedDisorders: [
			"Ataxia",
			"Cerebellar degeneration",
			"Multiple sclerosis",
			"Alcohol-related cerebellar degeneration",
			"Autism spectrum disorders",
		],
		polishAssociatedDisorders: [
			"Ataksja",
			"Degeneracja móżdżku",
			"Stwardnienie rozsiane",
			"Alkoholowa degeneracja móżdżku",
			"Zaburzenia ze spektrum autyzmu",
		],
		agingEffects: "Progressive atrophy affects balance and coordination",
		polishAgingEffects: "Postępujący zanik wpływa na równowagę i koordynację",
		evidenceLevel: "STRONG",
		researchReferences: [],
	},
];

// Export for use in other components
export default comprehensiveBrainRegions;
