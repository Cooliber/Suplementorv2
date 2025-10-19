"use client";

/**
 * Currency Verification System for Medical Content
 * Provides automated checking for content freshness, citation validation,
 * and clinical guideline updates monitoring
 */

import type { BodySystem, RelatedSupplement } from "@/data/body-systems";
import {
	type MedicalCitation,
	type MedicalSource,
	enhancedMedicalValidationService,
} from "./enhanced-medical-validation";

export interface CurrencyVerificationResult {
	id: string;
	contentId: string;
	contentType: "SYSTEM" | "ORGAN" | "SUPPLEMENT" | "CITATION";
	verificationDate: Date;

	// Currency assessments
	contentFreshness: ContentFreshnessResult;
	citationCurrency: CitationCurrencyResult;
	guidelineCompliance: GuidelineComplianceResult;
	supplementCurrency: SupplementCurrencyResult;

	// Overall currency score
	overallCurrency: number; // 0-100
	lastUpdated: Date;
	nextReviewDate: Date;

	// Alerts and actions
	alerts: CurrencyAlert[];
	requiredActions: RequiredAction[];
	updateRecommendations: UpdateRecommendation[];
}

export interface ContentFreshnessResult {
	score: number; // 0-100
	lastModified: Date;
	daysSinceUpdate: number;
	freshnessLevel: "CURRENT" | "NEEDS_REVIEW" | "OUTDATED" | "ARCHIVED";
	contentAge: {
		days: number;
		months: number;
		years: number;
	};
	reviewFrequency:
		| "DAILY"
		| "WEEKLY"
		| "MONTHLY"
		| "QUARTERLY"
		| "ANNUALLY"
		| "BIANNUALLY";
}

export interface CitationCurrencyResult {
	score: number; // 0-100
	verifiedCitations: VerifiedCitation[];
	outdatedCitations: OutdatedCitation[];
	brokenLinks: BrokenLink[];
	missingDOIs: MissingDOI[];
	citationAccuracy: number; // 0-100
}

export interface VerifiedCitation {
	citation: MedicalCitation;
	verificationDate: Date;
	accessStatus: "ACCESSIBLE" | "RESTRICTED" | "UNAVAILABLE";
	contentMatch: boolean; // Does the citation content match the claim?
	relevanceScore: number; // 0-1
}

export interface OutdatedCitation {
	citation: MedicalCitation;
	age: number; // years since publication
	currentStatus: "SUPERSEDED" | "RETRACTED" | "UPDATED" | "CONTRADICTED";
	replacementCitation?: MedicalCitation;
	urgency: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
}

export interface BrokenLink {
	url: string;
	errorType: "HTTP_ERROR" | "TIMEOUT" | "DNS_ERROR" | "SSL_ERROR";
	lastChecked: Date;
	retryCount: number;
}

export interface MissingDOI {
	citation: MedicalCitation;
	suggestedDOI?: string;
	searchResults?: MedicalCitation[];
	priority: "LOW" | "MEDIUM" | "HIGH";
}

export interface GuidelineComplianceResult {
	score: number; // 0-100
	compliantGuidelines: CompliantGuideline[];
	outdatedGuidelines: OutdatedGuideline[];
	missingGuidelines: MissingGuideline[];
	complianceLevel: "EXCELLENT" | "GOOD" | "FAIR" | "POOR" | "NON_COMPLIANT";
}

export interface CompliantGuideline {
	guideline: ClinicalGuideline;
	compliance: "FULL" | "PARTIAL" | "MINIMAL";
	lastChecked: Date;
	nextReview: Date;
}

export interface OutdatedGuideline {
	guideline: ClinicalGuideline;
	currentVersion: string;
	availableVersion: string;
	updateDate: Date;
	impact: "LOW" | "MEDIUM" | "HIGH";
}

export interface MissingGuideline {
	topic: string;
	relevantGuidelines: ClinicalGuideline[];
	priority: "LOW" | "MEDIUM" | "HIGH";
	rationale: string;
}

export interface SupplementCurrencyResult {
	score: number; // 0-100
	currentInformation: CurrentSupplementInfo[];
	discontinuedProducts: DiscontinuedProduct[];
	formulationChanges: FormulationChange[];
	regulatoryUpdates: RegulatoryUpdate[];
	safetyAlerts: SafetyAlert[];
}

export interface CurrentSupplementInfo {
	supplementId: string;
	lastUpdated: Date;
	informationStatus: "CURRENT" | "NEEDS_UPDATE" | "OUTDATED";
	confidence: number; // 0-1
	sources: MedicalSource[];
}

export interface DiscontinuedProduct {
	supplementId: string;
	discontinuationDate: Date;
	reason: string;
	alternatives?: string[];
	impact: "LOW" | "MEDIUM" | "HIGH";
}

export interface FormulationChange {
	supplementId: string;
	changeDate: Date;
	previousFormulation: string;
	currentFormulation: string;
	impact: "MINOR" | "MODERATE" | "MAJOR";
	requiresAttention: boolean;
}

export interface RegulatoryUpdate {
	supplementId: string;
	updateDate: Date;
	jurisdiction: string;
	changeType: "APPROVAL" | "RESTRICTION" | "WARNING" | "WITHDRAWAL";
	description: string;
	impact: "LOW" | "MEDIUM" | "HIGH";
}

export interface SafetyAlert {
	supplementId: string;
	alertDate: Date;
	severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
	title: string;
	description: string;
	action: string;
}

export interface CurrencyAlert {
	type:
		| "OUTDATED_CONTENT"
		| "BROKEN_CITATION"
		| "REGULATORY_CHANGE"
		| "SAFETY_CONCERN"
		| "GUIDELINE_UPDATE";
	severity: "INFO" | "WARNING" | "ERROR" | "CRITICAL";
	message: string;
	affectedContent: string;
	action: string;
	deadline?: Date;
}

export interface RequiredAction {
	type:
		| "UPDATE_CONTENT"
		| "FIX_CITATION"
		| "REVIEW_GUIDELINE"
		| "CHECK_REGULATION"
		| "ASSESS_SAFETY";
	priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
	description: string;
	estimatedEffort: number; // minutes
	assignedTo?: string;
	dueDate: Date;
}

export interface UpdateRecommendation {
	type:
		| "CONTENT_UPDATE"
		| "CITATION_UPDATE"
		| "GUIDELINE_REVIEW"
		| "SUPPLEMENT_REVIEW";
	priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
	title: string;
	description: string;
	rationale: string;
	resources: string[];
	estimatedImpact: "LOW" | "MEDIUM" | "HIGH";
}

export interface ClinicalGuideline {
	id: string;
	title: string;
	organization: string;
	publicationDate: Date;
	version: string;
	url: string;
	relevance: number; // 0-1
	category: "CLINICAL" | "DIAGNOSTIC" | "TREATMENT" | "PREVENTIVE";
}

export class CurrencyVerificationService {
	private clinicalGuidelines: Map<string, ClinicalGuideline> = new Map();
	private citationCache: Map<string, CitationStatus> = new Map();
	private supplementDatabase: Map<string, SupplementStatus> = new Map();

	constructor() {
		this.initializeClinicalGuidelines();
		this.initializeCitationTracking();
		this.initializeSupplementDatabase();
	}

	private initializeClinicalGuidelines(): void {
		const guidelines: ClinicalGuideline[] = [
			{
				id: "nih-supplements-2024",
				title: "Dietary Supplements: What You Need to Know",
				organization: "National Institutes of Health",
				publicationDate: new Date("2024-01-15"),
				version: "2024.1",
				url: "https://ods.od.nih.gov/factsheets/list-all/",
				relevance: 0.95,
				category: "PREVENTIVE",
			},
			{
				id: "mayo-supplements-2023",
				title: "Supplements and Vitamins: What to Know",
				organization: "Mayo Clinic",
				publicationDate: new Date("2023-11-20"),
				version: "2023.2",
				url: "https://mayoclinic.org/healthy-lifestyle/nutrition-and-healthy-eating/in-depth/supplements/art-20044894",
				relevance: 0.9,
				category: "CLINICAL",
			},
		];

		guidelines.forEach((guideline) => {
			this.clinicalGuidelines.set(guideline.id, guideline);
		});
	}

	private initializeCitationTracking(): void {
		// Initialize citation tracking for common medical citations
		const citationStatuses: Array<[string, CitationStatus]> = [
			[
				"nih-cbd-001",
				{
					citationId: "nih-cbd-001",
					lastChecked: new Date("2024-01-15"),
					accessStatus: "ACCESSIBLE",
					contentMatch: true,
					linkStatus: "ACTIVE",
					doiStatus: "VALID",
				},
			],
		];

		citationStatuses.forEach(([citationId, status]) => {
			this.citationCache.set(citationId, status);
		});
	}

	private initializeSupplementDatabase(): void {
		// Initialize supplement status tracking
		const supplementStatuses: Array<[string, SupplementStatus]> = [
			[
				"cbd-oil",
				{
					supplementId: "cbd-oil",
					lastUpdated: new Date("2024-01-10"),
					status: "CURRENT",
					regulatoryStatus: "APPROVED",
					safetyAlerts: [],
					formulationChanges: [],
				},
			],
		];

		supplementStatuses.forEach(([supplementId, status]) => {
			this.supplementDatabase.set(supplementId, status);
		});
	}

	/**
	 * Main currency verification method
	 */
	async verifyBodySystemCurrency(
		bodySystem: BodySystem,
	): Promise<CurrencyVerificationResult> {
		const verificationId = `currency_verification_${bodySystem.id}_${Date.now()}`;

		// Perform different types of currency verification
		const contentFreshness = await this.verifyContentFreshness(bodySystem);
		const citationCurrency = await this.verifyCitationCurrency(bodySystem);
		const guidelineCompliance =
			await this.verifyGuidelineCompliance(bodySystem);
		const supplementCurrency = await this.verifySupplementCurrency(bodySystem);

		// Calculate overall currency score
		const overallScore = this.calculateOverallCurrency([
			contentFreshness.score,
			citationCurrency.score,
			guidelineCompliance.score,
			supplementCurrency.score,
		]);

		// Generate alerts and recommendations
		const alerts = this.generateCurrencyAlerts([
			contentFreshness,
			citationCurrency,
			guidelineCompliance,
			supplementCurrency,
		]);

		const requiredActions = this.generateRequiredActions(alerts);
		const updateRecommendations = this.generateUpdateRecommendations([
			contentFreshness,
			citationCurrency,
			guidelineCompliance,
			supplementCurrency,
		]);

		// Determine next review date based on content type and current status
		const nextReviewDate = this.calculateNextReviewDate(
			bodySystem,
			overallScore,
		);

		return {
			id: verificationId,
			contentId: bodySystem.id,
			contentType: "SYSTEM",
			verificationDate: new Date(),

			contentFreshness,
			citationCurrency,
			guidelineCompliance,
			supplementCurrency,

			overallCurrency: overallScore,
			lastUpdated: new Date(),
			nextReviewDate,

			alerts,
			requiredActions,
			updateRecommendations,
		};
	}

	private async verifyContentFreshness(
		bodySystem: BodySystem,
	): Promise<ContentFreshnessResult> {
		// This would typically check git history or database timestamps
		// For now, we'll use a mock lastModified date
		const lastModified = new Date("2024-01-01");
		const now = new Date();
		const daysSinceUpdate = Math.floor(
			(now.getTime() - lastModified.getTime()) / (1000 * 60 * 60 * 24),
		);

		const contentAge = {
			days: daysSinceUpdate,
			months: Math.floor(daysSinceUpdate / 30),
			years: Math.floor(daysSinceUpdate / 365),
		};

		// Determine freshness level based on content age and type
		let freshnessLevel: "CURRENT" | "NEEDS_REVIEW" | "OUTDATED" | "ARCHIVED" =
			"CURRENT";
		let score = 100;

		if (contentAge.years > 5) {
			freshnessLevel = "ARCHIVED";
			score = 20;
		} else if (contentAge.years > 3) {
			freshnessLevel = "OUTDATED";
			score = 40;
		} else if (contentAge.years > 1) {
			freshnessLevel = "NEEDS_REVIEW";
			score = 60;
		} else if (contentAge.months > 6) {
			freshnessLevel = "NEEDS_REVIEW";
			score = 80;
		}

		// Determine review frequency based on content type
		const reviewFrequency = this.determineReviewFrequency(
			bodySystem,
			freshnessLevel,
		);

		return {
			score,
			lastModified,
			daysSinceUpdate,
			freshnessLevel,
			contentAge,
			reviewFrequency,
		};
	}

	private async verifyCitationCurrency(
		bodySystem: BodySystem,
	): Promise<CitationCurrencyResult> {
		const verifiedCitations: VerifiedCitation[] = [];
		const outdatedCitations: OutdatedCitation[] = [];
		const brokenLinks: BrokenLink[] = [];
		const missingDOIs: MissingDOI[] = [];

		let totalScore = 0;
		let citationCount = 0;

		// Check each supplement's citations
		for (const supplement of bodySystem.relatedSupplements) {
			const citations = await this.getSupplementCitations(
				supplement.supplementId,
			);

			for (const citation of citations) {
				citationCount++;

				// Check citation currency
				const citationStatus = await this.checkCitationStatus(citation);

				if (citationStatus.isCurrent) {
					verifiedCitations.push(citationStatus.verifiedCitation!);
					totalScore += citationStatus.score;
				} else {
					outdatedCitations.push(citationStatus.outdatedCitation!);
				}

				// Check for broken links
				if (citationStatus.hasBrokenLinks) {
					brokenLinks.push(...citationStatus.brokenLinks);
				}

				// Check for missing DOIs
				if (citationStatus.missingDOI) {
					missingDOIs.push(citationStatus.missingDOI);
				}
			}
		}

		const averageScore = citationCount > 0 ? totalScore / citationCount : 100;

		return {
			score: Math.min(100, Math.max(0, averageScore)),
			verifiedCitations,
			outdatedCitations,
			brokenLinks,
			missingDOIs,
			citationAccuracy: Math.min(100, Math.max(0, averageScore)),
		};
	}

	private async verifyGuidelineCompliance(
		bodySystem: BodySystem,
	): Promise<GuidelineComplianceResult> {
		const compliantGuidelines: CompliantGuideline[] = [];
		const outdatedGuidelines: OutdatedGuideline[] = [];
		const missingGuidelines: MissingGuideline[] = [];

		let totalScore = 0;
		let guidelineCount = 0;

		// Check compliance with relevant clinical guidelines
		const relevantGuidelines = this.findRelevantGuidelines(bodySystem);

		for (const guideline of relevantGuidelines) {
			guidelineCount++;

			const compliance = await this.checkGuidelineCompliance(
				bodySystem,
				guideline,
			);

			if (compliance.isCompliant) {
				compliantGuidelines.push(compliance.compliantGuideline!);
				totalScore += compliance.score;
			} else if (compliance.isOutdated) {
				outdatedGuidelines.push(compliance.outdatedGuideline!);
			} else {
				missingGuidelines.push(compliance.missingGuideline!);
			}
		}

		const averageScore = guidelineCount > 0 ? totalScore / guidelineCount : 100;

		// Determine overall compliance level
		const complianceLevel = this.determineComplianceLevel(
			averageScore,
			outdatedGuidelines.length,
			missingGuidelines.length,
		);

		return {
			score: Math.min(100, Math.max(0, averageScore)),
			compliantGuidelines,
			outdatedGuidelines,
			missingGuidelines,
			complianceLevel,
		};
	}

	private async verifySupplementCurrency(
		bodySystem: BodySystem,
	): Promise<SupplementCurrencyResult> {
		const currentInformation: CurrentSupplementInfo[] = [];
		const discontinuedProducts: DiscontinuedProduct[] = [];
		const formulationChanges: FormulationChange[] = [];
		const regulatoryUpdates: RegulatoryUpdate[] = [];
		const safetyAlerts: SafetyAlert[] = [];

		let totalScore = 0;
		let supplementCount = 0;

		// Check currency for each supplement in the body system
		for (const supplement of bodySystem.relatedSupplements) {
			supplementCount++;

			const supplementStatus = this.supplementDatabase.get(
				supplement.supplementId,
			);

			if (supplementStatus) {
				const currencyInfo = await this.checkSupplementCurrency(
					supplement,
					supplementStatus,
				);

				if (currencyInfo.isCurrent) {
					currentInformation.push(currencyInfo.currentInfo!);
					totalScore += currencyInfo.score;
				}

				// Add any alerts or changes
				discontinuedProducts.push(...currencyInfo.discontinuedProducts);
				formulationChanges.push(...currencyInfo.formulationChanges);
				regulatoryUpdates.push(...currencyInfo.regulatoryUpdates);
				safetyAlerts.push(...currencyInfo.safetyAlerts);
			}
		}

		const averageScore =
			supplementCount > 0 ? totalScore / supplementCount : 100;

		return {
			score: Math.min(100, Math.max(0, averageScore)),
			currentInformation,
			discontinuedProducts,
			formulationChanges,
			regulatoryUpdates,
			safetyAlerts,
		};
	}

	private determineReviewFrequency(
		bodySystem: BodySystem,
		freshnessLevel: string,
	): "DAILY" | "WEEKLY" | "MONTHLY" | "QUARTERLY" | "ANNUALLY" | "BIANNUALLY" {
		// Determine review frequency based on content type and current status
		switch (bodySystem.id) {
			case "endocannabinoid":
				return freshnessLevel === "CURRENT" ? "QUARTERLY" : "MONTHLY";
			case "cardiovascular":
			case "immune":
				return freshnessLevel === "CURRENT" ? "BIANNUALLY" : "QUARTERLY";
			default:
				return freshnessLevel === "CURRENT" ? "ANNUALLY" : "BIANNUALLY";
		}
	}

	private async getSupplementCitations(
		supplementId: string,
	): Promise<MedicalCitation[]> {
		// This would typically query a citation database
		// For now, return mock citations
		return [
			{
				id: `${supplementId}-001`,
				title: `Research on ${supplementId} effects`,
				authors: ["Research Team"],
				journal: "Medical Journal",
				year: 2022,
				doi: `10.1234/${supplementId}.2022.001`,
				evidenceLevel: "META_ANALYSIS",
				relevanceScore: 0.8,
			},
		];
	}

	private async checkCitationStatus(
		citation: MedicalCitation,
	): Promise<CitationStatus> {
		const citationId = citation.id;
		const cachedStatus = this.citationCache.get(citationId);

		if (cachedStatus && this.isCitationCacheCurrent(cachedStatus.lastChecked)) {
			return this.convertCachedStatusToResult(cachedStatus);
		}

		// Perform fresh citation check
		const freshStatus = await this.performCitationCheck(citation);

		// Update cache
		this.citationCache.set(citationId, freshStatus);

		return this.convertCachedStatusToResult(freshStatus);
	}

	private async performCitationCheck(
		citation: MedicalCitation,
	): Promise<CitationStatus> {
		// This would typically:
		// 1. Check DOI resolution
		// 2. Verify URL accessibility
		// 3. Validate content match
		// 4. Check publication status

		const now = new Date();
		const citationAge = now.getFullYear() - citation.year;

		return {
			citationId: citation.id,
			lastChecked: now,
			accessStatus: citationAge > 5 ? "RESTRICTED" : "ACCESSIBLE",
			contentMatch: true,
			linkStatus: "ACTIVE",
			doiStatus: citation.doi ? "VALID" : "MISSING",
		};
	}

	private isCitationCacheCurrent(lastChecked: Date): boolean {
		const oneWeekAgo = new Date();
		oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

		return lastChecked >= oneWeekAgo;
	}

	private convertCachedStatusToResult(
		cachedStatus: CitationStatus,
	): CitationStatus {
		// Convert cached status to the format expected by the caller
		return cachedStatus;
	}

	private findRelevantGuidelines(bodySystem: BodySystem): ClinicalGuideline[] {
		// Find clinical guidelines relevant to this body system
		const relevantGuidelines: ClinicalGuideline[] = [];

		for (const guideline of this.clinicalGuidelines.values()) {
			if (this.isGuidelineRelevant(bodySystem, guideline)) {
				relevantGuidelines.push(guideline);
			}
		}

		return relevantGuidelines;
	}

	private isGuidelineRelevant(
		bodySystem: BodySystem,
		guideline: ClinicalGuideline,
	): boolean {
		// Check if guideline is relevant based on body system content
		const bodySystemText =
			`${bodySystem.name} ${bodySystem.description}`.toLowerCase();
		const guidelineText =
			`${guideline.title} ${guideline.organization}`.toLowerCase();

		// Simple relevance check - in reality would be more sophisticated
		return (
			bodySystemText.includes("supplement") ||
			guidelineText.includes("supplement")
		);
	}

	private async checkGuidelineCompliance(
		bodySystem: BodySystem,
		guideline: ClinicalGuideline,
	): Promise<GuidelineCompliance> {
		// Check if body system content complies with clinical guideline
		const complianceCheck = await this.performComplianceCheck(
			bodySystem,
			guideline,
		);

		if (complianceCheck.isCompliant) {
			return {
				isCompliant: true,
				compliantGuideline: {
					guideline,
					compliance: complianceCheck.complianceLevel!,
					lastChecked: new Date(),
					nextReview: this.calculateNextGuidelineReview(guideline),
				},
			};
		}
		if (complianceCheck.isOutdated) {
			return {
				isOutdated: true,
				outdatedGuideline: {
					guideline,
					currentVersion: "older",
					availableVersion: guideline.version,
					updateDate: guideline.publicationDate,
					impact: complianceCheck.impactLevel!,
				},
			};
		}
		return {
			isMissing: true,
			missingGuideline: {
				topic: bodySystem.name,
				relevantGuidelines: [guideline],
				priority: "MEDIUM",
				rationale: "Body system content should reference this guideline",
			},
		};
	}

	private async performComplianceCheck(
		bodySystem: BodySystem,
		guideline: ClinicalGuideline,
	): Promise<ComplianceCheck> {
		// This would typically:
		// 1. Compare content against guideline recommendations
		// 2. Check version compatibility
		// 3. Verify implementation of guideline requirements

		// Mock compliance check
		const isCurrent = guideline.publicationDate.getFullYear() >= 2022;
		const complianceLevel = isCurrent ? "FULL" : "PARTIAL";
		const impactLevel = isCurrent ? "LOW" : "MEDIUM";

		return {
			isCompliant: isCurrent,
			complianceLevel,
			isOutdated: !isCurrent,
			impactLevel,
		};
	}

	private calculateNextGuidelineReview(guideline: ClinicalGuideline): Date {
		const nextReview = new Date(guideline.publicationDate);

		// Guidelines typically need review every 1-2 years
		nextReview.setFullYear(nextReview.getFullYear() + 1);

		return nextReview;
	}

	private async checkSupplementCurrency(
		supplement: RelatedSupplement,
		status: SupplementStatus,
	): Promise<SupplementCurrencyCheck> {
		const now = new Date();
		const daysSinceUpdate = Math.floor(
			(now.getTime() - status.lastUpdated.getTime()) / (1000 * 60 * 60 * 24),
		);

		const isCurrent = daysSinceUpdate < 180; // 6 months
		const score = isCurrent
			? 100
			: Math.max(0, 100 - (daysSinceUpdate - 180) / 3.65); // Gradual score reduction

		if (isCurrent) {
			return {
				isCurrent: true,
				currentInfo: {
					supplementId: supplement.supplementId,
					lastUpdated: status.lastUpdated,
					informationStatus: "CURRENT",
					confidence: 0.9,
					sources: [],
				},
			};
		}
		return {
			isCurrent: false,
			discontinuedProducts: status.discontinuedProducts || [],
			formulationChanges: status.formulationChanges || [],
			regulatoryUpdates: status.regulatoryUpdates || [],
			safetyAlerts: status.safetyAlerts || [],
		};
	}

	private calculateOverallCurrency(scores: number[]): number {
		if (scores.length === 0) return 0;
		return Math.round(
			scores.reduce((sum, score) => sum + score, 0) / scores.length,
		);
	}

	private calculateNextReviewDate(
		bodySystem: BodySystem,
		overallScore: number,
	): Date {
		const baseDate = new Date();

		// Adjust review frequency based on score and content type
		let monthsToAdd = 12; // Default: annual review

		if (overallScore < 50) {
			monthsToAdd = 3; // Quarterly review for low-scoring content
		} else if (overallScore < 70) {
			monthsToAdd = 6; // Bi-annual review for medium-scoring content
		} else if (
			bodySystem.id === "endocannabinoid" ||
			bodySystem.id === "immune"
		) {
			monthsToAdd = 6; // More frequent review for rapidly evolving fields
		}

		baseDate.setMonth(baseDate.getMonth() + monthsToAdd);
		return baseDate;
	}

	private generateCurrencyAlerts(verificationResults: any[]): CurrencyAlert[] {
		const alerts: CurrencyAlert[] = [];

		verificationResults.forEach((result) => {
			// Generate alerts for outdated content
			if (
				result.freshnessLevel === "OUTDATED" ||
				result.freshnessLevel === "ARCHIVED"
			) {
				alerts.push({
					type: "OUTDATED_CONTENT",
					severity: "WARNING",
					message: `Content freshness level: ${result.freshnessLevel}`,
					affectedContent: result.contentId || "Unknown",
					action: "Review and update content",
				});
			}

			// Generate alerts for broken citations
			if (result.brokenLinks?.length > 0) {
				alerts.push({
					type: "BROKEN_CITATION",
					severity: "ERROR",
					message: `${result.brokenLinks.length} broken citation links found`,
					affectedContent: result.contentId || "Unknown",
					action: "Fix or replace broken links",
				});
			}

			// Generate alerts for safety concerns
			if (result.safetyAlerts?.length > 0) {
				result.safetyAlerts.forEach((alert: SafetyAlert) => {
					alerts.push({
						type: "SAFETY_CONCERN",
						severity: alert.severity === "CRITICAL" ? "CRITICAL" : "WARNING",
						message: alert.title,
						affectedContent: alert.supplementId,
						action: alert.action,
						deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
					});
				});
			}
		});

		return alerts;
	}

	private generateRequiredActions(alerts: CurrencyAlert[]): RequiredAction[] {
		const actions: RequiredAction[] = [];

		alerts.forEach((alert) => {
			const dueDate =
				alert.deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days default

			let priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" = "MEDIUM";
			if (alert.severity === "CRITICAL") priority = "CRITICAL";
			else if (alert.severity === "ERROR") priority = "HIGH";

			actions.push({
				type: this.mapAlertTypeToActionType(alert.type),
				priority,
				description: alert.action,
				estimatedEffort: this.estimateActionEffort(alert.type),
				dueDate,
			});
		});

		return actions;
	}

	private generateUpdateRecommendations(
		verificationResults: any[],
	): UpdateRecommendation[] {
		const recommendations: UpdateRecommendation[] = [];

		verificationResults.forEach((result) => {
			if (result.outdatedCitations?.length > 0) {
				recommendations.push({
					type: "CITATION_UPDATE",
					priority: "HIGH",
					title: "Update Citations",
					description: `${result.outdatedCitations.length} citations need updating`,
					rationale: "Outdated citations reduce content credibility",
					resources: ["PubMed", "Google Scholar", "NIH Library"],
					estimatedImpact: "HIGH",
				});
			}

			if (result.outdatedGuidelines?.length > 0) {
				recommendations.push({
					type: "GUIDELINE_REVIEW",
					priority: "MEDIUM",
					title: "Review Clinical Guidelines",
					description: "Update content to reflect current clinical guidelines",
					rationale: "Clinical guidelines ensure evidence-based content",
					resources: ["ClinicalTrials.gov", "Cochrane Library"],
					estimatedImpact: "MEDIUM",
				});
			}
		});

		return recommendations;
	}

	private mapAlertTypeToActionType(alertType: string): RequiredAction["type"] {
		switch (alertType) {
			case "OUTDATED_CONTENT":
				return "UPDATE_CONTENT";
			case "BROKEN_CITATION":
				return "FIX_CITATION";
			case "GUIDELINE_UPDATE":
				return "REVIEW_GUIDELINE";
			case "REGULATORY_CHANGE":
				return "CHECK_REGULATION";
			case "SAFETY_CONCERN":
				return "ASSESS_SAFETY";
			default:
				return "UPDATE_CONTENT";
		}
	}

	private estimateActionEffort(alertType: string): number {
		switch (alertType) {
			case "OUTDATED_CONTENT":
				return 60; // 1 hour
			case "BROKEN_CITATION":
				return 30; // 30 minutes
			case "GUIDELINE_UPDATE":
				return 90; // 1.5 hours
			case "REGULATORY_CHANGE":
				return 45; // 45 minutes
			case "SAFETY_CONCERN":
				return 120; // 2 hours
			default:
				return 60;
		}
	}

	private determineComplianceLevel(
		score: number,
		outdatedCount: number,
		missingCount: number,
	): "EXCELLENT" | "GOOD" | "FAIR" | "POOR" | "NON_COMPLIANT" {
		if (score >= 90 && outdatedCount === 0 && missingCount === 0)
			return "EXCELLENT";
		if (score >= 80 && outdatedCount <= 1 && missingCount <= 1) return "GOOD";
		if (score >= 70 && outdatedCount <= 2 && missingCount <= 2) return "FAIR";
		if (score >= 50) return "POOR";
		return "NON_COMPLIANT";
	}

	// Public methods for external access
	async verifyMultipleBodySystems(
		bodySystems: BodySystem[],
	): Promise<CurrencyVerificationResult[]> {
		const results: CurrencyVerificationResult[] = [];

		for (const system of bodySystems) {
			const result = await this.verifyBodySystemCurrency(system);
			results.push(result);
		}

		return results;
	}

	async checkCitationLink(citationId: string): Promise<boolean> {
		const citationStatus = this.citationCache.get(citationId);
		return citationStatus?.linkStatus === "ACTIVE";
	}

	getClinicalGuidelines(): ClinicalGuideline[] {
		return Array.from(this.clinicalGuidelines.values());
	}

	async updateSupplementStatus(
		supplementId: string,
		status: Partial<SupplementStatus>,
	): Promise<void> {
		const currentStatus = this.supplementDatabase.get(supplementId);
		if (currentStatus) {
			Object.assign(currentStatus, status, { lastUpdated: new Date() });
		}
	}
}

// Supporting interfaces
interface CitationStatus {
	citationId: string;
	lastChecked: Date;
	accessStatus: "ACCESSIBLE" | "RESTRICTED" | "UNAVAILABLE";
	contentMatch: boolean;
	linkStatus: "ACTIVE" | "BROKEN" | "UNKNOWN";
	doiStatus: "VALID" | "INVALID" | "MISSING";
}

interface SupplementStatus {
	supplementId: string;
	lastUpdated: Date;
	status: "CURRENT" | "NEEDS_UPDATE" | "DISCONTINUED";
	regulatoryStatus: "APPROVED" | "RESTRICTED" | "WITHDRAWN";
	safetyAlerts: SafetyAlert[];
	formulationChanges: FormulationChange[];
	discontinuedProducts?: DiscontinuedProduct[];
	regulatoryUpdates?: RegulatoryUpdate[];
}

interface GuidelineCompliance {
	isCompliant?: true;
	compliantGuideline?: CompliantGuideline;
	isOutdated?: true;
	outdatedGuideline?: OutdatedGuideline;
	isMissing?: true;
	missingGuideline?: MissingGuideline;
}

interface ComplianceCheck {
	isCompliant?: boolean;
	complianceLevel?: "FULL" | "PARTIAL" | "MINIMAL";
	isOutdated?: boolean;
	impactLevel?: "LOW" | "MEDIUM" | "HIGH";
}

interface SupplementCurrencyCheck {
	isCurrent?: true;
	currentInfo?: CurrentSupplementInfo;
	isCurrent?: false;
	discontinuedProducts?: DiscontinuedProduct[];
	formulationChanges?: FormulationChange[];
	regulatoryUpdates?: RegulatoryUpdate[];
	safetyAlerts?: SafetyAlert[];
}

// Export singleton instance
export const currencyVerificationService = new CurrencyVerificationService();
