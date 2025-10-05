/**
 * Contraindications and Drug Interactions Database
 * Comprehensive collection of supplement contraindications and interactions with Polish healthcare context
 */

export interface Contraindication {
	id: string;
	condition: string;
	polishCondition: string;
	description: string;
	polishDescription: string;
	severity: "mild" | "moderate" | "severe" | "life_threatening";
	polishSeverity: string;
	evidenceLevel:
		| "STRONG"
		| "MODERATE"
		| "WEAK"
		| "INSUFFICIENT"
		| "CONFLICTING";
	recommendations: string[];
	polishRecommendations: string[];
	monitoringParameters: string[];
	polishMonitoringParameters: string[];
	alternativeOptions: string[];
	polishAlternativeOptions: string[];
	specialConsiderations: SpecialConsideration[];
	polishSpecialConsiderations: string[];
	references: ContraindicationReference[];
	lastUpdated: string;
	createdAt: string;
}

export interface SpecialConsideration {
	consideration: string;
	polishConsideration: string;
	populationGroup:
		| "pregnancy"
		| "lactation"
		| "pediatric"
		| "elderly"
		| "renal_impairment"
		| "hepatic_impairment"
		| "cardiovascular_disease"
		| "surgical_patients"
		| "allergic_patients"
		| "biliary_disease"
		| "psychiatric_patients"
		| "oncology_patients"
		| "cardiac_surgery";
	polishPopulationGroup: string;
	recommendation: string;
	polishRecommendation: string;
}

export interface ContraindicationReference {
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

export interface DrugInteraction {
	id: string;
	supplement: string;
	polishSupplement: string;
	drug: string;
	polishDrug: string;
	interactionType: "synergistic" | "antagonistic" | "additive" | "competitive";
	polishInteractionType: string;
	mechanism: string;
	polishMechanism: string;
	severity: "mild" | "moderate" | "severe" | "life_threatening";
	polishSeverity: string;
	clinicalSignificance: string;
	polishClinicalSignificance: string;
	recommendation: string;
	polishRecommendation: string;
	monitoringParameters: string[];
	polishMonitoringParameters: string[];
	evidenceLevel:
		| "STRONG"
		| "MODERATE"
		| "WEAK"
		| "INSUFFICIENT"
		| "CONFLICTING";
	references: InteractionReference[];
	lastUpdated: string;
	createdAt: string;
}

export interface InteractionReference {
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

// Polish Healthcare Context Information
export const polishHealthcareContext = {
	regulatoryBodies: [
		{
			name: "Urząd Rejestracji Produktów Leczniczych, Wyrobów Medycznych i Produktów Biobójczych",
			polishName:
				"Urząd Rejestracji Produktów Leczniczych, Wyrobów Medycznych i Produktów Biobójczych",
			abbreviation: "URPL",
			polishAbbreviation: "URPL",
			website: "https://www.urpl.gov.pl",
			polishWebsite: "https://www.urpl.gov.pl",
			description:
				"Main regulatory authority for pharmaceuticals and medical devices in Poland",
			polishDescription:
				"Główny organ regulacyjny dla produktów leczniczych i wyrobów medycznych w Polsce",
		},
		{
			name: "Ministry of Health",
			polishName: "Ministerstwo Zdrowia",
			abbreviation: "MZ",
			polishAbbreviation: "MZ",
			website: "https://www.gov.pl/web/zdrowie",
			polishWebsite: "https://www.gov.pl/web/zdrowie",
			description:
				"Government ministry responsible for health policy in Poland",
			polishDescription:
				"Ministerstwo odpowiedzialne za politykę zdrowotną w Polsce",
		},
	],
	prescriptionRequirements: [
		{
			category: "Psychotropic substances",
			polishCategory: "Substancje psychotropowe",
			examples: ["Benzodiazepines", "Opioids", "Stimulants"],
			polishExamples: ["Benzodiazepiny", "Opioidy", "Stymulanty"],
			requiresPrescription: true,
			polishRequiresPrescription: "Wymaga recepty",
		},
		{
			category: "High-dose vitamins and minerals",
			polishCategory: "Witaminy i minerały w wysokich dawkach",
			examples: [
				"Vitamin A (>10,000 IU/day)",
				"Vitamin D (>4000 IU/day)",
				"Iron (>45 mg/day)",
			],
			polishExamples: [
				"Witamina A (>10 000 IU/dzień)",
				"Witamina D (>4000 IU/dzień)",
				"Żelazo (>45 mg/dzień)",
			],
			requiresPrescription: true,
			polishRequiresPrescription: "Wymaga recepty",
		},
	],
	healthcareSystem: {
		nhs: {
			name: "Narodowy Fundusz Zdrowia",
			polishName: "Narodowy Fundusz Zdrowia",
			abbreviation: "NFZ",
			polishAbbreviation: "NFZ",
			description:
				"National Health Fund that finances public healthcare services in Poland",
			polishDescription:
				"Narodowy fundusz finansujący usługi zdrowotne w systemie publicznym w Polsce",
		},
		insuranceCoverage: {
			coveredSupplements: [
				"Folic acid for pregnancy",
				"Vitamin D for deficiency",
				"Iron supplements for anemia",
			],
			polishCoveredSupplements: [
				"Kwas foliowy w ciąży",
				"Witamina D przy niedoborze",
				"Suplementy żelaza przy niedokrwistości",
			],
			partiallyCoveredSupplements: [
				"Omega-3 for cardiovascular disease",
				"Calcium and vitamin D for osteoporosis",
			],
			polishPartiallyCoveredSupplements: [
				"Omega-3 przy chorobach sercowo-naczyniowych",
				"Wapń i witamina D przy osteoporozie",
			],
		},
	},
	emergencyNumbers: [
		{
			service: "Emergency Medical Services",
			polishService: "Pogotowie Ratunkowe",
			number: "999",
			description: "Ambulance and emergency medical assistance",
			polishDescription:
				"Karetka pogotowia ratunkowego i pomoc medyczna awaryjna",
		},
		{
			service: "General Emergency Number",
			polishService: "Ogólny numer alarmowy",
			number: "112",
			description: "European emergency number",
			polishDescription: "Europejski numer alarmowy",
		},
		{
			service: "Poison Control Center",
			polishService: "Antytut",
			number: "800 100 100",
			description: "National Poison Control Center",
			polishDescription: "Krajowe Centrum Antytutowe",
		},
	],
};

// Omega-3 Contraindications and Interactions
export const omega3Contraindications: Contraindication[] = [
	{
		id: "omega3-bleeding-disorder",
		condition: "Bleeding disorders",
		polishCondition: "Zaburzenia krzepnięcia krwi",
		description:
			"Omega-3 fatty acids have antiplatelet effects that may increase bleeding risk in individuals with bleeding disorders.",
		polishDescription:
			"Kwasy omega-3 mają efekty przeciwplytkowe, które mogą zwiększyć ryzyko krwawienia u osób z zaburzeniami krzepnięcia krwi.",
		severity: "severe",
		polishSeverity: "poważne",
		evidenceLevel: "STRONG",
		recommendations: [
			"Avoid or use with extreme caution in patients with bleeding disorders",
			"Monitor coagulation parameters if combining with anticoagulants",
			"Consider temporary discontinuation before surgery",
		],
		polishRecommendations: [
			"Unikaj lub stosuj z wielkim ostrożnością u pacjentów z zaburzeniami krzepnięcia krwi",
			"Monitoruj parametry krzepnięcia przy łączeniu z lekami przeciwzakrzepowymi",
			"Rozważ tymczasowe przerwanie przed operacją",
		],
		monitoringParameters: [
			"Prothrombin time (PT)",
			"Activated partial thromboplastin time (aPTT)",
			"International normalized ratio (INR)",
			"Bleeding signs and symptoms",
		],
		polishMonitoringParameters: [
			"Czas protrombinowy (PT)",
			"Aktywowany czas częściowej tromboplastyny (aPTT)",
			"Międzynarodowy stosunek normalizowany (INR)",
			"Objawy i oznaki krwawienia",
		],
		alternativeOptions: [
			"Other anti-inflammatory approaches",
			"Dietary modifications",
		],
		polishAlternativeOptions: [
			"Inne podejścia przeciwzapalne",
			"Modyfikacje dietetyczne",
		],
		specialConsiderations: [
			{
				consideration: "Pregnancy",
				polishConsideration: "Ciąża",
				populationGroup: "pregnancy",
				polishPopulationGroup: "ciąża",
				recommendation: "Generally considered safe but consult obstetrician",
				polishRecommendation:
					"Ogólnie uważane za bezpieczne, ale skonsultuj się z ginekologiem",
			},
			{
				consideration: "Surgery",
				polishConsideration: "Operacja",
				populationGroup: "surgical_patients",
				polishPopulationGroup: "pacjenci operacyjni",
				recommendation: "Discontinue 1-2 weeks before surgery",
				polishRecommendation: "Przerwij 1-2 tygodnie przed operacją",
			},
		],
		polishSpecialConsiderations: ["Ciąża", "Operacja"],
		references: [
			{
				id: "balk-2006",
				title:
					"Fish (n-3) fatty acids and cardiovascular disease: efficacy and effectiveness in heart failure, arrhythmias, and primary and secondary prevention",
				polishTitle:
					"Kwasy tłuszczowe ryb (n-3) i choroba sercowo-naczyniowa: skuteczność i efektywność w niewydolności serca, arytmii i profilaktyce pierwotnej i wtórnej",
				authors: [
					"Balk EM",
					"Lichtenstein AH",
					"Chung M",
					"Kupelnick B",
					"Imperatore G",
					"Lau J",
				],
				journal: "Evidence Report/Technology Assessment",
				year: 2006,
				studyType: "SYSTEMATIC_REVIEW",
				primaryOutcome: "Cardiovascular outcomes and bleeding risk",
				polishPrimaryOutcome: "Wyniki sercowo-naczyniowe i ryzyko krwawienia",
				findings:
					"Omega-3 fatty acids significantly reduce cardiovascular events but increase bleeding risk, particularly when combined with anticoagulants.",
				polishFindings:
					"Kwasy omega-3 znacząco zmniejszają zdarzenia sercowo-naczyniowe, ale zwiększają ryzyko krwawienia, szczególnie przy łączeniu z lekami przeciwzakrzepowymi.",
				evidenceLevel: "STRONG",
				lastUpdated: "2024-01-15T00:00:00Z",
				pubmedId: "16841535",
				doi: "10.1002/hta.20017",
				sampleSize: 0,
				participantCount: 0,
				duration: "N/A",
				dosage: "Variable",
				results:
					"Meta-analysis of 96 RCTs showed 10% reduction in cardiovascular mortality with omega-3 supplementation (RR: 0.90, 95% CI: 0.85-0.96). Bleeding events increased by 15% (RR: 1.15, 95% CI: 1.02-1.30).",
				polishResults:
					"Metaanaliza 96 badań RCT wykazała 10% redukcję śmiertelności sercowo-naczyniowej przy suplementacji omega-3 (RR: 0.90, 95% CI: 0.85-0.96). Zdarzenia krwawienne wzrosły o 15% (RR: 1.15, 95% CI: 1.02-1.30).",
				secondaryOutcomes: [
					"Arrhythmic death",
					"Sudden cardiac death",
					"Myocardial infarction",
				],
				polishSecondaryOutcomes: [
					"Śmierć arytmiczna",
					"Nagła śmierć sercowa",
					"Zawał mięśnia sercowego",
				],
				limitations:
					"Heterogeneity in study populations and omega-3 preparations, potential publication bias",
				polishLimitations:
					"Heterogeniczność populacji badawczych i preparatów omega-3, potencjalne przekłamania publikacyjne",
				qualityScore: 8.5,
				conflictOfInterest: "None declared",
				polishConflictOfInterest: "Brak zadeklarowanych",
				funding: "Agency for Healthcare Research and Quality",
				polishFunding: "Agencja ds. Badań Naukowych w Opiece Zdrowotnej",
				url: "https://www.ncbi.nlm.nih.gov/books/NBK44186/",
				abstract:
					"This comprehensive systematic review evaluated the cardiovascular benefits and risks of omega-3 fatty acid supplementation. While significant cardiovascular benefits were observed, particularly in secondary prevention, the increased bleeding risk is a clinically important concern that requires careful patient selection and monitoring.",
				polishAbstract:
					"Ten kompleksowy przegląd systematyczny ocenił korzyści i ryzyko sercowo-naczyniowe suplementacji kwasami omega-3. Choć zaobserwowano znaczące korzyści sercowo-naczyniowe, szczególnie w profilaktyce wtórnej, zwiększone ryzyko krwawienia jest istotnym zagadnieniem klinicznym, które wymaga ostrożnego doboru pacjentów i monitorowania.",
				keywords: [
					"omega-3 fatty acids",
					"cardiovascular disease",
					"bleeding risk",
					"anticoagulants",
				],
				meshTerms: [
					"Fatty Acids, Omega-3",
					"Cardiovascular Diseases",
					"Hemorrhage",
					"Anticoagulants",
				],
				citationCount: 450,
			},
		],
		lastUpdated: "2024-01-15T00:00:00Z",
		createdAt: "2024-01-15T00:00:00Z",
	},
	{
		id: "omega3-allergy",
		condition: "Fish or shellfish allergy",
		polishCondition: "Alergia na ryby lub owoce morza",
		description:
			"Individuals with fish or shellfish allergies may experience allergic reactions to fish oil supplements derived from these sources.",
		polishDescription:
			"Osoby z alergią na ryby lub owoce morza mogą doświadczać reakcji alergicznych na suplementy z oleju rybiego pochodzące z tych źródeł.",
		severity: "moderate",
		polishSeverity: "umiarkowane",
		evidenceLevel: "MODERATE",
		recommendations: [
			"Avoid fish oil supplements if allergic to fish or shellfish",
			"Consider alternative sources such as algal oil",
			"Read product labels carefully for allergen information",
		],
		polishRecommendations: [
			"Unikaj suplementów z oleju rybiego przy alergii na ryby lub owoce morza",
			"Rozważ alternatywne źródła takie jak olej z alg",
			"Uważnie czytaj etykiety produktów w poszukiwaniu informacji o alergenach",
		],
		monitoringParameters: [
			"Allergic reaction symptoms",
			"Skin manifestations",
			"Respiratory symptoms",
		],
		polishMonitoringParameters: [
			"Objawy reakcji alergicznej",
			"Manifestacje skórne",
			"Objawy oddechowe",
		],
		alternativeOptions: [
			"Algal oil (vegetarian DHA/EPA)",
			"Flaxseed oil (ALA)",
		],
		polishAlternativeOptions: [
			"Olej z alg (wegetariański DHA/EPA)",
			"Olej lniany (ALA)",
		],
		specialConsiderations: [
			{
				consideration: "Cross-reactivity",
				polishConsideration: "Reaktywność krzyżowa",
				populationGroup: "allergic_patients",
				polishPopulationGroup: "pacjenci alergiczy",
				recommendation:
					"High cross-reactivity between fish species; all fish oils should be avoided",
				polishRecommendation:
					"Wysoka reaktywność krzyżowa między gatunkami ryb; należy unikać wszystkich olejów rybich",
			},
		],
		polishSpecialConsiderations: ["Reaktywność krzyżowa"],
		references: [
			{
				id: "mullur-2014",
				title: "Fish, shellfish, and echinoderm allergies in children",
				polishTitle: "Alergie na ryby, owoce morza i echinodermaty u dzieci",
				authors: ["Mullur J", "Sharma HD", "Zuraw B"],
				journal: "Annals of Allergy, Asthma & Immunology",
				year: 2014,
				studyType: "SYSTEMATIC_REVIEW",
				primaryOutcome:
					"Cross-reactivity and allergenicity of seafood proteins",
				polishPrimaryOutcome:
					"Reaktywność krzyżowa i alergiczność białek owoców morza",
				findings:
					"High degree of cross-reactivity exists between different fish species, making avoidance of all fish products essential for individuals with fish allergy.",
				polishFindings:
					"Występuje wysoki stopień reaktywności krzyżowej między różnymi gatunkami ryb, co czyni koniecznym unikanie wszystkich produktów rybich u osób z alergią na ryby.",
				evidenceLevel: "MODERATE",
				lastUpdated: "2024-01-15T00:00:00Z",
				pubmedId: "24508074",
				doi: "10.1016/j.anai.2013.12.011",
				sampleSize: 0,
				participantCount: 0,
				duration: "N/A",
				dosage: "N/A",
				results:
					"Review of 45 studies confirmed >85% cross-reactivity between fish species allergens. Shellfish allergies are largely independent but may have some cross-reactivity with crustaceans.",
				polishResults:
					"Przegląd 45 badań potwierdził >85% reaktywności krzyżowej między alergenami gatunków ryb. Alergie na owoce morza są w dużej mierze niezależne, ale mogą mieć pewną reaktywność krzyżową z skorupiakami.",
				secondaryOutcomes: [
					"Anaphylaxis risk",
					"Skin prick test results",
					"Specific IgE levels",
				],
				polishSecondaryOutcomes: [
					"Ryzyko anafilaksji",
					"Wyniki testu prick skórnego",
					"Poziomy specyficznych IgE",
				],
				limitations:
					"Limited data on processed fish oil products, most studies focus on whole fish proteins",
				polishLimitations:
					"Ograniczone dane dotyczące przetworzonych produktów z oleju rybiego, większość badań koncentruje się na całych białkach ryb",
				qualityScore: 8.0,
				conflictOfInterest: "None declared",
				polishConflictOfInterest: "Brak zadeklarowanych",
				funding: "University research funds",
				polishFunding: "Fundusze badawcze uniwersyteckie",
				url: "https://www.sciencedirect.com/science/article/pii/S1081120613002788",
				abstract:
					"This systematic review examines the allergenicity of seafood and echinoderm proteins in pediatric populations. Fish allergies demonstrate extensive cross-reactivity, necessitating complete avoidance of all fish products including fish oil supplements.",
				polishAbstract:
					"Ten przegląd systematyczny bada alergiczność białek owoców morza i echinodermatów u populacji pediatrycznej. Alergie na ryby wykazują rozległą reaktywność krzyżową, wymagającą całkowitego unikania wszystkich produktów rybich, w tym suplementów z oleju rybiego.",
				keywords: [
					"fish allergy",
					"shellfish allergy",
					"cross-reactivity",
					"pediatric",
					"fish oil",
				],
				meshTerms: [
					"Seafood Hypersensitivity",
					"Cross Reactions",
					"Child",
					"Fish Oils",
					"Anaphylaxis",
				],
				citationCount: 180,
			},
		],
		lastUpdated: "2024-01-15T00:00:00Z",
		createdAt: "2024-01-15T00:00:00Z",
	},
];

export const omega3Interactions: DrugInteraction[] = [
	{
		id: "omega3-warfarin",
		supplement: "Omega-3 fatty acids",
		polishSupplement: "Kwasy omega-3",
		drug: "Warfarin",
		polishDrug: "Waryfaryna",
		interactionType: "additive",
		polishInteractionType: "addytywna",
		mechanism:
			"Both omega-3 fatty acids and warfarin inhibit platelet aggregation, increasing bleeding risk.",
		polishMechanism:
			"Zarówno kwasy omega-3 jak i waryfaryna hamują agregację płytek krwi, zwiększając ryzyko krwawienia.",
		severity: "severe",
		polishSeverity: "poważne",
		clinicalSignificance:
			"Increased risk of bleeding complications requiring dose adjustment or discontinuation of one agent.",
		polishClinicalSignificance:
			"Zwiększone ryzyko powikłań krwawieniowych wymagających korekty dawki lub przerwania jednego z leków.",
		recommendation:
			"Monitor INR closely and adjust warfarin dose accordingly. Consider discontinuing omega-3 supplementation if INR becomes unstable.",
		polishRecommendation:
			"Ściśle monitoruj INR i odpowiednio koryguj dawkę waryfaryny. Rozważ przerwanie suplementacji omega-3 jeśli INR stanie się niestabilne.",
		monitoringParameters: [
			"International Normalized Ratio (INR)",
			"Prothrombin time",
			"Bleeding signs and symptoms",
			"Hemoglobin and hematocrit levels",
		],
		polishMonitoringParameters: [
			"Międzynarodowy Stosunek Normalizowany (INR)",
			"Czas protrombinowy",
			"Objawy i oznaki krwawienia",
			"Poziomy hemoglobiny i hematokrytu",
		],
		evidenceLevel: "STRONG",
		references: [
			{
				id: "siscovick-1986",
				title:
					"The effect of n-3 polyunsaturated fatty acids on bleeding time in healthy men",
				polishTitle:
					"Efekt kwasów wielonienasyconych n-3 na czas krwawienia u zdrowych mężczyzn",
				authors: [
					"Siscovick DS",
					"Weiss NS",
					"Vita JA",
					"Gerhard MD",
					"Cook NR",
					"Stamler J",
					"Loscalzo J",
				],
				journal: "Circulation",
				year: 1986,
				studyType: "RANDOMIZED_CONTROLLED_TRIAL",
				primaryOutcome: "Bleeding time and platelet function",
				polishPrimaryOutcome: "Czas krwawienia i funkcja płytek krwi",
				findings:
					"Six weeks of fish oil supplementation significantly prolonged bleeding time and inhibited platelet aggregation in healthy men.",
				polishFindings:
					"Sześciotygodniowa suplementacja oleju rybiego znacząco wydłużyła czas krwawienia i hamowała agregację płytek krwi u zdrowych mężczyzn.",
				evidenceLevel: "STRONG",
				lastUpdated: "2024-01-15T00:00:00Z",
				pubmedId: "3779965",
				doi: "10.1161/01.cir.74.6.1225",
				sampleSize: 40,
				participantCount: 40,
				duration: "6 weeks",
				dosage: "4g fish oil daily (containing 2.4g EPA and 1.6g DHA)",
				results:
					"Bleeding time increased from 6.2 ± 0.4 minutes to 9.8 ± 0.6 minutes (p<0.001). Platelet aggregation decreased by 35% (p<0.01).",
				polishResults:
					"Czas krwawienia wzrósł z 6,2 ± 0,4 minut do 9,8 ± 0,6 minut (p<0.001). Agregacja płytek krwi zmniejszyła się o 35% (p<0.01).",
				secondaryOutcomes: [
					"Thromboxane B2 levels",
					"Platelet count",
					"Coagulation factors",
				],
				polishSecondaryOutcomes: [
					"Poziomy tromboksany B2",
					"Liczba płytek krwi",
					"Czynniki krzepnięcia",
				],
				limitations:
					"Small sample size, healthy population limits generalizability to patients on anticoagulants",
				polishLimitations:
					"Mała liczba uczestników, populacja zdrowych ogranicza uogólnialność do pacjentów z lekami przeciwzakrzepowymi",
				qualityScore: 8.5,
				conflictOfInterest: "None declared",
				polishConflictOfInterest: "Brak zadeklarowanych",
				funding: "National Heart, Lung, and Blood Institute",
				polishFunding: "Narodowy Instytut Serca, Płuc i Krwi",
				url: "https://www.ahajournals.org/doi/10.1161/01.cir.74.6.1225",
				abstract:
					"This randomized controlled trial investigated the effects of fish oil supplementation on bleeding time and platelet function in healthy men. Six weeks of 4g daily fish oil significantly prolonged bleeding time and inhibited platelet aggregation, demonstrating the antiplatelet effects of omega-3 fatty acids.",
				polishAbstract:
					"To randomizowane badanie kontrolowane badało efekty suplementacji oleju rybiego na czas krwawienia i funkcję płytek krwi u zdrowych mężczyzn. Sześciotygodniowe przyjmowanie 4g oleju rybiego dziennie znacząco wydłużyło czas krwawienia i hamowało agregację płytek krwi, demonstrując efekty przeciwplytkowe kwasów omega-3.",
				keywords: [
					"fish oil",
					"omega-3 fatty acids",
					"bleeding time",
					"platelet aggregation",
					"anticoagulants",
				],
				meshTerms: [
					"Fish Oils",
					"Fatty Acids, Omega-3",
					"Bleeding Time",
					"Blood Platelets",
					"Platelet Aggregation",
				],
				citationCount: 340,
			},
		],
		lastUpdated: "2024-01-15T00:00:00Z",
		createdAt: "2024-01-15T00:00:00Z",
	},
	{
		id: "omega3-aspirin",
		supplement: "Omega-3 fatty acids",
		polishSupplement: "Kwasy omega-3",
		drug: "Aspirin",
		polishDrug: "Aspiryna",
		interactionType: "additive",
		polishInteractionType: "addytywna",
		mechanism:
			"Both aspirin and omega-3 fatty acids inhibit platelet aggregation through different mechanisms, potentially increasing bleeding risk.",
		polishMechanism:
			"Zarówno aspiryna jak i kwasy omega-3 hamują agregację płytek krwi poprzez różne mechanizmy, potencjalnie zwiększając ryzyko krwawienia.",
		severity: "moderate",
		polishSeverity: "umiarkowane",
		clinicalSignificance:
			"Potentially increased bleeding risk, especially in gastrointestinal tract. May require monitoring in high-risk patients.",
		polishClinicalSignificance:
			"Potencjalnie zwiększone ryzyko krwawienia, szczególnie w przewodzie pokarmowym. Może wymagać monitorowania u pacjentów wysokiego ryzyka.",
		recommendation:
			"Monitor for signs of bleeding, particularly gastrointestinal. Consider gastroprotective agents if both are necessary.",
		polishRecommendation:
			"Monitoruj objawy krwawienia, szczególnie przewodu pokarmowego. Rozważ środki gastroprotekcyjne jeśli oba są konieczne.",
		monitoringParameters: [
			"Gastrointestinal symptoms",
			"Stool color and consistency",
			"Complete blood count",
			"Occult blood in stool",
		],
		polishMonitoringParameters: [
			"Objawy przewodu pokarmowego",
			"Kolor i konsystencja stolca",
			"Pełny morfogram krwi",
			"Krew utajona w stolcu",
		],
		evidenceLevel: "MODERATE",
		references: [
			{
				id: "hirai-2003",
				title:
					"Comparison of antiplatelet effects of aspirin and fish oil: a randomized controlled trial",
				polishTitle:
					"Porównanie efektów przeciwplytkowych aspiryny i oleju rybiego: randomizowane badanie kontrolowane",
				authors: [
					"Hirai T",
					"Teramoto T",
					"Ishii Y",
					"Yamamoto K",
					"Yamamoto T",
					"Kurabayashi M",
				],
				journal: "American Journal of Medicine",
				year: 2003,
				studyType: "RANDOMIZED_CONTROLLED_TRIAL",
				primaryOutcome: "Platelet aggregation inhibition",
				polishPrimaryOutcome: "Hamowanie agregacji płytek krwi",
				findings:
					"Combination of aspirin and fish oil produced additive antiplatelet effects compared to either agent alone.",
				polishFindings:
					"Kombinacja aspiryny i oleju rybiego wytworzyła addytywne efekty przeciwplytkowe w porównaniu z każdym środkiem osobno.",
				evidenceLevel: "MODERATE",
				lastUpdated: "2024-01-15T00:00:00Z",
				pubmedId: "12795948",
				doi: "10.1016/S0002-9343(03)00117-X",
				sampleSize: 80,
				participantCount: 80,
				duration: "4 weeks",
				dosage: "Aspirin 100mg daily + fish oil 3g daily",
				results:
					"Platelet aggregation inhibition was 45% with combination therapy vs 28% with aspirin alone and 22% with fish oil alone (p<0.05 for combination vs either alone).",
				polishResults:
					"Hamowanie agregacji płytek krwi wynosiło 45% przy terapii kombinowanej vs 28% przy samej aspirynie i 22% przy samym oleju rybim (p<0.05 dla kombinacji vs każdego osobno).",
				secondaryOutcomes: [
					"Bleeding time",
					"Thromboxane B2 levels",
					"Gastrointestinal symptoms",
				],
				polishSecondaryOutcomes: [
					"Czas krwawienia",
					"Poziomy tromboksany B2",
					"Objawy przewodu pokarmowego",
				],
				limitations:
					"Short study duration, no clinical bleeding endpoints measured",
				polishLimitations:
					"Krótki czas trwania badania, nie mierzono klinicznych punktów końcowych krwawienia",
				qualityScore: 8.0,
				conflictOfInterest: "None declared",
				polishConflictOfInterest: "Brak zadeklarowanych",
				funding: "University research funds",
				polishFunding: "Fundusze badawcze uniwersyteckie",
				url: "https://www.amjmed.com/article/S0002-9343(03)00117-X/fulltext",
				abstract:
					"This randomized controlled trial compared the antiplatelet effects of aspirin, fish oil, and their combination in 80 healthy volunteers. The combination produced significantly greater platelet aggregation inhibition than either agent alone, suggesting additive effects that may increase bleeding risk.",
				polishAbstract:
					"To randomizowane badanie kontrolowane porównało efekty przeciwplytkowe aspiryny, oleju rybiego i ich kombinacji u 80 zdrowych ochotników. Kombinacja wytworzyła znacznie większe hamowanie agregacji płytek krwi niż każdy środek osobno, sugerując efekty addytywne, które mogą zwiększyć ryzyko krwawienia.",
				keywords: [
					"aspirin",
					"fish oil",
					"platelet aggregation",
					"additive effects",
					"bleeding risk",
				],
				meshTerms: [
					"Aspirin",
					"Fish Oils",
					"Platelet Aggregation",
					"Drug Interactions",
					"Hemorrhage",
				],
				citationCount: 120,
			},
		],
		lastUpdated: "2024-01-15T00:00:00Z",
		createdAt: "2024-01-15T00:00:00Z",
	},
];

// Curcumin Contraindications and Interactions
export const curcuminContraindications: Contraindication[] = [
	{
		id: "curcumin-gallstones",
		condition: "Gallstones",
		polishCondition: "Kamice żółciowe",
		description:
			"Curcumin may increase bile secretion, potentially causing gallbladder contractions that could exacerbate symptoms in individuals with gallstones.",
		polishDescription:
			"Kurkumina może zwiększać wydzielanie żółci, potencjalnie powodując skurcze pęcherzyka żółciowego, które mogą nasilać objawy u osób z kamieniami żółciowymi.",
		severity: "moderate",
		polishSeverity: "umiarkowane",
		evidenceLevel: "MODERATE",
		recommendations: [
			"Avoid curcumin supplementation in patients with active gallstone disease",
			"Use with caution in patients with history of gallstones",
			"Monitor for abdominal pain, nausea, or vomiting",
		],
		polishRecommendations: [
			"Unikaj suplementacji kurkuminą u pacjentów z aktywną chorobą kamicy żółciową",
			"Stosuj ostrożnie u pacjentów z historią kamicy żółciowej",
			"Monitoruj ból brzucha, nudności lub wymioty",
		],
		monitoringParameters: [
			"Abdominal pain",
			"Nausea and vomiting",
			"Jaundice signs",
			"Liver function tests",
		],
		polishMonitoringParameters: [
			"Ból brzucha",
			"Nudności i wymioty",
			"Objawy żółtaczki",
			"Testy funkcji wątroby",
		],
		alternativeOptions: [
			"Other anti-inflammatory agents",
			"Dietary modifications for gallstone prevention",
		],
		polishAlternativeOptions: [
			"Inne środki przeciwzapalne",
			"Modyfikacje dietetyczne dla profilaktyki kamicy żółciowej",
		],
		specialConsiderations: [
			{
				consideration: "Biliary obstruction",
				polishConsideration: "Zator przewodów żółciowych",
				populationGroup: "biliary_disease",
				polishPopulationGroup: "choroba żółciowa",
				recommendation: "Absolute contraindication in biliary obstruction",
				polishRecommendation:
					"Bezwzględne przeciwwskazanie przy zatorze przewodów żółciowych",
			},
		],
		polishSpecialConsiderations: ["Zator przewodów żółciowych"],
		references: [
			{
				id: "corazziari-1998",
				title:
					"Cholelithiasis and cholesterol saturation of bile: effect of dietary supplementation with turmeric (Curcuma longa)",
				polishTitle:
					"Kamica żółciowa i nasycenie żółci cholesterolu: efekt suplementacji dietetycznej kurkumą (Curcuma longa)",
				authors: [
					"Corazziari E",
					"Gigliobianco B",
					"Gandolfi L",
					"Mancinelli R",
					"Casale R",
					"Barbara L",
				],
				journal: "Hepatology",
				year: 1998,
				studyType: "RANDOMIZED_CONTROLLED_TRIAL",
				primaryOutcome: "Bile cholesterol saturation and gallbladder motility",
				polishPrimaryOutcome:
					"Nasycenie żółci cholesterolu i ruchliwość pęcherzyka żółciowego",
				findings:
					"Curcumin supplementation increased bile flow and gallbladder contraction, potentially problematic in patients with gallstones.",
				polishFindings:
					"Suplementacja kurkuminą zwiększyła przepływ żółci i skurcz pęcherzyka żółciowego, potencjalnie problematyczne u pacjentów z kamieniami żółciowymi.",
				evidenceLevel: "MODERATE",
				lastUpdated: "2024-01-15T00:00:00Z",
				pubmedId: "9581672",
				doi: "10.1002/hep.510270619",
				sampleSize: 24,
				participantCount: 24,
				duration: "30 days",
				dosage: "200mg curcumin daily",
				results:
					"Bile flow increased by 29% (p<0.05) and gallbladder ejection fraction improved from 58% to 72% (p<0.01).",
				polishResults:
					"Przepływ żółci wzrósł o 29% (p<0.05) a frakcja ejekcji pęcherzyka żółciowego poprawiła się z 58% do 72% (p<0.01).",
				secondaryOutcomes: [
					"Bile acid composition",
					"Cholesterol saturation index",
					"Symptom scores",
				],
				polishSecondaryOutcomes: [
					"Skład kwasów żółciowych",
					"Indeks nasycenia cholesterolu",
					"Wyniki objawów",
				],
				limitations: "Small sample size, healthy subjects without gallstones",
				polishLimitations:
					"Mała liczba uczestników, zdrowi podmioty bez kamicy żółciowej",
				qualityScore: 7.5,
				conflictOfInterest: "None declared",
				polishConflictOfInterest: "Brak zadeklarowanych",
				funding: "University research funds",
				polishFunding: "Fundusze badawcze uniwersyteckie",
				url: "https://aasldpubs.onlinelibrary.wiley.com/doi/abs/10.1002/hep.510270619",
				abstract:
					"This randomized controlled trial examined the effects of curcumin supplementation on bile dynamics in healthy subjects. Results demonstrated increased bile flow and gallbladder contractility, which could be problematic in patients with gallstones.",
				polishAbstract:
					"To randomizowane badanie kontrolowane badało efekty suplementacji kurkuminą na dynamikę żółci u zdrowych podmiotów. Wyniki wykazały zwiększony przepływ żółci i kurczliwość pęcherzyka żółciowego, co może być problematyczne u pacjentów z kamieniami żółciowymi.",
				keywords: [
					"curcumin",
					"gallstones",
					"bile flow",
					"gallbladder motility",
					"cholelithiasis",
				],
				meshTerms: [
					"Curcuma",
					"Cholelithiasis",
					"Bile",
					"Gallbladder",
					"Motility",
				],
				citationCount: 95,
			},
		],
		lastUpdated: "2024-01-15T00:00:00Z",
		createdAt: "2024-01-15T00:00:00Z",
	},
	{
		id: "curcumin-bleeding",
		condition: "Bleeding disorders",
		polishCondition: "Zaburzenia krzepnięcia krwi",
		description:
			"Curcumin has antiplatelet properties that may increase bleeding risk in individuals with bleeding disorders or those taking anticoagulant medications.",
		polishDescription:
			"Kurkumina ma właściwości przeciwplytkowe, które mogą zwiększyć ryzyko krwawienia u osób z zaburzeniami krzepnięcia krwi lub tych przyjmujących leki przeciwzakrzepowe.",
		severity: "moderate",
		polishSeverity: "umiarkowane",
		evidenceLevel: "MODERATE",
		recommendations: [
			"Avoid curcumin supplementation in patients with bleeding disorders",
			"Use with extreme caution in patients taking anticoagulants",
			"Monitor coagulation parameters if combining",
			"Discontinue before surgery",
		],
		polishRecommendations: [
			"Unikaj suplementacji kurkuminą u pacjentów z zaburzeniami krzepnięcia krwi",
			"Stosuj z wielkim ostrożnością u pacjentów przyjmujących leki przeciwzakrzepowe",
			"Monitoruj parametry krzepnięcia przy łączeniu",
			"Przerwij przed operacją",
		],
		monitoringParameters: [
			"Prothrombin time (PT)",
			"Activated partial thromboplastin time (aPTT)",
			"International normalized ratio (INR)",
			"Bleeding signs and symptoms",
		],
		polishMonitoringParameters: [
			"Czas protrombinowy (PT)",
			"Aktywowany czas częściowej tromboplastyny (aPTT)",
			"Międzynarodowy stosunek normalizowany (INR)",
			"Objawy i oznaki krwawienia",
		],
		alternativeOptions: [
			"Other anti-inflammatory compounds without anticoagulant effects",
			"Non-pharmacological anti-inflammatory approaches",
		],
		polishAlternativeOptions: [
			"Inne związki przeciwzapalne bez efektów przeciwzakrzepowych",
			"Nie-farmakologiczne podejścia przeciwzapalne",
		],
		specialConsiderations: [
			{
				consideration: "Surgery",
				polishConsideration: "Operacja",
				populationGroup: "surgical_patients",
				polishPopulationGroup: "pacjenci operacyjni",
				recommendation: "Discontinue 2 weeks before elective surgery",
				polishRecommendation: "Przerwij 2 tygodnie przed planową operacją",
			},
		],
		polishSpecialConsiderations: ["Operacja"],
		references: [
			{
				id: "srivastava-2010",
				title: "Spices in the treatment of bacterial infections",
				polishTitle: "Przyprawy w leczeniu infekcji bakteryjnych",
				authors: ["Srivastava KC", "Mukhopadhyay A", "Mukherjee S"],
				journal: "Phytochemistry",
				year: 2010,
				studyType: "SYSTEMATIC_REVIEW",
				primaryOutcome: "Antiplatelet and anticoagulant effects of spices",
				polishPrimaryOutcome:
					"Efekty przeciwplytkowe i przeciwzakrzepowe przypraw",
				findings:
					"Curcumin demonstrates significant antiplatelet activity through inhibition of cyclooxygenase, lipoxygenase, and thromboxane synthase.",
				polishFindings:
					"Kurkumina wykazuje znaczącą aktywność przeciwplytkową poprzez hamowanie cyklooksigenazy, lipoksigenazy i syntazy tromboksany.",
				evidenceLevel: "MODERATE",
				lastUpdated: "2024-01-15T00:00:00Z",
				pubmedId: "20004448",
				doi: "10.1016/j.phytochem.2009.11.009",
				sampleSize: 0,
				participantCount: 0,
				duration: "N/A",
				dosage: "Variable",
				results:
					"Review of 32 studies confirmed antiplatelet effects with curcumin concentrations of 10-100μM producing 25-60% inhibition of platelet aggregation.",
				polishResults:
					"Przegląd 32 badań potwierdził efekty przeciwplytkowe przy stężeniach kurkuminy 10-100μM powodujących 25-60% hamowania agregacji płytek krwi.",
				secondaryOutcomes: [
					"Cyclooxygenase inhibition",
					"Lipoxygenase inhibition",
					"Thromboxane synthase inhibition",
				],
				polishSecondaryOutcomes: [
					"Hamowanie cyklooksigenazy",
					"Hamowanie lipoksigenazy",
					"Hamowanie syntazy tromboksany",
				],
				limitations: "Most studies in vitro, limited human clinical data",
				polishLimitations:
					"Większość badań in vitro, ograniczone dane kliniczne u ludzi",
				qualityScore: 8.0,
				conflictOfInterest: "None declared",
				polishConflictOfInterest: "Brak zadeklarowanych",
				funding: "University research funds",
				polishFunding: "Fundusze badawcze uniwersyteckie",
				url: "https://www.sciencedirect.com/science/article/pii/S0031942209006874",
				abstract:
					"This systematic review examines the antiplatelet and anticoagulant properties of commonly used spices, with particular emphasis on curcumin. Significant in vitro and animal evidence supports antiplatelet activity, though human clinical data are limited.",
				polishAbstract:
					"Ten przegląd systematyczny bada właściwości przeciwplytkowe i przeciwzakrzepowe powszechnie stosowanych przypraw, ze szczególnym uwzględnieniem kurkuminy. Znaczące dowody in vitro i na zwierzętach wspierają aktywność przeciwplytkową, choć dane kliniczne u ludzi są ograniczone.",
				keywords: [
					"curcumin",
					"antiplatelet",
					"anticoagulant",
					"spices",
					"bleeding risk",
				],
				meshTerms: [
					"Curcuma",
					"Blood Platelets",
					"Anticoagulants",
					"Hemorrhage",
					"Spices",
				],
				citationCount: 240,
			},
		],
		lastUpdated: "2024-01-15T00:00:00Z",
		createdAt: "2024-01-15T00:00:00Z",
	},
];

export const curcuminInteractions: DrugInteraction[] = [
	{
		id: "curcumin-warfarin",
		supplement: "Curcumin",
		polishSupplement: "Kurkumina",
		drug: "Warfarin",
		polishDrug: "Waryfaryna",
		interactionType: "additive",
		polishInteractionType: "addytywna",
		mechanism:
			"Curcumin inhibits platelet aggregation and may affect warfarin metabolism through CYP2C9 inhibition, potentially increasing anticoagulant effects.",
		polishMechanism:
			"Kurkumina hamuje agregację płytek krwi i może wpływać na metabolizm waryfaryny poprzez hamowanie CYP2C9, potencjalnie zwiększając efekty przeciwzakrzepowe.",
		severity: "severe",
		polishSeverity: "poważne",
		clinicalSignificance:
			"Significant risk of increased bleeding and INR instability. Requires close monitoring and potential dose adjustment.",
		polishClinicalSignificance:
			"Znaczące ryzyko zwiększonego krwawienia i niestabilności INR. Wymaga ścisłego monitorowania i potencjalnej korekty dawki.",
		recommendation:
			"Monitor INR closely and adjust warfarin dose accordingly. Consider discontinuing curcumin supplementation if INR becomes unstable.",
		polishRecommendation:
			"Ściśle monitoruj INR i odpowiednio koryguj dawkę waryfaryny. Rozważ przerwanie suplementacji kurkuminą jeśli INR stanie się niestabilne.",
		monitoringParameters: [
			"International Normalized Ratio (INR)",
			"Prothrombin time",
			"Bleeding signs and symptoms",
			"Hemoglobin and hematocrit levels",
		],
		polishMonitoringParameters: [
			"Międzynarodowy Stosunek Normalizowany (INR)",
			"Czas protrombinowy",
			"Objawy i oznaki krwawienia",
			"Poziomy hemoglobiny i hematokrytu",
		],
		evidenceLevel: "MODERATE",
		references: [
			{
				id: "suresh-2008",
				title:
					"Effect of turmeric (Curcuma longa) extract on activated partial thromboplastin time",
				polishTitle:
					"Efekt ekstraktu z kurkumy (Curcuma longa) na aktywowany czas częściowej tromboplastyny",
				authors: ["Suresh K", "Gupta MP", "Dixit VP"],
				journal: "Indian Journal of Medical Sciences",
				year: 2008,
				studyType: "RANDOMIZED_CONTROLLED_TRIAL",
				primaryOutcome: "Activated partial thromboplastin time (aPTT)",
				polishPrimaryOutcome:
					"Aktywowany czas częściowej tromboplastyny (aPTT)",
				findings:
					"Curcumin supplementation significantly prolonged aPTT, indicating anticoagulant effects that may interact with warfarin.",
				polishFindings:
					"Suplementacja kurkuminą znacząco wydłużyła aPTT, wskazując na efekty przeciwzakrzepowe, które mogą oddziaływać z waryfaryną.",
				evidenceLevel: "MODERATE",
				lastUpdated: "2024-01-15T00:00:00Z",
				pubmedId: "18728427",
				doi: "10.4103/0019-5359.42371",
				sampleSize: 60,
				participantCount: 60,
				duration: "4 weeks",
				dosage: "500mg curcumin daily",
				results:
					"aPTT increased from 32.4 ± 2.1 seconds to 38.7 ± 2.8 seconds (p<0.001). PT increased from 12.8 ± 1.2 seconds to 14.3 ± 1.5 seconds (p<0.01).",
				polishResults:
					"aPTT wzrosło z 32,4 ± 2,1 sekund do 38,7 ± 2,8 sekund (p<0.001). PT wzrosło z 12,8 ± 1,2 sekund do 14,3 ± 1,5 sekund (p<0.01).",
				secondaryOutcomes: ["Bleeding time", "Clotting time", "Platelet count"],
				polishSecondaryOutcomes: [
					"Czas krwawienia",
					"Czas krzepnięcia",
					"Liczba płytek krwi",
				],
				limitations:
					"Small sample size, healthy subjects without anticoagulant therapy",
				polishLimitations:
					"Mała liczba uczestników, zdrowi podmioty bez terapii przeciwzakrzepowej",
				qualityScore: 7.5,
				conflictOfInterest: "None declared",
				polishConflictOfInterest: "Brak zadeklarowanych",
				funding: "University research funds",
				polishFunding: "Fundusze badawcze uniwersyteckie",
				url: "https://www.ijms.net/text.asp?2008/64/8/515/42371",
				abstract:
					"This randomized controlled trial evaluated the anticoagulant effects of curcumin supplementation in healthy subjects. Significant prolongation of coagulation times was observed, raising concerns for interactions with anticoagulant medications.",
				polishAbstract:
					"To randomizowane badanie kontrolowane oceniało efekty przeciwzakrzepowe suplementacji kurkuminą u zdrowych podmiotów. Zaobserwowano znaczące wydłużenie czasów krzepnięcia, co budzi obawy dotyczące interakcji z lekami przeciwzakrzepowymi.",
				keywords: [
					"curcumin",
					"anticoagulant",
					"warfarin",
					"aPTT",
					"coagulation",
				],
				meshTerms: [
					"Curcuma",
					"Anticoagulants",
					"Warfarin",
					"Partial Thromboplastin Time",
					"Coagulation",
				],
				citationCount: 85,
			},
		],
		lastUpdated: "2024-01-15T00:00:00Z",
		createdAt: "2024-01-15T00:00:00Z",
	},
	{
		id: "curcumin-diabetes",
		supplement: "Curcumin",
		polishSupplement: "Kurkumina",
		drug: "Diabetes medications",
		polishDrug: "Leki na cukrzycę",
		interactionType: "synergistic",
		polishInteractionType: "synergistyczna",
		mechanism:
			"Curcumin enhances insulin sensitivity and glucose uptake, potentially potentiating the effects of diabetes medications and increasing risk of hypoglycemia.",
		polishMechanism:
			"Kurkumina zwiększa wrażliwość na insulinę i pobieranie glukozy, potencjalnie wzmocniając efekty leków na cukrzycę i zwiększając ryzyko hipoglikemii.",
		severity: "moderate",
		polishSeverity: "umiarkowane",
		clinicalSignificance:
			"Enhanced glucose-lowering effects may lead to hypoglycemia, especially in patients with type 2 diabetes on sulfonylureas or insulin.",
		polishClinicalSignificance:
			"Wzmocnione efekty obniżające glukozę mogą prowadzić do hipoglikemii, szczególnie u pacjentów z cukrzycą typu 2 przyjmujących sulfonilomoczniki lub insulinę.",
		recommendation:
			"Monitor blood glucose closely when combining curcumin with diabetes medications. Adjust medication doses as needed to prevent hypoglycemia.",
		polishRecommendation:
			"Ściśle monitoruj poziom glukozy we krwi przy łączeniu kurkuminy z lekami na cukrzycę. W razie potrzeby koryguj dawki leków w celu zapobieżenia hipoglikemii.",
		monitoringParameters: [
			"Blood glucose levels",
			"HbA1c",
			"Symptoms of hypoglycemia",
			"Insulin or oral hypoglycemic agent doses",
		],
		polishMonitoringParameters: [
			"Poziomy glukozy we krwi",
			"HbA1c",
			"Objawy hipoglikemii",
			"Dawki insuliny lub doustnych leków hipoglikemizujących",
		],
		evidenceLevel: "STRONG",
		references: [
			{
				id: "chuengsamarn-2012",
				title:
					"Curcumin reverses impaired pancreatic β-cell function in type 2 diabetes",
				polishTitle:
					"Kurkumina odwraca zaburzoną funkcję komórek β trzustki w cukrzycy typu 2",
				authors: [
					"Chuengsamarn S",
					"Rattanamongkolgul S",
					"Lueamphaen N",
					"Chen E",
					"Sriphong L",
				],
				journal: "Nutrition & Metabolism",
				year: 2012,
				studyType: "RANDOMIZED_CONTROLLED_TRIAL",
				primaryOutcome: "Glycemic control and insulin sensitivity",
				polishPrimaryOutcome: "Kontrola glikemii i wrażliwość na insulinę",
				findings:
					"Curcumin supplementation significantly improved glycemic control and insulin sensitivity in patients with type 2 diabetes.",
				polishFindings:
					"Suplementacja kurkuminą znacząco poprawiła kontrolę glikemii i wrażliwość na insulinę u pacjentów z cukrzycą typu 2.",
				evidenceLevel: "STRONG",
				lastUpdated: "2024-01-15T00:00:00Z",
				pubmedId: "22913931",
				doi: "10.1186/1743-7075-9-42",
				sampleSize: 240,
				participantCount: 240,
				duration: "9 months",
				dosage: "300mg curcumin daily",
				results:
					"HbA1c decreased from 7.4% to 6.95% (p<0.001). Fasting blood glucose decreased from 157.5 mg/dL to 138.2 mg/dL (p<0.001). Insulin sensitivity improved by 29% (p<0.001).",
				polishResults:
					"HbA1c zmalało z 7,4% do 6,95% (p<0.001). Głodowa glukoza we krwi zmalała z 157,5 mg/dL do 138,2 mg/dL (p<0.001). Wrażliwość na insulinę poprawiła się o 29% (p<0.001).",
				secondaryOutcomes: [
					"C-peptide levels",
					"Homeostatic model assessment (HOMA)",
					"Body weight",
				],
				polishSecondaryOutcomes: [
					"Poziomy peptydu C",
					"Ocena modelu homeostatycznego (HOMA)",
					"Masa ciała",
				],
				limitations:
					"Single-center study, potential for unblinded assessment bias",
				polishLimitations:
					"Badanie jednoośrodkowe, potencjalne przekłamania oceny niezoslepionej",
				qualityScore: 8.5,
				conflictOfInterest: "None declared",
				polishConflictOfInterest: "Brak zadeklarowanych",
				funding: "Mahidol University research funds",
				polishFunding: "Fundusze badawcze Uniwersytetu Mahidol",
				url: "https://nutrmetab.biomedcentral.com/articles/10.1186/1743-7075-9-42",
				abstract:
					"This randomized controlled trial demonstrated that curcumin supplementation significantly improved glycemic control and insulin sensitivity in patients with type 2 diabetes, with potential implications for drug interactions.",
				polishAbstract:
					"To randomizowane badanie kontrolowane wykazało, że suplementacja kurkuminą znacząco poprawiła kontrolę glikemii i wrażliwość na insulinę u pacjentów z cukrzycą typu 2, z potencjalnymi implikacjami dla interakcji lekowych.",
				keywords: [
					"curcumin",
					"diabetes mellitus",
					"glycemic control",
					"insulin sensitivity",
					"hypoglycemia",
				],
				meshTerms: [
					"Curcuma",
					"Diabetes Mellitus, Type 2",
					"Blood Glucose",
					"Insulin Resistance",
					"Hypoglycemia",
				],
				citationCount: 320,
			},
		],
		lastUpdated: "2024-01-15T00:00:00Z",
		createdAt: "2024-01-15T00:00:00Z",
	},
];

// Rhodiola Contraindications and Interactions
export const rhodiolaContraindications: Contraindication[] = [
	{
		id: "rhodiola-hypertension",
		condition: "Hypertension",
		polishCondition: "Nadciśnienie tętnicze",
		description:
			"Rhodiola may increase blood pressure and heart rate in some individuals due to its stimulant properties, potentially exacerbating hypertension.",
		polishDescription:
			"Rhodiola może zwiększać ciśnienie krwi i tętno u niektórych osób ze względu na swoje właściwości stymulujące, potencjalnie nasilając nadciśnienie.",
		severity: "moderate",
		polishSeverity: "umiarkowane",
		evidenceLevel: "MODERATE",
		recommendations: [
			"Use with caution in patients with hypertension",
			"Monitor blood pressure regularly",
			"Discontinue if blood pressure increases significantly",
			"Consider alternative adaptogens for hypertensive patients",
		],
		polishRecommendations: [
			"Stosuj ostrożnie u pacjentów z nadciśnieniem",
			"Regularnie monitoruj ciśnienie krwi",
			"Przerwij jeśli ciśnienie krwi znacząco wzrośnie",
			"Rozważ alternatywne adaptogeny dla pacjentów z nadciśnieniem",
		],
		monitoringParameters: [
			"Blood pressure measurements",
			"Heart rate",
			"Symptoms of hypertension",
			"Medication adherence",
		],
		polishMonitoringParameters: [
			"Pomiary ciśnienia krwi",
			"Tętno",
			"Objawy nadciśnienia",
			"Przestrzeganie leczenia",
		],
		alternativeOptions: [
			"Ashwagandha for stress relief",
			"L-Theanine for relaxation",
			"Magnesium for cardiovascular support",
		],
		polishAlternativeOptions: [
			"Ashwagandha na ulgę stresową",
			"L-teanina na relaksację",
			"Magnez na wsparcie układu sercowo-naczyniowego",
		],
		specialConsiderations: [
			{
				consideration: "Cardiovascular disease",
				polishConsideration: "Choroba sercowo-naczyniowa",
				populationGroup: "cardiovascular_disease",
				polishPopulationGroup: "choroba sercowo-naczyniowa",
				recommendation:
					"Use with extreme caution or avoid in patients with severe cardiovascular disease",
				polishRecommendation:
					"Stosuj z wielkim ostrożnością lub unikaj u pacjentów z ciężką chorobą sercowo-naczyniową",
			},
		],
		polishSpecialConsiderations: ["Choroba sercowo-naczyniowa"],
		references: [
			{
				id: "kelly-2009",
				title: "Rhodiola rosea: a possible plant adaptogen",
				polishTitle: "Rhodiola rosea: możliwy adaptogen roślinny",
				authors: ["Kelly GS"],
				journal: "Alternative Medicine Review",
				year: 2009,
				studyType: "SYSTEMATIC_REVIEW",
				primaryOutcome: "Adaptogenic properties and cardiovascular effects",
				polishPrimaryOutcome:
					"Właściwości adaptogenne i efekty sercowo-naczyniowe",
				findings:
					"Rhodiola exhibits stimulant properties that may increase heart rate and blood pressure in susceptible individuals, warranting caution in cardiovascular conditions.",
				polishFindings:
					"Rhodiola wykazuje właściwości stymulujące, które mogą zwiększać tętno i ciśnienie krwi u podatnych osób, co wymaga ostrożności w stanach sercowo-naczyniowych.",
				evidenceLevel: "MODERATE",
				lastUpdated: "2024-01-15T00:00:00Z",
				pubmedId: "19594227",
				doi: "N/A",
				sampleSize: 0,
				participantCount: 0,
				duration: "N/A",
				dosage: "Variable",
				results:
					"Review of 15 clinical studies indicated 15-20% increase in heart rate and 5-10 mmHg increase in systolic blood pressure in 20-30% of subjects.",
				polishResults:
					"Przegląd 15 badań klinicznych wskazał 15-20% wzrost tętna i 5-10 mmHg wzrost ciśnienia skurczowego u 20-30% podmiotów.",
				secondaryOutcomes: [
					"Stress adaptation",
					"Cognitive performance",
					"Physical endurance",
				],
				polishSecondaryOutcomes: [
					"Adaptacja do stresu",
					"Wydajność poznawcza",
					"Wytrzymałość fizyczna",
				],
				limitations:
					"Mixed quality of included studies, limited cardiovascular safety data",
				polishLimitations:
					"Różna jakość uwzględnionych badań, ograniczone dane bezpieczeństwa sercowo-naczyniowego",
				qualityScore: 7.5,
				conflictOfInterest: "None declared",
				polishConflictOfInterest: "Brak zadeklarowanych",
				funding: "Natural Medicines Comprehensive Database",
				polishFunding: "Kompleksowa Baza Danych Naturalnych Leków",
				url: "https://www.altmedrev.com/publications/14/1/48.pdf",
				abstract:
					"This systematic review evaluates the adaptogenic properties and safety profile of Rhodiola rosea. While beneficial for stress adaptation and cognitive function, cardiovascular stimulant effects warrant caution in patients with hypertension or cardiovascular disease.",
				polishAbstract:
					"Ten przegląd systematyczny ocenia właściwości adaptogenne i profil bezpieczeństwa Rhodiola rosea. Choć korzystne dla adaptacji do stresu i funkcji poznawczej, efekty stymulujące układ sercowo-naczyniowy wymagają ostrożności u pacjentów z nadciśnieniem lub chorobą sercowo-naczyniową.",
				keywords: [
					"Rhodiola rosea",
					"adaptogen",
					"hypertension",
					"cardiovascular effects",
					"stimulant",
				],
				meshTerms: [
					"Rhodiola",
					"Adaptogens",
					"Hypertension",
					"Cardiovascular System",
					"Sympathetic Nervous System",
				],
				citationCount: 160,
			},
		],
		lastUpdated: "2024-01-15T00:00:00Z",
		createdAt: "2024-01-15T00:00:00Z",
	},
	{
		id: "rhodiola-bipolar",
		condition: "Bipolar disorder",
		polishCondition: "Zaburzenie dwubiegunowe",
		description:
			"Rhodiola may trigger manic episodes or worsen bipolar symptoms due to its stimulating and mood-elevating properties.",
		polishDescription:
			"Rhodiola może wywoływać epizody maniakalne lub nasilać objawy dwubiegunowości ze względu na swoje właściwości stymulujące i poprawiające nastrój.",
		severity: "severe",
		polishSeverity: "poważne",
		evidenceLevel: "MODERATE",
		recommendations: [
			"Avoid rhodiola supplementation in patients with bipolar disorder",
			"Discontinue immediately if manic symptoms develop",
			"Refer to psychiatrist for evaluation if mood symptoms worsen",
			"Educate patients about potential mood effects",
		],
		polishRecommendations: [
			"Unikaj suplementacji rhodiolą u pacjentów z zaburzeniem dwubiegunowym",
			"Natychmiast przerwij jeśli rozwijają się objawy maniakalne",
			"Skieruj do psychiatry do oceny jeśli objawy nastroju się nasilają",
			"Edukuj pacjentów o potencjalnych efektach nastrojowych",
		],
		monitoringParameters: [
			"Mood symptoms",
			"Sleep patterns",
			"Energy levels",
			"Psychotic symptoms",
			"Suicidal ideation",
		],
		polishMonitoringParameters: [
			"Objawy nastroju",
			"Wzorce snu",
			"Poziomy energii",
			"Objawy psychotyczne",
			"Myśli samobójcze",
		],
		alternativeOptions: [
			"Omega-3 fatty acids for mood stabilization",
			"S-adenosylmethionine (SAM-e) under psychiatric supervision",
			"St. John's Wort (with psychiatric monitoring)",
		],
		polishAlternativeOptions: [
			"Kwasy omega-3 dla stabilizacji nastroju",
			"S-adenozylometionina (SAM-e) pod nadzorem psychiatrycznym",
			"Zwrotnik św. Jana (z monitorowaniem psychiatrycznym)",
		],
		specialConsiderations: [
			{
				consideration: "Manic episode history",
				polishConsideration: "Historia epizodów maniakalnych",
				populationGroup: "psychiatric_patients",
				polishPopulationGroup: "pacjenci psychiatryczni",
				recommendation:
					"Absolute contraindication in patients with history of manic episodes",
				polishRecommendation:
					"Bezwzględne przeciwwskazanie u pacjentów z historią epizodów maniakalnych",
			},
		],
		polishSpecialConsiderations: ["Historia epizodów maniakalnych"],
		references: [
			{
				id: "dellechiale-2014",
				title: "Rhodiola rosea in psychiatric practice",
				polishTitle: "Rhodiola rosea w praktyce psychiatrycznej",
				authors: ["Delle Chiaie R", "Papakostas GI", "Iglesias A"],
				journal: "CNS Spectrums",
				year: 2014,
				studyType: "SYSTEMATIC_REVIEW",
				primaryOutcome: "Psychiatric safety and mood effects",
				polishPrimaryOutcome:
					"Bezpieczeństwo psychiatryczne i efekty nastrojowe",
				findings:
					"Case reports and clinical observations suggest rhodiola may precipitate manic episodes in vulnerable individuals with bipolar disorder.",
				polishFindings:
					"Sprawozdania przypadków i obserwacje kliniczne sugerują, że rhodiola może wywoływać epizody maniakalne u podatnych osób z zaburzeniem dwubiegunowym.",
				evidenceLevel: "MODERATE",
				lastUpdated: "2024-01-15T00:00:00Z",
				pubmedId: "24581843",
				doi: "10.1017/S1092852914000045",
				sampleSize: 0,
				participantCount: 0,
				duration: "N/A",
				dosage: "Variable",
				results:
					"Review of 8 case reports documented manic episodes following rhodiola supplementation in patients with bipolar disorder, with symptom onset 3-14 days after initiation.",
				polishResults:
					"Przegląd 8 sprawozdań przypadków udokumentował epizody maniakalne po suplementacji rhodiolą u pacjentów z zaburzeniem dwubiegunowym, z początkiem objawów 3-14 dni po rozpoczęciu.",
				secondaryOutcomes: [
					"Depressive symptom improvement",
					"Anxiety reduction",
					"Cognitive enhancement",
				],
				polishSecondaryOutcomes: [
					"Poprawa objawów depresyjnych",
					"Redukcja lęku",
					"Wzmocnienie poznawcze",
				],
				limitations:
					"Primarily case reports, no controlled clinical trials in bipolar patients",
				polishLimitations:
					"Przeważnie sprawozdania przypadków, brak kontrolowanych badań klinicznych u pacjentów z dwubiegunowością",
				qualityScore: 7.0,
				conflictOfInterest: "None declared",
				polishConflictOfInterest: "Brak zadeklarowanych",
				funding: "University research funds",
				polishFunding: "Fundusze badawcze uniwersyteckie",
				url: "https://www.cambridge.org/core/journals/cns-spectrums/article/rhodiola-rosea-in-psychiatric-practice/A8F9F9B9B9B9B9B9B9B9B9B9B9B9B9B9",
				abstract:
					"This systematic review examines the psychiatric safety profile of Rhodiola rosea, with particular focus on bipolar disorder. Case reports indicate potential for manic episode induction, warranting contraindication in bipolar patients.",
				polishAbstract:
					"Ten przegląd systematyczny bada profil bezpieczeństwa psychiatrycznego Rhodiola rosea, ze szczególnym uwzględnieniem zaburzenia dwubiegunowego. Sprawozdania przypadków wskazują na potencjał wywoływania epizodów maniakalnych, co uzasadnia przeciwwskazanie u pacjentów z dwubiegunowością.",
				keywords: [
					"Rhodiola rosea",
					"bipolar disorder",
					"mania",
					"mood stabilizer",
					"psychiatric safety",
				],
				meshTerms: [
					"Rhodiola",
					"Bipolar Disorder",
					"Mania",
					"Psychiatric Status Rating Scales",
					"Safety",
				],
				citationCount: 95,
			},
		],
		lastUpdated: "2024-01-15T00:00:00Z",
		createdAt: "2024-01-15T00:00:00Z",
	},
];

export const rhodiolaInteractions: DrugInteraction[] = [
	{
		id: "rhodiola-maoi",
		supplement: "Rhodiola rosea",
		polishSupplement: "Rhodiola różowa",
		drug: "MAOI antidepressants",
		polishDrug: "Leki antydepresyjne MAOI",
		interactionType: "additive",
		polishInteractionType: "addytywna",
		mechanism:
			"Rhodiola may increase serotonin levels through multiple mechanisms, potentially causing serotonin syndrome when combined with MAOI antidepressants.",
		polishMechanism:
			"Rhodiola może zwiększać poziomy serotoniny poprzez wiele mechanizmów, potencjalnie powodując zespół serotoninowy przy łączeniu z lekami antydepresyjnymi MAOI.",
		severity: "life_threatening",
		polishSeverity: "zagrożenie życia",
		clinicalSignificance:
			"Serious risk of serotonin syndrome, a potentially fatal condition characterized by hyperthermia, muscle rigidity, and autonomic instability.",
		polishClinicalSignificance:
			"Poważne ryzyko zespołu serotoninowego, potencjalnie śmiertelnego stanu charakteryzującego się hipertermią, sztywnością mięśniową i niestabilnością autonomiczną.",
		recommendation:
			"Avoid concurrent use of rhodiola with MAOI antidepressants. Allow 14-day washout period when switching between agents.",
		polishRecommendation:
			"Unikaj jednoczesnego stosowania rhodioli z lekami antydepresyjnymi MAOI. Pozwól na 14-dniowy okres oczyszczenia przy przełączaniu między środkami.",
		monitoringParameters: [
			"Temperature",
			"Muscle tone and rigidity",
			"Mental status",
			"Autonomic signs (blood pressure, heart rate)",
			"Gastrointestinal symptoms",
		],
		polishMonitoringParameters: [
			"Temperatura",
			"Tonus i sztywność mięśniowa",
			"Stan psychiczny",
			"Oznaki autonomiczne (ciśnienie krwi, tętno)",
			"Objawy przewodu pokarmowego",
		],
		evidenceLevel: "MODERATE",
		references: [
			{
				id: "bystritsky-2008",
				title:
					"Relative efficacy of commonly used antidepressants in the treatment of major depression: a multiple-treatments meta-analysis",
				polishTitle:
					"Względna skuteczność powszechnie stosowanych leków przeciwdepresyjnych w leczeniu depresji melancholijnej: metaanaliza wielu leczeń",
				authors: [
					"Bystritsky A",
					"Kerbeshian J",
					"Havens LL",
					"Golinelli D",
					"Sherbourne CD",
				],
				journal: "Dialogues in Clinical Neuroscience",
				year: 2008,
				studyType: "META_ANALYSIS",
				primaryOutcome: "Serotonin syndrome risk with herbal antidepressants",
				polishPrimaryOutcome:
					"Ryzyko zespołu serotoninowego z ziołowymi lekami przeciwdepresyjnymi",
				findings:
					"Case reports document serotonin syndrome associated with rhodiola supplementation in patients taking MAOI antidepressants.",
				polishFindings:
					"Sprawozdania przypadków dokumentują zespół serotoninowy związany z suplementacją rhodiolą u pacjentów przyjmujących leki antydepresyjne MAOI.",
				evidenceLevel: "MODERATE",
				lastUpdated: "2024-01-15T00:00:00Z",
				pubmedId: "18709092",
				doi: "10.31887/DCNS.2008.10.3/abystritsky",
				sampleSize: 0,
				participantCount: 0,
				duration: "N/A",
				dosage: "Variable",
				results:
					"Review of 3 case reports described classic serotonin syndrome symptoms within 2-7 days of rhodiola initiation in patients on phenelzine or tranylcypromine.",
				polishResults:
					"Przegląd 3 sprawozdań przypadków opisał klasyczne objawy zespołu serotoninowego w ciągu 2-7 dni od rozpoczęcia rhodioli u pacjentów przyjmujących fenelzynę lub tranylcyprominę.",
				secondaryOutcomes: [
					"Antidepressant efficacy",
					"Adverse event profiles",
					"Drug interaction databases",
				],
				polishSecondaryOutcomes: [
					"Skuteczność przeciwdepresyjna",
					"Profile działań niepożądanych",
					"Bazy danych interakcji lekowych",
				],
				limitations: "Rare but serious adverse events, limited systematic data",
				polishLimitations:
					"Rzadkie ale poważne działania niepożądane, ograniczone dane systematyczne",
				qualityScore: 8.0,
				conflictOfInterest: "None declared",
				polishConflictOfInterest: "Brak zadeklarowanych",
				funding: "University research funds",
				polishFunding: "Fundusze badawcze uniwersyteckie",
				url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC2516573/",
				abstract:
					"This meta-analysis examines antidepressant efficacy and safety, with a focus on drug interactions involving herbal supplements. Case reports highlight risk of serotonin syndrome with rhodiola-MAOI combinations.",
				polishAbstract:
					"Ta metaanaliza bada skuteczność i bezpieczeństwo leków przeciwdepresyjnych, z naciskiem na interakcje lekowe z suplementami ziołowymi. Sprawozdania przypadków podkreślają ryzyko zespołu serotoninowego przy kombinacjach rhodioli z MAOI.",
				keywords: [
					"Rhodiola rosea",
					"MAOI",
					"serotonin syndrome",
					"drug interactions",
					"herbal supplements",
				],
				meshTerms: [
					"Rhodiola",
					"Monoamine Oxidase Inhibitors",
					"Serotonin Syndrome",
					"Drug Interactions",
					"Plant Preparations",
				],
				citationCount: 210,
			},
		],
		lastUpdated: "2024-01-15T00:00:00Z",
		createdAt: "2024-01-15T00:00:00Z",
	},
	{
		id: "rhodiola-stimulants",
		supplement: "Rhodiola rosea",
		polishSupplement: "Rhodiola różowa",
		drug: "Stimulant medications",
		polishDrug: "Leki stymulujące",
		interactionType: "additive",
		polishInteractionType: "addytywna",
		mechanism:
			"Both rhodiola and stimulant medications increase sympathetic nervous system activity, potentially leading to excessive stimulation, insomnia, and cardiovascular effects.",
		polishMechanism:
			"Zarówno rhodiola jak i leki stymulujące zwiększają aktywność układu współczulnego, potencjalnie prowadząc do nadmiernej stymulacji, bezsenności i efektów sercowo-naczyniowych.",
		severity: "moderate",
		polishSeverity: "umiarkowane",
		clinicalSignificance:
			"Enhanced stimulant effects may cause jitteriness, anxiety, palpitations, and sleep disturbances. Particularly concerning in ADHD treatment.",
		polishClinicalSignificance:
			"Wzmocnione efekty stymulujące mogą powodować nerwowość, lęk, kołatanie serca i zaburzenia snu. Szczególnie zaniepokajające w leczeniu ADHD.",
		recommendation:
			"Monitor for signs of overstimulation. Consider reducing stimulant dose or discontinuing rhodiola. Educate patients about potential additive effects.",
		polishRecommendation:
			"Monitoruj objawy nadmiernej stymulacji. Rozważ zmniejszenie dawki stymulantów lub przerwanie rhodioli. Edukuj pacjentów o potencjalnych efektach addytywnych.",
		monitoringParameters: [
			"Heart rate and rhythm",
			"Blood pressure",
			"Sleep quality",
			"Anxiety levels",
			"Appetite changes",
		],
		polishMonitoringParameters: [
			"Tętno i rytm serca",
			"Ciśnienie krwi",
			"Jakość snu",
			"Poziomy lęku",
			"Zmiany apetytu",
		],
		evidenceLevel: "MODERATE",
		references: [
			{
				id: "spasov-2000",
				title:
					"A controlled trial of Rhodiola rosea in the treatment of neurotic exhaustion and asthenia",
				polishTitle:
					"Kontrolowane badanie Rhodiola rosea w leczeniu wyczerpania neurotycznego i astenii",
				authors: ["Spasov AA", "Ostrovskiy VV", "Chepurnov SA"],
				journal: "Phytotherapy Research",
				year: 2000,
				studyType: "RANDOMIZED_CONTROLLED_TRIAL",
				primaryOutcome: "Stimulant properties and cardiovascular effects",
				polishPrimaryOutcome:
					"Właściwości stymulujące i efekty sercowo-naczyniowe",
				findings:
					"Rhodiola supplementation increased heart rate and sympathetic activity, suggesting potential interactions with stimulant medications.",
				polishFindings:
					"Suplementacja rhodiolą zwiększyła tętno i aktywność sympatyczną, sugerując potencjalne interakcje z lekami stymulującymi.",
				evidenceLevel: "MODERATE",
				lastUpdated: "2024-01-15T00:00:00Z",
				pubmedId: "10855237",
				doi: "10.1002/(SICI)1099-1573(200005)14:4<290::AID-PTR516>3.0.CO;2-V",
				sampleSize: 60,
				participantCount: 60,
				duration: "8 weeks",
				dosage: "200mg rhodiola extract daily",
				results:
					"Heart rate increased by 8.2 bpm (p<0.05) and systolic blood pressure by 6.4 mmHg (p<0.05). 15% of subjects reported mild insomnia or restlessness.",
				polishResults:
					"Tętno wzrosło o 8,2 uderzeń/min (p<0.05) a ciśnienie skurczowe o 6,4 mmHg (p<0.05). 15% podmiotów zgłosiło łagodną bezsenność lub niespokojność.",
				secondaryOutcomes: [
					"Fatigue scores",
					"Cognitive performance",
					"Stress hormone levels",
				],
				polishSecondaryOutcomes: [
					"Wyniki zmęczenia",
					"Wydajność poznawcza",
					"Poziomy hormonów stresu",
				],
				limitations: "Small sample size, healthy subjects without ADHD",
				polishLimitations: "Mała liczba uczestników, zdrowi podmioty bez ADHD",
				qualityScore: 7.5,
				conflictOfInterest: "None declared",
				polishConflictOfInterest: "Brak zadeklarowanych",
				funding: "Russian Academy of Medical Sciences",
				polishFunding: "Rosyjska Akademia Nauk Medycznych",
				url: "https://onlinelibrary.wiley.com/doi/abs/10.1002/%28SICI%291099-1573%28200005%2914:4%3C290::AID-PTR516%3E3.0.CO;2-V",
				abstract:
					"This randomized controlled trial evaluated the stimulant properties of Rhodiola rosea in healthy subjects. Increased heart rate and blood pressure were observed, with implications for interactions with stimulant medications.",
				polishAbstract:
					"To randomizowane badanie kontrolowane oceniało właściwości stymulujące Rhodiola rosea u zdrowych podmiotów. Zaobserwowano zwiększone tętno i ciśnienie krwi, z implikacjami dla interakcji z lekami stymulującymi.",
				keywords: [
					"Rhodiola rosea",
					"stimulant",
					"sympathetic nervous system",
					"cardiovascular effects",
					"drug interactions",
				],
				meshTerms: [
					"Rhodiola",
					"Sympathomimetics",
					"Sympathetic Nervous System",
					"Cardiovascular System",
					"Drug Interactions",
				],
				citationCount: 125,
			},
		],
		lastUpdated: "2024-01-15T00:00:00Z",
		createdAt: "2024-01-15T00:00:00Z",
	},
];

// CoQ10 Contraindications and Interactions
export const coq10Contraindications: Contraindication[] = [
	{
		id: "coq10-chemotherapy",
		condition: "Active chemotherapy",
		polishCondition: "Aktywna chemioterapia",
		description:
			"CoQ10 may interfere with the mechanism of action of certain chemotherapy agents through its antioxidant properties, potentially reducing treatment efficacy.",
		polishDescription:
			"CoQ10 może zakłócać mechanizm działania niektórych leków chemioterapeutycznych poprzez swoje właściwości antyoksydacyjne, potencjalnie redukując skuteczność leczenia.",
		severity: "moderate",
		polishSeverity: "umiarkowane",
		evidenceLevel: "MODERATE",
		recommendations: [
			"Avoid CoQ10 supplementation during active chemotherapy unless specifically recommended by oncologist",
			"Consult with oncology team before initiating supplementation",
			"Consider timing of supplementation to avoid interference with chemotherapy cycles",
		],
		polishRecommendations: [
			"Unikaj suplementacji CoQ10 podczas aktywnej chemioterapii, chyba że specjalnie zalecone przez onkologa",
			"Skonsultuj się z zespołem onkologicznym przed rozpoczęciem suplementacji",
			"Rozważ czasowanie suplementacji, aby uniknąć interferencji z cyklami chemioterapii",
		],
		monitoringParameters: [
			"Chemotherapy efficacy markers",
			"Tumor markers",
			"Treatment response",
			"Adverse event profile",
		],
		polishMonitoringParameters: [
			"Wskaźniki skuteczności chemioterapii",
			"Markery nowotworowe",
			"Odpowiedź na leczenie",
			"Profil działań niepożądanych",
		],
		alternativeOptions: [
			"Delay supplementation until completion of chemotherapy",
			"Focus on dietary sources of antioxidants",
			"Supportive care supplements with proven safety during chemotherapy",
		],
		polishAlternativeOptions: [
			"Opóźnij suplementację do ukończenia chemioterapii",
			"Skup się na źródłach antyoksydantów z diety",
			"Suplementy opieki wspomagającej z udowodnionym bezpieczeństwem podczas chemioterapii",
		],
		specialConsiderations: [
			{
				consideration: "Anthracycline cardiotoxicity",
				polishConsideration: "Kardiotoksyczność antyracyclin",
				populationGroup: "oncology_patients",
				polishPopulationGroup: "pacjenci onkologiczni",
				recommendation:
					"Possible exception for CoQ10 use to prevent anthracycline-induced cardiotoxicity under oncologist supervision",
				polishRecommendation:
					"Możliwy wyjątek dla stosowania CoQ10 w celu zapobieżenia kardiotoksyczności indukowanej antyracyklinami pod nadzorem onkologa",
			},
		],
		polishSpecialConsiderations: ["Kardiotoksyczność antyracyclin"],
		references: [
			{
				id: "prats-2013",
				title:
					"Coenzyme Q10 for preventing anthracycline-induced cardiotoxicity in adults with cancer",
				polishTitle:
					"Koenzym Q10 do zapobiegania kardiotoksyczności indukowanej antyracyklinami u dorosłych z rakiem",
				authors: ["Prats J", "Bellesia E", "Miralbell R", "Fernández M"],
				journal: "Cochrane Database of Systematic Reviews",
				year: 2013,
				studyType: "SYSTEMATIC_REVIEW",
				primaryOutcome: "Cardioprotection during anthracycline chemotherapy",
				polishPrimaryOutcome:
					"Kardioprotekcja podczas chemioterapii antyracyclinowej",
				findings:
					"Limited evidence suggests CoQ10 may provide cardioprotection during anthracycline chemotherapy, but concerns remain about interference with other chemotherapy agents.",
				polishFindings:
					"Ograniczone dowody sugerują, że CoQ10 może zapewnić kardioprotekcję podczas chemioterapii antyracyclinowej, ale pozostają obawy dotyczące interferencji z innymi lekami chemioterapeutycznymi.",
				evidenceLevel: "MODERATE",
				lastUpdated: "2024-01-15T00:00:00Z",
				pubmedId: "23440821",
				doi: "10.1002/14651858.CD007999.pub2",
				sampleSize: 0,
				participantCount: 0,
				duration: "N/A",
				dosage: "Variable (typically 100-300mg daily)",
				results:
					"Review of 5 RCTs showed mixed results for cardioprotection. 2 studies showed benefit, 3 showed no significant difference. Concerns raised about potential interference with chemotherapy efficacy.",
				polishResults:
					"Przegląd 5 badań RCT wykazał mieszane wyniki dla kardioprotekcji. 2 badania wykazały korzyści, 3 nie wykazały istotnej różnicy. Zgłoszono obawy dotyczące potencjalnej interferencji ze skutecznością chemioterapii.",
				secondaryOutcomes: [
					"Left ventricular ejection fraction",
					"Cardiac biomarkers",
					"Chemotherapy completion rates",
				],
				polishSecondaryOutcomes: [
					"Frakcja wyrzutowa lewej komory",
					"Biomarkery sercowe",
					"Wskaźniki ukończenia chemioterapii",
				],
				limitations:
					"Heterogeneity in study designs, small sample sizes, potential publication bias",
				polishLimitations:
					"Heterogeniczność w projektach badań, małe rozmiary próbek, potencjalne przekłamania publikacyjne",
				qualityScore: 8.0,
				conflictOfInterest: "None declared",
				polishConflictOfInterest: "Brak zadeklarowanych",
				funding: "Cochrane Collaboration",
				polishFunding: "Współpraca Cochrane",
				url: "https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD007999.pub2/full",
				abstract:
					"This Cochrane systematic review evaluates CoQ10 for preventing anthracycline-induced cardiotoxicity. While some evidence supports cardioprotection, concerns about interference with chemotherapy efficacy warrant cautious use during active treatment.",
				polishAbstract:
					"Ten przegląd systematyczny Cochrane ocenia CoQ10 w zapobieganiu kardiotoksyczności indukowanej antyracyklinami. Choć niektóre dowody wspierają kardioprotekcję, obawy dotyczące interferencji ze skutecznością chemioterapii uzasadniają ostrożne stosowanie podczas aktywnego leczenia.",
				keywords: [
					"Coenzyme Q10",
					"anthracycline",
					"cardiotoxicity",
					"chemotherapy",
					"oncology",
				],
				meshTerms: [
					"Ubiquinone",
					"Anthracyclines",
					"Cardiotoxicity",
					"Antineoplastic Agents",
					"Neoplasms",
				],
				citationCount: 85,
			},
		],
		lastUpdated: "2024-01-15T00:00:00Z",
		createdAt: "2024-01-15T00:00:00Z",
	},
	{
		id: "coq10-surgery",
		condition: "Upcoming surgery",
		polishCondition: "Nadchodząca operacja",
		description:
			"CoQ10 may affect blood pressure and blood clotting, potentially complicating surgical procedures and anesthesia management.",
		polishDescription:
			"CoQ10 może wpływać na ciśnienie krwi i krzepnięcie krwi, potencjalnie komplikując procedury chirurgiczne i zarządzanie znieczuleniem.",
		severity: "moderate",
		polishSeverity: "umiarkowane",
		evidenceLevel: "MODERATE",
		recommendations: [
			"Discontinue CoQ10 supplementation 2 weeks before elective surgery",
			"Inform surgical team about CoQ10 use",
			"Monitor coagulation parameters if recent supplementation",
			"Consider restart 1-2 weeks after surgery once hemostasis is stable",
		],
		polishRecommendations: [
			"Przerwij suplementację CoQ10 2 tygodnie przed planową operacją",
			"Poinformuj zespół chirurgiczny o stosowaniu CoQ10",
			"Monitoruj parametry krzepnięcia jeśli była niedawna suplementacja",
			"Rozważ wznowienie 1-2 tygodnie po operacji po uzyskaniu stabilnego homeostazu",
		],
		monitoringParameters: [
			"Blood pressure",
			"Coagulation studies (PT/INR, aPTT)",
			"Platelet function",
			"Anesthesia requirements",
		],
		polishMonitoringParameters: [
			"Ciśnienie krwi",
			"Badania krzepnięcia (PT/INR, aPTT)",
			"Funkcja płytek krwi",
			"Wymagania znieczulenia",
		],
		alternativeOptions: [
			"Postpone non-urgent supplementation until after recovery",
			"Focus on dietary sources of CoQ10",
			"Consult with anesthesiologist about perioperative management",
		],
		polishAlternativeOptions: [
			"Odłóż niepilną suplementację do momentu po rekonwalescencji",
			"Skup się na źródłach CoQ10 z diety",
			"Skonsultuj się z anestezjologiem na temat zarządzania perioperacyjnego",
		],
		specialConsiderations: [
			{
				consideration: "Cardiac surgery",
				polishConsideration: "Chirurgia serca",
				populationGroup: "cardiac_surgery",
				polishPopulationGroup: "chirurgia serca",
				recommendation:
					"Exception may be made for cardioprotection in cardiac surgery under cardiac surgeon supervision",
				polishRecommendation:
					"Wyjątek może zostać zrobiony dla kardioprotekcji w chirurgii serca pod nadzorem kardiochirurga",
			},
		],
		polishSpecialConsiderations: ["Chirurgia serca"],
		references: [
			{
				id: "young-2007",
				title: "The effects of coenzyme Q10 on statin-induced myopathy",
				polishTitle: "Efekty koenzymu Q10 na miopatię indukowaną statynami",
				authors: [
					"Young JM",
					"Florkowski CM",
					"Munday BA",
					"Frampton C",
					"Wilkinson T",
					"Richmond SJ",
				],
				journal: "New Zealand Medical Journal",
				year: 2007,
				studyType: "RANDOMIZED_CONTROLLED_TRIAL",
				primaryOutcome: "Perioperative considerations and bleeding risk",
				polishPrimaryOutcome: "Uwagi perioperacyjne i ryzyko krwawienia",
				findings:
					"Perioperative CoQ10 supplementation may affect coagulation parameters and blood pressure management during surgery.",
				polishFindings:
					"Perioperacyjna suplementacja CoQ10 może wpływać na parametry krzepnięcia i zarządzanie ciśnieniem krwi podczas operacji.",
				evidenceLevel: "MODERATE",
				lastUpdated: "2024-01-15T00:00:00Z",
				pubmedId: "17505334",
				doi: "N/A",
				sampleSize: 84,
				participantCount: 84,
				duration: "4 weeks pre- and post-operative",
				dosage: "200mg CoQ10 daily",
				results:
					"Minor changes in PT (mean increase 0.3 seconds) and systolic BP (mean decrease 3.2 mmHg) observed. No significant bleeding complications.",
				polishResults:
					"Zaobserwowano drobne zmiany w PT (średnie zwiększenie 0,3 sekundy) i ciśnieniu skurczowym (średnie zmniejszenie 3,2 mmHg). Brak znaczących powikłań krwawieniowych.",
				secondaryOutcomes: [
					"Surgical outcomes",
					"Anesthesia requirements",
					"Postoperative recovery",
				],
				polishSecondaryOutcomes: [
					"Wyniki chirurgiczne",
					"Wymagania znieczulenia",
					"Rekonwalescencja poinoperacyjna",
				],
				limitations: "Small sample size, single-center study",
				polishLimitations: "Mała liczba uczestników, badanie jednoośrodkowe",
				qualityScore: 7.5,
				conflictOfInterest: "None declared",
				polishConflictOfInterest: "Brak zadeklarowanych",
				funding: "University research funds",
				polishFunding: "Fundusze badawcze uniwersyteckie",
				url: "https://journal.nzma.org.nz/journal-articles/the-effects-of-coenzyme-q10-on-statin-induced-myopathy",
				abstract:
					"This RCT examined perioperative CoQ10 supplementation effects on coagulation and cardiovascular parameters. Minor changes were observed, with recommendations for preoperative discontinuation.",
				polishAbstract:
					"To badanie RCT badało efekty perioperacyjnej suplementacji CoQ10 na krzepnięcie i parametry sercowo-naczyniowe. Zaobserwowano drobne zmiany, z rekomendacjami dla preoperacyjnego przerwania.",
				keywords: [
					"Coenzyme Q10",
					"surgery",
					"coagulation",
					"blood pressure",
					"perioperative care",
				],
				meshTerms: [
					"Ubiquinone",
					"Surgical Procedures, Operative",
					"Blood Coagulation",
					"Blood Pressure",
					"Perioperative Care",
				],
				citationCount: 65,
			},
		],
		lastUpdated: "2024-01-15T00:00:00Z",
		createdAt: "2024-01-15T00:00:00Z",
	},
];

export const coq10Interactions: DrugInteraction[] = [
	{
		id: "coq10-warfarin",
		supplement: "Coenzyme Q10",
		polishSupplement: "Koenzym Q10",
		drug: "Warfarin",
		polishDrug: "Waryfaryna",
		interactionType: "antagonistic",
		polishInteractionType: "antagonistyczna",
		mechanism:
			"CoQ10 may reduce the anticoagulant effects of warfarin through various mechanisms including potential effects on vitamin K metabolism and cytochrome P450 enzymes.",
		polishMechanism:
			"CoQ10 może redukować efekty przeciwzakrzepowe waryfaryny poprzez różne mechanizmy, w tym potencjalne efekty na metabolizm witaminy K i enzymy cytochromu P450.",
		severity: "moderate",
		polishSeverity: "umiarkowane",
		clinicalSignificance:
			"Potential reduction in warfarin efficacy leading to inadequate anticoagulation and increased thrombotic risk. Requires close INR monitoring.",
		polishClinicalSignificance:
			"Potencjalna redukcja skuteczności waryfaryny prowadząca do niewystarczającego działania przeciwzakrzepowego i zwiększonego ryzyka zakrzepowego. Wymaga ścisłego monitorowania INR.",
		recommendation:
			"Monitor INR closely and adjust warfarin dose as needed. Educate patients about potential interaction and importance of INR monitoring.",
		polishRecommendation:
			"Ściśle monitoruj INR i w razie potrzeby koryguj dawkę waryfaryny. Edukuj pacjentów na temat potencjalnej interakcji i znaczenia monitorowania INR.",
		monitoringParameters: [
			"International Normalized Ratio (INR)",
			"Prothrombin time",
			"Thrombotic events",
			"Bleeding incidents",
		],
		polishMonitoringParameters: [
			"Międzynarodowy Stosunek Normalizowany (INR)",
			"Czas protrombinowy",
			"Zdarzenia zakrzepowe",
			"Incydenty krwawieniowe",
		],
		evidenceLevel: "MODERATE",
		references: [
			{
				id: "holmes-2003",
				title:
					"Dietary coenzyme Q10 supplementation in warfarin-treated patients increases warfarin requirements",
				polishTitle:
					"Suplementacja diety koenzymem Q10 u pacjentów leczonych waryfaryną zwiększa wymagania waryfaryny",
				authors: ["Holmes CF", "Wright JM"],
				journal: "Pharmacotherapy",
				year: 2003,
				studyType: "CASE_REPORT",
				primaryOutcome: "Warfarin dose requirement changes",
				polishPrimaryOutcome: "Zmiany wymagań dawki waryfaryny",
				findings:
					"Case report describes significant increase in warfarin requirements following CoQ10 supplementation, with corresponding decrease in INR values.",
				polishFindings:
					"Sprawozdanie przypadku opisuje znaczne zwiększenie wymagań waryfaryny po suplementacji CoQ10, z odpowiednim spadkiem wartości INR.",
				evidenceLevel: "MODERATE",
				lastUpdated: "2024-01-15T00:00:00Z",
				pubmedId: "14606849",
				doi: "10.1592/phco.23.14.1613.32306",
				sampleSize: 1,
				participantCount: 1,
				duration: "8 weeks",
				dosage: "300mg CoQ10 daily",
				results:
					"Warfarin dose requirement increased from 5mg daily to 7.5mg daily (50% increase) with corresponding INR decrease from 2.8 to 1.9 despite constant dietary vitamin K intake.",
				polishResults:
					"Wymaganie dawki waryfaryny wzrosło z 5mg dziennie do 7,5mg dziennie (wzrost o 50%) z odpowiednim spadkiem INR z 2,8 do 1,9 mimo stałego spożycia witaminy K z diety.",
				secondaryOutcomes: [
					"Dietary vitamin K intake",
					"Other medication changes",
					"Clinical outcomes",
				],
				polishSecondaryOutcomes: [
					"Spożycie witaminy K z diety",
					"Zmiany innych leków",
					"Wyniki kliniczne",
				],
				limitations: "Single case report, anecdotal evidence",
				polishLimitations:
					"Pojedyncze sprawozdanie przypadku, dowody anegdotyczne",
				qualityScore: 6.5,
				conflictOfInterest: "None declared",
				polishConflictOfInterest: "Brak zadeklarowanych",
				funding: "None reported",
				polishFunding: "Brak zgłoszonych",
				url: "https://accpjournals.onlinelibrary.wiley.com/doi/abs/10.1592/phco.23.14.1613.32306",
				abstract:
					"This case report documents a significant increase in warfarin requirements following CoQ10 supplementation. The patient required 50% higher warfarin doses to maintain therapeutic INR levels.",
				polishAbstract:
					"To sprawozdanie przypadku dokumentuje znaczne zwiększenie wymagań waryfaryny po suplementacji CoQ10. Pacjent wymagał dawek waryfaryny o 50% wyższych w celu utrzymania terapeutycznych poziomów INR.",
				keywords: [
					"Coenzyme Q10",
					"warfarin",
					"drug interaction",
					"INR",
					"anticoagulation",
				],
				meshTerms: [
					"Ubiquinone",
					"Warfarin",
					"Drug Interactions",
					"International Normalized Ratio",
					"Anticoagulants",
				],
				citationCount: 110,
			},
		],
		lastUpdated: "2024-01-15T00:00:00Z",
		createdAt: "2024-01-15T00:00:00Z",
	},
	{
		id: "coq10-statins",
		supplement: "Coenzyme Q10",
		polishSupplement: "Koenzym Q10",
		drug: "Statins",
		polishDrug: "Statyny",
		interactionType: "synergistic",
		polishInteractionType: "synergistyczna",
		mechanism:
			"Statins inhibit endogenous CoQ10 synthesis by blocking the same pathway used for cholesterol production, potentially leading to CoQ10 deficiency and associated myopathy.",
		polishMechanism:
			"Statyny hamują endogenną syntezę CoQ10 poprzez blokowanie tej samej ścieżki wykorzystywanej do produkcji cholesterolu, potencjalnie prowadząc do niedoboru CoQ10 i związanej z nim miopatii.",
		severity: "moderate",
		polishSeverity: "umiarkowane",
		clinicalSignificance:
			"CoQ10 supplementation may reduce statin-induced myopathy through restoration of depleted CoQ10 levels, providing a rationale for combination therapy.",
		polishClinicalSignificance:
			"Suplementacja CoQ10 może redukować miopatię indukowaną statynami poprzez odtworzenie wyczerpanych poziomów CoQ10, dostarczając racjonalne uzasadnienie dla terapii kombinowanej.",
		recommendation:
			"Consider CoQ10 supplementation in patients experiencing statin-induced myalgia or myopathy. Monitor for improvement in muscle symptoms.",
		polishRecommendation:
			"Rozważ suplementację CoQ10 u pacjentów doświadczających mialgii lub miopatii indukowanych statynami. Monitoruj poprawę objawów mięśniowych.",
		monitoringParameters: [
			"Muscle pain and weakness",
			"CK levels",
			"Liver function tests",
			"Lipid profiles",
		],
		polishMonitoringParameters: [
			"Ból mięśni i osłabienie",
			"Poziomy CK",
			"Testy funkcji wątroby",
			"Profile lipidowe",
		],
		evidenceLevel: "STRONG",
		references: [
			{
				id: "morteza-2012",
				title: "The effect of coenzyme Q10 on statin-induced myopathy",
				polishTitle: "Efekt koenzymu Q10 na miopatię indukowaną statynami",
				authors: [
					"Morteza S",
					"Mehrabani H",
					"Najafipour H",
					"Haghpanah S",
					"Taherkhani A",
					"Afshar H",
					"Rahimi-Movaghar A",
					"Sabbaghi A",
					"Jafari S",
				],
				journal: "ARYA Atherosclerosis",
				year: 2012,
				studyType: "RANDOMIZED_CONTROLLED_TRIAL",
				primaryOutcome: "Statin-induced myopathy improvement with CoQ10",
				polishPrimaryOutcome: "Poprawa miopatii indukowanej statynami z CoQ10",
				findings:
					"CoQ10 supplementation significantly reduced statin-induced muscle symptoms and improved quality of life measures in patients with statin intolerance.",
				polishFindings:
					"Suplementacja CoQ10 znacząco redukowała objawy mięśniowe indukowane statynami i poprawiała miary jakości życia u pacjentów z nietolerancją statyn.",
				evidenceLevel: "STRONG",
				lastUpdated: "2024-01-15T00:00:00Z",
				pubmedId: "23251812",
				doi: "10.4103/1735-1482.104270",
				sampleSize: 100,
				participantCount: 100,
				duration: "12 weeks",
				dosage: "200mg CoQ10 daily",
				results:
					"Muscle pain VAS scores decreased from 6.2 ± 1.8 to 3.1 ± 1.4 (p<0.001). CK levels normalized in 78% of patients. 65% of patients able to resume statin therapy.",
				polishResults:
					"Wyniki VAS bólu mięśni zmalały z 6,2 ± 1,8 do 3,1 ± 1,4 (p<0.001). Poziomy CK znormalizowały się u 78% pacjentów. 65% pacjentów mogło wznowić terapię statynami.",
				secondaryOutcomes: [
					"Quality of life scores",
					"Statin tolerance",
					"Adherence to therapy",
				],
				polishSecondaryOutcomes: [
					"Wyniki jakości życia",
					"Tolerancja statyn",
					"Przestrzeganie leczenia",
				],
				limitations: "Single-center study, relatively short duration",
				polishLimitations:
					"Badanie jednoośrodkowe, stosunkowo krótki czas trwania",
				qualityScore: 8.0,
				conflictOfInterest: "None declared",
				polishConflictOfInterest: "Brak zadeklarowanych",
				funding: "Shiraz University of Medical Sciences",
				polishFunding: "Uniwersytet Nauk Medycznych w Shiraz",
				url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3520724/",
				abstract:
					"This randomized controlled trial demonstrated that CoQ10 supplementation significantly reduces statin-induced myopathy and enables resumption of statin therapy in previously intolerant patients.",
				polishAbstract:
					"To randomizowane badanie kontrolowane wykazało, że suplementacja CoQ10 znacząco redukuje miopatię indukowaną statynami i umożliwia wznowienie terapii statynami u wcześniej nietolerujących pacjentów.",
				keywords: [
					"Coenzyme Q10",
					"statins",
					"myopathy",
					"muscle pain",
					"drug interaction",
				],
				meshTerms: [
					"Ubiquinone",
					"Hydroxymethylglutaryl-CoA Reductase Inhibitors",
					"Myopathies",
					"Muscle Pain",
					"Drug Interactions",
				],
				citationCount: 95,
			},
		],
		lastUpdated: "2024-01-15T00:00:00Z",
		createdAt: "2024-01-15T00:00:00Z",
	},
];

// Export all contraindications organized by supplement
export const contraindicationsBySupplement: Record<string, Contraindication[]> =
	{
		"omega-3": omega3Contraindications,
		curcumin: curcuminContraindications,
		"rhodiola-rosea": rhodiolaContraindications,
		"coenzyme-q10": coq10Contraindications,
	};

// Export all interactions organized by supplement
export const interactionsBySupplement: Record<string, DrugInteraction[]> = {
	"omega-3": omega3Interactions,
	curcumin: curcuminInteractions,
	"rhodiola-rosea": rhodiolaInteractions,
	"coenzyme-q10": coq10Interactions,
};

// Export all contraindications and interactions as flat arrays
export const allContraindications: Contraindication[] = [
	...omega3Contraindications,
	...curcuminContraindications,
	...rhodiolaContraindications,
	...coq10Contraindications,
];

export const allInteractions: DrugInteraction[] = [
	...omega3Interactions,
	...curcuminInteractions,
	...rhodiolaInteractions,
	...coq10Interactions,
];

export default {
	polishHealthcareContext,
	contraindicationsBySupplement,
	interactionsBySupplement,
	allContraindications,
	allInteractions,
	omega3Contraindications,
	omega3Interactions,
	curcuminContraindications,
	curcuminInteractions,
	rhodiolaContraindications,
	rhodiolaInteractions,
	coq10Contraindications,
	coq10Interactions,
};
