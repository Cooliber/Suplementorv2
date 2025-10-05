/**
 * Omega-3 Fatty Acids Supplement Profile
 * Migrated from nextjs-roocode-template with enhanced T3 Stack compatibility
 * Essential Brain Nutrients with comprehensive Polish medical compliance
 */

import type { SupplementWithRelations } from "../../types/supplement";

export const omega3Profile: SupplementWithRelations = {
	id: "omega-3",
	name: "Omega-3 Fatty Acids",
	polishName: "Kwasy tłuszczowe Omega-3",
	scientificName: "Polyunsaturated fatty acids (PUFA)",
	commonNames: ["EPA", "DHA", "Fish Oil", "Algae Oil"],
	polishCommonNames: ["EPA", "DHA", "Olej rybi", "Olej z alg"],
	category: "FATTY_ACID",
	description:
		"Omega-3 fatty acids are essential polyunsaturated fats critical for brain health, cardiovascular function, and anti-inflammatory responses. EPA (eicosapentaenoic acid) and DHA (docosahexaenoic acid) play key roles in neurotransmitter function, neuroplasticity, and cellular membrane integrity.",
	polishDescription:
		"Kwasy omega-3 to niezbędne nienasycone tłuszcze, kluczowe dla zdrowia mózgu, funkcji sercowo-naczyniowej i odpowiedzi przeciwzapalnych. EPA (kwas eikozapentaenowy) i DHA (kwas dokozaheksaenowy) odgrywają kluczowe role w funkcji neuroprzekaźników, neuroplastyczności i integralności błon komórkowych.",

	// Active compounds with detailed bioavailability data
	activeCompounds: [
		{
			name: "EPA (Eicosapentaenoic Acid)",
			polishName: "EPA (Kwas eikozapentaenowy)",
			concentration: "500mg",
			bioavailability: 85,
			halfLife: "18-24 hours",
			metabolicPathway: [
				"Anti-inflammatory pathways",
				"Prostaglandin synthesis",
			],
			targetReceptors: ["Inflammatory mediators", "Cellular membranes"],
		},
		{
			name: "DHA (Docosahexaenoic Acid)",
			polishName: "DHA (Kwas dokozaheksaenowy)",
			concentration: "300mg",
			bioavailability: 85,
			halfLife: "2-3 days",
			metabolicPathway: [
				"Neurodevelopment",
				"Memory formation",
				"Cellular membranes",
			],
			targetReceptors: ["Neurotransmitter receptors", "Membrane fluidity"],
		},
	],

	// Clinical applications with Polish translations
	clinicalApplications: [
		{
			condition: "Cardiovascular and brain health",
			polishCondition: "Zdrowie serca i mózgu",
			indication:
				"Support for heart health, blood pressure, and cognitive function",
			polishIndication:
				"Wsparcie dla zdrowia serca, ciśnienia krwi i funkcji poznawczych",
			efficacy: "high",
			effectivenessRating: 8,
			evidenceLevel: "STRONG",
			recommendedDose: "1000-2000mg daily",
			duration: "Months",
			effectSize: 0.5,
			studyCount: 25,
			participantCount: 5000,
			recommendationGrade: "A",
		},
		{
			condition: "Major depressive disorder",
			polishCondition: "Zaburzenia depresyjne",
			indication:
				"Support for depression, particularly with higher EPA content",
			polishIndication:
				"Wsparcie dla depresji, szczególnie przy wyższej zawartości EPA",
			efficacy: "moderate",
			effectivenessRating: 8,
			evidenceLevel: "STRONG",
			recommendedDose: "1000-2000mg EPA daily",
			duration: "8-12 weeks",
			effectSize: 0.35,
			studyCount: 15,
			participantCount: 2000,
			recommendationGrade: "A",
		},
		{
			condition: "Cognitive decline and dementia prevention",
			polishCondition: "Zapobieganie spadkowi poznawczemu",
			indication:
				"Support for memory and prevention of age-related cognitive decline",
			polishIndication:
				"Wsparcie dla pamięci i zapobieganie wiekowemu spadkowi poznawczemu",
			efficacy: "moderate",
			effectivenessRating: 6,
			evidenceLevel: "MODERATE",
			recommendedDose: "1000mg DHA daily",
			duration: "Years",
			effectSize: 0.25,
			studyCount: 10,
			participantCount: 1500,
			recommendationGrade: "B",
		},
		{
			condition: "ADHD and neurodevelopmental disorders",
			polishCondition: "ADHD i zaburzenia neurorozwojowe",
			indication: "Support for attention, focus, and cognitive development",
			polishIndication: "Wsparcie dla uwagi, skupienia i rozwoju poznawczego",
			efficacy: "moderate",
			effectivenessRating: 8,
			evidenceLevel: "STRONG",
			recommendedDose: "500-1000mg daily",
			duration: "3-6 months",
			effectSize: 0.3,
			studyCount: 12,
			participantCount: 1200,
			recommendationGrade: "A",
		},
		{
			condition: "Inflammatory conditions",
			polishCondition: "Stany zapalne",
			indication:
				"Reduction of inflammatory markers and inflammatory conditions",
			polishIndication: "Redukcja wskaźników zapalnych i stanów zapalnych",
			efficacy: "high",
			effectivenessRating: 8,
			evidenceLevel: "STRONG",
			recommendedDose: "2000-3000mg daily",
			duration: "Weeks to months",
			effectSize: 0.6,
			studyCount: 20,
			participantCount: 2500,
			recommendationGrade: "A",
		},
	],

	// Mechanisms of action with detailed pathways
	mechanisms: [
		{
			id: "membrane-fluidity",
			name: "Membrane fluidity and anti-inflammatory pathways",
			polishName: "Płynność błon i ścieżki przeciwzapalne",
			pathway: "Membrane fluidity and anti-inflammatory pathways",
			polishPathway: "Membrane fluidity and anti-inflammatory pathways",
			description:
				"Omega-3 fatty acids integrate into cell membranes, modulate inflammation, and support neurotransmitter function. EPA and DHA become incorporated into cellular phospholipids, affecting membrane fluidity and signal transduction.",
			polishDescription:
				"Kwasy omega-3 integrują się z błonami komórkowymi, modulują zapalenie i wspierają funkcję neuroprzekaźników. EPA i DHA integrują się z fosfolipidami komórkowymi, wpływając na płynność błon i transdukcję sygnałów.",
			evidenceLevel: "STRONG",
			targetSystems: [
				"Cellular membranes",
				"Signal transduction",
				"Neurotransmission",
			],
			timeToEffect: "Weeks to months",
			duration: "Continuous membrane integration",
		},
		{
			id: "bdnf-upregulation",
			name: "BDNF upregulation and neuroplasticity",
			polishName: "Wzmocnienie BDNF i neuroplastyczność",
			pathway: "BDNF upregulation and neuroplasticity",
			polishPathway: "BDNF upregulation and neuroplasticity",
			description:
				"DHA increases brain-derived neurotrophic factor (BDNF) expression, promoting neuroplasticity and neurogenesis in the hippocampus. This supports learning, memory, and cognitive function.",
			polishDescription:
				"DHA zwiększa ekspresję czynnika neurotroficznego pochodnego z mózgu (BDNF), promując neuroplastyczność i neurogenezę w hipokampie. Wspiera to uczenie się, pamięć i funkcję poznawczą.",
			evidenceLevel: "STRONG",
			targetSystems: ["Neurotrophins", "Hippocampus", "Memory"],
			timeToEffect: "4-8 weeks",
			duration: "Long-term neuroplasticity",
		},
		{
			id: "serotonin-dopamine",
			name: "Serotonin and dopamine modulation",
			polishName: "Modulacja serotoniny i dopaminy",
			pathway: "Serotonin and dopamine modulation",
			polishPathway: "Serotonin and dopamine modulation",
			description:
				"EPA influences serotonin and dopamine pathways, contributing to mood regulation and cognitive function. This mechanism underlies the antidepressant and cognitive effects of omega-3s.",
			polishDescription:
				"EPA wpływa na ścieżki serotoniny i dopaminy, przyczyniając się do regulacji nastroju i funkcji poznawczych. Mechanizm ten leży u podstaw antydepresyjnych i poznawczych efektów omega-3.",
			evidenceLevel: "STRONG",
			targetSystems: ["Serotonin system", "Dopamine system", "Mood"],
			timeToEffect: "4-8 weeks",
			duration: "Continuous modulation",
		},
		{
			id: "anti-inflammatory-antioxidant",
			name: "Anti-inflammatory and antioxidant effects",
			polishName: "Efekty przeciwzapalne i antyoksydacyjne",
			pathway: "Anti-inflammatory and antioxidant effects",
			polishPathway: "Anti-inflammatory and antioxidant effects",
			description:
				"Reduces pro-inflammatory cytokines (TNF-α, IL-6) and oxidative stress through resolvins and protectins synthesis. Omega-3s produce specialized pro-resolving mediators that actively resolve inflammation.",
			polishDescription:
				"Redukuje prozapalne cytokiny (TNF-α, IL-6) i stres oksydacyjny poprzez syntezę rozwiązin i protektyn. Omega-3 produkują specjalizowane środki rozwiązywujące zapalenie, które aktywnie rozpuszczają zapalenie.",
			evidenceLevel: "STRONG",
			targetSystems: [
				"Inflammatory system",
				"Cytokine regulation",
				"Oxidative stress",
			],
			timeToEffect: "Days to weeks",
			duration: "Continuous anti-inflammatory action",
		},
		{
			id: "blood-brain-barrier",
			name: "Blood-brain barrier integrity",
			polishName: "Integralność bariery krew-mózg",
			pathway: "Blood-brain barrier integrity",
			polishPathway: "Blood-brain barrier integrity",
			description:
				"Supports blood-brain barrier function and reduces neuroinflammation through specialized pro-resolving mediators. DHA is particularly important for maintaining BBB integrity.",
			polishDescription:
				"Wsparcie dla funkcji bariery krew-mózg i redukcja neurozapalenia poprzez specjalizowane środki rozwiązywujące zapalenie. DHA jest szczególnie ważne dla utrzymania integralności BBB.",
			evidenceLevel: "MODERATE",
			targetSystems: [
				"Blood-brain barrier",
				"Neuroinflammation",
				"Brain protection",
			],
			timeToEffect: "Weeks to months",
			duration: "Continuous barrier protection",
		},
	],

	// Comprehensive dosage guidelines
	dosageGuidelines: {
		therapeuticRange: {
			min: 1000,
			max: 3000,
			unit: "mg",
		},
		timing: ["morning", "evening"],
		withFood: true,
		contraindications: ["Bleeding disorders"],
		polishContraindications: ["Zaburzenia krzepnięcia krwi"],
		interactions: [
			{
				substance: "Anticoagulants",
				polishSubstance: "Leki przeciwzakrzepowe",
				type: "synergistic",
				severity: "moderate",
				description: "Interaction between supplements",
				polishDescription: "Interakcja między suplementami",
				clinicalSignificance: "Monitor for effects",
				polishClinicalSignificance: "Monitorować efekty",
				mechanism: "Enhanced anticoagulation",
				polishMechanism: "Wzmocnione działania przeciwzakrzepowe",
				recommendation: "Monitor coagulation parameters if combining",
				polishRecommendation: "Monitoruj parametry krzepnięcia przy łączeniu",
				evidenceLevel: "MODERATE",
			},
		],
	},

	// Side effects with frequency and management
	sideEffects: [
		{
			effect: "Fishy aftertaste",
			polishEffect: "Rybny posmak",
			frequency: "common",
			severity: "mild",
			reversible: true,
			dosageDependent: true,
			timeToOnset: "Minutes after consumption",
			management: "Take with meals, choose enteric-coated formulations",
			polishManagement:
				"Przyjmuj z posiłkami, wybierz formuły z oponką jelitową",
		},
		{
			effect: "Digestive upset",
			polishEffect: "Niewygodę trawienia",
			frequency: "uncommon",
			severity: "mild",
			reversible: true,
			dosageDependent: true,
			timeToOnset: "30-60 minutes",
			management: "Take with food, reduce dose gradually",
			polishManagement: "Przyjmuj z jedzeniem, stopniowo zmniejsz dawkę",
		},
		{
			effect: "Bleeding risk",
			polishEffect: "Ryzyko krwawienia",
			frequency: "rare",
			severity: "moderate",
			reversible: true,
			dosageDependent: true,
			timeToOnset: "Days to weeks",
			management:
				"Monitor if combining with anticoagulants, reduce dose if needed",
			polishManagement:
				"Monitoruj przy łączeniu z lekami przeciwzakrzepowymi, zmniejsz dawkę jeśli potrzeba",
		},
	],

	// Supplement interactions
	interactions: [
		{
			substance: "Anticoagulants",
			polishSubstance: "Leki przeciwzakrzepowe",
			type: "synergistic",
			severity: "moderate",
			description: "Interaction between supplements",
			polishDescription: "Interakcja między suplementami",
			clinicalSignificance: "Monitor for effects",
			polishClinicalSignificance: "Monitorować efekty",
			mechanism: "Enhanced anticoagulation and bleeding risk",
			polishMechanism:
				"Wzmocnione działania przeciwzakrzepowe i ryzyko krwawienia",
			recommendation: "Monitor coagulation parameters if combining",
			polishRecommendation: "Monitoruj parametry krzepnięcia przy łączeniu",
			evidenceLevel: "MODERATE",
		},
		{
			substance: "Antihypertensive medications",
			polishSubstance: "Leki przeciw nadciśnieniu",
			type: "synergistic",
			clinicalSignificance:
				"Minor clinical significance - generally safe with monitoring",
			polishClinicalSignificance:
				"Niewielkie znaczenie kliniczne - ogólnie bezpieczne z monitorowaniem",
			severity: "minor",
			mechanism: "Additive blood pressure reduction",
			polishMechanism: "Addytywne obniżenie ciśnienia krwi",
			description:
				"May enhance blood pressure-lowering effects of antihypertensive drugs",
			polishDescription:
				"Może wzmocnić efekty obniżania ciśnienia przez leki przeciw nadciśnieniu",
			recommendation: "Monitor blood pressure to avoid excessive reduction",
			polishRecommendation:
				"Monitoruj ciśnienie krwi, aby uniknąć nadmiernego obniżenia",
			evidenceLevel: "WEAK",
		},
	],

	// Evidence level and research studies
	evidenceLevel: "STRONG",
	researchStudies: [
		{
			id: "abdelhamid-2020",
			title:
				"Omega-3 fatty acids for the primary and secondary prevention of cardiovascular disease",
			polishTitle:
				"Kwasy omega-3 do pierwotnej i wtórnej profilaktyki chorób sercowo-naczyniowych",
			authors: ["Abdelhamid AS", "Brown TJ", "Brainard JS"],
			journal: "Cochrane Database of Systematic Reviews",
			year: 2020,
			studyType: "SYSTEMATIC_REVIEW",
			primaryOutcome: "Cardiovascular disease prevention",
			polishPrimaryOutcome: "Profilaktyka chorób sercowo-naczyniowych",
			findings:
				"Omega-3 supplementation provides modest cardiovascular benefits",
			polishFindings:
				"Suplementacja omega-3 zapewnia umiarkowane korzyści sercowo-naczyniowe",
			evidenceLevel: "STRONG",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "32114706",
			doi: "10.1002/14651858.CD003177.pub3",
			sampleSize: 0,
			qualityScore: 9.0,
		},
		{
			id: "liao-2019",
			title:
				"Omega-3 fatty acids and depression: scientific evidence and biological mechanisms",
			polishTitle:
				"Kwasy omega-3 i depresja: naukowe dowody i mechanizmy biologiczne",
			authors: ["Liao Y", "Xie B", "Zhang H"],
			journal: "Oxidative Medicine and Cellular Longevity",
			year: 2019,
			studyType: "SYSTEMATIC_REVIEW",
			primaryOutcome: "Depressive symptoms",
			polishPrimaryOutcome: "Objawy depresji",
			findings:
				"EPA-rich omega-3 supplementation shows significant antidepressant effects",
			polishFindings:
				"Suplementacja omega-3 bogata w EPA wykazuje znaczące efekty antydepresyjne",
			evidenceLevel: "STRONG",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "30881491",
			doi: "10.1155/2019/1604628",
			sampleSize: 0,
			qualityScore: 8.0,
		},
		{
			id: "horrocks-1999",
			title:
				"Docosahexaenoic acid (DHA): An essential nutrient and a nutraceutical for brain health",
			polishTitle:
				"Kwas dokozaheksaenowy (DHA): składnik odżywczy i preparat leczniczy dla zdrowia mózgu",
			authors: ["Horrocks LA", "Yeo YK"],
			journal: "Molecular Neurobiology",
			year: 1999,
			studyType: "SYSTEMATIC_REVIEW",
			primaryOutcome: "Brain function and development",
			polishPrimaryOutcome: "Funkcja mózgu i rozwój",
			findings:
				"DHA is crucial for brain development and cognitive function throughout life",
			polishFindings:
				"DHA jest kluczowy dla rozwoju mózgu i funkcji poznawczych przez całe życie",
			evidenceLevel: "MODERATE",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "10208371",
			doi: "10.1007/s12035-999-0023-5",
			sampleSize: 0,
			qualityScore: 7.5,
		},
		{
			id: "freeman-2006",
			title: "Omega-3 fatty acids in the treatment of psychiatric disorders",
			polishTitle: "Kwasy omega-3 w leczeniu zaburzeń psychiatrycznych",
			authors: ["Freeman MP", "Hibbeln JR", "Wisner KL"],
			journal: "Drugs",
			year: 2006,
			studyType: "SYSTEMATIC_REVIEW",
			primaryOutcome: "Psychiatric treatment outcomes",
			polishPrimaryOutcome: "Wyniki leczenia psychiatrycznego",
			findings:
				"Omega-3 supplementation shows promise in treating mood disorders and schizophrenia",
			polishFindings:
				"Suplementacja omega-3 wykazuje potencjał w leczeniu zaburzeń nastroju i schizofrenii",
			evidenceLevel: "STRONG",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "17020480",
			doi: "10.2165/00003495-200666140-00002",
			sampleSize: 0,
			qualityScore: 8.0,
		},
		{
			id: "calder-2013",
			title:
				"Omega-3 polyunsaturated fatty acids and inflammatory processes: nutrition or pharmacology?",
			polishTitle:
				"Kwasy omega-3 wielonienasycone i procesy zapalne: nutrycja czy farmakologia?",
			authors: ["Calder PC"],
			journal: "British Journal of Clinical Pharmacology",
			year: 2013,
			studyType: "SYSTEMATIC_REVIEW",
			primaryOutcome: "Anti-inflammatory effects",
			polishPrimaryOutcome: "Efekty przeciwzapalne",
			findings:
				"Omega-3 fatty acids have potent anti-inflammatory effects through multiple mechanisms",
			polishFindings:
				"Kwasy omega-3 mają silne efekty przeciwzapalne poprzez wiele mechanizmów",
			evidenceLevel: "STRONG",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "22765297",
			doi: "10.1111/j.1365-2125.2012.04374.x",
			sampleSize: 0,
			qualityScore: 8.5,
		},
	],

	// Metadata
	tags: [
		"fatty acid",
		"cardiovascular health",
		"brain function",
		"anti-inflammatory",
		"depression",
		"adhd",
		"neuroplasticity",
		"membrane fluidity",
		"bdnf",
	],
	lastUpdated: "2024-01-15T00:00:00Z",
	createdAt: "2024-01-15T00:00:00Z",

	// Additional fields for Prisma compatibility
	knowledgeNodeId: null,
};

export const omegaThreeData = omega3Profile;
export default omega3Profile;
