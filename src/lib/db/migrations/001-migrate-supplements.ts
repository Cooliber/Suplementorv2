/**
 * Migration Script: Comprehensive Supplements Data
 * Migrates supplement data from static files to MongoDB with Polish translations
 */

import { comprehensiveSupplementsDatabase } from "@/data/comprehensive-supplements";
import { ComprehensiveSupplement } from "../models";
import connectToDatabase from "../mongodb";

interface MigrationResult {
	success: boolean;
	created: number;
	updated: number;
	errors: string[];
	duration: number;
}

/**
 * Migrate comprehensive supplements data to MongoDB
 */
export async function migrateSupplements(): Promise<MigrationResult> {
	const startTime = Date.now();
	const result: MigrationResult = {
		success: false,
		created: 0,
		updated: 0,
		errors: [],
		duration: 0,
	};

	try {
		console.log("🔄 Starting supplements migration...");

		// Connect to database
		await connectToDatabase();

		// Process each supplement in the database
		for (const supplement of comprehensiveSupplementsDatabase) {
			try {
				// Check if supplement already exists
				const existingSupplement = await ComprehensiveSupplement.findOne({
					id: supplement.id,
				});

				if (existingSupplement) {
					// Update existing supplement
					await ComprehensiveSupplement.findOneAndUpdate(
						{ id: supplement.id },
						{
							...supplement,
							lastUpdated: new Date(),
							version: "1.0.0",
						},
						{ upsert: true, new: true },
					);
					result.updated++;
					console.log(`✅ Updated supplement: ${supplement.polishName}`);
				} else {
					// Create new supplement
					const newSupplement = new ComprehensiveSupplement({
						...supplement,
						lastUpdated: new Date(),
						version: "1.0.0",
						isActive: true,
					});

					await newSupplement.save();
					result.created++;
					console.log(`✨ Created supplement: ${supplement.polishName}`);
				}
			} catch (error) {
				const errorMessage = `Failed to process supplement ${supplement.id}: ${error}`;
				result.errors.push(errorMessage);
				console.error(`❌ ${errorMessage}`);
			}
		}

		result.success = result.errors.length === 0;
		result.duration = Date.now() - startTime;

		console.log("🎉 Supplements migration completed:");
		console.log(`   Created: ${result.created}`);
		console.log(`   Updated: ${result.updated}`);
		console.log(`   Errors: ${result.errors.length}`);
		console.log(`   Duration: ${result.duration}ms`);

		return result;
	} catch (error) {
		result.errors.push(`Migration failed: ${error}`);
		result.duration = Date.now() - startTime;
		console.error(`❌ Supplements migration failed: ${error}`);
		return result;
	}
}

/**
 * Create indexes for optimal performance
 */
export async function createSupplementIndexes(): Promise<void> {
	try {
		console.log("🔄 Creating supplement indexes...");

		await connectToDatabase();

		// Text search indexes
		await ComprehensiveSupplement.collection.createIndex(
			{
				name: "text",
				polishName: "text",
				description: "text",
				polishDescription: "text",
				"educationalContent.polishKeyTakeaways": "text",
			},
			{
				name: "supplement_text_search",
				weights: {
					polishName: 10,
					name: 8,
					polishDescription: 5,
					description: 3,
					"educationalContent.polishKeyTakeaways": 2,
				},
			},
		);

		// Category and evidence level compound index
		await ComprehensiveSupplement.collection.createIndex(
			{
				category: 1,
				evidenceLevel: 1,
				isActive: 1,
			},
			{ name: "category_evidence_active" },
		);

		// Clinical applications index
		await ComprehensiveSupplement.collection.createIndex(
			{
				"clinicalApplications.polishCondition": 1,
				"clinicalApplications.effectivenessRating": -1,
			},
			{ name: "clinical_applications" },
		);

		// Tags indexes
		await ComprehensiveSupplement.collection.createIndex(
			{
				polishTags: 1,
			},
			{ name: "polish_tags" },
		);

		await ComprehensiveSupplement.collection.createIndex(
			{
				tags: 1,
			},
			{ name: "english_tags" },
		);

		// Active compounds index
		await ComprehensiveSupplement.collection.createIndex(
			{
				"activeCompounds.polishName": 1,
			},
			{ name: "active_compounds" },
		);

		// Mechanisms index
		await ComprehensiveSupplement.collection.createIndex(
			{
				"mechanisms.polishPathway": 1,
				"mechanisms.evidenceLevel": 1,
			},
			{ name: "mechanisms" },
		);

		// Economic data index
		await ComprehensiveSupplement.collection.createIndex(
			{
				"economicData.availabilityInPoland": 1,
				"economicData.averageCostPerMonth.average": 1,
			},
			{ name: "economic_data" },
		);

		// Last updated index for cache invalidation
		await ComprehensiveSupplement.collection.createIndex(
			{
				lastUpdated: -1,
				isActive: 1,
			},
			{ name: "last_updated" },
		);

		console.log("✅ Supplement indexes created successfully");
	} catch (error) {
		console.error("❌ Failed to create supplement indexes:", error);
		throw error;
	}
}

/**
 * Validate migrated supplement data
 */
export async function validateSupplementMigration(): Promise<{
	isValid: boolean;
	issues: string[];
	stats: {
		total: number;
		byCategory: Record<string, number>;
		byEvidenceLevel: Record<string, number>;
		withPolishTranslations: number;
		withClinicalApplications: number;
	};
}> {
	try {
		console.log("🔄 Validating supplement migration...");

		await connectToDatabase();

		const issues: string[] = [];

		// Get all supplements
		const supplements = await ComprehensiveSupplement.find({ isActive: true });
		const total = supplements.length;

		if (total === 0) {
			issues.push("No supplements found in database");
			return {
				isValid: false,
				issues,
				stats: {
					total: 0,
					byCategory: {},
					byEvidenceLevel: {},
					withPolishTranslations: 0,
					withClinicalApplications: 0,
				},
			};
		}

		// Calculate statistics
		const byCategory: Record<string, number> = {};
		const byEvidenceLevel: Record<string, number> = {};
		let withPolishTranslations = 0;
		let withClinicalApplications = 0;

		for (const supplement of supplements) {
			// Category stats
			byCategory[supplement.category] =
				(byCategory[supplement.category] || 0) + 1;

			// Evidence level stats
			byEvidenceLevel[supplement.evidenceLevel] =
				(byEvidenceLevel[supplement.evidenceLevel] || 0) + 1;

			// Polish translations check
			if (supplement.polishName && supplement.polishDescription) {
				withPolishTranslations++;
			} else {
				issues.push(`Supplement ${supplement.id} missing Polish translations`);
			}

			// Clinical applications check
			if (
				supplement.clinicalApplications &&
				supplement.clinicalApplications.length > 0
			) {
				withClinicalApplications++;
			}

			// Required fields validation
			if (
				!supplement.name ||
				!supplement.category ||
				!supplement.evidenceLevel
			) {
				issues.push(`Supplement ${supplement.id} missing required fields`);
			}

			// Educational content validation
			if (!supplement.educationalContent?.polishBeginnerExplanation) {
				issues.push(
					`Supplement ${supplement.id} missing Polish educational content`,
				);
			}
		}

		const isValid = issues.length === 0;

		console.log("✅ Validation completed:");
		console.log(`   Total supplements: ${total}`);
		console.log(`   With Polish translations: ${withPolishTranslations}`);
		console.log(`   With clinical applications: ${withClinicalApplications}`);
		console.log(`   Issues found: ${issues.length}`);

		return {
			isValid,
			issues,
			stats: {
				total,
				byCategory,
				byEvidenceLevel,
				withPolishTranslations,
				withClinicalApplications,
			},
		};
	} catch (error) {
		console.error("❌ Validation failed:", error);
		return {
			isValid: false,
			issues: [`Validation error: ${error}`],
			stats: {
				total: 0,
				byCategory: {},
				byEvidenceLevel: {},
				withPolishTranslations: 0,
				withClinicalApplications: 0,
			},
		};
	}
}

/**
 * Run the complete supplement migration process
 */
export async function runSupplementMigration(): Promise<void> {
	try {
		console.log("🚀 Starting complete supplement migration process...");

		// Step 1: Migrate data
		const migrationResult = await migrateSupplements();

		if (!migrationResult.success) {
			throw new Error(
				`Migration failed with ${migrationResult.errors.length} errors`,
			);
		}

		// Step 2: Create indexes
		await createSupplementIndexes();

		// Step 3: Validate migration
		const validationResult = await validateSupplementMigration();

		if (!validationResult.isValid) {
			console.warn("⚠️ Migration completed with validation issues:");
			validationResult.issues.forEach((issue) => console.warn(`   - ${issue}`));
		}

		console.log(
			"🎉 Complete supplement migration process finished successfully!",
		);
	} catch (error) {
		console.error("❌ Complete supplement migration process failed:", error);
		throw error;
	}
}

// Export for use in scripts
export default {
	migrateSupplements,
	createSupplementIndexes,
	validateSupplementMigration,
	runSupplementMigration,
};
