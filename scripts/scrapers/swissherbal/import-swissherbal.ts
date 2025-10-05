/*
  Import SwissHerbal scraped products into MongoDB (ComprehensiveSupplement)

  IMPORTANT: This writes to the database. Run only after review/approval.
  Expects MONGODB_URI in env and existing codebase connection utilities.

  Usage:
    bun scripts/scrapers/swissherbal/import-swissherbal.ts scripts/scrapers/swissherbal/out/swissherbal-products.ndjson
*/

import fs from "node:fs";
import path from "node:path";
import { config } from "dotenv";
config();

// Direct imports without path aliases (scripts are excluded from tsconfig)
import connectToDatabase from "../../../src/lib/db/mongodb.js";
import { ComprehensiveSupplement } from "../../../src/lib/db/models/index.js";

function nowISO() { return new Date().toISOString(); }

function toComprehensive(doc: any) {
  // Minimal viable mapping with safe defaults matching schema requirements
  const id = doc.id || `swissherbal-${Math.random().toString(36).slice(2)}`;
  const name = doc.name || id;
  const polishName = doc.polishName || name;
  const category = doc.category || "OTHER";
  const description = (doc.descriptionEN || doc.descriptionPL || "").slice(0, 5000);
  const polishDescription = (doc.descriptionPL || doc.descriptionEN || "").slice(0, 5000);
  const sourceUrl = doc.sourceUrl || "";

  return {
    id,
    name,
    polishName,
    category,
    description,
    polishDescription,
    sourceUrl,
    evidenceLevel: "MODERATE",
    activeCompounds: [],
    mechanisms: [],
    clinicalApplications: [],
    pharmacokinetics: {},
    safetyProfile: {
      pregnancyCategory: "UNKNOWN",
      breastfeedingSafety: "Unknown",
      pediatricUse: { approved: false },
    },
    sideEffects: [],
    interactions: [],
    dosageGuidelines: {
      therapeuticRange: { min: 0, optimal: 0, max: 0, unit: "mg" },
      frequency: "Daily",
      polishFrequency: "Codziennie",
    },
    clinicalEvidence: {
      totalStudies: 0, rctCount: 0, metaAnalyses: 0, observationalStudies: 0,
      lastUpdated: new Date(), keyStudies: []
    },
    economicData: {
      averageCostPerMonth: { low: 0, average: 0, high: 0, currency: "PLN" },
      costEffectivenessRating: "Fair",
      polishCostEffectivenessRating: "Umiarkowana",
      availabilityInPoland: true,
      prescriptionRequired: false,
      reimbursementStatus: "None",
    },
    qualityConsiderations: {},
    educationalContent: {
      beginnerExplanation: polishDescription,
      polishBeginnerExplanation: polishDescription,
      intermediateDetails: polishDescription,
      polishIntermediateDetails: polishDescription,
      expertAnalysis: polishDescription,
      polishExpertAnalysis: polishDescription,
      keyTakeaways: [], polishKeyTakeaways: [],
      commonMisconceptions: [], polishCommonMisconceptions: [],
      practicalTips: [], polishPracticalTips: [],
    },
    tags: ["swissherbal"],
    polishTags: ["swissherbal"],
    lastUpdated: new Date(),
    version: "1.0.0",
    isActive: true,
    searchKeywords: [name.toLowerCase()],
    polishSearchKeywords: [polishName.toLowerCase()],
  };
}

async function importNdjson(filePath: string) {
  await connectToDatabase();
  const lines = fs.readFileSync(filePath, "utf-8").split(/\r?\n/).filter(Boolean);
  let ok = 0, fail = 0;
  for (const line of lines) {
    try {
      const doc = JSON.parse(line);
      if (doc.error) { fail++; continue; }
      const mapped = toComprehensive(doc);
      await ComprehensiveSupplement.updateOne(
        { id: mapped.id },
        { $set: mapped },
        { upsert: true }
      );
      ok++;
    } catch (e) {
      fail++;
    }
  }
  console.log(`[${nowISO()}] Import complete. ok=${ok} fail=${fail}`);
}

async function main() {
  const fileArg = process.argv[2];
  if (!fileArg) {
    console.error("Path to NDJSON required");
    process.exit(2);
  }
  const full = path.isAbsolute(fileArg) ? fileArg : path.join(process.cwd(), fileArg);
  await importNdjson(full);
}

if (import.meta.main) {
  main().catch((e) => { console.error(e); process.exit(1); });
}

