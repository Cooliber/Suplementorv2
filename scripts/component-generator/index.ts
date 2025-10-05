#!/usr/bin/env node

/**
 * Suplementor Component Generator
 * Main entry point that orchestrates all component generation systems
 */

import { ComponentGeneratorCLI } from "./cli.js";
import { FileStructureAutomation } from "./file-structure.js";
import { PolishLocalizationIntegration } from "./polish-localization.js";
import type { PolishLocalizationConfig } from "./polish-localization.js";
import { QualityValidationSystem } from "./quality-validation.js";
import type { QualityConfig } from "./quality-validation.js";
import { TemplateEngine } from "./template-engine.js";
import type { TemplateContext } from "./template-engine.js";

export interface ComponentGeneratorOptions {
	name: string;
	type: "ui" | "feature" | "page" | "layout";
	description?: string;
	author?: string;
	features?: string[];
	polishLocalization?: boolean;
	accessibility?: boolean;
	performance?: boolean;
	customVariables?: Array<{ name: string; value: string }>;
	skipValidation?: boolean;
	outputPath?: string;
}

export class ComponentGenerator {
	private templateEngine: TemplateEngine;
	private fileAutomation: FileStructureAutomation;
	private polishLocalization: PolishLocalizationIntegration;
	private qualityValidation: QualityValidationSystem;

	constructor() {
		// Initialize all systems
		const context: TemplateContext = {
			componentName: "",
			componentType: "ui",
			description: "",
			author: "Suplementor Team",
			features: [],
			polishLocalization: true,
			accessibility: true,
			performance: true,
			variables: [],
		};

		this.templateEngine = new TemplateEngine(context);
		this.fileAutomation = new FileStructureAutomation(context);

		const polishConfig: PolishLocalizationConfig = {
			enableMedicalTerms: true,
			enableCharacterValidation: true,
			enableCulturalCompliance: true,
			targetAudience: "medical",
			formalityLevel: "formal",
		};
		this.polishLocalization = new PolishLocalizationIntegration(polishConfig);

		const qualityConfig: QualityConfig = {
			enableAccessibility: true,
			enablePerformance: true,
			enablePolishValidation: true,
			enableTypeScript: true,
			enableStructure: true,
			performanceThreshold: 200,
			accessibilityLevel: "AA",
		};
		this.qualityValidation = new QualityValidationSystem(qualityConfig);
	}

	/**
	 * Generate component programmatically
	 */
	async generateComponent(options: ComponentGeneratorOptions): Promise<{
		success: boolean;
		componentPath: string;
		validationResults?: any;
		error?: string;
	}> {
		try {
			console.log(`🚀 Generating component: ${options.name}`);

			// Create template context
			const context: TemplateContext = {
				componentName: options.name,
				componentType: options.type,
				description:
					options.description ||
					`${options.name} component for Suplementor platform`,
				author: options.author || "Suplementor Team",
				features: options.features || [],
				polishLocalization: options.polishLocalization ?? true,
				accessibility: options.accessibility ?? true,
				performance: options.performance ?? true,
				variables: options.customVariables || [],
			};

			// Update systems with new context
			this.templateEngine = new TemplateEngine(context);
			this.fileAutomation = new FileStructureAutomation(context);

			// Get default structure
			const defaultStructure = this.fileAutomation.getDefaultStructure(
				options.type,
			);

			// Create complete structure
			const componentStructure = {
				componentName: options.name,
				basePath: options.outputPath || defaultStructure.basePath,
				templates: defaultStructure.templates,
			};

			// Validate structure
			const validation =
				this.fileAutomation.validateStructure(componentStructure);
			if (!validation.valid) {
				return {
					success: false,
					componentPath: "",
					error: `Validation failed: ${validation.errors.join(", ")}`,
				};
			}

			// Generate files
			await this.fileAutomation.createComponentStructure(componentStructure);

			const componentPath = `${componentStructure.basePath}/${options.name}`;

			// Run quality validation if not skipped
			let validationResults;
			if (!options.skipValidation) {
				console.log("🔍 Running quality validation...");
				validationResults =
					await this.qualityValidation.validateComponentStructure(
						componentPath,
						options.name,
					);
			}

			// Generate Polish localization data
			console.log("Polish localization enabled:", options.polishLocalization);
			if (options.polishLocalization) {
				console.log("Generating Polish localization data...");
				const localizationData =
					this.polishLocalization.generateLocalizationData(
						options.name,
						options.type,
					);

				console.log("🇵🇱 Polish localization data generated");
				console.log(
					`  📝 Translations: ${Object.keys(localizationData.translations).length} keys`,
				);
				console.log(
					`  🩺 Medical terms: ${localizationData.medicalTerms.length} terms`,
				);
			} else {
				console.log("Polish localization not enabled, skipping...");
			}

			return {
				success: true,
				componentPath,
				validationResults,
			};
		} catch (error) {
			return {
				success: false,
				componentPath: "",
				error: error instanceof Error ? error.message : String(error),
			};
		}
	}

	/**
	 * Launch interactive CLI
	 */
	async launchCLI(): Promise<void> {
		const cli = new ComponentGeneratorCLI();
		await cli.run();
	}

	/**
	 * Get available component types
	 */
	getAvailableTypes(): Array<{
		name: string;
		value: string;
		description: string;
	}> {
		return [
			{
				name: "UI Component",
				value: "ui",
				description: "Reusable UI component (buttons, inputs, etc.)",
			},
			{
				name: "Feature Component",
				value: "feature",
				description: "Business logic component",
			},
			{
				name: "Page Component",
				value: "page",
				description: "Full page component",
			},
			{
				name: "Layout Component",
				value: "layout",
				description: "Layout wrapper component",
			},
		];
	}

	/**
	 * Get available features
	 */
	getAvailableFeatures(): Array<{
		name: string;
		value: string;
		description: string;
	}> {
		return [
			{
				name: "Polish Localization",
				value: "polish-localization",
				description: "Full Polish language support",
			},
			{
				name: "Accessibility (WCAG 2.1 AA)",
				value: "accessibility",
				description: "WCAG 2.1 AA compliance",
			},
			{
				name: "Performance Optimization",
				value: "performance",
				description: "Performance optimizations",
			},
			{
				name: "State Management (Zustand)",
				value: "state-management",
				description: "Zustand state management",
			},
			{
				name: "Form Handling",
				value: "forms",
				description: "Form validation and handling",
			},
			{
				name: "Data Fetching",
				value: "data-fetching",
				description: "API data fetching",
			},
			{
				name: "Error Boundaries",
				value: "error-boundaries",
				description: "Error boundary handling",
			},
			{
				name: "Loading States",
				value: "loading-states",
				description: "Loading state management",
			},
			{
				name: "Animation",
				value: "animation",
				description: "Animation support",
			},
			{
				name: "Dark Mode Support",
				value: "dark-mode",
				description: "Dark mode compatibility",
			},
		];
	}
}

// CLI entry point
async function main() {
	const args = process.argv.slice(2);
	const generator = new ComponentGenerator();

	// Handle CLI arguments
	if (args.includes("--help") || args.includes("-h")) {
		console.log(`
Suplementor Component Generator

Usage:
  node scripts/component-generator/index.js [options]
  node scripts/component-generator/index.js --interactive

Options:
  --help, -h          Show this help message
  --interactive       Launch interactive CLI
  --version           Show version information
  --type <type>       Component type (ui, feature, page, layout)
  --name <name>       Component name (PascalCase)
  --description <desc> Component description
  --author <author>   Author name

Examples:
  # Interactive mode
  node scripts/component-generator/index.js --interactive

  # Programmatic generation
  node scripts/component-generator/index.js --type ui --name MyButton --description "A custom button component"
    `);
		return;
	}

	if (args.includes("--version")) {
		console.log("Component Generator v1.0.0");
		return;
	}

	// Check if we have programmatic generation arguments
	const hasGenerationArgs = args.some(
		(arg) =>
			arg === "--type" ||
			arg === "--name" ||
			arg === "--description" ||
			arg === "--author",
	);

	// Only launch CLI if explicitly requested and no generation arguments
	if (args.includes("--interactive") && !hasGenerationArgs) {
		console.log("Launching interactive CLI...");
		await generator.launchCLI();
		return;
	}

	// If no arguments provided, also launch CLI
	if (args.length === 0) {
		console.log("No arguments provided, launching interactive CLI...");
		await generator.launchCLI();
		return;
	}

	// If we get here, we have generation arguments, so handle generation directly
	console.log("Processing generation arguments...");
	console.log("Arguments:", args);
	console.log("Has generation args:", hasGenerationArgs);

	// If we get here, we have generation arguments, so handle generation directly

	// Parse command line arguments for programmatic generation
	const options: ComponentGeneratorOptions = {
		name: "",
		type: "ui",
		polishLocalization: true, // Enable by default
		accessibility: true, // Enable by default
		performance: true, // Enable by default
	};

	for (let i = 0; i < args.length; i++) {
		const arg = args[i];

		switch (arg) {
			case "--type":
				if (i + 1 < args.length && args[i + 1]) {
					options.type = args[i + 1] as ComponentGeneratorOptions["type"];
					i++; // Skip next iteration since we consumed the value
				}
				break;
			case "--name":
				if (i + 1 < args.length && args[i + 1]) {
					options.name = args[i + 1]!;
					i++; // Skip next iteration since we consumed the value
				}
				break;
			case "--description":
				if (i + 1 < args.length && args[i + 1]) {
					options.description = args[i + 1]!;
					i++; // Skip next iteration since we consumed the value
				}
				break;
			case "--author":
				if (i + 1 < args.length && args[i + 1]) {
					options.author = args[i + 1]!;
					i++; // Skip next iteration since we consumed the value
				}
				break;
		}
	}

	if (!options.name) {
		console.error("❌ Component name is required. Use --name <ComponentName>");
		process.exit(1);
	}

	// Generate component
	console.log("Calling generateComponent with options:", options);
	const result = await generator.generateComponent(options);
	console.log("Generation result:", result);

	if (result.success) {
		console.log(
			`✅ Component generated successfully at: ${result.componentPath}`,
		);
	} else {
		console.error(`❌ Generation failed: ${result.error}`);
		process.exit(1);
	}
}

import { resolve } from "node:path";
// Run CLI if this file is executed directly
import { fileURLToPath } from "node:url";

console.log("Script starting...");
console.log("import.meta.url:", import.meta.url);
console.log("process.argv[1]:", process.argv[1]);

// Normalize paths for comparison
const scriptPath = fileURLToPath(import.meta.url);
const execPath = resolve(process.argv[1] || "");
console.log("Normalized script path:", scriptPath);
console.log("Normalized exec path:", execPath);
console.log("Are they equal?", scriptPath === execPath);

if (scriptPath === execPath) {
	console.log("Running main function...");
	main().catch((error) => {
		console.error("Fatal error:", error);
		process.exit(1);
	});
} else {
	console.log("Not running main - different execution context");
}
