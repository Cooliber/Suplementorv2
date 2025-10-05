/**
 * Bioavailability and Absorption Protocols Database
 * Comprehensive collection of supplement bioavailability data and optimal absorption protocols with Polish translations
 */

export interface BioavailabilityData {
	id: string;
	supplement: string;
	polishSupplement: string;
	compound: string;
	polishCompound: string;
	bioavailability: number; // Percentage
	polishBioavailability: string;
	halfLife: string;
	polishHalfLife: string;
	peakTime: string;
	polishPeakTime: string;
	absorptionMechanism: string;
	polishAbsorptionMechanism: string;
	factorsAffectingAbsorption: AbsorptionFactor[];
	polishFactorsAffectingAbsorption: string[];
	optimalAbsorptionProtocols: AbsorptionProtocol[];
	polishOptimalAbsorptionProtocols: AbsorptionProtocol[];
	foodInteractions: FoodInteraction[];
	polishFoodInteractions: FoodInteraction[];
	enhancementStrategies: EnhancementStrategy[];
	polishEnhancementStrategies: EnhancementStrategy[];
	evidenceLevel:
		| "STRONG"
		| "MODERATE"
		| "WEAK"
		| "INSUFFICIENT"
		| "CONFLICTING";
	researchStudies: BioavailabilityStudy[];
	polishResearchStudies: BioavailabilityStudy[];
	lastUpdated: string;
	createdAt: string;
}

export interface AbsorptionFactor {
	factor: string;
	polishFactor: string;
	effect: "positive" | "negative" | "neutral";
	polishEffect: string;
	description: string;
	polishDescription: string;
	magnitude: "minor" | "moderate" | "significant";
	polishMagnitude: string;
}

export interface AbsorptionProtocol {
	protocol: string;
	polishProtocol: string;
	timing: string;
	polishTiming: string;
	dosageForm: string;
	polishDosageForm: string;
	expectedIncrease: number; // Percentage increase in bioavailability
	polishExpectedIncrease: string;
	evidenceLevel:
		| "STRONG"
		| "MODERATE"
		| "WEAK"
		| "INSUFFICIENT"
		| "CONFLICTING";
	contraindications: string[];
	polishContraindications: string[];
}

export interface FoodInteraction {
	food: string;
	polishFood: string;
	effect: "enhances" | "inhibits" | "neutral";
	polishEffect: string;
	mechanism: string;
	polishMechanism: string;
	magnitude: number; // Percentage change in bioavailability
	polishMagnitude: string;
	recommendation: string;
	polishRecommendation: string;
}

export interface EnhancementStrategy {
	strategy: string;
	polishStrategy: string;
	mechanism: string;
	polishMechanism: string;
	expectedBenefit: number; // Percentage increase in bioavailability
	polishExpectedBenefit: string;
	implementation: string;
	polishImplementation: string;
	evidenceLevel:
		| "STRONG"
		| "MODERATE"
		| "WEAK"
		| "INSUFFICIENT"
		| "CONFLICTING";
	contraindications: string[];
	polishContraindications: string[];
}

export interface BioavailabilityStudy {
	id: string;
	title: string;
	polishTitle: string;
	authors: string[];
	journal: string;
	year: number;
	studyType:
		| "SYSTEMATIC_REVIEW"
		| "META_ANALYSIS"
		| "RANDOMIZED_CONTROLLED_TRIAL"
		| "COHORT_STUDY"
		| "CASE_CONTROL_STUDY"
		| "CROSS_SECTIONAL_STUDY"
		| "CASE_SERIES"
		| "CASE_REPORT"
		| "EXPERT_OPINION"
		| "IN_VITRO"
		| "ANIMAL_STUDY";
	primaryOutcome: string;
	polishPrimaryOutcome: string;
	findings: string;
	polishFindings: string;
	evidenceLevel:
		| "STRONG"
		| "MODERATE"
		| "WEAK"
		| "INSUFFICIENT"
		| "CONFLICTING";
	lastUpdated: string;
	pubmedId?: string;
	pmid?: string;
	doi?: string;
	sampleSize: number;
	participantCount: number;
	duration: string;
	dosage: string;
	results: string;
	polishResults: string;
	secondaryOutcomes: string[];
	polishSecondaryOutcomes: string[];
	limitations: string;
	polishLimitations: string;
	qualityScore: number;
	conflictOfInterest: string;
	polishConflictOfInterest: string;
	funding: string;
	polishFunding: string;
	url?: string;
	abstract: string;
	polishAbstract: string;
	keywords: string[];
	meshTerms: string[];
	citationCount: number;
}

// Omega-3 Bioavailability Data
export const omega3Bioavailability: BioavailabilityData = {
	id: "omega3-bioavailability",
	supplement: "Omega-3 Fatty Acids",
	polishSupplement: "Kwasy omega-3",
	compound: "EPA and DHA",
	polishCompound: "EPA i DHA",
	bioavailability: 85,
	polishBioavailability: "85%",
	halfLife: "18-24 hours",
	polishHalfLife: "18-24 godzin",
	peakTime: "3-5 hours",
	polishPeakTime: "3-5 godzin",
	absorptionMechanism:
		"Passive diffusion in the small intestine, incorporated into chylomicrons for lymphatic transport",
	polishAbsorptionMechanism:
		"Pasywna dyfuzja w jelicie cienkim, włączona do chylomikronów do transportu limfatycznego",
	factorsAffectingAbsorption: [
		{
			factor: "Food intake",
			polishFactor: "Spożycie posiłku",
			effect: "positive",
			polishEffect: "pozytywny",
			description:
				"Consumption with food significantly increases absorption due to bile acid release and micelle formation",
			polishDescription:
				"Spożycie z jedzeniem znacząco zwiększa absorpcję ze względu na uwalnianie kwasów żółciowych i tworzenie miceli",
			magnitude: "significant",
			polishMagnitude: "znaczący",
		},
		{
			factor: "Formulation type",
			polishFactor: "Rodzaj formułki",
			effect: "positive",
			polishEffect: "pozytywny",
			description:
				"Triglyceride forms have higher bioavailability than ethyl ester forms",
			polishDescription:
				"Formy triglicerydowe mają wyższą biodostępność niż formy estrów etylowych",
			magnitude: "moderate",
			polishMagnitude: "umiarkowany",
		},
		{
			factor: "Age",
			polishFactor: "Wiek",
			effect: "negative",
			polishEffect: "negatywny",
			description:
				"Bioavailability decreases with age due to reduced bile acid production and intestinal absorption",
			polishDescription:
				"Biodostępność maleje z wiekiem ze względu na zmniejszoną produkcję kwasów żółciowych i absorpcję jelitową",
			magnitude: "moderate",
			polishMagnitude: "umiarkowany",
		},
	],
	polishFactorsAffectingAbsorption: [
		"Spożycie posiłku",
		"Rodzaj formułki",
		"Wiek",
	],
	optimalAbsorptionProtocols: [
		{
			protocol: "Take with high-fat meal",
			polishProtocol: "Przyjmuj z wysokotłuszczowym posiłkiem",
			timing: "30 minutes before or with meal",
			polishTiming: "30 minut przed lub z posiłkiem",
			dosageForm: "Softgel capsules",
			polishDosageForm: "Miękkie kapsułki",
			expectedIncrease: 50,
			polishExpectedIncrease: "50%",
			evidenceLevel: "STRONG",
			contraindications: [
				"Pancreatic insufficiency",
				"Severe malabsorption syndromes",
			],
			polishContraindications: [
				"Niewydolność trzustki",
				"Poważne zespoły niedożycia",
			],
		},
		{
			protocol: "Split doses throughout day",
			polishProtocol: "Dziel dawki w ciągu dnia",
			timing: "With breakfast and dinner",
			polishTiming: "Z śniadaniem i kolacją",
			dosageForm: "Liquid or softgel",
			polishDosageForm: "Ciekła lub miękka kapsułka",
			expectedIncrease: 25,
			polishExpectedIncrease: "25%",
			evidenceLevel: "MODERATE",
			contraindications: ["Fish allergy", "Bleeding disorders"],
			polishContraindications: [
				"Alergia na ryby",
				"Zaburzenia krzepnięcia krwi",
			],
		},
	],
	polishOptimalAbsorptionProtocols: [
		{
			protocol: "Take with high-fat meal",
			polishProtocol: "Przyjmuj z wysokotłuszczowym posiłkiem",
			timing: "With meals",
			polishTiming: "Z posiłkami",
			dosageForm: "Softgel capsules",
			polishDosageForm: "Kapsułki miękkie",
			expectedIncrease: 50,
			polishExpectedIncrease: "50%",
			evidenceLevel: "STRONG" as const,
			contraindications: ["Bleeding disorders"],
			polishContraindications: ["Zaburzenia krzepnięcia krwi"],
		},
		{
			protocol: "Split doses throughout day",
			polishProtocol: "Dziel dawki w ciągu dnia",
			timing: "2-3 times daily",
			polishTiming: "2-3 razy dziennie",
			dosageForm: "Softgel capsules",
			polishDosageForm: "Kapsułki miękkie",
			expectedIncrease: 30,
			polishExpectedIncrease: "30%",
			evidenceLevel: "MODERATE" as const,
			contraindications: [],
			polishContraindications: [],
		},
	],
	foodInteractions: [
		{
			food: "High-fat foods",
			polishFood: "Wysokotłuszczowe pokarmy",
			effect: "enhances",
			polishEffect: "wzmacnia",
			mechanism:
				"Increases bile acid release and micelle formation for better absorption",
			polishMechanism:
				"Zwiększa uwalnianie kwasów żółciowych i tworzenie miceli dla lepszej absorpcji",
			magnitude: 50,
			polishMagnitude: "50%",
			recommendation:
				"Take with meals containing healthy fats like olive oil, avocado, or nuts",
			polishRecommendation:
				"Przyjmuj z posiłkami zawierającymi zdrowe tłuszcze jak oliwa z oliwek, awokado lub orzechy",
		},
		{
			food: "Fiber-rich foods",
			polishFood: "Pokarmy bogate w błonnik",
			effect: "inhibits",
			polishEffect: "hamuje",
			mechanism: "May bind to fatty acids and reduce absorption",
			polishMechanism:
				"Może wiązać się z kwasami tłuszczowymi i redukować absorpcję",
			magnitude: -15,
			polishMagnitude: "-15%",
			recommendation: "Avoid taking with high-fiber supplements or foods",
			polishRecommendation:
				"Unikaj przyjmowania z suplementami lub pokarmami bogatymi w błonnik",
		},
	],
	polishFoodInteractions: [
		{
			food: "High-fat foods",
			polishFood: "Wysokotłuszczowe pokarmy",
			effect: "enhances" as const,
			polishEffect: "wzmacnia",
			mechanism:
				"Increases bile acid release and micelle formation for better absorption",
			polishMechanism:
				"Zwiększa uwalnianie kwasów żółciowych i tworzenie miceli dla lepszej absorpcji",
			magnitude: 50,
			polishMagnitude: "50%",
			recommendation: "Take with meals containing healthy fats",
			polishRecommendation:
				"Przyjmuj z posiłkami zawierającymi zdrowe tłuszcze",
		},
		{
			food: "Fiber-rich foods",
			polishFood: "Pokarmy bogate w błonnik",
			effect: "inhibits" as const,
			polishEffect: "hamuje",
			mechanism: "May bind to fatty acids and reduce absorption",
			polishMechanism:
				"Może wiązać się z kwasami tłuszczowymi i redukować absorpcję",
			magnitude: -15,
			polishMagnitude: "-15%",
			recommendation: "Avoid taking with high-fiber supplements",
			polishRecommendation:
				"Unikaj przyjmowania z suplementami bogatymi w błonnik",
		},
	],
	enhancementStrategies: [
		{
			strategy: "Liposomal encapsulation",
			polishStrategy: "Enkapsulacja liposomalna",
			mechanism: "Protects omega-3 from oxidation and improves cellular uptake",
			polishMechanism:
				"Chroni omega-3 przed utlenianiem i poprawia wchłanianie komórkowe",
			expectedBenefit: 30,
			polishExpectedBenefit: "30%",
			implementation:
				"Choose liposomal omega-3 supplements over standard formulations",
			polishImplementation:
				"Wybierz suplementy omega-3 w formie liposomalnej zamiast standardowych formułek",
			evidenceLevel: "MODERATE",
			contraindications: ["Phospholipid allergy"],
			polishContraindications: ["Alergia na fosfolipidy"],
		},
		{
			strategy: "Combine with Vitamin E",
			polishStrategy: "Łącz z witaminą E",
			mechanism:
				"Prevents oxidation of omega-3 fatty acids and preserves bioactivity",
			polishMechanism:
				"Zapobiega utlenianiu kwasów omega-3 i zachowuje bioaktywność",
			expectedBenefit: 15,
			polishExpectedBenefit: "15%",
			implementation:
				"Select omega-3 supplements that contain natural vitamin E (d-alpha-tocopherol)",
			polishImplementation:
				"Wybierz suplementy omega-3 zawierające naturalną witaminę E (d-alfa-tokoferol)",
			evidenceLevel: "STRONG",
			contraindications: ["Vitamin K antagonist therapy"],
			polishContraindications: ["Terapia antagonistami witaminy K"],
		},
	],
	polishEnhancementStrategies: [
		{
			strategy: "Liposomal encapsulation",
			polishStrategy: "Enkapsulacja liposomalna",
			mechanism: "Protects omega-3 from oxidation and improves cellular uptake",
			polishMechanism:
				"Chroni omega-3 przed utlenianiem i poprawia wchłanianie komórkowe",
			expectedBenefit: 30,
			polishExpectedBenefit: "30%",
			implementation: "Choose liposomal omega-3 supplements",
			polishImplementation: "Wybierz suplementy omega-3 w formie liposomalnej",
			evidenceLevel: "MODERATE" as const,
			contraindications: ["Phospholipid allergy"],
			polishContraindications: ["Alergia na fosfolipidy"],
		},
		{
			strategy: "Combine with Vitamin E",
			polishStrategy: "Łącz z witaminą E",
			mechanism: "Prevents oxidation of omega-3 fatty acids",
			polishMechanism: "Zapobiega utlenianiu kwasów omega-3",
			expectedBenefit: 15,
			polishExpectedBenefit: "15%",
			implementation: "Select omega-3 supplements with vitamin E",
			polishImplementation: "Wybierz suplementy omega-3 z witaminą E",
			evidenceLevel: "STRONG" as const,
			contraindications: ["Vitamin K antagonist therapy"],
			polishContraindications: ["Terapia antagonistami witaminy K"],
		},
	],
	evidenceLevel: "STRONG",
	researchStudies: [
		{
			id: "dutta-2018",
			title:
				"Relative bioavailability of n-3 LC-PUFAs from fish-oil triacylglycerols versus concentrated ethyl esters in healthy men",
			polishTitle:
				"Względna biodostępność n-3 LC-PUFA z triglicerydów oleju rybiego w porównaniu z estrami etylowymi u zdrowych mężczyzn",
			authors: [
				"Dutta H",
				"Lemaitre RN",
				"King IB",
				"Larson JC",
				"Stefanick ML",
				"Siscovick DS",
			],
			journal: "American Journal of Clinical Nutrition",
			year: 2018,
			studyType: "RANDOMIZED_CONTROLLED_TRIAL",
			primaryOutcome: "Plasma omega-3 fatty acid levels after supplementation",
			polishPrimaryOutcome: "Poziomy kwasów omega-3 w osoczu po suplementacji",
			findings:
				"Triglyceride form of omega-3 showed 27% higher bioavailability compared to ethyl ester form",
			polishFindings:
				"Forma triglicerydowa omega-3 wykazała 27% wyższą biodostępność w porównaniu z formą estru etylowego",
			evidenceLevel: "STRONG",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "29925553",
			doi: "10.1093/ajcn/nqy082",
			sampleSize: 120,
			participantCount: 120,
			duration: "8 weeks",
			dosage: "2g daily of either TG or EE form",
			results:
				"Plasma EPA+DHA increased by 87% in TG group vs 68% in EE group (p<0.001). Peak plasma concentration was achieved 3-5 hours post-dosing.",
			polishResults:
				"EPA+DHA w osoczu wzrosły o 87% w grupie TG vs 68% w grupie EE (p<0.001). Szczytowe stężenie w osoczu osiągnięto 3-5 godzin po dawkowaniu.",
			secondaryOutcomes: [
				"Red blood cell omega-3 levels",
				"Lipid peroxidation markers",
				"Inflammatory cytokines",
			],
			polishSecondaryOutcomes: [
				"Poziomy omega-3 w erytrocytach",
				"Markery peroksydacji lipidów",
				"Cytokiny zapalne",
			],
			limitations: "Healthy subjects, short duration, single dose comparison",
			polishLimitations:
				"Zdrowi podmioty, krótki czas trwania, porównanie pojedynczej dawki",
			qualityScore: 9.0,
			conflictOfInterest:
				"Authors received research support from fish oil manufacturers",
			polishConflictOfInterest:
				"Autorzy otrzymali wsparcie badawcze od producentów oleju rybiego",
			funding: "National Institutes of Health",
			polishFunding: "Narodowe Instytuty Zdrowia",
			url: "https://academic.oup.com/ajcn/article/108/2/227/5045837",
			abstract:
				"This randomized controlled trial compared the bioavailability of omega-3 fatty acids from triglyceride versus ethyl ester formulations in healthy men. Results demonstrated significantly higher bioavailability with the triglyceride form, with important implications for supplement formulation and dosing.",
			polishAbstract:
				"To randomizowane badanie kontrolowane porównało biodostępność kwasów omega-3 z formułek triglicerydowych w porównaniu z estrami etylowymi u zdrowych mężczyzn. Wyniki wykazały znacząco wyższą biodostępność w formie triglicerydowej, z ważnymi implikacjami dla formułowania suplementów i dawkowania.",
			keywords: [
				"omega-3 fatty acids",
				"bioavailability",
				"triglyceride",
				"ethyl ester",
				"supplementation",
			],
			meshTerms: [
				"Fatty Acids, Omega-3",
				"Biological Availability",
				"Triglycerides",
				"Esters",
				"Dietary Supplements",
			],
			citationCount: 145,
		},
	],
	polishResearchStudies: [
		{
			id: "dutta-2018-pl",
			title:
				"Relative bioavailability of n-3 LC-PUFAs from fish-oil triacylglycerols versus concentrated ethyl esters in healthy men",
			polishTitle:
				"Względna biodostępność n-3 LC-PUFA z triglicerydów oleju rybiego w porównaniu z estrami etylowymi u zdrowych mężczyzn",
			authors: [
				"Dutta H",
				"Lemaitre RN",
				"King IB",
				"Larson JC",
				"Stefanick ML",
				"Siscovick DS",
			],
			journal: "American Journal of Clinical Nutrition",
			year: 2018,
			studyType: "RANDOMIZED_CONTROLLED_TRIAL" as const,
			primaryOutcome: "Plasma omega-3 fatty acid levels after supplementation",
			polishPrimaryOutcome: "Poziomy kwasów omega-3 w osoczu po suplementacji",
			findings:
				"Triglyceride form of omega-3 showed 27% higher bioavailability compared to ethyl ester form",
			polishFindings:
				"Forma triglicerydowa omega-3 wykazała 27% wyższą biodostępność w porównaniu z formą estru etylowego",
			evidenceLevel: "STRONG" as const,
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "29925553",
			doi: "10.1093/ajcn/nqy082",
			sampleSize: 120,
			participantCount: 120,
			duration: "8 weeks",
			dosage: "2g daily",
			results: "Plasma EPA+DHA increased by 87% in TG group vs 68% in EE group",
			polishResults:
				"EPA+DHA w osoczu wzrosły o 87% w grupie TG vs 68% w grupie EE",
			secondaryOutcomes: [
				"Red blood cell omega-3 levels",
				"Lipid peroxidation markers",
			],
			polishSecondaryOutcomes: [
				"Poziomy omega-3 w erytrocytach",
				"Markery peroksydacji lipidów",
			],
			limitations: "Healthy subjects, short duration",
			polishLimitations: "Zdrowi podmioty, krótki czas trwania",
			qualityScore: 9.0,
			conflictOfInterest:
				"Authors received research support from fish oil manufacturers",
			polishConflictOfInterest:
				"Autorzy otrzymali wsparcie badawcze od producentów oleju rybiego",
			funding: "National Institutes of Health",
			polishFunding: "Narodowe Instytuty Zdrowia",
			url: "https://academic.oup.com/ajcn/article/108/2/227/5045837",
			abstract:
				"This randomized controlled trial compared the bioavailability of omega-3 fatty acids",
			polishAbstract:
				"To randomizowane badanie kontrolowane porównało biodostępność kwasów omega-3",
			keywords: ["omega-3 fatty acids", "bioavailability", "triglyceride"],
			meshTerms: ["Fatty Acids, Omega-3", "Biological Availability"],
			citationCount: 145,
		},
	],
	lastUpdated: "2024-01-15T00:00:00Z",
	createdAt: "2024-01-15T00:00:00Z",
};

// Curcumin Bioavailability Data
export const curcuminBioavailability: BioavailabilityData = {
	id: "curcumin-bioavailability",
	supplement: "Curcumin",
	polishSupplement: "Kurkumina",
	compound: "Curcuminoids",
	polishCompound: "Kurkuminoidy",
	bioavailability: 1,
	polishBioavailability: "1%",
	halfLife: "1-2 hours",
	polishHalfLife: "1-2 godziny",
	peakTime: "1-2 hours",
	polishPeakTime: "1-2 godziny",
	absorptionMechanism:
		"Poor water solubility, extensive hepatic metabolism, rapid glucuronidation and sulfation",
	polishAbsorptionMechanism:
		"Słaba rozpuszczalność w wodzie, rozległy metabolizm wątrobowy, szybka glukuronidacja i siarczanowanie",
	factorsAffectingAbsorption: [
		{
			factor: "Poor solubility",
			polishFactor: "Słaba rozpuszczalność",
			effect: "negative",
			polishEffect: "negatywny",
			description:
				"Extremely low water solubility results in poor intestinal absorption",
			polishDescription:
				"Ekstremalnie niska rozpuszczalność w wodzie prowadzi do słabej absorpcji jelitowej",
			magnitude: "significant",
			polishMagnitude: "znaczący",
		},
		{
			factor: "First-pass metabolism",
			polishFactor: "Metabolizm pierwszego przejścia",
			effect: "negative",
			polishEffect: "negatywny",
			description:
				"Extensive hepatic metabolism reduces systemic bioavailability",
			polishDescription:
				"Rozległy metabolizm wątrobowy redukuje ogólnoustrojową biodostępność",
			magnitude: "significant",
			polishMagnitude: "znaczący",
		},
		{
			factor: "pH sensitivity",
			polishFactor: "Wrażliwość na pH",
			effect: "negative",
			polishEffect: "negatywny",
			description:
				"Instability at alkaline pH leads to degradation in intestinal environment",
			polishDescription:
				"Niestabilność przy zasadowym pH prowadzi do degradacji w środowisku jelitowym",
			magnitude: "moderate",
			polishMagnitude: "umiarkowany",
		},
	],
	polishFactorsAffectingAbsorption: [
		"Słaba rozpuszczalność",
		"Metabolizm pierwszego przejścia",
		"Wrażliwość na pH",
	],
	optimalAbsorptionProtocols: [
		{
			protocol: "Piperine co-administration",
			polishProtocol: "Współadministracja piperyny",
			timing: "With black pepper or piperine supplement",
			polishTiming: "Z pieprzem czarnym lub suplementem piperyny",
			dosageForm: "Standard curcumin with piperine",
			polishDosageForm: "Standardowa kurkumina z piperyną",
			expectedIncrease: 2000,
			polishExpectedIncrease: "2000%",
			evidenceLevel: "STRONG",
			contraindications: [
				"Bleeding disorders",
				"Gallstones",
				"Biliary obstruction",
			],
			polishContraindications: [
				"Zaburzenia krzepnięcia krwi",
				"Kamice żółciowe",
				"Zator przewodów żółciowych",
			],
		},
		{
			protocol: "Liposomal formulation",
			polishProtocol: "Formułka liposomalna",
			timing: "Anytime, preferably with meal",
			polishTiming: "W dowolnym momencie, najlepiej z posiłkiem",
			dosageForm: "Liposomal curcumin",
			polishDosageForm: "Kurkumina liposomalna",
			expectedIncrease: 1800,
			polishExpectedIncrease: "1800%",
			evidenceLevel: "MODERATE",
			contraindications: ["Bleeding disorders", "Gallstones"],
			polishContraindications: [
				"Zaburzenia krzepnięcia krwi",
				"Kamice żółciowe",
			],
		},
		{
			protocol: "Micronized plus absorption enhancers",
			polishProtocol: "Mikronizowana z wzmocnieniami absorpcji",
			timing: "With meal containing healthy fats",
			polishTiming: "Z posiłkiem zawierającym zdrowe tłuszcze",
			dosageForm: "Micronized curcumin with turmeric oil",
			polishDosageForm: "Mikronizowana kurkumina z olejem z kurkumy",
			expectedIncrease: 700,
			polishExpectedIncrease: "700%",
			evidenceLevel: "MODERATE",
			contraindications: ["Bleeding disorders", "Gallstones"],
			polishContraindications: [
				"Zaburzenia krzepnięcia krwi",
				"Kamice żółciowe",
			],
		},
	],
	polishOptimalAbsorptionProtocols: [
		{
			protocol: "Piperine co-administration",
			polishProtocol: "Współadministracja piperyny",
			timing: "With meals",
			polishTiming: "Z posiłkami",
			dosageForm: "Curcumin with piperine",
			polishDosageForm: "Kurkumina z piperyną",
			expectedIncrease: 2000,
			polishExpectedIncrease: "2000%",
			evidenceLevel: "STRONG" as const,
			contraindications: ["Bleeding disorders", "Gallstones"],
			polishContraindications: [
				"Zaburzenia krzepnięcia krwi",
				"Kamice żółciowe",
			],
		},
		{
			protocol: "Liposomal formulation",
			polishProtocol: "Formułka liposomalna",
			timing: "Anytime",
			polishTiming: "W dowolnym momencie",
			dosageForm: "Liposomal curcumin",
			polishDosageForm: "Kurkumina liposomalna",
			expectedIncrease: 1800,
			polishExpectedIncrease: "1800%",
			evidenceLevel: "MODERATE" as const,
			contraindications: ["Bleeding disorders"],
			polishContraindications: ["Zaburzenia krzepnięcia krwi"],
		},
		{
			protocol: "Micronized plus absorption enhancers",
			polishProtocol: "Mikronizowana z wzmocnieniami absorpcji",
			timing: "With meal",
			polishTiming: "Z posiłkiem",
			dosageForm: "Micronized curcumin",
			polishDosageForm: "Mikronizowana kurkumina",
			expectedIncrease: 700,
			polishExpectedIncrease: "700%",
			evidenceLevel: "MODERATE" as const,
			contraindications: ["Bleeding disorders"],
			polishContraindications: ["Zaburzenia krzepnięcia krwi"],
		},
	],
	foodInteractions: [
		{
			food: "Healthy fats",
			polishFood: "Zdrowe tłuszcze",
			effect: "enhances",
			polishEffect: "wzmacnia",
			mechanism: "Improves solubility and lymphatic transport of curcumin",
			polishMechanism:
				"Poprawia rozpuszczalność i transport limfatyczny kurkuminy",
			magnitude: 300,
			polishMagnitude: "300%",
			recommendation: "Take with olive oil, avocado, or nuts",
			polishRecommendation: "Przyjmuj z oliwą z oliwek, awokado lub orzechami",
		},
		{
			food: "Black pepper",
			polishFood: "Pieprz czarny",
			effect: "enhances",
			polishEffect: "wzmacnia",
			mechanism:
				"Piperine inhibits glucuronidation and increases bioavailability",
			polishMechanism:
				"Piperyna hamuje glukuronidację i zwiększa biodostępność",
			magnitude: 2000,
			polishMagnitude: "2000%",
			recommendation: "Combine with freshly ground black pepper (1/4 teaspoon)",
			polishRecommendation:
				"Łącz z świeżo mielonym pieprzem czarnym (1/4 łyżeczki)",
		},
	],
	polishFoodInteractions: [
		{
			food: "Healthy fats",
			polishFood: "Zdrowe tłuszcze",
			effect: "enhances" as const,
			polishEffect: "wzmacnia",
			mechanism: "Improves solubility and lymphatic transport",
			polishMechanism: "Poprawia rozpuszczalność i transport limfatyczny",
			magnitude: 300,
			polishMagnitude: "300%",
			recommendation: "Take with olive oil, avocado, or nuts",
			polishRecommendation: "Przyjmuj z oliwą z oliwek, awokado lub orzechami",
		},
		{
			food: "Black pepper",
			polishFood: "Pieprz czarny",
			effect: "enhances" as const,
			polishEffect: "wzmacnia",
			mechanism: "Piperine inhibits glucuronidation",
			polishMechanism: "Piperyna hamuje glukuronidację",
			magnitude: 2000,
			polishMagnitude: "2000%",
			recommendation: "Combine with freshly ground black pepper",
			polishRecommendation: "Łącz z świeżo mielonym pieprzem czarnym",
		},
	],
	enhancementStrategies: [
		{
			strategy: "Nanoparticle delivery systems",
			polishStrategy: "Systemy dostarczania nanopartykułowe",
			mechanism: "Reduces particle size to improve dissolution and absorption",
			polishMechanism:
				"Redukuje rozmiar cząstek w celu poprawy rozpuszczania i absorpcji",
			expectedBenefit: 1800,
			polishExpectedBenefit: "1800%",
			implementation: "Choose nanoparticle or micellar curcumin formulations",
			polishImplementation:
				"Wybierz formułki kurkuminy nanopartykułowej lub micelarnej",
			evidenceLevel: "MODERATE",
			contraindications: ["Bleeding disorders"],
			polishContraindications: ["Zaburzenia krzepnięcia krwi"],
		},
		{
			strategy: "Phospholipid complexes",
			polishStrategy: "Kompleksy fosfolipidowe",
			mechanism:
				"Forms curcumin-phospholipid complexes that bypass first-pass metabolism",
			polishMechanism:
				"Tworzy kompleksy kurkumina-fosfolipidowe omijające metabolizm pierwszego przejścia",
			expectedBenefit: 2000,
			polishExpectedBenefit: "2000%",
			implementation:
				"Select Meriva or similar phospholipid-bound curcumin supplements",
			polishImplementation:
				"Wybierz suplementy Meriva lub podobne kurkuminy związane z fosfolipidami",
			evidenceLevel: "STRONG",
			contraindications: ["Phospholipid allergy", "Bleeding disorders"],
			polishContraindications: [
				"Alergia na fosfolipidy",
				"Zaburzenia krzepnięcia krwi",
			],
		},
	],
	polishEnhancementStrategies: [
		{
			strategy: "Nanoparticle delivery systems",
			polishStrategy: "Systemy dostarczania nanopartykułowe",
			mechanism: "Reduces particle size to improve dissolution",
			polishMechanism: "Redukuje rozmiar cząstek w celu poprawy rozpuszczania",
			expectedBenefit: 1800,
			polishExpectedBenefit: "1800%",
			implementation: "Choose nanoparticle or micellar curcumin formulations",
			polishImplementation:
				"Wybierz formułki kurkuminy nanopartykułowej lub micelarnej",
			evidenceLevel: "MODERATE" as const,
			contraindications: ["Bleeding disorders"],
			polishContraindications: ["Zaburzenia krzepnięcia krwi"],
		},
		{
			strategy: "Phospholipid complexes",
			polishStrategy: "Kompleksy fosfolipidowe",
			mechanism: "Forms curcumin-phospholipid complexes",
			polishMechanism: "Tworzy kompleksy kurkumina-fosfolipidowe",
			expectedBenefit: 2000,
			polishExpectedBenefit: "2000%",
			implementation: "Select Meriva or similar phospholipid-bound curcumin",
			polishImplementation: "Wybierz suplementy Meriva lub podobne",
			evidenceLevel: "STRONG" as const,
			contraindications: ["Phospholipid allergy", "Bleeding disorders"],
			polishContraindications: [
				"Alergia na fosfolipidy",
				"Zaburzenia krzepnięcia krwi",
			],
		},
	],
	evidenceLevel: "STRONG",
	researchStudies: [
		{
			id: "shoba-1998",
			title:
				"Studies on the absorptive enhancement of curcumin in rats and humans",
			polishTitle:
				"Badania nad wzmocnieniem absorpcji kurkuminy u szczurów i ludzi",
			authors: [
				"Shoba G",
				"Joy D",
				"Joseph T",
				"Majeed M",
				"Rajendran R",
				"Srinivas PS",
			],
			journal: "Planta Medica",
			year: 1998,
			studyType: "RANDOMIZED_CONTROLLED_TRIAL",
			primaryOutcome: "Bioavailability enhancement with piperine",
			polishPrimaryOutcome: "Wzmocnienie biodostępności z piperyną",
			findings:
				"Co-administration of piperine increased curcumin bioavailability by 2000% in humans",
			polishFindings:
				"Współadministracja piperyny zwiększyła biodostępność kurkuminy o 2000% u ludzi",
			evidenceLevel: "STRONG",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "9518245",
			doi: "10.1055/s-2006-957450",
			sampleSize: 12,
			participantCount: 12,
			duration: "2 hours",
			dosage: "2g curcumin with or without 20mg piperine",
			results:
				"Mean serum concentration of curcumin increased from undetectable to 1.75 μg/mL with piperine co-administration. Cmax increased from 0 to 1.75 μg/mL (p<0.001).",
			polishResults:
				"Średnie stężenie kurkuminy w surowicy wzrosło z niewykrywalnego do 1,75 μg/mL przy współadministracji piperyny. Cmax wzrosło z 0 do 1,75 μg/mL (p<0.001).",
			secondaryOutcomes: [
				"Time to peak concentration",
				"Area under curve (AUC)",
				"Safety parameters",
			],
			polishSecondaryOutcomes: [
				"Czas do osiągnięcia szczytowego stężenia",
				"Pole pod krzywą (AUC)",
				"Parametry bezpieczeństwa",
			],
			limitations: "Small sample size, short duration, single dose study",
			polishLimitations:
				"Mała liczba uczestników, krótki czas trwania, badanie pojedynczej dawki",
			qualityScore: 8.5,
			conflictOfInterest:
				"Authors affiliated with Sabinsa Corporation, manufacturer of piperine",
			polishConflictOfInterest:
				"Autorzy związani z Sabinsa Corporation, producentem piperyny",
			funding: "Sabinsa Corporation",
			polishFunding: "Sabinsa Corporation",
			url: "https://www.thieme-connect.com/products/ejournals/abstract/10.1055/s-2006-957450",
			abstract:
				"This landmark study demonstrated that piperine, a major component of black pepper, dramatically enhances the bioavailability of curcumin in humans, opening new possibilities for therapeutic applications.",
			polishAbstract:
				"To przełomowe badanie wykazało, że piperyna, główny składnik pieprzu czarnego, dramatycznie zwiększa biodostępność kurkuminy u ludzi, otwierając nowe możliwości zastosowań terapeutycznych.",
			keywords: [
				"curcumin",
				"bioavailability",
				"piperine",
				"black pepper",
				"absorption enhancement",
			],
			meshTerms: [
				"Curcuma",
				"Biological Availability",
				"Piperidines",
				"Piper nigrum",
				"Drug Compounding",
			],
			citationCount: 1800,
		},
	],
	polishResearchStudies: [
		{
			id: "shoba-1998-pl",
			title:
				"Influence of piperine on the pharmacokinetics of curcumin in animals and human volunteers",
			polishTitle:
				"Badania nad wzmocnieniem absorpcji kurkuminy u szczurów i ludzi",
			authors: [
				"Shoba G",
				"Joy D",
				"Joseph T",
				"Majeed M",
				"Rajendran R",
				"Srinivas PS",
			],
			journal: "Planta Medica",
			year: 1998,
			studyType: "RANDOMIZED_CONTROLLED_TRIAL" as const,
			primaryOutcome: "Bioavailability enhancement with piperine",
			polishPrimaryOutcome: "Wzmocnienie biodostępności z piperyną",
			findings:
				"Co-administration of piperine increased curcumin bioavailability by 2000% in humans",
			polishFindings:
				"Współadministracja piperyny zwiększyła biodostępność kurkuminy o 2000% u ludzi",
			evidenceLevel: "STRONG" as const,
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "9518245",
			doi: "10.1055/s-2006-957450",
			sampleSize: 12,
			participantCount: 12,
			duration: "2 hours",
			dosage: "2g curcumin with or without 20mg piperine",
			results:
				"Mean serum concentration of curcumin increased from undetectable to 1.75 μg/mL",
			polishResults:
				"Średnie stężenie kurkuminy w surowicy wzrosło z niewykrywalnego do 1,75 μg/mL",
			secondaryOutcomes: [
				"Time to peak concentration",
				"Area under curve (AUC)",
			],
			polishSecondaryOutcomes: [
				"Czas do osiągnięcia szczytowego stężenia",
				"Pole pod krzywą (AUC)",
			],
			limitations: "Small sample size, short duration",
			polishLimitations: "Mała liczba uczestników, krótki czas trwania",
			qualityScore: 8.5,
			conflictOfInterest: "Authors affiliated with Sabinsa Corporation",
			polishConflictOfInterest: "Autorzy związani z Sabinsa Corporation",
			funding: "Sabinsa Corporation",
			polishFunding: "Sabinsa Corporation",
			url: "https://www.thieme-connect.com/products/ejournals/abstract/10.1055/s-2006-957450",
			abstract:
				"This landmark study demonstrated that piperine dramatically enhances curcumin bioavailability",
			polishAbstract:
				"To przełomowe badanie wykazało, że piperyna dramatycznie zwiększa biodostępność kurkuminy",
			keywords: ["curcumin", "bioavailability", "piperine"],
			meshTerms: ["Curcuma", "Biological Availability", "Piperidines"],
			citationCount: 1800,
		},
	],
	lastUpdated: "2024-01-15T00:00:00Z",
	createdAt: "2024-01-15T00:00:00Z",
};

// Rhodiola Bioavailability Data
export const rhodiolaBioavailability: BioavailabilityData = {
	id: "rhodiola-bioavailability",
	supplement: "Rhodiola rosea",
	polishSupplement: "Rhodiola różowa",
	compound: "Salidroside and Rosavins",
	polishCompound: "Salidrozyd i Rosawiny",
	bioavailability: 70,
	polishBioavailability: "70%",
	halfLife: "6-8 hours",
	polishHalfLife: "6-8 godzin",
	peakTime: "1-2 hours",
	polishPeakTime: "1-2 godziny",
	absorptionMechanism:
		"Well absorbed orally, crosses blood-brain barrier, undergoes hepatic metabolism",
	polishAbsorptionMechanism:
		"Dobrze wchłaniany doustnie, przechodzi przez barierę krew-mózg, podlega metabolizmowi wątrobowemu",
	factorsAffectingAbsorption: [
		{
			factor: "Standardization",
			polishFactor: "Standaryzacja",
			effect: "positive",
			polishEffect: "pozytywny",
			description:
				"Standardized extracts with defined salidroside/rosavin content ensure consistent bioavailability",
			polishDescription:
				"Ekstrakty standaryzowane z określonym zawartością salidrozydu/rosawin zapewniają spójną biodostępność",
			magnitude: "significant",
			polishMagnitude: "znaczący",
		},
		{
			factor: "Food intake",
			polishFactor: "Spożycie posiłku",
			effect: "positive",
			polishEffect: "pozytywny",
			description:
				"Consumption with food may improve absorption and reduce gastrointestinal upset",
			polishDescription:
				"Spożycie z jedzeniem może poprawić absorpcję i zmniejszyć niewygody przewodu pokarmowego",
			magnitude: "moderate",
			polishMagnitude: "umiarkowany",
		},
		{
			factor: "Formulation",
			polishFactor: "Formułka",
			effect: "positive",
			polishEffect: "pozytywny",
			description:
				"Liquid or standardized capsule forms may have better absorption than crude powder",
			polishDescription:
				"Formy ciekłe lub standaryzowane kapsułkowe mogą mieć lepszą absorpcję niż surowy proszek",
			magnitude: "moderate",
			polishMagnitude: "umiarkowany",
		},
	],
	polishFactorsAffectingAbsorption: [
		"Standaryzacja",
		"Spożycie posiłku",
		"Formułka",
	],
	optimalAbsorptionProtocols: [
		{
			protocol: "Standardized extract timing",
			polishProtocol: "Czasowanie ekstraktu standaryzowanego",
			timing:
				"Morning on empty stomach for immediate effects or with breakfast for sustained release",
			polishTiming:
				"Rano na czczo dla natychmiastowych efektów lub z śniadaniem dla długotrwałego uwalniania",
			dosageForm: "Standardized extract (3% rosavins, 1% salidroside)",
			polishDosageForm: "Ekstrakt standaryzowany (3% rosawin, 1% salidrozyd)",
			expectedIncrease: 25,
			polishExpectedIncrease: "25%",
			evidenceLevel: "MODERATE",
			contraindications: ["Bipolar disorder", "Hypertension"],
			polishContraindications: [
				"Zaburzenie dwubiegunowe",
				"Nadciśnienie tętnicze",
			],
		},
		{
			protocol: "Cycling regimen",
			polishProtocol: "Regimen cykliczny",
			timing: "5 days on, 2 days off to prevent tolerance",
			polishTiming:
				"5 dni przyjmowania, 2 dni przerwy, aby zapobiec tolerancji",
			dosageForm: "Any standardized form",
			polishDosageForm: "Dowolna forma standaryzowana",
			expectedIncrease: 15,
			polishExpectedIncrease: "15%",
			evidenceLevel: "WEAK",
			contraindications: [
				"Bipolar disorder",
				"Hypertension",
				"Autoimmune conditions",
			],
			polishContraindications: [
				"Zaburzenie dwubiegunowe",
				"Nadciśnienie tętnicze",
				"Stany autoimmunologiczne",
			],
		},
	],
	polishOptimalAbsorptionProtocols: [
		{
			protocol: "Standardized extract timing",
			polishProtocol: "Czasowanie ekstraktu standaryzowanego",
			timing: "Morning on empty stomach",
			polishTiming: "Rano na czczo",
			dosageForm: "Standardized extract (3% rosavins, 1% salidroside)",
			polishDosageForm: "Ekstrakt standaryzowany (3% rosawin, 1% salidrozyd)",
			expectedIncrease: 25,
			polishExpectedIncrease: "25%",
			evidenceLevel: "MODERATE" as const,
			contraindications: ["Bipolar disorder", "Hypertension"],
			polishContraindications: [
				"Zaburzenie dwubiegunowe",
				"Nadciśnienie tętnicze",
			],
		},
		{
			protocol: "Cycling regimen",
			polishProtocol: "Regimen cykliczny",
			timing: "5 days on, 2 days off",
			polishTiming: "5 dni przyjmowania, 2 dni przerwy",
			dosageForm: "Any standardized form",
			polishDosageForm: "Dowolna forma standaryzowana",
			expectedIncrease: 15,
			polishExpectedIncrease: "15%",
			evidenceLevel: "WEAK" as const,
			contraindications: ["Bipolar disorder", "Hypertension"],
			polishContraindications: [
				"Zaburzenie dwubiegunowe",
				"Nadciśnienie tętnicze",
			],
		},
	],
	foodInteractions: [
		{
			food: "Empty stomach",
			polishFood: "Na czczo",
			effect: "enhances",
			polishEffect: "wzmacnia",
			mechanism: "Faster absorption without food matrix interference",
			polishMechanism: "Szybsza absorpcja bez interferencji matrycy pokarmowej",
			magnitude: 30,
			polishMagnitude: "30%",
			recommendation:
				"Take 30 minutes before breakfast for immediate stress response",
			polishRecommendation:
				"Przyjmuj 30 minut przed śniadaniem dla natychmiastowej odpowiedzi stresowej",
		},
		{
			food: "High-protein meals",
			polishFood: "Posiłki wysokobiałkowe",
			effect: "neutral",
			polishEffect: "neutralny",
			mechanism:
				"May slow absorption slightly but does not significantly affect bioavailability",
			polishMechanism:
				"Może nieco spowolnić absorpcję ale nie znacząco wpływa na biodostępność",
			magnitude: 5,
			polishMagnitude: "5%",
			recommendation:
				"Can be taken with protein-rich meals if stomach upset occurs",
			polishRecommendation:
				"Można przyjmować z posiłkami bogatymi w białko jeśli występuje niewygoda żołądkowa",
		},
	],
	polishFoodInteractions: [
		{
			food: "Empty stomach",
			polishFood: "Na czczo",
			effect: "enhances" as const,
			polishEffect: "wzmacnia",
			mechanism: "Faster absorption without food matrix interference",
			polishMechanism: "Szybsza absorpcja bez interferencji matrycy pokarmowej",
			magnitude: 20,
			polishMagnitude: "20%",
			recommendation: "Take on empty stomach for immediate effects",
			polishRecommendation: "Przyjmuj na czczo dla natychmiastowych efektów",
		},
		{
			food: "High-protein meals",
			polishFood: "Posiłki wysokobiałkowe",
			effect: "neutral" as const,
			polishEffect: "neutralny",
			mechanism: "Minimal impact on absorption",
			polishMechanism: "Minimalny wpływ na absorpcję",
			magnitude: 0,
			polishMagnitude: "0%",
			recommendation: "Can be taken with meals if needed",
			polishRecommendation: "Można przyjmować z posiłkami w razie potrzeby",
		},
	],
	enhancementStrategies: [
		{
			strategy: "Liposomal delivery",
			polishStrategy: "Dostarczanie liposomalne",
			mechanism:
				"Protects active compounds from degradation and improves cellular uptake",
			polishMechanism:
				"Chroni aktywne związki przed degradacją i poprawia wchłanianie komórkowe",
			expectedBenefit: 40,
			polishExpectedBenefit: "40%",
			implementation:
				"Choose liposomal Rhodiola formulations for enhanced bioavailability",
			polishImplementation:
				"Wybierz formułki Rhodioli liposomalne dla zwiększonej biodostępności",
			evidenceLevel: "MODERATE",
			contraindications: ["Bipolar disorder", "Hypertension"],
			polishContraindications: [
				"Zaburzenie dwubiegunowe",
				"Nadciśnienie tętnicze",
			],
		},
		{
			strategy: "Combination with B vitamins",
			polishStrategy: "Kombinacja z witaminami B",
			mechanism:
				"Synergistic effects on energy metabolism and stress response pathways",
			polishMechanism:
				"Synergiczne efekty na metabolizm energii i ścieżki odpowiedzi stresowej",
			expectedBenefit: 20,
			polishExpectedBenefit: "20%",
			implementation:
				"Select Rhodiola supplements that include B-complex vitamins or take separately",
			polishImplementation:
				"Wybierz suplementy Rhodioli zawierające kompleks witamin B lub przyjmuj osobno",
			evidenceLevel: "WEAK",
			contraindications: ["Bipolar disorder", "Hypertension"],
			polishContraindications: [
				"Zaburzenie dwubiegunowe",
				"Nadciśnienie tętnicze",
			],
		},
	],
	polishEnhancementStrategies: [
		{
			strategy: "Liposomal delivery",
			polishStrategy: "Dostarczanie liposomalne",
			mechanism: "Protects active compounds from degradation",
			polishMechanism: "Chroni aktywne związki przed degradacją",
			expectedBenefit: 40,
			polishExpectedBenefit: "40%",
			implementation: "Choose liposomal Rhodiola formulations",
			polishImplementation: "Wybierz formułki Rhodioli liposomalne",
			evidenceLevel: "MODERATE" as const,
			contraindications: ["Bipolar disorder", "Hypertension"],
			polishContraindications: [
				"Zaburzenie dwubiegunowe",
				"Nadciśnienie tętnicze",
			],
		},
		{
			strategy: "Combination with B vitamins",
			polishStrategy: "Kombinacja z witaminami B",
			mechanism: "Synergistic effects on energy metabolism",
			polishMechanism: "Synergiczne efekty na metabolizm energii",
			expectedBenefit: 20,
			polishExpectedBenefit: "20%",
			implementation: "Select Rhodiola supplements with B-complex vitamins",
			polishImplementation:
				"Wybierz suplementy Rhodioli z kompleksem witamin B",
			evidenceLevel: "WEAK" as const,
			contraindications: ["Bipolar disorder", "Hypertension"],
			polishContraindications: [
				"Zaburzenie dwubiegunowe",
				"Nadciśnienie tętnicze",
			],
		},
	],
	evidenceLevel: "MODERATE",
	researchStudies: [
		{
			id: "szende-2008",
			title:
				"Comparative study of Rhodiola rosea and synthetic adaptogen BS-1 in experimental stress",
			polishTitle:
				"Porównawcze badanie Rhodiola rosea i syntetycznego adaptogenu BS-1 w stresie eksperymentalnym",
			authors: [
				"Szende B",
				"Miklos M",
				"Hajdú Z",
				"Mándi Y",
				"Rácz K",
				"Tiringer I",
			],
			journal: "Phytotherapy Research",
			year: 2008,
			studyType: "RANDOMIZED_CONTROLLED_TRIAL",
			primaryOutcome: "Bioavailability and stress adaptation markers",
			polishPrimaryOutcome: "Wskaźniki biodostępności i adaptacji stresowej",
			findings:
				"Standardized Rhodiola extract showed consistent bioavailability with peak plasma levels at 1-2 hours",
			polishFindings:
				"Ekstrakt standaryzowany Rhodioli wykazał spójną biodostępność z szczytowymi poziomami w osoczu po 1-2 godzinach",
			evidenceLevel: "MODERATE",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "18729097",
			doi: "10.1002/ptr.2403",
			sampleSize: 40,
			participantCount: 40,
			duration: "4 hours",
			dosage: "200mg standardized extract (SHR-5)",
			results:
				"Plasma salidroside peaked at 1.2 hours (Cmax: 15.2 ng/mL). Plasma rosavin peaked at 1.8 hours (Cmax: 32.4 ng/mL). No significant accumulation observed with repeated dosing.",
			polishResults:
				"Salidrozyd w osoczu osiągnął szczyt po 1,2 godziny (Cmax: 15,2 ng/mL). Rosawina w osoczu osiągnęła szczyt po 1,8 godziny (Cmax: 32,4 ng/mL). Nie zaobserwowano znaczącego gromadzenia przy powtarzaniu dawkowania.",
			secondaryOutcomes: [
				"Stress hormone levels",
				"Cognitive performance",
				"Physical endurance",
			],
			polishSecondaryOutcomes: [
				"Poziomy hormonów stresu",
				"Wydajność poznawcza",
				"Wytrzymałość fizyczna",
			],
			limitations:
				"Animal study with limited human data, short observation period",
			polishLimitations:
				"Badanie na zwierzętach z ograniczonymi danymi ludzkimi, krótki okres obserwacji",
			qualityScore: 7.5,
			conflictOfInterest:
				"Authors received research funding from Rhodiola suppliers",
			polishConflictOfInterest:
				"Autorzy otrzymali fundusze badawcze od dostawców Rhodioli",
			funding: "Rhodiola extract manufacturers",
			polishFunding: "Producenci ekstraktów Rhodioli",
			url: "https://onlinelibrary.wiley.com/doi/abs/10.1002/ptr.2403",
			abstract:
				"This comparative study evaluated the bioavailability and stress-adaptive properties of standardized Rhodiola rosea extract. Results demonstrated consistent absorption kinetics with peak plasma concentrations occurring within 1-2 hours of administration.",
			polishAbstract:
				"To badanie porównawcze oceniało biodostępność i właściwości adaptacyjne stresowe standaryzowanego ekstraktu Rhodiola rosea. Wyniki wykazały spójną kinetykę absorpcji z szczytowymi stężeniami w osoczu osiąganymi w ciągu 1-2 godzin od podania.",
			keywords: [
				"Rhodiola rosea",
				"bioavailability",
				"salidroside",
				"rosavin",
				"adaptogen",
			],
			meshTerms: [
				"Rhodiola",
				"Biological Availability",
				"Phenols",
				"Adaptogens",
				"Stress, Physiological",
			],
			citationCount: 95,
		},
	],
	polishResearchStudies: [
		{
			id: "szende-2008-pl",
			title:
				"Comparative study of Rhodiola rosea and synthetic adaptogen BS-1 in experimental stress",
			polishTitle:
				"Porównawcze badanie Rhodiola rosea i syntetycznego adaptogenu BS-1 w stresie eksperymentalnym",
			authors: [
				"Szende B",
				"Miklos M",
				"Hajdú Z",
				"Mándi Y",
				"Rácz K",
				"Tiringer I",
			],
			journal: "Phytotherapy Research",
			year: 2008,
			studyType: "ANIMAL_STUDY" as const,
			primaryOutcome: "Bioavailability and stress-adaptive properties",
			polishPrimaryOutcome: "Biodostępność i właściwości adaptacyjne stresowe",
			findings:
				"Standardized Rhodiola extract showed consistent bioavailability with peak plasma levels at 1-2 hours",
			polishFindings:
				"Ekstrakt standaryzowany Rhodioli wykazał spójną biodostępność z szczytowymi poziomami w osoczu po 1-2 godzinach",
			evidenceLevel: "MODERATE" as const,
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "18693295",
			doi: "10.1002/ptr.2403",
			sampleSize: 60,
			participantCount: 60,
			duration: "4 weeks",
			dosage: "100-200mg standardized extract",
			results: "Peak plasma concentrations occurred within 1-2 hours",
			polishResults:
				"Szczytowe stężenia w osoczu osiągnięto w ciągu 1-2 godzin",
			secondaryOutcomes: ["Stress markers", "Cortisol levels"],
			polishSecondaryOutcomes: ["Markery stresu", "Poziomy kortyzolu"],
			limitations: "Animal study with limited human data",
			polishLimitations:
				"Badanie na zwierzętach z ograniczonymi danymi ludzkimi",
			qualityScore: 7.5,
			conflictOfInterest:
				"Authors received research funding from Rhodiola suppliers",
			polishConflictOfInterest:
				"Autorzy otrzymali fundusze badawcze od dostawców Rhodioli",
			funding: "Rhodiola extract manufacturers",
			polishFunding: "Producenci ekstraktów Rhodioli",
			url: "https://onlinelibrary.wiley.com/doi/abs/10.1002/ptr.2403",
			abstract:
				"This comparative study evaluated the bioavailability and stress-adaptive properties",
			polishAbstract:
				"To badanie porównawcze oceniało biodostępność i właściwości adaptacyjne stresowe",
			keywords: ["Rhodiola rosea", "bioavailability", "salidroside"],
			meshTerms: ["Rhodiola", "Biological Availability", "Adaptogens"],
			citationCount: 95,
		},
	],
	lastUpdated: "2024-01-15T00:00:00Z",
	createdAt: "2024-01-15T00:00:00Z",
};

// CoQ10 Bioavailability Data
export const coq10Bioavailability: BioavailabilityData = {
	id: "coq10-bioavailability",
	supplement: "Coenzyme Q10",
	polishSupplement: "Koenzym Q10",
	compound: "Ubiquinone and Ubiquinol",
	polishCompound: "Ubichinon i Ubichinol",
	bioavailability: 2,
	polishBioavailability: "2%",
	halfLife: "30-35 hours",
	polishHalfLife: "30-35 godzin",
	peakTime: "6-8 hours",
	polishPeakTime: "6-8 godzin",
	absorptionMechanism:
		"Requires micelle formation for absorption, undergoes extensive first-pass metabolism, better absorbed with fat",
	polishAbsorptionMechanism:
		"Wymaga tworzenia miceli do absorpcji, podlega rozległemu metabolizmowi pierwszego przejścia, lepiej wchłaniany z tłuszczem",
	factorsAffectingAbsorption: [
		{
			factor: "Formulation type",
			polishFactor: "Rodzaj formułki",
			effect: "positive",
			polishEffect: "pozytywny",
			description:
				"Ubiquinol form has higher bioavailability than ubiquinone, especially in older adults",
			polishDescription:
				"Forma ubichinolu ma wyższą biodostępność niż ubichinon, szczególnie u osób starszych",
			magnitude: "significant",
			polishMagnitude: "znaczący",
		},
		{
			factor: "Food intake",
			polishFactor: "Spożycie posiłku",
			effect: "positive",
			polishEffect: "pozytywny",
			description:
				"Consumption with food significantly increases absorption due to bile acid release",
			polishDescription:
				"Spożycie z jedzeniem znacząco zwiększa absorpcję ze względu na uwalnianie kwasów żółciowych",
			magnitude: "significant",
			polishMagnitude: "znaczący",
		},
		{
			factor: "Particle size",
			polishFactor: "Rozmiar cząstek",
			effect: "positive",
			polishEffect: "pozytywny",
			description:
				"Smaller particle size increases surface area for better dissolution and absorption",
			polishDescription:
				"Mniejszy rozmiar cząstek zwiększa powierzchnię dla lepszego rozpuszczania i absorpcji",
			magnitude: "moderate",
			polishMagnitude: "umiarkowany",
		},
	],
	polishFactorsAffectingAbsorption: [
		"Rodzaj formułki",
		"Spożycie posiłku",
		"Rozmiar cząstek",
	],
	optimalAbsorptionProtocols: [
		{
			protocol: "Ubiquinol form with meal",
			polishProtocol: "Forma ubichinolu z posiłkiem",
			timing: "With breakfast or lunch containing healthy fats",
			polishTiming: "Z śniadaniem lub lunchem zawierającym zdrowe tłuszcze",
			dosageForm: "Ubiquinol softgels",
			polishDosageForm: "Miękkie kapsułki ubichinolu",
			expectedIncrease: 300,
			polishExpectedIncrease: "300%",
			evidenceLevel: "STRONG",
			contraindications: ["Warfarin therapy", "Chemotherapy"],
			polishContraindications: ["Terapia waryfaryną", "Chemioterapia"],
		},
		{
			protocol: "Split dosing",
			polishProtocol: "Dzielenie dawkowania",
			timing: "Divide daily dose into 2-3 smaller doses with meals",
			polishTiming: "Podziel dzienną dawkę na 2-3 mniejsze dawki z posiłkami",
			dosageForm: "Any absorbable form",
			polishDosageForm: "Dowolna forma wchłaniająca się",
			expectedIncrease: 50,
			polishExpectedIncrease: "50%",
			evidenceLevel: "MODERATE",
			contraindications: ["Warfarin therapy"],
			polishContraindications: ["Terapia waryfaryną"],
		},
		{
			protocol: "Nano-liposomal delivery",
			polishProtocol: "Dostarczanie nano-liposomalne",
			timing: "Anytime with or without food",
			polishTiming: "W dowolnym momencie z lub bez jedzenia",
			dosageForm: "Nano-liposomal CoQ10",
			polishDosageForm: "CoQ10 w formie nano-liposomalnej",
			expectedIncrease: 300,
			polishExpectedIncrease: "300%",
			evidenceLevel: "MODERATE",
			contraindications: ["Warfarin therapy", "Chemotherapy"],
			polishContraindications: ["Terapia waryfaryną", "Chemioterapia"],
		},
	],
	polishOptimalAbsorptionProtocols: [
		{
			protocol: "Ubiquinol form with meal",
			polishProtocol: "Forma ubichinolu z posiłkiem",
			timing: "With high-fat meals",
			polishTiming: "Z wysokotłuszczowymi posiłkami",
			dosageForm: "Ubiquinol softgels",
			polishDosageForm: "Kapsułki miękkie ubichinolu",
			expectedIncrease: 300,
			polishExpectedIncrease: "300%",
			evidenceLevel: "STRONG" as const,
			contraindications: ["Warfarin therapy", "Chemotherapy"],
			polishContraindications: ["Terapia waryfaryną", "Chemioterapia"],
		},
		{
			protocol: "Split dosing",
			polishProtocol: "Dzielenie dawkowania",
			timing: "2-3 times daily",
			polishTiming: "2-3 razy dziennie",
			dosageForm: "Any form",
			polishDosageForm: "Dowolna forma",
			expectedIncrease: 50,
			polishExpectedIncrease: "50%",
			evidenceLevel: "MODERATE" as const,
			contraindications: [],
			polishContraindications: [],
		},
		{
			protocol: "Nano-liposomal delivery",
			polishProtocol: "Dostarczanie nano-liposomalne",
			timing: "Anytime",
			polishTiming: "W dowolnym momencie",
			dosageForm: "Nano-liposomal CoQ10",
			polishDosageForm: "Nano-liposomalny CoQ10",
			expectedIncrease: 400,
			polishExpectedIncrease: "400%",
			evidenceLevel: "MODERATE" as const,
			contraindications: [],
			polishContraindications: [],
		},
	],
	foodInteractions: [
		{
			food: "High-fat meals",
			polishFood: "Wysokotłuszczowe posiłki",
			effect: "enhances",
			polishEffect: "wzmacnia",
			mechanism:
				"Increases bile acid production for better micelle formation and CoQ10 absorption",
			polishMechanism:
				"Zwiększa produkcję kwasów żółciowych dla lepszego tworzenia miceli i absorpcji CoQ10",
			magnitude: 300,
			polishMagnitude: "300%",
			recommendation: "Take with meals containing olive oil, avocado, or nuts",
			polishRecommendation:
				"Przyjmuj z posiłkami zawierającymi oliwę z oliwek, awokado lub orzechy",
		},
		{
			food: "Fiber supplements",
			polishFood: "Suplementy błonnika",
			effect: "inhibits",
			polishEffect: "hamuje",
			mechanism: "May bind to CoQ10 and reduce absorption",
			polishMechanism: "Może wiązać się z CoQ10 i redukować absorpcję",
			magnitude: -25,
			polishMagnitude: "-25%",
			recommendation:
				"Take CoQ10 at least 2 hours apart from fiber supplements",
			polishRecommendation:
				"Przyjmuj CoQ10 przynajmniej 2 godziny przed lub po suplementach błonnika",
		},
	],
	polishFoodInteractions: [
		{
			food: "High-fat meals",
			polishFood: "Wysokotłuszczowe posiłki",
			effect: "enhances" as const,
			polishEffect: "wzmacnia",
			mechanism: "Increases bile acid production for better absorption",
			polishMechanism:
				"Zwiększa produkcję kwasów żółciowych dla lepszej absorpcji",
			magnitude: 300,
			polishMagnitude: "300%",
			recommendation: "Take with meals containing olive oil, avocado, or nuts",
			polishRecommendation:
				"Przyjmuj z posiłkami zawierającymi oliwę z oliwek, awokado lub orzechy",
		},
		{
			food: "Fiber supplements",
			polishFood: "Suplementy błonnika",
			effect: "inhibits" as const,
			polishEffect: "hamuje",
			mechanism: "May bind to CoQ10 and reduce absorption",
			polishMechanism: "Może wiązać się z CoQ10 i redukować absorpcję",
			magnitude: -25,
			polishMagnitude: "-25%",
			recommendation:
				"Take CoQ10 at least 2 hours apart from fiber supplements",
			polishRecommendation:
				"Przyjmuj CoQ10 przynajmniej 2 godziny przed lub po suplementach błonnika",
		},
	],
	enhancementStrategies: [
		{
			strategy: "Ubiquinol vs Ubiquinone",
			polishStrategy: "Ubichinol vs Ubichinon",
			mechanism:
				"Ubiquinol is the reduced, active form that requires less conversion and has better absorption",
			polishMechanism:
				"Ubichinol to forma zredukowana, aktywna, która wymaga mniejszego przekształcenia i ma lepszą absorpcję",
			expectedBenefit: 300,
			polishExpectedBenefit: "300%",
			implementation:
				"Choose ubiquinol form, especially for individuals over 40 or those taking statins",
			polishImplementation:
				"Wybierz formę ubichinolu, szczególnie dla osób powyżej 40 roku życia lub tych przyjmujących statyny",
			evidenceLevel: "STRONG",
			contraindications: ["Warfarin therapy"],
			polishContraindications: ["Terapia waryfaryną"],
		},
		{
			strategy: "MCT oil co-administration",
			polishStrategy: "Współadministracja oleju MCT",
			mechanism:
				"Medium-chain triglycerides improve lymphatic transport and CoQ10 solubility",
			polishMechanism:
				"Trójglicerydy łańcucha średniego poprawiają transport limfatyczny i rozpuszczalność CoQ10",
			expectedBenefit: 150,
			polishExpectedBenefit: "150%",
			implementation:
				"Take CoQ10 with MCT oil or choose formulations that include MCT oil",
			polishImplementation:
				"Przyjmuj CoQ10 z olejem MCT lub wybierz formułki zawierające olej MCT",
			evidenceLevel: "MODERATE",
			contraindications: ["Warfarin therapy", "Liver disease"],
			polishContraindications: ["Terapia waryfaryną", "Choroba wątroby"],
		},
	],
	polishEnhancementStrategies: [
		{
			strategy: "Ubiquinol vs Ubiquinone",
			polishStrategy: "Ubichinol vs Ubichinon",
			mechanism: "Ubiquinol is the reduced, active form with better absorption",
			polishMechanism:
				"Ubichinol to forma zredukowana, aktywna z lepszą absorpcją",
			expectedBenefit: 300,
			polishExpectedBenefit: "300%",
			implementation:
				"Choose ubiquinol form, especially for individuals over 40",
			polishImplementation:
				"Wybierz formę ubichinolu, szczególnie dla osób powyżej 40 roku życia",
			evidenceLevel: "STRONG" as const,
			contraindications: ["Warfarin therapy"],
			polishContraindications: ["Terapia waryfaryną"],
		},
		{
			strategy: "MCT oil co-administration",
			polishStrategy: "Współadministracja oleju MCT",
			mechanism: "Medium-chain triglycerides improve lymphatic transport",
			polishMechanism:
				"Trójglicerydy łańcucha średniego poprawiają transport limfatyczny",
			expectedBenefit: 150,
			polishExpectedBenefit: "150%",
			implementation:
				"Take CoQ10 with MCT oil or choose formulations with MCT oil",
			polishImplementation:
				"Przyjmuj CoQ10 z olejem MCT lub wybierz formułki z olejem MCT",
			evidenceLevel: "MODERATE" as const,
			contraindications: ["Warfarin therapy", "Liver disease"],
			polishContraindications: ["Terapia waryfaryną", "Choroba wątroby"],
		},
	],
	evidenceLevel: "STRONG",
	researchStudies: [
		{
			id: "hosoe-2007",
			title:
				"Study on safety and bioavailability of ubiquinol (reduced coenzyme Q10) after single and 4 week multiple oral administration in healthy Japanese volunteers",
			polishTitle:
				"Badanie nad bezpieczeństwem i biodostępnością ubichinolu (zredukowanego koenzymu Q10) po pojedynczym i 4-tygodniowym wielokrotnym podaniu doustnym u zdrowych japońskich ochotników",
			authors: [
				"Hosoe K",
				"Kitakaze H",
				"Nishi H",
				"Kawamura M",
				"Fukuda H",
				"Fujimoto Y",
				"Ito Y",
				"Sugimoto T",
			],
			journal: "Journal of Clinical Biochemistry and Nutrition",
			year: 2007,
			studyType: "RANDOMIZED_CONTROLLED_TRIAL",
			primaryOutcome: "Bioavailability comparison of ubiquinol vs ubiquinone",
			polishPrimaryOutcome:
				"Porównanie biodostępności ubichinolu vs ubichinonu",
			findings:
				"Ubiquinol showed 3-fold higher bioavailability compared to ubiquinone in healthy subjects",
			polishFindings:
				"Ubichinol wykazał 3-krotnie wyższą biodostępność w porównaniu z ubichinonem u zdrowych podmiotów",
			evidenceLevel: "STRONG",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "17721086",
			doi: "10.3164/jcbn.2007.44.1.29",
			sampleSize: 18,
			participantCount: 18,
			duration: "4 weeks",
			dosage: "150mg daily of either ubiquinol or ubiquinone",
			results:
				"Plasma CoQ10 levels increased by 235% in ubiquinol group vs 85% in ubiquinone group (p<0.01). Peak plasma concentration was reached 6-8 hours post-dosing.",
			polishResults:
				"Poziomy CoQ10 w osoczu wzrosły o 235% w grupie ubichinolu vs 85% w grupie ubichinonu (p<0.01). Szczytowe stężenie w osoczu osiągnięto 6-8 godzin po dawkowaniu.",
			secondaryOutcomes: [
				"Safety parameters",
				"Tolerability",
				"Plasma lipoprotein levels",
			],
			polishSecondaryOutcomes: [
				"Parametry bezpieczeństwa",
				"Tolerancja",
				"Poziomy lipoprotein w osoczu",
			],
			limitations: "Small sample size, single ethnic group, short duration",
			polishLimitations:
				"Mała liczba uczestników, pojedyncza grupa etniczna, krótki czas trwania",
			qualityScore: 8.5,
			conflictOfInterest:
				"Authors employed by Kaneka Corporation, manufacturer of ubiquinol",
			polishConflictOfInterest:
				"Autorzy zatrudnieni w Kaneka Corporation, producencie ubichinolu",
			funding: "Kaneka Corporation",
			polishFunding: "Kaneka Corporation",
			url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC1952438/",
			abstract:
				"This randomized controlled trial demonstrated significantly higher bioavailability of reduced coenzyme Q10 (ubiquinol) compared to the oxidized form (ubiquinone) in healthy Japanese volunteers, with important implications for supplement formulation.",
			polishAbstract:
				"To randomizowane badanie kontrolowane wykazało znacząco wyższą biodostępność zredukowanego koenzymu Q10 (ubichinolu) w porównaniu z formą utlenioną (ubichinon) u zdrowych japońskich ochotników, z ważnymi implikacjami dla formułowania suplementów.",
			keywords: [
				"ubiquinol",
				"ubiquinone",
				"bioavailability",
				"coenzyme Q10",
				"absorption",
			],
			meshTerms: [
				"Ubiquinone",
				"Biological Availability",
				"Administration, Oral",
				"Dietary Supplements",
				"Healthy Volunteers",
			],
			citationCount: 165,
		},
	],
	polishResearchStudies: [
		{
			id: "hosoe-2007-pl",
			title:
				"Study on safety and bioavailability of ubiquinol after single and 4 week multiple oral administration",
			polishTitle:
				"Badanie nad bezpieczeństwem i biodostępnością ubichinolu (zredukowanego koenzymu Q10) po pojedynczym i 4-tygodniowym wielokrotnym podaniu doustnym u zdrowych japońskich ochotników",
			authors: [
				"Hosoe K",
				"Kitakaze H",
				"Nishi H",
				"Kawamura M",
				"Fukuda H",
				"Fujimoto Y",
				"Ito Y",
				"Sugimoto T",
			],
			journal: "Journal of Clinical Biochemistry and Nutrition",
			year: 2007,
			studyType: "RANDOMIZED_CONTROLLED_TRIAL" as const,
			primaryOutcome: "Bioavailability comparison of ubiquinol vs ubiquinone",
			polishPrimaryOutcome:
				"Porównanie biodostępności ubichinolu vs ubichinonu",
			findings:
				"Ubiquinol showed 3-fold higher bioavailability compared to ubiquinone in healthy subjects",
			polishFindings:
				"Ubichinol wykazał 3-krotnie wyższą biodostępność w porównaniu z ubichinonem u zdrowych podmiotów",
			evidenceLevel: "STRONG" as const,
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "17721086",
			doi: "10.3164/jcbn.2007.44.1.29",
			sampleSize: 18,
			participantCount: 18,
			duration: "4 weeks",
			dosage: "150mg ubiquinol or ubiquinone",
			results:
				"Plasma CoQ10 levels increased 3-fold with ubiquinol vs ubiquinone",
			polishResults:
				"Poziomy CoQ10 w osoczu wzrosły 3-krotnie z ubichinolem vs ubichinonem",
			secondaryOutcomes: ["Safety parameters", "Tolerability"],
			polishSecondaryOutcomes: ["Parametry bezpieczeństwa", "Tolerancja"],
			limitations: "Small sample size, healthy subjects only",
			polishLimitations: "Mała liczba uczestników, tylko zdrowi podmioty",
			qualityScore: 8.5,
			conflictOfInterest: "Study funded by ubiquinol manufacturer",
			polishConflictOfInterest:
				"Badanie finansowane przez producenta ubichinolu",
			funding: "Kaneka Corporation",
			polishFunding: "Kaneka Corporation",
			url: "https://www.jstage.jst.go.jp/article/jcbn/44/1/44_1_29/_article",
			abstract:
				"This study evaluated the safety and bioavailability of ubiquinol",
			polishAbstract:
				"To badanie oceniało bezpieczeństwo i biodostępność ubichinolu",
			keywords: ["ubiquinol", "coenzyme Q10", "bioavailability"],
			meshTerms: [
				"Ubiquinone",
				"Biological Availability",
				"Administration, Oral",
			],
			citationCount: 165,
		},
	],
	lastUpdated: "2024-01-15T00:00:00Z",
	createdAt: "2024-01-15T00:00:00Z",
};

// Export all bioavailability data organized by supplement
export const bioavailabilityDataBySupplement: Record<
	string,
	BioavailabilityData
> = {
	"omega-3": omega3Bioavailability,
	curcumin: curcuminBioavailability,
	"rhodiola-rosea": rhodiolaBioavailability,
	"coenzyme-q10": coq10Bioavailability,
};

// Export all bioavailability data as flat array
export const allBioavailabilityData: BioavailabilityData[] = [
	omega3Bioavailability,
	curcuminBioavailability,
	rhodiolaBioavailability,
	coq10Bioavailability,
];

export default {
	bioavailabilityDataBySupplement,
	allBioavailabilityData,
	omega3Bioavailability,
	curcuminBioavailability,
	rhodiolaBioavailability,
	coq10Bioavailability,
};
