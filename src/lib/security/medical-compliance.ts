/**
 * Medical Data Compliance System for Suplementor
 * Implements GDPR and HIPAA compliance for medical app data handling
 */

import { randomBytes } from "node:crypto";
import { MEDICAL_CONFIG } from "../../config/environments.js";
import { env } from "../../env.js";

/**
 * Data classification levels for medical information
 */
export enum DataClassification {
	PUBLIC = "public",
	INTERNAL = "internal",
	CONFIDENTIAL = "confidential",
	RESTRICTED = "restricted",
	MEDICAL = "medical",
}

/**
 * GDPR consent types
 */
export enum ConsentType {
	NECESSARY = "necessary",
	ANALYTICS = "analytics",
	MARKETING = "marketing",
	RESEARCH = "research",
	MEDICAL_TRACKING = "medical_tracking",
}

/**
 * Medical data categories
 */
export enum MedicalDataCategory {
	SUPPLEMENT_USAGE = "supplement_usage",
	HEALTH_METRICS = "health_metrics",
	MEDICAL_HISTORY = "medical_history",
	TREATMENT_PLANS = "treatment_plans",
	BIOMETRIC_DATA = "biometric_data",
	RESEARCH_DATA = "research_data",
}

/**
 * GDPR compliance status
 */
interface GDPRStatus {
	complianceLevel: "strict" | "standard" | "minimal";
	dataRetentionDays: number;
	consentRequired: boolean;
	rightToErasure: boolean;
	dataPortability: boolean;
	lastAudit: Date;
	nextAuditDue: Date;
}

/**
 * Medical data metadata
 */
interface MedicalDataMetadata {
	classification: DataClassification;
	category: MedicalDataCategory;
	encryptionLevel: "standard" | "high" | "maximum";
	requiresConsent: ConsentType[];
	processingPurposes: string[];
	dataSubjectId?: string;
	collectionDate: Date;
	retentionUntil: Date;
	geographicRestrictions: string[];
	accessLog: AccessLogEntry[];
}

/**
 * Access log entry for audit trail
 */
interface AccessLogEntry {
	timestamp: Date;
	userId: string;
	action: "read" | "write" | "delete" | "export";
	purpose: string;
	ipAddress: string;
	userAgent: string;
	consentVerified: boolean;
	dataClassification: DataClassification;
}

/**
 * User consent record
 */
interface ConsentRecord {
	userId: string;
	consentType: ConsentType;
	granted: boolean;
	grantedAt: Date;
	expiresAt?: Date;
	version: string;
	ipAddress: string;
	source: "web" | "mobile" | "api";
	withdrawalDate?: Date;
	purpose: string;
}

/**
 * Medical Compliance Manager
 */
export class MedicalComplianceManager {
	private gdprStatus: GDPRStatus;
	private consentRecords = new Map<string, ConsentRecord[]>();
	private accessLogs = new Map<string, AccessLogEntry[]>();

	constructor() {
		this.gdprStatus = {
			complianceLevel: MEDICAL_CONFIG.GDPR_COMPLIANCE.STRICT
				? "strict"
				: "standard",
			dataRetentionDays: SECURITY_CONFIG.MEDICAL_DATA.RETENTION_DAYS,
			consentRequired: true,
			rightToErasure: true,
			dataPortability: true,
			lastAudit: new Date(),
			nextAuditDue: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
		};
	}

	/**
	 * Classify medical data based on sensitivity
	 */
	classifyMedicalData(data: any): MedicalDataMetadata {
		const classification = this.determineDataClassification(data);
		const category = this.determineDataCategory(data);

		return {
			classification,
			category,
			encryptionLevel: this.getEncryptionLevel(classification),
			requiresConsent: this.getRequiredConsents(category),
			processingPurposes: this.getProcessingPurposes(category),
			collectionDate: new Date(),
			retentionUntil: new Date(
				Date.now() + this.gdprStatus.dataRetentionDays * 24 * 60 * 60 * 1000,
			),
			geographicRestrictions: ["EU", "EEA"], // GDPR geographic scope
			accessLog: [],
		};
	}

	/**
	 * Determine data classification level
	 */
	private determineDataClassification(data: any): DataClassification {
		// Personal health information is always restricted
		if (data.personalInfo || data.medicalHistory || data.biometricData) {
			return DataClassification.MEDICAL;
		}

		// Supplement tracking with personal patterns
		if (data.supplementUsage && data.userId) {
			return DataClassification.RESTRICTED;
		}

		// General supplement information
		if (data.supplementInfo) {
			return DataClassification.CONFIDENTIAL;
		}

		// Educational content
		if (data.educationalContent) {
			return DataClassification.INTERNAL;
		}

		return DataClassification.PUBLIC;
	}

	/**
	 * Determine medical data category
	 */
	private determineDataCategory(data: any): MedicalDataCategory {
		if (data.medicalHistory || data.diagnoses || data.treatments) {
			return MedicalDataCategory.MEDICAL_HISTORY;
		}

		if (data.biometricData || data.vitalSigns || data.labResults) {
			return MedicalDataCategory.BIOMETRIC_DATA;
		}

		if (data.treatmentPlans || data.medicationSchedules) {
			return MedicalDataCategory.TREATMENT_PLANS;
		}

		if (data.researchParticipation || data.studyData) {
			return MedicalDataCategory.RESEARCH_DATA;
		}

		if (data.healthMetrics || data.wellnessScores) {
			return MedicalDataCategory.HEALTH_METRICS;
		}

		return MedicalDataCategory.SUPPLEMENT_USAGE;
	}

	/**
	 * Get encryption level for data classification
	 */
	private getEncryptionLevel(
		classification: DataClassification,
	): "standard" | "high" | "maximum" {
		switch (classification) {
			case DataClassification.MEDICAL:
				return "maximum";
			case DataClassification.RESTRICTED:
				return "high";
			case DataClassification.CONFIDENTIAL:
				return "standard";
			default:
				return "standard";
		}
	}

	/**
	 * Get required consents for data category
	 */
	private getRequiredConsents(category: MedicalDataCategory): ConsentType[] {
		const baseConsents = [ConsentType.NECESSARY];

		switch (category) {
			case MedicalDataCategory.MEDICAL_HISTORY:
				return [...baseConsents, ConsentType.MEDICAL_TRACKING];
			case MedicalDataCategory.BIOMETRIC_DATA:
				return [
					...baseConsents,
					ConsentType.MEDICAL_TRACKING,
					ConsentType.RESEARCH,
				];
			case MedicalDataCategory.HEALTH_METRICS:
				return [
					...baseConsents,
					ConsentType.ANALYTICS,
					ConsentType.MEDICAL_TRACKING,
				];
			case MedicalDataCategory.RESEARCH_DATA:
				return [...baseConsents, ConsentType.RESEARCH];
			default:
				return [...baseConsents, ConsentType.ANALYTICS];
		}
	}

	/**
	 * Get processing purposes for data category
	 */
	private getProcessingPurposes(category: MedicalDataCategory): string[] {
		const purposes = ["educational_content_delivery"];

		switch (category) {
			case MedicalDataCategory.SUPPLEMENT_USAGE:
				return [...purposes, "supplement_recommendations", "usage_analytics"];
			case MedicalDataCategory.HEALTH_METRICS:
				return [...purposes, "health_trend_analysis", "personalized_insights"];
			case MedicalDataCategory.MEDICAL_HISTORY:
				return [...purposes, "safety_monitoring", "interaction_checking"];
			case MedicalDataCategory.BIOMETRIC_DATA:
				return [...purposes, "research_insights", "population_health"];
			default:
				return purposes;
		}
	}

	/**
	 * Record user consent
	 */
	recordConsent(
		userId: string,
		consentType: ConsentType,
		granted: boolean,
		purpose: string,
		ipAddress: string,
		source: "web" | "mobile" | "api" = "web",
	): ConsentRecord {
		const record: ConsentRecord = {
			userId,
			consentType,
			granted,
			grantedAt: new Date(),
			version: "1.0",
			ipAddress,
			source,
			purpose,
		};

		// Set expiration for non-necessary consents (1 year)
		if (consentType !== ConsentType.NECESSARY) {
			record.expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
		}

		// Store consent record
		if (!this.consentRecords.has(userId)) {
			this.consentRecords.set(userId, []);
		}

		const userConsents = this.consentRecords.get(userId)!;

		// Update existing consent or add new one
		const existingIndex = userConsents.findIndex(
			(c) => c.consentType === consentType,
		);
		if (existingIndex >= 0) {
			if (!granted) {
				userConsents[existingIndex].withdrawalDate = new Date();
			} else {
				userConsents[existingIndex] = record;
			}
		} else {
			userConsents.push(record);
		}

		return record;
	}

	/**
	 * Verify user consent for data processing
	 */
	verifyConsent(
		userId: string,
		consentTypes: ConsentType[],
		purpose: string,
	): {
		valid: boolean;
		missingConsents: ConsentType[];
		expiredConsents: ConsentType[];
	} {
		const userConsents = this.consentRecords.get(userId) || [];
		const now = new Date();

		const missingConsents: ConsentType[] = [];
		const expiredConsents: ConsentType[] = [];

		for (const consentType of consentTypes) {
			const consent = userConsents.find((c) => c.consentType === consentType);

			if (!consent || !consent.granted) {
				missingConsents.push(consentType);
			} else if (consent.expiresAt && consent.expiresAt < now) {
				expiredConsents.push(consentType);
			}
		}

		return {
			valid: missingConsents.length === 0 && expiredConsents.length === 0,
			missingConsents,
			expiredConsents,
		};
	}

	/**
	 * Log data access for audit trail
	 */
	logDataAccess(
		dataId: string,
		userId: string,
		action: "read" | "write" | "delete" | "export",
		purpose: string,
		ipAddress: string,
		userAgent: string,
		consentVerified: boolean,
		dataClassification: DataClassification,
	): void {
		const logEntry: AccessLogEntry = {
			timestamp: new Date(),
			userId,
			action,
			purpose,
			ipAddress,
			userAgent,
			consentVerified,
			dataClassification,
		};

		if (!this.accessLogs.has(dataId)) {
			this.accessLogs.set(dataId, []);
		}

		this.accessLogs.get(dataId)?.push(logEntry);

		// Keep only last 100 entries per data item for performance
		const logs = this.accessLogs.get(dataId)!;
		if (logs.length > 100) {
			logs.splice(0, logs.length - 100);
		}
	}

	/**
	 * Check if data access is compliant
	 */
	checkAccessCompliance(
		userId: string,
		dataClassification: DataClassification,
		action: string,
		purpose: string,
	): { compliant: boolean; reason?: string } {
		// Check if medical data protection is enabled
		if (!MEDICAL_CONFIG.DATA_PROTECTION.ENABLED) {
			return {
				compliant: false,
				reason: "Medical data protection is disabled",
			};
		}

		// Check GDPR compliance level
		if (
			dataClassification === DataClassification.MEDICAL &&
			!MEDICAL_CONFIG.GDPR_COMPLIANCE.STRICT
		) {
			return {
				compliant: false,
				reason: "Medical data requires strict GDPR compliance",
			};
		}

		// Additional compliance checks based on data classification
		switch (dataClassification) {
			case DataClassification.MEDICAL:
				return this.checkMedicalDataCompliance(userId, action, purpose);
			case DataClassification.RESTRICTED:
				return this.checkRestrictedDataCompliance(userId, action, purpose);
			default:
				return { compliant: true };
		}
	}

	/**
	 * Check compliance for medical data access
	 */
	private checkMedicalDataCompliance(
		userId: string,
		action: string,
		purpose: string,
	): { compliant: boolean; reason?: string } {
		// Medical data requires explicit consent for most operations
		const requiredConsents = [ConsentType.MEDICAL_TRACKING];
		const consentCheck = this.verifyConsent(userId, requiredConsents, purpose);

		if (!consentCheck.valid) {
			return {
				compliant: false,
				reason: `Missing or expired consents: ${consentCheck.missingConsents.join(", ")}`,
			};
		}

		return { compliant: true };
	}

	/**
	 * Check compliance for restricted data access
	 */
	private checkRestrictedDataCompliance(
		userId: string,
		action: string,
		purpose: string,
	): { compliant: boolean; reason?: string } {
		// Restricted data requires analytics consent
		const consentCheck = this.verifyConsent(
			userId,
			[ConsentType.ANALYTICS],
			purpose,
		);

		if (!consentCheck.valid) {
			return {
				compliant: false,
				reason: "Analytics consent required for restricted data",
			};
		}

		return { compliant: true };
	}

	/**
	 * Generate data processing impact assessment
	 */
	generateDPIA(category: MedicalDataCategory): {
		riskLevel: "low" | "medium" | "high";
		mitigations: string[];
		legalBasis: string[];
		retentionPeriod: number;
	} {
		const baseMitigations = [
			"Data encryption at rest and in transit",
			"Access logging and audit trails",
			"Regular security assessments",
			"GDPR compliance monitoring",
		];

		switch (category) {
			case MedicalDataCategory.MEDICAL_HISTORY:
				return {
					riskLevel: "high",
					mitigations: [
						...baseMitigations,
						"Medical professional oversight",
						"Enhanced consent management",
						"Specialized data classification",
					],
					legalBasis: ["explicit_consent", "vital_interests"],
					retentionPeriod: 2555, // 7 years
				};

			case MedicalDataCategory.BIOMETRIC_DATA:
				return {
					riskLevel: "high",
					mitigations: [
						...baseMitigations,
						"Biometric data anonymization",
						"Research ethics board approval",
						"Enhanced de-identification",
					],
					legalBasis: ["explicit_consent", "scientific_research"],
					retentionPeriod: 1825, // 5 years
				};

			default:
				return {
					riskLevel: "medium",
					mitigations: baseMitigations,
					legalBasis: ["legitimate_interest", "consent"],
					retentionPeriod: 1095, // 3 years
				};
		}
	}

	/**
	 * Get GDPR status report
	 */
	getGDPRStatus(): GDPRStatus & {
		totalConsents: number;
		activeConsents: number;
		expiredConsents: number;
		pendingErasures: number;
	} {
		let totalConsents = 0;
		let activeConsents = 0;
		let expiredConsents = 0;

		for (const userConsents of this.consentRecords.values()) {
			totalConsents += userConsents.length;
			for (const consent of userConsents) {
				if (consent.granted && !consent.withdrawalDate) {
					if (consent.expiresAt && consent.expiresAt < new Date()) {
						expiredConsents++;
					} else {
						activeConsents++;
					}
				}
			}
		}

		return {
			...this.gdprStatus,
			totalConsents,
			activeConsents,
			expiredConsents,
			pendingErasures: 0, // Would be calculated from erasure requests
		};
	}

	/**
	 * Export user data for GDPR compliance
	 */
	exportUserData(userId: string): {
		consents: ConsentRecord[];
		accessLogs: AccessLogEntry[];
		dataCategories: MedicalDataCategory[];
		exportTimestamp: Date;
	} {
		return {
			consents: this.consentRecords.get(userId) || [],
			accessLogs: this.getUserAccessLogs(userId),
			dataCategories: this.getUserDataCategories(userId),
			exportTimestamp: new Date(),
		};
	}

	/**
	 * Get user access logs
	 */
	private getUserAccessLogs(userId: string): AccessLogEntry[] {
		const logs: AccessLogEntry[] = [];

		for (const dataLogs of this.accessLogs.values()) {
			logs.push(...dataLogs.filter((log) => log.userId === userId));
		}

		return logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
	}

	/**
	 * Get user data categories
	 */
	private getUserDataCategories(userId: string): MedicalDataCategory[] {
		const categories = new Set<MedicalDataCategory>();

		for (const dataLogs of this.accessLogs.values()) {
			for (const log of dataLogs) {
				if (log.userId === userId) {
					// This would need to be enhanced with actual data category mapping
					categories.add(MedicalDataCategory.SUPPLEMENT_USAGE);
				}
			}
		}

		return Array.from(categories);
	}
}

/**
 * Singleton instance for application-wide use
 */
export const medicalCompliance = new MedicalComplianceManager();

/**
 * Utility functions for medical compliance
 */
export const MedicalComplianceUtils = {
	/**
	 * Generate a unique data subject identifier
	 */
	generateDataSubjectId: (): string => {
		return `DS_${randomBytes(16).toString("hex")}`;
	},

	/**
	 * Validate GDPR compliance for data operation
	 */
	validateGDPROperation: (
		userId: string,
		operation: string,
		dataCategory: MedicalDataCategory,
	): boolean => {
		const requiredConsents = medicalCompliance.classifyMedicalData({
			category: dataCategory,
		}).requiresConsent;
		const consentCheck = medicalCompliance.verifyConsent(
			userId,
			requiredConsents,
			operation,
		);
		return consentCheck.valid;
	},

	/**
	 * Check if data erasure is required
	 */
	isErasureRequired: (userId: string): boolean => {
		const userConsents = medicalCompliance.consentRecords.get(userId) || [];
		return userConsents.some(
			(consent) =>
				consent.consentType === ConsentType.NECESSARY && consent.withdrawalDate,
		);
	},
};
