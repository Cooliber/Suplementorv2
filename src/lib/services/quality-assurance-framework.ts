"use client";

/**
 * Quality Assurance Framework for Medical Content
 * Provides content review workflows, version control, compliance monitoring,
 * and automated quality gates for medical information standards
 */

import type { BodySystem } from "@/data/body-systems";
import {
	type CurrencyVerificationResult,
	currencyVerificationService,
} from "./currency-verification-service";
import {
	type MedicalValidationResult,
	enhancedMedicalValidationService,
} from "./enhanced-medical-validation";
import {
	ValidationAuditResult,
	enhancedValidationTools,
} from "./enhanced-validation-tools";

export interface QualityAssuranceWorkflow {
	id: string;
	name: string;
	description: string;
	type:
		| "CONTENT_REVIEW"
		| "MEDICAL_REVIEW"
		| "CURRENCY_REVIEW"
		| "COMPLIANCE_REVIEW";

	// Workflow configuration
	steps: WorkflowStep[];
	triggers: WorkflowTrigger[];
	reviewers: Reviewer[];
	qualityGates: QualityGate[];

	// Status and tracking
	status: "ACTIVE" | "INACTIVE" | "UNDER_REVIEW";
	createdDate: Date;
	lastModified: Date;
	version: string;
}

export interface WorkflowStep {
	id: string;
	name: string;
	type:
		| "AUTOMATED_VALIDATION"
		| "MANUAL_REVIEW"
		| "EXPERT_REVIEW"
		| "APPROVAL"
		| "PUBLICATION";
	order: number;
	required: boolean;

	// Step configuration
	assignedTo?: string;
	estimatedDuration: number; // minutes
	instructions: string;
	criteria: string[];

	// Automation settings
	automationConfig?: {
		validationType: "MEDICAL" | "CURRENCY" | "CITATION" | "FULL";
		threshold: number; // minimum score to pass
		autoApprove: boolean;
	};
}

export interface WorkflowTrigger {
	type:
		| "SCHEDULED"
		| "CONTENT_CHANGE"
		| "MANUAL"
		| "QUALITY_DECLINE"
		| "REGULATORY_UPDATE";
	condition: string;
	frequency?: "DAILY" | "WEEKLY" | "MONTHLY" | "QUARTERLY";
	schedule?: string; // cron expression
}

export interface Reviewer {
	id: string;
	name: string;
	email: string;
	role:
		| "CONTENT_REVIEWER"
		| "MEDICAL_EXPERT"
		| "COMPLIANCE_OFFICER"
		| "SENIOR_REVIEWER";
	expertise: string[];
	availability: "AVAILABLE" | "BUSY" | "UNAVAILABLE";
	workload: number; // current number of reviews assigned
	maxWorkload: number;
}

export interface QualityGate {
	id: string;
	name: string;
	type:
		| "MEDICAL_ACCURACY"
		| "CURRENCY"
		| "CITATION_QUALITY"
		| "COMPLIANCE"
		| "OVERALL_QUALITY";
	threshold: number; // minimum score to pass (0-100)
	action: "APPROVE" | "REJECT" | "REVIEW_REQUIRED" | "EXPERT_REVIEW";
	severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
}

export interface ContentVersion {
	id: string;
	contentId: string;
	version: string;
	content: any; // The actual content
	changes: ContentChange[];
	author: string;
	timestamp: Date;
	validationResults: {
		medical?: MedicalValidationResult;
		currency?: CurrencyVerificationResult;
	};
	status: "DRAFT" | "UNDER_REVIEW" | "APPROVED" | "PUBLISHED" | "ARCHIVED";
	reviewHistory: ReviewRecord[];
}

export interface ContentChange {
	type: "CREATION" | "MODIFICATION" | "DELETION";
	field: string;
	oldValue?: string;
	newValue?: string;
	reason: string;
	author: string;
	timestamp: Date;
}

export interface ReviewRecord {
	id: string;
	reviewerId: string;
	reviewerName: string;
	reviewDate: Date;
	decision: "APPROVE" | "REJECT" | "REQUEST_CHANGES";
	comments: string;
	score?: number;
	issues?: string[];
	suggestions?: string[];
}

export interface ComplianceStandard {
	id: string;
	name: string;
	organization: string;
	version: string;
	effectiveDate: Date;
	requirements: ComplianceRequirement[];
	status: "ACTIVE" | "SUPERSEDED" | "WITHDRAWN";
}

export interface ComplianceRequirement {
	id: string;
	category:
		| "ACCURACY"
		| "CURRENCY"
		| "CITATION"
		| "DISCLAIMER"
		| "EVIDENCE"
		| "ACCESSIBILITY";
	description: string;
	mandatory: boolean;
	verificationMethod: "AUTOMATED" | "MANUAL" | "EXPERT_REVIEW";
	threshold?: number;
}

export interface ComplianceReport {
	id: string;
	standardId: string;
	contentId: string;
	evaluationDate: Date;
	complianceScore: number; // 0-100
	requirements: ComplianceRequirementResult[];
	overallStatus: "COMPLIANT" | "NON_COMPLIANT" | "PARTIALLY_COMPLIANT";
	issues: ComplianceIssue[];
	nextEvaluationDate: Date;
}

export interface ComplianceRequirementResult {
	requirement: ComplianceRequirement;
	status: "COMPLIANT" | "NON_COMPLIANT" | "NOT_APPLICABLE";
	score: number;
	evidence: string;
	notes?: string;
}

export interface ComplianceIssue {
	requirementId: string;
	severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
	description: string;
	remediation: string;
	deadline?: Date;
}

export interface QualityMetrics {
	id: string;
	period: {
		startDate: Date;
		endDate: Date;
	};

	// Content metrics
	totalContentItems: number;
	newContentItems: number;
	updatedContentItems: number;
	archivedContentItems: number;

	// Quality metrics
	averageMedicalAccuracy: number;
	averageCurrencyScore: number;
	averageCitationQuality: number;
	overallQualityTrend: "IMPROVING" | "DECLINING" | "STABLE";

	// Review metrics
	totalReviews: number;
	averageReviewTime: number; // hours
	approvalRate: number; // percentage
	expertReviewRate: number; // percentage

	// Issue metrics
	criticalIssuesResolved: number;
	averageResolutionTime: number; // hours
	recurringIssues: RecurringIssue[];
}

export interface RecurringIssue {
	type: string;
	frequency: number; // how often it occurs
	averageResolutionTime: number;
	commonCauses: string[];
	preventionStrategies: string[];
}

export class QualityAssuranceFramework {
	private workflows: Map<string, QualityAssuranceWorkflow> = new Map();
	private contentVersions: Map<string, ContentVersion[]> = new Map();
	private complianceStandards: Map<string, ComplianceStandard> = new Map();
	private qualityMetrics: Map<string, QualityMetrics> = new Map();
	private activeReviews: Map<string, ActiveReview> = new Map();

	constructor() {
		this.initializeDefaultWorkflows();
		this.initializeComplianceStandards();
	}

	private initializeDefaultWorkflows(): void {
		// Create default quality assurance workflows
		const defaultWorkflows: QualityAssuranceWorkflow[] = [
			{
				id: "medical-content-review",
				name: "Medical Content Review Workflow",
				description:
					"Standard workflow for reviewing medical content accuracy and compliance",
				type: "MEDICAL_REVIEW",
				steps: [
					{
						id: "automated-validation",
						name: "Automated Validation",
						type: "AUTOMATED_VALIDATION",
						order: 1,
						required: true,
						estimatedDuration: 5,
						instructions: "Perform automated medical and currency validation",
						criteria: ["Medical accuracy score >= 80", "Currency score >= 70"],
						automationConfig: {
							validationType: "FULL",
							threshold: 75,
							autoApprove: false,
						},
					},
					{
						id: "expert-review",
						name: "Medical Expert Review",
						type: "EXPERT_REVIEW",
						order: 2,
						required: true,
						estimatedDuration: 30,
						instructions:
							"Review content for medical accuracy and clinical relevance",
						criteria: [
							"No factual errors",
							"Evidence-based claims",
							"Clear explanations",
						],
					},
					{
						id: "final-approval",
						name: "Final Approval",
						type: "APPROVAL",
						order: 3,
						required: true,
						estimatedDuration: 10,
						instructions: "Final review and approval for publication",
						criteria: [
							"All issues resolved",
							"Standards compliant",
							"Ready for publication",
						],
					},
				],
				triggers: [
					{
						type: "CONTENT_CHANGE",
						condition: "Content modified or new content created",
					},
					{
						type: "SCHEDULED",
						frequency: "MONTHLY",
						condition: "Regular quality review",
					},
				],
				reviewers: [],
				qualityGates: [
					{
						id: "medical-accuracy-gate",
						name: "Medical Accuracy Gate",
						type: "MEDICAL_ACCURACY",
						threshold: 80,
						action: "REVIEW_REQUIRED",
						severity: "HIGH",
					},
					{
						id: "currency-gate",
						name: "Content Currency Gate",
						type: "CURRENCY",
						threshold: 70,
						action: "REVIEW_REQUIRED",
						severity: "MEDIUM",
					},
				],
				status: "ACTIVE",
				createdDate: new Date(),
				lastModified: new Date(),
				version: "1.0",
			},
		];

		defaultWorkflows.forEach((workflow) => {
			this.workflows.set(workflow.id, workflow);
		});
	}

	private initializeComplianceStandards(): void {
		// Initialize medical information compliance standards
		const standards: ComplianceStandard[] = [
			{
				id: "medical-accuracy-standard",
				name: "Medical Information Accuracy Standard",
				organization: "Suplementor Medical Board",
				version: "1.0",
				effectiveDate: new Date("2024-01-01"),
				requirements: [
					{
						id: "evidence-based-claims",
						category: "EVIDENCE",
						description: "All medical claims must be supported by evidence",
						mandatory: true,
						verificationMethod: "AUTOMATED",
						threshold: 80,
					},
					{
						id: "current-information",
						category: "CURRENCY",
						description: "Information must be current within 5 years",
						mandatory: true,
						verificationMethod: "AUTOMATED",
						threshold: 70,
					},
					{
						id: "citation-requirements",
						category: "CITATION",
						description: "All claims must have proper citations",
						mandatory: true,
						verificationMethod: "AUTOMATED",
					},
				],
				status: "ACTIVE",
			},
		];

		standards.forEach((standard) => {
			this.complianceStandards.set(standard.id, standard);
		});
	}

	/**
	 * Execute quality assurance workflow
	 */
	async executeWorkflow(
		workflowId: string,
		contentId: string,
		content: BodySystem,
		initiatedBy: string,
	): Promise<WorkflowExecution> {
		const workflow = this.workflows.get(workflowId);
		if (!workflow) {
			throw new Error(`Workflow ${workflowId} not found`);
		}

		const executionId = `execution_${workflowId}_${contentId}_${Date.now()}`;

		const execution: WorkflowExecution = {
			id: executionId,
			workflowId,
			contentId,
			initiatedBy,
			startTime: new Date(),
			currentStep: 0,
			status: "IN_PROGRESS",
			results: [],
			issues: [],
		};

		try {
			// Execute each step in the workflow
			for (let i = 0; i < workflow.steps.length; i++) {
				const step = workflow.steps[i];
				execution.currentStep = i;

				const stepResult = await this.executeWorkflowStep(
					workflow,
					step,
					content,
					execution,
				);
				execution.results.push(stepResult);

				// Check if step passed quality gates
				const qualityGateCheck = await this.checkQualityGates(
					workflow.qualityGates,
					stepResult,
				);
				if (!qualityGateCheck.passed) {
					execution.status = "BLOCKED";
					execution.issues.push({
						type: "QUALITY_GATE_FAILURE",
						step: step.id,
						message: `Failed quality gate: ${qualityGateCheck.failedGates.join(", ")}`,
						severity: "HIGH",
					});
					break;
				}

				// Check if this step requires manual intervention
				if (step.type === "MANUAL_REVIEW" || step.type === "EXPERT_REVIEW") {
					execution.status = "WAITING_FOR_REVIEW";
					this.activeReviews.set(executionId, {
						executionId,
						stepId: step.id,
						assignedTo: step.assignedTo,
						dueDate: new Date(Date.now() + step.estimatedDuration * 60 * 1000),
						priority: "MEDIUM",
					});
					break;
				}
			}

			if (execution.status === "IN_PROGRESS") {
				execution.status = "COMPLETED";
				execution.endTime = new Date();
			}
		} catch (error) {
			execution.status = "FAILED";
			execution.error =
				error instanceof Error ? error.message : "Unknown error";
			execution.endTime = new Date();
		}

		return execution;
	}

	private async executeWorkflowStep(
		workflow: QualityAssuranceWorkflow,
		step: WorkflowStep,
		content: BodySystem,
		execution: WorkflowExecution,
	): Promise<WorkflowStepResult> {
		const startTime = new Date();

		switch (step.type) {
			case "AUTOMATED_VALIDATION":
				return await this.executeAutomatedValidation(step, content);

			case "MANUAL_REVIEW":
				return await this.initiateManualReview(step, content, execution);

			case "EXPERT_REVIEW":
				return await this.initiateExpertReview(step, content, execution);

			case "APPROVAL":
				return await this.performFinalApproval(step, content, execution);

			default:
				throw new Error(`Unsupported step type: ${step.type}`);
		}
	}

	private async executeAutomatedValidation(
		step: WorkflowStep,
		content: BodySystem,
	): Promise<WorkflowStepResult> {
		const config = step.automationConfig!;

		let medicalResult: MedicalValidationResult | undefined;
		let currencyResult: CurrencyVerificationResult | undefined;

		if (
			config.validationType === "FULL" ||
			config.validationType === "MEDICAL"
		) {
			medicalResult =
				await enhancedMedicalValidationService.validateBodySystemMedicalAccuracy(
					content,
				);
		}

		if (
			config.validationType === "FULL" ||
			config.validationType === "CURRENCY"
		) {
			currencyResult =
				await currencyVerificationService.verifyBodySystemCurrency(content);
		}

		const overallScore = this.calculateOverallValidationScore(
			medicalResult,
			currencyResult,
		);

		return {
			stepId: step.id,
			startTime: new Date(),
			endTime: new Date(),
			status: overallScore >= config.threshold ? "PASSED" : "FAILED",
			score: overallScore,
			details: {
				medicalValidation: medicalResult,
				currencyVerification: currencyResult,
			},
			autoApproved: config.autoApprove && overallScore >= config.threshold,
		};
	}

	private async initiateManualReview(
		step: WorkflowStep,
		content: BodySystem,
		execution: WorkflowExecution,
	): Promise<WorkflowStepResult> {
		// Assign reviewer and create review task
		const reviewer = await this.assignReviewer(step);

		return {
			stepId: step.id,
			startTime: new Date(),
			status: "WAITING_FOR_REVIEW",
			assignedTo: reviewer.id,
			dueDate: new Date(Date.now() + step.estimatedDuration * 60 * 1000),
			instructions: step.instructions,
		};
	}

	private async initiateExpertReview(
		step: WorkflowStep,
		content: BodySystem,
		execution: WorkflowExecution,
	): Promise<WorkflowStepResult> {
		// Find available expert reviewer
		const expert = await this.findExpertReviewer(step);

		return {
			stepId: step.id,
			startTime: new Date(),
			status: "WAITING_FOR_REVIEW",
			assignedTo: expert.id,
			dueDate: new Date(Date.now() + step.estimatedDuration * 60 * 1000),
			instructions: step.instructions,
			requiresExpertise: expert.expertise,
		};
	}

	private async performFinalApproval(
		step: WorkflowStep,
		content: BodySystem,
		execution: WorkflowExecution,
	): Promise<WorkflowStepResult> {
		// Check if all previous steps passed
		const allStepsPassed = execution.results.every(
			(result) => result.status === "PASSED",
		);

		if (allStepsPassed) {
			// Create new content version
			await this.createContentVersion(content, execution);

			return {
				stepId: step.id,
				startTime: new Date(),
				endTime: new Date(),
				status: "PASSED",
				approved: true,
				version: await this.generateNextVersion(content.id),
			};
		}
		return {
			stepId: step.id,
			startTime: new Date(),
			endTime: new Date(),
			status: "FAILED",
			issues: ["Previous steps did not pass quality gates"],
		};
	}

	private async checkQualityGates(
		qualityGates: QualityGate[],
		stepResult: WorkflowStepResult,
	): Promise<QualityGateCheck> {
		const failedGates: string[] = [];

		for (const gate of qualityGates) {
			let gateScore = 0;

			// Get score based on gate type
			switch (gate.type) {
				case "MEDICAL_ACCURACY":
					gateScore =
						stepResult.details?.medicalValidation?.overallMedicalAccuracy || 0;
					break;
				case "CURRENCY":
					gateScore =
						stepResult.details?.currencyVerification?.overallCurrency || 0;
					break;
				case "CITATION_QUALITY":
					gateScore = stepResult.details?.citationQuality || 0;
					break;
				case "OVERALL_QUALITY":
					gateScore = stepResult.score || 0;
					break;
			}

			if (gateScore < gate.threshold) {
				failedGates.push(gate.name);
			}
		}

		return {
			passed: failedGates.length === 0,
			failedGates,
			score: stepResult.score || 0,
		};
	}

	private calculateOverallValidationScore(
		medicalResult?: MedicalValidationResult,
		currencyResult?: CurrencyVerificationResult,
	): number {
		const scores: number[] = [];

		if (medicalResult) scores.push(medicalResult.overallMedicalAccuracy);
		if (currencyResult) scores.push(currencyResult.overallCurrency);

		if (scores.length === 0) return 0;
		return Math.round(
			scores.reduce((sum, score) => sum + score, 0) / scores.length,
		);
	}

	private async assignReviewer(step: WorkflowStep): Promise<Reviewer> {
		// Find available reviewer based on step requirements
		const availableReviewers = await this.getAvailableReviewers();

		if (availableReviewers.length === 0) {
			throw new Error("No available reviewers");
		}

		// Simple assignment - in reality would use more sophisticated logic
		return availableReviewers[0];
	}

	private async findExpertReviewer(step: WorkflowStep): Promise<Reviewer> {
		// Find reviewer with specific expertise
		const experts = await this.getExpertReviewers();

		if (experts.length === 0) {
			throw new Error("No expert reviewers available");
		}

		return experts[0];
	}

	private async getAvailableReviewers(): Promise<Reviewer[]> {
		// Mock reviewers - in reality would query database
		return [
			{
				id: "reviewer-1",
				name: "Dr. Maria Kowalski",
				email: "maria.kowalski@suplementor.com",
				role: "CONTENT_REVIEWER",
				expertise: ["General Medicine", "Nutrition"],
				availability: "AVAILABLE",
				workload: 2,
				maxWorkload: 5,
			},
		];
	}

	private async getExpertReviewers(): Promise<Reviewer[]> {
		// Mock expert reviewers
		return [
			{
				id: "expert-1",
				name: "Prof. Andrzej Nowak",
				email: "andrzej.nowak@suplementor.com",
				role: "SENIOR_REVIEWER",
				expertise: ["Endocrinology", "Neurology", "Clinical Research"],
				availability: "AVAILABLE",
				workload: 1,
				maxWorkload: 3,
			},
		];
	}

	private async createContentVersion(
		content: BodySystem,
		execution: WorkflowExecution,
	): Promise<string> {
		const versionId = `version_${content.id}_${Date.now()}`;
		const newVersion: ContentVersion = {
			id: versionId,
			contentId: content.id,
			version: await this.generateNextVersion(content.id),
			content,
			changes: [
				{
					type: "MODIFICATION",
					field: "content",
					oldValue: "previous_version",
					newValue: "current_version",
					reason: "Quality assurance review",
					author: execution.initiatedBy,
					timestamp: new Date(),
				},
			],
			author: execution.initiatedBy,
			timestamp: new Date(),
			validationResults: {
				medical: execution.results.find((r) => r.details?.medicalValidation)
					?.details?.medicalValidation,
				currency: execution.results.find((r) => r.details?.currencyVerification)
					?.details?.currencyVerification,
			},
			status: "APPROVED",
			reviewHistory: [],
		};

		if (!this.contentVersions.has(content.id)) {
			this.contentVersions.set(content.id, []);
		}

		this.contentVersions.get(content.id)?.push(newVersion);
		return versionId;
	}

	private async generateNextVersion(contentId: string): Promise<string> {
		const versions = this.contentVersions.get(contentId) || [];
		const latestVersion = versions[versions.length - 1];

		if (!latestVersion) return "1.0.0";

		const [major, minor, patch] = latestVersion.version.split(".").map(Number);
		return `${major}.${minor}.${patch + 1}`;
	}

	/**
	 * Content version control
	 */
	async getContentVersionHistory(contentId: string): Promise<ContentVersion[]> {
		return this.contentVersions.get(contentId) || [];
	}

	async compareContentVersions(
		contentId: string,
		version1: string,
		version2: string,
	): Promise<VersionComparison> {
		const versions = this.contentVersions.get(contentId) || [];
		const v1 = versions.find((v) => v.version === version1);
		const v2 = versions.find((v) => v.version === version2);

		if (!v1 || !v2) {
			throw new Error("One or both versions not found");
		}

		return {
			version1: v1.version,
			version2: v2.version,
			changes: this.compareContentObjects(v1.content, v2.content),
			validationScoreChange: {
				medical:
					v2.validationResults.medical?.overallMedicalAccuracy ||
					0 - (v1.validationResults.medical?.overallMedicalAccuracy || 0),
				currency:
					v2.validationResults.currency?.overallCurrency ||
					0 - (v1.validationResults.currency?.overallCurrency || 0),
			},
		};
	}

	private compareContentObjects(obj1: any, obj2: any): ContentChange[] {
		const changes: ContentChange[] = [];

		// Simple comparison - in reality would be more sophisticated
		if (JSON.stringify(obj1) !== JSON.stringify(obj2)) {
			changes.push({
				type: "MODIFICATION",
				field: "content",
				oldValue: JSON.stringify(obj1),
				newValue: JSON.stringify(obj2),
				reason: "Content update",
				author: "system",
				timestamp: new Date(),
			});
		}

		return changes;
	}

	/**
	 * Compliance monitoring
	 */
	async checkCompliance(
		contentId: string,
		standardId?: string,
	): Promise<ComplianceReport> {
		const standards = standardId
			? ([this.complianceStandards.get(standardId)].filter(
					Boolean,
				) as ComplianceStandard[])
			: Array.from(this.complianceStandards.values());

		const reportId = `compliance_${contentId}_${Date.now()}`;
		const contentVersions = this.contentVersions.get(contentId) || [];
		const latestVersion = contentVersions[contentVersions.length - 1];

		if (!latestVersion) {
			throw new Error(`No content versions found for ${contentId}`);
		}

		const requirementResults: ComplianceRequirementResult[] = [];
		let totalScore = 0;

		for (const standard of standards) {
			for (const requirement of standard.requirements) {
				const result = await this.checkRequirementCompliance(
					latestVersion,
					requirement,
				);
				requirementResults.push(result);
				if (result.status !== "NOT_APPLICABLE") {
					totalScore += result.score;
				}
			}
		}

		const averageScore =
			requirementResults.length > 0
				? totalScore /
					requirementResults.filter((r) => r.status !== "NOT_APPLICABLE").length
				: 0;

		const overallStatus = this.determineComplianceStatus(
			averageScore,
			requirementResults,
		);

		return {
			id: reportId,
			standardId: standardId || "all_standards",
			contentId,
			evaluationDate: new Date(),
			complianceScore: Math.round(averageScore),
			requirements: requirementResults,
			overallStatus,
			issues: this.generateComplianceIssues(requirementResults),
			nextEvaluationDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
		};
	}

	private async checkRequirementCompliance(
		contentVersion: ContentVersion,
		requirement: ComplianceRequirement,
	): Promise<ComplianceRequirementResult> {
		let score = 0;
		let status: "COMPLIANT" | "NON_COMPLIANT" | "NOT_APPLICABLE" =
			"NOT_APPLICABLE";
		let evidence = "";

		switch (requirement.category) {
			case "EVIDENCE":
				if (contentVersion.validationResults.medical) {
					score =
						contentVersion.validationResults.medical.evidenceAccuracy.score;
					status =
						score >= (requirement.threshold || 80)
							? "COMPLIANT"
							: "NON_COMPLIANT";
					evidence = `Evidence accuracy score: ${score}`;
				}
				break;

			case "CURRENCY":
				if (contentVersion.validationResults.currency) {
					score =
						contentVersion.validationResults.currency.contentFreshness.score;
					status =
						score >= (requirement.threshold || 70)
							? "COMPLIANT"
							: "NON_COMPLIANT";
					evidence = `Currency score: ${score}`;
				}
				break;

			case "CITATION":
				// Check if citations are present and valid
				score = 80; // Mock score
				status = "COMPLIANT";
				evidence = "Citations present and validated";
				break;
		}

		return {
			requirement,
			status,
			score,
			evidence,
			notes: status === "NON_COMPLIANT" ? "Requires attention" : undefined,
		};
	}

	private determineComplianceStatus(
		averageScore: number,
		requirements: ComplianceRequirementResult[],
	): "COMPLIANT" | "NON_COMPLIANT" | "PARTIALLY_COMPLIANT" {
		const nonCompliantCount = requirements.filter(
			(r) => r.status === "NON_COMPLIANT",
		).length;
		const totalApplicable = requirements.filter(
			(r) => r.status !== "NOT_APPLICABLE",
		).length;

		if (nonCompliantCount === 0) return "COMPLIANT";
		if (nonCompliantCount === totalApplicable) return "NON_COMPLIANT";
		return "PARTIALLY_COMPLIANT";
	}

	private generateComplianceIssues(
		requirements: ComplianceRequirementResult[],
	): ComplianceIssue[] {
		return requirements
			.filter((r) => r.status === "NON_COMPLIANT")
			.map((r) => ({
				requirementId: r.requirement.id,
				severity: r.requirement.mandatory ? "HIGH" : "MEDIUM",
				description: `Non-compliant with: ${r.requirement.description}`,
				remediation: `Improve ${r.requirement.category.toLowerCase()} to meet threshold of ${r.requirement.threshold || 80}`,
				deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
			}));
	}

	/**
	 * Quality metrics and reporting
	 */
	async generateQualityMetrics(
		startDate: Date,
		endDate: Date,
	): Promise<QualityMetrics> {
		const metricsId = `metrics_${startDate.getTime()}_${endDate.getTime()}`;

		// Calculate metrics from stored data
		const allVersions = Array.from(this.contentVersions.values()).flat();
		const periodVersions = allVersions.filter(
			(v) => v.timestamp >= startDate && v.timestamp <= endDate,
		);

		const newContent = periodVersions.filter((v) =>
			v.changes.some((c) => c.type === "CREATION"),
		).length;
		const updatedContent = periodVersions.filter((v) =>
			v.changes.some((c) => c.type === "MODIFICATION"),
		).length;

		// Calculate quality scores
		const medicalScores = periodVersions
			.map((v) => v.validationResults.medical?.overallMedicalAccuracy || 0)
			.filter((score) => score > 0);

		const currencyScores = periodVersions
			.map((v) => v.validationResults.currency?.overallCurrency || 0)
			.filter((score) => score > 0);

		const averageMedicalAccuracy =
			medicalScores.length > 0
				? medicalScores.reduce((sum, score) => sum + score, 0) /
					medicalScores.length
				: 0;

		const averageCurrencyScore =
			currencyScores.length > 0
				? currencyScores.reduce((sum, score) => sum + score, 0) /
					currencyScores.length
				: 0;

		return {
			id: metricsId,
			period: { startDate, endDate },

			totalContentItems: allVersions.length,
			newContentItems: newContent,
			updatedContentItems: updatedContent,
			archivedContentItems: 0, // Would track archived content

			averageMedicalAccuracy: Math.round(averageMedicalAccuracy),
			averageCurrencyScore: Math.round(averageCurrencyScore),
			averageCitationQuality: 85, // Mock value
			overallQualityTrend: "STABLE", // Would calculate based on historical data

			totalReviews: periodVersions.reduce(
				(sum, v) => sum + v.reviewHistory.length,
				0,
			),
			averageReviewTime: 2.5, // Mock value in hours
			approvalRate: 0.92, // Mock value
			expertReviewRate: 0.15, // Mock value

			criticalIssuesResolved: 0, // Would track from issue resolution data
			averageResolutionTime: 48, // Mock value in hours
			recurringIssues: [], // Would analyze patterns in issues
		};
	}

	/**
	 * Workflow management
	 */
	getWorkflows(): QualityAssuranceWorkflow[] {
		return Array.from(this.workflows.values());
	}

	getWorkflow(workflowId: string): QualityAssuranceWorkflow | undefined {
		return this.workflows.get(workflowId);
	}

	async updateWorkflow(
		workflowId: string,
		updates: Partial<QualityAssuranceWorkflow>,
	): Promise<void> {
		const workflow = this.workflows.get(workflowId);
		if (workflow) {
			Object.assign(workflow, updates, { lastModified: new Date() });
		}
	}

	/**
	 * Active review management
	 */
	getActiveReviews(): ActiveReview[] {
		return Array.from(this.activeReviews.values());
	}

	async completeReview(
		executionId: string,
		decision: "APPROVE" | "REJECT" | "REQUEST_CHANGES",
		comments: string,
	): Promise<void> {
		const activeReview = this.activeReviews.get(executionId);
		if (activeReview) {
			// Update the workflow execution with review result
			// This would integrate with the workflow execution system

			this.activeReviews.delete(executionId);
		}
	}
}

// Supporting interfaces
interface WorkflowExecution {
	id: string;
	workflowId: string;
	contentId: string;
	initiatedBy: string;
	startTime: Date;
	endTime?: Date;
	currentStep: number;
	status:
		| "IN_PROGRESS"
		| "WAITING_FOR_REVIEW"
		| "COMPLETED"
		| "FAILED"
		| "BLOCKED";
	results: WorkflowStepResult[];
	issues: WorkflowIssue[];
	error?: string;
}

interface WorkflowStepResult {
	stepId: string;
	startTime: Date;
	endTime?: Date;
	status: "PASSED" | "FAILED" | "WAITING_FOR_REVIEW" | "SKIPPED";
	score?: number;
	assignedTo?: string;
	dueDate?: Date;
	instructions?: string;
	details?: {
		medicalValidation?: MedicalValidationResult;
		currencyVerification?: CurrencyVerificationResult;
		citationQuality?: number;
	};
	autoApproved?: boolean;
	approved?: boolean;
	version?: string;
	issues?: string[];
	requiresExpertise?: string[];
}

interface WorkflowIssue {
	type: string;
	step: string;
	message: string;
	severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
}

interface QualityGateCheck {
	passed: boolean;
	failedGates: string[];
	score: number;
}

interface ActiveReview {
	executionId: string;
	stepId: string;
	assignedTo?: string;
	dueDate: Date;
	priority: "LOW" | "MEDIUM" | "HIGH";
}

interface VersionComparison {
	version1: string;
	version2: string;
	changes: ContentChange[];
	validationScoreChange: {
		medical: number;
		currency: number;
	};
}

// Export singleton instance
export const qualityAssuranceFramework = new QualityAssuranceFramework();
