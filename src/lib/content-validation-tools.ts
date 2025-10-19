"use client";

/**
 * Content Validation Tools for Medical Terminology and Reading Level Assessment
 * Provides comprehensive analysis of medical content complexity and appropriateness
 */

import {
	type BodySystem,
	Organ,
	type RelatedSupplement,
} from "@/data/body-systems";

export interface ContentAnalysisResult {
	id: string;
	contentId: string;
	contentType: "SYSTEM" | "ORGAN" | "SUPPLEMENT" | "DESCRIPTION";
	readingLevel: ReadingLevelAnalysis;
	medicalTerminology: MedicalTerminologyAnalysis;
	culturalSensitivity: CulturalSensitivityAnalysis;
	ageAppropriateness: AgeAppropriatenessAnalysis;
	evidenceQuality: EvidenceQualityAnalysis;
	recommendations: ContentRecommendation[];
	polishRecommendations: ContentRecommendation[];
	overallScore: number; // 0-100
	validationDate: Date;
}

export interface ReadingLevelAnalysis {
	fleschKincaidGrade: number;
	polishFleschKincaid: number;
	wordCount: number;
	sentenceCount: number;
	syllableCount: number;
	complexity:
		| "VERY_EASY"
		| "EASY"
		| "MODERATE"
		| "DIFFICULT"
		| "VERY_DIFFICULT";
	targetAudience: string[];
	polishTargetAudience: string[];
}

export interface MedicalTerminologyAnalysis {
	totalTerms: number;
	basicTerms: number;
	intermediateTerms: number;
	advancedTerms: number;
	expertTerms: number;
	termFrequency: Map<string, number>;
	complexityScore: number; // 0-100
	needsDefinition: string[];
	polishNeedsDefinition: string[];
}

export interface CulturalSensitivityAnalysis {
	sensitivityLevel: "LOW" | "MEDIUM" | "HIGH";
	polishContent: boolean;
	culturalReferences: string[];
	potentialIssues: string[];
	polishPotentialIssues: string[];
}

export interface AgeAppropriatenessAnalysis {
	minimumAge: number;
	maximumAge?: number;
	appropriateFor: string[];
	polishAppropriateFor: string[];
	concerns: string[];
	polishConcerns: string[];
}

export interface EvidenceQualityAnalysis {
	overallLevel: "STRONG" | "MODERATE" | "WEAK" | "INSUFFICIENT";
	sources: EvidenceSource[];
	lastUpdated: Date;
	needsReview: boolean;
	reviewReasons: string[];
	polishReviewReasons: string[];
}

export interface EvidenceSource {
	type:
		| "STUDY"
		| "REVIEW"
		| "META_ANALYSIS"
		| "CLINICAL_GUIDELINE"
		| "EXPERT_OPINION";
	title: string;
	authors: string[];
	publication: string;
	year: number;
	doi?: string;
	quality: "HIGH" | "MEDIUM" | "LOW";
}

export interface ContentRecommendation {
	type:
		| "SIMPLIFY"
		| "DEFINE"
		| "ADD_EXAMPLE"
		| "REVIEW_EVIDENCE"
		| "CULTURAL_REVIEW"
		| "AGE_ADJUST";
	priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
	description: string;
	polishDescription: string;
	estimatedEffort: number; // minutes
	autoFixable: boolean;
}

export class ContentValidationTools {
	private medicalTerminologyDatabase: Map<string, MedicalTermInfo> = new Map();
	private polishMedicalTerms: Map<string, PolishMedicalTerm> = new Map();
	private evidenceDatabase: Map<string, EvidenceSource[]> = new Map();

	constructor() {
		this.initializeDatabases();
	}

	private async initializeDatabases(): Promise<void> {
		// Initialize medical terminology database
		await this.loadMedicalTerminology();
		await this.loadPolishMedicalTerms();
		await this.loadEvidenceDatabase();
	}

	private async loadMedicalTerminology(): Promise<void> {
		// Load comprehensive medical terminology database
		const medicalTerms: MedicalTermInfo[] = [
			{
				term: "endocannabinoid",
				category: "NEUROLOGY",
				complexity: "ADVANCED",
				definition:
					"Natural compounds that bind to cannabinoid receptors in the body",
				synonyms: ["endogenous cannabinoid", "natural cannabinoid"],
				relatedTerms: [
					"cannabinoid receptor",
					"anandamide",
					"2-arachidonoylglycerol",
				],
			},
			{
				term: "homeostasis",
				category: "PHYSIOLOGY",
				complexity: "INTERMEDIATE",
				definition:
					"The tendency of an organism to maintain internal stability",
				synonyms: ["equilibrium", "balance"],
				relatedTerms: ["feedback loop", "physiological regulation"],
			},
			{
				term: "metabolism",
				category: "BIOCHEMISTRY",
				complexity: "BASIC",
				definition:
					"The chemical processes that occur within a living organism",
				synonyms: ["metabolic processes", "biochemical reactions"],
				relatedTerms: ["catabolism", "anabolism", "cellular respiration"],
			},
			{
				term: "inflammation",
				category: "PATHOLOGY",
				complexity: "INTERMEDIATE",
				definition: "The immune system's response to harmful stimuli",
				synonyms: ["inflammatory response", "immune reaction"],
				relatedTerms: ["cytokines", "immune cells", "acute inflammation"],
			},
		];

		medicalTerms.forEach((term) => {
			this.medicalTerminologyDatabase.set(term.term.toLowerCase(), term);
		});
	}

	private async loadPolishMedicalTerms(): Promise<void> {
		// Load Polish medical terminology
		const polishTerms: PolishMedicalTerm[] = [
			{
				polishTerm: "endokannabinoid",
				englishTerm: "endocannabinoid",
				definition:
					"Naturalne związki wiążące się z receptorami kannabinoidowymi w organizmie",
				complexity: "ADVANCED",
				alternatives: ["naturalny kannabinoid", "wewnętrzny kannabinoid"],
			},
			{
				polishTerm: "homeostaza",
				englishTerm: "homeostasis",
				definition: "Tendencja organizmu do utrzymania wewnętrznej stabilności",
				complexity: "INTERMEDIATE",
				alternatives: ["równowaga", "stabilność wewnętrzna"],
			},
			{
				polishTerm: "metabolizm",
				englishTerm: "metabolism",
				definition: "Procesy chemiczne zachodzące w żywym organizmie",
				complexity: "BASIC",
				alternatives: ["procesy metaboliczne", "reakcje biochemiczne"],
			},
			{
				polishTerm: "stan zapalny",
				englishTerm: "inflammation",
				definition: "Odpowiedź układu odpornościowego na szkodliwe bodźce",
				complexity: "INTERMEDIATE",
				alternatives: ["reakcja zapalna", "odpowiedź immunologiczna"],
			},
		];

		polishTerms.forEach((term) => {
			this.polishMedicalTerms.set(term.polishTerm.toLowerCase(), term);
		});
	}

	private async loadEvidenceDatabase(): Promise<void> {
		// Load evidence database for supplement claims
		const evidenceData: Array<[string, EvidenceSource[]]> = [
			[
				"cbd-oil",
				[
					{
						type: "META_ANALYSIS",
						title: "Cannabidiol for the treatment of anxiety disorders",
						authors: ["Skelley, J.W.", "Deas, C.M.", "Curren, Z."],
						publication: "Journal of the American Pharmacists Association",
						year: 2020,
						doi: "10.1016/j.japh.2019.11.025",
						quality: "HIGH",
					},
				],
			],
			[
				"omega-3",
				[
					{
						type: "META_ANALYSIS",
						title:
							"Omega-3 fatty acids for the primary and secondary prevention of cardiovascular disease",
						authors: ["Abdelhamid, A.S.", "Brown, T.J.", "Brainard, J.S."],
						publication: "Cochrane Database of Systematic Reviews",
						year: 2020,
						doi: "10.1002/14651858.CD003177.pub5",
						quality: "HIGH",
					},
				],
			],
		];

		evidenceData.forEach(([supplementId, sources]) => {
			this.evidenceDatabase.set(supplementId, sources);
		});
	}

	// Main content analysis method
	async analyzeBodySystemContent(
		bodySystem: BodySystem,
		targetAudience?: "STUDENT" | "PROFESSIONAL" | "GENERAL_PUBLIC",
	): Promise<ContentAnalysisResult> {
		const analysisId = `analysis_${bodySystem.id}_${Date.now()}`;

		// Analyze different content sections
		const systemAnalysis = await this.analyzeTextContent(
			`${bodySystem.description} ${bodySystem.functions.join(" ")}`,
			"SYSTEM",
			bodySystem.id,
			targetAudience,
		);

		const organAnalyses = await Promise.all(
			bodySystem.organs.map((organ) =>
				this.analyzeTextContent(
					`${organ.description} ${organ.functions.join(" ")}`,
					"ORGAN",
					organ.id,
					targetAudience,
				),
			),
		);

		const supplementAnalyses = await Promise.all(
			bodySystem.relatedSupplements.map((supplement) =>
				this.analyzeSupplementContent(supplement, targetAudience),
			),
		);

		// Combine all analyses
		const allAnalyses = [
			systemAnalysis,
			...organAnalyses,
			...supplementAnalyses,
		];

		const overallScore = this.calculateOverallScore(allAnalyses);
		const recommendations = this.generateRecommendations(allAnalyses);
		const polishRecommendations =
			this.generatePolishRecommendations(allAnalyses);

		return {
			id: analysisId,
			contentId: bodySystem.id,
			contentType: "SYSTEM",
			readingLevel: systemAnalysis.readingLevel,
			medicalTerminology: systemAnalysis.medicalTerminology,
			culturalSensitivity: systemAnalysis.culturalSensitivity,
			ageAppropriateness: systemAnalysis.ageAppropriateness,
			evidenceQuality: systemAnalysis.evidenceQuality,
			recommendations,
			polishRecommendations,
			overallScore,
			validationDate: new Date(),
		};
	}

	private async analyzeTextContent(
		text: string,
		contentType: "SYSTEM" | "ORGAN" | "SUPPLEMENT" | "DESCRIPTION",
		contentId: string,
		targetAudience?: "STUDENT" | "PROFESSIONAL" | "GENERAL_PUBLIC",
	): Promise<ContentAnalysisResult> {
		// Analyze reading level
		const readingLevel = this.analyzeReadingLevel(text);

		// Analyze medical terminology
		const medicalTerminology = this.analyzeMedicalTerminology(text);

		// Analyze cultural sensitivity
		const culturalSensitivity = this.analyzeCulturalSensitivity(text);

		// Analyze age appropriateness
		const ageAppropriateness = this.analyzeAgeAppropriateness(
			text,
			targetAudience,
		);

		// Analyze evidence quality (for supplements)
		const evidenceQuality =
			contentType === "SUPPLEMENT"
				? this.analyzeEvidenceQuality(contentId)
				: this.getDefaultEvidenceQuality();

		const recommendations = this.generateContentRecommendations({
			readingLevel,
			medicalTerminology,
			culturalSensitivity,
			ageAppropriateness,
			evidenceQuality,
		});

		const polishRecommendations = this.generatePolishContentRecommendations({
			readingLevel,
			medicalTerminology,
			culturalSensitivity,
			ageAppropriateness,
			evidenceQuality,
		});

		const overallScore = this.calculateContentScore({
			readingLevel,
			medicalTerminology,
			culturalSensitivity,
			ageAppropriateness,
			evidenceQuality,
		});

		return {
			id: `analysis_${contentId}_${Date.now()}`,
			contentId,
			contentType,
			readingLevel,
			medicalTerminology,
			culturalSensitivity,
			ageAppropriateness,
			evidenceQuality,
			recommendations,
			polishRecommendations,
			overallScore,
			validationDate: new Date(),
		};
	}

	private analyzeReadingLevel(text: string): ReadingLevelAnalysis {
		// Clean and prepare text
		const cleanText = text
			.replace(/[^\w\s]/g, " ")
			.replace(/\s+/g, " ")
			.trim();

		// Calculate basic metrics
		const words = cleanText.split(" ");
		const sentences = cleanText
			.split(/[.!?]+/)
			.filter((s) => s.trim().length > 0);
		const syllables = this.countSyllables(cleanText);

		const wordCount = words.length;
		const sentenceCount = sentences.length;

		// English Flesch-Kincaid Grade Level
		const fleschKincaidGrade =
			sentenceCount > 0 && wordCount > 0
				? 0.39 * (wordCount / sentenceCount) +
					11.8 * (syllables / wordCount) -
					15.59
				: 0;

		// Polish Flesch-Kincaid adaptation
		const polishFleschKincaid = this.calculatePolishFleschKincaid(
			wordCount,
			sentenceCount,
			syllables,
		);

		// Determine complexity
		const complexity = this.determineComplexity(fleschKincaidGrade);

		// Determine target audience
		const targetAudience = this.determineTargetAudience(
			fleschKincaidGrade,
			complexity,
		);
		const polishTargetAudience = this.determinePolishTargetAudience(
			fleschKincaidGrade,
			complexity,
		);

		return {
			fleschKincaidGrade: Math.max(0, Math.min(20, fleschKincaidGrade)),
			polishFleschKincaid: Math.max(0, Math.min(20, polishFleschKincaid)),
			wordCount,
			sentenceCount,
			syllableCount: syllables,
			complexity,
			targetAudience,
			polishTargetAudience,
		};
	}

	private countSyllables(text: string): number {
		const polishVowels = /[aeiouąęióuy]/i;
		let syllables = 0;
		let previousWasVowel = false;

		for (const char of text.toLowerCase()) {
			const isVowel = polishVowels.test(char);
			if (isVowel && !previousWasVowel) {
				syllables++;
			}
			previousWasVowel = isVowel;
		}

		return Math.max(1, syllables);
	}

	private calculatePolishFleschKincaid(
		wordCount: number,
		sentenceCount: number,
		syllableCount: number,
	): number {
		// Polish adaptation of Flesch-Kincaid formula
		if (wordCount === 0 || sentenceCount === 0) return 0;

		// Adjusted constants for Polish language
		const score =
			206.835 -
			1.015 * (wordCount / sentenceCount) -
			84.6 * (syllableCount / wordCount);
		return Math.max(0, Math.min(20, score));
	}

	private determineComplexity(
		gradeLevel: number,
	): "VERY_EASY" | "EASY" | "MODERATE" | "DIFFICULT" | "VERY_DIFFICULT" {
		if (gradeLevel <= 6) return "VERY_EASY";
		if (gradeLevel <= 8) return "EASY";
		if (gradeLevel <= 12) return "MODERATE";
		if (gradeLevel <= 16) return "DIFFICULT";
		return "VERY_DIFFICULT";
	}

	private determineTargetAudience(
		gradeLevel: number,
		complexity: string,
	): string[] {
		const audiences: string[] = [];

		if (complexity === "VERY_EASY" || complexity === "EASY") {
			audiences.push("General Public", "Students (Primary/Secondary)");
		}

		if (complexity === "MODERATE") {
			audiences.push("Students (University)", "Healthcare Professionals");
		}

		if (complexity === "DIFFICULT" || complexity === "VERY_DIFFICULT") {
			audiences.push("Medical Specialists", "Researchers");
		}

		return audiences;
	}

	private determinePolishTargetAudience(
		gradeLevel: number,
		complexity: string,
	): string[] {
		const audiences: string[] = [];

		if (complexity === "VERY_EASY" || complexity === "EASY") {
			audiences.push(
				"Ogół społeczeństwa",
				"Uczniowie (szkoła podstawowa/średnia)",
			);
		}

		if (complexity === "MODERATE") {
			audiences.push("Studenci (uczelnie wyższe)", "Pracownicy służby zdrowia");
		}

		if (complexity === "DIFFICULT" || complexity === "VERY_DIFFICULT") {
			audiences.push("Specjaliści medycyny", "Badacze");
		}

		return audiences;
	}

	private analyzeMedicalTerminology(text: string): MedicalTerminologyAnalysis {
		const words = text.toLowerCase().split(/\s+/);
		const termFrequency = new Map<string, number>();
		const complexityCount = {
			basic: 0,
			intermediate: 0,
			advanced: 0,
			expert: 0,
		};
		const needsDefinition: string[] = [];
		const polishNeedsDefinition: string[] = [];

		words.forEach((word) => {
			const cleanWord = word.replace(/[^\w]/g, "");

			// Check English terms
			const englishTerm = this.medicalTerminologyDatabase.get(cleanWord);
			if (englishTerm) {
				termFrequency.set(cleanWord, (termFrequency.get(cleanWord) || 0) + 1);

				switch (englishTerm.complexity) {
					case "BASIC":
						complexityCount.basic++;
						break;
					case "INTERMEDIATE":
						complexityCount.intermediate++;
						break;
					case "ADVANCED":
						complexityCount.advanced++;
						needsDefinition.push(cleanWord);
						break;
					case "EXPERT":
						complexityCount.expert++;
						needsDefinition.push(cleanWord);
						break;
				}
			}

			// Check Polish terms
			const polishTerm = this.polishMedicalTerms.get(cleanWord);
			if (polishTerm) {
				const polishWord = polishTerm.polishTerm;
				termFrequency.set(polishWord, (termFrequency.get(polishWord) || 0) + 1);

				switch (polishTerm.complexity) {
					case "BASIC":
						complexityCount.basic++;
						break;
					case "INTERMEDIATE":
						complexityCount.intermediate++;
						break;
					case "ADVANCED":
						complexityCount.advanced++;
						polishNeedsDefinition.push(polishWord);
						break;
					case "EXPERT":
						complexityCount.expert++;
						polishNeedsDefinition.push(polishWord);
						break;
				}
			}
		});

		const totalTerms =
			complexityCount.basic +
			complexityCount.intermediate +
			complexityCount.advanced +
			complexityCount.expert;

		const complexityScore =
			totalTerms > 0
				? ((complexityCount.advanced * 3 + complexityCount.expert * 4) /
						totalTerms) *
					25
				: 0;

		return {
			totalTerms,
			basicTerms: complexityCount.basic,
			intermediateTerms: complexityCount.intermediate,
			advancedTerms: complexityCount.advanced,
			expertTerms: complexityCount.expert,
			termFrequency,
			complexityScore: Math.min(100, complexityScore),
			needsDefinition,
			polishNeedsDefinition,
		};
	}

	private analyzeCulturalSensitivity(
		text: string,
	): CulturalSensitivityAnalysis {
		const polishContent = /[ąęćłńóśźżĄĘĆŁŃÓŚŹŻ]/.test(text);
		const culturalReferences: string[] = [];
		const potentialIssues: string[] = [];
		const polishPotentialIssues: string[] = [];

		// Check for culturally sensitive terms
		const sensitiveTerms = [
			"death",
			"terminal",
			"incurable",
			"fatal",
			"end-of-life",
			"śmierć",
			"terminalny",
			"nieuleczalny",
			"śmiertelny",
			"koniec życia",
		];

		sensitiveTerms.forEach((term) => {
			if (text.toLowerCase().includes(term)) {
				if (term.includes("ś") || term.includes("ń") || term.includes("ć")) {
					polishPotentialIssues.push(term);
				} else {
					potentialIssues.push(term);
				}
			}
		});

		// Determine sensitivity level
		let sensitivityLevel: "LOW" | "MEDIUM" | "HIGH" = "LOW";
		if (polishPotentialIssues.length > 0 || potentialIssues.length > 0) {
			sensitivityLevel =
				potentialIssues.length > 2 || polishPotentialIssues.length > 2
					? "HIGH"
					: "MEDIUM";
		}

		return {
			sensitivityLevel,
			polishContent,
			culturalReferences,
			potentialIssues,
			polishPotentialIssues,
		};
	}

	private analyzeAgeAppropriateness(
		text: string,
		targetAudience?: "STUDENT" | "PROFESSIONAL" | "GENERAL_PUBLIC",
	): AgeAppropriatenessAnalysis {
		const readingLevel = this.analyzeReadingLevel(text);
		const medicalComplexity = this.analyzeMedicalTerminology(text);

		let minimumAge = 12; // Default minimum age
		const appropriateFor: string[] = [];
		const polishAppropriateFor: string[] = [];
		const concerns: string[] = [];
		const polishConcerns: string[] = [];

		// Adjust based on complexity
		if (
			readingLevel.complexity === "VERY_DIFFICULT" ||
			readingLevel.complexity === "DIFFICULT"
		) {
			minimumAge = 18;
			if (targetAudience === "STUDENT") {
				concerns.push("Content may be too advanced for students");
				polishConcerns.push("Treść może być zbyt zaawansowana dla uczniów");
			}
		} else if (readingLevel.complexity === "MODERATE") {
			minimumAge = 16;
		}

		// Check medical terminology complexity
		if (
			medicalComplexity.advancedTerms > 0 ||
			medicalComplexity.expertTerms > 0
		) {
			if (targetAudience === "GENERAL_PUBLIC") {
				concerns.push(
					"Advanced medical terminology may confuse general audience",
				);
				polishConcerns.push(
					"Zaawansowana terminologia medyczna może wprowadzić w błąd ogół społeczeństwa",
				);
			}
		}

		// Set appropriate audiences
		if (minimumAge <= 16) {
			appropriateFor.push("General Public");
			polishAppropriateFor.push("Ogół społeczeństwa");
		}

		if (minimumAge <= 18) {
			appropriateFor.push("Students");
			polishAppropriateFor.push("Uczniowie");
		}

		appropriateFor.push("Healthcare Professionals");
		polishAppropriateFor.push("Pracownicy służby zdrowia");

		return {
			minimumAge,
			appropriateFor,
			polishAppropriateFor,
			concerns,
			polishConcerns,
		};
	}

	private analyzeEvidenceQuality(
		supplementId: string,
	): EvidenceQualityAnalysis {
		const sources = this.evidenceDatabase.get(supplementId) || [];

		if (sources.length === 0) {
			return {
				overallLevel: "INSUFFICIENT",
				sources: [],
				lastUpdated: new Date(),
				needsReview: true,
				reviewReasons: ["No evidence sources found"],
				polishReviewReasons: ["Nie znaleziono źródeł dowodowych"],
			};
		}

		// Calculate overall evidence level
		const highQualitySources = sources.filter(
			(s) => s.quality === "HIGH",
		).length;
		const mediumQualitySources = sources.filter(
			(s) => s.quality === "MEDIUM",
		).length;

		let overallLevel: "STRONG" | "MODERATE" | "WEAK" | "INSUFFICIENT" =
			"INSUFFICIENT";

		if (highQualitySources >= 2) {
			overallLevel = "STRONG";
		} else if (highQualitySources >= 1 || mediumQualitySources >= 2) {
			overallLevel = "MODERATE";
		} else if (sources.length >= 1) {
			overallLevel = "WEAK";
		}

		const needsReview =
			overallLevel === "WEAK" ||
			overallLevel === "INSUFFICIENT" ||
			this.isEvidenceOutdated(sources);

		const reviewReasons = [];
		const polishReviewReasons = [];

		if (overallLevel === "WEAK") {
			reviewReasons.push("Limited high-quality evidence available");
			polishReviewReasons.push("Ograniczona ilość dowodów wysokiej jakości");
		}

		if (needsReview && this.isEvidenceOutdated(sources)) {
			reviewReasons.push("Evidence may be outdated");
			polishReviewReasons.push("Dowody mogą być nieaktualne");
		}

		return {
			overallLevel,
			sources,
			lastUpdated: new Date(),
			needsReview,
			reviewReasons,
			polishReviewReasons,
		};
	}

	private getDefaultEvidenceQuality(): EvidenceQualityAnalysis {
		return {
			overallLevel: "INSUFFICIENT",
			sources: [],
			lastUpdated: new Date(),
			needsReview: false,
			reviewReasons: [],
			polishReviewReasons: [],
		};
	}

	private isEvidenceOutdated(sources: EvidenceSource[]): boolean {
		const currentYear = new Date().getFullYear();
		const recentSources = sources.filter((s) => currentYear - s.year <= 5);
		return recentSources.length === 0;
	}

	private async analyzeSupplementContent(
		supplement: RelatedSupplement,
		targetAudience?: "STUDENT" | "PROFESSIONAL" | "GENERAL_PUBLIC",
	): Promise<ContentAnalysisResult> {
		const text = `${supplement.mechanism} ${supplement.polishMechanism}`;

		return this.analyzeTextContent(
			text,
			"SUPPLEMENT",
			supplement.supplementId,
			targetAudience,
		);
	}

	private generateContentRecommendations(analysis: {
		readingLevel: ReadingLevelAnalysis;
		medicalTerminology: MedicalTerminologyAnalysis;
		culturalSensitivity: CulturalSensitivityAnalysis;
		ageAppropriateness: AgeAppropriatenessAnalysis;
		evidenceQuality: EvidenceQualityAnalysis;
	}): ContentRecommendation[] {
		const recommendations: ContentRecommendation[] = [];

		// Reading level recommendations
		if (
			analysis.readingLevel.complexity === "DIFFICULT" ||
			analysis.readingLevel.complexity === "VERY_DIFFICULT"
		) {
			recommendations.push({
				type: "SIMPLIFY",
				priority: "HIGH",
				description: "Simplify complex sentences and use shorter words",
				polishDescription: "Uprość złożone zdania i używaj krótszych słów",
				estimatedEffort: 15,
				autoFixable: false,
			});
		}

		// Medical terminology recommendations
		if (analysis.medicalTerminology.needsDefinition.length > 0) {
			recommendations.push({
				type: "DEFINE",
				priority: "MEDIUM",
				description: `Define medical terms: ${analysis.medicalTerminology.needsDefinition.join(", ")}`,
				polishDescription: `Zdefiniuj terminy medyczne: ${analysis.medicalTerminology.needsDefinition.join(", ")}`,
				estimatedEffort: 10,
				autoFixable: true,
			});
		}

		// Cultural sensitivity recommendations
		if (analysis.culturalSensitivity.sensitivityLevel === "HIGH") {
			recommendations.push({
				type: "CULTURAL_REVIEW",
				priority: "HIGH",
				description: "Review content for cultural sensitivity",
				polishDescription: "Przejrzyj treść pod kątem wrażliwości kulturowej",
				estimatedEffort: 20,
				autoFixable: false,
			});
		}

		// Evidence quality recommendations
		if (analysis.evidenceQuality.needsReview) {
			recommendations.push({
				type: "REVIEW_EVIDENCE",
				priority: "HIGH",
				description: "Review and update evidence sources",
				polishDescription: "Przejrzyj i zaktualizuj źródła dowodowe",
				estimatedEffort: 30,
				autoFixable: false,
			});
		}

		return recommendations;
	}

	private generatePolishContentRecommendations(analysis: {
		readingLevel: ReadingLevelAnalysis;
		medicalTerminology: MedicalTerminologyAnalysis;
		culturalSensitivity: CulturalSensitivityAnalysis;
		ageAppropriateness: AgeAppropriatenessAnalysis;
		evidenceQuality: EvidenceQualityAnalysis;
	}): ContentRecommendation[] {
		const recommendations: ContentRecommendation[] = [];

		// Reading level recommendations
		if (
			analysis.readingLevel.complexity === "DIFFICULT" ||
			analysis.readingLevel.complexity === "VERY_DIFFICULT"
		) {
			recommendations.push({
				type: "SIMPLIFY",
				priority: "HIGH",
				description: "Uprość złożone zdania i używaj krótszych słów",
				polishDescription: "Uprość złożone zdania i używaj krótszych słów",
				estimatedEffort: 15,
				autoFixable: false,
			});
		}

		// Medical terminology recommendations
		if (analysis.medicalTerminology.polishNeedsDefinition.length > 0) {
			recommendations.push({
				type: "DEFINE",
				priority: "MEDIUM",
				description: `Zdefiniuj polskie terminy medyczne: ${analysis.medicalTerminology.polishNeedsDefinition.join(", ")}`,
				polishDescription: `Zdefiniuj polskie terminy medyczne: ${analysis.medicalTerminology.polishNeedsDefinition.join(", ")}`,
				estimatedEffort: 10,
				autoFixable: true,
			});
		}

		// Cultural sensitivity recommendations
		if (analysis.culturalSensitivity.sensitivityLevel === "HIGH") {
			recommendations.push({
				type: "CULTURAL_REVIEW",
				priority: "HIGH",
				description: "Przejrzyj treść pod kątem wrażliwości kulturowej",
				polishDescription: "Przejrzyj treść pod kątem wrażliwości kulturowej",
				estimatedEffort: 20,
				autoFixable: false,
			});
		}

		// Evidence quality recommendations
		if (analysis.evidenceQuality.needsReview) {
			recommendations.push({
				type: "REVIEW_EVIDENCE",
				priority: "HIGH",
				description: "Przejrzyj i zaktualizuj źródła dowodowe",
				polishDescription: "Przejrzyj i zaktualizuj źródła dowodowe",
				estimatedEffort: 30,
				autoFixable: false,
			});
		}

		return recommendations;
	}

	private calculateContentScore(analysis: {
		readingLevel: ReadingLevelAnalysis;
		medicalTerminology: MedicalTerminologyAnalysis;
		culturalSensitivity: CulturalSensitivityAnalysis;
		ageAppropriateness: AgeAppropriatenessAnalysis;
		evidenceQuality: EvidenceQualityAnalysis;
	}): number {
		let score = 100;

		// Deduct for reading complexity
		if (analysis.readingLevel.complexity === "DIFFICULT") score -= 20;
		if (analysis.readingLevel.complexity === "VERY_DIFFICULT") score -= 30;

		// Deduct for medical terminology complexity
		score -= analysis.medicalTerminology.complexityScore;

		// Deduct for cultural sensitivity issues
		if (analysis.culturalSensitivity.sensitivityLevel === "MEDIUM") score -= 10;
		if (analysis.culturalSensitivity.sensitivityLevel === "HIGH") score -= 20;

		// Deduct for evidence quality issues
		if (analysis.evidenceQuality.overallLevel === "WEAK") score -= 15;
		if (analysis.evidenceQuality.overallLevel === "INSUFFICIENT") score -= 25;

		return Math.max(0, Math.min(100, score));
	}

	private calculateOverallScore(analyses: ContentAnalysisResult[]): number {
		if (analyses.length === 0) return 0;

		const totalScore = analyses.reduce(
			(sum, analysis) => sum + analysis.overallScore,
			0,
		);
		return Math.round(totalScore / analyses.length);
	}

	private generateRecommendations(
		analyses: ContentAnalysisResult[],
	): ContentRecommendation[] {
		const allRecommendations = analyses.flatMap((a) => a.recommendations);

		// Group and prioritize recommendations
		const recommendationMap = new Map<string, ContentRecommendation>();

		allRecommendations.forEach((rec) => {
			const existing = recommendationMap.get(rec.type);
			if (!existing || rec.priority !== "LOW") {
				recommendationMap.set(rec.type, rec);
			}
		});

		return Array.from(recommendationMap.values()).sort(
			(a, b) =>
				this.getPriorityWeight(b.priority) - this.getPriorityWeight(a.priority),
		);
	}

	private generatePolishRecommendations(
		analyses: ContentAnalysisResult[],
	): ContentRecommendation[] {
		const allRecommendations = analyses.flatMap((a) => a.polishRecommendations);

		// Group and prioritize recommendations
		const recommendationMap = new Map<string, ContentRecommendation>();

		allRecommendations.forEach((rec) => {
			const existing = recommendationMap.get(rec.type);
			if (!existing || rec.priority !== "LOW") {
				recommendationMap.set(rec.type, rec);
			}
		});

		return Array.from(recommendationMap.values()).sort(
			(a, b) =>
				this.getPriorityWeight(b.priority) - this.getPriorityWeight(a.priority),
		);
	}

	private getPriorityWeight(
		priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
	): number {
		switch (priority) {
			case "CRITICAL":
				return 4;
			case "HIGH":
				return 3;
			case "MEDIUM":
				return 2;
			case "LOW":
				return 1;
		}
	}

	// Public methods for external access
	async validateBodySystem(
		bodySystem: BodySystem,
	): Promise<ContentAnalysisResult> {
		return this.analyzeBodySystemContent(bodySystem);
	}

	async validateMultipleSystems(
		bodySystems: BodySystem[],
	): Promise<ContentAnalysisResult[]> {
		return Promise.all(
			bodySystems.map((system) => this.analyzeBodySystemContent(system)),
		);
	}

	getMedicalTerminologyDatabase(): Map<string, MedicalTermInfo> {
		return new Map(this.medicalTerminologyDatabase);
	}

	getPolishMedicalTerms(): Map<string, PolishMedicalTerm> {
		return new Map(this.polishMedicalTerms);
	}

	// Batch analysis for performance
	async batchAnalyzeContent(
		contentItems: Array<{ id: string; text: string; type: string }>,
		targetAudience?: "STUDENT" | "PROFESSIONAL" | "GENERAL_PUBLIC",
	): Promise<ContentAnalysisResult[]> {
		const results: ContentAnalysisResult[] = [];

		// Process in batches to avoid overwhelming the system
		const batchSize = 10;
		for (let i = 0; i < contentItems.length; i += batchSize) {
			const batch = contentItems.slice(i, i + batchSize);

			const batchResults = await Promise.all(
				batch.map((item) =>
					this.analyzeTextContent(
						item.text,
						item.type as any,
						item.id,
						targetAudience,
					),
				),
			);

			results.push(...batchResults);

			// Small delay between batches to prevent overwhelming
			if (i + batchSize < contentItems.length) {
				await new Promise((resolve) => setTimeout(resolve, 100));
			}
		}

		return results;
	}
}

// Supporting interfaces
interface MedicalTermInfo {
	term: string;
	category: string;
	complexity: "BASIC" | "INTERMEDIATE" | "ADVANCED" | "EXPERT";
	definition: string;
	synonyms: string[];
	relatedTerms: string[];
}

interface PolishMedicalTerm {
	polishTerm: string;
	englishTerm: string;
	definition: string;
	complexity: "BASIC" | "INTERMEDIATE" | "ADVANCED" | "EXPERT";
	alternatives: string[];
}

// Export singleton instance
export const contentValidationTools = new ContentValidationTools();
