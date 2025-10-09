import type { SupplementWithRelations } from "@/types/supplement";
/**
 * Supplements Index - T3 Stack Implementation
 * Exports all supplement profiles for the Suplementor application
 * Comprehensive collection of evidence-based supplement data with Polish localization
 */

// Import individual supplement profiles
import { acetylLCarnitineProfile } from "./acetyl-l-carnitine";
import { alphaGPCProfile } from "./alpha-gpc";
import { aniracetamProfile } from "./aniracetam";
import { ashwagandhaProfile } from "./ashwagandha";
import { bComplexProfile } from "./b-complex";
import { bVitaminsComplexProfile } from "./b-vitamins-complex";
import { bacopaProfile } from "./bacopa";
import { betaAlanineProfile } from "./beta-alanine";
import { caffeineProfile } from "./caffeine";
import { caffeineLTheanineProfile } from "./caffeine-l-theanine";
import { calciumCitrateProfile } from "./calcium-citrate";
import { cdpCholineProfile } from "./cdp-choline";
import { coq10Profile } from "./coenzyme-q10";
import { creatineProfile } from "./creatine";
import { curcuminProfile } from "./curcumin";
import { ginkgoBilobaProfile } from "./ginkgo-biloba";
import { ironBisglycinateProfile } from "./iron-bisglycinate";
import { lTheanineProfile } from "./l-theanine";
import { lionsManeProfile } from "./lions-mane";
import { lTyrosineProfile } from "./l-tyrosine";
import { magnesiumProfile } from "./magnesium";
import { nAcetylCysteineProfile } from "./n-acetyl-cysteine";
import { noopeptProfile } from "./noopept";
import { omega3Profile } from "./omega-3";
import { phosphatidylserineProfile } from "./phosphatidylserine";
import { piracetamProfile } from "./piracetam";
import { pterostilbeneProfile } from "./pterostilbene";
import { pycnogenolProfile } from "./pycnogenol";
import { resveratrolProfile } from "./resveratrol";
import { rhodiolaRoseaProfile } from "./rhodiola-rosea";
import { samEProfile } from "./sam-e";
import { seleniumMethionineProfile } from "./selenium-methionine";
import { stJohnsWortProfile } from "./st-johns-wort";
import { taurineProfile } from "./taurine";
import { vitaminD3Profile } from "./vitamin-d3";
import { vitaminK2MK7Profile } from "./vitamin-k2-mk7";
import { zincProfile } from "./zinc";

// Export individual supplement profiles
export {
	acetylLCarnitineProfile,
	alphaGPCProfile,
	aniracetamProfile,
	ashwagandhaProfile,
	bComplexProfile,
	bVitaminsComplexProfile,
	bacopaProfile,
	betaAlanineProfile,
	caffeineProfile,
	caffeineLTheanineProfile,
	calciumCitrateProfile,
	cdpCholineProfile,
	coq10Profile,
	creatineProfile,
	curcuminProfile,
	ginkgoBilobaProfile,
	ironBisglycinateProfile,
	lTheanineProfile,
	lionsManeProfile,
	lTyrosineProfile,
	magnesiumProfile,
	nAcetylCysteineProfile,
	noopeptProfile,
	omega3Profile,
	phosphatidylserineProfile,
	piracetamProfile,
	pterostilbeneProfile,
	pycnogenolProfile,
	resveratrolProfile,
	rhodiolaRoseaProfile,
	samEProfile,
	seleniumMethionineProfile,
	stJohnsWortProfile,
	taurineProfile,
	vitaminD3Profile,
	vitaminK2MK7Profile,
	zincProfile,
};

// Export all supplement profiles as a map for easy access
export const supplementProfiles = {
	"acetyl-l-carnitine": acetylLCarnitineProfile,
	"alpha-gpc": alphaGPCProfile,
	aniracetam: aniracetamProfile,
	ashwagandha: ashwagandhaProfile,
	"b-complex": bComplexProfile,
	"b-vitamins-complex": bVitaminsComplexProfile,
	bacopa: bacopaProfile,
	"beta-alanine": betaAlanineProfile,
	caffeine: caffeineProfile,
	"caffeine-l-theanine": caffeineLTheanineProfile,
	"calcium-citrate": calciumCitrateProfile,
	"cdp-choline": cdpCholineProfile,
	"coenzyme-q10": coq10Profile,
	creatine: creatineProfile,
	curcumin: curcuminProfile,
	"ginkgo-biloba": ginkgoBilobaProfile,
	"iron-bisglycinate": ironBisglycinateProfile,
	"l-theanine": lTheanineProfile,
	"lions-mane": lionsManeProfile,
	"l-tyrosine": lTyrosineProfile,
	magnesium: magnesiumProfile,
	"n-acetyl-cysteine": nAcetylCysteineProfile,
	noopept: noopeptProfile,
	"omega-3": omega3Profile,
	phosphatidylserine: phosphatidylserineProfile,
	piracetam: piracetamProfile,
	pterostilbene: pterostilbeneProfile,
	pycnogenol: pycnogenolProfile,
	resveratrol: resveratrolProfile,
	"rhodiola-rosea": rhodiolaRoseaProfile,
	"sam-e": samEProfile,
	"selenium-methionine": seleniumMethionineProfile,
	"st-johns-wort": stJohnsWortProfile,
	taurine: taurineProfile,
	"vitamin-d3": vitaminD3Profile,
	"vitamin-k2-mk7": vitaminK2MK7Profile,
	zinc: zincProfile,
};

// Export all supplement profiles as an array
export const allSupplementProfiles = [
	acetylLCarnitineProfile,
	alphaGPCProfile,
	aniracetamProfile,
	ashwagandhaProfile,
	bComplexProfile,
	bVitaminsComplexProfile,
	bacopaProfile,
	betaAlanineProfile,
	caffeineProfile,
	caffeineLTheanineProfile,
	calciumCitrateProfile,
	cdpCholineProfile,
	coq10Profile,
	creatineProfile,
	curcuminProfile,
	ginkgoBilobaProfile,
	ironBisglycinateProfile,
	lTheanineProfile,
	lionsManeProfile,
	lTyrosineProfile,
	magnesiumProfile,
	nAcetylCysteineProfile,
	noopeptProfile,
	omega3Profile,
	phosphatidylserineProfile,
	piracetamProfile,
	pterostilbeneProfile,
	pycnogenolProfile,
	resveratrolProfile,
	rhodiolaRoseaProfile,
	samEProfile,
	seleniumMethionineProfile,
	stJohnsWortProfile,
	taurineProfile,
	vitaminD3Profile,
	vitaminK2MK7Profile,
	zincProfile,
];

// Export type definitions
export type { SupplementWithRelations } from "../../types/supplement";
