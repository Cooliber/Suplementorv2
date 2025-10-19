import type { LearningPathway, SupplementCategory } from "@/types/education";

/**
 * Comprehensive Learning Pathways for Supplement Education
 * Structured educational journeys for different supplement categories and skill levels
 */
export const learningPathways: LearningPathway[] = [
	{
		id: "vitamins_minerals_foundation",
		title: "Vitamin and Mineral Foundation",
		polishTitle: "Podstawy witamin i minerałów",
		description:
			"Complete foundation course covering essential vitamins and minerals, their biochemistry, clinical applications, and evidence-based supplementation.",
		polishDescription:
			"Kompletny kurs podstawowy obejmujący niezbędne witaminy i minerały, ich biochemię, zastosowania kliniczne i suplementację opartą na dowodach.",
		category: "vitamins_minerals",
		difficulty: "beginner",
		estimatedDuration: 12, // hours
		modules: [
			"vitamins_minerals_biochemistry_fundamentals",
			"mineral_absorption_metabolism",
			"vitamin_deficiency_assessment",
			"mineral_supplementation_protocols",
			"vitamin_mineral_interactions",
			"clinical_case_studies_vitamins",
		],
		prerequisites: [],
		outcomes: [
			"Understand the biochemical roles of essential vitamins and minerals",
			"Identify signs and symptoms of vitamin and mineral deficiencies",
			"Apply evidence-based supplementation protocols",
			"Recognize nutrient interactions and synergies",
			"Interpret laboratory assessments for nutritional status",
		],
		polishOutcomes: [
			"Zrozumieć biochemiczną rolę niezbędnych witamin i minerałów",
			"Zidentyfikować objawy niedoborów witamin i minerałów",
			"Zastosować protokoły suplementacji oparte na dowodach",
			"Rozpoznać interakcje i synergie między składnikami odżywczymi",
			"Interpretować badania laboratoryjne statusu żywieniowego",
		],
		metadata: {
			version: "1.0.0",
			lastUpdated: "2024-09-27",
			author: "Suplementor Education Team",
			reviewers: ["Dr. Maria Kowalski", "Prof. Jan Nowak"],
			tags: ["vitamins", "minerals", "biochemistry", "clinical_nutrition"],
			difficulty: "beginner",
			evidenceLevel: "high",
			citations: [
				"Institute of Medicine. Dietary Reference Intakes. 2011",
				"World Health Organization. Vitamin and Mineral Requirements. 2004",
			],
		},
	},
	{
		id: "herbal_medicine_principles",
		title: "Herbal Medicine Principles and Practice",
		polishTitle: "Zasady i praktyka medycyny ziołowej",
		description:
			"Comprehensive introduction to herbal medicine, covering plant chemistry, traditional uses, evidence-based applications, and safety considerations.",
		polishDescription:
			"Kompleksowe wprowadzenie do medycyny ziołowej, obejmujące chemię roślin, tradycyjne zastosowania, aplikacje oparte na dowodach i kwestie bezpieczeństwa.",
		category: "herbal_medicine",
		difficulty: "intermediate",
		estimatedDuration: 18, // hours
		modules: [
			"plant_chemistry_phytochemistry",
			"traditional_healing_systems",
			"evidence_based_herbal_medicine",
			"herbal_safety_pharmacology",
			"herbal_formulations_preparations",
			"clinical_herbal_case_studies",
		],
		prerequisites: ["vitamins_minerals_foundation"],
		outcomes: [
			"Understand phytochemistry and active plant compounds",
			"Apply traditional herbal knowledge in modern context",
			"Evaluate herbal research and clinical evidence",
			"Formulate safe and effective herbal protocols",
			"Manage herb-drug interactions and contraindications",
		],
		polishOutcomes: [
			"Zrozumieć fitochemię i aktywne związki roślinne",
			"Zastosować tradycyjną wiedzę ziołową w kontekście nowoczesnym",
			"Ocenić badania ziołowe i dowody kliniczne",
			"Sformułować bezpieczne i skuteczne protokoły ziołowe",
			"Zarządzać interakcjami ziół z lekami i przeciwwskazaniami",
		],
		metadata: {
			version: "1.0.0",
			lastUpdated: "2024-09-27",
			author: "Suplementor Education Team",
			reviewers: ["Dr. Anna Zielinska", "Prof. Piotr Wisniewski"],
			tags: [
				"herbal_medicine",
				"phytochemistry",
				"traditional_medicine",
				"plant_chemistry",
			],
			difficulty: "intermediate",
			evidenceLevel: "high",
			citations: [
				"World Health Organization. WHO Monographs on Selected Medicinal Plants",
				"American Herbal Pharmacopoeia",
			],
		},
	},
	{
		id: "cognitive_enhancement_science",
		title: "The Science of Cognitive Enhancement",
		polishTitle: "Nauka o poprawie funkcji poznawczych",
		description:
			"Advanced exploration of nootropics, neurotransmitters, and evidence-based strategies for cognitive optimization and brain health.",
		polishDescription:
			"Zaawansowana eksploracja nootropów, neuroprzekaźników i strategii opartych na dowodach dla optymalizacji funkcji poznawczych i zdrowia mózgu.",
		category: "cognitive_enhancers",
		difficulty: "advanced",
		estimatedDuration: 24, // hours
		modules: [
			"neurotransmitter_systems_brain",
			"nootropic_mechanisms_action",
			"cognitive_assessment_methods",
			"evidence_based_nootropics",
			"brain_optimization_strategies",
			"cognitive_research_methodology",
		],
		prerequisites: [
			"vitamins_minerals_foundation",
			"herbal_medicine_principles",
		],
		outcomes: [
			"Master neurotransmitter systems and brain chemistry",
			"Understand mechanisms of nootropic compounds",
			"Design evidence-based cognitive enhancement protocols",
			"Interpret cognitive research and clinical trials",
			"Apply personalized brain optimization strategies",
		],
		polishOutcomes: [
			"Opanować systemy neuroprzekaźnikowe i chemię mózgu",
			"Zrozumieć mechanizmy działania związków nootropowych",
			"Zaprojektować protokoły poprawy funkcji poznawczych oparte na dowodach",
			"Interpretować badania poznawcze i badania kliniczne",
			"Zastosować spersonalizowane strategie optymalizacji mózgu",
		],
		metadata: {
			version: "1.0.0",
			lastUpdated: "2024-09-27",
			author: "Suplementor Education Team",
			reviewers: ["Dr. Tomasz Lewandowski", "Prof. Katarzyna Adamczyk"],
			tags: [
				"cognitive_enhancement",
				"nootropics",
				"neuroscience",
				"brain_health",
			],
			difficulty: "advanced",
			evidenceLevel: "high",
			citations: [
				"Society for Neuroscience. Brain Facts",
				"Journal of Cognitive Enhancement",
			],
		},
	},
	{
		id: "sports_nutrition_optimization",
		title: "Sports Nutrition and Performance Optimization",
		polishTitle: "Optymalizacja żywienia i wydajności sportowej",
		description:
			"Comprehensive sports nutrition pathway covering ergogenic aids, recovery strategies, and evidence-based performance enhancement.",
		polishDescription:
			"Kompleksowa ścieżka żywienia sportowego obejmująca środki ergogenne, strategie regeneracji i poprawę wydajności opartą na dowodach.",
		category: "sports_nutrition",
		difficulty: "intermediate",
		estimatedDuration: 16, // hours
		modules: [
			"exercise_physiology_basics",
			"ergogenic_aids_supplements",
			"recovery_regeneration_strategies",
			"performance_nutrition_timing",
			"supplementation_periodization",
			"athletic_performance_assessment",
		],
		prerequisites: ["vitamins_minerals_foundation"],
		outcomes: [
			"Understand exercise physiology and energy systems",
			"Apply evidence-based ergogenic aids and supplements",
			"Optimize recovery and regeneration protocols",
			"Implement strategic nutrient timing for performance",
			"Design periodized supplementation programs",
		],
		polishOutcomes: [
			"Zrozumieć fizjologię wysiłku i systemy energetyczne",
			"Zastosować środki ergogenne i suplementy oparte na dowodach",
			"Optymalizować protokoły regeneracji i odnowy",
			"Wdrożyć strategiczne timing składników odżywczych dla wydajności",
			"Zaprojektować okresowe programy suplementacji",
		],
		metadata: {
			version: "1.0.0",
			lastUpdated: "2024-09-27",
			author: "Suplementor Education Team",
			reviewers: ["Dr. Michal Wojcik", "Prof. Agnieszka Kowalczyk"],
			tags: [
				"sports_nutrition",
				"ergogenic_aids",
				"athletic_performance",
				"recovery",
			],
			difficulty: "intermediate",
			evidenceLevel: "high",
			citations: [
				"International Society of Sports Nutrition Position Stands",
				"Journal of the International Society of Sports Nutrition",
			],
		},
	},
	{
		id: "gut_health_microbiome",
		title: "Gut Health and the Microbiome",
		polishTitle: "Zdrowie jelit i mikrobiom",
		description:
			"In-depth exploration of gut health, microbiome science, probiotics, prebiotics, and their impact on overall health and disease.",
		polishDescription:
			"Dogłębna eksploracja zdrowia jelit, nauki o mikrobiomie, probiotyków, prebiotyków i ich wpływu na ogólne zdrowie i choroby.",
		category: "gut_health",
		difficulty: "intermediate",
		estimatedDuration: 14, // hours
		modules: [
			"microbiome_ecosystem_understanding",
			"probiotics_prebiotics_science",
			"gut_brain_axis_research",
			"digestive_health_protocols",
			"microbiome_testing_interpretation",
			"gut_health_clinical_applications",
		],
		prerequisites: ["vitamins_minerals_foundation"],
		outcomes: [
			"Understand the gut microbiome ecosystem and diversity",
			"Apply evidence-based probiotic and prebiotic interventions",
			"Recognize gut-brain axis mechanisms and applications",
			"Design comprehensive digestive health protocols",
			"Interpret microbiome testing and personalized recommendations",
		],
		polishOutcomes: [
			"Zrozumieć ekosystem mikrobiomu jelitowego i jego różnorodność",
			"Zastosować interwencje probiotyczne i prebiotyczne oparte na dowodach",
			"Rozpoznać mechanizmy osi jelitowo-mózgowej i ich zastosowania",
			"Zaprojektować kompleksowe protokoły zdrowia trawiennego",
			"Interpretować testy mikrobiomu i spersonalizowane zalecenia",
		],
		metadata: {
			version: "1.0.0",
			lastUpdated: "2024-09-27",
			author: "Suplementor Education Team",
			reviewers: ["Dr. Barbara Nowak", "Prof. Krzysztof Zielinski"],
			tags: ["gut_health", "microbiome", "probiotics", "digestive_health"],
			difficulty: "intermediate",
			evidenceLevel: "high",
			citations: [
				"Nature Reviews Gastroenterology & Hepatology - Microbiome",
				"Gut Microbiota for Health Expert Consensus",
			],
		},
	},
	{
		id: "evidence_based_supplementation",
		title: "Evidence-Based Supplementation Mastery",
		polishTitle: "Mistrzostwo w suplementacji opartej na dowodach",
		description:
			"Advanced pathway for mastering research evaluation, clinical decision making, and personalized supplementation protocols.",
		polishDescription:
			"Zaawansowana ścieżka do opanowania oceny badań, podejmowania decyzji klinicznych i spersonalizowanych protokołów suplementacji.",
		category: "vitamins_minerals", // General category for research methodology
		difficulty: "expert",
		estimatedDuration: 20, // hours
		modules: [
			"research_methodology_critical_appraisal",
			"clinical_trial_design_interpretation",
			"meta_analysis_systematic_reviews",
			"personalized_supplementation_protocols",
			"supplement_safety_risk_assessment",
			"evidence_based_practice_integration",
		],
		prerequisites: [
			"vitamins_minerals_foundation",
			"herbal_medicine_principles",
			"cognitive_enhancement_science",
		],
		outcomes: [
			"Critically evaluate scientific research and clinical trials",
			"Design and interpret meta-analyses and systematic reviews",
			"Develop personalized supplementation protocols",
			"Conduct comprehensive safety and risk assessments",
			"Integrate evidence-based practice into clinical decision making",
		],
		polishOutcomes: [
			"Krytycznie oceniać badania naukowe i badania kliniczne",
			"Projektować i interpretować metaanalizy i przeglądy systematyczne",
			"Opracowywać spersonalizowane protokoły suplementacji",
			"Przeprowadzać kompleksowe oceny bezpieczeństwa i ryzyka",
			"Integrować praktykę opartą na dowodach z podejmowaniem decyzji klinicznych",
		],
		metadata: {
			version: "1.0.0",
			lastUpdated: "2024-09-27",
			author: "Suplementor Education Team",
			reviewers: ["Prof. Ewa Dudzinska", "Dr. Rafal Szymanski"],
			tags: [
				"evidence_based_medicine",
				"research_methodology",
				"clinical_trials",
				"meta_analysis",
			],
			difficulty: "expert",
			evidenceLevel: "high",
			citations: [
				"Cochrane Handbook for Systematic Reviews",
				"CONSORT Statement for Clinical Trials",
				"PRISMA Statement for Meta-Analyses",
			],
		},
	},
];

/**
 * Get pathways by category
 */
export const getPathwaysByCategory = (
	category: SupplementCategory,
): LearningPathway[] => {
	return learningPathways.filter((pathway) => pathway.category === category);
};

/**
 * Get pathways by difficulty level
 */
export const getPathwaysByDifficulty = (
	difficulty: "beginner" | "intermediate" | "advanced" | "expert",
): LearningPathway[] => {
	return learningPathways.filter(
		(pathway) => pathway.difficulty === difficulty,
	);
};

/**
 * Get recommended next pathways based on completed pathways
 */
export const getRecommendedNextPathways = (
	completedPathwayIds: string[],
): LearningPathway[] => {
	const completedPathways = learningPathways.filter((p) =>
		completedPathwayIds.includes(p.id),
	);

	// Simple recommendation logic - could be enhanced with more sophisticated algorithms
	const recommendations: LearningPathway[] = [];

	// If completed foundation, recommend intermediate pathways
	if (completedPathways.some((p) => p.difficulty === "beginner")) {
		recommendations.push(...getPathwaysByDifficulty("intermediate"));
	}

	// If completed intermediate, recommend advanced pathways
	if (completedPathways.some((p) => p.difficulty === "intermediate")) {
		recommendations.push(...getPathwaysByDifficulty("advanced"));
	}

	// If completed advanced, recommend expert pathways
	if (completedPathways.some((p) => p.difficulty === "advanced")) {
		recommendations.push(...getPathwaysByDifficulty("expert"));
	}

	// Remove already completed pathways
	return recommendations.filter((p) => !completedPathwayIds.includes(p.id));
};

/**
 * Get pathway prerequisites chain
 */
export const getPathwayPrerequisites = (pathwayId: string): string[] => {
	const pathway = learningPathways.find((p) => p.id === pathwayId);
	if (!pathway || !pathway.prerequisites) return [];

	const prerequisites: string[] = [...pathway.prerequisites];

	// Recursively get prerequisites of prerequisites
	pathway.prerequisites.forEach((prereqId) => {
		prerequisites.push(...getPathwayPrerequisites(prereqId));
	});

	return [...new Set(prerequisites)]; // Remove duplicates
};

/**
 * Check if user can access pathway based on completed prerequisites
 */
export const canAccessPathway = (
	pathwayId: string,
	completedPathwayIds: string[],
): boolean => {
	const prerequisites = getPathwayPrerequisites(pathwayId);
	return prerequisites.every((prereq) => completedPathwayIds.includes(prereq));
};
