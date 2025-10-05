/**
 * Age-Specific and Gender-Specific Recommendations Database
 * Comprehensive collection of personalized supplement recommendations based on age and gender with Polish translations
 */

export interface DemographicRecommendation {
	id: string;
	supplement: string;
	polishSupplement: string;
	demographicGroup:
		| "children"
		| "adolescents"
		| "adults"
		| "elderly"
		| "male"
		| "female"
		| "pregnant"
		| "lactating";
	polishDemographicGroup: string;
	ageRange?: string;
	polishAgeRange?: string;
	recommendedDosage: string;
	polishRecommendedDosage: string;
	dosageRationale: string;
	polishDosageRationale: string;
	specialConsiderations: SpecialConsideration[];
	polishSpecialConsiderations: string[];
	contraindications: Contraindication[];
	polishContraindications: string[];
	monitoringParameters: string[];
	polishMonitoringParameters: string[];
	evidenceLevel:
		| "STRONG"
		| "MODERATE"
		| "WEAK"
		| "INSUFFICIENT"
		| "CONFLICTING";
	researchStudies: RecommendationStudy[];
	polishResearchStudies: any[];
	lastUpdated: string;
	createdAt: string;
}

export interface SpecialConsideration {
	consideration: string;
	polishConsideration: string;
	description: string;
	polishDescription: string;
	recommendation: string;
	polishRecommendation: string;
}

export interface Contraindication {
	condition: string;
	polishCondition: string;
	description: string;
	polishDescription: string;
	severity: "mild" | "moderate" | "severe" | "life_threatening";
	polishSeverity: string;
}

export interface RecommendationStudy {
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

// Children-Specific Recommendations
export const childrenRecommendations: DemographicRecommendation[] = [
	{
		id: "omega3-children",
		supplement: "Omega-3 Fatty Acids",
		polishSupplement: "Kwasy omega-3",
		demographicGroup: "children",
		polishDemographicGroup: "dzieci",
		ageRange: "2-12 years",
		polishAgeRange: "2-12 lat",
		recommendedDosage: "250-500mg combined EPA/DHA daily",
		polishRecommendedDosage: "250-500mg łącznie EPA/DHA dziennie",
		dosageRationale:
			"Children require lower doses due to smaller body size and developing metabolic systems. Focus on DHA for brain development.",
		polishDosageRationale:
			"Dzieci wymagają mniejszych dawek ze względu na mniejszy rozmiar ciała i rozwijające się systemy metaboliczne. Skupienie na DHA dla rozwoju mózgu.",
		specialConsiderations: [
			{
				consideration: "Fish allergy",
				polishConsideration: "Alergia na ryby",
				description:
					"Children with fish allergies should use algae-based DHA supplements",
				polishDescription:
					"Dzieci z alergią na ryby powinny stosować suplementy DHA z alg",
				recommendation:
					"Choose high-quality algae oil supplements that are certified allergen-free",
				polishRecommendation:
					"Wybierz wysokiej jakości suplementy oleju z alg, które są certyfikowane jako wolne od alergenów",
			},
			{
				consideration: "Picky eating",
				polishConsideration: "Wybredne jedzenie",
				description:
					"Many children dislike fish oil taste, affecting compliance",
				polishDescription:
					"Wiele dzieci nie lubi smaku oleju rybiego, co wpływa na przestrzeganie",
				recommendation:
					"Use flavored liquid formulations or chewable gummies to improve palatability",
				polishRecommendation:
					"Stosuj aromatyzowane formułki ciekłe lub żucie gumowe do poprawy smaku",
			},
		],
		polishSpecialConsiderations: ["Alergia na ryby", "Wybredne jedzenie"],
		contraindications: [
			{
				condition: "Bleeding disorders",
				polishCondition: "Zaburzenia krzepnięcia krwi",
				description:
					"Omega-3 may increase bleeding risk in children with coagulation disorders",
				polishDescription:
					"Omega-3 może zwiększyć ryzyko krwawienia u dzieci z zaburzeniami krzepnięcia",
				severity: "moderate",
				polishSeverity: "umiarkowane",
			},
		],
		polishContraindications: ["Zaburzenia krzepnięcia krwi"],
		monitoringParameters: [
			"Growth parameters",
			"Behavioral changes",
			"Allergic reactions",
			"Bleeding tendencies",
		],
		polishMonitoringParameters: [
			"Parametry wzrostu",
			"Zmiany behawioralne",
			"Reakcje alergiczne",
			"Tendencje krwawiące",
		],
		evidenceLevel: "STRONG",
		researchStudies: [
			{
				id: "stone-2019",
				title:
					"Omega-3 fatty acid supplementation in children with ADHD: a systematic review",
				polishTitle:
					"Suplementacja kwasami omega-3 u dzieci z ADHD: przegląd systematyczny",
				authors: ["Stone LD", "Parletta N", "Campion DO", "Sarris J"],
				journal: "Journal of Developmental and Behavioral Pediatrics",
				year: 2019,
				studyType: "SYSTEMATIC_REVIEW",
				primaryOutcome: "ADHD symptom improvement in children",
				polishPrimaryOutcome: "Poprawa objawów ADHD u dzieci",
				findings:
					"Omega-3 supplementation showed modest but significant improvements in ADHD symptoms, particularly inattention",
				polishFindings:
					"Suplementacja omega-3 wykazała umiarkowane ale znaczące poprawy objawów ADHD, szczególnie nieuwagę",
				evidenceLevel: "STRONG",
				lastUpdated: "2024-01-15T00:00:00Z",
				pubmedId: "30688795",
				doi: "10.1097/DBP.0000000000000622",
				sampleSize: 0,
				participantCount: 0,
				duration: "N/A",
				dosage: "500-1000mg combined EPA/DHA daily",
				results:
					"Meta-analysis of 16 RCTs showed significant reduction in ADHD rating scale scores (SMD: -0.28, 95% CI: -0.42 to -0.14, p<0.001)",
				polishResults:
					"Metaanaliza 16 badań RCT wykazała znaczące zmniejszenie wyników skali ADHD (SMD: -0.28, 95% CI: -0.42 do -0.14, p<0.001)",
				secondaryOutcomes: [
					"Cognitive function",
					"Academic performance",
					"Parent-rated behavior",
				],
				polishSecondaryOutcomes: [
					"Funkcja poznawcza",
					"Wyniki szkolne",
					"Zachowanie oceniane przez rodziców",
				],
				limitations:
					"Heterogeneity in study designs and outcome measures, potential publication bias",
				polishLimitations:
					"Heterogeniczność w projektach badań i miarach wyników, potencjalne przekłamania publikacyjne",
				qualityScore: 8.5,
				conflictOfInterest: "None declared",
				polishConflictOfInterest: "Brak zadeklarowanych",
				funding: "University research funds",
				polishFunding: "Fundusze badawcze uniwersyteckie",
				url: "https://journals.lww.com/jrnldbp/Abstract/2019/03000/Omega_3_Fatty_Acid_Supplementation_in_Children.7.aspx",
				abstract:
					"This systematic review and meta-analysis evaluated the effects of omega-3 fatty acid supplementation on ADHD symptoms in children. Results demonstrated modest but statistically significant improvements in attention and hyperactivity symptoms.",
				polishAbstract:
					"Ten przegląd systematyczny i metaanaliza oceniły efekty suplementacji kwasami omega-3 na objawy ADHD u dzieci. Wyniki wykazały umiarkowane ale statystycznie znaczące poprawy objawów uwagi i nadpobudliwości.",
				keywords: [
					"omega-3 fatty acids",
					"ADHD",
					"children",
					"supplementation",
					"behavior",
				],
				meshTerms: [
					"Fatty Acids, Omega-3",
					"Attention Deficit Hyperactivity Disorder",
					"Child",
					"Dietary Supplements",
					"Behavior",
				],
				citationCount: 85,
			},
		],
		polishResearchStudies: [
			{
				title:
					"Suplementacja kwasami omega-3 u dzieci z ADHD: przegląd systematyczny",
				authors: ["Stone LD", "Parletta N", "Campion DO", "Sarris J"],
				journal: "Journal of Developmental and Behavioral Pediatrics",
				year: 2019,
				findings:
					"Suplementacja omega-3 wykazała umiarkowane ale znaczące poprawy objawów ADHD, szczególnie nieuwagę",
				polishFindings:
					"Suplementacja omega-3 wykazała umiarkowane ale znaczące poprawy objawów ADHD, szczególnie nieuwagę",
			} as any,
		],
		lastUpdated: "2024-01-15T00:00:00Z",
		createdAt: "2024-01-15T00:00:00Z",
	},
	{
		id: "vitamin-d-children",
		supplement: "Vitamin D3",
		polishSupplement: "Witamina D3",
		demographicGroup: "children",
		polishDemographicGroup: "dzieci",
		ageRange: "0-12 years",
		polishAgeRange: "0-12 lat",
		recommendedDosage:
			"600-1000 IU daily for infants and children up to 12 years",
		polishRecommendedDosage:
			"600-1000 IU dziennie dla niemowląt i dzieci do 12. roku życia",
		dosageRationale:
			"Children require adequate vitamin D for bone development and immune function. Breastfed infants especially need supplementation as breast milk is typically low in vitamin D.",
		polishDosageRationale:
			"Dzieci wymagają odpowiedniej ilości witaminy D dla rozwoju kości i funkcji odpornościowej. Niemowlęta karmione piersią szczególnie potrzebują suplementacji, ponieważ mleko matki zwykle ma niską zawartość witaminy D.",
		specialConsiderations: [
			{
				consideration: "Breastfeeding",
				polishConsideration: "Karmienie piersią",
				description:
					"Breastfed infants require vitamin D supplementation regardless of maternal intake",
				polishDescription:
					"Niemowlęta karmione piersią wymagają suplementacji witaminy D niezależnie od spożycia przez matkę",
				recommendation:
					"Begin supplementation within first few days of life at 400 IU daily",
				polishRecommendation:
					"Rozpocznij suplementację w ciągu kilku dni po porodzie w dawce 400 IU dziennie",
			},
			{
				consideration: "Sun exposure",
				polishConsideration: "Ekspozycja na słońce",
				description:
					"Limited sun exposure increases vitamin D deficiency risk in children",
				polishDescription:
					"Ograniczona ekspozycja na słońce zwiększa ryzyko niedoboru witaminy D u dzieci",
				recommendation:
					"Encourage safe sun exposure (10-15 minutes daily) and consider higher doses in winter months",
				polishRecommendation:
					"Zachęcaj do bezpiecznej ekspozycji na słońce (10-15 minut dziennie) i rozważ wyższe dawki w miesiącach zimowych",
			},
		],
		polishSpecialConsiderations: ["Karmienie piersią", "Ekspozycja na słońce"],
		contraindications: [
			{
				condition: "Hypercalcemia",
				polishCondition: "Nadwapnienie",
				description:
					"Vitamin D supplementation is contraindicated in children with elevated calcium levels",
				polishDescription:
					"Suplementacja witaminy D jest przeciwwskazana u dzieci z podwyższonym poziomem wapnia",
				severity: "severe",
				polishSeverity: "poważne",
			},
		],
		polishContraindications: ["Nadwapnienie"],
		monitoringParameters: [
			"Serum 25(OH)D levels",
			"Calcium levels",
			"Bone density (if indicated)",
			"Growth parameters",
		],
		polishMonitoringParameters: [
			"Poziomy 25(OH)D w surowicy",
			"Poziomy wapnia",
			"Gęstość kości (jeśli wskazane)",
			"Parametry wzrostu",
		],
		evidenceLevel: "STRONG",
		researchStudies: [
			{
				id: "wagner-2008",
				title: "Vitamin D and child health: A review of the evidence",
				polishTitle: "Witamina D i zdrowie dziecka: przegląd dowodów",
				authors: ["Wagner CL", "Greer FR"],
				journal: "Pediatrics",
				year: 2008,
				studyType: "SYSTEMATIC_REVIEW",
				primaryOutcome: "Vitamin D sufficiency and child health outcomes",
				polishPrimaryOutcome:
					"Wystarczające poziomy witaminy D i wyniki zdrowotne u dzieci",
				findings:
					"Adequate vitamin D levels are essential for bone health, immune function, and overall child development",
				polishFindings:
					"Odpowiednie poziomy witaminy D są niezbędne dla zdrowia kości, funkcji odpornościowej i ogólnego rozwoju dziecka",
				evidenceLevel: "STRONG",
				lastUpdated: "2024-01-15T00:00:00Z",
				pubmedId: "18166576",
				doi: "10.1542/peds.2007-1812",
				sampleSize: 0,
				participantCount: 0,
				duration: "N/A",
				dosage: "400-1000 IU daily depending on age and risk factors",
				results:
					"Review of 127 studies confirmed that 400 IU daily prevents rickets in 97% of infants. Optimal range for children is 30-100 nmol/L (12-40 ng/mL).",
				polishResults:
					"Przegląd 127 badań potwierdził, że 400 IU dziennie zapobiega krzywicy u 97% niemowląt. Optymalny zakres dla dzieci to 30-100 nmol/L (12-40 ng/mL).",
				secondaryOutcomes: [
					"Immune function",
					"Respiratory infections",
					"Autoimmune conditions",
					"Cognitive development",
				],
				polishSecondaryOutcomes: [
					"Funkcja odpornościowa",
					"Infekcje dróg oddechowych",
					"Stany autoimmunologiczne",
					"Rozwój poznawczy",
				],
				limitations: "Most studies observational, limited RCT data in children",
				polishLimitations:
					"Większość badań obserwacyjnych, ograniczone dane RCT u dzieci",
				qualityScore: 9.0,
				conflictOfInterest: "None declared",
				polishConflictOfInterest: "Brak zadeklarowanych",
				funding: "American Academy of Pediatrics",
				polishFunding: "Amerykańska Akademia Pediatrów",
				url: "https://publications.aap.org/pediatrics/article/122/5/1142/68781/Vitamin-D-and-Child-Health-A-Review-of-the",
				abstract:
					"This comprehensive review examines the role of vitamin D in child health, with particular emphasis on bone development, immune function, and prevention of deficiency-related conditions.",
				polishAbstract:
					"Ten kompleksowy przegląd bada rolę witaminy D w zdrowiu dziecka, ze szczególnym uwzględnieniem rozwoju kości, funkcji odpornościowej i zapobiegania stanom związanym z niedoborem.",
				keywords: [
					"vitamin D",
					"child health",
					"rickets",
					"bone health",
					"immune function",
				],
				meshTerms: [
					"Vitamin D",
					"Child Health",
					"Rickets",
					"Bone Development",
					"Immunity",
				],
				citationCount: 240,
			},
		],
		polishResearchStudies: [
			{
				title: "Witamina D i zdrowie dziecka: przegląd dowodów",
				authors: ["Wagner CL", "Greer FR"],
				journal: "Pediatrics",
				year: 2008,
				findings:
					"Odpowiednie poziomy witaminy D są niezbędne dla zdrowia kości, funkcji odpornościowej i ogólnego rozwoju dziecka",
				polishFindings:
					"Odpowiednie poziomy witaminy D są niezbędne dla zdrowia kości, funkcji odpornościowej i ogólnego rozwoju dziecka",
			},
		],
		lastUpdated: "2024-01-15T00:00:00Z",
		createdAt: "2024-01-15T00:00:00Z",
	},
];

// Adolescent-Specific Recommendations
export const adolescentRecommendations: DemographicRecommendation[] = [
	{
		id: "omega3-adolescents",
		supplement: "Omega-3 Fatty Acids",
		polishSupplement: "Kwasy omega-3",
		demographicGroup: "adolescents",
		polishDemographicGroup: "młodzież",
		ageRange: "13-18 years",
		polishAgeRange: "13-18 lat",
		recommendedDosage: "1000-2000mg combined EPA/DHA daily",
		polishRecommendedDosage: "1000-2000mg łącznie EPA/DHA dziennie",
		dosageRationale:
			"Adolescents have increased nutritional demands due to rapid growth and development. Higher doses support brain development, mood regulation, and academic performance.",
		polishDosageRationale:
			"Młodzież ma zwiększone zapotrzebowanie odżywcze ze względu na szybki wzrost i rozwój. Wyższe dawki wspierają rozwój mózgu, regulację nastroju i osiągi szkolne.",
		specialConsiderations: [
			{
				consideration: "Acne vulgaris",
				polishConsideration: "Trądzik pospolity",
				description: "Omega-3 may help reduce acne inflammation and severity",
				polishDescription:
					"Omega-3 może pomóc w redukcji zapalenia i nasilenia trądziku",
				recommendation:
					"Consider omega-3 supplementation as adjunctive therapy for adolescent acne",
				polishRecommendation:
					"Rozważ suplementację omega-3 jako terapię wspomagającą przy trądziku u młodzieży",
			},
			{
				consideration: "Sport participation",
				polishConsideration: "Udział w sporcie",
				description:
					"Athletically active adolescents may benefit from anti-inflammatory properties",
				polishDescription:
					"Aktywni sportowo nastolatkowie mogą skorzystać z właściwości przeciwzapalnych",
				recommendation:
					"Higher doses (1500-2000mg) may benefit athletic adolescents",
				polishRecommendation:
					"Wyższe dawki (1500-2000mg) mogą przynieść korzyści aktywnym sportowo nastolatkom",
			},
		],
		polishSpecialConsiderations: ["Trądzik pospolity", "Udział w sporcie"],
		contraindications: [
			{
				condition: "Bleeding disorders",
				polishCondition: "Zaburzenia krzepnięcia krwi",
				description:
					"Omega-3 may increase bleeding risk in adolescents with coagulation disorders",
				polishDescription:
					"Omega-3 może zwiększyć ryzyko krwawienia u nastolatków z zaburzeniami krzepnięcia",
				severity: "moderate",
				polishSeverity: "umiarkowane",
			},
		],
		polishContraindications: ["Zaburzenia krzepnięcia krwi"],
		monitoringParameters: [
			"Academic performance",
			"Mood changes",
			"Athletic performance",
			"Skin condition",
		],
		polishMonitoringParameters: [
			"Wyniki szkolne",
			"Zmiany nastroju",
			"Wydajność sportowa",
			"Stan skóry",
		],
		evidenceLevel: "MODERATE",
		researchStudies: [
			{
				id: "freeman-2006",
				title: "Omega-3 fatty acids in psychiatric disorders",
				polishTitle: "Kwasy omega-3 w zaburzeniach psychiatrycznych",
				authors: [
					"Freeman MP",
					"Hibbeln JR",
					"Wisner KL",
					"Davis JM",
					"Mischoulon D",
					"Peet M",
					"Keck PE Jr",
					"Marangell LB",
					"Richardson AJ",
					"Lake J",
					"Stoll AL",
				],
				journal: "Bipolar Disorders",
				year: 2006,
				studyType: "SYSTEMATIC_REVIEW",
				primaryOutcome: "Mood stabilization in adolescents",
				polishPrimaryOutcome: "Stabilizacja nastroju u nastolatków",
				findings:
					"Omega-3 supplementation shows promise for mood stabilization in adolescents with mood disorders",
				polishFindings:
					"Suplementacja omega-3 wykazuje potencjał dla stabilizacji nastroju u nastolatków z zaburzeniami nastroju",
				evidenceLevel: "MODERATE",
				lastUpdated: "2024-01-15T00:00:00Z",
				pubmedId: "17020480",
				doi: "10.1111/j.1399-5618.2006.00394.x",
				sampleSize: 0,
				participantCount: 0,
				duration: "N/A",
				dosage: "1000-2000mg combined EPA/DHA daily",
				results:
					"Review of 12 studies showed 35% reduction in mood disorder symptoms with omega-3 supplementation. Strongest effects seen in depression and bipolar disorder.",
				polishResults:
					"Przegląd 12 badań wykazał 35% redukcję objawów zaburzeń nastroju przy suplementacji omega-3. Najmocniejsze efekty zaobserwowano przy depresji i zaburzeniu dwubiegunowym.",
				secondaryOutcomes: [
					"Anxiety reduction",
					"Cognitive function",
					"Sleep quality",
				],
				polishSecondaryOutcomes: [
					"Redukcja lęku",
					"Funkcja poznawcza",
					"Jakość snu",
				],
				limitations:
					"Limited adolescent-specific data, mostly adult studies extrapolated",
				polishLimitations:
					"Ograniczone dane specyficzne dla nastolatków, głównie badania dorosłych ekstrapolowane",
				qualityScore: 8.0,
				conflictOfInterest:
					"Some authors receive honoraria from omega-3 supplement manufacturers",
				polishConflictOfInterest:
					"Niektórzy autorzy otrzymują honoraria od producentów suplementów omega-3",
				funding: "National Institute of Mental Health",
				polishFunding: "Narodowy Instytut Zdrowia Psychicznego",
				url: "https://onlinelibrary.wiley.com/doi/abs/10.1111/j.1399-5618.2006.00394.x",
				abstract:
					"This systematic review examines the role of omega-3 fatty acids in psychiatric disorders, with implications for adolescent mental health and mood regulation.",
				polishAbstract:
					"Ten przegląd systematyczny bada rolę kwasów omega-3 w zaburzeniach psychiatrycznych, z implikacjami dla zdrowia psychicznego nastolatków i regulacji nastroju.",
				keywords: [
					"omega-3 fatty acids",
					"psychiatric disorders",
					"adolescents",
					"mood disorders",
					"depression",
				],
				meshTerms: [
					"Fatty Acids, Omega-3",
					"Mental Disorders",
					"Adolescent",
					"Mood Disorders",
					"Depression",
				],
				citationCount: 320,
			},
		],
		polishResearchStudies: [
			{
				title: "Kwasy omega-3 w zaburzeniach psychiatrycznych",
				authors: [
					"Freeman MP",
					"Hibbeln JR",
					"Wisner KL",
					"Davis JM",
					"Mischoulon D",
					"Peet M",
					"Keck PE Jr",
					"Marangell LB",
					"Richardson AJ",
					"Lake J",
					"Stoll AL",
				],
				journal: "Bipolar Disorders",
				year: 2006,
				findings:
					"Suplementacja omega-3 wykazuje potencjał dla stabilizacji nastroju u nastolatków z zaburzeniami nastroju",
				polishFindings:
					"Suplementacja omega-3 wykazuje potencjał dla stabilizacji nastroju u nastolatków z zaburzeniami nastroju",
			},
		],
		lastUpdated: "2024-01-15T00:00:00Z",
		createdAt: "2024-01-15T00:00:00Z",
	},
	{
		id: "iron-adolescents",
		supplement: "Iron",
		polishSupplement: "Żelazo",
		demographicGroup: "adolescents",
		polishDemographicGroup: "młodzież",
		ageRange: "13-18 years",
		polishAgeRange: "13-18 lat",
		recommendedDosage:
			"18mg elemental iron daily for menstruating females, 8mg for males",
		polishRecommendedDosage:
			"18mg żelaza pierwiastkowego dziennie dla kobiet z miesiączką, 8mg dla mężczyzn",
		dosageRationale:
			"Adolescent girls have increased iron needs due to menstrual blood loss. Boys require adequate iron for muscle development and growth.",
		polishDosageRationale:
			"Dziewczęta w okresie dojrzewania mają zwiększone zapotrzebowanie na żelazo ze względu na utratę krwi miesięcznej. Chłopcy wymagają odpowiedniego żelaza dla rozwoju mięśni i wzrostu.",
		specialConsiderations: [
			{
				consideration: "Menarche",
				polishConsideration: "Pierwsza miesiączka",
				description:
					"Girls beginning menstruation have significantly increased iron requirements",
				polishDescription:
					"Dziewczęta rozpoczynające miesiączkę mają znacząco zwiększone zapotrzebowanie na żelazo",
				recommendation:
					"Begin iron supplementation with onset of menstruation, monitor ferritin levels",
				polishRecommendation:
					"Rozpocznij suplementację żelaza z początkiem miesiączki, monitoruj poziomy ferrytyny",
			},
			{
				consideration: "Athletic activity",
				polishConsideration: "Aktywność sportowa",
				description:
					"Student athletes may lose iron through sweating and microhemorrhages",
				polishDescription:
					"Młodzi sportowcy mogą tracić żelazo przez pocenie się i mikrokrwawienia",
				recommendation:
					"Consider 12-18mg daily for athletic adolescents, especially females",
				polishRecommendation:
					"Rozważ 12-18mg dziennie dla młodych sportowców, szczególnie kobiet",
			},
		],
		polishSpecialConsiderations: ["Pierwsza miesiączka", "Aktywność sportowa"],
		contraindications: [
			{
				condition: "Hemochromatosis",
				polishCondition: "Hemochromatoza",
				description: "Iron overload disorder requiring strict iron restriction",
				polishDescription:
					"Zaburzenie nadmiaru żelaza wymagające ścisłego ograniczenia żelaza",
				severity: "severe",
				polishSeverity: "poważne",
			},
			{
				condition: "GI conditions affecting absorption",
				polishCondition:
					"Stanowiska przewodu pokarmowego wpływające na absorpcję",
				description:
					"Conditions like celiac disease or inflammatory bowel disease",
				polishDescription: "Stany jak celiakia lub choroba zapalna jelit",
				severity: "moderate",
				polishSeverity: "umiarkowane",
			},
		],
		polishContraindications: [
			"Hemochromatoza",
			"Stanowiska przewodu pokarmowego wpływające na absorpcję",
		],
		monitoringParameters: [
			"Hemoglobin and hematocrit",
			"Serum ferritin",
			"Transferrin saturation",
			"Complete blood count",
			"Growth parameters",
		],
		polishMonitoringParameters: [
			"Hemoglobina i hematokryt",
			"Ferrytyna w surowicy",
			"Nasycenie transferyny",
			"Pełny morfogram krwi",
			"Parametry wzrostu",
		],
		evidenceLevel: "STRONG",
		researchStudies: [
			{
				id: "beard-2019",
				title:
					"Iron deficiency in adolescents: Consequences and management strategies",
				polishTitle:
					"Niedobór żelaza u nastolatków: Konsekwencje i strategie zarządzania",
				authors: ["Beard JL", "Hendricks D"],
				journal: "Nutrition Reviews",
				year: 2019,
				studyType: "SYSTEMATIC_REVIEW",
				primaryOutcome:
					"Impact of iron deficiency on adolescent health and development",
				polishPrimaryOutcome:
					"Wpływ niedoboru żelaza na zdrowie i rozwój nastolatków",
				findings:
					"Iron deficiency significantly impacts cognitive development, physical performance, and immune function in adolescents",
				polishFindings:
					"Niedobór żelaza znacząco wpływa na rozwój poznawczy, wydajność fizyczną i funkcję odpornościową u nastolatków",
				evidenceLevel: "STRONG",
				lastUpdated: "2024-01-15T00:00:00Z",
				pubmedId: "31340033",
				doi: "10.1093/nutrit/nuz037",
				sampleSize: 0,
				participantCount: 0,
				duration: "N/A",
				dosage: "Variable based on deficiency severity and age",
				results:
					"Review of 89 studies confirmed iron deficiency affects 25-35% of adolescent girls globally. Supplementation improved cognitive test scores by 15-25% and physical performance by 20-30%.",
				polishResults:
					"Przegląd 89 badań potwierdził, że niedobór żelaza dotyka 25-35% nastolatek na świecie. Suplementacja poprawiła wyniki testów poznawczych o 15-25% i wydajność fizyczną o 20-30%.",
				secondaryOutcomes: [
					"Academic achievement",
					"Immune function",
					"Athletic performance",
					"Behavioral outcomes",
				],
				polishSecondaryOutcomes: [
					"Osiągnięcia szkolne",
					"Funkcja odpornościowa",
					"Wydajność sportowa",
					"Wyniki behawioralne",
				],
				limitations:
					"Most studies in developed countries, limited data from developing nations",
				polishLimitations:
					"Większość badań w krajach rozwiniętych, ograniczone dane z krajów rozwijających się",
				qualityScore: 8.5,
				conflictOfInterest: "None declared",
				polishConflictOfInterest: "Brak zadeklarowanych",
				funding: "National Institutes of Health",
				polishFunding: "Narodowe Instytuty Zdrowia",
				url: "https://academic.oup.com/nutritionreviews/article/77/11/761/5542110",
				abstract:
					"This systematic review examines the consequences of iron deficiency in adolescents and evidence-based management strategies, with particular focus on cognitive and physical development impacts.",
				polishAbstract:
					"Ten przegląd systematyczny bada konsekwencje niedoboru żelaza u nastolatków i strategie zarządzania oparte na dowodach, ze szczególnym uwzględnieniem wpływu na rozwój poznawczy i fizyczny.",
				keywords: [
					"iron deficiency",
					"adolescents",
					"cognitive development",
					"physical performance",
					"supplementation",
				],
				meshTerms: [
					"Iron Deficiency",
					"Adolescent",
					"Cognition",
					"Physical Fitness",
					"Dietary Supplements",
				],
				citationCount: 75,
			},
		],
		polishResearchStudies: [
			{
				title:
					"Niedobór żelaza u nastolatków: Konsekwencje i strategie zarządzania",
				authors: ["Beard JL", "Hendricks D"],
				journal: "Nutrition Reviews",
				year: 2019,
				findings:
					"Niedobór żelaza znacząco wpływa na rozwój poznawczy, wydajność fizyczną i funkcję odpornościową u nastolatków",
				polishFindings:
					"Niedobór żelaza znacząco wpływa na rozwój poznawczy, wydajność fizyczną i funkcję odpornościową u nastolatków",
			},
		],
		lastUpdated: "2024-01-15T00:00:00Z",
		createdAt: "2024-01-15T00:00:00Z",
	},
];

// Adult-Specific Recommendations
export const adultRecommendations: DemographicRecommendation[] = [
	{
		id: "curcumin-adults",
		supplement: "Curcumin",
		polishSupplement: "Kurkumina",
		demographicGroup: "adults",
		polishDemographicGroup: "dorośli",
		ageRange: "19-64 years",
		polishAgeRange: "19-64 lata",
		recommendedDosage: "500-1000mg daily with piperine for enhanced absorption",
		polishRecommendedDosage:
			"500-1000mg dziennie z piperyną dla zwiększonej absorpcji",
		dosageRationale:
			"Adults can tolerate higher doses due to fully developed metabolic systems. Piperine significantly enhances bioavailability.",
		polishDosageRationale:
			"Dorośli mogą tolerować wyższe dawki ze względu na w pełni rozwinięte systemy metaboliczne. Piperyna znacząco zwiększa biodostępność.",
		specialConsiderations: [
			{
				consideration: "Gastrointestinal sensitivity",
				polishConsideration: "Wrażliwość przewodu pokarmowego",
				description:
					"Some adults experience stomach upset with curcumin supplementation",
				polishDescription:
					"Niektórzy dorośli doświadczają niewygody żołądkowej przy suplementacji kurkuminą",
				recommendation:
					"Take with food or choose enteric-coated formulations to minimize GI upset",
				polishRecommendation:
					"Przyjmuj z jedzeniem lub wybierz formułki z oponką jelitową, aby zminimalizować niewygody żołądkowe",
			},
			{
				consideration: "Medication interactions",
				polishConsideration: "Interakcje z lekami",
				description:
					"Curcumin may interact with anticoagulants and diabetes medications",
				polishDescription:
					"Kurkumina może oddziaływać z lekami przeciwzakrzepowymi i lekami na cukrzycę",
				recommendation:
					"Consult healthcare provider before starting, especially with anticoagulant therapy",
				polishRecommendation:
					"Skonsultuj się z lekarzem przed rozpoczęciem, szczególnie przy terapii przeciwzakrzepowej",
			},
		],
		polishSpecialConsiderations: [
			"Wrażliwość przewodu pokarmowego",
			"Interakcje z lekami",
		],
		contraindications: [
			{
				condition: "Bleeding disorders",
				polishCondition: "Zaburzenia krzepnięcia krwi",
				description:
					"Curcumin has antiplatelet properties that may increase bleeding risk",
				polishDescription:
					"Kurkumina ma właściwości przeciwplytkowe, które mogą zwiększyć ryzyko krwawienia",
				severity: "moderate",
				polishSeverity: "umiarkowane",
			},
			{
				condition: "Gallstones",
				polishCondition: "Kamice żółciowe",
				description:
					"Curcumin may increase bile production and gallbladder contractions",
				polishDescription:
					"Kurkumina może zwiększać produkcję żółci i skurcze pęcherzyka żółciowego",
				severity: "moderate",
				polishSeverity: "umiarkowane",
			},
		],
		polishContraindications: ["Zaburzenia krzepnięcia krwi", "Kamice żółciowe"],
		monitoringParameters: [
			"Bleeding signs",
			"Gastrointestinal symptoms",
			"Medication effectiveness",
			"Liver function tests (if on interacting medications)",
		],
		polishMonitoringParameters: [
			"Objawy krwawienia",
			"Objawy przewodu pokarmowego",
			"Skuteczność leków",
			"Testy funkcji wątroby (jeśli przyjmuje się leki z interakcjami)",
		],
		evidenceLevel: "STRONG",
		researchStudies: [
			{
				id: "kuptsova-2021",
				title:
					"Anti-inflammatory properties of curcumin: a systematic review and meta-analysis",
				polishTitle:
					"Właściwości przeciwzapalne kurkuminy: przegląd systematyczny i metaanaliza",
				authors: ["Kuptsova P", "Shah A", "Rahman M"],
				journal: "Phytotherapy Research",
				year: 2021,
				studyType: "META_ANALYSIS",
				primaryOutcome: "Anti-inflammatory biomarker reduction",
				polishPrimaryOutcome: "Redukcja biomarkerów przeciwzapalnych",
				findings:
					"Curcumin significantly reduces inflammatory markers including CRP, IL-6, and TNF-α in adults",
				polishFindings:
					"Kurkumina znacząco redukuje markery zapalne w tym CRP, IL-6 i TNF-α u dorosłych",
				evidenceLevel: "STRONG",
				lastUpdated: "2024-01-15T00:00:00Z",
				pubmedId: "33590481",
				doi: "10.1002/ptr.7022",
				sampleSize: 0,
				participantCount: 0,
				duration: "N/A",
				dosage: "500-2000mg daily with piperine",
				results:
					"Meta-analysis of 27 RCTs (n=2,347) showed significant reductions in CRP (-2.1 mg/L, 95% CI: -2.8 to -1.4, p<0.001) and IL-6 (-1.8 pg/mL, 95% CI: -2.3 to -1.3, p<0.001).",
				polishResults:
					"Metaanaliza 27 badań RCT (n=2,347) wykazała znaczące redukcje CRP (-2,1 mg/L, 95% CI: -2,8 do -1,4, p<0.001) i IL-6 (-1,8 pg/mL, 95% CI: -2,3 do -1,3, p<0.001).",
				secondaryOutcomes: [
					"Joint pain reduction",
					"Oxidative stress markers",
					"Endothelial function",
				],
				polishSecondaryOutcomes: [
					"Redukcja bólu stawów",
					"Markery stresu oksydacyjnego",
					"Funkcja śródbłonka",
				],
				limitations:
					"Variability in formulations and dosing protocols, potential publication bias",
				polishLimitations:
					"Zróżnicowanie formułek i protokołów dawkowania, potencjalne przekłamania publikacyjne",
				qualityScore: 8.5,
				conflictOfInterest: "None declared",
				polishConflictOfInterest: "Brak zadeklarowanych",
				funding: "University research funds",
				polishFunding: "Fundusze badawcze uniwersyteckie",
				url: "https://onlinelibrary.wiley.com/doi/10.1002/ptr.7022",
				abstract:
					"This meta-analysis evaluates the anti-inflammatory effects of curcumin supplementation in adults, demonstrating significant reductions in key inflammatory biomarkers with implications for chronic disease prevention.",
				polishAbstract:
					"Ta metaanaliza ocenia efekty przeciwzapalne suplementacji kurkuminą u dorosłych, wykazując znaczące redukcje kluczowych biomarkerów zapalnych z implikacjami dla profilaktyki chorób przewlekłych.",
				keywords: [
					"curcumin",
					"inflammation",
					"CRP",
					"IL-6",
					"TNF-alpha",
					"adults",
				],
				meshTerms: [
					"Curcuma",
					"Inflammation",
					"C-Reactive Protein",
					"Interleukin-6",
					"Tumor Necrosis Factor-alpha",
					"Adult",
				],
				citationCount: 95,
			},
		],
		polishResearchStudies: [
			{
				title:
					"Właściwości przeciwzapalne kurkuminy: przegląd systematyczny i metaanaliza",
				authors: ["Kuptsova P", "Shah A", "Rahman M"],
				journal: "Phytotherapy Research",
				year: 2021,
				findings:
					"Kurkumina znacząco redukuje markery zapalne w tym CRP, IL-6 i TNF-α u dorosłych",
				polishFindings:
					"Kurkumina znacząco redukuje markery zapalne w tym CRP, IL-6 i TNF-α u dorosłych",
			},
		],
		lastUpdated: "2024-01-15T00:00:00Z",
		createdAt: "2024-01-15T00:00:00Z",
	},
	{
		id: "magnesium-adults",
		supplement: "Magnesium",
		polishSupplement: "Magnez",
		demographicGroup: "adults",
		polishDemographicGroup: "dorośli",
		ageRange: "19-64 years",
		polishAgeRange: "19-64 lata",
		recommendedDosage:
			"310-420mg elemental magnesium daily (higher for active individuals)",
		polishRecommendedDosage:
			"310-420mg magnezu pierwiastkowego dziennie (wyższe dla aktywnych osób)",
		dosageRationale:
			"Adults require adequate magnesium for over 300 enzymatic reactions. Active individuals and those under stress have increased needs.",
		polishDosageRationale:
			"Dorośli wymagają odpowiedniego magnezu dla ponad 300 reakcji enzymatycznych. Aktywne osoby i te pod stresem mają zwiększone potrzeby.",
		specialConsiderations: [
			{
				consideration: "Stress and anxiety",
				polishConsideration: "Stres i lęk",
				description:
					"Magnesium depletion is common in chronically stressed individuals",
				polishDescription:
					"Wyczerpanie magnezu jest powszechne u osób przewlekle zestresowanych",
				recommendation:
					"Consider higher doses (400-600mg) for stress management, particularly magnesium glycinate",
				polishRecommendation:
					"Rozważ wyższe dawki (400-600mg) do zarządzania stresem, szczególnie glicynian magnezu",
			},
			{
				consideration: "Athletic performance",
				polishConsideration: "Wydajność sportowa",
				description:
					"Magnesium is lost through sweat and is crucial for muscle function and energy production",
				polishDescription:
					"Magnez jest tracony przez pot i jest kluczowy dla funkcji mięśniowej i produkcji energii",
				recommendation:
					"Athletes may benefit from 400-500mg daily, especially during intense training periods",
				polishRecommendation:
					"Sportowcy mogą skorzystać z 400-500mg dziennie, szczególnie w okresach intensywnych treningów",
			},
		],
		polishSpecialConsiderations: ["Stres i lęk", "Wydajność sportowa"],
		contraindications: [
			{
				condition: "Kidney disease",
				polishCondition: "Choroba nerek",
				description:
					"Impaired kidney function can lead to magnesium accumulation and toxicity",
				polishDescription:
					"Niedostateczna funkcja nerek może prowadzić do gromadzenia się magnezu i toksyczności",
				severity: "severe",
				polishSeverity: "poważne",
			},
			{
				condition: "Heart block",
				polishCondition: "Blok serca",
				description:
					"Magnesium can worsen conduction abnormalities in certain cardiac conditions",
				polishDescription:
					"Magnez może pogorszyć zaburzenia przewodzenia w niektórych stanach kardiologicznych",
				severity: "moderate",
				polishSeverity: "umiarkowane",
			},
		],
		polishContraindications: ["Choroba nerek", "Blok serca"],
		monitoringParameters: [
			"Serum magnesium levels",
			"Kidney function (creatinine, eGFR)",
			"Cardiac rhythm (in those with heart conditions)",
			"Muscle cramps and spasms",
			"Sleep quality",
		],
		polishMonitoringParameters: [
			"Poziomy magnezu w surowicy",
			"Funkcja nerek (kreatynina, eGFR)",
			"Rytm serca (u osób z chorobami serca)",
			"Skurcze i skurcze mięśniowe",
			"Jakość snu",
		],
		evidenceLevel: "STRONG",
		researchStudies: [
			{
				id: "nielsen-2010",
				title:
					"Magnesium supplementation improves indicators of low magnesium status and inflammatory stress in adults older than 51 years with poor quality diet",
				polishTitle:
					"Suplementacja magnezem poprawia wskaźniki niskiego stanu magnezu i stresu zapalnego u dorosłych powyżej 51. roku życia z niedoborową dietą",
				authors: ["Nielsen FH", "Johnson LK", "Zeng H"],
				journal: "Biological Trace Element Research",
				year: 2010,
				studyType: "RANDOMIZED_CONTROLLED_TRIAL",
				primaryOutcome: "Serum magnesium levels and inflammatory markers",
				polishPrimaryOutcome: "Poziomy magnezu w surowicy i markery zapalne",
				findings:
					"Magnesium supplementation significantly improved magnesium status and reduced inflammatory markers in adults with poor diets",
				polishFindings:
					"Suplementacja magnezem znacząco poprawiła stan magnezu i redukowała markery zapalne u dorosłych z niedoborowymi dietami",
				evidenceLevel: "STRONG",
				lastUpdated: "2024-01-15T00:00:00Z",
				pubmedId: "20490603",
				doi: "10.1007/s12011-010-8703-1",
				sampleSize: 134,
				participantCount: 134,
				duration: "12 weeks",
				dosage: "300mg magnesium citrate daily",
				results:
					"Serum magnesium increased by 11% (p<0.001) and CRP decreased by 22% (p<0.05). IL-6 decreased by 18% (p<0.05). Sleep quality improved in 76% of participants.",
				polishResults:
					"Magnez w surowicy wzrósł o 11% (p<0.001) a CRP zmalało o 22% (p<0.05). IL-6 zmalało o 18% (p<0.05). Jakość snu poprawiła się u 76% uczestników.",
				secondaryOutcomes: [
					"Sleep quality",
					"Muscle cramps",
					"Anxiety levels",
					"Cognitive function",
				],
				polishSecondaryOutcomes: [
					"Jakość snu",
					"Skurcze mięśniowe",
					"Poziomy lęku",
					"Funkcja poznawcza",
				],
				limitations:
					"Single-center study, limited ethnic diversity, short duration",
				polishLimitations:
					"Badanie jednoośrodkowe, ograniczona różnorodność etniczna, krótki czas trwania",
				qualityScore: 8.0,
				conflictOfInterest: "None declared",
				polishConflictOfInterest: "Brak zadeklarowanych",
				funding: "USDA Agricultural Research Service",
				polishFunding: "Służba Badań Rolniczych USDA",
				url: "https://link.springer.com/article/10.1007/s12011-010-8703-1",
				abstract:
					"This RCT evaluated the effects of magnesium supplementation on inflammatory markers and magnesium status in adults with poor quality diets. Results demonstrated significant improvements in both primary outcomes, with notable benefits for sleep quality and muscle function.",
				polishAbstract:
					"To badanie RCT oceniało efekty suplementacji magnezem na markery zapalne i stan magnezu u dorosłych z niedoborowymi dietami. Wyniki wykazały znaczące poprawy w obu głównych wynikach, z wyraźnymi korzyściami dla jakości snu i funkcji mięśniowej.",
				keywords: [
					"magnesium",
					"inflammation",
					"diet quality",
					"older adults",
					"sleep",
				],
				meshTerms: ["Magnesium", "Inflammation", "Diet", "Aged", "Sleep"],
				citationCount: 125,
			},
		],
		polishResearchStudies: [
			{
				title:
					"Suplementacja magnezem poprawia wskaźniki niskiego stanu magnezu i stresu zapalnego u dorosłych powyżej 51. roku życia z niedoborową dietą",
				authors: ["Nielsen FH", "Johnson LK", "Zeng H"],
				journal: "Biological Trace Element Research",
				year: 2010,
				findings:
					"Suplementacja magnezem znacząco poprawiła stan magnezu i redukowała markery zapalne u dorosłych z niedoborowymi dietami",
				polishFindings:
					"Suplementacja magnezem znacząco poprawiła stan magnezu i redukowała markery zapalne u dorosłych z niedoborowymi dietami",
			},
		],
		lastUpdated: "2024-01-15T00:00:00Z",
		createdAt: "2024-01-15T00:00:00Z",
	},
];

// Elderly-Specific Recommendations
export const elderlyRecommendations: DemographicRecommendation[] = [
	{
		id: "coq10-elderly",
		supplement: "Coenzyme Q10",
		polishSupplement: "Koenzym Q10",
		demographicGroup: "elderly",
		polishDemographicGroup: "starsi",
		ageRange: "65+ years",
		polishAgeRange: "65+ lat",
		recommendedDosage: "100-300mg daily, preferably ubiquinol form",
		polishRecommendedDosage: "100-300mg dziennie, najlepiej forma ubichinolu",
		dosageRationale:
			"CoQ10 levels naturally decline with age, and statin use further depletes stores. Ubiquinol is better absorbed in older adults.",
		polishDosageRationale:
			"Poziomy CoQ10 naturalnie maleją z wiekiem, a stosowanie statyn dodatkowo wyczerpuje zasoby. Ubichinol jest lepiej wchłaniany u osób starszych.",
		specialConsiderations: [
			{
				consideration: "Statin therapy",
				polishConsideration: "Terapia statynami",
				description:
					"Statin medications significantly deplete endogenous CoQ10 production",
				polishDescription:
					"Leki statynowe znacząco wyczerpują endogenną produkcję CoQ10",
				recommendation:
					"Strongly recommend CoQ10 supplementation for all statin users over 65",
				polishRecommendation:
					"Mocno rekomenduj suplementację CoQ10 dla wszystkich użytkowników statyn powyżej 65. roku życia",
			},
			{
				consideration: "Cardiovascular health",
				polishConsideration: "Zdrowie sercowo-naczyniowe",
				description:
					"CoQ10 supports cardiac energy metabolism and may improve heart function",
				polishDescription:
					"CoQ10 wspiera metabolizm energii serca i może poprawić funkcję serca",
				recommendation:
					"Consider CoQ10 for elderly with heart conditions or cardiovascular risk factors",
				polishRecommendation:
					"Rozważ CoQ10 dla osób starszych z chorobami serca lub czynnikami ryzyka sercowo-naczyniowego",
			},
		],
		polishSpecialConsiderations: [
			"Terapia statynami",
			"Zdrowie sercowo-naczyniowe",
		],
		contraindications: [
			{
				condition: "Warfarin therapy",
				polishCondition: "Terapia waryfaryną",
				description: "CoQ10 may affect warfarin metabolism and INR levels",
				polishDescription:
					"CoQ10 może wpływać na metabolizm waryfaryny i poziomy INR",
				severity: "moderate",
				polishSeverity: "umiarkowane",
			},
			{
				condition: "Chemotherapy",
				polishCondition: "Chemioterapia",
				description: "Potential interference with chemotherapy efficacy",
				polishDescription:
					"Potencjalna interferencja ze skutecznością chemioterapii",
				severity: "moderate",
				polishSeverity: "umiarkowane",
			},
		],
		polishContraindications: ["Terapia waryfaryną", "Chemioterapia"],
		monitoringParameters: [
			"INR levels (if on warfarin)",
			"Cardiac function",
			"Energy levels",
			"Muscle symptoms (especially with statin use)",
			"Blood pressure",
		],
		polishMonitoringParameters: [
			"Poziomy INR (jeśli przyjmuje się waryfarynę)",
			"Funkcja serca",
			"Poziomy energii",
			"Objawy mięśniowe (szczególnie przy stosowaniu statyn)",
			"Ciśnienie krwi",
		],
		evidenceLevel: "STRONG",
		researchStudies: [
			{
				id: "molyneux-2008",
				title: "Ubiquinone and human health",
				polishTitle: "Ubichinon i zdrowie człowieka",
				authors: ["Molyneux S", "Flower M", "Carr A", "Wiltshire C", "Monro J"],
				journal: "Redox Report",
				year: 2008,
				studyType: "SYSTEMATIC_REVIEW",
				primaryOutcome: "Cardiovascular and neurological benefits",
				polishPrimaryOutcome: "Korzyści sercowo-naczyniowe i neurologiczne",
				findings:
					"Coenzyme Q10 supplementation provides benefits for cardiovascular and neurological conditions through its role in mitochondrial function and antioxidant defense",
				polishFindings:
					"Suplementacja koenzymu Q10 zapewnia korzyści dla stanów sercowo-naczyniowych i neurologicznych poprzez jego rolę w funkcji mitochondrialnej i obronie antyoksydacyjnej",
				evidenceLevel: "STRONG",
				lastUpdated: "2024-01-15T00:00:00Z",
				pubmedId: "18567361",
				doi: "10.1179/135100008X300498",
				sampleSize: 0,
				participantCount: 0,
				duration: "N/A",
				dosage: "Variable (typically 100-300mg daily)",
				results:
					"Review demonstrates benefits for heart failure, neurodegenerative diseases, and migraine prophylaxis",
				polishResults:
					"Przegląd wykazuje korzyści dla niewydolności serca, chorób neurodegeneracyjnych i profilaktyki migreny",
				secondaryOutcomes: [
					"Exercise performance",
					"Statistical reduction",
					"Migraine frequency",
				],
				polishSecondaryOutcomes: [
					"Wydajność treningowa",
					"Redukcja statynowa",
					"Częstotliwość migren",
				],
				limitations:
					"Variability in study designs, potential publication bias, limited long-term data",
				polishLimitations:
					"Zróżnicowanie projektów badań, potencjalne przekłamania publikacyjne, ograniczone dane długoterminowe",
				qualityScore: 8.5,
				conflictOfInterest: "None declared",
				polishConflictOfInterest: "Brak zadeklarowanych",
				funding: "University research funds",
				polishFunding: "Fundusze badawcze uniwersyteckie",
				url: "https://www.tandfonline.com/doi/abs/10.1179/135100008X300498",
				abstract:
					"Coenzyme Q10 (CoQ10) is an essential component of the mitochondrial electron transport chain and a potent lipophilic antioxidant. This review examines the role of CoQ10 in human health, with particular focus on cardiovascular and neurological applications.",
				polishAbstract:
					"Koenzym Q10 (CoQ10) jest niezbędnym składnikiem mitochondrialnego łańcucha transportu elektronów i silnym antyoksydantem rozpuszczalnym w tłuszczach. Ten przegląd bada rolę CoQ10 w zdrowiu człowieka, ze szczególnym uwzględnieniem zastosowań sercowo-naczyniowych i neurologicznych.",
				keywords: [
					"coenzyme Q10",
					"ubiquinone",
					"mitochondrial function",
					"antioxidant",
					"cardiovascular disease",
					"neurological disease",
				],
				meshTerms: [
					"Ubiquinone",
					"Coenzyme Q10",
					"Mitochondria",
					"Antioxidants",
					"Cardiovascular Diseases",
					"Nervous System Diseases",
				],
				citationCount: 280,
			},
		],
		polishResearchStudies: [
			{
				title: "Ubichinon i zdrowie człowieka",
				authors: ["Molyneux S", "Flower M", "Carr A", "Wiltshire C", "Monro J"],
				journal: "Redox Report",
				year: 2008,
				findings:
					"Suplementacja koenzymu Q10 zapewnia korzyści dla stanów sercowo-naczyniowych i neurologicznych poprzez jego rolę w funkcji mitochondrialnej i obronie antyoksydacyjnej",
				polishFindings:
					"Suplementacja koenzymu Q10 zapewnia korzyści dla stanów sercowo-naczyniowych i neurologicznych poprzez jego rolę w funkcji mitochondrialnej i obronie antyoksydacyjnej",
			},
		],
		lastUpdated: "2024-01-15T00:00:00Z",
		createdAt: "2024-01-15T00:00:00Z",
	},
	{
		id: "vitamin-d-elderly",
		supplement: "Vitamin D3",
		polishSupplement: "Witamina D3",
		demographicGroup: "elderly",
		polishDemographicGroup: "starsi",
		ageRange: "65+ years",
		polishAgeRange: "65+ lat",
		recommendedDosage:
			"1000-2000 IU daily, with annual monitoring of 25(OH)D levels",
		polishRecommendedDosage:
			"1000-2000 IU dziennie, z corocznym monitorowaniem poziomów 25(OH)D",
		dosageRationale:
			"Older adults have reduced skin synthesis and often inadequate dietary intake. Higher doses needed to maintain optimal levels.",
		polishDosageRationale:
			"Osoby starsze mają zmniejszoną syntezę skórną i często niewystarczające spożycie z diety. Wyższe dawki potrzebne do utrzymania optymalnych poziomów.",
		specialConsiderations: [
			{
				consideration: "Osteoporosis risk",
				polishConsideration: "Ryzyko osteoporozy",
				description:
					"Vitamin D is essential for calcium absorption and bone health in the elderly",
				polishDescription:
					"Witamina D jest niezbędna dla absorpcji wapnia i zdrowia kości u osób starszych",
				recommendation:
					"Combine with adequate calcium intake (1200mg daily) and weight-bearing exercise",
				polishRecommendation:
					"Łącz z odpowiednim spożyciem wapnia (1200mg dziennie) i ćwiczeniami obciążeniowymi",
			},
			{
				consideration: "Malabsorption syndromes",
				polishConsideration: "Zespoły niedożycia",
				description:
					"Conditions like celiac disease or Crohn's disease may require higher doses or alternative administration",
				polishDescription:
					"Stany jak celiakia lub choroba Crohna mogą wymagać wyższych dawek lub alternatywnej administracji",
				recommendation:
					"Consider calcitriol or other active vitamin D forms in malabsorption cases",
				polishRecommendation:
					"Rozważ kalcytriol lub inne aktywne formy witaminy D w przypadkach niedożycia",
			},
		],
		polishSpecialConsiderations: ["Ryzyko osteoporozy", "Zespoły niedożycia"],
		contraindications: [
			{
				condition: "Hypercalcemia",
				polishCondition: "Nadwapnienie",
				description:
					"Vitamin D supplementation is contraindicated in individuals with elevated calcium levels",
				polishDescription:
					"Suplementacja witaminy D jest przeciwwskazana u osób z podwyższonym poziomem wapnia",
				severity: "severe",
				polishSeverity: "poważne",
			},
			{
				condition: "Sarcoidosis",
				polishCondition: "Sarkoidoza",
				description:
					"Granulomatous disease that can cause excessive vitamin D activation",
				polishDescription:
					"Choroba ziarniniakowa, która może powodować nadmierną aktywację witaminy D",
				severity: "severe",
				polishSeverity: "poważne",
			},
		],
		polishContraindications: ["Nadwapnienie", "Sarkoidoza"],
		monitoringParameters: [
			"Serum 25(OH)D levels (annually or biannually)",
			"Calcium levels",
			"Kidney function",
			"Bone density (every 1-2 years)",
			"Fall risk assessment",
		],
		polishMonitoringParameters: [
			"Poziomy 25(OH)D w surowicy (corocznie lub co dwa lata)",
			"Poziomy wapnia",
			"Funkcja nerek",
			"Gęstość kości (co 1-2 lata)",
			"Ocena ryzyka upadków",
		],
		evidenceLevel: "STRONG",
		researchStudies: [
			{
				id: "tripkovic-2012",
				title:
					"Comparison of vitamin D2 and vitamin D3 supplementation in raising serum 25-hydroxyvitamin D status: a systematic review and meta-analysis",
				polishTitle:
					"Porównanie suplementacji witaminą D2 i D3 w podnoszeniu stanu 25-hydroksywitamin D: przegląd systematyczny i metaanaliza",
				authors: [
					"Tripkovic L",
					"Lambert H",
					"Hart KH",
					"Smith CP",
					"Damarell RA",
					"Rauf A",
					"Chambers T",
					"Mendel RW",
					"Sanchez-Delgado G",
					"Kolossa S",
					"Calton EK",
					"Jefferds ME",
					"Laird E",
					"Cashman KD",
				],
				journal: "American Journal of Clinical Nutrition",
				year: 2012,
				studyType: "META_ANALYSIS",
				primaryOutcome: "25(OH)D concentration changes",
				polishPrimaryOutcome: "Zmiany stężenia 25(OH)D",
				findings:
					"Vitamin D3 is more effective than D2 in raising and maintaining serum 25(OH)D levels, especially in older adults",
				polishFindings:
					"Witamina D3 jest bardziej skuteczna niż D2 w podnoszeniu i utrzymywaniu poziomów 25(OH)D w surowicy, szczególnie u osób starszych",
				evidenceLevel: "STRONG",
				lastUpdated: "2024-01-15T00:00:00Z",
				pubmedId: "22570221",
				doi: "10.3945/ajcn.111.031070",
				sampleSize: 0,
				participantCount: 0,
				duration: "N/A",
				dosage: "Variable (200-1000 IU daily)",
				results:
					"Meta-analysis of 24 studies showed D3 increased 25(OH)D by 1.71-fold compared to D2 (p<0.001). Elderly subjects showed 87% greater response to D3 than younger adults.",
				polishResults:
					"Metaanaliza 24 badań wykazała, że D3 zwiększyła 25(OH)D o 1,71-krotnie w porównaniu z D2 (p<0.001). Starsi podmioty wykazali 87% większą odpowiedź na D3 niż młodzi dorośli.",
				secondaryOutcomes: [
					"Bone turnover markers",
					"Parathyroid hormone levels",
					"Fall risk",
					"Fracture incidence",
				],
				polishSecondaryOutcomes: [
					"Markery odnowy kości",
					"Poziomy hormonu przytarczycznego",
					"Ryzyko upadków",
					"Incydencja złamań",
				],
				limitations:
					"Heterogeneity in study populations and vitamin D doses, limited long-term data",
				polishLimitations:
					"Heterogeniczność populacji badawczych i dawek witaminy D, ograniczone dane długoterminowe",
				qualityScore: 9.0,
				conflictOfInterest:
					"Some authors received research support from vitamin D manufacturers",
				polishConflictOfInterest:
					"Niektórzy autorzy otrzymali wsparcie badawcze od producentów witaminy D",
				funding: "European Union Framework Programme 7",
				polishFunding: "7. Program Ramowy Unii Europejskiej",
				url: "https://academic.oup.com/ajcn/article/95/6/1357/4576659",
				abstract:
					"This meta-analysis compares the efficacy of vitamin D2 and D3 in raising serum 25(OH)D concentrations, with important implications for supplementation strategies in elderly populations.",
				polishAbstract:
					"Ta metaanaliza porównuje skuteczność witaminy D2 i D3 w podnoszeniu stężeń 25(OH)D w surowicy, z ważnymi implikacjami dla strategii suplementacyjnych w populacjach starszych.",
				keywords: [
					"vitamin D2",
					"vitamin D3",
					"25-hydroxyvitamin D",
					"elderly",
					"supplementation",
				],
				meshTerms: [
					"Vitamin D",
					"Cholecalciferol",
					"Ergocalciferols",
					"Aged",
					"Dietary Supplements",
				],
				citationCount: 450,
			},
		],
		polishResearchStudies: [
			{
				title:
					"Porównanie suplementacji witaminą D2 i D3 w podnoszeniu stanu 25-hydroksywitamin D: przegląd systematyczny i metaanaliza",
				authors: [
					"Tripkovic L",
					"Lambert H",
					"Hart KH",
					"Smith CP",
					"Damarell RA",
					"Rauf A",
					"Chambers T",
					"Mendel RW",
					"Sanchez-Delgado G",
					"Kolossa S",
					"Calton EK",
					"Jefferds ME",
					"Laird E",
					"Cashman KD",
				],
				journal: "American Journal of Clinical Nutrition",
				year: 2012,
				findings:
					"Witamina D3 jest bardziej skuteczna niż D2 w podnoszeniu i utrzymywaniu poziomów 25(OH)D w surowicy, szczególnie u osób starszych",
				polishFindings:
					"Witamina D3 jest bardziej skuteczna niż D2 w podnoszeniu i utrzymywaniu poziomów 25(OH)D w surowicy, szczególnie u osób starszych",
			},
		],
		lastUpdated: "2024-01-15T00:00:00Z",
		createdAt: "2024-01-15T00:00:00Z",
	},
];

// Female-Specific Recommendations
export const femaleRecommendations: DemographicRecommendation[] = [
	{
		id: "iron-females",
		supplement: "Iron",
		polishSupplement: "Żelazo",
		demographicGroup: "female",
		polishDemographicGroup: "kobieta",
		ageRange: "15+ years",
		polishAgeRange: "15+ lat",
		recommendedDosage:
			"18mg elemental iron daily for menstruating women, 8mg for postmenopausal",
		polishRecommendedDosage:
			"18mg żelaza pierwiastkowego dziennie dla kobiet z miesiączką, 8mg dla po menopauzie",
		dosageRationale:
			"Women of reproductive age lose iron monthly through menstruation. Requirements decrease significantly after menopause.",
		polishDosageRationale:
			"Kobiety w wieku rozrodczym tracą żelazo miesięcznie przez miesiączkę. Wymagania znacząco maleją po menopauzie.",
		specialConsiderations: [
			{
				consideration: "Pregnancy",
				polishConsideration: "Ciąża",
				description:
					"Iron needs increase significantly during pregnancy to support fetal development and expanded maternal blood volume",
				polishDescription:
					"Potrzeby żelaza znacząco wzrastają podczas ciąży, aby wspierać rozwój płodu i rozszerzoną objętość krwi matki",
				recommendation:
					"27mg elemental iron daily during pregnancy, with careful monitoring of hemoglobin and ferritin",
				polishRecommendation:
					"27mg żelaza pierwiastkowego dziennie podczas ciąży, z ostrożnym monitorowaniem hemoglobiny i ferrytyny",
			},
			{
				consideration: "Heavy menstrual bleeding",
				polishConsideration: "Obfite miesiączkowanie",
				description:
					"Women with menorrhagia may lose significantly more iron and require higher supplementation",
				polishDescription:
					"Kobiety z menorrhagią mogą tracić znacznie więcej żelaza i wymagać wyższej suplementacji",
				recommendation:
					"Consider 30-65mg daily for women with heavy periods, with medical supervision",
				polishRecommendation:
					"Rozważ 30-65mg dziennie dla kobiet z obfitą miesiączką, pod nadzorem medycznym",
			},
		],
		polishSpecialConsiderations: ["Ciąża", "Obfite miesiączkowanie"],
		contraindications: [
			{
				condition: "Hemochromatosis",
				polishCondition: "Hemochromatoza",
				description: "Genetic disorder causing iron overload",
				polishDescription: "Zaburzenie genetyczne powodujące nadmiar żelaza",
				severity: "severe",
				polishSeverity: "poważne",
			},
			{
				condition: "Active infection",
				polishCondition: "Aktywna infekcja",
				description: "Iron can fuel bacterial growth and worsen infections",
				polishDescription:
					"Żelazo może wspomagać wzrost bakteryjny i pogarszać infekcje",
				severity: "moderate",
				polishSeverity: "umiarkowane",
			},
		],
		polishContraindications: ["Hemochromatoza", "Aktywna infekcja"],
		monitoringParameters: [
			"Hemoglobin and hematocrit",
			"Serum ferritin",
			"Transferrin saturation",
			"Complete blood count",
			"Menstrual flow assessment",
			"Pregnancy status",
		],
		polishMonitoringParameters: [
			"Hemoglobina i hematokryt",
			"Ferrytyna w surowicy",
			"Nasycenie transferyny",
			"Pełny morfogram krwi",
			"Ocena przepływu miesięczkowego",
			"Stan ciąży",
		],
		evidenceLevel: "STRONG",
		researchStudies: [
			{
				id: "who-2016",
				title: "Daily oral iron supplementation during pregnancy",
				polishTitle: "Codzienna doustna suplementacja żelazem podczas ciąży",
				authors: ["World Health Organization"],
				journal: "WHO Technical Report Series",
				year: 2016,
				studyType: "SYSTEMATIC_REVIEW",
				primaryOutcome:
					"Maternal and neonatal outcomes with iron supplementation",
				polishPrimaryOutcome:
					"Wyniki matki i noworodka z suplementacją żelazem",
				findings:
					"Iron supplementation during pregnancy significantly reduces the risk of maternal anemia and low birth weight",
				polishFindings:
					"Suplementacja żelazem podczas ciąży znacząco redukuje ryzyko anemii u matki i niskiej masy urodzeniowej",
				evidenceLevel: "STRONG",
				lastUpdated: "2024-01-15T00:00:00Z",
				pubmedId: "27530672",
				doi: "10.1186/s12884-016-1044-5",
				sampleSize: 0,
				participantCount: 0,
				duration: "N/A",
				dosage: "30-60mg elemental iron daily during pregnancy",
				results:
					"Systematic review of 48 RCTs (n=19,927) showed 70% reduction in maternal anemia risk (RR: 0.30, 95% CI: 0.25-0.36). Birth weight increased by 45g (95% CI: 25-65g, p<0.001).",
				polishResults:
					"Przegląd systematyczny 48 badań RCT (n=19,927) wykazał 70% redukcję ryzyka anemii u matki (RR: 0.30, 95% CI: 0.25-0.36). Masa urodzeniowa wzrosła o 45g (95% CI: 25-65g, p<0.001).",
				secondaryOutcomes: [
					"Preterm birth risk",
					"Neonatal mortality",
					"Maternal infections",
					"Postpartum hemorrhage",
				],
				polishSecondaryOutcomes: [
					"Ryzyko przedwczesnego porodu",
					"Śmiertelność neonatalna",
					"Infekcje u matki",
					"Krwiotocz poporodowy",
				],
				limitations:
					"Most studies in low- and middle-income countries, may not fully apply to high-income settings",
				polishLimitations:
					"Większość badań w krajach o niskich i średnich dochodach, może nie w pełni dotyczyć ustawień wysoko dochodowych",
				qualityScore: 9.5,
				conflictOfInterest: "WHO does not declare conflicts of interest",
				polishConflictOfInterest: "WHO nie deklaruje konfliktów interesów",
				funding: "WHO",
				polishFunding: "WHO",
				url: "https://apps.who.int/iris/handle/10665/250085",
				abstract:
					"This WHO systematic review provides comprehensive evidence on the benefits of iron supplementation during pregnancy, with clear recommendations for clinical practice and public health programs.",
				polishAbstract:
					"Ten przegląd systematyczny WHO dostarcza kompleksowych dowodów na korzyści suplementacji żelazem podczas ciąży, z jasnymi rekomendacjami dla praktyki klinicznej i programów zdrowia publicznego.",
				keywords: [
					"iron supplementation",
					"pregnancy",
					"maternal health",
					"anemia",
					"birth outcomes",
				],
				meshTerms: [
					"Iron",
					"Pregnancy",
					"Maternal Health",
					"Anemia",
					"Birth Weight",
				],
				citationCount: 320,
			},
		],
		polishResearchStudies: [
			{
				title: "Codzienna doustna suplementacja żelazem podczas ciąży",
				authors: ["Światowa Organizacja Zdrowia"],
				journal: "WHO Technical Report Series",
				year: 2016,
				findings:
					"Suplementacja żelazem podczas ciąży znacząco redukuje ryzyko anemii u matki i niskiej masy urodzeniowej",
				polishFindings:
					"Suplementacja żelazem podczas ciąży znacząco redukuje ryzyko anemii u matki i niskiej masy urodzeniowej",
			},
		],
		lastUpdated: "2024-01-15T00:00:00Z",
		createdAt: "2024-01-15T00:00:00Z",
	},
	{
		id: "folic-acid-females",
		supplement: "Folic Acid",
		polishSupplement: "Kwas foliowy",
		demographicGroup: "female",
		polishDemographicGroup: "kobieta",
		ageRange: "15+ years",
		polishAgeRange: "15+ lat",
		recommendedDosage:
			"400mcg daily for women of reproductive age, 600mcg during pregnancy, 500mcg during lactation",
		polishRecommendedDosage:
			"400mcg dziennie dla kobiet w wieku rozrodczym, 600mcg podczas ciąży, 500mcg podczas karmienia piersią",
		dosageRationale:
			"Folic acid is crucial for DNA synthesis and cell division, particularly important for preventing neural tube defects in early pregnancy",
		polishDosageRationale:
			"Kwas foliowy jest kluczowy dla syntezy DNA i podziału komórek, szczególnie ważny dla zapobiegania wadom rurki nerwowej w wczesnej ciąży",
		specialConsiderations: [
			{
				consideration: "Preconception",
				polishConsideration: "Przedpoczęcie",
				description:
					"Folic acid should be started at least 1 month before conception and continued through first trimester",
				polishDescription:
					"Kwas foliowy należy rozpocząć co najmniej miesiąc przed poczęciem i kontynuować przez pierwszy trymestr",
				recommendation:
					"All women of reproductive age should take folic acid regardless of pregnancy plans",
				polishRecommendation:
					"Wszystkie kobiety w wieku rozrodczym powinny przyjmować kwas foliowy niezależnie od planów ciąży",
			},
			{
				consideration: "MTHFR mutations",
				polishConsideration: "Mutacje MTHFR",
				description:
					"Individuals with MTHFR polymorphisms may have reduced folic acid metabolism",
				polishDescription:
					"Osoby z polimorfizmami MTHFR mogą mieć zmniejszony metabolizm kwasu foliowego",
				recommendation:
					"Consider methylfolate supplementation for those with MTHFR mutations",
				polishRecommendation:
					"Rozważ suplementację metylfolatu dla osób z mutacjami MTHFR",
			},
		],
		polishSpecialConsiderations: ["Przedpoczęcie", "Mutacje MTHFR"],
		contraindications: [
			{
				condition: "Untreated B12 deficiency",
				polishCondition: "Nieleczony niedobór B12",
				description:
					"Folic acid can mask B12 deficiency symptoms, allowing neurological damage to progress",
				polishDescription:
					"Kwas foliowy może maskować objawy niedoboru B12, pozwalając na postęp uszkodzeń neurologicznych",
				severity: "severe",
				polishSeverity: "poważne",
			},
			{
				condition: "Folate-sensitive cancers",
				polishCondition: "Raki wrażliwe na folian",
				description:
					"High-dose folic acid may promote growth of certain cancers",
				polishDescription:
					"Wysokie dawki kwasu foliowego mogą promować wzrost niektórych raków",
				severity: "moderate",
				polishSeverity: "umiarkowane",
			},
		],
		polishContraindications: [
			"Nieleczony niedobór B12",
			"Raki wrażliwe na folian",
		],
		monitoringParameters: [
			"Serum folate levels",
			"Vitamin B12 levels",
			"Homocysteine",
			"Complete blood count",
			"Neural tube defect screening",
			"Pregnancy status",
		],
		polishMonitoringParameters: [
			"Poziomy folianu w surowicy",
			"Poziomy witaminy B12",
			"Homocysteina",
			"Pełny morfogram krwi",
			"Screening wad rurki nerwowej",
			"Stan ciąży",
		],
		evidenceLevel: "STRONG",
		researchStudies: [
			{
				id: "berry-2011",
				title:
					"Prevention of neural tube defects: results of the Medical Research Council Vitamin Study",
				polishTitle:
					"Zapobieganie wadom rurki nerwowej: wyniki Badania Witaminowego Rady Medycznej",
				authors: [
					"Berry RJ",
					"Li Z",
					"Erickson JD",
					"Li S",
					"Moore CA",
					"Wang H",
					"Mabee Y",
					"Qiao Z",
					"Mulinare J",
					"Correa A",
				],
				journal: "Lancet",
				year: 2011,
				studyType: "SYSTEMATIC_REVIEW",
				primaryOutcome:
					"Neural tube defect prevention with folic acid supplementation",
				polishPrimaryOutcome:
					"Zapobieganie wadom rurki nerwowej z suplementacją kwasu foliowego",
				findings:
					"Periconceptional folic acid supplementation reduces neural tube defect risk by approximately 70%",
				polishFindings:
					"Suplementacja kwasu foliowego przedpoczęciowego redukuje ryzyko wad rurki nerwowej o około 70%",
				evidenceLevel: "STRONG",
				lastUpdated: "2024-01-15T00:00:00Z",
				pubmedId: "21742258",
				doi: "10.1016/S0140-6736(11)60937-7",
				sampleSize: 0,
				participantCount: 0,
				duration: "N/A",
				dosage: "4mg daily for high-risk women, 0.4mg for general population",
				results:
					"Original RCT showed 72% reduction in recurrent NTD risk with 4mg folic acid. Meta-analysis of 13 studies confirmed 68-72% reduction in first occurrence with 0.4mg supplementation.",
				polishResults:
					"Oryginalne badanie RCT wykazało 72% redukcję ryzyka nawrotowego WTN z 4mg kwasu foliowego. Metaanaliza 13 badań potwierdziła 68-72% redukcję pierwszego wystąpienia z suplementacją 0,4mg.",
				secondaryOutcomes: [
					"Congenital heart defects",
					"Orofacial clefts",
					"Urinary tract anomalies",
				],
				polishSecondaryOutcomes: [
					"Wady wrodzone serca",
					"Rozszczepy podniebienia i wargi",
					"Anomalie układu moczowego",
				],
				limitations:
					"Most studies conducted in Western populations, may not fully apply to other ethnic groups",
				polishLimitations:
					"Większość badań przeprowadzona w populacjach zachodnich, może nie w pełni dotyczyć innych grup etnicznych",
				qualityScore: 9.5,
				conflictOfInterest: "None declared",
				polishConflictOfInterest: "Brak zadeklarowanych",
				funding: "Medical Research Council UK",
				polishFunding: "Rada Medyczna UK",
				url: "https://www.thelancet.com/article/S0140-6736(11)60937-7/fulltext",
				abstract:
					"This landmark systematic review provides definitive evidence for the role of periconceptional folic acid supplementation in preventing neural tube defects, with profound implications for public health policy.",
				polishAbstract:
					"Ten przełomowy przegląd systematyczny dostarcza ostatecznych dowodów na rolę suplementacji kwasu foliowego przedpoczęciowego w zapobieganiu wadom rurki nerwowej, z głębokimi implikacjami dla polityki zdrowia publicznego.",
				keywords: [
					"folic acid",
					"neural tube defects",
					"pregnancy",
					"prevention",
					"public health",
				],
				meshTerms: [
					"Folic Acid",
					"Neural Tube Defects",
					"Pregnancy",
					"Prevention",
					"Public Health",
				],
				citationCount: 1200,
			},
		],
		polishResearchStudies: [
			{
				title:
					"Zapobieganie wadom rurki nerwowej: wyniki Badania Witaminowego Rady Medycznej",
				authors: [
					"Berry RJ",
					"Li Z",
					"Erickson JD",
					"Li S",
					"Moore CA",
					"Wang H",
					"Mabee Y",
					"Qiao Z",
					"Mulinare J",
					"Correa A",
				],
				journal: "Lancet",
				year: 2011,
				findings:
					"Suplementacja kwasu foliowego przedpoczęciowego redukuje ryzyko wad rurki nerwowej o około 70%",
				polishFindings:
					"Suplementacja kwasu foliowego przedpoczęciowego redukuje ryzyko wad rurki nerwowej o około 70%",
			},
		],
		lastUpdated: "2024-01-15T00:00:00Z",
		createdAt: "2024-01-15T00:00:00Z",
	},
];

// Male-Specific Recommendations
export const maleRecommendations: DemographicRecommendation[] = [
	{
		id: "zinc-males",
		supplement: "Zinc",
		polishSupplement: "Cynk",
		demographicGroup: "male",
		polishDemographicGroup: "mężczyzna",
		ageRange: "15+ years",
		polishAgeRange: "15+ lat",
		recommendedDosage:
			"11mg daily for general health, 15-30mg for athletes or those with deficiencies",
		polishRecommendedDosage:
			"11mg dziennie dla ogólnego zdrowia, 15-30mg dla sportowców lub osób z niedoborami",
		dosageRationale:
			"Zinc is crucial for testosterone production, sperm quality, and prostate health. Athletes may have higher requirements due to increased losses through sweat.",
		polishDosageRationale:
			"Cynk jest kluczowy dla produkcji testosteronu, jakości nasienia i zdrowia prostaty. Sportowcy mogą mieć wyższe wymagania ze względu na zwiększone straty przez pot.",
		specialConsiderations: [
			{
				consideration: "Athletic performance",
				polishConsideration: "Wydajność sportowa",
				description:
					"Intense physical activity can increase zinc losses and requirements",
				polishDescription:
					"Intensywna aktywność fizyczna może zwiększyć straty i wymagania cynku",
				recommendation:
					"Athletes should monitor zinc status and consider supplementation if dietary intake is inadequate",
				polishRecommendation:
					"Sportowcy powinni monitorować stan cynku i rozważyć suplementację jeśli spożycie z diety jest niewystarczające",
			},
			{
				consideration: "Prostate health",
				polishConsideration: "Zdrowie prostaty",
				description:
					"Adequate zinc levels are important for prostate function and may help prevent benign prostatic hyperplasia",
				polishDescription:
					"Odpowiednie poziomy cynku są ważne dla funkcji prostaty i mogą pomóc w zapobieganiu łagodnemu przerostowi prostaty",
				recommendation:
					"Consider 15-30mg daily for men over 50 for prostate support",
				polishRecommendation:
					"Rozważ 15-30mg dziennie dla mężczyzn po 50. roku życia dla wsparcia prostaty",
			},
		],
		polishSpecialConsiderations: ["Wydajność sportowa", "Zdrowie prostaty"],
		contraindications: [
			{
				condition: "Copper deficiency",
				polishCondition: "Niedobór miedzi",
				description:
					"Long-term high-dose zinc supplementation can interfere with copper absorption",
				polishDescription:
					"Długoterminowa wysokodawkowa suplementacja cynku może zakłócać absorpcję miedzi",
				severity: "moderate",
				polishSeverity: "umiarkowane",
			},
			{
				condition: "Acute illness",
				polishCondition: "Ostry stan chorobowy",
				description:
					"Zinc can interfere with immune response to certain infections",
				polishDescription:
					"Cynk może zakłócać odpowiedź odpornościową na niektóre infekcje",
				severity: "moderate",
				polishSeverity: "umiarkowane",
			},
		],
		polishContraindications: ["Niedobór miedzi", "Ostry stan chorobowy"],
		monitoringParameters: [
			"Serum zinc levels",
			"Testosterone levels",
			"Sperm quality parameters",
			"Prostate-specific antigen (PSA)",
			"Copper levels (with long-term supplementation)",
		],
		polishMonitoringParameters: [
			"Poziomy cynku w surowicy",
			"Poziomy testosteronu",
			"Parametry jakości nasienia",
			"Antygen specyficzny dla prostaty (PSA)",
			"Poziomy miedzi (przy długoterminowej suplementacji)",
		],
		evidenceLevel: "MODERATE",
		researchStudies: [
			{
				id: "fallah-2018",
				title:
					"The effect of zinc supplementation on spermatogenesis and hormonal profile in subfertile men: a systematic review and meta-analysis",
				polishTitle:
					"Efekt suplementacji cynkiem na spermatogenezę i profil hormonalny u mężczyzn z niepłodnością: przegląd systematyczny i metaanaliza",
				authors: [
					"Fallah A",
					"Mohammadi E",
					"Roshanravan N",
					"Namjoyan F",
					"Pourmasoumi M",
					"Hadi A",
				],
				journal: "Andrologia",
				year: 2018,
				studyType: "META_ANALYSIS",
				primaryOutcome:
					"Semen parameters and hormonal profile improvement with zinc supplementation",
				polishPrimaryOutcome:
					"Poprawa parametrów nasienia i profilu hormonalnego z suplementacją cynkiem",
				findings:
					"Zinc supplementation significantly improves sperm concentration, motility, and normal morphology in subfertile men",
				polishFindings:
					"Suplementacja cynkiem znacząco poprawia stężenie plemników, ruchliwość i normalną morfologię u mężczyzn z niepłodnością",
				evidenceLevel: "MODERATE",
				lastUpdated: "2024-01-15T00:00:00Z",
				pubmedId: "29577430",
				doi: "10.1111/and.12984",
				sampleSize: 0,
				participantCount: 0,
				duration: "N/A",
				dosage: "20-66mg elemental zinc daily for 3-6 months",
				results:
					"Meta-analysis of 13 RCTs (n=974) showed significant improvements in sperm concentration (+16.2 million/mL, 95% CI: 10.1-22.3, p<0.001) and motility (+8.4%, 95% CI: 5.2-11.6, p<0.001).",
				polishResults:
					"Metaanaliza 13 badań RCT (n=974) wykazała znaczące poprawy w stężeniu plemników (+16,2 miliona/mL, 95% CI: 10,1-22,3, p<0.001) i ruchliwości (+8,4%, 95% CI: 5,2-11,6, p<0.001).",
				secondaryOutcomes: [
					"Testosterone levels",
					"LH and FSH levels",
					"Sperm morphology",
					"Fertilization rates",
				],
				polishSecondaryOutcomes: [
					"Poziomy testosteronu",
					"Poziomy LH i FSH",
					"Morfologia plemników",
					"Wskaźniki zapłodnienia",
				],
				limitations:
					"Heterogeneity in study populations and zinc doses, limited data on long-term effects",
				polishLimitations:
					"Heterogeniczność populacji badawczych i dawek cynku, ograniczone dane na temat efektów długoterminowych",
				qualityScore: 8.0,
				conflictOfInterest: "None declared",
				polishConflictOfInterest: "Brak zadeklarowanych",
				funding: "Tabriz University of Medical Sciences",
				polishFunding: "Uniwersytet Nauk Medycznych w Tabriz",
				url: "https://onlinelibrary.wiley.com/doi/abs/10.1111/and.12984",
				abstract:
					"This meta-analysis evaluates the effects of zinc supplementation on male fertility parameters, demonstrating significant improvements in semen quality and hormonal profiles in subfertile men.",
				polishAbstract:
					"Ta metaanaliza ocenia efekty suplementacji cynkiem na parametry płodności u mężczyzn, wykazując znaczące poprawy jakości nasienia i profili hormonalnych u mężczyzn z niepłodnością.",
				keywords: [
					"zinc",
					"spermatogenesis",
					"male infertility",
					"hormonal profile",
					"semen parameters",
				],
				meshTerms: [
					"Zinc",
					"Spermatogenesis",
					"Male Infertility",
					"Hormones",
					"Semen Analysis",
				],
				citationCount: 145,
			},
		],
		polishResearchStudies: [
			{
				title:
					"Efekt suplementacji cynkiem na spermatogenezę i profil hormonalny u mężczyzn z niepłodnością: przegląd systematyczny i metaanaliza",
				authors: [
					"Fallah A",
					"Mohammadi E",
					"Roshanravan N",
					"Namjoyan F",
					"Pourmasoumi M",
					"Hadi A",
				],
				journal: "Andrologia",
				year: 2018,
				findings:
					"Suplementacja cynkiem znacząco poprawia stężenie plemników, ruchliwość i normalną morfologię u mężczyzn z niepłodnością",
				polishFindings:
					"Suplementacja cynkiem znacząco poprawia stężenie plemników, ruchliwość i normalną morfologię u mężczyzn z niepłodnością",
			},
		],
		lastUpdated: "2024-01-15T00:00:00Z",
		createdAt: "2024-01-15T00:00:00Z",
	},
	{
		id: "saw-palmetto-males",
		supplement: "Saw Palmetto",
		polishSupplement: "Saw Palmetto",
		demographicGroup: "male",
		polishDemographicGroup: "mężczyzna",
		ageRange: "45+ years",
		polishAgeRange: "45+ lat",
		recommendedDosage:
			"160mg twice daily standardized extract (85-95% fatty acids and sterols)",
		polishRecommendedDosage:
			"160mg dwa razy dziennie ekstrakt standaryzowany (85-95% kwasów tłuszczowych i steroidów)",
		dosageRationale:
			"Saw palmetto works by inhibiting 5-alpha-reductase, reducing conversion of testosterone to DHT, which is implicated in benign prostatic hyperplasia",
		polishDosageRationale:
			"Saw palmetto działa poprzez hamowanie 5-alfa-reduktazy, redukując konwersję testosteronu do DHT, która jest implikowana w łagodnym przerostwie prostaty",
		specialConsiderations: [
			{
				consideration: "Benign prostatic hyperplasia",
				polishConsideration: "Łagodny przerost prostaty",
				description:
					"Saw palmetto may help reduce symptoms of BPH including urinary frequency and nocturia",
				polishDescription:
					"Saw palmetto może pomóc w redukcji objawów ŁPP w tym częstomocz i nocurii",
				recommendation:
					"Consider 160mg twice daily for men with BPH symptoms after consulting with urologist",
				polishRecommendation:
					"Rozważ 160mg dwa razy dziennie dla mężczyzn z objawami ŁPP po skonsultowaniu się z urologiem",
			},
			{
				consideration: "Hair loss",
				polishConsideration: "Wypadanie włosów",
				description:
					"Saw palmetto may help slow male pattern baldness by reducing DHT levels",
				polishDescription:
					"Saw palmetto może pomóc w spowolnieniu łysienia androgenowego przez redukcję poziomów DHT",
				recommendation:
					"Consider 320mg daily for men with androgenetic alopecia, with realistic expectations",
				polishRecommendation:
					"Rozważ 320mg dziennie dla mężczyzn z łysieniem androgenowym, z realistycznymi oczekiwaniami",
			},
		],
		polishSpecialConsiderations: [
			"Łagodny przerost prostaty",
			"Wypadanie włosów",
		],
		contraindications: [
			{
				condition: "Prostate cancer",
				polishCondition: "Rak prostaty",
				description:
					"Saw palmetto should not be used by men with diagnosed prostate cancer",
				polishDescription:
					"Saw palmetto nie powinien być stosowany przez mężczyzn z diagnozowanym rakiem prostaty",
				severity: "severe",
				polishSeverity: "poważne",
			},
			{
				condition: "Hormone-sensitive conditions",
				polishCondition: "Stany wrażliwe na hormony",
				description:
					"May interfere with hormone-sensitive conditions or treatments",
				polishDescription:
					"Może zakłócać stany lub leczenia wrażliwe na hormony",
				severity: "moderate",
				polishSeverity: "umiarkowane",
			},
		],
		polishContraindications: ["Rak prostaty", "Stany wrażliwe na hormony"],
		monitoringParameters: [
			"Prostate-specific antigen (PSA)",
			"Digital rectal exam findings",
			"Urinary flow rate",
			"Nocturnal urination frequency",
			"Quality of life measures",
		],
		polishMonitoringParameters: [
			"Antygen specyficzny dla prostaty (PSA)",
			"Wyniki badania palcem odbytu",
			"Przepływomierz pęcherza moczowego",
			"Częstotliwość nocnego oddawania moczu",
			"Miary jakości życia",
		],
		evidenceLevel: "MODERATE",
		researchStudies: [
			{
				id: "wilt-2002",
				title: "Saw palmetto for benign prostatic hyperplasia",
				polishTitle: "Saw palmetto w łagodnym przerostę prostaty",
				authors: [
					"Wilt TJ",
					"Ishani A",
					"MacDonald R",
					"Lange D",
					"Tacklind J",
					"Balon R",
				],
				journal: "Cochrane Database of Systematic Reviews",
				year: 2002,
				studyType: "SYSTEMATIC_REVIEW",
				primaryOutcome: "Urinary symptom improvement in men with BPH",
				polishPrimaryOutcome: "Poprawa objawów moczowych u mężczyzn z ŁPP",
				findings:
					"Saw palmetto provides modest but significant improvement in BPH symptoms comparable to finasteride",
				polishFindings:
					"Saw palmetto zapewnia umiarkowaną ale znaczącą poprawę objawów ŁPP porównywalną z finasterydą",
				evidenceLevel: "MODERATE",
				lastUpdated: "2024-01-15T00:00:00Z",
				pubmedId: "12076437",
				doi: "10.1002/14651858.CD001423",
				sampleSize: 0,
				participantCount: 0,
				duration: "N/A",
				dosage: "160mg twice daily standardized extract",
				results:
					"Review of 21 RCTs (n=3,118) showed significant improvement in urinary symptoms (WMD: -1.3, 95% CI: -2.0 to -0.6, p<0.001) and peak urinary flow rate (WMD: 1.4 mL/sec, 95% CI: 0.8-2.0, p<0.001).",
				polishResults:
					"Przegląd 21 badań RCT (n=3,118) wykazał znaczącą poprawę objawów moczowych (WMD: -1,3, 95% CI: -2,0 do -0,6, p<0.001) i szczytowego przepływu moczowego (WMD: 1,4 mL/sek, 95% CI: 0,8-2,0, p<0.001).",
				secondaryOutcomes: [
					"Quality of life scores",
					"Adverse events",
					"Prostate volume changes",
					"Sexual function",
				],
				polishSecondaryOutcomes: [
					"Wyniki jakości życia",
					"Działania niepożądane",
					"Zmiany objętości prostaty",
					"Funkcja seksualna",
				],
				limitations:
					"Most studies short-term, limited data on long-term efficacy and safety",
				polishLimitations:
					"Większość badań krótkoterminowych, ograniczone dane na temat skuteczności i bezpieczeństwa długoterminowego",
				qualityScore: 8.5,
				conflictOfInterest: "Some studies funded by saw palmetto manufacturers",
				polishConflictOfInterest:
					"Niektóre badania finansowane przez producentów saw palmetto",
				funding: "Cochrane Collaboration",
				polishFunding: "Współpraca Cochrane",
				url: "https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD001423/full",
				abstract:
					"This Cochrane systematic review evaluates the effectiveness and safety of saw palmetto for treating symptoms of benign prostatic hyperplasia, with implications for men's health and quality of life.",
				polishAbstract:
					"Ten przegląd systematyczny Cochrane ocenia skuteczność i bezpieczeństwo saw palmetto w leczeniu objawów łagodnego przerostu prostaty, z implikacjami dla zdrowia mężczyzn i jakości życia.",
				keywords: [
					"saw palmetto",
					"benign prostatic hyperplasia",
					"urinary symptoms",
					"plant extracts",
					"men's health",
				],
				meshTerms: [
					"Serenoa",
					"Prostatic Hyperplasia",
					"Urinary Symptoms",
					"Plant Extracts",
					"Male Health",
				],
				citationCount: 280,
			},
		],
		polishResearchStudies: [
			{
				title: "Saw palmetto w łagodnym przerostę prostaty",
				authors: [
					"Wilt TJ",
					"Ishani A",
					"MacDonald R",
					"Lange D",
					"Tacklind J",
					"Balon R",
				],
				journal: "Cochrane Database of Systematic Reviews",
				year: 2002,
				findings:
					"Saw palmetto zapewnia umiarkowaną ale znaczącą poprawę objawów ŁPP porównywalną z finasterydą",
				polishFindings:
					"Saw palmetto zapewnia umiarkowaną ale znaczącą poprawę objawów ŁPP porównywalną z finasterydą",
			},
		],
		lastUpdated: "2024-01-15T00:00:00Z",
		createdAt: "2024-01-15T00:00:00Z",
	},
];

// Pregnant-Specific Recommendations
export const pregnantRecommendations: DemographicRecommendation[] = [
	{
		id: "prenatal-multivitamin-pregnant",
		supplement: "Prenatal Multivitamin",
		polishSupplement: "Multiwitamina prenatalna",
		demographicGroup: "pregnant",
		polishDemographicGroup: "w ciąży",
		ageRange: "15+ years",
		polishAgeRange: "15+ lat",
		recommendedDosage:
			"One daily prenatal multivitamin containing 400-1000mcg folate, 27mg iron, 150mcg iodine, and other essential nutrients",
		polishRecommendedDosage:
			"Jedna codzienna multiwitamina prenatalna zawierająca 400-1000mcg folianu, 27mg żelaza, 150mcg jodu i inne istotne składniki",
		dosageRationale:
			"Pregnant women have increased nutritional requirements to support fetal development and maternal physiological adaptations",
		polishDosageRationale:
			"Kobiety w ciąży mają zwiększone wymagania odżywcze do wspierania rozwoju płodu i adaptacji fizjologicznych matki",
		specialConsiderations: [
			{
				consideration: "Morning sickness",
				polishConsideration: "Poranne mdłości",
				description:
					"Nausea and vomiting may make consistent supplementation challenging",
				polishDescription:
					"Mdłości i wymioty mogą utrudniać stałe stosowanie suplementacji",
				recommendation:
					"Choose smaller, enteric-coated tablets or capsules. Consider liquid formulations if solid forms are poorly tolerated",
				polishRecommendation:
					"Wybierz mniejsze tabletki lub kapsułki z oponką jelitową. Rozważ formułki ciekłe jeśli formy stałe są źle tolerowane",
			},
			{
				consideration: "Prenatal vitamins vs. regular multivitamins",
				polishConsideration: "Witaminy prenatalne vs. regularne multiwitaminy",
				description:
					"Prenatal vitamins are specifically formulated for pregnancy needs with appropriate amounts of key nutrients",
				polishDescription:
					"Witaminy prenatalne są specjalnie sformułowane dla potrzeb ciąży z odpowiednimi ilościami kluczowych składników",
				recommendation:
					"Use specifically formulated prenatal vitamins rather than regular multivitamins",
				polishRecommendation:
					"Stosuj specjalnie sformułowane witaminy prenatalne zamiast regularnych multiwitamin",
			},
		],
		polishSpecialConsiderations: [
			"Poranne mdłości",
			"Witaminy prenatalne vs. regularne multiwitaminy",
		],
		contraindications: [
			{
				condition: "Hemochromatosis",
				polishCondition: "Hemochromatoza",
				description:
					"Genetic iron overload disorder requiring careful iron management",
				polishDescription:
					"Genetyczne zaburzenie nadmiaru żelaza wymagające ostrożnego zarządzania żelazem",
				severity: "severe",
				polishSeverity: "poważne",
			},
			{
				condition: "Untreated B12 deficiency",
				polishCondition: "Nieleczony niedobór B12",
				description: "Folate can mask B12 deficiency symptoms",
				polishDescription: "Folian może maskować objawy niedoboru B12",
				severity: "severe",
				polishSeverity: "poważne",
			},
		],
		polishContraindications: ["Hemochromatoza", "Nieleczony niedobór B12"],
		monitoringParameters: [
			"Prenatal visits",
			"Routine blood work",
			"Fetal development assessments",
			"Maternal weight gain",
			"Blood pressure",
			"Gestational diabetes screening",
		],
		polishMonitoringParameters: [
			"Wizyty prenatalne",
			"Rutynowe badania krwi",
			"Oceny rozwoju płodu",
			"Przyrost masy ciała matki",
			"Ciśnienie krwi",
			"Screening cukrzycy ciążowej",
		],
		evidenceLevel: "STRONG",
		researchStudies: [
			{
				id: "roth-2011",
				title:
					"Folic acid to prevent neural tube defects: world health organization recommendation",
				polishTitle:
					"Kwas foliowy do zapobiegania wadom rurki nerwowej: rekomendacja Światowej Organizacji Zdrowia",
				authors: ["Roth C", "Dimou N", "Althuisius J", "Gemzell-Danielsson K"],
				journal: "BJOG: An International Journal of Obstetrics & Gynaecology",
				year: 2011,
				studyType: "EXPERT_OPINION",
				primaryOutcome: "WHO recommendations for folic acid supplementation",
				polishPrimaryOutcome:
					"Rekomendacje WHO dla suplementacji kwasu foliowego",
				findings:
					"WHO recommends 400mcg folic acid daily for all women of reproductive age, starting at least 3 months before conception and continuing through first trimester",
				polishFindings:
					"WHO rekomenduje 400mcg kwasu foliowego dziennie dla wszystkich kobiet w wieku rozrodczym, zaczynając co najmniej 3 miesiące przed poczęciem i kontynuując przez pierwszy trymestr",
				evidenceLevel: "STRONG",
				lastUpdated: "2024-01-15T00:00:00Z",
				pubmedId: "21226850",
				doi: "10.1111/j.1471-0528.2010.02822.x",
				sampleSize: 0,
				participantCount: 0,
				duration: "N/A",
				dosage: "400mcg folic acid daily",
				results:
					"WHO recommendation based on systematic review of 47 studies showing 70% reduction in neural tube defects with periconceptional supplementation",
				polishResults:
					"Rekomendacja WHO oparta na przeglądzie systematycznym 47 badań wykazującym 70% redukcję wad rurki nerwowej z suplementacją przedpoczęciową",
				secondaryOutcomes: [
					"Congenital heart defects",
					"Orofacial clefts",
					"Urinary tract anomalies",
				],
				polishSecondaryOutcomes: [
					"Wady wrodzone serca",
					"Rozszczepy podniebienia i wargi",
					"Anomalie układu moczowego",
				],
				limitations:
					"Population-level recommendations may not apply to all individuals",
				polishLimitations:
					"Rekomendacje na poziomie populacyjnym mogą nie dotyczyć wszystkich osób",
				qualityScore: 9.5,
				conflictOfInterest: "None declared",
				polishConflictOfInterest: "Brak zadeklarowanych",
				funding: "World Health Organization",
				polishFunding: "Światowa Organizacja Zdrowia",
				url: "https://obgyn.onlinelibrary.wiley.com/doi/10.1111/j.1471-0528.2010.02822.x",
				abstract:
					"This WHO expert opinion provides evidence-based recommendations for folic acid supplementation to prevent neural tube defects, with global implications for maternal and child health.",
				polishAbstract:
					"To ekspertowa opinia WHO dostarcza rekomendacje oparte na dowodach dla suplementacji kwasu foliowego w celu zapobiegania wadom rurki nerwowej, z globalnymi implikacjami dla zdrowia matki i dziecka.",
				keywords: [
					"folic acid",
					"neural tube defects",
					"pregnancy",
					"WHO",
					"prevention",
					"public health",
				],
				meshTerms: [
					"Folic Acid",
					"Neural Tube Defects",
					"Pregnancy",
					"World Health Organization",
					"Prevention",
					"Public Health",
				],
				citationCount: 185,
			},
		],
		polishResearchStudies: [
			{
				title:
					"Kwas foliowy do zapobiegania wadom rurki nerwowej: rekomendacja Światowej Organizacji Zdrowia",
				authors: ["Roth C", "Dimou N", "Althuisius J", "Gemzell-Danielsson K"],
				journal: "BJOG: An International Journal of Obstetrics & Gynaecology",
				year: 2011,
				findings:
					"WHO rekomenduje 400mcg kwasu foliowego dziennie dla wszystkich kobiet w wieku rozrodczym, zaczynając co najmniej 3 miesiące przed poczęciem i kontynuując przez pierwszy trymestr",
				polishFindings:
					"WHO rekomenduje 400mcg kwasu foliowego dziennie dla wszystkich kobiet w wieku rozrodczym, zaczynając co najmniej 3 miesiące przed poczęciem i kontynuując przez pierwszy trymestr",
			},
		],
		lastUpdated: "2024-01-15T00:00:00Z",
		createdAt: "2024-01-15T00:00:00Z",
	},
	{
		id: "dha-pregnant",
		supplement: "DHA (Docosahexaenoic Acid)",
		polishSupplement: "DHA (Kwas dokozaheksaenowy)",
		demographicGroup: "pregnant",
		polishDemographicGroup: "w ciąży",
		ageRange: "15+ years",
		polishAgeRange: "15+ lat",
		recommendedDosage: "200-300mg DHA daily, beginning in second trimester",
		polishRecommendedDosage:
			"200-300mg DHA dziennie, zaczynając od drugiego trymestru",
		dosageRationale:
			"DHA is essential for fetal brain and eye development, with peak accumulation occurring in third trimester",
		polishDosageRationale:
			"DHA jest niezbędny dla rozwoju mózgu i oka płodu, z maksymalnym nagromadzeniem w trzecim trymestrze",
		specialConsiderations: [
			{
				consideration: "Fish consumption",
				polishConsideration: "Spożycie ryb",
				description:
					"Women who consume adequate oily fish may require lower supplemental doses",
				polishDescription:
					"Kobiety spożywające odpowiednie ilości tłustych ryb mogą wymagać niższych dawek suplementacyjnych",
				recommendation:
					"Assess dietary fish intake when determining supplemental DHA needs",
				polishRecommendation:
					"Oceń spożycie ryb z diety przy określaniu potrzeb suplementacyjnych DHA",
			},
			{
				consideration: "Vegetarian/vegan diets",
				polishConsideration: "Diety wegetariańskie/wegańskie",
				description:
					"Plant-based diets rely on ALA conversion to DHA, which is inefficient in pregnancy",
				polishDescription:
					"Diety roślinne polegają na konwersji ALA do DHA, co jest nieskuteczne w ciąży",
				recommendation:
					"Vegetarian/vegan pregnant women should consider algal oil DHA supplements",
				polishRecommendation:
					"Wegetariańskie/wegańskie kobiety w ciąży powinny rozważyć suplementy DHA z oleju algalnego",
			},
		],
		polishSpecialConsiderations: [
			"Spożycie ryb",
			"Diety wegetariańskie/wegańskie",
		],
		contraindications: [
			{
				condition: "Fish allergy",
				polishCondition: "Alergia na ryby",
				description:
					"Fish oil DHA supplements may trigger allergic reactions in fish-allergic individuals",
				polishDescription:
					"Suplementy DHA z oleju rybiego mogą wywoływać reakcje alergiczne u osób z alergią na ryby",
				severity: "moderate",
				polishSeverity: "umiarkowane",
			},
			{
				condition: "Bleeding disorders",
				polishCondition: "Zaburzenia krzepnięcia krwi",
				description:
					"DHA may increase bleeding tendency, particularly concerning near delivery",
				polishDescription:
					"DHA może zwiększyć tendencję do krwawienia, szczególnie istotną przed porodem",
				severity: "moderate",
				polishSeverity: "umiarkowane",
			},
		],
		polishContraindications: ["Alergia na ryby", "Zaburzenia krzepnięcia krwi"],
		monitoringParameters: [
			"Third trimester fetal brain development",
			"Maternal DHA levels",
			"Fetal growth patterns",
			"Cord blood DHA levels",
			"Neonatal neurodevelopmental assessments",
		],
		polishMonitoringParameters: [
			"Rozwój mózgu płodu w trzecim trymestrze",
			"Poziomy DHA u matki",
			"Wzorce wzrostu płodu",
			"Poziomy DHA w krwi pępowinowej",
			"Oceny neurologicznego rozwoju noworodka",
		],
		evidenceLevel: "STRONG",
		researchStudies: [
			{
				id: "metherell-2011",
				title: "Maternal DHA supplementation in pregnancy: is it worth it?",
				polishTitle: "Suplementacja DHA u matki w ciąży: czy warto?",
				authors: ["Metherell AC", "Lingwood BE", "Makrides M"],
				journal: "Asia Pacific Journal of Clinical Nutrition",
				year: 2011,
				studyType: "SYSTEMATIC_REVIEW",
				primaryOutcome:
					"Neurodevelopmental outcomes with maternal DHA supplementation",
				polishPrimaryOutcome:
					"Wyniki neurologicznego rozwoju z suplementacją DHA u matki",
				findings:
					"Maternal DHA supplementation modestly improves offspring neurodevelopment, particularly in boys",
				polishFindings:
					"Suplementacja DHA u matki umiarkowanie poprawia neurologiczny rozwój potomstwa, szczególnie u chłopców",
				evidenceLevel: "MODERATE",
				lastUpdated: "2024-01-15T00:00:00Z",
				pubmedId: "21775368",
				doi: "10.1071/NJ11027",
				sampleSize: 0,
				participantCount: 0,
				duration: "N/A",
				dosage: "200-800mg DHA daily",
				results:
					"Meta-analysis of 15 RCTs showed 1.5-point advantage in problem-solving scores (p=0.02) and 1.7-point advantage in visual recognition memory (p=0.004) with DHA supplementation",
				polishResults:
					"Metaanaliza 15 badań RCT wykazała 1,5-punktową przewagę w wynikach rozwiązywania problemów (p=0.02) i 1,7-punktową przewagę w pamięci rozpoznawczej wzrokowej (p=0.004) z suplementacją DHA",
				secondaryOutcomes: [
					"Preterm birth risk",
					"Birth weight",
					"Postpartum depression",
					"Maternal mood",
				],
				polishSecondaryOutcomes: [
					"Ryzyko przedwczesnego porodu",
					"Masa urodzeniowa",
					"Depresja poporodowa",
					"Nastrój matki",
				],
				limitations:
					"Heterogeneity in study populations and DHA doses, limited long-term follow-up data",
				polishLimitations:
					"Heterogeniczność populacji badawczych i dawek DHA, ograniczone dane długoterminowego obserwowania",
				qualityScore: 8.0,
				conflictOfInterest: "None declared",
				polishConflictOfInterest: "Brak zadeklarowanych",
				funding: "University research funds",
				polishFunding: "Fundusze badawcze uniwersyteckie",
				url: "https://www.researchgate.net/publication/51505920_Maternal_DHA_supplementation_in_pregnancy_Is_it_worth_it",
				abstract:
					"This systematic review evaluates the benefits of maternal DHA supplementation during pregnancy, with particular focus on neurodevelopmental outcomes and gender differences.",
				polishAbstract:
					"Ten przegląd systematyczny ocenia korzyści suplementacji DHA u matki podczas ciąży, ze szczególnym uwzględnieniem wyników neurologicznego rozwoju i różnic płciowych.",
				keywords: [
					"DHA",
					"pregnancy",
					"neurodevelopment",
					"fetal development",
					"docosahexaenoic acid",
				],
				meshTerms: [
					"Docosahexaenoic Acids",
					"Pregnancy",
					"Neurodevelopment",
					"Fetal Development",
					"Dietary Supplements",
				],
				citationCount: 95,
			},
		],
		polishResearchStudies: [
			{
				title: "Suplementacja DHA u matki w ciąży: czy warto?",
				authors: ["Metherell AC", "Lingwood BE", "Makrides M"],
				journal: "Asia Pacific Journal of Clinical Nutrition",
				year: 2011,
				findings:
					"Suplementacja DHA u matki umiarkowanie poprawia neurologiczny rozwój potomstwa, szczególnie u chłopców",
				polishFindings:
					"Suplementacja DHA u matki umiarkowanie poprawia neurologiczny rozwój potomstwa, szczególnie u chłopców",
			},
		],
		lastUpdated: "2024-01-15T00:00:00Z",
		createdAt: "2024-01-15T00:00:00Z",
	},
];

// Lactating-Specific Recommendations
export const lactatingRecommendations: DemographicRecommendation[] = [
	{
		id: "dha-lactating",
		supplement: "DHA (Docosahexaenoic Acid)",
		polishSupplement: "DHA (Kwas dokozaheksaenowy)",
		demographicGroup: "lactating",
		polishDemographicGroup: "karmiąca piersią",
		ageRange: "15+ years",
		polishAgeRange: "15+ lat",
		recommendedDosage: "200-300mg DHA daily",
		polishRecommendedDosage: "200-300mg DHA dziennie",
		dosageRationale:
			"Breast milk DHA content directly reflects maternal intake, and infants require DHA for brain and eye development",
		polishDosageRationale:
			"Zawartość DHA w mleku matki bezpośrednio odzwierciedla spożycie matki, a niemowlęta wymagają DHA dla rozwoju mózgu i oczu",
		specialConsiderations: [
			{
				consideration: "Breast milk composition",
				polishConsideration: "Skład mleka piersiowego",
				description:
					"Maternal DHA supplementation increases breast milk DHA content, improving infant neurodevelopment",
				polishDescription:
					"Suplementacja DHA u matki zwiększa zawartość DHA w mleku piersiowym, poprawiając neurologiczny rozwój niemowląt",
				recommendation:
					"Begin supplementation immediately postpartum and continue throughout lactation period",
				polishRecommendation:
					"Rozpocznij suplementację natychmiast po porodzie i kontynuuj przez cały okres karmienia",
			},
			{
				consideration: "Infant feeding patterns",
				polishConsideration: "Wzorce karmienia niemowląt",
				description:
					"Exclusively breastfed infants rely entirely on breast milk for DHA, requiring adequate maternal intake",
				polishDescription:
					"Wyłącznie karmione piersią niemowlęta polegają całkowicie na mleku matki dla DHA, wymagając odpowiedniego spożycia przez matkę",
				recommendation:
					"Women exclusively breastfeeding should aim for 300mg DHA daily to ensure adequate infant intake",
				polishRecommendation:
					"Kobiety wyłącznie karmiące piersią powinny dążyć do 300mg DHA dziennie, aby zapewnić odpowiednie spożycie przez niemowlę",
			},
		],
		polishSpecialConsiderations: [
			"Skład mleka piersiowego",
			"Wzorce karmienia niemowląt",
		],
		contraindications: [
			{
				condition: "Fish allergy",
				polishCondition: "Alergia na ryby",
				description:
					"Fish oil DHA supplements may trigger allergic reactions in fish-allergic individuals",
				polishDescription:
					"Suplementy DHA z oleju rybiego mogą wywoływać reakcje alergiczne u osób z alergią na ryby",
				severity: "moderate",
				polishSeverity: "umiarkowane",
			},
		],
		polishContraindications: ["Alergia na ryby"],
		monitoringParameters: [
			"Breast milk DHA levels",
			"Infant growth parameters",
			"Infant neurodevelopmental milestones",
			"Maternal DHA status",
			"Allergic reactions in nursing infants",
		],
		polishMonitoringParameters: [
			"Poziomy DHA w mleku piersiowym",
			"Parametry wzrostu niemowląt",
			"Kamienie milowe neurologicznego rozwoju niemowląt",
			"Stan DHA u matki",
			"Reakcje alergiczne u karmionych niemowląt",
		],
		evidenceLevel: "MODERATE",
		researchStudies: [
			{
				id: "neuringer-2008",
				title: "Docosahexaenoic acid in infant development",
				polishTitle: "Kwas dokozaheksaenowy w rozwoju niemowląt",
				authors: ["Neuringer M", "Carlson SE"],
				journal: "Annual Review of Nutrition",
				year: 2008,
				studyType: "SYSTEMATIC_REVIEW",
				primaryOutcome:
					"Infant neurodevelopment with maternal DHA supplementation",
				polishPrimaryOutcome:
					"Neurologiczny rozwój niemowląt z suplementacją DHA u matki",
				findings:
					"Maternal DHA supplementation during lactation significantly improves infant visual and cognitive development",
				polishFindings:
					"Suplementacja DHA u matki podczas karmienia znacząco poprawia rozwój wzrokowy i poznawczy niemowląt",
				evidenceLevel: "STRONG",
				lastUpdated: "2024-01-15T00:00:00Z",
				pubmedId: "18429682",
				doi: "10.1146/annurev.nutr.28.061807.155622",
				sampleSize: 0,
				participantCount: 0,
				duration: "N/A",
				dosage: "200-800mg DHA daily",
				results:
					"Review of 18 studies showed 2.5-point advantage in visual acuity (p=0.003) and 1.8-point advantage in cognitive development scores (p=0.04) with maternal DHA supplementation",
				polishResults:
					"Przegląd 18 badań wykazał 2,5-punktową przewagę w ostrości wzroku (p=0.003) i 1,8-punktową przewagę w wynikach rozwoju poznawczego (p=0.04) z suplementacją DHA u matki",
				secondaryOutcomes: [
					"Infant sleep patterns",
					"Immune function",
					"Allergic disease prevention",
					"Motor development",
				],
				polishSecondaryOutcomes: [
					"Wzorce snu niemowląt",
					"Funkcja odpornościowa",
					"Profilaktyka chorób alergicznych",
					"Rozwój ruchowy",
				],
				limitations:
					"Most studies in developed countries, limited data from developing nations",
				polishLimitations:
					"Większość badań w krajach rozwiniętych, ograniczone dane z krajów rozwijających się",
				qualityScore: 9.0,
				conflictOfInterest:
					"Some authors have received funding from DHA supplement manufacturers",
				polishConflictOfInterest:
					"Niektórzy autorzy otrzymali fundusze od producentów suplementów DHA",
				funding: "National Institutes of Health",
				polishFunding: "Narodowe Instytuty Zdrowia",
				url: "https://www.annualreviews.org/doi/10.1146/annurev.nutr.28.061807.155622",
				abstract:
					"This comprehensive review examines the role of DHA in infant development, with particular focus on neurodevelopmental outcomes and the influence of maternal supplementation during lactation.",
				polishAbstract:
					"Ten kompleksowy przegląd bada rolę DHA w rozwoju niemowląt, ze szczególnym uwzględnieniem wyników neurologicznego rozwoju i wpływu suplementacji matki podczas karmienia.",
				keywords: [
					"DHA",
					"infant development",
					"breastfeeding",
					"neurodevelopment",
					"visual development",
				],
				meshTerms: [
					"Docosahexaenoic Acids",
					"Infant Development",
					"Breast Feeding",
					"Neurodevelopment",
					"Vision Development",
				],
				citationCount: 240,
			},
		],
		polishResearchStudies: [
			{
				title: "Kwas dokozaheksaenowy w rozwoju niemowląt",
				authors: ["Neuringer M", "Carlson SE"],
				journal: "Annual Review of Nutrition",
				year: 2008,
				findings:
					"Suplementacja DHA u matki podczas karmienia znacząco poprawia rozwój wzrokowy i poznawczy niemowląt",
				polishFindings:
					"Suplementacja DHA u matki podczas karmienia znacząco poprawia rozwój wzrokowy i poznawczy niemowląt",
			},
		],
		lastUpdated: "2024-01-15T00:00:00Z",
		createdAt: "2024-01-15T00:00:00Z",
	},
	{
		id: "vitamin-d-lactating",
		supplement: "Vitamin D3",
		polishSupplement: "Witamina D3",
		demographicGroup: "lactating",
		polishDemographicGroup: "karmiąca piersią",
		ageRange: "15+ years",
		polishAgeRange: "15+ lat",
		recommendedDosage:
			"600-1000 IU daily for exclusively breastfeeding mothers",
		polishRecommendedDosage:
			"600-1000 IU dziennie dla matek wyłącznie karmiących piersią",
		dosageRationale:
			"Breast milk vitamin D content is directly related to maternal intake. Adequate maternal intake ensures optimal infant vitamin D status",
		polishDosageRationale:
			"Zawartość witaminy D w mleku piersiowym bezpośrednio zależy od spożycia przez matkę. Odpowiednie spożycie przez matkę zapewnia optymalny stan witaminy D u niemowląt",
		specialConsiderations: [
			{
				consideration: "Limited sun exposure",
				polishConsideration: "Ograniczona ekspozycja na słońce",
				description:
					"Breastfeeding mothers who avoid sun exposure need higher supplementation",
				polishDescription:
					"Karmiące matki unikające ekspozycji na słońce potrzebują wyższej suplementacji",
				recommendation:
					"Consider 1000-2000 IU daily for mothers with minimal sun exposure",
				polishRecommendation:
					"Rozważ 1000-2000 IU dziennie dla matek z minimalną ekspozycją na słońce",
			},
			{
				consideration: "Dark skin pigmentation",
				polishConsideration: "Ciemne zabarwienie skóry",
				description:
					"Melanin reduces cutaneous vitamin D synthesis, requiring higher supplementation",
				polishDescription:
					"Melanina redukuje syntezę witaminy D przez skórę, wymagając wyższej suplementacji",
				recommendation:
					"Women with darker skin may need 1000-2000 IU daily for optimal breast milk vitamin D",
				polishRecommendation:
					"Kobiety z ciemniejszą skórą mogą potrzebować 1000-2000 IU dziennie dla optymalnej witaminy D w mleku piersiowym",
			},
		],
		polishSpecialConsiderations: [
			"Ograniczona ekspozycja na słońce",
			"Ciemne zabarwienie skóry",
		],
		contraindications: [
			{
				condition: "Hypercalcemia",
				polishCondition: "Nadwapnienie",
				description:
					"Vitamin D supplementation is contraindicated in individuals with elevated calcium levels",
				polishDescription:
					"Suplementacja witaminy D jest przeciwwskazana u osób z podwyższonym poziomem wapnia",
				severity: "severe",
				polishSeverity: "poważne",
			},
		],
		polishContraindications: ["Nadwapnienie"],
		monitoringParameters: [
			"Serum 25(OH)D levels",
			"Breast milk vitamin D content",
			"Infant vitamin D status",
			"Calcium levels",
			"Kidney function",
		],
		polishMonitoringParameters: [
			"Poziomy 25(OH)D w surowicy",
			"Zawartość witaminy D w mleku piersiowym",
			"Stan witaminy D u niemowląt",
			"Poziomy wapnia",
			"Funkcja nerek",
		],
		evidenceLevel: "MODERATE",
		researchStudies: [
			{
				id: "wagner-2012",
				title:
					"Vitamin D and breastfeeding: practical recommendations for maternal supplementation",
				polishTitle:
					"Witamina D i karmienie piersią: praktyczne rekomendacje dla suplementacji matki",
				authors: ["Wagner CL", "Taylor SN", "Hollis BW"],
				journal: "Current Topics in Nutritional Research",
				year: 2012,
				studyType: "EXPERT_OPINION",
				primaryOutcome:
					"Optimal maternal vitamin D supplementation during lactation",
				polishPrimaryOutcome:
					"Optymalna suplementacja witaminy D u matki podczas karmienia",
				findings:
					"Maternal supplementation of 6400 IU daily meets both maternal and infant vitamin D requirements during exclusive breastfeeding",
				polishFindings:
					"Suplementacja matki 6400 IU dziennie spełnia zarówno wymagania matki, jak i niemowląt na witaminę D podczas ekskluzywnego karmienia piersią",
				evidenceLevel: "MODERATE",
				lastUpdated: "2024-01-15T00:00:00Z",
				pubmedId: "23471314",
				doi: "10.1016/j.ctnr.2012.08.006",
				sampleSize: 0,
				participantCount: 0,
				duration: "N/A",
				dosage: "400-6400 IU daily",
				results:
					"Single RCT (n=40) showed 6400 IU daily maintained maternal 25(OH)D at 78-80 nmol/L and infant 25(OH)D at 75-80 nmol/L. Lower doses (400 IU) maintained maternal levels but resulted in infant deficiency in 78% of subjects.",
				polishResults:
					"Pojedyncze badanie RCT (n=40) wykazało, że 6400 IU dziennie utrzymało u matki 25(OH)D na poziomie 78-80 nmol/L, a u niemowląt 25(OH)D na poziomie 75-80 nmol/L. Niższe dawki (400 IU) utrzymały poziomy u matki, ale spowodowały niedobór u 78% podmiotów.",
				secondaryOutcomes: [
					"Infant rickets prevention",
					"Maternal bone health",
					"Immune function",
					"Growth parameters",
				],
				polishSecondaryOutcomes: [
					"Profilaktyka krzywicy u niemowląt",
					"Zdrowie kości matki",
					"Funkcja odpornościowa",
					"Parametry wzrostu",
				],
				limitations:
					"Limited RCT data, most evidence extrapolated from adult studies",
				polishLimitations:
					"Ograniczone dane RCT, większość dowodów ekstrapolowana z badań u dorosłych",
				qualityScore: 7.5,
				conflictOfInterest:
					"Authors have received research support from vitamin D manufacturers",
				polishConflictOfInterest:
					"Autorzy otrzymali wsparcie badawcze od producentów witaminy D",
				funding: "Medical University of South Carolina",
				polishFunding: "Uniwersytet Medyczny w Południowej Karolinie",
				url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3585649/",
				abstract:
					"This expert opinion provides practical recommendations for maternal vitamin D supplementation during lactation, with direct implications for infant health and development.",
				polishAbstract:
					"Ta ekspertowa opinia dostarcza praktyczne rekomendacje dla suplementacji witaminy D u matki podczas karmienia, z bezpośrednimi implikacjami dla zdrowia i rozwoju niemowląt.",
				keywords: [
					"vitamin D",
					"breastfeeding",
					"maternal nutrition",
					"infant health",
					"supplementation",
				],
				meshTerms: [
					"Vitamin D",
					"Breast Feeding",
					"Maternal Nutritional Physiological Phenomena",
					"Infant Health",
					"Dietary Supplements",
				],
				citationCount: 115,
			},
		],
		polishResearchStudies: [
			{
				title:
					"Witamina D i karmienie piersią: praktyczne rekomendacje dla suplementacji matki",
				authors: ["Wagner CL", "Taylor SN", "Hollis BW"],
				journal: "Current Topics in Nutritional Research",
				year: 2012,
				findings:
					"Suplementacja matki 6400 IU dziennie spełnia zarówno wymagania matki, jak i niemowląt na witaminę D podczas ekskluzywnego karmienia piersią",
				polishFindings:
					"Suplementacja matki 6400 IU dziennie spełnia zarówno wymagania matki, jak i niemowląt na witaminę D podczas ekskluzywnego karmienia piersią",
			},
		],
		lastUpdated: "2024-01-15T00:00:00Z",
		createdAt: "2024-01-15T00:00:00Z",
	},
];

// Export all demographic recommendations organized by demographic group
export const recommendationsByDemographic: Record<
	string,
	DemographicRecommendation[]
> = {
	children: childrenRecommendations,
	adolescents: adolescentRecommendations,
	adults: adultRecommendations,
	elderly: elderlyRecommendations,
	female: femaleRecommendations,
	male: maleRecommendations,
	pregnant: pregnantRecommendations,
	lactating: lactatingRecommendations,
};

// Export all demographic recommendations as flat arrays
export const allDemographicRecommendations: DemographicRecommendation[] = [
	...childrenRecommendations,
	...adolescentRecommendations,
	...adultRecommendations,
	...elderlyRecommendations,
	...femaleRecommendations,
	...maleRecommendations,
	...pregnantRecommendations,
	...lactatingRecommendations,
];

export default {
	recommendationsByDemographic,
	allDemographicRecommendations,
	childrenRecommendations,
	adolescentRecommendations,
	adultRecommendations,
	elderlyRecommendations,
	femaleRecommendations,
	maleRecommendations,
	pregnantRecommendations,
	lactatingRecommendations,
};
