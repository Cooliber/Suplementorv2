import SupplementHistory, {
	type ISupplementHistory,
} from "@/lib/db/models/SupplementHistory";
import { Types } from "mongoose";

/**
 * Supplement ObjectId Mapping
 * These ObjectIds reference the ComprehensiveSupplement collection
 * Retrieved from MongoDB on 2025-01-XX
 */
const SUPPLEMENT_OBJECTIDS: Record<string, string> = {
	ashwagandha: "68e27ab104bfef0cb4713ddd",
	"coenzyme-q10": "68dd30f6fb83adc0777e91e9",
	curcumin: "68dd30f7fb83adc0777e91ee",
	"ginkgo-biloba": "68dd30f7fb83adc0777e91fa",
	"lions-mane": "68e27ab304bfef0cb4713dfe",
	magnesium: "68dd30f7fb83adc0777e920b",
	"omega-3": "68dd30f7fb83adc0777e9215",
	"rhodiola-rosea": "68dd30f7fb83adc0777e9229",
	"vitamin-d3": "68dd30f8fb83adc0777e9231",
};

/**
 * Helper function to convert supplement IDs to ObjectIds
 */
function getSupplementObjectIds(supplementIds: string[]): Types.ObjectId[] {
	return supplementIds
		.filter((id) => SUPPLEMENT_OBJECTIDS[id])
		.map((id) => new Types.ObjectId(SUPPLEMENT_OBJECTIDS[id]));
}

// Minimal, factual TCM timeline seeds (10 entries)
const entries: Array<Partial<ISupplementHistory>> = [
	{
		id: "tcm-shennong-legend",
		title: "Shennong and the Origins of Herbal Medicine",
		polishTitle: "Shennong i początki medycyny ziołowej",
		era: "Mythic Antiquity",
		eraStartYear: -2800,
		eraEndYear: -2000,
		medicineSystem: "TCM",
		geographicRegion: "Ancient China",
		description:
			"Legend attributes the tasting of hundreds of herbs and foundational herbal knowledge to Shennong (Divine Farmer).",
		polishDescription:
			"Legenda przypisuje Shennongowi (Boskiemu Rolnikowi) próbowanie setek ziół i podstawową wiedzę zielarską.",
		keyDiscoveries: [
			"Empirical tasting of herbs",
			"Early materia medica ideas",
		],
		notablePractitioners: [
			{ name: "Shennong", role: "Divine Farmer", era: "Mythic" },
		],
		// Ancient adaptogenic herbs attributed to mythic origins of herbal medicine
		relatedSupplements: getSupplementObjectIds([
			"rhodiola-rosea",
			"ashwagandha",
		]),
		culturalContext:
			"Mythic narrative shaping the ethos of empirical herbal observation.",
		sources: [
			{ title: "Chinese Medicine in Early Chinese Texts", author: "Various" },
		],
		tags: ["mythic", "origins", "herbalism"],
	},
	{
		id: "tcm-huangdi-neijing",
		title: "Huangdi Neijing (Yellow Emperor's Inner Canon)",
		polishTitle: "Huangdi Neijing (Wewnętrzny Kanon Żółtego Cesarza)",
		era: "Warring States to Han",
		eraStartYear: -300,
		eraEndYear: 200,
		medicineSystem: "TCM",
		geographicRegion: "China",
		description:
			"Foundational medical text articulating Qi, Yin-Yang, Five Phases, diagnostics, and therapeutic principles.",
		polishDescription:
			"Fundamentalny tekst medyczny opisujący Qi, Yin-Yang, Pięć Przemian, diagnostykę i zasady terapii.",
		keyDiscoveries: [
			"Qi theory",
			"Yin-Yang",
			"Five Phases",
			"Pattern-based diagnosis",
		],
		notablePractitioners: [{ name: "Huangdi (legendary)" }],
		// Foundational adaptogenic herbs aligned with Qi theory and Yin-Yang balance
		relatedSupplements: getSupplementObjectIds([
			"rhodiola-rosea",
			"ashwagandha",
		]),
		sources: [{ title: "Huangdi Neijing", author: "Anonymous", year: -100 }],
		tags: ["foundational", "theory"],
	},
	{
		id: "tcm-shennong-bencao-jing",
		title: "Shennong Bencao Jing (Divine Farmer's Materia Medica)",
		polishTitle: "Shennong Bencao Jing (Materia Medica Boskiego Rolnika)",
		era: "Han Dynasty",
		eraStartYear: -100,
		eraEndYear: 200,
		medicineSystem: "TCM",
		geographicRegion: "China",
		description:
			"Earliest pharmacological compilation categorizing 365 substances into grades and properties.",
		polishDescription:
			"Najwcześniejsze kompendium farmakologiczne klasyfikujące 365 substancji według klas i właściwości.",
		keyDiscoveries: ["Three-grade classification", "Taste and nature of herbs"],
		notablePractitioners: [{ name: "Anonymous editors" }],
		// Herbs documented in earliest materia medica with anti-inflammatory and cognitive properties
		relatedSupplements: getSupplementObjectIds([
			"curcumin",
			"ginkgo-biloba",
			"rhodiola-rosea",
		]),
		sources: [{ title: "Shennong Bencao Jing" }],
		tags: ["materia-medica", "classification"],
	},
	{
		id: "tcm-zhang-zhongjing-shanghan-lun",
		title: "Zhang Zhongjing and the Shanghan Zabing Lun",
		polishTitle: "Zhang Zhongjing i Shanghan Zabing Lun",
		era: "Late Han",
		eraStartYear: 150,
		eraEndYear: 220,
		medicineSystem: "TCM",
		geographicRegion: "China",
		description:
			"Clinical synthesis on cold damage and miscellaneous diseases, foundational to formula families.",
		polishDescription:
			"Kliniczna synteza chorób z przeziębienia i chorób różnorodnych, fundament rodzin receptur.",
		keyDiscoveries: ["Six-channel patterning", "Formula architecture"],
		notablePractitioners: [{ name: "Zhang Zhongjing", role: "Physician" }],
		// Herbs used in classical formulations for immune support and inflammation
		relatedSupplements: getSupplementObjectIds(["curcumin", "ginkgo-biloba"]),
		sources: [{ title: "Shanghan Lun" }],
		tags: ["formulas", "clinical"],
	},
	{
		id: "tcm-sun-simiao",
		title: "Sun Simiao and Medical Ethics",
		polishTitle: "Sun Simiao i etyka lekarska",
		era: "Tang Dynasty",
		eraStartYear: 600,
		eraEndYear: 700,
		medicineSystem: "TCM",
		geographicRegion: "China",
		description:
			"Influential physician emphasizing ethics, comprehensive prescriptions, and gynecology/pediatrics contributions.",
		polishDescription:
			"Wpływowy lekarz podkreślający etykę, obszerne receptury oraz wkład w ginekologię i pediatrię.",
		keyDiscoveries: ["Medical ethics", "Comprehensive formularies"],
		notablePractitioners: [{ name: "Sun Simiao", role: "Physician" }],
		// Herbs refined by the Medicine King for cognitive and anti-inflammatory benefits
		relatedSupplements: getSupplementObjectIds([
			"ginkgo-biloba",
			"curcumin",
			"lions-mane",
		]),
		sources: [{ title: "Qianjin Yaofang" }],
		tags: ["ethics", "formularies"],
	},
	{
		id: "tcm-song-printing-dissemination",
		title: "Song Dynasty Printing and Dissemination",
		polishTitle: "Druk i upowszechnienie w dynastii Song",
		era: "Song Dynasty",
		eraStartYear: 960,
		eraEndYear: 1279,
		medicineSystem: "TCM",
		geographicRegion: "China",
		description:
			"Woodblock printing enabled standardization and wide distribution of medical texts and formularies.",
		polishDescription:
			"Druk drzeworytniczy umożliwił standaryzację i szeroką dystrybucję tekstów medycznych i formularzy.",
		keyDiscoveries: ["Text standardization", "Knowledge dissemination"],
		notablePractitioners: [],
		// Herbs widely disseminated through printing technology
		relatedSupplements: getSupplementObjectIds([
			"ginkgo-biloba",
			"rhodiola-rosea",
		]),
		sources: [{ title: "Song medical editions" }],
		tags: ["printing", "standardization"],
	},
	{
		id: "tcm-li-shizhen-bencao-gangmu",
		title: "Li Shizhen's Bencao Gangmu (Compendium of Materia Medica)",
		polishTitle: "Bencao Gangmu Li Shizhena (Kompendium Materia Medica)",
		era: "Ming Dynasty",
		eraStartYear: 1550,
		eraEndYear: 1600,
		medicineSystem: "TCM",
		geographicRegion: "China",
		description:
			"Encyclopedic compilation of thousands of substances with properties, indications, and illustrations.",
		polishDescription:
			"Encyklopedyczne kompendium tysięcy substancji z właściwościami, wskazaniami i ilustracjami.",
		keyDiscoveries: ["Systematization", "Illustrated materia medica"],
		notablePractitioners: [{ name: "Li Shizhen", role: "Physician-scholar" }],
		// Comprehensive herbal encyclopedia entries for cognitive and adaptogenic herbs
		relatedSupplements: getSupplementObjectIds([
			"rhodiola-rosea",
			"ginkgo-biloba",
			"curcumin",
			"lions-mane",
			"ashwagandha",
		]),
		sources: [{ title: "Bencao Gangmu", author: "Li Shizhen", year: 1596 }],
		tags: ["materia-medica", "encyclopedia"],
	},
	{
		id: "tcm-qing-refinement",
		title: "Qing Dynasty Refinements and Commentaries",
		polishTitle: "Udoskonalenia i komentarze epoki Qing",
		era: "Qing Dynasty",
		eraStartYear: 1644,
		eraEndYear: 1912,
		medicineSystem: "TCM",
		geographicRegion: "China",
		description:
			"Commentaries and refinements on classical formulas; regional schools elaborated distinctive approaches.",
		polishDescription:
			"Komentarze i udoskonalenia klasycznych receptur; szkoły regionalne rozwijały własne podejścia.",
		keyDiscoveries: ["Commentarial traditions", "Regional schools"],
		notablePractitioners: [],
		// Herbs refined in Qing dynasty practices for cognitive and circulatory benefits
		relatedSupplements: getSupplementObjectIds([
			"ginkgo-biloba",
			"curcumin",
			"rhodiola-rosea",
		]),
		sources: [{ title: "Qing medical commentaries" }],
		tags: ["commentary", "schools"],
	},
	{
		id: "tcm-modern-integration",
		title: "20th Century Modern Integration",
		polishTitle: "XX-wieczna integracja z nowoczesnością",
		era: "Republic to PRC",
		eraStartYear: 1912,
		eraEndYear: 2000,
		medicineSystem: "TCM",
		geographicRegion: "China and Global",
		description:
			"Modern institutions, standard curricula, and integration with biomedicine while preserving classical theory.",
		polishDescription:
			"Nowoczesne instytucje, standardowe programy nauczania i integracja z biomedycyną przy zachowaniu klasycznej teorii.",
		keyDiscoveries: ["Institutionalization", "Integration with modern clinics"],
		notablePractitioners: [],
		// Modern supplements with TCM integration research and clinical validation
		relatedSupplements: getSupplementObjectIds([
			"omega-3",
			"coenzyme-q10",
			"vitamin-d3",
			"magnesium",
		]),
		sources: [{ title: "Modern Chinese Medicine histories" }],
		tags: ["modern", "integration"],
	},
	{
		id: "tcm-globalization",
		title: "Global Dissemination and Regulation",
		polishTitle: "Globalne upowszechnienie i regulacje",
		era: "Late 20th - 21st Century",
		eraStartYear: 1980,
		eraEndYear: 2025,
		medicineSystem: "TCM",
		geographicRegion: "Global",
		description:
			"International practice and research expansion with evolving regulatory frameworks.",
		polishDescription:
			"Międzynarodowa praktyka i rozwój badań wraz z ewoluującymi ramami regulacyjnymi.",
		keyDiscoveries: ["International research", "Regulatory standards"],
		notablePractitioners: [],
		// Herbs popularized globally through TCM dissemination and modern research
		relatedSupplements: getSupplementObjectIds([
			"rhodiola-rosea",
			"ashwagandha",
			"curcumin",
			"ginkgo-biloba",
			"lions-mane",
		]),
		sources: [{ title: "WHO Traditional Medicine Strategy" }],
		tags: ["global", "policy"],
	},
];

export async function seedSupplementHistoryTCM() {
	// Upsert by stable id
	for (const e of entries) {
		await SupplementHistory.updateOne(
			{ id: e.id },
			{ $set: e },
			{ upsert: true },
		);
	}
	return entries.length;
}

export default seedSupplementHistoryTCM;
export { entries as tcmHistoryEntries };
