// Cultural Supplement Usage Patterns for Polish/European Context
// Comprehensive cultural adaptations for supplement practices in Poland and Europe

export interface CulturalSupplementPattern {
	id: string;
	supplementId: string;
	supplementName: string;
	polishSupplementName: string;
	region:
		| "poland"
		| "central_europe"
		| "eastern_europe"
		| "western_europe"
		| "nordic"
		| "mediterranean";
	culturalContext: string;
	polishCulturalContext: string;
	traditionalUsage: string[];
	polishTraditionalUsage: string[];
	regionalPreferences: RegionalPreference[];
	dietaryPatterns: DietaryPattern[];
	seasonalUsage: SeasonalPattern[];
	evidenceLevel: "STRONG" | "MODERATE" | "EMERGING" | "TRADITIONAL";
}

export interface RegionalPreference {
	region: string;
	preference: "HIGH" | "MODERATE" | "LOW" | "AVOID";
	reason: string;
	polishReason: string;
	availability: "WIDELY_AVAILABLE" | "LIMITED" | "IMPORTED" | "RESTRICTED";
	priceRange: "BUDGET" | "MODERATE" | "PREMIUM" | "LUXURY";
}

export interface DietaryPattern {
	pattern: string;
	polishPattern: string;
	supplementNeed: "INCREASED" | "DECREASED" | "MODIFIED";
	explanation: string;
	polishExplanation: string;
	commonDeficiencies: string[];
	regionalFoods: string[];
}

export interface SeasonalPattern {
	season: "SPRING" | "SUMMER" | "AUTUMN" | "WINTER" | "LENT";
	usage: "INCREASED" | "DECREASED" | "MODIFIED";
	reason: string;
	polishReason: string;
	supplements: string[];
}

export const culturalSupplementPatterns: CulturalSupplementPattern[] = [
	{
		id: "vitamin-d-poland",
		supplementId: "vitamin-d3",
		supplementName: "Vitamin D3",
		polishSupplementName: "Witamina D3",
		region: "poland",
		culturalContext:
			"Poland's northern latitude (52°N) results in limited sunlight exposure, especially during autumn and winter months. Traditional Polish diet rich in fermented foods but often low in vitamin D sources.",
		polishCulturalContext:
			"Północna szerokość geograficzna Polski (52°N) powoduje ograniczone nasłonecznienie, szczególnie w miesiącach jesiennych i zimowych. Tradycyjna polska dieta bogata w produkty fermentowane, ale często uboga w źródła witaminy D.",
		traditionalUsage: [
			"Winter supplementation to prevent seasonal mood disorders",
			"Support for bone health in elderly population",
			"Immune system support during cold season",
			"Traditional use with cod liver oil in Nordic-influenced regions",
		],
		polishTraditionalUsage: [
			"Suplementacja zimowa w celu zapobiegania sezonowym zaburzeniom nastroju",
			"Wsparcie zdrowia kości u osób starszych",
			"Wsparcie układu odpornościowego w sezonie przeziębień",
			"Tradycyjne stosowanie z tranem w regionach o wpływach nordyckich",
		],
		regionalPreferences: [
			{
				region: "Poland",
				preference: "HIGH",
				reason:
					"Limited sunlight exposure due to geographical location and weather patterns",
				polishReason:
					"Ograniczone nasłonecznienie ze względu na położenie geograficzne i wzorce pogodowe",
				availability: "WIDELY_AVAILABLE",
				priceRange: "BUDGET",
			},
			{
				region: "Nordic Countries",
				preference: "HIGH",
				reason:
					"Similar latitude and climate conditions, established public health recommendations",
				polishReason:
					"Podobna szerokość geograficzna i warunki klimatyczne, ustalone zalecenia zdrowia publicznego",
				availability: "WIDELY_AVAILABLE",
				priceRange: "MODERATE",
			},
			{
				region: "Mediterranean",
				preference: "MODERATE",
				reason:
					"More abundant sunlight, but still supplemented in winter months",
				polishReason:
					"Większe nasłonecznienie, ale nadal suplementowane w miesiącach zimowych",
				availability: "WIDELY_AVAILABLE",
				priceRange: "MODERATE",
			},
		],
		dietaryPatterns: [
			{
				pattern: "Traditional Polish diet",
				polishPattern: "Tradycyjna dieta polska",
				supplementNeed: "INCREASED",
				explanation:
					"High consumption of fermented dairy, grains, and preserved foods with limited fresh produce in winter months",
				polishExplanation:
					"Wysokie spożycie fermentowanych produktów mlecznych, zbóż i konserw w miesiącach zimowych z ograniczoną ilością świeżych produktów",
				commonDeficiencies: ["Vitamin D", "Omega-3", "Vitamin C"],
				regionalFoods: [
					"Kiszona kapusta",
					"Ogórki kiszone",
					"Śledź",
					"Chleb razowy",
				],
			},
			{
				pattern: "Post-communist dietary transition",
				polishPattern: "Transformacja diety postkomunistycznej",
				supplementNeed: "MODIFIED",
				explanation:
					"Shift from traditional nutrient-dense foods to processed foods has created new supplementation needs",
				polishExplanation:
					"Przejście od tradycyjnych produktów bogatych w składniki odżywcze do żywności przetworzonej stworzyło nowe potrzeby suplementacyjne",
				commonDeficiencies: ["Magnesium", "B-vitamins", "Antioxidants"],
				regionalFoods: ["Fast food", "Processed meats", "Sweetened beverages"],
			},
		],
		seasonalUsage: [
			{
				season: "AUTUMN",
				usage: "INCREASED",
				reason: "Decreasing sunlight hours, preparation for winter months",
				polishReason:
					"Zmniejszające się godziny nasłonecznienia, przygotowanie na miesiące zimowe",
				supplements: ["Vitamin D3", "Vitamin C", "Zinc"],
			},
			{
				season: "WINTER",
				usage: "INCREASED",
				reason:
					"Minimal sunlight, increased infection risk, seasonal affective disorder prevention",
				polishReason:
					"Minimalne nasłonecznienie, zwiększone ryzyko infekcji, zapobieganie sezonowym zaburzeniom afektywnym",
				supplements: ["Vitamin D3", "Omega-3", "B-complex", "Magnesium"],
			},
			{
				season: "SPRING",
				usage: "MODIFIED",
				reason:
					"Transition period, focus on immune recovery and energy restoration",
				polishReason:
					"Okres przejściowy, skupienie na regeneracji odporności i energii",
				supplements: ["Vitamin D3", "Iron", "B-vitamins"],
			},
			{
				season: "SUMMER",
				usage: "DECREASED",
				reason:
					"Natural sunlight provides vitamin D, focus on antioxidants for sun protection",
				polishReason:
					"Naturalne nasłonecznienie dostarcza witaminę D, skupienie na antyoksydantach dla ochrony przeciwsłonecznej",
				supplements: ["Beta-carotene", "Vitamin E", "Selenium"],
			},
		],
		evidenceLevel: "STRONG",
	},
	{
		id: "magnesium-poland",
		supplementId: "magnesium",
		supplementName: "Magnesium",
		polishSupplementName: "Magnez",
		region: "poland",
		culturalContext:
			"Polish soil is naturally low in magnesium due to geological factors, and modern agricultural practices have further depleted magnesium levels in food. Traditional Polish diet includes magnesium-rich foods but processing reduces bioavailability.",
		polishCulturalContext:
			"Polska gleba jest naturalnie uboga w magnez ze względu na czynniki geologiczne, a nowoczesne praktyki rolnicze dodatkowo obniżyły poziom magnezu w żywności. Tradycyjna polska dieta obejmuje produkty bogate w magnez, ale przetwarzanie zmniejsza biodostępność.",
		traditionalUsage: [
			"Stress management in high-pressure work environments",
			"Muscle cramp prevention for physically active individuals",
			"Sleep quality improvement, especially in urban populations",
			"Traditional use with mineral waters from Polish springs",
		],
		polishTraditionalUsage: [
			"Zarządzanie stresem w środowiskach pracy pod presją",
			"Zapobieganie skurczom mięśni u osób aktywnych fizycznie",
			"Poprawa jakości snu, szczególnie w populacjach miejskich",
			"Tradycyjne stosowanie z wodami mineralnymi z polskich źródeł",
		],
		regionalPreferences: [
			{
				region: "Poland",
				preference: "HIGH",
				reason:
					"Soil depletion and dietary patterns create widespread deficiency",
				polishReason:
					"Wyczerpanie gleby i wzorce żywieniowe powodują powszechne niedobory",
				availability: "WIDELY_AVAILABLE",
				priceRange: "BUDGET",
			},
			{
				region: "Eastern Europe",
				preference: "HIGH",
				reason: "Similar agricultural challenges and dietary transitions",
				polishReason: "Podobne wyzwania rolnicze i transformacje żywieniowe",
				availability: "WIDELY_AVAILABLE",
				priceRange: "BUDGET",
			},
		],
		dietaryPatterns: [
			{
				pattern: "Agricultural soil depletion",
				polishPattern: "Wyczerpanie gleby rolniczej",
				supplementNeed: "INCREASED",
				explanation:
					"Intensive farming and acid rain have depleted magnesium from Polish soil",
				polishExplanation:
					"Intensywne rolnictwo i kwaśne deszcze wyczerpały magnez z polskiej gleby",
				commonDeficiencies: ["Magnesium", "Selenium", "Zinc"],
				regionalFoods: ["Pszenica", "Ziemniaki", "Buraki cukrowe"],
			},
			{
				pattern: "Processed food consumption",
				polishPattern: "Spożycie żywności przetworzonej",
				supplementNeed: "INCREASED",
				explanation:
					"High intake of refined grains and processed foods reduces magnesium intake",
				polishExplanation:
					"Wysokie spożycie rafinowanych zbóż i żywności przetworzonej zmniejsza spożycie magnezu",
				commonDeficiencies: ["Magnesium", "B-vitamins", "Fiber"],
				regionalFoods: ["Biały chleb", "Makaron", "Fast food"],
			},
		],
		seasonalUsage: [
			{
				season: "SPRING",
				usage: "INCREASED",
				reason: "Post-winter depletion, increased physical activity outdoors",
				polishReason:
					"Wyczerpanie po zimie, zwiększona aktywność fizyczna na świeżym powietrzu",
				supplements: ["Magnesium", "Potassium", "B-vitamins"],
			},
			{
				season: "SUMMER",
				usage: "INCREASED",
				reason: "Increased sweating and physical activity, electrolyte loss",
				polishReason:
					"Zwiększone pocenie i aktywność fizyczna, utrata elektrolitów",
				supplements: ["Magnesium", "Electrolytes", "Hydration support"],
			},
		],
		evidenceLevel: "STRONG",
	},
	{
		id: "omega-3-poland",
		supplementId: "omega-3",
		supplementName: "Omega-3 Fatty Acids",
		polishSupplementName: "Kwasy tłuszczowe Omega-3",
		region: "poland",
		culturalContext:
			"Traditional Polish diet was rich in omega-3s from fish and flaxseed, but modern dietary changes have reduced intake. Baltic Sea fish consumption provides some EPA/DHA, but processing and farming practices affect quality.",
		polishCulturalContext:
			"Tradycyjna polska dieta była bogata w kwasy omega-3 z ryb i siemienia lnianego, ale nowoczesne zmiany żywieniowe zmniejszyły spożycie. Spożycie ryb z Morza Bałtyckiego dostarcza trochę EPA/DHA, ale praktyki przetwarzania i hodowli wpływają na jakość.",
		traditionalUsage: [
			"Traditional use of flaxseed oil in rural communities",
			"Herring consumption for heart health in coastal regions",
			"Brain health support in aging population",
			"Anti-inflammatory support for joint health",
		],
		polishTraditionalUsage: [
			"Tradycyjne stosowanie oleju lnianego we wsiach",
			"Spożycie śledzia dla zdrowia serca w regionach nadmorskich",
			"Wsparcie zdrowia mózgu w starzejącej się populacji",
			"Wsparcie przeciwzapalne dla zdrowia stawów",
		],
		regionalPreferences: [
			{
				region: "Poland",
				preference: "MODERATE",
				reason: "Traditional fish consumption but modern dietary shifts",
				polishReason:
					"Tradycyjne spożycie ryb, ale nowoczesne zmiany żywieniowe",
				availability: "WIDELY_AVAILABLE",
				priceRange: "MODERATE",
			},
			{
				region: "Baltic States",
				preference: "HIGH",
				reason: "Abundant local fish sources, cultural dietary traditions",
				polishReason:
					"Obfite lokalne źródła ryb, kulturowe tradycje żywieniowe",
				availability: "WIDELY_AVAILABLE",
				priceRange: "MODERATE",
			},
		],
		dietaryPatterns: [
			{
				pattern: "Baltic Sea diet",
				polishPattern: "Dieta Morza Bałtyckiego",
				supplementNeed: "MODIFIED",
				explanation:
					"High fish consumption but concerns about mercury and PCB contamination",
				polishExplanation:
					"Wysokie spożycie ryb, ale obawy dotyczące zanieczyszczenia rtęcią i PCB",
				commonDeficiencies: ["Omega-3 DHA", "Selenium"],
				regionalFoods: ["Śledź", "Łosoś bałtycki", "Dorsz", "Siemię lniane"],
			},
			{
				pattern: "Continental climate diet",
				polishPattern: "Dieta klimatu kontynentalnego",
				supplementNeed: "INCREASED",
				explanation:
					"Limited access to fresh seafood, reliance on vegetable omega-3 sources",
				polishExplanation:
					"Ograniczony dostęp do świeżych owoców morza, poleganie na roślinnych źródłach omega-3",
				commonDeficiencies: ["EPA", "DHA"],
				regionalFoods: ["Siemię lniane", "Orzechy włoskie", "Olej rzepakowy"],
			},
		],
		seasonalUsage: [
			{
				season: "WINTER",
				usage: "INCREASED",
				reason:
					"Reduced fresh food availability, need for anti-inflammatory support",
				polishReason:
					"Zmniejszona dostępność świeżej żywności, potrzeba wsparcia przeciwzapalnego",
				supplements: ["Omega-3", "Vitamin D", "Probiotics"],
			},
			{
				season: "LENT",
				usage: "MODIFIED",
				reason: "Traditional fish consumption during Catholic Lent period",
				polishReason:
					"Tradycyjne spożycie ryb podczas katolickiego okresu Wielkiego Postu",
				supplements: ["Omega-3", "Iodine", "Selenium"],
			},
		],
		evidenceLevel: "STRONG",
	},
	{
		id: "probiotics-poland",
		supplementId: "probiotics",
		supplementName: "Probiotics",
		polishSupplementName: "Probiotyki",
		region: "poland",
		culturalContext:
			"Strong tradition of fermented foods in Polish cuisine provides natural probiotics, but modern food processing and antibiotic use have disrupted gut microbiome. Interest in probiotics has grown with awareness of gut-brain connection.",
		polishCulturalContext:
			"Silna tradycja produktów fermentowanych w kuchni polskiej dostarcza naturalnych probiotyków, ale nowoczesne przetwarzanie żywności i antybiotyki zaburzyły mikrobiom jelitowy. Zainteresowanie probiotykami wzrosło wraz ze świadomością połączenia jelita-mózg.",
		traditionalUsage: [
			"Traditional fermented foods as natural probiotics",
			"Gut health support after antibiotic treatments",
			"Digestive wellness in aging population",
			"Mood and mental health support through gut-brain axis",
		],
		polishTraditionalUsage: [
			"Tradycyjne produkty fermentowane jako naturalne probiotyki",
			"Wsparcie zdrowia jelit po kuracjach antybiotykowych",
			"Wellness trawienny w starzejącej się populacji",
			"Wsparcie nastroju i zdrowia psychicznego poprzez oś jelita-mózg",
		],
		regionalPreferences: [
			{
				region: "Poland",
				preference: "HIGH",
				reason:
					"Strong tradition of fermented foods, high awareness of gut health",
				polishReason:
					"Silna tradycja produktów fermentowanych, wysoka świadomość zdrowia jelit",
				availability: "WIDELY_AVAILABLE",
				priceRange: "MODERATE",
			},
			{
				region: "Eastern Europe",
				preference: "HIGH",
				reason: "Similar culinary traditions with fermented foods",
				polishReason: "Podobne tradycje kulinarne z produktami fermentowanymi",
				availability: "WIDELY_AVAILABLE",
				priceRange: "BUDGET",
			},
		],
		dietaryPatterns: [
			{
				pattern: "Fermented food tradition",
				polishPattern: "Tradycja produktów fermentowanych",
				supplementNeed: "MODIFIED",
				explanation:
					"Regular consumption of natural probiotics may require different supplementation approach",
				polishExplanation:
					"Regularne spożycie naturalnych probiotyków może wymagać innego podejścia do suplementacji",
				commonDeficiencies: ["Diversity of strains"],
				regionalFoods: [
					"Kiszona kapusta",
					"Ogórki kiszone",
					"Kefir",
					"Maślanka",
				],
			},
			{
				pattern: "Antibiotic exposure",
				polishPattern: "Ekspozycja na antybiotyki",
				supplementNeed: "INCREASED",
				explanation:
					"Higher antibiotic use in post-communist healthcare system",
				polishExplanation:
					"Wyższe stosowanie antybiotyków w postkomunistycznym systemie opieki zdrowotnej",
				commonDeficiencies: ["Beneficial gut bacteria"],
				regionalFoods: ["Processed foods", "High-sugar diet"],
			},
		],
		seasonalUsage: [
			{
				season: "WINTER",
				usage: "INCREASED",
				reason: "Reduced fresh produce, need for immune and digestive support",
				polishReason:
					"Zmniejszona ilość świeżych produktów, potrzeba wsparcia odporności i trawienia",
				supplements: ["Multi-strain probiotics", "Prebiotics", "Vitamin C"],
			},
			{
				season: "SUMMER",
				usage: "MODIFIED",
				reason: "Abundant fresh produce, focus on food-based probiotics",
				polishReason:
					"Obfitość świeżych produktów, skupienie na probiotykach z żywności",
				supplements: ["Fermented foods", "Prebiotic fibers"],
			},
		],
		evidenceLevel: "MODERATE",
	},
	{
		id: "adaptogens-poland",
		supplementId: "adaptogens",
		supplementName: "Adaptogenic Herbs",
		polishSupplementName: "Zioła adaptogenne",
		region: "poland",
		culturalContext:
			"Polish herbal medicine tradition dates back centuries, with adaptogens playing important role in traditional folk medicine. Modern stress from economic transition and fast-paced lifestyle has increased demand for stress management solutions.",
		polishCulturalContext:
			"Polska tradycja ziołolecznictwa sięga wieków wstecz, a adaptogeny odgrywają ważną rolę w tradycyjnej medycynie ludowej. Współczesny stres związany z transformacją gospodarczą i szybkim stylem życia zwiększył zapotrzebowanie na rozwiązania do zarządzania stresem.",
		traditionalUsage: [
			"Traditional herbal teas for stress relief",
			"Work performance enhancement in demanding jobs",
			"Seasonal affective disorder management",
			"Traditional use of local adaptogenic plants",
		],
		polishTraditionalUsage: [
			"Tradycyjne herbatki ziołowe na ulgę w stresie",
			"Wzmacnianie wydajności pracy w wymagających zawodach",
			"Zarządzanie sezonowymi zaburzeniami afektywnymi",
			"Tradycyjne stosowanie lokalnych roślin adaptogennych",
		],
		regionalPreferences: [
			{
				region: "Poland",
				preference: "HIGH",
				reason: "Strong herbal medicine tradition, modern stress factors",
				polishReason:
					"Silna tradycja ziołolecznictwa, nowoczesne czynniki stresowe",
				availability: "WIDELY_AVAILABLE",
				priceRange: "MODERATE",
			},
			{
				region: "Russia/Eastern Europe",
				preference: "HIGH",
				reason:
					"Similar traditional medicine systems, Eleutherococcus senticosus native to region",
				polishReason:
					"Podobne systemy medycyny tradycyjnej, Eleutherococcus senticosus rodzimy dla regionu",
				availability: "WIDELY_AVAILABLE",
				priceRange: "BUDGET",
			},
		],
		dietaryPatterns: [
			{
				pattern: "Post-communist stress adaptation",
				polishPattern: "Adaptacja do stresu postkomunistycznego",
				supplementNeed: "INCREASED",
				explanation:
					"Rapid social and economic changes have created chronic stress patterns",
				polishExplanation:
					"Szybkie zmiany społeczne i gospodarcze stworzyły chroniczne wzorce stresu",
				commonDeficiencies: ["Stress resilience", "Sleep quality"],
				regionalFoods: ["Coffee", "Alcohol", "High-sugar foods"],
			},
			{
				pattern: "Traditional herbal knowledge",
				polishPattern: "Tradycyjna wiedza ziołowa",
				supplementNeed: "MODIFIED",
				explanation:
					"Deep cultural knowledge of local plants and their applications",
				polishExplanation:
					"Głęboka wiedza kulturowa o lokalnych roślinach i ich zastosowaniach",
				commonDeficiencies: ["Modern clinical applications"],
				regionalFoods: ["Zioła", "Herbatki ziołowe", "Nalewki"],
			},
		],
		seasonalUsage: [
			{
				season: "AUTUMN",
				usage: "INCREASED",
				reason: "Seasonal depression onset, preparation for winter stress",
				polishReason:
					"Początek depresji sezonowej, przygotowanie na zimowy stres",
				supplements: ["Rhodiola", "Ashwagandha", "St. John's Wort"],
			},
			{
				season: "WINTER",
				usage: "INCREASED",
				reason: "Seasonal affective disorder, reduced daylight, holiday stress",
				polishReason:
					"Sezonowe zaburzenia afektywne, zmniejszone światło dzienne, stres świąteczny",
				supplements: ["Rhodiola", "Schisandra", "Holy Basil"],
			},
		],
		evidenceLevel: "MODERATE",
	},
];

export const getCulturalPatternsBySupplement = (supplementId: string) => {
	return culturalSupplementPatterns.filter(
		(pattern) => pattern.supplementId === supplementId,
	);
};

export const getCulturalPatternsByRegion = (region: string) => {
	return culturalSupplementPatterns.filter(
		(pattern) => pattern.region === region,
	);
};

export const getRegionalSupplementPreferences = (region: string) => {
	const patterns = getCulturalPatternsByRegion(region);
	return patterns.map((pattern) => ({
		supplementId: pattern.supplementId,
		supplementName: pattern.supplementName,
		polishSupplementName: pattern.polishSupplementName,
		preference:
			pattern.regionalPreferences.find((pref) => pref.region === region)
				?.preference || "MODERATE",
		availability:
			pattern.regionalPreferences.find((pref) => pref.region === region)
				?.availability || "LIMITED",
		priceRange:
			pattern.regionalPreferences.find((pref) => pref.region === region)
				?.priceRange || "MODERATE",
	}));
};
