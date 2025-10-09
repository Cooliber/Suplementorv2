/**
 * MongoDB Seed Script for Suplementor
 * Seeds database with all supplement profiles and knowledge graph data
 * Migrates 27+ supplements from static data files to MongoDB
 */

// Load environment variables
import "dotenv/config";

import { allSupplementProfiles } from "@/data/supplements";
import type { SupplementWithRelations } from "@/types/supplement";
import {
	ComprehensiveSupplement,
	KnowledgeNode,
	KnowledgeRelationship,
	CircadianSupplementTiming,
} from "./models";
import connectToDatabase, { disconnectFromDatabase } from "./mongodb";
import circadianTimingData from "./seeds/circadian-timing";

// Color codes for console output
const colors = {
	reset: "\x1b[0m",
	bright: "\x1b[1m",
	green: "\x1b[32m",
	yellow: "\x1b[33m",
	red: "\x1b[31m",
	cyan: "\x1b[36m",
	blue: "\x1b[34m",
};

/**
 * Transform static supplement data to MongoDB ComprehensiveSupplement format
 */
function transformSupplementData(supplement: SupplementWithRelations): any {
	return {
		id: supplement.id,
		name: supplement.name,
		polishName: supplement.polishName,
		category: supplement.category,
		description: supplement.description || "",
		polishDescription: supplement.polishDescription || "",
		evidenceLevel: supplement.evidenceLevel,

		// Active compounds
		activeCompounds: supplement.activeCompounds.map((compound) => ({
			name: compound.name,
			polishName: compound.polishName || compound.name,
			concentration: compound.concentration || "Not specified",
			bioavailability: compound.bioavailability || 0,
			halfLife: compound.halfLife || "Unknown",
			polishHalfLife: compound.halfLife || "Nieznany",
			metabolites: compound.metabolicPathway || [],
			polishMetabolites: compound.metabolicPathway || [],
		})),

		// Mechanisms of action
		mechanisms: supplement.mechanisms.map((mechanism) => ({
			pathway: mechanism.pathway,
			polishPathway: mechanism.polishPathway || mechanism.pathway,
			targetSite: mechanism.name || mechanism.pathway,
			polishTargetSite:
				mechanism.polishName || mechanism.polishPathway || mechanism.pathway,
			description: mechanism.description,
			polishDescription: mechanism.polishDescription || mechanism.description,
			evidenceLevel: mechanism.evidenceLevel,
			timeToEffect: mechanism.timeToEffect || "Variable",
			polishTimeToEffect: mechanism.timeToEffect || "Zmienny",
		})),

		// Clinical applications
		clinicalApplications: supplement.clinicalApplications.map((app) => ({
			condition: app.condition,
			polishCondition: app.polishCondition,
			effectivenessRating: app.effectivenessRating || 5,
			evidenceLevel: app.evidenceLevel,
			recommendedDosage: app.recommendedDose,
			duration: app.duration || "Variable",
			mechanism: app.indication || app.condition,
			polishMechanism: app.polishIndication || app.polishCondition,
			contraindications: [],
			polishContraindications: [],
			monitoringRequirements: [],
			polishMonitoringRequirements: [],
		})),

		// Pharmacokinetics (basic structure)
		pharmacokinetics: {
			absorption: {
				rate: "Moderate",
				factors: ["Food intake", "Formulation"],
				polishFactors: ["Spożycie pokarmu", "Formulacja"],
				bioavailability: 70,
			},
			distribution: {
				volumeOfDistribution: "Unknown",
				proteinBinding: 50,
				tissueDistribution: ["Brain", "Liver"],
				polishTissueDistribution: ["Mózg", "Wątroba"],
			},
			metabolism: {
				primaryPathway: "Hepatic",
				polishPrimaryPathway: "Wątrobowy",
				enzymes: ["CYP450"],
				metabolites: [],
				polishMetabolites: [],
			},
			elimination: {
				halfLife: "24 hours",
				clearance: "Renal",
				excretionRoute: "Urine",
				polishExcretionRoute: "Mocz",
			},
		},

		// Safety profile
		safetyProfile: {
			pregnancyCategory: "UNKNOWN",
			breastfeedingSafety: "Unknown",
			pediatricUse: {
				approved: false,
				ageRestrictions: "Consult physician",
				polishAgeRestrictions: "Skonsultuj się z lekarzem",
				dosageAdjustments: "Required",
				polishDosageAdjustments: "Wymagane",
			},
			elderlyConsiderations: ["Monitor for interactions"],
			polishElderlyConsiderations: ["Monitoruj interakcje"],
			hepaticImpairment: "Use with caution",
			polishHepaticImpairment: "Stosować ostrożnie",
			renalImpairment: "Use with caution",
			polishRenalImpairment: "Stosować ostrożnie",
		},

		// Side effects
		sideEffects: supplement.sideEffects.map((effect) => ({
			effect: effect.effect,
			polishEffect: effect.polishEffect,
			frequency: effect.frequency,
			severity:
				effect.severity === "mild"
					? "Mild"
					: effect.severity === "moderate"
						? "Moderate"
						: "Severe",
			polishSeverity:
				effect.severity === "mild"
					? "Łagodny"
					: effect.severity === "moderate"
						? "Umiarkowany"
						: "Ciężki",
			onset: "Variable",
			polishOnset: "Zmienny",
			duration: "Variable",
			polishDuration: "Zmienny",
			management: effect.management || "Discontinue if severe",
			polishManagement:
				effect.polishManagement || "Przerwij w przypadku ciężkich objawów",
		})),

		// Interactions
		interactions: supplement.interactions.map((interaction) => ({
			substance: interaction.substance,
			polishSubstance: interaction.polishSubstance || interaction.substance,
			type: "SUPPLEMENT",
			severity:
				interaction.severity === "severe"
					? "SEVERE"
					: interaction.severity === "moderate"
						? "MODERATE"
						: "MILD",
			mechanism: interaction.mechanism || interaction.description,
			polishMechanism:
				interaction.polishMechanism ||
				interaction.polishDescription ||
				interaction.description,
			clinicalEffect: interaction.description,
			polishClinicalEffect:
				interaction.polishDescription || interaction.description,
			recommendation:
				interaction.recommendation || interaction.clinicalSignificance,
			polishRecommendation:
				interaction.polishRecommendation ||
				interaction.polishClinicalSignificance,
			evidenceLevel: interaction.evidenceLevel || "MODERATE",
		})),

		// Dosage guidelines
		dosageGuidelines: {
			therapeuticRange: {
				min: supplement.dosageGuidelines.therapeuticRange.min,
				optimal:
					(supplement.dosageGuidelines.therapeuticRange.min +
						supplement.dosageGuidelines.therapeuticRange.max) /
					2,
				max: supplement.dosageGuidelines.therapeuticRange.max,
				unit: supplement.dosageGuidelines.therapeuticRange.unit,
			},
			timing: supplement.dosageGuidelines.timing,
			polishTiming: supplement.dosageGuidelines.timing,
			frequency: "Daily",
			polishFrequency: "Codziennie",
			specialPopulations: new Map(),
			polishSpecialPopulations: new Map(),
		},

		// Clinical evidence
		clinicalEvidence: {
			totalStudies: supplement.researchStudies.length,
			rctCount: supplement.researchStudies.filter(
				(s) => s.studyType === "RANDOMIZED_CONTROLLED_TRIAL",
			).length,
			metaAnalyses: supplement.researchStudies.filter(
				(s) => s.studyType === "META_ANALYSIS",
			).length,
			observationalStudies: supplement.researchStudies.filter(
				(s) => s.studyType === "COHORT_STUDY",
			).length,
			lastUpdated: new Date(supplement.lastUpdated),
			keyStudies: supplement.researchStudies.slice(0, 5).map((study) => ({
				title: study.title,
				polishTitle: study.polishTitle || study.title,
				authors: study.authors,
				journal: study.journal,
				year: study.year,
				pubmedId: study.pubmedId || study.pmid,
				doi: study.doi,
				studyType: study.studyType,
				sampleSize: study.sampleSize || study.participantCount || 0,
				findings: study.findings,
				polishFindings: study.polishFindings || study.findings,
			})),
		},

		// Economic data (placeholder)
		economicData: {
			averageCostPerMonth: {
				low: 10,
				average: 25,
				high: 50,
				currency: "EUR",
			},
			costEffectivenessRating: "Good",
			polishCostEffectivenessRating: "Dobry",
			availabilityInPoland: true,
			prescriptionRequired: false,
			reimbursementStatus: "None",
		},

		// Quality considerations
		qualityConsiderations: {
			bioavailabilityForms: ["Standard", "Enhanced"],
			polishBioavailabilityForms: ["Standardowa", "Ulepszona"],
			qualityMarkers: ["Purity", "Potency"],
			polishQualityMarkers: ["Czystość", "Moc"],
			standardization: "USP verified",
			polishStandardization: "Zweryfikowane przez USP",
			storageRequirements: "Cool, dry place",
			polishStorageRequirements: "Chłodne, suche miejsce",
			shelfLife: "2 years",
			contaminationRisks: ["Heavy metals"],
			polishContaminationRisks: ["Metale ciężkie"],
		},

		// Educational content (placeholder)
		educationalContent: {
			beginnerExplanation: supplement.description || "",
			polishBeginnerExplanation: supplement.polishDescription || "",
			intermediateDetails: supplement.description || "",
			polishIntermediateDetails: supplement.polishDescription || "",
			expertAnalysis: supplement.description || "",
			polishExpertAnalysis: supplement.polishDescription || "",
			keyTakeaways: supplement.tags,
			polishKeyTakeaways: supplement.tags,
			commonMisconceptions: [],
			polishCommonMisconceptions: [],
			practicalTips: [],
			polishPracticalTips: [],
		},

		// Metadata
		tags: supplement.tags,
		polishTags: supplement.tags,
		lastUpdated: new Date(supplement.lastUpdated),
		version: "1.0.0",
		isActive: true,

		// Search keywords
		searchKeywords: [
			supplement.name.toLowerCase(),
			...supplement.commonNames.map((n) => n.toLowerCase()),
			...supplement.tags.map((t) => t.toLowerCase()),
		],
		polishSearchKeywords: [
			supplement.polishName.toLowerCase(),
			...supplement.polishCommonNames.map((n) => n.toLowerCase()),
			...supplement.tags.map((t) => t.toLowerCase()),
		],
	};
}

// Legacy hardcoded data for backward compatibility (will be replaced by allSupplementProfiles)
const supplementsData: SupplementWithRelations[] = [
	// Alpha-GPC
	{
		id: "alpha-gpc",
		name: "Alpha-GPC",
		polishName: "Alfa-GPC",
		scientificName: "L-Alpha glycerylphosphorylcholine",
		commonNames: ["Choline alfoscerate", "GPC", "Glycerophosphocholine"],
		polishCommonNames: ["Alfoscerat choliny", "GPC", "Glicerofosfocholina"],
		category: "NOOTROPIC",
		description:
			"Alpha-GPC is a highly bioavailable form of choline that crosses the blood-brain barrier effectively.",
		polishDescription:
			"Alfa-GPC to wysoce biodostępna forma choliny, która skutecznie przekracza barierę krew-mózg.",
		activeCompounds: [
			{
				name: "Alpha-GPC",
				polishName: "Alfa-GPC",
				concentration: "300mg",
				bioavailability: 95,
				halfLife: "4-6 hours",
			},
		],
		clinicalApplications: [
			{
				condition: "Cognitive enhancement",
				polishCondition: "Wzmocnienie funkcji poznawczych",
				efficacy: "moderate",
				effectivenessRating: 7,
				evidenceLevel: "MODERATE",
				recommendedDose: "300-600mg daily",
			},
		],
		mechanisms: [
			{
				pathway: "Cholinergic pathway",
				polishPathway: "Ścieżka cholinergiczna",
				description: "Enhances acetylcholine synthesis",
				polishDescription: "Wzmacnia syntezę acetylocholiny",
				evidenceLevel: "STRONG",
			},
		],
		dosageGuidelines: {
			therapeuticRange: { min: 300, max: 1200, unit: "mg" },
			timing: ["morning"],
			withFood: true,
			contraindications: [],
			polishContraindications: [],
			interactions: [],
		},
		sideEffects: [],
		interactions: [],
		evidenceLevel: "MODERATE",
		researchStudies: [],
		tags: ["nootropic", "choline", "cognitive enhancement"],
		lastUpdated: "2024-01-15T00:00:00Z",
		createdAt: "2024-01-15T00:00:00Z",
		knowledgeNodeId: null,
	},

	// Omega-3
	{
		id: "omega-3",
		name: "Omega-3 Fatty Acids",
		polishName: "Kwasy tłuszczowe Omega-3",
		scientificName:
			"Eicosapentaenoic acid (EPA) and Docosahexaenoic acid (DHA)",
		commonNames: ["Fish Oil", "EPA", "DHA", "Marine Omega-3"],
		polishCommonNames: ["Olej rybny", "EPA", "DHA", "Morskie Omega-3"],
		category: "FATTY_ACID",
		description:
			"Essential fatty acids crucial for brain health, cardiovascular function, and inflammation regulation.",
		polishDescription:
			"Niezbędne kwasy tłuszczowe kluczowe dla zdrowia mózgu, funkcji sercowo-naczyniowych i regulacji stanów zapalnych.",
		activeCompounds: [
			{
				name: "EPA (Eicosapentaenoic Acid)",
				polishName: "EPA (Kwas eikozapentaenowy)",
				concentration: "500mg",
				bioavailability: 85,
			},
			{
				name: "DHA (Docosahexaenoic Acid)",
				polishName: "DHA (Kwas dokozaheksaenowy)",
				concentration: "300mg",
				bioavailability: 85,
			},
		],
		clinicalApplications: [
			{
				condition: "Cardiovascular health",
				polishCondition: "Zdrowie sercowo-naczyniowe",
				efficacy: "high",
				effectivenessRating: 9,
				evidenceLevel: "STRONG",
				recommendedDose: "1-3g daily",
			},
			{
				condition: "Brain health and cognitive function",
				polishCondition: "Zdrowie mózgu i funkcje poznawcze",
				efficacy: "moderate",
				effectivenessRating: 6,
				evidenceLevel: "MODERATE",
				recommendedDose: "1-2g daily",
			},
		],
		mechanisms: [
			{
				pathway: "Membrane incorporation and signaling",
				polishPathway: "Wbudowywanie w błony i sygnalizacja",
				description:
					"Incorporates into cell membranes, modulates inflammation, supports neurotransmitter function",
				polishDescription:
					"Wbudowuje się w błony komórkowe, moduluje stany zapalne, wspiera funkcję neurotransmiterów",
				evidenceLevel: "STRONG",
			},
		],
		dosageGuidelines: {
			therapeuticRange: { min: 500, max: 3000, unit: "mg" },
			timing: ["with meals"],
			withFood: true,
			contraindications: ["Blood clotting disorders"],
			polishContraindications: ["Zaburzenia krzepnięcia krwi"],
			interactions: [],
		},
		sideEffects: [
			{
				effect: "Fishy aftertaste",
				polishEffect: "Rybi posmak",
				frequency: "common",
				severity: "mild",
				reversible: true,
			},
		],
		interactions: [],
		evidenceLevel: "STRONG",
		researchStudies: [],
		tags: ["fatty acid", "brain health", "cardiovascular", "anti-inflammatory"],
		lastUpdated: "2024-01-15T00:00:00Z",
		createdAt: "2024-01-15T00:00:00Z",
		knowledgeNodeId: null,
	},

	// Magnesium
	{
		id: "magnesium",
		name: "Magnesium",
		polishName: "Magnez",
		scientificName: "Magnesium (Mg)",
		commonNames: [
			"Magnesium Glycinate",
			"Magnesium Oxide",
			"Magnesium Citrate",
		],
		polishCommonNames: [
			"Glicynian magnezu",
			"Tlenek magnezu",
			"Cytrynian magnezu",
		],
		category: "MINERAL",
		description:
			"Essential mineral involved in over 300 enzymatic reactions, crucial for muscle function, nerve transmission, and bone health.",
		polishDescription:
			"Niezbędny minerał uczestniczący w ponad 300 reakcjach enzymatycznych, kluczowy dla funkcji mięśni, przewodnictwa nerwowego i zdrowia kości.",
		activeCompounds: [
			{
				name: "Elemental Magnesium",
				polishName: "Magnez elementarny",
				concentration: "200-400mg",
				bioavailability: 30,
			},
		],
		clinicalApplications: [
			{
				condition: "Muscle cramps and tension",
				polishCondition: "Skurcze i napięcie mięśni",
				efficacy: "high",
				effectivenessRating: 8,
				evidenceLevel: "STRONG",
				recommendedDose: "200-400mg daily",
			},
			{
				condition: "Sleep quality improvement",
				polishCondition: "Poprawa jakości snu",
				efficacy: "moderate",
				effectivenessRating: 6,
				evidenceLevel: "MODERATE",
				recommendedDose: "200-300mg before bed",
			},
		],
		mechanisms: [
			{
				pathway: "NMDA receptor antagonism and muscle relaxation",
				polishPathway: "Antagonizm receptorów NMDA i relaksacja mięśni",
				description:
					"Blocks NMDA receptors, relaxes muscles, supports neurotransmitter function",
				polishDescription:
					"Blokuje receptory NMDA, rozluźnia mięśnie, wspiera funkcję neurotransmiterów",
				evidenceLevel: "STRONG",
			},
		],
		dosageGuidelines: {
			therapeuticRange: { min: 200, max: 400, unit: "mg" },
			timing: ["evening", "with meals"],
			withFood: true,
			contraindications: ["Kidney disease"],
			polishContraindications: ["Choroby nerek"],
			interactions: [],
		},
		sideEffects: [
			{
				effect: "Diarrhea (high doses)",
				polishEffect: "Biegunka (wysokie dawki)",
				frequency: "common",
				severity: "mild",
				reversible: true,
				dosageDependent: true,
			},
		],
		interactions: [],
		evidenceLevel: "STRONG",
		researchStudies: [],
		tags: ["mineral", "muscle relaxation", "sleep", "bone health"],
		lastUpdated: "2024-01-15T00:00:00Z",
		createdAt: "2024-01-15T00:00:00Z",
		knowledgeNodeId: null,
	},

	// Vitamin D3
	{
		id: "vitamin-d3",
		name: "Vitamin D3",
		polishName: "Witamina D3",
		scientificName: "Cholecalciferol",
		commonNames: ["Cholecalciferol", "Vitamin D3", "Sunshine Vitamin"],
		polishCommonNames: ["Cholekalcyferol", "Witamina D3", "Witamina słońca"],
		category: "VITAMIN",
		description:
			"Fat-soluble vitamin essential for bone health, immune function, and mood regulation.",
		polishDescription:
			"Witamina rozpuszczalna w tłuszczach, niezbędna dla zdrowia kości, funkcji immunologicznych i regulacji nastroju.",
		activeCompounds: [
			{
				name: "Cholecalciferol",
				polishName: "Cholekalcyferol",
				concentration: "1000-4000 IU",
				bioavailability: 80,
			},
		],
		clinicalApplications: [
			{
				condition: "Bone health and calcium absorption",
				polishCondition: "Zdrowie kości i wchłanianie wapnia",
				efficacy: "high",
				effectivenessRating: 9,
				evidenceLevel: "STRONG",
				recommendedDose: "1000-2000 IU daily",
			},
			{
				condition: "Immune system support",
				polishCondition: "Wsparcie układu immunologicznego",
				efficacy: "moderate",
				effectivenessRating: 7,
				evidenceLevel: "MODERATE",
				recommendedDose: "1000-4000 IU daily",
			},
		],
		mechanisms: [
			{
				pathway: "Vitamin D receptor activation",
				polishPathway: "Aktywacja receptorów witaminy D",
				description:
					"Activates vitamin D receptors, regulates calcium homeostasis, modulates immune function",
				polishDescription:
					"Aktywuje receptory witaminy D, reguluje homeostazę wapnia, moduluje funkcję immunologiczną",
				evidenceLevel: "STRONG",
			},
		],
		dosageGuidelines: {
			therapeuticRange: { min: 1000, max: 4000, unit: "IU" },
			timing: ["with fat-containing meal"],
			withFood: true,
			contraindications: ["Hypercalcemia"],
			polishContraindications: ["Hiperkalcemia"],
			interactions: [],
		},
		sideEffects: [],
		interactions: [],
		evidenceLevel: "STRONG",
		researchStudies: [],
		tags: ["vitamin", "bone health", "immune system", "mood"],
		lastUpdated: "2024-01-15T00:00:00Z",
		createdAt: "2024-01-15T00:00:00Z",
		knowledgeNodeId: null,
	},

	// L-Theanine
	{
		id: "l-theanine",
		name: "L-Theanine",
		polishName: "L-Teanina",
		scientificName: "N-ethyl-L-glutamine",
		commonNames: ["Theanine", "L-Theanine", "Tea amino acid"],
		polishCommonNames: ["Teanina", "L-Teanina", "Aminokwas z herbaty"],
		category: "AMINO_ACID",
		description:
			"Amino acid found in tea leaves that promotes relaxation without sedation and enhances focus when combined with caffeine.",
		polishDescription:
			"Aminokwas występujący w liściach herbaty, który promuje relaks bez sedacji i wzmacnia koncentrację w połączeniu z kofeiną.",
		activeCompounds: [
			{
				name: "L-Theanine",
				polishName: "L-Teanina",
				concentration: "100-200mg",
				bioavailability: 99,
				halfLife: "1-2 hours",
			},
		],
		clinicalApplications: [
			{
				condition: "Stress and anxiety reduction",
				polishCondition: "Redukcja stresu i lęku",
				efficacy: "moderate",
				effectivenessRating: 7,
				evidenceLevel: "MODERATE",
				recommendedDose: "100-200mg daily",
			},
			{
				condition: "Focus enhancement (with caffeine)",
				polishCondition: "Wzmocnienie koncentracji (z kofeiną)",
				efficacy: "moderate",
				effectivenessRating: 6,
				evidenceLevel: "MODERATE",
				recommendedDose: "100mg with 50mg caffeine",
			},
		],
		mechanisms: [
			{
				pathway: "GABA and alpha wave modulation",
				polishPathway: "Modulacja GABA i fal alfa",
				description:
					"Increases GABA, promotes alpha brain waves, modulates neurotransmitter balance",
				polishDescription:
					"Zwiększa GABA, promuje fale alfa mózgu, moduluje równowagę neurotransmiterów",
				evidenceLevel: "MODERATE",
			},
		],
		dosageGuidelines: {
			therapeuticRange: { min: 100, max: 400, unit: "mg" },
			timing: ["morning", "afternoon"],
			withFood: false,
			contraindications: [],
			polishContraindications: [],
			interactions: [],
		},
		sideEffects: [],
		interactions: [
			{
				substance: "Caffeine",
				polishSubstance: "Kofeina",
				type: "synergistic",
				severity: "beneficial",
				clinicalSignificance: "Enhances focus while reducing caffeine jitters",
				polishClinicalSignificance:
					"Wzmacnia koncentrację jednocześnie redukując drżenie po kofeinie",
				description: "Enhances focus while reducing caffeine jitters",
				polishDescription:
					"Wzmacnia koncentrację jednocześnie redukując drżenie po kofeinie",
			},
		],
		evidenceLevel: "MODERATE",
		researchStudies: [],
		tags: ["amino acid", "relaxation", "focus", "stress reduction"],
		lastUpdated: "2024-01-15T00:00:00Z",
		createdAt: "2024-01-15T00:00:00Z",
		knowledgeNodeId: null,
	},

	// Creatine
	{
		id: "creatine",
		name: "Creatine Monohydrate",
		polishName: "Monohydrat kreatyny",
		scientificName: "N-(aminoiminomethyl)-N-methylglycine",
		commonNames: ["Creatine", "Creatine Monohydrate", "Cr"],
		polishCommonNames: ["Kreatyna", "Monohydrat kreatyny", "Cr"],
		category: "AMINO_ACID",
		description:
			"Naturally occurring compound that helps regenerate ATP for energy production, particularly beneficial for high-intensity exercise.",
		polishDescription:
			"Naturalnie występujący związek, który pomaga regenerować ATP do produkcji energii, szczególnie korzystny dla ćwiczeń wysokiej intensywności.",
		activeCompounds: [
			{
				name: "Creatine Monohydrate",
				polishName: "Monohydrat kreatyny",
				concentration: "3-5g",
				bioavailability: 95,
			},
		],
		clinicalApplications: [
			{
				condition: "Athletic performance and power output",
				polishCondition: "Wydolność sportowa i moc wyjściowa",
				efficacy: "high",
				effectivenessRating: 9,
				evidenceLevel: "STRONG",
				recommendedDose: "3-5g daily",
			},
			{
				condition: "Muscle mass and strength",
				polishCondition: "Masa mięśniowa i siła",
				efficacy: "moderate",
				effectivenessRating: 8,
				evidenceLevel: "STRONG",
				recommendedDose: "3-5g daily",
			},
		],
		mechanisms: [
			{
				pathway: "Phosphocreatine system",
				polishPathway: "System fosfokreatyny",
				description:
					"Increases phosphocreatine stores in muscles, enhancing ATP regeneration during high-intensity exercise",
				polishDescription:
					"Zwiększa zapasy fosfokreatyny w mięśniach, wzmacniając regenerację ATP podczas ćwiczeń wysokiej intensywności",
				evidenceLevel: "STRONG",
			},
		],
		dosageGuidelines: {
			therapeuticRange: { min: 3, max: 5, unit: "g" },
			timing: ["post-workout", "anytime"],
			withFood: false,
			contraindications: ["Kidney disease"],
			polishContraindications: ["Choroby nerek"],
			interactions: [],
		},
		sideEffects: [
			{
				effect: "Water retention",
				polishEffect: "Zatrzymywanie wody",
				frequency: "common",
				severity: "mild",
				reversible: true,
			},
		],
		interactions: [],
		evidenceLevel: "STRONG",
		researchStudies: [],
		tags: ["amino acid", "performance", "strength", "muscle building"],
		lastUpdated: "2024-01-15T00:00:00Z",
		createdAt: "2024-01-15T00:00:00Z",
		knowledgeNodeId: null,
	},

	// Ashwagandha
	{
		id: "ashwagandha",
		name: "Ashwagandha",
		polishName: "Ashwagandha",
		scientificName: "Withania somnifera",
		commonNames: ["Indian Winter Cherry", "Withania", "KSM-66"],
		polishCommonNames: ["Indyjska wiśnia zimowa", "Witania", "KSM-66"],
		category: "ADAPTOGEN",
		description:
			"Adaptogenic herb traditionally used in Ayurveda for stress reduction, energy enhancement, and overall vitality.",
		polishDescription:
			"Adaptogenne zioło tradycyjnie używane w ajurwedzie do redukcji stresu, zwiększenia energii i ogólnej witalności.",
		activeCompounds: [
			{
				name: "Withanolides",
				polishName: "Witanoidy",
				concentration: "1.5-12%",
				bioavailability: 70,
			},
		],
		clinicalApplications: [
			{
				condition: "Stress and anxiety reduction",
				polishCondition: "Redukcja stresu i lęku",
				efficacy: "high",
				effectivenessRating: 8,
				evidenceLevel: "STRONG",
				recommendedDose: "300-600mg daily",
			},
			{
				condition: "Sleep quality improvement",
				polishCondition: "Poprawa jakości snu",
				efficacy: "moderate",
				effectivenessRating: 7,
				evidenceLevel: "MODERATE",
				recommendedDose: "300-600mg before bed",
			},
		],
		mechanisms: [
			{
				pathway: "HPA axis modulation",
				polishPathway: "Modulacja osi HPA",
				description:
					"Modulates hypothalamic-pituitary-adrenal axis, reduces cortisol levels, supports stress adaptation",
				polishDescription:
					"Moduluje oś podwzgórze-przysadka-nadnercza, obniża poziom kortyzolu, wspiera adaptację do stresu",
				evidenceLevel: "STRONG",
			},
		],
		dosageGuidelines: {
			therapeuticRange: { min: 300, max: 600, unit: "mg" },
			timing: ["evening", "with meals"],
			withFood: true,
			contraindications: ["Pregnancy", "Autoimmune conditions"],
			polishContraindications: ["Ciąża", "Choroby autoimmunologiczne"],
			interactions: [],
		},
		sideEffects: [
			{
				effect: "Drowsiness",
				polishEffect: "Senność",
				frequency: "uncommon",
				severity: "mild",
				reversible: true,
			},
		],
		interactions: [],
		evidenceLevel: "STRONG",
		researchStudies: [],
		tags: ["adaptogen", "stress reduction", "sleep", "anxiety"],
		lastUpdated: "2024-01-15T00:00:00Z",
		createdAt: "2024-01-15T00:00:00Z",
		knowledgeNodeId: null,
	},

	// Bacopa Monnieri
	{
		id: "bacopa-monnieri",
		name: "Bacopa Monnieri",
		polishName: "Bacopa Monnieri",
		scientificName: "Bacopa monnieri",
		commonNames: ["Brahmi", "Water Hyssop", "Herb of Grace"],
		polishCommonNames: ["Brahmi", "Hyzop wodny", "Zioło łaski"],
		category: "HERB",
		description:
			"Traditional Ayurvedic herb known for cognitive enhancement, memory improvement, and neuroprotective properties.",
		polishDescription:
			"Tradycyjne ajurwedyjskie zioło znane z wzmacniania funkcji poznawczych, poprawy pamięci i właściwości neuroprotekcyjnych.",
		activeCompounds: [
			{
				name: "Bacosides",
				polishName: "Bakozidy",
				concentration: "20-50%",
				bioavailability: 60,
			},
		],
		clinicalApplications: [
			{
				condition: "Memory and cognitive enhancement",
				polishCondition: "Wzmocnienie pamięci i funkcji poznawczych",
				efficacy: "moderate",
				effectivenessRating: 6,
				evidenceLevel: "MODERATE",
				recommendedDose: "300-600mg daily",
			},
			{
				condition: "Anxiety and stress reduction",
				polishCondition: "Redukcja lęku i stresu",
				efficacy: "moderate",
				effectivenessRating: 6,
				evidenceLevel: "MODERATE",
				recommendedDose: "300-450mg daily",
			},
		],
		mechanisms: [
			{
				pathway: "Cholinergic enhancement and neuroprotection",
				polishPathway: "Wzmacnianie cholinergic i neuroprotekcja",
				description:
					"Enhances cholinergic transmission, promotes neuronal growth, provides antioxidant protection",
				polishDescription:
					"Wzmacnia transmisję cholinergiczną, promuje wzrost neuronów, zapewnia ochronę antyoksydacyjną",
				evidenceLevel: "MODERATE",
			},
		],
		dosageGuidelines: {
			therapeuticRange: { min: 300, max: 600, unit: "mg" },
			timing: ["with meals"],
			withFood: true,
			contraindications: ["Pregnancy", "Breastfeeding"],
			polishContraindications: ["Ciąża", "Karmienie piersią"],
			interactions: [],
		},
		sideEffects: [
			{
				effect: "Nausea (empty stomach)",
				polishEffect: "Nudności (na pusty żołądek)",
				frequency: "uncommon",
				severity: "mild",
				reversible: true,
			},
		],
		interactions: [],
		evidenceLevel: "MODERATE",
		researchStudies: [],
		tags: ["herb", "cognitive enhancement", "memory", "neuroprotection"],
		lastUpdated: "2024-01-15T00:00:00Z",
		createdAt: "2024-01-15T00:00:00Z",
		knowledgeNodeId: null,
	},
];

async function seedSupplements() {
	try {
		console.log(
			`${colors.bright}${colors.cyan}🌱 Starting comprehensive supplement seeding...${colors.reset}\n`,
		);

		await connectToDatabase();

		// Clear existing supplements
		console.log(
			`${colors.yellow}🗑️  Clearing existing supplements...${colors.reset}`,
		);
		const deleteResult = await ComprehensiveSupplement.deleteMany({});
		console.log(
			`${colors.green}✅ Deleted ${deleteResult.deletedCount} existing supplements${colors.reset}\n`,
		);

		// Seed supplements from allSupplementProfiles
		console.log(
			`${colors.bright}${colors.blue}📦 Seeding ${allSupplementProfiles.length} supplements from data files...${colors.reset}\n`,
		);

		let successCount = 0;
		let errorCount = 0;
		const errors: Array<{ supplement: string; error: string }> = [];

		for (const supplement of allSupplementProfiles) {
			try {
				const transformedData = transformSupplementData(supplement);
				await ComprehensiveSupplement.create(transformedData);
				console.log(
					`${colors.green}✓${colors.reset} ${supplement.polishName} (${supplement.name})`,
				);
				successCount++;
			} catch (error) {
				const errorMsg =
					error instanceof Error ? error.message : "Unknown error";
				console.error(
					`${colors.red}✗${colors.reset} ${supplement.polishName}: ${errorMsg}`,
				);
				errors.push({ supplement: supplement.polishName, error: errorMsg });
				errorCount++;
			}
		}

		console.log(
			`\n${colors.bright}${colors.green}🎉 Supplement seeding completed!${colors.reset}`,
		);
		console.log(
			`${colors.green}✅ Successfully seeded: ${successCount}${colors.reset}`,
		);
		if (errorCount > 0) {
			console.log(`${colors.red}❌ Errors: ${errorCount}${colors.reset}`);
			console.log(`\n${colors.yellow}Error details:${colors.reset}`);
			errors.forEach(({ supplement, error }) => {
				console.log(`  - ${supplement}: ${error}`);
			});
		}

		// Verify data
		const count = await ComprehensiveSupplement.countDocuments();
		console.log(
			`\n${colors.cyan}📊 Total supplements in database: ${count}${colors.reset}`,
		);
	} catch (error) {
		console.error(
			`${colors.red}❌ Error seeding supplements:${colors.reset}`,
			error,
		);
		throw error;
	}
}

async function seedKnowledgeGraph() {
	try {
		console.log(
			`\n${colors.bright}${colors.cyan}🧠 Starting knowledge graph seeding...${colors.reset}\n`,
		);

		// Clear existing knowledge data
		console.log(
			`${colors.yellow}🗑️  Clearing existing knowledge graph...${colors.reset}`,
		);
		await KnowledgeNode.deleteMany({});
		await KnowledgeRelationship.deleteMany({});
		console.log(
			`${colors.green}✅ Cleared existing knowledge graph${colors.reset}\n`,
		);

		// Create knowledge nodes for supplements from allSupplementProfiles
		console.log(
			`${colors.blue}📊 Creating knowledge nodes for ${allSupplementProfiles.length} supplements...${colors.reset}\n`,
		);

		const knowledgeNodes = allSupplementProfiles.map((supplement) => ({
			_id: `node-${supplement.id}`,
			type: "SUPPLEMENT",
			name: supplement.name,
			polishName: supplement.polishName,
			description: supplement.description || "",
			polishDescription: supplement.polishDescription || "",
			color: getColorByCategory(supplement.category),
			size: getSizeByEvidenceLevel(supplement.evidenceLevel),
			properties: {
				category: supplement.category,
				evidenceLevel: supplement.evidenceLevel,
				activeCompounds: supplement.activeCompounds.map((c) => c.name),
			},
			tags: supplement.tags,
			category: "supplement",
			evidenceLevel: supplement.evidenceLevel,
			sources: [],
			importance: getImportanceScore(supplement),
		}));

		// Insert knowledge nodes
		let nodeSuccessCount = 0;
		for (const nodeData of knowledgeNodes) {
			try {
				const node = new KnowledgeNode(nodeData);
				await node.save();
				console.log(
					`${colors.green}✓${colors.reset} Knowledge node: ${nodeData.polishName}`,
				);
				nodeSuccessCount++;
			} catch (error) {
				console.error(
					`${colors.red}✗${colors.reset} Failed to create node for ${nodeData.polishName}`,
				);
			}
		}

		console.log(
			`\n${colors.bright}${colors.green}🎉 Knowledge graph seeding completed!${colors.reset}`,
		);
		console.log(
			`${colors.green}✅ Successfully created ${nodeSuccessCount} knowledge nodes${colors.reset}`,
		);
	} catch (error) {
		console.error(
			`${colors.red}❌ Error seeding knowledge graph:${colors.reset}`,
			error,
		);
		throw error;
	}
}

function getColorByCategory(category: string): string {
	const colors: Record<string, string> = {
		VITAMIN: "#FF6B6B",
		MINERAL: "#4ECDC4",
		AMINO_ACID: "#45B7D1",
		FATTY_ACID: "#96CEB4",
		HERB: "#FFEAA7",
		NOOTROPIC: "#DDA0DD",
		ADAPTOGEN: "#98D8C8",
		PROBIOTIC: "#F7DC6F",
		ENZYME: "#BB8FCE",
		OTHER: "#AED6F1",
	};
	return colors[category] || "#AED6F1";
}

function getSizeByEvidenceLevel(evidenceLevel: string): number {
	const sizes: Record<string, number> = {
		STRONG: 20,
		MODERATE: 15,
		WEAK: 10,
		INSUFFICIENT: 8,
		CONFLICTING: 8,
	};
	return sizes[evidenceLevel] || 10;
}

function getImportanceScore(supplement: any): number {
	let score = 0;

	// Evidence level weight
	const evidenceWeights: Record<string, number> = {
		STRONG: 1.0,
		MODERATE: 0.8,
		WEAK: 0.6,
		INSUFFICIENT: 0.4,
		CONFLICTING: 0.3,
	};
	score += evidenceWeights[supplement.evidenceLevel] || 0.5;

	// Clinical applications weight
	score += supplement.clinicalApplications.length * 0.1;

	// Research studies weight
	score += supplement.researchStudies.length * 0.05;

	return Math.min(score, 1.0);
}

async function seedCircadianTiming() {
	try {
		console.log(
			`\n${colors.bright}${colors.cyan}⏰ Starting circadian timing data seeding...${colors.reset}\n`,
		);

		await connectToDatabase();

		// Clear existing circadian timing data
		await CircadianSupplementTiming.collection.drop().catch(() => {
			// Ignore error if collection doesn't exist
		});
		console.log(
			`${colors.yellow}   Cleared existing circadian timing entries${colors.reset}`,
		);

		// Insert circadian timing data
		const insertedDocs = await CircadianSupplementTiming.insertMany(
			circadianTimingData as any,
		);

		console.log(
			`${colors.green}   ✓ Inserted ${insertedDocs.length} circadian timing entries${colors.reset}`,
		);

		// Display summary
		console.log(`\n${colors.bright}Circadian Timing Summary:${colors.reset}`);
		for (const entry of insertedDocs) {
			console.log(
				`   ${colors.cyan}${entry.polishTimeOfDay}${colors.reset} (${entry.timeRange})`,
			);
			console.log(
				`      Recommended: ${entry.recommendedSupplements.length} supplements`,
			);
			console.log(
				`      Avoid: ${entry.avoidSupplements.length} supplements`,
			);
		}

		console.log(
			`\n${colors.bright}${colors.green}✓ Circadian timing seeding completed successfully!${colors.reset}`,
		);
	} catch (error) {
		console.error(
			`${colors.bright}${colors.red}✗ Circadian timing seeding failed:${colors.reset}`,
			error,
		);
		throw error;
	}
}

async function main() {
	const startTime = Date.now();

	try {
		console.log(
			`${colors.bright}${colors.cyan}╔════════════════════════════════════════════════════════════╗${colors.reset}`,
		);
		console.log(
			`${colors.bright}${colors.cyan}║   Suplementor Database Seeding - Polish Education Platform ║${colors.reset}`,
		);
		console.log(
			`${colors.bright}${colors.cyan}╚════════════════════════════════════════════════════════════╝${colors.reset}\n`,
		);

		await seedSupplements();
		await seedKnowledgeGraph();
		await seedCircadianTiming();

		const duration = ((Date.now() - startTime) / 1000).toFixed(2);

		console.log(
			`\n${colors.bright}${colors.green}╔════════════════════════════════════════════════════════════╗${colors.reset}`,
		);
		console.log(
			`${colors.bright}${colors.green}║   🚀 Database seeding completed successfully!              ║${colors.reset}`,
		);
		console.log(
			`${colors.bright}${colors.green}║   ⏱️  Duration: ${duration}s${" ".repeat(45 - duration.length)}║${colors.reset}`,
		);
		console.log(
			`${colors.bright}${colors.green}╚════════════════════════════════════════════════════════════╝${colors.reset}\n`,
		);

		process.exit(0);
	} catch (error) {
		console.error(
			`\n${colors.bright}${colors.red}╔════════════════════════════════════════════════════════════╗${colors.reset}`,
		);
		console.error(
			`${colors.bright}${colors.red}║   💥 Seeding failed!                                       ║${colors.reset}`,
		);
		console.error(
			`${colors.bright}${colors.red}╚════════════════════════════════════════════════════════════╝${colors.reset}\n`,
		);
		console.error(error);
		process.exit(1);
	} finally {
		await disconnectFromDatabase();
	}
}

// Run if called directly (ES module compatible)
// Always run when executed directly
main().catch(console.error);

export { seedSupplements, seedKnowledgeGraph, seedCircadianTiming, transformSupplementData };
export default main;
