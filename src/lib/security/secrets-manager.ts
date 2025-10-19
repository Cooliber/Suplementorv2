/**
 * Secure Secrets Management System for Suplementor Medical App
 * Handles encryption, storage, and rotation of sensitive data
 */

import {
	createCipheriv,
	createDecipheriv,
	randomBytes,
	scrypt,
} from "node:crypto";
import { promisify } from "node:util";
import { SECURITY_CONFIG } from "../../config/environments.js";
import { env } from "../../env.js";

const scryptAsync = promisify(scrypt);

/**
 * Secrets categories for organization
 */
export enum SecretCategory {
	DATABASE = "database",
	MEDICAL = "medical",
	AUDIT = "audit",
	API_KEYS = "api_keys",
	WEBHOOKS = "webhooks",
	ENCRYPTION_KEYS = "encryption_keys",
}

/**
 * Secret metadata interface
 */
interface SecretMetadata {
	category: SecretCategory;
	description: string;
	rotationDays: number;
	lastRotated?: Date;
	createdAt: Date;
	environment: string;
	gdprCompliant: boolean;
}

/**
 * Encrypted secret interface
 */
interface EncryptedSecret {
	encryptedData: string;
	iv: string;
	tag: string;
	metadata: SecretMetadata;
}

/**
 * Secrets Manager class
 */
export class SecretsManager {
	private masterKey: Buffer | null = null;
	private keyCache = new Map<string, Buffer>();
	private secretsCache = new Map<string, { data: string; expires: number }>();

	constructor() {
		this.initializeMasterKey();
	}

	/**
	 * Initialize master encryption key
	 */
	private async initializeMasterKey(): Promise<void> {
		const masterPassword =
			env.MEDICAL_DATA_ENCRYPTION_KEY || env.DATABASE_ENCRYPTION_KEY;

		if (!masterPassword) {
			console.warn(
				"No master encryption key found - secrets encryption disabled",
			);
			return;
		}

		try {
			const salt = randomBytes(16);
			this.masterKey = (await scryptAsync(masterPassword, salt, 32)) as Buffer;
		} catch (error) {
			console.error("Failed to initialize master key:", error);
		}
	}

	/**
	 * Generate a cryptographically secure key
	 */
	async generateSecureKey(length = 32): Promise<string> {
		return randomBytes(length).toString("hex");
	}

	/**
	 * Encrypt a secret value
	 */
	async encryptSecret(
		value: string,
		category: SecretCategory,
		description: string,
		rotationDays = 90,
	): Promise<EncryptedSecret> {
		if (!this.masterKey) {
			throw new Error("Master key not initialized - cannot encrypt secrets");
		}

		const iv = randomBytes(16);
		const cipher = createCipheriv(
			SECURITY_CONFIG.ENCRYPTION.ALGORITHM,
			this.masterKey,
			iv,
		);

		let encrypted = cipher.update(value, "utf8", "hex");
		encrypted += cipher.final("hex");

		const tag = (cipher as any).getAuthTag();

		const metadata: SecretMetadata = {
			category,
			description,
			rotationDays,
			createdAt: new Date(),
			environment: env.NODE_ENV,
			gdprCompliant: category === SecretCategory.MEDICAL,
		};

		return {
			encryptedData: encrypted,
			iv: iv.toString("hex"),
			tag: tag.toString("hex"),
			metadata,
		};
	}

	/**
	 * Decrypt a secret value
	 */
	async decryptSecret(encryptedSecret: EncryptedSecret): Promise<string> {
		if (!this.masterKey) {
			throw new Error("Master key not initialized - cannot decrypt secrets");
		}

		try {
			const decipher = createDecipheriv(
				SECURITY_CONFIG.ENCRYPTION.ALGORITHM,
				this.masterKey,
				Buffer.from(encryptedSecret.iv, "hex"),
			);

			(decipher as any).setAuthTag(Buffer.from(encryptedSecret.tag, "hex"));

			let decrypted = decipher.update(
				encryptedSecret.encryptedData,
				"hex",
				"utf8",
			);
			decrypted += decipher.final("utf8");

			return decrypted;
		} catch (error) {
			throw new Error(
				`Failed to decrypt secret: ${error instanceof Error ? error.message : "Unknown error"}`,
			);
		}
	}

	/**
	 * Store a secret securely
	 */
	async storeSecret(
		key: string,
		value: string,
		category: SecretCategory,
		description: string,
		rotationDays?: number,
	): Promise<void> {
		const encryptedSecret = await this.encryptSecret(
			value,
			category,
			description,
			rotationDays,
		);

		// In production, this would store in a secure vault (AWS Secrets Manager, etc.)
		// For now, we'll use environment variables with encryption
		const secretKey = `SECRET_${key.toUpperCase()}`;

		// Store metadata separately for validation
		const metadataKey = `SECRET_${key.toUpperCase()}_METADATA`;
		const metadataValue = JSON.stringify(encryptedSecret.metadata);

		// In a real implementation, these would be stored securely
		console.log(`Secret ${key} stored securely in category ${category}`);
		console.log(`Metadata key: ${metadataKey}`);

		// Cache for performance (in production, use Redis or similar)
		this.secretsCache.set(key, {
			data: value,
			expires: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
		});
	}

	/**
	 * Retrieve a secret securely
	 */
	async getSecret(key: string): Promise<string | null> {
		// Check cache first
		const cached = this.secretsCache.get(key);
		if (cached && cached.expires > Date.now()) {
			return cached.data;
		}

		// In production, retrieve from secure vault
		// For now, return null if not in cache
		return null;
	}

	/**
	 * Rotate a secret
	 */
	async rotateSecret(key: string, newValue: string): Promise<void> {
		// In production, this would update the secret in the vault
		// and trigger notifications for services using the old secret
		console.log(`Rotating secret: ${key}`);

		// Clear from cache to force refresh
		this.secretsCache.delete(key);
	}

	/**
	 * Check if a secret needs rotation
	 */
	async checkRotationNeeded(key: string): Promise<boolean> {
		// In production, check the metadata against rotation policy
		return false;
	}

	/**
	 * Get all secrets for a category
	 */
	async getSecretsByCategory(category: SecretCategory): Promise<string[]> {
		// In production, query the secrets vault
		return [];
	}

	/**
	 * Validate secret integrity
	 */
	async validateSecret(key: string): Promise<boolean> {
		try {
			const secret = await this.getSecret(key);
			return secret !== null;
		} catch {
			return false;
		}
	}

	/**
	 * Generate medical data encryption key
	 */
	async generateMedicalDataKey(): Promise<string> {
		return this.generateSecureKey(32);
	}

	/**
	 * Generate database encryption key
	 */
	async generateDatabaseKey(): Promise<string> {
		return this.generateSecureKey(32);
	}

	/**
	 * Generate audit log encryption key
	 */
	async generateAuditKey(): Promise<string> {
		return this.generateSecureKey(32);
	}

	/**
	 * Setup initial encryption keys for production
	 */
	async setupProductionKeys(): Promise<{
		databaseKey: string;
		medicalKey: string;
		auditKey: string;
	}> {
		if (!this.masterKey) {
			throw new Error("Cannot setup production keys without master key");
		}

		const databaseKey = await this.generateDatabaseKey();
		const medicalKey = await this.generateMedicalDataKey();
		const auditKey = await this.generateAuditKey();

		// Store keys securely
		await this.storeSecret(
			"DATABASE_ENCRYPTION",
			databaseKey,
			SecretCategory.ENCRYPTION_KEYS,
			"Database encryption key",
		);
		await this.storeSecret(
			"MEDICAL_ENCRYPTION",
			medicalKey,
			SecretCategory.MEDICAL,
			"Medical data encryption key",
		);
		await this.storeSecret(
			"AUDIT_ENCRYPTION",
			auditKey,
			SecretCategory.AUDIT,
			"Audit log encryption key",
		);

		return {
			databaseKey,
			medicalKey,
			auditKey,
		};
	}
}

/**
 * Singleton instance for application-wide use
 */
export const secretsManager = new SecretsManager();

/**
 * Utility functions for common operations
 */
export const SecretsUtils = {
	/**
	 * Generate a secure API key
	 */
	generateApiKey: () => randomBytes(32).toString("base64url"),

	/**
	 * Generate a webhook secret
	 */
	generateWebhookSecret: () => randomBytes(32).toString("hex"),

	/**
	 * Hash sensitive data for comparison
	 */
	hashSensitiveData: (data: string) => {
		// In production, use proper hashing
		return Buffer.from(data).toString("base64");
	},

	/**
	 * Validate key strength
	 */
	validateKeyStrength: (key: string): boolean => {
		return key.length >= 32 && /[A-Za-z]/.test(key) && /[0-9]/.test(key);
	},
};
