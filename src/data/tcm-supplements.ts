/**
 * Traditional Chinese Medicine Supplement Database
 *
 * Common TCM herbs with Western supplement equivalents
 * Includes Qi, Yin/Yang, Five Elements, and meridian mappings
 */

import type { TCMFormula, TCMSupplement } from "@/types/tcm";

// TCM Supplements Database
export const tcmSupplements: TCMSupplement[] = [
	{
		supplementId: "ginseng-panax",
		chineseName: "人參",
		pinyin: "Rén Shēn",
		latinName: "Panax ginseng",
		properties: {
			temperature: "Warm",
			polishTemperature: "Ciepły",
			taste: ["Sweet", "Bitter"],
			polishTaste: ["Słodki", "Gorzki"],
			meridiansEntered: ["Heart", "Lung", "Spleen"],
			polishMeridiansEntered: ["Serce", "Płuca", "Śledziona"],
			actions: [
				"Tonifies Yuan Qi",
				"Tonifies Lung Qi",
				"Generates fluids",
				"Calms spirit",
			],
			polishActions: [
				"Wzmacnia Yuan Qi",
				"Wzmacnia Qi Płuc",
				"Generuje płyny",
				"Uspokaja ducha",
			],
			indications: ["Qi Deficiency", "Yang Deficiency"],
			polishIndications: ["Niedobór Qi", "Niedobór Yang"],
		},
		element: "Earth",
		polishElement: "Ziemia",
		yinYang: "Yang",
		qiEffects: {
			tonifies: true,
			moves: false,
			descends: false,
			raises: true,
		},
		traditionalUses: [
			"Extreme exhaustion",
			"Shortness of breath",
			"Cold limbs",
			"Weak pulse",
		],
		polishTraditionalUses: [
			"Skrajne wyczerpanie",
			"Duszność",
			"Zimne kończyny",
			"Słaby puls",
		],
		tcmWesternBridge: [
			{
				tcmConcept: "Tonifies Qi",
				polishTCMConcept: "Wzmacnia Qi",
				westernMechanism: "Adaptogenic effects via HPA axis modulation",
				polishWesternMechanism: "Efekty adaptogenne przez modulację osi HPA",
				evidenceLevel: "STRONG",
			},
			{
				tcmConcept: "Calms spirit (Shen)",
				polishTCMConcept: "Uspokaja ducha (Shen)",
				westernMechanism: "GABAergic and serotonergic modulation",
				polishWesternMechanism: "Modulacja GABAergiczna i serotoninergiczna",
				evidenceLevel: "MODERATE",
			},
		],
	},
	{
		supplementId: "rhodiola-rosea",
		chineseName: "紅景天",
		pinyin: "Hóng Jǐng Tiān",
		latinName: "Rhodiola rosea",
		properties: {
			temperature: "Cool",
			polishTemperature: "Chłodny",
			taste: ["Sweet", "Bitter"],
			polishTaste: ["Słodki", "Gorzki"],
			meridiansEntered: ["Lung", "Heart", "Kidney"],
			polishMeridiansEntered: ["Płuca", "Serce", "Nerki"],
			actions: ["Tonifies Qi", "Nourishes Yin", "Clears Heat", "Calms spirit"],
			polishActions: [
				"Wzmacnia Qi",
				"Odżywia Yin",
				"Oczyszcza Gorąco",
				"Uspokaja ducha",
			],
			indications: ["Qi Deficiency", "Yin Deficiency", "Heat"],
			polishIndications: ["Niedobór Qi", "Niedobór Yin", "Gorąco"],
		},
		element: "Water",
		polishElement: "Woda",
		yinYang: "Balanced",
		qiEffects: {
			tonifies: true,
			moves: true,
			descends: false,
			raises: false,
		},
		traditionalUses: [
			"Altitude sickness",
			"Fatigue",
			"Mental fog",
			"Stress adaptation",
		],
		polishTraditionalUses: [
			"Choroba wysokościowa",
			"Zmęczenie",
			"Mgła mózgowa",
			"Adaptacja do stresu",
		],
		tcmWesternBridge: [
			{
				tcmConcept: "Tonifies Qi and Yin",
				polishTCMConcept: "Wzmacnia Qi i Yin",
				westernMechanism: "Adaptogenic stress response via cortisol regulation",
				polishWesternMechanism:
					"Adaptogenna odpowiedź na stres przez regulację kortyzolu",
				evidenceLevel: "STRONG",
			},
		],
	},
	{
		supplementId: "ginkgo-biloba",
		chineseName: "銀杏",
		pinyin: "Yín Xìng",
		latinName: "Ginkgo biloba",
		properties: {
			temperature: "Neutral",
			polishTemperature: "Neutralny",
			taste: ["Sweet", "Bitter"],
			polishTaste: ["Słodki", "Gorzki"],
			meridiansEntered: ["Lung", "Heart", "Kidney"],
			polishMeridiansEntered: ["Płuca", "Serce", "Nerki"],
			actions: [
				"Moves Blood",
				"Resolves Stasis",
				"Benefits Brain",
				"Opens meridians",
			],
			polishActions: [
				"Porusza Krew",
				"Rozwiązuje Zastój",
				"Wspiera Mózg",
				"Otwiera meridian",
			],
			indications: ["Blood Stasis", "Qi Stagnation"],
			polishIndications: ["Zastój Krwi", "Stagnacja Qi"],
		},
		element: "Metal",
		polishElement: "Metal",
		yinYang: "Balanced",
		qiEffects: {
			tonifies: false,
			moves: true,
			descends: false,
			raises: false,
		},
		traditionalUses: [
			"Poor circulation",
			"Memory decline",
			"Tinnitus",
			"Chest pain",
		],
		polishTraditionalUses: [
			"Słaby krążenie",
			"Spadek pamięci",
			"Szumy uszne",
			"Ból w klatce piersiowej",
		],
		tcmWesternBridge: [
			{
				tcmConcept: "Moves Blood and resolves Stasis",
				polishTCMConcept: "Porusza Krew i rozwiązuje Zastój",
				westernMechanism: "Improves cerebral blood flow via vasodilation",
				polishWesternMechanism:
					"Poprawia przepływ krwi mózgowej przez rozszerzenie naczyń",
				evidenceLevel: "STRONG",
			},
		],
	},
];

// TCM Formulas Database
export const tcmFormulas: TCMFormula[] = [
	{
		id: "si-jun-zi-tang",
		name: "四君子湯",
		pinyin: "Sì Jūn Zǐ Tāng",
		polishName: "Wywar Czterech Szlachetnych",
		englishName: "Four Gentlemen Decoction",
		chiefHerbs: ["Ginseng"],
		deputyHerbs: ["Atractylodes"],
		assistantHerbs: ["Poria"],
		envoyHerbs: ["Licorice"],
		category: "Qi Tonifying",
		polishCategory: "Wzmacniające Qi",
		actions: ["Tonifies Qi", "Strengthens Spleen"],
		polishActions: ["Wzmacnia Qi", "Wzmacnia Śledzionę"],
		indications: ["Qi Deficiency", "Qi Deficiency"],
		polishIndications: ["Niedobór Qi", "Niedobór Qi Śledziony"],
		dosageGuidelines: {
			decoction: "Decoct 30-60g daily",
			polishDecoction: "Gotować 30-60g dziennie",
			modernExtract: "2-3g extract powder 2x daily",
			polishModernExtract: "2-3g proszku ekstraktu 2x dziennie",
		},
		contraindications: ["Yin Deficiency with Heat", "Excess patterns"],
		polishContraindications: ["Niedobór Yin z Gorącem", "Wzorce nadmiaru"],
		westernSupplementEquivalents: [
			"ginseng-panax",
			"vitamin-b-complex",
			"coenzyme-q10",
		],
	},
	{
		id: "liu-wei-di-huang-wan",
		name: "六味地黃丸",
		pinyin: "Liù Wèi Dì Huáng Wán",
		polishName: "Pigułka Sześciu Składników z Rehmannią",
		englishName: "Six Ingredient Pill with Rehmannia",
		chiefHerbs: ["Rehmannia"],
		deputyHerbs: ["Cornus", "Dioscorea"],
		assistantHerbs: ["Poria", "Alisma", "Moutan"],
		envoyHerbs: [],
		category: "Yin Tonifying",
		polishCategory: "Wzmacniające Yin",
		actions: ["Nourishes Kidney Yin", "Tonifies Liver and Kidney"],
		polishActions: ["Odżywia Yin Nerek", "Wzmacnia Wątrobę i Nerki"],
		indications: ["Yin Deficiency", "Yin Deficiency"],
		polishIndications: ["Niedobór Yin Nerek", "Niedobór Yin Wątroby"],
		dosageGuidelines: {
			decoction: "Decoct 30-60g daily",
			polishDecoction: "Gotować 30-60g dziennie",
			modernExtract: "3-6g extract 2x daily",
			polishModernExtract: "3-6g ekstraktu 2x dziennie",
		},
		contraindications: ["Qi Deficiency", "Dampness"],
		polishContraindications: ["Niedobór Qi Śledziony", "Wilgoć"],
		westernSupplementEquivalents: [
			"ashwagandha",
			"magnesium-glycinate",
			"vitamin-d3",
		],
	},
];

// Export all
export { tcmSupplements as default };
