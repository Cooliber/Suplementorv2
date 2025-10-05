/**
 * Traditional Chinese Medicine (TCM) Type Definitions
 *
 * Integrates TCM concepts with Western supplement science:
 * - Qi (氣) - Vital energy
 * - Yin/Yang (陰陽) - Balance principles
 * - Five Elements (五行) - Wood, Fire, Earth, Metal, Water
 * - Meridians (經絡) - Energy channels
 * - Zang-Fu Organs (臟腑) - Organ systems
 */

import { z } from "zod";

// Five Elements (Wu Xing - 五行)
export type FiveElement = "Wood" | "Fire" | "Earth" | "Metal" | "Water";

export const FiveElementSchema = z.enum([
	"Wood",
	"Fire",
	"Earth",
	"Metal",
	"Water",
]);

export const FiveElementPolish: Record<FiveElement, string> = {
	Wood: "Drewno",
	Fire: "Ogień",
	Earth: "Ziemia",
	Metal: "Metal",
	Water: "Woda",
};

// Yin/Yang Balance
export type YinYangBalance = "Yin" | "Yang" | "Balanced";

export const YinYangBalanceSchema = z.enum(["Yin", "Yang", "Balanced"]);

// Qi Types
export type QiType =
	| "Yuan Qi" // Original Qi
	| "Zong Qi" // Gathering Qi
	| "Ying Qi" // Nutritive Qi
	| "Wei Qi" // Defensive Qi
	| "Zang Fu Qi"; // Organ Qi

export const QiTypeSchema = z.enum([
	"Yuan Qi",
	"Zong Qi",
	"Ying Qi",
	"Wei Qi",
	"Zang Fu Qi",
]);

// TCM Organ Systems (Zang-Fu)
export type TCMOrgan =
	| "Heart" // 心 Xin
	| "Liver" // 肝 Gan
	| "Spleen" // 脾 Pi
	| "Lung" // 肺 Fei
	| "Kidney" // 腎 Shen
	| "Pericardium" // 心包 Xin Bao
	| "Small Intestine" // 小腸 Xiao Chang
	| "Gallbladder" // 膽 Dan
	| "Stomach" // 胃 Wei
	| "Large Intestine" // 大腸 Da Chang
	| "Bladder" // 膀胱 Pang Guang
	| "Triple Burner"; // 三焦 San Jiao

export const TCMOrganSchema = z.enum([
	"Heart",
	"Liver",
	"Spleen",
	"Lung",
	"Kidney",
	"Pericardium",
	"Small Intestine",
	"Gallbladder",
	"Stomach",
	"Large Intestine",
	"Bladder",
	"Triple Burner",
]);

export const TCMOrganPolish: Record<TCMOrgan, string> = {
	Heart: "Serce",
	Liver: "Wątroba",
	Spleen: "Śledziona",
	Lung: "Płuca",
	Kidney: "Nerki",
	Pericardium: "Osierdzie",
	"Small Intestine": "Jelito Cienkie",
	Gallbladder: "Pęcherzyk Żółciowy",
	Stomach: "Żołądek",
	"Large Intestine": "Jelito Grube",
	Bladder: "Pęcherz Moczowy",
	"Triple Burner": "Potrójny Ogrzewacz",
};

// TCM Diagnostic Patterns
export type TCMPattern =
	| "Qi Deficiency" // 氣虛
	| "Blood Deficiency" // 血虛
	| "Yin Deficiency" // 陰虛
	| "Yang Deficiency" // 陽虛
	| "Qi Stagnation" // 氣滯
	| "Blood Stasis" // 血瘀
	| "Dampness" // 濕
	| "Phlegm" // 痰
	| "Heat" // 熱
	| "Cold"; // 寒

export const TCMPatternSchema = z.enum([
	"Qi Deficiency",
	"Blood Deficiency",
	"Yin Deficiency",
	"Yang Deficiency",
	"Qi Stagnation",
	"Blood Stasis",
	"Dampness",
	"Phlegm",
	"Heat",
	"Cold",
]);

export const TCMPatternPolish: Record<TCMPattern, string> = {
	"Qi Deficiency": "Niedobór Qi",
	"Blood Deficiency": "Niedobór Krwi",
	"Yin Deficiency": "Niedobór Yin",
	"Yang Deficiency": "Niedobór Yang",
	"Qi Stagnation": "Stagnacja Qi",
	"Blood Stasis": "Zastój Krwi",
	Dampness: "Wilgoć",
	Phlegm: "Flegma",
	Heat: "Gorąco",
	Cold: "Zimno",
};

// TCM Herb Properties
export interface TCMHerbProperties {
	// Temperature nature
	temperature: "Hot" | "Warm" | "Neutral" | "Cool" | "Cold";
	polishTemperature: string;

	// Taste (五味 Wu Wei)
	taste: ("Sweet" | "Sour" | "Bitter" | "Pungent" | "Salty")[];
	polishTaste: string[];

	// Meridians entered
	meridiansEntered: TCMOrgan[];
	polishMeridiansEntered: string[];

	// Actions
	actions: string[];
	polishActions: string[];

	// Indications
	indications: TCMPattern[];
	polishIndications: string[];
}

export const TCMHerbPropertiesSchema = z.object({
	temperature: z.enum(["Hot", "Warm", "Neutral", "Cool", "Cold"]),
	polishTemperature: z.string(),
	taste: z.array(z.enum(["Sweet", "Sour", "Bitter", "Pungent", "Salty"])),
	polishTaste: z.array(z.string()),
	meridiansEntered: z.array(TCMOrganSchema),
	polishMeridiansEntered: z.array(z.string()),
	actions: z.array(z.string()),
	polishActions: z.array(z.string()),
	indications: z.array(TCMPatternSchema),
	polishIndications: z.array(z.string()),
});

// TCM Herbal Formula
export interface TCMFormula {
	id: string;
	name: string; // Chinese name
	pinyin: string; // Romanization
	polishName: string;
	englishName: string;

	// Formula composition
	chiefHerbs: string[]; // 君藥 Jun Yao
	deputyHerbs: string[]; // 臣藥 Chen Yao
	assistantHerbs: string[]; // 佐藥 Zuo Yao
	envoyHerbs: string[]; // 使藥 Shi Yao

	// Properties
	category: string;
	polishCategory: string;
	actions: string[];
	polishActions: string[];
	indications: TCMPattern[];
	polishIndications: string[];

	// Dosage
	dosageGuidelines: {
		decoction: string; // Traditional decoction
		polishDecoction: string;
		modernExtract: string; // Modern extract form
		polishModernExtract: string;
	};

	// Contraindications
	contraindications: string[];
	polishContraindications: string[];

	// Western equivalents
	westernSupplementEquivalents: string[]; // IDs of Western supplements
}

export const TCMFormulaSchema = z.object({
	id: z.string(),
	name: z.string(),
	pinyin: z.string(),
	polishName: z.string(),
	englishName: z.string(),
	chiefHerbs: z.array(z.string()),
	deputyHerbs: z.array(z.string()),
	assistantHerbs: z.array(z.string()),
	envoyHerbs: z.array(z.string()),
	category: z.string(),
	polishCategory: z.string(),
	actions: z.array(z.string()),
	polishActions: z.array(z.string()),
	indications: z.array(TCMPatternSchema),
	polishIndications: z.array(z.string()),
	dosageGuidelines: z.object({
		decoction: z.string(),
		polishDecoction: z.string(),
		modernExtract: z.string(),
		polishModernExtract: z.string(),
	}),
	contraindications: z.array(z.string()),
	polishContraindications: z.array(z.string()),
	westernSupplementEquivalents: z.array(z.string()),
});

// TCM Supplement (extends Western supplement with TCM properties)
export interface TCMSupplement {
	// Western supplement ID
	supplementId: string;

	// TCM herb information
	chineseName: string; // 中文名
	pinyin: string;
	latinName: string; // Botanical name

	// TCM properties
	properties: TCMHerbProperties;

	// Five Element correspondence
	element: FiveElement;
	polishElement: string;

	// Yin/Yang nature
	yinYang: YinYangBalance;

	// Qi effects
	qiEffects: {
		tonifies: boolean; // Tonifies Qi
		moves: boolean; // Moves Qi
		descends: boolean; // Descends Qi
		raises: boolean; // Raises Qi
	};

	// Traditional uses
	traditionalUses: string[];
	polishTraditionalUses: string[];

	// Modern research bridging TCM and Western science
	tcmWesternBridge: {
		tcmConcept: string;
		polishTCMConcept: string;
		westernMechanism: string;
		polishWesternMechanism: string;
		evidenceLevel: "STRONG" | "MODERATE" | "WEAK" | "INSUFFICIENT";
	}[];
}

export const TCMSupplementSchema = z.object({
	supplementId: z.string(),
	chineseName: z.string(),
	pinyin: z.string(),
	latinName: z.string(),
	properties: TCMHerbPropertiesSchema,
	element: FiveElementSchema,
	polishElement: z.string(),
	yinYang: YinYangBalanceSchema,
	qiEffects: z.object({
		tonifies: z.boolean(),
		moves: z.boolean(),
		descends: z.boolean(),
		raises: z.boolean(),
	}),
	traditionalUses: z.array(z.string()),
	polishTraditionalUses: z.array(z.string()),
	tcmWesternBridge: z.array(
		z.object({
			tcmConcept: z.string(),
			polishTCMConcept: z.string(),
			westernMechanism: z.string(),
			polishWesternMechanism: z.string(),
			evidenceLevel: z.enum(["STRONG", "MODERATE", "WEAK", "INSUFFICIENT"]),
		}),
	),
});
