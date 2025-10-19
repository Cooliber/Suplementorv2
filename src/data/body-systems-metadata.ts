/**
 * Metadata and Search System for Body Systems
 * Provides searchability, cross-referencing, and semantic relationships
 */

export interface SystemMetadata {
	systemId: string;
	tags: string[];
	polishTags: string[];
	categories: string[];
	polishCategories: string[];
	relatedSystems: string[];
	searchTerms: string[];
	polishSearchTerms: string[];
	difficulty: "basic" | "intermediate" | "advanced";
	estimatedStudyTime: number; // minutes
	prerequisites: string[];
	relatedTopics: string[];
}

export interface SearchIndex {
	term: string;
	polishTerm: string;
	systemId: string;
	context: "function" | "organ" | "disorder" | "supplement" | "anatomy";
	relevance: number; // 0-1
	description: string;
	polishDescription: string;
}

export interface CrossReference {
	sourceSystem: string;
	targetSystem: string;
	relationshipType:
		| "direct"
		| "indirect"
		| "regulatory"
		| "structural"
		| "functional";
	strength: number; // 0-1
	description: string;
	polishDescription: string;
	clinicalSignificance: string;
	polishClinicalSignificance: string;
}

// Comprehensive metadata for all body systems
export const bodySystemsMetadata: SystemMetadata[] = [
	{
		systemId: "skeletal",
		tags: ["bones", "joints", "cartilage", "support", "protection", "movement"],
		polishTags: ["kości", "stawy", "chrząstka", "wsparcie", "ochrona", "ruch"],
		categories: ["structural", "support", "hematopoietic"],
		polishCategories: ["strukturalny", "wspierający", "hematopoetyczny"],
		relatedSystems: ["muscular", "nervous", "cardiovascular"],
		searchTerms: [
			"skeleton",
			"bone",
			"joint",
			"cartilage",
			"osteo",
			"arthritis",
		],
		polishSearchTerms: [
			"szkielet",
			"kość",
			"staw",
			"chrząstka",
			"osteo",
			"artretyzm",
		],
		difficulty: "basic",
		estimatedStudyTime: 45,
		prerequisites: [],
		relatedTopics: ["biomechanics", "orthopedics", "rheumatology"],
	},
	{
		systemId: "muscular",
		tags: ["muscles", "contraction", "movement", "posture", "heat"],
		polishTags: ["mięśnie", "skurcz", "ruch", "postawa", "ciepło"],
		categories: ["contractile", "locomotor", "metabolic"],
		polishCategories: ["kurczliwe", "lokomotoryczne", "metaboliczne"],
		relatedSystems: ["skeletal", "nervous", "cardiovascular"],
		searchTerms: ["muscle", "contraction", "myo", "sarco", "fiber"],
		polishSearchTerms: ["mięsień", "skurcz", "myo", "sarco", "włókno"],
		difficulty: "intermediate",
		estimatedStudyTime: 60,
		prerequisites: ["skeletal"],
		relatedTopics: ["exercise physiology", "sports medicine", "neurology"],
	},
	{
		systemId: "respiratory",
		tags: ["lungs", "breathing", "gas exchange", "oxygen", "carbon dioxide"],
		polishTags: [
			"płuca",
			"oddychanie",
			"wymiana gazowa",
			"tlen",
			"dwutlenek węgla",
		],
		categories: ["respiratory", "gas exchange", "acid-base"],
		polishCategories: ["oddechowe", "wymiana gazowa", "kwasowo-zasadowe"],
		relatedSystems: ["cardiovascular", "immune", "nervous"],
		searchTerms: ["lung", "breath", "pulmo", "respiratory", "ventilation"],
		polishSearchTerms: ["płuco", "oddech", "pulmo", "oddechowy", "wentylacja"],
		difficulty: "intermediate",
		estimatedStudyTime: 50,
		prerequisites: ["cardiovascular"],
		relatedTopics: ["pulmonology", "critical care", "anesthesiology"],
	},
	{
		systemId: "nervous",
		tags: ["brain", "nerves", "sensation", "cognition", "coordination"],
		polishTags: ["mózg", "nerwy", "czucie", "poznanie", "koordynacja"],
		categories: ["neural", "cognitive", "sensory", "motor"],
		polishCategories: ["nerwowe", "poznawcze", "sensoryczne", "ruchowe"],
		relatedSystems: ["endocrine", "immune", "all systems"],
		searchTerms: ["brain", "nerve", "neuro", "synapse", "neuron"],
		polishSearchTerms: ["mózg", "nerw", "neuro", "synapsa", "neuron"],
		difficulty: "advanced",
		estimatedStudyTime: 120,
		prerequisites: ["basic biology"],
		relatedTopics: ["neurology", "psychiatry", "neurosurgery"],
	},
	{
		systemId: "endocrine",
		tags: ["hormones", "glands", "metabolism", "growth", "reproduction"],
		polishTags: ["hormony", "gruczoły", "metabolizm", "wzrost", "reprodukcja"],
		categories: ["hormonal", "regulatory", "metabolic"],
		polishCategories: ["hormonalne", "regulacyjne", "metaboliczne"],
		relatedSystems: ["nervous", "reproductive", "metabolic systems"],
		searchTerms: ["hormone", "gland", "endocrine", "pituitary", "thyroid"],
		polishSearchTerms: [
			"hormon",
			"gruczoł",
			"endokrynny",
			"przysadka",
			"tarczyca",
		],
		difficulty: "intermediate",
		estimatedStudyTime: 75,
		prerequisites: ["basic physiology"],
		relatedTopics: ["endocrinology", "metabolism", "reproductive medicine"],
	},
	{
		systemId: "reproductive",
		tags: ["reproduction", "hormones", "gametes", "fertility", "development"],
		polishTags: ["reprodukcja", "hormony", "gamety", "płodność", "rozwój"],
		categories: ["reproductive", "hormonal", "developmental"],
		polishCategories: ["rozrodcze", "hormonalne", "rozwojowe"],
		relatedSystems: ["endocrine", "nervous", "urinary"],
		searchTerms: ["reproductive", "fertility", "gamete", "gonad", "sexual"],
		polishSearchTerms: [
			"rozrodczy",
			"płodność",
			"gameta",
			"gonada",
			"seksualny",
		],
		difficulty: "intermediate",
		estimatedStudyTime: 65,
		prerequisites: ["endocrine"],
		relatedTopics: ["reproductive medicine", "obstetrics", "gynecology"],
	},
	{
		systemId: "integumentary",
		tags: ["skin", "protection", "sensation", "temperature", "immunity"],
		polishTags: ["skóra", "ochrona", "czucie", "temperatura", "odporność"],
		categories: ["protective", "sensory", "immunological"],
		polishCategories: ["ochronne", "sensoryczne", "immunologiczne"],
		relatedSystems: ["immune", "nervous", "endocrine"],
		searchTerms: ["skin", "dermal", "cutaneous", "epidermis", "dermis"],
		polishSearchTerms: [
			"skóra",
			"skórny",
			"powłokowy",
			"naskórek",
			"skóra właściwa",
		],
		difficulty: "basic",
		estimatedStudyTime: 40,
		prerequisites: [],
		relatedTopics: ["dermatology", "immunology", "wound healing"],
	},
];

// Search index for efficient querying
export const searchIndex: SearchIndex[] = [
	{
		term: "bone",
		polishTerm: "kość",
		systemId: "skeletal",
		context: "organ",
		relevance: 1.0,
		description: "Rigid organ forming the skeleton",
		polishDescription: "Sztywny narząd tworzący szkielet",
	},
	{
		term: "joint",
		polishTerm: "staw",
		systemId: "skeletal",
		context: "anatomy",
		relevance: 0.9,
		description: "Connection between bones allowing movement",
		polishDescription: "Połączenie między kośćmi umożliwiające ruch",
	},
	{
		term: "muscle",
		polishTerm: "mięsień",
		systemId: "muscular",
		context: "organ",
		relevance: 1.0,
		description: "Contractile tissue enabling movement",
		polishDescription: "Tkanka kurczliwa umożliwiająca ruch",
	},
	{
		term: "lung",
		polishTerm: "płuco",
		systemId: "respiratory",
		context: "organ",
		relevance: 1.0,
		description: "Organ responsible for gas exchange",
		polishDescription: "Narząd odpowiedzialny za wymianę gazową",
	},
	{
		term: "brain",
		polishTerm: "mózg",
		systemId: "nervous",
		context: "organ",
		relevance: 1.0,
		description: "Central processing unit of the nervous system",
		polishDescription: "Centralna jednostka przetwarzająca układu nerwowego",
	},
	{
		term: "hormone",
		polishTerm: "hormon",
		systemId: "endocrine",
		context: "function",
		relevance: 1.0,
		description: "Chemical messenger regulating bodily functions",
		polishDescription: "Przekaźnik chemiczny regulujący funkcje organizmu",
	},
];

// Cross-references between systems
export const crossReferences: CrossReference[] = [
	{
		sourceSystem: "skeletal",
		targetSystem: "muscular",
		relationshipType: "structural",
		strength: 0.9,
		description: "Bones provide attachment points and leverage for muscles",
		polishDescription:
			"Kości zapewniają punkty przyczepu i dźwignię dla mięśni",
		clinicalSignificance: "Essential for movement and posture",
		polishClinicalSignificance: "Niezbędne dla ruchu i postawy",
	},
	{
		sourceSystem: "nervous",
		targetSystem: "muscular",
		relationshipType: "functional",
		strength: 0.8,
		description: "Nervous system controls muscle contraction",
		polishDescription: "Układ nerwowy kontroluje skurcz mięśni",
		clinicalSignificance: "Critical for voluntary and reflex movements",
		polishClinicalSignificance: "Krytyczne dla ruchów dobrowolnych i odruchów",
	},
	{
		sourceSystem: "endocrine",
		targetSystem: "reproductive",
		relationshipType: "regulatory",
		strength: 0.9,
		description: "Hormones regulate reproductive function and development",
		polishDescription: "Hormony regulują funkcję rozrodczą i rozwój",
		clinicalSignificance: "Essential for fertility and sexual maturation",
		polishClinicalSignificance:
			"Niezbędne dla płodności i dojrzewania płciowego",
	},
];

// Search utility functions
export function searchSystems(query: string, polish = false): SystemMetadata[] {
	const searchTerm = query.toLowerCase();
	return bodySystemsMetadata.filter((metadata) => {
		const terms = polish ? metadata.polishSearchTerms : metadata.searchTerms;
		return terms.some((term) => term.toLowerCase().includes(searchTerm));
	});
}

export function getRelatedSystems(systemId: string): string[] {
	const metadata = bodySystemsMetadata.find((m) => m.systemId === systemId);
	return metadata?.relatedSystems || [];
}

export function getSystemDifficulty(systemId: string): string {
	const metadata = bodySystemsMetadata.find((m) => m.systemId === systemId);
	return metadata?.difficulty || "intermediate";
}

// Export for use in search and navigation components
export default {
	bodySystemsMetadata,
	searchIndex,
	crossReferences,
	searchSystems,
	getRelatedSystems,
	getSystemDifficulty,
};
