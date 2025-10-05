#!/usr/bin/env node

/**
 * Component Generator CLI
 * Interactive command-line tool for generating React components
 * with Polish localization and TypeScript support
 */

import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { checkbox, confirm, input, select } from "@inquirer/prompts";
import { FileStructureAutomation } from "./file-structure.js";
import { TemplateEngine } from "./template-engine.js";
import type { TemplateContext } from "./template-engine.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);

interface ComponentConfig {
	name: string;
	type: "ui" | "feature" | "page" | "layout";
	description: string;
	author: string;
	features: string[];
	polishLocalization: boolean;
	accessibility: boolean;
	performance: boolean;
	customVariables: Array<{ name: string; value: string }>;
}

class ComponentGeneratorCLI {
	private config: Partial<ComponentConfig> = {};

	async run(): Promise<void> {
		console.log("🚀 Suplementor Component Generator");
		console.log("================================\n");

		try {
			await this.gatherComponentInfo();
			await this.generateComponent();
		} catch (error) {
			console.error(
				"❌ Error:",
				error instanceof Error ? error.message : String(error),
			);
			process.exit(1);
		}
	}

	private async gatherComponentInfo(): Promise<void> {
		// Component name
		this.config.name = await input({
			message: "Component name (PascalCase):",
			validate: (value: string) => {
				if (!value) return "Component name is required";
				if (!/^[A-Z][a-zA-Z0-9]*$/.test(value)) {
					return "Component name must be in PascalCase (e.g., MyComponent)";
				}
				return true;
			},
		});

		// Component type
		this.config.type = await select({
			message: "Component type:",
			choices: [
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
			],
		});

		// Description
		this.config.description = await input({
			message: "Component description:",
			default: `${this.config.name} component for the Suplementor platform`,
		});

		// Author
		this.config.author = await input({
			message: "Author name:",
			default: "Suplementor Team",
		});

		// Features
		this.config.features = await checkbox({
			message: "Select features to include:",
			choices: [
				{ name: "Polish Localization", value: "polish-localization" },
				{ name: "Accessibility (WCAG 2.1 AA)", value: "accessibility" },
				{ name: "Performance Optimization", value: "performance" },
				{ name: "State Management (Zustand)", value: "state-management" },
				{ name: "Form Handling", value: "forms" },
				{ name: "Data Fetching", value: "data-fetching" },
				{ name: "Error Boundaries", value: "error-boundaries" },
				{ name: "Loading States", value: "loading-states" },
				{ name: "Animation", value: "animation" },
				{ name: "Dark Mode Support", value: "dark-mode" },
			],
		});

		// Polish localization
		this.config.polishLocalization =
			(this.config.features || []).includes("polish-localization") ||
			(await confirm({
				message: "Enable Polish localization?",
				default: true,
			}));

		// Accessibility
		this.config.accessibility =
			(this.config.features || []).includes("accessibility") ||
			(await confirm({
				message: "Enable accessibility features?",
				default: true,
			}));

		// Performance
		this.config.performance =
			(this.config.features || []).includes("performance") ||
			(await confirm({
				message: "Enable performance optimizations?",
				default: true,
			}));

		// Custom variables
		const addCustomVars = await confirm({
			message: "Add custom template variables?",
			default: false,
		});

		if (addCustomVars) {
			this.config.customVariables = await this.gatherCustomVariables();
		}
	}

	private async gatherCustomVariables(): Promise<
		Array<{ name: string; value: string }>
	> {
		const variables: Array<{ name: string; value: string }> = [];

		console.log("\n📝 Custom Variables");
		console.log("Add custom variables that will be available in templates.");
		console.log("Example: API_ENDPOINT -> https://api.example.com\n");

		let addMore = true;
		while (addMore) {
			const name = await input({
				message: "Variable name (UPPER_SNAKE_CASE):",
				validate: (value: string) => {
					if (!value) return "Variable name is required";
					if (!/^[A-Z][A-Z0-9_]*$/.test(value)) {
						return "Variable name must be in UPPER_SNAKE_CASE";
					}
					return true;
				},
			});

			const value = await input({
				message: `Value for ${name}:`,
			});

			variables.push({ name, value });

			addMore = await confirm({
				message: "Add another custom variable?",
				default: false,
			});
		}

		return variables;
	}

	private async generateComponent(): Promise<void> {
		if (!this.config.name || !this.config.type) {
			throw new Error("Component configuration is incomplete");
		}

		console.log("\n🔧 Generating component...");

		// Create template context
		const context: TemplateContext = {
			componentName: this.config.name,
			componentType: this.config.type,
			description: this.config.description || "",
			author: this.config.author || "",
			features: this.config.features || [],
			polishLocalization: this.config.polishLocalization || false,
			accessibility: this.config.accessibility || false,
			performance: this.config.performance || false,
			variables: this.config.customVariables || [],
		};

		// Initialize automation
		const fileAutomation = new FileStructureAutomation(context);

		// Get default structure for component type
		const defaultStructure = fileAutomation.getDefaultStructure(
			this.config.type,
		);

		// Create complete structure
		const componentStructure = {
			componentName: this.config.name,
			...defaultStructure,
		};

		// Validate structure
		const validation = fileAutomation.validateStructure(componentStructure);
		if (!validation.valid) {
			console.error("❌ Validation errors:");
			validation.errors.forEach((error) => console.error(`  - ${error}`));
			throw new Error("Component structure validation failed");
		}

		// Generate files
		await fileAutomation.createComponentStructure(componentStructure);

		console.log("\n✅ Component generation completed successfully!");
		console.log(
			`\n📁 Component location: ${componentStructure.basePath}/${this.config.name}`,
		);
		console.log("\n📋 Generated files:");
		componentStructure.templates.forEach((template) => {
			const fileName = this.getGeneratedFileName(
				template.name,
				this.config.name!,
				template.extension,
			);
			console.log(`  • ${fileName}`);
		});

		if (this.config.polishLocalization) {
			console.log("\n🇵🇱 Polish localization enabled");
			console.log("  • Medical terminology validation included");
			console.log("  • Polish character support (ą, ć, ę, ł, ń, ó, ś, ź, ż)");
			console.log("  • EU regulatory compliance");
		}

		if (this.config.accessibility) {
			console.log("\n♿ Accessibility features enabled");
			console.log("  • WCAG 2.1 AA compliance");
			console.log("  • Screen reader support");
			console.log("  • Keyboard navigation");
		}

		console.log("\n🎉 Component is ready to use!");
		console.log("\n💡 Next steps:");
		console.log(
			`  1. Import the component: import { ${this.config.name} } from '@/components/${this.config.type === "ui" ? "ui/" : ""}${this.config.name}';`,
		);
		console.log("  2. Add to your page/component");
		console.log("  3. Customize the implementation as needed");
		if (this.config.features?.includes("polish-localization")) {
			console.log("  4. Add Polish translations to your localization files");
		}
	}

	private getGeneratedFileName(
		templateName: string,
		componentName: string,
		extension: string,
	): string {
		switch (templateName) {
			case "index":
				return `index.${extension}`;
			case "component":
				return `${componentName}.${extension}`;
			case "test":
				return `${componentName}.test.${extension}`;
			case "stories":
				return `${componentName}.stories.${extension}`;
			case "types":
				return `types.${extension}`;
			default:
				return `${templateName}.${extension}`;
		}
	}
}

// Export for use in other modules
export { ComponentGeneratorCLI };

// CLI entry point
async function main() {
	const generator = new ComponentGeneratorCLI();
	await generator.run();
}

// Only run main if this file is executed directly, not when imported
if (import.meta.url === `file://${process.argv[1]}`) {
	// Handle CLI arguments
	const args = process.argv.slice(2);
	if (args.includes("--help") || args.includes("-h")) {
		console.log(`
Suplementor Component Generator

Usage: node scripts/component-generator/cli.js [options]

Options:
  --help, -h    Show this help message
  --version     Show version information

Examples:
  node scripts/component-generator/cli.js
    `);
		process.exit(0);
	}

	if (args.includes("--version")) {
		const packageJson = JSON.parse(
			readFileSync(join(__dirname, "../../package.json"), "utf8"),
		);
		console.log(`Component Generator v${packageJson.version}`);
		process.exit(0);
	}

	// Run CLI
	main().catch((error) => {
		console.error("Fatal error:", error);
		process.exit(1);
	});
}
