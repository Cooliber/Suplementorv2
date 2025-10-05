/**
 * Comprehensive Supplements Database - Atomic Structure
 * Each supplement is in its own file for better maintainability
 */

export * from "./types";

export { omega_3_epa_dha } from "./omega-3-epa-dha";
export { magnesium_l_threonate } from "./magnesium-l-threonate";
export { lions_mane_mushroom } from "./lions-mane-mushroom";
export { alpha_gpc } from "./alpha-gpc";
export { bacopa_monnieri } from "./bacopa-monnieri";
export { rhodiola_rosea } from "./rhodiola-rosea";
export { modafinil } from "./modafinil";
export { vitamin_d3 } from "./vitamin-d3";
export { creatine_monohydrate } from "./creatine-monohydrate";
export { caffeine_l_theanine } from "./caffeine-l-theanine";
export { phosphatidylserine } from "./phosphatidylserine";

import { alpha_gpc } from "./alpha-gpc";
import { bacopa_monnieri } from "./bacopa-monnieri";
import { caffeine_l_theanine } from "./caffeine-l-theanine";
import { creatine_monohydrate } from "./creatine-monohydrate";
import { lions_mane_mushroom } from "./lions-mane-mushroom";
import { magnesium_l_threonate } from "./magnesium-l-threonate";
import { modafinil } from "./modafinil";
import { omega_3_epa_dha } from "./omega-3-epa-dha";
import { phosphatidylserine } from "./phosphatidylserine";
import { rhodiola_rosea } from "./rhodiola-rosea";
// Export all supplements as array
import type { ComprehensiveSupplementProfile } from "./types";
import { vitamin_d3 } from "./vitamin-d3";

export const comprehensiveSupplementsDatabase: ComprehensiveSupplementProfile[] =
	[
		omega_3_epa_dha,
		magnesium_l_threonate,
		lions_mane_mushroom,
		alpha_gpc,
		bacopa_monnieri,
		rhodiola_rosea,
		modafinil,
		vitamin_d3,
		creatine_monohydrate,
		caffeine_l_theanine,
		phosphatidylserine,
	];

// Legacy export for backwards compatibility
export const comprehensiveSupplements = comprehensiveSupplementsDatabase;
