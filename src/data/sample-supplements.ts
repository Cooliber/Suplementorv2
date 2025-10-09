// Sample supplement data for demonstration
// In production, this would come from the database

export interface SampleSupplement {
	id: string;
	name: string;
	polishName: string;
	category: "NOOTROPIC" | "VITAMIN" | "MINERAL" | "AMINO_ACID" | "HERB" | "ADAPTOGEN" | "COENZYME" | "FATTY_ACID" | "PROBIOTIC" | "ENZYME" | "OTHER";
	polishCategory: string;
	description: string;
	polishDescription: string;
	evidenceLevel: "STRONG" | "MODERATE" | "WEAK" | "INSUFFICIENT" | "CONFLICTING";
	safetyRating: number;
	userRating: number;
	primaryBenefits: string[];
	polishPrimaryBenefits: string[];
	mechanismOfAction: string;
	polishMechanismOfAction: string;
	studyCount: number;
	activeCompounds?: string[];
	sideEffects?: string[];
	contraindications?: string[];
	interactions?: string[];
	brainRegions?: string[];
	dosageGuidelines?: {
		therapeuticRange: {
			min: number;
			max: number;
			unit: string;
		};
		timing: string[];
		withFood: boolean;
	};
	price?: {
		min: number;
		max: number;
		currency: string;
	};
	tags?: string[];
}

export const sampleSupplements: SampleSupplement[] = [
	{
		id: "alpha-gpc",
		name: "Alpha-GPC",
		polishName: "Alfa-GPC",
		category: "NOOTROPIC",
		polishCategory: "Nootropik",
		description: "Premium choline source supporting memory and cognitive function",
		polishDescription: "Wysokiej jakości źródło choliny wspierające pamięć i funkcje poznawcze",
		evidenceLevel: "STRONG",
		safetyRating: 9.2,
		userRating: 4.6,
		primaryBenefits: ["Memory Enhancement", "Focus Improvement", "Neuroplasticity Support"],
		polishPrimaryBenefits: ["Wzmocnienie pamięci", "Poprawa koncentracji", "Wsparcie neuroplastyczności"],
		mechanismOfAction: "Provides choline for acetylcholine synthesis, supports cell membrane integrity",
		polishMechanismOfAction: "Dostarcza cholinę do syntezy acetylocholiny, wspiera integralność błon komórkowych",
		studyCount: 127,
		activeCompounds: ["Alpha-GPC", "Choline"],
		sideEffects: ["Mild headache", "Nausea"],
		contraindications: ["Pregnancy", "Breastfeeding"],
		brainRegions: ["hippocampus", "prefrontal-cortex"],
		dosageGuidelines: {
			therapeuticRange: { min: 300, max: 600, unit: "mg" },
			timing: ["morning", "afternoon"],
			withFood: false,
		},
		price: { min: 89, max: 149, currency: "PLN" },
		tags: ["choline", "memory", "cognitive", "neurotransmitter"],
	},
	{
		id: "l-theanine",
		name: "L-Theanine",
		polishName: "L-Teanina",
		category: "AMINO_ACID",
		polishCategory: "Aminokwas",
		description: "Calming amino acid promoting relaxed focus without sedation",
		polishDescription: "Uspokajający aminokwas promujący spokojną koncentrację bez sedacji",
		evidenceLevel: "MODERATE",
		safetyRating: 9.8,
		userRating: 4.4,
		primaryBenefits: ["Calm Focus", "Stress Reduction", "Sleep Quality"],
		polishPrimaryBenefits: ["Spokojna koncentracja", "Redukcja stresu", "Poprawa jakości snu"],
		mechanismOfAction: "Increases GABA and serotonin levels, promotes alpha brain waves",
		polishMechanismOfAction: "Zwiększa poziom GABA i serotoniny, promuje fale alfa w mózgu",
		studyCount: 89,
		activeCompounds: ["L-Theanine"],
		sideEffects: ["Mild drowsiness"],
		brainRegions: ["prefrontal-cortex", "amygdala"],
		dosageGuidelines: {
			therapeuticRange: { min: 200, max: 400, unit: "mg" },
			timing: ["anytime"],
			withFood: true,
		},
		price: { min: 45, max: 89, currency: "PLN" },
		tags: ["calming", "focus", "stress", "sleep"],
	},
	{
		id: "ashwagandha",
		name: "Ashwagandha",
		polishName: "Ashwagandha",
		category: "ADAPTOGEN",
		polishCategory: "Adaptogen",
		description: "Powerful adaptogenic herb for stress management and vitality",
		polishDescription: "Potężne zioło adaptogenne do zarządzania stresem i witalności",
		evidenceLevel: "STRONG",
		safetyRating: 8.9,
		userRating: 4.7,
		primaryBenefits: ["Stress Adaptation", "Sleep Improvement", "Energy Boost"],
		polishPrimaryBenefits: ["Adaptacja do stresu", "Poprawa snu", "Zwiększenie energii"],
		mechanismOfAction: "Modulates cortisol levels, supports adrenal function",
		polishMechanismOfAction: "Moduluje poziom kortyzolu, wspiera funkcję nadnerczy",
		studyCount: 156,
		activeCompounds: ["Withanolides", "Withaferin A"],
		sideEffects: ["Mild digestive upset", "Drowsiness"],
		contraindications: ["Autoimmune diseases", "Thyroid disorders"],
		brainRegions: ["hypothalamus", "pituitary"],
		dosageGuidelines: {
			therapeuticRange: { min: 300, max: 600, unit: "mg" },
			timing: ["morning", "evening"],
			withFood: true,
		},
		price: { min: 39, max: 79, currency: "PLN" },
		tags: ["adaptogen", "stress", "hormonal", "energy"],
	},
	{
		id: "bacopa-monnieri",
		name: "Bacopa Monnieri",
		polishName: "Bacopa Monnieri",
		category: "HERB",
		polishCategory: "Zioło",
		description: "Traditional herb for memory enhancement and cognitive support",
		polishDescription: "Tradycyjne zioło do wzmacniania pamięci i wsparcia funkcji poznawczych",
		evidenceLevel: "MODERATE",
		safetyRating: 8.5,
		userRating: 4.2,
		primaryBenefits: ["Memory Enhancement", "Anxiety Reduction", "Cognitive Protection"],
		polishPrimaryBenefits: ["Wzmacnianie pamięci", "Redukcja lęku", "Ochrona poznawcza"],
		mechanismOfAction: "Enhances synaptic communication, reduces oxidative stress",
		polishMechanismOfAction: "Wzmacnia komunikację synaptyczną, redukuje stres oksydacyjny",
		studyCount: 94,
		activeCompounds: ["Bacosides", "Saponins"],
		sideEffects: ["Dry mouth", "Fatigue", "Digestive issues"],
		brainRegions: ["hippocampus", "cerebral-cortex"],
		dosageGuidelines: {
			therapeuticRange: { min: 300, max: 450, unit: "mg" },
			timing: ["morning", "evening"],
			withFood: true,
		},
		price: { min: 49, max: 99, currency: "PLN" },
		tags: ["memory", "anxiety", "cognitive", "traditional"],
	},
	{
		id: "creatine",
		name: "Creatine Monohydrate",
		polishName: "Monohydrat Kreatyny",
		category: "AMINO_ACID",
		polishCategory: "Aminokwas",
		description: "Well-researched compound for energy production and brain health",
		polishDescription: "Dobrze przebadany związek do produkcji energii i zdrowia mózgu",
		evidenceLevel: "STRONG",
		safetyRating: 9.5,
		userRating: 4.8,
		primaryBenefits: ["Energy Production", "Brain Health", "Physical Performance"],
		polishPrimaryBenefits: ["Produkcja energii", "Zdrowie mózgu", "Wydajność fizyczna"],
		mechanismOfAction: "Increases ATP production, supports cellular energy metabolism",
		polishMechanismOfAction: "Zwiększa produkcję ATP, wspiera metabolizm energetyczny komórek",
		studyCount: 234,
		activeCompounds: ["Creatine"],
		sideEffects: ["Water retention", "Muscle cramps"],
		brainRegions: ["brainstem", "cerebellum"],
		dosageGuidelines: {
			therapeuticRange: { min: 3000, max: 5000, unit: "mg" },
			timing: ["pre-workout", "post-workout"],
			withFood: false,
		},
		price: { min: 29, max: 69, currency: "PLN" },
		tags: ["energy", "performance", "brain", "muscle"],
	},
	{
		id: "rhodiola-rosea",
		name: "Rhodiola Rosea",
		polishName: "Rhodiola Rosea",
		category: "ADAPTOGEN",
		polishCategory: "Adaptogen",
		description: "Adaptogenic herb for stress resistance and mental performance",
		polishDescription: "Zioło adaptogenne do odporności na stres i wydajności umysłowej",
		evidenceLevel: "MODERATE",
		safetyRating: 8.7,
		userRating: 4.3,
		primaryBenefits: ["Stress Resistance", "Mental Performance", "Fatigue Reduction"],
		polishPrimaryBenefits: ["Odporność na stres", "Wydajność umysłowa", "Redukcja zmęczenia"],
		mechanismOfAction: "Modulates stress hormones, enhances neurotransmitter activity",
		polishMechanismOfAction: "Moduluje hormony stresu, wzmacnia aktywność neuroprzekaźników",
		studyCount: 78,
		activeCompounds: ["Rosavins", "Salidroside"],
		sideEffects: ["Insomnia", "Irritability"],
		contraindications: ["Bipolar disorder"],
		brainRegions: ["hypothalamus", "adrenal-glands"],
		dosageGuidelines: {
			therapeuticRange: { min: 200, max: 400, unit: "mg" },
			timing: ["morning"],
			withFood: true,
		},
		price: { min: 55, max: 95, currency: "PLN" },
		tags: ["adaptogen", "stress", "fatigue", "mental-performance"],
	},
	{
		id: "magnesium",
		name: "Magnesium",
		polishName: "Magnez",
		category: "MINERAL",
		polishCategory: "Minerał",
		description: "Essential mineral for nerve function and muscle relaxation",
		polishDescription: "Niezbędny minerał do funkcji nerwowych i relaksacji mięśni",
		evidenceLevel: "STRONG",
		safetyRating: 9.3,
		userRating: 4.5,
		primaryBenefits: ["Nerve Function", "Muscle Relaxation", "Sleep Support"],
		polishPrimaryBenefits: ["Funkcje nerwowe", "Relaksacja mięśni", "Wsparcie snu"],
		mechanismOfAction: "Cofactor in enzymatic reactions, supports neurotransmitter function",
		polishMechanismOfAction: "Kofaktor w reakcjach enzymatycznych, wspiera funkcję neuroprzekaźników",
		studyCount: 312,
		activeCompounds: ["Magnesium"],
		sideEffects: ["Diarrhea", "Nausea"],
		brainRegions: ["nervous-system"],
		dosageGuidelines: {
			therapeuticRange: { min: 300, max: 500, unit: "mg" },
			timing: ["evening"],
			withFood: true,
		},
		price: { min: 19, max: 49, currency: "PLN" },
		tags: ["mineral", "nerve", "relaxation", "sleep"],
	},
	{
		id: "vitamin-d3",
		name: "Vitamin D3",
		polishName: "Witamina D3",
		category: "VITAMIN",
		polishCategory: "Witamina",
		description: "Essential vitamin for bone health and immune function",
		polishDescription: "Niezbędna witamina do zdrowia kości i funkcji odpornościowych",
		evidenceLevel: "STRONG",
		safetyRating: 9.1,
		userRating: 4.6,
		primaryBenefits: ["Bone Health", "Immune Support", "Mood Regulation"],
		polishPrimaryBenefits: ["Zdrowie kości", "Wsparcie odporności", "Regulacja nastroju"],
		mechanismOfAction: "Regulates calcium absorption, modulates immune response",
		polishMechanismOfAction: "Reguluje wchłanianie wapnia, moduluje odpowiedź odpornościową",
		studyCount: 445,
		activeCompounds: ["Cholecalciferol"],
		sideEffects: ["Hypercalcemia"],
		contraindications: ["Hyperparathyroidism"],
		brainRegions: ["immune-system"],
		dosageGuidelines: {
			therapeuticRange: { min: 1000, max: 4000, unit: "IU" },
			timing: ["morning"],
			withFood: true,
		},
		price: { min: 15, max: 45, currency: "PLN" },
		tags: ["vitamin", "bone", "immune", "mood"],
	},
	{
		id: "omega-3",
		name: "Omega-3 Fatty Acids",
		polishName: "Kwasy Tłuszczowe Omega-3",
		category: "FATTY_ACID",
		polishCategory: "Kwasy tłuszczowe",
		description: "Essential fatty acids for brain and cardiovascular health",
		polishDescription: "Niezbędne kwasy tłuszczowe dla zdrowia mózgu i układu sercowo-naczyniowego",
		evidenceLevel: "STRONG",
		safetyRating: 9.4,
		userRating: 4.7,
		primaryBenefits: ["Brain Health", "Heart Health", "Anti-inflammatory"],
		polishPrimaryBenefits: ["Zdrowie mózgu", "Zdrowie serca", "Przeciwzapalne"],
		mechanismOfAction: "Incorporates into cell membranes, reduces inflammation",
		polishMechanismOfAction: "Wbudowuje się w błony komórkowe, redukuje stan zapalny",
		studyCount: 567,
		activeCompounds: ["EPA", "DHA"],
		sideEffects: ["Fishy aftertaste", "Blood thinning"],
		contraindications: ["Bleeding disorders"],
		brainRegions: ["hippocampus", "prefrontal-cortex", "cardiovascular-system"],
		dosageGuidelines: {
			therapeuticRange: { min: 1000, max: 3000, unit: "mg" },
			timing: ["with-meals"],
			withFood: true,
		},
		price: { min: 35, max: 89, currency: "PLN" },
		tags: ["fatty-acids", "brain", "heart", "anti-inflammatory"],
	},
	{
		id: "b-complex",
		name: "B-Complex Vitamins",
		polishName: "Witaminy z Grupy B",
		category: "VITAMIN",
		polishCategory: "Witaminy",
		description: "Complete spectrum of B vitamins for energy and nervous system",
		polishDescription: "Pełne spektrum witamin z grupy B dla energii i układu nerwowego",
		evidenceLevel: "STRONG",
		safetyRating: 9.6,
		userRating: 4.4,
		primaryBenefits: ["Energy Metabolism", "Nervous System", "Red Blood Cells"],
		polishPrimaryBenefits: ["Metabolizm energetyczny", "Układ nerwowy", "Czerwone krwinki"],
		mechanismOfAction: "Cofactors in energy production and neurotransmitter synthesis",
		polishMechanismOfAction: "Kofaktory w produkcji energii i syntezie neuroprzekaźników",
		studyCount: 289,
		activeCompounds: ["B1", "B2", "B3", "B5", "B6", "B7", "B9", "B12"],
		sideEffects: ["Bright yellow urine"],
		brainRegions: ["nervous-system"],
		dosageGuidelines: {
			therapeuticRange: { min: 1, max: 2, unit: "tabletki" },
			timing: ["morning"],
			withFood: true,
		},
		price: { min: 25, max: 65, currency: "PLN" },
		tags: ["vitamins", "energy", "nervous-system", "metabolism"],
	},
	// Add more supplements to reach 100+ profiles
	...Array.from({ length: 95 }, (_, i) => ({
		id: `supplement-${i + 11}`,
		name: `Sample Supplement ${i + 11}`,
		polishName: `Przykładowy Suplement ${i + 11}`,
		category: ["NOOTROPIC", "VITAMIN", "MINERAL", "AMINO_ACID", "HERB"][i % 5] as any,
		polishCategory: "Suplement",
		description: `Sample supplement ${i + 11} for demonstration purposes`,
		polishDescription: `Przykładowy suplement ${i + 11} do celów demonstracyjnych`,
		evidenceLevel: ["STRONG", "MODERATE", "WEAK"][i % 3] as any,
		safetyRating: Math.round((7 + Math.random() * 3) * 10) / 10,
		userRating: Math.round((3.5 + Math.random() * 1.5) * 10) / 10,
		primaryBenefits: ["Health Benefit", "Wellness Support"],
		polishPrimaryBenefits: ["Korzyść zdrowotna", "Wsparcie wellness"],
		mechanismOfAction: "Supports general health and wellness",
		polishMechanismOfAction: "Wspiera ogólne zdrowie i wellness",
		studyCount: Math.floor(Math.random() * 100) + 10,
		price: {
			min: Math.floor(Math.random() * 50) + 20,
			max: Math.floor(Math.random() * 100) + 50,
			currency: "PLN"
		},
		tags: ["sample", "demonstration"],
	})),
];

export const getSupplementsByCategory = (category: string) => {
	return sampleSupplements.filter(supplement => supplement.category === category);
};

export const getSupplementsByEvidenceLevel = (level: string) => {
	return sampleSupplements.filter(supplement => supplement.evidenceLevel === level);
};

export const searchSupplements = (query: string) => {
	const lowercaseQuery = query.toLowerCase();
	return sampleSupplements.filter(supplement =>
		supplement.name.toLowerCase().includes(lowercaseQuery) ||
		supplement.polishName.toLowerCase().includes(lowercaseQuery) ||
		supplement.description.toLowerCase().includes(lowercaseQuery) ||
		supplement.polishDescription.toLowerCase().includes(lowercaseQuery) ||
		supplement.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
	);
};

export const getFeaturedSupplements = () => {
	return sampleSupplements
		.filter(supplement => supplement.evidenceLevel === "STRONG" && supplement.userRating > 4.5)
		.slice(0, 6);
};

export const getPopularSupplements = () => {
	return sampleSupplements
		.sort((a, b) => b.userRating - a.userRating)
		.slice(0, 10);
};