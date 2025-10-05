/**
 * Cognitive Function Modules
 * Comprehensive database of cognitive functions with Polish localization
 */

import type {
	KnowledgeNode,
	KnowledgeRelationship,
} from "@/types/knowledge-graph";

export interface CognitiveFunction {
	id: string;
	name: string;
	polishName: string;
	description: string;
	polishDescription: string;
	primaryDomains: string[];
	polishPrimaryDomains: string[];
	subFunctions: CognitiveSubFunction[];
	associatedBrainRegions: BrainRegion[];
	neurotransmitterSystems: string[];
	polishNeurotransmitterSystems: string[];
	assessmentMethods: string[];
	polishAssessmentMethods: string[];
	developmentTrajectory: DevelopmentalStage[];
	polishDevelopmentTrajectory: string[];
	relatedDisorders: string[];
	polishRelatedDisorders: string[];
	cognitiveEnhancementStrategies: EnhancementStrategy[];
	evidenceLevel:
		| "STRONG"
		| "MODERATE"
		| "WEAK"
		| "INSUFFICIENT"
		| "CONFLICTING";
	researchStudies: ResearchReference[];
	tags: string[];
	lastUpdated: string;
	createdAt: string;
}

export interface CognitiveSubFunction {
	id: string;
	name: string;
	polishName: string;
	description: string;
	polishDescription: string;
	relatedCognitiveDomains: string[];
	neuralNetworks: string[];
	polishNeuralNetworks: string[];
	typicalAssessment: string[];
	polishTypicalAssessment: string[];
	developmentTimeline: string;
	polishDevelopmentTimeline: string;
	enhancementPotential: "high" | "moderate" | "low";
}

export interface BrainRegion {
	id: string;
	name: string;
	polishName: string;
	primaryFunction: string;
	polishPrimaryFunction: string;
	volume?: number; // in cm³
	functions: string[];
	polishFunctions: string[];
	neurotransmitters: string[];
	polishNeurotransmitters: string[];
	connections: string[];
	polishConnections: string[];
	disorders: string[];
	polishDisorders: string[];
	development: string;
	polishDevelopment: string;
}

export interface DevelopmentalStage {
	stage: string;
	polishStage: string;
	ageRange: string;
	cognitiveCharacteristics: string[];
	polishCognitiveCharacteristics: string[];
	peakPerformance: number; // scale 0-100
	declineOnset?: string; // age when decline typically begins
	polishDeclineOnset?: string;
}

export interface EnhancementStrategy {
	id: string;
	name: string;
	polishName: string;
	description: string;
	polishDescription: string;
	type:
		| "behavioral"
		| "nutritional"
		| "pharmacological"
		| "technological"
		| "lifestyle";
	polishType:
		| "behawioralna"
		| "odżywcza"
		| "farmakologiczna"
		| "technologiczna"
		| "stylu życia";
	evidenceLevel:
		| "STRONG"
		| "MODERATE"
		| "WEAK"
		| "INSUFFICIENT"
		| "CONFLICTING";
	effectiveness: number; // scale 0-100
	duration: string;
	polishDuration: string;
	sideEffects: string[];
	polishSideEffects: string[];
	contraindications: string[];
	polishContraindications: string[];
	recommendedProtocol: string;
	polishRecommendedProtocol: string;
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

// Memory domain
export const memoryDomain: CognitiveFunction = {
	id: "memory",
	name: "Memory",
	polishName: "Pamięć",
	description:
		"Memory is the cognitive function responsible for encoding, storing, and retrieving information. It encompasses multiple systems including working memory, episodic memory, semantic memory, and procedural memory, each with distinct neural substrates and mechanisms.",
	polishDescription:
		"Pamięć to funkcja poznawcza odpowiedzialna za kodowanie, przechowywanie i odzyskiwanie informacji. Obejmuje wiele systemów w tym pamięć operacyjną, epizodyczną, semantyczną i proceduralną, każdy z odrębnymi substratami nerwowymi i mechanizmami.",
	primaryDomains: [
		"Working memory",
		"Episodic memory",
		"Semantic memory",
		"Procedural memory",
	],
	polishPrimaryDomains: [
		"Pamięć operacyjna",
		"Pamięć epizodyczna",
		"Pamięć semantyczna",
		"Pamięć proceduralna",
	],
	subFunctions: [
		{
			id: "working-memory",
			name: "Working Memory",
			polishName: "Pamięć operacyjna",
			description:
				"Working memory is a cognitive system responsible for temporarily holding and manipulating information needed for complex cognitive tasks like reasoning, comprehension, and learning.",
			polishDescription:
				"Pamięć operacyjna to system poznawczy odpowiedzialny za tymczasowe przechowywanie i manipulowanie informacjami potrzebnymi do złożonych zadań poznawczych jak rozumowanie, zrozumienie i uczenie się.",
			relatedCognitiveDomains: ["attention", "executive-function"],
			neuralNetworks: [
				"Prefrontal Cortex",
				"Parietal Cortex",
				"Anterior Cingulate",
			],
			polishNeuralNetworks: [
				"Kora czołowa",
				"Kora ciemieniowa",
				"Pasma przykorytowe",
			],
			typicalAssessment: ["N-back task", "Corsi block task", "Digit span test"],
			polishTypicalAssessment: [
				"Zadanie N-back",
				"Test bloków Corsi",
				"Test zakresu cyfr",
			],
			developmentTimeline:
				"Peak in early adulthood (20-30 years), gradual decline with age",
			polishDevelopmentTimeline:
				"Szczyt w młodym dorosłości (20-30 lat), stopniowy spadek z wiekiem",
			enhancementPotential: "high",
		},
		{
			id: "episodic-memory",
			name: "Episodic Memory",
			polishName: "Pamięć epizodyczna",
			description:
				"Episodic memory is the ability to recall specific events and experiences from one's personal past, including the temporal and spatial context of the events.",
			polishDescription:
				"Pamięć epizodyczna to zdolność do odzyskiwania konkretnych wydarzeń i doświadczeń z osobistej przeszłości, w tym kontekstu czasowego i przestrzennego tych wydarzeń.",
			relatedCognitiveDomains: ["memory", "temporal-processing"],
			neuralNetworks: [
				"Hippocampus",
				"Medial Temporal Lobe",
				"Prefrontal Cortex",
			],
			polishNeuralNetworks: [
				"Hipokamp",
				"Boczny płat skroniowy",
				"Kora czołowa",
			],
			typicalAssessment: [
				"Free recall tests",
				"Recognition tests",
				"Autobiographical memory tasks",
			],
			polishTypicalAssessment: [
				"Testy swobodnego odzyskiwania",
				"Testy rozpoznawania",
				"Zadania autobiograficznej pamięci",
			],
			developmentTimeline:
				"Develops throughout childhood, peaks in young adulthood",
			polishDevelopmentTimeline:
				"Rozwija się przez całe dzieciństwo, osiąga szczyt w młodym dorosłości",
			enhancementPotential: "moderate",
		},
		{
			id: "semantic-memory",
			name: "Semantic Memory",
			polishName: "Pamięć semantyczna",
			description:
				"Semantic memory refers to the memory of meanings, understandings, and other concept-based knowledge unrelated to specific experiences.",
			polishDescription:
				"Pamięć semantyczna odnosi się do pamięci znaczeń, zrozumienia i innych opartych na koncepcjach wiedzy niezwiązanej z konkretnymi doświadczeniami.",
			relatedCognitiveDomains: ["language", "executive-function"],
			neuralNetworks: [
				"Temporal Cortex",
				"Anterior Temporal Lobe",
				"Prefrontal Cortex",
			],
			polishNeuralNetworks: [
				"Kora skroniowa",
				"Przedni płat skroniowy",
				"Kora czołowa",
			],
			typicalAssessment: [
				"Category fluency",
				"Semantic association tests",
				"Vocabulary tests",
			],
			polishTypicalAssessment: [
				"Płynność kategoryczna",
				"Testy skojarzeń semantycznych",
				"Testy słownictwa",
			],
			developmentTimeline:
				"Slowly increases throughout life, peaks in middle age",
			polishDevelopmentTimeline:
				"Powoli rośnie przez całe życie, osiąga szczyt w średnim wieku",
			enhancementPotential: "moderate",
		},
		{
			id: "procedural-memory",
			name: "Procedural Memory",
			polishName: "Pamięć proceduralna",
			description:
				"Procedural memory is a type of long-term memory involved in the execution of different forms of learned actions and skills.",
			polishDescription:
				"Pamięć proceduralna to rodzaj długotrwałej pamięci zaangażowanej w wykonywanie różnych form nauczonych działań i umiejętności.",
			relatedCognitiveDomains: ["motor-control", "learning"],
			neuralNetworks: ["Basal Ganglia", "Cerebellum", "Motor Cortex"],
			polishNeuralNetworks: [
				"Ganglia podstawne",
				"Cerebellum",
				"Kora motoryczna",
			],
			typicalAssessment: [
				"Motor skill acquisition",
				"Priming tasks",
				"Conditioning tasks",
			],
			polishTypicalAssessment: [
				"Nabywanie umiejętności motorycznych",
				"Zadania prymowania",
				"Zadania warunkowania",
			],
			developmentTimeline: "Develops early in life, remains stable with age",
			polishDevelopmentTimeline:
				"Rozwija się wcześnie w życiu, pozostaje stabilna z wiekiem",
			enhancementPotential: "low",
		},
	],
	associatedBrainRegions: [
		{
			id: "hippocampus",
			name: "Hippocampus",
			polishName: "Hipokamp",
			primaryFunction: "Memory formation and consolidation",
			polishPrimaryFunction: "Tworzenie i konsolidowanie pamięci",
			volume: 3.0,
			functions: [
				"Memory consolidation",
				"Spatial navigation",
				"Pattern separation",
			],
			polishFunctions: [
				"Konsolidacja pamięci",
				"Nawigacja przestrzenna",
				"Separacja wzorców",
			],
			neurotransmitters: ["Glutamate", "GABA", "Acetylcholine"],
			polishNeurotransmitters: ["Glutaminian", "GABA", "Acetylocholina"],
			connections: ["Entorhinal cortex", "Subiculum", "Mammillary bodies"],
			polishConnections: ["Kora entorynalna", "Subikulum", "Ciała mleczne"],
			disorders: ["Alzheimer's disease", "Epilepsy", "Amnesia"],
			polishDisorders: ["Choroba Alzheimera", "Epilepsja", "Amnezja"],
			development:
				"Develops prenatally, continues to generate new neurons throughout life",
			polishDevelopment:
				"Rozwija się prenatalnie, kontynuuje generowanie nowych neuronów przez całe życie",
		},
	],
	neurotransmitterSystems: ["acetylcholine", "glutamate", "gaba"],
	polishNeurotransmitterSystems: ["acetylocholina", "glutaminian", "GABA"],
	assessmentMethods: [
		"Memory recall tests",
		"Recognition tasks",
		"Spatial memory mazes",
		"Working memory span tasks",
	],
	polishAssessmentMethods: [
		"Testy odzyskiwania pamięci",
		"Zadania rozpoznawania",
		"Labirynty pamięci przestrzennej",
		"Zadania zakresu pamięci operacyjnej",
	],
	developmentTrajectory: [
		{
			stage: "Early Childhood",
			polishStage: "Wczesne dzieciństwo",
			ageRange: "2-6 years",
			cognitiveCharacteristics: [
				"Rapid development of episodic memory",
				"Emergence of semantic memory",
				"Limited working memory capacity",
			],
			polishCognitiveCharacteristics: [
				"Szybki rozwój pamięci epizodycznej",
				"Pojawienie się pamięci semantycznej",
				"Ograniczone możliwości pamięci operacyjnej",
			],
			peakPerformance: 20,
			declineOnset: "65+ years",
		},
		{
			stage: "Adolescence",
			polishStage: "Adolescencja",
			ageRange: "13-18 years",
			cognitiveCharacteristics: [
				"Peak working memory capacity",
				"Continued development of episodic memory",
				"Improved memory strategies",
			],
			polishCognitiveCharacteristics: [
				"Szczyt możliwości pamięci operacyjnej",
				"Kontynuowany rozwój pamięci epizodycznej",
				"Ulepszone strategie pamięciowe",
			],
			peakPerformance: 85,
			declineOnset: "65+ years",
		},
		{
			stage: "Young Adulthood",
			polishStage: "Młoda dorosłość",
			ageRange: "19-35 years",
			cognitiveCharacteristics: [
				"Peak performance across all memory domains",
				"Optimal memory consolidation",
				"Efficient encoding strategies",
			],
			polishCognitiveCharacteristics: [
				"Szczytowe osiągi we wszystkich dziedzinach pamięci",
				"Optymalna konsolidacja pamięci",
				"Efektywne strategie kodowania",
			],
			peakPerformance: 100,
			declineOnset: "65+ years",
		},
		{
			stage: "Middle Age",
			polishStage: "Średni wiek",
			ageRange: "36-64 years",
			cognitiveCharacteristics: [
				"Slight decline in working memory",
				"Stable semantic memory",
				"Strategic compensation for episodic memory",
			],
			polishCognitiveCharacteristics: [
				"Lekki spadek pamięci operacyjnej",
				"Stabilna pamięć semantyczna",
				"Kompensacja strategiczna pamięci epizodycznej",
			],
			peakPerformance: 95,
			declineOnset: "65+ years",
		},
		{
			stage: "Older Adulthood",
			polishStage: "Starszy wiek dorosły",
			ageRange: "65+ years",
			cognitiveCharacteristics: [
				"Noticeable decline in episodic memory",
				"Relatively preserved semantic memory",
				"Changes in memory strategies",
			],
			polishCognitiveCharacteristics: [
				"Zauważalny spadek pamięci epizodycznej",
				"Relatywnie zachowana pamięć semantyczna",
				"Zmiany w strategiach pamięciowych",
			],
			peakPerformance: 70,
			declineOnset: "65+ years",
		},
	],
	polishDevelopmentTrajectory: [
		"Wczesne dzieciństwo (2-6 lat)",
		"Adolescencja (13-18 lat)",
		"Młoda dorosłość (19-35 lat)",
		"Średni wiek (36-64 lat)",
		"Starszy wiek dorosły (65+ lat)",
	],
	relatedDisorders: [
		"Alzheimer's disease",
		"Amnestic mild cognitive impairment",
		"Korsakoff syndrome",
		"Epilepsy",
	],
	polishRelatedDisorders: [
		"Choroba Alzheimera",
		"Amnestyczne łagodne zaburzenia poznawcze",
		"Zespół Korsakowa",
		"Epilepsja",
	],
	cognitiveEnhancementStrategies: [
		{
			id: "mnemonic-training",
			name: "Mnemonic Training",
			polishName: "Szkolenie mnemoniczne",
			description:
				"Systematic training in memory techniques like the method of loci, acronyms, and visualization strategies.",
			polishDescription:
				"Systematyczne szkolenie w technikach pamięciowych jak metoda lokusów, akronimy i strategie wizualizacyjne.",
			type: "behavioral",
			polishType: "behawioralna",
			evidenceLevel: "STRONG",
			effectiveness: 75,
			duration: "4-8 weeks",
			polishDuration: "4-8 tygodni",
			sideEffects: [
				"Increased mental fatigue initially",
				"Time commitment required",
			],
			polishSideEffects: [
				"Zwiększona mentalna zmęczenie początkowo",
				"Wymagany czas zaangażowania",
			],
			contraindications: ["Severe cognitive impairment", "Active psychosis"],
			polishContraindications: [
				"Poważne zaburzenia poznawcze",
				"Aktywna psychoza",
			],
			recommendedProtocol:
				"30 minutes daily training focusing on visualization and association techniques",
			polishRecommendedProtocol:
				"30 minut dziennego treningu skupiającego się na technikach wizualizacji i skojarzeń",
		},
	],
	evidenceLevel: "STRONG",
	researchStudies: [
		{
			id: "park-2014",
			title:
				"The impact of sustained engagement on cognitive function in older adults",
			polishTitle:
				"Wpływ utrzymującego się zaangażowania na funkcję poznawczą u osób starszych",
			authors: [
				"Park D",
				"Lodi-Smith J",
				"Drew L",
				"Christian B",
				"Dempster C",
				"Draughn C",
				"Finley S",
				"George J",
				"Gross A",
				"Hill S",
				"Hess T",
				"Lindenberger U",
				"Mayhorn C",
				"Morrow D",
				"Singer T",
			],
			journal: "Psychological Science",
			year: 2014,
			studyType: "RANDOMIZED_CONTROLLED_TRIAL",
			primaryOutcome: "Working memory improvement",
			polishPrimaryOutcome: "Poprawa pamięci operacyjnej",
			findings:
				"Sustained cognitive training leads to measurable improvements in working memory",
			polishFindings:
				"Utrzymane treningi poznawcze prowadzą do mierzalnych popraw w pamięci operacyjnej",
			evidenceLevel: "STRONG",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "25033412",
			doi: "10.1177/0956797614543717",
			sampleSize: 1228,
			participantCount: 1228,
			duration: "10 weeks",
			dosage: "1 hour daily training",
			results: "Significant improvement in working memory tasks",
			polishResults: "Znacząca poprawa w zadaniach pamięci operacyjnej",
			secondaryOutcomes: [
				"Improved episodic memory",
				"Better executive function",
				"Enhanced processing speed",
			],
			polishSecondaryOutcomes: [
				"Poprawiona pamięć epizodyczna",
				"Lepsza funkcja egzekutywna",
				"Wzmocniona szybkość przetwarzania",
			],
			limitations: "Effects may not generalize to non-trained tasks",
			polishLimitations:
				"Efekty mogą się nie uogólniać na zadania nie trenowane",
			qualityScore: 9.0,
			conflictOfInterest: "None declared",
			polishConflictOfInterest: "Brak zadeklarowanych",
			funding: "National Institute on Aging",
			polishFunding: "Narodowy Instytut Starości",
			url: "https://journals.sagepub.com/doi/10.1177/0956797614543717",
			abstract:
				"Cognitive training programs produce measurable improvements in specific cognitive domains, with working memory showing the most consistent benefits.",
			polishAbstract:
				"Programy treningu poznawczego dają mierzalne poprawy w konkretnych dziedzinach poznawczych, z pamięcią operacyjną wykazującą najbardziej spójne korzyści.",
			keywords: [
				"cognitive training",
				"working memory",
				"aging",
				"neuroplasticity",
			],
			meshTerms: ["Cognitive Training", "Memory", "Aging", "Neuroplasticity"],
			citationCount: 280,
		},
	],
	tags: [
		"memory",
		"cognition",
		"hippocampus",
		"learning",
		"encoding",
		"consolidation",
		"retrieval",
	],
	lastUpdated: "2024-01-15T00:00:00Z",
	createdAt: "2024-01-15T00:00:00Z",
};

// Attention domain
export const attentionDomain: CognitiveFunction = {
	id: "attention",
	name: "Attention",
	polishName: "Uwaga",
	description:
		"Attention is the cognitive process of selectively concentrating on specific information while ignoring other perceivable information. It encompasses multiple types including sustained attention, selective attention, divided attention, and executive attention.",
	polishDescription:
		"Uwaga to proces poznawczy selektywnego koncentrowania się na konkretnych informacjach przy ignorowaniu innych postrzegalnych informacji. Obejmuje wiele typów w tym uwagę utrzymującą, selektywną, podzieloną i egzekutywną.",
	primaryDomains: [
		"Sustained attention",
		"Selective attention",
		"Divided attention",
		"Executive attention",
	],
	polishPrimaryDomains: [
		"Uwaga utrzymująca",
		"Uwaga selektywna",
		"Uwaga podzielona",
		"Uwaga egzekutywna",
	],
	subFunctions: [
		{
			id: "sustained-attention",
			name: "Sustained Attention",
			polishName: "Uwaga utrzymująca",
			description:
				"Sustained attention is the ability to maintain attention to a specific task over an extended period of time.",
			polishDescription:
				"Uwaga utrzymująca to zdolność do utrzymywania uwagi na konkretnym zadaniu przez przedłużony okres czasu.",
			relatedCognitiveDomains: ["cognitive-control", "vigilance"],
			neuralNetworks: [
				"Anterior Cingulate",
				"Prefrontal Cortex",
				"Parietal Cortex",
			],
			polishNeuralNetworks: [
				"Pasma przykorytowe",
				"Kora czołowa",
				"Kora ciemieniowa",
			],
			typicalAssessment: [
				"Continuous performance test",
				"Sustained attention to response task",
				"Vigilance tasks",
			],
			polishTypicalAssessment: [
				"Test ciągłej wydajności",
				"Zadanie utrzymującej uwagi na reakcję",
				"Zadania czujności",
			],
			developmentTimeline:
				"Develops throughout childhood, peaks in young adulthood",
			polishDevelopmentTimeline:
				"Rozwija się przez całe dzieciństwo, osiąga szczyt w młodym dorosłości",
			enhancementPotential: "high",
		},
		{
			id: "selective-attention",
			name: "Selective Attention",
			polishName: "Uwaga selektywna",
			description:
				"Selective attention is the ability to focus on relevant stimuli while filtering out irrelevant information.",
			polishDescription:
				"Uwaga selektywna to zdolność do skupiania się na istotnych bodźcach przy filtrowaniu nieistotnych informacji.",
			relatedCognitiveDomains: ["inhibition", "perception"],
			neuralNetworks: [
				"Prefrontal Cortex",
				"Anterior Cingulate",
				"Visual Association Areas",
			],
			polishNeuralNetworks: [
				"Kora czołowa",
				"Pasma przykorytowe",
				"Obszary asocjacyjne wzrokowe",
			],
			typicalAssessment: [
				"Stroop test",
				"Flanker task",
				"Attention network test",
			],
			polishTypicalAssessment: [
				"Test Stroopa",
				"Zadanie flagi",
				"Test sieci uwagi",
			],
			developmentTimeline:
				"Develops rapidly in early childhood, reaches adult levels by age 7",
			polishDevelopmentTimeline:
				"Rozwija się szybko w wczesnym dzieciństwie, osiąga poziomy dorosłe do 7. roku życia",
			enhancementPotential: "moderate",
		},
		{
			id: "divided-attention",
			name: "Divided Attention",
			polishName: "Uwaga podzielona",
			description:
				"Divided attention is the ability to respond simultaneously to multiple tasks or multiple sources of information.",
			polishDescription:
				"Uwaga podzielona to zdolność do jednoczesnej reakcji na wiele zadań lub wielu źródeł informacji.",
			relatedCognitiveDomains: ["multitasking", "working-memory"],
			neuralNetworks: [
				"Prefrontal Cortex",
				"Parietal Cortex",
				"Anterior Cingulate",
			],
			polishNeuralNetworks: [
				"Kora czołowa",
				"Kora ciemieniowa",
				"Pasma przykorytowe",
			],
			typicalAssessment: [
				"Dual-task paradigms",
				"Multiple object tracking task",
				"Divided attention tests",
			],
			polishTypicalAssessment: [
				"Paradygmaty z podwójnym zadaniem",
				"Zadanie śledzenia wielu obiektów",
				"Testy uwagi podzielonej",
			],
			developmentTimeline:
				"Develops gradually through childhood, peaks in early adulthood",
			polishDevelopmentTimeline:
				"Rozwija się stopniowo przez dzieciństwo, osiąga szczyt w młodym dorosłości",
			enhancementPotential: "moderate",
		},
	],
	associatedBrainRegions: [
		{
			id: "anteriorcingulate",
			name: "Anterior Cingulate Cortex",
			polishName: "Przednia kora przykorytowa",
			primaryFunction: "Attention monitoring and conflict resolution",
			polishPrimaryFunction: "Monitorowanie uwagi i rozwiązywanie konfliktów",
			volume: 2.7,
			functions: [
				"Error detection",
				"Conflict monitoring",
				"Attention regulation",
			],
			polishFunctions: [
				"Wykrywanie błędów",
				"Monitorowanie konfliktów",
				"Regulacja uwagi",
			],
			neurotransmitters: ["Dopamine", "Serotonin", "Norepinephrine"],
			polishNeurotransmitters: ["Dopamina", "Serotonina", "Noradrenalina"],
			connections: ["Prefrontal cortex", "Parietal cortex", "Thalamus"],
			polishConnections: ["Kora czołowa", "Kora ciemieniowa", "Talamus"],
			disorders: ["ADHD", "Depression", "Anxiety disorders"],
			polishDisorders: ["ADHD", "Depresja", "Zaburzenia lękowe"],
			development:
				"Develops throughout adolescence, reaches adult levels by early twenties",
			polishDevelopment:
				"Rozwija się przez okres dojrzewania, osiąga poziomy dorosłe do wczesnych lat dwudziestych",
		},
	],
	neurotransmitterSystems: ["dopamine", "norepinephrine", "acetylcholine"],
	polishNeurotransmitterSystems: [
		"dopamina",
		"noradrenalina",
		"acetylocholina",
	],
	assessmentMethods: [
		"Continuous performance test",
		"Attention network test",
		"Stroop test",
		"Flanker task",
	],
	polishAssessmentMethods: [
		"Test ciągłej wydajności",
		"Test sieci uwagi",
		"Test Stroopa",
		"Zadanie flagi",
	],
	developmentTrajectory: [
		{
			stage: "Early Childhood",
			polishStage: "Wczesne dzieciństwo",
			ageRange: "3-6 years",
			cognitiveCharacteristics: [
				"Limited attention span",
				"Frequent attention shifting",
				"Difficulty with sustained attention",
			],
			polishCognitiveCharacteristics: [
				"Ograniczony zakres uwagi",
				"Częste przełączanie uwagi",
				"Trudności z utrzymaniem uwagi",
			],
			peakPerformance: 25,
			declineOnset: "65+ years",
		},
		{
			stage: "Middle Childhood",
			polishStage: "Średnie dzieciństwo",
			ageRange: "7-12 years",
			cognitiveCharacteristics: [
				"Improved selective attention",
				"Better sustained attention",
				"Developing executive attention",
			],
			polishCognitiveCharacteristics: [
				"Ulepszona uwaga selektywna",
				"Lepsza uwaga utrzymująca",
				"Rozwijająca się uwaga egzekutywna",
			],
			peakPerformance: 50,
			declineOnset: "65+ years",
		},
		{
			stage: "Adolescence",
			polishStage: "Adolescencja",
			ageRange: "13-18 years",
			cognitiveCharacteristics: [
				"Peak attention control",
				"Developing cognitive flexibility",
				"Improved attention regulation",
			],
			polishCognitiveCharacteristics: [
				"Szczytowy kontrola uwagi",
				"Rozwijająca się elastyczność poznawcza",
				"Ulepszona regulacja uwagi",
			],
			peakPerformance: 80,
			declineOnset: "65+ years",
		},
		{
			stage: "Young Adulthood",
			polishStage: "Młoda dorosłość",
			ageRange: "19-35 years",
			cognitiveCharacteristics: [
				"Peak sustained attention",
				"Optimal attention allocation",
				"Efficient conflict resolution",
			],
			polishCognitiveCharacteristics: [
				"Szczytowa uwaga utrzymująca",
				"Optymalne przydzielanie uwagi",
				"Efektywne rozwiązywanie konfliktów",
			],
			peakPerformance: 100,
			declineOnset: "65+ years",
		},
		{
			stage: "Older Adulthood",
			polishStage: "Starszy wiek dorosły",
			ageRange: "65+ years",
			cognitiveCharacteristics: [
				"Decline in divided attention",
				"Sustained attention relatively preserved",
				"Increased distractibility",
			],
			polishCognitiveCharacteristics: [
				"Spadek uwagi podzielonej",
				"Relatywnie zachowana uwaga utrzymująca",
				"Zwiększona podatność na rozproszenie",
			],
			peakPerformance: 70,
			declineOnset: "65+ years",
		},
	],
	polishDevelopmentTrajectory: [
		"Wczesne dzieciństwo (3-6 lat)",
		"Średnie dzieciństwo (7-12 lat)",
		"Adolescencja (13-18 lat)",
		"Młoda dorosłość (19-35 lat)",
		"Starszy wiek dorosły (65+ lat)",
	],
	relatedDisorders: ["ADHD", "Traumatic Brain Injury", "Stroke", "Dementia"],
	polishRelatedDisorders: ["ADHD", "Uraz mózgu", "Udar", "Demencja"],
	cognitiveEnhancementStrategies: [
		{
			id: "mindfulness-training",
			name: "Mindfulness Training",
			polishName: "Szkolenie osiągalności",
			description:
				"Systematic meditation and awareness practices to improve sustained attention and reduce mind-wandering.",
			polishDescription:
				"Systematyczne praktyki medytacji i świadomości w celu poprawy utrzymującej uwagi i zmniejszenia błądzenia myślowego.",
			type: "behavioral",
			polishType: "behawioralna",
			evidenceLevel: "STRONG",
			effectiveness: 80,
			duration: "8 weeks",
			polishDuration: "8 tygodni",
			sideEffects: [
				"Initial frustration with mind-wandering",
				"Increased awareness of thoughts",
			],
			polishSideEffects: [
				"Początkowe frustracje z powodu błądzenia myślowego",
				"Zwiększona świadomość myśli",
			],
			contraindications: [
				"Psychotic disorders",
				"Severe dissociative disorders",
			],
			polishContraindications: [
				"Zaburzenia psychozy",
				"Poważne zaburzenia rozszczepienia",
			],
			recommendedProtocol:
				"Daily 20-45 minutes of mindfulness meditation focusing on attention to breath",
			polishRecommendedProtocol:
				"Codziennie 20-45 minut medytacji uważności skupiającej się na oddechu",
		},
	],
	evidenceLevel: "STRONG",
	researchStudies: [
		{
			id: "tang-2007",
			title:
				"Short-term meditation training improves attention and self-regulation",
			polishTitle:
				"Krótkoterminowe szkolenie medytacyjne poprawia uwagę i samoregulację",
			authors: [
				"Tang Y",
				"Ma Y",
				"Wang J",
				"Fan Y",
				"Feng S",
				"Lu Q",
				"Yu Q",
				"Sui D",
				"Rothbart M",
				"Fan M",
				"Posner M",
			],
			journal: "Proceedings of the National Academy of Sciences",
			year: 2007,
			studyType: "RANDOMIZED_CONTROLLED_TRIAL",
			primaryOutcome: "Attention improvement",
			polishPrimaryOutcome: "Poprawa uwagi",
			findings:
				"Brief meditation training significantly improved attention and executive control",
			polishFindings:
				"Krótkie szkolenie medytacyjne znacząco poprawiło uwagę i kontrolę egzekutywną",
			evidenceLevel: "STRONG",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "17420446",
			doi: "10.1073/pnas.0700418104",
			sampleSize: 40,
			participantCount: 40,
			duration: "5 days",
			dosage: "5 days of 5 hours training",
			results: "Significant improvement in attention network test",
			polishResults: "Znacząca poprawa w teście sieci uwagi",
			secondaryOutcomes: [
				"Improved mood",
				"Reduced anxiety",
				"Better attention regulation",
			],
			polishSecondaryOutcomes: [
				"Poprawiony nastrój",
				"Zmniejszony lęk",
				"Lepsza regulacja uwagi",
			],
			limitations: "Small sample size",
			polishLimitations: "Mały rozmiar próbki",
			qualityScore: 8.5,
			conflictOfInterest: "None declared",
			polishConflictOfInterest: "Brak zadeklarowanych",
			funding: "National Foundation of Natural Sciences of China",
			polishFunding: "Narodowy Fundusz Nauk Przyrodniczych Chin",
			url: "https://www.pnas.org/doi/10.1073/pnas.0700418104",
			abstract:
				"Intensive meditation training over just 5 days significantly improved attention and executive control as measured by the Attention Network Test.",
			polishAbstract:
				"Intensywne szkolenie medytacyjne przez zaledwie 5 dni znacząco poprawiło uwagę i kontrolę egzekutywną mierzoną testem sieci uwagi.",
			keywords: [
				"meditation",
				"attention",
				"executive function",
				"mindfulness",
			],
			meshTerms: ["Meditation", "Attention", "Executive Function", "Cognition"],
			citationCount: 600,
		},
	],
	tags: [
		"attention",
		"cognition",
		"focus",
		"concentration",
		"executive function",
		"sustained attention",
		"selective attention",
	],
	lastUpdated: "2024-01-15T00:00:00Z",
	createdAt: "2024-01-15T00:00:00Z",
};

// Executive function domain
export const executiveFunctionDomain: CognitiveFunction = {
	id: "executive-function",
	name: "Executive Function",
	polishName: "Funkcja egzekutywna",
	description:
		"Executive function refers to cognitive processes that control and regulate other cognitive processes and behaviors. It includes cognitive flexibility, working memory, and inhibitory control, which enable goal-directed behavior and adaptation to changing environments.",
	polishDescription:
		"Funkcja egzekutywna odnosi się do procesów poznawczych, które kontrolują i regulują inne procesy poznawcze i zachowania. Obejmuje elastyczność poznawczą, pamięć operacyjną i kontrolę hamującą, które umożliwiają zachowanie ukierunkowane na cel i adaptację do zmieniających się środowisk.",
	primaryDomains: [
		"Cognitive flexibility",
		"Working memory",
		"Inhibitory control",
	],
	polishPrimaryDomains: [
		"Elastyczność poznawcza",
		"Pamięć operacyjna",
		"Kontrola hamująca",
	],
	subFunctions: [
		{
			id: "cognitive-flexibility",
			name: "Cognitive Flexibility",
			polishName: "Elastyczność poznawcza",
			description:
				"Cognitive flexibility is the mental ability to switch between thinking about different concepts or to think about multiple concepts simultaneously.",
			polishDescription:
				"Elastyczność poznawcza to zdolność mentalna do przełączania się między myśleniem o różnych koncepcjach lub myśleniem o wielu koncepcjach jednocześnie.",
			relatedCognitiveDomains: ["attention", "task-switching"],
			neuralNetworks: [
				"Prefrontal Cortex",
				"Anterior Cingulate",
				"Dorsal Lateral Prefrontal Cortex",
			],
			polishNeuralNetworks: [
				"Kora czołowa",
				"Pasma przykorytowe",
				"Dorsolateralna kora czołowa",
			],
			typicalAssessment: [
				"Wisconsin card sorting test",
				"Task switching paradigms",
				"Trail making test",
			],
			polishTypicalAssessment: [
				"Test karciany Wisconsin",
				"Paradygmaty przełączania zadań",
				"Test śledzenia",
			],
			developmentTimeline:
				"Develops throughout childhood and adolescence, peaks in young adulthood",
			polishDevelopmentTimeline:
				"Rozwija się przez całe dzieciństwo i adolescencję, osiąga szczyt w młodym dorosłości",
			enhancementPotential: "high",
		},
		{
			id: "inhibitory-control",
			name: "Inhibitory Control",
			polishName: "Kontrola hamująca",
			description:
				"Inhibitory control is the ability to suppress inappropriate behaviors, thoughts, or responses that are not relevant to the current goal.",
			polishDescription:
				"Kontrola hamująca to zdolność do hamowania nieodpowiednich zachowań, myśli lub reakcji, które nie są istotne dla bieżącego celu.",
			relatedCognitiveDomains: ["impulse-control", "attention"],
			neuralNetworks: [
				"Orbitofrontal Cortex",
				"Inferior Frontal Gyrus",
				"Supplementary Motor Area",
			],
			polishNeuralNetworks: [
				"Kora orbityczołowa",
				"Gyri czołowe dolne",
				"Dodatkowy obszar motoryczny",
			],
			typicalAssessment: ["Go/No-go tasks", "Stop signal tasks", "Stroop test"],
			polishTypicalAssessment: [
				"Zadania Go/No-go",
				"Zadania sygnału stop",
				"Test Stroopa",
			],
			developmentTimeline:
				"Develops rapidly in early childhood, continues developing through adolescence",
			polishDevelopmentTimeline:
				"Rozwija się szybko w wczesnym dzieciństwie, kontynuuje rozwój przez adolescencję",
			enhancementPotential: "moderate",
		},
		{
			id: "working-memory",
			name: "Working Memory",
			polishName: "Pamięć operacyjna",
			description:
				"Working memory is the cognitive system responsible for temporarily holding and manipulating information needed for complex cognitive tasks.",
			polishDescription:
				"Pamięć operacyjna to system poznawczy odpowiedzialny za tymczasowe przechowywanie i manipulowanie informacjami potrzebnymi do złożonych zadań poznawczych.",
			relatedCognitiveDomains: ["memory", "attention"],
			neuralNetworks: [
				"Dorsolateral Prefrontal Cortex",
				"Parietal Cortex",
				"Anterior Cingulate",
			],
			polishNeuralNetworks: [
				"Dorsolateralna kora czołowa",
				"Kora ciemieniowa",
				"Pasma przykorytowe",
			],
			typicalAssessment: [
				"N-back task",
				"Spatial delayed response",
				"Digit span test",
			],
			polishTypicalAssessment: [
				"Zadanie N-back",
				"Odpowiedź opóźniona przestrzenna",
				"Test zakresu cyfr",
			],
			developmentTimeline:
				"Develops throughout childhood, peaks in young adulthood",
			polishDevelopmentTimeline:
				"Rozwija się przez całe dzieciństwo, osiąga szczyt w młodym dorosłości",
			enhancementPotential: "high",
		},
	],
	associatedBrainRegions: [
		{
			id: "dlpfc",
			name: "Dorsolateral Prefrontal Cortex",
			polishName: "Dorsolateralna kora czołowa",
			primaryFunction: "Working memory and cognitive control",
			polishPrimaryFunction: "Pamięć operacyjna i kontrola poznawcza",
			volume: 22.5,
			functions: [
				"Working memory maintenance",
				"Cognitive control",
				"Attention regulation",
			],
			polishFunctions: [
				"Utrzymanie pamięci operacyjnej",
				"Kontrola poznawcza",
				"Regulacja uwagi",
			],
			neurotransmitters: ["Dopamine", "Norepinephrine", "Acetylcholine"],
			polishNeurotransmitters: ["Dopamina", "Noradrenalina", "Acetylocholina"],
			connections: ["Anterior cingulate", "Parietal cortex", "Thalamus"],
			polishConnections: ["Pasma przykorytowe", "Kora ciemieniowa", "Talamus"],
			disorders: ["ADHD", "Schizophrenia", "Executive dysfunction"],
			polishDisorders: ["ADHD", "Schizofrenia", "Dysfunkcja egzekutywna"],
			development:
				"Develops throughout adolescence, reaches adult levels in early twenties",
			polishDevelopment:
				"Rozwija się przez okres dojrzewania, osiąga poziomy dorosłe we wczesnych latach dwudziestych",
		},
	],
	neurotransmitterSystems: ["dopamine", "norepinephrine", "acetylcholine"],
	polishNeurotransmitterSystems: [
		"dopamina",
		"noradrenalina",
		"acetylocholina",
	],
	assessmentMethods: [
		"Wisconsin card sorting test",
		"Stroop test",
		"Flanker task",
		"N-back task",
	],
	polishAssessmentMethods: [
		"Test karciany Wisconsin",
		"Test Stroopa",
		"Zadanie flagi",
		"Zadanie N-back",
	],
	developmentTrajectory: [
		{
			stage: "Early Childhood",
			polishStage: "Wczesne dzieciństwo",
			ageRange: "3-6 years",
			cognitiveCharacteristics: [
				"Limited inhibitory control",
				"Difficulty with task switching",
				"Immature working memory",
			],
			polishCognitiveCharacteristics: [
				"Ograniczona kontrola hamująca",
				"Trudności z przełączaniem zadań",
				"Niedojrzała pamięć operacyjna",
			],
			peakPerformance: 20,
			declineOnset: "60+ years",
		},
		{
			stage: "Middle Childhood",
			polishStage: "Średnie dzieciństwo",
			ageRange: "7-12 years",
			cognitiveCharacteristics: [
				"Improving cognitive flexibility",
				"Developing inhibitory control",
				"Expanding working memory capacity",
			],
			polishCognitiveCharacteristics: [
				"Ulepszająca się elastyczność poznawcza",
				"Rozwijająca się kontrola hamująca",
				"Rozszerzające się możliwości pamięci operacyjnej",
			],
			peakPerformance: 60,
			declineOnset: "60+ years",
		},
		{
			stage: "Adolescence",
			polishStage: "Adolescencja",
			ageRange: "13-18 years",
			cognitiveCharacteristics: [
				"Peak cognitive flexibility",
				"Mature inhibitory control",
				"Near-adult working memory",
			],
			polishCognitiveCharacteristics: [
				"Szczytowa elastyczność poznawcza",
				"Dojrzała kontrola hamująca",
				"Prawie dorosła pamięć operacyjna",
			],
			peakPerformance: 90,
			declineOnset: "60+ years",
		},
		{
			stage: "Young Adulthood",
			polishStage: "Młoda dorosłość",
			ageRange: "19-35 years",
			cognitiveCharacteristics: [
				"Peak executive function performance",
				"Optimal cognitive control",
				"Efficient working memory",
			],
			polishCognitiveCharacteristics: [
				"Szczytowe osiągi funkcji egzekutywnych",
				"Optymalna kontrola poznawcza",
				"Efektywna pamięć operacyjna",
			],
			peakPerformance: 100,
			declineOnset: "60+ years",
		},
		{
			stage: "Older Adulthood",
			polishStage: "Starszy wiek dorosły",
			ageRange: "60+ years",
			cognitiveCharacteristics: [
				"Decline in cognitive flexibility",
				"Preserved inhibitory control",
				"Working memory challenges",
			],
			polishCognitiveCharacteristics: [
				"Spadek elastyczności poznawczej",
				"Zachowana kontrola hamująca",
				"Wyzwania pamięci operacyjnej",
			],
			peakPerformance: 75,
			declineOnset: "60+ years",
		},
	],
	polishDevelopmentTrajectory: [
		"Wczesne dzieciństwo (3-6 lat)",
		"Średnie dzieciństwo (7-12 lat)",
		"Adolescencja (13-18 lat)",
		"Młoda dorosłość (19-35 lat)",
		"Starszy wiek dorosły (60+ lat)",
	],
	relatedDisorders: [
		"ADHD",
		"Executive function disorder",
		"Traumatic brain injury",
		"Frontotemporal dementia",
		"Autism spectrum disorder",
	],
	polishRelatedDisorders: [
		"ADHD",
		"Zaburzenie funkcji egzekutywnych",
		"Uraz mózgu",
		"Czołowo-skroniowa demencja",
		"Zespół autyzmu",
	],
	cognitiveEnhancementStrategies: [
		{
			id: "executive-training",
			name: "Executive Function Training",
			polishName: "Szkolenie funkcji egzekutywnych",
			description:
				"Systematic training in cognitive control, working memory, and cognitive flexibility tasks.",
			polishDescription:
				"Systematyczne szkolenie w zadaniach kontroli poznawczej, pamięci operacyjnej i elastyczności poznawczej.",
			type: "behavioral",
			polishType: "behawioralna",
			evidenceLevel: "MODERATE",
			effectiveness: 70,
			duration: "6-12 weeks",
			polishDuration: "6-12 tygodni",
			sideEffects: [
				"Mental fatigue during training",
				"Frustration with difficult tasks",
			],
			polishSideEffects: [
				"Mentalne zmęczenie podczas szkolenia",
				"Frustracja z powodu trudnych zadań",
			],
			contraindications: ["Severe cognitive impairment", "Active psychosis"],
			polishContraindications: [
				"Poważne zaburzenia poznawcze",
				"Aktywna psychoza",
			],
			recommendedProtocol:
				"30-45 minutes daily training focusing on working memory and cognitive flexibility exercises",
			polishRecommendedProtocol:
				"30-45 minut dziennego treningu skupiającego się na ćwiczeniach pamięci operacyjnej i elastyczności poznawczej",
		},
	],
	evidenceLevel: "STRONG",
	researchStudies: [
		{
			id: "diamond-2013",
			title: "Executive functions",
			polishTitle: "Funkcje egzekutywne",
			authors: ["Diamond A"],
			journal: "Annual Review of Psychology",
			year: 2013,
			studyType: "SYSTEMATIC_REVIEW",
			primaryOutcome: "Executive function development",
			polishPrimaryOutcome: "Rozwój funkcji egzekutywnych",
			findings:
				"Comprehensive review of executive function components and development",
			polishFindings:
				"Zprehensive przegląd komponentów i rozwoju funkcji egzekutywnych",
			evidenceLevel: "STRONG",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "23020618",
			doi: "10.1146/annurev-psych-113011-143750",
			sampleSize: 0,
			participantCount: 0,
			duration: "N/A",
			dosage: "",
			results:
				"Executive functions develop gradually through childhood and adolescence",
			polishResults:
				"Funkcje egzekutywne rozwijają się stopniowo przez dzieciństwo i adolescencję",
			secondaryOutcomes: [
				"Neurobiological basis",
				"Developmental trajectory",
				"Clinical implications",
			],
			polishSecondaryOutcomes: [
				"Podstawa neurobiologiczna",
				"Trajektoria rozwojowa",
				"Implikacje kliniczne",
			],
			limitations: "Reviews primarily neuroimaging and behavioral studies",
			polishLimitations:
				"Przegląda głównie badania obrazowania nerwowego i behawioralne",
			qualityScore: 9.5,
			conflictOfInterest: "None declared",
			polishConflictOfInterest: "Brak zadeklarowanych",
			funding: "National Institute of Child Health and Human Development",
			polishFunding: "Narodowy Instytut Zdrowia Dziecka i Rozwoju Człowieka",
			url: "https://www.annualreviews.org/doi/10.1146/annurev-psych-113011-143750",
			abstract:
				"Executive functions emerge from the prefrontal cortex and related structures, developing gradually throughout childhood and into early adulthood.",
			polishAbstract:
				"Funkcje egzekutywne pochodzą z kory przedczołowej i powiązanych struktur, rozwijając się stopniowo przez dzieciństwo i młody dorosłość.",
			keywords: [
				"executive function",
				"prefrontal cortex",
				"development",
				"cognitive control",
			],
			meshTerms: [
				"Executive Function",
				"Prefrontal Cortex",
				"Cognition",
				"Child Development",
			],
			citationCount: 1200,
		},
	],
	tags: [
		"executive function",
		"cognition",
		"prefrontal cortex",
		"working memory",
		"inhibitory control",
		"cognitive flexibility",
		"cognitive control",
	],
	lastUpdated: "2024-01-15T00:00:00Z",
	createdAt: "2024-01-15T00:00:00Z",
};

// Processing speed domain
export const processingSpeedDomain: CognitiveFunction = {
	id: "processing-speed",
	name: "Processing Speed",
	polishName: "Szybkość przetwarzania",
	description:
		"Processing speed refers to the rate at which an individual can perceive, process, and respond to information. It is a fundamental cognitive ability that underlies performance across many cognitive domains.",
	polishDescription:
		"Szybkość przetwarzania odnosi się do tempa, w jakim jednostka może postrzegać, przetwarzać i odpowiadać na informacje. Jest fundamentalną zdolnością poznawczą, która podstawia wydajność we wielu dziedzinach poznawczych.",
	primaryDomains: ["Perceptual speed", "Mental speed", "Reaction time"],
	polishPrimaryDomains: [
		"Szybkość percepcyjna",
		"Szybkość mentalna",
		"Czas reakcji",
	],
	subFunctions: [
		{
			id: "perceptual-speed",
			name: "Perceptual Speed",
			polishName: "Szybkość percepcyjna",
			description:
				"Perceptual speed is the ability to quickly identify visual or auditory information and respond to it.",
			polishDescription:
				"Szybkość percepcyjna to zdolność do szybkiego identyfikowania informacji wizualnych lub słuchowych i reagowania na nie.",
			relatedCognitiveDomains: ["attention", "perception"],
			neuralNetworks: ["Visual Cortex", "Auditory Cortex", "Parietal Cortex"],
			polishNeuralNetworks: [
				"Kora wzrokowa",
				"Kora słuchowa",
				"Kora ciemieniowa",
			],
			typicalAssessment: [
				"Symbol digit modalities test",
				"Trail making test",
				"Visual search tasks",
			],
			polishTypicalAssessment: [
				"Test symboli cyfr",
				"Test śledzenia",
				"Zadania wyszukiwania wizualnego",
			],
			developmentTimeline:
				"Develops throughout childhood, peaks in adolescence",
			polishDevelopmentTimeline:
				"Rozwija się przez całe dzieciństwo, osiąga szczyt w adolescencji",
			enhancementPotential: "moderate",
		},
		{
			id: "mental-speed",
			name: "Mental Speed",
			polishName: "Szybkość mentalna",
			description:
				"Mental speed refers to the velocity of mental operations and thought processes.",
			polishDescription:
				"Szybkość mentalna odnosi się do prędkości operacji mentalnych i procesów myślowych.",
			relatedCognitiveDomains: ["executive-function", "working-memory"],
			neuralNetworks: ["Prefrontal Cortex", "Thalamus", "White matter tracts"],
			polishNeuralNetworks: ["Kora czołowa", "Talamus", "Ścieżki białej masy"],
			typicalAssessment: [
				"Mental rotation tasks",
				"Rapid naming tasks",
				"Mental arithmetic",
			],
			polishTypicalAssessment: [
				"Zadania rotacji mentalnej",
				"Zadania szybkiego nazywania",
				"Rachunek mentalny",
			],
			developmentTimeline:
				"Develops through adolescence, peaks in young adulthood",
			polishDevelopmentTimeline:
				"Rozwija się przez adolescencję, osiąga szczyt w młodym dorosłości",
			enhancementPotential: "moderate",
		},
	],
	associatedBrainRegions: [
		{
			id: "white-matter",
			name: "White Matter",
			polishName: "Biała masa",
			primaryFunction: "Information transmission between brain regions",
			polishPrimaryFunction: "Przesyłanie informacji między obszarami mózgu",
			volume: 380.0,
			functions: [
				"Information transmission",
				"Connectivity",
				"Processing efficiency",
			],
			polishFunctions: [
				"Przesyłanie informacji",
				"Połączenia",
				"Efektywność przetwarzania",
			],
			neurotransmitters: ["Myelin integrity"],
			polishNeurotransmitters: ["Integralność mieliny"],
			connections: [
				"All brain regions",
				"Cortical-cortical connections",
				"Cortical-subcortical connections",
			],
			polishConnections: [
				"Wszystkie obszary mózgu",
				"Połączenia kora-kora",
				"Połączenia kora-podkora",
			],
			disorders: [
				"White matter disease",
				"Multiple sclerosis",
				"Processing speed deficits",
			],
			polishDisorders: [
				"Choroba białej masy",
				"Stwardnienie rozsiane",
				"Deficyty szybkości przetwarzania",
			],
			development:
				"Myelination continues through early adulthood, affecting processing speed",
			polishDevelopment:
				"Mielinizacja trwa przez wczesną dorosłość, wpływając na szybkość przetwarzania",
		},
	],
	neurotransmitterSystems: ["dopamine", "acetylcholine", "norepinephrine"],
	polishNeurotransmitterSystems: [
		"dopamina",
		"acetylocholina",
		"noradrenalina",
	],
	assessmentMethods: [
		"Symbol digit modalities test",
		"Trail making test",
		"Digit symbol coding",
		"Processing speed index",
	],
	polishAssessmentMethods: [
		"Test symboli cyfr",
		"Test śledzenia",
		"Kodowanie symbol-cyfra",
		"Indeks szybkości przetwarzania",
	],
	developmentTrajectory: [
		{
			stage: "Early Childhood",
			polishStage: "Wczesne dzieciństwo",
			ageRange: "3-6 years",
			cognitiveCharacteristics: [
				"Slow processing speed",
				"Long reaction times",
				"Limited processing capacity",
			],
			polishCognitiveCharacteristics: [
				"Wolna szybkość przetwarzania",
				"Długie czasy reakcji",
				"Ograniczone możliwości przetwarzania",
			],
			peakPerformance: 30,
			declineOnset: "65+ years",
		},
		{
			stage: "Middle Childhood",
			polishStage: "Średnie dzieciństwo",
			ageRange: "7-12 years",
			cognitiveCharacteristics: [
				"Rapid improvement in processing speed",
				"Faster reaction times",
				"Better mental efficiency",
			],
			polishCognitiveCharacteristics: [
				"Szybka poprawa szybkości przetwarzania",
				"Szybsze czasy reakcji",
				"Lepsza efektywność mentalna",
			],
			peakPerformance: 65,
			declineOnset: "65+ years",
		},
		{
			stage: "Adolescence",
			polishStage: "Adolescencja",
			ageRange: "13-18 years",
			cognitiveCharacteristics: [
				"Peak processing speed",
				"Fast cognitive operations",
				"Optimal neural efficiency",
			],
			polishCognitiveCharacteristics: [
				"Szczytowa szybkość przetwarzania",
				"Szybkie operacje poznawcze",
				"Optymalna efektywność nerwowa",
			],
			peakPerformance: 90,
			declineOnset: "65+ years",
		},
		{
			stage: "Young Adulthood",
			polishStage: "Młoda dorosłość",
			ageRange: "19-35 years",
			cognitiveCharacteristics: [
				"Sustained high processing speed",
				"Optimal reaction times",
				"Efficient cognitive operations",
			],
			polishCognitiveCharacteristics: [
				"Utrzymanie wysokiej szybkości przetwarzania",
				"Optymalne czasy reakcji",
				"Efektywne operacje poznawcze",
			],
			peakPerformance: 100,
			declineOnset: "65+ years",
		},
		{
			stage: "Older Adulthood",
			polishStage: "Starszy wiek dorosły",
			ageRange: "65+ years",
			cognitiveCharacteristics: [
				"Noticeable decline in processing speed",
				"Longer reaction times",
				"Slower cognitive operations",
			],
			polishCognitiveCharacteristics: [
				"Zauważalny spadek szybkości przetwarzania",
				"Dłuższe czasy reakcji",
				"Wolniejsze operacje poznawcze",
			],
			peakPerformance: 60,
			declineOnset: "65+ years",
		},
	],
	polishDevelopmentTrajectory: [
		"Wczesne dzieciństwo (3-6 lat)",
		"Średnie dzieciństwo (7-12 lat)",
		"Adolescencja (13-18 lat)",
		"Młoda dorosłość (19-35 lat)",
		"Starszy wiek dorosły (65+ lat)",
	],
	relatedDisorders: [
		"White matter disease",
		"Vascular dementia",
		"Depression",
		"Traumatic brain injury",
	],
	polishRelatedDisorders: [
		"Choroba białej masy",
		"Demencja naczyniowa",
		"Depresja",
		"Uraz mózgu",
	],
	cognitiveEnhancementStrategies: [
		{
			id: "speed-training",
			name: "Processing Speed Training",
			polishName: "Szkolenie szybkości przetwarzania",
			description:
				"Training designed to improve the speed of cognitive processing through repetitive timed tasks.",
			polishDescription:
				"Szkolenie zaprojektowane w celu poprawy szybkości przetwarzania poznawczego poprzez powtarzalne zadania czasowe.",
			type: "behavioral",
			polishType: "behawioralna",
			evidenceLevel: "MODERATE",
			effectiveness: 65,
			duration: "8-12 weeks",
			polishDuration: "8-12 tygodni",
			sideEffects: [
				"Frustration with timed tasks",
				"Increased anxiety about speed",
			],
			polishSideEffects: [
				"Frustracja z powodu zadań czasowych",
				"Zwiększony lęk dotyczący szybkości",
			],
			contraindications: ["Severe anxiety disorders", "Motor impairments"],
			polishContraindications: [
				"Poważne zaburzenia lękowe",
				"Utrudnienia motoryczne",
			],
			recommendedProtocol:
				"Daily 30-60 minutes of speeded cognitive tasks with gradual difficulty increase",
			polishRecommendedProtocol:
				"Codziennie 30-60 minut przyspieszonych zadań poznawczych ze stopniowym wzrostem trudności",
		},
	],
	evidenceLevel: "STRONG",
	researchStudies: [
		{
			id: "salthouse-2010",
			title: "Mental processing speed and cognitive aging",
			polishTitle: "Mentalna szybkość przetwarzania i starzenie poznawcze",
			authors: ["Salthouse T"],
			journal: "Current Directions in Psychological Science",
			year: 2010,
			studyType: "SYSTEMATIC_REVIEW",
			primaryOutcome: "Processing speed decline with age",
			polishPrimaryOutcome: "Spadek szybkości przetwarzania z wiekiem",
			findings:
				"Processing speed shows the most consistent decline with aging across cognitive domains",
			polishFindings:
				"Szybkość przetwarzania wykazuje najbardziej spójny spadek z wiekiem we wszystkich dziedzinach poznawczych",
			evidenceLevel: "STRONG",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "21264089",
			doi: "10.1177/0963721410383089",
			sampleSize: 0,
			participantCount: 0,
			duration: "N/A",
			dosage: "",
			results: "Processing speed declines consistently after age 60",
			polishResults:
				"Szybkość przetwarzania spada konsekwentnie po 60. roku życia",
			secondaryOutcomes: [
				"White matter integrity",
				"Neural transmission",
				"Cognitive efficiency",
			],
			polishSecondaryOutcomes: [
				"Integralność białej masy",
				"Przesyłanie nerwowe",
				"Efektywność poznawcza",
			],
			limitations: "Cross-sectional studies may overestimate decline",
			polishLimitations: "Badania przekrojowe mogą przeceniać spadek",
			qualityScore: 8.5,
			conflictOfInterest: "None declared",
			polishConflictOfInterest: "Brak zadeklarowanych",
			funding: "National Institute on Aging",
			polishFunding: "Narodowy Instytut Starości",
			url: "https://www.tandfonline.com/doi/abs/10.1177/0963721410383089",
			abstract:
				"Processing speed represents the most fundamental aspect of cognitive decline in aging, affecting performance across all cognitive domains.",
			polishAbstract:
				"Szybkość przetwarzania reprezentuje najbardziej fundamentalny aspekt spadku poznawczego w starzeniu się, wpływając na wydajność we wszystkich dziedzinach poznawczych.",
			keywords: [
				"processing speed",
				"aging",
				"cognition",
				"executive function",
			],
			meshTerms: [
				"Cognitive Aging",
				"Reaction Time",
				"Mental Processes",
				"Neuropsychological Tests",
			],
			citationCount: 350,
		},
	],
	tags: [
		"processing speed",
		"cognition",
		"reaction time",
		"mental efficiency",
		"white matter",
		"aging",
		"executive function",
	],
	lastUpdated: "2024-01-15T00:00:00Z",
	createdAt: "2024-01-15T00:00:00Z",
};

// Export all cognitive function modules
export const cognitiveFunctionModules: CognitiveFunction[] = [
	memoryDomain,
	attentionDomain,
	executiveFunctionDomain,
	processingSpeedDomain,
];

// Individual cognitive domains are already exported above

export default cognitiveFunctionModules;
