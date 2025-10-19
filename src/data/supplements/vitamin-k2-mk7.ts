/**
 * Vitamin K2 (MK-7) Supplement Profile
 * Essential vitamin for bone health, cardiovascular protection, and calcium metabolism
 * Comprehensive profile with Polish medical compliance
 */

import type { SupplementWithRelations } from "../../types/supplement";

export const vitaminK2MK7Profile: SupplementWithRelations = {
	id: "vitamin-k2-mk7",
	name: "Vitamin K2 (MK-7)",
	polishName: "Witamina K2 (MK-7)",
	scientificName: "Menaquinone-7",
	commonNames: [
		"Vitamin K2 MK-7",
		"Menaquinone-7",
		"Vitamin K2",
		"MK-7",
		"Long-chain vitamin K2",
	],
	polishCommonNames: [
		"Witamina K2 MK-7",
		"Menachinon-7",
		"Witamina K2",
		"MK-7",
		"Długołańcuchowa witamina K2",
	],
	category: "VITAMIN",
	description:
		"Vitamin K2 (MK-7) is a fat-soluble vitamin essential for calcium metabolism, bone health, and cardiovascular protection. It activates osteocalcin for bone mineralization and matrix Gla protein for preventing vascular calcification, offering superior bioavailability and longer half-life compared to other vitamin K forms.",
	polishDescription:
		"Witamina K2 (MK-7) to rozpuszczalna w tłuszczach witamina niezbędna dla metabolizmu wapnia, zdrowia kości i ochrony sercowo-naczyniowej. Aktywuje osteokalcyne dla mineralizacji kości i białko matrix Gla dla zapobiegania wapnieniu naczyń, oferując lepszą biodostępność i dłuższy okres półtrwania w porównaniu z innymi formami witaminy K.",

	// Active compounds with detailed bioavailability data
	activeCompounds: [
		{
			name: "Menaquinone-7",
			polishName: "Menachinon-7",
			concentration: "100mcg",
			bioavailability: 95,
			halfLife: "72 hours",
			metabolicPathway: [
				"Vitamin K cycle",
				"Gamma-carboxylation",
				"Calcium-binding protein activation",
			],
			targetReceptors: [
				"Vitamin K epoxide reductase",
				"Gamma-glutamyl carboxylase",
			],
		},
		{
			name: "Vitamin K2",
			polishName: "Witamina K2",
			concentration: "100mcg",
			bioavailability: 98,
			halfLife: "72 hours",
			metabolicPathway: [
				"Osteocalcin activation",
				"MGP carboxylation",
				"Bone mineralization",
			],
			targetReceptors: ["Gla proteins", "Calcium channels"],
		},
	],

	// Clinical applications with Polish translations
	clinicalApplications: [
		{
			condition: "Bone health and osteoporosis prevention",
			polishCondition: "Zdrowie kości i zapobieganie osteoporozie",
			indication: "Bone density maintenance and fracture prevention",
			polishIndication: "Utrzymanie gęstości kości i zapobieganie złamaniom",
			efficacy: "high",
			effectivenessRating: 8,
			evidenceLevel: "STRONG",
			recommendedDose: "100-200mcg daily",
			duration: "6-12 months for bone effects",
			effectSize: 0.5,
			studyCount: 25,
			participantCount: 8000,
			recommendationGrade: "A",
		},
		{
			condition: "Cardiovascular protection",
			polishCondition: "Ochrona sercowo-naczyniowa",
			indication: "Arterial calcification prevention and vascular health",
			polishIndication: "Zapobieganie wapnieniu tętnic i zdrowie naczyń",
			efficacy: "moderate",
			effectivenessRating: 7,
			evidenceLevel: "MODERATE",
			recommendedDose: "100-200mcg daily",
			duration: "6-12 months for cardiovascular effects",
			effectSize: 0.4,
			studyCount: 20,
			participantCount: 5000,
			recommendationGrade: "B",
		},
		{
			condition: "Calcium metabolism optimization",
			polishCondition: "Optymalizacja metabolizmu wapnia",
			indication: "Proper calcium utilization and soft tissue protection",
			polishIndication:
				"Prawidłowe wykorzystanie wapnia i ochrona tkanek miękkich",
			efficacy: "high",
			effectivenessRating: 8,
			evidenceLevel: "STRONG",
			recommendedDose: "100-200mcg daily",
			duration: "Ongoing for calcium regulation",
			effectSize: 0.6,
			studyCount: 30,
			participantCount: 6000,
			recommendationGrade: "A",
		},
		{
			condition: "Dental health",
			polishCondition: "Zdrowie zębów",
			indication: "Dental mineralization and periodontal health",
			polishIndication: "Mineralizacja zębów i zdrowie przyzębia",
			efficacy: "moderate",
			effectivenessRating: 6,
			evidenceLevel: "MODERATE",
			recommendedDose: "100-200mcg daily",
			duration: "Ongoing for dental health",
			effectSize: 0.3,
			studyCount: 15,
			participantCount: 2000,
			recommendationGrade: "B",
		},
		{
			condition: "Joint health",
			polishCondition: "Zdrowie stawów",
			indication: "Cartilage mineralization and joint function",
			polishIndication: "Mineralizacja chrząstki i funkcja stawów",
			efficacy: "moderate",
			effectivenessRating: 6,
			evidenceLevel: "MODERATE",
			recommendedDose: "100-200mcg daily",
			duration: "3-6 months for joint effects",
			effectSize: 0.25,
			studyCount: 12,
			participantCount: 1500,
			recommendationGrade: "C",
		},
	],

	// Mechanisms of action with detailed pathways
	mechanisms: [
		{
			id: "bone-mineralization",
			name: "Bone mineralization and osteocalcin activation",
			polishName: "Mineralizacja kości i aktywacja osteokalcyne",
			pathway: "Vitamin K-dependent carboxylation",
			polishPathway: "Karboksylacja zależna od witaminy K",
			description:
				"Vitamin K2 activates osteocalcin, a protein essential for binding calcium to bone matrix, supporting bone mineralization and density.",
			polishDescription:
				"Witamina K2 aktywuje osteokalcyne, białko niezbędne do wiązania wapnia z macierzą kostną, wspierając mineralizację i gęstość kości.",
			evidenceLevel: "STRONG",
			targetSystems: ["Skeletal system", "Bone metabolism", "Osteoblasts"],
			timeToEffect: "2-4 weeks",
			duration: "Chronic supplementation required",
		},
		{
			id: "vascular-protection",
			name: "Vascular calcification prevention",
			polishName: "Zapobieganie wapnieniu naczyń",
			pathway: "Matrix Gla protein activation",
			polishPathway: "Aktywacja białka matrix Gla",
			description:
				"Vitamin K2 activates matrix Gla protein (MGP), which prevents calcium deposition in arterial walls and supports vascular health.",
			polishDescription:
				"Witamina K2 aktywuje białko matrix Gla (MGP), które zapobiega odkładaniu wapnia w ścianach tętnic i wspiera zdrowie naczyń.",
			evidenceLevel: "MODERATE",
			targetSystems: [
				"Cardiovascular system",
				"Arteries",
				"Vascular smooth muscle",
			],
			timeToEffect: "4-8 weeks",
			duration: "Chronic supplementation for vascular effects",
		},
		{
			id: "calcium-regulation",
			name: "Calcium metabolism regulation",
			polishName: "Regulacja metabolizmu wapnia",
			pathway: "Calcium homeostasis",
			polishPathway: "Homeostaza wapnia",
			description:
				"Vitamin K2 ensures proper calcium utilization by directing calcium to bones and teeth while preventing soft tissue calcification.",
			polishDescription:
				"Witamina K2 zapewnia prawidłowe wykorzystanie wapnia, kierując wapń do kości i zębów przy jednoczesnym zapobieganiu wapnieniu tkanek miękkich.",
			evidenceLevel: "STRONG",
			targetSystems: ["Calcium metabolism", "Bone tissue", "Soft tissues"],
			timeToEffect: "1-2 weeks",
			duration: "Ongoing for calcium regulation",
		},
		{
			id: "dental-mineralization",
			name: "Dental health and mineralization",
			polishName: "Zdrowie zębów i mineralizacja",
			pathway: "Dentin and enamel formation",
			polishPathway: "Tworzenie dentyny i szkliwa",
			description:
				"Vitamin K2 supports dental mineralization and periodontal health through activation of Gla proteins in dental tissues.",
			polishDescription:
				"Witamina K2 wspiera mineralizację zębów i zdrowie przyzębia poprzez aktywację białek Gla w tkankach zębów.",
			evidenceLevel: "MODERATE",
			targetSystems: ["Dental tissues", "Periodontium", "Tooth mineralization"],
			timeToEffect: "4-8 weeks",
			duration: "Chronic supplementation for dental health",
		},
	],

	// Comprehensive dosage guidelines
	dosageGuidelines: {
		therapeuticRange: {
			min: 50,
			max: 200,
			unit: "mcg",
		},
		timing: ["evening", "with fatty meal"],
		withFood: true,
		contraindications: [
			"Warfarin or other vitamin K antagonist therapy",
			"Blood clotting disorders",
			"Liver disease",
		],
		polishContraindications: [
			"Terapia warfaryną lub innymi antagonistami witaminy K",
			"Zaburzenia krzepnięcia krwi",
			"Choroba wątroby",
		],
		interactions: [
			{
				substance: "Vitamin D",
				polishSubstance: "Witamina D",
				type: "synergistic",
				severity: "beneficial",
				description:
					"Complementary roles in calcium metabolism and bone health",
				clinicalSignificance:
					"Enhanced bone mineralization and calcium absorption",
				polishClinicalSignificance:
					"Wzmocniona mineralizacja kości i wchłanianie wapnia",
				polishDescription:
					"Komplementarne role w metabolizmie wapnia i zdrowiu kości",
				recommendation: "Essential combination for optimal bone health",
				polishRecommendation:
					"Niezbędne połączenie dla optymalnego zdrowia kości",
				evidenceLevel: "STRONG",
			},
			{
				substance: "Calcium supplements",
				polishSubstance: "Suplementy wapnia",
				type: "synergistic",
				severity: "beneficial",
				description:
					"Vitamin K2 directs calcium to bones and prevents vascular calcification",
				clinicalSignificance: "Improved calcium utilization and safety",
				polishClinicalSignificance:
					"Poprawione wykorzystanie wapnia i bezpieczeństwo",
				polishDescription:
					"Witamina K2 kieruje wapń do kości i zapobiega wapnieniu naczyń",
				recommendation: "Essential combination for proper calcium metabolism",
				polishRecommendation:
					"Niezbędne połączenie dla prawidłowego metabolizmu wapnia",
				evidenceLevel: "STRONG",
			},
			{
				substance: "Warfarin",
				polishSubstance: "Warfaryna",
				type: "antagonistic",
				severity: "severe",
				description: "Vitamin K2 may reduce warfarin effectiveness",
				clinicalSignificance: "May increase clotting risk",
				polishClinicalSignificance: "Może zwiększyć ryzyko krzepnięcia",
				polishDescription: "Witamina K2 może zmniejszyć skuteczność warfaryny",
				recommendation: "Avoid concurrent use or monitor INR closely",
				polishRecommendation:
					"Unikaj jednoczesnego stosowania lub monitoruj INR uważnie",
				evidenceLevel: "STRONG",
			},
		],
	},

	// Side effects with frequency and management
	sideEffects: [
		{
			effect: "Gastrointestinal upset",
			polishEffect: "Zaburzenia żołądkowo-jelitowe",
			frequency: "rare",
			severity: "mild",
			reversible: true,
			dosageDependent: true,
			timeToOnset: "1-4 hours",
			management: "Take with food, reduce dose",
			polishManagement: "Przyjmuj z jedzeniem, zmniejsz dawkę",
		},
		{
			effect: "Allergic reactions",
			polishEffect: "Reakcje alergiczne",
			frequency: "very_rare",
			severity: "mild",
			reversible: true,
			dosageDependent: false,
			timeToOnset: "1-7 days",
			management: "Discontinue use if allergic symptoms occur",
			polishManagement: "Przerwij stosowanie jeśli wystąpią objawy alergiczne",
		},
		{
			effect: "Headache",
			polishEffect: "Ból głowy",
			frequency: "very_rare",
			severity: "mild",
			reversible: true,
			dosageDependent: false,
			timeToOnset: "1-3 days",
			management: "Usually mild and transient",
			polishManagement: "Zazwyczaj łagodny i przemijający",
		},
	],

	// Supplement interactions
	interactions: [
		{
			substance: "Vitamin D3",
			polishSubstance: "Witamina D3",
			type: "synergistic",
			severity: "beneficial",
			description:
				"Essential partnership for calcium metabolism and bone health",
			polishDescription:
				"Niezbędne partnerstwo dla metabolizmu wapnia i zdrowia kości",
			clinicalSignificance:
				"Enhanced bone mineralization and reduced fracture risk",
			polishClinicalSignificance:
				"Wzmocniona mineralizacja kości i zmniejszone ryzyko złamań",
			mechanism: "Complementary roles in calcium absorption and utilization",
			polishMechanism:
				"Komplementarne role we wchłanianiu i wykorzystaniu wapnia",
			recommendation:
				"Essential combination for optimal bone and cardiovascular health",
			polishRecommendation:
				"Niezbędne połączenie dla optymalnego zdrowia kości i serca",
			evidenceLevel: "STRONG",
		},
		{
			substance: "Calcium",
			polishSubstance: "Wapń",
			type: "synergistic",
			clinicalSignificance:
				"Vitamin K2 ensures proper calcium deposition in bones",
			polishClinicalSignificance:
				"Witamina K2 zapewnia prawidłowe odkładanie wapnia w kościach",
			severity: "beneficial",
			mechanism: "Activation of calcium-binding proteins in bone tissue",
			polishMechanism: "Aktywacja białek wiążących wapń w tkance kostnej",
			description:
				"Vitamin K2 directs calcium to bones and prevents vascular calcification",
			polishDescription:
				"Witamina K2 kieruje wapń do kości i zapobiega wapnieniu naczyń",
			recommendation:
				"Essential for safe and effective calcium supplementation",
			polishRecommendation:
				"Niezbędne dla bezpiecznej i skutecznej suplementacji wapnia",
			evidenceLevel: "STRONG",
		},
	],

	// Evidence level and research studies
	evidenceLevel: "MODERATE",
	researchStudies: [
		{
			id: "koshihara-1987",
			title:
				"Vitamin K2 enhances osteocalcin accumulation in the extracellular matrix",
			polishTitle:
				"Witamina K2 wzmacnia akumulację osteokalcyne w macierzy zewnątrzkomórkowej",
			authors: ["Koshihara Y", "Hoshi K"],
			journal: "Journal of Biological Chemistry",
			year: 1987,
			studyType: "EXPERIMENTAL_STUDY",
			primaryOutcome: "Vitamin K2 effects on osteocalcin carboxylation",
			polishPrimaryOutcome: "Wpływ witaminy K2 na karboksylację osteokalcyne",
			findings:
				"Vitamin K2 is essential for osteocalcin activation and bone mineralization",
			polishFindings:
				"Witamina K2 jest niezbędna dla aktywacji osteokalcyne i mineralizacji kości",
			evidenceLevel: "MODERATE",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "3818630",
			doi: "10.1016/S0021-9258(18)45405-4",
			qualityScore: 8.0,
		},
		{
			id: "schurgers-2007",
			title:
				"Vitamin K-containing dietary supplements: comparison of synthetic vitamin K1 and natto-derived MK-7",
			polishTitle:
				"Suplementy diety zawierające witaminę K: porównanie syntetycznej witaminy K1 i MK-7 z natto",
			authors: ["Schurgers LJ", "Teunissen KJ", "Hamulyák K"],
			journal: "Blood",
			year: 2007,
			studyType: "RANDOMIZED_CONTROLLED_TRIAL",
			primaryOutcome: "Bioavailability comparison of vitamin K forms",
			polishPrimaryOutcome: "Porównanie biodostępności form witaminy K",
			findings:
				"MK-7 showed superior bioavailability and longer half-life compared to K1",
			polishFindings:
				"MK-7 wykazał lepszą biodostępność i dłuższy okres półtrwania w porównaniu z K1",
			evidenceLevel: "MODERATE",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "17158229",
			doi: "10.1182/blood-2006-08-040709",
			qualityScore: 8.5,
		},
		{
			id: "kurnatowska-2015",
			title: "Effect of vitamin K2 on progression of atherosclerosis",
			polishTitle: "Wpływ witaminy K2 na progresję miażdżycy",
			authors: ["Kurnatowska I", "Grzelak P", "Masajtis-Zagajewska A"],
			journal: "Polskie Archiwum Medycyny Wewnętrznej",
			year: 2015,
			studyType: "COHORT_STUDY",
			primaryOutcome: "Vitamin K2 effects on vascular calcification",
			polishPrimaryOutcome: "Wpływ witaminy K2 na wapnienie naczyń",
			findings:
				"Vitamin K2 supplementation may slow progression of vascular calcification",
			polishFindings:
				"Suplementacja witaminy K2 może spowalniać progresję wapnienia naczyń",
			evidenceLevel: "MODERATE",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "26004985",
			doi: "10.20452/pamw.2928",
			qualityScore: 7.5,
		},
	],

	// Metadata
	tags: [
		"vitamin",
		"fat soluble vitamin",
		"bone health",
		"cardiovascular protection",
		"calcium metabolism",
		"osteoporosis prevention",
		"vascular calcification",
		"vitamin K2",
		"MK-7",
		"menaquinone-7",
		"osteocalcin",
		"matrix Gla protein",
	],
	lastUpdated: "2024-01-15T00:00:00Z",
	createdAt: "2024-01-15T00:00:00Z",

	// Additional fields for Prisma compatibility
	knowledgeNodeId: null,
};

export default vitaminK2MK7Profile;
