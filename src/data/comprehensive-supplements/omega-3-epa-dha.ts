/**
 * Omega-3 Fatty Acids (EPA/DHA)
 * Comprehensive supplement profile with Polish translations
 */

import type { ComprehensiveSupplementProfile } from "./types";

export const omega_3_epa_dha: ComprehensiveSupplementProfile = {
	id: "omega-3-epa-dha",
	name: "Omega-3 Fatty Acids (EPA/DHA)",
	polishName: "Kwasy tłuszczowe Omega-3 (EPA/DHA)",
	scientificName: "Eicosapentaenoic acid / Docosahexaenoic acid",
	commonNames: ["Fish Oil", "Marine Omega-3", "EPA/DHA"],
	polishCommonNames: ["Olej rybny", "Morskie Omega-3", "EPA/DHA"],
	category: "FATTY_ACID",
	description:
		"Essential polyunsaturated fatty acids crucial for brain health, cardiovascular function, and inflammation regulation.",
	polishDescription:
		"Niezbędne wielonienasycone kwasy tłuszczowe kluczowe dla zdrowia mózgu, funkcji sercowo-naczyniowej i regulacji stanów zapalnych.",

	activeCompounds: [
		{
			name: "Eicosapentaenoic Acid (EPA)",
			polishName: "Kwas eikozapentaenowy (EPA)",
			concentration: "300-1000mg",
			bioavailability: 95,
			halfLife: "37 hours",
			metabolicPathway: ["Beta-oxidation", "Eicosanoid synthesis"],
			targetReceptors: ["PPAR-α", "PPAR-γ", "GPR120"],
		},
		{
			name: "Docosahexaenoic Acid (DHA)",
			polishName: "Kwas dokozaheksaenowy (DHA)",
			concentration: "200-1000mg",
			bioavailability: 95,
			halfLife: "20 days (brain tissue)",
			metabolicPathway: ["Membrane incorporation", "Neuroprotectin synthesis"],
			targetReceptors: ["Membrane phospholipids", "Retinal photoreceptors"],
		},
	],

	clinicalApplications: [
		{
			condition: "Cardiovascular Disease Prevention",
			polishCondition: "Profilaktyka chorób sercowo-naczyniowych",
			effectivenessRating: 9,
			evidenceLevel: "STRONG",
			efficacy: "high",
			recommendedDose: "1-2g EPA+DHA daily",
			duration: "Long-term",
		},
		{
			condition: "Cognitive Function Support",
			polishCondition: "Wsparcie funkcji poznawczych",
			effectivenessRating: 7,
			evidenceLevel: "MODERATE",
			efficacy: "moderate",
			recommendedDose: "1g DHA daily",
			duration: "3-6 months minimum",
		},
		{
			condition: "Depression (Adjunctive)",
			polishCondition: "Depresja (wspomagająco)",
			effectivenessRating: 6,
			evidenceLevel: "MODERATE",
			efficacy: "moderate",
			recommendedDose: "1-2g EPA daily",
			duration: "8-12 weeks",
		},
	],

	mechanisms: [
		{
			pathway: "Membrane Incorporation",
			polishPathway: "Wbudowanie w błony komórkowe",
			description:
				"EPA and DHA incorporate into cell membrane phospholipids, affecting membrane fluidity and function",
			polishDescription:
				"EPA i DHA wbudowują się w fosfolipidy błon komórkowych, wpływając na płynność i funkcję błon",
			targetSystems: [
				"Neuronal membranes",
				"Cardiac myocytes",
				"Endothelial cells",
			],
			evidenceLevel: "STRONG",
			timeToEffect: "2-8 weeks",
		},
		{
			pathway: "Eicosanoid Modulation",
			polishPathway: "Modulacja eikozanoidów",
			description:
				"EPA competes with arachidonic acid for cyclooxygenase and lipoxygenase enzymes",
			polishDescription:
				"EPA konkuruje z kwasem arachidonowym o enzymy cyklooksygenazy i lipooksygenazy",
			targetSystems: ["COX-1", "COX-2", "5-LOX", "12-LOX"],
			evidenceLevel: "STRONG",
			timeToEffect: "1-4 weeks",
		},
	],

	dosageGuidelines: {
		therapeuticRange: {
			min: 500,
			max: 3000,
			unit: "mg EPA+DHA",
		},
		timing: ["With meals", "Divided doses"],
		withFood: true,
		contraindications: ["Fish/seafood allergy", "Bleeding disorders"],
		polishContraindications: [
			"Alergia na ryby/owoce morza",
			"Zaburzenia krzepnięcia",
		],
		interactions: [],
	},

	sideEffects: [
		{
			effect: "Gastrointestinal upset",
			polishEffect: "Dolegliwości żołądkowo-jelitowe",
			frequency: "uncommon",
			severity: "mild",
			reversible: true,
			management: "Take with food, reduce dose, enteric-coated formulations",
			polishManagement:
				"Przyjmować z jedzeniem, zmniejszyć dawkę, preparaty dojelitowe",
		},
		{
			effect: "Fishy aftertaste/burps",
			polishEffect: "Rybny posmak/odbijanie",
			frequency: "uncommon",
			severity: "mild",
			reversible: true,
			management:
				"Freeze capsules, take with meals, choose high-quality products",
			polishManagement:
				"Zamrażać kapsułki, przyjmować z posiłkami, wybierać wysokiej jakości produkty",
		},
		{
			effect: "Increased bleeding risk",
			polishEffect: "Zwiększone ryzyko krwawienia",
			frequency: "uncommon",
			severity: "moderate",
			reversible: true,
			management:
				"Monitor INR if on anticoagulants, discontinue before surgery",
			polishManagement:
				"Monitorować INR przy antykoagulantach, przerwać przed operacją",
		},
	],

	interactions: [
		{
			substance: "Warfarin",
			polishSubstance: "Warfaryna",
			type: "synergistic",
			description: "Additive anticoagulant effects",
			severity: "moderate",
			clinicalSignificance: "Monitor INR more frequently",
			polishClinicalSignificance: "Częstsze monitorowanie INR",
			recommendation: "Caution with doses >3g daily",
			polishRecommendation: "Ostrożność przy dawkach >3g dziennie",
		},
		{
			substance: "Aspirin",
			polishSubstance: "Aspiryna",
			type: "synergistic",
			description: "Complementary antiplatelet effects",
			severity: "minor",
			clinicalSignificance: "Enhanced cardiovascular protection",
			polishClinicalSignificance: "Wzmocniona ochrona sercowo-naczyniowa",
			recommendation: "Generally safe combination",
			polishRecommendation: "Ogólnie bezpieczna kombinacja",
		},
	],

	evidenceLevel: "STRONG",
	researchStudies: [
		{
			id: "gissi-prevenzione-1999",
			title:
				"Dietary supplementation with n-3 polyunsaturated fatty acids and vitamin E after myocardial infarction",
			polishTitle:
				"Suplementacja diety wielonienasyconymi kwasami tłuszczowymi n-3 i witaminą E po zawale serca",
			authors: ["GISSI-Prevenzione Investigators"],
			journal: "The Lancet",
			year: 1999,
			studyType: "RANDOMIZED_CONTROLLED_TRIAL",
			primaryOutcome: "Study outcome",
			polishPrimaryOutcome: "Wynik badania",
			findings: "Study findings",
			polishFindings: "Wyniki badania",
			lastUpdated: "2024-01-15T00:00:00Z",
			sampleSize: 11324,
			duration: "3.5 years",
			results: "15% reduction in primary endpoint (p=0.02)",
			polishResults: "15% redukcja pierwotnego punktu końcowego (p=0,02)",
			evidenceLevel: "STRONG",
			pubmedId: "10465168",
			doi: "10.1016/S0140-6736(99)07072-5",
		},
		{
			id: "reduce-it-2019",
			title:
				"Cardiovascular Risk Reduction with Icosapent Ethyl for Hypertriglyceridemia",
			polishTitle:
				"Redukcja ryzyka sercowo-naczyniowego z etyl ikozapentaenowym w hipertriglicerydemii",
			authors: ["Bhatt DL", "Steg PG", "Miller M", "et al."],
			journal: "New England Journal of Medicine",
			year: 2019,
			studyType: "RANDOMIZED_CONTROLLED_TRIAL",
			primaryOutcome: "Study outcome",
			polishPrimaryOutcome: "Wynik badania",
			findings: "Study findings",
			polishFindings: "Wyniki badania",
			lastUpdated: "2024-01-15T00:00:00Z",
			sampleSize: 8179,
			duration: "4.9 years",
			results: "25% reduction in primary endpoint (p<0.001)",
			polishResults: "25% redukcja pierwotnego punktu końcowego (p<0,001)",
			evidenceLevel: "STRONG",
			pubmedId: "30415628",
			doi: "10.1056/NEJMoa1812792",
		},
	],

	tags: [
		"cardiovascular",
		"brain-health",
		"anti-inflammatory",
		"essential-fatty-acids",
		"evidence-based",
	],
	lastUpdated: "2024-01-15T10:00:00Z",
	createdAt: "2024-01-01T00:00:00Z",
	knowledgeNodeId: "omega-3-node",

	// Enhanced educational content
	educationalContent: {
		beginnerExplanation:
			"Omega-3 fatty acids are essential fats that your body cannot make on its own. They are crucial for heart and brain health.",
		polishBeginnerExplanation:
			"Kwasy tłuszczowe Omega-3 to niezbędne tłuszcze, których organizm nie może samodzielnie wyprodukować. Są kluczowe dla zdrowia serca i mózgu.",
		intermediateDetails:
			"EPA and DHA are the two most important omega-3s. EPA primarily supports heart health and reduces inflammation, while DHA is essential for brain function and development.",
		polishIntermediateDetails:
			"EPA i DHA to dwa najważniejsze omega-3. EPA głównie wspiera zdrowie serca i zmniejsza stany zapalne, podczas gdy DHA jest niezbędne dla funkcji i rozwoju mózgu.",
		expertAnalysis:
			"The therapeutic effects of omega-3s involve complex mechanisms including membrane incorporation, eicosanoid modulation, and gene expression changes affecting inflammation, lipid metabolism, and neuroplasticity.",
		polishExpertAnalysis:
			"Terapeutyczne działanie omega-3 obejmuje złożone mechanizmy, w tym wbudowanie w błony, modulację eikozanoidów i zmiany ekspresji genów wpływające na stany zapalne, metabolizm lipidów i neuroplastyczność.",
		keyTakeaways: [
			"Strong evidence for cardiovascular protection",
			"Moderate evidence for cognitive benefits",
			"Generally safe with minimal side effects",
			"Quality and purity are crucial factors",
		],
		polishKeyTakeaways: [
			"Silne dowody na ochronę sercowo-naczyniową",
			"Umiarkowane dowody na korzyści poznawcze",
			"Ogólnie bezpieczne z minimalnymi skutkami ubocznymi",
			"Jakość i czystość to kluczowe czynniki",
		],
	},

	clinicalEvidence: {
		totalStudies: 15000,
		metaAnalyses: 150,
		rctCount: 800,
		observationalStudies: 2000,
		lastReviewDate: "2024-01-01",
		cochranReviews: ["CD003177", "CD003205", "CD008331"],
	},

	pharmacokinetics: {
		absorption: {
			rate: "95% bioavailable when taken with fat",
			factors: ["Food intake", "Fat content", "Formulation type"],
			polishFactors: [
				"Spożycie pokarmu",
				"Zawartość tłuszczu",
				"Typ preparatu",
			],
			optimalTiming: "With meals containing fat",
			polishOptimalTiming: "Z posiłkami zawierającymi tłuszcz",
		},
		distribution: {
			volumeOfDistribution:
				"Widely distributed, concentrates in brain and retina",
			proteinBinding: "99% bound to plasma proteins",
			brainPenetration: true,
			placentalCrossing: true,
		},
		metabolism: {
			primaryPathway:
				"Beta-oxidation and incorporation into membrane phospholipids",
			polishPrimaryPathway: "Beta-oksydacja i wbudowanie w fosfolipidy błonowe",
			enzymes: ["Acyl-CoA synthetase", "Carnitine palmitoyltransferase"],
			metabolites: ["Resolvins", "Protectins", "Maresins"],
		},
		elimination: {
			halfLife: "EPA: 37 hours, DHA: 20 days (tissue)",
			excretionRoute: "Primarily metabolized, minimal renal excretion",
			renalClearance: "<5%",
		},
	},

	safetyProfile: {
		pregnancyCategory: "A",
		breastfeedingSafety: "Safe",
		pediatricUse: {
			approved: true,
			ageLimit: "Safe from birth",
			specialConsiderations: [
				"Age-appropriate dosing",
				"DHA more important than EPA in children",
			],
			polishSpecialConsiderations: [
				"Dawkowanie odpowiednie do wieku",
				"DHA ważniejsze niż EPA u dzieci",
			],
		},
		elderlyConsiderations: [
			"May need higher doses",
			"Monitor for drug interactions",
		],
		polishElderlyConsiderations: [
			"Mogą potrzebować wyższych dawek",
			"Monitorować interakcje lekowe",
		],
		hepaticImpairment: "No dose adjustment needed",
		polishHepaticImpairment: "Nie wymaga dostosowania dawki",
		renalImpairment: "No dose adjustment needed",
		polishRenalImpairment: "Nie wymaga dostosowania dawki",
	},

	qualityConsiderations: {
		standardization: "Look for IFOS certification, third-party testing",
		polishStandardization: "Szukać certyfikacji IFOS, testów zewnętrznych",
		bioavailabilityForms: [
			"Triglyceride form",
			"Ethyl ester",
			"Phospholipid form",
		],
		polishBioavailabilityForms: [
			"Forma triglicerydowa",
			"Ester etylowy",
			"Forma fosfolipidowa",
		],
		qualityMarkers: ["Oxidation levels (TOTOX)", "Heavy metals", "PCB content"],
		polishQualityMarkers: [
			"Poziomy utlenienia (TOTOX)",
			"Metale ciężkie",
			"Zawartość PCB",
		],
		storageRequirements: "Cool, dark place; refrigeration recommended",
		polishStorageRequirements:
			"Chłodne, ciemne miejsce; zalecane przechowywanie w lodówce",
		shelfLife: "2-3 years unopened, 3-6 months after opening",
	},

	economicData: {
		averageCostPerMonth: {
			low: 15,
			average: 35,
			high: 80,
			currency: "EUR",
		},
		costEffectivenessRating: "Excellent",
		polishCostEffectivenessRating: "Doskonała",
		valueProposition:
			"High-quality omega-3 supplements offer excellent value for cardiovascular and cognitive health benefits",
		polishValueProposition:
			"Wysokiej jakości suplementy omega-3 oferują doskonałą wartość dla korzyści sercowo-naczyniowych i poznawczych",
	},
};
