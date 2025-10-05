/**
 * Creatine Supplement Profile
 * Migrated from nextjs-roocode-template with enhanced T3 Stack compatibility
 * The Performance Enhancer with comprehensive Polish medical compliance
 */

import type { SupplementWithRelations } from "../../types/supplement";

export const creatineProfile: SupplementWithRelations = {
	id: "creatine",
	name: "Creatine",
	polishName: "Kreatyna",
	scientificName: "2-(Carbamimidoyl(methyl)amino)acetic acid",
	commonNames: ["Creatine Monohydrate", "Creatine HCl", "Creatine Phosphate"],
	polishCommonNames: ["Kreatyna Monohydrat", "Kreatyna HCl", "Fosfokreatyna"],
	category: "OTHER",
	description:
		"Creatine is a naturally occurring compound that plays a crucial role in energy metabolism, particularly in high-intensity, short-duration activities. It increases phosphocreatine stores in muscles, enhancing ATP regeneration for improved performance and recovery.",
	polishDescription:
		"Kreatyna to naturalnie występująca związek odgrywający kluczową rolę w metabolizmie energii, szczególnie w aktywnościach o wysokiej intensywności i krótkim czasie trwania. Zwiększa zapasy fosfokreatyny w mięśniach, wzmacniając regenerację ATP dla poprawy wydajności i regeneracji.",

	// Active compounds with detailed bioavailability data
	activeCompounds: [
		{
			name: "Creatine Monohydrate",
			polishName: "Kreatyna Monohydrat",
			concentration: "5g",
			bioavailability: 95,
			halfLife: "3-4 hours",
			metabolicPathway: ["Phosphocreatine energy system", "ATP regeneration"],
			targetReceptors: ["Phosphocreatine system", "ATP synthase"],
		},
	],

	// Clinical applications with Polish translations
	clinicalApplications: [
		{
			condition: "Athletic performance and muscle strength",
			polishCondition: "Wydolność sportowa i siła mięśni",
			indication: "Enhanced power output, strength, and muscle mass gains",
			polishIndication:
				"Wzmocnione wyjście mocy, siła i przyrost masy mięśniowej",
			efficacy: "high",
			effectivenessRating: 8,
			evidenceLevel: "STRONG",
			recommendedDose: "3-5g daily",
			duration: "4-8 weeks",
			effectSize: 0.7,
			studyCount: 25,
			participantCount: 3000,
			recommendationGrade: "A",
		},
		{
			condition: "High-intensity exercise performance",
			polishCondition: "Wydajność w ćwiczeniach o wysokiej intensywności",
			indication:
				"Improved performance in short-duration, high-intensity activities",
			polishIndication:
				"Poprawiona wydajność w krótkotrwałych, intensywnych aktywnościach",
			efficacy: "high",
			effectivenessRating: 8,
			evidenceLevel: "STRONG",
			recommendedDose: "3-5g daily",
			duration: "Days to weeks",
			effectSize: 0.6,
			studyCount: 20,
			participantCount: 2500,
			recommendationGrade: "A",
		},
		{
			condition: "Cognitive function",
			polishCondition: "Funkcja poznawcza",
			indication: "Potential cognitive benefits, particularly in vegetarians",
			polishIndication:
				"Potencjalne korzyści poznawcze, szczególnie u wegetarian",
			efficacy: "moderate",
			effectivenessRating: 4,
			evidenceLevel: "WEAK",
			recommendedDose: "3-5g daily",
			duration: "4-8 weeks",
			effectSize: 0.2,
			studyCount: 6,
			participantCount: 300,
			recommendationGrade: "C",
		},
		{
			condition: "Neuroprotection",
			polishCondition: "Neuroprotekcja",
			indication:
				"Potential neuroprotective effects against neurodegenerative diseases",
			polishIndication:
				"Potencjalne efekty neuroprotektorskie przeciwko chorobom neurodegeneracyjnym",
			efficacy: "low",
			effectivenessRating: 4,
			evidenceLevel: "WEAK",
			recommendedDose: "3-5g daily",
			duration: "Months to years",
			effectSize: 0.15,
			studyCount: 4,
			participantCount: 200,
			recommendationGrade: "D",
		},
	],

	// Mechanisms of action with detailed pathways
	mechanisms: [
		{
			id: "phosphocreatine-energy",
			name: "Phosphocreatine energy system",
			polishName: "System energii fosfokreatynowej",
			pathway: "Phosphocreatine energy system",
			polishPathway: "Phosphocreatine energy system",
			description:
				"Creatine increases phosphocreatine stores in muscles, enhancing ATP regeneration for high-intensity exercise. This provides immediate energy for muscle contractions.",
			polishDescription:
				"Kreatyna zwiększa zapasy fosfokreatyny w mięśniach, wzmacniając regenerację ATP dla ćwiczeń o wysokiej intensywności. Zapewnia to natychmiastową energię do skurczów mięśniowych.",
			evidenceLevel: "STRONG",
			targetSystems: [
				"Energy metabolism",
				"Muscle contraction",
				"ATP regeneration",
			],
			timeToEffect: "2-4 weeks",
			duration: "Continuous supplementation required",
		},
		{
			id: "cellular-hydration",
			name: "Cellular hydration and protein synthesis",
			polishName: "Nawodnienie komórkowe i biosynteza białek",
			pathway: "Cellular hydration and protein synthesis",
			polishPathway: "Cellular hydration and protein synthesis",
			description:
				"Creatine causes cellular water retention, which may stimulate protein synthesis and promote muscle growth. This osmotic effect contributes to muscle volumization.",
			polishDescription:
				"Kreatyna powoduje zatrzymywanie wody w komórkach, co może stymulować biosyntezę białek i promować wzrost mięśni. Efekt osmotyczny przyczynia się do wolumetryzacji mięśni.",
			evidenceLevel: "MODERATE",
			targetSystems: [
				"Cellular hydration",
				"Protein synthesis",
				"Muscle growth",
			],
			timeToEffect: "Days to weeks",
			duration: "Continuous effect during supplementation",
		},
		{
			id: "brain-energy-metabolism",
			name: "Brain energy metabolism",
			polishName: "Metabolizm energetyczny mózgu",
			pathway: "Brain energy metabolism",
			polishPathway: "Brain energy metabolism",
			description:
				"Creatine may also enhance brain energy metabolism by increasing phosphocreatine stores in neural tissue, potentially supporting cognitive function.",
			polishDescription:
				"Kreatyna może również wzmacniać metabolizm energetyczny mózgu przez zwiększenie zapasów fosfokreatyny w tkance nerwowej, potencjalnie wspierając funkcję poznawczą.",
			evidenceLevel: "WEAK",
			targetSystems: ["Brain energy", "Cognitive function", "Neuroprotection"],
			timeToEffect: "Weeks to months",
			duration: "Continuous effect during supplementation",
		},
	],

	// Comprehensive dosage guidelines
	dosageGuidelines: {
		therapeuticRange: {
			min: 3,
			max: 5,
			unit: "g",
		},
		timing: ["post-workout", "morning"],
		withFood: false,
		contraindications: ["Kidney disease", "Kidney impairment"],
		polishContraindications: ["Choroba nerek", "Uszkodzenie nerek"],
		interactions: [
			{
				substance: "Diuretics",
				polishSubstance: "Moczopędne",
				type: "antagonistic",
				severity: "moderate",
				description: "Interaction between supplements",
				polishDescription: "Interakcja między suplementami",
				clinicalSignificance: "Monitor for effects",
				polishClinicalSignificance: "Monitorować efekty",
				mechanism: "Potential kidney stress interaction",
				polishMechanism: "Potencjalna interakcja stresowa nerek",
				recommendation: "Monitor kidney function and hydration status",
				polishRecommendation: "Monitoruj funkcję nerek i stan nawodnienia",
				evidenceLevel: "MODERATE",
			},
		],
	},

	// Side effects with frequency and management
	sideEffects: [
		{
			effect: "Water retention",
			polishEffect: "Zatrzymywanie wody",
			frequency: "common",
			severity: "mild",
			reversible: true,
			dosageDependent: true,
			timeToOnset: "Days to weeks",
			management:
				"Expected and often desired effect, maintain adequate hydration",
			polishManagement:
				"Oczekiwany i często pożądany efekt, utrzymuj odpowiednie nawodnienie",
		},
		{
			effect: "Stomach cramping",
			polishEffect: "Spazmy żołądka",
			frequency: "uncommon",
			severity: "mild",
			reversible: true,
			dosageDependent: true,
			timeToOnset: "30-60 minutes",
			management: "Take with adequate water, reduce dose",
			polishManagement: "Przyjmuj z odpowiednią ilością wody, zmniejsz dawkę",
		},
		{
			effect: "Weight gain",
			polishEffect: "Przyrost masy ciała",
			frequency: "common",
			severity: "mild",
			reversible: false,
			dosageDependent: true,
			timeToOnset: "Days to weeks",
			management: "Due to increased muscle mass and water retention",
			polishManagement:
				"Spowodowany zwiększeniem masy mięśniowej i zatrzymaniem wody",
		},
	],

	// Supplement interactions
	interactions: [
		{
			substance: "Diuretics",
			polishSubstance: "Moczopędne",
			type: "antagonistic",
			severity: "moderate",
			description: "Interaction between supplements",
			polishDescription: "Interakcja między suplementami",
			clinicalSignificance: "Monitor for effects",
			polishClinicalSignificance: "Monitorować efekty",
			mechanism: "Potential kidney stress interaction",
			polishMechanism: "Potencjalna interakcja stresowa nerek",
			recommendation: "Monitor kidney function and hydration status",
			polishRecommendation: "Monitoruj funkcję nerek i stan nawodnienia",
			evidenceLevel: "MODERATE",
		},
		{
			substance: "Caffeine",
			polishSubstance: "Kofeina",
			type: "antagonistic",
			clinicalSignificance:
				"Minor clinical significance - generally safe with monitoring",
			polishClinicalSignificance:
				"Niewielkie znaczenie kliniczne - ogólnie bezpieczne z monitorowaniem",
			severity: "minor",
			mechanism: "Potential reduction in creatine uptake",
			polishMechanism: "Potencjalne zmniejszenie wchłaniania kreatyny",
			description: "High caffeine doses may slightly reduce creatine uptake",
			polishDescription:
				"Wysokie dawki kofeiny mogą nieco zmniejszyć wchłanianie kreatyny",
			recommendation: "Take separately if using high caffeine doses",
			polishRecommendation:
				"Podawaj osobno przy stosowaniu wysokich dawek kofeiny",
			evidenceLevel: "WEAK",
		},
	],

	// Evidence level and research studies
	evidenceLevel: "STRONG",
	researchStudies: [
		{
			id: "kreider-2017",
			title:
				"International Society of Sports Nutrition position stand: creatine supplementation and exercise",
			polishTitle:
				"Stanowisko Międzynarodowego Towarzystwa Naukowego ds. Żywienia Sportowego: suplementacja kreatyną i ćwiczenia",
			authors: ["Kreider RB", "Kalman DS", "Antonio J"],
			journal: "Journal of the International Society of Sports Nutrition",
			year: 2017,
			studyType: "SYSTEMATIC_REVIEW",
			primaryOutcome: "Exercise performance enhancement",
			polishPrimaryOutcome: "Wzmocnienie wydajności ćwiczeń",
			findings:
				"Creatine supplementation significantly improves high-intensity exercise performance",
			polishFindings:
				"Suplementacja kreatyną znacząco poprawia wydajność ćwiczeń o wysokiej intensywności",
			evidenceLevel: "STRONG",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "28615996",
			doi: "10.1186/s12970-017-0173-z",
			sampleSize: 0,
			qualityScore: 9.0,
		},
		{
			id: "cooper-2012",
			title:
				"Creatine supplementation with specific view to exercise/sports performance: an update",
			polishTitle:
				"Suplementacja kreatyną z konkretnym podejściem do wydajności w ćwiczeniach/sportach: aktualizacja",
			authors: ["Cooper R", "Naclerio F", "Allgrove J"],
			journal: "Journal of the International Society of Sports Nutrition",
			year: 2012,
			studyType: "SYSTEMATIC_REVIEW",
			primaryOutcome: "Sports performance enhancement",
			polishPrimaryOutcome: "Wzmocnienie wydajności sportowej",
			findings:
				"Creatine monohydrate is safe and effective for improving strength and power",
			polishFindings:
				"Kreatyna monohydrat jest bezpieczna i skuteczna w poprawie siły i mocy",
			evidenceLevel: "STRONG",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "22817980",
			doi: "10.1186/1550-2783-9-33",
			sampleSize: 0,
			qualityScore: 8.5,
		},
		{
			id: "pasiakos-2010",
			title: "Effects of creatine supplementation on exercise performance",
			polishTitle: "Efekty suplementacji kreatyną na wydajność ćwiczeń",
			authors: ["Pasiakos SM", "Calloway NH"],
			journal: "Journal of the American College of Nutrition",
			year: 2010,
			studyType: "META_ANALYSIS",
			primaryOutcome: "Exercise performance and body composition",
			polishPrimaryOutcome: "Wydajność ćwiczeń i skład ciała",
			findings:
				"Creatine supplementation increases lean body mass and strength performance",
			polishFindings:
				"Suplementacja kreatyną zwiększa masę ciała beztkankową i wydajność siłową",
			evidenceLevel: "STRONG",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "20823430",
			doi: "10.1080/07315724.2010.10719859",
			sampleSize: 0,
			qualityScore: 8.0,
		},
	],

	// Metadata
	tags: [
		"performance",
		"strength",
		"power",
		"muscle growth",
		"energy system",
		"phosphocreatine",
		"sports nutrition",
	],
	lastUpdated: "2024-01-15T00:00:00Z",
	createdAt: "2024-01-15T00:00:00Z",

	// Additional fields for Prisma compatibility
	knowledgeNodeId: null,
};

export default creatineProfile;
