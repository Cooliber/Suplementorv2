#!/usr/bin/env bun

/**
 * Refactor comprehensive-supplements-database.ts into atomic structure
 * Each supplement gets its own file in src/data/comprehensive-supplements/
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const sourceFile = join(
	process.cwd(),
	"src/data/comprehensive-supplements-database.ts",
);
const targetDir = join(process.cwd(), "src/data/comprehensive-supplements");

console.log("🔧 Refactoring comprehensive supplements database...");

// Create target directory
if (!existsSync(targetDir)) {
	mkdirSync(targetDir, { recursive: true });
	console.log("✅ Created directory:", targetDir);
}

const content = readFileSync(sourceFile, "utf-8");

// Extract the supplements array
const arrayMatch = content.match(
	/export const comprehensiveSupplementsDatabase:\s*ComprehensiveSupplementProfile\[\]\s*=\s*\[([\s\S]*)\];/,
);

if (!arrayMatch) {
	console.error("❌ Could not find supplements array");
	console.log("Trying alternative pattern...");
	process.exit(1);
}

const supplementsContent = arrayMatch[1];

// Split by supplement comments (e.g., "// 1. Omega-3 Fatty Acids")
const supplementBlocks = supplementsContent.split(/\/\/\s*\d+\.\s*/);

let processedCount = 0;
const supplementIds: string[] = [];

for (const block of supplementBlocks) {
	if (!block.trim()) continue;

	// Extract supplement name from comment and ID from object
	const nameMatch = block.match(/^([^\n]+)/);
	const idMatch = block.match(/id:\s*"([^"]+)"/);

	if (!nameMatch || !idMatch) continue;

	const supplementName = nameMatch[1].trim();
	const supplementId = idMatch[1];
	supplementIds.push(supplementId);

	// Extract the object (everything between first { and last })
	const objectStart = block.indexOf("{");
	if (objectStart === -1) continue;

	// Find matching closing brace
	let braceCount = 0;
	let objectEnd = -1;
	for (let i = objectStart; i < block.length; i++) {
		if (block[i] === "{") braceCount++;
		if (block[i] === "}") {
			braceCount--;
			if (braceCount === 0) {
				objectEnd = i;
				break;
			}
		}
	}

	if (objectEnd === -1) continue;

	const objectContent = block.substring(objectStart, objectEnd + 1);

	// Create file content
	const fileContent = `/**
 * ${supplementName}
 * Comprehensive supplement profile with Polish translations
 */

import type { ComprehensiveSupplementProfile } from "./types";

export const ${supplementId.replace(/-/g, "_")}: ComprehensiveSupplementProfile = ${objectContent};
`;

	// Write to file
	const fileName = `${supplementId}.ts`;
	const filePath = join(targetDir, fileName);
	writeFileSync(filePath, fileContent, "utf-8");

	processedCount++;
	console.log(`✅ Created: ${fileName}`);
}

// Create index file
const indexContent = `/**
 * Comprehensive Supplements Database - Atomic Structure
 * Each supplement is in its own file for better maintainability
 */

export * from "./types";

${supplementIds.map((id) => `export { ${id.replace(/-/g, "_")} } from "./${id}";`).join("\n")}

// Export all supplements as array
import type { ComprehensiveSupplementProfile } from "./types";
${supplementIds.map((id) => `import { ${id.replace(/-/g, "_")} } from "./${id}";`).join("\n")}

export const comprehensiveSupplementsDatabase: ComprehensiveSupplementProfile[] = [
${supplementIds.map((id) => `\t${id.replace(/-/g, "_")},`).join("\n")}
];

// Legacy export for backwards compatibility
export const comprehensiveSupplements = comprehensiveSupplementsDatabase;
`;

writeFileSync(join(targetDir, "index.ts"), indexContent, "utf-8");
console.log("✅ Created: index.ts");

console.log("\n🎉 Refactoring complete!");
console.log(`📊 Processed ${processedCount} supplements`);
console.log(`📁 Files created in: ${targetDir}`);
console.log("\n💡 Next steps:");
console.log(
	`   1. Update imports to use: import { comprehensiveSupplements } from "@/data/comprehensive-supplements"`,
);
console.log("   2. Remove old comprehensive-supplements-database.ts file");
