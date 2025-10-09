/**
 * Vitamin C (Ascorbic Acid) Supplement Profile
 * Essential vitamin for immune function, collagen synthesis, and antioxidant protection
 * Comprehensive profile with Polish medical compliance
 */

import type { SupplementWithRelations } from "../../types/supplement";

export const vitaminCProfile: SupplementWithRelations = {
	id: "vitamin-c",
	name: "Vitamin C",
	polishName: "Witamina C",
	scientificName: "Ascorbic acid",
	commonNames: [
		"Ascorbic acid",
		"L-ascorbic acid",
		"Ascorbate",
		"Vitamin C",
	],
	polishCommonNames: [
		"Kwas askorbinowy",
		"L-askorbinowy",
		"Askorbinian",
		"Witamina C",
	],
	category: "VITAMIN",
	description:
		"Vitamin C is a water-soluble essential vitamin and powerful antioxidant that plays crucial roles in immune function, collagen synthesis, iron absorption, and neurotransmitter production. It supports connective tissue health, wound healing, and provides protection against oxidative stress.",
	polishDescription:
		"Witamina C to rozpuszczalna w wodzie niezbędna witamina i silny przeciwutleniacz, który odgrywa kluczowe role w funkcji odpornościowej, syntezie kolagenu, wchłanianiu żelaza i produkcji neurotransmiterów. Wspiera zdrowie tkanki łącznej, gojenie ran i zapewnia ochronę przed stresem oksydacyjnym.",

	// Active compounds with detailed bioavailability data
	activeCompounds: [
		{
			name: "Ascorbic acid",
			polishName: "Kwas askorbinowy",
			concentration: "1000mg",
			bioavailability: 85,
			halfLife: "2-4 hours",
			metabolicPathway: ["Antioxidant pathway", "Collagen synthesis", "Iron absorption"],
			targetReceptors: ["Ascorbate transporters", "Enzyme cofactors"],
		},
		{
			name: "Mineral ascorbates",
			polishName: "Askorbiniany mineralne",
			concentration: "1000mg",
			bioavailability: 90,
			halfLife: "3-6 hours",
			metabolicPathway: ["Buffered vitamin C metabolism", "Mineral absorption"],
			targetReceptors: ["Sodium-dependent vitamin C transporters"],
		},
	],

	// Clinical applications with Polish translations
	clinicalApplications: [
		{
			condition: "Immune system support",
			polishCondition: "Wsparcie układu odpornościowego",
			indication: "Prevention and treatment of common cold and infections",
			polishIndication: "Zapobieganie i leczenie przeziębień oraz infekcji",
			efficacy: "moderate",
			effectivenessRating: 7,
			evidenceLevel: "MODERATE",
			recommendedDose: "1000-2000mg daily",
			duration: "During infection or for prevention",
			effectSize: 0.3,
			studyCount: 30,
			participantCount: 10000,
			recommendationGrade: "B",
		},
		{
			condition: "Antioxidant protection",
			polishCondition: "Ochrona przeciwutleniająca",
			indication: "Oxidative stress reduction and cellular protection",
			polishIndication: "Redukcja stresu oksydacyjnego i ochrona komórek",
			efficacy: "high",
			effectivenessRating: 8,
			evidenceLevel: "STRONG",
			recommendedDose: "500-1000mg daily",
			duration: "Ongoing supplementation",
			effectSize: 0.5,
			studyCount: 50,
			participantCount: 8000,
			recommendationGrade: "A",
		},
		{
			condition: "Iron absorption enhancement",
			polishCondition: "Wzmocnienie wchłaniania żelaza",
			indication: "Iron deficiency prevention and treatment support",
			polishIndication: "Wsparcie zapobiegania i leczenia niedoboru żelaza",
			efficacy: "high",
			effectivenessRating: 8,
			evidenceLevel: "STRONG",
			recommendedDose: "200-500mg with iron supplementation",
			duration: "With meals containing iron",
			effectSize: 0.6,
			studyCount: 20,
			participantCount: 1500,
			recommendationGrade: "A",
		},
		{
			condition: "Collagen synthesis support",
			polishCondition: "Wsparcie syntezy kolagenu",
			indication: "Wound healing and connective tissue health",
			polishIndication: "Gojenie ran i zdrowie tkanki łącznej",
			efficacy: "moderate",
			effectivenessRating: 7,
			evidenceLevel: "MODERATE",
			recommendedDose: "500-2000mg daily",
			duration: "4-8 weeks for tissue repair",
			effectSize: 0.4,
			studyCount: 15,
			participantCount: 800,
			recommendationGrade: "B",
		},
		{
			condition: "Cardiovascular health",
			polishCondition: "Zdrowie sercowo-naczyniowe",
			indication: "Blood pressure and endothelial function support",
			polishIndication: "Wsparcie ciśnienia krwi i funkcji śródbłonka",
			efficacy: "moderate",
			effectivenessRating: 6,
			evidenceLevel: "MODERATE",
			recommendedDose: "500-1000mg daily",
			duration: "8-12 weeks for cardiovascular effects",
			effectSize: 0.25,
			studyCount: 25,
			participantCount: 3000,
			recommendationGrade: "B",
		},
	],

	// Mechanisms of action with detailed pathways
	mechanisms: [
		{
			id: "antioxidant-activity",
			name: "Antioxidant and free radical scavenging",
			polishName: "Aktywność przeciwutleniająca i zwalczanie wolnych rodników",
			pathway: "Redox homeostasis",
			polishPathway: "Homeostaza redoks",
			description:
				"Vitamin C acts as a powerful antioxidant, donating electrons to neutralize free radicals and reactive oxygen species. It regenerates other antioxidants like vitamin E and glutathione.",
			polishDescription:
				"Witamina C działa jako silny przeciwutleniacz, oddając elektrony do neutralizacji wolnych rodników i reaktywnych form tlenu. Regeneruje inne przeciwutleniacze, takie jak witamina E i glutation.",
			evidenceLevel: "STRONG",
			targetSystems: ["Immune system", "Cardiovascular system", "Cellular protection"],
			timeToEffect: "30-60 minutes",
			duration: "2-4 hours",
		},
		{
			id: "collagen-synthesis",
			name: "Collagen synthesis and connective tissue support",
			polishName: "Synteza kolagenu i wsparcie tkanki łącznej",
			pathway: "Hydroxylation reactions",
			polishPathway: "Reakcje hydroksylacji",
			description:
				"Vitamin C is essential for collagen synthesis as a cofactor for prolyl and lysyl hydroxylases. It supports wound healing, skin health, and connective tissue integrity.",
			polishDescription:
				"Witamina C jest niezbędna do syntezy kolagenu jako kofaktor dla hydroksylaz proliny i lizyny. Wspiera gojenie ran, zdrowie skóry i integralność tkanki łącznej.",
			evidenceLevel: "STRONG",
			targetSystems: ["Connective tissue", "Skin", "Blood vessels"],
			timeToEffect: "1-2 weeks",
			duration: "Ongoing for tissue maintenance",
		},
		{
			id: "iron-absorption",
			name: "Iron absorption enhancement",
			polishName: "Wzmocnienie wchłaniania żelaza",
			pathway: "Iron metabolism",
			polishPathway: "Metabolizm żelaza",
			description:
				"Vitamin C reduces ferric iron (Fe3+) to ferrous iron (Fe2+), enhancing absorption in the duodenum. It forms a chelate complex that improves iron bioavailability.",
			polishDescription:
				"Witamina C redukuje żelazo ferryczne (Fe3+) do żelaza ferrous (Fe2+), wzmacniając wchłanianie w dwunastnicy. Tworzy kompleks chelatowy, który poprawia biodostępność żelaza.",
			evidenceLevel: "STRONG",
			targetSystems: ["Gastrointestinal system", "Hematopoietic system"],
			timeToEffect: "30-60 minutes",
			duration: "2-3 hours",
		},
		{
			id: "immune-modulation",
			name: "Immune system modulation",
			polishName: "Modulacja układu odpornościowego",
			pathway: "Immune cell function",
			polishPathway: "Funkcja komórek odpornościowych",
			description:
				"Vitamin C supports immune function through enhanced neutrophil chemotaxis, phagocytosis, and lymphocyte proliferation. It modulates cytokine production and immune response.",
			polishDescription:
				"Witamina C wspiera funkcję odpornościową poprzez zwiększoną chemotaksję neutrofili, fagocytozę i proliferację limfocytów. Moduluje produkcję cytokin i odpowiedź odpornościową.",
			evidenceLevel: "MODERATE",
			targetSystems: ["Immune system", "White blood cells"],
			timeToEffect: "24-48 hours",
			duration: "Ongoing supplementation",
		},
	],

	// Comprehensive dosage guidelines
	dosageGuidelines: {
		therapeuticRange: {
			min: 200,
			max: 2000,
			unit: "mg",
		},
		timing: ["morning", "afternoon", "with meals"],
		withFood: true,
		contraindications: [
			"Iron overload disorders (hemochromatosis)",
			"Severe kidney disease",
			"Glucose-6-phosphate dehydrogenase deficiency",
		],
		polishContraindications: [
			"Zaburzenia przeciążenia żelazem (hemochromatoza)",
			" Ciężka choroba nerek",
			"Niedobór dehydrogenazy glukozo-6-fosforanowej",
		],
		interactions: [
			{
				substance: "Iron supplements",
				polishSubstance: "Suplementy żelaza",
				type: "synergistic",
				severity: "beneficial",
				description: "Vitamin C enhances iron absorption",
				clinicalSignificance: "Improved iron bioavailability",
				polishClinicalSignificance:
					"Poprawiona biodostępność żelaza",
				polishDescription:
					"Witamina C wzmacnia wchłanianie żelaza",
				recommendation: "Take together for enhanced iron absorption",
				polishRecommendation: "Przyjmuj razem dla lepszego wchłaniania żelaza",
				evidenceLevel: "STRONG",
			},
			{
				substance: "Aspirin",
				polishSubstance: "Aspiryna",
				type: "antagonistic",
				severity: "minor",
				description: "May increase vitamin C excretion",
				clinicalSignificance: "May reduce vitamin C levels",
				polishClinicalSignificance:
					"Może obniżyć poziom witaminy C",
				polishDescription:
					"Może zwiększyć wydalanie witaminy C",
				recommendation: "Monitor vitamin C status with chronic aspirin use",
				polishRecommendation: "Monitoruj poziom witaminy C przy chronicznym stosowaniu aspiryny",
				evidenceLevel: "MODERATE",
			},
		],
	},

	// Side effects with frequency and management
	sideEffects: [
		{
			effect: "Gastrointestinal upset",
			polishEffect: "Zaburzenia żołądkowo-jelitowe",
			frequency: "common",
			severity: "mild",
			reversible: true,
			dosageDependent: true,
			timeToOnset: "1-4 hours",
			management: "Take with food, reduce dose, or use buffered form",
			polishManagement: "Przyjmuj z jedzeniem, zmniejsz dawkę lub użyj formy buforowanej",
		},
		{
			effect: "Diarrhea",
			polishEffect: "Biegunka",
			frequency: "uncommon",
			severity: "mild",
			reversible: true,
			dosageDependent: true,
			timeToOnset: "2-6 hours",
			management: "Reduce dose or divide throughout day",
			polishManagement: "Zmniejsz dawkę lub podziel w ciągu dnia",
		},
		{
			effect: "Kidney stones",
			polishEffect: "Kamienie nerkowe",
			frequency: "rare",
			severity: "moderate",
			reversible: true,
			dosageDependent: true,
			timeToOnset: "Months of high-dose use",
			management: "Avoid doses >2000mg daily, ensure adequate hydration",
			polishManagement: "Unikaj dawek >2000mg dziennie, zapewnij odpowiednie nawodnienie",
		},
	],

	// Supplement interactions
	interactions: [
		{
			substance: "Vitamin E",
			polishSubstance: "Witamina E",
			type: "synergistic",
			severity: "beneficial",
			description: "Complementary antioxidant protection",
			polishDescription: "Komplementarna ochrona przeciwutleniająca",
			clinicalSignificance: "Enhanced antioxidant effects",
			polishClinicalSignificance: "Wzmocnione efekty przeciwutleniające",
			mechanism: "Vitamin C regenerates oxidized vitamin E",
			polishMechanism: "Witamina C regeneruje utlenioną witaminę E",
			recommendation: "Beneficial combination for antioxidant protection",
			polishRecommendation:
				"Korzystne połączenie dla ochrony przeciwutleniającej",
			evidenceLevel: "STRONG",
		},
		{
			substance: "Bioflavonoids",
			polishSubstance: "Bioflawonoidy",
			type: "synergistic",
			clinicalSignificance: "Enhanced vitamin C activity and absorption",
			polishClinicalSignificance: "Wzmocniona aktywność i wchłanianie witaminy C",
			severity: "beneficial",
			mechanism: "Improved stability and cellular uptake",
			polishMechanism: "Poprawiona stabilność i wychwyt komórkowy",
			description:
				"Bioflavonoids enhance vitamin C absorption and protect it from oxidation",
			polishDescription:
				"Bioflawonoidy wzmacniają wchłanianie witaminy C i chronią ją przed utlenianiem",
			recommendation: "Natural complexes often contain both compounds",
			polishRecommendation:
				"Naturalne kompleksy często zawierają oba związki",
			evidenceLevel: "MODERATE",
		},
	],

	// Evidence level and research studies
	evidenceLevel: "STRONG",
	researchStudies: [
		{
			id: "hemila-2013",
			title: "Vitamin C for preventing and treating the common cold",
			polishTitle: "Witamina C w zapobieganiu i leczeniu przeziębienia",
			authors: ["Hemilä H", "Chalker E"],
			journal: "Cochrane Database of Systematic Reviews",
			year: 2013,
			studyType: "SYSTEMATIC_REVIEW",
			primaryOutcome: "Common cold prevention and treatment",
			polishPrimaryOutcome: "Zapobieganie i leczenie przeziębienia",
			findings:
				"Regular vitamin C supplementation may reduce cold duration and severity",
			polishFindings:
				"Regularna suplementacja witaminy C może skrócić czas trwania i nasilenie przeziębienia",
			evidenceLevel: "MODERATE",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "23440782",
			doi: "10.1002/14651858.CD000980.pub4",
			qualityScore: 9.0,
		},
		{
			id: "carr-2017",
			title: "Vitamin C and immune function",
			polishTitle: "Witamina C a funkcja odpornościowa",
			authors: ["Carr AC", "Maguire E"],
			journal: "Nutrients",
			year: 2017,
			studyType: "EXPERT_OPINION",
			primaryOutcome: "Immune system effects of vitamin C",
			polishPrimaryOutcome: "Wpływ witaminy C na układ odpornościowy",
			findings:
				"Vitamin C is essential for proper immune function and antioxidant protection",
			polishFindings:
				"Witamina C jest niezbędna dla prawidłowej funkcji odpornościowej i ochrony przeciwutleniającej",
			evidenceLevel: "STRONG",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "29099763",
			doi: "10.3390/nu9111211",
			qualityScore: 8.5,
		},
		{
			id: "padayatty-2003",
			title: "Vitamin C pharmacokinetics: implications for oral and intravenous use",
			polishTitle: "Farmakokinetyka witaminy C: implikacje dla stosowania doustnego i dożylnego",
			authors: ["Padayatty SJ", "Sun H", "Wang Y"],
			journal: "Annals of Internal Medicine",
			year: 2003,
			studyType: "EXPERT_OPINION",
			primaryOutcome: "Vitamin C absorption and bioavailability",
			polishPrimaryOutcome: "Wchłanianie i biodostępność witaminy C",
			findings:
				"Oral vitamin C has limited absorption at high doses, suggesting intravenous administration for pharmacological effects",
			polishFindings:
				"Doustna witamina C ma ograniczone wchłanianie w wysokich dawkach, sugerując podawanie dożylne dla efektów farmakologicznych",
			evidenceLevel: "MODERATE",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "12693887",
			doi: "10.7326/0003-4819-138-5-200303040-00010",
			qualityScore: 8.0,
		},
	],

	// Metadata
	tags: [
		"vitamin",
		"antioxidant",
		"immune support",
		"collagen",
		"iron absorption",
		"wound healing",
		"cardiovascular health",
		"essential nutrient",
		"water soluble",
		"common cold",
	],
	lastUpdated: "2024-01-15T00:00:00Z",
	createdAt: "2024-01-15T00:00:00Z",

	// Additional fields for Prisma compatibility
	knowledgeNodeId: null,
};

export default vitaminCProfile;