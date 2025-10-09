/**
 * Circadian Rhythm Seed Data
 * Time-of-day supplement timing recommendations based on circadian biology
 */

import type { ICircadianSupplementTiming } from "../models/CircadianSupplementTiming";

export const circadianTimingData: Partial<ICircadianSupplementTiming>[] = [
	// Early Morning (5:00-8:00)
	{
		id: "early-morning",
		timeOfDay: "EARLY_MORNING",
		polishTimeOfDay: "Wczesny Ranek",
		timeRange: "5:00-8:00",
		description: "Early morning period characterized by cortisol awakening response and rising body temperature",
		polishDescription: "Okres wczesnego ranka charakteryzujący się reakcją przebudzenia kortyzolu i wzrostem temperatury ciała",
		bodyStatistics: {
			temperature: 36.1,
			cortisol: 90, // Peak cortisol
			melatonin: 10, // Declining melatonin
			digestiveEfficiency: 60,
			alertness: 50,
			polishDescription: "Temperatura ciała: 36.1°C, szczyt kortyzolu, spadek melatoniny, umiarkowana sprawność trawienia",
		},
		recommendedSupplements: [
			{
				supplementId: "vitamin-d3",
				supplementName: "Vitamin D3",
				polishSupplementName: "Witamina D3",
				rationale: "Morning sunlight exposure naturally triggers vitamin D production; supplementation aligns with circadian rhythm",
				polishRationale: "Poranne światło słoneczne naturalnie wyzwala produkcję witaminy D; suplementacja zgodna z rytmem dobowym",
				priority: "HIGH",
			},
			{
				supplementId: "b-complex",
				supplementName: "B-Complex Vitamins",
				polishSupplementName: "Witaminy z Kompleksu B",
				rationale: "B vitamins support energy metabolism and are best absorbed during rising cortisol phase",
				polishRationale: "Witaminy B wspierają metabolizm energetyczny i są najlepiej wchłaniane podczas fazy wzrostu kortyzolu",
				priority: "HIGH",
			},
			{
				supplementId: "rhodiola-rosea",
				supplementName: "Rhodiola Rosea",
				polishSupplementName: "Różeniec Górski",
				rationale: "Adaptogen that works synergistically with morning cortisol to enhance alertness without overstimulation",
				polishRationale: "Adaptogen działający synergistycznie z porannym kortyzolem, zwiększający czujność bez nadmiernej stymulacji",
				priority: "MEDIUM",
			},
		],
		avoidSupplements: ["melatonin", "magnesium-glycinate", "ashwagandha"],
		polishAvoidSupplements: ["Melatonina", "Glicynian Magnezu", "Ashwagandha"],
		generalGuidance: "Take energizing supplements with breakfast. Avoid calming supplements that may interfere with natural cortisol awakening response.",
		polishGeneralGuidance: "Przyjmuj suplementy energetyzujące ze śniadaniem. Unikaj suplementów uspokajających, które mogą zakłócać naturalną reakcję przebudzenia kortyzolu.",
		scientificBasis: [
			"Cortisol awakening response peaks 30-45 minutes after waking",
			"Body temperature begins rising from nighttime nadir",
			"Digestive system gradually activates",
		],
		tags: ["morning", "cortisol", "energy", "alertness"],
	},

	// Late Morning (8:00-12:00)
	{
		id: "late-morning",
		timeOfDay: "LATE_MORNING",
		polishTimeOfDay: "Późny Ranek",
		timeRange: "8:00-12:00",
		description: "Peak cognitive performance period with high alertness and optimal body temperature",
		polishDescription: "Szczytowy okres wydajności poznawczej z wysoką czujnością i optymalną temperaturą ciała",
		bodyStatistics: {
			temperature: 36.8,
			cortisol: 70,
			melatonin: 5,
			digestiveEfficiency: 85,
			alertness: 95,
			polishDescription: "Temperatura ciała: 36.8°C, wysoki kortyzol, minimalna melatonina, wysoka sprawność trawienia i czujność",
		},
		recommendedSupplements: [
			{
				supplementId: "omega-3",
				supplementName: "Omega-3 Fatty Acids",
				polishSupplementName: "Kwasy Tłuszczowe Omega-3",
				rationale: "Fat-soluble nutrient best absorbed with morning meal when digestive efficiency is high",
				polishRationale: "Składnik rozpuszczalny w tłuszczach najlepiej wchłaniany z porannym posiłkiem przy wysokiej sprawności trawienia",
				priority: "HIGH",
			},
			{
				supplementId: "coenzyme-q10",
				supplementName: "Coenzyme Q10",
				polishSupplementName: "Koenzym Q10",
				rationale: "Supports mitochondrial energy production during peak metabolic activity",
				polishRationale: "Wspiera mitochondrialną produkcję energii podczas szczytowej aktywności metabolicznej",
				priority: "MEDIUM",
			},
			{
				supplementId: "lions-mane",
				supplementName: "Lion's Mane Mushroom",
				polishSupplementName: "Soplówka Jeżowata",
				rationale: "Cognitive enhancer that works best during peak mental performance hours",
				polishRationale: "Wzmacniacz funkcji poznawczych działający najlepiej podczas szczytowych godzin wydajności umysłowej",
				priority: "MEDIUM",
			},
		],
		avoidSupplements: [],
		polishAvoidSupplements: [],
		generalGuidance: "Optimal time for cognitive enhancers and fat-soluble vitamins. Take with substantial breakfast or mid-morning snack.",
		polishGeneralGuidance: "Optymalny czas na wzmacniacze funkcji poznawczych i witaminy rozpuszczalne w tłuszczach. Przyjmuj z obfitym śniadaniem lub przekąską.",
		scientificBasis: [
			"Peak cognitive performance occurs mid-morning",
			"Digestive efficiency reaches 85% capacity",
			"Body temperature optimal for metabolic processes",
		],
		tags: ["cognitive", "energy", "metabolism", "peak-performance"],
	},

	// Afternoon (12:00-16:00)
	{
		id: "afternoon",
		timeOfDay: "AFTERNOON",
		polishTimeOfDay: "Popołudnie",
		timeRange: "12:00-16:00",
		description: "Peak body temperature and digestive efficiency period, ideal for nutrient absorption",
		polishDescription: "Szczytowa temperatura ciała i sprawność trawienia, idealny okres na wchłanianie składników odżywczych",
		bodyStatistics: {
			temperature: 37.0,
			cortisol: 50,
			melatonin: 0,
			digestiveEfficiency: 95,
			alertness: 85,
			polishDescription: "Temperatura ciała: 37.0°C (szczyt), umiarkowany kortyzol, brak melatoniny, maksymalna sprawność trawienia",
		},
		recommendedSupplements: [
			{
				supplementId: "curcumin",
				supplementName: "Curcumin",
				polishSupplementName: "Kurkumina",
				rationale: "Best absorbed with fats during peak digestive efficiency; anti-inflammatory effects support afternoon recovery",
				polishRationale: "Najlepiej wchłaniana z tłuszczami podczas szczytowej sprawności trawienia; działanie przeciwzapalne wspiera popołudniową regenerację",
				priority: "HIGH",
			},
			{
				supplementId: "ginkgo-biloba",
				supplementName: "Ginkgo Biloba",
				polishSupplementName: "Miłorząb Japoński",
				rationale: "Supports circulation and cognitive function during post-lunch dip",
				polishRationale: "Wspiera krążenie i funkcje poznawcze podczas popołudniowego spadku energii",
				priority: "MEDIUM",
			},
		],
		avoidSupplements: [],
		polishAvoidSupplements: [],
		generalGuidance: "Best time for supplements requiring high digestive efficiency. Take with lunch for optimal absorption.",
		polishGeneralGuidance: "Najlepszy czas na suplementy wymagające wysokiej sprawności trawienia. Przyjmuj z obiadem dla optymalnego wchłaniania.",
		scientificBasis: [
			"Body temperature peaks at 37°C",
			"Digestive efficiency reaches maximum 95%",
			"Optimal nutrient absorption window",
		],
		tags: ["digestion", "absorption", "peak-temperature", "lunch"],
	},

	// Evening (16:00-20:00)
	{
		id: "evening",
		timeOfDay: "EVENING",
		polishTimeOfDay: "Wieczór",
		timeRange: "16:00-20:00",
		description: "Transition period with declining body temperature and rising melatonin, preparing for rest",
		polishDescription: "Okres przejściowy ze spadającą temperaturą ciała i rosnącą melatoniną, przygotowanie do odpoczynku",
		bodyStatistics: {
			temperature: 36.5,
			cortisol: 30,
			melatonin: 20,
			digestiveEfficiency: 70,
			alertness: 60,
			polishDescription: "Temperatura ciała: 36.5°C (spadek), niski kortyzol, wzrost melatoniny, umiarkowana sprawność trawienia",
		},
		recommendedSupplements: [
			{
				supplementId: "magnesium",
				supplementName: "Magnesium Glycinate",
				polishSupplementName: "Glicynian Magnezu",
				rationale: "Supports relaxation and sleep preparation; glycinate form is calming and well-absorbed",
				polishRationale: "Wspiera relaksację i przygotowanie do snu; forma glicynianowa jest uspokajająca i dobrze wchłaniana",
				priority: "HIGH",
			},
			{
				supplementId: "ashwagandha",
				supplementName: "Ashwagandha",
				polishSupplementName: "Ashwagandha",
				rationale: "Adaptogen that reduces evening cortisol and supports transition to rest state",
				polishRationale: "Adaptogen redukujący wieczorny kortyzol i wspierający przejście w stan odpoczynku",
				priority: "HIGH",
			},
		],
		avoidSupplements: ["caffeine", "b-complex", "rhodiola-rosea"],
		polishAvoidSupplements: ["Kofeina", "Kompleks B", "Różeniec Górski"],
		generalGuidance: "Focus on calming supplements that support natural melatonin rise. Avoid stimulating supplements.",
		polishGeneralGuidance: "Skup się na suplementach uspokajających wspierających naturalny wzrost melatoniny. Unikaj suplementów stymulujących.",
		scientificBasis: [
			"Melatonin production begins to rise",
			"Body temperature starts declining",
			"Cortisol reaches evening low",
		],
		tags: ["relaxation", "sleep-prep", "calming", "evening"],
	},

	// Night (20:00-00:00)
	{
		id: "night",
		timeOfDay: "NIGHT",
		polishTimeOfDay: "Noc",
		timeRange: "20:00-00:00",
		description: "Sleep preparation period with peak melatonin production and minimal digestive activity",
		polishDescription: "Okres przygotowania do snu ze szczytową produkcją melatoniny i minimalną aktywnością trawienną",
		bodyStatistics: {
			temperature: 36.2,
			cortisol: 10,
			melatonin: 80,
			digestiveEfficiency: 40,
			alertness: 30,
			polishDescription: "Temperatura ciała: 36.2°C, minimalny kortyzol, szczyt melatoniny, niska sprawność trawienia",
		},
		recommendedSupplements: [
			{
				supplementId: "melatonin",
				supplementName: "Melatonin",
				polishSupplementName: "Melatonina",
				rationale: "Supports natural sleep-wake cycle when taken 30-60 minutes before bed",
				polishRationale: "Wspiera naturalny cykl sen-czuwanie przyjęta 30-60 minut przed snem",
				priority: "MEDIUM",
			},
			{
				supplementId: "l-theanine",
				supplementName: "L-Theanine",
				polishSupplementName: "L-Teanina",
				rationale: "Promotes relaxation without sedation, supports sleep quality",
				polishRationale: "Promuje relaksację bez sedacji, wspiera jakość snu",
				priority: "MEDIUM",
			},
		],
		avoidSupplements: ["all-stimulants", "b-vitamins", "vitamin-d"],
		polishAvoidSupplements: ["Wszystkie Stymulanty", "Witaminy B", "Witamina D"],
		generalGuidance: "Only take sleep-supporting supplements. Avoid all stimulants and energy-boosting supplements.",
		polishGeneralGuidance: "Przyjmuj tylko suplementy wspierające sen. Unikaj wszystkich stymulantów i suplementów zwiększających energię.",
		scientificBasis: [
			"Melatonin peaks during night hours",
			"Digestive system enters rest mode",
			"Body temperature continues to decline",
		],
		tags: ["sleep", "melatonin", "rest", "night"],
	},

	// Deep Night (00:00-05:00)
	{
		id: "deep-night",
		timeOfDay: "DEEP_NIGHT",
		polishTimeOfDay: "Głęboka Noc",
		timeRange: "00:00-05:00",
		description: "Deep sleep and recovery period with lowest body temperature and minimal metabolic activity",
		polishDescription: "Okres głębokiego snu i regeneracji z najniższą temperaturą ciała i minimalną aktywnością metaboliczną",
		bodyStatistics: {
			temperature: 35.9,
			cortisol: 5,
			melatonin: 95,
			digestiveEfficiency: 20,
			alertness: 10,
			polishDescription: "Temperatura ciała: 35.9°C (najniższa), minimalny kortyzol, maksymalna melatonina, minimalna sprawność trawienia",
		},
		recommendedSupplements: [],
		avoidSupplements: ["all-supplements"],
		polishAvoidSupplements: ["Wszystkie Suplementy"],
		generalGuidance: "No supplements should be taken during deep sleep. This is the body's natural recovery period.",
		polishGeneralGuidance: "Nie należy przyjmować żadnych suplementów podczas głębokiego snu. To naturalny okres regeneracji organizmu.",
		scientificBasis: [
			"Lowest body temperature of circadian cycle",
			"Peak melatonin and growth hormone production",
			"Cellular repair and recovery processes active",
		],
		tags: ["sleep", "recovery", "rest", "no-supplements"],
	},
];

export default circadianTimingData;

