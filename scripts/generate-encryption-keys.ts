#!/usr/bin/env tsx
/**
 * Encryption Keys Generation Script
 * Generates secure encryption keys for production deployment
 */

import { writeFileSync } from "fs";
import { join } from "path";
import { randomBytes, scrypt } from "crypto";
import { promisify } from "util";
import { SecretsManager, SecretCategory } from "../src/lib/security/secrets-manager.js";

const scryptAsync = promisify(scrypt);

interface GeneratedKeys {
	databaseKey: string;
	medicalKey: string;
	auditKey: string;
	masterKey: string;
	timestamp: string;
}

/**
 * Generate a master key for encryption
 */
async function generateMasterKey(): Promise<string> {
	const password = randomBytes(64).toString("hex");
	const salt = randomBytes(16);
	const key = (await scryptAsync(password, salt, 32)) as Buffer;
	return key.toString("hex");
}

/**
 * Generate all required encryption keys
 */
async function generateEncryptionKeys(): Promise<GeneratedKeys> {
	const secretsManager = new SecretsManager();

	// Initialize with a temporary master key for generation
	const tempMasterKey = randomBytes(32).toString("hex");
	secretsManager["masterKey"] = Buffer.from(tempMasterKey, "hex");

	const databaseKey = await secretsManager.generateDatabaseKey();
	const medicalKey = await secretsManager.generateMedicalDataKey();
	const auditKey = await secretsManager.generateAuditKey();
	const masterKey = await generateMasterKey();

	return {
		databaseKey,
		medicalKey,
		auditKey,
		masterKey,
		timestamp: new Date().toISOString(),
	};
}

/**
 * Save keys to environment file
 */
function saveKeysToEnvFile(keys: GeneratedKeys, environment: string): void {
	const envFile = join(process.cwd(), `.env.${environment}`);

	let envContent = "";

	// Read existing file if it exists
	try {
		const existingContent = require("fs").readFileSync(envFile, "utf8");
		envContent = existingContent;
	} catch {
		// File doesn't exist, start fresh
	}

	// Update or add encryption keys
	const keyMappings = {
		"DATABASE_ENCRYPTION_KEY": keys.databaseKey,
		"MEDICAL_DATA_ENCRYPTION_KEY": keys.medicalKey,
		"AUDIT_LOG_ENCRYPTION_KEY": keys.auditKey,
	};

	for (const [key, value] of Object.entries(keyMappings)) {
		const regex = new RegExp(`^${key}=.*$`, "m");
		const replacement = `${key}="${value}"`;

		if (regex.test(envContent)) {
			envContent = envContent.replace(regex, replacement);
		} else {
			envContent += `\n${replacement}`;
		}
	}

	writeFileSync(envFile, envContent);
	console.log(`✅ Updated ${envFile} with new encryption keys`);
}

/**
 * Generate keys for specific environment
 */
async function generateKeysForEnvironment(environment: string): Promise<void> {
	console.log(`🔐 Generating encryption keys for ${environment} environment...`);

	try {
		const keys = await generateEncryptionKeys();

		// Save to environment file
		saveKeysToEnvFile(keys, environment);

		// Save keys metadata for reference (not the actual keys)
		const metadataFile = join(process.cwd(), `keys-${environment}-${Date.now()}.json`);
		const metadata = {
			timestamp: keys.timestamp,
			environment,
			keyIds: {
				databaseKey: `db_key_${randomBytes(8).toString("hex")}`,
				medicalKey: `med_key_${randomBytes(8).toString("hex")}`,
				auditKey: `audit_key_${randomBytes(8).toString("hex")}`,
			},
			rotationReminder: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days
		};

		writeFileSync(metadataFile, JSON.stringify(metadata, null, 2));
		console.log(`📋 Keys metadata saved to ${metadataFile}`);

		console.log("✅ Encryption keys generated successfully!");
		console.log("⚠️  IMPORTANT: Store these keys securely and rotate them regularly");
		console.log(`🔄 Next rotation recommended: ${metadata.rotationReminder}`);

	} catch (error) {
		console.error("❌ Failed to generate encryption keys:", error);
		process.exit(1);
	}
}

/**
 * Validate existing keys
 */
async function validateKeys(): Promise<void> {
	console.log("🔍 Validating existing encryption keys...");

	const secretsManager = new SecretsManager();

	try {
		// Test encryption/decryption cycle
		const testData = "test-medical-data";
		const encrypted = await secretsManager.encryptSecret(
			testData,
			SecretCategory.MEDICAL,
			"Test encryption"
		);
		const decrypted = await secretsManager.decryptSecret(encrypted);

		if (decrypted === testData) {
			console.log("✅ Encryption/decryption cycle working correctly");
		} else {
			console.error("❌ Encryption/decryption cycle failed");
			process.exit(1);
		}
	} catch (error) {
		console.error("❌ Key validation failed:", error);
		process.exit(1);
	}
}

/**
 * Main execution function
 */
async function main(): Promise<void> {
	const args = process.argv.slice(2);
	const command = args[0];

	console.log("🔐 Suplementor Encryption Keys Manager");
	console.log("=====================================");

	switch (command) {
		case "generate":
			const environment = args[1] || "production";
			await generateKeysForEnvironment(environment);
			break;

		case "validate":
			await validateKeys();
			break;

		case "rotate":
			const keyToRotate = args[1];
			if (!keyToRotate) {
				console.error("❌ Please specify which key to rotate");
				process.exit(1);
			}
			console.log(`🔄 Rotating key: ${keyToRotate}`);
			// Implementation would rotate specific key
			break;

		default:
			console.log("Usage:");
			console.log("  tsx scripts/generate-encryption-keys.ts generate [environment]");
			console.log("  tsx scripts/generate-encryption-keys.ts validate");
			console.log("  tsx scripts/generate-encryption-keys.ts rotate <key-name>");
			console.log("");
			console.log("Environments: development, staging, production");
			console.log("Key names: database, medical, audit");
			break;
	}
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
	main().catch(console.error);
}

export { generateEncryptionKeys, validateKeys, generateKeysForEnvironment };