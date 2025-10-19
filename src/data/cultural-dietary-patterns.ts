// Cultural Dietary Patterns and Nutritional Needs in Polish Context
// Traditional and modern Polish dietary patterns and their supplement implications

export interface CulturalDietaryPattern {
	id: string;
	name: string;
	polishName: string;
	region: "poland" | "central_europe" | "eastern_europe";
	description: string;
	polishDescription: string;
	historicalContext: string;
	polishHistoricalContext: string;
	currentPrevalence: number; // percentage of population
	nutritionalCharacteristics: NutritionalCharacteristic[];
	supplementNeeds: SupplementNeed[];
	seasonalVariations: SeasonalDietVariation[];
	healthImplications: string[];
	polishHealthImplications: string[];
}

export interface NutritionalCharacteristic {
	nutrient: string;
	status: "DEFICIENT" | "ADEQUATE" | "EXCESSIVE";
	amount: string;
	comparedTo: string;
	reason: string;
	polishReason: string;
}

export interface SupplementNeed {
	supplementId: string;
	supplementName: string;
	polishSupplementName: string;
	needLevel: "HIGH" | "MODERATE" | "LOW";
	reason: string;
	polishReason: string;
	dosageConsiderations: string;
	polishDosageConsiderations: string;
}

export interface SeasonalDietVariation {
	season: "SPRING" | "SUMMER" | "AUTUMN" | "WINTER";
	changes: string[];
	polishChanges: string[];
	supplementAdjustments: string[];
	polishSupplementAdjustments: string[];
}

export const culturalDietaryPatterns: CulturalDietaryPattern[] = [
	{
		id: "traditional-polish-diet",
		name: "Traditional Polish Diet",
		polishName: "Tradycyjna dieta polska",
		region: "poland",
		description:
			"The traditional Polish diet is characterized by hearty, comforting foods that reflect the country's agricultural heritage and seasonal food preservation practices.",
		polishDescription:
			"Tradycyjna dieta polska charakteryzuje się sycącymi, komfortowymi potrawami, które odzwierciedlają rolnicze dziedzictwo kraju i sezonowe praktyki konserwowania żywności.",
		historicalContext:
			"Developed over centuries in the Polish countryside, this diet sustained generations through harsh continental climate with long winters and short growing seasons. Based on locally available grains, root vegetables, fermented foods, and seasonal produce.",
		polishHistoricalContext:
			"Rozwijana przez wieki na polskiej wsi, ta dieta utrzymywała pokolenia przez surowy klimat kontynentalny z długimi zimami i krótkimi sezonami wegetacyjnymi. Oparta na lokalnie dostępnych zbożach, warzywach korzeniowych, produktach fermentowanych i sezonowych produktach.",
		currentPrevalence: 35,
		nutritionalCharacteristics: [
			{
				nutrient: "Vitamin D",
				status: "DEFICIENT",
				amount: "< 50% RDA",
				comparedTo: "Mediterranean diets",
				reason: "Limited winter sunlight, traditional diet low in fatty fish",
				polishReason:
					"Ograniczone zimowe nasłonecznienie, tradycyjna dieta uboga w tłuste ryby",
			},
			{
				nutrient: "Omega-3 fatty acids",
				status: "DEFICIENT",
				amount: "< 60% recommended",
				comparedTo: "Nordic diets",
				reason: "Traditional focus on pork and poultry rather than fish",
				polishReason:
					"Tradycyjne skupienie na wieprzowinie i drobiu zamiast ryb",
			},
			{
				nutrient: "Magnesium",
				status: "DEFICIENT",
				amount: "< 70% RDA",
				comparedTo: "Western diets",
				reason: "Soil depletion and food processing reduce magnesium content",
				polishReason:
					"Wyczerpanie gleby i przetwarzanie żywności zmniejszają zawartość magnezu",
			},
			{
				nutrient: "Fiber",
				status: "ADEQUATE",
				amount: "25-30g daily",
				comparedTo: "Modern Western diets",
				reason: "High consumption of whole grains and vegetables",
				polishReason: "Wysokie spożycie pełnych ziaren i warzyw",
			},
			{
				nutrient: "Probiotics",
				status: "ADEQUATE",
				amount: "Natural sources",
				comparedTo: "Modern diets",
				reason: "Regular consumption of fermented foods",
				polishReason: "Regularne spożycie produktów fermentowanych",
			},
		],
		supplementNeeds: [
			{
				supplementId: "vitamin-d3",
				supplementName: "Vitamin D3",
				polishSupplementName: "Witamina D3",
				needLevel: "HIGH",
				reason: "Northern latitude and limited winter sunlight",
				polishReason:
					"Północna szerokość geograficzna i ograniczone zimowe nasłonecznienie",
				dosageConsiderations:
					"2000-4000 IU daily October-March, lower doses April-September",
				polishDosageConsiderations:
					"2000-4000 IU dziennie październik-marzec, niższe dawki kwiecień-wrzesień",
			},
			{
				supplementId: "omega-3",
				supplementName: "Omega-3 Fatty Acids",
				polishSupplementName: "Kwasy tłuszczowe Omega-3",
				needLevel: "MODERATE",
				reason: "Traditional diet lower in marine omega-3 sources",
				polishReason: "Tradycyjna dieta uboższa w morskie źródła omega-3",
				dosageConsiderations:
					"1000mg EPA+DHA for general health, 2000mg for cardiovascular concerns",
				polishDosageConsiderations:
					"1000mg EPA+DHA dla ogólnego zdrowia, 2000mg dla problemów sercowo-naczyniowych",
			},
			{
				supplementId: "magnesium",
				supplementName: "Magnesium",
				polishSupplementName: "Magnez",
				needLevel: "HIGH",
				reason: "Soil depletion and traditional food processing methods",
				polishReason:
					"Wyczerpanie gleby i tradycyjne metody przetwarzania żywności",
				dosageConsiderations:
					"300-400mg elemental magnesium, preferably glycinate form",
				polishDosageConsiderations:
					"300-400mg magnezu pierwiastkowego, najlepiej w formie glicynianu",
			},
		],
		seasonalVariations: [
			{
				season: "WINTER",
				changes: [
					"Increased preserved foods",
					"Limited fresh produce",
					"More fermented foods",
					"Higher meat consumption",
				],
				polishChanges: [
					"Więcej konserwowanych produktów",
					"Ograniczona świeża produkcja",
					"Więcej produktów fermentowanych",
					"Wyższe spożycie mięsa",
				],
				supplementAdjustments: [
					"Increase vitamin D and C",
					"Add probiotic support",
					"Consider omega-3 for indoor lifestyle",
				],
				polishSupplementAdjustments: [
					"Zwiększ witaminę D i C",
					"Dodaj wsparcie probiotyczne",
					"Rozważ omega-3 dla stylu życia w pomieszczeniach",
				],
			},
			{
				season: "SUMMER",
				changes: [
					"Abundant fresh vegetables",
					"Seasonal fruits",
					"Garden herbs",
					"Outdoor cooking",
				],
				polishChanges: [
					"Obfitość świeżych warzyw",
					"Sezonowe owoce",
					"Ogrodowe zioła",
					"Gotowanie na świeżym powietrzu",
				],
				supplementAdjustments: [
					"Reduce vitamin D if sun exposure adequate",
					"Increase antioxidants",
					"Focus on electrolyte balance",
				],
				polishSupplementAdjustments: [
					"Zmniejsz witaminę D jeśli ekspozycja na słońce wystarczająca",
					"Zwiększ antyoksydanty",
					"Skup się na równowadze elektrolitowej",
				],
			},
		],
		healthImplications: [
			"Generally balanced macro and micronutrients",
			"Natural probiotic intake supports gut health",
			"Seasonal variations may lead to winter deficiencies",
			"Traditional preservation methods maintain nutrient value",
			"Modern adaptations may reduce nutritional quality",
		],
		polishHealthImplications: [
			"Ogólnie zrównoważone makro i mikroelementy",
			"Naturalne spożycie probiotyków wspiera zdrowie jelit",
			"Zmiany sezonowe mogą prowadzić do zimowych niedoborów",
			"Tradycyjne metody konserwacji utrzymują wartość odżywczą",
			"Modernizacje adaptacyjne mogą zmniejszać jakość odżywczą",
		],
	},
	{
		id: "post-communist-dietary-transition",
		name: "Post-Communist Dietary Transition",
		polishName: "Transformacja żywieniowa postkomunistyczna",
		region: "poland",
		description:
			"The rapid shift from traditional socialist-era dietary patterns to Western-style consumption patterns following Poland's economic transformation in the 1990s.",
		polishDescription:
			"Szybkie przejście od tradycyjnych wzorców żywieniowych z epoki socjalizmu do zachodniego stylu konsumpcji po transformacji gospodarczej Polski w latach 90.",
		historicalContext:
			"During communist era, food was reliable but limited in variety. Post-1989 economic changes brought unprecedented food choices but also introduced processed foods, fast food, and Western dietary patterns.",
		polishHistoricalContext:
			"W epoce komunistycznej żywność była niezawodna, ale ograniczona w różnorodności. Zmiany gospodarcze po 1989 roku przyniosły bezprecedensowy wybór żywności, ale także wprowadziły żywność przetworzoną, fast food i zachodnie wzorce żywieniowe.",
		currentPrevalence: 45,
		nutritionalCharacteristics: [
			{
				nutrient: "Processed foods",
				status: "EXCESSIVE",
				amount: "> 60% of calories",
				comparedTo: "Traditional diets",
				reason: "Rapid adoption of Western convenience foods",
				polishReason: "Szybkie przyjęcie zachodniej żywności wygodnej",
			},
			{
				nutrient: "Added sugars",
				status: "EXCESSIVE",
				amount: "> 15% of calories",
				comparedTo: "WHO recommendations",
				reason: "Increased consumption of sweetened beverages and snacks",
				polishReason: "Zwiększone spożycie słodzonych napojów i przekąsek",
			},
			{
				nutrient: "B-vitamins",
				status: "DEFICIENT",
				amount: "< 80% RDA",
				comparedTo: "Traditional diets",
				reason: "Reduced whole grain consumption, increased refined grains",
				polishReason:
					"Zmniejszone spożycie pełnych ziaren, zwiększone rafinowane ziarna",
			},
			{
				nutrient: "Antioxidants",
				status: "DEFICIENT",
				amount: "< 70% optimal",
				comparedTo: "Mediterranean diets",
				reason:
					"Lower fruit and vegetable consumption than traditional patterns",
				polishReason: "Niższe spożycie owoców i warzyw niż wzorce tradycyjne",
			},
		],
		supplementNeeds: [
			{
				supplementId: "b-complex",
				supplementName: "B-Complex Vitamins",
				polishSupplementName: "Witaminy z grupy B",
				needLevel: "HIGH",
				reason:
					"Reduced whole grain consumption and increased stress from rapid social changes",
				polishReason:
					"Zmniejszone spożycie pełnych ziaren i zwiększony stres z szybkich zmian społecznych",
				dosageConsiderations:
					"Balanced B-complex with emphasis on B6, B9, B12 for homocysteine metabolism",
				polishDosageConsiderations:
					"Zrównoważony kompleks B z naciskiem na B6, B9, B12 dla metabolizmu homocysteiny",
			},
			{
				supplementId: "antioxidants",
				supplementName: "Antioxidant Complex",
				polishSupplementName: "Kompleks antyoksydacyjny",
				needLevel: "MODERATE",
				reason:
					"Lower fruit and vegetable intake compared to traditional diets",
				polishReason:
					"Niższe spożycie owoców i warzyw w porównaniu z dietami tradycyjnymi",
				dosageConsiderations:
					"Mixed antioxidants including vitamin C, E, and plant extracts",
				polishDosageConsiderations:
					"Mieszane antyoksydanty w tym witamina C, E i ekstrakty roślinne",
			},
			{
				supplementId: "probiotics",
				supplementName: "Probiotics",
				polishSupplementName: "Probiotyki",
				needLevel: "MODERATE",
				reason: "Disrupted gut microbiome from processed foods and antibiotics",
				polishReason:
					"Zaburzony mikrobiom jelitowy z żywności przetworzonej i antybiotyków",
				dosageConsiderations:
					"Multi-strain probiotics to restore traditional fermented food benefits",
				polishDosageConsiderations:
					"Probiotyki wieloszczepowe do przywrócenia korzyści tradycyjnych produktów fermentowanych",
			},
		],
		seasonalVariations: [
			{
				season: "WINTER",
				changes: [
					"More processed comfort foods",
					"Holiday sweets and alcohol",
					"Less physical activity",
				],
				polishChanges: [
					"Więcej przetworzonych produktów komfortowych",
					"Świąteczne słodycze i alkohol",
					"Mniej aktywności fizycznej",
				],
				supplementAdjustments: [
					"Increase B-vitamins for stress",
					"Antioxidants for holiday indulgence",
					"Probiotics for gut health",
				],
				polishSupplementAdjustments: [
					"Zwiększ witaminy z grupy B na stres",
					"Antyoksydanty na świąteczne folgowanie",
					"Probiotyki dla zdrowia jelit",
				],
			},
		],
		healthImplications: [
			"Increased risk of metabolic syndrome and cardiovascular disease",
			"Higher rates of vitamin and mineral deficiencies",
			"Disrupted gut microbiome from processed foods",
			"Stress-related nutrient depletion from rapid lifestyle changes",
			"Need for targeted supplementation to bridge nutritional gaps",
		],
		polishHealthImplications: [
			"Zwiększone ryzyko zespołu metabolicznego i chorób sercowo-naczyniowych",
			"Wyższe wskaźniki niedoborów witamin i minerałów",
			"Zaburzony mikrobiom jelitowy z żywności przetworzonej",
			"Wyczerpanie składników odżywczych związanych ze stresem z szybkich zmian stylu życia",
			"Potrzeba celowanej suplementacji do wypełnienia luk żywieniowych",
		],
	},
	{
		id: "urban-professional-diet",
		name: "Urban Professional Diet",
		polishName: "Dieta profesjonalisty miejskiego",
		region: "poland",
		description:
			"The dietary pattern of urban professionals in major Polish cities, characterized by convenience foods, irregular meals, and high stress levels.",
		polishDescription:
			"Wzorce żywieniowe profesjonalistów miejskich w dużych miastach Polski, charakteryzujące się żywnością wygodną, nieregularnymi posiłkami i wysokim poziomem stresu.",
		historicalContext:
			"Emerging pattern following Poland's rapid urbanization and economic development. Reflects the fast-paced lifestyle of modern Polish cities with international business influence.",
		polishHistoricalContext:
			"Powstający wzorzec po szybkiej urbanizacji Polski i rozwoju gospodarczym. Odzwierciedla szybki styl życia nowoczesnych polskich miast z międzynarodowymi wpływami biznesowymi.",
		currentPrevalence: 20,
		nutritionalCharacteristics: [
			{
				nutrient: "Meal regularity",
				status: "DEFICIENT",
				amount: "Irregular timing",
				comparedTo: "Traditional patterns",
				reason: "High-stress work schedules and commuting",
				polishReason: "Harmonogramy pracy pod wysokim stresem i dojazdy",
			},
			{
				nutrient: "Micronutrients",
				status: "DEFICIENT",
				amount: "< 60% RDA",
				comparedTo: "Balanced diets",
				reason: "Reliance on convenience and processed foods",
				polishReason: "Poleganie na wygodnej i przetworzonej żywności",
			},
			{
				nutrient: "Caffeine",
				status: "EXCESSIVE",
				amount: "> 400mg daily",
				comparedTo: "EFSA recommendations",
				reason: "High-stress work environment, long hours",
				polishReason: "Środowisko pracy pod wysokim stresem, długie godziny",
			},
			{
				nutrient: "Alcohol",
				status: "EXCESSIVE",
				amount: "Above guidelines",
				comparedTo: "WHO recommendations",
				reason: "Business socializing and stress relief",
				polishReason: "Kontakty biznesowe i ulga w stresie",
			},
		],
		supplementNeeds: [
			{
				supplementId: "adaptogens",
				supplementName: "Adaptogenic Herbs",
				polishSupplementName: "Zioła adaptogenne",
				needLevel: "HIGH",
				reason: "High stress from demanding professional environment",
				polishReason: "Wysoki stres z wymagającego środowiska zawodowego",
				dosageConsiderations: "Rhodiola 200-400mg, Ashwagandha 300-600mg daily",
				polishDosageConsiderations:
					"Rhodiola 200-400mg, Ashwagandha 300-600mg dziennie",
			},
			{
				supplementId: "magnesium",
				supplementName: "Magnesium",
				polishSupplementName: "Magnez",
				needLevel: "HIGH",
				reason: "Stress-induced magnesium depletion and irregular meals",
				polishReason:
					"Wyczerpanie magnezu wywołane stresem i nieregularne posiłki",
				dosageConsiderations:
					"400mg elemental magnesium in glycinate form before bed",
				polishDosageConsiderations:
					"400mg magnezu pierwiastkowego w formie glicynianu przed snem",
			},
			{
				supplementId: "b-complex",
				supplementName: "B-Complex Vitamins",
				polishSupplementName: "Witaminy z grupy B",
				needLevel: "HIGH",
				reason: "High stress, caffeine, and alcohol consumption",
				polishReason: "Wysoki stres, kofeina i spożycie alkoholu",
				dosageConsiderations:
					"Balanced B-complex with extra B6 and B12 for stress metabolism",
				polishDosageConsiderations:
					"Zrównoważony kompleks B z dodatkową B6 i B12 dla metabolizmu stresu",
			},
		],
		seasonalVariations: [
			{
				season: "WINTER",
				changes: [
					"More indoor dining",
					"Holiday business events",
					"Reduced daylight affecting mood",
				],
				polishChanges: [
					"Więcej posiłków w pomieszczeniach",
					"Świąteczne wydarzenia biznesowe",
					"Zmniejszone światło dzienne wpływające na nastrój",
				],
				supplementAdjustments: [
					"Increase vitamin D and adaptogens",
					"B-vitamins for holiday stress",
					"Magnesium for sleep quality",
				],
				polishSupplementAdjustments: [
					"Zwiększ witaminę D i adaptogeny",
					"Witaminy z grupy B na stres świąteczny",
					"Magnez na jakość snu",
				],
			},
		],
		healthImplications: [
			"Increased risk of stress-related disorders and burnout",
			"Higher incidence of digestive issues from irregular eating",
			"Nutrient deficiencies from convenience food reliance",
			"Sleep disturbances from caffeine and alcohol",
			"Need for comprehensive stress management strategies",
		],
		polishHealthImplications: [
			"Zwiększone ryzyko zaburzeń związanych ze stresem i wypalenia zawodowego",
			"Wyższa częstość problemów trawiennych z nieregularnego jedzenia",
			"Niedobory składników odżywczych z polegania na wygodnej żywności",
			"Zaburzenia snu z kofeiny i alkoholu",
			"Potrzeba kompleksowych strategii zarządzania stresem",
		],
	},
];

export const getDietaryPatternsByRegion = (region: string) => {
	return culturalDietaryPatterns.filter((pattern) => pattern.region === region);
};

export const getSupplementNeedsByDietaryPattern = (patternId: string) => {
	const pattern = culturalDietaryPatterns.find((p) => p.id === patternId);
	return pattern?.supplementNeeds || [];
};

export const getSeasonalSupplementAdjustments = (
	patternId: string,
	season: string,
) => {
	const pattern = culturalDietaryPatterns.find((p) => p.id === patternId);
	const seasonal = pattern?.seasonalVariations.find((s) => s.season === season);
	return seasonal?.supplementAdjustments || [];
};
