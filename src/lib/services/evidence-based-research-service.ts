/**
 * Evidence-Based Research Service
 * Manages research citations, evidence levels, and PubMed integration
 * Provides Polish healthcare context and evidence classification
 */

export interface ResearchStudy {
	id: string;
	title: string;
	polishTitle: string;
	authors: string[];
	journal: string;
	year: number;
	volume?: string;
	issue?: string;
	pages?: string;
	doi?: string;
	pubmedId?: string;
	pmcId?: string;

	// Study characteristics
	studyType: StudyType;
	studyDesign: StudyDesign;
	sampleSize: number;
	duration: string;
	population: {
		description: string;
		polishDescription: string;
		ageRange?: string;
		gender?: "male" | "female" | "mixed";
		healthStatus: "healthy" | "diseased" | "mixed";
		exclusionCriteria: string[];
		polishExclusionCriteria: string[];
	};

	// Intervention details
	intervention: {
		supplement: string;
		polishSupplement: string;
		dosage: string;
		frequency: string;
		duration: string;
		formulation: string;
		polishFormulation: string;
		control: string;
		polishControl: string;
	};

	// Outcomes
	primaryEndpoint: string;
	polishPrimaryEndpoint: string;
	secondaryEndpoints: string[];
	polishSecondaryEndpoints: string[];
	results: {
		summary: string;
		polishSummary: string;
		statisticalSignificance: boolean;
		pValue?: number;
		confidenceInterval?: string;
		effectSize?: number;
		clinicalSignificance: string;
		polishClinicalSignificance: string;
	};

	// Quality assessment
	qualityAssessment: {
		evidenceLevel: EvidenceLevel;
		riskOfBias: "low" | "moderate" | "high" | "unclear";
		jadScore?: number; // For RCTs
		newcastleOttawaScore?: number; // For observational studies
		limitations: string[];
		polishLimitations: string[];
		strengths: string[];
		polishStrengths: string[];
	};

	// Polish healthcare context
	polishHealthcareContext: {
		regulatoryStatus:
			| "approved"
			| "not_approved"
			| "under_review"
			| "not_applicable";
		availabilityInPoland: boolean;
		reimbursementStatus:
			| "reimbursed"
			| "not_reimbursed"
			| "partial"
			| "not_applicable";
		clinicalGuidelines: string[];
		polishClinicalGuidelines: string[];
		expertOpinions: string[];
		polishExpertOpinions: string[];
	};

	// Metadata
	lastUpdated: string;
	reviewedBy: string[];
	conflictsOfInterest: string[];
	funding: string[];
	registrationNumber?: string; // Clinical trial registration
}

export type StudyType =
	| "RANDOMIZED_CONTROLLED_TRIAL"
	| "SYSTEMATIC_REVIEW"
	| "META_ANALYSIS"
	| "COHORT_STUDY"
	| "CASE_CONTROL_STUDY"
	| "CROSS_SECTIONAL_STUDY"
	| "CASE_SERIES"
	| "CASE_REPORT"
	| "NARRATIVE_REVIEW"
	| "PRECLINICAL_STUDY"
	| "IN_VITRO_STUDY";

export type StudyDesign =
	| "PARALLEL_GROUP"
	| "CROSSOVER"
	| "FACTORIAL"
	| "DOSE_RESPONSE"
	| "PLACEBO_CONTROLLED"
	| "ACTIVE_CONTROLLED"
	| "OPEN_LABEL"
	| "SINGLE_BLIND"
	| "DOUBLE_BLIND"
	| "TRIPLE_BLIND";

export type EvidenceLevel =
	| "STRONG" // Level 1: High-quality RCTs, systematic reviews
	| "MODERATE" // Level 2: Lower-quality RCTs, well-designed observational studies
	| "WEAK" // Level 3: Case-control studies, case series
	| "INSUFFICIENT" // Level 4: Expert opinion, case reports
	| "CONFLICTING"; // Conflicting evidence from multiple studies

export interface EvidenceSummary {
	supplementId: string;
	condition: string;
	polishCondition: string;
	totalStudies: number;
	studyTypes: Record<StudyType, number>;
	evidenceLevels: Record<EvidenceLevel, number>;
	overallEvidenceLevel: EvidenceLevel;
	lastUpdated: string;

	// Quantitative synthesis
	metaAnalysisResults?: {
		effectSize: number;
		confidenceInterval: [number, number];
		heterogeneity: number; // I² statistic
		pValue: number;
		numberOfStudies: number;
		totalParticipants: number;
	};

	// Qualitative synthesis
	narrativeSummary: {
		english: string;
		polish: string;
	};

	// Clinical recommendations
	recommendations: {
		strength:
			| "strong_for"
			| "weak_for"
			| "weak_against"
			| "strong_against"
			| "insufficient";
		polishStrength: string;
		rationale: string;
		polishRationale: string;
		dosageRecommendation?: string;
		polishDosageRecommendation?: string;
		populationSpecific: {
			population: string;
			polishPopulation: string;
			recommendation: string;
			polishRecommendation: string;
		}[];
	};

	// Polish healthcare integration
	polishHealthcareIntegration: {
		guidelineRecommendations: string[];
		polishGuidelineRecommendations: string[];
		expertConsensus: string;
		polishExpertConsensus: string;
		implementationBarriers: string[];
		polishImplementationBarriers: string[];
	};
}

export interface PubMedSearchParams {
	query: string;
	maxResults?: number;
	yearFrom?: number;
	yearTo?: number;
	studyTypes?: StudyType[];
	languages?: string[];
	humanStudiesOnly?: boolean;
}

export interface PubMedSearchResult {
	pmid: string;
	title: string;
	authors: string[];
	journal: string;
	year: number;
	abstract?: string;
	doi?: string;
	studyType?: StudyType;
	relevanceScore: number;
}

export class EvidenceBasedResearchService {
	private apiKey: string;
	private baseUrl = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/";
	private cache: Map<string, any> = new Map();
	private cacheExpiry = 24 * 60 * 60 * 1000; // 24 hours

	constructor(apiKey?: string) {
		this.apiKey = apiKey || process.env.PUBMED_API_KEY || "";
	}

	/**
	 * Search PubMed for research studies
	 */
	async searchPubMed(
		params: PubMedSearchParams,
	): Promise<PubMedSearchResult[]> {
		const cacheKey = `pubmed_search_${JSON.stringify(params)}`;
		const cached = this.getCachedResult(cacheKey);
		if (cached) return cached;

		try {
			// Build search query
			let query = params.query;

			if (params.humanStudiesOnly) {
				query += " AND humans[MeSH Terms]";
			}

			if (params.studyTypes && params.studyTypes.length > 0) {
				const studyTypeFilters = params.studyTypes
					.map((type) => {
						switch (type) {
							case "RANDOMIZED_CONTROLLED_TRIAL":
								return "randomized controlled trial[pt]";
							case "SYSTEMATIC_REVIEW":
								return "systematic review[pt]";
							case "META_ANALYSIS":
								return "meta-analysis[pt]";
							case "COHORT_STUDY":
								return "cohort studies[MeSH Terms]";
							case "CASE_CONTROL_STUDY":
								return "case-control studies[MeSH Terms]";
							default:
								return "";
						}
					})
					.filter(Boolean);

				if (studyTypeFilters.length > 0) {
					query += ` AND (${studyTypeFilters.join(" OR ")})`;
				}
			}

			if (params.yearFrom || params.yearTo) {
				const yearFrom = params.yearFrom || 1900;
				const yearTo = params.yearTo || new Date().getFullYear();
				query += ` AND ${yearFrom}:${yearTo}[dp]`;
			}

			// Search PubMed
			const searchUrl = `${this.baseUrl}esearch.fcgi?db=pubmed&term=${encodeURIComponent(query)}&retmax=${params.maxResults || 50}&retmode=json&api_key=${this.apiKey}`;

			const searchResponse = await fetch(searchUrl);
			const searchData = await searchResponse.json();

			if (!searchData.esearchresult?.idlist?.length) {
				return [];
			}

			// Fetch details for found articles
			const ids = searchData.esearchresult.idlist.slice(
				0,
				params.maxResults || 50,
			);
			const detailsUrl = `${this.baseUrl}esummary.fcgi?db=pubmed&id=${ids.join(",")}&retmode=json&api_key=${this.apiKey}`;

			const detailsResponse = await fetch(detailsUrl);
			const detailsData = await detailsResponse.json();

			const results: PubMedSearchResult[] = [];

			for (const id of ids) {
				const article = detailsData.result[id];
				if (article) {
					results.push({
						pmid: id,
						title: article.title || "",
						authors: article.authors?.map((a: any) => a.name) || [],
						journal: article.fulljournalname || article.source || "",
						year: Number.parseInt(article.pubdate?.split(" ")[0]) || 0,
						doi: article.elocationid?.startsWith("doi:")
							? article.elocationid.substring(4)
							: undefined,
						studyType: this.inferStudyType(article.title, article.pubtype),
						relevanceScore: this.calculateRelevanceScore(article, params.query),
					});
				}
			}

			// Sort by relevance score
			results.sort((a, b) => b.relevanceScore - a.relevanceScore);

			this.setCachedResult(cacheKey, results);
			return results;
		} catch (error) {
			console.error("PubMed search error:", error);
			return [];
		}
	}

	/**
	 * Get detailed study information including abstract
	 */
	async getStudyDetails(pmid: string): Promise<ResearchStudy | null> {
		const cacheKey = `study_details_${pmid}`;
		const cached = this.getCachedResult(cacheKey);
		if (cached) return cached;

		try {
			const url = `${this.baseUrl}efetch.fcgi?db=pubmed&id=${pmid}&retmode=xml&api_key=${this.apiKey}`;
			const response = await fetch(url);
			const xmlText = await response.text();

			// Parse XML (simplified - in production, use proper XML parser)
			const study = this.parseStudyXML(xmlText, pmid);

			this.setCachedResult(cacheKey, study);
			return study;
		} catch (error) {
			console.error("Study details fetch error:", error);
			return null;
		}
	}

	/**
	 * Generate evidence summary for a supplement-condition pair
	 */
	async generateEvidenceSummary(
		supplementId: string,
		condition: string,
		polishCondition: string,
	): Promise<EvidenceSummary> {
		// Search for relevant studies
		const searchParams: PubMedSearchParams = {
			query: `${supplementId} AND ${condition}`,
			maxResults: 100,
			humanStudiesOnly: true,
			studyTypes: [
				"RANDOMIZED_CONTROLLED_TRIAL",
				"SYSTEMATIC_REVIEW",
				"META_ANALYSIS",
			],
		};

		const studies = await this.searchPubMed(searchParams);

		// Analyze evidence levels
		const studyTypes: Record<StudyType, number> = {} as any;
		const evidenceLevels: Record<EvidenceLevel, number> = {} as any;

		studies.forEach((study) => {
			if (study.studyType) {
				studyTypes[study.studyType] = (studyTypes[study.studyType] || 0) + 1;
			}

			const evidenceLevel = this.determineEvidenceLevel(study.studyType);
			evidenceLevels[evidenceLevel] = (evidenceLevels[evidenceLevel] || 0) + 1;
		});

		// Determine overall evidence level
		const overallEvidenceLevel =
			this.calculateOverallEvidenceLevel(evidenceLevels);

		// Generate recommendations
		const recommendations = this.generateRecommendations(
			overallEvidenceLevel,
			studies.length,
			supplementId,
			condition,
			polishCondition,
		);

		return {
			supplementId,
			condition,
			polishCondition,
			totalStudies: studies.length,
			studyTypes,
			evidenceLevels,
			overallEvidenceLevel,
			lastUpdated: new Date().toISOString(),
			narrativeSummary: {
				english: this.generateNarrativeSummary(studies, "en"),
				polish: this.generateNarrativeSummary(studies, "pl"),
			},
			recommendations,
			polishHealthcareIntegration: {
				guidelineRecommendations: [],
				polishGuidelineRecommendations: [],
				expertConsensus: this.generateExpertConsensus(
					overallEvidenceLevel,
					"en",
				),
				polishExpertConsensus: this.generateExpertConsensus(
					overallEvidenceLevel,
					"pl",
				),
				implementationBarriers: [],
				polishImplementationBarriers: [],
			},
		};
	}

	/**
	 * Validate study quality and assign evidence level
	 */
	assessStudyQuality(study: ResearchStudy): EvidenceLevel {
		let score = 0;

		// Study type scoring
		switch (study.studyType) {
			case "META_ANALYSIS":
			case "SYSTEMATIC_REVIEW":
				score += 4;
				break;
			case "RANDOMIZED_CONTROLLED_TRIAL":
				score += 3;
				break;
			case "COHORT_STUDY":
				score += 2;
				break;
			case "CASE_CONTROL_STUDY":
				score += 1;
				break;
			default:
				score += 0;
		}

		// Sample size scoring
		if (study.sampleSize >= 1000) score += 2;
		else if (study.sampleSize >= 100) score += 1;

		// Study design scoring
		if (study.studyDesign === "DOUBLE_BLIND") score += 2;
		else if (study.studyDesign === "SINGLE_BLIND") score += 1;

		if (study.studyDesign === "PLACEBO_CONTROLLED") score += 1;

		// Quality assessment scoring
		if (study.qualityAssessment.riskOfBias === "low") score += 2;
		else if (study.qualityAssessment.riskOfBias === "moderate") score += 1;

		// Determine evidence level based on total score
		if (score >= 8) return "STRONG";
		if (score >= 5) return "MODERATE";
		if (score >= 2) return "WEAK";
		return "INSUFFICIENT";
	}

	/**
	 * Generate Polish healthcare-specific recommendations
	 */
	generatePolishHealthcareRecommendations(
		evidenceSummary: EvidenceSummary,
	): string[] {
		const recommendations: string[] = [];

		switch (evidenceSummary.overallEvidenceLevel) {
			case "STRONG":
				recommendations.push(
					"Silne dowody naukowe wspierają stosowanie tego suplementu w danym wskazaniu.",
					"Zalecane jest uwzględnienie w wytycznych klinicznych.",
					"Może być rozważane jako opcja terapeutyczna pierwszego rzutu.",
				);
				break;
			case "MODERATE":
				recommendations.push(
					"Umiarkowane dowody naukowe sugerują potencjalne korzyści.",
					"Zalecane jest indywidualne rozważenie ryzyka i korzyści.",
					"Może być stosowane jako terapia uzupełniająca.",
				);
				break;
			case "WEAK":
				recommendations.push(
					"Słabe dowody naukowe - wymagane są dalsze badania.",
					"Stosowanie tylko po dokładnej ocenie indywidualnej.",
					"Nie zalecane jako terapia pierwszego rzutu.",
				);
				break;
			case "INSUFFICIENT":
				recommendations.push(
					"Niewystarczające dowody naukowe.",
					"Nie zalecane do rutynowego stosowania.",
					"Wymagane są wysokiej jakości badania kliniczne.",
				);
				break;
		}

		return recommendations;
	}

	// Private helper methods
	private getCachedResult(key: string): any {
		const cached = this.cache.get(key);
		if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
			return cached.data;
		}
		return null;
	}

	private setCachedResult(key: string, data: any): void {
		this.cache.set(key, {
			data,
			timestamp: Date.now(),
		});
	}

	private inferStudyType(
		title: string,
		pubTypes: string[],
	): StudyType | undefined {
		const titleLower = title.toLowerCase();

		if (titleLower.includes("meta-analysis")) return "META_ANALYSIS";
		if (titleLower.includes("systematic review")) return "SYSTEMATIC_REVIEW";
		if (titleLower.includes("randomized") || titleLower.includes("rct"))
			return "RANDOMIZED_CONTROLLED_TRIAL";
		if (titleLower.includes("cohort")) return "COHORT_STUDY";
		if (titleLower.includes("case-control")) return "CASE_CONTROL_STUDY";
		if (titleLower.includes("cross-sectional")) return "CROSS_SECTIONAL_STUDY";

		return undefined;
	}

	private calculateRelevanceScore(article: any, query: string): number {
		let score = 0;
		const queryTerms = query.toLowerCase().split(" ");
		const title = (article.title || "").toLowerCase();

		queryTerms.forEach((term) => {
			if (title.includes(term)) score += 2;
		});

		// Boost for recent studies
		const currentYear = new Date().getFullYear();
		const articleYear = Number.parseInt(article.pubdate?.split(" ")[0]) || 0;
		if (currentYear - articleYear <= 5) score += 1;

		return score;
	}

	private parseStudyXML(xmlText: string, pmid: string): ResearchStudy | null {
		// Simplified XML parsing - in production, use proper XML parser
		// This is a placeholder implementation
		return null;
	}

	private determineEvidenceLevel(studyType?: StudyType): EvidenceLevel {
		switch (studyType) {
			case "META_ANALYSIS":
			case "SYSTEMATIC_REVIEW":
				return "STRONG";
			case "RANDOMIZED_CONTROLLED_TRIAL":
				return "MODERATE";
			case "COHORT_STUDY":
			case "CASE_CONTROL_STUDY":
				return "WEAK";
			default:
				return "INSUFFICIENT";
		}
	}

	private calculateOverallEvidenceLevel(
		evidenceLevels: Record<EvidenceLevel, number>,
	): EvidenceLevel {
		if (evidenceLevels.STRONG >= 2) return "STRONG";
		if (evidenceLevels.MODERATE >= 3) return "MODERATE";
		if (evidenceLevels.WEAK >= 2) return "WEAK";
		return "INSUFFICIENT";
	}

	private generateNarrativeSummary(
		studies: PubMedSearchResult[],
		language: "en" | "pl",
	): string {
		if (studies.length === 0) {
			return language === "pl"
				? "Brak dostępnych badań naukowych."
				: "No scientific studies available.";
		}

		const rctCount = studies.filter(
			(s) => s.studyType === "RANDOMIZED_CONTROLLED_TRIAL",
		).length;
		const reviewCount = studies.filter(
			(s) =>
				s.studyType === "SYSTEMATIC_REVIEW" || s.studyType === "META_ANALYSIS",
		).length;

		if (language === "pl") {
			return `Znaleziono ${studies.length} badań, w tym ${rctCount} randomizowanych badań kontrolowanych i ${reviewCount} przeglądów systematycznych/meta-analiz. Dowody sugerują potencjalne korzyści, ale wymagane są dalsze badania wysokiej jakości.`;
		}
		return `Found ${studies.length} studies, including ${rctCount} randomized controlled trials and ${reviewCount} systematic reviews/meta-analyses. Evidence suggests potential benefits, but further high-quality research is needed.`;
	}

	private generateRecommendations(
		evidenceLevel: EvidenceLevel,
		studyCount: number,
		supplementId: string,
		condition: string,
		polishCondition: string,
	): EvidenceSummary["recommendations"] {
		let strength: EvidenceSummary["recommendations"]["strength"];
		let rationale: string;
		let polishRationale: string;
		let polishStrength: string;

		switch (evidenceLevel) {
			case "STRONG":
				strength = "strong_for";
				polishStrength = "Silnie za";
				rationale = `Strong evidence from ${studyCount} studies supports the use of this supplement for ${condition}.`;
				polishRationale = `Silne dowody z ${studyCount} badań wspierają stosowanie tego suplementu w ${polishCondition}.`;
				break;
			case "MODERATE":
				strength = "weak_for";
				polishStrength = "Słabo za";
				rationale =
					"Moderate evidence suggests potential benefits, but more research is needed.";
				polishRationale =
					"Umiarkowane dowody sugerują potencjalne korzyści, ale potrzebne są dalsze badania.";
				break;
			case "WEAK":
				strength = "weak_against";
				polishStrength = "Słabo przeciw";
				rationale =
					"Limited evidence available. Use with caution and individual assessment.";
				polishRationale =
					"Ograniczone dowody dostępne. Stosować ostrożnie i po indywidualnej ocenie.";
				break;
			default:
				strength = "insufficient";
				polishStrength = "Niewystarczające dowody";
				rationale = "Insufficient evidence to make recommendations.";
				polishRationale = "Niewystarczające dowody do wydania rekomendacji.";
		}

		return {
			strength,
			polishStrength,
			rationale,
			polishRationale,
			populationSpecific: [],
		};
	}

	private generateExpertConsensus(
		evidenceLevel: EvidenceLevel,
		language: "en" | "pl",
	): string {
		const consensusMap = {
			STRONG: {
				en: "Expert consensus strongly supports the use based on robust evidence.",
				pl: "Konsensus ekspertów silnie wspiera stosowanie na podstawie solidnych dowodów.",
			},
			MODERATE: {
				en: "Expert opinion is generally favorable but recommends individual assessment.",
				pl: "Opinia ekspertów jest ogólnie przychylna, ale zaleca indywidualną ocenę.",
			},
			WEAK: {
				en: "Expert opinion is divided. Use with caution.",
				pl: "Opinie ekspertów są podzielone. Stosować ostrożnie.",
			},
			INSUFFICIENT: {
				en: "Experts recommend waiting for more evidence before routine use.",
				pl: "Eksperci zalecają oczekiwanie na więcej dowodów przed rutynowym stosowaniem.",
			},
			CONFLICTING: {
				en: "Expert opinions are conflicting due to mixed evidence.",
				pl: "Opinie ekspertów są sprzeczne ze względu na mieszane dowody.",
			},
		};

		return consensusMap[evidenceLevel][language];
	}
}

// Export singleton instance
export const evidenceBasedResearchService = new EvidenceBasedResearchService();
