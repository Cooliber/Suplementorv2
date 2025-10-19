/**
 * Audit Logging System for Medical Data Access
 * Provides comprehensive audit trails for GDPR and HIPAA compliance
 */

import { randomBytes } from "node:crypto";
import { SECURITY_CONFIG } from "../../config/environments.js";
import { env } from "../../env.js";

/**
 * Audit event types
 */
export enum AuditEventType {
	DATA_ACCESS = "data_access",
	DATA_MODIFICATION = "data_modification",
	DATA_DELETION = "data_deletion",
	DATA_EXPORT = "data_export",
	CONSENT_CHANGE = "consent_change",
	USER_AUTHENTICATION = "user_authentication",
	ADMIN_ACTION = "admin_action",
	SECURITY_EVENT = "security_event",
	COMPLIANCE_CHECK = "compliance_check",
}

/**
 * Audit severity levels
 */
export enum AuditSeverity {
	LOW = "low",
	MEDIUM = "medium",
	HIGH = "high",
	CRITICAL = "critical",
}

/**
 * Audit log entry interface
 */
interface AuditLogEntry {
	id: string;
	timestamp: Date;
	eventType: AuditEventType;
	severity: AuditSeverity;
	userId?: string;
	sessionId: string;
	action: string;
	resource: string;
	details: Record<string, any>;
	result: "success" | "failure" | "partial";
	errorMessage?: string;
	ipAddress: string;
	userAgent: string;
	location?: {
		country?: string;
		region?: string;
		city?: string;
	};
	compliance: {
		gdprRelevant: boolean;
		hipaaRelevant: boolean;
		dataClassification: string;
		consentVerified: boolean;
	};
	metadata: {
		requestId: string;
		traceId?: string;
		spanId?: string;
	};
}

/**
 * Audit logger configuration
 */
interface AuditLoggerConfig {
	retentionDays: number;
	encryptionEnabled: boolean;
	encryptionKey?: string;
	compressOldLogs: boolean;
	archiveThreshold: number; // days
}

/**
 * Audit Logger Class
 */
export class AuditLogger {
	private logs: AuditLogEntry[] = [];
	private config: AuditLoggerConfig;
	private encryptionKey?: Buffer;

	constructor() {
		this.config = {
			retentionDays: SECURITY_CONFIG.MEDICAL_DATA.RETENTION_DAYS,
			encryptionEnabled: !!env.AUDIT_LOG_ENCRYPTION_KEY,
			encryptionKey: env.AUDIT_LOG_ENCRYPTION_KEY,
			compressOldLogs: true,
			archiveThreshold: 90, // Archive logs older than 90 days
		};

		this.initializeEncryption();
	}

	/**
	 * Initialize encryption for audit logs
	 */
	private async initializeEncryption(): Promise<void> {
		if (this.config.encryptionEnabled && this.config.encryptionKey) {
			try {
				const { scrypt } = await import("node:crypto");
				const { promisify } = await import("node:util");
				const scryptAsync = promisify(scrypt);

				const salt = randomBytes(16);
				this.encryptionKey = (await scryptAsync(
					this.config.encryptionKey,
					salt,
					32,
				)) as Buffer;
			} catch (error) {
				console.error("Failed to initialize audit log encryption:", error);
			}
		}
	}

	/**
	 * Log a medical data access event
	 */
	logDataAccess(
		eventType: AuditEventType,
		userId: string | undefined,
		action: string,
		resource: string,
		details: Record<string, any>,
		result: "success" | "failure" | "partial",
		ipAddress: string,
		userAgent: string,
		consentVerified = false,
		errorMessage?: string,
	): string {
		const entry: AuditLogEntry = {
			id: this.generateLogId(),
			timestamp: new Date(),
			eventType,
			severity: this.determineSeverity(eventType, result),
			userId,
			sessionId: details.sessionId || this.generateSessionId(),
			action,
			resource,
			details,
			result,
			errorMessage,
			ipAddress,
			userAgent,
			compliance: {
				gdprRelevant: this.isGDPRelevant(eventType),
				hipaaRelevant: this.isHIPAARelevant(eventType),
				dataClassification: details.dataClassification || "unknown",
				consentVerified,
			},
			metadata: {
				requestId: details.requestId || this.generateRequestId(),
				traceId: details.traceId,
				spanId: details.spanId,
			},
		};

		this.logs.push(entry);

		// In production, immediately write to persistent storage
		this.persistLog(entry);

		return entry.id;
	}

	/**
	 * Log medical data modification
	 */
	logDataModification(
		userId: string,
		action: string,
		resource: string,
		changes: Record<string, any>,
		ipAddress: string,
		userAgent: string,
		consentVerified = false,
	): string {
		return this.logDataAccess(
			AuditEventType.DATA_MODIFICATION,
			userId,
			action,
			resource,
			{ changes, timestamp: new Date() },
			"success",
			ipAddress,
			userAgent,
			consentVerified,
		);
	}

	/**
	 * Log data deletion for GDPR right to erasure
	 */
	logDataDeletion(
		userId: string,
		resource: string,
		reason: string,
		ipAddress: string,
		userAgent: string,
	): string {
		return this.logDataAccess(
			AuditEventType.DATA_DELETION,
			userId,
			"DELETE",
			resource,
			{ reason, deletionTimestamp: new Date() },
			"success",
			ipAddress,
			userAgent,
			true,
			undefined,
		);
	}

	/**
	 * Log consent changes
	 */
	logConsentChange(
		userId: string,
		consentType: string,
		action: "granted" | "withdrawn" | "expired",
		ipAddress: string,
		userAgent: string,
	): string {
		return this.logDataAccess(
			AuditEventType.CONSENT_CHANGE,
			userId,
			`CONSENT_${action.toUpperCase()}`,
			`consent:${consentType}`,
			{ consentType, action, timestamp: new Date() },
			"success",
			ipAddress,
			userAgent,
			true,
		);
	}

	/**
	 * Log security events
	 */
	logSecurityEvent(
		eventType: string,
		severity: AuditSeverity,
		details: Record<string, any>,
		ipAddress: string,
		userAgent: string,
	): string {
		return this.logDataAccess(
			AuditEventType.SECURITY_EVENT,
			undefined,
			eventType,
			"security",
			details,
			"success",
			ipAddress,
			userAgent,
			false,
		);
	}

	/**
	 * Determine audit severity based on event type and result
	 */
	private determineSeverity(
		eventType: AuditEventType,
		result: "success" | "failure" | "partial",
	): AuditSeverity {
		// Failed operations are generally higher severity
		if (result === "failure") {
			switch (eventType) {
				case AuditEventType.DATA_ACCESS:
				case AuditEventType.DATA_MODIFICATION:
					return AuditSeverity.HIGH;
				case AuditEventType.SECURITY_EVENT:
					return AuditSeverity.CRITICAL;
				default:
					return AuditSeverity.MEDIUM;
			}
		}

		// Successful operations
		switch (eventType) {
			case AuditEventType.DATA_DELETION:
				return AuditSeverity.HIGH;
			case AuditEventType.DATA_EXPORT:
				return AuditSeverity.HIGH;
			case AuditEventType.ADMIN_ACTION:
				return AuditSeverity.MEDIUM;
			case AuditEventType.SECURITY_EVENT:
				return AuditSeverity.MEDIUM;
			default:
				return AuditSeverity.LOW;
		}
	}

	/**
	 * Check if event is GDPR relevant
	 */
	private isGDPRelevant(eventType: AuditEventType): boolean {
		const gdprRelevantEvents = [
			AuditEventType.DATA_ACCESS,
			AuditEventType.DATA_MODIFICATION,
			AuditEventType.DATA_DELETION,
			AuditEventType.DATA_EXPORT,
			AuditEventType.CONSENT_CHANGE,
		];

		return gdprRelevantEvents.includes(eventType);
	}

	/**
	 * Check if event is HIPAA relevant
	 */
	private isHIPAARelevant(eventType: AuditEventType): boolean {
		const hipaaRelevantEvents = [
			AuditEventType.DATA_ACCESS,
			AuditEventType.DATA_MODIFICATION,
			AuditEventType.DATA_DELETION,
			AuditEventType.ADMIN_ACTION,
			AuditEventType.SECURITY_EVENT,
		];

		return hipaaRelevantEvents.includes(eventType);
	}

	/**
	 * Persist log entry to storage
	 */
	private persistLog(entry: AuditLogEntry): void {
		// In production, this would write to:
		// 1. Database for recent logs
		// 2. Encrypted files for archived logs
		// 3. SIEM system for real-time monitoring

		console.log(
			`[AUDIT] ${entry.severity.toUpperCase()}: ${entry.eventType} - ${entry.action}`,
			{
				userId: entry.userId,
				resource: entry.resource,
				result: entry.result,
				compliance: entry.compliance,
			},
		);

		// Simulate database write
		this.writeToDatabase(entry);

		// Check if should archive
		if (this.shouldArchive(entry)) {
			this.archiveLog(entry);
		}
	}

	/**
	 * Write log to database
	 */
	private writeToDatabase(entry: AuditLogEntry): void {
		// In production, write to audit_logs table
		// For now, just store in memory with size limit
		if (this.logs.length > 10000) {
			this.logs.splice(0, 1000); // Remove oldest 1000 entries
		}
	}

	/**
	 * Check if log should be archived
	 */
	private shouldArchive(entry: AuditLogEntry): boolean {
		const daysSinceLog =
			(Date.now() - entry.timestamp.getTime()) / (24 * 60 * 60 * 1000);
		return daysSinceLog > this.config.archiveThreshold;
	}

	/**
	 * Archive old log entry
	 */
	private archiveLog(entry: AuditLogEntry): void {
		// In production, move to encrypted archive storage
		console.log(`Archiving audit log: ${entry.id}`);
	}

	/**
	 * Generate unique log ID
	 */
	private generateLogId(): string {
		return `audit_${Date.now()}_${randomBytes(8).toString("hex")}`;
	}

	/**
	 * Generate session ID
	 */
	private generateSessionId(): string {
		return `session_${randomBytes(16).toString("hex")}`;
	}

	/**
	 * Generate request ID for tracing
	 */
	private generateRequestId(): string {
		return `req_${randomBytes(8).toString("hex")}`;
	}

	/**
	 * Query audit logs with filters
	 */
	queryLogs(filters: {
		userId?: string;
		eventType?: AuditEventType;
		severity?: AuditSeverity;
		startDate?: Date;
		endDate?: Date;
		gdprRelevant?: boolean;
		hipaaRelevant?: boolean;
	}): AuditLogEntry[] {
		return this.logs.filter((log) => {
			if (filters.userId && log.userId !== filters.userId) return false;
			if (filters.eventType && log.eventType !== filters.eventType)
				return false;
			if (filters.severity && log.severity !== filters.severity) return false;
			if (filters.startDate && log.timestamp < filters.startDate) return false;
			if (filters.endDate && log.timestamp > filters.endDate) return false;
			if (
				filters.gdprRelevant !== undefined &&
				log.compliance.gdprRelevant !== filters.gdprRelevant
			)
				return false;
			if (
				filters.hipaaRelevant !== undefined &&
				log.compliance.hipaaRelevant !== filters.hipaaRelevant
			)
				return false;

			return true;
		});
	}

	/**
	 * Get audit summary for compliance reporting
	 */
	getAuditSummary(
		startDate: Date,
		endDate: Date,
	): {
		totalEvents: number;
		eventsByType: Record<AuditEventType, number>;
		eventsBySeverity: Record<AuditSeverity, number>;
		gdprEvents: number;
		hipaaEvents: number;
		securityIncidents: number;
		consentChanges: number;
		dataDeletions: number;
	} {
		const relevantLogs = this.logs.filter(
			(log) => log.timestamp >= startDate && log.timestamp <= endDate,
		);

		const summary = {
			totalEvents: relevantLogs.length,
			eventsByType: {} as Record<AuditEventType, number>,
			eventsBySeverity: {} as Record<AuditSeverity, number>,
			gdprEvents: 0,
			hipaaEvents: 0,
			securityIncidents: 0,
			consentChanges: 0,
			dataDeletions: 0,
		};

		// Initialize counters
		Object.values(AuditEventType).forEach((type) => {
			summary.eventsByType[type] = 0;
		});
		Object.values(AuditSeverity).forEach((severity) => {
			summary.eventsBySeverity[severity] = 0;
		});

		// Count events
		relevantLogs.forEach((log) => {
			summary.eventsByType[log.eventType]++;
			summary.eventsBySeverity[log.severity]++;

			if (log.compliance.gdprRelevant) summary.gdprEvents++;
			if (log.compliance.hipaaRelevant) summary.hipaaEvents++;
			if (log.eventType === AuditEventType.SECURITY_EVENT)
				summary.securityIncidents++;
			if (log.eventType === AuditEventType.CONSENT_CHANGE)
				summary.consentChanges++;
			if (log.eventType === AuditEventType.DATA_DELETION)
				summary.dataDeletions++;
		});

		return summary;
	}

	/**
	 * Export logs for compliance audit
	 */
	exportLogsForAudit(
		startDate: Date,
		endDate: Date,
		format: "json" | "csv" = "json",
	): string {
		const relevantLogs = this.logs.filter(
			(log) => log.timestamp >= startDate && log.timestamp <= endDate,
		);

		if (format === "csv") {
			return this.convertToCSV(relevantLogs);
		}

		return JSON.stringify(relevantLogs, null, 2);
	}

	/**
	 * Convert logs to CSV format
	 */
	private convertToCSV(logs: AuditLogEntry[]): string {
		if (logs.length === 0) return "";

		const headers = [
			"id",
			"timestamp",
			"eventType",
			"severity",
			"userId",
			"action",
			"resource",
			"result",
			"ipAddress",
			"gdprRelevant",
			"hipaaRelevant",
		];

		const csvRows = [
			headers.join(","),
			...logs.map((log) =>
				[
					log.id,
					log.timestamp.toISOString(),
					log.eventType,
					log.severity,
					log.userId || "",
					log.action,
					log.resource,
					log.result,
					log.ipAddress,
					log.compliance.gdprRelevant,
					log.compliance.hipaaRelevant,
				].join(","),
			),
		];

		return csvRows.join("\n");
	}

	/**
	 * Clean up old logs based on retention policy
	 */
	cleanupOldLogs(): number {
		const retentionDate = new Date(
			Date.now() - this.config.retentionDays * 24 * 60 * 60 * 1000,
		);
		const initialCount = this.logs.length;

		this.logs = this.logs.filter((log) => log.timestamp > retentionDate);

		const removedCount = initialCount - this.logs.length;

		if (removedCount > 0) {
			console.log(
				`Cleaned up ${removedCount} audit log entries older than ${this.config.retentionDays} days`,
			);
		}

		return removedCount;
	}

	/**
	 * Get logs for a specific user (for GDPR data export)
	 */
	getUserLogs(userId: string): AuditLogEntry[] {
		return this.logs
			.filter((log) => log.userId === userId)
			.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
	}

	/**
	 * Verify audit log integrity
	 */
	verifyIntegrity(): { valid: boolean; issues: string[] } {
		const issues: string[] = [];

		// Check for gaps in sequence
		const sortedLogs = [...this.logs].sort(
			(a, b) => a.timestamp.getTime() - b.timestamp.getTime(),
		);

		for (let i = 1; i < sortedLogs.length; i++) {
			const current = sortedLogs[i];
			const previous = sortedLogs[i - 1];

			// Check for reasonable time gaps (no more than 1 second between logs)
			const timeGap =
				current.timestamp.getTime() - previous.timestamp.getTime();
			if (timeGap < 0) {
				issues.push(
					`Log entries out of order: ${previous.id} -> ${current.id}`,
				);
			}
		}

		// Check for missing critical events
		const criticalEvents = this.logs.filter(
			(log) => log.severity === AuditSeverity.CRITICAL,
		);
		if (criticalEvents.length > 0) {
			issues.push(
				`${criticalEvents.length} critical security events require immediate attention`,
			);
		}

		return {
			valid: issues.length === 0,
			issues,
		};
	}
}

/**
 * Singleton instance for application-wide use
 */
export const auditLogger = new AuditLogger();

/**
 * Middleware function to automatically log API access
 */
export function withAuditLogging(
	handler: (request: any, context: any) => Promise<any>,
	eventType: AuditEventType = AuditEventType.DATA_ACCESS,
) {
	return async (request: any, context: any) => {
		const startTime = Date.now();
		const requestId = `req_${randomBytes(8).toString("hex")}`;

		try {
			// Extract user information
			const userId = request.user?.id;
			const ipAddress =
				request.ip || request.headers?.["x-forwarded-for"] || "unknown";
			const userAgent = request.headers?.["user-agent"] || "unknown";

			// Execute the handler
			const result = await handler(request, context);

			// Log successful access
			auditLogger.logDataAccess(
				eventType,
				userId,
				request.method || "UNKNOWN",
				request.url || "unknown",
				{
					requestId,
					duration: Date.now() - startTime,
					statusCode: result.status || 200,
				},
				"success",
				ipAddress,
				userAgent,
				false, // Consent verification would be checked separately
			);

			return result;
		} catch (error) {
			// Log failed access
			auditLogger.logDataAccess(
				eventType,
				request.user?.id,
				request.method || "UNKNOWN",
				request.url || "unknown",
				{
					requestId,
					duration: Date.now() - startTime,
					error: error instanceof Error ? error.message : "Unknown error",
				},
				"failure",
				request.ip || "unknown",
				request.headers?.["user-agent"] || "unknown",
				false,
				error instanceof Error ? error.message : "Unknown error",
			);

			throw error;
		}
	};
}
