#!/usr/bin/env tsx
/**
 * Supplement Template Generator
 * Generates TypeScript supplement profile templates with Polish localization
 * Usage: pnpm generate:supplement <name> <category>
 */

import fs from "node:fs";
import path from "node:path";

interface SupplementTemplateOptions {
	name: string;
	polishName: string;
	category: string;
	id: string;
}

const CATEGORIES = {
	NOOTROPIC: "Nootropik",
	VITAMIN: "Witamina",
	MINERAL: "Minerał",
	AMINO_ACID: "Aminokwas",
	HERB: "Zioło",
	ADAPTOGEN: "Adaptogen",
	COENZYME: "Koenzym",
	FATTY_ACID: "Kwas tłuszczowy",
	OTHER: "Inne",
};

function generateSupplementTemplate(
	options: SupplementTemplateOptions,
): string {
	const { name, polishName, category, id } = options;

	return `/**
 * ${name} (${polishName})
 * Category: ${category}
 * Evidence Level: [STRONG/MODERATE/WEAK/INSUFFICIENT]
 */

import type { SupplementWithRelations } from '@/types/supplement';

export const ${id}Profile: SupplementWithRelations = {
  id: '${id}',
  name: '${name}',
  polishName: '${polishName}',
  scientificName: '', // Nazwa naukowa
  commonNames: ['${name}'],
  polishCommonNames: ['${polishName}'],
  category: '${category}',
  description: 'Brief English description of ${name}.',
  polishDescription: 'Krótki polski opis ${polishName}.',
  evidenceLevel: 'MODERATE', // STRONG, MODERATE, WEAK, INSUFFICIENT, CONFLICTING
  
  // Active Compounds - Aktywne składniki
  activeCompounds: [
    {
      name: 'Main Active Compound',
      polishName: 'Główny aktywny składnik',
      concentration: '100mg per serving',
      bioavailability: 85, // 0-100%
      halfLife: '4-6 hours',
      metabolicPathway: ['Liver metabolism', 'Renal excretion'],
      targetReceptors: ['Receptor type'],
    }
  ],
  
  // Mechanisms of Action - Mechanizmy działania
  mechanisms: [
    {
      pathway: 'Primary mechanism pathway',
      polishPathway: 'Główny szlak mechanizmu',
      description: 'How it works in the body',
      polishDescription: 'Jak działa w organizmie',
      evidenceLevel: 'MODERATE',
      targetSystems: ['Nervous system', 'Cardiovascular system'],
      timeToEffect: '30-60 minutes',
      duration: '4-6 hours',
    }
  ],
  
  // Clinical Applications - Zastosowania kliniczne
  clinicalApplications: [
    {
      condition: 'Primary health condition',
      polishCondition: 'Główny stan zdrowia',
      indication: 'When to use',
      polishIndication: 'Kiedy stosować',
      efficacy: 'moderate', // high, moderate, low, insufficient
      effectivenessRating: 7, // 0-10
      evidenceLevel: 'MODERATE',
      recommendedDose: '100-200mg daily',
      duration: '4-12 weeks',
      effectSize: 0.5, // Cohen's d
      studyCount: 15,
      participantCount: 1200,
      recommendationGrade: 'B',
    }
  ],
  
  // Dosage Guidelines - Wytyczne dawkowania
  dosageGuidelines: {
    standardDose: {
      amount: 100,
      unit: 'mg',
      frequency: 'daily',
      polishFrequency: 'dziennie',
      timing: 'with meals',
      polishTiming: 'z posiłkami',
    },
    minimumEffectiveDose: {
      amount: 50,
      unit: 'mg',
      frequency: 'daily',
      polishFrequency: 'dziennie',
    },
    maximumSafeDose: {
      amount: 400,
      unit: 'mg',
      frequency: 'daily',
      polishFrequency: 'dziennie',
    },
    loadingPhase: undefined,
    cyclingRecommendation: 'No cycling required',
    polishCyclingRecommendation: 'Nie wymaga cyklowania',
  },
  
  // Side Effects - Skutki uboczne
  sideEffects: [
    {
      effect: 'Mild side effect',
      polishEffect: 'Łagodny skutek uboczny',
      frequency: 'rare', // common, uncommon, rare, very_rare
      severity: 'mild', // mild, moderate, severe
      polishSeverity: 'łagodny',
      onset: 'immediate',
      polishOnset: 'natychmiastowy',
      management: 'Reduce dose or discontinue',
      polishManagement: 'Zmniejsz dawkę lub przerwij stosowanie',
    }
  ],
  
  // Interactions - Interakcje
  interactions: [
    {
      substance: 'Interacting substance',
      polishSubstance: 'Substancja wchodząca w interakcję',
      type: 'synergistic', // synergistic, antagonistic, additive
      polishType: 'synergiczna',
      severity: 'moderate', // mild, moderate, severe
      polishSeverity: 'umiarkowana',
      mechanism: 'How they interact',
      polishMechanism: 'Jak wchodzą w interakcję',
      recommendation: 'Monitor closely',
      polishRecommendation: 'Monitoruj uważnie',
      evidenceLevel: 'MODERATE',
    }
  ],
  
  // Research Studies - Badania naukowe
  researchStudies: [
    {
      title: 'Study title',
      polishTitle: 'Tytuł badania',
      authors: ['Author A', 'Author B'],
      year: 2023,
      journal: 'Journal Name',
      studyType: 'RANDOMIZED_CONTROLLED_TRIAL',
      sampleSize: 100,
      duration: '12 weeks',
      findings: 'Key findings',
      polishFindings: 'Główne odkrycia',
      evidenceLevel: 'MODERATE',
      doi: '10.1234/example',
      pubmedId: '12345678',
    }
  ],
  
  // Tags for search - Tagi do wyszukiwania
  tags: ['${category.toLowerCase()}', 'supplement', 'health'],
  
  // Knowledge Graph Node ID (optional)
  knowledgeNodeId: null,
};
`;
}

function toKebabCase(str: string): string {
	return str
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "");
}

function toCamelCase(str: string): string {
	return str
		.replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
		.replace(/^[A-Z]/, (chr) => chr.toLowerCase());
}

async function main() {
	const args = process.argv.slice(2);

	if (args.length < 3) {
		console.log(
			"Usage: pnpm generate:supplement <name> <polishName> <category>",
		);
		console.log(
			'Example: pnpm generate:supplement "Piracetam" "Piracetam" "NOOTROPIC"',
		);
		console.log("\\nAvailable categories:", Object.keys(CATEGORIES).join(", "));
		process.exit(1);
	}

	const [name, polishName, category] = args;

	if (!name || !polishName || !category) {
		console.error("Missing required arguments");
		process.exit(1);
	}

	if (!Object.keys(CATEGORIES).includes(category)) {
		console.error(`Invalid category: ${category}`);
		console.log("Available categories:", Object.keys(CATEGORIES).join(", "));
		process.exit(1);
	}

	const id = toKebabCase(name);
	const fileName = `${id}.ts`;
	const filePath = path.join(
		process.cwd(),
		"src",
		"data",
		"supplements",
		fileName,
	);

	// Check if file already exists
	if (fs.existsSync(filePath)) {
		console.error(`File already exists: ${filePath}`);
		process.exit(1);
	}

	const template = generateSupplementTemplate({
		name,
		polishName,
		category,
		id: toCamelCase(id),
	});

	fs.writeFileSync(filePath, template, "utf-8");

	console.log(`✅ Created supplement template: ${filePath}`);
	console.log("\\n📝 Next steps:");
	console.log(`1. Edit ${fileName} and fill in the details`);
	console.log("2. Add export to src/data/supplements/index.ts:");
	console.log(`   export { ${toCamelCase(id)}Profile } from './${id}';`);
	console.log("3. Run: pnpm db:seed to add to database");
}

main().catch(console.error);
