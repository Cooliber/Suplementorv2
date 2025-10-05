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
import { caffeineProfile } from "./caffeine";
import { caffeineLTheanineProfile } from "./caffeine-l-theanine";
import { cdpCholineProfile } from "./cdp-choline";
import { coq10Profile } from "./coenzyme-q10";
import { creatineProfile } from "./creatine";
import { curcuminProfile } from "./curcumin";
import { ginkgoBilobaProfile } from "./ginkgo-biloba";
import { lTheanineProfile } from "./l-theanine";
import { lionsManeProfile } from "./lions-mane";
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
import { stJohnsWortProfile } from "./st-johns-wort";
import { vitaminD3Profile } from "./vitamin-d3";
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
	caffeineProfile,
	caffeineLTheanineProfile,
	cdpCholineProfile,
	curcuminProfile,
	coq10Profile,
	creatineProfile,
	ginkgoBilobaProfile,
	lTheanineProfile,
	lionsManeProfile,
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
	stJohnsWortProfile,
	vitaminD3Profile,
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
	caffeine: caffeineProfile,
	"caffeine-l-theanine": caffeineLTheanineProfile,
	"cdp-choline": cdpCholineProfile,
	"coenzyme-q10": coq10Profile,
	curcumin: curcuminProfile,
	creatine: creatineProfile,
	"ginkgo-biloba": ginkgoBilobaProfile,
	"l-theanine": lTheanineProfile,
	"lions-mane": lionsManeProfile,
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
	"st-johns-wort": stJohnsWortProfile,
	"vitamin-d3": vitaminD3Profile,
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
	caffeineProfile,
	caffeineLTheanineProfile,
	cdpCholineProfile,
	coq10Profile,
	curcuminProfile,
	creatineProfile,
	ginkgoBilobaProfile,
	lTheanineProfile,
	lionsManeProfile,
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
	stJohnsWortProfile,
	vitaminD3Profile,
	zincProfile,
];

// Export type definitions
export type { SupplementWithRelations } from "../../types/supplement";
