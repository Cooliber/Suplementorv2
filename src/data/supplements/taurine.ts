/**
 * Taurine Supplement Profile
 * Migrated from nextjs-roocode-template with enhanced T3 Stack compatibility
 * The Cardiovascular Amino Acid with comprehensive Polish medical compliance
 */

import type { SupplementWithRelations } from "../../types/supplement";

export const taurineProfile: SupplementWithRelations = {
	id: "taurine",
	name: "Taurine",
	polishName: "Tauryna",
	scientificName: "2-aminoethanesulfonic acid",
	commonNames: ["Taurine", "2-aminoethylsulfonic acid"],
	polishCommonNames: ["Tauryna", "2-aminoetylosulfonowy kwas"],
	category: "AMINO_ACID",
	description:
		"Taurine is a conditionally essential amino acid with potent antioxidant, anti-inflammatory, and cardioprotective properties. It plays crucial roles in cardiovascular function, osmoregulation, neuromodulation, and exercise performance, making it essential for heart health, athletic performance, and metabolic function.",
	polishDescription:
		"Tauryna to warunkowo istotny aminokwas o silnych właściwościach przeciwutleniających, przeciwzapalnych i kardioprotekcyjnych. Odgrywa kluczowe role w funkcji sercowo-naczyniowej, osmoregulacji, neuromodulacji i wydajności wysiłkowej, czyniąc ją niezbędną dla zdrowia serca, wydajności sportowej i funkcji metabolicznej.",

	// Active compounds with detailed bioavailability data
	activeCompounds: [
		{
			name: "Taurine",
			polishName: "Tauryna",
			concentration: "1000mg",
			bioavailability: 85,
			halfLife: "1-2 hours",
			metabolicPathway: [
				"Osmoregulation",
				"Antioxidant systems",
				"Cardiac metabolism",
			],
			targetReceptors: [
				"GABA-A receptors",
				"Glycine receptors",
				"Calcium channels",
			],
		},
	],

	// Clinical applications with Polish translations
	clinicalApplications: [
		{
			condition: "Cardiovascular health",
			polishCondition: "Zdrowie sercowo-naczyniowe",
			indication: "Blood pressure regulation and cardioprotection",
			polishIndication: "Regulacja ciśnienia krwi i kardioprotekcja",
			efficacy: "high",
			effectivenessRating: 8,
			evidenceLevel: "STRONG",
			recommendedDose: "1000-3000mg daily",
			duration: "Weeks to months",
			effectSize: 0.6,
			studyCount: 20,
			participantCount: 1500,
			recommendationGrade: "A",
		},
		{
			condition: "Exercise performance",
			polishCondition: "Wydajność wysiłkowa",
			indication: "Enhanced endurance and reduced muscle fatigue",
			polishIndication:
				"Zwiększona wytrzymałość i zmniejszone zmęczenie mięśni",
			efficacy: "high",
			effectivenessRating: 8,
			evidenceLevel: "STRONG",
			recommendedDose: "1000-2000mg pre-workout",
			duration: "Acute exercise sessions",
			effectSize: 0.5,
			studyCount: 15,
			participantCount: 800,
			recommendationGrade: "A",
		},
		{
			condition: "Antioxidant protection",
			polishCondition: "Ochrona przeciwutleniająca",
			indication: "Cellular protection against oxidative stress",
			polishIndication: "Ochrona komórkowa przed stresem oksydacyjnym",
			efficacy: "moderate",
			effectivenessRating: 7,
			evidenceLevel: "MODERATE",
			recommendedDose: "500-1500mg daily",
			duration: "Weeks to months",
			effectSize: 0.4,
			studyCount: 12,
			participantCount: 600,
			recommendationGrade: "B",
		},
		{
			condition: "Metabolic health",
			polishCondition: "Zdrowie metaboliczne",
			indication: "Insulin sensitivity and glucose metabolism support",
			polishIndication:
				"Wsparcie wrażliwości insulinowej i metabolizmu glukozy",
			efficacy: "moderate",
			effectivenessRating: 6,
			evidenceLevel: "MODERATE",
			recommendedDose: "1000-2000mg daily",
			duration: "4-8 weeks",
			effectSize: 0.3,
			studyCount: 10,
			participantCount: 500,
			recommendationGrade: "B",
		},
	],

	// Mechanisms of action with detailed pathways
	mechanisms: [
		{
			id: "cardioprotective",
			name: "Cardioprotective and antihypertensive effects",
			polishName: "Efekty kardioprotekcyjne i przeciwnadciśnieniowe",
			pathway: "Cardiovascular regulation",
			polishPathway: "Regulacja sercowo-naczyniowa",
			description:
				"Taurine modulates calcium homeostasis in cardiac muscle, reduces oxidative stress, and supports endothelial function, contributing to blood pressure regulation and cardioprotection.",
			polishDescription:
				"Tauryna moduluje homeostazę wapnia w mięśniu sercowym, zmniejsza stres oksydacyjny i wspiera funkcję śródbłonka, przyczyniając się do regulacji ciśnienia krwi i kardioprotekcji.",
			evidenceLevel: "STRONG",
			targetSystems: [
				"Cardiac muscle",
				"Vascular endothelium",
				"Calcium channels",
				"Oxidative stress pathways",
			],
			timeToEffect: "2-4 weeks",
			duration: "Chronic supplementation",
		},
		{
			id: "osmoregulation",
			name: "Cellular osmoregulation and membrane stabilization",
			polishName: "Osmoregulacja komórkowa i stabilizacja błony",
			pathway: "Cellular homeostasis",
			polishPathway: "Homeostaza komórkowa",
			description:
				"Taurine acts as an osmolyte, maintaining cellular volume and membrane integrity, particularly important in cardiac and skeletal muscle cells during exercise and stress.",
			polishDescription:
				"Tauryna działa jako osmolit, utrzymując objętość komórkową i integralność błony, szczególnie ważny w komórkach mięśnia sercowego i szkieletowego podczas wysiłku i stresu.",
			evidenceLevel: "STRONG",
			targetSystems: ["Cell membranes", "Muscle cells", "Osmotic balance"],
			timeToEffect: "30-60 minutes",
			duration: "4-6 hours",
		},
		{
			id: "antioxidant",
			name: "Antioxidant and anti-inflammatory effects",
			polishName: "Efekty przeciwutleniające i przeciwzapalne",
			pathway: "Oxidative stress modulation",
			polishPathway: "Modulacja stresu oksydacyjnego",
			description:
				"Taurine scavenges reactive oxygen species, modulates inflammatory pathways, and supports mitochondrial function, providing cellular protection against oxidative damage.",
			polishDescription:
				"Tauryna wychwytuje reaktywne formy tlenu, moduluje ścieżki zapalne i wspiera funkcję mitochondriów, zapewniając ochronę komórkową przed uszkodzeniami oksydacyjnymi.",
			evidenceLevel: "MODERATE",
			targetSystems: [
				"Antioxidant systems",
				"Inflammatory pathways",
				"Mitochondria",
			],
			timeToEffect: "1-2 hours",
			duration: "6-8 hours",
		},
	],

	// Comprehensive dosage guidelines
	dosageGuidelines: {
		therapeuticRange: {
			min: 500,
			max: 3000,
			unit: "mg",
		},
		timing: ["morning", "pre-workout"],
		withFood: false,
		contraindications: ["Bipolar disorder", "Kidney disease"],
		polishContraindications: ["Zaburzenia dwubiegunowe", "Choroba nerek"],
		interactions: [
			{
				substance: "Antihypertensive medications",
				polishSubstance: "Leki przeciwnadciśnieniowe",
				type: "synergistic",
				severity: "moderate",
				description: "Enhanced blood pressure lowering effects",
				polishDescription: "Wzmocnione efekty obniżania ciśnienia krwi",
				clinicalSignificance: "Monitor blood pressure",
				polishClinicalSignificance: "Monitoruj ciśnienie krwi",
				mechanism: "Additive cardiovascular effects",
				polishMechanism: "Addytywne efekty sercowo-naczyniowe",
				recommendation: "Monitor cardiovascular parameters",
				polishRecommendation: "Monitoruj parametry sercowo-naczyniowe",
				evidenceLevel: "MODERATE",
			},
			{
				substance: "Antiarrhythmic medications",
				polishSubstance: "Leki antyarytmiczne",
				type: "synergistic",
				severity: "minor",
				description: "Potential cardiac rhythm effects",
				polishDescription: "Potencjalne efekty rytmu serca",
				clinicalSignificance: "Monitor cardiac function",
				polishClinicalSignificance: "Monitoruj funkcję serca",
				mechanism: "Cardiac electrophysiology modulation",
				polishMechanism: "Modulacja elektrofizjologii serca",
				recommendation: "Clinical monitoring recommended",
				polishRecommendation: "Zalecane monitorowanie kliniczne",
				evidenceLevel: "WEAK",
			},
		],
	},

	// Side effects with frequency and management
	sideEffects: [
		{
			effect: "Gastrointestinal discomfort",
			polishEffect: "Dyskomfort żołądkowo-jelitowy",
			frequency: "common",
			severity: "mild",
			reversible: true,
			dosageDependent: true,
			timeToOnset: "30-60 minutes",
			management: "Take with food, reduce dose",
			polishManagement: "Przyjmuj z jedzeniem, zmniejsz dawkę",
		},
		{
			effect: "Hypotension",
			polishEffect: "Niedociśnienie",
			frequency: "uncommon",
			severity: "mild",
			reversible: true,
			dosageDependent: true,
			timeToOnset: "2-4 hours",
			management: "Monitor blood pressure, adjust dose",
			polishManagement: "Monitoruj ciśnienie krwi, dostosuj dawkę",
		},
		{
			effect: "Dizziness",
			polishEffect: "Zawroty głowy",
			frequency: "rare",
			severity: "mild",
			reversible: true,
			dosageDependent: false,
			timeToOnset: "1-2 hours",
			management: "Ensure adequate hydration",
			polishManagement: "Zapewnij odpowiednie nawodnienie",
		},
	],

	// Supplement interactions
	interactions: [
		{
			substance: "Caffeine",
			polishSubstance: "Kofeina",
			type: "synergistic",
			severity: "beneficial",
			description: "Enhanced exercise performance and focus",
			polishDescription: "Zwiększona wydajność wysiłkowa i skupienie",
			clinicalSignificance: "Improved athletic performance",
			polishClinicalSignificance: "Poprawiona wydajność sportowa",
			mechanism: "Complementary ergogenic effects",
			polishMechanism: "Komplementarne efekty ergogeniczne",
			recommendation: "Beneficial combination for exercise",
			polishRecommendation: "Korzystna kombinacja dla wysiłku",
			evidenceLevel: "MODERATE",
		},
		{
			substance: "Creatine",
			polishSubstance: "Kreatyna",
			type: "synergistic",
			severity: "beneficial",
			description: "Enhanced muscle function and recovery",
			polishDescription: "Zwiększona funkcja mięśni i regeneracja",
			clinicalSignificance: "Improved exercise outcomes",
			polishClinicalSignificance: "Poprawione wyniki wysiłkowe",
			mechanism: "Complementary cellular energy support",
			polishMechanism: "Komplementarne wsparcie energii komórkowej",
			recommendation: "Beneficial for athletic performance",
			polishRecommendation: "Korzystne dla wydajności sportowej",
			evidenceLevel: "MODERATE",
		},
		{
			substance: "Beta-alanine",
			polishSubstance: "Beta-alanina",
			type: "synergistic",
			severity: "beneficial",
			description: "Enhanced buffering capacity and performance",
			polishDescription: "Zwiększona pojemność buforowa i wydajność",
			clinicalSignificance: "Improved endurance exercise",
			polishClinicalSignificance: "Poprawiony wysiłek wytrzymałościowy",
			mechanism: "Complementary pH regulation",
			polishMechanism: "Komplementarna regulacja pH",
			recommendation: "Beneficial combination for exercise",
			polishRecommendation: "Korzystna kombinacja dla wysiłku",
			evidenceLevel: "MODERATE",
		},
	],

	// Evidence level and research studies
	evidenceLevel: "STRONG",
	researchStudies: [
		{
			id: "yamori-2010",
			title: "Taurine in cardiovascular disease prevention",
			polishTitle: "Tauryna w zapobieganiu chorobom sercowo-naczyniowym",
			authors: ["Yamori Y", "Taguchi T", "Hamasaki Y", "Mori H"],
			journal: "European Journal of Clinical Nutrition",
			year: 2010,
			studyType: "META_ANALYSIS",
			primaryOutcome: "Cardiovascular risk reduction",
			polishPrimaryOutcome: "Redukcja ryzyka sercowo-naczyniowego",
			findings:
				"Taurine supplementation significantly reduced cardiovascular risk factors",
			polishFindings:
				"Suplementacja tauryny znacząco zmniejszyła czynniki ryzyka sercowo-naczyniowego",
			evidenceLevel: "STRONG",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "20717126",
			doi: "10.1038/ejcn.2010.4",
			sampleSize: 25,
			duration: "Meta-analysis of multiple studies",
			dosage: "1-6g daily",
			qualityScore: 8.5,
		},
		{
			id: "balshaw-2013",
			title: "The effect of acute taurine ingestion on 3km running performance",
			polishTitle: "Efekt ostrego spożycia tauryny na wydajność biegu na 3km",
			authors: ["Balshaw TG", "Bampouras TM", "Barry TJ", "Sparks SA"],
			journal:
				"International Journal of Sport Nutrition and Exercise Metabolism",
			year: 2013,
			studyType: "RANDOMIZED_CONTROLLED_TRIAL",
			primaryOutcome: "Exercise performance",
			polishPrimaryOutcome: "Wydajność wysiłkowa",
			findings: "Acute taurine ingestion improved 3km running time",
			polishFindings: "Ostre spożycie tauryny poprawiło czas biegu na 3km",
			evidenceLevel: "MODERATE",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "22890496",
			doi: "10.1123/ijsnem.23.5.522",
			sampleSize: 15,
			duration: "Single dose study",
			dosage: "1000mg taurine",
			qualityScore: 7.0,
		},
		{
			id: "zhang-2004",
			title:
				"Taurine ameliorates chronic streptozotocin-induced diabetic nephropathy",
			polishTitle:
				"Tauryna poprawia przewlekłą nefropatię cukrzycową wywołaną streptozotocyną",
			authors: [
				"Zhang M",
				"Izumi I",
				"Kagamimori S",
				"Sokejima S",
				"Yamagami T",
				"Liu Z",
				"Qi B",
			],
			journal: "Amino Acids",
			year: 2004,
			studyType: "ANIMAL_STUDY",
			primaryOutcome: "Diabetic nephropathy protection",
			polishPrimaryOutcome: "Ochrona nefropatii cukrzycowej",
			findings: "Taurine protected against diabetic kidney damage",
			polishFindings: "Tauryna chroniła przed uszkodzeniem nerek w cukrzycy",
			evidenceLevel: "WEAK",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "15503202",
			doi: "10.1007/s00726-004-0114-2",
			sampleSize: 0,
			duration: "8 weeks",
			dosage: "1% taurine in drinking water",
			qualityScore: 6.0,
		},
	],

	// Metadata
	tags: [
		"amino acid",
		"cardiovascular health",
		"antioxidant",
		"exercise performance",
		"endurance",
		"metabolic health",
		"anti-inflammatory",
	],
	lastUpdated: "2024-01-15T00:00:00Z",
	createdAt: "2024-01-15T00:00:00Z",

	// Additional fields for Prisma compatibility
	knowledgeNodeId: null,
};

export const taurineData = taurineProfile;
export default taurineProfile;
