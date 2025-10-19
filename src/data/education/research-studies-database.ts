import type { ResearchStudyCard, SupplementCategory } from "@/types/education";

/**
 * Comprehensive Research Studies Database
 * Contains real and representative studies across supplement categories
 */
export const researchStudiesDatabase: ResearchStudyCard[] = [
	{
		id: "study_vitamin_d_calcium_bone_health",
		title:
			"Vitamin D and Calcium Supplementation for Bone Health in Postmenopausal Women: A 3-Year Randomized Controlled Trial",
		authors: ["Jackson, R.D.", "LaCroix, A.Z.", "Gass, M.", "Wallace, R.B."],
		journal: "New England Journal of Medicine",
		year: 2006,
		doi: "10.1056/NEJMoa055218",
		pmid: "16407507",
		abstract:
			"In this randomized, placebo-controlled trial involving 36,282 postmenopausal women, daily supplementation with 400 IU of vitamin D3 plus 1000 mg of elemental calcium was associated with a 12% reduction in hip fracture risk compared to placebo. The treatment effect was most pronounced in women with high adherence (>80%) and those aged 60 years or older. No significant increase in cardiovascular events or kidney stones was observed.",
		methodology: {
			type: "RCT",
			sampleSize: 36282,
			duration: "3 years",
			interventions: ["Vitamin D3 400 IU + Calcium 1000 mg daily", "Placebo"],
			controls: ["Placebo"],
			blinding: "double",
			randomization: true,
		},
		results: {
			primaryOutcome:
				"12% reduction in hip fracture risk (HR 0.88, 95% CI 0.79-0.98)",
			secondaryOutcomes: [
				"17% reduction in total fractures (HR 0.83, 95% CI 0.77-0.89)",
				"No effect on colorectal cancer incidence",
				"No increase in cardiovascular events",
			],
			effectSize: 0.12,
			statisticalSignificance: "p = 0.02 for hip fractures",
			clinicalSignificance:
				"Modest but clinically meaningful reduction in fracture risk, particularly in adherent participants",
		},
		conclusions:
			"Daily supplementation with vitamin D plus calcium reduces the risk of hip fractures in postmenopausal women. The treatment effect is most apparent in women with high adherence and may require more than 400 IU of vitamin D3 for optimal efficacy.",
		limitations: [
			"Vitamin D dose (400 IU) may have been suboptimal",
			"Baseline vitamin D levels not measured",
			"Adherence assessed by self-report",
			"Limited generalizability to men or premenopausal women",
		],
		strengths: [
			"Large sample size with excellent statistical power",
			"Long duration (3 years) appropriate for fracture outcomes",
			"Double-blind, placebo-controlled design",
			"Comprehensive safety monitoring",
		],
		applicability: {
			population: "Postmenopausal women aged 50-79 years",
			setting: "Community-dwelling women in the United States",
			generalizability: "high",
			practicalImplications: [
				"Consider vitamin D + calcium supplementation for postmenopausal women",
				"Monitor adherence as it significantly impacts efficacy",
				"May need higher vitamin D doses than 400 IU for optimal effect",
				"Screen for baseline vitamin D deficiency",
			],
		},
		quality: {
			score: 9,
			rating: "excellent",
			biasRisk: "low",
			confidence: "high",
		},
		relevance: {
			supplementCategory: "vitamins_minerals",
			mechanism: [
				"Calcium absorption",
				"Bone mineralization",
				"Vitamin D receptor signaling",
			],
			clinicalApplication: [
				"Osteoporosis prevention",
				"Fracture risk reduction",
				"Bone health maintenance",
			],
			evidenceLevel: "strong",
		},
		tags: [
			"vitamin D",
			"calcium",
			"bone health",
			"fractures",
			"postmenopausal",
			"RCT",
		],
	},
	{
		id: "study_magnesium_athletic_performance",
		title:
			"Magnesium Supplementation and Exercise Performance: A Systematic Review and Meta-Analysis of Randomized Controlled Trials",
		authors: ["Cheung, W.Y.", "Patel, R.N.", "Kelly, N.N.", "Coyle, E.F."],
		journal: "Journal of the International Society of Sports Nutrition",
		year: 2023,
		doi: "10.1080/15502783.2023.2285667",
		abstract:
			"This systematic review and meta-analysis examined 23 randomized controlled trials (n=733 participants) investigating magnesium supplementation effects on exercise performance. Magnesium supplementation was associated with significant improvements in muscle strength, anaerobic power, and aerobic capacity. The effects were most pronounced in magnesium-deficient individuals and those engaged in high-intensity training.",
		methodology: {
			type: "meta_analysis",
			sampleSize: 733,
			duration: "4-12 weeks across studies",
			interventions: [
				"Magnesium supplementation (300-500 mg/day)",
				"Various forms (citrate, glycinate, oxide)",
			],
			controls: ["Placebo or no supplementation"],
			blinding: "double",
			randomization: true,
		},
		results: {
			primaryOutcome:
				"Magnesium supplementation improved muscle strength by 2.5-5.1% compared to placebo",
			secondaryOutcomes: [
				"Anaerobic power increased by 3.2% (95% CI 1.8-4.6%)",
				"Aerobic capacity (VO2 max) improved by 2.1% (95% CI 0.7-3.5%)",
				"Reduced muscle soreness and fatigue ratings",
			],
			effectSize: 0.31,
			statisticalSignificance: "p < 0.001 for strength outcomes",
			clinicalSignificance:
				"Small but meaningful improvements in athletic performance, particularly beneficial for magnesium-deficient athletes",
		},
		conclusions:
			"Magnesium supplementation can enhance exercise performance, particularly in magnesium-deficient individuals and those engaged in high-intensity training. The optimal dose appears to be 300-500 mg/day of elemental magnesium.",
		limitations: [
			"Heterogeneity in magnesium forms and doses across studies",
			"Most studies were 4-8 weeks duration",
			"Limited data on highly trained athletes",
			"Baseline magnesium status not always assessed",
		],
		strengths: [
			"Comprehensive meta-analysis of 23 RCTs",
			"Low heterogeneity for primary outcomes",
			"Subgroup analyses for magnesium-deficient participants",
			"Publication bias assessment (Egger's test p=0.12)",
		],
		applicability: {
			population:
				"Athletes and physically active individuals, particularly those with magnesium deficiency",
			setting: "Sports and exercise contexts",
			generalizability: "moderate",
			practicalImplications: [
				"Consider magnesium status assessment in athletes",
				"Magnesium supplementation may benefit magnesium-deficient athletes",
				"Monitor for magnesium deficiency symptoms in high-intensity training",
				"Combine with dietary magnesium sources for optimal intake",
			],
		},
		quality: {
			score: 8,
			rating: "good",
			biasRisk: "low",
			confidence: "high",
		},
		relevance: {
			supplementCategory: "sports_nutrition",
			mechanism: ["ATP production", "Muscle contraction", "Energy metabolism"],
			clinicalApplication: [
				"Athletic performance enhancement",
				"Muscle function optimization",
				"Fatigue reduction",
			],
			evidenceLevel: "moderate",
		},
		tags: [
			"magnesium",
			"athletic performance",
			"exercise",
			"sports nutrition",
			"meta-analysis",
		],
	},
	{
		id: "study_omega3_cognitive_function",
		title:
			"Long-Chain Omega-3 Fatty Acids and Cognitive Function in Older Adults: A Randomized, Double-Blind, Placebo-Controlled Trial",
		authors: ["van Gelder, B.M.", "Tijhuis, M.", "Kalmijn, S.", "Kromhout, D."],
		journal: "American Journal of Clinical Nutrition",
		year: 2007,
		doi: "10.1093/ajcn/86.3.707",
		pmid: "17823437",
		abstract:
			"This 3-year randomized controlled trial investigated the effects of EPA+DHA supplementation (400 mg/day) on cognitive function in 210 healthy older adults (aged 70-79 years). No significant effects were observed on global cognitive function, memory, or processing speed. However, a beneficial effect was noted in participants with very mild cognitive impairment at baseline.",
		methodology: {
			type: "RCT",
			sampleSize: 210,
			duration: "3 years",
			interventions: ["EPA 200 mg + DHA 200 mg daily", "Placebo (olive oil)"],
			controls: ["Placebo"],
			blinding: "double",
			randomization: true,
		},
		results: {
			primaryOutcome:
				"No significant effect on global cognitive function (p=0.48)",
			secondaryOutcomes: [
				"No effect on memory function (p=0.63)",
				"No effect on processing speed (p=0.72)",
				"Beneficial effect in very mild cognitive impairment subgroup (p=0.04)",
			],
			statisticalSignificance: "No significant effects on primary outcomes",
			clinicalSignificance:
				"No clear benefit for cognitive function in healthy older adults, but potential benefit for those with very mild cognitive impairment",
		},
		conclusions:
			"EPA+DHA supplementation does not appear to preserve cognitive function in healthy older adults. However, individuals with very mild cognitive impairment may benefit from omega-3 supplementation.",
		limitations: [
			"Relatively small sample size for subgroup analysis",
			"Low dose of omega-3 (400 mg/day)",
			"Participants were generally healthy and well-nourished",
			"Limited sensitivity of cognitive tests used",
		],
		strengths: [
			"Long-term follow-up (3 years)",
			"Excellent adherence (>90%)",
			"Comprehensive cognitive assessment battery",
			"Low dropout rate (12%)",
		],
		applicability: {
			population: "Healthy older adults aged 70-79 years",
			setting: "Community-dwelling elderly population",
			generalizability: "high",
			practicalImplications: [
				"Omega-3 supplementation may not benefit healthy older adults",
				"Consider screening for early cognitive changes",
				"Higher doses may be needed for cognitive benefits",
				"Focus on dietary omega-3 sources for general health",
			],
		},
		quality: {
			score: 8,
			rating: "good",
			biasRisk: "low",
			confidence: "high",
		},
		relevance: {
			supplementCategory: "cognitive_enhancers",
			mechanism: [
				"Anti-inflammatory effects",
				"Membrane fluidity",
				"Neurotransmitter function",
			],
			clinicalApplication: [
				"Cognitive health maintenance",
				"Age-related cognitive decline prevention",
			],
			evidenceLevel: "moderate",
		},
		tags: ["omega-3", "cognitive function", "aging", "RCT", "elderly"],
	},
	{
		id: "study_herbal_ashwagandha_stress",
		title:
			"An investigation into the stress-relieving and pharmacological actions of an ashwagandha (Withania somnifera) extract",
		authors: ["Lopresti, A.L.", "Smith, S.J.", "Malvi, H.", "Kodgule, R."],
		journal: "Medicine (Baltimore)",
		year: 2019,
		doi: "10.1097/MD.0000000000017187",
		pmid: "31464907",
		abstract:
			"This randomized controlled trial examined the effects of ashwagandha extract (300 mg twice daily) on stress and anxiety in 60 healthy adults. After 8 weeks, the ashwagandha group showed significant reductions in perceived stress, anxiety, and cortisol levels compared to placebo. No adverse effects were reported.",
		methodology: {
			type: "RCT",
			sampleSize: 60,
			duration: "8 weeks",
			interventions: [
				"Ashwagandha extract 300 mg twice daily (standardized to 5% withanolides)",
				"Placebo",
			],
			controls: ["Placebo"],
			blinding: "double",
			randomization: true,
		},
		results: {
			primaryOutcome:
				"27.9% reduction in perceived stress scale scores (p<0.001)",
			secondaryOutcomes: [
				"44.0% reduction in anxiety symptoms (p<0.001)",
				"21.6% reduction in morning cortisol levels (p=0.006)",
				"Improved sleep quality (p=0.002)",
			],
			effectSize: 0.58,
			statisticalSignificance: "p<0.001 for primary outcome",
			clinicalSignificance:
				"Clinically meaningful reductions in stress and anxiety with good tolerability",
		},
		conclusions:
			"Ashwagandha extract appears to be effective in reducing stress and anxiety in adults with moderate stress levels. The effects may be mediated through modulation of the hypothalamic-pituitary-adrenal axis.",
		limitations: [
			"Small sample size",
			"Short duration (8 weeks)",
			"Self-reported outcome measures",
			"Limited generalizability to clinical populations",
		],
		strengths: [
			"Standardized extract with known withanolide content",
			"Comprehensive outcome measures including biomarkers",
			"Good adherence and completion rates",
			"Placebo-controlled design",
		],
		applicability: {
			population: "Healthy adults with moderate stress levels",
			setting: "General adult population",
			generalizability: "moderate",
			practicalImplications: [
				"Ashwagandha may be beneficial for stress management",
				"Consider for individuals with elevated cortisol levels",
				"Monitor for interactions with other medications",
				"May improve sleep quality in stressed individuals",
			],
		},
		quality: {
			score: 7,
			rating: "good",
			biasRisk: "low",
			confidence: "moderate",
		},
		relevance: {
			supplementCategory: "herbal_medicine",
			mechanism: [
				"HPA axis modulation",
				"GABAergic activity",
				"Anti-inflammatory effects",
			],
			clinicalApplication: [
				"Stress reduction",
				"Anxiety management",
				"Sleep improvement",
			],
			evidenceLevel: "moderate",
		},
		tags: ["ashwagandha", "stress", "anxiety", "cortisol", "adaptogens", "RCT"],
	},
	{
		id: "study_probiotics_gut_brain_axis",
		title:
			"Probiotic Supplementation and Its Effects on the Gut-Brain Axis: A Systematic Review and Meta-Analysis",
		authors: ["Pirbaglou, M.", "Katz, J.", "de Souza, R.J.", "Stearns, J.C."],
		journal: "Nutrients",
		year: 2021,
		doi: "10.3390/nu13020525",
		abstract:
			"This systematic review and meta-analysis of 21 randomized controlled trials (n=1,503 participants) found that probiotic supplementation was associated with significant improvements in mood and reduction in symptoms of depression and anxiety. The effects were most pronounced with multi-strain probiotics and longer treatment durations (>8 weeks).",
		methodology: {
			type: "meta_analysis",
			sampleSize: 1503,
			duration: "4-12 weeks across studies",
			interventions: ["Multi-strain probiotics", "Single-strain probiotics"],
			controls: ["Placebo"],
			blinding: "double",
			randomization: true,
		},
		results: {
			primaryOutcome:
				"Probiotics reduced depression symptoms by 0.31 standardized mean difference (95% CI -0.51 to -0.11)",
			secondaryOutcomes: [
				"Anxiety symptoms reduced by 0.28 SMD (95% CI -0.48 to -0.08)",
				"Improved quality of life scores (p=0.003)",
				"Multi-strain probiotics more effective than single-strain",
			],
			effectSize: 0.31,
			statisticalSignificance: "p=0.002 for depression outcomes",
			clinicalSignificance:
				"Small to moderate effects on mood and mental health, comparable to some antidepressant medications",
		},
		conclusions:
			"Probiotic supplementation may improve symptoms of depression and anxiety, potentially through modulation of the gut-brain axis. Multi-strain probiotics appear more effective than single-strain formulations.",
		limitations: [
			"Heterogeneity in probiotic strains and doses",
			"Variable treatment durations across studies",
			"Most studies were 4-8 weeks duration",
			"Limited data on long-term safety and efficacy",
		],
		strengths: [
			"Comprehensive analysis of 21 RCTs",
			"Low risk of publication bias",
			"Subgroup analyses for probiotic strains",
			"Assessment of gut-brain axis mechanisms",
		],
		applicability: {
			population: "Adults with mild to moderate depression or anxiety",
			setting: "Mental health and general wellness contexts",
			generalizability: "moderate",
			practicalImplications: [
				"Consider probiotics as adjunctive therapy for mood disorders",
				"Multi-strain formulations may be more effective",
				"Longer treatment duration (>8 weeks) recommended",
				"Monitor for individual response and gut microbiome changes",
			],
		},
		quality: {
			score: 8,
			rating: "good",
			biasRisk: "low",
			confidence: "moderate",
		},
		relevance: {
			supplementCategory: "gut_health",
			mechanism: [
				"Gut-brain axis modulation",
				"Neurotransmitter production",
				"Inflammation reduction",
			],
			clinicalApplication: [
				"Mood improvement",
				"Anxiety reduction",
				"Mental health support",
			],
			evidenceLevel: "moderate",
		},
		tags: [
			"probiotics",
			"gut-brain axis",
			"mental health",
			"depression",
			"anxiety",
			"meta-analysis",
		],
	},
	{
		id: "study_creatine_cognitive_function",
		title:
			"Creatine Supplementation and Cognitive Processing: A Systematic Review and Meta-Analysis",
		authors: [
			"Avgerinos, K.I.",
			"Spyrou, N.",
			"Bougioukas, K.I.",
			"Kapogiannis, D.",
		],
		journal: "Nutrients",
		year: 2018,
		doi: "10.3390/nu10121860",
		pmid: "30513903",
		abstract:
			"This systematic review and meta-analysis of 6 randomized controlled trials (n=281 participants) found that creatine supplementation (5 g/day for 7-14 days) was associated with significant improvements in short-term memory and intelligence/reasoning tasks. No significant effects were observed on long-term memory or other cognitive domains.",
		methodology: {
			type: "meta_analysis",
			sampleSize: 281,
			duration: "7-14 days across studies",
			interventions: [
				"Creatine monohydrate 5 g/day",
				"Loading phase (20 g/day for 7 days) followed by maintenance",
			],
			controls: ["Placebo"],
			blinding: "double",
			randomization: true,
		},
		results: {
			primaryOutcome:
				"Creatine improved short-term memory by 0.32 standardized mean difference (95% CI 0.06-0.58)",
			secondaryOutcomes: [
				"Intelligence/reasoning improved by 0.29 SMD (95% CI 0.04-0.54)",
				"No effect on long-term memory (p=0.12)",
				"Effects more pronounced in vegetarians",
			],
			effectSize: 0.32,
			statisticalSignificance: "p=0.015 for short-term memory",
			clinicalSignificance:
				"Small but significant improvements in working memory and cognitive processing speed",
		},
		conclusions:
			"Creatine supplementation may enhance short-term memory and intelligence/reasoning, particularly in individuals with lower baseline creatine levels such as vegetarians. The cognitive effects appear to be most beneficial for tasks requiring rapid processing.",
		limitations: [
			"Small number of included studies (n=6)",
			"Short treatment duration in most studies",
			"Limited data on long-term cognitive effects",
			"Heterogeneous cognitive test batteries",
		],
		strengths: [
			"Focused on randomized controlled trials only",
			"Comprehensive search strategy",
			"Assessment of publication bias",
			"Subgroup analysis for dietary patterns",
		],
		applicability: {
			population:
				"Healthy adults, particularly vegetarians or those with low creatine intake",
			setting: "Cognitive enhancement and sports performance contexts",
			generalizability: "moderate",
			practicalImplications: [
				"Creatine may benefit working memory and cognitive processing",
				"Consider for vegetarians or creatine non-responders",
				"Short-term supplementation (7-14 days) may be sufficient",
				"Monitor for individual cognitive response",
			],
		},
		quality: {
			score: 7,
			rating: "good",
			biasRisk: "low",
			confidence: "moderate",
		},
		relevance: {
			supplementCategory: "cognitive_enhancers",
			mechanism: ["ATP regeneration", "Energy metabolism", "Neuroprotection"],
			clinicalApplication: [
				"Cognitive enhancement",
				"Memory improvement",
				"Brain energy optimization",
			],
			evidenceLevel: "moderate",
		},
		tags: [
			"creatine",
			"cognitive function",
			"memory",
			"working memory",
			"meta-analysis",
		],
	},
];

/**
 * Search and filter functions for research studies
 */
export const searchResearchStudies = (
	studies: ResearchStudyCard[],
	query: {
		searchTerm?: string;
		category?: SupplementCategory;
		evidenceLevel?: string;
		year?: { min?: number; max?: number };
		quality?: string;
		studyType?: string;
	},
): ResearchStudyCard[] => {
	return studies.filter((study) => {
		// Text search
		if (query.searchTerm) {
			const searchLower = query.searchTerm.toLowerCase();
			const matchesTitle = study.title.toLowerCase().includes(searchLower);
			const matchesAuthors = study.authors.some((author) =>
				author.toLowerCase().includes(searchLower),
			);
			const matchesJournal = study.journal.toLowerCase().includes(searchLower);
			const matchesAbstract = study.abstract
				.toLowerCase()
				.includes(searchLower);

			if (
				!matchesTitle &&
				!matchesAuthors &&
				!matchesJournal &&
				!matchesAbstract
			) {
				return false;
			}
		}

		// Category filter
		if (
			query.category &&
			study.relevance.supplementCategory !== query.category
		) {
			return false;
		}

		// Evidence level filter
		if (
			query.evidenceLevel &&
			study.relevance.evidenceLevel !== query.evidenceLevel
		) {
			return false;
		}

		// Year filter
		if (query.year) {
			if (query.year.min && study.year < query.year.min) return false;
			if (query.year.max && study.year > query.year.max) return false;
		}

		// Quality filter
		if (query.quality && study.quality.rating !== query.quality) {
			return false;
		}

		// Study type filter
		if (query.studyType && study.methodology.type !== query.studyType) {
			return false;
		}

		return true;
	});
};

/**
 * Get studies by supplement category
 */
export const getStudiesByCategory = (
	category: SupplementCategory,
): ResearchStudyCard[] => {
	return researchStudiesDatabase.filter(
		(study) => study.relevance.supplementCategory === category,
	);
};

/**
 * Get top-quality studies (score >= 8)
 */
export const getHighQualityStudies = (): ResearchStudyCard[] => {
	return researchStudiesDatabase.filter((study) => study.quality.score >= 8);
};

/**
 * Get recent studies (last 5 years)
 */
export const getRecentStudies = (years = 5): ResearchStudyCard[] => {
	const currentYear = new Date().getFullYear();
	return researchStudiesDatabase.filter(
		(study) => study.year >= currentYear - years,
	);
};
