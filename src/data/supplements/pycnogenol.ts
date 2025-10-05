/**
 * Pycnogenol Supplement Profile
 * Migrated from nextjs-roocode-template with enhanced T3 Stack compatibility
 * Maritime Pine Bark Extract with comprehensive Polish medical compliance
 */

import type { SupplementWithRelations } from "../../types/supplement";

export const pycnogenolProfile: SupplementWithRelations = {
	id: "pycnogenol",
	name: "Pycnogenol",
	polishName: "Pycnogenol",
	scientificName: "Maritime Pine Bark Extract (Pinus pinaster)",
	commonNames: [
		"Maritime Pine Bark Extract",
		"Pinus pinaster Extract",
		"French Maritime Pine Bark",
	],
	polishCommonNames: [
		"Ekstrakt z kory sosny morskiej",
		"Ekstrakt z Pinus pinaster",
		"Kora sosny morskiej",
	],
	category: "HERB",
	description:
		"Pycnogenol is a standardized extract from the bark of French maritime pine trees, rich in procyanidins and other bioflavonoids. It provides powerful antioxidant and anti-inflammatory effects, supports vascular health, and has shown benefits for ADHD, circulation, and cognitive function. It is a unique antioxidant that can cross the blood-brain barrier.",
	polishDescription:
		"Pycnogenol to standaryzowany ekstrakt z kory sosny morskiej pochodzącej z Francji, bogaty w procjanydyny i inne bioflawonoidy. Zapewnia silne efekty antyoksydacyjne i przeciwzapalne, wspiera zdrowie naczyniowe i wykazał korzyści dla ADHD, krążenia i funkcji poznawczych. Jest unikalnym antyoksydantem, który może przechodzić przez barierę krew-mózg.",

	// Active compounds with detailed bioavailability data
	activeCompounds: [
		{
			name: "Procyanidins",
			polishName: "Procjanydyny",
			concentration: "65-75%",
			bioavailability: 25,
			halfLife: "4-6 hours",
			metabolicPathway: ["Antioxidant pathways", "Free radical scavenging"],
			targetReceptors: ["Free radical sites", "Antioxidant enzymes"],
		},
		{
			name: "Catechin",
			polishName: "Katechina",
			concentration: "5-10%",
			bioavailability: 30,
			halfLife: "2-3 hours",
			metabolicPathway: ["Antioxidant pathways", "Metal chelation"],
			targetReceptors: ["Antioxidant enzymes", "Metal ions"],
		},
		{
			name: "Taxifolin",
			polishName: "Taksifolin",
			concentration: "1-2%",
			bioavailability: 35,
			halfLife: "6-8 hours",
			metabolicPathway: ["Antioxidant pathways", "Anti-inflammatory"],
			targetReceptors: ["Antioxidant enzymes", "Inflammatory mediators"],
		},
		{
			name: "Phenolic acids",
			polishName: "Kwasy fenolowe",
			concentration: "5-10%",
			bioavailability: 20,
			halfLife: "3-4 hours",
			metabolicPathway: ["Antioxidant pathways", "Anti-inflammatory"],
			targetReceptors: ["Inflammatory mediators", "Oxidative stress markers"],
		},
	],

	// Clinical applications with Polish translations
	clinicalApplications: [
		{
			condition: "ADHD and attention disorders",
			polishCondition: "ADHD i zaburzenia uwagi",
			indication:
				"Support for attention, hyperactivity, and focus in children and adults",
			polishIndication:
				"Wsparcie dla uwagi, hiperaktywności i skupienia u dzieci i dorosłych",
			efficacy: "moderate",
			effectivenessRating: 7,
			evidenceLevel: "MODERATE",
			recommendedDose: "1mg/kg body weight daily",
			duration: "4-8 weeks",
			effectSize: 0.4,
			studyCount: 4,
			participantCount: 200,
			recommendationGrade: "B",
		},
		{
			condition: "Chronic venous insufficiency",
			polishCondition: "Przewlekła niewydolność żylna",
			indication:
				"Improvement of circulation and reduction of swelling in legs",
			polishIndication: "Poprawa krążenia i redukcja obrzęków w nogach",
			efficacy: "high",
			effectivenessRating: 8,
			evidenceLevel: "STRONG",
			recommendedDose: "100-200mg daily",
			duration: "4-12 weeks",
			effectSize: 0.6,
			studyCount: 6,
			participantCount: 400,
			recommendationGrade: "A",
		},
		{
			condition: "Asthma and allergies",
			polishCondition: "Astma i alergie",
			indication:
				"Reduction of inflammatory response and improvement of respiratory function",
			polishIndication:
				"Redukcja odpowiedzi zapalnej i poprawa funkcji oddechowej",
			efficacy: "moderate",
			effectivenessRating: 6,
			evidenceLevel: "MODERATE",
			recommendedDose: "100mg daily",
			duration: "8-12 weeks",
			effectSize: 0.35,
			studyCount: 3,
			participantCount: 200,
			recommendationGrade: "B",
		},
		{
			condition: "Cognitive function and memory",
			polishCondition: "Funkcje poznawcze i pamięć",
			indication: "Potential cognitive benefits and neuroprotection",
			polishIndication: "Potencjalne korzyści poznawcze i neuroprotekcja",
			efficacy: "low",
			effectivenessRating: 4,
			evidenceLevel: "WEAK",
			recommendedDose: "100-150mg daily",
			duration: "12-16 weeks",
			effectSize: 0.2,
			studyCount: 3,
			participantCount: 200,
			recommendationGrade: "C",
		},
		{
			condition: "Joint health and osteoarthritis",
			polishCondition: "Zdrowie stawów i choroba zwyrodnieniowa",
			indication: "Anti-inflammatory support for joint health",
			polishIndication: "Wsparcie przeciwzapalne dla zdrowia stawów",
			efficacy: "low",
			effectivenessRating: 4,
			evidenceLevel: "WEAK",
			recommendedDose: "100-150mg daily",
			duration: "8-12 weeks",
			effectSize: 0.25,
			studyCount: 2,
			participantCount: 150,
			recommendationGrade: "C",
		},
	],

	// Mechanisms of action with detailed pathways
	mechanisms: [
		{
			id: "antioxidant-scavenging",
			name: "Antioxidant and free radical scavenging",
			polishName: "Antyoksydacyjne i neutralizacja wolnych rodników",
			pathway: "Antioxidant and free radical scavenging",
			polishPathway: "Antioxidant and free radical scavenging",
			description:
				"Powerful antioxidant activity through multiple mechanisms including superoxide dismutase activation. Pycnogenol neutralizes free radicals and prevents oxidative damage to cells and tissues.",
			polishDescription:
				"Silna aktywność antyoksydacyjna poprzez wiele mechanizmów w tym aktywację dysmutazy ponadtlenkowej. Pycnogenol neutralizuje wolne rodniki i zapobiega uszkodzeniom oksydacyjnym komórek i tkanek.",
			evidenceLevel: "STRONG",
			targetSystems: [
				"Oxidative stress",
				"Free radical protection",
				"Antioxidant enzymes",
			],
			timeToEffect: "Days to weeks",
			duration: "Continuous antioxidant protection",
		},
		{
			id: "anti-inflammatory",
			name: "Anti-inflammatory effects",
			polishName: "Efekty przeciwzapalne",
			pathway: "Anti-inflammatory effects",
			polishPathway: "Anti-inflammatory effects",
			description:
				"Reduces inflammation by inhibiting pro-inflammatory cytokines and enzymes (COX-1, COX-2, LOX). Pycnogenol suppresses inflammatory pathways throughout the body.",
			polishDescription:
				"Redukuje zapalenie poprzez inhibicję prozapalnych cytokin i enzymów (COX-1, COX-2, LOX). Pycnogenol tłumi ścieżki zapalne w całym organizmie.",
			evidenceLevel: "STRONG",
			targetSystems: [
				"Inflammatory system",
				"Cytokine regulation",
				"COX enzymes",
			],
			timeToEffect: "Days to weeks",
			duration: "Continuous anti-inflammatory action",
		},
		{
			id: "vascular-health",
			name: "Vascular health and circulation",
			polishName: "Zdrowie naczyń i krążenie",
			pathway: "Vascular health and circulation",
			polishPathway: "Vascular health and circulation",
			description:
				"Improves endothelial function, nitric oxide production, and microcirculation. Pycnogenol enhances vascular tone and supports healthy blood flow.",
			polishDescription:
				"Poprawia funkcję śródbłonka, produkcję tlenku azotu i mikrokrążenie. Pycnogenol wzmacnia napięcie naczyniowe i wspiera zdrowy przepływ krwi.",
			evidenceLevel: "STRONG",
			targetSystems: [
				"Vascular system",
				"Endothelial function",
				"Nitric oxide",
			],
			timeToEffect: "2-4 weeks",
			duration: "Continuous vascular support",
		},
		{
			id: "collagen-stabilization",
			name: "Collagen stabilization",
			polishName: "Stabilizacja kolagenu",
			pathway: "Collagen stabilization",
			polishPathway: "Collagen stabilization",
			description:
				"Protects collagen and elastin from degradation, supporting connective tissue health. Pycnogenol inhibits enzymes that break down connective tissue proteins.",
			polishDescription:
				"Chroni kolagen i elastynę przed degradacją, wspierając zdrowie tkanki łącznej. Pycnogenol inhibuje enzymy rozkładające białka tkanki łącznej.",
			evidenceLevel: "MODERATE",
			targetSystems: [
				"Connective tissue",
				"Collagen preservation",
				"Elastin support",
			],
			timeToEffect: "4-8 weeks",
			duration: "Long-term structural support",
		},
		{
			id: "neuroprotection",
			name: "Neuroprotection",
			polishName: "Neuroprotekcja",
			pathway: "Neuroprotection",
			polishPathway: "Neuroprotection",
			description:
				"Crosses blood-brain barrier, reduces neuroinflammation and supports cognitive function. Pycnogenol provides targeted antioxidant protection to neural tissues.",
			polishDescription:
				"Przekracza barierę krew-mózg, redukuje neurozapalenie i wspiera funkcję poznawczą. Pycnogenol zapewnia ukierunkowaną ochronę antyoksydacyjną tkanek nerwowych.",
			evidenceLevel: "MODERATE",
			targetSystems: [
				"Blood-brain barrier",
				"Neuroinflammation",
				"Cognitive function",
			],
			timeToEffect: "6-12 weeks",
			duration: "Long-term neuroprotection",
		},
	],

	// Comprehensive dosage guidelines
	dosageGuidelines: {
		therapeuticRange: {
			min: 50,
			max: 200,
			unit: "mg",
		},
		timing: ["morning", "afternoon"],
		withFood: false,
		contraindications: ["Pregnancy", "Breastfeeding", "Autoimmune disorders"],
		polishContraindications: [
			"Ciąża",
			"Karmienie piersią",
			"Choroby autoimmunologiczne",
		],
		interactions: [
			{
				substance: "Immunosuppressants",
				polishSubstance: "Leki immunosupresyjne",
				type: "synergistic",
				severity: "moderate",
				description: "Interaction between supplements",
				polishDescription: "Interakcja między suplementami",
				clinicalSignificance: "Monitor for effects",
				polishClinicalSignificance: "Monitorować efekty",
				mechanism: "Enhanced immunosuppressive effects",
				polishMechanism: "Wzmocnione efekty immunosupresyjne",
				recommendation: "Monitor immune function if combining",
				polishRecommendation: "Monitoruj funkcję odpornościową przy łączeniu",
				evidenceLevel: "MODERATE",
			},
		],
	},

	// Side effects with frequency and management
	sideEffects: [
		{
			effect: "Gastrointestinal discomfort",
			polishEffect: "Niewygodę jelitową",
			frequency: "uncommon",
			severity: "mild",
			reversible: true,
			dosageDependent: true,
			timeToOnset: "30-60 minutes",
			management: "Take with food, reduce dose if needed",
			polishManagement: "Przyjmuj z jedzeniem, zmniejsz dawkę jeśli potrzeba",
		},
		{
			effect: "Headache",
			polishEffect: "Ból głowy",
			frequency: "uncommon",
			severity: "mild",
			reversible: true,
			dosageDependent: true,
			timeToOnset: "1-2 hours",
			management: "Reduce dose, ensure adequate hydration",
			polishManagement: "Zmniejsz dawkę, zapewnij odpowiednie nawodnienie",
		},
		{
			effect: "Dizziness",
			polishEffect: "Zawroty głowy",
			frequency: "rare",
			severity: "mild",
			reversible: true,
			dosageDependent: true,
			timeToOnset: "30-60 minutes",
			management: "Reduce dose, avoid sudden position changes",
			polishManagement: "Zmniejsz dawkę, unikaj nagłych zmian położenia",
		},
	],

	// Supplement interactions
	interactions: [
		{
			substance: "Immunosuppressants",
			polishSubstance: "Leki immunosupresyjne",
			type: "synergistic",
			severity: "moderate",
			description: "Interaction between supplements",
			polishDescription: "Interakcja między suplementami",
			clinicalSignificance: "Monitor for effects",
			polishClinicalSignificance: "Monitorować efekty",
			mechanism: "Enhanced immunosuppressive effects",
			polishMechanism: "Wzmocnione efekty immunosupresyjne",
			recommendation: "Monitor immune function if combining",
			polishRecommendation: "Monitoruj funkcję odpornościową przy łączeniu",
			evidenceLevel: "MODERATE",
		},
		{
			substance: "Anticoagulants",
			polishSubstance: "Leki przeciwzakrzepowe",
			type: "synergistic",
			clinicalSignificance:
				"Minor clinical significance - generally safe with monitoring",
			polishClinicalSignificance:
				"Niewielkie znaczenie kliniczne - ogólnie bezpieczne z monitorowaniem",
			severity: "minor",
			mechanism: "Mild antiplatelet effects",
			polishMechanism: "Łagodne efekty antypłytkowe",
			description: "May have mild antiplatelet effects",
			polishDescription: "Może mieć łagodne efekty antypłytkowe",
			recommendation: "Monitor bleeding risk when combining",
			polishRecommendation: "Monitoruj ryzyko krwawienia przy łączeniu",
			evidenceLevel: "WEAK",
		},
		{
			substance: "Chemotherapy drugs",
			polishSubstance: "Leki chemioterapii",
			type: "antagonistic",
			clinicalSignificance:
				"Minor clinical significance - generally safe with monitoring",
			polishClinicalSignificance:
				"Niewielkie znaczenie kliniczne - ogólnie bezpieczne z monitorowaniem",
			severity: "minor",
			mechanism: "Potential interference with treatment efficacy",
			polishMechanism: "Potencjalne zakłócenie skuteczności leczenia",
			description: "May interfere with chemotherapy efficacy",
			polishDescription: "Może zakłócać skuteczność chemioterapii",
			recommendation: "Avoid during chemotherapy unless directed by oncologist",
			polishRecommendation:
				"Unikaj podczas chemioterapii chyba że zaleci onkolog",
			evidenceLevel: "WEAK",
		},
	],

	// Evidence level and research studies
	evidenceLevel: "MODERATE",
	researchStudies: [
		{
			id: "trebaticka-2006",
			title: "Pycnogenol for ADHD",
			polishTitle: "Pycnogenol w ADHD",
			authors: ["Trebatická J", "Kopásová S", "Hradecná Z"],
			journal: "European Child & Adolescent Psychiatry",
			year: 2006,
			studyType: "RANDOMIZED_CONTROLLED_TRIAL",
			primaryOutcome: "ADHD symptoms",
			polishPrimaryOutcome: "Objawy ADHD",
			findings: "Pycnogenol significantly improved ADHD symptoms in children",
			polishFindings: "Pycnogenol znacząco poprawił objawy ADHD u dzieci",
			evidenceLevel: "MODERATE",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "16602090",
			doi: "10.1007/s00787-005-0517-2",
			sampleSize: 61,
			duration: "4 weeks",
			dosage: "1mg/kg daily",
			qualityScore: 7.5,
		},
		{
			id: "chovanova-2006",
			title:
				"Improvement of attention deficit hyperactivity disorder symptoms in children by pycnogenol",
			polishTitle:
				"Poprawa objawów zaburzeń deficytu uwagi i hiperaktywności u dzieci przez pycnogenol",
			authors: ["Chovanová Z", "Muchová J", "Sivonová M"],
			journal: "Redox Report",
			year: 2006,
			studyType: "RANDOMIZED_CONTROLLED_TRIAL",
			primaryOutcome: "ADHD symptoms",
			polishPrimaryOutcome: "Objawy ADHD",
			findings:
				"Pycnogenol improved ADHD symptoms and reduced oxidative stress",
			polishFindings:
				"Pycnogenol poprawił objawy ADHD i zmniejszył stres oksydacyjny",
			evidenceLevel: "MODERATE",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "17132293",
			doi: "10.1179/135100006X96928",
			sampleSize: 40,
			duration: "1 month",
			dosage: "1mg/kg daily",
			qualityScore: 7.0,
		},
		{
			id: "rohdewald-2002",
			title: "Pycnogenol: a review of the literature",
			polishTitle: "Pycnogenol: przegląd literatury",
			authors: ["Rohdewald P"],
			journal:
				"International Journal of Clinical Pharmacology and Therapeutics",
			year: 2002,
			studyType: "SYSTEMATIC_REVIEW",
			primaryOutcome: "Clinical applications",
			polishPrimaryOutcome: "Zastosowania kliniczne",
			findings:
				"Pycnogenol has significant antioxidant and anti-inflammatory effects",
			polishFindings:
				"Pycnogenol ma znaczące efekty antyoksydacyjne i przeciwzapalne",
			evidenceLevel: "MODERATE",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "12455370",
			doi: "10.5414/CPP40381",
			sampleSize: 0,
			qualityScore: 7.0,
		},
		{
			id: "devaraj-2002",
			title: "Antioxidant activity of Pycnogenol",
			polishTitle: "Aktywność antyoksydacyjna Pycnogenolu",
			authors: ["Devaraj S", "Vega-López S", "Kaul N"],
			journal: "Nutrition Research",
			year: 2002,
			studyType: "RANDOMIZED_CONTROLLED_TRIAL",
			primaryOutcome: "Antioxidant effects",
			polishPrimaryOutcome: "Efekty antyoksydacyjne",
			findings: "Pycnogenol significantly increases antioxidant capacity",
			polishFindings: "Pycnogenol znacząco zwiększa pojemność antyoksydacyjną",
			evidenceLevel: "MODERATE",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "12419401",
			doi: "10.1016/S0271-5317(02)00452-0",
			sampleSize: 25,
			duration: "3 weeks",
			qualityScore: 6.5,
		},
		{
			id: "belcaro-2014",
			title:
				"Pycnogenol improves cognitive function, attention, mental performance and specific professional skills in healthy professionals aged 35-55",
			polishTitle:
				"Pycnogenol poprawia funkcję poznawczą, uwagę, wydajność umysłową i specyficzne umiejętności zawodowe u zdrowych profesjonalistów w wieku 35-55 lat",
			authors: ["Belcaro G", "Luzzi R", "Dugall M"],
			journal: "Journal of Neurosurgical Sciences",
			year: 2014,
			studyType: "RANDOMIZED_CONTROLLED_TRIAL",
			primaryOutcome: "Cognitive function",
			polishPrimaryOutcome: "Funkcja poznawcza",
			findings:
				"Pycnogenol improved cognitive function in healthy professionals",
			polishFindings:
				"Pycnogenol poprawił funkcję poznawczą u zdrowych profesjonalistów",
			evidenceLevel: "WEAK",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "24566542",
			sampleSize: 108,
			duration: "12 weeks",
			dosage: "150mg daily",
			qualityScore: 6.0,
		},
	],

	// Metadata
	tags: [
		"herb",
		"antioxidant",
		"adhd",
		"vascular health",
		"anti-inflammatory",
		"procyanidins",
		"neuroprotection",
	],
	lastUpdated: "2024-01-15T00:00:00Z",
	createdAt: "2024-01-15T00:00:00Z",

	// Additional fields for Prisma compatibility
	knowledgeNodeId: null,
};

export default pycnogenolProfile;
