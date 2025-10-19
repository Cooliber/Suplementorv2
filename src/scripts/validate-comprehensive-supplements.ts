/**
 * Comprehensive Supplement Data Validation Script
 * Validates the comprehensive-supplements.ts file against Zod schemas
 */

import {
  comprehensiveSupplements,
  validateSupplementData,
  supplementDatabaseMetadata
} from "../lib/data/comprehensive-supplements";
import { validateSupplement } from "../types/supplement";

/**
 * Main validation function
 */
async function validateComprehensiveSupplements() {
  console.log("🔍 Starting comprehensive supplement data validation...\n");

  // Database metadata
  console.log("📊 Database Metadata:");
  console.log(`- Total supplements: ${supplementDatabaseMetadata.totalSupplements}`);
  console.log(`- Categories: ${supplementDatabaseMetadata.categories.join(", ")}`);
  console.log(`- Evidence levels: ${supplementDatabaseMetadata.evidenceLevels.join(", ")}`);
  console.log(`- High evidence count: ${supplementDatabaseMetadata.highEvidenceCount}`);
  console.log(`- Version: ${supplementDatabaseMetadata.version}\n`);

  // Database integrity validation
  const integrityCheck = validateSupplementData();
  console.log("🔧 Database Integrity Check:");
  console.log(`- Valid: ${integrityCheck.isValid ? "✅" : "❌"}`);
  if (!integrityCheck.isValid) {
    console.log("- Errors:");
    integrityCheck.errors.forEach((error) => console.log(`  • ${error}`));
  }
  console.log();

  // Individual supplement validation
  console.log("🧪 Individual Supplement Validation:");
  let validCount = 0;
  let errorCount = 0;

  for (const supplement of comprehensiveSupplements) {
    const validation = validateSupplement(supplement);

    if (validation.success) {
      console.log(`✅ ${supplement.name} (${supplement.polishName}) - Valid`);
      validCount++;
    } else {
      console.log(`❌ ${supplement.name} (${supplement.polishName}) - Invalid`);
      validation.error.forEach((err) => {
        console.log(`   • ${err.message}`);
      });
      errorCount++;
    }
  }

  console.log("\n📈 Validation Summary:");
  console.log(`- Valid supplements: ${validCount}`);
  console.log(`- Invalid supplements: ${errorCount}`);
  console.log(
    `- Success rate: ${((validCount / (validCount + errorCount)) * 100).toFixed(1)}%`,
  );

  // Content quality checks
  console.log("\n🎯 Content Quality Analysis:");

  // Evidence level distribution
  const evidenceDistribution = comprehensiveSupplements.reduce(
    (acc, s) => {
      acc[s.evidenceLevel] = (acc[s.evidenceLevel] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  console.log("- Evidence level distribution:");
  Object.entries(evidenceDistribution).forEach(([level, count]) => {
    console.log(`  • ${level}: ${count}`);
  });

  // Category distribution
  const categoryDistribution = comprehensiveSupplements.reduce(
    (acc, s) => {
      acc[s.category] = (acc[s.category] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  console.log("- Category distribution:");
  Object.entries(categoryDistribution).forEach(([category, count]) => {
    console.log(`  • ${category}: ${count}`);
  });

  // Average content metrics
  const avgClinicalApps =
    comprehensiveSupplements.reduce(
      (sum, s) => sum + s.clinicalApplications.length,
      0,
    ) / comprehensiveSupplements.length;
  console.log(
    `- Average clinical applications per supplement: ${avgClinicalApps.toFixed(1)}`,
  );

  const avgMechanisms =
    comprehensiveSupplements.reduce((sum, s) => sum + s.mechanisms.length, 0) /
    comprehensiveSupplements.length;
  console.log(
    `- Average mechanisms per supplement: ${avgMechanisms.toFixed(1)}`,
  );

  const avgResearchStudies =
    comprehensiveSupplements.reduce((sum, s) => sum + s.researchStudies.length, 0) /
    comprehensiveSupplements.length;
  console.log(
    `- Average research studies per supplement: ${avgResearchStudies.toFixed(1)}`,
  );

  // Safety analysis
  const highRiskSupplements = comprehensiveSupplements.filter(s =>
    s.sideEffects.some(effect => effect.severity === "severe") ||
    s.interactions.some(interaction => interaction.severity === "severe")
  );
  console.log(`- High-risk supplements: ${highRiskSupplements.length}`);

  const safeSupplements = comprehensiveSupplements.filter(s =>
    !s.sideEffects.some(effect => effect.severity === "severe") &&
    !s.interactions.some(interaction => interaction.severity === "severe")
  );
  console.log(`- Safe supplements: ${safeSupplements.length}`);

  console.log("\n🎉 Validation complete!");

  if (integrityCheck.isValid && errorCount === 0) {
    console.log("✅ All supplements passed validation!");
    return true;
  }
  console.log("❌ Some issues found. Please review and fix.");
  return false;
}

/**
 * Export validation functions for use in tests
 */
export { validateComprehensiveSupplements };

// Run validation if script is executed directly
if (typeof window === "undefined" && typeof process !== "undefined") {
  validateComprehensiveSupplements()
    .then((success) => {
      console.log(success ? "✅ Validation passed" : "❌ Validation failed");
      process.exit(success ? 0 : 1);
    })
    .catch((error) => {
      console.error("❌ Validation failed with error:", error);
      process.exit(1);
    });
}